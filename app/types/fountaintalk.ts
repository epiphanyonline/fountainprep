export type SupportedLanguage =
  | "yoruba"
  | "igbo"
  | "hausa"
  | "french"
  | "spanish"
  | "mandarin";

export type LearnerLevel =
  | "foundation"
  | "beginner"
  | "elementary"
  | "intermediate"
  | "upperIntermediate"
  | "advanced";

export type LearnerGoal =
  | "conversation"
  | "education"
  | "business"
  | "travel"
  | "family"
  | "culture"
  | "heritage"
  | "exam"
  | "religion";

export type AgeGroup =
  | "3-5"
  | "6-9"
  | "10-13"
  | "14-17"
  | "adult";

export type LearnerProfile = {
  id: string;
  name: string;
  ageGroup: AgeGroup;
  language: SupportedLanguage;
  level: LearnerLevel;
  goal: LearnerGoal;
  bibleStoriesEnabled: boolean;
};

export type TutorStatus =
  | "ready"
  | "listening"
  | "thinking"
  | "speaking"
  | "completed";

export type LessonStepType =
  | "introduction"
  | "objective"
  | "teach"
  | "listen"
  | "repeat"
  | "pronunciation"
  | "question"
  | "guidedPractice"
  | "roleplay"
  | "conversation"
  | "challenge"
  | "review"
  | "assessment";

  export type TeachingTone =
  | "playful"
  | "encouraging"
  | "neutral"
  | "professional";

export type ScenarioContext =
  | "home"
  | "school"
  | "work"
  | "travel"
  | "family"
  | "community"
  | "culture"
  | "general";

export type VocabularyItem = {
  source: string;
  target: string;

  pronunciation?: string;
  note?: string;

  nativeAudioUrl?: string;
  slowAudioUrl?: string;

  syllableBreakdown?: string[];

  pronunciationTip?: string;
};

export type LessonStep = {
  id: string;

  type: LessonStepType;

  title: string;

  /**
   * AI prompt shown to learner.
   */
  teacherPrompt: string;

  /**
   * Optional legacy instruction.
   */
  instruction?: string;

  /**
   * Phrase learner should say.
   */
  expectedPhrase?: string;

  /**
   * Accepted learner answers.
   */
  acceptedAnswers?: string[];

  /**
   * Older lessons may still use this.
   */
  expectedAnswers?: string[];

  /**
   * Optional hints.
   */
  hints?: string[];

  /**
   * Reply after success.
   */
  successReply?: string;

  /**
   * Reply after incorrect answer.
   */
  retryReply?: string;

  /**
   * Native recorded audio.
   */
  nativeAudioUrl?: string;

  /**
   * Slow pronunciation.
   */
  slowAudioUrl?: string;

  /**
   * Pronunciation coaching.
   */
  pronunciationTip?: string;

  vocabulary?: VocabularyItem[];

    /**
   * Controls how Ayo presents this step.
   */
  teachingTone?: TeachingTone;

  /**
   * Real-life setting used for examples and role-play.
   */
  scenarioContext?: ScenarioContext;

  /**
   * Age groups for which this step is especially suitable.
   * Leave undefined when the step works for everyone.
   */
  suitableAgeGroups?: AgeGroup[];

  /**
   * Goals for which this step is especially useful.
   * Leave undefined when the step applies to all goals.
   */
  suitableGoals?: LearnerGoal[];

  /**
   * Optional alternative prompts for different learner groups.
   */
  promptVariants?: Partial<Record<AgeGroup, string>>;
};

export type CurriculumLesson = {
  id: string;

  language: SupportedLanguage;
  level: LearnerLevel;

  unitNumber: number;
  lessonNumber: number;

  title: string;
  description?: string;

  objective: string;

  /**
   * Clear outcomes the learner should achieve.
   */
  learningOutcomes?: string[];

  /**
   * Broad topic used for curriculum organisation.
   */
  theme?: string;

  /**
   * Useful for navigation and filtering.
   */
  tags?: string[];

  /**
   * Lessons that should usually be completed first.
   */
  prerequisiteLessonIds?: string[];

  /**
   * Suggested learner goals for this lesson.
   */
  suitableGoals?: LearnerGoal[];

  /**
   * Suggested age groups.
   * Leave undefined when suitable for everyone.
   */
  suitableAgeGroups?: AgeGroup[];

  /**
   * Default real-life setting for the lesson.
   */
  scenarioContext?: ScenarioContext;

  /**
   * Default teaching style for the lesson.
   */
  teachingTone?: TeachingTone;

  vocabulary: VocabularyItem[];

  steps: LessonStep[];

  completionPoints: number;

  /**
   * Optional target lesson duration.
   */
  estimatedMinutes?: number;

  /**
   * Minimum score required to pass an assessment.
   */
  passingScore?: number;
};

export type CurriculumUnit = {
  id: string;

  language: SupportedLanguage;
  level: LearnerLevel;

  unitNumber: number;

  title: string;
  description: string;

  /**
   * Broad subject area, such as greetings, family, or travel.
   */
  theme?: string;

  /**
   * What the learner should achieve by completing the unit.
   */
  learningOutcomes?: string[];

  /**
   * Optional goals this unit is especially useful for.
   */
  suitableGoals?: LearnerGoal[];

  /**
   * Optional age suitability.
   */
  suitableAgeGroups?: AgeGroup[];

  lessons: CurriculumLesson[];
};

export type CurriculumCourse = {
  id: string;

  language: SupportedLanguage;
  level: LearnerLevel;

  title: string;
  description: string;

  /**
   * Human-friendly proficiency label.
   * Examples: A0, A1, A2, B1, B2, C1.
   */
  proficiencyCode?: string;

  /**
   * Main outcomes for completing this level.
   */
  learningOutcomes: string[];

  /**
   * Learner goals this course supports.
   */
  suitableGoals?: LearnerGoal[];

  /**
   * Course units in teaching order.
   */
  units: CurriculumUnit[];

  /**
   * Estimated duration for the complete course level.
   */
  estimatedHours?: number;

  /**
   * Total points available in this course.
   */
  completionPoints?: number;
};

export type LanguageCurriculum = {
  language: SupportedLanguage;

  title: string;
  description: string;

  courses: CurriculumCourse[];
};

export type LearnerProgress = {
  learnerId: string;

  language: SupportedLanguage;

  level: LearnerLevel;

  /**
   * Current course being studied.
   * Example: yoruba-foundation
   */
  currentCourseId: string;

  currentUnitId: string;

  currentLessonId: string;

  currentStepIndex: number;

  completedCourseIds: string[];

  completedUnitIds: string[];

  completedLessonIds: string[];

  completedStepIds: string[];

  points: number;

  streak: number;

  /**
   * Best assessment score for each lesson.
   */
  lessonScores?: Record<string, number>;

  /**
   * Number of attempts made for each lesson.
   */
  lessonAttempts?: Record<string, number>;

  /**
   * Last time the learner studied.
   */
  lastStudiedAt: string | null;
};

export type TutorAction =
  | "continue_step"
  | "complete_step"
  | "repeat_step"
  | "answer_detour"
  | "complete_lesson";

export type TutorReply = {
  displayText: string;

  speechText: string;

  action: TutorAction;

  correctedPhrase: string | null;

  encouragement: string | null;
};

export type TutorRequestPayload = {
  message: string;

  learner: {
    name: string;
    ageGroup: AgeGroup;
    language: SupportedLanguage;
    level: LearnerLevel;
  };

  lesson: {
    id: string;
    title: string;
    objective: string;
    currentStep: LessonStep;
  };

  progress: {
    currentStepIndex: number;
    totalSteps: number;
  };

  mode: "curriculum" | "free-conversation";
};