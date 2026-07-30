import type {
  AcademyCourse,
} from "../../../types/academy";

export const articulationFoundationCourse: AcademyCourse = {
  id: "articulation-foundation",
  academyId: "articulation",
  title: "Articulation Foundations",
  subtitle:
    "Build clarity, confidence, pronunciation and expressive speaking habits.",
  level: "foundation",
  ageGroups: ["10-13", "14-17", "adult"],
  accessTier: "free",
  estimatedHours: 2,
  learningOutcomes: [
    "Explain the main elements of clear speech.",
    "Recognise common causes of unclear delivery.",
    "Use breathing, pace and emphasis more deliberately.",
    "Reduce filler words and rushed speech.",
    "Deliver a short message with greater confidence.",
  ],
  certificate: {
    title: "Articulation Foundations Certificate",
    description:
      "Awarded after completing the foundation course and introductory speaking assessment.",
    minimumScore: 70,
  },
  units: [
    {
      id: "articulation-foundation-unit-1",
      unitNumber: 1,
      title: "Speak so people can follow you",
      description:
        "Learn the foundations of clear, confident and expressive speech.",
      accessTier: "free",
      learningOutcomes: [
        "Identify the building blocks of clear speech.",
        "Use a steady pace and purposeful pauses.",
        "Structure a short spoken message.",
      ],
      lessons: [
        {
          id: "articulation-foundation-first-lesson",
          title: "Clarity before complexity",
          objective:
            "Understand what makes speech clear and practise a simple method for delivering ideas confidently.",
          classPromise:
            "By the end of this lesson, you will know how to make your speech easier to understand and more confident.",
          learningOutcomes: [
            "Explain why pace, pronunciation and structure matter.",
            "Recognise the effect of filler words.",
            "Use a simple opening, main point and conclusion.",
          ],
          priorKnowledgePrompt:
            "When do you find speaking most difficult: conversations, presentations, interviews or reading aloud?",
          completionPoints: 30,
          estimatedMinutes: 12,
          accessTier: "free",
          certificateEligible: true,
          steps: [
            {
              id: "articulation-intro-welcome",
              title: "Being understood is the first victory",
              kind: "welcome",
              responseType: "none",
              teacherPrompt:
                "Powerful speaking does not begin with difficult vocabulary. It begins with helping another person understand your message easily.",
              visual: {
                type: "cards",
                emoji: "🎙️",
                title: "Clear speech combines",
                items: [
                  "Breath",
                  "Pronunciation",
                  "Pace",
                  "Structure",
                  "Expression",
                ],
              },
              ayoPose: "welcome",
              points: 3,
            },
            {
              id: "articulation-intro-story",
              title: "The brilliant idea nobody heard",
              kind: "story",
              responseType: "none",
              teacherPrompt:
                "Samuel has an excellent idea during a meeting. He speaks very quickly, looks down and fills every pause with um. His idea is strong, but the listeners struggle to follow it. The problem is not his intelligence. It is his delivery.",
              visual: {
                type: "illustration",
                emoji: "💬",
                title: "A good idea still needs clear delivery",
                items: [
                  "The message was valuable",
                  "The pace was too fast",
                  "Filler words weakened confidence",
                  "The audience lost the structure",
                ],
              },
              ayoPose: "point-slide",
              points: 3,
            },
            {
              id: "articulation-intro-concept",
              title: "The five foundations of clear speech",
              kind: "concept",
              responseType: "none",
              teacherPrompt:
                "Clear speech depends on controlled breathing, distinct sounds, a manageable pace, deliberate emphasis and an organised message. Improving only one area can help, but combining them creates a much stronger result.",
              visual: {
                type: "process",
                emoji: "🧩",
                title: "Clear speech framework",
                items: [
                  "Breathe",
                  "Pronounce",
                  "Pace",
                  "Emphasise",
                  "Organise",
                ],
              },
              ayoPose: "explain",
              points: 4,
            },
            {
              id: "articulation-intro-pause",
              title: "A pause is not a failure",
              kind: "concept",
              responseType: "none",
              teacherPrompt:
                "Many speakers rush because silence feels uncomfortable. A short pause can make you sound more thoughtful, help the listener process your point and reduce filler words.",
              displayText:
                "A purposeful pause can sound more confident than an unnecessary filler word.",
              visual: {
                type: "comparison",
                emoji: "⏸️",
                title: "Compare the effect",
                items: [
                  "Rushed: harder to follow",
                  "Filled pause: less confident",
                  "Purposeful pause: clear and controlled",
                ],
              },
              ayoPose: "open-hands",
              points: 4,
            },
            {
              id: "articulation-intro-case",
              title: "How should Leila improve?",
              kind: "case-study",
              responseType: "choice",
              teacherPrompt:
                "Leila knows her presentation well, but she speaks so quickly that listeners miss important points. What is the best first improvement?",
              question:
                "What should Leila practise first?",
              choices: [
                {
                  id: "a",
                  label:
                    "Add more complicated words",
                },
                {
                  id: "b",
                  label:
                    "Slow her pace and pause after important ideas",
                },
                {
                  id: "c",
                  label:
                    "Speak even faster to finish sooner",
                },
              ],
              acceptedAnswers: [
                "Slow her pace and pause after important ideas",
                "slow",
                "pause",
              ],
              hint:
                "Think about what would make her message easier to follow.",
              explanation:
                "A controlled pace and purposeful pauses give listeners time to understand important ideas.",
              visual: {
                type: "process",
                emoji: "🗣️",
                title: "Control the delivery",
                items: [
                  "Breathe",
                  "Speak one idea",
                  "Pause",
                  "Continue",
                ],
              },
              ayoPose: "listen",
              isCheckpoint: true,
              points: 6,
            },
            {
              id: "articulation-intro-practice",
              title: "Deliver a clear three-part message",
              kind: "practice",
              responseType: "text",
              teacherPrompt:
                "Prepare a short message with three parts: your opening, your main point and your conclusion. Keep each part to one sentence.",
              question:
                "Write your three-part message.",
              acceptedAnswers: [
                "first",
                "because",
                "finally",
                "conclusion",
                "important",
              ],
              hint:
                "Example: Today I want to explain why reading matters. Reading develops knowledge and imagination. Therefore, reading every day is a powerful habit.",
              explanation:
                "A simple structure helps both the speaker and the listener follow the message.",
              ayoPose: "encourage",
              isCheckpoint: true,
              points: 6,
            },
            {
              id: "articulation-intro-summary",
              title: "Speak for the listener",
              kind: "summary",
              responseType: "none",
              teacherPrompt:
                "Clear articulation is not about sounding artificial or perfect. It is about serving the listener. Breathe, pronounce carefully, control your pace, emphasise key words and organise your thought before you speak.",
              visual: {
                type: "process",
                emoji: "✅",
                title: "The clear-speaker routine",
                items: [
                  "Prepare the message",
                  "Breathe",
                  "Speak steadily",
                  "Pause deliberately",
                  "Finish clearly",
                ],
              },
              ayoPose: "celebrate",
              isCheckpoint: true,
              points: 4,
            },
          ],
          assessment: {
            id: "articulation-foundation-lesson-assessment",
            title: "Articulation foundations assessment",
            description:
              "Check your understanding of pace, pauses, clarity and message structure.",
            type: "quiz",
            passingScore: 70,
            completionPoints: 20,
            lessonIds: [
              "articulation-foundation-first-lesson",
            ],
          },
        },
      ],
    },
  ],
};