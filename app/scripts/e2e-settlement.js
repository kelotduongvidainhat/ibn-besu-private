import { walletManager } from "../wallet/wallet-manager.js";
import { connection } from "../gateway/connection.js";
import { ethers } from "ethers";

async function e2eSettlement() {
    try {
        console.log("🏁 Starting E2E Settlement Scenario...");

        // 1. Setup Identities
        const buyer = walletManager.getOrCreateWallet("Buyer");
        const seller = walletManager.getOrCreateWallet("Seller");
        const amountToSettle = ethers.parseEther("500");

        console.log(`\n🔹 Initial State:`);
        const asset = connection.getIbnAssetContract();
        console.log(`   Buyer (${buyer.address}) Balance: ${ethers.formatEther(await asset.balanceOf(buyer.address))} IBNA`);
        console.log(`   Seller (${seller.address}) Balance: ${ethers.formatEther(await asset.balanceOf(seller.address))} IBNA`);

        // 2. Buyer Approves Settlement Contract
        console.log(`\n✍️  Buyer is approving Settlement contract to spend ${ethers.formatEther(amountToSettle)} IBNA...`);
        const assetAsBuyer = connection.getIbnAssetContract(buyer);
        const approveTx = await assetAsBuyer.approve(process.env.SETTLEMENT_ADDRESS, amountToSettle);
        await approveTx.wait();
        console.log(`   ✅ Approval Success. Tx: ${approveTx.hash}`);

        // 3. Process Settlement
        console.log(`\n🏦 Processing Settlement via contract...`);
        const settlementAsBuyer = connection.getSettlementContract(buyer);
        const settlementTx = await settlementAsBuyer.processSettlement(seller.address, amountToSettle);
        await settlementTx.wait();
        console.log(`   ✅ Settlement Success. Tx: ${settlementTx.hash}`);

        // 4. Final Audit
        console.log(`\n🔹 Final State:`);
        const finalBuyerBal = await asset.balanceOf(buyer.address);
        const finalSellerBal = await asset.balanceOf(seller.address);
        console.log(`   Buyer Balance: ${ethers.formatEther(finalBuyerBal)} IBNA`);
        console.log(`   Seller Balance: ${ethers.formatEther(finalSellerBal)} IBNA`);

        if (ethers.formatEther(finalBuyerBal) === "500.0" && ethers.formatEther(finalSellerBal) === "500.0") {
            console.log("\n🎉 E2E SETTLEMENT VERIFIED: SUCCESS");
        } else {
            console.error("\n❌ E2E SETTLEMENT VERIFIED: FAILED (Balance mismatch)");
        }

    } catch (error) {
        console.error("\n💥 E2E Scenario FAILED:");
        console.error(error);
        process.exit(1);
    }
}

e2eSettlement();
