/**
 * CARVIS. Multi-mode particle visualization for the homework assistant.
 * Floating particles with line connections between nearby ones.
 *
 * Recolored to the site's own blue palette (Tailwind sky-* plus the
 * "neuron" navy from tailwind.config.js) instead of the original red, so
 * this reads as an extension of the rest of the UI rather than a foreign
 * component.
 */

import * as THREE from "three";

export type OrbState = "idle" | "listening" | "thinking" | "speaking";

// Only these two members are ever read (see `animate`'s bass/mid sampling
// below). Structural, not `AnalyserNode` itself, so a real mic analyser
// AND a synthetic source (e.g. one driven by speech-synthesis word timing
// instead of a real audio graph. See lib/speechPulse.ts) both satisfy it.
export interface FrequencyDataSource {
  readonly frequencyBinCount: number;
  getByteFrequencyData(array: Uint8Array): void;
}

export interface Orb {
  setState(s: OrbState): void;
  setAnalyser(a: FrequencyDataSource | null): void;
  /** 0 = dim/glitchy, 1 = sharp/bright. Defaults to 1; unrelated to `state`. */
  setQuality(q: number): void;
  destroy(): void;
}

export function createOrb(canvas: HTMLCanvasElement): Orb {
  let destroyed = false;
  const N = 7000;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 1, 1000);
  camera.position.z = 80;

  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(N * 3);
  const vel = new Float32Array(N * 3);
  const phase = new Float32Array(N);

  for (let i = 0; i < N; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = Math.pow(Math.random(), 0.5) * 25;
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);
    phase[i] = Math.random() * 1000;
  }

  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

  const mat = new THREE.PointsMaterial({
    color: 0x38bdf8, // sky-400
    size: 0.4,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  const MAX_LINES = 8000;
  const linePos = new Float32Array(MAX_LINES * 6);
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
  lineGeo.setDrawRange(0, 0);

  const lineMat = new THREE.LineBasicMaterial({
    color: 0x0a1e4d, // "neuron" navy
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const lines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lines);

  const MAX_ELECTRONS = 200;
  const electronGeo = new THREE.BufferGeometry();
  const electronPos = new Float32Array(MAX_ELECTRONS * 3);
  electronGeo.setAttribute("position", new THREE.BufferAttribute(electronPos, 3));
  electronGeo.setDrawRange(0, 0);

  const electronMat = new THREE.PointsMaterial({
    color: 0xbae6fd, // sky-200: bright icy spark, stays inside the blue family
    size: 0.8,
    transparent: true,
    opacity: 1.0,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const electrons = new THREE.Points(electronGeo, electronMat);
  scene.add(electrons);

  interface Electron {
    sx: number;
    sy: number;
    sz: number;
    ex: number;
    ey: number;
    ez: number;
    t: number;
    speed: number;
  }
  const activeElectrons: Electron[] = [];
  let electronSpawnRate = 0;
  let targetElectronRate = 0;
  let lastElectronSpawn = 0;

  let activeConnections: { x1: number; y1: number; z1: number; x2: number; y2: number; z2: number }[] = [];

  let state: OrbState = "idle";
  let targetRadius = 25;
  let currentRadius = 25;
  let targetSpeed = 0.3;
  let currentSpeed = 0.3;
  let targetBright = 0.6;
  let currentBright = 0.6;
  let targetSize = 0.4;
  let currentSize = 0.4;
  let lineAmount = 0;
  let targetLineAmount = 0;
  const lineDistance = 8;

  let spinX = 0;
  let spinY = 0;
  let spinZ = 0;
  let transitionEnergy = 0;
  let lastState: OrbState = "idle";

  let cloudZ = 0;
  let cloudZVel = 0;

  let analyser: FrequencyDataSource | null = null;
  let freqData = new Uint8Array(64);
  let bass = 0;
  let mid = 0;

  // "Quality" is a second, independent axis from `state`: state is about
  // interaction phase (idle/thinking/speaking), quality is about how
  // well-trained the thing behind the orb currently is (1 = sharp and
  // bright, 0 = dim and glitchy). Chat callers never touch this, so it
  // defaults to 1 and this is a no-op for them; the Train Your Companion
  // page drives it from held-out accuracy.
  let quality = 1;
  let currentQuality = 1;

  const clock = new THREE.Clock();

  function animate() {
    if (destroyed) return;
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    switch (state) {
      case "idle":
        targetRadius = 28;
        targetSpeed = 0.2;
        targetBright = 0.5;
        targetSize = 0.35;
        targetLineAmount = 0.15;
        targetElectronRate = 0;
        break;
      case "listening":
        targetRadius = 22;
        targetSpeed = 0.3;
        targetBright = 0.65;
        targetSize = 0.4;
        targetLineAmount = 0.4;
        targetElectronRate = 0;
        break;
      case "thinking":
        targetRadius = 16;
        targetSpeed = 0.5;
        targetBright = 0.7;
        targetSize = 0.3;
        targetLineAmount = 1.0;
        targetElectronRate = 0.015;
        break;
      case "speaking":
        targetRadius = 18;
        targetSpeed = 0.2;
        targetBright = 0.7;
        targetSize = 0.4;
        targetLineAmount = 0.8;
        targetElectronRate = 0;
        break;
    }

    currentRadius += (targetRadius - currentRadius) * 0.02;
    currentSpeed += (targetSpeed - currentSpeed) * 0.02;
    currentBright += (targetBright - currentBright) * 0.02;
    currentSize += (targetSize - currentSize) * 0.02;
    lineAmount += (targetLineAmount - lineAmount) * 0.02;
    electronSpawnRate += (targetElectronRate - electronSpawnRate) * 0.02;
    currentQuality += (quality - currentQuality) * 0.03;

    // Low quality reads as "glitchy": occasional jerky rotation snaps,
    // on top of (below) the normal smooth drift.
    if (currentQuality < 0.6 && Math.random() < (1 - currentQuality) * 0.03) {
      spinX += (Math.random() - 0.5) * 0.15;
      spinY += (Math.random() - 0.5) * 0.15;
    }

    if (state !== lastState) {
      transitionEnergy = 1.0;
      lastState = state;
    }
    transitionEnergy *= 0.985;
    if (transitionEnergy > 0.05) {
      spinX += transitionEnergy * 0.012 * Math.sin(t * 1.7);
      spinY += transitionEnergy * 0.015;
      spinZ += transitionEnergy * 0.008 * Math.cos(t * 1.3);
    }

    bass = 0;
    mid = 0;
    if (analyser) {
      analyser.getByteFrequencyData(freqData);
      let bSum = 0;
      let mSum = 0;
      for (let i = 0; i < 8; i++) bSum += freqData[i];
      for (let i = 8; i < 24; i++) mSum += freqData[i];
      bass = bSum / (8 * 255);
      mid = mSum / (16 * 255);
    }

    let zTarget = Math.sin(t * 0.12) * 8;
    if (state === "thinking") zTarget = Math.sin(t * 0.3) * 15 + Math.sin(t * 0.9) * 6;
    else if (state === "speaking") zTarget = Math.sin(t * 0.15) * 6 - bass * 10;
    cloudZVel += (zTarget - cloudZ) * 0.008;
    cloudZVel *= 0.94;
    cloudZ += cloudZVel;

    points.rotation.x = spinX;
    points.rotation.y = spinY;
    points.rotation.z = spinZ;
    points.position.z = cloudZ;
    lines.rotation.x = spinX;
    lines.rotation.y = spinY;
    lines.rotation.z = spinZ;
    lines.position.z = cloudZ;

    const p = geo.getAttribute("position") as THREE.BufferAttribute;
    const a = p.array as Float32Array;

    for (let i = 0; i < N; i++) {
      const i3 = i * 3;
      const x = a[i3];
      const y = a[i3 + 1];
      const z = a[i3 + 2];
      const px = phase[i];

      vel[i3] += Math.sin(t * 0.05 + px) * 0.001 * currentSpeed;
      vel[i3 + 1] += Math.cos(t * 0.06 + px * 1.3) * 0.001 * currentSpeed;
      vel[i3 + 2] += Math.sin(t * 0.055 + px * 0.7) * 0.001 * currentSpeed;
      vel[i3] += Math.sin(t * 0.02 + px * 2.1 + y * 0.1) * 0.0008 * currentSpeed;
      vel[i3 + 1] += Math.cos(t * 0.025 + px * 1.7 + z * 0.1) * 0.0008 * currentSpeed;
      vel[i3 + 2] += Math.sin(t * 0.022 + px * 0.9 + x * 0.1) * 0.0008 * currentSpeed;

      const dist = Math.sqrt(x * x + y * y + z * z) || 0.01;
      const pull = Math.max(0, dist - currentRadius) * 0.002 + 0.0003;
      vel[i3] -= (x / dist) * pull;
      vel[i3 + 1] -= (y / dist) * pull;
      vel[i3 + 2] -= (z / dist) * pull;

      if (bass > 0.05) {
        vel[i3] += (x / dist) * bass * 0.02;
        vel[i3 + 1] += (y / dist) * bass * 0.02;
        vel[i3 + 2] += (z / dist) * bass * 0.02;
      }
      if (state === "speaking" && mid > 0.1) {
        const pulse = Math.sin(t * 8 + px);
        vel[i3] += (x / dist) * mid * 0.012 * pulse;
        vel[i3 + 1] += (y / dist) * mid * 0.012 * pulse;
      }

      vel[i3] *= 0.992;
      vel[i3 + 1] *= 0.992;
      vel[i3 + 2] *= 0.992;
      a[i3] += vel[i3];
      a[i3 + 1] += vel[i3 + 1];
      a[i3 + 2] += vel[i3 + 2];
    }
    p.needsUpdate = true;

    if (lineAmount > 0.01) {
      const lp = lineGeo.getAttribute("position") as THREE.BufferAttribute;
      const la = lp.array as Float32Array;
      let lineCount = 0;
      const maxDist = lineDistance * (1 + bass * 0.5);
      const maxDistSq = maxDist * maxDist;
      const step = Math.max(1, Math.floor(N / 600));

      for (let i = 0; i < N && lineCount < MAX_LINES; i += step) {
        const i3 = i * 3;
        const x1 = a[i3];
        const y1 = a[i3 + 1];
        const z1 = a[i3 + 2];
        for (let j = i + step; j < N && lineCount < MAX_LINES; j += step) {
          const j3 = j * 3;
          const dx = a[j3] - x1;
          const dy = a[j3 + 1] - y1;
          const dz = a[j3 + 2] - z1;
          if (dx * dx + dy * dy + dz * dz < maxDistSq) {
            const idx = lineCount * 6;
            la[idx] = x1;
            la[idx + 1] = y1;
            la[idx + 2] = z1;
            la[idx + 3] = a[j3];
            la[idx + 4] = a[j3 + 1];
            la[idx + 5] = a[j3 + 2];
            lineCount++;
          }
        }
      }
      lineGeo.setDrawRange(0, lineCount * 2);
      lp.needsUpdate = true;
      lineMat.opacity = lineAmount * 0.12 * (0.3 + currentQuality * 0.7);

      activeConnections = [];
      for (let c = 0; c < Math.min(lineCount, 500); c++) {
        const ci = c * 6;
        activeConnections.push({
          x1: la[ci],
          y1: la[ci + 1],
          z1: la[ci + 2],
          x2: la[ci + 3],
          y2: la[ci + 4],
          z2: la[ci + 5],
        });
      }
    } else {
      lineGeo.setDrawRange(0, 0);
      activeConnections = [];
    }

    if (activeConnections.length > 0 && electronSpawnRate > 0.005) {
      if (activeElectrons.length < 3 && t - lastElectronSpawn > 1.0) {
        const conn = activeConnections[Math.floor(Math.random() * activeConnections.length)];
        activeElectrons.push({
          sx: conn.x1,
          sy: conn.y1,
          sz: conn.z1,
          ex: conn.x2,
          ey: conn.y2,
          ez: conn.z2,
          t: 0,
          speed: 0.003 + Math.random() * 0.003,
        });
        lastElectronSpawn = t;
      }
    }

    const ep = electronGeo.getAttribute("position") as THREE.BufferAttribute;
    const ea = ep.array as Float32Array;
    let aliveCount = 0;

    for (let e = activeElectrons.length - 1; e >= 0; e--) {
      const el = activeElectrons[e];
      el.t += el.speed;
      if (el.t >= 1) {
        activeElectrons.splice(e, 1);
        continue;
      }
      const ei = aliveCount * 3;
      ea[ei] = el.sx + (el.ex - el.sx) * el.t;
      ea[ei + 1] = el.sy + (el.ey - el.sy) * el.t;
      ea[ei + 2] = el.sz + (el.ez - el.sz) * el.t;
      aliveCount++;
    }

    electronGeo.setDrawRange(0, aliveCount);
    ep.needsUpdate = true;

    electrons.rotation.x = spinX;
    electrons.rotation.y = spinY;
    electrons.rotation.z = spinZ;
    electrons.position.z = cloudZ;

    // Low quality dims and occasionally flickers the whole cloud. Reads
    // as "struggling to hold a signal" rather than just "darker".
    const qualityBrightness = 0.3 + currentQuality * 0.7;
    const flicker =
      currentQuality < 0.999 && Math.random() < (1 - currentQuality) * 0.05 ? 0.25 + Math.random() * 0.35 : 1;

    mat.opacity = (currentBright + bass * 0.08) * qualityBrightness * flicker;
    mat.size = currentSize + bass * 0.05;

    // Every tier stays inside the blue family so the orb never stops
    // reading as "the site's blue AI". Tiers shift value/saturation
    // (deep navy line-web vs. bright sky-blue points), not hue. Low
    // quality further desaturates toward gray on top of that, on both
    // materials, so a poorly-trained companion visibly looks washed out.
    const grayTarget = new THREE.Color(0x555555);
    const desaturate = (hex: number) => new THREE.Color(hex).lerp(grayTarget, (1 - currentQuality) * 0.55);

    if (state === "thinking") {
      mat.color.lerp(desaturate(0x7dd3fc), 0.015); // sky-300, brighter/alert
      lineMat.color.lerp(desaturate(0x1d4ed8), 0.015); // blue-700
    } else if (state === "speaking") {
      mat.color.lerp(desaturate(0x60a5fa), 0.015); // blue-400
      lineMat.color.lerp(desaturate(0x1d4ed8), 0.015);
    } else {
      mat.color.lerp(desaturate(0x38bdf8), 0.015); // sky-400
      lineMat.color.lerp(desaturate(0x0a1e4d), 0.015); // neuron navy
    }

    camera.position.x = Math.sin(t * 0.02) * 5;
    camera.position.y = Math.cos(t * 0.03) * 3;
    camera.lookAt(0, 0, cloudZ * 0.2);

    renderer.render(scene, camera);
  }

  function onResize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  const resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(canvas);
  onResize();
  animate();

  return {
    setState(s: OrbState) {
      state = s;
    },
    setAnalyser(a: FrequencyDataSource | null) {
      analyser = a;
      if (a) freqData = new Uint8Array(a.frequencyBinCount);
    },
    setQuality(q: number) {
      quality = Math.max(0, Math.min(1, q));
    },
    destroy() {
      destroyed = true;
      resizeObserver.disconnect();
      renderer.dispose();
    },
  };
}
