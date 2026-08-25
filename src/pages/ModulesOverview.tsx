import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Wrench, Scale, Globe, Palette, Rocket, Leaf, ArrowRight, List, GitBranch } from 'lucide-react';
import { MODULES } from '../data/modules';
import { useProgress } from '../context/ProgressContext';
import { getMasteryLevel } from '../lib/mastery';
import ProgressBar from '../components/ProgressBar';
import MasteryPill from '../components/MasteryPill';
import BorderGlow from '../components/BorderGlow';
import SkillTreeView from '../components/SkillTreeView';

const ICONS = { brain: Brain, wrench: Wrench, scale: Scale, globe: Globe, palette: Palette, rocket: Rocket, leaf: Leaf };

// Blue glow, matching the site's sky/blue palette rather than the
// component's default purple-pink-blue mix.
const GLOW_COLORS = ['#38bdf8', '#3b82f6', '#7dd3fc'];

function ModuleRow({ index, isNext }: { index: number; isNext: boolean }) {
  const mod = MODULES[index];
  const Icon = ICONS[mod.icon];
  const { moduleProgress, completedSteps } = useProgress();
  const progress = moduleProgress[mod.id];
  const mastery = getMasteryLevel(mod.id, completedSteps);

  const row = (
    <Link
      to={`/modules/${mod.id}`}
      className="group flex items-center gap-4 rounded-xl px-4 py-4 hover:bg-white/[0.03] transition-colors"
    >
      <Icon className="w-4 h-4 text-sky-300 shrink-0" strokeWidth={1.5} />

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-white/80 text-sm group-hover:text-white transition-colors">{mod.title}</span>
          <span className="text-white/30 text-xs truncate">{mod.tagline}</span>
          <span className="ml-auto flex items-center gap-2 shrink-0">
            <MasteryPill level={mastery} />
            {isNext && <span className="text-sky-300 text-[10px] uppercase tracking-widest">Up next</span>}
          </span>
        </div>
        <ProgressBar percent={progress?.percent ?? 0} />
      </div>

      <div className="hidden sm:flex items-center gap-1 text-sky-300 text-xs shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
        {progress?.isComplete ? 'Review' : progress && progress.completed > 0 ? 'Continue' : 'Start'}
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </Link>
  );

  if (!isNext) return row;

  return (
    <BorderGlow borderRadius={12} backgroundColor="#05070d" glowColor="199 93 60" colors={GLOW_COLORS} glowRadius={20} glowIntensity={1} coneSpread={30} animated>
      {row}
    </BorderGlow>
  );
}

export default function ModulesOverview() {
  const { moduleProgress } = useProgress();
  const nextModuleId = MODULES.find((mod) => !moduleProgress[mod.id]?.isComplete)?.id;
  const [view, setView] = useState<'list' | 'tree'>('list');

  return (
    <section className="px-6 sm:px-8 md:px-12 pt-28 md:pt-36 pb-24 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <p className="text-sky-400 text-xs tracking-widest uppercase mb-3">Learning Modules</p>
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-light leading-tight tracking-tight max-w-2xl">
              Seven modules. One path to AI literacy.
            </h1>
          </div>
          <div className="flex items-center gap-1 rounded-full border border-white/10 p-1 shrink-0 sm:mt-1">
            <button
              type="button"
              onClick={() => setView('list')}
              aria-label="List view"
              aria-pressed={view === 'list'}
              className={`p-1.5 rounded-full transition-colors ${view === 'list' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setView('tree')}
              aria-label="Skill tree view"
              aria-pressed={view === 'tree'}
              className={`p-1.5 rounded-full transition-colors ${view === 'tree' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
            >
              <GitBranch className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-white/50 text-sm mt-4 max-w-xl font-light">
          Work through them in order, or jump around. Your progress is saved automatically on this
          device.
        </p>

        {view === 'list' ? (
          <div className="mt-12 rounded-2xl liquid-glass p-3 sm:p-4">
            <div className="flex flex-col gap-1">
              {MODULES.map((mod, index) => (
                <ModuleRow key={mod.id} index={index} isNext={mod.id === nextModuleId} />
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-12 rounded-2xl liquid-glass p-6 sm:p-8">
            <SkillTreeView />
          </div>
        )}
      </div>
    </section>
  );
}
