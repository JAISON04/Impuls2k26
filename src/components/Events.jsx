import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, User, Calendar, Clock, MapPin, Globe, Camera, PenTool, Video, Cpu, Zap, Lock, FileCode, Terminal } from 'lucide-react'; // Added icons
import { useNavigate } from 'react-router-dom';
import Section from './Section';

// Import Event Images
import paperPres from '../assets/images/paper presentation.png';
import projectPres from '../assets/images/imageposter.png';
import circuitDebug from '../assets/images/imagecircuit.png';
import wiring from '../assets/images/imagewiring.png';
import connections from '../assets/images/imageconnection.png';
import techQuiz from '../assets/images/imagequiz.png';
import ecad from '../assets/images/cad.avif';
import photo from '../assets/images/imagephotpo.png'; // For Photography
import posterDesign from '../assets/images/imageposter.png'; // Reusing for Poster Design
import aiVideo from '../assets/images/imagevideo.png'; // Reusing for AI Video
import lastLogin from '../assets/images/imageentre.png'; // Placeholder
import electrolink from '../assets/images/imageiot.png'; // Placeholder
import blackout from '../assets/images/imagedebate.png'; // Placeholder

export const eventsData = {
    technical: [
        {
            id: 1,
            title: 'Circuit Debugging',
            image: circuitDebug,
            desc: 'Find the faults and fix the circuits.',
            details: 'Test your electronics skills by identifying and fixing faults in complex circuits within a time limit. A challenge for the sharpest minds in circuitry.',
            coordinators: [
                { name: 'Madan Prakash K S', contact: '98402 15374' },
                { name: 'Pragadhiswari P', contact: '94448 58213' },
            ],
            rules: [
                'Individual participation or team of 2.',
                'Debugging tools will be provided.',
                'Time limit: 45 minutes.',
                'Judges decision is final.'
            ]
        },
        {
            id: 2,
            title: 'Wiring Challenge',
            image: wiring,
            desc: 'Master the art of electrical connections.',
            details: 'A competition to test your speed and accuracy in electrical wiring and circuit connections. Precision and safety are key.',
            coordinators: [
                { name: 'Divainy J', contact: '80725 13973' },
                { name: 'Dharshini R', contact: '63833 45731' }
            ],
            rules: [
                'Team of 2 members.',
                'Safety gear (gloves) must be worn.',
                'Circuit diagram will be provided.',
                'Judges decision is final.'
            ]
        },
        {
            id: 3,
            title: 'Technical Quiz',
            image: techQuiz,
            desc: 'Test your technical knowledge.',
            details: 'Battle of brains! Answer technical questions and prove your expertise in various engineering domains. From basics to advanced concepts.',
            coordinators: [
                { name: "R kishore", contact: "63699 02036" },
                { name: 'Vimal Deep A L', contact: '96297 91556' }
            ],
            rules: [
                'Team of 2 members.',
                'No electronic gadgets allowed.',
                'Quiz specific rules will be announced on spot.',
                'Judges decision is final.'
            ]
        },
        {
            id: 4,
            title: 'Paper Presentation',
            image: paperPres,
            desc: 'Showcase your innovative ideas and research.',
            details: 'Present your technical papers on cutting-edge technologies. A platform to share knowledge, innovations, and research findings with a panel of experts.',
            coordinators: [
                { name: 'J Jerauld Alwin', contact: '94983 50881' },
                { name: 'Jaya Sudha', contact: '63827 55248' },

            ],
            rules: [
                'Maximum 3 members per team.',
                'Abstract must be submitted before the deadline.',
                'Presentation time: 7 mins + 3 mins Q&A.',
                'Judges decision is final.'
            ]
        },
        {
            id: 5,
            title: 'Project Presentation',
            image: projectPres,
            desc: 'Visualise your technical concepts creatively.',
            details: 'Demonstrate your engineering projects and prototypes. Impress the judges with your practical implementation and innovative solutions.',
            coordinators: [
                { name: 'Theeran K', contact: '96260 72477' },
                { name: 'Sudharsan S', contact: '80500 24271' }
            ],
            rules: [
                'Maximum 3 members per team.',
                'Prototype must be working.',
                'Power supply will be provided.',
                'Judges decision is final.'
            ]
        },
        {
            id: 6,
            title: 'E-Cadathon',
            image: ecad,
            desc: 'Design complex electrical systems.',
            details: 'Showcase your CAD skills by designing electrical layouts and systems efficiently using industry-standard software.',
            coordinators: [
                { name: 'B Bragadeeshwaran', contact: '90428 51602' },
                { name: "V Mathivanan", contact: "93636 14486" }
            ],
            rules: [
                'Individual participation.',
                'Software provided: AutoCAD/Eagle.',
                'Time limit: 1 hour.',
                'Judges decision is final.'
            ]
        },
        {
            id: 7,
            title: 'Last Login',
            image: lastLogin,
            desc: 'Unlock the digital mysteries.',
            details: 'Hosted by Club Celestial. A challenge of logic, coding, and problem-solving. Can you crack the code before time runs out?',
            club: 'Club Celestial',
            coordinators: [{ name: "Rudra Prasad M L", contact: "80720 29917" },
            { name: "Adhisaya", contact: "90428 70525" }
            ],
            rules: [
                'Team of 2 members.',
                'Laptop required.',
                'Judges decision is final.'
            ]
        },
        {
            id: 8,
            title: 'Electrolink',
            image: electrolink,
            desc: 'Forge the connections.',
            details: 'A circuit design and linking challenge. Understand the flow, connect the components, and make the system live.',
            coordinators: [{ name: "G Kavin Aravind", contact: "63828 63773" },
            { name: "T Rajamathi", contact: "87780 03748" }
            ],
            rules: [
                'Team of 2 members.',
                'Components provided.',
                'Judges decision is final.'
            ]
        },
        {
            id: 9,
            title: 'Blackout Files',
            image: blackout,
            desc: 'Decode the hidden data.',
            details: 'A mystery solving event where technical clues lead to the solution. Analyze the data and find the truth in the blackout.',
            coordinators: [{ name: "Roseni M", contact: " 73051 08002" },
            { name: "Shivani Sri S", contact: "91502 04514" }
            ],
            rules: [
                'Team of 2-3 members.',
                'Critical thinking required.',
                'Judges decision is final.'
            ]
        }
    ],
    online: [
        {
            id: 101,
            title: 'Photography',
            image: photo,
            desc: 'Capture the moment.',
            details: 'Showcase your perspective through the lens. Theme-based photography contest where creativity meets composition.',
            coordinators: [{ name: "Priyadharshini S", contact: "96770 74387" }
            ],
            rules: [
                'Individual participation.',
                'Original photos only.',
                'No heavy editing allowed.',
                'Submit before deadline.'
            ]
        },
        {
            id: 102,
            title: 'Poster Designing',
            image: posterDesign,
            desc: 'Design with impact.',
            details: 'Create compelling visual posters. Combine art and information to convey a powerful message.',
            coordinators: [{ name: "Rasikka S", contact: "88385 59060" }
            ],
            rules: [
                'Individual participation.',
                'Original designs only.',
                'Submit in high resolution.',
                'Judges decision is final.'
            ]
        },
        {
            id: 103,
            title: 'AI Video Creation',
            image: aiVideo,
            desc: 'Generate the future.',
            details: 'Create amazing videos using AI tools. Push the boundaries of creativity with artificial intelligence.',
            coordinators: [{ name: "Kasthuri S", contact: "91508 69769" }],
            rules: [
                'Individual participation.',
                'AI tools allowed.',
                'Max duration: 2 minutes.',
                'Judges decision is final.'
            ]
        }
    ]
};

export const EventDetailsModal = ({ event, onClose }) => {
    const navigate = useNavigate();

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
                            <span>Feb 2026</span>
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

export const EventCard = ({ event, onClick }) => {
    // Select icon based on event category or title keywords (simplified visual cue)
    const getTypeIcon = () => {
        if (event.id > 100) return <Globe size={16} />;
        return <Cpu size={16} />;
    };

    return (
        <motion.div
            className="group relative overflow-hidden rounded-xl bg-navy-900/40 border border-electric-500/20 shadow-lg hover:shadow-[0_0_30px_rgba(45,212,191,0.3)] transition-all duration-300 cursor-pointer"
            whileHover={{ y: -10, scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onClick={() => onClick(event)}
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
                        View Details
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

    const displayedEvents = previewMode
        ? eventsData.technical.slice(0, 3)
        : eventsData[activeTab];

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
