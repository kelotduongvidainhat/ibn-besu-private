const students = [
    { mssv: 'S001', name: 'Alice Waters' },
    { mssv: 'S002', name: 'Bob Rivers' },
    { mssv: 'S003', name: 'Charlie Deep' },
    { mssv: 'S004', name: 'Diana Storm' },
    { mssv: 'S005', name: 'Ethan Tide' },
    { mssv: '9999', name: 'DeepSea Explorer' }
];
const API_BASE = 'http://localhost:5000/api';
async function init() {
    console.log('📝 Starting registration loop...');
    for (const s of students) {
        try {
            const res = await fetch(`${API_BASE}/students/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(s)
            });
            const data = await res.json();
            if (res.ok) {
                console.log(`✅ Registered ${s.mssv}: ${data.student.walletAddress}`);
            } else {
                console.error(`❌ Error ${s.mssv}: `, data);
            }
        } catch (err) {
            console.error(`❌ Error ${s.mssv}: `, err.message);
        }
    }
}
init();
