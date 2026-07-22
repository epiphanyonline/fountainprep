import type {
  AcademyCourse,
} from "../../../types/academy";

export const codingFoundationCourse: AcademyCourse = {
    id: "coding-foundation",
    academyId: "coding",
    title: "Think Like a Coder",
    subtitle: "Turn ideas into clear instructions and simple programs.",
    level: "foundation",
    ageGroups: ["6-9", "10-13", "14-17"],
    units: [
      {
        id: "coding-unit-1",
        unitNumber: 1,
        title: "Instructions and programs",
        description: "Algorithms, sequence, debugging and creative problem-solving.",
        lessons: [
          {
            id: "coding-algorithms",
            title: "Algorithms are everywhere",
            objective: "Recognise and create an ordered set of instructions.",
            completionPoints: 20,
            estimatedMinutes: 8,
            steps: [
              {
                id: "code-algo-welcome",
                title: "Give clear instructions",
                kind: "welcome",
                responseType: "none",
                teacherPrompt:
                  "Welcome, {learnerName}! A computer follows instructions exactly. A clear, ordered list of instructions is called an algorithm.",
                visual: { emoji: "🤖", title: "A computer needs", items: ["Clear steps", "Correct order", "No guessing"] },
              },
              {
                id: "code-algo-teach",
                title: "What is an algorithm?",
                kind: "teach",
                responseType: "none",
                teacherPrompt:
                  "A recipe is an algorithm. It tells you what to do first, next and last. Programs are algorithms written in a language a computer understands.",
                visual: { emoji: "📝", title: "Algorithm", items: ["Start", "Ordered steps", "Finish"] },
              },
              {
                id: "code-algo-example",
                title: "Morning algorithm",
                kind: "example",
                responseType: "none",
                teacherPrompt:
                  "A simple morning algorithm could be: wake up, brush your teeth, get dressed, then eat breakfast. Changing the order may create a funny result.",
                code: "START\n  wake_up()\n  brush_teeth()\n  get_dressed()\n  eat_breakfast()\nEND",
              },
              {
                id: "code-algo-question",
                title: "Choose the algorithm",
                kind: "question",
                responseType: "choice",
                teacherPrompt: "Which option is the clearest algorithm for making toast?",
                question: "Which is the best ordered algorithm?",
                choices: [
                  { id: "a", label: "Eat toast → put bread in toaster → switch it on" },
                  { id: "b", label: "Put bread in toaster → switch it on → wait → remove toast" },
                  { id: "c", label: "Toast is tasty" },
                ],
                acceptedAnswers: ["Put bread in toaster → switch it on → wait → remove toast"],
                hint: "The bread must go into the toaster before it can toast.",
                explanation: "Option B is clear, complete and in a sensible order.",
              },
              {
                id: "code-algo-challenge",
                title: "Write your own",
                kind: "challenge",
                responseType: "text",
                teacherPrompt:
                  "Write a three-step algorithm for washing your hands. Use words such as first, next and finally.",
                question: "Write three ordered steps for washing your hands.",
                acceptedAnswers: ["water", "soap", "rinse", "dry", "first", "next", "finally"],
                hint: "Think about water, soap, rinsing and drying.",
                explanation: "A strong answer gives clear actions in an order another person can follow.",
              },
            ],
          },
          {
            id: "coding-debugging",
            title: "Find and fix the bug",
            objective: "Identify an error in a sequence and improve it.",
            completionPoints: 25,
            estimatedMinutes: 9,
            steps: [
              {
                id: "code-debug-welcome",
                title: "Bugs are clues",
                kind: "welcome",
                responseType: "none",
                teacherPrompt:
                  "Coders do not fear mistakes. We inspect them. An error in a program is called a bug, and finding and fixing it is called debugging.",
                visual: { emoji: "🐞", title: "Debugging", items: ["Notice", "Investigate", "Fix", "Test again"] },
              },
              {
                id: "code-debug-teach",
                title: "Read one line at a time",
                kind: "teach",
                responseType: "none",
                teacherPrompt:
                  "To debug, predict what each instruction should do, run the sequence mentally, and compare the result with what you wanted.",
              },
              {
                id: "code-debug-example",
                title: "A movement bug",
                kind: "example",
                responseType: "none",
                teacherPrompt:
                  "This program should move a character forward twice, but the second line moves backward. That line is our bug.",
                code: "move_forward()\nmove_backward()  // bug\nsay(\"I arrived!\")",
              },
              {
                id: "code-debug-question",
                title: "Spot the bug",
                kind: "question",
                responseType: "choice",
                teacherPrompt: "Which line should change so the character moves forward twice?",
                question: "Which instruction is the bug?",
                choices: [
                  { id: "a", label: "move_forward()" },
                  { id: "b", label: "move_backward()" },
                  { id: "c", label: "say(\"I arrived!\")" },
                ],
                acceptedAnswers: ["move_backward()", "move backward"],
                hint: "Compare each movement with the goal: forward twice.",
                explanation: "The backward movement conflicts with the goal, so it must change to move_forward().",
              },
              {
                id: "code-debug-challenge",
                title: "Describe the fix",
                kind: "challenge",
                responseType: "text",
                teacherPrompt: "Tell Ayo exactly how you would fix the buggy program.",
                question: "What change would you make?",
                acceptedAnswers: ["change", "backward", "forward", "move_forward"],
                hint: "Replace one movement instruction.",
                explanation: "Replace move_backward() with move_forward(), then test the program again.",
              },
            ],
          },
        ],
      },
    ],
  };
