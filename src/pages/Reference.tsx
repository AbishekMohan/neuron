import { FileText, AlertTriangle } from 'lucide-react';
import { SOURCE_GROUPS } from '../data/sources';

const LIBRARIES = [
  { label: 'React', detail: 'UI library used to build the site.', url: 'https://react.dev' },
  { label: 'React Router', detail: 'Client-side routing between pages.', url: 'https://reactrouter.com' },
  { label: 'Tailwind CSS', detail: 'Utility-first CSS framework used for styling.', url: 'https://tailwindcss.com' },
  { label: 'Framer Motion', detail: 'Animation library used for transitions and interactive UI.', url: 'https://www.framer.com/motion/' },
  { label: 'lucide-react', detail: 'Open-source icon set used throughout the site.', url: 'https://lucide.dev' },
  {
    label: 'three.js / react-three-fiber / drei / postprocessing',
    detail: 'Used to build the procedurally generated 3D brain visualization and 3D badge models.',
    url: 'https://threejs.org',
  },
  {
    label: 'ParticleText (React Bits)',
    detail: 'Open-source canvas particle-text component, adapted to TypeScript, used in the hero.',
    url: 'https://reactbits.dev',
  },
  { label: 'Supabase', detail: 'Backend used for authentication, progress sync, profiles, and the leaderboard.', url: 'https://supabase.com' },
  {
    label: '"Helvetica Neue Light" web font',
    detail: 'Font stylesheet loaded from onlinewebfonts.com.',
    url: 'https://db.onlinewebfonts.com',
  },
];

export default function Reference() {
  return (
    <section className="px-6 sm:px-8 md:px-12 pt-28 md:pt-36 pb-24 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <p className="text-sky-400 text-xs tracking-widest uppercase mb-3">Reference Page</p>
        <h1 className="text-white text-3xl sm:text-4xl font-light leading-tight tracking-tight">
          Sources & required forms
        </h1>
        <p className="text-white/50 text-sm mt-4 max-w-xl font-light">
          Every factual claim in this course's articles, flashcards, mini-games, and quizzes is grounded in a
          specific, cited source below, not generated without verification. All code, design, and educational
          writing on this site was created by our team, with the exception of the open-source libraries and web
          font listed at the bottom of this page.
        </p>

        <div className="mt-10 rounded-2xl liquid-glass p-6">
          <h2 className="text-white text-base font-normal mb-1">Course content bibliography</h2>
          <p className="text-white/40 text-xs font-light mb-6">
            Grouped by module. Each entry links to the primary source: a government agency, standards body,
            peer-reviewed paper, or established educational nonprofit.
          </p>
          <div className="flex flex-col gap-8">
            {SOURCE_GROUPS.map((group) => (
              <div key={group.module}>
                <h3 className="text-sky-300/80 text-xs uppercase tracking-widest mb-3">{group.module}</h3>
                <ul className="flex flex-col gap-3">
                  {group.sources.map((source) => (
                    <li key={source.id}>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white text-sm hover:text-sky-300 transition-colors"
                      >
                        {source.title}
                      </a>
                      <p className="text-white/40 text-xs mt-0.5">
                        {source.publisher} · {source.year}
                      </p>
                      {source.note && <p className="text-white/35 text-xs mt-1 font-light leading-relaxed">{source.note}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-2xl liquid-glass p-6">
          <h2 className="text-white text-base font-normal mb-5">Open-source libraries & assets used</h2>
          <ul className="flex flex-col gap-4">
            {LIBRARIES.map((source) => (
              <li key={source.label} className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-300 text-sm hover:text-sky-200 transition-colors shrink-0"
                >
                  {source.label}
                </a>
                <span className="text-white/50 text-sm font-light">: {source.detail}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 rounded-2xl liquid-glass p-6">
          <h2 className="text-white text-base font-normal mb-3">How we built this</h2>
          <div className="flex flex-col gap-4 text-white/60 text-sm font-light leading-relaxed">
            <p>
              The course content (articles, flashcards, mini-game cards, and quizzes) was researched and written
              first, against the sources listed above. The site was built around that content, not the other way
              around.
            </p>
            <p>
              <span className="text-white/80">Progress, XP, and levels</span> are computed live from which lesson
              steps a student has completed, stored locally and synced to Supabase when signed in. Every number
              shown (XP, module percent, quiz history) is derived from that one source of truth rather than tracked
              separately in multiple places.
            </p>
            <p>
              <span className="text-white/80">Train Your Companion</span> is a real client-side classifier, not a
              scripted animation: labeling an example runs one step of a bag-of-words perceptron (
              <code className="text-white/70">src/lib/companion.ts</code>), and its "mastery" tier is scored against
              a held-out test set the student never labels. So accuracy, and therefore mastery, can go down if
              fed deliberately bad labels. The capstone's "reference model" is the same algorithm trained on the
              same examples with correct labels, computed on the fly rather than hand-authored.
            </p>
            <p>
              <span className="text-white/80">Badges</span> are 9 (soon more) procedurally generated 3D shapes built
              from Three.js primitives. No image assets. So every badge is code, not art.
            </p>
            <p>
              <span className="text-white/80">The homework assistant</span> proxies to Groq's chat completion API
              through a Supabase Edge Function, so the API key never reaches the browser. It's honest about being
              text-in, spoken-out (browser text-to-speech) rather than a real conversational voice pipeline. There's
              no way to sample that speech's actual audio in-browser, so the assistant orb's "reactive" pulsing while
              it talks is timed to real word-boundary events, not fabricated.
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl liquid-glass p-6">
          <h2 className="text-white text-base font-normal mb-3">Framework & template statement</h2>
          <p className="text-white/60 text-sm font-light leading-relaxed">
            This website was built from scratch by our team using React, TypeScript, and Tailwind CSS.
            No pre-built website template or theme was used. All layout, components, and visual design
            were created by the team specifically for this project.
          </p>
        </div>

        <div className="mt-5 rounded-2xl liquid-glass p-6 border border-amber-400/20">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <h2 className="text-white text-base font-normal">Required forms</h2>
          </div>
          <p className="text-white/50 text-xs font-light leading-relaxed mb-5">
            Per competition rules, this page must link to a completed Student Copyright Checklist and
            Work Log, submitted as PDFs. These are team- and event-specific documents that need to be
            filled out and signed by your team before submission. Add the real, completed files here.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href="#"
              className="flex items-center gap-3 rounded-xl border border-dashed border-white/20 px-4 py-3 text-white/40 text-sm hover:border-white/30 hover:text-white/60 transition-colors"
            >
              <FileText className="w-4 h-4 shrink-0" />
              Student Copyright Checklist (PDF): add link before submission
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-xl border border-dashed border-white/20 px-4 py-3 text-white/40 text-sm hover:border-white/30 hover:text-white/60 transition-colors"
            >
              <FileText className="w-4 h-4 shrink-0" />
              Work Log (PDF): add link before submission
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
