import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import IntroOverlay from './components/IntroOverlay';
import ElectricBackground from './components/ElectricBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';

import AboutCIT from './components/AboutCIT';
import AboutImpulse from './components/AboutImpulse';
import Events from './components/Events';
import Workshops from './components/Workshops';
import OnlineEvents from './components/OnlineEvents';
import Register from './components/Register';
import AdminPanel from './components/AdminPanel';
import Profile from './components/Profile';
import DepartmentAchievements from './components/DepartmentAchievements';
import Coordinators from './components/Coordinators';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import TermsAndConditions from './components/TermsAndConditions';
import PrivacyPolicy from './components/PrivacyPolicy';

// Home Component to group landing page sections
const Home = () => (
  <>
    <Hero />
    <Events previewMode={true} />
    <Workshops previewMode={true} />
    <AboutCIT />
    <AboutImpulse />
    <DepartmentAchievements />
    <Coordinators />
  </>
);

// Registration Closed Popup Component
const RegistrationClosedPopup = ({ onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="bg-gradient-to-br from-red-600 to-red-800 text-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl border border-red-400/30"
    >
      <div className="text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold mb-4">Registration Closed</h2>
        <p className="text-lg mb-6 opacity-90">
          Online registration for all events and workshops is closed. Offline registration will be available at the college.
        </p>
        <button
          onClick={onClose}
          className="bg-white text-red-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg"
        >
          Got it!
        </button>
      </div>
    </motion.div>
  </div>
);

// Wrapper to handle popup on home page
const AppContent = () => {
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(() => {
    return !sessionStorage.getItem('registrationPopupDismissed');
  });

  const isHomePage = location.pathname === '/';

  const handleClosePopup = () => {
    sessionStorage.setItem('registrationPopupDismissed', 'true');
    setShowPopup(false);
  };

  return (
    <>
      <ElectricBackground />
      <Navbar />

      <AnimatePresence>
        {isHomePage && showPopup && (
          <RegistrationClosedPopup onClose={handleClosePopup} />
        )}
      </AnimatePresence>

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/workshops" element={<Workshops />} />
          <Route path="/online-events" element={<OnlineEvents />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin-downloads" element={<AdminPanel />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Routes>
      </motion.div>

      <Footer />
    </>
  );
};

function App() {
  const [loading, setLoading] = useState(() => {
    return !sessionStorage.getItem('introPlayed');
  });

  const handleIntroComplete = () => {
    sessionStorage.setItem('introPlayed', 'true');
    setLoading(false);
  };

  return (
    <main className="relative min-h-screen bg-navy-950 text-white selection:bg-electric-500 selection:text-navy-950 overflow-hidden cursor-none">
      <CustomCursor />
      <AnimatePresence>
        {loading && <IntroOverlay onComplete={handleIntroComplete} />}
      </AnimatePresence>

      {/* Main Content */}
      {!loading && (
        <Router>
          <AppContent />
        </Router>
      )}
    </main>
  );
}

export default App;
