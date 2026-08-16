import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bot,
  Network,
  Cpu,
  MessageCircle,
  Layers,
  Zap,
  Snowflake,
  Sparkles,
  Castle,
  Swords,
  Timer,
  Trophy,
  CheckCircle2,
  Circle,
  XCircle,
  RotateCw,
} from 'lucide-react';
import type { QuizQuestion } from '../../data/modules';
import {
  ROYALE_CARDS,
  getCard,
  ROYALE_TOWER_STATS,
  TOWER_POSITIONS,
  MAX_ENERGY,
  MATCH_SECONDS,
  type RoyaleCard,
  type TowerKey,
} from '../../data/royaleCards';

const ICONS = {
  chatbot: MessageCircle,
  network: Network,
  cpu: Cpu,
  bot: Bot,
  layers: Layers,
  zap: Zap,
  snowflake: Snowflake,
  sparkles: Sparkles,
};

const TICK_MS = 150;
const BOT_ENERGY_MS = 2200;
const BOT_DECISION_MS = 1800;
const ATTACK_MS = 1000;

type Side = 'player' | 'bot';

type Unit = {
  id: string;
  side: Side;
  cardId: string;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  damage: number;
  range: number;
  speed: number;
  splashRadius?: number;
  cooldown: number;
  stunnedUntil: number;
  lane: 'left' | 'right';
};

type TowerState = {
  hp: number;
  maxHp: number;
  damage: number;
  range: number;
  attackMs: number;
  cooldown: number;
  alive: boolean;
  x: number;
  y: number;
};

function dist(x1: number, y1: number, x2: number, y2: number) {
  return Math.hypot(x1 - x2, y1 - y2);
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function shuffled<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function makeTowers(): Record<TowerKey, TowerState> {
  const out = {} as Record<TowerKey, TowerState>;
  (Object.keys(TOWER_POSITIONS) as TowerKey[]).forEach((key) => {
    const stats = key.endsWith('King') ? ROYALE_TOWER_STATS.king : ROYALE_TOWER_STATS.side;
    const pos = TOWER_POSITIONS[key];
    out[key] = { hp: stats.hp, maxHp: stats.hp, damage: stats.damage, range: stats.range, attackMs: stats.attackMs, cooldown: 0, alive: true, x: pos.x, y: pos.y };
  });
  return out;
}

function initialDeckQueue(): string[] {
  return shuffled(ROYALE_CARDS.map((c) => c.id));
}

function advanceQueue(queue: string[], index: number): string[] {
  const playedId = queue[index];
  const rest = [...queue.slice(0, index), ...queue.slice(index + 1)];
  return [...rest, playedId];
}

let uidCounter = 0;
function uid() {
  uidCounter += 1;
  return `u${uidCounter}`;
}

function spawnCardUnits(card: RoyaleCard, side: Side, x: number, y: number): Unit[] {
  const count = card.count ?? 1;
  const lane: 'left' | 'right' = x < 50 ? 'left' : 'right';
  const out: Unit[] = [];
  for (let i = 0; i < count; i++) {
    const jitter = count > 1 ? (i - (count - 1) / 2) * 7 : 0;
    out.push({
      id: uid(),
      side,
      cardId: card.id,
      x: clamp(x + jitter, 4, 96),
      y,
      hp: card.hp ?? 1,
      maxHp: card.hp ?? 1,
      damage: card.damage ?? 0,
      range: card.range ?? 6,
      speed: card.speed ?? 10,
      splashRadius: card.splashRadius,
      cooldown: 0,
      stunnedUntil: 0,
      lane,
    });
  }
  return out;
}

function applySpell(card: RoyaleCard, side: Side, x: number, y: number, unitsList: Unit[], towersState: Record<TowerKey, TowerState>, nowMs: number) {
  const radius = card.radius ?? 12;
  const enemySide: Side = side === 'player' ? 'bot' : 'player';
  const nextUnits = unitsList.map((u) => ({ ...u }));
  const nextTowers = { ...towersState };
  (Object.keys(nextTowers) as TowerKey[]).forEach((k) => {
    nextTowers[k] = { ...nextTowers[k] };
  });

  if (card.effect === 'damage') {
    for (const u of nextUnits) {
      if (u.side === enemySide && dist(x, y, u.x, u.y) <= radius) u.hp -= card.power ?? 0;
    }
    (Object.keys(nextTowers) as TowerKey[]).forEach((key) => {
      if (!key.startsWith(enemySide)) return;
      const t = nextTowers[key];
      if (t.alive && dist(x, y, t.x, t.y) <= radius) {
        t.hp -= Math.round((card.power ?? 0) * 0.5);
        if (t.hp <= 0) t.alive = false;
      }
    });
  } else if (card.effect === 'stun') {
    for (const u of nextUnits) {
      if (u.side === enemySide && dist(x, y, u.x, u.y) <= radius) u.stunnedUntil = nowMs + (card.stunMs ?? 2000);
    }
  } else if (card.effect === 'heal') {
    for (const u of nextUnits) {
      if (u.side === side && dist(x, y, u.x, u.y) <= radius) u.hp = Math.min(u.maxHp, u.hp + (card.power ?? 0));
    }
    (Object.keys(nextTowers) as TowerKey[]).forEach((key) => {
      if (!key.startsWith(side)) return;
      const t = nextTowers[key];
      if (t.alive && dist(x, y, t.x, t.y) <= radius) t.hp = Math.min(t.maxHp, t.hp + (card.power ?? 0));
    });
  }

  return { units: nextUnits.filter((u) => u.hp > 0), towers: nextTowers };
}

// Runs one physics/combat tick against plain snapshots (not React state) so
// it can be called from a setInterval closure without stale-closure issues.
function stepUnits(prevUnits: Unit[], prevTowers: Record<TowerKey, TowerState>, dtMs: number, nowMs: number) {
  const towers = { ...prevTowers };
  (Object.keys(towers) as TowerKey[]).forEach((k) => {
    towers[k] = { ...towers[k] };
  });
  const units = prevUnits.map((u) => ({ ...u }));

  (Object.keys(towers) as TowerKey[]).forEach((key) => {
    const tower = towers[key];
    if (!tower.alive) return;
    if (tower.cooldown > 0) tower.cooldown = Math.max(0, tower.cooldown - dtMs);
    const enemySide: Side = key.startsWith('player') ? 'bot' : 'player';
    let nearest: Unit | null = null;
    let nearestDist = Infinity;
    for (const u of units) {
      if (u.side !== enemySide || u.hp <= 0) continue;
      const d = dist(tower.x, tower.y, u.x, u.y);
      if (d <= tower.range && d < nearestDist) {
        nearest = u;
        nearestDist = d;
      }
    }
    if (nearest && tower.cooldown <= 0) {
      nearest.hp -= tower.damage;
      tower.cooldown = tower.attackMs;
    }
  });

  for (const u of units) {
    if (u.hp <= 0 || nowMs < u.stunnedUntil) continue;
    if (u.cooldown > 0) u.cooldown = Math.max(0, u.cooldown - dtMs);

    const enemySide: Side = u.side === 'player' ? 'bot' : 'player';
    let targetX = 0;
    let targetY = 0;
    let targetUnit: Unit | null = null;
    let targetTower: TowerState | null = null;
    let bestDist = Infinity;

    const aggroRange = Math.max(u.range, 16);
    for (const ou of units) {
      if (ou.side !== enemySide || ou.hp <= 0) continue;
      const d = dist(u.x, u.y, ou.x, ou.y);
      if (d <= aggroRange && d < bestDist) {
        bestDist = d;
        targetUnit = ou;
        targetX = ou.x;
        targetY = ou.y;
      }
    }

    if (!targetUnit) {
      // No enemy troop nearby: push toward the side tower for this lane,
      // and once that tower falls, the lane is "open" and troops make
      // straight for the king tower instead.
      const sideTowerKey = (enemySide === 'bot' ? (u.lane === 'left' ? 'botLeft' : 'botRight') : u.lane === 'left' ? 'playerLeft' : 'playerRight') as TowerKey;
      const kingKey = (enemySide === 'bot' ? 'botKing' : 'playerKing') as TowerKey;
      const sideTower = towers[sideTowerKey];
      const chosen = sideTower.alive ? sideTower : towers[kingKey];
      targetTower = chosen;
      targetX = chosen.x;
      targetY = chosen.y;
      bestDist = dist(u.x, u.y, chosen.x, chosen.y);
    }

    if (bestDist <= u.range) {
      if (u.cooldown <= 0) {
        if (targetUnit) {
          targetUnit.hp -= u.damage;
          if (u.splashRadius) {
            for (const ou of units) {
              if (ou === targetUnit || ou.side !== enemySide || ou.hp <= 0) continue;
              if (dist(targetX, targetY, ou.x, ou.y) <= u.splashRadius) ou.hp -= u.damage;
            }
          }
        } else if (targetTower) {
          targetTower.hp -= u.damage;
          if (targetTower.hp <= 0) targetTower.alive = false;
        }
        u.cooldown = ATTACK_MS;
      }
    } else {
      const dx = targetX - u.x;
      const dy = targetY - u.y;
      const len = Math.hypot(dx, dy) || 1;
      const step = (u.speed * dtMs) / 1000;
      u.x += (dx / len) * step;
      u.y += (dy / len) * step;
    }
  }

  return { units: units.filter((u) => u.hp > 0), towers };
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function TowerMarker({ towerKey, tower }: { towerKey: TowerKey; tower: TowerState }) {
  const isKing = towerKey.endsWith('King');
  const isPlayer = towerKey.startsWith('player');
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
      style={{ left: `${tower.x}%`, top: `${tower.y}%` }}
    >
      <div
        className={`rounded-full flex items-center justify-center border transition-opacity ${isKing ? 'w-9 h-9' : 'w-7 h-7'} ${
          tower.alive ? (isPlayer ? 'bg-sky-400/10 border-sky-400/40' : 'bg-red-400/10 border-red-400/40') : 'bg-white/5 border-white/10 opacity-30'
        }`}
      >
        <Castle className={`${isKing ? 'w-4 h-4' : 'w-3 h-3'} ${isPlayer ? 'text-sky-300' : 'text-red-300'}`} strokeWidth={1.5} />
      </div>
      <div className="h-1 w-10 rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full ${isPlayer ? 'bg-sky-400' : 'bg-red-400'}`}
          style={{ width: `${Math.max(0, (tower.hp / tower.maxHp) * 100)}%` }}
        />
      </div>
    </div>
  );
}

function UnitMarker({ unit }: { unit: Unit }) {
  const card = getCard(unit.cardId);
  const Icon = ICONS[card.icon];
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5"
      style={{ left: `${unit.x}%`, top: `${unit.y}%`, transition: `left ${TICK_MS}ms linear, top ${TICK_MS}ms linear` }}
    >
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center border"
        style={{ backgroundColor: `${card.color}22`, borderColor: `${card.color}66` }}
      >
        <Icon className="w-3 h-3" style={{ color: card.color }} strokeWidth={1.75} />
      </div>
      <div className="h-[3px] w-6 rounded-full bg-black/40 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${Math.max(0, (unit.hp / unit.maxHp) * 100)}%`, backgroundColor: card.color }} />
      </div>
    </div>
  );
}

export default function RoyaleGame({
  questions,
  moduleId: _moduleId,
  complete,
  onComplete,
}: {
  questions: QuizQuestion[];
  moduleId: string;
  complete: boolean;
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState<'ready' | 'playing' | 'ended'>('ready');
  const [towers, setTowers] = useState<Record<TowerKey, TowerState>>(makeTowers);
  const [units, setUnits] = useState<Unit[]>([]);
  const [playerEnergy, setPlayerEnergy] = useState(2);
  const [botEnergy, setBotEnergy] = useState(2);
  const [playerQueue, setPlayerQueue] = useState<string[]>(initialDeckQueue);
  const [botQueue, setBotQueue] = useState<string[]>(initialDeckQueue);
  const [selectedHandIndex, setSelectedHandIndex] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(MATCH_SECONDS);
  const [winner, setWinner] = useState<'player' | 'bot' | 'draw' | null>(null);
  const [quizOrder, setQuizOrder] = useState(() => shuffled(questions));
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);

  // Refs mirror the latest committed state so setInterval closures (created
  // once per phase change) always read fresh values instead of stale ones.
  const unitsRef = useRef(units);
  const towersRef = useRef(towers);
  const botQueueRef = useRef(botQueue);
  const botEnergyRef = useRef(botEnergy);
  unitsRef.current = units;
  towersRef.current = towers;
  botQueueRef.current = botQueue;
  botEnergyRef.current = botEnergy;

  const playCard = (side: Side, handIndex: number, card: RoyaleCard, x: number, y: number) => {
    if (card.kind === 'troop') {
      const spawned = spawnCardUnits(card, side, x, y);
      unitsRef.current = [...unitsRef.current, ...spawned];
      setUnits(unitsRef.current);
    } else {
      const result = applySpell(card, side, x, y, unitsRef.current, towersRef.current, performance.now());
      unitsRef.current = result.units;
      towersRef.current = result.towers;
      setUnits(result.units);
      setTowers(result.towers);
    }
    if (side === 'player') {
      setPlayerEnergy((e) => e - card.cost);
      setPlayerQueue((q) => advanceQueue(q, handIndex));
    } else {
      setBotEnergy((e) => e - card.cost);
      setBotQueue((q) => advanceQueue(q, handIndex));
    }
  };

  useEffect(() => {
    if (phase !== 'playing') return;
    const id = window.setInterval(() => {
      const now = performance.now();
      const result = stepUnits(unitsRef.current, towersRef.current, TICK_MS, now);
      unitsRef.current = result.units;
      towersRef.current = result.towers;
      setUnits(result.units);
      setTowers(result.towers);

      if (!result.towers.botKing.alive) {
        setWinner('player');
        setPhase('ended');
      } else if (!result.towers.playerKing.alive) {
        setWinner('bot');
        setPhase('ended');
      }
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'playing') return;
    const id = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          const tw = towersRef.current;
          const playerTowersDestroyed = [tw.botLeft, tw.botRight, tw.botKing].filter((x) => !x.alive).length;
          const botTowersDestroyed = [tw.playerLeft, tw.playerRight, tw.playerKing].filter((x) => !x.alive).length;
          let result: 'player' | 'bot' | 'draw';
          if (playerTowersDestroyed > botTowersDestroyed) result = 'player';
          else if (botTowersDestroyed > playerTowersDestroyed) result = 'bot';
          else {
            const botRemaining = tw.botLeft.hp + tw.botRight.hp + tw.botKing.hp;
            const playerRemaining = tw.playerLeft.hp + tw.playerRight.hp + tw.playerKing.hp;
            result = botRemaining < playerRemaining ? 'player' : playerRemaining < botRemaining ? 'bot' : 'draw';
          }
          setWinner(result);
          setPhase('ended');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'playing') return;
    const id = window.setInterval(() => {
      setBotEnergy((e) => Math.min(MAX_ENERGY, e + 1));
    }, BOT_ENERGY_MS);
    return () => window.clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'playing') return;
    const id = window.setInterval(() => {
      const queue = botQueueRef.current;
      const energy = botEnergyRef.current;
      const hand = queue.slice(0, 4);
      const affordable = hand.map((cardId, i) => ({ cardId, i })).filter((h) => getCard(h.cardId).cost <= energy);
      if (affordable.length === 0) return;
      const pick = affordable[Math.floor(Math.random() * affordable.length)];
      const card = getCard(pick.cardId);
      const x = 6 + Math.random() * 88;
      const y = card.kind === 'troop' ? 6 + Math.random() * 38 : 6 + Math.random() * 88;
      playCard('bot', pick.i, card, x, y);
    }, BOT_DECISION_MS);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const start = () => {
    const newTowers = makeTowers();
    towersRef.current = newTowers;
    unitsRef.current = [];
    setTowers(newTowers);
    setUnits([]);
    setPlayerEnergy(2);
    setBotEnergy(2);
    setPlayerQueue(initialDeckQueue());
    setBotQueue(initialDeckQueue());
    setSelectedHandIndex(null);
    setTimeLeft(MATCH_SECONDS);
    setWinner(null);
    setQuizOrder(shuffled(questions));
    setQuizIndex(0);
    setQuizSelected(null);
    setPhase('playing');
  };

  const handleFieldClick = (e: MouseEvent<HTMLDivElement>) => {
    if (selectedHandIndex === null || phase !== 'playing') return;
    const card = getCard(playerQueue[selectedHandIndex]);
    if (card.cost > playerEnergy) {
      setSelectedHandIndex(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = clamp(((e.clientX - rect.left) / rect.width) * 100, 3, 97);
    const yPct = clamp(((e.clientY - rect.top) / rect.height) * 100, 3, 97);
    if (card.kind === 'troop' && yPct < 54) return;
    playCard('player', selectedHandIndex, card, xPct, yPct);
    setSelectedHandIndex(null);
  };

  const handleAnswer = (choiceIndex: number) => {
    if (quizSelected !== null || phase !== 'playing') return;
    const question = quizOrder[quizIndex % quizOrder.length];
    setQuizSelected(choiceIndex);
    if (choiceIndex === question.correctIndex) {
      setPlayerEnergy((e) => Math.min(MAX_ENERGY, e + 1));
    }
    window.setTimeout(() => {
      setQuizSelected(null);
      setQuizIndex((i) => {
        const next = i + 1;
        if (next % quizOrder.length === 0) setQuizOrder(shuffled(questions));
        return next;
      });
    }, 900);
  };

  if (phase === 'ready') {
    return (
      <div className="max-w-xl">
        <div className="rounded-2xl liquid-glass p-8 text-center">
          <Swords className="w-9 h-9 text-sky-300 mx-auto mb-4" strokeWidth={1.25} />
          <p className="text-white text-lg font-normal mb-2">AI Royale</p>
          <p className="text-white/50 text-sm leading-relaxed mb-1">
            Answer questions correctly to earn energy, then spend it to place cards and take down the bot's towers.
          </p>
          <p className="text-white/40 text-xs mb-6">Destroy the king tower for an instant win, or have the most towers standing when time runs out.</p>
          <button
            type="button"
            onClick={start}
            className="inline-flex items-center gap-2 bg-white text-black text-sm font-medium px-6 py-2.5 rounded-full hover:bg-white/90 transition-colors"
          >
            Start match
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'ended') {
    const playerTowersAlive = [towers.playerLeft, towers.playerRight, towers.playerKing].filter((t) => t.alive).length;
    const botTowersAlive = [towers.botLeft, towers.botRight, towers.botKing].filter((t) => t.alive).length;
    const label = winner === 'player' ? 'You won' : winner === 'bot' ? 'The bot won' : 'Draw';
    return (
      <div className="max-w-xl">
        <div className="rounded-2xl liquid-glass p-8 text-center">
          <Trophy className={`w-9 h-9 mx-auto mb-4 ${winner === 'player' ? 'text-amber-300' : 'text-white/40'}`} strokeWidth={1.25} />
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Match over</p>
          <p className="text-white text-2xl font-light mb-3">{label}</p>
          <p className="text-white/50 text-sm mb-6">
            Your towers: {playerTowersAlive}/3 · Bot towers: {botTowersAlive}/3
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={start}
              className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              Play again
            </button>
            <button
              type="button"
              onClick={onComplete}
              disabled={complete}
              className={`inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full transition-colors ${
                complete ? 'bg-sky-400/10 border border-sky-400/40 text-sky-300 cursor-default' : 'bg-white text-black hover:bg-white/90'
              }`}
            >
              {complete ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
              {complete ? 'Mini-game complete' : 'Finish mini-game'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = quizOrder[quizIndex % quizOrder.length];
  const hand = playerQueue.slice(0, 4);
  const nextCard = getCard(playerQueue[4]);

  return (
    <div className="w-full max-w-5xl">
      <div className="flex items-center justify-between mb-3">
        <p className="text-white/60 text-sm font-light">Destroy the king tower, or hold the most towers when time's up.</p>
        <span className="inline-flex items-center gap-1.5 text-white/50 text-xs shrink-0">
          <Timer className="w-3.5 h-3.5" />
          {formatTime(timeLeft)}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 min-w-0">
          <div
            onClick={handleFieldClick}
            className={`relative h-[440px] rounded-2xl liquid-glass overflow-hidden ${selectedHandIndex !== null ? 'cursor-crosshair' : ''}`}
          >
            <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-white/10" />
            {selectedHandIndex !== null && getCard(playerQueue[selectedHandIndex]).kind === 'troop' && (
              <div className="absolute inset-x-0 bottom-0 top-1/2 bg-sky-400/[0.04]" />
            )}

            {(Object.keys(towers) as TowerKey[]).map((key) => (
              <TowerMarker key={key} towerKey={key} tower={towers[key]} />
            ))}
            {units.map((u) => (
              <UnitMarker key={u.id} unit={u} />
            ))}
          </div>

          <div className="mt-3 rounded-2xl liquid-glass p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/40 text-xs">Energy</p>
              <p className="text-white/60 text-xs">
                {playerEnergy}/{MAX_ENERGY}
              </p>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden mb-3">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-500"
                animate={{ width: `${(playerEnergy / MAX_ENERGY) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <div className="grid grid-cols-5 gap-2">
              {hand.map((cardId, i) => {
                const card = getCard(cardId);
                const Icon = ICONS[card.icon];
                const affordable = card.cost <= playerEnergy;
                const isSelected = selectedHandIndex === i;
                return (
                  <button
                    key={`${cardId}-${i}`}
                    type="button"
                    disabled={!affordable}
                    onClick={() => setSelectedHandIndex((cur) => (cur === i ? null : i))}
                    title={card.description}
                    className={`rounded-xl border p-2 flex flex-col items-center gap-1 transition-colors ${
                      isSelected
                        ? 'border-sky-400/60 bg-sky-400/10'
                        : affordable
                          ? 'border-white/10 hover:border-white/25 hover:bg-white/5'
                          : 'border-white/5 opacity-35 cursor-not-allowed'
                    }`}
                  >
                    <Icon className="w-4 h-4" style={{ color: card.color }} strokeWidth={1.5} />
                    <span className="text-white/80 text-[10px] leading-none text-center">{card.name}</span>
                    <span className="text-sky-300/80 text-[10px] leading-none">{card.cost}⚡</span>
                  </button>
                );
              })}
              <div className="rounded-xl border border-white/5 p-2 flex flex-col items-center gap-1 opacity-40">
                {(() => {
                  const NextIcon = ICONS[nextCard.icon];
                  return <NextIcon className="w-4 h-4" style={{ color: nextCard.color }} strokeWidth={1.5} />;
                })()}
                <span className="text-white/60 text-[10px] leading-none">Next</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-72 shrink-0">
          <div className="rounded-2xl liquid-glass p-5">
            <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Answer for energy</p>
            <AnimatePresence mode="wait">
              <motion.div key={quizIndex} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                <p className="text-white text-sm font-normal mb-4 leading-snug">{question.prompt}</p>
                <div className="flex flex-col gap-2">
                  {question.choices.map((choice, i) => {
                    const isCorrect = i === question.correctIndex;
                    const isChosen = quizSelected === i;
                    const showState = quizSelected !== null;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAnswer(i)}
                        disabled={showState}
                        className={`text-left text-xs px-3 py-2 rounded-lg border transition-colors flex items-center gap-1.5 ${
                          showState && isCorrect
                            ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200'
                            : showState && isChosen
                              ? 'border-red-400/40 bg-red-400/10 text-red-200'
                              : 'border-white/10 text-white/70 hover:border-white/25 hover:bg-white/5 disabled:hover:bg-transparent'
                        }`}
                      >
                        {showState && isCorrect && <CheckCircle2 className="w-3 h-3 shrink-0" />}
                        {showState && isChosen && !isCorrect && <XCircle className="w-3 h-3 shrink-0" />}
                        {choice}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
            <p className="text-white/30 text-[10px] mt-4">Correct answer = +1 energy.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
