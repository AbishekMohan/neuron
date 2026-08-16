import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Lock, Trophy, RotateCw } from 'lucide-react';
import type { QuizQuestion } from '../../data/modules';
import type { QuizAttempt } from '../../context/ProgressContext';
import { getSource } from '../../data/sources';

type QuizStepProps = {
  questions: QuizQuestion[];
  passingScore: number;
  unlocked: boolean;
  bestAttempt: QuizAttempt | undefined;
  onSubmit: (score: number, total: number) => boolean;
};

export default function QuizStep({ questions, passingScore, unlocked, bestAttempt, onSubmit }: QuizStepProps) {
  const [mode, setMode] = useState<'summary' | 'active'>(bestAttempt?.passed ? 'summary' : 'active');
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<{ score: number; total: number; passed: boolean } | null>(null);

  if (!unlocked) {
    return (
      <div className="max-w-xl rounded-2xl liquid-glass p-8 text-center">
        <Lock className="w-8 h-8 text-white/20 mx-auto mb-4" strokeWidth={1.25} />
        <p className="text-white text-base font-normal mb-2">Quiz locked</p>
        <p className="text-white/50 text-sm font-light leading-relaxed">
          Complete the article, flashcards, video, and mini-game first to unlock this module’s mastery quiz.
        </p>
      </div>
    );
  }

  const startQuiz = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setResult(null);
    setMode('active');
  };

  const question = questions[index];
  const isLast = index === questions.length - 1;
  const source = question?.sourceId ? getSource(question.sourceId) : undefined;

  const handleCheck = (choiceIndex: number) => {
    if (selected !== null) return;
    setSelected(choiceIndex);
    if (choiceIndex === question.correctIndex) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (!isLast) {
      setIndex((i) => i + 1);
      setSelected(null);
      return;
    }

    // `score` already reflects this question's result: handleCheck updates
    // it synchronously on selection, and this button only appears after
    // that re-render.
    const passed = onSubmit(score, questions.length);
    setResult({ score, total: questions.length, passed });
    setMode('summary');
  };

  if (mode === 'summary') {
    const shown = result ?? (bestAttempt ? { score: bestAttempt.score, total: bestAttempt.total, passed: bestAttempt.passed } : null);

    return (
      <div className="max-w-xl">
        <div className="rounded-2xl liquid-glass p-8 text-center">
          {shown?.passed ? (
            <Trophy className="w-9 h-9 text-amber-300 mx-auto mb-4" strokeWidth={1.25} />
          ) : (
            <RotateCw className="w-9 h-9 text-white/25 mx-auto mb-4" strokeWidth={1.25} />
          )}
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">
            {shown?.passed ? 'Mastery achieved' : 'Not quite there yet'}
          </p>
          <p className="text-white text-3xl font-light mb-1">
            {shown?.score}/{shown?.total}
          </p>
          <p className="text-white/50 text-sm mb-6">
            {shown?.passed
              ? 'You passed this module’s quiz. Nice work.'
              : `You need ${Math.ceil(passingScore * questions.length)}/${questions.length} to pass. Review and try again.`}
          </p>
          <button
            type="button"
            onClick={startQuiz}
            className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full bg-white text-black hover:bg-white/90 transition-colors"
          >
            <RotateCw className="w-4 h-4" />
            {shown?.passed ? 'Retake quiz' : 'Try again'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-1.5 mb-6">
        {questions.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < index ? 'bg-sky-400' : i === index ? 'bg-sky-300/60' : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-white/40 text-xs mb-2">
            Question {index + 1} of {questions.length}
          </p>
          <p className="text-white text-lg font-normal mb-6 leading-snug">{question.prompt}</p>

          <div className="flex flex-col gap-2">
            {question.choices.map((choice, i) => {
              const isCorrect = i === question.correctIndex;
              const isChosen = selected === i;
              const showState = selected !== null;

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleCheck(i)}
                  disabled={showState}
                  className={`text-left text-sm px-4 py-3 rounded-lg border transition-colors flex items-center gap-2.5 ${
                    showState && isCorrect
                      ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200'
                      : showState && isChosen
                        ? 'border-red-400/40 bg-red-400/10 text-red-200'
                        : 'border-white/10 text-white/70 hover:border-white/25 hover:bg-white/5 disabled:hover:bg-transparent'
                  }`}
                >
                  {showState && isCorrect && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                  {showState && isChosen && !isCorrect && <XCircle className="w-4 h-4 shrink-0" />}
                  <span>{choice}</span>
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <div className="mt-5 pt-5 border-t border-white/10">
              <p className="text-white/60 text-xs font-light leading-relaxed">{question.explanation}</p>
              {source && (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-2 text-sky-400/80 hover:text-sky-300 text-xs transition-colors"
                >
                  Source: {source.title}
                </a>
              )}
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 mt-4 bg-white text-black text-sm px-5 py-2 rounded-full hover:bg-white/90 transition-colors"
              >
                {isLast ? 'Finish quiz' : 'Next question'}
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
