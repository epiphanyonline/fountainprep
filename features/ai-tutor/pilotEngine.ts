/**
 * Exam Tutor teaching prototype — PREVIEW ONLY.
 *
 * A deterministic lesson engine with original, illustrative items.
 * It demonstrates diagnostic -> instruction -> practice -> remediation,
 * not live model inference, paid exams, verified past papers, or mastery.
 * Never use these browser-visible answer keys for a real examination.
 */
export type TutorTrackId = "jamb-maths" | "jamb-english" | "ielts-reading";
export type TutorStep = "diagnostic" | "lesson" | "practice" | "reteach" | "retry" | "complete";
export type TutorQuestion = {
  id: string;
  prompt: string;
  options: { id: string; text: string }[];
  correctId: string;
  explanation: string;
};
export type TutorTrack = {
  id: TutorTrackId;
  exam: string;
  subject: string;
  title: string;
  goal: string;
  welcome: string;
  concept: string;
  analogy: string;
  guidedExample: string;
  simplerExplanation: string;
  nextLesson: string;
  diagnostic: TutorQuestion;
  practice: TutorQuestion;
  retry: TutorQuestion;
};
export type TutorSession = {
  version: 1;
  track: TutorTrackId;
  step: TutorStep;
  answers: Partial<Record<"diagnostic" | "practice" | "retry", string>>;
  explainedFirst: boolean;
  feedback: string;
};

export const TUTOR_TRACKS: Record<TutorTrackId, TutorTrack> = {
  "jamb-maths": {
    id: "jamb-maths",
    exam: "JAMB UTME",
    subject: "Mathematics",
    title: "Percentages and successive changes",
    goal: "Understand why an increase and decrease of the same percentage do not cancel out.",
    welcome: "Welcome! I want to discover how you think, not just whether you can guess an answer. We'll start with one short question and adapt from there.",
    concept: "A percentage is always calculated from its CURRENT base. After a 10% increase, a later 10% decrease uses the new, larger amount.",
    analogy: "Think of a price tag. The shop changes the tag after every adjustment, so the second calculation is based on the updated price.",
    guidedExample: "Start with ₦1,000. Increase by 10%: ₦1,100. Decrease that by 10%: ₦990. The final amount is ₦10 less than the starting amount.",
    simplerExplanation: "First work out 10% of the starting price and add it. Then work out 10% of THAT new price and subtract it. The second 10% is not the same number as the first.",
    nextLesson: "Profit, loss and percentage discounts",
    diagnostic: {
      id: "jm-d1", prompt: "A notebook costs ₦2,000. Its price rises by 10%. What is the new price?",
      options: [
        { id: "a", text: "₦2,010" }, { id: "b", text: "₦2,100" },
        { id: "c", text: "₦2,200" }, { id: "d", text: "₦2,400" },
      ],
      correctId: "c", explanation: "10% of ₦2,000 is ₦200. Add ₦200 to get ₦2,200.",
    },
    practice: {
      id: "jm-p1", prompt: "A ticket costs ₦8,000. The price increases by 10%, then decreases by 10%. What is the final price?",
      options: [
        { id: "a", text: "₦8,000" }, { id: "b", text: "₦7,920" },
        { id: "c", text: "₦8,800" }, { id: "d", text: "₦7,200" },
      ],
      correctId: "b", explanation: "₦8,000 × 1.10 = ₦8,800; then ₦8,800 × 0.90 = ₦7,920.",
    },
    retry: {
      id: "jm-r1", prompt: "A device costs ₦20,000. Its price rises by 25% and then falls by 20% of the new price. What is the final price?",
      options: [
        { id: "a", text: "₦19,000" }, { id: "b", text: "₦20,000" },
        { id: "c", text: "₦21,000" }, { id: "d", text: "₦25,000" },
      ],
      correctId: "b", explanation: "₦20,000 × 1.25 = ₦25,000, then ₦25,000 × 0.80 = ₦20,000. Different percentage rates can cancel because their bases differ.",
    },
  },
  "jamb-english": {
    id: "jamb-english",
    exam: "JAMB UTME",
    subject: "Use of English",
    title: "Conditional sentences",
    goal: "Tell the difference between real future conditions and unreal past conditions.",
    welcome: "I’ll help you notice the pattern behind each sentence. You won't need to memorise an answer without understanding why it works.",
    concept: "For an unreal past event, use 'if + had + past participle' and 'would have + past participle'. For a real future possibility, use 'if + present' and 'will + verb'.",
    analogy: "An unreal past conditional is like rewinding a film and imagining that one earlier event had changed.",
    guidedExample: "'If Ada had revised, she would have passed.' We are imagining an alternative past, not predicting the future.",
    simplerExplanation: "Look for 'had' in the IF part. It signals an imagined past. In the result part, choose 'would have' plus the past participle.",
    nextLesson: "Concord and subject–verb agreement",
    diagnostic: {
      id: "je-d1", prompt: "If it rains tomorrow, we ___ indoors.",
      options: [
        { id: "a", text: "stayed" }, { id: "b", text: "will stay" },
        { id: "c", text: "would have stayed" }, { id: "d", text: "had stayed" },
      ],
      correctId: "b", explanation: "The first conditional describes a real future possibility: if + present, will + verb.",
    },
    practice: {
      id: "je-p1", prompt: "If the team had arrived earlier, they ___ the opening speech.",
      options: [
        { id: "a", text: "will hear" }, { id: "b", text: "would hear" },
        { id: "c", text: "would have heard" }, { id: "d", text: "had hear" },
      ],
      correctId: "c", explanation: "The 'if' clause is past perfect ('had arrived'), so use 'would have heard' for the imagined result.",
    },
    retry: {
      id: "je-r1", prompt: "If I had known about the road closure, I ___ another route.",
      options: [
        { id: "a", text: "will choose" }, { id: "b", text: "would choose" },
        { id: "c", text: "would have chosen" }, { id: "d", text: "choose" },
      ],
      correctId: "c", explanation: "The situation refers to an unreal past; the result uses 'would have chosen'.",
    },
  },
  "ielts-reading": {
    id: "ielts-reading",
    exam: "IELTS Academic / General",
    subject: "Reading",
    title: "Distinguishing claims from evidence",
    goal: "Recognise what a short passage states, implies or does not establish.",
    welcome: "We'll practise careful reading. A strong reader separates what the passage says from what they assume it says.",
    concept: "Find the exact words that support a claim. If a claim adds information not present in the passage, you should not treat it as proven.",
    analogy: "Imagine you are a detective. Only evidence in the passage counts, even if another explanation sounds plausible.",
    guidedExample: "Passage: 'The museum reopened in April.' Claim: 'It reopened after a renovation.' The passage doesn't mention renovation, so we cannot confirm that reason.",
    simplerExplanation: "Ask yourself: 'Which exact words show this is true?' If there are no such words, the claim may not be supported.",
    nextLesson: "Scanning for dates, names and key details",
    diagnostic: {
      id: "ir-d1", prompt: "Passage: 'The local library opened at 9 am on weekdays.' Claim: 'The library opened at 9 am on Monday.' Is this supported?",
      options: [
        { id: "a", text: "Yes, it is supported" }, { id: "b", text: "No, it is contradicted" },
        { id: "c", text: "The passage gives no information" }, { id: "d", text: "Only on weekends" },
      ],
      correctId: "a", explanation: "Monday is a weekday, so the opening time given for weekdays applies.",
    },
    practice: {
      id: "ir-p1", prompt: "Passage: 'After moving to a larger venue, the science club welcomed more visitors.' Claim: 'Ticket prices were reduced after the move.' What can we conclude?",
      options: [
        { id: "a", text: "The claim is supported" }, { id: "b", text: "The claim is contradicted" },
        { id: "c", text: "The passage does not say" }, { id: "d", text: "Entry became free" },
      ],
      correctId: "c", explanation: "The passage discusses visitor numbers and venue size, not ticket prices.",
    },
    retry: {
      id: "ir-r1", prompt: "Passage: 'The train now leaves at 7:15 instead of 7:30.' Claim: 'The train leaves earlier than before.' Is the claim supported?",
      options: [
        { id: "a", text: "No information" }, { id: "b", text: "Yes" },
        { id: "c", text: "No, contradicted" }, { id: "d", text: "Only on Fridays" },
      ],
      correctId: "b", explanation: "7:15 is earlier than 7:30; the passage directly supports the claim.",
    },
  },
};

const STEPS: TutorStep[] = ["diagnostic", "lesson", "practice", "reteach", "retry", "complete"];

export function startTutorDemo(track: TutorTrackId): TutorSession {
  if (!Object.prototype.hasOwnProperty.call(TUTOR_TRACKS, track)) throw new Error("Unsupported tutor track");
  return { version: 1, track, step: "diagnostic", answers: {}, explainedFirst: false, feedback: "" };
}

export function tutorQuestion(session: TutorSession): TutorQuestion | null {
  const track = TUTOR_TRACKS[session.track];
  if (session.step === "diagnostic") return track.diagnostic;
  if (session.step === "practice") return track.practice;
  if (session.step === "retry") return track.retry;
  return null;
}

export function moveTutorDemo(
  session: TutorSession,
  action: { type: "teach" | "continue" | "answer"; choiceId?: string },
): TutorSession {
  if (session.step === "complete") return session;
  if (action.type === "teach") {
    if (session.step === "diagnostic") return { ...session, step: "lesson", explainedFirst: true };
    if (session.step === "practice") return { ...session, step: "reteach" };
    return session;
  }
  if (action.type === "continue") {
    if (session.step === "lesson") return { ...session, step: "practice" };
    if (session.step === "reteach") return { ...session, step: "retry" };
    return session;
  }
  if (action.type !== "answer") return session;
  const q = tutorQuestion(session);
  if (!q || !action.choiceId || !q.options.some(opt => opt.id === action.choiceId)) return session;
  const correct = q.correctId === action.choiceId;
  const answers = { ...session.answers, [session.step]: action.choiceId };
  if (session.step === "diagnostic") {
    return {
      ...session, answers, step: correct ? "practice" : "lesson",
      feedback: correct
        ? "Good starting point. Let's try a harder question to check your understanding."
        : "Thanks for trying. That's useful information; I'll explain the idea before we practise.",
    };
  }
  if (session.step === "practice") {
    return {
      ...session, answers, step: correct ? "complete" : "reteach",
      feedback: correct
        ? "Well done. You applied the principle correctly in this example."
        : "Not quite. I'll try a simpler explanation, then a fresh example.",
    };
  }
  return {
    ...session, answers, step: "complete",
    feedback: correct
      ? "Nice recovery. You used the revised explanation in a new question."
      : "This topic still needs practice. A human tutor or another guided lesson could help.",
  };
}

export function tutorOutcome(session: TutorSession): "demonstrated" | "improving" | "needs-practice" | null {
  if (session.step !== "complete") return null;
  const track = TUTOR_TRACKS[session.track];
  if (session.answers.practice === track.practice.correctId) return "demonstrated";
  if (session.answers.retry === track.retry.correctId) return "improving";
  return "needs-practice";
}

export function restoreTutorDemo(input: unknown): TutorSession | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const state = input as Partial<TutorSession>;
  if (state.version !== 1 || !state.track || !Object.prototype.hasOwnProperty.call(TUTOR_TRACKS, state.track) ||
      !state.step || !STEPS.includes(state.step) ||
      !state.answers || typeof state.answers !== "object" || Array.isArray(state.answers) ||
      typeof state.explainedFirst !== "boolean" ||
      typeof state.feedback !== "string" || state.feedback.length > 400) return null;
  for (const [key, value] of Object.entries(state.answers)) {
    if (!["diagnostic", "practice", "retry"].includes(key) ||
        typeof value !== "string" || !/^[a-d]$/.test(value)) return null;
  }
  return {
    version: 1, track: state.track, step: state.step,
    answers: { ...state.answers }, explainedFirst: state.explainedFirst, feedback: state.feedback,
  };
}
