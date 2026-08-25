import { MODULES } from './modules';

export type ModuleProgress = Record<
  string,
  { completed: number; total: number; percent: number; isComplete: boolean }
>;

export type BadgeCheckContext = {
  completedSteps: Set<string>;
  xp: number;
  moduleProgress: ModuleProgress;
  /** How many Train Your Companion categories have reached "Mastered" (held-out accuracy, not click count). */
  companionMasteredCount: number;
};

// Drives the procedural 3D geometry in Badge3D.tsx. No two badges share a
// shape, so every badge is visually distinct without any asset files.
export type BadgeShape =
  | 'spiked-core'
  | 'brain-mini'
  | 'torus-knot'
  | 'gyroscope'
  | 'wire-globe'
  | 'crystal'
  | 'tetra-lattice'
  | 'nested-rings'
  | 'node-cluster'
  | 'neural-web';

export type Badge = {
  id: string;
  title: string;
  description: string;
  shape: BadgeShape;
  color: string;
  check: (ctx: BadgeCheckContext) => boolean;
};

export const BADGES: Badge[] = [
  {
    id: 'first-spark',
    title: 'First Spark',
    description: 'Complete your first step in any module.',
    shape: 'spiked-core',
    color: '#7dd3fc',
    check: ({ completedSteps }) => completedSteps.size >= 1,
  },
  {
    id: 'fundamentals-master',
    title: 'Fundamentals Master',
    description: 'Master every step in AI Fundamentals.',
    shape: 'brain-mini',
    color: '#38bdf8',
    check: ({ moduleProgress }) => moduleProgress.fundamentals?.isComplete ?? false,
  },
  {
    id: 'toolsmith',
    title: 'Toolsmith',
    description: 'Master every step in Practical AI Tools & Techniques.',
    shape: 'torus-knot',
    color: '#60a5fa',
    check: ({ moduleProgress }) => moduleProgress.tools?.isComplete ?? false,
  },
  {
    id: 'ethics-advocate',
    title: 'Ethics Advocate',
    description: 'Master every step in Ethical AI Usage.',
    shape: 'gyroscope',
    color: '#93c5fd',
    check: ({ moduleProgress }) => moduleProgress.ethics?.isComplete ?? false,
  },
  {
    id: 'world-explorer',
    title: 'World Explorer',
    description: 'Master every step in AI in the Real World.',
    shape: 'wire-globe',
    color: '#38bdf8',
    check: ({ moduleProgress }) => moduleProgress['real-world']?.isComplete ?? false,
  },
  {
    id: 'creative-collaborator',
    title: 'Creative Collaborator',
    description: 'Master every step in AI & Creativity.',
    shape: 'crystal',
    color: '#a5b4fc',
    check: ({ moduleProgress }) => moduleProgress.creativity?.isComplete ?? false,
  },
  {
    id: 'future-ready',
    title: 'Future Ready',
    description: 'Master every step in The Future of AI.',
    shape: 'tetra-lattice',
    color: '#7dd3fc',
    check: ({ moduleProgress }) => moduleProgress.future?.isComplete ?? false,
  },
  {
    id: 'full-circuit',
    title: 'Full Circuit',
    description: 'Master every learning module.',
    shape: 'nested-rings',
    color: '#facc15',
    check: ({ moduleProgress }) => MODULES.every((m) => moduleProgress[m.id]?.isComplete),
  },
  {
    id: 'neuron-activated',
    title: 'Neuron Activated',
    description: 'Earn 500 XP.',
    shape: 'node-cluster',
    color: '#f472b6',
    check: ({ xp }) => xp >= 500,
  },
  {
    id: 'model-trainer',
    title: 'Model Trainer',
    description: 'Train your companion to Mastered — measured by its accuracy on unseen examples, not clicks.',
    shape: 'neural-web',
    color: '#7dd3fc',
    check: ({ companionMasteredCount }) => companionMasteredCount >= 1,
  },
  {
    id: 'green-computing',
    title: 'Green Computing',
    description: 'Master every step in Sustainable & Efficient AI.',
    shape: 'gyroscope',
    color: '#38bdf8',
    check: ({ moduleProgress }) => moduleProgress.sustainability?.isComplete ?? false,
  },
];
