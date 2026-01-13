import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Section from './Section';
import cit1 from '../assets/images/cit1.jpg';
import cit2 from '../assets/images/cit2.jpg';
import cit3 from '../assets/images/cit3.jpg';
import cit4 from '../assets/images/cit4.avif';
import cit5 from '../assets/images/cit 5.jpg';
import cit6 from '../assets/images/cit6.jpg';

const images = [cit1, cit2, cit3, cit4, cit5, cit6];

const AboutCIT = () => {
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    const fadeIn = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
    };

    return (
        <Section id="about-cit" className="text-left md:text-left">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeIn}
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 border-l-4 border-electric-500 pl-4">
                        ABOUT <span className="text-electric-400">CIT</span>
                    </h2>
                    <div className="space-y-6 text-gray-300 text-lg md:text-xl leading-relaxed">
                        <p>
                            Chennai Institute of Technology (CIT), a top-ranked institution in Tamil Nadu, is dedicated to pragmatic learning. Through industry partnerships, CIT offers students diverse opportunities, blending education and recreation.
                        </p>
                        <p>
                            Recognized with the National Award of Excellence for Best Placements and ranked second in Tamil Nadu, CIT shapes students into industry-ready engineers.
                        </p>
                        <blockquote className="border-l-4 border-electric-400 pl-4 italic text-gray-400 my-6 bg-navy-900/40 p-4 rounded-r-lg">
                            "Our goal is to transfer our knowledge to you, enabling your transformation into a proper engineer."
                            <footer className="mt-2 text-electric-300 font-semibold not-italic">
                                - Shri Sriram Parthasarathy
                            </footer>
                        </blockquote>
                    </div>
                </motion.div>

                {/* Slideshow Image Side */}
                <div className="relative group h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-[0_0_30px_rgba(45,212,191,0.3)] border border-electric-500/30">
                    <div className="absolute inset-0 bg-electric-500/10 z-10 pointer-events-none group-hover:bg-transparent transition-colors duration-500" />
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentImage}
                            src={images[currentImage]}
                            alt="Chennai Institute of Technology"
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </AnimatePresence>
                </div>
            </div>
        </Section>
    );
};

export default AboutCIT;
