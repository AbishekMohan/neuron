import { useMemo, useState } from 'react';
import { AI_TOOLS, TOOL_CATEGORIES, COST_TIERS, type ToolCategory, type CostTier } from '../data/aiTools';

export default function ToolCompare() {
  const [category, setCategory] = useState<ToolCategory | 'All'>('All');
  const [cost, setCost] = useState<CostTier | 'All'>('All');

  const filtered = useMemo(
    () => AI_TOOLS.filter((t) => (category === 'All' || t.category === category) && (cost === 'All' || t.cost === cost)),
    [category, cost],
  );

  return (
    <section className="px-6 sm:px-8 md:px-12 pt-28 md:pt-36 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <p className="text-sky-400 text-xs tracking-widest uppercase mb-3">AI Tools</p>
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-light leading-tight tracking-tight">
          Tools students actually use
        </h1>
        <p className="text-white/50 text-sm mt-4 max-w-xl font-light">
          Pricing and features change often. Treat this as a starting point for what to ask about, not a final
          verdict. School policies on AI tools vary; when in doubt, ask your teacher.
        </p>

        <div className="flex flex-wrap gap-3 mt-8">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ToolCategory | 'All')}
            className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white outline-none focus:border-sky-400/40"
          >
            <option value="All">All categories</option>
            {TOOL_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={cost}
            onChange={(e) => setCost(e.target.value as CostTier | 'All')}
            className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white outline-none focus:border-sky-400/40"
          >
            <option value="All">Any cost</option>
            {COST_TIERS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-8 border-t border-white/10">
          {filtered.length === 0 && <p className="text-white/40 text-sm py-5">No tools match those filters.</p>}
          {filtered.map((tool) => (
            <div key={tool.name} className="border-b border-white/10 py-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                <p className="text-white text-base font-normal">{tool.name}</p>
                <div className="flex gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-sky-300/70 border border-sky-400/20 rounded-full px-2.5 py-0.5">
                    {tool.category}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-white/40 border border-white/10 rounded-full px-2.5 py-0.5">
                    {tool.cost}
                  </span>
                </div>
              </div>
              <p className="text-white/60 text-sm font-light leading-relaxed mb-2">{tool.useCase}</p>
              <p className="text-white/35 text-xs font-light leading-relaxed">{tool.schoolNote}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
