
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
  lang?: string; // New: Encoded language ensures receiver sees correct text
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

// --- V6 PROTOCOL: NANO CODES ---

// 1. Dictionaries
const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LANG_MAP: Record<string, string> = { 'en': 'e', 'ur': 'u', 'ru': 'r', 'ar': 'a', 'hi': 'h' };
const REV_LANG_MAP: Record<string, string> = { 'e': 'en', 'u': 'ur', 'r': 'ru', 'a': 'ar', 'h': 'hi' };
const THEME_MAP = ['A', 'B', 'C', 'D']; // A=Theme 0, B=Theme 1...

// Helper: Normalize text for flexible matching (removes spaces/case)
export const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF\u0900-\u097F]/g, '');

/**
 * Encodes an integer to a Base62 character string (Fixed length)
 */
const toBase62 = (num: number, pad: number = 1): string => {
  let str = "";
  if (num === 0) str = "0";
  while (num > 0) {
    str = BASE62[num % 62] + str;
    num = Math.floor(num / 62);
  }
  return str.padStart(pad, '0');
};

/**
 * Decodes a Base62 character to an integer
 */
const fromBase62 = (char: string): number => {
  return BASE62.indexOf(char);
};

/**
 * Creates a "Nano-Link" based on the sender's edition.
 * Structure: [Lang][Theme][Wish(2)][Blessing(1)][Salt(1)]
 * Example: "eA05bX" (English, Theme A, Wish 05, Blessing b, Salt X)
 */
export const compressData = (data: CardData, currentLang: string, allWishes: string[], allBlessings: string[]): string => {
  try {
    // 1. Language (1 Char)
    const lCode = LANG_MAP[currentLang] || 'e';

    // 2. Theme (1 Char)
    let tIdx = THEMES.findIndex(t => t.id === data.themeId);
    if (tIdx === -1) tIdx = 0;
    const tCode = THEME_MAP[tIdx];

    // 3. Wish (2 Chars -> Supports up to 3844 wishes)
    const normWish = normalize(data.wish);
    const wIdx = allWishes.findIndex(w => normalize(w) === normWish);
    
    // 4. Blessing (1 Char -> Supports up to 61 blessings + 'Z' for none)
    // If includeBlessing is false, use 61 ('Z')
    const bIdx = data.includeBlessing ? (data.blessingIndex || 0) : 61;

    // 5. Salt (1 Char) - Random to ensure unique link if generated twice
    const salt = BASE62[Math.floor(Math.random() * 62)];

    if (wIdx !== -1) {
        // --- PRESET PATH (Nano Code) ---
        // Format: L T WW B S (6 chars)
        const wCode = toBase62(wIdx, 2); // 2 chars
        const bCode = BASE62[bIdx];      // 1 char
        
        return `${lCode}${tCode}${wCode}${bCode}${salt}`;
    } else {
        // --- CUSTOM PATH (Compressed Text) ---
        // Fallback if user wrote a custom wish
        // Format: ~[Lang][Theme][Blessing].[CompressedString]
        const safeWish = LZString.compressToEncodedURIComponent(data.wish);
        const bCode = BASE62[bIdx];
        return `~${lCode}${tCode}${bCode}.${safeWish}`;
    }
  } catch (e) {
    console.error("V6 Compression Error", e);
    return "error";
  }
};

/**
 * Decodes the Nano-Link back to CardData
 */
export const decompressData = (code: string, senderName: string, translations: any): CardData | null => {
  try {
    const safeSender = senderName.replace(/_/g, ' ').replace(/-/g, ' ') || "A Friend";
    
    if (code.startsWith('~')) {
        // --- CUSTOM PATH ---
        // Format: ~LTB.Compressed
        const lChar = code[1];
        const tChar = code[2];
        const bChar = code[3];
        const compressedWish = code.split('.')[1];

        const lang = REV_LANG_MAP[lChar] || 'en';
        const tIdx = THEME_MAP.indexOf(tChar);
        const bIdx = fromBase62(bChar);
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
        // Format: L T WW B S
        // Example: e A 05 b X
        
        const lChar = code[0];
        const tChar = code[1];
        const wStr = code.substring(2, 4); // 2 chars for wish
        const bChar = code[4];
        // Salt is at code[5], ignored for decoding

        const lang = REV_LANG_MAP[lChar] || 'en';
        
        // Get the specific dictionary for the sender's language
        const dict = translations[lang];
        if (!dict) throw new Error("Language not found");

        const tIdx = THEME_MAP.indexOf(tChar);
        // Base62 decode for 2-char wish index: "05" -> 5, "10" -> 62, etc.
        const wIdx = (fromBase62(wStr[0]) * 62) + fromBase62(wStr[1]);
        const bIdx = fromBase62(bChar);

        return {
            from: safeSender,
            to: 'You',
            relationship: 'Friend',
            wish: dict.wishes[wIdx] || "Ramadan Mubarak", // Fallback safe
            themeId: THEMES[tIdx]?.id || THEMES[0].id,
            includeBlessing: bIdx !== 61,
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
