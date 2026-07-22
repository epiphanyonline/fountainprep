import type {
  AcademyCourse,
} from "../../../types/academy";

import {
  whatMoneyReallyIsLesson,
} from "./whatMoneyReallyIs";

export const wealthFoundationCourse: AcademyCourse = {
  id: "wealth-foundation",
  academyId: "wealth",
  title: "Money Choices",
  subtitle:
    "Build wise habits with saving, spending and planning.",
  level: "foundation",
  ageGroups: ["6-9", "10-13", "14-17", "adult"],
  units: [
    {
      id: "wealth-unit-1",
      unitNumber: 1,
      title: "Money, value and choice",
      description:
        "Understand what money does, how choices create trade-offs and how to make deliberate financial decisions.",
      estimatedWeeks: 4,
      learningOutcomes: [
        "Explain the main jobs of money",
        "Separate money from broader wealth",
        "Recognise opportunity cost",
        "Use a decision framework before spending",
      ],
      lessons: [
        whatMoneyReallyIsLesson,
        {
          id: "wealth-needs-wants",
          title: "Needs and wants",
          objective:
            "Distinguish essential needs from optional wants.",
          completionPoints: 20,
          estimatedMinutes: 8,
          steps: [
            {
              id: "wealth-needs-welcome",
              title: "Every choice has a trade-off",
              kind: "welcome",
              responseType: "none",
              teacherPrompt:
                "Money is a tool. Because we cannot buy everything at once, wise money choices begin by separating needs from wants.",
              visual: {
                emoji: "🪙",
                title: "Wise choice",
                items: ["Pause", "Prioritise", "Choose"],
              },
            },
            {
              id: "wealth-needs-teach",
              title: "Know the difference",
              kind: "teach",
              responseType: "none",
              teacherPrompt:
                "A need is something essential for health, safety or daily life, such as basic food or shelter. A want can make life enjoyable, but we can live without it.",
              visual: {
                emoji: "🏠",
                title: "Need or want?",
                items: [
                  "Need: basic food",
                  "Need: safe home",
                  "Want: newest game",
                ],
              },
            },
            {
              id: "wealth-needs-example",
              title: "A real choice",
              kind: "example",
              responseType: "none",
              teacherPrompt:
                "If your school shoes no longer fit and you also want a new game, the shoes come first. The game can wait while you save for it.",
            },
            {
              id: "wealth-needs-question",
              title: "Choose the need",
              kind: "question",
              responseType: "choice",
              teacherPrompt:
                "Which item is most likely a need?",
              question: "Which is a need?",
              choices: [
                { id: "a", label: "Safe drinking water" },
                { id: "b", label: "A second games console" },
                {
                  id: "c",
                  label:
                    "Designer trainers when your current pair fits",
                },
              ],
              acceptedAnswers: [
                "Safe drinking water",
                "water",
              ],
              hint:
                "Which one protects health and daily life?",
              explanation:
                "Safe drinking water is essential for health, so it is a need.",
            },
            {
              id: "wealth-needs-reflect",
              title: "Make a wise choice",
              kind: "reflection",
              responseType: "text",
              teacherPrompt:
                "Think of one thing you want. What could you do instead of buying it immediately?",
              question:
                "Name one want and a wise next step.",
              acceptedAnswers: [
                "save",
                "wait",
                "compare",
                "budget",
                "plan",
              ],
              hint:
                "You could wait, compare prices or save towards it.",
              explanation:
                "Pausing and planning helps you decide whether the want is worth the money.",
            },
          ],
        },
        {
          id: "wealth-saving-goals",
          title: "Build a saving goal",
          objective:
            "Create a simple and measurable saving plan.",
          completionPoints: 25,
          estimatedMinutes: 9,
          steps: [
            {
              id: "wealth-save-welcome",
              title: "Turn a wish into a plan",
              kind: "welcome",
              responseType: "none",
              teacherPrompt:
                "Saving means keeping some money today for something important tomorrow. A clear goal tells us how much, why and by when.",
              visual: {
                emoji: "🎯",
                title: "A saving goal",
                items: ["What?", "How much?", "By when?"],
              },
            },
            {
              id: "wealth-save-teach",
              title: "Break it into steps",
              kind: "teach",
              responseType: "none",
              teacherPrompt:
                "If a book costs 20 pounds and you save 5 pounds each week, divide 20 by 5. You will reach the goal in four weeks.",
              visual: {
                emoji: "🐷",
                title: "£20 goal",
                items: [
                  "£5 each week",
                  "4 weeks",
                  "£20 reached",
                ],
              },
            },
            {
              id: "wealth-save-example",
              title: "Protect the saving",
              kind: "example",
              responseType: "none",
              teacherPrompt:
                "Move the saving amount first, before spending on wants. This is often called paying yourself first.",
            },
            {
              id: "wealth-save-question",
              title: "Calculate the plan",
              kind: "question",
              responseType: "choice",
              teacherPrompt:
                "A goal costs 24 pounds. You save 6 pounds each week. How many weeks will it take?",
              question: "£24 ÷ £6 per week = ?",
              choices: [
                { id: "a", label: "3 weeks" },
                { id: "b", label: "4 weeks" },
                { id: "c", label: "6 weeks" },
              ],
              acceptedAnswers: [
                "4 weeks",
                "4",
                "four weeks",
              ],
              hint:
                "Count how many groups of 6 make 24.",
              explanation:
                "Four groups of £6 make £24, so the goal takes four weeks.",
            },
            {
              id: "wealth-save-challenge",
              title: "Create your goal",
              kind: "challenge",
              responseType: "text",
              teacherPrompt:
                "Create a saving goal. Tell Ayo what you are saving for, the total amount and how much you will save regularly.",
              question:
                "What is your saving goal and plan?",
              acceptedAnswers: [
                "save",
                "week",
                "month",
                "£",
                "pound",
                "goal",
              ],
              hint:
                "Example: I will save £3 each week towards a £30 bicycle helmet.",
              explanation:
                "A useful goal includes the purpose, amount and regular saving action.",
            },
          ],
        },
      ],
    },
  ],
};
