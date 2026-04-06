
export const ONSET = [
    'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

export const VOWEL = [
    'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'
];

export const CODA = [
    '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

// Mapping from Jamo to Index
const ONSET_MAP = Object.fromEntries(ONSET.map((v, i) => [v, i]));
const VOWEL_MAP = Object.fromEntries(VOWEL.map((v, i) => [v, i]));
const CODA_MAP = Object.fromEntries(CODA.map((v, i) => [v, i]));

// Combinations for vowels (Keys must be pre-sorted by character code: ㅏ < ㅐ < ㅓ < ㅔ < ㅗ < ㅜ < ㅡ < ㅣ)
const VOWEL_COMBINATIONS: Record<string, string> = {
    'ㅏㅗ': 'ㅘ', 
    'ㅐㅗ': 'ㅙ', 
    'ㅗㅣ': 'ㅚ',
    'ㅓㅜ': 'ㅝ', 
    'ㅔㅜ': 'ㅞ', 
    'ㅜㅣ': 'ㅟ',
    'ㅡㅣ': 'ㅢ'
};

// Combinations for codas (Keys must be pre-sorted by character code)
const CODA_COMBINATIONS: Record<string, string> = {
    'ㄱㅅ': 'ㄳ', 
    'ㄴㅈ': 'ㄵ', 
    'ㄴㅎ': 'ㄶ', 
    'ㄱㄹ': 'ㄺ', 
    'ㄹㅁ': 'ㄻ', 
    'ㄹㅂ': 'ㄼ', 
    'ㄹㅅ': 'ㄽ', 
    'ㄹㅌ': 'ㄾ', 
    'ㄹㅍ': 'ㄿ', 
    'ㄹㅎ': 'ㅀ', 
    'ㅂㅅ': 'ㅄ'
};

export function composeHangul(onset: string, vowel: string, coda: string): string {
    if (!onset && !vowel && !coda) return '';
    
    // If only components are present but not a full syllable
    if (!onset && vowel) return vowel;
    if (onset && !vowel) return onset;

    const oIdx = ONSET_MAP[onset] ?? -1;
    const vIdx = VOWEL_MAP[vowel] ?? -1;
    const cIdx = CODA_MAP[coda] ?? 0;

    if (oIdx === -1 || vIdx === -1) {
        // Fallback: just return the components joined
        return (onset || '') + (vowel || '') + (coda || '');
    }

    const code = (oIdx * 21 + vIdx) * 28 + cIdx + 0xAC00;
    return String.fromCharCode(code);
}

/**
 * Normalizes Jamo combinations.
 * Example: 'ㅗ', 'ㅏ' -> 'ㅘ'
 */
export function normalizeOnset(onsets: string[]): string {
    if (onsets.length === 0) return '';
    if (onsets.length === 1) return onsets[0];
    
    // For Sebeolsik, double consonants are often formed by repeating the key
    const sorted = [...onsets].sort().join('');
    const combinations: Record<string, string> = {
        'ㄱㄱ': 'ㄲ',
        'ㄷㄷ': 'ㄸ',
        'ㅂㅂ': 'ㅃ',
        'ㅅㅅ': 'ㅆ',
        'ㅈㅈ': 'ㅉ'
    };
    return combinations[sorted] || onsets[0];
}

export function normalizeVowel(vowels: string[]): string {
    if (vowels.length === 0) return '';
    if (vowels.length === 1) return vowels[0];
    
    // Sort to make order irrelevant for Moachigi
    const sorted = [...new Set(vowels)].sort().join('');
    return VOWEL_COMBINATIONS[sorted] || vowels[0];
}

export function normalizeCoda(codas: string[]): string {
    if (codas.length === 0) return '';
    if (codas.length === 1) return codas[0];
    
    const sorted = [...codas].sort().join('');
    const additionalCombos: Record<string, string> = {
        'ㄱㄱ': 'ㄲ',
        'ㅅㅅ': 'ㅆ'
    };
    return CODA_COMBINATIONS[sorted] || additionalCombos[sorted] || codas[0];
}

const DUBEOL_MAP: Record<string, string> = {
    'ㄱ': 'r', 'ㄲ': 'R', 'ㄴ': 's', 'ㄷ': 'e', 'ㄸ': 'E', 'ㄹ': 'f', 'ㅁ': 'a', 'ㅂ': 'q', 'ㅃ': 'Q', 'ㅅ': 't', 'ㅆ': 'T', 'ㅇ': 'd', 'ㅈ': 'w', 'ㅉ': 'W', 'ㅊ': 'c', 'ㅋ': 'z', 'ㅌ': 'x', 'ㅍ': 'v', 'ㅎ': 'g',
    'ㅏ': 'k', 'ㅐ': 'o', 'ㅑ': 'i', 'ㅒ': 'I', 'ㅓ': 'j', 'ㅔ': 'p', 'ㅕ': 'u', 'ㅖ': 'P', 'ㅗ': 'h', 'ㅛ': 'y', 'ㅜ': 'n', 'ㅠ': 'b', 'ㅡ': 'm', 'ㅣ': 'l',
    'ㄳ': 'rt', 'ㄴㅈ': 'sw', 'ㄴㅎ': 'sg', 'ㄹㄱ': 'fr', 'ㄹㅁ': 'fa', 'ㄹㅂ': 'fq', 'ㄹㅅ': 'ft', 'ㄹㅌ': 'fx', 'ㄹㅍ': 'fv', 'ㄹㅎ': 'fg', 'ㅂㅅ': 'qt',
    'ㅘ': 'hk', 'ㅙ': 'ho', 'ㅚ': 'hl', 'ㅝ': 'nj', 'ㅞ': 'np', 'ㅟ': 'nl', 'ㅢ': 'ml'
};

export function getDubeolsikKeystrokes(char: string): string {
    const code = char.charCodeAt(0) - 0xAC00;
    if (code < 0 || code > 11171) return DUBEOL_MAP[char] || char;

    const oIdx = Math.floor(code / 588);
    const vIdx = Math.floor((code % 588) / 28);
    const cIdx = code % 28;

    let result = (DUBEOL_MAP[ONSET[oIdx]] || ONSET[oIdx] || '');
    result += (DUBEOL_MAP[VOWEL[vIdx]] || VOWEL[vIdx] || '');
    if (cIdx > 0) result += (DUBEOL_MAP[CODA[cIdx]] || CODA[cIdx] || '');

    return result;
}

export function getSebeolsikKeystrokes(char: string, layout: any): string[] {
    const code = char.charCodeAt(0) - 0xAC00;
    if (code < 0 || code > 11171) {
        // Find single key for this char
        for (const [k, v] of Object.entries(layout.keys as Record<string, any>)) {
            if (v.label === char) return [k];
            if (v.shiftLabel === char) return ['shift+' + k];
        }
        return [char];
    }

    const oIdx = Math.floor(code / 588);
    const vIdx = Math.floor((code % 588) / 28);
    const cIdx = code % 28;

    const oChar = ONSET[oIdx];
    const vChar = VOWEL[vIdx];
    const cChar = CODA[cIdx];

    const findKeysFor = (target: string, type: string) => {
        let targets = [target];
        
        if (type === '초성') {
            const onsetDecomp: Record<string, string> = {
                'ㄲ': 'ㄱㄱ', 'ㄸ': 'ㄷㄷ', 'ㅃ': 'ㅂㅂ', 'ㅆ': 'ㅅㅅ', 'ㅉ': 'ㅈㅈ'
            };
            if (onsetDecomp[target]) {
                // Check if the layout has the double consonant directly first
                let hasDirect = false;
                for (const v of Object.values(layout.keys as Record<string, any>)) {
                    if (v.description?.includes('초성') && (v.label === target || v.shiftLabel === target)) {
                        hasDirect = true;
                        break;
                    }
                }
                if (!hasDirect) targets = onsetDecomp[target].split('');
            }
        } else if (type === '중성') {
            for (const [comps, combined] of Object.entries(VOWEL_COMBINATIONS)) {
                if (combined === target) { targets = comps.split(''); break; }
            }
        } else if (type === '종성') {
            for (const [comps, combined] of Object.entries(CODA_COMBINATIONS)) {
                if (combined === target) { targets = comps.split(''); break; }
            }
            // Double codas like ㄲ, ㅆ if not found
            if (target === 'ㄲ' || target === 'ㅆ') {
                let hasDirect = false;
                for (const v of Object.values(layout.keys as Record<string, any>)) {
                    if (v.description?.includes('종성') && (v.label === target || v.shiftLabel === target)) {
                        hasDirect = true;
                        break;
                    }
                }
                if (!hasDirect) targets = (target === 'ㄲ' ? 'ㄱㄱ' : 'ㅅㅅ').split('');
            }
        }

        let keys: string[] = [];
        for (const t of targets) {
            let found = false;
            for (const [k, v] of Object.entries(layout.keys as Record<string, any>)) {
                if (v.description?.includes(type)) {
                    if (v.label === t || v.shiftLabel === t) {
                        let label = k;
                        if (v.shiftLabel === t) label = 'shift+' + label;
                        keys.push(label);
                        found = true;
                        break;
                    }
                }
            }
            if (!found) keys.push(t);
        }
        return keys;
    };

    let result: string[] = [];
    result.push(...findKeysFor(oChar, '초성'));
    result.push(...findKeysFor(vChar, '중성'));
    
    if (cIdx > 0) {
        result.push(...findKeysFor(cChar, '종성'));
    }
    
    return result;
}
