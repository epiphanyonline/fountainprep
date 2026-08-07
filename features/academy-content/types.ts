export type AcademyCode =
  | "language"
  | "ai"
  | "coding"
  | "ielts"
  | "data-analytics"
  | "personal-finance"
  | "digital-skills"
  | "mathematics"
  | "english"
  | "science";

export type DeliveryMode =
  | "ai-classroom"
  | "live-tutor"
  | "self-study"
  | "revision"
  | "assessment";

export type LearnerStage =
  | "foundation"
  | "explorer"
  | "builder"
  | "communicator"
  | "advanced"
  | "mastery";

export type ActivityType =
  | "introduction"
  | "objective"
  | "teach"
  | "example"
  | "question"
  | "multiple-choice"
  | "typed-response"
  | "voice-response"
  | "guided-practice"
  | "roleplay"
  | "case-study"
  | "project"
  | "review"
  | "assessment"
  | "reflection";

export type ContentResource = {
  id: string;
  type: "image" | "audio" | "video" | "document" | "code" | "link";
  title: string;
  url: string;
  alt?: string;
};

export type AnswerOption = {
  id: string;
  label: string;
  value: string;
};

export type LessonActivity = {
  id: string;
  type: ActivityType;
  title: string;
  teacherPrompt: string;
  learnerInstruction?: string;
  explanation?: string;
  expectedAnswer?: string;
  acceptedAnswers?: string[];
  options?: AnswerOption[];
  correctOptionId?: string;
  hints?: string[];
  successReply?: string;
  retryReply?: string;
  resources?: ContentResource[];
  points?: number;
  required?: boolean;
};

export type AcademyLesson = {
  id: string;
  academy: AcademyCode;
  programmeId: string;
  courseId: string;
  unitId: string;
  stage: LearnerStage;
  lessonNumber: number;
  title: string;
  description: string;
  objective: string;
  learningOutcomes: string[];
  estimatedMinutes: number;
  completionPoints: number;
  deliveryModes: DeliveryMode[];
  suitableAgeGroups?: string[];
  prerequisiteLessonIds?: string[];
  activities: LessonActivity[];
};

export type AcademyUnit = {
  id: string;
  courseId: string;
  unitNumber: number;
  title: string;
  description: string;
  learningOutcomes: string[];
  lessons: AcademyLesson[];
};

export type AcademyCourse = {
  id: string;
  programmeId: string;
  stage: LearnerStage;
  title: string;
  description: string;
  learningOutcomes: string[];
  estimatedHours: number;
  units: AcademyUnit[];
};

export type AcademyProgramme = {
  id: string;
  academy: AcademyCode;
  title: string;
  description: string;
  suitableAgeGroups: string[];
  courses: AcademyCourse[];
};

export type AcademyDefinition = {
  code: AcademyCode;
  title: string;
  description: string;
  programmes: AcademyProgramme[];
};
