import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Brain, Wrench, Scale, Globe, Palette, Rocket, Undo2 } from 'lucide-react';
import { MODULES, getModule, XP, STEP_ORDER, type StepId } from '../data/modules';
import { useProgress } from '../context/ProgressContext';
import ProgressBar from '../components/ProgressBar';
import StepSidebar from '../components/lesson/StepSidebar';
import ArticleStep from '../components/lesson/ArticleStep';
import FlashcardsStep from '../components/lesson/FlashcardsStep';
import VideoStep from '../components/lesson/VideoStep';
import GameStep from '../components/lesson/GameStep';
import BlastGame from '../components/lesson/BlastGame';
import LiveRaceGame from '../components/lesson/LiveRaceGame';
import MatchRaceGame from '../components/lesson/MatchRaceGame';
import RoyaleGame from '../components/lesson/RoyaleGame';
import GameModeSelect, { type GameMode } from '../components/lesson/GameModeSelect';
import QuizStep from '../components/lesson/QuizStep';

const ICONS = { brain: Brain, wrench: Wrench, scale: Scale, globe: Globe, palette: Palette, rocket: Rocket };

export default function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const mod = moduleId ? getModule(moduleId) : undefined;
  const { isStepComplete, completeStep, isModuleUnlocked, quizAttempts, submitQuiz, moduleProgress } = useProgress();
  const [currentStep, setCurrentStep] = useState<StepId>('article');
  const [gameMode, setGameMode] = useState<GameMode | null>(null);

  useEffect(() => {
    setCurrentStep('article');
    setGameMode(null);
  }, [moduleId]);

  if (!mod) {
    return (
      <section className="px-6 sm:px-8 md:px-12 pt-28 md:pt-36 pb-24 min-h-screen">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-white/70">That module doesn’t exist.</p>
          <Link to="/modules" className="text-sky-400 text-sm mt-4 inline-block">
            ← Back to modules
          </Link>
        </div>
      </section>
    );
  }

  const Icon = ICONS[mod.icon];
  const progress = moduleProgress[mod.id];
  const modIndex = MODULES.findIndex((m) => m.id === mod.id);
  const nextModule = MODULES[modIndex + 1];
  const quizUnlocked = isModuleUnlocked(mod.id);
  const bestAttempt = quizAttempts[mod.id];

  const stepComplete = (step: StepId) => isStepComplete(mod.id, step);
  const xpEarned = STEP_ORDER.reduce((sum, step) => sum + (stepComplete(step) ? XP[step] : 0), 0) + (progress?.isComplete ? XP.moduleBonus : 0);

  return (
    <section className="px-6 sm:px-8 md:px-12 pt-28 md:pt-36 pb-24 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <Link to="/modules" className="inline-flex items-center gap-1.5 text-white/50 hover:text-white text-xs mb-6 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          All modules
        </Link>

        <div className="flex items-center gap-2 mb-2">
          <Icon className="w-4 h-4 text-sky-300 shrink-0" strokeWidth={1.5} />
          <div>
            <h1 className="text-white text-2xl sm:text-3xl font-light">{mod.title}</h1>
            <p className="text-white/40 text-sm mt-1">{mod.tagline}</p>
          </div>
        </div>

        {progress?.isComplete && (
          <div className="mt-4 rounded-xl liquid-glass px-4 py-3 text-sm text-sky-300 max-w-xl">
            Module mastered, nice work. A badge for this has been added to your dashboard.
          </div>
        )}

        <div className="mt-8 flex flex-col md:flex-row gap-6 md:gap-8">
          <StepSidebar
            moduleTitle={mod.title}
            ModuleIcon={Icon}
            currentStep={currentStep}
            onSelectStep={(step) => {
              setCurrentStep(step);
              setGameMode(null);
            }}
            isStepComplete={stepComplete}
            isQuizUnlocked={quizUnlocked}
            completedCount={progress?.completed ?? 0}
            xpEarned={xpEarned}
          />

          <div className="flex-1 min-w-0 rounded-2xl liquid-glass p-6 sm:p-8">
            {currentStep === 'article' && (
              <ArticleStep
                sections={mod.steps.article.sections}
                complete={stepComplete('article')}
                onComplete={() => completeStep(mod.id, 'article')}
              />
            )}
            {currentStep === 'flashcards' && (
              <FlashcardsStep
                cards={mod.steps.flashcards.cards}
                complete={stepComplete('flashcards')}
                onComplete={() => completeStep(mod.id, 'flashcards')}
              />
            )}
            {currentStep === 'video' && (
              <VideoStep
                title={mod.steps.video.title}
                embedUrl={mod.steps.video.embedUrl}
                description={mod.steps.video.description}
                complete={stepComplete('video')}
                onComplete={() => completeStep(mod.id, 'video')}
              />
            )}
            {currentStep === 'game' && gameMode === null && <GameModeSelect onSelect={setGameMode} />}
            {currentStep === 'game' && gameMode !== null && (
              <button
                type="button"
                onClick={() => setGameMode(null)}
                className="inline-flex items-center gap-1.5 text-white/40 hover:text-white text-xs mb-5 transition-colors"
              >
                <Undo2 className="w-3.5 h-3.5" />
                Choose a different mode
              </button>
            )}
            {currentStep === 'game' && gameMode === 'sort' && (
              <GameStep
                prompt={mod.steps.game.prompt}
                buckets={mod.steps.game.buckets}
                cards={mod.steps.game.cards}
                complete={stepComplete('game')}
                onComplete={() => completeStep(mod.id, 'game')}
              />
            )}
            {currentStep === 'game' && gameMode === 'blast' && (
              <BlastGame
                prompt={mod.steps.game.prompt}
                cards={mod.steps.game.cards}
                blastTarget={mod.steps.game.blastTarget}
                complete={stepComplete('game')}
                onComplete={() => completeStep(mod.id, 'game')}
              />
            )}
            {currentStep === 'game' && gameMode === 'live' && (
              <LiveRaceGame
                questions={mod.steps.quiz.questions}
                moduleId={mod.id}
                complete={stepComplete('game')}
                onComplete={() => completeStep(mod.id, 'game')}
              />
            )}
            {currentStep === 'game' && gameMode === 'match' && (
              <MatchRaceGame
                cards={mod.steps.flashcards.cards}
                moduleId={mod.id}
                complete={stepComplete('game')}
                onComplete={() => completeStep(mod.id, 'game')}
              />
            )}
            {currentStep === 'game' && gameMode === 'royale' && (
              <RoyaleGame
                questions={mod.steps.quiz.questions}
                moduleId={mod.id}
                complete={stepComplete('game')}
                onComplete={() => completeStep(mod.id, 'game')}
              />
            )}
            {currentStep === 'quiz' && (
              <QuizStep
                questions={mod.steps.quiz.questions}
                passingScore={mod.steps.quiz.passingScore}
                unlocked={quizUnlocked}
                bestAttempt={bestAttempt}
                onSubmit={(score, total) => submitQuiz(mod.id, score, total, mod.steps.quiz.passingScore)}
              />
            )}
          </div>
        </div>

        <div className="mt-8 max-w-xs">
          <ProgressBar percent={progress?.percent ?? 0} trailing={`${progress?.completed ?? 0}/${progress?.total ?? STEP_ORDER.length} steps`} />
        </div>

        <div className="mt-8 flex justify-between items-center border-t border-white/10 pt-8">
          <Link to="/dashboard" className="text-white/50 hover:text-white text-sm transition-colors">
            View my dashboard
          </Link>
          {nextModule && (
            <Link
              to={`/modules/${nextModule.id}`}
              className="inline-flex items-center gap-2 text-sky-300 hover:text-sky-200 text-sm transition-colors"
            >
              Next: {nextModule.title}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
