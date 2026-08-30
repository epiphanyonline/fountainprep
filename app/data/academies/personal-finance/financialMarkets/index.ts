import { createCourse } from "@/features/academy-content";

import { understandingFinancialMarketsUnit } from "./01-understandingFinancialMarkets";
import { companiesStockMarketUnit } from "./02-companiesStockMarket";
import { investmentFundsUnit } from "./03-investmentFunds";
import { marketIndicesUnit } from "./04-marketIndices";
import { buyingSellingInvestmentsUnit } from "./05-buyingSellingInvestments";
import { tradeExecutionUnit } from "./06-tradeExecution";
import { cashMarginLongShortUnit } from "./07-cashMarginLongShort";
import { investmentAnalysisUnit } from "./08-investmentAnalysis";
import { optionsIntroductionUnit } from "./09-optionsIntroduction";


export const financialMarketsCourse = createCourse({
  id: "financial-markets-course",
  programmeId: "money-foundation",
  stage: "advanced",
  title: "How Financial Markets Really Work",
  description:
    "Understand how securities are issued, traded, priced, analysed and executed across modern financial markets — including funds, indices, order types, leverage and introductory options.",
  learningOutcomes: [
    "Explain the economic purpose of financial markets.",
    "Distinguish primary and secondary markets.",
    "Understand how companies issue and trade shares.",
    "Explain pooled investment funds and ETFs.",
    "Understand how market indices are constructed and used.",
    "Explain trade execution, bid-ask spreads and settlement.",
    "Compare market, limit, stop and conditional orders.",
    "Understand cash, margin, long and short positions.",
    "Use introductory fundamental and valuation analysis.",
    "Understand basic option terminology and hedging logic.",
  ],
  estimatedHours: 24,
  units: [
    understandingFinancialMarketsUnit,
    companiesStockMarketUnit,
    investmentFundsUnit,
    marketIndicesUnit,
    buyingSellingInvestmentsUnit,
    tradeExecutionUnit,
    cashMarginLongShortUnit,
    investmentAnalysisUnit,
    optionsIntroductionUnit,
  ],
});
