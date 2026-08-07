import {
  createActivity,
  createCourse,
  createLesson,
  createUnit,
} from "@/features/academy-content";

const commonDeliveryModes = [
  "ai-classroom",
  "live-tutor",
  "self-study",
  "revision",
  "assessment",
] as const;

const lesson1 = createLesson({
  id: "ai-explorer-foundation-unit-1-lesson-1",
  academy: "ai",
  programmeId: "ai-explorer",
  courseId: "ai-explorer-foundation",
  unitId: "ai-explorer-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 1,
  title: "What Is Artificial Intelligence?",
  description:
    "A friendly introduction to AI and the types of tasks it can help people complete.",
  objective:
    "The learner will explain AI in simple language and identify examples of AI.",
  learningOutcomes: [
    "Describe AI as technology that can recognise patterns and produce useful responses.",
    "Identify familiar examples of AI.",
    "Distinguish AI from ordinary non-smart objects.",
  ],
  estimatedMinutes: 12,
  completionPoints: 25,
  deliveryModes: [...commonDeliveryModes],
  suitableAgeGroups: ["6-9", "10-13", "14-17", "adult"],
  activities: [
    createActivity({
      id: "ai-l1-a1",
      type: "introduction",
      title: "Meet AI",
      teacherPrompt:
        "Today we will discover what artificial intelligence means. AI is technology designed to perform tasks that usually need human thinking.",
      learnerInstruction:
        "Think of one device or app you have used that seems smart.",
    }),
    createActivity({
      id: "ai-l1-a2",
      type: "teach",
      title: "AI Looks for Patterns",
      teacherPrompt:
        "AI learns from examples and patterns. It can recognise speech, suggest videos, translate words and answer questions.",
      explanation:
        "AI does not think or feel exactly like a person. It uses data, instructions and patterns to create an output.",
    }),
    createActivity({
      id: "ai-l1-a3",
      type: "multiple-choice",
      title: "Spot the AI",
      teacherPrompt:
        "Which option is most likely using artificial intelligence?",
      options: [
        {
          id: "a",
          label: "A wooden ruler",
          value: "wooden-ruler",
        },
        {
          id: "b",
          label: "A voice assistant answering a question",
          value: "voice-assistant",
        },
        {
          id: "c",
          label: "A plain notebook",
          value: "notebook",
        },
      ],
      correctOptionId: "b",
      hints: [
        "Choose the example that recognises information and produces a response.",
      ],
      successReply:
        "Correct. A voice assistant uses AI to understand speech and respond.",
      retryReply:
        "Look for the option that listens, recognises patterns and gives an answer.",
      points: 5,
    }),
    createActivity({
      id: "ai-l1-a4",
      type: "reflection",
      title: "Explain It Simply",
      teacherPrompt:
        "Using your own words, what is artificial intelligence?",
      acceptedAnswers: [
        "technology that can learn patterns",
        "a computer that can do smart tasks",
        "technology that helps machines perform thinking tasks",
      ],
      hints: [
        "Begin with: AI is technology that...",
      ],
      points: 5,
    }),
    createActivity({
      id: "ai-l1-a5",
      type: "review",
      title: "Lesson Review",
      teacherPrompt:
        "Tell me one thing AI can do and one thing AI cannot do exactly like a human.",
      successReply:
        "Excellent. You now understand the basic idea behind AI.",
      points: 5,
    }),
  ],
});

const lesson2 = createLesson({
  id: "ai-explorer-foundation-unit-1-lesson-2",
  academy: "ai",
  programmeId: "ai-explorer",
  courseId: "ai-explorer-foundation",
  unitId: "ai-explorer-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 2,
  title: "Where Do We Find AI?",
  description:
    "Explore how AI appears in homes, schools, phones, transport and entertainment.",
  objective:
    "The learner will identify common uses of AI in everyday life.",
  learningOutcomes: [
    "Recognise everyday AI applications.",
    "Explain how an AI feature helps its user.",
    "Notice when an app is making a recommendation.",
  ],
  estimatedMinutes: 12,
  completionPoints: 25,
  deliveryModes: [...commonDeliveryModes],
  suitableAgeGroups: ["6-9", "10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson1.id],
  activities: [
    createActivity({
      id: "ai-l2-a1",
      type: "introduction",
      title: "AI Around Us",
      teacherPrompt:
        "AI can appear in phones, maps, streaming apps, cameras, games, online shops and learning tools.",
    }),
    createActivity({
      id: "ai-l2-a2",
      type: "case-study",
      title: "The Recommended Video",
      teacherPrompt:
        "A video app suggests a new video based on what Amara watched before. What is the AI doing?",
      acceptedAnswers: [
        "making a recommendation",
        "using previous viewing patterns",
        "suggesting content",
      ],
      hints: [
        "Think about how the app selected the next video.",
      ],
      successReply:
        "Exactly. The system uses past activity to recommend something new.",
      points: 5,
    }),
    createActivity({
      id: "ai-l2-a3",
      type: "multiple-choice",
      title: "AI in Transport",
      teacherPrompt:
        "Which feature most clearly uses AI?",
      options: [
        {
          id: "a",
          label: "A map predicting the fastest route",
          value: "route-prediction",
        },
        {
          id: "b",
          label: "A painted road sign",
          value: "road-sign",
        },
        {
          id: "c",
          label: "A paper ticket",
          value: "paper-ticket",
        },
      ],
      correctOptionId: "a",
      successReply:
        "Correct. Route prediction uses data and patterns to estimate travel time.",
      retryReply:
        "Choose the option that analyses information and makes a prediction.",
      points: 5,
    }),
    createActivity({
      id: "ai-l2-a4",
      type: "guided-practice",
      title: "Your AI List",
      teacherPrompt:
        "Name three places or apps where you may have encountered AI.",
      hints: [
        "Think about phones, games, maps, cameras and video apps.",
      ],
      points: 5,
    }),
    createActivity({
      id: "ai-l2-a5",
      type: "review",
      title: "Review",
      teacherPrompt:
        "Why is it useful to recognise when AI is being used?",
      acceptedAnswers: [
        "so we can use it responsibly",
        "so we understand recommendations",
        "so we can check its answers",
      ],
      successReply:
        "Well done. Recognising AI helps us use it carefully and confidently.",
      points: 5,
    }),
  ],
});

const lesson3 = createLesson({
  id: "ai-explorer-foundation-unit-1-lesson-3",
  academy: "ai",
  programmeId: "ai-explorer",
  courseId: "ai-explorer-foundation",
  unitId: "ai-explorer-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 3,
  title: "How to Ask AI a Good Question",
  description:
    "Learn how clear instructions improve the quality of an AI response.",
  objective:
    "The learner will create a clear prompt containing a task, context and desired format.",
  learningOutcomes: [
    "Explain what an AI prompt is.",
    "Improve a vague prompt.",
    "Write a simple structured prompt.",
  ],
  estimatedMinutes: 15,
  completionPoints: 30,
  deliveryModes: [...commonDeliveryModes],
  suitableAgeGroups: ["6-9", "10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson2.id],
  activities: [
    createActivity({
      id: "ai-l3-a1",
      type: "teach",
      title: "What Is a Prompt?",
      teacherPrompt:
        "A prompt is the instruction or question you give an AI. Clear prompts usually produce more useful answers.",
    }),
    createActivity({
      id: "ai-l3-a2",
      type: "example",
      title: "Vague Versus Clear",
      teacherPrompt:
        "Compare these prompts: 'Tell me about space' and 'Explain why the Moon changes shape, using five simple sentences for an eight-year-old.'",
      explanation:
        "The second prompt gives a topic, task, audience and format.",
    }),
    createActivity({
      id: "ai-l3-a3",
      type: "multiple-choice",
      title: "Choose the Better Prompt",
      teacherPrompt:
        "Which prompt is more likely to produce a useful study plan?",
      options: [
        {
          id: "a",
          label: "Help me study.",
          value: "vague",
        },
        {
          id: "b",
          label:
            "Create a seven-day revision plan for my Year 6 maths test, with 30 minutes of study each day.",
          value: "clear",
        },
      ],
      correctOptionId: "b",
      successReply:
        "Correct. It clearly states the goal, subject, duration and format.",
      retryReply:
        "Choose the prompt that gives the AI more useful detail.",
      points: 5,
    }),
    createActivity({
      id: "ai-l3-a4",
      type: "project",
      title: "Build Your Prompt",
      teacherPrompt:
        "Write a prompt asking AI to create a short story. Include the main character, setting, length and reading age.",
      hints: [
        "Use: Create a... about... set in... written for...",
      ],
      points: 10,
    }),
    createActivity({
      id: "ai-l3-a5",
      type: "review",
      title: "Prompt Formula",
      teacherPrompt:
        "Complete this sentence: A useful prompt should clearly explain the task, the context and the...",
      acceptedAnswers: [
        "format",
        "desired format",
        "type of answer",
      ],
      successReply:
        "Excellent. You can now give AI clearer instructions.",
      points: 5,
    }),
  ],
});

const lesson4 = createLesson({
  id: "ai-explorer-foundation-unit-1-lesson-4",
  academy: "ai",
  programmeId: "ai-explorer",
  courseId: "ai-explorer-foundation",
  unitId: "ai-explorer-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 4,
  title: "Can AI Make Mistakes?",
  description:
    "Understand that AI can produce inaccurate, incomplete or invented information.",
  objective:
    "The learner will explain why important AI answers should be checked.",
  learningOutcomes: [
    "Recognise that an AI answer may be wrong.",
    "Identify simple ways to verify information.",
    "Avoid treating confident language as proof.",
  ],
  estimatedMinutes: 12,
  completionPoints: 30,
  deliveryModes: [...commonDeliveryModes],
  suitableAgeGroups: ["6-9", "10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson3.id],
  activities: [
    createActivity({
      id: "ai-l4-a1",
      type: "teach",
      title: "AI Can Sound Confident and Still Be Wrong",
      teacherPrompt:
        "AI creates answers from patterns. Sometimes it misunderstands a question or invents a detail. Important information must be checked.",
    }),
    createActivity({
      id: "ai-l4-a2",
      type: "case-study",
      title: "The Wrong Birthday",
      teacherPrompt:
        "An AI gives two different birth dates for the same historical person. What should the learner do?",
      acceptedAnswers: [
        "check a reliable source",
        "ask a teacher",
        "verify the information",
      ],
      hints: [
        "Do not choose one answer only because it sounds confident.",
      ],
      successReply:
        "Correct. Conflicting information should be verified using a trusted source.",
      points: 5,
    }),
    createActivity({
      id: "ai-l4-a3",
      type: "multiple-choice",
      title: "When Should You Check?",
      teacherPrompt:
        "Which answer most needs verification?",
      options: [
        {
          id: "a",
          label: "A fictional story idea",
          value: "fiction",
        },
        {
          id: "b",
          label: "Medical advice about a serious symptom",
          value: "medical",
        },
        {
          id: "c",
          label: "A made-up superhero name",
          value: "creative",
        },
      ],
      correctOptionId: "b",
      successReply:
        "Correct. Health, safety, legal and financial information require reliable professional sources.",
      retryReply:
        "Choose the answer where an error could cause real harm.",
      points: 5,
    }),
    createActivity({
      id: "ai-l4-a4",
      type: "guided-practice",
      title: "Three Ways to Verify",
      teacherPrompt:
        "Name three ways you could check whether an AI answer is accurate.",
      acceptedAnswers: [
        "trusted websites",
        "books",
        "teacher",
        "professional",
        "more than one source",
      ],
      points: 10,
    }),
    createActivity({
      id: "ai-l4-a5",
      type: "review",
      title: "The Verification Rule",
      teacherPrompt:
        "Finish the rule: AI can help me think, but important facts should be...",
      acceptedAnswers: ["checked", "verified"],
      successReply:
        "Exactly. AI is useful, but verification protects you from mistakes.",
      points: 5,
    }),
  ],
});

const lesson5 = createLesson({
  id: "ai-explorer-foundation-unit-1-lesson-5",
  academy: "ai",
  programmeId: "ai-explorer",
  courseId: "ai-explorer-foundation",
  unitId: "ai-explorer-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 5,
  title: "AI Safety and Privacy",
  description:
    "Learn what information should never be shared with an AI tool.",
  objective:
    "The learner will identify private information and use AI more safely.",
  learningOutcomes: [
    "Recognise sensitive personal information.",
    "Avoid sharing passwords and private identifiers.",
    "Know when to ask a trusted adult for help.",
  ],
  estimatedMinutes: 12,
  completionPoints: 30,
  deliveryModes: [...commonDeliveryModes],
  suitableAgeGroups: ["6-9", "10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson4.id],
  activities: [
    createActivity({
      id: "ai-l5-a1",
      type: "teach",
      title: "Keep Private Information Private",
      teacherPrompt:
        "Never give an AI your password, bank details, private address, identification numbers or another person's confidential information.",
    }),
    createActivity({
      id: "ai-l5-a2",
      type: "multiple-choice",
      title: "Safe to Share?",
      teacherPrompt:
        "Which item should never be entered into a public AI chat?",
      options: [
        {
          id: "a",
          label: "A fictional character's name",
          value: "fictional-name",
        },
        {
          id: "b",
          label: "Your account password",
          value: "password",
        },
        {
          id: "c",
          label: "A maths question",
          value: "maths-question",
        },
      ],
      correctOptionId: "b",
      successReply:
        "Correct. Passwords must always remain private.",
      retryReply:
        "Choose the information that could allow someone to access your account.",
      points: 5,
    }),
    createActivity({
      id: "ai-l5-a3",
      type: "case-study",
      title: "A Friend's Secret",
      teacherPrompt:
        "A friend tells you something private. Should you paste it into an AI tool to ask for advice?",
      acceptedAnswers: [
        "no",
        "not without permission",
        "ask a trusted adult instead",
      ],
      hints: [
        "The information belongs to your friend.",
      ],
      successReply:
        "Correct. Respect other people's privacy and ask a trusted adult where appropriate.",
      points: 5,
    }),
    createActivity({
      id: "ai-l5-a4",
      type: "project",
      title: "Create an AI Safety Poster",
      teacherPrompt:
        "Create five short rules for using AI safely and responsibly.",
      hints: [
        "Include privacy, verification, kindness, adult support and balanced use.",
      ],
      points: 10,
    }),
    createActivity({
      id: "ai-l5-a5",
      type: "assessment",
      title: "Foundation Check",
      teacherPrompt:
        "Explain what AI is, how to write a clear prompt, why answers should be checked and one privacy rule.",
      successReply:
        "Fantastic work. You have completed the AI Explorer Foundation course.",
      points: 10,
    }),
  ],
});

export const aiExplorerFoundationCourse = createCourse({
  id: "ai-explorer-foundation",
  programmeId: "ai-explorer",
  stage: "foundation",
  title: "AI Explorer Foundation",
  description:
    "A practical introduction to AI, prompting, verification, safety and responsible use.",
  learningOutcomes: [
    "Explain AI in age-appropriate language.",
    "Recognise common AI applications.",
    "Write a clear basic prompt.",
    "Check important AI answers.",
    "Use AI safely and responsibly.",
  ],
  estimatedHours: 2,
  units: [
    createUnit({
      id: "ai-explorer-foundation-unit-1",
      courseId: "ai-explorer-foundation",
      unitNumber: 1,
      title: "Meet Artificial Intelligence",
      description:
        "Understand what AI is, where it appears and how to use it well.",
      learningOutcomes: [
        "Recognise AI.",
        "Ask useful questions.",
        "Verify information.",
        "Protect personal information.",
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
