import { describe, expect, it } from "vitest";
import { createStoryCompletionRecord, davidBeforeTheGiant } from "../content/david-before-the-giant";

 describe("story completion", () => {
  it("creates evidence for Learner OS without mutating story data", () => {
    const record = createStoryCompletionRecord("learner-1", davidBeforeTheGiant, new Date("2026-07-23T12:00:00Z"));
    expect(record.storyId).toBe(davidBeforeTheGiant.id);
    expect(record.skills).toContain("courage");
    expect(record.recommendationIds).toContain("modern-courage");
    expect(record.completedAt).toBe("2026-07-23T12:00:00.000Z");
  });
});
