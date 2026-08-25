import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Circle, Play, Pause, Square, Volume2 } from 'lucide-react';
import type { ArticleSection } from '../../data/modules';
import { getSource } from '../../data/sources';
import { speak, stopSpeaking } from '../../lib/speechPulse';
import InlineCheck from './InlineCheck';

type ArticleStepProps = {
  sections: ArticleSection[];
  complete: boolean;
  onComplete: () => void;
};

const sectionText = (s: ArticleSection) => `${s.heading}. ${s.paragraphs.join(' ')}`;

export default function ArticleStep({ sections, complete, onComplete }: ArticleStepProps) {
  // A real audio-first path through the article, not a novelty: reads
  // section by section using the same browser TTS as the assistant. A
  // session counter guards against speechSynthesis.cancel()'s onend/onerror
  // firing after an explicit Stop and wrongly auto-advancing to the next
  // section. Cancellation behavior here is inconsistent across browsers,
  // so this is the one thing that has to be defended against explicitly.
  const [readingIndex, setReadingIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const sessionRef = useRef(0);

  useEffect(() => {
    return () => {
      // sessionRef is a plain counter, never attached to a DOM node via
      // `ref=`, so the usual "ref may already be nulled by cleanup time"
      // concern doesn't apply. Incrementing it here is what invalidates
      // a still-pending speak() onEnd callback so it can't setState
      // after this component has unmounted.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      sessionRef.current++;
      stopSpeaking();
    };
  }, []);

  const playFrom = (index: number) => {
    if (index >= sections.length) {
      setReadingIndex(null);
      return;
    }
    const session = ++sessionRef.current;
    setReadingIndex(index);
    setIsPaused(false);
    speak(sectionText(sections[index]), {
      onEnd: () => {
        if (sessionRef.current !== session) return; // superseded by a stop/skip. Don't chain
        playFrom(index + 1);
      },
    });
  };

  const handlePlayPause = () => {
    if (readingIndex === null) {
      playFrom(0);
      return;
    }
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    sessionRef.current++;
    stopSpeaking();
    setReadingIndex(null);
    setIsPaused(false);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
        <Volume2 className="w-4 h-4 text-sky-300 shrink-0" />
        <p className="text-white/50 text-xs font-light flex-1">
          {readingIndex === null
            ? 'Listen to this article instead of reading it.'
            : `Reading: ${sections[readingIndex]?.heading}`}
        </p>
        <button
          type="button"
          onClick={handlePlayPause}
          aria-label={readingIndex === null ? 'Play article audio' : isPaused ? 'Resume' : 'Pause'}
          className="w-7 h-7 shrink-0 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          {readingIndex !== null && !isPaused ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
        </button>
        {readingIndex !== null && (
          <button
            type="button"
            onClick={handleStop}
            aria-label="Stop reading"
            className="w-7 h-7 shrink-0 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 transition-colors"
          >
            <Square className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-10">
        {sections.map((section, i) => (
          <section
            key={section.id}
            className={`transition-colors ${readingIndex === i ? 'rounded-xl -mx-4 px-4 py-3 bg-sky-400/5 ring-1 ring-sky-400/20' : ''}`}
          >
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
