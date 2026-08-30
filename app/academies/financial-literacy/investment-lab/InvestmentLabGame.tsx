"use client";

import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  assets,
  byId,
} from "./data";
import { episodes } from "./episodes";
import {
  simulateInvestmentTwin,
  investmentTwinGap,
} from "./investmentTwin";

import {
  advanceOpenMarket,
  allocation,
  beginEpisode,
  buy,
  chat,
  chooseResolveAction,
  completeResolveTest,
  continueToNextEpisode,
  createGame,
  currentEpisode,
  enterOpenMarket,
  holdEpisode,
  holdingValue,
  marketAssetsForState,
  openMarket,
  openNews,
  openPortfolio,
  overallScore,
  portfolioValue,
  returnToHub,
  sell,
  toggleWatchlist,
  triggerStressTest,
  visitMarkets,
} from "./engine";

import type {
  AssetId,
  GameState,
  MarketCategory,
} from "./types";

const STORAGE_KEY =
  "fountainprep:investment-lab:v5-1-stress";

const markets: Array<{
  id: MarketCategory;
  icon: string;
  title: string;
  subtitle: string;
}> = [
  {
    id: "government",
    icon: "🏛️",
    title: "Government & Bonds",
    subtitle: "Treasury bills and fixed income",
  },
  {
    id: "funds",
    icon: "🌍",
    title: "Funds & ETFs",
    subtitle: "Broad and thematic funds",
  },
  {
    id: "shares",
    icon: "📈",
    title: "Shares",
    subtitle: "Six fictional businesses",
  },
  {
    id: "property",
    icon: "🏢",
    title: "Property",
    subtitle: "Income and growth strategies",
  },
  {
    id: "commodities",
    icon: "🪙",
    title: "Commodities",
    subtitle: "Gold, silver, energy and agriculture",
  },
  {
    id: "digital",
    icon: "◈",
    title: "Digital Assets",
    subtitle: "High-volatility fictional baskets",
  },
];

function readSave(): GameState | null {
  if (typeof window === "undefined") return null;

  try {
    const raw =
      localStorage.getItem(STORAGE_KEY);

    if (!raw) return null;

    const parsed = JSON.parse(raw);

    return parsed?.version === 5
      ? (parsed as GameState)
      : null;
  } catch {
    return null;
  }
}

function save(state: GameState) {
  if (typeof window !== "undefined") {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(state),
    );
  }
}

function resetSave() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function fc(value: number) {
  return `FC ${Math.round(
    value,
  ).toLocaleString("en-GB")}`;
}

function Sparkline({
  values,
}: {
  values: number[];
}) {
  if (values.length < 2) {
    return (
      <div className="sparkEmpty">
        PRICE HISTORY STARTS AFTER EPISODE 1
      </div>
    );
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(
    max - min,
    0.0001,
  );

  const width = 220;
  const height = 56;

  const points = values
    .map((value, index) => {
      const x =
        (index /
          (values.length - 1)) *
        width;

      const y =
        height -
        ((value - min) / range) *
          (height - 8) -
        4;

      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      className="spark"
      viewBox={`0 0 ${width} ${height}`}
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AyoDrawer({
  state,
  open,
  prompt,
  onClose,
  onChange,
}: {
  state: GameState;
  open: boolean;
  prompt: string;
  onClose: () => void;
  onChange: (next: GameState) => void;
}) {
  const [text, setText] =
    useState(prompt);

  const endRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) setText(prompt);
  }, [open, prompt]);

  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [open, state.messages]);

  if (!open) return null;

  const submit = (
    event: FormEvent,
  ) => {
    event.preventDefault();

    if (!text.trim()) return;

    onChange(chat(state, text));
    setText("");
  };

  return (
    <div
      className="drawerOverlay"
      onClick={onClose}
    >
      <aside
        className="ayoDrawer"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="drawerHead">
          <div>
            <span>
              AYO · INVESTMENT COACH
            </span>

            <h3>
              Think before you act.
            </h3>
          </div>

          <button onClick={onClose}>
            ×
          </button>
        </div>

        <div className="messages">
          {state.messages
            .slice(-16)
            .map((message) => (
              <article
                key={message.id}
                className={
                  message.sender
                }
              >
                <small>
                  {message.sender ===
                  "learner"
                    ? "YOU"
                    : message.sender.toUpperCase()}
                </small>

                <p>
                  {message.text}
                </p>
              </article>
            ))}

          <div ref={endRef} />
        </div>

        <div className="quickPrompts">
          <button
            onClick={() =>
              setText(
                "Review my portfolio and tell me what stands out.",
              )
            }
          >
            Review portfolio
          </button>

          <button
            onClick={() =>
              setText(
                "Explain the current market news in simple language.",
              )
            }
          >
            Explain news
          </button>

          <button
            onClick={() =>
              setText(
                "Am I taking too much concentrated risk?",
              )
            }
          >
            Check risk
          </button>
        </div>

        <form onSubmit={submit}>
          <input
            value={text}
            onChange={(event) =>
              setText(
                event.target.value,
              )
            }
            placeholder="Ask AYO..."
          />

          <button>
            Send
          </button>
        </form>
      </aside>
    </div>
  );
}

function AssetSheet({
  state,
  assetId,
  onClose,
  onChange,
  onAskAyo,
}: {
  state: GameState;
  assetId: AssetId;
  onClose: () => void;
  onChange: (next: GameState) => void;
  onAskAyo: (assetId: AssetId) => void;
}) {
  const asset = byId(assetId);

  const [tab, setTab] = useState<
    "research" | "buy" | "sell"
  >("research");

  const [amount, setAmount] =
    useState(5000);

  const owned =
    holdingValue(
      state,
      assetId,
    );

  return (
    <div className="modalOverlay">
      <section className="assetSheet">
        <div className="sheetHead">
          <div>
            <span>
              {asset.ticker}
            </span>

            <h2>
              {asset.name}
            </h2>

            <p>
              {asset.sector ??
                asset.category}
              {" · "}Risk{" "}
              {asset.risk}/5
              {" · "}
              {asset.liquidity}
              {" liquidity"}
            </p>
          </div>

          <button onClick={onClose}>
            ×
          </button>
        </div>

        <div className="pricePanel">
          <div>
            <small>
              FICTIONAL MARKET PRICE
            </small>

            <strong>
              FC{" "}
              {state.prices[
                assetId
              ].toFixed(2)}
            </strong>
          </div>

          <Sparkline
            values={
              state.history[
                assetId
              ] ?? []
            }
          />
        </div>

        <div className="sheetTabs">
          {(
            [
              "research",
              "buy",
              "sell",
            ] as const
          ).map((item) => (
            <button
              key={item}
              className={
                tab === item
                  ? "active"
                  : ""
              }
              onClick={() =>
                setTab(item)
              }
            >
              {item === "research"
                ? "Research"
                : item === "buy"
                  ? "Buy"
                  : "Sell"}
            </button>
          ))}
        </div>

        {tab === "research" ? (
          <div className="researchBody">
            <p>
              {asset.description}
            </p>

            <div className="factGrid">
              <article>
                <span>
                  Risk
                </span>
                <b>
                  {asset.risk}/5
                </b>
              </article>

              <article>
                <span>
                  Liquidity
                </span>
                <b>
                  {asset.liquidity}
                </b>
              </article>

              <article>
                <span>
                  Return source
                </span>
                <b>
                  {asset.incomeLabel}
                </b>
              </article>

              <article>
                <span>
                  You own
                </span>
                <b>
                  {allocation(
                    state,
                    assetId,
                  ).toFixed(0)}
                  %
                </b>
              </article>
            </div>

            <div className="sheetActions">
              <button
                className="primary"
                onClick={() =>
                  onAskAyo(
                    assetId,
                  )
                }
              >
                Ask AYO about{" "}
                {asset.ticker}
              </button>

              <button
                className="secondary"
                onClick={() =>
                  onChange(
                    toggleWatchlist(
                      state,
                      assetId,
                    ),
                  )
                }
              >
                {state.watchlist.includes(
                  assetId,
                )
                  ? "★ Watching"
                  : "☆ Watch"}
              </button>
            </div>
          </div>
        ) : tab === "buy" ? (
          <div className="tradeBody">
            <div className="tradeSummary">
              <span>
                Cash available
              </span>

              <strong>
                {fc(
                  state.cash,
                )}
              </strong>
            </div>

            <label>
              FountainCash to invest

              <input
                type="number"
                min={100}
                step={100}
                value={amount}
                onChange={(event) =>
                  setAmount(
                    Number(
                      event.target
                        .value,
                    ),
                  )
                }
              />
            </label>

            <button
              className="primary wide"
              disabled={
                amount <= 0 ||
                amount >
                  state.cash
              }
              onClick={() => {
                onChange(
                  buy(
                    state,
                    assetId,
                    amount,
                  ),
                );
                onClose();
              }}
            >
              Buy{" "}
              {asset.ticker} →
            </button>
          </div>
        ) : (
          <div className="tradeBody">
            <div className="tradeSummary">
              <span>
                Position value
              </span>

              <strong>
                {fc(owned)}
              </strong>
            </div>

            <div className="sellGrid">
              {[25, 50, 100].map(
                (percent) => (
                  <button
                    key={percent}
                    disabled={
                      owned <= 0
                    }
                    onClick={() => {
                      onChange(
                        sell(
                          state,
                          assetId,
                          percent,
                        ),
                      );
                      onClose();
                    }}
                  >
                    Sell{" "}
                    {percent}%
                  </button>
                ),
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default function InvestmentLabGame() {
  const [state, setState] =
    useState<GameState | null>(
      null,
    );

  const [hasSave, setHasSave] =
    useState(false);

  const [
    selectedAsset,
    setSelectedAsset,
  ] =
    useState<AssetId | null>(
      null,
    );

  const [ayoOpen, setAyoOpen] =
    useState(false);

  const [
    ayoPrompt,
    setAyoPrompt,
  ] =
    useState("");

  const [
    twinPlaybookOpen,
    setTwinPlaybookOpen,
  ] = useState(false);

  useEffect(() => {
    setHasSave(
      Boolean(readSave()),
    );
  }, []);

  useEffect(() => {
    if (state) save(state);
  }, [state]);

  const total = state
    ? portfolioValue(state)
    : 100000;

  const score = state
    ? overallScore(
        state.scores,
      )
    : 0;

  const episode =
    state &&
    state.episodeIndex <
      episodes.length
      ? currentEpisode(
          state,
        )
      : null;

  const marketAssets =
    useMemo(
      () =>
        state
          ? marketAssetsForState(
              state,
            )
          : [],
      [state],
    );

  const heldAssets =
    useMemo(
      () =>
        state
          ? assets.filter(
              (asset) =>
                asset.id !==
                  "cash" &&
                Boolean(
                  state.holdings[
                    asset.id
                  ],
                ),
            )
          : [],
      [state],
    );

  function askAsset(
    assetId: AssetId,
  ) {
    if (!state) return;

    const asset =
      byId(assetId);

    const question =
      `Explain ${asset.name} (${asset.ticker}) in simple language. ` +
      `What does it represent, where could returns come from, what are the main risks, ` +
      `how liquid is it, and what should I consider before deciding?`;

    setState(
      chat(
        state,
        question,
      ),
    );

    setSelectedAsset(null);
    setAyoPrompt("");
    setAyoOpen(true);
  }

  if (!state) {
    return (
      <main className="shell">
        <header className="simpleHeader">
          <Link href="/financial-education">
            FountainPrep
          </Link>

          <span>
            12-Episode Investor Challenge
          </span>
        </header>

        <section className="landing">
          <div>
            <span className="eyebrow">
              INVESTMENT LAB
            </span>

            <h1>
              Twelve episodes.
              <em>
                {" "}One evolving portfolio.
              </em>
            </h1>

            <p>
              Start with FC100,000
              of fictional capital.
              Each episode changes
              the news, market
              conditions and the
              decisions in front
              of you.
            </p>

            <div className="actions">
              <button
                className="primary"
                onClick={() => {
                  resetSave();
                  setState(
                    createGame(),
                  );
                  setHasSave(true);
                }}
              >
                Start Episode 1 →
              </button>

              {hasSave ? (
                <button
                  className="secondary"
                  onClick={() =>
                    setState(
                      readSave(),
                    )
                  }
                >
                  Resume challenge
                </button>
              ) : null}
            </div>
          </div>

          <aside className="journey">
            <span>
              THE JOURNEY
            </span>

            {episodes
              .slice(0, 6)
              .map((item) => (
                <article key={item.id}>
                  <b>
                    {String(
                      item.number,
                    ).padStart(
                      2,
                      "0",
                    )}
                  </b>

                  <div>
                    <strong>
                      {item.title}
                    </strong>
                    <small>
                      {item.subtitle}
                    </small>
                  </div>
                </article>
              ))}

            <p>
              Episodes 7–12
              continue the market
              story.
            </p>
          </aside>
        </section>

        <style jsx>
          {styles}
        </style>
      </main>
    );
  }

  if (
    state.phase ===
      "episode-intro" &&
    episode
  ) {
    return (
      <main className="shell">
        <Header
          state={state}
          total={total}
          score={score}
        />

        <section className="episodeIntro">
          <div className="episodeOrb">
            <span>
              EPISODE
            </span>

            <strong>
              {String(
                episode.number,
              ).padStart(
                2,
                "0",
              )}
            </strong>

            <small>
              OF 12
            </small>
          </div>

          <span className="eyebrow">
            {episode.subtitle}
          </span>

          <h1>
            {episode.title}
          </h1>

          <p>
            {episode.setup}
          </p>

          <div className="objective">
            <span>
              YOUR OBJECTIVE
            </span>

            <p>
              {episode.objective}
            </p>
          </div>

          <button
            className="primary"
            onClick={() =>
              setState(
                beginEpisode(
                  state,
                ),
              )
            }
          >
            Enter Episode{" "}
            {episode.number} →
          </button>
        </section>

        <style jsx>
          {styles}
        </style>
      </main>
    );
  }

  if (
    state.phase ===
      "episode-hub" &&
    episode
  ) {
    return (
      <main className="shell">
        <Header
          state={state}
          total={total}
          score={score}
        />

        <section className="hub">
          <div className="hubHead">
            <div>
              <span className="eyebrow">
                EPISODE{" "}
                {episode.number} OF 12
              </span>

              <h1>
                What will you do?
              </h1>

              <p>
                {episode.prompt}
              </p>
            </div>

            <div className="valuePill">
              <span>
                PORTFOLIO
              </span>

              <strong>
                {fc(total)}
              </strong>
            </div>
          </div>

          <div className="decisionGrid">
            <ActionCard
              icon="📰"
              title="Read the news"
              text="See what changed this episode"
              onClick={() =>
                setState(
                  openNews(
                    state,
                  ),
                )
              }
            />

            <ActionCard
              icon="🔎"
              title="Research investments"
              text="Compare before deciding"
              onClick={() =>
                setState(
                  visitMarkets(
                    state,
                  ),
                )
              }
            />

            <ActionCard
              icon="📊"
              title="Review portfolio"
              text="See what you already own"
              onClick={() =>
                setState(
                  openPortfolio(
                    state,
                  ),
                )
              }
            />

            <ActionCard
              icon="🏛️"
              title="Go to market"
              text="Buy or sell an investment"
              onClick={() =>
                setState(
                  visitMarkets(
                    state,
                  ),
                )
              }
            />

            <ActionCard
              icon="✦"
              title="Ask AYO"
              text="Think through the decision"
              onClick={() => {
                setAyoPrompt(
                  "Help me think through this episode before I make a decision.",
                );
                setAyoOpen(true);
              }}
            />

            <ActionCard
              icon="⏸"
              title="Make no trade"
              text="Holding is a decision too"
              active={
                state.episodeDecisionMade
              }
              onClick={() =>
                setState(
                  holdEpisode(
                    state,
                  ),
                )
              }
            />
          </div>

          <div className="finishBar">
            <div>
              <span>
                EPISODE STATUS
              </span>

              <strong>
                {state.episodeDecisionMade
                  ? "Decision made"
                  : "Make at least one decision"}
              </strong>
            </div>

            <button
              className="primary"
              disabled={
                !state.episodeDecisionMade
              }
              onClick={() =>
                setState(
                  triggerStressTest(
                    state,
                  ),
                )
              }
            >
              See what happens →
            </button>
          </div>
        </section>

        <AyoDrawer
          state={state}
          open={ayoOpen}
          prompt={ayoPrompt}
          onClose={() =>
            setAyoOpen(false)
          }
          onChange={setState}
        />

        <style jsx>
          {styles}
        </style>
      </main>
    );
  }

  if (
    state.phase ===
      "news" &&
    episode
  ) {
    const news =
      state.currentNews[0];

    return (
      <main className="shell">
        <Header
          state={state}
          total={total}
          score={score}
        />

        <section className="newsCard">
          <span>
            EPISODE{" "}
            {episode.number} ·
            MARKET BRIEF
          </span>

          <h1>
            {news?.headline}
          </h1>

          <p>
            {news?.summary}
          </p>

          <div className="lessonBox">
            <span>
              AYO'S LEARNING POINT
            </span>

            <p>
              {news?.learningPoint}
            </p>
          </div>

          <div className="actions">
            <button
              className="secondary"
              onClick={() => {
                setAyoPrompt(
                  `Explain this news in simple language: ${news?.headline}`,
                );
                setAyoOpen(true);
              }}
            >
              Ask AYO
            </button>

            <button
              className="primary"
              onClick={() =>
                setState(
                  visitMarkets(
                    state,
                  ),
                )
              }
            >
              Ready for market →
            </button>
          </div>

          <button
            className="back"
            onClick={() =>
              setState(
                returnToHub(
                  state,
                ),
              )
            }
          >
            ← Return to episode
          </button>
        </section>

        <AyoDrawer
          state={state}
          open={ayoOpen}
          prompt={ayoPrompt}
          onClose={() =>
            setAyoOpen(false)
          }
          onChange={setState}
        />

        <style jsx>
          {styles}
        </style>
      </main>
    );
  }

  if (
    state.phase ===
      "market-categories" &&
    episode
  ) {
    const available =
      markets.filter(
        (market) =>
          episode.availableMarkets.includes(
            market.id,
          ),
      );

    return (
      <main className="shell">
        <Header
          state={state}
          total={total}
          score={score}
        />

        <section className="marketChooser">
          <span className="eyebrow">
            EPISODE{" "}
            {episode.number} ·
            FOUNTAIN EXCHANGE
          </span>

          <h1>
            Choose a market.
          </h1>

          <p>
            Only markets available
            in this episode are
            shown.
          </p>

          <div className="marketGrid">
            {available.map(
              (market) => (
                <button
                  key={market.id}
                  onClick={() =>
                    setState(
                      openMarket(
                        state,
                        market.id,
                      ),
                    )
                  }
                >
                  <i>
                    {market.icon}
                  </i>

                  <strong>
                    {market.title}
                  </strong>

                  <span>
                    {market.subtitle}
                  </span>

                  <b>
                    Enter market →
                  </b>
                </button>
              ),
            )}
          </div>

          <button
            className="back centered"
            onClick={() =>
              setState(
                returnToHub(
                  state,
                ),
              )
            }
          >
            ← Return to episode
          </button>
        </section>

        <style jsx>
          {styles}
        </style>
      </main>
    );
  }

  if (
    state.phase ===
      "market" &&
    episode
  ) {
    return (
      <main className="shell">
        <Header
          state={state}
          total={total}
          score={score}
        />

        <section className="marketScene">
          <div className="marketHead">
            <button
              className="back"
              onClick={() =>
                setState(
                  visitMarkets(
                    state,
                  ),
                )
              }
            >
              ← All markets
            </button>

            <div>
              <span className="eyebrow">
                FOUNTAIN EXCHANGE
              </span>

              <h1>
                Choose an
                investment.
              </h1>
            </div>

            <button
              className="secondary"
              onClick={() => {
                setAyoPrompt(
                  "Help me compare the investments in this market.",
                );
                setAyoOpen(true);
              }}
            >
              Ask AYO
            </button>
          </div>

          <div className="assetGrid">
            {marketAssets.map(
              (asset) => (
                <article
                  className="assetCard"
                  key={asset.id}
                >
                  <div className="assetTop">
                    <div>
                      <span>
                        {asset.ticker}
                      </span>

                      <strong>
                        {asset.name}
                      </strong>

                      <small>
                        {asset.sector ??
                          asset.category}
                      </small>
                    </div>

                    <button
                      onClick={() =>
                        setState(
                          toggleWatchlist(
                            state,
                            asset.id,
                          ),
                        )
                      }
                    >
                      {state.watchlist.includes(
                        asset.id,
                      )
                        ? "★"
                        : "☆"}
                    </button>
                  </div>

                  <div className="priceLine">
                    <strong>
                      FC{" "}
                      {state.prices[
                        asset.id
                      ].toFixed(
                        2,
                      )}
                    </strong>

                    <Sparkline
                      values={
                        state.history[
                          asset.id
                        ] ?? []
                      }
                    />
                  </div>

                  <p>
                    {asset.description}
                  </p>

                  <div className="facts">
                    <span>
                      Risk
                      <b>
                        {asset.risk}
                        /5
                      </b>
                    </span>

                    <span>
                      Liquidity
                      <b>
                        {asset.liquidity}
                      </b>
                    </span>

                    <span>
                      Own
                      <b>
                        {allocation(
                          state,
                          asset.id,
                        ).toFixed(
                          0,
                        )}
                        %
                      </b>
                    </span>
                  </div>

                  <button
                    className="primary wide"
                    onClick={() =>
                      setSelectedAsset(
                        asset.id,
                      )
                    }
                  >
                    Research /
                    Trade
                  </button>
                </article>
              ),
            )}
          </div>

          <button
            className="back centered"
            onClick={() =>
              setState(
                returnToHub(
                  state,
                ),
              )
            }
          >
            ← Return to Episode{" "}
            {episode.number}
          </button>
        </section>

        {selectedAsset ? (
          <AssetSheet
            state={state}
            assetId={
              selectedAsset
            }
            onClose={() =>
              setSelectedAsset(
                null,
              )
            }
            onChange={setState}
            onAskAyo={askAsset}
          />
        ) : null}

        <AyoDrawer
          state={state}
          open={ayoOpen}
          prompt={ayoPrompt}
          onClose={() =>
            setAyoOpen(false)
          }
          onChange={setState}
        />

        <style jsx>
          {styles}
        </style>
      </main>
    );
  }

  if (
    state.phase ===
      "portfolio" &&
    episode
  ) {
    return (
      <main className="shell">
        <Header
          state={state}
          total={total}
          score={score}
        />

        <section className="portfolio">
          <div className="portfolioHead">
            <div>
              <span className="eyebrow">
                EPISODE{" "}
                {episode.number} ·
                PORTFOLIO
              </span>

              <h1>
                What your money is
                doing.
              </h1>
            </div>

            <strong>
              {fc(total)}
            </strong>
          </div>

          <div className="cashRow">
            <div>
              <b>
                FC
              </b>

              <span>
                <strong>
                  Cash Reserve
                </strong>

                <small>
                  Available for
                  opportunities
                </small>
              </span>
            </div>

            <div>
              <strong>
                {fc(
                  state.cash,
                )}
              </strong>
            </div>
          </div>

          {heldAssets.length ===
          0 ? (
            <div className="empty">
              No investments yet.
            </div>
          ) : (
            heldAssets.map(
              (asset) => (
                <article
                  className="portfolioRow"
                  key={asset.id}
                >
                  <div>
                    <b>
                      {asset.ticker}
                    </b>

                    <span>
                      <strong>
                        {asset.name}
                      </strong>

                      <small>
                        Avg cost FC{" "}
                        {state.holdings[
                          asset.id
                        ]!.avgCost.toFixed(
                          2,
                        )}
                      </small>
                    </span>
                  </div>

                  <Sparkline
                    values={
                      state.history[
                        asset.id
                      ] ?? []
                    }
                  />

                  <div>
                    <strong>
                      {fc(
                        holdingValue(
                          state,
                          asset.id,
                        ),
                      )}
                    </strong>
                  </div>

                  <button
                    onClick={() =>
                      setSelectedAsset(
                        asset.id,
                      )
                    }
                  >
                    Open
                  </button>
                </article>
              ),
            )
          )}

          <div className="actions right">
            <button
              className="secondary"
              onClick={() => {
                setAyoPrompt(
                  "Review my portfolio and tell me what stands out.",
                );
                setAyoOpen(true);
              }}
            >
              Ask AYO
            </button>

            <button
              className="primary"
              onClick={() =>
                setState(
                  visitMarkets(
                    state,
                  ),
                )
              }
            >
              Go to market →
            </button>
          </div>

          <button
            className="back centered"
            onClick={() =>
              setState(
                returnToHub(
                  state,
                ),
              )
            }
          >
            ← Return to Episode{" "}
            {episode.number}
          </button>
        </section>

        {selectedAsset ? (
          <AssetSheet
            state={state}
            assetId={
              selectedAsset
            }
            onClose={() =>
              setSelectedAsset(
                null,
              )
            }
            onChange={setState}
            onAskAyo={askAsset}
          />
        ) : null}

        <AyoDrawer
          state={state}
          open={ayoOpen}
          prompt={ayoPrompt}
          onClose={() =>
            setAyoOpen(false)
          }
          onChange={setState}
        />

        <style jsx>
          {styles}
        </style>
      </main>
    );
  }


  if (
    state.phase ===
      "stress-test" &&
    state.stressEvent &&
    episode
  ) {
    const stress =
      state.stressEvent;

    const isLoss =
      stress.movePercent < 0;

    const currentHoldings =
      assets.filter(
        (asset) =>
          asset.id !== "cash" &&
          holdingValue(
            state,
            asset.id,
          ) > 0,
      );

    const resolveSelected =
      state.pendingResolveAction;

    const canContinueResolve =
      resolveSelected === "hold" ||
      resolveSelected === "sell" ||
      resolveSelected === "reallocate";

    return (
      <main
        className={
          isLoss
            ? "shell stressShell loss"
            : "shell stressShell gain"
        }
      >
        <Header
          state={state}
          total={portfolioValue(state)}
          score={score}
        />

        <section className="stressScene">
          <div className="stressBadge">
            MARKET MOVEMENT
          </div>

          <h1>
            {stress.headline}
          </h1>

          <p className="stressMessage">
            {stress.message}
          </p>

          <div className="stressNumbers">
            <article>
              <span>BEFORE</span>
              <strong>
                {fc(
                  stress.portfolioBefore,
                )}
              </strong>
            </article>

            <div className="stressArrow">
              →
            </div>

            <article>
              <span>NOW</span>
              <strong>
                {fc(
                  stress.portfolioAfter,
                )}
              </strong>
            </article>

            <div
              className={
                isLoss
                  ? "stressMove negative"
                  : "stressMove positive"
              }
            >
              {stress.movePercent >= 0
                ? "+"
                : ""}
              {stress.movePercent.toFixed(
                1,
              )}
              %
            </div>
          </div>

          <div className="stressPortfolioCard">
            <div className="stressSectionHead">
              <div>
                <span className="eyebrow">
                  YOUR POSITIONS
                </span>

                <h2>
                  What moved?
                </h2>
              </div>

              <strong>
                {fc(
                  portfolioValue(
                    state,
                  ),
                )}
              </strong>
            </div>

            {currentHoldings.length === 0 ? (
              <div className="empty">
                You are still entirely
                in cash. The market moved,
                but your portfolio was
                largely protected from
                that movement.
              </div>
            ) : (
              <div className="stressHoldings">
                {currentHoldings.map(
                  (asset) => {
                    const history =
                      state.history[
                        asset.id
                      ] ?? [];

                    const current =
                      state.prices[
                        asset.id
                      ];

                    const previous =
                      history.length > 1
                        ? history[
                            history.length -
                              2
                          ]
                        : current;

                    const move =
                      previous > 0
                        ? ((current -
                            previous) /
                            previous) *
                          100
                        : 0;

                    return (
                      <article
                        key={asset.id}
                      >
                        <div className="stressAssetName">
                          <b>
                            {asset.ticker}
                          </b>

                          <span>
                            {asset.name}
                          </span>
                        </div>

                        <Sparkline
                          values={history}
                        />

                        <div className="stressAssetValue">
                          <strong>
                            {fc(
                              holdingValue(
                                state,
                                asset.id,
                              ),
                            )}
                          </strong>

                          <span
                            className={
                              move >= 0
                                ? "positive"
                                : "negative"
                            }
                          >
                            {move >= 0
                              ? "+"
                              : ""}
                            {move.toFixed(
                              1,
                            )}
                            %
                          </span>
                        </div>
                      </article>
                    );
                  },
                )}
              </div>
            )}
          </div>

          <div className="resolvePrompt">
            <span>
              YOUR RESOLVE IS BEING
              TESTED
            </span>

            <h2>
              What will you do?
            </h2>

            <p>
              There is no guaranteed
              correct choice. Make the
              decision you can defend
              based on your goal, risk,
              information and portfolio.
            </p>
          </div>

          <div className="resolveChoices">
            <button
              className={
                resolveSelected ===
                "hold"
                  ? "selected"
                  : ""
              }
              onClick={() =>
                setState(
                  chooseResolveAction(
                    state,
                    "hold",
                  ),
                )
              }
            >
              <b>A</b>

              <strong>
                Hold my positions
              </strong>

              <span>
                My reasoning has not
                changed.
              </span>
            </button>

            <button
              className={
                resolveSelected ===
                "sell"
                  ? "selected"
                  : ""
              }
              onClick={() =>
                setState(
                  chooseResolveAction(
                    state,
                    "sell",
                  ),
                )
              }
            >
              <b>B</b>

              <strong>
                Close my largest
                position
              </strong>

              <span>
                I want to reduce my
                exposure.
              </span>
            </button>

            <button
              className={
                resolveSelected ===
                "reallocate"
                  ? "selected"
                  : ""
              }
              onClick={() =>
                setState(
                  chooseResolveAction(
                    state,
                    "reallocate",
                  ),
                )
              }
            >
              <b>C</b>

              <strong>
                Reallocate
              </strong>

              <span>
                I want to change what I
                own.
              </span>
            </button>
          </div>

          <div className="stressActions">
            <button
              className="secondary"
              onClick={() => {
                setAyoPrompt(
                  `My portfolio just moved ${stress.movePercent.toFixed(
                    1,
                  )}%. Help me think through whether I should hold, sell or reallocate without making the decision for me.`,
                );
                setAyoOpen(true);
              }}
            >
              Ask AYO before deciding
            </button>

            {canContinueResolve ? (
              <button
                className="primary"
                onClick={() =>
                  setState(
                    completeResolveTest(
                      state,
                    ),
                  )
                }
              >
                Commit decision & see
                what happens →
              </button>
            ) : (
              <button
                className="primary"
                disabled
              >
                Choose your response
                first
              </button>
            )}
          </div>

          {resolveSelected ===
          "reallocate" ? (
            <div className="reallocateHint">
              <strong>
                Reallocation selected.
              </strong>

              <span>
                Open the market, buy or
                sell what you want, then
                return here and commit
                your decision.
              </span>

              <button
                className="secondary"
                onClick={() =>
                  setState(
                    visitMarkets(
                      state,
                    ),
                  )
                }
              >
                Open market to
                reallocate →
              </button>
            </div>
          ) : null}
        </section>

        <AyoDrawer
          state={state}
          open={ayoOpen}
          prompt={ayoPrompt}
          onClose={() =>
            setAyoOpen(false)
          }
          onChange={setState}
        />

        <style jsx>
          {styles}
        </style>
      </main>
    );
  }

  if (
    state.phase ===
    "episode-result"
  ) {
    const completed =
      episodes[
        state.episodeIndex - 1
      ];

    const next =
      episodes[
        state.episodeIndex
      ];

    const campaignReturn =
      state.campaignStartValue > 0
        ? ((total -
            state.campaignStartValue) /
            state.campaignStartValue) *
          100
        : 0;

    const resultHoldings =
      assets.filter(
        (asset) =>
          asset.id !== "cash" &&
          holdingValue(
            state,
            asset.id,
          ) > 0,
      );

    const lastDecision =
      [...state.decisionHistory]
        .reverse()
        .find(
          (item) =>
            item.episodeNumber ===
            completed.number,
        );

    return (
      <main className="shell">
        <Header
          state={state}
          total={total}
          score={score}
        />

        <section className="result resultWide">
          <span className="eyebrow">
            EPISODE{" "}
            {completed.number}{" "}
            COMPLETE
          </span>

          <h1>
            The market answered.
          </h1>

          <p className="resultIntro">
            Your decision had a
            consequence. The result
            matters, but the quality of
            your process matters too.
          </p>

          <div className="resultHero">
            <div className="resultOrb">
              <span>
                PORTFOLIO
              </span>

              <strong>
                {fc(total)}
              </strong>

              <b
                className={
                  state.lastEpisodeReturn >=
                  0
                    ? "positive"
                    : "negative"
                }
              >
                {state.lastEpisodeReturn >=
                0
                  ? "+"
                  : ""}
                {state.lastEpisodeReturn.toFixed(
                  1,
                )}
                %
              </b>
            </div>

            <div className="journeyPanel">
              <div className="journeyPanelHead">
                <div>
                  <span className="eyebrow">
                    PORTFOLIO JOURNEY
                  </span>

                  <strong>
                    {campaignReturn >= 0
                      ? "+"
                      : ""}
                    {campaignReturn.toFixed(
                      1,
                    )}
                    % since start
                  </strong>
                </div>

                <span>
                  {state.portfolioHistory.length -
                    1}{" "}
                  episodes recorded
                </span>
              </div>

              <Sparkline
                values={state.portfolioHistory.map(
                  (point) =>
                    point.value,
                )}
              />

              <div className="journeyLabels">
                {state.portfolioHistory.map(
                  (point) => (
                    <span
                      key={`${point.episodeNumber}-${point.label}`}
                    >
                      {point.label}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>

          <div className="resultStats">
            <span>
              Trades
              <b>
                {state.episodeTradeCount}
              </b>
            </span>

            <span>
              Resolve
              <b>
                {state.stressEvent
                  ?.chosenAction ??
                  "—"}
              </b>
            </span>

            <span>
              Investor score
              <b>
                {score}
              </b>
            </span>

            <span>
              XP
              <b>
                {state.xp}
              </b>
            </span>
          </div>

          <div className="resultPortfolio">
            <div className="resultSectionHead">
              <div>
                <span className="eyebrow">
                  CURRENT INVESTMENTS
                </span>

                <h2>
                  What you own now
                </h2>
              </div>

              <strong>
                Cash {fc(state.cash)}
              </strong>
            </div>

            {resultHoldings.length === 0 ? (
              <div className="empty">
                You currently hold no
                investments outside
                cash.
              </div>
            ) : (
              resultHoldings.map(
                (asset) => (
                  <article
                    key={asset.id}
                  >
                    <div>
                      <b>
                        {asset.ticker}
                      </b>

                      <span>
                        <strong>
                          {asset.name}
                        </strong>

                        <small>
                          {allocation(
                            state,
                            asset.id,
                          ).toFixed(
                            0,
                          )}
                          % of portfolio
                        </small>
                      </span>
                    </div>

                    <Sparkline
                      values={
                        state.history[
                          asset.id
                        ] ?? []
                      }
                    />

                    <div>
                      <strong>
                        {fc(
                          holdingValue(
                            state,
                            asset.id,
                          ),
                        )}
                      </strong>
                    </div>
                  </article>
                ),
              )
            )}
          </div>

          <div className="ayoReview">
            <span>
              AYO'S REVIEW
            </span>

            <p>
              {lastDecision
                ? `You chose ${lastDecision.action} during Episode ${completed.number}. Do not judge that decision only by whether the next price move helped or hurt you. Ask whether the action matched your information, time horizon, risk and portfolio role.`
                : `Episode ${completed.number} is complete. Review what changed, what you controlled and what the market decided for you.`}
            </p>
          </div>

          <div className="nextCard">
            <span>
              NEXT
            </span>

            <strong>
              Episode{" "}
              {next.number}:{" "}
              {next.title}
            </strong>

            <p>
              {next.setup}
            </p>
          </div>

          <button
            className="primary"
            onClick={() =>
              setState(
                continueToNextEpisode(
                  state,
                ),
              )
            }
          >
            Continue to Episode{" "}
            {next.number} →
          </button>
        </section>

        <style jsx>
          {styles}
        </style>
      </main>
    );
  }

  if (
    state.phase ===
    "campaign-complete"
  ) {
    const twin =
      simulateInvestmentTwin(
        state,
      );

    const comparison =
      investmentTwinGap(
        state,
        total,
      );

    const learnerReturn =
      ((total - 100000) /
        100000) *
      100;

    const twinAhead =
      comparison.gap > 0;

    const allocationRows =
      Object.entries(
        twin.strategy
          .targetAllocation,
      )
        .filter(
          ([, weight]) =>
            (weight ?? 0) > 0,
        )
        .sort(
          (a, b) =>
            (b[1] ?? 0) -
            (a[1] ?? 0),
        );

    return (
      <main className="shell">
        <Header
          state={state}
          total={total}
          score={score}
        />

        <section className="twinFinal">
          <span className="eyebrow">
            12 EPISODES COMPLETE
          </span>

          <h1>
            Same FC100,000.
            <em>
              {" "}Same market.
              Different decisions.
            </em>
          </h1>

          <p className="twinLead">
            You and your Financial
            Twin started with exactly
            the same fictional capital
            and experienced the same
            market movements. Only the
            portfolio decisions were
            different.
          </p>

          <div className="twinComparison">
            <article>
              <span>
                YOUR PORTFOLIO
              </span>

              <strong>
                {fc(total)}
              </strong>

              <b
                className={
                  learnerReturn >= 0
                    ? "positive"
                    : "negative"
                }
              >
                {learnerReturn >= 0
                  ? "+"
                  : ""}
                {learnerReturn.toFixed(
                  1,
                )}
                %
              </b>

              <small>
                Investor score {score}/100
              </small>
            </article>

            <div className="versusOrb">
              VS
            </div>

            <article className="twinCard">
              <span>
                FINANCIAL TWIN
              </span>

              <strong>
                {fc(
                  twin.finalValue,
                )}
              </strong>

              <b
                className={
                  twin.totalReturnPercent >=
                  0
                    ? "positive"
                    : "negative"
                }
              >
                {twin.totalReturnPercent >=
                0
                  ? "+"
                  : ""}
                {twin.totalReturnPercent.toFixed(
                  1,
                )}
                %
              </b>

              <small>
                Same starting money
              </small>
            </article>
          </div>

          <div className="gapCard">
            <span>
              THE DIFFERENCE
            </span>

            <strong>
              {fc(
                Math.abs(
                  comparison.gap,
                ),
              )}
            </strong>

            <p>
              {comparison.gap === 0
                ? "You and your Twin finished at the same portfolio value."
                : twinAhead
                  ? "Your Twin finished ahead. The interesting question is not simply who won — it is which portfolio decisions created the difference."
                  : "You finished ahead of your Twin. Now compare the decisions that produced the difference rather than assuming one outcome proves one strategy is always better."}
            </p>
          </div>

          <div className="twinPrinciple">
            <span>
              YOUR FINANCIAL TWIN
            </span>

            <h2>
              No secret information.
              No extra money.
            </h2>

            <p>
              The Twin did not know
              which asset would rise
              next. It used a
              diversified target,
              preserved liquidity and
              repeatedly brought the
              portfolio back to its
              intended roles.
            </p>
          </div>

          <div className="playbookGate">
            <div>
              <span>
                TWIN PLAYBOOK
              </span>

              <h2>
                Curious what your Twin
                actually did?
              </h2>

              <p>
                Reveal its asset mix,
                portfolio rules and
                episode-by-episode
                discipline — then
                connect those decisions
                to the Financial
                Education training.
              </p>
            </div>

            <button
              className="primary"
              onClick={() =>
                setTwinPlaybookOpen(
                  (open) => !open,
                )
              }
            >
              {twinPlaybookOpen
                ? "Hide Twin Playbook"
                : "View Twin Playbook →"}
            </button>
          </div>

          {twinPlaybookOpen ? (
            <div className="playbookReveal">
              <div className="playbookHead">
                <div>
                  <span className="eyebrow">
                    THE DISCIPLINED
                    PORTFOLIO BUILDER
                  </span>

                  <h2>
                    {
                      twin.strategy
                        .name
                    }
                  </h2>
                </div>

                <b>
                  Educational strategy
                </b>
              </div>

              <p>
                {
                  twin.strategy
                    .description
                }
              </p>

              <div className="allocationMap">
                {allocationRows.map(
                  ([
                    assetId,
                    weight,
                  ]) => {
                    const asset =
                      byId(
                        assetId as AssetId,
                      );

                    return (
                      <article
                        key={assetId}
                      >
                        <div>
                          <span>
                            {asset.ticker}
                          </span>

                          <strong>
                            {asset.name}
                          </strong>
                        </div>

                        <b>
                          {Math.round(
                            (weight ??
                              0) *
                              100,
                          )}
                          %
                        </b>
                      </article>
                    );
                  },
                )}
              </div>

              <div className="ruleCard">
                <span>
                  REBALANCING RULE
                </span>

                <strong>
                  {
                    twin.strategy
                      .rebalanceRule
                  }
                </strong>
              </div>

              <div className="twinTimeline">
                {twin.timeline.map(
                  (point) => (
                    <article
                      key={
                        point.turn
                      }
                    >
                      <span>
                        {point.turn ===
                        0
                          ? "START"
                          : `MARKET TURN ${point.turn}`}
                      </span>

                      <strong>
                        {fc(
                          point.portfolioValue,
                        )}
                      </strong>

                      <p>
                        {point.note}
                      </p>
                    </article>
                  ),
                )}
              </div>

              <div className="educationLock">
                <div className="lockIcon">
                  🔒
                </div>

                <div>
                  <span>
                    CONTINUE LEARNING
                  </span>

                  <h3>
                    Understand the
                    thinking behind the
                    Twin.
                  </h3>

                  <p>
                    Portfolio
                    construction,
                    diversification,
                    risk, rebalancing
                    and asset roles are
                    explored inside the
                    Financial Education
                    Academy.
                  </p>
                </div>

                <Link
                  className="academyCta"
                  href="/financial-education"
                >
                  Access Financial
                  Education →
                </Link>
              </div>
            </div>
          ) : null}

          <div className="finalActions">
            <button
              className="secondary"
              onClick={() => {
                resetSave();
                setTwinPlaybookOpen(
                  false,
                );
                setState(
                  createGame(),
                );
              }}
            >
              Play again
            </button>

            <button
              className="primary"
              onClick={() =>
                setState(
                  enterOpenMarket(
                    state,
                  ),
                )
              }
            >
              Enter Open Market →
            </button>
          </div>

          <p className="educationNote">
            Fictional simulation for
            financial education. It is
            not investment advice and
            does not predict future
            returns.
          </p>
        </section>

        <style jsx>
          {styles}
        </style>
      </main>
    );
  }

  if (
    state.phase ===
    "open-market"
  ) {
    return (
      <main className="shell">
        <Header
          state={state}
          total={total}
          score={score}
        />

        <section className="result">
          <span className="eyebrow">
            OPEN MARKET ·
            EPISODE{" "}
            {state.openMarketEpisode}
          </span>

          <h1>
            The market does not
            end.
          </h1>

          {state.currentNews[0] ? (
            <div className="nextCard">
              <span>
                MARKET NEWS
              </span>

              <strong>
                {
                  state.currentNews[
                    0
                  ].headline
                }
              </strong>

              <p>
                {
                  state.currentNews[
                    0
                  ].summary
                }
              </p>
            </div>
          ) : null}

          <div className="actions centeredActions">
            <button
              className="secondary"
              onClick={() =>
                setState(
                  visitMarkets(
                    state,
                  ),
                )
              }
            >
              Markets
            </button>

            <button
              className="secondary"
              onClick={() =>
                setState(
                  openPortfolio(
                    state,
                  ),
                )
              }
            >
              Portfolio
            </button>

            <button
              className="primary"
              onClick={() =>
                setState(
                  advanceOpenMarket(
                    state,
                  ),
                )
              }
            >
              Advance episode →
            </button>
          </div>
        </section>

        <style jsx>
          {styles}
        </style>
      </main>
    );
  }

  return null;
}

function ActionCard({
  icon,
  title,
  text,
  onClick,
  active = false,
}: {
  icon: string;
  title: string;
  text: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      className={
        active ? "active" : ""
      }
      onClick={onClick}
    >
      <i>
        {icon}
      </i>

      <strong>
        {title}
      </strong>

      <span>
        {text}
      </span>
    </button>
  );
}

function Header({
  state,
  total,
  score,
}: {
  state: GameState;
  total: number;
  score: number;
}) {
  const number =
    state.phase ===
      "episode-result"
      ? Math.max(
          state.episodeIndex,
          1,
        )
      : state.episodeIndex <
          episodes.length
        ? state.episodeIndex + 1
        : state.openMarketEpisode;

  const headerLabel =
    state.phase ===
      "episode-result"
      ? `EPISODE ${number} COMPLETE`
      : state.phase ===
          "stress-test"
        ? `EPISODE ${number} · MARKET TEST`
        : state.phase ===
            "open-market"
          ? "OPEN MARKET"
          : `EPISODE ${number} OF 12`;

  const headerTitle =
    state.phase ===
      "episode-result"
      ? episodes[
          Math.max(
            state.episodeIndex -
              1,
            0,
          )
        ]?.title ??
        "Episode Complete"
      : state.episodeIndex <
          episodes.length
        ? episodes[
            state.episodeIndex
          ].title
        : "Open Market";

  return (
    <header className="gameHeader">
      <div>
        <Link href="/financial-education">
          FountainPrep
        </Link>

        <span>
          INVESTMENT LAB
        </span>
      </div>

      <div className="episodeName">
        <span>
{headerLabel}
        </span>

        <strong>
{headerTitle}
        </strong>
      </div>

      <div className="stats">
        <article>
          <span>
            Portfolio
          </span>
          <strong>
            {fc(total)}
          </strong>
        </article>

        <article>
          <span>
            Cash
          </span>
          <strong>
            {fc(
              state.cash,
            )}
          </strong>
        </article>

        <article>
          <span>
            Score
          </span>
          <strong>
            {score}
          </strong>
        </article>

        <article>
          <span>
            XP
          </span>
          <strong>
            {state.xp}
          </strong>
        </article>
      </div>
    </header>
  );
}

const styles = `
:global(body){margin:0;background:#fbf9ff;color:#211332}
*{box-sizing:border-box}
button,input{font:inherit}
button{cursor:pointer}
.shell{
  min-height:100vh;
  font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  background:radial-gradient(circle at 78% 0%,rgba(124,58,237,.08),transparent 26%),#fbf9ff;
}
.primary{
  border:0;border-radius:999px;padding:12px 18px;
  background:linear-gradient(135deg,#6d28d9,#8b5cf6);
  color:white;font-weight:900;box-shadow:0 12px 30px rgba(109,40,217,.18)
}
.primary:disabled{opacity:.4;cursor:not-allowed}
.secondary{
  border:1px solid #e4d9ed;border-radius:999px;padding:11px 16px;
  background:white;color:#614b72;font-weight:850
}
.wide{width:100%}
.eyebrow{color:#7c3aed;font-size:10px;font-weight:950;letter-spacing:.13em}
.simpleHeader,.gameHeader{width:min(1440px,calc(100% - 36px));margin:auto}
.simpleHeader{height:76px;display:flex;align-items:center;justify-content:space-between}
.simpleHeader a,.gameHeader a{text-decoration:none;color:#211332;font-weight:950}
.simpleHeader span,.gameHeader>div:first-child span{color:#7c3aed;font-size:9px;font-weight:950}
.landing{
  width:min(1260px,calc(100% - 36px));min-height:calc(100vh - 76px);
  margin:auto;display:grid;grid-template-columns:1.1fr .9fr;gap:70px;align-items:center;padding:50px 0 90px
}
.landing h1{margin:14px 0 22px;font-size:clamp(54px,6.4vw,92px);line-height:.95;letter-spacing:-.065em}
.landing h1 em{color:#7c3aed;font-family:Georgia,serif;font-weight:400}
.landing p{max-width:700px;color:#72647d;font-size:18px;line-height:1.75}
.actions{display:flex;gap:8px;flex-wrap:wrap}.landing .actions{margin-top:26px}
.journey{padding:24px;border-radius:28px;background:linear-gradient(155deg,#211331,#3a2254);color:white}
.journey>span{color:#bd9ce2;font-size:9px;font-weight:950}
.journey article{display:grid;grid-template-columns:42px 1fr;gap:10px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.09)}
.journey article>b{color:#b993e5;font-family:Georgia,serif}
.journey strong,.journey small{display:block}.journey small{color:#c7b6d4;font-size:9px}
.journey>p{color:#bfaecb;font-size:10px}
.gameHeader{min-height:82px;display:grid;grid-template-columns:1fr auto 1.45fr;gap:20px;align-items:center}
.gameHeader>div:first-child span{display:block;margin-top:3px}
.episodeName{text-align:center}.episodeName span{display:block;color:#7c3aed;font-size:8px;font-weight:950}.episodeName strong{display:block;font-size:12px;margin-top:3px}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:7px}.stats article{padding:9px 11px;border:1px solid #eadff4;border-radius:13px;background:white}.stats span,.stats strong{display:block}.stats span{font-size:8px;color:#9789a1}.stats strong{font-size:11px}
.episodeIntro,.result{width:min(900px,calc(100% - 36px));margin:auto;padding:70px 0 90px;text-align:center}
.episodeOrb,.resultOrb{width:170px;height:170px;margin:0 auto 28px;border-radius:50%;display:grid;place-items:center;align-content:center;background:linear-gradient(145deg,#6d28d9,#9d72ed);color:white}
.episodeOrb span,.episodeOrb strong,.episodeOrb small,.resultOrb span,.resultOrb strong,.resultOrb b{display:block}.episodeOrb strong{font-size:44px}.episodeOrb span,.episodeOrb small,.resultOrb span{font-size:8px;font-weight:950}
.episodeIntro h1,.result h1{font-size:clamp(48px,6vw,76px);line-height:.98;letter-spacing:-.06em}
.episodeIntro>p{max-width:720px;margin:0 auto;color:#75677f;font-size:17px;line-height:1.7}
.objective{max-width:680px;margin:28px auto;padding:18px 20px;border:1px solid #e5d9ee;border-radius:18px;background:white}.objective span{color:#7c3aed;font-size:8px;font-weight:950}.objective p{margin:6px 0 0}
.hub,.marketChooser,.marketScene,.portfolio{width:min(1180px,calc(100% - 36px));margin:auto;padding:48px 0 90px}
.hubHead{display:flex;justify-content:space-between;gap:24px;align-items:flex-end}.hubHead h1,.marketChooser h1,.marketHead h1,.portfolioHead h1{font-size:clamp(48px,5.7vw,76px);letter-spacing:-.06em;margin:8px 0}.hubHead p{max-width:720px;color:#776a82}
.valuePill{min-width:190px;padding:15px 18px;border-radius:17px;background:#211331;color:white}.valuePill span,.valuePill strong{display:block}.valuePill span{color:#b999df;font-size:8px;font-weight:950}
.decisionGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:13px;margin-top:32px}
.decisionGrid button{min-height:178px;padding:20px;text-align:left;border:1px solid #e4d9ed;border-radius:22px;background:white;color:#211332;transition:.18s ease}
.decisionGrid button:hover{transform:translateY(-3px);box-shadow:0 18px 48px rgba(51,27,73,.09)}
.decisionGrid button.active{background:#f7f2fd;border-color:#a88cdf}
.decisionGrid i{display:block;font-style:normal;font-size:28px}.decisionGrid strong,.decisionGrid span{display:block}.decisionGrid strong{margin-top:18px}.decisionGrid span{margin-top:5px;color:#877a91;font-size:10px}
.finishBar{display:flex;justify-content:space-between;align-items:center;gap:18px;margin-top:18px;padding:16px 18px;border-radius:18px;background:#f1ecf6}.finishBar span,.finishBar strong{display:block}.finishBar span{font-size:8px;color:#927fa0;font-weight:950}
.newsCard{width:min(1000px,calc(100% - 36px));margin:70px auto;padding:42px;border-radius:30px;background:linear-gradient(145deg,#211331,#3a2054);color:white}.newsCard>span{color:#ff9cb0;font-size:9px;font-weight:950}.newsCard h1{font-size:clamp(42px,5.5vw,70px);line-height:1;letter-spacing:-.055em}.newsCard>p{color:#d4c4de;font-size:16px;line-height:1.65}.lessonBox{padding:18px;border-radius:16px;background:rgba(255,255,255,.08)}.lessonBox span{color:#bea0e2;font-size:8px;font-weight:950}
.back{border:0;background:transparent;color:#705d7e;font-weight:850;font-size:10px}.newsCard>.back{color:#cbb8d8;margin-top:18px}.centered{display:block;margin:20px auto 0}
.marketGrid,.assetGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:28px}
.marketGrid button{min-height:220px;padding:20px;text-align:left;border:1px solid #e4d9ed;border-radius:22px;background:white;color:#211332}.marketGrid i,.marketGrid strong,.marketGrid span,.marketGrid b{display:block}.marketGrid i{font-style:normal;font-size:27px}.marketGrid strong{margin-top:22px}.marketGrid span{margin-top:4px;color:#897b93;font-size:9px}.marketGrid b{margin-top:24px;color:#7c3aed;font-size:10px}
.marketHead{display:grid;grid-template-columns:auto 1fr auto;gap:18px;align-items:start}
.assetCard{padding:20px;border:1px solid #e4d9ed;border-radius:22px;background:white}.assetTop{display:flex;justify-content:space-between}.assetTop span,.assetTop strong,.assetTop small{display:block}.assetTop span{color:#7c3aed;font-size:9px;font-weight:950}.assetTop small{color:#95879e}.assetTop button{width:36px;height:36px;border:1px solid #e7ddef;border-radius:50%;background:white;color:#7c3aed;font-size:18px}
.priceLine{display:grid;grid-template-columns:auto 1fr;gap:14px;align-items:center;margin:18px 0}.spark{width:100%;height:56px;color:#7c3aed}.sparkEmpty{height:56px;display:grid;place-items:center;color:#ab9eb2;font-size:7px}.assetCard>p{min-height:64px;color:#75687f;font-size:10px;line-height:1.55}
.facts{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:14px}.facts span{padding:9px;border-radius:10px;background:#f7f3fa;color:#94869d;font-size:8px}.facts b{display:block;color:#2b1b3a;text-transform:capitalize}
.portfolioHead{display:flex;justify-content:space-between;align-items:end}.portfolioHead>strong{font-size:26px}.cashRow,.portfolioRow{display:grid;gap:12px;align-items:center;padding:14px 6px;border-bottom:1px solid #ede6f2}.cashRow{grid-template-columns:1fr auto;border-top:1px solid #ede6f2}.cashRow>div:first-child,.portfolioRow>div:first-child{display:flex;gap:10px;align-items:center}.cashRow b{width:38px;height:38px;display:grid;place-items:center;border-radius:10px;background:#efe8f8;color:#6d28d9}.cashRow span,.cashRow strong,.cashRow small,.portfolioRow span,.portfolioRow strong,.portfolioRow small{display:block}.cashRow small,.portfolioRow small{font-size:9px;color:#9789a0}.portfolioRow{grid-template-columns:1.15fr 1fr .65fr auto}.portfolioRow>div:first-child>b{min-width:54px;color:#7c3aed}.portfolioRow>button{border:1px solid #e4d9ed;border-radius:999px;padding:8px 11px;background:white;color:#614b72}.empty{padding:24px;text-align:center;background:#f8f5fa;border-radius:14px}.right{justify-content:flex-end}
.resultOrb strong{font-size:28px}.resultStats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.resultStats span{padding:12px;border-radius:12px;background:#f2edf6;color:#8d8097;font-size:9px}.resultStats b{display:block;color:#24143f}.nextCard{margin:22px 0;padding:20px;border-radius:18px;background:#f2edf6;text-align:left}.nextCard span,.nextCard strong{display:block}.nextCard span{color:#7c3aed;font-size:8px;font-weight:950}
.modalOverlay,.drawerOverlay{position:fixed;inset:0;z-index:100;background:rgba(26,13,40,.68);backdrop-filter:blur(14px)}
.modalOverlay{display:grid;place-items:center;padding:20px}.assetSheet{width:min(680px,100%);max-height:calc(100vh - 40px);overflow:auto;padding:26px;border-radius:28px;background:white}.sheetHead{display:flex;justify-content:space-between}.sheetHead span{color:#7c3aed;font-size:9px;font-weight:950}.sheetHead h2{margin:4px 0}.sheetHead p{color:#897c93}.sheetHead>button{width:38px;height:38px;border:1px solid #e5daed;border-radius:50%;background:white}
.pricePanel{display:grid;grid-template-columns:auto 1fr;gap:24px;align-items:center;margin:24px 0;padding:17px;border-radius:17px;background:#f8f4fb}.pricePanel small,.pricePanel strong{display:block}.pricePanel strong{font-size:25px}
.sheetTabs{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;padding:5px;border-radius:13px;background:#f3edf8}.sheetTabs button{border:0;border-radius:10px;padding:10px;background:transparent;font-weight:850}.sheetTabs .active{background:white;color:#6d28d9}.researchBody,.tradeBody{padding-top:18px}.researchBody>p{color:#6e6079;line-height:1.65}
.factGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:7px}.factGrid article{padding:10px;border-radius:11px;background:#f7f3fa}.factGrid span,.factGrid b{display:block}.factGrid span{font-size:8px;color:#93859d}.sheetActions{display:grid;grid-template-columns:1fr auto;gap:8px;margin-top:15px}.tradeSummary{padding:13px;border-radius:13px;background:#f7f3fa}.tradeSummary span,.tradeSummary strong{display:block}.tradeBody label{display:grid;gap:7px;margin:14px 0}.tradeBody input{padding:12px;border:1px solid #ded3e7;border-radius:12px}.sellGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}.sellGrid button{padding:9px;border:1px solid #e3d8eb;border-radius:10px;background:white}
.drawerOverlay{display:grid;place-items:stretch end}.ayoDrawer{width:min(430px,100%);height:100%;display:grid;grid-template-rows:auto 1fr auto auto;background:white}.drawerHead{padding:20px;display:flex;justify-content:space-between;border-bottom:1px solid #eee7f3}.drawerHead span{color:#7c3aed;font-size:8px;font-weight:950}.drawerHead h3{margin:4px 0}.drawerHead button{width:35px;height:35px;border:1px solid #e5daed;border-radius:50%;background:white}.messages{overflow:auto;padding:16px;display:grid;align-content:start;gap:10px}.messages article{max-width:88%;padding:11px 12px;border-radius:15px;background:#f1ebf7}.messages article.learner{margin-left:auto;background:#6d28d9;color:white}.messages article.broker{background:#edf6ff}.messages article.system{max-width:100%;background:#f4f2f5}.messages small{font-size:7px;font-weight:950}.messages p{margin:4px 0 0;font-size:11px;line-height:1.5}.quickPrompts{display:flex;gap:5px;overflow-x:auto;padding:8px 12px}.quickPrompts button{white-space:nowrap;border:0;border-radius:999px;padding:8px 10px;background:#f2ecf8;color:#654b79;font-size:8px}.ayoDrawer form{display:grid;grid-template-columns:1fr auto;gap:7px;padding:12px;border-top:1px solid #eee6f5}.ayoDrawer input{min-width:0;padding:11px;border:1px solid #ded2e8;border-radius:12px}.ayoDrawer form button{border:0;border-radius:12px;padding:0 15px;background:#6d28d9;color:white;font-weight:900}
.centeredActions{justify-content:center}

.stressShell.loss{
  background:
    radial-gradient(circle at 50% 0%,rgba(184,38,70,.10),transparent 30%),
    #fffafb;
}
.stressShell.gain{
  background:
    radial-gradient(circle at 50% 0%,rgba(20,140,89,.09),transparent 30%),
    #fbfffd;
}
.stressScene{
  width:min(1080px,calc(100% - 36px));
  margin:auto;
  padding:54px 0 90px;
  text-align:center;
}
.stressBadge{
  display:inline-flex;
  padding:7px 11px;
  border-radius:999px;
  background:#211331;
  color:#fff;
  font-size:8px;
  font-weight:950;
  letter-spacing:.13em;
}
.stressScene h1{
  max-width:850px;
  margin:18px auto 12px;
  font-size:clamp(48px,6.5vw,82px);
  line-height:.96;
  letter-spacing:-.06em;
}
.stressMessage{
  max-width:720px;
  margin:0 auto;
  color:#76687f;
  line-height:1.7;
}
.stressNumbers{
  display:flex;
  justify-content:center;
  align-items:center;
  gap:18px;
  flex-wrap:wrap;
  margin:30px 0;
}
.stressNumbers article{
  min-width:180px;
  padding:16px 18px;
  border:1px solid #e9dfea;
  border-radius:17px;
  background:#fff;
}
.stressNumbers article span,
.stressNumbers article strong{
  display:block;
}
.stressNumbers article span{
  color:#988a9e;
  font-size:8px;
  font-weight:950;
}
.stressNumbers article strong{
  margin-top:4px;
  font-size:20px;
}
.stressArrow{
  color:#9f8aaa;
  font-size:24px;
}
.stressMove{
  padding:12px 15px;
  border-radius:999px;
  font-weight:950;
}
.positive{
  color:#148653 !important;
}
.negative{
  color:#c0344f !important;
}
.stressMove.positive{
  background:#e8f8ef;
}
.stressMove.negative{
  background:#fdecef;
}
.stressPortfolioCard,
.resultPortfolio,
.journeyPanel,
.ayoReview{
  margin-top:22px;
  padding:22px;
  border:1px solid #e8deee;
  border-radius:22px;
  background:#fff;
  text-align:left;
}
.stressSectionHead,
.resultSectionHead,
.journeyPanelHead{
  display:flex;
  justify-content:space-between;
  gap:18px;
  align-items:flex-end;
}
.stressSectionHead h2,
.resultSectionHead h2{
  margin:5px 0 0;
  font-size:23px;
  letter-spacing:-.03em;
}
.stressHoldings article,
.resultPortfolio article{
  display:grid;
  grid-template-columns:1.15fr 1fr .75fr;
  gap:14px;
  align-items:center;
  padding:13px 0;
  border-bottom:1px solid #eee7f3;
}
.stressHoldings article:last-child,
.resultPortfolio article:last-child{
  border-bottom:0;
}
.stressAssetName b,
.stressAssetName span,
.stressAssetValue strong,
.stressAssetValue span,
.resultPortfolio article>div:first-child b,
.resultPortfolio article>div:first-child span,
.resultPortfolio article>div:last-child strong{
  display:block;
}
.stressAssetName b,
.resultPortfolio article>div:first-child>b{
  color:#7c3aed;
  font-size:10px;
}
.stressAssetName span{
  color:#72647c;
  font-size:10px;
}
.stressAssetValue,
.resultPortfolio article>div:last-child{
  text-align:right;
}
.resolvePrompt{
  margin:34px auto 14px;
}
.resolvePrompt>span{
  color:#7c3aed;
  font-size:9px;
  font-weight:950;
  letter-spacing:.12em;
}
.resolvePrompt h2{
  margin:6px 0;
  font-size:35px;
  letter-spacing:-.04em;
}
.resolvePrompt p{
  max-width:650px;
  margin:0 auto;
  color:#7b6d85;
  line-height:1.55;
}
.resolveChoices{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:12px;
  margin-top:20px;
}
.resolveChoices button{
  min-height:180px;
  padding:19px;
  text-align:left;
  border:1px solid #e4d9ed;
  border-radius:20px;
  background:#fff;
  color:#211332;
}
.resolveChoices button.selected{
  border-color:#7c3aed;
  box-shadow:0 0 0 3px rgba(124,58,237,.10);
  background:#faf7ff;
}
.resolveChoices b{
  width:32px;
  height:32px;
  display:grid;
  place-items:center;
  border-radius:9px;
  background:#f1ebf7;
  color:#7c3aed;
}
.resolveChoices strong,
.resolveChoices span{
  display:block;
}
.resolveChoices strong{
  margin-top:18px;
  font-size:15px;
}
.resolveChoices span{
  margin-top:5px;
  color:#887a92;
  font-size:10px;
  line-height:1.45;
}
.stressActions{
  display:flex;
  justify-content:center;
  gap:8px;
  flex-wrap:wrap;
  margin-top:18px;
}
.reallocateHint{
  max-width:720px;
  margin:16px auto 0;
  padding:15px;
  display:flex;
  gap:10px;
  align-items:center;
  justify-content:center;
  flex-wrap:wrap;
  border-radius:15px;
  background:#f2ecf8;
  color:#6d587a;
}
.reallocateHint span{
  font-size:10px;
}
.resultWide{
  width:min(1080px,calc(100% - 36px));
}
.resultIntro{
  max-width:700px;
  margin:0 auto 20px;
  color:#776982;
  line-height:1.6;
}
.resultHero{
  display:grid;
  grid-template-columns:230px 1fr;
  gap:18px;
  align-items:stretch;
}
.resultHero .resultOrb{
  margin:0;
  width:230px;
  height:230px;
}
.journeyPanel{
  margin-top:0;
  display:grid;
  align-content:center;
}
.journeyPanelHead strong,
.journeyPanelHead span{
  display:block;
}
.journeyPanelHead>span{
  color:#998ba2;
  font-size:9px;
}
.journeyPanel .spark{
  height:105px;
  margin-top:15px;
}
.journeyLabels{
  display:flex;
  justify-content:space-between;
  gap:4px;
  overflow-x:auto;
  color:#9a8da3;
  font-size:8px;
}
.resultPortfolio{
  margin-top:18px;
}
.resultPortfolio article>div:first-child{
  display:flex;
  gap:10px;
  align-items:center;
}
.resultPortfolio article>div:first-child>b{
  min-width:52px;
}
.resultPortfolio small{
  display:block;
  color:#9a8ca2;
  font-size:8px;
}
.ayoReview{
  background:linear-gradient(145deg,#211331,#38204f);
  color:#fff;
}
.ayoReview>span{
  color:#bea0e2;
  font-size:8px;
  font-weight:950;
  letter-spacing:.1em;
}
.ayoReview p{
  margin:8px 0 0;
  color:#ddcfe6;
  line-height:1.65;
}


.twinFinal{
  width:min(1080px,calc(100% - 36px));
  margin:auto;
  padding:64px 0 100px;
  text-align:center;
}
.twinFinal>h1{
  max-width:920px;
  margin:12px auto 18px;
  font-size:clamp(52px,6.4vw,86px);
  line-height:.94;
  letter-spacing:-.065em;
}
.twinFinal>h1 em{
  color:#7c3aed;
  font-family:Georgia,serif;
  font-weight:400;
}
.twinLead{
  max-width:760px;
  margin:0 auto 34px;
  color:#74667e;
  font-size:16px;
  line-height:1.7;
}
.twinComparison{
  display:grid;
  grid-template-columns:1fr 76px 1fr;
  gap:14px;
  align-items:center;
}
.twinComparison article{
  min-height:240px;
  padding:30px;
  display:grid;
  place-items:center;
  align-content:center;
  border:1px solid #e5d9ee;
  border-radius:26px;
  background:#fff;
}
.twinComparison article.twinCard{
  background:linear-gradient(145deg,#211331,#3a2054);
  color:#fff;
  border:0;
}
.twinComparison span,
.twinComparison strong,
.twinComparison b,
.twinComparison small{
  display:block;
}
.twinComparison span{
  color:#7c3aed;
  font-size:9px;
  font-weight:950;
  letter-spacing:.11em;
}
.twinComparison .twinCard span{
  color:#c5a6e9;
}
.twinComparison strong{
  margin:10px 0 4px;
  font-size:clamp(34px,5vw,54px);
  letter-spacing:-.045em;
}
.twinComparison b{
  font-size:16px;
}
.twinComparison small{
  margin-top:12px;
  color:#95869f;
}
.twinComparison .twinCard small{
  color:#c9b7d6;
}
.versusOrb{
  width:64px;
  height:64px;
  margin:auto;
  display:grid;
  place-items:center;
  border-radius:50%;
  background:#7c3aed;
  color:#fff;
  font-size:12px;
  font-weight:950;
}
.gapCard{
  margin:18px 0;
  padding:26px;
  border-radius:22px;
  background:#f2ecf8;
}
.gapCard span,
.gapCard strong{
  display:block;
}
.gapCard span{
  color:#7c3aed;
  font-size:8px;
  font-weight:950;
  letter-spacing:.12em;
}
.gapCard strong{
  margin-top:5px;
  font-size:35px;
}
.gapCard p{
  max-width:720px;
  margin:8px auto 0;
  color:#6f6079;
  line-height:1.6;
}
.twinPrinciple{
  margin:22px 0;
  padding:30px;
  border:1px solid #e5daed;
  border-radius:24px;
  background:#fff;
}
.twinPrinciple>span{
  color:#7c3aed;
  font-size:8px;
  font-weight:950;
  letter-spacing:.12em;
}
.twinPrinciple h2{
  margin:8px 0;
  font-size:31px;
  letter-spacing:-.04em;
}
.twinPrinciple p{
  max-width:720px;
  margin:auto;
  color:#75677f;
  line-height:1.65;
}
.playbookGate{
  margin-top:22px;
  padding:30px;
  display:grid;
  grid-template-columns:1fr auto;
  gap:24px;
  align-items:center;
  text-align:left;
  border-radius:26px;
  background:linear-gradient(145deg,#211331,#3a2054);
  color:#fff;
}
.playbookGate span{
  color:#c4a3e9;
  font-size:8px;
  font-weight:950;
  letter-spacing:.12em;
}
.playbookGate h2{
  margin:7px 0;
  font-size:30px;
  letter-spacing:-.04em;
}
.playbookGate p{
  max-width:680px;
  margin:0;
  color:#d5c5df;
  line-height:1.6;
}
.playbookReveal{
  margin-top:12px;
  padding:28px;
  text-align:left;
  border:1px solid #e4d8ed;
  border-radius:26px;
  background:#fff;
}
.playbookHead{
  display:flex;
  justify-content:space-between;
  gap:20px;
  align-items:flex-start;
}
.playbookHead h2{
  margin:5px 0 0;
  font-size:30px;
  letter-spacing:-.04em;
}
.playbookHead>b{
  padding:7px 10px;
  border-radius:999px;
  background:#f1eaf8;
  color:#6d28d9;
  font-size:8px;
}
.playbookReveal>p{
  max-width:800px;
  color:#71627b;
  line-height:1.65;
}
.allocationMap{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:8px;
  margin-top:18px;
}
.allocationMap article{
  display:flex;
  justify-content:space-between;
  gap:15px;
  align-items:center;
  padding:14px;
  border-radius:14px;
  background:#f8f4fb;
}
.allocationMap span,
.allocationMap strong{
  display:block;
}
.allocationMap span{
  color:#7c3aed;
  font-size:8px;
  font-weight:950;
}
.allocationMap strong{
  margin-top:2px;
  font-size:11px;
}
.allocationMap b{
  font-size:18px;
}
.ruleCard{
  margin-top:14px;
  padding:17px;
  border-radius:15px;
  background:#ede5f6;
}
.ruleCard span,
.ruleCard strong{
  display:block;
}
.ruleCard span{
  color:#7c3aed;
  font-size:8px;
  font-weight:950;
}
.ruleCard strong{
  margin-top:5px;
  line-height:1.5;
}
.twinTimeline{
  display:grid;
  gap:7px;
  margin-top:16px;
}
.twinTimeline article{
  display:grid;
  grid-template-columns:120px 150px 1fr;
  gap:14px;
  align-items:center;
  padding:13px 14px;
  border:1px solid #eee5f3;
  border-radius:14px;
}
.twinTimeline span{
  color:#7c3aed;
  font-size:8px;
  font-weight:950;
}
.twinTimeline strong{
  font-size:13px;
}
.twinTimeline p{
  margin:0;
  color:#796b83;
  font-size:10px;
  line-height:1.45;
}
.educationLock{
  margin-top:20px;
  padding:22px;
  display:grid;
  grid-template-columns:auto 1fr auto;
  gap:18px;
  align-items:center;
  border-radius:20px;
  background:#211331;
  color:#fff;
}
.lockIcon{
  width:48px;
  height:48px;
  display:grid;
  place-items:center;
  border-radius:14px;
  background:rgba(255,255,255,.09);
  font-size:20px;
}
.educationLock span{
  color:#c4a4e8;
  font-size:8px;
  font-weight:950;
}
.educationLock h3{
  margin:4px 0;
}
.educationLock p{
  margin:0;
  color:#cdbbd9;
  font-size:10px;
  line-height:1.5;
}
:global(.academyCta){
  display:inline-flex;
  padding:12px 16px;
  border-radius:999px;
  background:#7c3aed;
  color:#fff !important;
  text-decoration:none;
  font-size:10px;
  font-weight:950;
}
.finalActions{
  display:flex;
  justify-content:center;
  gap:8px;
  flex-wrap:wrap;
  margin-top:24px;
}
.educationNote{
  margin-top:18px;
  color:#9a8ca2;
  font-size:9px;
}

@media(max-width:1050px){.landing{grid-template-columns:1fr}.journey{max-width:650px}.gameHeader{grid-template-columns:1fr 1fr}.episodeName{display:none}.stats{grid-template-columns:repeat(2,1fr)}.decisionGrid,.marketGrid,.assetGrid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:720px){
.twinFinal{width:calc(100% - 24px);padding-top:36px}
.twinFinal>h1{font-size:46px}
.twinComparison{grid-template-columns:1fr}
.versusOrb{width:52px;height:52px}
.playbookGate{grid-template-columns:1fr}
.playbookGate .primary{width:100%}
.playbookHead{flex-direction:column}
.allocationMap{grid-template-columns:1fr}
.twinTimeline article{grid-template-columns:1fr}
.educationLock{grid-template-columns:1fr}
:global(.academyCta){justify-content:center}

.stressScene,.resultWide{width:calc(100% - 24px)}
.stressScene{padding-top:28px}
.stressScene h1{font-size:42px}
.resolveChoices{grid-template-columns:1fr}
.stressHoldings article,.resultPortfolio article{grid-template-columns:1fr auto}
.stressHoldings article .spark,.resultPortfolio article .spark{display:none}
.resultHero{grid-template-columns:1fr}
.resultHero .resultOrb{width:190px;height:190px;margin:auto}
.stressSectionHead,.resultSectionHead,.journeyPanelHead{align-items:flex-start;flex-direction:column}
.simpleHeader,.gameHeader,.hub,.marketChooser,.marketScene,.portfolio{width:calc(100% - 24px)}.gameHeader{grid-template-columns:1fr;padding:10px 0}.stats{grid-template-columns:repeat(4,1fr);overflow-x:auto}.stats article{min-width:76px}.landing{width:calc(100% - 24px);padding-top:28px}.landing h1{font-size:clamp(46px,14vw,68px)}.journey{display:none}.episodeIntro,.result{width:calc(100% - 24px);padding-top:34px}.episodeIntro h1,.result h1{font-size:clamp(42px,12vw,62px)}.hubHead,.finishBar,.portfolioHead{align-items:flex-start;flex-direction:column}.valuePill{width:100%}.decisionGrid,.marketGrid,.assetGrid{grid-template-columns:1fr}.finishBar button{width:100%}.newsCard{width:calc(100% - 24px);margin:24px auto;padding:25px}.newsCard h1{font-size:40px}.marketHead{grid-template-columns:1fr}.priceLine,.pricePanel{grid-template-columns:1fr}.portfolioRow{grid-template-columns:1fr auto auto}.portfolioRow .spark{display:none}.resultStats{grid-template-columns:repeat(2,1fr)}.modalOverlay{padding:0;place-items:end center}.assetSheet{width:100%;max-height:88vh;border-radius:28px 28px 0 0}.factGrid{grid-template-columns:repeat(2,1fr)}.sheetActions{grid-template-columns:1fr}.drawerOverlay{place-items:end center}.ayoDrawer{width:100%;height:88vh;border-radius:28px 28px 0 0;overflow:hidden}}
`;

