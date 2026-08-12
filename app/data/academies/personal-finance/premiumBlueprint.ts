export type FinancialLiteracyAccess =
  | "free"
  | "premium";

export type FinancialLiteracySimulation =
  | "money-lab"
  | "income-vs-wealth-lab"
  | "budget-lab"
  | "debt-lab"
  | "compound-growth-lab"
  | "asset-discovery-lab"
  | "asset-class-lab"
  | "portfolio-lab"
  | "market-order-lab"
  | "crisis-lab"
  | "retirement-lab"
  | "financial-freedom-lab"
  | "career-capital-lab"
  | "insurance-lab"
  | "business-finance-lab"
  | "financial-statements-lab"
  | "tax-scenario-lab"
  | "currency-inflation-lab"
  | "estate-planning-lab"
  | "wealth-transfer-lab";

export type FinancialLiteracyModule = {
  id: string;
  title: string;
  description: string;
  access: FinancialLiteracyAccess;
  estimatedLessons: number;
  learningOutcomes: readonly string[];
  topics: readonly string[];
  simulations?: readonly FinancialLiteracySimulation[];
  premiumExperiences?: readonly string[];
};

export type FinancialLiteracyStage = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  access: FinancialLiteracyAccess;
  estimatedLessons: number;
  outcome: string;
  modules: readonly FinancialLiteracyModule[];
  signatureExperiences?: readonly string[];
  capstone?: string;
};

export const financialLiteracyPremiumBlueprint = {
  academy: "personal-finance",

  publicName: "Financial Literacy Academy",

  positioning:
    "Begin your financial literacy journey by understanding the difference between income and wealth, learning the rules of money, discovering the asset classes that create value, and progressing through markets, portfolio skills, financial independence and wealth transfer.",

  promise:
    "Build deep financial knowledge and practical decision-making capability across the full financial life cycle — from everyday money choices to asset ownership, investing, portfolio management, retirement and intergenerational wealth.",

  accessModel: {
    foundation: "free",
    premium: "premium",
    freeLearnersCanViewPremiumCurriculum: true,
    freeLearnersCanOpenPremiumLessons: false,
    freeLearnersCanUsePremiumSimulations: false,
    showPremiumLearningOutcomes: true,
    showPremiumLessonCounts: true,
    showPremiumSimulationNames: true,
  },

  premiumExperience: {
    philosophy:
      "Premium means depth, application and measurable capability — not longer reading pages.",
    learningModes: [
      "Presentation-led teaching",
      "Plain-language explanation",
      "Worked financial examples",
      "Fictional household and business cases",
      "Interactive decision simulations",
      "Ayo AI questioning and explanation",
      "Explain-it-back activities",
      "Common-mistake diagnostics",
      "Scenario comparison",
      "Mastery quizzes",
      "Stage capstones",
      "Portfolio and financial-life projects",
    ],
    recurringPremiumElements: [
      "FountainPrep Case Study",
      "Decision Lab",
      "Explain It Back",
      "Common Money Mistake",
      "Ayo Challenge",
      "Simulation",
      "Mastery Check",
      "Real-World Connection",
      "Reflection and Next Decision",
    ],
    learnerProgression: [
      "Understand",
      "Explain",
      "Compare",
      "Calculate",
      "Decide",
      "Simulate",
      "Defend",
      "Master",
    ],
  },

  learningPrinciples: [
    "Understand before applying.",
    "Teach the difference between income and wealth early.",
    "Teach the rules of money before complex investing.",
    "Understand assets before studying markets in depth.",
    "Practise decisions in a safe environment.",
    "Use fictional scenarios rather than personalised investment recommendations.",
    "Show the consequences of financial decisions over time.",
    "Teach risk alongside potential reward.",
    "Connect financial concepts to households, careers, businesses and markets.",
    "Teach creation and ownership of assets, not only consumption and purchase.",
    "Revisit behavioural finance throughout the journey.",
    "Measure understanding, not simply page views.",
  ],

  lessonPattern: [
    "hook",
    "teach",
    "explain-simply",
    "example",
    "visual",
    "knowledge-check",
    "practice",
    "ask-ayo",
    "decision-lab",
    "mini-quiz",
    "progress",
  ],

  assessmentModel: {
    diagnosticAtStageStart: true,
    knowledgeChecksWithinLessons: true,
    moduleMasteryChecks: true,
    stageCapstones: true,
    explainReasoningRequired: true,
    simulationsCanContributeToMastery: true,
    retriesAllowed: true,
  },

  mastery: {
    masteredMinimumPercent: 80,
    developingMinimumPercent: 60,
    belowDevelopingLabel: "Review Recommended",
    developingLabel: "Developing",
    masteredLabel: "Mastered",
    remediationActions: [
      "Review lesson",
      "Ask Ayo",
      "Try another example",
      "Open a worked example",
      "Retry the decision lab",
      "Retake quiz",
    ],
  },

  stages: [    
    {
      id: "money-rules",
      title: "Money Is a Game — Know the Rules",
      eyebrow: "Stage 1 · Premium",
      description:
        "Understand the rules that shape financial outcomes — how people create value, control cash flow, use debt, protect themselves from setbacks and turn retained money into productive assets.",
      access: "premium",
      estimatedLessons: 20,
      outcome:
        "Understand the core financial rules that connect income, spending, saving, debt, risk, ownership and long-term wealth building.",
    
      modules: [
        {
          id: "creating-value",
          title: "Rule 1 — Money Follows Value",
          description:
            "Understand how skills, work, enterprise and useful solutions create earning capacity.",
          access: "premium",
          estimatedLessons: 4,
          learningOutcomes: [
            "Understand the relationship between value creation and income.",
            "Recognise human capital as productive capacity.",
            "Understand why earning more is useful only when paired with good financial decisions.",
          ],
          topics: [
            "Value creation",
            "Skills",
            "Human capital",
            "Income",
            "Earning capacity",
            "Enterprise",
          ],
        },
    
        {
          id: "keeping-money",
          title: "Rule 2 — Keep Part of What You Earn",
          description:
            "Understand cash flow, lifestyle inflation and why retaining part of income creates financial options.",
          access: "premium",
          estimatedLessons: 4,
          learningOutcomes: [
            "Understand positive cash flow.",
            "Recognise lifestyle inflation.",
            "Explain why saving creates future financial capacity.",
          ],
          topics: [
            "Cash flow",
            "Saving",
            "Lifestyle inflation",
            "Spending discipline",
            "Financial surplus",
          ],
          simulations: ["budget-lab"],
        },
    
        {
          id: "protecting-money",
          title: "Rule 3 — Protect What You Build",
          description:
            "Learn how emergency reserves, insurance and sensible debt management can protect financial progress.",
          access: "premium",
          estimatedLessons: 4,
          learningOutcomes: [
            "Understand financial resilience.",
            "Recognise the role of emergency funds.",
            "Understand how high-cost debt can damage financial progress.",
          ],
          topics: [
            "Emergency funds",
            "Insurance",
            "Debt",
            "Interest",
            "Financial risk",
            "Resilience",
          ],
          simulations: ["debt-lab"],
        },
    
        {
          id: "ownership-rule",
          title: "Rule 4 — Ownership Changes the Game",
          description:
            "Understand why long-term wealth often depends on owning or creating assets rather than relying only on earned income.",
          access: "premium",
          estimatedLessons: 4,
          learningOutcomes: [
            "Understand the role of ownership in wealth building.",
            "Recognise productive assets.",
            "Distinguish earned income from asset-generated income.",
          ],
          topics: [
            "Ownership",
            "Productive assets",
            "Asset income",
            "Business ownership",
            "Investment ownership",
          ],
        },
    
        {
          id: "time-compounding-rule",
          title: "Rule 5 — Time Can Multiply Good Decisions",
          description:
            "Understand how consistency, compounding and time can magnify financial decisions.",
          access: "premium",
          estimatedLessons: 4,
          learningOutcomes: [
            "Understand compounding.",
            "Explain why time matters in wealth building.",
            "Recognise the importance of consistency over speculation.",
          ],
          topics: [
            "Compounding",
            "Time horizon",
            "Consistency",
            "Long-term investing",
            "Behaviour",
          ],
          simulations: ["compound-growth-lab"],
        },
      ],
      signatureExperiences: [
        "Lifestyle inflation case study",
        "Career-capital decision lab",
        "Debt and resilience stress test",
        "Ownership vs consumption challenge",
        "Compounding timeline simulation",
      ],
      capstone:
        "Diagnose a fictional person's financial system and redesign the rules they are following to improve long-term wealth-building capacity."
    },

    {
          id: "financial-foundations",
          title: "High Income Is Not Wealth",
          eyebrow: "Stage 2 · Foundation · Free",
          description:
            "Begin by separating income from wealth, then build the money-management foundation required for everything that follows: value and choice, saving, cash flow, borrowing, net worth, assets and investing.",
          access: "free",
          estimatedLessons: 24,
          outcome:
            "Stop judging financial progress by income alone. Build strong money habits, understand net worth and discover the wider world of assets — enough to recognise what can be owned, created or used to build future economic value.",
          modules: [
            {
              id: "money-value-choice",
              title: "Money, Value and Choice",
              description:
                "Understand what money does, how choices affect finances and why every financial decision involves a trade-off.",
              access: "free",
              estimatedLessons: 4,
              learningOutcomes: [
                "Explain the basic purpose of money.",
                "Distinguish needs from wants.",
                "Understand opportunity cost.",
                "Recognise how financial choices affect future options.",
              ],
              topics: [
                "What money is",
                "Income and spending",
                "Needs and wants",
                "Opportunity cost",
                "Short-term versus long-term choices",
              ],
              simulations: ["money-lab"],
            },
            {
              id: "saving-goals",
              title: "Saving With a Purpose",
              description:
                "Build saving habits around emergencies, goals and future opportunities.",
              access: "free",
              estimatedLessons: 4,
              learningOutcomes: [
                "Explain why people save.",
                "Create short-, medium- and long-term savings goals.",
                "Understand emergency funds.",
                "Recognise the difference between saving and investing.",
              ],
              topics: [
                "Saving goals",
                "Emergency funds",
                "Sinking funds",
                "Saving rate",
                "Saving versus investing",
              ],
            },
            {
              id: "budget-cash-flow",
              title: "Budgeting and Cash Flow",
              description:
                "Learn how money enters and leaves a household and how a budget creates control and choice.",
              access: "free",
              estimatedLessons: 4,
              learningOutcomes: [
                "Identify income and expenses.",
                "Distinguish fixed, variable and discretionary costs.",
                "Build a simple working budget.",
                "Explain positive and negative cash flow.",
              ],
              topics: [
                "Income",
                "Expenses",
                "Fixed costs",
                "Variable costs",
                "Discretionary spending",
                "Cash flow",
                "Budgeting",
              ],
              simulations: ["budget-lab"],
            },
            {
              id: "borrowing-interest",
              title: "Borrowing, Interest and Debt",
              description:
                "Understand what borrowing costs and why compound interest can either support or damage financial progress.",
              access: "free",
              estimatedLessons: 4,
              learningOutcomes: [
                "Explain borrowing and repayment.",
                "Understand basic interest.",
                "Recognise that debt has a cost.",
                "Compare simple repayment choices.",
              ],
              topics: [
                "Loans",
                "Interest",
                "APR introduction",
                "Minimum payments",
                "Debt repayment",
              ],
            },
            {
              id: "assets-liabilities",
              title: "Assets, Asset Classes & Net Worth",
              description:
                "Discover what an asset is, how an asset differs from an asset class, why assets create value and how assets and liabilities shape net worth.",
              access: "free",
              estimatedLessons: 4,
              learningOutcomes: [
                "Define an asset in professional and simple language.",
                "Distinguish an individual asset from an asset class.",
                "Calculate simple net worth.",
                "Recognise that assets can be tangible or intangible, productive or non-income-producing, liquid or illiquid.",
                "Recognise major asset families such as cash, fixed income, equities, property, businesses, commodities, intellectual property and digital assets.",
              ],
              topics: [
                "What is an asset?",
                "Asset vs asset class",
                "Assets and liabilities",
                "Net worth",
                "Tangible and intangible assets",
                "Financial and real assets",
                "Productive and non-income-producing assets",
                "Liquid and illiquid assets",
                "Cash and cash equivalents",
                "Fixed income",
                "Equities",
                "Real estate",
                "Businesses",
                "Commodities",
                "Intellectual property",
                "Digital assets",
                "Human capital introduction",
                "Where does an asset's value come from?",
              ],
              simulations: ["asset-discovery-lab"],
            },
            {
              id: "investment-foundations",
              title: "Introduction to Investing",
              description:
                "Learn why people invest, what risk means and why diversification matters.",
              access: "free",
              estimatedLessons: 4,
              learningOutcomes: [
                "Explain saving versus investing.",
                "Understand risk and return.",
                "Explain diversification simply.",
                "Recognise that investments can rise or fall.",
              ],
              topics: [
                "Why people invest",
                "Risk and return",
                "Diversification",
                "Time horizon",
                "Liquidity",
              ],
            },
          ],
          signatureExperiences: [
            "High Income vs Wealth diagnostic case",
            "100-point cash-flow challenge",
            "Asset Universe discovery lab",
            "First net-worth calculation",
            "Foundation financial decision capstone",
          ],
          capstone:
            "Explain why income is not wealth and use a fictional household case to improve cash flow, net worth and future asset-building capacity."
        },


    {
          id: "understanding-assets",
          title: "The Asset Classes That Create Wealth & Financial Independence",
          eyebrow: "Stage 3 · Premium",
          description:
            "Explore the full world of assets — from cash, bonds, shares and property to private businesses, infrastructure, intellectual property, royalties, digital assets and productive resources.",
          access: "premium",
          estimatedLessons: 44,
          outcome:
            "Develop the ability to analyse almost any asset by understanding what gives it value, how returns can arise, its risks and liquidity, the rights attached to it and whether it can be purchased, created, licensed or partially owned.",
          modules: [
            {
              id: "asset-lens",
              title: "The FountainPrep Asset Lens",
              description:
                "Learn what an asset is, how an asset differs from an asset class and how to analyse assets across several dimensions rather than forcing each asset into one rigid box.",
              access: "premium",
              estimatedLessons: 4,
              learningOutcomes: [
                "Distinguish an asset from an asset class.",
                "Compare tangible and intangible assets.",
                "Compare financial and real assets.",
                "Distinguish productive from primarily non-income-producing assets.",
                "Compare liquid and illiquid assets.",
                "Use the FountainPrep Asset Lens to analyse unfamiliar assets.",
              ],
              topics: [
                "Asset",
                "Asset class",
                "Tangible assets",
                "Intangible assets",
                "Financial assets",
                "Real assets",
                "Productive assets",
                "Non-income-producing assets",
                "Income-producing assets",
                "Appreciating assets",
                "Depreciating assets",
                "Liquid assets",
                "Illiquid assets",
                "Public assets",
                "Private assets",
                "Ownership and control",
              ],
              simulations: ["asset-class-lab"],
            },
            {
              id: "cash-fixed-income-assets",
              title: "Cash & Fixed-Income Assets",
              description:
                "Understand cash, deposits, money-market instruments, Treasury securities, government bonds, corporate bonds and other lending-based assets.",
              access: "premium",
              estimatedLessons: 5,
              learningOutcomes: [
                "Explain why cash is valuable and highly liquid.",
                "Explain how many fixed-income investments represent lending to an issuer.",
                "Understand principal, coupon, yield and maturity.",
                "Recognise inflation, currency, credit and interest-rate risk.",
              ],
              topics: [
                "Physical cash",
                "Current accounts",
                "Savings accounts",
                "Deposits",
                "Money-market instruments",
                "Treasury bills",
                "Certificates of deposit",
                "Government bonds",
                "Corporate bonds",
                "Municipal or local-government debt",
                "Sukuk",
                "Investment-grade debt",
                "High-yield debt",
                "Principal",
                "Coupon",
                "Yield",
                "Maturity",
                "Credit risk",
                "Interest-rate risk",
                "Default",
                "Bond price",
              ],
            },
            {
              id: "equity-business-ownership",
              title: "Equity & Business Ownership",
              description:
                "Understand ownership through public shares, private businesses, startup equity, founder equity and private investment.",
              access: "premium",
              estimatedLessons: 5,
              learningOutcomes: [
                "Explain why a share represents ownership rather than a loan.",
                "Compare shareholders with bondholders.",
                "Distinguish public from private equity.",
                "Recognise private businesses as equity assets.",
                "Understand why private investments can be less liquid and more difficult to value.",
              ],
              topics: [
                "Shares",
                "Ordinary or common shares",
                "Preference or preferred shares",
                "Public companies",
                "Stock exchanges",
                "Dividends",
                "Capital appreciation",
                "Market capitalisation",
                "Equity funds",
                "ETFs",
                "Private businesses",
                "Private company shares",
                "Angel investing",
                "Venture capital",
                "Private equity",
                "Startup ownership",
                "Employee equity",
                "Founder equity",
              ],
            },
            {
              id: "real-productive-assets",
              title: "Real Estate, Infrastructure & Productive Assets",
              description:
                "Explore property, productive land, infrastructure, natural resources and equipment that can generate useful services, production or cash flow.",
              access: "premium",
              estimatedLessons: 6,
              learningOutcomes: [
                "Understand different forms of real estate.",
                "Explain possible sources of property returns and ownership costs.",
                "Recognise infrastructure as a productive real-economy asset.",
                "Understand productive land and natural-resource rights.",
                "Recognise personal and business equipment as productive assets when used to generate economic value.",
              ],
              topics: [
                "Residential property",
                "Rental property",
                "Commercial property",
                "Industrial property",
                "Warehouses",
                "Retail property",
                "Offices",
                "Hotels",
                "Student accommodation",
                "Land",
                "Agricultural property",
                "REITs",
                "Infrastructure",
                "Toll roads",
                "Airports",
                "Ports",
                "Railways",
                "Power plants",
                "Renewable energy",
                "Electricity networks",
                "Telecom towers",
                "Fibre networks",
                "Data centres",
                "Water infrastructure",
                "Farmland",
                "Timberland",
                "Forests",
                "Mineral rights",
                "Mining rights",
                "Water rights",
                "Oil and gas rights",
                "Commercial vehicles",
                "Machinery",
                "Professional equipment",
              ],
              simulations: ["asset-class-lab"],
            },
            {
              id: "commodities-collectibles",
              title: "Commodities & Collectibles",
              description:
                "Understand assets whose returns can depend heavily on scarcity, demand and price movements rather than ongoing operating cash flow.",
              access: "premium",
              estimatedLessons: 4,
              learningOutcomes: [
                "Identify major commodity categories.",
                "Explain why a commodity differs from a productive business.",
                "Understand how scarcity, authenticity and demand affect collectibles.",
                "Recognise that expensive does not automatically mean productive.",
              ],
              topics: [
                "Gold",
                "Silver",
                "Platinum",
                "Oil",
                "Natural gas",
                "Copper",
                "Aluminium",
                "Lithium",
                "Wheat",
                "Corn",
                "Cocoa",
                "Coffee",
                "Cotton",
                "Art",
                "Rare coins",
                "Watches",
                "Classic cars",
                "Stamps",
                "Memorabilia",
                "Fine wine",
                "Collectible cards",
                "Scarcity",
                "Authenticity",
                "Condition",
                "Provenance",
              ],
            },
            {
              id: "intellectual-property-royalties",
              title: "Intellectual Property & Royalty Assets",
              description:
                "Learn how creativity, knowledge, legal protection and commercial rights can become economically valuable intangible assets.",
              access: "premium",
              estimatedLessons: 5,
              learningOutcomes: [
                "Understand copyright, patents, trademarks and related rights.",
                "Explain licensing and royalty income.",
                "Recognise that an idea is not automatically a valuable asset merely because it exists.",
                "Explain how one creation can produce several economic rights.",
                "Understand that intellectual property may produce income repeatedly without guaranteeing commercial success.",
              ],
              topics: [
                "Copyright",
                "Patents",
                "Trademarks",
                "Industrial designs",
                "Trade secrets",
                "Proprietary formulas",
                "Software rights",
                "Licensing rights",
                "Music royalties",
                "Book royalties",
                "Patent royalties",
                "Franchise royalties",
                "Film and television rights",
                "Image and licensing rights",
                "Revenue-sharing agreements",
              ],
            },
            {
              id: "digital-tokenised-assets",
              title: "Digital, Crypto & Tokenised Assets",
              description:
                "Explore economically valuable digital resources while clearly separating the wider digital-asset landscape from cryptocurrency and speculative tokens.",
              access: "premium",
              estimatedLessons: 5,
              learningOutcomes: [
                "Recognise digital assets beyond cryptocurrency.",
                "Explain how software and digital businesses can create economic value.",
                "Understand introductory blockchain and token concepts.",
                "Recognise volatility, custody, fraud, regulatory and technology risks in cryptoassets.",
                "Explain why digital asset does not automatically mean cryptocurrency.",
              ],
              topics: [
                "Websites",
                "Domain names",
                "Mobile applications",
                "Software",
                "SaaS products",
                "Online courses",
                "Digital books",
                "Digital templates",
                "Online businesses",
                "Monetised content libraries",
                "Games",
                "Digital licences",
                "Proprietary databases",
                "Digital contractual rights",
                "Blockchain",
                "Cryptocurrency",
                "Bitcoin",
                "Utility tokens",
                "Stablecoins",
                "Tokenised assets",
                "Digital ownership records",
                "Custody",
                "Private keys",
                "Technology risk",
              ],
            },
            {
              id: "business-intangible-assets",
              title: "Business, Brand & Data Assets",
              description:
                "Look inside a business to understand the physical, financial and intangible resources that may create economic value.",
              access: "premium",
              estimatedLessons: 4,
              learningOutcomes: [
                "Identify physical, financial and intangible business assets.",
                "Understand brand as an intangible economic resource.",
                "Understand organised, lawful and useful data as a potential source of economic value.",
                "Recognise the importance of customer relationships, distribution and organisational know-how.",
                "Understand that economic value and accounting recognition are not always identical.",
              ],
              topics: [
                "Buildings",
                "Vehicles",
                "Equipment",
                "Machinery",
                "Inventory",
                "Cash",
                "Investments",
                "Receivables",
                "Software",
                "Patents",
                "Trademarks",
                "Licences",
                "Contractual rights",
                "Customer relationships",
                "Distribution networks",
                "Proprietary processes",
                "Brand reputation",
                "Customer loyalty",
                "Pricing power",
                "Proprietary databases",
                "Customer information",
                "Market data",
                "Research datasets",
                "Training datasets",
                "Business intelligence",
                "Privacy and data protection",
              ],
            },
            {
              id: "ownership-control-rights",
              title: "Ownership, Control, Licences & Contractual Rights",
              description:
                "Understand that economic rights can be divided: people and businesses may own, control, lease, license or hold partial rights to an asset.",
              access: "premium",
              estimatedLessons: 4,
              learningOutcomes: [
                "Distinguish ownership from control.",
                "Understand leasing and licensing.",
                "Recognise contractual and operating rights as economically significant.",
                "Understand partial ownership and rights to income.",
              ],
              topics: [
                "Ownership",
                "Control",
                "Leasing",
                "Licensing",
                "Partial ownership",
                "Rights to income",
                "Broadcasting licences",
                "Spectrum licences",
                "Franchise agreements",
                "Distribution rights",
                "Mineral licences",
                "Concessions",
                "Long-term contracts",
                "Lease rights",
                "Operating permits",
              ],
            },
            {
              id: "asset-creation-transformation",
              title: "Human Capital, Asset Creation & Transformation",
              description:
                "Move beyond buying assets and learn how knowledge, creativity, enterprise and capital can create or transform economic value.",
              access: "premium",
              estimatedLessons: 4,
              learningOutcomes: [
                "Understand human capital as productive capacity without treating people as property.",
                "Explain how people can create assets rather than only purchase them.",
                "Understand how one asset can be transformed into another.",
                "Identify assets a learner could potentially create through skills and enterprise.",
              ],
              topics: [
                "Human capital",
                "Knowledge",
                "Education",
                "Skills",
                "Professional expertise",
                "Experience",
                "Creativity",
                "Productive capability",
                "Asset creation",
                "Software creation",
                "Business creation",
                "Intellectual property creation",
                "Course creation",
                "Licensable designs",
                "Brand building",
                "Productive land improvement",
                "Asset transformation",
                "Cash to equipment to production",
                "Knowledge to software to licence",
                "Savings to property to rental income",
              ],
              simulations: ["asset-class-lab"],
            },
            {
              id: "asset-risk-return",
              title: "Asset Risk, Return, Liquidity & Diversification",
              description:
                "Bring the asset universe together using a consistent framework for return sources, risk, liquidity, ownership cost and diversification.",
              access: "premium",
              estimatedLessons: 2,
              learningOutcomes: [
                "Identify where an asset's return can come from.",
                "Compare major asset risks.",
                "Understand that value and liquidity are different concepts.",
                "Use diversification reasoning in hypothetical decisions.",
                "Analyse the cost of owning an asset.",
              ],
              topics: [
                "Interest",
                "Rent",
                "Dividends",
                "Business profits",
                "Royalties",
                "Resource production",
                "Appreciation",
                "Expected return",
                "Volatility",
                "Liquidity",
                "Inflation risk",
                "Credit risk",
                "Market risk",
                "Currency risk",
                "Concentration risk",
                "Regulatory risk",
                "Technology risk",
                "Diversification",
                "Maintenance",
                "Taxes",
                "Insurance",
                "Management",
                "Storage",
                "Financing",
                "Transaction costs",
              ],
              simulations: ["asset-class-lab"],
            },
          ],
          signatureExperiences: [
            "FountainPrep Asset Lens interactive analysis",
            "Asset Universe classification challenge",
            "Public vs private ownership case",
            "Create-or-buy-an-asset decision lab",
            "Asset transformation challenge",
            "Risk-return-liquidity comparison lab",
          ],
          capstone:
            "Analyse and defend a hypothetical basket of radically different assets using value driver, return source, liquidity, risk, ownership cost, rights and productive capacity."
        },

    {
          id: "financial-stability",
          title: "Build Your Financial Foundation",
          eyebrow: "Stage 4 · Premium",
          description:
            "Build the resilient financial base that makes wealth building sustainable: banking, credit, debt, protection, income and enterprise, resilience, inflation, real returns, compounding, diversification, asset allocation, goals, time horizon and disciplined investing.",
          access: "premium",
          estimatedLessons: 46,
          outcome:
            "Create a resilient personal financial system and understand how surplus cash flow, protection, time, diversification and disciplined behaviour can support long-term wealth building.",
          modules: [
            {
              id: "banking-credit",
              title: "Banking and Credit",
              description:
                "Understand accounts, cards, payments, overdrafts and responsible credit use.",
              access: "premium",
              estimatedLessons: 5,
              learningOutcomes: [
                "Compare common banking products.",
                "Understand debit versus credit.",
                "Explain credit reports and credit scores at a basic level.",
              ],
              topics: [
                "Current accounts",
                "Savings accounts",
                "Debit cards",
                "Credit cards",
                "Overdrafts",
                "Direct debits",
                "Standing orders",
                "Credit reports",
              ],
            },
            {
              id: "debt-management",
              title: "Debt and Repayment",
              description:
                "See how interest, repayment size and time affect the total cost of debt.",
              access: "premium",
              estimatedLessons: 5,
              learningOutcomes: [
                "Compare repayment choices.",
                "Understand minimum-payment risk.",
                "Recognise high-cost borrowing.",
              ],
              topics: [
                "APR",
                "Compound interest on debt",
                "Minimum payments",
                "Debt repayment strategies",
                "Debt-to-income concepts",
              ],
              simulations: ["debt-lab"],
            },
            {
              id: "financial-safety",
              title: "Protecting Your Money",
              description:
                "Learn how emergency reserves, insurance and fraud awareness protect financial progress.",
              access: "premium",
              estimatedLessons: 5,
              learningOutcomes: [
                "Explain the role of an emergency reserve.",
                "Understand the basic purpose of insurance.",
                "Recognise common financial scams.",
              ],
              topics: [
                "Emergency reserves",
                "Insurance",
                "Fraud",
                "Identity theft",
                "Online financial safety",
              ],
            },
            {
              id: "income-enterprise",
              title: "Income, Work and Enterprise",
              description:
                "Understand earned income, business income and how skills can become productive financial assets.",
              access: "premium",
              estimatedLessons: 5,
              learningOutcomes: [
                "Identify different sources of income.",
                "Understand the link between skills and earning power.",
                "Recognise basic enterprise economics.",
              ],
              topics: [
                "Employment income",
                "Self-employment",
                "Business income",
                "Human capital",
                "Skills",
                "Entrepreneurship",
              ],
            },
            {
              id: "financial-resilience",
              title: "Financial Resilience",
              description:
                "Prepare for unexpected events without immediately damaging long-term goals.",
              access: "premium",
              estimatedLessons: 4,
              learningOutcomes: [
                "Plan for financial shocks.",
                "Understand liquidity needs.",
                "Balance short-term protection with long-term goals.",
              ],
              topics: [
                "Job loss",
                "Unexpected expenses",
                "Liquidity",
                "Contingency planning",
              ],
              simulations: ["crisis-lab"],
            },
    {
              id: "inflation-real-return",
              title: "Inflation and Real Returns",
              description:
                "Understand why money can lose purchasing power and why returns must be considered after inflation.",
              access: "premium",
              estimatedLessons: 4,
              learningOutcomes: [
                "Explain inflation.",
                "Distinguish nominal from real return.",
                "Understand purchasing-power risk.",
              ],
              topics: [
                "Inflation",
                "Purchasing power",
                "Nominal return",
                "Real return",
              ],
            },
            {
              id: "compound-growth",
              title: "The Power of Compounding",
              description:
                "See how time, contribution level and returns can change long-term outcomes.",
              access: "premium",
              estimatedLessons: 4,
              learningOutcomes: [
                "Explain compound growth.",
                "Understand why time matters.",
                "Compare early and late investing scenarios.",
              ],
              topics: [
                "Compound growth",
                "Regular contributions",
                "Time horizon",
                "Reinvestment",
              ],
              simulations: ["compound-growth-lab"],
            },
            {
              id: "diversification-allocation",
              title: "Diversification and Asset Allocation",
              description:
                "Learn why portfolios combine assets rather than relying on a single investment.",
              access: "premium",
              estimatedLessons: 5,
              learningOutcomes: [
                "Explain diversification.",
                "Understand basic asset allocation.",
                "Recognise concentration risk.",
              ],
              topics: [
                "Diversification",
                "Concentration risk",
                "Asset allocation",
                "Portfolio balance",
              ],
              simulations: ["portfolio-lab"],
            },
            {
              id: "investment-horizon",
              title: "Goals, Time Horizon and Risk",
              description:
                "Connect financial goals to time, liquidity and the amount of uncertainty a person can tolerate.",
              access: "premium",
              estimatedLessons: 4,
              learningOutcomes: [
                "Explain investment horizon.",
                "Understand liquidity requirements.",
                "Recognise why short- and long-term goals differ.",
              ],
              topics: [
                "Time horizon",
                "Liquidity",
                "Goals",
                "Risk capacity",
                "Risk tolerance introduction",
              ],
            },
            {
              id: "regular-investing",
              title: "Regular Investing and Behaviour",
              description:
                "Understand disciplined investing, recurring contributions and the danger of emotional decision-making.",
              access: "premium",
              estimatedLessons: 5,
              learningOutcomes: [
                "Explain regular investing.",
                "Understand pound-cost averaging conceptually.",
                "Recognise emotional investing behaviour.",
              ],
              topics: [
                "Regular investing",
                "Pound-cost averaging",
                "Market timing",
                "Investor behaviour",
              ],
            },
                ],
          signatureExperiences: [
            "Banking-product comparison case",
            "Debt repayment lab",
            "Emergency and insurance resilience lab",
            "Income and enterprise challenge",
            "Inflation and real-return experiment",
            "Compounding timeline lab",
            "Diversification and allocation lab",
            "Regular-investing behaviour case",
          ],
          capstone:
            "Build a fictional 12-month financial stability and wealth-building plan that balances cash flow, debt, protection, saving, investing and risk."
        },

    {
          id: "investing-financial-markets",
          title: "How Financial Markets Really Work",
          eyebrow: "Stage 5 · Premium",
          description:
            "Go inside stock markets, exchanges, funds, indices, order types, investment analysis and introductory options.",
          access: "premium",
          estimatedLessons: 45,
          outcome:
            "Understand how securities markets work and how investors research, place and execute hypothetical investment decisions.",
          modules: [
            {
              id: "understanding-financial-markets",
              title: "Understanding Financial Markets",
              description:
                "Understand how money and securities move between companies, investors, brokers and exchanges.",
              access: "premium",
              estimatedLessons: 5,
              learningOutcomes: [
                "Explain primary and secondary markets.",
                "Describe the role of brokers and exchanges.",
                "Understand order matching and market makers.",
              ],
              topics: [
                "Primary Market",
                "Secondary Market",
                "Stock Exchange",
                "Brokerage",
                "Stockbroker",
                "Individual/Retail Investors",
                "Listed vs Unlisted Securities",
                "Stock Quotes",
                "Stock Trading Process",
                "Order Matching",
                "Market Makers",
              ],
            },
            {
              id: "companies-stock-market",
              title: "Companies and the Stock Market",
              description:
                "Learn how companies enter public markets and how their shares are identified and traded.",
              access: "premium",
              estimatedLessons: 5,
              learningOutcomes: [
                "Explain IPOs and subsequent offerings.",
                "Understand ticker symbols and market capitalisation.",
                "Recognise common market trading periods.",
              ],
              topics: [
                "IPO",
                "SPO",
                "Stock Buyback",
                "Ticker Symbols",
                "Market Capitalisation",
                "Market Open",
                "Market Close",
                "After-Hours Trading",
                "Trading Floor",
                "History of Stock Exchanges",
              ],
            },
            {
              id: "investment-funds",
              title: "Investment Funds",
              description:
                "Compare investing individually with investing through pooled vehicles.",
              access: "premium",
              estimatedLessons: 4,
              learningOutcomes: [
                "Understand pooled investment vehicles.",
                "Compare open-end and closed-end structures.",
                "Recognise mutual funds and hedge funds at an introductory level.",
              ],
              topics: [
                "Individual Investors",
                "Open-End Funds",
                "Closed-End Funds",
                "Mutual Funds",
                "Hedge Funds",
              ],
            },
            {
              id: "market-indices",
              title: "Understanding Stock Market Indices",
              description:
                "Learn what indices measure and why different indices behave differently.",
              access: "premium",
              estimatedLessons: 4,
              learningOutcomes: [
                "Explain what a market index represents.",
                "Recognise major global indices.",
                "Compare price-weighted and market-cap-weighted indices.",
              ],
              topics: [
                "Stock Market Indices",
                "FTSE 100",
                "S&P 500",
                "Dow Jones Industrial Average",
                "Nasdaq Composite",
                "DAX",
                "CAC 40",
                "Nikkei 225",
                "Hang Seng Index",
                "Price-Weighted Index",
                "Market-Capitalisation-Weighted Index",
              ],
            },
            {
              id: "buying-selling-investments",
              title: "Buying and Selling Investments",
              description:
                "Learn how hypothetical investment orders work and when different order types are used.",
              access: "premium",
              estimatedLessons: 6,
              learningOutcomes: [
                "Understand the basic dimensions of an order.",
                "Compare market, limit and stop orders.",
                "Choose an appropriate order type in a fictional scenario.",
              ],
              topics: [
                "How to Place an Order",
                "Dimensions of an Order",
                "Market Order",
                "Limit Order",
                "Stop Sell Order",
                "Stop Buy Order",
                "Stop-Market Order",
                "Stop-Limit Order",
                "Trailing Stop Order",
                "Limit vs Stop Orders",
              ],
              simulations: ["market-order-lab"],
            },
            {
              id: "trade-execution",
              title: "Trading Instructions and Execution",
              description:
                "Understand what happens after an investor presses Buy or Sell.",
              access: "premium",
              estimatedLessons: 5,
              learningOutcomes: [
                "Explain common order-duration instructions.",
                "Understand partial fills.",
                "Describe basic order routing and verification.",
              ],
              topics: [
                "Trading Time",
                "Day Order",
                "Extended-Hours Order",
                "GTC",
                "GTC + Extended Hours",
                "Partial Fill",
                "Order Routing",
                "Order Verification and Approval",
              ],
            },
            {
              id: "cash-margin-long-short",
              title: "Cash, Margin, Long and Short Positions",
              description:
                "Understand leverage and short selling with strong emphasis on the risks involved.",
              access: "premium",
              estimatedLessons: 5,
              learningOutcomes: [
                "Compare cash and margin accounts conceptually.",
                "Explain long and short positions.",
                "Understand that leverage magnifies gains and losses.",
              ],
              topics: [
                "Cash Account",
                "Margin Account",
                "Margin Calculation",
                "Long Position",
                "Short Position",
                "Leverage Risk",
              ],
            },
            {
              id: "investment-analysis",
              title: "How Investors Analyse Investments",
              description:
                "Compare fundamental, technical and sentiment approaches to investment research.",
              access: "premium",
              estimatedLessons: 5,
              learningOutcomes: [
                "Recognise fundamental analysis.",
                "Recognise technical analysis.",
                "Recognise sentiment analysis.",
                "Select the relevant approach in a hypothetical case.",
              ],
              topics: [
                "Fundamental Analysis",
                "Technical Analysis",
                "Sentiment Analysis",
                "Market Capitalisation",
              ],
            },
            {
              id: "options-introduction",
              title: "Introduction to Options",
              description:
                "Understand the basic language of options without teaching aggressive trading strategies.",
              access: "premium",
              estimatedLessons: 6,
              learningOutcomes: [
                "Explain what an option represents.",
                "Understand calls, puts, strikes, premiums and expiration.",
                "Recognise the additional complexity and leverage risk.",
              ],
              topics: [
                "Options",
                "History of Options",
                "Underlying Asset",
                "Call",
                "Put",
                "Strike Price",
                "Premium",
                "Expiration",
                "Intrinsic Value",
                "Leverage",
                "Risk",
              ],
            },
          ],
          signatureExperiences: [
            "Primary-to-secondary-market journey",
            "IPO and company listing case",
            "Global index comparison",
            "Market-order execution simulator",
            "Cash vs margin risk case",
            "Fundamental vs technical vs sentiment research challenge",
            "Options risk-language lab",
          ],
          capstone:
            "Research a fictional listed company, select an appropriate hypothetical order type, explain execution risk and defend the decision without using real money."
        },

    {
          id: "investor-skills",
          title: "Build & Manage Your Investment Portfolio",
          eyebrow: "Stage 6 · Premium",
          description:
            "Move from knowing investment terms to making thoughtful portfolio decisions in simulations.",
          access: "premium",
          estimatedLessons: 20,
          outcome:
            "Practise portfolio construction, diversification, rebalancing and decision-making through changing conditions.",
          modules: [
            {
              id: "portfolio-construction",
              title: "Building a Portfolio",
              description:
                "Combine fictional assets into a portfolio based on goals, time and liquidity.",
              access: "premium",
              estimatedLessons: 5,
              learningOutcomes: [
                "Build a basic hypothetical portfolio.",
                "Explain why assets are combined.",
                "Identify concentration risk.",
              ],
              topics: [
                "Portfolio construction",
                "Asset allocation",
                "Diversification",
                "Liquidity",
              ],
              simulations: ["portfolio-lab"],
            },
            {
              id: "portfolio-risk",
              title: "Understanding Portfolio Risk",
              description:
                "See how portfolios respond when markets, inflation or circumstances change.",
              access: "premium",
              estimatedLessons: 5,
              learningOutcomes: [
                "Recognise different sources of risk.",
                "Understand volatility conceptually.",
                "Explain why losses can occur even in diversified portfolios.",
              ],
              topics: [
                "Market risk",
                "Inflation risk",
                "Concentration risk",
                "Liquidity risk",
                "Volatility",
              ],
              simulations: ["crisis-lab"],
            },
            {
              id: "behavioural-finance",
              title: "Psychology of Money and Investing",
              description:
                "Learn how emotion and behavioural biases can affect financial decisions.",
              access: "premium",
              estimatedLessons: 5,
              learningOutcomes: [
                "Recognise FOMO and herd behaviour.",
                "Understand loss aversion.",
                "Recognise overconfidence and impulsive decisions.",
              ],
              topics: [
                "Fear",
                "Greed",
                "FOMO",
                "Loss aversion",
                "Overconfidence",
                "Herd behaviour",
                "Delayed gratification",
              ],
            },
            {
              id: "review-rebalance",
              title: "Reviewing and Rebalancing",
              description:
                "Understand why a long-term plan may need periodic review without reacting to every market movement.",
              access: "premium",
              estimatedLessons: 5,
              learningOutcomes: [
                "Explain rebalancing conceptually.",
                "Distinguish reviewing from reacting.",
                "Understand long-term discipline.",
              ],
              topics: [
                "Portfolio review",
                "Rebalancing",
                "Long-term discipline",
                "Changing goals",
              ],
              simulations: ["portfolio-lab"],
            },
          ],
          signatureExperiences: [
            "Portfolio construction lab",
            "Concentration-risk detector",
            "Market-crisis portfolio stress test",
            "Behavioural-bias challenge",
            "Rebalancing decision lab",
          ],
          capstone:
            "Construct, defend, stress-test and rebalance a fictional multi-asset portfolio against a stated goal, time horizon and liquidity need."
        },

    {
          id: "financial-freedom",
          title: "Design Your Path to Financial Freedom",
          eyebrow: "Stage 7 · Premium",
          description:
            "Connect income, assets, pensions, retirement and lifestyle choices into a long-term financial plan.",
          access: "premium",
          estimatedLessons: 26,
          outcome:
            "Understand the building blocks that can support financial independence later in life.",
          modules: [
            {
              id: "income-producing-assets",
              title: "Income-Producing Assets",
              description:
                "Understand how assets can potentially produce income over time.",
              access: "premium",
              estimatedLessons: 5,
              learningOutcomes: [
                "Identify common forms of asset income.",
                "Distinguish earned income from asset income.",
                "Understand that income is not guaranteed.",
              ],
              topics: [
                "Dividends",
                "Bond interest",
                "Rental income",
                "Business income",
                "Royalties",
              ],
            },
            {
              id: "pensions-retirement",
              title: "Pensions and Retirement",
              description:
                "Understand the purpose of pensions and the importance of long-term retirement planning.",
              access: "premium",
              estimatedLessons: 5,
              learningOutcomes: [
                "Explain the basic purpose of a pension.",
                "Understand employer contribution concepts.",
                "Recognise longevity and retirement-income risk.",
              ],
              topics: [
                "Pensions",
                "Retirement saving",
                "Employer contributions",
                "Retirement income",
                "Longevity risk",
              ],
              simulations: ["retirement-lab"],
            },
            {
              id: "freedom-number",
              title: "Your Financial Freedom Number",
              description:
                "Model the relationship between future spending needs, assets, time and assumptions.",
              access: "premium",
              estimatedLessons: 5,
              learningOutcomes: [
                "Estimate future lifestyle costs in a simulation.",
                "Understand that assumptions materially change outcomes.",
                "Recognise the relationship between asset base and sustainable income.",
              ],
              topics: [
                "Annual expenses",
                "Inflation",
                "Investment assumptions",
                "Retirement horizon",
                "Withdrawal concepts",
              ],
              simulations: ["financial-freedom-lab"],
            },
            {
              id: "lifestyle-inflation",
              title: "Lifestyle and Financial Independence",
              description:
                "Understand how spending growth can affect long-term financial freedom.",
              access: "premium",
              estimatedLessons: 4,
              learningOutcomes: [
                "Explain lifestyle inflation.",
                "Understand savings rate.",
                "Recognise trade-offs between present and future consumption.",
              ],
              topics: [
                "Lifestyle inflation",
                "Savings rate",
                "Consumption",
                "Financial independence",
              ],
            },
            {
              id: "wealth-preservation",
              title: "Preserving Wealth",
              description:
                "Understand why protecting and maintaining wealth matters after it has been built.",
              access: "premium",
              estimatedLessons: 4,
              learningOutcomes: [
                "Understand diversification in later life.",
                "Recognise inflation and longevity risks.",
                "Understand basic succession concepts.",
              ],
              topics: [
                "Wealth preservation",
                "Diversification",
                "Inflation",
                "Longevity",
                "Succession introduction",
              ],
            },
            {
              id: "financial-life-project",
              title: "Financial Life Project",
              description:
                "Bring together budgeting, saving, investing, protection and retirement into one fictional lifetime plan.",
              access: "premium",
              estimatedLessons: 3,
              learningOutcomes: [
                "Create a complete fictional financial-life plan.",
                "Explain the major decisions made.",
                "Reflect on trade-offs and risks.",
              ],
              topics: [
                "Lifetime planning",
                "Financial priorities",
                "Decision-making",
                "Reflection",
              ],
              simulations: [
                "budget-lab",
                "portfolio-lab",
                "retirement-lab",
                "financial-freedom-lab",
              ],
            },
          ],
          signatureExperiences: [
            "Asset-income map",
            "Retirement contribution lab",
            "Financial Freedom Number simulator",
            "Lifestyle-inflation challenge",
            "Longevity and inflation stress test",
            "Lifetime financial plan project",
          ],
          capstone:
            "Create a fictional long-term financial-independence plan and explain how spending, income, assets, pensions, inflation, longevity and risk affect the outcome."
        },

    {
          id: "advanced-financial-life",
          title: "Build, Protect & Transfer Wealth",
          eyebrow: "Stage 8 · Premium",
          description:
            "Bring together tax literacy, property, mortgages, business finance, financial statements, economics, wealth protection, estate planning, family governance and financial legacy.",
          access: "premium",
          estimatedLessons: 42,
          outcome:
            "Develop broader financial capability for building, understanding, protecting and eventually transferring wealth responsibly across a lifetime and between generations.",
          modules: [
            {
              id: "tax-literacy",
              title: "Tax Literacy",
              description:
                "Understand why taxes exist and the basic categories individuals and businesses encounter.",
              access: "premium",
              estimatedLessons: 5,
              learningOutcomes: [
                "Understand basic tax terminology.",
                "Recognise that tax rules differ by jurisdiction.",
                "Understand the importance of professional advice for personal tax decisions.",
              ],
              topics: [
                "Income tax",
                "Capital gains concepts",
                "Tax allowances",
                "Tax records",
              ],
            },
            {
              id: "property-mortgages",
              title: "Property and Mortgages",
              description:
                "Understand deposits, mortgages, interest, ownership costs and property risk.",
              access: "premium",
              estimatedLessons: 5,
              learningOutcomes: [
                "Explain mortgage basics.",
                "Understand deposits and repayment costs.",
                "Recognise the wider costs of property ownership.",
              ],
              topics: [
                "Deposits",
                "Mortgages",
                "Mortgage interest",
                "Property costs",
                "Property risk",
              ],
            },
            {
              id: "business-finance",
              title: "Business Finance",
              description:
                "Understand revenue, costs, profit, cash flow, capital and basic business funding.",
              access: "premium",
              estimatedLessons: 5,
              learningOutcomes: [
                "Distinguish revenue, profit and cash flow.",
                "Understand basic business funding.",
                "Recognise working-capital needs.",
              ],
              topics: [
                "Revenue",
                "Costs",
                "Profit",
                "Cash flow",
                "Capital",
                "Working capital",
              ],
            },
            {
              id: "financial-statements",
              title: "Reading Financial Statements",
              description:
                "Learn the purpose of income statements, balance sheets and cash-flow statements.",
              access: "premium",
              estimatedLessons: 5,
              learningOutcomes: [
                "Recognise the three core financial statements.",
                "Identify basic financial relationships.",
                "Use statements in simple company-analysis exercises.",
              ],
              topics: [
                "Income statement",
                "Balance sheet",
                "Cash-flow statement",
                "Revenue",
                "Debt",
                "Profit",
              ],
            },
            {
              id: "economy-markets",
              title: "Economics and Financial Markets",
              description:
                "Understand how inflation, interest rates, economic cycles and currencies connect to financial decisions.",
              access: "premium",
              estimatedLessons: 5,
              learningOutcomes: [
                "Understand basic interest-rate effects.",
                "Recognise economic cycles.",
                "Understand introductory currency concepts.",
              ],
              topics: [
                "Interest rates",
                "Central banks",
                "Inflation",
                "Economic cycles",
                "Foreign exchange",
                "Global markets",
              ],
            },
            {
              id: "estate-wealth-transfer",
              title: "Estate Planning and Wealth Transfer",
              description:
                "Understand basic concepts around wills, beneficiaries and passing assets to others.",
              access: "premium",
              estimatedLessons: 5,
              learningOutcomes: [
                "Understand why estate planning matters.",
                "Recognise wills and beneficiaries.",
                "Understand that legal rules differ by jurisdiction.",
              ],
              topics: [
                "Wills",
                "Beneficiaries",
                "Inheritance",
                "Estate planning",
                "Wealth transfer",
              ],
            },
            {
              id: "wealth-risk-protection",
              title: "Protecting Accumulated Wealth",
              description:
                "Study concentration, liability, inflation, fraud, cyber, legal and longevity risks that can threaten wealth after it has been created.",
              access: "premium",
              estimatedLessons: 5,
              learningOutcomes: [
                "Identify major threats to accumulated wealth.",
                "Understand the role of diversification, liquidity and insurance in protection.",
                "Recognise when specialist legal, tax or financial advice is required.",
              ],
              topics: [
                "Concentration risk",
                "Liability risk",
                "Inflation risk",
                "Fraud and cyber risk",
                "Insurance",
                "Liquidity reserves",
                "Professional advice",
              ],
              simulations: ["crisis-lab", "insurance-lab"],
            },
            {
              id: "family-wealth-governance",
              title: "Family Wealth, Values & Governance",
              description:
                "Understand how communication, financial education, documentation and shared principles can influence the survival of wealth across generations.",
              access: "premium",
              estimatedLessons: 4,
              learningOutcomes: [
                "Explain why wealth transfer involves knowledge as well as assets.",
                "Understand introductory family-governance concepts.",
                "Recognise the importance of clear records, beneficiaries and financial education.",
              ],
              topics: [
                "Financial values",
                "Family financial education",
                "Beneficiary communication",
                "Documentation",
                "Succession planning",
                "Family governance introduction",
              ],
              simulations: ["wealth-transfer-lab"],
            },
            {
              id: "giving-philanthropy",
              title: "Giving, Philanthropy & Financial Legacy",
              description:
                "Explore intentional giving and the idea that financial success can include purpose, family support and social impact as well as personal consumption.",
              access: "premium",
              estimatedLessons: 3,
              learningOutcomes: [
                "Understand planned giving as part of a financial life.",
                "Distinguish spontaneous giving from structured philanthropy.",
                "Recognise the need for jurisdiction-specific legal and tax guidance.",
              ],
              topics: [
                "Giving",
                "Philanthropy",
                "Charitable planning",
                "Legacy",
                "Social impact",
              ],
            },
          ],
          signatureExperiences: [
            "Tax scenario lab",
            "Mortgage affordability and ownership-cost case",
            "Business finance lab",
            "Financial statement detective challenge",
            "Interest-rate and currency scenario lab",
            "Wealth protection stress test",
            "Estate and beneficiary planning lab",
            "Family wealth-transfer capstone",
          ],
          capstone:
            "Build a fictional multi-generation wealth plan covering ownership, protection, tax awareness, business/property decisions, estate planning, beneficiaries and transfer of financial knowledge."
        }
  ] as const,

  simulations: {
    "money-lab": {
      title: "Money Lab",
      description:
        "Practise everyday financial choices using fictional income and expenses.",
    },
    "income-vs-wealth-lab": {
      title: "Income vs Wealth Lab",
      description:
        "Compare fictional high- and moderate-income households to see how spending, debt, ownership and retained value change net worth over time.",
    },
    "budget-lab": {
      title: "Budget Lab",
      description:
        "Build and rebalance a fictional monthly budget and see the consequences of competing priorities.",
    },
    "debt-lab": {
      title: "Debt Lab",
      description:
        "Compare repayment amounts, interest costs, minimum payments and repayment times.",
    },
    "compound-growth-lab": {
      title: "Compound Growth Lab",
      description:
        "Change contributions, time, inflation and assumed returns to see how long-term outcomes change.",
    },
    "asset-discovery-lab": {
      title: "Discover the Asset Universe",
      description:
        "Classify fictional assets and discover that economic value can exist in physical, financial, intellectual, contractual and digital forms.",
    },
    "asset-class-lab": {
      title: "Asset Class Lab",
      description:
        "Compare fictional assets by value driver, return source, risk, liquidity, ownership cost, rights, productive capacity and time horizon.",
    },
    "portfolio-lab": {
      title: "Portfolio Lab",
      description:
        "Allocate fictional money across asset classes, justify the allocation and respond to changing conditions.",
    },
    "market-order-lab": {
      title: "Market Order Lab",
      description:
        "Practise market, limit, stop and duration instructions using fictional securities and prices.",
    },
    "crisis-lab": {
      title: "Crisis Lab",
      description:
        "Respond to fictional events such as inflation, market falls, job loss, rate increases and unexpected expenses.",
    },
    "retirement-lab": {
      title: "Retirement Lab",
      description:
        "Explore how saving, contributions, time, inflation, longevity and return assumptions affect retirement outcomes.",
    },
    "financial-freedom-lab": {
      title: "Financial Freedom Lab",
      description:
        "Model fictional future spending, asset accumulation, withdrawal assumptions and financial-independence scenarios.",
    },
    "career-capital-lab": {
      title: "Career Capital Lab",
      description:
        "Compare fictional education, skill-building, employment and enterprise choices and their possible effects on earning capacity.",
    },
    "insurance-lab": {
      title: "Protection & Insurance Lab",
      description:
        "Compare fictional financial shocks with and without emergency reserves and appropriate protection.",
    },
    "business-finance-lab": {
      title: "Business Finance Lab",
      description:
        "Work through fictional revenue, cost, margin, cash-flow, working-capital and funding decisions.",
    },
    "financial-statements-lab": {
      title: "Financial Statements Lab",
      description:
        "Read simplified fictional financial statements and connect profit, assets, debt and cash flow.",
    },
    "tax-scenario-lab": {
      title: "Tax Scenario Lab",
      description:
        "Explore fictional tax concepts and compare how different transactions may be treated, without giving personal tax advice.",
    },
    "currency-inflation-lab": {
      title: "Currency & Inflation Lab",
      description:
        "See how inflation, interest rates and currency movements can affect fictional purchasing power and asset values.",
    },
    "estate-planning-lab": {
      title: "Estate Planning Lab",
      description:
        "Use a fictional family scenario to identify assets, beneficiaries, documents and questions that may require professional legal advice.",
    },
    "wealth-transfer-lab": {
      title: "Wealth Transfer Lab",
      description:
        "Plan a fictional transfer of assets, knowledge and responsibilities across generations while considering beneficiaries, governance and risk.",
    },
  },

  certification: {
    foundationCompletionBadge: true,
    premiumStageBadges: true,
    finalAcademyCertificate: true,
    certificateRequiresMastery: true,
    certificateRequiresCapstones: true,
    certificateTitle: "FountainPrep Financial Literacy Academy — Complete Pathway",
  },

  safety: {
    educationalOnly: true,
    personalisedInvestmentAdvice: false,
    realMoneyTrading: false,
    brokerageConnection: false,

    preferredLanguage: [
      "Let's understand how this works.",
      "Consider this fictional example.",
      "What could happen under this assumption?",
      "What trade-offs can you identify?",
      "How would you defend this decision?",
    ],

    avoidLanguage: [
      "Buy this stock.",
      "This investment will make money.",
      "This is the best trade.",
      "This return is guaranteed.",
    ],

    highRiskTopics: [
      "margin",
      "leverage",
      "short selling",
      "options",
      "cryptoassets",
    ],

    highRiskRule:
      "Always explain potential losses, leverage, liquidity, custody, fraud and complexity risks before discussing possible gains.",
  },
} as const;

export const financialLiteracyStages =
  financialLiteracyPremiumBlueprint.stages;

export const financialLiteracyFreeStage =
  financialLiteracyPremiumBlueprint.stages.find(
    (stage) =>
      stage.id === "financial-foundations",
  );

export const financialLiteracyPremiumStages =
  financialLiteracyPremiumBlueprint.stages.filter(
    (stage) => stage.access === "premium",
  );

export const financialLiteracySimulations =
  financialLiteracyPremiumBlueprint.simulations;