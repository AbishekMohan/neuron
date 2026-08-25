// A filterable comparison of AI tools students are likely to actually
// encounter. Deliberately qualitative rather than precise prices or
// feature lists — those change often enough that hardcoding numbers here
// would go stale and potentially mislead, which matters more than usual
// on a site whose whole premise is "verify AI claims before trusting
// them." Verify current pricing/features directly with each tool.

export type ToolCategory = 'Writing & Research' | 'Coding' | 'Image & Design' | 'Tutoring & Study' | 'General Chat';
export type CostTier = 'Free' | 'Freemium' | 'Paid';

export type AiTool = {
  name: string;
  category: ToolCategory;
  cost: CostTier;
  useCase: string;
  schoolNote: string;
};

export const AI_TOOLS: AiTool[] = [
  {
    name: 'ChatGPT',
    category: 'General Chat',
    cost: 'Freemium',
    useCase: 'General-purpose conversation, explanation, and drafting.',
    schoolNote: 'Widely restricted for submitting final work directly; commonly allowed for brainstorming or explanation when disclosed.',
  },
  {
    name: 'Google Gemini',
    category: 'General Chat',
    cost: 'Freemium',
    useCase: 'General-purpose conversation, integrated with Google Workspace.',
    schoolNote: 'Same academic-integrity considerations as any general chatbot — check your school/teacher\'s specific policy.',
  },
  {
    name: 'Grammarly',
    category: 'Writing & Research',
    cost: 'Freemium',
    useCase: 'Grammar, spelling, and tone suggestions on writing you\'ve already drafted.',
    schoolNote: 'Editing assistance on your own writing is broadly accepted, similar to a spell-checker.',
  },
  {
    name: 'QuillBot',
    category: 'Writing & Research',
    cost: 'Freemium',
    useCase: 'Paraphrasing and rewriting existing text.',
    schoolNote: 'Paraphrasing someone else\'s (or an AI\'s) work to disguise its origin crosses into the same territory as submitting AI-generated work as your own.',
  },
  {
    name: 'Khanmigo',
    category: 'Tutoring & Study',
    cost: 'Freemium',
    useCase: 'Guided tutoring that asks questions back rather than giving direct answers.',
    schoolNote: 'Built specifically around the "assistance, not answers" model this course teaches.',
  },
  {
    name: 'GitHub Copilot',
    category: 'Coding',
    cost: 'Paid',
    useCase: 'Code suggestions and autocompletion inside a code editor.',
    schoolNote: 'Fine for personal projects; check your specific course\'s policy before using it on graded coding assignments.',
  },
  {
    name: 'Canva AI (Magic Studio)',
    category: 'Image & Design',
    cost: 'Freemium',
    useCase: 'AI-assisted image generation and design editing inside Canva.',
    schoolNote: 'If an assignment requires original artwork, using AI-generated images without disclosure is the same issue as undisclosed AI text.',
  },
  {
    name: 'Turnitin AI Detection',
    category: 'Writing & Research',
    cost: 'Paid',
    useCase: "A teacher-side tool that estimates whether submitted writing was AI-generated.",
    schoolNote: 'AI-detection tools are known to be imperfect (false positives happen) — a flag is a conversation starter, not automatic proof.',
  },
];

export const TOOL_CATEGORIES: ToolCategory[] = ['General Chat', 'Writing & Research', 'Coding', 'Image & Design', 'Tutoring & Study'];
export const COST_TIERS: CostTier[] = ['Free', 'Freemium', 'Paid'];
