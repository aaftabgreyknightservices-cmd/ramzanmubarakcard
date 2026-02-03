
import React from 'react';
import { motion } from 'framer-motion';
import { PenTool, Palette, Share2, Heart } from 'lucide-react';

const steps = [
  {
    title: "Enter Names & Wish",
    desc: "Tell us who this card is for and your personal heartfelt message.",
    icon: <PenTool className="text-yellow-400" />,
    color: "from-yellow-400/20 to-transparent"
  },
  {
    title: "Choose a Theme",
    desc: "Pick your favorite spiritual vibe. Every theme is crafted to touch the soul.",
    icon: <Palette className="text-cyan-400" />,
    color: "from-cyan-400/20 to-transparent"
  },
  {
    title: "Generate Magic Link",
    desc: "Get a custom link that delivers your card with cinematic animations.",
    icon: <Share2 className="text-pink-400" />,
    color: "from-pink-400/20 to-transparent"
  },
  {
    title: "Watch Them Smile",
    desc: "They receive the blessing, feel the love, and can reshare the goodness instantly.",
    icon: <Heart className="text-red-400" />,
    color: "from-red-400/20 to-transparent"
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-black/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works ✨</h2>
          <p className="text-gray-400 max-w-2xl mx-auto italic">
            "Every act of goodness is charity." — Spreading joy in Ramzan is easier than ever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass p-8 rounded-3xl relative overflow-hidden group hover:scale-105 transition-transform"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${step.color} blur-2xl -z-10`}></div>
              <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              
              <div className="absolute top-4 right-4 text-4xl font-bold text-white/5 pointer-events-none">
                0{i + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
