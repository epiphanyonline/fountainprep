import { describe, expect, it, vi } from "vitest";
import {
  startMock, saveMockAnswer, finishMock,
  type AuthenticatedExamStore,
} from "./mockService";

function storeFor(learner: string | null): AuthenticatedExamStore {
  return {
    authenticatedLearnerId: vi.fn(async () => learner),
    loadPublishedPaper: vi.fn(async () => ({
      id: "paper_1", published: true, durationSeconds: 7200,
      questions: [{ id: "q1", format: "single_choice" as const, optionIds: ["a","b"], correctOptionId:"b", points:1 }],
    })),
    createAttempt: vi.fn(async () => ({ attemptId: "attempt_1", expiresAt: "2027-01-01T12:00:00Z" })),
    saveAnswerIfOpen: vi.fn(async () => "saved" as const),
    submitAndScore: vi.fn(async () => ({ earned: 1, possible: 1, alreadySubmitted: false })),
  };
}

describe("authenticated mock workflow", () => {
  it("rejects unauthenticated starts before accessing the paper", async () => {
    const store = storeFor(null);
    await expect(startMock(store, "paper_1", "request_1")).rejects.toThrow("unauthenticated");
    expect(store.loadPublishedPaper).not.toHaveBeenCalled();
  });
  it("starts a published mock against authenticated learner, never browser learner id", async () => {
    const store = storeFor("student_1");
    expect(await startMock(store, "paper_1", "request_1")).toEqual({
      attemptId:"attempt_1", expiresAt:"2027-01-01T12:00:00Z",
    });
    expect(store.createAttempt).toHaveBeenCalledWith({
      learnerId:"student_1", paperId:"paper_1", requestId:"request_1",
    });
  });
  it("forwards save with server-resolved learner id", async () => {
    const store = storeFor("student_1");
    expect(await saveMockAnswer(store, { attemptId:"attempt_1", questionId:"q1", optionId:"a", requestId:"r1" })).toBe("saved");
    expect(store.saveAnswerIfOpen).toHaveBeenCalledWith({
      learnerId:"student_1",attemptId:"attempt_1",questionId:"q1",optionId:"a",requestId:"r1",
    });
  });
  it("rejects malformed identifiers without writing", async () => {
    const store = storeFor("student_1");
    await expect(saveMockAnswer(store, {attemptId:"../other",questionId:"q1",optionId:"a",requestId:"r1"})).rejects.toThrow("invalid_request");
    expect(store.saveAnswerIfOpen).not.toHaveBeenCalled();
  });
  it("submits through the idempotent server-side adapter only", async () => {
    const store = storeFor("student_1");
    await finishMock(store, "attempt_1", "r1");
    expect(store.submitAndScore).toHaveBeenCalledWith({
      learnerId:"student_1",attemptId:"attempt_1",requestId:"r1",
    });
  });
});
