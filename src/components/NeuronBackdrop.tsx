import { useEffect, useRef } from 'react';

// A live blue neuron network, drawn on canvas: nodes drift slowly across
// the whole frame, nearby ones connect with dendrite-like links, and
// pulses travel along connections like a signal firing. A subtle depth
// value per node (size/brightness/speed) gives it real dimensionality
// without collapsing everything into one cluster. Bloom is a real blur
// pass (an offscreen glow layer, blurred once and composited with
// 'lighter'), tuned to stay soft rather than blowing out to white where
// nodes overlap.
//
// Canvas 2D, not WebGL: this sits behind a mostly-static demo frame, not
// the full-screen orb, so a 2D context is plenty and far cheaper. Respects
// prefers-reduced-motion by drawing one settled frame and never starting
// the animation loop.

type Node = { x: number; y: number; vx: number; vy: number; r: number; depth: number };
type Pulse = { a: number; b: number; t: number; speed: number };

const NODE_COUNT = 80;
const LINK_DIST = 165;
const PULSE_SPAWN_MS = 200;

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

    const glowCanvas = document.createElement('canvas');
    const glowCtx = glowCanvas.getContext('2d');
    if (!glowCtx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    let raf = 0;
    let lastPulseAt = 0;

    const seed = () => {
      const rect = container.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      for (const c of [canvas, glowCanvas]) {
        c.width = width * dpr;
        c.height = height * dpr;
        c.style.width = `${width}px`;
        c.style.height = `${height}px`;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      glowCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      nodes = Array.from({ length: NODE_COUNT }, () => {
        const depth = Math.random(); // 0 = far/small/dim, 1 = near/big/bright
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * (0.05 + depth * 0.1),
          vy: (Math.random() - 0.5) * (0.05 + depth * 0.1),
          r: 0.9 + depth * 2,
          depth,
        };
      });
      pulses = [];
    };

    const drawFrame = () => {
      const bg = ctx.createRadialGradient(width * 0.5, height * 0.4, 0, width * 0.5, height * 0.4, Math.max(width, height) * 0.8);
      bg.addColorStop(0, '#0b1c40');
      bg.addColorStop(0.6, '#020817');
      bg.addColorStop(1, '#000000');
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // Links between nearby nodes, fading with distance and brightened
      // slightly by how "near" (depth) the pair is.
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist > LINK_DIST) continue;
          const near = (nodes[i].depth + nodes[j].depth) / 2;
          const alpha = (1 - dist / LINK_DIST) * (0.1 + near * 0.28);
          ctx.strokeStyle = `rgba(103, 190, 248, ${alpha})`;
          ctx.lineWidth = 0.6 + near * 0.7;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }

      // Glow source layer: modest, capped-brightness shapes only, blurred
      // once and composited additively so overlaps soften instead of
      // blowing out to solid white.
      glowCtx.clearRect(0, 0, width, height);
      for (const n of nodes) {
        glowCtx.fillStyle = `rgba(56, 189, 248, ${0.16 + n.depth * 0.22})`;
        glowCtx.beginPath();
        glowCtx.arc(n.x, n.y, n.r * 2.2, 0, Math.PI * 2);
        glowCtx.fill();
      }
      for (const p of pulses) {
        const a = nodes[p.a];
        const b = nodes[p.b];
        if (!a || !b) continue;
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        glowCtx.fillStyle = 'rgba(224, 242, 254, 0.55)';
        glowCtx.beginPath();
        glowCtx.arc(x, y, 4, 0, Math.PI * 2);
        glowCtx.fill();
      }
      ctx.save();
      ctx.filter = 'blur(7px)';
      ctx.globalAlpha = 0.75;
      ctx.globalCompositeOperation = 'lighter';
      ctx.drawImage(glowCanvas, 0, 0, width, height);
      ctx.restore();

      // Crisp node cores on top, far ones dim and small, near ones bright.
      for (const n of nodes) {
        ctx.fillStyle = `rgba(224, 242, 254, ${0.5 + n.depth * 0.5})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Pulse cores with a short fading trail, on top of everything.
      for (const p of pulses) {
        const a = nodes[p.a];
        const b = nodes[p.b];
        if (!a || !b) continue;
        for (let k = 0; k < 3; k++) {
          const trailT = Math.max(0, p.t - k * 0.05);
          const x = a.x + (b.x - a.x) * trailT;
          const y = a.y + (b.y - a.y) * trailT;
          ctx.fillStyle = `rgba(240, 249, 255, ${0.9 - k * 0.28})`;
          ctx.beginPath();
          ctx.arc(x, y, 2 - k * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
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
        if (Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y) < LINK_DIST * 1.2) {
          pulses.push({ a, b, t: 0, speed: 0.014 + Math.random() * 0.012 });
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
