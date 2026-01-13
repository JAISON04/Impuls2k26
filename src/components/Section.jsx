import React from 'react';
import { motion } from 'framer-motion';

const Section = ({ children, className = "", id = "" }) => {
    return (
        <section id={id} className={`relative z-10 w-full min-h-screen flex flex-col items-center justify-start px-6 py-20 ${className}`}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-6xl mx-auto my-auto"
            >
                {children}
            </motion.div>
        </section>
    );
};

export default Section;
