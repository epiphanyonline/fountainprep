/**
 * Weekend mock assembler. Isolated, server-side design; no database or payment writes.
 * Only approved, licensed, syllabus-matched questions enter a published paper.
 *
 * Paper selection is reproducible for an immutable event revision. Choose
 * event seeds on the SERVER (never from a learner). The seed is not a security
 * secret; answer keys must always remain in private server storage.
 */
import type { MockPaperBlueprint } from "./examBlueprint";
import { validateBlueprint } from "./examBlueprint";

export type BankQuestion = {
  id: string;
  canonicalGroupId: string; // prevents paraphrases of the same question in one paper
  board: MockPaperBlueprint["board"];
  variant: MockPaperBlueprint["variant"];
  syllabusYear: number;
  subjectCode: string;
  topicCode: string;
  difficulty: "easy" | "medium" | "hard";
  status: "draft" | "reviewed" | "published" | "retired";
  reviewedBy: string | null;
  licence: string;
};
export type Selection = {
  paperId: string;
  version: number;
  questionIdsBySection: { sectionId: string; questionIds: string[] }[];
};
export class InsufficientQuestionBank extends Error {
  constructor(public readonly sectionId: string, public readonly required: number, public readonly available: number) {
    super(`Insufficient reviewed questions for ${sectionId}: ${available}/${required}`);
    this.name = "InsufficientQuestionBank";
  }
}

function hash(text: string): number {
  let value = 2166136261;
  for (let i = 0; i < text.length; i++) {
    value ^= text.charCodeAt(i);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}
/** Stable shuffle, never used to encrypt or protect examination content. */
function rank(questionId: string, seed: string, sectionId: string): number {
  return hash(`${seed}|${sectionId}|${questionId}`);
}

export function assembleWeekendPaper(input: {
  blueprint: MockPaperBlueprint;
  bank: readonly BankQuestion[];
  seed: string;
  recentQuestionIds?: readonly string[];
}): Selection {
  const { blueprint, bank, seed } = input;
  if (validateBlueprint(blueprint).length || blueprint.status !== "published") {
    throw new Error("A published, academically reviewed blueprint is required");
  }
  if (!seed || seed.length > 256) throw new Error("Invalid event seed");
  const recent = new Set(input.recentQuestionIds ?? []);
  const chosen = new Set<string>();
  const groups = new Set<string>();
  const questionIdsBySection: Selection["questionIdsBySection"] = [];

  for (const section of blueprint.sections) {
    const candidates = bank.filter(q =>
      q.board === blueprint.board &&
      q.variant === blueprint.variant &&
      q.syllabusYear === blueprint.syllabusYear &&
      q.subjectCode === section.subjectCode &&
      q.status === "published" &&
      !!q.reviewedBy?.trim() &&
      !!q.licence.trim() &&
      !!q.canonicalGroupId.trim()
    );
    // Prioritise questions not shown recently; only reuse when necessary.
    candidates.sort((a, b) =>
      Number(recent.has(a.id)) - Number(recent.has(b.id)) ||
      rank(a.id, seed, section.id) - rank(b.id, seed, section.id) ||
      a.id.localeCompare(b.id)
    );
    const selected: string[] = [];
    for (const q of candidates) {
      if (chosen.has(q.id) || groups.has(q.canonicalGroupId)) continue;
      selected.push(q.id);
      chosen.add(q.id);
      groups.add(q.canonicalGroupId);
      if (selected.length === section.questionCount) break;
    }
    if (selected.length !== section.questionCount) {
      throw new InsufficientQuestionBank(section.id, section.questionCount, selected.length);
    }
    questionIdsBySection.push({sectionId: section.id, questionIds: selected});
  }
  return {paperId: blueprint.id, version: blueprint.version, questionIdsBySection};
}
