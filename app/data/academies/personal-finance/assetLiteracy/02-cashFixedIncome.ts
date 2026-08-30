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

const suitableAgeGroups = [
  "6-9",
  "10-13",
  "14-17",
  "adult",
] as const;

/*
 * ============================================================
 * STAGE 3
 * THE ASSET CLASSES THAT CREATE WEALTH
 * & FINANCIAL INDEPENDENCE
 *
 * Unit 1:
 * The FountainPrep Asset Lens
 * ============================================================
 */

/*
 * ------------------------------------------------------------
 * LESSON 1
 * WHAT IS AN ASSET?
 * ------------------------------------------------------------
 */

const cashFixedIncomeLesson1 =
  createLesson({
    id:
      "asset-literacy-unit-2-lesson-1",

    academy:
      "personal-finance",

    programmeId:
      "asset-literacy",

    courseId:
      "asset-literacy-course",

    unitId:
      "asset-literacy-unit-2",

    stage:
      "advanced",

    lessonNumber:
      5,

    title:
      "Cash Is an Asset Too",

    description:
      "Understand why cash belongs in the asset universe, what makes it useful and why liquidity does not mean risk-free wealth preservation.",

    objective:
      "The learner will explain the role of cash, deposits and cash-equivalent assets and identify their strengths, limitations and major risks.",

    learningOutcomes: [
      "Explain why cash is an asset.",
      "Understand liquidity.",
      "Distinguish physical cash from bank deposits.",
      "Recognise the role of cash equivalents.",
      "Explain inflation risk.",
      "Recognise currency risk.",
    ],

    estimatedMinutes:
      24,

    completionPoints:
      50,

    deliveryModes:
      [...deliveryModes],

    suitableAgeGroups:
      [...suitableAgeGroups],

    prerequisiteLessonIds: [
  "asset-literacy-unit-1-lesson-4",
],

    activities: [
      createActivity({
        id:
          "cash-fi-l1-a1",

        type:
          "introduction",

        title:
          "The Most Familiar Asset",

        teacherPrompt:
          "Cash is often overlooked because it feels ordinary. Yet cash is one of the most important assets in a financial system. It can settle transactions, meet emergencies, provide flexibility and act as a bridge between other financial decisions.",

        explanation:
          "Cash generally offers very high liquidity but may lose purchasing power over time if inflation rises faster than the return earned.",

        visualTitle:
          "What cash does",

        visualDescription:
          "Spend, save, settle, protect, wait and redeploy.",
      }),

      createActivity({
        id:
          "cash-fi-l1-a2",

        type:
          "teach",

        title:
          "Liquidity Is a Financial Capability",

        teacherPrompt:
          "Liquidity describes how readily an asset can generally be converted into spendable money without substantial delay or loss of value. Cash itself is already highly liquid. Property, private businesses and some other assets can take much longer to convert into cash.",

        explanation:
          "Liquidity has value because financial obligations often arrive before long-term assets can conveniently be sold.",
      }),

      createActivity({
        id:
          "cash-fi-l1-a3",

        type:
          "teach",

        title:
          "Cash, Deposits and Cash Equivalents",

        teacherPrompt:
          "Physical notes and coins are cash. Money held in current or savings accounts is a bank deposit. Cash equivalents are short-duration assets designed to preserve liquidity and relatively stable value, although their exact characteristics and risks differ.",

        explanation:
          "Examples can include certain money-market instruments and short-dated government securities. Their treatment depends on structure, jurisdiction and maturity.",
      }),

      createActivity({
        id:
          "cash-fi-l1-a4",

        type:
          "multiple-choice",

        title:
          "Liquidity or Growth?",

        teacherPrompt:
          "Which statement best describes one major strength of cash?",

        options: [
          {
            id:
              "a",

            label:
              "It is generally highly liquid and useful for near-term needs.",

            value:
              "liquid",
          },
          {
            id:
              "b",

            label:
              "It always produces the highest long-term return of every asset class.",

            value:
              "highest-return",
          },
        ],

        correctOptionId:
          "a",

        successReply:
          "Correct. Cash is especially valuable for liquidity and flexibility, not because it necessarily maximises long-term return.",

        retryReply:
          "Think about what makes cash useful when money is needed quickly.",

        points:
          10,
      }),

      createActivity({
        id:
          "cash-fi-l1-a5",

        type:
          "case-study",

        title:
          "The Inflation Problem",

        teacherPrompt:
          "A learner keeps money in cash while prices rise significantly over several years. Explain what could happen to the purchasing power of that cash.",

        acceptedAnswers: [
          "inflation",
          "purchasing power falls",
          "buy less",
          "loses value",
          "real value falls",
          "prices rise",
        ],

        successReply:
          "Correct. Even when the number of pounds stays the same, inflation can reduce what those pounds can buy.",

        hints: [
          "Think about the difference between the amount of money and what that money can purchase.",
        ],

        points:
          15,
      }),

      createActivity({
        id:
          "cash-fi-l1-a6",

        type:
          "review",

        title:
          "Cash Has a Job",

        teacherPrompt:
          "Cash is not automatically good or bad. Its usefulness depends on the job it is meant to perform: emergency liquidity, planned spending, optionality or temporary capital awaiting another use.",

        successReply:
          "Good. Next, you will see how lending money can itself become an investment asset.",

        points:
          10,
      }),
    ],
  });

const cashFixedIncomeLesson2 =
  createLesson({
    id:
      "asset-literacy-unit-2-lesson-2",

    academy:
      "personal-finance",

    programmeId:
      "asset-literacy",

    courseId:
      "asset-literacy-course",

    unitId:
      "asset-literacy-unit-2",

    stage:
      "advanced",

    lessonNumber:
      6,

    title:
      "How Lending Becomes an Investment",

    description:
      "Understand how fixed-income assets are often created when investors lend money to governments, companies or other issuers.",

    objective:
      "The learner will explain the basic economic relationship between lender, borrower, principal, interest and repayment.",

    learningOutcomes: [
      "Understand lending as an investment relationship.",
      "Distinguish lender from borrower.",
      "Define principal.",
      "Understand interest payments.",
      "Recognise government and corporate borrowing.",
      "Distinguish debt ownership from equity ownership.",
    ],

    estimatedMinutes:
      25,

    completionPoints:
      55,

    deliveryModes:
      [...deliveryModes],

    suitableAgeGroups:
      [...suitableAgeGroups],

    prerequisiteLessonIds: [
      cashFixedIncomeLesson1.id,
    ],

    activities: [
      createActivity({
        id:
          "cash-fi-l2-a1",

        type:
          "introduction",

        title:
          "You Can Own a Loan",

        teacherPrompt:
          "When a government or company needs capital, it may borrow rather than sell ownership. Investors who provide that money can receive debt securities representing the borrower's obligation to repay under agreed terms.",

        explanation:
          "Fixed income is fundamentally different from equity. A bondholder is generally a creditor, not an owner of the business.",
      }),

      createActivity({
        id:
          "cash-fi-l2-a2",

        type:
          "teach",

        title:
          "Principal and Interest",

        teacherPrompt:
          "The principal is the amount borrowed. Interest is compensation the borrower may pay for using the lender's money. The exact payment structure depends on the instrument.",

        explanation:
          "Some debt instruments make regular interest payments. Others may be issued at a discount and repay a larger amount at maturity.",
      }),

      createActivity({
        id:
          "cash-fi-l2-a3",

        type:
          "teach",

        title:
          "Governments Borrow Too",

        teacherPrompt:
          "Governments issue debt to finance spending, manage cash flows and fund public activity. Short-term government debt may include Treasury bills, while longer-term borrowing often takes the form of government bonds.",

        explanation:
          "Government debt is not automatically risk-free. Risk differs by issuer, currency, maturity and economic conditions.",
      }),

      createActivity({
        id:
          "cash-fi-l2-a4",

        type:
          "multiple-choice",

        title:
          "Owner or Lender?",

        teacherPrompt:
          "You buy a corporate bond issued by a company. What is your primary economic relationship with the company?",

        options: [
          {
            id:
              "a",

            label:
              "You are generally lending money to the company under contractual terms.",

            value:
              "lender",
          },
          {
            id:
              "b",

            label:
              "You automatically become an ordinary shareholder and co-owner.",

            value:
              "owner",
          },
        ],

        correctOptionId:
          "a",

        successReply:
          "Correct. Bondholders are generally creditors. Shareholders hold equity ownership.",

        retryReply:
          "Think about whether a bond represents ownership or borrowing.",

        points:
          10,
      }),

      createActivity({
        id:
          "cash-fi-l2-a5",

        type:
          "case-study",

        title:
          "Why Would a Company Borrow?",

        teacherPrompt:
          "A profitable company wants to build a new factory but does not want to issue additional shares. Explain one reason it might issue bonds instead.",

        acceptedAnswers: [
          "borrow",
          "raise capital",
          "finance factory",
          "avoid dilution",
          "keep ownership",
          "debt",
          "fund expansion",
        ],

        successReply:
          "Correct. Debt can provide capital without issuing new equity, although it creates repayment obligations and financial risk.",

        hints: [
          "Think about the difference between borrowing capital and selling ownership.",
        ],

        points:
          15,
      }),

      createActivity({
        id:
          "cash-fi-l2-a6",

        type:
          "review",

        title:
          "Debt Is Someone Else's Asset",

        teacherPrompt:
          "A borrower's debt can be an investor's asset. The borrower receives capital today and promises future payments. The investor owns the contractual claim.",

        successReply:
          "Next, you will learn the vocabulary used to describe bonds: principal, coupon, maturity and yield.",

        points:
          10,
      }),
    ],
  });

const cashFixedIncomeLesson3 =
  createLesson({
    id:
      "asset-literacy-unit-2-lesson-3",

    academy:
      "personal-finance",

    programmeId:
      "asset-literacy",

    courseId:
      "asset-literacy-course",

    unitId:
      "asset-literacy-unit-2",

    stage:
      "advanced",

    lessonNumber:
      7,

    title:
      "Bonds: Principal, Coupon, Yield & Maturity",

    description:
      "Learn the core language used to understand bonds and why coupon, price and yield are related but not identical.",

    objective:
      "The learner will define principal, coupon, maturity and yield and use them to interpret a simple bond example.",

    learningOutcomes: [
      "Define principal or face value.",
      "Define coupon.",
      "Define maturity.",
      "Understand introductory yield concepts.",
      "Recognise that bond price and yield can change.",
      "Understand that coupon and yield are not always the same.",
    ],

    estimatedMinutes:
      30,

    completionPoints:
      65,

    deliveryModes:
      [...deliveryModes],

    suitableAgeGroups:
      [...suitableAgeGroups],

    prerequisiteLessonIds: [
      cashFixedIncomeLesson2.id,
    ],

    activities: [
      createActivity({
        id:
          "cash-fi-l3-a1",

        type:
          "introduction",

        title:
          "Read the Contract",

        teacherPrompt:
          "A bond can look complicated until you break it into a few key terms: how much is owed, what payments may be made, when repayment is due and what return the market price implies.",

        explanation:
          "Understanding the contract is the first step before considering the market value of the bond.",
      }),

      createActivity({
        id:
          "cash-fi-l3-a2",

        type:
          "teach",

        title:
          "Principal",

        teacherPrompt:
          "Principal, sometimes called face value or par value, is the amount associated with the debt obligation that is generally due to be repaid according to the bond's terms.",

        explanation:
          "Market price can be above or below face value, so the amount you pay for a bond is not always identical to its principal.",
      }),

      createActivity({
        id:
          "cash-fi-l3-a3",

        type:
          "teach",

        title:
          "Coupon",

        teacherPrompt:
          "A coupon is the contractual interest payment associated with many bonds. A fixed-rate bond may pay a stated coupon based on its face value.",

        explanation:
          "The coupon rate is set by the bond terms. The investor's actual yield can differ if the bond is bought above or below face value.",
      }),

      createActivity({
        id:
          "cash-fi-l3-a4",

        type:
          "teach",

        title:
          "Maturity",

        teacherPrompt:
          "Maturity is the date on which the bond reaches the end of its contractual term and principal is generally due for repayment, assuming the issuer can meet its obligations.",

        explanation:
          "Shorter and longer maturities can behave differently when interest rates and market conditions change.",
      }),

      createActivity({
        id:
          "cash-fi-l3-a5",

        type:
          "teach",

        title:
          "Yield",

        teacherPrompt:
          "Yield describes return relative to the bond's price and expected payments. If a bond's market price changes, its yield can change even though its contractual coupon remains the same.",

        explanation:
          "There are several yield measures in professional fixed-income analysis. At Foundation level, the key idea is that market price affects the return available to a buyer.",
      }),

      createActivity({
        id:
          "cash-fi-l3-a6",

        type:
          "multiple-choice",

        title:
          "Coupon vs Yield",

        teacherPrompt:
          "Which statement is most accurate?",

        options: [
          {
            id:
              "a",

            label:
              "Coupon is a contractual payment feature; yield reflects return relative to price and payments.",

            value:
              "correct",
          },
          {
            id:
              "b",

            label:
              "Coupon and yield must always be identical regardless of market price.",

            value:
              "same",
          },
        ],

        correctOptionId:
          "a",

        successReply:
          "Correct. Coupon describes the bond's payment terms, while yield depends partly on the price paid.",

        retryReply:
          "Think about what happens if a bond trades above or below its face value.",

        points:
          10,
      }),

      createActivity({
        id:
          "cash-fi-l3-a7",

        type:
          "review",

        title:
          "Speak Bond",

        teacherPrompt:
          "Principal tells you the contractual amount owed. Coupon describes interest payments. Maturity tells you when the term ends. Yield helps describe return relative to price and payments.",

        successReply:
          "You now have the vocabulary. Next, we will examine what can go wrong.",

        points:
          10,
      }),
    ],
  });

const cashFixedIncomeLesson4 =
  createLesson({
    id:
      "asset-literacy-unit-2-lesson-4",

    academy:
      "personal-finance",

    programmeId:
      "asset-literacy",

    courseId:
      "asset-literacy-course",

    unitId:
      "asset-literacy-unit-2",

    stage:
      "advanced",

    lessonNumber:
      8,

    title:
      "What Makes Fixed Income Risky?",

    description:
      "Understand that fixed income carries several distinct risks including default, interest-rate, inflation, currency and liquidity risk.",

    objective:
      "The learner will identify major fixed-income risks and explain why the word 'fixed' does not mean the investment has no risk.",

    learningOutcomes: [
      "Understand credit risk.",
      "Understand default risk.",
      "Understand interest-rate risk.",
      "Understand inflation risk.",
      "Understand currency risk.",
      "Recognise liquidity risk.",
      "Understand why yields differ across issuers.",
    ],

    estimatedMinutes:
      30,

    completionPoints:
      65,

    deliveryModes:
      [...deliveryModes],

    suitableAgeGroups:
      [...suitableAgeGroups],

    prerequisiteLessonIds: [
      cashFixedIncomeLesson3.id,
    ],

    activities: [
      createActivity({
        id:
          "cash-fi-l4-a1",

        type:
          "introduction",

        title:
          "Fixed Does Not Mean Risk-Free",

        teacherPrompt:
          "The phrase fixed income can sound safe because some payments may be contractually fixed. But the investor still faces important questions: Will the issuer pay? What happens if market interest rates change? What if inflation rises? Can the bond be sold easily?",

        explanation:
          "Risk depends on the issuer, bond structure, currency, maturity, market and investor circumstances.",
      }),

      createActivity({
        id:
          "cash-fi-l4-a2",

        type:
          "teach",

        title:
          "Credit and Default Risk",

        teacherPrompt:
          "Credit risk is the risk that the borrower's financial condition deteriorates. Default risk is the possibility that required payments are not made according to the contract.",

        explanation:
          "Investors often demand higher potential yields from borrowers perceived as less creditworthy.",
      }),

      createActivity({
        id:
          "cash-fi-l4-a3",

        type:
          "teach",

        title:
          "Interest-Rate Risk",

        teacherPrompt:
          "When market interest rates rise, existing fixed-rate bonds can become less attractive because newly issued bonds may offer higher rates. This can push the market price of existing bonds lower.",

        explanation:
          "Bond prices and market yields often move in opposite directions. Longer-maturity bonds can be particularly sensitive to interest-rate changes.",
      }),

      createActivity({
        id:
          "cash-fi-l4-a4",

        type:
          "teach",

        title:
          "Inflation and Real Return",

        teacherPrompt:
          "A bond may pay exactly what was promised, yet inflation can reduce the purchasing power of those payments. What matters economically is not only nominal return but also what the money can buy.",

        explanation:
          "Real return considers purchasing power after inflation.",
      }),

      createActivity({
        id:
          "cash-fi-l4-a5",

        type:
          "teach",

        title:
          "Currency and Liquidity Risk",

        teacherPrompt:
          "If an investor owns a bond denominated in another currency, exchange-rate movements can change the investor's home-currency return. Some bonds may also be harder to sell quickly at a fair price.",

        explanation:
          "The same security can therefore expose an investor to several risks simultaneously.",
      }),

      createActivity({
        id:
          "cash-fi-l4-a6",

        type:
          "case-study",

        title:
          "Why Is the Yield Higher?",

        teacherPrompt:
          "Company A is financially strong and pays a relatively low yield. Company B is highly indebted and must offer a much higher yield to attract lenders. Why might investors demand the higher yield?",

        acceptedAnswers: [
          "risk",
          "credit risk",
          "default risk",
          "higher risk",
          "compensation",
          "less creditworthy",
          "debt",
        ],

        successReply:
          "Correct. Higher potential yield can reflect greater perceived risk. Yield should never be evaluated without understanding why it is high.",

        hints: [
          "Ask what investors may be worried could go wrong.",
        ],

        points:
          20,
      }),

      createActivity({
        id:
          "cash-fi-l4-a7",

        type:
          "review",

        title:
          "Ask Why the Yield Exists",

        teacherPrompt:
          "A high yield is not automatically a bargain. It may compensate investors for credit, interest-rate, inflation, liquidity, currency or other risks.",

        successReply:
          "Excellent. Next, you will compare different cash and fixed-income assets using the Asset Lens.",

        points:
          10,
      }),
    ],
  });

const cashFixedIncomeLesson5 =
  createLesson({
    id:
      "asset-literacy-unit-2-lesson-5",

    academy:
      "personal-finance",

    programmeId:
      "asset-literacy",

    courseId:
      "asset-literacy-course",

    unitId:
      "asset-literacy-unit-2",

    stage:
      "advanced",

    lessonNumber:
      9,

    title:
      "Compare Cash, T-Bills and Bonds",

    description:
      "Bring the unit together by comparing several cash and fixed-income assets through liquidity, maturity, return source and risk.",

    objective:
      "The learner will apply the FountainPrep Asset Lens to compare cash, Treasury bills and longer-term bonds.",

    learningOutcomes: [
      "Compare cash and fixed income.",
      "Compare short-term and longer-term debt.",
      "Analyse liquidity.",
      "Analyse return sources.",
      "Analyse credit and interest-rate risk.",
      "Explain why one asset is not universally best.",
    ],

    estimatedMinutes:
      30,

    completionPoints:
      70,

    deliveryModes:
      [...deliveryModes],

    suitableAgeGroups:
      [...suitableAgeGroups],

    prerequisiteLessonIds: [
      cashFixedIncomeLesson4.id,
    ],

    activities: [
      createActivity({
        id:
          "cash-fi-l5-a1",

        type:
          "introduction",

        title:
          "Three Assets. Three Jobs.",

        teacherPrompt:
          "Imagine three fictional choices: money in an accessible savings account, a short-term Treasury bill and a ten-year government bond. All may belong within the broad cash and fixed-income universe, but they do different jobs and expose the investor to different risks.",

        explanation:
          "Asset selection begins with purpose, characteristics and risk rather than asking which asset is universally best.",
      }),

      createActivity({
        id:
          "cash-fi-l5-a2",

        type:
          "teach",

        title:
          "Cash",

        teacherPrompt:
          "Cash generally offers maximum liquidity and flexibility. Its main limitations can include low return and loss of purchasing power from inflation.",

        explanation:
          "Cash can be strategically valuable even when another asset offers a higher expected return.",
      }),

      createActivity({
        id:
          "cash-fi-l5-a3",

        type:
          "teach",

        title:
          "Treasury Bills",

        teacherPrompt:
          "Treasury bills are short-term government debt instruments. Depending on the market, they may be issued at a discount and mature at a stated value rather than paying a traditional coupon.",

        explanation:
          "Their short maturity often means lower interest-rate sensitivity than long-duration bonds, although issuer, currency and inflation risks still matter.",
      }),

      createActivity({
        id:
          "cash-fi-l5-a4",

        type:
          "teach",

        title:
          "Longer-Term Bonds",

        teacherPrompt:
          "Longer-term bonds can provide contractual income over a longer period but may experience greater price sensitivity when interest rates change.",

        explanation:
          "Maturity is therefore an important part of risk analysis.",
      }),

      createActivity({
        id:
          "cash-fi-l5-a5",

        type:
          "case-study",

        title:
          "Emergency Fund or Ten-Year Bond?",

        teacherPrompt:
          "A fictional learner expects to need the money for an emergency within the next few months. Explain why maximum expected return may not be the only consideration when choosing where to hold the money.",

        acceptedAnswers: [
          "liquidity",
          "emergency",
          "need money",
          "access",
          "time horizon",
          "risk",
          "price",
          "short term",
        ],

        successReply:
          "Correct. The purpose and time horizon of the money matter. Liquidity can be more important than chasing additional return for near-term needs.",

        hints: [
          "Ask how quickly the learner may need access to the money.",
        ],

        points:
          20,
      }),

      createActivity({
        id:
          "cash-fi-l5-a6",

        type:
          "assessment",

        title:
          "Fixed-Income Asset Lens Challenge",

        teacherPrompt:
          "Compare a savings deposit, a Treasury bill and a corporate bond. Explain how each differs in liquidity, maturity, potential return source and at least one major risk.",

        successReply:
          "Excellent. You can now analyse cash and fixed-income assets rather than treating every interest-paying asset as identical. Next, you will move from lending to ownership: Equity & Business Ownership.",

        points:
          25,
      }),
    ],
  });


export const cashFixedIncomeUnit =
  createUnit({
    id:
      "asset-literacy-unit-2",

    courseId:
      "asset-literacy-course",

    unitNumber:
      2,

    title:
      "Cash & Fixed-Income Assets",

    description:
      "Understand cash, deposits, money-market instruments, Treasury securities, government bonds and corporate debt through the FountainPrep Asset Lens.",

    learningOutcomes: [
      "Explain the role of cash and liquidity.",
      "Understand how lending creates financial assets.",
      "Define principal, coupon, maturity and yield.",
      "Distinguish debt ownership from equity ownership.",
      "Recognise credit and default risk.",
      "Understand interest-rate and inflation risk.",
      "Compare cash, Treasury bills and bonds.",
    ],

    lessons: [
      cashFixedIncomeLesson1,
      cashFixedIncomeLesson2,
      cashFixedIncomeLesson3,
      cashFixedIncomeLesson4,
      cashFixedIncomeLesson5,
    ],
  });
