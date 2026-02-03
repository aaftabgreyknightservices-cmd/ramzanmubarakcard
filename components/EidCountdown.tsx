
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar, Moon, BookOpen, Sparkles, Flame, Info } from 'lucide-react';

// Target: Start of Ramzan 2026 (Evening of Feb 17)
// We target 6:00 PM (Maghrib approx) on Feb 17, 2026
const TARGET_DATE = new Date('2026-02-17T18:00:00').getTime();

const TimeUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center mx-1 md:mx-4 relative group">
    <div className="relative w-14 h-14 md:w-24 md:h-24 bg-black/40 rounded-2xl border border-yellow-400/20 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(255,209,102,0.1)] backdrop-blur-md group-hover:border-yellow-400/50 transition-colors duration-500">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Animated Number */}
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: 20, opacity: 0, filter: "blur(5px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -20, opacity: 0, filter: "blur(5px)" }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          className="text-xl md:text-4xl font-black bg-gradient-to-b from-white to-yellow-200 bg-clip-text text-transparent font-['Sora'] z-10"
        >
          {value < 10 ? `0${value}` : value}
        </motion.span>
      </AnimatePresence>

      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-yellow-400/40 rounded-tl-lg" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-yellow-400/40 rounded-br-lg" />
    </div>
    <span className="text-[9px] md:text-xs text-yellow-400/60 uppercase tracking-[0.2em] mt-2 font-bold">{label}</span>
  </div>
);

const PrepCard = ({ icon, title, desc, delay }: { icon: React.ReactNode, title: string, desc: string, delay: number }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="glass p-5 rounded-2xl border border-white/5 hover:border-yellow-400/30 transition-colors group"
    >
        <div className="flex items-start gap-4">
            <div className="p-3 bg-yellow-400/10 rounded-xl text-yellow-400 group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <div>
                <h4 className="font-bold text-white text-sm md:text-base mb-1">{title}</h4>
                <p className="text-xs md:text-sm text-gray-400 leading-relaxed">{desc}</p>
            </div>
        </div>
    </motion.div>
);

const EidCountdown: React.FC = () => {
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
    <section className="relative py-12 md:py-20 px-4 overflow-hidden border-b border-white/5">
        <div className="max-w-5xl mx-auto">
            {/* Visual Header */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center gap-4 mb-10 text-center"
            >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-[10px] md:text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(255,209,102,0.1)]">
                    <Calendar size={12} />
                    <span>India · Dates may vary</span>
                </div>
                
                <h3 className="text-2xl md:text-4xl text-white font-light tracking-wide uppercase font-['Sora']">
                    The Sacred <span className="font-bold text-yellow-400 drop-shadow-[0_0_15px_rgba(255,209,102,0.5)]">Month</span> Approaches
                </h3>

                <p className="text-gray-300 font-medium text-sm md:text-lg max-w-xl">
                    Evening of <span className="text-white font-bold">Tue, 17 Feb</span> – <span className="text-white font-bold">Thu, 19 Mar, 2026</span>
                </p>
            </motion.div>

            {/* The Timewatch */}
            <div className="flex flex-wrap justify-center items-center mb-16">
                <TimeUnit value={timeLeft.days} label="Days" />
                <span className="text-2xl text-yellow-400/30 font-light -mt-6">:</span>
                <TimeUnit value={timeLeft.hours} label="Hours" />
                <span className="text-2xl text-yellow-400/30 font-light -mt-6 hidden md:block">:</span>
                <div className="basis-full h-4 md:hidden"></div> {/* Break on mobile */}
                <TimeUnit value={timeLeft.minutes} label="Mins" />
                <span className="text-2xl text-yellow-400/30 font-light -mt-6">:</span>
                <TimeUnit value={timeLeft.seconds} label="Secs" />
            </div>

            {/* Spiritual Prep Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 relative z-10">
                <PrepCard 
                    delay={0.1}
                    icon={<Moon size={24} />}
                    title="The Warm-Up"
                    desc="We are approaching Sha’ban. This is the warm-up month before the marathon of Ramzan. Don’t neglect it!"
                />
                <PrepCard 
                    delay={0.2}
                    icon={<Flame size={24} />}
                    title="Build Habits Now"
                    desc="Start fasting voluntarily, waking for Tahajjud, and setting your Quran goals today. Consistency starts early."
                />
                <PrepCard 
                    delay={0.3}
                    icon={<Info size={24} />}
                    title="Quick Takeaway"
                    desc="Ramzan 2026 is expected Feb 17 – Mar 19. Dates subject to local moon sighting. Prepare your heart now."
                />
            </div>

             <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center text-xl md:text-2xl font-bold mt-12 mb-4 font-['Playfair_Display'] italic bg-gradient-to-tr from-white via-gray-100 to-gray-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]"
            >
                "O Allah, let us reach Ramzan." (Allahumma ballighna Ramadan)
            </motion.p>
        </div>
        
        {/* Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-48 bg-yellow-400/5 blur-[120px] -z-10 pointer-events-none" />
    </section>
  );
};

export default EidCountdown;
