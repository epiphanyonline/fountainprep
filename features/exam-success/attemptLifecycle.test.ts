import { describe, expect, it } from "vitest";
import { attemptStateAt, canSaveAnswer, submitAttempt, type AttemptClock } from "./attemptLifecycle";

const start: AttemptClock = {
  startedAt: "2027-02-01T10:00:00Z",
  expiresAt: "2027-02-01T12:00:00Z",
  state: "in_progress",
};

describe("mock attempt lifecycle", () => {
  it("allows autosaving while the examination is open", () => {
    expect(canSaveAnswer(start, "2027-02-01T11:59:59Z")).toBe(true);
  });
  it("expires exactly at the server deadline", () => {
    expect(attemptStateAt(start, "2027-02-01T12:00:00Z")).toBe("expired");
    expect(canSaveAnswer(start, "2027-02-01T12:00:00Z")).toBe(false);
  });
  it("submits only while open", () => {
    const submitted = submitAttempt(start, "2027-02-01T10:15:00Z");
    expect(submitted.state).toBe("submitted");
    expect(canSaveAnswer(submitted, "2027-02-01T10:16:00Z")).toBe(false);
    expect(() => submitAttempt(submitted, "2027-02-01T10:16:00Z")).toThrow();
  });
  it("rejects missing or backwards times", () => {
    expect(() => attemptStateAt({ ...start, expiresAt: start.startedAt }, "2027-02-01T11:00:00Z")).toThrow();
    expect(() => attemptStateAt(start, "2027-02-01T09:00:00Z")).toThrow();
  });
});
