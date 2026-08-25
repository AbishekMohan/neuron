import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, UserCircle, Trophy, Flame, Brain, Wrench, Scale, Globe, Palette, Rocket, Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProfile, AVATAR_COLORS } from '../context/ProfileContext';
import { useProgress } from '../context/ProgressContext';
import { MODULES } from '../data/modules';
import { BADGES, type ModuleProgress } from '../data/badges';
import { getLevel } from '../lib/level';
import { getMasteryLevel } from '../lib/mastery';
import { supabase } from '../lib/supabase';
import ProgressBar from '../components/ProgressBar';
import Badge3D from '../components/Badge3D';
import MasteryPill from '../components/MasteryPill';
import AuthWidget from '../components/AuthWidget';

const ICONS = { brain: Brain, wrench: Wrench, scale: Scale, globe: Globe, palette: Palette, rocket: Rocket, leaf: Leaf };
const DISPLAY_NAME_PATTERN = /^[A-Za-z0-9 _-]{3,24}$/;

type PublicRow = {
  user_id: string;
  display_name: string;
  avatar_color: string;
  bio: string;
  created_at: string;
  xp: number;
  steps_completed: number;
  modules_mastered: number;
  mastered_module_ids: string[];
  current_streak: number;
  longest_streak: number;
};

function moduleProgressFromMasteredIds(masteredIds: string[]): ModuleProgress {
  const result: ModuleProgress = {};
  for (const mod of MODULES) {
    const isComplete = masteredIds.includes(mod.id);
    result[mod.id] = { completed: isComplete ? 5 : 0, total: 5, percent: isComplete ? 100 : 0, isComplete };
  }
  return result;
}

function ProfileStats({
  displayName,
  avatarColor,
  bio,
  joinedAt,
  xp,
  moduleProgress,
  earnedBadgeIds,
  currentStreak,
  longestStreak,
  completedSteps,
  isOwn,
}: {
  displayName: string;
  avatarColor: string;
  bio: string;
  joinedAt: string;
  xp: number;
  moduleProgress: ModuleProgress;
  earnedBadgeIds: string[];
  currentStreak: number;
  longestStreak: number;
  // Only available for the signed-in user's own profile: public profiles
  // read from leaderboard_stats, which only stores which modules are
  // mastered, not per-step detail, so there's no accurate mastery tier to
  // show for someone else (deliberately. That's less data exposed, not
  // a bug).
  completedSteps?: Set<string>;
  isOwn: boolean;
}) {
  const level = getLevel(xp);
  const joined = new Date(joinedAt);

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-5">
        <div
          className="w-16 h-16 rounded-full shrink-0 flex items-center justify-center text-black text-2xl font-medium"
          style={{ backgroundColor: avatarColor }}
        >
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-white text-2xl sm:text-3xl font-light">{displayName}</h1>
          <p className="text-white/40 text-sm mt-1">
            {level.name} · Joined {joined.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {bio && <p className="text-white/60 text-sm font-light leading-relaxed mt-5 max-w-xl">{bio}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
        <div className="rounded-2xl liquid-glass p-5">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">XP</p>
          <p className="text-white text-2xl font-light">{xp}</p>
          <ProgressBar
            percent={level.xpForNext ? (level.xpIntoLevel / level.xpForNext) * 100 : 100}
            trailing={level.xpForNext ? `${level.xpIntoLevel}/${level.xpForNext} to next` : 'Max level'}
          />
        </div>
        <div className="rounded-2xl liquid-glass p-5">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Streak</p>
          <p className="text-white text-2xl font-light flex items-center gap-1.5">
            {currentStreak > 0 && <Flame className="w-4 h-4 text-orange-400" />}
            {currentStreak}
          </p>
          {longestStreak > currentStreak && <p className="text-white/30 text-xs mt-1">Best: {longestStreak}</p>}
        </div>
        <div className="rounded-2xl liquid-glass p-5">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Modules mastered</p>
          <p className="text-white text-2xl font-light">{MODULES.filter((m) => moduleProgress[m.id]?.isComplete).length}/{MODULES.length}</p>
        </div>
        <div className="rounded-2xl liquid-glass p-5">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Badges</p>
          <p className="text-white text-2xl font-light">{earnedBadgeIds.length}/{BADGES.length}</p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl liquid-glass p-6">
        <p className="text-white/40 text-xs uppercase tracking-widest mb-4">Module mastery</p>
        <div className="flex flex-col gap-4">
          {MODULES.map((mod) => {
            const Icon = ICONS[mod.icon];
            const progress = moduleProgress[mod.id];
            return (
              <div key={mod.id}>
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="w-4 h-4 text-sky-300 shrink-0" strokeWidth={1.5} />
                  <span className="text-white/80 text-sm">{mod.title}</span>
                  <span className="flex items-center gap-2 ml-auto shrink-0">
                    {completedSteps ? (
                      <MasteryPill level={getMasteryLevel(mod.id, completedSteps)} />
                    ) : (
                      <span className="text-white/30 text-xs">{progress?.isComplete ? 'Mastered' : `${progress?.completed ?? 0}/5`}</span>
                    )}
                  </span>
                </div>
                <ProgressBar percent={progress?.percent ?? 0} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 rounded-2xl liquid-glass p-6">
        <p className="text-white/40 text-xs uppercase tracking-widest mb-5">Badge case</p>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
          {BADGES.map((badge) => {
            const earned = earnedBadgeIds.includes(badge.id);
            return (
              <div key={badge.id} className="flex flex-col items-center text-center gap-2">
                <Badge3D shape={badge.shape} color={badge.color} earned={earned} size={56} />
                <p className={`text-[11px] leading-snug ${earned ? 'text-white/70' : 'text-white/30'}`}>{badge.title}</p>
              </div>
            );
          })}
        </div>
      </div>

      {isOwn && (
        <Link to="/leaderboard" className="inline-flex items-center gap-2 mt-6 text-sky-300 hover:text-sky-200 text-sm transition-colors">
          <Trophy className="w-4 h-4" />
          See how you rank
        </Link>
      )}
    </div>
  );
}

function ProfileSetupForm() {
  const { createProfile } = useProfile();
  const [name, setName] = useState('');
  const [color, setColor] = useState(AVATAR_COLORS[0]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const valid = DISPLAY_NAME_PATTERN.test(name.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) {
      setError('Use 3–24 characters: letters, numbers, spaces, - or _.');
      return;
    }
    setSubmitting(true);
    const { error } = await createProfile(name.trim(), color);
    setSubmitting(false);
    if (error) setError(error);
  };

  return (
    <div className="max-w-md rounded-2xl liquid-glass p-6">
      <p className="text-white text-base font-normal mb-1">Choose a display name</p>
      <p className="text-white/50 text-xs font-light mb-5">
        This is what other students see on the leaderboard. Your email is never shown publicly.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. NeuralNinja"
          maxLength={24}
          className="bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-sky-400/50"
        />

        <div>
          <p className="text-white/40 text-xs mb-2">Avatar color</p>
          <div className="flex gap-2 flex-wrap">
            {AVATAR_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                aria-label={`Choose ${c}`}
                className={`w-8 h-8 rounded-full transition-transform ${color === c ? 'ring-2 ring-white scale-110' : ''}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {error && <p className="text-red-300 text-xs">{error}</p>}

        <button
          type="submit"
          disabled={submitting || !name}
          className="inline-flex items-center justify-center gap-2 bg-white text-black text-sm font-medium px-4 py-2.5 rounded-full hover:bg-white/90 disabled:opacity-50 transition-colors"
        >
          {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Create profile
        </button>
      </form>
    </div>
  );
}

function EditProfileForm({ onDone }: { onDone: () => void }) {
  const { profile, updateProfile } = useProfile();
  const [name, setName] = useState(profile?.display_name ?? '');
  const [color, setColor] = useState(profile?.avatar_color ?? AVATAR_COLORS[0]);
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const valid = DISPLAY_NAME_PATTERN.test(name.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) {
      setError('Use 3–24 characters: letters, numbers, spaces, - or _.');
      return;
    }
    setSubmitting(true);
    const { error } = await updateProfile({ display_name: name.trim(), avatar_color: color, bio: bio.slice(0, 200) });
    setSubmitting(false);
    if (error) setError(error);
    else onDone();
  };

  return (
    <div className="max-w-md rounded-2xl liquid-glass p-6">
      <p className="text-white text-base font-normal mb-5">Edit profile</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={24}
          className="bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-sky-400/50"
        />
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={200}
          rows={3}
          placeholder="Short bio (optional)"
          className="bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-sky-400/50 resize-none"
        />
        <div className="flex gap-2 flex-wrap">
          {AVATAR_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              aria-label={`Choose ${c}`}
              className={`w-8 h-8 rounded-full transition-transform ${color === c ? 'ring-2 ring-white scale-110' : ''}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        {error && <p className="text-red-300 text-xs">{error}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting || !name}
            className="inline-flex items-center justify-center gap-2 bg-white text-black text-sm font-medium px-4 py-2.5 rounded-full hover:bg-white/90 disabled:opacity-50 transition-colors"
          >
            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Save
          </button>
          <button
            type="button"
            onClick={onDone}
            className="text-sm px-4 py-2.5 rounded-full border border-white/15 text-white/60 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function OwnProfile() {
  const { user, isConfigured } = useAuth();
  const { profile, loading, needsSetup } = useProfile();
  const { xp, moduleProgress, earnedBadgeIds, completedSteps } = useProgress();
  const [editing, setEditing] = useState(false);

  if (!isConfigured) {
    return <p className="text-white/50 text-sm">Profiles aren’t configured for this deployment.</p>;
  }

  if (!user) {
    return (
      <div className="max-w-md rounded-2xl liquid-glass p-6">
        <p className="text-white text-sm mb-4">Sign in to set up your profile and appear on the leaderboard.</p>
        <AuthWidget variant="desktop" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-white/40 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading...
      </div>
    );
  }

  if (needsSetup) return <ProfileSetupForm />;
  if (!profile) return null;

  if (editing) return <EditProfileForm onDone={() => setEditing(false)} />;

  return (
    <div>
      <ProfileStats
        displayName={profile.display_name}
        avatarColor={profile.avatar_color}
        bio={profile.bio}
        joinedAt={profile.created_at}
        xp={xp}
        moduleProgress={moduleProgress}
        earnedBadgeIds={earnedBadgeIds}
        currentStreak={profile.current_streak}
        longestStreak={profile.longest_streak}
        completedSteps={completedSteps}
        isOwn
      />
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="inline-flex items-center gap-2 mt-6 text-white/50 hover:text-white text-sm transition-colors"
      >
        <UserCircle className="w-4 h-4" />
        Edit profile
      </button>
    </div>
  );
}

function PublicProfile({ displayName }: { displayName: string }) {
  const [row, setRow] = useState<PublicRow | null | undefined>(undefined); // undefined = loading

  useEffect(() => {
    if (!supabase) {
      setRow(null);
      return;
    }
    // leaderboard_stats is a plain, publicly-readable table. See the
    // migration in the Supabase project.
    supabase
      .from('leaderboard_stats')
      .select('*')
      .eq('display_name', displayName)
      .maybeSingle()
      .then(({ data }) => setRow((data as PublicRow) ?? null));
  }, [displayName]);

  if (row === undefined) {
    return (
      <div className="flex items-center gap-2 text-white/40 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading profile...
      </div>
    );
  }

  if (row === null) {
    return <p className="text-white/50 text-sm">No student found with that display name.</p>;
  }

  const moduleProgress = moduleProgressFromMasteredIds(row.mastered_module_ids ?? []);
  const fakeStepsSet = new Set(Array.from({ length: row.steps_completed }, (_, i) => `s${i}`));
  // Companion training lives in localStorage only (never synced to
  // Supabase), so there's no way to know another student's companion
  // mastery from their profile row. A public profile conservatively
  // shows 0 rather than guessing.
  const earnedBadgeIds = BADGES.filter((b) =>
    b.check({ completedSteps: fakeStepsSet, xp: row.xp, moduleProgress, companionMasteredCount: 0 }),
  ).map((b) => b.id);

  return (
    <ProfileStats
      displayName={row.display_name}
      avatarColor={row.avatar_color}
      bio={row.bio}
      joinedAt={row.created_at}
      xp={row.xp}
      moduleProgress={moduleProgress}
      earnedBadgeIds={earnedBadgeIds}
      currentStreak={row.current_streak}
      longestStreak={row.longest_streak}
      isOwn={false}
    />
  );
}

export default function Profile() {
  const { displayName } = useParams<{ displayName?: string }>();

  return (
    <section className="px-6 sm:px-8 md:px-12 pt-28 md:pt-36 pb-24 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {!displayName && (
          <>
            <p className="text-sky-400 text-xs tracking-widest uppercase mb-3">Profile</p>
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-light leading-tight tracking-tight mb-10">
              Your profile
            </h1>
            <OwnProfile />
          </>
        )}
        {displayName && <PublicProfile displayName={displayName} />}
      </div>
    </section>
  );
}
