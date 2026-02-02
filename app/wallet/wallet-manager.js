import { ethers } from "ethers";
import { connection } from "../gateway/connection.js";

/**
 * WalletManager simulates a fleet of user wallets for the MVP.
 * It provides easy access to pre-generated or on-the-fly accounts.
 */
class WalletManager {
    constructor() {
        this.provider = connection.provider;
        this.wallets = new Map();
    }

    /**
     * Creates or retrieves a wallet by a simple alias (e.g., "Buyer", "Seller").
     * 
     * TODO: In production, change this to a dynamic integration with a 
     * real KMS (Key Management Service) or secure vault. For the MVP, 
     * we use deterministic derivation to ensure consistency across separate script runs.
     */
    getOrCreateWallet(alias) {
        if (this.wallets.has(alias)) {
            return this.wallets.get(alias);
        }

        // Deterministic seed based on alias to ensure a script run today 
        // uses the same address as a script run tomorrow.
        const seed = ethers.keccak256(ethers.toUtf8Bytes(alias));
        const wallet = new ethers.Wallet(seed, this.provider);

        this.wallets.set(alias, wallet);
        return wallet;
    }

    /**
     * Helper to fund a wallet from the Admin account.
     */
    async fundWallet(alias, amountEth = "10.0") {
        const targetWallet = this.getOrCreateWallet(alias);
        const admin = connection.adminWallet;

        console.log(`💸 Funding ${alias} (${targetWallet.address}) with ${amountEth} ETH...`);

        const tx = await admin.sendTransaction({
            to: targetWallet.address,
            value: ethers.parseEther(amountEth)
        });

        await tx.wait();
        console.log(`✅ ${alias} funded. Tx: ${tx.hash}`);
        return tx;
    }
}

export const walletManager = new WalletManager();
