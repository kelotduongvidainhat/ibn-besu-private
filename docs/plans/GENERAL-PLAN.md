# General MVP Implementation Plan

This document outlines the high-level roadmap for the **ibn-besu-private** project, a continuation and evolution of the `ibn-fabric` stack onto Hyperledger Besu.

## Phase 1: Infrastructure & Foundation
- [x] Initialize project structure and documentation.
- [x] Setup 4-node QBFT network with Docker Compose.
- [x] Implement key generation and genesis block configuration.
- [x] Verify network health and block production.

## Phase 2: Core Logic (Smart Contracts)
- [x] Setup development environment (Hardhat/Foundry).
- [x] Develop `IbnAsset.sol` (Resource tokenization).
- [x] Develop `Settlement.sol` (Business logic).
- [x] Implement unit tests and coverage checks.

## Phase 3: Integration (App Gateway)
- [x] Build the Gateway middleware using Ethers.js.
- [x] Implement MVP Wallet simulation for account management.
- [x] Connect application layer to the Besu RPC nodes.

## Phase 4: Validation & MVP Completion
- [x] End-to-end testing of the full stack.
- [x] Document common errors and operational procedures.
- [x] Final project summary and knowledge transfer.

## Phase 5: Visibility & Monitoring
- [x] Deploy a local Block Explorer (Sirato/BlockScout).
- [x] Configure real-time metrics (Prometheus/Grafana).
- [x] Implement Web3 event listening via WebSockets.
## Phase 6: Management Portal (The Virtual Lab)
- [x] Initialize Backend Server (Express/Node.js).
- [x] Connect Database (PostgreSQL/SQLite) for Class Management.
- [ ] Build Admin Dashboard (Teacher: Class/Classroom management).
- [x] Build Student Portal (Identity receipt & Submission status).
- [ ] Implement Automated Grading (On-chain monitoring).

## Phase 7: Network Security & Permissioning
- [x] Deploy `AccountAllowlist.sol` Smart Contract.
- [x] Implement "Imperial Gateway" Application-level Gatekeeper.
- [x] Integrate Permissioning status into Admin Dashboard.
- [x] Document v25 configuration constraints.

---
### 📚 Detailed Vision
For the full business logic and architecture of the "Virtual Lab," please refer to:
[VIRTUAL-LAB-VISION.md](./VIRTUAL-LAB-VISION.md)
