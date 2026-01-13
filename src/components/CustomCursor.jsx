import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
    const [isHovering, setIsHovering] = useState(false);

    // Mouse position state
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Smooth spring physics for the trailing cursor
    const springConfig = { damping: 25, stiffness: 300 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const moveCursor = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        const handleMouseDown = () => setIsHovering(true);
        const handleMouseUp = () => setIsHovering(false);

        // Check if hovering over clickable elements
        const handleMouseOver = (e) => {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        // Using mouseover for hover detection on interactive elements
        document.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mouseover', handleMouseOver);
        };
    }, [mouseX, mouseY]);

    return (
        <React.Fragment>
            {/* Main Dot Cursor - Direct Follow */}
            <motion.div
                className="fixed top-0 left-0 w-3 h-3 bg-electric-400 rounded-full pointer-events-none z-[9999] mix-blend-screen"
                style={{
                    x: mouseX,
                    y: mouseY,
                    translateX: '-50%',
                    translateY: '-50%',
                    boxShadow: '0 0 10px #2dd4bf, 0 0 20px #2dd4bf'
                }}
            />

            {/* Trailing Ring - Spring Follow */}
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 border-2 border-electric-300 rounded-full pointer-events-none z-[9998] mix-blend-screen"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                    scale: isHovering ? 1.5 : 1,
                    borderColor: isHovering ? '#bef264' : '#2dd4bf', // Change color on hover (lime to teal)
                }}
                animate={{
                    rotate: 360, // visual rotation
                }}
                transition={{
                    rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                    scale: { duration: 0.2 }
                }}
            >
                {/* Electric Sparks/Decorations inside ring */}
                <div className="absolute inset-0 rounded-full opacity-50 animate-pulse bg-electric-500/10" />
            </motion.div>
        </React.Fragment>
    );
};

export default CustomCursor;
