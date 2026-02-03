
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Share2, Download, Copy, Check, Sparkles, RefreshCw, Send, Moon, Heart, ChevronLeft, ChevronRight, Shuffle, PenTool } from 'lucide-react';
import html2canvas from 'html2canvas';
import { CardData, CardTheme, THEMES, BLESSINGS, PRESET_WISHES } from '../types';
import { NativeAdUnit, DisplayAdUnit } from './AdUnits';

interface Props {
  onThemeChange: (theme: CardTheme) => void;
  activeTheme: CardTheme;
}

const CalligraphySVG = ({ color }: { color: string }) => (
  <motion.svg 
    viewBox="0 0 300 150" 
    className="w-full h-full opacity-20"
    initial={{ pathLength: 0, opacity: 0 }}
    animate={{ pathLength: 1, opacity: 0.2 }}
    transition={{ duration: 3, ease: "easeInOut" }}
  >
    <path
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      d="M40,80 Q70,20 120,60 T200,40 M60,110 Q150,130 240,90 M100,30 Q110,10 120,30 M180,30 Q190,10 200,30"
      className="drop-shadow-lg"
    />
    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="arabic text-[80px]" fill={color} opacity="0.4">
      رمضان
    </text>
  </motion.svg>
);

const CardBuilder: React.FC<Props> = ({ onThemeChange, activeTheme }) => {
  const [formData, setFormData] = useState<CardData>({
    from: '',
    to: 'You', 
    relationship: 'Friend', 
    wish: PRESET_WISHES[0],
    themeId: THEMES[0].id,
    includeBlessing: true,
    addSurprise: false,
    blessingIndex: 0
  });

  const [wishIndex, setWishIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Advanced Mouse Parallax Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 100, damping: 20 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);
  
  const moonTranslateX = useTransform(smoothX, [-0.5, 0.5], [-15, 15]);
  const moonTranslateY = useTransform(smoothY, [-0.5, 0.5], [-15, 15]);
  
  const calliTranslateX = useTransform(smoothX, [-0.5, 0.5], [-30, 30]);
  const calliTranslateY = useTransform(smoothY, [-0.5, 0.5], [-30, 30]);

  const textTranslateX = useTransform(smoothX, [-0.5, 0.5], [8, -8]);
  const textTranslateY = useTransform(smoothY, [-0.5, 0.5], [8, -8]);

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

  // --- WISH CYCLING LOGIC ---
  const nextWish = () => {
    const next = (wishIndex + 1) % PRESET_WISHES.length;
    setWishIndex(next);
    setFormData({ ...formData, wish: PRESET_WISHES[next] });
  };

  const prevWish = () => {
    const prev = (wishIndex - 1 + PRESET_WISHES.length) % PRESET_WISHES.length;
    setWishIndex(prev);
    setFormData({ ...formData, wish: PRESET_WISHES[prev] });
  };

  const shuffleWish = () => {
    const random = Math.floor(Math.random() * PRESET_WISHES.length);
    setWishIndex(random);
    setFormData({ ...formData, wish: PRESET_WISHES[random] });
  };

  // --- BLESSING CYCLING LOGIC ---
  const nextBlessing = () => {
    const next = ((formData.blessingIndex || 0) + 1) % BLESSINGS.length;
    setFormData({ ...formData, blessingIndex: next });
  };

  const prevBlessing = () => {
    const current = formData.blessingIndex || 0;
    const prev = (current - 1 + BLESSINGS.length) % BLESSINGS.length;
    setFormData({ ...formData, blessingIndex: prev });
  };
  
  const shuffleBlessing = () => {
    const random = Math.floor(Math.random() * BLESSINGS.length);
    setFormData({ ...formData, blessingIndex: random });
  };

  const generateLink = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const payload = { ...formData, to: "You", relationship: "Friend", themeId: activeTheme.id };
      const dataStr = btoa(encodeURIComponent(JSON.stringify(payload)));
      const url = `${window.location.origin}${window.location.pathname}#data=${dataStr}`;
      setShareUrl(url);
      setIsGenerating(false);
      
      setTimeout(() => {
        const shareEl = document.getElementById('share-controls');
        shareEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }, 1200);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadImage = async () => {
    if (!cardRef.current) return;
    mouseX.set(0);
    mouseY.set(0);
    
    // Slight delay to ensure transforms reset
    setTimeout(async () => {
      const canvas = await html2canvas(cardRef.current!, {
        backgroundColor: null, // We handle background internally now
        scale: 3,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      const link = document.createElement('a');
      link.download = `NoorCard-Ramzan2026.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }, 100);
  };

  const shareOnWhatsApp = () => {
    const text = `Hey! 💚🌙\n\nRamzan is coming soon, and I made a special Dua card for you.\n\nThe design is stunning, and the duas inside are powerful. I wanted to share these blessings with you before Ramzan starts.\n\nTap the link to open your card:\n\n👉 ${shareUrl}\n\nLet's spread goodness together. 🤍\n#RamzanBlessings #DuaCard #ShareTheGoodness`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
      {/* Builder Form */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="glass p-6 md:p-10 rounded-[2.5rem] space-y-8 border-white/10 shadow-2xl"
      >
        <div className="space-y-10">
          
          {/* RE-ENGINEERED INPUT - DISTINCT "BOX" STYLE */}
          <div className="relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 via-yellow-200/20 to-yellow-500/20 rounded-3xl blur opacity-30 group-focus-within:opacity-100 transition-opacity duration-700"></div>
               
               <div className="relative bg-black/40 border border-yellow-400/30 rounded-3xl p-6 md:p-8 flex flex-col items-center gap-4 shadow-[inset_0_2px_15px_rgba(0,0,0,0.5)]">
                   <div className="flex items-center gap-2 text-yellow-400/80 mb-2">
                       <PenTool size={16} className="animate-bounce" />
                       <span className="text-[10px] uppercase font-black tracking-[0.3em]">Sign Your Masterpiece</span>
                   </div>
                   
                   <div className="relative w-full">
                       <input 
                         type="text"
                         placeholder="Type Name Here..."
                         className="w-full bg-transparent text-center text-3xl md:text-5xl font-['Playfair_Display'] font-black text-white placeholder:text-white/20 focus:outline-none py-2"
                         value={formData.from}
                         onChange={(e) => setFormData({...formData, from: e.target.value})}
                       />
                       {/* Input Accent Lines */}
                       <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10"></div>
                       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-yellow-400 group-focus-within:w-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(253,224,71,0.8)]"></div>
                   </div>
                   
                   <p className="text-[10px] text-gray-500 italic">This will appear as the sender on the golden card</p>
               </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">
                Your Heartfelt Wish
            </label>
            <textarea 
              rows={4}
              placeholder="May this Ramzan bring you peace, joy, and endless blessings..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-yellow-400 focus:bg-white/10 transition-all resize-none placeholder:text-gray-600 mb-2 font-['Playfair_Display'] text-lg"
              maxLength={150}
              value={formData.wish}
              onChange={(e) => setFormData({...formData, wish: e.target.value})}
            />
            
            {/* Wish Cycler Controls */}
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <button onClick={prevWish} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10"><ChevronLeft size={16} /></button>
                    <button onClick={shuffleWish} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10"><Shuffle size={16} /></button>
                    <button onClick={nextWish} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10"><ChevronRight size={16} /></button>
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider ml-1">Browse 100+ Wishes</span>
                </div>
                <p className="text-[10px] text-gray-500">{formData.wish.length}/150</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-1">Visual Theme</label>
          <div className="grid grid-cols-4 gap-3">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => onThemeChange(theme)}
                className={`group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${activeTheme.id === theme.id ? 'border-yellow-400 scale-105 md:scale-110 shadow-[0_0_20px_rgba(255,209,102,0.3)]' : 'border-white/10 opacity-60 hover:opacity-100'}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`}></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <span className="text-[8px] font-bold uppercase tracking-tighter">{theme.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-white/5">
          <div className="flex flex-col gap-4 glass p-6 rounded-3xl border-white/10 bg-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-400/20 rounded-xl">
                  <Heart className="text-yellow-400" size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs md:text-sm font-black uppercase tracking-widest">Soul-Touch Blessing</span>
                  <span className="text-[10px] text-gray-500">Add a curated spiritual Dua</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={formData.includeBlessing}
                  onChange={(e) => setFormData({...formData, includeBlessing: e.target.checked})}
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
              </label>
            </div>

            {formData.includeBlessing && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pt-4 border-t border-white/5"
              >
                <div className="relative group cursor-pointer overflow-hidden p-4 rounded-xl bg-black/20 border border-white/5 hover:border-yellow-400/30 transition-all">
                  <p className="text-lg text-[#F9FAFB] italic leading-relaxed text-center font-['Playfair_Display']">
                    "{BLESSINGS[formData.blessingIndex || 0]}"
                  </p>
                  
                  {/* Blessing Cycler Controls */}
                  <div className="mt-4 flex items-center justify-center gap-3">
                     <button onClick={prevBlessing} className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"><ChevronLeft size={14} className="text-yellow-400" /></button>
                     <button onClick={shuffleBlessing} className="flex items-center gap-2 text-[10px] text-yellow-400/60 font-bold uppercase tracking-[0.2em] px-3 py-1.5 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                        <RefreshCw size={10} /> Find Blessing
                     </button>
                     <button onClick={nextBlessing} className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"><ChevronRight size={14} className="text-yellow-400" /></button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
        
        <NativeAdUnit />

        <button 
          onClick={generateLink}
          disabled={!formData.from || isGenerating}
          className="w-full py-5 bg-yellow-400 text-black font-black rounded-2xl shadow-[0_10px_30px_rgba(255,209,102,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg uppercase tracking-widest"
        >
          {isGenerating ? (
            <RefreshCw className="animate-spin" size={24} />
          ) : (
            <>
              <Share2 size={24} />
              Create Universal Link
            </>
          )}
        </button>

        <AnimatePresence>
          {shareUrl && (
            <motion.div 
              id="share-controls"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 pt-8 border-t border-white/10"
            >
              <div className="text-center">
                <h4 className="text-xl font-bold text-yellow-400 mb-2">Universal Card Ready! 🎁</h4>
                <p className="text-sm text-gray-400 italic">"Goodness shared is goodness multiplied."</p>
              </div>

              <div className="p-5 bg-white/5 rounded-2xl flex items-center gap-4 border border-white/10 group focus-within:border-yellow-400/50 transition-all">
                <input 
                  type="text" 
                  readOnly 
                  value={shareUrl} 
                  className="bg-transparent text-xs text-gray-400 flex-1 truncate outline-none font-mono" 
                />
                <button 
                  onClick={copyToClipboard}
                  className="p-3 hover:bg-white/10 rounded-xl transition-all active:scale-90"
                >
                  {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={shareOnWhatsApp}
                  className="py-4 px-6 bg-[#25D366] text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:brightness-110 shadow-lg transition-all"
                >
                  <Send size={20} />
                  <span className="text-sm">Share on WhatsApp</span>
                </button>
                <button 
                  onClick={downloadImage}
                  className="py-4 px-6 bg-white/10 text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-white/20 transition-all border border-white/10"
                >
                  <Download size={20} />
                  <span className="text-sm">Download Card</span>
                </button>
              </div>
              
              <DisplayAdUnit size="medium" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Advanced Preview Section */}
      <div className="lg:sticky lg:top-24 flex flex-col items-center">
        <div 
          className="perspective-1000 w-full max-w-[420px]"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            ref={cardRef}
            style={{ 
              rotateX, 
              rotateY,
              transformStyle: "preserve-3d"
            }}
            className={`aspect-[3/4.6] rounded-[2rem] md:rounded-[3.5rem] p-5 md:p-10 relative overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] transform-gpu group/card`}
          >
            {/* 1. PHYSICAL CARD BACKGROUND (Fixes Download Transparency Issue) */}
            <div className={`absolute inset-0 bg-gradient-to-br ${activeTheme.gradient} z-[-50]`}></div>
            
            {/* 2. NOISE TEXTURE (Premium Feel) */}
            <div className="absolute inset-0 opacity-20 z-[-40] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

            <motion.div
              style={{
                x: calliTranslateX,
                y: calliTranslateY,
                translateZ: -20
              }}
              className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none"
            >
              <CalligraphySVG color={activeTheme.accent} />
            </motion.div>

            <motion.div 
               style={{ 
                 x: useTransform(smoothX, [-0.5, 0.5], [-30, 30]),
                 y: useTransform(smoothY, [-0.5, 0.5], [-30, 30]),
                 translateZ: -50
               }}
               className="absolute inset-0 -z-20 opacity-30 blur-[40px]"
            >
               <div className="absolute top-1/4 right-1/4 w-40 md:w-60 h-40 md:h-60 rounded-full" style={{ background: activeTheme.secondary }}></div>
               <div className="absolute bottom-1/4 left-1/4 w-28 md:w-40 h-28 md:h-40 rounded-full" style={{ background: activeTheme.primary }}></div>
            </motion.div>

            <motion.div 
              style={{ 
                x: moonTranslateX, 
                y: moonTranslateY,
                translateZ: 40
              }}
              className="absolute top-6 right-6 md:top-10 md:right-10 opacity-70 z-20 pointer-events-none"
            >
              <Moon size={80} className="md:w-[140px] md:h-[140px]" fill={activeTheme.accent} stroke="none" />
            </motion.div>

            <motion.div 
              style={{ 
                x: textTranslateX, 
                y: textTranslateY,
                translateZ: 80
              }}
              className="relative z-30 h-full flex flex-col justify-between items-center text-center transform-gpu"
            >
              <div className="space-y-4">
                <motion.div 
                  style={{ translateZ: 20 }}
                  className="inline-block px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-black/30 text-[9px] md:text-[10px] font-black text-yellow-400 tracking-[0.3em] uppercase border border-yellow-400/20 backdrop-blur-md shadow-lg"
                >
                  Holy Ramzan 2026
                </motion.div>
                <motion.div 
                  style={{ translateZ: 50, color: activeTheme.accent }}
                  className="arabic text-3xl md:text-5xl font-bold drop-shadow-[0_5px_15px_rgba(0,0,0,0.6)]" 
                >
                  رمضان مبارك
                </motion.div>
              </div>

              <div className="space-y-6 md:space-y-10 w-full">
                <div className="space-y-1 md:space-y-2">
                  <p className="text-[#9CA3AF] text-[10px] md:text-xs font-black uppercase tracking-[0.4em] drop-shadow-sm">A Special Dua For</p>
                  {/* HYPER AMAZING RECEIVER HIGHLIGHT */}
                  <motion.h3 
                    style={{ 
                      translateZ: 100,
                      fontFamily: 'Sora, sans-serif'
                    }}
                    className="text-3xl sm:text-4xl md:text-6xl font-black leading-none break-words px-2 bg-gradient-to-r from-yellow-100 via-yellow-300 to-yellow-100 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(253,224,71,0.6)]" 
                  >
                    You
                  </motion.h3>
                </div>
                
                <motion.div 
                  style={{ translateZ: 40 }}
                  className="relative px-2 md:px-8 py-2"
                >
                   {/* IMPROVED WISH FONT - Optimized for Decent Style & Readability */}
                   <p className="text-[#F9FAFB] text-xl sm:text-2xl md:text-3xl leading-relaxed drop-shadow-lg italic font-['Playfair_Display'] font-normal tracking-wide">
                    "{formData.wish || "May this Ramzan bring you peace, joy, and endless blessings..."}"
                   </p>
                </motion.div>

                {formData.includeBlessing && (
                  <motion.div 
                    key={formData.blessingIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ translateZ: 30 }}
                    className="pt-4 md:pt-8 border-t border-white/10 group/blessing"
                  >
                    <p className="text-[10px] md:text-xs text-[#FCD34D] font-black uppercase tracking-[0.5em] mb-3 drop-shadow-[0_0_15px_rgba(252,211,77,0.5)]">Blessings</p>
                    
                    {/* IMPROVED BLESSING FONT - Clean & Readable Serif */}
                    <p className="text-lg md:text-xl text-[#FEF3C7] leading-relaxed px-2 md:px-4 italic drop-shadow-md font-['Playfair_Display'] font-medium">
                      "{BLESSINGS[formData.blessingIndex || 0]}"
                    </p>
                  </motion.div>
                )}
              </div>

              <motion.div 
                style={{ translateZ: 60 }}
                className="mt-auto pt-4 md:pt-8 flex flex-col items-center"
              >
                <p className="text-[8px] md:text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1 drop-shadow-sm">With Pure Heart,</p>
                
                {/* SOLID GOLD CARD NAME STYLE - EXPERT FIX FOR DOWNLOAD & COMPATIBILITY */}
                <div className="relative group/name">
                    <p 
                       className="text-4xl md:text-6xl font-['Playfair_Display'] font-black italic tracking-wide text-[#FFD700] pb-2 relative z-10"
                       style={{ textShadow: '0 4px 10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.6)' }}
                    >
                        {formData.from || "Your Name"}
                    </p>
                    {/* Subtle underline glow */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-yellow-500 blur-[2px] opacity-70"></div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              className="absolute inset-0 -z-10 blur-[140px] pointer-events-none opacity-40"
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 6, repeat: Infinity }}
              style={{ background: activeTheme.glow }}
            />
          </motion.div>
        </div>
        <div className="mt-8 md:mt-14 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 text-gray-400 text-xs md:text-sm font-bold bg-white/5 px-6 md:px-8 py-3 md:py-4 rounded-full border border-white/10 shadow-lg backdrop-blur-xl">
            <Sparkles size={16} className="text-yellow-400 animate-pulse" />
            <span>Tilt device to experience 3D depth</span>
          </div>
        </div>
      </div>
      
      <style>{`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CardBuilder;
