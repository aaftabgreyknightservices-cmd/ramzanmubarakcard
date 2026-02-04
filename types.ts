
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

// CRITICAL: This list matches translations.ts EXACTLY to ensure compression works.
export const PRESET_WISHES = [
  "May this Ramzan bring you peace, joy, and endless blessings, keeping you in my duas.",
  "May this Ramzan shine the light of guidance in your home and your heart forever.",
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
  "May the light of this month find the cracks in your heart and fill them with unshakeable peace.",
  "I pray that every silent struggle you carry is answered with a mercy so vast it brings you to tears of joy.",
  "May your home be a sanctuary where angels love to visit and where love is the only language spoken.",
  "I asked Allah today to protect your smile and grant you the kind of serenity that the world can't take away.",
  "May your fasts be a shield for your soul and your prayers a bridge to everything your heart desires."
];

// Helper: Normalize text
const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

// --- V5 PROTOCOL: MATRIX PACKING WITH SALT ---
// Logic: (Salt << 14) | (Theme << 12) | (Blessing << 8) | WishIndex
// Result: 3 Characters Max.

export const compressData = (data: CardData): string => {
  try {
    // 1. Map Theme (0-3)
    let tIdx = THEMES.findIndex(t => t.id === data.themeId);
    if (tIdx === -1) tIdx = 0;

    // 2. Map Blessing (0-6)
    // 0 = No Blessing, 1..6 = Blessing Index + 1
    const bVal = data.includeBlessing ? (data.blessingIndex || 0) + 1 : 0;

    // 3. Map Wish (0-99)
    // We normalize to ignore small typos or punctuation differences
    const normWish = normalize(data.wish);
    const wIdx = PRESET_WISHES.findIndex(w => normalize(w) === normWish);

    if (wIdx !== -1) {
        // --- PRESET PATH ---
        
        // UNIQUE SALT: Random number 0-3. 
        // This ensures if you generate the same card twice, the code looks different 
        // (e.g. '4k' vs 'a2') but decodes to the same content.
        const salt = Math.floor(Math.random() * 4); 

        // BIT PACKING STRATEGY
        // Salt (2 bits) | Theme (2 bits) | Blessing (4 bits) | Wish (7 bits)
        // Total 15 bits. Max integer ~32768.
        // Base36('32768') is 'pa8' (3 chars).
        
        const packedValue = (salt << 13) | (tIdx << 11) | (bVal << 7) | wIdx;
        
        return packedValue.toString(36);
    } else {
        // --- CUSTOM PATH (Fallback) ---
        // Used only if user types a completely custom message
        const configVal = tIdx + (bVal * 4);
        const configChar = configVal.toString(36);
        const safeWish = encodeURIComponent(data.wish).replace(/%20/g, '+');
        return `~${configChar}.${safeWish}`;
    }
  } catch (e) {
    console.error("V5 Compression Error", e);
    return "0";
  }
};

export const decompressData = (code: string, senderName: string = "A Friend"): CardData => {
  try {
    let tIdx = 0;
    let bVal = 1; 
    let wish = PRESET_WISHES[0];
    const safeSender = senderName.replace(/_/g, ' ').replace(/-/g, ' ') || "A Friend";

    if (code.startsWith('~')) {
        // Custom Path
        const parts = code.substring(1).split('.');
        const configChar = parts[0];
        const wishText = parts.slice(1).join('.');
        const configVal = parseInt(configChar, 36);
        tIdx = configVal % 4;
        bVal = Math.floor(configVal / 4);
        wish = decodeURIComponent(wishText.replace(/\+/g, '%20'));
    } else {
        // Preset Path (Matrix Unpacking)
        const val = parseInt(code, 36);
        if (!isNaN(val)) {
            // Unpack Bits
            // We discard the Salt (top 2 bits) as it's just for visual uniqueness
            
            // Mask: 1111111 (127) gets the Wish (bottom 7 bits)
            const wIdx = val & 127;
            
            // Shift right 7, Mask: 1111 (15) gets Blessing
            const bRaw = (val >> 7) & 15;
            
            // Shift right 11, Mask: 11 (3) gets Theme
            tIdx = (val >> 11) & 3;
            
            wish = PRESET_WISHES[wIdx] || PRESET_WISHES[0];
            bVal = bRaw;
        }
    }

    return {
        from: safeSender,
        to: 'You',
        relationship: 'Friend',
        wish: wish,
        themeId: THEMES[tIdx]?.id || THEMES[0].id,
        includeBlessing: bVal > 0,
        blessingIndex: bVal > 0 ? bVal - 1 : 0,
        addSurprise: false
    };

  } catch (e) {
    console.error("V5 Decompression Error", e);
    return {
        from: senderName || "A Friend",
        to: "You",
        relationship: "Friend",
        wish: PRESET_WISHES[0],
        themeId: THEMES[0].id,
        includeBlessing: true,
        blessingIndex: 0,
        addSurprise: false
    };
  }
};
