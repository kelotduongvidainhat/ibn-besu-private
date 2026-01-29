import { Sequelize, DataTypes } from "sequelize";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.join(__dirname, "database", "lab.sqlite"),
    logging: false
});

// Define Student Model
export const Student = sequelize.define("Student", {
    mssv: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    walletAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    privateKey: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastClaimedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
});

// Define Submission Model
export const Submission = sequelize.define("Submission", {
    contractAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    txHash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: "PENDING"
    },
    grade: {
        type: DataTypes.FLOAT,
        allowNull: true
    }
});

// Relationships
Student.hasMany(Submission);
Submission.belongsTo(Student);

// Sync Database
export const initDB = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });
        console.log("💾 Database connected and synced.");
    } catch (error) {
        console.error("❌ Unable to connect to the database:", error);
    }
};

export default sequelize;
