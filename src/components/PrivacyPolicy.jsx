import React, { useEffect } from 'react';
import Section from './Section';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Section className="py-32 min-h-screen text-gray-300">
            <div className="max-w-4xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 font-orbitron">Privacy Policy</h1>
                    <p className="text-electric-400 mb-8">Last Updated: January 20, 2026</p>

                    <div className="space-y-8 text-justify leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
                            <p>
                                We collect information that you strictly provide to us for the purpose of event registration. This includes:
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                <li><strong>Personal Information:</strong> Name, Email Address, Phone Number, College/Institution Name, Department, and Year of Study.</li>
                                <li><strong>Event Data:</strong> Information about the events and workshops you register for.</li>
                                <li><strong>Payment Information:</strong> Transaction IDs and status (We do not store complete credit card or banking details; these are handled by our payment processor).</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
                            <p>
                                We use the collected information for the following purposes:
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                <li>To process your registration and participation in Impulse 2026.</li>
                                <li>To communicate with you regarding event schedules, updates, and important announcements.</li>
                                <li>To generate certificates and On-Duty letters.</li>
                                <li>To verify your identity at the venue.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">3. Data Storage and Security</h2>
                            <p>
                                Your data is stored securely on Google Firebase servers. We implement appropriate technical measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. We do not sell or share your personal data with third parties for marketing purposes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">4. Third-Party Services</h2>
                            <p>
                                We use trusted third-party services for specific functions:
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                <li><strong>Firebase (Google):</strong> For authentication and database services.</li>
                                <li><strong>Razorpay:</strong> For secure payment processing. By making a payment, you also agree to Razorpay's terms and privacy policy.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights</h2>
                            <p>
                                You have the right to request access to the personal information we hold about you. You can also request corrections to any inaccurate data. For such requests, please contact the event coordinators or email us.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">6. Contact Us</h2>
                            <p>
                                If you have any questions about this Privacy Policy, please contact us at:
                                <br />
                                <strong>Email:</strong> impulse2026@citimpulse.com
                                <br />
                                <strong>Address:</strong> Chennai Institute of Technology, Sarathy Nagar, Kundrathur, Chennai - 600069
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </Section>
    );
};

export default PrivacyPolicy;
