
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { Share2, Download, Copy, Check, Sparkles, RefreshCw, Send, Heart, ChevronLeft, ChevronRight, Shuffle, PenTool, Wand2, Lock, Unlock } from 'lucide-react';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';
import { CardData, CardTheme, THEMES, compressData, normalize } from '../types';
import { Language } from '../translations';
import { NativeAdUnit, DisplayAdUnit } from './AdUnits';
import { cld } from '../utils/images';

interface Props {
  onThemeChange: (theme: CardTheme) => void;
  activeTheme: CardTheme;
  t: any;
  lang: Language;
  setLang: (l: Language) => void;
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

const CardBuilder: React.FC<Props> = ({ onThemeChange, activeTheme, t, lang, setLang, initialData }) => {
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
  
  // --- VIRALITY LOCK LOGIC ---
  const REQUIRED_SHARES = 3;
  const [shareCount, setShareCount] = useState(() => {
     if (typeof window !== 'undefined') {
         return parseInt(localStorage.getItem('noor_shares') || '0');
     }
     return 0;
  });
  const isDownloadUnlocked = shareCount >= REQUIRED_SHARES;

  const registerShareAction = () => {
     if (shareCount < REQUIRED_SHARES) {
         const newCount = shareCount + 1;
         setShareCount(newCount);
         localStorage.setItem('noor_shares', newCount.toString());
         if (newCount === REQUIRED_SHARES) {
             confetti({ particleCount: 150, spread: 70, origin: { y: 0.8 }, colors: ['#FFD700', '#FFA500', '#FFFFFF'] });
             if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
         }
     }
  };

  // --- PRE-FILL LOGIC ---
  useEffect(() => {
    if (initialData) {
        setFormData(initialData);
        const wIdx = t.wishes.findIndex((w: string) => normalize(w) === normalize(initialData.wish));
        if (wIdx !== -1) setWishIndex(wIdx);
        const restoredTheme = THEMES.find(th => th.id === initialData.themeId);
        if (restoredTheme && restoredTheme.id !== activeTheme.id) onThemeChange(restoredTheme);
    }
  }, [initialData]);

  useEffect(() => {
    if (!initialData) {
        setFormData(prev => ({ ...prev, wish: t.wishes[0] }));
        setWishIndex(0);
    }
  }, [lang]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // --- 3D PHYSICS ---
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
    setIsHovered(true);
  };
  
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = (touch.clientX - rect.left) / rect.width - 0.5;
    const y = (touch.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const nextWish = () => { const next = (wishIndex + 1) % t.wishes.length; setWishIndex(next); setFormData({ ...formData, wish: t.wishes[next] }); };
  const prevWish = () => { const prev = (wishIndex - 1 + t.wishes.length) % t.wishes.length; setWishIndex(prev); setFormData({ ...formData, wish: t.wishes[prev] }); };
  const shuffleWish = () => { const random = Math.floor(Math.random() * t.wishes.length); setWishIndex(random); setFormData({ ...formData, wish: t.wishes[random] }); };
  const nextBlessing = () => { const next = ((formData.blessingIndex || 0) + 1) % t.blessings.length; setFormData({ ...formData, blessingIndex: next }); };
  const prevBlessing = () => { const current = formData.blessingIndex || 0; const prev = (current - 1 + t.blessings.length) % t.blessings.length; setFormData({ ...formData, blessingIndex: prev }); };
  const shuffleBlessing = () => { const random = Math.floor(Math.random() * t.blessings.length); setFormData({ ...formData, blessingIndex: random }); };

  const generateLink = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const payload = { ...formData, to: "You", relationship: "Friend", themeId: activeTheme.id };
    
    // V6 Nano Compression: Pass current lang, wishes array, and blessings array
    const code = compressData(payload, lang, t.wishes, t.blessings);
    
    // Sanitize sender name (Spaces become underscores, others removed)
    const safeSender = formData.from.trim().replace(/[\s.]+/g, '_');
    
    const baseUrl = window.location.origin + window.location.pathname;
    
    // V6 Format: #Name.Code
    const shortUrl = `${baseUrl}#${safeSender}.${code}`;
    
    setShareUrl(shortUrl);
    setIsGenerating(false);
    setTimeout(() => { document.getElementById('share-controls')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 100);
  };

  const copyToClipboard = () => { 
      navigator.clipboard.writeText(shareUrl); 
      setCopied(true); 
      setTimeout(() => setCopied(false), 2000); 
      registerShareAction(); // Count as share
  };
  
  const handleNativeShare = async () => {
    registerShareAction(); // Count as share immediately on click
    const shareData = { title: 'Ramzan Mubarak 🌙', text: `A special 3D gift card from ${formData.from}. Open to reveal your blessing!`, url: shareUrl };
    if (navigator.share) { try { await navigator.share(shareData); } catch (err) { console.log("Share canceled"); } } else { copyToClipboard(); }
  };

  const downloadImage = async () => {
    if (!cardRef.current) return;
    const wasHovered = isHovered;
    mouseX.set(0); 
    mouseY.set(0);
    setIsHovered(false);
    
    await new Promise(resolve => setTimeout(resolve, 400));
    if (navigator.vibrate) navigator.vibrate(50);

    try {
        const canvas = await html2canvas(cardRef.current, { 
            backgroundColor: null, 
            scale: 3, 
            useCORS: true, 
            allowTaint: true,
            logging: false,
            onclone: (clonedDoc) => {
                const card = clonedDoc.querySelector('.group\\/card') as HTMLElement;
                if (card) {
                    card.style.transform = 'none';
                    card.style.boxShadow = 'none'; 
                    card.style.border = 'none'; 
                    const gradientMap: Record<string, string> = {
                        'crescent-dream': 'linear-gradient(135deg, #0a0515 0%, #1a0a3d 50%, #0d1f3f 100%)',
                        'lantern-glow': 'linear-gradient(135deg, #150a05 0%, #2d1b0d 50%, #3f1f0d 100%)',
                        'peaceful-garden': 'linear-gradient(135deg, #05150a 0%, #0a3d1a 50%, #0d3f1f 100%)',
                        'royal-purple': 'linear-gradient(135deg, #150515 0%, #3d0a3d 50%, #3f0d3f 100%)',
                    };
                    card.style.background = gradientMap[activeTheme.id] || `linear-gradient(135deg, ${activeTheme.primary}, ${activeTheme.secondary})`; 
                }
                const interferingSelectors = ['.floating-canon', '.floating-gift', '.floating-beads', '.floating-star'];
                interferingSelectors.forEach(selector => {
                    const el = clonedDoc.querySelector(selector) as HTMLElement;
                    if (el) el.style.display = 'none';
                });
                const lantern = clonedDoc.querySelector('.floating-lantern') as HTMLElement;
                if (lantern) {
                    lantern.style.top = '-10px';
                    lantern.style.right = '-10px';
                    lantern.style.transform = 'scale(1.0)'; 
                    lantern.style.opacity = '1';
                }
                const gradients = clonedDoc.querySelectorAll('.bg-clip-text');
                gradients.forEach((el: any) => {
                    el.style.webkitBackgroundClip = 'initial'; 
                    el.style.backgroundClip = 'initial';
                    el.style.backgroundImage = 'none';
                    el.style.color = '#FFD700';
                    el.style.textShadow = '0 2px 10px rgba(0,0,0,0.5)';
                });
                const greeting = clonedDoc.querySelector('.download-arabic-greeting') as HTMLElement;
                if (greeting) {
                    greeting.style.color = '#FFD700';
                    greeting.style.textShadow = '0 2px 15px rgba(0,0,0,0.5), 0 0 5px rgba(255,215,0,0.3)';
                    greeting.style.opacity = '1';
                }
                const youText = clonedDoc.querySelector('.download-target-you') as HTMLElement;
                if (youText) { 
                    youText.style.color = '#FCD34D'; 
                    youText.style.textShadow = '0 0 25px rgba(253, 224, 71, 0.6), 0 2px 4px rgba(0,0,0,0.8)';
                }
                const senderContainer = clonedDoc.querySelector('.download-sender-container') as HTMLElement;
                if (senderContainer) {
                    senderContainer.style.transform = 'translateY(-20px)';
                    senderContainer.style.position = 'relative';
                    senderContainer.style.zIndex = '50';
                }
                const watermark = clonedDoc.createElement('div');
                watermark.className = 'absolute bottom-2 left-0 w-full text-center pointer-events-none';
                watermark.innerHTML = `<span style="color: rgba(255,255,255,0.3); font-size: 9px; text-transform: uppercase; letter-spacing: 3px; font-weight: bold; font-family: sans-serif; text-shadow: 0 1px 2px rgba(0,0,0,0.8);">NoorCard • Ramzan 2026</span>`;
                card?.appendChild(watermark);
            }
        });

        const link = document.createElement('a'); 
        link.download = `NoorCard-${formData.from || 'Ramzan'}.png`; 
        link.href = canvas.toDataURL('image/png', 1.0); 
        link.click();

    } catch (err) { 
        console.error("Export failed", err); 
    }
  };

  const languages: { code: Language; label: string }[] = [ { code: 'en', label: 'English' }, { code: 'ru', label: 'Roman' }, { code: 'hi', label: 'हिंदी' }, { code: 'ur', label: 'اردو' }, { code: 'ar', label: 'العربية' } ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start relative">
      
      {/* --- DECORATIVE 3D FLOATING ASSETS (BACKGROUND) --- */}
      <motion.img 
         src={cld("https://res.cloudinary.com/dxw5mimqj/image/upload/v1770240014/Holy_Quran_mlxxbw.png", 300)} 
         className="absolute -top-10 -left-10 w-24 md:w-32 lg:w-40 z-10 hidden md:block pointer-events-none"
         animate={{ y: [0, 15, 0], rotate: [0, 5, 0] }}
         transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
         alt="Quran"
         loading="lazy"
      />
      <motion.img 
         src={cld("https://res.cloudinary.com/dxw5mimqj/image/upload/v1770240229/Date_Bowl_idoutb.png", 300)} 
         className="absolute -bottom-20 -left-10 w-28 md:w-36 lg:w-48 z-10 hidden md:block pointer-events-none"
         animate={{ y: [0, -10, 0] }}
         transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
         alt="Dates"
         loading="lazy"
      />
      
      <img src={cld("https://res.cloudinary.com/dxw5mimqj/image/upload/v1770240241/Allah_Calligraphy_f184t1.png", 300)} className="absolute top-0 right-1/4 w-32 opacity-10 pointer-events-none" loading="lazy" />
      <img src={cld("https://res.cloudinary.com/dxw5mimqj/image/upload/v1770240086/Muhammad_Calligraphy_i8a229.png", 300)} className="absolute bottom-1/4 left-10 w-32 opacity-10 pointer-events-none" loading="lazy" />

      <motion.img 
         src={cld("https://res.cloudinary.com/dxw5mimqj/image/upload/v1770240123/Kaaba_gay44v.png", 400)}
         className="absolute top-20 right-0 w-40 md:w-56 z-0 opacity-20 hidden lg:block pointer-events-none blur-[1px]"
         animate={{ y: [0, -5, 0] }}
         transition={{ duration: 8, repeat: Infinity }}
         alt="Kaaba"
      />
      
      <motion.img 
         src={cld("https://res.cloudinary.com/dxw5mimqj/image/upload/v1770239651/Ramadan_Drum_tnrvgo.png", 300)}
         className="absolute bottom-40 right-[-40px] w-28 md:w-36 opacity-60 hidden lg:block pointer-events-none"
         animate={{ rotate: [0, 10, -5, 0], y: [0, 10, 0] }}
         transition={{ duration: 6, repeat: Infinity }}
         alt="Drum"
      />

      <motion.img 
         src={cld("https://res.cloudinary.com/dxw5mimqj/image/upload/v1770239956/Ramadan_Alarm_fk7euc.png", 200)}
         className="absolute top-40 -left-16 w-24 z-0 opacity-50 hidden lg:block pointer-events-none"
         animate={{ rotate: [0, -10, 5, 0] }}
         transition={{ duration: 7, repeat: Infinity }}
         alt="Alarm"
      />

      <motion.img 
         src={cld("https://res.cloudinary.com/dxw5mimqj/image/upload/v1770239717/Ramadan_Drink_r2e8vp.png", 200)}
         className="absolute -bottom-16 left-28 w-20 md:w-28 z-10 hidden md:block pointer-events-none"
         animate={{ y: [0, -5, 0] }}
         transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
         alt="Drink"
         loading="lazy"
      />
      <motion.img 
         src={cld("https://res.cloudinary.com/dxw5mimqj/image/upload/v1770239958/Prayer_Mat_rplurv.png", 600)}
         className="absolute bottom-[-150px] -right-20 w-64 opacity-50 z-0 hidden lg:block rotate-12 filter blur-[1px] pointer-events-none"
         alt="Mat"
         loading="lazy"
      />
      <motion.img 
         src={cld("https://res.cloudinary.com/dxw5mimqj/image/upload/v1770240086/Ketupat_ambppx.png", 200)}
         className="absolute -top-20 right-20 w-24 z-10 hidden md:block pointer-events-none"
         animate={{ rotate: [0, 5, -5, 0], y: [0, 10, 0] }}
         transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
         alt="Ketupat"
         loading="lazy"
      />

       <motion.img 
         src={cld("https://res.cloudinary.com/dxw5mimqj/image/upload/v1770239914/Prayer_Beads_csdzwt.png", 200)} 
         className="absolute top-1/2 -right-10 w-20 md:w-28 opacity-60 z-0 hidden lg:block pointer-events-none"
         animate={{ rotate: [0, 10, 0] }}
         transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
         alt="Beads"
         loading="lazy"
      />

      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="glass p-6 md:p-10 rounded-[2.5rem] space-y-8 border-white/10 shadow-2xl relative z-20"
      >
        {/* IN-BUILDER LANGUAGE SWITCHER */}
        <div className="flex justify-center mb-8">
            <div className="glass rounded-full p-1.5 flex items-center gap-1 overflow-x-auto max-w-full border border-white/10 bg-black/20 shadow-inner">
                {languages.map((l) => (
                    <button key={l.code} onClick={() => setLang(l.code)} className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 relative overflow-hidden whitespace-nowrap ${lang === l.code ? 'text-black shadow-[0_0_15px_rgba(255,209,102,0.4)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        {lang === l.code && <motion.div layoutId="activeLangBuilder" className="absolute inset-0 bg-yellow-400 z-0"/>}
                        <span className="relative z-10">{l.label}</span>
                    </button>
                ))}
            </div>
        </div>

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
                       <input type="text" placeholder={t.builder.inputs.fromPlaceholder} className={`w-full bg-transparent text-center text-3xl md:text-5xl font-['Playfair_Display'] font-black text-white placeholder:text-white/20 focus:outline-none py-2 ${lang === 'hi' ? 'font-hindi' : ''}`} value={formData.from} onChange={(e) => setFormData({...formData, from: e.target.value})} />
                       <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10"></div>
                       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-yellow-400 group-focus-within:w-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(253,224,71,0.8)]"></div>
                   </div>
                   <p className="text-[10px] text-gray-500 italic">{t.builder.inputs.fromHelp}</p>
               </div>
          </div>

          {/* WISH INPUT - NON-EDITABLE */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">{t.builder.inputs.wishLabel}</label>
            <div className="relative">
                <textarea readOnly rows={4} placeholder={t.builder.inputs.wishPlaceholder} className={`w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 resize-none mb-2 text-lg cursor-default outline-none text-white/90 shadow-inner ${lang === 'ur' ? 'font-urdu' : lang === 'hi' ? 'font-hindi' : 'font-serif'}`} maxLength={150} value={formData.wish} />
                <div className="absolute top-4 right-4 text-yellow-400/20 pointer-events-none"><Sparkles size={20} /></div>
            </div>
            
            <div className="flex items-center justify-between gap-3 mt-2">
                 <button onClick={prevWish} className="p-3 bg-white/5 hover:bg-white/10 hover:border-yellow-400/30 rounded-xl transition-all border border-white/10 group active:scale-95"><ChevronLeft size={20} className="text-gray-400 group-hover:text-yellow-400 transition-colors" /></button>
                 <button onClick={shuffleWish} className="flex-1 py-3 bg-white/5 hover:bg-white/10 hover:border-yellow-400/30 rounded-xl transition-all border border-white/10 flex items-center justify-center gap-2 group active:scale-[0.98]">
                    <Shuffle size={16} className="text-yellow-400 group-hover:rotate-180 transition-transform duration-500" />
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-300 group-hover:text-white">{t.builder.inputs.browse || "Shuffle"}</span>
                 </button>
                 <button onClick={nextWish} className="p-3 bg-white/5 hover:bg-white/10 hover:border-yellow-400/30 rounded-xl transition-all border border-white/10 group active:scale-95"><ChevronRight size={20} className="text-gray-400 group-hover:text-yellow-400 transition-colors" /></button>
            </div>
          </div>
        </div>

        {/* THEMES */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-1">{t.builder.inputs.themeLabel}</label>
          <div className="grid grid-cols-4 gap-3">
            {THEMES.map((theme) => (
              <button key={theme.id} onClick={() => onThemeChange(theme)} className={`group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${activeTheme.id === theme.id ? 'border-yellow-400 scale-105 md:scale-110 shadow-[0_0_20px_rgba(255,209,102,0.3)]' : 'border-white/10 opacity-60 hover:opacity-100'}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`}></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40"><span className="text-[8px] font-bold uppercase tracking-tighter">{theme.name}</span></div>
              </button>
            ))}
          </div>
        </div>

        {/* BLESSINGS */}
        <div className="space-y-4 pt-4 border-t border-white/5">
          <div className="flex flex-col gap-4 glass p-6 rounded-3xl border-white/10 bg-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-400/20 rounded-xl"><Heart className="text-yellow-400" size={20} /></div>
                <div className="flex flex-col"><span className="text-xs md:text-sm font-black uppercase tracking-widest">{t.builder.inputs.blessingTitle}</span><span className="text-[10px] text-gray-500">{t.builder.inputs.blessingDesc}</span></div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={formData.includeBlessing} onChange={(e) => setFormData({...formData, includeBlessing: e.target.checked})} />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
              </label>
            </div>

            {formData.includeBlessing && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-4 border-t border-white/5">
                <div className="relative group cursor-pointer overflow-hidden p-4 rounded-xl bg-black/20 border border-white/5 hover:border-yellow-400/30 transition-all">
                  <p className={`text-lg text-[#F9FAFB] italic leading-relaxed text-center ${lang === 'ur' ? 'font-urdu' : lang === 'hi' ? 'font-hindi' : 'font-serif'}`}>"{t.blessings[formData.blessingIndex || 0]}"</p>
                  <div className="mt-4 flex items-center justify-center gap-3">
                     <button onClick={prevBlessing} className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"><ChevronLeft size={14} className="text-yellow-400" /></button>
                     <button onClick={shuffleBlessing} className="flex items-center gap-2 text-[10px] text-yellow-400/60 font-bold uppercase tracking-[0.2em] px-3 py-1.5 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"><RefreshCw size={10} /> {t.builder.inputs.findBlessing}</button>
                     <button onClick={nextBlessing} className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"><ChevronRight size={14} className="text-yellow-400" /></button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
        
        <NativeAdUnit />

        <div className="relative">
            {/* Gift Box Decoration */}
            <motion.img 
                src={cld("https://res.cloudinary.com/dxw5mimqj/image/upload/v1770239653/Ramadan_Gift_wwyhcs.png", 200)}
                className="absolute -top-12 -right-8 w-16 md:w-20 z-30 pointer-events-none"
                animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
            />
            
            <button 
              onClick={generateLink}
              disabled={!formData.from || isGenerating}
              className="w-full py-5 bg-yellow-400 text-black font-black rounded-2xl shadow-[0_10px_30px_rgba(255,209,102,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg uppercase tracking-widest relative overflow-hidden"
            >
              {isGenerating ? <RefreshCw className="animate-spin" size={24} /> : <><Share2 size={24} />{t.builder.action.generate}</>}
              <motion.div className="absolute inset-0 bg-white/20 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
            </button>
        </div>

        <AnimatePresence>
          {shareUrl && (
            <motion.div id="share-controls" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pt-8 border-t border-white/10">
              <div className="text-center">
                <h4 className="text-xl font-bold text-yellow-400 mb-2">{t.builder.action.ready}</h4>
                <p className="text-sm text-gray-400 italic">{t.builder.action.quote}</p>
              </div>
              <div className="p-5 bg-white/5 rounded-2xl flex items-center gap-4 border border-white/10 group focus-within:border-yellow-400/50 transition-all relative overflow-hidden">
                <input type="text" readOnly value={shareUrl} className="bg-transparent text-xs text-gray-400 flex-1 truncate outline-none font-mono z-10" />
                <button onClick={copyToClipboard} className="p-3 hover:bg-white/10 rounded-xl transition-all active:scale-90 z-10">{copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}</button>
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-green-500/10 to-transparent pointer-events-none" />
              </div>

              {/* ACTION GRID: SHARE & DOWNLOAD */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button onClick={handleNativeShare} className="relative py-4 px-6 bg-[#25D366] text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:brightness-110 shadow-lg transition-all active:scale-[0.98] group overflow-hidden">
                    <Send size={20} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" /> 
                    <span className="text-sm">{t.builder.action.whatsapp}</span>
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                </button>

                {isDownloadUnlocked ? (
                    <motion.button 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={downloadImage} 
                        className="py-4 px-6 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] transition-all border border-yellow-300/50 active:scale-[0.98]"
                    >
                        <Download size={20} /> 
                        <span className="text-sm">{t.builder.action.download}</span>
                        <Unlock size={16} className="opacity-50" />
                    </motion.button>
                ) : (
                    <button 
                        disabled 
                        className="relative py-4 px-6 bg-black/40 text-gray-500 font-bold rounded-2xl flex flex-col items-center justify-center gap-1 border border-white/5 cursor-not-allowed group"
                    >
                        <div className="flex items-center gap-2">
                             <Lock size={16} />
                             <span className="text-sm">Download Locked</span>
                        </div>
                        <div className="flex items-center gap-1">
                             <span className="text-[10px] text-yellow-500/80 uppercase tracking-widest">Share to Unlock: {shareCount}/{REQUIRED_SHARES}</span>
                             <div className="flex gap-1 ml-1">
                                {[...Array(REQUIRED_SHARES)].map((_, i) => (
                                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < shareCount ? 'bg-yellow-400' : 'bg-gray-700'}`}></div>
                                ))}
                             </div>
                        </div>
                    </button>
                )}
              </div>
              <DisplayAdUnit size="medium" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Advanced Preview Section */}
      <div className="lg:sticky lg:top-24 flex flex-col items-center z-10">
        <div className="animate-float w-full flex justify-center">
            <div id="card-preview" className="perspective-1000 w-full max-w-[420px]" onMouseMove={handleMouseMove} onTouchMove={handleTouchMove} onMouseLeave={handleMouseLeave} onTouchEnd={handleMouseLeave}>
              <motion.div ref={cardRef} style={{ rotateX, rotateY, boxShadow: dynamicShadow, transformStyle: "preserve-3d", scale: isHovered ? 1.05 : 1 }} transition={{ scale: { duration: 0.3 } }} className={`aspect-[3/4.6] rounded-[2rem] md:rounded-[3.5rem] p-5 md:p-8 relative overflow-hidden transform-gpu group/card bg-black/40 border border-white/10`}>
                <motion.div style={{ background: sheenGradient }} className="absolute inset-0 z-50 pointer-events-none mix-blend-overlay"/>
                <div className={`absolute inset-0 bg-gradient-to-br ${activeTheme.gradient} z-[-50]`}></div>
                <div className="download-noise-overlay absolute inset-0 opacity-20 z-[-40] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
                
                {/* --- MINIATURE 3D DECORATIONS ON CARD --- */}
                <motion.img 
                  src={cld("https://res.cloudinary.com/dxw5mimqj/image/upload/v1770239783/Ramadan_Lantern_xeufdp.png", 100)} 
                  className="card-floating-3d floating-lantern absolute -top-4 -right-4 w-16 z-50 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] pointer-events-none"
                  style={{ translateZ: 120 }}
                  animate={{ y: [0, 5, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                 <motion.img 
                  src={cld("https://res.cloudinary.com/dxw5mimqj/image/upload/v1770240236/Crescent_Moon_jmtxds.png", 100)} 
                  className="card-floating-3d absolute -top-2 -left-2 w-12 z-40 drop-shadow-[0_5px_15px_rgba(255,215,0,0.3)] pointer-events-none opacity-80"
                  style={{ translateZ: 80 }}
                />
                <motion.img 
                  src={cld("https://res.cloudinary.com/dxw5mimqj/image/upload/v1770240311/Date_s7yyme.png", 80)} 
                  className="card-floating-3d absolute bottom-8 -left-2 w-10 z-40 drop-shadow-md pointer-events-none blur-[0.5px]"
                  style={{ translateZ: 100 }}
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                />

                {/* NEW: Miniature Canon (Bottom Right) */}
                <motion.img 
                  src={cld("https://res.cloudinary.com/dxw5mimqj/image/upload/v1770239698/Ramadan_Canon_uddqjs.png", 150)} 
                  className="card-floating-3d floating-canon absolute bottom-20 -right-2 w-16 z-30 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] pointer-events-none"
                  style={{ translateZ: 60 }}
                  animate={{ rotate: [0, -5, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* NEW: Miniature Gift (Bottom Left) */}
                 <motion.img 
                  src={cld("https://res.cloudinary.com/dxw5mimqj/image/upload/v1770239653/Ramadan_Gift_wwyhcs.png", 150)} 
                  className="card-floating-3d floating-gift absolute bottom-28 -left-2 w-12 z-30 drop-shadow-[0_5px_15px_rgba(0,0,0,0.4)] pointer-events-none"
                  style={{ translateZ: 70 }}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />

                 {/* REPOSITIONED: Star Cluster (Top Right - Balanced with Lantern) */}
                 <motion.img 
                  src={cld("https://res.cloudinary.com/dxw5mimqj/image/upload/v1770239609/Star_ga6mwm.png", 100)} 
                  className="card-floating-3d floating-star absolute top-[18%] right-[12%] w-6 md:w-8 z-20 drop-shadow-[0_0_10px_rgba(255,215,0,0.6)] pointer-events-none"
                  style={{ translateZ: 50 }}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8], rotate: [0, 15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Extra Tiny Star for Aesthetics */}
                <motion.img 
                  src={cld("https://res.cloudinary.com/dxw5mimqj/image/upload/v1770239609/Star_ga6mwm.png", 50)} 
                  className="card-floating-3d floating-star absolute top-[23%] right-[8%] w-3 md:w-4 z-20 drop-shadow-[0_0_5px_rgba(255,215,0,0.8)] pointer-events-none"
                  style={{ translateZ: 40 }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />

                 <motion.img 
                  src={cld("https://res.cloudinary.com/dxw5mimqj/image/upload/v1770239914/Prayer_Beads_csdzwt.png", 100)} 
                  className="card-floating-3d floating-beads absolute -bottom-6 -right-6 w-24 opacity-60 z-10 pointer-events-none rotate-12"
                  style={{ translateZ: 40 }}
                />

                <motion.div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none"><CalligraphySVG color={activeTheme.accent} /></motion.div>
                <motion.div style={{ translateZ: 80 }} className="relative z-30 h-full flex flex-col justify-between items-center text-center transform-gpu">
                  <div className="space-y-4">
                    <motion.div style={{ translateZ: 20 }} className="inline-block px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-black/30 text-[9px] md:text-[10px] font-black text-yellow-400 tracking-[0.3em] uppercase border border-yellow-400/20 backdrop-blur-md shadow-lg">{t.builder.card.season}</motion.div>
                    <motion.div style={{ translateZ: 50, color: activeTheme.accent }} className="download-arabic-greeting arabic text-3xl md:text-5xl font-bold drop-shadow-[0_5px_15px_rgba(0,0,0,0.6)]">{t.builder.card.greeting}</motion.div>
                  </div>
                  <div className="space-y-4 md:space-y-6 w-full">
                    <div className="space-y-1 md:space-y-2"><p className="text-[#9CA3AF] text-[10px] md:text-xs font-black uppercase tracking-[0.4em] drop-shadow-sm">{t.builder.card.specialFor}</p><motion.h3 style={{ translateZ: 100, fontFamily: 'Sora, sans-serif' }} className="download-target-you text-3xl sm:text-4xl md:text-5xl font-black leading-none break-words px-2 bg-gradient-to-r from-yellow-100 via-yellow-300 to-yellow-100 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(253,224,71,0.6)]">{t.builder.card.you}</motion.h3></div>
                    <motion.div style={{ translateZ: 40 }} className="relative px-2 md:px-8 py-2"><p className={`text-[#F9FAFB] text-lg sm:text-xl md:text-2xl leading-relaxed drop-shadow-lg italic font-normal tracking-wide ${lang === 'ur' ? 'font-urdu' : lang === 'hi' ? 'font-hindi' : 'font-serif'}`}>"{formData.wish || "May this Ramzan bring you peace..."}"</p></motion.div>
                    {formData.includeBlessing && (
                      <motion.div key={formData.blessingIndex} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ translateZ: 30 }} className="pt-4 md:pt-6 border-t border-white/10 group/blessing">
                        <p className="text-[10px] md:text-xs text-[#FCD34D] font-black uppercase tracking-[0.5em] mb-2 drop-shadow-[0_0_15px_rgba(252,211,77,0.5)]">{t.builder.inputs.blessingTitle}</p>
                        <p className={`text-base md:text-lg text-[#FEF3C7] leading-relaxed px-2 md:px-4 italic drop-shadow-md font-medium ${lang === 'ur' ? 'font-urdu' : lang === 'hi' ? 'font-hindi' : 'font-serif'}`}>"{t.blessings[formData.blessingIndex || 0]}"</p>
                      </motion.div>
                    )}
                  </div>
                  <motion.div style={{ translateZ: 60 }} className="download-sender-container mt-auto pt-2 md:pt-4 flex flex-col items-center">
                    <p className="text-[8px] md:text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1 drop-shadow-sm">{t.builder.card.withLove}</p>
                    <div className="relative group/name">
                        <p className={`download-sender-name text-3xl md:text-5xl font-black italic tracking-wide text-[#FFD700] pb-1 relative z-10 ${lang === 'hi' ? 'font-hindi' : 'font-[Playfair_Display]'}`} style={{ textShadow: '0 4px 10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.6)' }}>{formData.from || "Your Name"}</p>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-yellow-500 blur-[2px] opacity-70"></div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
        </div>
        
        <div className="mt-8 md:mt-14 flex flex-col items-center gap-6">
          <div className="flex items-center gap-3 text-gray-400 text-xs md:text-sm font-bold bg-white/5 px-6 md:px-8 py-3 md:py-4 rounded-full border border-white/10 shadow-lg backdrop-blur-xl">
            <Sparkles size={16} className="text-yellow-400 animate-pulse" />
            <span>Tilt device to experience 3D depth</span>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { const builderSection = document.getElementById('builder'); if (builderSection) builderSection.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="group relative px-8 py-4 bg-yellow-400 text-black font-black rounded-full shadow-[0_0_30px_rgba(255,209,102,0.4)] flex items-center gap-3 uppercase tracking-widest text-sm hover:shadow-[0_0_50px_rgba(255,209,102,0.6)] transition-all overflow-hidden">
             <span className="relative z-10 flex items-center gap-2"><Wand2 size={18} />{t.hero?.cta || "Create Your Wish Card"}</span>
             <motion.div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
          </motion.button>
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
