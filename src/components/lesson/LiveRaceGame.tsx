import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, CheckCircle2, XCircle, Trophy } from 'lucide-react';
import type { QuizQuestion } from '../../data/modules';
import { useGameRoom } from '../../lib/multiplayer';
import RoomSetup from './RoomSetup';
import RacerTrack from './RacerTrack';

function shuffled<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// "Classic Live": answer every question correctly, in a row, before your
// opponents. One wrong answer resets your streak to zero. You keep
// going, racing to be first to a clean run through the whole set.
export default function LiveRaceGame({
  questions,
  moduleId,
  complete,
  onComplete,
}: {
  questions: QuizQuestion[];
  moduleId: string;
  complete: boolean;
  onComplete: () => void;
}) {
  const room = useGameRoom(`live-${moduleId}`);
  const target = questions.length;
  const [order, setOrder] = useState(() => shuffled(questions));
  const [index, setIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [bestStreak, setBestStreak] = useState(0);

  const question = order[index % order.length];

  const handleAnswer = (choiceIndex: number) => {
    if (selected !== null) return;
    setSelected(choiceIndex);
    const correct = choiceIndex === question.correctIndex;

    window.setTimeout(() => {
      if (correct) {
        const nextStreak = streak + 1;
        setStreak(nextStreak);
        setBestStreak((b) => Math.max(b, nextStreak));

        if (nextStreak >= target) {
          room.setSelfProgress(100, true);
          if (!complete) onComplete();
        } else {
          room.setSelfProgress(Math.round((nextStreak / target) * 100), false);
          setIndex((i) => i + 1);
          setSelected(null);
        }
      } else {
        setStreak(0);
        room.setSelfProgress(0, false);
        // reshuffle so a wrong answer doesn't just replay the same question next
        setOrder(shuffled(questions));
        setIndex(0);
        setSelected(null);
      }
    }, 700);
  };

  if (room.phase === 'setup' || room.phase === 'lobby') {
    return <RoomSetup room={room} title="Live Trivia Race" />;
  }

  const selfFinished = room.racers.find((r) => r.id === room.selfId)?.finished;
  const winner = room.racers.find((r) => r.finished);

  return (
    <div className="max-w-xl">
      <div className="rounded-2xl liquid-glass p-5 mb-6">
        <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Live standings</p>
        <RacerTrack racers={room.racers} selfId={room.selfId} />
      </div>

      {selfFinished || room.phase === 'finished' ? (
        <div className="rounded-2xl liquid-glass p-8 text-center">
          <Trophy className="w-9 h-9 text-amber-300 mx-auto mb-4" strokeWidth={1.25} />
          <p className="text-white text-lg font-normal mb-1">
            {winner?.id === room.selfId ? 'You won the race!' : winner ? `${winner.name} finished first` : 'You finished the streak!'}
          </p>
          <p className="text-white/50 text-sm mb-6">Best streak this round: {bestStreak}</p>
          <button
            type="button"
            onClick={room.leaveRoom}
            className="text-sm px-5 py-2.5 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-colors"
          >
            Leave room
          </button>
        </div>
      ) : (
        <div className="rounded-2xl liquid-glass p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-white/40 text-xs">Streak toward {target} in a row</p>
            {streak > 0 && (
              <span className="inline-flex items-center gap-1 text-amber-300/80 text-xs">
                <Flame className="w-3.5 h-3.5" />
                {streak}
              </span>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={`${index}-${streak}`} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.18 }}>
              <p className="text-white text-base font-normal mb-5 leading-snug">{question.prompt}</p>
              <div className="flex flex-col gap-2">
                {question.choices.map((choice, i) => {
                  const isCorrect = i === question.correctIndex;
                  const isChosen = selected === i;
                  const showState = selected !== null;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleAnswer(i)}
                      disabled={showState}
                      className={`text-left text-sm px-4 py-2.5 rounded-lg border transition-colors flex items-center gap-2 ${
                        showState && isCorrect
                          ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200'
                          : showState && isChosen
                            ? 'border-red-400/40 bg-red-400/10 text-red-200'
                            : 'border-white/10 text-white/70 hover:border-white/25 hover:bg-white/5 disabled:hover:bg-transparent'
                      }`}
                    >
                      {showState && isCorrect && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                      {showState && isChosen && !isCorrect && <XCircle className="w-3.5 h-3.5 shrink-0" />}
                      {choice}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
