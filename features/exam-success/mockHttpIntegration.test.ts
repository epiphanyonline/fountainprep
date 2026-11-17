import { describe, expect, it } from "vitest";
import { handleExamRequest } from "./mockHttp";
import { MockMemoryStore } from "./mockMemoryStore";

const initialTime = Date.parse("2027-02-01T10:00:00Z");
function sampleRequest(body: Record<string, unknown>): Request {
  return new Request("https://example.invalid/api/exams/mock", {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("complete HTTP mock journey with synthetic learner and isolated in-memory data", () => {
  it("start -> save -> resume -> submit -> idempotent replay", async () => {
    const store = new MockMemoryStore("learner_1", () => initialTime);
    store.addPaper({
      id: "paper_1", published: true, durationSeconds: 180,
      questions: [
        { id: "q1", format: "single_choice", optionIds: ["a", "b"], correctOptionId: "b", points: 2 },
        { id: "q2", format: "single_choice", optionIds: ["c", "d"], correctOptionId: "c", points: 3 },
      ],
    });

    const started = await handleExamRequest(sampleRequest({
      action: "start", paperId: "paper_1", requestId: "start_1",
    }), store);
    expect(started.status).toBe(201);
    expect(await started.json()).toMatchObject({ attemptId: "attempt_1" });

    const saved = await handleExamRequest(sampleRequest({
      action: "save", attemptId: "attempt_1", questionId: "q1",
      optionId: "b", requestId: "save_1",
    }), store);
    expect(saved.status).toBe(200);

    const resumed = await handleExamRequest(sampleRequest({
      action: "resume", attemptId: "attempt_1",
    }), store);
    expect(resumed.status).toBe(200);
    const snapshot = await resumed.json();
    expect(snapshot).toMatchObject({
      state: "in_progress",
      answers: [{ questionId: "q1", optionId: "b" }],
    });
    expect(JSON.stringify(snapshot)).not.toContain("correctOptionId");
    expect(JSON.stringify(snapshot)).not.toContain("points");

    const submitted = await handleExamRequest(sampleRequest({
      action: "submit", attemptId: "attempt_1", requestId: "submit_1",
    }), store);
    expect(submitted.status).toBe(200);
    expect(await submitted.json()).toEqual({
      earned: 2, possible: 5, alreadySubmitted: false,
    });

    const replay = await handleExamRequest(sampleRequest({
      action: "submit", attemptId: "attempt_1", requestId: "submit_1",
    }), store);
    expect(await replay.json()).toEqual({
      earned: 2, possible: 5, alreadySubmitted: true,
    });

    const lateSave = await handleExamRequest(sampleRequest({
      action: "save", attemptId: "attempt_1", questionId: "q2",
      optionId: "c", requestId: "save_2",
    }), store);
    expect(lateSave.status).toBe(409);
  });

  it("rejects anonymous start before any write", async () => {
    const store = new MockMemoryStore(null, () => initialTime);
    const response = await handleExamRequest(sampleRequest({
      action: "start", paperId: "paper_1", requestId: "start_1",
    }), store);
    expect(response.status).toBe(401);
  });
});
