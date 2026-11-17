import { describe, expect, it, vi } from "vitest";
import { handleExamRequest } from "./mockHttp";
import type { AuthenticatedExamStore } from "./mockService";

function makeStore(identity: string | null = "trusted_learner"): AuthenticatedExamStore {
  return {
    authenticatedLearnerId: vi.fn(async () => identity),
    loadPublishedPaper: vi.fn(async (id: string) => ({
      id, published: true, durationSeconds: 120,
      questions: [{
        id: "q1", format: "single_choice" as const,
        optionIds: ["a", "b"], correctOptionId: "b", points: 1,
      }],
    })),
    createAttempt: vi.fn(async () => ({
      attemptId: "attempt_1", expiresAt: "2027-01-01T10:02:00Z",
    })),
    saveAnswerIfOpen: vi.fn(async () => "saved" as const),
    submitAndScore: vi.fn(async () => ({
      earned: 1, possible: 1, alreadySubmitted: false,
    })),
  };
}

function request(payload: unknown, contentType = "application/json"): Request {
  return new Request("https://example.invalid/api/exams/mock", {
    method: "POST", headers: { "content-type": contentType },
    body: JSON.stringify(payload),
  });
}

describe("isolated mock HTTP boundary", () => {
  it("never accepts learner identity from request body", async () => {
    const store = makeStore("verified_learner");
    const response = await handleExamRequest(request({
      action: "start", paperId: "paper_1", requestId: "r1",
      learnerId: "attacker_claim", userId: "other_user",
    }), store);
    expect(response.status).toBe(201);
    expect(store.createAttempt).toHaveBeenCalledWith({
      learnerId: "verified_learner", paperId: "paper_1", requestId: "r1",
    });
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("rejects missing authentication", async () => {
    const response = await handleExamRequest(request({
      action: "start", paperId: "paper_1", requestId: "r1",
    }), makeStore(null));
    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "unauthenticated" });
  });

  it("forwards answer saves only after validating identifiers", async () => {
    const store = makeStore();
    const response = await handleExamRequest(request({
      action: "save", attemptId: "attempt_1", questionId: "q1",
      optionId: "b", requestId: "save_1",
    }), store);
    expect(response.status).toBe(200);
    expect(store.saveAnswerIfOpen).toHaveBeenCalledWith({
      learnerId: "trusted_learner", attemptId: "attempt_1",
      questionId: "q1", optionId: "b", requestId: "save_1",
    });
  });

  it("prevents invalid save payloads from calling the database adapter", async () => {
    const store = makeStore();
    const response = await handleExamRequest(request({
      action: "save", attemptId: "../someone", questionId: "q1",
      optionId: "a", requestId: "r1",
    }), store);
    expect(response.status).toBe(400);
    expect(store.saveAnswerIfOpen).not.toHaveBeenCalled();
  });

  it("submits via trusted adapter, returning score but no answer key", async () => {
    const store = makeStore();
    const response = await handleExamRequest(request({
      action: "submit", attemptId: "attempt_1", requestId: "submit_1",
    }), store);
    expect(response.status).toBe(200);
    const text = await response.text();
    expect(JSON.parse(text)).toMatchObject({ earned: 1, possible: 1 });
    expect(text).not.toContain("correctOptionId");
  });

  it("blocks unsupported methods and content types", async () => {
    const store = makeStore();
    const getResponse = await handleExamRequest(
      new Request("https://example.invalid/api/exams/mock", { method: "GET" }), store,
    );
    expect(getResponse.status).toBe(405);
    expect((await handleExamRequest(request({
      action: "start", paperId: "paper_1", requestId: "r1",
    }, "text/plain"), store)).status).toBe(415);
  });

  it("rejects malformed, huge or unknown action requests", async () => {
    const store = makeStore();
    const broken = new Request("https://example.invalid/api/exams/mock", {
      method: "POST", headers: { "content-type": "application/json" },
      body: "{broken",
    });
    expect((await handleExamRequest(broken, store)).status).toBe(400);
    expect((await handleExamRequest(request({ action: "erase" }), store)).status).toBe(400);
    const huge = request({
      action: "start", paperId: "paper_1", requestId: "r1", extra: "x".repeat(5000),
    });
    expect((await handleExamRequest(huge, store)).status).toBe(413);
  });

  it("does not disclose raw adapter/database errors", async () => {
    const store = makeStore();
    (store.submitAndScore as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("private schema and secret answer key contents"),
    );
    const response = await handleExamRequest(request({
      action: "submit", attemptId: "attempt_1", requestId: "r1",
    }), store);
    expect(response.status).toBe(500);
    expect(await response.text()).not.toContain("private schema");
  });
});
