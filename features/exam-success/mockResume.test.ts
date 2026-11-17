import { describe, expect, it, vi } from "vitest";
import { resumeMock, type ResumableExamStore } from "./mockResume";

function fixture(user: string | null = "learner_a"): ResumableExamStore {
  return {
    authenticatedLearnerId: vi.fn(async () => user),
    loadPublishedPaper: vi.fn(async () => null),
    createAttempt: vi.fn(async () => ({ attemptId: "attempt_1", expiresAt: "2027-02-01T12:00:00Z" })),
    saveAnswerIfOpen: vi.fn(async () => "saved" as const),
    submitAndScore: vi.fn(async () => ({ earned: 1, possible: 2, alreadySubmitted: false })),
    loadAttemptForResume: vi.fn(async ({ learnerId, attemptId }) =>
      learnerId === "learner_a" && attemptId === "attempt_1" ? {
        attemptId, expiresAt: "2027-02-01T12:00:00Z", state: "in_progress" as const,
        questions: [{ id: "q1", format: "single_choice" as const, optionIds: ["a", "b"] }],
        answers: [{ questionId: "q1", optionId: "b" }],
      } : null),
  };
}

describe("mock attempt resume security", () => {
  it("requires a server verified identity before querying", async () => {
    const store = fixture(null);
    await expect(resumeMock(store, "attempt_1")).rejects.toThrow("unauthenticated");
    expect(store.loadAttemptForResume).not.toHaveBeenCalled();
  });
  it("returns only a learner-scoped, answer-key-free snapshot", async () => {
    const store = fixture();
    const snapshot = await resumeMock(store, "attempt_1");
    expect(store.loadAttemptForResume).toHaveBeenCalledWith({
      learnerId: "learner_a", attemptId: "attempt_1",
    });
    expect(snapshot.answers).toEqual([{ questionId: "q1", optionId: "b" }]);
    expect(JSON.stringify(snapshot)).not.toContain("correctOptionId");
  });
  it("does not reveal attempts owned by other learners", async () => {
    await expect(resumeMock(fixture("learner_b"), "attempt_1")).rejects.toThrow("unavailable");
  });
  it("rejects invalid IDs and mismatched adapter responses", async () => {
    const store = fixture();
    await expect(resumeMock(store, "../other")).rejects.toThrow("invalid_request");
    expect(store.loadAttemptForResume).not.toHaveBeenCalled();
    (store.loadAttemptForResume as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      attemptId: "other", expiresAt: "2027-02-01T12:00:00Z",
      state: "in_progress", questions: [], answers: [],
    });
    await expect(resumeMock(store, "attempt_1")).rejects.toThrow("Invalid resume adapter response");
  });
});
