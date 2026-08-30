import type { NewsItem } from "./types";

export const episodeNews: NewsItem[] = [
  {
    id: "normal-open",
    headline: "Markets open quietly as investors weigh growth and interest rates",
    summary: "No single story dominates. Short-term government yields remain competitive while shares trade near recent highs.",
    categoryImpact: { government: 0.002, funds: 0.004, shares: 0.004, property: 0.002 },
    impact: {},
    learningPoint: "A normal market still requires decisions about purpose, risk and diversification.",
  },
  {
    id: "rates-higher",
    headline: "Central bank signals rates may stay higher for longer",
    summary: "Short-term yields remain attractive while long-duration assets and rate-sensitive investments face renewed pressure.",
    categoryImpact: { government: -0.008, funds: -0.006, shares: -0.008, property: -0.016 },
    impact: { "tbill-3m": 0.004, "tbill-12m": 0.003, "gov-bond": -0.014, "property-growth": -0.022, "stock-horizon": 0.010 },
    learningPoint: "Interest-rate changes can help some assets and hurt others.",
  },
  {
    id: "tech-rally",
    headline: "Technology shares surge as optimism about future growth accelerates",
    summary: "Investors chase fast-growing companies and technology funds after another round of strong headlines.",
    categoryImpact: { funds: 0.012, shares: 0.012 },
    impact: { "tech-etf": 0.055, "stock-nova": 0.085 },
    learningPoint: "A rising price can create urgency without reducing investment risk.",
  },
  {
    id: "inflation",
    headline: "Inflation surprises markets on the upside",
    summary: "Investors reassess purchasing power, interest rates, commodities and the durability of company earnings.",
    categoryImpact: { government: -0.008, property: -0.012, commodities: 0.020 },
    impact: { gold: 0.030, energy: 0.040, "tbill-3m": 0.004 },
    learningPoint: "Nominal returns and real purchasing-power returns are not the same thing.",
  },
  {
    id: "earnings-miss",
    headline: "High-growth software company disappoints investors with weaker guidance",
    summary: "A popular technology name falls sharply even though the wider market remains relatively steady.",
    categoryImpact: { shares: -0.004 },
    impact: { "stock-nova": -0.120, "tech-etf": -0.025 },
    learningPoint: "Individual-company risk can be much larger than broad-market risk.",
  },
  {
    id: "bull-market",
    headline: "Global shares extend a strong rally",
    summary: "Broad equity markets rise again, rewarding investors who stayed invested while also increasing concentration in recent winners.",
    categoryImpact: { funds: 0.035, shares: 0.045, property: 0.015 },
    impact: { "stock-nova": 0.055, "global-etf": 0.025 },
    learningPoint: "Strong performance can quietly change the portfolio you thought you owned.",
  },
  {
    id: "property-window",
    headline: "Falling borrowing costs revive interest in property assets",
    summary: "Property funds rally as financing conditions improve and investors revisit income-producing real assets.",
    categoryImpact: { property: 0.055, government: 0.008 },
    impact: { "property-growth": 0.075, "property-income": 0.040 },
    learningPoint: "Asset classes respond differently to financing conditions and economic expectations.",
  },
  {
    id: "market-drop",
    headline: "Markets fall sharply after a sudden deterioration in investor confidence",
    summary: "Risk assets decline together while defensive holdings and short-duration government securities hold up better.",
    categoryImpact: { funds: -0.060, shares: -0.080, property: -0.050, digital: -0.120, commodities: -0.015, government: 0.010 },
    impact: { "tbill-3m": 0.003, "gov-bond": 0.018, gold: 0.025 },
    learningPoint: "A falling market tests behaviour as much as investment knowledge.",
  },
  {
    id: "recession",
    headline: "Recession fears spread as economic data weakens",
    summary: "Investors favour defensive assets and debate how much bad news is already reflected in market prices.",
    categoryImpact: { shares: -0.045, funds: -0.030, property: -0.030, government: 0.018 },
    impact: { "stock-harbor": 0.005, "stock-horizon": -0.050, "tbill-3m": 0.005 },
    learningPoint: "Economic slowdowns do not affect every sector or asset equally.",
  },
  {
    id: "recovery",
    headline: "Markets rebound strongly after signs that the slowdown may be stabilising",
    summary: "Some of the assets that fell hardest now lead the recovery, challenging investors who sold during the decline.",
    categoryImpact: { shares: 0.065, funds: 0.050, property: 0.030, digital: 0.080 },
    impact: { "stock-nova": 0.080, "tech-etf": 0.060 },
    learningPoint: "Market timing requires two correct decisions: when to leave and when to return.",
  },
  {
    id: "portfolio-drift",
    headline: "Recent winners now dominate many investor portfolios",
    summary: "Strong performance in a few areas has pushed some portfolios far away from their original allocations.",
    categoryImpact: { funds: 0.010, shares: 0.015 },
    impact: {},
    learningPoint: "Rebalancing is about restoring purpose, not predicting tomorrow's winner.",
  },
  {
    id: "final-shock",
    headline: "Markets face a mixed shock: energy jumps, technology falls and bonds rally",
    summary: "Several forces hit markets at once, leaving no obvious single winning response.",
    categoryImpact: { government: 0.020, funds: -0.015, shares: -0.020, commodities: 0.030, digital: -0.040 },
    impact: { energy: 0.085, "stock-lumina": 0.060, "stock-nova": -0.070, "gov-bond": 0.030 },
    learningPoint: "Real investing often means balancing several imperfect signals at the same time.",
  },
];

export function episodeNewsById(id: string) {
  const item = episodeNews.find((candidate) => candidate.id === id);
  if (!item) throw new Error(`Unknown episode news: ${id}`);
  return item;
}
