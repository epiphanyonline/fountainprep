/**
 * Preview-only draft validation. This is not a real exam attempt store.
 * Never persist sensitive learner content or real exams to localStorage.
 */
export type DemoExam = "JAMB" | "WAEC" | "NECO" | "IELTS";
export type DemoDraft = {
  version: 1;
  exam: DemoExam;
  expiresAt: number;
  activeIndex: number;
  answers: Record<string, string>;
  flagged: Record<string, boolean>;
  completed: boolean;
};
export const DEMO_STORAGE_KEY = "fountainprep:exam-success-preview:v1";
export const DEMO_SECONDS = 180;

export function newDemoDraft(exam: DemoExam, now: number): DemoDraft {
  return { version: 1, exam, expiresAt: now + DEMO_SECONDS * 1000,
    activeIndex: 0, answers: {}, flagged: {}, completed: false };
}

export function validateDemoDraft(raw: unknown, now: number): DemoDraft | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const draft = raw as Partial<DemoDraft>;
  if (draft.version !== 1 ||
      !["JAMB","WAEC","NECO","IELTS"].includes(String(draft.exam)) ||
      typeof draft.expiresAt !== "number" ||
      !Number.isFinite(draft.expiresAt) ||
      draft.expiresAt < now - 86_400_000 ||
      draft.expiresAt > now + 86_400_000 ||
      !Number.isInteger(draft.activeIndex) || (draft.activeIndex ?? 0) < 0 ||
      typeof draft.completed !== "boolean" ||
      !draft.answers || typeof draft.answers !== "object" || Array.isArray(draft.answers) ||
      !draft.flagged || typeof draft.flagged !== "object" || Array.isArray(draft.flagged)) {
    return null;
  }
  const answers: Record<string,string> = {};
  for (const [key, val] of Object.entries(draft.answers)) {
    if (!/^demo_[a-z]+_[0-9]+$/.test(key) || !/^[a-d]$/.test(String(val))) return null;
    answers[key] = String(val);
  }
  const flagged: Record<string,boolean> = {};
  for (const [key, val] of Object.entries(draft.flagged)) {
    if (!/^demo_[a-z]+_[0-9]+$/.test(key) || typeof val !== "boolean") return null;
    flagged[key] = val;
  }
  return {version:1, exam:draft.exam as DemoExam, expiresAt:draft.expiresAt,
    activeIndex:draft.activeIndex as number, answers, flagged, completed:draft.completed};
}

export function demoRemainingSeconds(draft: DemoDraft, now: number): number {
  return Math.max(0, Math.ceil((draft.expiresAt-now)/1000));
}
