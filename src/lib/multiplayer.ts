// Shared real-time multiplayer lobby, built on Supabase Realtime Presence +
// Broadcast. Both LiveRaceGame and MatchRaceGame use this. It handles
// room creation/joining and the live "who's here, who's finished, what's
// their progress" state; each game supplies its own local gameplay logic
// and just calls setSelfProgress() as the player advances.
//
// Deliberately simple, not server-authoritative: each client scores itself
// and broadcasts that score. Fine for a casual classroom race; not
// cheat-proof. No reconnect-after-disconnect support, and no host
// migration if the host leaves before starting. Both acceptable
// limitations for a v1 of this feature.
import { useCallback, useEffect, useRef, useState } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from './supabase';

export type Racer = {
  id: string;
  name: string;
  color: string;
  progress: number; // 0-100
  finished: boolean;
  finishedAt: number | null;
};

export type RoomPhase = 'setup' | 'lobby' | 'racing' | 'finished';

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I

export function generateRoomCode() {
  return Array.from({ length: 4 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join('');
}

export function useGameRoom(gameKey: string) {
  const [phase, setPhase] = useState<RoomPhase>('setup');
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [racers, setRacers] = useState<Record<string, Racer>>({});
  const [isHost, setIsHost] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selfIdRef = useRef(crypto.randomUUID());
  const selfRef = useRef<Racer | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const teardown = useCallback(() => {
    channelRef.current?.unsubscribe();
    channelRef.current = null;
  }, []);

  useEffect(() => teardown, [teardown]);

  const joinRoom = useCallback(
    (code: string, name: string, color: string, asHost: boolean) => {
      if (!supabase) {
        setError('Multiplayer isn’t configured for this deployment.');
        return;
      }
      teardown();
      setError(null);

      const self: Racer = { id: selfIdRef.current, name, color, progress: 0, finished: false, finishedAt: null };
      selfRef.current = self;

      const channel = supabase.channel(`game-${gameKey}-${code}`, {
        config: { presence: { key: selfIdRef.current } },
      });
      channelRef.current = channel;
      setRoomCode(code);
      setIsHost(asHost);
      setPhase('lobby');

      channel.on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<Racer>();
        const next: Record<string, Racer> = {};
        for (const key in state) {
          const entries = state[key] as unknown as Racer[];
          if (entries[0]) next[key] = entries[0];
        }
        setRacers(next);
      });

      channel.on('broadcast', { event: 'start' }, () => {
        setPhase((p) => (p === 'lobby' ? 'racing' : p));
      });

      channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track(self);
        }
      });
    },
    [gameKey, teardown],
  );

  const startRace = useCallback(() => {
    channelRef.current?.send({ type: 'broadcast', event: 'start', payload: {} });
    setPhase('racing');
  }, []);

  const setSelfProgress = useCallback((progress: number, finished = false) => {
    if (!selfRef.current || !channelRef.current) return;
    selfRef.current = {
      ...selfRef.current,
      progress,
      finished,
      finishedAt: finished ? (selfRef.current.finishedAt ?? Date.now()) : null,
    };
    channelRef.current.track(selfRef.current);
    if (finished) setPhase('finished');
  }, []);

  const leaveRoom = useCallback(() => {
    teardown();
    setPhase('setup');
    setRoomCode(null);
    setRacers({});
  }, [teardown]);

  return {
    phase,
    roomCode,
    racers: Object.values(racers),
    selfId: selfIdRef.current,
    isHost,
    error,
    joinRoom,
    startRace,
    setSelfProgress,
    leaveRoom,
  };
}
