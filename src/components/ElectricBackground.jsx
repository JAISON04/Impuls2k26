import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

// --- Sub-components for "Clumsy" Elements ---

const DataBlock = ({ style, initialText }) => {
    const [text, setText] = useState(initialText);

    useEffect(() => {
        const chars = "0123456789ABCDEF";
        const interval = setInterval(() => {
            if (Math.random() > 0.7) {
                let newText = "";
                for (let i = 0; i < 8; i++) newText += chars[Math.floor(Math.random() * chars.length)];
                setText(newText);
            }
        }, 100 + Math.random() * 200);
        return () => clearInterval(interval);
    }, []);

    return <div className="font-mono text-[10px] text-electric-500/40" style={style}>{text}</div>;
};

const CircuitLine = ({ delay }) => (
    <motion.div
        className="absolute bg-gradient-to-r from-transparent via-electric-500/30 to-transparent h-[1px] w-[200px]"
        style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            rotate: `${Math.random() * 360}deg`,
        }}
        animate={{
            opacity: [0, 1, 0],
            scaleX: [0, 1.5, 0],
            translateX: [0, 100]
        }}
        transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: delay,
            ease: "easeInOut"
        }}
    />
);

const OscilloscopeWave = () => (
    <div className="absolute top-[80%] left-0 w-full h-24 overflow-hidden opacity-20 pointer-events-none">
        <svg viewBox="0 0 1200 100" className="w-full h-full preserve-3d">
            <motion.path
                d="M0,50 Q100,0 200,50 T400,50 T600,50 T800,50 T1000,50 T1200,50" // Simplified sine
                fill="none"
                stroke="#2dd4bf"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{
                    d: [
                        "M0,50 Q100,20 200,50 T400,50 T600,50 T800,50 T1000,50 T1200,50",
                        "M0,50 Q100,80 200,50 T400,50 T600,50 T800,50 T1000,50 T1200,50",
                        "M0,50 Q100,20 200,50 T400,50 T600,50 T800,50 T1000,50 T1200,50"
                    ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <motion.path
                d="M0,50 Q150,100 300,50 T600,50 T900,50 T1200,50"
                fill="none"
                stroke="#0d9488"
                strokeWidth="1"
                className="opacity-50"
                animate={{
                    d: [
                        "M0,50 Q150,100 300,50 T600,50 T900,50 T1200,50",
                        "M0,50 Q150,0 300,50 T600,50 T900,50 T1200,50",
                        "M0,50 Q150,100 300,50 T600,50 T900,50 T1200,50"
                    ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
        </svg>
    </div>
);

const ElectricBackground = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({
                x: (e.clientX / window.innerWidth) * 20 - 10,
                y: (e.clientY / window.innerHeight) * 20 - 10
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Generate static positions for data blocks prevents re-rendering chaos
    const dataBlocks = useMemo(() => [...Array(20)].map((_, i) => ({
        top: `${Math.random() * 90}%`,
        left: `${Math.random() * 90}%`,
        initial: `0x${Math.floor(Math.random() * 10000).toString(16)}`
    })), []);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050b14]">
            {/* Deep Base Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#0f2e2e_0%,#050b14_80%)] opacity-80" />

            {/* Moving Grid Layer (Primary) */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `linear-gradient(rgba(45, 212, 191, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(45, 212, 191, 0.15) 1px, transparent 1px)`,
                    backgroundSize: '4rem 4rem',
                    transform: `translate(${mousePos.x * -1}px, ${mousePos.y * -1}px)`
                }}
            />

            {/* Smaller High-Density Grid (Secondary) */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `linear-gradient(rgba(45, 212, 191, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(45, 212, 191, 0.1) 1px, transparent 1px)`,
                    backgroundSize: '1rem 1rem',
                }}
            />

            {/* Complex Radar Concentric Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] opacity-15">
                <div className="absolute inset-0 border border-electric-500/30 rounded-full animate-spin-slow" />
                <div className="absolute inset-12 border border-dashed border-electric-500/20 rounded-full animate-spin-reverse-slow" />
                <div className="absolute inset-24 border border-dotted border-electric-500/40 rounded-full animate-spin-slow duration-[20s]" />
                <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(45,212,191,0.1)_90deg,transparent_180deg)] animate-spin-slow" />
            </div>

            {/* Scattered Data Blocks (The "Clumsy" Noise) */}
            {dataBlocks.map((block, i) => (
                <DataBlock
                    key={i}
                    style={{ position: 'absolute', top: block.top, left: block.left }}
                    initialText={block.initial}
                />
            ))}

            {/* Random Circuit Lines */}
            {[...Array(10)].map((_, i) => (
                <CircuitLine key={i} delay={i * 0.5} />
            ))}

            {/* Oscilloscope Waves (Bottom Area) */}
            <OscilloscopeWave />
            <div className="absolute top-[20%] left-0 w-full rotate-180 opacity-10">
                <OscilloscopeWave />
            </div>

            {/* Corner HUD Elements (More Detailed) */}
            <div className="absolute top-0 left-0 p-8 hidden md:block opacity-60">
                <div className="border-l-2 border-t-2 border-electric-500 w-16 h-16 mb-2" />
                <div className="text-[10px] text-electric-400 font-mono space-y-1">
                    <p>IP: 192.168.X.X</p>
                    <p>SECURE: TRUE</p>
                    <p>LAT: 13.0827 N</p>
                </div>
            </div>
            <div className="absolute bottom-0 right-0 p-8 hidden md:block opacity-60 text-right">
                <div className="border-r-2 border-b-2 border-electric-500 w-16 h-16 ml-auto mb-2" />
                <div className="text-[10px] text-electric-400 font-mono space-y-1">
                    <p>MEM: 64TB</p>
                    <p>CPU: OVERCLOCK</p>
                    <p>IMPULSE_V2</p>
                </div>
            </div>

            {/* Global Scanline Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[size:100%_4px] pointer-events-none opacity-20" />
        </div>
    );
};

export default ElectricBackground;
