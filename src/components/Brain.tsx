import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Cheap layered-sine pseudo-noise, no extra deps.
function noise3(x: number, y: number, z: number) {
  return (
    Math.sin(x * 1.8 + y * 0.6) * 0.5 +
    Math.sin(y * 2.4 + z * 1.3) * 0.3 +
    Math.sin(z * 1.5 + x * 2.2) * 0.2
  );
}

// Fractal sum of the noise above, stacking a few octaves of increasing
// frequency and decreasing amplitude. This is what reads as folded
// gyri/sulci instead of smooth, gentle bumps.
function fbmNoise(x: number, y: number, z: number) {
  let value = 0;
  let amp = 1;
  let freq = 1;
  for (let o = 0; o < 3; o++) {
    value += noise3(x * freq, y * freq, z * freq) * amp;
    amp *= 0.5;
    freq *= 2.15;
  }
  return value;
}

// The brain's surface radius in a given direction, before the oval squash.
// Shared by the surface mesh builder and the interior point sampler so
// internal "stuff" stays inboard of the shell.
function shellRadius(dir: THREE.Vector3) {
  const folds = fbmNoise(dir.x * 2.5, dir.y * 2.5, dir.z * 2.5) * 0.24;
  const groove = Math.exp(-Math.pow(dir.x * 3.2, 2)) * 0.34;
  const temporalLobes = Math.exp(-Math.pow((Math.abs(dir.x) - 0.75) * 4, 2)) * Math.max(0, -dir.y) * 0.18;

  let radius = 2 + folds - groove + temporalLobes;

  // taper the underside so it narrows toward the brain-stem instead of
  // staying a perfect rounded bottom
  if (dir.y < 0) radius *= 1 - 0.18 * Math.min(1, -dir.y);

  return radius;
}

function squash(v: THREE.Vector3) {
  v.y *= 0.86;
  v.z *= 1.08;
  return v;
}

// Exported so Badge3D.tsx can reuse this exact folded-surface builder at a
// smaller scale for the "Fundamentals Master" badge, instead of
// reimplementing brain-like geometry from scratch.
export function buildBrainGeometry() {
  const geometry = new THREE.IcosahedronGeometry(2, 4);
  const pos = geometry.attributes.position;
  const v = new THREE.Vector3();
  const dir = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    dir.copy(v).normalize();

    const radius = shellRadius(dir);
    v.copy(dir).multiplyScalar(radius);
    squash(v);

    pos.setXYZ(i, v.x, v.y, v.z);
  }

  geometry.computeVertexNormals();
  return geometry;
}

// Sample a subset of surface vertices and connect nearby pairs, a sparse
// "neural link" overlay traced onto the surface.
function buildLinkGeometry(source: THREE.BufferGeometry, maxLinks: number, maxDist: number) {
  const pos = source.attributes.position;
  const step = Math.max(1, Math.floor(pos.count / 420));
  const points: THREE.Vector3[] = [];

  for (let i = 0; i < pos.count; i += step) {
    points.push(new THREE.Vector3().fromBufferAttribute(pos, i));
  }

  const linePositions: number[] = [];
  let links = 0;

  for (let i = 0; i < points.length && links < maxLinks; i++) {
    for (let j = i + 1; j < points.length && links < maxLinks; j++) {
      if (points[i].distanceTo(points[j]) < maxDist) {
        linePositions.push(points[i].x, points[i].y, points[i].z, points[j].x, points[j].y, points[j].z);
        links++;
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  return geometry;
}

// Random points filling the volume of the brain, not just its surface.
// This is the "stuff inside" a hollow wireframe shell wouldn't have.
function buildInteriorPoints(count: number) {
  const positions = new Float32Array(count * 3);
  const dir = new THREE.Vector3();
  const v = new THREE.Vector3();

  for (let i = 0; i < count; i++) {
    const u = Math.random() * 2 - 1;
    const theta = Math.random() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    dir.set(s * Math.cos(theta), u, s * Math.sin(theta));

    const maxR = shellRadius(dir) * 0.8;
    const r = maxR * Math.cbrt(Math.random());

    v.copy(dir).multiplyScalar(r);
    squash(v);

    positions[i * 3] = v.x;
    positions[i * 3 + 1] = v.y;
    positions[i * 3 + 2] = v.z;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  return geometry;
}

const WIRE_OPACITY = 0.4;
const SHELL_OPACITY = 0.1;
const POINT_SIZE = 0.03;
const INTERIOR_SIZE = 0.024;
const LINK_OPACITY = 0.26;
const INTERIOR_LINK_OPACITY = 0.22;

export default function Brain() {
  const groupRef = useRef<THREE.Group>(null);
  const clockRef = useRef(0);

  const brainGeometry = useMemo(() => buildBrainGeometry(), []);
  const linkGeometry = useMemo(() => buildLinkGeometry(brainGeometry, 260, 0.55), [brainGeometry]);
  const interiorGeometry = useMemo(() => buildInteriorPoints(700), []);
  const interiorLinkGeometry = useMemo(() => buildLinkGeometry(interiorGeometry, 180, 0.42), [interiorGeometry]);

  useFrame((_, delta) => {
    clockRef.current += delta;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
      const breathe = 1 + Math.sin(clockRef.current * 0.6) * 0.015;
      groupRef.current.scale.setScalar(breathe);
    }
  });

  return (
    <group ref={groupRef}>
      {/* faint lit shell: gives the folded surface actual shading instead
          of being a hollow wire cage, and lets everything inside show through */}
      <mesh geometry={brainGeometry}>
        <meshStandardMaterial
          color="#1d4ed8"
          transparent
          opacity={SHELL_OPACITY}
          roughness={1}
          metalness={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <mesh geometry={brainGeometry}>
        <meshBasicMaterial
          color="#3b82f6"
          wireframe
          transparent
          opacity={WIRE_OPACITY}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <points geometry={brainGeometry}>
        <pointsMaterial
          color="#7dd3fc"
          size={POINT_SIZE}
          sizeAttenuation
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <lineSegments geometry={linkGeometry}>
        <lineBasicMaterial
          color="#60a5fa"
          transparent
          opacity={LINK_OPACITY}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* interior "stuff": a volume of glowing points and their links,
          visible through the translucent shell */}
      <points geometry={interiorGeometry}>
        <pointsMaterial
          color="#bfe4ff"
          size={INTERIOR_SIZE}
          sizeAttenuation
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <lineSegments geometry={interiorLinkGeometry}>
        <lineBasicMaterial
          color="#93c5fd"
          transparent
          opacity={INTERIOR_LINK_OPACITY}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}
