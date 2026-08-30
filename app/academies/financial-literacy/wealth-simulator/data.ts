import type {
  CareerOffer,
  HousingChoice,
  LifeEvent,
  SpendingLevel,
  TransportChoice,
  TwinStrategy,
} from "./types";

/* =========================================================
   CORE SIMULATION SETTINGS
========================================================= */

export const SIMULATION_YEARS = 10;

export const DEFAULT_CURRENCY = "GBP" as const;

export const DEFAULT_INVESTMENT_RETURN = 0.06;

export const DEFAULT_SAVINGS_RETURN = 0.02;

export const DEFAULT_PENSION_RETURN = 0.055;

export const DEFAULT_INFLATION_RATE = 0.025;

export const DEFAULT_DEBT_INTEREST_RATE = 0.18;

/* =========================================================
   CAREER SCENARIO
========================================================= */

export const defaultCareerOffer: CareerOffer = {
  id: "graduate-business-analyst",

  title: "Graduate Business Analyst",

  company: "Northstar Group",

  location: "Manchester, UK",

  annualGrossSalary: 32000,

  pensionContributionRate: 0.05,

  estimatedAnnualSalaryGrowth: 0.035,

  description:
    "A full-time graduate role with structured training, workplace pension and opportunities for progression.",
};

/* =========================================================
   HOUSING
========================================================= */

export const housingChoices: HousingChoice[] = [
  {
    id: "family",

    title: "Stay With Family",

    subtitle:
      "Lower cost, longer commute",

    monthlyRent: 300,

    councilTax: 0,

    utilities: 0,

    internet: 0,

    insurance: 0,

    depositRequired: 0,

    commuteCost: 160,

    description:
      "Contribute towards household costs while keeping housing expenses low.",

    lifestyleScore: 55,
  },

  {
    id: "house-share",

    title: "Modern House Share",

    subtitle:
      "Social and affordable",

    monthlyRent: 725,

    councilTax: 65,

    utilities: 75,

    internet: 15,

    insurance: 8,

    depositRequired: 725,

    commuteCost: 95,

    description:
      "Rent a room in a modern shared property with other young professionals.",

    lifestyleScore: 70,
  },

  {
    id: "basic-flat",

    title: "Your Own Flat",

    subtitle:
      "Privacy and independence",

    monthlyRent: 1150,

    councilTax: 135,

    utilities: 95,

    internet: 30,

    insurance: 12,

    depositRequired: 1150,

    commuteCost: 65,

    description:
      "A comfortable one-bedroom apartment giving you complete independence.",

    lifestyleScore: 82,
  },

  {
    id: "premium-flat",

    title: "Premium City Apartment",

    subtitle:
      "City-centre lifestyle",

    monthlyRent: 1650,

    councilTax: 165,

    utilities: 125,

    internet: 35,

    insurance: 15,

    depositRequired: 1650,

    commuteCost: 35,

    description:
      "A premium city-centre apartment with gym, concierge and excellent location.",

    lifestyleScore: 96,
  },

  {
    id: "homeowner",

    title: "Buy a Home",

    subtitle:
      "Build ownership over time",

    monthlyRent: 1250,

    councilTax: 145,

    utilities: 110,

    internet: 30,

    insurance: 35,

    depositRequired: 20000,

    commuteCost: 90,

    description:
      "Purchase a starter home using a deposit and mortgage. Part of your monthly payment can gradually build property equity.",

    lifestyleScore: 85,
  },
];

/* =========================================================
   TRANSPORT
========================================================= */

export const transportChoices: TransportChoice[] = [
  {
    id: "public",

    title: "Public Transport",

    subtitle:
      "No car ownership",

    purchasePrice: 0,

    deposit: 0,

    monthlyFinance: 0,

    monthlyInsurance: 0,

    monthlyFuel: 120,

    monthlyTax: 0,

    monthlyMaintenance: 0,

    description:
      "Use trains, buses and occasional taxis without taking on the cost of owning a car.",

    lifestyleScore: 60,
  },

  {
    id: "used-car",

    title: "Used Toyota Yaris",

    subtitle:
      "Reliable and practical",

    purchasePrice: 7500,

    deposit: 1500,

    monthlyFinance: 185,

    monthlyInsurance: 105,

    monthlyFuel: 110,

    monthlyTax: 15,

    monthlyMaintenance: 45,

    description:
      "A dependable used car with manageable finance and running costs.",

    lifestyleScore: 74,
  },

  {
    id: "new-car",

    title: "New Volkswagen Golf",

    subtitle:
      "New car comfort",

    purchasePrice: 28000,

    deposit: 3000,

    monthlyFinance: 425,

    monthlyInsurance: 145,

    monthlyFuel: 125,

    monthlyTax: 20,

    monthlyMaintenance: 30,

    description:
      "A brand-new mainstream car offering comfort and reliability at a significantly higher monthly cost.",

    lifestyleScore: 87,
  },

  {
    id: "premium-car",

    title: "New BMW 1 Series",

    subtitle:
      "Premium lifestyle",

    purchasePrice: 34000,

    deposit: 3500,

    monthlyFinance: 510,

    monthlyInsurance: 175,

    monthlyFuel: 145,

    monthlyTax: 25,

    monthlyMaintenance: 40,

    description:
      "A premium new vehicle with higher finance, insurance and running costs.",

    lifestyleScore: 97,
  },
];

/* =========================================================
   SPENDING LEVELS

   These represent normal spending outside housing,
   transport and debt repayments.
========================================================= */

export const spendingLevels: Record<
  SpendingLevel,
  {
    title: string;
    description: string;
    essentials: number;
    lifestyle: number;
  }
> = {
  lean: {
    title: "Keep It Lean",

    description:
      "Cook mostly at home, limit subscriptions and keep discretionary spending low.",

    essentials: 360,

    lifestyle: 160,
  },

  balanced: {
    title: "Balanced Lifestyle",

    description:
      "Enjoy regular social activities while keeping spending under reasonable control.",

    essentials: 430,

    lifestyle: 300,
  },

  comfortable: {
    title: "Comfortable Lifestyle",

    description:
      "More eating out, shopping, subscriptions, entertainment and regular leisure spending.",

    essentials: 500,

    lifestyle: 520,
  },

  premium: {
    title: "Live Premium",

    description:
      "Frequent dining, premium subscriptions, shopping, travel and a higher-cost social lifestyle.",

    essentials: 580,

    lifestyle: 850,
  },
};

/* =========================================================
   FINANCIAL TWIN

   The Twin does NOT earn more.

   It starts with the same income and starting assets/debt.
   Only its allocation strategy differs.
========================================================= */

export const defaultTwinStrategy: TwinStrategy = {
  housingTargetPercent: 0.30,

  transportTargetPercent: 0.12,

  emergencyFundMonths: 4,

  investingTargetPercent: 0.12,

  pensionTargetPercent: 0.08,

  lifestyleTargetPercent: 0.15,

  highInterestDebtPriority: true,

  /*
   If income increases, the Twin allows only part of the
   increase to become additional lifestyle spending.

   0.30 = 30% of additional disposable income may improve
   lifestyle while the remainder can strengthen the
   financial position.
  */
  lifestyleInflationShare: 0.30,
};

/* =========================================================
   LIFE EVENTS

   These are intentionally relatable rather than extreme.
   The engine will select / activate them by year.
========================================================= */

export const lifeEvents: LifeEvent[] = [
  {
    id: "year-1-first-holiday",

    year: 1,

    type: "holiday",

    headline:
      "Your friends are planning a holiday",

    description:
      "A group of friends invite you on a trip. It would be fun, but it was not part of your original monthly plan.",

    choices: [
      {
        id: "holiday-premium",

        title: "Go all out",

        description:
          "Book the better hotel and enjoy the full trip.",

        immediateCost: 1800,

        lifestyleImpact: 10,
      },

      {
        id: "holiday-budget",

        title: "Go, but set a budget",

        description:
          "Join the trip using a cheaper flight and accommodation.",

        immediateCost: 850,

        lifestyleImpact: 7,
      },

      {
        id: "holiday-skip",

        title: "Skip this one",

        description:
          "Keep the money available for your other goals.",

        immediateCost: 0,

        lifestyleImpact: -2,
      },
    ],

    learningPoint:
      "Financial planning is not about never enjoying money. It is about deciding what you can afford without undermining other priorities.",
  },

  {
    id: "year-2-salary-review",

    year: 2,

    type: "salary-review",

    headline:
      "Your annual salary review arrives",

    description:
      "Your performance has been good and your employer increases your salary. What happens to the additional income?",

    choices: [
      {
        id: "raise-spend",

        title: "Upgrade my lifestyle",

        description:
          "Use most of the increase to improve your monthly lifestyle.",

        annualIncomeChange: 1500,

        monthlyCostChange: 105,

        lifestyleImpact: 8,
      },

      {
        id: "raise-split",

        title: "Enjoy some, save some",

        description:
          "Allow yourself some lifestyle improvement while directing part of the raise towards your future.",

        annualIncomeChange: 1500,

        monthlyCostChange: 45,

        savingsImpact: 300,
      },

      {
        id: "raise-future",

        title: "Keep my lifestyle unchanged",

        description:
          "Direct most of the additional disposable income towards saving and investing.",

        annualIncomeChange: 1500,

        investmentImpact: 500,
      },
    ],

    learningPoint:
      "Income growth can build wealth rapidly when lifestyle costs do not rise at exactly the same speed.",
  },

  {
    id: "year-3-car-repair",

    year: 3,

    type: "car-repair",

    headline:
      "An unexpected transport bill arrives",

    description:
      "A major repair or unexpected transport problem will cost £780.",

    choices: [
      {
        id: "repair-cash",

        title: "Use available savings",

        description:
          "Pay the cost without borrowing.",

        immediateCost: 780,
      },

      {
        id: "repair-credit",

        title: "Put it on credit",

        description:
          "Protect your cash today but add consumer debt.",

        debtImpact: 780,
      },

      {
        id: "repair-cutback",

        title: "Cut spending and pay it",

        description:
          "Temporarily reduce discretionary spending to absorb part of the bill.",

        immediateCost: 500,

        lifestyleImpact: -5,
      },
    ],

    learningPoint:
      "Emergency savings can turn an unexpected expense into an inconvenience rather than a debt problem.",
  },

  {
    id: "year-4-promotion",

    year: 4,

    type: "promotion",

    headline:
      "Congratulations — you've been promoted",

    description:
      "Your responsibilities increase and your salary rises. The promotion also makes a more expensive lifestyle feel affordable.",

    choices: [
      {
        id: "promotion-upgrade",

        title: "Celebrate with an upgrade",

        description:
          "Increase your recurring lifestyle costs after the promotion.",

        annualIncomeChange: 6000,

        monthlyCostChange: 260,

        lifestyleImpact: 10,
      },

      {
        id: "promotion-balanced",

        title: "Upgrade a little",

        description:
          "Enjoy part of the promotion while increasing long-term allocations.",

        annualIncomeChange: 6000,

        monthlyCostChange: 100,

        investmentImpact: 750,
      },

      {
        id: "promotion-build",

        title: "Keep building",

        description:
          "Keep your current major lifestyle commitments and use the additional income to strengthen your finances.",

        annualIncomeChange: 6000,

        investmentImpact: 1500,
      },
    ],

    learningPoint:
      "A promotion creates a powerful wealth-building opportunity when recurring expenses do not consume the entire increase.",
  },

  {
    id: "year-5-family-support",

    year: 5,

    type: "family-support",

    headline:
      "Someone close to you needs financial help",

    description:
      "A family situation arises and you would like to contribute. There is no perfect answer — your finances and values both matter.",

    choices: [
      {
        id: "support-large",

        title: "Provide substantial support",

        description:
          "Contribute £2,500 from your available resources.",

        immediateCost: 2500,

        lifestyleImpact: 8,
      },

      {
        id: "support-manageable",

        title: "Help within my means",

        description:
          "Contribute £1,000 while protecting your essential commitments.",

        immediateCost: 1000,

        lifestyleImpact: 6,
      },

      {
        id: "support-other",

        title: "Help in another way",

        description:
          "Provide practical support without making a large financial commitment.",

        immediateCost: 200,

        lifestyleImpact: 2,
      },
    ],

    learningPoint:
      "Good financial planning should create room for personal values and responsibilities, not eliminate them.",
  },

  {
    id: "year-6-inflation",

    year: 6,

    type: "inflation",

    headline:
      "The cost of living rises sharply",

    description:
      "Food, energy and everyday costs increase faster than usual. Your salary has not immediately caught up.",

    choices: [
      {
        id: "inflation-ignore",

        title: "Keep spending normally",

        description:
          "Absorb the higher costs without changing your lifestyle.",

        monthlyCostChange: 150,
      },

      {
        id: "inflation-review",

        title: "Review my spending",

        description:
          "Reduce lower-priority spending to absorb much of the increase.",

        monthlyCostChange: 55,

        lifestyleImpact: -3,
      },

      {
        id: "inflation-cut-hard",

        title: "Temporarily cut back",

        description:
          "Make a stronger temporary reduction while prices are elevated.",

        monthlyCostChange: 20,

        lifestyleImpact: -7,
      },
    ],

    learningPoint:
      "Inflation reduces purchasing power. Flexible spending gives households more room to adapt.",
  },

  {
    id: "year-7-job-loss",

    year: 7,

    type: "job-loss",

    headline:
      "Your employer announces restructuring",

    description:
      "Your role is affected. You face a temporary period without your normal salary while searching for another position.",

    choices: [
      {
        id: "jobloss-maintain",

        title: "Maintain my lifestyle",

        description:
          "Keep most existing spending while looking for another role.",

        savingsImpact: -3500,
      },

      {
        id: "jobloss-reduce",

        title: "Reduce discretionary spending",

        description:
          "Temporarily cut lifestyle spending while using your financial buffer.",

        savingsImpact: -1800,

        lifestyleImpact: -6,
      },

      {
        id: "jobloss-emergency",

        title: "Switch to emergency mode",

        description:
          "Protect cash aggressively until your income returns.",

        savingsImpact: -900,

        lifestyleImpact: -10,
      },
    ],

    learningPoint:
      "Financial resilience is partly about having enough liquidity and flexibility to survive interruptions in income.",
  },

  {
    id: "year-8-new-job",

    year: 8,

    type: "new-job",

    headline:
      "A new opportunity arrives",

    description:
      "After the disruption of the previous year, another employer offers you a stronger position.",

    choices: [
      {
        id: "newjob-accept",

        title: "Accept the offer",

        description:
          "Take the new position and restore income with improved pay.",

        annualIncomeChange: 7000,
      },

      {
        id: "newjob-negotiate",

        title: "Negotiate first",

        description:
          "Ask for a stronger package. In this simulation, the negotiation succeeds.",

        annualIncomeChange: 8500,
      },
    ],

    learningPoint:
      "Career decisions and earning power are part of personal finance. Wealth building is not only about reducing expenses.",
  },

  {
    id: "year-9-market-fall",

    year: 9,

    type: "market-fall",

    headline:
      "Investment markets fall sharply",

    description:
      "Your investment account is suddenly worth less than it was several months ago.",

    choices: [
      {
        id: "market-sell",

        title: "Sell my investments",

        description:
          "Move out of investments after the decline.",

        investmentImpact: -0.12,
      },

      {
        id: "market-hold",

        title: "Stay invested",

        description:
          "Keep the portfolio invested according to your existing long-term plan.",

        investmentImpact: -0.05,
      },

      {
        id: "market-continue",

        title: "Continue regular investing",

        description:
          "Maintain the long-term allocation despite uncomfortable market conditions.",

        investmentImpact: -0.03,
      },
    ],

    learningPoint:
      "Market declines are uncomfortable. Long-term financial planning requires understanding the difference between volatility and a permanent loss of capital.",
  },

  {
    id: "year-10-final-choice",

    year: 10,

    type: "unexpected-expense",

    headline:
      "Ten years have passed",

    description:
      "Before seeing your final financial position, you have one last choice about what to do with a £3,000 work bonus.",

    choices: [
      {
        id: "bonus-spend",

        title: "Enjoy the entire bonus",

        description:
          "Use the bonus for lifestyle and experiences.",

        immediateCost: 3000,

        lifestyleImpact: 10,
      },

      {
        id: "bonus-split",

        title: "Split it",

        description:
          "Enjoy some now and allocate the rest towards your financial future.",

        immediateCost: 1500,

        investmentImpact: 1500,

        lifestyleImpact: 5,
      },

      {
        id: "bonus-invest",

        title: "Invest the bonus",

        description:
          "Allocate the full bonus towards your longer-term financial position.",

        investmentImpact: 3000,
      },
    ],

    learningPoint:
      "Windfalls create allocation choices just like ordinary income. The decision is not automatically spend or save — it depends on priorities and financial position.",
  },
];

/* =========================================================
   HELPERS
========================================================= */

export function getHousingChoice(
  id: HousingChoice["id"],
) {
  return housingChoices.find(
    (choice) =>
      choice.id === id,
  );
}

export function getTransportChoice(
  id: TransportChoice["id"],
) {
  return transportChoices.find(
    (choice) =>
      choice.id === id,
  );
}

export function getLifeEventForYear(
  year: number,
) {
  return lifeEvents.find(
    (event) =>
      event.year === year,
  );
}

export function totalHousingCost(
  housing: HousingChoice,
) {
  return (
    housing.monthlyRent +
    housing.councilTax +
    housing.utilities +
    housing.internet +
    housing.insurance +
    housing.commuteCost
  );
}

export function totalTransportCost(
  transport: TransportChoice,
) {
  return (
    transport.monthlyFinance +
    transport.monthlyInsurance +
    transport.monthlyFuel +
    transport.monthlyTax +
    transport.monthlyMaintenance
  );
}