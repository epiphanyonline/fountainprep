import type {
  AcademyCourse,
} from "../../../types/academy";

export const aiFoundationCourse: AcademyCourse = {
  id: "ai-foundation",
  academyId: "ai",
  title: "Artificial Intelligence Foundations",
  subtitle:
    "Understand AI, use it responsibly and solve practical problems with it.",
  level: "foundation",
  ageGroups: ["10-13", "14-17", "adult"],
  accessTier: "free",
  estimatedHours: 2,
  learningOutcomes: [
    "Explain artificial intelligence in clear everyday language.",
    "Recognise common AI systems and their limitations.",
    "Write a useful prompt with context, instructions and constraints.",
    "Check AI-generated information before relying on it.",
    "Use AI responsibly for learning, work and creativity.",
  ],
  certificate: {
    title: "AI Foundations Certificate",
    description:
      "Awarded after completing the AI Foundations course and assessment.",
    minimumScore: 70,
  },
  units: [
    {
      id: "ai-foundation-unit-1",
      unitNumber: 1,
      title: "What artificial intelligence really is",
      description:
        "Discover how AI learns patterns, produces answers and supports human work.",
      accessTier: "free",
      learningOutcomes: [
        "Describe AI as a pattern-based computer system.",
        "Distinguish AI capability from human understanding.",
        "Identify appropriate and inappropriate uses of AI.",
      ],
      lessons: [
        {
          id: "ai-foundation-first-lesson",
          title: "Meet artificial intelligence",
          objective:
            "Explain what AI is, what it can do and why human judgement still matters.",
          classPromise:
            "By the end of this lesson, you will understand what AI really does and know how to use it more wisely.",
          learningOutcomes: [
            "Explain AI without technical jargon.",
            "Identify examples of AI in everyday life.",
            "Recognise that AI can produce convincing mistakes.",
          ],
          priorKnowledgePrompt:
            "Where have you already seen or used artificial intelligence?",
          completionPoints: 30,
          estimatedMinutes: 12,
          accessTier: "free",
          certificateEligible: true,
          steps: [
            {
              id: "ai-intro-welcome",
              title: "Your invisible assistants",
              kind: "welcome",
              responseType: "none",
              teacherPrompt:
                "Artificial intelligence may already help choose the videos you see, correct your spelling, recommend music and answer questions. Today, we will look behind the curtain and discover what AI really is.",
              visual: {
                type: "cards",
                emoji: "🤖",
                title: "AI around you",
                items: [
                  "Recommendations",
                  "Voice assistants",
                  "Translation",
                  "Image recognition",
                ],
              },
              ayoPose: "welcome",
              points: 3,
            },
            {
              id: "ai-intro-story",
              title: "The confident assistant",
              kind: "story",
              responseType: "none",
              teacherPrompt:
                "Imagine a student named Maya asking an AI assistant for the date of an important historical event. The answer sounds polished and confident, but the date is wrong. Maya learns an important lesson: confidence is not the same as accuracy.",
              visual: {
                type: "illustration",
                emoji: "🧠",
                title: "A convincing answer can still be wrong",
                items: [
                  "AI predicts useful responses",
                  "AI does not automatically verify every claim",
                  "People must check important information",
                ],
              },
              ayoPose: "point-slide",
              points: 3,
            },
            {
              id: "ai-intro-concept",
              title: "AI learns patterns",
              kind: "concept",
              responseType: "none",
              teacherPrompt:
                "AI systems are trained using large amounts of examples. They learn patterns in words, images, sounds or numbers. They then use those patterns to make predictions or generate new outputs.",
              displayText:
                "AI learns patterns from examples and uses those patterns to make predictions.",
              visual: {
                type: "process",
                emoji: "🔍",
                title: "A simplified AI process",
                items: [
                  "Examples are collected",
                  "Patterns are learned",
                  "A new input is received",
                  "An output is predicted",
                ],
              },
              ayoPose: "explain",
              points: 4,
            },
            {
              id: "ai-intro-comparison",
              title: "AI ability versus human judgement",
              kind: "concept",
              responseType: "none",
              teacherPrompt:
                "AI can process information quickly, generate ideas and recognise patterns. Humans bring values, lived context, responsibility, empathy and judgement. The strongest results usually come from humans and AI working together.",
              visual: {
                type: "comparison",
                emoji: "🤝",
                title: "Different strengths",
                items: [
                  "AI: speed, scale and pattern recognition",
                  "Human: judgement, responsibility and context",
                ],
              },
              ayoPose: "open-hands",
              points: 4,
            },
            {
              id: "ai-intro-case",
              title: "Should Daniel trust the answer?",
              kind: "case-study",
              responseType: "choice",
              teacherPrompt:
                "Daniel asks an AI tool for medical advice. It gives a detailed answer but provides no trustworthy source. What should Daniel do next?",
              question:
                "What is Daniel's best next step?",
              choices: [
                {
                  id: "a",
                  label:
                    "Follow the answer immediately because it sounds professional",
                },
                {
                  id: "b",
                  label:
                    "Verify the information with reliable medical sources or a qualified professional",
                },
                {
                  id: "c",
                  label:
                    "Share the answer online before checking it",
                },
              ],
              acceptedAnswers: [
                "Verify the information with reliable medical sources or a qualified professional",
                "verify",
                "qualified professional",
              ],
              hint:
                "Important decisions require trustworthy evidence and qualified guidance.",
              explanation:
                "AI output should not replace qualified professional advice in high-stakes situations.",
              visual: {
                type: "cards",
                emoji: "⚖️",
                title: "Pause before acting",
                items: [
                  "How serious is the decision?",
                  "Can the claim be verified?",
                  "Is expert guidance required?",
                ],
              },
              ayoPose: "listen",
              isCheckpoint: true,
              points: 6,
            },
            {
              id: "ai-intro-practice",
              title: "Build a better prompt",
              kind: "practice",
              responseType: "text",
              teacherPrompt:
                "A weak prompt says: Tell me about money. Improve it by adding the learner, the goal, the format and a useful limitation.",
              question:
                "Write a clearer prompt for an AI tutor teaching a twelve-year-old about saving money.",
              acceptedAnswers: [
                "12",
                "twelve",
                "saving",
                "example",
                "explain",
              ],
              hint:
                "Try: Explain saving to a twelve-year-old using a short story and three practical examples.",
              explanation:
                "Strong prompts give the AI context, a clear task, a useful format and sensible constraints.",
              ayoPose: "encourage",
              isCheckpoint: true,
              points: 6,
            },
            {
              id: "ai-intro-summary",
              title: "The intelligent-user rule",
              kind: "summary",
              responseType: "none",
              teacherPrompt:
                "AI is a powerful pattern-based tool, not an all-knowing authority. Give it clear instructions, examine its output and verify important claims. The real advantage belongs to the person who knows how to think with AI rather than simply accept everything it produces.",
              visual: {
                type: "process",
                emoji: "✅",
                title: "Use AI intelligently",
                items: [
                  "Ask clearly",
                  "Inspect carefully",
                  "Verify important claims",
                  "Apply human judgement",
                ],
              },
              ayoPose: "celebrate",
              isCheckpoint: true,
              points: 4,
            },
          ],
          assessment: {
            id: "ai-foundation-lesson-assessment",
            title: "AI foundations knowledge check",
            description:
              "Check your understanding of AI capability, limitations and responsible use.",
            type: "quiz",
            passingScore: 70,
            completionPoints: 20,
            lessonIds: ["ai-foundation-first-lesson"],
          },
        },
      ],
    },
  ],
};