# Architecture: Simplified ETH Economy

This document outlines the design decisions and implementation of the Pure ETH Economy model for the Imperial Virtual Lab.

## 1. Context
Previously, the lab used a custom ERC-20 token (**IBNA**) for student rewards. While functionally sound, this added a layer of abstraction that was often confusing for students who were just beginning to learn about blockchain gas, native currency, and transaction lifecycle.

## 2. The Decision: Native ETH Only
In February 2026, we transitioned to a **Native ETH Only** model. 
- **Goal**: To simplify the user experience and align with industry standards where "Gas = Currency" on private networks.
- **Outcome**: The IBNA token has been fully deprecated.

## 3. Implementation Details

### A. Genesis Pre-allocation
The `genesis.json` has been updated to fund the **Admin (Instructor)** account with **10,000,000 ETH**. This ensures the "Central Bank" of the lab never runs dry, even with frequent daily reward claims.

### B. Automated Funding (Faucet)
The logic in the Imperial Gateway (`app/server.js`) has been updated:
1.  **Welcome Bonus**: New students automatically receive **100 ETH** upon registration (up from 1 ETH).
2.  **Daily Rewards**: The manual "Claim" button now transfers **50 ETH** directly from the Admin wallet to the student wallet.

### C. Backend Logic Changes
- **Balance Queries**: The system now uses standard `eth_getBalance` instead of calling a `balanceOf` function on an ERC-20 contract.
- **Security Check**: The balance route is secured and returns formatted ETH values to the Frontend.

## 4. Benefits
- **Zero Configuration**: Students can see their "money" in MetaMask immediately without having to "Import Token" or track custom contract addresses.
- **Gas Visibility**: Students learn that every transaction costs gas, and the currency they use to pay for gas is the same currency they receive as rewards.
- **Reduced Friction**: Removes the need for students to interact with the `IbnAsset.sol` contract before they are ready to write their own code.

## 5. Deployment Status
- **Status**: **ACTIVE**
- **Deprecation**: IBN token contract addresses have been removed from the environment.
