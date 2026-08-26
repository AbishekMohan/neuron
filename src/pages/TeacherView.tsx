import { useEffect, useMemo, useState } from 'react';
import { FileDown, Loader2, Users, TrendingUp, Award } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { LEVELS, getLevel } from '../lib/level';

type Row = { user_id: string; display_name: string; xp: number; steps_completed: number; modules_mastered: number };

// Deliberately honest about what this is and isn't: `leaderboard_stats` is
// a *public*-read table (see Leaderboard.tsx), so this reads the same
// data any visitor can already see. There's no teacher login or
// per-classroom grouping in this deployment, so this can't scope to "my
// class" and shouldn't claim to. It's a cohort-wide snapshot of every
// student who's set up a public profile, reframed for a teacher's use
// case (aggregate stats, printable) rather than a ranked list.
//
// Per-question "common misconceptions" data (which specific quiz
// questions a class misses most) genuinely isn't available from this.
// Quiz_attempts is private per-user by RLS, and no aggregate view over it
// exists yet. That would need a real schema change, not a UI change, so
// it isn't faked here.
export default function TeacherView() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from('leaderboard_stats')
      .select('user_id, display_name, xp, steps_completed, modules_mastered')
      .order('xp', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setRows((data as Row[]) ?? []);
      });
  }, []);

  const stats = useMemo(() => {
    if (!rows || rows.length === 0) return null;
    const n = rows.length;
    const avgXp = rows.reduce((s, r) => s + r.xp, 0) / n;
    const avgSteps = rows.reduce((s, r) => s + r.steps_completed, 0) / n;
    const avgMastered = rows.reduce((s, r) => s + r.modules_mastered, 0) / n;
    const levelCounts = LEVELS.map((lvl) => ({
      name: lvl.name,
      count: rows.filter((r) => getLevel(r.xp).name === lvl.name).length,
    }));
    return { n, avgXp, avgSteps, avgMastered, levelCounts };
  }, [rows]);

  return (
    <section className="px-6 sm:px-8 md:px-12 pt-28 md:pt-36 pb-24 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <p className="text-sky-400 text-xs tracking-widest uppercase mb-3">Class Snapshot</p>
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-light leading-tight tracking-tight">
          A teacher's view of the cohort
        </h1>
        <p className="text-white/50 text-sm mt-4 max-w-xl font-light">
          Aggregate, anonymized-by-nature stats across every student with a public profile. The same public data
          the leaderboard shows, reframed for a class-progress check rather than a ranking. No emails, ever; no
          per-classroom grouping in this deployment, so this covers everyone with a public profile, not "your"
          section specifically.
        </p>

        {!supabase && (
          <div className="mt-10 rounded-2xl liquid-glass p-6 text-white/50 text-sm">
            This isn't configured for this deployment.
          </div>
        )}

        {supabase && !rows && !error && (
          <div className="mt-10 flex items-center gap-2 text-white/40 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading...
          </div>
        )}

        {error && <div className="mt-10 rounded-2xl liquid-glass p-6 text-red-300 text-sm">{error}</div>}

        {stats && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
              <div className="rounded-2xl liquid-glass p-5 text-center">
                <Users className="w-4 h-4 text-sky-300 mx-auto mb-2" />
                <p className="text-white text-2xl font-light">{stats.n}</p>
                <p className="text-white/40 text-xs mt-1">Students</p>
              </div>
              <div className="rounded-2xl liquid-glass p-5 text-center">
                <TrendingUp className="w-4 h-4 text-sky-300 mx-auto mb-2" />
                <p className="text-white text-2xl font-light">{Math.round(stats.avgXp)}</p>
                <p className="text-white/40 text-xs mt-1">Avg. XP</p>
              </div>
              <div className="rounded-2xl liquid-glass p-5 text-center">
                <Award className="w-4 h-4 text-sky-300 mx-auto mb-2" />
                <p className="text-white text-2xl font-light">{stats.avgMastered.toFixed(1)}</p>
                <p className="text-white/40 text-xs mt-1">Avg. modules mastered</p>
              </div>
              <div className="rounded-2xl liquid-glass p-5 text-center">
                <Award className="w-4 h-4 text-sky-300 mx-auto mb-2" />
                <p className="text-white text-2xl font-light">{stats.avgSteps.toFixed(1)}</p>
                <p className="text-white/40 text-xs mt-1">Avg. steps completed</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl liquid-glass p-6">
              <p className="text-white/40 text-xs uppercase tracking-widest mb-5">Level distribution</p>
              <div className="flex flex-col gap-3">
                {stats.levelCounts.map((lvl) => (
                  <div key={lvl.name}>
                    <div className="flex items-baseline justify-between mb-1.5 text-sm">
                      <span className="text-white/70">{lvl.name}</span>
                      <span className="text-white/40">
                        {lvl.count} student{lvl.count === 1 ? '' : 's'}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/8 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-sky-400"
                        style={{ width: `${stats.n ? (lvl.count / stats.n) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 text-sm bg-white text-black rounded-full px-4 py-2 hover:bg-white/90 transition-colors"
              >
                <FileDown className="w-4 h-4" />
                Print recap
              </button>
            </div>
          </>
        )}

        {rows && rows.length === 0 && (
          <div className="mt-10 rounded-2xl liquid-glass p-6 text-white/50 text-sm">
            No students have set up a public profile yet.
          </div>
        )}
      </div>
    </section>
  );
}
