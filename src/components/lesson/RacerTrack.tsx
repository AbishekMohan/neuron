import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import type { Racer } from '../../lib/multiplayer';

// Shared "who's ahead" visualization for both live multiplayer games: one
// horizontal track per racer, an avatar riding along it at their current
// progress. Ranked by progress so the leader is always on top.
export default function RacerTrack({ racers, selfId }: { racers: Racer[]; selfId: string }) {
  const ranked = [...racers].sort((a, b) => b.progress - a.progress);

  return (
    <div className="flex flex-col gap-3">
      {ranked.map((racer, i) => (
        <div key={racer.id} className="flex items-center gap-3">
          <div className="w-4 text-white/30 text-xs shrink-0 text-center">
            {racer.finished && i === 0 ? <Trophy className="w-3.5 h-3.5 text-amber-300 mx-auto" /> : i + 1}
          </div>
          <div className="flex-1 relative h-2 rounded-full bg-white/10 overflow-visible">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ backgroundColor: racer.color, opacity: 0.35 }}
              animate={{ width: `${racer.progress}%` }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium text-black shadow-md"
              style={{ backgroundColor: racer.color }}
              animate={{ left: `calc(${racer.progress}% - ${racer.progress > 92 ? 24 : 12}px)` }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {racer.name.charAt(0).toUpperCase()}
            </motion.div>
          </div>
          <span className={`text-xs w-24 shrink-0 truncate ${racer.id === selfId ? 'text-sky-300' : 'text-white/50'}`}>
            {racer.name}
            {racer.id === selfId ? ' (you)' : ''}
          </span>
        </div>
      ))}
    </div>
  );
}
