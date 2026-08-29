import { useEffect, useMemo, useState } from 'react';

// A layered AI/ML "atmosphere" behind every page: drifting code fragments,
// a faint binary-rain layer for depth, and a couple of live-looking
// training metrics. Nothing here is meant to be read closely: it's meant
// to read as "this is a computerized/AI space" at a glance. Fully
// aria-hidden, pointer-events-none, and the animated layers turn off under
// prefers-reduced-motion (the metrics ticker just stops updating; the
// drift/rain CSS animations are paused globally in index.css).
const SNIPPETS = [
  'if bias_detected:',
  '    flag_output()',
  'model.train(data)',
  'predict(x) -> y',
  '# verify before trusting',
  'class Neuron:',
  'for epoch in range(100):',
  'return output',
  'explain(concept)',
  'cite_source(url)',
  'assert human_reviewed',
  'while learning:',
  'def think():',
  '    pass',
  '0b1010 0b0110 0b1101',
  'loss.backward()',
  'if not verified: pause()',
  'grad = compute_gradient()',
  'weights += lr * grad',
  'ethics.check(output)',
  'softmax(logits)',
  'attention(Q, K, V)',
  'tokenize(prompt)',
  'model.eval()',
  'optimizer.step()',
  'y_hat = W @ x + b',
  'hallucination_risk: 0.02',
  'relu(x)',
  'batch_size = 32',
  'confidence: 0.94',
];

const BINARY_CHARS = ['0', '1'];

type DriftParticle = {
  id: number;
  text: string;
  left: number;
  duration: number;
  delay: number;
  size: number;
};

type RainColumn = {
  id: number;
  left: number;
  duration: number;
  delay: number;
  chars: string;
  size: number;
};

function buildParticles(count: number): DriftParticle[] {
  return Array.from({ length: count }, (_, i) => {
    const duration = 22 + Math.random() * 16;
    return {
      id: i,
      text: SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)],
      left: Math.random() * 100,
      duration,
      delay: -Math.random() * duration, // negative delay: already mid-animation on load
      size: 11 + Math.random() * 3,
    };
  });
}

function buildRainColumns(count: number): RainColumn[] {
  return Array.from({ length: count }, (_, i) => {
    const duration = 9 + Math.random() * 10;
    const length = 14 + Math.floor(Math.random() * 18);
    const chars = Array.from({ length }, () => BINARY_CHARS[Math.floor(Math.random() * 2)]).join('\n');
    return {
      id: i,
      left: Math.random() * 100,
      duration,
      delay: -Math.random() * duration,
      chars,
      size: 10 + Math.random() * 4,
    };
  });
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!query) return;
    setReduced(query.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener('change', handler);
    return () => query.removeEventListener('change', handler);
  }, []);
  return reduced;
}

// A couple of small "live training run" readouts, ticking on an interval
// so the backdrop feels like an actual running model rather than static
// decoration. Purely cosmetic numbers, not derived from anything real.
function LiveMetrics({ reducedMotion }: { reducedMotion: boolean }) {
  const [epoch, setEpoch] = useState(1);
  const [loss, setLoss] = useState(1.842);

  useEffect(() => {
    if (reducedMotion) return;
    const interval = window.setInterval(() => {
      setEpoch((e) => (e >= 100 ? 1 : e + 1));
      setLoss((l) => {
        const next = l * (0.92 + Math.random() * 0.05) + (Math.random() - 0.5) * 0.01;
        return next < 0.02 ? 1.842 : Math.max(0.02, next);
      });
    }, 1800);
    return () => window.clearInterval(interval);
  }, [reducedMotion]);

  return (
    <div className="hidden md:block decorative-backdrop" aria-hidden="true">
      <div className="fixed top-[22%] right-[6%] font-mono text-sky-300/[0.08] text-[11px] leading-relaxed select-none">
        epoch {String(epoch).padStart(3, '0')}/100
        <br />
        loss: {loss.toFixed(3)}
      </div>
      <div className="fixed bottom-[18%] left-[5%] font-mono text-sky-300/[0.07] text-[11px] leading-relaxed select-none">
        confidence: {(0.7 + ((epoch * 7) % 30) / 100).toFixed(2)}
        <br />
        tokens/s: {480 + ((epoch * 13) % 90)}
      </div>
    </div>
  );
}

export default function CodeBackdrop() {
  const reducedMotion = useReducedMotion();
  const particles = useMemo(() => buildParticles(30), []);
  const rainColumns = useMemo(() => buildRainColumns(22), []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none decorative-backdrop" aria-hidden="true">
      {/* background layer: faint binary rain for depth */}
      {!reducedMotion &&
        rainColumns.map((c) => (
          <span
            key={c.id}
            className="code-rain-particle font-mono text-sky-400/[0.04] whitespace-pre text-center"
            style={{
              left: `${c.left}%`,
              fontSize: `${c.size}px`,
              animationDuration: `${c.duration}s`,
              animationDelay: `${c.delay}s`,
            }}
          >
            {c.chars}
          </span>
        ))}

      {/* foreground layer: drifting AI/ML code fragments */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="code-particle font-mono text-sky-300/[0.09] whitespace-nowrap"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.text}
        </span>
      ))}

      <LiveMetrics reducedMotion={reducedMotion} />
    </div>
  );
}
