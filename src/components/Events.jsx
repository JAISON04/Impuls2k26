import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, User, Calendar, Clock, MapPin, Globe, Camera, PenTool, Video, Cpu, Zap, Lock, FileCode, Terminal, Loader2 } from 'lucide-react'; // Added icons
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Section from './Section';
import { getImageByTitle } from '../utils/imageMap';

import { useAuth } from '../context/AuthContext';

export const EventDetailsModal = ({ event, onClose }) => {
    const navigate = useNavigate();
    const { currentUser, googleSignIn } = useAuth();

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    if (!event) return null;

    const handleRegister = () => {
        navigate('/register', {
            state: {
                eventName: event.title,
                category: 'Event',
                price: event.price || 5,
                isTeamEvent: event.isTeamEvent || false,
                minTeamSize: event.minTeamSize || 1,
                maxTeamSize: event.maxTeamSize || 1,
                isFixedPrice: event.isFixedPrice || false,
                rules: event.rules
            }
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-4xl bg-navy-900 border border-electric-500/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(45,212,191,0.2)] flex flex-col md:flex-row max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-electric-500 hover:text-navy-950 transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="w-full md:w-2/5 h-64 md:h-auto relative">
                    <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent md:bg-gradient-to-r" />
                </div>

                <div className="w-full md:w-3/5 p-8 overflow-y-auto">
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-2 font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-electric-300 to-white">
                        {event.title}
                    </h2>

                    {event.club && (
                        <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-navy-950 bg-electric-400 rounded-full">
                            {event.club}
                        </span>
                    )}

                    <p className="text-gray-300 mb-6 leading-relaxed">
                        {event.details || event.desc}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="flex items-center gap-2 text-gray-400">
                            <Calendar className="text-electric-400" size={18} />
                            <span>Feb 5</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <Clock className="text-electric-400" size={18} />
                            <span>10:00 AM</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 col-span-2">
                            <MapPin className="text-electric-400" size={18} />
                            <span>CIT Campus{event.id > 100 ? ' (Online)' : ''}</span>
                        </div>
                    </div>

                    {event.coordinators && event.coordinators.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-electric-300 mb-4 flex items-center gap-2">
                                <User size={20} /> Event Coordinators
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-[calc(100%+30px)] -ml-[15px]">
                                {event.coordinators.map((coord, idx) => (
                                    <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-3 flex justify-between items-center hover:border-electric-600/30 transition-colors">
                                        <span style={{ fontSize: '15px' }} className=" text-gray-200">{coord.name}</span>
                                        {coord.contact && (
                                            <a href={`tel:${coord.contact} `} className="flex items-center gap-1 text-xs text-electric-400 hover:text-electric-300 bg-electric-500/10 px-2 py-1 rounded">
                                                <Phone size={12} /> {coord.contact}
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentUser ? (
                        <button
                            onClick={handleRegister}
                            className="w-full py-4 bg-gradient-to-r from-electric-600 to-electric-400 text-navy-950 font-black text-lg uppercase tracking-widest rounded-xl hover:shadow-[0_0_30px_#2dd4bf] hover:scale-[1.02] transition-all"
                        >
                            Register Now
                        </button>
                    ) : (
                        <button
                            onClick={googleSignIn}
                            className="w-full py-4 bg-transparent border-2 border-electric-500 text-electric-400 font-black text-lg uppercase tracking-widest rounded-xl hover:bg-electric-500 hover:text-navy-950 transition-all flex items-center justify-center gap-2"
                        >
                            <User size={20} /> Sign In to Register
                        </button>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export const EventCard = ({ event, onClick }) => {
    // Select icon based on event category or title keywords (simplified visual cue)
    const getTypeIcon = () => {
        if (event.id > 100) return <Globe size={16} />;
        return <Cpu size={16} />;
    };

    const handleClick = () => {
        if (event.externalUrl) {
            window.open(event.externalUrl, '_blank');
        } else {
            onClick(event);
        }
    };

    return (
        <motion.div
            className="group relative overflow-hidden rounded-xl bg-navy-900/40 border border-electric-500/20 shadow-lg hover:shadow-[0_0_30px_rgba(45,212,191,0.3)] transition-all duration-300 cursor-pointer"
            whileHover={{ y: -10, scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onClick={handleClick}
        >
            <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 to-transparent z-10 opacity-60 group-hover:opacity-30 transition-opacity" />
                <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-md p-2 rounded-full text-electric-400 border border-electric-500/30">
                    {getTypeIcon()}
                </div>
            </div>

            <div className="p-6 relative z-20">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-electric-300 transition-colors duration-300 font-orbitron">
                    {event.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2 group-hover:text-gray-300">
                    {event.desc}
                </p>
                <div className="flex justify-between items-center mt-4">
                    <span className="text-xs font-bold tracking-wider text-electric-400 uppercase border border-electric-500/30 px-3 py-1 rounded group-hover:bg-electric-500 group-hover:text-navy-950 transition-all">
                        {event.externalUrl ? 'Register on Unstop' : 'View Details'}
                    </span>
                    {event.club && (
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest">{event.club}</span>
                    )}
                </div>
            </div>

            <div className="absolute inset-0 border border-transparent group-hover:border-electric-500/50 rounded-xl transition-all duration-300 pointer-events-none" />
        </motion.div>
    );
};

const Events = ({ previewMode = false }) => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [activeTab, setActiveTab] = useState('technical'); // 'technical' or 'online'
    const [technicalEvents, setTechnicalEvents] = useState([]);
    const [onlineEvents, setOnlineEvents] = useState([]);
    const [loading, setLoading] = useState(!previewMode);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Fetch Technical Events
                const techQuery = query(collection(db, "events"), where("category", "==", "Technical"));
                const techSnapshot = await getDocs(techQuery);
                const techData = techSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    image: getImageByTitle(doc.data().title) // Resolve image
                }));

                // Fetch Online Events
                const onlineQuery = query(collection(db, "events"), where("category", "==", "Online"));
                const onlineSnapshot = await getDocs(onlineQuery);
                const onlineData = onlineSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    image: getImageByTitle(doc.data().title) // Resolve image
                }));

                setTechnicalEvents(techData);
                setOnlineEvents(onlineData);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [previewMode]);

    const displayedEvents = previewMode
        ? technicalEvents.slice(0, 3) // This might need adjustment if logic requires specific preview data
        : (activeTab === 'technical' ? technicalEvents : onlineEvents);

    // Initial load for preview mode if needed or just use current state if available. 
    // Actually for preview mode reusing fetched data or passed props is better. 
    // For now assuming previewMode might just use what we have or we can fetch a few.
    // Let's keep it simple: if previewMode, maybe we just don't load? 
    // Or we should fetch just a few?
    // The previous code used imported data. 
    // Let's fetch all for simplicity now, or maybe the parent passes data?
    // For now, let's just fetch all.

    if (loading) {
        return (
            <Section className="py-24 min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-electric-500" size={48} />
                    <p className="text-electric-400 font-orbitron tracking-wider">Loading Events...</p>
                </div>
            </Section>
        );
    }

    return (
        <Section id="events" className="py-24">
            <div className="text-center mb-12">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 mb-4 font-orbitron"
                >
                    EVENTS
                </motion.h2>
                <div className="h-1 w-24 bg-electric-500 mx-auto rounded-full shadow-[0_0_20px_#2dd4bf]" />
            </div>

            {/* Custom Tabs */}
            {!previewMode && (
                <div className="flex justify-center mb-12">
                    <div className="flex bg-navy-900/50 p-1 rounded-full border border-white/10 backdrop-blur-sm">
                        <button
                            onClick={() => setActiveTab('technical')}
                            className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === 'technical'
                                ? 'bg-electric-500 text-navy-950 shadow-[0_0_15px_rgba(45,212,191,0.4)]'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Technical
                        </button>
                        <button
                            onClick={() => setActiveTab('online')}
                            className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === 'online'
                                ? 'bg-electric-500 text-navy-950 shadow-[0_0_15px_rgba(45,212,191,0.4)]'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Online
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedEvents.map((event) => (
                    <EventCard key={event.id} event={event} onClick={setSelectedEvent} />
                ))}
            </div>

            {previewMode && (
                <div className="mt-12 text-center">
                    <button
                        onClick={() => window.location.href = '/events'}
                        className="px-8 py-3 bg-transparent border border-electric-500 text-electric-400 font-bold rounded-lg uppercase tracking-wider hover:bg-electric-500 hover:text-navy-950 transition-all shadow-[0_0_15px_rgba(45,212,191,0.2)]"
                    >
                        View More Events
                    </button>
                </div>
            )}

            <AnimatePresence>
                {selectedEvent && (
                    <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
                )}
            </AnimatePresence>
        </Section>
    );
};

export default Events;
