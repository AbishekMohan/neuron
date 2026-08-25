import { AnimatePresence, motion } from 'framer-motion';
import { X, Calendar, Lock } from 'lucide-react';
import Badge3D from './Badge3D';
import type { Badge } from '../data/badges';

type BadgeModalProps = {
  badge: Badge | null;
  earned: boolean;
  earnedAt: string | undefined;
  onClose: () => void;
};

export default function BadgeModal({ badge, earned, earnedAt, onClose }: BadgeModalProps) {
  return (
    <AnimatePresence>
      {badge && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            role="dialog"
            aria-label={`${badge.title} badge details`}
            className="relative w-full max-w-sm rounded-2xl liquid-glass p-7 flex flex-col items-center text-center"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <Badge3D shape={badge.shape} color={badge.color} earned={earned} size={96} />

            <p className={`mt-4 text-lg font-normal ${earned ? 'text-white' : 'text-white/50'}`}>{badge.title}</p>
            <p className="text-white/50 text-sm font-light leading-relaxed mt-2">{badge.description}</p>

            <div className="mt-5 pt-5 border-t border-white/10 w-full">
              {earned ? (
                <p className="inline-flex items-center gap-1.5 text-sky-300/80 text-xs">
                  <Calendar className="w-3.5 h-3.5" />
                  {earnedAt
                    ? `Earned ${new Date(earnedAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}`
                    : 'Earned'}
                </p>
              ) : (
                <p className="inline-flex items-center gap-1.5 text-white/30 text-xs">
                  <Lock className="w-3.5 h-3.5" />
                  Not yet earned
                </p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
