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
  id: "mathematics-foundation-unit-1-lesson-1",
  academy: "mathematics",
  programmeId: "mathematics-foundation",
  courseId: "mathematics-foundation-course",
  unitId: "mathematics-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 1,
  title: "Understanding Place Value",
  description:
    "Learn how the position of a digit changes its value.",
  objective:
    "The learner will identify ones, tens, hundreds and thousands in whole numbers.",
  learningOutcomes: [
    "Read and write whole numbers.",
    "Identify digit values.",
    "Partition numbers into place-value parts.",
  ],
  estimatedMinutes: 18,
  completionPoints: 30,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["6-9", "10-13", "14-17", "adult"],
  activities: [
    createActivity({
      id: "maths-l1-a1",
      type: "teach",
      title: "Digits Have Positions",
      teacherPrompt:
        "In the number 4,382, the digit 4 means four thousand, 3 means three hundred, 8 means eighty and 2 means two.",
    }),
    createActivity({
      id: "maths-l1-a2",
      type: "multiple-choice",
      title: "Find the Value",
      teacherPrompt:
        "What is the value of 7 in the number 2,741?",
      options: [
        {
          id: "a",
          label: "7",
          value: "7",
        },
        {
          id: "b",
          label: "70",
          value: "70",
        },
        {
          id: "c",
          label: "700",
          value: "700",
        },
      ],
      correctOptionId: "c",
      successReply:
        "Correct. The 7 is in the hundreds place, so its value is 700.",
      retryReply:
        "Look at the position of the digit 7.",
      points: 5,
    }),
    createActivity({
      id: "maths-l1-a3",
      type: "guided-practice",
      title: "Partition the Number",
      teacherPrompt:
        "Write 5,406 as the sum of its place-value parts.",
      acceptedAnswers: [
        "5000 + 400 + 6",
        "5,000 + 400 + 6",
      ],
      hints: [
        "There are no tens in this number.",
      ],
      successReply:
        "Excellent. 5,406 equals 5,000 plus 400 plus 6.",
      points: 10,
    }),
    createActivity({
      id: "maths-l1-a4",
      type: "review",
      title: "Lesson Review",
      teacherPrompt:
        "Explain why the same digit can have different values in different numbers.",
      acceptedAnswers: [
        "because its position changes",
        "because place value changes",
      ],
      successReply:
        "Well done. You understand how place value works.",
      points: 5,
    }),
  ],
});

const lesson2 = createLesson({
  id: "mathematics-foundation-unit-1-lesson-2",
  academy: "mathematics",
  programmeId: "mathematics-foundation",
  courseId: "mathematics-foundation-course",
  unitId: "mathematics-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 2,
  title: "Addition and Subtraction Strategies",
  description:
    "Use place value, number bonds and written methods to calculate accurately.",
  objective:
    "The learner will choose and apply efficient addition and subtraction strategies.",
  learningOutcomes: [
    "Use mental strategies.",
    "Apply written methods.",
    "Check answers using inverse operations.",
  ],
  estimatedMinutes: 22,
  completionPoints: 35,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["6-9", "10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson1.id],
  activities: [
    createActivity({
      id: "maths-l2-a1",
      type: "teach",
      title: "Choose an Efficient Method",
      teacherPrompt:
        "Some calculations are easier mentally, while others are clearer using a written column method.",
    }),
    createActivity({
      id: "maths-l2-a2",
      type: "example",
      title: "Use Number Bonds",
      teacherPrompt:
        "To calculate 48 plus 27, add 20 to get 68, then add 7 to get 75.",
    }),
    createActivity({
      id: "maths-l2-a3",
      type: "multiple-choice",
      title: "Check with the Inverse",
      teacherPrompt:
        "If 83 minus 29 equals 54, which calculation checks the answer?",
      options: [
        {
          id: "a",
          label: "54 + 29 = 83",
          value: "inverse",
        },
        {
          id: "b",
          label: "83 + 29 = 112",
          value: "not-inverse",
        },
      ],
      correctOptionId: "a",
      successReply:
        "Correct. Addition checks a subtraction result.",
      retryReply:
        "Use the inverse operation.",
      points: 5,
    }),
    createActivity({
      id: "maths-l2-a4",
      type: "guided-practice",
      title: "Solve and Explain",
      teacherPrompt:
        "Calculate 356 + 278 and explain the method you used.",
      acceptedAnswers: [
        "634",
      ],
      hints: [
        "Add ones, tens and hundreds carefully.",
      ],
      points: 10,
    }),
    createActivity({
      id: "maths-l2-a5",
      type: "review",
      title: "Choose the Method",
      teacherPrompt:
        "When might a mental method be better than a written method?",
      acceptedAnswers: [
        "when the numbers are simple",
        "when using number bonds",
        "when the calculation is easy to adjust",
      ],
      successReply:
        "Excellent. Good mathematicians choose efficient methods.",
      points: 5,
    }),
  ],
});

const lesson3 = createLesson({
  id: "mathematics-foundation-unit-1-lesson-3",
  academy: "mathematics",
  programmeId: "mathematics-foundation",
  courseId: "mathematics-foundation-course",
  unitId: "mathematics-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 3,
  title: "Multiplication and Division",
  description:
    "Understand multiplication as equal groups and division as sharing or grouping.",
  objective:
    "The learner will solve multiplication and division problems and explain their relationship.",
  learningOutcomes: [
    "Represent equal groups.",
    "Use multiplication facts.",
    "Check division using multiplication.",
  ],
  estimatedMinutes: 22,
  completionPoints: 35,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["6-9", "10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson2.id],
  activities: [
    createActivity({
      id: "maths-l3-a1",
      type: "teach",
      title: "Equal Groups",
      teacherPrompt:
        "Four groups of six can be written as 4 × 6, which equals 24.",
    }),
    createActivity({
      id: "maths-l3-a2",
      type: "example",
      title: "Division Reverses Multiplication",
      teacherPrompt:
        "Because 4 × 6 = 24, we also know that 24 ÷ 6 = 4 and 24 ÷ 4 = 6.",
    }),
    createActivity({
      id: "maths-l3-a3",
      type: "multiple-choice",
      title: "Choose the Related Fact",
      teacherPrompt:
        "Which division fact matches 7 × 8 = 56?",
      options: [
        {
          id: "a",
          label: "56 ÷ 8 = 7",
          value: "related",
        },
        {
          id: "b",
          label: "56 ÷ 7 = 6",
          value: "incorrect",
        },
      ],
      correctOptionId: "a",
      successReply:
        "Correct. Division reverses the multiplication fact.",
      retryReply:
        "Use the two factors and the product.",
      points: 5,
    }),
    createActivity({
      id: "maths-l3-a4",
      type: "case-study",
      title: "Sharing Equally",
      teacherPrompt:
        "Forty-eight pencils are shared equally among six learners. How many does each learner receive?",
      acceptedAnswers: [
        "8",
        "eight",
      ],
      successReply:
        "Correct. 48 divided by 6 equals 8.",
      points: 10,
    }),
    createActivity({
      id: "maths-l3-a5",
      type: "review",
      title: "Explain the Relationship",
      teacherPrompt:
        "How are multiplication and division connected?",
      acceptedAnswers: [
        "they are inverse operations",
        "division reverses multiplication",
      ],
      successReply:
        "Well done. You understand multiplication and division as connected operations.",
      points: 5,
    }),
  ],
});

const lesson4 = createLesson({
  id: "mathematics-foundation-unit-1-lesson-4",
  academy: "mathematics",
  programmeId: "mathematics-foundation",
  courseId: "mathematics-foundation-course",
  unitId: "mathematics-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 4,
  title: "Fractions as Equal Parts",
  description:
    "Understand fractions as equal parts of a whole or a set.",
  objective:
    "The learner will identify, compare and represent simple fractions.",
  learningOutcomes: [
    "Identify numerator and denominator.",
    "Recognise equivalent fractions.",
    "Compare simple fractions.",
  ],
  estimatedMinutes: 24,
  completionPoints: 40,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["6-9", "10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson3.id],
  activities: [
    createActivity({
      id: "maths-l4-a1",
      type: "teach",
      title: "Equal Parts Matter",
      teacherPrompt:
        "In the fraction 3/4, the denominator 4 tells us the whole is split into four equal parts, and the numerator 3 tells us three parts are selected.",
    }),
    createActivity({
      id: "maths-l4-a2",
      type: "multiple-choice",
      title: "Choose the Equivalent Fraction",
      teacherPrompt:
        "Which fraction is equivalent to 1/2?",
      options: [
        {
          id: "a",
          label: "2/4",
          value: "2/4",
        },
        {
          id: "b",
          label: "2/3",
          value: "2/3",
        },
      ],
      correctOptionId: "a",
      successReply:
        "Correct. 1/2 and 2/4 represent the same amount.",
      retryReply:
        "Choose the fraction that covers the same proportion of the whole.",
      points: 5,
    }),
    createActivity({
      id: "maths-l4-a3",
      type: "guided-practice",
      title: "Compare Fractions",
      teacherPrompt:
        "Which is larger: 3/5 or 2/5? Explain why.",
      acceptedAnswers: [
        "3/5",
        "three fifths",
      ],
      hints: [
        "The denominators are the same, so compare the numerators.",
      ],
      successReply:
        "Correct. Three fifths is larger because it contains more equal fifths.",
      points: 10,
    }),
    createActivity({
      id: "maths-l4-a4",
      type: "case-study",
      title: "Fraction of a Set",
      teacherPrompt:
        "There are 12 apples. One quarter are green. How many are green?",
      acceptedAnswers: [
        "3",
        "three",
      ],
      successReply:
        "Correct. One quarter of 12 is 3.",
      points: 10,
    }),
    createActivity({
      id: "maths-l4-a5",
      type: "review",
      title: "Fraction Review",
      teacherPrompt:
        "What do the numerator and denominator tell us?",
      acceptedAnswers: [
        "the numerator shows selected parts and the denominator shows total equal parts",
      ],
      successReply:
        "Excellent. You understand the structure of a fraction.",
      points: 5,
    }),
  ],
});

const lesson5 = createLesson({
  id: "mathematics-foundation-unit-1-lesson-5",
  academy: "mathematics",
  programmeId: "mathematics-foundation",
  courseId: "mathematics-foundation-course",
  unitId: "mathematics-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 5,
  title: "Decimals and Money",
  description:
    "Connect tenths and hundredths to decimal notation and money.",
  objective:
    "The learner will read, compare and calculate with simple decimals.",
  learningOutcomes: [
    "Recognise tenths and hundredths.",
    "Compare decimal values.",
    "Use decimals in money calculations.",
  ],
  estimatedMinutes: 24,
  completionPoints: 40,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["8-11", "10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson4.id],
  activities: [
    createActivity({
      id: "maths-l5-a1",
      type: "teach",
      title: "Decimal Place Value",
      teacherPrompt:
        "In 3.47, the 4 represents four tenths and the 7 represents seven hundredths.",
    }),
    createActivity({
      id: "maths-l5-a2",
      type: "multiple-choice",
      title: "Compare the Decimals",
      teacherPrompt:
        "Which number is larger?",
      options: [
        {
          id: "a",
          label: "0.7",
          value: "0.7",
        },
        {
          id: "b",
          label: "0.65",
          value: "0.65",
        },
      ],
      correctOptionId: "a",
      successReply:
        "Correct. 0.7 is the same as 0.70, which is greater than 0.65.",
      retryReply:
        "Write both numbers with the same number of decimal places.",
      points: 5,
    }),
    createActivity({
      id: "maths-l5-a3",
      type: "case-study",
      title: "Money Calculation",
      teacherPrompt:
        "A book costs £6.75 and a pen costs £1.40. What is the total cost?",
      acceptedAnswers: [
        "£8.15",
        "8.15",
      ],
      successReply:
        "Correct. £6.75 plus £1.40 equals £8.15.",
      points: 10,
    }),
    createActivity({
      id: "maths-l5-a4",
      type: "guided-practice",
      title: "Find the Change",
      teacherPrompt:
        "You pay £10 for an item costing £7.35. How much change should you receive?",
      acceptedAnswers: [
        "£2.65",
        "2.65",
      ],
      successReply:
        "Correct. £10 minus £7.35 equals £2.65.",
      points: 10,
    }),
    createActivity({
      id: "maths-l5-a5",
      type: "review",
      title: "Decimal Review",
      teacherPrompt:
        "Why is it useful to line up decimal points when adding or subtracting decimals?",
      acceptedAnswers: [
        "to keep place values aligned",
        "so tenths and hundredths stay in the correct columns",
      ],
      successReply:
        "Well done. You can now use decimal place value accurately.",
      points: 5,
    }),
  ],
});

const lesson6 = createLesson({
  id: "mathematics-foundation-unit-1-lesson-6",
  academy: "mathematics",
  programmeId: "mathematics-foundation",
  courseId: "mathematics-foundation-course",
  unitId: "mathematics-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 6,
  title: "Percentages in Everyday Life",
  description:
    "Understand percentages as parts out of one hundred.",
  objective:
    "The learner will calculate simple percentages and connect them to fractions and decimals.",
  learningOutcomes: [
    "Interpret percentage notation.",
    "Calculate common percentages.",
    "Connect fractions, decimals and percentages.",
  ],
  estimatedMinutes: 24,
  completionPoints: 40,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson5.id],
  activities: [
    createActivity({
      id: "maths-l6-a1",
      type: "teach",
      title: "Out of One Hundred",
      teacherPrompt:
        "A percentage describes an amount out of 100. Fifty percent equals 50/100, 1/2 and 0.5.",
    }),
    createActivity({
      id: "maths-l6-a2",
      type: "multiple-choice",
      title: "Find 10 Percent",
      teacherPrompt:
        "What is 10% of 80?",
      options: [
        {
          id: "a",
          label: "8",
          value: "8",
        },
        {
          id: "b",
          label: "18",
          value: "18",
        },
      ],
      correctOptionId: "a",
      successReply:
        "Correct. Ten percent means divide by ten.",
      retryReply:
        "Find one tenth of 80.",
      points: 5,
    }),
    createActivity({
      id: "maths-l6-a3",
      type: "case-study",
      title: "Discount",
      teacherPrompt:
        "A £50 item has a 20% discount. How much is the discount?",
      acceptedAnswers: [
        "£10",
        "10",
      ],
      successReply:
        "Correct. Twenty percent of £50 is £10.",
      points: 10,
    }),
    createActivity({
      id: "maths-l6-a4",
      type: "guided-practice",
      title: "Convert the Values",
      teacherPrompt:
        "Write 25% as a fraction and as a decimal.",
      acceptedAnswers: [
        "1/4 and 0.25",
        "25/100 and 0.25",
      ],
      successReply:
        "Correct. 25% equals one quarter and 0.25.",
      points: 10,
    }),
    createActivity({
      id: "maths-l6-a5",
      type: "review",
      title: "Percentage Review",
      teacherPrompt:
        "Explain what 75% means.",
      acceptedAnswers: [
        "75 out of 100",
        "three quarters",
        "0.75",
      ],
      successReply:
        "Excellent. You understand percentages as parts of one hundred.",
      points: 5,
    }),
  ],
});

const lesson7 = createLesson({
  id: "mathematics-foundation-unit-1-lesson-7",
  academy: "mathematics",
  programmeId: "mathematics-foundation",
  courseId: "mathematics-foundation-course",
  unitId: "mathematics-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 7,
  title: "Introduction to Algebra",
  description:
    "Use symbols to represent unknown values and solve simple equations.",
  objective:
    "The learner will translate simple situations into algebraic expressions and solve one-step equations.",
  learningOutcomes: [
    "Use letters for unknown values.",
    "Simplify simple expressions.",
    "Solve one-step equations.",
  ],
  estimatedMinutes: 25,
  completionPoints: 45,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson6.id],
  activities: [
    createActivity({
      id: "maths-l7-a1",
      type: "teach",
      title: "Letters Can Represent Numbers",
      teacherPrompt:
        "In algebra, a letter can stand for an unknown or changing number.",
    }),
    createActivity({
      id: "maths-l7-a2",
      type: "example",
      title: "Solve the Unknown",
      teacherPrompt:
        "If x + 5 = 12, subtract 5 from both sides to find x = 7.",
    }),
    createActivity({
      id: "maths-l7-a3",
      type: "multiple-choice",
      title: "Find x",
      teacherPrompt:
        "If 3x = 18, what is x?",
      options: [
        {
          id: "a",
          label: "6",
          value: "6",
        },
        {
          id: "b",
          label: "15",
          value: "15",
        },
      ],
      correctOptionId: "a",
      successReply:
        "Correct. Divide both sides by 3 to find x = 6.",
      retryReply:
        "Use the inverse operation.",
      points: 5,
    }),
    createActivity({
      id: "maths-l7-a4",
      type: "guided-practice",
      title: "Write an Expression",
      teacherPrompt:
        "Write an algebraic expression for a number n increased by 8.",
      acceptedAnswers: [
        "n + 8",
        "8 + n",
      ],
      successReply:
        "Correct. n plus 8 represents the unknown number increased by 8.",
      points: 10,
    }),
    createActivity({
      id: "maths-l7-a5",
      type: "review",
      title: "Algebra Review",
      teacherPrompt:
        "Why do we use letters in algebra?",
      acceptedAnswers: [
        "to represent unknown numbers",
        "to represent changing values",
      ],
      successReply:
        "Well done. You understand the purpose of algebraic symbols.",
      points: 5,
    }),
  ],
});

const lesson8 = createLesson({
  id: "mathematics-foundation-unit-1-lesson-8",
  academy: "mathematics",
  programmeId: "mathematics-foundation",
  courseId: "mathematics-foundation-course",
  unitId: "mathematics-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 8,
  title: "Shape, Measure and Data",
  description:
    "Apply geometry, measurement and data interpretation to practical problems.",
  objective:
    "The learner will solve simple problems involving perimeter, area and charts.",
  learningOutcomes: [
    "Calculate perimeter and area.",
    "Choose suitable units.",
    "Read simple charts and tables.",
  ],
  estimatedMinutes: 28,
  completionPoints: 50,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["8-11", "10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson7.id],
  activities: [
    createActivity({
      id: "maths-l8-a1",
      type: "teach",
      title: "Perimeter and Area",
      teacherPrompt:
        "Perimeter measures the distance around a shape. Area measures the space inside it.",
    }),
    createActivity({
      id: "maths-l8-a2",
      type: "multiple-choice",
      title: "Find the Area",
      teacherPrompt:
        "A rectangle is 8 cm long and 3 cm wide. What is its area?",
      options: [
        {
          id: "a",
          label: "11 cm²",
          value: "11",
        },
        {
          id: "b",
          label: "22 cm²",
          value: "22",
        },
        {
          id: "c",
          label: "24 cm²",
          value: "24",
        },
      ],
      correctOptionId: "c",
      successReply:
        "Correct. Area equals length multiplied by width.",
      retryReply:
        "Multiply 8 by 3.",
      points: 5,
    }),
    createActivity({
      id: "maths-l8-a3",
      type: "case-study",
      title: "Read the Chart",
      teacherPrompt:
        "A bar chart shows Maths 12, English 9 and Science 15. Which subject has the highest value, and how much higher is it than English?",
      acceptedAnswers: [
        "Science, 6",
        "Science by 6",
      ],
      successReply:
        "Correct. Science is highest and exceeds English by 6.",
      points: 10,
    }),
    createActivity({
      id: "maths-l8-a4",
      type: "project",
      title: "Design a Small Room",
      teacherPrompt:
        "Design a rectangular room, choose dimensions, calculate its perimeter and area, then explain which units you used.",
      points: 15,
    }),
    createActivity({
      id: "maths-l8-a5",
      type: "assessment",
      title: "Foundation Assessment",
      teacherPrompt:
        "Explain and solve one example involving place value, operations, fractions, decimals, percentages, algebra, geometry and data.",
      successReply:
        "Fantastic. You have completed the Mathematics Foundation course.",
      points: 10,
    }),
  ],
});

export const mathematicsFoundationCourse =
  createCourse({
    id: "mathematics-foundation-course",
    programmeId: "mathematics-foundation",
    stage: "foundation",
    title: "Mathematics Foundation",
    description:
      "Build confidence across number, fractions, decimals, percentages, algebra, geometry and data.",
    learningOutcomes: [
      "Use place value accurately.",
      "Calculate with the four operations.",
      "Understand fractions, decimals and percentages.",
      "Solve simple algebraic problems.",
      "Apply geometry and data skills.",
    ],
    estimatedHours: 5,
    units: [
      createUnit({
        id: "mathematics-foundation-unit-1",
        courseId: "mathematics-foundation-course",
        unitNumber: 1,
        title: "Core Mathematical Thinking",
        description:
          "Develop a broad mathematical foundation through explanation, practice and real-life problems.",
        learningOutcomes: [
          "Reason with numbers.",
          "Select suitable methods.",
          "Explain mathematical thinking.",
          "Apply concepts to practical situations.",
        ],
        lessons: [
          lesson1,
          lesson2,
          lesson3,
          lesson4,
          lesson5,
          lesson6,
          lesson7,
          lesson8,
        ],
      }),
    ],
  });
