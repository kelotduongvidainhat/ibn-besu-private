import { walletManager } from "../wallet/wallet-manager.js";
import { connection } from "../gateway/connection.js";
import { ethers } from "ethers";

async function initDemo() {
    try {
        console.log("🚀 Initializing MVP Demo State...");

        // 1. Create Identities
        const buyer = walletManager.getOrCreateWallet("Buyer");
        const seller = walletManager.getOrCreateWallet("Seller");

        console.log(`👤 Buyer: ${buyer.address}`);
        console.log(`👤 Seller: ${seller.address}`);

        // 2. Fund them with ETH for gas
        await walletManager.fundWallet("Buyer", "1.0");
        await walletManager.fundWallet("Seller", "1.0");

        // 3. Mint IbnAssets to Buyer (Admin only operation)
        const asset = connection.getIbnAssetContract();
        const mintAmount = ethers.parseEther("1000");

        console.log(`💎 Minting ${ethers.formatEther(mintAmount)} IBNA to Buyer...`);
        const tx = await asset.mint(buyer.address, mintAmount);
        await tx.wait();
        console.log(`✅ Minting complete. Tx: ${tx.hash}`);

        // 4. Verification Check
        const buyerBalance = await asset.balanceOf(buyer.address);
        console.log(`📈 Buyer Balance: ${ethers.formatEther(buyerBalance)} IBNA`);

        console.log("\n✨ Demo Initialization SUCCESSFUL");

    } catch (error) {
        console.error("💥 Demo Initialization FAILED:");
        console.error(error);
        process.exit(1);
    }
}

initDemo();
