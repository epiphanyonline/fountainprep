import type {
  AcademyCourse,
} from "../../../types/academy";

export const mathematicsFoundationCourse: AcademyCourse = {
    id: "mathematics-foundation",
    academyId: "mathematics",
    title: "Number Confidence",
    subtitle: "See how numbers work and use them to solve everyday problems.",
    level: "foundation",
    ageGroups: ["6-9", "10-13"],
    units: [
      {
        id: "mathematics-unit-1",
        unitNumber: 1,
        title: "Numbers all around us",
        description: "Place value, mental addition and clear mathematical thinking.",
        lessons: [
          {
            id: "mathematics-place-value",
            title: "Place value detectives",
            objective: "Understand how a digit's position changes its value.",
            completionPoints: 20,
            estimatedMinutes: 8,
            steps: [
              {
                id: "math-place-welcome",
                title: "Number detective mission",
                kind: "welcome",
                responseType: "none",
                teacherPrompt:
                  "Welcome, {learnerName}! Today we are number detectives. We will discover why the same digit can have a different value depending on where it stands.",
                visual: {
                  emoji: "🔎",
                  title: "Your mission",
                  items: ["Spot the digit", "Find its place", "Name its value"],
                },
              },
              {
                id: "math-place-teach",
                title: "Hundreds, tens and ones",
                kind: "teach",
                responseType: "none",
                teacherPrompt:
                  "In 372, the 3 means three hundreds, the 7 means seven tens, and the 2 means two ones. Position gives each digit its value.",
                visual: {
                  emoji: "🧮",
                  title: "372",
                  items: ["3 hundreds = 300", "7 tens = 70", "2 ones = 2"],
                },
              },
              {
                id: "math-place-example",
                title: "Build the number",
                kind: "example",
                responseType: "none",
                teacherPrompt:
                  "Let us build 548. Five hundreds make 500, four tens make 40, and eight ones make 8. Add them and we get 548.",
                visual: {
                  emoji: "🧱",
                  title: "500 + 40 + 8",
                  items: ["500", "+ 40", "+ 8", "= 548"],
                },
              },
              {
                id: "math-place-question",
                title: "Your turn",
                kind: "question",
                responseType: "choice",
                teacherPrompt:
                  "What is the value of the digit 7 in 372? Choose the best answer.",
                question: "What is the value of 7 in 372?",
                choices: [
                  { id: "a", label: "7" },
                  { id: "b", label: "70" },
                  { id: "c", label: "700" },
                ],
                acceptedAnswers: ["70", "seventy"],
                hint: "Look at the column where 7 is standing.",
                explanation: "The 7 is in the tens column, so its value is 70.",
              },
              {
                id: "math-place-challenge",
                title: "Explain your thinking",
                kind: "reflection",
                responseType: "text",
                teacherPrompt:
                  "Great detecting! In one short sentence, explain why the 4 in 846 is worth 40. Ayo will respond to your reasoning.",
                question: "Why is the 4 in 846 worth 40?",
                acceptedAnswers: ["tens", "ten", "tens column", "tens place"],
                hint: "Name the place where the 4 is standing.",
                explanation: "The 4 is in the tens place, which means four groups of ten.",
              },
            ],
          },
          {
            id: "mathematics-mental-addition",
            title: "Friendly-number addition",
            objective: "Use tens to solve addition problems mentally.",
            completionPoints: 25,
            estimatedMinutes: 9,
            steps: [
              {
                id: "math-add-welcome",
                title: "Make numbers friendly",
                kind: "welcome",
                responseType: "none",
                teacherPrompt:
                  "Now we will make addition easier by moving towards a friendly number such as 10, 20 or 50.",
                visual: { emoji: "🤝", title: "Friendly numbers", items: ["10", "20", "50", "100"] },
              },
              {
                id: "math-add-teach",
                title: "Bridge through ten",
                kind: "teach",
                responseType: "none",
                teacherPrompt:
                  "To solve 8 plus 5, split 5 into 2 and 3. Add 2 to 8 to make 10, then add the remaining 3. The answer is 13.",
                visual: { emoji: "🌉", title: "8 + 5", items: ["8 + 2 = 10", "10 + 3 = 13"] },
              },
              {
                id: "math-add-example",
                title: "Another bridge",
                kind: "example",
                responseType: "none",
                teacherPrompt:
                  "For 27 plus 6, use 3 of the 6 to reach 30. Three remain, so 30 plus 3 is 33.",
                visual: { emoji: "➡️", title: "27 + 6", items: ["27 + 3 = 30", "30 + 3 = 33"] },
              },
              {
                id: "math-add-question",
                title: "Solve it",
                kind: "question",
                responseType: "choice",
                teacherPrompt: "Use a friendly ten to solve 38 plus 5.",
                question: "38 + 5 = ?",
                choices: [
                  { id: "a", label: "42" },
                  { id: "b", label: "43" },
                  { id: "c", label: "45" },
                ],
                acceptedAnswers: ["43", "forty three", "forty-three"],
                hint: "First use 2 of the 5 to reach 40.",
                explanation: "38 + 2 = 40, and 3 remain. So 40 + 3 = 43.",
              },
              {
                id: "math-add-challenge",
                title: "Create a strategy",
                kind: "challenge",
                responseType: "text",
                teacherPrompt:
                  "Challenge time: explain how you would solve 48 plus 7 without counting one by one.",
                question: "How would you solve 48 + 7?",
                acceptedAnswers: ["55", "48 + 2", "50 + 5", "make 50"],
                hint: "Can you first turn 48 into 50?",
                explanation: "Use 2 of the 7 to make 50, then add the remaining 5 to get 55.",
              },
            ],
          },
        ],
      },
    ],
  };
