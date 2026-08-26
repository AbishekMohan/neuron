import { Shapes, Target, Zap, LayoutGrid, Users, Clock, Swords, Bot } from 'lucide-react';

export type GameMode = 'sort' | 'blast' | 'live' | 'match' | 'royale';

const MODES: { mode: GameMode; title: string; description: string; Icon: typeof Shapes; tags: { Icon: typeof Clock; label: string }[] }[] = [
  {
    mode: 'sort',
    title: 'Sort',
    description: 'Categorize each card into the right bucket. No timer, no pressure.',
    Icon: Shapes,
    tags: [{ Icon: LayoutGrid, label: 'Solo' }],
  },
  {
    mode: 'blast',
    title: 'Blast',
    description: 'Blast all the correct targets before time runs out.',
    Icon: Target,
    tags: [{ Icon: Clock, label: 'Timed · Solo' }],
  },
  {
    mode: 'live',
    title: 'Live',
    description: 'Answer every question correctly, in a row, before your opponents.',
    Icon: Zap,
    tags: [{ Icon: Users, label: 'Live multiplayer' }],
  },
  {
    mode: 'match',
    title: 'Match',
    description: 'Memorize and match every pair before your opponents.',
    Icon: LayoutGrid,
    tags: [{ Icon: Users, label: 'Live multiplayer' }],
  },
  {
    mode: 'royale',
    title: 'Royale',
    description: 'Answer questions to earn energy, place AI-themed cards, and take down the bot’s towers.',
    Icon: Swords,
    tags: [{ Icon: Bot, label: 'Vs. bot' }],
  },
];

export default function GameModeSelect({ onSelect }: { onSelect: (mode: GameMode) => void }) {
  return (
    <div>
      <h2 className="text-white text-lg font-normal mb-1">Choose how to play</h2>
      <p className="text-white/50 text-sm font-light mb-6">Any mode counts toward this step. Pick whichever sounds fun.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {MODES.map(({ mode, title, description, Icon, tags }) => (
          <button
            key={mode}
            type="button"
            onClick={() => onSelect(mode)}
            className="group text-left rounded-xl border border-white/10 p-5 hover:border-sky-400/30 hover:bg-white/[0.02] transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-sky-400/10 border border-sky-400/30 flex items-center justify-center mb-4 group-hover:border-sky-400/50 transition-colors">
              <Icon className="w-4.5 h-4.5 text-sky-300" strokeWidth={1.5} />
            </div>
            <p className="text-white text-base font-normal mb-1.5">{title}</p>
            <p className="text-white/50 text-xs font-light leading-relaxed mb-4">{description}</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag.label} className="inline-flex items-center gap-1 text-white/30 text-[11px]">
                  <tag.Icon className="w-3 h-3" />
                  {tag.label}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
