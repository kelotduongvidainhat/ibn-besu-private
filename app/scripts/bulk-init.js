import axios from 'axios';

const students = [
    { mssv: "S001", name: "Alice Waters" },
    { mssv: "S002", name: "Bob Rivers" },
    { mssv: "S003", name: "Charlie Deep" },
    { mssv: "S004", name: "Diana Storm" },
    { mssv: "S005", name: "Ethan Tide" },
    { mssv: "9999", name: "DeepSea Explorer" }
];

const API_BASE = "http://localhost:5000/api";

async function init() {
    console.log("🚀 Initializing Student Roster with 100 ETH each...");

    for (const s of students) {
        try {
            console.log(`📝 Registering ${s.name} (${s.mssv})...`);
            const res = await axios.post(`${API_BASE}/students/register`, s);
            console.log(`✅ Success. Address: ${res.data.student.walletAddress}`);
        } catch (err) {
            console.error(`❌ Failed to register ${s.mssv}:`, err.response?.data?.error || err.message);
        }
    }

    console.log("\n✨ Everyone is registered and funded with 100 ETH.");
}

init();
