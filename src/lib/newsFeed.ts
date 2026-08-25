// Client side of the AI news strip: calls the `news-feed` Supabase Edge
// Function (server-side RSS fetch, avoids browser CORS), caches the
// result in localStorage for an hour so a page full of visitors doesn't
// hammer the source feeds on every load, and falls back to a small set
// of real, verified headlines if the feed or the function is ever
// unreachable — never a fabricated headline under a real outlet's name.

import { supabase } from './supabase';
import { MODULES } from '../data/modules';

export type Headline = { title: string; link: string; pubDate: string; source: string };

const CACHE_KEY = 'neuron-news-cache-v1';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// Verified directly (fetched, not generated) — see the session that
// added this feature. Only used if the live function is unreachable.
const FALLBACK_HEADLINES: Headline[] = [
  {
    title: 'Situational Awareness, star AI hedge fund that nearly imploded, now being probed by the SEC',
    link: 'https://techcrunch.com/2026/08/24/situational-awareness-star-ai-hedge-fund-that-nearly-imploded-now-being-probed-by-the-sec/',
    pubDate: 'Tue, 25 Aug 2026 00:23:12 +0000',
    source: 'TechCrunch',
  },
  {
    title: "Instinct's powerful AI assistant is raising privacy and security concerns",
    link: 'https://techcrunch.com/2026/08/24/instincts-powerful-ai-assistant-is-raising-privacy-and-security-concerns/',
    pubDate: 'Mon, 24 Aug 2026 18:03:55 +0000',
    source: 'TechCrunch',
  },
  {
    title: 'Valor, Point72 back General Intuition at $6B valuation as AI startup pushes into robotics',
    link: 'https://techcrunch.com/2026/08/24/valor-point72-back-general-intuition-at-6b-valuation-as-ai-startup-pushes-into-robotics/',
    pubDate: 'Mon, 24 Aug 2026 15:24:18 +0000',
    source: 'TechCrunch',
  },
];

type Cache = { fetchedAt: number; headlines: Headline[] };

function loadCache(): Cache | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed.fetchedAt !== 'number' || !Array.isArray(parsed.headlines)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveCache(headlines: Headline[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CACHE_KEY, JSON.stringify({ fetchedAt: Date.now(), headlines }));
}

export async function getHeadlines(): Promise<{ headlines: Headline[]; fetchedAt: number; isFallback: boolean }> {
  const cached = loadCache();
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS && cached.headlines.length > 0) {
    return { headlines: cached.headlines, fetchedAt: cached.fetchedAt, isFallback: false };
  }

  if (!supabase) {
    return { headlines: FALLBACK_HEADLINES, fetchedAt: Date.now(), isFallback: true };
  }

  try {
    const { data, error } = await supabase.functions.invoke<{ headlines?: Headline[] }>('news-feed');
    if (error || !data?.headlines || data.headlines.length === 0) {
      return { headlines: FALLBACK_HEADLINES, fetchedAt: Date.now(), isFallback: true };
    }
    saveCache(data.headlines);
    return { headlines: data.headlines, fetchedAt: Date.now(), isFallback: false };
  } catch {
    return { headlines: FALLBACK_HEADLINES, fetchedAt: Date.now(), isFallback: true };
  }
}

// Lightweight keyword match against the course's own module titles, so a
// headline can be tagged with which module it's most relevant to — no
// real classification, just a simple, transparent heuristic.
const MODULE_KEYWORDS: { moduleId: string; label: string; keywords: string[] }[] = [
  { moduleId: 'ethics', label: 'Ethics', keywords: ['ethic', 'privacy', 'bias', 'regulat', 'lawsuit', 'sec ', 'copyright', 'safety', 'misinformation'] },
  { moduleId: 'tools', label: 'Tools', keywords: ['tool', 'assistant', 'copilot', 'app', 'chatbot', 'agent', 'launch', 'release', 'update'] },
  { moduleId: 'real-world', label: 'Real World', keywords: ['job', 'industry', 'business', 'hospital', 'school', 'government', 'workforce', 'economy'] },
  { moduleId: 'creativity', label: 'Creativity', keywords: ['art', 'music', 'image', 'video', 'creative', 'design', 'generat'] },
  { moduleId: 'future', label: 'Future', keywords: ['robot', 'agi', 'future', 'research', 'breakthrough', 'valuation', 'funding', 'startup'] },
  { moduleId: 'fundamentals', label: 'Fundamentals', keywords: ['model', 'neural', 'train', 'learn', 'algorithm'] },
];

export function tagHeadline(title: string): string | null {
  const lower = title.toLowerCase();
  for (const m of MODULE_KEYWORDS) {
    if (m.keywords.some((k) => lower.includes(k))) return m.label;
  }
  return null;
}

export function moduleTitleFor(label: string): string | undefined {
  const entry = MODULE_KEYWORDS.find((m) => m.label === label);
  return entry ? MODULES.find((mod) => mod.id === entry.moduleId)?.title : undefined;
}

export function timeAgo(dateStr: string): string {
  const then = new Date(dateStr).getTime();
  if (Number.isNaN(then)) return '';
  const diffMs = Date.now() - then;
  const hours = Math.floor(diffMs / (60 * 60 * 1000));
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
