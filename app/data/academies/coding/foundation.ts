import {
  createActivity,
  createCourse,
  createLesson,
  createUnit,
} from "@/features/academy-content";

const deliveryModes = [
  "ai-classroom",
  "live-tutor",
  "self-study",
  "revision",
  "assessment",
] as const;

const lesson1 = createLesson({
  id: "coding-explorer-foundation-unit-1-lesson-1",
  academy: "coding",
  programmeId: "coding-explorer",
  courseId: "coding-explorer-foundation",
  unitId: "coding-explorer-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 1,
  title: "What Is Coding?",
  description:
    "Understand coding as giving clear instructions to a computer.",
  objective:
    "The learner will explain coding in simple language and identify examples of instructions.",
  learningOutcomes: [
    "Describe code as a set of instructions.",
    "Recognise that computers follow instructions in order.",
    "Identify clear and unclear instructions.",
  ],
  estimatedMinutes: 12,
  completionPoints: 25,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["6-9", "10-13", "14-17", "adult"],
  activities: [
    createActivity({
      id: "coding-l1-a1",
      type: "introduction",
      title: "Meet Coding",
      teacherPrompt:
        "Coding is the process of giving instructions to a computer so it can perform a task.",
    }),
    createActivity({
      id: "coding-l1-a2",
      type: "teach",
      title: "Computers Need Clear Instructions",
      teacherPrompt:
        "A computer does not guess what we mean. It follows the instructions we give it.",
      explanation:
        "Good instructions are clear, specific and arranged in the correct order.",
    }),
    createActivity({
      id: "coding-l1-a3",
      type: "multiple-choice",
      title: "Which Is Clearer?",
      teacherPrompt:
        "Which instruction would be easiest for a computer to follow?",
      options: [
        {
          id: "a",
          label: "Do something useful.",
          value: "unclear",
        },
        {
          id: "b",
          label: "Move forward three steps, then turn right.",
          value: "clear",
        },
      ],
      correctOptionId: "b",
      successReply:
        "Correct. It tells the computer exactly what to do and in what order.",
      retryReply:
        "Choose the instruction with specific actions and a clear sequence.",
      points: 5,
    }),
    createActivity({
      id: "coding-l1-a4",
      type: "guided-practice",
      title: "Give Ayo Instructions",
      teacherPrompt:
        "Give Ayo three clear instructions for walking from a chair to a door.",
      hints: [
        "Use actions such as stand, move, turn and stop.",
      ],
      points: 5,
    }),
    createActivity({
      id: "coding-l1-a5",
      type: "review",
      title: "Lesson Review",
      teacherPrompt:
        "Complete the sentence: Coding means giving a computer clear...",
      acceptedAnswers: ["instructions", "commands"],
      successReply:
        "Excellent. You understand the basic idea of coding.",
      points: 5,
    }),
  ],
});

const lesson2 = createLesson({
  id: "coding-explorer-foundation-unit-1-lesson-2",
  academy: "coding",
  programmeId: "coding-explorer",
  courseId: "coding-explorer-foundation",
  unitId: "coding-explorer-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 2,
  title: "Algorithms and Sequences",
  description:
    "Learn how a sequence of ordered steps can solve a problem.",
  objective:
    "The learner will create and correct a simple algorithm.",
  learningOutcomes: [
    "Define an algorithm as a sequence of steps.",
    "Arrange instructions in a logical order.",
    "Spot a missing or misplaced step.",
  ],
  estimatedMinutes: 15,
  completionPoints: 30,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["6-9", "10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson1.id],
  activities: [
    createActivity({
      id: "coding-l2-a1",
      type: "teach",
      title: "What Is an Algorithm?",
      teacherPrompt:
        "An algorithm is a step-by-step method for completing a task or solving a problem.",
    }),
    createActivity({
      id: "coding-l2-a2",
      type: "case-study",
      title: "Making a Sandwich",
      teacherPrompt:
        "A learner puts the filling on the table, closes the bread, and only then adds the filling. What is wrong?",
      acceptedAnswers: [
        "the steps are in the wrong order",
        "the filling should be added before closing",
      ],
      successReply:
        "Correct. The order of steps matters.",
      points: 5,
    }),
    createActivity({
      id: "coding-l2-a3",
      type: "multiple-choice",
      title: "Choose the Correct Sequence",
      teacherPrompt:
        "Which sequence correctly describes logging into an account?",
      options: [
        {
          id: "a",
          label:
            "Open the app, enter username, enter password, press sign in.",
          value: "correct-sequence",
        },
        {
          id: "b",
          label:
            "Press sign in, close the app, enter password, open the app.",
          value: "wrong-sequence",
        },
      ],
      correctOptionId: "a",
      successReply:
        "Correct. The actions are in a logical order.",
      retryReply:
        "Choose the sequence that begins by opening the app.",
      points: 5,
    }),
    createActivity({
      id: "coding-l2-a4",
      type: "project",
      title: "Create an Algorithm",
      teacherPrompt:
        "Write a five-step algorithm for brushing your teeth.",
      hints: [
        "Start by collecting what you need.",
        "Keep every step in the order it happens.",
      ],
      points: 10,
    }),
    createActivity({
      id: "coding-l2-a5",
      type: "review",
      title: "Review",
      teacherPrompt:
        "Why must the steps in an algorithm be arranged correctly?",
      acceptedAnswers: [
        "so the task works",
        "because order matters",
        "so the computer follows it correctly",
      ],
      successReply:
        "Well done. You can now build a simple algorithm.",
      points: 5,
    }),
  ],
});

const lesson3 = createLesson({
  id: "coding-explorer-foundation-unit-1-lesson-3",
  academy: "coding",
  programmeId: "coding-explorer",
  courseId: "coding-explorer-foundation",
  unitId: "coding-explorer-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 3,
  title: "Variables: Storing Information",
  description:
    "Understand variables as named containers that store information.",
  objective:
    "The learner will identify variables and choose suitable names for stored values.",
  learningOutcomes: [
    "Describe a variable as a named storage place.",
    "Match variable names to values.",
    "Use clear variable names.",
  ],
  estimatedMinutes: 15,
  completionPoints: 30,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["8-11", "10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson2.id],
  activities: [
    createActivity({
      id: "coding-l3-a1",
      type: "teach",
      title: "A Labelled Box",
      teacherPrompt:
        "A variable is like a labelled box. The label is the variable name, and the item inside is its value.",
    }),
    createActivity({
      id: "coding-l3-a2",
      type: "example",
      title: "Name and Score",
      teacherPrompt:
        "In the example playerName = 'Tobi', playerName is the variable and Tobi is the value.",
    }),
    createActivity({
      id: "coding-l3-a3",
      type: "multiple-choice",
      title: "Choose the Better Name",
      teacherPrompt:
        "Which variable name is clearer for storing a learner's age?",
      options: [
        {
          id: "a",
          label: "x",
          value: "x",
        },
        {
          id: "b",
          label: "learnerAge",
          value: "learner-age",
        },
      ],
      correctOptionId: "b",
      successReply:
        "Correct. learnerAge tells us exactly what the variable stores.",
      retryReply:
        "Choose the name that describes the value clearly.",
      points: 5,
    }),
    createActivity({
      id: "coding-l3-a4",
      type: "guided-practice",
      title: "Create Variables",
      teacherPrompt:
        "Create suitable variable names for a person's favourite colour, game score and first name.",
      hints: [
        "Use names such as favouriteColour, gameScore and firstName.",
      ],
      points: 10,
    }),
    createActivity({
      id: "coding-l3-a5",
      type: "review",
      title: "Review",
      teacherPrompt:
        "What is the difference between a variable name and its value?",
      acceptedAnswers: [
        "the name labels the storage and the value is what it contains",
        "the variable name identifies the data",
      ],
      successReply:
        "Excellent. You understand how variables store information.",
      points: 5,
    }),
  ],
});

const lesson4 = createLesson({
  id: "coding-explorer-foundation-unit-1-lesson-4",
  academy: "coding",
  programmeId: "coding-explorer",
  courseId: "coding-explorer-foundation",
  unitId: "coding-explorer-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 4,
  title: "Loops: Repeat Without Rewriting",
  description:
    "Learn how loops repeat instructions efficiently.",
  objective:
    "The learner will explain when a loop is useful and design a simple repeated action.",
  learningOutcomes: [
    "Describe a loop as repeated instructions.",
    "Recognise repeated patterns.",
    "Replace repeated commands with a loop.",
  ],
  estimatedMinutes: 15,
  completionPoints: 30,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["8-11", "10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson3.id],
  activities: [
    createActivity({
      id: "coding-l4-a1",
      type: "teach",
      title: "Why Loops Matter",
      teacherPrompt:
        "A loop repeats an instruction. Instead of writing 'jump' five times, we can say repeat jump five times.",
    }),
    createActivity({
      id: "coding-l4-a2",
      type: "multiple-choice",
      title: "Where Is a Loop Useful?",
      teacherPrompt:
        "Which task is best suited to a loop?",
      options: [
        {
          id: "a",
          label: "Display ten stars one after another",
          value: "repeat-stars",
        },
        {
          id: "b",
          label: "Choose a unique password once",
          value: "single-password",
        },
      ],
      correctOptionId: "a",
      successReply:
        "Correct. Displaying the same shape many times is a repeated task.",
      retryReply:
        "Choose the task that performs a similar action many times.",
      points: 5,
    }),
    createActivity({
      id: "coding-l4-a3",
      type: "case-study",
      title: "The Long Code",
      teacherPrompt:
        "A programme contains 'move forward' written twenty times. How could it be improved?",
      acceptedAnswers: [
        "use a loop",
        "repeat move forward twenty times",
      ],
      successReply:
        "Exactly. A loop makes the code shorter and easier to maintain.",
      points: 5,
    }),
    createActivity({
      id: "coding-l4-a4",
      type: "project",
      title: "Design a Dance Loop",
      teacherPrompt:
        "Create a three-move dance and state how many times the programme should repeat it.",
      hints: [
        "Example: clap, turn, jump; repeat four times.",
      ],
      points: 10,
    }),
    createActivity({
      id: "coding-l4-a5",
      type: "review",
      title: "Review",
      teacherPrompt:
        "What problem does a loop solve?",
      acceptedAnswers: [
        "it repeats code",
        "it avoids rewriting the same instruction",
        "it makes repeated tasks easier",
      ],
      successReply:
        "Well done. You can recognise and design simple loops.",
      points: 5,
    }),
  ],
});

const lesson5 = createLesson({
  id: "coding-explorer-foundation-unit-1-lesson-5",
  academy: "coding",
  programmeId: "coding-explorer",
  courseId: "coding-explorer-foundation",
  unitId: "coding-explorer-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 5,
  title: "Conditions: Making Decisions",
  description:
    "Understand how programmes make decisions using if and else.",
  objective:
    "The learner will construct a simple condition based on a true or false test.",
  learningOutcomes: [
    "Describe a condition as a decision rule.",
    "Use if and else in a simple example.",
    "Identify the result of a condition.",
  ],
  estimatedMinutes: 15,
  completionPoints: 35,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["8-11", "10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson4.id],
  activities: [
    createActivity({
      id: "coding-l5-a1",
      type: "teach",
      title: "If This, Then That",
      teacherPrompt:
        "A condition lets a programme choose an action. For example: if the score is 10, show 'You win'; else, keep playing.",
    }),
    createActivity({
      id: "coding-l5-a2",
      type: "multiple-choice",
      title: "Predict the Result",
      teacherPrompt:
        "If age is 12 and the rule says 'if age is at least 10, show the advanced level', what happens?",
      options: [
        {
          id: "a",
          label: "The advanced level is shown",
          value: "advanced",
        },
        {
          id: "b",
          label: "The programme closes",
          value: "close",
        },
      ],
      correctOptionId: "a",
      successReply:
        "Correct. Twelve satisfies the condition of being at least ten.",
      retryReply:
        "Compare the learner's age with the rule.",
      points: 5,
    }),
    createActivity({
      id: "coding-l5-a3",
      type: "guided-practice",
      title: "Build a Weather Rule",
      teacherPrompt:
        "Complete the rule: If it is raining, then..., else...",
      hints: [
        "Example: take an umbrella; else, leave without one.",
      ],
      points: 5,
    }),
    createActivity({
      id: "coding-l5-a4",
      type: "project",
      title: "Mini Game Logic",
      teacherPrompt:
        "Design a rule for a game that gives a reward when the player collects five stars.",
      hints: [
        "Begin with: If stars are at least five...",
      ],
      points: 10,
    }),
    createActivity({
      id: "coding-l5-a5",
      type: "assessment",
      title: "Foundation Assessment",
      teacherPrompt:
        "Explain coding, algorithm, variable, loop and condition using one sentence for each.",
      successReply:
        "Fantastic. You completed the Coding Explorer Foundation course.",
      points: 10,
    }),
  ],
});

export const codingExplorerFoundationCourse = createCourse({
  id: "coding-explorer-foundation",
  programmeId: "coding-explorer",
  stage: "foundation",
  title: "Coding Explorer Foundation",
  description:
    "Learn the core ideas behind programming before moving into Scratch, Python or web development.",
  learningOutcomes: [
    "Explain coding and algorithms.",
    "Use variables to represent information.",
    "Recognise and design loops.",
    "Build simple decision rules.",
    "Plan a small programme logically.",
  ],
  estimatedHours: 2,
  units: [
    createUnit({
      id: "coding-explorer-foundation-unit-1",
      courseId: "coding-explorer-foundation",
      unitNumber: 1,
      title: "How Programmes Think",
      description:
        "Learn instructions, algorithms, variables, loops and conditions.",
      learningOutcomes: [
        "Give precise instructions.",
        "Build ordered algorithms.",
        "Store values using variables.",
        "Use repetition and decisions.",
      ],
      lessons: [
        lesson1,
        lesson2,
        lesson3,
        lesson4,
        lesson5,
      ],
    }),
  ],
});
