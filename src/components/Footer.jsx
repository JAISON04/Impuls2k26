import React from 'react';

import footerLogo from '../assets/images/ImpulseFooter.png';

const Footer = () => {
    return (
        <footer className="relative z-10 py-10 bg-navy-950 border-t border-navy-900">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">

                {/* Left Side: Logo + Address */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                    <img
                        src={footerLogo}
                        alt="Impulse Footer Logo"
                        className="h-20 w-auto object-contain drop-shadow-[0_0_15px_rgba(45,212,191,0.3)]"
                    />
                    <div className="text-gray-400 space-y-1 text-sm md:text-base">
                        <p className="font-bold text-white text-lg">Chennai Institute of Technology</p>
                        <p>Sarathy Nagar, Kundrathur,</p>
                        <p>Chennai - 600069</p>
                    </div>
                </div>

                {/* Right Side: Links & Copyright */}
                <div className="flex flex-col items-center md:items-end gap-4">
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-400 hover:text-electric-400 transition-colors font-medium hover:underline decoration-electric-500 underline-offset-4">Instagram</a>
                        <a href="#" className="text-gray-400 hover:text-electric-400 transition-colors font-medium hover:underline decoration-electric-500 underline-offset-4">Contact</a>
                    </div>
                    <div className="text-center md:text-right">
                        <p className="text-gray-600 font-mono text-xs md:text-sm">
                            &copy; {new Date().getFullYear()} IMPULSE | Department of EEE
                        </p>
                        <p className="text-electric-500/50 text-[10px] mt-1 font-mono tracking-widest">
                            CHENNAI INSTITUTE OF TECHNOLOGY
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
