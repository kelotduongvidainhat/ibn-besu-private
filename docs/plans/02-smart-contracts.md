# Phase 2: Smart Contract Design

This document details the design and implementation of the smart contracts for the **ibn-besu-private** MVP.

## 🔗 IbnAsset.sol (Asset Tokenization)
A generic ERC-20 token used to represent value or resources within the private consortium.

### Components:
- **Standard**: ERC-20.
- **Extensions**:
  - `ERC20Permit`: Enables gasless approvals for better user experience in the future.
  - `Ownable`: Restricts minting capabilities to the consortium administrator.
- **Functions**:
  - `mint(address to, uint256 amount)`: Restricted to the contract owner. Used to inject assets into the network.

## 📜 Settlement.sol (Business Logic)
Manages the orchestration of asset movement between participants.

### Components:
- **Dependency**: Linked to an instance of `IbnAsset`.
- **Functions**:
  - `processSettlement(address receiver, uint256 amount)`: 
    - Transfers tokens from `msg.sender` to `receiver`.
    - Requires the sender to have called `approve` on the `IbnAsset` contract beforehand.
- **Events**:
  - `SettlementProcessed(sender, receiver, amount)`: Provides an immutable audit trail of all settlements.

## 🛠️ Testing Strategy
Unit tests are located in `contracts/tests/MVP.test.js` and cover:
1. Ownership and minting restrictions.
2. Successful settlement with approval flow.
3. Failure modes for unauthorized minting and insufficient allowance.
