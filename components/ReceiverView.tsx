
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { PenTool, Check, Volume2, VolumeX, Lock, Moon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CardData, THEMES, BLESSINGS } from '../types';
import { Language } from '../translations';
import { NativeAdUnit, DisplayAdUnit, SmartLinkButton } from './AdUnits';
import { cld } from '../utils/images';

interface Props {
  data: CardData;
  onCreateNew: () => void;
  t: any;
  lang: Language;
}

const GoldenEnvelope = ({ from, onClick, isOpening, t }: { from: string, onClick: () => void, isOpening: boolean, t: any }) => {
  return (
    <motion.div 
        className="relative perspective-1000 group cursor-pointer z-40 max-w-[90vw]" 
        onClick={onClick}
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={isOpening ? { scale: 1.5, opacity: 0, filter: "brightness(2)" } : { y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "circIn" }}
    >
      <motion.div
        className="w-[340px] h-[240px] md:w-[450px] md:h-[320px] bg-gradient-to-br from-[#FFD700] via-[#FDB931] to-[#C5A028] rounded-xl shadow-[0_0_80px_rgba(255,215,0,0.3)] relative flex items-center justify-center transform-gpu border-t border-white/40 overflow-hidden"
        whileHover={{ rotate: 1, scale: 1.02 }}
      >
        <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
             <div className="absolute top-0 left-0 w-1/2 h-full border-r border-black/10 transform skew-x-12 origin-top-left opacity-40"></div>
             <div className="absolute top-0 right-0 w-1/2 h-full border-l border-black/10 transform -skew-x-12 origin-top-right opacity-40"></div>
             <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-white/5 clip-path-triangle backdrop-blur-[2px] z-20 shadow-sm"></div>
        </div>

        <div className="relative z-30 flex flex-col items-center justify-center gap-4 mt-12 px-4">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-[#8B0000] to-[#600000] rounded-full shadow-2xl border-[3px] border-[#A52A2A] flex items-center justify-center ring-4 ring-red-900/20 z-20 relative">
                    <Lock className="text-yellow-500/90 drop-shadow-md" size={32} />
                </div>
                {!isOpening && (
                    <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping opacity-40 z-10"></div>
                )}
            </motion.div>
            <div className="text-center space-y-1 max-w-full">
                <p className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-yellow-900/60 font-black">A Gift From</p>
                <h3 className="text-2xl md:text-4xl font-['Playfair_Display'] font-black text-yellow-950 drop-shadow-sm truncate w-full px-2">{from}</h3>
            </div>
        </div>
        <div className="absolute -inset-20 bg-yellow-400/20 blur-[60px] -z-10 animate-pulse"></div>
        
        {/* Envelope Decor */}
        <img 
            src={cld("https://res.cloudinary.com/dxw5mimqj/image/upload/v1770239783/Ramadan_Lantern_xeufdp.png", 100)} 
            className="absolute -right-4 top-10 w-12 opacity-80"
            alt="lantern"
            loading="lazy"
        />
      </motion.div>
      {!isOpening && (
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 1, duration: 1 }}
            className="text-center mt-8 text-yellow-400/90 text-xs font-black tracking-[0.3em] uppercase animate-pulse"
          >
            {t.open}
          </motion.p>
      )}
    </motion.div>
  );
};

const ReceiverView: React.FC<Props> = ({ data, onCreateNew, t, lang }) => {
  const [isOpening, setIsOpening] = useState(false); 
  const [flash, setFlash] = useState(false);       
  const [revealed, setRevealed] = useState(false); 
  const [saidAmeen, setSaidAmeen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  
  const senderName = data.from || "A Friend";
  const theme = THEMES.find(t => t.id === data.themeId) || THEMES[0];
  
  const cardRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 100, damping: 20 });
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
    if (isMuted && audioRef.current) {
        audioRef.current.play().catch(() => {});
        setIsMuted(false);
    }
    setIsOpening(true);
    setTimeout(() => setFlash(true), 400);
    setTimeout(() => {
        setRevealed(true);
        window.scrollTo(0, 0);
        try {
            const end = Date.now() + 1500;
            const colors = [theme.accent, '#FFD700', '#ffffff'];
            (function frame() {
              confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors: colors });
              confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors: colors });
              if (Date.now() < end) requestAnimationFrame(frame);
            }());
        } catch(e) { console.error(e); }
    }, 900);
    setTimeout(() => setFlash(false), 1500);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <div 
      className={`min-h-screen bg-gradient-to-b ${theme.gradient} text-white flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
    >
      <button onClick={toggleSound} className="fixed top-4 right-4 md:top-8 md:right-8 z-[100] group flex items-center gap-3 px-4 py-2 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full border border-white/10 transition-all shadow-lg">
        <div className="flex items-center gap-1 h-3 md:h-4">
           {isMuted ? <VolumeX size={16} className="text-gray-400" /> : <Volume2 size={16} className="text-yellow-400" />}
        </div>
        <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-white/90">{isMuted ? t.playMusic : t.soundOn}</span>
      </button>

      <SmartLinkButton />

      <div className={`fixed inset-0 bg-white z-50 pointer-events-none transition-opacity ease-in-out ${flash ? 'opacity-100 duration-500' : 'opacity-0 duration-[2000ms]'}`} />

      {revealed && (
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ duration: 2 }} className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
             <div className="w-[200vw] h-[200vw] bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent rotate-45 blur-[100px] animate-pulse"></div>
         </motion.div>
      )}

      {/* CLEANED UP BACKGROUND - REMOVED DOME/STARS */}

      <AnimatePresence mode="wait">
        {!revealed && (
          <motion.div key="envelope-layer" className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0 } }}>
             <motion.div className="flex flex-col items-center">
                 {!isOpening && (
                     <motion.div initial={{y: -20, opacity:0}} animate={{y:0, opacity:1}} transition={{delay: 0.2}} className="text-center mb-12">
                         <h1 className="text-3xl md:text-5xl font-light tracking-[0.2em] uppercase text-white mb-2">{t.arrived}</h1>
                         <p className="text-yellow-400 font-mono text-xs md:text-sm tracking-widest animate-pulse">{t.wait}</p>
                     </motion.div>
                 )}
                 <GoldenEnvelope from={senderName} onClick={handleOpenGift} isOpening={isOpening} t={t} />
             </motion.div>
          </motion.div>
        )}

        {revealed && (
          <motion.div key="card-layer" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: "easeOut" }} className="w-full max-w-2xl z-20 flex flex-col items-center gap-8 md:gap-14 py-10 relative">
             <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1, duration: 0.8 }} className="text-center space-y-4 relative z-20">
                <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-yellow-400 text-[10px] md:text-sm font-black tracking-[0.3em] uppercase backdrop-blur-xl shadow-lg">{t.unlocked}</div>
             </motion.div>

             <motion.div 
                ref={cardRef} 
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} 
                className="w-full min-h-[60vh] md:min-h-[70vh] glass rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-10 flex flex-col relative transform-gpu shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
             >
                <div className="absolute inset-0 rounded-[2.5rem] md:rounded-[4rem] bg-gradient-to-br from-white/5 to-transparent z-0 pointer-events-none border border-white/10"></div>
                <div className="absolute inset-0 rounded-[2.5rem] md:rounded-[4rem] opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-0"></div>
                
                <motion.div style={{ translateZ: 60, x: useTransform(smoothX, [-0.5, 0.5], [-20, 20]) }} className="absolute top-10 right-10 opacity-80 pointer-events-none z-10">
                    <Moon size={100} className="text-yellow-400 drop-shadow-[0_0_30px_rgba(253,224,71,0.4)]" fill="currentColor" stroke="none" />
                </motion.div>

                {/* Content Container */}
                <div className="relative z-20 flex-1 flex flex-col justify-between">
                    <div className="space-y-4 mt-2">
                        <span className="text-yellow-400 font-black tracking-[0.4em] uppercase text-[10px] md:text-xs drop-shadow-md">Holy Ramzan 2026</span>
                        <div className="arabic text-4xl md:text-6xl font-bold mt-2 drop-shadow-2xl text-white relative z-10">رمضان مبارك</div>
                    </div>

                    <div className="py-8 space-y-6 md:space-y-8 flex-1 flex flex-col justify-center">
                        <div className="space-y-2">
                             <p className="text-gray-400 text-[10px] md:text-xs font-black uppercase tracking-[0.5em]">A Special Dua For</p>
                             <h3 style={{ color: theme.secondary }} className="text-5xl md:text-6xl font-black leading-none bg-gradient-to-r from-yellow-100 via-yellow-300 to-yellow-100 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(253,224,71,0.6)]">You</h3>
                        </div>

                        <div className="relative">
                            <p className="text-[#F9FAFB] italic text-lg sm:text-xl md:text-2xl leading-relaxed px-2 font-['Playfair_Display'] font-medium drop-shadow-lg break-words">
                                "{data.wish}"
                            </p>
                        </div>

                        {data.includeBlessing && (
                           <div className="pt-6 border-t border-white/10 relative">
                              <p className="text-[10px] md:text-xs text-[#FCD34D] font-black uppercase tracking-[0.5em] mb-4">Blessings</p>
                              <p className="text-base md:text-lg text-[#FEF3C7] leading-relaxed italic font-['Playfair_Display'] font-semibold drop-shadow-[0_0_15px_rgba(255,209,102,0.3)]">
                                  "{BLESSINGS[data.blessingIndex || 0]}"
                              </p>
                           </div>
                        )}
                    </div>

                    <div className="mt-auto pt-6 flex flex-col items-center pb-2">
                        <p className="text-[9px] md:text-[11px] text-gray-400 font-black uppercase tracking-[0.3em] mb-3">With Pure Heart,</p>
                        <div className="relative group/name">
                             <motion.p 
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 150, damping: 10, delay: 0.7 }}
                                className="text-3xl md:text-5xl font-['Playfair_Display'] font-black italic tracking-wide text-[#FFD700] pb-2 relative z-10" 
                             >
                                <motion.span
                                    animate={{ 
                                        textShadow: [
                                            '0 4px 10px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255, 215, 0, 0.6)', 
                                            '0 4px 10px rgba(0, 0, 0, 0.5), 0 0 60px rgba(255, 215, 0, 1)',
                                            '0 4px 10px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255, 215, 0, 0.6)'
                                        ],
                                        color: ['#FFD700', '#FFFACD', '#FFD700']
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    {senderName}
                                </motion.span>
                             </motion.p>
                             <motion.div 
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: "70%", opacity: 0.8 }}
                                transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
                                className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-[3px] bg-yellow-500 blur-[4px]"
                             />
                        </div>
                    </div>
                </div>
             </motion.div>

             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full px-4 mb-8">
                  <button onClick={() => setSaidAmeen(true)} disabled={saidAmeen} className={`py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all ${saidAmeen ? 'bg-green-500 text-white shadow-[0_0_30px_rgba(34,197,94,0.4)]' : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'}`}>
                     {saidAmeen ? <span className="flex items-center justify-center gap-2"><Check /> {t.ameenSaid}</span> : t.sayAmeen}
                  </button>
                  <button onClick={onCreateNew} className="py-4 bg-yellow-400 text-black rounded-full font-black text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(255,209,102,0.4)] hover:scale-105 transition-transform flex items-center justify-center gap-2">
                     <PenTool size={16} /> {t.createMine}
                  </button>
             </motion.div>
             
             <NativeAdUnit />
             <DisplayAdUnit size="medium" />

             {/* REMOVED FOOTER DECOR */}

          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        .clip-path-triangle { clip-path: polygon(0 0, 50% 100%, 100% 0); }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ReceiverView;
