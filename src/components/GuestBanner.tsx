import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { X } from 'lucide-react';

export default function GuestBanner() {
  const { user, isConfigured } = useAuth();
  const location = useLocation();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check localStorage on mount
    const saved = localStorage.getItem('neuron-guest-banner-dismissed');
    if (saved === 'true') {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('neuron-guest-banner-dismissed', 'true');
  };

  // Only show if: Supabase is configured, user is NOT logged in, we haven't dismissed it,
  // and we are NOT on the /profile (auth/setup) page.
  if (!isConfigured || user || dismissed || location.pathname === '/profile') {
    return null;
  }

  return (
    <div className="bg-sky-500/10 border-b border-sky-400/20 px-4 py-2 text-center relative z-20 flex justify-center items-center gap-4">
      <p className="text-sky-200 text-xs sm:text-sm font-medium">
        Viewing as guest — progress saves locally. Sign in to sync across devices.
      </p>
      <button 
        onClick={handleDismiss}
        className="text-sky-400/60 hover:text-sky-300 transition-colors shrink-0"
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
