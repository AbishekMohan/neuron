import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Castle, CheckCircle2, MessageCircle, Network, Cpu, Bot } from 'lucide-react';
import { MODULES } from '../data/modules';

const HAND = [
  { name: 'Chatbot', cost: 1, Icon: MessageCircle, color: '#7dd3fc' },
  { name: 'Neural Net', cost: 2, Icon: Network, color: '#a78bfa' },
  { name: 'GPT', cost: 3, Icon: Cpu, color: '#34d399' },
  { name: 'Claude', cost: 4, Icon: Bot, color: '#38bdf8' },
];

const DEMO_QUESTIONS = MODULES[0].steps.quiz.questions.slice(0, 3);
const STEP_MS = 1700;
const MAX_ENERGY = 8;

// A non-interactive, looping preview of the Royale mini-game: shows the
// battlefield look and the "answer correctly to earn energy" mechanic in
// motion, without mounting the real (interactive, bot-driven) match.
export default function RoyaleDemoFrame() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), STEP_MS);
    return () => window.clearInterval(id);
  }, []);

  const cycle = Math.floor(tick / 2);
  const revealed = tick % 2 === 1;
  const question = DEMO_QUESTIONS[cycle % DEMO_QUESTIONS.length];
  const energy = cycle % (MAX_ENERGY + 1);
  const selectedCardIndex = cycle % HAND.length;

  return (
    <div className="pointer-events-none select-none">
      <div className="relative h-36 sm:h-40 rounded-xl liquid-glass overflow-hidden mb-4">
        <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-white/10" />

        <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-6">
          <Castle className="w-3.5 h-3.5 text-red-300/70" strokeWidth={1.5} />
          <Castle className="w-4.5 h-4.5 text-red-300" strokeWidth={1.5} />
          <Castle className="w-3.5 h-3.5 text-red-300/70" strokeWidth={1.5} />
        </div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-6">
          <Castle className="w-3.5 h-3.5 text-sky-300/70" strokeWidth={1.5} />
          <Castle className="w-4.5 h-4.5 text-sky-300" strokeWidth={1.5} />
          <Castle className="w-3.5 h-3.5 text-sky-300/70" strokeWidth={1.5} />
        </div>

        <motion.div
          className="absolute w-4 h-4 rounded-full border flex items-center justify-center"
          style={{ left: '32%', top: '58%', backgroundColor: '#38bdf822', borderColor: '#38bdf866' }}
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        >
          <Bot className="w-2 h-2 text-sky-300" strokeWidth={2} />
        </motion.div>
        <motion.div
          className="absolute w-4 h-4 rounded-full border flex items-center justify-center"
          style={{ left: '64%', top: '38%', backgroundColor: '#f8717122', borderColor: '#f8717166' }}
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut', delay: 0.4 }}
        >
          <Cpu className="w-2 h-2 text-red-300" strokeWidth={2} />
        </motion.div>
      </div>

      <div className="rounded-xl liquid-glass p-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-white/40 text-xs">Energy</p>
          <p className="text-white/60 text-xs">
            {energy}/{MAX_ENERGY}
          </p>
        </div>
        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden mb-3">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-500"
            animate={{ width: `${(energy / MAX_ENERGY) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {HAND.map((card, i) => (
            <div
              key={card.name}
              className={`rounded-lg border p-2 flex flex-col items-center gap-1 transition-colors ${
                i === selectedCardIndex ? 'border-sky-400/60 bg-sky-400/10' : 'border-white/10'
              }`}
            >
              <card.Icon className="w-4 h-4" style={{ color: card.color }} strokeWidth={1.5} />
              <span className="text-white/80 text-[10px] leading-none text-center">{card.name}</span>
              <span className="text-sky-300/80 text-[10px] leading-none">{card.cost}⚡</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl liquid-glass p-4">
        <p className="text-white/40 text-[10px] uppercase tracking-widest mb-2">Answer for energy</p>
        <p className="text-white text-sm font-normal mb-3 leading-snug">{question.prompt}</p>
        <div className="flex flex-col gap-1.5">
          {question.choices.map((choice, i) => {
            const isCorrect = i === question.correctIndex;
            return (
              <div
                key={i}
                className={`text-left text-xs px-3 py-2 rounded-lg border flex items-center gap-1.5 transition-colors ${
                  revealed && isCorrect ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200' : 'border-white/10 text-white/60'
                }`}
              >
                {revealed && isCorrect && <CheckCircle2 className="w-3 h-3 shrink-0" />}
                {choice}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
