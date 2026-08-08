import type { AcademyCode } from "@/features/academy-content";

export type PublicAcademySlug =
  | "financial-literacy"
  | "coding"
  | "language"
  | "ai"
  | "biography"
  | "bible"
  | "digital-skills"
  | "data-analytics"
  | "ielts"
  | "science"
  | "mathematics"
  | "english";

export type AcademyMarketingConfig = {
  slug: PublicAcademySlug;
  academyCode: AcademyCode | "language" | "biography" | "bible";
  programmeId?: string;
  eyebrow: string;
  title: string;
  headline: string;
  summary: string;
  parentPromise: string;
  audience: string;
  outcomes: string[];
  curriculum: string[];
  freePreview: string[];
  premiumDepth: string[];
  proofPoints: string[];
  accent: string;
};

export const academyMarketing:
  Record<PublicAcademySlug, AcademyMarketingConfig> = {
  "financial-literacy": {
    slug: "financial-literacy",
    academyCode: "personal-finance",
    programmeId: "money-foundation",
    eyebrow: "FountainPrep Flagship Academy",
    title: "Financial Literacy Academy",
    headline:
      "Equip them with money skills for a brighter financial future.",
    summary:
      "A practical, story-rich financial education pathway that helps learners understand money, saving, budgeting, enterprise, borrowing, assets, investing and long-term financial choices.",
    parentPromise:
      "Give children and young people the language, habits and decision-making skills to handle money with greater confidence as they grow.",
    audience:
      "Designed for children, teenagers and young adults, with scenarios adapted to age, independence and real-life experience.",
    outcomes: [
      "Understand where money comes from and what it can do.",
      "Separate needs, wants, priorities and delayed gratification.",
      "Build purposeful saving and budgeting habits.",
      "Understand interest, debt, borrowing and repayment.",
      "Recognise assets, liabilities and productive ownership.",
      "Understand basic investing, compounding, diversification and risk.",
      "Explore enterprise, income creation and value exchange.",
      "Apply financial thinking to realistic family, school and young-adult decisions.",
    ],
    curriculum: [
      "Money, Value and Choice",
      "Needs, Wants and Priorities",
      "Saving with a Purpose",
      "Building a Working Budget",
      "Income, Work and Enterprise",
      "Interest and the Power of Compounding",
      "Borrowing, Debt and Repayment",
      "Assets, Liabilities and Ownership",
      "Investing, Diversification and Risk",
      "Protecting Money: Fraud, Scams and Insurance",
      "Real-Life Money Decisions",
      "Building a Personal Financial Future",
    ],
    freePreview: [
      "Money, value and choice",
      "Needs versus wants",
      "One practical saving challenge",
      "Introductory learner progress",
    ],
    premiumDepth: [
      "Full 12-part financial pathway",
      "Real-life stories and case decisions",
      "Budgeting and saving simulations",
      "Debt, interest and compounding challenges",
      "Assets and investing modules",
      "Assessments, progress reports and completion recognition",
    ],
    proofPoints: [
      "Real-life money stories",
      "Decision-based cases",
      "Practical activities",
      "Age-adaptive examples",
    ],
    accent: "emerald",
  },

  coding: {
    slug: "coding",
    academyCode: "coding",
    programmeId: "coding-explorer",
    eyebrow: "Coding Academy",
    title: "Coding Academy",
    headline:
      "Build logical thinking, creativity and confidence with technology.",
    summary:
      "Learners move from computational thinking into algorithms, variables, loops, decisions, debugging and guided projects.",
    parentPromise:
      "Help them become creators with technology, not just consumers of it.",
    audience:
      "Suitable for school-age beginners, teenagers and adults starting their coding journey.",
    outcomes: [
      "Break larger problems into smaller logical steps.",
      "Understand sequences, variables, loops and conditions.",
      "Read and explain simple code.",
      "Find and fix basic errors.",
      "Plan simple programmes and projects.",
      "Build foundations for Scratch, Python and web development.",
    ],
    curriculum: [
      "Thinking Like a Programmer",
      "Algorithms and Sequences",
      "Variables and Data",
      "Loops and Repetition",
      "Conditions and Decisions",
      "Debugging",
      "Functions and Reuse",
      "Mini Projects",
    ],
    freePreview: [
      "What coding is",
      "Algorithms and sequences",
      "One guided coding challenge",
    ],
    premiumDepth: [
      "Complete coding foundations",
      "Interactive code-style activities",
      "Project challenges",
      "Debugging practice",
      "Assessments and progress tracking",
    ],
    proofPoints: [
      "Project-led learning",
      "Interactive challenges",
      "No prior coding required",
    ],
    accent: "indigo",
  },

  language: {
    slug: "language",
    academyCode: "language",
    programmeId: "language-foundation",
    eyebrow: "Language Academy",
    title: "Language Academy",
    headline:
      "Help them speak with confidence and stay connected to language and culture.",
    summary:
      "Conversation-led language learning combines listening, pronunciation, vocabulary, speaking practice and cultural context.",
    parentPromise:
      "Strengthen communication, family connection and confidence across generations and cultures.",
    audience:
      "For children, teenagers and adults. Teaching examples and pace adapt to the learner’s age and goal.",
    outcomes: [
      "Use useful everyday greetings and phrases.",
      "Improve listening and pronunciation.",
      "Build vocabulary through guided conversation.",
      "Take part in short real-life exchanges.",
      "Develop cultural confidence.",
    ],
    curriculum: [
      "Yoruba",
      "Igbo",
      "Hausa",
      "French",
      "Mandarin",
    ],
    freePreview: [
      "Introductory greetings",
      "Listening practice",
      "First speaking activity",
    ],
    premiumDepth: [
      "Full conversation pathways",
      "Pronunciation practice",
      "Scenario role-play",
      "Progressive vocabulary",
      "Culture and family language",
    ],
    proofPoints: [
      "Speaking-first practice",
      "Audio-led learning",
      "Age-adaptive conversation",
      "Mandarin included",
    ],
    accent: "purple",
  },

  ai: {
    slug: "ai",
    academyCode: "ai",
    programmeId: "ai-explorer",
    eyebrow: "Artificial Intelligence Academy",
    title: "Artificial Intelligence Academy",
    headline:
      "Equip learners to use AI thoughtfully, safely and productively.",
    summary:
      "Understand how AI works, how to ask better questions, how to verify outputs and how to use AI for learning, creativity and problem-solving.",
    parentPromise:
      "Help them become capable, critical users of an important modern tool.",
    audience:
      "Designed for children, teenagers and adults with age-appropriate examples and practical activities.",
    outcomes: [
      "Understand what AI can and cannot do.",
      "Write clearer prompts.",
      "Check AI-generated information.",
      "Recognise bias, privacy and safety issues.",
      "Use AI to support creativity and learning.",
    ],
    curriculum: [
      "What Is Artificial Intelligence?",
      "Where We Meet AI",
      "Prompting Clearly",
      "Can AI Be Wrong?",
      "Privacy, Safety and Bias",
      "AI for Learning",
      "AI for Creativity",
      "Building Responsible AI Habits",
    ],
    freePreview: [
      "What AI is",
      "Where AI appears",
      "One prompting challenge",
    ],
    premiumDepth: [
      "Complete responsible AI pathway",
      "Prompting practice",
      "Verification activities",
      "Creative AI projects",
      "Assessments and progress",
    ],
    proofPoints: [
      "Responsible AI habits",
      "Practical exercises",
      "Critical thinking",
    ],
    accent: "violet",
  },

  biography: {
    slug: "biography",
    academyCode: "biography",
    programmeId: "greatness-foundation",
    eyebrow: "Biography of Greatness",
    title: "Biography of Greatness",
    headline:
      "Let remarkable lives teach courage, character, curiosity and possibility.",
    summary:
      "An immersive visual story academy where learners meet innovators, leaders, scientists, creators and change-makers, then turn their choices and impact into lessons for their own lives.",
    parentPromise:
      "Give younger learners role models whose stories expand what they believe is possible.",
    audience:
      "Especially powerful for children and teenagers, with story depth adapted by age.",
    outcomes: [
      "Understand the human story behind major achievements.",
      "Recognise persistence, discipline, creativity and courage.",
      "Connect historical impact to present-day choices.",
      "Reflect on character, service and responsibility.",
      "Build ambition without reducing success to fame or wealth.",
    ],
    curriculum: [
      "Nelson Mandela — Courage and Reconciliation",
      "Marie Curie — Curiosity and Scientific Persistence",
      "Katherine Johnson — Precision, Learning and Possibility",
      "Wangari Maathai — Environment, Community and Leadership",
      "Madam C. J. Walker — Enterprise and Opportunity",
      "Leonardo da Vinci — Curiosity Across Disciplines",
      "Martin Luther King Jr. — Voice, Service and Justice",
      "Malala Yousafzai — Education and Courage",
    ],
    freePreview: [
      "One complete visual biography story",
      "Character reflection",
      "Impact timeline",
    ],
    premiumDepth: [
      "Full biography library",
      "Portrait-led story slides",
      "Timelines and maps",
      "Decision moments and reflections",
      "Cross-story themes: courage, service, invention and leadership",
    ],
    proofPoints: [
      "Visual storytelling",
      "Real people and impact",
      "Character reflection",
      "Inspiring younger learners",
    ],
    accent: "gold",
  },

  bible: {
    slug: "bible",
    academyCode: "bible",
    programmeId: "bible-foundation",
    eyebrow: "Bible Academy",
    title: "Bible Academy",
    headline:
      "Experience memorable Bible stories through courage, character, choices and consequence.",
    summary:
      "A story-led learning academy that brings key Bible narratives to life through scenes, reflection and age-appropriate discussion.",
    parentPromise:
      "Offer learners a thoughtful way to explore familiar stories, values and character lessons.",
    audience:
      "Designed for families who choose Bible-based learning; content can remain optional within FountainPrep.",
    outcomes: [
      "Recall key stories and characters.",
      "Understand context, choices and consequences.",
      "Reflect on courage, wisdom, faith and responsibility.",
      "Discuss the meaning and values within the story.",
    ],
    curriculum: [
      "David and Goliath",
      "Joseph",
      "Moses and the Exodus",
      "Daniel",
      "Esther",
      "The Good Samaritan",
      "The Prodigal Son",
      "Paul",
    ],
    freePreview: [
      "One story journey",
      "Visual scene sequence",
      "Reflection activity",
    ],
    premiumDepth: [
      "Full story journeys",
      "Immersive scenes",
      "Character and values reflections",
      "Progressive story library",
    ],
    proofPoints: [
      "Story-led learning",
      "Immersive scenes",
      "Optional family pathway",
    ],
    accent: "navy",
  },

  "digital-skills": {
    slug: "digital-skills",
    academyCode: "digital-skills",
    programmeId: "digital-skills-foundation",
    eyebrow: "Digital Skills Academy",
    title: "Digital Skills Academy",
    headline:
      "Build practical technology skills for school, work and everyday life.",
    summary:
      "Develop confidence with files, documents, spreadsheets, presentations, email, research and digital safety.",
    parentPromise:
      "Equip learners to use technology confidently, productively and responsibly.",
    audience:
      "For school-age learners, teenagers and adults.",
    outcomes: [
      "Navigate computers and files.",
      "Create useful documents and presentations.",
      "Build simple spreadsheets.",
      "Research and communicate safely online.",
    ],
    curriculum: [
      "Computer Confidence",
      "Files and Cloud Storage",
      "Documents",
      "Spreadsheets",
      "Presentations",
      "Email",
      "Online Research",
      "Digital Safety",
    ],
    freePreview: ["Computer confidence", "File basics"],
    premiumDepth: ["Full productivity pathway", "Projects", "Assessments"],
    proofPoints: ["Practical productivity", "Digital safety", "Projects"],
    accent: "orange",
  },

  "data-analytics": {
    slug: "data-analytics",
    academyCode: "data-analytics",
    programmeId: "data-analytics-foundation",
    eyebrow: "Data Analytics Academy",
    title: "Data Analytics Academy",
    headline:
      "Build the ability to turn information into insight and better decisions.",
    summary:
      "Learn analytical thinking, data tables, cleaning, spreadsheet formulas, charts and interpretation.",
    parentPromise:
      "Develop a practical skill for study, work, business and modern decision-making.",
    audience:
      "Best suited to teenagers, university learners and adults.",
    outcomes: [
      "Frame useful questions.",
      "Structure and clean datasets.",
      "Use spreadsheet summaries.",
      "Choose effective charts.",
    ],
    curriculum: [
      "Thinking with Data",
      "Rows, Columns and Tables",
      "Cleaning Data",
      "Spreadsheet Summaries",
      "Charts",
      "Communicating Insight",
    ],
    freePreview: ["Thinking with data", "Table basics"],
    premiumDepth: ["Full analytics pathway", "Cases", "Projects"],
    proofPoints: ["Practical datasets", "Spreadsheet skills", "Decision focus"],
    accent: "cyan",
  },

  ielts: {
    slug: "ielts",
    academyCode: "ielts",
    programmeId: "ielts-academic",
    eyebrow: "IELTS Academy",
    title: "IELTS Academy",
    headline:
      "Build the skills and strategy needed for a stronger IELTS performance.",
    summary:
      "Structured preparation develops Listening, Reading, Writing and Speaking.",
    parentPromise:
      "Support a purposeful route toward university, work, migration or professional goals.",
    audience:
      "For teenagers and adults preparing for IELTS.",
    outcomes: [
      "Understand the test.",
      "Apply listening and reading strategies.",
      "Write clearer answers.",
      "Speak with confidence.",
    ],
    curriculum: ["Test Structure", "Listening", "Reading", "Writing", "Speaking"],
    freePreview: ["Test overview", "One diagnostic activity"],
    premiumDepth: ["Complete four-skill pathway", "Practice", "Assessments"],
    proofPoints: ["Four skills", "Test strategy", "Practice"],
    accent: "blue",
  },

  science: {
    slug: "science",
    academyCode: "science",
    programmeId: "science-foundation",
    eyebrow: "Science Academy",
    title: "Science Academy",
    headline:
      "Turn curiosity into scientific understanding, reasoning and discovery.",
    summary:
      "Explore living things, the human body, matter, forces, energy, Earth, space and investigation.",
    parentPromise:
      "Build scientific reasoning that supports school success and curiosity.",
    audience:
      "For children, teenagers and adults, with depth adapted to stage.",
    outcomes: [
      "Ask scientific questions.",
      "Explain evidence.",
      "Understand key science ideas.",
      "Plan simple investigations.",
    ],
    curriculum: ["Scientific Thinking", "Living Things", "Body", "Matter", "Forces", "Energy", "Earth & Space"],
    freePreview: ["Scientific thinking", "One investigation"],
    premiumDepth: ["Full science pathway", "Visual lessons", "Investigations"],
    proofPoints: ["Evidence-based", "Visual science", "Investigations"],
    accent: "green",
  },

  mathematics: {
    slug: "mathematics",
    academyCode: "mathematics",
    programmeId: "mathematics-foundation",
    eyebrow: "Mathematics Academy",
    title: "Mathematics Academy",
    headline:
      "Build mathematical confidence through understanding, reasoning and practice.",
    summary:
      "Develop number sense, operations, fractions, decimals, percentages, algebra, geometry and data.",
    parentPromise:
      "Help learners build strong foundations and solve problems independently.",
    audience:
      "Flexible for different ages and starting points.",
    outcomes: [
      "Reason with numbers.",
      "Choose efficient strategies.",
      "Understand fractions and percentages.",
      "Apply algebra, geometry and data.",
    ],
    curriculum: ["Place Value", "Operations", "Fractions", "Decimals", "Percentages", "Algebra", "Shape & Data"],
    freePreview: ["Foundation number concepts", "One interactive practice"],
    premiumDepth: ["Full maths pathway", "Worked examples", "Assessments"],
    proofPoints: ["Concept first", "Worked examples", "Practice"],
    accent: "rose",
  },

  english: {
    slug: "english",
    academyCode: "english",
    programmeId: "english-foundation",
    eyebrow: "English Academy",
    title: "English Academy",
    headline:
      "Build stronger reading, writing and communication skills.",
    summary:
      "Develop comprehension, vocabulary, grammar, paragraph writing, speaking and editing.",
    parentPromise:
      "Give learners communication skills that strengthen schoolwork and self-expression.",
    audience:
      "For school learners, teenagers and adults.",
    outcomes: [
      "Read for meaning.",
      "Build vocabulary and grammar.",
      "Write organised paragraphs.",
      "Speak and edit clearly.",
    ],
    curriculum: ["Reading", "Vocabulary", "Grammar", "Writing", "Speaking", "Editing"],
    freePreview: ["Reading foundation", "Vocabulary activity"],
    premiumDepth: ["Full English pathway", "Writing practice", "Speaking activities"],
    proofPoints: ["Reading", "Writing", "Speaking"],
    accent: "amber",
  },
};

export const publicAcademySlugs =
  Object.keys(academyMarketing) as PublicAcademySlug[];

export function getAcademyMarketing(
  slug: string,
): AcademyMarketingConfig | null {
  return academyMarketing[slug as PublicAcademySlug] ?? null;
}
