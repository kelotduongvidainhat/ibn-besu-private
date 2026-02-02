import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, BookOpen, Activity, ExternalLink, RefreshCw, CheckCircle, Clock, ShieldCheck, ShieldAlert, ShieldOff, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE = "http://localhost:5000/api";

function AdminDashboard() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [health, setHealth] = useState(null);

    const togglePermission = async (mssv, currentStatus) => {
        try {
            await axios.post(`${API_BASE}/admin/students/${mssv}/status`, {
                status: !currentStatus
            });
            fetchData();
        } catch (err) {
            console.error("Toggle error", err);
            alert("Failed to update permission: " + (err.response?.data?.error || err.message));
        }
    };

    const handleDistributeRewards = async () => {
        if (!window.confirm("Distribute 50 ETH daily rewards to all students?")) return;
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE}/admin/distribute-rewards`);
            alert(`✅ ${res.data.message}`);
            fetchData();
        } catch (err) {
            console.error("Distribution error", err);
            alert("Reward distribution failed: " + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [studentsRes, healthRes] = await Promise.all([
                axios.get(`${API_BASE}/admin/students`),
                axios.get(`${API_BASE}/health`)
            ]);
            setStudents(studentsRes.data);
            setHealth(healthRes.data);
        } catch (err) {
            console.error("Fetch error", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen p-4 md:p-8">
            <header className="flex justify-between items-center mb-12 max-w-7xl mx-auto">
                <div className="flex items-center space-x-3">
                    <Link to="/" className="p-2 rounded-lg bg-white/5 text-text-muted hover:text-biolume transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="p-2 rounded-lg bg-biolume/10 text-biolume biolume-border">
                        <LayoutDashboard size={24} className="glow-text" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black tracking-tighter text-text-primary glow-text uppercase">INSTRUCTOR_CONTROL</h2>
                        <p className="text-[10px] text-biolume font-bold tracking-[0.2em] uppercase opacity-60">Admin Manifest</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <button onClick={handleDistributeRewards} className="bg-cerulean/20 text-cerulean hover:bg-cerulean/30 border border-cerulean/30 flex items-center h-10 px-6 text-[10px] font-black uppercase rounded-lg transition-all tracking-widest">
                        <CheckCircle size={14} className="mr-2" /> Pay All Rewards
                    </button>
                    <button onClick={fetchData} className="biolume-btn flex items-center h-10 px-6 text-[10px]">
                        <RefreshCw size={14} className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> Sync Data
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card p-6 flex items-center space-x-4 border-l-4 border-biolume">
                        <div className="p-4 rounded-xl bg-biolume/10 text-biolume">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">Total Students</p>
                            <h3 className="text-2xl font-black text-text-primary">{students.length}</h3>
                        </div>
                    </div>
                    <div className="glass-card p-6 flex items-center space-x-4">
                        <div className="p-4 rounded-xl bg-green-400/20 text-green-400">
                            <Activity size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">Network Health</p>
                            <h3 className="text-2xl font-black">{health?.status || "SYNCING..."}</h3>
                        </div>
                    </div>
                    <div className="glass-card p-6 flex items-center space-x-4 border-l-4 border-cerulean">
                        <div className="p-4 rounded-xl bg-cerulean/20 text-cerulean">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">Recorded Submissions</p>
                            <h3 className="text-2xl font-black text-text-primary">
                                {students.reduce((acc, s) => acc + (s.Submissions?.length || 0), 0)}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Student List - Responsive Desktop Table / Mobile Cards */}
                <div className="glass-card">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                        <h3 className="font-bold text-lg">Student Manifest & Submissions</h3>
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/5 text-xs uppercase tracking-widest text-text-secondary font-bold">
                                    <th className="p-4">Student Info</th>
                                    <th className="p-4">Wallet Address</th>
                                    <th className="p-4">ETH Assets</th>
                                    <th className="p-4">Permissioning</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Recent Submission</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {students.map((student) => (
                                    <tr key={student.mssv} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <p className="font-bold">{student.name}</p>
                                            <p className="text-xs text-text-secondary">{student.mssv}</p>
                                        </td>
                                        <td className="p-4">
                                            <code className="text-[10px] bg-black/20 p-1 px-2 rounded font-mono">{student.walletAddress}</code>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm font-bold text-fresh-sky">{student.ethBalance || '0.0'}</span>
                                            <span className="text-[10px] ml-1 opacity-60">ETH</span>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => togglePermission(student.mssv, student.isWhitelisted)}
                                                className="group transition-all duration-300"
                                            >
                                                {student.isWhitelisted ? (
                                                    <span className="text-[10px] px-2 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 font-bold uppercase flex items-center w-fit group-hover:bg-red-500/20 group-hover:text-red-400 group-hover:border-red-500/30">
                                                        <ShieldCheck size={10} className="mr-1 group-hover:hidden" />
                                                        <ShieldOff size={10} className="mr-1 hidden group-hover:block" />
                                                        <span className="group-hover:hidden">Validated</span>
                                                        <span className="hidden group-hover:block">Block Access</span>
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] px-2 py-1 rounded-full bg-red-500/20 text-red-500 border border-red-500/30 font-bold uppercase flex items-center w-fit group-hover:bg-green-500/20 group-hover:text-green-400 group-hover:border-green-500/30">
                                                        <ShieldAlert size={10} className="mr-1 group-hover:hidden" />
                                                        <ShieldCheck size={10} className="mr-1 hidden group-hover:block" />
                                                        <span className="group-hover:hidden">Blocked</span>
                                                        <span className="hidden group-hover:block">Authorize</span>
                                                    </span>
                                                )}
                                            </button>
                                        </td>
                                        <td className="p-4 text-xs">
                                            {student.Submissions?.length > 0 ? (
                                                <span className="text-green-400 flex items-center">
                                                    <CheckCircle size={12} className="mr-1" /> Submitted
                                                </span>
                                            ) : (
                                                <span className="text-text-secondary flex items-center">
                                                    <Clock size={12} className="mr-1" /> No Entry
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {student.Submissions?.length > 0 ? (
                                                <div className="flex items-center space-x-2 text-xs">
                                                    <span className="truncate max-w-[120px] opacity-60">
                                                        {student.Submissions[student.Submissions.length - 1].contractAddress}
                                                    </span>
                                                    <a
                                                        href={`http://localhost:4000/tx/${student.Submissions[student.Submissions.length - 1].txHash}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-fresh-sky hover:underline p-1 hover:bg-fresh-sky/10 rounded"
                                                        title="View on Explorer"
                                                    >
                                                        <ExternalLink size={14} />
                                                    </a>
                                                </div>
                                            ) : (
                                                <span className="text-xs opacity-30">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-white/5">
                        {students.map((student) => (
                            <div key={student.mssv} className="p-4 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-lg">{student.name}</p>
                                        <p className="text-xs text-text-secondary">ID: {student.mssv}</p>
                                    </div>
                                    <button
                                        onClick={() => togglePermission(student.mssv, student.isWhitelisted)}
                                        className="text-[10px] px-2 py-1 rounded-full font-bold flex items-center border transition-colors"
                                    >
                                        {student.isWhitelisted ? (
                                            <div className="flex items-center text-green-400 bg-green-500/20 border-green-500/30">
                                                <ShieldCheck size={10} className="mr-1" /> VALIDATED
                                            </div>
                                        ) : (
                                            <div className="flex items-center text-red-500 bg-red-500/20 border-red-500/30">
                                                <ShieldAlert size={10} className="mr-1" /> BLOCKED
                                            </div>
                                        )}
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex flex-col space-y-1">
                                        <span className="text-[10px] uppercase text-text-secondary font-bold">Wallet</span>
                                        <code className="text-[10px] bg-black/20 p-2 rounded block break-all font-mono">
                                            {student.walletAddress}
                                        </code>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <span className="text-[10px] uppercase text-text-secondary font-bold">Assets</span>
                                        <div className="flex items-baseline space-x-1">
                                            <span className="text-xl font-bold text-fresh-sky">{student.ethBalance || '0.0'}</span>
                                            <span className="text-xs opacity-60 font-bold">ETH</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                                        <div>
                                            <span className="text-[10px] uppercase text-text-secondary font-bold block mb-1">Status</span>
                                            {student.Submissions?.length > 0 ? (
                                                <span className="text-xs text-green-400 flex items-center">
                                                    <CheckCircle size={14} className="mr-1" /> Submitted
                                                </span>
                                            ) : (
                                                <span className="text-xs text-text-secondary flex items-center">
                                                    <Clock size={14} className="mr-1" /> No Entry
                                                </span>
                                            )}
                                        </div>
                                        {student.Submissions?.length > 0 && (
                                            <div className="text-right">
                                                <span className="text-[10px] uppercase text-text-secondary font-bold block mb-1">Latest Submission</span>
                                                <a
                                                    href={`http://localhost:4000/tx/${student.Submissions[student.Submissions.length - 1].txHash}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center text-xs text-fresh-sky bg-fresh-sky/10 px-3 py-1 rounded-full border border-fresh-sky/20"
                                                >
                                                    View Tx <ExternalLink size={10} className="ml-1" />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {students.length === 0 && (
                            <div className="p-8 text-center text-text-secondary italic">
                                No students registered yet.
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;
