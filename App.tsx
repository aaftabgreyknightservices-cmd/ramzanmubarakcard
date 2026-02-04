
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CardData, CardTheme, THEMES, decompressData } from './types';
import { translations, Language } from './translations';

// Components
import Hero from './components/Hero';
import CardBuilder from './components/CardBuilder';
import Footer from './components/Footer';
import EidCountdown from './components/EidCountdown';
import { DisplayAdUnit } from './components/AdUnits';

const App: React.FC = () => {
  const [activeTheme, setActiveTheme] = useState<CardTheme>(THEMES[0]);
  const [initialData, setInitialData] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Language State
  const [lang, setLang] = useState<Language>('en');

  // Handle Document Direction & Fonts based on Language
  useEffect(() => {
    const isRTL = lang === 'ur' || lang === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // Dynamic Font Class on Body
    document.body.className = ''; // Reset
    if (lang === 'ur') document.body.classList.add('urdu');
    else if (lang === 'ar') document.body.classList.add('arabic');
    else if (lang === 'hi') document.body.classList.add('hindi');
    else document.body.classList.add('font-sans');

  }, [lang]);

  useEffect(() => {
    // V4/V5 Hash Parsing Protocol
    const rawHash = window.location.hash.substring(1); // Remove #
    
    if (rawHash) {
       // Format: SenderName.Code OR Sender_Name.Code
       // We split by the LAST dot, as sender name might contain dots (though sanitized to _ usually)
       const lastDotIndex = rawHash.lastIndexOf('.');
       
       let sender = "";
       let code = "";

       if (lastDotIndex !== -1) {
           sender = rawHash.substring(0, lastDotIndex);
           code = rawHash.substring(lastDotIndex + 1);
       } else {
           // Fallback for legacy or unknown format: Treat whole hash as code
           code = rawHash;
       }

       if (code) {
          console.log("Decoding:", { sender, code });
          const decoded = decompressData(code, sender);
          
          if (decoded) {
              setInitialData(decoded);
              
              // Set the active theme based on the decoded data
              const theme = THEMES.find(t => t.id === decoded.themeId) || THEMES[0];
              setActiveTheme(theme);
              
              // Automatically scroll to builder section after a short delay
              // so the user sees the card (editable format) immediately
              setTimeout(() => {
                 document.getElementById('builder')?.scrollIntoView({ behavior: 'smooth' });
              }, 1000);
          }
       }
    }
    setTimeout(() => setLoading(false), 500);
  }, []);

  const t = translations[lang];

  if (loading) {
      return (
          <div className="min-h-screen bg-black flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
      );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${activeTheme.gradient} text-white transition-all duration-1000`}>
      <Hero t={t.hero} lang={lang} setLang={setLang} />
      
      <EidCountdown t={t.countdown} lang={lang} />

      {/* Primary Ad Placement: Between Info & Builder */}
      <div className="max-w-7xl mx-auto px-6">
         <DisplayAdUnit size="large" />
      </div>

      <section id="builder" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h2 className={`text-5xl md:text-7xl font-black mb-6 tracking-tighter ${lang === 'ur' ? 'leading-[1.4]' : lang === 'hi' ? 'font-hindi leading-[1.4]' : ''}`}>
               {t.builder.title}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl font-medium italic">
               {t.builder.subtitle}
            </p>
          </motion.div>
          
          {/* 
            CardBuilder now accepts initialData. 
            If present (from hash), it pre-fills the form, satisfying the requirement for "editable format".
          */}
          <CardBuilder 
            onThemeChange={setActiveTheme} 
            activeTheme={activeTheme}
            t={t}
            lang={lang}
            initialData={initialData}
          />
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default App;
