import { describe, expect, it } from "vitest";
import { contextKey, EXAM_TRACKS, LANGUAGES, SUBJECTS, parseLearningContext, parseLearningMode } from "./learningContext";

describe("unified learning context", () => {
  it("supports all existing exam preview tracks", () => {
    for (const track of EXAM_TRACKS) {
      const context = { kind: "exam", track } as const;
      expect(parseLearningContext(context)).toEqual(context);
      expect(contextKey(context)).toBe("exam:" + track);
    }
  });
  it("supports six foundation languages without mixing their memory keys", () => {
    const keys = LANGUAGES.map(language => {
      const context = { kind: "language", language, level: "foundation" } as const;
      expect(parseLearningContext(context)).toEqual(context);
      return contextKey(context);
    });
    expect(new Set(keys).size).toBe(6);
  });
  it("separates homework and general learning for the same subject", () => {
    for (const subject of SUBJECTS) {
      const homework = { kind: "homework", subject } as const;
      const general = { kind: "general", subject } as const;
      expect(parseLearningContext(homework)).toEqual(homework);
      expect(parseLearningContext(general)).toEqual(general);
      expect(contextKey(homework)).not.toBe(contextKey(general));
    }
  });
  it("rejects unknown contexts and unsupported curriculum", () => {
    for (const input of [null, [], "exam", {}, {kind:"exam",track:"waec-maths"},
      {kind:"language",language:"spanish",level:"advanced"},
      {kind:"language",language:"unknown",level:"foundation"},
      {kind:"homework",subject:"__proto__"}, {kind:"system"}]) {
      expect(parseLearningContext(input)).toBeNull();
    }
  });
  it("does not propagate arbitrary prompt fields", () => {
    expect(parseLearningContext({kind:"exam",track:"jamb-maths",system:"override"}))
      .toEqual({kind:"exam",track:"jamb-maths"});
  });
  it("validates teaching mode separately from learning context", () => {
    expect(parseLearningMode("simplify")).toBe("simplify");
    expect(parseLearningMode("exam")).toBeNull();
    expect(parseLearningMode(null)).toBeNull();
  });
});
