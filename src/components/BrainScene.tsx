import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import Brain from './Brain';

export default function BrainScene() {
  return (
    <Canvas
      className="w-full h-full"
      camera={{ position: [0, 0, 7.2], fov: 48 }}
      // Capped at 1 (was up to 1.5): on a retina/high-DPI display this is
      // the difference between rendering ~1x and ~2.25x the pixel count for
      // every pass, including the bloom pass below: a real, measured
      // contributor to jank on this page, not just a software-rendering
      // sandbox artifact.
      dpr={1}
      gl={{ antialias: true, alpha: true }}
    >
      {/* No opaque background color here on purpose: the canvas stays
          transparent so CodeBackdrop's drifting code/binary animation shows
          through behind the brain instead of being painted over. */}
      <ambientLight intensity={0.25} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#3b82f6" />

      <Suspense fallback={null}>
        <Brain />
        <Sparkles count={80} scale={[9, 7, 9]} size={2} speed={0.3} color="#3b82f6" opacity={0.6} />
      </Suspense>

      <EffectComposer multisampling={0}>
        {/* height caps the internal blur-pass resolution rather than the
            full canvas resolution: bloom's blur doesn't need full-res
            input, so this cuts its fill-rate cost substantially with no
            visible difference in a soft glow effect like this one. */}
        <Bloom intensity={0.9} luminanceThreshold={0.15} luminanceSmoothing={0.9} mipmapBlur height={240} />
      </EffectComposer>
    </Canvas>
  );
}
