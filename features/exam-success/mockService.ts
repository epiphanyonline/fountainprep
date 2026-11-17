/**
 * Server-side application workflow for mock exams.
 * 
 * This deliberately provides no HTTP route and performs no database writes
 * until a staging adapter is implemented and tested.
 * 
 * The storage adapter MUST supply transactional, authenticated methods;
 * neither a browser session nor a request body is trusted to identify
 * the learner or to supply a score.
 */
import { scoreSingleChoice, type ObjectiveQuestion, type ObjectiveAnswer } from "./objectiveScoring";
import { canSaveAnswer, canSubmitAttempt, type AttemptClock } from "./attemptLifecycle";

export type MockAttempt = AttemptClock & {
  id: string;
  paperId: string;
  learnerId: string;
};

export type MockPaper = {
  id: string;
  published: boolean;
  questions: readonly ObjectiveQuestion[];
  durationSeconds: number;
};

export type StartResult = { attemptId: string; expiresAt: string };

export interface AuthenticatedExamStore {
  /** Validated server-side identity; return null for missing/invalid token. */
  authenticatedLearnerId(): Promise<string | null>;
  /** Loads only published, reviewed, licensed exam papers. */
  loadPublishedPaper(paperId: string): Promise<MockPaper | null>;
  /**
   * Atomic insert; the store generates time fields from DB server time.
   * Must be idempotent for requestId, and validate entitlement/attempt cap.
   */
  createAttempt(data: {
    learnerId: string;
    paperId: string;
    requestId: string;
  }): Promise<StartResult>;
  /**
   * Server-side membership and ownership check. In future, use a transaction
   * or RPC with row lock, not read then write in separate requests.
   */
  saveAnswerIfOpen(data: {
    learnerId: string;
    attemptId: string;
    questionId: string;
    optionId: string | null;
    requestId: string;
  }): Promise<"saved" | "closed" | "forbidden" | "invalid_question">;
  /**
   * Atomically close and mark on the server; return stored result on replay.
   * Loads answer keys in a protected schema, never via client API.
   */
  submitAndScore(data: {
    learnerId: string;
    attemptId: string;
    requestId: string;
  }): Promise<{ earned: number; possible: number; alreadySubmitted: boolean }>;
}

export class ExamAccessError extends Error {
  constructor(public readonly reason: "unauthenticated" | "unavailable" | "invalid_request") {
    super(reason);
    this.name = "ExamAccessError";
  }
}

async function requireLearner(store: AuthenticatedExamStore): Promise<string> {
  const id = await store.authenticatedLearnerId();
  if (!id) throw new ExamAccessError("unauthenticated");
  return id;
}

function requiredId(value: string): string {
  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(value)) {
    throw new ExamAccessError("invalid_request");
  }
  return value;
}

export async function startMock(
  store: AuthenticatedExamStore, paperId: string, requestId: string,
): Promise<StartResult> {
  const learnerId = await requireLearner(store);
  requiredId(paperId);
  requiredId(requestId);
  const paper = await store.loadPublishedPaper(paperId);
  if (!paper?.published || paper.questions.length === 0 || paper.durationSeconds < 1) {
    throw new ExamAccessError("unavailable");
  }
  // The transactional store must recheck paper status and entitlement.
  return store.createAttempt({ learnerId, paperId, requestId });
}

export async function saveMockAnswer(
  store: AuthenticatedExamStore,
  data: { attemptId: string; questionId: string; optionId: string | null; requestId: string },
): Promise<"saved" | "closed" | "forbidden" | "invalid_question"> {
  const learnerId = await requireLearner(store);
  requiredId(data.attemptId);
  requiredId(data.questionId);
  requiredId(data.requestId);
  if (data.optionId !== null) requiredId(data.optionId);
  return store.saveAnswerIfOpen({ ...data, learnerId });
}

export async function finishMock(
  store: AuthenticatedExamStore, attemptId: string, requestId: string,
): Promise<{ earned: number; possible: number; alreadySubmitted: boolean }> {
  const learnerId = await requireLearner(store);
  requiredId(attemptId);
  requiredId(requestId);
  return store.submitAndScore({ learnerId, attemptId, requestId });
}

// Exported solely for unit-level cross-module checks: not an API endpoint.
// Marking requires trusted, private keys; no direct client call.
export function scoreTrustedObjectivePaper(
  questions: readonly ObjectiveQuestion[], answers: readonly ObjectiveAnswer[],
) {
  return scoreSingleChoice(questions, answers);
}
export function maySaveBeforeDeadline(clock: AttemptClock, serverNow: string) {
  return canSaveAnswer(clock, serverNow);
}
export function maySubmitBeforeDeadline(clock: AttemptClock, serverNow: string) {
  return canSubmitAttempt(clock, serverNow);
}
