import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useVisualsGate } from '@/hooks/useVisualsGate';
import React, { Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, FileText, Layers, Video, Gamepad2, ClipboardCheck } from 'lucide-react';
import { MODULES } from '../data/modules';
import ArticleStep from './lesson/ArticleStep';
import FlashcardsStep from './lesson/FlashcardsStep';
import QuizStep from './lesson/QuizStep';
import RoyaleDemoFrame from './RoyaleDemoFrame';
const NeuronBackdrop = React.lazy(() => import('./NeuronBackdrop'));

const noop = () => {};
const demoModule = MODULES[0];

// Each slide mounts the real, working step component (not a screenshot),
// so the "window" genuinely shows what that part of a module does. The
// mini-game slide is the one exception: it's a non-interactive looping
// preview rather than the live match, so the landing page stays a demo,
// not a playable session.
const SLIDES = [
  {
    key: 'article',
    title: 'Article',
    detail: 'Read a short, sourced explainer with quick checks built in.',
    Icon: FileText,
    windowClass: 'w-full max-w-2xl',
  },
  {
    key: 'flashcards',
    title: 'Flashcards',
    detail: 'Review key vocabulary from the article, flip-card style.',
    Icon: Layers,
    windowClass: 'w-full max-w-md',
  },
  {
    key: 'video',
    title: 'Video',
    detail: 'Watch a short explainer video for the module.',
    Icon: Video,
    windowClass: 'w-64 sm:w-72',
  },
  {
    key: 'game',
    title: 'Mini-game',
    detail: 'Play a quick game that tests what stuck, with instant explanations.',
    Icon: Gamepad2,
    windowClass: 'w-full max-w-md',
  },
  {
    key: 'quiz',
    title: 'Quiz',
    detail: 'Prove mastery with a graded quiz.',
    Icon: ClipboardCheck,
    windowClass: 'w-full max-w-xl',
  },
] as const;

const ROTATE_MS = 7000;

export default function HowItWorksShowcase() {
  const reducedMotion = useReducedMotion();
  // Below-the-fold canvas: no reason to pay ~860ms of eval inside the load
  // window. Mounts on first interaction like the hero visuals (see Home.tsx).
  const visualsReady = useVisualsGate();
  const [index, setIndex] = useState(0);

  // Auto-advance pauses under reduced motion: a carousel that rotates on its
  // own is exactly the kind of animation the setting exists to stop. Manual
  // prev/next/dot controls below always remain available.
  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % SLIDES.length), ROTATE_MS);
    return () => window.clearTimeout(id);
  }, [index, reducedMotion]);

  const slide = SLIDES[index];
  const isVideo = slide.key === 'video';
  const goPrev = () => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);
  const goNext = () => setIndex((i) => (i + 1) % SLIDES.length);

  return (
    <div>
      <div className="device-window relative w-full h-[560px] sm:h-[600px] md:h-[640px] rounded-3xl overflow-hidden flex items-center justify-center p-6 sm:p-10">
        {!reducedMotion && visualsReady && <Suspense fallback={null}><NeuronBackdrop /></Suspense>}

        <motion.div
          key={slide.key}
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className={`relative ${slide.windowClass} max-h-full rounded-2xl liquid-glass ${
            isVideo ? 'aspect-[9/16] overflow-hidden' : 'overflow-y-auto p-6 sm:p-8'
          }`}
        >
          {slide.key === 'article' && <ArticleStep sections={[demoModule.steps.article.sections[0]]} complete={false} onComplete={noop} />}
          {slide.key === 'flashcards' && <FlashcardsStep cards={demoModule.steps.flashcards.cards} complete={false} onComplete={noop} />}
          {isVideo && (
            <video
              src="/showcase.mp4"
              className="w-full h-full object-cover"
              // Decorative demo loop, not content: never autoplay for motion-
              // sensitive visitors; everyone else gets manual controls.
              autoPlay={!reducedMotion}
              loop
              muted
              playsInline
              controls
              preload="none"
              aria-label="Preview of a Neuron learning module video"
            />
          )}
          {slide.key === 'game' && <RoyaleDemoFrame />}
          {slide.key === 'quiz' && (
            <QuizStep
              questions={demoModule.steps.quiz.questions}
              passingScore={demoModule.steps.quiz.passingScore}
              unlocked
              bestAttempt={undefined}
              onSubmit={() => false}
            />
          )}
        </motion.div>
      </div>

      <div className="flex items-center justify-center gap-6 mt-6">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous step"
          className="w-9 h-9 rounded-full border border-white/15 text-white/60 hover:text-white hover:border-white/30 flex items-center justify-center transition-colors shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="text-center min-w-[220px]">
          <div className="flex items-center justify-center gap-2 mb-1">
            <slide.Icon className="w-4 h-4 text-sky-300" strokeWidth={1.5} />
            <p className="text-white text-sm font-normal">{slide.title}</p>
          </div>
          <p className="text-white/40 text-xs font-light max-w-xs mx-auto">{slide.detail}</p>
        </div>

        <button
          type="button"
          onClick={goNext}
          aria-label="Next step"
          className="w-9 h-9 rounded-full border border-white/15 text-white/60 hover:text-white hover:border-white/30 flex items-center justify-center transition-colors shrink-0"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-0.5 mt-4">
        {SLIDES.map((s, i) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show ${s.title}`}
            // 24px hit area (WCAG 2.2 target-size-minimum) with the visual
            // dot centered inside — the 6px dot alone fails touch-target
            // checks and is hard to tap on a phone.
            className="w-6 h-6 flex items-center justify-center"
          >
            <span
              aria-hidden="true"
              className={`block h-1.5 rounded-full transition-colors ${i === index ? 'w-6 bg-sky-300' : 'w-1.5 bg-white/15 hover:bg-white/30'}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}


