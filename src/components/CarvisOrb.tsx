import { useEffect, useRef } from 'react';
import { createOrb, type Orb, type OrbState, type FrequencyDataSource } from '../lib/carvisOrb';

interface CarvisOrbProps {
  state: OrbState;
  analyser?: FrequencyDataSource | null;
  /** 0 = dim/glitchy, 1 = sharp/bright. Defaults to 1 (full quality). */
  quality?: number;
  className?: string;
}

// The assistant's visual identity: a blue particle cloud that tightens,
// brightens, and starts firing connections between its own points as the
// assistant moves from idle to actively thinking. Fills its parent, so
// callers control size/shape (e.g. a small rounded-full avatar).
export default function CarvisOrb({ state, analyser = null, quality = 1, className = '' }: CarvisOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbRef = useRef<Orb | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const orb = createOrb(canvas);
    orbRef.current = orb;
    return () => {
      orb.destroy();
      orbRef.current = null;
    };
  }, []);

  useEffect(() => {
    orbRef.current?.setState(state);
  }, [state]);

  useEffect(() => {
    orbRef.current?.setAnalyser(analyser);
  }, [analyser]);

  useEffect(() => {
    orbRef.current?.setQuality(quality);
  }, [quality]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
}
