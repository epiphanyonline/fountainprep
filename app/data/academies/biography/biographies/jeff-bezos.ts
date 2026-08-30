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

export const jeffBezosLesson =
  createLesson({
    id:
      "greatness-foundation-bezos",

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
      3,

    title:
      "Jeff Bezos: Reinvestment, Scale and Long-Term Ownership",

    description:
      "Explore how an online bookstore became a much broader technology and commerce company, and examine founder equity, reinvestment, infrastructure, experimentation and long-term ownership.",

    objective:
      "The learner will understand how founder ownership, reinvestment and business expansion contributed to the economic story behind Jeff Bezos and Amazon.",

    learningOutcomes: [
      "Identify major stages in Amazon's development.",
      "Explain founder equity.",
      "Understand why a growing company may reinvest rather than maximise short-term profit.",
      "Recognise the importance of infrastructure and scale.",
      "Explain why experimentation includes failure.",
      "Distinguish Amazon's company assets from Bezos's personal wealth.",
    ],

    estimatedMinutes:
      32,

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
          "bio-bezos-a1",

        type:
          "introduction",

        title:
          "Before Everything Was Sold Online",

        teacherPrompt:
          "Amazon is now associated with global e-commerce, cloud computing and technology infrastructure. But the business began much more narrowly: as an online bookseller.",

        narrationText:
          "Imagine looking at the early internet and seeing not merely websites, but a new distribution system. Jeff Bezos left an established career and entered a market whose future was highly uncertain.",

        visualTitle:
          "Jeff Bezos",

        visualDescription:
          "Internet → books → commerce → infrastructure → cloud → ownership",

        story:
          "AYO opens on a mid-1990s computer screen. One small BOOKS tile appears. The camera pulls backwards as the eventual Amazon ecosystem remains hidden in darkness.",
      }),

      createActivity({
        id:
          "bio-bezos-a2",

        type:
          "teach",

        title:
          "The Starting Position",

        teacherPrompt:
          "Before founding Amazon, Bezos had worked in finance and technology-related roles. His decision to start an internet business therefore did not emerge from nowhere; it combined professional experience with a rapidly expanding technological environment.",

        narrationText:
          "Starting environments matter. Skills, education, professional networks, family circumstances and access to capital can all affect which opportunities a founder is able to pursue.",

        visualTitle:
          "Opportunity Meets Preparation",

        visualDescription:
          "Experience • technology • timing • access • risk",

        story:
          "Five pieces of a puzzle assemble around a central question: 'Why this opportunity, at this moment?'",
      }),

      createActivity({
        id:
          "bio-bezos-a3",

        type:
          "teach",

        title:
          "Why Books?",

        teacherPrompt:
          "Books offered characteristics suited to early online retail: an enormous catalogue of distinct titles that physical stores could not all stock in one location.",

        narrationText:
          "The first product does not always have to be the final business. Sometimes it is a practical entry point into a much larger opportunity.",

        visualTitle:
          "The Wedge",

        visualDescription:
          "Start narrow → learn → build systems → expand",

        story:
          "One book enters a narrow doorway labelled INTERNET COMMERCE. Behind the doorway sits a much larger distribution network.",
      }),

      createActivity({
        id:
          "bio-bezos-a4",

        type:
          "multiple-choice",

        title:
          "Why Start Narrow?",

        teacherPrompt:
          "Why might a new company begin with one category instead of immediately attempting to sell everything?",

        options: [
          {
            id: "a",
            label:
              "A focused starting point can allow the company to test and develop its systems.",
            value:
              "focus",
          },
          {
            id: "b",
            label:
              "Because businesses are legally forbidden from expanding.",
            value:
              "forbidden",
          },
          {
            id: "c",
            label:
              "Because successful businesses never enter new markets.",
            value:
              "never-expand",
          },
        ],

        correctOptionId:
          "a",

        successReply:
          "Correct. A narrow entry point can help a business learn before expanding.",

        retryReply:
          "Think about the complexity of building many systems simultaneously.",

        points:
          6,
      }),

      createActivity({
        id:
          "bio-bezos-a5",

        type:
          "teach",

        title:
          "Founder Equity",

        teacherPrompt:
          "A founder can own shares in the company they create. If the company becomes substantially more valuable, those shares can become the dominant source of the founder's estimated wealth.",

        narrationText:
          "This is the same financial-literacy distinction we encountered with other business owners. A billionaire founder does not necessarily receive billions as salary. Much of the wealth can exist as equity whose market value changes.",

        visualTitle:
          "Founder Wealth Engine",

        visualDescription:
          "Company created → founder equity → company value changes → ownership value changes",

        story:
          "A small ownership certificate remains on screen while the company behind it grows dramatically. The certificate does not multiply; its underlying value changes.",
      }),

      createActivity({
        id:
          "bio-bezos-a6",

        type:
          "teach",

        title:
          "Reinvest Instead of Harvest",

        teacherPrompt:
          "Amazon became known for directing substantial resources back into growth: technology, fulfilment capacity, new categories, logistics and other capabilities.",

        narrationText:
          "A business can choose between distributing more of today's resources and reinvesting them in hopes of creating greater capacity tomorrow. Reinvestment does not guarantee success. It is a capital-allocation decision.",

        visualTitle:
          "Profit Today or Capacity Tomorrow?",

        visualDescription:
          "Cash generated → distribute OR reinvest",

        story:
          "Cash reaches a fork. One route exits the business. The second enters warehouses, servers, software and new services.",
      }),

      createActivity({
        id:
          "bio-bezos-a7",

        type:
          "case-study",

        title:
          "Would You Accept Lower Profit Today?",

        teacherPrompt:
          "Imagine a growing company can report higher short-term profit by reducing investment, or spend heavily on infrastructure that management believes could support much larger future operations.",

        learnerInstruction:
          "What evidence would you want before accepting lower profit today in exchange for possible future growth?",

        story:
          "Useful questions include whether customers are increasing, whether the new infrastructure will actually be used, whether unit economics make sense, whether financing is sustainable and whether management has demonstrated good capital allocation.",

        visualTitle:
          "The Reinvestment Decision",

        visualDescription:
          "Present profit versus uncertain future capacity",

        points:
          8,
      }),

      createActivity({
        id:
          "bio-bezos-a8",

        type:
          "teach",

        title:
          "Infrastructure Becomes an Advantage",

        teacherPrompt:
          "As Amazon expanded, warehouses, fulfilment systems, software, logistics and computing infrastructure became increasingly important to the business model.",

        narrationText:
          "Scale is not simply being large. Scale can change economics when systems, infrastructure or technology can serve increasing volumes efficiently. But large infrastructure also creates fixed costs and execution risk.",

        visualTitle:
          "Scale Is a System",

        visualDescription:
          "Customers ↔ software ↔ fulfilment ↔ logistics ↔ data",

        story:
          "A single order enters the screen and travels through software, inventory, fulfilment and delivery. Thousands of orders then enter simultaneously.",
      }),

      createActivity({
        id:
          "bio-bezos-a9",

        type:
          "teach",

        title:
          "AWS: A Different Economic Engine",

        teacherPrompt:
          "Amazon Web Services developed into a major cloud-computing business. This illustrates how capabilities created inside one company can sometimes become products offered to external customers.",

        narrationText:
          "Amazon was no longer simply a retailer. Cloud infrastructure introduced another economic engine with different customers, margins, competitors and capital requirements.",

        visualTitle:
          "One Company, Multiple Engines",

        visualDescription:
          "Commerce • marketplace • advertising • cloud infrastructure",

        story:
          "The Amazon structure separates into several engines. AYO taps AWS and the retail warehouse transforms into a data-centre illustration.",
      }),

      createActivity({
        id:
          "bio-bezos-a10",

        type:
          "multiple-choice",

        title:
          "Diversification Inside a Company",

        teacherPrompt:
          "If one company operates several different businesses, does that automatically eliminate risk?",

        options: [
          {
            id: "a",
            label:
              "Yes. A large company cannot lose money.",
            value:
              "no-risk",
          },
          {
            id: "b",
            label:
              "No. Multiple businesses can diversify some exposures while creating other risks and complexity.",
            value:
              "complexity",
          },
          {
            id: "c",
            label:
              "Yes. Diversification guarantees investment returns.",
            value:
              "guaranteed",
          },
        ],

        correctOptionId:
          "b",

        successReply:
          "Correct. Diversification can change risk; it does not abolish it.",

        retryReply:
          "No business structure can guarantee investment outcomes.",

        points:
          7,
      }),

      createActivity({
        id:
          "bio-bezos-a11",

        type:
          "teach",

        title:
          "Experimentation Includes Failure",

        teacherPrompt:
          "Amazon has launched successful products and businesses, but it has also discontinued projects and products that failed to achieve their objectives.",

        narrationText:
          "Innovation stories become misleading when they show only winners. Experimentation means some capital, time and effort will be committed to ideas that do not work.",

        visualTitle:
          "The Innovation Portfolio",

        visualDescription:
          "Experiments → some fail • some survive • a few become enormous",

        story:
          "Ten project cards appear. Several fade away. A few remain. One expands dramatically. AYO asks whether the failures were avoidable, useful or simply expensive.",
      }),

      createActivity({
        id:
          "bio-bezos-a12",

        type:
          "case-study",

        title:
          "When Should an Experiment Stop?",

        teacherPrompt:
          "Persistence can be valuable, but continually funding an unsuccessful project can destroy capital.",

        learnerInstruction:
          "What signals might tell a company to continue experimenting, change direction or stop?",

        story:
          "Possible evidence includes customer adoption, costs, technical progress, strategic value, competitive response and whether new information still supports the original thesis.",

        visualTitle:
          "Persist, Pivot or Stop?",

        visualDescription:
          "Evidence → decision → capital reallocation",

        points:
          8,
      }),

      createActivity({
        id:
          "bio-bezos-a13",

        type:
          "teach",

        title:
          "Amazon Is Not Bezos's Wallet",

        teacherPrompt:
          "Bezos's estimated wealth has historically been strongly influenced by the value of his Amazon shareholding. Amazon's warehouses, cash, servers and other corporate assets belong to the company, not personally to Bezos.",

        narrationText:
          "Again we separate three ideas: the value of a corporation, the value of an individual's ownership interest, and the individual's personal liquid assets.",

        visualTitle:
          "Ownership ≠ Corporate Treasury",

        visualDescription:
          "Amazon assets • Bezos equity • personal liquidity",

        story:
          "Three layers separate on screen. AYO locks Amazon's corporate assets inside the company layer rather than allowing them to move into a personal wallet.",
      }),

      createActivity({
        id:
          "bio-bezos-a14",

        type:
          "teach",

        title:
          "Capital Beyond Amazon",

        teacherPrompt:
          "Bezos has also directed capital toward other interests, including Blue Origin and personal investments. Public information can identify some major interests, but it does not provide a complete real-time picture of every personal asset.",

        narrationText:
          "This is why Biography of Greatness does not manufacture precise personal portfolio percentages. Public shareholdings may be documented. Other assets may be known. A complete private balance sheet usually is not.",

        visualTitle:
          "Documented, Estimated, Private",

        visualDescription:
          "Public ownership • known investments • estimates • undisclosed assets",

        story:
          "AYO places evidence labels over different assets rather than pretending every box contains an exact percentage.",
      }),

      createActivity({
        id:
          "bio-bezos-a15",

        type:
          "reflection",

        title:
          "The AYO Lesson",

        teacherPrompt:
          "Which idea from the Bezos story matters most to your understanding of finance: founder equity, reinvestment, scale, infrastructure, experimentation or long-term ownership?",

        narrationText:
          "The lesson is not that everyone should start a technology company. It is that financial literacy becomes richer when we understand how ownership, reinvestment and capital allocation operate inside real businesses.",

        visualTitle:
          "Look Beneath the Net Worth",

        visualDescription:
          "Equity → reinvestment → systems → scale → ownership value",

        points:
          10,
      }),
    ],
  });