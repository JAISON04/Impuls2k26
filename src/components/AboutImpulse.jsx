import React from 'react';
import { motion } from 'framer-motion';
import Section from './Section';

import about1 from '../assets/images/st1.JPG';
import about2 from '../assets/images/st2.JPG';
import about3 from '../assets/images/st3.JPG';
import about4 from '../assets/images/staf3.JPG';
import about5 from '../assets/images/staff1.JPG';
import about6 from '../assets/images/price1.JPG';
import about7 from '../assets/images/audi.JPG';
import about8 from '../assets/images/gr1.JPG';
import about9 from '../assets/images/gr2.JPG';
import about10 from '../assets/images/staff2.JPG'


const images = [about1, about2, about3, about4, about5, about6, about7, about8, about9, about10];

const AboutImpulse = () => {
    return (
        <Section id="about-impulse" className="py-20 text-left">
            {/* Text Content */}
            <motion.div
                className="max-w-4xl mx-auto mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white border-l-4 border-electric-500 pl-4">
                    ABOUT <span className="text-electric-400">IMPULSE</span>
                </h2>

                <div className="space-y-6 text-gray-300 text-lg md:text-xl leading-relaxed">
                    <p>
                        Impulse is a National Level Technical Symposium organized by the Department of Electrical and Electronics Engineering in Chennai Institute of Technology.
                    </p>
                    <p>
                        Our Unique Symposium Name "IMPULSE" has been originated from "Lightning Impulse" which can be described in Electrical terms as a High voltage impulse that occurs over short times. Similarly our Symposium is a Milestone Event that occurs in a short span of time.
                    </p>
                    <blockquote className="border-l-4 border-electric-400 pl-4 italic text-gray-400 my-6 bg-navy-900/40 p-4 rounded-r-lg">
                        "Join us an experience the surge of technology and innovation!"
                    </blockquote>
                </div>
            </motion.div>

            {/* Moving Image/Event Marquee */}
            <div className="relative w-full overflow-hidden py-4 -mx-4 md:-mx-0">
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-navy-950 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-navy-950 to-transparent z-10 pointer-events-none" />

                <motion.div
                    className="flex space-x-6 md:space-x-8"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        duration: 25,
                        ease: "linear",
                        repeat: Infinity
                    }}
                    style={{ width: "fit-content", willChange: "transform" }}
                >
                    {/* Double the list for seamless loop */}
                    {[...images, ...images].map((img, index) => (
                        <div key={index} className="flex-shrink-0 w-64 h-40 md:w-80 md:h-56 relative group overflow-hidden rounded-xl border border-electric-500/30 shadow-[0_0_20px_rgba(45,212,191,0.1)]">
                            <img
                                src={img}
                                alt={`Impulse Event ${index}`}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-electric-500/10 transition-colors duration-300" />
                        </div>
                    ))}
                </motion.div>
            </div>
        </Section>
    );
};

export default AboutImpulse;
