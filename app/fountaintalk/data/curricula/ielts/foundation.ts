import type {
  AcademyCourse,
} from "../../../types/academy";

export const ieltsFoundationCourse: AcademyCourse = {
  id: "ielts-foundation",
  academyId: "ielts",
  title: "IELTS Foundations",
  subtitle:
    "Understand the exam, identify your starting point and build the habits needed for a stronger band score.",
  level: "foundation",
  ageGroups: ["14-17", "adult"],
  accessTier: "free",
  estimatedHours: 2,
  learningOutcomes: [
    "Explain the four IELTS test sections.",
    "Recognise the main skills tested in each section.",
    "Identify common reasons candidates lose marks.",
    "Use a simple strategy to plan IELTS study.",
    "Complete a short introductory diagnostic.",
  ],
  certificate: {
    title: "IELTS Foundations Certificate",
    description:
      "Awarded after completing the IELTS Foundations course and introductory assessment.",
    minimumScore: 70,
  },
  units: [
    {
      id: "ielts-foundation-unit-1",
      unitNumber: 1,
      title: "Understand the IELTS journey",
      description:
        "Learn how the exam works, what examiners assess and how to prepare strategically.",
      accessTier: "free",
      learningOutcomes: [
        "Name the four IELTS sections.",
        "Describe the purpose of band scores.",
        "Recognise the value of diagnostic preparation.",
      ],
      lessons: [
        {
          id: "ielts-foundation-first-lesson",
          title: "Your IELTS starting point",
          objective:
            "Understand the IELTS structure and identify the first step in an effective preparation plan.",
          classPromise:
            "By the end of this lesson, you will understand the IELTS test and know how to begin preparing with purpose.",
          learningOutcomes: [
            "Identify the four IELTS sections.",
            "Explain what a band score represents.",
            "Choose a sensible first step for preparation.",
          ],
          priorKnowledgePrompt:
            "What do you already know about IELTS, and which section concerns you most?",
          completionPoints: 30,
          estimatedMinutes: 12,
          accessTier: "free",
          certificateEligible: true,
          steps: [
            {
              id: "ielts-intro-welcome",
              title: "The exam is not one skill",
              kind: "welcome",
              responseType: "none",
              teacherPrompt:
                "IELTS measures four connected language skills: listening, reading, writing and speaking. Strong preparation begins by understanding what each section asks you to do.",
              visual: {
                type: "cards",
                emoji: "🎓",
                title: "The four IELTS sections",
                items: [
                  "Listening",
                  "Reading",
                  "Writing",
                  "Speaking",
                ],
              },
              ayoPose: "welcome",
              points: 3,
            },
            {
              id: "ielts-intro-story",
              title: "Amina studies everything at once",
              kind: "story",
              responseType: "none",
              teacherPrompt:
                "Amina spends hours studying vocabulary, but she never practises timed writing or speaking. On test day, she knows many words but struggles to organise her answers. Her problem is not effort. It is an unbalanced preparation plan.",
              visual: {
                type: "illustration",
                emoji: "🧭",
                title: "Effort needs direction",
                items: [
                  "Vocabulary alone is not enough",
                  "Each section requires specific practice",
                  "Diagnostics reveal where to focus",
                ],
              },
              ayoPose: "point-slide",
              points: 3,
            },
            {
              id: "ielts-intro-concept",
              title: "What band scores mean",
              kind: "concept",
              responseType: "none",
              teacherPrompt:
                "IELTS uses band scores from zero to nine. A higher band means the candidate can use English more effectively and accurately across the tested skills. Your overall score is shaped by performance across all four sections.",
              displayText:
                "IELTS band scores describe how effectively you use English.",
              visual: {
                type: "chart",
                emoji: "📈",
                title: "Band score idea",
                items: [
                  "Lower bands: limited control",
                  "Middle bands: functional communication",
                  "Higher bands: effective and precise use",
                ],
              },
              ayoPose: "explain",
              points: 4,
            },
            {
              id: "ielts-intro-sections",
              title: "Different sections, different demands",
              kind: "concept",
              responseType: "none",
              teacherPrompt:
                "Listening tests your ability to follow spoken information. Reading tests how efficiently you understand written texts. Writing tests organisation, clarity and language control. Speaking tests fluency, vocabulary, grammar and pronunciation.",
              visual: {
                type: "comparison",
                emoji: "🧩",
                title: "What each section demands",
                items: [
                  "Listening: follow and identify",
                  "Reading: locate and interpret",
                  "Writing: organise and explain",
                  "Speaking: respond and develop",
                ],
              },
              ayoPose: "open-hands",
              points: 4,
            },
            {
              id: "ielts-intro-case",
              title: "What should David do first?",
              kind: "case-study",
              responseType: "choice",
              teacherPrompt:
                "David wants a band seven, but he has never completed an IELTS practice task. What should he do first?",
              question:
                "What is David's best first step?",
              choices: [
                {
                  id: "a",
                  label:
                    "Memorise difficult words without testing his current level",
                },
                {
                  id: "b",
                  label:
                    "Complete a diagnostic across the four sections",
                },
                {
                  id: "c",
                  label:
                    "Practise only the section he enjoys most",
                },
              ],
              acceptedAnswers: [
                "Complete a diagnostic across the four sections",
                "diagnostic",
              ],
              hint:
                "A good plan starts with evidence about current strengths and weaknesses.",
              explanation:
                "A diagnostic helps David identify where his preparation time will have the greatest impact.",
              visual: {
                type: "process",
                emoji: "🔎",
                title: "Prepare strategically",
                items: [
                  "Assess",
                  "Identify gaps",
                  "Set a target",
                  "Build a study plan",
                ],
              },
              ayoPose: "listen",
              isCheckpoint: true,
              points: 6,
            },
            {
              id: "ielts-intro-practice",
              title: "Set a preparation goal",
              kind: "practice",
              responseType: "text",
              teacherPrompt:
                "Write one clear IELTS goal. Include your target band, your deadline and the section you most need to improve.",
              question:
                "What is your IELTS preparation goal?",
              acceptedAnswers: [
                "band",
                "listening",
                "reading",
                "writing",
                "speaking",
                "month",
                "week",
                "date",
              ],
              hint:
                "Example: I want band seven by October, and I need to improve writing most.",
              explanation:
                "A specific goal makes it easier to choose the right lessons, practice schedule and assessment checkpoints.",
              ayoPose: "encourage",
              isCheckpoint: true,
              points: 6,
            },
            {
              id: "ielts-intro-summary",
              title: "Prepare with evidence",
              kind: "summary",
              responseType: "none",
              teacherPrompt:
                "IELTS success comes from understanding the exam, measuring your starting point and practising each skill deliberately. Do not study blindly. Diagnose, plan, practise, review and improve.",
              visual: {
                type: "process",
                emoji: "✅",
                title: "The IELTS improvement cycle",
                items: [
                  "Diagnose",
                  "Plan",
                  "Practise",
                  "Review",
                  "Improve",
                ],
              },
              ayoPose: "celebrate",
              isCheckpoint: true,
              points: 4,
            },
          ],
          assessment: {
            id: "ielts-foundation-lesson-assessment",
            title: "IELTS foundations diagnostic",
            description:
              "Check your understanding of the IELTS structure and preparation strategy.",
            type: "quiz",
            passingScore: 70,
            completionPoints: 20,
            lessonIds: ["ielts-foundation-first-lesson"],
          },
        },
      ],
    },
  ],
};