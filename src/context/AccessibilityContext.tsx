import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { translate, type Language, type TranslationKey } from '../lib/i18n';

const STORAGE_KEY = 'neuron-accessibility-v1';

// High Contrast and the dyslexia-friendly font used to be opt-in toggles
// here. They're now permanent site defaults instead — forced on for every
// visitor with no setting to turn them back off — because dim low-opacity
// text and a harder-to-read body font are legibility problems for everyone,
// not preferences some visitors should have to know to enable. Only
// Light Mode and Language stay as real per-visitor preferences.
type Prefs = {
  lightMode: boolean;
  language: Language;
};

const DEFAULT_PREFS: Prefs = {
  lightMode: false,
  language: 'en',
};

function loadPrefs(): Prefs {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw);
    const language: Language = ['en', 'es', 'zh', 'hi'].includes(parsed.language) ? parsed.language : 'en';
    return {
      lightMode: Boolean(parsed.lightMode),
      language,
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

type AccessibilityContextValue = Prefs & {
  readonly highContrast: true;
  readonly dyslexiaFont: true;
  setLightMode: (value: boolean) => void;
  setLanguage: (value: Language) => void;
  t: (key: TranslationKey) => string;
};

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(loadPrefs);

  // Side effects live here, not scattered per-component: classes on <html>
  // that index.css keys off of (each toggle is independent and can combine
  // freely), plus the lang attribute so screen readers announce the right
  // language. Direct class toggling, no transition/animation on the
  // resulting CSS: these should feel instant, not like a fade.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // Private browsing / storage disabled: preference just won't persist.
    }
    const root = document.documentElement;
    // Permanent, not driven by prefs: no stored value can ever turn these off.
    root.classList.add('high-contrast');
    root.classList.add('dyslexia-font');
    root.classList.toggle('light-mode', prefs.lightMode);
    root.lang = prefs.language;
  }, [prefs]);

  const value: AccessibilityContextValue = {
    ...prefs,
    highContrast: true,
    dyslexiaFont: true,
    setLightMode: (lightMode) => setPrefs((p) => ({ ...p, lightMode })),
    setLanguage: (language) => setPrefs((p) => ({ ...p, language })),
    t: (key) => translate(key, prefs.language),
  };

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return ctx;
}
