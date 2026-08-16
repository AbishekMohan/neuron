import { Link } from 'react-router-dom';
import { Brain, Wrench, Scale, Globe, Palette, Rocket, ArrowRight } from 'lucide-react';
import { Coverflow, CoverflowControls, CoverflowItem } from '../components/motion-ui/coverflow';
import { MODULES, STEP_ORDER } from '../data/modules';
import { useProgress } from '../context/ProgressContext';
import ProgressBar from '../components/ProgressBar';

const ICONS = { brain: Brain, wrench: Wrench, scale: Scale, globe: Globe, palette: Palette, rocket: Rocket };

function ModulesCoverflow() {
  const { moduleProgress } = useProgress();

  const items = MODULES.map((mod, index) => {
    const Icon = ICONS[mod.icon];
    const progress = moduleProgress[mod.id];

    return (
      <CoverflowItem key={mod.id} label={`Module ${index + 1} of ${MODULES.length}: ${mod.title}`}>
        <Link
          to={`/modules/${mod.id}`}
          className="group flex h-[360px] w-full flex-col justify-between rounded-2xl liquid-glass p-6 text-left"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Icon className="w-4 h-4 text-sky-300 shrink-0" strokeWidth={1.5} />
              <span className="text-white/30 text-xs">Module {index + 1}</span>
            </div>
            <h2 className="text-white text-lg font-normal mb-1">{mod.title}</h2>
            <p className="text-white/40 text-xs mb-3">{mod.tagline}</p>
            <p className="text-white/60 text-sm font-light leading-relaxed">{mod.description}</p>
          </div>

          <div>
            <ProgressBar
              percent={progress?.percent ?? 0}
              trailing={`${progress?.completed ?? 0}/${progress?.total ?? STEP_ORDER.length}`}
            />
            <div className="flex items-center gap-1 text-sky-300 text-xs mt-4 opacity-80 group-hover:opacity-100 transition-opacity">
              {progress?.isComplete ? 'Review module' : progress && progress.completed > 0 ? 'Continue' : 'Start module'}
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </Link>
      </CoverflowItem>
    );
  });

  return (
    <Coverflow items={items} rotation={22} aria-label="Learning modules, use the arrow keys to navigate">
      <CoverflowControls
        announce={(i, total) => `Showing module ${i + 1} of ${total}: ${MODULES[i].title}`}
        prevLabel="Previous module"
        nextLabel="Next module"
        dotsLabel="Choose a module"
      />
    </Coverflow>
  );
}

export default function ModulesOverview() {
  return (
    <section className="px-6 sm:px-8 md:px-12 pt-28 md:pt-36 pb-24 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <p className="text-sky-400 text-xs tracking-widest uppercase mb-3">Learning Modules</p>
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-light leading-tight tracking-tight max-w-2xl">
          Six modules. One path to AI literacy.
        </h1>
        <p className="text-white/50 text-sm mt-4 max-w-xl font-light">
          Work through them in order, or jump around. Your progress is saved automatically on this
          device.
        </p>

        <div className="mt-16">
          <ModulesCoverflow />
        </div>
      </div>
    </section>
  );
}
