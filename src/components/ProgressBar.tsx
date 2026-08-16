import { motion } from 'framer-motion';

type ProgressBarProps = {
  percent: number;
  label?: string;
  trailing?: string;
};

export default function ProgressBar({ percent, label, trailing }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <div className="w-full">
      {(label || trailing) && (
        <div className="flex justify-between items-center mb-2 text-xs text-white/60">
          {label && <span>{label}</span>}
          {trailing && <span>{trailing}</span>}
        </div>
      )}
      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
