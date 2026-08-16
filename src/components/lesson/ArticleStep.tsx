import { CheckCircle2, Circle } from 'lucide-react';
import type { ArticleSection } from '../../data/modules';
import { getSource } from '../../data/sources';
import InlineCheck from './InlineCheck';

type ArticleStepProps = {
  sections: ArticleSection[];
  complete: boolean;
  onComplete: () => void;
};

export default function ArticleStep({ sections, complete, onComplete }: ArticleStepProps) {
  return (
    <div>
      <div className="flex flex-col gap-10">
        {sections.map((section) => (
          <section key={section.id}>
            <h2 className="text-white text-xl font-normal mb-4">{section.heading}</h2>
            <div className="flex flex-col gap-4">
              {section.paragraphs.map((paragraph, i) => (
                <p key={i} className="text-white/70 text-sm font-light leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {section.sourceIds && section.sourceIds.length > 0 && (
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3">
                {section.sourceIds.map((id) => {
                  const source = getSource(id);
                  if (!source) return null;
                  return (
                    <a
                      key={id}
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-white/30 hover:text-sky-300 text-xs transition-colors"
                    >
                      {source.title} ↗
                    </a>
                  );
                })}
              </div>
            )}

            {section.checkpoint && <InlineCheck question={section.checkpoint} />}
          </section>
        ))}
      </div>

      <div className="mt-10 pt-8 border-t border-white/10">
        <button
          type="button"
          onClick={onComplete}
          disabled={complete}
          className={`inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full transition-colors ${
            complete
              ? 'bg-sky-400/10 border border-sky-400/40 text-sky-300 cursor-default'
              : 'bg-white text-black hover:bg-white/90'
          }`}
        >
          {complete ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
          {complete ? 'Article complete' : 'Mark article complete'}
        </button>
      </div>
    </div>
  );
}
