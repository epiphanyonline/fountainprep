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

export const warrenBuffettLesson =
  createLesson({
    id:
      "greatness-foundation-buffett",

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
      2,

    title:
      "Warren Buffett: Compounding, Ownership and Capital Allocation",

    description:
      "Follow Warren Buffett from childhood business experiments through investment partnerships, Berkshire Hathaway, insurance float and the evolution of one of the world's best-known approaches to capital allocation.",

    objective:
      "The learner will understand how Buffett's wealth became closely connected to business ownership, compounding and the allocation of capital over long periods.",

    learningOutcomes: [
      "Identify important stages in Buffett's business and investment journey.",
      "Explain why ownership of productive businesses differs from simply earning income.",
      "Understand the basic financial idea behind insurance float.",
      "Explain how Buffett's investment philosophy evolved.",
      "Recognise the role of long holding periods in compounding.",
      "Distinguish Berkshire Hathaway's assets from Buffett's personal cash.",
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
          "bio-buffett-a1",

        type:
          "introduction",

        title:
          "Before Berkshire Hathaway",

        teacherPrompt:
          "Warren Buffett is closely associated with Berkshire Hathaway, but his story began decades before Berkshire became an investment and operating-company powerhouse.",

        narrationText:
          "Before the enormous shareholdings, insurance businesses and famous annual meetings, there was a young person fascinated by numbers, prices and businesses. Our question is not simply how Buffett became wealthy. We want to understand how his method of allocating capital developed.",

        visualTitle:
          "Warren Buffett",

        visualDescription:
          "Omaha • enterprise • investing • ownership • compounding",

        story:
          "AYO opens in Omaha, Nebraska. A timeline stretches across the screen: childhood enterprise → Columbia → Graham → partnerships → Berkshire → insurance → major business ownership.",
      }),

      createActivity({
        id:
          "bio-buffett-a2",

        type:
          "teach",

        title:
          "An Early Interest in Business",

        teacherPrompt:
          "Accounts of Buffett's childhood describe numerous small commercial activities, including selling products and operating paper routes. The important lesson is not the size of these ventures but the early habit of thinking about costs, revenues and accumulated capital.",

        narrationText:
          "Small businesses can teach large ideas. If you buy something for one amount and sell it for another, you begin thinking about margin. If you save part of the proceeds rather than spending everything, you begin accumulating capital.",

        visualTitle:
          "The Early Capital Loop",

        visualDescription:
          "Earn → retain → reinvest → accumulate",

        story:
          "Coins enter a simple four-stage loop. AYO removes some for spending but returns the retained portion to the beginning of the cycle.",
      }),

      createActivity({
        id:
          "bio-buffett-a3",

        type:
          "teach",

        title:
          "Benjamin Graham and a Framework",

        teacherPrompt:
          "Buffett studied at Columbia Business School, where Benjamin Graham taught. Graham's approach emphasised analysing securities as ownership interests and paying close attention to the relationship between price and underlying value.",

        narrationText:
          "This introduces one of the most important distinctions in investing: price and value are not automatically the same thing. A share has a market price, but an investor may attempt to estimate what the underlying business is worth.",

        visualTitle:
          "Price ≠ Value",

        visualDescription:
          "Market quotation on one side. Underlying business economics on the other.",

        story:
          "A stock-price ticker moves rapidly while a business illustration behind it changes much more slowly. AYO asks: 'Which one are you actually trying to understand?'",
      }),

      createActivity({
        id:
          "bio-buffett-a4",

        type:
          "multiple-choice",

        title:
          "A Share Is What?",

        teacherPrompt:
          "From a business-owner perspective, what does a share represent?",

        options: [
          {
            id: "a",
            label:
              "A guaranteed way to make money.",
            value:
              "guarantee",
          },
          {
            id: "b",
            label:
              "An ownership interest in a company.",
            value:
              "ownership",
          },
          {
            id: "c",
            label:
              "A bank deposit with a fixed value.",
            value:
              "deposit",
          },
        ],

        correctOptionId:
          "b",

        successReply:
          "Correct. A share represents an ownership interest. Its market price can rise or fall.",

        retryReply:
          "Think about what shareholders legally own.",

        points:
          6,
      }),

      createActivity({
        id:
          "bio-buffett-a5",

        type:
          "teach",

        title:
          "The Buffett Partnerships",

        teacherPrompt:
          "Before Berkshire became the centre of his business activities, Buffett managed investment partnerships. This stage moved the story from investing primarily his own capital toward allocating capital for a group of partners.",

        narrationText:
          "Managing other people's money introduces another dimension: stewardship. Investment performance matters, but so do discipline, communication and the rules governing how capital is managed.",

        visualTitle:
          "From Personal Capital to Partnership Capital",

        visualDescription:
          "Investor capital → partnership → investment decisions → gains or losses",

        story:
          "Several streams of capital flow into one partnership pool. AYO reminds the learner that pooled capital increases both opportunity and responsibility.",
      }),

      createActivity({
        id:
          "bio-buffett-a6",

        type:
          "teach",

        title:
          "Berkshire: The Investment That Changed Form",

        teacherPrompt:
          "Buffett acquired shares in Berkshire Hathaway when it was a struggling textile company. He later described the textile acquisition as a poor business decision, even though Berkshire itself eventually became the vehicle through which many other businesses and investments were owned.",

        narrationText:
          "This is one of the most useful parts of the story because successful investors also make mistakes. The textile economics remained difficult. Instead of pretending the original thesis was brilliant, the capital-allocation model eventually changed.",

        visualTitle:
          "A Mistake Can Become a Pivot",

        visualDescription:
          "Textiles → capital reallocation → insurance → businesses → investments",

        story:
          "An old textile mill fills the screen. Its margins narrow. The image recedes and Berkshire transforms into a holding-company structure with multiple businesses underneath it.",
      }),

      createActivity({
        id:
          "bio-buffett-a7",

        type:
          "case-study",

        title:
          "Cheap Business or Great Business?",

        teacherPrompt:
          "Imagine two companies. Company A is statistically very cheap but operates a weak business requiring repeated capital investment. Company B costs more but has strong economics and can generate substantial cash without continually consuming large amounts of new capital.",

        learnerInstruction:
          "Which business might deserve the higher valuation, and what additional information would you want before deciding?",

        story:
          "Buffett's investment approach evolved over time from an intense emphasis on bargain prices toward greater willingness to own exceptional businesses at sensible prices.",

        visualTitle:
          "Price Is Only Part of the Decision",

        visualDescription:
          "Cheap asset versus strong economic engine",

        points:
          8,
      }),

      createActivity({
        id:
          "bio-buffett-a8",

        type:
          "teach",

        title:
          "The Insurance Engine",

        teacherPrompt:
          "Insurance became central to Berkshire Hathaway. Insurers often receive premiums before all related claims are ultimately paid. Funds held during that interval are commonly described as insurance float.",

        narrationText:
          "Float is not free personal money. It comes with obligations because claims must be paid. But when insurance operations are managed effectively, large amounts of capital can be available for investment while those obligations remain outstanding.",

        visualTitle:
          "Insurance Float",

        visualDescription:
          "Premiums received → funds held → investments → future claims",

        story:
          "Premium payments enter an insurance reservoir. One pipe leads toward investments while another represents future claims. AYO warns: 'The liability never disappears just because the money is temporarily investable.'",
      }),

      createActivity({
        id:
          "bio-buffett-a9",

        type:
          "multiple-choice",

        title:
          "Is Float Buffett's Personal Cash?",

        teacherPrompt:
          "Which statement best describes insurance float?",

        options: [
          {
            id: "a",
            label:
              "It is Buffett's personal spending money.",
            value:
              "personal",
          },
          {
            id: "b",
            label:
              "It is capital held within insurance operations while future obligations remain.",
            value:
              "insurance-capital",
          },
          {
            id: "c",
            label:
              "It carries no financial obligations.",
            value:
              "no-obligation",
          },
        ],

        correctOptionId:
          "b",

        successReply:
          "Correct. Float can be economically valuable, but it exists alongside insurance liabilities.",

        retryReply:
          "Remember that insurers may still have claims to pay.",

        points:
          7,
      }),

      createActivity({
        id:
          "bio-buffett-a10",

        type:
          "teach",

        title:
          "See's Candies and Business Quality",

        teacherPrompt:
          "Berkshire's acquisition of See's Candies became an influential example in Buffett's thinking about businesses with strong brands, pricing power and attractive economics.",

        narrationText:
          "A business that can raise prices carefully without continually requiring enormous amounts of additional capital can behave very differently from a business that must constantly reinvest simply to remain competitive.",

        visualTitle:
          "Quality of the Economic Engine",

        visualDescription:
          "Brand • pricing power • cash generation • capital requirements",

        story:
          "Two machines appear. One consumes large amounts of capital to produce each new pound of earnings. The second requires less incremental capital. AYO compares their economics.",
      }),

      createActivity({
        id:
          "bio-buffett-a11",

        type:
          "teach",

        title:
          "From Stocks to Entire Businesses",

        teacherPrompt:
          "Berkshire's assets eventually came to include both marketable securities and entire operating businesses. This is an important distinction when examining Buffett's wealth and Berkshire's structure.",

        narrationText:
          "Buying shares and buying an entire company are both forms of ownership, but the degree of control differs. Berkshire has used both approaches.",

        visualTitle:
          "Two Forms of Ownership",

        visualDescription:
          "Public-company shares • wholly or substantially owned businesses",

        story:
          "The screen divides. On one side are certificates representing minority stakes. On the other are complete operating businesses. Both flow into Berkshire Hathaway.",
      }),

      createActivity({
        id:
          "bio-buffett-a12",

        type:
          "teach",

        title:
          "Compounding Needs Time",

        teacherPrompt:
          "Buffett's extraordinary long-term results are inseparable from time. Compounding means that returns can themselves become part of the capital base from which future returns are generated.",

        narrationText:
          "Compounding can look unimpressive at the beginning because the capital base is small. Over sufficiently long periods, the mathematics can become dramatically different. But returns are never guaranteed, and losses also affect the compounding path.",

        visualTitle:
          "Time Changes the Curve",

        visualDescription:
          "Capital → return → larger capital base → future return",

        story:
          "A relatively flat line begins to curve upward as decades pass. AYO then introduces several downward years to show that real investment paths are not smooth.",
      }),

      createActivity({
        id:
          "bio-buffett-a13",

        type:
          "case-study",

        title:
          "Sell or Continue Owning?",

        teacherPrompt:
          "Suppose you own part of an excellent company. Its underlying business continues to grow, but its share price has risen substantially since you purchased it.",

        learnerInstruction:
          "What questions should an owner consider before deciding whether to sell simply because the price has increased?",

        story:
          "A long-term owner might consider business quality, valuation, alternative opportunities, taxes, risk and whether the original investment thesis still holds. A rising price alone does not answer every question.",

        visualTitle:
          "The Owner's Decision",

        visualDescription:
          "Business quality • valuation • alternatives • risk • time horizon",

        points:
          8,
      }),

      createActivity({
        id:
          "bio-buffett-a14",

        type:
          "teach",

        title:
          "Buffett's Wealth Is Not Berkshire's Bank Account",

        teacherPrompt:
          "Buffett's personal net worth is strongly connected to the value of his Berkshire Hathaway ownership. Berkshire's cash, securities and operating companies belong to Berkshire and its shareholders; they are not simply Buffett's personal assets to spend.",

        narrationText:
          "This distinction matters whenever we study billionaires. Company assets, shareholder wealth and personal liquidity are three different concepts.",

        visualTitle:
          "Three Different Things",

        visualDescription:
          "Company assets ≠ shareholder net worth ≠ personal cash",

        story:
          "Three vaults appear separately labelled BERKSHIRE ASSETS, BUFFETT'S OWNERSHIP INTEREST and PERSONAL LIQUIDITY. AYO prevents the three from merging.",
      }),

      createActivity({
        id:
          "bio-buffett-a15",

        type:
          "reflection",

        title:
          "The AYO Lesson",

        teacherPrompt:
          "Which part of Buffett's journey changed your understanding most: business ownership, investment mistakes, insurance float, business quality, capital allocation or compounding?",

        narrationText:
          "Buffett's story is not a promise that buying stocks produces extraordinary wealth. It is a case study in ownership, disciplined capital allocation, evolving judgment and extraordinarily long time horizons.",

        visualTitle:
          "Think Like an Owner",

        visualDescription:
          "Ownership → allocation → quality → patience → compounding",

        points:
          10,
      }),
    ],
  });