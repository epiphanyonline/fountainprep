import {
  DEFAULT_DEBT_INTEREST_RATE,
  DEFAULT_INFLATION_RATE,
  DEFAULT_INVESTMENT_RETURN,
  DEFAULT_PENSION_RETURN,
  DEFAULT_SAVINGS_RETURN,
  DEFAULT_CURRENCY,
  SIMULATION_YEARS,
  defaultCareerOffer,
  defaultTwinStrategy,
  getLifeEventForYear,
  spendingLevels,
  totalHousingCost,
  totalTransportCost,
} from "./data";

import type {
  CareerOffer,
  FinancialPosition,
  FinancialProfile,
  FinancialTwin,
  HousingChoice,
  IncomeStatement,
  LifeEventChoice,
  MoneyAllocation,
  MonthlyExpenses,
  RealLifeSetup,
  SimulationScores,
  SpendingLevel,
  TransportChoice,
  WealthSimulationState,
  YearSnapshot,
} from "./types";

/* =========================================================
   BASIC HELPERS
========================================================= */

const clamp = (
  value: number,
  min = 0,
  max = 100,
) =>
  Math.min(
    Math.max(value, min),
    max,
  );

const positive = (
  value: number,
) => Math.max(0, value);

const roundMoney = (
  value: number,
) =>
  Math.round(
    (value + Number.EPSILON) *
      100,
  ) / 100;

/* =========================================================
   TAX / TAKE-HOME ESTIMATE

   Educational UK approximation.

   This is deliberately a simulation estimate,
   not payroll or tax advice.

   Later we can introduce country-specific
   tax models for USD/CAD/AUD/NGN.
========================================================= */

export function estimateIncome(
  annualGrossSalary: number,
  pensionRate = 0.05,
): IncomeStatement {
  const gross = positive(
    annualGrossSalary,
  );

  const personalAllowance =
    gross > 125140
      ? 0
      : gross > 100000
        ? Math.max(
            0,
            12570 -
              (gross - 100000) / 2,
          )
        : 12570;

  const taxableIncome =
    positive(
      gross -
        personalAllowance,
    );

  const basicBand = 37700;

  const higherBand = 125140;

  let tax = 0;

  if (taxableIncome <= basicBand) {
    tax =
      taxableIncome * 0.2;
  } else {
    tax =
      basicBand * 0.2;

    const higherTaxable =
      Math.min(
        gross,
        higherBand,
      ) -
      personalAllowance -
      basicBand;

    tax +=
      positive(higherTaxable) *
      0.4;

    if (gross > higherBand) {
      tax +=
        (gross -
          higherBand) *
        0.45;
    }
  }

  /*
   Simplified employee NI approximation.

   Good enough for the educational simulation.
   We should not present this as an exact payslip.
  */

  const niThreshold = 12570;

  const upperNiThreshold =
    50270;

  let nationalInsurance = 0;

  if (gross > niThreshold) {
    const mainBand =
      Math.min(
        gross,
        upperNiThreshold,
      ) -
      niThreshold;

    nationalInsurance +=
      positive(mainBand) *
      0.08;

    if (
      gross >
      upperNiThreshold
    ) {
      nationalInsurance +=
        (gross -
          upperNiThreshold) *
        0.02;
    }
  }

  const pensionContribution =
    gross *
    Math.max(
      pensionRate,
      0,
    );

  const takeHomeIncome =
    positive(
      gross -
        tax -
        nationalInsurance -
        pensionContribution,
    );

  return {
    grossIncome:
      roundMoney(gross),

    estimatedTax:
      roundMoney(tax),

    estimatedNationalInsurance:
      roundMoney(
        nationalInsurance,
      ),

    pensionContribution:
      roundMoney(
        pensionContribution,
      ),

    takeHomeIncome:
      roundMoney(
        takeHomeIncome,
      ),
  };
}

/* =========================================================
   FINANCIAL POSITION
========================================================= */

export function calculateNetWorth(
  position: Omit<
    FinancialPosition,
    "netWorth"
  >,
) {
  return roundMoney(
    position.cash +
      position.emergencyFund +
      position.investments +
      position.pension +
      position.propertyEquity +
      position.otherAssets -
      position.consumerDebt -
      position.otherDebt,
  );
}

export function makePosition(
  input?: Partial<
    FinancialPosition
  >,
): FinancialPosition {
  const base = {
    cash:
      input?.cash ?? 0,

    emergencyFund:
      input?.emergencyFund ??
      0,

    investments:
      input?.investments ?? 0,

    pension:
      input?.pension ?? 0,

    propertyEquity:
      input?.propertyEquity ??
      0,

    otherAssets:
      input?.otherAssets ?? 0,

    consumerDebt:
      input?.consumerDebt ?? 0,

    otherDebt:
      input?.otherDebt ?? 0,
  };

  return {
    ...base,

    netWorth:
      calculateNetWorth(base),
  };
}

/* =========================================================
   EXPENSES
========================================================= */

export function calculateExpenses(
  housing:
    | HousingChoice
    | null,
  transport:
    | TransportChoice
    | null,
  spendingLevel:
    SpendingLevel,
  debtRepayments = 0,
): MonthlyExpenses {
  const spending =
    spendingLevels[
      spendingLevel
    ];

  const housingCost =
    housing
      ? totalHousingCost(
          housing,
        )
      : 0;

  const transportCost =
    transport
      ? totalTransportCost(
          transport,
        )
      : 0;

  const essentials =
    spending.essentials;

  const lifestyle =
    spending.lifestyle;

  const debt =
    positive(
      debtRepayments,
    );

  return {
    housing:
      roundMoney(
        housingCost,
      ),

    transport:
      roundMoney(
        transportCost,
      ),

    essentials:
      roundMoney(
        essentials,
      ),

    lifestyle:
      roundMoney(
        lifestyle,
      ),

    debtRepayments:
      roundMoney(debt),

    total:
      roundMoney(
        housingCost +
          transportCost +
          essentials +
          lifestyle +
          debt,
      ),
  };
}

/* =========================================================
   DEFAULT MONTHLY ALLOCATION
========================================================= */

export function makeAllocation(
  monthlyTakeHome: number,
  monthlyExpenses: MonthlyExpenses,
): MoneyAllocation {
  const remaining =
    positive(
      monthlyTakeHome -
        monthlyExpenses.total,
    );

  return {
    essentials:
      monthlyExpenses.essentials,

    lifestyle:
      monthlyExpenses.lifestyle,

    emergencySavings:
      roundMoney(
        remaining * 0.25,
      ),

    investing:
      roundMoney(
        remaining * 0.35,
      ),

    pension: 0,

    debtRepayment:
      monthlyExpenses.debtRepayments,

    unallocated:
      roundMoney(
        remaining * 0.4,
      ),
  };
}

/* =========================================================
   FINANCIAL TWIN
========================================================= */

function createTwin(
  annualIncome: number,
  startingPosition:
    FinancialPosition,
): FinancialTwin {
  return {
    name:
      "Your Financial Twin",

    annualIncome,

    startingIncome:
      annualIncome,

    startingCashSavings:
      startingPosition.cash +
      startingPosition
        .emergencyFund,

    startingInvestments:
      startingPosition
        .investments,

    startingPension:
      startingPosition.pension,

    startingConsumerDebt:
      startingPosition
        .consumerDebt,

    position: {
      ...startingPosition,
    },

    strategy: {
      ...defaultTwinStrategy,
    },

    history: [],
  };
}

/* =========================================================
   CAREER GAME INITIAL STATE
========================================================= */

export function createCareerGame(
  offer: CareerOffer =
    defaultCareerOffer,
): WealthSimulationState {
  const income =
    estimateIncome(
      offer.annualGrossSalary,
      offer.pensionContributionRate,
    );

  const startingPosition =
    makePosition();

  return {
    version: 1,

    mode: "career",

    stage: "offer",

    currency:
      DEFAULT_CURRENCY,

    currentYear: 1,

    totalYears:
      SIMULATION_YEARS,

    careerOffer: offer,

    offerAccepted: false,

    realLifeSetup: null,

    annualGrossIncome:
      offer.annualGrossSalary,

    annualTakeHomeIncome:
      income.takeHomeIncome,

    salaryGrowthRate:
      offer.estimatedAnnualSalaryGrowth,

    housing: null,

    transport: null,

    spendingLevel:
      "balanced",

    monthlyAllocation:
      makeAllocation(
        income.takeHomeIncome /
          12,
        calculateExpenses(
          null,
          null,
          "balanced",
        ),
      ),

    monthlyExpenses:
      calculateExpenses(
        null,
        null,
        "balanced",
      ),

    position:
      startingPosition,

    twin:
      createTwin(
        offer.annualGrossSalary,
        startingPosition,
      ),

    activeEvent: null,

    completedEvents: [],

    decisions: [],

    history: [],

    scores: {
      resilience: 50,
      debtManagement: 60,
      savingConsistency: 50,
      investmentBehaviour: 50,
      lifestyleSustainability: 50,
    },

    financialProfile: null,

    wealthGap: 0,

    wealthGapBreakdown: {
      housing: 0,
      transport: 0,
      debtInterest: 0,
      investing: 0,
      pension: 0,
      lifestyle: 0,
      other: 0,
    },

    whatIfScenarios: [],

    simulationComplete:
      false,
  };
}

/* =========================================================
   REAL-LIFE GAME INITIAL STATE

   IMPORTANT:
   Twin starts from exactly the same income,
   assets and debt as the learner.
========================================================= */

export function createRealLifeGame(
  setup: RealLifeSetup,
): WealthSimulationState {
  const annualGross =
    setup.incomeType ===
    "gross"
      ? setup.annualIncome
      : setup.annualIncome *
        1.28;

  const estimated =
    setup.incomeType ===
    "gross"
      ? estimateIncome(
          annualGross,
        )
      : {
          grossIncome:
            annualGross,

          estimatedTax: 0,

          estimatedNationalInsurance:
            0,

          pensionContribution:
            0,

          takeHomeIncome:
            setup.annualIncome,
        };

  const startingPosition =
    makePosition({
      cash:
        setup.startingCashSavings,

      investments:
        setup.startingInvestments,

      pension:
        setup.startingPension,

      consumerDebt:
        setup.startingConsumerDebt,
    });

  const monthlyExpenses: MonthlyExpenses =
    {
      housing:
        setup.currentHousingCost,

      transport:
        setup.currentTransportCost,

      essentials:
        setup.currentEssentialSpending,

      lifestyle:
        setup.currentLifestyleSpending,

      debtRepayments:
        setup.currentDebtRepayments,

      total:
        roundMoney(
          setup.currentHousingCost +
            setup.currentTransportCost +
            setup.currentEssentialSpending +
            setup.currentLifestyleSpending +
            setup.currentDebtRepayments,
        ),
    };

  return {
    version: 1,

    mode:
      "real-life",

    stage: "budget",

    currency:
      setup.currency,

    currentYear: 1,

    totalYears:
      SIMULATION_YEARS,

    careerOffer: null,

    offerAccepted: true,

    realLifeSetup:
      setup,

    annualGrossIncome:
      roundMoney(
        annualGross,
      ),

    annualTakeHomeIncome:
      roundMoney(
        estimated.takeHomeIncome,
      ),

    salaryGrowthRate:
      0.035,

    housing: null,

    transport: null,

    spendingLevel:
      "balanced",

    monthlyAllocation:
      makeAllocation(
        estimated.takeHomeIncome /
          12,
        monthlyExpenses,
      ),

    monthlyExpenses,

    position:
      startingPosition,

    twin:
      createTwin(
        annualGross,
        startingPosition,
      ),

    activeEvent: null,

    completedEvents: [],

    decisions: [],

    history: [],

    scores: {
      resilience: 50,
      debtManagement: 50,
      savingConsistency: 50,
      investmentBehaviour: 50,
      lifestyleSustainability: 50,
    },

    financialProfile: null,

    wealthGap: 0,

    wealthGapBreakdown: {
      housing: 0,
      transport: 0,
      debtInterest: 0,
      investing: 0,
      pension: 0,
      lifestyle: 0,
      other: 0,
    },

    whatIfScenarios: [],

    simulationComplete:
      false,
  };
}

/* =========================================================
   CAREER SETUP ACTIONS
========================================================= */

export function acceptOffer(
  state: WealthSimulationState,
): WealthSimulationState {
  if (!state.careerOffer) {
    return state;
  }

  return {
    ...state,

    offerAccepted: true,

    stage: "housing",

    decisions: [
      ...state.decisions,
      {
        id: `job-${Date.now()}`,

        year: 1,

        type: "job",

        title:
          "Accepted career offer",

        choice:
          state.careerOffer.title,

        monthlyImpact: 0,

        immediateImpact: 0,
      },
    ],
  };
}

export function chooseHousing(
  state: WealthSimulationState,
  housing: HousingChoice,
): WealthSimulationState {
  const expenses =
    calculateExpenses(
      housing,
      state.transport,
      state.spendingLevel,
      state.monthlyExpenses
        .debtRepayments,
    );

  const position =
    makePosition({
      ...state.position,

      cash:
        state.position.cash -
        housing.depositRequired,
    });

  return {
    ...state,

    housing,

    position,

    monthlyExpenses:
      expenses,

    monthlyAllocation:
      makeAllocation(
        state.annualTakeHomeIncome /
          12,
        expenses,
      ),

    stage: "transport",

    decisions: [
      ...state.decisions,
      {
        id: `housing-${Date.now()}`,

        year:
          state.currentYear,

        type: "housing",

        title:
          "Housing choice",

        choice:
          housing.title,

        monthlyImpact:
          totalHousingCost(
            housing,
          ),

        immediateImpact:
          housing.depositRequired,
      },
    ],
  };
}

export function chooseTransport(
  state: WealthSimulationState,
  transport: TransportChoice,
): WealthSimulationState {
  const expenses =
    calculateExpenses(
      state.housing,
      transport,
      state.spendingLevel,
      state.monthlyExpenses
        .debtRepayments,
    );

  const position =
    makePosition({
      ...state.position,

      cash:
        state.position.cash -
        transport.deposit,
    });

  return {
    ...state,

    transport,

    position,

    monthlyExpenses:
      expenses,

    monthlyAllocation:
      makeAllocation(
        state.annualTakeHomeIncome /
          12,
        expenses,
      ),

    stage: "budget",

    decisions: [
      ...state.decisions,
      {
        id: `transport-${Date.now()}`,

        year:
          state.currentYear,

        type: "transport",

        title:
          "Transport choice",

        choice:
          transport.title,

        monthlyImpact:
          totalTransportCost(
            transport,
          ),

        immediateImpact:
          transport.deposit,
      },
    ],
  };
}

export function chooseSpendingLevel(
  state: WealthSimulationState,
  spendingLevel:
    SpendingLevel,
): WealthSimulationState {
  const expenses =
    calculateExpenses(
      state.housing,
      state.transport,
      spendingLevel,
      state.monthlyExpenses
        .debtRepayments,
    );

  return {
    ...state,

    spendingLevel,

    monthlyExpenses:
      expenses,

    monthlyAllocation:
      makeAllocation(
        state.annualTakeHomeIncome /
          12,
        expenses,
      ),

    stage: "year",

    decisions: [
      ...state.decisions,
      {
        id: `spending-${Date.now()}`,

        year:
          state.currentYear,

        type: "spending",

        title:
          "Lifestyle choice",

        choice:
          spendingLevels[
            spendingLevel
          ].title,

        monthlyImpact:
          spendingLevels[
            spendingLevel
          ].lifestyle,

        immediateImpact: 0,
      },
    ],
  };
}

/* =========================================================
   CUSTOM ALLOCATION

   This lets the learner decide what happens to
   money left after ordinary expenses.
========================================================= */

export function setMonthlyAllocation(
  state: WealthSimulationState,
  allocation: Partial<
    MoneyAllocation
  >,
): WealthSimulationState {
  return {
    ...state,

    monthlyAllocation: {
      ...state.monthlyAllocation,
      ...allocation,
    },
  };
}

/* =========================================================
   MID-GAME LIFE REBALANCE

   People change their minds.

   This lets the learner change housing, transport,
   lifestyle and the split of spare monthly cash
   WITHOUT resetting the simulation or jumping to a
   different stage.

   The model intentionally stays educational rather
   than pretending to model every legal/finance detail
   of moving home or selling a vehicle.
========================================================= */

export type LifeRebalanceInput = {
  housing?: HousingChoice | null;
  transport?: TransportChoice | null;
  spendingLevel?: SpendingLevel;
  emergencySavingsPercent?: number;
  investingPercent?: number;
};

export function rebalanceLife(
  state: WealthSimulationState,
  input: LifeRebalanceInput,
): WealthSimulationState {
  const nextHousing =
    input.housing !== undefined
      ? input.housing
      : state.housing;

  const nextTransport =
    input.transport !== undefined
      ? input.transport
      : state.transport;

  const nextSpendingLevel =
    input.spendingLevel ??
    state.spendingLevel;

  let position = {
    ...state.position,
  };

  /*
   Housing change.

   For rental-style options we return most of the old
   deposit before charging the new one. A small portion
   is treated as moving / exit friction.

   Home ownership is already reflected separately through
   property equity, so we do not invent a cash refund here.
  */

  if (
    input.housing !== undefined &&
    state.housing?.id !==
      nextHousing?.id
  ) {
    const oldDeposit =
      state.housing?.depositRequired ??
      0;

    const newDeposit =
      nextHousing?.depositRequired ??
      0;

    const refundableOldDeposit =
      state.housing &&
      state.housing.id !==
        "homeowner"
        ? oldDeposit * 0.85
        : 0;

    const movingCost =
      state.housing
        ? 250
        : 0;

    position.cash +=
      refundableOldDeposit;

    let cashRequired =
      newDeposit +
      movingCost;

    const cashUsed =
      Math.min(
        Math.max(
          position.cash,
          0,
        ),
        cashRequired,
      );

    position.cash -=
      cashUsed;

    cashRequired -=
      cashUsed;

    if (cashRequired > 0) {
      position.consumerDebt +=
        cashRequired;
    }
  }

  /*
   Transport change.

   The existing model treats the vehicle mainly as a
   monthly commitment rather than a balance-sheet asset.
   If the learner exits a car, we therefore only return
   part of the original deposit as simplified resale /
   equity value before applying any new deposit.
  */

  if (
    input.transport !== undefined &&
    state.transport?.id !==
      nextTransport?.id
  ) {
    const oldDeposit =
      state.transport?.deposit ??
      0;

    const newDeposit =
      nextTransport?.deposit ??
      0;

    const exitCredit =
      state.transport &&
      state.transport.id !==
        "public"
        ? oldDeposit * 0.5
        : 0;

    position.cash +=
      exitCredit;

    let cashRequired =
      newDeposit;

    const cashUsed =
      Math.min(
        Math.max(
          position.cash,
          0,
        ),
        cashRequired,
      );

    position.cash -=
      cashUsed;

    cashRequired -=
      cashUsed;

    if (cashRequired > 0) {
      position.consumerDebt +=
        cashRequired;
    }
  }

  const expenses =
    calculateExpenses(
      nextHousing,
      nextTransport,
      nextSpendingLevel,
      state.monthlyExpenses
        .debtRepayments,
    );

  const monthlyTakeHome =
    state.annualTakeHomeIncome /
    12;

  const remaining =
    positive(
      monthlyTakeHome -
        expenses.total,
    );

  const emergencyPercent =
    clamp(
      input.emergencySavingsPercent ??
        (remaining > 0
          ? state.monthlyAllocation
              .emergencySavings /
            remaining
          : 0.25),
      0,
      1,
    );

  const investmentPercent =
    clamp(
      input.investingPercent ??
        (remaining > 0
          ? state.monthlyAllocation
              .investing /
            remaining
          : 0.35),
      0,
      1,
    );

  /*
   If the learner asks to save + invest more than the
   available surplus, scale both down proportionally.
  */

  const requestedTotal =
    emergencyPercent +
    investmentPercent;

  const scale =
    requestedTotal > 1
      ? 1 / requestedTotal
      : 1;

  const finalEmergencyPercent =
    emergencyPercent * scale;

  const finalInvestmentPercent =
    investmentPercent * scale;

  const emergencySavings =
    roundMoney(
      remaining *
        finalEmergencyPercent,
    );

  const investing =
    roundMoney(
      remaining *
        finalInvestmentPercent,
    );

  const unallocated =
    roundMoney(
      positive(
        remaining -
          emergencySavings -
          investing,
      ),
    );

  position =
    makePosition(position);

  return {
    ...state,

    housing:
      nextHousing,

    transport:
      nextTransport,

    spendingLevel:
      nextSpendingLevel,

    monthlyExpenses:
      expenses,

    monthlyAllocation: {
      ...state.monthlyAllocation,

      essentials:
        expenses.essentials,

      lifestyle:
        expenses.lifestyle,

      debtRepayment:
        expenses.debtRepayments,

      emergencySavings,

      investing,

      unallocated,
    },

    position,

    decisions: [
      ...state.decisions,
      {
        id:
          `rebalance-${Date.now()}`,

        year:
          state.currentYear,

        type:
          "spending",

        title:
          "Rebalanced financial life",

        choice:
          [
            nextHousing?.title,
            nextTransport?.title,
            spendingLevels[
              nextSpendingLevel
            ].title,
            `Invest ${Math.round(
              finalInvestmentPercent *
                100,
            )}% of monthly surplus`,
          ]
            .filter(Boolean)
            .join(" · "),

        monthlyImpact:
          expenses.total,

        immediateImpact: 0,

        note:
          "The learner changed their plan after reviewing a previous year's result.",
      },
    ],
  };
}

/* =========================================================
   COMPOUNDING
========================================================= */

function grow(
  amount: number,
  annualRate: number,
) {
  return positive(
    amount *
      (1 + annualRate),
  );
}

/* =========================================================
   DEBT ENGINE
========================================================= */

function processDebtYear(
  debt: number,
  annualPayments: number,
) {
  if (debt <= 0) {
    return {
      debt: 0,
      interestPaid: 0,
    };
  }

  const interest =
    debt *
    DEFAULT_DEBT_INTEREST_RATE;

  const endingDebt =
    positive(
      debt +
        interest -
        annualPayments,
    );

  return {
    debt:
      roundMoney(
        endingDebt,
      ),

    interestPaid:
      roundMoney(
        Math.min(
          interest,
          debt + interest,
        ),
      ),
  };
}

/* =========================================================
   LEARNER YEAR
========================================================= */

function simulateLearnerYear(
  state: WealthSimulationState,
) {
  const annualTakeHome =
    state.annualTakeHomeIncome;

  const annualExpenses =
    state.monthlyExpenses.total *
    12;

  const annualLifestyle =
    state.monthlyExpenses
      .lifestyle * 12;

  const annualDebtPayments =
    state.monthlyAllocation
      .debtRepayment * 12;

  const annualEmergencySaving =
    state.monthlyAllocation
      .emergencySavings * 12;

  const annualInvesting =
    state.monthlyAllocation
      .investing * 12;

  const annualPension =
    state.monthlyAllocation
      .pension * 12;

  const annualUnallocated =
    state.monthlyAllocation
      .unallocated * 12;

  let investments =
    grow(
      state.position
        .investments,
      DEFAULT_INVESTMENT_RETURN,
    );

  investments +=
    annualInvesting;

  let pension =
    grow(
      state.position.pension,
      DEFAULT_PENSION_RETURN,
    );

  pension +=
    annualPension;

  let emergencyFund =
    grow(
      state.position
        .emergencyFund,
      DEFAULT_SAVINGS_RETURN,
    );

  emergencyFund +=
    annualEmergencySaving;

  const debtResult =
    processDebtYear(
      state.position
        .consumerDebt,
      annualDebtPayments,
    );

  let propertyEquity =
    state.position
      .propertyEquity;

  if (
    state.housing?.id ===
    "homeowner"
  ) {
    /*
     Simplified mortgage equity build-up.

     We are not pretending every mortgage payment
     becomes wealth. Only a portion is credited
     as principal/equity.
    */

    propertyEquity +=
      state.housing
        .monthlyRent *
      12 *
      0.32;

    propertyEquity *= 1.025;
  }

  /*
   Anything deliberately left unallocated
   remains available as cash rather than
   magically disappearing.
  */

  let cash =
    state.position.cash +
    annualUnallocated;

  /*
   If planned expenses exceed take-home income,
   the deficit must come from cash first and
   then consumer debt.
  */

  const plannedOutflow =
    annualExpenses +
    annualEmergencySaving +
    annualInvesting +
    annualPension;

  const annualDeficit =
    positive(
      plannedOutflow -
        annualTakeHome,
    );

  let consumerDebt =
    debtResult.debt;

  if (annualDeficit > 0) {
    const cashUsed =
      Math.min(
        cash,
        annualDeficit,
      );

    cash -= cashUsed;

    consumerDebt +=
      annualDeficit -
      cashUsed;
  }

  const position =
    makePosition({
      cash:
        roundMoney(cash),

      emergencyFund:
        roundMoney(
          emergencyFund,
        ),

      investments:
        roundMoney(
          investments,
        ),

      pension:
        roundMoney(pension),

      propertyEquity:
        roundMoney(
          propertyEquity,
        ),

      otherAssets:
        state.position
          .otherAssets,

      consumerDebt:
        roundMoney(
          consumerDebt,
        ),

      otherDebt:
        state.position
          .otherDebt,
    });

  const snapshot: YearSnapshot =
    {
      year:
        state.currentYear,

      annualGrossIncome:
        state.annualGrossIncome,

      annualTakeHomeIncome:
        annualTakeHome,

      annualExpenses:
        roundMoney(
          annualExpenses,
        ),

      annualLifestyleSpending:
        roundMoney(
          annualLifestyle,
        ),

      annualDebtPayments:
        roundMoney(
          annualDebtPayments,
        ),

      annualSavings:
        roundMoney(
          annualEmergencySaving +
            annualUnallocated,
        ),

      annualInvestments:
        roundMoney(
          annualInvesting,
        ),

      annualPensionContributions:
        roundMoney(
          annualPension,
        ),

      cash: position.cash,

      emergencyFund:
        position.emergencyFund,

      investments:
        position.investments,

      pension:
        position.pension,

      propertyEquity:
        position.propertyEquity,

      consumerDebt:
        position.consumerDebt,

      netWorth:
        position.netWorth,
    };

  return {
    position,
    snapshot,
    debtInterest:
      debtResult.interestPaid,
  };
}

/* =========================================================
   FINANCIAL TWIN YEAR

   Same income.

   Different allocation philosophy.
========================================================= */

function simulateTwinYear(
  twin: FinancialTwin,
  annualGrossIncome: number,
  learnerMonthlyExpenses:
    MonthlyExpenses,
  currentYear: number,
): FinancialTwin {
  const income =
    estimateIncome(
      annualGrossIncome,
      twin.strategy
        .pensionTargetPercent,
    );

  const monthlyTakeHome =
    income.takeHomeIncome /
    12;

  /*
   Twin housing and transport are capped relative
   to take-home income.

   We still give the Twin a realistic lifestyle
   rather than making it live on nothing.
  */

  const housing =
    Math.min(
      learnerMonthlyExpenses
        .housing,
      monthlyTakeHome *
        twin.strategy
          .housingTargetPercent,
    );

  const transport =
    Math.min(
      learnerMonthlyExpenses
        .transport,
      monthlyTakeHome *
        twin.strategy
          .transportTargetPercent,
    );

  const essentials =
    learnerMonthlyExpenses
      .essentials;

  const lifestyle =
    Math.min(
      learnerMonthlyExpenses
        .lifestyle,
      monthlyTakeHome *
        twin.strategy
          .lifestyleTargetPercent,
    );

  const essentialMonthlyCost =
    housing +
    transport +
    essentials +
    lifestyle;

  const emergencyTarget =
    essentialMonthlyCost *
    twin.strategy
      .emergencyFundMonths;

  let remaining =
    positive(
      monthlyTakeHome -
        essentialMonthlyCost,
    );

  let consumerDebt =
    twin.position
      .consumerDebt;

  let emergencyFund =
    grow(
      twin.position
        .emergencyFund,
      DEFAULT_SAVINGS_RETURN,
    );

  let investments =
    grow(
      twin.position
        .investments,
      DEFAULT_INVESTMENT_RETURN,
    );

  let pension =
    grow(
      twin.position.pension,
      DEFAULT_PENSION_RETURN,
    );

  let annualDebtPayments = 0;

  /*
   Priority 1:
   High-interest consumer debt.
  */

  if (
    twin.strategy
      .highInterestDebtPriority &&
    consumerDebt > 0
  ) {
    const monthlyDebtPayment =
      Math.min(
        remaining * 0.65,
        consumerDebt / 12 +
          consumerDebt *
            DEFAULT_DEBT_INTEREST_RATE /
            12,
      );

    annualDebtPayments =
      monthlyDebtPayment *
      12;

    remaining -=
      monthlyDebtPayment;

    const debtResult =
      processDebtYear(
        consumerDebt,
        annualDebtPayments,
      );

    consumerDebt =
      debtResult.debt;
  }

  /*
   Priority 2:
   Emergency fund.
  */

  const emergencyGap =
    positive(
      emergencyTarget -
        emergencyFund,
    );

  const monthlyEmergency =
    Math.min(
      remaining * 0.45,
      emergencyGap / 12,
    );

  const annualEmergency =
    monthlyEmergency * 12;

  emergencyFund +=
    annualEmergency;

  remaining -=
    monthlyEmergency;

  /*
   Priority 3:
   Long-term investing.

   Target is based on take-home income,
   but cannot exceed available cash flow.
  */

  const targetMonthlyInvestment =
    monthlyTakeHome *
    twin.strategy
      .investingTargetPercent;

  const monthlyInvestment =
    Math.min(
      remaining,
      targetMonthlyInvestment,
    );

  const annualInvestment =
    monthlyInvestment * 12;

  investments +=
    annualInvestment;

  remaining -=
    monthlyInvestment;

  /*
   Remaining surplus becomes cash.
  */

  const annualCashSaving =
    positive(remaining) *
    12;

  const cash =
    twin.position.cash +
    annualCashSaving;

  const position =
    makePosition({
      cash:
        roundMoney(cash),

      emergencyFund:
        roundMoney(
          emergencyFund,
        ),

      investments:
        roundMoney(
          investments,
        ),

      pension:
        roundMoney(pension),

      propertyEquity:
        twin.position
          .propertyEquity,

      otherAssets:
        twin.position
          .otherAssets,

      consumerDebt:
        roundMoney(
          consumerDebt,
        ),

      otherDebt:
        twin.position
          .otherDebt,
    });

  const snapshot: YearSnapshot =
    {
      year: currentYear,

      annualGrossIncome:
        annualGrossIncome,

      annualTakeHomeIncome:
        income.takeHomeIncome,

      annualExpenses:
        roundMoney(
          essentialMonthlyCost *
            12,
        ),

      annualLifestyleSpending:
        roundMoney(
          lifestyle * 12,
        ),

      annualDebtPayments:
        roundMoney(
          annualDebtPayments,
        ),

      annualSavings:
        roundMoney(
          annualEmergency +
            annualCashSaving,
        ),

      annualInvestments:
        roundMoney(
          annualInvestment,
        ),

      annualPensionContributions:
        income.pensionContribution,

      cash:
        position.cash,

      emergencyFund:
        position.emergencyFund,

      investments:
        position.investments,

      pension:
        position.pension,

      propertyEquity:
        position.propertyEquity,

      consumerDebt:
        position.consumerDebt,

      netWorth:
        position.netWorth,
    };

  return {
    ...twin,

    annualIncome:
      annualGrossIncome,

    position,

    history: [
      ...twin.history,
      snapshot,
    ],
  };
}

/* =========================================================
   SCORE ENGINE
========================================================= */

function calculateScores(
  state: WealthSimulationState,
  position: FinancialPosition,
): SimulationScores {
  const monthlyEssentials =
    state.monthlyExpenses
      .housing +
    state.monthlyExpenses
      .transport +
    state.monthlyExpenses
      .essentials;

  const emergencyMonths =
    monthlyEssentials > 0
      ? position.emergencyFund /
        monthlyEssentials
      : 0;

  const monthlyTakeHome =
    state.annualTakeHomeIncome /
    12;

  const fixedCostRatio =
    monthlyTakeHome > 0
      ? (state.monthlyExpenses
          .housing +
          state.monthlyExpenses
            .transport) /
        monthlyTakeHome
      : 1;

  const investmentRate =
    monthlyTakeHome > 0
      ? state.monthlyAllocation
          .investing /
        monthlyTakeHome
      : 0;

  const savingRate =
    monthlyTakeHome > 0
      ? (state.monthlyAllocation
          .emergencySavings +
          state.monthlyAllocation
            .unallocated) /
        monthlyTakeHome
      : 0;

  const debtRatio =
    state.annualGrossIncome > 0
      ? position.consumerDebt /
        state.annualGrossIncome
      : 0;

  return {
    resilience:
      Math.round(
        clamp(
          emergencyMonths *
            18,
        ),
      ),

    debtManagement:
      Math.round(
        clamp(
          100 -
            debtRatio *
              180,
        ),
      ),

    savingConsistency:
      Math.round(
        clamp(
          40 +
            savingRate *
              250,
        ),
      ),

    investmentBehaviour:
      Math.round(
        clamp(
          40 +
            investmentRate *
              260,
        ),
      ),

    lifestyleSustainability:
      Math.round(
        clamp(
          110 -
            fixedCostRatio *
              100,
        ),
      ),
  };
}

/* =========================================================
   FINANCIAL PROFILE
========================================================= */

function determineProfile(
  scores: SimulationScores,
  state: WealthSimulationState,
): FinancialProfile {
  const lifestyle =
    scores.lifestyleSustainability;

  const investing =
    scores.investmentBehaviour;

  const saving =
    scores.savingConsistency;

  const debt =
    scores.debtManagement;

  if (
    investing >= 75 &&
    saving >= 65
  ) {
    return "future-focused-investor";
  }

  if (
    lifestyle >= 65 &&
    saving >= 60 &&
    investing >= 55
  ) {
    return "balanced-builder";
  }

  if (
    saving >= 75 &&
    investing < 55
  ) {
    return "cautious-saver";
  }

  if (
    state.monthlyExpenses
      .lifestyle >
    state.monthlyAllocation
      .investing *
      2
  ) {
    return "lifestyle-maximiser";
  }

  if (
    debt < 45 ||
    lifestyle < 35
  ) {
    return "financially-stretched-earner";
  }

  return "balanced-builder";
}

/* =========================================================
   LIFE EVENT APPLICATION
========================================================= */

export function openCurrentYearEvent(
  state: WealthSimulationState,
): WealthSimulationState {
  const event =
    getLifeEventForYear(
      state.currentYear,
    );

  if (!event) {
    return state;
  }

  return {
    ...state,

    activeEvent: event,

    stage: "event",
  };
}

export function applyLifeEventChoice(
  state: WealthSimulationState,
  choice: LifeEventChoice,
): WealthSimulationState {
  if (!state.activeEvent) {
    return state;
  }

  let position = {
    ...state.position,
  };

  let annualGrossIncome =
    state.annualGrossIncome;

  let monthlyExpenses = {
    ...state.monthlyExpenses,
  };

  let monthlyAllocation = {
    ...state.monthlyAllocation,
  };

  if (
    choice.immediateCost
  ) {
    let cost =
      choice.immediateCost;

    const cashUsed =
      Math.min(
        position.cash,
        cost,
      );

    position.cash -=
      cashUsed;

    cost -= cashUsed;

    const emergencyUsed =
      Math.min(
        position.emergencyFund,
        cost,
      );

    position.emergencyFund -=
      emergencyUsed;

    cost -=
      emergencyUsed;

    if (cost > 0) {
      position.consumerDebt +=
        cost;
    }
  }

  if (
    choice.debtImpact
  ) {
    position.consumerDebt +=
      choice.debtImpact;
  }

  if (
    choice.savingsImpact
  ) {
    if (
      choice.savingsImpact <
      0
    ) {
      const amount =
        Math.abs(
          choice.savingsImpact,
        );

      const used =
        Math.min(
          position.emergencyFund,
          amount,
        );

      position.emergencyFund -=
        used;

      const remainder =
        amount - used;

      if (remainder > 0) {
        position.consumerDebt +=
          remainder;
      }
    } else {
      position.emergencyFund +=
        choice.savingsImpact;
    }
  }

  if (
    choice.investmentImpact
  ) {
    /*
     Small absolute numbers are treated as percentage
     market effects. Larger values are treated as
     contributions.

     Example:
       -0.12 = -12%
       1500  = add £1,500
    */

    if (
      Math.abs(
        choice.investmentImpact,
      ) < 1
    ) {
      position.investments *=
        1 +
        choice.investmentImpact;
    } else {
      position.investments +=
        choice.investmentImpact;
    }
  }

  if (
    choice.annualIncomeChange
  ) {
    annualGrossIncome +=
      choice.annualIncomeChange;
  }

  if (
    choice.monthlyCostChange
  ) {
    monthlyExpenses.lifestyle =
      positive(
        monthlyExpenses
          .lifestyle +
          choice.monthlyCostChange,
      );

    monthlyExpenses.total =
      monthlyExpenses.housing +
      monthlyExpenses.transport +
      monthlyExpenses.essentials +
      monthlyExpenses.lifestyle +
      monthlyExpenses
        .debtRepayments;
  }

  const income =
    estimateIncome(
      annualGrossIncome,
      state.careerOffer
        ?.pensionContributionRate ??
        0.05,
    );

  monthlyAllocation =
    makeAllocation(
      income.takeHomeIncome /
        12,
      monthlyExpenses,
    );

  position =
    makePosition(position);

  return {
    ...state,

    annualGrossIncome:
      roundMoney(
        annualGrossIncome,
      ),

    annualTakeHomeIncome:
      income.takeHomeIncome,

    monthlyExpenses,

    monthlyAllocation,

    position,

    completedEvents: [
      ...state.completedEvents,
      state.activeEvent.id,
    ],

    decisions: [
      ...state.decisions,
      {
        id: `event-${Date.now()}`,

        year:
          state.currentYear,

        type: "life-event",

        title:
          state.activeEvent
            .headline,

        choice:
          choice.title,

        monthlyImpact:
          choice.monthlyCostChange ??
          0,

        immediateImpact:
          choice.immediateCost ??
          0,

        note:
          state.activeEvent
            .learningPoint,
      },
    ],

    activeEvent: null,

    stage: "year",
  };
}

/* =========================================================
   ADVANCE ONE YEAR
========================================================= */

export function advanceYear(
  state: WealthSimulationState,
): WealthSimulationState {
  if (
    state.simulationComplete
  ) {
    return state;
  }

  const learner =
    simulateLearnerYear(
      state,
    );

  const twin =
    simulateTwinYear(
      state.twin,
      state.annualGrossIncome,
      state.monthlyExpenses,
      state.currentYear,
    );

  const scores =
    calculateScores(
      state,
      learner.position,
    );

  const newHistory = [
    ...state.history,
    learner.snapshot,
  ];

  /*
   Year 10 ends the simulation.
  */

  if (
    state.currentYear >=
    state.totalYears
  ) {
    const wealthGap =
      roundMoney(
        twin.position.netWorth -
          learner.position
            .netWorth,
      );

    return {
      ...state,

      position:
        learner.position,

      twin,

      history:
        newHistory,

      scores,

      financialProfile:
        determineProfile(
          scores,
          state,
        ),

      wealthGap,

      simulationComplete:
        true,

      stage:
        "final-result",
    };
  }

  /*
   Prepare the NEXT year's income, but deliberately
   pause on the completed-year statement first.

   This gives the learner a clean rhythm:

   Year event
   -> decision
   -> simulate year
   -> year result
   -> continue
   -> next year's event
  */

  const nextGrossIncome =
    state.annualGrossIncome *
    (1 +
      state.salaryGrowthRate);

  const nextIncome =
    estimateIncome(
      nextGrossIncome,
      state.careerOffer
        ?.pensionContributionRate ??
        0.05,
    );

  const nextYear =
    state.currentYear + 1;

  return {
    ...state,

    currentYear:
      nextYear,

    annualGrossIncome:
      roundMoney(
        nextGrossIncome,
      ),

    annualTakeHomeIncome:
      nextIncome.takeHomeIncome,

    position:
      learner.position,

    twin,

    history:
      newHistory,

    scores,

    /*
     Do not open the next life event yet.
     The UI should first show the financial statement
     for the year that has just finished.
    */

    activeEvent: null,

    stage:
      "year-result",
  };
}

/* =========================================================
   CONTINUE AFTER YEAR RESULT

   Once the learner has reviewed the completed year's
   financial statement, this opens the next year's life
   event. If no event exists, it returns to the normal
   year/payday screen.
========================================================= */

export function continueAfterYearResult(
  state: WealthSimulationState,
): WealthSimulationState {
  if (
    state.simulationComplete
  ) {
    return {
      ...state,

      stage:
        "final-result",
    };
  }

  const event =
    getLifeEventForYear(
      state.currentYear,
    );

  if (event) {
    return {
      ...state,

      activeEvent:
        event,

      stage:
        "event",
    };
  }

  return {
    ...state,

    activeEvent: null,

    stage:
      "year",
  };
}

/* =========================================================
   FINAL COMPARISON HELPERS
========================================================= */

export function totalIncomeEarned(
  history: YearSnapshot[],
) {
  return roundMoney(
    history.reduce(
      (total, year) =>
        total +
        year.annualGrossIncome,
      0,
    ),
  );
}

export function totalLifestyleSpent(
  history: YearSnapshot[],
) {
  return roundMoney(
    history.reduce(
      (total, year) =>
        total +
        year.annualLifestyleSpending,
      0,
    ),
  );
}

export function totalInvested(
  history: YearSnapshot[],
) {
  return roundMoney(
    history.reduce(
      (total, year) =>
        total +
        year.annualInvestments,
      0,
    ),
  );
}

export function totalSaved(
  history: YearSnapshot[],
) {
  return roundMoney(
    history.reduce(
      (total, year) =>
        total +
        year.annualSavings,
      0,
    ),
  );
}

/* =========================================================
   DISPLAY HELPERS
========================================================= */

export function formatMoney(
  value: number,
  currency = "GBP",
) {
  try {
    return new Intl.NumberFormat(
      "en-GB",
      {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      },
    ).format(value);
  } catch {
    return `${currency} ${Math.round(
      value,
    ).toLocaleString(
      "en-GB",
    )}`;
  }
}