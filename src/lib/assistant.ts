// Single boundary between the Companion page's chat UI and wherever the
// actual model call happens: calls the `assistant` Supabase Edge
// Function, which proxies to Groq server-side so the API key never
// reaches the browser (see supabase/functions/assistant). Falls back to
// a clear "not connected yet" notice if Supabase isn't configured for
// this deployment, or if the edge function's GROQ_API_KEY secret hasn't
// been set yet.

import { supabase } from './supabase';

export type AssistantFlag = {
  type: 'hallucination' | 'bias' | 'oversimplification' | 'uncertain' | string;
  quote: string;
  note: string;
};

export type AssistantMessage = { role: 'user' | 'assistant'; content: string; flags?: AssistantFlag[] };

export type AssistantContext = {
  moduleTitle?: string;
  sectionHeading?: string;
  /** The name the student gave their companion (see lib/companionIdentity.ts). Lets the model refer to itself by that name. */
  companionName?: string;
  /**
   * Real mastery tier from lib/companion.ts's held-out-accuracy classifier
   * (untrained/learning/competent/mastered), passed straight through so
   * the edge function can modulate its own reliability to match: an
   * untrained persona is deliberately allowed to skip double-checking and
   * overgeneralize, not just sound terser, so the self-audit pass below
   * has something real to catch.
   */
  companionTier?: 'untrained' | 'learning' | 'competent' | 'mastered';
  companionQualityPercent?: number;
};

const NOT_CONFIGURED_NOTICE =
  'Your companion isn’t connected to a live AI model yet. Once a Groq API key is added to this project’s Supabase secrets (see supabase/functions/assistant), it’ll answer for real: explaining how AI works and coaching through homework without just handing you the answer.';

// Deliberately a different message from NOT_CONFIGURED_NOTICE above: that
// one means Supabase itself isn't set up at all (a deployment issue this
// site's owner needs to fix). This one means Supabase IS configured and
// the request actually reached the function, but something failed along
// the way (a Groq hiccup, a network blip, a rate limit) — a transient
// problem worth retrying, not a "go configure something" problem. Showing
// the same text for both was actively misleading: it told a student to
// go check a secret that was already set correctly.
const REQUEST_FAILED_NOTICE =
  'Something went wrong reaching your companion just now. This isn’t a configuration problem, it’s usually temporary (a busy moment on the AI provider’s end) — try sending your message again in a few seconds.';

export async function sendMessage(
  messages: AssistantMessage[],
  context?: AssistantContext,
): Promise<{ reply: string; flags: AssistantFlag[]; error: string | null }> {
  if (!supabase) return { reply: NOT_CONFIGURED_NOTICE, flags: [], error: null };

  const { data, error } = await supabase.functions.invoke<{ reply?: string; flags?: AssistantFlag[]; error?: string }>(
    'assistant',
    { body: { messages, context } },
  );

  if (error || data?.error) {
    const detail = (error?.message ?? data?.error) || 'Unknown error';
    console.error('Assistant request failed:', detail);
    // GROQ_API_KEY specifically missing is the one real "not configured"
    // case that can surface here (the function itself checks and reports
    // it) — everything else genuinely is a request failure, not a setup
    // problem, so it gets the honest, retry-oriented message instead.
    const isConfigError = typeof data?.error === 'string' && data.error.includes('GROQ_API_KEY');
    return { reply: isConfigError ? NOT_CONFIGURED_NOTICE : REQUEST_FAILED_NOTICE, flags: [], error: detail };
  }

  return { reply: data?.reply ?? REQUEST_FAILED_NOTICE, flags: data?.flags ?? [], error: null };
}

export const SUGGESTED_PROMPTS = [
  'Explain how a neural network learns, in simple terms',
  'Quiz me on this module',
  'What’s the difference between AI assistance and letting AI do my work?',
  'Why do AI chatbots sometimes make things up?',
];
