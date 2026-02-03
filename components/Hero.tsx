
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Moon, ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const moonY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const starsY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const mosqueY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div ref={containerRef} className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Layer 1: Living Stars (Farthest) */}
      <motion.div style={{ y: starsY }} className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-60">
           {[...Array(100)].map((_, i) => {
             const size = Math.random() * 2 + 1; // Random size between 1px and 3px
             const moveX = Math.random() * 20 - 10; // Gentle horizontal drift
             const moveY = Math.random() * 20 - 10; // Gentle vertical drift
             const duration = Math.random() * 4 + 4; // 4s to 8s cycle

             return (
               <motion.div
                 key={i}
                 className="absolute bg-white rounded-full blur-[0.5px]"
                 style={{
                   top: `${Math.random() * 100}%`,
                   left: `${Math.random() * 100}%`,
                   width: `${size}px`,
                   height: `${size}px`,
                 }}
                 animate={{ 
                   opacity: [0.1, 0.8, 0.1],
                   scale: [1, 1.2, 1],
                   x: [0, moveX, 0],
                   y: [0, moveY, 0]
                 }}
                 transition={{ 
                   duration: duration, 
                   repeat: Infinity,
                   ease: "easeInOut",
                   delay: Math.random() * 5
                 }}
               />
             );
           })}
        </div>
      </motion.div>

      {/* Layer 2: Moon & Glow */}
      <motion.div style={{ y: moonY }} className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div className="absolute top-[10%] right-[5%] md:top-[15%] md:right-[10%] text-yellow-200 opacity-80">
          <Moon size={120} className="md:w-[220px] md:h-[220px] drop-shadow-[0_0_60px_rgba(255,255,100,0.5)] rotate-[-15deg]" fill="currentColor" stroke="none" />
        </div>
      </motion.div>

      {/* Layer 3: Mosque Silhouette (Middle) */}
      <motion.div style={{ y: mosqueY }} className="absolute bottom-0 left-0 w-full z-10 pointer-events-none opacity-20">
        <svg viewBox="0 0 1200 400" className="w-full h-auto" preserveAspectRatio="none">
          <path fill="#000" d="M0,400 L0,320 C80,320 120,290 180,260 C240,230 300,230 360,260 C420,290 480,320 540,320 L540,120 L660,120 L660,320 L780,320 C840,320 900,290 960,260 C1020,230 1080,230 1140,260 C1200,290 1200,320 1200,320 L1200,400 Z" />
          <rect x="585" y="60" width="30" height="60" fill="#000" />
          <circle cx="600" cy="50" r="15" fill="#000" />
        </svg>
      </motion.div>

      {/* Layer 4: Decorative Elements (Gifts/Prayer Mats) */}
      <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none flex justify-around items-end px-4 md:px-20 pb-4 opacity-40">
         <div className="w-20 md:w-40 h-6 md:h-10 bg-black rounded-t-full"></div>
         <div className="w-40 md:w-60 h-4 md:h-8 bg-black rounded-t-[50%]"></div>
         <div className="w-20 md:w-40 h-8 md:h-12 bg-black rounded-t-full"></div>
      </div>

      {/* Floating Lanterns (Dynamic) */}
      <div className="absolute inset-0 pointer-events-none z-30">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ y: 0 }}
            animate={{ 
              y: [-20, 20, -20], 
              rotate: [-3, 3, -3],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{ 
              duration: 5 + i, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: i * 0.5
            }}
            style={{
              top: `${15 + (i * 8)}%`,
              left: `${5 + (i * 12)}%`,
            }}
          >
            <div className="w-4 h-8 md:w-6 md:h-10 bg-yellow-500 rounded-lg blur-[3px] opacity-20 absolute -inset-3"></div>
            <div className="w-4 h-8 md:w-6 md:h-10 border border-yellow-400/50 rounded-lg relative flex items-center justify-center bg-yellow-500/10 backdrop-blur-[1px]">
              <div className="w-1 md:w-1.5 h-2 md:h-3 bg-yellow-200 rounded-full animate-pulse shadow-[0_0_10px_#fff]"></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <motion.div 
        style={{ opacity, y: contentY }}
        className="relative z-40 text-center px-4 w-full max-w-5xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-yellow-400 text-[10px] md:text-xs font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase mb-4 md:mb-6"
          >
            Spreading Goodness Worldwide
          </motion.span>
          <h1 className="text-5xl sm:text-6xl md:text-9xl font-bold tracking-tight mb-6 md:mb-8 leading-[1.1] md:leading-tight">
            Ramzan is <br/> <span className="text-yellow-400 drop-shadow-[0_0_20px_rgba(255,209,102,0.3)]">Coming Soon 🌙</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-3xl text-gray-300 mb-8 md:mb-12 max-w-3xl mx-auto font-medium leading-relaxed px-2">
            Create a <span className="text-white border-b-2 border-yellow-400/50">Personalized Dua Card</span>. <br className="hidden md:block"/>
            One Tap to Share. <span className="text-cyan-400 font-bold block md:inline mt-1 md:mt-0">Infinite Blessings.</span>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 w-full px-4">
            <button 
              onClick={() => document.getElementById('builder')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-yellow-400 text-black font-bold rounded-full text-lg md:text-xl shadow-[0_0_40px_rgba(255,209,102,0.4)] hover:shadow-[0_0_60px_rgba(255,209,102,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">Create My Gift Card</span>
              <motion.div 
                className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"
              />
            </button>
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        animate={{ y: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-50 opacity-40 cursor-pointer"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <ChevronDown size={32} className="md:w-12 md:h-12" />
      </motion.div>
    </div>
  );
};

export default Hero;
