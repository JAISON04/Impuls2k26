import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


const Countdown = () => {
    // Set target date (February 6, 2026)
    const targetDate = new Date("2026-02-06T09:00:00").getTime();

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference > 0) {
            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((difference % (1000 * 60)) / 1000),
            };
        } else {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const TimeUnit = ({ value, label }) => {
        return (
            <motion.div
                className="flex flex-col items-center mx-1.5 md:mx-2.5"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Number Box with Enhanced Design */}
                <motion.div
                    key={value}
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="relative group"
                >
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-electric-400/20 to-electric-600/20 rounded-xl blur-sm group-hover:blur-md transition-all" />

                    {/* Main Box */}
                    <div className="relative flex items-center justify-center bg-gradient-to-br from-navy-900 to-navy-950 border border-electric-500/40 rounded-xl overflow-hidden w-14 h-16 md:w-16 md:h-20 shadow-[0_0_20px_rgba(45,212,191,0.15)] group-hover:shadow-[0_0_30px_rgba(45,212,191,0.3)] transition-all">
                        {/* Inner Glow */}
                        <div className="absolute inset-0 bg-gradient-to-t from-electric-500/5 to-transparent" />

                        {/* Animated Background Pattern */}
                        <motion.div
                            className="absolute inset-0 opacity-5"
                            animate={{
                                backgroundPosition: ['0% 0%', '100% 100%'],
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            style={{
                                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(45,212,191,0.1) 10px, rgba(45,212,191,0.1) 20px)',
                                backgroundSize: '200% 200%'
                            }}
                        />

                        {/* Number */}
                        <span className="relative z-10 font-mono font-black text-white text-xl md:text-3xl drop-shadow-[0_2px_10px_rgba(45,212,191,0.5)] tracking-tight">
                            {String(value).padStart(2, '0')}
                        </span>
                    </div>
                </motion.div>

                {/* Label */}
                <span className="text-[11px] md:text-xs font-bold text-electric-400 mt-2 uppercase tracking-widest">
                    {label}
                </span>
            </motion.div>
        );
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
                className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6 pt-5 pointer-events-none"
            >
                {/* Main Container with Enhanced Design */}
                <motion.div
                    className="pointer-events-auto relative"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Outer Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-electric-500/20 via-electric-400/20 to-electric-500/20 rounded-full blur-xl" />

                    {/* Main Bar */}
                    <div className="relative bg-gradient-to-r from-navy-900/95 via-navy-950/95 to-navy-900/95 backdrop-blur-2xl border-2 border-electric-500/30 rounded-full px-8 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_60px_rgba(45,212,191,0.15)]">
                        {/* Top Shine Effect */}
                        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent rounded-t-full pointer-events-none" />

                        <div className="relative flex items-center gap-5 md:gap-6">
                            {/* Icon/Label */}
                            <div className="hidden md:flex items-center gap-3">
                                {/* Animated Pulse Dot */}
                                <div className="relative">
                                    <motion.div
                                        className="w-2.5 h-2.5 bg-electric-400 rounded-full"
                                        animate={{
                                            opacity: [1, 0.3, 1],
                                            scale: [1, 1.2, 1],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    />
                                    <motion.div
                                        className="absolute inset-0 bg-electric-400 rounded-full"
                                        animate={{
                                            opacity: [0.6, 0, 0.6],
                                            scale: [1, 2, 1],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    />
                                </div>

                                <span className="text-electric-400 font-bold uppercase tracking-[0.2em] text-sm bg-gradient-to-r from-electric-400 to-electric-500 bg-clip-text text-transparent">
                                    Impulse Launches In
                                </span>
                            </div>

                            {/* Divider */}
                            <div className="hidden md:block w-px h-12 bg-gradient-to-b from-transparent via-electric-500/30 to-transparent" />

                            {/* Counter Grid */}
                            <div className="flex items-center gap-2 md:gap-3">
                                <TimeUnit value={timeLeft.days} label="Days" />
                                <span className="text-electric-500/40 font-bold text-2xl md:text-3xl -mt-2 select-none">:</span>
                                <TimeUnit value={timeLeft.hours} label="Hours" />
                                <span className="text-electric-500/40 font-bold text-2xl md:text-3xl -mt-2 select-none">:</span>
                                <TimeUnit value={timeLeft.minutes} label="Mins" />
                                <span className="text-electric-500/40 font-bold text-2xl md:text-3xl -mt-2 select-none">:</span>
                                <TimeUnit value={timeLeft.seconds} label="Secs" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default Countdown;


