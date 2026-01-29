# 📑 Project Specification: "Virtual Blockchain Lab"

## 1. Context & Pain Points
In the university Fintech/Blockchain education environment:
*   **Problem 1:** Using **Public Networks** (Ethereum Mainnet/Testnet) incurs gas fees, depends on scarce faucets, and makes managing student identities difficult.
*   **Problem 2:** Using **Local Simulators** (like Ganache on individual machines) lacks the realism of a Peer-to-Peer (P2P) network, and prevents teachers from centralizing the assessment of students' work.
*   **Solution:** A university-managed centralized **Private Blockchain (Hyperledger Besu)** network, integrated with a **Web Application** to manage classes, allocate resources, and monitor student progress.

## 2. High-Level Architecture
The system is divided into 3 tightly integrated layers:

### A. Blockchain Layer (Infrastructure - Hyperledger Besu)
- The "Single Source of Truth" for storing results and executing Smart Contracts.
- Validator Nodes running the **QBFT consensus** (fast, no mining required).
- Managed exclusively by the instructor via Docker.
- Provides RPC/WS endpoints for external connectivity.

### B. Application Layer (Deep Sea Virtual Lab)
- Acts as the "Bridge" and "Classroom Manager" with a high-contrast dark theme.
- **Identity Management**: Mapping Student IDs $\leftrightarrow$ Blockchain Wallets (0x...).
- **Resource Allocation**: Automatic wallet generation and provisioning (funding).
- **Daily Rewards**: Gamified faucet (100 IBNA/day) to encourage daily engagement.
- **Live Asset Monitoring**: Real-time balance tracking for all students in the Admin Manifest.
- **Visualization**: Teacher Dashboards, Class summaries, and grading lists.

### C. Client Tools Layer (Standard Practice Environment)
- Students use industry-standard tools: **Remix IDE, VS Code, and MetaMask.**
- Direct connection to the University RPC to deploy and test code.

## 3. Core Business Workflows (User Stories)

### For Teachers (Admin):
- **Setup**: Bootstrap and maintain the Besu network using Docker.
- **Class Ops**: Create new classes and import student manifests on the Web Portal.
- **Permissioning**: Automatically whitelist student wallets to allow network interaction.
- **Supervision**: Audit deployed student contracts and verify on-chain logic.

### For Students (Users):
- **Identity Retrieval**: Log in to the Portal $\rightarrow$ Receive unique Private Keys/Credentials for the semester.
- **Development Phase**:
    - Configure Remix/MetaMask with the university network and their assigned key.
    - Write and deploy Solidity Smart Contracts to the private cluster.
- **Automated Submission**:
    - Submit by calling a specific `submit()` function on-chain.
    - Or, the Web App scans the ledger to automatically mark the assignment as "Done."

## 4. Critical Technical Requirements
- **Account Management**: Automated keypair generation. Secure one-time delivery of Private Keys to students.
- **Permissioning**: Restricted network access to authorized students only. Time-gated deployment permissions (e.g., closing submissions after a deadline).
- **Hybrid Data Storage**:
    - **Off-chain (Database)**: Student names, IDs, Web logs, performance scores.
    - **On-chain (Besu)**: Transaction hashes, Contract addresses, balances, and Event logs.

---

## 🧠 Project Mindmap
- **Root: Virtual Besu Blockchain Lab**
    - **Teacher**: Docker Ops, Class Creation, Permissioning, Reports/Grading.
    - **Student**: App Login, Receive Private Key, Remix/VS Code Usage, Deployment.
    - **App System**: Frontend (React/Vue), Backend (Node.js), DB (PostgreSQL/SQLite), Library (Ethers.js).
    - **Blockchain System**: Hyperledger Besu, QBFT Consensus, RPC/WS Nodes, Monitoring & Explorer.
