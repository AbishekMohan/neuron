import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { translate, type Language, type TranslationKey } from '../lib/i18n';

const STORAGE_KEY = 'neuron-accessibility-v1';

type Prefs = {
  highContrast: boolean;
  lightMode: boolean;
  dyslexiaFont: boolean;
  language: Language;
};

const DEFAULT_PREFS: Prefs = {
  highContrast: false,
  lightMode: false,
  dyslexiaFont: false,
  language: 'en',
};

function loadPrefs(): Prefs {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw);
    const language: Language = ['en', 'es', 'zh', 'hi'].includes(parsed.language) ? parsed.language : 'en';
    return {
      highContrast: Boolean(parsed.highContrast),
      lightMode: Boolean(parsed.lightMode),
      dyslexiaFont: Boolean(parsed.dyslexiaFont),
      language,
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

type AccessibilityContextValue = Prefs & {
  setHighContrast: (value: boolean) => void;
  setLightMode: (value: boolean) => void;
  setDyslexiaFont: (value: boolean) => void;
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
    root.classList.toggle('high-contrast', prefs.highContrast);
    root.classList.toggle('light-mode', prefs.lightMode);
    root.classList.toggle('dyslexia-font', prefs.dyslexiaFont);
    root.lang = prefs.language;
  }, [prefs]);

  const value: AccessibilityContextValue = {
    ...prefs,
    setHighContrast: (highContrast) => setPrefs((p) => ({ ...p, highContrast })),
    setLightMode: (lightMode) => setPrefs((p) => ({ ...p, lightMode })),
    setDyslexiaFont: (dyslexiaFont) => setPrefs((p) => ({ ...p, dyslexiaFont })),
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
