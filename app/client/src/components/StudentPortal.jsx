import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Shield, Activity, Copy, LogOut, Gift, Eye, EyeOff, CheckCircle2, AlertCircle, TrendingUp, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE = "http://localhost:5000/api";

function StudentPortal() {
    const [mssv, setMssv] = useState('');
    const [name, setName] = useState('');
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [balance, setBalance] = useState('0');
    const [showKey, setShowKey] = useState(false);
    const [isWhitelisted, setIsWhitelisted] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem('ibn_student');
        if (saved) {
            setStudent(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        if (student) {
            const fetchStatus = async () => {
                try {
                    // We get balance and whitelist status from the student specific endpoint
                    const [balanceRes, healthRes] = await Promise.all([
                        axios.get(`${API_BASE}/students/${student.mssv}/balance`),
                        axios.get(`${API_BASE}/health`)
                    ]);
                    setBalance(balanceRes.data.balance);
                    // For simplicity in the MVP, the balance endpoint doesn't return whitelisted status yet
                    // But we can check via a dedicated call or use the admin one if allowed
                    // For now, let's assume we might need a status endpoint
                    const adminCheck = await axios.get(`${API_BASE}/admin/students`);
                    const me = adminCheck.data.find(s => s.mssv === student.mssv);
                    if (me) setIsWhitelisted(me.isWhitelisted);
                } catch (err) {
                    console.error("Status fetch error", err);
                }
            };

            fetchStatus();
            const interval = setInterval(fetchStatus, 15000);
            return () => clearInterval(interval);
        }
    }, [student]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post(`${API_BASE}/students/register`, { mssv, name });
            const studentData = res.data.student;
            setStudent(studentData);
            localStorage.setItem('ibn_student', JSON.stringify(studentData));
        } catch (err) {
            setError(err.response?.data?.error || "Connection failed. Is the server running?");
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('ibn_student');
        setStudent(null);
        setMssv('');
        setName('');
    };

    const handleClaim = async () => {
        if (!isWhitelisted) {
            alert("Access Denied: Your account is not whitelisted. Contact instructor.");
            return;
        }
        setLoading(true);
        try {
            await axios.post(`${API_BASE}/students/${student.mssv}/claim`);
            const balanceRes = await axios.get(`${API_BASE}/students/${student.mssv}/balance`);
            setBalance(balanceRes.data.balance);
            alert("✅ Reward Claimed! 10 ETH added to your vault.");
        } catch (err) {
            alert(err.response?.data?.error || "Claim failed.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        // You could add a toast here
    };

    if (!student) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 relative overflow-hidden">
                {/* Deep Sea Background Elements */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cerulean/10 blur-[120px] rounded-full animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-biolume/10 blur-[120px] rounded-full animate-pulse-slow"></div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-10 w-full max-w-lg relative z-10 border-white/5"
                >
                    <div className="flex justify-center mb-8">
                        <div className="p-5 rounded-3xl bg-biolume/10 text-biolume biolume-border">
                            <Shield size={56} className="glow-text" />
                        </div>
                    </div>

                    <h1 className="text-4xl font-black mb-3 tracking-tighter glow-text">IMPERIAL LAB</h1>
                    <p className="text-text-secondary mb-10 text-lg leading-relaxed font-light">
                        Welcome to the <span className="text-biolume font-bold">Deep Sea</span> node.
                        Initialize your student identity to begin.
                    </p>

                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="space-y-2 text-left">
                            <label className="text-[10px] uppercase tracking-widest text-text-muted font-bold ml-2">Full Identity</label>
                            <input
                                type="text"
                                placeholder="Ex: Alexander Imperial"
                                className="input-field"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2 text-left">
                            <label className="text-[10px] uppercase tracking-widest text-text-muted font-bold ml-2">Academic ID (MSSV)</label>
                            <input
                                type="text"
                                placeholder="Ex: 2024001"
                                className="input-field"
                                value={mssv}
                                onChange={(e) => setMssv(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="biolume-btn w-full mt-4 h-14" disabled={loading}>
                            {loading ? "AUTHENTICATING..." : "ENTER VIRTUAL LAB"}
                        </button>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center justify-center space-x-2 text-red-400 mt-4 text-sm font-bold"
                            >
                                <AlertCircle size={14} />
                                <span>{error}</span>
                            </motion.div>
                        )}
                    </form>

                    <div className="mt-12 pt-8 border-t border-white/5 flex justify-center space-x-6">
                        <Link to="/admin" className="text-[10px] uppercase font-black tracking-widest text-text-muted hover:text-biolume transition-colors">
                            Access Terminal
                        </Link>
                        <span className="text-white/5 font-light">|</span>
                        <span className="text-[10px] uppercase font-black tracking-widest text-text-muted">
                            v1.0.0-PRO
                        </span>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
            {/* Bioluminescence Header */}
            <header className="flex flex-col md:flex-row justify-between items-center mb-16 space-y-6 md:space-y-0">
                <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-2xl bg-biolume/10 text-biolume biolume-border animate-float">
                        <Cpu size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tighter leading-none glow-text">IMPERIAL_PORTAL</h2>
                        <p className="text-[10px] font-black text-biolume tracking-[0.3em] uppercase opacity-70">Deep Sea Laboratory</p>
                    </div>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="hidden sm:flex flex-col items-end mr-2">
                        <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Network Status</span>
                        <span className="text-xs font-bold text-green-400 flex items-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2 animate-pulse"></div> SYNCHRONIZED
                        </span>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-text-secondary hover:text-red-400 hover:bg-red-400/5 transition-all text-[10px] font-bold tracking-widest uppercase"
                    >
                        <LogOut size={14} className="mr-2" /> Disconnect
                    </button>
                </div>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column - Identity & Assets */}
                <div className="lg:col-span-4 space-y-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-10 relative overflow-hidden"
                    >
                        {/* Background Texture */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-biolume/5 rotate-45 translate-x-16 -translate-y-16 blur-2xl"></div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-28 h-28 p-1 rounded-full biolume-border mb-6">
                                <div className="w-full h-full bg-gradient-to-br from-biolume to-cerulean rounded-full flex items-center justify-center text-4xl font-black text-bg-ink shadow-2xl">
                                    {student.name.charAt(0)}
                                </div>
                            </div>
                            <h3 className="text-2xl font-black mb-1 tracking-tight">{student.name}</h3>
                            <p className="text-biolume text-xs font-bold tracking-[0.2em] mb-8 uppercase opacity-80">{student.mssv}</p>

                            <div className="w-full space-y-4">
                                <div className="p-6 rounded-3xl bg-black/40 border border-white/5 group transition-all hover:border-biolume/20">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Available Balance</span>
                                        <TrendingUp size={14} className="text-biolume opacity-40 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="flex items-baseline space-x-3">
                                        <span className="text-4xl font-black text-white glow-text">{balance}</span>
                                        <span className="text-xs font-black text-biolume uppercase tracking-widest opacity-60 italic">ETH</span>
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                                    <span className="text-[10px] text-text-muted font-bold uppercase">Whitelisted Status</span>
                                    {isWhitelisted ? (
                                        <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] font-bold text-green-400 flex items-center">
                                            <Shield size={10} className="mr-1.5" /> AUTHORIZED
                                        </div>
                                    ) : (
                                        <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-[10px] font-bold text-red-400 flex items-center">
                                            <AlertCircle size={10} className="mr-1.5" /> RESTRICTED
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card p-8"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-text-muted">Daily Resources</h4>
                            <Gift size={16} className="text-biolume" />
                        </div>
                        <p className="text-xs font-light text-text-secondary leading-relaxed mb-6">
                            Students receive a base allowance of <span className="text-white font-bold">50 ETH</span> daily to power their smart contract experiments.
                        </p>
                        <button
                            onClick={handleClaim}
                            disabled={loading || !isWhitelisted}
                            className="biolume-btn w-full h-12"
                        >
                            {loading ? "MINING..." : "CLAIM DAILY ETH"}
                        </button>
                        {!isWhitelisted && (
                            <p className="text-[10px] text-red-400/60 mt-4 text-center italic">
                                You must be whitelisted to claim tokens.
                            </p>
                        )}
                    </motion.div>
                </div>

                {/* Right Column - Lab Tech & Stats */}
                <div className="lg:col-span-8 space-y-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-10"
                    >
                        <div className="flex items-center space-x-3 mb-10">
                            <div className="w-1.5 h-6 bg-biolume shadow-[0_0_10px_var(--biolume-glow)] rounded-full"></div>
                            <h3 className="text-2xl font-black tracking-tight uppercase">Control_Center</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 flex items-center">
                                        <Wallet size={12} className="mr-2" /> Public Wallet Identity
                                    </label>
                                    <div className="group relative">
                                        <input
                                            readOnly
                                            value={student.walletAddress}
                                            className="input-field pr-12 font-mono text-[10px]"
                                        />
                                        <button
                                            onClick={() => copyToClipboard(student.walletAddress)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/5 text-text-muted hover:text-biolume hover:bg-biolume/5 transition-all"
                                        >
                                            <Copy size={16} title="Copy Address" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 flex items-center">
                                        <Shield size={12} className="mr-2" /> Secret Key (Private)
                                    </label>
                                    <div className="group relative">
                                        <input
                                            type={showKey ? "text" : "password"}
                                            readOnly
                                            value={student.privateKey}
                                            className="input-field pr-24 font-mono text-[10px] border-biolume/10"
                                        />
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                                            <button
                                                onClick={() => setShowKey(!showKey)}
                                                className="p-2 rounded-lg bg-white/5 text-text-muted hover:text-white transition-all"
                                            >
                                                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                            <button
                                                onClick={() => copyToClipboard(student.privateKey)}
                                                className="p-2 rounded-lg bg-white/5 text-text-muted hover:text-biolume hover:bg-biolume/5 transition-all"
                                            >
                                                <Copy size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-2 p-4 bg-red-400/5 border border-red-400/10 rounded-2xl">
                                        <AlertCircle size={14} className="text-red-400 mt-0.5" />
                                        <p className="text-[10px] text-text-secondary leading-relaxed">
                                            CRITICAL: This key grants total access to your assets. Store it securely in a password manager.
                                            You will need this for <span className="text-white font-bold">Remix</span> and <span className="text-white font-bold">MetaMask</span>.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-black/40 rounded-3xl p-8 border border-white/5 space-y-6">
                                <h5 className="text-[10px] font-black uppercase text-biolume tracking-[0.2em]">Lab Connection Parameters</h5>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-xs pb-3 border-b border-white/5">
                                        <span className="text-text-muted">SECURE_RPC</span>
                                        <span className="font-mono text-[9px] text-biolume font-bold">http://localhost:5000/api/rpc/{student.mssv}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs pb-3 border-b border-white/5">
                                        <span className="text-text-muted">CHAIN_ID</span>
                                        <span className="font-mono text-[10px] text-white">1337</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs pb-3 border-b border-white/5">
                                        <span className="text-text-muted">CONSENSUS</span>
                                        <span className="font-mono text-[10px] text-white uppercase italic">QBFT (Private)</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-text-muted">SYNC_MODE</span>
                                        <span className="font-mono text-[10px] text-green-400 font-bold uppercase">BONSAI_OPTIMIZED</span>
                                    </div>
                                </div>

                                <div className="pt-4 grid grid-cols-2 gap-3">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                                        <CheckCircle2 size={16} className="mx-auto mb-2 text-biolume opacity-50" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">SSL Secured</span>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                                        <Activity size={16} className="mx-auto mb-2 text-biolume opacity-50" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">Peer Sync</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass-card p-8 group overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Cpu size={80} />
                            </div>
                            <h4 className="text-sm font-black uppercase tracking-widest mb-4">Development Tools</h4>
                            <ul className="space-y-3">
                                <li className="flex items-center text-xs text-text-secondary">
                                    <div className="w-1 h-1 rounded-full bg-biolume mr-2"></div>
                                    Remix IDE (Use SECURE_RPC)
                                </li>
                                <li className="flex items-center text-xs text-text-secondary">
                                    <div className="w-1 h-1 rounded-full bg-biolume mr-2"></div>
                                    MetaMask (Custom Network)
                                </li>
                                <li className="flex items-center text-xs text-text-secondary">
                                    <div className="w-1 h-1 rounded-full bg-biolume mr-2"></div>
                                    <a href="http://localhost:4000" target="_blank" className="text-biolume hover:underline">Lab Explorer (Live Audit)</a>
                                </li>
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="glass-card p-8 group overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Shield size={80} />
                            </div>
                            <h4 className="text-sm font-black uppercase tracking-widest mb-4">Submission Guide</h4>
                            <p className="text-xs text-text-secondary leading-relaxed font-light">
                                Once you deploy your contract, use the <span className="text-white font-bold">Admin Console</span> to register your deployment hash for grading.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </main>

            <footer className="mt-20 py-10 border-t border-white/5 text-center">
                <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.4em]">
                    Imperial Virtual Blockchain Laboratory &copy; 2026
                </p>
            </footer>
        </div>
    );
}

export default StudentPortal;
