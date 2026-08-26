import { useEffect, useMemo, useRef, useState } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  Lock,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Pencil,
  Check,
  MessageCircle,
  Dumbbell,
  Send,
  Loader2,
  Volume2,
  VolumeX,
  Ghost,
  Scale,
  Layers,
  HelpCircle,
  Info,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { TRAINING_CATEGORIES, type TrainingCategoryId, type TrainingExample } from '../data/training';
import {
  evaluateAccuracy,
  extractFeatures,
  getCeilingAccuracy,
  getCompanionMastery,
  getOverallQuality,
  getReferenceWeights,
  getVocabulary,
  loadCompanionState,
  predictConfidence,
  predictLabel,
  resetCompanionState,
  saveCompanionState,
  trainOnLabel,
} from '../lib/companion';
import { sendMessage, SUGGESTED_PROMPTS, type AssistantMessage } from '../lib/assistant';
import { speak, stopSpeaking, SpeechPulseSource, getAvailableVoices } from '../lib/speechPulse';
import InteractiveOrbStage from '../components/InteractiveOrbStage';
import CompanionMasteryMeter from '../components/CompanionMasteryMeter';
import ConfidenceMeter from '../components/ConfidenceMeter';
import type { OrbState } from '../lib/carvisOrb';
import { loadCompanionIdentity, saveCompanionIdentity } from '../lib/companionIdentity';

// Icon-only distinction between self-audit flag types, no color coding
// (the whole Companion surface is one blue, always).
const FLAG_ICON: Record<string, typeof Info> = {
  hallucination: Ghost,
  bias: Scale,
  oversimplification: Layers,
  uncertain: HelpCircle,
};
const FLAG_LABEL: Record<string, string> = {
  hallucination: 'Possible hallucination',
  bias: 'Possible bias',
  oversimplification: 'Oversimplified',
  uncertain: 'Uncertain claim',
};

function pickExample(pool: TrainingExample[], avoidId?: string): TrainingExample {
  if (pool.length === 1) return pool[0];
  let choice = pool[Math.floor(Math.random() * pool.length)];
  let guard = 0;
  while (choice.id === avoidId && guard++ < 10) {
    choice = pool[Math.floor(Math.random() * pool.length)];
  }
  return choice;
}

export default function Companion() {
  const [mode, setMode] = useState<'train' | 'chat'>('train');
  const [categoryId, setCategoryId] = useState<TrainingCategoryId>('prompts');
  const category = useMemo(() => TRAINING_CATEGORIES.find((c) => c.id === categoryId)!, [categoryId]);

  const [identity, setIdentity] = useState(loadCompanionIdentity);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(identity.name);

  const commitName = () => {
    const trimmed = nameDraft.trim().slice(0, 24) || 'Companion';
    const next = { ...identity, name: trimmed };
    setIdentity(next);
    saveCompanionIdentity(next);
    setNameDraft(trimmed);
    setEditingName(false);
  };

  // Re-render trigger: bumped after every save so the derived accuracy /
  // tier / weights below all recompute from the freshly-persisted state.
  const [version, setVersion] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const companionState = useMemo(() => loadCompanionState(categoryId), [categoryId, version]);

  const vocabulary = useMemo(() => getVocabulary(category), [category]);
  const accuracy = useMemo(() => evaluateAccuracy(companionState.weights, category), [companionState.weights, category]);
  const ceilingAccuracy = useMemo(() => getCeilingAccuracy(category), [category]);
  const tier = useMemo(
    () => getCompanionMastery(category, companionState.labelsCount, companionState.weights),
    [category, companionState.labelsCount, companionState.weights],
  );

  // The orb's visual growth reflects the whole companion (all 3 trained
  // skills), not just whichever tab is open. Recomputed whenever any
  // category's training changes, via the same `version` bump the
  // per-category state above already uses.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const overallQuality = useMemo(() => getOverallQuality(TRAINING_CATEGORIES), [version]);
  const overallTier = useMemo(
    () => (overallQuality >= 1 ? 'mastered' : overallQuality >= 0.7 ? 'competent' : overallQuality >= 0.4 ? 'learning' : 'untrained'),
    [overallQuality],
  );

  const [current, setCurrent] = useState<TrainingExample>(() => pickExample(category.pool));
  useEffect(() => setCurrent(pickExample(category.pool)), [category]);

  const [feedback, setFeedback] = useState<{ example: TrainingExample; studentLabel: 0 | 1 } | null>(null);
  const [orbPhase, setOrbPhase] = useState<OrbState>('idle');
  const pulseTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (pulseTimer.current) window.clearTimeout(pulseTimer.current);
  }, []);

  // ── Chat: the same companion, talking. ──────────────────────────────
  const [chatMessages, setChatMessages] = useState<AssistantMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatSending, setChatSending] = useState(false);
  const [muted, setMuted] = useState(false);
  const speechPulse = useRef(new SpeechPulseSource());

  // Free, no-API-key voice picker: whatever speech-synthesis voices this
  // browser/OS already has installed. Loaded once. The list is static
  // per browser session, no need to re-fetch it.
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  useEffect(() => {
    getAvailableVoices().then(setVoices);
  }, []);
  const englishVoices = useMemo(() => {
    const en = voices.filter((v) => v.lang.toLowerCase().startsWith('en'));
    return en.length > 0 ? en : voices;
  }, [voices]);

  useEffect(() => stopSpeaking, []);
  useEffect(() => {
    if (mode !== 'chat') stopSpeaking();
  }, [mode]);

  const sendChat = async (text: string) => {
    if (!text.trim() || chatSending) return;
    stopSpeaking();
    const next: AssistantMessage[] = [...chatMessages, { role: 'user', content: text.trim() }];
    setChatMessages(next);
    setChatInput('');
    setChatSending(true);
    setOrbPhase('thinking');

    const { reply, flags } = await sendMessage(next, {
      companionName: identity.name,
      companionTier: overallTier,
      companionQualityPercent: Math.round(overallQuality * 100),
    });
    setChatMessages((prev) => [...prev, { role: 'assistant', content: reply, flags }]);
    setChatSending(false);

    if (muted) {
      setOrbPhase('idle');
      return;
    }
    speak(reply, {
      voiceURI: identity.voiceURI,
      onStart: () => setOrbPhase('speaking'),
      onWord: () => speechPulse.current.pulse(),
      onEnd: () => setOrbPhase('idle'),
    });
  };

  const setVoice = (voiceURI: string | null) => {
    const next = { ...identity, voiceURI };
    setIdentity(next);
    saveCompanionIdentity(next);
  };

  const toggleMuted = () => {
    setMuted((prev) => {
      const next = !prev;
      if (next) {
        stopSpeaking();
        setOrbPhase('idle');
      }
      return next;
    });
  };

  const handleLabel = (studentLabel: 0 | 1) => {
    const features = extractFeatures(current.text, vocabulary);
    const nextWeights = trainOnLabel(companionState.weights, features, studentLabel, 1);
    const nextLabelsCount = companionState.labelsCount + 1;
    const nextAccuracy = evaluateAccuracy(nextWeights, category);

    saveCompanionState(categoryId, {
      weights: nextWeights,
      labelsCount: nextLabelsCount,
      peakAccuracy: Math.max(companionState.peakAccuracy, nextAccuracy),
    });
    setVersion((v) => v + 1);
    setFeedback({ example: current, studentLabel });

    // A brief "thinking" pulse sells the idea that a weight update just
    // happened, then settles back to idle.
    setOrbPhase('thinking');
    if (pulseTimer.current) window.clearTimeout(pulseTimer.current);
    pulseTimer.current = window.setTimeout(() => setOrbPhase('idle'), 700);

    setCurrent(pickExample(category.pool, current.id));
  };

  // Touching/dragging the orb itself is real interaction, not decoration
  //. 'Listening' is an OrbState this app otherwise never uses (no mic
  // input anywhere), so reusing it here to mean "the student is actively
  // engaging with it right now" doesn't collide with any other meaning.
  const handleOrbTouch = () => {
    if (orbPhase === 'thinking') return; // don't interrupt an actual training pulse
    setOrbPhase('listening');
    if (pulseTimer.current) window.clearTimeout(pulseTimer.current);
    pulseTimer.current = window.setTimeout(() => setOrbPhase('idle'), 900);
  };

  const handleReset = () => {
    if (!window.confirm(`Reset this companion's training on ${category.title}? This can't be undone.`)) return;
    resetCompanionState(categoryId);
    setVersion((v) => v + 1);
    setFeedback(null);
    setCurrent(pickExample(category.pool));
  };

  const capstoneUnlocked = tier === 'competent' || tier === 'mastered';
  const referenceWeights = useMemo(() => getReferenceWeights(category), [category]);
  const yourCapstoneGuess = useMemo(
    () => predictLabel(companionState.weights, extractFeatures(category.capstone.text, vocabulary)),
    [companionState.weights, category, vocabulary],
  );
  const referenceCapstoneGuess = useMemo(
    () => predictLabel(referenceWeights, extractFeatures(category.capstone.text, vocabulary)),
    [referenceWeights, category, vocabulary],
  );
  const yourCapstoneConfidence = useMemo(
    () => predictConfidence(companionState.weights, extractFeatures(category.capstone.text, vocabulary)),
    [companionState.weights, category, vocabulary],
  );
  const referenceCapstoneConfidence = useMemo(
    () => predictConfidence(referenceWeights, extractFeatures(category.capstone.text, vocabulary)),
    [referenceWeights, category, vocabulary],
  );

  return (
    <section className="px-6 sm:px-8 md:px-12 pt-28 md:pt-36 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <p className="text-sky-400 text-xs tracking-widest uppercase mb-3">Train Your Companion</p>
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-light leading-tight tracking-tight">
          Teach it. Then find out what it actually learned.
        </h1>
        <p className="text-white/50 text-sm mt-4 max-w-2xl font-light leading-relaxed">
          Every label you give trains a small real classifier. It learns from{' '}
          <span className="text-white/80">your</span> answer, right or wrong. Its mastery tier is measured against
          examples you never see, so it reflects what it actually learned, not how many times you clicked.
        </p>

        <div className="flex justify-center gap-1.5 mt-8 rounded-full border border-white/10 p-1 w-fit mx-auto">
          <button
            type="button"
            onClick={() => setMode('train')}
            className={`inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full transition-colors ${
              mode === 'train' ? 'bg-white text-black' : 'text-white/50 hover:text-white'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            Train
          </button>
          <button
            type="button"
            onClick={() => setMode('chat')}
            className={`inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full transition-colors ${
              mode === 'chat' ? 'bg-white text-black' : 'text-white/50 hover:text-white'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Talk
          </button>
        </div>

        {/* ── The companion: centered, large, the actual focal point of
            the page. Everything else is arranged around it rather than
            sharing a row with it. Its quality (sharp vs. dim/glitchy) is
            driven by overall mastery across every trained skill, so it
            looks the same whether you're training or talking to it.
            One entity, not two. ─────────────────────────────────────── */}
        <div className="flex flex-col items-center mt-10">
          <InteractiveOrbStage
            state={orbPhase}
            quality={overallQuality}
            analyser={mode === 'chat' && orbPhase === 'speaking' ? speechPulse.current : null}
            size={420}
            onTouch={handleOrbTouch}
          />
          <p className="text-white/25 text-[11px] mt-3">Drag around, or click it.</p>

          {editingName ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                commitName();
              }}
              className="flex items-center gap-1.5 mt-4"
            >
              <input
                autoFocus
                type="text"
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                onBlur={commitName}
                maxLength={24}
                className="bg-white/5 border border-white/15 rounded-full px-3 py-1.5 text-base text-white text-center outline-none focus:border-sky-400/40 w-44"
              />
              <button type="submit" aria-label="Save name" className="text-sky-300 hover:text-sky-200">
                <Check className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => {
                setNameDraft(identity.name);
                setEditingName(true);
              }}
              className="inline-flex items-center gap-1.5 text-white text-xl font-normal mt-4 hover:text-sky-300 transition-colors"
            >
              {identity.name}
              <Pencil className="w-3.5 h-3.5 text-white/30" />
            </button>
          )}

          {mode === 'train' && (
            <>
              <div className="w-full max-w-md mt-8">
                <CompanionMasteryMeter
                  tier={tier}
                  accuracy={accuracy}
                  ceilingAccuracy={ceilingAccuracy}
                  labelsCount={companionState.labelsCount}
                  peakAccuracy={companionState.peakAccuracy}
                />
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 mt-5 text-white/30 hover:text-white/60 text-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset {category.title} training
              </button>
            </>
          )}
        </div>

        {mode === 'train' && (
          <div className="flex flex-wrap justify-center gap-2 mt-10">
            {TRAINING_CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setCategoryId(c.id);
                  setFeedback(null);
                }}
                className={`text-sm px-4 py-2 rounded-full border transition-colors ${
                  c.id === categoryId
                    ? 'border-sky-400/50 bg-sky-400/10 text-white'
                    : 'border-white/10 text-white/50 hover:text-white hover:border-white/20'
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>
        )}

        {/* Training panel */}
        {mode === 'train' && (
        <div className="max-w-xl mx-auto mt-6 rounded-2xl liquid-glass p-6">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-1 text-center">{category.title}</p>
          <p className="text-white/40 text-xs font-light mb-5 text-center">{category.tagline}</p>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-5 mb-5"
            >
              <p className="text-white text-base font-light leading-relaxed">“{current.text}”</p>
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleLabel(1)}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-white text-black text-sm font-medium py-2.5 hover:bg-white/90 transition-colors"
            >
              <ThumbsUp className="w-4 h-4" />
              {category.positiveLabel}
            </button>
            <button
              type="button"
              onClick={() => handleLabel(0)}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-white/15 text-white/80 text-sm font-medium py-2.5 hover:border-white/30 hover:text-white transition-colors"
            >
              <ThumbsDown className="w-4 h-4" />
              {category.negativeLabel}
            </button>
          </div>

          {feedback && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] p-4"
            >
              <div className="flex items-center gap-2 text-sm mb-1.5">
                {feedback.studentLabel === feedback.example.label ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-sky-300 shrink-0" />
                    <span className="text-sky-300">
                      Your label was correct. That's real training signal.
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-white/30 shrink-0" />
                    <span className="text-white/50">
                      Actually {feedback.example.label === 1 ? category.positiveLabel.toLowerCase() : category.negativeLabel.toLowerCase()}. Your companion just learned the wrong thing from this one.
                    </span>
                  </>
                )}
              </div>
              <p className="text-white/50 text-xs font-light leading-relaxed">{feedback.example.explanation}</p>
            </motion.div>
          )}
        </div>
        )}

        {/* Capstone */}
        {mode === 'train' && (
        <div className="mt-5 rounded-2xl liquid-glass p-6">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-sky-300" />
            <p className="text-white text-base font-normal">Capstone: a brand-new example</p>
          </div>
          <p className="text-white/40 text-xs font-light mb-5">
            Neither your companion nor the reference model has ever seen this example. Reach Competent to unlock it.
          </p>

          {!capstoneUnlocked ? (
            <div className="rounded-xl border border-dashed border-white/15 p-6 text-center">
              <Lock className="w-6 h-6 text-white/20 mx-auto mb-3" strokeWidth={1.25} />
              <p className="text-white/40 text-sm">
                Reach Competent mastery in {category.title} to unlock the comparison.
              </p>
            </div>
          ) : (
            <div>
              <p className="text-white text-sm font-light leading-relaxed mb-5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                “{category.capstone.text}”
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/10 p-4">
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Your companion says</p>
                  <p className={`text-lg font-normal ${yourCapstoneGuess === category.capstone.label ? 'text-sky-300' : 'text-white/40'}`}>
                    {yourCapstoneGuess === 1 ? category.positiveLabel : category.negativeLabel}
                  </p>
                  <div className="mt-2">
                    <ConfidenceMeter
                      confidence={yourCapstoneConfidence}
                      correct={yourCapstoneGuess === category.capstone.label}
                    />
                  </div>
                </div>
                <div className="rounded-xl border border-sky-400/20 bg-sky-400/[0.03] p-4">
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Reference model says</p>
                  <p className={`text-lg font-normal ${referenceCapstoneGuess === category.capstone.label ? 'text-sky-300' : 'text-white/40'}`}>
                    {referenceCapstoneGuess === 1 ? category.positiveLabel : category.negativeLabel}
                  </p>
                  <div className="mt-2">
                    <ConfidenceMeter
                      confidence={referenceCapstoneConfidence}
                      correct={referenceCapstoneGuess === category.capstone.label}
                    />
                  </div>
                </div>
              </div>
              <p className="text-white/40 text-xs font-light mt-4">
                Correct answer: <span className="text-white/70">{category.capstone.label === 1 ? category.positiveLabel : category.negativeLabel}</span>.{' '}
                {category.capstone.explanation}
              </p>
            </div>
          )}
        </div>
        )}

        {/* Chat: the same companion, talking. Text in, voice out. */}
        {mode === 'chat' && (
          <div className="max-w-xl mx-auto mt-6 rounded-2xl liquid-glass flex flex-col overflow-hidden" style={{ height: '60vh', maxHeight: 560 }}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 shrink-0">
              <p className="text-white/50 text-xs">
                Trained by you · {Math.round(overallQuality * 100)}% toward full mastery
              </p>
              <div className="flex items-center gap-2">
                {englishVoices.length > 0 && (
                  <select
                    value={identity.voiceURI ?? ''}
                    onChange={(e) => setVoice(e.target.value || null)}
                    aria-label="Companion voice"
                    className="bg-white/5 border border-white/10 rounded-full pl-2.5 pr-6 py-1 text-[11px] text-white/60 outline-none focus:border-sky-400/40 max-w-[9rem]"
                  >
                    <option value="">Default voice</option>
                    {englishVoices.map((v) => (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                )}
                <button
                  type="button"
                  onClick={toggleMuted}
                  aria-label={muted ? 'Unmute spoken replies' : 'Mute spoken replies'}
                  className="text-white/40 hover:text-white transition-colors p-1"
                >
                  {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
              {chatMessages.length === 0 && (
                <div>
                  <p className="text-white/40 text-xs font-light leading-relaxed mb-4">
                    Ask {identity.name} about how AI works, or talk through homework. It explains and coaches, out
                    loud, and it won't just hand you finished answers. Undertrained, it can actually get things
                    wrong, and it checks its own answers live for hallucination, bias, and overconfidence, the same
                    skills taught in Hallucination Hunt and Bias Detective, applied to its own replies.
                  </p>
                  <div className="flex flex-col gap-2">
                    {SUGGESTED_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => sendChat(prompt)}
                        className="text-left text-xs text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg px-3 py-2.5 transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {chatMessages.map((m, i) => (
                <div key={i} className={`max-w-[85%] flex flex-col gap-1.5 ${m.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}>
                  <div
                    className={`rounded-xl px-3.5 py-2.5 text-sm font-light leading-relaxed ${
                      m.role === 'user' ? 'bg-white text-black' : 'bg-white/8 text-white/80'
                    }`}
                  >
                    {m.content}
                  </div>

                  {/* Self-audit: the companion checking its own answer for
                      exactly what this course teaches students to watch
                      for, applied live to its own output. Empty at high
                      mastery, more likely to surface something real at
                      low mastery, since that persona is allowed to skip
                      double-checking itself. Icon-only distinction
                      between flag types, no color coding. */}
                  {m.flags && m.flags.length > 0 && (
                    <div className="w-full flex flex-col gap-1.5">
                      {m.flags.map((flag, fi) => {
                        const Icon = FLAG_ICON[flag.type] ?? Info;
                        return (
                          <div key={fi} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs">
                            <div className="flex items-center gap-1.5 text-sky-300/80 uppercase tracking-wide text-[10px] mb-1">
                              <Icon className="w-3 h-3" />
                              {FLAG_LABEL[flag.type] ?? 'Flagged'}
                            </div>
                            {flag.quote && <p className="text-white/50 italic mb-1">“{flag.quote}”</p>}
                            <p className="text-white/60 font-light">{flag.note}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}

              {chatSending && (
                <div className="self-start flex items-center gap-2 text-white/40 text-xs px-1">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {identity.name} is thinking...
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendChat(chatInput);
              }}
              className="flex items-center gap-2 px-4 py-3 border-t border-white/10 shrink-0"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={`Ask ${identity.name}...`}
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-sky-400/40"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || chatSending}
                aria-label="Send"
                className="w-9 h-9 shrink-0 rounded-full bg-white text-black flex items-center justify-center disabled:opacity-40 hover:bg-white/90 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
