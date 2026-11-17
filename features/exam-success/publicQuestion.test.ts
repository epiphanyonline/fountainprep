import { describe, expect, it } from "vitest";
import { toDisplayQuestions } from "./publicQuestion";

describe("browser-facing question projection", () => {
  it("does not disclose correct options or scoring weights", () => {
    const display = toDisplayQuestions([{
      id: "q1", format: "single_choice", optionIds: ["a", "b"],
      correctOptionId: "b", points: 2,
    }]);
    expect(display).toEqual([{ id: "q1", format: "single_choice", optionIds: ["a", "b"] }]);
    expect(JSON.stringify(display)).not.toContain("correctOptionId");
    expect(JSON.stringify(display)).not.toContain("points");
  });
  it("returns a copy rather than the original options array", () => {
    const options = ["a", "b"];
    const result = toDisplayQuestions([{ id: "q1", format: "single_choice", optionIds: options, correctOptionId: "b", points: 1 }]);
    expect(result[0].optionIds).not.toBe(options);
  });
});
