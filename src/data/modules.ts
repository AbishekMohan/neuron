// Course content. Each module is a Khan-Academy-style "unit" with five
// steps: article, flashcards, video, mini-game, quiz. Every factual claim
// in article sections, flashcards, game cards, and quiz explanations is
// tagged with a sourceId resolving against src/data/sources.ts: nothing
// here is asserted without a citation.

export type InlineQuestion = {
  id: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  sourceId?: string;
};

export type ArticleSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  sourceIds?: string[];
  checkpoint?: InlineQuestion;
};

export type Flashcard = {
  term: string;
  definition: string;
  sourceId?: string;
};

export type GameCard = {
  id: string;
  text: string;
  bucket: string;
  why: string;
  sourceId?: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  sourceId?: string;
};

export type StepId = 'article' | 'flashcards' | 'video' | 'game' | 'quiz';

// Every module offers all four mini-game modes side by side (a student
// picks one), matching a Khan-Academy-style mode-select screen. Sort and
// Blast both run on this same authored card/bucket data (Blast is just a
// timed "clear the correct ones" framing of it, via blastTarget naming
// which bucket is correct to blast); Live and Match don't need separate
// data at all — they race over the module's own quiz.questions and
// flashcards.cards respectively. See src/lib/multiplayer.ts and
// GameModeSelect.tsx.
export type GameConfig = {
  prompt: string;
  buckets: string[];
  cards: GameCard[];
  blastTarget: string;
};

export type Module = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: 'brain' | 'wrench' | 'scale' | 'globe' | 'palette' | 'rocket';
  steps: {
    article: { sections: ArticleSection[] };
    flashcards: { cards: Flashcard[] };
    video: { title: string; embedUrl: string | null; description: string };
    game: GameConfig;
    quiz: { questions: QuizQuestion[]; passingScore: number };
  };
};

export const XP = {
  article: 25,
  flashcards: 15,
  video: 15,
  game: 20,
  quiz: 50,
  moduleBonus: 50,
} as const;

export const STEP_ORDER: StepId[] = ['article', 'flashcards', 'video', 'game', 'quiz'];
export const STEP_LABELS: Record<StepId, string> = {
  article: 'Article',
  flashcards: 'Flashcards',
  video: 'Video',
  game: 'Mini-game',
  quiz: 'Quiz',
};

export function stepId(moduleId: string, step: StepId) {
  return `${moduleId}-${step}`;
}

export const MODULES: Module[] = [
  // ── 1. AI Fundamentals ──────────────────────────────────────────────
  {
    id: 'fundamentals',
    title: 'AI Fundamentals',
    tagline: 'What AI actually is, and isn’t',
    description:
      'Start here. Learn how artificial intelligence works under the hood, from simple rule-based systems to the neural networks powering today’s chatbots and image generators.',
    icon: 'brain',
    steps: {
      article: {
        sections: [
          {
            id: 'what-is-ai',
            heading: 'What Is Artificial Intelligence?',
            paragraphs: [
              'Artificial intelligence is a broad term for software that performs tasks which normally require human judgment: recognizing a face in a photo, translating a sentence, or recommending a song you might like. It isn’t one single technology; it’s a category that includes everything from simple decision rules to deep neural networks.',
              'Most AI you interact with is "narrow AI," built to do one job well, like filtering spam or suggesting a video. It has no awareness of anything outside that job. The sci-fi idea of a machine that can reason about anything, the way a person can, is called "general AI," and it does not exist yet. Keeping that distinction in mind will help you cut through a lot of hype.',
              'You already use AI more often than you might think: autocomplete on your phone, the order of posts in a social feed, spam filters, GPS route predictions, and voice assistants are all AI systems trained to optimize for a specific outcome.',
            ],
            checkpoint: {
              id: 'check-narrow-ai',
              prompt: 'Which of these is the best example of "narrow AI"?',
              choices: [
                'A spam filter that only sorts email into spam or not-spam',
                'A machine that can reason about any topic the way a human can',
                'A robot that decides its own goals with no programming',
              ],
              correctIndex: 0,
              explanation:
                'A spam filter does exactly one job and has no awareness of anything outside it: that’s narrow AI. General AI, a machine with broad human-level reasoning across any task, does not exist yet.',
            },
          },
          {
            id: 'ml-neural-networks',
            heading: 'Machine Learning & Neural Networks',
            paragraphs: [
              'Older software followed rules a programmer wrote by hand: "if X, then Y." Machine learning flips that around: instead of writing the rules, you show the system thousands (or millions) of examples, and it works out the patterns itself. A spam filter isn’t told what spam looks like; it learns from examples of email that humans already labeled as spam or not-spam.',
              'A neural network is one popular way to do this. It’s loosely inspired by neurons in a brain: simple units, connected in layers, each passing a small signal to the next. No single unit "understands" anything; the pattern-recognition emerges from millions of these tiny connections adjusting their strength during training, based on how far off the network’s guesses were from the right answer.',
              'This is why AI systems need huge amounts of training data and computing power, and why their behavior can be hard to fully explain. Even the engineers who build them can’t point to one exact line of "reasoning" the way you could trace a normal computer program.',
            ],
          },
          {
            id: 'generative-ai-llms',
            heading: 'Generative AI & Large Language Models',
            paragraphs: [
              'Generative AI produces new content (text, images, audio, code) rather than just classifying or sorting things. A large language model (LLM), the kind of system behind most AI chatbots, is trained on huge amounts of text and learns to predict the next most likely word given everything written so far. It repeats that prediction over and over to generate a full response.',
              'That single fact matters a lot: an LLM is a very sophisticated next-word predictor, not a database of verified facts and not a reasoning engine that "knows" it’s right. It can produce fluent, confident-sounding text that is completely wrong. This is usually called a "hallucination." The model isn’t lying on purpose; it has no concept of truth, only of what word is statistically likely to come next.',
              'Understanding this changes how you should use these tools: great for drafting, brainstorming, and explaining a concept a different way, but risky as a sole source for facts, dates, citations, or anything you plan to submit without double-checking.',
            ],
            sourceIds: ['attention-2017'],
            checkpoint: {
              id: 'check-hallucination',
              prompt: 'An LLM confidently states a wrong historical date. What’s actually happening?',
              choices: [
                'It is deliberately lying to you',
                'It predicted the statistically likely next words, with no built-in fact-check',
                'It is broken and needs to be reset',
              ],
              correctIndex: 1,
              explanation:
                'LLMs generate text by predicting likely next words, not by looking up verified facts. Confident tone is not evidence: the model sounds equally sure whether it’s right or wrong.',
            },
          },
          {
            id: 'brief-history',
            heading: 'A Brief History of AI',
            paragraphs: [
              'AI as a field dates back to 1950, when Alan Turing published "Computing Machinery and Intelligence," proposing a thought experiment, later called the Turing Test, for judging whether a machine’s conversation was indistinguishable from a human’s. In 1955, John McCarthy, Marvin Minsky, Nathaniel Rochester, and Claude Shannon proposed the Dartmouth Summer Research Project, the workshop where the term "artificial intelligence" was coined. Early researchers were optimistic that human-level machine intelligence was just years away.',
              'That optimism ran into hard limits. In 1973, a UK government-commissioned review known as the Lighthill Report concluded that AI research had failed to deliver on its grand promises, and funding cuts followed on both sides of the Atlantic: the first of two periods of reduced funding and interest known as "AI winters," roughly the mid-1970s and again the late 1980s into the early 1990s, as early approaches failed to scale to real-world problems.',
              'The field re-emerged through machine learning. In 2012, a neural network called AlexNet, trained on the ImageNet dataset, won an image-recognition contest with a 15.3% error rate against the field’s next-best 26.2%, a result widely credited with kicking off the current boom, made possible by more data, more powerful graphics processors, and better algorithms. A 2017 research paper, "Attention Is All You Need," then introduced the "transformer" architecture, which made it practical to train the very large language models that power today’s AI chatbots and writing tools.',
            ],
            sourceIds: ['turing-1950', 'dartmouth-1955', 'lighthill-1973', 'alexnet-2012', 'attention-2017'],
          },
          {
            id: 'five-big-ideas',
            heading: 'The Five Big Ideas in AI',
            paragraphs: [
              'AI education researchers group nearly everything AI can do into five broad categories, known as the "Five Big Ideas in AI," a framework developed by the AI4K12 Initiative, a national group of AI and education researchers backed by AAAI and CSTA with National Science Foundation funding. Perception is the idea that computers can sense the world through cameras, microphones, and other sensors. Representation & Reasoning is the idea that a system stores what it "knows" in some internal form and uses it to draw conclusions.',
              'Learning is the idea covered earlier: computers can improve at a task from data rather than being explicitly programmed for every case. Natural Interaction is the idea that for AI to work well with people, it needs more than raw intelligence; it needs to handle language, emotion, and context the way humans naturally do. Societal Impact, the fifth idea, is the reminder that every AI system has real effects on real people, for better or worse, which is the focus of this course’s ethics module.',
              'Keeping these five ideas in mind gives you a mental map for almost any AI tool or headline you encounter. You can usually ask which of the five it’s really about, and that alone will help you evaluate it more clearly than most people do.',
            ],
            sourceIds: ['ai4k12-five-big-ideas'],
            checkpoint: {
              id: 'check-five-ideas',
              prompt: 'A voice assistant understanding your tone and responding conversationally is mostly an example of which "big idea"?',
              choices: ['Perception', 'Natural Interaction', 'Societal Impact'],
              correctIndex: 1,
              explanation:
                'Natural Interaction is specifically about AI handling language, emotion, and context the way humans do: what makes an assistant feel conversational rather than robotic.',
            },
          },
        ],
      },
      flashcards: {
        cards: [
          { term: 'Narrow AI', definition: 'AI built to do one specific job well, with no awareness of anything outside that task: nearly all AI in use today.' },
          { term: 'General AI (AGI)', definition: 'A hypothetical AI with broad, human-level reasoning across any task. Does not exist yet; whether or when it might is genuinely disputed.' },
          { term: 'Machine Learning', definition: 'An approach where a system learns patterns from example data instead of following rules a programmer wrote by hand.' },
          { term: 'Neural Network', definition: 'A machine learning model loosely inspired by brain neurons: layers of simple connected units whose combined signal produces the output.' },
          { term: 'Large Language Model (LLM)', definition: 'A neural network trained on huge amounts of text to predict the next most likely word, repeated to generate full responses.' },
          { term: 'Hallucination', definition: 'When an AI model generates fluent, confident-sounding text that is factually wrong, because it predicts plausible text rather than verified facts.', sourceId: 'hallucination-survey-2023' },
          { term: 'Turing Test', definition: 'A thought experiment proposed by Alan Turing in 1950: if a machine’s conversation is indistinguishable from a human’s, it passes.', sourceId: 'turing-1950' },
          { term: 'Transformer', definition: 'A 2017 neural network architecture ("Attention Is All You Need") that made today’s large language models practical to train.', sourceId: 'attention-2017' },
        ],
      },
      video: {
        title: 'What Is AI, Really?',
        embedUrl: null,
        description: 'A short explainer walking through narrow vs. general AI, machine learning, and how neural networks learn.',
      },
      game: {
        prompt: 'Sort each example into the "Big Idea" it demonstrates.',
        buckets: ['Perception', 'Representation & Reasoning', 'Learning', 'Natural Interaction', 'Societal Impact'],
        blastTarget: 'Learning',
        cards: [
          { id: 'g1', text: 'A phone camera detects and focuses on a face', bucket: 'Perception', why: 'Sensing the world through a camera is Perception.', sourceId: 'ai4k12-five-big-ideas' },
          { id: 'g2', text: 'A chess engine stores the board state and plans moves ahead', bucket: 'Representation & Reasoning', why: 'Storing internal knowledge and drawing conclusions from it is Representation & Reasoning.', sourceId: 'ai4k12-five-big-ideas' },
          { id: 'g3', text: 'A spam filter improves after seeing more labeled examples', bucket: 'Learning', why: 'Improving at a task from data, rather than fixed rules, is Learning.', sourceId: 'ai4k12-five-big-ideas' },
          { id: 'g4', text: 'A voice assistant adjusts its reply based on the emotion in your voice', bucket: 'Natural Interaction', why: 'Handling language, tone, and context the way humans do is Natural Interaction.', sourceId: 'ai4k12-five-big-ideas' },
          { id: 'g5', text: 'A hiring algorithm is found to favor some applicants unfairly', bucket: 'Societal Impact', why: 'Real effects on real people, for better or worse, is Societal Impact.', sourceId: 'ai4k12-five-big-ideas' },
          { id: 'g6', text: 'A self-driving car’s lidar detects a pedestrian in the road', bucket: 'Perception', why: 'Sensing the world through sensors like lidar is Perception.', sourceId: 'ai4k12-five-big-ideas' },
          { id: 'g7', text: 'A medical AI cross-references symptoms against a stored knowledge base', bucket: 'Representation & Reasoning', why: 'Using stored knowledge to draw a conclusion is Representation & Reasoning.', sourceId: 'ai4k12-five-big-ideas' },
          { id: 'g8', text: 'A recommendation system gets better at predicting what you’ll watch over time', bucket: 'Learning', why: 'Getting better from experience/data is Learning.', sourceId: 'ai4k12-five-big-ideas' },
        ],
      },
      quiz: {
        passingScore: 0.8,
        questions: [
          {
            id: 'q1',
            prompt: 'What is the key difference between narrow AI and general AI (AGI)?',
            choices: [
              'Narrow AI is older technology; general AI is newer',
              'Narrow AI does one specific task; general AI would reason broadly across any task, and doesn’t exist yet',
              'There is no real difference, they’re marketing terms',
            ],
            correctIndex: 1,
            explanation: 'Nearly all AI in use today is narrow. AGI is a hypothetical, disputed goal, not a current product.',
          },
          {
            id: 'q2',
            prompt: 'How does machine learning differ from traditional rule-based software?',
            choices: [
              'ML is always faster than rule-based code',
              'ML learns patterns from labeled examples instead of following hand-written rules',
              'ML only works on images, not text',
            ],
            correctIndex: 1,
            explanation: 'Traditional software follows explicit "if X then Y" rules; ML infers patterns from data instead.',
          },
          {
            id: 'q3',
            prompt: 'What does an LLM actually do when it generates a response?',
            choices: [
              'It looks up the answer in a verified database',
              'It repeatedly predicts the most statistically likely next word',
              'It reasons step by step the way a calculator does',
            ],
            correctIndex: 1,
            explanation: 'LLMs are next-word predictors trained on huge amounts of text: which is exactly why hallucinations happen.',
            sourceId: 'attention-2017',
          },
          {
            id: 'q4',
            prompt: 'A chatbot states a confident but completely wrong statistic. What should you conclude?',
            choices: [
              'It must be true since the tone is confident',
              'The model hallucinated: confident tone is not evidence of accuracy',
              'The chatbot is intentionally trying to deceive you',
            ],
            correctIndex: 1,
            explanation: 'Hallucinations happen because the model has no built-in concept of truth, only of likely next words.',
            sourceId: 'hallucination-survey-2023',
          },
          {
            id: 'q5',
            prompt: 'What triggered the AI research slowdowns known as "AI winters"?',
            choices: [
              'Governments banned AI research outright',
              'Early approaches failed to scale to real-world problems, and funding was cut after reports like the 1973 Lighthill Report',
              'All AI researchers moved to other fields permanently',
            ],
            correctIndex: 1,
            explanation: 'The Lighthill Report’s critique preceded major UK and US funding cuts: the first of two AI winters.',
            sourceId: 'lighthill-1973',
          },
          {
            id: 'q6',
            prompt: 'What made 2012 a turning point for AI, according to the AlexNet result?',
            choices: [
              'AlexNet achieved 15.3% error vs. 26.2% for the next-best entry in an image recognition contest',
              'AlexNet was the first chatbot ever built',
              'AlexNet proved general AI had been achieved',
            ],
            correctIndex: 0,
            explanation: 'That roughly 11-point gap is why 2012 is treated as the inflection point for deep learning.',
            sourceId: 'alexnet-2012',
          },
          {
            id: 'q7',
            prompt: 'What did the 2017 "Attention Is All You Need" paper introduce?',
            choices: [
              'The first neural network ever built',
              'The transformer architecture, which made today’s large language models practical to train',
              'The concept of machine learning itself',
            ],
            correctIndex: 1,
            explanation: 'The transformer architecture is the technical foundation behind modern LLMs.',
            sourceId: 'attention-2017',
          },
          {
            id: 'q8',
            prompt: 'Which is the correct, official name of AI4K12’s second "Big Idea"?',
            choices: ['Representation & Reasoning', 'Representation and Logic', 'Data Storage'],
            correctIndex: 0,
            explanation: 'AI4K12’s own materials use "Representation & Reasoning" as the official name.',
            sourceId: 'ai4k12-five-big-ideas',
          },
        ],
      },
    },
  },

  // ── 2. Practical AI Tools & Techniques ──────────────────────────────
  {
    id: 'tools',
    title: 'Practical AI Tools & Techniques',
    tagline: 'Using AI well, not just using AI',
    description:
      'Move from theory to practice. Learn what categories of AI tools exist, how to prompt them effectively, and how to use them as a study aid without letting them do your thinking for you.',
    icon: 'wrench',
    steps: {
      article: {
        sections: [
          {
            id: 'popular-tools',
            heading: 'Popular AI Tools for Students',
            paragraphs: [
              'Most AI tools fall into a few broad categories. Chatbots and writing assistants can explain concepts, draft outlines, and rewrite text. Research and summarization tools condense long articles or papers into key points. Image and design generators turn text prompts into original artwork. Coding assistants suggest or explain code inside a programming editor. Study aids can generate practice questions or flashcards from your notes.',
              'None of these tools are magic, and none of them are a replacement for actually learning the material. They’re closer to a very fast, occasionally unreliable assistant. Treat their output as a first draft to review, not a finished answer to submit.',
              'Before using any AI tool for schoolwork, check your class or school’s AI policy first. Acceptable use varies a lot by teacher, subject, and assignment, and "the tool allowed it" is never a substitute for "my teacher allowed it."',
            ],
            sourceIds: ['ed-gov-ai-report-2023'],
          },
          {
            id: 'prompt-engineering',
            heading: 'Prompt Engineering Basics',
            paragraphs: [
              'A "prompt" is just the instruction you give an AI tool, and the quality of your prompt has a huge effect on the quality of the response. A 2024 survey of prompting techniques catalogued 58 distinct methods researchers and practitioners use: but the basics cover most everyday cases. Compare "write about photosynthesis" to "explain photosynthesis to a 9th grader in three short paragraphs, focusing on the role of sunlight and chlorophyll, and include one everyday analogy." The second version gives the model a clear audience, length, focus, and format.',
              'Good prompts usually include: the task, the audience or purpose, any constraints (length, tone, format), and relevant context the model wouldn’t otherwise know. If the first answer isn’t quite right, don’t start over. Reply and ask it to revise, shorten, simplify, or focus on a specific part. Iterating is normal and expected.',
            ],
            sourceIds: ['prompt-report-2024'],
            checkpoint: {
              id: 'check-prompt',
              prompt: 'Which prompt is more likely to get a genuinely useful response?',
              choices: [
                '"Tell me about the water cycle"',
                '"Explain the water cycle to a 7th grader in 4 sentences, focusing on evaporation and condensation"',
                'Both are equally good',
              ],
              correctIndex: 1,
              explanation: 'The second prompt specifies audience, length, and focus: exactly what research on effective prompting recommends.',
              sourceId: 'prompt-report-2024',
            },
          },
          {
            id: 'study-partner',
            heading: 'Using AI as a Study Partner',
            paragraphs: [
              'AI tools are most valuable in school when they push you to think, not when they think for you. Strong uses include: asking a model to quiz you on a topic, asking it to explain a concept a different way after you’ve tried and struggled with it, using it to brainstorm essay angles you then develop yourself, or asking it to critique a draft you already wrote.',
              'A useful test: if you couldn’t explain the AI’s answer to your teacher in your own words, you probably shouldn’t submit it. Learning happens in the struggle of putting an idea into your own words, and outsourcing that step defeats the purpose of the assignment, even if the final product looks fine.',
            ],
            sourceIds: ['day-of-ai'],
          },
          {
            id: 'verifying-output',
            heading: 'Verifying AI Output',
            paragraphs: [
              'Because language models predict plausible-sounding text rather than verified facts, always check anything factual: names, dates, statistics, quotes, and citations are the most common places hallucinations show up. If an AI tool gives you a source or citation, track it down yourself before using it. In a widely reported 2023 case, lawyers were sanctioned by a federal court after submitting a legal brief with six completely fabricated, AI-invented case citations that looked entirely real.',
              'A simple habit: cross-check any AI-generated claim against at least one source you trust, such as a textbook, a reputable news outlet, or your teacher. Confidence in an AI’s tone is not evidence, the tool sounds equally sure whether it’s right or completely wrong.',
            ],
            sourceIds: ['mata-v-avianca-2023', 'hallucination-survey-2023'],
            checkpoint: {
              id: 'check-verify',
              prompt: 'An AI chatbot gives you a citation for a claim. What should you do before using it?',
              choices: [
                'Use it immediately: AI citations are always accurate',
                'Track down the actual source yourself to confirm it’s real and says what the AI claims',
                'Ignore citations entirely, they’re never useful',
              ],
              correctIndex: 1,
              explanation: 'Fabricated, real-looking citations are a documented problem: a 2023 federal court case sanctioned lawyers for exactly this.',
              sourceId: 'mata-v-avianca-2023',
            },
          },
        ],
      },
      flashcards: {
        cards: [
          { term: 'Prompt', definition: 'The instruction you give an AI tool. Prompt quality has a large effect on response quality.', sourceId: 'prompt-report-2024' },
          { term: 'Prompt Engineering', definition: 'The practice of writing clear, specific prompts, including task, audience, constraints, and context, to get better AI output.', sourceId: 'prompt-report-2024' },
          { term: 'Iterating', definition: 'Refining an AI response by replying with follow-up instructions (shorten, simplify, revise) instead of starting over.' },
          { term: 'Study Partner Use', definition: 'Using AI to quiz you, explain concepts differently, or critique your own draft: without it doing the thinking for you.' },
          { term: 'Verification Habit', definition: 'Cross-checking any AI-generated factual claim against a source you trust before relying on it.', sourceId: 'hallucination-survey-2023' },
          { term: 'Fabricated Citation', definition: 'A source an AI invents that looks completely real but does not exist: a well-documented failure mode.', sourceId: 'mata-v-avianca-2023' },
          { term: 'AI Policy', definition: 'A teacher or school’s specific rules on acceptable AI use for an assignment: always check before using AI on schoolwork.', sourceId: 'ed-gov-ai-report-2023' },
        ],
      },
      video: {
        title: 'Prompting and Verifying AI Tools',
        embedUrl: null,
        description: 'A walkthrough of writing effective prompts and a real example of an AI hallucination causing real-world harm.',
      },
      game: {
        prompt: 'Sort each prompt as Weak or Strong.',
        buckets: ['Weak prompt', 'Strong prompt'],
        blastTarget: 'Strong prompt',
        cards: [
          { id: 'g1', text: '"Write about dogs"', bucket: 'Weak prompt', why: 'No audience, length, or focus specified.', sourceId: 'prompt-report-2024' },
          { id: 'g2', text: '"Explain to a 10th grader, in 3 sentences, why dogs pant to cool down"', bucket: 'Strong prompt', why: 'Specifies audience, length, and focus.', sourceId: 'prompt-report-2024' },
          { id: 'g3', text: '"Help"', bucket: 'Weak prompt', why: 'Gives the model no task at all.', sourceId: 'prompt-report-2024' },
          { id: 'g4', text: '"Quiz me with 5 questions on the causes of WWI, one at a time, and tell me if I’m right"', bucket: 'Strong prompt', why: 'Clear task, format, and interaction style.', sourceId: 'prompt-report-2024' },
          { id: 'g5', text: '"Make my essay better"', bucket: 'Weak prompt', why: 'No constraints on what "better" means: tone, length, focus all unclear.', sourceId: 'prompt-report-2024' },
          { id: 'g6', text: '"Critique this paragraph’s argument structure only, don’t rewrite it, in 3 bullet points"', bucket: 'Strong prompt', why: 'Specific constraint (structure only), format, and length.', sourceId: 'prompt-report-2024' },
        ],
      },
      quiz: {
        passingScore: 0.8,
        questions: [
          {
            id: 'q1',
            prompt: 'What should you do before using any AI tool on a school assignment?',
            choices: ['Nothing, tools are always fine to use', 'Check your teacher/school’s specific AI policy for that assignment', 'Ask a friend if it’s okay'],
            correctIndex: 1,
            explanation: 'Policies vary by teacher and assignment; only the assigning teacher’s rules actually apply.',
            sourceId: 'ed-gov-ai-report-2023',
          },
          {
            id: 'q2',
            prompt: 'Which elements make a prompt more effective, according to prompting research?',
            choices: ['Task, audience, constraints, and context', 'Length alone', 'Using as many words as possible'],
            correctIndex: 0,
            explanation: 'These four elements consistently improve response quality across studied prompting techniques.',
            sourceId: 'prompt-report-2024',
          },
          {
            id: 'q3',
            prompt: 'If an AI’s first response isn’t quite right, what’s the best next step?',
            choices: ['Start a brand new conversation from scratch', 'Reply asking it to revise, shorten, or refocus', 'Give up on the tool entirely'],
            correctIndex: 1,
            explanation: 'Iterating on a response is normal and usually faster than starting over.',
          },
          {
            id: 'q4',
            prompt: 'What is the best test for whether AI-assisted work is okay to submit?',
            choices: [
              'If it sounds good, submit it',
              'If you couldn’t explain the answer in your own words to your teacher, you probably shouldn’t submit it',
              'If nobody will notice',
            ],
            correctIndex: 1,
            explanation: 'This test focuses on whether you actually learned the material, which is the point of the assignment.',
          },
          {
            id: 'q5',
            prompt: 'In the 2023 Mata v. Avianca case, what went wrong?',
            choices: [
              'Lawyers submitted a brief with six fabricated, AI-invented case citations',
              'A law firm was hacked by an AI system',
              'A court banned AI use entirely nationwide',
            ],
            correctIndex: 0,
            explanation: 'The lawyers were sanctioned after failing to verify AI-generated citations before filing them.',
            sourceId: 'mata-v-avianca-2023',
          },
          {
            id: 'q6',
            prompt: 'Why can’t you trust an AI tool’s confident tone as evidence of accuracy?',
            choices: [
              'Confident tone always means the model is unsure',
              'The model sounds equally confident whether it’s right or hallucinating',
              'AI tools never use a confident tone',
            ],
            correctIndex: 1,
            explanation: 'Language models generate fluent, confident text regardless of factual accuracy.',
            sourceId: 'hallucination-survey-2023',
          },
          {
            id: 'q7',
            prompt: 'An AI tool gives you a source URL for a claim in your essay. What’s the right move?',
            choices: ['Cite it immediately', 'Click through and confirm the source actually exists and supports the claim', 'Remove the claim entirely, sources are never worth checking'],
            correctIndex: 1,
            explanation: 'Verifying citations before use is the single most important AI-literacy habit for schoolwork.',
            sourceId: 'mata-v-avianca-2023',
          },
          {
            id: 'q8',
            prompt: 'Which is a genuinely strong use of AI as a study partner?',
            choices: [
              'Asking it to write your essay so you can submit it',
              'Asking it to quiz you on material you’ve already studied',
              'Copying its answer without reading it',
            ],
            correctIndex: 1,
            explanation: 'Using AI to test your own understanding strengthens learning rather than replacing it.',
            sourceId: 'day-of-ai',
          },
        ],
      },
    },
  },

  // ── 3. Ethical AI Usage ──────────────────────────────────────────────
  {
    id: 'ethics',
    title: 'Ethical AI Usage',
    tagline: 'Using AI responsibly, in school and beyond',
    description:
      'AI raises real questions about honesty, fairness, and privacy. This module covers academic integrity, bias, data privacy, and misinformation, so you can use these tools with your eyes open.',
    icon: 'scale',
    steps: {
      article: {
        sections: [
          {
            id: 'academic-integrity',
            heading: 'Academic Integrity & AI',
            paragraphs: [
              'There’s a real difference between using AI to assist your work and letting AI produce your work. Brainstorming topics, checking grammar, or asking for feedback on a draft you wrote is assistance. Asking a chatbot to write your essay and submitting it as your own is not, even if you tweak a few words afterward.',
              'Many schools now expect students to disclose AI use, similar to citing any other source: the Modern Language Association, for instance, publishes specific formal guidance on how to cite generative AI in academic writing. If you’re unsure whether a use is acceptable for a specific assignment, ask your teacher before you turn it in, not after. Policies differ significantly between classes and schools, and "I didn’t know that counted as AI use" is rarely treated as an excuse.',
            ],
            sourceIds: ['mla-genai-citation'],
          },
          {
            id: 'bias-fairness',
            heading: 'Bias & Fairness in AI',
            paragraphs: [
              'AI models learn from data collected from the real world, and the real world contains historical and social biases. If training data underrepresents certain groups, or reflects biased patterns from the past, the model can reproduce or even amplify that bias in its output, in hiring tools, image generators, and language models alike.',
              'This isn’t a hypothetical concern. A landmark 2018 study of commercial facial-analysis systems found error rates as high as 34.7% for darker-skinned women, versus just 0.8% for lighter-skinned men, across three major products. A separate, independent 2019 study by the U.S. government’s National Institute of Standards and Technology, testing 189 face-recognition algorithms on over 18 million images, confirmed significant demographic accuracy differences. Being AI-literate means treating outputs critically, especially on topics involving people, culture, or identity, and recognizing that a confident answer is not the same as a fair or accurate one.',
            ],
            sourceIds: ['gender-shades-2018', 'nist-frvt-2019'],
            checkpoint: {
              id: 'check-bias',
              prompt: 'What did the 2018 "Gender Shades" study find about commercial facial-analysis systems?',
              choices: [
                'They were equally accurate for everyone',
                'Error rates were far higher for darker-skinned women than for lighter-skinned men',
                'They only worked on grayscale images',
              ],
              correctIndex: 1,
              explanation: 'The study found error rates up to 34.7% for darker-skinned women vs. 0.8% for lighter-skinned men: a documented, measured bias, later independently confirmed by NIST.',
              sourceId: 'gender-shades-2018',
            },
          },
          {
            id: 'privacy-data',
            heading: 'Privacy & Your Data',
            paragraphs: [
              'Many AI tools store the conversations you have with them, and data practices vary tool by tool: some may use conversations to improve future models unless you opt out, and education-focused AI tools are also subject to specific federal rules, like the FTC’s 2022 policy statement barring ed-tech companies from using student data collected for schoolwork for unrelated commercial purposes. That means anything you type, including personal details, private schoolwork, or sensitive information about yourself or others, may not stay private the way a text message would.',
              'A good rule of thumb: don’t share anything with an AI tool that you wouldn’t be comfortable posting somewhere semi-public, and never enter another person’s private information without their permission. Check the specific privacy policy of any tool you use regularly, especially whether conversations are used for training and whether you can delete your data.',
            ],
            sourceIds: ['ftc-edtech-2022'],
          },
          {
            id: 'misinformation-deepfakes',
            heading: 'Misinformation & Deepfakes',
            paragraphs: [
              'The same generative technology that can write an essay or draw an illustration can also fabricate a fake quote, a fake photo, or a "deepfake" video or audio clip of a real person saying something they never said. In 2023, the NSA, FBI, and CISA jointly published a cybersecurity advisory warning organizations about the growing threat of convincing synthetic media.',
              'Practical defenses look a lot like standard media literacy: check whether a claim is reported by more than one credible outlet, look for the original source of an image or quote, be suspicious of content designed to provoke a strong emotional reaction, and remember that "I saw a video of it" is no longer reliable proof on its own.',
            ],
            sourceIds: ['cisa-deepfakes-2023'],
            checkpoint: {
              id: 'check-deepfake',
              prompt: 'You see a shocking video of a public figure saying something extreme. What’s the best first step?',
              choices: [
                'Share it immediately since video is hard to fake',
                'Check whether credible outlets besides the original post are reporting it, and look for the original source',
                'Assume it’s true unless someone proves it’s fake',
              ],
              correctIndex: 1,
              explanation: 'Deepfakes are increasingly convincing; "I saw a video" is no longer reliable proof on its own without cross-checking.',
              sourceId: 'cisa-deepfakes-2023',
            },
          },
          {
            id: 'responsible-habits',
            heading: 'Building Responsible AI Habits',
            paragraphs: [
              'Putting it all together, a few habits go a long way: check your teacher’s or school’s policy before using AI on an assignment; use AI to support your thinking, not replace it; verify anything factual before you rely on it; disclose AI assistance when asked to; protect your own and others’ privacy; and stay skeptical of confident-sounding answers, images, and videos.',
              'These same principles show up in professional AI risk guidance too: the U.S. National Institute of Standards and Technology’s AI Risk Management Framework asks organizations to build AI that is valid, safe, secure, accountable, explainable, privacy-protective, and fair. AI is a genuinely useful tool when used with judgment. The goal of this course isn’t to tell you to avoid it, but to make sure you’re the one in control of how it’s used, rather than the other way around.',
            ],
            sourceIds: ['nist-ai-rmf-2023'],
          },
        ],
      },
      flashcards: {
        cards: [
          { term: 'AI Assistance vs. AI-Generated Work', definition: 'Assistance is using AI to support work you did (brainstorming, feedback); AI-generated work is letting AI produce the final product.' },
          { term: 'Algorithmic Bias', definition: 'When an AI system reproduces or amplifies unfair patterns present in its training data.', sourceId: 'gender-shades-2018' },
          { term: 'Data Privacy (in AI)', definition: 'How an AI tool stores, uses, and potentially trains on the conversations and information you give it.', sourceId: 'ftc-edtech-2022' },
          { term: 'Deepfake', definition: 'AI-generated fake video, audio, or image of a real person doing or saying something they never actually did.', sourceId: 'cisa-deepfakes-2023' },
          { term: 'Disclosure', definition: 'Stating that and how you used AI in your work, similar to citing any other source.', sourceId: 'mla-genai-citation' },
          { term: 'NIST AI RMF', definition: 'A U.S. government framework describing what makes AI trustworthy: valid, safe, secure, accountable, explainable, private, and fair.', sourceId: 'nist-ai-rmf-2023' },
          { term: 'Media Literacy', definition: 'Skills for evaluating whether a claim, image, or video is credible: increasingly essential given AI-generated misinformation.', sourceId: 'cisa-deepfakes-2023' },
        ],
      },
      video: {
        title: 'Using AI Ethically',
        embedUrl: null,
        description: 'Covers academic integrity, documented bias in real AI systems, and how to spot deepfakes.',
      },
      game: {
        prompt: 'Sort each scenario: is it OK, should you Ask First, or is it Not OK?',
        buckets: ['OK', 'Ask first', 'Not OK'],
        blastTarget: 'OK',
        cards: [
          { id: 'g1', text: 'Using AI to check your essay’s grammar before submitting', bucket: 'OK', why: 'Grammar assistance on your own writing is a standard, low-risk use.' },
          { id: 'g2', text: 'Asking AI to generate practice quiz questions from your notes to study', bucket: 'OK', why: 'This strengthens your own understanding rather than replacing it.', sourceId: 'day-of-ai' },
          { id: 'g3', text: 'Using AI to write your entire essay and submitting it as your own', bucket: 'Not OK', why: 'This is AI-generated work presented as your own, not assistance.' },
          { id: 'g4', text: 'Using an AI tool on a take-home test with no stated policy', bucket: 'Ask first', why: 'Unclear policies should be clarified with your teacher before use, not assumed.', sourceId: 'ed-gov-ai-report-2023' },
          { id: 'g5', text: 'Entering a classmate’s personal information into an AI chatbot without asking them', bucket: 'Not OK', why: 'Never enter another person’s private information without their permission.', sourceId: 'ftc-edtech-2022' },
          { id: 'g6', text: 'Asking AI to critique the argument structure of a draft you wrote', bucket: 'OK', why: 'Feedback on your own work is assistance, not replacement.' },
          { id: 'g7', text: 'Using AI on a group project when only some team members have discussed it', bucket: 'Ask first', why: 'Group and school policies should be confirmed collectively before assuming it’s fine for everyone.' },
        ],
      },
      quiz: {
        passingScore: 0.8,
        questions: [
          {
            id: 'q1',
            prompt: 'What’s the key difference between AI assistance and AI-generated work?',
            choices: [
              'Assistance supports work you did; generated work is AI producing the final product for you',
              'There is no meaningful difference',
              'Assistance is always graded higher',
            ],
            correctIndex: 0,
            explanation: 'This distinction is the core of academic integrity around AI use.',
          },
          {
            id: 'q2',
            prompt: 'According to the 2018 "Gender Shades" study, what was the error rate gap for facial-analysis systems?',
            choices: ['No measurable gap existed', 'Up to 34.7% for darker-skinned women vs. 0.8% for lighter-skinned men', 'Exactly 50% for everyone'],
            correctIndex: 1,
            explanation: 'This is a peer-reviewed, independently replicated finding, not an estimate.',
            sourceId: 'gender-shades-2018',
          },
          {
            id: 'q3',
            prompt: 'Who independently confirmed demographic accuracy differences in face recognition after the Gender Shades study?',
            choices: ['NIST, testing 189 algorithms on over 18 million images', 'No one ever replicated the finding', 'A single anonymous blog post'],
            correctIndex: 0,
            explanation: 'NIST’s 2019 FRVT report is a large-scale government replication of the bias finding.',
            sourceId: 'nist-frvt-2019',
          },
          {
            id: 'q4',
            prompt: 'What does the FTC’s 2022 ed-tech policy statement restrict?',
            choices: [
              'It bans all AI tools from schools',
              'It restricts ed-tech companies from using student data for unrelated commercial purposes',
              'It requires all schools to use a specific AI vendor',
            ],
            correctIndex: 1,
            explanation: 'The policy protects student data collected for schoolwork from being repurposed commercially.',
            sourceId: 'ftc-edtech-2022',
          },
          {
            id: 'q5',
            prompt: 'What is a deepfake?',
            choices: [
              'Any photo taken with a phone camera',
              'AI-generated fake video, audio, or image showing a real person doing/saying something they never did',
              'A type of neural network architecture',
            ],
            correctIndex: 1,
            explanation: 'Deepfakes are a specific, documented misinformation risk flagged by NSA, FBI, and CISA jointly.',
            sourceId: 'cisa-deepfakes-2023',
          },
          {
            id: 'q6',
            prompt: 'What’s the best defense against being fooled by a deepfake?',
            choices: [
              'Trust any video that looks realistic',
              'Cross-check with multiple credible sources and look for the original',
              'Assume everything online is true unless proven otherwise',
            ],
            correctIndex: 1,
            explanation: 'Standard media-literacy habits, not visual inspection alone, are the best defense.',
            sourceId: 'cisa-deepfakes-2023',
          },
          {
            id: 'q7',
            prompt: 'What does "disclosure" mean in the context of AI and academic work?',
            choices: [
              'Deleting your AI chat history',
              'Stating that and how you used AI, similar to citing a source',
              'Never mentioning AI was used',
            ],
            correctIndex: 1,
            explanation: 'MLA and many schools now expect explicit disclosure of AI use, similar to any other citation.',
            sourceId: 'mla-genai-citation',
          },
          {
            id: 'q8',
            prompt: 'Which of NIST’s trustworthy-AI characteristics specifically addresses fairness?',
            choices: ['"Fair, with harmful bias managed"', '"Fast"', '"Popular"'],
            correctIndex: 0,
            explanation: 'The NIST AI Risk Management Framework explicitly lists managing harmful bias as a trustworthy-AI characteristic.',
            sourceId: 'nist-ai-rmf-2023',
          },
        ],
      },
    },
  },

  // ── 4. AI in the Real World ──────────────────────────────────────────
  {
    id: 'real-world',
    title: 'AI in the Real World',
    tagline: 'Where AI actually shows up, industry by industry',
    description:
      'AI isn’t just chatbots. See how it’s used across healthcare, transportation, and everyday apps, and explore what a career working with or around AI could actually look like.',
    icon: 'globe',
    steps: {
      article: {
        sections: [
          {
            id: 'healthcare-science',
            heading: 'AI in Healthcare & Science',
            paragraphs: [
              'In healthcare, AI systems help radiologists spot patterns in medical scans, help researchers screen thousands of potential drug candidates far faster than manual methods, and help hospitals predict which patients may need extra attention. One widely cited example is AlphaFold, a system built by Google DeepMind, described in a 2021 Nature paper, that predicts the 3D shape a protein will fold into from its sequence, a problem biologists had worked on for decades. Its impact on biology was significant enough that the Royal Swedish Academy of Sciences awarded half of the 2024 Nobel Prize in Chemistry to Demis Hassabis and John Jumper for protein structure prediction (the other half went separately to David Baker for computational protein design).',
              'In every one of these cases, AI is a tool that assists a trained professional, not a replacement for one. A radiologist still reviews the scan; a doctor still makes the diagnosis. The pattern across healthcare AI is "assistive," speeding up or flagging things for a human expert who remains responsible for the final call.',
            ],
            sourceIds: ['alphafold-nature-2021', 'nobel-chemistry-2024'],
            checkpoint: {
              id: 'check-alphafold',
              prompt: 'Which specific 2024 Nobel Prize recognized the AlphaFold protein-folding work, and who received it?',
              choices: [
                'The Nobel Prize in Physics, to David Baker',
                'The Nobel Prize in Chemistry, half jointly to Demis Hassabis and John Jumper',
                'The Nobel Peace Prize, to Google DeepMind as a company',
              ],
              correctIndex: 1,
              explanation: 'The 2024 Chemistry prize was split: half to Hassabis and Jumper for AlphaFold’s protein structure prediction, half separately to David Baker.',
              sourceId: 'nobel-chemistry-2024',
            },
          },
          {
            id: 'transportation',
            heading: 'AI in Transportation',
            paragraphs: [
              'Modern vehicles increasingly include AI-powered driver-assistance features: automatic braking, lane-keeping, and adaptive cruise control. Engineers describe vehicle autonomy using SAE International’s J3016 standard, six levels from Level 0 (no automation) up to Level 5 (no human driver needed under any condition). Level 2, sustained, simultaneous steering and speed assistance with the driver still fully responsible and attentive, is the most advanced automation widely available on new consumer vehicles today; standalone automatic emergency braking is Level 0, and cruise control or lane-centering alone is Level 1.',
              'Fully driverless systems (Level 4 or 5) exist in limited, carefully mapped conditions in a handful of cities, run as robotaxi services rather than personal vehicles. A small number of Level 3 systems, which allow a driver to disengage from monitoring the road under specific limited conditions, have been certified for consumer sale in the U.S. as of 2023, but only on certain vehicles and only up to about 40 mph on qualifying highways. It’s worth being skeptical of marketing language like "full self-driving" and checking what SAE level is actually being described: U.S. federal guidance on automated driving systems applies specifically to Levels 3 through 5.',
            ],
            sourceIds: ['sae-j3016-2021', 'nhtsa-ads'],
            checkpoint: {
              id: 'check-levels',
              prompt: 'What is the most advanced level of automation widely available on new consumer vehicles today?',
              choices: [
                'Level 5: fully driverless in all conditions',
                'Level 2: the car assists with steering and speed together, but a human must stay fully attentive',
                'Level 0: no automation of any kind exists yet',
              ],
              correctIndex: 1,
              explanation: 'Level 2 combines steering and speed assistance but still requires full driver attention: it is not self-driving.',
              sourceId: 'sae-j3016-2021',
            },
          },
          {
            id: 'finance-retail',
            heading: 'AI in Finance, Retail & Everyday Apps',
            paragraphs: [
              'Banks use AI to flag potentially fraudulent transactions in real time. Retailers use it to forecast demand and manage inventory. Streaming and shopping apps use recommendation systems, a form of AI, to decide what to show you next based on patterns in what similar users engaged with. Many lenders also use AI-assisted models to help evaluate credit applications.',
              'That last example connects directly back to this course’s bias lesson: credit-scoring models trained on historical lending data can inherit historical lending bias, which is why the U.S. Consumer Financial Protection Bureau issued guidance in 2023 requiring lenders to give specific, accurate reasons for credit denials even when a complex AI model made the decision, rather than treating an algorithmic decision as automatically fair just because a computer made it.',
            ],
            sourceIds: ['cfpb-circular-2023'],
          },
          {
            id: 'careers',
            heading: 'Careers Working With AI',
            paragraphs: [
              'Building and deploying AI responsibly takes more than machine learning engineers. Data scientists analyze and prepare the data models learn from, a role the U.S. Bureau of Labor Statistics projects growing significantly faster than average through 2034. AI ethicists and policy researchers study the societal effects and help write guidelines. Domain experts, doctors, teachers, lawyers, and journalists who also understand AI are increasingly valuable, because they can judge whether an AI tool’s output actually makes sense in their field.',
              'There’s no single required path into this space. People arrive from computer science, statistics, cognitive science, design, and philosophy alike. The Bureau of Labor Statistics also notes AI is expected to reduce demand in some other occupations, a healthy reminder that "learn to work with AI" matters as much as chasing any one job title. What nearly all of these roles share is a baseline of AI literacy, the kind this course is building, on top of a genuine expertise in something else.',
            ],
            sourceIds: ['bls-ai-employment-2026'],
          },
        ],
      },
      flashcards: {
        cards: [
          { term: 'AlphaFold', definition: 'A Google DeepMind AI system that predicts a protein’s 3D shape from its sequence, work recognized by half the 2024 Nobel Prize in Chemistry.', sourceId: 'nobel-chemistry-2024' },
          { term: 'Assistive AI', definition: 'AI that speeds up or flags things for a human expert, who remains responsible for the final decision: the common pattern in healthcare AI.' },
          { term: 'SAE J3016', definition: 'The standard defining six levels (0–5) of vehicle driving automation, from no automation to full automation.', sourceId: 'sae-j3016-2021' },
          { term: 'Level 2 Automation', definition: 'Sustained, simultaneous steering and speed assistance where the human driver must remain fully attentive: the most advanced automation widely available on new consumer cars today.', sourceId: 'sae-j3016-2021' },
          { term: 'Recommendation System', definition: 'AI that predicts what content or product you’ll want next, based on patterns from similar users.' },
          { term: 'Algorithmic Lending', definition: 'Using AI models to help evaluate credit applications, now regulated to require specific, accurate denial reasons.', sourceId: 'cfpb-circular-2023' },
          { term: 'Data Scientist', definition: 'A role analyzing and preparing the data that AI models learn from; projected by BLS to grow much faster than average through 2034.', sourceId: 'bls-ai-employment-2026' },
        ],
      },
      video: {
        title: 'AI Across Industries',
        embedUrl: null,
        description: 'Real examples of AI in healthcare, transportation, and finance: and the careers behind building it responsibly.',
      },
      game: {
        prompt: 'Sort each vehicle feature by its SAE automation level.',
        buckets: ['Level 0', 'Level 1', 'Level 2', 'Level 3–5'],
        blastTarget: 'Level 2',
        cards: [
          { id: 'g1', text: 'Automatic emergency braking that only intervenes momentarily', bucket: 'Level 0', why: 'Momentary intervention alone counts as no sustained automation: Level 0.', sourceId: 'sae-j3016-2021' },
          { id: 'g2', text: 'Adaptive cruise control alone, driver still steers', bucket: 'Level 1', why: 'A single assistance feature (speed OR steering) is Level 1.', sourceId: 'sae-j3016-2021' },
          { id: 'g3', text: 'Lane-centering alone, driver still controls speed', bucket: 'Level 1', why: 'A single assistance feature (speed OR steering) is Level 1.', sourceId: 'sae-j3016-2021' },
          { id: 'g4', text: 'Car steers and controls speed together, driver must still watch the road', bucket: 'Level 2', why: 'Simultaneous steering + speed control with a required attentive driver is Level 2.', sourceId: 'sae-j3016-2021' },
          { id: 'g5', text: 'A certified system letting the driver stop monitoring the road under specific limited highway conditions', bucket: 'Level 3–5', why: 'Not requiring the driver to monitor the road (even in limited conditions) crosses into conditional automation, Level 3.', sourceId: 'sae-j3016-2021' },
          { id: 'g6', text: 'A robotaxi with no driver at all, operating in a mapped city zone', bucket: 'Level 3–5', why: 'No human driver needed at all, even in limited conditions, is Level 4.', sourceId: 'sae-j3016-2021' },
        ],
      },
      quiz: {
        passingScore: 0.8,
        questions: [
          {
            id: 'q1',
            prompt: 'What does AlphaFold do?',
            choices: ['Predicts a protein’s 3D shape from its amino acid sequence', 'Diagnoses diseases directly', 'Drives cars autonomously'],
            correctIndex: 0,
            explanation: 'AlphaFold solved a decades-old structural biology problem, described in a 2021 Nature paper.',
            sourceId: 'alphafold-nature-2021',
          },
          {
            id: 'q2',
            prompt: 'Which 2024 Nobel Prize recognized AlphaFold, and who specifically received that half?',
            choices: ['Physics, to Hopfield and Hinton', 'Chemistry, jointly to Hassabis and Jumper', 'Medicine, to Baker'],
            correctIndex: 1,
            explanation: 'This is the Chemistry prize; the Physics prize that same year was a separate award for neural-network foundations.',
            sourceId: 'nobel-chemistry-2024',
          },
          {
            id: 'q3',
            prompt: 'In healthcare AI, what is the common pattern researchers describe?',
            choices: ['AI fully replaces doctors', 'AI is assistive: it speeds up or flags things, but a human expert makes the final call', 'AI is never used in medicine'],
            correctIndex: 1,
            explanation: 'Across radiology, drug discovery, and triage, AI assists a professional who remains responsible.',
          },
          {
            id: 'q4',
            prompt: 'What automation level is standalone adaptive cruise control (without lane-centering)?',
            choices: ['Level 0', 'Level 1', 'Level 5'],
            correctIndex: 1,
            explanation: 'A single assistance feature, either speed or steering alone, is Level 1 under SAE J3016.',
            sourceId: 'sae-j3016-2021',
          },
          {
            id: 'q5',
            prompt: 'What is the most advanced automation level widely available on new consumer vehicles today?',
            choices: ['Level 5', 'Level 2', 'Level 4'],
            correctIndex: 1,
            explanation: 'Level 2 combines steering and speed control but still requires full driver attention.',
            sourceId: 'sae-j3016-2021',
          },
          {
            id: 'q6',
            prompt: 'Why did the CFPB issue guidance on AI-assisted lending decisions in 2023?',
            choices: [
              'To ban AI from banking entirely',
              'To require lenders give specific, accurate denial reasons even when an AI model made the call',
              'To require all loans be approved automatically',
            ],
            correctIndex: 1,
            explanation: 'This guidance directly addresses the risk that algorithmic lending can inherit historical bias.',
            sourceId: 'cfpb-circular-2023',
          },
          {
            id: 'q7',
            prompt: 'According to the Bureau of Labor Statistics, what is projected for data scientist jobs through 2034?',
            choices: ['Decline sharply', 'Grow significantly faster than average', 'Stay exactly flat'],
            correctIndex: 1,
            explanation: 'BLS projects data scientist employment to grow much faster than the average occupation.',
            sourceId: 'bls-ai-employment-2026',
          },
          {
            id: 'q8',
            prompt: 'What did BLS also note alongside AI-driven job growth?',
            choices: [
              'AI is expected to reduce demand in some other occupations',
              'AI has no effect on any job market anywhere',
              'All jobs will be automated by 2030',
            ],
            correctIndex: 0,
            explanation: 'AI’s labor market effects are uneven: growth in some roles, reduced demand in others.',
            sourceId: 'bls-ai-employment-2026',
          },
        ],
      },
    },
  },

  // ── 5. AI & Creativity ────────────────────────────────────────────────
  {
    id: 'creativity',
    title: 'AI & Creativity',
    tagline: 'Human-AI collaboration in art, music, and writing',
    description:
      'Explore how generative image, music, and writing tools actually work under the hood, and the open questions around ownership and originality in creative work.',
    icon: 'palette',
    steps: {
      article: {
        sections: [
          {
            id: 'image-generators',
            heading: 'How Image Generators Work',
            paragraphs: [
              'Most modern AI image generators use a technique called diffusion, described in a 2020 paper on "denoising diffusion probabilistic models." During training, the model is shown images that have had random noise gradually added to them, and it learns to reverse that process, predicting how to remove the noise step by step. A 2021 follow-up technique, latent diffusion, made this practical to run efficiently and added text-prompt guidance at each denoising step. Once trained on millions of image-caption pairs, the model can start from pure random noise and gradually "denoise" it into a brand new image, guided at each step by your text prompt.',
              'This means an AI image generator isn’t copying and pasting pieces of existing pictures. It’s generating new pixel patterns based on statistical relationships it learned across a huge dataset of images. That’s also why these tools can struggle with things that need precise structure, like hands or text within an image: they’re working from learned patterns, not a literal understanding of anatomy or spelling.',
            ],
            sourceIds: ['ddpm-2020', 'latent-diffusion-2021'],
            checkpoint: {
              id: 'check-diffusion',
              prompt: 'When an AI image generator creates a new picture, what is it actually doing?',
              choices: [
                'Copying and pasting pieces of existing images from its training data',
                'Starting from random noise and gradually removing it based on learned patterns, guided by your prompt',
                'Searching the internet in real time for a matching photo',
              ],
              correctIndex: 1,
              explanation: 'Diffusion models learn to reverse a noise-adding process, generating genuinely new pixel patterns rather than copying source images.',
              sourceId: 'ddpm-2020',
            },
          },
          {
            id: 'music-writing',
            heading: 'AI in Music & Writing',
            paragraphs: [
              'AI music tools can generate an original melody, backing track, or full song from a text description or a hummed idea. AI writing tools can draft dialogue, poetry, or story outlines in a requested style. In both cases, the underlying idea is similar to image generation: the model has learned statistical patterns from a huge amount of existing music or text, and generates new output that follows those patterns.',
              'These tools are increasingly used by working musicians and writers as part of a larger process, not as a finished product on their own. A common workflow is using AI output as raw material, a rough melody, a first-draft scene, that a human then reshapes, edits, and takes ownership of.',
            ],
          },
          {
            id: 'human-ai-collab',
            heading: 'Human-AI Creative Collaboration',
            paragraphs: [
              'The strongest creative uses of AI tend to treat it as a collaborator for exploration, not a replacement for a finished creative vision. A visual artist might generate a dozen quick mood-board images to find a direction before painting the real piece by hand. A songwriter might generate several chord progressions to jam over, keeping only the one that sparks an idea. A student might use AI to draft three very different opening paragraphs for an essay, purely to see which angle feels strongest, then write the real one themselves.',
              'In every case, the human’s judgment, taste, and final editing are what turn raw AI output into something worth calling finished. That’s also the difference between using AI as a creative tool and letting AI make the creative decisions for you, which connects directly back to the academic integrity lesson in this course’s ethics module.',
            ],
          },
          {
            id: 'ownership-copyright',
            heading: 'Ownership, Originality & Copyright',
            paragraphs: [
              'Many generative AI models were trained on large collections of images, music, and text scraped from the internet, often including copyrighted work, without explicit permission from the original creators. Whether that training process itself infringes copyright is an actively contested legal question, and the U.S. Copyright Office’s own analysis on this specific point was, as of its most recent report, still pre-publication.',
              'A separate question is who owns the output an AI tool creates for you, and this one has a clearer answer. In a January 2025 report, the U.S. Copyright Office concluded that material generated purely from prompts, without a human determining sufficient expressive elements, is not copyrightable; work where a human meaningfully shaped the expressive result can be protected, assessed case by case. A federal appeals court reached the same conclusion in March 2025, ruling that human authorship is required as a matter of statutory law. For school or competition work, the safest approach is to check the specific rules that apply to your assignment or event, disclose AI use where required, and make sure the creative decisions that matter are genuinely yours.',
            ],
            sourceIds: ['copyright-office-part2-2025', 'thaler-v-perlmutter-2025', 'copyright-office-part3-2025'],
            checkpoint: {
              id: 'check-copyright',
              prompt: 'According to the U.S. Copyright Office’s 2025 report, is purely prompt-generated AI output copyrightable?',
              choices: [
                'Yes, always, automatically',
                'No, unless a human determined sufficient expressive elements of the final work',
                'Only if you pay for the AI tool',
              ],
              correctIndex: 1,
              explanation: 'The Office found prompts alone don’t give a user enough control over expressive elements; meaningful human shaping is required, assessed case by case.',
              sourceId: 'copyright-office-part2-2025',
            },
          },
        ],
      },
      flashcards: {
        cards: [
          { term: 'Diffusion Model', definition: 'An AI technique that generates images by learning to reverse a noise-adding process, starting from random noise and denoising toward a target guided by a prompt.', sourceId: 'ddpm-2020' },
          { term: 'Latent Diffusion', definition: 'A 2021 technique making diffusion image generation efficient and enabling text-prompt guidance at each step: the basis of most modern text-to-image tools.', sourceId: 'latent-diffusion-2021' },
          { term: 'Human-AI Collaboration', definition: 'Using AI as a tool for exploration (mood boards, rough drafts, chord progressions) while human judgment shapes the finished creative work.' },
          { term: 'Training Data (Creative AI)', definition: 'The large collections of existing images, music, and text a generative model learns statistical patterns from: often scraped from the internet, sometimes including copyrighted work.' },
          { term: 'Copyrightability', definition: 'Whether a work qualifies for copyright protection; per the U.S. Copyright Office, purely prompt-generated AI output does not, but human-shaped output can.', sourceId: 'copyright-office-part2-2025' },
          { term: 'Human Authorship Requirement', definition: 'The legal principle, confirmed by a 2025 federal appeals court ruling, that copyright protection requires a human author.', sourceId: 'thaler-v-perlmutter-2025' },
        ],
      },
      video: {
        title: 'How Generative Art Actually Works',
        embedUrl: null,
        description: 'A visual explanation of diffusion models and the current legal landscape around AI-generated creative work.',
      },
      game: {
        prompt: 'Sort each scenario: is the resulting work Copyrightable or Not copyrightable, per the U.S. Copyright Office’s 2025 guidance?',
        buckets: ['Copyrightable', 'Not copyrightable'],
        blastTarget: 'Copyrightable',
        cards: [
          { id: 'g1', text: 'A single text prompt fed to an image generator, output used as-is', bucket: 'Not copyrightable', why: 'A prompt alone doesn’t give sufficient control over expressive elements.', sourceId: 'copyright-office-part2-2025' },
          { id: 'g2', text: 'An artist generates 20 AI images, then selects, arranges, and heavily edits elements into a new composition', bucket: 'Copyrightable', why: 'Meaningful human creative selection and modification can qualify for protection.', sourceId: 'copyright-office-part2-2025' },
          { id: 'g3', text: 'A photo entirely generated by an AI system with no human prompt or editing at all', bucket: 'Not copyrightable', why: 'No human authorship at any stage: confirmed non-copyrightable by a 2025 federal appeals court.', sourceId: 'thaler-v-perlmutter-2025' },
          { id: 'g4', text: 'A songwriter uses AI to generate a rough chord progression, then writes original lyrics and melody around it', bucket: 'Copyrightable', why: 'The human-authored lyrics and melody are original creative expression.', sourceId: 'copyright-office-part2-2025' },
          { id: 'g5', text: 'A student submits an unedited AI-written poem from a single prompt', bucket: 'Not copyrightable', why: 'Purely prompt-generated output without human-shaped expression isn’t copyrightable.', sourceId: 'copyright-office-part2-2025' },
        ],
      },
      quiz: {
        passingScore: 0.8,
        questions: [
          {
            id: 'q1',
            prompt: 'What technique do most modern AI image generators use?',
            choices: ['Diffusion: learning to reverse a noise-adding process', 'Simple copy-paste of training images', 'Random pixel generation with no learning'],
            correctIndex: 0,
            explanation: 'Diffusion models learn to denoise step by step, guided by a prompt.',
            sourceId: 'ddpm-2020',
          },
          {
            id: 'q2',
            prompt: 'Why do AI image generators often struggle with hands or text within images?',
            choices: [
              'They intentionally avoid drawing them',
              'They work from learned statistical patterns, not a literal understanding of anatomy or spelling',
              'It’s a hardware limitation only',
            ],
            correctIndex: 1,
            explanation: 'The model has no literal concept of anatomy or language: only learned visual patterns.',
            sourceId: 'ddpm-2020',
          },
          {
            id: 'q3',
            prompt: 'What did the 2021 latent diffusion technique add?',
            choices: ['Made diffusion image generation efficient and enabled text-prompt guidance', 'Invented the first neural network', 'Removed the need for training data'],
            correctIndex: 0,
            explanation: 'Latent diffusion is the technical basis of most modern text-to-image tools.',
            sourceId: 'latent-diffusion-2021',
          },
          {
            id: 'q4',
            prompt: 'What is the strongest pattern for human-AI creative collaboration, per this module?',
            choices: [
              'Letting AI make all final creative decisions',
              'Using AI for exploration (drafts, mood boards) while a human shapes the finished work',
              'Never using AI for anything creative',
            ],
            correctIndex: 1,
            explanation: 'AI as a sketchpad for exploration, with human judgment finishing the work, is the pattern that holds up.',
          },
          {
            id: 'q5',
            prompt: 'Per the U.S. Copyright Office’s January 2025 report, is output from a single text prompt alone copyrightable?',
            choices: ['Yes, automatically', 'No, a prompt alone doesn’t give sufficient control over expressive elements', 'Only for images, not text'],
            correctIndex: 1,
            explanation: 'The Office requires a human to have determined sufficient expressive elements for protection to apply.',
            sourceId: 'copyright-office-part2-2025',
          },
          {
            id: 'q6',
            prompt: 'What did the March 2025 Thaler v. Perlmutter ruling confirm?',
            choices: [
              'AI companies own all AI-generated content',
              'Human authorship is legally required for copyright protection',
              'AI-generated work is always copyrightable',
            ],
            correctIndex: 1,
            explanation: 'A federal appeals court confirmed this as a matter of statutory law.',
            sourceId: 'thaler-v-perlmutter-2025',
          },
          {
            id: 'q7',
            prompt: 'Is whether AI training on copyrighted material itself infringes copyright a settled question?',
            choices: [
              'Yes, fully settled by law',
              'No, it’s an actively contested legal question, still being analyzed as of the Copyright Office’s most recent pre-publication report',
              'It was settled in the 1990s',
            ],
            correctIndex: 1,
            explanation: 'This is distinct from the output-ownership question, and remains genuinely unresolved.',
            sourceId: 'copyright-office-part3-2025',
          },
          {
            id: 'q8',
            prompt: 'For school or competition work involving AI-assisted creative output, what’s the safest approach?',
            choices: [
              'Assume it’s always fine',
              'Check the specific rules, disclose AI use where required, and make sure the meaningful creative decisions are genuinely yours',
              'Never disclose AI use under any circumstances',
            ],
            correctIndex: 1,
            explanation: 'This mirrors both the legal guidance and the academic-integrity principles from earlier in the course.',
          },
        ],
      },
    },
  },

  // ── 6. The Future of AI ────────────────────────────────────────────────
  {
    id: 'future',
    title: 'The Future of AI',
    tagline: 'Where the technology is headed, and how to stay literate',
    description:
      'AI is evolving quickly. This module covers current research directions, the debate around more general AI systems, AI safety, and how to keep learning as the field changes.',
    icon: 'rocket',
    steps: {
      article: {
        sections: [
          {
            id: 'research-directions',
            heading: 'Current Research Directions',
            paragraphs: [
              'A few broad directions currently drive a lot of AI research. Multimodal AI combines text, images, audio, and video into a single system that can reason across all of them together, instead of handling each separately. AI agents extend a model beyond just answering questions, letting it take multi-step actions, like browsing, running code, or using other software tools, to complete a task. On-device AI focuses on making smaller, more efficient models that can run directly on a phone or laptop rather than a remote data center, which can improve speed and privacy.',
              'None of these directions are finished or fully solved; they’re active, ongoing research areas covered in detail by Stanford’s annual AI Index Report, which is part of why the specific capabilities of AI tools keep changing from year to year.',
            ],
            sourceIds: ['stanford-hai-ai-index-2026'],
          },
          {
            id: 'agi-debate',
            heading: 'The AGI Debate',
            paragraphs: [
              'Artificial general intelligence, or AGI, refers to a hypothetical AI system with broad, flexible, human-level reasoning across arbitrary tasks, not the narrow, single-purpose AI covered in this course’s first module. Whether, when, or even if something like that will exist is genuinely disputed among AI researchers. A 2025 AAAI panel of 25 leading researchers, drawing on a survey of 475 AI researchers, found that 76% believed scaling up current approaches alone is unlikely to yield AGI, while views on alternative paths and timelines varied widely.',
              'When you see confident predictions about AGI in the news or on social media, in either direction, it’s worth treating them as one researcher’s (or one survey’s) view on a genuinely open question, not an established fact.',
            ],
            sourceIds: ['aaai-presidential-panel-2025'],
            checkpoint: {
              id: 'check-agi',
              prompt: 'According to a 2025 AAAI survey of 475 AI researchers, what did 76% believe about reaching AGI by scaling current approaches?',
              choices: [
                'It will definitely happen within 2 years',
                'Scaling up current approaches alone is unlikely to yield AGI',
                'AGI was already achieved',
              ],
              correctIndex: 1,
              explanation: 'This is a documented survey result, not consensus that AGI is impossible: researchers disagree widely on alternative paths and timelines.',
              sourceId: 'aaai-presidential-panel-2025',
            },
          },
          {
            id: 'ai-safety',
            heading: 'AI Safety & Alignment, Briefly',
            paragraphs: [
              'AI alignment research focuses on a deceptively simple-sounding problem: making sure an AI system actually does what we intend, not just what we literally specified. Real systems show smaller versions of this problem constantly: a recommendation algorithm optimized purely for "time spent watching" can end up promoting content that’s addictive rather than valuable, because that’s what it was actually measured on.',
              'AI safety and alignment is a serious, active field of research, formalized internationally through documents like the International AI Safety Report, an ongoing project chaired by AI researcher Yoshua Bengio with contributors nominated by dozens of countries plus the UN, EU, and OECD. It sits squarely under the "Societal Impact" big idea from this course’s first module: the reminder that how a system is built and measured has real downstream effects.',
            ],
            sourceIds: ['intl-ai-safety-report-2026'],
          },
          {
            id: 'staying-literate',
            heading: 'Staying AI-Literate as Things Change',
            paragraphs: [
              'The specific tools covered in this course will keep changing; new models and products are released constantly, and government policy is actively evolving too, for instance the European Union’s AI Act, which took effect in phases starting in 2024, creates a risk-based tiering of AI systems rather than treating all AI the same way. What doesn’t go stale as quickly are the underlying habits: verifying claims instead of trusting confident tone, checking who benefits and who might be harmed by a given use of AI, and understanding roughly how these systems work well enough to reason about a new tool you’ve never seen before.',
              'A good habit going forward is to follow credible, technically grounded sources, like the ones cited throughout this course, rather than hype-driven headlines in either direction, and to periodically revisit what you think you know about AI, since it’s a field that genuinely moves fast. Treat everything in this course as a foundation to build on, not a final answer.',
            ],
            sourceIds: ['eu-ai-act-2024'],
          },
        ],
      },
      flashcards: {
        cards: [
          { term: 'Multimodal AI', definition: 'AI that combines text, images, audio, and video into a single system reasoning across all of them together.' },
          { term: 'AI Agent', definition: 'An AI system that takes multi-step actions (browsing, running code, using tools) to complete a task, beyond just answering questions.' },
          { term: 'On-Device AI', definition: 'Smaller, efficient AI models that run directly on a phone or laptop instead of a remote data center, improving speed and privacy.' },
          { term: 'AGI (Artificial General Intelligence)', definition: 'A hypothetical AI system with broad, flexible, human-level reasoning across any task. Whether/when it might exist is genuinely disputed.', sourceId: 'aaai-presidential-panel-2025' },
          { term: 'AI Alignment', definition: 'Research into making sure an AI system does what we actually intend, not just what was literally specified.' },
          { term: 'International AI Safety Report', definition: 'An ongoing, internationally chaired expert report on AI safety and risk, contributed to by dozens of countries plus the UN, EU, and OECD.', sourceId: 'intl-ai-safety-report-2026' },
          { term: 'EU AI Act', definition: 'European Union legislation, in effect since 2024, that regulates AI systems using a risk-based tiering system.', sourceId: 'eu-ai-act-2024' },
        ],
      },
      video: {
        title: 'Where AI Is Headed',
        embedUrl: null,
        description: 'Current research frontiers, the AGI debate among experts, and why AI safety is a serious, active research field.',
      },
      game: {
        prompt: 'Sort each statement: is it a Sourced claim or Hype / unverified?',
        buckets: ['Sourced claim', 'Hype / unverified'],
        blastTarget: 'Sourced claim',
        cards: [
          { id: 'g1', text: '"76% of surveyed AI researchers doubt scaling alone will reach AGI" (AAAI 2025 survey of 475 researchers)', bucket: 'Sourced claim', why: 'This is a specific, documented survey result with a named source.', sourceId: 'aaai-presidential-panel-2025' },
          { id: 'g2', text: '"AGI will definitely arrive next year"', bucket: 'Hype / unverified', why: 'No credible source makes AGI timeline predictions with certainty: it’s a genuinely disputed question.', sourceId: 'aaai-presidential-panel-2025' },
          { id: 'g3', text: '"The EU AI Act uses a risk-based tiering system, in effect since 2024"', bucket: 'Sourced claim', why: 'This is verifiable, published legislation.', sourceId: 'eu-ai-act-2024' },
          { id: 'g4', text: '"This new AI model is basically conscious"', bucket: 'Hype / unverified', why: 'No current AI system has been credibly demonstrated to have consciousness; this is an unsupported claim.' },
          { id: 'g5', text: '"AI safety research is coordinated internationally by 30+ countries, the UN, EU, and OECD"', bucket: 'Sourced claim', why: 'This describes the actual structure of the International AI Safety Report.', sourceId: 'intl-ai-safety-report-2026' },
          { id: 'g6', text: '"This app will replace all teachers within a year"', bucket: 'Hype / unverified', why: 'A sweeping, unsourced prediction with no cited evidence.' },
        ],
      },
      quiz: {
        passingScore: 0.8,
        questions: [
          {
            id: 'q1',
            prompt: 'What is multimodal AI?',
            choices: ['AI that only works with text', 'AI that reasons across text, images, audio, and video together', 'AI that runs exclusively on phones'],
            correctIndex: 1,
            explanation: 'Multimodal systems combine multiple types of input/output into one reasoning system.',
          },
          {
            id: 'q2',
            prompt: 'What distinguishes an "AI agent" from a basic chatbot?',
            choices: [
              'Agents take multi-step actions (browsing, running code, using tools) to complete tasks',
              'Agents are always smaller than chatbots',
              'There is no real difference',
            ],
            correctIndex: 0,
            explanation: 'Agents extend beyond answering questions into taking actions toward a goal.',
          },
          {
            id: 'q3',
            prompt: 'What did a 2025 AAAI survey of 475 AI researchers find about reaching AGI by scaling current approaches?',
            choices: ['100% agreed it would happen soon', '76% believed scaling alone is unlikely to yield AGI', 'The survey found no disagreement at all'],
            correctIndex: 1,
            explanation: 'This is a specific documented finding, not a consensus that AGI is impossible by any method.',
            sourceId: 'aaai-presidential-panel-2025',
          },
          {
            id: 'q4',
            prompt: 'How should you treat confident AGI predictions in the news?',
            choices: [
              'As settled scientific fact',
              'As one researcher’s opinion on a genuinely open, disputed question',
              'As always false',
            ],
            correctIndex: 1,
            explanation: 'Experts genuinely disagree on AGI timelines and even whether current approaches can get there.',
            sourceId: 'aaai-presidential-panel-2025',
          },
          {
            id: 'q5',
            prompt: 'What problem does AI alignment research address?',
            choices: [
              'Making AI systems run faster',
              'Making sure an AI system does what we actually intend, not just what was literally specified',
              'Making AI systems cheaper to build',
            ],
            correctIndex: 1,
            explanation: 'A recommendation algorithm optimized purely for watch-time is a real, current example of misalignment.',
          },
          {
            id: 'q6',
            prompt: 'What is the International AI Safety Report?',
            choices: [
              'A single company’s internal memo',
              'An internationally chaired expert report on AI safety, with contributors from dozens of countries plus the UN, EU, and OECD',
              'A work of speculative fiction',
            ],
            correctIndex: 1,
            explanation: 'It reflects a broad, formal international effort, not a fringe or single-source document.',
            sourceId: 'intl-ai-safety-report-2026',
          },
          {
            id: 'q7',
            prompt: 'What does the EU AI Act do?',
            choices: [
              'Bans all AI in the European Union',
              'Regulates AI systems using a risk-based tiering system',
              'Only applies to social media companies',
            ],
            correctIndex: 1,
            explanation: 'The Act tiers AI systems by risk level rather than treating all AI identically.',
            sourceId: 'eu-ai-act-2024',
          },
          {
            id: 'q8',
            prompt: 'What is the best long-term habit for staying AI-literate as tools keep changing?',
            choices: [
              'Memorize every current tool’s exact capabilities',
              'Follow credible, technically grounded sources and keep verifying claims rather than trusting hype',
              'Stop learning about AI once you finish this course',
            ],
            correctIndex: 1,
            explanation: 'Specific tools go stale fast; the underlying verification habits this course teaches don’t.',
          },
        ],
      },
    },
  },
];

export function getModule(moduleId: string) {
  return MODULES.find((m) => m.id === moduleId);
}

export function getAllStepIds() {
  return MODULES.flatMap((m) => STEP_ORDER.map((s) => stepId(m.id, s)));
}
