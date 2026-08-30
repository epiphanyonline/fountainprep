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

export const zhangYimingLesson =
  createLesson({
    id:
      "greatness-foundation-zhang",

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
      9,

    title:
      "Zhang Yiming: Algorithms, Private Equity and Global Scale",

    description:
      "Explore how Zhang Yiming co-founded ByteDance, built recommendation-driven digital products and created enormous founder wealth through ownership in a private technology company.",

    objective:
      "The learner will understand private-company equity, venture financing, algorithmic products, network scale and the special uncertainty involved in valuing privately held businesses.",

    learningOutcomes: [
      "Trace ByteDance's development from Toutiao to Douyin and TikTok.",
      "Explain private-company founder equity.",
      "Understand why recommendation algorithms can become part of a product's economic advantage.",
      "Explain venture-capital dilution and company valuation at an introductory level.",
      "Recognise the difference between private-company value and liquid personal wealth.",
      "Understand regulatory and geopolitical risk in global technology businesses.",
    ],

    estimatedMinutes:
      34,

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
          "bio-zhang-a1",

        type:
          "introduction",

        title:
          "Before TikTok",

        teacherPrompt:
          "Zhang Yiming is now closely associated with ByteDance and TikTok, but the business began before TikTok existed.",

        narrationText:
          "ByteDance was founded in 2012 during the rapid growth of mobile internet in China. Its early story was about personalised information rather than short-form video.",

        visualTitle:
          "Zhang Yiming",

        visualDescription:
          "China • mobile internet • Toutiao • algorithms • Douyin • TikTok • private equity",

        story:
          "AYO opens in Beijing in 2012. A smartphone appears before the TikTok logo exists. News articles rearrange themselves differently for different users.",
      }),

      createActivity({
        id:
          "bio-zhang-a2",

        type:
          "teach",

        title:
          "An Engineer Sees an Information Problem",

        teacherPrompt:
          "Zhang studied engineering at Nankai University and worked in technology before helping build ByteDance.",

        narrationText:
          "His opportunity was not simply 'make another website.' The emerging mobile internet created an enormous problem of information abundance: how do users find the content most relevant to them?",

        visualTitle:
          "Too Much Information",

        visualDescription:
          "Content abundance → filtering problem → recommendation opportunity",

        story:
          "Thousands of articles flood a phone screen until an algorithm begins ranking them for an individual user.",
      }),

      createActivity({
        id:
          "bio-zhang-a3",

        type:
          "teach",

        title:
          "ByteDance Begins",

        teacherPrompt:
          "ByteDance says it was founded in 2012 by a team led by Zhang Yiming and Rubo Liang. Its early flagship product Toutiao launched in August 2012.",

        narrationText:
          "The important economic idea is personalisation. Instead of depending only on users choosing specific publishers, the system could learn from behaviour and recommend content.",

        visualTitle:
          "Recommendation Engine",

        visualDescription:
          "User behaviour → data → ranking → content recommendation",

        story:
          "Two users open the same product and receive different content feeds. AYO highlights the algorithm between behaviour and recommendation.",
      }),

      createActivity({
        id:
          "bio-zhang-a4",

        type:
          "multiple-choice",

        title:
          "Why Can Personalisation Matter?",

        teacherPrompt:
          "Why might personalised recommendations be economically valuable to a digital platform?",

        options: [
          {
            id: "a",
            label:
              "They may increase the chance that users find relevant content and continue using the product.",
            value:
              "engagement",
          },
          {
            id: "b",
            label:
              "They guarantee every user will like everything shown.",
            value:
              "guarantee",
          },
          {
            id: "c",
            label:
              "They eliminate the need for any content creators.",
            value:
              "no-creators",
          },
        ],

        correctOptionId:
          "a",

        successReply:
          "Correct. Better recommendations can improve engagement, although they also create important questions about data, incentives and content quality.",

        retryReply:
          "Think about why a person might stay longer when the product becomes more relevant to them.",

        points:
          6,
      }),

      createActivity({
        id:
          "bio-zhang-a5",

        type:
          "teach",

        title:
          "Private Company, Real Ownership",

        teacherPrompt:
          "ByteDance is privately held rather than traded like NVIDIA or Inditex on a public stock exchange.",

        narrationText:
          "Private-company ownership is still genuine equity. But pricing the shares is more difficult because there is no continuously quoted public market price.",

        visualTitle:
          "Private Equity",

        visualDescription:
          "Founder shares • employee shares • investors • private valuation",

        story:
          "A public-market ticker disappears. In its place, private funding rounds and transactions provide occasional valuation reference points.",
      }),

      createActivity({
        id:
          "bio-zhang-a6",

        type:
          "teach",

        title:
          "Venture Capital and Dilution",

        teacherPrompt:
          "ByteDance raised outside investment as it developed. When new investors purchase newly issued shares, founders may own a smaller percentage of a larger company.",

        narrationText:
          "This is dilution. Owning a smaller percentage is not automatically bad if the new capital helps the overall company become substantially more valuable.",

        visualTitle:
          "Smaller Slice, Bigger Pie?",

        visualDescription:
          "Founder ownership percentage ↓ • company resources ↑ • company value uncertain",

        story:
          "AYO starts with a small pie owned mostly by founders. New investment enlarges the pie while the founder's percentage becomes smaller.",
      }),

      createActivity({
        id:
          "bio-zhang-a7",

        type:
          "case-study",

        title:
          "Would You Give Up Equity?",

        teacherPrompt:
          "Imagine you own 80% of a small technology company. An investor offers significant capital but your ownership would fall to 55%.",

        learnerInstruction:
          "What information would you want before deciding whether the dilution is worthwhile?",

        story:
          "Consider the valuation, amount of capital received, what the money will fund, investor expertise, governance rights, expected growth and whether the company could progress without the financing.",

        visualTitle:
          "Percentage Versus Enterprise Value",

        visualDescription:
          "Ownership % • valuation • new capital • control • future growth",

        points:
          8,
      }),

      createActivity({
        id:
          "bio-zhang-a8",

        type:
          "teach",

        title:
          "Douyin and Short Video",

        teacherPrompt:
          "ByteDance launched Douyin in China in 2016. Its global short-video product TikTok followed as the company expanded internationally.",

        narrationText:
          "Short video combined content creation, recommendation algorithms, mobile behaviour and global distribution into a highly scalable digital product.",

        visualTitle:
          "A New Content Format",

        visualDescription:
          "Creator → short video → recommendation → viewer → feedback",

        story:
          "One short video enters the system and reaches increasingly large groups of viewers as engagement data returns to the recommendation engine.",
      }),

      createActivity({
        id:
          "bio-zhang-a9",

        type:
          "teach",

        title:
          "Scale Without Building a Store in Every City",

        teacherPrompt:
          "Digital platforms can often reach new users without building a physical retail store for every additional location.",

        narrationText:
          "That does not mean digital businesses are costless. Servers, engineers, moderation, marketing, data centres and regulation all require resources. But the marginal economics can differ substantially from physical retail.",

        visualTitle:
          "Digital Scale",

        visualDescription:
          "Software • servers • creators • users • global distribution",

        story:
          "A physical retail map requires one building at a time. The digital platform expands across multiple countries through software infrastructure.",
      }),

      createActivity({
        id:
          "bio-zhang-a10",

        type:
          "multiple-choice",

        title:
          "Does Digital Mean Free?",

        teacherPrompt:
          "Does a digital platform have zero cost when it adds more users?",

        options: [
          {
            id: "a",
            label:
              "Yes. Software companies have no operating costs.",
            value:
              "zero-cost",
          },
          {
            id: "b",
            label:
              "No. Digital platforms still incur infrastructure, personnel, moderation, compliance and other costs.",
            value:
              "costs-remain",
          },
          {
            id: "c",
            label:
              "Yes. Internet distribution guarantees profit.",
            value:
              "guaranteed",
          },
        ],

        correctOptionId:
          "b",

        successReply:
          "Correct. Digital distribution can create attractive scale economics, but operating costs and risks remain.",

        retryReply:
          "Think about servers, engineers, moderation and regulatory compliance.",

        points:
          7,
      }),

      createActivity({
        id:
          "bio-zhang-a11",

        type:
          "teach",

        title:
          "Private Valuation Is Not a Bank Balance",

        teacherPrompt:
          "External publications estimate Zhang's wealth largely from his ownership in privately held ByteDance.",

        narrationText:
          "Private-company valuations can come from transactions, investor estimates and secondary-market information. They are not the same as cash available to the shareholder.",

        visualTitle:
          "Estimated Equity Value",

        visualDescription:
          "Company valuation × ownership interest ≠ personal cash",

        story:
          "A large valuation number appears. AYO places an ESTIMATE label over it and prevents the number from entering a bank-account graphic.",
      }),

      createActivity({
        id:
          "bio-zhang-a12",

        type:
          "teach",

        title:
          "Liquidity Risk in Private Equity",

        teacherPrompt:
          "A shareholder in a private company usually cannot sell shares as easily as someone trading a heavily traded public stock.",

        narrationText:
          "This introduces liquidity risk. An asset may be enormously valuable on paper while still being difficult to convert quickly into cash at the stated valuation.",

        visualTitle:
          "Valuable But Illiquid",

        visualDescription:
          "Private shares • limited buyers • transaction restrictions • uncertain price",

        story:
          "A private-equity certificate approaches an EXIT door but must pass approvals, buyers and pricing negotiations before moving through.",
      }),

      createActivity({
        id:
          "bio-zhang-a13",

        type:
          "case-study",

        title:
          "How Much Is a Private Company Worth?",

        teacherPrompt:
          "Suppose one investor values a private technology company at $200 billion while another transaction suggests $240 billion.",

        learnerInstruction:
          "Why might both figures exist at the same time, and what should a financial learner conclude?",

        story:
          "Private valuations depend on transaction terms, timing, share classes, investor expectations and available market information. A valuation should often be treated as a range or estimate rather than an exact cash value.",

        visualTitle:
          "Valuation Is an Opinion Supported by Evidence",

        visualDescription:
          "Transactions • assumptions • growth • risk • liquidity",

        points:
          8,
      }),

      createActivity({
        id:
          "bio-zhang-a14",

        type:
          "teach",

        title:
          "Global Scale Creates Political Risk",

        teacherPrompt:
          "TikTok's international growth has brought ByteDance into regulatory and geopolitical disputes in several countries, including concerns around data, ownership and national security.",

        narrationText:
          "This demonstrates that business risk is not only about customers and competitors. Regulation and geopolitics can materially affect the value and operating freedom of a global company.",

        visualTitle:
          "Regulatory Risk",

        visualDescription:
          "Markets • governments • data rules • ownership • geopolitical exposure",

        story:
          "A global map lights up, then regulatory barriers appear around several countries. AYO adds POLITICAL RISK beside the usual business-risk categories.",
      }),

      createActivity({
        id:
          "bio-zhang-a15",

        type:
          "reflection",

        title:
          "The AYO Lesson",

        teacherPrompt:
          "Which idea from Zhang's journey changed your understanding most: algorithms, private-company equity, venture capital, dilution, digital scale, valuation or regulatory risk?",

        narrationText:
          "Zhang's story shows that a fortune can exist largely through private ownership in an asset that cannot be priced every second or easily converted into cash. Financial literacy requires understanding both the value and the limitations of that ownership.",

        visualTitle:
          "Private Equity Is Still Equity",

        visualDescription:
          "Idea → product → funding → scale → private ownership → estimated value",

        points:
          10,
      }),
    ],
  });