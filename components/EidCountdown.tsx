
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '../translations';

const TARGET_DATE = new Date('2026-02-17T18:00:00').getTime();

interface Props {
    t: any;
    lang: Language;
}

const TimeUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center mx-1 md:mx-4 relative group">
    <div className="relative w-14 h-14 md:w-24 md:h-24 bg-black/40 rounded-2xl border border-yellow-400/20 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(255,209,102,0.1)] backdrop-blur-md group-hover:border-yellow-400/50 transition-colors duration-500">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: 20, opacity: 0, filter: "blur(5px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -20, opacity: 0, filter: "blur(5px)" }}
          className="text-xl md:text-4xl font-black bg-gradient-to-b from-white to-yellow-200 bg-clip-text text-transparent font-['Sora'] z-10"
        >
          {value < 10 ? `0${value}` : value}
        </motion.span>
      </AnimatePresence>
    </div>
    <span className="text-[9px] md:text-xs text-yellow-400/60 uppercase tracking-[0.2em] mt-2 font-bold">{label}</span>
  </div>
);

const PrepCard = ({ img, title, desc, delay }: { img: string, title: string, desc: string, delay: number }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="glass p-5 rounded-2xl border border-white/5 hover:border-yellow-400/30 transition-colors group relative overflow-hidden"
    >
        <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 flex-shrink-0">
                <img src={img} className="w-full h-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300" alt="icon" />
            </div>
            <div>
                <h4 className="font-bold text-white text-sm md:text-base mb-1">{title}</h4>
                <p className="text-xs md:text-sm text-gray-400 leading-relaxed">{desc}</p>
            </div>
        </div>
    </motion.div>
);

const EidCountdown: React.FC<Props> = ({ t, lang }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = TARGET_DATE - now;

      if (distance < 0) {
        clearInterval(interval);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-12 md:py-20 px-4 overflow-hidden border-b border-white/5 bg-black/20">
        
        {/* Decorative Assets */}
        <motion.img 
            src="https://res.cloudinary.com/dxw5mimqj/image/upload/v1770239956/Ramadan_Alarm_fk7euc.png"
            className="absolute top-10 left-[-20px] md:left-10 w-24 md:w-32 opacity-80 z-0"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.img 
            src="https://res.cloudinary.com/dxw5mimqj/image/upload/v1770239651/Ramadan_Drum_tnrvgo.png"
            className="absolute bottom-10 right-[-20px] md:right-10 w-28 md:w-40 opacity-80 z-0"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="max-w-5xl mx-auto relative z-10">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center gap-4 mb-10 text-center"
            >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-[10px] md:text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(255,209,102,0.1)]">
                    <img src="https://res.cloudinary.com/dxw5mimqj/image/upload/v1770239649/Ramadan_Calendar_mktnio.png" className="w-4 h-4" />
                    <span>{t.dates}</span>
                </div>
                
                <h3 className="text-2xl md:text-4xl text-white font-light tracking-wide uppercase font-['Sora']">
                   {t.label}
                </h3>
            </motion.div>

            <div className="flex flex-wrap justify-center items-center mb-16" dir="ltr">
                <TimeUnit value={timeLeft.days} label={t.days} />
                <span className="text-2xl text-yellow-400/30 font-light -mt-6">:</span>
                <TimeUnit value={timeLeft.hours} label={t.hours} />
                <span className="text-2xl text-yellow-400/30 font-light -mt-6 hidden md:block">:</span>
                <div className="basis-full h-4 md:hidden"></div>
                <TimeUnit value={timeLeft.minutes} label={t.mins} />
                <span className="text-2xl text-yellow-400/30 font-light -mt-6">:</span>
                <TimeUnit value={timeLeft.seconds} label={t.secs} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 relative z-10">
                <PrepCard delay={0.1} img="https://res.cloudinary.com/dxw5mimqj/image/upload/v1770240236/Crescent_Moon_jmtxds.png" title={t.cards[0].title} desc={t.cards[0].desc} />
                <PrepCard delay={0.2} img="https://res.cloudinary.com/dxw5mimqj/image/upload/v1770239642/Suhoor_Time_n2ng0o.png" title={t.cards[1].title} desc={t.cards[1].desc} />
                <PrepCard delay={0.3} img="https://res.cloudinary.com/dxw5mimqj/image/upload/v1770240072/Iftar_Time_uvtfv8.png" title={t.cards[2].title} desc={t.cards[2].desc} />
            </div>

             <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center text-xl md:text-2xl font-bold mt-12 mb-4 font-['Playfair_Display'] italic bg-gradient-to-tr from-white via-gray-100 to-gray-400 bg-clip-text text-transparent"
            >
                {t.dua}
            </motion.p>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-48 bg-yellow-400/5 blur-[120px] -z-10 pointer-events-none" />
    </section>
  );
};

export default EidCountdown;
