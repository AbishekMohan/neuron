// Cosmetic customization for the trained companion: just a name and a
// voice. Deliberately no color customization at all — the companion (and
// every AI-adjacent surface on this site) is one single blue, always, no
// variants, no exceptions.

export type CompanionIdentity = { name: string; voiceURI: string | null };

const DEFAULT_IDENTITY: CompanionIdentity = { name: 'Companion', voiceURI: null };
const STORAGE_KEY = 'neuron-companion-identity-v1';

export function loadCompanionIdentity(): CompanionIdentity {
  if (typeof window === 'undefined') return DEFAULT_IDENTITY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_IDENTITY;
    const parsed = JSON.parse(raw);
    const name = typeof parsed.name === 'string' && parsed.name.trim() ? parsed.name.trim().slice(0, 24) : 'Companion';
    const voiceURI = typeof parsed.voiceURI === 'string' ? parsed.voiceURI : null;
    return { name, voiceURI };
  } catch {
    return DEFAULT_IDENTITY;
  }
}

export function saveCompanionIdentity(identity: CompanionIdentity) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(identity));
}
