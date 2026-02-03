
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Heart, Share2, PenTool, Sparkles, Moon, Check, Volume2, VolumeX, Gift, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CardData, THEMES, BLESSINGS } from '../types';
import { NativeAdUnit, DisplayAdUnit, SmartLinkButton } from './AdUnits';

interface Props {
  data: CardData;
  onCreateNew: () => void;
}

// --- VISUAL COMPONENTS ---

const CalligraphySVG = ({ color, isRevealed }: { color: string; isRevealed: boolean }) => (
  <motion.svg 
    viewBox="0 0 300 150" 
    className="w-full h-full opacity-20"
    initial={{ opacity: 0 }}
    animate={isRevealed ? { opacity: 0.2 } : { opacity: 0 }}
    transition={{ duration: 2 }}
  >
    <motion.path
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      d="M40,80 Q70,20 120,60 T200,40 M60,110 Q150,130 240,90 M100,30 Q110,10 120,30 M180,30 Q190,10 200,30"
      initial={{ pathLength: 0 }}
      animate={isRevealed ? { pathLength: 1 } : { pathLength: 0 }}
      transition={{ duration: 4, ease: "easeInOut", delay: 1 }}
    />
    <motion.text 
      x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" 
      className="arabic text-[90px]" 
      fill={color}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isRevealed ? { opacity: 0.4, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 3, delay: 1.5 }}
    >
      رمضان
    </motion.text>
  </motion.svg>
);

const GoldenEnvelope = ({ from, onClick }: { from: string, onClick: () => void }) => {
  return (
    <div className="relative perspective-1000 group cursor-pointer" onClick={onClick}>
      <motion.div
        initial={{ rotateX: 20, rotateY: 0, y: -100, opacity: 0 }}
        animate={{ rotateX: 0, rotateY: [0, -5, 5, 0], y: 0, opacity: 1 }}
        transition={{ 
          rotateY: { repeat: Infinity, duration: 6, ease: "easeInOut" },
          y: { type: "spring", damping: 12 },
          opacity: { duration: 1 }
        }}
        whileHover={{ scale: 1.05, rotateX: 5 }}
        className="w-[320px] h-[220px] md:w-[400px] md:h-[280px] bg-gradient-to-br from-yellow-600 via-yellow-500 to-yellow-700 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10 flex items-center justify-center transform-gpu"
      >
        {/* Envelope Flap Texture */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        
        {/* Flap Triangles */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-yellow-400/20 clip-path-triangle z-20 backdrop-blur-sm border-b border-white/10"></div>
        
        {/* Wax Seal */}
        <div className="relative z-50 flex flex-col items-center gap-4">
            <motion.div 
               className="w-20 h-20 bg-red-700 rounded-full border-4 border-red-900 shadow-[0_5px_15px_rgba(0,0,0,0.5)] flex items-center justify-center relative overflow-hidden"
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.9 }}
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
                <Lock className="text-yellow-200 opacity-80" size={32} />
                <div className="absolute inset-0 ring-2 ring-white/20 rounded-full animate-pulse"></div>
            </motion.div>
            
            <div className="text-center">
                <p className="text-[10px] uppercase tracking-widest text-yellow-200 mb-1 opacity-80">A Gift From</p>
                <h3 className="text-2xl font-['Playfair_Display'] font-black text-white drop-shadow-md">{from}</h3>
            </div>
        </div>

        {/* Glow Effect */}
        <div className="absolute -inset-10 bg-yellow-500/30 blur-3xl -z-10 animate-pulse"></div>
      </motion.div>
    </div>
  );
};

const ReceiverView: React.FC<Props> = ({ data, onCreateNew }) => {
  // Stages: 'gift' -> 'opening' -> 'revealed'
  const [stage, setStage] = useState<'gift' | 'opening' | 'revealed'>('gift');
  const [saidAmeen, setSaidAmeen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  
  const theme = THEMES.find(t => t.id === data.themeId) || THEMES[0];
  const cardRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Parallax Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 100, damping: 20 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);

  useEffect(() => {
    audioRef.current = new Audio('https://assets.mixkit.co/music/preview/mixkit-ethereal-meditation-159.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;
    return () => { audioRef.current?.pause(); };
  }, []);

  const toggleSound = () => {
    if (audioRef.current) {
      if (isMuted) audioRef.current.play().catch(e => console.log(e));
      else audioRef.current.pause();
      setIsMuted(!isMuted);
    }
  };

  const handleOpenGift = () => {
    setStage('opening');
    if (isMuted && audioRef.current) {
        audioRef.current.play().catch(() => {});
        setIsMuted(false);
    }
    
    // Sequence the reveal
    setTimeout(() => {
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 }, colors: [theme.accent, '#FFD700', '#FFFFFF'], gravity: 0.8 });
    }, 500);

    setTimeout(() => {
        setStage('revealed');
    }, 1500);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleAmeen = () => {
    setSaidAmeen(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.8 },
      colors: [theme.accent, theme.secondary, '#FFFFFF']
    });
  };

  return (
    <div 
      className={`min-h-screen bg-gradient-to-b ${theme.gradient} text-white flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <button 
        onClick={toggleSound}
        className="fixed top-4 right-4 md:top-8 md:right-8 z-[100] p-3 md:p-4 glass rounded-full hover:bg-white/10 transition-all border border-white/20"
      >
        {isMuted ? <VolumeX size={20} className="text-gray-400" /> : <Volume2 size={20} className="text-yellow-400" />}
      </button>

      {/* Floating Smartlink */}
      <SmartLinkButton />

      {/* Immersive Particles */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full blur-[0.5px]"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{ 
                opacity: [0.1, 1, 0.1], 
                y: [0, Math.random() * -100, 0]
              }}
              transition={{ 
                duration: Math.random() * 5 + 5, 
                repeat: Infinity, 
                delay: Math.random() * 5,
                ease: "linear"
              }}
            />
        ))}
      </div>

      <AnimatePresence mode="wait">
        
        {/* STAGE 1 & 2: GIFT ARRIVAL & OPENING */}
        {(stage === 'gift' || stage === 'opening') && (
          <motion.div
            key="envelope-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 2, filter: "blur(20px)" }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl"
          >
            {stage === 'gift' ? (
                <>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mb-12 text-center space-y-2"
                    >
                        <h2 className="text-3xl md:text-5xl font-light tracking-[0.2em] uppercase text-white">Blessing Arrived</h2>
                        <p className="text-yellow-400/80 font-mono text-xs md:text-sm animate-pulse">A soul message waits for you</p>
                    </motion.div>
                    
                    <GoldenEnvelope from={data.from} onClick={handleOpenGift} />
                    
                    <motion.p 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2, duration: 1 }}
                        className="mt-12 text-gray-500 text-xs font-bold tracking-[0.3em] uppercase"
                    >
                        Tap the Seal to Open
                    </motion.p>
                </>
            ) : (
                <div className="relative flex items-center justify-center">
                    <motion.div
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.5, 0], rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="w-[300px] h-[300px] bg-yellow-400 rounded-full blur-[100px] opacity-80"
                    />
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 20 }}
                        transition={{ duration: 1, delay: 0.5, ease: "circIn" }}
                        className="absolute inset-0 bg-white rounded-full z-50"
                    />
                </div>
            )}
          </motion.div>
        )}

        {/* STAGE 3: THE REVEALED CARD */}
        {stage === 'revealed' && (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", bounce: 0.4, duration: 1.5 }}
            className="w-full max-w-2xl z-10 flex flex-col items-center gap-8 md:gap-14 pb-20"
          >
            <div className="text-center space-y-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-yellow-400 text-[10px] md:text-sm font-black tracking-[0.3em] uppercase backdrop-blur-xl"
              >
                Holy Gift Unlocked
              </motion.div>
            </div>

            {/* --- THE HYPER REALISTIC CARD --- */}
            <motion.div
              ref={cardRef}
              style={{ 
                rotateX, 
                rotateY,
                transformStyle: "preserve-3d"
              }}
              className="w-full aspect-[3/4.6] glass rounded-[3rem] md:rounded-[4rem] p-6 md:p-12 flex flex-col justify-between items-center text-center shadow-[0_40px_80px_rgba(0,0,0,0.85)] relative transform-gpu"
            >
                {/* 1. Calligraphy Depth Layer */}
                <motion.div
                  style={{
                    x: useTransform(smoothX, [-0.5, 0.5], [-35, 35]),
                    y: useTransform(smoothY, [-0.5, 0.5], [-35, 35]),
                    translateZ: -30
                  }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <CalligraphySVG color={theme.accent} isRevealed={true} />
                </motion.div>

                {/* 2. Internal Parallax Moon */}
                <motion.div 
                   style={{ 
                     x: useTransform(smoothX, [-0.5, 0.5], [-25, 25]),
                     y: useTransform(smoothY, [-0.5, 0.5], [-25, 25]),
                     translateZ: 60
                   }}
                   className="absolute top-8 right-8 md:top-12 md:right-12 opacity-60 pointer-events-none"
                >
                  <Moon size={80} className="md:w-[150px] md:h-[150px]" fill={theme.accent} stroke="none" />
                </motion.div>

                {/* 3. Header Parallax */}
                <motion.div 
                  style={{ translateZ: 40 }}
                  className="relative z-10 space-y-2 md:space-y-4"
                >
                  <span className="text-yellow-400 font-black tracking-[0.4em] uppercase text-[10px] md:text-xs">Holy Ramzan 2026</span>
                  <div className="arabic text-3xl md:text-6xl font-bold mt-2 drop-shadow-2xl" style={{ color: theme.accent }}>رمضان مبارك</div>
                </motion.div>

                {/* 4. Core Message */}
                <div className="relative z-10 space-y-6 md:space-y-12 w-full transform-gpu">
                  <motion.div 
                    style={{ translateZ: 80 }}
                    className="space-y-1 md:space-y-2"
                  >
                    <p className="text-gray-400 text-[10px] md:text-xs font-black uppercase tracking-[0.5em] drop-shadow-sm">A Special Dua For</p>
                    
                    {/* Receiver Highlight */}
                    <motion.h3 
                       style={{ color: theme.secondary }}
                       className="text-4xl sm:text-5xl md:text-7xl font-black leading-none break-words px-2 bg-gradient-to-r from-yellow-100 via-yellow-300 to-yellow-100 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(253,224,71,0.5)]"
                    >
                      You
                    </motion.h3>
                  </motion.div>
                  
                  <motion.div 
                    style={{ translateZ: 50 }}
                    className="relative"
                  >
                    {/* WISH FONT */}
                    <p className="text-[#F9FAFB] italic text-xl sm:text-2xl md:text-4xl leading-relaxed px-2 md:px-6 drop-shadow-2xl font-['Playfair_Display'] font-medium">
                      "{data.wish}"
                    </p>
                  </motion.div>

                  {data.includeBlessing && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 }}
                      style={{ translateZ: 100 }}
                      className="pt-6 md:pt-10 border-t border-white/10 relative"
                    >
                      <p className="text-[10px] md:text-xs text-[#FCD34D] font-black uppercase tracking-[0.5em] mb-4 md:mb-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]">Blessings</p>
                      
                      <div className="relative group/dua">
                        <div className="absolute -inset-2 bg-yellow-400/20 blur-xl opacity-0 group-hover/dua:opacity-100 transition duration-1000"></div>
                        <p className="relative text-xl sm:text-2xl md:text-3xl text-[#FEF3C7] leading-relaxed px-2 md:px-8 italic drop-shadow-[0_0_20px_rgba(255,209,102,0.4)] font-['Playfair_Display'] font-semibold">
                          "{BLESSINGS[data.blessingIndex || 0]}"
                        </p>
                      </div>

                      <div className="mt-6 md:mt-10 flex justify-center">
                        <button 
                          onClick={handleAmeen}
                          disabled={saidAmeen}
                          className={`flex items-center gap-2 md:gap-3 px-6 py-3 md:px-10 md:py-4 rounded-full border-2 transition-all transform hover:scale-105 active:scale-95 ${saidAmeen ? 'bg-green-500 text-white border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.5)]' : 'bg-white/5 border-white/20 text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/40'}`}
                        >
                          {saidAmeen ? (
                            <>
                              <Check size={20} strokeWidth={3} />
                              <span className="text-xs md:text-sm font-black uppercase tracking-widest">Ameen Said</span>
                            </>
                          ) : (
                            <>
                              <Sparkles size={20} />
                              <span className="text-xs md:text-sm font-black uppercase tracking-widest">Say Ameen</span>
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* 5. Footer Parallax with Sender Name */}
                <motion.div 
                   style={{ translateZ: 60 }}
                   className="relative z-10 mt-auto flex flex-col items-center"
                >
                  <p className="text-[9px] md:text-[11px] text-gray-400 font-black uppercase tracking-[0.3em] mb-2 drop-shadow-sm">With Pure Heart,</p>
                  
                  {/* SOLID GOLD SENDER NAME - IDENTICAL TO BUILDER */}
                  <div className="relative group/name">
                    <p 
                       className="text-4xl md:text-6xl font-['Playfair_Display'] font-black italic tracking-wide text-[#FFD700] pb-2 relative z-10"
                       style={{ textShadow: '0 4px 10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.6)' }}
                    >
                        {data.from}
                    </p>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-yellow-500 blur-[2px] opacity-70"></div>
                  </div>
                </motion.div>

                <motion.div 
                  className="absolute inset-0 -z-10 blur-[120px] opacity-30 pointer-events-none"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  style={{ background: theme.glow }}
                ></motion.div>
            </motion.div>
            
            <div className="w-full -mt-6 z-20">
              <NativeAdUnit />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 w-full px-2 md:px-4 transform-gpu">
              <button 
                onClick={onCreateNew}
                className="group py-4 md:py-6 bg-white/5 hover:bg-white/10 text-white font-black rounded-[2rem] flex items-center justify-center gap-4 border border-white/10 transition-all shadow-2xl backdrop-blur-xl"
              >
                <PenTool size={24} className="group-hover:rotate-12 group-hover:scale-110 transition-transform" />
                <span className="text-base md:text-lg">Create My Own Card</span>
              </button>
              <button 
                onClick={() => {
                   const text = `I just received the most beautiful Ramzan card! 🌙\n\nThe design is stunning and the message is so heartfelt.\n\nCheck out my personalized gift here:\n${window.location.href}\n\nCreate one for your loved ones too! #Ramzan2026 #Blessings`;
                   window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                }}
                className="group py-4 md:py-6 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-[2rem] flex items-center justify-center gap-4 transition-all shadow-[0_25px_60px_rgba(255,209,102,0.5)]"
              >
                <Share2 size={24} className="group-hover:scale-110 group-hover:rotate-[-10deg] transition-transform" />
                <span className="text-base md:text-lg">Spread The Goodness</span>
              </button>
            </div>
            
            <DisplayAdUnit size="medium" />

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
              className="text-gray-400 text-xs md:text-sm text-center font-bold tracking-wide italic mt-2 md:mt-6 px-6 md:px-10 leading-relaxed pb-8"
            >
              "The most beautiful gift you can give someone is a sincere Dua when they need it most. Share the Noor."
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        .clip-path-triangle {
            clip-path: polygon(0 0, 50% 100%, 100% 0);
        }
      `}</style>
    </div>
  );
};

export default ReceiverView;
