// Shown next to genuinely AI/model-generated predictions (not decorative
//. See lib/companion.ts's predictConfidence). Deliberately doesn't
// recolor "confident" as automatically good: a badly-trained model can
// be just as confident as a well-trained one, which is the whole point
// of pairing this with `correct` when the answer is already known.
type ConfidenceMeterProps = {
  confidence: number; // 0-1
  correct?: boolean; // when known, lets the meter show "confident but wrong"
};

export default function ConfidenceMeter({ confidence, correct }: ConfidenceMeterProps) {
  const pct = Math.round(confidence * 100);
  const isHighButWrong = correct === false && confidence >= 0.75;

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full ${isHighButWrong ? 'bg-white/40' : 'bg-sky-400'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-[11px] ${isHighButWrong ? 'text-white/50' : 'text-white/40'}`}>
        {pct}% confident{isHighButWrong ? ', wrong' : ''}
      </span>
    </div>
  );
}
