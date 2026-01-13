import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Building, GraduationCap, Phone, Mail, CheckCircle, Loader2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import emailjs from '@emailjs/browser';
import { db } from '../firebase';
import { EMAIL_CONFIG } from '../emailConfig';
import Section from './Section';

const Register = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { eventName, category } = location.state || { eventName: '', category: 'Event' };

    const [formData, setFormData] = useState({
        name: '',
        college: '',
        year: '',
        phone: '',
        email: '',
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Redirect to events if no state is present (direct access)
        if (!location.state) {
            // navigate('/events'); 
            // Optional: allow direct access but just show empty form? 
            // Better to redirect or let them choose. For now, let's keep it open but generic.
        }
    }, [location, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // 1. Store in Firestore
            const docRef = await addDoc(collection(db, "registrations"), {
                ...formData,
                eventName,
                category,
                registeredAt: serverTimestamp()
            });

            console.log("Document written with ID: ", docRef.id);

            // 2. Send Email
            try {
                console.log("Sending email to:", formData.email);
                await emailjs.send(
                    EMAIL_CONFIG.SERVICE_ID,
                    EMAIL_CONFIG.TEMPLATE_ID,
                    {
                        name: formData.name,
                        email: formData.email,
                        message: `Registration Details:\nEvent: ${eventName}\nCollege: ${formData.college}\nYear: ${formData.year}\nPhone: ${formData.phone}`,
                        title: `Registration for ${eventName}`,
                        time: new Date().toLocaleString(),
                    },
                    EMAIL_CONFIG.PUBLIC_KEY
                );
                console.log('Email sent successfully');
            } catch (emailErr) {
                console.error('Failed to send email:', emailErr);
            }

            setIsSubmitted(true);
        } catch (err) {
            console.error("Error adding document: ", err);
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <Section id="register" className="py-24">
            <div className="w-full max-w-6xl px-4">

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-electric-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft size={20} /> Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Registration Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2 bg-navy-900/50 border border-electric-500/30 rounded-2xl p-8 backdrop-blur-md shadow-[0_0_50px_rgba(45,212,191,0.1)]"
                    >
                        {!isSubmitted ? (
                            <>
                                <div className="mb-8 border-b border-white/10 pb-6">
                                    <h2 className="text-3xl font-black text-white font-orbitron mb-2">Register</h2>
                                    <p className="text-gray-400">
                                        You are registering for <span className="text-electric-400 font-bold">{eventName || 'an Event'}</span>
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-300 ml-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="John Doe"
                                                className="w-full bg-navy-950 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-electric-500 focus:ring-1 focus:ring-electric-500 outline-none transition-all placeholder:text-gray-700"
                                            />
                                        </div>
                                    </div>

                                    {/* College */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-300 ml-1">College Name</label>
                                        <div className="relative">
                                            <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                            <input
                                                type="text"
                                                name="college"
                                                required
                                                value={formData.college}
                                                onChange={handleChange}
                                                placeholder="Institute of Technology"
                                                className="w-full bg-navy-950 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-electric-500 focus:ring-1 focus:ring-electric-500 outline-none transition-all placeholder:text-gray-700"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Year */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-300 ml-1">Year of Study</label>
                                            <div className="relative">
                                                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                                <select
                                                    name="year"
                                                    required
                                                    value={formData.year}
                                                    onChange={handleChange}
                                                    className="w-full bg-navy-950 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-electric-500 focus:ring-1 focus:ring-electric-500 outline-none transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="" disabled className="text-gray-700">Select Year</option>
                                                    <option value="1">1st Year</option>
                                                    <option value="2">2nd Year</option>
                                                    <option value="3">3rd Year</option>
                                                    <option value="4">4th Year</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-300 ml-1">Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    required
                                                    pattern="[0-9]{10}"
                                                    title="Please enter a valid 10-digit number"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    placeholder="9876543210"
                                                    className="w-full bg-navy-950 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-electric-500 focus:ring-1 focus:ring-electric-500 outline-none transition-all placeholder:text-gray-700"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-300 ml-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="john@example.com"
                                                className="w-full bg-navy-950 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-electric-500 focus:ring-1 focus:ring-electric-500 outline-none transition-all placeholder:text-gray-700"
                                            />
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-4 mt-8 bg-gradient-to-r from-electric-600 to-electric-400 text-navy-950 font-black text-lg uppercase tracking-widest rounded-xl hover:shadow-[0_0_30px_#2dd4bf] hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="animate-spin" /> Processing...
                                            </>
                                        ) : (
                                            'Complete Registration'
                                        )}
                                    </button>

                                    {error && <p className="text-red-500 text-center mt-4 font-bold">{error}</p>}
                                </form>
                            </>
                        ) : (
                            <div className="py-12 text-center flex flex-col items-center justify-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="text-electric-400 mb-6"
                                >
                                    <CheckCircle size={80} />
                                </motion.div>
                                <h3 className="text-3xl font-bold text-white mb-2">Registration Successful!</h3>
                                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                                    Thank you for registering for {eventName}. We have recorded your details and will contact you shortly.
                                </p>
                                <button
                                    onClick={() => navigate('/events')}
                                    className="px-8 py-3 border border-electric-500 text-electric-400 font-bold rounded-lg hover:bg-electric-500 hover:text-navy-950 transition-colors"
                                >
                                    Return to Events
                                </button>
                            </div>
                        )}
                    </motion.div>

                    {/* Right Column: Rules & Regulations */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-navy-900/80 border border-electric-500/30 rounded-2xl p-6 backdrop-blur-md sticky top-24"
                        >
                            <h3 className="text-xl font-bold text-white font-orbitron mb-4 flex items-center gap-2">
                                <span className="text-electric-400">⚠</span> Rules & Regulations
                            </h3>

                            <div className="space-y-4">
                                {(location.state?.rules && location.state.rules.length > 0) ? (
                                    <ul className="space-y-3">
                                        {location.state.rules.map((rule, idx) => (
                                            <li key={idx} className="flex gap-3 text-sm text-gray-300 leading-relaxed">
                                                <span className="text-electric-500 font-bold mt-0.5">›</span>
                                                {rule}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-gray-400 text-sm italic">
                                        <p className="mb-2">General rules apply:</p>
                                        <ul className="space-y-2">
                                            <li>• Carry valid college ID card.</li>
                                            <li>• Report 30 mins before event time.</li>
                                            <li>• Decorum must be maintained.</li>
                                            <li>• Judges decision is final.</li>
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-6 border-t border-white/10">
                                <div className="bg-electric-500/10 rounded-lg p-4 border border-electric-500/20">
                                    <h4 className="text-electric-300 font-bold text-sm mb-2">Need Help?</h4>
                                    <p className="text-xs text-gray-400">
                                        Contact the event coordinators listed in the event details page for any queries regarding rules.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </Section>
    );
};

export default Register;
