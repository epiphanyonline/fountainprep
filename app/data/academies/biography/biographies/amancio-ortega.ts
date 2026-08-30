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

export const amancioOrtegaLesson =
  createLesson({
    id:
      "greatness-foundation-ortega",

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
      6,

    title:
      "Amancio Ortega: Retail, Ownership and Real Estate",

    description:
      "Explore how Amancio Ortega moved from garment production into Zara, Inditex, global retail ownership and a substantial real-estate investment structure.",

    objective:
      "The learner will understand how operational speed, founder ownership, supply-chain design and diversification into property contributed to Ortega's financial story.",

    learningOutcomes: [
      "Trace Ortega's journey from garment manufacturing to global retail.",
      "Explain how supply-chain design can become a business advantage.",
      "Understand the role of retained founder equity.",
      "Recognise the difference between operating-business ownership and property investment.",
      "Explain why real estate can diversify the economic sources behind a fortune.",
      "Distinguish Inditex assets, Ortega's shareholding and private holdings.",
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
          "bio-ortega-a1",

        type:
          "introduction",

        title:
          "Before Zara Became Global",

        teacherPrompt:
          "Amancio Ortega became closely associated with Zara and Inditex, but the story began in textile and garment production before the retail network existed.",

        narrationText:
          "This biography introduces another financial engine. The central lesson is not simply fashion. It is the combination of operations, supply chain, ownership and later diversification into real estate.",

        visualTitle:
          "Amancio Ortega",

        visualDescription:
          "Spain • textiles • Zara • operations • ownership • real estate",

        story:
          "AYO opens in Galicia, Spain. Fabric moves through a small workshop. The scene expands into storefronts, logistics centres and eventually commercial property around the world.",
      }),

      createActivity({
        id:
          "bio-ortega-a2",

        type:
          "teach",

        title:
          "Starting in Production",

        teacherPrompt:
          "Inditex states that Ortega began textile manufacturing operations in 1963 and later founded Confecciones Goa, an early garment-making company.",

        narrationText:
          "Starting in production matters because it gave the business experience with how garments were actually made, how long production took and where delays could occur.",

        visualTitle:
          "Learn the Production Engine",

        visualDescription:
          "Design • fabric • cutting • sewing • finishing",

        story:
          "A garment moves through five production stages. AYO highlights the time and cost added at each stage.",
      }),

      createActivity({
        id:
          "bio-ortega-a3",

        type:
          "teach",

        title:
          "The First Zara Store",

        teacherPrompt:
          "Inditex records the first Zara retail company as being founded in 1975. Retail added direct contact with customers to the production knowledge Ortega had already developed.",

        narrationText:
          "This changes the information flow. A manufacturer may learn through wholesalers or distributors. A retailer sees customer demand more directly.",

        visualTitle:
          "Production Meets the Customer",

        visualDescription:
          "Factory → store → customer feedback → next production decision",

        story:
          "A customer enters a Zara store. Sales data travels backwards through the system toward design and production.",
      }),

      createActivity({
        id:
          "bio-ortega-a4",

        type:
          "multiple-choice",

        title:
          "Why Can Direct Feedback Matter?",

        teacherPrompt:
          "Why might direct information from stores be valuable to a fashion retailer?",

        options: [
          {
            id: "a",
            label:
              "It can help the business see what customers are actually buying.",
            value:
              "customer-data",
          },
          {
            id: "b",
            label:
              "It guarantees every new design will succeed.",
            value:
              "guarantee",
          },
          {
            id: "c",
            label:
              "It removes the need for inventory decisions.",
            value:
              "no-inventory",
          },
        ],

        correctOptionId:
          "a",

        successReply:
          "Correct. Better information can improve decisions, but it does not eliminate uncertainty.",

        retryReply:
          "Think about what sales data tells the retailer about real customer behaviour.",

        points:
          6,
      }),

      createActivity({
        id:
          "bio-ortega-a5",

        type:
          "teach",

        title:
          "Speed as an Operating Asset",

        teacherPrompt:
          "Inditex became known for a highly responsive supply chain designed to move products from concept toward stores relatively quickly.",

        narrationText:
          "Speed can become an economic advantage when it reduces the time between observing customer demand and responding to it. But faster systems require coordination, logistics and disciplined operations.",

        visualTitle:
          "Time Can Be Capital",

        visualDescription:
          "Observe → design → produce → distribute → learn",

        story:
          "Two fashion supply chains race across the screen. One requires long forecasting cycles. The second updates more frequently as new store information arrives.",
      }),

      createActivity({
        id:
          "bio-ortega-a6",

        type:
          "case-study",

        title:
          "Large Production Run or Smaller Repeated Runs?",

        teacherPrompt:
          "A retailer can manufacture a very large quantity in advance, or initially produce smaller quantities and respond to demand later.",

        learnerInstruction:
          "What are the potential advantages and risks of each approach?",

        story:
          "Large runs may reduce unit production cost but increase inventory risk. Smaller repeated runs can provide flexibility but may cost more and require a highly responsive supply chain.",

        visualTitle:
          "Inventory Is a Capital Decision",

        visualDescription:
          "Lower unit cost versus flexibility and inventory risk",

        points:
          8,
      }),

      createActivity({
        id:
          "bio-ortega-a7",

        type:
          "teach",

        title:
          "Inditex: One Group, Multiple Brands",

        teacherPrompt:
          "Inditex eventually developed a portfolio of retail brands rather than relying exclusively on one Zara format.",

        narrationText:
          "A group can serve different customer segments through different brands. This may diversify revenue sources, but it also increases organisational complexity.",

        visualTitle:
          "Retail Portfolio",

        visualDescription:
          "Brands • formats • customer segments • shared infrastructure",

        story:
          "Several retail brands appear around a common logistics and corporate infrastructure layer.",
      }),

      createActivity({
        id:
          "bio-ortega-a8",

        type:
          "teach",

        title:
          "Founder Equity Became the Wealth Engine",

        teacherPrompt:
          "Ortega remained the controlling shareholder of Inditex. Public company filings have reported that his holdings through Pontegadea and Partler represent about 59.294% of Inditex.",

        narrationText:
          "This is the financial centre of the story. Ortega's fortune is not mainly explained by salary. It is strongly connected to retained ownership in the company he helped build.",

        visualTitle:
          "Control Through Ownership",

        visualDescription:
          "Ortega → Pontegadea / Partler → Inditex ownership",

        story:
          "AYO builds an ownership tree and highlights the difference between a founder selling most of their company and retaining a controlling stake.",
      }),

      createActivity({
        id:
          "bio-ortega-a9",

        type:
          "multiple-choice",

        title:
          "What Creates Founder Wealth?",

        teacherPrompt:
          "If a founder retains a large ownership stake in a successful listed company, what most directly affects the market value of that stake?",

        options: [
          {
            id: "a",
            label:
              "The market value of the shares they own.",
            value:
              "share-value",
          },
          {
            id: "b",
            label:
              "The size of the founder's salary alone.",
            value:
              "salary",
          },
          {
            id: "c",
            label:
              "The amount of cash inside every company store.",
            value:
              "store-cash",
          },
        ],

        correctOptionId:
          "a",

        successReply:
          "Correct. Large founder fortunes often reflect the market value of retained equity.",

        retryReply:
          "Focus on ownership rather than annual salary.",

        points:
          7,
      }),

      createActivity({
        id:
          "bio-ortega-a10",

        type:
          "teach",

        title:
          "From Retail Equity to Real Estate",

        teacherPrompt:
          "Pontegadea became associated with a substantial portfolio of commercial real estate in addition to Ortega's Inditex ownership.",

        narrationText:
          "This introduces a different kind of diversification. Wealth created through an operating business can be redirected into property producing rental income and providing exposure to a different asset class.",

        visualTitle:
          "Operating Business → Real Assets",

        visualDescription:
          "Retail equity → dividends / liquidity → commercial property",

        story:
          "Inditex shares remain on one side while offices and retail buildings appear on the other. AYO labels them separate economic engines.",
      }),

      createActivity({
        id:
          "bio-ortega-a11",

        type:
          "case-study",

        title:
          "Why Buy Property After Building a Retail Fortune?",

        teacherPrompt:
          "A founder whose wealth is heavily concentrated in one listed company may choose to direct some capital into real estate.",

        learnerInstruction:
          "What potential advantages and risks might commercial property add to the overall financial picture?",

        story:
          "Property can provide rental income and asset diversification, but it introduces vacancy risk, financing risk, maintenance costs, interest-rate sensitivity and illiquidity.",

        visualTitle:
          "Diversification Changes Risk",

        visualDescription:
          "Equity risk • property risk • income • liquidity • concentration",

        points:
          8,
      }),

      createActivity({
        id:
          "bio-ortega-a12",

        type:
          "teach",

        title:
          "Liquidity Matters",

        teacherPrompt:
          "Listed shares can often be sold relatively quickly in public markets. Large commercial properties usually require much more time to buy or sell.",

        narrationText:
          "Two assets can both be valuable while having very different liquidity. Financial literacy includes understanding not just return, but how quickly capital can be accessed.",

        visualTitle:
          "Value ≠ Liquidity",

        visualDescription:
          "Public shares: generally more liquid • property: generally less liquid",

        story:
          "AYO shows a share trade completing quickly while a building sale passes through valuation, negotiation and legal stages.",
      }),

      createActivity({
        id:
          "bio-ortega-a13",

        type:
          "teach",

        title:
          "Succession Without Founder Control of Daily Operations",

        teacherPrompt:
          "Ortega stepped down as Inditex chairman in 2011, while his family remained important shareholders. His daughter Marta Ortega became non-executive chair in 2022.",

        narrationText:
          "This demonstrates another distinction: ownership, board leadership and day-to-day executive management can be separated.",

        visualTitle:
          "Ownership ≠ Daily Management",

        visualDescription:
          "Shareholder • chair • board • chief executive • operating teams",

        story:
          "AYO separates five roles that learners often incorrectly combine into one word: owner.",
      }),

      createActivity({
        id:
          "bio-ortega-a14",

        type:
          "teach",

        title:
          "Inditex Is Not Ortega's Personal Wallet",

        teacherPrompt:
          "Inditex stores, inventories, warehouses, cash and corporate assets belong to Inditex. Ortega's financial interest comes through his ownership of shares and other private holdings.",

        narrationText:
          "Again, company assets, shareholder net worth and private personal assets must remain separate.",

        visualTitle:
          "Three Balance Sheets",

        visualDescription:
          "Inditex • Ortega ownership • private investments",

        story:
          "Three financial statements appear side by side and AYO prevents their assets from mixing.",
      }),

      createActivity({
        id:
          "bio-ortega-a15",

        type:
          "reflection",

        title:
          "The AYO Lesson",

        teacherPrompt:
          "Which idea from Ortega's journey stands out most: operations, speed, inventory, founder equity, retained control, real estate or succession?",

        narrationText:
          "Ortega's story shows that operational excellence can become financial value when it sits inside a business whose ownership is retained over time. It also shows how capital from one asset class can later move into another.",

        visualTitle:
          "Operations Became Ownership Value",

        visualDescription:
          "Production → retail → scale → equity → real estate",

        points:
          10,
      }),
    ],
  });