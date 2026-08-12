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

const suitableAgeGroups = ["6-9", "10-13", "14-17", "adult"] as const;

const lesson1 = createLesson({
  id: "finance-foundation-unit-1-lesson-1",
  academy: "personal-finance",
  programmeId: "money-foundation",
  courseId: "money-foundation-course",
  unitId: "finance-foundation-unit-1",
  stage: "foundation",
  lessonNumber: 1,
  title: "Money Is a Game — Know the Rules",
  description:
    "Learn the fundamental rules behind earning, keeping, protecting, growing and using money to build long-term value.",
  objective:
    "The learner will explain the core rules that influence financial outcomes and recognise that money decisions compound over time.",
  learningOutcomes: [
    "Understand that financial outcomes are shaped by repeated decisions.",
    "Explain the roles of earning, spending, saving, protecting and investing.",
    "Recognise the importance of living below available means.",
    "Understand why ownership and asset creation matter.",
  ],
  estimatedMinutes: 22,
  completionPoints: 40,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: [...suitableAgeGroups],

  activities: [
    createActivity({
      id: "finance-l2-a1",
      type: "introduction",
      title: "Every Game Has Rules",
      teacherPrompt:
        "Football, chess and video games all have rules. Money does too. If you do not understand the rules, you can work very hard and still make decisions that keep you financially stuck.",
      explanation:
        "The word 'game' is a metaphor for understanding how repeated financial choices produce different outcomes. It is not a reference to gambling.",
      visualTitle: "The five money rules",
      visualDescription:
        "Create value. Keep a portion. Protect what you build. Own or create productive assets. Give time and compounding a chance to work.",
    }),
    createActivity({
      id: "finance-l2-a2",
      type: "teach",
      title: "Rule 1: Create Value Before Chasing Money",
      teacherPrompt:
        "Income usually follows value. Skills, work, enterprise, creativity and useful solutions can increase what a person is able to earn. Human capital — your knowledge and productive ability — can be one of the first economic resources you develop.",
      explanation:
        "People are not property. 'Human capital' is an economic term for the knowledge, skills, experience and health that can increase a person's productive capacity.",
    }),
    createActivity({
      id: "finance-l2-a3",
      type: "teach",
      title: "Rules 2–5: Keep, Protect, Own and Grow",
      teacherPrompt:
        "A simple financial pattern is: earn value, spend intentionally, keep part of what you earn, protect yourself from avoidable shocks, and use retained money to acquire or create productive assets. Over time, those assets may generate income or appreciate in value.",
      explanation:
        "No rule guarantees wealth. Risk, circumstances and returns vary. The purpose is to understand mechanisms that can improve long-term financial resilience and choice.",
    }),
    createActivity({
      id: "finance-l2-a4",
      type: "multiple-choice",
      title: "Which Rule Is Missing?",
      teacherPrompt:
        "Kai earns, spends and saves, but never considers how retained money could be used to build productive assets. Which financial rule is Kai overlooking?",
      options: [
        { id: "a", label: "The role of ownership and asset creation in long-term wealth building.", value: "assets" },
        { id: "b", label: "The need to spend every saved pound as quickly as possible.", value: "spend" },
      ],
      correctOptionId: "a",
      successReply:
        "Correct. Saving is important, but long-term wealth building often involves understanding productive assets and ownership.",
      retryReply: "Think about what saved money can eventually become.",
      points: 5,
    }),
    createActivity({
      id: "finance-l2-a5",
      type: "case-study",
      title: "The Rule of Time",
      teacherPrompt:
        "Why can starting a good financial habit early be powerful even when the amount is small?",
      acceptedAnswers: ["time", "compound growth", "compounding", "habits build", "more years", "small amounts can grow", "consistency"],
      successReply:
        "Correct. Time can magnify consistent behaviour. Compounding, skill development and repeated saving all benefit from time.",
      hints: ["Think about what can happen when a useful habit is repeated for years rather than weeks."],
      points: 10,
    }),
    createActivity({
      id: "finance-l2-a6",
      type: "review",
      title: "Know the Rules Before You Play",
      teacherPrompt:
        "Financial progress is not one decision. It is a system: create value, control spending, retain resources, protect against avoidable shocks, and learn how assets can create future value.",
      successReply:
        "Well done. Next, you will look at the movement of money through everyday life.",
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
  title: "The Difference Between High Income and Wealth",
  description:
    "Discover why earning a lot of money is not the same as becoming wealthy — and what actually changes your financial position over time.",
  objective:
    "The learner will distinguish income from wealth and explain why assets, liabilities, spending and retained value matter more than income alone.",
  learningOutcomes: [
    "Define income and wealth in simple terms.",
    "Explain why a high income does not automatically create wealth.",
    "Recognise that wealth is affected by what a person owns, owes, keeps and builds.",
    "Begin thinking beyond salary towards net worth and productive assets.",
  ],
  estimatedMinutes: 20,
  completionPoints: 40,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: [...suitableAgeGroups],
  prerequisiteLessonIds: [lesson1.id],

  activities: [
    createActivity({
      id: "finance-l1-a1",
      type: "introduction",
      title: "Two People. Same Question.",
      teacherPrompt:
        "Imagine two people. Person A earns £120,000 a year but spends almost everything and has large debts. Person B earns £55,000, saves consistently, owns investments and has little debt. Who is actually wealthier? Income tells us what comes in. Wealth tells us what has been built and retained.",
      explanation:
        "A high income can create opportunity, but wealth depends on what remains after spending and debt — and what valuable assets have been accumulated or created.",
      story:
        "One person drives a luxury car on finance and earns a large salary. Another earns less, lives below their means and gradually owns productive assets. The second person may have greater net worth even with lower annual income.",
      visualTitle: "Income is a flow. Wealth is a position.",
      visualDescription:
        "Picture income as water flowing into a bucket. Wealth depends on how much stays in the bucket and what the retained money is transformed into.",
    }),
    createActivity({
      id: "finance-l1-a2",
      type: "teach",
      title: "Income Is Not the Scoreboard",
      teacherPrompt:
        "Income is money received over a period of time. Wealth is the value of what you own minus what you owe. Someone can earn a lot and still build very little wealth if spending and debt absorb most of the income.",
      explanation:
        "Income matters because it gives you resources to work with. But income is only one part of the financial picture. Wealth is built when some of those resources are retained, protected, invested or transformed into assets.",
    }),
    createActivity({
      id: "finance-l1-a3",
      type: "multiple-choice",
      title: "Who Is Building More Wealth?",
      teacherPrompt:
        "Jordan earns £9,000 a month and spends £8,900. Amara earns £4,000 a month, spends £2,800 and regularly builds savings and assets. Which statement is most accurate?",
      options: [
        { id: "a", label: "Jordan must be wealthier because Jordan earns more.", value: "income-only" },
        { id: "b", label: "Amara may be building wealth faster because more of the income is retained and converted into assets.", value: "wealth-building" },
      ],
      correctOptionId: "b",
      successReply:
        "Correct. Income creates capacity, but wealth depends on what is kept, owned, created and owed.",
      retryReply:
        "Look beyond salary. Ask what each person keeps and what assets or liabilities they are building.",
      points: 5,
    }),
    createActivity({
      id: "finance-l1-a4",
      type: "case-study",
      title: "The Lifestyle Trap",
      teacherPrompt:
        "Why can earning more money fail to improve someone's wealth if every pay rise is followed by higher spending?",
      acceptedAnswers: [
        "lifestyle inflation",
        "spending increases",
        "nothing is saved",
        "nothing is invested",
        "income rises but assets do not",
        "they spend everything",
        "wealth does not grow",
      ],
      successReply:
        "Exactly. If spending rises as quickly as income, a higher salary may create a more expensive lifestyle without creating greater financial security.",
      hints: ["Think about what happens when income rises but the amount retained stays close to zero."],
      points: 10,
    }),
    createActivity({
      id: "finance-l1-a5",
      type: "reflection",
      title: "Change the Question",
      teacherPrompt:
        "Instead of asking only 'How much does this person earn?', what three better questions could you ask to understand their financial position?",
      hints: ["Think about assets, debts, savings, spending and net worth."],
      points: 10,
    }),
    createActivity({
      id: "finance-l1-a6",
      type: "review",
      title: "The Foundation Idea",
      teacherPrompt:
        "Income can help you build wealth, but income and wealth are not the same thing. Wealth is shaped by what you keep, what you own, what you create and what you owe.",
      successReply:
        "Excellent. You are now looking beyond income and beginning to think like an asset builder.",
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
  title: "Where Does Your Money Go?",
  description:
    "Follow money from income to spending, saving, debt and future goals so you can understand the cash flow behind financial progress.",
  objective:
    "The learner will explain cash flow, distinguish key types of spending and build a simple plan for directing money intentionally.",
  learningOutcomes: [
    "Define income, expenses and cash flow.",
    "Distinguish needs, wants, fixed and variable expenses.",
    "Understand why positive cash flow creates financial options.",
    "Explain the purpose of saving and emergency reserves.",
  ],
  estimatedMinutes: 22,
  completionPoints: 40,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: [...suitableAgeGroups],
  prerequisiteLessonIds: [lesson2.id],
  activities: [
    createActivity({
      id: "finance-l3-a1",
      type: "introduction",
      title: "Money Leaves Clues",
      teacherPrompt:
        "If money keeps disappearing before the end of the month, the first question is not 'How do I invest?' It is 'Where is my money going?' Cash flow shows how money moves in and out.",
      visualTitle: "Income → Choices → Outcome",
      visualDescription:
        "Money comes in as income, then flows to needs, wants, saving, debt repayments, protection and future assets.",
    }),
    createActivity({
      id: "finance-l3-a2",
      type: "teach",
      title: "Needs, Wants and Priorities",
      teacherPrompt:
        "Needs are essential for basic living or important commitments. Wants improve comfort or enjoyment but are not always essential. A good financial plan makes room for enjoyment while protecting important goals.",
      explanation:
        "Financial literacy is not about removing every enjoyable purchase. It is about understanding trade-offs and deciding intentionally.",
    }),
    createActivity({
      id: "finance-l3-a3",
      type: "teach",
      title: "Positive Cash Flow Creates Choice",
      teacherPrompt:
        "Positive cash flow means more money comes in than goes out during a period. The difference can support emergency savings, future goals, debt reduction or asset building.",
      explanation:
        "A budget is simply a plan for directing money before it disappears into unplanned spending.",
    }),
    createActivity({
      id: "finance-l3-a4",
      type: "multiple-choice",
      title: "Which Plan Creates More Flexibility?",
      teacherPrompt:
        "Two households each receive £3,000 this month. Household A spends £3,000. Household B spends £2,500 and directs £500 to savings and future goals. Which has created more financial flexibility this month?",
      options: [
        { id: "a", label: "Household A", value: "a" },
        { id: "b", label: "Household B", value: "b" },
      ],
      correctOptionId: "b",
      successReply:
        "Correct. Household B has created a surplus that can strengthen resilience or build future assets.",
      retryReply: "Look for the household that has money remaining after current spending.",
      points: 5,
    }),
    createActivity({
      id: "finance-l3-a5",
      type: "project",
      title: "Build a 100-Point Money Plan",
      teacherPrompt:
        "Imagine your monthly income is 100 points. Allocate those points across essential spending, flexible spending, saving, debt repayment and future goals. Explain why you chose your split.",
      hints: ["There is no single perfect percentage. Your goal is to show intentional trade-offs."],
      points: 10,
    }),
    createActivity({
      id: "finance-l3-a6",
      type: "review",
      title: "Control the Flow Before Chasing Returns",
      teacherPrompt:
        "Before money can build assets, you need to understand its flow. Income creates resources; spending uses them; saving retains them; planning decides what happens next.",
      successReply:
        "Excellent. You are ready to move from cash flow to the financial balance sheet: assets, liabilities and net worth.",
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
  title: "Assets, Liabilities & Net Worth",
  description:
    "Learn the difference between what you own, what you owe and the financial position that remains after the two are compared.",
  objective:
    "The learner will define assets and liabilities, calculate simple net worth and explain why debt attached to an asset does not automatically change the asset's underlying nature.",
  learningOutcomes: [
    "Define an asset professionally and in plain language.",
    "Define a liability.",
    "Calculate net worth as assets minus liabilities.",
    "Understand the difference between an asset and the debt used to finance it.",
  ],
  estimatedMinutes: 24,
  completionPoints: 45,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: [...suitableAgeGroups],
  prerequisiteLessonIds: [lesson3.id],
  activities: [
    createActivity({
      id: "finance-l4-a1",
      type: "introduction",
      title: "What Do You Own? What Do You Owe?",
      teacherPrompt:
        "Income tells us what flows in. A financial balance sheet asks a different question: what valuable resources do you own or control, and what obligations do you owe?",
      visualTitle: "Net worth = Assets − Liabilities",
      visualDescription:
        "Place assets on one side and liabilities on the other. The difference is net worth.",
    }),
    createActivity({
      id: "finance-l4-a2",
      type: "teach",
      title: "What Is an Asset?",
      teacherPrompt:
        "An asset is a resource with economic value that a person, business or organisation owns or controls and from which future economic benefits may reasonably be expected.",
      explanation:
        "In simple language: an asset is something valuable that can benefit you now or in the future. Benefits might come from income, appreciation, production, legal rights, reduced future costs or resale value.",
    }),
    createActivity({
      id: "finance-l4-a3",
      type: "teach",
      title: "What Is a Liability?",
      teacherPrompt:
        "A liability is an obligation owed to another party. A house can be an asset while the mortgage used to finance it is a liability. A vehicle can be an asset while vehicle finance is a liability.",
      explanation:
        "Having debt attached to an asset does not necessarily stop the underlying item from being an asset. The asset and the financing obligation are analysed separately.",
    }),
    createActivity({
      id: "finance-l4-a4",
      type: "multiple-choice",
      title: "Asset or Liability?",
      teacherPrompt:
        "A business owns equipment worth £20,000 and still owes £7,000 on the equipment loan. Which statement is most accurate?",
      options: [
        { id: "a", label: "The equipment is an asset and the outstanding loan is a liability.", value: "correct" },
        { id: "b", label: "The equipment cannot be an asset because a loan exists.", value: "incorrect" },
      ],
      correctOptionId: "a",
      successReply:
        "Correct. The productive equipment and the debt used to finance it are separate parts of the financial picture.",
      retryReply: "Separate what is owned from what is owed.",
      points: 5,
    }),
    createActivity({
      id: "finance-l4-a5",
      type: "case-study",
      title: "Calculate Net Worth",
      teacherPrompt:
        "A fictional learner has £8,000 of assets and £3,000 of liabilities. What is the learner's net worth?",
      acceptedAnswers: ["5000", "£5000", "£5,000", "5,000"],
      successReply: "Correct. £8,000 minus £3,000 equals £5,000 of net worth.",
      retryReply: "Use the formula: assets minus liabilities.",
      points: 10,
    }),
    createActivity({
      id: "finance-l4-a6",
      type: "review",
      title: "Your Financial Position",
      teacherPrompt:
        "A person's salary can be impressive while their net worth remains weak. Wealth becomes clearer when you look at assets, liabilities and the value that remains.",
      successReply:
        "Well done. Next, you will discover how much bigger the asset universe really is.",
      points: 5,
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
  title: "Meet the World of Assets",
  description:
    "Discover that wealth can exist across many forms of assets — from cash, bonds and shares to property, businesses, intellectual property and digital assets.",
  objective:
    "The learner will distinguish an individual asset from an asset class and recognise the major categories of assets explored later in the premium pathway.",
  learningOutcomes: [
    "Distinguish an asset from an asset class.",
    "Recognise major conventional asset classes.",
    "Recognise broader asset categories such as intellectual property and digital assets.",
    "Understand that assets can be analysed across several dimensions rather than forced into one rigid box.",
  ],
  estimatedMinutes: 26,
  completionPoints: 45,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: [...suitableAgeGroups],
  prerequisiteLessonIds: [lesson4.id],
  activities: [
    createActivity({
      id: "finance-l5-a1",
      type: "introduction",
      title: "How Many Assets Can You See?",
      teacherPrompt:
        "Cash. A government bond. Shares. A rental house. A private business. Gold. Farmland. A mobile app. A patent. A music copyright. A professional skill. Which of these can have economic value? Potentially all of them — but for very different reasons.",
      explanation:
        "The goal is not to label every valuable thing as an investment. The goal is to recognise the wider asset universe and learn how different assets create value.",
      visualTitle: "The Asset Universe",
      visualDescription:
        "Show cash, fixed income, equities, property, businesses, commodities, infrastructure, intellectual property and digital assets as different branches of one asset universe.",
    }),
    createActivity({
      id: "finance-l5-a2",
      type: "teach",
      title: "Asset vs Asset Class",
      teacherPrompt:
        "An individual asset is a specific resource you own or control. An asset class is a broader group of assets with similar economic characteristics. A specific share is an asset; equities are an asset class. A house is an asset; real estate is an asset class or broader investment category.",
      explanation:
        "Intellectual property and digital assets are important asset categories, but they are not universally treated as standalone conventional investment asset classes in every financial framework.",
    }),
    createActivity({
      id: "finance-l5-a3",
      type: "teach",
      title: "The Major Asset Families",
      teacherPrompt:
        "Traditional financial portfolios often begin with cash and cash equivalents, fixed income, equities, real estate and commodities. A broader asset-literacy view also studies private businesses, infrastructure, intellectual property, royalties, digital assets, contractual rights and productive professional resources.",
      explanation:
        "Different assets can be tangible or intangible, liquid or illiquid, public or private, productive or primarily non-income-producing. An asset can fit several descriptions at once.",
    }),
    createActivity({
      id: "finance-l5-a4",
      type: "multiple-choice",
      title: "Asset or Asset Class?",
      teacherPrompt: "Which pairing is correct?",
      options: [
        { id: "a", label: "A specific rental flat = asset; real estate = broader asset class/category.", value: "correct" },
        { id: "b", label: "Real estate = one specific asset; a rental flat = the entire asset class.", value: "incorrect" },
      ],
      correctOptionId: "a",
      successReply:
        "Correct. The individual resource is the asset; the broader grouping is the asset class or category.",
      retryReply: "Think specific item versus broader family.",
      points: 5,
    }),
    createActivity({
      id: "finance-l5-a5",
      type: "case-study",
      title: "One Asset, Many Characteristics",
      teacherPrompt:
        "A rental property is physical, privately owned, hard to sell quickly, capable of producing rent and may rise or fall in value. Why is it misleading to force it into only one label?",
      acceptedAnswers: [
        "it has multiple characteristics",
        "assets have multiple characteristics",
        "it can fit several categories",
        "more than one classification",
        "different dimensions",
        "multiple dimensions",
      ],
      successReply:
        "Exactly. Good asset analysis looks at several dimensions: what the asset is, how it creates value, how liquid it is, what risks it carries and how returns may arise.",
      hints: ["Think about tangible, private, illiquid, income-producing and potentially appreciating — all at the same time."],
      points: 10,
    }),
    createActivity({
      id: "finance-l5-a6",
      type: "reflection",
      title: "The Question That Changes Everything",
      teacherPrompt:
        "Which is more powerful for long-term thinking: 'What can I buy?' or 'What can I build, own or control that creates lasting economic value?' Explain your answer.",
      hints: ["Think about businesses, software, intellectual property, productive skills and other assets that can sometimes be created rather than simply purchased."],
      points: 10,
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
  title: "Your First Wealth-Building Decision",
  description:
    "Bring the Foundation together in a fictional decision challenge: income, cash flow, debt, saving and assets all compete for the same resources.",
  objective:
    "The learner will use the Foundation concepts to reason through a fictional financial decision and explain the trade-offs involved.",
  learningOutcomes: [
    "Apply income-versus-wealth thinking to a realistic scenario.",
    "Prioritise financial resilience before taking unnecessary risk.",
    "Recognise that asset decisions involve trade-offs.",
    "Explain a financial decision rather than simply choosing an answer.",
  ],
  estimatedMinutes: 28,
  completionPoints: 50,
  deliveryModes: [...deliveryModes],
  suitableAgeGroups: [...suitableAgeGroups],
  prerequisiteLessonIds: [lesson5.id],
  activities: [
    createActivity({
      id: "finance-l6-a1",
      type: "introduction",
      title: "You Have 10,000 FountainCash",
      teacherPrompt:
        "This is a fictional simulation. You have 10,000 FountainCash. You also have a small emergency reserve, no expensive debt, and a long-term goal of building financial independence. Your task is not to chase the highest possible return. Your task is to make a reasoned decision.",
      explanation:
        "No real money is involved. This activity teaches decision-making, risk awareness and trade-offs.",
      visualTitle: "FountainCash Decision Lab",
      visualDescription:
        "Show 10,000 fictional units with possible destinations: emergency reserve, short-term goals, skill development, diversified investments and productive asset creation.",
    }),
    createActivity({
      id: "finance-l6-a2",
      type: "teach",
      title: "The FountainPrep Asset Lens",
      teacherPrompt:
        "Before choosing an asset, ask: What is it? Why does it have value? Where could return come from? What are the risks? How liquid is it? Does it produce cash flow? Can its value grow or fall? What does it cost to own? Could I create it?",
      explanation:
        "These questions help compare very different assets without pretending that one asset is automatically best.",
    }),
    createActivity({
      id: "finance-l6-a3",
      type: "multiple-choice",
      title: "Which Decision Shows Better Reasoning?",
      teacherPrompt: "Which learner is using stronger financial reasoning?",
      options: [
        { id: "a", label: "Learner A puts all 10,000 FountainCash into one unfamiliar high-risk asset because someone online said it will double.", value: "concentrated" },
        { id: "b", label: "Learner B considers emergency needs, time horizon, liquidity, diversification and how each asset could create value before allocating the money.", value: "reasoned" },
      ],
      correctOptionId: "b",
      successReply:
        "Correct. Good financial reasoning begins with goals, resilience, risk, liquidity and diversification — not hype.",
      retryReply: "Choose the learner who asks how the decision fits the whole financial picture.",
      points: 5,
    }),
    createActivity({
      id: "finance-l6-a4",
      type: "case-study",
      title: "Build a Fictional Allocation",
      teacherPrompt:
        "Using 100 points instead of real money, create a fictional allocation across at least three purposes or asset categories. Explain why you did not put everything in one place.",
      acceptedAnswers: [
        "diversification",
        "spread risk",
        "risk is spread",
        "different purposes",
        "liquidity",
        "emergency",
        "time horizon",
        "not all in one",
      ],
      successReply:
        "Good reasoning. A financial plan often needs different resources for different jobs, and diversification can reduce dependence on one outcome.",
      hints: ["You might consider liquidity, short-term security, productive assets and long-term growth — but there is no single required allocation."],
      points: 10,
    }),
    createActivity({
      id: "finance-l6-a5",
      type: "project",
      title: "Build Your First Asset Map",
      teacherPrompt:
        "Create a simple fictional Asset Map with four headings: Assets I understand; Assets people can purchase; Assets people can create; Assets I want to learn more about. Add at least two examples under each heading.",
      hints: [
        "Examples can include cash, bonds, shares, property, businesses, apps, patents, copyrights, equipment or professional skills.",
        "Do not enter real balances unless you voluntarily choose to do so outside this exercise.",
      ],
      points: 15,
    }),
    createActivity({
      id: "finance-l6-a6",
      type: "assessment",
      title: "Foundation Challenge",
      teacherPrompt:
        "Explain the difference between high income and wealth, describe at least three rules of money, define assets and liabilities, state the net-worth formula, and explain the difference between an asset and an asset class.",
      successReply:
        "Excellent. You have completed Financial Foundations. You are now ready to explore the asset classes that can contribute to wealth building and financial independence.",
      points: 15,
    }),
  ],
});

export const moneyFoundationCourse = createCourse({
  id: "money-foundation-course",
  programmeId: "money-foundation",
  stage: "foundation",
  title: "High Income Is Not Wealth",
  description:
    "A compelling introduction to financial literacy: understand the difference between income and wealth, learn the rules of money, control cash flow, calculate net worth and discover the wider world of assets.",
  learningOutcomes: [
    "Distinguish high income from genuine wealth.",
    "Understand the core rules that shape financial outcomes.",
    "Control cash flow through intentional choices.",
    "Understand assets, liabilities and net worth.",
    "Distinguish assets from asset classes.",
    "Recognise the wider asset universe before studying it in depth.",
    "Apply financial reasoning in a fictional wealth-building decision.",
  ],
  estimatedHours: 2.5,
  units: [
    createUnit({
      id: "finance-foundation-unit-1",
      courseId: "money-foundation-course",
      unitNumber: 1,
      title: "From Income to Wealth",
      description:
        "Move beyond salary thinking and learn how money becomes security, assets and long-term financial choice.",
      learningOutcomes: [
        "Explain why income and wealth are different.",
        "Understand the rules behind earning, keeping, protecting and growing money.",
        "Direct cash flow intentionally.",
        "Calculate simple net worth.",
        "Recognise the major families of assets.",
        "Use the FountainPrep Asset Lens to reason about financial decisions.",
      ],
      lessons: [lesson1, lesson2, lesson3, lesson4, lesson5, lesson6],
    }),
  ],
});