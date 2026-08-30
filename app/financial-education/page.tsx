import Link from "next/link";

import FinancialEducationAyoGuide from "./FinancialEducationAyoGuide";

export const metadata = {
  title: "Financial Education | Fountain Prep",
  description:
    "Explore financial education through money and assets, remarkable wealth creators, language leverage and perspectives on stewardship and legacy.",
};

const pillars = [
  {
    number: "01",
    eyebrow: "FINANCIAL EDUCATION",
    title: "Understand the financial world.",
    description:
      "Explore money, saving, cash flow, enterprise, assets, investing, risk, ownership, diversification and the financial decisions that shape everyday life.",
    href: "/academies/financial-literacy",
    cta: "Explore Financial Education",
    tone: "finance",
    visual: "portfolio",
  },
  {
    number: "02",
    eyebrow: "BIOGRAPHY OF GREATNESS",
    title: "Study the lives behind extraordinary wealth creation.",
    description:
      "The secrets of men are in their stories. Discover remarkable wealth creators across countries: where they started, the businesses and assets behind their fortunes, pivotal decisions, setbacks, capital allocation and legacy.",
    href: "/academies/biography",
    cta: "Explore Biography of Greatness",
    tone: "biography",
    visual: "portraits",
  },
  {
    number: "03",
    eyebrow: "LANGUAGE LEVERAGE",
    title: "Language can become economic and cultural leverage.",
    description:
      "Explore how language strengthens communication, family connection, cultural understanding and the ability to navigate relationships and opportunities across borders.",
    href: "/academies/language",
    cta: "Learn with AI",
    secondaryHref: "/languages",
    secondaryCta: "Book a Live Tutor",
    tone: "language",
    visual: "world",
  },
  {
    number: "04",
    eyebrow: "SPIRITUAL CAPITAL",
    title: "Stewardship. Character. Purpose. Legacy.",
    description:
      "Explore biblical accounts involving resources, enterprise, abundance, scarcity, responsibility and stewardship — and the ideas they raise about how resources are handled.",
    href: "/academies/bible",
    cta: "Explore Spiritual Capital",
    tone: "spiritual",
    visual: "stewardship",
  },
] as const;

const topics = [
  "Money & Cash Flow",
  "Asset Classes",
  "Business Ownership",
  "Investing",
  "Risk",
  "Capital Allocation",
  "Stewardship",
  "Legacy",
];

export default function FinancialEducationGatewayPage() {
  return (
    <main className="fe-page">
      <FinancialEducationAyoGuide />
      {/* NAV */}
      
      {/* HERO */}
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
            <em>Financial Literacy.</em>
          </h1>

          <p className="fe-heroLead">
            Wealth building is shaped by more than income.
            Explore assets, enterprise, remarkable lives, language,
            stewardship and legacy through immersive learning with fountainprep.
          </p>

          <div className="fe-heroActions">
            <Link
              href="/academies/financial-literacy"
              className="fe-primary"
            >
              Explore Financial Education
              <span>→</span>
            </Link>

            <a
              href="#explore"
              className="fe-secondary"
            >
              Discover the Four Strategic Vehicles
            </a>
          </div>

          <div className="fe-freeNote">
            <div className="fe-freeIcon">
              ✦
            </div>

            <div>
              <strong>
                Experience Fountain Prep before you subscribe.
              </strong>
              <span>
                Two complimentary Academy experiences. No account required.
              </span>
            </div>
          </div>
        </div>

        {/* HERO GAME VISUAL */}
        <div className="fe-heroVisual">
          <div className="fe-screen fe-gameScreen">
            <div className="fe-screenTop">
              <div>
                <small>FOUNTAIN PREP MONEY GAMES</small>
                <strong>Free Investment Simulations.</strong>
              </div>
              <span className="fe-liveChip">● PLAY NOW</span>
            </div>

            <div className="fe-gameCanvas">
              <div className="fe-gameIntro">
                <span>INTERACTIVE FINANCIAL SIMULATIONS</span>
                <h2>PLAY NOW <em>investment simulations?</em></h2>
                <p>Make the decisions. See what happens. Learn from the outcome.</p>
              </div>

              <div className="fe-gameChoices">
                <Link href="/academies/financial-literacy/investment-lab" className="fe-gameChoice fe-investGame">
                  <div className="fe-gameChoiceTop"><span>01</span><small>INVESTMENT LAB</small></div>
                  <strong>£100,000</strong>
                  <h3>Can you invest it?</h3>
                  <p>Build a portfolio. Face market shocks. Buy, sell, hold and compete with your Financial Twin.</p>
                  <div className="fe-gameMeta"><span>12 market episodes</span><span>Investor score</span></div>
                  <b>▶ PLAY INVESTMENT GAME</b>
                </Link>

                <Link href="/academies/financial-literacy/wealth-simulator" className="fe-gameChoice fe-lifeGame">
                  <div className="fe-gameChoiceTop"><span>02</span><small>LIFE &amp; WEALTH</small></div>
                  <strong>10 YEARS</strong>
                  <h3>Where will your choices take you?</h3>
                  <p>Same income. Real-life trade-offs. Housing, lifestyle, saving, investing and unexpected events.</p>
                  <div className="fe-gameMeta"><span>Year 01 → 10</span><span>Financial Twin</span></div>
                  <b>▶ PLAY LIFE GAME</b>
                </Link>
              </div>
            </div>

            <div className="fe-screenFooter fe-gameFooter">
              <span>FICTIONAL MONEY. REAL DECISIONS.</span>
              <div className="fe-progressTrack"><i /></div>
              <span>CHOOSE A GAME ↑</span>
            </div>
          </div>

          <div className="fe-floatingCard fe-floatingOne fe-gameFloat">
            <small>YOUR FINANCIAL TWIN</small>
            <strong>Same start. Different decisions.</strong>
            <span>Who finishes stronger?</span>
          </div>

          <div className="fe-floatingCard fe-floatingTwo fe-gameFloat">
            <small>YOU’RE IN CONTROL</small>
            <strong>Every decision changes the outcome.</strong>
          </div>
        </div>
      </section>

      {/* TOPIC RAIL */}
      <section className="fe-topicRail">
        <div className="fe-topicRailInner">
          {topics.map((topic) => (
            <span key={topic}>
              {topic}
            </span>
          ))}
        </div>
      </section>

            {/* INVESTMENT LAB */}
      <section className="fe-investmentLab">
        <div className="fe-labGlow" />

        <div className="fe-labCopy">
          <div className="fe-sectionEyebrow">
            FOUNTAIN PREP INVESTMENT LAB
          </div>

          <h2>
            Could you successfully invest
            <br />
            <span>£100,000?</span>
          </h2>

          <p className="fe-labLead">
            Build a fictional portfolio, experience changing
            markets and make the decisions real investors face
            — without risking real money.
          </p>

          <div className="fe-labFeatures">
            <span>20 simulated years</span>
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
            A fictional learning simulation. No real money is
            invested and nothing shown is investment advice.
          </small>
        </div>

        <div className="fe-labVisual">
          <div className="fe-labTerminal">
            <div className="fe-labTerminalTop">
              <div>
                <small>INVESTMENT LAB</small>
                <strong>Portfolio Simulation</strong>
              </div>

              <span>YEAR 01 / 20</span>
            </div>

            <div className="fe-labCapital">
              <small>YOUR FOUNTAINCASH</small>
              <strong>£100,000</strong>
              <span>Build your starting portfolio</span>
            </div>

            <div className="fe-labAllocation">
              <div>
                <span>Global Equities</span>
                <strong>35%</strong>
                <i style={{ width: "35%" }} />
              </div>

              <div>
                <span>Bonds</span>
                <strong>25%</strong>
                <i style={{ width: "25%" }} />
              </div>

              <div>
                <span>Property</span>
                <strong>20%</strong>
                <i style={{ width: "20%" }} />
              </div>

              <div>
                <span>Cash</span>
                <strong>20%</strong>
                <i style={{ width: "20%" }} />
              </div>
            </div>

            <div className="fe-labEvent">
              <small>MARKET EVENT</small>
              <strong>Markets fall 30%.</strong>
              <p>What would you do?</p>

              <div>
                <span>Sell</span>
                <span>Hold</span>
                <span>Rebalance</span>
              </div>
            </div>
          </div>

          <div className="fe-labScore">
            <small>PORTFOLIO MANAGER SCORE</small>
            <strong>82</strong>
            <span>/ 100</span>
          </div>
        </div>
      </section>

      {/* POSITIONING */}
      <section className="fe-manifesto">
        <div className="fe-sectionEyebrow">
          A BROADER VIEW OF FINANCIAL LITERACY
        </div>

        <div className="fe-manifestoGrid">
          <h2>
            Money is important.
            <br />
            <span>
              But money is not the whole story.
            </span>
          </h2>

          <div className="fe-manifestoCopy">
            <p>
              A person may earn well and understand little about assets.
              Another may inherit valuable interests without understanding
              the businesses, communities or cultures around them.
            </p>

            <p>
              Fountain Prep approaches financial education through four
              complementary perspectives — without promising shortcuts,
              formulas or guaranteed financial outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* FOUR PERSPECTIVES */}
      <section
        className="fe-perspectives"
        id="explore"
      >
        <div className="fe-perspectiveHeading">
          <div>
            <span>EXPLORE</span>
            <h2>
              Four perspectives.
              <br />
              One richer financial understanding.
            </h2>
          </div>

          <p>
            Each experience has its own visual language and teaching style,
            while AYO guides the learner through stories, decisions,
            questions and reflection.
          </p>
        </div>

        <div className="fe-pillarGrid">
          {pillars.map((pillar) => (
            <article
              key={pillar.number}
              className={`fe-pillar fe-${pillar.tone}`}
            >
              <div className="fe-pillarTop">
                <span className="fe-pillarNumber">
                  {pillar.number}
                </span>

                <span className="fe-pillarEyebrow">
                  {pillar.eyebrow}
                </span>
              </div>

              <PillarVisual
                type={pillar.visual}
              />

              <div className="fe-pillarContent">
                <h3>{pillar.title}</h3>

                <p>{pillar.description}</p>

                <div className="fe-pillarActions">
                  <Link
                    href={pillar.href}
                    className="fe-pillarPrimary"
                  >
                    {pillar.cta}
                    <span>↗</span>
                  </Link>

                  {"secondaryHref" in pillar ? (
                    <Link
                      href={pillar.secondaryHref}
                      className="fe-pillarSecondary"
                    >
                      {pillar.secondaryCta}
                      <span>→</span>
                    </Link>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* BIOGRAPHY FEATURE */}
      <section className="fe-feature fe-biographyFeature">
        <div className="fe-featureCopy">
          <span className="fe-featureEyebrow">
            BIOGRAPHY OF GREATNESS
          </span>

          <h2>
            Don't just study fortunes.
            <br />
            <em>Study the journey behind them.</em>
          </h2>

          <p>
            Biography of Greatness will explore notable wealth creators
            country by country — their beginnings, first opportunities,
            ownership, pivotal decisions, business interests, setbacks,
            publicly known capital allocation and approaches to legacy.
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

        <div className="fe-biographyStage">
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
                <span>
                  Business • Assets • Allocation • Legacy
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LANGUAGE */}
      <section className="fe-languageFeature">
        <div className="fe-languageVisual">
          <div className="fe-world">
            <span className="fe-worldPoint fe-pointOne">
              LAGOS
            </span>

            <span className="fe-worldPoint fe-pointTwo">
              LONDON
            </span>

            <span className="fe-worldPoint fe-pointThree">
              SHANGHAI
            </span>

            <span className="fe-worldPoint fe-pointFour">
              NEW YORK
            </span>

            <i className="fe-route routeOne" />
            <i className="fe-route routeTwo" />
            <i className="fe-route routeThree" />
          </div>
        </div>

        <div className="fe-languageCopy">
          <span className="fe-featureEyebrow">
            LANGUAGE LEVERAGE
          </span>

          <h2>
            Language carries more than words.
          </h2>

          <p>
            It can carry relationships, cultural understanding,
            family connection and context. That matters when people,
            businesses and assets span different countries and communities.
          </p>

          <div className="fe-languageList">
            <span>Yoruba</span>
            <span>Igbo</span>
            <span>Hausa</span>
            <span>Mandarin</span>
            <span>French</span>
          </div>

          <div className="fe-languageActions">
            <Link
              href="/academies/language"
              className="fe-primary"
            >
              Learn with AI
              <span>→</span>
            </Link>

            <Link
              href="/languages"
              className="fe-lightButton"
            >
              Book a Live Tutor
              <span>↗</span>
            </Link>
          </div>

          <small className="fe-commercialNote">
            AI Academy access and live 1-to-1 tutoring are separate services.
          </small>
        </div>
      </section>

      {/* SPIRITUAL CAPITAL */}
      <section className="fe-spiritualFeature">
        <div className="fe-spiritualCopy">
          <span className="fe-featureEyebrow">
            SPIRITUAL CAPITAL
          </span>

          <h2>
            Resources raise questions of
            <em> stewardship.</em>
          </h2>

          <p>
            Explore biblical stories involving abundance, scarcity,
            enterprise, responsibility and legacy — not as promises of
            financial prosperity, but as opportunities to think about
            resources, purpose and character.
          </p>

          <Link
            href="/academies/bible"
            className="fe-lightButton"
          >
            Explore Spiritual Capital
            <span>→</span>
          </Link>
        </div>

        <div className="fe-storyStack">
          <div className="fe-storyCard">
            <span>01</span>
            <small>JOSEPH</small>
            <strong>
              Abundance, scarcity & preparation
            </strong>
          </div>

          <div className="fe-storyCard">
            <span>02</span>
            <small>THE TALENTS</small>
            <strong>
              Stewardship & accountability
            </strong>
          </div>

          <div className="fe-storyCard">
            <span>03</span>
            <small>SOLOMON</small>
            <strong>
              Wisdom, resources & responsibility
            </strong>
          </div>
        </div>
      </section>

      {/* AYO */}
      <section className="fe-ayo">
        <div className="fe-ayoAvatar">
          <span>A</span>
        </div>

        <div className="fe-ayoCopy">
          <span>
            MEET YOUR AI GUIDE
          </span>

          <h2>
            Learn with AYO.
            <br />
            <em>Not another static course.</em>
          </h2>

          <p>
            AYO guides each experience through questions, stories,
            visual scenes, comparisons, challenges and reflection —
            designed to feel closer to an interactive masterclass than
            scrolling through a textbook.
          </p>
        </div>

        <div className="fe-ayoDialogue">
          <small>AYO</small>

          <p>
            “If you owned one share of a company,
            what exactly would you own?”
          </p>

          <div>
            <button type="button">
              A tiny part of the business
            </button>

            <button type="button">
              Money lent to the company
            </button>
          </div>
        </div>
      </section>

      {/* MAIN FOUNTAIN PREP ESCAPE */}
      <section className="fe-mainPlatform">
        <div>
          <span>
            LOOKING FOR SOMETHING ELSE?
          </span>

          <h2>
            Fountain Prep goes beyond financial education.
          </h2>

          <p>
            Explore Maths, English, Science, Coding, Music,
            academic support and other learning experiences
            through the main Fountain Prep platform.
          </p>
        </div>

        <Link href="/">
          Explore Fountain Prep
          <span>→</span>
        </Link>
      </section>

      {/* FINAL CTA */}
      <section className="fe-final">
        <div className="fe-finalGlow" />

        <span>
          FOUNTAIN PREP FINANCIAL EDUCATION
        </span>

        <h2>
          Start with understanding.
        </h2>

        <p>
          Explore financial ideas through immersive,
          AI-guided learning.
        </p>

        <div className="fe-finalActions">
          <Link
            href="/academies/financial-literacy"
            className="fe-primary"
          >
            Start Learning
            <span>→</span>
          </Link>

          <Link
            href="/pricing?product=academies"
            className="fe-finalSecondary"
          >
            View Academy Plans
          </Link>
        </div>
      </section>

      <footer className="fe-footer">
        <Link href="/" className="fe-brand">
          <span className="fe-brandMark">F</span>
          <span className="fe-brandText">
            Fountain <strong>Prep</strong>
          </span>
        </Link>

        <p>
          Financial education for understanding —
          not financial advice or a promise of financial outcomes.
        </p>

        <span>
          © {new Date().getFullYear()} Fountain Prep
        </span>
      </footer>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .fe-page {
          --ink: #18131f;
          --purple: #6f35c5;
          --purple-dark: #43206f;
          --soft-purple: #f4effc;
          --gold: #b8893c;
          --green: #0d7655;

          min-height: 100vh;
          overflow: hidden;
          color: var(--ink);
          background: #fbfafc;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .fe-nav {
          width: min(1440px, calc(100% - 48px));
          min-height: 82px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 30px;
          border-bottom: 1px solid rgba(41, 24, 56, 0.09);
          position: relative;
          z-index: 20;
        }

        .fe-brand {
          display: inline-flex;
          align-items: center;
          gap: 11px;
          text-decoration: none;
          color: #22172e;
          width: fit-content;
        }

        .fe-brandMark {
          width: 36px;
          height: 36px;
          border-radius: 11px;
          display: grid;
          place-items: center;
          background: linear-gradient(145deg, #8248d3, #54258e);
          color: white;
          font-family: Georgia, serif;
          font-size: 20px;
          font-weight: 700;
          box-shadow: 0 10px 25px rgba(101, 49, 170, 0.2);
        }

        .fe-brandText {
          font-size: 18px;
          letter-spacing: -0.03em;
          font-weight: 600;
        }

        .fe-brandText strong {
          color: var(--purple);
        }

        .fe-navLinks {
          display: flex;
          gap: 31px;
          align-items: center;
        }

        .fe-navLinks a {
          color: #62596b;
          font-size: 13px;
          font-weight: 650;
          text-decoration: none;
          transition: color .2s ease;
        }

        .fe-navLinks a:hover {
          color: var(--purple);
        }

        .fe-navCta {
          justify-self: end;
          display: inline-flex;
          align-items: center;
          gap: 13px;
          border: 1px solid rgba(92, 43, 145, .16);
          background: white;
          color: var(--purple-dark);
          text-decoration: none;
          border-radius: 999px;
          padding: 11px 17px;
          font-size: 13px;
          font-weight: 750;
          box-shadow: 0 7px 25px rgba(38, 20, 52, .05);
        }

        .fe-hero {
          width: min(1440px, calc(100% - 48px));
          min-height: 720px;
          margin: 0 auto;
          padding: 58px 0 82px;
          display: grid;
          grid-template-columns: .92fr 1.08fr;
          gap: 78px;
          align-items: center;
          position: relative;
        }

        .fe-heroGlow {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
        }

        .fe-glowOne {
          width: 300px;
          height: 300px;
          background: rgba(124, 58, 237, .11);
          left: -180px;
          top: 70px;
        }

        .fe-glowTwo {
          width: 270px;
          height: 270px;
          background: rgba(202, 163, 80, .09);
          right: 100px;
          bottom: 30px;
        }

        .fe-heroCopy {
          position: relative;
          z-index: 3;
        }

        .fe-kicker {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #6c5c75;
          font-size: 11px;
          letter-spacing: .16em;
          font-weight: 800;
        }

        .fe-kicker span {
          width: 31px;
          height: 1px;
          background: var(--purple);
        }

        .fe-hero h1 {
          margin: 27px 0 25px;
          max-width: 770px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(64px, 6vw, 98px);
          line-height: .94;
          letter-spacing: -.055em;
          font-weight: 500;
          color: #1d1624;
        }

        .fe-hero h1 em {
          font-weight: 400;
          color: var(--purple);
        }

        .fe-heroLead {
          max-width: 640px;
          color: #665d6d;
          font-size: 18px;
          line-height: 1.74;
        }

        .fe-heroActions {
          display: flex;
          flex-wrap: wrap;
          gap: 13px;
          align-items: center;
          margin-top: 33px;
        }

        .fe-primary,
        .fe-darkButton,
        .fe-lightButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          min-height: 52px;
          padding: 0 22px;
          border-radius: 999px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 800;
          transition:
            transform .2s ease,
            box-shadow .2s ease;
        }

        .fe-primary {
          color: white;
          background: linear-gradient(135deg, #6f35c5, #4f207f);
          box-shadow: 0 15px 35px rgba(95, 43, 155, .19);
        }

        .fe-primary:hover,
        .fe-darkButton:hover,
        .fe-lightButton:hover {
          transform: translateY(-2px);
        }

        .fe-secondary {
          color: #504758;
          text-decoration: none;
          font-weight: 700;
          font-size: 13px;
          padding: 15px 5px;
          border-bottom: 1px solid rgba(38, 24, 49, .18);
        }

        .fe-freeNote {
          display: flex;
          align-items: center;
          gap: 13px;
          margin-top: 39px;
          color: #44384c;
        }

        .fe-freeIcon {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #f0e8fa;
          color: var(--purple);
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
          color: #837889;
          font-size: 11px;
        }

        .fe-heroVisual {
          min-height: 580px;
          position: relative;
          display: grid;
          place-items: center;
          perspective: 1400px;
        }

        .fe-screen {
          width: min(690px, 95%);
          min-height: 465px;
          border-radius: 27px;
          padding: 20px;
          background:
            linear-gradient(150deg, rgba(255,255,255,.98), rgba(248,245,251,.96));
          border: 1px solid rgba(59, 38, 75, .11);
          box-shadow:
            0 45px 100px rgba(36, 20, 47, .17),
            0 8px 20px rgba(36, 20, 47, .06);
          transform: rotateY(-3deg) rotateX(1deg);
          position: relative;
          z-index: 2;
        }

        .fe-screen::before {
          content: "";
          position: absolute;
          inset: 8px;
          border-radius: 21px;
          border: 1px solid rgba(255,255,255,.8);
          pointer-events: none;
        }

        .fe-screenTop,
        .fe-screenFooter {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          position: relative;
          z-index: 2;
        }

        .fe-screenTop {
          padding: 7px 5px 18px;
        }

        .fe-screenTop small,
        .fe-screenTop strong {
          display: block;
        }

        .fe-screenTop small {
          color: #9b8ca3;
          font-size: 8px;
          letter-spacing: .16em;
          font-weight: 800;
        }

        .fe-screenTop strong {
          margin-top: 3px;
          font-family: Georgia, serif;
          font-size: 17px;
        }

        .fe-liveChip {
          font-size: 8px;
          letter-spacing: .12em;
          color: #76598e;
          background: #f4eff8;
          border-radius: 999px;
          padding: 8px 10px;
          font-weight: 800;
        }

        .fe-marketCanvas {
          min-height: 355px;
          border-radius: 19px;
          padding: 35px 37px;
          color: white;
          overflow: hidden;
          position: relative;
          background:
            radial-gradient(circle at 76% 18%, rgba(181,138,226,.30), transparent 25%),
            radial-gradient(circle at 12% 92%, rgba(179,148,72,.14), transparent 25%),
            linear-gradient(145deg, #20172a, #2c173e 58%, #19111f);
        }

        .fe-marketCanvas::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: .25;
          background-image:
            linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px);
          background-size: 42px 42px;
        }

        .fe-canvasLabel,
        .fe-bigNumber,
        .fe-marketCanvas p,
        .fe-allocation {
          position: relative;
          z-index: 2;
        }

        .fe-canvasLabel {
          color: #bda8cb;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: .18em;
        }

        .fe-bigNumber {
          margin-top: 17px;
          font-family: Georgia, serif;
          font-size: clamp(42px, 5vw, 66px);
          letter-spacing: -.04em;
        }

        .fe-marketCanvas > p {
          margin: 6px 0 20px;
          color: #cdbfd5;
          font-size: 11px;
        }

        .fe-allocation {
          display: grid;
          grid-template-columns: 150px 1fr;
          gap: 30px;
          align-items: center;
        }

        .fe-allocationRing {
          width: 138px;
          aspect-ratio: 1;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background:
            radial-gradient(circle at center, #25162f 0 46%, transparent 47%),
            conic-gradient(
              #8756cc 0 30%,
              #c39b55 30% 52%,
              #6956ae 52% 77%,
              #3b8a76 77% 100%
            );
          box-shadow: 0 15px 45px rgba(0,0,0,.25);
        }

        .fe-ringCentre {
          text-align: center;
        }

        .fe-ringCentre strong,
        .fe-ringCentre span {
          display: block;
        }

        .fe-ringCentre strong {
          font-family: Georgia, serif;
          font-size: 30px;
        }

        .fe-ringCentre span {
          color: #ae9db8;
          font-size: 8px;
        }

        .fe-assetLabels {
          display: grid;
          gap: 12px;
        }

        .fe-assetLabels span {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #d4c9d9;
          font-size: 10px;
        }

        .fe-assetLabels i {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #a57cdb;
        }

        .fe-assetLabels span:nth-child(2) i {
          background: #c39b55;
        }

        .fe-assetLabels span:nth-child(3) i {
          background: #6956ae;
        }

        .fe-assetLabels span:nth-child(4) i {
          background: #3b8a76;
        }

        .fe-screenFooter {
          padding: 16px 4px 1px;
          color: #8b7f91;
          font-size: 8px;
          font-weight: 700;
        }

        .fe-progressTrack {
          width: 45%;
          height: 3px;
          background: #e8e2ec;
          border-radius: 999px;
          overflow: hidden;
        }

        .fe-progressTrack i {
          display: block;
          width: 39%;
          height: 100%;
          background: var(--purple);
        }

        .fe-floatingCard {
          position: absolute;
          z-index: 4;
          width: 210px;
          border-radius: 17px;
          background: rgba(255,255,255,.93);
          border: 1px solid rgba(60, 41, 74, .11);
          padding: 17px;
          box-shadow: 0 22px 55px rgba(39, 23, 49, .13);
          backdrop-filter: blur(14px);
        }

        .fe-floatingCard small,
        .fe-floatingCard strong,
        .fe-floatingCard span {
          display: block;
        }

        .fe-floatingCard small {
          color: var(--purple);
          font-size: 7px;
          letter-spacing: .13em;
          font-weight: 850;
        }

        .fe-floatingCard strong {
          margin-top: 6px;
          font-family: Georgia, serif;
          font-size: 15px;
          line-height: 1.2;
        }

        .fe-floatingCard span {
          margin-top: 6px;
          color: #887b8f;
          font-size: 8px;
        }

        .fe-floatingOne {
          top: 52px;
          right: -9px;
        }

        .fe-floatingTwo {
  width: 185px;
  bottom: -8px;
  left: -52px;
}

        /* HERO MONEY GAMES */
        .fe-gameScreen { width: min(720px, 98%); }
        .fe-gameCanvas {
          min-height: 390px; border-radius: 19px; padding: 29px 30px 26px;
          color: white; overflow: hidden; position: relative;
          background:
            radial-gradient(circle at 80% 5%, rgba(157,99,244,.34), transparent 30%),
            radial-gradient(circle at 10% 100%, rgba(196,151,73,.16), transparent 30%),
            linear-gradient(145deg, #160d20, #2d1642 60%, #170d20);
        }
        .fe-gameCanvas::before {
          content:""; position:absolute; inset:0; opacity:.24; pointer-events:none;
          background-image: linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),
            linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);
          background-size:38px 38px;
        }
        .fe-gameIntro,.fe-gameChoices { position:relative; z-index:2; }
        .fe-gameIntro>span { color:#bfa6d4; font-size:7px; font-weight:900; letter-spacing:.17em; }
        .fe-gameIntro h2 { max-width:540px; margin:7px 0 5px; font-family:Georgia,serif; font-size:clamp(28px,3vw,42px); line-height:.98; letter-spacing:-.04em; font-weight:500; }
        .fe-gameIntro h2 em { color:#bb91ff; font-weight:400; }
        .fe-gameIntro p { margin:0; color:#c4b6cc; font-size:9px; }
        .fe-gameChoices { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:18px; }
        .fe-gameChoice { min-width:0; padding:16px; border-radius:15px; color:white; text-decoration:none; border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.055); transition:.2s ease; }
        .fe-gameChoice:hover { transform:translateY(-3px); border-color:rgba(196,159,255,.48); background:rgba(255,255,255,.09); }
        .fe-gameChoiceTop { display:flex; justify-content:space-between; align-items:center; gap:12px; }
        .fe-gameChoiceTop>span { width:25px; height:25px; display:grid; place-items:center; border-radius:50%; background:rgba(255,255,255,.1); color:#c7a8ff; font-family:Georgia,serif; font-size:10px; }
        .fe-gameChoiceTop small { color:#c8b3d8; font-size:7px; font-weight:900; letter-spacing:.13em; }
        .fe-gameChoice>strong { display:block; margin-top:12px; font-family:Georgia,serif; font-size:27px; font-weight:500; }
        .fe-investGame>strong { color:#c09aff; } .fe-lifeGame>strong { color:#e2bd70; }
        .fe-gameChoice h3 { margin:2px 0 6px; font-size:13px; }
        .fe-gameChoice>p { min-height:42px; margin:0; color:#bfb2c7; font-size:8px; line-height:1.55; }
        .fe-gameMeta { display:flex; flex-wrap:wrap; gap:5px; margin-top:10px; }
        .fe-gameMeta span { padding:5px 7px; border-radius:999px; background:rgba(255,255,255,.07); color:#cdbfd4; font-size:6px; font-weight:800; }
        .fe-gameChoice>b { margin-top:11px; min-height:29px; display:flex; align-items:center; justify-content:center; border-radius:9px; background:white; color:#24122f; font-size:7px; letter-spacing:.08em; }
        .fe-lifeGame>b { background:#f3e6c9; }
        .fe-gameFloat strong { font-size:14px; }
        .fe-gameFloat span { font-size:7px; }

        .fe-topicRail {
          border-top: 1px solid rgba(40, 23, 55, .08);
          border-bottom: 1px solid rgba(40, 23, 55, .08);
          background: white;
        }

        .fe-topicRailInner {
          width: min(1440px, calc(100% - 48px));
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          gap: 25px;
          padding: 20px 0;
          overflow-x: auto;
        }

        .fe-topicRail span {
          flex: 0 0 auto;
          color: #6c6272;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .11em;
          text-transform: uppercase;
        }

        .fe-investmentLab {
  position: relative;
  max-width: 1180px;
  margin: 72px auto;
  padding: 72px;
  border-radius: 32px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 70px;
  align-items: center;
  background:
    radial-gradient(
      circle at 85% 20%,
      rgba(139, 92, 246, 0.25),
      transparent 34%
    ),
    #160b25;
  color: white;
}

.fe-labGlow {
  position: absolute;
  width: 420px;
  height: 420px;
  right: -150px;
  top: -180px;
  border-radius: 999px;
  background: rgba(143, 83, 255, 0.18);
  filter: blur(50px);
  pointer-events: none;
}

.fe-labCopy,
.fe-labVisual {
  position: relative;
  z-index: 1;
}

.fe-investmentLab .fe-sectionEyebrow {
  color: #b99aff;
}

.fe-labCopy h2 {
  margin: 14px 0 22px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(42px, 5vw, 68px);
  line-height: 0.95;
  letter-spacing: -0.045em;
  font-weight: 500;
}

.fe-labCopy h2 span {
  color: #b993ff;
  font-style: italic;
}

.fe-labLead {
  max-width: 510px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 17px;
  line-height: 1.7;
}

.fe-labFeatures {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 26px 0 30px;
}

.fe-labFeatures span {
  padding: 9px 13px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  font-size: 12px;
}

.fe-labActions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 18px;
}

.fe-labPrimary {
  display: inline-flex;
  align-items: center;
  gap: 18px;
  padding: 15px 20px;
  border-radius: 999px;
  background: white;
  color: #1b0b2b;
  text-decoration: none;
  font-weight: 700;
}

.fe-labSecondary {
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
}

.fe-labDisclaimer {
  display: block;
  margin-top: 22px;
  max-width: 470px;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.5;
}

.fe-labVisual {
  min-width: 0;
}

.fe-labTerminal {
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 22px;
  background: rgba(8, 3, 15, 0.72);
  box-shadow: 0 35px 80px rgba(0, 0, 0, 0.35);
}

.fe-labTerminalTop {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.fe-labTerminalTop div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.fe-labTerminalTop small,
.fe-labCapital small,
.fe-labEvent small,
.fe-labScore small {
  color: #b99aff;
  font-size: 9px;
  letter-spacing: 0.15em;
  font-weight: 800;
}

.fe-labTerminalTop > span {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
}

.fe-labCapital {
  padding: 28px 0;
}

.fe-labCapital strong {
  display: block;
  margin: 5px 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 45px;
  font-weight: 500;
}

.fe-labCapital > span {
  color: rgba(255, 255, 255, 0.55);
  font-size: 12px;
}

.fe-labAllocation {
  display: grid;
  gap: 13px;
}

.fe-labAllocation > div {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  padding-bottom: 8px;
  font-size: 11px;
}

.fe-labAllocation i {
  position: absolute;
  height: 2px;
  bottom: 0;
  left: 0;
  border-radius: 99px;
  background: #a879ff;
}

.fe-labEvent {
  margin-top: 26px;
  padding: 18px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.06);
}

.fe-labEvent strong {
  display: block;
  margin-top: 6px;
  font-size: 18px;
}

.fe-labEvent p {
  margin: 5px 0 14px;
  color: rgba(255, 255, 255, 0.55);
}

.fe-labEvent div {
  display: flex;
  gap: 7px;
}

.fe-labEvent div span {
  padding: 7px 11px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  font-size: 10px;
}

.fe-labScore {
  position: absolute;
  right: -24px;
  bottom: -28px;
  width: 150px;
  padding: 18px;
  border-radius: 16px;
  background: white;
  color: #1c0d2d;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.24);
}

.fe-labScore strong {
  display: inline-block;
  margin-top: 5px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 38px;
}

.fe-labScore > span {
  font-size: 11px;
  opacity: 0.5;
}

        .fe-manifesto,
        .fe-perspectives,
        .fe-feature,
        .fe-languageFeature,
        .fe-spiritualFeature,
        .fe-ayo,
        .fe-mainPlatform {
          width: min(1380px, calc(100% - 48px));
          margin-inline: auto;
        }

        .fe-manifesto {
          padding: 120px 0 112px;
        }

        .fe-sectionEyebrow,
        .fe-featureEyebrow {
          color: var(--purple);
          font-size: 9px;
          letter-spacing: .16em;
          font-weight: 850;
        }

        .fe-manifestoGrid {
          margin-top: 24px;
          display: grid;
          grid-template-columns: 1.05fr .95fr;
          gap: 100px;
          align-items: start;
        }

        .fe-manifesto h2 {
          margin: 0;
          font-family: Georgia, serif;
          font-size: clamp(46px, 5vw, 75px);
          line-height: 1.02;
          letter-spacing: -.045em;
          font-weight: 500;
        }

        .fe-manifesto h2 span {
          color: #867591;
          font-style: italic;
          font-weight: 400;
        }

        .fe-manifestoCopy {
          padding-top: 12px;
          color: #665e6b;
          font-size: 16px;
          line-height: 1.8;
        }

        .fe-manifestoCopy p + p {
          margin-top: 20px;
        }

        .fe-perspectives {
          padding: 100px 0 115px;
          border-top: 1px solid rgba(48, 30, 62, .08);
        }

        .fe-perspectiveHeading {
          display: grid;
          grid-template-columns: 1.05fr .75fr;
          gap: 90px;
          align-items: end;
          margin-bottom: 47px;
        }

        .fe-perspectiveHeading > div > span {
          color: var(--purple);
          font-size: 9px;
          letter-spacing: .17em;
          font-weight: 850;
        }

        .fe-perspectiveHeading h2 {
          margin: 13px 0 0;
          font-family: Georgia, serif;
          font-size: clamp(42px, 4.2vw, 65px);
          line-height: 1;
          letter-spacing: -.04em;
          font-weight: 500;
        }

        .fe-perspectiveHeading > p {
          color: #756c79;
          font-size: 14px;
          line-height: 1.75;
          max-width: 500px;
        }

        .fe-pillarGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
        }

        .fe-pillar {
          min-height: 590px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          border-radius: 26px;
          border: 1px solid rgba(48, 31, 61, .09);
          background: white;
          overflow: hidden;
          position: relative;
          transition:
            transform .25s ease,
            box-shadow .25s ease;
        }

        .fe-pillar:hover {
          transform: translateY(-4px);
          box-shadow: 0 30px 70px rgba(45, 26, 57, .09);
        }

        .fe-pillarTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          position: relative;
          z-index: 2;
        }

        .fe-pillarNumber {
          font-family: Georgia, serif;
          font-size: 22px;
          color: #a295a9;
        }

        .fe-pillarEyebrow {
          font-size: 8px;
          letter-spacing: .16em;
          font-weight: 850;
          color: #7f7088;
        }

        .fe-pillarContent {
          margin-top: auto;
          position: relative;
          z-index: 3;
        }

        .fe-pillarContent h3 {
          margin: 25px 0 11px;
          max-width: 600px;
          font-family: Georgia, serif;
          font-size: clamp(30px, 3vw, 45px);
          line-height: 1.04;
          letter-spacing: -.035em;
          font-weight: 500;
        }

        .fe-pillarContent p {
          max-width: 590px;
          color: #746a79;
          font-size: 13px;
          line-height: 1.7;
        }

        .fe-pillarActions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 23px;
        }

        .fe-pillarPrimary,
        .fe-pillarSecondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          min-height: 44px;
          padding: 0 17px;
          border-radius: 999px;
          text-decoration: none;
          font-size: 11px;
          font-weight: 800;
        }

        .fe-pillarPrimary {
          background: #211627;
          color: white;
        }

        .fe-pillarSecondary {
          background: #f2edf6;
          color: #4f355e;
        }

        .fe-pillarVisual {
          height: 235px;
          margin-top: 22px;
          border-radius: 18px;
          position: relative;
          overflow: hidden;
        }

        .fe-finance .fe-pillarVisual {
          background:
            radial-gradient(circle at 70% 25%, rgba(159,107,226,.28), transparent 25%),
            linear-gradient(140deg, #1d1424, #382147);
        }

        .fe-biography .fe-pillarVisual {
          background:
            radial-gradient(circle at 82% 10%, rgba(215,177,102,.22), transparent 29%),
            linear-gradient(145deg, #292017, #15110e);
        }

        .fe-language .fe-pillarVisual {
          background:
            radial-gradient(circle at 20% 10%, rgba(119,77,190,.2), transparent 25%),
            linear-gradient(145deg, #f4f0f8, #e9e0f2);
        }

        .fe-spiritual .fe-pillarVisual {
          background:
            radial-gradient(circle at 80% 20%, rgba(212,177,95,.18), transparent 28%),
            linear-gradient(145deg, #f6f2e7, #eee6d7);
        }

        .fe-portfolioVisual {
          position: absolute;
          inset: 25px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .fe-portfolioVisual > div {
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 13px;
          padding: 17px;
          color: white;
          background: rgba(255,255,255,.045);
        }

        .fe-portfolioVisual small,
        .fe-portfolioVisual strong {
          display: block;
        }

        .fe-portfolioVisual small {
          color: #b8a8c1;
          font-size: 7px;
          letter-spacing: .1em;
        }

        .fe-portfolioVisual strong {
          margin-top: 7px;
          font-family: Georgia, serif;
          font-size: 17px;
          font-weight: 500;
        }

        .fe-miniChart {
          margin-top: 17px;
          height: 34px;
          display: flex;
          align-items: end;
          gap: 5px;
        }

        .fe-miniChart i {
          flex: 1;
          border-radius: 2px 2px 0 0;
          background: #9e6fe0;
        }

        .fe-miniChart i:nth-child(1) { height: 28%; }
        .fe-miniChart i:nth-child(2) { height: 47%; }
        .fe-miniChart i:nth-child(3) { height: 40%; }
        .fe-miniChart i:nth-child(4) { height: 74%; }
        .fe-miniChart i:nth-child(5) { height: 92%; }

        .fe-biographyVisual {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 7px;
          padding: 18px;
          align-items: end;
        }

        .fe-bioPerson {
          height: 75%;
          border-radius: 80px 80px 13px 13px;
          position: relative;
          background:
            radial-gradient(circle at 50% 30%, #5b4a39 0 16%, transparent 17%),
            radial-gradient(ellipse at 50% 92%, #493928 0 35%, transparent 36%),
            linear-gradient(180deg, #ceb88b, #765d38);
          opacity: .83;
        }

        .fe-bioPerson:nth-child(2) {
          height: 96%;
          opacity: 1;
        }

        .fe-bioPerson span {
          position: absolute;
          left: 50%;
          bottom: 12px;
          transform: translateX(-50%);
          color: rgba(255,255,255,.84);
          font-family: Georgia, serif;
          font-size: 11px;
        }

        .fe-languageVisualMini {
          position: absolute;
          inset: 0;
        }

        .fe-languageVisualMini::before,
        .fe-languageVisualMini::after {
          content: "";
          position: absolute;
          border: 1px solid rgba(96, 60, 129, .18);
          border-radius: 50%;
        }

        .fe-languageVisualMini::before {
          width: 180px;
          height: 180px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        .fe-languageVisualMini::after {
          width: 100px;
          height: 100px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        .fe-languageWord {
          position: absolute;
          padding: 9px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,.75);
          color: #5c3f6b;
          box-shadow: 0 8px 20px rgba(77,50,94,.07);
          font-size: 10px;
          font-weight: 750;
        }

        .fe-languageWord:nth-child(1) { left: 12%; top: 23%; }
        .fe-languageWord:nth-child(2) { right: 14%; top: 17%; }
        .fe-languageWord:nth-child(3) { left: 38%; bottom: 16%; }
        .fe-languageWord:nth-child(4) { right: 9%; bottom: 27%; }

        .fe-spiritualVisualMini {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
        }

        .fe-grain {
          width: 105px;
          height: 145px;
          border: 1px solid rgba(121,96,48,.2);
          border-radius: 55px 55px 20px 20px;
          background:
            repeating-linear-gradient(
              90deg,
              rgba(141,104,51,.10) 0 4px,
              transparent 4px 11px
            ),
            rgba(255,255,255,.43);
          box-shadow: 0 18px 45px rgba(86,66,35,.09);
          position: relative;
        }

        .fe-grain::before,
        .fe-grain::after {
          content: "";
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 145px;
          height: 1px;
          background: rgba(126,92,42,.22);
        }

        .fe-grain::before { top: 48px; }
        .fe-grain::after { bottom: 45px; }

        .fe-feature {
          margin-top: 15px;
          min-height: 700px;
          padding: 76px;
          display: grid;
          grid-template-columns: 1fr .9fr;
          gap: 80px;
          align-items: center;
          border-radius: 33px;
          overflow: hidden;
        }

        .fe-biographyFeature {
          background:
            radial-gradient(circle at 85% 8%, rgba(198,154,72,.17), transparent 26%),
            linear-gradient(145deg, #211a17, #151110);
          color: white;
        }

        .fe-featureCopy h2,
        .fe-languageCopy h2,
        .fe-spiritualCopy h2,
        .fe-ayoCopy h2 {
          margin: 16px 0 18px;
          font-family: Georgia, serif;
          font-size: clamp(44px, 4.6vw, 68px);
          line-height: 1.01;
          letter-spacing: -.045em;
          font-weight: 500;
        }

        .fe-featureCopy h2 em,
        .fe-ayoCopy h2 em {
          color: #d2b272;
          font-weight: 400;
        }

        .fe-featureCopy > p {
          max-width: 620px;
          color: #c9c0ba;
          line-height: 1.78;
          font-size: 14px;
        }

        .fe-featureFlow {
          margin: 30px 0;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
          color: #d1c5bd;
          font-size: 9px;
          letter-spacing: .05em;
        }

        .fe-featureFlow i {
          color: #8a7665;
          font-style: normal;
        }

        .fe-darkButton {
          color: #251b14;
          background: #f3eadc;
          width: fit-content;
        }

        .fe-biographyStage {
          min-height: 480px;
          position: relative;
        }

        .fe-countryHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #a9998d;
          font-size: 8px;
          letter-spacing: .09em;
        }

        .fe-countryHeader strong {
          color: #e7d9c7;
          font-family: Georgia, serif;
          font-size: 14px;
          letter-spacing: .08em;
        }

        .fe-portraitDeck {
          height: 430px;
          margin-top: 23px;
          position: relative;
          perspective: 1000px;
        }

        .fe-portrait {
          position: absolute;
          bottom: 0;
          border-radius: 22px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.08);
        }

        .fe-portraitBack {
          width: 52%;
          height: 76%;
          right: 0;
          bottom: 37px;
          background: #362a22;
          transform: rotate(5deg);
        }

        .fe-portraitMid {
          width: 60%;
          height: 88%;
          left: 2%;
          bottom: 19px;
          background: #493827;
          transform: rotate(-5deg);
        }

        .fe-portraitBack > span,
        .fe-portraitMid > span {
          position: absolute;
          right: 17px;
          top: 14px;
          color: #8c7763;
          font-family: Georgia, serif;
          font-size: 16px;
        }

        .fe-portraitFront {
          width: 67%;
          height: 100%;
          left: 17%;
          z-index: 3;
          background:
            radial-gradient(circle at 70% 12%, rgba(198,161,92,.20), transparent 25%),
            linear-gradient(145deg, #756044, #241b15 69%);
          box-shadow: 0 35px 70px rgba(0,0,0,.3);
        }

        .fe-portraitSilhouette {
          height: 66%;
          position: relative;
        }

        .fe-portraitSilhouette div {
          position: absolute;
          width: 57%;
          height: 78%;
          left: 50%;
          bottom: 0;
          transform: translateX(-50%);
          border-radius: 100px 100px 20px 20px;
          background:
            radial-gradient(circle at 50% 28%, #1f1712 0 18%, transparent 19%),
            radial-gradient(ellipse at 50% 100%, #18110d 0 43%, transparent 44%);
          opacity: .88;
        }

        .fe-portraitInfo {
          padding: 23px;
          border-top: 1px solid rgba(255,255,255,.08);
          background: rgba(10,7,5,.42);
        }

        .fe-portraitInfo small,
        .fe-portraitInfo strong,
        .fe-portraitInfo span {
          display: block;
        }

        .fe-portraitInfo small {
          color: #bda87f;
          font-size: 7px;
          letter-spacing: .14em;
        }

        .fe-portraitInfo strong {
          margin-top: 6px;
          font-family: Georgia, serif;
          line-height: 1.2;
          font-size: 20px;
          font-weight: 500;
        }

        .fe-portraitInfo span {
          margin-top: 8px;
          color: #9f9185;
          font-size: 8px;
        }

        .fe-languageFeature,
        .fe-spiritualFeature {
          min-height: 660px;
          margin-top: 20px;
          border-radius: 32px;
          padding: 70px;
          display: grid;
          grid-template-columns: .95fr 1.05fr;
          gap: 80px;
          align-items: center;
        }

        .fe-languageFeature {
          background:
            radial-gradient(circle at 5% 5%, rgba(106,57,168,.14), transparent 26%),
            #f2edf6;
        }

        .fe-languageVisual {
          min-height: 470px;
          display: grid;
          place-items: center;
        }

        .fe-world {
          width: min(430px, 100%);
          aspect-ratio: 1;
          border-radius: 50%;
          position: relative;
          background:
            radial-gradient(circle at 31% 34%, rgba(109,70,149,.19) 0 10%, transparent 11%),
            radial-gradient(circle at 62% 28%, rgba(109,70,149,.16) 0 8%, transparent 9%),
            radial-gradient(circle at 67% 60%, rgba(109,70,149,.15) 0 12%, transparent 13%),
            linear-gradient(145deg, #ece3f3, #ddd0e8);
          border: 1px solid rgba(91,54,119,.12);
          box-shadow:
            inset 0 0 60px rgba(101,64,130,.07),
            0 30px 60px rgba(74,44,95,.08);
        }

        .fe-world::before,
        .fe-world::after {
          content: "";
          position: absolute;
          border: 1px solid rgba(88,52,118,.14);
          border-radius: 50%;
          inset: 11%;
        }

        .fe-world::after {
          inset: 28% 4%;
        }

        .fe-worldPoint {
          position: absolute;
          z-index: 2;
          padding: 7px 9px;
          border-radius: 999px;
          color: #4f315e;
          background: rgba(255,255,255,.77);
          box-shadow: 0 8px 20px rgba(79,48,94,.08);
          font-size: 7px;
          font-weight: 850;
          letter-spacing: .08em;
        }

        .fe-pointOne { left: 30%; top: 53%; }
        .fe-pointTwo { left: 34%; top: 26%; }
        .fe-pointThree { right: 10%; top: 45%; }
        .fe-pointFour { left: 7%; top: 35%; }

        .fe-languageCopy > p,
        .fe-spiritualCopy > p,
        .fe-ayoCopy > p {
          max-width: 630px;
          color: #655c69;
          font-size: 15px;
          line-height: 1.8;
        }

        .fe-languageList {
          margin: 28px 0;
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }

        .fe-languageList span {
          padding: 9px 13px;
          border: 1px solid rgba(76,44,97,.11);
          border-radius: 999px;
          background: rgba(255,255,255,.63);
          color: #5d4968;
          font-size: 9px;
          font-weight: 750;
        }

        .fe-languageActions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .fe-lightButton {
          color: #482d59;
          background: white;
          border: 1px solid rgba(72,45,89,.11);
        }

        .fe-commercialNote {
          display: block;
          margin-top: 16px;
          color: #8c7f92;
          font-size: 9px;
        }

        .fe-spiritualFeature {
          grid-template-columns: 1.05fr .95fr;
          background:
            radial-gradient(circle at 86% 8%, rgba(198,154,72,.13), transparent 25%),
            #eee8dc;
        }

        .fe-spiritualCopy h2 em {
          display: inline;
          color: #8f6f38;
          font-weight: 400;
        }

        .fe-storyStack {
          display: grid;
          gap: 11px;
        }

        .fe-storyCard {
          min-height: 120px;
          display: grid;
          grid-template-columns: 62px 1fr;
          grid-template-rows: auto auto;
          align-items: center;
          column-gap: 18px;
          padding: 20px;
          border-radius: 18px;
          background: rgba(255,255,255,.51);
          border: 1px solid rgba(111,82,40,.10);
          transition: transform .25s ease;
        }

        .fe-storyCard:hover {
          transform: translateX(-7px);
        }

        .fe-storyCard > span {
          grid-row: 1 / 3;
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #ded1b7;
          color: #735c38;
          font-family: Georgia, serif;
          font-size: 17px;
        }

        .fe-storyCard small {
          color: #8c724b;
          font-size: 7px;
          letter-spacing: .15em;
          font-weight: 850;
        }

        .fe-storyCard strong {
          font-family: Georgia, serif;
          font-size: 20px;
          font-weight: 500;
        }

        .fe-ayo {
          min-height: 610px;
          margin-top: 20px;
          padding: 72px;
          display: grid;
          grid-template-columns: 220px 1fr .95fr;
          gap: 60px;
          align-items: center;
          border-radius: 32px;
          background:
            radial-gradient(circle at 85% 0%, rgba(137,91,194,.18), transparent 25%),
            linear-gradient(145deg, #201629, #2a1737);
          color: white;
        }

        .fe-ayoAvatar {
          width: 205px;
          height: 290px;
          align-self: end;
          border-radius: 110px 110px 28px 28px;
          display: grid;
          place-items: center;
          background:
            radial-gradient(circle at 50% 30%, #8d6a50 0 17%, transparent 18%),
            radial-gradient(ellipse at 50% 100%, #6c35a3 0 42%, transparent 43%),
            linear-gradient(145deg, #9e7cb9, #463050);
          position: relative;
          overflow: hidden;
          box-shadow: 0 28px 60px rgba(0,0,0,.24);
        }

        .fe-ayoAvatar span {
          position: absolute;
          left: 17px;
          bottom: 12px;
          color: rgba(255,255,255,.38);
          font-family: Georgia, serif;
          font-size: 60px;
        }

        .fe-ayoCopy > span {
          color: #b894dd;
          font-size: 8px;
          font-weight: 850;
          letter-spacing: .16em;
        }

        .fe-ayoCopy > p {
          color: #c3b6cb;
          font-size: 13px;
        }

        .fe-ayoDialogue {
          padding: 25px;
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 22px;
          background: rgba(255,255,255,.055);
        }

        .fe-ayoDialogue small {
          color: #ba91df;
          font-size: 8px;
          letter-spacing: .14em;
          font-weight: 850;
        }

        .fe-ayoDialogue p {
          margin: 12px 0 20px;
          font-family: Georgia, serif;
          font-size: 23px;
          line-height: 1.3;
          color: #f1eaf5;
        }

        .fe-ayoDialogue div {
          display: grid;
          gap: 8px;
        }

        .fe-ayoDialogue button {
          text-align: left;
          padding: 13px 14px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,.1);
          color: #d9cedf;
          background: rgba(255,255,255,.06);
          font: inherit;
          font-size: 10px;
          cursor: default;
        }

        .fe-mainPlatform {
          margin-top: 20px;
          padding: 55px 60px;
          display: flex;
          justify-content: space-between;
          gap: 50px;
          align-items: center;
          border: 1px solid rgba(49,31,62,.09);
          border-radius: 27px;
          background: white;
        }

        .fe-mainPlatform > div > span {
          color: var(--purple);
          font-size: 8px;
          font-weight: 850;
          letter-spacing: .15em;
        }

        .fe-mainPlatform h2 {
          margin: 9px 0 7px;
          font-family: Georgia, serif;
          font-weight: 500;
          font-size: 34px;
          letter-spacing: -.03em;
        }

        .fe-mainPlatform p {
          margin: 0;
          max-width: 720px;
          color: #716777;
          font-size: 12px;
          line-height: 1.7;
        }

        .fe-mainPlatform > a {
          flex: 0 0 auto;
          display: inline-flex;
          gap: 21px;
          align-items: center;
          padding: 13px 18px;
          border-radius: 999px;
          background: #f1ebf6;
          color: #4d315b;
          text-decoration: none;
          font-size: 11px;
          font-weight: 800;
        }

        .fe-final {
          width: min(1380px, calc(100% - 48px));
          min-height: 480px;
          margin: 105px auto 45px;
          padding: 80px 35px;
          border-radius: 34px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
          background:
            radial-gradient(circle at 50% 120%, rgba(174,116,230,.3), transparent 38%),
            linear-gradient(145deg, #25152f, #371849);
          position: relative;
          overflow: hidden;
        }

        .fe-finalGlow {
          position: absolute;
          width: 400px;
          height: 400px;
          right: -140px;
          top: -220px;
          border-radius: 50%;
          background: rgba(203,174,229,.12);
          filter: blur(30px);
        }

        .fe-final > span {
          color: #b99ad2;
          font-size: 8px;
          font-weight: 850;
          letter-spacing: .17em;
        }

        .fe-final h2 {
          margin: 13px 0 10px;
          font-family: Georgia, serif;
          font-size: clamp(50px, 5vw, 74px);
          line-height: 1;
          font-weight: 500;
          letter-spacing: -.045em;
        }

        .fe-final p {
          margin: 0;
          color: #cbbfd0;
          font-size: 14px;
        }

        .fe-finalActions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 29px;
        }

        .fe-finalSecondary {
          display: inline-flex;
          align-items: center;
          padding: 0 20px;
          min-height: 52px;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 999px;
          color: #eadff0;
          text-decoration: none;
          font-size: 12px;
          font-weight: 750;
        }

        .fe-footer {
          width: min(1380px, calc(100% - 48px));
          min-height: 120px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1.4fr 1fr;
          gap: 30px;
          align-items: center;
          border-top: 1px solid rgba(48,28,61,.08);
        }

        .fe-footer p {
          text-align: center;
          color: #8a808e;
          font-size: 9px;
          line-height: 1.6;
        }

        .fe-footer > span {
          justify-self: end;
          color: #a295a8;
          font-size: 9px;
        }

        @media (max-width: 1100px) {
          .fe-nav {
            grid-template-columns: 1fr auto;
          }

          .fe-navLinks {
            display: none;
          }

          .fe-hero {
            grid-template-columns: 1fr;
            gap: 25px;
            padding-top: 65px;
          }

          .fe-heroCopy {
            max-width: 850px;
          }

          .fe-heroVisual {
            margin-top: 20px;
          }

          .fe-manifestoGrid,
          .fe-perspectiveHeading,
          .fe-feature,
          .fe-languageFeature,
          .fe-spiritualFeature {
            grid-template-columns: 1fr;
          }

          .fe-manifestoGrid,
          .fe-perspectiveHeading,
          .fe-feature,
          .fe-languageFeature,
          .fe-spiritualFeature {
            gap: 45px;
          }

          .fe-ayo {
            grid-template-columns: 180px 1fr;
          }

          .fe-ayoAvatar {
            width: 170px;
          }

          .fe-ayoDialogue {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 760px) {
          .fe-nav,
          .fe-hero,
          .fe-topicRailInner,
          .fe-manifesto,
          .fe-perspectives,
          .fe-feature,
          .fe-languageFeature,
          .fe-spiritualFeature,
          .fe-ayo,
          .fe-mainPlatform,
          .fe-final,
          .fe-lifeWealth
          .fe-footer {
            width: min(100% - 24px, 1380px);
          }

          .fe-nav {
            min-height: 72px;
          }

          .fe-navCta {
            padding: 9px 12px;
          }

          .fe-navCta span {
            display: none;
          }

          .fe-hero {
            min-height: auto;
            padding: 56px 0 62px;
          }

          .fe-hero h1 {
            font-size: clamp(50px, 15vw, 70px);
          }

          .fe-heroLead {
            font-size: 16px;
          }

          .fe-heroVisual {
            min-height: 440px;
          }

          .fe-screen {
            width: 100%;
            min-height: 390px;
            transform: none;
          }

          .fe-marketCanvas {
            min-height: 285px;
            padding: 27px 23px;
          }

          .fe-allocation {
            grid-template-columns: 105px 1fr;
            gap: 18px;
          }

          .fe-allocationRing {
            width: 102px;
          }

          .fe-floatingCard {
            display: none;
          }

          .fe-gameCanvas {
            min-height: 0;
            padding: 23px 18px;
          }

          .fe-gameChoices {
            grid-template-columns: 1fr;
          }

          .fe-gameChoice > p {
            min-height: 0;
          }

          .fe-gameIntro h2 {
            font-size: 32px;
          }

          .fe-manifesto {
            padding: 78px 0;
          }

          .fe-manifestoGrid {
            gap: 28px;
          }

          .fe-pillarGrid {
            grid-template-columns: 1fr;
          }

          .fe-pillar {
            min-height: 560px;
          }

          .fe-perspectives {
            padding: 75px 0;
          }

          .fe-feature,
          .fe-languageFeature,
          .fe-spiritualFeature,
          .fe-ayo {
            padding: 38px 24px;
          }

          .fe-feature {
            min-height: auto;
          }

          .fe-featureCopy h2,
          .fe-languageCopy h2,
          .fe-spiritualCopy h2,
          .fe-ayoCopy h2 {
            font-size: 44px;
          }

          .fe-biographyStage {
            min-height: 410px;
          }

          .fe-portraitDeck {
            height: 370px;
          }

          .fe-languageVisual {
            min-height: 350px;
          }

          .fe-world {
            width: 330px;
            max-width: 100%;
          }

          .fe-ayo {
            grid-template-columns: 1fr;
          }

          .fe-ayoAvatar {
            width: 180px;
            height: 245px;
            margin-inline: auto;
          }

          .fe-ayoCopy {
            text-align: center;
          }

          .fe-mainPlatform {
            padding: 36px 25px;
            flex-direction: column;
            align-items: flex-start;
          }

          .fe-footer {
            padding: 35px 0;
            grid-template-columns: 1fr;
            justify-items: center;
            text-align: center;
          }

          .fe-footer p {
            max-width: 500px;
          }

          .fe-footer > span {
            justify-self: center;
          }
        }
      `}</style>
    </main>
  );
}

function PillarVisual({
  type,
}: {
  type:
    | "portfolio"
    | "portraits"
    | "world"
    | "stewardship";
}) {
  if (type === "portfolio") {
    return (
      <div className="fe-pillarVisual">
        <div className="fe-portfolioVisual">
          <div>
            <small>OWNERSHIP</small>
            <strong>Assets</strong>

            <div className="fe-miniChart">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>

          <div>
            <small>CAPITAL</small>
            <strong>Allocation</strong>

            <div className="fe-miniChart">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "portraits") {
    return (
      <div className="fe-pillarVisual">
        <div className="fe-biographyVisual">
          <div className="fe-bioPerson">
            <span>US</span>
          </div>

          <div className="fe-bioPerson">
            <span>NG</span>
          </div>

          <div className="fe-bioPerson">
            <span>IN</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === "world") {
    return (
      <div className="fe-pillarVisual">
        <div className="fe-languageVisualMini">
          <span className="fe-languageWord">
            Ẹ káàrọ̀
          </span>

          <span className="fe-languageWord">
            你好
          </span>

          <span className="fe-languageWord">
            Ndewo
          </span>

          <span className="fe-languageWord">
            Bonjour
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="fe-pillarVisual">
      <div className="fe-spiritualVisualMini">
        <div className="fe-grain" />
      </div>
    </div>
  );
}