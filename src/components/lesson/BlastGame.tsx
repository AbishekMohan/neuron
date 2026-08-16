import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Target, Timer, CheckCircle2, Circle, RotateCw } from 'lucide-react';
import type { GameCard } from '../../data/modules';
import { getSource } from '../../data/sources';

const ROUND_SECONDS = 25;

type Asteroid = { card: GameCard; x: number; y: number; size: number; delay: number };

function layout(cards: GameCard[]): Asteroid[] {
  // Scattered, non-overlapping-ish grid positions with a little jitter, so
  // it reads as "floating in space" rather than a plain list.
  const cols = 4;
  return cards.map((card, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    return {
      card,
      x: 10 + col * 24 + (Math.random() * 8 - 4),
      y: 12 + row * 30 + (Math.random() * 6 - 3),
      size: 64 + Math.random() * 20,
      delay: Math.random() * 2,
    };
  });
}

export default function BlastGame({
  prompt,
  cards,
  blastTarget,
  complete,
  onComplete,
}: {
  prompt: string;
  cards: GameCard[];
  blastTarget: string;
  complete: boolean;
  onComplete: () => void;
}) {
  const targets = useMemo(() => cards.filter((c) => c.bucket === blastTarget).length, [cards, blastTarget]);
  const [asteroids, setAsteroids] = useState(() => layout(cards));
  const [destroyed, setDestroyed] = useState<Set<string>>(new Set());
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [lastWhy, setLastWhy] = useState<{ text: string; sourceId?: string; correct: boolean } | null>(null);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [status, setStatus] = useState<'ready' | 'playing' | 'ended'>('ready');

  useEffect(() => {
    if (status !== 'playing') return;
    if (timeLeft <= 0) {
      setStatus('ended');
      return;
    }
    const t = window.setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [status, timeLeft]);

  useEffect(() => {
    if (status === 'playing' && hits >= targets && targets > 0) setStatus('ended');
  }, [hits, targets, status]);

  const start = () => {
    setAsteroids(layout(cards));
    setDestroyed(new Set());
    setHits(0);
    setMisses(0);
    setLastWhy(null);
    setTimeLeft(ROUND_SECONDS);
    setStatus('playing');
  };

  const blast = (asteroid: Asteroid) => {
    if (status !== 'playing' || destroyed.has(asteroid.card.id)) return;
    setDestroyed((prev) => new Set(prev).add(asteroid.card.id));
    const correct = asteroid.card.bucket === blastTarget;
    if (correct) setHits((h) => h + 1);
    else setMisses((m) => m + 1);
    setLastWhy({ text: asteroid.card.why, sourceId: asteroid.card.sourceId, correct });
  };

  const source = lastWhy?.sourceId ? getSource(lastWhy.sourceId) : undefined;

  if (status === 'ready') {
    return (
      <div className="max-w-xl">
        <div className="rounded-2xl liquid-glass p-8 text-center">
          <Target className="w-9 h-9 text-sky-300 mx-auto mb-4" strokeWidth={1.25} />
          <p className="text-white text-lg font-normal mb-2">{prompt}</p>
          <p className="text-white/40 text-xs mb-6">
            {ROUND_SECONDS} seconds. {targets} correct target{targets === 1 ? '' : 's'} to clear.
          </p>
          <button
            type="button"
            onClick={start}
            className="inline-flex items-center gap-2 bg-white text-black text-sm font-medium px-6 py-2.5 rounded-full hover:bg-white/90 transition-colors"
          >
            Start
          </button>
        </div>
      </div>
    );
  }

  if (status === 'ended') {
    const won = hits >= targets;
    return (
      <div className="max-w-xl">
        <div className="rounded-2xl liquid-glass p-8 text-center">
          <Target className="w-9 h-9 text-sky-300 mx-auto mb-4" strokeWidth={1.25} />
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">{won ? 'Cleared' : 'Time up'}</p>
          <p className="text-white text-3xl font-light mb-1">
            {hits}/{targets}
          </p>
          <p className="text-white/50 text-sm mb-6">{misses} miss{misses === 1 ? '' : 'es'}</p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={start}
              className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              Play again
            </button>
            <button
              type="button"
              onClick={onComplete}
              disabled={complete}
              className={`inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full transition-colors ${
                complete ? 'bg-sky-400/10 border border-sky-400/40 text-sky-300 cursor-default' : 'bg-white text-black hover:bg-white/90'
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
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-3">
        <p className="text-white/60 text-sm font-light">{prompt}</p>
        <span className="inline-flex items-center gap-1.5 text-white/50 text-xs shrink-0">
          <Timer className="w-3.5 h-3.5" />
          {timeLeft}s · {hits}/{targets}
        </span>
      </div>

      <div className="relative h-[380px] rounded-2xl liquid-glass overflow-hidden">
        {asteroids.map((a) =>
          destroyed.has(a.card.id) ? null : (
            <motion.button
              key={a.card.id}
              type="button"
              onClick={() => blast(a)}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{
                scale: [1, 1.04, 1],
                opacity: 1,
                x: [0, 6, -6, 0],
                y: [0, -5, 5, 0],
              }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ duration: 4 + a.delay, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'absolute', left: `${a.x}%`, top: `${a.y}%`, width: a.size, height: a.size }}
              className="rounded-full border border-sky-400/30 bg-sky-400/10 hover:bg-sky-400/20 hover:border-sky-400/50 flex items-center justify-center text-center p-1.5 transition-colors"
            >
              <span className="text-white/80 text-[10px] leading-tight line-clamp-3">{a.card.text}</span>
            </motion.button>
          ),
        )}
      </div>

      <AnimatePresence>
        {lastWhy && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-3 rounded-xl p-3 text-xs ${lastWhy.correct ? 'bg-emerald-400/10 text-emerald-200' : 'bg-red-400/10 text-red-200'}`}
          >
            {lastWhy.text}
            {source && (
              <a href={source.url} target="_blank" rel="noreferrer" className="block mt-1 text-sky-300/80 hover:text-sky-200">
                Source: {source.title}
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
