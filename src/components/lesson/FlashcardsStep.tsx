import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCw, CheckCircle2, Circle } from 'lucide-react';
import type { Flashcard } from '../../data/modules';
import { getSource } from '../../data/sources';

type FlashcardsStepProps = {
  cards: Flashcard[];
  complete: boolean;
  onComplete: () => void;
};

export default function FlashcardsStep({ cards, complete, onComplete }: FlashcardsStepProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewed, setReviewed] = useState<Set<number>>(new Set());

  const card = cards[index];
  const source = card.sourceId ? getSource(card.sourceId) : undefined;
  const allReviewed = reviewed.size >= cards.length;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setFlipped((f) => !f);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, cards.length]);

  const goNext = () => {
    setReviewed((prev) => new Set(prev).add(index));
    setFlipped(false);
    setIndex((i) => Math.min(cards.length - 1, i + 1));
  };

  const goPrev = () => {
    setFlipped(false);
    setIndex((i) => Math.max(0, i - 1));
  };

  return (
    <div className="max-w-xl">
      <p className="text-white/40 text-xs mb-4">
        Card {index + 1} of {cards.length} · press space to flip, arrow keys to move
      </p>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="w-full h-64 [perspective:1200px] block"
        aria-label={flipped ? 'Showing definition, click to show term' : 'Showing term, click to show definition'}
      >
        <motion.div
          className="relative w-full h-full [transform-style:preserve-3d]"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
        >
          <div className="absolute inset-0 rounded-2xl liquid-glass flex flex-col items-center justify-center p-8 text-center [backface-visibility:hidden]">
            <p className="text-white/30 text-xs uppercase tracking-widest mb-4">Term</p>
            <p className="text-white text-2xl font-normal">{card.term}</p>
          </div>
          <div
            className="absolute inset-0 rounded-2xl liquid-glass flex flex-col items-center justify-center p-8 text-center [backface-visibility:hidden]"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <p className="text-white/30 text-xs uppercase tracking-widest mb-4">Definition</p>
            <p className="text-white/80 text-sm font-light leading-relaxed">{card.definition}</p>
            {source && (
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-sky-400/80 hover:text-sky-300 text-xs mt-4 transition-colors"
              >
                Source: {source.title}
              </a>
            )}
          </div>
        </motion.div>
      </button>

      <div className="flex items-center justify-between mt-5">
        <button
          type="button"
          onClick={goPrev}
          disabled={index === 0}
          className="inline-flex items-center gap-1 text-white/50 hover:text-white text-sm disabled:opacity-30 disabled:hover:text-white/50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex gap-1">
          {cards.map((_, i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === index ? 'bg-sky-300' : reviewed.has(i) ? 'bg-sky-400/40' : 'bg-white/15'
              }`}
            />
          ))}
        </div>

        {index < cards.length - 1 ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center gap-1 text-white/50 hover:text-white text-sm transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setReviewed((prev) => new Set(prev).add(index));
              setFlipped(false);
            }}
            className="inline-flex items-center gap-1 text-white/50 hover:text-white text-sm transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
            Mark reviewed
          </button>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-white/10">
        <AnimatePresence>
          {!allReviewed && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-white/30 text-xs mb-3">
              Review all {cards.length} cards to finish this step.
            </motion.p>
          )}
        </AnimatePresence>
        <button
          type="button"
          onClick={onComplete}
          disabled={complete || !allReviewed}
          className={`inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full transition-colors disabled:opacity-40 ${
            complete
              ? 'bg-sky-400/10 border border-sky-400/40 text-sky-300 cursor-default'
              : 'bg-white text-black hover:bg-white/90 disabled:hover:bg-white'
          }`}
        >
          {complete ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
          {complete ? 'Flashcards complete' : 'Mark flashcards complete'}
        </button>
      </div>
    </div>
  );
}
