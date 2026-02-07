
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Language } from '../translations';
import { cld } from '../utils/images';

interface Props {
    t: any;
    lang: Language;
    setLang: (l: Language) => void;
}

const Hero: React.FC<Props> = ({ t, lang, setLang }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax Transforms
  const moonY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const mosqueY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const domeY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const treeY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const canonY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const lanternYFast = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const lanternYSlow = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const languages: { code: Language; label: string }[] = [
      { code: 'en', label: 'English' },
      { code: 'ru', label: 'Urdu' },
      { code: 'hi', label: 'हिंदी' },
      { code: 'ur', label: 'اردو' },
      { code: 'ar', label: 'العربية' },
  ];

  return (
    <div ref={containerRef} className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-[#05020a]">
      
      {/* LANGUAGE SWITCHER */}
      <div className="absolute top-6 left-0 right-0 z-[50] flex justify-center">
          <div className="glass rounded-full p-1.5 flex items-center gap-1 overflow-x-auto max-w-[90vw] shadow-2xl backdrop-blur-xl bg-black/20 border border-white/10">
              {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all duration-300 relative overflow-hidden whitespace-nowrap ${lang === l.code ? 'text-black shadow-[0_0_20px_rgba(255,209,102,0.5)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                  >
                      {lang === l.code && (
                          <motion.div 
                             layoutId="activeLangHero"
                             className="absolute inset-0 bg-yellow-400 z-0"
                             transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                      )}
                      <span className="relative z-10">{l.label}</span>
                  </button>
              ))}
          </div>
      </div>

      {/* --- 3D ASSETS LAYERS --- */}

      {/* Layer 0: Background Stars (Farthest) - Lazy loaded, low priority */}
      <motion.div style={{ y: moonY }} className="absolute inset-0 z-0 pointer-events-none">
         <img 
            src={cld("https://res.cloudinary.com/dxw5mimqj/image/upload/v1770239609/Star_ga6mwm.png", 50)} 
            className="absolute top-[15%] left-[10%] w-8 opacity-60 animate-pulse" 
            loading="lazy"
            alt="" 
         />
         <img 
            src={cld("https://res.cloudinary.com/dxw5mimqj/image/upload/v1770239609/Star_ga6mwm.png", 50)} 
            className="absolute top-[25%] right-[20%] w-6 opacity-40 animate-pulse delay-700" 
            loading="lazy"
            alt="" 
         />
         <div className="absolute inset-0 opacity-60">
           {[...Array(50)].map((_, i) => (
               <div key={i} className="absolute bg-white rounded-full w-[2px] h-[2px]" style={{ top: Math.random()*100+'%', left: Math.random()*100+'%', opacity: Math.random() }} />
           ))}
        </div>
      </motion.div>

      {/* Falling Date Particles */}
      {[...Array(3)].map((_, i) => (
         <motion.img
            key={`date-${i}`}
            src={cld("https://res.cloudinary.com/dxw5mimqj/image/upload/v1770240311/Date_s7yyme.png", 100)}
            className="absolute w-6 md:w-10 z-0 opacity-40 blur-[1px]"
            initial={{ y: -100, x: Math.random() * 1000, rotate: 0 }}
            animate={{ y: 1000, rotate: 360 }}
            transition={{ duration: 15 + Math.random() * 10, repeat: Infinity, ease: "linear", delay: i * 5 }}
            style={{ left: `${Math.random() * 100}%` }}
            loading="lazy"
         />
      ))}

      {/* Layer 1: Huge Crescent Moon (Back) - EAGER LOAD */}
      <motion.div style={{ y: moonY, rotate: -10 }} className="absolute top-[-5%] right-[-10%] md:top-[5%] md:right-[5%] z-0 w-[60vw] md:w-[35vw] opacity-90 pointer-events-none mix-blend-screen">
          <img 
            src={cld("https://res.cloudinary.com/dxw5mimqj/image/upload/v1770240236/Crescent_Moon_jmtxds.png", 1000)} 
            className="w-full h-auto drop-shadow-[0_0_80px_rgba(255,215,0,0.3)]"
            alt="Moon"
            fetchPriority="high"
          />
      </motion.div>

      {/* Layer 2: Mosque Dome (Rising Midground) - EAGER LOAD */}
      <motion.div style={{ y: domeY }} className="absolute bottom-[-5%] left-[20%] md:left-[30%] w-[60vw] md:w-[40vw] z-5 pointer-events-none opacity-50 blur-[2px] mix-blend-screen">
         <img 
            src={cld("https://res.cloudinary.com/dxw5mimqj/image/upload/v1770240232/Mosque_Dome_xrhjbk.png", 800)} 
            className="w-full h-auto drop-shadow-[0_-10px_30px_rgba(255,255,255,0.1)]"
            alt="Dome"
         />
      </motion.div>

      {/* Layer 3: Mosque Silhouette (Bottom Horizon) - EAGER LOAD */}
      <motion.div style={{ y: mosqueY }} className="absolute bottom-[-10%] md:bottom-[-15%] left-0 w-full z-10 pointer-events-none">
         <img 
            src={cld("https://res.cloudinary.com/dxw5mimqj/image/upload/v1770239876/Mosque_s5ywia.png", 1200)} 
            className="w-full h-auto object-cover opacity-90 drop-shadow-[0_-20px_40px_rgba(0,0,0,0.8)]"
            alt="Mosque"
            fetchPriority="high"
          />
      </motion.div>

      {/* Layer 4: Date Tree (Foreground Left) */}
      <motion.div style={{ y: treeY }} className="absolute -bottom-20 -left-20 md:bottom-0 md:-left-10 w-[50vw] md:w-[25vw] z-30 pointer-events-none drop-shadow-[10px_0_20px_rgba(0,0,0,0.8)]">
          <img 
            src={cld("https://res.cloudinary.com/dxw5mimqj/image/upload/v1770240275/Date_Tree_uodk61.png", 800)}
            className="w-full h-auto opacity-90 filter brightness-50 contrast-125"
            alt="Date Tree"
            loading="eager"
          />
      </motion.div>

      {/* Layer 5: Ramadan Canon (Foreground Right Bottom) */}
      <motion.div style={{ y: canonY }} className="absolute -bottom-10 -right-20 md:bottom-0 md:right-0 w-[40vw] md:w-[25vw] z-30 pointer-events-none">
          <img 
            src={cld("https://res.cloudinary.com/dxw5mimqj/image/upload/v1770239698/Ramadan_Canon_uddqjs.png", 600)}
            className="w-full h-auto filter brightness-75 drop-shadow-2xl"
            alt="Canon"
            loading="lazy"
          />
      </motion.div>

      {/* Layer 6: Floating Lanterns - Lazy Load */}
      <motion.div 
        style={{ y: lanternYFast }}
        animate={{ y: [0, 15, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-5%] left-[5%] md:left-[10%] z-20 w-[20vw] md:w-[12vw] pointer-events-none"
      >
         <img 
           src={cld("https://res.cloudinary.com/dxw5mimqj/image/upload/v1770239783/Ramadan_Lantern_xeufdp.png", 400)} 
           className="w-full h-auto drop-shadow-[0_20px_40px_rgba(253,224,71,0.2)]"
           alt="Lantern"
           loading="lazy"
         />
      </motion.div>

      <motion.div 
        style={{ y: lanternYSlow }}
        animate={{ y: [0, -20, 0], rotate: [0, -3, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[10%] right-[80%] md:right-[15%] z-10 w-[12vw] md:w-[8vw] pointer-events-none blur-[1px]"
      >
         <img 
           src={cld("https://res.cloudinary.com/dxw5mimqj/image/upload/v1770239783/Ramadan_Lantern_xeufdp.png", 300)} 
           className="w-full h-auto opacity-80"
           alt="Lantern"
           loading="lazy"
         />
      </motion.div>

      {/* Content */}
      <motion.div 
        style={{ opacity, y: contentY }}
        className="relative z-40 text-center px-4 w-full max-w-5xl mx-auto mt-[-5%]"
      >
        <AnimatePresence mode="wait">
        <motion.div
          key={lang}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.span 
            className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-yellow-400 text-[10px] md:text-xs font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase mb-4 md:mb-6 shadow-[0_0_20px_rgba(255,215,0,0.2)]"
          >
            {t.badge}
          </motion.span>
          <h1 className={`text-5xl sm:text-6xl md:text-9xl font-bold tracking-tight mb-6 md:mb-8 leading-[1.1] md:leading-tight ${lang === 'ur' ? 'font-serif' : lang === 'hi' ? 'font-hindi' : ''}`}>
            {t.titlePre} <br/> <span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-[0_0_30px_rgba(255,209,102,0.5)]">{t.titleHighlight}</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-3xl text-gray-300 mb-8 md:mb-12 max-w-3xl mx-auto font-medium leading-relaxed px-2 text-shadow-sm">
             {t.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 w-full px-4">
            <button 
              onClick={() => document.getElementById('builder')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold rounded-full text-lg md:text-xl shadow-[0_0_50px_rgba(255,209,102,0.5)] hover:shadow-[0_0_80px_rgba(255,209,102,0.8)] hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                  <img src={cld("https://res.cloudinary.com/dxw5mimqj/image/upload/v1770239609/Star_ga6mwm.png", 50)} className="w-5 h-5 animate-spin-slow" />
                  {t.cta}
              </span>
              <motion.div 
                className="absolute inset-0 bg-white/40 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"
              />
            </button>
          </div>
        </motion.div>
        </AnimatePresence>
      </motion.div>

      <motion.div 
        animate={{ y: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-50 opacity-40 cursor-pointer"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <ChevronDown size={32} className="md:w-12 md:h-12" />
      </motion.div>
      <style>{`
        .font-hindi { font-family: 'Noto Sans Devanagari', sans-serif; }
        .text-shadow-sm { text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
      `}</style>
    </div>
  );
};

export default Hero;
