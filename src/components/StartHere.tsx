import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

// "Start here" block (brief P2-3): a judge with a rubric must find the three
// required modules and the progress system within ten seconds of landing.
// Three explicit cards — AI Fundamentals · Practical AI Tools · Ethical AI
// Use — each with a live progress ring, directly above the "how it works"
// showcase. Everything else on the home page is bonus and reads as bonus.
const CORE_MODULES = [
  {
    id: 'fundamentals',
    title: 'AI Fundamentals',
    blurb: 'What AI is, how it learns, and why it sometimes makes things up.',
  },
  {
    id: 'tools',
    title: 'Practical AI Tools',
    blurb: 'Prompting, study workflows, and verifying output before you trust it.',
  },
  {
    id: 'ethics',
    title: 'Ethical AI Use',
    blurb: 'Bias, academic integrity, privacy, and responsible habits.',
  },
];

function Ring({ percent }: { percent: number }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" role="img" aria-label={`${Math.round(percent)} percent complete`}>
      <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
      <circle
        cx="24"
        cy="24"
        r={r}
        fill="none"
        stroke="#38bdf8"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - Math.min(1, Math.max(0, percent / 100)))}
        transform="rotate(-90 24 24)"
      />
    </svg>
  );
}

export default function StartHere() {
  const { moduleProgress } = useProgress();
  return (
    <section aria-labelledby="start-here-heading" className="px-6 sm:px-8 md:px-12 py-20 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <p className="text-sky-400 text-xs tracking-widest uppercase mb-3">Start here</p>
        <h2 id="start-here-heading" className="text-white text-2xl sm:text-3xl font-light tracking-tight max-w-lg">
          Three modules. Five steps each. One progress ring per module.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
          {CORE_MODULES.map((m, i) => {
            const p = moduleProgress[m.id];
            const pct = p?.percent ?? 0;
            return (
              <Link
                key={m.id}
                to={`/modules/${m.id}`}
                className="rounded-2xl liquid-glass p-5 flex gap-4 items-start hover:border-sky-400/30 transition-colors group"
                aria-label={`${m.title}, ${Math.round(pct)} percent complete. Start module ${i + 1} of 3.`}
              >
                <Ring percent={pct} />
                <div className="min-w-0">
                  <p className="text-white/40 text-[11px] uppercase tracking-widest mb-1">Module {i + 1} of 3</p>
                  <p className="text-white text-base font-normal group-hover:text-sky-200 transition-colors">
                    {m.title}
                  </p>
                  <p className="text-white/50 text-xs font-light mt-1 leading-relaxed">{m.blurb}</p>
                  <p className="text-sky-400/80 text-xs mt-3 inline-flex items-center gap-1">
                    {pct >= 100 ? 'Completed — review' : pct > 0 ? 'Continue' : 'Start'}{' '}
                    <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
