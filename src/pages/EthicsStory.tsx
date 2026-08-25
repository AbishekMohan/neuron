import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, ArrowLeft, Sparkles, AlertTriangle, Scale } from 'lucide-react';
import { STORY_NODES, STORY_START_ID } from '../data/ethicsStory';

// One hue (the site's blue), three brightness levels instead of three
// hues. Good outcomes read as bright/saturated blue, bad ones fade to
// plain neutral gray, mixed sits between the two.
const OUTCOME_STYLE = {
  good: { icon: Sparkles, color: 'text-sky-300', border: 'border-sky-400/40', bg: 'bg-sky-400/10', label: 'Good outcome' },
  mixed: { icon: Scale, color: 'text-sky-400/70', border: 'border-sky-400/15', bg: 'bg-sky-400/5', label: 'Mixed outcome' },
  bad: { icon: AlertTriangle, color: 'text-white/40', border: 'border-white/10', bg: 'bg-white/[0.02]', label: 'Bad outcome' },
} as const;

export default function EthicsStory() {
  const [nodeId, setNodeId] = useState(STORY_START_ID);
  const [path, setPath] = useState<string[]>([STORY_START_ID]);
  const node = STORY_NODES[nodeId];

  const choose = (nextId: string) => {
    setNodeId(nextId);
    setPath((p) => [...p, nextId]);
  };

  const restart = () => {
    setNodeId(STORY_START_ID);
    setPath([STORY_START_ID]);
  };

  return (
    <section className="px-6 sm:px-8 md:px-12 pt-28 md:pt-36 pb-24 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <p className="text-sky-400 text-xs tracking-widest uppercase mb-3">Ethics Story</p>
        <h1 className="text-white text-3xl sm:text-4xl font-light leading-tight tracking-tight">The Deadline</h1>
        <p className="text-white/50 text-sm mt-4 max-w-xl font-light">
          A choose-your-own-adventure about AI use under pressure. There's more than one ending. Try a few.
        </p>

        <div className="flex items-center gap-1.5 mt-6">
          {path.map((_id, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i === path.length - 1 ? 'bg-sky-400' : 'bg-white/15'}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={node.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={`mt-6 rounded-2xl liquid-glass p-6 ${node.kind === 'ending' ? OUTCOME_STYLE[node.outcome].border : ''}`}
          >
            {node.kind === 'ending' && (
              <div className={`inline-flex items-center gap-1.5 text-xs uppercase tracking-widest mb-4 ${OUTCOME_STYLE[node.outcome].color}`}>
                {(() => {
                  const Icon = OUTCOME_STYLE[node.outcome].icon;
                  return <Icon className="w-3.5 h-3.5" />;
                })()}
                {OUTCOME_STYLE[node.outcome].label}
              </div>
            )}

            <p className="text-white text-base font-light leading-relaxed">{node.text}</p>

            {node.kind === 'decision' ? (
              <div className="flex flex-col gap-2.5 mt-6">
                {node.choices.map((choice) => (
                  <button
                    key={choice.nextId}
                    type="button"
                    onClick={() => choose(choice.nextId)}
                    className="text-left rounded-xl border border-white/15 px-4 py-3 text-sm text-white/80 hover:border-sky-400/40 hover:bg-sky-400/5 hover:text-white transition-colors"
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
            ) : (
              <>
                <p className={`mt-4 text-sm font-light leading-relaxed rounded-lg p-4 ${OUTCOME_STYLE[node.outcome].bg} text-white/70`}>
                  {node.lesson}
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={restart}
                    className="inline-flex items-center gap-2 bg-white text-black text-sm font-medium rounded-full px-5 py-2.5 hover:bg-white/90 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Try a different path
                  </button>
                  <Link
                    to="/challenges"
                    className="inline-flex items-center gap-2 border border-white/15 text-white/70 text-sm rounded-full px-5 py-2.5 hover:border-white/30 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    More challenges
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
