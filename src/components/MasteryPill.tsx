import { MASTERY_COLORS, MASTERY_LABELS, type MasteryLevel } from '../lib/mastery';

export default function MasteryPill({ level }: { level: MasteryLevel }) {
  const c = MASTERY_COLORS[level];
  return (
    <span
      className={`inline-flex items-center shrink-0 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-widest ${c.text} ${c.border} ${c.bg}`}
    >
      {MASTERY_LABELS[level]}
    </span>
  );
}
