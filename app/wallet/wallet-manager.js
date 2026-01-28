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
     * For the MVP, we use the aliases to deterministic derive keys or 
     * just generate new ones for the session.
     */
    getOrCreateWallet(alias) {
        if (this.wallets.has(alias)) {
            return this.wallets.get(alias);
        }

        // Creating a random wallet for the MVP session
        const wallet = ethers.Wallet.createRandom().connect(this.provider);
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
    }
}

export const walletManager = new WalletManager();
