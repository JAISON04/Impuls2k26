import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Section from './Section';
import { motion } from 'framer-motion';
import { Calendar, User, LogOut, Mail, Phone, Clock, MapPin, Loader2, Award, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import generateODPdf from '../utils/generateODPdf';

const Profile = () => {
    const { currentUser, logout } = useAuth();
    const [myEvents, setMyEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) return;

        const fetchMyEvents = async () => {
            try {
                // Fetch registrations for this user's email
                const q = query(
                    collection(db, "registrations"),
                    where("email", "==", currentUser.email)
                );

                const querySnapshot = await getDocs(q);
                const events = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Sort by most recently registered (client-side since we queried by email)
                events.sort((a, b) => b.registeredAt?.seconds - a.registeredAt?.seconds);

                setMyEvents(events);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyEvents();
    }, [currentUser]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const handleDownloadOD = (event) => {
        generateODPdf({
            name: event.name,
            college: event.college,
            year: event.year,
            eventName: event.eventName,
            refId: event.id,
            registeredAt: event.registeredAt?.toDate ? event.registeredAt.toDate().toLocaleDateString() : 'N/A',
            teamMembers: event.teamMembers || []
        });
    };

    if (!currentUser) {
        return (
            <Section className="py-32 min-h-screen flex items-center justify-center text-center">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Please Sign In to view your profile</h2>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-electric-600 text-navy-950 font-bold rounded-lg"
                    >
                        Go Home
                    </button>
                </div>
            </Section>
        );
    }

    return (
        <Section className="py-32 min-h-screen">
            <div className="w-full max-w-6xl mx-auto px-4">

                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-navy-900/50 border border-white/10 rounded-2xl p-8 mb-8 backdrop-blur-sm flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg"
                        >
                            <LogOut size={18} /> Logout
                        </button>
                    </div>

                    <div className="relative">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-electric-500 shadow-[0_0_30px_rgba(45,212,191,0.3)]">
                            <img
                                src={currentUser.photoURL || "https://ui-avatars.com/api/?name=" + currentUser.displayName}
                                alt={currentUser.displayName}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute bottom-0 right-0 p-2 bg-navy-950 rounded-full border border-electric-500 text-electric-400">
                            <User size={16} />
                        </div>
                    </div>

                    <div className="text-center md:text-left pt-2">
                        <h1 className="text-3xl font-orbitron font-bold text-white mb-2">{currentUser.displayName}</h1>
                        <div className="flex flex-col gap-2 text-gray-400">
                            <div className="flex items-center justify-center md:justify-start gap-2">
                                <Mail size={16} className="text-electric-400" />
                                <span>{currentUser.email}</span>
                            </div>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-xs bg-electric-500/10 text-electric-300 py-1 px-3 rounded-full w-fit mx-auto md:mx-0">
                                <Award size={14} />
                                <span>Impulse 2026 Participant</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* My Events Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-orbitron font-bold text-white mb-6 flex items-center gap-3">
                        <Calendar className="text-electric-400" /> My Registrations
                    </h2>

                    {loading ? (
                        <div className="flex py-12 justify-center text-electric-400">
                            <Loader2 className="animate-spin" size={40} />
                        </div>
                    ) : myEvents.length === 0 ? (
                        <div className="bg-navy-900/30 border border-white/5 rounded-2xl p-12 text-center">
                            <p className="text-gray-400 mb-6 text-lg">You haven't registered for any events yet.</p>
                            <button
                                onClick={() => navigate('/events')}
                                className="px-8 py-3 bg-gradient-to-r from-electric-600 to-electric-400 text-navy-950 font-bold rounded-xl hover:scale-105 transition-transform"
                            >
                                Browse Events
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myEvents.map((event) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-navy-900/40 border border-white/10 rounded-xl overflow-hidden hover:border-electric-500/30 transition-all group"
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-xl font-bold text-white group-hover:text-electric-300 transition-colors">{event.eventName}</h3>
                                            <span className="text-xs font-mono text-gray-500 border border-white/10 px-2 py-1 rounded">
                                                {event.category || 'Event'}
                                            </span>
                                        </div>

                                        <div className="space-y-3 text-sm text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <User size={14} className="text-electric-500" />
                                                <span>{event.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone size={14} className="text-electric-500" />
                                                <span>{event.phone}</span>
                                            </div>
                                            {event.registeredAt && (
                                                <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-white/5 mt-4">
                                                    <Clock size={12} />
                                                    <span>Registered on {event.registeredAt.toDate ? event.registeredAt.toDate().toLocaleDateString() : 'Unknown date'}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="h-1 w-full bg-gradient-to-r from-electric-500 to-transparent opacity-50" />

                                    {/* OD Download Section */}
                                    <div className="p-4 bg-navy-950/50 border-t border-white/5">
                                        {event.odGenerated ? (
                                            <button
                                                onClick={() => handleDownloadOD(event)}
                                                className="w-full px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/20 transition-colors flex items-center justify-center gap-2 font-bold text-sm"
                                            >
                                                <Download size={16} />
                                                Download OD Letter
                                            </button>
                                        ) : (
                                            <div className="w-full px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 flex items-center justify-center gap-2 text-sm">
                                                <Clock size={16} />
                                                OD Letter Pending
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </Section>
    );
};

export default Profile;
