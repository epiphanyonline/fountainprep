import type { AcademyCode } from "@/features/academy-content";

export type PublicAcademySlug =
  | "language" | "ai" | "coding" | "ielts" | "data-analytics"
  | "financial-literacy" | "digital-skills" | "mathematics"
  | "english" | "science";

export type AcademyMarketingConfig = {
  slug: PublicAcademySlug;
  academyCode: AcademyCode | "language";
  programmeId?: string;
  title: string;
  headline: string;
  summary: string;
  audience: string;
  outcomes: string[];
  curriculum: string[];
  proofPoints: string[];
  startHref?: string;
};

export const academyMarketing: Record<PublicAcademySlug, AcademyMarketingConfig> = {
  language: {
    slug: "language", academyCode: "language", title: "Language Academy",
    headline: "Help learners speak, understand and connect with confidence.",
    summary: "Practical AI-supported and live-tutor language learning through speaking, listening, vocabulary, pronunciation and real-life conversation.",
    audience: "Suitable from age 4 through adulthood. Age conditions the teaching style but does not prevent access.",
    outcomes: ["Speak useful everyday phrases.", "Improve listening and pronunciation.", "Build vocabulary through guided conversation.", "Reconnect with family, culture and heritage."],
    curriculum: ["Yoruba", "Igbo", "Hausa", "French", "Mandarin"],
    proofPoints: ["AI and live tutors", "Age-adaptive teaching", "Progress and streaks"],
    startHref: "/parent/students?mode=booking&category=language",
  },
  ai: {
    slug: "ai", academyCode: "ai", programmeId: "ai-explorer", title: "AI Academy",
    headline: "Teach learners to use AI productively, safely and creatively.",
    summary: "A practical introduction to artificial intelligence, prompting, verification, privacy and responsible use—without empty AI hype.",
    audience: "For children, teenagers and adults, with examples adapted to the learner.",
    outcomes: ["Understand what AI can and cannot do.", "Write clearer prompts.", "Verify AI-generated information.", "Protect privacy and use AI responsibly."],
    curriculum: ["What Is AI?", "Where AI Appears", "Good Prompts", "AI Mistakes", "Safety and Privacy"],
    proofPoints: ["Project-based", "Responsible AI", "Age-adaptive"],
  },
  coding: {
    slug: "coding", academyCode: "coding", programmeId: "coding-explorer", title: "Coding Academy",
    headline: "Build computational thinking before memorising syntax.",
    summary: "Understand instructions, algorithms, variables, loops and conditions before progressing into Scratch, Python or web development.",
    audience: "For curious beginners, school-age learners, teenagers and adults.",
    outcomes: ["Break problems into steps.", "Understand variables, loops and conditions.", "Plan programmes logically.", "Prepare for Scratch, Python and web development."],
    curriculum: ["What Is Coding?", "Algorithms", "Variables", "Loops", "Conditions"],
    proofPoints: ["Concept-first", "Mini projects", "No prior coding required"],
  },
  ielts: {
    slug: "ielts", academyCode: "ielts", programmeId: "ielts-academic", title: "IELTS Academy",
    headline: "Prepare strategically for the band score you need.",
    summary: "Structured Academic and General Training IELTS preparation across Listening, Reading, Writing and Speaking.",
    audience: "For teenagers and adults preparing for university, employment, migration or professional registration.",
    outcomes: ["Understand the test.", "Apply listening and reading strategies.", "Write clearer answers.", "Speak with confidence."],
    curriculum: ["IELTS Structure", "Listening", "Reading", "Writing", "Speaking"],
    proofPoints: ["Academic and General", "Speaking practice", "Writing assessment"],
  },
  "data-analytics": {
    slug: "data-analytics", academyCode: "data-analytics", programmeId: "data-analytics-foundation", title: "Data Analytics Academy",
    headline: "Learn to turn raw information into better decisions.",
    summary: "Start with analytical thinking, then progress through tables, cleaning, Excel formulas, charts and business interpretation.",
    audience: "For teenagers, university learners, career changers, entrepreneurs and professionals.",
    outcomes: ["Frame useful questions.", "Structure and clean data.", "Use spreadsheet summaries.", "Communicate findings with charts."],
    curriculum: ["Thinking with Data", "Tables", "Data Cleaning", "Excel Formulas", "Charts"],
    proofPoints: ["Business examples", "Excel foundation", "Decision-focused"],
  },
  "financial-literacy": {
    slug: "financial-literacy", academyCode: "personal-finance", programmeId: "money-foundation", title: "Financial Literacy Academy",
    headline: "Build strong money habits before expensive mistakes are made.",
    summary: "Practical financial education covering needs and wants, saving, budgeting, borrowing, interest, productive assets and investment risk.",
    audience: "For children, teenagers, young adults and families. Examples adapt to age and experience.",
    outcomes: ["Make intentional spending decisions.", "Save with purpose.", "Create a budget.", "Understand borrowing, assets and risk."],
    curriculum: ["What Is Money For?", "Needs and Wants", "Saving", "Budgeting", "Interest and Debt", "Assets and Investing"],
    proofPoints: ["Practical decisions", "Age-adaptive", "Productive assets"],
  },
  "digital-skills": {
    slug: "digital-skills", academyCode: "digital-skills", programmeId: "digital-skills-foundation", title: "Digital Skills Academy",
    headline: "Develop practical technology skills for school and work.",
    summary: "Learn computer navigation, files, documents, spreadsheets, presentations, email, research and online safety.",
    audience: "For school-age beginners through adults returning to technology.",
    outcomes: ["Use computers confidently.", "Create documents and presentations.", "Build spreadsheets.", "Research and communicate safely."],
    curriculum: ["Computer Confidence", "Files", "Documents", "Spreadsheets", "Presentations", "Email", "Research", "Safety"],
    proofPoints: ["Practical workplace skills", "Projects", "Safety built in"],
  },
  mathematics: {
    slug: "mathematics", academyCode: "mathematics", programmeId: "mathematics-foundation", title: "Mathematics Academy",
    headline: "Build understanding, not just answers.",
    summary: "Concept-based mathematics covering number, operations, fractions, decimals, percentages, algebra, geometry and data.",
    audience: "Learners enter at the stage matching their understanding rather than being excluded by age or school year.",
    outcomes: ["Reason with numbers.", "Choose efficient methods.", "Understand fractions and percentages.", "Apply algebra, geometry and data."],
    curriculum: ["Place Value", "Operations", "Fractions", "Decimals", "Percentages", "Algebra", "Geometry and Data"],
    proofPoints: ["Concept progression", "Real-life problems", "Flexible entry"],
  },
  english: {
    slug: "english", academyCode: "english", programmeId: "english-foundation", title: "English Academy",
    headline: "Help learners read, write and speak with confidence.",
    summary: "A complete pathway covering comprehension, vocabulary, grammar, paragraphs, creative writing, speaking and editing.",
    audience: "For school learners, teenagers and adults strengthening practical communication.",
    outcomes: ["Read for meaning.", "Build vocabulary and grammar.", "Write organised paragraphs.", "Speak clearly and edit independently."],
    curriculum: ["Comprehension", "Vocabulary", "Grammar", "Paragraphs", "Creative Writing", "Speaking", "Editing"],
    proofPoints: ["Reading, writing and speaking", "Voice activities", "Practical communication"],
  },
  science: {
    slug: "science", academyCode: "science", programmeId: "science-foundation", title: "Science Academy",
    headline: "Turn curiosity into evidence, explanation and discovery.",
    summary: "Explore scientific thinking, living things, the human body, matter, forces, energy, Earth, space and investigation.",
    audience: "For curious learners from primary age through adulthood, with depth adapted to their stage.",
    outcomes: ["Ask testable questions.", "Understand living systems and matter.", "Explain forces and energy.", "Design fair investigations."],
    curriculum: ["Scientific Thinking", "Living Things", "Human Body", "Matter", "Forces", "Energy", "Earth and Space", "Investigation"],
    proofPoints: ["Evidence-based", "Practical investigations", "Broad foundation"],
  },
};

export const publicAcademySlugs = Object.keys(academyMarketing) as PublicAcademySlug[];
export function getAcademyMarketing(slug: string) {
  return academyMarketing[slug as PublicAcademySlug] ?? null;
}
