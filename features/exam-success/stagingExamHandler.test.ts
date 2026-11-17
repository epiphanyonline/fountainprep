import { describe, expect, it, vi } from "vitest";
import { handleStagingExamRequest } from "./stagingExamHandler";
import { MockMemoryStore } from "./mockMemoryStore";
import type { ExamHandlerDependencies } from "./stagingExamHandler";

const learnerId = "00000000-0000-4000-8000-000000000001";
const time = Date.parse("2027-02-01T10:00:00.000Z");
function setup() {
  const store = new MockMemoryStore(learnerId, () => time);
  store.addPaper({
    id: "paper_1", published: true, durationSeconds: 120,
    questions: [
      { id: "q1", format: "single_choice", optionIds: ["a", "b"], correctOptionId: "b", points: 2 },
      { id: "q2", format: "single_choice", optionIds: ["x", "y"], correctOptionId: "x", points: 3 },
    ],
  });
  const verifier = { getUser: vi.fn(async () => ({
    data: { user: { id: learnerId } }, error: null,
  })) };
  const makeStore = vi.fn(async () => store);
  const dependencies: ExamHandlerDependencies = {
    environment: {
      vercelEnvironment: "test",
      productionProjectRef: "cxuizqygogdzhcehhbmc",
      stagingProjectRef: "abcdefghijklmnopqrst",
    },
    verifier, makeStore,
  };
  return { dependencies, verifier, makeStore };
}
function request(action: Record<string, unknown>, bearer = "Bearer test.jwt.token") {
  return new Request("https://invalid.example/api/exams", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: bearer,
    },
    body: JSON.stringify(action),
  });
}

describe("staging mock HTTP authentication to exam lifecycle", () => {
  it("completes start, save, resume and submit with a verified learner", async () => {
    const { dependencies, verifier, makeStore } = setup();
    const start = await handleStagingExamRequest(request({
      action: "start", paperId: "paper_1", requestId: "start_1",
      learnerId: "attacker_supplied_id",
    }), dependencies);
    expect(start.status).toBe(201);
    expect(await start.json()).toMatchObject({ attemptId: "attempt_1" });
    expect(verifier.getUser).toHaveBeenCalledWith("test.jwt.token");
    expect(makeStore).toHaveBeenCalledWith(learnerId);

    const save = await handleStagingExamRequest(request({
      action: "save", attemptId: "attempt_1",
      questionId: "q1", optionId: "b", requestId: "save_1",
    }), dependencies);
    expect(save.status).toBe(200);

    const resume = await handleStagingExamRequest(request({
      action: "resume", attemptId: "attempt_1",
    }), dependencies);
    expect(resume.status).toBe(200);
    const serialized = await resume.text();
    expect(JSON.parse(serialized)).toMatchObject({
      answers: [{ questionId: "q1", optionId: "b" }],
    });
    expect(serialized).not.toContain("correctOptionId");

    const submit = await handleStagingExamRequest(request({
      action: "submit", attemptId: "attempt_1", requestId: "submit_1",
    }), dependencies);
    expect(submit.status).toBe(200);
    expect(await submit.json()).toEqual({
      earned: 2, possible: 5, alreadySubmitted: false,
    });
  });

  it("refuses to construct a database store without valid auth", async () => {
    const { dependencies, makeStore } = setup();
    const res = await handleStagingExamRequest(
      request({ action: "start", paperId: "paper_1", requestId: "start_1" }, "Basic invalid"),
      dependencies,
    );
    expect(res.status).toBe(401);
    expect(makeStore).not.toHaveBeenCalled();
  });

  it("refuses staging operations on production before any auth or DB access", async () => {
    const { dependencies, verifier, makeStore } = setup();
    dependencies.environment.vercelEnvironment = "production";
    const res = await handleStagingExamRequest(
      request({ action: "start", paperId: "paper_1", requestId: "start_1" }),
      dependencies,
    );
    expect(res.status).toBe(503);
    expect(verifier.getUser).not.toHaveBeenCalled();
    expect(makeStore).not.toHaveBeenCalled();
    expect(res.headers.get("cache-control")).toBe("no-store");
  });

  it("refuses matching staging/production Supabase refs", async () => {
    const { dependencies, makeStore } = setup();
    dependencies.environment.stagingProjectRef =
      dependencies.environment.productionProjectRef;
    const res = await handleStagingExamRequest(
      request({ action: "start", paperId: "paper_1", requestId: "start_1" }),
      dependencies,
    );
    expect(res.status).toBe(503);
    expect(makeStore).not.toHaveBeenCalled();
  });

  it("does not leak failed authentication or storage internal details", async () => {
    const { dependencies } = setup();
    dependencies.makeStore = vi.fn(async () => {
      throw new Error("private staging secret");
    });
    const res = await handleStagingExamRequest(
      request({ action: "start", paperId: "paper_1", requestId: "start_1" }),
      dependencies,
    );
    expect(res.status).toBe(500);
    expect(await res.text()).not.toContain("private staging secret");
  });
});
