import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Gavel, ShieldAlert, ArrowRight, Bug, Share2, BookOpen, Gauge, Swords, XCircle } from 'lucide-react';
import {
  HUNT_SCENARIOS,
  COURTROOM_SCENARIOS,
  DETECTIVE_SCENARIOS,
  DEBUG_SCENARIOS,
} from '../data/challenges';
import { CONCEPT_EDGES } from '../data/conceptMap';
import { ADAPTIVE_QUESTIONS } from '../data/adaptiveQuiz';
import CarvisOrb from '../components/CarvisOrb';
import type { OrbState } from '../lib/carvisOrb';

// Reuses real, already fact-checked-false lines from Hallucination Hunt's
// own content rather than inventing new "wrong facts" just for this demo
//. One honesty surface less to maintain.
const DEMO_LINES = HUNT_SCENARIOS.flatMap((s) => s.sentences.filter((sen) => sen.isError));

const CHALLENGES = [
  {
    to: '/challenges/hallucination-hunt',
    Icon: ShieldAlert,
    title: 'Hallucination Hunt',
    description: 'Spot the fabricated claims planted inside a fake AI answer.',
    count: `${HUNT_SCENARIOS.length} scenarios`,
  },
  {
    to: '/challenges/ethics-courtroom',
    Icon: Gavel,
    title: 'Ethics Courtroom',
    description: 'Read a scenario, pick a verdict, compare it against the rubric.',
    count: `${COURTROOM_SCENARIOS.length} cases`,
  },
  {
    to: '/challenges/bias-detective',
    Icon: Search,
    title: 'Bias Detective',
    description: 'Trace a sanitized-sounding AI output back to its actual root cause.',
    count: `${DETECTIVE_SCENARIOS.length} cases`,
  },
  {
    to: '/challenges/debug-the-ai',
    Icon: Bug,
    title: 'Debug the AI',
    description: 'A pipeline broke somewhere. Prompt, data, generation, or interpretation. Find it.',
    count: `${DEBUG_SCENARIOS.length} cases`,
  },
  {
    to: '/challenges/concept-map',
    Icon: Share2,
    title: 'Concept Map Builder',
    description: 'Connect AI terms into the relationships that actually hold between them.',
    count: `${CONCEPT_EDGES.length} links`,
  },
  {
    to: '/challenges/ethics-story',
    Icon: BookOpen,
    title: 'Ethics Story: The Deadline',
    description: 'A choose-your-own-adventure. Some endings are a lot worse than others.',
    count: 'branching',
  },
  {
    to: '/challenges/adaptive',
    Icon: Gauge,
    title: 'Adaptive Challenge',
    description: "Questions that get harder when you're right, easier when you're not.",
    count: `${ADAPTIVE_QUESTIONS.length} questions`,
  },
  {
    to: '/challenges/duel',
    Icon: Swords,
    title: 'Duel Mode',
    description: 'Race a classmate live through the same Ethics Courtroom cases.',
    count: 'multiplayer',
  },
];

// A small demo, not a real interaction: a companion at full visual
// "mastered" quality still delivers a confidently wrong line, on a loop.
// The point is literal. Mastery makes a companion sharp and capable, it
// doesn't make it infallible, which is exactly what Hallucination Hunt is
// about. Cycles: idle -> thinking -> "says" a false line -> reveals it's
// wrong -> idle.
function HallucinationDemo() {
  const [lineIndex, setLineIndex] = useState(0);
  const [phase, setPhase] = useState<'thinking' | 'saying' | 'revealed'>('thinking');
  const line = DEMO_LINES[lineIndex % DEMO_LINES.length];

  useEffect(() => {
    const timers: number[] = [];
    setPhase('thinking');
    timers.push(window.setTimeout(() => setPhase('saying'), 1100));
    timers.push(window.setTimeout(() => setPhase('revealed'), 3200));
    timers.push(
      window.setTimeout(() => {
        setLineIndex((i) => i + 1);
      }, 6200),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [lineIndex]);

  const orbState: OrbState = phase === 'thinking' ? 'thinking' : phase === 'saying' ? 'speaking' : 'idle';

  return (
    <div className="border-t border-b border-white/10 py-8 flex flex-col sm:flex-row items-center gap-6">
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0">
        <CarvisOrb state={orbState} quality={1} />
      </div>
      <div className="flex-1 min-w-0 text-center sm:text-left">
        <p className="text-white/30 text-[10px] uppercase tracking-widest mb-2">
          A fully-mastered companion, talking right now
        </p>
        <div className="min-h-[3.5rem] flex items-center justify-center sm:justify-start">
          <AnimatePresence mode="wait">
            <motion.p
              key={lineIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="text-white text-base sm:text-lg font-light leading-snug"
            >
              “{line.text}”
            </motion.p>
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {phase === 'revealed' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-center sm:justify-start gap-2 mt-3 text-sm text-white/50"
            >
              <XCircle className="w-4 h-4 text-white/30 shrink-0" />
              <span>
                That's confidently wrong. Even at full mastery. <span className="text-white/70">That's the whole point.</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Link
        to="/challenges/hallucination-hunt"
        className="shrink-0 inline-flex items-center gap-2 bg-white text-black text-sm font-medium rounded-full px-5 py-2.5 hover:bg-white/90 transition-colors whitespace-nowrap"
      >
        Catch it yourself
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

export default function Challenges() {
  return (
    <section className="px-6 sm:px-8 md:px-12 pt-28 md:pt-36 pb-24 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <p className="text-sky-400 text-xs tracking-widest uppercase mb-3">Challenges</p>
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-light leading-tight tracking-tight">
          Short, sharp AI-literacy drills
        </h1>
        <p className="text-white/50 text-sm mt-4 max-w-xl font-light">
          Each one takes a few minutes. Unlike the module quizzes, these are about judgment, not recall.
        </p>

        <div className="mt-8">
          <HallucinationDemo />
        </div>

        <div className="mt-8 border-t border-white/10">
          {CHALLENGES.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="group flex items-center gap-4 px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors"
            >
              <c.Icon className="w-4 h-4 text-sky-300 shrink-0" strokeWidth={1.5} />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm group-hover:text-white transition-colors">{c.title}</p>
                <p className="text-white/30 text-xs font-light mt-0.5 truncate">{c.description}</p>
              </div>
              <span className="hidden sm:block text-white/25 text-xs shrink-0">{c.count}</span>
              <ArrowRight className="w-3.5 h-3.5 text-white/25 group-hover:text-sky-300 group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
