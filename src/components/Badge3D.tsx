import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Award, Lock } from 'lucide-react';
import { buildBrainGeometry } from './Brain';
import type { BadgeShape } from '../data/badges';

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

// A small cluster of glowing nodes connected by lines, used by both the
// node-cluster badge and (at a smaller scale) as filler geometry.
function buildNodeCluster(count: number, radius: number) {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    const u = Math.random() * 2 - 1;
    const theta = Math.random() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    const r = radius * (0.55 + Math.random() * 0.45);
    points.push(new THREE.Vector3(r * s * Math.cos(theta), r * u, r * s * Math.sin(theta)));
  }

  const linePositions: number[] = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      if (points[i].distanceTo(points[j]) < radius * 0.9) {
        linePositions.push(points[i].x, points[i].y, points[i].z, points[j].x, points[j].y, points[j].z);
      }
    }
  }

  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

  const pointGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return { pointGeometry, lineGeometry };
}

function BadgeGeometry({ shape, color, earned }: { shape: BadgeShape; color: string; earned: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const clock = useRef(0);
  const opacity = earned ? 1 : 0.35;
  const emissiveIntensity = earned ? 0.9 : 0.15;

  const brainGeometry = useMemo(() => (shape === 'brain-mini' ? buildBrainGeometry() : null), [shape]);
  const cluster = useMemo(() => (shape === 'node-cluster' ? buildNodeCluster(14, 0.8) : null), [shape]);

  useFrame((_, delta) => {
    clock.current += delta;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
      groupRef.current.rotation.x = Math.sin(clock.current * 0.4) * 0.15;
      const pulse = 1 + Math.sin(clock.current * 1.4) * (earned ? 0.04 : 0.02);
      groupRef.current.scale.setScalar(pulse);
    }
  });

  const standardMat = (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={emissiveIntensity}
      roughness={0.35}
      metalness={0.4}
      transparent
      opacity={opacity}
    />
  );

  return (
    <group ref={groupRef}>
      {shape === 'spiked-core' && (
        <>
          <mesh geometry={new THREE.IcosahedronGeometry(0.85, 0)}>{standardMat}</mesh>
          <mesh geometry={new THREE.IcosahedronGeometry(0.85, 0)}>
            <meshBasicMaterial color={color} wireframe transparent opacity={opacity * 0.6} />
          </mesh>
          <mesh geometry={new THREE.SphereGeometry(0.32, 16, 16)}>
            <meshBasicMaterial color="#ffffff" transparent opacity={opacity * 0.9} />
          </mesh>
        </>
      )}

      {shape === 'brain-mini' && brainGeometry && (
        <group scale={0.42}>
          <mesh geometry={brainGeometry}>{standardMat}</mesh>
          <mesh geometry={brainGeometry}>
            <meshBasicMaterial color={color} wireframe transparent opacity={opacity * 0.5} />
          </mesh>
        </group>
      )}

      {shape === 'torus-knot' && (
        <>
          <mesh geometry={new THREE.TorusKnotGeometry(0.55, 0.17, 128, 16)}>{standardMat}</mesh>
          <mesh geometry={new THREE.TorusKnotGeometry(0.55, 0.17, 128, 16)} rotation={[0, Math.PI / 2, 0]}>
            <meshBasicMaterial color={color} wireframe transparent opacity={opacity * 0.25} />
          </mesh>
        </>
      )}

      {shape === 'gyroscope' && (
        <>
          <mesh geometry={new THREE.TorusGeometry(0.78, 0.06, 12, 48)} rotation={[Math.PI / 2, 0, 0]}>
            {standardMat}
          </mesh>
          <mesh geometry={new THREE.TorusGeometry(0.6, 0.05, 12, 48)} rotation={[0, Math.PI / 3, Math.PI / 4]}>
            {standardMat}
          </mesh>
          <mesh geometry={new THREE.TorusGeometry(0.42, 0.04, 12, 48)} rotation={[Math.PI / 4, 0, -Math.PI / 3]}>
            {standardMat}
          </mesh>
          <mesh geometry={new THREE.SphereGeometry(0.14, 12, 12)}>
            <meshBasicMaterial color="#ffffff" transparent opacity={opacity} />
          </mesh>
        </>
      )}

      {shape === 'wire-globe' && (
        <>
          <mesh geometry={new THREE.SphereGeometry(0.7, 20, 16)}>
            <meshBasicMaterial color={color} wireframe transparent opacity={opacity * 0.7} />
          </mesh>
          <mesh geometry={new THREE.SphereGeometry(0.68, 20, 16)}>{standardMat}</mesh>
          <mesh geometry={new THREE.TorusGeometry(0.92, 0.025, 8, 48)} rotation={[Math.PI / 2.4, 0.3, 0]}>
            <meshBasicMaterial color={color} transparent opacity={opacity * 0.8} />
          </mesh>
        </>
      )}

      {shape === 'crystal' && (
        <mesh geometry={new THREE.OctahedronGeometry(0.9, 0)}>
          <meshPhysicalMaterial
            color={color}
            emissive={color}
            emissiveIntensity={emissiveIntensity * 0.5}
            roughness={0.1}
            metalness={0.1}
            transmission={earned ? 0.55 : 0.15}
            thickness={0.6}
            ior={1.4}
            transparent
            opacity={opacity}
          />
        </mesh>
      )}

      {shape === 'tetra-lattice' && (
        <>
          <mesh geometry={new THREE.TetrahedronGeometry(0.85, 0)}>{standardMat}</mesh>
          {Array.from({ length: 4 }, (_, i) => {
            const angle = (i / 4) * Math.PI * 2;
            return (
              <mesh
                key={i}
                geometry={new THREE.TetrahedronGeometry(0.22, 0)}
                position={[Math.cos(angle) * 1.05, Math.sin(angle * 1.3) * 0.3, Math.sin(angle) * 1.05]}
              >
                <meshBasicMaterial color={color} transparent opacity={opacity * 0.85} />
              </mesh>
            );
          })}
        </>
      )}

      {shape === 'nested-rings' && (
        <>
          <mesh geometry={new THREE.TorusGeometry(0.5, 0.045, 10, 48)} rotation={[Math.PI / 2, 0, 0]}>
            {standardMat}
          </mesh>
          <mesh geometry={new THREE.TorusGeometry(0.68, 0.035, 10, 48)} rotation={[0.5, 0.3, 0]}>
            {standardMat}
          </mesh>
          <mesh geometry={new THREE.TorusGeometry(0.86, 0.03, 10, 48)} rotation={[-0.4, 0.7, 0.2]}>
            {standardMat}
          </mesh>
        </>
      )}

      {shape === 'node-cluster' && cluster && (
        <>
          <points geometry={cluster.pointGeometry}>
            <pointsMaterial color={color} size={0.12} sizeAttenuation transparent opacity={opacity} />
          </points>
          <lineSegments geometry={cluster.lineGeometry}>
            <lineBasicMaterial color={color} transparent opacity={opacity * 0.5} />
          </lineSegments>
        </>
      )}
    </group>
  );
}

export type Badge3DProps = {
  shape: BadgeShape;
  color: string;
  earned: boolean;
  size?: number;
};

export default function Badge3D({ shape, color, earned, size = 64 }: Badge3DProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div
        className={`flex items-center justify-center rounded-full ${
          earned ? 'bg-sky-400/10 text-sky-300' : 'bg-white/5 text-white/25'
        }`}
        style={{ width: size, height: size }}
      >
        {earned ? <Award className="w-1/2 h-1/2" /> : <Lock className="w-2/5 h-2/5" />}
      </div>
    );
  }

  return (
    <div style={{ width: size, height: size }}>
      <Canvas
        camera={{ position: [0, 0, 2.6], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[2, 2, 2]} intensity={1} color={color} />
        <BadgeGeometry shape={shape} color={color} earned={earned} />
        {earned && (
          <EffectComposer multisampling={0}>
            <Bloom intensity={0.7} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
