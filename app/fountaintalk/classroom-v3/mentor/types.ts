export type MentorLetterKind =
  | "weekly" | "welcome" | "birthday" | "anniversary"
  | "academy-complete" | "encouragement";

export interface MentorLetterInput {
  learnerId: string;
  kind: MentorLetterKind;
  periodStart?: string;
  periodEnd?: string;
  lessonsCompleted?: number;
  minutesLearned?: number;
  currentAcademy?: string;
  strongestTheme?: string;
  challengeTheme?: string;
  nextJourneyTitle?: string;
  nextJourneyReason?: string;
  milestone?: string;
}

export interface MentorLetter {
  id: string;
  learnerId: string;
  kind: MentorLetterKind;
  subject: string;
  salutation: string;
  paragraphs: string[];
  signOff: string;
  createdAt: string;
  metadata?: Record<string, string | number | boolean | undefined>;
}
