
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CardData, CardTheme, THEMES, decompressData } from './types';
import { translations, Language } from './translations';
import { cld } from './utils/images';

// Components
import Hero from './components/Hero';
import CardBuilder from './components/CardBuilder';
import Footer from './components/Footer';
import EidCountdown from './components/EidCountdown';
import { DisplayAdUnit } from './components/AdUnits';

// --- NEW COMPONENT: Festive 3D Asset Strip ---
const FestiveStrip = () => {
    // Comprehensive list of all available 3D assets
    const assets = [
        "https://res.cloudinary.com/dxw5mimqj/image/upload/v1770239783/Ramadan_Lantern_xeufdp.png", // Lantern
        "https://res.cloudinary.com/dxw5mimqj/image/upload/v1770240236/Crescent_Moon_jmtxds.png", // Moon
        "https://res.cloudinary.com/dxw5mimqj/image/upload/v1770239653/Ramadan_Gift_wwyhcs.png", // Gift
        "https://res.cloudinary.com/dxw5mimqj/image/upload/v1770240123/Kaaba_gay44v.png", // Kaaba
        "https://res.cloudinary.com/dxw5mimqj/image/upload/v1770239914/Prayer_Beads_csdzwt.png", // Beads
        "https://res.cloudinary.com/dxw5mimqj/image/upload/v1770239651/Ramadan_Drum_tnrvgo.png", // Drum
        "https://res.cloudinary.com/dxw5mimqj/image/upload/v1770240229/Date_Bowl_idoutb.png", // Date Bowl
        "https://res.cloudinary.com/dxw5mimqj/image/upload/v1770240014/Holy_Quran_mlxxbw.png", // Quran
        "https://res.cloudinary.com/dxw5mimqj/image/upload/v1770239717/Ramadan_Drink_r2e8vp.png", // Drink
        "https://res.cloudinary.com/dxw5mimqj/image/upload/v1770239958/Prayer_Mat_rplurv.png", // Mat
        "https://res.cloudinary.com/dxw5mimqj/image/upload/v1770240086/Ketupat_ambppx.png", // Ketupat
        "https://res.cloudinary.com/dxw5mimqj/image/upload/v1770239956/Ramadan_Alarm_fk7euc.png", // Alarm
        "https://res.cloudinary.com/dxw5mimqj/image/upload/v1770239609/Star_ga6mwm.png", // Star
        "https://res.cloudinary.com/dxw5mimqj/image/upload/v1770240311/Date_s7yyme.png", // Single Date
        "https://res.cloudinary.com/dxw5mimqj/image/upload/v1770239698/Ramadan_Canon_uddqjs.png", // Canon
        "https://res.cloudinary.com/dxw5mimqj/image/upload/v1770239783/Mosque_Tower_f4wmqf.png", // Tower
        "https://res.cloudinary.com/dxw5mimqj/image/upload/v1770239642/Suhoor_Time_n2ng0o.png", // Suhoor
        "https://res.cloudinary.com/dxw5mimqj/image/upload/v1770240072/Iftar_Time_uvtfv8.png", // Iftar
    ];
    
    // Duplicating list to ensure seamless infinite scroll
    const marqueeList = [...assets, ...assets];

    return (
        <div className="w-full py-10 md:py-20 relative overflow-hidden bg-gradient-to-r from-black/30 via-white/5 to-black/30 border-y border-white/5 backdrop-blur-md my-16 shadow-[0_0_80px_rgba(0,0,0,0.6)] z-20">
             {/* Gradient Masks for Fade Effect */}
             <div className="absolute inset-0 pointer-events-none z-10" style={{ maskImage: 'linear-gradient(to right, black, transparent 10%, transparent 90%, black)', WebkitMaskImage: 'linear-gradient(to right, black, transparent 10%, transparent 90%, black)' }}></div>
             
             {/* Glowing Background Behind Strip */}
             <div className="absolute top-1/2 left-0 w-full h-2/3 -translate-y-1/2 bg-yellow-400/5 blur-[60px] -z-10 animate-pulse"></div>

             <motion.div 
                 className="flex gap-6 md:gap-16 w-max px-4 items-center"
                 animate={{ x: ["0%", "-50%"] }}
                 transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
             >
                 {marqueeList.map((src, i) => (
                     <motion.div 
                         key={i} 
                         className="relative group cursor-pointer flex-shrink-0"
                         whileHover={{ scale: 1.15, y: -10, rotate: i % 2 === 0 ? 5 : -5, filter: "brightness(1.2)" }}
                         whileTap={{ scale: 0.95 }}
                     >
                         <img 
                            src={cld(src, 300)} 
                            className="w-20 h-20 md:w-36 md:h-36 object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] group-hover:drop-shadow-[0_0_40px_rgba(253,224,71,0.5)] transition-all duration-300 transform-gpu"
                            alt="Ramadan 3D Element"
                            loading="lazy"
                         />
                         {/* Hover Glow Effect */}
                         <div className="absolute inset-0 bg-yellow-400/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full scale-125"></div>
                     </motion.div>
                 ))}
             </motion.div>
        </div>
    );
};

const App: React.FC = () => {
  const [activeTheme, setActiveTheme] = useState<CardTheme>(THEMES[0]);
  const [initialData, setInitialData] = useState<CardData | null>(null);
  
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
  }, []);

  // SCROLL LOGIC: Smart scrolling depending on device
  useEffect(() => {
    if (initialData) {
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
        const t0 = setTimeout(scrollToTarget, 100);
        const t1 = setTimeout(scrollToTarget, 500);
        const t2 = setTimeout(scrollToTarget, 1000);
        
        return () => {
            clearTimeout(t0);
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }
  }, [initialData]);

  const t = translations[lang];

  return (
    <div className={`min-h-screen bg-gradient-to-b ${activeTheme.gradient} text-white transition-all duration-1000`}>
      <Hero t={t.hero} lang={lang} setLang={setLang} />
      
      <EidCountdown t={t.countdown} lang={lang} />

      {/* Primary Ad Placement */}
      <div className="max-w-7xl mx-auto px-6">
         <DisplayAdUnit size="large" />
      </div>

      <section id="builder" className="py-24 px-6 min-h-screen relative z-10">
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

      {/* NEW: Festive 3D PNG Marquee Strip */}
      <FestiveStrip />

      <Footer />
    </div>
  );
};

export default App;
