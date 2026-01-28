const { expect } = require("chai");
const pkg = require("hardhat");
const { ethers } = pkg;

describe("IBN MVP Contracts", function () {
    let IbnAsset, Settlement;
    let asset, settlement;
    let owner, userA, userB;

    beforeEach(async function () {
        [owner, userA, userB] = await ethers.getSigners();

        // Deploy IbnAsset
        const IbnAssetFactory = await ethers.getContractFactory("IbnAsset");
        asset = await IbnAssetFactory.deploy("IBN Asset", "IBNA", owner.address);
        // In ethers v6, we don't need .deployed(), the promise resolves to the contract instance

        // Deploy Settlement
        const SettlementFactory = await ethers.getContractFactory("Settlement");
        settlement = await SettlementFactory.deploy(await asset.getAddress(), owner.address);
    });

    describe("IbnAsset", function () {
        it("Should allow owner to mint tokens", async function () {
            const amount = ethers.parseEther("100");
            await asset.mint(userA.address, amount);
            expect(await asset.balanceOf(userA.address)).to.equal(amount);
        });

        it("Should reject minting from non-owner", async function () {
            const amount = ethers.parseEther("100");
            await expect(
                asset.connect(userA).mint(userA.address, amount)
            ).to.be.revertedWithCustomError(asset, "OwnableUnauthorizedAccount");
        });
    });

    describe("Settlement", function () {
        it("Should process settlement correctly", async function () {
            const amount = ethers.parseEther("50");

            // 1. Mint to userA
            await asset.mint(userA.address, amount);

            // 2. userA approves Settlement contract
            await asset.connect(userA).approve(await settlement.getAddress(), amount);

            // 3. Process settlement (UserA -> UserB via Settlement contract)
            await expect(settlement.connect(userA).processSettlement(userB.address, amount))
                .to.emit(settlement, "SettlementProcessed")
                .withArgs(userA.address, userB.address, amount);

            // 4. Verify balances
            expect(await asset.balanceOf(userA.address)).to.equal(0);
            expect(await asset.balanceOf(userB.address)).to.equal(amount);
        });

        it("Should fail if amount is not approved", async function () {
            const amount = ethers.parseEther("50");
            await asset.mint(userA.address, amount);

            // No approval given
            await expect(
                settlement.connect(userA).processSettlement(userB.address, amount)
            ).to.be.reverted;
        });
    });
});
