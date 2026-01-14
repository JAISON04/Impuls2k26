import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


const Countdown = () => {
    // Set target date (February 6, 2026)
    const targetDate = new Date("2026-02-06T09:00:00").getTime();

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    // Always fixed at the bottom now
    const isFixed = true;

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
            <div className="flex flex-col items-center mx-1 md:mx-2">
                <div className="relative group">
                    {/* Main Number Box - Compact for Fixed Bar */}
                    <div className="relative flex items-center justify-center bg-navy-950 border border-electric-500/50 shadow-[0_0_10px_rgba(45,212,191,0.2)] rounded-lg overflow-hidden w-10 h-10 md:w-12 md:h-12">
                        <span className="font-mono font-bold text-white text-base md:text-lg">
                            {String(value).padStart(2, '0')}
                        </span>
                    </div>
                </div>

                {/* Label */}
                <span className="text-[10px] md:text-xs font-medium text-electric-400 mt-1 uppercase tracking-wider">{label}</span>
            </div>
        );
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-4 pt-4 pointer-events-none"
            >
                <div className="pointer-events-auto bg-navy-900/80 backdrop-blur-xl border border-electric-500/30 rounded-full px-6 py-2 flex items-center gap-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]">

                    {/* Label */}
                    <div className="hidden md:block mr-2">
                        <span className="text-electric-500 font-bold uppercase tracking-widest text-xs">Launch In:</span>
                    </div>

                    {/* Counter Grid */}
                    <div className="flex items-center gap-1">
                        <TimeUnit value={timeLeft.days} label="d" />
                        <span className="text-electric-500/50 -mt-4">:</span>
                        <TimeUnit value={timeLeft.hours} label="h" />
                        <span className="text-electric-500/50 -mt-4">:</span>
                        <TimeUnit value={timeLeft.minutes} label="m" />
                        <span className="text-electric-500/50 -mt-4">:</span>
                        <TimeUnit value={timeLeft.seconds} label="s" />
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default Countdown;


