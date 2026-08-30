import {
  assets,
  assetsForCategory,
  byId,
  newsPool,
  STARTING_CASH,
} from "./data";
import { episodes } from "./episodes";
import { episodeNewsById } from "./episodeNews";
import type {
  AssetId,
  EpisodeDecision,
  GameState,
  MarketCategory,
  ResolveAction,
  Scores,
  StressEvent,
} from "./types";

const clamp = (value: number, min = 0, max = 100) =>
  Math.min(Math.max(value, min), max);

const msg = (
  sender: "ayo" | "broker" | "learner" | "system",
  text: string,
) => ({
  id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  sender,
  text,
});

const decisionId = () =>
  `d-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export function createGame(): GameState {
  const prices = Object.fromEntries(
    assets.map((asset) => [asset.id, asset.price]),
  ) as Record<AssetId, number>;

  const history = Object.fromEntries(
    assets.map((asset) => [asset.id, [asset.price]]),
  ) as Record<AssetId, number[]>;

  return {
    version: 5,
    episodeIndex: 0,
    openMarketEpisode: 13,
    xp: 0,
    cash: STARTING_CASH,
    holdings: {},
    prices,
    history,
    scores: {
      diversification: 55,
      risk: 60,
      liquidity: 80,
      behaviour: 65,
      consistency: 55,
      learning: 55,
    },
    messages: [
      msg(
        "ayo",
        "Welcome to the 12-Episode Investor Challenge. You have FC100,000 of fictional capital. Your goal is not simply to make the most money. Your goal is to become a better investor.",
      ),
    ],
    currentNews: [],
    completedEpisodes: [],
    achievements: [],
    phase: "episode-intro",
    selectedMarket: null,
    selectedAssetId: null,
    unlockedMarkets: ["government", "funds", "shares", "property"],
    discoveredAssets: [],
    watchlist: [],
    decisionsMade: 0,
    tradesMade: 0,
    holdDecisions: 0,
    episodeStartValue: STARTING_CASH,
    episodeTradeCount: 0,
    episodeHoldCount: 0,
    episodeNewsViewed: false,
    episodeResearchViewed: false,
    episodePortfolioViewed: false,
    episodeAyoUsed: false,
    episodeDecisionMade: false,
    lastEpisodeReturn: 0,

    campaignStartValue: STARTING_CASH,
    portfolioHistory: [
      {
        episodeNumber: 0,
        label: "Start",
        value: STARTING_CASH,
      },
    ],
    decisionHistory: [],
    stressEvent: null,
    pendingResolveAction: null,
    preStressHoldings: {},
    preStressCash: STARTING_CASH,
  };
}

export const currentEpisode = (state: GameState) =>
  episodes[Math.min(state.episodeIndex, episodes.length - 1)];

export function holdingValue(state: GameState, assetId: AssetId) {
  const holding = state.holdings[assetId];
  return holding ? holding.units * state.prices[assetId] : 0;
}

export function portfolioValue(state: GameState) {
  return (
    state.cash +
    Object.keys(state.holdings).reduce(
      (total, assetId) =>
        total + holdingValue(state, assetId as AssetId),
      0,
    )
  );
}

export function allocation(state: GameState, assetId: AssetId) {
  const total = portfolioValue(state);
  return total
    ? (holdingValue(state, assetId) / total) * 100
    : 0;
}

export function overallScore(scores: Scores) {
  const values = Object.values(scores);
  return Math.round(
    values.reduce((total, value) => total + value, 0) /
      values.length,
  );
}

function refreshScores(state: GameState): GameState {
  const total = portfolioValue(state);
  const investedAssets = assets.filter(
    (asset) =>
      asset.id !== "cash" &&
      allocation(state, asset.id) > 1,
  );
  const categoriesHeld = new Set(
    investedAssets.map((asset) => asset.category),
  ).size;
  const maxAllocation = Math.max(
    0,
    ...investedAssets.map((asset) => allocation(state, asset.id)),
  );
  const riskWeighted = investedAssets.reduce(
    (sum, asset) =>
      sum + allocation(state, asset.id) * (asset.risk / 5),
    0,
  );
  const liquidValue =
    state.cash +
    investedAssets
      .filter((asset) => asset.liquidity === "high")
      .reduce(
        (sum, asset) => sum + holdingValue(state, asset.id),
        0,
      );

  const processBonus =
    (state.episodeNewsViewed ? 4 : 0) +
    (state.episodeResearchViewed ? 4 : 0) +
    (state.episodePortfolioViewed ? 3 : 0) +
    (state.episodeAyoUsed ? 3 : 0);

  const resolveBonus =
    state.stressEvent?.resolved &&
    state.stressEvent.chosenAction
      ? 3
      : 0;

  return {
    ...state,
    scores: {
      diversification: clamp(
        42 +
          investedAssets.length * 4 +
          categoriesHeld * 8 -
          Math.max(0, maxAllocation - 40),
      ),
      risk: clamp(92 - riskWeighted * 0.55),
      liquidity: clamp(
        (liquidValue / Math.max(total, 1)) * 115,
      ),
      behaviour: clamp(
        62 +
          Math.min(state.holdDecisions, 12) * 1.4 +
          processBonus +
          resolveBonus -
          Math.max(0, state.episodeTradeCount - 4) * 3,
      ),
      consistency: clamp(
        55 + state.completedEpisodes.length * 3.2,
      ),
      learning: clamp(
        55 +
          state.completedEpisodes.length * 3.5 +
          processBonus +
          resolveBonus,
      ),
    },
  };
}

export function beginEpisode(state: GameState): GameState {
  const episode = currentEpisode(state);
  return {
    ...state,
    phase: "episode-hub",
    currentNews: [episodeNewsById(episode.eventNewsId)],
    episodeStartValue: portfolioValue(state),
    episodeTradeCount: 0,
    episodeHoldCount: 0,
    episodeNewsViewed: false,
    episodeResearchViewed: false,
    episodePortfolioViewed: false,
    episodeAyoUsed: false,
    episodeDecisionMade: false,
    selectedMarket: null,
    selectedAssetId: null,
    stressEvent: null,
    pendingResolveAction: null,
  };
}

export function openNews(state: GameState): GameState {
  return {
    ...state,
    phase: "news",
    episodeNewsViewed: true,
    xp: state.xp + (state.episodeNewsViewed ? 0 : 5),
  };
}

export function openPortfolio(state: GameState): GameState {
  return {
    ...state,
    phase: "portfolio",
    episodePortfolioViewed: true,
    xp: state.xp + (state.episodePortfolioViewed ? 0 : 3),
  };
}

export function visitMarkets(state: GameState): GameState {
  return {
    ...state,
    phase: "market-categories",
    selectedMarket: null,
  };
}

export function openMarket(
  state: GameState,
  category: MarketCategory,
): GameState {
  const episode = currentEpisode(state);
  if (!episode.availableMarkets.includes(category)) return state;

  return {
    ...state,
    phase: "market",
    selectedMarket: category,
    episodeResearchViewed: true,
    discoveredAssets: Array.from(
      new Set([
        ...state.discoveredAssets,
        ...assetsForCategory(category).map((asset) => asset.id),
      ]),
    ),
    xp: state.xp + (state.episodeResearchViewed ? 0 : 4),
  };
}

export function marketAssetsForState(state: GameState) {
  return state.selectedMarket
    ? assetsForCategory(state.selectedMarket)
    : [];
}

export function returnToHub(state: GameState): GameState {
  if (
    state.pendingResolveAction === "reallocate" &&
    state.stressEvent
  ) {
    return {
      ...state,
      phase: "stress-test",
      selectedMarket: null,
      selectedAssetId: null,
    };
  }

  return {
    ...state,
    phase:
      state.episodeIndex >= episodes.length
        ? "open-market"
        : "episode-hub",
    selectedMarket: null,
    selectedAssetId: null,
  };
}

export function toggleWatchlist(
  state: GameState,
  assetId: AssetId,
): GameState {
  const exists = state.watchlist.includes(assetId);
  return {
    ...state,
    watchlist: exists
      ? state.watchlist.filter((id) => id !== assetId)
      : [...state.watchlist, assetId],
  };
}

function addDecision(
  state: GameState,
  decision: Omit<EpisodeDecision, "id">,
): GameState {
  return {
    ...state,
    decisionHistory: [
      ...state.decisionHistory,
      {
        ...decision,
        id: decisionId(),
      },
    ],
  };
}

export function buy(
  state: GameState,
  assetId: AssetId,
  amount: number,
): GameState {
  if (assetId === "cash" || amount <= 0 || amount > state.cash) {
    return state;
  }

  const before = portfolioValue(state);
  const price = state.prices[assetId];
  const units = amount / price;
  const old = state.holdings[assetId];
  const oldCost = old ? old.units * old.avgCost : 0;
  const newUnits = (old?.units ?? 0) + units;

  const resolving =
    state.pendingResolveAction === "reallocate" &&
    Boolean(state.stressEvent);

  let next = refreshScores({
    ...state,
    cash: state.cash - amount,
    holdings: {
      ...state.holdings,
      [assetId]: {
        assetId,
        units: newUnits,
        avgCost: (oldCost + amount) / newUnits,
      },
    },
    decisionsMade: state.decisionsMade + 1,
    tradesMade: state.tradesMade + 1,
    episodeTradeCount: state.episodeTradeCount + 1,
    episodeDecisionMade: true,
    phase: resolving ? "stress-test" : "episode-hub",
    messages: [
      ...state.messages,
      msg(
        "broker",
        `Order filled: bought ${byId(assetId).ticker} for FC ${Math.round(amount).toLocaleString("en-GB")}.`,
      ),
    ],
  });

  next = addDecision(next, {
    episodeNumber: Math.min(state.episodeIndex + 1, 12),
    action: resolving ? "reallocate" : "buy",
    assetId,
    amount,
    portfolioBefore: before,
    portfolioAfter: portfolioValue(next),
    marketMove: state.stressEvent?.movePercent ?? 0,
    note: resolving
      ? "Reallocation after stress event"
      : "Primary episode decision",
  });

  if (!next.achievements.includes("First Trade")) {
    next = {
      ...next,
      achievements: [...next.achievements, "First Trade"],
    };
  }

  return next;
}

export function sell(
  state: GameState,
  assetId: AssetId,
  percent: number,
): GameState {
  const holding = state.holdings[assetId];
  if (!holding) return state;

  const before = portfolioValue(state);
  const fraction = Math.min(Math.max(percent / 100, 0), 1);
  const units = holding.units * fraction;
  const value = units * state.prices[assetId];
  const remaining = holding.units - units;
  const holdings = { ...state.holdings };

  if (remaining <= 0.000001) {
    delete holdings[assetId];
  } else {
    holdings[assetId] = {
      ...holding,
      units: remaining,
    };
  }

  const resolving =
    state.pendingResolveAction === "reallocate" &&
    Boolean(state.stressEvent);

  let next = refreshScores({
    ...state,
    cash: state.cash + value,
    holdings,
    decisionsMade: state.decisionsMade + 1,
    tradesMade: state.tradesMade + 1,
    episodeTradeCount: state.episodeTradeCount + 1,
    episodeDecisionMade: true,
    phase: resolving ? "stress-test" : "episode-hub",
  });

  next = addDecision(next, {
    episodeNumber: Math.min(state.episodeIndex + 1, 12),
    action: resolving ? "reallocate" : "sell",
    assetId,
    amount: value,
    portfolioBefore: before,
    portfolioAfter: portfolioValue(next),
    marketMove: state.stressEvent?.movePercent ?? 0,
    note: resolving
      ? "Reallocation after stress event"
      : "Primary episode decision",
  });

  return next;
}

export function holdEpisode(state: GameState): GameState {
  const before = portfolioValue(state);

  let next = refreshScores({
    ...state,
    decisionsMade: state.decisionsMade + 1,
    holdDecisions: state.holdDecisions + 1,
    episodeHoldCount: state.episodeHoldCount + 1,
    episodeDecisionMade: true,
    phase: "episode-hub",
  });

  next = addDecision(next, {
    episodeNumber: Math.min(state.episodeIndex + 1, 12),
    action: "hold",
    portfolioBefore: before,
    portfolioAfter: portfolioValue(next),
    marketMove: 0,
    note: "Primary episode decision",
  });

  return next;
}

const noise = (seed: number, index: number) => {
  const value =
    Math.sin(seed * 12.9898 + (index + 1) * 78.233) *
    43758.5453;
  return (value - Math.floor(value)) * 2 - 1;
};

function movePrices(
  state: GameState,
  newsId: string,
  seed: number,
  intensity = 1,
) {
  const news = episodeNewsById(newsId);
  const prices = { ...state.prices };
  const history = { ...state.history };

  assets.forEach((asset, index) => {
    if (asset.id === "cash") return;

    const explicit =
      (news.impact[asset.id] ?? 0) * intensity;

    const category =
      asset.category === "cash"
        ? 0
        : (news.categoryImpact?.[
            asset.category as MarketCategory
          ] ?? 0) * intensity;

    const rate =
      asset.drift * 0.45 +
      noise(seed, index) * asset.volatility * intensity +
      explicit +
      category;

    prices[asset.id] = Math.max(
      1,
      state.prices[asset.id] * (1 + rate),
    );

    history[asset.id] = [
      ...(history[asset.id] ?? []),
      prices[asset.id],
    ].slice(-100);
  });

  return { prices, history };
}

function largestMovers(
  beforePrices: Record<AssetId, number>,
  afterPrices: Record<AssetId, number>,
) {
  const ranked = assets
    .filter((asset) => asset.id !== "cash")
    .map((asset) => ({
      id: asset.id,
      move:
        beforePrices[asset.id] > 0
          ? ((afterPrices[asset.id] - beforePrices[asset.id]) /
              beforePrices[asset.id]) *
            100
          : 0,
    }))
    .sort((a, b) => a.move - b.move);

  return {
    worstAssetId: ranked[0]?.id ?? null,
    bestAssetId: ranked[ranked.length - 1]?.id ?? null,
  };
}

export function triggerStressTest(
  state: GameState,
): GameState {
  if (!state.episodeDecisionMade) return state;

  const episode = currentEpisode(state);
  const beforeValue = portfolioValue(state);
  const beforePrices = { ...state.prices };

  const firstMove = movePrices(
    state,
    episode.eventNewsId,
    episode.number * 11 + 3,
    episode.number >= 8 ? 1.15 : 0.82,
  );

  const moved: GameState = {
    ...state,
    prices: firstMove.prices,
    history: firstMove.history,
  };

  const afterValue = portfolioValue(moved);

  const movePercent =
    beforeValue > 0
      ? ((afterValue - beforeValue) / beforeValue) * 100
      : 0;

  const movers = largestMovers(
    beforePrices,
    firstMove.prices,
  );

  const stress: StressEvent = {
    headline:
      movePercent <= -4
        ? `Your portfolio just fell ${Math.abs(movePercent).toFixed(1)}%`
        : movePercent < 0
          ? "Your portfolio is under pressure"
          : movePercent >= 4
            ? `Your portfolio just rose ${movePercent.toFixed(1)}%`
            : "The market has moved",

    message:
      movePercent < 0
        ? "The loss is now real on your screen. This is where process, conviction and risk control are tested."
        : "The gain feels good, but rising prices can test discipline too. Decide whether your reasoning has changed.",

    portfolioBefore: beforeValue,
    portfolioAfter: afterValue,
    movePercent,
    worstAssetId: movers.worstAssetId,
    bestAssetId: movers.bestAssetId,
    resolved: false,
    chosenAction: null,
  };

  return refreshScores({
    ...moved,
    phase: "stress-test",
    stressEvent: stress,
    pendingResolveAction: null,
    preStressHoldings: state.holdings,
    preStressCash: state.cash,
    xp: state.xp + 20,
    messages: [
      ...state.messages,
      msg(
        "system",
        `Market stress: portfolio moved ${movePercent >= 0 ? "+" : ""}${movePercent.toFixed(1)}%.`,
      ),
    ],
  });
}

export function chooseResolveAction(
  state: GameState,
  action: ResolveAction,
): GameState {
  if (!state.stressEvent) return state;

  if (action === "hold") {
    let next: GameState = {
      ...state,
      pendingResolveAction: "hold",
      holdDecisions: state.holdDecisions + 1,
      episodeHoldCount: state.episodeHoldCount + 1,
    };

    next = addDecision(next, {
      episodeNumber: Math.min(state.episodeIndex + 1, 12),
      action: "hold",
      portfolioBefore: state.stressEvent.portfolioAfter,
      portfolioAfter: state.stressEvent.portfolioAfter,
      marketMove: state.stressEvent.movePercent,
      note: "Resolve decision after first market movement",
    });

    return next;
  }

  if (action === "sell") {
    const invested = assets
      .filter(
        (asset) =>
          asset.id !== "cash" &&
          holdingValue(state, asset.id) > 0,
      )
      .sort(
        (a, b) =>
          holdingValue(state, b.id) -
          holdingValue(state, a.id),
      );

    const target = invested[0];

    if (!target) {
      return chooseResolveAction(state, "hold");
    }

    const value = holdingValue(state, target.id);
    let next = sell(state, target.id, 100);

    next = {
      ...next,
      phase: "stress-test",
      pendingResolveAction: "sell",
      stressEvent: state.stressEvent,
    };

    next = addDecision(next, {
      episodeNumber: Math.min(state.episodeIndex + 1, 12),
      action: "sell",
      assetId: target.id,
      amount: value,
      portfolioBefore: state.stressEvent.portfolioAfter,
      portfolioAfter: portfolioValue(next),
      marketMove: state.stressEvent.movePercent,
      note: "Closed largest position after stress event",
    });

    return next;
  }

  return {
    ...state,
    pendingResolveAction: "reallocate",
    phase: "market-categories",
    messages: [
      ...state.messages,
      msg(
        "ayo",
        "You chose to reallocate. You can sell an existing position, buy another asset, or both. When you return, the market will move again.",
      ),
    ],
  };
}

export function completeResolveTest(
  state: GameState,
): GameState {
  if (!state.stressEvent) return state;

  const episode = currentEpisode(state);
  const action =
    state.pendingResolveAction ?? "hold";

  const beforeSecondMove = portfolioValue(state);

  const secondIntensity =
    action === "hold"
      ? episode.number >= 8
        ? 1.05
        : 0.72
      : action === "sell"
        ? 0.68
        : 0.78;

  const secondMove = movePrices(
    state,
    episode.eventNewsId,
    episode.number * 19 + 7,
    secondIntensity,
  );

  const moved: GameState = {
    ...state,
    prices: secondMove.prices,
    history: secondMove.history,
  };

  const afterSecondMove = portfolioValue(moved);

  const totalEpisodeReturn =
    state.episodeStartValue > 0
      ? ((afterSecondMove - state.episodeStartValue) /
          state.episodeStartValue) *
        100
      : 0;

  const completedEpisodes =
    state.completedEpisodes.includes(episode.id)
      ? state.completedEpisodes
      : [...state.completedEpisodes, episode.id];

  const nextIndex = state.episodeIndex + 1;

  const resolvedStress: StressEvent = {
    ...state.stressEvent,
    resolved: true,
    chosenAction: action,
  };

  const next = refreshScores({
    ...moved,
    completedEpisodes,
    episodeIndex: nextIndex,
    xp: state.xp + 100,
    lastEpisodeReturn: totalEpisodeReturn,
    portfolioHistory: [
      ...state.portfolioHistory,
      {
        episodeNumber: episode.number,
        label: `E${episode.number}`,
        value: afterSecondMove,
      },
    ],
    stressEvent: resolvedStress,
    phase:
      nextIndex >= episodes.length
        ? "campaign-complete"
        : "episode-result",
    messages: [
      ...state.messages,
      msg(
        "system",
        `Resolve test complete. Portfolio moved from FC ${Math.round(beforeSecondMove).toLocaleString("en-GB")} to FC ${Math.round(afterSecondMove).toLocaleString("en-GB")}.`,
      ),
    ],
  });

  return {
    ...next,
    unlockedMarkets: Array.from(
      new Set([
        ...next.unlockedMarkets,
        ...(episode.unlockAfterEpisode ?? []),
      ]),
    ),
  };
}

/**
 * Backward-compatible name used by the current UI.
 * In V5.1 "Finish Episode" now starts the stress test.
 */
export function finishEpisode(
  state: GameState,
): GameState {
  return triggerStressTest(state);
}

export function continueToNextEpisode(
  state: GameState,
): GameState {
  return {
    ...state,
    phase:
      state.episodeIndex >= episodes.length
        ? "campaign-complete"
        : "episode-intro",
    stressEvent: null,
    pendingResolveAction: null,
  };
}

export function enterOpenMarket(
  state: GameState,
): GameState {
  return {
    ...state,
    phase: "open-market",
    currentNews: [newsPool[0]],
  };
}

export function advanceOpenMarket(
  state: GameState,
): GameState {
  const item =
    newsPool[
      (state.openMarketEpisode - 13) % newsPool.length
    ];

  const prices = { ...state.prices };
  const history = { ...state.history };

  assets.forEach((asset, index) => {
    if (asset.id === "cash") return;

    const explicit = item.impact[asset.id] ?? 0;
    const category =
      asset.category === "cash"
        ? 0
        : item.categoryImpact?.[
            asset.category as MarketCategory
          ] ?? 0;

    const rate =
      asset.drift +
      noise(state.openMarketEpisode, index) * asset.volatility +
      explicit +
      category;

    prices[asset.id] = Math.max(
      1,
      state.prices[asset.id] * (1 + rate),
    );

    history[asset.id] = [
      ...(history[asset.id] ?? []),
      prices[asset.id],
    ].slice(-80);
  });

  const next = refreshScores({
    ...state,
    prices,
    history,
    currentNews: [item],
    openMarketEpisode: state.openMarketEpisode + 1,
    xp: state.xp + 20,
  });

  return {
    ...next,
    portfolioHistory: [
      ...next.portfolioHistory,
      {
        episodeNumber: next.openMarketEpisode,
        label: `E${next.openMarketEpisode}`,
        value: portfolioValue(next),
      },
    ],
  };
}

export function chat(
  state: GameState,
  text: string,
): GameState {
  const trimmed = text.trim();
  if (!trimmed) return state;

  const lower = trimmed.toLowerCase();
  const total = portfolioValue(state);

  const mentioned = assets.find((asset) =>
    [asset.ticker, asset.name].some((value) =>
      lower.includes(value.toLowerCase()),
    ),
  );

  let reply =
    "Tell me what you are trying to achieve, what could go wrong and how the decision changes the whole portfolio.";

  if (mentioned) {
    reply = `${mentioned.name} (${mentioned.ticker}) is a fictional ${mentioned.sector ?? mentioned.category} investment with risk ${mentioned.risk}/5 and ${mentioned.liquidity} liquidity. It currently represents about ${Math.round(allocation(state, mentioned.id))}% of your portfolio. Think about what it represents, where returns could come from, downside risk and what role it would play.`;
  } else if (lower.includes("portfolio") || lower.includes("risk")) {
    reply = `Your portfolio is worth about FC ${Math.round(total).toLocaleString("en-GB")}. Review concentration, liquidity and whether each holding has a clear job.`;
  } else if (lower.includes("news") || lower.includes("headline")) {
    const current = state.currentNews[0];
    reply = current
      ? `${current.headline}. The key learning point is: ${current.learningPoint}`
      : "There is no active market brief right now.";
  } else if (lower.includes("sell")) {
    reply =
      "Selling can be rational if your goal, risk capacity or investment case changed. Selling only because a red number feels uncomfortable is a different decision.";
  } else if (lower.includes("hold")) {
    reply =
      "Holding is not automatically brave or correct. Ask whether the investment case still holds, whether position size is still sensible and whether you can tolerate further downside.";
  } else if (lower.includes("buy") || lower.includes("should i")) {
    reply =
      "I will not choose an investment for you. Compare purpose, risk, liquidity, concentration, current conditions and what would make you change your mind.";
  }

  return {
    ...state,
    episodeAyoUsed: true,
    xp: state.xp + (state.episodeAyoUsed ? 0 : 3),
    messages: [
      ...state.messages,
      msg("learner", trimmed),
      msg("ayo", reply),
    ],
  };
}
