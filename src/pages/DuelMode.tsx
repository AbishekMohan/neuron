import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, Swords, ArrowLeft, Trophy } from 'lucide-react';
import { useGameRoom } from '../lib/multiplayer';
import RoomSetup from '../components/lesson/RoomSetup';
import { COURTROOM_SCENARIOS, VERDICT_OPTIONS, type VerdictId } from '../data/challenges';

// A tiny deterministic PRNG seeded from the room code, so every player in
// the same room computes the identical scenario order locally. No need
// to transmit the question set over the realtime channel at all.
function seededShuffle<T>(items: T[], seed: string): T[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  const rand = () => {
    h = (Math.imul(h ^ (h >>> 15), 1 | h) + 0x6d2b79f5) | 0;
    let t = Math.imul(h ^ (h >>> 7), 61 | h);
    t = (t ^ (t + Math.imul(t ^ (t >>> 7), 61 | t))) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function DuelMode() {
  const room = useGameRoom('duel-courtroom');
  const rounds = useMemo(
    () => (room.roomCode ? seededShuffle(COURTROOM_SCENARIOS, room.roomCode) : []),
    [room.roomCode],
  );

  const [roundIndex, setRoundIndex] = useState(0);
  const [picked, setPicked] = useState<VerdictId | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  // A fresh duel gets a fresh local scoreboard even if the room object
  // (and its realtime channel) is reused for a rematch. The lobby phase
  // is the one moment between duels every player passes through.
  useEffect(() => {
    if (room.phase === 'lobby') {
      setRoundIndex(0);
      setPicked(null);
      setCorrectCount(0);
    }
  }, [room.phase]);

  const scenario = rounds[roundIndex];
  const isLastRound = roundIndex === rounds.length - 1;

  const pick = (v: VerdictId) => {
    if (picked || !scenario) return;
    setPicked(v);
    const nextCorrect = correctCount + (v === scenario.correctVerdict ? 1 : 0);
    setCorrectCount(nextCorrect);
    const answered = roundIndex + 1;

    window.setTimeout(() => {
      if (isLastRound) {
        room.setSelfProgress(Math.round((nextCorrect / rounds.length) * 100), true);
      } else {
        room.setSelfProgress(Math.round((nextCorrect / answered) * 100), false);
        setRoundIndex((i) => i + 1);
        setPicked(null);
      }
    }, 900);
  };

  const others = room.racers.filter((r) => r.id !== room.selfId);
  const self = room.racers.find((r) => r.id === room.selfId);

  return (
    <section className="px-6 sm:px-8 md:px-12 pt-28 md:pt-36 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <p className="text-sky-400 text-xs tracking-widest uppercase mb-3">Duel Mode</p>
        <h1 className="text-white text-3xl sm:text-4xl font-light leading-tight tracking-tight">
          Same case. Same clock. Different verdicts?
        </h1>
        <p className="text-white/50 text-sm mt-4 max-w-xl font-light">
          Race a classmate through the same Ethics Courtroom cases, live. Fastest accurate verdicts win.
        </p>

        {(room.phase === 'setup' || room.phase === 'lobby') && (
          <div className="mt-8">
            <RoomSetup room={room} title="Start or join a duel" />
          </div>
        )}

        {room.phase === 'racing' && scenario && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4 text-xs text-white/40">
              <span>
                Case {roundIndex + 1} of {rounds.length}
              </span>
              <div className="flex items-center gap-3">
                {others.map((r) => (
                  <span key={r.id} className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                    {r.name}: {r.progress}%{r.finished ? ' (done)' : ''}
                  </span>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl liquid-glass p-6"
              >
                <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-5 mb-5">
                  <Swords className="w-4 h-4 text-sky-300 shrink-0 mt-0.5" />
                  <p className="text-white text-sm font-light leading-relaxed">{scenario.scenario}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {VERDICT_OPTIONS.map((opt) => {
                    const isPicked = picked === opt.id;
                    const isCorrectOption = picked !== null && opt.id === scenario.correctVerdict;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => pick(opt.id)}
                        disabled={picked !== null}
                        className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                          picked !== null
                            ? isCorrectOption
                              ? 'border-sky-400/50 bg-sky-400/10 text-white'
                              : isPicked
                                ? 'border-white/15 bg-white/[0.03] text-white/40'
                                : 'border-white/10 text-white/30'
                            : 'border-white/15 text-white/80 hover:border-sky-400/40 hover:bg-sky-400/5'
                        }`}
                      >
                        {picked !== null && isCorrectOption && <CheckCircle2 className="w-4 h-4" />}
                        {picked !== null && isPicked && !isCorrectOption && <XCircle className="w-4 h-4" />}
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {room.phase === 'finished' && (
          <div className="mt-8 rounded-2xl liquid-glass p-6 text-center">
            <Trophy className="w-6 h-6 text-amber-300 mx-auto mb-3" />
            <p className="text-white text-3xl font-light tracking-tight mb-1">
              {correctCount}/{rounds.length} correct
            </p>
            <p className="text-white/40 text-xs mb-6">Your final score</p>

            <div className="flex flex-col gap-2 max-w-xs mx-auto mb-6">
              {others.map((r) => (
                <div key={r.id} className="flex items-center justify-between text-sm rounded-lg border border-white/10 px-4 py-2.5">
                  <span className="inline-flex items-center gap-2 text-white/70">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                    {r.name}
                  </span>
                  <span className="text-white/50">
                    {r.finished ? `${r.progress}%` : `${r.progress}% so far...`}
                  </span>
                </div>
              ))}
              {self && (
                <div className="flex items-center justify-between text-sm rounded-lg border border-sky-400/20 bg-sky-400/5 px-4 py-2.5">
                  <span className="inline-flex items-center gap-2 text-white">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: self.color }} />
                    {self.name} (you)
                  </span>
                  <span className="text-white/70">{self.progress}%</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={room.leaveRoom}
                className="inline-flex items-center gap-2 bg-white text-black text-sm font-medium rounded-full px-5 py-2.5 hover:bg-white/90 transition-colors"
              >
                New duel
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
        )}
      </div>
    </section>
  );
}
