// "The Deadline". A branching choose-your-own-adventure about AI use
// under academic pressure. Consequences land narratively (a flagged
// essay, an integrity office referral, a clean pass) rather than via a
// quiz, since that's the actual point of this format per the spec.

export type StoryChoice = { label: string; nextId: string };

export type StoryNode =
  | { id: string; kind: 'decision'; text: string; choices: StoryChoice[] }
  | { id: string; kind: 'ending'; text: string; outcome: 'good' | 'mixed' | 'bad'; lesson: string };

export const STORY_START_ID = 'start';

export const STORY_NODES: Record<string, StoryNode> = {
  start: {
    id: 'start',
    kind: 'decision',
    text: "It's 9 PM. Your essay on renewable energy is due tomorrow at 8 AM. You haven't started.",
    choices: [
      { label: 'Ask an AI to write the whole essay for you.', nextId: 'full-ai' },
      { label: 'Ask an AI to help you outline your ideas, then write it yourself.', nextId: 'outline-help' },
      { label: 'Message your teacher tonight and ask for an extension.', nextId: 'ask-extension' },
    ],
  },
  'full-ai': {
    id: 'full-ai',
    kind: 'decision',
    text: 'The AI writes a polished 800-word essay in seconds. You skim it, change a few words, and get ready to submit.',
    choices: [
      { label: 'Submit it as your own work.', nextId: 'caught' },
      { label: 'Actually. Email your teacher tonight, disclose the AI use, and ask what to do.', nextId: 'disclose-late' },
    ],
  },
  'outline-help': {
    id: 'outline-help',
    kind: 'decision',
    text: 'The AI helps you organize your three main points and suggests sources to look into. You spend the next two hours writing the essay yourself, using the outline as a guide.',
    choices: [
      { label: 'Submit the essay. It’s entirely your own writing.', nextId: 'good-work' },
      { label: 'You’re still stuck on the conclusion. Copy a few of the AI’s example sentences in unedited.', nextId: 'partial-copy' },
    ],
  },
  'ask-extension': {
    id: 'ask-extension',
    kind: 'decision',
    text: 'Your teacher grants you until Friday, no penalty. Because you asked before the deadline, not after.',
    choices: [
      { label: 'Use the extra time to actually write a solid essay.', nextId: 'extension-good' },
      { label: 'Put it off again and end up in the exact same spot Thursday night.', nextId: 'repeat-mistake' },
    ],
  },
  caught: {
    id: 'caught',
    kind: 'ending',
    outcome: 'bad',
    text: 'Your teacher runs an AI-detection check and flags the essay. You’re referred to the academic integrity office. A serious, entirely avoidable consequence for one decision made at 9 PM.',
    lesson: 'Submitting AI-generated work as your own, undisclosed, is the clearest line this course draws. And it\'s the one with the highest cost when crossed.',
  },
  'disclose-late': {
    id: 'disclose-late',
    kind: 'ending',
    outcome: 'mixed',
    text: 'Your teacher appreciates the honesty. There\'s no integrity violation since you disclosed before submitting. But the assignment required your own analysis, and this doesn\'t meet that, so it comes back for a real rewrite.',
    lesson: 'Disclosure prevents the worst outcome, but it doesn\'t retroactively make AI-generated work meet an assignment that required your own thinking.',
  },
  'good-work': {
    id: 'good-work',
    kind: 'ending',
    outcome: 'good',
    text: 'You submit an essay that\'s entirely your own thinking, sharpened by the AI\'s help organizing your ideas beforehand. Full credit, real learning, no risk.',
    lesson: 'This is the model the course teaches: AI assists the thinking, doesn\'t replace it.',
  },
  'partial-copy': {
    id: 'partial-copy',
    kind: 'ending',
    outcome: 'bad',
    text: 'Your teacher notices a few sentences don\'t match your usual writing voice and asks about it directly. Even though most of the essay is genuinely yours, the unedited lifted sentences count as a violation.',
    lesson: 'Partial copying is still copying. "Mostly my own work" doesn\'t protect the sentences that aren\'t.',
  },
  'extension-good': {
    id: 'extension-good',
    kind: 'ending',
    outcome: 'good',
    text: 'You turn in a strong essay Friday. No penalty, no risk, and you\'ve learned to ask early next time instead of guessing your way through a deadline.',
    lesson: 'Asking for help with the *situation*. Not just the writing. Was on the table the whole time.',
  },
  'repeat-mistake': {
    id: 'repeat-mistake',
    kind: 'ending',
    outcome: 'mixed',
    text: 'Thursday night arrives and you\'re right back where you started. Except now it\'s truly last-minute, with no more extensions left to ask for.',
    lesson: 'An extension buys time; it doesn\'t fix procrastination on its own.',
  },
};
