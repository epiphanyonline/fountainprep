/**
 * TEST-ONLY, IN-MEMORY authenticated exam adapter.
 *
 * This adapter is NOT durable and must NEVER be used in production or in
 * serverless route handlers. It uses deterministic synthetic fixtures to
 * exercise the mock-service contract before a transactional staging database
 * adapter exists. No Supabase or external services are contacted.
 */
import type {
  AuthenticatedExamStore,
  MockPaper,
  StartResult,
} from "./mockService";
import { scoreSingleChoice, type ObjectiveAnswer } from "./objectiveScoring";

type AttemptRecord = {
  id: string;
  learnerId: string;
  paperId: string;
  expiresAt: number;
  state: "in_progress" | "submitted" | "expired";
  answers: Map<string, string | null>;
  result?: { earned: number; possible: number };
};

/** A synchronous clock makes deadline tests reproducible. */
export class MockMemoryStore implements AuthenticatedExamStore {
  private papers = new Map<string, MockPaper>();
  private attempts = new Map<string, AttemptRecord>();
  private startRequests = new Map<string, string>();
  private submissions = new Map<string, string>();
  private saveRequests = new Map<string, { attemptId: string; questionId: string; optionId: string | null }>();
  private nextId = 1;

  constructor(
    private readonly learnerId: string | null,
    private readonly nowMs: () => number,
  ) {}

  addPaper(paper: MockPaper): void {
    this.papers.set(paper.id, paper);
  }

  async authenticatedLearnerId(): Promise<string | null> {
    return this.learnerId;
  }

  async loadPublishedPaper(paperId: string): Promise<MockPaper | null> {
    const paper = this.papers.get(paperId);
    return paper?.published ? paper : null;
  }

  async createAttempt(data: {
    learnerId: string; paperId: string; requestId: string;
  }): Promise<StartResult> {
    if (!this.learnerId || this.learnerId !== data.learnerId) {
      throw new Error("forbidden");
    }
    const paper = await this.loadPublishedPaper(data.paperId);
    if (!paper || !paper.questions.length) throw new Error("unavailable");
    const requestKey = data.learnerId + ":" + data.requestId;
    const existing = this.startRequests.get(requestKey);
    if (existing) {
      const previous = this.attempts.get(existing)!;
      if (previous.paperId !== data.paperId) throw new Error("idempotency_conflict");
      return { attemptId: existing, expiresAt: new Date(previous.expiresAt).toISOString() };
    }
    const attemptId = "attempt_" + this.nextId++;
    const expiry = this.nowMs() + paper.durationSeconds * 1000;
    this.attempts.set(attemptId, {
      id: attemptId, learnerId: data.learnerId, paperId: data.paperId,
      expiresAt: expiry, state: "in_progress", answers: new Map(),
    });
    this.startRequests.set(requestKey, attemptId);
    return { attemptId, expiresAt: new Date(expiry).toISOString() };
  }

  async saveAnswerIfOpen(data: {
    learnerId: string; attemptId: string; questionId: string;
    optionId: string | null; requestId: string;
  }): Promise<"saved" | "closed" | "forbidden" | "invalid_question"> {
    const attempt = this.attempts.get(data.attemptId);
    if (!attempt || attempt.learnerId !== data.learnerId ||
        this.learnerId !== data.learnerId) return "forbidden";
    if (attempt.state !== "in_progress" || this.nowMs() >= attempt.expiresAt) {
      return "closed";
    }
    const paper = this.papers.get(attempt.paperId)!;
    const question = paper.questions.find(q => q.id === data.questionId);
    if (!question || (data.optionId !== null && !question.optionIds.includes(data.optionId))) {
      return "invalid_question";
    }
    const requestKey = data.learnerId + ":" + data.requestId;
    const existing = this.saveRequests.get(requestKey);
    if (existing) {
      if (existing.attemptId !== data.attemptId ||
          existing.questionId !== data.questionId ||
          existing.optionId !== data.optionId) {
        throw new Error("idempotency_conflict");
      }
      // A delayed identical retry must not overwrite a newer answer.
      return "saved";
    }
    attempt.answers.set(data.questionId, data.optionId);
    this.saveRequests.set(requestKey, {
      attemptId: data.attemptId, questionId: data.questionId, optionId: data.optionId,
    });
    return "saved";
  }

  async submitAndScore(data: {
    learnerId: string; attemptId: string; requestId: string;
  }): Promise<{ earned: number; possible: number; alreadySubmitted: boolean }> {
    const attempt = this.attempts.get(data.attemptId);
    if (!attempt || attempt.learnerId !== data.learnerId ||
        this.learnerId !== data.learnerId) throw new Error("forbidden");
    const requestKey = data.learnerId + ":" + data.requestId;
    const previous = this.submissions.get(requestKey);
    if (previous && previous !== attempt.id) throw new Error("idempotency_conflict");
    if (attempt.state === "submitted") {
      return { ...attempt.result!, alreadySubmitted: true };
    }
    if (attempt.state !== "in_progress" || this.nowMs() >= attempt.expiresAt) {
      throw new Error("closed");
    }
    const paper = this.papers.get(attempt.paperId)!;
    const answers: ObjectiveAnswer[] = [...attempt.answers.entries()].map(
      ([questionId, optionId]) => ({ questionId, optionId }),
    );
    const { earned, possible } = scoreSingleChoice(paper.questions, answers);
    attempt.result = { earned, possible };
    attempt.state = "submitted";
    this.submissions.set(requestKey, attempt.id);
    return { earned, possible, alreadySubmitted: false };
  }
}
