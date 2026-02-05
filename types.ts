
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
  lang?: string; // New: We now store language in the URL
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

// --- V6 PROTOCOL: ALPHA-SEQUENCE NANO CODES ---

// 1. Language Map (1 Char)
const LANG_MAP: Record<string, string> = { 'en': 'e', 'ur': 'u', 'ru': 'r', 'ar': 'a', 'hi': 'h' };
const REV_LANG_MAP: Record<string, string> = { 'e': 'en', 'u': 'ur', 'r': 'ru', 'a': 'ar', 'h': 'hi' };

// 2. Theme Map (1 Char)
const THEME_MAP = ['A', 'B', 'C', 'D']; // A=Theme 0, B=Theme 1...

// 3. Base62 Dictionary for Indexing (0-9, a-z, A-Z)
const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Helper: Normalize text
export const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

/**
 * Creates a "Nano-Link" based on the sender's edition.
 * Structure: [Lang][Theme][Wish][Blessing][Salt]
 * Example: "eA01x" (English, Theme 1, Wish 0, Blessing 1, Random Salt)
 */
export const compressData = (data: CardData, currentLang: string, allWishes: string[], allBlessings: string[]): string => {
  try {
    // 1. Map Language
    const lCode = LANG_MAP[currentLang] || 'e';

    // 2. Map Theme
    let tIdx = THEMES.findIndex(t => t.id === data.themeId);
    if (tIdx === -1) tIdx = 0;
    const tCode = THEME_MAP[tIdx];

    // 3. Map Wish (Index or Custom)
    const normWish = normalize(data.wish);
    const wIdx = allWishes.findIndex(w => normalize(w) === normWish);
    
    // 4. Map Blessing
    // If includeBlessing is false, we use index 0 (which we'll handle as 'no blessing' logic or just default)
    // Actually, let's say if !includeBlessing, we map to a special char or just 0
    const bIdx = data.includeBlessing ? (data.blessingIndex || 0) : 61; // 61 is 'Z' (reserved for None)

    if (wIdx !== -1 && wIdx < 61) {
        // --- PRESET PATH (Nano Code) ---
        const wCode = BASE62[wIdx];
        const bCode = BASE62[bIdx];
        
        // UNIQUE SALT: Generate random char to ensure "Ali" can send 2 diff cards
        const salt = BASE62[Math.floor(Math.random() * 62)];

        return `${lCode}${tCode}${wCode}${bCode}${salt}`;
    } else {
        // --- CUSTOM PATH (Compressed) ---
        // Format: ~[Lang][Theme][Blessing].[CompressedText]
        const safeWish = LZString.compressToEncodedURIComponent(data.wish);
        const bCode = BASE62[bIdx];
        return `~${lCode}${tCode}${bCode}.${safeWish}`;
    }
  } catch (e) {
    console.error("V6 Compression Error", e);
    return "error";
  }
};

export const decompressData = (code: string, senderName: string, translations: any): CardData | null => {
  try {
    const safeSender = senderName.replace(/_/g, ' ').replace(/-/g, ' ') || "A Friend";
    
    // Check if Custom
    if (code.startsWith('~')) {
        // Format: ~[Lang][Theme][Blessing].[CompressedText]
        const lChar = code[1];
        const tChar = code[2];
        const bChar = code[3];
        const compressedWish = code.split('.')[1];

        const lang = REV_LANG_MAP[lChar] || 'en';
        const tIdx = THEME_MAP.indexOf(tChar);
        const bIdx = BASE62.indexOf(bChar);
        const wish = LZString.decompressFromEncodedURIComponent(compressedWish);

        return {
            from: safeSender,
            to: 'You',
            relationship: 'Friend',
            wish: wish || "Ramadan Mubarak",
            themeId: THEMES[tIdx]?.id || THEMES[0].id,
            includeBlessing: bIdx !== 61,
            blessingIndex: bIdx === 61 ? 0 : bIdx,
            addSurprise: false,
            lang: lang
        };
    } else {
        // --- PRESET PATH (Nano Code) ---
        // Format: [Lang][Theme][Wish][Blessing][Salt]
        // Length usually 5 chars
        
        const lChar = code[0];
        const tChar = code[1];
        const wChar = code[2];
        const bChar = code[3];
        // Salt is code[4], ignored during decode, just for uniqueness

        const lang = REV_LANG_MAP[lChar] || 'en';
        
        // Load Dictionary based on Language Code found in URL
        const dict = translations[lang];
        
        const tIdx = THEME_MAP.indexOf(tChar);
        const wIdx = BASE62.indexOf(wChar);
        const bIdx = BASE62.indexOf(bChar);

        return {
            from: safeSender,
            to: 'You',
            relationship: 'Friend',
            wish: dict?.wishes[wIdx] || "Ramadan Mubarak",
            themeId: THEMES[tIdx]?.id || THEMES[0].id,
            includeBlessing: bIdx !== 61, // 61 ('Z') means no blessing
            blessingIndex: bIdx === 61 ? 0 : bIdx,
            addSurprise: false,
            lang: lang
        };
    }
  } catch (e) {
    console.error("V6 Decompression Error", e);
    return null;
  }
};
