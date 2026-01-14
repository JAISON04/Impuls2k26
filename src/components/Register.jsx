import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Building, GraduationCap, Phone, Mail, CheckCircle, Loader2, CreditCard, Users, Plus, Minus } from 'lucide-react';
import { collection, addDoc, doc, setDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../firebase';
import { EMAIL_CONFIG } from '../emailConfig';
import Section from './Section';
import { useAuth } from '../context/AuthContext';
import { loadRazorpay, RAZORPAY_CONFIG } from '../config/razorpay';

const Register = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser, googleSignIn } = useAuth(); // Import googleSignIn

    // Extract event data from navigation state
    const {
        eventName,
        category,
        price = 0,
        isTeamEvent = false,
        minTeamSize = 1,
        maxTeamSize = 1
    } = location.state || { eventName: '', category: 'Event', price: 0 };

    const [formData, setFormData] = useState({
        name: '',
        college: '',
        year: '',
        phone: '',
        email: '',
        teamName: '',
    });

    // Team state - initialize to minTeamSize for team events
    const [teamCount, setTeamCount] = useState(isTeamEvent ? minTeamSize : 1);
    const [teamMembers, setTeamMembers] = useState([]);

    // Update teamCount if minTeamSize changes (e.g., navigating to different event)
    useEffect(() => {
        if (isTeamEvent) {
            setTeamCount(minTeamSize);
        }
    }, [isTeamEvent, minTeamSize]);

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isPaymentLoading, setIsPaymentLoading] = useState(false);
    const [error, setError] = useState('');

    // Calculate total price based on team size
    const totalPrice = useMemo(() => {
        if (location.state?.isFixedPrice) {
            return parseFloat(price) || 0;
        }
        return teamCount * (parseFloat(price) || 0);
    }, [teamCount, price, location.state]);

    useEffect(() => {
        /* 
        // Redirect if not logged in - REMOVED to show Sign In prompt instead
        if (!currentUser) {
            navigate('/');
            return;
        } 
        */

        // Auto-fill email from Auth (name is editable)
        setFormData(prev => ({
            ...prev,
            name: prev.name || currentUser.displayName || '',
            email: currentUser.email || ''
        }));

        // Redirect to events if no state is present (direct access)
        if (!location.state) {
            // navigate('/events'); 
        }
    }, [location, navigate, currentUser]);

    // Initialize team members when teamCount changes
    useEffect(() => {
        if (isTeamEvent && teamCount > 1) {
            // Create empty team member slots (excluding the main registrant)
            const additionalMembers = teamCount - 1;
            setTeamMembers(prev => {
                const newMembers = [];
                for (let i = 0; i < additionalMembers; i++) {
                    newMembers.push(prev[i] || { name: '' });
                }
                return newMembers;
            });
        } else {
            setTeamMembers([]);
        }
    }, [teamCount, isTeamEvent]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Team member handlers
    const handleTeamCountChange = (delta) => {
        setTeamCount(prev => {
            const newCount = prev + delta;
            return Math.max(minTeamSize, Math.min(maxTeamSize, newCount));
        });
    };

    const handleTeamMemberChange = (index, value) => {
        setTeamMembers(prev => {
            const updated = [...prev];
            updated[index] = { name: value };
            return updated;
        });
    };

    const handlePaymentAndSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsPaymentLoading(true);

        // Validate team member names if team event
        if (isTeamEvent && teamCount > 1) {
            const emptyMembers = teamMembers.filter(m => !m.name?.trim());
            if (emptyMembers.length > 0) {
                setError('Please enter names for all team members.');
                setIsPaymentLoading(false);
                return;
            }
            if (emptyMembers.length > 0) {
                setError('Please enter names for all team members.');
                setIsPaymentLoading(false);
                return;
            }
        }

        if (isTeamEvent && !formData.teamName.trim()) {
            setError('Please enter a Team Name.');
            setIsPaymentLoading(false);
            return;
        }

        // Use calculated total price
        const finalPrice = totalPrice;

        console.log("Initiating payment for:", { eventName, finalPrice, teamCount });

        try {
            // Case 1: Free Event - Skip Payment
            if (finalPrice <= 0) {
                console.log("Free event detected, skipping payment.");
                await submitRegistration('FREE_REGISTRATION');
                return;
            }

            // Case 2: Placeholder Key - Simulate Success (Dev Mode)
            if (RAZORPAY_CONFIG.key_id === "YOUR_RAZORPAY_KEY") {
                console.warn("Using placeholder Razorpay key. Simulating success...");
                await new Promise(resolve => setTimeout(resolve, 1500)); // Fake delay
                await submitRegistration('SIMULATED_PAYMENT_ID');
                return;
            }

            // Case 3: Real Payment
            // 1. Load Razorpay SDK
            const isLoaded = await loadRazorpay();
            if (!isLoaded) {
                setError('Razorpay SDK failed to load. Please check your internet connection.');
                setIsPaymentLoading(false);
                return;
            }

            const amountInPaise = Math.round(finalPrice * 100);
            console.log("Opening Razorpay with amount (paise):", amountInPaise);

            // 2. Open Razorpay Checkout
            const options = {
                key: RAZORPAY_CONFIG.key_id,
                amount: amountInPaise,
                currency: RAZORPAY_CONFIG.currency,
                name: RAZORPAY_CONFIG.name,
                description: `Registration for ${eventName}`,
                image: "https://citimpulse.com/vite.svg",
                // Force auto-capture (legacy override)
                payment_capture: 1,
                handler: async function (response) {
                    // Payment Success Handler
                    console.log("Payment Success Response:", response);
                    await submitRegistration(response.razorpay_payment_id);
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone,
                },
                theme: {
                    color: "#2dd4bf",
                },
                modal: {
                    ondismiss: function () {
                        console.log("Payment modal dismissed by user.");
                        setIsPaymentLoading(false);
                    }
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.on('payment.failed', function (response) {
                console.error("Payment Failed Error:", response.error);
                setError(`Payment Failed: ${response.error.description} (Code: ${response.error.code})`);
                setIsPaymentLoading(false);
            });

            paymentObject.open();
        } catch (err) {
            console.error("Payment initialization error:", err);
            setError(`Failed to initialize payment: ${err.message}`);
            setIsPaymentLoading(false);
        }
    };

    const submitRegistration = async (paymentId) => {
        setIsLoading(true);

        try {
            // 1. Generate ID Client-side for Optimistic Update
            const newRegRef = doc(collection(db, "registrations"));
            const newRegId = newRegRef.id;

            const registrationData = {
                ...formData,
                eventName,
                category,
                pricePerPerson: price || 0,
                teamCount: teamCount,
                teamMembers: teamMembers,
                totalPrice: totalPrice,
                paymentId: paymentId || 'N/A',
                uid: currentUser.uid,
                registeredAt: serverTimestamp()
            };

            // 2. Start Background Processes (Fire & Forget for UI speed)
            const dbPromise = setDoc(newRegRef, registrationData);

            // 2b. Send Email
            const sendEmailFn = httpsCallable(functions, 'sendRegistrationEmail');
            const emailPromise = sendEmailFn({
                email: formData.email,
                name: formData.name,
                eventName: eventName,
                paymentId: paymentId || 'N/A',
                amount: totalPrice,
                teamCount: teamCount,
                teamName: formData.teamName || 'N/A', // Add teamName to email
                teamMembers: teamMembers.map(m => m.name),
                refId: newRegId
            });

            // 2c. Link Event to User Profile
            const userRef = doc(db, 'users', currentUser.uid);
            const userUpdatePromise = updateDoc(userRef, {
                registeredEvents: arrayUnion({
                    eventId: newRegId,
                    eventName: eventName,
                    category: category,
                    teamCount: teamCount,
                    teamMembers: teamMembers.map(m => m.name),
                    registeredAt: new Date().toISOString(),
                    paymentId: paymentId || 'N/A'
                })
            }).catch(err => console.warn("Failed to link event to user profile:", err));

            // 3. Log errors in background but don't block UI
            Promise.all([dbPromise, emailPromise, userUpdatePromise]).then(() => {
                console.log("Background registration tasks completed.");
            }).catch(err => {
                console.error("Background task failed:", err);
                // Critical: If DB write fails, we should ideally inform user, but UI is already success.
                // In production, we might queue this or retry. 
            });

            // 4. Update UI IMMEDIATELY (Optimistic)
            console.log("Optimistic Success for ID:", newRegId);
            setIsSubmitted(true);

        } catch (err) {
            console.error("Error preparing registration: ", err);
            setError('Unexpected error during registration processing.');
        } finally {
            setIsLoading(false);
            setIsPaymentLoading(false);
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
                                    {(price !== undefined && price > 0) && (
                                        <div className="mt-4 bg-electric-500/10 border border-electric-500/20 rounded-lg p-3 inline-flex items-center gap-3 text-electric-300 font-bold">
                                            <CreditCard size={18} />
                                            {location.state?.isFixedPrice ? (
                                                <span>Fixed Team Price: ₹{totalPrice}</span>
                                            ) : (
                                                isTeamEvent && teamCount > 1 ? (
                                                    <span>{teamCount} × ₹{price} = ₹{totalPrice}</span>
                                                ) : (
                                                    <span>Registration Fee: ₹{price}</span>
                                                )
                                            )}
                                        </div>
                                    )}
                                    {isTeamEvent && (
                                        <p className="mt-2 text-sm text-gray-500">
                                            <Users size={14} className="inline mr-1" />
                                            Team event: {minTeamSize === maxTeamSize ? `${minTeamSize} members` : `${minTeamSize}-${maxTeamSize} members`}
                                        </p>
                                    )}
                                </div>

                                {/* Sign In Prompt */}
                                {!currentUser && (
                                    <div className="flex flex-col items-center justify-center py-12 space-y-6">
                                        <div className="p-4 rounded-full bg-electric-500/10 border border-electric-500/20 text-electric-400">
                                            <User size={48} />
                                        </div>
                                        <h3 className="text-xl font-bold text-white text-center">Sign In Required</h3>
                                        <p className="text-gray-400 text-center max-w-sm">
                                            You need to be signed in to register for events. Please sign in with your Google account to continue.
                                        </p>
                                        <button
                                            onClick={googleSignIn}
                                            className="flex items-center gap-3 px-8 py-3 bg-white text-navy-950 font-bold rounded-xl hover:bg-electric-400 transition-all shadow-lg hover:shadow-electric-500/20"
                                        >
                                            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                                            Sign in with Google
                                        </button>
                                    </div>
                                )}

                                {/* Registration Form - Only if Signed In */}
                                {currentUser && (
                                    <form onSubmit={handlePaymentAndSubmit} className="space-y-6">
                                        {/* Name - Editable */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-300 ml-1">Your Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                                <input
                                                    type="text"
                                                    name="name"
                                                    required
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="Enter your full name"
                                                    className="w-full bg-navy-950 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-electric-500 focus:ring-1 focus:ring-electric-500 outline-none transition-all placeholder:text-gray-700"
                                                />
                                            </div>
                                        </div>

                                        {/* Team Name - Only for Team Events */}
                                        {isTeamEvent && (
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-300 ml-1">Team Name</label>
                                                <div className="relative">
                                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                                    <input
                                                        type="text"
                                                        name="teamName"
                                                        required
                                                        value={formData.teamName}
                                                        onChange={handleChange}
                                                        placeholder="Enter your team name"
                                                        className="w-full bg-navy-950 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-electric-500 focus:ring-1 focus:ring-electric-500 outline-none transition-all placeholder:text-gray-700"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Team Size Selector - For all team events where team size can grow */}
                                        {isTeamEvent && maxTeamSize > 1 && (
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-300 ml-1">Number of Participants</label>
                                                <div className="flex items-center gap-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleTeamCountChange(-1)}
                                                        disabled={teamCount <= minTeamSize}
                                                        className="w-10 h-10 rounded-lg bg-navy-950 border border-white/10 flex items-center justify-center text-white hover:border-electric-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                                    >
                                                        <Minus size={18} />
                                                    </button>
                                                    <span className="text-2xl font-bold text-electric-400 w-8 text-center">{teamCount}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleTeamCountChange(1)}
                                                        disabled={teamCount >= maxTeamSize}
                                                        className="w-10 h-10 rounded-lg bg-navy-950 border border-white/10 flex items-center justify-center text-white hover:border-electric-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                                    >
                                                        <Plus size={18} />
                                                    </button>
                                                    <span className="text-sm text-gray-500">Team Members (including you)</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Team Member Name Fields */}
                                        {isTeamEvent && teamMembers.length > 0 && (
                                            <div className="space-y-3 border border-electric-500/20 rounded-xl p-4 bg-navy-950/50">
                                                <label className="text-sm font-bold text-electric-400 flex items-center gap-2">
                                                    <Users size={16} /> Team Member Names
                                                </label>
                                                {teamMembers.map((member, index) => (
                                                    <div key={index} className="relative">
                                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                                        <input
                                                            type="text"
                                                            required
                                                            value={member.name}
                                                            onChange={(e) => handleTeamMemberChange(index, e.target.value)}
                                                            placeholder={`Team Member ${index + 2} Name`}
                                                            className="w-full bg-navy-950 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-electric-500 focus:ring-1 focus:ring-electric-500 outline-none transition-all placeholder:text-gray-700"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}

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
                                                    readOnly
                                                    className="w-full bg-navy-950/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-gray-400 cursor-not-allowed outline-none"
                                                />
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={isLoading || isPaymentLoading}
                                            className="w-full py-4 mt-8 bg-gradient-to-r from-electric-600 to-electric-400 text-navy-950 font-black text-lg uppercase tracking-widest rounded-xl hover:shadow-[0_0_30px_#2dd4bf] hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isLoading || isPaymentLoading ? (
                                                <>
                                                    <Loader2 className="animate-spin" /> Processing...
                                                </>
                                            ) : (
                                                <>
                                                    {totalPrice > 0 ? (
                                                        <span>Pay ₹{totalPrice} & Register</span>
                                                    ) : (
                                                        <span>Complete Registration</span>
                                                    )}
                                                </>
                                            )}
                                        </button>

                                        {error && <p className="text-red-500 text-center mt-4 font-bold">{error}</p>}
                                    </form>
                                )}
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
                                    Thank you for registering for {eventName}. We have received your payment and details.
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
                                    <h4 className="text-electric-300 font-bold text-sm mb-2">Need Help?</h4>
                                    <p className="text-xs text-gray-400 mb-2">
                                        For registration & payment queries:
                                    </p>
                                    <p className="text-sm font-bold text-white">Jaison Binu Frank</p>
                                    <p className="text-sm text-electric-400 font-mono">63812 89610</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div >
        </Section >
    );
};

export default Register;
