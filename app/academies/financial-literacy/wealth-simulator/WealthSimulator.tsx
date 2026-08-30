"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/app/lib/supabase";

import {
  getAcademySubscriptionAccess,
} from "@/app/fountaintalk/services/subscriptionAccess";

import {
  acceptOffer,
  advanceYear,
  applyLifeEventChoice,
  chooseHousing,
  chooseSpendingLevel,
  chooseTransport,
  continueAfterYearResult,
  createCareerGame,
  createRealLifeGame,
  formatMoney,
  openCurrentYearEvent,
  rebalanceLife,
  totalIncomeEarned,
  totalInvested,
  totalLifestyleSpent,
  totalSaved,
} from "./engine";

import {
  clearWealthGame,
  loadWealthGame,
  saveWealthGame,
} from "./storage";

import type {
  CurrencyCode,
  RealLifeSetup,
  SpendingLevel,
  WealthSimulationState,
} from "./types";

import {
  getLifeEventForYear,
  housingChoices,
  spendingLevels,
  totalHousingCost,
  totalTransportCost,
  transportChoices,
} from "./data";

type OpeningMode =
  | "welcome"
  | "real-life";

const currencies: {
  code: CurrencyCode;
  label: string;
}[] = [
  {
    code: "GBP",
    label: "United Kingdom · GBP",
  },
  {
    code: "USD",
    label: "United States · USD",
  },
  {
    code: "CAD",
    label: "Canada · CAD",
  },
  {
    code: "AUD",
    label: "Australia · AUD",
  },
  {
    code: "NGN",
    label: "Nigeria · NGN",
  },
];

const emptySetup: RealLifeSetup = {
  country: "United Kingdom",
  currency: "GBP",
  annualIncome: 50000,
  incomeType: "gross",
  currentHousingCost: 1000,
  currentTransportCost: 250,
  currentDebtRepayments: 0,
  currentEssentialSpending: 600,
  currentLifestyleSpending: 300,
  startingCashSavings: 5000,
  startingInvestments: 0,
  startingPension: 0,
  startingConsumerDebt: 0,
};

export default function
WealthSimulator() {
  const [
    state,
    setState,
  ] =
    useState<
      WealthSimulationState | null
    >(null);

  const [
    hydrated,
    setHydrated,
  ] = useState(false);

  const [
    openingMode,
    setOpeningMode,
  ] =
    useState<OpeningMode>(
      "welcome",
    );

  const [
    setup,
    setSetup,
  ] =
    useState<RealLifeSetup>(
      emptySetup,
    );

  const [
    rebalanceOpen,
    setRebalanceOpen,
  ] = useState(false);

  const [
    draftHousingId,
    setDraftHousingId,
  ] = useState<string>("");

  const [
    draftTransportId,
    setDraftTransportId,
  ] = useState<string>("");

  const [
    draftSpendingLevel,
    setDraftSpendingLevel,
  ] =
    useState<SpendingLevel>(
      "balanced",
    );

  const [
    draftEmergencyPercent,
    setDraftEmergencyPercent,
  ] = useState(25);

  const [
    draftInvestPercent,
    setDraftInvestPercent,
  ] = useState(35);

  const [
    twinAccessState,
    setTwinAccessState,
  ] =
    useState<
      | "checking"
      | "signed-out"
      | "subscription-required"
      | "unlocked"
    >("checking");

  const [
    twinPlaybookOpen,
    setTwinPlaybookOpen,
  ] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadTwinAccess() {
      try {
        /*
         getSession is intentional here.

         We only need to know whether a browser session
         exists before asking the existing academy access
         service for subscription details. This avoids
         creating another competing auth refresh during
         initial render.
        */
        const {
          data: { session },
        } =
          await supabase.auth.getSession();

        if (cancelled) {
          return;
        }

        if (!session?.user) {
          setTwinAccessState(
            "signed-out",
          );
          return;
        }

        const access =
          await getAcademySubscriptionAccess(
            null,
          );

        if (cancelled) {
          return;
        }

        const activeStatus =
          access.status === "active" ||
          access.status ===
            "trialing";

        const paidPlan =
          Boolean(
            access.plan &&
              access.plan.id !==
                "free",
          );

        setTwinAccessState(
          activeStatus && paidPlan
            ? "unlocked"
            : "subscription-required",
        );
      } catch (error) {
        console.error(
          "Unable to check Twin Playbook access:",
          error,
        );

        if (!cancelled) {
          setTwinAccessState(
            "subscription-required",
          );
        }
      }
    }

    void loadTwinAccess();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const saved =
      loadWealthGame();

    if (saved) {
      setState(saved);
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (
      !hydrated ||
      !state
    ) {
      return;
    }

    saveWealthGame(state);
  }, [
    state,
    hydrated,
  ]);

  function updateSetup<
    K extends keyof RealLifeSetup,
  >(
    key: K,
    value: RealLifeSetup[K],
  ) {
    setSetup(
      (current) => ({
        ...current,
        [key]: value,
      }),
    );
  }

  function startCareer() {
    clearWealthGame();

    setState(
      createCareerGame(),
    );
  }

  function startRealLife() {
    if (
      setup.annualIncome <= 0
    ) {
      return;
    }

    clearWealthGame();

    setState(
      createRealLifeGame(
        setup,
      ),
    );
  }

  function restart() {
    clearWealthGame();

    setState(null);

    setOpeningMode(
      "welcome",
    );
  }

  function openRebalance(
    current:
      WealthSimulationState,
  ) {
    const monthlyTakeHome =
      current.annualTakeHomeIncome /
      12;

    const remaining =
      Math.max(
        0,
        monthlyTakeHome -
          current.monthlyExpenses
            .total,
      );

    setDraftHousingId(
      current.housing?.id ?? "",
    );

    setDraftTransportId(
      current.transport?.id ?? "",
    );

    setDraftSpendingLevel(
      current.spendingLevel,
    );

    setDraftEmergencyPercent(
      remaining > 0
        ? Math.round(
            (
              current
                .monthlyAllocation
                .emergencySavings /
              remaining
            ) * 100,
          )
        : 25,
    );

    setDraftInvestPercent(
      remaining > 0
        ? Math.round(
            (
              current
                .monthlyAllocation
                .investing /
              remaining
            ) * 100,
          )
        : 35,
    );

    setRebalanceOpen(true);
  }

  function applyRebalance(
    current:
      WealthSimulationState,
  ) {
    const housing =
      housingChoices.find(
        (item) =>
          item.id ===
          draftHousingId,
      ) ??
      current.housing;

    const transport =
      transportChoices.find(
        (item) =>
          item.id ===
          draftTransportId,
      ) ??
      current.transport;

    setState(
      rebalanceLife(
        current,
        {
          housing,
          transport,
          spendingLevel:
            draftSpendingLevel,
          emergencySavingsPercent:
            draftEmergencyPercent /
            100,
          investingPercent:
            draftInvestPercent /
            100,
        },
      ),
    );

    setRebalanceOpen(false);
  }

  if (!hydrated) {
    return (
      <main className="loading">
        Preparing your financial
        life...
      </main>
    );
  }

  /*
   ============================================
   ACTIVE GAME PLACEHOLDER

   Next stage replaces this with the actual
   offer-letter / housing / transport /
   payday gameplay.
   ============================================
  */

  if (state) {
  /*
   ============================================
   CAREER OFFER
   ============================================
  */

  if (
    state.mode === "career" &&
    state.stage === "offer" &&
    state.careerOffer
  ) {
    const offer =
      state.careerOffer;

    return (
      <main className="gameShell">
        <header className="gameHeader">
          <div>
            <span>
              FOUNTAINPREP
            </span>

            <strong>
              Life & Wealth Simulator
            </strong>
          </div>

          <button
            onClick={restart}
          >
            Start again
          </button>
        </header>

        <section className="decisionScene">
          <span className="eyebrow">
            YOUR FINANCIAL LIFE BEGINS
          </span>

          <h1>
            You've got an offer.
          </h1>

          <p className="sceneIntro">
            Before you can make money
            decisions, you need money
            coming in.
          </p>

          <div className="offerEnvelope">
            <div className="offerTop">
              <div>
                <span>
                  NORTHSTAR GROUP
                </span>

                <strong>
                  Employment Offer
                </strong>
              </div>

              <div className="offerStamp">
                OFFER
              </div>
            </div>

            <p>
              Dear Candidate,
            </p>

            <p>
              We are pleased to offer
              you the position of:
            </p>

            <h2>
              {offer.title}
            </h2>

            <div className="offerGrid">
              <div>
                <span>
                  COMPANY
                </span>

                <strong>
                  {offer.company}
                </strong>
              </div>

              <div>
                <span>
                  LOCATION
                </span>

                <strong>
                  {offer.location}
                </strong>
              </div>

              <div>
                <span>
                  ANNUAL SALARY
                </span>

                <strong>
                  {formatMoney(
                    offer.annualGrossSalary,
                    state.currency,
                  )}
                </strong>
              </div>

              <div>
                <span>
                  PENSION
                </span>

                <strong>
                  {Math.round(
                    offer.pensionContributionRate *
                      100,
                  )}
                  %
                </strong>
              </div>
            </div>

            <p className="offerDescription">
              {offer.description}
            </p>

            <div className="offerActions">
              <button
                className="primary"
                onClick={() =>
                  setState(
                    acceptOffer(
                      state,
                    ),
                  )
                }
              >
                Accept offer →
              </button>

              <button
                className="secondary"
                onClick={restart}
              >
                Decline
              </button>
            </div>
          </div>

          <p className="learningNote">
            Your gross salary is not
            the amount that reaches
            your bank account. Taxes,
            National Insurance and
            pension contributions come
            first.
          </p>
        </section>

        <style jsx>
          {styles}
        </style>
      </main>
    );
  }

  /*
   ============================================
   HOUSING
   ============================================
  */

  if (
    state.mode === "career" &&
    state.stage === "housing"
  ) {
    return (
      <main className="gameShell">
        <header className="gameHeader">
          <div>
            <span>
              YEAR 1
            </span>

            <strong>
              Where will you live?
            </strong>
          </div>

          <div className="headerMoney">
            <span>
              GROSS INCOME
            </span>

            <strong>
              {formatMoney(
                state.annualGrossIncome,
                state.currency,
              )}
            </strong>
          </div>
        </header>

        <section className="decisionScene wideScene">
          <span className="eyebrow">
            DECISION 01 · HOUSING
          </span>

          <h1>
            Where will you live?
          </h1>

          <p className="sceneIntro">
            Housing is often the
            biggest recurring expense.
            Choose the lifestyle you
            want — then see the real
            monthly cost.
          </p>

          <div className="choiceGrid">
            {housingChoices.map(
              (choice) => {
                const total =
                  totalHousingCost(
                    choice,
                  );

                return (
                  <button
                    className="choiceCard"
                    key={choice.id}
                    onClick={() =>
                      setState(
                        chooseHousing(
                          state,
                          choice,
                        ),
                      )
                    }
                  >
                    <div className="choiceVisual housingVisual">
                      <span>
                        {choice.id ===
                        "family"
                          ? "🏠"
                          : choice.id ===
                              "house-share"
                            ? "🏘️"
                            : choice.id ===
                                "basic-flat"
                              ? "🏢"
                              : choice.id ===
                                  "premium-flat"
                                ? "🌆"
                                : "🔑"}
                      </span>
                    </div>

                    <small>
                      {choice.subtitle}
                    </small>

                    <h2>
                      {choice.title}
                    </h2>

                    <p>
                      {choice.description}
                    </p>

                    <div className="choicePrice">
                      <span>
                        ACTUAL MONTHLY COST
                      </span>

                      <strong>
                        {formatMoney(
                          total,
                          state.currency,
                        )}
                      </strong>
                    </div>

                    {choice.depositRequired >
                    0 ? (
                      <div className="choiceMeta">
                        Deposit{" "}
                        {formatMoney(
                          choice.depositRequired,
                          state.currency,
                        )}
                      </div>
                    ) : null}

                    <b className="selectText">
                      Choose this →
                    </b>
                  </button>
                );
              },
            )}
          </div>
        </section>

        <style jsx>
          {styles}
        </style>
      </main>
    );
  }

  /*
   ============================================
   TRANSPORT
   ============================================
  */

  if (
    state.mode === "career" &&
    state.stage === "transport"
  ) {
    return (
      <main className="gameShell">
        <header className="gameHeader">
          <div>
            <span>
              YEAR 1
            </span>

            <strong>
              Transport decision
            </strong>
          </div>

          <div className="headerMoney">
            <span>
              HOUSING
            </span>

            <strong>
              {state.housing?.title}
            </strong>
          </div>
        </header>

        <section className="decisionScene wideScene">
          <span className="eyebrow">
            DECISION 02 · TRANSPORT
          </span>

          <h1>
            Do you want a car?
          </h1>

          <p className="sceneIntro">
            A car's purchase price is
            only part of the cost.
            Finance, insurance, fuel,
            tax and maintenance all
            follow you every month.
          </p>

          <div className="choiceGrid">
            {transportChoices.map(
              (choice) => {
                const total =
                  totalTransportCost(
                    choice,
                  );

                return (
                  <button
                    className="choiceCard"
                    key={choice.id}
                    onClick={() =>
                      setState(
                        chooseTransport(
                          state,
                          choice,
                        ),
                      )
                    }
                  >
                    <div className="choiceVisual">
                      <span>
                        {choice.id ===
                        "public"
                          ? "🚆"
                          : choice.id ===
                              "used-car"
                            ? "🚗"
                            : choice.id ===
                                "new-car"
                              ? "🚘"
                              : "🏎️"}
                      </span>
                    </div>

                    <small>
                      {choice.subtitle}
                    </small>

                    <h2>
                      {choice.title}
                    </h2>

                    <p>
                      {choice.description}
                    </p>

                    {choice.purchasePrice >
                    0 ? (
                      <div className="carPrice">
                        Purchase price{" "}
                        {formatMoney(
                          choice.purchasePrice,
                          state.currency,
                        )}
                      </div>
                    ) : null}

                    <div className="choicePrice">
                      <span>
                        TRUE MONTHLY COST
                      </span>

                      <strong>
                        {formatMoney(
                          total,
                          state.currency,
                        )}
                      </strong>
                    </div>

                    <b className="selectText">
                      Choose this →
                    </b>
                  </button>
                );
              },
            )}
          </div>
        </section>

        <style jsx>
          {styles}
        </style>
      </main>
    );
  }

  /*
   ============================================
   BUDGET / LIFESTYLE
   ============================================
  */

  if (
    state.stage === "budget"
  ) {
    const monthlyTakeHome =
      state.annualTakeHomeIncome /
      12;

    return (
      <main className="gameShell">
        <header className="gameHeader">
          <div>
            <span>
              YEAR 1
            </span>

            <strong>
              Build your monthly life
            </strong>
          </div>

          <div className="headerMoney">
            <span>
              EST. TAKE-HOME / MONTH
            </span>

            <strong>
              {formatMoney(
                monthlyTakeHome,
                state.currency,
              )}
            </strong>
          </div>
        </header>

        <section className="decisionScene wideScene">
          <span className="eyebrow">
            DECISION 03 · LIFESTYLE
          </span>

          <h1>
            How do you want to live?
          </h1>

          <p className="sceneIntro">
            This affects food,
            subscriptions, shopping,
            entertainment, eating out
            and other everyday choices.
          </p>

          {state.mode === "career" ? (
            <div className="budgetSummary">
              <article>
                <span>
                  TAKE-HOME
                </span>

                <strong>
                  {formatMoney(
                    monthlyTakeHome,
                    state.currency,
                  )}
                </strong>
              </article>

              <article>
                <span>
                  HOUSING
                </span>

                <strong>
                  {formatMoney(
                    state.monthlyExpenses
                      .housing,
                    state.currency,
                  )}
                </strong>
              </article>

              <article>
                <span>
                  TRANSPORT
                </span>

                <strong>
                  {formatMoney(
                    state.monthlyExpenses
                      .transport,
                    state.currency,
                  )}
                </strong>
              </article>
            </div>
          ) : null}

          <div className="lifestyleGrid">
            {(
              Object.keys(
                spendingLevels,
              ) as SpendingLevel[]
            ).map((level) => {
              const option =
                spendingLevels[
                  level
                ];

              return (
                <button
                  key={level}
                  className="lifestyleCard"
                  onClick={() =>
                    setState(
                      chooseSpendingLevel(
                        state,
                        level,
                      ),
                    )
                  }
                >
                  <span className="lifestyleLabel">
                    {level.toUpperCase()}
                  </span>

                  <h2>
                    {option.title}
                  </h2>

                  <p>
                    {option.description}
                  </p>

                  <div>
                    <span>
                      Essentials
                    </span>

                    <strong>
                      {formatMoney(
                        option.essentials,
                        state.currency,
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Lifestyle
                    </span>

                    <strong>
                      {formatMoney(
                        option.lifestyle,
                        state.currency,
                      )}
                    </strong>
                  </div>

                  <b>
                    Choose lifestyle →
                  </b>
                </button>
              );
            })}
          </div>
        </section>

        <style jsx>
          {styles}
        </style>
      </main>
    );
  }

  /*
   ============================================
   LIFE EVENT
   ============================================
  */

  if (
    state.stage === "event" &&
    state.activeEvent
  ) {
    const event =
      state.activeEvent;

    return (
      <main className="gameShell">
        <header className="gameHeader">
          <div>
            <span>
              YEAR {state.currentYear}
            </span>

            <strong>
              Life happens
            </strong>
          </div>

          <div className="headerMoney">
            <span>
              CURRENT NET WORTH
            </span>

            <strong>
              {formatMoney(
                state.position.netWorth,
                state.currency,
              )}
            </strong>
          </div>
        </header>

        <section className="eventScene">
          <div className="eventPulse">
            <span>
              YEAR {state.currentYear}
            </span>
          </div>

          <span className="eyebrow">
            LIFE EVENT
          </span>

          <h1>
            {event.headline}
          </h1>

          <p className="eventIntro">
            {event.description}
          </p>

          <div className="eventChoices">
            {event.choices.map(
              (
                choice,
                index,
              ) => (
                <button
                  key={choice.id}
                  className="eventChoice"
                  onClick={() =>
                    setState(
                      applyLifeEventChoice(
                        state,
                        choice,
                      ),
                    )
                  }
                >
                  <span className="choiceLetter">
                    {String.fromCharCode(
                      65 + index,
                    )}
                  </span>

                  <div>
                    <strong>
                      {choice.title}
                    </strong>

                    <p>
                      {choice.description}
                    </p>
                  </div>

                  <span className="eventArrow">
                    →
                  </span>
                </button>
              ),
            )}
          </div>

          <div className="eventLearning">
            <span>
              WHAT THIS TESTS
            </span>

            <p>
              {event.learningPoint}
            </p>
          </div>
        </section>

        <style jsx>
          {styles}
        </style>
      </main>
    );
  }

  /*
   ============================================
   YEAR RESULT
   ============================================
  */

  if (
    state.stage ===
      "year-result" &&
    state.history.length > 0
  ) {
    const result =
      state.history[
        state.history.length - 1
      ];

    const completedYear =
      result.year;

    const previousNetWorth =
      state.history.length > 1
        ? state.history[
            state.history.length - 2
          ].netWorth
        : 0;

    const wealthChange =
      result.netWorth -
      previousNetWorth;

    return (
      <main className="gameShell">
        <header className="gameHeader">
          <div>
            <span>
              YEAR {completedYear}
              {" "}COMPLETE
            </span>

            <strong>
              Your annual statement
            </strong>
          </div>

          <div className="headerMoney">
            <span>
              NEXT
            </span>

            <strong>
              Year {state.currentYear}
            </strong>
          </div>
        </header>

        <section className="yearResultScene">
          <span className="eyebrow">
            ONE YEAR LATER
          </span>

          <h1>
            This is what your
            choices produced.
          </h1>

          <p className="yearResultIntro">
            You earned money,
            lived your life and made
            financial decisions for
            twelve months.
          </p>

          <div className="netWorthOrb">
            <span>
              NET WORTH
            </span>

            <strong>
              {formatMoney(
                result.netWorth,
                state.currency,
              )}
            </strong>

            <b
              className={
                wealthChange >= 0
                  ? "wealthUp"
                  : "wealthDown"
              }
            >
              {wealthChange >= 0
                ? "+"
                : ""}
              {formatMoney(
                wealthChange,
                state.currency,
              )}
              {" "}this year
            </b>
          </div>

          <div className="annualStatement">
            <article>
              <span>
                GROSS INCOME
              </span>

              <strong>
                {formatMoney(
                  result.annualGrossIncome,
                  state.currency,
                )}
              </strong>
            </article>

            <article>
              <span>
                TAKE-HOME
              </span>

              <strong>
                {formatMoney(
                  result.annualTakeHomeIncome,
                  state.currency,
                )}
              </strong>
            </article>

            <article>
              <span>
                LIVING COSTS
              </span>

              <strong>
                {formatMoney(
                  result.annualExpenses,
                  state.currency,
                )}
              </strong>
            </article>

            <article>
              <span>
                SAVED
              </span>

              <strong>
                {formatMoney(
                  result.annualSavings,
                  state.currency,
                )}
              </strong>
            </article>

            <article>
              <span>
                INVESTED
              </span>

              <strong>
                {formatMoney(
                  result.annualInvestments,
                  state.currency,
                )}
              </strong>
            </article>

            <article>
              <span>
                CONSUMER DEBT
              </span>

              <strong>
                {formatMoney(
                  result.consumerDebt,
                  state.currency,
                )}
              </strong>
            </article>
          </div>

          <div className="wealthBreakdown">
            <div>
              <span>
                CASH
              </span>

              <strong>
                {formatMoney(
                  result.cash,
                  state.currency,
                )}
              </strong>
            </div>

            <div>
              <span>
                EMERGENCY FUND
              </span>

              <strong>
                {formatMoney(
                  result.emergencyFund,
                  state.currency,
                )}
              </strong>
            </div>

            <div>
              <span>
                INVESTMENTS
              </span>

              <strong>
                {formatMoney(
                  result.investments,
                  state.currency,
                )}
              </strong>
            </div>

            <div>
              <span>
                PENSION
              </span>

              <strong>
                {formatMoney(
                  result.pension,
                  state.currency,
                )}
              </strong>
            </div>
          </div>

          <div className="twinTeaser">
            <span>
              YOUR FINANCIAL TWIN
            </span>

            <h2>
              Your Twin has also
              completed Year{" "}
              {completedYear}.
            </h2>

            <p>
              Same income. Same
              economic environment.
              Different allocation
              decisions.
            </p>

            <strong>
              Their net worth remains
              hidden until the final
              reveal.
            </strong>
          </div>

          <div className="courseCorrect">
            <span>
              COURSE-CORRECTION
              CHECKPOINT
            </span>

            <h2>
              People change their
              minds. Your plan can
              change too.
            </h2>

            <p>
              Before Year{" "}
              {state.currentYear},
              you can move home,
              change or sell your car,
              adjust your lifestyle,
              save more or less, and
              increase or reduce how
              much of your spare cash
              you invest.
            </p>

            <div className="courseCorrectActions">
              <button
                className="secondary"
                onClick={() =>
                  openRebalance(
                    state,
                  )
                }
              >
                Rebalance my life
              </button>

              <button
                className="primary continueYearButton"
                onClick={() => {
                  setRebalanceOpen(
                    false,
                  );

                  setState(
                    continueAfterYearResult(
                      state,
                    ),
                  );
                }}
              >
                Keep my plan &
                continue →
              </button>
            </div>
          </div>

          {rebalanceOpen ? (
            <div className="rebalancePanel">
              <div className="rebalanceTop">
                <div>
                  <span>
                    PLAN YEAR{" "}
                    {state.currentYear}
                  </span>

                  <h2>
                    Rebalance your
                    financial life
                  </h2>

                  <p>
                    Change only what
                    you want. Everything
                    else stays as it is.
                  </p>
                </div>

                <button
                  className="closeRebalance"
                  onClick={() =>
                    setRebalanceOpen(
                      false,
                    )
                  }
                >
                  ×
                </button>
              </div>

              <div className="rebalanceGrid">
                <section>
                  <label>
                    Housing
                  </label>

                  <select
                    value={
                      draftHousingId
                    }
                    onChange={(event) =>
                      setDraftHousingId(
                        event.target
                          .value,
                      )
                    }
                  >
                    {housingChoices.map(
                      (choice) => (
                        <option
                          key={
                            choice.id
                          }
                          value={
                            choice.id
                          }
                        >
                          {choice.title} ·{" "}
                          {formatMoney(
                            totalHousingCost(
                              choice,
                            ),
                            state.currency,
                          )}
                          /month
                        </option>
                      ),
                    )}
                  </select>

                  <small>
                    Moving may involve
                    a new deposit and a
                    small simulated
                    moving cost.
                  </small>
                </section>

                <section>
                  <label>
                    Transport
                  </label>

                  <select
                    value={
                      draftTransportId
                    }
                    onChange={(event) =>
                      setDraftTransportId(
                        event.target
                          .value,
                      )
                    }
                  >
                    {transportChoices.map(
                      (choice) => (
                        <option
                          key={
                            choice.id
                          }
                          value={
                            choice.id
                          }
                        >
                          {choice.title} ·{" "}
                          {formatMoney(
                            totalTransportCost(
                              choice,
                            ),
                            state.currency,
                          )}
                          /month
                        </option>
                      ),
                    )}
                  </select>

                  <small>
                    Switching away
                    from a car is
                    treated as a
                    simplified sale /
                    exit from the old
                    commitment.
                  </small>
                </section>

                <section>
                  <label>
                    Lifestyle
                  </label>

                  <select
                    value={
                      draftSpendingLevel
                    }
                    onChange={(event) =>
                      setDraftSpendingLevel(
                        event.target
                          .value as
                          SpendingLevel,
                      )
                    }
                  >
                    {(
                      Object.keys(
                        spendingLevels,
                      ) as
                        SpendingLevel[]
                    ).map(
                      (level) => (
                        <option
                          key={level}
                          value={level}
                        >
                          {
                            spendingLevels[
                              level
                            ].title
                          }
                        </option>
                      ),
                    )}
                  </select>

                  <small>
                    This changes
                    everyday essentials
                    and lifestyle
                    spending.
                  </small>
                </section>

                <section className="allocationControl">
                  <div className="allocationControlTop">
                    <label>
                      Emergency savings
                    </label>

                    <strong>
                      {
                        draftEmergencyPercent
                      }
                      %
                    </strong>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={
                      draftEmergencyPercent
                    }
                    onChange={(event) =>
                      setDraftEmergencyPercent(
                        Number(
                          event.target
                            .value,
                        ),
                      )
                    }
                  />

                  <small>
                    Share of money left
                    after monthly
                    living costs.
                  </small>
                </section>

                <section className="allocationControl">
                  <div className="allocationControlTop">
                    <label>
                      Investing
                    </label>

                    <strong>
                      {
                        draftInvestPercent
                      }
                      %
                    </strong>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={
                      draftInvestPercent
                    }
                    onChange={(event) =>
                      setDraftInvestPercent(
                        Number(
                          event.target
                            .value,
                        ),
                      )
                    }
                  />

                  <small>
                    Increase or reduce
                    this whenever your
                    priorities change.
                  </small>
                </section>

                <section className="allocationSummary">
                  <span>
                    SURPLUS ALLOCATION
                  </span>

                  <strong>
                    {
                      draftEmergencyPercent +
                      draftInvestPercent
                    }
                    %
                  </strong>

                  <p>
                    If saving and
                    investing together
                    exceed 100%, the
                    engine scales them
                    proportionally so
                    you cannot allocate
                    money you do not
                    have.
                  </p>
                </section>
              </div>

              <div className="rebalanceActions">
                <button
                  className="secondary"
                  onClick={() =>
                    setRebalanceOpen(
                      false,
                    )
                  }
                >
                  Cancel
                </button>

                <button
                  className="primary"
                  onClick={() =>
                    applyRebalance(
                      state,
                    )
                  }
                >
                  Save new plan
                </button>
              </div>
            </div>
          ) : null}
        </section>

        <style jsx>
          {styles}
        </style>
      </main>
    );
  }

  /*
   ============================================
   FIRST PAYDAY / YEAR
   ============================================
  */

  if (
    state.stage === "year"
  ) {
    const monthlyTakeHome =
      state.annualTakeHomeIncome /
      12;

    const remaining =
      Math.max(
        0,
        monthlyTakeHome -
          state.monthlyExpenses.total,
      );

    return (
      <main className="gameShell">
        <header className="gameHeader">
          <div>
            <span>
              YEAR {state.currentYear}
            </span>

            <strong>
              Your financial life
            </strong>
          </div>

          <div className="headerMoney">
            <span>
              NET WORTH
            </span>

            <strong>
              {formatMoney(
                state.position.netWorth,
                state.currency,
              )}
            </strong>
          </div>
        </header>

        <section className="paydayScene">
          <span className="eyebrow">
            PAYDAY
          </span>

          <h1>
            Your salary arrived.
          </h1>

          <div className="salaryDeposit">
            <span>
              SALARY PAID
            </span>

            <strong>
              +
              {formatMoney(
                monthlyTakeHome,
                state.currency,
              )}
            </strong>
          </div>

          <div className="moneyFlow">
            <div>
              <span>
                Housing
              </span>

              <strong>
                -
                {formatMoney(
                  state.monthlyExpenses
                    .housing,
                  state.currency,
                )}
              </strong>
            </div>

            <div>
              <span>
                Transport
              </span>

              <strong>
                -
                {formatMoney(
                  state.monthlyExpenses
                    .transport,
                  state.currency,
                )}
              </strong>
            </div>

            <div>
              <span>
                Essentials
              </span>

              <strong>
                -
                {formatMoney(
                  state.monthlyExpenses
                    .essentials,
                  state.currency,
                )}
              </strong>
            </div>

            <div>
              <span>
                Lifestyle
              </span>

              <strong>
                -
                {formatMoney(
                  state.monthlyExpenses
                    .lifestyle,
                  state.currency,
                )}
              </strong>
            </div>
          </div>

          <div className="remainingMoney">
            <span>
              MONEY LEFT THIS MONTH
            </span>

            <strong>
              {formatMoney(
                remaining,
                state.currency,
              )}
            </strong>

            <p>
              This is where financial
              lives begin to separate.
              What happens to the money
              left after living costs?
            </p>
          </div>

          <div className="allocationPreview">
            <div>
              <span>
                Emergency savings
              </span>

              <strong>
                {formatMoney(
                  state.monthlyAllocation
                    .emergencySavings,
                  state.currency,
                )}
              </strong>
            </div>

            <div>
              <span>
                Investing
              </span>

              <strong>
                {formatMoney(
                  state.monthlyAllocation
                    .investing,
                  state.currency,
                )}
              </strong>
            </div>

            <div>
              <span>
                Cash remaining
              </span>

              <strong>
                {formatMoney(
                  state.monthlyAllocation
                    .unallocated,
                  state.currency,
                )}
              </strong>
            </div>
          </div>

          {(() => {
            const currentEvent =
              getLifeEventForYear(
                state.currentYear,
              );

            const eventAlreadyCompleted =
              currentEvent
                ? state.completedEvents.includes(
                    currentEvent.id,
                  )
                : true;

            if (
              !eventAlreadyCompleted
            ) {
              return (
                <button
                  className="primary advanceButton"
                  onClick={() =>
                    setState(
                      openCurrentYearEvent(
                        state,
                      ),
                    )
                  }
                >
                  See what Year{" "}
                  {state.currentYear}{" "}
                  brings →
                </button>
              );
            }

            return (
              <button
                className="primary advanceButton"
                onClick={() =>
                  setState(
                    advanceYear(
                      state,
                    ),
                  )
                }
              >
                Simulate Year{" "}
                {state.currentYear} →
              </button>
            );
          })()}
        </section>

        <style jsx>
          {styles}
        </style>
      </main>
    );
  }

  /*
   ============================================
   FINAL RESULT
   ============================================
  */

  if (
    state.stage === "final-result"
  ) {
    const learnerNetWorth =
      state.position.netWorth;

    const twinNetWorth =
      state.twin.position.netWorth;

    const gap =
      twinNetWorth -
      learnerNetWorth;

    const learnerWon =
      learnerNetWorth >
      twinNetWorth;

    const tied =
      learnerNetWorth ===
      twinNetWorth;

    const learnerIncome =
      totalIncomeEarned(
        state.history,
      );

    const twinIncome =
      totalIncomeEarned(
        state.twin.history,
      );

    const learnerInvested =
      totalInvested(
        state.history,
      );

    const twinInvested =
      totalInvested(
        state.twin.history,
      );

    const learnerSaved =
      totalSaved(
        state.history,
      );

    const twinSaved =
      totalSaved(
        state.twin.history,
      );

    const learnerLifestyle =
      totalLifestyleSpent(
        state.history,
      );

    const twinLifestyle =
      totalLifestyleSpent(
        state.twin.history,
      );

    const profileLabels:
      Record<
        string,
        {
          title: string;
          description: string;
        }
      > = {
        "future-focused-investor":
          {
            title:
              "Future-Focused Investor",
            description:
              "You consistently directed meaningful cash flow toward long-term assets and compounding.",
          },

        "balanced-builder": {
          title:
            "Balanced Builder",
          description:
            "You generally balanced present-day living with saving, investing and financial resilience.",
        },

        "cautious-saver": {
          title:
            "Cautious Saver",
          description:
            "You protected cash well, but could potentially put more long-term money to productive use.",
        },

        "lifestyle-maximiser":
          {
            title:
              "Lifestyle Maximiser",
            description:
              "You prioritised present-day lifestyle. The simulation shows what that trade-off can mean over time.",
          },

        "financially-stretched-earner":
          {
            title:
              "Financially Stretched Earner",
            description:
              "A high share of income was absorbed by fixed costs, lifestyle or debt, leaving less room for resilience and compounding.",
          },
      };

    const profile =
      state.financialProfile
        ? profileLabels[
            state.financialProfile
          ]
        : null;

    const scoreAverage =
      Math.round(
        (
          state.scores
            .resilience +
          state.scores
            .debtManagement +
          state.scores
            .savingConsistency +
          state.scores
            .investmentBehaviour +
          state.scores
            .lifestyleSustainability
        ) / 5,
      );

    return (
      <main className="gameShell">
        <header className="gameHeader">
          <div>
            <span>
              10 YEARS COMPLETE
            </span>

            <strong>
              Your final wealth review
            </strong>
          </div>

          <button
            onClick={restart}
          >
            Start again
          </button>
        </header>

        <section className="finalScene">
          <span className="eyebrow">
            THE FINAL REVEAL
          </span>

          <h1>
            Ten years later.
            <br />
            <em>
              Here is where your
              choices led.
            </em>
          </h1>

          <p className="finalIntro">
            You and your Financial
            Twin began with the same
            starting point. The
            difference came from how
            money was allocated,
            protected and compounded
            over time.
          </p>

          <div className="finalComparison">
            <article
              className={
                learnerWon
                  ? "resultCard winnerCard"
                  : "resultCard"
              }
            >
              <span>
                YOUR RESULT
              </span>

              <h2>
                You
              </h2>

              <strong>
                {formatMoney(
                  learnerNetWorth,
                  state.currency,
                )}
              </strong>

              <p>
                Final net worth after
                10 years
              </p>

              {learnerWon ? (
                <b>
                  You finished ahead
                </b>
              ) : null}
            </article>

            <div className="comparisonVs">
              VS
            </div>

            <article
              className={
                !learnerWon &&
                !tied
                  ? "resultCard twinResult winnerCard"
                  : "resultCard twinResult"
              }
            >
              <span>
                FINANCIAL TWIN
              </span>

              <h2>
                Your Twin
              </h2>

              <strong>
                {formatMoney(
                  twinNetWorth,
                  state.currency,
                )}
              </strong>

              <p>
                Same income journey,
                different allocation
              </p>

              {!learnerWon &&
              !tied ? (
                <b>
                  Twin finished ahead
                </b>
              ) : null}
            </article>
          </div>

          <div
            className={
              gap === 0
                ? "gapBanner neutralGap"
                : learnerWon
                  ? "gapBanner positiveGap"
                  : "gapBanner"
            }
          >
            <span>
              WEALTH GAP
            </span>

            <strong>
              {tied
                ? "You finished level."
                : learnerWon
                  ? `You finished ${formatMoney(
                      Math.abs(
                        gap,
                      ),
                      state.currency,
                    )} ahead.`
                  : `Your Twin finished ${formatMoney(
                      Math.abs(
                        gap,
                      ),
                      state.currency,
                    )} ahead.`}
            </strong>

            <p>
              This gap is not a score
              of who lived better.
              It is a picture of the
              financial trade-offs
              created by different
              choices.
            </p>
          </div>

          <div className="finalStats">
            <article>
              <span>
                TOTAL INCOME
              </span>

              <strong>
                {formatMoney(
                  learnerIncome,
                  state.currency,
                )}
              </strong>

              <small>
                Twin:{" "}
                {formatMoney(
                  twinIncome,
                  state.currency,
                )}
              </small>
            </article>

            <article>
              <span>
                TOTAL INVESTED
              </span>

              <strong>
                {formatMoney(
                  learnerInvested,
                  state.currency,
                )}
              </strong>

              <small>
                Twin:{" "}
                {formatMoney(
                  twinInvested,
                  state.currency,
                )}
              </small>
            </article>

            <article>
              <span>
                TOTAL SAVED
              </span>

              <strong>
                {formatMoney(
                  learnerSaved,
                  state.currency,
                )}
              </strong>

              <small>
                Twin:{" "}
                {formatMoney(
                  twinSaved,
                  state.currency,
                )}
              </small>
            </article>

            <article>
              <span>
                LIFESTYLE SPEND
              </span>

              <strong>
                {formatMoney(
                  learnerLifestyle,
                  state.currency,
                )}
              </strong>

              <small>
                Twin:{" "}
                {formatMoney(
                  twinLifestyle,
                  state.currency,
                )}
              </small>
            </article>
          </div>

          <section className="whyGap">
            <span className="eyebrow">
              WHY THE OUTCOMES
              DIVERGED
            </span>

            <h2>
              Small monthly choices
              became large long-term
              differences.
            </h2>

            <div className="driverGrid">
              <article>
                <div>
                  🏠
                </div>

                <h3>
                  Housing
                </h3>

                <p>
                  Housing can either
                  preserve monthly
                  flexibility or absorb
                  a large share of
                  take-home income.
                </p>
              </article>

              <article>
                <div>
                  🚘
                </div>

                <h3>
                  Transport
                </h3>

                <p>
                  The real cost of a
                  car includes finance,
                  fuel, insurance,
                  maintenance and the
                  opportunity cost of
                  that cash flow.
                </p>
              </article>

              <article>
                <div>
                  💳
                </div>

                <h3>
                  Debt
                </h3>

                <p>
                  High-interest debt
                  competes directly
                  with saving and
                  investing for every
                  pound of surplus.
                </p>
              </article>

              <article>
                <div>
                  📈
                </div>

                <h3>
                  Investing
                </h3>

                <p>
                  Consistent investing
                  gives time and
                  compounding more
                  opportunity to work.
                </p>
              </article>
            </div>
          </section>

          <section className="profilePanel">
            <div>
              <span className="eyebrow">
                YOUR FINANCIAL
                PROFILE
              </span>

              <h2>
                {profile?.title ??
                  "Your Financial Profile"}
              </h2>

              <p>
                {profile?.description ??
                  "Your choices created a distinctive pattern across saving, resilience, debt and investing."}
              </p>
            </div>

            <div className="scoreOrb">
              <span>
                OVERALL
              </span>

              <strong>
                {scoreAverage}
              </strong>

              <small>
                / 100
              </small>
            </div>
          </section>

          <div className="scoreGrid">
            <ScoreBar
              label="Resilience"
              value={
                state.scores
                  .resilience
              }
            />

            <ScoreBar
              label="Debt management"
              value={
                state.scores
                  .debtManagement
              }
            />

            <ScoreBar
              label="Saving consistency"
              value={
                state.scores
                  .savingConsistency
              }
            />

            <ScoreBar
              label="Investment behaviour"
              value={
                state.scores
                  .investmentBehaviour
              }
            />

            <ScoreBar
              label="Lifestyle sustainability"
              value={
                state.scores
                  .lifestyleSustainability
              }
            />
          </div>

          <section className="finalLessons">
            <span className="eyebrow">
              THE BIG LESSON
            </span>

            <h2>
              Wealth is not only about
              what you earn.
            </h2>

            <p>
              Two people can earn the
              same amount for years
              and still arrive at very
              different financial
              positions. Cash flow,
              resilience, debt,
              lifestyle and asset
              ownership all matter.
            </p>

            <div className="lessonPills">
              <span>
                Protect cash flow
              </span>

              <span>
                Build resilience
              </span>

              <span>
                Control expensive debt
              </span>

              <span>
                Invest consistently
              </span>

              <span>
                Let lifestyle rise
                intentionally
              </span>
            </div>
          </section>

          <section className="twinPlaybook">
            <span className="eyebrow">
              YOUR TWIN'S PLAYBOOK
            </span>

            <h2>
              Curious what your Twin
              actually did?
            </h2>

            <p>
              You saw the outcome.
              Now you can study the
              strategy behind it —
              but the full playbook is
              part of Financial
              Education access.
            </p>

            {twinAccessState ===
            "unlocked" ? (
              <>
                <div className="freeTwinClue">
                  <span>
                    ACCESS UNLOCKED
                  </span>

                  <strong>
                    Your Financial
                    Twin's 10-year
                    playbook is
                    available.
                  </strong>

                  <p>
                    Same income
                    journey. Same
                    starting point.
                    Here is how the
                    disciplined
                    allocation strategy
                    behaved.
                  </p>
                </div>

                <button
                  className="primary twinUnlockButton"
                  onClick={() =>
                    setTwinPlaybookOpen(
                      (open) =>
                        !open,
                    )
                  }
                >
                  {twinPlaybookOpen
                    ? "Hide Twin Playbook"
                    : "View Twin Playbook →"}
                </button>

                {twinPlaybookOpen ? (
                  <div className="unlockedPlaybook">
                    <div className="strategySummary">
                      <article>
                        <span>
                          HOUSING
                        </span>

                        <strong>
                          Target ≤{" "}
                          {Math.round(
                            state.twin
                              .strategy
                              .housingTargetPercent *
                              100,
                          )}
                          % of
                          take-home
                        </strong>
                      </article>

                      <article>
                        <span>
                          TRANSPORT
                        </span>

                        <strong>
                          Target ≤{" "}
                          {Math.round(
                            state.twin
                              .strategy
                              .transportTargetPercent *
                              100,
                          )}
                          % of
                          take-home
                        </strong>
                      </article>

                      <article>
                        <span>
                          EMERGENCY FUND
                        </span>

                        <strong>
                          {
                            state.twin
                              .strategy
                              .emergencyFundMonths
                          }{" "}
                          months
                        </strong>
                      </article>

                      <article>
                        <span>
                          INVESTING
                        </span>

                        <strong>
                          Target{" "}
                          {Math.round(
                            state.twin
                              .strategy
                              .investingTargetPercent *
                              100,
                          )}
                          % of
                          take-home
                        </strong>
                      </article>

                      <article>
                        <span>
                          PENSION
                        </span>

                        <strong>
                          Target{" "}
                          {Math.round(
                            state.twin
                              .strategy
                              .pensionTargetPercent *
                              100,
                          )}
                          %
                        </strong>
                      </article>

                      <article>
                        <span>
                          DEBT
                        </span>

                        <strong>
                          {state.twin
                            .strategy
                            .highInterestDebtPriority
                            ? "High-interest debt first"
                            : "Standard repayment"}
                        </strong>
                      </article>
                    </div>

                    <div className="twinTimeline">
                      {state.twin.history.map(
                        (year) => (
                          <article
                            key={
                              year.year
                            }
                          >
                            <div className="timelineYear">
                              <span>
                                YEAR
                              </span>

                              <strong>
                                {
                                  year.year
                                }
                              </strong>
                            </div>

                            <div>
                              <span>
                                SAVED
                              </span>

                              <strong>
                                {formatMoney(
                                  year.annualSavings,
                                  state.currency,
                                )}
                              </strong>
                            </div>

                            <div>
                              <span>
                                INVESTED
                              </span>

                              <strong>
                                {formatMoney(
                                  year.annualInvestments,
                                  state.currency,
                                )}
                              </strong>
                            </div>

                            <div>
                              <span>
                                DEBT
                              </span>

                              <strong>
                                {formatMoney(
                                  year.consumerDebt,
                                  state.currency,
                                )}
                              </strong>
                            </div>

                            <div>
                              <span>
                                NET WORTH
                              </span>

                              <strong>
                                {formatMoney(
                                  year.netWorth,
                                  state.currency,
                                )}
                              </strong>
                            </div>
                          </article>
                        ),
                      )}
                    </div>

                    <div className="playbookLesson">
                      <span>
                        WHAT TO NOTICE
                      </span>

                      <p>
                        The Twin does
                        not win by
                        predicting the
                        future. The
                        strategy protects
                        cash flow,
                        prioritises
                        expensive debt,
                        builds resilience
                        and repeatedly
                        directs surplus
                        toward long-term
                        assets.
                      </p>
                    </div>
                  </div>
                ) : null}
              </>
            ) : (
              <>
                <div className="lockedTwinGrid">
                  <article>
                    <span>
                      YEAR 1
                    </span>

                    <strong>
                      Housing decision
                    </strong>

                    <b>
                      🔒 Locked
                    </b>
                  </article>

                  <article>
                    <span>
                      TRANSPORT
                    </span>

                    <strong>
                      Car strategy
                    </strong>

                    <b>
                      🔒 Locked
                    </b>
                  </article>

                  <article>
                    <span>
                      CASH FLOW
                    </span>

                    <strong>
                      Saving vs
                      investing
                    </strong>

                    <b>
                      🔒 Locked
                    </b>
                  </article>

                  <article>
                    <span>
                      YEAR BY YEAR
                    </span>

                    <strong>
                      Full 10-year
                      timeline
                    </strong>

                    <b>
                      🔒 Locked
                    </b>
                  </article>
                </div>

                <div className="freeTwinClue">
                  <span>
                    ONE FREE CLUE
                  </span>

                  <strong>
                    Your Twin invested
                    in{" "}
                    {
                      state.twin.history.filter(
                        (year) =>
                          year.annualInvestments >
                          0,
                      ).length
                    }{" "}
                    of the 10 years.
                  </strong>

                  <p>
                    The detailed
                    timeline shows
                    exactly how saving,
                    debt and investing
                    evolved each year.
                  </p>
                </div>

                <div className="twinGateActions">
                  {twinAccessState ===
                  "checking" ? (
                    <button
                      className="primary twinUnlockButton"
                      disabled
                    >
                      Checking access...
                    </button>
                  ) : twinAccessState ===
                    "signed-out" ? (
                    <>
                      <a
                        href="/signup/parent"
                        className="primary twinGatePrimary"
                      >
                        Create account &
                        unlock →
                      </a>

                      <a
                        href="/login"
                        className="secondary twinGateSecondary"
                      >
                        I already have
                        an account
                      </a>
                    </>
                  ) : (
                    <>
                      <a
                        href="/pricing?product=academies"
                        className="primary twinGatePrimary"
                      >
                        Unlock Financial
                        Education →
                      </a>

                      <a
                        href="/account"
                        className="secondary twinGateSecondary"
                      >
                        Check my
                        subscription
                      </a>
                    </>
                  )}
                </div>

                <p className="gateNote">
                  Your simulation
                  remains yours. The
                  subscription unlocks
                  the Twin's detailed
                  playbook and
                  Financial Education
                  training.
                </p>
              </>
            )}
          </section>

          <section className="academyCta">
            <span>
              READY TO UNDERSTAND
              THE WHY?
            </span>

            <h2>
              Continue inside the
              Financial Literacy
              Academy.
            </h2>

            <p>
              Learn the principles
              behind cash flow,
              financial stability,
              asset ownership,
              investing and long-term
              wealth architecture.
            </p>

            <div className="finalActions">
              <a
                href="/academies/financial-literacy"
                className="primary finalPrimary"
              >
                Enter Financial
                Literacy Academy →
              </a>

              <button
                className="secondary finalSecondary"
                onClick={restart}
              >
                Start a new simulation
              </button>
            </div>
          </section>

          <p className="finalDisclaimer">
            Educational simulation
            only. Results depend on
            simplified assumptions and
            are not financial advice,
            investment advice or a
            forecast of future returns.
          </p>
        </section>

        <style jsx>
          {styles}
        </style>
      </main>
    );
  }

  return (
    <main className="gameShell">
      <header className="gameHeader">
        <div>
          <span>
            FOUNTAINPREP
          </span>

          <strong>
            Life & Wealth Simulator
          </strong>
        </div>
      </header>

      <section className="readyCard">
        <h1>
          Stage:
          {" "}
          {state.stage}
        </h1>

        <p>
          The simulation is ready for
          the next build stage.
        </p>
      </section>

      <style jsx>
        {styles}
      </style>
    </main>
  );
}

  /*
   ============================================
   REAL-LIFE SETUP
   ============================================
  */

  if (
    openingMode ===
    "real-life"
  ) {
    const monthlyIncome =
      setup.annualIncome /
      12;

    const monthlyCommitments =
      setup.currentHousingCost +
      setup.currentTransportCost +
      setup.currentDebtRepayments +
      setup.currentEssentialSpending +
      setup.currentLifestyleSpending;

    return (
      <main className="setupShell">
        <button
          className="backButton"
          onClick={() =>
            setOpeningMode(
              "welcome",
            )
          }
        >
          ← Back
        </button>

        <section className="setupIntro">
          <span className="eyebrow">
            USE MY REAL-LIFE
            NUMBERS
          </span>

          <h1>
            Test where your current
            money choices could lead.
          </h1>

          <p>
            Enter a simple snapshot
            of your finances. This is
            an educational simulation,
            not a financial forecast.
          </p>
        </section>

        <section className="setupGrid">
          <div className="formCard">
            <h2>
              Your starting point
            </h2>

            <label>
              Country / currency

              <select
                value={
                  setup.currency
                }
                onChange={(event) => {
                  const currency =
                    event.target
                      .value as
                      CurrencyCode;

                  const selected =
                    currencies.find(
                      (item) =>
                        item.code ===
                        currency,
                    );

                  updateSetup(
                    "currency",
                    currency,
                  );

                  if (selected) {
                    updateSetup(
                      "country",
                      selected.label,
                    );
                  }
                }}
              >
                {currencies.map(
                  (item) => (
                    <option
                      key={
                        item.code
                      }
                      value={
                        item.code
                      }
                    >
                      {item.label}
                    </option>
                  ),
                )}
              </select>
            </label>

            <label>
              Annual income

              <input
                type="number"
                min="0"
                value={
                  setup.annualIncome
                }
                onChange={(event) =>
                  updateSetup(
                    "annualIncome",
                    Number(
                      event.target
                        .value,
                    ),
                  )
                }
              />
            </label>

            <div className="incomeType">
              <button
                className={
                  setup.incomeType ===
                  "gross"
                    ? "selected"
                    : ""
                }
                onClick={() =>
                  updateSetup(
                    "incomeType",
                    "gross",
                  )
                }
              >
                Gross income
              </button>

              <button
                className={
                  setup.incomeType ===
                  "take-home"
                    ? "selected"
                    : ""
                }
                onClick={() =>
                  updateSetup(
                    "incomeType",
                    "take-home",
                  )
                }
              >
                Take-home income
              </button>
            </div>

            <h3>
              Monthly commitments
            </h3>

            <MoneyInput
              label="Housing"
              value={
                setup.currentHousingCost
              }
              onChange={(value) =>
                updateSetup(
                  "currentHousingCost",
                  value,
                )
              }
            />

            <MoneyInput
              label="Transport / car"
              value={
                setup.currentTransportCost
              }
              onChange={(value) =>
                updateSetup(
                  "currentTransportCost",
                  value,
                )
              }
            />

            <MoneyInput
              label="Debt repayments"
              value={
                setup.currentDebtRepayments
              }
              onChange={(value) =>
                updateSetup(
                  "currentDebtRepayments",
                  value,
                )
              }
            />

            <MoneyInput
              label="Essential spending"
              value={
                setup.currentEssentialSpending
              }
              onChange={(value) =>
                updateSetup(
                  "currentEssentialSpending",
                  value,
                )
              }
            />

            <MoneyInput
              label="Lifestyle spending"
              value={
                setup.currentLifestyleSpending
              }
              onChange={(value) =>
                updateSetup(
                  "currentLifestyleSpending",
                  value,
                )
              }
            />

            <h3>
              What you already have
            </h3>

            <MoneyInput
              label="Cash savings"
              value={
                setup.startingCashSavings
              }
              onChange={(value) =>
                updateSetup(
                  "startingCashSavings",
                  value,
                )
              }
            />

            <MoneyInput
              label="Investments"
              value={
                setup.startingInvestments
              }
              onChange={(value) =>
                updateSetup(
                  "startingInvestments",
                  value,
                )
              }
            />

            <MoneyInput
              label="Pension"
              value={
                setup.startingPension
              }
              onChange={(value) =>
                updateSetup(
                  "startingPension",
                  value,
                )
              }
            />

            <MoneyInput
              label="Consumer debt"
              value={
                setup.startingConsumerDebt
              }
              onChange={(value) =>
                updateSetup(
                  "startingConsumerDebt",
                  value,
                )
              }
            />
          </div>

          <aside className="previewCard">
            <span className="eyebrow">
              LIVE SNAPSHOT
            </span>

            <h2>
              Your financial life
              today
            </h2>

            <div className="bigIncome">
              <span>
                ANNUAL INCOME
              </span>

              <strong>
                {formatMoney(
                  setup.annualIncome,
                  setup.currency,
                )}
              </strong>
            </div>

            <div className="previewRow">
              <span>
                Approx. monthly
                income
              </span>

              <b>
                {formatMoney(
                  monthlyIncome,
                  setup.currency,
                )}
              </b>
            </div>

            <div className="previewRow">
              <span>
                Monthly commitments
              </span>

              <b>
                {formatMoney(
                  monthlyCommitments,
                  setup.currency,
                )}
              </b>
            </div>

            <div className="previewRow">
              <span>
                Starting assets
              </span>

              <b>
                {formatMoney(
                  setup.startingCashSavings +
                    setup.startingInvestments +
                    setup.startingPension,
                  setup.currency,
                )}
              </b>
            </div>

            <div className="previewRow">
              <span>
                Consumer debt
              </span>

              <b>
                {formatMoney(
                  setup.startingConsumerDebt,
                  setup.currency,
                )}
              </b>
            </div>

            <div className="twinBox">
              <span>
                YOUR FINANCIAL TWIN
              </span>

              <strong>
                Same income.
                <br />
                Same starting point.
              </strong>

              <p>
                Your Twin receives no
                hidden advantage. The
                difference will come
                from how money is
                allocated over the
                next 10 years.
              </p>
            </div>

            <button
              className="primary"
              disabled={
                setup.annualIncome <=
                0
              }
              onClick={
                startRealLife
              }
            >
              Start my 10-year
              simulation →
            </button>
          </aside>
        </section>

        <style jsx>
          {styles}
        </style>
      </main>
    );
  }

  /*
   ============================================
   WELCOME
   ============================================
  */

  return (
    <main className="welcomeShell">
      <section className="hero">
        <div className="brand">
          FOUNTAINPREP · FINANCIAL
          EDUCATION
        </div>

        <span className="eyebrow">
          LIFE & WEALTH
          SIMULATOR
        </span>

        <h1>
          You earn the money.
          <br />
          <em>
            What happens next?
          </em>
        </h1>

        <p className="heroCopy">
          Live through 10 years of
          career, housing, transport,
          lifestyle, saving and
          investment decisions — then
          meet the person who started
          with exactly what you did.
        </p>

        <div className="modeGrid">
          <button
            className="modeCard"
            onClick={
              startCareer
            }
          >
            <span className="modeNumber">
              01
            </span>

            <div>
              <small>
                QUICK START
              </small>

              <h2>
                Start a new career
              </h2>

              <p>
                Receive a fictional
                job offer and build
                your financial life
                from your first
                salary.
              </p>

              <strong>
                Start career
                scenario →
              </strong>
            </div>
          </button>

          <button
            className="modeCard real"
            onClick={() =>
              setOpeningMode(
                "real-life",
              )
            }
          >
            <span className="modeNumber">
              02
            </span>

            <div>
              <small>
                PERSONAL MODE
              </small>

              <h2>
                Use my real-life
                numbers
              </h2>

              <p>
                Enter your own income,
                expenses, savings,
                investments and debt
                and test your current
                financial path.
              </p>

              <strong>
                Test my numbers →
              </strong>
            </div>
          </button>
        </div>

        <div className="promise">
          <div>
            <b>10</b>
            <span>
              YEARS
            </span>
          </div>

          <i />

          <div>
            <b>1</b>
            <span>
              INCOME JOURNEY
            </span>
          </div>

          <i />

          <div>
            <b>2</b>
            <span>
              DIFFERENT
              OUTCOMES
            </span>
          </div>
        </div>

        <p className="disclaimer">
          Educational simulation
          only. Outcomes are based on
          assumptions and are not
          financial advice or a
          forecast.
        </p>
      </section>

      <style jsx>
        {styles}
      </style>
    </main>
  );
}

function ScoreBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const safeValue =
    Math.max(
      0,
      Math.min(
        100,
        value,
      ),
    );

  return (
    <article className="scoreRow">
      <div>
        <span>
          {label}
        </span>

        <strong>
          {Math.round(
            safeValue,
          )}
          /100
        </strong>
      </div>

      <div className="scoreTrack">
        <i
          style={{
            width: `${safeValue}%`,
          }}
        />
      </div>
    </article>
  );
}

function MoneyInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (
    value: number,
  ) => void;
}) {
  return (
    <label>
      {label}

      <input
        type="number"
        min="0"
        value={value}
        onChange={(event) =>
          onChange(
            Number(
              event.target.value,
            ),
          )
        }
      />
    </label>
  );
}

const styles = `
*{
  box-sizing:border-box;
}

button,
input,
select{
  font:inherit;
}

button{
  cursor:pointer;
}

.loading{
  min-height:100vh;
  display:grid;
  place-items:center;
  font-family:Inter,Arial,sans-serif;
  color:#6d5978;
}

.welcomeShell,
.setupShell,
.gameShell{
  min-height:100vh;
  background:
    radial-gradient(
      circle at 75% 10%,
      rgba(124,58,237,.11),
      transparent 30%
    ),
    linear-gradient(
      180deg,
      #ffffff 0%,
      #fbf8ff 100%
    );
  color:#211331;
  font-family:
    Inter,
    Arial,
    sans-serif;
}

.hero{
  width:min(
    1080px,
    calc(100% - 36px)
  );
  margin:auto;
  padding:72px 0 55px;
  text-align:center;
}

.brand{
  display:inline-flex;
  padding:8px 13px;
  border:1px solid #e7ddee;
  border-radius:999px;
  background:#fff;
  color:#745989;
  font-size:9px;
  font-weight:900;
  letter-spacing:.13em;
}

.eyebrow{
  display:block;
  margin-top:34px;
  color:#7c3aed;
  font-size:9px;
  font-weight:950;
  letter-spacing:.14em;
}

.hero h1{
  margin:13px auto 18px;
  max-width:900px;
  font-size:
    clamp(
      48px,
      7vw,
      84px
    );
  line-height:.96;
  letter-spacing:-.065em;
}

.hero h1 em{
  color:#7c3aed;
  font-style:normal;
}

.heroCopy{
  max-width:720px;
  margin:0 auto;
  color:#74657e;
  font-size:16px;
  line-height:1.7;
}

.modeGrid{
  display:grid;
  grid-template-columns:
    repeat(2,1fr);
  gap:16px;
  margin-top:38px;
}

.modeCard{
  position:relative;
  min-height:275px;
  padding:27px;
  display:flex;
  gap:22px;
  border:1px solid #e4d9eb;
  border-radius:25px;
  background:#fff;
  color:#211331;
  text-align:left;
  box-shadow:
    0 16px 45px
    rgba(54,25,77,.06);
  transition:
    transform .18s ease,
    border-color .18s ease;
}

.modeCard:hover{
  transform:
    translateY(-3px);
  border-color:#b997e5;
}

.modeCard.real{
  background:
    linear-gradient(
      145deg,
      #211331,
      #39204f
    );
  color:#fff;
}

.modeNumber{
  width:48px;
  height:48px;
  flex:0 0 48px;
  display:grid;
  place-items:center;
  border-radius:14px;
  background:#f1eafb;
  color:#7c3aed;
  font-weight:950;
}

.real .modeNumber{
  background:
    rgba(255,255,255,.11);
  color:#d7baff;
}

.modeCard small{
  color:#907a9d;
  font-size:8px;
  font-weight:950;
  letter-spacing:.12em;
}

.real small{
  color:#bea7cd;
}

.modeCard h2{
  margin:8px 0;
  font-size:27px;
  letter-spacing:-.04em;
}

.modeCard p{
  margin:0;
  color:#7e7087;
  font-size:12px;
  line-height:1.65;
}

.real p{
  color:#d5c7df;
}

.modeCard strong{
  display:block;
  margin-top:25px;
  color:#7c3aed;
  font-size:11px;
}

.real strong{
  color:#d5b4ff;
}

.promise{
  margin:38px auto 0;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:28px;
}

.promise div{
  display:grid;
  gap:2px;
}

.promise b{
  font-size:27px;
}

.promise span{
  color:#95869d;
  font-size:7px;
  font-weight:900;
  letter-spacing:.11em;
}

.promise i{
  width:1px;
  height:30px;
  background:#e3d9e9;
}

.disclaimer{
  margin-top:34px;
  color:#a092a7;
  font-size:9px;
}

.backButton{
  margin:28px 0 0 30px;
  border:0;
  background:transparent;
  color:#755f83;
  font-weight:850;
}

.setupIntro{
  width:min(
    820px,
    calc(100% - 36px)
  );
  margin:25px auto 28px;
  text-align:center;
}

.setupIntro h1{
  margin:10px 0;
  font-size:
    clamp(
      38px,
      5vw,
      60px
    );
  letter-spacing:-.055em;
}

.setupIntro p{
  color:#786a81;
  line-height:1.6;
}

.setupGrid{
  width:min(
    1080px,
    calc(100% - 36px)
  );
  margin:auto;
  padding-bottom:70px;
  display:grid;
  grid-template-columns:
    1.15fr .85fr;
  gap:18px;
  align-items:start;
}

.formCard,
.previewCard,
.readyCard{
  border:1px solid #e5dbea;
  border-radius:24px;
  background:#fff;
  box-shadow:
    0 18px 55px
    rgba(49,24,67,.06);
}

.formCard{
  padding:25px;
}

.formCard h2{
  margin-top:0;
  font-size:25px;
}

.formCard h3{
  margin:
    28px 0 12px;
  font-size:13px;
}

.formCard label{
  display:grid;
  gap:6px;
  margin-top:13px;
  color:#725f7e;
  font-size:10px;
  font-weight:850;
}

.formCard input,
.formCard select{
  width:100%;
  padding:12px 13px;
  border:1px solid #ded3e5;
  border-radius:11px;
  outline:none;
  background:#fff;
  color:#211331;
}

.formCard input:focus,
.formCard select:focus{
  border-color:#7c3aed;
}

.incomeType{
  display:grid;
  grid-template-columns:
    1fr 1fr;
  gap:7px;
  margin-top:9px;
}

.incomeType button{
  padding:10px;
  border:1px solid #e1d6e8;
  border-radius:10px;
  background:#fff;
  color:#74617f;
  font-size:10px;
  font-weight:850;
}

.incomeType button.selected{
  border-color:#7c3aed;
  background:#f2eafd;
  color:#7c3aed;
}

.previewCard{
  position:sticky;
  top:18px;
  padding:25px;
}

.previewCard h2{
  margin:7px 0 20px;
  font-size:26px;
  letter-spacing:-.04em;
}

.bigIncome{
  padding:20px;
  border-radius:18px;
  background:
    linear-gradient(
      145deg,
      #211331,
      #38204f
    );
  color:#fff;
}

.bigIncome span,
.bigIncome strong{
  display:block;
}

.bigIncome span{
  color:#c5afd2;
  font-size:8px;
  font-weight:900;
}

.bigIncome strong{
  margin-top:5px;
  font-size:32px;
}

.previewRow{
  display:flex;
  justify-content:
    space-between;
  gap:15px;
  padding:13px 2px;
  border-bottom:
    1px solid #eee7f2;
  font-size:10px;
}

.previewRow span{
  color:#8b7d94;
}

.twinBox{
  margin-top:18px;
  padding:18px;
  border-radius:16px;
  background:#f4eef9;
}

.twinBox span{
  color:#7c3aed;
  font-size:8px;
  font-weight:950;
  letter-spacing:.1em;
}

.twinBox strong{
  display:block;
  margin-top:6px;
  font-size:18px;
}

.twinBox p{
  margin-bottom:0;
  color:#786783;
  font-size:10px;
  line-height:1.55;
}

.primary{
  width:100%;
  margin-top:16px;
  padding:14px 18px;
  border:0;
  border-radius:12px;
  background:
    linear-gradient(
      135deg,
      #6d28d9,
      #8b5cf6
    );
  color:#fff;
  font-size:11px;
  font-weight:950;
  box-shadow:
    0 12px 28px
    rgba(109,40,217,.2);
}

.primary:disabled{
  opacity:.45;
  cursor:not-allowed;
}

.gameHeader{
  height:72px;
  padding:0 30px;
  display:flex;
  align-items:center;
  justify-content:
    space-between;
  border-bottom:
    1px solid #e8deed;
  background:
    rgba(255,255,255,.92);
}

.gameHeader div{
  display:grid;
}

.gameHeader span{
  color:#7c3aed;
  font-size:7px;
  font-weight:950;
  letter-spacing:.12em;
}

.gameHeader strong{
  margin-top:2px;
  font-size:15px;
}

.gameHeader button{
  border:0;
  background:transparent;
  color:#846f91;
  font-size:9px;
  font-weight:850;
}

.readyCard{
  width:min(
    850px,
    calc(100% - 36px)
  );
  margin:60px auto;
  padding:35px;
  text-align:center;
}

.readyCard h1{
  margin:8px 0;
  font-size:42px;
  letter-spacing:-.05em;
}

.readyCard>p{
  max-width:650px;
  margin:
    0 auto 22px;
  color:#776980;
  line-height:1.6;
}

.readyStats{
  display:grid;
  grid-template-columns:
    repeat(3,1fr);
  gap:9px;
}

.readyStats article{
  padding:17px;
  border-radius:14px;
  background:#f7f3fa;
}

.readyStats span,
.readyStats strong{
  display:block;
}

.readyStats span{
  color:#94849d;
  font-size:7px;
  font-weight:900;
}

.readyStats strong{
  margin-top:5px;
  font-size:16px;
}

.twinNotice{
  margin-top:20px;
  padding:22px;
  display:grid;
  grid-template-columns:
    1fr auto 1fr;
  gap:20px;
  align-items:center;
  border-radius:20px;
  background:
    linear-gradient(
      145deg,
      #211331,
      #38204f
    );
  color:#fff;
}

.person b,
.person strong{
  display:block;
}

.person b{
  color:#bca8c9;
  font-size:8px;
}

.person strong{
  margin-top:5px;
  font-size:24px;
}

.person.twin strong{
  color:#d7b6ff;
}

.versus{
  width:40px;
  height:40px;
  display:grid;
  place-items:center;
  border-radius:50%;
  background:
    rgba(255,255,255,.1);
  font-size:9px;
  font-weight:950;
}

.nextNote{
  margin-top:22px !important;
  font-size:10px;
}

.decisionScene{
  width:min(900px,calc(100% - 36px));
  margin:auto;
  padding:55px 0 80px;
  text-align:center;
}

.wideScene{
  width:min(1180px,calc(100% - 36px));
}

.decisionScene h1,
.paydayScene h1{
  margin:10px 0 8px;
  font-size:clamp(42px,5.5vw,67px);
  line-height:1;
  letter-spacing:-.055em;
}

.sceneIntro{
  max-width:700px;
  margin:0 auto 30px;
  color:#786a82;
  line-height:1.65;
}

.offerEnvelope{
  max-width:760px;
  margin:30px auto 0;
  padding:40px;
  border:1px solid #dfd5e5;
  border-radius:4px;
  background:#fff;
  text-align:left;
  box-shadow:
    0 30px 80px
    rgba(40,20,55,.10);
}

.offerTop{
  display:flex;
  justify-content:space-between;
  gap:20px;
  padding-bottom:24px;
  border-bottom:1px solid #eee7f2;
}

.offerTop span,
.offerTop strong{
  display:block;
}

.offerTop span{
  color:#7c3aed;
  font-size:8px;
  font-weight:950;
  letter-spacing:.13em;
}

.offerTop strong{
  margin-top:5px;
  font-size:20px;
}

.offerStamp{
  width:68px;
  height:68px;
  display:grid;
  place-items:center;
  border:2px solid #7c3aed;
  border-radius:50%;
  color:#7c3aed;
  font-size:9px;
  font-weight:950;
  transform:rotate(-8deg);
}

.offerEnvelope h2{
  margin:12px 0 22px;
  font-size:35px;
  letter-spacing:-.04em;
}

.offerGrid{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:10px;
}

.offerGrid div{
  padding:15px;
  border-radius:12px;
  background:#f7f3fa;
}

.offerGrid span,
.offerGrid strong{
  display:block;
}

.offerGrid span{
  color:#94839e;
  font-size:7px;
  font-weight:900;
}

.offerGrid strong{
  margin-top:4px;
}

.offerDescription{
  margin-top:22px;
  color:#776880;
  line-height:1.65;
}

.offerActions{
  display:flex;
  gap:8px;
  margin-top:25px;
}

.offerActions .primary{
  width:auto;
  margin-top:0;
}

.secondary{
  padding:12px 17px;
  border:1px solid #ded3e6;
  border-radius:11px;
  background:#fff;
  color:#6f5c7b;
  font-size:10px;
  font-weight:900;
}

.learningNote{
  max-width:620px;
  margin:25px auto 0;
  color:#8c7c96;
  font-size:11px;
  line-height:1.6;
}

.headerMoney{
  text-align:right;
}

.headerMoney span,
.headerMoney strong{
  display:block;
}

.headerMoney span{
  color:#97869f;
  font-size:7px;
  font-weight:900;
}

.headerMoney strong{
  margin-top:3px;
}

.choiceGrid{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:12px;
}

.choiceCard{
  padding:0 0 20px;
  overflow:hidden;
  border:1px solid #e3d9e9;
  border-radius:20px;
  background:#fff;
  color:#211331;
  text-align:left;
  box-shadow:0 12px 35px rgba(45,22,62,.05);
  transition:.18s ease;
}

.choiceCard:hover{
  transform:translateY(-4px);
  border-color:#b99ae1;
}

.choiceVisual{
  height:115px;
  display:grid;
  place-items:center;
  background:
    linear-gradient(145deg,#f2ebfa,#faf7fd);
}

.choiceVisual span{
  font-size:45px;
}

.choiceCard>small,
.choiceCard>h2,
.choiceCard>p,
.choiceCard>.choicePrice,
.choiceCard>.choiceMeta,
.choiceCard>.carPrice,
.choiceCard>.selectText{
  margin-left:18px;
  margin-right:18px;
}

.choiceCard>small{
  display:block;
  margin-top:17px;
  color:#7c3aed;
  font-size:8px;
  font-weight:900;
}

.choiceCard h2{
  margin-top:5px;
  margin-bottom:5px;
  font-size:19px;
}

.choiceCard p{
  min-height:75px;
  color:#796b82;
  font-size:10px;
  line-height:1.5;
}

.choicePrice{
  margin-top:14px;
  padding:12px;
  border-radius:11px;
  background:#f6f2f9;
}

.choicePrice span,
.choicePrice strong{
  display:block;
}

.choicePrice span{
  color:#95859f;
  font-size:7px;
  font-weight:900;
}

.choicePrice strong{
  margin-top:3px;
  font-size:18px;
}

.choiceMeta,
.carPrice{
  margin-top:9px;
  color:#917f9a;
  font-size:9px;
}

.selectText{
  display:block;
  margin-top:16px;
  color:#7c3aed;
  font-size:10px;
}

.budgetSummary{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:9px;
  margin-bottom:25px;
}

.budgetSummary article{
  padding:16px;
  border-radius:14px;
  background:#f5f0f8;
}

.budgetSummary span,
.budgetSummary strong{
  display:block;
}

.budgetSummary span{
  color:#93829d;
  font-size:7px;
  font-weight:900;
}

.budgetSummary strong{
  margin-top:4px;
  font-size:18px;
}

.lifestyleGrid{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:12px;
}

.lifestyleCard{
  padding:22px;
  border:1px solid #e2d8e8;
  border-radius:20px;
  background:#fff;
  color:#211331;
  text-align:left;
}

.lifestyleCard:hover{
  border-color:#7c3aed;
}

.lifestyleLabel{
  color:#7c3aed;
  font-size:8px;
  font-weight:950;
}

.lifestyleCard h2{
  margin:8px 0;
  font-size:20px;
}

.lifestyleCard p{
  min-height:90px;
  color:#796b82;
  font-size:10px;
  line-height:1.5;
}

.lifestyleCard div{
  display:flex;
  justify-content:space-between;
  gap:10px;
  padding:9px 0;
  border-top:1px solid #eee7f2;
  font-size:9px;
}

.lifestyleCard b{
  display:block;
  margin-top:17px;
  color:#7c3aed;
  font-size:10px;
}

.paydayScene{
  width:min(850px,calc(100% - 36px));
  margin:auto;
  padding:55px 0 80px;
  text-align:center;
}

.salaryDeposit{
  width:240px;
  height:240px;
  margin:28px auto;
  display:grid;
  align-content:center;
  border-radius:50%;
  background:
    linear-gradient(145deg,#6d28d9,#9b6cf0);
  color:#fff;
  box-shadow:0 28px 65px rgba(109,40,217,.22);
}

.salaryDeposit span,
.salaryDeposit strong{
  display:block;
}

.salaryDeposit span{
  font-size:8px;
  font-weight:900;
}

.salaryDeposit strong{
  margin-top:5px;
  font-size:28px;
}

.moneyFlow{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:8px;
}

.moneyFlow div,
.allocationPreview div{
  padding:15px;
  border-radius:13px;
  background:#f6f2f9;
}

.moneyFlow span,
.moneyFlow strong,
.allocationPreview span,
.allocationPreview strong{
  display:block;
}

.moneyFlow span,
.allocationPreview span{
  color:#93839d;
  font-size:7px;
  font-weight:900;
}

.moneyFlow strong{
  margin-top:4px;
}

.remainingMoney{
  margin-top:18px;
  padding:25px;
  border:1px solid #e4dae9;
  border-radius:20px;
  background:#fff;
}

.remainingMoney span{
  color:#7c3aed;
  font-size:8px;
  font-weight:950;
}

.remainingMoney strong{
  display:block;
  margin:5px 0;
  font-size:40px;
  letter-spacing:-.04em;
}

.remainingMoney p{
  max-width:600px;
  margin:0 auto;
  color:#796b83;
  font-size:11px;
  line-height:1.55;
}

.allocationPreview{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:8px;
  margin-top:12px;
}

.allocationPreview strong{
  margin-top:4px;
  font-size:16px;
}

.advanceButton{
  width:auto;
  padding-left:28px;
  padding-right:28px;
}


.eventScene,
.yearResultScene{
  width:min(920px,calc(100% - 36px));
  margin:auto;
  padding:58px 0 85px;
  text-align:center;
}

.eventPulse{
  width:88px;
  height:88px;
  margin:0 auto 15px;
  display:grid;
  place-items:center;
  border-radius:50%;
  background:
    radial-gradient(
      circle at 35% 25%,
      #a879ff,
      #6d28d9 65%,
      #411777
    );
  color:#fff;
  box-shadow:
    0 20px 45px
    rgba(109,40,217,.22);
}

.eventPulse span{
  font-size:9px;
  font-weight:950;
  letter-spacing:.08em;
}

.eventScene h1,
.yearResultScene h1{
  margin:10px auto 10px;
  max-width:850px;
  font-size:clamp(44px,5.6vw,68px);
  line-height:1;
  letter-spacing:-.055em;
}

.eventIntro,
.yearResultIntro{
  max-width:680px;
  margin:0 auto 30px;
  color:#786a82;
  line-height:1.65;
}

.eventChoices{
  display:grid;
  gap:10px;
  margin-top:26px;
}

.eventChoice{
  display:grid;
  grid-template-columns:auto 1fr auto;
  gap:18px;
  align-items:center;
  padding:20px;
  border:1px solid #e3d8ea;
  border-radius:18px;
  background:#fff;
  color:#211331;
  text-align:left;
  transition:.18s ease;
}

.eventChoice:hover{
  transform:translateX(4px);
  border-color:#a979e8;
  box-shadow:
    0 14px 32px
    rgba(65,27,88,.07);
}

.choiceLetter{
  width:42px;
  height:42px;
  display:grid;
  place-items:center;
  border-radius:12px;
  background:#f1eafa;
  color:#7c3aed;
  font-weight:950;
}

.eventChoice strong{
  font-size:15px;
}

.eventChoice p{
  margin:4px 0 0;
  color:#81728a;
  font-size:10px;
  line-height:1.5;
}

.eventArrow{
  color:#7c3aed;
  font-size:20px;
}

.eventLearning{
  margin-top:22px;
  padding:19px;
  border-radius:16px;
  background:
    linear-gradient(
      145deg,
      #211331,
      #38204f
    );
  color:#fff;
  text-align:left;
}

.eventLearning span{
  color:#c5acd7;
  font-size:8px;
  font-weight:950;
  letter-spacing:.1em;
}

.eventLearning p{
  margin:6px 0 0;
  color:#e2d6e9;
  font-size:11px;
  line-height:1.6;
}

.netWorthOrb{
  width:245px;
  height:245px;
  margin:28px auto;
  display:grid;
  align-content:center;
  border-radius:50%;
  background:
    linear-gradient(
      145deg,
      #6d28d9,
      #9563ec
    );
  color:#fff;
  box-shadow:
    0 28px 65px
    rgba(109,40,217,.2);
}

.netWorthOrb span,
.netWorthOrb strong,
.netWorthOrb b{
  display:block;
}

.netWorthOrb span{
  font-size:8px;
  font-weight:900;
}

.netWorthOrb strong{
  margin:5px 0;
  font-size:31px;
  letter-spacing:-.04em;
}

.netWorthOrb b{
  font-size:10px;
}

.wealthUp{
  color:#d7ffe8;
}

.wealthDown{
  color:#ffd7df;
}

.annualStatement{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:9px;
  margin-top:22px;
}

.annualStatement article{
  padding:18px;
  border:1px solid #e7ddea;
  border-radius:15px;
  background:#fff;
}

.annualStatement span,
.annualStatement strong{
  display:block;
}

.annualStatement span{
  color:#96869f;
  font-size:7px;
  font-weight:900;
}

.annualStatement strong{
  margin-top:5px;
  font-size:17px;
}

.wealthBreakdown{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:8px;
  margin-top:10px;
}

.wealthBreakdown div{
  padding:15px;
  border-radius:13px;
  background:#f5f0f8;
}

.wealthBreakdown span,
.wealthBreakdown strong{
  display:block;
}

.wealthBreakdown span{
  color:#9889a0;
  font-size:7px;
  font-weight:900;
}

.wealthBreakdown strong{
  margin-top:4px;
}

.twinTeaser{
  margin-top:25px;
  padding:25px;
  border-radius:20px;
  background:
    linear-gradient(
      145deg,
      #211331,
      #39204f
    );
  color:#fff;
}

.twinTeaser>span{
  color:#c1a8d2;
  font-size:8px;
  font-weight:950;
  letter-spacing:.11em;
}

.twinTeaser h2{
  margin:7px 0;
  font-size:25px;
}

.twinTeaser p{
  margin:0;
  color:#dbcde4;
  font-size:11px;
  line-height:1.55;
}

.twinTeaser>strong{
  display:block;
  margin-top:12px;
  color:#d7b7ff;
  font-size:10px;
}

.continueYearButton{
  width:auto;
  padding-left:30px;
  padding-right:30px;
}


.finalScene{
  width:min(1080px,calc(100% - 36px));
  margin:auto;
  padding:58px 0 90px;
  text-align:center;
}

.finalScene>h1{
  margin:10px auto 16px;
  max-width:900px;
  font-size:clamp(48px,6.8vw,82px);
  line-height:.96;
  letter-spacing:-.06em;
}

.finalScene>h1 em{
  color:#7c3aed;
  font-style:normal;
}

.finalIntro{
  max-width:760px;
  margin:0 auto;
  color:#786a82;
  font-size:14px;
  line-height:1.7;
}

.finalComparison{
  margin-top:38px;
  display:grid;
  grid-template-columns:1fr auto 1fr;
  gap:14px;
  align-items:center;
}

.resultCard{
  position:relative;
  min-height:250px;
  padding:30px;
  display:grid;
  align-content:center;
  border:1px solid #e2d8e8;
  border-radius:24px;
  background:#fff;
  box-shadow:0 18px 45px rgba(49,24,67,.06);
}

.resultCard span{
  color:#8d7a99;
  font-size:8px;
  font-weight:950;
  letter-spacing:.1em;
}

.resultCard h2{
  margin:7px 0 4px;
  font-size:24px;
}

.resultCard>strong{
  font-size:42px;
  letter-spacing:-.05em;
}

.resultCard p{
  margin:7px 0 0;
  color:#8a7a93;
  font-size:10px;
}

.resultCard b{
  display:inline-flex;
  justify-self:center;
  margin-top:14px;
  padding:7px 10px;
  border-radius:999px;
  background:#eee5fb;
  color:#7c3aed;
  font-size:8px;
}

.twinResult{
  background:
    linear-gradient(
      145deg,
      #211331,
      #38204f
    );
  color:#fff;
}

.twinResult span,
.twinResult p{
  color:#cbb8d7;
}

.twinResult b{
  background:rgba(255,255,255,.1);
  color:#e2caff;
}

.winnerCard{
  border-color:#a879e8;
  box-shadow:
    0 22px 60px
    rgba(109,40,217,.16);
}

.comparisonVs{
  width:52px;
  height:52px;
  display:grid;
  place-items:center;
  border-radius:50%;
  background:#f0e8f7;
  color:#7c3aed;
  font-size:10px;
  font-weight:950;
}

.gapBanner{
  margin-top:18px;
  padding:25px;
  border-radius:20px;
  background:#fff3f6;
  border:1px solid #f1d8e0;
}

.positiveGap{
  background:#f1fbf5;
  border-color:#d5eddf;
}

.neutralGap{
  background:#f5f2f8;
  border-color:#e4dbe9;
}

.gapBanner span{
  color:#947f9e;
  font-size:8px;
  font-weight:950;
  letter-spacing:.1em;
}

.gapBanner strong{
  display:block;
  margin-top:5px;
  font-size:27px;
  letter-spacing:-.03em;
}

.gapBanner p{
  max-width:710px;
  margin:8px auto 0;
  color:#7f7087;
  font-size:10px;
  line-height:1.6;
}

.finalStats{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:9px;
  margin-top:18px;
}

.finalStats article{
  padding:18px;
  border-radius:15px;
  background:#f6f2f9;
}

.finalStats span,
.finalStats strong,
.finalStats small{
  display:block;
}

.finalStats span{
  color:#96869f;
  font-size:7px;
  font-weight:900;
}

.finalStats strong{
  margin-top:5px;
  font-size:17px;
}

.finalStats small{
  margin-top:5px;
  color:#9b8ba4;
  font-size:8px;
}

.whyGap{
  margin-top:55px;
}

.whyGap h2,
.profilePanel h2,
.finalLessons h2,
.academyCta h2{
  margin:8px auto 18px;
  max-width:800px;
  font-size:clamp(31px,4vw,48px);
  letter-spacing:-.045em;
  line-height:1.02;
}

.driverGrid{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:10px;
}

.driverGrid article{
  padding:23px;
  border:1px solid #e6ddea;
  border-radius:18px;
  background:#fff;
  text-align:left;
}

.driverGrid article>div{
  font-size:31px;
}

.driverGrid h3{
  margin:12px 0 5px;
  font-size:16px;
}

.driverGrid p{
  margin:0;
  color:#7f7088;
  font-size:10px;
  line-height:1.6;
}

.profilePanel{
  margin-top:52px;
  padding:30px;
  display:grid;
  grid-template-columns:1fr auto;
  gap:28px;
  align-items:center;
  border-radius:24px;
  background:
    linear-gradient(
      145deg,
      #211331,
      #38204f
    );
  color:#fff;
  text-align:left;
}

.profilePanel .eyebrow{
  margin-top:0;
  color:#c9a9e5;
}

.profilePanel h2{
  margin-left:0;
  color:#fff;
}

.profilePanel p{
  max-width:700px;
  color:#d6c8df;
  font-size:11px;
  line-height:1.65;
}

.scoreOrb{
  width:150px;
  height:150px;
  display:grid;
  align-content:center;
  justify-items:center;
  border-radius:50%;
  background:
    radial-gradient(
      circle at 35% 25%,
      #a979ef,
      #6d28d9
    );
}

.scoreOrb span{
  color:#e0caef;
  font-size:7px;
  font-weight:900;
}

.scoreOrb strong{
  font-size:42px;
}

.scoreOrb small{
  color:#e5d6ef;
}

.scoreGrid{
  display:grid;
  gap:10px;
  margin-top:14px;
}

.scoreRow{
  padding:15px 17px;
  border:1px solid #e5dbe9;
  border-radius:14px;
  background:#fff;
  text-align:left;
}

.scoreRow>div:first-child{
  display:flex;
  justify-content:space-between;
  gap:14px;
  margin-bottom:8px;
}

.scoreRow span{
  color:#796982;
  font-size:9px;
  font-weight:850;
}

.scoreRow strong{
  font-size:9px;
}

.scoreTrack{
  height:8px;
  overflow:hidden;
  border-radius:999px;
  background:#eee7f2;
}

.scoreTrack i{
  display:block;
  height:100%;
  border-radius:999px;
  background:
    linear-gradient(
      90deg,
      #6d28d9,
      #9b6cf0
    );
}

.finalLessons{
  margin-top:55px;
  padding:34px;
  border-radius:24px;
  background:#f7f2fb;
}

.finalLessons p{
  max-width:760px;
  margin:0 auto;
  color:#77687f;
  line-height:1.65;
}

.lessonPills{
  margin-top:21px;
  display:flex;
  flex-wrap:wrap;
  justify-content:center;
  gap:8px;
}

.lessonPills span{
  padding:9px 12px;
  border:1px solid #dfd2e8;
  border-radius:999px;
  background:#fff;
  color:#6f5a7c;
  font-size:9px;
  font-weight:850;
}

.academyCta{
  margin-top:25px;
  padding:42px 32px;
  border-radius:25px;
  background:
    linear-gradient(
      145deg,
      #6d28d9,
      #8f5be9
    );
  color:#fff;
}

.academyCta>span{
  color:#e0cff2;
  font-size:8px;
  font-weight:950;
  letter-spacing:.11em;
}

.academyCta h2{
  color:#fff;
}

.academyCta p{
  max-width:700px;
  margin:0 auto;
  color:#eadff3;
  font-size:11px;
  line-height:1.65;
}

.finalActions{
  margin-top:22px;
  display:flex;
  justify-content:center;
  gap:9px;
  flex-wrap:wrap;
}

.finalPrimary{
  width:auto;
  margin-top:0;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  text-decoration:none;
  background:#fff;
  color:#6d28d9;
  box-shadow:none;
}

.finalSecondary{
  border-color:rgba(255,255,255,.35);
  background:rgba(255,255,255,.08);
  color:#fff;
}

.finalDisclaimer{
  margin-top:22px;
  color:#9888a0;
  font-size:8px;
  line-height:1.5;
}


.courseCorrect{
  margin-top:24px;
  padding:25px;
  border:1px solid #dfd4e7;
  border-radius:20px;
  background:#fff;
}

.courseCorrect>span{
  color:#7c3aed;
  font-size:8px;
  font-weight:950;
  letter-spacing:.1em;
}

.courseCorrect h2{
  margin:7px 0;
  font-size:25px;
  letter-spacing:-.035em;
}

.courseCorrect p{
  max-width:700px;
  margin:0 auto;
  color:#7b6d83;
  font-size:10px;
  line-height:1.6;
}

.courseCorrectActions{
  margin-top:17px;
  display:flex;
  justify-content:center;
  gap:9px;
  flex-wrap:wrap;
}

.courseCorrectActions .primary{
  width:auto;
  margin-top:0;
}

.rebalancePanel{
  margin-top:15px;
  padding:25px;
  border:1px solid #dacbe5;
  border-radius:22px;
  background:#fff;
  box-shadow:0 24px 70px rgba(52,25,73,.1);
  text-align:left;
}

.rebalanceTop{
  display:flex;
  justify-content:space-between;
  gap:20px;
}

.rebalanceTop span{
  color:#7c3aed;
  font-size:8px;
  font-weight:950;
  letter-spacing:.1em;
}

.rebalanceTop h2{
  margin:5px 0;
  font-size:28px;
  letter-spacing:-.04em;
}

.rebalanceTop p{
  margin:0;
  color:#7d6e85;
  font-size:10px;
}

.closeRebalance{
  width:36px;
  height:36px;
  flex:0 0 36px;
  border:1px solid #e0d5e7;
  border-radius:50%;
  background:#fff;
  color:#765f84;
  font-size:20px;
}

.rebalanceGrid{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:12px;
  margin-top:20px;
}

.rebalanceGrid section{
  padding:17px;
  border-radius:15px;
  background:#f7f3fa;
}

.rebalanceGrid label{
  display:block;
  margin-bottom:7px;
  color:#6f5c7b;
  font-size:9px;
  font-weight:900;
}

.rebalanceGrid select{
  width:100%;
  padding:11px;
  border:1px solid #ddd1e5;
  border-radius:10px;
  background:#fff;
  color:#211331;
}

.rebalanceGrid small{
  display:block;
  margin-top:7px;
  color:#918199;
  font-size:8px;
  line-height:1.5;
}

.allocationControlTop{
  display:flex;
  justify-content:space-between;
  gap:10px;
}

.allocationControl input[type="range"]{
  width:100%;
  accent-color:#7c3aed;
}

.allocationSummary{
  display:grid;
  align-content:center;
  background:
    linear-gradient(
      145deg,
      #211331,
      #38204f
    ) !important;
  color:#fff;
}

.allocationSummary span{
  color:#c9b3d6;
  font-size:8px;
  font-weight:900;
}

.allocationSummary strong{
  margin-top:3px;
  font-size:28px;
}

.allocationSummary p{
  margin:5px 0 0;
  color:#d7c9df;
  font-size:8px;
  line-height:1.5;
}

.rebalanceActions{
  margin-top:16px;
  display:flex;
  justify-content:flex-end;
  gap:8px;
}

.rebalanceActions .primary{
  width:auto;
  margin-top:0;
}

.twinPlaybook{
  margin-top:28px;
  padding:34px;
  border:1px solid #dfd4e7;
  border-radius:24px;
  background:#fff;
}

.twinPlaybook .eyebrow{
  margin-top:0;
}

.twinPlaybook h2{
  margin:8px auto;
  max-width:760px;
  font-size:clamp(31px,4vw,48px);
  letter-spacing:-.045em;
}

.twinPlaybook>p{
  max-width:720px;
  margin:0 auto;
  color:#796b82;
  font-size:11px;
  line-height:1.6;
}

.lockedTwinGrid{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:9px;
  margin-top:22px;
}

.lockedTwinGrid article{
  padding:18px;
  border-radius:15px;
  background:#f6f2f9;
  text-align:left;
}

.lockedTwinGrid span,
.lockedTwinGrid strong,
.lockedTwinGrid b{
  display:block;
}

.lockedTwinGrid span{
  color:#94839d;
  font-size:7px;
  font-weight:900;
}

.lockedTwinGrid strong{
  margin-top:5px;
  font-size:13px;
}

.lockedTwinGrid b{
  margin-top:13px;
  color:#7c3aed;
  font-size:9px;
}

.freeTwinClue{
  margin-top:12px;
  padding:20px;
  border-radius:16px;
  background:
    linear-gradient(
      145deg,
      #211331,
      #38204f
    );
  color:#fff;
}

.freeTwinClue span{
  color:#c7add7;
  font-size:8px;
  font-weight:950;
  letter-spacing:.1em;
}

.freeTwinClue strong{
  display:block;
  margin-top:6px;
  font-size:19px;
}

.freeTwinClue p{
  margin:5px 0 0;
  color:#d9cce1;
  font-size:9px;
}


.twinGateActions{
  margin-top:18px;
  display:flex;
  justify-content:center;
  gap:9px;
  flex-wrap:wrap;
}

.twinGatePrimary{
  width:auto;
  margin-top:0;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  text-decoration:none;
}

.twinGateSecondary{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  text-decoration:none;
}

.twinUnlockButton{
  width:auto;
  margin:18px auto 0;
  padding-left:28px;
  padding-right:28px;
}

.gateNote{
  margin:12px auto 0;
  max-width:680px;
  color:#918199;
  font-size:8px;
  line-height:1.55;
}

.unlockedPlaybook{
  margin-top:20px;
  text-align:left;
}

.strategySummary{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:9px;
}

.strategySummary article{
  padding:16px;
  border:1px solid #e4d9e9;
  border-radius:14px;
  background:#f8f4fb;
}

.strategySummary span,
.strategySummary strong{
  display:block;
}

.strategySummary span{
  color:#8f7e98;
  font-size:7px;
  font-weight:900;
}

.strategySummary strong{
  margin-top:5px;
  font-size:12px;
}

.twinTimeline{
  display:grid;
  gap:8px;
  margin-top:14px;
}

.twinTimeline article{
  display:grid;
  grid-template-columns:70px repeat(4,1fr);
  gap:8px;
  align-items:center;
  padding:12px;
  border:1px solid #e4dbe9;
  border-radius:14px;
  background:#fff;
}

.twinTimeline article>div{
  min-width:0;
}

.twinTimeline span,
.twinTimeline strong{
  display:block;
}

.twinTimeline span{
  color:#94849d;
  font-size:7px;
  font-weight:900;
}

.twinTimeline strong{
  margin-top:3px;
  font-size:11px;
}

.timelineYear{
  padding-right:10px;
  border-right:1px solid #e9e1ed;
}

.timelineYear strong{
  color:#7c3aed;
  font-size:18px;
}

.playbookLesson{
  margin-top:14px;
  padding:19px;
  border-radius:16px;
  background:
    linear-gradient(
      145deg,
      #211331,
      #38204f
    );
  color:#fff;
}

.playbookLesson span{
  color:#cab5d8;
  font-size:8px;
  font-weight:950;
  letter-spacing:.1em;
}

.playbookLesson p{
  margin:6px 0 0;
  color:#dbcee3;
  font-size:10px;
  line-height:1.6;
}

@media(max-width:760px){
  .hero{
    padding-top:45px;
  }

  .modeGrid,
  .setupGrid{
    grid-template-columns:1fr;
  }

  .modeCard{
    min-height:0;
  }

  .previewCard{
    position:static;
  }

  .promise{
    gap:14px;
  }

  .readyStats{
    grid-template-columns:1fr;
  }

  .twinNotice{
    grid-template-columns:1fr;
  }

  .versus{
    margin:auto;
  }

  /* Wealth Simulator gameplay */

  .offerGrid,
  .choiceGrid,
  .lifestyleGrid,
  .moneyFlow,
  .allocationPreview,
  .budgetSummary{
    grid-template-columns:1fr;
  }

  .offerEnvelope{
    padding:24px;
  }

  .choiceCard p,
  .lifestyleCard p{
    min-height:0;
  }

  .eventScene,
  .yearResultScene{
    width:calc(100% - 24px);
    padding-top:35px;
  }

  .eventChoice{
    grid-template-columns:auto 1fr;
  }

  .eventArrow{
    display:none;
  }

  .annualStatement,
  .wealthBreakdown{
    grid-template-columns:repeat(2,1fr);
  }

  .netWorthOrb{
    width:205px;
    height:205px;
  }

  .eventScene h1,
  .yearResultScene h1{
    font-size:40px;
  }

  .gameHeader{
    padding:0 16px;
  }

  .finalScene{
    width:calc(100% - 24px);
    padding-top:36px;
  }

  .finalScene>h1{
    font-size:44px;
  }

  .finalComparison{
    grid-template-columns:1fr;
  }

  .comparisonVs{
    margin:auto;
  }

  .finalStats,
  .driverGrid{
    grid-template-columns:repeat(2,1fr);
  }

  .profilePanel{
    grid-template-columns:1fr;
    text-align:center;
  }

  .profilePanel h2{
    margin-left:auto;
  }

  .profilePanel p{
    margin-left:auto;
    margin-right:auto;
  }

  .scoreOrb{
    margin:auto;
  }

  .finalActions{
    flex-direction:column;
  }

  .finalPrimary,
  .finalSecondary{
    width:100%;
  }

  .courseCorrectActions,
  .rebalanceActions{
    flex-direction:column;
  }

  .courseCorrectActions .primary,
  .courseCorrectActions .secondary,
  .rebalanceActions .primary,
  .rebalanceActions .secondary{
    width:100%;
  }

  .rebalanceGrid{
    grid-template-columns:1fr;
  }

  .lockedTwinGrid{
    grid-template-columns:repeat(2,1fr);
  }

  .strategySummary{
    grid-template-columns:repeat(2,1fr);
  }

  .twinTimeline article{
    grid-template-columns:1fr 1fr;
  }

  .timelineYear{
    grid-column:1 / -1;
    border-right:0;
    border-bottom:1px solid #e9e1ed;
    padding:0 0 8px;
  }

  .twinGateActions{
    flex-direction:column;
  }

  .twinGatePrimary,
  .twinGateSecondary{
    width:100%;
  }
}
`;