import React, { useEffect, useState, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import CodeBackdrop from './components/CodeBackdrop';
import Tutorial, { TUTORIAL_STORAGE_KEY } from './components/Tutorial';
import Home from './pages/Home';
const ModulesOverview = React.lazy(() => import('./pages/ModulesOverview'));
const ModulePage = React.lazy(() => import('./pages/ModulePage'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Companion = React.lazy(() => import('./pages/Companion'));
const Leaderboard = React.lazy(() => import('./pages/Leaderboard'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Reference = React.lazy(() => import('./pages/Reference'));
const Glossary = React.lazy(() => import('./pages/Glossary'));
const Report = React.lazy(() => import('./pages/Report'));
const Challenges = React.lazy(() => import('./pages/Challenges'));
const HallucinationHunt = React.lazy(() => import('./pages/HallucinationHunt'));
const EthicsCourtroom = React.lazy(() => import('./pages/EthicsCourtroom'));
const BiasDetective = React.lazy(() => import('./pages/BiasDetective'));
const TeacherView = React.lazy(() => import('./pages/TeacherView'));
const DuelMode = React.lazy(() => import('./pages/DuelMode'));
const ConceptMapBuilder = React.lazy(() => import('./pages/ConceptMapBuilder'));
const DebugTheAI = React.lazy(() => import('./pages/DebugTheAI'));
const EthicsStory = React.lazy(() => import('./pages/EthicsStory'));
const ToolCompare = React.lazy(() => import('./pages/ToolCompare'));
const AdaptiveQuiz = React.lazy(() => import('./pages/AdaptiveQuiz'));
const AccessibilitySettings = React.lazy(() => import('./pages/AccessibilitySettings'));
const AccessibilityGuide = React.lazy(() => import('./pages/AccessibilityGuide'));
const WorkLog = React.lazy(() => import('./pages/WorkLog'));
const Copyright = React.lazy(() => import('./pages/Copyright'));
const Process = React.lazy(() => import('./pages/Process'));
const Privacy = React.lazy(() => import('./pages/Privacy'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

import GuestBanner from './components/GuestBanner';
import { useVisualsGate } from './hooks/useVisualsGate';

// Per-route document titles so screen readers, history, and tabs announce
// where SPA navigation just landed. Keep in sync with the <Route> table below.
const ROUTE_TITLES: Array<{ match: (path: string) => boolean; title: string }> = [
  { match: (p) => p === '/', title: 'Neuron — AI Learning Portal for High School Students' },
  { match: (p) => p === '/modules', title: 'Learning Modules — Neuron' },
  { match: (p) => p.startsWith('/modules/'), title: 'Module — Neuron' },
  { match: (p) => p === '/dashboard', title: 'My Dashboard — Neuron' },
  { match: (p) => p === '/companion', title: 'AI Companion — Neuron' },
  { match: (p) => p === '/leaderboard', title: 'Leaderboard — Neuron' },
  { match: (p) => p === '/profile' || p.startsWith('/u/'), title: 'Profile — Neuron' },
  { match: (p) => p === '/reference', title: 'Sources & References — Neuron' },
  { match: (p) => p === '/glossary', title: 'AI Glossary — Neuron' },
  { match: (p) => p === '/report', title: 'My Literacy Report — Neuron' },
  { match: (p) => p.startsWith('/challenges'), title: 'Challenges — Neuron' },
  { match: (p) => p === '/teacher', title: 'For Teachers — Neuron' },
  { match: (p) => p === '/tools', title: 'AI Tools Compared — Neuron' },
  { match: (p) => p === '/settings', title: 'Accessibility Settings — Neuron' },
  { match: (p) => p === '/accessibility-guide', title: 'Accessibility Guide — Neuron' },
  { match: (p) => p === '/work-log', title: 'Student Work Log — Neuron' },
  { match: (p) => p === '/copyright', title: 'Copyright Checklist — Neuron' },
  { match: (p) => p === '/process', title: 'Design Process — Neuron' },
  { match: (p) => p === '/privacy', title: 'Privacy — Neuron' },
];

function titleFor(path: string): string {
  return ROUTE_TITLES.find((r) => r.match(path))?.title ?? 'Neuron — AI Learning Portal';
}

// Skeleton shown while a lazy route chunk loads. A real layout placeholder
// (not a spinner) so the nav/footer don't jump and screen readers hear a
// labelled loading status instead of silence.
function RouteSkeleton() {
  return (
    <div role="status" aria-label="Loading page" className="px-6 sm:px-8 md:px-12 pt-28 md:pt-36 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto animate-pulse">
        <div className="h-3 w-32 rounded-full bg-white/10 mb-4" />
        <div className="h-8 w-2/3 rounded-lg bg-white/10 mb-3" />
        <div className="h-4 w-1/2 rounded-lg bg-white/5 mb-8" />
        <div className="h-40 rounded-2xl bg-white/5 border border-white/10" />
      </div>
    </div>
  );
}

function App() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [tutorialOpen, setTutorialOpen] = useState(false);
  // Short human label of the current page, mirrored into the aria-live
  // region below so route changes are announced to screen readers.
  const [announcement, setAnnouncement] = useState('');
  // Global code-rain backdrop mounts on first interaction (same rationale
  // as the hero visuals in Home.tsx): it's pure atmosphere on a -z-10 layer,
  // so gating it is invisible to LCP and removes its animation work from
  // the load window on every route, not just home.
  const backdropReady = useVisualsGate();

  useEffect(() => {
    if (!window.localStorage.getItem(TUTORIAL_STORAGE_KEY)) {
      setTutorialOpen(true);
    }
  }, []);

  // SPA navigation leaves screen readers silent by default: nothing reloads,
  // so nothing is announced. On every route change, update the document
  // title, move keyboard focus to <main>, and push the page name into a
  // polite live region. The setTimeout lets the lazy route's Suspense
  // boundary resolve first so focus lands on real content.
  useEffect(() => {
    const title = titleFor(location.pathname);
    document.title = title;
    setAnnouncement(title.replace(' — Neuron', ''));
    const t = window.setTimeout(() => {
      document.getElementById('main')?.focus({ preventScroll: true });
      window.scrollTo({ top: 0 });
    }, 50);
    return () => window.clearTimeout(t);
  }, [location.pathname]);

  return (
    // Home keeps the black-to-blue hero gradient; every other page is pure
    // black so the 3D/particle work on the landing page reads as the
    // "special" moment rather than the default background everywhere.
    //
    // `isolate` matters here, not just cosmetics: without it, this div has
    // no z-index of its own, so it never becomes a stacking context. That
    // left CodeBackdrop's -z-10 with nothing to be "-10" relative to except
    // the real root: which put it behind <body>'s own opaque background
    // (index.css: `body { background: #000 }`), not just behind the brain.
    // `isolate` gives this div its own stacking context so -z-10 correctly
    // means "behind my siblings," and CodeBackdrop actually renders.
    <div
      className={`relative isolate flex flex-col min-h-screen ${isHome ? 'bg-gradient-to-b from-neuron-black to-neuron' : 'bg-neuron-black'}`}
    >
      {/* Skip link: first focusable element on every page. Visually hidden
          until keyboard-focused, then jumps straight past nav/hero to #main. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] focus:bg-white focus:text-black focus:text-sm focus:font-medium focus:px-4 focus:py-2 focus:rounded-full"
      >
        Skip to main content
      </a>
      {/* Polite announcer for SPA route changes (see effect above). */}
      <div aria-live="polite" role="status" className="sr-only">
        {announcement}
      </div>
      <CodeBackdrop mounted={backdropReady} />
      <GuestBanner />
      <Nav onOpenTutorial={() => setTutorialOpen(true)} />

      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
      <Suspense fallback={<RouteSkeleton />}>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/modules" element={<ModulesOverview />} />
        <Route path="/modules/:moduleId" element={<ModulePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/companion" element={<Companion />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/u/:displayName" element={<Profile />} />
        <Route path="/reference" element={<Reference />} />
        <Route path="/glossary" element={<Glossary />} />
        <Route path="/report" element={<Report />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/challenges/hallucination-hunt" element={<HallucinationHunt />} />
        <Route path="/challenges/ethics-courtroom" element={<EthicsCourtroom />} />
        <Route path="/challenges/bias-detective" element={<BiasDetective />} />
        <Route path="/teacher" element={<TeacherView />} />
        <Route path="/challenges/duel" element={<DuelMode />} />
        <Route path="/challenges/concept-map" element={<ConceptMapBuilder />} />
        <Route path="/challenges/debug-the-ai" element={<DebugTheAI />} />
        <Route path="/challenges/ethics-story" element={<EthicsStory />} />
        <Route path="/challenges/adaptive" element={<AdaptiveQuiz />} />
        <Route path="/tools" element={<ToolCompare />} />
        <Route path="/settings" element={<AccessibilitySettings />} />
        <Route path="/accessibility-guide" element={<AccessibilityGuide />} />
        <Route path="/work-log" element={<WorkLog />} />
        <Route path="/copyright" element={<Copyright />} />
        <Route path="/process" element={<Process />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
      </main>

      <Footer />
      <Tutorial open={tutorialOpen} onClose={() => setTutorialOpen(false)} />
    </div>
  );
}

export default App;

