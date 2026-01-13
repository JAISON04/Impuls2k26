import React, { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import * as XLSX from 'xlsx';
import { Download, Table, Loader2, AlertCircle, Users, IndianRupee, FileText, Search, LogOut, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Section from './Section';

const AdminPanel = () => {
    // Auth State
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');

    // Data State
    const [registrations, setRegistrations] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false); // Only load after login
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Stats
    const [stats, setStats] = useState({
        total: 0,
        unique: 0,
        revenue: 0
    });

    const REGISTRATION_FEE = 150; // Placeholder fee

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === 'admin' && password === 'impulse2026') {
            setIsLoggedIn(true);
            setAuthError('');
            fetchRegistrations();
        } else {
            setAuthError('Invalid credentials. Access denied.');
        }
    };

    const fetchRegistrations = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "registrations"), orderBy("registeredAt", "desc"));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                registeredAt: doc.data().registeredAt?.toDate ? doc.data().registeredAt.toDate().toLocaleString() : 'N/A'
            }));

            setRegistrations(data);
            setFilteredData(data);
            calculateStats(data);
        } catch (err) {
            console.error("Error fetching registrations:", err);
            setError("Failed to load data. Make sure Firestore rules allow access.");
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (data) => {
        const participants = new Set(data.map(item => item.phone)).size;
        setStats({
            total: data.length,
            unique: participants,
            revenue: data.length * REGISTRATION_FEE
        });
    };

    useEffect(() => {
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            const filtered = registrations.filter(item =>
                item.name?.toLowerCase().includes(lower) ||
                item.email?.toLowerCase().includes(lower) ||
                item.phone?.includes(lower) ||
                item.eventName?.toLowerCase().includes(lower) ||
                item.college?.toLowerCase().includes(lower)
            );
            setFilteredData(filtered);
        } else {
            setFilteredData(registrations);
        }
    }, [searchTerm, registrations]);

    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(registrations);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
        XLSX.writeFile(workbook, "Impulse_Registrations.xlsx");
    };

    // --- Login View ---
    if (!isLoggedIn) {
        return (
            <Section className="py-24 min-h-screen flex items-center justify-center">
                <div className="w-full max-w-md px-4">
                    <div className="bg-navy-900/80 border border-electric-500/30 rounded-2xl p-8 backdrop-blur-md shadow-[0_0_50px_rgba(45,212,191,0.1)]">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-orbitron font-bold text-white mb-2">
                                Admin <span className="text-electric-400">Login</span>
                            </h1>
                            <p className="text-gray-400 text-sm">Secure access to Pulse dashboard</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-navy-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-electric-500 outline-none transition-colors"
                                    placeholder="Enter admin ID"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-navy-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-electric-500 outline-none transition-colors"
                                    placeholder="Enter password"
                                />
                            </div>

                            {authError && (
                                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm flex items-center gap-2">
                                    <AlertCircle size={16} /> {authError}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full py-3 bg-electric-600 hover:bg-electric-500 text-navy-950 font-bold rounded-xl transition-all hover:shadow-[0_0_20px_#2dd4bf]"
                            >
                                Access Dashboard
                            </button>
                        </form>
                    </div>
                </div>
            </Section>
        );
    }

    // --- Main Dashboard View ---
    return (
        <Section className="py-24 min-h-screen">
            <div className="w-full max-w-7xl px-4 mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-orbitron font-bold text-white">
                            Dashboard <span className="text-electric-400">Overview</span>
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">Real-time registration tracking</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setIsLoggedIn(false)}
                            className="flex items-center gap-2 bg-navy-800 hover:bg-navy-700 text-gray-300 px-5 py-2.5 rounded-xl border border-white/10 transition-all font-medium"
                        >
                            <LogOut size={18} /> Logout
                        </button>
                        <button
                            onClick={downloadExcel}
                            className="flex items-center gap-2 bg-electric-600 hover:bg-electric-500 text-navy-950 font-bold px-6 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(45,212,191,0.2)]"
                        >
                            <Download size={20} /> Export Excel
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Total Registrations */}
                    <div className="bg-navy-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Total Registrations</h3>
                            <div className="p-2 bg-electric-500/10 rounded-lg text-electric-400">
                                <FileText size={24} />
                            </div>
                        </div>
                        <div className="text-4xl font-black text-white font-orbitron">{stats.total}</div>
                        <div className="text-xs text-electric-400 mt-2 flex items-center gap-1">
                            <CheckCircle size={12} /> Live updated
                        </div>
                    </div>

                    {/* Unique Participants */}
                    <div className="bg-navy-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Unique Participants</h3>
                            <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400">
                                <Users size={24} />
                            </div>
                        </div>
                        <div className="text-4xl font-black text-white font-orbitron">{stats.unique}</div>
                        <div className="text-xs text-gray-500 mt-2">Based on unique phone numbers</div>
                    </div>

                    {/* Total Revenue */}
                    <div className="bg-navy-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Estimated Revenue</h3>
                            <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                                <IndianRupee size={24} />
                            </div>
                        </div>
                        <div className="text-4xl font-black text-white font-orbitron">
                            ₹{stats.revenue.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">Based on ₹{REGISTRATION_FEE}/registration</div>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-2">
                        <AlertCircle size={20} /> {error}
                    </div>
                )}

                {/* Data Table Section */}
                <div className="bg-navy-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                    {/* Table Header & Search */}
                    <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Table size={20} className="text-electric-400" /> Recent Registrations
                        </h2>

                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search students, events..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-navy-950 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-electric-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Table Content */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider border-b border-white/10">
                                    <th className="p-4 font-bold">Student Name</th>
                                    <th className="p-4 font-bold">Event Registered</th>
                                    <th className="p-4 font-bold">College</th>
                                    <th className="p-4 font-bold">Contact</th>
                                    <th className="p-4 font-bold">Year</th>
                                    <th className="p-4 font-bold">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="p-12 text-center text-electric-400">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Loader2 className="animate-spin" size={32} />
                                                <span className="text-sm">Loading data...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-gray-500 italic">
                                            {searchTerm ? 'No matching records found.' : 'No registrations found yet.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((reg) => (
                                        <tr key={reg.id} className="hover:bg-white/5 transition-colors text-sm text-gray-300">
                                            <td className="p-4 font-bold text-white">{reg.name}</td>
                                            <td className="p-4">
                                                <span className="bg-electric-500/10 text-electric-400 px-2 py-1 rounded text-xs font-bold border border-electric-500/20">
                                                    {reg.eventName}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-400">{reg.college}</td>
                                            <td className="p-4 font-mono text-xs">
                                                <div>{reg.phone}</div>
                                                <div className="text-gray-500">{reg.email}</div>
                                            </td>
                                            <td className="p-4">{reg.year}</td>
                                            <td className="p-4 text-gray-500 text-xs whitespace-nowrap">{reg.registeredAt}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default AdminPanel;
