import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Phone } from 'lucide-react';
import Section from './Section';
import blessie from '../assets/images/Blessie-pic.png'
import harikesh from "../assets/images/Harikesh-pic.jpeg"
import kamal from "../assets/images/kamal-pic.jpg"

const CoordinatorCard = ({ name, role, image, delay, number }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: delay }}
        viewport={{ once: true }}
        className="group relative w-full max-w-sm md:w-[26rem]"
    >
        {/* Card Container with Glassmorphism */}
        <div className="relative overflow-hidden rounded-3xl bg-navy-900/60 backdrop-blur-xl border border-white/10 p-10 flex flex-col items-center transition-all duration-500 group-hover:-translate-y-4 group-hover:border-electric-400 group-hover:shadow-[0_20px_50px_rgba(45,212,191,0.3)]">

            {/* Animated Gradient Border (Top) */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-electric-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

            {/* Image Container with "Energy Ring" */}
            <div className="relative mb-9">
                {/* Intense Outer Glow on Hover */}
                <div className="absolute -inset-4 rounded-full bg-electric-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <motion.div
                    className="relative w-56 h-56 rounded-full p-2 bg-gradient-to-b from-electric-400 via-electric-600 to-navy-900 shadow-[0_0_30px_rgba(45,212,191,0.5)] overflow-hidden"
                    whileHover={{ scale: 1.1, rotate: [0, -2, 2, 0] }}
                    transition={{
                        scale: { type: "spring", stiffness: 300, damping: 10 },
                        rotate: { duration: 0.4, ease: "easeInOut" }
                    }}
                >
                    <img
                        src={image}
                        alt={name}
                        className={name === "Kamalanathan" ? "w-full h-full object-cover rounded-full filter grayscale group-hover:grayscale-0 transition-all duration-700" : "w-full h-full object-fit rounded-full filter grayscale group-hover:grayscale-0 transition-all duration-700"}
                    />
                </motion.div>

                {/* Floating Zap Icon */}
                <motion.div
                    className="absolute bottom-2 right-2 bg-navy-950 p-3 rounded-full border-2 border-electric-400 shadow-[0_0_20px_#2dd4bf] z-20"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: delay + 0.5, type: "spring" }}
                >
                    <Zap size={24} className="text-electric-400 fill-current" />
                </motion.div>
            </div>

            {/* Content */}
            <div className="text-center w-full relative z-10">
                <h3 className="text-3xl md:text-4xl font-black text-white mb-2 group-hover:text-electric-300 transition-colors tracking-tight">
                    {name}
                </h3>
                <div className="h-0.5 w-12 bg-electric-500 mx-auto mb-4 opacity-50 group-hover:w-24 group-hover:opacity-100 transition-all duration-500" />
                <p className="text-electric-400 font-mono text-base md:text-lg tracking-widest uppercase mb-8">
                    {role}
                </p>

                {/* Social Actions (Scale up) */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex justify-between items-center hover:border-electric-700/30 transition-colors">
                    <p>Contact</p>
                    <p className='flex items-center gap-1 text-xs text-electric-400 hover:text-electric-300 bg-electric-500/10 px-2 py-1 rounded'> <Phone size={12} /> {number}</p>
                </div>
            </div>

            {/* Background Glow Pulse */}
            <div className="absolute inset-0 bg-gradient-to-t from-electric-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>
    </motion.div>
);

const Coordinators = () => {
    const coordinators = [
        { name: "Harikesh", role: "STUDENT COORDINATOR", image: harikesh, number: "63803 25509" },
        { name: "Kamalanathan", role: "STUDENT COORDINATOR", image: kamal, number: "79048 49032" },
        { name: "Blessie Pearlyn", role: "STUDENT COORDINATOR", image: blessie, number: "63740 85148" }

    ];

    return (
        <Section id="coordinators">
            <div className="relative z-10 text-center mb-20">
                <h2 className="text-4xl md:text-6xl font-black text-white relative inline-block drop-shadow-[0_0_15px_rgba(45,212,191,0.3)]">
                    MEET THE COORDINATORS
                    <motion.div
                        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-1/2 h-2 bg-electric-500 rounded-full"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 0.8 }}
                    />
                </h2>
                <p className="mt-8 text-xl text-gray-400 max-w-2xl mx-auto font-light">
                    Leading the charge. Powering the future.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full max-w-7xl mx-auto px-4 justify-items-center">
                {coordinators.map((coord, index) => (
                    <CoordinatorCard
                        key={index}
                        name={coord.name}
                        role={coord.role}
                        image={coord.image}
                        delay={index * 0.2}
                        number={coord.number}
                    />
                ))}
            </div>
        </Section>
    );
};

export default Coordinators;
