
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-4 border-t border-white/10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
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
