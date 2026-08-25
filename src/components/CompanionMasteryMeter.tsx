import { TrendingDown } from 'lucide-react';
import { MASTERY_TIER_LABELS, MASTERY_TIER_ORDER, type CompanionMasteryTier } from '../lib/companion';

// One hue, ramped by brightness rather than four different colors —
// untrained stays neutral gray (there's no signal yet to color), then
// each tier up is a brighter step of the same blue.
const TIER_COLORS: Record<CompanionMasteryTier, string> = {
  untrained: 'bg-white/15',
  learning: 'bg-sky-400/40',
  competent: 'bg-sky-400/70',
  mastered: 'bg-sky-400',
};

type CompanionMasteryMeterProps = {
  tier: CompanionMasteryTier;
  accuracy: number;
  /** The best held-out accuracy this exact classifier could ever reach on this data — "Mastered" means landing on it. */
  ceilingAccuracy: number;
  labelsCount: number;
  peakAccuracy: number;
};

// A segmented bar, not a flat percent fill: mastery here is a tier
// (Untrained -> Learning -> Competent -> Mastered) driven by held-out
// accuracy, not a continuous quantity, so the UI shouldn't imply it is.
export default function CompanionMasteryMeter({ tier, accuracy, ceilingAccuracy, labelsCount, peakAccuracy }: CompanionMasteryMeterProps) {
  const tierIndex = MASTERY_TIER_ORDER.indexOf(tier);
  const regressed = peakAccuracy > accuracy + 0.001 && labelsCount > 0;

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <p className="text-white/40 text-xs uppercase tracking-widest">Companion mastery</p>
        <p className="text-white/50 text-xs">{labelsCount} example{labelsCount === 1 ? '' : 's'} labeled</p>
      </div>

      <div className="flex gap-1.5">
        {MASTERY_TIER_ORDER.map((t, i) => (
          <div key={t} className="flex-1">
            <div className={`h-2 rounded-full ${i <= tierIndex ? TIER_COLORS[tier] : 'bg-white/8'} transition-colors duration-500`} />
            <p className={`mt-1.5 text-[10px] uppercase tracking-wide text-center ${i === tierIndex ? 'text-white/80' : 'text-white/25'}`}>
              {MASTERY_TIER_LABELS[t]}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 text-sm">
        <span className="text-white/60">
          Held-out accuracy: <span className="text-white font-normal">{Math.round(accuracy * 100)}%</span>
        </span>
        {regressed && (
          <span className="inline-flex items-center gap-1 text-white/50 text-xs">
            <TrendingDown className="w-3.5 h-3.5" />
            down from {Math.round(peakAccuracy * 100)}% best
          </span>
        )}
      </div>
      <p className="text-white/30 text-[11px] mt-1.5">
        Best possible for this data: {Math.round(ceilingAccuracy * 100)}% — "Mastered" needs 60+ labels within a
        hair of it.
      </p>
    </div>
  );
}
