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

export const bernardArnaultLesson =
  createLesson({
    id:
      "greatness-foundation-arnault",

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
      4,

    title:
      "Bernard Arnault: Luxury, Brands and Controlling Equity",

    description:
      "Explore how Bernard Arnault moved from an industrial family background into luxury, acquisitions, brand ownership and controlling equity across one of the world's largest luxury groups.",

    objective:
      "The learner will understand how ownership of scarce brands, acquisitions and controlling equity can form a very different wealth engine from industrial production or public-market investing.",

    learningOutcomes: [
      "Identify major stages in Arnault's business journey.",
      "Explain how brands can become valuable economic assets.",
      "Understand the difference between owning one brand and controlling a portfolio of brands.",
      "Recognise how acquisitions can reshape a company.",
      "Explain why pricing power matters in luxury economics.",
      "Distinguish LVMH company assets from Arnault family wealth and personal liquidity.",
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
          "bio-arnault-a1",

        type:
          "introduction",

        title:
          "Before the Luxury Empire",

        teacherPrompt:
          "Bernard Arnault is closely associated with LVMH, but his career began in an industrial family and in engineering rather than fashion.",

        narrationText:
          "This story is useful because the wealth engine is different again. Dangote teaches industrial ownership. Buffett teaches capital allocation. Bezos teaches founder equity and reinvestment. Arnault introduces the economics of brands, scarcity, acquisition and control.",

        visualTitle:
          "Bernard Arnault",

        visualDescription:
          "France • engineering • Dior • acquisitions • luxury • controlling equity",

        story:
          "AYO opens in Roubaix, France. An engineering blueprint fades into the silhouette of a luxury storefront. A timeline appears: construction → Agache → Dior → LVMH → global luxury portfolio.",
      }),

      createActivity({
        id:
          "bio-arnault-a2",

        type:
          "teach",

        title:
          "The Starting Environment",

        teacherPrompt:
          "LVMH describes Arnault as having been born into an industrial family. He studied at École Polytechnique and began his career in the family construction business.",

        narrationText:
          "Again, starting position matters. Family business exposure, education and access to capital can shape which opportunities are available. Biography becomes more credible when we acknowledge these advantages rather than pretending every journey starts from the same place.",

        visualTitle:
          "Starting Context",

        visualDescription:
          "Industrial family • engineering education • management experience",

        story:
          "AYO separates the screen into inherited context and later strategic decisions. Neither side is allowed to erase the other.",
      }),

      createActivity({
        id:
          "bio-arnault-a3",

        type:
          "teach",

        title:
          "A Different Kind of Asset",

        teacherPrompt:
          "Luxury businesses can derive substantial value from brands, heritage, design, distribution, customer perception and scarcity.",

        narrationText:
          "A cement plant creates a physical product through industrial capacity. A luxury brand also creates physical products, but part of the economic value can come from something less tangible: reputation, desirability and identity.",

        visualTitle:
          "Tangible + Intangible",

        visualDescription:
          "Product • craftsmanship • brand • heritage • scarcity • perception",

        story:
          "A handbag appears on one side. On the other side, invisible layers build around it: brand history, reputation, design, distribution and scarcity.",
      }),

      createActivity({
        id:
          "bio-arnault-a4",

        type:
          "multiple-choice",

        title:
          "What Is a Brand Economically?",

        teacherPrompt:
          "Which statement best explains why a powerful brand can have economic value?",

        options: [
          {
            id: "a",
            label:
              "Because every branded product automatically earns a profit.",
            value:
              "automatic",
          },
          {
            id: "b",
            label:
              "Because customer trust, recognition and desirability can influence demand and pricing.",
            value:
              "brand-value",
          },
          {
            id: "c",
            label:
              "Because brands eliminate competition.",
            value:
              "no-competition",
          },
        ],

        correctOptionId:
          "b",

        successReply:
          "Correct. Brand value can affect demand, pricing and customer behaviour, but it never guarantees success.",

        retryReply:
          "Think about why customers may choose one product over another even when both perform similar functions.",

        points:
          6,
      }),

      createActivity({
        id:
          "bio-arnault-a5",

        type:
          "teach",

        title:
          "The 1984 Turning Point",

        teacherPrompt:
          "In 1984, Arnault took control of Financière Agache and reorganised the business. Christian Dior became a cornerstone of the strategy that followed.",

        narrationText:
          "This was not simply buying a product. It was acquiring control of assets and brands that could become the basis of a much broader ownership structure.",

        visualTitle:
          "Acquire → Restructure → Build",

        visualDescription:
          "Capital committed • control obtained • assets reorganised • strategic focus",

        story:
          "A fragmented group of assets appears. AYO removes non-core pieces while Dior remains illuminated at the centre.",
      }),

      createActivity({
        id:
          "bio-arnault-a6",

        type:
          "case-study",

        title:
          "Why Buy an Existing Brand?",

        teacherPrompt:
          "A business leader can create a new brand from zero or acquire an existing one with history, customers and reputation.",

        learnerInstruction:
          "What might be one advantage and one risk of acquiring an established brand rather than building a new one?",

        story:
          "An established brand can bring recognition, distribution and heritage. But acquisition can be expensive, integration can fail and the buyer may overestimate future demand.",

        visualTitle:
          "Build or Buy?",

        visualDescription:
          "New brand: time and uncertainty. Acquisition: price and integration risk.",

        points:
          8,
      }),

      createActivity({
        id:
          "bio-arnault-a7",

        type:
          "teach",

        title:
          "LVMH and the Importance of Control",

        teacherPrompt:
          "LVMH was formed in 1987 through the merger of Louis Vuitton and Moët Hennessy. LVMH states that Arnault became its majority shareholder in 1989 and has led the group since then.",

        narrationText:
          "Minority ownership and controlling ownership are not the same thing. Control can influence leadership, capital allocation, acquisition strategy and long-term direction.",

        visualTitle:
          "Ownership + Control",

        visualDescription:
          "Share ownership → voting influence → strategy → capital allocation",

        story:
          "A shareholder map appears. One ownership block expands until AYO highlights the difference between economic interest and control.",
      }),

      createActivity({
        id:
          "bio-arnault-a8",

        type:
          "teach",

        title:
          "A Portfolio of Maisons",

        teacherPrompt:
          "LVMH operates a broad portfolio of luxury houses across fashion, leather goods, wines and spirits, perfumes, cosmetics, watches, jewellery and selective retailing.",

        narrationText:
          "A portfolio can create diversification across brands and categories, but it also creates complexity. The group must decide where capital, management attention and investment should go.",

        visualTitle:
          "Portfolio of Brands",

        visualDescription:
          "Fashion • jewellery • watches • beauty • wines • retail",

        story:
          "Individual brand cards assemble around one LVMH core. Each retains a distinct identity while sharing access to a larger group structure.",
      }),

      createActivity({
        id:
          "bio-arnault-a9",

        type:
          "multiple-choice",

        title:
          "Does More Brands Mean No Risk?",

        teacherPrompt:
          "Does owning many luxury brands eliminate business risk?",

        options: [
          {
            id: "a",
            label:
              "Yes. A large portfolio cannot decline.",
            value:
              "no-risk",
          },
          {
            id: "b",
            label:
              "No. Diversification can change exposures, but demand, valuation and execution risks remain.",
            value:
              "risk-remains",
          },
          {
            id: "c",
            label:
              "Yes. Brand ownership guarantees pricing power forever.",
            value:
              "permanent",
          },
        ],

        correctOptionId:
          "b",

        successReply:
          "Correct. Diversification can reduce dependence on one brand, but it never removes uncertainty.",

        retryReply:
          "Think about changing consumer preferences, recessions and execution risk.",

        points:
          7,
      }),

      createActivity({
        id:
          "bio-arnault-a10",

        type:
          "teach",

        title:
          "Pricing Power",

        teacherPrompt:
          "Some highly desired brands can raise prices without losing all demand. Economists and investors often refer to this ability as pricing power.",

        narrationText:
          "Pricing power is valuable because inflation or rising costs can pressure margins. A business with strong customer demand may have greater ability to pass some costs through to customers.",

        visualTitle:
          "Desirability → Pricing Power",

        visualDescription:
          "Brand strength • scarcity • demand • price • margin",

        story:
          "Two brands face the same rise in production cost. One loses customers when it raises prices. The other retains more demand. AYO compares the economic difference.",
      }),

      createActivity({
        id:
          "bio-arnault-a11",

        type:
          "teach",

        title:
          "Tiffany and the Scale of Acquisition",

        teacherPrompt:
          "LVMH completed its acquisition of Tiffany & Co. in 2021, one of the largest luxury transactions in history.",

        narrationText:
          "Large acquisitions concentrate capital into major strategic bets. If the buyer is right, the acquired brand can expand the group. If the buyer overpays or integration disappoints, shareholder capital can be impaired.",

        visualTitle:
          "Acquisition at Scale",

        visualDescription:
          "Purchase price • financing • integration • growth • return on capital",

        story:
          "A large acquisition cheque enters the screen. AYO refuses to label it success until future cash flows, growth and strategic value are considered.",
      }),

      createActivity({
        id:
          "bio-arnault-a12",

        type:
          "case-study",

        title:
          "How Much Is a Brand Worth?",

        teacherPrompt:
          "A famous brand may have valuable history and loyal customers, but an investor still needs to decide how much to pay.",

        learnerInstruction:
          "What financial and strategic questions should a buyer ask before paying a very high price for a famous brand?",

        story:
          "Possible questions include revenue growth, margins, customer loyalty, competitive position, required investment, debt, future cash flows and whether the expected benefits justify the purchase price.",

        visualTitle:
          "Great Asset ≠ Any Price",

        visualDescription:
          "Quality • growth • cash flow • risk • purchase price",

        points:
          8,
      }),

      createActivity({
        id:
          "bio-arnault-a13",

        type:
          "teach",

        title:
          "Family Ownership and Succession",

        teacherPrompt:
          "Arnault's five children hold roles across parts of the LVMH ecosystem. Public reporting frequently discusses succession, but exact future control arrangements should not be assumed until formally established.",

        narrationText:
          "This introduces wealth transfer and governance. A family may own valuable business interests, but transferring leadership, voting control and economic ownership across generations can be complex.",

        visualTitle:
          "Ownership Is One Question. Succession Is Another.",

        visualDescription:
          "Family • governance • voting control • management • legacy",

        story:
          "AYO separates a family tree from a corporate governance chart. The learner sees that family relationship does not automatically equal identical control.",
      }),

      createActivity({
        id:
          "bio-arnault-a14",

        type:
          "teach",

        title:
          "Arnault's Fortune Is Not LVMH's Treasury",

        teacherPrompt:
          "Arnault's estimated wealth is strongly connected to his family's ownership interests in LVMH and related holdings. LVMH's cash, stores, inventories, brands and subsidiaries belong to the company and its shareholders, not personally to Arnault as spendable cash.",

        narrationText:
          "Again, we separate company assets, shareholder equity and personal liquidity. This distinction is essential when interpreting billionaire net-worth figures.",

        visualTitle:
          "Company Value ≠ Personal Cash",

        visualDescription:
          "LVMH assets • family ownership • estimated net worth • private liquidity",

        story:
          "Four labelled layers stay separate while AYO blocks them from collapsing into one number.",
      }),

      createActivity({
        id:
          "bio-arnault-a15",

        type:
          "reflection",

        title:
          "The AYO Lesson",

        teacherPrompt:
          "Which financial idea from Arnault's journey is most useful to you: brand value, acquisition, controlling equity, pricing power, portfolio management or succession?",

        narrationText:
          "Arnault's story shows that valuable economic assets are not always factories or technology. Brands, reputation, control and carefully managed portfolios can also become powerful forms of capital.",

        visualTitle:
          "Capital Can Be Intangible",

        visualDescription:
          "Brand → control → portfolio → pricing power → capital allocation",

        points:
          10,
      }),
    ],
  });