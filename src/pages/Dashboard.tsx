import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, Brain, Wrench, Scale, Globe, Palette, Rocket, Leaf, Cloud, CloudOff, Loader2, Trophy, UserCircle, Flame } from 'lucide-react';
import { MODULES } from '../data/modules';
import { BADGES, type Badge } from '../data/badges';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { useProgress } from '../context/ProgressContext';
import { getMasteryLevel } from '../lib/mastery';
import ProgressBar from '../components/ProgressBar';
import Badge3D from '../components/Badge3D';
import MasteryPill from '../components/MasteryPill';
import BadgeModal from '../components/BadgeModal';

const ICONS = { brain: Brain, wrench: Wrench, scale: Scale, globe: Globe, palette: Palette, rocket: Rocket, leaf: Leaf };

function SyncStatus() {
  const { user, isConfigured } = useAuth();
  const { syncState } = useProgress();

  if (!isConfigured) return null;

  if (!user) {
    return (
      <span className="inline-flex items-center gap-1.5 text-white/30 text-xs">
        <CloudOff className="w-3.5 h-3.5" />
        Saved on this device only. Sign in to sync.
      </span>
    );
  }

  if (syncState === 'syncing') {
    return (
      <span className="inline-flex items-center gap-1.5 text-white/40 text-xs">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        Syncing...
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-sky-300/80 text-xs">
      <Cloud className="w-3.5 h-3.5" />
      Synced
    </span>
  );
}

export default function Dashboard() {
  const { user, isConfigured } = useAuth();
  const { profile } = useProfile();
  const { xp, totalXpPossible, level, moduleProgress, earnedBadgeIds, badgeEarnedAt, completedSteps, resetProgress } =
    useProgress();
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const handleReset = () => {
    if (window.confirm('Reset all progress on this device? This can’t be undone.')) {
      resetProgress();
    }
  };

  return (
    <section className="px-6 sm:px-8 md:px-12 pt-28 md:pt-36 pb-24 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <p className="text-sky-400 text-xs tracking-widest uppercase mb-3">Dashboard</p>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-light leading-tight tracking-tight">
            Your progress
          </h1>
          <SyncStatus />
        </div>

        {isConfigured && user && !profile && (
          <div className="mt-6 border-l-2 border-sky-400/30 pl-4 py-1 text-sm text-white/60 max-w-xl">
            You haven’t set up a public profile yet.{' '}
            <Link to="/profile" className="text-sky-300 hover:text-sky-200 transition-colors">
              Choose a display name
            </Link>{' '}
            to appear on the leaderboard.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 mt-10 md:divide-x md:divide-white/10">
          <div className="md:col-span-1 md:pr-8">
            <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Level</p>
            <p className="text-white text-2xl font-light mb-4">{level.name}</p>
            <ProgressBar
              percent={level.xpForNext ? (level.xpIntoLevel / level.xpForNext) * 100 : 100}
              trailing={level.xpForNext ? `${level.xpIntoLevel}/${level.xpForNext} XP` : 'Max level'}
            />
            <p className="text-white/40 text-xs mt-4">{xp} / {totalXpPossible} total XP earned</p>

            {/* Only meaningful for signed-in users with a profile row: it's
                maintained server-side by a trigger on real activity, not
                computed from local state, so a guest with no profile has
                no streak to show. */}
            {profile && (
              <div className="flex items-center gap-1.5 mt-3 text-sm">
                <Flame className={`w-4 h-4 ${profile.current_streak > 0 ? 'text-orange-400' : 'text-white/20'}`} />
                <span className={profile.current_streak > 0 ? 'text-white/80' : 'text-white/30'}>
                  {profile.current_streak > 0
                    ? `${profile.current_streak}-day streak`
                    : 'No active streak'}
                </span>
                {profile.longest_streak > profile.current_streak && (
                  <span className="text-white/30 text-xs">· best {profile.longest_streak}</span>
                )}
              </div>
            )}

            <div className="flex flex-col gap-2 mt-5 pt-5 border-t border-white/10">
              <Link
                to="/leaderboard"
                className="inline-flex items-center gap-2 text-sky-300 hover:text-sky-200 text-sm transition-colors"
              >
                <Trophy className="w-4 h-4" />
                View leaderboard
              </Link>
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
              >
                <UserCircle className="w-4 h-4" />
                {profile ? 'Edit my profile' : 'Set up my profile'}
              </Link>
            </div>
          </div>

          <div className="md:col-span-2 md:pl-8">
            <p className="text-white/40 text-xs uppercase tracking-widest mb-4">Module mastery</p>
            <div className="flex flex-col gap-5">
              {MODULES.map((mod) => {
                const Icon = ICONS[mod.icon];
                const progress = moduleProgress[mod.id];
                const mastery = getMasteryLevel(mod.id, completedSteps);
                return (
                  <Link key={mod.id} to={`/modules/${mod.id}`} className="group">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="w-4 h-4 text-sky-300 shrink-0" strokeWidth={1.5} />
                      <span className="text-white/80 text-sm group-hover:text-white transition-colors">
                        {mod.title}
                      </span>
                      <span className="flex items-center gap-2 ml-auto shrink-0">
                        <MasteryPill level={mastery} />
                        <span className="text-white/30 text-xs">
                          {progress?.completed ?? 0}/{progress?.total ?? 5}
                        </span>
                      </span>
                    </div>
                    <ProgressBar percent={progress?.percent ?? 0} />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-5">
            Badges: {earnedBadgeIds.length}/{BADGES.length} earned
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {BADGES.map((badge) => {
              const earned = earnedBadgeIds.includes(badge.id);
              return (
                <button
                  key={badge.id}
                  type="button"
                  onClick={() => setSelectedBadge(badge)}
                  aria-label={`${badge.title}: ${earned ? 'earned, view details' : 'not yet earned, view criteria'}`}
                  className={`rounded-xl border p-4 flex flex-col items-center text-center gap-2 transition-colors hover:border-white/30 ${
                    earned ? 'border-sky-400/40 bg-sky-400/5' : 'border-white/10 bg-white/[0.02]'
                  }`}
                >
                  <Badge3D shape={badge.shape} color={badge.color} earned={earned} size={56} />
                  <p className={`text-xs font-normal ${earned ? 'text-white/90' : 'text-white/40'}`}>
                    {badge.title}
                  </p>
                  <p className="text-white/30 text-[11px] leading-snug">{badge.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 mt-8 text-white/30 hover:text-white/60 text-xs transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset progress on this device
        </button>
      </div>

      <BadgeModal
        badge={selectedBadge}
        earned={selectedBadge ? earnedBadgeIds.includes(selectedBadge.id) : false}
        earnedAt={selectedBadge ? badgeEarnedAt[selectedBadge.id] : undefined}
        onClose={() => setSelectedBadge(null)}
      />
    </section>
  );
}
