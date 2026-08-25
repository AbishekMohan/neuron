// Central citation registry. Every factual claim in the course content
// (article sections, flashcards, game cards, quiz explanations) references
// a source by id rather than asserting facts unsourced. Grouped by module
// for the bibliography rendered on the Reference page.
export type Source = {
  id: string;
  title: string;
  publisher: string;
  year: string;
  url: string;
  note?: string;
};

export const SOURCE_GROUPS: { module: string; sources: Source[] }[] = [
  {
    module: 'AI Fundamentals',
    sources: [
      {
        id: 'ai4k12-five-big-ideas',
        title: 'Five Big Ideas in AI (poster)',
        publisher: 'AI4K12 Initiative (AAAI + CSTA, NSF grant DRL-1846073)',
        year: '2019',
        url: 'https://ai4k12.org/resources/big-ideas-poster/',
      },
      {
        id: 'turing-1950',
        title: 'Computing Machinery and Intelligence',
        publisher: 'Mind, Vol. LIX, No. 236 (Oxford University Press)',
        year: '1950',
        url: 'https://courses.cs.umbc.edu/471/papers/turing.pdf',
      },
      {
        id: 'dartmouth-1955',
        title: 'A Proposal for the Dartmouth Summer Research Project on Artificial Intelligence',
        publisher: 'Dartmouth College / AI Magazine 27(4)',
        year: '1955',
        url: 'https://home.dartmouth.edu/about/artificial-intelligence-ai-coined-dartmouth',
      },
      {
        id: 'alexnet-2012',
        title: 'ImageNet Classification with Deep Convolutional Neural Networks',
        publisher: 'Advances in NeurIPS 25 (Krizhevsky, Sutskever, Hinton)',
        year: '2012',
        url: 'https://papers.nips.cc/paper_files/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html',
        note: '15.3% top-5 error vs. 26.2% for the runner-up in ILSVRC-2012.',
      },
      {
        id: 'attention-2017',
        title: 'Attention Is All You Need',
        publisher: 'NeurIPS 2017 / arXiv:1706.03762 (Vaswani et al.)',
        year: '2017',
        url: 'https://arxiv.org/abs/1706.03762',
      },
      {
        id: 'nobel-physics-2024',
        title: 'The Nobel Prize in Physics 2024 (press release)',
        publisher: 'Royal Swedish Academy of Sciences',
        year: '2024',
        url: 'https://www.nobelprize.org/prizes/physics/2024/press-release/',
        note: 'Awarded to John J. Hopfield and Geoffrey E. Hinton for foundational neural-network discoveries.',
      },
      {
        id: 'lighthill-1973',
        title: 'Artificial Intelligence: A General Survey (the "Lighthill Report")',
        publisher: 'UK Science Research Council',
        year: '1973',
        url: 'https://rodsmith.nz/wp-content/uploads/Lighthill_1973_Report.pdf',
      },
    ],
  },
  {
    module: 'Practical AI Tools & Techniques',
    sources: [
      {
        id: 'prompt-report-2024',
        title: 'The Prompt Report: A Systematic Survey of Prompting Techniques',
        publisher: 'arXiv:2406.06608 (Schulhoff, Ilie, Balepur, et al.)',
        year: '2024',
        url: 'https://arxiv.org/abs/2406.06608',
      },
      {
        id: 'hallucination-survey-2023',
        title: 'Survey of Hallucination in Natural Language Generation',
        publisher: 'ACM Computing Surveys 55(12)',
        year: '2023',
        url: 'https://doi.org/10.1145/3571730',
      },
      {
        id: 'mata-v-avianca-2023',
        title: 'Mata v. Avianca, Inc., 678 F. Supp. 3d 443 (Opinion & Order on Sanctions)',
        publisher: 'U.S. District Court, S.D.N.Y.',
        year: '2023',
        url: 'https://www.law.berkeley.edu/wp-content/uploads/archive/2025/12/Mata-v-Avianca-Inc.pdf',
        note: 'Lawyers sanctioned after submitting six fabricated, AI-invented case citations.',
      },
      {
        id: 'ed-gov-ai-report-2023',
        title: 'Artificial Intelligence and the Future of Teaching and Learning',
        publisher: 'U.S. Dept. of Education, Office of Educational Technology',
        year: '2023',
        url: 'https://www.ed.gov/sites/ed/files/documents/ai-report/ai-report.pdf',
      },
      {
        id: 'day-of-ai',
        title: 'Day of AI: Free K-12 AI Literacy Curriculum',
        publisher: 'MIT RAISE',
        year: '2022',
        url: 'https://www.dayofai.net/curriculum',
      },
    ],
  },
  {
    module: 'Ethical AI Usage',
    sources: [
      {
        id: 'nist-ai-rmf-2023',
        title: 'AI Risk Management Framework (AI RMF 1.0), NIST AI 100-1',
        publisher: 'National Institute of Standards and Technology',
        year: '2023',
        url: 'https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf',
      },
      {
        id: 'nist-genai-profile-2024',
        title: 'AI RMF: Generative AI Profile, NIST AI 600-1',
        publisher: 'National Institute of Standards and Technology',
        year: '2024',
        url: 'https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf',
      },
      {
        id: 'gender-shades-2018',
        title: 'Gender Shades: Intersectional Accuracy Disparities in Commercial Gender Classification',
        publisher: 'PMLR Vol. 81 / ACM FAccT 2018 (Buolamwini & Gebru)',
        year: '2018',
        url: 'https://proceedings.mlr.press/v81/buolamwini18a.html',
        note: 'Error rate up to 34.7% for darker-skinned women vs. 0.8% for lighter-skinned men across three commercial systems.',
      },
      {
        id: 'nist-frvt-2019',
        title: 'Face Recognition Vendor Test (FRVT) Part 3: Demographic Effects, NISTIR 8280',
        publisher: 'National Institute of Standards and Technology',
        year: '2019',
        url: 'https://nvlpubs.nist.gov/nistpubs/ir/2019/nist.ir.8280.pdf',
      },
      {
        id: 'unesco-competency-2024',
        title: 'AI Competency Framework for Students',
        publisher: 'UNESCO',
        year: '2024',
        url: 'https://www.unesco.org/en/articles/ai-competency-framework-students',
      },
      {
        id: 'ftc-edtech-2022',
        title: 'Policy Statement on Education Technology and COPPA',
        publisher: 'U.S. Federal Trade Commission',
        year: '2022',
        url: 'https://www.ftc.gov/legal-library/browse/policy-statement-federal-trade-commission-education-technology-childrens-online-privacy-protection',
      },
      {
        id: 'cisa-deepfakes-2023',
        title: 'Contextualizing Deepfake Threats to Organizations',
        publisher: 'NSA, FBI, and CISA (joint Cybersecurity Information Sheet)',
        year: '2023',
        url: 'https://www.cisa.gov/news-events/alerts/2023/09/12/nsa-fbi-and-cisa-release-cybersecurity-information-sheet-deepfake-threats',
      },
      {
        id: 'mla-genai-citation',
        title: 'How Do I Cite Generative AI in MLA Style?',
        publisher: 'MLA Style Center, Modern Language Association',
        year: 'current',
        url: 'https://style.mla.org/citing-generative-ai/',
      },
      {
        id: 'common-sense-media-2024',
        title: 'The Dawn of the AI Era: Teens, Parents, and the Adoption of Generative AI at Home and School',
        publisher: 'Common Sense Media (Ipsos survey)',
        year: '2024',
        url: 'https://www.commonsensemedia.org/sites/default/files/research/report/2024-the-dawn-of-the-ai-era_final-release-for-web.pdf',
        note: 'Roughly 7 in 10 teens surveyed had used a generative AI tool.',
      },
    ],
  },
  {
    module: 'AI in the Real World',
    sources: [
      {
        id: 'alphafold-nature-2021',
        title: 'Highly Accurate Protein Structure Prediction with AlphaFold',
        publisher: 'Nature 596, 583–589 (Jumper, Evans, Pritzel, et al.)',
        year: '2021',
        url: 'https://www.nature.com/articles/s41586-021-03819-2',
      },
      {
        id: 'nobel-chemistry-2024',
        title: 'The Nobel Prize in Chemistry 2024 (press release)',
        publisher: 'Royal Swedish Academy of Sciences',
        year: '2024',
        url: 'https://www.nobelprize.org/prizes/chemistry/2024/press-release/',
        note: 'Half jointly to Demis Hassabis and John M. Jumper for protein structure prediction (AlphaFold); the other half to David Baker for computational protein design.',
      },
      {
        id: 'sae-j3016-2021',
        title: 'J3016: Taxonomy and Definitions for Terms Related to Driving Automation Systems',
        publisher: 'SAE International',
        year: '2021',
        url: 'https://legacy.sae.org/binaries//content/assets/cm/content/blog/sae-j3016-visual-chart_5.3.21.pdf',
      },
      {
        id: 'nhtsa-ads',
        title: 'Automated Driving Systems',
        publisher: 'National Highway Traffic Safety Administration (U.S. DOT)',
        year: 'ongoing',
        url: 'https://www.nhtsa.gov/vehicle-manufacturers/automated-driving-systems',
      },
      {
        id: 'cfpb-circular-2023',
        title: 'Circular 2023-03: Adverse Action Notification Requirements',
        publisher: 'U.S. Consumer Financial Protection Bureau',
        year: '2023',
        url: 'https://www.consumerfinance.gov/about-us/newsroom/cfpb-issues-guidance-on-credit-denials-by-lenders-using-artificial-intelligence/',
      },
      {
        id: 'bls-ai-employment-2026',
        title: 'Artificial Intelligence, Information Technology, and Employment, 2024–34',
        publisher: 'U.S. Bureau of Labor Statistics',
        year: '2026',
        url: 'https://www.bls.gov/opub/ted/2026/artificial-intelligence-information-technology-and-employment-2024-34.htm',
      },
    ],
  },
  {
    module: 'AI & Creativity',
    sources: [
      {
        id: 'ddpm-2020',
        title: 'Denoising Diffusion Probabilistic Models',
        publisher: 'arXiv:2006.11239 (Ho, Jain, Abbeel: UC Berkeley / NeurIPS 2020)',
        year: '2020',
        url: 'https://arxiv.org/abs/2006.11239',
      },
      {
        id: 'latent-diffusion-2021',
        title: 'High-Resolution Image Synthesis with Latent Diffusion Models',
        publisher: 'arXiv:2112.10752 (Rombach, Blattmann, Lorenz, Esser, Ommer)',
        year: '2021',
        url: 'https://arxiv.org/abs/2112.10752',
      },
      {
        id: 'copyright-office-part2-2025',
        title: 'Copyright and Artificial Intelligence, Part 2: Copyrightability',
        publisher: 'U.S. Copyright Office',
        year: '2025',
        url: 'https://www.copyright.gov/ai/Copyright-and-Artificial-Intelligence-Part-2-Copyrightability-Report.pdf',
      },
      {
        id: 'thaler-v-perlmutter-2025',
        title: 'Thaler v. Perlmutter, No. 23-5233',
        publisher: 'U.S. Court of Appeals for the D.C. Circuit',
        year: '2025',
        url: 'https://media.cadc.uscourts.gov/opinions/docs/2025/03/23-5233.pdf',
        note: 'Confirmed human authorship is required for copyright protection.',
      },
      {
        id: 'copyright-office-part3-2025',
        title: 'Copyright and Artificial Intelligence, Part 3: Generative AI Training (pre-publication)',
        publisher: 'U.S. Copyright Office',
        year: '2025',
        url: 'https://www.copyright.gov/ai/Copyright-and-Artificial-Intelligence-Part-3-Generative-AI-Training-Report-Pre-Publication-Version.pdf',
      },
      {
        id: 'copyright-office-part1-2024',
        title: 'Copyright and Artificial Intelligence, Part 1: Digital Replicas',
        publisher: 'U.S. Copyright Office',
        year: '2024',
        url: 'https://www.copyright.gov/ai/Copyright-and-Artificial-Intelligence-Part-1-Digital-Replicas-Report.pdf',
      },
    ],
  },
  {
    module: 'The Future of AI',
    sources: [
      {
        id: 'intl-ai-safety-report-2026',
        title: 'International AI Safety Report',
        publisher: 'Independent international expert panel, chaired by Yoshua Bengio',
        year: '2026',
        url: 'https://internationalaisafetyreport.org/publication/international-ai-safety-report-2026',
      },
      {
        id: 'aaai-presidential-panel-2025',
        title: 'AAAI 2025 Presidential Panel on the Future of AI Research',
        publisher: 'Association for the Advancement of Artificial Intelligence',
        year: '2025',
        url: 'https://aaai.org/wp-content/uploads/2025/03/AAAI-2025-PresPanel-Report-Digital-3.7.25.pdf',
        note: '76% of surveyed researchers said scaling up current approaches alone is unlikely to yield AGI.',
      },
      {
        id: 'stanford-hai-ai-index-2026',
        title: 'AI Index Report 2026',
        publisher: 'Stanford Institute for Human-Centered AI (HAI)',
        year: '2026',
        url: 'https://hai.stanford.edu/ai-index/2026-ai-index-report',
      },
      {
        id: 'eu-ai-act-2024',
        title: 'Regulation (EU) 2024/1689 (the EU AI Act)',
        publisher: 'European Parliament and Council',
        year: '2024',
        url: 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng',
      },
    ],
  },
  {
    module: 'Sustainable & Efficient AI',
    sources: [
      {
        id: 'strubell-mit-2019',
        title: 'Training a Single AI Model Can Emit as Much Carbon as Five Cars in Their Lifetimes (reporting on Strubell, Ganesh & McCallum, U. Mass. Amherst)',
        publisher: 'MIT Technology Review',
        year: '2019',
        url: 'https://www.technologyreview.com/2019/06/06/239031/training-a-single-ai-model-can-emit-as-much-carbon-as-five-cars-in-their-lifetimes/',
        note: 'Estimated 626,000+ lbs CO2e for one large Transformer trained with neural architecture search — roughly 5x an average car\'s lifetime emissions (incl. manufacture).',
      },
      {
        id: 'iea-energy-ai-2025',
        title: 'AI: Five Charts That Put Data-Centre Energy Use – and Emissions – into Context (reporting on the IEA\'s Energy and AI report)',
        publisher: 'Carbon Brief',
        year: '2025',
        url: 'https://www.carbonbrief.org/ai-five-charts-that-put-data-centre-energy-use-and-emissions-into-context',
        note: 'Data centres: just over 1% of global electricity in 2024, growing ~12%/year since 2017, projected to reach 945 TWh by 2030; AI\'s share of data-centre power projected to rise from 5-15% to 35-50% by 2030.',
      },
      {
        id: 'loihi-open-neuromorphic',
        title: 'A Look at Loihi (Intel neuromorphic chip)',
        publisher: 'Open Neuromorphic',
        year: 'current',
        url: 'https://open-neuromorphic.org/neuromorphic-computing/hardware/loihi-intel/',
        note: '~130,000 neurons, 130 million synapses, <1.5W; pre-silicon benchmarks showed 5,000x+ better energy-delay product than conventional hardware on a sparse-coding task.',
      },
      {
        id: 'truenorth-open-neuromorphic',
        title: 'A Look at TrueNorth (IBM neuromorphic chip)',
        publisher: 'Open Neuromorphic',
        year: 'current',
        url: 'https://open-neuromorphic.org/neuromorphic-computing/hardware/truenorth-ibm/',
        note: '1 million neurons, 256 million synapses, demonstrated 2014; as little as 65mW running a typical real-time neural-network application.',
      },
    ],
  },
];

export const ALL_SOURCES: Source[] = SOURCE_GROUPS.flatMap((g) => g.sources);

const SOURCE_MAP = new Map(ALL_SOURCES.map((s) => [s.id, s]));

export function getSource(id: string): Source | undefined {
  return SOURCE_MAP.get(id);
}
