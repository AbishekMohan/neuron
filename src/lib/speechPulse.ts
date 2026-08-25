import type { FrequencyDataSource } from './carvisOrb';

// The Web Speech Synthesis API doesn't expose its audio output to a
// MediaStream or AnalyserNode in any browser today, so there's no way to
// have the orb genuinely sample the assistant's spoken voice the way it
// samples a real mic. This is the honest middle ground: a synthetic
// loudness signal, spiked on each word-boundary event the browser already
// fires while speaking (real timing, not fabricated), decaying between
// words. Satisfies the same FrequencyDataSource shape carvisOrb.ts reads
// from a real AnalyserNode, so the orb doesn't know the difference.
export class SpeechPulseSource implements FrequencyDataSource {
  readonly frequencyBinCount = 64;
  private level = 0;

  pulse(amount = 220) {
    this.level = Math.min(255, this.level + amount);
  }

  getByteFrequencyData(out: Uint8Array) {
    this.level *= 0.82;
    const v = this.level;
    // Concentrate energy in the low bins carvisOrb.ts actually sums for
    // "bass" (0-7) and "mid" (8-23); leave the rest silent.
    for (let i = 0; i < out.length; i++) out[i] = i < 24 ? v : 0;
  }
}

export type SpeakHandle = { cancel: () => void };

export type SpeakCallbacks = {
  onStart?: () => void;
  onWord?: () => void;
  onEnd?: () => void;
  /** System voice to speak with (from getAvailableVoices()). Omit for the browser's default. */
  voiceURI?: string | null;
};

const isSpeechSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

// The voice list is genuinely async in most browsers — it's often empty
// on the very first call and only populated once the 'voiceschanged'
// event fires (sometimes not at all, e.g. some Linux/CI environments
// with zero system voices installed). This resolves once, waiting for
// that event if needed, rather than the caller having to know any of that.
let voicesPromise: Promise<SpeechSynthesisVoice[]> | null = null;
export function getAvailableVoices(): Promise<SpeechSynthesisVoice[]> {
  if (!isSpeechSupported()) return Promise.resolve([]);
  const existing = window.speechSynthesis.getVoices();
  if (existing.length > 0) return Promise.resolve(existing);

  if (!voicesPromise) {
    voicesPromise = new Promise((resolve) => {
      const handler = () => {
        window.speechSynthesis.removeEventListener('voiceschanged', handler);
        resolve(window.speechSynthesis.getVoices());
      };
      window.speechSynthesis.addEventListener('voiceschanged', handler);
      // Some browsers never fire the event when there's nothing to
      // report — don't hang forever waiting for it.
      setTimeout(() => resolve(window.speechSynthesis.getVoices()), 1000);
    });
  }
  return voicesPromise;
}

// Speaks `text` aloud via the browser's built-in TTS voice. Cancels any
// utterance already in flight first — only one reply should ever be
// talking at once. Returns a handle to cancel this one early (e.g. the
// user closes the panel or sends a new message mid-reply), and a no-op
// handle if this browser has no speech synthesis at all.
export function speak(text: string, callbacks: SpeakCallbacks = {}): SpeakHandle {
  if (!isSpeechSupported() || !text.trim()) {
    callbacks.onEnd?.();
    return { cancel: () => {} };
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.02;
  utterance.pitch = 1.0;

  if (callbacks.voiceURI) {
    const match = window.speechSynthesis.getVoices().find((v) => v.voiceURI === callbacks.voiceURI);
    if (match) utterance.voice = match;
  }

  utterance.onstart = () => callbacks.onStart?.();
  utterance.onboundary = (e) => {
    if (e.name === 'word' || e.name === undefined) callbacks.onWord?.();
  };
  utterance.onend = () => callbacks.onEnd?.();
  utterance.onerror = () => callbacks.onEnd?.();

  window.speechSynthesis.speak(utterance);

  return {
    cancel: () => window.speechSynthesis.cancel(),
  };
}

export function stopSpeaking() {
  if (isSpeechSupported()) window.speechSynthesis.cancel();
}
