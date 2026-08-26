import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, ArrowLeft, Search } from 'lucide-react';
import { DETECTIVE_SCENARIOS, BIAS_CAUSE_OPTIONS, type BiasCauseId } from '../data/challenges';

export default function BiasDetective() {
  const [index, setIndex] = useState(0);
  const [cause, setCause] = useState<BiasCauseId | null>(null);
  const [scores, setScores] = useState<boolean[]>([]);

  const scenario = DETECTIVE_SCENARIOS[index];
  const isLast = index === DETECTIVE_SCENARIOS.length - 1;
  const done = scores.length === DETECTIVE_SCENARIOS.length;
  const submitted = cause !== null;

  const pickCause = (c: BiasCauseId) => {
    if (submitted) return;
    setCause(c);
    setScores((prev) => [...prev, c === scenario.correctCause]);
  };

  const next = () => {
    setIndex((i) => i + 1);
    setCause(null);
  };

  const restart = () => {
    setIndex(0);
    setCause(null);
    setScores([]);
  };

  if (done) {
    const correct = scores.filter(Boolean).length;
    return (
      <section className="px-6 sm:px-8 md:px-12 pt-28 md:pt-36 pb-24 min-h-screen">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sky-400 text-xs tracking-widest uppercase mb-3">Bias Detective: complete</p>
          <p className="text-white text-5xl font-light tracking-tight mb-4">
            {correct}/{DETECTIVE_SCENARIOS.length}
          </p>
          <p className="text-white/50 text-sm font-light mb-8">Root causes correctly identified.</p>
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
      <div className="max-w-4xl mx-auto">
        <p className="text-sky-400 text-xs tracking-widest uppercase mb-3">Bias Detective</p>
        <h1 className="text-white text-3xl sm:text-4xl font-light leading-tight tracking-tight">
          Trace the bias to its root
        </h1>
        <p className="text-white/50 text-sm mt-4 max-w-xl font-light">
          Each AI output below sounds reasonable on its surface. Figure out what actually caused the bias. The
          same handful of root causes show up again and again in the real world.
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={scenario.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-8 rounded-2xl liquid-glass p-6"
          >
            <p className="text-white/40 text-xs uppercase tracking-widest mb-1">
              Case {index + 1} of {DETECTIVE_SCENARIOS.length}
            </p>
            <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-5 my-5">
              <Search className="w-4 h-4 text-sky-300 shrink-0 mt-0.5" />
              <p className="text-white text-sm font-light leading-relaxed">“{scenario.output}”</p>
            </div>

            <div className="flex flex-col gap-2.5">
              {BIAS_CAUSE_OPTIONS.map((opt) => {
                const isPicked = cause === opt.id;
                const isCorrectOption = submitted && opt.id === scenario.correctCause;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => pickCause(opt.id)}
                    disabled={submitted}
                    className={`text-left rounded-xl border px-4 py-3 text-sm font-light transition-colors flex items-start gap-2.5 ${
                      submitted
                        ? isCorrectOption
                          ? 'border-sky-400/50 bg-sky-400/10 text-white'
                          : isPicked
                            ? 'border-white/15 bg-white/[0.03] text-white/40'
                            : 'border-white/10 text-white/30'
                        : 'border-white/15 text-white/80 hover:border-sky-400/40 hover:bg-sky-400/5'
                    }`}
                  >
                    {submitted && isCorrectOption && <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />}
                    {submitted && isPicked && !isCorrectOption && <XCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>

            {submitted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] p-4"
              >
                <p className="text-white/40 text-xs uppercase tracking-widest mb-1.5">What actually happened</p>
                <p className="text-white/60 text-sm font-light leading-relaxed">{scenario.explanation}</p>
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
