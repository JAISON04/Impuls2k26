import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import thunderS from '../assets/images/S1.png';
import logo from '../assets/images/Impulsenew.png';

// Custom Lightning Bolt SVG Component
const LightningBolt = ({ style, className }) => (
    <motion.svg
        viewBox="0 0 24 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`absolute drop-shadow-[0_0_15px_rgba(45,212,191,0.8)] ${className}`}
        style={style}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.3, ease: "linear" }}
    >
        <motion.path
            d="M12 0L0 50H12L0 100H12L0 150"
            stroke="cyan"
            strokeWidth="2"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 1] }}
            transition={{ duration: 0.3, ease: "linear" }}
        />
    </motion.svg>
);

// High Voltage Tower SVG
// High Voltage Tower SVG - Realistic Design from Reference
const ElectricalTower = ({ className, style, isSurging }) => (
    <div className={`absolute bottom-0 pointer-events-none ${className}`} style={style}>
        {/* Thunder Strike Effect when Surging */}
        <AnimatePresence>
            {isSurging && (
                <motion.svg
                    viewBox="0 0 100 200"
                    className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-full h-full z-20 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0, 1, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <path
                        d="M50 0 L40 60 L60 60 L45 120"
                        stroke="cyan"
                        strokeWidth="4"
                        fill="none"
                        className="drop-shadow-[0_0_20px_cyan]"
                    />
                </motion.svg>
            )}
        </AnimatePresence>

        <svg
            viewBox="0 0 300 600"
            className={`w-full h-full transition-all duration-100 ${isSurging
                ? "opacity-100 drop-shadow-[0_0_40px_#2dd4bf] brightness-150"
                : "opacity-80 brightness-75 hover:brightness-100"
                }`}
            xmlns="http://www.w3.org/2000/svg"
        >
            <g
                stroke={isSurging ? "#2dd4bf" : "#64748b"}
                strokeWidth={isSurging ? "3" : "2"}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                {/* Main A-Frame Legs */}
                <path d="M80 600 L130 100 M220 600 L170 100" />

                {/* Top Section (Triangle Header) */}
                <path d="M130 100 L150 40 L170 100" />
                <line x1="130" y1="100" x2="170" y2="100" />

                {/* Cross Arms (3 Levels) */}
                {/* Top Arm */}
                <path d="M100 160 L200 160 M150 100 L150 160" />
                <path d="M100 160 L135 130 M200 160 L165 130" strokeWidth="1" />

                {/* Middle Arm (Widest) */}
                <path d="M70 260 L230 260" />
                <path d="M70 260 L140 220 M230 260 L160 220" strokeWidth="1" />

                {/* Bottom Arm */}
                <path d="M90 360 L210 360" />
                <path d="M90 360 L145 320 M210 360 L155 320" strokeWidth="1" />

                {/* Lattice Zig-Zag Pattern (Main Body) */}
                <path d="M125 100 L175 160 L120 220 L180 280 L115 340 L185 400 L110 460 L190 520 L105 580" strokeWidth="1" opacity="0.7" />
                <path d="M175 100 L125 160 L180 220 L120 280 L185 340 L115 400 L190 460 L110 520 L195 580" strokeWidth="1" opacity="0.7" />

                {/* Horizontal Braces */}
                <line x1="125" y1="160" x2="175" y2="160" strokeWidth="1" />
                <line x1="120" y1="220" x2="180" y2="220" strokeWidth="1" />
                <line x1="115" y1="280" x2="185" y2="280" strokeWidth="1" />
                <line x1="110" y1="340" x2="190" y2="340" strokeWidth="1" />
                <line x1="105" y1="400" x2="195" y2="400" strokeWidth="1" />
                <line x1="95" y1="480" x2="205" y2="480" strokeWidth="1" />

                {/* Insulators (Hanging Strings) */}
                <g stroke={isSurging ? "#fff" : "#94a3b8"} strokeWidth="1">
                    <line x1="100" y1="160" x2="100" y2="200" />
                    <line x1="200" y1="160" x2="200" y2="200" />
                    <line x1="70" y1="260" x2="70" y2="310" />
                    <line x1="230" y1="260" x2="230" y2="310" />
                    <line x1="90" y1="360" x2="90" y2="400" />
                    <line x1="210" y1="360" x2="210" y2="400" />
                </g>
            </g>
        </svg>
    </div>
);

// Configuration for multiple towers
const towerConfigs = [
    // Center Main
    { id: 0, className: "left-1/2 -translate-x-1/2 h-[60vh] md:h-[80vh] z-10", style: {} },
    // Left Mid
    { id: 1, className: "left-[10%] h-[40vh] md:h-[60vh] z-0", style: { transform: 'scale(0.9)' } },
    // Right Mid
    { id: 2, className: "right-[10%] h-[40vh] md:h-[60vh] z-0", style: { transform: 'scale(0.9) scaleX(-1)' } },
    // Left Far
    { id: 3, className: "left-[-10%] h-[30vh] md:h-[50vh] z-[-1]", style: { transform: 'scale(0.7)' } },
    // Right Far
    { id: 4, className: "right-[-10%] h-[30vh] md:h-[50vh] z-[-1]", style: { transform: 'scale(0.7) scaleX(-1)' } },
    // Deep Left
    { id: 5, className: "left-[25%] bottom-[10vh] h-[25vh] md:h-[40vh] z-[-2]", style: { transform: 'scale(0.5)' } },
    // Deep Right
    { id: 6, className: "right-[25%] bottom-[10vh] h-[25vh] md:h-[40vh] z-[-2]", style: { transform: 'scale(0.5) scaleX(-1)' } },
];

// Random positions for lightning
const getRandomPos = () => ({
    top: `${Math.random() * 60}%`, // Restrict to upper portion mostly
    left: `${Math.random() * 90 + 5}%`,
    rotate: Math.random() * 60 - 30, // Less rotation for more realism
    scale: Math.random() * 0.5 + 0.5,
});

// Perspective Grid Background (Restored)
const PerspectiveGrid = () => (
    <div className="absolute inset-x-0 bottom-0 h-[50vh] overflow-hidden pointer-events-none z-0">
        <div
            className="w-full h-[200%] absolute top-[-50%] bg-[linear-gradient(rgba(45,212,191,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(45,212,191,0.1)_1px,transparent_1px)]"
            style={{
                backgroundSize: '40px 40px',
                transform: 'perspective(500px) rotateX(60deg)',
                boxShadow: 'inset 0 0 100px #000'
            }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
    </div>
);

const Hero = () => {
    const [bolts, setBolts] = useState([]);
    const [introComplete, setIntroComplete] = useState(false);
    // Track surge state for all towers
    const [towerSurges, setTowerSurges] = useState(new Array(towerConfigs.length).fill(false));

    // Handle Random Tower Surges
    useEffect(() => {
        const triggerSurge = () => {
            // Create a new surge state based on probabilities
            const newSurges = towerSurges.map(() => Math.random() > 0.82); // ~18% chance per tower per tick

            // Ensure at least one surges occasionally if none are picked, for activity
            if (!newSurges.some(s => s) && Math.random() > 0.7) {
                newSurges[Math.floor(Math.random() * newSurges.length)] = true;
            }

            if (newSurges.some(s => s)) {
                setTowerSurges(newSurges);
                // Reset
                setTimeout(() => {
                    setTowerSurges(new Array(towerConfigs.length).fill(false));
                }, 150 + Math.random() * 400);
            }

            setTimeout(triggerSurge, 400 + Math.random() * 1200); // Faster frequency with more towers
        };
        triggerSurge();
    }, []);

    // Spawn random lightning bolts
    useEffect(() => {
        const interval = setInterval(() => {
            const id = Date.now();
            setBolts(prev => [...prev, { id, ...getRandomPos() }]);

            // Remove bolt after animation
            setTimeout(() => {
                setBolts(prev => prev.filter(bolt => bolt.id !== id));
            }, 400);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    // Handle Intro Timing
    useEffect(() => {
        const timer = setTimeout(() => {
            setIntroComplete(true);
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    const titleFlicker = {
        initial: { opacity: 0 },
        animate: {
            opacity: [1, 0.8, 1, 0.4, 1],
            textShadow: [
                "0 0 20px #2dd4bf",
                "0 0 40px #2dd4bf",
                "0 0 10px #2dd4bf",
                "0 0 50px #0d9488",
                "0 0 20px #2dd4bf"
            ],
            x: [0, -1, 1, -0.5, 0],
            transition: {
                duration: 0.15,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: Math.random() * 3
            }
        }
    };

    return (
        <section id="home" className="relative h-screen flex flex-col items-center justify-center overflow-hidden">

            {/* Atmospheric Background Layers */}
            <PerspectiveGrid />

            {/* Render All Towers from Config */}
            {towerConfigs.map((config, index) => (
                <ElectricalTower
                    key={config.id}
                    className={config.className}
                    style={config.style}
                    isSurging={towerSurges[index]}
                />
            ))}



            {/* Dynamic Lightning Layer */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <AnimatePresence>
                    {bolts.map(bolt => (
                        <LightningBolt
                            key={bolt.id}
                            style={{
                                top: bolt.top,
                                left: bolt.left,
                                rotate: bolt.rotate,
                                scale: bolt.scale,
                            }}
                            className="w-12 h-64 text-electric-300 z-0"
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Main Title Area */}
            <div className="relative z-10 text-center px-4 mt-[-5vh] flex flex-col items-center w-full">
                {/* Intro Animation Symbol */}
                <AnimatePresence>
                    {!introComplete && (
                        <motion.div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <motion.div className="relative flex items-center justify-center">
                                {/* Glow effect behind the symbol */}
                                <motion.div
                                    className="absolute inset-0 bg-electric-400 rounded-full blur-3xl opacity-20"
                                    animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                <motion.img
                                    src={thunderS}
                                    layoutId="thunder-s-symbol"
                                    className="w-48 md:w-64 h-auto drop-shadow-[0_0_50px_#2dd4bf]"
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.8, type: "spring" }}
                                />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative flex items-center justify-center"
                >
                    {/* Main Title - with "S" slot */}
                    <div className="flex items-center text-5xl md:text-9xl font-black tracking-tighter text-white font-orbitron drop-shadow-[0_0_35px_rgba(59,130,246,0.8)]">
                        <motion.span
                            variants={titleFlicker}
                            initial="initial"
                            animate={introComplete ? "animate" : "initial"}
                            className="inline-block"
                        >
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={introComplete ? { opacity: 1 } : { opacity: 0 }}
                                transition={{ delay: 1.2, duration: 0.5 }}
                            >
                                IMPUL
                            </motion.span>
                        </motion.span>

                        {/* The Symbol Slot - made wider and taller for prominent S */}
                        <div className="relative w-[1.5em] h-[1.8em] flex items-center justify-center mx-1 translate-y-[0rem]">
                            <AnimatePresence mode="wait">
                                {introComplete && (
                                    <motion.img
                                        key="symbol"
                                        src={thunderS}
                                        layoutId="thunder-s-symbol"
                                        className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_0_25px_#2dd4bf]"
                                        initial={{ opacity: 0, scale: 2, filter: "brightness(0) invert(1) drop-shadow(0 0 5px cyan)" }}
                                        animate={{
                                            opacity: 1,
                                            scale: 1.8,
                                            filter: ["brightness(0) invert(1) drop-shadow(0 0 5px cyan)", "brightness(1) invert(0) drop-shadow(0 0 25px #2dd4bf)"]
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            times: [0, 1],
                                            ease: "easeInOut"
                                        }}
                                    />
                                )}
                            </AnimatePresence>
                        </div>

                        <motion.span
                            variants={titleFlicker}
                            initial="initial"
                            animate={introComplete ? "animate" : "initial"}
                            className="inline-block"
                            style={{ opacity: 0 }} // Initially hidden via style overrides if needed, providing variants logic allows control
                        >
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={introComplete ? { opacity: 1 } : { opacity: 0 }}
                                transition={{ delay: 1.2, duration: 0.5 }} // Wait for S animation (1.5s approx or partway through)
                            >
                                E
                            </motion.span>
                        </motion.span>
                    </div>

                    {/* Electric Arcs around text (SVG Overlay) */}
                    <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] pointer-events-none opacity-60" viewBox="0 0 400 100">
                        <motion.path
                            d="M0,50 Q100,-20 200,50 T400,50"
                            fill="none"
                            stroke="#2dd4bf"
                            strokeWidth="1.5"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: [0, 1], opacity: [0, 1, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.path
                            d="M0,50 Q100,120 200,50 T400,50"
                            fill="none"
                            stroke="#2dd4bf"
                            strokeWidth="1.5"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: [0, 1], opacity: [0, 1, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
                        />
                    </svg>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, letterSpacing: "0.05em" }}
                    animate={{ opacity: 1, letterSpacing: "0.26em" }}
                    transition={{ delay: 3, duration: 1 }}
                    className="mt-6 text-xl md:text-3xl font-bold text-electric-300 uppercase glow-sm drop-shadow-md bg-black/30 backdrop-blur-sm py-1 px-4 inline-block rounded-lg border border-electric-500/20"
                >
                    Across Every Frequency
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3.5, duration: 0.8 }}
                    className="mt-4 text-lg md:text-xl text-gray-300 font-mono border-t border-b border-electric-500/30 py-2 inline-block bg-black/20"
                >
                    Department of EEE | Chennai Institute of Technology
                </motion.p>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-electric-300 z-20"
                animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center p-1 shadow-[0_0_10px_#2dd4bf] bg-black/40 backdrop-blur">
                    <div className="w-1 h-2 bg-current rounded-full" />
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
