import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// If Supabase isn't configured, `supabase` is null and every consumer treats
// that as "sign-in is unavailable" and falls back to localStorage-only
// progress, rather than crashing the whole app.
export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
