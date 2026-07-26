import { createLearnerProfile } from "../learner-os/profile";
import { createMentorLetter } from "../mentor/letterEngine";

export const exampleLearner = createLearnerProfile({
  learnerId: "learner-demo",
  accountName: "Daniel Adeyemi",
  preferredName: "Danny",
  now: new Date("2026-07-20T12:00:00Z"),
});

export const weeklyLetterExample = createMentorLetter(exampleLearner, {
  learnerId: exampleLearner.identity.learnerId,
  kind: "weekly",
  lessonsCompleted: 3,
  minutesLearned: 74,
  strongestTheme: "courage and leadership",
  challengeTheme: "fractions",
  nextJourneyTitle: "The Muhammad Ali Journey",
  nextJourneyReason: "It continues the theme of preparation, courage, and resilience.",
}, new Date("2026-07-26T18:00:00Z"));
