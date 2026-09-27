import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';
import { MODULES } from '../data/modules';

// Useful 404 (brief P3): a dead end with only "back to home" wastes a lost
// judge. Site search over modules/glossary terms plus the three required
// modules gets them back to content in one click.
const QUICK_LINKS = [
  { to: '/modules', label: 'All learning modules' },
  { to: '/challenges', label: 'Challenges & mini-games' },
  { to: '/glossary', label: 'AI glossary' },
  { to: '/reference', label: 'Sources & references' },
];

export default function NotFound() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const results = q
    ? MODULES.filter(
        (m) => m.title.toLowerCase().includes(q) || m.id.toLowerCase().includes(q),
      ).slice(0, 5)
    : MODULES.slice(0, 3);

  return (
    <section className="px-6 sm:px-8 md:px-12 pt-28 md:pt-36 pb-24 min-h-screen flex items-center">
      <div className="max-w-md mx-auto text-center w-full">
        <p className="text-white/40 text-sm mb-2">404</p>
        <h1 className="text-white text-2xl font-light mb-2">Page not found</h1>
        <p className="text-white/50 text-sm mb-6">
          That URL doesn't exist — but the course does. Search the modules:
        </p>

        <label className="relative block mb-4">
          <span className="sr-only">Search learning modules</span>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search modules (e.g. ethics, tools…)"
            className="w-full rounded-full border border-white/15 bg-white/5 pl-11 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-sky-400/50 focus:outline-none"
          />
        </label>

        <ul className="flex flex-col gap-2 mb-6">
          {results.map((m) => (
            <li key={m.id}>
              <Link
                to={`/modules/${m.id}`}
                className="block rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/80 hover:border-sky-400/40 hover:text-white transition-colors"
              >
                {m.title}
              </Link>
            </li>
          ))}
          {q && results.length === 0 && (
            <li className="text-white/40 text-sm">No modules match "{query}". Try "ethics" or "tools".</li>
          )}
        </ul>

        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mb-6 text-sm">
          {QUICK_LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="text-sky-400 hover:text-sky-300 transition-colors">
              {l.label}
            </Link>
          ))}
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to home
        </Link>
      </div>
    </section>
  );
}
