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
  id: "finance-foundation-unit-1-lesson-1",
  academy: "personal-finance",
  programmeId: "money-foundation",
  courseId: "money-foundation-course",
  unitId: "finance-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 1,
  title: "What Is Money For?",
  description:
    "Understand money as a tool for exchange, planning, security and opportunity.",
  objective:
    "The learner will explain the main purposes of money and distinguish income from spending.",
  learningOutcomes: [
    "Describe money as a tool rather than a goal.",
    "Identify common sources of income.",
    "Distinguish earning, spending, saving and giving.",
  ],
  estimatedMinutes: 15,
  completionPoints: 30,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["6-9", "10-13", "14-17", "adult"],
  activities: [
    createActivity({
      id: "finance-l1-a1",
      type: "introduction",
      title: "Money Is a Tool",
      teacherPrompt:
        "Money helps people exchange value, pay for needs, prepare for the future and create opportunities.",
    }),
    createActivity({
      id: "finance-l1-a2",
      type: "teach",
      title: "Four Main Money Actions",
      teacherPrompt:
        "Most money decisions involve earning, spending, saving or giving. Good financial habits begin by understanding each action.",
    }),
    createActivity({
      id: "finance-l1-a3",
      type: "multiple-choice",
      title: "Income or Spending?",
      teacherPrompt:
        "Which example is income?",
      options: [
        {
          id: "a",
          label: "Receiving payment for completing a job",
          value: "income",
        },
        {
          id: "b",
          label: "Buying a new pair of shoes",
          value: "spending",
        },
      ],
      correctOptionId: "a",
      successReply:
        "Correct. Income is money received.",
      retryReply:
        "Choose the option where money comes in rather than goes out.",
      points: 5,
    }),
    createActivity({
      id: "finance-l1-a4",
      type: "reflection",
      title: "Your Money Choices",
      teacherPrompt:
        "Give one example of earning, spending, saving and giving.",
      hints: [
        "Use examples from home, school, work or business.",
      ],
      points: 10,
    }),
    createActivity({
      id: "finance-l1-a5",
      type: "review",
      title: "Lesson Review",
      teacherPrompt:
        "Complete the sentence: Money is a tool that helps us exchange value and make...",
      acceptedAnswers: [
        "choices",
        "financial choices",
        "decisions",
      ],
      successReply:
        "Excellent. You now understand the basic purpose of money.",
      points: 5,
    }),
  ],
});

const lesson2 = createLesson({
  id: "finance-foundation-unit-1-lesson-2",
  academy: "personal-finance",
  programmeId: "money-foundation",
  courseId: "money-foundation-course",
  unitId: "finance-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 2,
  title: "Needs, Wants and Priorities",
  description:
    "Learn how to separate essential needs from optional wants.",
  objective:
    "The learner will classify expenses and make a simple priority decision.",
  learningOutcomes: [
    "Distinguish needs from wants.",
    "Recognise that context can affect classification.",
    "Prioritise limited money responsibly.",
  ],
  estimatedMinutes: 18,
  completionPoints: 35,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["6-9", "10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson1.id],
  activities: [
    createActivity({
      id: "finance-l2-a1",
      type: "teach",
      title: "Need or Want?",
      teacherPrompt:
        "A need is something essential for health, safety or daily living. A want improves comfort or enjoyment but is not always essential.",
    }),
    createActivity({
      id: "finance-l2-a2",
      type: "case-study",
      title: "A Limited Budget",
      teacherPrompt:
        "A learner has enough money for school transport or a new game. Which should usually come first?",
      acceptedAnswers: [
        "school transport",
        "transport",
        "the need",
      ],
      successReply:
        "Correct. Essential needs should usually be funded before optional wants.",
      points: 5,
    }),
    createActivity({
      id: "finance-l2-a3",
      type: "multiple-choice",
      title: "Classify the Expense",
      teacherPrompt:
        "Which item is most clearly a want rather than a need?",
      options: [
        {
          id: "a",
          label: "Basic food",
          value: "food",
        },
        {
          id: "b",
          label: "A second luxury phone",
          value: "luxury-phone",
        },
        {
          id: "c",
          label: "Required medicine",
          value: "medicine",
        },
      ],
      correctOptionId: "b",
      successReply:
        "Correct. A second luxury phone is optional.",
      retryReply:
        "Choose the item that is not essential for health or daily living.",
      points: 5,
    }),
    createActivity({
      id: "finance-l2-a4",
      type: "guided-practice",
      title: "Create a Priority List",
      teacherPrompt:
        "Put these in priority order: rent, entertainment, food, savings and transport.",
      hints: [
        "Start with essential living costs, then future needs, then optional spending.",
      ],
      points: 10,
    }),
    createActivity({
      id: "finance-l2-a5",
      type: "review",
      title: "Decision Rule",
      teacherPrompt:
        "When money is limited, what should usually happen before spending on wants?",
      acceptedAnswers: [
        "pay for needs",
        "cover essentials",
        "meet needs first",
      ],
      successReply:
        "Well done. You can now prioritise needs before wants.",
      points: 5,
    }),
  ],
});

const lesson3 = createLesson({
  id: "finance-foundation-unit-1-lesson-3",
  academy: "personal-finance",
  programmeId: "money-foundation",
  courseId: "money-foundation-course",
  unitId: "finance-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 3,
  title: "Saving with a Purpose",
  description:
    "Learn how goals, consistency and time turn small savings into progress.",
  objective:
    "The learner will create a simple savings goal and calculate regular contributions.",
  learningOutcomes: [
    "Set a specific savings goal.",
    "Break a goal into regular contributions.",
    "Explain why emergency savings matter.",
  ],
  estimatedMinutes: 20,
  completionPoints: 35,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["6-9", "10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson2.id],
  activities: [
    createActivity({
      id: "finance-l3-a1",
      type: "teach",
      title: "Give Saving a Job",
      teacherPrompt:
        "Saving becomes easier when it has a clear purpose, amount and deadline.",
    }),
    createActivity({
      id: "finance-l3-a2",
      type: "example",
      title: "Break the Goal Down",
      teacherPrompt:
        "To save £120 in six months, a learner could save £20 each month.",
    }),
    createActivity({
      id: "finance-l3-a3",
      type: "multiple-choice",
      title: "Choose the Stronger Goal",
      teacherPrompt:
        "Which is a clearer savings goal?",
      options: [
        {
          id: "a",
          label: "I want to save more money.",
          value: "vague",
        },
        {
          id: "b",
          label: "I will save £25 each month for eight months.",
          value: "specific",
        },
      ],
      correctOptionId: "b",
      successReply:
        "Correct. It includes an amount and a timeframe.",
      retryReply:
        "Choose the goal that can be measured.",
      points: 5,
    }),
    createActivity({
      id: "finance-l3-a4",
      type: "project",
      title: "Build Your Savings Plan",
      teacherPrompt:
        "Choose a savings goal, total amount, deadline and regular contribution.",
      hints: [
        "Use: I want to save... by... so I will save... each week or month.",
      ],
      points: 10,
    }),
    createActivity({
      id: "finance-l3-a5",
      type: "review",
      title: "Emergency Savings",
      teacherPrompt:
        "Why is it useful to keep some savings for unexpected expenses?",
      acceptedAnswers: [
        "for emergencies",
        "to avoid debt",
        "to handle unexpected costs",
        "for financial security",
      ],
      successReply:
        "Exactly. Emergency savings create protection and flexibility.",
      points: 5,
    }),
  ],
});

const lesson4 = createLesson({
  id: "finance-foundation-unit-1-lesson-4",
  academy: "personal-finance",
  programmeId: "money-foundation",
  courseId: "money-foundation-course",
  unitId: "finance-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 4,
  title: "Building a Simple Budget",
  description:
    "Create a plan for income, needs, savings and optional spending.",
  objective:
    "The learner will prepare and evaluate a simple balanced budget.",
  learningOutcomes: [
    "List income and expenses.",
    "Calculate money remaining.",
    "Adjust a budget when spending exceeds income.",
  ],
  estimatedMinutes: 22,
  completionPoints: 40,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson3.id],
  activities: [
    createActivity({
      id: "finance-l4-a1",
      type: "teach",
      title: "A Budget Is a Plan",
      teacherPrompt:
        "A budget assigns money before it is spent. It helps you cover needs, save for goals and control optional spending.",
    }),
    createActivity({
      id: "finance-l4-a2",
      type: "example",
      title: "Balance the Budget",
      teacherPrompt:
        "If income is £200, needs are £120, savings are £40 and wants are £30, £10 remains.",
    }),
    createActivity({
      id: "finance-l4-a3",
      type: "multiple-choice",
      title: "Find the Problem",
      teacherPrompt:
        "Income is £300 and planned spending is £340. What does this mean?",
      options: [
        {
          id: "a",
          label: "There is a £40 shortfall",
          value: "shortfall",
        },
        {
          id: "b",
          label: "There is a £40 surplus",
          value: "surplus",
        },
      ],
      correctOptionId: "a",
      successReply:
        "Correct. Planned spending exceeds income by £40.",
      retryReply:
        "Subtract planned spending from income.",
      points: 5,
    }),
    createActivity({
      id: "finance-l4-a4",
      type: "case-study",
      title: "Fix the Budget",
      teacherPrompt:
        "A learner has a £40 shortfall. Suggest two responsible ways to correct the budget.",
      acceptedAnswers: [
        "reduce wants",
        "earn more",
        "delay a purchase",
        "reduce optional spending",
      ],
      hints: [
        "Change either the amount coming in or the amount going out.",
      ],
      points: 10,
    }),
    createActivity({
      id: "finance-l4-a5",
      type: "project",
      title: "Create a Monthly Budget",
      teacherPrompt:
        "Create a simple budget with income, needs, savings, giving, wants and money remaining.",
      points: 10,
    }),
  ],
});

const lesson5 = createLesson({
  id: "finance-foundation-unit-1-lesson-5",
  academy: "personal-finance",
  programmeId: "money-foundation",
  courseId: "money-foundation-course",
  unitId: "finance-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 5,
  title: "Interest, Debt and Borrowing",
  description:
    "Understand that borrowing has a cost and interest can work for or against you.",
  objective:
    "The learner will explain simple interest concepts and evaluate a borrowing decision.",
  learningOutcomes: [
    "Describe interest as a cost or reward.",
    "Recognise that debt must be repaid.",
    "Compare the price of buying now with saving first.",
  ],
  estimatedMinutes: 22,
  completionPoints: 40,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson4.id],
  activities: [
    createActivity({
      id: "finance-l5-a1",
      type: "teach",
      title: "Interest Has Two Sides",
      teacherPrompt:
        "Interest may be paid to a saver or charged to a borrower. When borrowing, the total repayment is usually more than the amount received.",
    }),
    createActivity({
      id: "finance-l5-a2",
      type: "example",
      title: "The Cost of Borrowing",
      teacherPrompt:
        "If someone borrows £100 and repays £115, the extra £15 is part of the cost of borrowing.",
    }),
    createActivity({
      id: "finance-l5-a3",
      type: "multiple-choice",
      title: "Which Costs More?",
      teacherPrompt:
        "A product costs £200 now, or £25 per month for ten months. Which option costs more overall?",
      options: [
        {
          id: "a",
          label: "Paying £200 now",
          value: "cash",
        },
        {
          id: "b",
          label: "Paying £25 for ten months",
          value: "instalment",
        },
      ],
      correctOptionId: "b",
      successReply:
        "Correct. Ten payments of £25 total £250.",
      retryReply:
        "Multiply the monthly payment by the number of months.",
      points: 5,
    }),
    createActivity({
      id: "finance-l5-a4",
      type: "case-study",
      title: "Borrow or Save?",
      teacherPrompt:
        "A learner wants a non-essential item but would pay much more by borrowing. What factors should they consider?",
      acceptedAnswers: [
        "total cost",
        "whether it is needed",
        "ability to repay",
        "saving first",
        "interest",
      ],
      hints: [
        "Think about urgency, total repayment and affordability.",
      ],
      points: 10,
    }),
    createActivity({
      id: "finance-l5-a5",
      type: "review",
      title: "Borrowing Rule",
      teacherPrompt:
        "Complete the sentence: Before borrowing, compare the amount received with the total amount...",
      acceptedAnswers: [
        "repaid",
        "to repay",
        "you will pay back",
      ],
      successReply:
        "Well done. You understand that borrowing decisions must include the full repayment cost.",
      points: 5,
    }),
  ],
});

const lesson6 = createLesson({
  id: "finance-foundation-unit-1-lesson-6",
  academy: "personal-finance",
  programmeId: "money-foundation",
  courseId: "money-foundation-course",
  unitId: "finance-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 6,
  title: "Assets, Investing and Risk",
  description:
    "Learn the difference between saving and investing and understand that returns are not guaranteed.",
  objective:
    "The learner will identify productive assets and explain the relationship between risk and potential return.",
  learningOutcomes: [
    "Distinguish saving from investing.",
    "Recognise examples of productive assets.",
    "Explain that investments can rise or fall.",
    "Understand diversification in simple terms.",
  ],
  estimatedMinutes: 25,
  completionPoints: 45,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: ["10-13", "14-17", "adult"],
  prerequisiteLessonIds: [lesson5.id],
  activities: [
    createActivity({
      id: "finance-l6-a1",
      type: "teach",
      title: "Saving Versus Investing",
      teacherPrompt:
        "Saving usually protects money for short-term needs. Investing places money into assets that may grow or generate income over time, but values can fall.",
    }),
    createActivity({
      id: "finance-l6-a2",
      type: "teach",
      title: "Productive Assets",
      teacherPrompt:
        "A productive asset has the potential to create income, growth or useful value. Examples may include a business, shares, property used responsibly or tools that support earning.",
    }),
    createActivity({
      id: "finance-l6-a3",
      type: "multiple-choice",
      title: "Understand Risk",
      teacherPrompt:
        "Which statement about investing is most accurate?",
      options: [
        {
          id: "a",
          label: "Every investment is guaranteed to increase.",
          value: "guaranteed",
        },
        {
          id: "b",
          label: "Investments may rise or fall, so risk must be understood.",
          value: "risk",
        },
      ],
      correctOptionId: "b",
      successReply:
        "Correct. Investment returns are uncertain, and losses are possible.",
      retryReply:
        "Choose the answer that recognises uncertainty.",
      points: 5,
    }),
    createActivity({
      id: "finance-l6-a4",
      type: "case-study",
      title: "Do Not Put Everything in One Place",
      teacherPrompt:
        "Why might spreading money across different investments reduce risk?",
      acceptedAnswers: [
        "one loss will not affect everything",
        "diversification",
        "risk is spread",
        "not all investments move the same way",
      ],
      successReply:
        "Correct. Diversification spreads exposure rather than relying on one asset.",
      points: 10,
    }),
    createActivity({
      id: "finance-l6-a5",
      type: "project",
      title: "Build an Asset Plan",
      teacherPrompt:
        "Create a simple plan showing one skill to develop, one savings goal and one productive asset you may study in the future.",
      hints: [
        "This is an educational exercise, not a recommendation to buy an investment.",
      ],
      points: 10,
    }),
    createActivity({
      id: "finance-l6-a6",
      type: "assessment",
      title: "Foundation Assessment",
      teacherPrompt:
        "Explain needs and wants, saving, budgeting, interest, debt, assets and investment risk.",
      successReply:
        "Fantastic. You have completed the Money Foundation course.",
      points: 10,
    }),
  ],
});

export const moneyFoundationCourse =
  createCourse({
    id: "money-foundation-course",
    programmeId: "money-foundation",
    stage: "foundation",
    title: "Money Foundation",
    description:
      "Build practical money habits through saving, budgeting, responsible borrowing and productive-asset thinking.",
    learningOutcomes: [
      "Understand the purpose of money.",
      "Prioritise needs and goals.",
      "Build savings and budgets.",
      "Evaluate borrowing costs.",
      "Understand assets, investing and risk.",
    ],
    estimatedHours: 3,
    units: [
      createUnit({
        id: "finance-foundation-unit-1",
        courseId: "money-foundation-course",
        unitNumber: 1,
        title: "Build Strong Money Habits",
        description:
          "Learn the financial habits that support security, choice and long-term opportunity.",
        learningOutcomes: [
          "Make intentional spending choices.",
          "Save consistently.",
          "Use a budget.",
          "Understand borrowing costs.",
          "Think in terms of productive assets.",
        ],
        lessons: [
          lesson1,
          lesson2,
          lesson3,
          lesson4,
          lesson5,
          lesson6,
        ],
      }),
    ],
  });
