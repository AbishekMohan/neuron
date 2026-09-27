// Supabase Edge Function: proxies chat messages to Groq's chat completions
// API server-side so the API key never reaches the browser. NOT deployed by
// default — deploy with `supabase functions deploy assistant` plus a
// GROQ_API_KEY secret (`supabase secrets set GROQ_API_KEY=...`, get a free
// key at https://console.groq.com/keys) once the site owner is ready to turn
// the assistant on. Ships with a per-IP sliding-window rate limit (see
// rateLimited below) so the endpoint is safe to expose to logged-out
// visitors; the client (src/lib/assistant.ts) already degrades gracefully
// when the function or key is missing.
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

// Abuse friction (brief P2-1): per-IP sliding-window rate limit so strangers
// can't burn through the Groq quota on judging day. In-memory, so it holds
// per edge isolate rather than globally — enough to blunt casual abuse, not a
// hard accounting guarantee. If abuse ever matters, promote this to a
// Supabase-table counter keyed by IP. Limits are intentionally generous for
// real classroom use: 20 requests/minute, 30 messages/4000 chars each.
const WINDOW_MS = 60_000;
const MAX_HITS = 20;
const MAX_MESSAGES = 30;
const MAX_CHARS_EACH = 4000;
const hitsByIp = new Map<string, number[]>();

function rateLimited(ip: string): { limited: boolean; retryAfter: number } {
  const now = Date.now();
  const recent = (hitsByIp.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_HITS) {
    const oldest = recent[0];
    return { limited: true, retryAfter: Math.ceil((WINDOW_MS - (now - oldest)) / 1000) };
  }
  recent.push(now);
  hitsByIp.set(ip, recent);
  // Bound memory: drop IPs whose windows have fully expired on each pass.
  if (hitsByIp.size > 5000) {
    for (const [key, times] of hitsByIp) {
      if (times.length === 0 || now - times[times.length - 1] >= WINDOW_MS) hitsByIp.delete(key);
    }
  }
  return { limited: false, retryAfter: 0 };
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });

  try {
    // No auth required on purpose: judges grade logged out, and the client
    // degrades gracefully when the function or key is missing. The rate
    // limit above is what makes logged-out access safe to offer.
    const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
    const { limited, retryAfter } = rateLimited(ip);
    if (limited) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded. Try again shortly.' }), {
        status: 429,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json', 'Retry-After': String(retryAfter) },
      });
    }

    const { messages, context } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
      return new Response(JSON.stringify({ error: 'Invalid message history.' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }
    for (const m of messages) {
      if (typeof m?.content !== 'string' || m.content.length > MAX_CHARS_EACH) {
        return new Response(JSON.stringify({ error: 'Message too long.' }), {
          status: 400,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        });
      }
    }

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
