
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
    // V5 Hash Parsing Protocol (Bitwise Matrix)
    const rawHash = window.location.hash.substring(1); // Remove #
    
    if (rawHash) {
       // Format: SenderName.Code 
       // We split by the LAST dot to separate Name from Matrix Code
       const lastDotIndex = rawHash.lastIndexOf('.');
       
       let sender = "";
       let code = "";

       if (lastDotIndex !== -1) {
           sender = rawHash.substring(0, lastDotIndex);
           code = rawHash.substring(lastDotIndex + 1);
       } else {
           code = rawHash;
       }

       if (code) {
          console.log("Processing Shared Card:", { sender, code });
          const decoded = decompressData(code, sender);
          
          if (decoded) {
              setInitialData(decoded);
              
              // 1. Set Theme Immediately
              const theme = THEMES.find(t => t.id === decoded.themeId) || THEMES[0];
              setActiveTheme(theme);
          }
       }
    }
    // Simulate asset loading
    setTimeout(() => setLoading(false), 500);
  }, []);

  // SCROLL LOGIC: Smart scrolling depending on device
  useEffect(() => {
    if (!loading && initialData) {
        const scrollToTarget = () => {
            const isMobile = window.innerWidth < 1024;
            const cardPreview = document.getElementById('card-preview');
            const builderSection = document.getElementById('builder');
            
            if (isMobile && cardPreview) {
                 // On mobile, the card is at the bottom. Scroll to center it in viewport so users see the gift immediately.
                 cardPreview.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (builderSection) {
                 // On desktop, align the section top. The card is visible in the right column.
                 builderSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        };

        // Trigger sequence to ensure scroll happens after layout settles
        scrollToTarget();
        const t1 = setTimeout(scrollToTarget, 500);
        const t2 = setTimeout(scrollToTarget, 1000);
        const t3 = setTimeout(scrollToTarget, 2000); // Late check for ad loading
        
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }
  }, [loading, initialData]);

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

      {/* Primary Ad Placement */}
      <div className="max-w-7xl mx-auto px-6">
         <DisplayAdUnit size="large" />
      </div>

      <section id="builder" className="py-24 px-6 min-h-screen">
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
               {initialData ? "Edit this card to make it yours, or share it as is." : t.builder.subtitle}
            </p>
          </motion.div>
          
          <CardBuilder 
            onThemeChange={setActiveTheme} 
            activeTheme={activeTheme}
            t={t}
            lang={lang}
            setLang={setLang}
            initialData={initialData}
          />
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default App;
