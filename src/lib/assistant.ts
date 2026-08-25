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

const NOT_CONNECTED_NOTICE =
  'Your companion isn’t connected to a live AI model yet. Once a Groq API key is added to this project’s Supabase secrets (see supabase/functions/assistant), it’ll answer for real: explaining how AI works and coaching through homework without just handing you the answer.';

export async function sendMessage(
  messages: AssistantMessage[],
  context?: AssistantContext,
): Promise<{ reply: string; flags: AssistantFlag[]; error: string | null }> {
  if (!supabase) return { reply: NOT_CONNECTED_NOTICE, flags: [], error: null };

  const { data, error } = await supabase.functions.invoke<{ reply?: string; flags?: AssistantFlag[]; error?: string }>(
    'assistant',
    { body: { messages, context } },
  );

  if (error || data?.error) {
    console.error('Assistant request failed', error ?? data?.error);
    return { reply: NOT_CONNECTED_NOTICE, flags: [], error: (error?.message ?? data?.error) || 'Unknown error' };
  }

  return { reply: data?.reply ?? NOT_CONNECTED_NOTICE, flags: data?.flags ?? [], error: null };
}

export const SUGGESTED_PROMPTS = [
  'Explain how a neural network learns, in simple terms',
  'Quiz me on this module',
  'What’s the difference between AI assistance and letting AI do my work?',
  'Why do AI chatbots sometimes make things up?',
];
