import {
  createActivity,
  createLesson,
} from "@/features/academy-content";

const deliveryModes = [
  "ai-classroom",
  "self-study",
  "revision",
  "assessment",
] as const;

export const patriceMotsepeLesson =
  createLesson({
    id:
      "greatness-foundation-motsepe",

    academy:
      "biography",

    programmeId:
      "greatness-foundation",

    courseId:
      "greatness-foundation-course",

    unitId:
      "greatness-foundation-unit-2",

    stage:
      "foundation",

    lessonNumber:
      10,

    title:
      "Patrice Motsepe: Mining, Resources and Ownership",

    description:
      "Explore Patrice Motsepe's journey through mining, resource ownership, acquisitions and diversification, while examining commodity cycles, operational risk and capital allocation.",

    objective:
      "The learner will understand how natural-resource ownership can create wealth while also exposing investors to commodity prices, operational complexity and capital-intensive risk.",

    learningOutcomes: [
      "Trace major stages in Motsepe's mining and investment journey.",
      "Explain the difference between owning a resource asset and simply selling a commodity.",
      "Understand commodity-price risk.",
      "Recognise the importance of operating efficiency in mining.",
      "Explain how acquisitions can create or destroy value.",
      "Understand diversification beyond one resource or business.",
    ],

    estimatedMinutes:
      33,

    completionPoints:
      55,

    deliveryModes: [
      ...deliveryModes,
    ],

    suitableAgeGroups: [
      "10-13",
      "14-17",
      "adult",
    ],

    activities: [
      createActivity({
        id:
          "bio-motsepe-a1",

        type:
          "introduction",

        title:
          "Before the Mining Fortune",

        teacherPrompt:
          "Patrice Motsepe became one of Africa's most prominent mining entrepreneurs, but his story is also about law, ownership, acquisitions and operating resource businesses through changing commodity cycles.",

        narrationText:
          "Mining introduces a different wealth engine. The asset begins underground. Capital must be committed before the resource can be extracted, processed and sold.",

        visualTitle:
          "Patrice Motsepe",

        visualDescription:
          "South Africa • mining • ownership • acquisitions • commodities • diversification",

        story:
          "AYO opens beneath the surface of the earth. Mineral deposits appear below while capital, machinery and workers remain above ground.",
      }),

      createActivity({
        id:
          "bio-motsepe-a2",

        type:
          "teach",

        title:
          "Starting Context",

        teacherPrompt:
          "Motsepe trained as a lawyer and worked in mining-related legal practice before moving more directly into business ownership.",

        narrationText:
          "Professional knowledge can become economic leverage. Legal understanding does not extract gold, but it can help someone understand contracts, transactions, regulation and ownership structures.",

        visualTitle:
          "Professional Capital",

        visualDescription:
          "Law • contracts • mining industry • transactions • ownership",

        story:
          "A legal contract overlays a mining map. AYO highlights the point where professional expertise becomes part of a business decision.",
      }),

      createActivity({
        id:
          "bio-motsepe-a3",

        type:
          "teach",

        title:
          "Buying Mining Assets",

        teacherPrompt:
          "Motsepe built African Rainbow Minerals through mining acquisitions and operating assets across several resource categories.",

        narrationText:
          "Acquiring a mine is very different from buying a finished product. The buyer is acquiring an asset whose future economics depend on geology, extraction costs, commodity prices and operating execution.",

        visualTitle:
          "Resource Ownership",

        visualDescription:
          "Deposit • extraction cost • commodity price • operating life",

        story:
          "AYO turns a mine into a four-part equation: ore quality, cost, price and remaining life.",
      }),

      createActivity({
        id:
          "bio-motsepe-a4",

        type:
          "multiple-choice",

        title:
          "What Makes a Mine Valuable?",

        teacherPrompt:
          "Which combination most directly affects the economics of a mining asset?",

        options: [
          {
            id: "a",
            label:
              "Resource quality, extraction cost, commodity price and operating life.",
            value:
              "mine-economics",
          },
          {
            id: "b",
            label:
              "The colour of the company logo.",
            value:
              "logo",
          },
          {
            id: "c",
            label:
              "A guaranteed future selling price.",
            value:
              "guaranteed-price",
          },
        ],

        correctOptionId:
          "a",

        successReply:
          "Correct. Mining value depends heavily on the economics of extracting and selling the resource.",

        retryReply:
          "Think about what determines whether material underground can be converted into profitable production.",

        points:
          6,
      }),

      createActivity({
        id:
          "bio-motsepe-a5",

        type:
          "teach",

        title:
          "Commodity Cycles",

        teacherPrompt:
          "Mining businesses are exposed to changing commodity prices. A mine can operate efficiently while the market price of its output still rises or falls dramatically.",

        narrationText:
          "This is commodity risk. A business does not control the market price of gold, platinum or iron ore in the same way a luxury brand may influence its own pricing.",

        visualTitle:
          "Price Taker",

        visualDescription:
          "Global demand • supply • commodity price • revenue",

        story:
          "A mine produces the same amount while the commodity price moves sharply up and down. AYO shows how revenue changes even when production stays constant.",
      }),

      createActivity({
        id:
          "bio-motsepe-a6",

        type:
          "case-study",

        title:
          "Good Mine, Bad Commodity Price?",

        teacherPrompt:
          "Imagine a highly efficient mine during a period when the selling price of its commodity falls sharply.",

        learnerInstruction:
          "What factors determine whether the mine can survive the downturn?",

        story:
          "Important factors include production cost, debt, cash reserves, mine quality, remaining life, hedging, capital requirements and how long low prices persist.",

        visualTitle:
          "Survival Through the Cycle",

        visualDescription:
          "Cost position • liquidity • debt • asset quality • time",

        points:
          8,
      }),

      createActivity({
        id:
          "bio-motsepe-a7",

        type:
          "teach",

        title:
          "Operating Efficiency Matters",

        teacherPrompt:
          "Mining assets can require significant labour, energy, equipment, maintenance and safety systems. Small changes in unit cost can materially affect profitability.",

        narrationText:
          "A resource in the ground is not automatically valuable. The economics depend on whether it can be extracted safely and at a competitive cost.",

        visualTitle:
          "Resource ≠ Profit",

        visualDescription:
          "Ore underground → operating cost → sale price → margin",

        story:
          "AYO reveals a large mineral deposit, then subtracts labour, energy, equipment and processing costs before showing the remaining margin.",
      }),

      createActivity({
        id:
          "bio-motsepe-a8",

        type:
          "teach",

        title:
          "Diversifying Across Resources",

        teacherPrompt:
          "African Rainbow Minerals developed interests across multiple commodities rather than depending entirely on one resource.",

        narrationText:
          "Diversification can reduce reliance on one commodity cycle, but different resources can still be influenced by global economic conditions.",

        visualTitle:
          "Resource Portfolio",

        visualDescription:
          "Gold • platinum • iron ore • manganese • other resources",

        story:
          "Several commodity tiles move around a common ownership hub. Their price charts do not move identically.",
      }),

      createActivity({
        id:
          "bio-motsepe-a9",

        type:
          "multiple-choice",

        title:
          "Does More Commodities Mean No Risk?",

        teacherPrompt:
          "Does owning several different resource businesses eliminate risk?",

        options: [
          {
            id: "a",
            label:
              "Yes. Diversification guarantees profit.",
            value:
              "guaranteed",
          },
          {
            id: "b",
            label:
              "No. It can change risk exposure, but operational and commodity risks remain.",
            value:
              "risk-remains",
          },
          {
            id: "c",
            label:
              "Yes. Commodity prices always rise together.",
            value:
              "always-rise",
          },
        ],

        correctOptionId:
          "b",

        successReply:
          "Correct. Diversification can reduce some concentration, but it does not eliminate uncertainty.",

        retryReply:
          "Think about commodity cycles, operational incidents and financing.",

        points:
          7,
      }),

      createActivity({
        id:
          "bio-motsepe-a10",

        type:
          "teach",

        title:
          "Ownership Creates Exposure",

        teacherPrompt:
          "Motsepe's wealth became strongly associated with ownership in resource and investment businesses rather than simply earning a salary from mining.",

        narrationText:
          "This repeats one of our central financial-literacy lessons: ownership changes the relationship between a person's wealth and the value of the underlying business.",

        visualTitle:
          "Equity Exposure",

        visualDescription:
          "Business value changes → ownership value changes",

        story:
          "A mining-company valuation moves while the ownership percentage remains fixed. AYO shows the resulting change in shareholder value.",
      }),

      createActivity({
        id:
          "bio-motsepe-a11",

        type:
          "case-study",

        title:
          "Acquire or Develop?",

        teacherPrompt:
          "A mining company can buy an existing producing asset or spend years developing a new project.",

        learnerInstruction:
          "What are the potential advantages and risks of each route?",

        story:
          "Acquisition can provide immediate production but may require a high purchase price. Development can create value from an undeveloped resource but introduces construction, permitting, financing and geological risk.",

        visualTitle:
          "Buy Production or Build It?",

        visualDescription:
          "Acquisition price versus development risk",

        points:
          8,
      }),

      createActivity({
        id:
          "bio-motsepe-a12",

        type:
          "teach",

        title:
          "Capital Beyond Mining",

        teacherPrompt:
          "Motsepe's broader interests have extended beyond mining into investment, financial and other business activities.",

        narrationText:
          "Capital generated from one sector can be redirected into others. This can reduce dependence on the original wealth engine while introducing new risks and opportunities.",

        visualTitle:
          "From Resource Capital to Broader Capital",

        visualDescription:
          "Mining cash flow → investments → new businesses",

        story:
          "Mining remains on one side while capital arrows move toward additional asset categories.",
      }),

      createActivity({
        id:
          "bio-motsepe-a13",

        type:
          "teach",

        title:
          "Philanthropy and Capital Allocation",

        teacherPrompt:
          "Motsepe and his family have publicly committed substantial resources to philanthropy.",

        narrationText:
          "Philanthropy is also a capital-allocation decision, although its objective is social impact rather than financial return.",

        visualTitle:
          "Capital Can Have Different Objectives",

        visualDescription:
          "Investment return • family goals • philanthropy • social impact",

        story:
          "AYO splits capital allocation into financial-return and social-impact pathways.",
      }),

      createActivity({
        id:
          "bio-motsepe-a14",

        type:
          "teach",

        title:
          "Mine Assets Are Not Personal Cash",

        teacherPrompt:
          "Mining equipment, resource rights, corporate cash and operating assets belong to the companies that own them. Motsepe's economic interest comes through ownership and other private holdings.",

        narrationText:
          "Again, company assets and shareholder wealth are connected, but they are not identical.",

        visualTitle:
          "Corporate Asset ≠ Personal Wallet",

        visualDescription:
          "Mining company assets • ownership interest • estimated wealth • liquidity",

        story:
          "A mine remains inside the corporate boundary while a share certificate sits outside it.",
      }),

      createActivity({
        id:
          "bio-motsepe-a15",

        type:
          "reflection",

        title:
          "The AYO Lesson",

        teacherPrompt:
          "Which idea from Motsepe's journey matters most to your understanding: resource ownership, commodity cycles, operating cost, acquisitions, diversification or philanthropy?",

        narrationText:
          "Motsepe's story shows that owning productive natural-resource assets can create significant financial value, but the journey is inseparable from commodity risk, operating execution and long-term capital discipline.",

        visualTitle:
          "Resources Become Wealth Only Through Economics",

        visualDescription:
          "Resource → extraction → cost → price → cash flow → ownership",

        points:
          10,
      }),
    ],
  });