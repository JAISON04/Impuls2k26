import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IntroOverlay = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(onComplete, 500); // Small delay before unmounting
                    return 100;
                }
                // Randomize speed for "glitchy" load effect
                return prev + Math.random() * 10;
            });
        }, 100);

        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-navy-950 text-electric-400"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* System Status Text */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8 font-mono text-xl tracking-widest text-center"
            >
                <span className="inline-block animate-pulse">SYSTEM INITIALIZING_</span>
            </motion.div>

            {/* Progress Bar Container */}
            <div className="w-64 h-2 bg-navy-900 rounded-full overflow-hidden border border-electric-500/30 shadow-[0_0_15px_#2dd4bf]">
                {/* Filling Bar */}
                <motion.div
                    className="h-full bg-electric-400 shadow-[0_0_20px_#2dd4bf]"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Percentage Text */}
            <div className="mt-2 font-mono text-sm text-electric-300">
                {Math.min(100, Math.floor(progress))}%
            </div>

            {/* White Flash on Completion */}
            <AnimatePresence>
                {progress >= 100 && (
                    <motion.div
                        className="absolute inset-0 bg-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default IntroOverlay;
