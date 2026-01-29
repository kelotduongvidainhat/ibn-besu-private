import { connection } from "../gateway/connection.js";
import { ethers } from "ethers";

async function listenEvents() {
    console.log("⚡ Connecting to WebSocket for live event tracking...");

    const wsProvider = connection.getWebSocketProvider();
    const asset = connection.getIbnAssetContract(wsProvider);
    const settlement = connection.getSettlementContract(wsProvider);

    console.log("📡 Listening for IBNA Transfers and Settlement events...\n");

    // Listen for ERC-20 Transfer events
    asset.on("Transfer", (from, to, amount, event) => {
        console.log(`[TRANSFER] 💎 ${ethers.formatEther(amount)} IBNA moved:`);
        console.log(`   From: ${from}`);
        console.log(`   To:   ${to}`);
        console.log(`   Hash: ${event.log.transactionHash}\n`);
    });

    // Listen for Settlement Success events
    settlement.on("SettlementProcessed", (buyer, seller, amount, event) => {
        console.log(`[BUSINESS] 🏦 SETTLEMENT SUCCESSFUL:`);
        console.log(`   Buyer:  ${buyer}`);
        console.log(`   Seller: ${seller}`);
        console.log(`   Value:  ${ethers.formatEther(amount)} IBNA`);
        console.log(`   Hash:   ${event.log.transactionHash}\n`);
    });

    // Handle process interruption
    process.on("SIGINT", () => {
        console.log("\n🔌 Disconnecting WebSocket...");
        wsProvider.destroy();
        process.exit();
    });
}

listenEvents().catch((error) => {
    console.error("💥 Listener Error:", error);
});
