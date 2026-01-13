import React, { useState } from 'react';
import Section from './Section';
import { motion, AnimatePresence } from 'framer-motion';
import { eventsData, EventCard, EventDetailsModal } from './Events';

const OnlineEvents = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const onlineEvents = eventsData.online;

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
