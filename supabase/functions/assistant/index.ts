// Supabase Edge Function: proxies chat messages to Groq's chat completions
// API server-side so the API key never reaches the browser. NOT deployed by
// default — this file just needs `supabase functions deploy assistant`
// plus a GROQ_API_KEY secret (`supabase secrets set GROQ_API_KEY=...`, get
// a free key at https://console.groq.com/keys) once the site owner is
// ready to turn the assistant on.
//
// Groq's API is OpenAI-compatible chat completions, so swapping to a
// different OpenAI-compatible provider later is a small, contained change:
// just the base URL, model name, and the auth header below.
//
// Request body:  { messages: { role: 'user' | 'assistant'; content: string }[],
//                   context?: { moduleTitle?: string; sectionHeading?: string } }
// Response body: { reply: string } | { error: string }

// Deno's remote-import style; only resolves when actually deployed to
// Supabase's Deno runtime, not part of the Vite/npm build.
// @ts-expect-error - remote Deno import, not resolved by the Node/Vite toolchain
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

// Fast, capable, and on Groq's free tier as of writing. Swap freely — see
// https://console.groq.com/docs/models for the current model list.
const GROQ_MODEL = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `You are the homework helper embedded in Neuron, a free AI-literacy course for high school
students. Your job is to explain how AI works and coach students through homework — never to produce
submittable work for them. Concretely:

- When asked to explain a concept (how a neural network learns, what a hallucination is, etc.), give a clear,
  accurate, age-appropriate explanation grounded in what's taught in the course.
- When asked to "do" an assignment (write my essay, solve my homework, answer these quiz questions), decline to
  produce the final answer. Instead ask guiding questions, explain the relevant concept, or offer to check the
  student's own attempt — the same "assistance vs. AI-generated work" line the course itself teaches.
- If you're not confident a factual claim is correct, say so rather than inventing a confident-sounding answer.
- Keep responses concise and conversational, appropriate for a student chat panel, not an essay.`;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });

  try {
    const { messages, context } = await req.json();

    const apiKey = Deno.env.get('GROQ_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'GROQ_API_KEY is not configured.' }), {
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const contextLine = context?.moduleTitle
      ? `\n\nThe student is currently in the "${context.moduleTitle}" module${
          context.sectionHeading ? `, section "${context.sectionHeading}"` : ''
        }.`
      : '';

    // Groq speaks the OpenAI chat-completions shape: system prompt is a
    // regular message in the array, not a separate top-level field.
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        max_tokens: 1024,
        messages: [{ role: 'system', content: SYSTEM_PROMPT + contextLine }, ...messages],
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      return new Response(JSON.stringify({ error: `Groq API error: ${detail}` }), {
        status: 502,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? '';

    return new Response(JSON.stringify({ reply }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }
});
