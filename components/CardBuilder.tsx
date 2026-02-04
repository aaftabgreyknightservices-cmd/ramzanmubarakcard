
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { Share2, Download, Copy, Check, Sparkles, RefreshCw, Send, Moon, Heart, ChevronLeft, ChevronRight, Shuffle, PenTool, Link as LinkIcon, Wand2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { CardData, CardTheme, THEMES, compressData, normalize } from '../types';
import { Language } from '../translations';
import { NativeAdUnit, DisplayAdUnit } from './AdUnits';

interface Props {
  onThemeChange: (theme: CardTheme) => void;
  activeTheme: CardTheme;
  t: any;
  lang: Language;
  initialData?: CardData | null;
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

const CardBuilder: React.FC<Props> = ({ onThemeChange, activeTheme, t, lang, initialData }) => {
  const [formData, setFormData] = useState<CardData>({
    from: '',
    to: 'You', 
    relationship: 'Friend', 
    wish: t.wishes[0],
    themeId: THEMES[0].id,
    includeBlessing: true,
    addSurprise: false,
    blessingIndex: 0
  });

  const [wishIndex, setWishIndex] = useState(0);
  
  // --- PRE-FILL LOGIC: Handle Shared Link Data ---
  useEffect(() => {
    if (initialData) {
        setFormData(initialData);
        
        // Sync Wish Carousel Index
        // This ensures the "Next/Prev" buttons start from the correct position
        const wIdx = t.wishes.findIndex((w: string) => normalize(w) === normalize(initialData.wish));
        if (wIdx !== -1) {
            setWishIndex(wIdx);
        }
        
        // Sync Theme in Parent Layout
        const restoredTheme = THEMES.find(th => th.id === initialData.themeId);
        if (restoredTheme && restoredTheme.id !== activeTheme.id) {
            onThemeChange(restoredTheme);
        }
    }
  }, [initialData]);

  // Update default wish when language changes (only if not editing a shared card)
  useEffect(() => {
    if (!initialData) {
        setFormData(prev => ({
            ...prev,
            wish: t.wishes[0]
        }));
    }
  }, [lang]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // --- ADVANCED 3D PHYSICS ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 300, damping: 30, mass: 0.8 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [20, -20]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-20, 20]);
  
  const shadowX = useTransform(smoothX, [-0.5, 0.5], [-30, 30]);
  const shadowY = useTransform(smoothY, [-0.5, 0.5], [-30, 30]);
  const shadowOpacity = useTransform(smoothY, [-0.5, 0.5], [0.4, 0.8]);
  const dynamicShadow = useMotionTemplate`${shadowX}px ${shadowY}px 60px rgba(0,0,0,${shadowOpacity})`;

  const glareX = useTransform(smoothX, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(smoothY, [-0.5, 0.5], [0, 100]);
  const sheenGradient = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.4) 0%, transparent 60%)`;

  const handleMove = (x: number, y: number) => {
      mouseX.set(x);
      mouseY.set(y);
      setIsHovered(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    handleMove(x, y);
  };
  
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = (touch.clientX - rect.left) / rect.width - 0.5;
    const y = (touch.clientY - rect.top) / rect.height - 0.5;
    handleMove(x, y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const nextWish = () => {
    const next = (wishIndex + 1) % t.wishes.length;
    setWishIndex(next);
    setFormData({ ...formData, wish: t.wishes[next] });
  };

  const prevWish = () => {
    const prev = (wishIndex - 1 + t.wishes.length) % t.wishes.length;
    setWishIndex(prev);
    setFormData({ ...formData, wish: t.wishes[prev] });
  };

  const shuffleWish = () => {
    const random = Math.floor(Math.random() * t.wishes.length);
    setWishIndex(random);
    setFormData({ ...formData, wish: t.wishes[random] });
  };

  const nextBlessing = () => {
    const next = ((formData.blessingIndex || 0) + 1) % t.blessings.length;
    setFormData({ ...formData, blessingIndex: next });
  };

  const prevBlessing = () => {
    const current = formData.blessingIndex || 0;
    const prev = (current - 1 + t.blessings.length) % t.blessings.length;
    setFormData({ ...formData, blessingIndex: prev });
  };
  
  const shuffleBlessing = () => {
    const random = Math.floor(Math.random() * t.blessings.length);
    setFormData({ ...formData, blessingIndex: random });
  };

  const generateLink = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const payload = { ...formData, to: "You", relationship: "Friend", themeId: activeTheme.id };
    
    // V5 GENERATION: Compress to matrix code
    const code = compressData(payload);
    
    // Sanitize sender name for URL
    const safeSender = formData.from.trim().replace(/[\s.]+/g, '_');
    
    const baseUrl = window.location.origin + window.location.pathname;
    const shortUrl = `${baseUrl}#${safeSender}.${code}`;
    
    setShareUrl(shortUrl);
    setIsGenerating(false);

    setTimeout(() => {
        const shareEl = document.getElementById('share-controls');
        shareEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    const shareData = {
        title: 'Ramzan Mubarak 🌙',
        text: `A special 3D gift card from ${formData.from}. Open to reveal your blessing!`,
        url: shareUrl
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (err) {
            console.log("Share canceled");
        }
    } else {
        copyToClipboard();
    }
  };

  const downloadImage = async () => {
    if (!cardRef.current) return;
    mouseX.set(0);
    mouseY.set(0);

    setTimeout(async () => {
      try {
        const canvas = await html2canvas(cardRef.current!, {
          backgroundColor: null,
          scale: 4,
          logging: false,
          useCORS: true,
          allowTaint: true,
          onclone: (clonedDoc) => {
            const youText = clonedDoc.querySelector('.download-target-you') as HTMLElement;
            if (youText) {
                youText.style.backgroundImage = 'none';
                youText.style.webkitBackgroundClip = 'initial';
                youText.style.backgroundClip = 'initial';
                youText.style.webkitTextFillColor = 'initial';
                youText.classList.remove('text-transparent', 'bg-clip-text', 'bg-gradient-to-r');
                youText.style.color = '#FFD700'; 
                youText.style.textShadow = '0 2px 10px rgba(255, 215, 0, 0.5)';
            }
            const noiseLayer = clonedDoc.querySelector('.download-noise-overlay') as HTMLElement;
            if (noiseLayer) {
                noiseLayer.style.backgroundImage = 'none';
                noiseLayer.style.background = 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 80%)';
            }
            const senderName = clonedDoc.querySelector('.download-sender-name') as HTMLElement;
            if (senderName) {
                senderName.style.textShadow = '0 2px 15px rgba(0,0,0,0.8)';
            }
          }
        });

        const link = document.createElement('a');
        link.download = `NoorCard-${formData.from || 'Ramzan'}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
      } catch (err) {
        console.error("Export failed", err);
      }
    }, 100);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="glass p-6 md:p-10 rounded-[2.5rem] space-y-8 border-white/10 shadow-2xl"
      >
        <div className="space-y-10">
          {/* SENDER INPUT */}
          <div className="relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 via-yellow-200/20 to-yellow-500/20 rounded-3xl blur opacity-30 group-focus-within:opacity-100 transition-opacity duration-700"></div>
               <div className="relative bg-black/40 border border-yellow-400/30 rounded-3xl p-6 md:p-8 flex flex-col items-center gap-4 shadow-[inset_0_2px_15px_rgba(0,0,0,0.5)]">
                   <div className="flex items-center gap-2 text-yellow-400/80 mb-2">
                       <PenTool size={16} className="animate-bounce" />
                       <span className="text-[10px] uppercase font-black tracking-[0.3em]">{t.builder.inputs.fromLabel}</span>
                   </div>
                   <div className="relative w-full">
                       <input 
                         type="text"
                         placeholder={t.builder.inputs.fromPlaceholder}
                         className={`w-full bg-transparent text-center text-3xl md:text-5xl font-['Playfair_Display'] font-black text-white placeholder:text-white/20 focus:outline-none py-2 ${lang === 'hi' ? 'font-hindi' : ''}`}
                         value={formData.from}
                         onChange={(e) => setFormData({...formData, from: e.target.value})}
                       />
                       <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10"></div>
                       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-yellow-400 group-focus-within:w-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(253,224,71,0.8)]"></div>
                   </div>
                   <p className="text-[10px] text-gray-500 italic">{t.builder.inputs.fromHelp}</p>
               </div>
          </div>

          {/* WISH INPUT */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">
                {t.builder.inputs.wishLabel}
            </label>
            <textarea 
              rows={4}
              placeholder={t.builder.inputs.wishPlaceholder}
              className={`w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-yellow-400 focus:bg-white/10 transition-all resize-none placeholder:text-gray-600 mb-2 text-lg ${lang === 'ur' ? 'font-urdu' : lang === 'hi' ? 'font-hindi' : 'font-serif'}`}
              maxLength={150}
              value={formData.wish}
              onChange={(e) => setFormData({...formData, wish: e.target.value})}
            />
            
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <button onClick={prevWish} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10"><ChevronLeft size={16} /></button>
                    <button onClick={shuffleWish} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10"><Shuffle size={16} /></button>
                    <button onClick={nextWish} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10"><ChevronRight size={16} /></button>
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider ml-1">{t.builder.inputs.browse}</span>
                </div>
            </div>
          </div>
        </div>

        {/* THEMES */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-1">{t.builder.inputs.themeLabel}</label>
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

        {/* BLESSINGS */}
        <div className="space-y-4 pt-4 border-t border-white/5">
          <div className="flex flex-col gap-4 glass p-6 rounded-3xl border-white/10 bg-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-400/20 rounded-xl">
                  <Heart className="text-yellow-400" size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs md:text-sm font-black uppercase tracking-widest">{t.builder.inputs.blessingTitle}</span>
                  <span className="text-[10px] text-gray-500">{t.builder.inputs.blessingDesc}</span>
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
                  <p className={`text-lg text-[#F9FAFB] italic leading-relaxed text-center ${lang === 'ur' ? 'font-urdu' : lang === 'hi' ? 'font-hindi' : 'font-serif'}`}>
                    "{t.blessings[formData.blessingIndex || 0]}"
                  </p>
                  
                  <div className="mt-4 flex items-center justify-center gap-3">
                     <button onClick={prevBlessing} className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"><ChevronLeft size={14} className="text-yellow-400" /></button>
                     <button onClick={shuffleBlessing} className="flex items-center gap-2 text-[10px] text-yellow-400/60 font-bold uppercase tracking-[0.2em] px-3 py-1.5 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                        <RefreshCw size={10} /> {t.builder.inputs.findBlessing}
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
              {t.builder.action.generate}
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
                <h4 className="text-xl font-bold text-yellow-400 mb-2">{t.builder.action.ready}</h4>
                <p className="text-sm text-gray-400 italic">{t.builder.action.quote}</p>
              </div>

              <div className="p-5 bg-white/5 rounded-2xl flex items-center gap-4 border border-white/10 group focus-within:border-yellow-400/50 transition-all relative overflow-hidden">
                <input type="text" readOnly value={shareUrl} className="bg-transparent text-xs text-gray-400 flex-1 truncate outline-none font-mono z-10" />
                <button onClick={copyToClipboard} className="p-3 hover:bg-white/10 rounded-xl transition-all active:scale-90 z-10">
                  {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
                </button>
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-green-500/10 to-transparent pointer-events-none" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button onClick={handleNativeShare} className="py-4 px-6 bg-[#25D366] text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:brightness-110 shadow-lg transition-all">
                  <Send size={20} /> <span className="text-sm">{t.builder.action.whatsapp}</span>
                </button>
                <button onClick={downloadImage} className="py-4 px-6 bg-white/10 text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-white/20 transition-all border border-white/10">
                  <Download size={20} /> <span className="text-sm">{t.builder.action.download}</span>
                </button>
              </div>
              <DisplayAdUnit size="medium" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Advanced Preview Section */}
      <div className="lg:sticky lg:top-24 flex flex-col items-center">
        {/* FLOAT ANIMATION CONTAINER */}
        <div className="animate-float w-full flex justify-center">
            <div 
                id="card-preview"
                className="perspective-1000 w-full max-w-[420px]" 
                onMouseMove={handleMouseMove} 
                onTouchMove={handleTouchMove}
                onMouseLeave={handleMouseLeave}
                onTouchEnd={handleMouseLeave}
            >
              <motion.div
                ref={cardRef}
                style={{ 
                    rotateX, 
                    rotateY, 
                    boxShadow: dynamicShadow,
                    transformStyle: "preserve-3d",
                    scale: isHovered ? 1.05 : 1
                }}
                transition={{ scale: { duration: 0.3 } }}
                className={`aspect-[3/4.6] rounded-[2rem] md:rounded-[3.5rem] p-5 md:p-8 relative overflow-hidden transform-gpu group/card bg-black/40 border border-white/10`}
              >
                {/* HOLOGRAPHIC GLARE */}
                <motion.div 
                    style={{ background: sheenGradient }}
                    className="absolute inset-0 z-50 pointer-events-none mix-blend-overlay"
                />

                <div className={`absolute inset-0 bg-gradient-to-br ${activeTheme.gradient} z-[-50]`}></div>
                
                {/* 
                  Target class 'download-noise-overlay' added for onclone manipulation.
                */}
                <div className="download-noise-overlay absolute inset-0 opacity-20 z-[-40] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
                
                <motion.div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
                  <CalligraphySVG color={activeTheme.accent} />
                </motion.div>

                <motion.div style={{ translateZ: 80 }} className="relative z-30 h-full flex flex-col justify-between items-center text-center transform-gpu">
                  <div className="space-y-4">
                    <motion.div style={{ translateZ: 20 }} className="inline-block px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-black/30 text-[9px] md:text-[10px] font-black text-yellow-400 tracking-[0.3em] uppercase border border-yellow-400/20 backdrop-blur-md shadow-lg">
                      {t.builder.card.season}
                    </motion.div>
                    <motion.div style={{ translateZ: 50, color: activeTheme.accent }} className="arabic text-3xl md:text-5xl font-bold drop-shadow-[0_5px_15px_rgba(0,0,0,0.6)]">
                      {t.builder.card.greeting}
                    </motion.div>
                  </div>

                  <div className="space-y-4 md:space-y-6 w-full">
                    <div className="space-y-1 md:space-y-2">
                      <p className="text-[#9CA3AF] text-[10px] md:text-xs font-black uppercase tracking-[0.4em] drop-shadow-sm">{t.builder.card.specialFor}</p>
                      
                      <motion.h3 style={{ translateZ: 100, fontFamily: 'Sora, sans-serif' }} className="download-target-you text-3xl sm:text-4xl md:text-5xl font-black leading-none break-words px-2 bg-gradient-to-r from-yellow-100 via-yellow-300 to-yellow-100 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(253,224,71,0.6)]">
                        {t.builder.card.you}
                      </motion.h3>
                    </div>
                    
                    <motion.div style={{ translateZ: 40 }} className="relative px-2 md:px-8 py-2">
                       <p className={`text-[#F9FAFB] text-lg sm:text-xl md:text-2xl leading-relaxed drop-shadow-lg italic font-normal tracking-wide ${lang === 'ur' ? 'font-urdu' : lang === 'hi' ? 'font-hindi' : 'font-serif'}`}>
                        "{formData.wish || "May this Ramzan bring you peace..."}"
                       </p>
                    </motion.div>

                    {formData.includeBlessing && (
                      <motion.div key={formData.blessingIndex} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ translateZ: 30 }} className="pt-4 md:pt-6 border-t border-white/10 group/blessing">
                        <p className="text-[10px] md:text-xs text-[#FCD34D] font-black uppercase tracking-[0.5em] mb-2 drop-shadow-[0_0_15px_rgba(252,211,77,0.5)]">{t.builder.inputs.blessingTitle}</p>
                        <p className={`text-base md:text-lg text-[#FEF3C7] leading-relaxed px-2 md:px-4 italic drop-shadow-md font-medium ${lang === 'ur' ? 'font-urdu' : lang === 'hi' ? 'font-hindi' : 'font-serif'}`}>
                          "{t.blessings[formData.blessingIndex || 0]}"
                        </p>
                      </motion.div>
                    )}
                  </div>

                  <motion.div style={{ translateZ: 60 }} className="mt-auto pt-2 md:pt-4 flex flex-col items-center">
                    <p className="text-[8px] md:text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1 drop-shadow-sm">{t.builder.card.withLove}</p>
                    <div className="relative group/name">
                        <p className={`download-sender-name text-3xl md:text-5xl font-black italic tracking-wide text-[#FFD700] pb-1 relative z-10 ${lang === 'hi' ? 'font-hindi' : 'font-[Playfair_Display]'}`} style={{ textShadow: '0 4px 10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.6)' }}>
                            {formData.from || "Your Name"}
                        </p>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-yellow-500 blur-[2px] opacity-70"></div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
        </div>
        <div className="mt-8 md:mt-14 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 text-gray-400 text-xs md:text-sm font-bold bg-white/5 px-6 md:px-8 py-3 md:py-4 rounded-full border border-white/10 shadow-lg backdrop-blur-xl">
            <Sparkles size={16} className="text-yellow-400 animate-pulse" />
            <span>Tilt device to experience 3D depth</span>
          </div>
        </div>
      </div>
      <style>{`
        .font-urdu { font-family: 'Noto Nastaliq Urdu', serif; line-height: 1.8; }
        .font-hindi { font-family: 'Noto Sans Devanagari', sans-serif; }
        .font-serif { font-family: 'Playfair Display', serif; }
      `}</style>
    </div>
  );
};

export default CardBuilder;
