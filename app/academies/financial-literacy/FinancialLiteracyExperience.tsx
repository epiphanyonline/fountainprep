"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  financialLiteracyPremiumBlueprint,
  type FinancialLiteracyModule,
  type FinancialLiteracySimulation,
} from "@/app/data/academies/personal-finance/premiumBlueprint";

type AssetExample = {
  id: string;
  name: string;
  type: string;
  valueDriver: string;
  returnSource: string;
  risk: string;
  liquidity: string;
  productive: string;
  canCreate: string;
};

const assetExamples: AssetExample[] = [
  {
    id: "house",
    name: "Rental Property",
    type: "Tangible · Real asset · Private",
    valueDriver:
      "Location, usefulness, demand, condition and the income it can produce.",
    returnSource:
      "Rental income plus possible capital appreciation.",
    risk:
      "Vacancy, repairs, financing costs, taxes, insurance and property-price falls.",
    liquidity:
      "Usually low. Selling property can take time and involve significant costs.",
    productive:
      "Potentially yes, when it produces rent or supports economic activity.",
    canCreate:
      "The property is usually purchased or developed; its productive value can be improved.",
  },
  {
    id: "bond",
    name: "Government Bond",
    type: "Financial asset · Fixed income · Public",
    valueDriver:
      "The issuer's ability to repay and the contractual cash flows promised.",
    returnSource:
      "Interest/coupon payments and repayment of principal, subject to the instrument's terms.",
    risk:
      "Interest-rate risk, inflation risk, credit/default risk and currency risk where relevant.",
    liquidity:
      "Can be relatively liquid for major government securities, but this varies.",
    productive:
      "It does not operate a business; it is a contractual financial claim.",
    canCreate:
      "Investors generally purchase bonds; authorised issuers create them by issuing debt.",
  },
  {
    id: "app",
    name: "Mobile App",
    type: "Intangible · Digital · Business asset",
    valueDriver:
      "Useful software, customers, intellectual property, brand, data and future cash-flow potential.",
    returnSource:
      "Subscriptions, advertising, transactions, licensing or sale of the business/asset.",
    risk:
      "Competition, poor adoption, technology failure, regulation, cyber risk and obsolescence.",
    liquidity:
      "Often low because valuation and sale can be difficult.",
    productive:
      "Potentially highly productive if it repeatedly delivers a useful service or earns revenue.",
    canCreate:
      "Yes. A developer or business can build software and associated intellectual property.",
  },
  {
    id: "patent",
    name: "Patent",
    type: "Intangible · Intellectual property · Legal right",
    valueDriver:
      "Legally protected, commercially useful technology with economic demand.",
    returnSource:
      "Licensing, royalties, product profits, strategic value or sale of rights.",
    risk:
      "Invalidation, expiry, infringement disputes, weak demand and technological replacement.",
    liquidity:
      "Usually low. Specialist buyers and valuation may be required.",
    productive:
      "Potentially, if it supports products, licensing or commercial advantage.",
    canCreate:
      "Potentially. Inventive work can lead to patentable technology, subject to legal requirements.",
  },
  {
    id: "gold",
    name: "Gold",
    type: "Tangible · Commodity · Alternative/real asset",
    valueDriver:
      "Scarcity, demand, market expectations, currency conditions and investor sentiment.",
    returnSource:
      "Primarily price appreciation unless held through an arrangement that separately generates income.",
    risk:
      "Price volatility, storage/custody costs and the possibility that its market value falls.",
    liquidity:
      "Often reasonably liquid in established markets, but form and transaction costs matter.",
    productive:
      "Normally not productive merely by being held.",
    canCreate:
      "No. It is extracted and refined rather than created by an investor.",
  },
  {
    id: "business",
    name: "Private Business",
    type: "Equity · Private asset · Productive asset",
    valueDriver:
      "Profits, cash flow, assets, intellectual property, brand, customers and growth potential.",
    returnSource:
      "Business profits, distributions/dividends and possible increase in business value.",
    risk:
      "Business failure, competition, poor management, debt, regulation and illiquidity.",
    liquidity:
      "Often low. Private ownership stakes may be difficult to sell.",
    productive:
      "Yes, when the business produces goods, services or cash flow.",
    canCreate:
      "Yes. Entrepreneurship can create a new business asset.",
  },
];

function lessonLabel(count: number) {
  return `${count} ${count === 1 ? "lesson" : "lessons"}`;
}

function simulationTitle(id: FinancialLiteracySimulation) {
  return financialLiteracyPremiumBlueprint.simulations[id].title;
}

export default function FinancialLiteracyExperience() {
  const blueprint = financialLiteracyPremiumBlueprint;
  const startHref = "/academies/financial-literacy/start";
  const premiumHref = "/pricing?product=academies";

  const [activeStage, setActiveStage] =
  useState<string>(
    blueprint.stages[0]?.id ?? "",
  );
  const [activeAssetId, setActiveAssetId] =
    useState(assetExamples[0].id);

  const activeAsset =
    assetExamples.find((asset) => asset.id === activeAssetId) ??
    assetExamples[0];

  const stageSimulationCounts = useMemo(
    () =>
      blueprint.stages.map((stage) => {
        const modules =
          stage.modules as readonly FinancialLiteracyModule[];
        return new Set(
          modules.flatMap(
            (module) => module.simulations ?? [],
          ),
        ).size;
      }),
    [blueprint.stages],
  );

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(
        "[data-stage-section]",
      ),
    );

    if (!elements.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio,
          );

        const id =
          visible[0]?.target.getAttribute(
            "data-stage-section",
          );

        if (id) {
          setActiveStage(id);
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0.12, 0.25, 0.45],
      },
    );

    elements.forEach((element) =>
      observer.observe(element),
    );

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>(
        "[data-reveal]",
      ),
    );

    if (!revealElements.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (
              entry.target as HTMLElement
            ).dataset.visible = "true";

            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.08,
      },
    );

    revealElements.forEach((element) =>
      observer.observe(element),
    );

    return () => observer.disconnect();
  }, []);

  return (
    <main className="financialPage">
      <section className="hero">
        <div className="heroGlow heroGlowOne" />
        <div className="heroGlow heroGlowTwo" />

        <div className="heroInner">
          <div className="heroCopy" data-reveal>
            <div className="heroBadges">
              <span className="badge badgeLight">
                Self-paced Academy
              </span>

              <span className="badge badgeDark">
                Powered by Fountain AI
              </span>

              <span className="badge badgeGold">
                Foundation free
              </span>
            </div>

            <p className="eyebrow">
              Financial Literacy Academy
            </p>

            <h1>
  Begin your
  <span>Financial Literacy Journey.</span>
</h1>

<p className="heroCopy">
  Understand money. Discover the asset classes that build wealth.
  Learn how financial markets work. Practise investing through
  simulations. Build the knowledge to make better financial
  decisions for life.
</p>

            <div className="heroActions">
  <Link href={startHref} className="primaryAction">
    <span className="ctaCopy">
      <strong>Start Free Foundation</strong>
      <small>No card required · Start in minutes</small>
    </span>
    <span className="ctaArrow" aria-hidden="true">→</span>
  </Link>

  <a href="#full-pathway" className="secondaryAction">
    <span className="ctaCopy">
      <strong>Explore the Full Pathway</strong>
      <small>See every stage before you subscribe</small>
    </span>
    <span className="secondaryArrow" aria-hidden="true">↓</span>
  </a>
</div>

            <div className="heroProof">
              <span>✓ No payment for Foundation</span>
              <span>✓ Interactive simulations</span>
              <span>✓ Progress saved</span>
              <span>✓ AI-assisted learning</span>
            </div>
          </div>

          <div className="heroVisual" data-reveal>
            <div className="heroVisualTop">
              <span>YOUR FINANCIAL JOURNEY</span>
              <b>8 stages</b>
            </div>

            <div className="heroJourney">
  {[
    ["01", "Money Is a Game — Know the Rules", "Free"],
["02", "High Income Is Not Wealth", "Premium"],
    [
      "03",
      "The Asset Classes That Create Wealth & Financial Independence",
      "Premium",
    ],
    ["04", "Build Your Financial Foundation", "Premium"],
    ["05", "How Financial Markets Really Work", "Premium"],
    ["06", "Build & Manage Your Investment Portfolio", "Premium"],
    ["07", "Design Your Path to Financial Freedom", "Premium"],
    ["08", "Build, Protect & Transfer Wealth", "Premium"],
  ].map(([number, label, access]) => (
    <div className="heroJourneyRow" key={number}>
      <span className="journeyNumber">
        {number}
      </span>

      <div>
        <strong>{label}</strong>
        <small>{access}</small>
      </div>

      <span className="journeyArrow">
        →
      </span>
    </div>
  ))}
</div>

            <div className="heroVisualFooter">
              <span>
                Your progress continues across devices
              </span>
              <b>Desktop · iPhone · Android</b>
            </div>
          </div>
        </div>
      </section>

      <section className="capabilitySection">
        <div className="sectionIntro" data-reveal>
          <p className="eyebrow">
            Learning built around capability
          </p>

          <h2>
            What will I actually be able to do?
          </h2>

          <span>
            Every stage is designed around an outcome,
            not simply a list of pages to read.
          </span>
        </div>

        <div className="capabilityGrid">
          {[
            {
              label: "After Foundation",
              title:
                "Stop measuring wealth by income alone.",
              text:
                "Understand the difference between income and wealth, learn the rules of money, control cash flow, calculate net worth and recognise the assets that can create long-term value.",
            },
            {
              label: "After Asset Literacy",
              title:
                "Analyse almost any asset.",
              text:
                "Explain why it has value, where return could come from, how liquid it is, and what could cause value to fall.",
            },
            {
              label: "After Financial Markets",
              title:
                "Understand how investing works.",
              text:
                "Follow how securities are issued, traded, priced and analysed — including order types and execution.",
            },
            {
              label: "After Portfolio Skills",
              title:
                "Build and defend a hypothetical portfolio.",
              text:
                "Use diversification, allocation, risk and liquidity reasoning in fictional scenarios.",
            },
            {
              label: "After Financial Freedom",
              title:
                "Model a long-term financial life.",
              text:
                "Connect assets, pensions, lifestyle, income and time to financial-independence scenarios.",
            },
          ].map((item) => (
            <article
              className="capabilityCard"
              data-reveal
              key={item.label}
            >
              <span>{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="pathwaySection"
        id="full-pathway"
      >
        <div className="pathwayShell">
          <aside className="pathwayNav">
            <div className="pathwayNavCard">
              <p>LEARNING JOURNEY</p>

              <nav aria-label="Financial literacy stages">
                {blueprint.stages.map(
                  (stage, index) => (
                    <a
                      href={`#stage-${stage.id}`}
                      className={
                        activeStage === stage.id
                          ? "navStage active"
                          : "navStage"
                      }
                      key={stage.id}
                    >
                      <span>
                        {String(
                          index + 1,
                        ).padStart(2, "0")}
                      </span>

                      <strong>{stage.title}</strong>
                    </a>
                  ),
                )}
              </nav>

              <Link href={startHref} className="navCta">
                <span>
                  <strong>Start Foundation Free</strong>
                  <small>No card required</small>
                </span>
                <b aria-hidden="true">→</b>
              </Link>
            </div>
          </aside>

          <div className="pathwayContent">
            <div className="sectionIntro" data-reveal>
              <p className="eyebrow">
                The complete pathway
              </p>

              <h2>
                See exactly what you&apos;re paying
                to unlock.
              </h2>

              <span>
                The full curriculum remains visible
                before subscribing. Foundation is open;
                Premium stages reveal the deeper
                learning, simulations and outcomes that
                come next.
              </span>
            </div>

            <div className="stageList">
              {blueprint.stages.map(
                (stage, stageIndex) => {
                  const isFree =
                    stage.access === "free";

                  const modules =
                    stage.modules as readonly FinancialLiteracyModule[];

                  const simulations =
                    Array.from(
                      new Set(
                        modules.flatMap(
                          (module) =>
                            module.simulations ?? [],
                        ),
                      ),
                    ) as FinancialLiteracySimulation[];

                  const isAssetStage =
                    stage.id ===
                    "understanding-assets";

                  return (
                    <article
                      id={`stage-${stage.id}`}
                      data-stage-section={stage.id}
                      data-reveal
                      className={
                        isAssetStage
                          ? "stageCard stageCardSignature"
                          : isFree
                            ? "stageCard stageCardFree"
                            : "stageCard"
                      }
                      key={stage.id}
                    >
                      <div className="stageHeader">
                        <div className="stageNumber">
                          {String(
                            stageIndex + 1,
                          ).padStart(2, "0")}
                        </div>

                        <div className="stageHeaderCopy">
                          <div className="stageMeta">
                            <span
                              className={
                                isFree
                                  ? "accessPill open"
                                  : "accessPill"
                              }
                            >
                              {isFree
                                ? "FREE FOUNDATION"
                                : "PREMIUM"}
                            </span>

                            <span>
                              {lessonLabel(
                                stage.estimatedLessons,
                              )}
                            </span>

                            {stageSimulationCounts[
                              stageIndex
                            ] > 0 ? (
                              <span>
                                {
                                  stageSimulationCounts[
                                    stageIndex
                                  ]
                                }{" "}
                                interactive{" "}
                                {stageSimulationCounts[
                                  stageIndex
                                ] === 1
                                  ? "lab"
                                  : "labs"}
                              </span>
                            ) : null}
                          </div>

                          <h3>
                            {isFree
                              ? "High Income Is Not Wealth"
                              : stage.title}
                          </h3>

                          <p>
                            {isFree
                              ? "Discover why earning more is not the same as building wealth. Learn the rules of money, understand cash flow, assets, liabilities and net worth, then make your first fictional wealth-building decision."
                              : stage.description}
                          </p>
                        </div>
                      </div>

                      {isAssetStage ? (
                        <div className="signatureBanner">
                          <span>
                            FOUNTAINPREP SIGNATURE
                          </span>
                          <strong>
                            Learn to see wealth beyond
                            cash, shares and property.
                          </strong>
                        </div>
                      ) : null}

                      <div className="stageOutcome">
                        <span>STAGE OUTCOME</span>
                        <strong>{stage.outcome}</strong>
                      </div>

                      <div className="moduleGrid">
                        {modules.map(
                          (
                            module,
                            moduleIndex,
                          ) => (
                            <article
                              className="moduleCard"
                              key={module.id}
                            >
                              <div className="moduleTop">
                                <span>
                                  Module{" "}
                                  {moduleIndex + 1}
                                </span>

                                <b
                                  className={
                                    isFree
                                      ? "moduleLock open"
                                      : "moduleLock"
                                  }
                                >
                                  {isFree ? "✓" : "🔒"}
                                </b>
                              </div>

                              <h4>
                                {module.title}
                              </h4>

                              <p>
                                {
                                  module.description
                                }
                              </p>

                              <div className="moduleMeta">
                                <span>
                                  {lessonLabel(
                                    module.estimatedLessons,
                                  )}
                                </span>

                                {module
                                  .simulations
                                  ?.length ? (
                                  <span>
                                    Interactive lab
                                  </span>
                                ) : null}
                              </div>
                            </article>
                          ),
                        )}
                      </div>

                      {simulations.length ? (
                        <div className="simulationStrip">
                          <div className="simulationMark">
                            ◈
                          </div>

                          <div>
                            <span>
                              INTERACTIVE PRACTICE
                            </span>
                            <p>
                              {simulations
                                .map(
                                  simulationTitle,
                                )
                                .join(" • ")}
                            </p>
                          </div>
                        </div>
                      ) : null}

                      <div className="stageFooter">
                        {isFree ? (
                          <Link href={startHref} className="stageFreeCta">
                            <span>
                              <strong>Start Free Foundation</strong>
                              <small>Begin the first lesson now</small>
                            </span>
                            <b aria-hidden="true">→</b>
                          </Link>
                        ) : (
                          <>
                            <Link
                              href={premiumHref}
                              className="button stageButton"
                            >
                              Unlock Premium
                            </Link>

                            <span>
                              Curriculum visible before
                              subscribing
                            </span>
                          </>
                        )}
                      </div>
                    </article>
                  );
                },
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="assetLensSection">
        <div className="sectionIntro light" data-reveal>
          <p className="eyebrow">
            The FountainPrep Asset Lens
          </p>

          <h2>
            Tap an asset. Learn how to think about
            it.
          </h2>

          <span>
            One framework. Different assets.
            Different economics.
          </span>
        </div>

        <div className="assetLensExperience" data-reveal>
          <div className="assetPicker">
            {assetExamples.map((asset) => (
              <button
                type="button"
                className={
                  activeAsset.id === asset.id
                    ? "assetChip active"
                    : "assetChip"
                }
                onClick={() =>
                  setActiveAssetId(asset.id)
                }
                key={asset.id}
              >
                {asset.name}
              </button>
            ))}
          </div>

          <div className="assetAnalysis">
            <div className="assetSummary">
              <span>ASSET EXAMPLE</span>
              <h3>{activeAsset.name}</h3>
              <p>{activeAsset.type}</p>
            </div>

            <div className="assetAnswers">
              {[
                [
                  "Why does it have value?",
                  activeAsset.valueDriver,
                ],
                [
                  "Where could return come from?",
                  activeAsset.returnSource,
                ],
                [
                  "What are the risks?",
                  activeAsset.risk,
                ],
                [
                  "How liquid is it?",
                  activeAsset.liquidity,
                ],
                [
                  "Is it productive?",
                  activeAsset.productive,
                ],
                [
                  "Can it be created?",
                  activeAsset.canCreate,
                ],
              ].map(([title, answer]) => (
                <article key={title}>
                  <span>{title}</span>
                  <p>{answer}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="simulationSection">
        <div className="sectionIntro" data-reveal>
          <p className="eyebrow">
            Learn by doing
          </p>

          <h2>
            Financial simulations make the
            consequences visible.
          </h2>

          <span>
            Fictional money. Real reasoning. No
            brokerage connection and no real money at
            risk.
          </span>
        </div>

        <div className="simulationGrid">
          {(
            Object.entries(
              blueprint.simulations,
            ) as Array<
              [
                FinancialLiteracySimulation,
                {
                  readonly title: string;
                  readonly description: string;
                },
              ]
            >
          ).map(
            (
              [simulationId, simulation],
              index,
            ) => (
              <article
                className="simulationCard"
                data-reveal
                key={simulationId}
              >
                <div className="simTop">
                  <span>
                    {String(index + 1).padStart(
                      2,
                      "0",
                    )}
                  </span>

                  <b>◈</b>
                </div>

                <h3>{simulation.title}</h3>

                <p>{simulation.description}</p>

                <div className="simFooter">
                  <span>
                    {simulationId === "money-lab" ||
                    simulationId === "budget-lab"
                      ? "Foundation experience"
                      : "Premium simulation"}
                  </span>
                </div>
              </article>
            ),
          )}
        </div>
      </section>

      <section className="masterySection">
        <div className="masteryCard" data-reveal>
          <div>
            <p className="eyebrow">
              Built for mastery
            </p>

            <h2>
              Understand. Apply. Simulate.
              Master.
            </h2>

            <span>
              FountainPrep measures understanding
              rather than simply marking a page as
              viewed.
            </span>
          </div>

          <div className="masteryLevels">
            <article>
              <span>80%+</span>
              <strong>Mastered</strong>
              <p>
                Learner demonstrates strong
                understanding.
              </p>
            </article>

            <article>
              <span>60–79%</span>
              <strong>Developing</strong>
              <p>
                More practice recommended before
                moving on.
              </p>
            </article>

            <article>
              <span>&lt;60%</span>
              <strong>Review Recommended</strong>
              <p>
                Review, Ask Ayo and retry with another
                example.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="freedomSection">
        <div className="freedomCard" data-reveal>
          <p className="eyebrow">THE DESTINATION</p>

          <h2>
            A financial life is built one decision
            at a time.
          </h2>

          <p className="freedomIntro">
            The goal is not to memorise investments.
            It is to understand how money, assets,
            risk, time and behaviour work together.
          </p>

          <div className="freedomTimeline">
            {[
              ["01", "Earn", "Build earning capacity"],
              ["02", "Manage", "Control cash flow"],
              ["03", "Protect", "Build resilience"],
              ["04", "Own", "Acquire or create assets"],
              ["05", "Invest", "Grow productive capital"],
              ["06", "Freedom", "Increase long-term choice"],
            ].map(
              ([number, title, text]) => (
                <article key={number}>
                  <span>{number}</span>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </article>
              ),
            )}
          </div>

          <div className="freedomActions">
            <Link href={startHref} className="freedomPrimaryCta">
              <span>
                <strong>Start Free Foundation</strong>
                <small>No card required</small>
              </span>
              <b aria-hidden="true">→</b>
            </Link>

            <Link
              href={premiumHref}
              className="button buttonGhost"
            >
              View Premium Access
            </Link>
          </div>
        </div>
      </section>

      <div className="mobileCta">
        <Link href={startHref}>
          <span>
            <strong>Start Free Foundation</strong>
            <small>No card required</small>
          </span>
          <b aria-hidden="true">→</b>
        </Link>
      </div>

      <style jsx>{`
        .financialPage {
          --purple:#7c3aed;
          --purpleDark:#5b21b6;
          --purpleDeep:#21142f;
          --purpleSoft:#f6f1ff;
          --green:#16803d;
          --ink:#21142f;
          --muted:#70667a;
          --line:rgba(61,38,80,.09);

          min-height:100vh;
          color:var(--ink);
          background:
            linear-gradient(180deg,#fff,#fbf9ff 46%,#fff);
          overflow-x:hidden;
        }

        .hero {
          position:relative;
          overflow:hidden;
          min-height:800px;
          background:
            linear-gradient(
              135deg,
              #ffffff 0%,
              #fbf8ff 48%,
              #f2eaff 100%
            );
          border-bottom:1px solid rgba(124,58,237,.06);
        }

        .heroGlow {
          position:absolute;
          border-radius:50%;
          filter:blur(2px);
          pointer-events:none;
        }

        .heroGlowOne {
          width:560px;
          height:560px;
          right:-180px;
          top:-180px;
          background:
            radial-gradient(
              circle,
              rgba(124,58,237,.18),
              rgba(124,58,237,0) 68%
            );
        }

        .heroGlowTwo {
          width:420px;
          height:420px;
          left:-180px;
          bottom:-160px;
          background:
            radial-gradient(
              circle,
              rgba(196,181,253,.19),
              rgba(196,181,253,0) 70%
            );
        }

        .heroInner,
        .capabilitySection,
        .pathwayShell,
        .assetLensSection,
        .simulationSection,
        .masterySection,
        .freedomSection {
          width:min(1320px,calc(100% - 40px));
          margin-left:auto;
          margin-right:auto;
        }

        .heroInner {
          position:relative;
          z-index:2;
          min-height:800px;
          display:grid;
          grid-template-columns:minmax(0,1.04fr) minmax(420px,.96fr);
          align-items:center;
          gap:70px;
          padding:86px 0;
        }

        [data-reveal] {
          opacity:0;
          transform:translateY(26px);
          transition:
            opacity .7s cubic-bezier(.2,.8,.2,1),
            transform .7s cubic-bezier(.2,.8,.2,1);
        }

        [data-reveal][data-visible="true"] {
          opacity:1;
          transform:none;
        }

        .heroBadges {
          display:flex;
          gap:8px;
          flex-wrap:wrap;
          margin-bottom:22px;
        }

        .badge {
          min-height:31px;
          display:inline-flex;
          align-items:center;
          padding:0 11px;
          border-radius:999px;
          font-size:10px;
          font-weight:950;
          letter-spacing:.075em;
          text-transform:uppercase;
        }

        .badgeLight {
          color:#5b21b6;
          background:#ede9fe;
        }

        .badgeDark {
          color:#fff;
          background:#21142f;
        }

        .badgeGold {
          color:#7c2d12;
          background:#fff7ed;
          border:1px solid #fed7aa;
        }

        .eyebrow {
          margin:0;
          color:var(--purple);
          font-size:12px;
          font-weight:950;
          letter-spacing:.11em;
          text-transform:uppercase;
        }

        .hero h1 {
          max-width:900px;
          margin:15px 0 24px;
          font-size:clamp(58px,7.3vw,96px);
          line-height:.92;
          letter-spacing:-.065em;
        }

        .hero h1 span {
          display:block;
          color:var(--purple);
        }

        .heroIntro {
          max-width:760px;
          margin:0;
          color:#5f5468;
          font-size:19px;
          line-height:1.72;
        }

        .heroActions,
        .freedomActions {
          display:flex;
          flex-wrap:wrap;
          gap:12px;
          margin-top:30px;
        }

        .button {
          min-height:54px;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          padding:0 23px;
          border-radius:17px;
          font-size:14px;
          font-weight:900;
          text-decoration:none;
          transition:
            transform .18s ease,
            box-shadow .18s ease;
        }

        .button:hover {
          transform:translateY(-2px);
        }

        .primaryAction,
        .secondaryAction {
          position:relative;
          min-height:72px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:22px;
          min-width:285px;
          padding:10px 12px 10px 21px;
          border-radius:21px;
          font-size:14px;
          font-weight:900;
          text-decoration:none;
          overflow:hidden;
          isolation:isolate;
          transition:
            transform .22s cubic-bezier(.2,.8,.2,1),
            box-shadow .22s ease,
            border-color .22s ease;
        }

        .primaryAction::before {
          content:"";
          position:absolute;
          inset:-45%;
          z-index:-1;
          background:
            radial-gradient(
              circle at 28% 45%,
              rgba(255,255,255,.25),
              transparent 30%
            );
          transform:translateX(-35%);
          transition:transform .5s ease;
        }

        .primaryAction {
          color:#fff;
          background:
            linear-gradient(
              135deg,
              #8b5cf6 0%,
              #7c3aed 40%,
              #5b21b6 100%
            );
          border:1px solid rgba(255,255,255,.18);
          box-shadow:
            0 18px 38px rgba(91,33,182,.28),
            0 4px 12px rgba(91,33,182,.18),
            inset 0 1px 0 rgba(255,255,255,.22);
        }

        .primaryAction:hover {
          transform:translateY(-3px) scale(1.01);
          box-shadow:
            0 26px 54px rgba(91,33,182,.34),
            0 8px 20px rgba(91,33,182,.18);
        }

        .primaryAction:hover::before {
          transform:translateX(20%);
        }

        .secondaryAction {
          color:#4c1d95;
          background:rgba(255,255,255,.88);
          border:1px solid rgba(124,58,237,.18);
          box-shadow:
            0 12px 32px rgba(49,29,72,.07),
            inset 0 1px 0 rgba(255,255,255,.9);
          backdrop-filter:blur(12px);
        }

        .secondaryAction:hover {
          transform:translateY(-3px);
          border-color:rgba(124,58,237,.35);
          box-shadow:0 18px 40px rgba(49,29,72,.11);
        }

        .ctaCopy {
          min-width:0;
          display:flex;
          flex-direction:column;
          align-items:flex-start;
          text-align:left;
        }

        .ctaCopy strong {
          font-size:15px;
          line-height:1.2;
          letter-spacing:-.01em;
        }

        .ctaCopy small {
          margin-top:4px;
          color:rgba(255,255,255,.74);
          font-size:10px;
          font-weight:760;
          line-height:1.25;
        }

        .secondaryAction .ctaCopy small {
          color:#81728d;
        }

        .ctaArrow,
        .secondaryArrow {
          width:44px;
          height:44px;
          flex:0 0 44px;
          display:grid;
          place-items:center;
          border-radius:14px;
          font-size:20px;
          transition:transform .2s ease;
        }

        .ctaArrow {
          color:#5b21b6;
          background:#fff;
          box-shadow:0 8px 20px rgba(39,20,56,.18);
        }

        .secondaryArrow {
          color:#6d28d9;
          background:#f4edff;
        }

        .primaryAction:hover .ctaArrow {
          transform:translateX(3px);
        }

        .secondaryAction:hover .secondaryArrow {
          transform:translateY(3px);
        }

        .heroProof {
          display:flex;
          flex-wrap:wrap;
          gap:9px;
          margin-top:28px;
        }

        .heroProof span {
          padding:8px 11px;
          border-radius:999px;
          color:#5e5268;
          background:rgba(255,255,255,.78);
          border:1px solid rgba(124,58,237,.08);
          font-size:11px;
          font-weight:780;
        }

        .heroVisual {
          position:relative;
          padding:25px;
          border-radius:36px;
          background:
            rgba(255,255,255,.92);
          border:1px solid rgba(124,58,237,.10);
          box-shadow:
            0 35px 100px
            rgba(52,29,78,.14);
          backdrop-filter:blur(14px);
        }

        .heroVisual::before {
          content:"";
          position:absolute;
          inset:10px;
          border-radius:28px;
          border:1px solid rgba(124,58,237,.04);
          pointer-events:none;
        }

        .heroVisualTop,
        .heroVisualFooter {
          position:relative;
          z-index:2;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
        }

        .heroVisualTop span {
          color:#7c3aed;
          font-size:10px;
          font-weight:950;
          letter-spacing:.1em;
        }

        .heroVisualTop b {
          color:#716679;
          font-size:11px;
        }

        .heroJourney {
          position:relative;
          z-index:2;
          display:grid;
          gap:9px;
          margin:22px 0;
        }

        .heroJourneyRow {
          display:grid;
          grid-template-columns:42px 1fr auto;
          align-items:center;
          gap:12px;
          padding:13px 14px;
          border-radius:16px;
          background:
            linear-gradient(
              135deg,
              #faf7ff,
              #f5efff
            );
        }

        .heroJourneyRow:first-child {
          background:
            linear-gradient(
              135deg,
              #f3fff6,
              #e9fff0
            );
        }

        .journeyNumber {
          width:36px;
          height:36px;
          display:grid;
          place-items:center;
          border-radius:11px;
          color:#7c3aed;
          background:#fff;
          font-size:10px;
          font-weight:950;
        }

        .heroJourneyRow:first-child
        .journeyNumber {
          color:#15803d;
        }

        .heroJourneyRow strong,
        .heroJourneyRow small {
          display:block;
        }

        .heroJourneyRow strong {
          color:#372545;
          font-size:13px;
        }

        .heroJourneyRow small {
          margin-top:2px;
          color:#8b8092;
          font-size:9px;
          font-weight:800;
        }

        .journeyStatus {
          width:30px;
          height:30px;
          display:grid;
          place-items:center;
          border-radius:50%;
          color:#6d28d9;
          background:#ede9fe;
          font-size:9px;
        }

        .journeyStatus.open {
          color:#166534;
          background:#dcfce7;
        }

        .heroVisualFooter {
          padding-top:15px;
          border-top:1px solid rgba(124,58,237,.07);
        }

        .heroVisualFooter span,
        .heroVisualFooter b {
          color:#82758b;
          font-size:9px;
        }

        .heroVisualFooter b {
          color:#5b21b6;
        }

        .capabilitySection,
        .simulationSection,
        .masterySection {
          padding:96px 0;
        }

        .sectionIntro {
          max-width:900px;
          margin-bottom:34px;
        }

        .sectionIntro h2 {
          margin:14px 0 16px;
          font-size:clamp(42px,5vw,66px);
          line-height:.98;
          letter-spacing:-.055em;
        }

        .sectionIntro > span {
          display:block;
          max-width:760px;
          color:#716679;
          font-size:16px;
          line-height:1.72;
        }

        .capabilityGrid {
          display:grid;
          grid-template-columns:repeat(12,minmax(0,1fr));
          gap:14px;
        }

        .capabilityCard {
          min-height:235px;
          grid-column:span 4;
          padding:25px;
          border-radius:26px;
          background:#fff;
          border:1px solid var(--line);
          box-shadow:
            0 16px 50px rgba(49,29,72,.055);
        }

        .capabilityCard:nth-child(4),
        .capabilityCard:nth-child(5) {
          grid-column:span 6;
        }

        .capabilityCard > span {
          color:#7c3aed;
          font-size:10px;
          font-weight:950;
          letter-spacing:.08em;
          text-transform:uppercase;
        }

        .capabilityCard h3 {
          margin:28px 0 10px;
          font-size:24px;
          line-height:1.08;
          letter-spacing:-.04em;
        }

        .capabilityCard p {
          margin:0;
          color:#74697d;
          font-size:14px;
          line-height:1.65;
        }

        .pathwaySection {
          padding:88px 0 102px;
          background:
            linear-gradient(
              180deg,
              #faf7ff,
              #f7f1ff
            );
          border-top:1px solid rgba(124,58,237,.05);
          border-bottom:1px solid rgba(124,58,237,.05);
        }

        .pathwayShell {
          display:grid;
          grid-template-columns:260px minmax(0,1fr);
          align-items:start;
          gap:28px;
        }

        .pathwayNav {
          position:sticky;
          top:88px;
        }

        .pathwayNavCard {
          padding:18px;
          border-radius:25px;
          background:#fff;
          border:1px solid rgba(124,58,237,.09);
          box-shadow:
            0 18px 55px
            rgba(49,29,72,.06);
        }

        .pathwayNavCard > p {
          margin:0 0 13px;
          color:#8a7d93;
          font-size:9px;
          font-weight:950;
          letter-spacing:.12em;
        }

        .pathwayNavCard nav {
          display:grid;
          gap:5px;
        }

        .navStage {
          display:grid;
          grid-template-columns:29px 1fr;
          align-items:center;
          gap:8px;
          min-height:45px;
          padding:8px;
          border-radius:13px;
          color:#73677c;
          text-decoration:none;
          transition:
            background .18s ease,
            color .18s ease,
            transform .18s ease;
        }

        .navStage span {
          font-size:9px;
          font-weight:950;
          color:#a99eb0;
        }

        .navStage strong {
          font-size:11px;
          line-height:1.3;
        }

        .navStage:hover,
        .navStage.active {
          color:#5b21b6;
          background:#f4edff;
          transform:translateX(2px);
        }

        .navStage.active span {
          color:#7c3aed;
        }

        .navCta {
          min-height:60px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          margin-top:16px;
          padding:9px 10px 9px 14px;
          border-radius:17px;
          color:#fff;
          background:linear-gradient(135deg,#8b5cf6,#6d28d9 55%,#5b21b6);
          box-shadow:0 13px 30px rgba(91,33,182,.21);
          text-decoration:none;
          transition:transform .18s ease, box-shadow .18s ease;
        }

        .navCta:hover {
          transform:translateY(-2px);
          box-shadow:0 18px 36px rgba(91,33,182,.27);
        }

        .navCta span {
          min-width:0;
          display:flex;
          flex-direction:column;
        }

        .navCta strong {
          font-size:11px;
          line-height:1.2;
        }

        .navCta small {
          margin-top:3px;
          color:rgba(255,255,255,.7);
          font-size:8px;
          font-weight:750;
        }

        .navCta b {
          width:34px;
          height:34px;
          flex:0 0 34px;
          display:grid;
          place-items:center;
          border-radius:11px;
          color:#5b21b6;
          background:#fff;
          font-size:15px;
        }

        .pathwayContent {
          min-width:0;
        }

        .stageList {
          display:grid;
          gap:20px;
        }

        .stageCard {
          scroll-margin-top:95px;
          overflow:hidden;
          border-radius:32px;
          background:#fff;
          border:1px solid rgba(74,51,94,.09);
          box-shadow:
            0 20px 65px
            rgba(49,29,72,.06);
        }

        .stageCardFree {
          border-color:rgba(22,163,74,.16);
          background:
            radial-gradient(
              circle at 100% 0,
              rgba(34,197,94,.06),
              transparent 30%
            ),
            #fff;
        }

        .stageCardSignature {
          border-color:rgba(124,58,237,.22);
          background:
            radial-gradient(
              circle at 100% 0,
              rgba(124,58,237,.12),
              transparent 32%
            ),
            #fff;
          box-shadow:
            0 24px 78px
            rgba(91,33,182,.11);
        }

        .stageHeader {
          display:grid;
          grid-template-columns:72px minmax(0,1fr);
          gap:22px;
          padding:28px 28px 22px;
        }

        .stageNumber {
          width:58px;
          height:58px;
          display:grid;
          place-items:center;
          border-radius:18px;
          color:#7c3aed;
          background:#f4edff;
          font-size:15px;
          font-weight:950;
        }

        .stageCardFree .stageNumber {
          color:#15803d;
          background:#ecfdf3;
        }

        .stageHeaderCopy {
          min-width:0;
        }

        .stageMeta {
          display:flex;
          gap:8px;
          flex-wrap:wrap;
          align-items:center;
        }

        .stageMeta > span {
          color:#8b8092;
          font-size:10px;
          font-weight:850;
        }

        .accessPill {
          display:inline-flex;
          min-height:26px;
          align-items:center;
          padding:0 9px;
          border-radius:999px;
          color:#6d28d9 !important;
          background:#f3e8ff;
          font-size:9px !important;
          font-weight:950 !important;
          letter-spacing:.075em;
        }

        .accessPill.open {
          color:#166534 !important;
          background:#dcfce7;
        }

        .stageHeader h3 {
          margin:14px 0 9px;
          font-size:clamp(32px,4vw,48px);
          line-height:1;
          letter-spacing:-.045em;
        }

        .stageHeader p {
          max-width:900px;
          margin:0;
          color:#6e6377;
          font-size:15px;
          line-height:1.67;
        }

        .signatureBanner {
          margin:0 28px 20px 122px;
          padding:16px 18px;
          border-radius:18px;
          background:
            linear-gradient(
              135deg,
              #21142f,
              #3a2055
            );
        }

        .signatureBanner span,
        .signatureBanner strong {
          display:block;
        }

        .signatureBanner span {
          color:#d8b4fe;
          font-size:9px;
          font-weight:950;
          letter-spacing:.11em;
        }

        .signatureBanner strong {
          margin-top:5px;
          color:#fff;
          font-size:15px;
        }

        .stageOutcome {
          margin:0 28px 0 122px;
          padding:16px 18px;
          border-radius:18px;
          background:#faf7ff;
          border:1px solid rgba(124,58,237,.055);
        }

        .stageCardFree .stageOutcome {
          background:#f4fff7;
          border-color:rgba(34,197,94,.08);
        }

        .stageOutcome span,
        .stageOutcome strong {
          display:block;
        }

        .stageOutcome span {
          color:#7c3aed;
          font-size:9px;
          font-weight:950;
          letter-spacing:.09em;
        }

        .stageCardFree .stageOutcome span {
          color:#15803d;
        }

        .stageOutcome strong {
          margin-top:5px;
          color:#504359;
          font-size:13px;
          line-height:1.55;
        }

        .moduleGrid {
          display:grid;
          grid-template-columns:repeat(3,minmax(0,1fr));
          gap:11px;
          padding:22px 28px;
        }

        .moduleCard {
          min-width:0;
          min-height:200px;
          padding:18px;
          border-radius:19px;
          background:
            linear-gradient(
              145deg,
              #fbf9ff,
              #f6f1ff
            );
          border:1px solid rgba(124,58,237,.07);
        }

        .stageCardFree .moduleCard {
          background:
            linear-gradient(
              145deg,
              #fbfffc,
              #f2fff6
            );
          border-color:rgba(34,197,94,.09);
        }

        .moduleTop {
          display:flex;
          justify-content:space-between;
          gap:8px;
        }

        .moduleTop > span {
          color:#918698;
          font-size:9px;
          font-weight:900;
          letter-spacing:.075em;
          text-transform:uppercase;
        }

        .moduleLock {
          font-size:11px;
        }

        .moduleLock.open {
          color:#16a34a;
        }

        .moduleCard h4 {
          margin:15px 0 8px;
          font-size:18px;
          line-height:1.18;
          letter-spacing:-.025em;
          overflow-wrap:anywhere;
        }

        .moduleCard p {
          margin:0;
          color:#786d80;
          font-size:12px;
          line-height:1.58;
        }

        .moduleMeta {
          display:flex;
          gap:6px;
          flex-wrap:wrap;
          margin-top:14px;
        }

        .moduleMeta span {
          padding:5px 7px;
          border-radius:999px;
          color:#6f42c1;
          background:#fff;
          font-size:8px;
          font-weight:900;
        }

        .simulationStrip {
          display:flex;
          align-items:center;
          gap:13px;
          margin:0 28px 20px;
          padding:15px 17px;
          border-radius:18px;
          color:#fff;
          background:
            linear-gradient(
              135deg,
              #21142f,
              #3a2055
            );
        }

        .simulationMark {
          width:39px;
          height:39px;
          flex:0 0 39px;
          display:grid;
          place-items:center;
          border-radius:12px;
          color:#e9d5ff;
          background:rgba(255,255,255,.09);
        }

        .simulationStrip span {
          color:#d8b4fe;
          font-size:9px;
          font-weight:950;
          letter-spacing:.08em;
        }

        .simulationStrip p {
          margin:3px 0 0;
          color:rgba(255,255,255,.76);
          font-size:11px;
          line-height:1.45;
        }

        .stageFooter {
          display:flex;
          align-items:center;
          gap:13px;
          flex-wrap:wrap;
          padding:0 28px 28px;
        }

        .stageButton {
          min-height:48px;
          color:#fff;
          background:
            linear-gradient(
              135deg,
              #7c3aed,
              #5b21b6
            );
        }

        .stageButton.free {
          background:#15803d;
        }

        .stageFreeCta {
          min-height:64px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:18px;
          min-width:290px;
          padding:9px 10px 9px 18px;
          border-radius:18px;
          color:#fff;
          background:linear-gradient(135deg,#22c55e 0%,#16a34a 52%,#15803d 100%);
          box-shadow:
            0 15px 34px rgba(21,128,61,.22),
            inset 0 1px 0 rgba(255,255,255,.2);
          text-decoration:none;
          transition:transform .2s ease, box-shadow .2s ease;
        }

        .stageFreeCta:hover {
          transform:translateY(-2px);
          box-shadow:0 21px 42px rgba(21,128,61,.28);
        }

        .stageFreeCta span {
          display:flex;
          flex-direction:column;
          text-align:left;
        }

        .stageFreeCta strong {
          font-size:13px;
          line-height:1.2;
        }

        .stageFreeCta small {
          margin-top:3px;
          color:rgba(255,255,255,.72);
          font-size:9px;
          font-weight:740;
        }

        .stageFreeCta b {
          width:40px;
          height:40px;
          flex:0 0 40px;
          display:grid;
          place-items:center;
          border-radius:13px;
          color:#166534;
          background:#fff;
          font-size:17px;
        }

        .stageFooter > span {
          color:#8b8092;
          font-size:10px;
          font-weight:760;
        }

        .assetLensSection {
          padding:98px 0;
        }

        .sectionIntro.light h2 {
          max-width:900px;
        }

        .assetLensExperience {
          overflow:hidden;
          border-radius:36px;
          background:
            linear-gradient(
              145deg,
              #21142f,
              #3b2056
            );
          box-shadow:
            0 30px 90px
            rgba(39,20,56,.18);
        }

        .assetPicker {
          display:flex;
          gap:8px;
          overflow-x:auto;
          padding:20px;
          border-bottom:1px solid rgba(255,255,255,.07);
          scrollbar-width:none;
        }

        .assetPicker::-webkit-scrollbar {
          display:none;
        }

        .assetChip {
          flex:0 0 auto;
          min-height:42px;
          padding:0 14px;
          border:1px solid rgba(255,255,255,.09);
          border-radius:999px;
          color:rgba(255,255,255,.68);
          background:rgba(255,255,255,.055);
          font:inherit;
          font-size:11px;
          font-weight:850;
          cursor:pointer;
          transition:
            background .18s ease,
            color .18s ease,
            transform .18s ease;
        }

        .assetChip:hover {
          transform:translateY(-1px);
        }

        .assetChip.active {
          color:#4c1d95;
          background:#fff;
        }

        .assetAnalysis {
          display:grid;
          grid-template-columns:minmax(250px,.38fr) minmax(0,.62fr);
          gap:28px;
          padding:34px;
        }

        .assetSummary {
          padding:24px;
          border-radius:24px;
          background:rgba(255,255,255,.07);
          border:1px solid rgba(255,255,255,.08);
        }

        .assetSummary > span {
          color:#d8b4fe;
          font-size:9px;
          font-weight:950;
          letter-spacing:.1em;
        }

        .assetSummary h3 {
          margin:22px 0 9px;
          color:#fff;
          font-size:38px;
          line-height:1;
          letter-spacing:-.045em;
        }

        .assetSummary p {
          margin:0;
          color:rgba(255,255,255,.65);
          font-size:13px;
          line-height:1.6;
        }

        .assetAnswers {
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:10px;
        }

        .assetAnswers article {
          min-height:145px;
          padding:18px;
          border-radius:18px;
          background:rgba(255,255,255,.065);
          border:1px solid rgba(255,255,255,.065);
        }

        .assetAnswers span {
          color:#d8b4fe;
          font-size:9px;
          font-weight:950;
          text-transform:uppercase;
          letter-spacing:.06em;
        }

        .assetAnswers p {
          margin:8px 0 0;
          color:rgba(255,255,255,.75);
          font-size:12px;
          line-height:1.55;
        }

        .simulationSection {
          padding-top:36px;
        }

        .simulationGrid {
          display:grid;
          grid-template-columns:repeat(5,minmax(0,1fr));
          gap:11px;
        }

        .simulationCard {
          min-width:0;
          min-height:235px;
          display:flex;
          flex-direction:column;
          padding:20px;
          border-radius:22px;
          background:#fff;
          border:1px solid var(--line);
          box-shadow:
            0 16px 48px
            rgba(49,29,72,.05);
        }

        .simTop {
          display:flex;
          align-items:center;
          justify-content:space-between;
        }

        .simTop span {
          color:#a093a8;
          font-size:9px;
          font-weight:950;
        }

        .simTop b {
          width:34px;
          height:34px;
          display:grid;
          place-items:center;
          border-radius:11px;
          color:#7c3aed;
          background:#f3e8ff;
        }

        .simulationCard h3 {
          margin:25px 0 8px;
          font-size:18px;
          letter-spacing:-.025em;
        }

        .simulationCard p {
          margin:0;
          color:#776c7f;
          font-size:12px;
          line-height:1.58;
        }

        .simFooter {
          margin-top:auto;
          padding-top:16px;
        }

        .simFooter span {
          display:inline-flex;
          padding:5px 8px;
          border-radius:999px;
          color:#6d28d9;
          background:#f5efff;
          font-size:8px;
          font-weight:900;
          text-transform:uppercase;
        }

        .masterySection {
          padding-top:18px;
        }

        .masteryCard {
          display:grid;
          grid-template-columns:.8fr 1.2fr;
          gap:45px;
          padding:50px;
          border-radius:36px;
          background:
            linear-gradient(
              135deg,
              #f8f4ff,
              #efe7ff
            );
          border:1px solid rgba(124,58,237,.07);
        }

        .masteryCard h2 {
          margin:14px 0 15px;
          font-size:clamp(40px,5vw,62px);
          line-height:.98;
          letter-spacing:-.055em;
        }

        .masteryCard > div > span {
          color:#6d6176;
          line-height:1.7;
        }

        .masteryLevels {
          display:grid;
          grid-template-columns:repeat(3,minmax(0,1fr));
          gap:10px;
        }

        .masteryLevels article {
          min-height:190px;
          padding:20px;
          border-radius:21px;
          background:#fff;
          border:1px solid rgba(124,58,237,.07);
        }

        .masteryLevels span,
        .masteryLevels strong {
          display:block;
        }

        .masteryLevels span {
          color:#7c3aed;
          font-size:11px;
          font-weight:950;
        }

        .masteryLevels strong {
          margin-top:25px;
          font-size:17px;
        }

        .masteryLevels p {
          margin:7px 0 0;
          color:#786d80;
          font-size:12px;
          line-height:1.55;
        }

        .freedomSection {
          padding:20px 0 105px;
        }

        .freedomCard {
          overflow:hidden;
          padding:64px;
          border-radius:42px;
          color:#fff;
          background:
            radial-gradient(
              circle at 90% 0,
              rgba(196,181,253,.25),
              transparent 28%
            ),
            linear-gradient(
              145deg,
              #21142f,
              #3b2056
            );
          box-shadow:
            0 35px 100px
            rgba(39,20,56,.18);
        }

        .freedomCard .eyebrow {
          color:#d8b4fe;
        }

        .freedomCard h2 {
          max-width:950px;
          margin:14px 0 16px;
          color:#fff;
          font-size:clamp(48px,6vw,78px);
          line-height:.94;
          letter-spacing:-.06em;
        }

        .freedomIntro {
          max-width:760px;
          margin:0;
          color:rgba(255,255,255,.65);
          font-size:16px;
          line-height:1.72;
        }

        .freedomTimeline {
          display:grid;
          grid-template-columns:repeat(6,minmax(0,1fr));
          gap:8px;
          margin-top:38px;
        }

        .freedomTimeline article {
          min-height:145px;
          padding:17px;
          border-radius:18px;
          background:rgba(255,255,255,.07);
          border:1px solid rgba(255,255,255,.07);
        }

        .freedomTimeline span,
        .freedomTimeline strong {
          display:block;
        }

        .freedomTimeline span {
          color:#d8b4fe;
          font-size:9px;
          font-weight:950;
        }

        .freedomTimeline strong {
          margin-top:20px;
          color:#fff;
          font-size:15px;
        }

        .freedomTimeline p {
          margin:5px 0 0;
          color:rgba(255,255,255,.57);
          font-size:10px;
          line-height:1.45;
        }

        .freedomPrimaryCta {
          min-height:70px;
          min-width:300px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:20px;
          padding:9px 10px 9px 19px;
          border-radius:20px;
          color:#4c1d95;
          background:#fff;
          box-shadow:0 18px 42px rgba(0,0,0,.16);
          text-decoration:none;
          transition:transform .2s ease, box-shadow .2s ease;
        }

        .freedomPrimaryCta:hover {
          transform:translateY(-3px);
          box-shadow:0 24px 50px rgba(0,0,0,.22);
        }

        .freedomPrimaryCta span {
          display:flex;
          flex-direction:column;
          text-align:left;
        }

        .freedomPrimaryCta strong {
          font-size:14px;
          line-height:1.2;
        }

        .freedomPrimaryCta small {
          margin-top:4px;
          color:#8a7d93;
          font-size:9px;
          font-weight:760;
        }

        .freedomPrimaryCta b {
          width:42px;
          height:42px;
          display:grid;
          place-items:center;
          border-radius:13px;
          color:#fff;
          background:linear-gradient(135deg,#8b5cf6,#6d28d9);
          font-size:18px;
        }

        .buttonLight {
          color:#4c1d95;
          background:#fff;
        }

        .buttonGhost {
          color:#fff;
          background:rgba(255,255,255,.08);
          border:1px solid rgba(255,255,255,.13);
        }

        .mobileCta {
          display:none;
        }

        @media(max-width:1160px) {
          .heroInner {
            grid-template-columns:1fr 430px;
            gap:42px;
          }

          .simulationGrid {
            grid-template-columns:repeat(3,minmax(0,1fr));
          }

          .freedomTimeline {
            grid-template-columns:repeat(3,minmax(0,1fr));
          }
        }

        @media(max-width:980px) {
          .hero {
            min-height:auto;
          }

          .heroInner {
            min-height:auto;
            grid-template-columns:1fr;
            padding:70px 0;
          }

          .heroCopy {
            max-width:850px;
          }

          .heroVisual {
            max-width:700px;
          }

          .capabilityCard,
          .capabilityCard:nth-child(4),
          .capabilityCard:nth-child(5) {
            grid-column:span 6;
          }

          .pathwayShell {
            grid-template-columns:1fr;
          }

          .pathwayNav {
            display:none;
          }

          .moduleGrid {
            grid-template-columns:repeat(2,minmax(0,1fr));
          }

          .assetAnalysis {
            grid-template-columns:1fr;
          }

          .masteryCard {
            grid-template-columns:1fr;
          }
        }

        @media(max-width:760px) {
          .heroInner,
          .capabilitySection,
          .pathwayShell,
          .assetLensSection,
          .simulationSection,
          .masterySection,
          .freedomSection {
            width:min(100% - 26px,1320px);
          }

          .hero h1 {
            font-size:clamp(48px,12vw,70px);
          }

          .heroIntro {
            font-size:16px;
          }

          .capabilityGrid {
            grid-template-columns:1fr;
          }

          .capabilityCard,
          .capabilityCard:nth-child(4),
          .capabilityCard:nth-child(5) {
            grid-column:auto;
            min-height:auto;
          }

          .stageHeader {
            grid-template-columns:1fr;
            gap:14px;
            padding:22px 18px 18px;
          }

          .stageNumber {
            width:48px;
            height:48px;
            border-radius:15px;
          }

          .signatureBanner,
          .stageOutcome {
            margin-left:18px;
            margin-right:18px;
          }

          .moduleGrid {
            grid-template-columns:1fr;
            padding:18px;
          }

          .moduleCard {
            min-height:auto;
          }

          .simulationStrip {
            margin-left:18px;
            margin-right:18px;
          }

          .stageFooter {
            padding-left:18px;
            padding-right:18px;
          }

          .assetAnswers {
            grid-template-columns:1fr;
          }

          .simulationGrid {
            grid-template-columns:repeat(2,minmax(0,1fr));
          }

          .masteryCard {
            padding:30px 22px;
          }

          .masteryLevels {
            grid-template-columns:1fr;
          }

          .masteryLevels article {
            min-height:auto;
          }

          .freedomCard {
            padding:42px 24px;
            border-radius:32px;
          }

          .freedomTimeline {
            grid-template-columns:repeat(2,minmax(0,1fr));
          }

          .mobileCta {
            position:fixed;
            z-index:50;
            left:10px;
            right:10px;
            bottom:
              max(
                10px,
                env(safe-area-inset-bottom)
              );
            display:block;
            padding:7px;
            border-radius:18px;
            background:rgba(255,255,255,.92);
            border:1px solid rgba(124,58,237,.12);
            box-shadow:
              0 16px 45px
              rgba(47,27,67,.18);
            backdrop-filter:blur(14px);
          }

          .mobileCta a {
            min-height:58px;
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:14px;
            padding:7px 8px 7px 16px;
            border-radius:14px;
            color:#fff;
            background:linear-gradient(135deg,#8b5cf6,#7c3aed 48%,#5b21b6);
            box-shadow:0 10px 24px rgba(91,33,182,.2);
            text-decoration:none;
          }

          .mobileCta a span {
            display:flex;
            flex-direction:column;
          }

          .mobileCta a strong {
            font-size:13px;
            line-height:1.2;
          }

          .mobileCta a small {
            margin-top:2px;
            color:rgba(255,255,255,.72);
            font-size:8px;
            font-weight:760;
          }

          .mobileCta a b {
            width:42px;
            height:42px;
            flex:0 0 42px;
            display:grid;
            place-items:center;
            border-radius:12px;
            color:#5b21b6;
            background:#fff;
            font-size:18px;
          }

          .freedomSection {
            padding-bottom:130px;
          }
        }

        @media(max-width:520px) {
          .heroInner,
          .capabilitySection,
          .pathwayShell,
          .assetLensSection,
          .simulationSection,
          .masterySection,
          .freedomSection {
            width:min(100% - 18px,1320px);
          }

          .heroInner {
            padding:50px 0;
          }

          .heroActions,
          .freedomActions {
            display:grid;
            gap:10px;
          }

          .button {
            width:100%;
          }

          .primaryAction,
          .secondaryAction,
          .stageFreeCta,
          .freedomPrimaryCta {
            width:100%;
            min-width:0;
          }

          .heroProof {
            display:grid;
            grid-template-columns:repeat(2,minmax(0,1fr));
          }

          .heroProof span {
            text-align:center;
          }

          .heroVisual {
            padding:16px;
            border-radius:27px;
          }

          .heroJourneyRow {
            grid-template-columns:38px 1fr auto;
            padding:11px;
          }

          .heroVisualFooter {
            align-items:flex-start;
            flex-direction:column;
          }

          .sectionIntro h2 {
            font-size:clamp(38px,11vw,52px);
          }

          .stageHeader h3 {
            font-size:clamp(30px,9vw,42px);
          }

          .stageMeta {
            align-items:flex-start;
          }

          .simulationStrip {
            align-items:flex-start;
          }

          .assetLensExperience {
            border-radius:28px;
          }

          .assetPicker {
            padding:15px;
          }

          .assetAnalysis {
            padding:18px;
          }

          .assetSummary {
            padding:20px;
          }

          .assetSummary h3 {
            font-size:32px;
          }

          .simulationGrid,
          .freedomTimeline {
            grid-template-columns:1fr;
          }

          .simulationCard {
            min-height:auto;
          }

          .freedomCard h2 {
            font-size:clamp(43px,12vw,60px);
          }
        }

        @media(prefers-reduced-motion:reduce) {
          [data-reveal] {
            opacity:1;
            transform:none;
            transition:none;
          }

          .button,
          .assetChip,
          .navStage {
            transition:none;
          }
        }
      `}</style>
    </main>
  );
}