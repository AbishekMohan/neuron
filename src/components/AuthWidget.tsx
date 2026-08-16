import { useState } from 'react';
import { LogIn, LogOut, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthWidget({ variant = 'desktop' }: { variant?: 'desktop' | 'mobile' }) {
  const { user, loading, isConfigured, signInWithEmail, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isConfigured || loading) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    const { error } = await signInWithEmail(email);
    if (error) {
      setErrorMessage(error);
      setStatus('error');
    } else {
      setStatus('sent');
    }
  };

  const baseButtonClass =
    variant === 'desktop'
      ? 'text-sm px-4 py-2 rounded-full transition-all duration-300 text-white/70 hover:text-white'
      : 'text-white text-2xl font-light';

  if (user) {
    return (
      <div className={variant === 'desktop' ? 'flex items-center gap-2' : 'flex flex-col items-center gap-3'}>
        <span className={variant === 'desktop' ? 'text-white/40 text-xs' : 'text-white/50 text-sm'}>
          {user.email}
        </span>
        <button
          type="button"
          onClick={() => signOut()}
          className={
            variant === 'desktop'
              ? 'flex items-center gap-1.5 text-white/50 hover:text-white text-xs transition-colors'
              : 'flex items-center gap-2 text-white/50 text-base'
          }
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((v) => !v)} className={baseButtonClass}>
        <span className="inline-flex items-center gap-1.5">
          <LogIn className="w-3.5 h-3.5" />
          Sign in
        </span>
      </button>

      {open && (
        <div
          className={
            variant === 'desktop'
              ? 'absolute right-0 top-full mt-3 w-72 rounded-2xl liquid-glass p-4 z-50'
              : 'mt-4 w-72 rounded-2xl liquid-glass p-4'
          }
        >
          {status === 'sent' ? (
            <p className="text-white/70 text-sm font-light">
              Check <span className="text-white">{email}</span> for a sign-in link.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <p className="text-white/50 text-xs">
                Sign in to sync your XP and badges across devices. No password needed.
              </p>
              <div className="flex items-center gap-2 rounded-full border border-white/15 px-3 py-2">
                <Mail className="w-3.5 h-3.5 text-white/40 shrink-0" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@school.edu"
                  className="bg-transparent text-sm text-white placeholder:text-white/30 outline-none w-full"
                />
              </div>
              {status === 'error' && <p className="text-red-300 text-xs">{errorMessage}</p>}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="flex items-center justify-center gap-2 bg-white text-black text-sm font-medium px-4 py-2 rounded-full hover:bg-white/90 disabled:opacity-60 transition-colors"
              >
                {status === 'sending' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Send magic link
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
