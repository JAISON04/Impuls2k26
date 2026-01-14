import React, { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query, addDoc, serverTimestamp, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../firebase';
import { eventsData, workshopsData } from '../data/seedData';
import * as XLSX from 'xlsx';
import { Download, Table, Loader2, AlertCircle, Users, IndianRupee, FileText, Search, LogOut, CheckCircle, Database, Plus, Minus, User } from 'lucide-react';
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

    // Manual Registration State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [manualForm, setManualForm] = useState({
        name: '', college: '', year: '', phone: '', email: '', eventName: '', price: 5,

        isTeamEvent: false,
        isFixedPrice: false,
        teamCount: 1,
        teamMembers: []
    });

    // OD State
    const [sendingOD, setSendingOD] = useState(null);

    // Stats
    const [stats, setStats] = useState({
        total: 0,
        unique: 0,
        revenue: 0,
        eventBreakdown: {}
    });

    const REGISTRATION_FEE = 5; // Placeholder fee

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

        // Calculate event breakdown
        const breakdown = {};
        let totalRevenue = 0;

        data.forEach(item => {
            const event = item.eventName || 'Unknown';
            breakdown[event] = (breakdown[event] || 0) + (item.teamCount || 1);

            // Calculate revenue carefully
            if (item.totalPrice) {
                totalRevenue += parseFloat(item.totalPrice);
            } else {
                // Better fallback: lookup current price based on event name, or default to 50 (avg tech event price)
                const allEvents = [...eventsData.technical, ...eventsData.online, ...workshopsData];
                const foundEvent = allEvents.find(e => e.title === event);
                const estimatedPrice = foundEvent ? foundEvent.price : 50;
                totalRevenue += (item.teamCount || 1) * estimatedPrice;
            }
        });

        setStats({
            total: data.length,
            unique: participants,
            revenue: totalRevenue,
            eventBreakdown: breakdown
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

    const handleManualRegister = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            let totalPrice = 0;
            if (manualForm.isFixedPrice) {
                totalPrice = parseFloat(manualForm.price) || 0;
            } else {
                totalPrice = (manualForm.teamCount || 1) * (parseFloat(manualForm.price) || 0);
            }

            // 1. Add to Firestore
            const docRef = await addDoc(collection(db, "registrations"), {
                ...manualForm,
                teamMembers: manualForm.isTeamEvent ? manualForm.teamMembers : [], // Only save if team event
                totalPrice: totalPrice,
                category: 'Manual',
                paymentId: 'MANUAL',
                uid: 'ADMIN_ENTRY',
                registeredAt: serverTimestamp()
            });

            // 2. Refresh Data
            fetchRegistrations();

            // 3. Reset & Close
            setIsModalOpen(false);
            setManualForm({
                name: '', college: '', year: '', phone: '', email: '', eventName: '', price: 5,
                name: '', college: '', year: '', phone: '', email: '', eventName: '', price: 5,
                isTeamEvent: false,
                isFixedPrice: false,
                teamCount: 1,
                teamMembers: []
            });
            alert("Student/Team registered successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to register student.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper to update team member at index
    const updateTeamMember = (index, value) => {
        const updated = [...manualForm.teamMembers];
        updated[index] = { name: value };
        setManualForm({ ...manualForm, teamMembers: updated });
    };

    // Helper to adjust team count
    const adjustTeamCount = (delta) => {
        const newCount = Math.max(1, (manualForm.teamCount || 1) + delta);
        // Resize members array
        let newMembers = [...manualForm.teamMembers];
        if (newCount > newMembers.length + 1) { // +1 because main student is member 1
            // Add slots
            for (let i = newMembers.length; i < newCount - 1; i++) {
                newMembers.push({ name: '' });
            }
        } else if (newCount < manualForm.teamCount) {
            // Remove slots
            newMembers = newMembers.slice(0, newCount - 1);
        }

        setManualForm({ ...manualForm, teamCount: newCount, teamMembers: newMembers });
    };

    const handleGenerateOD = async (student) => {
        // Confirmation dialog updated to reflect no email is sent
        if (!confirm(`Enable OD Letter Download for ${student.name}?`)) return;

        setSendingOD(student.id);
        try {
            // REMOVED: Cloud Function call to 'sendODEmail' due to billing constraints.
            // Logic now only enables the download button on the client side.

            // 1. Update Firestore to mark OD as generated
            const regRef = doc(db, 'registrations', student.id);
            await setDoc(regRef, {
                odGenerated: true,
                odGeneratedAt: serverTimestamp()
            }, { merge: true });

            // 2. Update local state
            setRegistrations(prev => prev.map(r =>
                r.id === student.id ? { ...r, odGenerated: true } : r
            ));
            setFilteredData(prev => prev.map(r =>
                r.id === student.id ? { ...r, odGenerated: true } : r
            ));

            // Alert updated
            alert(`OD Letter enabled for ${student.name}. They can now download it from their Profile.`);
        } catch (err) {
            console.error("Error generating OD:", err);
            alert(`Failed to enable OD: ${err.message}`);
        } finally {
            setSendingOD(null);
        }
    };

    const handleSeedDB = async () => {
        if (!confirm("This will overwrite existing events/workshops in DB. Continue?")) return;
        setLoading(true);
        try {
            // 1. Clear existing Collections
            const collectionNames = ['events', 'workshops'];
            for (const name of collectionNames) {
                const q = query(collection(db, name));
                const snapshot = await getDocs(q);
                const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
                await Promise.all(deletePromises);
            }

            // 2. Seed Events
            const eventPromises = [
                ...eventsData.technical.map(e => setDoc(doc(db, 'events', `tech_${e.id}`), { ...e, category: 'Technical' })),
                ...eventsData.online.map(e => setDoc(doc(db, 'events', `online_${e.id}`), { ...e, category: 'Online' }))
            ];

            // Seed Workshops
            const workshopPromises = workshopsData.map(w =>
                setDoc(doc(db, 'workshops', `workshop_${w.id}`), { ...w, category: 'Workshop' })
            );

            await Promise.all([...eventPromises, ...workshopPromises]);
            alert("Database seeded successfully!");
        } catch (err) {
            console.error("Error seeding DB:", err);
            alert("Failed to seed DB.");
        } finally {
            setLoading(false);
        }
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
                            onClick={handleSeedDB}
                            className="flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-lg border border-red-500/20 hover:bg-red-500/20 transition-colors"
                            title="Seed Database (Dev Only)"
                        >
                            <Database size={18} /> Seed DB
                        </button>
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
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(236,72,153,0.2)]"
                        >
                            <Users size={20} /> Register Student
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
                        <div className="text-xs text-gray-500 mt-2">Calculated dynamically</div>
                    </div>
                </div>

                {/* Event Breakdown Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-orbitron font-bold text-white mb-4 flex items-center gap-2">
                        <FileText size={20} className="text-purple-400" /> Event Breakdown
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Object.entries(stats.eventBreakdown).sort((a, b) => b[1] - a[1]).map(([event, count]) => (
                            <div key={event} className="bg-navy-900/50 border border-white/10 rounded-xl p-4 flex justify-between items-center backdrop-blur-sm hover:border-purple-500/50 transition-colors">
                                <span className="text-gray-300 text-sm font-medium truncate pr-2" title={event}>{event}</span>
                                <span className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded text-xs font-bold border border-purple-500/20">
                                    {count}
                                </span>
                            </div>
                        ))}
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
                                    <th className="p-4 font-bold">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="p-12 text-center text-electric-400">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Loader2 className="animate-spin" size={32} />
                                                <span className="text-sm">Loading data...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="p-8 text-center text-gray-500 italic">
                                            {searchTerm ? 'No matching records found.' : 'No registrations found yet.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((reg) => (
                                        <tr key={reg.id} className="hover:bg-white/5 transition-colors text-sm text-gray-300">
                                            <td className="p-4 font-bold text-white">
                                                {reg.name}
                                                {reg.teamCount > 1 && (
                                                    <span className="block text-xs font-normal text-electric-400 mt-1">
                                                        + {reg.teamCount - 1} team members
                                                    </span>
                                                )}
                                            </td>
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
                                            <td className="p-4">
                                                <div className="flex flex-col gap-2">
                                                    {reg.odGenerated && (
                                                        <span className="bg-green-500/10 text-green-400 px-2 py-1 rounded text-[10px] font-bold border border-green-500/20 flex items-center gap-1 w-fit">
                                                            <CheckCircle size={10} /> Enabled
                                                        </span>
                                                    )}
                                                    <button
                                                        onClick={() => handleGenerateOD(reg)}
                                                        disabled={sendingOD === reg.id}
                                                        className="bg-navy-800 hover:bg-navy-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-white/10 flex items-center gap-2"
                                                    >
                                                        {sendingOD === reg.id ? <Loader2 className="animate-spin" size={14} /> : <FileText size={14} />}
                                                        {reg.odGenerated ? "Re-enable OD" : "Enable OD"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Manual Registration Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-navy-900 border border-electric-500/30 rounded-2xl p-8 w-full max-w-lg shadow-[0_0_50px_rgba(45,212,191,0.1)] relative max-h-[90vh] overflow-y-auto"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            >
                                <LogOut size={20} className="rotate-180" />
                            </button>

                            <h2 className="text-2xl font-orbitron font-bold text-white mb-6 flex items-center gap-2">
                                <Users size={24} className="text-electric-400" /> Manual Register
                            </h2>

                            <form onSubmit={handleManualRegister} className="space-y-4">

                                {/* Team Event Toggle */}
                                <div className="flex items-center gap-3 bg-navy-950/50 p-3 rounded-xl border border-white/10">
                                    <input
                                        type="checkbox"
                                        id="teamEvent"
                                        checked={manualForm.isTeamEvent}
                                        onChange={(e) => {
                                            const isTeam = e.target.checked;
                                            setManualForm(prev => ({
                                                ...prev,
                                                isTeamEvent: isTeam,
                                                teamCount: isTeam ? prev.teamCount : 1
                                            }));
                                        }}
                                        className="w-5 h-5 accent-electric-500 rounded cursor-pointer"
                                    />
                                    <label htmlFor="teamEvent" className="text-sm font-bold text-gray-300 cursor-pointer select-none">
                                        This is a Team Event
                                    </label>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase">Name (Leader)</label>
                                        <input required type="text" className="w-full bg-navy-950 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-electric-500"
                                            value={manualForm.name} onChange={e => setManualForm({ ...manualForm, name: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase">Phone</label>
                                        <input required type="text" className="w-full bg-navy-950 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-electric-500"
                                            value={manualForm.phone} onChange={e => setManualForm({ ...manualForm, phone: e.target.value })} />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Email</label>
                                    <input required type="email" className="w-full bg-navy-950 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-electric-500"
                                        value={manualForm.email} onChange={e => setManualForm({ ...manualForm, email: e.target.value })} />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">College</label>
                                    <input required type="text" className="w-full bg-navy-950 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-electric-500"
                                        value={manualForm.college} onChange={e => setManualForm({ ...manualForm, college: e.target.value })} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase">Year</label>
                                        <select className="w-full bg-navy-950 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-electric-500"
                                            value={manualForm.year} onChange={e => setManualForm({ ...manualForm, year: e.target.value })}>
                                            <option value="">Select</option>
                                            <option value="1">1st Year</option>
                                            <option value="2">2nd Year</option>
                                            <option value="3">3rd Year</option>
                                            <option value="4">4th Year</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase">Event</label>
                                        <select
                                            required
                                            className="w-full bg-navy-950 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-electric-500"
                                            value={manualForm.eventName}
                                            onChange={(e) => {
                                                const selectedName = e.target.value;
                                                const allEvents = [...eventsData.technical, ...eventsData.online, ...workshopsData];
                                                const selectedEvent = allEvents.find(ev => ev.title === selectedName);

                                                if (selectedEvent) {
                                                    setManualForm(prev => ({
                                                        ...prev,
                                                        eventName: selectedName,
                                                        price: selectedEvent.price || 0,
                                                        isTeamEvent: selectedEvent.isTeamEvent || false,
                                                        isFixedPrice: selectedEvent.isFixedPrice || false,
                                                        teamCount: (selectedEvent.isTeamEvent || false) ? prev.teamCount : 1,
                                                        // Reset members if switching to non-team event, otherwise keep or adjust
                                                        teamMembers: (selectedEvent.isTeamEvent || false) ? prev.teamMembers : []
                                                    }));
                                                } else {
                                                    setManualForm(prev => ({ ...prev, eventName: selectedName }));
                                                }
                                            }}
                                        >
                                            <option value="">Select Event</option>
                                            <optgroup label="Technical Events">
                                                {eventsData.technical.map(ev => (
                                                    <option key={ev.id} value={ev.title}>{ev.title}</option>
                                                ))}
                                            </optgroup>
                                            <optgroup label="Online Events">
                                                {eventsData.online.map(ev => (
                                                    <option key={ev.id} value={ev.title}>{ev.title}</option>
                                                ))}
                                            </optgroup>
                                            <optgroup label="Workshops">
                                                {workshopsData.map(ws => (
                                                    <option key={ws.id} value={ws.title}>{ws.title}</option>
                                                ))}
                                            </optgroup>
                                        </select>
                                    </div>
                                </div>

                                {/* Team Members Section */}
                                {manualForm.isTeamEvent && (
                                    <div className="space-y-3 pt-4 border-t border-white/10">
                                        <div className="flex justify-between items-center">
                                            <label className="text-sm font-bold text-electric-400">Team Size: {manualForm.teamCount}</label>
                                            <div className="flex gap-2">
                                                <button type="button" onClick={() => adjustTeamCount(-1)} className="p-1 bg-navy-800 rounded border border-white/10 text-white hover:border-electric-500"><Minus size={14} /></button>
                                                <button type="button" onClick={() => adjustTeamCount(1)} className="p-1 bg-navy-800 rounded border border-white/10 text-white hover:border-electric-500"><Plus size={14} /></button>
                                            </div>
                                        </div>

                                        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                            {manualForm.teamMembers.map((member, idx) => (
                                                <div key={idx} className="flex gap-2 items-center">
                                                    <User size={14} className="text-gray-500" />
                                                    <input
                                                        type="text"
                                                        placeholder={`Member ${idx + 2} Name`}
                                                        value={member.name}
                                                        onChange={(e) => updateTeamMember(idx, e.target.value)}
                                                        className="w-full bg-navy-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-electric-500"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="pt-2">
                                    <div className="flex justify-between text-sm mb-2 text-gray-400">
                                        <span>{manualForm.isFixedPrice ? 'Fixed Price:' : 'Price per person:'}</span>
                                        <span>₹{manualForm.price}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold text-white">
                                        <span>Total:</span>
                                        <span className="text-electric-400">
                                            ₹{manualForm.isFixedPrice ? (parseFloat(manualForm.price) || 0) : ((manualForm.teamCount || 1) * (parseFloat(manualForm.price) || 0))}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3 bg-electric-600 hover:bg-electric-500 text-navy-950 font-bold rounded-xl transition-all hover:shadow-[0_0_20px_#2dd4bf] mt-4 flex justify-center items-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit Registration"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Section >
    );
};

export default AdminPanel;
