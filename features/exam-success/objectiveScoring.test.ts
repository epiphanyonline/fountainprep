import { describe, expect, it } from "vitest";
import { scoreSingleChoice, type ObjectiveQuestion } from "./objectiveScoring";

const questions: ObjectiveQuestion[] = [
  { id: "q1", format: "single_choice", optionIds: ["a", "b"], correctOptionId: "b", points: 2 },
  { id: "q2", format: "single_choice", optionIds: ["x", "y"], correctOptionId: "x", points: 3 },
];

describe("scoreSingleChoice", () => {
  it("scores correct, incorrect and unanswered objective questions", () => {
    expect(scoreSingleChoice(questions, [
      { questionId: "q1", optionId: "b" },
      { questionId: "q2", optionId: null },
    ])).toEqual({
      outcomes: [
        { questionId: "q1", correct: true, awardedPoints: 2, maximumPoints: 2 },
        { questionId: "q2", correct: false, awardedPoints: 0, maximumPoints: 3 },
      ],
      earned: 2,
      possible: 5,
    });
  });

  it("rejects duplicate answers", () => {
    expect(() => scoreSingleChoice(questions, [
      { questionId: "q1", optionId: "a" },
      { questionId: "q1", optionId: "b" },
    ])).toThrow("Duplicate question answer");
  });

  it("rejects answers outside the assigned paper", () => {
    expect(() => scoreSingleChoice(questions, [
      { questionId: "other", optionId: "a" },
    ])).toThrow("Answer references a question outside this paper");
  });

  it("rejects invalid option identifiers", () => {
    expect(() => scoreSingleChoice(questions, [
      { questionId: "q1", optionId: "not-an-option" },
    ])).toThrow("Invalid selected option");
  });

  it("rejects malformed question definitions", () => {
    expect(() => scoreSingleChoice([
      { ...questions[0], correctOptionId: "unknown" },
    ], [])).toThrow("Invalid question definition");
  });
});
