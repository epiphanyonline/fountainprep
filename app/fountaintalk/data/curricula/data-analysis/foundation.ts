import type {
  AcademyCourse,
} from "../../../types/academy";

export const dataAnalysisFoundationCourse: AcademyCourse = {
  id: "data-analysis-foundation",
  academyId: "data-analysis",
  title: "Data Analysis Foundations",
  subtitle:
    "Learn how to ask good questions, inspect data and communicate useful insights.",
  level: "foundation",
  ageGroups: ["14-17", "adult"],
  accessTier: "free",
  estimatedHours: 2,
  learningOutcomes: [
    "Explain what data analysis is and why it matters.",
    "Distinguish data, information and insight.",
    "Recognise common data-quality problems.",
    "Choose an appropriate chart for a simple question.",
    "Communicate one clear conclusion supported by evidence.",
  ],
  certificate: {
    title: "Data Analysis Foundations Certificate",
    description:
      "Awarded after completing the foundation course and introductory assessment.",
    minimumScore: 70,
  },
  units: [
    {
      id: "data-analysis-foundation-unit-1",
      unitNumber: 1,
      title: "Think like a data analyst",
      description:
        "Learn how analysts turn raw observations into useful decisions.",
      accessTier: "free",
      learningOutcomes: [
        "Start analysis with a clear question.",
        "Inspect data before drawing conclusions.",
        "Separate evidence from assumptions.",
      ],
      lessons: [
        {
          id: "data-analysis-foundation-first-lesson",
          title: "From numbers to decisions",
          objective:
            "Understand how data becomes insight and use a simple analysis process.",
          classPromise:
            "By the end of this lesson, you will know how to turn a table of numbers into a useful, evidence-based conclusion.",
          learningOutcomes: [
            "Explain the difference between data and insight.",
            "Identify a useful analysis question.",
            "Recognise why data quality matters.",
          ],
          priorKnowledgePrompt:
            "Where have you used numbers, tables or charts to make a decision?",
          completionPoints: 30,
          estimatedMinutes: 12,
          accessTier: "free",
          certificateEligible: true,
          steps: [
            {
              id: "data-intro-welcome",
              title: "Every dataset hides a question",
              kind: "welcome",
              responseType: "none",
              teacherPrompt:
                "A spreadsheet full of numbers is not yet an answer. Data analysis begins when someone asks a useful question and examines the evidence carefully.",
              visual: {
                type: "cards",
                emoji: "📊",
                title: "The analyst's journey",
                items: [
                  "Ask a question",
                  "Inspect the data",
                  "Find a pattern",
                  "Explain the meaning",
                ],
              },
              ayoPose: "welcome",
              points: 3,
            },
            {
              id: "data-intro-story",
              title: "The shop with falling sales",
              kind: "story",
              responseType: "none",
              teacherPrompt:
                "A shop owner notices that monthly sales have fallen. At first, she assumes customers dislike the products. An analyst checks the data and discovers that the shop was closed for several days during renovations. The numbers were correct, but the first explanation was wrong.",
              visual: {
                type: "illustration",
                emoji: "🏪",
                title: "Do not confuse a pattern with its cause",
                items: [
                  "Sales fell",
                  "The first assumption was weak",
                  "Context explained the change",
                ],
              },
              ayoPose: "point-slide",
              points: 3,
            },
            {
              id: "data-intro-concept",
              title: "Data, information and insight",
              kind: "concept",
              responseType: "none",
              teacherPrompt:
                "Data is a collection of observations. Information is data organised so it can be understood. Insight is a useful interpretation that helps someone decide what to do.",
              displayText:
                "Data becomes valuable when it supports understanding and action.",
              visual: {
                type: "process",
                emoji: "🔍",
                title: "From raw data to action",
                items: [
                  "Data: recorded observations",
                  "Information: organised meaning",
                  "Insight: useful conclusion",
                  "Decision: informed action",
                ],
              },
              ayoPose: "explain",
              points: 4,
            },
            {
              id: "data-intro-quality",
              title: "Bad data creates bad conclusions",
              kind: "concept",
              responseType: "none",
              teacherPrompt:
                "Before analysing, check whether values are missing, duplicated, inconsistent or impossible. A beautiful chart cannot rescue unreliable data.",
              visual: {
                type: "cards",
                emoji: "🧹",
                title: "Common data-quality problems",
                items: [
                  "Missing values",
                  "Duplicate records",
                  "Inconsistent labels",
                  "Incorrect measurements",
                ],
              },
              ayoPose: "open-hands",
              points: 4,
            },
            {
              id: "data-intro-case",
              title: "Which conclusion is justified?",
              kind: "case-study",
              responseType: "choice",
              teacherPrompt:
                "A class survey shows that eight out of ten participating students prefer digital notes. However, only ten students answered out of a school of five hundred. What is the most responsible conclusion?",
              question:
                "Which conclusion is best supported by the evidence?",
              choices: [
                {
                  id: "a",
                  label:
                    "Every student in the school prefers digital notes",
                },
                {
                  id: "b",
                  label:
                    "Most students who answered the small survey preferred digital notes",
                },
                {
                  id: "c",
                  label:
                    "The school should immediately remove all printed materials",
                },
              ],
              acceptedAnswers: [
                "Most students who answered the small survey preferred digital notes",
                "students who answered",
                "small survey",
              ],
              hint:
                "Consider who actually participated and how large the sample was.",
              explanation:
                "The survey describes the respondents, but the small sample does not justify a claim about every student.",
              visual: {
                type: "comparison",
                emoji: "⚖️",
                title: "Evidence versus overstatement",
                items: [
                  "Supported: respondents preferred digital notes",
                  "Unsupported: everyone in the school agrees",
                ],
              },
              ayoPose: "listen",
              isCheckpoint: true,
              points: 6,
            },
            {
              id: "data-intro-practice",
              title: "Turn a topic into a question",
              kind: "practice",
              responseType: "text",
              teacherPrompt:
                "The topic is customer satisfaction. Turn this broad topic into one clear question that data could help answer.",
              question:
                "What question would you investigate?",
              acceptedAnswers: [
                "customer",
                "satisfaction",
                "why",
                "which",
                "how",
                "rating",
                "service",
              ],
              hint:
                "Example: Which part of the service receives the lowest customer rating?",
              explanation:
                "A focused question helps you choose the right data and avoid aimless analysis.",
              ayoPose: "encourage",
              isCheckpoint: true,
              points: 6,
            },
            {
              id: "data-intro-summary",
              title: "The analyst's discipline",
              kind: "summary",
              responseType: "none",
              teacherPrompt:
                "Good analysts ask clear questions, inspect data quality, look for patterns and communicate only what the evidence supports. The goal is not to make numbers look impressive. The goal is to help people understand reality more accurately.",
              visual: {
                type: "process",
                emoji: "✅",
                title: "A reliable analysis process",
                items: [
                  "Question",
                  "Check",
                  "Analyse",
                  "Interpret",
                  "Communicate",
                ],
              },
              ayoPose: "celebrate",
              isCheckpoint: true,
              points: 4,
            },
          ],
          assessment: {
            id: "data-analysis-foundation-lesson-assessment",
            title: "Data analysis foundations check",
            description:
              "Check your understanding of analysis questions, evidence and data quality.",
            type: "quiz",
            passingScore: 70,
            completionPoints: 20,
            lessonIds: [
              "data-analysis-foundation-first-lesson",
            ],
          },
        },
      ],
    },
  ],
};