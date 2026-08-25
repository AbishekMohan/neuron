// Cosmetic customization for the trained companion — a name and an
// accent variant. Deliberately stays inside the blue family (see
// carvisOrb.ts's own comments on why): these are hue-rotation amounts
// applied via CSS filter on the orb's canvas, not new base colors, so
// "your companion" still visibly reads as the same system everywhere
// else on the site uses blue for AI.

export type HueVariant = 'sky' | 'cyan' | 'indigo' | 'teal';

export const HUE_OPTIONS: { id: HueVariant; label: string; filter: string; swatch: string }[] = [
  { id: 'sky', label: 'Sky', filter: 'none', swatch: '#38bdf8' },
  { id: 'cyan', label: 'Cyan', filter: 'hue-rotate(25deg) saturate(1.1)', swatch: '#22d3ee' },
  { id: 'indigo', label: 'Indigo', filter: 'hue-rotate(-25deg) saturate(1.15)', swatch: '#818cf8' },
  { id: 'teal', label: 'Teal', filter: 'hue-rotate(45deg) saturate(1.05)', swatch: '#2dd4bf' },
];

// voiceURI is a free-tier, no-API-key choice: it picks among whatever
// speech-synthesis voices this browser/OS already has installed (see
// lib/speechPulse.ts's getAvailableVoices) — null means "browser default".
export type CompanionIdentity = { name: string; hue: HueVariant; voiceURI: string | null };

const DEFAULT_IDENTITY: CompanionIdentity = { name: 'Companion', hue: 'sky', voiceURI: null };
const STORAGE_KEY = 'neuron-companion-identity-v1';

export function loadCompanionIdentity(): CompanionIdentity {
  if (typeof window === 'undefined') return DEFAULT_IDENTITY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_IDENTITY;
    const parsed = JSON.parse(raw);
    const hue: HueVariant = HUE_OPTIONS.some((h) => h.id === parsed.hue) ? parsed.hue : 'sky';
    const name = typeof parsed.name === 'string' && parsed.name.trim() ? parsed.name.trim().slice(0, 24) : 'Companion';
    const voiceURI = typeof parsed.voiceURI === 'string' ? parsed.voiceURI : null;
    return { name, hue, voiceURI };
  } catch {
    return DEFAULT_IDENTITY;
  }
}

export function saveCompanionIdentity(identity: CompanionIdentity) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(identity));
}

export function getHueFilter(hue: HueVariant): string {
  return HUE_OPTIONS.find((h) => h.id === hue)?.filter ?? 'none';
}
