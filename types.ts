
import LZString from 'lz-string';

export interface CardTheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
  glow: string;
}

export interface CardData {
  from: string;
  to: string;
  relationship: string;
  wish: string;
  themeId: string;
  includeBlessing: boolean;
  addSurprise: boolean;
  blessingIndex?: number;
}

export const THEMES: CardTheme[] = [
  {
    id: 'crescent-dream',
    name: 'Crescent Dream',
    primary: '#1a0a3d',
    secondary: '#00D4FF',
    accent: '#FFD166',
    gradient: 'from-[#0a0515] via-[#1a0a3d] to-[#0d1f3f]',
    glow: 'rgba(0, 212, 255, 0.3)'
  },
  {
    id: 'lantern-glow',
    name: 'Lantern Glow',
    primary: '#2d1b0d',
    secondary: '#FF8C00',
    accent: '#FFD166',
    gradient: 'from-[#150a05] via-[#2d1b0d] to-[#3f1f0d]',
    glow: 'rgba(255, 140, 0, 0.3)'
  },
  {
    id: 'peaceful-garden',
    name: 'Peaceful Garden',
    primary: '#05150a',
    secondary: '#00B894',
    accent: '#FFFFFF',
    gradient: 'from-[#05150a] via-[#0a3d1a] to-[#0d3f1f]',
    glow: 'rgba(0, 184, 148, 0.3)'
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    primary: '#150515',
    secondary: '#FF6B9D',
    accent: '#FFD166',
    gradient: 'from-[#150515] via-[#3d0a3d] to-[#3f0d3f]',
    glow: 'rgba(255, 107, 157, 0.3)'
  }
];

export const PRESET_WISHES = [
  "May this Ramzan bring you peace, joy, and endless blessings.",
  "May this Ramzan shine the light of guidance in your home.",
  "May this Ramzan fill your month with mercy and your heart with profound gratitude.",
  "May this Ramzan be the month Allah accepts your fasts and answers your secret prayers.",
  "May this Ramzan turn your heart into a vessel of Noor and fill your days with Barakah.",
  "May this Ramzan heal what is broken within you and strengthen what is weak.",
  "May this Ramzan bring you strength in every suhoor and peace in every iftar.",
  "May this Ramzan become the beautiful turning point you have been waiting for.",
  "May this Ramzan open the gates of Heaven for you and ensure the gates of Mercy never close.",
  "May this Ramzan grant you 30 days of clemency, 720 hours of enlightenment, and 43,200 minutes of joy."
];

export const BLESSINGS = [
  "May the light of this month find the cracks in your heart.",
  "I pray that every silent struggle you carry is answered.",
  "May your home be a sanctuary where angels love to visit.",
  "I asked Allah today to protect your smile and grant you serenity.",
  "May your fasts be a shield for your soul and your prayers a bridge."
];

// --- HYPER SHORT LINK COMPRESSION (V2.1 Optimized) ---

export const compressData = (data: CardData): string => {
  try {
    const tIdx = THEMES.findIndex(t => t.id === data.themeId);
    const themeIdx = tIdx >= 0 ? tIdx : 0;
    const blessIdx = data.includeBlessing ? (data.blessingIndex || 0) : ''; 
    const safeFrom = data.from.replace(/\|/g, '-'); // Sanitize delimiter

    // OPTIMIZATION: Check if wish is a preset
    // If exact match, send index prefixed with '_' (e.g. _0, _5)
    // If custom, send full text
    const wishIdx = PRESET_WISHES.indexOf(data.wish);
    const compressedWish = wishIdx !== -1 ? `_${wishIdx}` : data.wish;

    // V2 Format: v2|ThemeIdx|BlessIdx|From|Wish(or _Index)
    const payload = `v2|${themeIdx}|${blessIdx}|${safeFrom}|${compressedWish}`;
    
    return LZString.compressToEncodedURIComponent(payload);
  } catch (e) {
    console.error("Compression Error", e);
    return "";
  }
};

export const decompressData = (str: string): CardData | null => {
  if (!str) return null;

  try {
    // 1. Try V2 Decompression (LZString)
    const decompressed = LZString.decompressFromEncodedURIComponent(str);
    
    if (decompressed && decompressed.startsWith('v2|')) {
        const parts = decompressed.split('|');
        if (parts.length < 4) return null;

        const themeIdx = parseInt(parts[1]);
        const blessIdxStr = parts[2];
        const from = parts[3];
        let wish = parts.slice(4).join('|');

        // OPTIMIZATION: Restore preset wish from index
        if (wish.startsWith('_')) {
            const wIdx = parseInt(wish.substring(1));
            if (!isNaN(wIdx) && PRESET_WISHES[wIdx]) {
                wish = PRESET_WISHES[wIdx];
            }
        }

        return {
            from: from || "A Friend",
            to: 'You',
            relationship: 'Friend',
            wish: wish || PRESET_WISHES[0],
            themeId: THEMES[themeIdx]?.id || THEMES[0].id,
            includeBlessing: blessIdxStr !== '',
            blessingIndex: blessIdxStr !== '' ? parseInt(blessIdxStr) : 0,
            addSurprise: false
        };
    }

    // 2. Fallback to V1 (Base64 JSON) for legacy links
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    
    const encoded = atob(base64);
    const json = decodeURIComponent(Array.prototype.map.call(encoded, 
      (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    
    const arr = JSON.parse(json);
    
    if (Array.isArray(arr) && arr[0] === 1) {
       const [_, themeIdx, blessIdx, from, wish] = arr;
       return {
         from: from || "A Friend",
         to: 'You',
         relationship: 'Friend',
         wish: wish || PRESET_WISHES[0],
         themeId: THEMES[themeIdx]?.id || THEMES[0].id,
         includeBlessing: blessIdx !== -1,
         blessingIndex: blessIdx === -1 ? 0 : blessIdx,
         addSurprise: false
       };
    }
    
    return null;
  } catch (e) {
    console.error("Decompression Error", e);
    return null;
  }
};
