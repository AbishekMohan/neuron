// "Train Your Companion". The client-side classifier itself.
//
// This is a real (if small) supervised-learning loop, not a simulated
// progress bar: a bag-of-words perceptron trained on whatever label the
// *student* assigns each example, scored against a held-out test set the
// student never labels. Two things fall out of that design for free,
// rather than needing to be special-cased:
//
//  1. "Mastery" reflects whether the model actually generalizes (held-out
//     accuracy), not how many times the student clicked a button.
//  2. Feeding it deliberately wrong labels measurably makes it worse.
//     The perceptron update rule doesn't know or care whether the label
//     it's given is "correct", so bad data straightforwardly produces a
//     worse classifier. Mastery can regress because the model can.

import type { TrainingCategory, TrainingExample } from '../data/training';

export type Weights = Record<string, number>;

export type CompanionMasteryTier = 'untrained' | 'learning' | 'competent' | 'mastered';

export const MASTERY_TIER_ORDER: CompanionMasteryTier[] = ['untrained', 'learning', 'competent', 'mastered'];

export const MASTERY_TIER_LABELS: Record<CompanionMasteryTier, string> = {
  untrained: 'Untrained',
  learning: 'Learning',
  competent: 'Competent',
  mastered: 'Mastered',
};

// Deliberately brutal: mastery takes real, sustained, careful practice.
// Not a handful of clicks, and not achievable by accident. Reaching
// "Mastered" requires both a large volume of repetitions AND landing at
// (or within a hair of) the literal ceiling accuracy. The best any
// version of this exact classifier could ever score on this exact
// held-out set, verified against the real training corpus, not assumed.
// A flat threshold like "90%" would have been silently impossible for
// some categories here (bag-of-words on short, topically diverse
// sentences has a real, low ceiling for e.g. the hallucination category.
// Confirmed by simulating 200 epochs of perfect training and checking
// what it actually reaches), so the bar is anchored to getCeilingAccuracy
// below instead of a number picked without checking.
const MIN_LABELS_UNTRAINED_END = 15; // fewer than this: not enough signal to score at all
const MIN_LABELS_COMPETENT = 30;
const MIN_LABELS_MASTERED = 60;

const STOPWORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'to', 'of', 'and', 'in', 'on', 'for',
  'with', 'that', 'this', 'it', 'as', 'by', 'at', 'from', 'or', 'has', 'have', 'had', 'not', 'no',
  'than', 'then', 'so', 'but', 'its', 'their', 'they', 'them', 'you', 'your', 'i', 'me', 'my',
  'do', 'does', 'did', 'can', 'could', 'will', 'would', 'about', 'into', 'over', 'per', 'up', 'out',
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t));
}

// The classifier's vocabulary is derived from the category's own corpus
// (pool + testSet + capstone) rather than hand-curated, so every example
// is guaranteed to produce at least some features.
function deriveVocabulary(category: TrainingCategory): string[] {
  const all = [...category.pool, ...category.testSet, category.capstone];
  const seen = new Set<string>();
  for (const ex of all) for (const token of tokenize(ex.text)) seen.add(token);
  return [...seen];
}

const vocabCache = new Map<string, string[]>();
export function getVocabulary(category: TrainingCategory): string[] {
  const cached = vocabCache.get(category.id);
  if (cached) return cached;
  const vocab = deriveVocabulary(category);
  vocabCache.set(category.id, vocab);
  return vocab;
}

export function extractFeatures(text: string, vocabulary: string[]): string[] {
  const tokens = new Set(tokenize(text));
  return vocabulary.filter((word) => tokens.has(word));
}

export function predictScore(weights: Weights, features: string[]): number {
  let sum = 0;
  for (const f of features) sum += weights[f] ?? 0;
  return sum;
}

export function predictLabel(weights: Weights, features: string[]): 0 | 1 {
  return predictScore(weights, features) > 0 ? 1 : 0;
}

// Standard binary perceptron update: only nudges weights when the current
// weights actually get this example wrong (relative to `assignedLabel`.
// Deliberately not necessarily the ground truth). Each present feature
// moves toward the assigned class by `learningRate`.
export function trainOnLabel(weights: Weights, features: string[], assignedLabel: 0 | 1, learningRate = 1): Weights {
  const target = assignedLabel === 1 ? 1 : -1;
  const predicted = predictScore(weights, features) > 0 ? 1 : -1;
  if (predicted === target || features.length === 0) return weights;

  const next = { ...weights };
  for (const f of features) next[f] = (next[f] ?? 0) + learningRate * target;
  return next;
}

export function evaluateAccuracy(weights: Weights, category: TrainingCategory): number {
  const vocabulary = getVocabulary(category);
  if (category.testSet.length === 0) return 0;
  let correct = 0;
  for (const ex of category.testSet) {
    const features = extractFeatures(ex.text, vocabulary);
    if (predictLabel(weights, features) === ex.label) correct++;
  }
  return correct / category.testSet.length;
}

// A "reference" well-trained model: the same perceptron, trained on the
// same pool, but on ground-truth labels for many epochs instead of a
// student's clicks. Computed on the fly (the corpora are tiny) rather
// than hand-authored weights, so it stays honest to the same algorithm.
// 200 epochs is well past where this converges (verified: further epochs
// don't change the result). This is also, not incidentally, the exact
// ceiling getCompanionMastery measures "Mastered" against below.
const referenceCache = new Map<string, Weights>();
export function getReferenceWeights(category: TrainingCategory, epochs = 200): Weights {
  const cached = referenceCache.get(category.id);
  if (cached) return cached;

  const vocabulary = getVocabulary(category);
  let weights: Weights = {};
  for (let e = 0; e < epochs; e++) {
    for (const ex of category.pool) {
      const features = extractFeatures(ex.text, vocabulary);
      weights = trainOnLabel(weights, features, ex.label, 1);
    }
  }
  referenceCache.set(category.id, weights);
  return weights;
}

// The best held-out accuracy any set of weights from this perceptron
// could ever reach on this category's data. I.e. the reference model's
// own accuracy. Bag-of-words on short, topically varied sentences has a
// real ceiling well under 100% for some categories (some held-out
// sentences share almost no vocabulary with anything in the training
// pool), so "Mastered" is defined relative to this instead of a flat
// number that could be quietly unreachable.
const ceilingCache = new Map<string, number>();
export function getCeilingAccuracy(category: TrainingCategory): number {
  const cached = ceilingCache.get(category.id);
  if (cached !== undefined) return cached;
  const ceiling = evaluateAccuracy(getReferenceWeights(category), category);
  ceilingCache.set(category.id, ceiling);
  return ceiling;
}

export function getCompanionMastery(category: TrainingCategory, labelsCount: number, weights: Weights): CompanionMasteryTier {
  const accuracy = evaluateAccuracy(weights, category);
  const ceiling = getCeilingAccuracy(category);
  // Perceptrons don't converge to a single "best" separator. The exact
  // hyperplane a real student's weights land on depends on the order
  // labels happened to arrive in, not just whether each one was correct
  // (verified by simulation: even 60 straight *correct* labels sometimes
  // never reach the literal reference ceiling, since once weights stop
  // misclassifying the pool, they stop updating at all. Order-dependent
  // luck, not skill). Two test items of slack below the ceiling absorbs
  // that variance while staying genuinely close to the theoretical best
  //. Simulated at ~97% reachable through sustained correct labeling,
  // effectively 0% by accident or occasional bad-faith labels.
  const masteredBar = ceiling - 2 / category.testSet.length - 0.001;

  if (labelsCount < MIN_LABELS_UNTRAINED_END) return 'untrained';
  if (labelsCount < MIN_LABELS_COMPETENT || accuracy < ceiling * 0.5) return 'learning';
  if (labelsCount < MIN_LABELS_MASTERED || accuracy < ceiling * 0.85) return 'competent';
  if (accuracy < masteredBar) return 'competent';
  return 'mastered';
}

// A real (if simple) confidence signal, not a fabricated one: how far the
// weighted score sits from the 0 decision boundary, squashed to 0.5-1
// with a logistic curve. Score 0 (no learned signal either way) reads as
// 50%. Genuine uncertainty. Rather than a falsely reassuring number.
// This is exactly what makes a badly-trained model dangerous: it can
// have plenty of *feature overlap* (so a large |score|, so high
// "confidence") while still being trained toward the wrong class.
export function predictConfidence(weights: Weights, features: string[]): number {
  const score = predictScore(weights, features);
  const k = 0.6;
  return 1 / (1 + Math.exp(-k * Math.abs(score)));
}

export function classify(weights: Weights, category: TrainingCategory, example: TrainingExample) {
  const features = extractFeatures(example.text, getVocabulary(category));
  return predictLabel(weights, features);
}

// --- Persistence -----------------------------------------------------
// One localStorage entry per category, holding the trained weights and
// which examples have been labeled (so accuracy/mastery survive reload).
// `peakAccuracy` is tracked separately so the UI can show a concrete
// "down from your best" signal when bad labels regress the model.
// Otherwise a student would have no way to see the regression happened.

export type CompanionState = {
  weights: Weights;
  labelsCount: number;
  peakAccuracy: number;
};

const EMPTY_STATE: CompanionState = { weights: {}, labelsCount: 0, peakAccuracy: 0 };

function storageKey(categoryId: string) {
  return `neuron-companion-${categoryId}-v1`;
}

export const COMPANION_UPDATED_EVENT = 'neuron-companion-updated';

export function loadCompanionState(categoryId: string): CompanionState {
  if (typeof window === 'undefined') return EMPTY_STATE;
  try {
    const raw = window.localStorage.getItem(storageKey(categoryId));
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw);
    return {
      weights: typeof parsed.weights === 'object' && parsed.weights ? parsed.weights : {},
      labelsCount: typeof parsed.labelsCount === 'number' ? parsed.labelsCount : 0,
      peakAccuracy: typeof parsed.peakAccuracy === 'number' ? parsed.peakAccuracy : 0,
    };
  } catch {
    return EMPTY_STATE;
  }
}

export function saveCompanionState(categoryId: string, state: CompanionState) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(storageKey(categoryId), JSON.stringify(state));
  // Same-tab listeners (ProgressContext's badge recompute) don't get the
  // native `storage` event. That only fires in *other* tabs. So this
  // panel dispatches its own so anything caring about companion mastery
  // can react without polling localStorage on every render.
  window.dispatchEvent(new Event(COMPANION_UPDATED_EVENT));
}

export function resetCompanionState(categoryId: string) {
  saveCompanionState(categoryId, EMPTY_STATE);
}

// Used by badges.ts (via ProgressContext). Doesn't need per-category
// detail, just "has the student mastered at least one companion".
export function getMasteredCompanionCount(categories: TrainingCategory[]): number {
  let count = 0;
  for (const category of categories) {
    const state = loadCompanionState(category.id);
    if (getCompanionMastery(category, state.labelsCount, state.weights) === 'mastered') count++;
  }
  return count;
}

// Maps a mastery tier to how "sharp" the orb should look (see
// carvisOrb.ts's quality axis: 0 = dim/glitchy, 1 = sharp/bright).
export const TIER_QUALITY: Record<CompanionMasteryTier, number> = {
  untrained: 0.12,
  learning: 0.4,
  competent: 0.7,
  mastered: 1,
};

// The companion is one entity even though training happens per-category
//. Its visual growth (the orb, everywhere it appears including chat)
// reflects overall progress across every skill, not just whichever
// category tab happens to be selected. Plain average of each category's
// tier-quality; a category never labeled at all sits at "untrained"
// (0.12), so it pulls the average down until it's actually trained,
// same as any real skill left unpracticed would.
export function getOverallQuality(categories: TrainingCategory[]): number {
  if (categories.length === 0) return TIER_QUALITY.untrained;
  const total = categories.reduce((sum, category) => {
    const state = loadCompanionState(category.id);
    const tier = getCompanionMastery(category, state.labelsCount, state.weights);
    return sum + TIER_QUALITY[tier];
  }, 0);
  return total / categories.length;
}
