
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

// Helper: Normalize text to catch presets regardless of punctuation/spacing
const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

// --- HYPER SHORT LINK COMPRESSION (V3 Custom Packing) ---

export const compressData = (data: CardData): string => {
  try {
    // 1. Pack Theme (0-Z)
    const tIdx = THEMES.findIndex(t => t.id === data.themeId);
    const tChar = tIdx !== -1 ? tIdx.toString(36) : '0';

    // 2. Pack Blessing (0-Z or 'z' for none)
    const bChar = data.includeBlessing ? (data.blessingIndex || 0).toString(36) : 'z';

    // 3. Pack Wish (0-Z for preset, 'x' for custom)
    const normWish = normalize(data.wish);
    const pIdx = PRESET_WISHES.findIndex(w => normalize(w) === normWish);
    const wChar = pIdx !== -1 ? pIdx.toString(36) : 'x';

    // 4. Sanitize Sender
    const safeFrom = data.from.replace(/\|/g, ' ').trim();

    // V3 Format: 3[Theme][Blessing][Wish][Sender]...
    // If custom wish: ...[Sender]|[CustomWish]
    let payload = `3${tChar}${bChar}${wChar}${safeFrom}`;
    
    if (wChar === 'x') {
        payload += `|${data.wish}`;
    }
    
    // Result is usually 8-15 chars for presets
    return LZString.compressToEncodedURIComponent(payload);
  } catch (e) {
    console.error("Compression Error", e);
    return "";
  }
};

export const decompressData = (str: string): CardData | null => {
  if (!str) return null;

  try {
    // Attempt V3 Decompression
    const decompressed = LZString.decompressFromEncodedURIComponent(str);
    
    if (decompressed && decompressed.startsWith('3')) {
        // Parse V3 Header
        const tIdx = parseInt(decompressed[1], 36);
        const bChar = decompressed[2];
        const wChar = decompressed[3];
        const rest = decompressed.substring(4);

        let from = rest;
        let wish = "";

        if (wChar === 'x') {
            // Custom Wish
            const parts = rest.split('|');
            from = parts[0];
            wish = parts.slice(1).join('|');
        } else {
            // Preset Wish
            const wIdx = parseInt(wChar, 36);
            wish = PRESET_WISHES[wIdx] || PRESET_WISHES[0];
        }

        return {
            from: from || "A Friend",
            to: 'You',
            relationship: 'Friend',
            wish: wish || PRESET_WISHES[0],
            themeId: THEMES[tIdx]?.id || THEMES[0].id,
            includeBlessing: bChar !== 'z',
            blessingIndex: bChar !== 'z' ? parseInt(bChar, 36) : 0,
            addSurprise: false
        };
    }

    // --- Legacy V2 Fallback ---
    if (decompressed && decompressed.startsWith('v2|')) {
        const parts = decompressed.split('|');
        if (parts.length < 4) return null;
        const themeIdx = parseInt(parts[1]);
        const blessIdxStr = parts[2];
        const from = parts[3];
        let wish = parts.slice(4).join('|');
        if (wish.startsWith('_')) {
            const wIdx = parseInt(wish.substring(1));
            if (!isNaN(wIdx) && PRESET_WISHES[wIdx]) wish = PRESET_WISHES[wIdx];
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

    // --- Legacy V1 Fallback ---
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
