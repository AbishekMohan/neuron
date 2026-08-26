import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Circle, Flame, ArrowRight } from 'lucide-react';
import type { GameCard } from '../../data/modules';
import { getSource } from '../../data/sources';

type GameStepProps = {
  prompt: string;
  buckets: string[];
  cards: GameCard[];
  complete: boolean;
  onComplete: () => void;
};

export default function GameStep({ prompt, buckets, cards, complete, onComplete }: GameStepProps) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [finished, setFinished] = useState(false);

  const card = cards[index];
  const isLast = index === cards.length - 1;
  const source = card?.sourceId ? getSource(card.sourceId) : undefined;

  const handleAnswer = (bucket: string) => {
    if (answer !== null) return;
    setAnswer(bucket);
    const correct = bucket === card.bucket;
    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const next = s + 1;
        setBestStreak((b) => Math.max(b, next));
        return next;
      });
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (isLast) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setAnswer(null);
  };

  const handleRestart = () => {
    setIndex(0);
    setAnswer(null);
    setScore(0);
    setStreak(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="max-w-xl">
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Round complete</p>
          <p className="text-white text-3xl font-light mb-1">
            {score}/{cards.length}
          </p>
          <p className="text-white/50 text-sm mb-6">Best streak: {bestStreak}</p>

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleRestart}
              className="text-sm px-5 py-2.5 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-colors"
            >
              Play again
            </button>
            <button
              type="button"
              onClick={onComplete}
              disabled={complete}
              className={`inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full transition-colors ${
                complete
                  ? 'bg-sky-400/10 border border-sky-400/40 text-sky-300 cursor-default'
                  : 'bg-white text-black hover:bg-white/90'
              }`}
            >
              {complete ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
              {complete ? 'Mini-game complete' : 'Finish mini-game'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <div className="flex items-center justify-between mb-4">
        <p className="text-white/40 text-xs">
          Card {index + 1} of {cards.length}
        </p>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-white/40">Score: {score}</span>
          {streak > 1 && (
            <span className="inline-flex items-center gap-1 text-amber-300/80">
              <Flame className="w-3.5 h-3.5" />
              {streak}
            </span>
          )}
        </div>
      </div>

      <p className="text-white/60 text-sm font-light mb-5">{prompt}</p>

      <AnimatePresence mode="wait">
        <motion.div
          key={card.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2 }}
          className="border-t border-white/10 pt-6"
        >
          <p className="text-white text-base font-normal leading-relaxed mb-6">{card.text}</p>

          <div className="grid grid-cols-2 gap-2">
            {buckets.map((bucket) => {
              const isCorrectBucket = bucket === card.bucket;
              const isChosen = answer === bucket;
              const showState = answer !== null;

              return (
                <button
                  key={bucket}
                  type="button"
                  onClick={() => handleAnswer(bucket)}
                  disabled={showState}
                  className={`text-sm px-4 py-2.5 rounded-lg border transition-colors flex items-center justify-center gap-2 text-center ${
                    showState && isCorrectBucket
                      ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200'
                      : showState && isChosen
                        ? 'border-red-400/40 bg-red-400/10 text-red-200'
                        : 'border-white/10 text-white/70 hover:border-white/25 hover:bg-white/5 disabled:hover:bg-transparent'
                  }`}
                >
                  {showState && isCorrectBucket && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                  {showState && isChosen && !isCorrectBucket && <XCircle className="w-3.5 h-3.5 shrink-0" />}
                  {bucket}
                </button>
              );
            })}
          </div>

          {answer !== null && (
            <div className="mt-5 pt-5 border-t border-white/10">
              <p className="text-white/60 text-xs font-light leading-relaxed">{card.why}</p>
              {source && (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-2 text-sky-400/80 hover:text-sky-300 text-xs transition-colors"
                >
                  Source: {source.title}
                </a>
              )}
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 mt-4 bg-white text-black text-sm px-4 py-2 rounded-full hover:bg-white/90 transition-colors"
              >
                {isLast ? 'See results' : 'Next'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
