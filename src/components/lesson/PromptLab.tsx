import { useMemo, useState } from 'react';
import { CheckCircle2, Circle, FlaskConical, Loader2, RotateCw, Scale } from 'lucide-react';
import { sendMessage } from '../../lib/assistant';
import { supabase } from '../../lib/supabase';

// Prompt Lab: the practical-tools module's A/B playground (brief P2-2). The
// student writes two versions of the same request, runs both against the
// model side by side, and judges which response actually teaches better —
// demonstration instead of assertion, which is exactly the challenge
// language ("techniques to leverage AI effectively").
//
// Two honesty constraints shape this component:
// 1. Never fabricate model output. If the edge function/key isn't deployed,
//    both sides return the graceful notices from lib/assistant.ts and the UI
//    says so, switching to "prompt coach" mode (live specificity scoring +
//    prediction) instead of pretending a comparison happened.
// 2. The lesson is the student's own verdict, not ours. The heuristic diff
//    explains the *prompts*; the student judges the *responses*.

const PRESET_A = 'Help me study photosynthesis.';
const PRESET_B =
  'Quiz me on photosynthesis, one question at a time, at a 10th-grade level. After each answer, tell me if I am right and explain what I missed in 2 sentences max.';

type Signal = { key: string; label: string; why: string; test: RegExp };

// Specificity moves, each detectable with a cheap regex. Ordered roughly by
// how much they change output quality for schoolwork, which is also the
// order the diff explanation reads in.
const SIGNALS: Signal[] = [
  {
    key: 'interaction',
    label: 'Designs an interaction',
    why: 'makes the model quiz, wait, and respond to you instead of dumping a wall of text you will skim.',
    test: /one at a (time|question)|quiz me|ask me|wait for|step by step|test me/i,
  },
  {
    key: 'audience',
    label: 'Names an audience or level',
    why: 'calibrates vocabulary and depth — "10th-grade level" rules out both grad-school jargon and baby talk.',
    test: /grade|10th|9th|11th|12th|\bkid\b|beginner|eli5|explain like|high school|college/i,
  },
  {
    key: 'format',
    label: 'Asks for a format',
    why: 'turns prose into something studyable — questions, bullets, and tables can be drilled; paragraphs cannot.',
    test: /bullet|numbered|table|\blist\b|steps|headings|flashcard/i,
  },
  {
    key: 'length',
    label: 'Sets a length limit',
    why: 'forces density. A model with no budget spends it on filler; "2 sentences max" spends it on signal.',
    test: /\d+\s*(sentence|word|bullet|paragraph|point|question)|max\b|brief|under \d+|in \d+/i,
  },
  {
    key: 'feedback',
    label: 'Demands feedback, not answers',
    why: 'keeps you doing the thinking — the model corrects and explains, which is assistance, not replacement.',
    test: /tell me if|correct me|check my|explain what i missed|am i right|grade me/i,
  },
  {
    key: 'goal',
    label: 'States the goal',
    why: 'tells the model what success looks like, so it optimizes for your test instead of a generic summary.',
    test: /studying for|test (on|tomorrow)|exam|homework|need to (know|learn)|quiz/i,
  },
  {
    key: 'role',
    label: 'Gives the model a role',
    why: 'narrows its voice and behavior — a "tutor" asks follow-ups, a search engine does not.',
    test: /you are|act as|as a (tutor|teacher|coach|quizzer)/i,
  },
  {
    key: 'examples',
    label: 'Asks for or gives examples',
    why: 'anchors abstract ideas to concrete cases, which is where studying actually sticks.',
    test: /example|e\.g\.|for instance|such as/i,
  },
];

function matchedSignals(prompt: string): Signal[] {
  return SIGNALS.filter((s) => s.test.test(prompt));
}

// The graceful notices from lib/assistant.ts mean "no live comparison
// happened" — a config problem, a transient failure, or a rate limit —
// never a real model reply. Matching on their stable substrings keeps this
// component honest without exporting internals from the lib.
function isFallbackReply(reply: string): boolean {
  return (
    reply.includes('isn\u2019t connected to a live AI model') || reply.includes('Something went wrong reaching')
  );
}

type SideResult = { reply: string; ok: boolean };

export default function PromptLab({
  complete,
  onComplete,
}: {
  complete: boolean;
  onComplete: () => void;
}) {
  // Supabase itself unconfigured (no env vars) means no live model is even
  // possible in this deployment — lead with coach mode rather than a Run
  // button that can only fail.
  const livePossible = supabase !== null;
  const [promptA, setPromptA] = useState(PRESET_A);
  const [promptB, setPromptB] = useState(PRESET_B);
  const [status, setStatus] = useState<'ready' | 'running' | 'done'>('ready');
  const [resultA, setResultA] = useState<SideResult | null>(null);
  const [resultB, setResultB] = useState<SideResult | null>(null);
  const [verdict, setVerdict] = useState<'A' | 'B' | 'tie' | null>(null);

  const signalsA = useMemo(() => matchedSignals(promptA), [promptA]);
  const signalsB = useMemo(() => matchedSignals(promptB), [promptB]);
  // Heuristic winner from prompt craft alone. Surfaced as a *prediction*,
  // never as the answer — the student's verdict is the grade.
  const predicted: 'A' | 'B' | 'tie' =
    signalsB.length === signalsA.length ? 'tie' : signalsB.length > signalsA.length ? 'B' : 'A';
  const liveCompared = status === 'done' && resultA?.ok && resultB?.ok;

  const run = async () => {
    if (!promptA.trim() || !promptB.trim()) return;
    setStatus('running');
    setVerdict(null);
    setResultA(null);
    setResultB(null);
    const context = { moduleTitle: 'Practical AI Tools & Techniques' };
    const [ra, rb] = await Promise.all([
      sendMessage([{ role: 'user', content: promptA.trim() }], context),
      sendMessage([{ role: 'user', content: promptB.trim() }], context),
    ]);
    setResultA({ reply: ra.reply, ok: ra.error === null && !isFallbackReply(ra.reply) });
    setResultB({ reply: rb.reply, ok: rb.error === null && !isFallbackReply(rb.reply) });
    setStatus('done');
  };

  const reset = () => {
    setPromptA(PRESET_A);
    setPromptB(PRESET_B);
    setStatus('ready');
    setResultA(null);
    setResultB(null);
    setVerdict(null);
  };

  // Diff explanation, generated from the prompt pair. Explains craft, not
  // output: true whether the model is live or not, which is what makes it
  // safe to show in coach mode too.
  const diffBullets = useMemo(() => {
    const aKeys = new Set(signalsA.map((s) => s.key));
    const bKeys = new Set(signalsB.map((s) => s.key));
    const bullets: string[] = [];
    for (const s of SIGNALS) {
      if (bKeys.has(s.key) && !aKeys.has(s.key)) bullets.push(`Prompt B ${s.label.toLowerCase()} — ${s.why}`);
      else if (aKeys.has(s.key) && !bKeys.has(s.key)) bullets.push(`Prompt A ${s.label.toLowerCase()} — ${s.why}`);
    }
    return bullets;
  }, [signalsA, signalsB]);

  const canRun = livePossible && status !== 'running' && promptA.trim().length > 0 && promptB.trim().length > 0;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-2 mb-2">
        <FlaskConical className="w-4 h-4 text-sky-300" aria-hidden="true" />
        <p className="text-white/40 text-xs uppercase tracking-widest">Prompt Lab · A/B playground</p>
      </div>
      <p className="text-white/60 text-sm font-light leading-relaxed mb-6 max-w-2xl">
        Write the same request two ways — vague once, specific once — run both against the model, and judge which
        response actually helps you learn. The craft difference is the lesson.
      </p>

      {!livePossible && (
        <div className="mb-6 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-xs text-amber-200/80 leading-relaxed">
          No live model is connected in this deployment, so this runs in <strong>coach mode</strong>: live
          specificity scoring and a prediction as you type, no fabricated responses. Deploy the assistant edge
          function to compare real outputs.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {(
          [
            { name: 'A' as const, value: promptA, set: setPromptA, signals: signalsA },
            { name: 'B' as const, value: promptB, set: setPromptB, signals: signalsB },
          ]
        ).map(({ name, value, set, signals }) => (
          <div key={name} className="rounded-2xl liquid-glass p-5">
            <div className="flex items-baseline justify-between mb-3">
              <label htmlFor={`prompt-${name}`} className="text-white text-sm font-normal">
                Prompt {name}
              </label>
              {/* Live specificity score: the coach. Updates per keystroke, so
                  students feel each added constraint land. */}
              <span role="status" aria-live="polite" className="text-sky-300/80 text-xs tabular-nums">
                {signals.length}/{SIGNALS.length} specificity moves
              </span>
            </div>
            <textarea
              id={`prompt-${name}`}
              value={value}
              onChange={(e) => set(e.target.value)}
              rows={5}
              disabled={status === 'running'}
              placeholder={`Version ${name} of your request…`}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-3 text-sm text-white font-light leading-relaxed placeholder:text-white/25 focus:border-sky-400/50 focus:outline-none disabled:opacity-50"
            />
            <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={`Specificity moves detected in prompt ${name}`}>
              {SIGNALS.map((s) => {
                const hit = signals.some((h) => h.key === s.key);
                return (
                  <li
                    key={s.key}
                    title={s.label}
                    className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                      hit ? 'border-sky-400/50 bg-sky-400/10 text-sky-200' : 'border-white/10 text-white/25'
                    }`}
                  >
                    {s.label}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-5">
        <button
          type="button"
          onClick={run}
          disabled={!canRun}
          title={!livePossible ? 'No live model connected in this deployment' : undefined}
          className="inline-flex items-center gap-2 bg-white text-black text-sm font-medium px-6 py-2.5 rounded-full hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {status === 'running' ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : null}
          {status === 'running' ? 'Running both…' : status === 'done' ? 'Run again' : 'Run both'}
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-colors"
        >
          <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
          Reset to preset pair
        </button>
      </div>

      {/* Results. One polite live region for the whole block so screen-reader
          users get the comparison announced once, not per keystroke. */}
      <div aria-live="polite" className="mt-8">
        {status === 'running' && (
          <p role="status" className="text-white/50 text-sm">
            Running both prompts against the model…
          </p>
        )}

        {status === 'done' && (
          <div className="flex flex-col gap-6">
            {!resultA?.ok && !resultB?.ok && (
              <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-xs text-amber-200/80 leading-relaxed">
                The live comparison didn't go through (model not connected or busy) — so judge the <em>prompts</em>,
                not outputs: which one <em>should</em> win, and why? The coach analysis below still applies.
              </div>
            )}

            {liveCompared && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {(
                  [
                    { name: 'A' as const, result: resultA },
                    { name: 'B' as const, result: resultB },
                  ]
                ).map(({ name, result }) => (
                  <div key={name} className="rounded-2xl liquid-glass p-5">
                    <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Response to {name}</p>
                    <p className="text-white/80 text-sm font-light leading-relaxed whitespace-pre-wrap">
                      {result?.reply}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Generated diff explanation: what the winning prompt does that
                the other doesn't, in plain language. Derived from craft
                signals, so it holds with or without live output. */}
            <div className="rounded-2xl border border-sky-400/20 bg-sky-400/5 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Scale className="w-4 h-4 text-sky-300" aria-hidden="true" />
                <p className="text-white text-sm font-normal">
                  Why {predicted === 'tie' ? 'neither prompt has an edge' : `prompt ${predicted} should win`}
                </p>
              </div>
              {diffBullets.length === 0 ? (
                <p className="text-white/60 text-xs font-light leading-relaxed">
                  Both prompts use the same moves — add an audience, a length limit, or an interaction to one side
                  and watch its chips light up above.
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {diffBullets.map((b, i) => (
                    <li key={i} className="text-white/70 text-xs font-light leading-relaxed flex gap-2">
                      <span className="text-sky-300 shrink-0" aria-hidden="true">
                        →
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* The grade is the student's, not the heuristic's. Requiring a
                verdict before completion is what makes this a learning action
                instead of a click-through. */}
            <div>
              <p className="text-white/60 text-sm font-light mb-3">
                {liveCompared
                  ? 'Your verdict: which response would actually help you study?'
                  : 'Your prediction: which prompt should get the better answer?'}
              </p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Your verdict">
                {(
                  [
                    { v: 'A' as const, label: 'A wins' },
                    { v: 'B' as const, label: 'B wins' },
                    { v: 'tie' as const, label: "It's a tie" },
                  ]
                ).map(({ v, label }) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVerdict(v)}
                    aria-pressed={verdict === v}
                    className={`text-sm px-5 py-2.5 rounded-full border transition-colors ${
                      verdict === v
                        ? 'border-sky-400/60 bg-sky-400/10 text-sky-200'
                        : 'border-white/15 text-white/70 hover:text-white hover:border-white/30'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {verdict && (
                <p className="text-white/40 text-xs mt-3 font-light">
                  {verdict === predicted
                    ? 'The coach agrees with you.'
                    : predicted === 'tie'
                      ? 'The coach calls it a tie on craft — your reading of the responses breaks it, which is the point.'
                      : `The coach predicted ${predicted} on craft, but your judgment of what helps you learn outranks it.`}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 border-t border-white/10 pt-6">
              <button
                type="button"
                onClick={onComplete}
                disabled={complete || !verdict}
                title={!verdict ? 'Cast your verdict first' : undefined}
                className={`inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full transition-colors ${
                  complete
                    ? 'bg-sky-400/10 border border-sky-400/40 text-sky-300 cursor-default'
                    : verdict
                      ? 'bg-white text-black hover:bg-white/90'
                      : 'bg-white/10 text-white/40 cursor-not-allowed'
                }`}
              >
                {complete ? <CheckCircle2 className="w-4 h-4" aria-hidden="true" /> : <Circle className="w-4 h-4" aria-hidden="true" />}
                {complete ? 'Mini-game complete' : 'Finish mini-game'}
              </button>
              {!verdict && !complete && (
                <p className="text-white/30 text-xs">Run a comparison and cast your verdict to finish.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
