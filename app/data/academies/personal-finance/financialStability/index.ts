import { createCourse } from "@/features/academy-content";

import { bankingCreditUnit } from "./01-bankingCredit";
import { debtManagementUnit } from "./02-debtManagement";
import { financialSafetyUnit } from "./03-financialSafety";
import { incomeEnterpriseUnit } from "./04-incomeEnterprise";
import { financialResilienceUnit } from "./05-financialResilience";
import { inflationRealReturnUnit } from "./06-inflationRealReturn";
import { compoundGrowthUnit } from "./07-compoundGrowth";
import { diversificationAllocationUnit } from "./08-diversificationAllocation";
import { goalsTimeRiskUnit } from "./09-goalsTimeRisk";
import { regularInvestingBehaviourUnit } from "./10-regularInvestingBehaviour";


export const financialStabilityCourse = createCourse({
  id: "financial-stability-course",
  programmeId: "money-foundation",
  stage: "advanced",
  title: "Build Your Financial Foundation",
  description:
    "Build the practical systems that make long-term financial progress more resilient: banking, credit, debt, protection, income, emergency planning, inflation awareness, compounding, diversification, goals and behaviour.",
  learningOutcomes: [
    "Use banking and credit products with greater understanding.",
    "Analyse debt by purpose, cost, affordability and risk.",
    "Build practical financial protection and resilience.",
    "Understand income, enterprise and earning capacity.",
    "Distinguish nominal from real return.",
    "Explain compounding on both assets and liabilities.",
    "Use diversification and asset allocation reasoning.",
    "Connect goals, time horizon and risk.",
    "Recognise behavioural patterns that can damage financial decisions.",
    "Build a coherent fictional financial foundation.",
  ],
  estimatedHours: 22,
  units: [
    bankingCreditUnit,
    debtManagementUnit,
    financialSafetyUnit,
    incomeEnterpriseUnit,
    financialResilienceUnit,
    inflationRealReturnUnit,
    compoundGrowthUnit,
    diversificationAllocationUnit,
    goalsTimeRiskUnit,
    regularInvestingBehaviourUnit,
  ],
});
