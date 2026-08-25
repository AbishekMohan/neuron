import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import CarvisOrb from './CarvisOrb';
import type { OrbState, FrequencyDataSource } from '../lib/carvisOrb';

type InteractiveOrbStageProps = {
  state: OrbState;
  quality: number;
  hueFilter: string;
  analyser?: FrequencyDataSource | null;
  accentSwatch: string;
  size?: number;
  onTouch?: () => void;
};

// A large, centered, pointer-reactive stage for the orb: real 3D tilt
// (CSS perspective, not the WebGL camera) that follows the cursor, plus
// a soft breathing glow behind it. Deliberately no clipping circle or
// ring border around the canvas — the particle cloud is left to read as
// an open field rather than a ball contained in a frame.
export default function InteractiveOrbStage({
  state,
  quality,
  hueFilter,
  analyser = null,
  accentSwatch,
  size = 400,
  onTouch,
}: InteractiveOrbStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 120, damping: 14, mass: 0.4 });
  const springY = useSpring(rawY, { stiffness: 120, damping: 14, mass: 0.4 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [14, -14]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-14, 14]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handlePointerLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={onTouch}
      style={{ width: size, height: size, perspective: 1000 }}
      className="relative mx-auto touch-none select-none cursor-grab active:cursor-grabbing"
    >
      {/* Breathing glow halo, well behind everything, colored to match
          the companion's chosen accent so a hue change actually reads
          here too, not just on the orb itself. */}
      <motion.div
        className="absolute -inset-10 rounded-full blur-3xl pointer-events-none"
        style={{ background: `radial-gradient(circle, ${accentSwatch}33 0%, transparent 70%)` }}
        animate={{ opacity: [0.5, 0.85, 0.5], scale: [0.96, 1.04, 0.96] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative w-full h-full"
      >
        <div className="absolute inset-0" style={{ filter: hueFilter }}>
          <CarvisOrb state={state} quality={quality} analyser={analyser} />
        </div>
      </motion.div>
    </div>
  );
}
