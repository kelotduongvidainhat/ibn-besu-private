import { connection } from "./connection.js";
import { ethers } from "ethers";

async function smokeTest() {
    try {
        console.log("🔍 Starting Gateway Smoke Test...");

        // 1. Check Connection
        const network = await connection.provider.getNetwork();
        console.log(`✅ Connected to Chain ID: ${network.chainId}`);

        // 2. Query IbnAsset
        const asset = connection.getIbnAssetContract();
        const name = await asset.name();
        const symbol = await asset.symbol();
        const totalSupply = await asset.totalSupply();
        console.log(`💎 IbnAsset: ${name} (${symbol})`);
        console.log(`📊 Total Supply: ${ethers.formatEther(totalSupply)} tokens`);

        // 3. Query Settlement
        const settlement = connection.getSettlementContract();
        const assetInSettlement = await settlement.asset();
        console.log(`🏛️ Settlement linked to asset: ${assetInSettlement}`);

        if (assetInSettlement.toLowerCase() === (await asset.getAddress()).toLowerCase()) {
            console.log("✨ Linkage Verification: SUCCESS");
        } else {
            console.warn("❌ Linkage Verification: FAILED");
        }

    } catch (error) {
        console.error("💥 Smoke Test FAILED:");
        console.error(error);
        process.exit(1);
    }
}

smokeTest();
