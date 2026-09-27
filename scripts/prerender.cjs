// Static prerender (brief P1-3, lowest-effort version). The app is a client
// SPA, so without this every route serves an empty <div id="root"> —
// nothing for crawlers, view-source judges, or JS-disabled browsers.
//
// What this does: after `vite build`, copies dist/index.html once per route
// with three swaps: the <title>, the canonical link, and a <noscript> block
// (real h1 + description + links) injected right after #root. The JS bundle
// reference is untouched, so React hydrates normally when JS runs; the
// noscript content only ever renders without JS. Vercel serves these static
// files directly (vercel.json excludes nothing under these paths from static),
// falling back to /index.html only for unknown routes.
//
// Keep ROUTES in sync with App.tsx and public/sitemap.xml.
const fs = require('node:fs');
const path = require('node:path');

const SITE = 'https://neurontsa.vercel.app';
const DIST = path.resolve(__dirname, '..', 'dist');

const ROUTES = [
  { path: '/', h1: 'Neuron — AI Learning Portal for High School Students', desc: 'A free, interactive AI literacy course covering AI fundamentals, practical tools, and ethical use. Earn XP, unlock badges, and learn with mini-games.' },
  { path: '/modules', h1: 'Learning Modules', desc: 'Three core modules — AI Fundamentals, Practical AI Tools, Ethical AI Use — plus bonus modules. Each has five steps: article, flashcards, video, mini-game, quiz.' },
  { path: '/modules/fundamentals', h1: 'AI Fundamentals', desc: 'What AI is, machine learning, neural networks, large language models, and hallucinations.' },
  { path: '/modules/tools', h1: 'Practical AI Tools & Techniques', desc: 'How to use AI tools effectively and ethically in school: prompting, study workflows, verifying output.' },
  { path: '/modules/ethics', h1: 'Ethical AI Usage', desc: 'Bias, fairness, academic integrity, data privacy, and responsible AI habits.' },
  { path: '/modules/real-world', h1: 'AI in the Real World', desc: 'Where AI actually shows up, industry by industry.' },
  { path: '/modules/creativity', h1: 'AI & Creativity', desc: 'Human-AI collaboration in art, music, and writing.' },
  { path: '/modules/future', h1: 'The Future of AI', desc: 'Where the technology is headed, and how to stay literate.' },
  { path: '/modules/sustainability', h1: 'Sustainable & Efficient AI', desc: 'The real, physical cost behind every AI response.' },
  { path: '/challenges', h1: 'Challenges', desc: 'Mini-games that test what stuck: Hallucination Hunt, Ethics Courtroom, Bias Detective, AI Royale, and more.' },
  { path: '/reference', h1: 'Sources & References', desc: 'Every factual claim on this site, tied to its citable source.' },
  { path: '/glossary', h1: 'AI Glossary', desc: 'Key AI vocabulary, defined for high school students.' },
  { path: '/tools', h1: 'AI Tools Compared', desc: 'Practical AI tools compared side by side, with honest trade-offs.' },
  { path: '/work-log', h1: 'Student Work Log', desc: 'Chronological log of project milestones and team contributions, 2026–27 school year. TSA required documentation.' },
  { path: '/copyright', h1: 'Student Copyright Checklist', desc: 'Itemized audit of third-party libraries, fonts, and original student content. TSA required documentation.' },
  { path: '/process', h1: 'Design Process', desc: 'Methods, decisions, and trade-offs behind Neuron: design system, accessibility, sourcing, stack, and performance.' },
  { path: '/privacy', h1: 'Privacy', desc: 'What Neuron stores, where, and how to delete it.' },
  { path: '/accessibility-guide', h1: 'Accessibility Guide', desc: 'How to use Neuron with screen readers, keyboards, and reduced-motion settings.' },
];

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const shell = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');

for (const route of ROUTES) {
  let html = shell;
  const title = route.path === '/' ? 'Neuron — AI Learning Portal for High School Students' : `${route.h1} — Neuron`;
  html = html.replace(/<title>.*?<\/title>/, `<title>${esc(title)}</title>`);
  // Per-route canonical so crawlers never see duplicate-content ambiguity.
  if (/<link rel="canonical"[^>]*>/.test(html)) {
    html = html.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${SITE}${route.path}" />`);
  } else {
    html = html.replace('</head>', `    <link rel="canonical" href="${SITE}${route.path}" />\n  </head>`);
  }
  // Route-specific meta description for the static snapshot.
  if (/<meta name="description"[^>]*>/.test(html)) {
    html = html.replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(route.desc)}" />`);
  }
  // The no-JS payload: real heading, description, and links to the spine of
  // the site. Placed after #root so it can never interfere with hydration.
  const noscript =
    `<noscript><header style="max-width:48rem;margin:4rem auto;padding:0 1.5rem;font-family:system-ui,sans-serif;color:#fff;background:#000">` +
    `<p style="color:#38bdf8;font-size:.75rem;letter-spacing:.1em">NEURON</p>` +
    `<h1 style="font-size:1.75rem;font-weight:300">${esc(route.h1)}</h1>` +
    `<p style="color:#ccc">${esc(route.desc)}</p>` +
    `<nav><a href="/modules" style="color:#38bdf8">Learning modules</a> · ` +
    `<a href="/challenges" style="color:#38bdf8">Challenges</a> · ` +
    `<a href="/reference" style="color:#38bdf8">Sources</a> · ` +
    `<a href="/work-log" style="color:#38bdf8">Work log</a> · ` +
    `<a href="/copyright" style="color:#38bdf8">Copyright</a></nav>` +
    `<p style="color:#888;font-size:.8rem">This page is interactive with JavaScript enabled.</p>` +
    `</header></noscript>`;
  html = html.replace('<div id="root"></div>', `<div id="root"></div>\n    ${noscript}`);

  const outDir = path.join(DIST, route.path === '/' ? '' : route.path);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html);
  console.log(`prerendered ${route.path}`);
}
console.log('prerender done.');
