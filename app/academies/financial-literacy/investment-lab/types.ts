export type AssetId =
  | "cash"
  | "tbill-3m"
  | "tbill-12m"
  | "gov-bond"
  | "corp-bond"
  | "global-etf"
  | "dividend-etf"
  | "tech-etf"
  | "smallcap-etf"
  | "stock-nova"
  | "stock-horizon"
  | "stock-harbor"
  | "stock-lumina"
  | "stock-forge"
  | "stock-vita"
  | "property-income"
  | "property-growth"
  | "property-logistics"
  | "gold"
  | "silver"
  | "energy"
  | "agriculture"
  | "digital-large"
  | "digital-growth"
  | "digital-defi";

export type MarketCategory =
  | "government"
  | "funds"
  | "shares"
  | "property"
  | "commodities"
  | "digital";

export type Asset = {
  id: AssetId;
  name: string;
  ticker: string;
  category:
    | MarketCategory
    | "cash";
  sector?: string;
  description: string;
  price: number;
  volatility: number;
  drift: number;
  risk: number;
  incomeLabel: string;
  liquidity:
    | "high"
    | "medium"
    | "low";
  tags?: string[];
};

export type Holding = {
  assetId: AssetId;
  units: number;
  avgCost: number;
};

export type Message = {
  id: string;

  sender:
    | "ayo"
    | "broker"
    | "learner"
    | "system";

  text: string;
};

export type NewsItem = {
  id: string;
  headline: string;
  summary: string;

  impact:
    Partial<
      Record<
        AssetId,
        number
      >
    >;

  categoryImpact?:
    Partial<
      Record<
        MarketCategory,
        number
      >
    >;

  learningPoint: string;
};

export type Scores = {
  diversification: number;
  risk: number;
  liquidity: number;
  behaviour: number;
  consistency: number;
  learning: number;
};

export type Episode = {
  id: string;
  number: number;

  title: string;
  subtitle: string;

  setup: string;
  objective: string;

  eventNewsId: string;

  availableMarkets:
    MarketCategory[];

  unlockAfterEpisode?:
    MarketCategory[];

  prompt: string;

  completionMessage:
    string;
};

export type ResolveAction =
  | "hold"
  | "sell"
  | "reallocate";

export type EpisodeDecision = {
  id: string;

  episodeNumber:
    number;

  action:
    | "buy"
    | "sell"
    | "hold"
    | "reallocate";

  assetId?: AssetId;

  amount?: number;

  portfolioBefore:
    number;

  portfolioAfter:
    number;

  marketMove:
    number;

  note?: string;
};

export type StressEvent = {
  headline: string;

  message: string;

  portfolioBefore:
    number;

  portfolioAfter:
    number;

  movePercent:
    number;

  worstAssetId:
    | AssetId
    | null;

  bestAssetId:
    | AssetId
    | null;

  resolved: boolean;

  chosenAction:
    | ResolveAction
    | null;
};

export type PortfolioSnapshot = {
  episodeNumber:
    number;

  label: string;

  value: number;
};

export type GamePhase =
  | "episode-intro"
  | "episode-hub"
  | "news"
  | "market-categories"
  | "market"
  | "portfolio"
  | "stress-test"
  | "episode-result"
  | "campaign-complete"
  | "open-market";

export type GameState = {
  version: 5;

  episodeIndex:
    number;

  openMarketEpisode:
    number;

  xp: number;

  cash: number;

  holdings:
    Partial<
      Record<
        AssetId,
        Holding
      >
    >;

  prices:
    Record<
      AssetId,
      number
    >;

  history:
    Record<
      AssetId,
      number[]
    >;

  scores:
    Scores;

  messages:
    Message[];

  currentNews:
    NewsItem[];

  completedEpisodes:
    string[];

  achievements:
    string[];

  phase:
    GamePhase;

  selectedMarket:
    | MarketCategory
    | null;

  selectedAssetId:
    | AssetId
    | null;

  unlockedMarkets:
    MarketCategory[];

  discoveredAssets:
    AssetId[];

  watchlist:
    AssetId[];

  decisionsMade:
    number;

  tradesMade:
    number;

  holdDecisions:
    number;

  episodeStartValue:
    number;

  episodeTradeCount:
    number;

  episodeHoldCount:
    number;

  episodeNewsViewed:
    boolean;

  episodeResearchViewed:
    boolean;

  episodePortfolioViewed:
    boolean;

  episodeAyoUsed:
    boolean;

  episodeDecisionMade:
    boolean;

  lastEpisodeReturn:
    number;

  // V5.1 — Portfolio journey

  campaignStartValue:
    number;

  portfolioHistory:
    PortfolioSnapshot[];

  decisionHistory:
    EpisodeDecision[];

  // V5.1 — Stress & resolve

  stressEvent:
    StressEvent | null;

  pendingResolveAction:
    ResolveAction | null;

  preStressHoldings:
    Partial<
      Record<
        AssetId,
        Holding
      >
    >;

  preStressCash:
    number;
};

// Legacy compatibility for data.ts.
// The V5/V5.1 game itself does not use Level
// for progression.

export type Level = {
  id: string;

  number: number;

  title: string;

  subtitle: string;

  description: string;

  turns: number;

  unlockScore:
    number;

  mode:
    | "guided"
    | "endless";
};