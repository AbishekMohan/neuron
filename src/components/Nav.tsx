import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, BrainCircuit, HelpCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import AuthWidget from './AuthWidget';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Modules', to: '/modules' },
  { label: 'Leaderboard', to: '/leaderboard' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Reference', to: '/reference' },
];

export default function Nav({ onOpenTutorial }: { onOpenTutorial: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 sm:px-8 md:px-12 py-5 md:py-6">
        <Link to="/" className="flex items-center gap-2 text-white font-light text-lg tracking-wide">
          <BrainCircuit className="w-5 h-5 text-sky-400" strokeWidth={1.5} />
          <span className="font-normal tracking-widest">NEURON</span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
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
              {link.label}
            </Link>
          ))}
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
            My Profile
          </Link>
        </div>

        <button
          className="md:hidden relative z-[60] w-10 h-10 flex items-center justify-center text-white"
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
      </nav>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[55] md:hidden">
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
                    {link.label}
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
                  My Profile
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
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
