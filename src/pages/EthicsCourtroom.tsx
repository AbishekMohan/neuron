import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, ArrowLeft, Gavel } from 'lucide-react';
import { COURTROOM_SCENARIOS, VERDICT_OPTIONS, type VerdictId } from '../data/challenges';

export default function EthicsCourtroom() {
  const [index, setIndex] = useState(0);
  const [verdict, setVerdict] = useState<VerdictId | null>(null);
  const [scores, setScores] = useState<boolean[]>([]);

  const scenario = COURTROOM_SCENARIOS[index];
  const isLast = index === COURTROOM_SCENARIOS.length - 1;
  const done = scores.length === COURTROOM_SCENARIOS.length;
  const submitted = verdict !== null;

  const pickVerdict = (v: VerdictId) => {
    if (submitted) return;
    setVerdict(v);
    setScores((prev) => [...prev, v === scenario.correctVerdict]);
  };

  const next = () => {
    setIndex((i) => i + 1);
    setVerdict(null);
  };

  const restart = () => {
    setIndex(0);
    setVerdict(null);
    setScores([]);
  };

  if (done) {
    const correct = scores.filter(Boolean).length;
    return (
      <section className="px-6 sm:px-8 md:px-12 pt-28 md:pt-36 pb-24 min-h-screen">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sky-400 text-xs tracking-widest uppercase mb-3">Ethics Courtroom: complete</p>
          <p className="text-white text-5xl font-light tracking-tight mb-4">
            {correct}/{COURTROOM_SCENARIOS.length}
          </p>
          <p className="text-white/50 text-sm font-light mb-8">Verdicts matching the course's rubric.</p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={restart}
              className="inline-flex items-center gap-2 bg-white text-black text-sm font-medium rounded-full px-5 py-2.5 hover:bg-white/90 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Try again
            </button>
            <Link
              to="/challenges"
              className="inline-flex items-center gap-2 border border-white/15 text-white/70 text-sm rounded-full px-5 py-2.5 hover:border-white/30 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              More challenges
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 sm:px-8 md:px-12 pt-28 md:pt-36 pb-24 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <p className="text-sky-400 text-xs tracking-widest uppercase mb-3">Ethics Courtroom</p>
        <h1 className="text-white text-3xl sm:text-4xl font-light leading-tight tracking-tight">
          You be the judge
        </h1>
        <p className="text-white/50 text-sm mt-4 max-w-xl font-light">
          Read the scenario, pick a verdict, then see how it compares to the course's rubric.
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={scenario.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-8 pt-8 border-t border-white/10"
          >
            <p className="text-white/40 text-xs uppercase tracking-widest mb-1">
              Case {index + 1} of {COURTROOM_SCENARIOS.length}
            </p>
            <div className="flex items-start gap-3 py-5 my-5 border-y border-white/10">
              <Gavel className="w-4 h-4 text-sky-300 shrink-0 mt-0.5" />
              <p className="text-white text-sm font-light leading-relaxed">{scenario.scenario}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {VERDICT_OPTIONS.map((opt) => {
                const isPicked = verdict === opt.id;
                const isCorrectOption = submitted && opt.id === scenario.correctVerdict;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => pickVerdict(opt.id)}
                    disabled={submitted}
                    className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                      submitted
                        ? isCorrectOption
                          ? 'border-sky-400/50 bg-sky-400/10 text-white'
                          : isPicked
                            ? 'border-white/15 bg-white/[0.03] text-white/40'
                            : 'border-white/10 text-white/30'
                        : 'border-white/15 text-white/80 hover:border-sky-400/40 hover:bg-sky-400/5'
                    }`}
                  >
                    {submitted && isCorrectOption && <CheckCircle2 className="w-4 h-4" />}
                    {submitted && isPicked && !isCorrectOption && <XCircle className="w-4 h-4" />}
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {submitted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-5 pt-4 border-t border-white/10"
              >
                <p className="text-white/40 text-xs uppercase tracking-widest mb-1.5">Rubric</p>
                <p className="text-white/60 text-sm font-light leading-relaxed">{scenario.rubric}</p>
              </motion.div>
            )}

            {submitted && (
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex items-center gap-2 bg-white text-black text-sm font-medium rounded-full px-5 py-2.5 hover:bg-white/90 transition-colors"
                >
                  {isLast ? 'See results' : 'Next case'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
