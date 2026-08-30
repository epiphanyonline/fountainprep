import {
  assets,
} from "./data";

import type {
  AssetId,
  GameState,
} from "./types";

export type InvestmentTwinAllocation =
  Partial<
    Record<
      AssetId,
      number
    >
  >;

export type InvestmentTwinTurn = {
  turn: number;
  portfolioValue: number;
  cash: number;
  allocations:
    InvestmentTwinAllocation;
  note: string;
};

export type InvestmentTwinResult = {
  startingValue: number;
  finalValue: number;
  totalReturnPercent: number;

  strategy: {
    name: string;
    description: string;
    targetAllocation:
      InvestmentTwinAllocation;
    rebalanceRule: string;
  };

  timeline:
    InvestmentTwinTurn[];
};

const STARTING_VALUE =
  100000;

/* =========================================================
   HELPERS
========================================================= */

function round(
  value: number,
) {
  return Math.round(
    (value +
      Number.EPSILON) *
      100,
  ) / 100;
}

function assetIdsForCategory(
  category: string,
) {
  return assets
    .filter(
      (asset) =>
        asset.category ===
        category,
    )
    .map(
      (asset) =>
        asset.id,
    );
}

function addCategoryWeight(
  allocation:
    InvestmentTwinAllocation,
  category: string,
  totalWeight: number,
) {
  const ids =
    assetIdsForCategory(
      category,
    );

  if (
    ids.length === 0 ||
    totalWeight <= 0
  ) {
    return;
  }

  const each =
    totalWeight /
    ids.length;

  for (
    const id of ids
  ) {
    allocation[id] =
      (allocation[id] ??
        0) +
      each;
  }
}

/* =========================================================
   BUILD THE TWIN TARGET FROM THE ACTUAL CURRENT ASSET LIST

   IMPORTANT:
   We deliberately do NOT hard-code asset IDs such as
   "treasury" or "global-etf".

   Your current Investment Lab has evolved beyond the
   earlier V2 asset-ID list. Building from ./data means
   the Twin always uses AssetId values that actually
   exist in the current game.
========================================================= */

export function
buildInvestmentTwinTarget():
  InvestmentTwinAllocation {
  const allocation:
    InvestmentTwinAllocation =
      {};

  const cashAsset =
    assets.find(
      (asset) =>
        asset.id ===
        "cash",
    );

  if (cashAsset) {
    allocation[
      cashAsset.id
    ] = 0.1;
  }

  /*
   Disciplined educational portfolio:

   10% cash
   30% government / fixed income
   40% diversified funds
   10% property
   10% commodities

   Shares and digital assets are not required for the
   Twin's core strategy. This is not because they are
   "bad"; it simply gives the comparison portfolio a
   clear diversification philosophy.
  */

  addCategoryWeight(
    allocation,
    "government",
    0.3,
  );

  addCategoryWeight(
    allocation,
    "funds",
    0.4,
  );

  addCategoryWeight(
    allocation,
    "property",
    0.1,
  );

  addCategoryWeight(
    allocation,
    "commodities",
    0.1,
  );

  /*
   Fallback:
   If category names ever change, do not let the Twin
   silently end up mostly in cash. Spread any unassigned
   weight across all non-cash assets currently available.
  */

  const assigned =
    Object.values(
      allocation,
    ).reduce(
      (
        total,
        weight,
      ) =>
        total +
        (weight ?? 0),
      0,
    );

  const remaining =
    Math.max(
      0,
      1 -
        assigned,
    );

  if (
    remaining > 0.0001
  ) {
    const nonCash =
      assets.filter(
        (asset) =>
          asset.id !==
          "cash",
      );

    if (
      nonCash.length > 0
    ) {
      const each =
        remaining /
        nonCash.length;

      for (
        const asset of
        nonCash
      ) {
        allocation[
          asset.id
        ] =
          (allocation[
            asset.id
          ] ?? 0) +
          each;
      }
    } else if (
      cashAsset
    ) {
      allocation[
        cashAsset.id
      ] =
        (allocation[
          cashAsset.id
        ] ?? 0) +
        remaining;
    }
  }

  return normalise(
    allocation,
  );
}

function normalise(
  allocation:
    InvestmentTwinAllocation,
):
  InvestmentTwinAllocation {
  const entries =
    Object.entries(
      allocation,
    ) as Array<
      [
        AssetId,
        number | undefined,
      ]
    >;

  const total =
    entries.reduce(
      (
        sum,
        [, weight],
      ) =>
        sum +
        Math.max(
          weight ?? 0,
          0,
        ),
      0,
    );

  if (
    total <= 0
  ) {
    return {};
  }

  const result:
    InvestmentTwinAllocation =
      {};

  for (
    const [
      id,
      weight,
    ] of entries
  ) {
    result[id] =
      Math.max(
        weight ?? 0,
        0,
      ) / total;
  }

  return result;
}

function priceAt(
  state: GameState,
  assetId: AssetId,
  index: number,
) {
  const series =
    state.history[
      assetId
    ] ?? [];

  if (
    series.length === 0
  ) {
    return (
      state.prices[
        assetId
      ] ?? 1
    );
  }

  return (
    series[
      Math.min(
        index,
        series.length -
          1,
      )
    ] ??
    series[0] ??
    1
  );
}

function availableTurnCount(
  state: GameState,
) {
  return Math.max(
    1,
    ...Object.values(
      state.history,
    ).map(
      (series) =>
        series?.length ??
        0,
    ),
  );
}

/* =========================================================
   FINANCIAL TWIN

   Same FC100,000.
   Same market history.
   No hidden return advantage.

   The Twin differs only in portfolio construction and
   disciplined rebalancing.
========================================================= */

export function
simulateInvestmentTwin(
  state: GameState,
): InvestmentTwinResult {
  const targets =
    buildInvestmentTwinTarget();

  const assetIds =
    Object.keys(
      targets,
    ) as AssetId[];

  /*
   Each position is tracked as a money value rather than
   units because the Twin exists only as a comparison
   portfolio.

   Every turn it receives the exact percentage price move
   recorded in the learner's state.history.
  */

  let values:
    Partial<
      Record<
        AssetId,
        number
      >
    > = {};

  for (
    const assetId of
    assetIds
  ) {
    values[assetId] =
      STARTING_VALUE *
      (targets[
        assetId
      ] ?? 0);
  }

  const timeline:
    InvestmentTwinTurn[] =
      [];

  const turns =
    availableTurnCount(
      state,
    );

  function totalValue() {
    return Object.values(
      values,
    ).reduce(
      (
        sum,
        value,
      ) =>
        sum +
        (value ?? 0),
      0,
    );
  }

  const cashId =
    assets.find(
      (asset) =>
        asset.id ===
        "cash",
    )?.id;

  timeline.push({
    turn: 0,

    portfolioValue:
      STARTING_VALUE,

    cash:
      round(
        cashId
          ? values[
              cashId
            ] ?? 0
          : 0,
      ),

    allocations: {
      ...targets,
    },

    note:
      "Twin begins with the same FC100,000 and spreads it across assets with different portfolio roles.",
  });

  for (
    let index = 1;
    index < turns;
    index += 1
  ) {
    /*
     Apply the SAME market moves that occurred in the
     learner's simulation.
    */

    for (
      const assetId of
      assetIds
    ) {
      if (
        assetId ===
        cashId
      ) {
        continue;
      }

      const previousPrice =
        priceAt(
          state,
          assetId,
          index - 1,
        );

      const currentPrice =
        priceAt(
          state,
          assetId,
          index,
        );

      const marketReturn =
        previousPrice > 0
          ? currentPrice /
            previousPrice
          : 1;

      values[
        assetId
      ] =
        (values[
          assetId
        ] ?? 0) *
        marketReturn;
    }

    const beforeRebalance =
      totalValue();

    /*
     Disciplined Twin rule:
     rebalance back to strategic weights after each
     recorded market turn.

     It is not predicting the next winner.
    */

    const rebalanced:
      Partial<
        Record<
          AssetId,
          number
        >
      > = {};

    for (
      const assetId of
      assetIds
    ) {
      rebalanced[
        assetId
      ] =
        beforeRebalance *
        (targets[
          assetId
        ] ?? 0);
    }

    values =
      rebalanced;

    timeline.push({
      turn:
        index,

      portfolioValue:
        round(
          beforeRebalance,
        ),

      cash:
        round(
          cashId
            ? values[
                cashId
              ] ?? 0
            : 0,
        ),

      allocations: {
        ...targets,
      },

      note:
        "Twin reviews the whole portfolio and rebalances back to its target mix instead of chasing the latest winner.",
    });
  }

  const finalValue =
    round(
      totalValue(),
    );

  return {
    startingValue:
      STARTING_VALUE,

    finalValue,

    totalReturnPercent:
      round(
        (
          (finalValue -
            STARTING_VALUE) /
          STARTING_VALUE
        ) * 100,
      ),

    strategy: {
      name:
        "The Disciplined Portfolio Builder",

      description:
        "A diversified fictional strategy that keeps liquidity, fixed income, pooled funds and real assets in defined portfolio roles instead of trying to predict one perfect winner.",

      targetAllocation: {
        ...targets,
      },

      rebalanceRule:
        "Review the whole portfolio after each market turn and rebalance back to the target allocation.",
    },

    timeline,
  };
}

export function
investmentTwinGap(
  state: GameState,
  learnerValue: number,
) {
  const twin =
    simulateInvestmentTwin(
      state,
    );

  return {
    twin,

    gap:
      round(
        twin.finalValue -
        learnerValue,
      ),
  };
}
