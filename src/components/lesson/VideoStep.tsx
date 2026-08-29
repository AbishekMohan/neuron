import { PlayCircle, CheckCircle2, Circle, Clock } from 'lucide-react';

type VideoStepProps = {
  title: string;
  embedUrl: string | null;
  description: string;
  complete: boolean;
  onComplete: () => void;
};

// A direct video file (served from /public) plays natively; anything else
// (YouTube, Vimeo, etc.) is an embeddable player URL that needs an iframe.
const isLocalFile = (url: string) => /\.(mp4|webm|ogg|mov)$/i.test(url);

export default function VideoStep({ title, embedUrl, description, complete, onComplete }: VideoStepProps) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-white text-xl font-normal mb-2">{title}</h2>
      <p className="text-white/60 text-sm font-light leading-relaxed mb-6">{description}</p>

      <div className="relative w-full aspect-video rounded-2xl overflow-hidden liquid-glass">
        {embedUrl && isLocalFile(embedUrl) ? (
          <video
            src={embedUrl}
            title={title}
            className="absolute inset-0 w-full h-full"
            controls
            preload="metadata"
          />
        ) : embedUrl ? (
          <iframe
            src={embedUrl}
            title={title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-6">
            <PlayCircle className="w-10 h-10 text-white/20" strokeWidth={1} />
            <p className="text-white/40 text-sm">Video coming soon</p>
            <p className="text-white/25 text-xs max-w-xs inline-flex items-center gap-1.5">
              <Clock className="w-3 h-3 shrink-0" />
              This module’s video hasn’t been added yet
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-white/10">
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
          {complete ? 'Video complete' : 'Mark video watched'}
        </button>
      </div>
    </div>
  );
}
