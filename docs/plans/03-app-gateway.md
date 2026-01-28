# Phase 3: Integration & App Gateway

This document explains the architecture of the application layer and how it interacts with the Hyperledger Besu network.

## 🌉 Gateway Layer (`app/gateway/`)
The Gateway acts as a bridge between the business logic and the blockchain. It uses **Ethers.js** to communicate with the Besu RPC nodes.

### Key Components:
- **`connection.js`**: Manages the `JsonRpcProvider` and `Contract` instances. It automatically loads ABIs from the Hardhat build artifacts.
- **Failover**: Configured to point to `node1` but can be easily pointed to any node in the 4-node cluster.

## 👛 Wallet Management (`app/wallet/`)
Since this is a private network MVP, we simulate user identities locally.

### Key Components:
- **`wallet-manager.js`**: Handles account generation and funding.
- **Simulated Roles**: 
  - **Admin**: The owner of the contracts (Node 1 identity), responsible for minting and system setup.
  - **Buyer/Seller**: Dynamic identities generated for the session, funded with ETH (for gas) by the Admin.

## 🧪 Verification Utility
The `app/scripts/init-demo.js` utility serves to bootstrap a clean state for testing, ensuring that identities are created, funded, and loaded with the initial `IbnAsset` balance.
