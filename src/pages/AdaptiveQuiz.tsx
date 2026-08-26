import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, RotateCcw, ArrowLeft, Gauge } from 'lucide-react';
import {
  ADAPTIVE_QUESTIONS,
  DIFFICULTY_ORDER,
  DIFFICULTY_LABELS,
  type Difficulty,
  type AdaptiveQuestion,
} from '../data/adaptiveQuiz';

const TOTAL_QUESTIONS = 6;

function pickNext(target: Difficulty, askedIds: Set<string>): AdaptiveQuestion | null {
  const order: Difficulty[] =
    target === 'easy' ? ['easy', 'medium', 'hard'] : target === 'medium' ? ['medium', 'easy', 'hard'] : ['hard', 'medium', 'easy'];
  for (const d of order) {
    const candidates = ADAPTIVE_QUESTIONS.filter((q) => q.difficulty === d && !askedIds.has(q.id));
    if (candidates.length > 0) return candidates[Math.floor(Math.random() * candidates.length)];
  }
  return null;
}

export default function AdaptiveQuiz() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [askedIds, setAskedIds] = useState<Set<string>>(new Set());
  const [current, setCurrent] = useState<AdaptiveQuestion | null>(() => pickNext('easy', new Set()));
  const [selected, setSelected] = useState<number | null>(null);
  const [history, setHistory] = useState<{ difficulty: Difficulty; correct: boolean }[]>([]);

  const done = history.length >= TOTAL_QUESTIONS || (!current && selected === null);
  const highestReached = useMemo(() => {
    let best: Difficulty = 'easy';
    for (const h of history) {
      if (DIFFICULTY_ORDER.indexOf(h.difficulty) > DIFFICULTY_ORDER.indexOf(best)) best = h.difficulty;
    }
    return best;
  }, [history]);

  const answer = (choiceIndex: number) => {
    if (!current || selected !== null) return;
    setSelected(choiceIndex);
    const correct = choiceIndex === current.correctIndex;
    setHistory((h) => [...h, { difficulty: current.difficulty, correct }]);

    const nextDifficulty: Difficulty = correct
      ? DIFFICULTY_ORDER[Math.min(DIFFICULTY_ORDER.indexOf(current.difficulty) + 1, 2)]
      : DIFFICULTY_ORDER[Math.max(DIFFICULTY_ORDER.indexOf(current.difficulty) - 1, 0)];
    setDifficulty(nextDifficulty);

    const nextAsked = new Set(askedIds);
    nextAsked.add(current.id);
    setAskedIds(nextAsked);

    window.setTimeout(() => {
      if (history.length + 1 >= TOTAL_QUESTIONS) {
        setCurrent(null);
        return;
      }
      setCurrent(pickNext(nextDifficulty, nextAsked));
      setSelected(null);
    }, 900);
  };

  const restart = () => {
    setDifficulty('easy');
    setAskedIds(new Set());
    setCurrent(pickNext('easy', new Set()));
    setSelected(null);
    setHistory([]);
  };

  if (done) {
    const correctCount = history.filter((h) => h.correct).length;
    return (
      <section className="px-6 sm:px-8 md:px-12 pt-28 md:pt-36 pb-24 min-h-screen">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sky-400 text-xs tracking-widest uppercase mb-3">Adaptive Challenge: complete</p>
          <p className="text-white text-5xl font-light tracking-tight mb-2">
            {correctCount}/{history.length}
          </p>
          <p className="text-white/50 text-sm font-light mb-8">
            Reached {DIFFICULTY_LABELS[highestReached]} difficulty.
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

  if (!current) return null;

  return (
    <section className="px-6 sm:px-8 md:px-12 pt-28 md:pt-36 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <p className="text-sky-400 text-xs tracking-widest uppercase mb-3">Adaptive Challenge</p>
        <h1 className="text-white text-3xl sm:text-4xl font-light leading-tight tracking-tight">
          Questions that keep pace with you
        </h1>
        <p className="text-white/50 text-sm mt-4 max-w-xl font-light">
          Answer correctly and it gets harder. Miss one and it eases up. {TOTAL_QUESTIONS} questions total.
        </p>

        <div className="mt-8 flex items-center gap-2">
          <Gauge className="w-4 h-4 text-white/30 shrink-0" />
          <div className="flex-1 flex gap-1.5">
            {DIFFICULTY_ORDER.map((d) => (
              <div key={d} className="flex-1">
                <div
                  className={`h-2 rounded-full transition-colors ${
                    DIFFICULTY_ORDER.indexOf(d) <= DIFFICULTY_ORDER.indexOf(difficulty) ? 'bg-sky-400' : 'bg-white/10'
                  }`}
                />
                <p className="text-center text-[10px] text-white/30 mt-1">{DIFFICULTY_LABELS[d]}</p>
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-6 pt-8 border-t border-white/10"
          >
            <p className="text-white/40 text-xs uppercase tracking-widest mb-1">
              Question {history.length + 1} of {TOTAL_QUESTIONS} · {DIFFICULTY_LABELS[current.difficulty]}
            </p>
            <p className="text-white text-base font-light leading-relaxed mt-3 mb-5">{current.question}</p>

            <div className="flex flex-col gap-2.5">
              {current.choices.map((choice, i) => {
                const isPicked = selected === i;
                const isCorrectChoice = selected !== null && i === current.correctIndex;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => answer(i)}
                    disabled={selected !== null}
                    className={`text-left rounded-xl border px-4 py-3 text-sm transition-colors flex items-center gap-2.5 ${
                      selected !== null
                        ? isCorrectChoice
                          ? 'border-sky-400/50 bg-sky-400/10 text-white'
                          : isPicked
                            ? 'border-white/15 bg-white/[0.03] text-white/40'
                            : 'border-white/10 text-white/30'
                        : 'border-white/15 text-white/80 hover:border-sky-400/40 hover:bg-sky-400/5'
                    }`}
                  >
                    {selected !== null && isCorrectChoice && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                    {selected !== null && isPicked && !isCorrectChoice && <XCircle className="w-4 h-4 shrink-0" />}
                    {choice}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
