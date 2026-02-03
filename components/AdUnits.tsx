
import React from 'react';
import { Gift, ExternalLink } from 'lucide-react';

/**
 * Native Ad Unit - Best for placing inside content flows (e.g., inside the builder form).
 * Recommended Adsterra Format: Native Banner (4:1 or 6:1 aspect ratio)
 */
export const NativeAdUnit = () => {
  return (
    <div className="w-full my-6 p-1 rounded-xl bg-gradient-to-r from-white/5 via-white/10 to-white/5 border border-white/10 backdrop-blur-sm overflow-hidden">
        <div className="w-full min-h-[100px] flex flex-col items-center justify-center text-center p-4 relative group cursor-pointer">
            {/* Replace this div with your Adsterra Native Banner Script */}
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-1 border px-2 py-0.5 rounded border-gray-600">Sponsored</div>
            <div id="adsterra-native-placeholder" className="w-full">
               {/* 
                  INSTRUCTION: Paste your Adsterra Native Banner <div> or <script> here. 
                  Ensure the ad text color is set to white/light gray in Adsterra settings.
               */}
               <div className="flex items-center gap-4 justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 bg-white/10 rounded-lg animate-pulse"></div>
                  <div className="flex flex-col items-start gap-2">
                      <div className="w-48 h-3 bg-white/10 rounded animate-pulse"></div>
                      <div className="w-32 h-2 bg-white/10 rounded animate-pulse"></div>
                  </div>
               </div>
            </div>
        </div>
    </div>
  );
};

/**
 * Display Ad Unit - Standard Banner (300x250, 320x50, 728x90)
 * Best for: Bottom of pages, below primary actions.
 */
export const DisplayAdUnit = ({ size = "medium" }: { size?: "small" | "medium" | "large" }) => {
  const heightClass = size === "small" ? "h-[50px] md:h-[90px]" : size === "large" ? "h-[250px] md:h-[90px]" : "h-[250px]";
  
  return (
    <div className={`w-full ${heightClass} flex justify-center items-center my-8`}>
        <div className={`glass w-full max-w-[320px] md:max-w-[728px] h-full rounded-xl flex items-center justify-center overflow-hidden border border-white/5 relative`}>
            <span className="absolute top-1 right-1 text-[8px] text-gray-600 px-1 bg-black/40 rounded">AD</span>
             {/* 
                INSTRUCTION: Paste your Adsterra Banner (300x250 or 728x90) script here.
             */}
            <div className="text-center text-gray-600 text-xs p-4">
                <p>Support Noor Card</p>
                <p className="opacity-50 text-[10px]">Advertisement</p>
            </div>
        </div>
    </div>
  );
};

/**
 * SmartLink Button - High CTR placement for "Mystery" or "Bonus" links.
 * Best for: Receiver View (Floating) or Footer.
 */
export const SmartLinkButton = () => {
    // Replace this with your actual Adsterra Smartlink/Direct Link URL
    const SMARTLINK_URL = "#"; 

    return (
        <a 
            href={SMARTLINK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-4 left-4 z-50 group"
        >
            <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur opacity-40 group-hover:opacity-75 animate-pulse transition-opacity"></div>
                <button className="relative bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold p-3 md:px-5 md:py-3 rounded-full shadow-lg flex items-center gap-2 hover:scale-105 transition-transform">
                    <Gift size={20} className="animate-bounce" />
                    <span className="hidden md:inline text-xs uppercase tracking-widest">Claim Gift</span>
                </button>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-black"></div>
            </div>
        </a>
    );
};
