import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { GLOSSARY, GLOSSARY_CATEGORIES, type GlossaryTerm } from '../data/glossary';

export default function Glossary() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<GlossaryTerm['category'] | 'All'>('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GLOSSARY.filter((t) => {
      if (category !== 'All' && t.category !== category) return false;
      if (!q) return true;
      return t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q);
    });
  }, [query, category]);

  return (
    <section className="px-6 sm:px-8 md:px-12 pt-28 md:pt-36 pb-24 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <p className="text-sky-400 text-xs tracking-widest uppercase mb-3">Glossary</p>
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-light leading-tight tracking-tight">
          Key AI terms
        </h1>
        <p className="text-white/50 text-sm mt-4 max-w-xl font-light">
          Plain-language definitions for terms used throughout the course, grouped by the same areas the modules
          cover.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-white/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search terms..."
              className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-sky-400/40"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {(['All', ...GLOSSARY_CATEGORIES] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors ${
                category === c
                  ? 'border-sky-400/50 bg-sky-400/10 text-white'
                  : 'border-white/10 text-white/50 hover:text-white hover:border-white/20'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3">
          {filtered.length === 0 && (
            <p className="text-white/40 text-sm">No terms match “{query}”.</p>
          )}
          {filtered.map((t) => (
            <div key={t.term} className="rounded-xl liquid-glass p-5">
              <div className="flex items-baseline justify-between gap-3 mb-1.5">
                <p className="text-white text-base font-normal">{t.term}</p>
                <span className="shrink-0 text-[10px] uppercase tracking-widest text-sky-300/70">{t.category}</span>
              </div>
              <p className="text-white/60 text-sm font-light leading-relaxed">{t.definition}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
