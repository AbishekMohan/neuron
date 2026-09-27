import { Link } from 'react-router-dom';

// Privacy & data-handling page (brief P2-6). Short on purpose: judges and
// parents should be able to read the whole thing in a minute.
export default function Privacy() {
  return (
    <section className="px-6 sm:px-8 md:px-12 pt-28 md:pt-36 pb-24 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <p className="text-sky-400 text-xs tracking-widest uppercase mb-3">Privacy</p>
        <h1 className="text-white text-3xl sm:text-4xl font-light leading-tight tracking-tight">
          What we store, and how to delete it
        </h1>
        <p className="text-white/50 text-sm mt-4 max-w-xl font-light leading-relaxed">
          Neuron is a student learning site. We collect the minimum needed to track
          progress — nothing is sold, nothing is used for advertising.
        </p>

        <div className="mt-10 flex flex-col gap-8 text-sm font-light leading-relaxed">
          <div className="border-t border-white/10 pt-6">
            <h2 className="text-white text-lg font-normal mb-2">Guests (no account)</h2>
            <p className="text-white/60">
              Progress, XP, and earned badges are stored only in your browser's
              localStorage on your own device. Nothing leaves your machine. Clearing
              site data erases it completely.
            </p>
          </div>

          <div className="border-t border-white/10 pt-6">
            <h2 className="text-white text-lg font-normal mb-2">Signed-in users</h2>
            <p className="text-white/60">
              Signing in uses a passwordless magic link (Supabase Auth). We store your
              email for login, a display name and avatar color you choose yourself for
              the leaderboard and public profile, plus your module progress and XP so it
              syncs across devices. Your email is never shown publicly.
            </p>
          </div>

          <div className="border-t border-white/10 pt-6">
            <h2 className="text-white text-lg font-normal mb-2">AI companion</h2>
            <p className="text-white/60">
              Questions you send to the built-in assistant are proxied through a Supabase
              edge function to the model provider (Groq) — your text is transmitted to
              generate a reply and is not used for advertising. The API key lives in the
              edge function, never in the browser. Don't paste sensitive personal
              information into any AI chatbox, ours included.
            </p>
          </div>

          <div className="border-t border-white/10 pt-6">
            <h2 className="text-white text-lg font-normal mb-2">Security</h2>
            <p className="text-white/60">
              Row Level Security is enabled on every Supabase table, so the anonymous
              client key (which ships in the frontend by design) can only read and write
              what its policies allow. Leaderboard and progress writes are scoped to the
              signed-in user.
            </p>
          </div>

          <div className="border-t border-white/10 pt-6">
            <h2 className="text-white text-lg font-normal mb-2">Deletion</h2>
            <p className="text-white/60">
              Guests: clear this site's browser data. Account holders: delete your
              progress from the Dashboard, then contact the team to remove your account
              row entirely. We honor deletion requests within 30 days.
            </p>
          </div>
        </div>

        <div className="mt-12 text-sm">
          <Link to="/" className="text-sky-400 hover:text-sky-300 transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
