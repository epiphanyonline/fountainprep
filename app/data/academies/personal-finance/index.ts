import {
  createAcademy,
  createProgramme,
} from "@/features/academy-content";

import {
  moneyFoundationCourse,
} from "./foundation";

import {
  assetLiteracyCourse,
} from "./assetLiteracy/index";

import {
  financialStabilityCourse,
} from "./financialStability/index";

import {
  financialMarketsCourse,
} from "./financialMarkets/index";

import {
  investorSkillsCourse,
} from "./investorSkills/index";

import {
  financialFreedomCourse,
} from "./financialFreedom/index";

import {
  advancedWealthCourse,
} from "./advancedWealth/index";

export {
  financialLiteracyPremiumBlueprint,
  financialLiteracyStages,
  financialLiteracyFreeStage,
  financialLiteracyPremiumStages,
  financialLiteracySimulations,
} from "./premiumBlueprint";

export const personalFinanceAcademy =
  createAcademy({
    code: "personal-finance",

    title:
      "Financial Literacy Academy",

    description:
      "Learn how to earn, manage, protect, invest and grow money across a lifetime — from everyday money decisions to investing and long-term financial freedom.",

    programmes: [
      createProgramme({
        id: "money-foundation",

        academy:
          "personal-finance",

        title:
          "Financial Foundations",

        description:
          "Start with money, saving, budgeting, borrowing, assets and investment foundations before progressing into wealth building and financial markets.",

        suitableAgeGroups: [
          "6-9",
          "10-13",
          "14-17",
          "adult",
        ],

        courses: [
  moneyFoundationCourse,
  assetLiteracyCourse,
  financialStabilityCourse,
  financialMarketsCourse,
  investorSkillsCourse,
  financialFreedomCourse,
  advancedWealthCourse,
],
      }),
    ],
  });