import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { MODULES, STEP_ORDER, XP, stepId, type StepId } from '../data/modules';
import { BADGES, type ModuleProgress } from '../data/badges';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import { getLevel, type Level } from '../lib/level';
import { TRAINING_CATEGORIES } from '../data/training';
import { COMPANION_UPDATED_EVENT, getMasteredCompanionCount } from '../lib/companion';

const STEPS_STORAGE_KEY = 'neuron-progress-v2';
const QUIZ_STORAGE_KEY = 'neuron-quiz-v1';
const BADGE_DATES_STORAGE_KEY = 'neuron-badge-dates-v1';

export type QuizAttempt = { score: number; total: number; passed: boolean; attemptedAt: string };
type QuizAttempts = Record<string, QuizAttempt>; // keyed by moduleId, latest passing (or latest) attempt

type ProgressContextValue = {
  completedSteps: Set<string>;
  isStepComplete: (moduleId: string, step: StepId) => boolean;
  completeStep: (moduleId: string, step: StepId) => void;
  isModuleUnlocked: (moduleId: string) => boolean; // quiz gate: other 4 steps done
  quizAttempts: QuizAttempts;
  submitQuiz: (moduleId: string, score: number, total: number, passingScore: number) => boolean;
  xp: number;
  totalXpPossible: number;
  level: Level;
  moduleProgress: ModuleProgress;
  earnedBadgeIds: string[];
  /** First-earned ISO timestamp per badge id, recorded the moment each badge's check first passes. */
  badgeEarnedAt: Record<string, string>;
  resetProgress: () => void;
  syncState: 'local' | 'syncing' | 'synced';
};

function loadBadgeDates(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(BADGE_DATES_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

function loadSteps(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(STEPS_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function loadQuizAttempts(): QuizAttempts {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(QUIZ_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(loadSteps);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempts>(loadQuizAttempts);
  const [syncState, setSyncState] = useState<'local' | 'syncing' | 'synced'>('local');
  const syncedUserId = useRef<string | null>(null);

  // Companion training state lives in its own localStorage keys (see
  // lib/companion.ts), written directly by the Companion page rather than
  // through this context — so this listens for its "something changed"
  // event to know when to re-derive companionMasteredCount below, instead
  // of that value silently going stale until some unrelated state change
  // happened to re-render this provider.
  const [companionVersion, setCompanionVersion] = useState(0);
  useEffect(() => {
    const bump = () => setCompanionVersion((v) => v + 1);
    window.addEventListener(COMPANION_UPDATED_EVENT, bump);
    window.addEventListener('storage', bump);
    return () => {
      window.removeEventListener(COMPANION_UPDATED_EVENT, bump);
      window.removeEventListener('storage', bump);
    };
  }, []);
  const companionMasteredCount = useMemo(
    () => getMasteredCompanionCount(TRAINING_CATEGORIES),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [companionVersion],
  );

  useEffect(() => {
    window.localStorage.setItem(STEPS_STORAGE_KEY, JSON.stringify(Array.from(completedSteps)));
  }, [completedSteps]);

  useEffect(() => {
    window.localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(quizAttempts));
  }, [quizAttempts]);

  // On sign-in: pull this account's remote progress, merge with whatever
  // guest progress exists in this browser, and push the merge back up. On
  // sign-out: fall back to localStorage so a previous account's data
  // doesn't linger.
  useEffect(() => {
    if (!supabase) return;

    if (!user) {
      if (syncedUserId.current !== null) {
        setCompletedSteps(loadSteps());
        setQuizAttempts(loadQuizAttempts());
        syncedUserId.current = null;
        setSyncState('local');
      }
      return;
    }

    if (syncedUserId.current === user.id) return;
    syncedUserId.current = user.id;
    setSyncState('syncing');

    (async () => {
      const [{ data: stepRows, error: stepErr }, { data: quizRows, error: quizErr }] = await Promise.all([
        supabase.from('step_completions').select('step_id').eq('user_id', user.id),
        supabase
          .from('quiz_attempts')
          .select('module_id, score, total, passed, attempted_at')
          .eq('user_id', user.id)
          .order('attempted_at', { ascending: true }),
      ]);

      if (stepErr) console.error('Failed to load step completions from Supabase', stepErr);
      if (quizErr) console.error('Failed to load quiz attempts from Supabase', quizErr);

      const remoteSteps = new Set((stepRows ?? []).map((row) => row.step_id as string));
      const mergedSteps = new Set([...remoteSteps, ...completedSteps]);
      const stepsToInsert = [...mergedSteps].filter((id) => !remoteSteps.has(id));

      if (stepsToInsert.length > 0) {
        const { error } = await supabase.from('step_completions').upsert(
          stepsToInsert.map((step) => ({
            user_id: user.id,
            step_id: step,
            module_id: step.split('-').slice(0, -1).join('-'),
          })),
        );
        if (error) console.error('Failed to sync local step completions to Supabase', error);
      }

      const remoteQuiz: QuizAttempts = {};
      for (const row of quizRows ?? []) {
        remoteQuiz[row.module_id as string] = {
          score: row.score as number,
          total: row.total as number,
          passed: row.passed as boolean,
          attemptedAt: row.attempted_at as string,
        };
      }
      const mergedQuiz: QuizAttempts = { ...remoteQuiz, ...quizAttempts };
      const quizToInsert = Object.entries(mergedQuiz).filter(([moduleId]) => !(moduleId in remoteQuiz));

      if (quizToInsert.length > 0) {
        const { error } = await supabase.from('quiz_attempts').insert(
          quizToInsert.map(([moduleId, attempt]) => ({
            user_id: user.id,
            module_id: moduleId,
            score: attempt.score,
            total: attempt.total,
            passed: attempt.passed,
          })),
        );
        if (error) console.error('Failed to sync local quiz attempts to Supabase', error);
      }

      setCompletedSteps(mergedSteps);
      setQuizAttempts(mergedQuiz);
      setSyncState('synced');
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const isStepComplete = (moduleId: string, step: StepId) => completedSteps.has(stepId(moduleId, step));

  const completeStep = (moduleId: string, step: StepId) => {
    const id = stepId(moduleId, step);
    setCompletedSteps((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);

      if (supabase && user) {
        supabase
          .from('step_completions')
          .upsert({ user_id: user.id, step_id: id, module_id: moduleId })
          .then(({ error }) => {
            if (error) console.error('Failed to sync step completion to Supabase', error);
          });
      }

      return next;
    });
  };

  const isModuleUnlocked = (moduleId: string) =>
    (['article', 'flashcards', 'video', 'game'] as StepId[]).every((s) => isStepComplete(moduleId, s));

  const submitQuiz = (moduleId: string, score: number, total: number, passingScore: number) => {
    const passed = total > 0 && score / total >= passingScore;
    const attempt: QuizAttempt = { score, total, passed, attemptedAt: new Date().toISOString() };

    setQuizAttempts((prev) => {
      const existing = prev[moduleId];
      if (existing) {
        // Keep whichever attempt is "better": a pass beats a fail; among
        // two passes or two fails, the higher score ratio wins.
        if (existing.passed && !passed) return prev;
        if (!existing.passed && passed) return { ...prev, [moduleId]: attempt };
        const existingRatio = existing.total > 0 ? existing.score / existing.total : 0;
        const newRatio = total > 0 ? score / total : 0;
        if (existingRatio >= newRatio) return prev;
      }
      return { ...prev, [moduleId]: attempt };
    });

    if (supabase && user) {
      supabase
        .from('quiz_attempts')
        .insert({ user_id: user.id, module_id: moduleId, score, total, passed })
        .then(({ error }) => {
          if (error) console.error('Failed to sync quiz attempt to Supabase', error);
        });
    }

    if (passed) completeStep(moduleId, 'quiz');
    return passed;
  };

  const moduleProgress = useMemo<ModuleProgress>(() => {
    const result: ModuleProgress = {};
    for (const mod of MODULES) {
      const total = STEP_ORDER.length;
      const completed = STEP_ORDER.filter((s) => completedSteps.has(stepId(mod.id, s))).length;
      result[mod.id] = {
        completed,
        total,
        percent: total === 0 ? 0 : Math.round((completed / total) * 100),
        isComplete: completed === total,
      };
    }
    return result;
  }, [completedSteps]);

  const xp = useMemo(() => {
    let total = 0;
    for (const mod of MODULES) {
      for (const step of STEP_ORDER) {
        if (completedSteps.has(stepId(mod.id, step))) total += XP[step];
      }
      if (moduleProgress[mod.id]?.isComplete) total += XP.moduleBonus;
    }
    return total;
  }, [completedSteps, moduleProgress]);

  const totalXpPossible = useMemo(
    () => MODULES.reduce((sum) => sum + STEP_ORDER.reduce((s, step) => s + XP[step], 0) + XP.moduleBonus, 0),
    [],
  );

  const level = useMemo<Level>(() => getLevel(xp), [xp]);

  const earnedBadgeIds = useMemo(
    () =>
      BADGES.filter((b) => b.check({ completedSteps, xp, moduleProgress, companionMasteredCount })).map((b) => b.id),
    [completedSteps, xp, moduleProgress, companionMasteredCount],
  );

  const [badgeEarnedAt, setBadgeEarnedAt] = useState<Record<string, string>>(loadBadgeDates);

  // Records the moment a badge first appears in earnedBadgeIds — a plain
  // derived boolean has no memory of "when", so this is the one place
  // that needs its own persisted state rather than being computed live.
  useEffect(() => {
    setBadgeEarnedAt((prev) => {
      const newlyEarned = earnedBadgeIds.filter((id) => !prev[id]);
      if (newlyEarned.length === 0) return prev;
      const next = { ...prev };
      const now = new Date().toISOString();
      for (const id of newlyEarned) next[id] = now;
      window.localStorage.setItem(BADGE_DATES_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, [earnedBadgeIds]);

  const resetProgress = () => {
    setCompletedSteps(new Set());
    setQuizAttempts({});
    setBadgeEarnedAt({});
    window.localStorage.removeItem(BADGE_DATES_STORAGE_KEY);
    if (supabase && user) {
      supabase
        .from('step_completions')
        .delete()
        .eq('user_id', user.id)
        .then(({ error }) => {
          if (error) console.error('Failed to reset step completions in Supabase', error);
        });
      supabase
        .from('quiz_attempts')
        .delete()
        .eq('user_id', user.id)
        .then(({ error }) => {
          if (error) console.error('Failed to reset quiz attempts in Supabase', error);
        });
    }
  };

  const value: ProgressContextValue = {
    completedSteps,
    isStepComplete,
    completeStep,
    isModuleUnlocked,
    quizAttempts,
    submitQuiz,
    xp,
    totalXpPossible,
    level,
    moduleProgress,
    earnedBadgeIds,
    badgeEarnedAt,
    resetProgress,
    syncState,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within a ProgressProvider');
  return ctx;
}
