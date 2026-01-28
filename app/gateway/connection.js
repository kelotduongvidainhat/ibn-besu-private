import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to ABIs (climbing up from app/gateway/ to contracts/artifacts/)
const ARTIFACTS_PATH = path.resolve(__dirname, "../../contracts/artifacts/src");

class ConnectionManager {
    constructor() {
        this.provider = new ethers.JsonRpcProvider(process.env.BESU_NODE1_URL);
        this.adminWallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, this.provider);
    }

    /**
     * Loads the ABI from Hardhat artifacts.
     */
    getABI(contractName) {
        const filePath = path.join(ARTIFACTS_PATH, `${contractName}.sol`, `${contractName}.json`);
        const fileContent = fs.readFileSync(filePath, "utf8");
        return JSON.parse(fileContent).abi;
    }

    /**
     * Returns a ready-to-use Contract instance for IbnAsset.
     */
    getIbnAssetContract(signerOrProvider = this.adminWallet) {
        const abi = this.getABI("IbnAsset");
        return new ethers.Contract(process.env.IBN_ASSET_ADDRESS, abi, signerOrProvider);
    }

    /**
     * Returns a ready-to-use Contract instance for Settlement.
     */
    getSettlementContract(signerOrProvider = this.adminWallet) {
        const abi = this.getABI("Settlement");
        return new ethers.Contract(process.env.SETTLEMENT_ADDRESS, abi, signerOrProvider);
    }
}

export const connection = new ConnectionManager();
