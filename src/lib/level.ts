// Shared level thresholds. Used by ProgressContext for the signed-in
// user's own XP, and by Leaderboard/Profile to compute a level for other
// users' aggregate XP returned from the `leaderboard` view.
export const LEVELS = [
  { name: 'Novice', minXp: 0 },
  { name: 'Learner', minXp: 175 },
  { name: 'Practitioner', minXp: 400 },
  { name: 'AI-Literate Scholar', minXp: 675 },
  { name: 'Neuron Master', minXp: 950 },
];

export type Level = {
  name: string;
  index: number;
  xpIntoLevel: number;
  xpForNext: number;
};

export function getLevel(xp: number): Level {
  let index = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].minXp) index = i;
  }
  const current = LEVELS[index];
  const next = LEVELS[index + 1];
  return {
    name: current.name,
    index,
    xpIntoLevel: xp - current.minXp,
    xpForNext: next ? next.minXp - current.minXp : 0,
  };
}
