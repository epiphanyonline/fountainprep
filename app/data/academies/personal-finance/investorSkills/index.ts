import { createCourse } from "@/features/academy-content";

import { portfolioConstructionUnit } from "./01-portfolioConstruction";
import { portfolioRiskUnit } from "./02-portfolioRisk";
import { behaviouralFinanceUnit } from "./03-behaviouralFinance";
import { reviewRebalanceUnit } from "./04-reviewRebalance";
import { investorSystemsUnit } from "./05-investorSystems";
import { stageCapstoneUnit } from "./06-stageCapstone";


export const investorSkillsCourse = createCourse({
  id: "investor-skills-course",
  programmeId: "money-foundation",
  stage: "advanced",
  title: "Build & Manage Your Investment Portfolio",
  description:
    "Move from knowing investments to managing them as a portfolio. Learn construction, risk, concentration, behavioural finance, rebalancing and long-term investor systems through plain-English teaching and recognisable real-world investing conversations.",
  learningOutcomes: [
    "Build a portfolio around goals and asset roles rather than popularity.",
    "Recognise diversification, overlap and hidden concentration.",
    "Understand portfolio risk beyond day-to-day volatility.",
    "Recognise FOMO, panic selling, recency bias and performance chasing.",
    "Understand the logic behind rebalancing and structured portfolio reviews.",
    "Explain common investing debates such as S&P 500 concentration, ETFs versus stocks, buy the dip, dollar-cost averaging, 60/40 portfolios and dividend income.",
    "Build repeatable contribution, review and decision systems.",
    "Defend a fictional portfolio through changing market conditions.",
  ],
  estimatedHours: 24,
  units: [
    portfolioConstructionUnit,
    portfolioRiskUnit,
    behaviouralFinanceUnit,
    reviewRebalanceUnit,
    investorSystemsUnit,
    stageCapstoneUnit,
  ],
});
