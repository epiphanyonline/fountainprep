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

export const carlosSlimLesson =
  createLesson({
    id:
      "greatness-foundation-slim",

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
      8,

    title:
      "Carlos Slim: Acquisitions, Telecom and Diversified Ownership",

    description:
      "Explore how Carlos Slim built a broad business portfolio through investing, acquisitions, telecommunications and long-term ownership across multiple industries.",

    objective:
      "The learner will understand how acquisitions, distressed opportunities, controlling ownership and cash-flow businesses can contribute to a diversified corporate fortune.",

    learningOutcomes: [
      "Trace major stages in Carlos Slim's investment and business journey.",
      "Explain the financial logic of acquiring undervalued or distressed businesses.",
      "Understand how controlling ownership differs from passive investment.",
      "Recognise telecom infrastructure as a capital-intensive economic engine.",
      "Explain the difference between corporate diversification and personal diversification.",
      "Distinguish company assets, ownership value and personal liquidity.",
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
          "bio-slim-a1",

        type:
          "introduction",

        title:
          "Before Telmex",

        teacherPrompt:
          "Carlos Slim became internationally associated with telecommunications, but his business history began much earlier through investing, property and ownership of different businesses.",

        narrationText:
          "This biography introduces another capital model. Instead of building one company from zero and keeping it forever, Slim repeatedly acquired interests in existing businesses and reorganised capital across a broad group.",

        visualTitle:
          "Carlos Slim",

        visualDescription:
          "Mexico • investing • acquisitions • Carso • Telmex • telecom • diversification",

        story:
          "AYO opens in Mexico City. Several small investment boxes appear before a large TELMEX block eventually enters the timeline.",
      }),

      createActivity({
        id:
          "bio-slim-a2",

        type:
          "teach",

        title:
          "Numbers Before Empire",

        teacherPrompt:
          "Slim studied civil engineering at UNAM and also taught algebra and linear programming while studying. His official biography records that he founded Inversora Bursátil and began building what later became Grupo Carso in the mid-1960s.",

        narrationText:
          "Engineering and quantitative thinking do not automatically create investment success, but they can influence how a person approaches systems, costs and decision-making.",

        visualTitle:
          "Analytical Capital",

        visualDescription:
          "Engineering • mathematics • investing • business analysis",

        story:
          "Blueprints, equations and company financial statements appear on the same desk. AYO asks what skills can transfer between disciplines.",
      }),

      createActivity({
        id:
          "bio-slim-a3",

        type:
          "teach",

        title:
          "Building Carso",

        teacherPrompt:
          "Slim's official biography records the development of businesses in property, insurance, construction-related activities and investment before Grupo Carso became a major corporate structure.",

        narrationText:
          "A conglomerate is different from a single-business company. It can hold businesses from multiple industries under a broader ownership structure.",

        visualTitle:
          "The Conglomerate Model",

        visualDescription:
          "Holding structure → multiple businesses → different cash flows",

        story:
          "Separate businesses move under a single CARSO umbrella while AYO keeps their individual economics visible.",
      }),

      createActivity({
        id:
          "bio-slim-a4",

        type:
          "multiple-choice",

        title:
          "What Is a Conglomerate?",

        teacherPrompt:
          "Which description best matches a conglomerate?",

        options: [
          {
            id: "a",
            label:
              "A company or group owning businesses across multiple activities or industries.",
            value:
              "multiple-businesses",
          },
          {
            id: "b",
            label:
              "A savings account that guarantees a return.",
            value:
              "savings",
          },
          {
            id: "c",
            label:
              "A company that is legally allowed to own only one product.",
            value:
              "one-product",
          },
        ],

        correctOptionId:
          "a",

        successReply:
          "Correct. Conglomerates combine ownership interests across several businesses or sectors.",

        retryReply:
          "Think about one ownership structure containing several different operating companies.",

        points:
          6,
      }),

      createActivity({
        id:
          "bio-slim-a5",

        type:
          "teach",

        title:
          "Buying When Others Are Selling",

        teacherPrompt:
          "Slim became known for acquiring businesses during periods of economic stress, including companies purchased during Mexico's difficult economic environment in the 1980s.",

        narrationText:
          "Distress can reduce asset prices, but low price alone does not make something a good investment. The central question is whether the asset can survive, recover and eventually produce sufficient value.",

        visualTitle:
          "Distressed Opportunity",

        visualDescription:
          "Falling price • weak economy • uncertainty • potential value",

        story:
          "Several company prices fall sharply during a recession. AYO refuses to label any of them bargains until their balance sheets and businesses are examined.",
      }),

      createActivity({
        id:
          "bio-slim-a6",

        type:
          "case-study",

        title:
          "Cheap or Broken?",

        teacherPrompt:
          "A company's market value falls dramatically during an economic crisis.",

        learnerInstruction:
          "What would you investigate before deciding whether the company is undervalued or permanently impaired?",

        story:
          "Useful questions include debt, liquidity, demand, competitive position, asset quality, management, cash flow and whether the underlying problem is temporary or structural.",

        visualTitle:
          "Price Fall ≠ Bargain",

        visualDescription:
          "Price • balance sheet • cash flow • debt • recovery potential",

        points:
          8,
      }),

      createActivity({
        id:
          "bio-slim-a7",

        type:
          "teach",

        title:
          "The Telmex Turning Point",

        teacherPrompt:
          "In 1990, a consortium involving Slim's business interests, Southwestern Bell and France Telecom won the process to acquire Telmex during Mexico's privatisation programme.",

        narrationText:
          "Telecommunications changed the scale of the story. A national telecom network is not merely a brand. It is infrastructure connecting millions of customers.",

        visualTitle:
          "Acquisition at National Scale",

        visualDescription:
          "Telmex • infrastructure • customers • network • control",

        story:
          "A map of Mexico lights up with telephone connections as the Telmex ownership structure appears above it.",
      }),

      createActivity({
        id:
          "bio-slim-a8",

        type:
          "teach",

        title:
          "Network Economics",

        teacherPrompt:
          "Telecommunications businesses require large investments in networks, equipment and technology before customers can be served at scale.",

        narrationText:
          "Infrastructure businesses often combine high upfront costs with the possibility of recurring customer revenue. That can create powerful cash-flow economics when utilisation is strong, but heavy capital requirements remain.",

        visualTitle:
          "Build Once, Serve Many",

        visualDescription:
          "Network investment → customer connections → recurring revenue",

        story:
          "The network is built before customers connect. As usage increases, AYO shows revenue rising while maintenance and upgrade costs remain visible.",
      }),

      createActivity({
        id:
          "bio-slim-a9",

        type:
          "multiple-choice",

        title:
          "Why Does Scale Matter?",

        teacherPrompt:
          "Why can scale matter in a telecommunications network?",

        options: [
          {
            id: "a",
            label:
              "Because infrastructure can serve many customers once it has been built.",
            value:
              "scale",
          },
          {
            id: "b",
            label:
              "Because networks never need maintenance.",
            value:
              "no-maintenance",
          },
          {
            id: "c",
            label:
              "Because telecom businesses cannot face competition.",
            value:
              "no-competition",
          },
        ],

        correctOptionId:
          "a",

        successReply:
          "Correct. Infrastructure can serve many customers, although additional investment, maintenance and competition remain important.",

        retryReply:
          "Think about towers, fibre and switching equipment being shared across large numbers of users.",

        points:
          7,
      }),

      createActivity({
        id:
          "bio-slim-a10",

        type:
          "teach",

        title:
          "From Telmex to América Móvil",

        teacherPrompt:
          "Slim's telecommunications interests expanded strongly into mobile communications and across Latin America through businesses including América Móvil.",

        narrationText:
          "Geographic expansion can diversify revenues across countries, but it introduces new currencies, regulations, competitors and political environments.",

        visualTitle:
          "Geographic Scale",

        visualDescription:
          "Mexico → Latin America → multiple markets",

        story:
          "Telecom signals spread across a Latin American map while currency and regulatory icons appear beside different countries.",
      }),

      createActivity({
        id:
          "bio-slim-a11",

        type:
          "teach",

        title:
          "A Portfolio Beyond Telecom",

        teacherPrompt:
          "Slim's broader business interests have included retail, industrial companies, infrastructure, finance, property and other investments through various corporate structures.",

        narrationText:
          "This means the fortune is associated with a network of ownership interests rather than one single operating asset.",

        visualTitle:
          "Diversified Corporate Ownership",

        visualDescription:
          "Telecom • retail • industry • finance • infrastructure • property",

        story:
          "Six business sectors surround the Carso ownership hub. AYO asks whether every sector contributes the same risk and return.",
      }),

      createActivity({
        id:
          "bio-slim-a12",

        type:
          "case-study",

        title:
          "When Is Diversification Too Complex?",

        teacherPrompt:
          "Owning many different businesses can diversify economic exposure, but it can also make a group harder to manage and value.",

        learnerInstruction:
          "What might be the benefits and disadvantages of owning a very broad portfolio of operating companies?",

        story:
          "Benefits can include diversified cash flows and opportunities to allocate capital across sectors. Disadvantages can include complexity, weaker focus, governance challenges and difficulty determining where value is actually being created.",

        visualTitle:
          "Diversification Versus Complexity",

        visualDescription:
          "More engines • more opportunity • more oversight • more complexity",

        points:
          8,
      }),

      createActivity({
        id:
          "bio-slim-a13",

        type:
          "teach",

        title:
          "Control Is Different From Diversification",

        teacherPrompt:
          "Slim's wealth has historically been concentrated in significant ownership interests in businesses connected to his family and corporate groups.",

        narrationText:
          "A person can own a diversified conglomerate and still have personal wealth concentrated in that conglomerate. Corporate diversification and personal asset diversification are different concepts.",

        visualTitle:
          "Two Levels of Concentration",

        visualDescription:
          "Many businesses inside group • major personal ownership in group",

        story:
          "The company branches into several sectors while Slim's ownership block remains connected to the whole structure.",
      }),

      createActivity({
        id:
          "bio-slim-a14",

        type:
          "teach",

        title:
          "Corporate Assets Are Not Personal Cash",

        teacherPrompt:
          "Telecom networks, retail stores, factories, corporate cash and other assets owned by Slim-associated companies belong to those companies and their shareholders.",

        narrationText:
          "A controlling shareholder may have enormous economic exposure to those assets, but does not simply own every company asset personally.",

        visualTitle:
          "Control ≠ Personal Possession",

        visualDescription:
          "Corporate assets • ownership interests • estimated wealth • liquidity",

        story:
          "AYO places corporate assets behind a legal company boundary while a separate ownership certificate remains outside it.",
      }),

      createActivity({
        id:
          "bio-slim-a15",

        type:
          "reflection",

        title:
          "The AYO Lesson",

        teacherPrompt:
          "Which idea from Slim's journey stands out most: buying during distress, conglomerate ownership, telecom infrastructure, control, diversification or capital allocation?",

        narrationText:
          "Slim's story shows how acquiring existing businesses can be as important a wealth engine as founding new ones. But acquisitions only create value when the assets purchased ultimately justify the capital committed.",

        visualTitle:
          "Acquire. Improve. Hold. Allocate.",

        visualDescription:
          "Opportunity → acquisition → ownership → cash flow → reallocation",

        points:
          10,
      }),
    ],
  });