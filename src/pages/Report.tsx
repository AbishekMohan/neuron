import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FileDown } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { TRAINING_CATEGORIES } from '../data/training';
import { COMPANION_UPDATED_EVENT, evaluateAccuracy, loadCompanionState } from '../lib/companion';

// Five axes, each backed by data the site already genuinely computes.
// No metric here is invented for the report. A radar/spider chart was
// the original spec's suggestion, but that form distorts magnitude
// comparison across axes (area and angle both mislead); a labeled
// horizontal bar chart shows the same "more than one flat score" story
// while staying precisely readable. See the dataviz skill's
// choosing-a-form guidance.
type ReportRow = { label: string; percent: number; detail: string };

export default function Report() {
  const { moduleProgress, quizAttempts } = useProgress();

  const [companionVersion, setCompanionVersion] = useState(0);
  useEffect(() => {
    const bump = () => setCompanionVersion((v) => v + 1);
    window.addEventListener(COMPANION_UPDATED_EVENT, bump);
    window.addEventListener('storage', bump);
    return () => {
      window.removeEventListener(COMPANION_UPDATED_EVENT, bump);
      window.removeEventListener('storage', bump);
    };
  }, []);

  const rows = useMemo<ReportRow[]>(() => {
    const modulePercents = Object.values(moduleProgress).map((m) => m.percent);
    const courseProgress = modulePercents.length
      ? modulePercents.reduce((a, b) => a + b, 0) / modulePercents.length
      : 0;

    const quizList = Object.values(quizAttempts);
    const quizPerformance = quizList.length
      ? (quizList.reduce((sum, q) => sum + (q.total > 0 ? q.score / q.total : 0), 0) / quizList.length) * 100
      : 0;

    const companionRows = TRAINING_CATEGORIES.map((category) => {
      const state = loadCompanionState(category.id);
      const accuracy = state.labelsCount >= 5 ? evaluateAccuracy(state.weights, category) : 0;
      return {
        label: category.title,
        percent: Math.round(accuracy * 100),
        detail:
          state.labelsCount < 5
            ? 'Not enough training yet'
            : `${Math.round(accuracy * 100)}% held-out accuracy after ${state.labelsCount} labels`,
      };
    });

    return [
      { label: 'Course Progress', percent: Math.round(courseProgress), detail: `${Math.round(courseProgress)}% across all modules` },
      {
        label: 'Quiz Performance',
        percent: Math.round(quizPerformance),
        detail: quizList.length ? `Average across ${quizList.length} module quiz${quizList.length === 1 ? '' : 'zes'}` : 'No quizzes attempted yet',
      },
      ...companionRows,
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleProgress, quizAttempts, companionVersion]);

  const overall = rows.length ? Math.round(rows.reduce((a, b) => a + b.percent, 0) / rows.length) : 0;

  return (
    <section className="px-6 sm:px-8 md:px-12 pt-28 md:pt-36 pb-24 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <p className="text-sky-400 text-xs tracking-widest uppercase mb-3">Your AI Literacy Report</p>
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-light leading-tight tracking-tight">
          One score never tells the whole story
        </h1>
        <p className="text-white/50 text-sm mt-4 max-w-xl font-light">
          A breakdown across course progress, quiz retention, and how well your trained companions actually
          generalize. Not just how much you've clicked.
        </p>

        <div className="mt-10 rounded-2xl liquid-glass p-6">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Overall</p>
          <p className="text-white text-5xl font-light tracking-tight">{overall}%</p>
        </div>

        <div className="mt-5 rounded-2xl liquid-glass p-6">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-6">By category</p>
          <div className="flex flex-col gap-5">
            {rows.map((row) => (
              <div key={row.label}>
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-white text-sm">{row.label}</span>
                  <span className="text-white/60 text-sm tabular-nums">{row.percent}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-white/8 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-sky-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${row.percent}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
                <p className="text-white/30 text-[11px] mt-1.5">{row.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-2xl liquid-glass p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-white text-sm font-normal mb-1">Save this report</p>
            <p className="text-white/40 text-xs font-light">
              This data lives only in this browser (companion training never leaves your device), so there's no
              shareable link. Print to PDF to keep a copy.
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 text-sm bg-white text-black rounded-full px-4 py-2 hover:bg-white/90 transition-colors shrink-0"
          >
            <FileDown className="w-4 h-4" />
            Save as PDF
          </button>
        </div>
      </div>
    </section>
  );
}
