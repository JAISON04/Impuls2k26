import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Section from './Section';

// Import images
import ach1 from '../assets/images/ach1.jpeg';
import ach2 from '../assets/images/ach2.jpeg';
import ach3 from '../assets/images/ach3.jpeg';
import ach4 from '../assets/images/ach4.jpeg';
import ach5 from '../assets/images/ach5.jpeg';
import ach6 from '../assets/images/ach6.jpeg';
import ach7 from '../assets/images/ach7.jpeg';
import ach8 from '../assets/images/ach8.jpeg';
import ach9 from '../assets/images/ach9.jpeg';
import ach10 from '../assets/images/ach10.jpeg';
import ach11 from '../assets/images/ach11.jpeg';
import ach12 from '../assets/images/ach12.jpeg';

const achievements = [
    {
        id: 1,
        image: ach1,
        description: "Two teams from our department won Smart India Hackathon 2025 (Hardware Edition) under the Ministry of Social Justice & Empowerment and Ministry of Home Affairs."
    },
    {
        id: 2,
        image: ach2,
        description: "Engaging in hands-on technical workshops and collaborative learning environments."
    },
    {
        id: 3,
        image: ach3,
        description: "Our department students secured First Prize and a Consolation Award at the Larsen & Toubro (L&T) Ideation Challenge – Season 2, showcasing innovation, teamwork, and technical excellence."
    },
    {
        id: 4,
        image: ach4,
        description: "Students from our department demonstrated technical excellence by participating in a National-Level Robotics Challenge, earning recognition for their innovative robotic solutions."
    },
    {
        id: 5,
        image: ach5,
        description: "The team receives the Runner-Up prize during a national-level innovation event, recognizing their outstanding performance and technical excellence."
    },
    {
        id: 6,
        image: ach6,
        description: "Our department students received special recognition at the ImagineTN – Experience@ Coimbatore Global SDG Hackathon, presenting innovative solutions aligned with Sustainable Development Goals (SDGs)"
    },
    {
        id: 7,
        image: ach7,
        description: "Students from our department were part of the ULOG-3 satellite development team, demonstrating skills in satellite design, integration, testing, and teamwork."
    },
    {
        id: 8,
        image: ach8,
        description: "Empowering future engineers with the skills to lead and innovate in the electrical domain."
    },
    {
        id: 9,
        image: ach9,
        description: "Our department students emerged as Winners at the CITIL SDG Hackathon 2025, organized by CITBIF & CITIL, presenting innovative solutions aligned with the UN Sustainable Development Goals (SDGs)."
    },
    {
        id: 10,
        image: ach10,
        description: "A student-athlete proudly secures the Gold Medal in the U20 Boys Discuss Throw at the 36th Tamil Nadu State Junior Athletic Championship."
    },
    {
        id: 11,
        image: ach11,
        description: "A student-athlete proudly secures the Gold Medal in the U20 Boys Discuss Throw at the 36th Tamil Nadu State Junior Athletic Championship"
    },
    {
        id: 12,
        image: ach12,
        description: "A dignitary presents a certificate to a participant during a formal ceremony at the Entrepreneurship Development and Innovation Institute (EDI-TN), highlighting excellence in innovation and entrepreneurship."
    }
];

const DepartmentAchievements = () => {
    const [width, setWidth] = useState(0);
    const carouselRef = useRef();

    useEffect(() => {
        // Calculate the draggable width (scroll width - container width)
        if (carouselRef.current) {
            setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
        }
    }, []);

    // Also update on resize
    useEffect(() => {
        const handleResize = () => {
            if (carouselRef.current) {
                setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <Section id="achievements" className="py-20 text-center overflow-hidden">

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="max-w-7xl mx-auto px-4 mb-12"
            >
                <h2 className="text-3xl md:text-5xl font-bold text-white inline-block border-b-4 border-electric-500 pb-2">
                    DEPARTMENT <span className="text-electric-400">ACHIEVEMENTS</span>
                </h2>
                <p className="text-gray-400 mt-4 text-sm md:text-base animate-pulse">
                    &lt; Drag to Explore &gt;
                </p>
            </motion.div>

            {/* Carousel Container */}
            <motion.div
                ref={carouselRef}
                className="cursor-grab active:cursor-grabbing overflow-hidden px-4 md:px-0"
                whileTap={{ cursor: "grabbing" }}
            >
                <motion.div
                    drag="x"
                    dragConstraints={{ right: 0, left: -width }}
                    className="flex gap-8 md:gap-10 w-fit px-4 md:px-20"
                >
                    {achievements.map((item) => (
                        <motion.div
                            key={item.id}
                            className="relative group min-w-[300px] w-[85vw] md:w-[600px] aspect-[16/9] rounded-xl overflow-hidden shadow-lg border border-electric-500/20 flex-shrink-0"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <img
                                src={item.image}
                                alt={`Achievement ${item.id}`}
                                className="w-full h-full object-fit pointer-events-none transition-all duration-500 group-hover:brightness-25 group-hover:scale-110"
                            />

                            {/* Overlay Content */}
                            <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-navy-950/80 backdrop-blur-sm">
                                <p className="text-white text-base md:text-xl font-semibold leading-relaxed border-l-4 border-electric-500 pl-4 text-left">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>

        </Section>
    );
};

export default DepartmentAchievements;
