import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Compass, Layers, ListChecks, Award, Trophy, MessageCircle } from 'lucide-react';

export const TUTORIAL_STORAGE_KEY = 'neuron-tutorial-seen-v1';

const STEPS = [
  {
    Icon: Compass,
    title: 'Welcome to Neuron',
    body: 'A free, self-paced AI literacy course. Here’s a 30-second tour of how everything fits together.',
  },
  {
    Icon: Layers,
    title: 'Six modules',
    body: 'The curriculum is six modules, from AI fundamentals to the future of the field. Work through them in order, or jump around from the Modules page.',
  },
  {
    Icon: ListChecks,
    title: 'Five steps per module',
    body: 'Each module is one unit: Article, Flashcards, Video, Mini-game, then Quiz. The checklist on the left of every module page tracks exactly where you are.',
  },
  {
    Icon: Award,
    title: 'XP and 3D badges',
    body: 'Every step earns XP. Pass a module’s quiz at 80%+ to master it and unlock a unique, procedurally generated 3D badge.',
  },
  {
    Icon: Trophy,
    title: 'Leaderboard & profile',
    body: 'Set up a display name (never your email) on your Profile page to appear on the Leaderboard and show off your badges.',
  },
  {
    Icon: MessageCircle,
    title: 'AI homework helper',
    body: 'The floating assistant button explains how AI works and coaches your homework: it won’t just hand you finished answers.',
  },
];

export default function Tutorial({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const step = STEPS[index];
  const isLast = index === STEPS.length - 1;

  const finish = () => {
    window.localStorage.setItem(TUTORIAL_STORAGE_KEY, '1');
    onClose();
    setIndex(0);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={finish}
          />

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-sm rounded-2xl liquid-glass p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Site tutorial"
          >
            <button
              type="button"
              onClick={finish}
              aria-label="Close tutorial"
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-11 h-11 rounded-full bg-sky-400/10 border border-sky-400/30 flex items-center justify-center mb-5">
              <step.Icon className="w-5 h-5 text-sky-300" strokeWidth={1.5} />
            </div>

            <p className="text-white text-base font-normal mb-2">{step.title}</p>
            <p className="text-white/60 text-sm font-light leading-relaxed mb-6">{step.body}</p>

            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                {STEPS.map((_, i) => (
                  <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === index ? 'bg-sky-300' : 'bg-white/15'}`} />
                ))}
              </div>

              <div className="flex items-center gap-2">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => setIndex((i) => i - 1)}
                    className="inline-flex items-center gap-1 text-white/50 hover:text-white text-sm transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => (isLast ? finish() : setIndex((i) => i + 1))}
                  className="inline-flex items-center gap-1.5 bg-white text-black text-sm px-4 py-2 rounded-full hover:bg-white/90 transition-colors"
                >
                  {isLast ? 'Get started' : 'Next'}
                  {!isLast && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
