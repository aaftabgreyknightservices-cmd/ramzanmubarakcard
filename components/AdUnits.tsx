
import React, { useEffect, useRef } from 'react';
import { Gift, ExternalLink } from 'lucide-react';

/**
 * Adsterra Integration Guide:
 * 1. Log in to Adsterra -> Websites -> Add new code.
 * 2. Select your code type (Native Banner, 728x90 Banner, etc).
 * 3. Replace the placeholder content inside the components below with the code Adsterra gives you.
 * 
 * NOTE: For React, if Adsterra gives you a <script>, use a useEffect to append it, 
 * or simply paste the script in index.html inside a specific div ID and target it here.
 */

/**
 * Native Ad Unit - High CTR, blends with content.
 * Best for: Inside CardBuilder form, between "Wish" and "Theme" selection.
 */
export const NativeAdUnit = () => {
  const adRef = useRef<HTMLDivElement>(null);

  // Example: If using an async script that targets a div id
  // useEffect(() => {
  //    const script = document.createElement('script');
  //    script.src = "//...adsterra_script_url...";
  //    script.async = true;
  //    adRef.current?.appendChild(script);
  // }, []);

  return (
    <div className="w-full my-6 p-1 rounded-xl bg-gradient-to-r from-white/5 via-white/10 to-white/5 border border-white/10 backdrop-blur-sm overflow-hidden group hover:border-yellow-400/30 transition-colors">
        <div className="w-full min-h-[120px] flex flex-col items-center justify-center text-center p-4 relative cursor-pointer" ref={adRef}>
            {/* LABEL */}
            <div className="absolute top-2 right-2 text-[8px] text-gray-500 uppercase tracking-widest border border-white/10 px-1.5 py-0.5 rounded">
                Sponsored
            </div>

            {/* ADSTERRA NATIVE CODE GOES HERE */}
            {/* Example Placeholder Layout - Replace with actual ad code */}
            <div className="flex items-center gap-4 w-full max-w-md mx-auto opacity-70 group-hover:opacity-100 transition-opacity">
                 <div className="w-16 h-16 bg-white/10 rounded-lg flex-shrink-0 animate-pulse"></div>
                 <div className="flex flex-col items-start gap-2 w-full">
                     <div className="w-3/4 h-3 bg-white/10 rounded animate-pulse"></div>
                     <div className="w-1/2 h-2 bg-white/10 rounded animate-pulse"></div>
                 </div>
                 <div className="ml-auto px-4 py-1.5 bg-yellow-400/20 text-yellow-400 text-xs font-bold rounded-full">
                    Open
                 </div>
            </div>
            {/* END AD CODE */}
        </div>
    </div>
  );
};

/**
 * Display Ad Unit - Standard Banner (300x250, 320x50, 728x90)
 * Best for: Bottom of pages, below primary actions, or between layout sections.
 */
export const DisplayAdUnit = ({ size = "medium" }: { size?: "small" | "medium" | "large" }) => {
  const heightClass = size === "small" ? "h-[50px] md:h-[90px]" : size === "large" ? "h-[250px] md:h-[90px]" : "h-[250px]";
  
  return (
    <div className={`w-full ${heightClass} flex justify-center items-center my-8`}>
        <div className={`glass w-full max-w-[320px] md:max-w-[728px] h-full rounded-xl flex items-center justify-center overflow-hidden border border-white/5 relative bg-black/20`}>
            <span className="absolute top-0 right-0 text-[8px] text-gray-600 px-1 bg-white/10 rounded-bl">AD</span>
             
             {/* 
                INSTRUCTION: Paste your Adsterra Banner Script Here (300x250 or 728x90).
             */}
            <div className="text-center text-gray-600 text-xs p-4 flex flex-col items-center gap-2">
                <span className="opacity-50">Advertisement Space</span>
                <span className="text-[10px] opacity-30">Support Noor Card</span>
            </div>
        </div>
    </div>
  );
};

/**
 * SmartLink Button - Floating Action Button (FAB) style.
 * Uses a "Mystery Gift" approach to drive high clicks (CTR).
 * Best for: Receiver View.
 */
export const SmartLinkButton = () => {
    // REPLACE THIS WITH YOUR ACTUAL ADSTERRA SMARTLINK / DIRECT LINK URL
    const SMARTLINK_URL = "https://www.google.com"; // Example placeholder

    return (
        <a 
            href={SMARTLINK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 left-6 z-[60] group perspective-1000"
        >
            <div className="relative transform transition-transform duration-300 group-hover:-translate-y-1">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-md opacity-40 group-hover:opacity-80 animate-pulse transition-opacity duration-500"></div>
                
                {/* Button */}
                <button className="relative bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-bold p-3 md:pr-5 md:pl-4 rounded-full shadow-[0_4px_15px_rgba(245,158,11,0.5)] flex items-center gap-2 border border-yellow-300/30 overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full"></div>
                    
                    <Gift size={22} className="text-white animate-bounce drop-shadow-md relative z-10" />
                    
                    <div className="flex flex-col items-start relative z-10">
                        <span className="hidden md:inline text-[10px] uppercase text-yellow-100 leading-none">Surprise</span>
                        <span className="hidden md:inline text-xs font-black uppercase tracking-wider text-white leading-none">Claim Gift</span>
                    </div>
                </button>
                
                {/* Badge */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white shadow-sm animate-ping"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white shadow-sm"></div>
            </div>
        </a>
    );
};
