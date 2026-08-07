import {
  createActivity,
  createLesson,
} from "@/features/academy-content";

const deliveryModes = [
  "ai-classroom",
  "live-tutor",
  "self-study",
  "revision",
  "assessment",
] as const;

export function createIeltsReadinessLessons(
  programmeId: "ielts-academic" | "ielts-general",
  courseId: string,
  unitId: string,
) {
  const academy = "ielts" as const;

  const lesson1 = createLesson({
    id: `${programmeId}-foundation-unit-1-lesson-1`,
    academy,
    programmeId,
    courseId,
    unitId,
    stage: "foundation",
    lessonNumber: 1,
    title: "Understanding the IELTS Test",
    description:
      "Learn the structure of IELTS and what each section measures.",
    objective:
      "The learner will describe the four IELTS sections and explain how the test is scored.",
    learningOutcomes: [
      "Name the four IELTS sections.",
      "Explain the difference between band scores and raw scores.",
      "Recognise the purpose of Academic and General Training IELTS.",
    ],
    estimatedMinutes: 18,
    completionPoints: 30,
    deliveryModes: [...deliveryModes],
    suitableAgeGroups: ["14-17", "adult"],
    activities: [
      createActivity({
        id: `${programmeId}-l1-a1`,
        type: "introduction",
        title: "Meet IELTS",
        teacherPrompt:
          "IELTS assesses Listening, Reading, Writing and Speaking. Each section contributes to the final band score.",
      }),
      createActivity({
        id: `${programmeId}-l1-a2`,
        type: "teach",
        title: "The Four Sections",
        teacherPrompt:
          "Listening checks your understanding of spoken English. Reading checks comprehension. Writing checks organisation and language control. Speaking checks spoken communication.",
      }),
      createActivity({
        id: `${programmeId}-l1-a3`,
        type: "multiple-choice",
        title: "Know the Test",
        teacherPrompt:
          "Which IELTS section is completed face-to-face with an examiner?",
        options: [
          {
            id: "a",
            label: "Reading",
            value: "reading",
          },
          {
            id: "b",
            label: "Speaking",
            value: "speaking",
          },
          {
            id: "c",
            label: "Listening",
            value: "listening",
          },
        ],
        correctOptionId: "b",
        successReply:
          "Correct. The Speaking test is an interview with an examiner.",
        retryReply:
          "Choose the section where the candidate answers questions aloud.",
        points: 5,
      }),
      createActivity({
        id: `${programmeId}-l1-a4`,
        type: "guided-practice",
        title: "Your IELTS Goal",
        teacherPrompt:
          "State the band score you are aiming for and explain why you need IELTS.",
        hints: [
          "Your reason may be university, employment, migration or professional registration.",
        ],
        points: 5,
      }),
      createActivity({
        id: `${programmeId}-l1-a5`,
        type: "review",
        title: "Lesson Review",
        teacherPrompt:
          "Name the four sections of IELTS in the correct order.",
        acceptedAnswers: [
          "Listening Reading Writing Speaking",
          "Listening, Reading, Writing and Speaking",
        ],
        successReply:
          "Excellent. You now understand the structure of IELTS.",
        points: 5,
      }),
    ],
  });

  const lesson2 = createLesson({
    id: `${programmeId}-foundation-unit-1-lesson-2`,
    academy,
    programmeId,
    courseId,
    unitId,
    stage: "foundation",
    lessonNumber: 2,
    title: "Listening for Answers",
    description:
      "Practise predicting answers, following instructions and listening for detail.",
    objective:
      "The learner will apply basic IELTS listening strategies.",
    learningOutcomes: [
      "Read questions before listening.",
      "Predict the type of answer required.",
      "Recognise distractors and corrections.",
    ],
    estimatedMinutes: 20,
    completionPoints: 35,
    deliveryModes: [...deliveryModes],
    suitableAgeGroups: ["14-17", "adult"],
    prerequisiteLessonIds: [lesson1.id],
    activities: [
      createActivity({
        id: `${programmeId}-l2-a1`,
        type: "teach",
        title: "Predict Before You Listen",
        teacherPrompt:
          "Before the recording begins, read the question and predict whether the answer should be a name, number, place, date or other detail.",
      }),
      createActivity({
        id: `${programmeId}-l2-a2`,
        type: "example",
        title: "Listen for Corrections",
        teacherPrompt:
          "A speaker may say, 'The meeting is on Thursday—sorry, I mean Friday.' The correct answer is Friday.",
        explanation:
          "IELTS recordings often contain distractors followed by the final correct information.",
      }),
      createActivity({
        id: `${programmeId}-l2-a3`,
        type: "multiple-choice",
        title: "Choose the Final Answer",
        teacherPrompt:
          "The speaker says: 'My number was 8142, but I recently changed it to 8412.' Which number should you write?",
        options: [
          {
            id: "a",
            label: "8142",
            value: "8142",
          },
          {
            id: "b",
            label: "8412",
            value: "8412",
          },
        ],
        correctOptionId: "b",
        successReply:
          "Correct. The speaker's current number is the final answer.",
        retryReply:
          "Listen for the correction introduced by 'changed it to'.",
        points: 5,
      }),
      createActivity({
        id: `${programmeId}-l2-a4`,
        type: "guided-practice",
        title: "Predict the Answer Type",
        teacherPrompt:
          "For the sentence 'The course begins on ____', what type of answer is most likely required?",
        acceptedAnswers: [
          "a date",
          "date",
          "day",
          "a day or date",
        ],
        successReply:
          "Correct. The grammar and context suggest a day or date.",
        points: 5,
      }),
      createActivity({
        id: `${programmeId}-l2-a5`,
        type: "review",
        title: "Listening Strategy",
        teacherPrompt:
          "State three things you should do before and during an IELTS listening recording.",
        hints: [
          "Think about reading ahead, predicting and checking corrections.",
        ],
        points: 10,
      }),
    ],
  });

  const lesson3 = createLesson({
    id: `${programmeId}-foundation-unit-1-lesson-3`,
    academy,
    programmeId,
    courseId,
    unitId,
    stage: "foundation",
    lessonNumber: 3,
    title: "Reading for Meaning",
    description:
      "Use skimming, scanning and keyword matching to find answers efficiently.",
    objective:
      "The learner will apply basic IELTS reading strategies.",
    learningOutcomes: [
      "Distinguish skimming from scanning.",
      "Locate keywords and synonyms.",
      "Avoid copying an answer that does not fit grammatically.",
    ],
    estimatedMinutes: 20,
    completionPoints: 35,
    deliveryModes: [...deliveryModes],
    suitableAgeGroups: ["14-17", "adult"],
    prerequisiteLessonIds: [lesson2.id],
    activities: [
      createActivity({
        id: `${programmeId}-l3-a1`,
        type: "teach",
        title: "Skim and Scan",
        teacherPrompt:
          "Skimming gives you the main idea. Scanning helps you locate a specific name, date, number or keyword.",
      }),
      createActivity({
        id: `${programmeId}-l3-a2`,
        type: "example",
        title: "Look for Synonyms",
        teacherPrompt:
          "A question may use 'purchase' while the passage uses 'buy'. IELTS often tests whether you recognise words with similar meanings.",
      }),
      createActivity({
        id: `${programmeId}-l3-a3`,
        type: "multiple-choice",
        title: "Choose the Strategy",
        teacherPrompt:
          "You need to find the year a museum opened. Which strategy is most useful?",
        options: [
          {
            id: "a",
            label: "Scan for a four-digit number",
            value: "scan",
          },
          {
            id: "b",
            label: "Read every sentence slowly from the beginning",
            value: "full-read",
          },
        ],
        correctOptionId: "a",
        successReply:
          "Correct. Scanning quickly locates a specific factual detail.",
        retryReply:
          "Choose the fastest way to locate a year.",
        points: 5,
      }),
      createActivity({
        id: `${programmeId}-l3-a4`,
        type: "case-study",
        title: "Does the Answer Fit?",
        teacherPrompt:
          "The sentence says 'The programme lasts for ____ weeks.' The passage says 'a six-week programme'. What should you write?",
        acceptedAnswers: ["six", "6"],
        successReply:
          "Correct. The answer must fit the sentence grammatically.",
        points: 5,
      }),
      createActivity({
        id: `${programmeId}-l3-a5`,
        type: "review",
        title: "Reading Strategy Review",
        teacherPrompt:
          "Explain the difference between skimming, scanning and close reading.",
        points: 10,
      }),
    ],
  });

  const lesson4 = createLesson({
    id: `${programmeId}-foundation-unit-1-lesson-4`,
    academy,
    programmeId,
    courseId,
    unitId,
    stage: "foundation",
    lessonNumber: 4,
    title: "Writing a Clear Paragraph",
    description:
      "Build coherent paragraphs using a topic sentence, explanation and example.",
    objective:
      "The learner will produce a clear, logically organised paragraph.",
    learningOutcomes: [
      "Write a focused topic sentence.",
      "Develop an idea with explanation and evidence.",
      "Use linking words accurately.",
    ],
    estimatedMinutes: 25,
    completionPoints: 40,
    deliveryModes: [...deliveryModes],
    suitableAgeGroups: ["14-17", "adult"],
    prerequisiteLessonIds: [lesson3.id],
    activities: [
      createActivity({
        id: `${programmeId}-l4-a1`,
        type: "teach",
        title: "Paragraph Structure",
        teacherPrompt:
          "A strong paragraph usually contains one main idea, an explanation and a relevant example.",
      }),
      createActivity({
        id: `${programmeId}-l4-a2`,
        type: "example",
        title: "Develop the Idea",
        teacherPrompt:
          "Topic sentence: Public transport can reduce city congestion. Explanation: It allows many people to travel in fewer vehicles. Example: A full bus can replace dozens of private cars.",
      }),
      createActivity({
        id: `${programmeId}-l4-a3`,
        type: "multiple-choice",
        title: "Choose the Better Topic Sentence",
        teacherPrompt:
          "Which sentence gives a clear main idea?",
        options: [
          {
            id: "a",
            label: "There are many things to say about education.",
            value: "vague",
          },
          {
            id: "b",
            label:
              "Online learning gives working adults greater flexibility.",
            value: "focused",
          },
        ],
        correctOptionId: "b",
        successReply:
          "Correct. It presents one specific idea that can be developed.",
        retryReply:
          "Choose the sentence with one clear and specific claim.",
        points: 5,
      }),
      createActivity({
        id: `${programmeId}-l4-a4`,
        type: "typed-response",
        title: "Write a Paragraph",
        teacherPrompt:
          "Write one paragraph answering: Why is regular exercise beneficial?",
        learnerInstruction:
          "Include a topic sentence, explanation and example.",
        hints: [
          "Keep the paragraph focused on one main benefit.",
        ],
        points: 15,
      }),
      createActivity({
        id: `${programmeId}-l4-a5`,
        type: "review",
        title: "Self-Check",
        teacherPrompt:
          "Check your paragraph for one main idea, development, linking and grammar.",
        points: 5,
      }),
    ],
  });

  const lesson5 = createLesson({
    id: `${programmeId}-foundation-unit-1-lesson-5`,
    academy,
    programmeId,
    courseId,
    unitId,
    stage: "foundation",
    lessonNumber: 5,
    title: "Speaking with Confidence",
    description:
      "Answer IELTS speaking questions naturally, clearly and with sufficient detail.",
    objective:
      "The learner will give a developed spoken answer using reasons and examples.",
    learningOutcomes: [
      "Avoid one-word answers.",
      "Develop responses with reasons and examples.",
      "Use natural rather than memorised language.",
    ],
    estimatedMinutes: 20,
    completionPoints: 40,
    deliveryModes: [...deliveryModes],
    suitableAgeGroups: ["14-17", "adult"],
    prerequisiteLessonIds: [lesson4.id],
    activities: [
      createActivity({
        id: `${programmeId}-l5-a1`,
        type: "teach",
        title: "Answer, Reason, Example",
        teacherPrompt:
          "A useful speaking structure is: answer the question, give a reason and add an example.",
      }),
      createActivity({
        id: `${programmeId}-l5-a2`,
        type: "example",
        title: "Develop the Answer",
        teacherPrompt:
          "Question: Do you enjoy reading? Answer: Yes, especially non-fiction, because I enjoy learning practical ideas. For example, I recently read a book about personal finance.",
      }),
      createActivity({
        id: `${programmeId}-l5-a3`,
        type: "voice-response",
        title: "Part 1 Practice",
        teacherPrompt:
          "Do you prefer studying alone or with other people? Give a reason and an example.",
        hints: [
          "Speak naturally for about twenty to thirty seconds.",
        ],
        points: 10,
      }),
      createActivity({
        id: `${programmeId}-l5-a4`,
        type: "voice-response",
        title: "Longer Response",
        teacherPrompt:
          "Describe a skill you would like to learn. Say what it is, why you want to learn it and how it may help you.",
        hints: [
          "Organise your answer before speaking.",
          "Use linking phrases such as because, for example and in the future.",
        ],
        points: 10,
      }),
      createActivity({
        id: `${programmeId}-l5-a5`,
        type: "assessment",
        title: "Readiness Assessment",
        teacherPrompt:
          "Explain one useful strategy for each IELTS section: Listening, Reading, Writing and Speaking.",
        successReply:
          "Excellent. You have completed the IELTS Readiness Foundation course.",
        points: 10,
      }),
    ],
  });

  return [
    lesson1,
    lesson2,
    lesson3,
    lesson4,
    lesson5,
  ];
}
