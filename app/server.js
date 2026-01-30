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

/**
 * Middleware to check if a student is whitelisted in the AccountAllowlist contract.
 */
const checkPermission = async (req, res, next) => {
    const { mssv } = req.params;
    try {
        const student = await Student.findOne({ where: { mssv } });
        if (!student) return res.status(404).json({ error: "Student not found" });

        const allowlist = connection.getAccountAllowlistContract();
        const isWhitelisted = await allowlist.isAllowed(student.walletAddress);

        if (!isWhitelisted) {
            return res.status(403).json({
                error: "Access Denied",
                message: "Your account is not whitelisted in the Imperial Lab. Contact your instructor."
            });
        }
        next();
    } catch (err) {
        console.error("Permission check failed", err);
        res.status(500).json({ error: "Internal security verification failed" });
    }
};

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

        // 4. Whitelist the student in the permissioning contract
        console.log(`🔐 Whitelisting student: ${name} (${wallet.address})`);
        const allowlist = connection.getAccountAllowlistContract();
        try {
            const tx = await allowlist.setAccountStatus(wallet.address, true);
            await tx.wait();
            console.log(`✅ Whitelisted in block: ${tx.blockNumber}`);
        } catch (err) {
            console.error("❌ Whitelisting failed", err);
            // We might want to handle this, e.g., if permissioning is disabled or admin has no gas
        }

        // 5. Save to Database

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

        // Fetch balances and whitelisted status for all students
        const assetContract = connection.getIbnAssetContract();
        const allowlist = connection.getAccountAllowlistContract();
        const studentsWithData = await Promise.all(students.map(async (student) => {
            try {
                const balanceBN = await assetContract.balanceOf(student.walletAddress);
                const isWhitelisted = await allowlist.isAllowed(student.walletAddress);
                const studentData = student.toJSON();
                studentData.ibnaBalance = ethers.formatUnits(balanceBN, 18);
                studentData.isWhitelisted = isWhitelisted;
                return studentData;
            } catch (err) {
                console.error(`Status fetch failed for ${student.mssv}`, err);
                const studentData = student.toJSON();
                studentData.ibnaBalance = "0.0";
                studentData.isWhitelisted = false;
                return studentData;
            }
        }));

        res.json(studentsWithData);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route   POST /api/admin/students/:mssv/status
 * @desc    Toggle whitelisting status (Teacher Only)
 */
app.post("/api/admin/students/:mssv/status", async (req, res) => {
    const { mssv } = req.params;
    const { status } = req.body; // boolean

    try {
        const student = await Student.findOne({ where: { mssv } });
        if (!student) return res.status(404).json({ error: "Student not found" });

        console.log(`📡 Manual Status Change: ${student.name} -> ${status ? 'WHITELIST' : 'BLOCK'}`);
        const allowlist = connection.getAccountAllowlistContract();

        const tx = await allowlist.setAccountStatus(student.walletAddress, status);
        await tx.wait();

        res.json({
            message: `Student ${status ? 'whitelisted' : 'blocked'} successfully`,
            isWhitelisted: status,
            txHash: tx.hash
        });
    } catch (error) {
        console.error("Status toggle failed", error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route   POST /api/students/:mssv/submit
 * @desc    Student submits their deployed contract address
 */
app.post("/api/students/:mssv/submit", checkPermission, async (req, res) => {
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
app.post("/api/students/:mssv/claim", checkPermission, async (req, res) => {
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
