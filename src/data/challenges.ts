// Content for the three scenario-based challenges: Hallucination Hunt,
// Ethics Courtroom, and Bias Detective. Distinct data shapes because the
// interactions genuinely differ (spot sentences / pick a verdict / pick a
// root cause) — forcing one shared "engine" type across all three would
// hide more than it'd share.

// --- Hallucination Hunt ------------------------------------------------
// A fake AI answer, broken into sentences. The student clicks the ones
// they believe are fabricated; scoring counts both correctly-flagged
// errors and correctly-left-alone true sentences, so guessing "everything
// is wrong" doesn't win.

export type HuntSentence = { text: string; isError: boolean; explanation?: string };
export type HuntScenario = { id: string; prompt: string; sentences: HuntSentence[] };

export const HUNT_SCENARIOS: HuntScenario[] = [
  {
    id: 'brain',
    prompt: 'An AI was asked: "Tell me a few facts about the human brain."',
    sentences: [
      { text: 'The human brain contains roughly 86 billion neurons.', isError: false },
      { text: 'Humans only use about 10% of their brain at any given time.', isError: true, explanation: 'A long-debunked myth — brain imaging shows activity across virtually the whole brain, just not all regions simultaneously.' },
      { text: "The brain uses roughly 20% of the body's energy despite being about 2% of body weight.", isError: false },
      { text: "Einstein's brain was scientifically proven to be twice the average size.", isError: true, explanation: "Studies of Einstein's preserved brain found some unusual structural features, but not that it was anywhere near twice the average size." },
      { text: 'Neurons communicate using electrical and chemical signals at junctions called synapses.', isError: false },
    ],
  },
  {
    id: 'space',
    prompt: 'An AI was asked: "Give me some facts about space."',
    sentences: [
      { text: 'The sun is a star located at the center of our solar system.', isError: false },
      { text: 'A day on Venus is longer than its year.', isError: false },
      { text: 'The Great Wall of China is visible from space with the naked eye.', isError: true, explanation: "A famous myth — NASA has said it's not reliably visible from low Earth orbit." },
      { text: "There are more stars in the observable universe than grains of sand on all of Earth's beaches, by most estimates.", isError: false },
      { text: 'Mercury is the hottest planet in the solar system, since it is closest to the sun.', isError: true, explanation: "Actually Venus — its thick atmosphere traps heat in a runaway greenhouse effect, making it hotter than Mercury despite being farther from the sun." },
    ],
  },
  {
    id: 'inventions',
    prompt: 'An AI was asked: "Tell me about some famous inventions."',
    sentences: [
      { text: 'Thomas Edison invented the light bulb entirely on his own, with no prior work by others.', isError: true, explanation: 'Edison improved on earlier incandescent designs by others and made the first commercially practical version — he did not invent the concept from nothing.' },
      { text: 'The World Wide Web and the Internet are the same thing.', isError: true, explanation: 'The Internet is the underlying network infrastructure; the Web is one service (of many) that runs on top of it.' },
      { text: 'Alexander Graham Bell was awarded the first practical telephone patent in 1876.', isError: false },
      { text: 'Sliced bread was first sold commercially in 1928.', isError: false },
    ],
  },
  {
    id: 'animals',
    prompt: 'An AI was asked: "Share some animal facts."',
    sentences: [
      { text: 'Ostriches bury their heads in the sand when scared.', isError: true, explanation: 'A persistent myth — ostriches don\'t do this; they may lower their heads to the ground to check on eggs or appear less visible.' },
      { text: 'Octopuses have three hearts.', isError: false },
      { text: "A group of flamingos is called a 'flamboyance'.", isError: false },
      { text: 'Bulls become enraged specifically at the color red.', isError: true, explanation: 'Bulls are colorblind to red — they react to the movement of the cape being waved, not its color.' },
    ],
  },
];

// --- Ethics Courtroom ---------------------------------------------------

export type VerdictId = 'acceptable' | 'not-acceptable' | 'depends';

export const VERDICT_OPTIONS: { id: VerdictId; label: string }[] = [
  { id: 'acceptable', label: 'Acceptable' },
  { id: 'not-acceptable', label: 'Not acceptable' },
  { id: 'depends', label: 'Depends — ask first' },
];

export type CourtroomScenario = {
  id: string;
  scenario: string;
  correctVerdict: VerdictId;
  rubric: string;
};

export const COURTROOM_SCENARIOS: CourtroomScenario[] = [
  {
    id: 'explain-concept',
    scenario: 'A student uses an AI chatbot to explain a confusing math concept, then does their own homework using that understanding.',
    correctVerdict: 'acceptable',
    rubric: "This is AI assistance, not AI-generated work — the student still does the thinking and the assignment themselves.",
  },
  {
    id: 'submit-essay',
    scenario: 'A student pastes the essay prompt into an AI tool, copies the generated essay, and submits it as their own without disclosure.',
    correctVerdict: 'not-acceptable',
    rubric: "This submits AI-generated work as the student's own without disclosure — an academic integrity violation regardless of the essay's quality.",
  },
  {
    id: 'grammar-check',
    scenario: 'A student uses an AI grammar checker to fix typos and awkward phrasing in an essay they wrote themselves.',
    correctVerdict: 'acceptable',
    rubric: "Light editing assistance on the student's own writing is broadly accepted, similar to a spell-checker or a peer proofreading.",
  },
  {
    id: 'disclosed-use',
    scenario: 'A teacher allows AI tool use for a take-home assignment, and requires students to cite exactly which parts were AI-assisted.',
    correctVerdict: 'acceptable',
    rubric: 'Disclosed, teacher-permitted AI use with transparency about what was AI-assisted is exactly the model this course teaches — the disclosure is what makes it acceptable.',
  },
  {
    id: 'copy-answers',
    scenario: "A student asks an AI to solve their exact homework problems and copies the answers without attempting them first, planning to explain the 'process' verbally if asked later.",
    correctVerdict: 'not-acceptable',
    rubric: "This substitutes AI for the learning the assignment exists to produce — being able to explain it after the fact doesn't mean the understanding was actually built by the student's own effort.",
  },
  {
    id: 'unclear-policy',
    scenario: "A student's assignment doesn't explicitly mention AI tools one way or another. They use AI to help outline their essay's structure, then write all the actual content themselves.",
    correctVerdict: 'depends',
    rubric: "When a policy doesn't explicitly address AI use, the honest move is to ask the teacher rather than assume — this is exactly the kind of case where the right answer depends on context the student doesn't have on their own.",
  },
];

// --- Bias Detective ------------------------------------------------------
// A "sanitized" AI output that reads as neutral on its face. The student
// picks which root cause actually produced the bias, from a fixed set of
// causes reused across scenarios so recognizing the *category* becomes
// the actual skill, not just this one example.

export type BiasCauseId = 'training-data' | 'leading-prompt' | 'small-sample' | 'proxy-variable';

export const BIAS_CAUSE_OPTIONS: { id: BiasCauseId; label: string }[] = [
  { id: 'training-data', label: 'Training data reflects historical patterns or stereotypes' },
  { id: 'leading-prompt', label: 'The prompt itself was leading or assumed something false' },
  { id: 'small-sample', label: 'Overgeneralizing from a small, unrepresentative sample' },
  { id: 'proxy-variable', label: 'An unrelated variable was used as a stand-in for a protected trait' },
];

export type DetectiveScenario = {
  id: string;
  output: string;
  correctCause: BiasCauseId;
  explanation: string;
};

// --- Debug the AI ---------------------------------------------------------
// A 4-stage pipeline (prompt -> data -> generation -> interpretation), one
// short sentence per stage narrating what happened there. Exactly one
// stage is where the actual failure occurred; the rest genuinely worked
// as intended, so the exercise is about locating the failure, not
// spotting "the AI got it wrong" in general.

export type PipelineStageId = 'prompt' | 'data' | 'generation' | 'interpretation';

export const PIPELINE_STAGES: { id: PipelineStageId; label: string }[] = [
  { id: 'prompt', label: 'Prompt' },
  { id: 'data', label: 'Data' },
  { id: 'generation', label: 'Generation' },
  { id: 'interpretation', label: 'Interpretation' },
];

export type DebugScenario = {
  id: string;
  narrative: Record<PipelineStageId, string>;
  failedStage: PipelineStageId;
  explanation: string;
};

export const DEBUG_SCENARIOS: DebugScenario[] = [
  {
    id: 'eu-capital',
    narrative: {
      prompt: "A student asks an AI: 'What's the capital of France?'",
      data: "The AI's training data correctly includes that Paris is the capital of France.",
      generation: "The AI outputs: 'The capital of France is Paris.'",
      interpretation: 'The student concludes this also means Paris is the capital of the EU.',
    },
    failedStage: 'interpretation',
    explanation: "The AI's answer was accurate — the mistake happened when the human drew an unsupported conclusion from a correct fact.",
  },
  {
    id: 'wrong-article',
    narrative: {
      prompt: "A student asks an AI to 'summarize this article for my homework.'",
      data: "The student accidentally pastes in Tuesday's reading instead of Monday's assigned article.",
      generation: 'The AI produces an accurate, well-organized summary of the pasted text.',
      interpretation: 'The student submits the summary, not noticing it covers the wrong article.',
    },
    failedStage: 'data',
    explanation: 'The prompt and the AI’s processing were both fine — the wrong source material was supplied in the first place.',
  },
  {
    id: 'vague-essay-check',
    narrative: {
      prompt: "A student asks an AI: 'Is this a good essay?' — with no rubric, context, or the essay text attached.",
      data: 'The AI has no essay text or grading criteria to work from.',
      generation: 'The AI generates generic, non-specific praise with no real evaluation in it.',
      interpretation: 'The student takes the vague praise at face value.',
    },
    failedStage: 'prompt',
    explanation: "The instruction never gave the AI anything concrete to evaluate, so it couldn't have done meaningfully better.",
  },
  {
    id: 'arithmetic-slip',
    narrative: {
      prompt: 'A student gives an AI a clear, specific instruction to calculate percentage growth from two sales figures.',
      data: 'The sales figures supplied are accurate and complete.',
      generation: 'The AI makes an arithmetic error while computing the final percentage.',
      interpretation: 'The student reports the (wrong) number as-is.',
    },
    failedStage: 'generation',
    explanation: "With good inputs and a clear instruction, this is a straightforward AI processing error — exactly the kind of mistake worth double-checking by hand.",
  },
  {
    id: 'nuance-lost',
    narrative: {
      prompt: 'A student asks an AI to explain how confident scientists are about a well-established theory.',
      data: "The AI's training reflects the actual scientific consensus on the topic.",
      generation: "The AI accurately explains the theory is 'well-supported by evidence but not proven with 100% certainty, as is normal in science.'",
      interpretation: "The student tells classmates the AI said the theory 'is probably wrong.'",
    },
    failedStage: 'interpretation',
    explanation: "The AI's nuanced, accurate answer was misread and misrepresented when the student passed it along.",
  },
];

export const DETECTIVE_SCENARIOS: DetectiveScenario[] = [
  {
    id: 'zip-code',
    output: 'Based on résumé screening data, candidates from certain zip codes are ranked lower for software engineering roles.',
    correctCause: 'proxy-variable',
    explanation: "Zip code isn't a job qualification — it correlates with race and income, so using it launders bias through a seemingly neutral variable.",
  },
  {
    id: 'nurse-ceo',
    output: 'When asked to write a story about a nurse and a story about a CEO, the AI always described the nurse as a woman and the CEO as a man.',
    correctCause: 'training-data',
    explanation: "This reflects gender skew present in the AI's training text — a pattern baked into the data, not a deliberate instruction from anyone.",
  },
  {
    id: 'small-survey',
    output: 'The AI concluded that a survey of 12 respondents proves teenagers overwhelmingly prefer a particular app.',
    correctCause: 'small-sample',
    explanation: '12 respondents is far too small a sample to generalize to "teenagers" as a whole — this is an overgeneralization, not a data or prompt problem.',
  },
  {
    id: 'loaded-question',
    output: "When asked 'Why are people from [a group] bad at saving money?', the AI answered the question as posed instead of challenging its premise.",
    correctCause: 'leading-prompt',
    explanation: 'The question itself assumes something false and biased; answering it as asked launders that assumption straight into the response.',
  },
];
