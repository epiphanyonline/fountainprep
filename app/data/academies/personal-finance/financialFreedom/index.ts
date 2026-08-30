import { createCourse } from "@/features/academy-content";

import { incomeProducingAssetsUnit } from "./01-incomeProducingAssets";
import { pensionsRetirementUnit } from "./02-pensionsRetirement";
import { freedomNumberUnit } from "./03-freedomNumber";
import { lifestyleInflationUnit } from "./04-lifestyleInflation";
import { wealthPreservationUnit } from "./05-wealthPreservation";
import { financialLifeProjectUnit } from "./06-financialLifeProject";


export const financialFreedomCourse = createCourse({
  id: "financial-freedom-course",
  programmeId: "money-foundation",
  stage: "advanced",
  title: "Design Your Path to Financial Freedom",
  description:
    "Understand how income-producing assets, retirement planning, spending, financial-independence targets, lifestyle choices and wealth preservation work together — without turning popular FIRE rules into promises.",
  learningOutcomes: [
    "Understand where portfolio and asset income actually comes from.",
    "Explain retirement as a long-term cash-flow problem.",
    "Understand pensions as structures rather than single investments.",
    "Explain the 4% rule and 25x rule as planning heuristics with assumptions.",
    "Compare FIRE, Coast FIRE, Barista FIRE, Lean FIRE and Fat FIRE in plain language.",
    "Calculate and stress-test a fictional financial-independence target.",
    "Recognise lifestyle inflation and opportunity cost.",
    "Understand sequence-of-returns and preservation risk.",
    "Build a staged financial-freedom plan around real life rather than a viral number.",
  ],
  estimatedHours: 24,
  units: [
    incomeProducingAssetsUnit,
    pensionsRetirementUnit,
    freedomNumberUnit,
    lifestyleInflationUnit,
    wealthPreservationUnit,
    financialLifeProjectUnit,
  ],
});
