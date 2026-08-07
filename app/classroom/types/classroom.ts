// ==========================================================
// FountainPrep Classroom Type Definitions
// ==========================================================

export type AcademyCode =
  | "academic"
  | "language"
  | "digital-skills"
  | "exam-preparation"
  | "creative";

export type LessonStage =
  | "welcome"
  | "review"
  | "teach"
  | "practice"
  | "assessment"
  | "celebration"
  | "completed";

export type LessonStatus =
  | "idle"
  | "loading"
  | "ready"
  | "listening"
  | "thinking"
  | "speaking"
  | "paused"
  | "completed";

export type LessonAction =
  | "listen"
  | "repeat"
  | "speak"
  | "continue"
  | "complete";

export type TeachingPersonality =
  | "explorer"
  | "coach"
  | "mentor"
  | "professional";

export type LearningSpeed = "slow" | "normal" | "fast";

export type Speaker = "ayo" | "learner";

export interface LessonReward {
  xp: number;
  badge?: string;
  streak?: number;
}

export interface LessonProgress {
  currentSlide: number;
  totalSlides: number;
  percent: number;
}

export interface LearnerProfile {
  id: string;

  firstName: string;

  age: number;

  academy: AcademyCode;

  programme: string;

  stage: string;

  confidence: number;

  preferredSpeed: LearningSpeed;

  personality: TeachingPersonality;

  strengths: string[];

  weaknesses: string[];
}

export interface LessonSlide {
  id: string;

  title: string;

  subtitle?: string;

  explanation: string;

  nativeText?: string;

  englishText?: string;

  image?: string;

  illustration?: string;

  audio?: string;

  expectedAnswer?: string;

  hint?: string;

  action: LessonAction;
}

export interface ConversationMessage {
  id: string;

  speaker: Speaker;

  message: string;

  pronunciationScore?: number;

  createdAt?: string;
}

export interface Lesson {
  id: string;

  academy: AcademyCode;

  programme: string;

  stage: string;

  lessonNumber: number;

  title: string;

  description: string;

  estimatedMinutes: number;

  reward: LessonReward;

  slides: LessonSlide[];
}

export interface ClassroomState {
  learner: LearnerProfile;

  lesson: Lesson;

  progress: LessonProgress;

  lessonStage: LessonStage;

  status: LessonStatus;

  currentSlide: LessonSlide;

  conversation: ConversationMessage[];
}