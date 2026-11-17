/**
 * Pure mock-attempt state transitions. Persistence and access checks belong
 * to a future authenticated server endpoint, NOT this module.
 */
export type AttemptState = "in_progress" | "submitted" | "expired";

export type AttemptClock = {
  startedAt: string;
  expiresAt: string;
  state: AttemptState;
};

function parseTime(value: string): number {
  const result = Date.parse(value);
  if (!Number.isFinite(result)) throw new Error("Invalid attempt timestamp");
  return result;
}

export function attemptStateAt(attempt: AttemptClock, now: string): AttemptState {
  const startedAt = parseTime(attempt.startedAt);
  const expiresAt = parseTime(attempt.expiresAt);
  const currentTime = parseTime(now);
  if (expiresAt <= startedAt) throw new Error("Attempt expiration must follow start");
  if (currentTime < startedAt) throw new Error("Attempt not started");
  if (attempt.state !== "in_progress") return attempt.state;
  return currentTime >= expiresAt ? "expired" : "in_progress";
}

export function canSaveAnswer(attempt: AttemptClock, now: string): boolean {
  return attemptStateAt(attempt, now) === "in_progress";
}

export function canSubmitAttempt(attempt: AttemptClock, now: string): boolean {
  return attemptStateAt(attempt, now) === "in_progress";
}

/**
 * Callers MUST separately verify authenticated ownership, server-provided
 * timestamps, attempt version and idempotency. Do not rely on browser clocks.
 * Expired attempts require a separate server-side auto-submission policy.
 */
export function submitAttempt(attempt: AttemptClock, now: string): AttemptClock {
  if (!canSubmitAttempt(attempt, now)) {
    throw new Error("Attempt is not open for submission");
  }
  return { ...attempt, state: "submitted" };
}
