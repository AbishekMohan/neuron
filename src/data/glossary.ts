// Standard AI-literacy terminology, written to plain, accurate,
// textbook-level definitions rather than sourced course claims. Unlike
// module content (see data/sources.ts), individual dictionary-style term
// definitions aren't attributed to a single citation.

export type GlossaryTerm = {
  term: string;
  category: 'Fundamentals' | 'Machine Learning' | 'Generative AI' | 'Ethics & Fairness' | 'Using AI Well';
  definition: string;
};

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: 'Artificial Intelligence (AI)',
    category: 'Fundamentals',
    definition: 'Computer systems built to perform tasks that normally require human intelligence, such as recognizing images, understanding language, or making decisions.',
  },
  {
    term: 'Narrow AI',
    category: 'Fundamentals',
    definition: 'AI designed to do one specific task well (like playing chess or recognizing faces) without general reasoning ability. Every AI system in wide use today is narrow AI.',
  },
  {
    term: 'General AI (AGI)',
    category: 'Fundamentals',
    definition: 'A hypothetical AI with human-like reasoning across any domain, not just one task. AGI does not currently exist.',
  },
  {
    term: 'Algorithm',
    category: 'Fundamentals',
    definition: 'A step-by-step set of instructions for solving a problem or completing a task. The underlying recipe a program follows.',
  },
  {
    term: 'Machine Learning (ML)',
    category: 'Machine Learning',
    definition: 'A way of building AI where a system improves at a task by learning patterns from data, rather than being explicitly programmed with rules for every case.',
  },
  {
    term: 'Training Data',
    category: 'Machine Learning',
    definition: 'The examples a machine learning model learns from. The quality and diversity of training data directly shapes what the model can (and can’t) do well.',
  },
  {
    term: 'Neural Network',
    category: 'Machine Learning',
    definition: 'A machine learning model loosely inspired by connections between neurons in the brain. Layers of simple units whose connection strengths ("weights") are adjusted during training.',
  },
  {
    term: 'Weights',
    category: 'Machine Learning',
    definition: 'The numeric values inside a model that determine how much influence each input feature has on its output. Training is the process of adjusting these values.',
  },
  {
    term: 'Overfitting',
    category: 'Machine Learning',
    definition: 'When a model learns its training examples too specifically (including their noise and quirks) and performs worse on new, unseen examples as a result.',
  },
  {
    term: 'Held-out / Test Set',
    category: 'Machine Learning',
    definition: 'A set of examples kept separate from training and never learned from directly, used only to measure how well a model actually generalizes to new data.',
  },
  {
    term: 'Accuracy',
    category: 'Machine Learning',
    definition: 'The fraction of examples a model classifies correctly, typically measured on a held-out test set rather than the data it trained on.',
  },
  {
    term: 'Large Language Model (LLM)',
    category: 'Generative AI',
    definition: 'A type of generative AI trained on huge amounts of text to predict likely next words, enabling it to write, summarize, translate, and converse.',
  },
  {
    term: 'Generative AI',
    category: 'Generative AI',
    definition: 'AI systems that create new content. Text, images, audio, code. Rather than just classifying or predicting from fixed categories.',
  },
  {
    term: 'Prompt',
    category: 'Generative AI',
    definition: 'The instruction or question a person gives a generative AI system. Specific, well-scoped prompts reliably produce better output than vague ones.',
  },
  {
    term: 'Hallucination',
    category: 'Generative AI',
    definition: 'When an AI system generates confident-sounding output that is factually wrong or entirely made up, rather than admitting uncertainty.',
  },
  {
    term: 'Token',
    category: 'Generative AI',
    definition: 'A chunk of text (often a word or part of a word) that a language model processes as one unit. The basic building block it reads and generates.',
  },
  {
    term: 'Bias (in AI)',
    category: 'Ethics & Fairness',
    definition: 'Systematic, unfair skew in an AI system’s outputs, usually inherited from patterns (including stereotypes) present in its training data.',
  },
  {
    term: 'Fairness',
    category: 'Ethics & Fairness',
    definition: 'The goal of an AI system treating different individuals and groups equitably, rather than producing systematically better or worse outcomes for some.',
  },
  {
    term: 'Transparency',
    category: 'Ethics & Fairness',
    definition: 'How clearly an AI system’s capabilities, limitations, and decision process are disclosed to the people using or affected by it.',
  },
  {
    term: 'Academic Integrity (with AI)',
    category: 'Ethics & Fairness',
    definition: 'Using AI to support your own understanding and work (explaining concepts, checking drafts) rather than submitting AI-generated work as your own.',
  },
  {
    term: 'Confidence (of an AI output)',
    category: 'Using AI Well',
    definition: 'A model’s internal certainty about its own output. High confidence doesn’t guarantee correctness. A model can be confidently wrong.',
  },
  {
    term: 'AI Assistance vs. AI-Generated Work',
    category: 'Using AI Well',
    definition: 'The distinction between using AI to help you think through or check your own work (assistance) versus having AI produce the final work for you.',
  },
  {
    term: 'Fact-Checking AI Output',
    category: 'Using AI Well',
    definition: 'Verifying an AI-generated claim against an independent, reliable source before trusting or repeating it. Especially important given hallucination risk.',
  },
  {
    term: 'Human-in-the-Loop',
    category: 'Using AI Well',
    definition: 'A system design where a person reviews or approves an AI’s output before it takes effect, rather than the AI acting fully autonomously.',
  },
];

export const GLOSSARY_CATEGORIES = ['Fundamentals', 'Machine Learning', 'Generative AI', 'Ethics & Fairness', 'Using AI Well'] as const;
