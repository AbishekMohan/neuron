import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Newspaper } from 'lucide-react';
import { getHeadlines, tagHeadline, timeAgo, type Headline } from '../lib/newsFeed';

export default function NewsFeedStrip() {
  const [headlines, setHeadlines] = useState<Headline[] | null>(null);
  const [fetchedAt, setFetchedAt] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    getHeadlines().then((result) => {
      if (cancelled) return;
      setHeadlines(result.headlines);
      setFetchedAt(result.fetchedAt);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!headlines || headlines.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <Newspaper className="w-4 h-4 text-sky-300" />
        <p className="text-white/50 text-xs uppercase tracking-widest">AI in the news</p>
        <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-300/80">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
          </span>
          Live
        </span>
        {fetchedAt && <span className="text-white/25 text-[10px]">Updated {timeAgo(new Date(fetchedAt).toISOString())}</span>}
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: 'thin' }}>
        {headlines.map((h, i) => {
          const tag = tagHeadline(h.title);
          return (
            <motion.a
              key={h.link}
              href={h.link}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="group shrink-0 w-64 border-r border-white/10 pr-4 last:border-0 hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/30 text-[10px] uppercase tracking-widest">{h.source}</span>
                {tag && (
                  <span className="text-[9px] text-sky-300/70 border border-sky-400/20 rounded-full px-2 py-0.5">
                    {tag}
                  </span>
                )}
              </div>
              <p className="text-white/80 text-sm font-light leading-snug line-clamp-3 group-hover:text-white transition-colors">
                {h.title}
              </p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-white/25 text-[10px]">{timeAgo(h.pubDate)}</span>
                <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-sky-300 transition-colors" />
              </div>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}
