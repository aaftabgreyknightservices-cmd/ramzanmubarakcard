
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Share2, PenTool, Sparkles, Moon, Check, Volume2, VolumeX, Lock, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CardData, THEMES, BLESSINGS } from '../types';
import { NativeAdUnit, DisplayAdUnit, SmartLinkButton } from './AdUnits';

interface Props {
  data: CardData;
  onCreateNew: () => void;
}

// --- VISUAL COMPONENTS ---

const CalligraphySVG = ({ color }: { color: string }) => (
  <motion.svg 
    viewBox="0 0 300 150" 
    className="w-full h-full opacity-20"
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.2 }}
    transition={{ duration: 2 }}
  >
    <path
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      d="M40,80 Q70,20 120,60 T200,40 M60,110 Q150,130 240,90 M100,30 Q110,10 120,30 M180,30 Q190,10 200,30"
    />
    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="arabic text-[90px]" fill={color} opacity="0.4">
      رمضان
    </text>
  </motion.svg>
);

// --- HYPER ENVELOPE COMPONENT ---
const GoldenEnvelope = ({ from, onClick, isOpening }: { from: string, onClick: () => void, isOpening: boolean }) => {
  return (
    <motion.div 
        className="relative perspective-1000 group cursor-pointer z-50" 
        onClick={onClick}
        animate={isOpening ? { scale: [1, 1.1, 1.2], rotate: [0, -2, 2, 0] } : {}}
        transition={{ duration: 0.8 }}
    >
      <motion.div
        initial={{ y: -100, opacity: 0, rotateX: 20 }}
        animate={isOpening ? 
            { rotateX: -10, y: 0, opacity: 1, filter: "brightness(1.5)" } : 
            { rotateX: 0, rotateY: 0, y: 0, opacity: 1 }
        }
        className="w-[340px] h-[240px] md:w-[450px] md:h-[320px] bg-gradient-to-br from-[#E6B800] via-[#FDD835] to-[#B38F00] rounded-lg shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative flex items-center justify-center transform-gpu border-t border-white/20"
      >
        {/* Envelope Paper Texture */}
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
        
        {/* Envelope Structure */}
        <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
             <div className="absolute top-0 left-0 w-1/2 h-full border-r border-yellow-700/10 transform skew-x-12 origin-top-left opacity-30"></div>
             <div className="absolute top-0 right-0 w-1/2 h-full border-l border-yellow-700/10 transform -skew-x-12 origin-top-right opacity-30"></div>
             <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-yellow-300/40 to-yellow-600/10 clip-path-triangle backdrop-blur-sm z-20 shadow-lg"></div>
        </div>

        {/* The Wax Seal */}
        <div className="relative z-30 flex flex-col items-center justify-center gap-6 mt-10">
            <motion.div 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className="relative"
            >
                <div className="w-24 h-24 bg-gradient-to-br from-red-700 to-red-900 rounded-full shadow-[0_10px_25px_rgba(0,0,0,0.4)] flex items-center justify-center border-4 border-red-800/50 ring-4 ring-red-900/20">
                    <Lock className="text-yellow-100/80 drop-shadow-md" size={36} />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping opacity-20"></div>
            </motion.div>
            
            <div className="text-center space-y-1">
                <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-yellow-900/60 font-bold">A Special Gift From</p>
                <h3 className="text-2xl md:text-4xl font-['Playfair_Display'] font-black text-yellow-950 drop-shadow-sm">{from}</h3>
            </div>
        </div>

        <div className="absolute -inset-20 bg-yellow-400/20 blur-[60px] -z-10 animate-pulse"></div>
      </motion.div>
      
      {!isOpening && (
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 1.5, repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
            className="text-center mt-12 text-yellow-500/80 text-xs font-bold tracking-[0.4em] uppercase"
          >
            Tap Seal to Open
          </motion.p>
      )}
    </motion.div>
  );
};

const ReceiverView: React.FC<Props> = ({ data, onCreateNew }) => {
  // State for the Cinematic Sequence
  const [isOpening, setIsOpening] = useState(false); // Envelope animation starts
  const [flash, setFlash] = useState(false);       // White screen on
  const [revealed, setRevealed] = useState(false); // DOM swap (Envelope -> Card)

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

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-7, 7]);

  useEffect(() => {
    audioRef.current = new Audio('https://assets.mixkit.co/music/preview/mixkit-ethereal-meditation-159.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;
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
    // 1. Play Audio
    if (isMuted && audioRef.current) {
        audioRef.current.play().catch(() => {});
        setIsMuted(false);
    }

    // 2. Animate Envelope
    setIsOpening(true);

    // 3. Trigger Flashbang (Mask)
    // Wait 600ms for envelope to shake/scale up
    setTimeout(() => {
        setFlash(true); // Screen goes white FAST
    }, 600);

    // 4. Swap Content Behind the Flash
    setTimeout(() => {
        setRevealed(true); // Unmount Envelope, Mount Card (hidden by flash)
        
        // Trigger Confetti 'Bang' behind the flash for when it fades
        const end = Date.now() + 1000;
        const colors = [theme.accent, '#FFD700', '#ffffff'];
        (function frame() {
          confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: colors });
          confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: colors });
          if (Date.now() < end) requestAnimationFrame(frame);
        }());
    }, 900);

    // 5. Fade Out Flash (Reveal Card)
    setTimeout(() => {
        setFlash(false); // Screen fades to transparent SLOWLY
    }, 1100);
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
      particleCount: 150,
      spread: 70,
      origin: { y: 0.8 },
      colors: [theme.accent, theme.secondary, '#FFFFFF'],
      gravity: 1.2
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

      <SmartLinkButton />

      {/* --- THE FLASH MASK (Prevents Blank Screen) --- */}
      {/* 
          Logic: 
          - opacity-0 by default. 
          - opacity-100 when flash=true (duration-200ms -> fast in)
          - opacity-0 when flash=false (duration-2000ms -> slow reveal)
      */}
      <div 
        className={`fixed inset-0 bg-white z-[9999] pointer-events-none transition-opacity ease-in-out ${flash ? 'opacity-100 duration-200' : 'opacity-0 duration-[2000ms]'}`} 
      />

      {/* Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
         {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
              style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
              animate={{ opacity: [0, 1, 0], y: [0, -30], scale: [0, 1.5, 0] }}
              transition={{ duration: 3 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 5 }}
            />
         ))}
      </div>

      <AnimatePresence mode="popLayout">
        
        {/* STAGE 1: ENVELOPE */}
        {!revealed && (
          <motion.div
            key="envelope-layer"
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0 } }} // Instant exit because flash covers it
          >
             <motion.div>
                 {!isOpening && (
                     <motion.div initial={{y: -20, opacity:0}} animate={{y:0, opacity:1}} className="text-center mb-12">
                         <h1 className="text-4xl md:text-6xl font-light tracking-[0.2em] uppercase text-white mb-2">Blessing Arrived</h1>
                         <p className="text-yellow-400 font-mono text-sm tracking-widest animate-pulse">A soul message waits for you</p>
                     </motion.div>
                 )}
                 <GoldenEnvelope from={data.from} onClick={handleOpenGift} isOpening={isOpening} />
             </motion.div>
          </motion.div>
        )}

        {/* STAGE 2: THE CARD (Revealed) */}
        {revealed && (
          <motion.div
            key="card-layer"
            initial={{ opacity: 1 }} // It's already opaque under the white mask
            animate={{ opacity: 1 }}
            className="w-full max-w-2xl z-10 flex flex-col items-center gap-8 md:gap-14 pb-20 relative"
          >
             <motion.div 
               initial={{ y: -50, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 1, duration: 0.8 }}
               className="text-center space-y-4 relative z-20"
             >
                <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-yellow-400 text-[10px] md:text-sm font-black tracking-[0.3em] uppercase backdrop-blur-xl shadow-lg">
                   Holy Gift Unlocked
                </div>
             </motion.div>

             {/* THE FLOATING CARD */}
             <motion.div
                ref={cardRef}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
                className="w-full aspect-[3/4.6] glass rounded-[3rem] md:rounded-[4rem] p-6 md:p-12 flex flex-col justify-between items-center text-center shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative transform-gpu"
             >
                {/* Continuous Levitation Animation */}
                <motion.div 
                   className="absolute inset-0 z-0 pointer-events-none"
                   animate={{ y: [-15, 15, -15] }}
                   transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                        <CalligraphySVG color={theme.accent} />
                    </div>
                </motion.div>

                {/* Card Backgrounds */}
                <div className="absolute inset-0 rounded-[3rem] md:rounded-[4rem] bg-gradient-to-br from-white/5 to-transparent z-0 pointer-events-none border border-white/10"></div>
                <div className="absolute inset-0 rounded-[3rem] md:rounded-[4rem] opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-0"></div>

                {/* Parallax Elements */}
                <motion.div 
                   style={{ translateZ: 60, x: useTransform(smoothX, [-0.5, 0.5], [-20, 20]) }}
                   className="absolute top-10 right-10 opacity-80 pointer-events-none z-10"
                >
                    <Moon size={100} className="text-yellow-400 drop-shadow-[0_0_30px_rgba(253,224,71,0.4)]" fill="currentColor" stroke="none" />
                </motion.div>

                {/* Content */}
                <div className="relative z-20 w-full h-full flex flex-col justify-between">
                    <div className="space-y-4 mt-4">
                        <span className="text-yellow-400 font-black tracking-[0.4em] uppercase text-[10px] md:text-xs drop-shadow-md">Holy Ramzan 2026</span>
                        <div className="arabic text-4xl md:text-6xl font-bold mt-2 drop-shadow-2xl text-white">رمضان مبارك</div>
                    </div>

                    <div className="space-y-8 md:space-y-12">
                        <div className="space-y-2">
                             <p className="text-gray-400 text-[10px] md:text-xs font-black uppercase tracking-[0.5em]">A Special Dua For</p>
                             <h3 
                                style={{ color: theme.secondary }}
                                className="text-5xl md:text-7xl font-black leading-none bg-gradient-to-r from-yellow-100 via-yellow-300 to-yellow-100 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(253,224,71,0.6)]"
                             >
                                You
                             </h3>
                        </div>

                        <div className="relative">
                            <Star className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-400/50 w-6 h-6 animate-spin-slow" />
                            <p className="text-[#F9FAFB] italic text-xl sm:text-2xl md:text-3xl leading-relaxed px-4 font-['Playfair_Display'] font-medium drop-shadow-lg">
                                "{data.wish}"
                            </p>
                        </div>

                        {data.includeBlessing && (
                           <div className="pt-8 border-t border-white/10 relative">
                              <p className="text-[10px] md:text-xs text-[#FCD34D] font-black uppercase tracking-[0.5em] mb-4">Blessings</p>
                              <p className="text-lg md:text-2xl text-[#FEF3C7] leading-relaxed italic font-['Playfair_Display'] font-semibold drop-shadow-[0_0_15px_rgba(255,209,102,0.3)]">
                                 "{BLESSINGS[data.blessingIndex || 0]}"
                              </p>
                           </div>
                        )}
                    </div>

                    <div className="mt-8 flex flex-col items-center">
                        <p className="text-[9px] md:text-[11px] text-gray-400 font-black uppercase tracking-[0.3em] mb-2">With Pure Heart,</p>
                        <div className="relative group/name">
                             <p 
                                className="text-4xl md:text-6xl font-['Playfair_Display'] font-black italic tracking-wide text-[#FFD700] pb-2 relative z-10"
                                style={{ textShadow: '0 4px 10px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255, 215, 0, 0.8)' }}
                             >
                                 {data.from}
                             </p>
                             <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2/3 h-[3px] bg-yellow-500 blur-[4px] opacity-80"></div>
                        </div>
                    </div>
                </div>
             </motion.div>

             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full px-4"
             >
                  <button 
                    onClick={handleAmeen}
                    disabled={saidAmeen}
                    className={`py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all ${saidAmeen ? 'bg-green-500 text-white shadow-[0_0_30px_rgba(34,197,94,0.4)]' : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'}`}
                  >
                     {saidAmeen ? <span className="flex items-center justify-center gap-2"><Check /> Ameen Said</span> : "Say Ameen"}
                  </button>
                  <button 
                    onClick={onCreateNew}
                    className="py-4 bg-yellow-400 text-black rounded-full font-black text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(255,209,102,0.4)] hover:scale-105 transition-transform flex items-center justify-center gap-2"
                  >
                     <PenTool size={16} /> Create Mine
                  </button>
             </motion.div>
             
             <NativeAdUnit />
             <DisplayAdUnit size="medium" />

          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        .clip-path-triangle {
            clip-path: polygon(0 0, 50% 100%, 100% 0);
        }
        .animate-spin-slow {
            animation: spin 8s linear infinite;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ReceiverView;
