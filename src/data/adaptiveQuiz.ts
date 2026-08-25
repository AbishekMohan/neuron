export type Difficulty = 'easy' | 'medium' | 'hard';

export const DIFFICULTY_ORDER: Difficulty[] = ['easy', 'medium', 'hard'];
export const DIFFICULTY_LABELS: Record<Difficulty, string> = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };

export type AdaptiveQuestion = {
  id: string;
  difficulty: Difficulty;
  question: string;
  choices: string[];
  correctIndex: number;
};

export const ADAPTIVE_QUESTIONS: AdaptiveQuestion[] = [
  {
    id: 'e1',
    difficulty: 'easy',
    question: "What does 'AI' stand for?",
    choices: ['Artificial Intelligence', 'Automated Internet', 'Artificial Interface', 'Advanced Integration'],
    correctIndex: 0,
  },
  {
    id: 'e2',
    difficulty: 'easy',
    question: 'Which of these is an example of generative AI?',
    choices: ['A thermostat', 'A chatbot that writes essays', 'A basic calculator', 'A spell-checker that only flags typos'],
    correctIndex: 1,
  },
  {
    id: 'e3',
    difficulty: 'easy',
    question: 'What is "training data"?',
    choices: ["The app's user manual", 'The examples a model learns from', "The company's revenue", "The app's icon"],
    correctIndex: 1,
  },
  {
    id: 'e4',
    difficulty: 'easy',
    question: 'What is a "prompt"?',
    choices: ["The AI's confidence score", "A bug in the AI's code", 'The instruction or question given to an AI', "The AI's user interface"],
    correctIndex: 2,
  },
  {
    id: 'm1',
    difficulty: 'medium',
    question: 'What is a "hallucination" in AI?',
    choices: ['A rendering glitch', 'Confident but false or made-up output', 'A crash', 'A slow response'],
    correctIndex: 1,
  },
  {
    id: 'm2',
    difficulty: 'medium',
    question: 'Why might an AI chatbot give biased answers?',
    choices: ['It learned patterns present in its training data', "It's malfunctioning", 'A hardware fault', 'Purely at random, with no cause'],
    correctIndex: 0,
  },
  {
    id: 'm3',
    difficulty: 'medium',
    question: "What's the real difference between narrow AI and general AI (AGI)?",
    choices: ['Narrow AI is older; AGI is newer', 'They are the same thing', 'Narrow AI does one task well; AGI (hypothetical) would reason across any domain', 'Narrow AI is free; AGI is paid'],
    correctIndex: 2,
  },
  {
    id: 'm4',
    difficulty: 'medium',
    question: 'What does a "held-out test set" measure?',
    choices: ['How much the model costs', "How well a model performs on examples it never trained on", 'How fast the model runs', 'How big the model is'],
    correctIndex: 1,
  },
  {
    id: 'h1',
    difficulty: 'hard',
    question: 'A model trains mostly on formal written English. What\'s the most likely effect on casual, spoken-style text?',
    choices: ['No effect at all', 'It performs better on casual text', 'It refuses to respond to casual text', 'It likely performs worse, since that style is underrepresented in training'],
    correctIndex: 3,
  },
  {
    id: 'h2',
    difficulty: 'hard',
    question: 'A company claims their AI is "99% accurate" with no other detail. What\'s the most important follow-up question?',
    choices: ['How much does it cost?', 'What color is the logo?', 'Accurate on what test set, measured how?', 'How fast is it?'],
    correctIndex: 2,
  },
  {
    id: 'h3',
    difficulty: 'hard',
    question: 'Why can a genuinely well-trained model still be dangerous if it\'s presented as more capable than it actually is?',
    choices: ['Well-trained models are never dangerous', 'Cost is the only real risk with AI', 'Overclaiming leads people to trust its output beyond what it actually supports', "There's no such thing as overclaiming AI capability"],
    correctIndex: 2,
  },
  {
    id: 'h4',
    difficulty: 'hard',
    question: 'A classifier trained on labels a student assigned themselves starts performing worse than random guessing. What\'s the most likely explanation?',
    choices: ['The model became more advanced', 'This is impossible for a model to do', 'The student\'s labels were frequently wrong, and the model learned that pattern faithfully', 'The test set was too small to matter'],
    correctIndex: 2,
  },
];
