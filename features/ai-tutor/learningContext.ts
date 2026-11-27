/** Shared learning contexts for the unified preview. No provider or persistence. */
export const EXAM_TRACKS = ["jamb-maths", "jamb-english", "ielts-reading"] as const;
export const LANGUAGES = ["yoruba", "igbo", "hausa", "mandarin", "spanish", "french"] as const;
export const SUBJECTS = ["mathematics", "english", "science", "other"] as const;
export const LEARNING_MODES = ["teach", "practise", "simplify", "challenge"] as const;
type ExamTrack = typeof EXAM_TRACKS[number];
type Language = typeof LANGUAGES[number];
type Subject = typeof SUBJECTS[number];
export type LearningMode = typeof LEARNING_MODES[number];
export type LearningContext =
  | { kind: "exam"; track: ExamTrack }
  | { kind: "language"; language: Language; level: "foundation" }
  | { kind: "homework"; subject: Subject }
  | { kind: "general"; subject: Subject };

function includes<T extends string>(values: readonly T[], value: unknown): value is T {
  return typeof value === "string" && values.some(item => item === value);
}
export function parseLearningContext(input: unknown): LearningContext | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const value = input as Record<string, unknown>;
  switch (value.kind) {
    case "exam":
      return includes(EXAM_TRACKS, value.track) ? { kind: "exam", track: value.track } : null;
    case "language":
      return includes(LANGUAGES, value.language) && value.level === "foundation"
        ? { kind: "language", language: value.language, level: "foundation" } : null;
    case "homework":
    case "general":
      return includes(SUBJECTS, value.subject) ? { kind: value.kind, subject: value.subject } : null;
    default: return null;
  }
}
export function contextKey(context: LearningContext): string {
  switch (context.kind) {
    case "exam": return "exam:" + context.track;
    case "language": return "language:" + context.language + ":" + context.level;
    case "homework":
    case "general": return context.kind + ":" + context.subject;
  }
}
export function parseLearningMode(input: unknown): LearningMode | null {
  return includes(LEARNING_MODES, input) ? input : null;
}
export const EXAM_LABELS: Record<ExamTrack, string> = {
  "jamb-maths": "JAMB Mathematics", "jamb-english": "JAMB Use of English", "ielts-reading": "IELTS Reading",
};
export const LANGUAGE_LABELS: Record<Language, string> = {
  yoruba: "Yoruba", igbo: "Igbo", hausa: "Hausa", mandarin: "Mandarin", spanish: "Spanish", french: "French",
};
export const SUBJECT_LABELS: Record<Subject, string> = {
  mathematics: "Mathematics", english: "English", science: "Science", other: "Other subject",
};
