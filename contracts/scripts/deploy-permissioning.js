const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying AccountAllowlist with the account:", deployer.address);

    const AccountAllowlist = await hre.ethers.getContractFactory("AccountAllowlist");
    // The deployer will be the initial owner and will be whitelisted
    const allowlist = await AccountAllowlist.deploy(deployer.address);

    await allowlist.waitForDeployment();

    const address = await allowlist.getAddress();
    console.log("AccountAllowlist deployed to:", address);

    // Verify status of deployer
    const status = await allowlist.isAllowed(deployer.address);
    console.log("Deployer whitelisted status:", status);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
