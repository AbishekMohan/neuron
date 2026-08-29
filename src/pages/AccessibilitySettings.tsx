import { Link } from 'react-router-dom';
import { Sun, Languages, Ear } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { LANGUAGES } from '../lib/i18n';

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full shrink-0 transition-colors ${checked ? 'bg-sky-400' : 'bg-white/15'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export default function AccessibilitySettings() {
  const { lightMode, language, setLightMode, setLanguage, t } = useAccessibility();

  return (
    <section className="px-6 sm:px-8 md:px-12 pt-28 md:pt-36 pb-24 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <p className="text-sky-400 text-xs tracking-widest uppercase mb-3">{t('settings.accessibility')}</p>
        <h1 className="text-white text-3xl sm:text-4xl font-light leading-tight tracking-tight">Make it work for you</h1>
        <p className="text-white/50 text-sm mt-4 max-w-xl font-light">
          These preferences are saved on this device and apply across the whole site right away.
        </p>

        <div className="mt-10 divide-y divide-white/10 border-t border-b border-white/10">
          <div className="flex items-center justify-between gap-6 py-5">
            <div className="flex items-start gap-3">
              <Sun className="w-4 h-4 text-sky-300 mt-0.5 shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-white text-sm font-normal">{t('settings.lightMode')}</p>
                <p className="text-white/40 text-xs font-light mt-1">{t('settings.lightModeHint')}</p>
              </div>
            </div>
            <Toggle checked={lightMode} onChange={setLightMode} label={t('settings.lightMode')} />
          </div>
        </div>

        <div className="mt-10">
          <div className="flex items-start gap-3">
            <Languages className="w-4 h-4 text-sky-300 mt-0.5 shrink-0" strokeWidth={1.5} />
            <div>
              <p className="text-white text-sm font-normal">{t('settings.language')}</p>
              <p className="text-white/40 text-xs font-light mt-1">{t('settings.languageHint')}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code)}
                aria-pressed={language === lang.code}
                className={`text-sm px-4 py-2 rounded-full border transition-colors ${
                  language === lang.code
                    ? 'border-sky-400/50 bg-sky-400/10 text-white'
                    : 'border-white/10 text-white/50 hover:text-white hover:border-white/20'
                }`}
              >
                {lang.nativeLabel}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10">
          <div className="flex items-start gap-3">
            <Ear className="w-4 h-4 text-sky-300 mt-0.5 shrink-0" strokeWidth={1.5} />
            <p className="text-white text-sm font-normal">{t('settings.screenReader')}</p>
          </div>
          <ul className="mt-4 flex flex-col gap-3 text-white/50 text-sm font-light leading-relaxed pl-7">
            <li>
              The page is split into landmark regions (navigation, main content, footer). Most screen readers can jump
              directly between them: VoiceOver's rotor, NVDA/JAWS's "D" key, or your reader's equivalent landmark
              navigation.
            </li>
            <li>Icon-only buttons (play/pause, mute, close, and similar controls) carry a text label for your reader even
              though no text is shown on screen.
            </li>
            <li>Every quiz, flashcard, and challenge is operable from the keyboard alone: Tab to move between controls,
              Enter or Space to activate one.
            </li>
            <li>Decorative motion (the particle backgrounds, drifting code) is generated visuals with no information in
              it, and turns off automatically if your system's "reduce motion" setting is on.
            </li>
          </ul>
          <Link
            to="/accessibility-guide"
            className="inline-flex items-center gap-1.5 text-sky-300 hover:text-sky-200 text-sm mt-5 pl-7 transition-colors"
          >
            {t('settings.screenReaderGuideLink')}
          </Link>
        </div>
      </div>
    </section>
  );
}
