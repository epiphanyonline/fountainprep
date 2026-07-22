export const NON_LANGUAGE_ACADEMY_IDS = [
  "mathematics",
  "coding",
  "music",
  "wealth",
  "ethics",
  "bible",
] as const;

export type NonLanguageAcademyId =
  (typeof NON_LANGUAGE_ACADEMY_IDS)[number];

export type AcademyId =
  | "languages"
  | NonLanguageAcademyId;

export type LearnerAgeGroup =
  | "3-5"
  | "6-9"
  | "10-13"
  | "14-17"
  | "adult";

/**
 * Controls which parts of a course the learner can access.
 */
export type AcademyAccessTier =
  | "free"
  | "foundation"
  | "premium"
  | "professional";

export type TutorStatus =
  | "ready"
  | "listening"
  | "thinking"
  | "speaking"
  | "completed";

export type ClassroomPhase =
  | "arrival"
  | "ask-name"
  | "desired-outcome"
  | "lesson-promise"
  | "prior-knowledge"
  | "teaching"
  | "reflection"
  | "summary"
  | "assessment"
  | "completed";

export type MicrophoneMode =
  | "muted"
  | "ready"
  | "listening"
  | "processing";

export type AyoPose =
  | "neutral"
  | "welcome"
  | "open-hands"
  | "explain"
  | "point-slide"
  | "listen"
  | "think"
  | "encourage"
  | "celebrate"
  | "walk-left"
  | "walk-right";

/**
 * Existing lesson kinds are preserved.
 *
 * New kinds support long-form lecturer-style lessons,
 * stories, diagrams, case studies and assessments.
 */
export type StepKind =
  | "welcome"
  | "teach"
  | "story"
  | "concept"
  | "illustration"
  | "diagram"
  | "example"
  | "worked-example"
  | "case-study"
  | "decision-framework"
  | "question"
  | "practice"
  | "reflection"
  | "challenge"
  | "summary"
  | "quiz"
  | "assessment"
  | "transition";

export type StepResponseType =
  | "none"
  | "choice"
  | "multiple-choice"
  | "text"
  | "number"
  | "boolean"
  | "raise-hand";

export type LessonChoice = {
  id: string;
  label: string;
  value?: string;
  explanation?: string;
};

export type LessonVisualType =
  | "emoji"
  | "illustration"
  | "diagram"
  | "chart"
  | "timeline"
  | "comparison"
  | "process"
  | "formula"
  | "quote"
  | "image"
  | "cards";

export type LessonVisual = {
  type?: LessonVisualType;
  emoji?: string;
  title: string;
  subtitle?: string;
  items?: string[];
  imageUrl?: string;
  imageAlt?: string;
  caption?: string;
};

export type LessonMedia = {
  audioUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
  durationSeconds?: number;
};

export type LessonStep = {
  id: string;
  title: string;
  kind: StepKind;
  responseType: StepResponseType;

  /**
   * The complete words Ayo should teach or say.
   */
  teacherPrompt: string;

  /**
   * Optional shorter text displayed on the classroom slide.
   */
  displayText?: string;

  question?: string;
  choices?: LessonChoice[];
  acceptedAnswers?: string[];
  hint?: string;
  explanation?: string;

  visual?: LessonVisual;
  media?: LessonMedia;
  code?: string;

  ayoPose?: AyoPose;

  /**
   * Allows lecture scenes to continue automatically.
   */
  autoAdvance?: boolean;

  /**
   * Suggested duration before moving to the next scene.
   */
  durationSeconds?: number;

  /**
   * Learners may interrupt these scenes by raising a hand.
   */
  allowRaiseHand?: boolean;

  /**
   * Keeps the microphone closed while Ayo lectures.
   */
  microphoneEnabled?: boolean;

  silencePrompt?: string;

  /**
   * Marks important scenes for progress and revision.
   */
  isCheckpoint?: boolean;

  /**
   * Optional points earned by completing this scene.
   */
  points?: number;
};

export type AcademyAssessmentType =
  | "quiz"
  | "case-study"
  | "project"
  | "term-assessment"
  | "capstone";

export type AcademyAssessment = {
  id: string;
  title: string;
  description: string;
  type: AcademyAssessmentType;
  passingScore?: number;
  completionPoints?: number;
  lessonIds?: string[];
  instructions?: string[];
};

export type AcademyLesson = {
  id: string;
  title: string;
  objective: string;
  completionPoints: number;
  estimatedMinutes: number;

  /**
   * Existing lessons continue using `steps`.
   * Each step can now represent a richer teaching scene.
   */
  steps: LessonStep[];

  classPromise?: string;
  learningOutcomes?: string[];
  priorKnowledgePrompt?: string;
  previousLessonSummary?: string;

  accessTier?: AcademyAccessTier;
  assessment?: AcademyAssessment;
  certificateEligible?: boolean;
};

export type AcademyUnit = {
  id: string;
  unitNumber: number;
  title: string;
  description: string;
  lessons: AcademyLesson[];

  estimatedWeeks?: number;
  learningOutcomes?: string[];
  accessTier?: AcademyAccessTier;
  assessment?: AcademyAssessment;
};

export type AcademyTerm = {
  id: string;
  termNumber: number;
  title: string;
  description: string;
  units: AcademyUnit[];

  estimatedWeeks?: number;
  accessTier?: AcademyAccessTier;
  assessment?: AcademyAssessment;

  certificate?: {
    title: string;
    description?: string;
    minimumScore?: number;
  };
};

export type AcademyCourseLevel =
  | "foundation"
  | "beginner"
  | "intermediate"
  | "advanced"
  | "professional";

export type AcademyCourse = {
  id: string;
  academyId: NonLanguageAcademyId;
  title: string;
  subtitle: string;
  level: AcademyCourseLevel;
  ageGroups: LearnerAgeGroup[];

  /**
   * Kept for compatibility with the current classroom.
   */
  units: AcademyUnit[];

  /**
   * Year-long programmes may organise units into terms.
   */
  terms?: AcademyTerm[];

  durationMonths?: number;
  estimatedHours?: number;
  accessTier?: AcademyAccessTier;

  learningOutcomes?: string[];

  certificate?: {
    title: string;
    description?: string;
    minimumScore?: number;
  };

  capstone?: AcademyAssessment;
};

export type AcademyDefinition = {
  id: AcademyId;
  title: string;
  shortTitle: string;
  tagline: string;
  icon: string;
  href: string;
  accent: string;
  accentDark: string;
  soft: string;
  available: boolean;
};

export type AcademyProgress = {
  academyId: NonLanguageAcademyId;
  learnerId: string;

  currentUnitIndex: number;
  currentLessonIndex: number;
  currentStepIndex: number;

  /**
   * Optional term tracking for year-long programmes.
   */
  currentTermIndex?: number;
  currentCourseId?: string;

  completedStepIds: string[];
  completedLessonIds: string[];

  completedUnitIds?: string[];
  completedTermIds?: string[];
  completedAssessmentIds?: string[];
  earnedCertificateIds?: string[];

  points: number;
  streak: number;

  lastStudiedAt: string | null;
  completedAt: string | null;
};

export type ClassroomSession = {
  phase: ClassroomPhase;

  /**
   * Retained for compatibility, although the new classroom
   * does not need to ask the learner for a name.
   */
  learnerName: string;

  desiredOutcome: string;
  priorKnowledge: string;
  isReturningLearner: boolean;
  previousLessonTitle: string | null;

  courseId?: string;
  termId?: string;
  unitId?: string;
  lessonId?: string;

  handRaised?: boolean;
  lecturePaused?: boolean;
};

export type AcademyTutorReply = {
  displayText: string;
  speechText: string;
  isCorrect: boolean;
  encouragement: string;
  hint: string | null;

  explanation?: string;
  shouldResumeLecture?: boolean;
  nextStepId?: string;
};