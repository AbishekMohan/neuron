import { useEffect, useRef } from 'react';

// A live blue neuron network, drawn on canvas: nodes drift slowly, nearby
// ones connect with faint dendrite-like lines, and every so often a
// brighter pulse travels along a connection like a signal firing. Built to
// replace a stock photo behind the "How it works" showcase window with
// something that actually matches the site (one blue, particle-based,
// literally the site's own name) instead of a generic mountain backdrop.
//
// Canvas, not WebGL: this sits behind a static-ish demo frame, not the
// full-screen orb, so a 2D context is plenty and far cheaper. Respects
// prefers-reduced-motion by drawing one settled frame and never starting
// the animation loop.

type Node = { x: number; y: number; vx: number; vy: number; r: number };
type Pulse = { a: number; b: number; t: number; speed: number };

const NODE_COUNT = 46;
const LINK_DIST = 150;
const PULSE_SPAWN_MS = 260;

function useReducedMotion() {
  const ref = useRef(false);
  useEffect(() => {
    ref.current = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  }, []);
  return ref;
}

export default function NeuronBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    let raf = 0;
    let lastPulseAt = 0;

    const seed = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: 1.1 + Math.random() * 1.6,
      }));
      pulses = [];
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);

      const bg = ctx.createRadialGradient(width * 0.5, height * 0.4, 0, width * 0.5, height * 0.4, Math.max(width, height) * 0.8);
      bg.addColorStop(0, '#0a1a3a');
      bg.addColorStop(1, '#000000');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // Links between nearby nodes, fading with distance.
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist > LINK_DIST) continue;
          const alpha = (1 - dist / LINK_DIST) * 0.22;
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }

      // Signal pulses traveling along a link.
      for (const p of pulses) {
        const a = nodes[p.a];
        const b = nodes[p.b];
        if (!a || !b) continue;
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 7);
        glow.addColorStop(0, 'rgba(224, 242, 254, 0.9)');
        glow.addColorStop(1, 'rgba(224, 242, 254, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fill();
      }

      // Nodes themselves, soft glowing dots.
      for (const n of nodes) {
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4);
        glow.addColorStop(0, 'rgba(125, 211, 252, 0.9)');
        glow.addColorStop(1, 'rgba(125, 211, 252, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(224, 242, 254, 0.95)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = (now: number) => {
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }

      if (now - lastPulseAt > PULSE_SPAWN_MS && nodes.length > 1) {
        lastPulseAt = now;
        const a = Math.floor(Math.random() * nodes.length);
        let b = Math.floor(Math.random() * nodes.length);
        if (b === a) b = (b + 1) % nodes.length;
        if (Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y) < LINK_DIST * 1.3) {
          pulses.push({ a, b, t: 0, speed: 0.012 + Math.random() * 0.01 });
        }
      }
      pulses = pulses.filter((p) => p.t < 1);
      for (const p of pulses) p.t += p.speed;

      drawFrame();
      raf = requestAnimationFrame(step);
    };

    seed();
    drawFrame();

    if (!reducedMotion.current) {
      raf = requestAnimationFrame(step);
    }

    const onResize = () => {
      seed();
      drawFrame();
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />;
}
