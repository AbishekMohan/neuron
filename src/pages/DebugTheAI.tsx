import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, ArrowLeft, Bug } from 'lucide-react';
import { DEBUG_SCENARIOS, PIPELINE_STAGES, type PipelineStageId } from '../data/challenges';

export default function DebugTheAI() {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<PipelineStageId | null>(null);
  const [scores, setScores] = useState<boolean[]>([]);

  const scenario = DEBUG_SCENARIOS[index];
  const isLast = index === DEBUG_SCENARIOS.length - 1;
  const done = scores.length === DEBUG_SCENARIOS.length;
  const submitted = picked !== null;

  const pick = (stage: PipelineStageId) => {
    if (submitted) return;
    setPicked(stage);
    setScores((prev) => [...prev, stage === scenario.failedStage]);
  };

  const next = () => {
    setIndex((i) => i + 1);
    setPicked(null);
  };

  const restart = () => {
    setIndex(0);
    setPicked(null);
    setScores([]);
  };

  if (done) {
    const correct = scores.filter(Boolean).length;
    return (
      <section className="px-6 sm:px-8 md:px-12 pt-28 md:pt-36 pb-24 min-h-screen">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sky-400 text-xs tracking-widest uppercase mb-3">Debug the AI — complete</p>
          <p className="text-white text-5xl font-light tracking-tight mb-4">
            {correct}/{DEBUG_SCENARIOS.length}
          </p>
          <p className="text-white/50 text-sm font-light mb-8">Failure points correctly located.</p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={restart}
              className="inline-flex items-center gap-2 bg-white text-black text-sm font-medium rounded-full px-5 py-2.5 hover:bg-white/90 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Try again
            </button>
            <Link
              to="/challenges"
              className="inline-flex items-center gap-2 border border-white/15 text-white/70 text-sm rounded-full px-5 py-2.5 hover:border-white/30 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              More challenges
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 sm:px-8 md:px-12 pt-28 md:pt-36 pb-24 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <p className="text-sky-400 text-xs tracking-widest uppercase mb-3">Debug the AI</p>
        <h1 className="text-white text-3xl sm:text-4xl font-light leading-tight tracking-tight">
          Find where the pipeline actually broke
        </h1>
        <p className="text-white/50 text-sm mt-4 max-w-xl font-light">
          Every stage below is described honestly — three of the four worked exactly as intended. Click the one
          stage where things actually went wrong.
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={scenario.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-8 rounded-2xl liquid-glass p-6"
          >
            <p className="text-white/40 text-xs uppercase tracking-widest mb-5">
              Case {index + 1} of {DEBUG_SCENARIOS.length}
            </p>

            <div className="flex flex-col gap-2.5">
              {PIPELINE_STAGES.map((stage) => {
                const isPicked = picked === stage.id;
                const isCorrectStage = submitted && stage.id === scenario.failedStage;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => pick(stage.id)}
                    disabled={submitted}
                    className={`text-left rounded-xl border px-4 py-3.5 transition-colors ${
                      submitted
                        ? isCorrectStage
                          ? 'border-sky-400/40 bg-sky-400/10'
                          : isPicked
                            ? 'border-white/20 bg-white/[0.03]'
                            : 'border-white/10 opacity-50'
                        : 'border-white/15 hover:border-sky-400/40 hover:bg-sky-400/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {submitted && isCorrectStage && <Bug className="w-3.5 h-3.5 text-sky-300" />}
                      {submitted && isPicked && !isCorrectStage && <XCircle className="w-3.5 h-3.5 text-white/30" />}
                      {submitted && !isPicked && !isCorrectStage && <CheckCircle2 className="w-3.5 h-3.5 text-white/20" />}
                      <span
                        className={`text-[10px] uppercase tracking-widest ${
                          submitted && isCorrectStage ? 'text-sky-300' : 'text-white/40'
                        }`}
                      >
                        {stage.label}
                      </span>
                    </div>
                    <p className="text-white/80 text-sm font-light leading-relaxed">
                      {scenario.narrative[stage.id]}
                    </p>
                  </button>
                );
              })}
            </div>

            {submitted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] p-4"
              >
                <div className="flex items-center gap-2 text-sm mb-1.5">
                  {picked === scenario.failedStage ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-sky-300" />
                      <span className="text-sky-300">Correct — that's where it broke.</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-white/30" />
                      <span className="text-white/50">
                        Actually the {PIPELINE_STAGES.find((s) => s.id === scenario.failedStage)?.label.toLowerCase()} stage.
                      </span>
                    </>
                  )}
                </div>
                <p className="text-white/50 text-xs font-light leading-relaxed">{scenario.explanation}</p>
              </motion.div>
            )}

            {submitted && (
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex items-center gap-2 bg-white text-black text-sm font-medium rounded-full px-5 py-2.5 hover:bg-white/90 transition-colors"
                >
                  {isLast ? 'See results' : 'Next case'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
