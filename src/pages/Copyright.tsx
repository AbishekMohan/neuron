import { ShieldCheck, ExternalLink } from 'lucide-react';

const ASSETS = [
  { name: 'React', source: 'Meta / npm', license: 'MIT', url: 'https://react.dev' },
  { name: 'React Router', source: 'Remix / npm', license: 'MIT', url: 'https://reactrouter.com' },
  { name: 'Tailwind CSS', source: 'npm', license: 'MIT', url: 'https://tailwindcss.com' },
  { name: 'Framer Motion', source: 'npm', license: 'MIT', url: 'https://framer.com/motion' },
  { name: 'lucide-react', source: 'npm', license: 'ISC', url: 'https://lucide.dev' },
  { name: 'three.js', source: 'npm', license: 'MIT', url: 'https://threejs.org' },
  { name: '@react-three/fiber', source: 'npm', license: 'MIT', url: 'https://docs.pmnd.rs/react-three-fiber' },
  { name: '@react-three/drei', source: 'npm', license: 'MIT', url: 'https://github.com/pmndrs/drei' },
  { name: 'Supabase JS', source: 'npm', license: 'MIT', url: 'https://supabase.com' },
  { name: 'Inter Tight (Font)', source: 'Google Fonts', license: 'OFL-1.1', url: 'https://fonts.google.com/specimen/Inter+Tight' },
  { name: 'Newsreader (Font)', source: 'Google Fonts', license: 'OFL-1.1', url: 'https://fonts.google.com/specimen/Newsreader' },
  { name: 'ParticleText Component', source: 'React Bits', license: 'MIT', url: 'https://reactbits.dev' },
];

const ORIGINALS = [
  'All site copy and educational modules',
  'Article text, flashcard decks, and quiz questions',
  'Mini-game data, logic, and challenges content',
  'ctagradient.jpg (Background image)',
  'favicon.svg & icons.svg',
  'Module instructional videos',
  'Procedurally generated 3D badges'
];

export default function Copyright() {
  return (
    <section className="px-6 sm:px-8 md:px-12 pt-28 md:pt-36 pb-24 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <p className="text-sky-400 text-xs tracking-widest uppercase mb-3">TSA Required Documentation</p>
        <h1 className="text-white text-3xl sm:text-4xl font-light leading-tight tracking-tight">
          Student Copyright Checklist
        </h1>
        <p className="text-white/50 text-sm mt-4 max-w-xl font-light leading-relaxed">
          An itemized, verified audit of all third-party open-source libraries, assets, fonts, and original content used in the creation of Neuron.
        </p>

        <div className="mt-12">
          <h2 className="text-xl text-white font-normal mb-6">Original Content (Created by Team)</h2>
          <div className="bg-sky-950/10 border border-sky-400/20 rounded-xl p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-6">
              <ShieldCheck className="w-6 h-6 text-sky-400 shrink-0 mt-0.5" />
              <p className="text-sm text-white/80 leading-relaxed">
                <strong className="text-white font-medium">Declaration of Originality:</strong> We certify that the following components were created entirely by the student team (Abishek Mohan and Faiz Khan) during the 2026–27 school year. No templates, unlicensed commercial assets, or AI-generated educational text were used as final output without proper academic citation.
              </p>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 pl-[2.5rem]">
              {ORIGINALS.map((item, i) => (
                <li key={i} className="text-white/60 text-sm flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-400/40 shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-xl text-white font-normal mb-6">Third-Party Libraries & Assets</h2>
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02]">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-wider bg-white/[0.02]">
                  <th className="py-4 px-6 font-medium">Asset / Library</th>
                  <th className="py-4 px-6 font-medium">Source</th>
                  <th className="py-4 px-6 font-medium">License</th>
                  <th className="py-4 px-6 font-medium">Link</th>
                </tr>
              </thead>
              <tbody className="text-sm text-white/80">
                {ASSETS.map((asset, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors last:border-0">
                    <td className="py-4 px-6 whitespace-nowrap text-white">{asset.name}</td>
                    <td className="py-4 px-6 whitespace-nowrap text-white/60">{asset.source}</td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="bg-white/10 text-white/80 px-2.5 py-1 rounded text-xs tracking-wide">
                        {asset.license}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <a 
                        href={asset.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-sky-400 hover:text-sky-300 transition-colors inline-flex items-center gap-1.5"
                      >
                        View source
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
