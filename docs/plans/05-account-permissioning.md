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
We have deployed an on-chain contract at `0x509b672ab6b42d1bf0688ef3eed80ab4e0384c05`.
- It maintains a mapping: `address => bool isAllowed`.
- Controlled by an `onlyOwner` modifier (Teacher/Admin).
- Transactions are documented on-chain, providing an audit trail of who was granted access.

### B. Backend Enforcement (The Gatekeeper)
The Node.js backend (`app/server.js`) acts as the network proxy:
1. **Registration Flow**: When a student is created in the database, they are automatically sent to the `AccountAllowlist` contract to be whitelisted.
2. **Transaction Middleware**: Every sensitive API call (Claim, Submit, Transfer) checks the contract status.
3. **Identity-Aware RPC Proxy**: We implemented a secure JSON-RPC proxy at `/api/rpc/:mssv`. This allows external tools like **Remix** and **MetaMask** to connect securely. All raw JSON-RPC requests are gated by the `checkPermission` middleware.

### C. Network Isolation (The "Iron Shield")
To prevent students from bypassing the gateway:
- **Port Isolation**: Public Host ports `8545-8549` have been removed from `docker-compose.yml`.
- **Docker Stealth**: Besu nodes are only accessible from within the internal `besu-net` Docker network. 
- **Exclusive Bridge**: The containerized Backend API is the unique bridge between the public web and the private blockchain network.

### D. The "Public View" Gateway (RPC Proxy)
To maintain the functionality of public tools like the **Blockchain Explorer** without exposing the nodes, we implemented a read-only Public RPC Proxy at `/api/rpc/public`.
- **Whitelisted Methods**: Only safe, non-mutating methods (e.g., `eth_blockNumber`, `eth_getTransactionByHash`) are allowed.
- **Access Control**: Publicly reachable, but blocks all administrative or transaction-signing commands.
- **Anonymity**: Allows the Explorer to query blocks without requiring student authentication.

## 4. Key Lessons (The "New Order" of Knowledge)
- **Layered Defense**: Security is strongest when it combines On-Chain Logic (Ownership), Application-Layer Logic (Middleware), and Network-Layer Isolation (Port Blocking).
- **Tool Compatibility**: By providing a Secure RPC Proxy, we maintain compatibility with the Ethereum ecosystem (Remix, MetaMask) while keeping the private network hidden from direct exposure.

## 5. Security Status
- **On-chain Contract**: DEPLOYED
- **Admin Management**: ACTIVE (Teacher can whitelist/block via UI)
- **Network Access**: **HARDENED** (Isolated via Iron Shield)
- **RPC Gateway**: **SECURE** (Identity-aware proxy enabled)
