export type WorkLogEntry = {
  date: string;
  member: string;
  hours: number;
  task: string;
  deliverable: string;
};

export const WORK_LOG: WorkLogEntry[] = [
  { date: '2026-08-15', member: 'Abishek Mohan', hours: 6, task: 'Project scaffolding and core architecture', deliverable: 'Vite+React setup, Tailwind config, initial file structure' },
  { date: '2026-08-16', member: 'Abishek Mohan', hours: 5, task: 'Implement routing and Supabase auth/progress schema', deliverable: 'App routes, Leaderboard DB schema and functions' },
  { date: '2026-08-16', member: 'Faiz Khan', hours: 6, task: 'Build Clash Royale style mini-game layout', deliverable: 'RoyaleGame component, CSS grids, and landing page edits' },
  { date: '2026-08-17', member: 'Abishek Mohan', hours: 4, task: 'Gamification engine and tracking', deliverable: 'XP system, mastery levels, activity streaks in ProgressContext' },
  { date: '2026-08-25', member: 'Abishek Mohan', hours: 8, task: 'Challenges suite and Companion AI prototype', deliverable: 'Train Your Companion perceptron, 7th module content' },
  { date: '2026-08-26', member: 'Abishek Mohan', hours: 5, task: 'UI cleanup and responsive layout', deliverable: 'Removed box chrome, widened content containers, fixed flex bugs' },
  { date: '2026-08-27', member: 'Abishek Mohan', hours: 7, task: 'Accessibility tools and 3D visual upgrades', deliverable: 'Light mode, dyslexia font, high contrast settings; Neuron backdrop bloom' },
  { date: '2026-08-29', member: 'Abishek Mohan', hours: 4, task: 'Video integration and final accessibility audit', deliverable: 'Module videos wired, permanent high contrast default' },
  { date: '2026-09-17', member: 'Team', hours: 4, task: 'TSA Webmaster Compliance & Performance', deliverable: 'Copyright checklist, Work log, Font self-hosting, SEO meta tags' }
];
