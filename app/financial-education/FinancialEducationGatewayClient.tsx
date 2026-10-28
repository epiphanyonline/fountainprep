"use client";

import Link from "next/link";
import FinancialEducationAyoFlow from "./FinancialEducationAyoFlow";

/** Financial Literacy app home. Existing course links and guided tour are retained. */
export default function FinancialEducationGatewayClient() {
  return (
    <main className="flowPage fpAppHome">
      <div className="ambientGlow glowPrimary" aria-hidden="true" />
      <div className="ambientGlow glowSecondary" aria-hidden="true" />
      <div className="meshGrid" aria-hidden="true" />
      <section className="experienceShell">
        <div className="fpAppHeading ayoTourIntro">
          <div className="fpAppHeadingCopy">
            <span className="fpEyebrow">FOUNTAINPREP · FINANCIAL EDUCATION</span>
            <h1>Financial literacy partner <em>for families around the world.</em></h1>
            <p>Practical financial education for every stage of life.</p>
          </div>
          <div className="fpHeroSymbol" aria-hidden="true"><span>₦</span><span>£</span><span>$</span></div>
        </div>

        <section className="fpJourney" aria-labelledby="fp-journey-title">
          <div className="fpSectionTitle"><div><span className="fpOverline">YOUR ROADMAP</span><h2 id="fp-journey-title">Your learning journey</h2></div><span className="fpJourneyCount">4 steps</span></div>
          <div className="fpJourneyGrid" aria-label="Start free, unlock, learn and practise, graduate">
            <div className="fpJourneyStep"><span className="fpStepNumber fpStepCurrent">01</span><strong>Start free</strong></div>
            <div className="fpJourneyStep"><span className="fpStepNumber">02</span><strong>Unlock</strong></div>
            <div className="fpJourneyStep"><span className="fpStepNumber">03</span><strong>Learn &amp; practise</strong></div>
            <div className="fpJourneyStep"><span className="fpStepNumber">04</span><strong>Graduate</strong></div>
          </div>
        </section>

        <section className="fpFeatured ayoTourLearning" aria-labelledby="fp-feature-title">
          <div className="fpFeaturedTop">
            <span className="fpPill"><span className="fpPulse" /> START HERE</span>
            <span className="fpFreeTag">LESSON 01 · FREE</span>
          </div>
          <div className="fpFeaturedBody">
            <div className="fpCourseIcon" aria-hidden="true">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><circle cx="12" cy="10" r="2"/></svg>
            </div>
            <div className="fpFeaturedText">
              <span className="fpOverline">YOUR FEATURED ACADEMY</span>
              <h2 id="fp-feature-title">Financial Literacy</h2>
              <p>Understand money, assets, investing, business, risk and ownership through guided lessons.</p>
            </div>
          </div>
          <Link className="fpStartButton" href="/academies/financial-literacy">
            <span><small>BEGIN YOUR LEARNING JOURNEY</small><strong>Start free lesson</strong></span>
            <span className="fpStartArrow" aria-hidden="true">→</span>
          </Link>
          <p className="fpTrustLine"><span>✓ No card required</span><span>✓ Learn at your pace</span><span>✓ Certificate pathway</span></p>
        </section>

        <section className="fpExplore" aria-labelledby="fp-explore-title">
          <div className="fpSectionTitle"><div><span className="fpOverline">KEEP EXPLORING</span><h2 id="fp-explore-title">More ways to learn</h2></div></div>
          <div className="fpExploreGrid">
            <Link href="/academies/financial-literacy/investment-lab" className="fpExploreCard ayoTourSimulation">
              <span className="fpExploreIcon fpAmber" aria-hidden="true">◇</span>
              <span className="fpExploreCopy"><strong>Financial Simulation Games</strong><small>Practise decisions with fictional money, without risking your own.</small><span className="fpExploreAction">Explore simulations →</span></span>
            </Link>
            <Link href="/academies/biography" className="fpExploreCard ayoTourBiography">
              <span className="fpExploreIcon" aria-hidden="true">✦</span>
              <span className="fpExploreCopy"><strong>Biography of Greatness</strong><small>Learn from the decisions and journeys of remarkable people.</small><span className="fpExploreAction">Explore biographies →</span></span>
            </Link>
          </div>
        </section>

        <FinancialEducationAyoFlow
          title="I’ll guide you from here."
          text="Start with your complimentary Financial Literacy lesson, then continue into the full academy when you're ready."
          tourSteps={[
            { selector: ".ayoTourIntro", title: "Welcome to FountainPrep Financial Education.", text: "I'm Ayo. This is your starting point for practical, structured financial education." },
            { selector: ".ayoTourLearning", title: "Your first lesson is free.", text: "Start here to experience the classroom before deciding whether to unlock the academy. No payment card is needed to begin." },
            { selector: ".fpJourney", title: "Follow your learning journey.", text: "Try your first lesson, unlock the full academy when you're ready, learn and practise, then work toward your certificate." },
            { selector: ".ayoTourSimulation", title: "Practise safely.", text: "Use fictional money to test financial decisions without putting real money at risk." },
            { selector: ".ayoTourBiography", title: "Explore remarkable journeys.", text: "Discover the decisions, ownership and risks behind extraordinary life stories." }
          ]}
        />
      </section>
      <nav className="fpBottomNav" aria-label="Financial Education navigation">
        <div className="fpBottomNavInner">
          <Link href="/financial-education" aria-current="page"><span aria-hidden="true">⌂</span><small>Home</small></Link>
          <Link href="/academies/financial-literacy"><span aria-hidden="true">▤</span><small>Learn</small></Link>
          <Link href="/academies/financial-literacy/investment-lab"><span aria-hidden="true">◇</span><small>Practise</small></Link>
          <Link href="/academies/biography"><span aria-hidden="true">✦</span><small>Explore</small></Link>
        </div>
      </nav>
      <style jsx global>{`

        html {
          -webkit-text-size-adjust: 100%;
          scroll-behavior: smooth;
        }

        body {
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
      

/* App-home overrides: deliberately scoped to fpAppHome so other academies are unaffected. */
.fpAppHome{background:linear-gradient(180deg,#f2eaff 0,#faf8ff 300px,#f7f5fb 100%);padding:16px 16px 110px;min-height:100dvh}
.fpAppHome .experienceShell{max-width:1060px;padding:0;background:transparent;border:0;box-shadow:none;backdrop-filter:none;gap:20px}
.fpAppHeading{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:14px 4px 4px}
.fpAppHeadingCopy{max-width:690px}.fpEyebrow,.fpOverline{font-size:10px;font-weight:900;letter-spacing:.13em;color:#7c3aed}
.fpAppHeading h1{font-size:clamp(30px,4.3vw,50px);line-height:1.09;letter-spacing:-.045em;margin:12px 0 10px;color:#261238;font-weight:850}
.fpAppHeading h1 em{font-family:Georgia,serif;color:#7836d7;font-weight:400}
.fpAppHeading p{font-size:14px;color:#6c6077;line-height:1.55;margin:0}
.fpHeroSymbol{flex:0 0 180px;height:130px;border-radius:30px;background:linear-gradient(145deg,#7735e8,#ac83f8);display:flex;align-items:center;justify-content:center;gap:3px;box-shadow:0 16px 32px #7331dd25;transform:rotate(-3deg)}
.fpHeroSymbol span{display:grid;place-items:center;width:51px;height:51px;border-radius:50%;background:#ffffff22;color:white;font-size:27px;font-weight:700}.fpHeroSymbol span:nth-child(2){transform:translateY(-18px);background:#fff;color:#7432db}
.fpFeatured{position:relative;background:linear-gradient(130deg,#fff 0%,#fbf8ff 68%,#f1e8ff 100%);border:1px solid #e8dbf8;border-radius:28px;padding:26px;box-shadow:0 15px 42px #54258112;overflow:hidden}
.fpFeatured:after{content:'';position:absolute;width:210px;height:210px;border:1px solid #d8c3ff;border-radius:50%;right:-120px;top:-125px;pointer-events:none}
.fpFeaturedTop{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:19px;position:relative;z-index:1}
.fpPill,.fpFreeTag{font-size:10px;font-weight:850;letter-spacing:.07em}.fpPill{display:inline-flex;align-items:center;gap:7px;color:#6d28d9;background:#f0e7ff;border-radius:99px;padding:8px 11px}.fpPulse{height:7px;width:7px;border-radius:50%;background:#7c3aed}.fpFreeTag{color:#6d28d9}
.fpFeaturedBody{display:flex;gap:18px;align-items:center;margin-bottom:20px;position:relative;z-index:1}.fpCourseIcon{width:74px;height:74px;flex:0 0 74px;display:grid;place-items:center;border-radius:23px;color:white;background:linear-gradient(145deg,#9853f2,#6220c4);box-shadow:0 12px 24px #742bd52c}
.fpFeaturedText h2{font-size:clamp(25px,3.3vw,35px);margin:7px 0;letter-spacing:-.035em;color:#271538;line-height:1.12}.fpFeaturedText p{font-size:13px;line-height:1.6;color:#6c6077;margin:0;max-width:660px}
.fpStartButton{position:relative;z-index:1;display:flex;justify-content:space-between;align-items:center;gap:14px;width:100%;max-width:440px;padding:15px 18px;min-height:64px;box-sizing:border-box;background:linear-gradient(135deg,#823bea,#6222c5);color:white!important;text-decoration:none!important;border-radius:17px;box-shadow:0 12px 28px #6d28d930;transition:transform .2s,box-shadow .2s}
.fpStartButton:hover{transform:translateY(-2px);box-shadow:0 16px 30px #6d28d940}.fpStartButton small{display:block;color:#e9d9ff;font-size:9px;font-weight:800;letter-spacing:.08em}.fpStartButton strong{display:block;color:white;font-size:17px;margin-top:3px}.fpStartArrow{font-size:26px;color:white}
.fpTrustLine{display:flex;flex-wrap:wrap;gap:6px 16px;margin:15px 0 0;font-size:11px;font-weight:700;color:#756681}
.fpJourney{padding:23px 25px;border-radius:25px;background:white;border:1px solid #ebe3f5;box-shadow:0 9px 26px #5425810b}.fpSectionTitle{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:15px}.fpSectionTitle h2{font-size:21px;letter-spacing:-.035em;margin:5px 0 0;color:#291738}.fpJourneyCount{font-size:11px;font-weight:800;color:#7c3aed;background:#f3ecff;border-radius:50px;padding:7px 11px;white-space:nowrap}
.fpJourneyGrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-top:13px}.fpJourneyStep{display:flex;align-items:flex-start;gap:10px;padding:12px 9px;border:1px solid #efe8f7;border-radius:15px;background:#fcfaff}.fpStepNumber{display:grid;place-items:center;flex:0 0 31px;height:31px;border-radius:11px;background:#f0e6ff;color:#7b38d9;font-weight:900;font-size:11px}.fpStepCurrent{background:#7732d8;color:white}.fpJourneyStep strong{display:block;color:#31213e;font-size:12px}.fpJourneyStep small{display:block;color:#82758d;font-size:10px;line-height:1.4;margin-top:4px}
.fpExploreGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.fpExploreCard{display:flex;align-items:center;gap:15px;padding:20px;background:white;border:1px solid #ebe3f5;border-radius:22px;color:#291738!important;text-decoration:none!important;box-shadow:0 9px 24px #5425810a;transition:transform .2s}.fpExploreCard:hover{transform:translateY(-2px)}.fpExploreIcon{display:grid;place-items:center;flex:0 0 52px;height:52px;border-radius:17px;background:#f0e7ff;color:#7c3aed;font-size:25px}.fpExploreIcon.fpAmber{background:#fff1da;color:#b86a12}.fpExploreCopy strong{display:block;font-size:14px;color:#291738}.fpExploreCopy small{display:block;font-size:11px;color:#81748c;line-height:1.5;margin-top:5px}.fpExploreAction{display:block;font-size:11px;font-weight:850;color:#7430d5;margin-top:9px}
.fpBottomNav{position:fixed;z-index:35;left:0;right:0;bottom:0;background:#fffffff0;backdrop-filter:blur(16px);border-top:1px solid #e9dff4;padding:8px 12px calc(8px + env(safe-area-inset-bottom))}.fpBottomNavInner{display:flex;align-items:center;justify-content:space-around;max-width:580px;margin:auto}.fpBottomNav a{display:flex;flex-direction:column;align-items:center;gap:3px;min-width:60px;padding:4px 8px;color:#85778f!important;text-decoration:none!important}.fpBottomNav a[aria-current="page"]{color:#7029d7!important}.fpBottomNav a>span{font-size:24px;line-height:1}.fpBottomNav a small{font-size:10px;font-weight:800}
/* Keep Ayo's existing floating trigger clear of the bottom tab bar. */
.fpAppHome ~ .fpBottomNav{z-index:35}
@media(max-width:700px){.fpAppHome{padding:11px 13px 115px}.fpAppHome .experienceShell{gap:16px}.fpAppHeading{padding:7px 3px 0}.fpAppHeading h1{font-size:clamp(28px,8.4vw,37px);margin:8px 0}.fpAppHeading p{font-size:12px}.fpHeroSymbol{display:none}.fpFeatured{padding:19px;border-radius:23px}.fpFeaturedTop{margin-bottom:15px}.fpFeaturedBody{gap:13px;align-items:flex-start;margin-bottom:17px}.fpCourseIcon{width:54px;height:54px;flex-basis:54px;border-radius:17px}.fpFeaturedText h2{font-size:25px;margin:4px 0 7px}.fpFeaturedText p{font-size:12px}.fpStartButton{max-width:none}.fpTrustLine{font-size:10px}.fpJourney{padding:17px;border-radius:22px}.fpJourneyGrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.fpJourneyStep{padding:10px 8px;gap:7px}.fpJourneyStep strong{font-size:11px}.fpJourneyStep small{font-size:9px}.fpExploreGrid{grid-template-columns:1fr;gap:10px}.fpExploreCard{padding:14px;border-radius:18px}.fpSectionTitle h2{font-size:19px}}
@media(max-width:370px){.fpAppHome{padding-left:9px;padding-right:9px}.fpFeatured{padding:15px}.fpFeaturedText h2{font-size:22px}.fpFreeTag{font-size:9px}.fpJourneyGrid{grid-template-columns:1fr 1fr}.fpStepNumber{flex-basis:27px;height:27px}}
@media(prefers-reduced-motion:reduce){.fpStartButton,.fpExploreCard{transition:none}}


/* App-home refinement: short introduction, compact roadmap, featured course as the hero. */
.fpAppHome .experienceShell{gap:14px;max-width:1000px;padding:20px 24px 26px}
.fpAppHeading{padding:2px 2px 0;gap:12px}
.fpAppHeadingCopy{max-width:850px}
.fpAppHeading h1{font-size:clamp(27px,3.5vw,43px);line-height:1.13;margin:6px 0 5px}
.fpAppHeading p{font-size:13px;line-height:1.4}
.fpHeroSymbol{transform:scale(.78);transform-origin:right center}
.fpJourney{padding:12px 15px;border-radius:18px;box-shadow:none;background:#fcfaff}
.fpJourney .fpSectionTitle{margin-bottom:9px}
.fpJourney .fpSectionTitle h2{font-size:15px;margin:2px 0 0}
.fpJourney .fpOverline{font-size:8px}
.fpJourneyCount{font-size:10px;padding:4px 8px}
.fpJourneyGrid{margin:0;gap:6px}
.fpJourneyStep{padding:7px;align-items:center;gap:7px;border-radius:12px}
.fpJourneyStep strong{font-size:10px;line-height:1.2}
.fpStepNumber{flex:0 0 25px;height:25px;border-radius:9px;font-size:10px}
.fpFeatured{padding:29px 30px;border:2px solid #ddc9fb;box-shadow:0 18px 45px #5425811a}
.fpFeaturedText h2{font-size:clamp(28px,3.8vw,40px)}
@media(max-width:700px){
 .fpAppHome{padding:9px 10px 112px}
 .fpAppHome .experienceShell{padding:13px;gap:12px;border-radius:20px}
 .fpAppHeading h1{font-size:clamp(26px,7vw,34px);margin:4px 0}
 .fpAppHeading p{font-size:11px}
 .fpJourney{padding:10px;border-radius:15px}
 .fpJourney .fpSectionTitle{margin-bottom:8px}
 .fpJourney .fpSectionTitle h2{font-size:13px}
 .fpJourneyCount{font-size:9px}
 .fpJourneyGrid{grid-template-columns:repeat(4,minmax(0,1fr));gap:4px}
 .fpJourneyStep{display:flex;flex-direction:column;justify-content:center;text-align:center;gap:4px;padding:7px 2px;min-height:57px}
 .fpJourneyStep strong{font-size:9px;overflow-wrap:anywhere}
 .fpStepNumber{flex:none;width:23px;height:23px;font-size:9px}
 .fpFeatured{padding:20px 17px;border-radius:22px}
 .fpFeaturedText h2{font-size:28px}
}

      `}</style>
    </main>
  );
}
