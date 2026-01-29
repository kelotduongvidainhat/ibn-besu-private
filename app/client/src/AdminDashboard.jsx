import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, BookOpen, Activity, ExternalLink, RefreshCw, CheckCircle, Clock } from 'lucide-react';

const API_BASE = "http://localhost:5000/api";

function AdminDashboard() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [health, setHealth] = useState(null);

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
                    <div className="p-2 rounded-lg bg-fresh-sky/20 text-fresh-sky">
                        <BookOpen size={24} />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-text-primary">TEACHER CONTROL CENTER</h2>
                </div>
                <button onClick={fetchData} className="btn-primary flex items-center py-2 px-4 text-xs">
                    <RefreshCw size={14} className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh Data
                </button>
            </header>

            <main className="max-w-7xl mx-auto space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card p-6 flex items-center space-x-4 border-l-4 border-fresh-sky">
                        <div className="p-4 rounded-xl bg-fresh-sky/20 text-fresh-sky">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-text-secondary uppercase font-bold tracking-wider">Total Students</p>
                            <h3 className="text-2xl font-bold text-text-primary">{students.length}</h3>
                        </div>
                    </div>
                    <div className="glass-card p-6 flex items-center space-x-4">
                        <div className="p-4 rounded-xl bg-green-400/20 text-green-400">
                            <Activity size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-text-secondary uppercase">Network Health</p>
                            <h3 className="text-2xl font-bold">{health?.status || "Checking..."}</h3>
                        </div>
                    </div>
                    <div className="glass-card p-6 flex items-center space-x-4 border-l-4 border-cerulean">
                        <div className="p-4 rounded-xl bg-cerulean/20 text-cerulean">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-text-secondary uppercase font-bold tracking-wider">Total Submissions</p>
                            <h3 className="text-2xl font-bold text-text-primary">
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
                                    <th className="p-4">IBNA Assets</th>
                                    <th className="p-4">Identity</th>
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
                                            <span className="text-sm font-bold text-fresh-sky">{student.ibnaBalance || '0.0'}</span>
                                            <span className="text-[10px] ml-1 opacity-60">IBNA</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-[10px] px-2 py-1 rounded-full bg-fresh-sky/20 text-fresh-sky border border-fresh-sky/30 font-bold uppercase tracking-tighter">
                                                DEEP SEA
                                            </span>
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
                                    <span className="text-[10px] px-2 py-1 rounded-full bg-fresh-sky/20 text-fresh-sky border border-fresh-sky/30 font-bold">
                                        DEEP SEA
                                    </span>
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
                                            <span className="text-xl font-bold text-fresh-sky">{student.ibnaBalance || '0.0'}</span>
                                            <span className="text-xs opacity-60 font-bold">IBNA</span>
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
