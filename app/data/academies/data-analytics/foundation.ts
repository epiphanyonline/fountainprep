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
  id: "data-foundation-unit-1-lesson-1",
  academy: "data-analytics",
  programmeId: "data-analytics-foundation",
  courseId: "data-analytics-foundation-course",
  unitId: "data-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 1,
  title: "Thinking with Data",
  description:
    "Understand how data helps people answer questions and make better decisions.",
  objective:
    "The learner will explain what data is and identify useful questions that data can answer.",
  learningOutcomes: [
    "Define data in simple terms.",
    "Distinguish data from opinion.",
    "Turn a business or everyday problem into a data question.",
  ],
  estimatedMinutes: 15,
  completionPoints: 30,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["14-17", "adult"],
  activities: [
    createActivity({
      id: "data-l1-a1",
      type: "introduction",
      title: "What Is Data?",
      teacherPrompt:
        "Data is recorded information. It can include numbers, words, dates, locations, ratings and observations.",
    }),
    createActivity({
      id: "data-l1-a2",
      type: "teach",
      title: "Data Answers Questions",
      teacherPrompt:
        "Good analysis begins with a clear question. For example: Which product sells most? When are customers busiest? Which learners need more support?",
    }),
    createActivity({
      id: "data-l1-a3",
      type: "multiple-choice",
      title: "Data or Opinion?",
      teacherPrompt:
        "Which statement is data rather than opinion?",
      options: [
        {
          id: "a",
          label: "Customers probably prefer blue.",
          value: "opinion",
        },
        {
          id: "b",
          label: "Blue products accounted for 42% of sales.",
          value: "data",
        },
      ],
      correctOptionId: "b",
      successReply:
        "Correct. It reports a measurable result.",
      retryReply:
        "Choose the statement supported by a recorded measurement.",
      points: 5,
    }),
    createActivity({
      id: "data-l1-a4",
      type: "case-study",
      title: "Turn a Problem into a Question",
      teacherPrompt:
        "A tutoring company says many learners stop attending after the first month. Write one useful data question.",
      acceptedAnswers: [
        "which learners stop attending",
        "when do learners stop",
        "why do learners stop",
        "which subjects have the highest dropout rate",
      ],
      hints: [
        "Begin with who, when, which or how many.",
      ],
      points: 10,
    }),
    createActivity({
      id: "data-l1-a5",
      type: "review",
      title: "Lesson Review",
      teacherPrompt:
        "Complete the sentence: Data analysis helps us move from guessing to...",
      acceptedAnswers: [
        "evidence",
        "evidence-based decisions",
        "informed decisions",
      ],
      successReply:
        "Exactly. Good analysis replaces assumptions with evidence.",
      points: 5,
    }),
  ],
});

const lesson2 = createLesson({
  id: "data-foundation-unit-1-lesson-2",
  academy: "data-analytics",
  programmeId: "data-analytics-foundation",
  courseId: "data-analytics-foundation-course",
  unitId: "data-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 2,
  title: "Rows, Columns and Tables",
  description:
    "Learn how structured data is organised in a table.",
  objective:
    "The learner will identify records, fields and values in a dataset.",
  learningOutcomes: [
    "Explain rows and columns.",
    "Recognise a record and a field.",
    "Choose suitable column headings.",
  ],
  estimatedMinutes: 18,
  completionPoints: 30,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["14-17", "adult"],
  prerequisiteLessonIds: [lesson1.id],
  activities: [
    createActivity({
      id: "data-l2-a1",
      type: "teach",
      title: "How Tables Work",
      teacherPrompt:
        "In a table, each row usually represents one record, while each column represents one field or characteristic.",
    }),
    createActivity({
      id: "data-l2-a2",
      type: "example",
      title: "A Student Table",
      teacherPrompt:
        "A learner table may contain Student ID, Name, Age, Subject and Attendance. Each learner appears on one row.",
    }),
    createActivity({
      id: "data-l2-a3",
      type: "multiple-choice",
      title: "Identify the Record",
      teacherPrompt:
        "In a sales table, what does one row usually represent?",
      options: [
        {
          id: "a",
          label: "One sale or transaction",
          value: "transaction",
        },
        {
          id: "b",
          label: "Every possible column name",
          value: "columns",
        },
      ],
      correctOptionId: "a",
      successReply:
        "Correct. One row usually represents one complete record.",
      retryReply:
        "Think about what a single line in the table describes.",
      points: 5,
    }),
    createActivity({
      id: "data-l2-a4",
      type: "guided-practice",
      title: "Design a Table",
      teacherPrompt:
        "Choose five useful column headings for a table that records lesson bookings.",
      acceptedAnswers: [
        "booking id",
        "student",
        "subject",
        "date",
        "time",
        "status",
        "tutor",
        "price",
      ],
      hints: [
        "Think about identity, who, what, when and status.",
      ],
      points: 10,
    }),
    createActivity({
      id: "data-l2-a5",
      type: "review",
      title: "Rows and Columns",
      teacherPrompt:
        "Explain the difference between a row and a column.",
      acceptedAnswers: [
        "a row is one record and a column is one field",
        "rows contain records and columns contain categories",
      ],
      successReply:
        "Excellent. You understand the structure of tabular data.",
      points: 5,
    }),
  ],
});

const lesson3 = createLesson({
  id: "data-foundation-unit-1-lesson-3",
  academy: "data-analytics",
  programmeId: "data-analytics-foundation",
  courseId: "data-analytics-foundation-course",
  unitId: "data-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 3,
  title: "Cleaning Messy Data",
  description:
    "Identify duplicates, missing values, inconsistent labels and incorrect formats.",
  objective:
    "The learner will recognise common data-quality problems and suggest appropriate fixes.",
  learningOutcomes: [
    "Identify duplicate and missing records.",
    "Standardise inconsistent categories.",
    "Explain why clean data matters.",
  ],
  estimatedMinutes: 20,
  completionPoints: 35,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["14-17", "adult"],
  prerequisiteLessonIds: [lesson2.id],
  activities: [
    createActivity({
      id: "data-l3-a1",
      type: "teach",
      title: "Why Data Becomes Messy",
      teacherPrompt:
        "Data may contain duplicate rows, blanks, spelling differences, impossible values and inconsistent date formats.",
    }),
    createActivity({
      id: "data-l3-a2",
      type: "case-study",
      title: "Three Names for One Category",
      teacherPrompt:
        "A country column contains UK, United Kingdom and U.K. What problem does this create?",
      acceptedAnswers: [
        "inconsistent categories",
        "the same country is counted separately",
        "it needs standardising",
      ],
      successReply:
        "Correct. The same category should use one consistent label.",
      points: 5,
    }),
    createActivity({
      id: "data-l3-a3",
      type: "multiple-choice",
      title: "Find the Invalid Value",
      teacherPrompt:
        "Which age value most likely requires investigation in a learner dataset?",
      options: [
        {
          id: "a",
          label: "12",
          value: "12",
        },
        {
          id: "b",
          label: "-4",
          value: "-4",
        },
        {
          id: "c",
          label: "18",
          value: "18",
        },
      ],
      correctOptionId: "b",
      successReply:
        "Correct. A negative age is not valid and should be investigated.",
      retryReply:
        "Choose the value that is impossible for a person's age.",
      points: 5,
    }),
    createActivity({
      id: "data-l3-a4",
      type: "project",
      title: "Create a Cleaning Checklist",
      teacherPrompt:
        "Write a five-point checklist for checking a new dataset before analysis.",
      hints: [
        "Include duplicates, blanks, formats, categories and unusual values.",
      ],
      points: 10,
    }),
    createActivity({
      id: "data-l3-a5",
      type: "review",
      title: "Why Clean First?",
      teacherPrompt:
        "Why should data be cleaned before creating charts or conclusions?",
      acceptedAnswers: [
        "dirty data gives wrong results",
        "to improve accuracy",
        "to avoid misleading conclusions",
      ],
      successReply:
        "Exactly. Reliable analysis begins with reliable data.",
      points: 5,
    }),
  ],
});

const lesson4 = createLesson({
  id: "data-foundation-unit-1-lesson-4",
  academy: "data-analytics",
  programmeId: "data-analytics-foundation",
  courseId: "data-analytics-foundation-course",
  unitId: "data-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 4,
  title: "Excel Formulas and Summaries",
  description:
    "Use simple spreadsheet formulas to calculate totals, averages and counts.",
  objective:
    "The learner will choose and explain basic formulas for summarising data.",
  learningOutcomes: [
    "Use SUM, AVERAGE and COUNT appropriately.",
    "Understand the role of cell ranges.",
    "Check whether a formula matches the business question.",
  ],
  estimatedMinutes: 22,
  completionPoints: 40,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["14-17", "adult"],
  prerequisiteLessonIds: [lesson3.id],
  activities: [
    createActivity({
      id: "data-l4-a1",
      type: "teach",
      title: "Common Summary Formulas",
      teacherPrompt:
        "SUM adds values, AVERAGE finds the mean, and COUNT tells us how many numeric entries are present.",
    }),
    createActivity({
      id: "data-l4-a2",
      type: "example",
      title: "Total Monthly Sales",
      teacherPrompt:
        "If sales values are in cells B2 to B13, the formula =SUM(B2:B13) returns the total.",
    }),
    createActivity({
      id: "data-l4-a3",
      type: "multiple-choice",
      title: "Choose the Formula",
      teacherPrompt:
        "Which formula should you use to find the average test score?",
      options: [
        {
          id: "a",
          label: "=SUM(C2:C31)",
          value: "sum",
        },
        {
          id: "b",
          label: "=AVERAGE(C2:C31)",
          value: "average",
        },
        {
          id: "c",
          label: "=COUNT(C2:C31)",
          value: "count",
        },
      ],
      correctOptionId: "b",
      successReply:
        "Correct. AVERAGE calculates the mean score.",
      retryReply:
        "Choose the function that finds the mean.",
      points: 5,
    }),
    createActivity({
      id: "data-l4-a4",
      type: "guided-practice",
      title: "Match Question to Formula",
      teacherPrompt:
        "State the best formula for each question: total revenue, average attendance and number of transactions.",
      acceptedAnswers: [
        "SUM AVERAGE COUNT",
        "sum, average, count",
      ],
      points: 10,
    }),
    createActivity({
      id: "data-l4-a5",
      type: "review",
      title: "Formula Check",
      teacherPrompt:
        "Why is it important to confirm that a formula uses the correct cell range?",
      acceptedAnswers: [
        "otherwise the result will be wrong",
        "to include the correct data",
        "to avoid missing or extra values",
      ],
      successReply:
        "Well done. You can now select basic formulas with purpose.",
      points: 5,
    }),
  ],
});

const lesson5 = createLesson({
  id: "data-foundation-unit-1-lesson-5",
  academy: "data-analytics",
  programmeId: "data-analytics-foundation",
  courseId: "data-analytics-foundation-course",
  unitId: "data-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 5,
  title: "Choosing the Right Chart",
  description:
    "Select charts that communicate comparisons, trends and proportions clearly.",
  objective:
    "The learner will match common chart types to analytical questions.",
  learningOutcomes: [
    "Use bar charts for comparisons.",
    "Use line charts for trends over time.",
    "Use pie or proportion charts carefully.",
    "Avoid misleading chart choices.",
  ],
  estimatedMinutes: 20,
  completionPoints: 40,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["14-17", "adult"],
  prerequisiteLessonIds: [lesson4.id],
  activities: [
    createActivity({
      id: "data-l5-a1",
      type: "teach",
      title: "Charts Have Different Jobs",
      teacherPrompt:
        "Bar charts compare categories. Line charts show change over time. Scatter plots explore relationships. Proportion charts show parts of a whole.",
    }),
    createActivity({
      id: "data-l5-a2",
      type: "multiple-choice",
      title: "Show a Monthly Trend",
      teacherPrompt:
        "Which chart best shows how revenue changed from January to December?",
      options: [
        {
          id: "a",
          label: "Line chart",
          value: "line",
        },
        {
          id: "b",
          label: "Single pie chart",
          value: "pie",
        },
        {
          id: "c",
          label: "Word cloud",
          value: "word-cloud",
        },
      ],
      correctOptionId: "a",
      successReply:
        "Correct. A line chart clearly shows movement over time.",
      retryReply:
        "Choose the chart designed to show a time trend.",
      points: 5,
    }),
    createActivity({
      id: "data-l5-a3",
      type: "case-study",
      title: "A Misleading Chart",
      teacherPrompt:
        "A bar chart starts its vertical axis at 98 instead of zero, making a small difference look enormous. What is the risk?",
      acceptedAnswers: [
        "it exaggerates the difference",
        "it is misleading",
        "it distorts the comparison",
      ],
      successReply:
        "Correct. Visual choices can mislead even when the numbers are technically correct.",
      points: 5,
    }),
    createActivity({
      id: "data-l5-a4",
      type: "project",
      title: "Design a Mini Dashboard",
      teacherPrompt:
        "Choose three charts for a tutoring dashboard showing monthly bookings, bookings by subject and attendance rate.",
      hints: [
        "Use a line chart for time, a bar chart for categories and a suitable percentage display for attendance.",
      ],
      points: 15,
    }),
    createActivity({
      id: "data-l5-a5",
      type: "assessment",
      title: "Foundation Assessment",
      teacherPrompt:
        "Explain the complete data workflow: question, table, cleaning, calculation, chart and decision.",
      successReply:
        "Excellent. You have completed the Data Analytics Foundation course.",
      points: 10,
    }),
  ],
});

export const dataAnalyticsFoundationCourse =
  createCourse({
    id: "data-analytics-foundation-course",
    programmeId: "data-analytics-foundation",
    stage: "foundation",
    title: "Data Analytics Foundation",
    description:
      "Learn how to structure, clean, summarise and communicate data for better decisions.",
    learningOutcomes: [
      "Frame useful analytical questions.",
      "Understand tabular datasets.",
      "Recognise common data-quality problems.",
      "Use basic spreadsheet summaries.",
      "Choose effective charts.",
    ],
    estimatedHours: 3,
    units: [
      createUnit({
        id: "data-foundation-unit-1",
        courseId: "data-analytics-foundation-course",
        unitNumber: 1,
        title: "From Data to Decisions",
        description:
          "Build a complete foundation in analytical thinking and spreadsheet-based analysis.",
        learningOutcomes: [
          "Ask clear questions.",
          "Prepare reliable data.",
          "Calculate useful summaries.",
          "Communicate findings visually.",
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
