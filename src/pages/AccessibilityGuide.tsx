import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const SECTIONS = [
  {
    title: '1. Getting around the site',
    body: [
      'The navigation bar at the top of every page links to Home, Modules, Companion, Challenges, Leaderboard, Dashboard, and Reference.',
      'Press Tab to move forward through links and controls, and Shift + Tab to move backward. Press Enter or Space to activate whatever is focused.',
      'Most screen readers have a headings shortcut (for example, "H" in NVDA and JAWS, or the rotor in VoiceOver) to jump between the major sections of a page instead of reading everything in order.',
    ],
  },
  {
    title: '2. Using the accessibility settings',
    body: [
      'The accessibility icon (a wheelchair symbol) in the top navigation bar opens the Settings page.',
      'Light Mode switches to a light background instead of the default dark theme, using the same trick as your browser or system’s built-in invert-colors feature. It’s a toggle: turn it on or off, and the choice is remembered the next time you visit.',
      'High Contrast Mode brightens dim text and faint borders across the site, and Dyslexia-Friendly Font switches body text to Lexend, a typeface studied for reading proficiency. Both are on for everyone by default now, site-wide, with no off switch — not preferences to opt into.',
      'Every setting applies immediately, with no page reload.',
    ],
  },
  {
    title: '3. Searching',
    body: [
      'The Glossary page has a search box and a category filter for looking up a specific AI term instead of scrolling the full list.',
      'The AI Tools page has filters for tool category and cost, for narrowing down which tool you’re looking at.',
      'Type into a search box and results filter as you type; no need to press Enter.',
    ],
  },
  {
    title: '4. Language options',
    body: [
      'English, Spanish, Chinese, and Hindi are available in the Settings page.',
      'Choosing a language updates the main navigation and the homepage headline. Course content itself (articles, quizzes, challenges) stays in English for now, since translating that accurately is a bigger job than one hand-authored dictionary can responsibly cover.',
    ],
  },
  {
    title: '5. Still stuck?',
    body: [
      'If something on this site doesn’t work with a screen reader or keyboard-only navigation, start with the Settings page: Light Mode or High Contrast Mode resolves most low-visibility issues, and every interactive element on this site is a real, focusable button or link rather than a div pretending to be one.',
    ],
  },
];

export default function AccessibilityGuide() {
  return (
    <section className="px-6 sm:px-8 md:px-12 pt-28 md:pt-36 pb-24 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/settings"
          className="inline-flex items-center gap-1.5 text-white/50 hover:text-white text-xs mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Accessibility settings
        </Link>

        <p className="text-sky-400 text-xs tracking-widest uppercase mb-3">Guide</p>
        <h1 className="text-white text-3xl sm:text-4xl font-light leading-tight tracking-tight">
          Screen reader & keyboard navigation guide
        </h1>
        <p className="text-white/50 text-sm mt-4 max-w-xl font-light">
          How to use Neuron with a screen reader and keyboard-only navigation. Written for JAWS, NVDA, VoiceOver, and
          TalkBack users, but most of this applies to any modern screen reader.
        </p>

        <div className="mt-10 flex flex-col gap-10">
          {SECTIONS.map((section) => (
            <div key={section.title} className="pt-8 border-t border-white/10 first:pt-0 first:border-t-0">
              <h2 className="text-white text-lg font-normal mb-3">{section.title}</h2>
              <ul className="flex flex-col gap-2.5 text-white/60 text-sm font-light leading-relaxed">
                {section.body.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
