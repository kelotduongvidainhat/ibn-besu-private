import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Shield, Activity, Search, Copy, CheckCircle, LogOut, Gift } from 'lucide-react';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';

const API_BASE = "http://localhost:5000/api";

function StudentPortal() {
  const [mssv, setMssv] = useState('');
  const [name, setName] = useState('');
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState('0');

  // Check for stored session
  useEffect(() => {
    const saved = localStorage.getItem('ibn_student');
    if (saved) {
      setStudent(JSON.parse(saved));
    }
  }, []);

  // Fetch balance periodically
  useEffect(() => {
    if (student) {
      const fetchBalance = async () => {
        try {
          const res = await axios.get(`${API_BASE}/students/${student.mssv}/balance`);
          setBalance(res.data.balance);
        } catch (err) {
          console.error("Balance fetch error", err);
        }
      };
      fetchBalance();
      const interval = setInterval(fetchBalance, 10000);
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
      setError(err.response?.data?.error || "Connection failed");
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
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/students/${student.mssv}/claim`);
      alert("Success! 100 IBNA tokens have been minted to your wallet.");
      // Refresh balance
      const balanceRes = await axios.get(`${API_BASE}/students/${student.mssv}/balance`);
      setBalance(balanceRes.data.balance);
    } catch (err) {
      alert(err.response?.data?.error || "Claim failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 w-full max-w-md text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-fresh-sky/20 text-fresh-sky">
              <Shield size={48} />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Imperial Lab</h1>
          <p className="text-text-secondary mb-8">Login with your Student ID to enter the Virtual Blockchain Lab.</p>

          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Student ID (MSSV)"
              className="input-field"
              value={mssv}
              onChange={(e) => setMssv(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? "Initializing..." : "Login to Lab"}
            </button>
            {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
          </form>
        </motion.div>
        <Link to="/admin" className="mt-8 text-xs text-text-secondary hover:text-fresh-sky transition-colors opacity-60">
          Admin Console
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center mb-12 max-w-6xl mx-auto space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-fresh-sky/20 text-fresh-sky">
            <Shield size={24} />
          </div>
          <h2 className="text-xl font-bold tracking-tight">DEEP SEA VIRTUAL LAB</h2>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={logout} className="flex items-center text-text-secondary hover:text-white transition-colors text-sm">
            <LogOut size={18} className="mr-2" /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-1 space-y-8"
        >
          <div className="glass-card p-6 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-fresh-sky to-cerulean rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-fresh-sky/20">
              {student.name.charAt(0)}
            </div>
            <h3 className="text-xl font-bold">{student.name}</h3>
            <p className="text-text-secondary mb-6 italic text-sm">Student ID: {student.mssv}</p>

            <div className="bg-white/5 rounded-2xl p-4 text-left border border-white/10">
              <p className="text-[10px] text-text-secondary uppercase font-bold tracking-tight mb-1">Portfolio Balance</p>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-fresh-sky">{balance}</span>
                <span className="text-sm font-semibold opacity-60">IBNA</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-fresh-sky mb-4 flex items-center">
              <Activity size={18} className="mr-2" /> Network Activity
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-60">Status</span>
                <span className="flex items-center text-green-400">
                  <div className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></div> Healthy
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-60">Chain ID</span>
                <span>1337 (Besu)</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-fresh-sky mb-4 flex items-center">
              <Gift size={18} className="mr-2" /> Daily Reward
            </h4>
            <p className="text-xs opacity-70 mb-4">Click to claim 100 IBNA tokens once every 24 hours to build your portfolio!</p>
            <button
              onClick={handleClaim}
              disabled={loading}
              className="w-full btn-primary py-2 text-xs"
            >
              {loading ? "PROCESSING..." : "CLAIM 100 IBNA"}
            </button>
          </div>
        </motion.div>

        {/* Credentials / Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 space-y-8"
        >
          <div className="glass-card p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center text-fresh-sky">
              <Wallet size={24} className="mr-3" /> Lab Credentials
            </h3>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-text-secondary uppercase block mb-2">Wallet Address</label>
                <div className="flex bg-black/20 rounded-lg overflow-hidden border border-white/10">
                  <code className="p-3 text-sm flex-1 truncate">{student.walletAddress}</code>
                  <button onClick={() => copyToClipboard(student.walletAddress)} className="p-3 bg-white/5 hover:bg-white/10 border-l border-white/10">
                    <Copy size={18} />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-text-secondary uppercase block mb-2">Private Key (Keep Secret!)</label>
                <div className="flex bg-black/20 rounded-lg overflow-hidden border border-white/10">
                  <code className="p-3 text-sm flex-1 truncate">••••••••••••••••••••••••••••••••</code>
                  <button onClick={() => copyToClipboard(student.privateKey)} className="p-3 bg-white/5 hover:bg-white/10 border-l border-white/10">
                    <CheckCircle size={18} />
                  </button>
                </div>
                <p className="mt-2 text-[10px] text-red-400 opacity-80">This key is generated uniquely for your student ID. Never share it with anyone.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-fresh-sky/10 border border-fresh-sky/20">
                  <h5 className="font-bold text-sm mb-1">Step 1: Remix IDE</h5>
                  <p className="text-xs opacity-70">Open remix.ethereum.org and select "Dev - Hyperledger Besu".</p>
                </div>
                <div className="p-4 rounded-2xl bg-cerulean/10 border border-cerulean/20">
                  <h5 className="font-bold text-sm mb-1">Step 2: Connect</h5>
                  <p className="text-xs opacity-70">Use the RPC endpoint: http://localhost:8545 to deploy.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentPortal />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
