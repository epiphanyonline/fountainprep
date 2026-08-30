import {
  createCourse,
} from "@/features/academy-content";

import {
  assetLensUnit,
} from "./01-assetLens";

import {
  cashFixedIncomeUnit,
} from "./02-cashFixedIncome";

import {
  equityBusinessUnit,
} from "./03-equityBusiness";

import {
  realEstateInfrastructureUnit,
} from "./04-realEstateInfrastructure";

import {
  commoditiesCollectiblesUnit,
} from "./05-commoditiesCollectibles";

import {
  intellectualPropertyUnit,
} from "./06-intellectualProperty";

import {
  digitalAssetsUnit,
} from "./07-digitalAssets";

import {
  businessBrandDataUnit,
} from "./08-businessBrandData";

import {
  ownershipRightsUnit,
} from "./09-ownershipRights";

import {
  assetCreationUnit,
} from "./10-assetCreation";

import {
  riskDiversificationUnit,
} from "./11-riskDiversification";

export const assetLiteracyCourse = createCourse({
  id: "asset-literacy-course",
  programmeId: "money-foundation",
  stage: "advanced",
  title:
    "The Asset Classes That Create Wealth & Financial Independence",
  description:
    "Explore the full world of assets — from cash, bonds, shares and property to private businesses, infrastructure, intellectual property, royalties, digital assets and productive resources — and learn to analyse them using one consistent framework.",
  learningOutcomes: [
    "Analyse almost any asset using the FountainPrep Asset Lens.",
    "Identify what gives different assets economic value.",
    "Explain where asset returns can come from.",
    "Compare liquidity, risk, ownership rights and costs.",
    "Distinguish public, private, tangible, intangible, financial and real assets.",
    "Understand creation, control, licensing and partial ownership.",
    "Use diversification reasoning across radically different assets.",
    "Defend a hypothetical asset basket using evidence and trade-offs.",
  ],
  estimatedHours: 24,
  units: [
    assetLensUnit,
    cashFixedIncomeUnit,
    equityBusinessUnit,
    realEstateInfrastructureUnit,
    commoditiesCollectiblesUnit,
    intellectualPropertyUnit,
    digitalAssetsUnit,
    businessBrandDataUnit,
    ownershipRightsUnit,
    assetCreationUnit,
    riskDiversificationUnit,
  ],
});
