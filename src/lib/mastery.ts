import { stepId, type StepId } from '../data/modules';

// Khan-Academy-style mastery tiers, replacing a flat completion percentage
// with something that actually answers "what do I know here". Derived
// straight from the same completedSteps Set the rest of the progress
// system already uses — no new state, just a different read of it.
export type MasteryLevel = 'not-started' | 'attempted' | 'familiar' | 'proficient' | 'mastered';

export const MASTERY_ORDER: MasteryLevel[] = ['not-started', 'attempted', 'familiar', 'proficient', 'mastered'];

export const MASTERY_LABELS: Record<MasteryLevel, string> = {
  'not-started': 'Not started',
  attempted: 'Attempted',
  familiar: 'Familiar',
  proficient: 'Proficient',
  mastered: 'Mastered',
};

// Tailwind text/border/bg color trio per tier, dimmest to brightest.
export const MASTERY_COLORS: Record<MasteryLevel, { text: string; border: string; bg: string }> = {
  'not-started': { text: 'text-white/30', border: 'border-white/10', bg: 'bg-white/[0.02]' },
  attempted: { text: 'text-white/60', border: 'border-white/15', bg: 'bg-white/5' },
  familiar: { text: 'text-amber-300/90', border: 'border-amber-400/25', bg: 'bg-amber-400/5' },
  proficient: { text: 'text-sky-300', border: 'border-sky-400/30', bg: 'bg-sky-400/5' },
  mastered: { text: 'text-emerald-300', border: 'border-emerald-400/30', bg: 'bg-emerald-400/5' },
};

/**
 * Not Started: nothing done.
 * Attempted: at least one step done, but article+flashcards+video aren't
 *   all done yet.
 * Familiar: the three "learning" steps (article, flashcards, video) are
 *   done, but the mini-game hasn't been played.
 * Proficient: all four pre-quiz steps are done, quiz not passed yet.
 * Mastered: the quiz step is complete, which only happens on a pass (see
 *   ProgressContext.submitQuiz) — never on a fail.
 */
export function getMasteryLevel(moduleId: string, completedSteps: Set<string>): MasteryLevel {
  const has = (step: StepId) => completedSteps.has(stepId(moduleId, step));

  if (has('quiz')) return 'mastered';
  if (has('article') && has('flashcards') && has('video') && has('game')) return 'proficient';
  if (has('article') && has('flashcards') && has('video')) return 'familiar';
  if (has('article') || has('flashcards') || has('video') || has('game')) return 'attempted';
  return 'not-started';
}
