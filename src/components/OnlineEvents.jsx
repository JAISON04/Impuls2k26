import React, { useState, useEffect } from 'react';
import Section from './Section';
import { motion, AnimatePresence } from 'framer-motion';
import { EventCard, EventDetailsModal } from './Events';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Loader2 } from 'lucide-react';
import { getImageByTitle } from '../utils/imageMap';

const OnlineEvents = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [onlineEvents, setOnlineEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOnlineEvents = async () => {
            try {
                const q = query(collection(db, "events"), where("category", "==", "Online"));
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    image: getImageByTitle(doc.data().title) // Resolve image
                }));
                setOnlineEvents(data);
            } catch (error) {
                console.error("Error fetching online events:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOnlineEvents();
    }, []);

    if (loading) {
        return (
            <Section className="py-24 min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-electric-500" size={48} />
                    <p className="text-electric-400 font-orbitron tracking-wider">Loading Online Events...</p>
                </div>
            </Section>
        );
    }

    return (
        <Section id="online-events" className="py-24">
            <div className="text-center mb-16">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 mb-4 font-orbitron"
                >
                    ONLINE EVENTS
                </motion.h2>
                <div className="h-1 w-24 bg-electric-500 mx-auto rounded-full shadow-[0_0_20px_#2dd4bf]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {onlineEvents.map((event) => (
                    <EventCard key={event.id} event={event} onClick={setSelectedEvent} />
                ))}
            </div>

            <AnimatePresence>
                {selectedEvent && (
                    <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
                )}
            </AnimatePresence>
        </Section>
    );
};

export default OnlineEvents;

