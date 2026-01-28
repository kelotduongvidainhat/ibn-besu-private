require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.24",
    paths: {
        sources: "./src",
        tests: "./tests",
        cache: "./cache",
        artifacts: "./artifacts",
    },
    networks: {
        besu: {
            url: "http://localhost:8545",
            accounts: [process.env.PRIVATE_KEY],
        },
    },
};
