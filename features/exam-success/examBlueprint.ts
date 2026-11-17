/**
 * Immutable mock paper blueprints. No data access, routes, or production hooks.
 *
 * Paper formats are versioned; do not assume that JAMB, WAEC, NECO or IELTS
 * formats from a previous exam year remain valid for a future year.
 */
import type { ExamBoard, ExamMode } from "./objectiveScoring";

export type ExamVariant =
  | "utme"
  | "wassce"
  | "ssce"
  | "academic"
  | "general_training";

export type PaperSection = {
  id: string;
  subjectCode: string;
  questionCount: number;
  durationMinutes?: number;
};

export type MockPaperBlueprint = {
  id: string;
  board: ExamBoard;
  variant: ExamVariant;
  countryCode: string;
  syllabusYear: number;
  version: number;
  mode: ExamMode;
  totalMinutes: number;
  sections: readonly PaperSection[];
  status: "draft" | "reviewed" | "published" | "retired";
  reviewedBy: string | null;
  contentLicence: string;
};

const variants: Record<ExamBoard, readonly ExamVariant[]> = {
  JAMB: ["utme"],
  WAEC: ["wassce"],
  NECO: ["ssce"],
  IELTS: ["academic", "general_training"],
};

export function validateBlueprint(blueprint: MockPaperBlueprint): string[] {
  const issues: string[] = [];
  if (!blueprint.id.trim()) issues.push("Paper ID is required");
  if (!variants[blueprint.board]?.includes(blueprint.variant)) {
    issues.push("Board and examination variant do not match");
  }
  if (!/^[A-Z]{2}$/.test(blueprint.countryCode)) {
    issues.push("Country must be an ISO 3166-1 alpha-2 code");
  }
  if (!Number.isInteger(blueprint.syllabusYear) || blueprint.syllabusYear < 2000) {
    issues.push("Valid syllabus year is required");
  }
  if (!Number.isInteger(blueprint.version) || blueprint.version < 1) {
    issues.push("Positive paper version is required");
  }
  if (!Number.isInteger(blueprint.totalMinutes) || blueprint.totalMinutes <= 0) {
    issues.push("Paper duration must be a positive integer");
  }
  if (!blueprint.sections.length) issues.push("Paper requires at least one section");
  const seen = new Set<string>();
  for (const section of blueprint.sections) {
    if (!section.id.trim() || seen.has(section.id)) {
      issues.push("Section IDs must be unique and non-empty");
    }
    seen.add(section.id);
    if (!section.subjectCode.trim()) issues.push("Subject code is required");
    if (!Number.isInteger(section.questionCount) || section.questionCount < 1) {
      issues.push("Question count must be a positive integer");
    }
    if (section.durationMinutes !== undefined &&
      (!Number.isInteger(section.durationMinutes) || section.durationMinutes < 1)) {
      issues.push("Section duration must be a positive integer");
    }
  }
  if (!blueprint.contentLicence.trim()) issues.push("Content provenance/licence is required");
  if (blueprint.status === "published" && !blueprint.reviewedBy?.trim()) {
    issues.push("Published papers require a named academic reviewer");
  }
  // School exam configurations are Nigeria-only until another country's
  // national syllabus and paper rules have been independently reviewed.
  if (blueprint.board !== "IELTS" && blueprint.countryCode !== "NG") {
    issues.push("Non-Nigerian school examination papers require a separate approved configuration");
  }
  return issues;
}
