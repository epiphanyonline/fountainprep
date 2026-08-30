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

export const mukeshAmbaniLesson =
  createLesson({
    id:
      "greatness-foundation-ambani",

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
      5,

    title:
      "Mukesh Ambani: Family Enterprise, Infrastructure and Scale",

    description:
      "Explore Mukesh Ambani's role in Reliance Industries as the business expanded through petrochemicals, refining, retail and digital infrastructure.",

    objective:
      "The learner will understand how family enterprise, backward integration, infrastructure investment and controlling ownership can create a different capital journey from founder-led startups or investment companies.",

    learningOutcomes: [
      "Explain the concept of backward integration.",
      "Identify major stages in Reliance's expansion.",
      "Understand the difference between inherited business context and later execution.",
      "Recognise the role of capital expenditure in infrastructure businesses.",
      "Compare energy, retail and digital-service economic engines.",
      "Understand why family wealth, company assets and personal liquidity should be separated.",
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
          "bio-ambani-a1",

        type:
          "introduction",

        title:
          "A Fortune That Did Not Start With Him",

        teacherPrompt:
          "Mukesh Ambani's story begins inside an existing family enterprise. Reliance was founded by his father, Dhirubhai Ambani. That makes this biography especially useful for understanding intergenerational enterprise rather than pretending every major fortune starts from zero.",

        narrationText:
          "Some wealth journeys begin with a new founder. Others begin when the next generation inherits access, responsibility and an operating business. The financial question becomes: what happens to the capital next?",

        visualTitle:
          "Mukesh Ambani",

        visualDescription:
          "India • family enterprise • integration • infrastructure • telecom • retail",

        story:
          "AYO opens with two generations. Dhirubhai's original enterprise appears first. Mukesh enters later, and the business expands into new layers.",
      }),

      createActivity({
        id:
          "bio-ambani-a2",

        type:
          "teach",

        title:
          "Starting With an Existing Platform",

        teacherPrompt:
          "Reliance began as a family business before Mukesh Ambani became its chairman and managing director. He joined the business while it was already developing in textiles and related industries.",

        narrationText:
          "This means the starting capital, networks and business platform were not created entirely by him. Financial education should distinguish inheritance of opportunity from later expansion and execution.",

        visualTitle:
          "Inherited Platform ≠ Guaranteed Outcome",

        visualDescription:
          "Existing business • family capital • responsibility • execution",

        story:
          "A foundation already exists when the scene opens. AYO labels it inherited platform. New floors rise only after later investment decisions.",
      }),

      createActivity({
        id:
          "bio-ambani-a3",

        type:
          "teach",

        title:
          "Backward Integration",

        teacherPrompt:
          "Reliance describes Mukesh Ambani as having initiated its backward integration journey from textiles into polyester fibres, petrochemicals and petroleum refining, and later upstream oil and gas.",

        narrationText:
          "Backward integration means moving deeper into the supply chain toward inputs or production processes that a business previously bought from others.",

        visualTitle:
          "Backward Integration",

        visualDescription:
          "Textiles ← fibres ← petrochemicals ← refining ← resources",

        story:
          "AYO starts with a textile product and moves backwards through every major input required to produce it.",
      }),

      createActivity({
        id:
          "bio-ambani-a4",

        type:
          "multiple-choice",

        title:
          "Why Integrate Backward?",

        teacherPrompt:
          "Why might a company choose backward integration?",

        options: [
          {
            id: "a",
            label:
              "To gain greater control over important inputs and parts of the value chain.",
            value:
              "control-inputs",
          },
          {
            id: "b",
            label:
              "Because integration always reduces risk.",
            value:
              "always-safer",
          },
          {
            id: "c",
            label:
              "Because owning more stages guarantees higher profits.",
            value:
              "guarantee",
          },
        ],

        correctOptionId:
          "a",

        successReply:
          "Correct. Integration can increase control, but it also requires capital and can increase complexity.",

        retryReply:
          "Think about a manufacturer relying on suppliers for essential inputs.",

        points:
          6,
      }),

      createActivity({
        id:
          "bio-ambani-a5",

        type:
          "teach",

        title:
          "Jamnagar: Capital at Industrial Scale",

        teacherPrompt:
          "Mukesh Ambani led the development of Reliance's Jamnagar refining complex, which became one of the world's largest integrated refining locations.",

        narrationText:
          "A refinery is a productive asset, but one that requires enormous capital, infrastructure, engineering and time. This is capital expenditure at a completely different scale from opening a shop or buying listed shares.",

        visualTitle:
          "Capital Expenditure",

        visualDescription:
          "Land • engineering • refinery • port • power • infrastructure",

        story:
          "A huge industrial site assembles piece by piece while a capital meter rises. AYO contrasts the long investment period with the speed of buying a liquid security.",
      }),

      createActivity({
        id:
          "bio-ambani-a6",

        type:
          "case-study",

        title:
          "Would You Commit Billions Before Revenue?",

        teacherPrompt:
          "Large infrastructure projects can require years of spending before full productive capacity is available.",

        learnerInstruction:
          "What evidence should investors and managers examine before committing very large amounts of capital to a long-duration project?",

        story:
          "Potential considerations include future demand, financing costs, construction risk, regulation, input supply, expected margins, competitive capacity and the ability to survive delays.",

        visualTitle:
          "Long-Duration Capital",

        visualDescription:
          "Capital now → construction → uncertainty → future capacity",

        points:
          8,
      }),

      createActivity({
        id:
          "bio-ambani-a7",

        type:
          "teach",

        title:
          "From Industrial Assets to Consumer Markets",

        teacherPrompt:
          "Reliance later expanded strongly into retail, creating another economic engine very different from petrochemicals and refining.",

        narrationText:
          "A diversified enterprise can operate businesses with completely different customers, margins and capital requirements. Retail introduces stores, inventory, logistics, suppliers, data and consumer behaviour.",

        visualTitle:
          "A New Economic Engine",

        visualDescription:
          "Industrial production → consumer retail",

        story:
          "A refinery scene transitions into stores, warehouses and customers. AYO keeps the two business models visually separate.",
      }),

      createActivity({
        id:
          "bio-ambani-a8",

        type:
          "teach",

        title:
          "Jio and Digital Infrastructure",

        teacherPrompt:
          "Ambani also led Reliance's large expansion into digital connectivity through Jio, which developed extensive mobile and broadband infrastructure across India.",

        narrationText:
          "Telecommunications combines technology with infrastructure economics. The network requires substantial investment before each additional user can be served efficiently.",

        visualTitle:
          "Build the Network, Then Fill It",

        visualDescription:
          "Spectrum • towers • fibre • technology • subscribers",

        story:
          "A national network appears before customers. Subscriber dots then fill the network while AYO explains fixed-cost infrastructure.",
      }),

      createActivity({
        id:
          "bio-ambani-a9",

        type:
          "multiple-choice",

        title:
          "Why Can Scale Matter in Telecom?",

        teacherPrompt:
          "Why can customer scale be important after a telecommunications network has been built?",

        options: [
          {
            id: "a",
            label:
              "Because some major infrastructure costs are incurred before every individual customer joins.",
            value:
              "fixed-cost",
          },
          {
            id: "b",
            label:
              "Because every additional customer is completely free to serve.",
            value:
              "free",
          },
          {
            id: "c",
            label:
              "Because telecommunications companies cannot lose money.",
            value:
              "cannot-lose",
          },
        ],

        correctOptionId:
          "a",

        successReply:
          "Correct. Large infrastructure can create fixed costs that may be spread across more customers, although additional users still create costs.",

        retryReply:
          "Think about the network being built before a customer makes their first call.",

        points:
          7,
      }),

      createActivity({
        id:
          "bio-ambani-a10",

        type:
          "teach",

        title:
          "One Group, Multiple Growth Engines",

        teacherPrompt:
          "Reliance today operates across energy, petrochemicals, digital services, retail and other businesses.",

        narrationText:
          "This creates diversification inside the corporate group, but also complexity. Capital allocation becomes the process of deciding which businesses should receive more investment and which should generate cash for other uses.",

        visualTitle:
          "Capital Allocation Across Businesses",

        visualDescription:
          "Energy • chemicals • retail • digital • new energy",

        story:
          "Five businesses surround one capital-allocation hub. Capital arrows change direction as expected returns and strategic priorities change.",
      }),

      createActivity({
        id:
          "bio-ambani-a11",

        type:
          "case-study",

        title:
          "Where Should the Next Rupee Go?",

        teacherPrompt:
          "Imagine one division generates substantial cash while another requires heavy investment to grow.",

        learnerInstruction:
          "What should management consider before moving capital from the mature business into the growth business?",

        story:
          "Relevant questions include expected return on capital, risk, strategic value, funding needs, competitive position, debt capacity and whether shareholders might receive greater value from alternatives.",

        visualTitle:
          "Capital Has Competing Uses",

        visualDescription:
          "Reinvest • acquire • repay debt • hold cash • distribute",

        points:
          8,
      }),

      createActivity({
        id:
          "bio-ambani-a12",

        type:
          "teach",

        title:
          "Family Ownership and Corporate Governance",

        teacherPrompt:
          "Reliance remains strongly associated with the Ambani family. Mukesh Ambani's children now hold roles within parts of the broader business ecosystem.",

        narrationText:
          "Family enterprise creates a special financial question: how are ownership, leadership and responsibility transferred across generations without weakening the operating business?",

        visualTitle:
          "Family ≠ Automatic Governance",

        visualDescription:
          "Ownership • board • management • succession • accountability",

        story:
          "A family tree and an organisation chart appear separately. AYO links them only where formal corporate roles actually exist.",
      }),

      createActivity({
        id:
          "bio-ambani-a13",

        type:
          "teach",

        title:
          "Diversification Does Not Remove Concentration",

        teacherPrompt:
          "Even when a business group operates across several industries, a family's estimated wealth may remain heavily linked to the value of its ownership in that group.",

        narrationText:
          "This is an important subtlety. Corporate diversification and personal portfolio diversification are not necessarily the same thing.",

        visualTitle:
          "Two Different Diversifications",

        visualDescription:
          "Diversified company ≠ automatically diversified personal wealth",

        story:
          "One Reliance box branches into many industries. A separate Ambani ownership block remains heavily connected to the overall corporate group.",
      }),

      createActivity({
        id:
          "bio-ambani-a14",

        type:
          "teach",

        title:
          "Company Assets Are Not Personal Spending Money",

        teacherPrompt:
          "Reliance's refineries, retail businesses, telecom infrastructure and corporate cash belong to Reliance and its shareholders. They are not simply Mukesh Ambani's personal assets to spend.",

        narrationText:
          "Again we separate the corporation, the ownership interest and private personal assets. This distinction is fundamental when interpreting billionaire wealth.",

        visualTitle:
          "Corporate Assets ≠ Personal Cash",

        visualDescription:
          "Reliance assets • shareholder equity • estimated net worth • private liquidity",

        story:
          "A refinery, retail store and telecom network stay inside the corporate boundary while AYO places the ownership interest outside it.",
      }),

      createActivity({
        id:
          "bio-ambani-a15",

        type:
          "reflection",

        title:
          "The AYO Lesson",

        teacherPrompt:
          "Which concept from Ambani's journey is most important to your understanding: family enterprise, backward integration, infrastructure, diversification, capital expenditure or succession?",

        narrationText:
          "Ambani's biography reminds us that wealth can be inherited as opportunity but still requires decisions about reinvestment, risk, infrastructure and governance. Family capital can grow, stagnate or disappear depending on what happens next.",

        visualTitle:
          "Capital Across Generations",

        visualDescription:
          "Inherited platform → investment → integration → scale → succession",

        points:
          10,
      }),
    ],
  });