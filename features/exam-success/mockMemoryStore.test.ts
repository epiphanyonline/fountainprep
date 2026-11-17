import { describe, expect, it } from "vitest";
import { MockMemoryStore } from "./mockMemoryStore";
import { startMock, saveMockAnswer, finishMock } from "./mockService";

const epoch = Date.parse("2027-02-01T10:00:00.000Z");
function fixture(learnerId: string | null = "learner_1") {
  let now = epoch;
  const store = new MockMemoryStore(learnerId, () => now);
  store.addPaper({
    id: "paper_1", published: true, durationSeconds: 120,
    questions: [
      { id: "q1", format: "single_choice", optionIds: ["a","b"], correctOptionId: "b", points: 2 },
      { id: "q2", format: "single_choice", optionIds: ["x","y"], correctOptionId: "x", points: 3 },
    ],
  });
  return { store, advance: (millis: number) => { now += millis; } };
}

describe("mock exam end-to-end contract (synthetic and in-memory only)", () => {
  it("starts, saves and submits with server scoring", async () => {
    const { store } = fixture();
    const { attemptId } = await startMock(store, "paper_1", "start_1");
    expect(await saveMockAnswer(store, {
      attemptId, questionId: "q1", optionId: "b", requestId: "save_1",
    })).toBe("saved");
    const result = await finishMock(store, attemptId, "submit_1");
    expect(result).toEqual({ earned: 2, possible: 5, alreadySubmitted: false });
    expect(await finishMock(store, attemptId, "submit_1")).toEqual({
      earned: 2, possible: 5, alreadySubmitted: true,
    });
    expect(await saveMockAnswer(store, {
      attemptId, questionId: "q2", optionId: "x", requestId: "save_2",
    })).toBe("closed");
  });

  it("replays a start idempotently, but rejects reusing the request for another paper", async () => {
    const { store } = fixture();
    const one = await startMock(store, "paper_1", "start_1");
    const replay = await startMock(store, "paper_1", "start_1");
    expect(replay).toEqual(one);
    store.addPaper({
      id:"paper_2",published:true,durationSeconds:120,questions:[
        { id:"q9",format:"single_choice",optionIds:["a","b"],correctOptionId:"a",points:1 },
      ],
    });
    await expect(startMock(store, "paper_2", "start_1")).rejects.toThrow("idempotency_conflict");
  });

  it("rejects attempts at deadline and invalid answer options", async () => {
    const { store, advance } = fixture();
    const { attemptId } = await startMock(store, "paper_1", "start_1");
    expect(await saveMockAnswer(store, {attemptId,questionId:"q1",optionId:"wrong",requestId:"save_1"}))
      .toBe("invalid_question");
    advance(120_000);
    expect(await saveMockAnswer(store, {attemptId,questionId:"q1",optionId:"b",requestId:"save_2"}))
      .toBe("closed");
    await expect(finishMock(store,attemptId,"submit_1")).rejects.toThrow("closed");
  });

  it("never starts an attempt for unauthenticated user", async () => {
    const { store } = fixture(null);
    await expect(startMock(store,"paper_1","start_1")).rejects.toThrow("unauthenticated");
  });

  it("rejects attempts from another learner", async () => {
    const owner = fixture("learner_1");
    const outsider = fixture("learner_2");
    const { attemptId } = await startMock(owner.store,"paper_1","start_1");
    expect(await saveMockAnswer(outsider.store, {
      attemptId,questionId:"q1",optionId:"b",requestId:"save_1",
    })).toBe("forbidden");
    await expect(finishMock(outsider.store,attemptId,"submit_1")).rejects.toThrow("forbidden");
  });
});
