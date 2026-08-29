// Course-content localization. Kept separate from the small UI-chrome
// dictionary in i18n.ts: this is a much bigger, much more structured
// translation problem (thousands of words of citation-tied educational
// prose across 7 modules), and it needs a shape that can be filled in one
// module at a time without ever breaking the site for modules that aren't
// translated yet.
//
// Design: MODULE_TRANSLATIONS holds a COMPLETE replacement for every
// translatable string in a module, keyed by module id. A module/language
// pair that isn't in the map yet just falls back to the English MODULES
// data untouched — nothing renders broken or half-translated mid-sentence.
//
// Arrays (paragraphs, flashcards, quiz questions, game cards) are matched
// by POSITION against the English source, not by id or text — simpler to
// author correctly than an id-keyed map, but it means a translation entry
// must list its items in the exact same order as the English module and
// must be regenerated if the English content's structure ever changes.
// checkArticleTranslationShape (dev-only, called from localizeModule)
// warns loudly if a translation's array lengths drift from the English
// source, so that kind of staleness fails visibly instead of silently
// serving mismatched content.
import type { Flashcard, GameCard, Module, QuizQuestion } from '../data/modules';
import type { Language } from './i18n';

export type InlineQuestionTranslation = {
  prompt: string;
  choices: string[];
  explanation: string;
};

export type ArticleSectionTranslation = {
  heading: string;
  paragraphs: string[];
  checkpoint?: InlineQuestionTranslation;
};

export type FlashcardTranslation = {
  term: string;
  definition: string;
};

// bucketIndex points into the translation's own `buckets` array, rather
// than repeating translated bucket text per card: keeps every card's
// bucket assignment consistent with the (translated) bucket list by
// construction instead of by matching translated strings back together.
export type GameCardTranslation = {
  text: string;
  why: string;
  bucketIndex: number;
};

export type GameTranslation = {
  prompt: string;
  buckets: string[];
  blastTargetIndex: number;
  cards: GameCardTranslation[];
};

export type QuizQuestionTranslation = {
  prompt: string;
  choices: string[];
  explanation: string;
};

export type ModuleTranslation = {
  title: string;
  tagline: string;
  description: string;
  article: { sections: ArticleSectionTranslation[] };
  flashcards: { cards: FlashcardTranslation[] };
  video: { title: string; description: string };
  game: GameTranslation;
  quiz: { questions: QuizQuestionTranslation[] };
};

export type ModuleTranslations = Partial<Record<string, ModuleTranslation>>;

function warnMismatch(moduleId: string, field: string, expected: number, actual: number) {
  if (import.meta.env?.DEV && expected !== actual) {
    // eslint-disable-next-line no-console
    console.warn(
      `[localizeModule] "${moduleId}".${field}: English has ${expected} item(s) but the translation has ${actual}. ` +
        `Falling back to English for the mismatched items — the translation is stale and needs updating.`
    );
  }
}

function mergeAt<T>(base: T[], translated: T[] | undefined, moduleId: string, field: string): T[] {
  if (!translated) return base;
  warnMismatch(moduleId, field, base.length, translated.length);
  return base.map((item, i) => translated[i] ?? item);
}

function localizeArticle(mod: Module, tr: ModuleTranslation): Module['steps']['article'] {
  const sections = mergeAt(mod.steps.article.sections, tr.article.sections, mod.id, 'article.sections').map(
    (section, i) => {
      const t = tr.article.sections[i];
      if (!t) return section;
      return {
        ...section,
        heading: t.heading,
        paragraphs: t.paragraphs,
        checkpoint:
          section.checkpoint && t.checkpoint
            ? { ...section.checkpoint, prompt: t.checkpoint.prompt, choices: t.checkpoint.choices, explanation: t.checkpoint.explanation }
            : section.checkpoint,
      };
    }
  );
  return { sections };
}

function localizeFlashcards(mod: Module, tr: ModuleTranslation): Module['steps']['flashcards'] {
  const cards: Flashcard[] = mod.steps.flashcards.cards.map((card, i) => {
    const t = tr.flashcards.cards[i];
    return t ? { ...card, term: t.term, definition: t.definition } : card;
  });
  warnMismatch(mod.id, 'flashcards.cards', mod.steps.flashcards.cards.length, tr.flashcards.cards.length);
  return { cards };
}

function localizeGame(mod: Module, tr: ModuleTranslation): Module['steps']['game'] {
  const g = tr.game;
  warnMismatch(mod.id, 'game.buckets', mod.steps.game.buckets.length, g.buckets.length);
  warnMismatch(mod.id, 'game.cards', mod.steps.game.cards.length, g.cards.length);
  const cards: GameCard[] = mod.steps.game.cards.map((card, i) => {
    const t = g.cards[i];
    if (!t) return card;
    return { ...card, text: t.text, why: t.why, bucket: g.buckets[t.bucketIndex] ?? card.bucket };
  });
  return {
    prompt: g.prompt,
    buckets: g.buckets,
    blastTarget: g.buckets[g.blastTargetIndex] ?? mod.steps.game.blastTarget,
    cards,
  };
}

function localizeQuiz(mod: Module, tr: ModuleTranslation): Module['steps']['quiz'] {
  const questions: QuizQuestion[] = mod.steps.quiz.questions.map((q, i) => {
    const t = tr.quiz.questions[i];
    return t ? { ...q, prompt: t.prompt, choices: t.choices, explanation: t.explanation } : q;
  });
  warnMismatch(mod.id, 'quiz.questions', mod.steps.quiz.questions.length, tr.quiz.questions.length);
  return { ...mod.steps.quiz, questions };
}

export function localizeModule(mod: Module, language: Language, translations: ModuleTranslations): Module {
  if (language === 'en') return mod;
  const tr = translations[mod.id];
  if (!tr) return mod; // not translated yet: serve English rather than break the page
  return {
    ...mod,
    title: tr.title,
    tagline: tr.tagline,
    description: tr.description,
    steps: {
      article: localizeArticle(mod, tr),
      flashcards: localizeFlashcards(mod, tr),
      video: { ...mod.steps.video, title: tr.video.title, description: tr.video.description },
      game: localizeGame(mod, tr),
      quiz: localizeQuiz(mod, tr),
    },
  };
}
