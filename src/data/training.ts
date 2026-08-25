// Content for "Train Your Companion": the labeled examples students train
// their client-side classifier on, split so the classifier's real skill
// (not just how much a student clicked) can be measured honestly.
//
// - `pool`: shown to the student for labeling. Their *own* label is what
//   the classifier trains on. Not the ground truth `label` here. So a
//   student who deliberately mislabels these is training their companion
//   on bad data, on purpose. That's the point of the feature.
// - `testSet`: never shown for labeling. Used only to score the trained
//   classifier's accuracy against ground truth, so "mastery" reflects
//   whether the companion actually learned the pattern, not how many
//   times the student clicked a button.
// - `capstone`: one further unseen example, used for the side-by-side
//   comparison against a reference model trained on the same pool with
//   ground-truth labels (see lib/companion.ts).
//
// pool and testSet are each deliberately balanced 50/50 between the two
// classes, so an untrained classifier (which predicts a fixed class with
// no learned weights) scores ~50% on testSet. Chance level. And real
// training should move accuracy away from that baseline in either
// direction depending on label quality.

export type TrainingCategoryId = 'prompts' | 'bias' | 'hallucination';

export type TrainingExample = {
  id: string;
  text: string;
  /** Ground truth: 1 = positiveLabel, 0 = negativeLabel. Hidden from the student until after they label it. */
  label: 0 | 1;
  explanation: string;
};

export type TrainingCategory = {
  id: TrainingCategoryId;
  title: string;
  tagline: string;
  positiveLabel: string;
  negativeLabel: string;
  pool: TrainingExample[];
  testSet: TrainingExample[];
  capstone: TrainingExample;
};

export const TRAINING_CATEGORIES: TrainingCategory[] = [
  {
    id: 'prompts',
    title: 'Prompt Quality',
    tagline: 'Good prompts are specific: they give context, constraints, and a format.',
    positiveLabel: 'Good prompt',
    negativeLabel: 'Bad prompt',
    pool: [
      { id: 'pr-p1', text: 'write something', label: 0, explanation: 'No topic, no length, no audience. The AI has nothing to work with.' },
      { id: 'pr-p2', text: 'Explain photosynthesis in 3 sentences for a 9th grader, avoiding jargon.', label: 1, explanation: 'Specific topic, length, audience, and a constraint.' },
      { id: 'pr-p3', text: 'help', label: 0, explanation: 'Help with what? No task is actually specified.' },
      { id: 'pr-p4', text: 'Summarize this article in 5 bullet points, focusing on the economic impact.', label: 1, explanation: 'Clear format (bullets), count, and focus.' },
      { id: 'pr-p5', text: 'make it better', label: 0, explanation: '"Better" how? No criteria given for what "better" means.' },
      { id: 'pr-p6', text: 'Rewrite this paragraph in a more formal tone, keeping it under 100 words.', label: 1, explanation: 'Names the change (tone) and a hard constraint (word count).' },
      { id: 'pr-p7', text: 'idk just do the thing', label: 0, explanation: '"The thing" is never defined.' },
      { id: 'pr-p8', text: 'List 3 pros and 3 cons of remote work for a high school debate assignment.', label: 1, explanation: 'Exact count, structure, and purpose.' },
      { id: 'pr-p9', text: 'fix', label: 0, explanation: 'Fix what, and what would "fixed" look like? Unanswerable as written.' },
      { id: 'pr-p10', text: 'Compare mitosis and meiosis in a table, highlighting exactly 4 differences.', label: 1, explanation: 'Names both subjects, format, and exact scope.' },
    ],
    testSet: [
      { id: 'pr-t1', text: 'stuff', label: 0, explanation: 'Not a task at all.' },
      { id: 'pr-t2', text: 'Draft a 150-word email to a teacher requesting a deadline extension, polite tone.', label: 1, explanation: 'Length, recipient, purpose, and tone all specified.' },
      { id: 'pr-t3', text: 'do my homework', label: 0, explanation: 'No subject, no problem, and it asks the AI to do the work rather than help with it.' },
      { id: 'pr-t4', text: 'Explain the causes of World War I in 4 numbered points suitable for a middle schooler.', label: 1, explanation: 'Count, format, and target audience are all given.' },
      { id: 'pr-t5', text: '??', label: 0, explanation: 'Not even a request.' },
      { id: 'pr-t6', text: 'Generate 5 practice algebra problems on solving for x, with an answer key.', label: 1, explanation: 'Exact count, topic, and a deliverable (answer key).' },
      { id: 'pr-t7', text: 'write me something good', label: 0, explanation: '"Something good" specifies nothing about topic, length, or format.' },
      { id: 'pr-t8', text: 'Translate this sentence into Spanish and explain any idioms used.', label: 1, explanation: 'Clear task plus a specific follow-up requirement.' },
      { id: 'pr-t9', text: 'type something up', label: 0, explanation: 'No topic, format, or purpose given.' },
      { id: 'pr-t10', text: 'Write a 200-word persuasive paragraph arguing for a school recycling program, aimed at 8th graders.', label: 1, explanation: 'Length, stance, and audience are all specified.' },
      { id: 'pr-t11', text: 'answer this', label: 0, explanation: 'Answer what? Nothing is actually attached or specified.' },
      { id: 'pr-t12', text: 'Create a study guide with 6 key terms and definitions for a unit on the water cycle.', label: 1, explanation: 'Exact count, format, and topic.' },
      { id: 'pr-t13', text: 'make a thing about stuff', label: 0, explanation: 'Neither "thing" nor "stuff" specifies anything.' },
      { id: 'pr-t14', text: 'Proofread this cover letter for grammar only, and list each correction separately.', label: 1, explanation: 'Narrow scope (grammar only) and a clear output format.' },
      { id: 'pr-t15', text: 'give me info', label: 0, explanation: 'Info about what? No topic at all.' },
      { id: 'pr-t16', text: 'Generate a weekly study schedule for 3 subjects, balanced across 5 days, in table form.', label: 1, explanation: 'Scope, constraints, and format are all specified.' },
    ],
    capstone: {
      id: 'pr-cap',
      text: 'Give me 3 discussion questions about the ethics of AI-generated art, appropriate for a high school class.',
      label: 1,
      explanation: 'Topic, count, and audience are all specified. A good prompt.',
    },
  },
  {
    id: 'bias',
    title: 'Bias Detection',
    tagline: 'Fair statements are hedged and evidence-based; biased ones generalize from a group to an individual.',
    positiveLabel: 'Fair',
    negativeLabel: 'Biased',
    pool: [
      { id: 'bi-p1', text: 'Nurses are typically women, and doctors are typically men.', label: 0, explanation: 'States a historical pattern as if it were a rule about individuals.' },
      { id: 'bi-p2', text: 'Both men and women are well represented in medicine today, though the field has had gender imbalances that are shifting over time.', label: 1, explanation: 'Acknowledges history without generalizing to individuals.' },
      { id: 'bi-p3', text: 'People from that country are naturally bad at math.', label: 0, explanation: 'Attributes a skill to nationality with no evidence.' },
      { id: 'bi-p4', text: 'Math ability varies by individual; performance differences across countries often reflect access to education, not innate skill.', label: 1, explanation: 'Points to a real, evidenced cause instead of a stereotype.' },
      { id: 'bi-p5', text: 'Older employees struggle to learn new technology.', label: 0, explanation: 'A blanket claim about an entire age group.' },
      { id: 'bi-p6', text: 'Comfort with new technology varies by individual experience and training, not strictly by age.', label: 1, explanation: 'Names the actual variable (experience) instead of age.' },
      { id: 'bi-p7', text: 'Only boys are good at competitive video games.', label: 0, explanation: 'Excludes an entire gender with no basis.' },
      { id: 'bi-p8', text: 'Competitive gaming skill depends on practice and interest, and top players include people of all genders.', label: 1, explanation: 'Names the real driver (practice) and states the actual makeup of top players.' },
      { id: 'bi-p9', text: 'That neighborhood has more crime because of who lives there.', label: 0, explanation: 'Implies crime is caused by the identity of residents.' },
      { id: 'bi-p10', text: 'Crime rates correlate more strongly with factors like poverty and policing patterns than with who lives in an area.', label: 1, explanation: 'Points to studied structural causes instead of the people themselves.' },
    ],
    testSet: [
      { id: 'bi-t1', text: 'Artists are usually unreliable with deadlines.', label: 0, explanation: 'A profession-wide generalization with no evidence.' },
      { id: 'bi-t2', text: 'Reliability with deadlines depends on the individual and the project, not on someone’s profession.', label: 1, explanation: 'Correctly attributes the trait to the individual.' },
      { id: 'bi-t3', text: 'Immigrants take jobs away from citizens.', label: 0, explanation: 'A widely repeated claim that oversimplifies labor economics.' },
      { id: 'bi-t4', text: 'Economic research shows the relationship between immigration and employment is complex and varies by industry and region.', label: 1, explanation: 'Reflects the actual, more complicated research.' },
      { id: 'bi-t5', text: 'Teenagers can’t be trusted with responsibility.', label: 0, explanation: 'A sweeping claim about an entire age group.' },
      { id: 'bi-t6', text: 'Trustworthiness with responsibility varies by individual and depends more on experience than age alone.', label: 1, explanation: 'Names the real factor (experience).' },
      { id: 'bi-t7', text: 'People who don’t go to college aren’t as smart.', label: 0, explanation: 'Equates one life path with intelligence, unsupported.' },
      { id: 'bi-t8', text: 'Intelligence isn’t measured by whether someone attends college; capable people choose many different paths.', label: 1, explanation: 'Rejects the false equivalence directly.' },
      { id: 'bi-t9', text: 'Women are too emotional to be good leaders.', label: 0, explanation: 'A sweeping, unsupported claim about an entire gender.' },
      { id: 'bi-t10', text: 'Leadership effectiveness depends on individual skills and experience, not gender.', label: 1, explanation: 'Attributes the trait correctly, to the individual.' },
      { id: 'bi-t11', text: 'Kids from single-parent homes always struggle in school.', label: 0, explanation: '"Always" overgeneralizes a genuinely mixed, well-studied outcome.' },
      { id: 'bi-t12', text: 'Academic outcomes for kids in single-parent homes vary widely and depend on many factors, including support systems.', label: 1, explanation: 'Reflects the actual, more nuanced research.' },
      { id: 'bi-t13', text: 'People who work night shifts are lazy during the day.', label: 0, explanation: 'Attributes a physiological effect to a character flaw.' },
      { id: 'bi-t14', text: 'Night-shift workers often face disrupted sleep schedules that affect daytime energy, not a lack of effort.', label: 1, explanation: 'Names the real, physiological cause.' },
      { id: 'bi-t15', text: 'Rural communities are less intelligent than urban ones.', label: 0, explanation: 'A baseless claim conflating geography with intelligence.' },
      { id: 'bi-t16', text: 'Intelligence is distributed similarly across rural and urban populations; differences in outcomes often reflect access to resources.', label: 1, explanation: 'Points to the actual, resource-based explanation.' },
    ],
    capstone: {
      id: 'bi-cap',
      text: 'Left-handed people are worse at sports.',
      label: 0,
      explanation: 'A blanket claim about handedness with no supporting evidence. In some sports, left-handedness is actually an advantage.',
    },
  },
  {
    id: 'hallucination',
    title: 'Hallucination Detection',
    tagline: 'Accurate claims are hedged and often cite where they come from; hallucinated ones assert popular myths as fact.',
    positiveLabel: 'Accurate',
    negativeLabel: 'Hallucinated',
    pool: [
      { id: 'ha-p1', text: 'The Great Wall of China is visible from space with the naked eye.', label: 0, explanation: 'A famous myth. NASA has said it’s not reliably visible from low orbit.' },
      { id: 'ha-p2', text: 'The Great Wall of China is not reliably visible from low Earth orbit with the naked eye, according to NASA.', label: 1, explanation: 'Correct, and cites the source.' },
      { id: 'ha-p3', text: 'Albert Einstein failed math in school.', label: 0, explanation: 'A popular myth. Einstein excelled at math from a young age.' },
      { id: 'ha-p4', text: 'Albert Einstein excelled at math from a young age; the “failed math” story is a popular myth.', label: 1, explanation: 'Correct, and directly debunks the myth.' },
      { id: 'ha-p5', text: 'Humans only use 10% of their brains.', label: 0, explanation: 'A long-debunked myth with no basis in neuroscience.' },
      { id: 'ha-p6', text: 'Brain imaging shows humans use virtually all of their brain, just not all regions simultaneously.', label: 1, explanation: 'Reflects actual neuroscience.' },
      { id: 'ha-p7', text: 'The Sahara Desert is the largest desert in the world.', label: 0, explanation: 'A common mix-up. By area, Antarctica is the largest desert.' },
      { id: 'ha-p8', text: 'Antarctica is the largest desert in the world by area, since “desert” is defined by low precipitation, not heat.', label: 1, explanation: 'Correct, and explains why the answer is surprising.' },
      { id: 'ha-p9', text: 'Goldfish have a memory span of only a few seconds.', label: 0, explanation: 'A popular myth. Goldfish memory research shows otherwise.' },
      { id: 'ha-p10', text: 'Goldfish can remember things for months, not just a few seconds, according to animal behavior research.', label: 1, explanation: 'Correct, and cites the type of source.' },
    ],
    testSet: [
      { id: 'ha-t1', text: 'Lightning never strikes the same place twice.', label: 0, explanation: 'False. Tall structures get struck repeatedly.' },
      { id: 'ha-t2', text: 'Lightning frequently strikes the same location repeatedly, especially tall structures like skyscrapers.', label: 1, explanation: 'Correct.' },
      { id: 'ha-t3', text: 'Bats are blind.', label: 0, explanation: 'False. Most bat species can see.' },
      { id: 'ha-t4', text: 'Most bat species can see, and some see quite well; many also use echolocation.', label: 1, explanation: 'Correct, and adds the real reason bats seem "blind".' },
      { id: 'ha-t5', text: 'You lose most of your body heat through your head.', label: 0, explanation: 'A myth. Heat loss is roughly proportional to skin exposed, not concentrated in the head.' },
      { id: 'ha-t6', text: 'Heat loss is roughly proportional to how much skin is exposed, not specifically concentrated in the head.', label: 1, explanation: 'Correct.' },
      { id: 'ha-t7', text: 'The Great Depression started immediately after the 1929 stock market crash with no warning signs.', label: 0, explanation: 'False. Historians point to warning signs beforehand.' },
      { id: 'ha-t8', text: 'Economic historians point to warning signs before the 1929 crash, including speculative buying and uneven wealth distribution.', label: 1, explanation: 'Correct, and cites the type of source.' },
      { id: 'ha-t9', text: 'Vikings wore horned helmets in battle.', label: 0, explanation: 'A myth from 19th-century costume design. No historical evidence supports it.' },
      { id: 'ha-t10', text: 'There\'s no reliable historical evidence that Vikings wore horned helmets in battle; that image comes from 19th-century costume design.', label: 1, explanation: 'Correct, and explains where the myth actually came from.' },
      { id: 'ha-t11', text: 'Chameleons change color mainly to match their surroundings for camouflage.', label: 0, explanation: 'A common misconception. Camouflage isn\'t the main driver.' },
      { id: 'ha-t12', text: 'Chameleons change color mainly to communicate and regulate temperature, not primarily for camouflage.', label: 1, explanation: 'Reflects the actual science.' },
      { id: 'ha-t13', text: 'Coffee was first discovered in Brazil.', label: 0, explanation: 'Coffee is generally traced to Ethiopia, not Brazil.' },
      { id: 'ha-t14', text: 'Coffee is generally traced to Ethiopia, not Brazil, according to historical accounts.', label: 1, explanation: 'Correct, and cites the type of source.' },
      { id: 'ha-t15', text: 'The Berlin Wall fell in 1991.', label: 0, explanation: 'The Berlin Wall fell in 1989, not 1991.' },
      { id: 'ha-t16', text: 'The Berlin Wall fell in 1989, not 1991 as sometimes misremembered.', label: 1, explanation: 'Correct date.' },
    ],
    capstone: {
      id: 'ha-cap',
      text: 'Napoleon Bonaparte was unusually short for his time.',
      label: 0,
      explanation: 'A famous myth. By period standards, Napoleon was roughly average height; the "short" idea comes from a unit mix-up and British caricature.',
    },
  },
];

export function getTrainingCategory(id: TrainingCategoryId) {
  return TRAINING_CATEGORIES.find((c) => c.id === id);
}
