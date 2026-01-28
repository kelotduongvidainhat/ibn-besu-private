# Fintech Blockchain Sandbox: ibn-besu-private

## 1. Core Objective
To build a robust, **Private Blockchain Sandbox** based on Hyperledger Besu for Fintech students. The system enables hands-on experience in Smart Contract development and Web3 application building without real-world costs, ensuring high availability and data persistence across multiple semesters.

## 2. Technical Stack

### A. Infrastructure Layer
- **Operating System**: WSL Ubuntu.
- **Platform**: Hyperledger Besu v25.x.x (2026 Stable Release).
- **Consensus Mechanism**: QBFT (Quorum Byzantine Fault Tolerance) with a 4-node validator setup for transparency and fault tolerance.
- **Genesis Configuration**: Modern EVM compatibility (activated petersburgBlock, istanbulBlock, etc.) with a custom `chainId: 1337`. Pre-allocated balances (e.g., 200 ETH) assigned to specific development wallets.

### B. Development & Tooling Layer
- **Framework**: Hardhat (standardized on CommonJS for maximum plugin stability).
- **Libraries**:
  - **OpenZeppelin 5.x**: Industry-standard secure contract templates.
  - **Dotenv**: Automated secret management for Private Keys via `.env` files.
  - **Hardhat Toolbox**: Integrated suite for Testing, Gas Reporting, and Solidity Coverage.

### C. Application & Integration Layer
- **Smart Contracts**: Use cases focused on Asset Registry (`IbnAsset.sol`) and business logic orchestration (`Settlement.sol`).
- **Connectivity**: Support for JSON-RPC over HTTP.
- **Backend Integration**: Automated ABI and Artifact extraction logic to bridge Blockchain data with Node.js applications.

## 3. Operational Workflow

### Administrator Phase (Your Role):
1. **Deploy**: Use Docker Compose to launch the 4-node cluster.
2. **Initialize**: Manage the Genesis file and node identities.
3. **Expose**: Provide students with RPC endpoints (e.g., `http://localhost:8545`).

### Student Phase (Development):
1. **Connect**: Link MetaMask or Remix IDE to the provided RPC endpoint.
2. **Develop**: Use the provided Hardhat environment to write and compile contracts.
3. **Validate**: Execute unit tests in the `contracts/tests/` directory.

### Evaluation Phase (Grading):
1. **Verify**: Teachers verify student work by querying real-time on-chain evidence.
2. **Audit**: The network maintains a permanent ledger for historical performance tracking.

## 4. Key Technical Requirements
- **Future-Proofing**: Full EVM compatibility for the latest Solidity features.
- **Automation**: Minimal manual configuration for students through automated `.env` files and ABI helper scripts.
- **Stability**: Use of CommonJS to eliminate dependency conflicts between modern Web3 libraries.

---
*Created as part of the IBN FinTech Education Series.*
