import { createCourse } from "@/features/academy-content";

import { taxLiteracyUnit } from "./01-taxLiteracy";
import { propertyMortgagesUnit } from "./02-propertyMortgages";
import { businessFinanceUnit } from "./03-businessFinance";
import { financialStatementsUnit } from "./04-financialStatements";
import { economyMarketsUnit } from "./05-economyMarkets";
import { estateWealthTransferUnit } from "./06-estateWealthTransfer";
import { wealthRiskProtectionUnit } from "./07-wealthRiskProtection";
import { familyWealthGovernanceUnit } from "./08-familyWealthGovernance";
import { givingPhilanthropyUnit } from "./09-givingPhilanthropy";


export const advancedWealthCourse = createCourse({
  id: "advanced-wealth-course",
  programmeId: "money-foundation",
  stage: "advanced",
  title: "Build, Protect & Transfer Wealth",
  description:
    "Learn how advanced wealth decisions connect tax, property, business finance, financial statements, economics, estate planning, risk protection, family governance and philanthropy — in plain English and without treating viral strategies as universal answers.",
  learningOutcomes: [
    "Distinguish tax efficiency, avoidance and evasion conceptually.",
    "Understand the logic and risk behind widely discussed strategies such as buy-borrow-die.",
    "Analyse property and mortgage decisions using leverage, cash flow and opportunity cost.",
    "Read the three core business financial statements in plain language.",
    "Connect interest rates, inflation, currencies and economic expectations to financial markets.",
    "Understand wills, trusts, beneficiary designations and estate transfer at a conceptual level.",
    "Recognise concentration, leverage, liability and succession risks after wealth is accumulated.",
    "Understand family offices, family governance and next-generation education.",
    "Design a fictional wealth-transfer and philanthropic framework around family purpose.",
  ],
  estimatedHours: 26,
  units: [
    taxLiteracyUnit,
    propertyMortgagesUnit,
    businessFinanceUnit,
    financialStatementsUnit,
    economyMarketsUnit,
    estateWealthTransferUnit,
    wealthRiskProtectionUnit,
    familyWealthGovernanceUnit,
    givingPhilanthropyUnit,
  ],
});
