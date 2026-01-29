import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { walletManager } from "./wallet/wallet-manager.js";
import { connection } from "./gateway/connection.js";
import { ethers } from "ethers";
import { initDB, Student, Submission } from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Initialize Database
initDB();

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the Imperial Virtual Lab API",
        version: "1.0.0",
        endpoints: {
            health: "/api/health",
            register: "/api/students/register",
            admin: "/api/admin/students"
        }
    });
});

// --- Virtual Lab API ---

/**
 * @route   GET /api/health
 */
app.get("/api/health", async (req, res) => {
    try {
        const blockNumber = await connection.provider.getBlockNumber();
        res.json({
            status: "UP",
            blockchain: "CONNECTED",
            currentBlock: blockNumber,
            network: "Besu Private (QBFT)",
            database: "CONNECTED"
        });
    } catch (error) {
        res.status(500).json({ status: "DOWN", error: error.message });
    }
});

/**
 * @route   POST /api/students/register
 * @desc    Check if student exists, or create new wallet and save to DB
 */
app.post("/api/students/register", async (req, res) => {
    const { mssv, name } = req.body;

    if (!mssv || !name) {
        return res.status(400).json({ error: "MSSV and Name are required" });
    }

    try {
        // 1. Check if student already registered
        let student = await Student.findOne({ where: { mssv } });

        if (student) {
            return res.json({
                message: "Student already registered",
                student: student,
                rpcUrl: process.env.BESU_NODE1_URL,
                chainId: 1337
            });
        }

        // 2. Create new blockchain identity
        const wallet = walletManager.getOrCreateWallet(`Student_${mssv}`);

        // 3. Fund with gas if needed
        const balance = await connection.provider.getBalance(wallet.address);
        if (balance === 0n) {
            await walletManager.fundWallet(`Student_${mssv}`, "1.0");
        }

        // 4. Save to Database
        student = await Student.create({
            mssv,
            name,
            walletAddress: wallet.address,
            privateKey: wallet.privateKey
        });

        res.json({
            message: "Registration successful",
            student: student,
            rpcUrl: process.env.BESU_NODE1_URL,
            wsUrl: process.env.BESU_NODE1_WS_URL,
            chainId: 1337
        });
    } catch (error) {
        console.error("Registration error", error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route   GET /api/students/:mssv/balance
 * @desc    Fetch student's IBNA balance
 */
app.get("/api/students/:mssv/balance", async (req, res) => {
    const { mssv } = req.params;
    try {
        const student = await Student.findOne({ where: { mssv } });
        if (!student) return res.status(404).json({ error: "Student not found" });

        const assetContract = connection.getIbnAssetContract();
        const balanceBN = await assetContract.balanceOf(student.walletAddress);

        res.json({
            mssv,
            balance: ethers.formatUnits(balanceBN, 18),
            walletAddress: student.walletAddress
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route   GET /api/admin/students
 * @desc    List all students (Teacher View)
 */
app.get("/api/admin/students", async (req, res) => {
    try {
        const students = await Student.findAll({
            include: [Submission]
        });

        // Fetch balances for all students
        const assetContract = connection.getIbnAssetContract();
        const studentsWithBalance = await Promise.all(students.map(async (student) => {
            try {
                const balanceBN = await assetContract.balanceOf(student.walletAddress);
                const studentData = student.toJSON();
                studentData.ibnaBalance = ethers.formatUnits(balanceBN, 18);
                return studentData;
            } catch (err) {
                console.error(`Balance fetch failed for ${student.mssv}`, err);
                const studentData = student.toJSON();
                studentData.ibnaBalance = "0.0";
                return studentData;
            }
        }));

        res.json(studentsWithBalance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route   POST /api/students/:mssv/submit
 * @desc    Student submits their deployed contract address
 */
app.post("/api/students/:mssv/submit", async (req, res) => {
    const { mssv } = req.params;
    const { contractAddress, txHash } = req.body;

    if (!contractAddress || !txHash) {
        return res.status(400).json({ error: "Contract address and Tx Hash are required" });
    }

    try {
        const student = await Student.findOne({ where: { mssv } });
        if (!student) return res.status(404).json({ error: "Student not found" });

        const submission = await Submission.create({
            StudentId: student.id,
            contractAddress,
            txHash,
            status: "SUBMITTED"
        });

        res.json({ message: "Assignment submitted successfully", submission });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route   POST /api/students/:mssv/claim
 * @desc    Claim daily reward (100 IBNA)
 */
app.post("/api/students/:mssv/claim", async (req, res) => {
    const { mssv } = req.params;

    try {
        const student = await Student.findOne({ where: { mssv } });
        if (!student) return res.status(404).json({ error: "Student not found" });

        // Cooldown check (24 hours)
        const COOLDOWN = 24 * 60 * 60 * 1000;
        const now = new Date();

        if (student.lastClaimedAt && (now - new Date(student.lastClaimedAt) < COOLDOWN)) {
            const remaining = COOLDOWN - (now - new Date(student.lastClaimedAt));
            const hoursRelative = Math.ceil(remaining / (1000 * 60 * 60));
            return res.status(429).json({
                error: `Reward already claimed. Try again in ${hoursRelative} hours.`,
                nextAvailable: new Date(new Date(student.lastClaimedAt).getTime() + COOLDOWN)
            });
        }

        // Mint 100 IBNA
        const assetContract = connection.getIbnAssetContract();
        const amount = ethers.parseUnits("100", 18);

        console.log(`🎁 Daily Reward: Minting 100 IBNA for ${student.name} (${student.walletAddress})`);
        const tx = await assetContract.mint(student.walletAddress, amount);
        await tx.wait();

        // Update DB
        student.lastClaimedAt = now;
        await student.save();

        res.json({
            message: "Daily reward claimed! 100 IBNA minted.",
            txHash: tx.hash,
            lastClaimedAt: student.lastClaimedAt
        });
    } catch (error) {
        console.error("Claim error", error);
        res.status(500).json({ error: error.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Virtual Lab API Server running on http://localhost:${PORT}`);
});
