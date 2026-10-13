"use client";

import Link from "next/link";
import FinancialEducationAyoFlow from "./FinancialEducationAyoFlow";
import FinancialEducationFlowProgress from "./FinancialEducationFlowProgress";

export default function FinancialEducationGatewayClient() {
  return (
    <main className="flowPage">
      <div className="ambientGlow glowPrimary" aria-hidden="true" />
      <div className="ambientGlow glowSecondary" aria-hidden="true" />
      <div className="meshGrid" aria-hidden="true" />

      <section className="experienceShell">
        <FinancialEducationFlowProgress
          steps={[
            { label: "Welcome", state: "current" },
            { label: "Free Lesson", state: "upcoming" },
            { label: "Learn", state: "upcoming" },
            { label: "Graduate", state: "upcoming" },
          ]}
          nextLabel="Begin with your free Financial Literacy lesson"
        />

        <div className="brandLine">
          <span className="brandTag">FOUNTAIN PREP</span>
          <span className="brandDot" />
          <span className="brandSub">FINANCIAL EDUCATION</span>
        </div>

        <header className="intro ayoTourIntro">
          <span className="eyebrow">FOUNTAIN PREP FINANCIAL LITERACY ACADEMY</span>

          <h1>
            Build financial knowledge
            <span className="serifAccent"> for life.</span>
          </h1>

          <p className="heroCopy">
            A structured Financial Literacy Academy for individuals and families
            who want to understand how money, assets, business, investment,
            risk and capital really work.
          </p>
        </header>

        {/* MAIN PRODUCT */}
        <section className="academyCard ayoTourLearning">
          <div className="academyGlow" aria-hidden="true" />

          <div className="academyMain">
            <div className="academyTop">
              <span className="primaryBadge">
                <span className="badgePulse" />
                START HERE
              </span>

              <span className="academyLabel">FINANCIAL LITERACY ACADEMY</span>
            </div>

            <div className="academyContent">
              <div className="academyIcon" aria-hidden="true">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  <circle cx="12" cy="10" r="2" />
                </svg>
              </div>

              <div className="academyText">
                <h2>Start Financial Literacy</h2>

                <p>
                  Learn how to think about money beyond saving and spending.
                  Understand assets, enterprise, investment options, risk,
                  ownership and capital allocation through a guided learning
                  journey.
                </p>
              </div>
            </div>

            <div className="journey">
              <div className="journeyItem">
                <span className="journeyNumber">1</span>
                <div>
                  <strong>Start free</strong>
                  <small>Take your first lesson at no cost.</small>
                </div>
              </div>

              <div className="journeyLine" />

              <div className="journeyItem">
                <span className="journeyNumber">2</span>
                <div>
                  <strong>Unlock the academy</strong>
                  <small>Continue when you are ready.</small>
                </div>
              </div>

              <div className="journeyLine" />

              <div className="journeyItem">
                <span className="journeyNumber">3</span>
                <div>
                  <strong>Complete the training</strong>
                  <small>Progress through the structured curriculum.</small>
                </div>
              </div>

              <div className="journeyLine" />

              <div className="journeyItem">
                <span className="journeyNumber">4</span>
                <div>
                  <strong>Graduate</strong>
                  <small>Complete the academy and earn your certificate.</small>
                </div>
              </div>
            </div>

            <div className="academyBottom">
              <div className="academyFacts">
                <span>✓ First lesson free</span>
                <span>✓ No card required to start</span>
                <span>✓ Structured learning</span>
                <span>✓ Certificate included</span>
              </div>

              <Link
  href="/academies/financial-literacy"
  className="primaryAction"
  style={{
    flex: "0 0 auto",
    width: "260px",
    minHeight: "64px",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "18px",
    padding: "10px 18px",
    borderRadius: "16px",
    color: "#ffffff",
    textDecoration: "none",
    background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
    boxShadow: "0 12px 28px rgba(109, 40, 217, 0.24)",
  }}
>
  <span
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "2px",
    }}
  >
    <small
      style={{
        display: "block",
        color: "rgba(255,255,255,0.75)",
        fontSize: "8px",
        lineHeight: 1.2,
        fontWeight: 800,
        letterSpacing: "0.1em",
      }}
    >
      BEGIN YOUR ACADEMY
    </small>

    <strong
      style={{
        display: "block",
        color: "#ffffff",
        fontSize: "15px",
        lineHeight: 1.25,
        fontWeight: 850,
      }}
    >
      Start Free Lesson
    </strong>
  </span>

  <span
  aria-hidden="true"
  style={{
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: 800,
    lineHeight: 1,
  }}
>
  →
</span>
</Link>            </div>
          </div>

          <aside className="academyAside">
            <span className="asideEyebrow">YOUR LEARNING PATH</span>

            <h3>One academy. A clear journey.</h3>

            <p>
              You do not need to decide between different experiences. Start
              with Financial Literacy and build your foundation first.
            </p>

            <div className="pathList">
              <div className="pathItem">
                <span>01</span>
                <div>
                  <strong>Experience</strong>
                  <small>Try the first lesson free.</small>
                </div>
              </div>

              <div className="pathItem">
                <span>02</span>
                <div>
                  <strong>Learn</strong>
                  <small>Unlock the complete academy.</small>
                </div>
              </div>

              <div className="pathItem">
                <span>03</span>
                <div>
                  <strong>Apply</strong>
                  <small>Use simulations to practise what you learn.</small>
                </div>
              </div>

              <div className="pathItem">
                <span>04</span>
                <div>
                  <strong>Graduate</strong>
                  <small>Complete your learning journey.</small>
                </div>
              </div>
            </div>
          </aside>
        </section>

        {/* SECONDARY EXPERIENCE */}
        <section className="practiceSection ayoTourSimulation">
          <div className="practiceIcon" aria-hidden="true">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>

          <div className="practiceCopy">
            <span className="practiceEyebrow">PRACTICE WHAT YOU LEARN</span>
            <h3>Financial Simulation Games</h3>
            <p>
              Put financial ideas into practice using fictional money. Make
              investment and personal-finance decisions without risking real
              money.
            </p>
          </div>

          <Link
            href="/academies/financial-literacy/investment-lab"
            className="practiceAction"
          >
            Explore Simulations
            <span>→</span>
          </Link>
        </section>

        {/* OPTIONAL EXPLORATION */}
        <Link
          href="/academies/biography"
          className="biographyLink ayoTourBiography"
        >
          <div className="bioBadgeContainer">
            <span className="bioTag">EXPLORE MORE</span>
          </div>

          <div className="bioContent">
            <strong>Biography of Greatness</strong>
            <small>
              Study the decisions, ownership and capital allocation behind
              extraordinary journeys.
            </small>
          </div>

          <div className="bioArrow">→</div>
        </Link>

        <FinancialEducationAyoFlow
          title="I’ll guide you from here."
          text="Financial Literacy is the heart of your journey. Start with your complimentary first lesson, experience the academy, and continue into the full programme when you are ready. The simulations are here to help you practise what you learn."
          tourSteps={[
            {
              selector: ".ayoTourIntro",
              title: "Welcome to Fountain Prep Financial Education.",
              text: "Hello, and welcome. I’m Ayo, and I’ll guide you through your Financial Literacy journey. We built this academy to make important financial knowledge understandable, structured and practical for individuals and families.",
            },
            {
              selector: ".ayoTourLearning",
              title: "This is where your journey begins.",
              text: "Financial Literacy is the core academy. Your first lesson is complimentary, so you can experience the learning environment before deciding whether to continue. No card is required to begin.",
            },
            {
              selector: ".ayoTourLearning",
              title: "Follow one clear learning path.",
              text: "Start with the free lesson, unlock the full academy when you are ready, progress through the structured training, and complete your learning journey toward graduation and your certificate.",
            },
            {
              selector: ".ayoTourSimulation",
              title: "Practise what you learn.",
              text: "The simulation games support your Financial Literacy training. Use fictional money to make decisions, test ideas and see possible consequences without putting real money at risk.",
            },
            {
              selector: ".ayoTourBiography",
              title: "Explore further when you want to.",
              text: "Biography of Greatness is an additional experience. It lets you study the decisions, ownership, risks and capital allocation behind extraordinary journeys. Your Financial Literacy Academy remains your main learning path.",
            },
          ]}
        />
      </section>

      <style jsx>{`
        :global(html) {
          -webkit-text-size-adjust: 100%;
          scroll-behavior: smooth;
        }

        :global(body) {
          margin: 0;
          background: #f8f6fc;
          color: #21142d;
          overflow-x: hidden;
          font-family:
            -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text",
            "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .flowPage {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  box-sizing: border-box;

  /* Keep the academy safely below the global navbar */
  padding: 34px 16px 64px;

  overflow-x: hidden;
  overflow-y: visible;

  background:
    radial-gradient(
      circle at 18% 10%,
      rgba(124, 58, 237, 0.08),
      transparent 30%
    ),
    radial-gradient(
      circle at 88% 16%,
      rgba(217, 119, 6, 0.055),
      transparent 27%
    ),
    linear-gradient(
      180deg,
      #fbf9ff 0%,
      #ffffff 46%,
      #fdfaff 100%
    );
}

        .ambientGlow {
          position: absolute;
          border-radius: 50%;
          filter: blur(110px);
          pointer-events: none;
          z-index: 0;
          opacity: 0.5;
        }

        .glowPrimary {
          width: 440px;
          height: 440px;
          top: -180px;
          left: 5%;
          background: rgba(124, 58, 237, 0.12);
        }

        .glowSecondary {
          width: 420px;
          height: 420px;
          bottom: -180px;
          right: -80px;
          background: rgba(245, 158, 11, 0.08);
        }

        .meshGrid {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image: radial-gradient(
            rgba(75, 45, 105, 0.07) 1px,
            transparent 1px
          );
          background-size: 32px 32px;
          mask-image: radial-gradient(
            circle at 50% 28%,
            black 18%,
            transparent 72%
          );
        }

        .experienceShell {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1220px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 24px 34px 34px;
          border: 1px solid rgba(83, 52, 116, 0.1);
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.82);
          box-shadow:
            0 24px 70px rgba(63, 36, 91, 0.09),
            inset 0 1px 0 rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        .brandLine {
          display: inline-flex;
          align-items: center;
          align-self: center;
          gap: 9px;
          padding: 6px 14px;
          border-radius: 999px;
          background: #f5efff;
          border: 1px solid #e9ddfb;
        }

        .brandTag,
        .brandSub {
          font-size: 10px;
          font-weight: 850;
          letter-spacing: 0.13em;
        }

        .brandTag {
          color: #6d28d9;
        }

        .brandSub {
          color: #766784;
        }

        .brandDot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #b9a7cb;
        }

        .intro {
          max-width: 900px;
          margin: 2px auto 8px;
          text-align: center;
        }

        .eyebrow {
          display: block;
          margin-bottom: 10px;
          color: #765b92;
          font-size: 10px;
          font-weight: 850;
          letter-spacing: 0.15em;
        }

        .intro h1 {
          margin: 0;
          color: #21122f;
          font-size: clamp(42px, 5vw, 68px);
          line-height: 1;
          font-weight: 850;
          letter-spacing: -0.055em;
        }

        .serifAccent {
          font-family: Georgia, "Times New Roman", serif;
          font-style: italic;
          font-weight: 400;
          background: linear-gradient(135deg, #5b21b6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .heroCopy {
          max-width: 720px;
          margin: 18px auto 0;
          color: #665b70;
          font-size: 15px;
          line-height: 1.65;
        }

        /* MAIN ACADEMY */

        .academyCard {
          position: relative;
          overflow: hidden;
          display: grid;
          grid-template-columns: minmax(0, 1.65fr) minmax(280px, 0.7fr);
          border: 1px solid rgba(124, 58, 237, 0.2);
          border-radius: 28px;
          background: linear-gradient(145deg, #ffffff 0%, #faf7ff 100%);
          box-shadow:
            0 24px 60px rgba(91, 33, 182, 0.12),
            inset 0 1px 0 #ffffff;
        }

        .academyGlow {
          position: absolute;
          width: 500px;
          height: 500px;
          left: -220px;
          top: -260px;
          border-radius: 50%;
          background: rgba(124, 58, 237, 0.11);
          filter: blur(30px);
          pointer-events: none;
        }

        .academyMain {
          position: relative;
          z-index: 1;
          padding: 32px;
        }

        .academyTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 24px;
        }

        .primaryBadge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 11px;
          border-radius: 999px;
          color: #6d28d9;
          background: #f1e9ff;
          border: 1px solid #ddccfa;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .badgePulse {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
        }

        .academyLabel {
          color: #8b7a96;
          font-size: 10px;
          font-weight: 850;
          letter-spacing: 0.13em;
        }

        .academyContent {
          display: flex;
          align-items: flex-start;
          gap: 18px;
        }

        .academyIcon {
          width: 68px;
          height: 68px;
          min-width: 68px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 19px;
          color: white;
          background: linear-gradient(135deg, #7c3aed, #5b21b6);
          box-shadow: 0 12px 26px rgba(124, 58, 237, 0.25);
        }

        .academyText h2 {
          margin: 0 0 9px;
          color: #251531;
          font-size: clamp(27px, 3vw, 38px);
          line-height: 1.1;
          letter-spacing: -0.035em;
        }

        .academyText p {
          max-width: 680px;
          margin: 0;
          color: #655a6e;
          font-size: 14px;
          line-height: 1.65;
        }

        .journey {
          display: grid;
          grid-template-columns:
            minmax(120px, 1fr) 20px minmax(120px, 1fr) 20px
            minmax(120px, 1fr) 20px minmax(120px, 1fr);
          align-items: center;
          gap: 8px;
          margin: 30px 0;
          padding: 20px;
          border-radius: 18px;
          background: #faf7ff;
          border: 1px solid #eee5f8;
        }

        .journeyItem {
          display: flex;
          align-items: flex-start;
          gap: 9px;
        }

        .journeyNumber {
          width: 25px;
          height: 25px;
          min-width: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: #6d28d9;
          background: #eee5ff;
          font-size: 10px;
          font-weight: 900;
        }

        .journeyItem strong {
          display: block;
          color: #31203e;
          font-size: 11px;
          margin-bottom: 3px;
        }

        .journeyItem small {
          display: block;
          color: #83758d;
          font-size: 9px;
          line-height: 1.4;
        }

        .journeyLine {
          height: 1px;
          background: #ddd1e9;
        }

        .academyBottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .academyFacts {
          display: flex;
          flex-wrap: wrap;
          gap: 7px 14px;
          color: #64546e;
          font-size: 10px;
          font-weight: 700;
        }

        .primaryAction {
  flex: 0 0 auto;
  width: 260px;
  min-height: 64px;
  box-sizing: border-box;
  display: flex !important;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 10px 18px;
  border-radius: 16px;
  color: #ffffff !important;
  text-decoration: none !important;
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%) !important;
  box-shadow: 0 12px 28px rgba(109, 40, 217, 0.24);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.primaryAction > span {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.primaryAction small {
  display: block;
  color: rgba(255, 255, 255, 0.72) !important;
  font-size: 8px;
  line-height: 1.2;
  font-weight: 800;
  letter-spacing: 0.1em;
}

.primaryAction strong {
  display: block;
  color: #ffffff !important;
  font-size: 15px;
  line-height: 1.25;
  font-weight: 850;
}

.primaryAction svg {
  flex: 0 0 auto;
  color: #ffffff;
}

.primaryAction:hover {
  color: #ffffff !important;
  text-decoration: none !important;
  transform: translateY(-2px);
  box-shadow: 0 16px 34px rgba(109, 40, 217, 0.32);
}

        .academyAside {
          position: relative;
          z-index: 1;
          padding: 32px 27px;
          border-left: 1px solid #eee6f5;
          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(124, 58, 237, 0.1),
              transparent 45%
            ),
            rgba(249, 246, 253, 0.82);
        }

        .asideEyebrow {
          color: #7c3aed;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.13em;
        }

        .academyAside h3 {
          margin: 12px 0 9px;
          color: #2b1938;
          font-size: 23px;
          line-height: 1.15;
          letter-spacing: -0.025em;
        }

        .academyAside > p {
          margin: 0;
          color: #74677d;
          font-size: 12px;
          line-height: 1.6;
        }

        .pathList {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-top: 25px;
        }

        .pathItem {
          display: flex;
          gap: 11px;
          align-items: flex-start;
        }

        .pathItem > span {
          color: #8b5cf6;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.08em;
          padding-top: 2px;
        }

        .pathItem strong {
          display: block;
          margin-bottom: 2px;
          color: #382746;
          font-size: 11px;
        }

        .pathItem small {
          display: block;
          color: #887a91;
          font-size: 9px;
          line-height: 1.4;
        }

        /* SIMULATION SUPPORT */

        .practiceSection {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 18px;
          padding: 20px 22px;
          border-radius: 20px;
          border: 1px solid #f1dfbf;
          background: linear-gradient(135deg, #fffdfa, #fff8ed);
          box-shadow: 0 10px 28px rgba(180, 83, 9, 0.06);
        }

        .practiceIcon {
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 15px;
          color: #fff;
          background: linear-gradient(135deg, #e1840b, #b45309);
          box-shadow: 0 9px 20px rgba(217, 119, 6, 0.2);
        }

        .practiceEyebrow {
          color: #a75a0a;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .practiceCopy h3 {
          margin: 4px 0;
          color: #372418;
          font-size: 18px;
        }

        .practiceCopy p {
          margin: 0;
          max-width: 650px;
          color: #75675d;
          font-size: 11px;
          line-height: 1.5;
        }

        .practiceAction {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          min-height: 44px;
          padding: 0 17px;
          border-radius: 12px;
          color: #9a4e08;
          background: #fff;
          border: 1px solid #efd6ac;
          text-decoration: none;
          font-size: 11px;
          font-weight: 800;
          white-space: nowrap;
        }

        /* BIOGRAPHY */

        .biographyLink {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px 18px;
          border-radius: 16px;
          background: #fff;
          border: 1px solid rgba(83, 52, 116, 0.1);
          color: #2b1a38;
          text-decoration: none;
          box-shadow: 0 7px 20px rgba(63, 36, 91, 0.04);
          transition: 0.25s ease;
        }

        .biographyLink:hover {
          background: #faf7ff;
          border-color: rgba(124, 58, 237, 0.2);
          transform: translateY(-1px);
        }

        .bioBadgeContainer {
          flex-shrink: 0;
        }

        .bioTag {
          padding: 5px 8px;
          border-radius: 6px;
          color: #6c5c79;
          background: #f1ebf7;
          font-size: 8px;
          font-weight: 850;
          letter-spacing: 0.09em;
        }

        .bioContent {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 3px;
        }

        .bioContent strong {
          color: #291936;
          font-size: 12px;
        }

        .bioContent small {
          color: #786d80;
          font-size: 10px;
          line-height: 1.4;
        }

        .bioArrow {
          color: #7c3aed;
          font-size: 20px;
        }

        /* TABLET */

        @media (max-width: 960px) {
          .academyCard {
            grid-template-columns: 1fr;
          }

          .academyAside {
            border-left: 0;
            border-top: 1px solid #eee6f5;
          }

          .pathList {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
          }

          .journey {
            grid-template-columns: repeat(4, 1fr);
          }

          .journeyLine {
            display: none;
          }
        }

        @media (max-width: 840px) {
          .flowPage {
            padding: 12px;
          }

          .experienceShell {
            padding: 20px;
            gap: 17px;
            border-radius: 24px;
          }

          .intro h1 {
            font-size: clamp(38px, 8vw, 54px);
          }

          .academyMain {
            padding: 26px;
          }

          .academyBottom {
            align-items: stretch;
            flex-direction: column;
          }

          .primaryAction {
            width: 100%;
          }

          .practiceSection {
            grid-template-columns: auto 1fr;
          }

          .practiceAction {
            grid-column: 1 / -1;
            width: 100%;
            box-sizing: border-box;
          }
        }

        /* IPHONE / MOBILE */

        @media (max-width: 600px) {
          .flowPage {
            padding: 8px 8px 30px;
          }

          .experienceShell {
            padding: 14px;
            gap: 15px;
            border-radius: 20px;
          }

          .brandLine {
            padding: 5px 10px;
          }

          .brandTag,
          .brandSub {
            font-size: 8px;
          }

          .intro {
            margin-top: 0;
          }

          .eyebrow {
            font-size: 8px;
            line-height: 1.4;
          }

          .intro h1 {
            font-size: clamp(35px, 11vw, 46px);
            line-height: 1.01;
          }

          .serifAccent {
            display: block;
            margin-top: 4px;
          }

          .heroCopy {
            margin-top: 14px;
            font-size: 13px;
            line-height: 1.55;
          }

          .academyCard {
            border-radius: 22px;
          }

          .academyMain {
            padding: 19px;
          }

          .academyTop {
            align-items: flex-start;
            flex-direction: column;
            margin-bottom: 20px;
          }

          .academyLabel {
            font-size: 8px;
          }

          .academyContent {
            flex-direction: column;
            gap: 14px;
          }

          .academyIcon {
            width: 56px;
            height: 56px;
            min-width: 56px;
            border-radius: 16px;
          }

          .academyText h2 {
            font-size: 27px;
          }

          .academyText p {
            font-size: 13px;
          }

          .journey {
            grid-template-columns: 1fr;
            gap: 15px;
            margin: 22px 0;
            padding: 16px;
          }

          .journeyLine {
            display: none;
          }

          .journeyItem strong {
            font-size: 12px;
          }

          .journeyItem small {
            font-size: 10px;
          }

          .academyFacts {
            display: grid;
            grid-template-columns: 1fr;
            gap: 7px;
            font-size: 10px;
          }

          .primaryAction {
            min-width: 0;
            min-height: 62px;
            border-radius: 15px;
          }

          .academyAside {
            padding: 21px 19px;
          }

          .academyAside h3 {
            font-size: 21px;
          }

          .pathList {
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }

          .practiceSection {
            grid-template-columns: 1fr;
            padding: 18px;
          }

          .practiceIcon {
            width: 48px;
            height: 48px;
          }

          .practiceCopy h3 {
            font-size: 17px;
          }

          .practiceCopy p {
            font-size: 11px;
          }

          .practiceAction {
            min-height: 48px;
          }

          .biographyLink {
            align-items: flex-start;
            flex-wrap: wrap;
            gap: 10px;
            padding: 14px;
          }

          .bioBadgeContainer {
            width: 100%;
          }

          .bioContent small {
            display: none;
          }
        }

        @media (max-width: 380px) {
          .flowPage {
            padding-left: 5px;
            padding-right: 5px;
          }

          .experienceShell {
            padding: 11px;
          }

          .intro h1 {
            font-size: 34px;
          }

          .academyMain {
            padding: 16px;
          }

          .pathList {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .primaryAction,
          .biographyLink {
            transition: none !important;
          }
        }
      `}</style>
    </main>
  );
}