
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

// Helper: Normalize text
const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

// --- V4 PROTOCOL: BITWISE PACKING ---
// Result Code Length: 2-3 characters for presets.

export const compressData = (data: CardData): string => {
  try {
    // 1. Map Theme (0-3)
    let tIdx = THEMES.findIndex(t => t.id === data.themeId);
    if (tIdx === -1) tIdx = 0;

    // 2. Map Blessing (0-5)
    // 0 = No Blessing, 1..5 = Blessing Index + 1
    const bVal = data.includeBlessing ? (data.blessingIndex || 0) + 1 : 0;

    // 3. Map Wish (0-9 or Custom)
    const normWish = normalize(data.wish);
    const wIdx = PRESET_WISHES.findIndex(w => normalize(w) === normWish);

    if (wIdx !== -1) {
        // --- PRESET PATH (Bit Packing) ---
        // Formula: Theme + (Blessing * 4) + (Wish * 24)
        // Max Value: 3 + (5*4) + (9*24) = 3 + 20 + 216 = 239
        // 239 in Base36 is "6n". Just 2 chars!
        const packedValue = tIdx + (bVal * 4) + (wIdx * 24);
        return packedValue.toString(36);
    } else {
        // --- CUSTOM PATH (Fallback) ---
        // We can't compress custom text to 2 chars, but we can keep it clean.
        // Prefix with '~' to denote custom.
        // Encode Theme & Blessing in 1 char: T + (B*4) -> Base36
        const configVal = tIdx + (bVal * 4);
        const configChar = configVal.toString(36);
        
        // Use URI Encoding for readability or LZString if huge
        const safeWish = encodeURIComponent(data.wish).replace(/%20/g, '+');
        return `~${configChar}.${safeWish}`;
    }
  } catch (e) {
    console.error("V4 Compression Error", e);
    return "0"; // Default fallback
  }
};

export const decompressData = (code: string, senderName: string = "A Friend"): CardData => {
  try {
    let tIdx = 0;
    let bVal = 1; // Default to first blessing included
    let wish = PRESET_WISHES[0];

    // Decode Sender Name (Restore spaces)
    const safeSender = senderName.replace(/_/g, ' ').replace(/-/g, ' ') || "A Friend";

    if (code.startsWith('~')) {
        // --- CUSTOM PATH ---
        // Format: ~[ConfigChar].[WishText]
        const parts = code.substring(1).split('.');
        const configChar = parts[0];
        const wishText = parts.slice(1).join('.'); // Rejoin if wish had dots

        const configVal = parseInt(configChar, 36);
        tIdx = configVal % 4;
        bVal = Math.floor(configVal / 4);
        
        wish = decodeURIComponent(wishText.replace(/\+/g, '%20'));
    } else {
        // --- PRESET PATH ---
        const val = parseInt(code, 36);
        if (!isNaN(val)) {
            // Reverse Formula: Theme + (Blessing * 4) + (Wish * 24)
            tIdx = val % 4;
            const remaining = Math.floor(val / 4);
            bVal = remaining % 6;
            const wIdx = Math.floor(remaining / 6);
            
            wish = PRESET_WISHES[wIdx] || PRESET_WISHES[0];
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
    console.error("V4 Decompression Error", e);
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
