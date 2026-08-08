import {
  createActivity,
  createCourse,
  createLesson,
  createUnit,
} from "@/features/academy-content";

const deliveryModes = [
  "ai-classroom",
  "self-study",
  "revision",
  "assessment",
] as const;

const mandelaLesson = createLesson({
  id: "greatness-foundation-mandela",
  academy: "biography",
  programmeId: "greatness-foundation",
  courseId: "greatness-foundation-course",
  unitId: "greatness-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 1,
  title: "Nelson Mandela: Courage and Reconciliation",
  description:
    "Explore how Nelson Mandela's choices, endurance and leadership influenced South Africa and the world.",
  objective:
    "The learner will identify key moments in Mandela's life and explain how courage, persistence and reconciliation shaped his impact.",
  learningOutcomes: [
    "Place major events from Mandela's life in sequence.",
    "Explain the difference between courage and recklessness.",
    "Describe why reconciliation became an important part of his leadership.",
    "Connect one character lesson from the story to the learner's own life.",
  ],
  estimatedMinutes: 22,
  completionPoints: 40,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["6-9", "10-13", "14-17", "adult"],
  activities: [
    createActivity({
      id: "bio-mandela-a1",
      type: "introduction",
      title: "A Life That Changed a Nation",
      teacherPrompt:
        "Nelson Mandela grew up in South Africa and became one of the best-known leaders in the struggle against apartheid, a system that separated people by race and denied the Black majority many rights.",
      narrationText:
        "Today we are meeting Nelson Mandela. His story is about courage, endurance, difficult choices, and what happened when he later chose reconciliation instead of revenge.",
      visualTitle: "Nelson Mandela",
      visualDescription:
        "Story focus: courage, endurance, leadership and reconciliation.",
    }),
    createActivity({
      id: "bio-mandela-a2",
      type: "teach",
      title: "The World Around Him",
      teacherPrompt:
        "Mandela trained as a lawyer. As apartheid became more deeply enforced, he became active in efforts to challenge racial injustice.",
      story:
        "Imagine being told that the law gives different rights to people simply because of the colour of their skin. Mandela's generation had to decide whether to accept that system or challenge it.",
      visualTitle: "South Africa under apartheid",
      visualDescription:
        "A society shaped by racial separation and unequal rights.",
    }),
    createActivity({
      id: "bio-mandela-a3",
      type: "teach",
      title: "Twenty-Seven Years in Prison",
      teacherPrompt:
        "Mandela spent 27 years in prison. Much of that time was on Robben Island. Imprisonment took away his freedom, but it did not end his political influence.",
      narrationText:
        "Twenty-seven years is longer than the entire childhood of most learners. Mandela lost years with his family and lived under strict prison conditions. Yet his name continued to represent resistance to apartheid.",
      visualTitle: "27 years",
      visualDescription:
        "A long period of imprisonment that tested endurance and purpose.",
    }),
    createActivity({
      id: "bio-mandela-a4",
      type: "case-study",
      title: "A Leadership Decision",
      teacherPrompt:
        "After his release, Mandela could have focused only on punishment. Instead, he became strongly associated with negotiation and reconciliation as South Africa moved toward democratic rule.",
      learnerInstruction:
        "Why might reconciliation be difficult after years of injustice? Give one reason it might still be valuable.",
      story:
        "This is a decision case: leadership sometimes means choosing what may help a country move forward even when anger and pain are understandable.",
      visualTitle: "Revenge or reconciliation?",
      visualDescription:
        "Great leadership can require difficult choices after conflict.",
      points: 8,
    }),
    createActivity({
      id: "bio-mandela-a5",
      type: "multiple-choice",
      title: "What Does Courage Look Like?",
      teacherPrompt:
        "Which statement best matches the lesson?",
      options: [
        {
          id: "a",
          label: "Courage means never feeling afraid.",
          value: "never-afraid",
        },
        {
          id: "b",
          label: "Courage can mean acting with purpose even when the cost is difficult.",
          value: "purpose",
        },
        {
          id: "c",
          label: "Courage means always winning immediately.",
          value: "winning",
        },
      ],
      correctOptionId: "b",
      successReply:
        "Correct. Courage is not the absence of difficulty; it can involve purposeful action despite difficulty.",
      retryReply:
        "Think about what Mandela's long imprisonment shows about courage and endurance.",
      points: 6,
    }),
    createActivity({
      id: "bio-mandela-a6",
      type: "reflection",
      title: "Bring the Story Home",
      teacherPrompt:
        "Choose one quality from Mandela's story — courage, endurance, learning, leadership or reconciliation — and describe one small way you could practise it.",
      visualTitle: "Greatness becomes practical",
      visualDescription:
        "A biography matters most when its lessons influence our own choices.",
      points: 10,
    }),
  ],
});

const greatnessUnit = createUnit({
  id: "greatness-foundation-unit-1",
  courseId: "greatness-foundation-course",
  unitNumber: 1,
  title: "Lives That Expanded Possibility",
  description:
    "Meet people whose choices, work and character produced lasting impact.",
  learningOutcomes: [
    "Understand achievement in human context.",
    "Recognise character behind public impact.",
    "Reflect on lessons that can be practised personally.",
  ],
  lessons: [mandelaLesson],
});

export const biographyFoundationCourse = createCourse({
  id: "greatness-foundation-course",
  programmeId: "greatness-foundation",
  stage: "foundation",
  title: "Biography of Greatness Foundation",
  description:
    "Immersive, narrated stories of people whose lives can teach courage, curiosity, service, enterprise and leadership.",
  learningOutcomes: [
    "Retell important moments from a person's life.",
    "Connect choices to consequences and impact.",
    "Identify transferable character lessons.",
  ],
  estimatedHours: 1,
  units: [greatnessUnit],
});
