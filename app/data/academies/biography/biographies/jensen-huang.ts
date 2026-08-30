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

export const jensenHuangLesson =
  createLesson({
    id:
      "greatness-foundation-huang",

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
      7,

    title:
      "Jensen Huang: Technology, Founder Equity and Long-Term Company Building",

    description:
      "Explore how Jensen Huang co-founded NVIDIA in 1993, remained at the centre of the business through decades of technological change, and built wealth largely through founder equity.",

    objective:
      "The learner will understand how long-term founder ownership, technological bets, reinvestment and concentrated equity can create both extraordinary upside and significant risk.",

    learningOutcomes: [
      "Trace NVIDIA's development from graphics computing to accelerated computing and AI.",
      "Explain founder equity and concentration.",
      "Understand why technology companies make long-duration research bets.",
      "Recognise platform economics.",
      "Understand the financial implications of product cycles and technological risk.",
      "Separate NVIDIA's corporate value from Huang's personal liquidity.",
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
          "bio-huang-a1",

        type:
          "introduction",

        title:
          "Before AI Became the Headline",

        teacherPrompt:
          "Jensen Huang is now strongly associated with artificial intelligence, but NVIDIA was founded in 1993, decades before today's generative-AI boom.",

        narrationText:
          "This is a story about time horizon. The company was not created around today's hottest trend. Its technology evolved through graphics, gaming, accelerated computing and eventually AI.",

        visualTitle:
          "Jensen Huang",

        visualDescription:
          "Semiconductors • graphics • GPU • accelerated computing • AI • founder equity",

        story:
          "AYO starts in 1993. A graphics chip appears. The timeline moves through 1999, gaming, CUDA, data centres and generative AI.",
      }),

      createActivity({
        id:
          "bio-huang-a2",

        type:
          "teach",

        title:
          "The Starting Environment",

        teacherPrompt:
          "Before NVIDIA, Huang worked at companies including LSI Logic and AMD and studied electrical engineering at Oregon State University and Stanford.",

        narrationText:
          "Professional experience matters because founding a semiconductor company requires technical understanding, industry knowledge and a network of people who understand highly complex products.",

        visualTitle:
          "Technical Capital",

        visualDescription:
          "Engineering • industry experience • network • opportunity",

        story:
          "AYO places four forms of capital on screen: financial, technical, social and intellectual. The company cannot start with money alone.",
      }),

      createActivity({
        id:
          "bio-huang-a3",

        type:
          "teach",

        title:
          "Founding NVIDIA",

        teacherPrompt:
          "Huang co-founded NVIDIA in 1993 and has remained its chief executive since inception.",

        narrationText:
          "Founder continuity over more than three decades is unusual. It creates the possibility of long strategic time horizons, but it also concentrates leadership responsibility.",

        visualTitle:
          "Founder + Operator",

        visualDescription:
          "Founder equity • executive control • strategy • long time horizon",

        story:
          "A founder certificate and CEO chair appear side by side. AYO highlights that founder and manager can be the same person, but they are different roles.",
      }),

      createActivity({
        id:
          "bio-huang-a4",

        type:
          "multiple-choice",

        title:
          "Founder Equity Means What?",

        teacherPrompt:
          "What is founder equity?",

        options: [
          {
            id: "a",
            label:
              "Ownership shares held by someone involved in founding the company.",
            value:
              "ownership",
          },
          {
            id: "b",
            label:
              "A guaranteed annual cash payment.",
            value:
              "guarantee",
          },
          {
            id: "c",
            label:
              "Money belonging to every employee equally.",
            value:
              "employee-money",
          },
        ],

        correctOptionId:
          "a",

        successReply:
          "Correct. Founder equity represents ownership, and its value can rise or fall with the company.",

        retryReply:
          "Think about shares, not salary.",

        points:
          6,
      }),

      createActivity({
        id:
          "bio-huang-a5",

        type:
          "teach",

        title:
          "The GPU Bet",

        teacherPrompt:
          "NVIDIA introduced the GeForce 256 in 1999 and popularised the term GPU — graphics processing unit.",

        narrationText:
          "A specialised processor designed to handle many calculations in parallel became extremely useful for graphics. Years later, that same parallel-computing capability would prove valuable for scientific computing and AI.",

        visualTitle:
          "One Capability, New Uses",

        visualDescription:
          "Graphics → parallel computing → scientific workloads → AI",

        story:
          "A GPU begins rendering game graphics. The same architecture then processes scientific simulations and neural-network calculations.",
      }),

      createActivity({
        id:
          "bio-huang-a6",

        type:
          "teach",

        title:
          "Technology Bets Are Capital Allocation",

        teacherPrompt:
          "Research and development requires companies to spend money today without certainty that the resulting technology will generate sufficient future revenue.",

        narrationText:
          "A technology roadmap is therefore also a capital-allocation roadmap. Management chooses which engineering problems deserve scarce people, time and money.",

        visualTitle:
          "R&D Is an Investment Decision",

        visualDescription:
          "Cash → engineers → research → product → uncertain commercial return",

        story:
          "Capital flows into several research projects. Some produce products, some are abandoned and one creates a new platform.",
      }),

      createActivity({
        id:
          "bio-huang-a7",

        type:
          "case-study",

        title:
          "Fund Today's Product or Tomorrow's Platform?",

        teacherPrompt:
          "A successful technology company can spend heavily improving its current products or invest in a platform whose market may not be large for years.",

        learnerInstruction:
          "What evidence would help management decide how much capital to allocate to each?",

        story:
          "Management might consider market growth, technical feasibility, customer demand, competitive advantage, cost, time horizon and whether the new technology can serve multiple future markets.",

        visualTitle:
          "Exploit or Explore?",

        visualDescription:
          "Today's revenue versus tomorrow's uncertain opportunity",

        points:
          8,
      }),

      createActivity({
        id:
          "bio-huang-a8",

        type:
          "teach",

        title:
          "CUDA and Platform Economics",

        teacherPrompt:
          "NVIDIA launched CUDA in 2006, giving developers tools to use NVIDIA GPUs for general-purpose computing.",

        narrationText:
          "This is important because hardware alone can be copied or replaced. A software ecosystem can make the platform more useful by giving developers tools, libraries and accumulated knowledge.",

        visualTitle:
          "Hardware + Software Ecosystem",

        visualDescription:
          "GPU • CUDA • developers • libraries • applications",

        story:
          "A chip sits at the centre. Software layers and developer tools accumulate around it until the product becomes an ecosystem.",
      }),

      createActivity({
        id:
          "bio-huang-a9",

        type:
          "multiple-choice",

        title:
          "Why Can Ecosystems Matter?",

        teacherPrompt:
          "Why can a developer ecosystem strengthen a technology platform?",

        options: [
          {
            id: "a",
            label:
              "Because tools, software and accumulated knowledge can make the platform more useful and harder to replace.",
            value:
              "ecosystem",
          },
          {
            id: "b",
            label:
              "Because ecosystems guarantee permanent monopoly.",
            value:
              "monopoly",
          },
          {
            id: "c",
            label:
              "Because software eliminates hardware costs.",
            value:
              "no-hardware",
          },
        ],

        correctOptionId:
          "a",

        successReply:
          "Correct. Ecosystems can create switching costs and usefulness, but they never eliminate competition.",

        retryReply:
          "Think about what developers lose if they switch to an entirely different platform.",

        points:
          7,
      }),

      createActivity({
        id:
          "bio-huang-a10",

        type:
          "teach",

        title:
          "AI Changes the Scale",

        teacherPrompt:
          "Demand for accelerated computing increased dramatically as machine learning and generative AI required enormous computing resources.",

        narrationText:
          "When an existing technology suddenly becomes central to a much larger market, revenue expectations and company valuation can change very quickly.",

        visualTitle:
          "Demand Shock",

        visualDescription:
          "Gaming → data centres → AI training → inference",

        story:
          "A demand chart expands sharply as new workloads appear. AYO warns that rapid growth can also create valuation and capacity risk.",
      }),

      createActivity({
        id:
          "bio-huang-a11",

        type:
          "teach",

        title:
          "Concentrated Founder Wealth",

        teacherPrompt:
          "Huang's estimated wealth is strongly linked to his ownership of NVIDIA shares.",

        narrationText:
          "That creates enormous upside when the company rises in value, but it also means that a large part of the fortune can depend on one company's market value.",

        visualTitle:
          "Concentration",

        visualDescription:
          "Founder equity • company valuation • upside • downside",

        story:
          "One ownership block dominates the screen while smaller asset categories remain faint. AYO labels this concentrated equity exposure.",
      }),

      createActivity({
        id:
          "bio-huang-a12",

        type:
          "case-study",

        title:
          "Would You Diversify?",

        teacherPrompt:
          "Suppose most of your wealth comes from shares in the company you lead and understand deeply.",

        learnerInstruction:
          "What arguments support keeping a concentrated position, and what arguments support diversifying some of it?",

        story:
          "Concentration can preserve control and exposure to future upside. Diversification can reduce dependence on one company, sector or valuation. Neither choice is automatically correct without considering objectives and risk.",

        visualTitle:
          "Conviction Versus Diversification",

        visualDescription:
          "Control • knowledge • upside versus concentration risk",

        points:
          8,
      }),

      createActivity({
        id:
          "bio-huang-a13",

        type:
          "teach",

        title:
          "The Risk of Technological Leadership",

        teacherPrompt:
          "Technology leadership can be powerful but fragile. Competitors, regulation, supply constraints, product errors or a change in computing architecture can alter an industry's economics.",

        narrationText:
          "A company that is dominant today still has to invest for tomorrow. Technology rewards innovation but punishes complacency.",

        visualTitle:
          "Leadership Is Not Permanent",

        visualDescription:
          "Competition • product cycles • supply • regulation • disruption",

        story:
          "A market-leader crown appears, then cracks into five risk categories. AYO removes the word permanent.",
      }),

      createActivity({
        id:
          "bio-huang-a14",

        type:
          "teach",

        title:
          "NVIDIA's Assets Are Not Huang's Personal Cash",

        teacherPrompt:
          "NVIDIA's cash, intellectual property, offices, inventory and other corporate assets belong to NVIDIA. Huang's personal financial interest is connected to the shares and other assets he owns.",

        narrationText:
          "Once again, company value, shareholder wealth and personal liquidity must remain distinct.",

        visualTitle:
          "Company ≠ Founder Wallet",

        visualDescription:
          "NVIDIA assets • Huang equity • estimated wealth • private liquidity",

        story:
          "Corporate assets remain inside a bright NVIDIA boundary while AYO places Huang's ownership certificate outside it.",
      }),

      createActivity({
        id:
          "bio-huang-a15",

        type:
          "reflection",

        title:
          "The AYO Lesson",

        teacherPrompt:
          "Which idea from Huang's journey changed your understanding most: founder equity, technological bets, R&D, platform economics, concentration or long-term company building?",

        narrationText:
          "Huang's story shows how intellectual capital and technological infrastructure can become financial capital when they are embedded in a valuable business and accompanied by retained ownership.",

        visualTitle:
          "Technology Became Ownership Value",

        visualDescription:
          "Engineering → platform → ecosystem → scale → founder equity",

        points:
          10,
      }),
    ],
  });