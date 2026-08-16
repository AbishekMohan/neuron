import { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import type { InlineQuestion } from '../../data/modules';
import { getSource } from '../../data/sources';

// An ungraded "quick check" embedded mid-article. Immediate feedback,
// re-answerable, purely to help the student notice whether the section
// actually landed before they move on.
export default function InlineCheck({ question }: { question: InlineQuestion }) {
  const [selected, setSelected] = useState<number | null>(null);
  const source = question.sourceId ? getSource(question.sourceId) : undefined;

  return (
    <div className="rounded-xl liquid-glass p-5 my-2">
      <div className="flex items-center gap-2 mb-3 text-sky-300/90 text-xs uppercase tracking-widest">
        <HelpCircle className="w-3.5 h-3.5" />
        Quick check
      </div>
      <p className="text-white text-sm font-normal mb-4">{question.prompt}</p>

      <div className="flex flex-col gap-2">
        {question.choices.map((choice, i) => {
          const isSelected = selected === i;
          const isCorrect = i === question.correctIndex;
          const showState = selected !== null;

          return (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              className={`text-left text-sm px-4 py-2.5 rounded-lg border transition-colors flex items-center gap-2.5 ${
                showState && isCorrect
                  ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200'
                  : showState && isSelected
                    ? 'border-red-400/40 bg-red-400/10 text-red-200'
                    : 'border-white/10 text-white/70 hover:border-white/25 hover:bg-white/5'
              }`}
            >
              {showState && isCorrect && <CheckCircle2 className="w-4 h-4 shrink-0" />}
              {showState && isSelected && !isCorrect && <XCircle className="w-4 h-4 shrink-0" />}
              <span>{choice}</span>
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-white/60 text-xs font-light leading-relaxed">{question.explanation}</p>
          {source && (
            <a
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-2 text-sky-400/80 hover:text-sky-300 text-xs transition-colors"
            >
              Source: {source.title} ({source.publisher})
            </a>
          )}
        </div>
      )}
    </div>
  );
}
