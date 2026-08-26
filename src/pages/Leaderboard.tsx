import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Medal, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { getLevel } from '../lib/level';

type LeaderboardRow = {
  user_id: string;
  display_name: string;
  avatar_color: string;
  xp: number;
  steps_completed: number;
  modules_mastered: number;
};

const RANK_ICON: Record<number, string> = { 0: '#facc15', 1: '#d1d5db', 2: '#fb923c' };

export default function Leaderboard() {
  const { user, isConfigured } = useAuth();
  const [rows, setRows] = useState<LeaderboardRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    // leaderboard_stats is a plain table with a public-read RLS policy,
    // kept in sync by triggers on step_completions/quiz_attempts/profiles
    // (see the migration). No SECURITY DEFINER object in the read path
    // at all.
    supabase
      .from('leaderboard_stats')
      .select('user_id, display_name, avatar_color, xp, steps_completed, modules_mastered')
      .order('xp', { ascending: false })
      .limit(100)
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setRows((data as LeaderboardRow[]) ?? []);
      });
  }, []);

  return (
    <section className="px-6 sm:px-8 md:px-12 pt-28 md:pt-36 pb-24 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <p className="text-sky-400 text-xs tracking-widest uppercase mb-3">Leaderboard</p>
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-light leading-tight tracking-tight">
          Top learners
        </h1>
        <p className="text-white/50 text-sm mt-4 max-w-xl font-light">
          Ranked by total XP earned across all seven modules. Only students who’ve set up a public profile appear
          here: no emails, ever.
        </p>

        {!isConfigured && (
          <div className="mt-10 border-l-2 border-white/10 pl-4 py-1 text-white/50 text-sm">
            The leaderboard isn’t configured for this deployment.
          </div>
        )}

        {isConfigured && !rows && !error && (
          <div className="mt-10 flex items-center gap-2 text-white/40 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading rankings...
          </div>
        )}

        {error && <div className="mt-10 border-l-2 border-white/20 pl-4 py-1 text-white/60 text-sm">{error}</div>}

        {rows && rows.length === 0 && (
          <div className="mt-10 border-l-2 border-white/10 pl-4 py-1 text-white/50 text-sm">
            Nobody’s on the board yet.{' '}
            <Link to="/profile" className="text-sky-300 hover:text-sky-200 transition-colors">
              Set up your profile
            </Link>{' '}
            and be the first.
          </div>
        )}

        {rows && rows.length > 0 && (
          <div className="mt-10 border-t border-white/10">
            <ol>
              {rows.map((row, i) => {
                const isMe = user && row.user_id === user.id;
                const level = getLevel(row.xp);
                return (
                  <li
                    key={row.user_id}
                    className={`flex items-center gap-4 px-5 py-4 border-b border-white/5 last:border-0 ${
                      isMe ? 'bg-sky-400/5' : ''
                    }`}
                  >
                    <div className="w-7 shrink-0 text-center">
                      {i < 3 ? (
                        <Medal className="w-4 h-4 mx-auto" style={{ color: RANK_ICON[i] }} strokeWidth={1.75} />
                      ) : (
                        <span className="text-white/30 text-sm">{i + 1}</span>
                      )}
                    </div>

                    <div
                      className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-black text-sm font-medium"
                      style={{ backgroundColor: row.avatar_color }}
                    >
                      {row.display_name.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/u/${encodeURIComponent(row.display_name)}`}
                        className="text-white text-sm hover:text-sky-300 transition-colors truncate block"
                      >
                        {row.display_name}
                        {isMe && <span className="text-sky-400/70 text-xs ml-2">(you)</span>}
                      </Link>
                      <p className="text-white/30 text-xs mt-0.5">
                        {level.name} · {row.modules_mastered} module{row.modules_mastered === 1 ? '' : 's'} mastered
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-white text-sm font-normal">{row.xp} XP</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        )}

        <div className="mt-6 flex items-center gap-1.5 text-white/25 text-xs">
          <Trophy className="w-3.5 h-3.5" />
          XP is computed from the work you’ve actually recorded: there’s no way to submit a score directly.
        </div>
      </div>
    </section>
  );
}
