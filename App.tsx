
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CardData, CardTheme, THEMES, decompressData } from './types';
import { translations, Language } from './translations';

// Components
import Hero from './components/Hero';
import CardBuilder from './components/CardBuilder';
import ReceiverView from './components/ReceiverView';
import Footer from './components/Footer';
import EidCountdown from './components/EidCountdown';
import { DisplayAdUnit } from './components/AdUnits';

const App: React.FC = () => {
  const [activeTheme, setActiveTheme] = useState<CardTheme>(THEMES[0]);
  const [isReceiverMode, setIsReceiverMode] = useState(false);
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
    const hash = window.location.hash;
    let dataParam = null;

    if (hash) {
       if (hash.includes('data=')) {
          // Legacy support
          dataParam = hash.split('data=')[1];
       } else if (hash.length > 2) {
          // New Short Link Format: #Name.Code or #Code
          // We split by '.' and take the last part, which contains the data
          const parts = hash.substring(1).split('.');
          dataParam = parts[parts.length - 1];
       }
    }

    if (dataParam) {
      const decoded = decompressData(dataParam);
      if (decoded) {
          setInitialData(decoded);
          setIsReceiverMode(true);
          const theme = THEMES.find(t => t.id === decoded.themeId) || THEMES[0];
          setActiveTheme(theme);
      }
    }
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleCreateNew = () => {
    setIsReceiverMode(false);
    history.pushState("", document.title, window.location.pathname + window.location.search);
    setInitialData(null);
  };

  const t = translations[lang];

  if (loading) {
      return (
          <div className="min-h-screen bg-black flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
      );
  }

  if (isReceiverMode && initialData) {
    return <ReceiverView data={initialData} onCreateNew={handleCreateNew} t={t.receiver} lang={lang} />;
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
          <CardBuilder 
            onThemeChange={setActiveTheme} 
            activeTheme={activeTheme}
            t={t}
            lang={lang}
          />
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default App;
