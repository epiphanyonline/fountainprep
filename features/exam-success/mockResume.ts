/**
 * Authenticated resume contract, kept separate from the existing mock service.
 * No route is mounted and no real learner records are loaded.
 */
import type { AuthenticatedExamStore } from "./mockService";
import { ExamAccessError } from "./mockService";
import type { DisplayQuestion } from "./publicQuestion";

export type ResumeSnapshot = {
  attemptId: string;
  expiresAt: string;
  state: "in_progress" | "submitted" | "expired";
  questions: DisplayQuestion[];
  answers: { questionId: string; optionId: string | null }[];
};

/** Must verify learner ownership and return only frozen assigned questions. */
export interface ResumableExamStore extends AuthenticatedExamStore {
  loadAttemptForResume(data: {
    learnerId: string;
    attemptId: string;
  }): Promise<ResumeSnapshot | null>;
}

export async function resumeMock(
  store: ResumableExamStore,
  attemptId: string,
): Promise<ResumeSnapshot> {
  const learnerId = await store.authenticatedLearnerId();
  if (!learnerId) throw new ExamAccessError("unauthenticated");
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(attemptId)) {
    throw new ExamAccessError("invalid_request");
  }
  const snapshot = await store.loadAttemptForResume({ learnerId, attemptId });
  // The store MUST verify the owner itself, not rely only on this interface.
  if (!snapshot) throw new ExamAccessError("unavailable");
  if (snapshot.attemptId !== attemptId) {
    throw new Error("Invalid resume adapter response");
  }
  return snapshot;
}
