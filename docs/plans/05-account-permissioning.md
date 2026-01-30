# Account Permissioning Report & Strategy

This document details the selection, implementation, and adaptation of the Account Permissioning system for the Imperial Virtual Lab (Besu Private Network).

## 1. Executive Summary
After careful diagnostic testing and version analysis of Hyperledger Besu **v25.12.0**, we have pivoted from a **Protocol-Level** (Besu Ingress) strategy to an **Application-Level** (Imperial Gateway) strategy. This ensures maximum stability while achieving the core goal: restricting network interaction to authorized students.

## 2. Technical Context (The v25 Discovery)
In our "New Order" research, we identified that:
- **Legacy Ingress Contracts** (Permissions v1) used flags like `--permissions-accounts-contract-enabled`.
- **Besu v25.6.0+** has officially sunset/removed these native flags to favor a more modular Plugin API.
- **Decision**: To avoid the fragility of custom JAR plugin management in a sandbox environment, we utilize a Hybrid Security model.

## 3. The "Imperial Gateway" Strategy

### A. The Source of Truth: `AccountAllowlist.sol`
We have deployed an on-chain contract at `0xf1F7A697BC8d1Ca73d136f73755b0383C10A61C8`.
- It maintains a mapping: `address => bool isAllowed`.
- Controlled by an `onlyOwner` modifier (Teacher/Admin).
- Transactions are documented on-chain, providing an audit trail of who was granted access.

### B. Backend Enforcement (The Gatekeeper)
The Node.js backend (`app/server.js`) acts as the network proxy:
1. **Registration Flow**: When a student is created in the database, they are automatically sent to the `AccountAllowlist` contract to be whitelisted.
2. **Transaction Middleware**: Every sensitive API call (Claim, Submit, Transfer) checks the contract status.
   - If `contract.isAllowed(address)` is `false`, the request is rejected with `403 Forbidden`.

### C. Frontend Visibility (The Shield)
The Admin Dashboard and Student Portal reflect this state:
- **Admin**: Can see "Validated" (Green Shield) or "Blocked" (Red Shield) statuses for every MSSV.
- **Student**: Unauthorized students see a "Restricted Access" overlay, preventing them from accessing the Faucet or Submission areas.

## 4. Key Lessons (The "New Order" of Knowledge)
- **Version Sensitivity**: Enterprise blockchain documentation lag is significant. Always probe the binary help flags (`besu --help`) before committing to a protocol configuration.
- **Decoupling vs. Integrity**: Application-level security is often safer and cheaper to maintain than Protocol-level security in a development/educational lab, provided the Gateway remains the primary access point for students.

## 5. Security Status
- **On-chain Contract**: DEPLOYED
- **Admin Management**: ACTIVE (Teacher can whitelist/block via UI)
- **Besu Protocol**: NATIVE (Unrestricted to facilitate faster development debugging)
