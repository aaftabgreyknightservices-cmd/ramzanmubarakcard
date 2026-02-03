
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CardData, CardTheme, THEMES } from './types';

// Components
import Hero from './components/Hero';
import CardBuilder from './components/CardBuilder';
import ReceiverView from './components/ReceiverView';
import Footer from './components/Footer';
import EidCountdown from './components/EidCountdown'; // Imported Countdown
import { DisplayAdUnit } from './components/AdUnits';

// --- ROBUST URL DECODING HELPER ---
const decodeData = (str: string) => {
  try {
      // Restore standard Base64 characters
      str = str.replace(/-/g, '+').replace(/_/g, '/');
      while (str.length % 4) {
        str += '=';
      }
      const uri = atob(str);
      const json = decodeURIComponent(uri);
      return JSON.parse(json);
  } catch (e) {
      console.error("Decoding error:", e);
      return null;
  }
};

const App: React.FC = () => {
  const [activeTheme, setActiveTheme] = useState<CardTheme>(THEMES[0]);
  const [isReceiverMode, setIsReceiverMode] = useState(false);
  const [initialData, setInitialData] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Robustly find 'data' param in hash, handling various router oddities
    const hash = window.location.hash;
    let dataParam = null;

    if (hash.includes('data=')) {
        // Extract everything after data= until the next & or end of string
        const match = hash.match(/data=([^&]+)/);
        if (match && match[1]) {
            dataParam = match[1];
        }
    }

    if (dataParam) {
      const decoded = decodeData(dataParam);
      if (decoded) {
          setInitialData(decoded);
          setIsReceiverMode(true);
          const theme = THEMES.find(t => t.id === decoded.themeId) || THEMES[0];
          setActiveTheme(theme);
      }
    }
    
    // Smooth loading transition
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleCreateNew = () => {
    setIsReceiverMode(false);
    // Remove hash without scrolling
    history.pushState("", document.title, window.location.pathname + window.location.search);
    setInitialData(null);
  };

  if (loading) {
      return (
          <div className="min-h-screen bg-black flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
      );
  }

  if (isReceiverMode && initialData) {
    return <ReceiverView data={initialData} onCreateNew={handleCreateNew} />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${activeTheme.gradient} text-white transition-all duration-1000`}>
      <Hero />
      
      {/* 
         STRATEGIC PLACEMENT: 
         1. Hero hooks them.
         2. Countdown builds hype (Content Sandwich).
         3. Ad catches them while they look at the time.
      */}
      <EidCountdown />

      {/* SECTION AD: Monetize scroll between Hero/Countdown and Builder */}
      <div className="max-w-7xl mx-auto px-6">
         <DisplayAdUnit size="medium" />
      </div>

      <section id="builder" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">Manifest Your Blessing 🌙</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl font-medium italic">
              "Words are the wings of the soul." Craft a digital treasure that bridges hearts across any distance.
            </p>
          </motion.div>
          <CardBuilder 
            onThemeChange={setActiveTheme} 
            activeTheme={activeTheme}
          />
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default App;
