import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import DepartmentAchievements from './components/DepartmentAchievements';
import Coordinators from './components/Coordinators';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';

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
          <ElectricBackground />
          <Navbar />

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
              <Route path="/admin-downloads" element={<AdminPanel />} />
            </Routes>
          </motion.div>

          <Footer />
        </Router>
      )}
    </main>
  );
}

export default App;
