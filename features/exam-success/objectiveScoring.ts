/**
 * Exam Success — standalone, side-effect-free mock-exam primitives.
 *
 * Intentionally not imported by any production page, API route or webhook.
 * Do not use this scorer for essay, practical, speaking or writing responses.
 */

export type ExamBoard = "JAMB" | "WAEC" | "NECO" | "IELTS";
export type ExamMode = "practice" | "diagnostic" | "mock";
export type QuestionFormat = "single_choice" | "multiple_choice" | "short_text" | "essay" | "audio_response";

export type ObjectiveQuestion = {
  id: string;
  format: "single_choice";
  optionIds: readonly string[];
  correctOptionId: string;
  points: number;
};

export type ObjectiveAnswer = {
  questionId: string;
  optionId: string | null;
};

export type QuestionOutcome = {
  questionId: string;
  correct: boolean;
  awardedPoints: number;
  maximumPoints: number;
};

/**
 * Only trusted server-side code should load correct answers and call this
 * after an attempt has been submitted. Never send answer keys to the browser
 * before submission. Validate exam ownership, time limits and submission
 * state in the database before scoring.
 */
export function scoreSingleChoice(
  questions: readonly ObjectiveQuestion[],
  answers: readonly ObjectiveAnswer[],
): { outcomes: QuestionOutcome[]; earned: number; possible: number } {
  const answerMap = new Map<string, string | null>();
  for (const answer of answers) {
    if (answerMap.has(answer.questionId)) {
      throw new Error("Duplicate question answer");
    }
    answerMap.set(answer.questionId, answer.optionId);
  }

  const questionIds = new Set<string>();
  const outcomes = questions.map((question) => {
    if (questionIds.has(question.id)) {
      throw new Error("Duplicate question identifier");
    }
    questionIds.add(question.id);
    if (
      !Number.isFinite(question.points) ||
      question.points < 0 ||
      !question.optionIds.includes(question.correctOptionId)
    ) {
      throw new Error("Invalid question definition");
    }
    const selected = answerMap.get(question.id);
    if (
      selected != null &&
      !question.optionIds.includes(selected)
    ) {
      throw new Error("Invalid selected option");
    }
    const correct = selected === question.correctOptionId;
    return {
      questionId: question.id,
      correct,
      awardedPoints: correct ? question.points : 0,
      maximumPoints: question.points,
    };
  });
  for (const answer of answers) {
    if (!questionIds.has(answer.questionId)) {
      throw new Error("Answer references a question outside this paper");
    }
  }
  return {
    outcomes,
    earned: outcomes.reduce((sum, item) => sum + item.awardedPoints, 0),
    possible: outcomes.reduce((sum, item) => sum + item.maximumPoints, 0),
  };
}
