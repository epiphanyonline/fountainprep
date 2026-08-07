import type {
  CurriculumCourse,
  CurriculumLesson,
  CurriculumUnit,
  LearnerGoal,
  SupportedLanguage,
  VocabularyItem,
} from "@/app/types/fountaintalk";

export type FoundationPhrase = {
  id: string;
  title: string;
  objective: string;
  source: string;
  target: string;
  pronunciation?: string;
  pronunciationTip?: string;
  acceptedAnswers: string[];
  scenarioPrompt: string;
  completionPoints?: number;
  nativeAudioUrl?: string;
  slowAudioUrl?: string;
};

type Options = {
  language: SupportedLanguage;
  languageName: string;
  description: string;
  phrases: FoundationPhrase[];
  suitableGoals?: LearnerGoal[];
};

function vocabularyFor(phrase: FoundationPhrase): VocabularyItem[] {
  return [{
    source: phrase.source,
    target: phrase.target,
    pronunciation: phrase.pronunciation,
    pronunciationTip: phrase.pronunciationTip,
    nativeAudioUrl: phrase.nativeAudioUrl,
    slowAudioUrl: phrase.slowAudioUrl,
  }];
}

function createLesson(
  language: SupportedLanguage,
  phrase: FoundationPhrase,
  lessonNumber: number,
): CurriculumLesson {
  const vocabulary = vocabularyFor(phrase);

  return {
    id: `${language}-foundation-unit-1-lesson-${lessonNumber}`,
    language,
    level: "foundation",
    unitNumber: 1,
    lessonNumber,
    title: phrase.title,
    description: phrase.objective,
    objective: phrase.objective,
    theme: "Greetings and introductions",
    tags: ["foundation", "speaking", "listening", "conversation"],
    suitableGoals: ["conversation", "family", "culture", "heritage", "travel", "education"],
    scenarioContext: "community",
    teachingTone: "encouraging",
    vocabulary,
    completionPoints: phrase.completionPoints ?? 20,
    estimatedMinutes: 10,
    steps: [
      {
        id: `${phrase.id}-step-1`,
        type: "introduction",
        title: "Welcome",
        teacherPrompt: `Today we are learning ${phrase.source.toLowerCase()}. Are you ready?`,
        acceptedAnswers: ["Yes", "Ready", "I am ready"],
        hints: ["Say yes when you are ready."],
        successReply: "Wonderful. Let us begin.",
        retryReply: "That is okay. Tell me when you are ready.",
      },
      {
        id: `${phrase.id}-step-2`,
        type: "teach",
        title: "Learn the phrase",
        teacherPrompt: `${phrase.source} is ${phrase.target}. Listen carefully.`,
        expectedPhrase: phrase.target,
        acceptedAnswers: phrase.acceptedAnswers,
        hints: phrase.pronunciationTip ? [phrase.pronunciationTip] : ["Listen carefully."],
        successReply: "Excellent listening.",
        retryReply: "Good try. Listen once more, then repeat it.",
        nativeAudioUrl: phrase.nativeAudioUrl,
        slowAudioUrl: phrase.slowAudioUrl,
        pronunciationTip: phrase.pronunciationTip,
        vocabulary,
      },
      {
        id: `${phrase.id}-step-3`,
        type: "repeat",
        title: "Repeat after Ayo",
        teacherPrompt: `Now say it with me: ${phrase.target}`,
        expectedPhrase: phrase.target,
        acceptedAnswers: phrase.acceptedAnswers,
        hints: phrase.pronunciationTip ? [phrase.pronunciationTip] : ["Say it slowly and clearly."],
        successReply: `Brilliant. You said ${phrase.target}.`,
        retryReply: `Good effort. Listen again and repeat ${phrase.target}.`,
        nativeAudioUrl: phrase.nativeAudioUrl,
        slowAudioUrl: phrase.slowAudioUrl,
        pronunciationTip: phrase.pronunciationTip,
      },
      {
        id: `${phrase.id}-step-4`,
        type: "roleplay",
        title: "Use it in real life",
        teacherPrompt: phrase.scenarioPrompt,
        expectedPhrase: phrase.target,
        acceptedAnswers: phrase.acceptedAnswers,
        hints: [`Use the phrase ${phrase.target}.`],
        successReply: "Exactly right. That is how you use it.",
        retryReply: "Think about the phrase we have just practised and try again.",
      },
      {
        id: `${phrase.id}-step-5`,
        type: "review",
        title: "Lesson review",
        teacherPrompt: `Before we finish, how do you say ${phrase.source.toLowerCase()}?`,
        expectedPhrase: phrase.target,
        acceptedAnswers: phrase.acceptedAnswers,
        hints: ["Remember the phrase you have just practised."],
        successReply: `Fantastic work. You completed the ${phrase.title} lesson.`,
        retryReply: "Let us practise it one more time.",
      },
    ],
  };
}

export function createFoundationCourse({
  language,
  languageName,
  description,
  phrases,
  suitableGoals = ["conversation", "education", "family", "culture", "heritage", "travel"],
}: Options): CurriculumCourse {
  const lessons = phrases.map((phrase, index) =>
    createLesson(language, phrase, index + 1),
  );

  const unit: CurriculumUnit = {
    id: `${language}-foundation-unit-1`,
    language,
    level: "foundation",
    unitNumber: 1,
    title: "Greetings and Introductions",
    description: "Build confidence using essential greetings and introductions.",
    theme: "Greetings and introductions",
    learningOutcomes: [
      "Use essential greetings appropriately.",
      "Introduce yourself in a short conversation.",
      "Recognise and respond to basic expressions.",
      "Speak target phrases with growing confidence.",
    ],
    suitableGoals,
    lessons,
  };

  return {
    id: `${language}-foundation`,
    language,
    level: "foundation",
    title: `${languageName} Foundation`,
    description,
    proficiencyCode: "A0",
    learningOutcomes: [
      `Use basic ${languageName} greetings appropriately.`,
      "Introduce yourself and respond to simple questions.",
      "Recognise essential words and expressions.",
      "Take part in short guided conversations.",
    ],
    suitableGoals,
    units: [unit],
    estimatedHours: 8,
    completionPoints: lessons.reduce((sum, lesson) => sum + lesson.completionPoints, 0),
  };
}
