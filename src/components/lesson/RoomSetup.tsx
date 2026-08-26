import { useState } from 'react';
import { Users, Copy, Check, Crown, Loader2 } from 'lucide-react';
import type { useGameRoom } from '../../lib/multiplayer';
import { generateRoomCode } from '../../lib/multiplayer';
import { AVATAR_COLORS } from '../../context/ProfileContext';
import { useProfile } from '../../context/ProfileContext';

// Shared "create or join a room, then wait in the lobby" screen for both
// multiplayer race games. Renders itself for the 'setup' and 'lobby'
// phases; the parent game renders the actual gameplay once phase becomes
// 'racing', and this component gets unmounted (or just returns null).
export default function RoomSetup({ room, title }: { room: ReturnType<typeof useGameRoom>; title: string }) {
  const { profile } = useProfile();
  const [name, setName] = useState(profile?.display_name ?? '');
  const [color] = useState(() => profile?.avatar_color ?? AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]);
  const [joinCode, setJoinCode] = useState('');
  const [copied, setCopied] = useState(false);

  if (room.phase === 'lobby' && room.roomCode) {
    const copyCode = () => {
      navigator.clipboard.writeText(room.roomCode!).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    };

    return (
      <div className="max-w-md">
        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Room code</p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <p className="text-white text-3xl font-light tracking-[0.3em]">{room.roomCode}</p>
            <button type="button" onClick={copyCode} aria-label="Copy room code" className="text-white/40 hover:text-white transition-colors">
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-2 justify-center text-white/40 text-xs mb-4">
            <Users className="w-3.5 h-3.5" />
            {room.racers.length} {room.racers.length === 1 ? 'player' : 'players'} in the room
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {room.racers.map((r) => (
              <span
                key={r.id}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-white/10 text-white/70"
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                {r.name}
                {r.id === room.selfId && ' (you)'}
              </span>
            ))}
          </div>

          {room.isHost ? (
            <button
              type="button"
              onClick={room.startRace}
              disabled={room.racers.length < 1}
              className="inline-flex items-center gap-2 bg-white text-black text-sm font-medium px-6 py-2.5 rounded-full hover:bg-white/90 transition-colors"
            >
              <Crown className="w-4 h-4" />
              Start race for everyone
            </button>
          ) : (
            <p className="text-white/40 text-xs inline-flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Waiting for the host to start...
            </p>
          )}
          <div className="mt-4">
            <button type="button" onClick={room.leaveRoom} className="text-white/30 hover:text-white/60 text-xs transition-colors">
              Leave room
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md">
      <h2 className="text-white text-lg font-normal mb-1">{title}</h2>
      <p className="text-white/50 text-sm font-light mb-6">Race up to a few classmates live. Create a room and share the code, or join one.</p>

      <div className="border-t border-white/10 pt-6">
        <label className="block text-white/40 text-xs mb-2">Your name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={24}
          placeholder="e.g. NeuralNinja"
          className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-sky-400/50 mb-5"
        />

        {room.error && <p className="text-red-300 text-xs mb-4">{room.error}</p>}

        <div className="flex flex-col gap-3">
          <button
            type="button"
            disabled={!name.trim()}
            onClick={() => room.joinRoom(generateRoomCode(), name.trim(), color, true)}
            className="w-full bg-white text-black text-sm font-medium px-4 py-2.5 rounded-full hover:bg-white/90 disabled:opacity-40 transition-colors"
          >
            Create a new room
          </button>

          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-xs">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 4))}
              placeholder="Room code"
              className="flex-1 bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-sky-400/50 tracking-[0.2em] text-center"
            />
            <button
              type="button"
              disabled={!name.trim() || joinCode.length !== 4}
              onClick={() => room.joinRoom(joinCode, name.trim(), color, false)}
              className="shrink-0 border border-white/15 text-white/70 hover:text-white hover:border-white/30 text-sm px-5 py-2.5 rounded-full disabled:opacity-40 transition-colors"
            >
              Join
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
