import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Award, Lock } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { BADGES } from '../data/badges';
import ProgressBar from './ProgressBar';
import FAQ, { type FAQItem } from './FAQ';
import HowItWorksShowcase from './HowItWorksShowcase';
import CurriculumScrollCarousel from './CurriculumScrollCarousel';
import WhyItMattersScroll from './WhyItMattersScroll';

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Is this course actually free?',
    answer:
      'Yes. Every module, article, flashcard deck, mini-game, and quiz is free to use, with no account required to start. Signing in is optional and only used to sync your XP and badges across devices.',
  },
  {
    question: 'Do I need any coding or AI experience?',
    answer:
      'No. This course starts from the basics, what AI actually is, and builds up from there. It’s written for high school students with no prior background.',
  },
  {
    question: 'How does XP and leveling work?',
    answer:
      'Each module has five steps: article, flashcards, video, mini-game, and quiz. Completing a step earns XP; passing a module’s quiz at 80% or higher unlocks that module’s badge and a completion bonus. Your level is based on total XP earned.',
  },
  {
    question: 'What are the 3D badges?',
    answer:
      'Each badge is a unique, procedurally generated 3D shape you earn by mastering a module or hitting an XP milestone. They’re shown on your dashboard and public profile.',
  },
  {
    question: 'Can I use the built-in AI assistant to do my homework for me?',
    answer:
      'It’s built to coach, not to do the work for you: it explains concepts and asks guiding questions rather than producing submittable answers, the same line this course’s ethics module teaches. Always check your teacher’s specific AI policy before using any AI tool on an assignment.',
  },
  {
    question: 'Where do the facts in this course come from?',
    answer:
      'Every factual claim is tied to a specific, citable source: government agencies like NIST and the U.S. Copyright Office, standards bodies like SAE International, peer-reviewed papers, and established AI-education nonprofits like AI4K12. The full bibliography is on the Reference page.',
  },
  {
    question: 'What happens to my progress if I don’t sign in?',
    answer:
      'It’s saved locally on your device, so it’ll still be there next time you visit the same browser. Signing in with a magic link (no password) syncs that progress to your account and lets you appear on the leaderboard.',
  },
  {
    question: 'Is the leaderboard public? Does it show my real name or email?',
    answer:
      'The leaderboard only shows a display name you choose yourself and your avatar color: never your email. You can also skip setting up a public profile entirely and just track your own progress privately.',
  },
];

export default function HeroContent() {
  const { xp, level, earnedBadgeIds } = useProgress();

  return (
    <div>
      {/* ── Top: headline + progress card ─────────────────────────────── */}
      <section className="px-6 sm:px-8 md:px-12 pt-24 md:pt-32 pb-20 md:pb-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-[1.1] tracking-tight">
              Understand AI.
              <br />
              Use it wisely.
              <br />
              Think critically.
            </h1>
            <p className="text-white/50 text-sm mt-6 font-light max-w-md">
              A free, interactive AI literacy course for high school students, covering the fundamentals,
              practical tools, and ethical use. No coding or prior experience required.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <Link
                to="/modules"
                className="inline-flex items-center gap-2 bg-white text-black text-sm font-medium px-6 py-3 rounded-full hover:bg-white/90 transition-colors"
              >
                Start Learning
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/reference"
                className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm px-4 py-3 transition-colors"
              >
                See our sources
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4 w-full">
            <div className="max-w-sm w-full rounded-2xl liquid-glass p-5">
              <div className="flex justify-between items-baseline mb-3">
                <p className="text-white/90 text-sm font-normal">Your Progress</p>
                <p className="text-white/50 text-xs">{level.name}</p>
              </div>

              <ProgressBar
                percent={level.xpForNext ? (level.xpIntoLevel / level.xpForNext) * 100 : 100}
                trailing={`${xp} XP`}
              />

              {/* Flat 2D icons here on purpose, not <Badge3D>: this card sits
                  on the same page as the brain's WebGL scene, and nine extra
                  GPU contexts for 32px icons was adding real teardown cost
                  when navigating away from Home (measured ~900ms of main
                  thread blocking). The full 3D badge case lives on the
                  Dashboard, where it's worth the cost. */}
              <div className="flex gap-2 mt-4 flex-wrap">
                {BADGES.map((badge) => {
                  const earned = earnedBadgeIds.includes(badge.id);
                  return (
                    <div
                      key={badge.id}
                      title={badge.title}
                      className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${
                        earned ? 'border-sky-400/60 bg-sky-400/10 text-sky-300' : 'border-white/10 bg-white/5 text-white/25'
                      }`}
                    >
                      {earned ? <Award className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5" />}
                    </div>
                  );
                })}
              </div>
              <Link to="/dashboard" className="inline-block mt-3 text-sky-400/70 hover:text-sky-300 text-xs transition-colors">
                View full badge case →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── How a unit works ──────────────────────────────────────────── */}
      <motion.section
        className="px-6 sm:px-8 md:px-12 py-20 border-t border-white/5"
        initial={{ opacity: 0, y: 130, scale: 0.94 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-5xl mx-auto">
          <p className="text-sky-400 text-xs tracking-widest uppercase mb-3">How it works</p>
          <h2 className="text-white text-2xl sm:text-3xl font-light tracking-tight max-w-lg mb-10">
            Every module is one unit: five steps, in order.
          </h2>

          <HowItWorksShowcase />
        </div>
      </motion.section>

      {/* ── Module preview ────────────────────────────────────────────── */}
      <CurriculumScrollCarousel />

      {/* ── Why it matters (sourced) ──────────────────────────────────── */}
      <WhyItMattersScroll />

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      <section className="px-6 sm:px-8 md:px-12 py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <p className="text-sky-400 text-xs tracking-widest uppercase mb-3">FAQ</p>
          <h2 className="text-white text-2xl sm:text-3xl font-light tracking-tight mb-10">Common questions</h2>
          <FAQ items={FAQ_ITEMS} />
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────────── */}
      <section className="relative px-6 sm:px-8 md:px-12 py-28 md:py-36 overflow-hidden">
        {/* Hand-built gradient, not a photo: dark navy base with a cluster of
            soft blue "light" blobs bled in from the right, echoing a
            tech-startup hero without any pixelation at large sizes. */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(60% 90% at 100% 15%, rgba(125, 211, 252, 0.35), transparent 60%),
              radial-gradient(45% 65% at 92% 60%, rgba(56, 189, 248, 0.3), transparent 65%),
              radial-gradient(35% 45% at 78% 88%, rgba(59, 130, 246, 0.22), transparent 70%),
              linear-gradient(155deg, #04050c 0%, #060b1c 40%, #081230 70%, #0a1740 100%)
            `,
          }}
        />
        {/* Fades the gradient's own dark-navy tone into the footer's matching
            top color below, instead of cutting hard to black. */}
        <div className="absolute inset-x-0 bottom-0 h-40" style={{ background: 'linear-gradient(to bottom, transparent, #060b1c)' }} />

        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-white text-3xl sm:text-4xl font-light tracking-tight">Start learning the hottest skill</h2>
          <Link
            to="/modules"
            className="inline-flex items-center gap-2 bg-white text-black text-sm font-medium px-6 py-3 rounded-full hover:bg-white/90 transition-colors mt-8"
          >
            Start Learning
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
