/**
 * A strict browser-facing question projection.
 * Keep correct answer keys, internal scoring, review metadata and licence
 * records out of network payloads before an attempt is submitted.
 */
import type { ObjectiveQuestion } from "./objectiveScoring";

export type DisplayQuestion = {
  id: string;
  format: "single_choice";
  optionIds: readonly string[];
};

export function toDisplayQuestions(questions: readonly ObjectiveQuestion[]): DisplayQuestion[] {
  return questions.map((question) => ({
    id: question.id,
    format: question.format,
    optionIds: [...question.optionIds],
  }));
}
