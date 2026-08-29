import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Wrench, Scale, Globe, Palette, Rocket, Leaf } from 'lucide-react';
import { MODULES } from '../data/modules';

const ICONS = { brain: Brain, wrench: Wrench, scale: Scale, globe: Globe, palette: Palette, rocket: Rocket, leaf: Leaf };

const CARD_SPACING = 260;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

// Pinning is done with plain `position: sticky` inside a tall wrapper
// (N * 100vh), and the active module is derived directly from scroll
// position every frame, rather than by intercepting wheel events and
// guessing whether the section happens to fill the viewport at that exact
// instant. Sticky positioning can't be "scrolled past" by a fast flick or a
// keyboard page-down the way preventDefault-based interception could. The
// browser's own scroll handling guarantees the pin, so this can't miss.
export default function CurriculumScrollCarousel() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    // Runs directly on the scroll event rather than deferring through
    // requestAnimationFrame: the work here is just a bounding-rect read and
    // a couple of comparisons, and setActiveIndex/setPinned already bail
    // out when the value hasn't changed, so there's nothing an extra
    // scheduling layer would buy beyond one more thing that could go wrong.
    const updateFromScroll = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      const maxScroll = wrapper.offsetHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const scrolled = -rect.top;
      setPinned(scrolled > 0 && scrolled < maxScroll);
      const progress = clamp(scrolled / maxScroll, 0, 1);
      const index = Math.round(progress * (MODULES.length - 1));
      setActiveIndex((prev) => (prev === index ? prev : index));
    };

    updateFromScroll();
    window.addEventListener('scroll', updateFromScroll, { passive: true });
    window.addEventListener('resize', updateFromScroll);
    return () => {
      window.removeEventListener('scroll', updateFromScroll);
      window.removeEventListener('resize', updateFromScroll);
    };
  }, []);

  const goTo = (index: number) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const maxScroll = wrapper.offsetHeight - window.innerHeight;
    const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
    const target = wrapperTop + (index / (MODULES.length - 1)) * maxScroll;
    window.scrollTo({ top: target, behavior: 'smooth' });
  };

  return (
    <div ref={wrapperRef} className="relative" style={{ height: `${MODULES.length * 100}vh` }}>
      <section className="sticky top-0 h-screen w-full overflow-hidden border-t border-white/5 flex flex-col items-center justify-center px-6">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-sky-400 text-xs tracking-widest uppercase mb-3">Curriculum</p>
          <h2 className="text-white text-2xl sm:text-3xl font-light tracking-tight">Seven modules, from fundamentals to the future.</h2>
        </div>

        <div
          className="relative w-full max-w-4xl h-[220px]"
          style={{
            perspective: 1400,
            maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
          }}
        >
          {MODULES.map((mod, i) => {
            const Icon = ICONS[mod.icon];
            const offset = i - activeIndex;
            const isActive = offset === 0;
            const abs = Math.abs(offset);

            return (
              <div
                key={mod.id}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ zIndex: 10 - abs, pointerEvents: abs <= 1 ? 'auto' : 'none' }}
                aria-hidden={!isActive}
              >
                <motion.div
                  className="w-56 sm:w-64"
                  animate={{
                    x: offset * CARD_SPACING,
                    scale: isActive ? 1.15 : abs === 1 ? 0.85 : 0.72,
                    opacity: abs >= 3 ? 0 : abs === 2 ? 0.2 : isActive ? 1 : 0.55,
                    // 'none' rather than 'blur(0px)' for the two cards that need no
                    // blur: a filter value of blur(0px) is still a real filter (not
                    // the keyword none), so it makes this div a "backdrop root" for
                    // CSS purposes exactly like a visible blur would. That cuts off
                    // the .liquid-glass card inside it from the real page behind it,
                    // so its backdrop-filter has nothing to sample and Light Mode's
                    // invert-cancel trick (index.css) has nothing correct to cancel
                    // — the card renders washed out instead of its intended dark
                    // glass panel. Only the far, near-invisible cards (opacity 0.2)
                    // that are actually meant to look blurred pay that cost. (This
                    // no longer matters for Light Mode specifically — see the
                    // .curriculum-card note in index.css — but still matters for
                    // .liquid-glass's ordinary backdrop-filter in dark mode.)
                    filter: abs >= 2 ? 'blur(6px)' : 'none',
                  }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={`/modules/${mod.id}`}
                    onClick={(e) => {
                      if (!isActive) {
                        e.preventDefault();
                        goTo(i);
                      }
                    }}
                    className={`group block rounded-2xl liquid-glass curriculum-card p-5 transition-shadow ${isActive ? 'shadow-lg shadow-sky-500/10' : ''}`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className="w-4 h-4 text-sky-300 shrink-0" strokeWidth={1.5} />
                      <span className="text-white/30 text-xs">Module {i + 1}</span>
                    </div>
                    <p className="text-white text-sm font-normal mb-1 group-hover:text-sky-300 transition-colors">{mod.title}</p>
                    <p className="text-white/40 text-xs font-light leading-relaxed">{mod.tagline}</p>
                  </Link>
                </motion.div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-2 mt-10">
          {MODULES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to module ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? 'w-6 bg-sky-400' : 'w-1.5 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        <motion.p className="text-white/25 text-xs mt-6" animate={{ opacity: pinned ? 1 : 0 }} transition={{ duration: 0.3 }}>
          {activeIndex < MODULES.length - 1 ? 'Keep scrolling to see every module' : 'Scroll to continue'}
        </motion.p>
      </section>
    </div>
  );
}
