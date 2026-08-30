export type SimulationMode =
  | "career"
  | "real-life";

export type CurrencyCode =
  | "GBP"
  | "USD"
  | "CAD"
  | "AUD"
  | "NGN";

export type LifeStage =
  | "setup"
  | "offer"
  | "housing"
  | "transport"
  | "budget"
  | "year"
  | "event"
  | "year-result"
  | "final-result"
  | "what-if";

export type HousingType =
  | "family"
  | "house-share"
  | "basic-flat"
  | "premium-flat"
  | "homeowner";

export type TransportType =
  | "public"
  | "used-car"
  | "new-car"
  | "premium-car";

export type SpendingLevel =
  | "lean"
  | "balanced"
  | "comfortable"
  | "premium";

export type MoneyAllocation = {
  essentials: number;
  lifestyle: number;
  emergencySavings: number;
  investing: number;
  pension: number;
  debtRepayment: number;
  unallocated: number;
};

export type HousingChoice = {
  id: HousingType;

  title: string;
  subtitle: string;

  monthlyRent: number;
  councilTax: number;
  utilities: number;
  internet: number;
  insurance: number;

  depositRequired: number;

  commuteCost: number;

  description: string;

  lifestyleScore: number;

  image?: string;
};

export type TransportChoice = {
  id: TransportType;

  title: string;
  subtitle: string;

  purchasePrice: number;

  deposit: number;

  monthlyFinance: number;
  monthlyInsurance: number;
  monthlyFuel: number;
  monthlyTax: number;
  monthlyMaintenance: number;

  description: string;

  lifestyleScore: number;

  image?: string;
};

export type CareerOffer = {
  id: string;

  title: string;
  company: string;
  location: string;

  annualGrossSalary: number;

  pensionContributionRate: number;

  estimatedAnnualSalaryGrowth: number;

  description: string;
};

export type RealLifeSetup = {
  country: string;

  currency: CurrencyCode;

  annualIncome: number;

  incomeType:
    | "gross"
    | "take-home";

  currentHousingCost: number;

  currentTransportCost: number;

  currentDebtRepayments: number;

  currentEssentialSpending: number;

  currentLifestyleSpending: number;

  startingCashSavings: number;

  startingInvestments: number;

  startingPension: number;

  startingConsumerDebt: number;
};

export type IncomeStatement = {
  grossIncome: number;

  estimatedTax: number;

  estimatedNationalInsurance: number;

  pensionContribution: number;

  takeHomeIncome: number;
};

export type MonthlyExpenses = {
  housing: number;
  transport: number;
  essentials: number;
  lifestyle: number;
  debtRepayments: number;

  total: number;
};

export type FinancialPosition = {
  cash: number;

  emergencyFund: number;

  investments: number;

  pension: number;

  propertyEquity: number;

  otherAssets: number;

  consumerDebt: number;

  otherDebt: number;

  netWorth: number;
};

export type LifeEventType =
  | "salary-review"
  | "promotion"
  | "job-loss"
  | "new-job"
  | "car-repair"
  | "home-repair"
  | "medical-cost"
  | "family-support"
  | "holiday"
  | "wedding"
  | "new-child"
  | "market-rise"
  | "market-fall"
  | "inflation"
  | "interest-rate-change"
  | "unexpected-expense";

export type LifeEventChoice = {
  id: string;

  title: string;

  description: string;

  immediateCost?: number;

  monthlyCostChange?: number;

  annualIncomeChange?: number;

  savingsImpact?: number;

  investmentImpact?: number;

  debtImpact?: number;

  lifestyleImpact?: number;
};

export type LifeEvent = {
  id: string;

  year: number;

  type: LifeEventType;

  headline: string;

  description: string;

  choices: LifeEventChoice[];

  learningPoint: string;
};

export type FinancialDecisionType =
  | "job"
  | "housing"
  | "transport"
  | "spending"
  | "saving"
  | "investing"
  | "pension"
  | "debt"
  | "life-event";

export type FinancialDecision = {
  id: string;

  year: number;

  type: FinancialDecisionType;

  title: string;

  choice: string;

  monthlyImpact: number;

  immediateImpact: number;

  note?: string;
};

export type YearSnapshot = {
  year: number;

  age?: number;

  annualGrossIncome: number;

  annualTakeHomeIncome: number;

  annualExpenses: number;

  annualLifestyleSpending: number;

  annualDebtPayments: number;

  annualSavings: number;

  annualInvestments: number;

  annualPensionContributions: number;

  cash: number;

  emergencyFund: number;

  investments: number;

  pension: number;

  propertyEquity: number;

  consumerDebt: number;

  netWorth: number;
};

export type TwinStrategy = {
  housingTargetPercent: number;

  transportTargetPercent: number;

  emergencyFundMonths: number;

  investingTargetPercent: number;

  pensionTargetPercent: number;

  lifestyleTargetPercent: number;

  highInterestDebtPriority: boolean;

  lifestyleInflationShare: number;
};

export type FinancialTwin = {
  name: string;

  annualIncome: number;

  startingIncome: number;

  startingCashSavings: number;

  startingInvestments: number;

  startingPension: number;

  startingConsumerDebt: number;

  position: FinancialPosition;

  strategy: TwinStrategy;

  history: YearSnapshot[];
};

export type WealthGapBreakdown = {
  housing: number;

  transport: number;

  debtInterest: number;

  investing: number;

  pension: number;

  lifestyle: number;

  other: number;
};

export type FinancialProfile =
  | "balanced-builder"
  | "future-focused-investor"
  | "cautious-saver"
  | "lifestyle-maximiser"
  | "financially-stretched-earner";

export type SimulationScores = {
  resilience: number;

  debtManagement: number;

  savingConsistency: number;

  investmentBehaviour: number;

  lifestyleSustainability: number;
};

export type WhatIfScenario = {
  id: string;

  title: string;

  description: string;

  monthlyChange: number;

  target:
    | "housing"
    | "transport"
    | "lifestyle"
    | "investing"
    | "debt"
    | "income";

  projectedNetWorth: number;

  difference: number;
};

export type WealthSimulationState = {
  version: 1;

  mode: SimulationMode;

  stage: LifeStage;

  currency: CurrencyCode;

  currentYear: number;

  totalYears: number;

  careerOffer:
    | CareerOffer
    | null;

  offerAccepted: boolean;

  realLifeSetup:
    | RealLifeSetup
    | null;

  annualGrossIncome: number;

  annualTakeHomeIncome: number;

  salaryGrowthRate: number;

  housing:
    | HousingChoice
    | null;

  transport:
    | TransportChoice
    | null;

  spendingLevel:
    SpendingLevel;

  monthlyAllocation:
    MoneyAllocation;

  monthlyExpenses:
    MonthlyExpenses;

  position:
    FinancialPosition;

  twin:
    FinancialTwin;

  activeEvent:
    | LifeEvent
    | null;

  completedEvents:
    string[];

  decisions:
    FinancialDecision[];

  history:
    YearSnapshot[];

  scores:
    SimulationScores;

  financialProfile:
    | FinancialProfile
    | null;

  wealthGap:
    number;

  wealthGapBreakdown:
    WealthGapBreakdown;

  whatIfScenarios:
    WhatIfScenario[];

  simulationComplete:
    boolean;
};