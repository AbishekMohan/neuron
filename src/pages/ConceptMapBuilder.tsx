import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, ArrowLeft } from 'lucide-react';
import { CONCEPT_NODES, CONCEPT_EDGES, nodePosition } from '../data/conceptMap';

type DrawnEdge = { from: string; to: string };

function edgeKey(e: { from: string; to: string }) {
  return `${e.from}->${e.to}`;
}

export default function ConceptMapBuilder() {
  const [pendingFrom, setPendingFrom] = useState<string | null>(null);
  const [drawn, setDrawn] = useState<DrawnEdge[]>([]);
  const [checked, setChecked] = useState(false);

  const correctSet = useMemo(() => new Set(CONCEPT_EDGES.map(edgeKey)), []);
  const drawnSet = useMemo(() => new Set(drawn.map(edgeKey)), [drawn]);

  const clickNode = (id: string) => {
    if (checked) return;
    if (!pendingFrom) {
      setPendingFrom(id);
      return;
    }
    if (pendingFrom === id) {
      setPendingFrom(null);
      return;
    }
    const key = edgeKey({ from: pendingFrom, to: id });
    setDrawn((prev) => {
      if (prev.some((e) => edgeKey(e) === key)) return prev.filter((e) => edgeKey(e) !== key);
      return [...prev, { from: pendingFrom, to: id }];
    });
    setPendingFrom(null);
  };

  const check = () => setChecked(true);
  const reset = () => {
    setDrawn([]);
    setPendingFrom(null);
    setChecked(false);
  };

  const correctDrawnCount = drawn.filter((e) => correctSet.has(edgeKey(e))).length;
  const missedCount = CONCEPT_EDGES.length - correctDrawnCount;
  const wrongCount = drawn.length - correctDrawnCount;

  const nodeById = (id: string) => CONCEPT_NODES.find((n) => n.id === id)!;

  type DisplayEdge = { from: string; to: string; kind: 'drawn' | 'correct' | 'wrong' | 'missed' };
  const displayEdges: DisplayEdge[] = checked
    ? [
        ...CONCEPT_EDGES.map((e): DisplayEdge => ({ ...e, kind: drawnSet.has(edgeKey(e)) ? 'correct' : 'missed' })),
        ...drawn.filter((e) => !correctSet.has(edgeKey(e))).map((e): DisplayEdge => ({ ...e, kind: 'wrong' })),
      ]
    : drawn.map((e): DisplayEdge => ({ ...e, kind: 'drawn' }));

  return (
    <section className="px-6 sm:px-8 md:px-12 pt-28 md:pt-36 pb-24 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <p className="text-sky-400 text-xs tracking-widest uppercase mb-3">Concept Map Builder</p>
        <h1 className="text-white text-3xl sm:text-4xl font-light leading-tight tracking-tight">
          Connect the terms that actually relate
        </h1>
        <p className="text-white/50 text-sm mt-4 max-w-xl font-light">
          Click a term, then click the term it connects to, to draw a link. Click a linked pair again to remove it.
          Not every pair of terms is related.
        </p>

        <div className="mt-8 rounded-2xl liquid-glass p-6">
          <div className="relative w-full aspect-square max-w-md mx-auto">
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" aria-hidden="true">
              {displayEdges.map((e, i) => {
                const from = nodePosition(nodeById(e.from).angleDeg);
                const to = nodePosition(nodeById(e.to).angleDeg);
                const stroke =
                  e.kind === 'correct'
                    ? '#38bdf8'
                    : e.kind === 'wrong'
                      ? 'rgba(255,255,255,0.3)'
                      : e.kind === 'missed'
                        ? 'rgba(255,255,255,0.15)'
                        : '#38bdf8';
                const dashed = e.kind === 'missed';
                return (
                  <line
                    key={`${edgeKey(e)}-${i}`}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={stroke}
                    strokeWidth={1.2}
                    strokeDasharray={dashed ? '2 2' : undefined}
                  />
                );
              })}
            </svg>

            {CONCEPT_NODES.map((node) => {
              const pos = nodePosition(node.angleDeg);
              const isPending = pendingFrom === node.id;
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => clickNode(node.id)}
                  disabled={checked}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-2 text-xs whitespace-nowrap transition-colors ${
                    isPending
                      ? 'border-sky-400 bg-sky-400/20 text-white'
                      : 'border-white/20 bg-black/60 text-white/80 hover:border-sky-400/40 hover:text-white'
                  }`}
                >
                  {node.label}
                </button>
              );
            })}
          </div>

          {checked && (
            <div className="mt-6 flex flex-col gap-2">
              <p className="text-white/60 text-sm">
                <span className="text-sky-300">{correctDrawnCount} correct</span>
                {wrongCount > 0 && <span className="text-white/40"> · {wrongCount} incorrect</span>}
                {missedCount > 0 && <span className="text-white/40"> · {missedCount} missed (dashed)</span>}
              </p>
              <ul className="text-white/40 text-xs font-light flex flex-col gap-1 mt-1">
                {CONCEPT_EDGES.map((e) => (
                  <li key={edgeKey(e)}>
                    <span className="text-white/60">{nodeById(e.from).label}</span> {e.relation}{' '}
                    <span className="text-white/60">{nodeById(e.to).label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 border border-white/15 text-white/70 text-sm rounded-full px-4 py-2.5 hover:border-white/30 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            {!checked && (
              <button
                type="button"
                onClick={check}
                disabled={drawn.length === 0}
                className="inline-flex items-center gap-2 bg-white text-black text-sm font-medium rounded-full px-5 py-2.5 hover:bg-white/90 disabled:opacity-40 transition-colors"
              >
                Check my map
              </button>
            )}
          </div>
        </div>

        <Link to="/challenges" className="inline-flex items-center gap-2 mt-6 text-white/30 hover:text-white/60 text-xs transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          More challenges
        </Link>
      </div>
    </section>
  );
}
