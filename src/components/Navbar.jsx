import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/images/Impulsenew.png';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const links = [
        { name: 'Home', path: '/', type: 'route' },
        { name: 'About', path: '/#about-cit', type: 'hash' },
        { name: 'Events', path: '/events', type: 'route' },
        { name: 'Workshops', path: '/workshops', type: 'route' },
        { name: 'Online Events', path: '/online-events', type: 'route' },
    ];

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleNavigation = (e, link) => {
        e.preventDefault();
        setIsOpen(false);

        if (link.type === 'hash') {
            const hash = link.path.substring(1); // #about-cit
            if (location.pathname !== '/') {
                navigate('/', { state: { scrollTo: hash } });
            } else {
                const element = document.querySelector(hash);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        } else {
            navigate(link.path);
            window.scrollTo(0, 0);
        }
    };

    // Handle scroll from state after navigation
    useEffect(() => {
        if (location.state && location.state.scrollTo) {
            const element = document.querySelector(location.state.scrollTo);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 500); // Small delay to allow rendering
            }
            // Clear state to prevent scroll on refresh (optional but good)
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    return (

        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 right-0 z-50 w-full bg-navy-950/80 backdrop-blur-xl border-b border-white/10 shadow-lg"
        >
            <div className="w-full px-8 py-4 flex items-center justify-between relative overflow-hidden group/nav">

                {/* Glass sheen effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/nav:animate-shimmer pointer-events-none" />

                {/* Logo Area */}
                <Link
                    to="/"
                    onClick={(e) => handleNavigation(e, { path: '/', type: 'route' })}
                    className="relative z-10 flex items-center gap-3 group"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-electric-400 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                        <img src={logo} alt="Impulse" className="h-10 w-auto relative z-10 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]" />
                    </div>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-1">
                    {links.map((link) => (
                        <a
                            key={link.name}
                            href={link.path}
                            onClick={(e) => handleNavigation(e, link)}
                            className={`
                                    relative px-5 py-2.5 rounded-xl text-sm font-medium tracking-wide transition-all duration-300
                                    ${location.pathname === link.path && link.type !== 'hash'
                                    ? 'text-navy-950 bg-electric-400 font-bold shadow-[0_0_20px_rgba(45,212,191,0.4)]'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }
                                `}
                        >
                            {link.name}
                        </a>
                    ))}


                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden relative z-10 p-2 text-gray-300 hover:text-white bg-white/5 rounded-lg transition-colors border border-white/5"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-24 left-4 right-4 p-4 bg-navy-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl md:hidden shadow-xl z-40"
                    >
                        <div className="flex flex-col gap-2">
                            {links.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.path}
                                    onClick={(e) => handleNavigation(e, link)}
                                    className={`
                                        text-center py-3 rounded-xl transition-all font-medium
                                        ${location.pathname === link.path
                                            ? 'bg-electric-500/10 text-electric-300 border border-electric-500/20'
                                            : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                        }
                                    `}
                                >
                                    {link.name}
                                </a>
                            ))}

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav >
    );
};

export default Navbar;
