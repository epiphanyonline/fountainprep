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

const assetLensLesson1 =
  createLesson({
    id:
      "asset-literacy-unit-1-lesson-1",

    academy:
      "personal-finance",

    programmeId:
      "asset-literacy",

    courseId:
      "asset-literacy-course",

    unitId:
      "asset-literacy-unit-1",

    stage:
      "advanced",

    lessonNumber:
      1,

    title:
      "What Is an Asset?",

    description:
      "Build a precise understanding of what an asset is, why assets can have economic value and why not every valuable possession behaves in the same way.",

    objective:
      "The learner will define an asset, identify several sources of economic value and distinguish an asset from income, consumption and ordinary possessions.",

    learningOutcomes: [
      "Define an asset in practical economic terms.",
      "Explain why assets can have economic value.",
      "Recognise that assets may be physical, financial, contractual or intangible.",
      "Distinguish assets from income and consumption.",
      "Recognise that owning an asset does not guarantee profit.",
    ],

    estimatedMinutes:
      24,

    completionPoints:
      50,

    deliveryModes:
      [...deliveryModes],

    suitableAgeGroups:
      [...suitableAgeGroups],

    activities: [
      createActivity({
        id:
          "asset-lens-l1-a1",

        type:
          "introduction",

        title:
          "Look Around You",

        teacherPrompt:
          "Imagine a bank account, a government bond, shares in a company, a rental property, a private business, farmland, a mobile application, a patent and a music copyright. They look very different, yet each can potentially hold economic value. Asset literacy begins by understanding what makes something economically valuable rather than memorising a short list of investments.",

        explanation:
          "An asset is generally a resource that a person, business or organisation owns or controls and from which economic benefit may reasonably be expected. The form of that benefit varies greatly.",

        visualTitle:
          "One word. Many forms.",

        visualDescription:
          "Show cash, bonds, shares, property, a business, land, software and intellectual property as different examples inside one broad asset universe.",
      }),

      createActivity({
        id:
          "asset-lens-l1-a2",

        type:
          "teach",

        title:
          "Where Can Economic Value Come From?",

        teacherPrompt:
          "An asset may be valuable for different reasons. It may produce income. It may represent ownership. It may provide a useful service. It may give the holder a legal or contractual right. It may be scarce. It may become more valuable if demand grows. Some assets combine several of these characteristics.",

        explanation:
          "Economic value does not come from one universal source. Understanding the mechanism behind an asset's value is more useful than simply knowing its name.",

        visualTitle:
          "Possible sources of value",

        visualDescription:
          "Income, ownership, productive usefulness, contractual rights, scarcity, demand and potential appreciation.",
      }),

      createActivity({
        id:
          "asset-lens-l1-a3",

        type:
          "teach",

        title:
          "An Asset Is Not the Same as Income",

        teacherPrompt:
          "Income is a flow received during a period. An asset is a resource or right that exists at a point in time. A salary is income. Shares owned by the employee are assets. Rental income is income. The property producing that rent is an asset.",

        explanation:
          "Separating flows from stocks is fundamental in finance. Income may help someone acquire assets, while assets may themselves produce income.",

        visualTitle:
          "Flow versus position",

        visualDescription:
          "Income flows in over time. Assets sit on the financial balance sheet and may create future benefits.",
      }),

      createActivity({
        id:
          "asset-lens-l1-a4",

        type:
          "multiple-choice",

        title:
          "Which One Is the Asset?",

        teacherPrompt:
          "A learner owns shares in a company and receives a dividend from those shares. Which statement is most accurate?",

        options: [
          {
            id:
              "a",

            label:
              "The shares are the asset; the dividend is income generated from ownership.",

            value:
              "correct",
          },
          {
            id:
              "b",

            label:
              "The dividend is the asset and the shares are income.",

            value:
              "reversed",
          },
          {
            id:
              "c",

            label:
              "Neither the shares nor the dividend has economic relevance.",

            value:
              "neither",
          },
        ],

        correctOptionId:
          "a",

        successReply:
          "Correct. The shares represent ownership and are the asset. A dividend is a possible cash flow arising from that ownership.",

        retryReply:
          "Separate the resource that is owned from the money that may flow from it.",

        points:
          10,
      }),

      createActivity({
        id:
          "asset-lens-l1-a5",

        type:
          "case-study",

        title:
          "A Valuable App",

        teacherPrompt:
          "A small company owns a mobile application used by thousands of paying customers. The app has no building, farmland or physical inventory. Explain why the application could still be an asset.",

        acceptedAnswers: [
          "income",
          "customers",
          "revenue",
          "software",
          "economic value",
          "future benefit",
          "intangible",
          "productive",
          "rights",
        ],

        successReply:
          "Exactly. An asset does not have to be physical. Software can create economic benefits through subscriptions, licences, data, customer relationships or other commercial uses.",

        hints: [
          "Ask whether something can create future economic benefit even when you cannot physically touch it.",
        ],

        points:
          15,
      }),

      createActivity({
        id:
          "asset-lens-l1-a6",

        type:
          "review",

        title:
          "Asset Thinking Begins Here",

        teacherPrompt:
          "An asset is not simply something expensive. Asset thinking asks what resource or right exists, why it has economic value and what future benefit could reasonably come from owning or controlling it.",

        successReply:
          "Strong start. Next, you will separate an individual asset from the larger asset class or category it belongs to.",

        points:
          10,
      }),
    ],
  });

/*
 * ------------------------------------------------------------
 * LESSON 2
 * ASSET VS ASSET CLASS
 * ------------------------------------------------------------
 */

const assetLensLesson2 =
  createLesson({
    id:
      "asset-literacy-unit-1-lesson-2",

    academy:
      "personal-finance",

    programmeId:
      "asset-literacy",

    courseId:
      "asset-literacy-course",

    unitId:
      "asset-literacy-unit-1",

    stage:
      "advanced",

    lessonNumber:
      2,

    title:
      "Asset vs Asset Class",

    description:
      "Learn the difference between a specific asset and the broader family of assets with similar economic characteristics.",

    objective:
      "The learner will distinguish individual assets from asset classes and explain why classifications are useful without assuming every asset fits perfectly into one category.",

    learningOutcomes: [
      "Define an individual asset.",
      "Define an asset class or broader asset category.",
      "Correctly classify common examples.",
      "Understand why classification helps comparison.",
      "Recognise that some assets have characteristics of several categories.",
    ],

    estimatedMinutes:
      22,

    completionPoints:
      50,

    deliveryModes:
      [...deliveryModes],

    suitableAgeGroups:
      [...suitableAgeGroups],

    prerequisiteLessonIds: [
      assetLensLesson1.id,
    ],

    activities: [
      createActivity({
        id:
          "asset-lens-l2-a1",

        type:
          "introduction",

        title:
          "The House Is Not Real Estate",

        teacherPrompt:
          "A specific rental flat is an asset. Real estate is the broader category. One Microsoft shareholding is an asset. Equities are the broader asset class. A particular UK government bond is an asset. Fixed income is the broader family.",

        explanation:
          "Confusing an individual asset with its asset class makes financial analysis less precise.",

        visualTitle:
          "Specific asset â†’ broader class",

        visualDescription:
          "Rental flat â†’ Real Estate. Company shares â†’ Equities. Government bond â†’ Fixed Income. Gold bar â†’ Commodities or Precious Metals.",
      }),

      createActivity({
        id:
          "asset-lens-l2-a2",

        type:
          "teach",

        title:
          "Why Asset Classes Matter",

        teacherPrompt:
          "Asset classes help investors and analysts organise thousands of different assets into understandable groups. Assets within a class may share characteristics such as how returns arise, how liquid they are, how they are priced or which risks affect them.",

        explanation:
          "Classification is a tool for thinking. It does not eliminate the need to analyse the individual asset.",

        visualTitle:
          "Classification helps comparison",

        visualDescription:
          "Group assets by economic characteristics, then analyse each individual asset on its own merits.",
      }),

      createActivity({
        id:
          "asset-lens-l2-a3",

        type:
          "multiple-choice",

        title:
          "Asset or Asset Class?",

        teacherPrompt:
          "Which pairing is most accurate?",

        options: [
          {
            id:
              "a",

            label:
              "A specific rental property = asset; real estate = broader asset class or category.",

            value:
              "correct",
          },
          {
            id:
              "b",

            label:
              "Real estate = one individual asset; a rental property = an asset class.",

            value:
              "reversed",
          },
          {
            id:
              "c",

            label:
              "Asset and asset class always mean exactly the same thing.",

            value:
              "same",
          },
        ],

        correctOptionId:
          "a",

        successReply:
          "Correct. The individual property is the asset. Real estate is the broader category used to organise similar assets.",

        retryReply:
          "Ask which item is individually owned and which term describes the wider family.",

        points:
          10,
      }),

      createActivity({
        id:
          "asset-lens-l2-a4",

        type:
          "case-study",

        title:
          "Where Does a Private Business Fit?",

        teacherPrompt:
          "A learner owns 40% of a privately held manufacturing business. Is the learner's ownership stake an asset? What broader category could describe it?",

        acceptedAnswers: [
          "asset",
          "equity",
          "private equity",
          "business ownership",
          "private business",
          "ownership",
        ],

        successReply:
          "Correct. The ownership stake is an asset. It can broadly be understood as private business equity or private ownership, although the individual business still requires its own analysis.",

        hints: [
          "Think about whether the learner owns an economic interest in the business.",
        ],

        points:
          15,
      }),

      createActivity({
        id:
          "asset-lens-l2-a5",

        type:
          "teach",

        title:
          "Classification Is Not a Prison",

        teacherPrompt:
          "A single asset can have several characteristics at once. A rental building is physical, real, private, relatively illiquid and potentially income-producing. A patent is intangible, private, legally protected and potentially royalty-producing. Good analysis does not force either asset into only one descriptive box.",

        explanation:
          "The FountainPrep Asset Lens uses several dimensions simultaneously because a single label rarely tells the whole story.",

        visualTitle:
          "One asset. Many characteristics.",

        visualDescription:
          "Show one asset surrounded by several dimensions: physical or intangible, public or private, liquid or illiquid, productive or non-productive, income-producing or not.",
      }),

      createActivity({
        id:
          "asset-lens-l2-a6",

        type:
          "review",

        title:
          "Use Categories, Then Go Deeper",

        teacherPrompt:
          "An asset class helps organise the asset universe. But serious financial thinking begins after classification: understand the individual asset, how value is created, how returns could arise and what could go wrong.",

        successReply:
          "Well done. Next, you will learn the dimensions that make two assets economically different even when both are called assets.",

        points:
          10,
      }),
    ],
  });

/*
 * ------------------------------------------------------------
 * LESSON 3
 * THE DIMENSIONS OF AN ASSET
 * ------------------------------------------------------------
 */

const assetLensLesson3 =
  createLesson({
    id:
      "asset-literacy-unit-1-lesson-3",

    academy:
      "personal-finance",

    programmeId:
      "asset-literacy",

    courseId:
      "asset-literacy-course",

    unitId:
      "asset-literacy-unit-1",

    stage:
      "advanced",

    lessonNumber:
      3,

    title:
      "The Dimensions of an Asset",

    description:
      "Learn to analyse assets across multiple dimensions including tangibility, liquidity, ownership, productivity, income generation and market access.",

    objective:
      "The learner will compare assets using several economic dimensions rather than relying on one simplistic label.",

    learningOutcomes: [
      "Compare tangible and intangible assets.",
      "Compare financial and real assets.",
      "Compare productive and primarily non-income-producing assets.",
      "Compare liquid and illiquid assets.",
      "Compare public and private assets.",
      "Recognise that several dimensions can apply simultaneously.",
    ],

    estimatedMinutes:
      26,

    completionPoints:
      60,

    deliveryModes:
      [...deliveryModes],

    suitableAgeGroups:
      [...suitableAgeGroups],

    prerequisiteLessonIds: [
      assetLensLesson2.id,
    ],

    activities: [
      createActivity({
        id:
          "asset-lens-l3-a1",

        type:
          "introduction",

        title:
          "Two Assets Can Behave Very Differently",

        teacherPrompt:
          "Consider Â£10,000 held in a savings account and Â£10,000 of value in a privately owned small business. Both may be assets, but they behave very differently. One may be quickly accessible and easy to value. The other may be difficult to sell, uncertain in value and capable of producing business profits.",

        explanation:
          "The word asset tells us that something has economic value. It does not tell us everything about how that asset behaves.",

        visualTitle:
          "Same value. Different characteristics.",

        visualDescription:
          "Compare a savings balance with private business ownership across liquidity, valuation, risk, control and potential return.",
      }),

      createActivity({
        id:
          "asset-lens-l3-a2",

        type:
          "teach",

        title:
          "Tangible vs Intangible",

        teacherPrompt:
          "Tangible assets have physical form: property, machinery, gold or farmland. Intangible assets do not depend on physical form: patents, trademarks, software rights, licences and copyrights can all carry economic value.",

        explanation:
          "Intangible does not mean imaginary or worthless. Modern economies contain enormously valuable intangible assets.",

        visualTitle:
          "Physical form is only one dimension",

        visualDescription:
          "Tangible: building, machinery, land, gold. Intangible: software, copyright, patent, trademark, licence.",
      }),

      createActivity({
        id:
          "asset-lens-l3-a3",

        type:
          "teach",

        title:
          "Financial Assets vs Real Assets",

        teacherPrompt:
          "Financial assets often represent contractual claims or ownership interests, such as shares and bonds. Real assets are connected more directly to physical or productive resources such as property, land, infrastructure or commodities.",

        explanation:
          "The distinction is useful but not always sufficient on its own. A listed property company, for example, is a financial security whose underlying business owns real assets.",

        visualTitle:
          "Claim versus underlying resource",

        visualDescription:
          "Financial assets: shares, bonds and certain contractual claims. Real assets: property, infrastructure, commodities and productive land.",
      }),

      createActivity({
        id:
          "asset-lens-l3-a4",

        type:
          "teach",

        title:
          "Productive vs Primarily Non-Income-Producing",

        teacherPrompt:
          "A productive asset can contribute to creating goods, services or cash flow. A business, rental property or piece of productive equipment may do this. Other assets, such as a collectible, may depend mainly on someone later being willing to pay more for it.",

        explanation:
          "This does not mean every productive asset succeeds or every collectible performs badly. The distinction helps identify where economic return may come from.",

        visualTitle:
          "What is the asset doing?",

        visualDescription:
          "Producing goods, services or cash flow versus relying primarily on scarcity and resale value.",
      }),

      createActivity({
        id:
          "asset-lens-l3-a5",

        type:
          "multiple-choice",

        title:
          "Which Asset Is More Liquid?",

        teacherPrompt:
          "Which asset would generally be considered more liquid?",

        options: [
          {
            id:
              "a",

            label:
              "Cash held in an accessible bank account.",

            value:
              "cash",
          },
          {
            id:
              "b",

            label:
              "A privately owned warehouse that may take months to sell.",

            value:
              "warehouse",
          },
        ],

        correctOptionId:
          "a",

        successReply:
          "Correct. Liquidity describes how readily an asset can generally be converted into spendable money without substantial delay or loss of value.",

        retryReply:
          "Think about which asset can normally be accessed or sold more quickly.",

        points:
          10,
      }),

      createActivity({
        id:
          "asset-lens-l3-a6",

        type:
          "case-study",

        title:
          "Describe the Rental Property",

        teacherPrompt:
          "A person privately owns a residential rental property. Describe at least three characteristics of this asset using the dimensions you have learned.",

        acceptedAnswers: [
          "tangible",
          "real asset",
          "illiquid",
          "private",
          "income",
          "rent",
          "productive",
          "physical",
          "property",
        ],

        successReply:
          "Good analysis. A rental property can simultaneously be tangible, a real asset, privately owned, relatively illiquid and potentially income-producing.",

        hints: [
          "Think about physical form, ownership, liquidity and whether it can produce cash flow.",
        ],

        points:
          20,
      }),

      createActivity({
        id:
          "asset-lens-l3-a7",

        type:
          "review",

        title:
          "Assets Have Profiles",

        teacherPrompt:
          "Instead of asking only 'What asset class is this?', ask how the asset behaves. Is it tangible or intangible? Financial or real? Liquid or illiquid? Public or private? Productive? Income-producing? Appreciating or potentially depreciating?",

        successReply:
          "Excellent. You now have the dimensions. The final lesson in this unit will combine them into one repeatable analysis framework.",

        points:
          10,
      }),
    ],
  });

/*
 * ------------------------------------------------------------
 * LESSON 4
 * ANALYSE ANY ASSET
 * ------------------------------------------------------------
 */

const assetLensLesson4 =
  createLesson({
    id:
      "asset-literacy-unit-1-lesson-4",

    academy:
      "personal-finance",

    programmeId:
      "asset-literacy",

    courseId:
      "asset-literacy-course",

    unitId:
      "asset-literacy-unit-1",

    stage:
      "advanced",

    lessonNumber:
      4,

    title:
      "Analyse Any Asset",

    description:
      "Combine the dimensions into the FountainPrep Asset Lens â€” a repeatable framework for understanding unfamiliar assets before thinking about whether they are attractive investments.",

    objective:
      "The learner will use the FountainPrep Asset Lens to analyse an unfamiliar asset by examining value, return, risk, liquidity, ownership rights, costs and the possibility of creation or control.",

    learningOutcomes: [
      "Apply the FountainPrep Asset Lens.",
      "Identify why an asset may have value.",
      "Identify possible sources of return.",
      "Identify major risks.",
      "Assess liquidity.",
      "Understand the rights attached to ownership or control.",
      "Recognise costs of ownership.",
      "Consider whether an asset can be purchased, created, licensed or partially owned.",
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
      assetLensLesson3.id,
    ],

    activities: [
      createActivity({
        id:
          "asset-lens-l4-a1",

        type:
          "introduction",

        title:
          "The FountainPrep Asset Lens",

        teacherPrompt:
          "When you meet an unfamiliar asset, do not begin with 'Should I buy it?' Begin with understanding. What is it? Why does it have value? Where could return come from? What are the risks? How liquid is it? What rights do I actually own? What does it cost to hold? Could I create, license or partially own it?",

        explanation:
          "Good financial decisions begin with analysis before judgement.",

        visualTitle:
          "Eight questions before the decision",

        visualDescription:
          "What is it? Why valuable? Return source? Risks? Liquidity? Rights? Ownership cost? Buy, build, license or control?",
      }),

      createActivity({
        id:
          "asset-lens-l4-a2",

        type:
          "teach",

        title:
          "1 â€” What Is It?",

        teacherPrompt:
          "Start by describing the asset itself. Is it a security, property, business interest, commodity, contractual right, intellectual property, digital resource or productive equipment? What exactly is being owned or controlled?",

        explanation:
          "A vague understanding of the asset produces vague analysis. Define the economic resource first.",
      }),

      createActivity({
        id:
          "asset-lens-l4-a3",

        type:
          "teach",

        title:
          "2 â€” Why Does It Have Value?",

        teacherPrompt:
          "Value may come from cash flow, productive usefulness, legal rights, scarcity, customer demand, replacement cost, strategic importance or expected future benefit. Ask which mechanism actually applies.",

        explanation:
          "Price and value are not identical concepts. Something can have a high market price without producing economic value in the same way as a productive business.",
      }),

      createActivity({
        id:
          "asset-lens-l4-a4",

        type:
          "teach",

        title:
          "3 â€” Where Could Return Come From?",

        teacherPrompt:
          "Possible return sources include interest, dividends, rent, business profits, royalties, contractual payments, appreciation or combinations of these. If you cannot explain where the economic return could come from, you do not yet understand the asset.",

        explanation:
          "Potential return should always be considered alongside risk. No source of return is guaranteed.",
      }),

      createActivity({
        id:
          "asset-lens-l4-a5",

        type:
          "teach",

        title:
          "4 â€” What Could Go Wrong?",

        teacherPrompt:
          "Every asset carries risk. Business profits can fall. Borrowers can default. Property can remain vacant. Interest rates can move. Commodities can decline. Technology can become obsolete. Legal rights can expire. Fraud or poor governance can destroy value.",

        explanation:
          "Risk analysis is not pessimism. It is part of understanding what you own.",

        visualTitle:
          "Return and risk belong together",

        visualDescription:
          "Potential return on one side; business, market, liquidity, credit, legal, technology, currency and operational risks on the other.",
      }),

      createActivity({
        id:
          "asset-lens-l4-a6",

        type:
          "teach",

        title:
          "5 â€” Liquidity, Rights and Costs",

        teacherPrompt:
          "Ask how easily the asset can be sold, what legal or economic rights ownership gives you and what costs come with holding it. Property may involve maintenance and taxes. Funds may have fees. Private businesses require management. Digital assets may involve custody risks.",

        explanation:
          "Headline return can be misleading if ownership costs, restrictions or illiquidity are ignored.",
      }),

      createActivity({
        id:
          "asset-lens-l4-a7",

        type:
          "case-study",

        title:
          "Analyse a Rental Warehouse",

        teacherPrompt:
          "A company offers you a fictional opportunity to own part of a warehouse rented to businesses. Use the FountainPrep Asset Lens. Explain at least four things you would want to understand before judging the asset.",

        acceptedAnswers: [
          "rent",
          "income",
          "tenant",
          "location",
          "value",
          "risk",
          "liquidity",
          "cost",
          "maintenance",
          "ownership",
          "rights",
          "vacancy",
          "return",
          "property",
        ],

        successReply:
          "Strong analysis. You are asking about the asset's economics before deciding whether it is attractive.",

        hints: [
          "Consider value, return, risks, liquidity, tenants, ownership rights and ongoing costs.",
        ],

        points:
          20,
      }),

      createActivity({
        id:
          "asset-lens-l4-a8",

        type:
          "case-study",

        title:
          "Analyse a Music Copyright",

        teacherPrompt:
          "Now apply the same framework to a fictional music copyright. What gives it value, how might return arise and what risks would you want to understand?",

        acceptedAnswers: [
          "royalty",
          "royalties",
          "licence",
          "licensing",
          "copyright",
          "demand",
          "streaming",
          "rights",
          "income",
          "risk",
          "expiry",
          "legal",
        ],

        successReply:
          "Excellent. The same analytical framework can be applied to a completely different type of asset. That is the power of the Asset Lens.",

        hints: [
          "Think about rights, licensing, royalties, audience demand and legal protection.",
        ],

        points:
          20,
      }),

      createActivity({
        id:
          "asset-lens-l4-a9",

        type:
          "assessment",

        title:
          "Asset Lens Challenge",

        teacherPrompt:
          "Choose any fictional asset and analyse it using the FountainPrep Asset Lens. Explain what it is, why it may have value, where return could come from, its main risks, its liquidity, the rights attached to it and at least one cost or limitation.",

        successReply:
          "Excellent. You can now move beyond recognising assets and begin analysing how different assets actually work. Next, you will enter Cash & Fixed-Income Assets.",

        points:
          25,
      }),
    ],
  });

/*
 * ============================================================
 * COURSE
 * ============================================================
 */

/*
 * ============================================================
 * UNIT 2
 * CASH & FIXED-INCOME ASSETS
 * ============================================================
 */


export const assetLensUnit =
  createUnit({
    id:
      "asset-literacy-unit-1",

    courseId:
      "asset-literacy-course",

    unitNumber:
      1,

    title:
      "The FountainPrep Asset Lens",

    description:
      "Build the analytical framework you will use throughout Asset Literacy before studying individual asset classes in depth.",

    learningOutcomes: [
      "Define an asset precisely.",
      "Distinguish assets from asset classes.",
      "Compare tangible and intangible assets.",
      "Compare financial and real assets.",
      "Compare liquid and illiquid assets.",
      "Recognise productive and income-producing assets.",
      "Use the FountainPrep Asset Lens to analyse unfamiliar assets.",
    ],

    lessons: [
      assetLensLesson1,
      assetLensLesson2,
      assetLensLesson3,
      assetLensLesson4,
    ],
  });
