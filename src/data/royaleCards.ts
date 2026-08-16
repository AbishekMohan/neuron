// Card data for the "AI Royale" mini-game: a simplified Clash Royale-style
// battler where every card is a nod to an AI system or technique. Balance
// numbers are hand-tuned for a short (few-minute), readable match rather
// than simulated for competitive fairness.

export type CardKind = 'troop' | 'spell';

export type RoyaleCard = {
  id: string;
  name: string;
  kind: CardKind;
  cost: number;
  description: string;
  icon: 'chatbot' | 'network' | 'cpu' | 'bot' | 'layers' | 'zap' | 'snowflake' | 'sparkles';
  color: string;
  // Troop-only stats
  hp?: number;
  damage?: number;
  range?: number;
  speed?: number;
  count?: number;
  splashRadius?: number;
  // Spell-only stats
  radius?: number;
  effect?: 'damage' | 'stun' | 'heal';
  power?: number;
  stunMs?: number;
};

export const ROYALE_CARDS: RoyaleCard[] = [
  {
    id: 'chatbot',
    name: 'Chatbot',
    kind: 'troop',
    cost: 1,
    description: 'Cheap and fast, but not built for a real fight.',
    icon: 'chatbot',
    color: '#7dd3fc',
    hp: 40,
    damage: 8,
    range: 6,
    speed: 15,
    count: 1,
  },
  {
    id: 'neural-net',
    name: 'Neural Net',
    kind: 'troop',
    cost: 2,
    description: 'Three small units that swarm the field together.',
    icon: 'network',
    color: '#a78bfa',
    hp: 26,
    damage: 6,
    range: 6,
    speed: 17,
    count: 3,
  },
  {
    id: 'gpt',
    name: 'GPT',
    kind: 'troop',
    cost: 3,
    description: 'A ranged generalist that chips away from a distance.',
    icon: 'cpu',
    color: '#34d399',
    hp: 85,
    damage: 15,
    range: 24,
    speed: 10,
    count: 1,
  },
  {
    id: 'claude',
    name: 'Claude',
    kind: 'troop',
    cost: 4,
    description: 'A reliable, high-HP frontline model built to take a hit.',
    icon: 'bot',
    color: '#38bdf8',
    hp: 175,
    damage: 20,
    range: 7,
    speed: 8,
    count: 1,
  },
  {
    id: 'transformer',
    name: 'Transformer',
    kind: 'troop',
    cost: 5,
    description: 'A heavyweight architecture that splashes damage nearby.',
    icon: 'layers',
    color: '#fb923c',
    hp: 235,
    damage: 30,
    range: 8,
    speed: 6,
    count: 1,
    splashRadius: 11,
  },
  {
    id: 'increased-tokens',
    name: 'Increased Tokens',
    kind: 'spell',
    cost: 3,
    description: 'A burst of extra context that scorches the blast radius.',
    icon: 'zap',
    color: '#f87171',
    radius: 14,
    effect: 'damage',
    power: 85,
  },
  {
    id: 'overfit',
    name: 'Overfit',
    kind: 'spell',
    cost: 2,
    description: 'Locks enemy troops up on the training set for a few seconds.',
    icon: 'snowflake',
    color: '#93c5fd',
    radius: 14,
    effect: 'stun',
    stunMs: 2500,
  },
  {
    id: 'fine-tune',
    name: 'Fine-Tune',
    kind: 'spell',
    cost: 3,
    description: 'A targeted adjustment that repairs your own units.',
    icon: 'sparkles',
    color: '#4ade80',
    radius: 14,
    effect: 'heal',
    power: 60,
  },
];

export function getCard(id: string): RoyaleCard {
  const card = ROYALE_CARDS.find((c) => c.id === id);
  if (!card) throw new Error(`Unknown royale card: ${id}`);
  return card;
}

export const ROYALE_TOWER_STATS = {
  side: { hp: 400, damage: 18, range: 30, attackMs: 900 },
  king: { hp: 750, damage: 24, range: 34, attackMs: 800 },
};

export type TowerKey = 'playerLeft' | 'playerRight' | 'playerKing' | 'botLeft' | 'botRight' | 'botKing';

export const TOWER_POSITIONS: Record<TowerKey, { x: number; y: number }> = {
  botKing: { x: 50, y: 8 },
  botLeft: { x: 20, y: 18 },
  botRight: { x: 80, y: 18 },
  playerKing: { x: 50, y: 92 },
  playerLeft: { x: 20, y: 82 },
  playerRight: { x: 80, y: 82 },
};

export const MAX_ENERGY = 8;
export const MATCH_SECONDS = 180;
