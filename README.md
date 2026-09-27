# Neuron — AI Learning Portal

**Live:** https://neurontsa.vercel.app · **TSA HS Webmaster 2026–27**

Neuron is a free, interactive AI literacy course for high school students (grades 9–12). It answers the 2026–27 TSA Webmaster challenge: design an AI learning portal that demystifies AI, showcases practical tools, and teaches ethical use in academic settings.

---

## What the site does

- **Three core learning modules** (five steps each: article → flashcards → video → mini-game → quiz):
  - AI Fundamentals — what AI actually is, machine learning, LLMs, hallucinations
  - Practical AI Tools & Techniques — how to use AI tools effectively in school
  - Ethical AI Usage — bias, fairness, academic integrity, privacy
  - Plus four bonus modules: AI in the Real World, AI & Creativity, The Future of AI, Sustainable & Efficient AI
- **Gamification:** XP, levels, and 3D procedurally generated badges earned by completing modules
- **Challenges suite:** Hallucination Hunt, Ethics Courtroom, Bias Detective, Debug the AI, Concept Map Builder, Ethics Story, Adaptive Quiz, Duel Mode
- **Train Your Companion:** a client-side bag-of-words perceptron you train by labeling examples — demonstrates ML in real time, in the browser, with zero server calls
- **Leaderboard + profiles:** optional Supabase-backed sync; fully usable without an account

---

## Stack

| Layer | Technology |
|---|---|
| UI | React 19 + TypeScript |
| Bundler | Vite 8 |
| Styling | Tailwind CSS 3 |
| Routing | React Router 7 |
| Animation | Framer Motion 13 |
| 3D | Three.js + @react-three/fiber + @react-three/drei |
| Backend / Auth | Supabase (auth, progress sync, leaderboard) |
| AI assistant | Groq API (via Supabase Edge Function) |
| Deploy | Vercel |
| Fonts | Inter Tight + Newsreader (self-hosted, OFL-1.1) |

---

## Local setup

```bash
git clone https://github.com/AbishekMohan/neuron.git
cd neuron
npm install
cp .env.example .env          # fill in the two Supabase vars
npm run dev
```

The site works without Supabase credentials — progress saves to localStorage and features that need a backend degrade gracefully to a demo state.

### Environment variables

| Variable | Where to get it |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project settings → API |
| `VITE_SUPABASE_ANON_KEY` | Supabase project settings → API |

The AI assistant also requires a `GROQ_API_KEY` set as a Supabase secret:
```bash
supabase secrets set GROQ_API_KEY=gsk_...
supabase functions deploy assistant
```

---

## Accessibility

Neuron targets WCAG 2.1 AA. High contrast and dyslexia-friendly font are permanent defaults. Reduced motion: all Three.js scenes and animations are disabled when `prefers-reduced-motion: reduce` is set.

---

## Competition documentation

- [/work-log](https://neurontsa.vercel.app/work-log) — Student Work Log
- [/copyright](https://neurontsa.vercel.app/copyright) — Student Copyright Checklist

---

## Credits

Built by **Abishek Mohan** and **Faiz Khan** for TSA HS Webmaster 2026–27.
