import { FileText, Layers, Video as VideoIcon, Gamepad2, ClipboardCheck, CheckCircle2, Circle, Lock } from 'lucide-react';
import { STEP_ORDER, STEP_LABELS, type StepId } from '../../data/modules';
import ProgressBar from '../ProgressBar';

const STEP_ICONS: Record<StepId, typeof FileText> = {
  article: FileText,
  flashcards: Layers,
  video: VideoIcon,
  game: Gamepad2,
  quiz: ClipboardCheck,
};

type StepSidebarProps = {
  moduleTitle: string;
  ModuleIcon: typeof FileText;
  currentStep: StepId;
  onSelectStep: (step: StepId) => void;
  isStepComplete: (step: StepId) => boolean;
  isQuizUnlocked: boolean;
  completedCount: number;
  xpEarned: number;
};

export default function StepSidebar({
  moduleTitle,
  ModuleIcon,
  currentStep,
  onSelectStep,
  isStepComplete,
  isQuizUnlocked,
  completedCount,
  xpEarned,
}: StepSidebarProps) {
  return (
    <>
      {/* Desktop: sticky vertical checklist */}
      <nav
        aria-label={`${moduleTitle} unit steps`}
        className="hidden md:flex md:flex-col md:sticky md:top-28 w-64 shrink-0 rounded-2xl liquid-glass p-5 h-fit"
      >
        <div className="flex items-center gap-2 mb-5">
          <ModuleIcon className="w-4 h-4 text-sky-300 shrink-0" strokeWidth={1.5} />
          <p className="text-white text-sm font-normal leading-tight">{moduleTitle}</p>
        </div>

        <ol className="flex flex-col gap-1">
          {STEP_ORDER.map((step) => {
            const Icon = STEP_ICONS[step];
            const complete = isStepComplete(step);
            const locked = step === 'quiz' && !isQuizUnlocked;
            const active = currentStep === step;

            return (
              <li key={step}>
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => onSelectStep(step)}
                  aria-current={active ? 'step' : undefined}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors text-left ${
                    active ? 'bg-white/10 text-white' : locked ? 'text-white/25 cursor-not-allowed' : 'text-white/60 hover:bg-white/5 hover:text-white/90'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
                  <span className="flex-1">{STEP_LABELS[step]}</span>
                  {locked ? (
                    <Lock className="w-3.5 h-3.5 shrink-0 text-white/25" />
                  ) : complete ? (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-sky-300" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 shrink-0 text-white/20" />
                  )}
                </button>
              </li>
            );
          })}
        </ol>

        <div className="mt-5 pt-4 border-t border-white/10">
          <ProgressBar percent={(completedCount / STEP_ORDER.length) * 100} trailing={`${completedCount}/${STEP_ORDER.length}`} />
          <p className="text-white/40 text-xs mt-3">{xpEarned} XP earned in this module</p>
        </div>
      </nav>

      {/* Mobile: horizontal stepper */}
      <nav aria-label={`${moduleTitle} unit steps`} className="md:hidden -mx-1 overflow-x-auto pb-1">
        <ol className="flex gap-2 px-1 min-w-max">
          {STEP_ORDER.map((step) => {
            const Icon = STEP_ICONS[step];
            const complete = isStepComplete(step);
            const locked = step === 'quiz' && !isQuizUnlocked;
            const active = currentStep === step;

            return (
              <li key={step}>
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => onSelectStep(step)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs whitespace-nowrap border transition-colors ${
                    active
                      ? 'border-white/60 text-white'
                      : locked
                        ? 'border-white/10 text-white/25'
                        : 'border-white/10 text-white/60'
                  }`}
                >
                  <Icon className="w-3 h-3" strokeWidth={1.75} />
                  {STEP_LABELS[step]}
                  {locked ? (
                    <Lock className="w-3 h-3 text-white/25" />
                  ) : complete ? (
                    <CheckCircle2 className="w-3 h-3 text-sky-300" />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
