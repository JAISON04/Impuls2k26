import React, { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import * as XLSX from 'xlsx';
import { Download, Table, Loader2, AlertCircle } from 'lucide-react';
import Section from './Section';

const AdminPanel = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            const q = query(collection(db, "registrations"), orderBy("registeredAt", "desc"));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                registeredAt: doc.data().registeredAt?.toDate().toLocaleString() || 'N/A'
            }));
            setRegistrations(data);
        } catch (err) {
            console.error("Error fetching registrations:", err);
            setError("Failed to load data. Make sure Firestore rules allow access.");
        } finally {
            setLoading(false);
        }
    };

    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(registrations);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
        XLSX.writeFile(workbook, "impulse_registrations.xlsx");
    };

    if (loading) return (
        <div className="min-h-screen bg-navy-950 flex items-center justify-center text-electric-400">
            <Loader2 className="animate-spin" size={48} />
        </div>
    );

    return (
        <Section className="py-24 min-h-screen">
            <div className="w-full max-w-7xl px-4 mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-orbitron font-bold text-white">
                        Admin <span className="text-electric-400">Panel</span>
                    </h1>
                    <button
                        onClick={downloadExcel}
                        className="flex items-center gap-2 bg-electric-600 hover:bg-electric-500 text-navy-950 font-bold px-6 py-3 rounded-xl transition-all"
                    >
                        <Download size={20} /> Export to Excel
                    </button>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-2">
                        <AlertCircle size={20} /> {error}
                    </div>
                )}

                <div className="bg-navy-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 text-electric-300 border-b border-white/10">
                                    <th className="p-4 font-orbitron text-sm uppercase tracking-wider">Name</th>
                                    <th className="p-4 font-orbitron text-sm uppercase tracking-wider">Event</th>
                                    <th className="p-4 font-orbitron text-sm uppercase tracking-wider">College</th>
                                    <th className="p-4 font-orbitron text-sm uppercase tracking-wider">Year</th>
                                    <th className="p-4 font-orbitron text-sm uppercase tracking-wider">Phone</th>
                                    <th className="p-4 font-orbitron text-sm uppercase tracking-wider">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {registrations.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-gray-400">
                                            No registrations found.
                                        </td>
                                    </tr>
                                ) : (
                                    registrations.map((reg) => (
                                        <tr key={reg.id} className="hover:bg-white/5 transition-colors text-sm text-gray-300">
                                            <td className="p-4 font-bold text-white">{reg.name}</td>
                                            <td className="p-4 text-electric-400">{reg.eventName}</td>
                                            <td className="p-4">{reg.college}</td>
                                            <td className="p-4">{reg.year}</td>
                                            <td className="p-4">{reg.phone}</td>
                                            <td className="p-4 text-gray-500 text-xs">{reg.registeredAt}</td>
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
