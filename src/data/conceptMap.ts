// Content for the Concept Map Builder challenge: nodes are AI terms
// positioned around a circle (percentage coordinates, 0-100, matching an
// SVG viewBox 0 0 100 100 — no layout measurement needed), edges are the
// correct directed relationships between them, each with a short label
// naming the relationship (not just "these are related").

export type ConceptNode = { id: string; label: string; angleDeg: number };
export type ConceptEdge = { from: string; to: string; relation: string };

export const CONCEPT_NODES: ConceptNode[] = [
  { id: 'training-data', label: 'Training Data', angleDeg: -90 },
  { id: 'weights', label: 'Weights', angleDeg: -30 },
  { id: 'neural-network', label: 'Neural Network', angleDeg: 30 },
  { id: 'accuracy', label: 'Accuracy', angleDeg: 90 },
  { id: 'overfitting', label: 'Overfitting', angleDeg: 150 },
  { id: 'bias', label: 'Bias', angleDeg: -150 },
];

export const CONCEPT_EDGES: ConceptEdge[] = [
  { from: 'training-data', to: 'weights', relation: 'shapes' },
  { from: 'weights', to: 'neural-network', relation: 'make up' },
  { from: 'training-data', to: 'bias', relation: 'can introduce' },
  { from: 'neural-network', to: 'accuracy', relation: 'is measured by' },
  { from: 'overfitting', to: 'accuracy', relation: 'can hurt' },
  { from: 'bias', to: 'accuracy', relation: 'can hurt' },
];

export function nodePosition(angleDeg: number, radius = 38) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: 50 + radius * Math.cos(rad), y: 50 + radius * Math.sin(rad) };
}
