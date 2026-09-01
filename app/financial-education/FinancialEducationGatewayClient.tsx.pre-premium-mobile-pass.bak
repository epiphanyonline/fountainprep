"use client";

import Link from "next/link";

import FinancialEducationAyoGuide from "./FinancialEducationAyoGuide";



const pillars = [
  {
    number: "01",
    eyebrow: "FINANCIAL LITERACY",
    title: "Understand money, assets and wealth-building decisions.",
    description:
      "Explore money, cash flow, saving, enterprise, assets, investing, risk, ownership, diversification and the decisions that shape financial life.",
    href: "/academies/financial-literacy",
    cta: "Explore Financial Literacy",
    tone: "finance",
  },
  {
    number: "02",
    eyebrow: "BIOGRAPHY OF GREATNESS",
    title: "Study the lives behind extraordinary wealth creation.",
    description:
      "Study remarkable wealth creators across countries: where they started, the businesses and assets behind their fortunes, pivotal decisions, setbacks, capital allocation and legacy.",
    href: "/academies/biography",
    cta: "Explore Biography of Greatness",
    tone: "biography",
  },
] as const;

const topics = [
  "Money & Cash Flow",
  "Asset Classes",
  "Business Ownership",
  "Investing",
  "Risk",
  "Capital Allocation",
  "Financial Decisions",
  "Legacy",
];

export default function FinancialEducationGatewayClient() {
  return (
    <main className="fe-page">
      <FinancialEducationAyoGuide />

      <section className="fe-hero">
        <div className="fe-heroGlow fe-glowOne" />
        <div className="fe-heroGlow fe-glowTwo" />

        <div className="fe-heroCopy">
          <div className="fe-kicker">
            <span />
            FOUNTAIN PREP FINANCIAL EDUCATION
          </div>

          <h1>
            Upgrade your
            <br />
            <em>financial literacy.</em>
          </h1>

          <p className="fe-heroLead">
            Learn how money, assets, enterprise, investing and capital
            allocation work — then study the lives and decisions behind
            extraordinary wealth creation.
          </p>

          <div className="fe-heroActions">
            <Link
              href="/academies/financial-literacy"
              className="fe-primary"
            >
              Start Financial Literacy
              <span>→</span>
            </Link>

            <a href="#explore" className="fe-secondary">
              Explore the two learning pathways
            </a>
          </div>

          <div className="fe-freeNote">
            <div className="fe-freeIcon">✦</div>

            <div>
              <strong>
                Experience Fountain Prep before you subscribe.
              </strong>
              <span>
                Complimentary learning experiences are available without
                entering payment details.
              </span>
            </div>
          </div>
        </div>

        <div className="fe-heroVisual">
          <div className="fe-screen fe-gameScreen">
            <div className="fe-screenTop">
              <div>
                <small>FOUNTAIN PREP MONEY GAMES</small>
                <strong>Learn by making decisions.</strong>
              </div>

              <span className="fe-liveChip">● PLAY NOW</span>
            </div>

            <div className="fe-gameCanvas">
              <div className="fe-gameIntro">
                <span>INTERACTIVE FINANCIAL SIMULATIONS</span>
                <h2>
                  Make the decision.
                  <br />
                  <em>See what happens.</em>
                </h2>
                <p>
                  Use fictional money, experience consequences and learn from
                  the outcome.
                </p>
              </div>

              <div className="fe-gameChoices">
                <Link
                  href="/academies/financial-literacy/investment-lab"
                  className="fe-gameChoice fe-investGame"
                >
                  <div className="fe-gameChoiceTop">
                    <span>01</span>
                    <small>INVESTMENT LAB</small>
                  </div>

                  <strong>FC100,000</strong>
                  <h3>Can you invest it?</h3>
                  <p>
                    Build a portfolio, face market shocks, buy, sell, hold and
                    compare your choices with your Financial Twin.
                  </p>

                  <div className="fe-gameMeta">
                    <span>12 market episodes</span>
                    <span>Investor score</span>
                  </div>

                  <b>▶ PLAY INVESTMENT GAME</b>
                </Link>

                <Link
                  href="/academies/financial-literacy/wealth-simulator"
                  className="fe-gameChoice fe-lifeGame fe-lifeWealth"
                >
                  <div className="fe-gameChoiceTop">
                    <span>02</span>
                    <small>LIFE &amp; WEALTH</small>
                  </div>

                  <strong>10 YEARS</strong>
                  <h3>Where will your choices take you?</h3>
                  <p>
                    Navigate income, housing, lifestyle, saving, investing and
                    unexpected events across ten simulated years.
                  </p>

                  <div className="fe-gameMeta">
                    <span>Year 01 → 10</span>
                    <span>Financial Twin</span>
                  </div>

                  <b>▶ PLAY LIFE &amp; WEALTH</b>
                </Link>
              </div>
            </div>

            <div className="fe-screenFooter">
              <span>FICTIONAL MONEY. REAL DECISIONS.</span>
              <div className="fe-progressTrack">
                <i />
              </div>
              <span>CHOOSE A GAME ↑</span>
            </div>
          </div>

          <div className="fe-floatingCard fe-floatingOne">
            <small>YOUR FINANCIAL TWIN</small>
            <strong>Same start. Different decisions.</strong>
            <span>Who finishes stronger?</span>
          </div>

          <div className="fe-floatingCard fe-floatingTwo">
            <small>YOU&apos;RE IN CONTROL</small>
            <strong>Every decision changes the outcome.</strong>
          </div>
        </div>
      </section>

      <section className="fe-topicRail" aria-label="Financial education topics">
        <div className="fe-topicRailInner">
          {topics.map((topic) => (
            <span key={topic}>{topic}</span>
          ))}
        </div>
      </section>

      <section className="fe-investmentLab">
        <div className="fe-labGlow" />

        <div className="fe-labCopy">
          <div className="fe-sectionEyebrow">
            FOUNTAIN PREP INVESTMENT LAB
          </div>

          <h2>
            Could you successfully invest
            <br />
            <span>FC100,000?</span>
          </h2>

          <p className="fe-labLead">
            Build a fictional portfolio, experience changing markets and make
            the decisions real investors face — without risking real money.
          </p>

          <div className="fe-labFeatures">
            <span>12 market episodes</span>
            <span>Market events</span>
            <span>Portfolio decisions</span>
            <span>Investor score</span>
          </div>

          <div className="fe-labActions">
            <Link
              href="/academies/financial-literacy/investment-lab"
              className="fe-labPrimary"
            >
              Enter the Investment Lab
              <span>→</span>
            </Link>

            <Link
              href="/academies/financial-literacy"
              className="fe-labSecondary"
            >
              Explore Financial Literacy
            </Link>
          </div>

          <small className="fe-labDisclaimer">
            A fictional learning simulation. No real money is invested and
            nothing shown is investment advice.
          </small>
        </div>

        <div className="fe-labVisual" aria-hidden="true">
          <div className="fe-labTerminal">
            <div className="fe-labTerminalTop">
              <div>
                <small>INVESTMENT LAB</small>
                <strong>Portfolio Simulation</strong>
              </div>
              <span>EPISODE 01 / 12</span>
            </div>

            <div className="fe-labCapital">
              <small>STARTING CAPITAL</small>
              <strong>FC100,000</strong>
              <span>Build your starting portfolio</span>
            </div>

            <div className="fe-labAllocation">
              <div>
                <span>Equities</span>
                <strong>35%</strong>
                <i style={{ width: "35%" }} />
              </div>
              <div>
                <span>Fixed Income</span>
                <strong>30%</strong>
                <i style={{ width: "30%" }} />
              </div>
              <div>
                <span>Property</span>
                <strong>15%</strong>
                <i style={{ width: "15%" }} />
              </div>
              <div>
                <span>Cash</span>
                <strong>20%</strong>
                <i style={{ width: "20%" }} />
              </div>
            </div>

            <div className="fe-labEvent">
              <small>MARKET EVENT</small>
              <strong>Markets fall sharply.</strong>
              <p>What would you do?</p>
              <div>
                <span>Sell</span>
                <span>Hold</span>
                <span>Rebalance</span>
              </div>
            </div>
          </div>

          <div className="fe-labScore">
            <small>INVESTOR SCORE</small>
            <strong>82</strong>
            <span>/ 100</span>
          </div>
        </div>
      </section>

      <section className="fe-lifeSection">
        <div className="fe-lifeCopy">
          <div className="fe-sectionEyebrow">
            LIFE &amp; WEALTH SIMULATOR
          </div>

          <h2>
            Same starting point.
            <br />
            <span>Ten years of decisions.</span>
          </h2>

          <p>
            Salary is only the beginning. Navigate take-home pay, housing,
            transport, lifestyle, saving, investing and unexpected events —
            then compare your outcome with your Financial Twin.
          </p>

          <div className="fe-lifeStats">
            <article>
              <small>SIMULATION</small>
              <strong>10 years</strong>
            </article>
            <article>
              <small>DECISIONS</small>
              <strong>Real-life trade-offs</strong>
            </article>
            <article>
              <small>COMPARISON</small>
              <strong>Your Financial Twin</strong>
            </article>
          </div>

          <Link
            href="/academies/financial-literacy/wealth-simulator"
            className="fe-lifeButton"
          >
            Enter Life &amp; Wealth
            <span>→</span>
          </Link>
        </div>

        <div className="fe-lifeBoard" aria-hidden="true">
          <div className="fe-lifeYear">
            <small>YEAR</small>
            <strong>01</strong>
          </div>

          <div className="fe-lifeRoute">
            <span />
            <i />
            <span />
            <i />
            <span />
          </div>

          <div className="fe-lifeYear">
            <small>YEAR</small>
            <strong>10</strong>
          </div>

          <div className="fe-lifeOutcome">
            <small>THE QUESTION</small>
            <strong>
              What happens when the same income is allocated differently?
            </strong>
          </div>
        </div>
      </section>

      <section className="fe-manifesto">
        <div className="fe-sectionEyebrow">
          A BROADER VIEW OF FINANCIAL LITERACY
        </div>

        <div className="fe-manifestoGrid">
          <h2>
            Money is important.
            <br />
            <span>Understanding value is even broader.</span>
          </h2>

          <div className="fe-manifestoCopy">
            <p>
              A person may earn well and understand little about assets,
              ownership, risk or capital allocation. Income alone does not
              create financial understanding.
            </p>

            <p>
              Fountain Prep combines structured financial learning with the
              study of real wealth-building journeys — without promising
              shortcuts, formulas or guaranteed financial outcomes.
            </p>
          </div>
        </div>
      </section>

      <section className="fe-perspectives" id="explore">
        <div className="fe-perspectiveHeading">
          <div>
            <span>EXPLORE</span>
            <h2>
              Two learning pathways.
              <br />
              One richer financial understanding.
            </h2>
          </div>

          <p>
            Build financial capability through structured learning, then deepen
            that understanding through the stories, decisions and setbacks of
            remarkable wealth creators.
          </p>
        </div>

        <div className="fe-pillarGrid">
          {pillars.map((pillar) => (
            <article
              key={pillar.number}
              className={`fe-pillar fe-${pillar.tone}`}
            >
              <div className="fe-pillarTop">
                <span className="fe-pillarNumber">{pillar.number}</span>
                <span className="fe-pillarEyebrow">{pillar.eyebrow}</span>
              </div>

              <div className="fe-pillarVisual">
                {pillar.tone === "finance" ? (
                  <div className="fe-financeVisual">
                    <div>
                      <small>CASH</small>
                      <strong>01</strong>
                    </div>
                    <span>→</span>
                    <div>
                      <small>ASSETS</small>
                      <strong>02</strong>
                    </div>
                    <span>→</span>
                    <div>
                      <small>WEALTH</small>
                      <strong>03</strong>
                    </div>
                  </div>
                ) : (
                  <div className="fe-biographyVisual">
                    <div className="fe-miniPortrait one" />
                    <div className="fe-miniPortrait two" />
                    <div className="fe-miniPortrait three" />
                    <span>STUDY THE JOURNEY</span>
                  </div>
                )}
              </div>

              <div className="fe-pillarContent">
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>

                <Link href={pillar.href} className="fe-pillarPrimary">
                  {pillar.cta}
                  <span>↗</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="fe-feature fe-biographyFeature">
        <div className="fe-featureCopy">
          <span className="fe-featureEyebrow">
            BIOGRAPHY OF GREATNESS
          </span>

          <h2>
            Don&apos;t just study fortunes.
            <br />
            <em>Study the journey behind them.</em>
          </h2>

          <p>
            Explore notable wealth creators country by country — their
            beginnings, first opportunities, ownership, pivotal decisions,
            business interests, setbacks, publicly known capital allocation
            and approaches to legacy.
          </p>

          <div className="fe-featureFlow">
            <span>Origins</span>
            <i>→</i>
            <span>First Capital</span>
            <i>→</i>
            <span>Ownership</span>
            <i>→</i>
            <span>Allocation</span>
            <i>→</i>
            <span>Legacy</span>
          </div>

          <Link
            href="/academies/biography"
            className="fe-darkButton"
          >
            Enter Biography of Greatness
            <span>→</span>
          </Link>
        </div>

        <div className="fe-biographyStage" aria-hidden="true">
          <div className="fe-countryHeader">
            <small>COUNTRY STUDY</small>
            <strong>NIGERIA</strong>
            <span>01 / GLOBAL SERIES</span>
          </div>

          <div className="fe-portraitDeck">
            <div className="fe-portrait fe-portraitBack">
              <span>03</span>
            </div>

            <div className="fe-portrait fe-portraitMid">
              <span>02</span>
            </div>

            <div className="fe-portrait fe-portraitFront">
              <div className="fe-portraitSilhouette">
                <div />
              </div>

              <div className="fe-portraitInfo">
                <small>CASE STUDY</small>
                <strong>
                  The journey behind extraordinary ownership
                </strong>
                <span>Business • Assets • Allocation • Legacy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="fe-ayo fe-final">
        <div className="fe-ayoAvatar">
          <span>A</span>
        </div>

        <div className="fe-ayoCopy">
          <span>MEET YOUR AI GUIDE</span>

          <h2>
            Learn with AYO.
            <br />
            <em>Not another static course.</em>
          </h2>

          <p>
            AYO guides the learning experience through questions, stories,
            visual scenes, comparisons, challenges and reflection — designed
            to feel closer to an interactive masterclass than scrolling
            through a textbook.
          </p>
        </div>

        <div className="fe-ayoDialogue">
          <small>AYO</small>
          <p>
            “If you owned one share of a company, what exactly would you own?”
          </p>

          <div className="fe-dialogueOptions">
            <span>Ownership</span>
            <span>Risk</span>
            <span>Return</span>
          </div>
        </div>
      </section>

      <section className="fe-finalCta">
        <small>READY TO BEGIN?</small>
        <h2>Start with the financial foundations.</h2>
        <p>
          Learn the language of money, understand assets and begin building the
          reasoning required for better financial decisions.
        </p>

        <div>
          <Link
            href="/academies/financial-literacy"
            className="fe-finalPrimary"
          >
            Start Financial Literacy
            <span>→</span>
          </Link>

          <Link
            href="/academies/biography"
            className="fe-finalSecondary"
          >
            Explore Biography of Greatness
          </Link>
        </div>
      </section>

      <style jsx>{`
        .fe-page {
          --purple: #6d28d9;
          --purple-deep: #3b176d;
          --ink: #211529;
          --muted: #6f6576;
          --line: rgba(79, 51, 97, 0.12);
          min-height: 100vh;
          overflow: hidden;
          color: var(--ink);
          background:
            radial-gradient(circle at 0% 0%, rgba(124, 58, 237, 0.09), transparent 30%),
            linear-gradient(180deg, #fff, #fbf9fd 62%, #fff);
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .fe-hero {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(520px, 1.1fr);
          gap: clamp(40px, 6vw, 90px);
          align-items: center;
          min-height: 820px;
          padding: clamp(80px, 9vw, 130px) clamp(28px, 7vw, 110px) 82px;
          isolation: isolate;
        }

        .fe-heroGlow {
          position: absolute;
          z-index: -1;
          width: 470px;
          height: 470px;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
        }

        .fe-glowOne {
          left: -180px;
          top: 30px;
          background: rgba(124, 58, 237, 0.12);
        }

        .fe-glowTwo {
          right: -200px;
          bottom: 0;
          background: rgba(244, 196, 109, 0.15);
        }

        .fe-kicker,
        .fe-sectionEyebrow {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--purple);
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.14em;
        }

        .fe-kicker > span {
          width: 24px;
          height: 2px;
          background: var(--purple);
        }

        .fe-hero h1 {
          margin: 22px 0 22px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(52px, 6.2vw, 92px);
          line-height: 0.92;
          letter-spacing: -0.055em;
          font-weight: 500;
        }

        .fe-hero h1 em {
          color: var(--purple);
          font-weight: 500;
        }

        .fe-heroLead {
          max-width: 650px;
          margin: 0;
          color: var(--muted);
          font-size: clamp(17px, 1.5vw, 21px);
          line-height: 1.65;
        }

        .fe-heroActions,
        .fe-labActions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .fe-primary,
        .fe-labPrimary,
        .fe-lifeButton,
        .fe-finalPrimary {
          min-height: 54px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 0 22px;
          border-radius: 999px;
          color: white;
          background: linear-gradient(135deg, #6d28d9, #8b5cf6);
          text-decoration: none;
          font-weight: 900;
          box-shadow: 0 18px 42px rgba(109, 40, 217, 0.2);
        }

        .fe-secondary,
        .fe-labSecondary,
        .fe-finalSecondary {
          min-height: 54px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 18px;
          border-radius: 999px;
          color: #5c4967;
          border: 1px solid rgba(79, 51, 97, 0.14);
          background: rgba(255,255,255,.7);
          text-decoration: none;
          font-weight: 800;
        }

        .fe-freeNote {
          width: fit-content;
          max-width: 610px;
          display: flex;
          gap: 12px;
          align-items: center;
          margin-top: 28px;
          padding: 13px 16px;
          border: 1px solid rgba(124,58,237,.1);
          border-radius: 16px;
          background: rgba(255,255,255,.78);
          box-shadow: 0 10px 34px rgba(54,32,68,.06);
        }

        .fe-freeIcon {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          flex: 0 0 36px;
          border-radius: 50%;
          color: var(--purple);
          background: #f2eaff;
        }

        .fe-freeNote strong,
        .fe-freeNote span {
          display: block;
        }

        .fe-freeNote strong {
          font-size: 12px;
        }

        .fe-freeNote span {
          margin-top: 3px;
          color: #85788d;
          font-size: 11px;
        }

        .fe-heroVisual {
          position: relative;
          min-width: 0;
        }

        .fe-screen {
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 30px;
          color: white;
          background:
            radial-gradient(circle at 20% 0%, rgba(124,58,237,.28), transparent 34%),
            linear-gradient(145deg, #17111d, #281732 60%, #1e1524);
          box-shadow: 0 40px 90px rgba(30,17,39,.28);
        }

        .fe-screenTop,
        .fe-screenFooter {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 18px 22px;
          border-bottom: 1px solid rgba(255,255,255,.08);
        }

        .fe-screenTop div {
          display: grid;
          gap: 3px;
        }

        .fe-screenTop small,
        .fe-screenFooter,
        .fe-gameIntro > span {
          color: #b9a7c4;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .12em;
        }

        .fe-screenTop strong {
          font-size: 14px;
        }

        .fe-liveChip {
          padding: 7px 10px;
          border-radius: 999px;
          color: #d9c8ff;
          background: rgba(124,58,237,.15);
          font-size: 9px;
          font-weight: 950;
        }

        .fe-gameCanvas {
          padding: 26px;
        }

        .fe-gameIntro h2 {
          margin: 9px 0 6px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(30px, 4vw, 52px);
          line-height: 1;
          font-weight: 500;
        }

        .fe-gameIntro h2 em {
          color: #c4a9ff;
          font-weight: 500;
        }

        .fe-gameIntro p {
          margin: 0;
          color: #bcaec3;
          font-size: 12px;
        }

        .fe-gameChoices {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 24px;
        }

        .fe-gameChoice {
          min-width: 0;
          display: block;
          padding: 18px;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 20px;
          color: white;
          background: rgba(255,255,255,.055);
          text-decoration: none;
          transition: transform .2s ease, border-color .2s ease, background .2s ease;
        }

        .fe-gameChoice:hover {
          transform: translateY(-3px);
          border-color: rgba(196,169,255,.4);
          background: rgba(255,255,255,.08);
        }

        .fe-gameChoiceTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          color: #c9b8d2;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .1em;
        }

        .fe-gameChoice > strong {
          display: block;
          margin-top: 17px;
          color: #d8c3ff;
          font-size: 26px;
          letter-spacing: -.035em;
        }

        .fe-gameChoice h3 {
          margin: 4px 0 7px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 21px;
          font-weight: 500;
        }

        .fe-gameChoice p {
          min-height: 58px;
          margin: 0;
          color: #baaec0;
          font-size: 11px;
          line-height: 1.5;
        }

        .fe-gameMeta {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 15px;
        }

        .fe-gameMeta span {
          padding: 5px 7px;
          border-radius: 999px;
          color: #c5b4cd;
          background: rgba(255,255,255,.06);
          font-size: 8px;
          font-weight: 800;
        }

        .fe-gameChoice b {
          display: block;
          margin-top: 18px;
          color: #e5d9eb;
          font-size: 9px;
          letter-spacing: .08em;
        }

        .fe-screenFooter {
          border-top: 1px solid rgba(255,255,255,.08);
          border-bottom: 0;
        }

        .fe-progressTrack {
          width: 32%;
          height: 3px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255,255,255,.08);
        }

        .fe-progressTrack i {
          display: block;
          width: 62%;
          height: 100%;
          background: linear-gradient(90deg, #7c3aed, #d8c3ff);
        }

        .fe-floatingCard {
          position: absolute;
          width: 220px;
          padding: 14px;
          border: 1px solid rgba(124,58,237,.12);
          border-radius: 16px;
          background: rgba(255,255,255,.96);
          box-shadow: 0 18px 48px rgba(49,27,62,.15);
          backdrop-filter: blur(12px);
        }

        .fe-floatingCard small,
        .fe-floatingCard strong,
        .fe-floatingCard span {
          display: block;
        }

        .fe-floatingCard small {
          color: var(--purple);
          font-size: 8px;
          font-weight: 950;
          letter-spacing: .1em;
        }

        .fe-floatingCard strong {
          margin-top: 5px;
          font-size: 11px;
        }

        .fe-floatingCard span {
          margin-top: 3px;
          color: #8a7e91;
          font-size: 9px;
        }

        .fe-floatingOne {
          left: -48px;
          bottom: -40px;
        }

        .fe-floatingTwo {
          right: -25px;
          top: -36px;
        }

        .fe-topicRail {
          overflow: hidden;
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          background: rgba(255,255,255,.8);
        }

        .fe-topicRailInner {
          display: flex;
          gap: 0;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .fe-topicRailInner::-webkit-scrollbar {
          display: none;
        }

        .fe-topicRailInner span {
          flex: 0 0 auto;
          padding: 18px 24px;
          color: #6c5e74;
          border-right: 1px solid var(--line);
          font-size: 10px;
          font-weight: 850;
          letter-spacing: .05em;
        }

        .fe-investmentLab,
        .fe-lifeSection,
        .fe-feature,
        .fe-ayo {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(38px, 6vw, 86px);
          align-items: center;
          padding: clamp(76px, 9vw, 125px) clamp(28px, 7vw, 110px);
        }

        .fe-investmentLab {
          color: white;
          background:
            radial-gradient(circle at 10% 40%, rgba(124,58,237,.18), transparent 28%),
            linear-gradient(135deg, #151019, #21142b 65%, #18101d);
        }

        .fe-labGlow {
          position: absolute;
          inset: auto 12% -20% auto;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          background: rgba(124,58,237,.12);
          filter: blur(80px);
        }

        .fe-investmentLab .fe-sectionEyebrow {
          color: #cbb6ff;
        }

        .fe-labCopy h2,
        .fe-lifeCopy h2 {
          margin: 18px 0 16px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(42px, 5vw, 70px);
          line-height: .98;
          letter-spacing: -.045em;
          font-weight: 500;
        }

        .fe-labCopy h2 span,
        .fe-lifeCopy h2 span {
          color: #aa82ff;
        }

        .fe-labLead,
        .fe-lifeCopy > p {
          max-width: 620px;
          margin: 0;
          color: #b9adbF;
          font-size: 17px;
          line-height: 1.65;
        }

        .fe-labFeatures {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 22px;
        }

        .fe-labFeatures span {
          padding: 8px 10px;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 999px;
          color: #cec0d5;
          background: rgba(255,255,255,.04);
          font-size: 9px;
          font-weight: 800;
        }

        .fe-labSecondary {
          color: #e4d9ea;
          border-color: rgba(255,255,255,.11);
          background: rgba(255,255,255,.04);
        }

        .fe-labDisclaimer {
          display: block;
          max-width: 600px;
          margin-top: 22px;
          color: #82758a;
          line-height: 1.5;
        }

        .fe-labVisual {
          position: relative;
        }

        .fe-labTerminal {
          padding: 22px;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 26px;
          background: rgba(255,255,255,.045);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.06);
        }

        .fe-labTerminalTop {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: flex-start;
          padding-bottom: 17px;
          border-bottom: 1px solid rgba(255,255,255,.08);
        }

        .fe-labTerminalTop div,
        .fe-labCapital {
          display: grid;
          gap: 4px;
        }

        .fe-labTerminalTop small,
        .fe-labCapital small,
        .fe-labScore small,
        .fe-labEvent small {
          color: #9d8ea6;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .12em;
        }

        .fe-labTerminalTop span {
          color: #9b89a6;
          font-size: 9px;
          font-weight: 850;
        }

        .fe-labCapital {
          padding: 22px 0;
        }

        .fe-labCapital strong {
          color: #cfb9ff;
          font-size: 38px;
        }

        .fe-labCapital span {
          color: #887c90;
          font-size: 10px;
        }

        .fe-labAllocation {
          display: grid;
          gap: 12px;
        }

        .fe-labAllocation div {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 6px 16px;
          align-items: center;
        }

        .fe-labAllocation span,
        .fe-labAllocation strong {
          font-size: 10px;
        }

        .fe-labAllocation i {
          grid-column: 1 / -1;
          height: 5px;
          border-radius: 999px;
          background: linear-gradient(90deg, #7c3aed, #b899ff);
        }

        .fe-labEvent {
          margin-top: 24px;
          padding: 16px;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 17px;
          background: rgba(0,0,0,.13);
        }

        .fe-labEvent strong,
        .fe-labEvent p {
          display: block;
          margin: 5px 0 0;
        }

        .fe-labEvent p {
          color: #978a9f;
          font-size: 10px;
        }

        .fe-labEvent > div {
          display: flex;
          gap: 7px;
          margin-top: 11px;
        }

        .fe-labEvent > div span {
          padding: 7px 9px;
          border-radius: 9px;
          background: rgba(255,255,255,.06);
          font-size: 9px;
        }

        .fe-labScore {
          position: absolute;
          right: -24px;
          bottom: -28px;
          padding: 14px 18px;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 17px;
          background: #2a1935;
          box-shadow: 0 18px 40px rgba(0,0,0,.28);
        }

        .fe-labScore strong {
          margin-left: 8px;
          color: #d2bdff;
          font-size: 27px;
        }

        .fe-labScore span {
          color: #8e8098;
          font-size: 10px;
        }

        .fe-lifeSection {
          background:
            radial-gradient(circle at 90% 20%, rgba(124,58,237,.08), transparent 30%),
            #fff;
        }

        .fe-lifeCopy .fe-sectionEyebrow {
          color: var(--purple);
        }

        .fe-lifeCopy h2 {
          color: var(--ink);
        }

        .fe-lifeCopy > p {
          color: var(--muted);
        }

        .fe-lifeStats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 24px;
        }

        .fe-lifeStats article {
          padding: 14px;
          border: 1px solid var(--line);
          border-radius: 15px;
          background: #fcfafd;
        }

        .fe-lifeStats small,
        .fe-lifeStats strong {
          display: block;
        }

        .fe-lifeStats small {
          color: #9b8fa2;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .09em;
        }

        .fe-lifeStats strong {
          margin-top: 5px;
          font-size: 11px;
        }

        .fe-lifeButton {
          margin-top: 24px;
        }

        .fe-lifeBoard {
          position: relative;
          display: grid;
          grid-template-columns: 90px 1fr 90px;
          gap: 18px;
          align-items: center;
          min-height: 340px;
          padding: 34px;
          border: 1px solid var(--line);
          border-radius: 28px;
          background:
            linear-gradient(145deg, rgba(124,58,237,.05), transparent 55%),
            #fbf9fd;
          box-shadow: 0 28px 70px rgba(50,29,63,.08);
        }

        .fe-lifeYear {
          display: grid;
          place-items: center;
          padding: 18px 10px;
          border-radius: 18px;
          background: #fff;
          box-shadow: 0 12px 30px rgba(50,29,63,.08);
        }

        .fe-lifeYear small {
          color: #9889a1;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .1em;
        }

        .fe-lifeYear strong {
          margin-top: 4px;
          color: var(--purple);
          font-size: 31px;
        }

        .fe-lifeRoute {
          display: flex;
          align-items: center;
        }

        .fe-lifeRoute span {
          width: 14px;
          height: 14px;
          flex: 0 0 14px;
          border: 4px solid #f2eaff;
          border-radius: 50%;
          background: var(--purple);
        }

        .fe-lifeRoute i {
          flex: 1;
          height: 3px;
          background: linear-gradient(90deg, #d8c5ff, #7c3aed);
        }

        .fe-lifeOutcome {
          position: absolute;
          left: 50%;
          bottom: 32px;
          width: min(380px, calc(100% - 48px));
          transform: translateX(-50%);
          padding: 15px;
          border-radius: 15px;
          color: white;
          background: #2c1b35;
          text-align: center;
        }

        .fe-lifeOutcome small,
        .fe-lifeOutcome strong {
          display: block;
        }

        .fe-lifeOutcome small {
          color: #b6a2c1;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .1em;
        }

        .fe-lifeOutcome strong {
          margin-top: 5px;
          font-size: 11px;
          line-height: 1.45;
        }

        .fe-manifesto,
        .fe-perspectives {
          padding: clamp(76px, 9vw, 125px) clamp(28px, 7vw, 110px);
        }

        .fe-manifesto {
          background: #f7f3fa;
        }

        .fe-manifestoGrid {
          display: grid;
          grid-template-columns: .95fr 1.05fr;
          gap: clamp(36px, 7vw, 110px);
          margin-top: 30px;
        }

        .fe-manifesto h2,
        .fe-perspectiveHeading h2,
        .fe-featureCopy h2,
        .fe-ayoCopy h2,
        .fe-finalCta h2 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(40px, 4.8vw, 70px);
          line-height: 1;
          letter-spacing: -.045em;
          font-weight: 500;
        }

        .fe-manifesto h2 span {
          color: var(--purple);
        }

        .fe-manifestoCopy {
          display: grid;
          gap: 18px;
          align-content: start;
        }

        .fe-manifestoCopy p,
        .fe-perspectiveHeading p,
        .fe-featureCopy p,
        .fe-ayoCopy p,
        .fe-finalCta p {
          margin: 0;
          color: var(--muted);
          font-size: 16px;
          line-height: 1.7;
        }

        .fe-perspectiveHeading {
          display: grid;
          grid-template-columns: 1fr .85fr;
          gap: 40px;
          align-items: end;
        }

        .fe-perspectiveHeading > div > span {
          display: block;
          margin-bottom: 14px;
          color: var(--purple);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .14em;
        }

        .fe-pillarGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
          margin-top: 42px;
        }

        .fe-pillar {
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 26px;
          background: white;
          box-shadow: 0 20px 60px rgba(49,28,62,.06);
        }

        .fe-pillarTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 18px 20px 12px;
        }

        .fe-pillarNumber {
          color: #a090aa;
          font-size: 10px;
          font-weight: 900;
        }

        .fe-pillarEyebrow {
          color: var(--purple);
          font-size: 9px;
          font-weight: 950;
          letter-spacing: .1em;
        }

        .fe-pillarVisual {
          min-height: 170px;
          padding: 20px;
        }

        .fe-financeVisual {
          display: grid;
          grid-template-columns: 1fr auto 1fr auto 1fr;
          gap: 12px;
          align-items: center;
          height: 130px;
          padding: 18px;
          border-radius: 18px;
          background:
            radial-gradient(circle at 70% 20%, rgba(196,169,255,.18), transparent 32%),
            #1e1426;
        }

        .fe-financeVisual div {
          display: grid;
          gap: 4px;
          text-align: center;
        }

        .fe-financeVisual small {
          color: #a995b3;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: .09em;
        }

        .fe-financeVisual strong {
          color: #d6c1ff;
          font-size: 22px;
        }

        .fe-financeVisual > span {
          color: #8f79a0;
        }

        .fe-biographyVisual {
          position: relative;
          height: 130px;
          overflow: hidden;
          border-radius: 18px;
          background: linear-gradient(145deg, #ede4f6, #faf7fd);
        }

        .fe-miniPortrait {
          position: absolute;
          bottom: 0;
          width: 76px;
          border-radius: 30px 30px 0 0;
          background: linear-gradient(180deg, #9f88ad, #5a4068);
        }

        .fe-miniPortrait.one {
          left: 15%;
          height: 95px;
        }

        .fe-miniPortrait.two {
          left: 42%;
          height: 115px;
          background: linear-gradient(180deg, #775b87, #3e294a);
        }

        .fe-miniPortrait.three {
          right: 14%;
          height: 82px;
          background: linear-gradient(180deg, #b19abc, #6e537a);
        }

        .fe-biographyVisual > span {
          position: absolute;
          left: 14px;
          top: 13px;
          color: #6d5876;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: .12em;
        }

        .fe-pillarContent {
          padding: 8px 22px 24px;
        }

        .fe-pillarContent h3 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 28px;
          line-height: 1.05;
          font-weight: 500;
        }

        .fe-pillarContent p {
          min-height: 100px;
          margin: 12px 0 19px;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.65;
        }

        .fe-pillarPrimary,
        .fe-darkButton {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          min-height: 46px;
          padding: 0 16px;
          border-radius: 999px;
          color: white;
          background: #2a1833;
          text-decoration: none;
          font-size: 11px;
          font-weight: 900;
        }

        .fe-biographyFeature {
          color: white;
          background: linear-gradient(145deg, #2b1a35, #171019);
        }

        .fe-featureEyebrow {
          display: block;
          margin-bottom: 16px;
          color: #cbb6ff;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .14em;
        }

        .fe-featureCopy h2 em,
        .fe-ayoCopy h2 em {
          color: #cbb6ff;
          font-weight: 500;
        }

        .fe-featureCopy p {
          max-width: 650px;
          margin-top: 20px;
          color: #bcaec3;
        }

        .fe-featureFlow {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          align-items: center;
          margin-top: 26px;
        }

        .fe-featureFlow span {
          padding: 7px 9px;
          border-radius: 999px;
          color: #cec0d5;
          background: rgba(255,255,255,.06);
          font-size: 9px;
          font-weight: 800;
        }

        .fe-featureFlow i {
          color: #7e6b88;
          font-style: normal;
        }

        .fe-darkButton {
          margin-top: 27px;
          color: #261a2c;
          background: #e9ddff;
        }

        .fe-biographyStage {
          padding: 24px;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 26px;
          background: rgba(255,255,255,.045);
        }

        .fe-countryHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding-bottom: 17px;
          border-bottom: 1px solid rgba(255,255,255,.08);
        }

        .fe-countryHeader small,
        .fe-countryHeader span {
          color: #93869b;
          font-size: 8px;
          font-weight: 850;
          letter-spacing: .1em;
        }

        .fe-countryHeader strong {
          font-size: 11px;
        }

        .fe-portraitDeck {
          position: relative;
          height: 340px;
          margin-top: 22px;
        }

        .fe-portrait {
          position: absolute;
          overflow: hidden;
          width: 62%;
          height: 88%;
          border-radius: 22px;
          background: #34243d;
          box-shadow: 0 20px 45px rgba(0,0,0,.18);
        }

        .fe-portraitBack {
          right: 0;
          top: 0;
          transform: rotate(6deg);
          opacity: .45;
        }

        .fe-portraitMid {
          right: 15%;
          top: 5%;
          transform: rotate(2deg);
          opacity: .72;
        }

        .fe-portraitFront {
          left: 3%;
          bottom: 0;
          background: linear-gradient(155deg, #4b3458, #201726);
        }

        .fe-portrait > span {
          position: absolute;
          right: 12px;
          top: 10px;
          color: rgba(255,255,255,.34);
          font-size: 10px;
          font-weight: 900;
        }

        .fe-portraitSilhouette {
          height: 63%;
          display: grid;
          place-items: end center;
        }

        .fe-portraitSilhouette div {
          width: 54%;
          height: 82%;
          border-radius: 48% 48% 12% 12%;
          background: linear-gradient(180deg, #897195, #392843);
        }

        .fe-portraitInfo {
          padding: 14px;
        }

        .fe-portraitInfo small,
        .fe-portraitInfo strong,
        .fe-portraitInfo span {
          display: block;
        }

        .fe-portraitInfo small {
          color: #a993b4;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .1em;
        }

        .fe-portraitInfo strong {
          margin-top: 6px;
          font-size: 12px;
          line-height: 1.35;
        }

        .fe-portraitInfo span {
          margin-top: 6px;
          color: #897b91;
          font-size: 8px;
        }

        .fe-ayo {
          grid-template-columns: 160px 1fr .8fr;
          color: white;
          background:
            radial-gradient(circle at 10% 30%, rgba(124,58,237,.25), transparent 30%),
            linear-gradient(135deg, #1c1223, #2b1837);
        }

        .fe-ayoAvatar {
          width: 140px;
          height: 140px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 50%;
          background: rgba(255,255,255,.06);
        }

        .fe-ayoAvatar span {
          display: grid;
          place-items: center;
          width: 92px;
          height: 92px;
          border-radius: 50%;
          color: #2d1a38;
          background: #d7c0ff;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 52px;
        }

        .fe-ayoCopy > span {
          display: block;
          margin-bottom: 14px;
          color: #cbb6ff;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: .13em;
        }

        .fe-ayoCopy h2 {
          font-size: clamp(38px, 4vw, 62px);
        }

        .fe-ayoCopy p {
          margin-top: 18px;
          color: #bbaec1;
        }

        .fe-ayoDialogue {
          padding: 22px;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 20px;
          background: rgba(255,255,255,.055);
        }

        .fe-ayoDialogue small {
          color: #bda4f4;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: .11em;
        }

        .fe-ayoDialogue p {
          margin: 12px 0 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 21px;
          line-height: 1.35;
        }

        .fe-dialogueOptions {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 16px;
        }

        .fe-dialogueOptions span {
          padding: 6px 8px;
          border-radius: 999px;
          color: #c7b8cf;
          background: rgba(255,255,255,.07);
          font-size: 8px;
          font-weight: 800;
        }

        .fe-finalCta {
          padding: clamp(78px, 9vw, 120px) clamp(28px, 7vw, 110px);
          text-align: center;
          background: white;
        }

        .fe-finalCta > small {
          color: var(--purple);
          font-size: 9px;
          font-weight: 950;
          letter-spacing: .14em;
        }

        .fe-finalCta h2 {
          margin-top: 14px;
        }

        .fe-finalCta p {
          max-width: 650px;
          margin: 18px auto 0;
        }

        .fe-finalCta > div {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 28px;
        }

        @media (max-width: 1050px) {
          .fe-hero {
            grid-template-columns: 1fr;
            min-height: 0;
          }

          .fe-heroVisual {
            max-width: 800px;
          }

          .fe-investmentLab,
          .fe-lifeSection,
          .fe-feature {
            grid-template-columns: 1fr;
          }

          .fe-ayo {
            grid-template-columns: 110px 1fr;
          }

          .fe-ayoDialogue {
            grid-column: 1 / -1;
          }

          .fe-floatingOne {
            left: 10px;
          }

          .fe-floatingTwo {
            right: 10px;
          }
        }

        @media (max-width: 760px) {
          .fe-hero,
          .fe-investmentLab,
          .fe-lifeSection,
          .fe-manifesto,
          .fe-perspectives,
          .fe-feature,
          .fe-ayo,
          .fe-finalCta {
            padding-left: 18px;
            padding-right: 18px;
          }

          .fe-hero {
            padding-top: 72px;
            padding-bottom: 64px;
            gap: 42px;
          }

          .fe-hero h1 {
            font-size: clamp(48px, 15vw, 67px);
          }

          .fe-heroLead {
            font-size: 16px;
          }

          .fe-heroActions {
            display: grid;
          }

          .fe-primary,
          .fe-secondary {
            width: 100%;
            box-sizing: border-box;
          }

          .fe-freeNote {
            align-items: flex-start;
          }

          .fe-gameCanvas {
            padding: 18px;
          }

          .fe-gameChoices {
            grid-template-columns: 1fr;
          }

          .fe-gameChoice p {
            min-height: 0;
          }

          .fe-screenTop,
          .fe-screenFooter {
            padding: 14px;
          }

          .fe-screenFooter {
            gap: 8px;
          }

          .fe-screenFooter span {
            font-size: 7px;
          }

          .fe-floatingCard {
            display: none;
          }

          .fe-investmentLab,
          .fe-lifeSection,
          .fe-feature,
          .fe-ayo {
            padding-top: 74px;
            padding-bottom: 74px;
          }

          .fe-labVisual {
            margin-top: 12px;
          }

          .fe-labScore {
            position: static;
            width: fit-content;
            margin: 12px 0 0 auto;
          }

          .fe-lifeStats {
            grid-template-columns: 1fr;
          }

          .fe-lifeBoard {
            min-height: 300px;
            grid-template-columns: 68px 1fr 68px;
            padding: 20px;
          }

          .fe-lifeOutcome {
            bottom: 20px;
          }

          .fe-manifestoGrid,
          .fe-perspectiveHeading {
            grid-template-columns: 1fr;
          }

          .fe-pillarGrid {
            grid-template-columns: 1fr;
          }

          .fe-pillarContent p {
            min-height: 0;
          }

          .fe-financeVisual {
            grid-template-columns: 1fr auto 1fr;
          }

          .fe-financeVisual div:nth-of-type(3),
          .fe-financeVisual > span:nth-of-type(2) {
            display: none;
          }

          .fe-featureFlow {
            gap: 6px;
          }

          .fe-biographyStage {
            padding: 16px;
          }

          .fe-portraitDeck {
            height: 300px;
          }

          .fe-ayo {
            grid-template-columns: 72px 1fr;
            gap: 18px;
          }

          .fe-ayoAvatar {
            width: 72px;
            height: 72px;
          }

          .fe-ayoAvatar span {
            width: 52px;
            height: 52px;
            font-size: 30px;
          }

          .fe-ayoCopy h2 {
            font-size: 37px;
          }
        }

        @media (max-width: 430px) {
          .fe-screen {
            border-radius: 22px;
          }

          .fe-gameIntro h2 {
            font-size: 30px;
          }

          .fe-labCopy h2,
          .fe-lifeCopy h2,
          .fe-manifesto h2,
          .fe-perspectiveHeading h2,
          .fe-featureCopy h2,
          .fe-finalCta h2 {
            font-size: 38px;
          }

          .fe-lifeBoard {
            grid-template-columns: 60px 1fr 60px;
            gap: 8px;
          }

          .fe-countryHeader {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </main>
  );
}
