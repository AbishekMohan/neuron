import { Link } from 'react-router-dom';
import { Brain, Wrench, Scale, Globe, Palette, Rocket, Leaf } from 'lucide-react';
import { MODULES } from '../data/modules';
import { useProgress } from '../context/ProgressContext';
import { getMasteryLevel } from '../lib/mastery';
import { MASTERY_COLORS } from '../lib/mastery';
import MasteryPill from './MasteryPill';

const ICONS = { brain: Brain, wrench: Wrench, scale: Scale, globe: Globe, palette: Palette, rocket: Rocket, leaf: Leaf };

// Groups the modules into the progression tiers a skill tree implies —
// purely a visual/organizational read of the existing curriculum order
// (data/modules.ts), not a new gating mechanism: every module stays
// reachable exactly as it is today, so this can't strand progress anyone
// already has out of order.
const TIERS: { title: string; moduleIds: string[] }[] = [
  { title: 'Foundations', moduleIds: ['fundamentals'] },
  { title: 'Tools', moduleIds: ['tools'] },
  { title: 'Ethics & Impact', moduleIds: ['ethics', 'real-world', 'sustainability'] },
  { title: 'Advanced', moduleIds: ['creativity', 'future'] },
];

export default function SkillTreeView() {
  const { moduleProgress, completedSteps } = useProgress();

  return (
    <div className="relative">
      {/* One continuous spine down the center; each tier's nodes sit on
          top of it, so it always reads as "one path" even where a tier
          branches into two modules. */}
      <div className="absolute left-1/2 top-6 bottom-6 w-px bg-white/10 -translate-x-1/2" aria-hidden="true" />

      <div className="relative flex flex-col gap-10">
        {TIERS.map((tier) => (
          <div key={tier.title}>
            <p className="text-center text-white/30 text-[11px] uppercase tracking-widest mb-4">{tier.title}</p>
            <div className="flex items-start justify-center gap-8 sm:gap-12">
              {tier.moduleIds.map((id) => {
                const mod = MODULES.find((m) => m.id === id);
                if (!mod) return null;
                const Icon = ICONS[mod.icon];
                const progress = moduleProgress[id];
                const mastery = getMasteryLevel(id, completedSteps);
                const c = MASTERY_COLORS[mastery];

                return (
                  <Link key={id} to={`/modules/${id}`} className="group flex flex-col items-center gap-2 w-28 sm:w-32">
                    <div
                      className={`relative w-16 h-16 rounded-full border flex items-center justify-center transition-transform group-hover:scale-105 ${c.border} ${c.bg}`}
                    >
                      <Icon className={`w-6 h-6 ${c.text}`} strokeWidth={1.5} />
                    </div>
                    <span className="text-white/70 text-xs text-center group-hover:text-white transition-colors leading-tight">
                      {mod.title}
                    </span>
                    <MasteryPill level={mastery} />
                    <span className="text-white/25 text-[10px]">{progress?.percent ?? 0}%</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
