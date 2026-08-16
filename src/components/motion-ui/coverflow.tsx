import {
  createContext,
  useContext,
  useMemo,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

type CoverflowContextValue = {
  activeIndex: number;
  total: number;
  goTo: (index: number) => void;
  next: () => void;
  prev: () => void;
};

const CoverflowContext = createContext<CoverflowContextValue | null>(null);

function useCoverflowContext() {
  const ctx = useContext(CoverflowContext);
  if (!ctx) throw new Error('CoverflowControls must be used inside a <Coverflow>');
  return ctx;
}

type CoverflowProps = {
  items: ReactNode[];
  cardWidth?: number;
  rotation?: number;
  neighbourScale?: number;
  neighbourOpacity?: number;
  perspective?: number;
  startIndex?: number;
  children?: ReactNode;
  'aria-label'?: string;
};

export function Coverflow({
  items,
  cardWidth = 340,
  rotation = 22,
  neighbourScale = 0.82,
  neighbourOpacity = 0.45,
  perspective = 1200,
  startIndex = 0,
  children,
  'aria-label': ariaLabel,
}: CoverflowProps) {
  const total = items.length;
  const [activeIndex, setActiveIndex] = useState(() => Math.min(Math.max(startIndex, 0), total - 1));

  const goTo = (index: number) => setActiveIndex(((index % total) + total) % total);
  const next = () => goTo(activeIndex + 1);
  const prev = () => goTo(activeIndex - 1);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      next();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      prev();
    }
  };

  const contextValue = useMemo<CoverflowContextValue>(
    () => ({ activeIndex, total, goTo, next, prev }),
    [activeIndex, total],
  );

  const stageHeight = cardWidth * 1.15;

  return (
    <CoverflowContext.Provider value={contextValue}>
      <div
        role="region"
        aria-label={ariaLabel}
        aria-roledescription="carousel"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50 rounded-2xl"
      >
        <div className="relative" style={{ height: stageHeight, perspective }}>
          {items.map((item, index) => {
            const offset = index - activeIndex;
            const isActive = offset === 0;
            const direction = offset === 0 ? 0 : offset > 0 ? 1 : -1;

            return (
              <div
                key={index}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ zIndex: total - Math.abs(offset), pointerEvents: Math.abs(offset) > 2 ? 'none' : 'auto' }}
                aria-hidden={!isActive}
              >
                <motion.div
                  style={{ width: cardWidth, transformStyle: 'preserve-3d' }}
                  animate={{
                    x: offset * cardWidth * 0.55,
                    rotateY: -direction * rotation,
                    scale: isActive ? 1 : neighbourScale,
                    opacity: Math.abs(offset) > 2 ? 0 : isActive ? 1 : neighbourOpacity,
                  }}
                  transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                  onClick={() => !isActive && goTo(index)}
                  className={cn(!isActive && 'cursor-pointer')}
                >
                  {item}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
      {children}
    </CoverflowContext.Provider>
  );
}

type CoverflowItemProps = {
  children?: ReactNode;
  label?: string;
  className?: string;
};

export function CoverflowItem({ children, label, className }: CoverflowItemProps) {
  return (
    <div role="group" aria-label={label} className={cn('select-none', className)}>
      {children}
    </div>
  );
}

type CoverflowControlsProps = {
  announce?: (index: number, total: number) => string;
  prevLabel?: string;
  nextLabel?: string;
  dotsLabel?: string;
};

export function CoverflowControls({
  announce,
  prevLabel = 'Previous',
  nextLabel = 'Next',
  dotsLabel = 'Choose item',
}: CoverflowControlsProps) {
  const { activeIndex, total, goTo, next, prev } = useCoverflowContext();
  const liveText = announce ? announce(activeIndex, total) : `Showing ${activeIndex + 1} of ${total}`;

  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      <div className="flex items-center gap-5">
        <button
          type="button"
          onClick={prev}
          aria-label={prevLabel}
          className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2" role="group" aria-label={dotsLabel}>
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to item ${i + 1} of ${total}`}
              aria-current={i === activeIndex}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                i === activeIndex ? 'w-6 bg-sky-400' : 'w-1.5 bg-white/20 hover:bg-white/40',
              )}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          aria-label={nextLabel}
          className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {liveText}
      </p>
    </div>
  );
}
