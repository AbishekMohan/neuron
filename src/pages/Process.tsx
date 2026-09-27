import { Link } from 'react-router-dom';

// Interview-prep "Process" page (brief P2-4). Semifinalist interviews are
// 5–10 minutes on web design methods, practices, and research — this page is
// the study guide, and it doubles as professionalism signal for any judge
// who finds it in the footer. Every claim here must stay true; update the
// performance numbers after each Lighthouse run.
const SECTIONS = [
  {
    heading: 'Design system',
    body: 'One dark palette (near-black #000 base, sky-blue #38bdf8 accent) so the 3D hero reads as the "special" moment and every other page recedes. Inter Tight for UI chrome and headings, Newsreader serif for long-form article body — reading sections feel like reading, chrome feels like software. Both self-hosted as latin-subset woff2 with font-display: swap (OFL-1.1, see /copyright). Motion policy: ambient animation only (drifting code, pixel snow, bloom); everything pauses under prefers-reduced-motion, and the 3D brain never mounts at all for those visitors.',
  },
  {
    heading: 'Information architecture',
    body: 'Three required modules are the spine — AI Fundamentals, Practical AI Tools, Ethical AI Use — each with five steps (article → flashcards → video → mini-game → quiz). Everything else (duels, royale, concept map, companion, teacher view) is framed as bonus depth, not parallel navigation: the home page "Start here" block and the /modules overview both name the three modules explicitly with live progress rings, so a judge with a rubric finds them in under ten seconds.',
  },
  {
    heading: 'Accessibility: what it cost',
    body: 'Skip link + route-focus + polite live-region announcer in App.tsx; visible :focus-visible ring restored after Tailwind\'s reset; decorative canvases and SVGs carry aria-hidden while every mini-game is keyboard completable (Royale has explicit lane-deploy buttons as the no-aim path; Concept Map exposes aria-pressed + a live link count). Cost: roughly one extra day of work and zero visual change for pointer users — the point we make in interviews is that accessibility plumbing is invisible when it works.',
  },
  {
    heading: 'Content-sourcing method',
    body: 'Every factual claim in src/data/modules.ts carries a sourceId into src/data/sources.ts — a real bibliography (NIST, U.S. Copyright Office, peer-reviewed papers, AI4K12), not decorative links. Each article section surfaces its citation inline with a link to /reference. On an AI-literacy site about not trusting AI output, showing our own work is the thesis. All prose is student-written during the 2026–27 school year; the assistant edge function coaches with guiding questions and refuses to produce submittable answers.',
  },
  {
    heading: 'Tech stack and why',
    body: 'React 19 + TypeScript + Vite 8 (component model we wrote by hand — Vite is a bundler, not a site builder), Tailwind 3 for utility styling, React Router 7 for separate pages, Supabase for auth/progress/leaderboard (Row Level Security on every table), Groq via a Supabase edge function so the API key never reaches the browser, Three.js + framer-motion isolated into their own lazy chunks. Routes are code-split with React.lazy; the three.js ecosystem never loads on first paint of non-3D pages.',
  },
  {
    heading: 'Performance, measured',
    body: '114 MB of committed MP4 purged from the repo (videos now compressed/embedded with preload="none" + posters); manualChunks splits the three.js ecosystem (968 KB raw, 257 KB gzip — loaded only when a 3D component mounts) and framer-motion (135 KB raw, 44 KB gzip) out of the main bundle (443 KB raw, 142 KB gzip). Home first-load JS ≈ 195 KB gzip, under the 300 KB budget. All 24 routes lazy with a skeleton fallback; 14 key routes prerendered at build time (scripts/prerender.cjs) with per-route titles, canonicals, and noscript snapshots. Target: Lighthouse mobile Performance ≥ 90, Accessibility ≥ 95. Record each Lighthouse run here before submission — judges ask for numbers, not adjectives.',
  },
  {
    heading: "What we'd do next",
    body: 'Server-side prerender of the ten key routes so crawlers and no-JS browsers get real HTML; prompt A/B playground (two prompts side by side against the model) as the practical-tools capstone; print stylesheets for /reference and /work-log; full axe-core sweep to zero serious violations.',
  },
];

export default function Process() {
  return (
    <section className="px-6 sm:px-8 md:px-12 pt-28 md:pt-36 pb-24 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <p className="text-sky-400 text-xs tracking-widest uppercase mb-3">How this site was built</p>
        <h1 className="text-white text-3xl sm:text-4xl font-light leading-tight tracking-tight">
          Design Process
        </h1>
        <p className="text-white/50 text-sm mt-4 max-w-xl font-light leading-relaxed">
          Methods, decisions, and trade-offs behind Neuron — written as the study guide
          for the semifinalist interview on web design methods and research.
        </p>

        <div className="mt-10 flex flex-col gap-10">
          {SECTIONS.map((s) => (
            <div key={s.heading} className="border-t border-white/10 pt-6">
              <h2 className="text-white text-lg font-normal mb-2">{s.heading}</h2>
              <p className="text-white/60 text-sm font-light leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-4 text-sm">
          <Link to="/work-log" className="text-sky-400 hover:text-sky-300 transition-colors">
            Student Work Log →
          </Link>
          <Link to="/copyright" className="text-sky-400 hover:text-sky-300 transition-colors">
            Copyright Checklist →
          </Link>
          <Link to="/reference" className="text-sky-400 hover:text-sky-300 transition-colors">
            Sources & References →
          </Link>
        </div>
      </div>
    </section>
  );
}
