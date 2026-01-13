import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Section from './Section';

const Countdown = () => {
    // Set target date (e.g., 2 weeks from now)
    const targetDate = new Date("2026-03-24T09:00:00").getTime();

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const [isSticky, setIsSticky] = useState(false);

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

        // Optimized scroll handler using requestAnimationFrame
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setIsSticky(window.scrollY > 600);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            clearInterval(timer);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const TimeUnit = ({ value, label }) => {
        return (
            <div className={`flex flex-col items-center mx-2 md:mx-4 transition-all duration-500 ${isSticky ? 'mx-1 md:mx-1' : ''}`}>
                <div className="relative group">
                    {/* Decorative Circuit Lines - Hide when sticky */}
                    <div className={`absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-4 bg-electric-500/50 transition-opacity ${isSticky ? 'opacity-0' : 'opacity-100'}`} />
                    <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-4 bg-electric-500/50 transition-opacity ${isSticky ? 'opacity-0' : 'opacity-100'}`} />

                    {/* Main Number Box */}
                    <motion.div
                        key={value}
                        initial={{ scale: 0.9, opacity: 0.8 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`relative flex items-center justify-center bg-navy-950 border-2 border-electric-500 shadow-[0_0_20px_rgba(45,212,191,0.3)] rounded-lg overflow-hidden transition-all duration-500 ${isSticky
                            ? 'w-10 h-10 md:w-12 md:h-12 border'
                            : 'w-20 h-24 md:w-32 md:h-40'
                            }`}
                    >
                        {/* Background Grid - Hide when sticky for cleaner look */}
                        <div className={`absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 ${isSticky ? 'hidden' : 'block'}`} />

                        <span className={`relative z-10 font-mono font-black text-white drop-shadow-[0_0_10px_rgba(45,212,191,0.8)] transition-all duration-500 ${isSticky ? 'text-lg md:text-xl' : 'text-4xl md:text-7xl'
                            }`}>
                            {String(value).padStart(2, '0')}
                        </span>
                    </motion.div>
                </div>

                {/* Label with technical look */}
                <div className={`mt-4 flex items-center space-x-2 transition-all duration-500 ${isSticky ? 'mt-1 scale-75' : ''} ${isSticky ? 'hidden' : 'flex'}`}>
                    {/* Hide label completely in sticky mode to save space, or keep it tiny? 'Hidden' is cleaner for a small widget */}
                    <div className="w-2 h-2 bg-electric-500 rounded-full animate-pulse" />
                    <span className="text-sm md:text-base font-bold text-electric-300 tracking-[0.2em] uppercase">{label}</span>
                    <div className="w-2 h-2 bg-electric-500 rounded-full animate-pulse" />
                </div>
            </div>
        );
    };

    return (
        // Wrapper Section maintains height to prevent layout shift when content goes fixed
        <Section id="countdown" className="relative min-h-[400px] flex items-center justify-center">
            <div className={`flex flex-col items-center transition-all duration-700 ease-in-out z-50 ${isSticky
                ? 'fixed top-4 right-4 scale-75 md:scale-90 origin-top-right bg-navy-900/90 backdrop-blur-md p-2 rounded-xl border border-electric-500/30 shadow-2xl'
                : 'relative w-full py-20 bg-navy-950/50 backdrop-blur-sm'
                }`}>

                {/* Title - Hide when sticky */}
                <div className={`flex flex-col items-center mb-12 transition-all duration-300 ${isSticky ? 'hidden opacity-0 h-0 mb-0' : 'opacity-100'}`}>
                    <h3 className="text-xl md:text-2xl font-bold text-electric-500 tracking-widest uppercase mb-2">
                        System Launch In
                    </h3>
                    <motion.div
                        className="h-1 w-24 bg-electric-400 rounded-full"
                        animate={{ width: ["0%", "100%", "0%"], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    />
                </div>

                {/* Counter Grid */}
                <div className={`flex flex-wrap justify-center gap-4 transition-all duration-500 ${isSticky
                    ? 'gap-1 p-1 bg-transparent shadow-none border-none'
                    : 'md:gap-8 p-4 md:p-8 border border-electric-500/20 rounded-3xl bg-navy-900/30 backdrop-blur-md shadow-[inset_0_0_50px_rgba(45,212,191,0.05)]'
                    }`}>
                    <TimeUnit value={timeLeft.days} label="Days" />
                    <div className={`flex items-start font-bold text-electric-500/50 transition-all ${isSticky ? 'pt-1 text-xl' : 'hidden md:flex pt-10 text-4xl'}`}>:</div>
                    <TimeUnit value={timeLeft.hours} label="Hours" />
                    <div className={`flex items-start font-bold text-electric-500/50 transition-all ${isSticky ? 'pt-1 text-xl' : 'hidden md:flex pt-10 text-4xl'}`}>:</div>
                    <TimeUnit value={timeLeft.minutes} label="Mins" />
                    <div className={`flex items-start font-bold text-electric-500/50 transition-all ${isSticky ? 'pt-1 text-xl' : 'hidden md:flex pt-10 text-4xl'}`}>:</div>
                    <TimeUnit value={timeLeft.seconds} label="Secs" />
                </div>

                {/* Bottom text - Hide when sticky */}
                <p className={`mt-8 text-electric-500/60 font-mono text-sm transition-all duration-300 ${isSticky ? 'hidden opacity-0 h-0 mt-0' : 'opacity-100'}`}>
                    // SYNCING WITH SERVER TIME...
                </p>
            </div>
        </Section>
    );
};

export default Countdown;
