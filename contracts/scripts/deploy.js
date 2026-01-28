const pkg = require("hardhat");
const { ethers } = pkg;

async function main() {
    const [deployer] = await ethers.getSigners();
    const deployerAddress = await deployer.getAddress();

    console.log("🚀 Deploying contracts with the account:", deployerAddress);
    console.log("💰 Account balance:", (await ethers.provider.getBalance(deployerAddress)).toString());

    // 1. Deploy IbnAsset
    console.log("\n📦 Deploying IbnAsset...");
    const IbnAsset = await ethers.getContractFactory("IbnAsset");
    const asset = await IbnAsset.deploy("IBN Asset", "IBNA", deployerAddress);
    await asset.waitForDeployment();
    const assetAddress = await asset.getAddress();
    console.log("✅ IbnAsset deployed to:", assetAddress);

    // 2. Deploy Settlement
    console.log("\n📦 Deploying Settlement...");
    const Settlement = await ethers.getContractFactory("Settlement");
    const settlement = await Settlement.deploy(assetAddress, deployerAddress);
    await settlement.waitForDeployment();
    const settlementAddress = await settlement.getAddress();
    console.log("✅ Settlement deployed to:", settlementAddress);

    console.log("\n✨ Deployment Summary:");
    console.log("-----------------------");
    console.log("IbnAsset:  ", assetAddress);
    console.log("Settlement:", settlementAddress);
    console.log("-----------------------");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
