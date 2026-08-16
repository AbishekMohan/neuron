import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { getSource } from '../data/sources';

type WhyItem = { text: string; sourceId: string };

const WHY_ITEMS: WhyItem[] = [
  {
    text: 'A 2024 survey found that roughly 7 in 10 teens have already used a generative AI tool, and most say their school hasn’t given them clear rules for how to use it.',
    sourceId: 'common-sense-media-2024',
  },
  {
    text: 'UNESCO published a formal AI Competency Framework for Students in 2024, defining what AI literacy should look like at each stage of education: this course is built around that same spirit of understanding how AI works before relying on it.',
    sourceId: 'unesco-competency-2024',
  },
];

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

// Same pinning approach as CurriculumScrollCarousel (sticky inside a tall
// wrapper, index derived straight from scroll position), but each item now
// gets its own dedicated 100vh scroll segment: progress through that
// segment drives a word-by-word highlight, and crossing into the next
// segment is what triggers the flip to the next card.
export default function WhyItMattersScroll() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [localProgress, setLocalProgress] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const update = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const segmentPx = window.innerHeight;
      const maxScroll = wrapper.offsetHeight - segmentPx;
      if (maxScroll <= 0) return;
      const rawScrolled = -wrapper.getBoundingClientRect().top;
      setPinned(rawScrolled > 0 && rawScrolled < maxScroll);
      const scrolled = clamp(rawScrolled, 0, maxScroll);
      const index = Math.min(Math.floor(scrolled / segmentPx), WHY_ITEMS.length - 1);
      const within = clamp((scrolled - index * segmentPx) / segmentPx, 0, 1);
      setActiveIndex(index);
      setLocalProgress(within);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const item = WHY_ITEMS[activeIndex];
  const source = getSource(item.sourceId);
  const words = item.text.split(' ');
  const highlightCount = Math.floor(localProgress * words.length);

  return (
    <div ref={wrapperRef} className="relative" style={{ height: `${(WHY_ITEMS.length + 1) * 100}vh` }}>
      <section className="sticky top-0 h-screen w-full overflow-hidden border-t border-white/5 flex flex-col items-center justify-center px-6">
        <p className="text-sky-400 text-xs tracking-widest uppercase mb-8">Why this matters</p>

        <div className="max-w-3xl mx-auto text-center" style={{ perspective: 1200 }}>
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, rotateX: 40, y: 30 }}
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-2xl sm:text-3xl md:text-4xl font-light leading-snug tracking-tight">
              {words.map((word, i) => (
                <span key={i} className={`transition-colors duration-300 ${i < highlightCount ? 'text-white' : 'text-white/20'}`}>
                  {word}{' '}
                </span>
              ))}
            </p>
            {source && (
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="text-sky-400/80 hover:text-sky-300 text-xs mt-8 inline-block transition-colors"
              >
                Source: {source.title}, {source.publisher}
              </a>
            )}
          </motion.div>
        </div>

        <div className="flex items-center gap-2 mt-10">
          {WHY_ITEMS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-6 bg-sky-400' : 'w-1.5 bg-white/20'}`}
            />
          ))}
        </div>

        <motion.p className="text-white/25 text-xs mt-6" animate={{ opacity: pinned ? 1 : 0 }} transition={{ duration: 0.3 }}>
          {activeIndex < WHY_ITEMS.length - 1 ? 'Keep scrolling to read on' : 'Scroll to continue'}
        </motion.p>
      </section>
    </div>
  );
}
