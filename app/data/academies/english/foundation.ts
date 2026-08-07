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
  id: "english-foundation-unit-1-lesson-1",
  academy: "english",
  programmeId: "english-foundation",
  courseId: "english-foundation-course",
  unitId: "english-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 1,
  title: "Understanding What You Read",
  description:
    "Learn how to identify the main idea, supporting details and meaning in a passage.",
  objective:
    "The learner will extract the main idea and key details from a short text.",
  learningOutcomes: [
    "Identify the main idea.",
    "Find supporting details.",
    "Make a simple inference from evidence.",
  ],
  estimatedMinutes: 20,
  completionPoints: 35,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["6-9", "10-13", "14-17", "adult"],
  activities: [
    createActivity({
      id: "english-l1-a1",
      type: "teach",
      title: "Main Idea and Details",
      teacherPrompt:
        "The main idea tells us what a text is mostly about. Supporting details explain or prove that main idea.",
    }),
    createActivity({
      id: "english-l1-a2",
      type: "example",
      title: "Read for Purpose",
      teacherPrompt:
        "If a passage explains how bees help flowers grow, the main idea is the importance of bees to plants.",
    }),
    createActivity({
      id: "english-l1-a3",
      type: "multiple-choice",
      title: "Find the Main Idea",
      teacherPrompt:
        "A passage says that regular reading improves vocabulary, concentration and imagination. What is the main idea?",
      options: [
        {
          id: "a",
          label: "Reading has several benefits",
          value: "benefits",
        },
        {
          id: "b",
          label: "Books are expensive",
          value: "books-expensive",
        },
      ],
      correctOptionId: "a",
      successReply:
        "Correct. The details all support the benefits of reading.",
      retryReply:
        "Choose the idea that connects all the details.",
      points: 5,
    }),
    createActivity({
      id: "english-l1-a4",
      type: "guided-practice",
      title: "Find Supporting Details",
      teacherPrompt:
        "Give two details that could support the idea that exercise improves health.",
      hints: [
        "Think about the heart, strength, mood or energy.",
      ],
      points: 10,
    }),
    createActivity({
      id: "english-l1-a5",
      type: "review",
      title: "Reading Review",
      teacherPrompt:
        "Explain the difference between the main idea and a supporting detail.",
      acceptedAnswers: [
        "the main idea is what the text is mostly about and details explain it",
      ],
      successReply:
        "Excellent. You can now read for meaning more confidently.",
      points: 5,
    }),
  ],
});

const lesson2 = createLesson({
  id: "english-foundation-unit-1-lesson-2",
  academy: "english",
  programmeId: "english-foundation",
  courseId: "english-foundation-course",
  unitId: "english-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 2,
  title: "Building Strong Vocabulary",
  description:
    "Use context, word parts and synonyms to understand unfamiliar words.",
  objective:
    "The learner will apply strategies for learning and using new vocabulary.",
  learningOutcomes: [
    "Use context clues.",
    "Recognise synonyms and antonyms.",
    "Use new words in meaningful sentences.",
  ],
  estimatedMinutes: 20,
  completionPoints: 35,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["6-9", "10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson1.id],
  activities: [
    createActivity({
      id: "english-l2-a1",
      type: "teach",
      title: "Use Context Clues",
      teacherPrompt:
        "Words around an unfamiliar word can help reveal its meaning.",
    }),
    createActivity({
      id: "english-l2-a2",
      type: "example",
      title: "Meaning from Context",
      teacherPrompt:
        "In the sentence 'The path was treacherous, with loose rocks and steep drops,' the details suggest treacherous means dangerous.",
    }),
    createActivity({
      id: "english-l2-a3",
      type: "multiple-choice",
      title: "Choose the Synonym",
      teacherPrompt:
        "Which word is closest in meaning to enormous?",
      options: [
        {
          id: "a",
          label: "Tiny",
          value: "tiny",
        },
        {
          id: "b",
          label: "Huge",
          value: "huge",
        },
      ],
      correctOptionId: "b",
      successReply:
        "Correct. Huge is a synonym for enormous.",
      retryReply:
        "Choose the word with a similar meaning.",
      points: 5,
    }),
    createActivity({
      id: "english-l2-a4",
      type: "guided-practice",
      title: "Use the New Word",
      teacherPrompt:
        "Write a sentence using the word cautious so its meaning is clear.",
      hints: [
        "Show someone acting carefully because of possible danger.",
      ],
      points: 10,
    }),
    createActivity({
      id: "english-l2-a5",
      type: "review",
      title: "Vocabulary Strategy",
      teacherPrompt:
        "Name three ways to work out the meaning of an unfamiliar word.",
      acceptedAnswers: [
        "context clues",
        "synonyms",
        "word parts",
        "dictionary",
        "antonyms",
      ],
      successReply:
        "Well done. You now have several strategies for learning vocabulary.",
      points: 5,
    }),
  ],
});

const lesson3 = createLesson({
  id: "english-foundation-unit-1-lesson-3",
  academy: "english",
  programmeId: "english-foundation",
  courseId: "english-foundation-course",
  unitId: "english-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 3,
  title: "Grammar: Building Correct Sentences",
  description:
    "Understand subjects, verbs, agreement and complete sentences.",
  objective:
    "The learner will identify and correct common sentence-level grammar errors.",
  learningOutcomes: [
    "Identify subjects and verbs.",
    "Use subject-verb agreement.",
    "Recognise complete sentences and fragments.",
  ],
  estimatedMinutes: 22,
  completionPoints: 40,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["8-11", "10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson2.id],
  activities: [
    createActivity({
      id: "english-l3-a1",
      type: "teach",
      title: "Subject and Verb",
      teacherPrompt:
        "A complete sentence usually needs a subject and a verb and must express a complete thought.",
    }),
    createActivity({
      id: "english-l3-a2",
      type: "multiple-choice",
      title: "Choose the Correct Sentence",
      teacherPrompt:
        "Which sentence has correct subject-verb agreement?",
      options: [
        {
          id: "a",
          label: "The students works quietly.",
          value: "incorrect",
        },
        {
          id: "b",
          label: "The students work quietly.",
          value: "correct",
        },
      ],
      correctOptionId: "b",
      successReply:
        "Correct. The plural subject students takes the plural verb work.",
      retryReply:
        "Match the verb to the plural subject.",
      points: 5,
    }),
    createActivity({
      id: "english-l3-a3",
      type: "case-study",
      title: "Sentence or Fragment?",
      teacherPrompt:
        "Is this a complete sentence: 'Because the rain was heavy.' Explain your answer.",
      acceptedAnswers: [
        "no",
        "it is a fragment",
        "it does not complete the thought",
      ],
      successReply:
        "Correct. It begins a reason but does not tell us what happened.",
      points: 10,
    }),
    createActivity({
      id: "english-l3-a4",
      type: "guided-practice",
      title: "Correct the Sentence",
      teacherPrompt:
        "Correct this sentence: 'She walk to school every day.'",
      acceptedAnswers: [
        "She walks to school every day.",
      ],
      successReply:
        "Correct. The singular subject she takes walks.",
      points: 10,
    }),
    createActivity({
      id: "english-l3-a5",
      type: "review",
      title: "Grammar Review",
      teacherPrompt:
        "What does every complete sentence need?",
      acceptedAnswers: [
        "a subject and a verb",
        "a complete thought",
      ],
      successReply:
        "Excellent. You can now recognise and correct basic sentence errors.",
      points: 5,
    }),
  ],
});

const lesson4 = createLesson({
  id: "english-foundation-unit-1-lesson-4",
  academy: "english",
  programmeId: "english-foundation",
  courseId: "english-foundation-course",
  unitId: "english-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 4,
  title: "Writing Clear Paragraphs",
  description:
    "Organise one main idea using a topic sentence, explanation and example.",
  objective:
    "The learner will plan and write a coherent paragraph.",
  learningOutcomes: [
    "Write a focused topic sentence.",
    "Develop ideas with supporting details.",
    "Use linking words appropriately.",
  ],
  estimatedMinutes: 25,
  completionPoints: 40,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["8-11", "10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson3.id],
  activities: [
    createActivity({
      id: "english-l4-a1",
      type: "teach",
      title: "One Paragraph, One Main Idea",
      teacherPrompt:
        "A strong paragraph usually begins with a topic sentence and develops that idea with explanation, evidence or examples.",
    }),
    createActivity({
      id: "english-l4-a2",
      type: "example",
      title: "Develop the Point",
      teacherPrompt:
        "Topic sentence: Learning a second language has many benefits. Supporting detail: It can improve communication with family and open new opportunities.",
    }),
    createActivity({
      id: "english-l4-a3",
      type: "multiple-choice",
      title: "Choose the Better Topic Sentence",
      teacherPrompt:
        "Which sentence gives a clear paragraph focus?",
      options: [
        {
          id: "a",
          label: "There are many things in the world.",
          value: "vague",
        },
        {
          id: "b",
          label: "Regular exercise improves both physical and mental health.",
          value: "focused",
        },
      ],
      correctOptionId: "b",
      successReply:
        "Correct. It presents one clear idea that can be developed.",
      retryReply:
        "Choose the sentence with a specific main point.",
      points: 5,
    }),
    createActivity({
      id: "english-l4-a4",
      type: "typed-response",
      title: "Write a Paragraph",
      teacherPrompt:
        "Write one paragraph explaining why learning digital skills is important.",
      learnerInstruction:
        "Include a topic sentence, explanation and example.",
      hints: [
        "Keep the paragraph focused on one main idea.",
      ],
      points: 15,
    }),
    createActivity({
      id: "english-l4-a5",
      type: "review",
      title: "Paragraph Check",
      teacherPrompt:
        "Name three parts of a strong paragraph.",
      acceptedAnswers: [
        "topic sentence",
        "supporting details",
        "example",
        "concluding sentence",
      ],
      successReply:
        "Well done. You can now organise a clear paragraph.",
      points: 5,
    }),
  ],
});

const lesson5 = createLesson({
  id: "english-foundation-unit-1-lesson-5",
  academy: "english",
  programmeId: "english-foundation",
  courseId: "english-foundation-course",
  unitId: "english-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 5,
  title: "Creative Writing: Showing, Not Telling",
  description:
    "Use sensory detail, precise verbs and description to make writing more vivid.",
  objective:
    "The learner will improve a simple description using vivid language.",
  learningOutcomes: [
    "Use sensory details.",
    "Choose precise verbs and adjectives.",
    "Create a clear image in the reader's mind.",
  ],
  estimatedMinutes: 25,
  completionPoints: 45,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["8-11", "10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson4.id],
  activities: [
    createActivity({
      id: "english-l5-a1",
      type: "teach",
      title: "Show the Reader",
      teacherPrompt:
        "Instead of writing 'The room was scary,' describe what the character saw, heard or felt.",
    }),
    createActivity({
      id: "english-l5-a2",
      type: "example",
      title: "Make It Vivid",
      teacherPrompt:
        "Telling: The dog ran quickly. Showing: The dog sprinted across the field, ears flying and paws thudding against the ground.",
    }),
    createActivity({
      id: "english-l5-a3",
      type: "multiple-choice",
      title: "Choose the Stronger Description",
      teacherPrompt:
        "Which sentence creates a clearer image?",
      options: [
        {
          id: "a",
          label: "The food was nice.",
          value: "plain",
        },
        {
          id: "b",
          label: "The warm bread cracked softly as steam rose from the centre.",
          value: "vivid",
        },
      ],
      correctOptionId: "b",
      successReply:
        "Correct. It uses sensory details and precise verbs.",
      retryReply:
        "Choose the sentence that helps you see, hear or feel the moment.",
      points: 5,
    }),
    createActivity({
      id: "english-l5-a4",
      type: "project",
      title: "Write a Vivid Scene",
      teacherPrompt:
        "Describe entering a busy market, using at least three senses.",
      hints: [
        "Include what you see, hear, smell, taste or feel.",
      ],
      points: 15,
    }),
    createActivity({
      id: "english-l5-a5",
      type: "review",
      title: "Creative Writing Review",
      teacherPrompt:
        "What does show, not tell mean?",
      acceptedAnswers: [
        "use details so the reader experiences it",
        "describe actions and senses instead of only stating feelings",
      ],
      successReply:
        "Excellent. You can now make descriptions more vivid.",
      points: 5,
    }),
  ],
});

const lesson6 = createLesson({
  id: "english-foundation-unit-1-lesson-6",
  academy: "english",
  programmeId: "english-foundation",
  courseId: "english-foundation-course",
  unitId: "english-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 6,
  title: "Speaking Clearly and Confidently",
  description:
    "Organise spoken answers and communicate ideas with clarity.",
  objective:
    "The learner will give a short, structured spoken response.",
  learningOutcomes: [
    "Speak in complete ideas.",
    "Use reasons and examples.",
    "Maintain a clear pace and volume.",
  ],
  estimatedMinutes: 20,
  completionPoints: 40,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["6-9", "10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson5.id],
  activities: [
    createActivity({
      id: "english-l6-a1",
      type: "teach",
      title: "Answer, Explain, Example",
      teacherPrompt:
        "A clear spoken answer often includes the answer, a reason and an example.",
    }),
    createActivity({
      id: "english-l6-a2",
      type: "example",
      title: "Develop the Answer",
      teacherPrompt:
        "Question: What is your favourite subject? Answer: My favourite subject is science because I enjoy discovering how things work. For example, I loved learning about the human body.",
    }),
    createActivity({
      id: "english-l6-a3",
      type: "voice-response",
      title: "Speak for Thirty Seconds",
      teacherPrompt:
        "Describe a skill you would like to learn and explain why.",
      hints: [
        "Use a clear beginning, reason and example.",
      ],
      points: 10,
    }),
    createActivity({
      id: "english-l6-a4",
      type: "voice-response",
      title: "Give an Opinion",
      teacherPrompt:
        "Do you think children should have daily homework? Give your opinion and support it.",
      points: 10,
    }),
    createActivity({
      id: "english-l6-a5",
      type: "review",
      title: "Speaking Review",
      teacherPrompt:
        "Name three things that make spoken communication clear.",
      acceptedAnswers: [
        "organisation",
        "pace",
        "volume",
        "reasons",
        "examples",
        "complete sentences",
      ],
      successReply:
        "Well done. You can now organise and deliver a clearer spoken response.",
      points: 5,
    }),
  ],
});

const lesson7 = createLesson({
  id: "english-foundation-unit-1-lesson-7",
  academy: "english",
  programmeId: "english-foundation",
  courseId: "english-foundation-course",
  unitId: "english-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 7,
  title: "Editing and Improving Your Work",
  description:
    "Review writing for meaning, organisation, grammar, punctuation and spelling.",
  objective:
    "The learner will apply a structured editing process.",
  learningOutcomes: [
    "Separate revising from proofreading.",
    "Identify common errors.",
    "Improve clarity and precision.",
  ],
  estimatedMinutes: 22,
  completionPoints: 45,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["8-11", "10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson6.id],
  activities: [
    createActivity({
      id: "english-l7-a1",
      type: "teach",
      title: "Revise, Then Proofread",
      teacherPrompt:
        "Revising improves ideas and organisation. Proofreading corrects grammar, punctuation and spelling.",
    }),
    createActivity({
      id: "english-l7-a2",
      type: "case-study",
      title: "Improve the Sentence",
      teacherPrompt:
        "Improve this sentence: 'The thing was very good and I liked it a lot.'",
      hints: [
        "Replace vague words with specific nouns, verbs and reasons.",
      ],
      points: 10,
    }),
    createActivity({
      id: "english-l7-a3",
      type: "multiple-choice",
      title: "Find the Correct Version",
      teacherPrompt:
        "Which sentence is punctuated correctly?",
      options: [
        {
          id: "a",
          label: "After lunch we went, to the library.",
          value: "incorrect",
        },
        {
          id: "b",
          label: "After lunch, we went to the library.",
          value: "correct",
        },
      ],
      correctOptionId: "b",
      successReply:
        "Correct. The introductory phrase is followed by a comma.",
      retryReply:
        "Choose the sentence with the comma in the correct place.",
      points: 5,
    }),
    createActivity({
      id: "english-l7-a4",
      type: "project",
      title: "Edit Your Paragraph",
      teacherPrompt:
        "Choose a paragraph you wrote earlier and improve its ideas, vocabulary, grammar and punctuation.",
      points: 15,
    }),
    createActivity({
      id: "english-l7-a5",
      type: "assessment",
      title: "Foundation Assessment",
      teacherPrompt:
        "Demonstrate reading comprehension, vocabulary, grammar, paragraph writing, creative description, speaking and editing.",
      successReply:
        "Fantastic. You have completed the English Foundation course.",
      points: 10,
    }),
  ],
});

export const englishFoundationCourse =
  createCourse({
    id: "english-foundation-course",
    programmeId: "english-foundation",
    stage: "foundation",
    title: "English Foundation",
    description:
      "Build confidence in reading, vocabulary, grammar, writing, speaking and editing.",
    learningOutcomes: [
      "Read for meaning.",
      "Use stronger vocabulary.",
      "Build accurate sentences.",
      "Write coherent paragraphs.",
      "Create vivid descriptions.",
      "Speak clearly and confidently.",
      "Edit work independently.",
    ],
    estimatedHours: 4,
    units: [
      createUnit({
        id: "english-foundation-unit-1",
        courseId: "english-foundation-course",
        unitNumber: 1,
        title: "Communicate with Confidence",
        description:
          "Develop the core reading, writing and speaking skills needed for school, work and everyday communication.",
        learningOutcomes: [
          "Understand texts.",
          "Express ideas clearly.",
          "Write accurately.",
          "Communicate with confidence.",
        ],
        lessons: [
          lesson1,
          lesson2,
          lesson3,
          lesson4,
          lesson5,
          lesson6,
          lesson7,
        ],
      }),
    ],
  });
