import React, { useEffect } from 'react';
import Section from './Section';
import { motion } from 'framer-motion';

const TermsAndConditions = () => {
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
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 font-orbitron">Terms and Conditions</h1>
                    <p className="text-electric-400 mb-8">Last Updated: January 20, 2026</p>

                    <div className="space-y-8 text-justify leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                            <p>
                                By accessing and using the Impulse 2026 website ("Service"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">2. Registration & Eligibility</h2>
                            <p>
                                Participation in Impulse 2026 events and workshops is open to students from recognized educational institutions. You represent and warrant that all registration information you submit is truthful and accurate, and you agree to maintain the accuracy of such information.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">3. Payment & Refunds</h2>
                            <p>
                                All payments for workshops and events are processed securely via our payment partners.
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                <li><strong>Refund Policy:</strong> Registration fees are non-refundable unless the event is cancelled by the organizers.</li>
                                <li>In case of double payment or transaction failure where money is deducted, the amount will be refunded to the source account within 5-7 working days.</li>
                                <li>Prices are subject to change without prior notice, but confirmed registrations will not be affected.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">4. Event Rules & Conduct</h2>
                            <p>
                                Participants must adhere to the specific rules and regulations of each event. The organizers reserve the right to disqualify any participant or team found violating the rules or engaging in malpractice.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">5. Intellectual Property</h2>
                            <p>
                                The content, organization, graphics, design, compilation, magnetic translation, digital conversion and other matters related to the Site are protected under applicable copyrights, trademarks and other proprietary (including but not limited to intellectual property) rights.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">6. Limitation of Liability</h2>
                            <p>
                                Impulse 2026 and Chennai Institute of Technology shall not be liable for any direct, indirect, incidental, special or consequential damages resulting from the use or inability to use the service or for cost of procurement of substitute goods and services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">7. Contact Information</h2>
                            <p>
                                If you have any questions about these Terms, please contact us at:
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

export default TermsAndConditions;
