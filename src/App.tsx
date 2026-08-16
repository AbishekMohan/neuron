import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import CodeBackdrop from './components/CodeBackdrop';
import Tutorial, { TUTORIAL_STORAGE_KEY } from './components/Tutorial';
import AssistantPanel from './components/AssistantPanel';
import Home from './pages/Home';
import ModulesOverview from './pages/ModulesOverview';
import ModulePage from './pages/ModulePage';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Reference from './pages/Reference';
import NotFound from './pages/NotFound';

function App() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [tutorialOpen, setTutorialOpen] = useState(false);

  useEffect(() => {
    if (!window.localStorage.getItem(TUTORIAL_STORAGE_KEY)) {
      setTutorialOpen(true);
    }
  }, []);

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
      className={`relative isolate ${isHome ? 'bg-gradient-to-b from-neuron-black to-neuron' : 'bg-neuron-black'}`}
    >
      <CodeBackdrop />
      <Nav onOpenTutorial={() => setTutorialOpen(true)} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/modules" element={<ModulesOverview />} />
        <Route path="/modules/:moduleId" element={<ModulePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/u/:displayName" element={<Profile />} />
        <Route path="/reference" element={<Reference />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
      <AssistantPanel />
      <Tutorial open={tutorialOpen} onClose={() => setTutorialOpen(false)} />
    </div>
  );
}

export default App;
