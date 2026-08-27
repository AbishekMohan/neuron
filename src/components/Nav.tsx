import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, BrainCircuit, HelpCircle, Accessibility } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import AuthWidget from './AuthWidget';
import { useAccessibility } from '../context/AccessibilityContext';
import type { TranslationKey } from '../lib/i18n';

const NAV_LINKS: { key: TranslationKey; to: string }[] = [
  { key: 'nav.home', to: '/' },
  { key: 'nav.modules', to: '/modules' },
  { key: 'nav.companion', to: '/companion' },
  { key: 'nav.challenges', to: '/challenges' },
  { key: 'nav.leaderboard', to: '/leaderboard' },
  { key: 'nav.dashboard', to: '/dashboard' },
  { key: 'nav.reference', to: '/reference' },
];

export default function Nav({ onOpenTutorial }: { onOpenTutorial: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const location = useLocation();
  const { t } = useAccessibility();

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  // Hide on scroll-down, reveal on scroll-up. Stays put near the top of the
  // page (and whenever the mobile menu is open) so it doesn't flicker.
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (isOpen) {
        setHidden(false);
      } else if (currentY > lastScrollY.current && currentY > 96) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  return (
    <>
      <motion.nav
        animate={{ y: hidden ? '-100%' : '0%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 sm:px-8 md:px-12 py-5 md:py-6"
      >
        <Link to="/" className="flex items-center gap-2 text-white font-light text-lg tracking-wide">
          <BrainCircuit className="w-5 h-5 text-sky-400" strokeWidth={1.5} />
          <span className="font-normal tracking-widest">NEURON</span>
        </Link>

        <div className="hidden lg:flex items-center gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm px-4 py-2 rounded-full transition-all duration-300 ${
                isActive(link.to)
                  ? 'border border-white/60 text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {t(link.key)}
            </Link>
          ))}
          <Link
            to="/settings"
            aria-label="Accessibility settings"
            title="Accessibility settings"
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
              isActive('/settings') ? 'text-sky-300 bg-white/5' : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <Accessibility className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={onOpenTutorial}
            aria-label="Replay site tutorial"
            title="Site tutorial"
            className="w-8 h-8 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/5 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <AuthWidget variant="desktop" />
          <Link
            to="/profile"
            className="bg-white text-black text-sm font-medium px-5 py-2 rounded-full hover:bg-white/90 ml-2"
          >
            {t('nav.myProfile')}
          </Link>
        </div>

        <button
          className="lg:hidden relative z-[60] w-10 h-10 flex items-center justify-center text-white"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.span
                key="close"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <X size={24} />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Menu size={24} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[55] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            />

            <button
              className="absolute top-5 right-6 z-[60] w-10 h-10 flex items-center justify-center text-white"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>

            <div className="relative z-[56] h-full flex flex-col items-center justify-center gap-6">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                >
                  <Link
                    to={link.to}
                    className="text-white text-2xl font-light"
                    onClick={() => setIsOpen(false)}
                  >
                    {t(link.key)}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="inline-block bg-white text-black text-lg font-medium px-8 py-3 rounded-full mt-4"
                >
                  {t('nav.myProfile')}
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.45 }}
              >
                <AuthWidget variant="mobile" />
              </motion.div>
              <motion.button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenTutorial();
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center gap-2 text-white/50 text-sm"
              >
                <HelpCircle className="w-4 h-4" />
                Site tutorial
              </motion.button>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.55 }}
              >
                <Link
                  to="/settings"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-2 text-white/50 text-sm"
                >
                  <Accessibility className="w-4 h-4" />
                  Accessibility settings
                </Link>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
