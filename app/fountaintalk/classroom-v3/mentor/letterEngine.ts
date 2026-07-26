import type { LearnerProfile } from "../learner-os/types";
import { learnerDisplayName } from "../learner-os/profile";
import type { MentorLetter, MentorLetterInput } from "./types";

const id = () => `letter_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export function createMentorLetter(
  profile: LearnerProfile,
  input: MentorLetterInput,
  now = new Date(),
): MentorLetter {
  const name = learnerDisplayName(profile);
  const lessons = input.lessonsCompleted ?? 0;
  const theme = input.strongestTheme || "curiosity";

  if (input.kind === "weekly") {
    const paragraphs = lessons > 0
      ? [
          `This week you completed ${lessons} lesson${lessons === 1 ? "" : "s"}${input.minutesLearned ? ` and spent ${input.minutesLearned} minutes learning` : ""}.`,
          `I noticed your interest in ${theme}. The way you kept returning to that idea tells me it matters to you.`,
          input.challengeTheme
            ? `You also met a challenge in ${input.challengeTheme}. Struggle is not a sign to stop; it is often the place where real learning begins.`
            : "You approached the week with steady curiosity, and that consistency is worth celebrating.",
          input.nextJourneyTitle
            ? `For your next step, I recommend ${input.nextJourneyTitle}${input.nextJourneyReason ? `. ${input.nextJourneyReason}` : "."}`
            : "Keep going. Small lessons, repeated faithfully, become remarkable growth.",
        ]
      : [
          "This week was quieter than usual, and that is okay.",
          "Learning journeys have busy chapters and quiet chapters. What matters is that the door remains open.",
          input.nextJourneyTitle
            ? `When you are ready, ${input.nextJourneyTitle} is waiting for you.`
            : "When you are ready, I will be here for the next lesson.",
        ];

    return {
      id: id(),
      learnerId: input.learnerId,
      kind: input.kind,
      subject: "Your week with Ayo",
      salutation: `Dear ${name},`,
      paragraphs,
      signOff: "— Ayo",
      createdAt: now.toISOString(),
      metadata: { lessonsCompleted: lessons, strongestTheme: theme },
    };
  }

  const content: Record<Exclude<MentorLetterInput["kind"], "weekly">, { subject: string; paragraphs: string[] }> = {
    welcome: {
      subject: "Welcome to FountainPrep",
      paragraphs: [
        "Today is the beginning of your learning journey with me.",
        "We will explore stories, ideas, skills, and questions together. You do not need to know every destination yet; curiosity is enough to begin.",
      ],
    },
    birthday: {
      subject: `Happy birthday, ${name}!`,
      paragraphs: [
        "I hope today brings you joy.",
        input.milestone
          ? `This year, one milestone stands out: ${input.milestone}.`
          : "The learning you have done this year is becoming part of who you are.",
        "I cannot wait to see what you discover next.",
      ],
    },
    anniversary: {
      subject: "Happy learning anniversary",
      paragraphs: [
        "One year ago, you began this journey.",
        input.milestone || lessons
          ? `Since then, ${input.milestone ?? `you have completed ${lessons} lessons`}.`
          : "Since then, every question and every return to the classroom has added another page to your story.",
        "Thank you for allowing me to learn alongside you.",
      ],
    },
    "academy-complete": {
      subject: `You completed ${input.currentAcademy ?? "an academy"}`,
      paragraphs: [
        `Today you completed ${input.currentAcademy ?? "an important learning journey"}.`,
        input.strongestTheme
          ? `What stands out most is how you grew in ${input.strongestTheme}.`
          : "What matters is not only what you remember, but how the journey has changed the way you think.",
        "I am proud of the work you put in. I will be waiting for our next journey.",
      ],
    },
    encouragement: {
      subject: "Keep going",
      paragraphs: [
        input.challengeTheme
          ? `${input.challengeTheme} has been difficult lately.`
          : "This part of the journey has been more difficult than usual.",
        "The strongest learners are not those who never struggle. They are the ones who keep returning with patience.",
        "We will tackle it together, one clear step at a time.",
      ],
    },
  };

  const selected = content[input.kind];
  return {
    id: id(), learnerId: input.learnerId, kind: input.kind,
    subject: selected.subject, salutation: `Dear ${name},`, paragraphs: selected.paragraphs,
    signOff: "— Ayo", createdAt: now.toISOString(), metadata: { milestone: input.milestone },
  };
}
