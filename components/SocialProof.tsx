
import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Ayesha K.",
    city: "Dubai",
    initials: "AK",
    quote: "I sent this to my sister. She cried. Now she's sending it to everyone in her Quran circle. 💚",
    shared: "128 times"
  },
  {
    name: "Omar F.",
    city: "London",
    initials: "OF",
    quote: "My niece opened this and immediately shared with 30+ people. The design is INSANE. 10/10",
    shared: "45 times"
  },
  {
    name: "Zainab R.",
    city: "New York",
    initials: "ZR",
    quote: "Finally a digital card that feels premium and spiritual. Simple yet powerful.",
    shared: "92 times"
  }
];

const SocialProof: React.FC = () => {
  return (
    <div className="py-20 overflow-hidden bg-black/10">
      <div className="max-w-6xl mx-auto px-4 mb-10 text-center">
          <p className="text-yellow-400 font-bold uppercase tracking-widest text-sm mb-2">Community Love</p>
          <h2 className="text-3xl font-bold">Trusted by thousands to share blessings</h2>
      </div>
      
      <div className="flex gap-6 px-4 animate-scroll whitespace-nowrap overflow-x-auto pb-8 snap-x no-scrollbar">
        {[...testimonials, ...testimonials].map((t, i) => (
          <div 
            key={i}
            className="glass p-6 rounded-2xl min-w-[320px] max-w-[320px] snap-center flex flex-col gap-4 border-white/5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm">
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.city}</p>
                </div>
              </div>
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, j) => <Star key={j} size={12} fill="currentColor" />)}
              </div>
            </div>
            <p className="text-sm text-gray-300 italic whitespace-normal leading-relaxed">
              "{t.quote}"
            </p>
            <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">Shared {t.shared}</span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialProof;
