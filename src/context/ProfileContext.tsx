import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

export type Profile = {
  id: string;
  display_name: string;
  avatar_color: string;
  bio: string;
  created_at: string;
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
};

export const AVATAR_COLORS = ['#38bdf8', '#7dd3fc', '#818cf8', '#a78bfa', '#f472b6', '#fb923c', '#34d399', '#facc15'];

type ProfileContextValue = {
  profile: Profile | null;
  loading: boolean;
  needsSetup: boolean; // signed in, Supabase configured, but no profile row yet
  createProfile: (displayName: string, avatarColor: string) => Promise<{ error: string | null }>;
  updateProfile: (patch: Partial<Pick<Profile, 'display_name' | 'avatar_color' | 'bio'>>) => Promise<{ error: string | null }>;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase || !user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) console.error('Failed to load profile', error);
        setProfile((data as Profile | null) ?? null);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const createProfile = async (displayName: string, avatarColor: string) => {
    if (!supabase || !user) return { error: 'Sign-in is not configured for this deployment.' };

    const { data, error } = await supabase
      .from('profiles')
      .insert({ id: user.id, display_name: displayName.trim(), avatar_color: avatarColor })
      .select()
      .single();

    if (error) {
      const message = error.code === '23505' ? 'That display name is already taken.' : error.message;
      return { error: message };
    }

    setProfile(data as Profile);
    return { error: null };
  };

  const updateProfile: ProfileContextValue['updateProfile'] = async (patch) => {
    if (!supabase || !user) return { error: 'Sign-in is not configured for this deployment.' };

    const { data, error } = await supabase.from('profiles').update(patch).eq('id', user.id).select().single();

    if (error) {
      const message = error.code === '23505' ? 'That display name is already taken.' : error.message;
      return { error: message };
    }

    setProfile(data as Profile);
    return { error: null };
  };

  const value: ProfileContextValue = {
    profile,
    loading,
    needsSetup: !!user && !!supabase && !loading && !profile,
    createProfile,
    updateProfile,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within a ProfileProvider');
  return ctx;
}
