import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, User, Calendar, Clock, MapPin, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Section from './Section';
import { getImageByTitle } from '../utils/imageMap';

const WorkshopDetailsModal = ({ workshop, onClose }) => {
    const navigate = useNavigate();

    useEffect(() => {
        // Prevent background scrolling when modal is open
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    if (!workshop) return null;

    const handleRegister = () => {
        navigate('/register', {
            state: {
                eventName: workshop.title,
                category: 'Workshop',
                price: workshop.price ?? 5,
                isTeamEvent: workshop.isTeamEvent || false,
                minTeamSize: workshop.minTeamSize || 1,
                maxTeamSize: workshop.maxTeamSize || 1,
                rules: workshop.rules
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
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-electric-500 hover:text-navy-950 transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Image Section */}
                <div className="w-full md:w-2/5 h-64 md:h-auto relative">
                    <img
                        src={workshop.image}
                        alt={workshop.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent md:bg-gradient-to-r" />
                </div>

                {/* Content Section */}
                <div className="w-full md:w-3/5 p-8 overflow-y-auto">
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-2 font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-electric-300 to-white">
                        {workshop.title}
                    </h2>

                    {workshop.club && (
                        <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-navy-950 bg-electric-400 rounded-full">
                            By {workshop.club}
                        </span>
                    )}

                    <p className="text-gray-300 mb-6 leading-relaxed">
                        {workshop.details || workshop.desc}
                    </p>

                    {/* Basic Info Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="flex items-center gap-2 text-gray-400">
                            <Calendar className="text-electric-400" size={18} />
                            <span>Feb 5</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <Clock className="text-electric-400" size={18} />
                            <span>Full Day</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 col-span-2">
                            <MapPin className="text-electric-400" size={18} />
                            <span>CIT Campus</span>
                        </div>
                    </div>

                    {/* Coordinators */}
                    {workshop.coordinators && workshop.coordinators.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-electric-300 mb-4 flex items-center gap-2">
                                <User size={20} /> Coordinators
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {workshop.coordinators.map((coord, idx) => (
                                    <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-3 flex justify-between items-center hover:border-electric-500/30 transition-colors">
                                        <span style={{ fontSize: "15px" }} className=" text-gray-200">{coord.name}</span>
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

                    {/* Register Button */}
                    <button
                        onClick={handleRegister}
                        className="w-full py-4 bg-gradient-to-r from-electric-600 to-electric-400 text-navy-950 font-black text-lg uppercase tracking-widest rounded-xl hover:shadow-[0_0_30px_#2dd4bf] hover:scale-[1.02] transition-all"
                    >
                        Register Now
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const WorkshopCard = ({ workshop, index, onClick }) => (
    <motion.div
        className="group relative h-[400px] rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
        onClick={() => onClick(workshop)}
    >
        {/* Background Image */}
        <div className="absolute inset-0">
            <img
                src={workshop.image}
                alt={workshop.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-transparent opacity-90 group-hover:opacity-75 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-2xl font-bold text-white mb-3 font-orbitron group-hover:text-electric-300 transition-colors">
                {workshop.title}
            </h3>
            <p className="text-gray-300 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                {workshop.desc}
            </p>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 bg-electric-500/10 border border-electric-500 text-electric-400 font-bold rounded-lg uppercase tracking-wider hover:bg-electric-500 hover:text-navy-950 transition-all"
            >
                View Details
            </motion.button>
        </div>

        {/* Border Effect */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-electric-500/30 rounded-2xl transition-colors duration-300 pointer-events-none" />
    </motion.div>
);

const Workshops = ({ previewMode = false }) => {
    const [selectedWorkshop, setSelectedWorkshop] = useState(null);
    const [workshops, setWorkshops] = useState([]);
    const [loading, setLoading] = useState(!previewMode);

    useEffect(() => {
        const fetchWorkshops = async () => {
            try {
                const q = query(collection(db, "workshops"));
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    image: getImageByTitle(doc.data().title) // Resolve image
                })).filter(workshop => !workshop.title.toLowerCase().includes('astronomy'));
                setWorkshops(data);
            } catch (error) {
                console.error("Error fetching workshops:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkshops();
    }, []); // Empty dependency array - fetch only once on mount

    const displayedWorkshops = previewMode ? workshops.slice(0, 3) : workshops;

    if (loading) {
        return (
            <Section className="py-24 min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-electric-500" size={48} />
                    <p className="text-electric-400 font-orbitron tracking-wider">Loading Workshops...</p>
                </div>
            </Section>
        );
    }

    return (
        <Section id="workshops" className="bg-navy-950/50 min-h-screen py-24">
            <div className="text-center mb-16">
                <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="text-4xl md:text-6xl font-black text-white mb-4 font-orbitron"
                >
                    WORKSHOPS
                </motion.h2>
                <p className="text-electric-300 text-lg tracking-widest uppercase">Hands-on Learning</p>
                <div className="h-1 w-24 bg-electric-500 mx-auto rounded-full shadow-[0_0_20px_#2dd4bf] mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedWorkshops.map((workshop, index) => (
                    <WorkshopCard key={workshop.id} workshop={workshop} index={index} onClick={setSelectedWorkshop} />
                ))}
            </div>

            {/* View More Button */}
            {previewMode && (
                <div className="mt-12 text-center">
                    <button
                        onClick={() => window.location.href = '/workshops'}
                        className="px-8 py-3 bg-transparent border border-electric-500 text-electric-400 font-bold rounded-lg uppercase tracking-wider hover:bg-electric-500 hover:text-navy-950 transition-all shadow-[0_0_15px_rgba(45,212,191,0.2)]"
                    >
                        View More Workshops
                    </button>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {selectedWorkshop && (
                    <WorkshopDetailsModal workshop={selectedWorkshop} onClose={() => setSelectedWorkshop(null)} />
                )}
            </AnimatePresence>
        </Section>
    );
};

export default Workshops;

