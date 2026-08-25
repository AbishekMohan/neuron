import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, ArrowLeft } from 'lucide-react';
import { HUNT_SCENARIOS } from '../data/challenges';
import CarvisOrb from '../components/CarvisOrb';
import type { OrbState } from '../lib/carvisOrb';

export default function HallucinationHunt() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [scores, setScores] = useState<number[]>([]); // fraction correct per scenario, 0-1

  const scenario = HUNT_SCENARIOS[index];
  const isLast = index === HUNT_SCENARIOS.length - 1;
  const done = scores.length === HUNT_SCENARIOS.length;
  // The orb "says" the scenario's sentences until you check answers.
  // Speaking while it's live, settling once you've caught (or missed)
  // what's wrong.
  const orbState: OrbState = submitted ? 'idle' : 'speaking';

  const toggle = (i: number) => {
    if (submitted) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const submit = () => {
    const correct = scenario.sentences.filter((s, i) => s.isError === selected.has(i)).length;
    setScores((prev) => [...prev, correct / scenario.sentences.length]);
    setSubmitted(true);
  };

  const next = () => {
    setIndex((i) => i + 1);
    setSelected(new Set());
    setSubmitted(false);
  };

  const restart = () => {
    setIndex(0);
    setSelected(new Set());
    setSubmitted(false);
    setScores([]);
  };

  if (done) {
    const avgPercent = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100);
    return (
      <section className="px-6 sm:px-8 md:px-12 pt-28 md:pt-36 pb-24 min-h-screen">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sky-400 text-xs tracking-widest uppercase mb-3">Hallucination Hunt: complete</p>
          <p className="text-white text-5xl font-light tracking-tight mb-4">{avgPercent}%</p>
          <p className="text-white/50 text-sm font-light mb-8">
            Average across {HUNT_SCENARIOS.length} scenarios. Correctly flagged errors and correctly left-alone
            true statements both counted.
          </p>
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
        <p className="text-sky-400 text-xs tracking-widest uppercase mb-3">Hallucination Hunt</p>
        <h1 className="text-white text-3xl sm:text-4xl font-light leading-tight tracking-tight">
          Spot the fabricated claims
        </h1>
        <p className="text-white/50 text-sm mt-4 max-w-xl font-light">
          Click every sentence you believe is factually wrong. Not everything is. Leaving a true sentence
          unclicked matters just as much as catching a false one.
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
              Scenario {index + 1} of {HUNT_SCENARIOS.length}
            </p>

            <div className="flex items-start gap-3 mb-5">
              <div className="relative w-11 h-11 shrink-0 rounded-full overflow-hidden bg-neuron/40 ring-1 ring-sky-400/20 mt-0.5">
                <CarvisOrb state={orbState} />
              </div>
              <div className="flex-1 rounded-2xl rounded-tl-sm bg-white/[0.04] px-4 py-3">
                <p className="text-white/60 text-sm font-light">{scenario.prompt}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              {scenario.sentences.map((s, i) => {
                const isSelected = selected.has(i);
                const showResult = submitted;
                const wasRight = showResult && s.isError === isSelected;

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggle(i)}
                    disabled={submitted}
                    className={`text-left rounded-xl border px-4 py-3 text-sm font-light leading-relaxed transition-colors ${
                      showResult
                        ? wasRight
                          ? 'border-sky-400/40 bg-sky-400/10 text-white'
                          : 'border-white/10 bg-white/[0.02] text-white/40'
                        : isSelected
                          ? 'border-sky-400/40 bg-sky-400/10 text-white'
                          : 'border-white/10 bg-white/[0.02] text-white/70 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {showResult && (
                        <span className="shrink-0 mt-0.5">
                          {wasRight ? (
                            <CheckCircle2 className="w-4 h-4 text-sky-300" />
                          ) : (
                            <XCircle className="w-4 h-4 text-white/25" />
                          )}
                        </span>
                      )}
                      <span>
                        {s.text}
                        {showResult && s.isError && (
                          <span className="block text-white/40 text-xs mt-1.5">{s.explanation}</span>
                        )}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end">
              {!submitted ? (
                <button
                  type="button"
                  onClick={submit}
                  className="inline-flex items-center gap-2 bg-white text-black text-sm font-medium rounded-full px-5 py-2.5 hover:bg-white/90 transition-colors"
                >
                  Catch it yourself
                </button>
              ) : (
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex items-center gap-2 bg-white text-black text-sm font-medium rounded-full px-5 py-2.5 hover:bg-white/90 transition-colors"
                >
                  {isLast ? 'See results' : 'Next scenario'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
