import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import type { Flashcard } from '../../data/modules';
import { useGameRoom } from '../../lib/multiplayer';
import RoomSetup from './RoomSetup';
import RacerTrack from './RacerTrack';

type Tile = { key: string; pairIndex: number; label: string; matched: boolean };

function buildBoard(cards: Flashcard[]): Tile[] {
  const tiles: Tile[] = [];
  cards.forEach((card, i) => {
    tiles.push({ key: `${i}-term`, pairIndex: i, label: card.term, matched: false });
    tiles.push({ key: `${i}-def`, pairIndex: i, label: card.definition, matched: false });
  });
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  return tiles;
}

// Every player races their own shuffled board of the same term/definition
// pairs. First to clear all pairs wins. Independent boards (not a shared
// grid) avoids any need to reconcile simultaneous flips between players.
export default function MatchRaceGame({
  cards,
  moduleId,
  complete,
  onComplete,
}: {
  cards: Flashcard[];
  moduleId: string;
  complete: boolean;
  onComplete: () => void;
}) {
  const room = useGameRoom(`match-${moduleId}`);
  const [board, setBoard] = useState(() => buildBoard(cards));
  const [flipped, setFlipped] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const totalPairs = cards.length;
  const matchedCount = useMemo(() => board.filter((t) => t.matched).length / 2, [board]);

  const handleFlip = (key: string) => {
    if (busy || flipped.includes(key)) return;
    const tile = board.find((t) => t.key === key);
    if (!tile || tile.matched) return;

    const next = [...flipped, key];
    setFlipped(next);

    if (next.length === 2) {
      setBusy(true);
      const [a, b] = next;
      const tileA = board.find((t) => t.key === a)!;
      const tileB = board.find((t) => t.key === b)!;

      window.setTimeout(() => {
        if (tileA.pairIndex === tileB.pairIndex) {
          const updated = board.map((t) => (t.pairIndex === tileA.pairIndex ? { ...t, matched: true } : t));
          setBoard(updated);
          const matched = updated.filter((t) => t.matched).length / 2;
          const finished = matched === totalPairs;
          room.setSelfProgress(Math.round((matched / totalPairs) * 100), finished);
          if (finished && !complete) onComplete();
        }
        setFlipped([]);
        setBusy(false);
      }, 700);
    }
  };

  if (room.phase === 'setup' || room.phase === 'lobby') {
    return <RoomSetup room={room} title="Multiplayer Match" />;
  }

  const selfFinished = room.racers.find((r) => r.id === room.selfId)?.finished;
  const winner = room.racers.find((r) => r.finished);

  return (
    <div className="max-w-2xl">
      <div className="rounded-2xl liquid-glass p-5 mb-6">
        <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Live standings</p>
        <RacerTrack racers={room.racers} selfId={room.selfId} />
      </div>

      {selfFinished ? (
        <div className="rounded-2xl liquid-glass p-8 text-center">
          <Trophy className="w-9 h-9 text-amber-300 mx-auto mb-4" strokeWidth={1.25} />
          <p className="text-white text-lg font-normal mb-1">
            {winner?.id === room.selfId ? 'You won the race!' : winner ? `${winner.name} finished first` : 'Board cleared!'}
          </p>
          <p className="text-white/50 text-sm mb-6">Matched all {totalPairs} pairs.</p>
          <button
            type="button"
            onClick={room.leaveRoom}
            className="text-sm px-5 py-2.5 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-colors"
          >
            Leave room
          </button>
        </div>
      ) : (
        <>
          <p className="text-white/40 text-xs mb-3">{matchedCount}/{totalPairs} pairs matched</p>
          <div className="grid grid-cols-4 gap-2">
            {board.map((tile) => {
              const isFlipped = tile.matched || flipped.includes(tile.key);
              return (
                <button
                  key={tile.key}
                  type="button"
                  onClick={() => handleFlip(tile.key)}
                  disabled={tile.matched}
                  className="h-20 [perspective:800px]"
                >
                  <motion.div
                    className="relative w-full h-full [transform-style:preserve-3d]"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="absolute inset-0 rounded-lg liquid-glass flex items-center justify-center [backface-visibility:hidden]">
                      <span className="w-2 h-2 rounded-full bg-sky-400/40" />
                    </div>
                    <div
                      className={`absolute inset-0 rounded-lg flex items-center justify-center p-2 text-center [backface-visibility:hidden] ${
                        tile.matched ? 'bg-emerald-400/10 border border-emerald-400/30' : 'liquid-glass'
                      }`}
                      style={{ transform: 'rotateY(180deg)' }}
                    >
                      <span className="text-white/80 text-[11px] leading-tight line-clamp-4">{tile.label}</span>
                    </div>
                  </motion.div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
