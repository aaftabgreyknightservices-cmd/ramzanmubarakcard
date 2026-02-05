
import React from 'react';
import { cld } from '../utils/images';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-4 border-t border-white/10 relative overflow-hidden">
      {/* Footer 3D Decor - Optimized */}
      <img src={cld("https://res.cloudinary.com/dxw5mimqj/image/upload/v1770240123/Kaaba_gay44v.png", 300)} className="absolute bottom-0 left-[-20px] md:left-10 w-24 md:w-32 opacity-80" alt="Kaaba" loading="lazy" />
      <img src={cld("https://res.cloudinary.com/dxw5mimqj/image/upload/v1770239783/Mosque_Tower_f4wmqf.png", 200)} className="absolute bottom-0 right-[-10px] md:right-10 w-16 md:w-24 opacity-80" alt="Tower" loading="lazy" />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-cyan-400 bg-clip-text text-transparent">Noor Card</span>
            <span className="text-xs py-1 px-2 bg-white/5 rounded-full text-gray-400">v1.0</span>
          </div>
          <p className="text-gray-500 text-sm">Spreading goodness, one card at a time.</p>
        </div>

        <div className="text-center md:text-right">
          <p className="text-gray-400 text-sm italic mb-2">"The best of people are those that bring most benefit to the rest of mankind."</p>
          <p className="text-gray-600 text-xs">© 2026 Noor Card • Personalized Digital Blessings</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
