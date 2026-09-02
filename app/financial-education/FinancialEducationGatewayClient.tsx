"use client";

import Link from "next/link";
import FinancialEducationAyoFlow from "./FinancialEducationAyoFlow";
import FinancialEducationFlowProgress from "./FinancialEducationFlowProgress";

export default function FinancialEducationGatewayClient() {
  return (
    <main className="flowPage">
      {/* Background Decorative Ambient Flares */}
      <div className="ambientGlow glowPrimary" aria-hidden="true" />
      <div className="ambientGlow glowSecondary" aria-hidden="true" />
      <div className="meshGrid" aria-hidden="true" />

      <section className="experienceShell">
        <FinancialEducationFlowProgress
          steps={[
            { label: "Welcome", state: "current" },
            { label: "Experience", state: "upcoming" },
            { label: "Learn", state: "upcoming" },
            { label: "Graduate", state: "upcoming" },
          ]}
          nextLabel="Choose how you want to begin"
        />

        <div className="brandLine">
          <span className="brandTag">FOUNTAIN PREP</span>
          <span className="brandDot" />
          <span className="brandSub">FINANCIAL EDUCATION</span>
        </div>

        <header className="intro">
          <span className="eyebrow">WELCOME TO FOUNTAIN PREP ACADEMY</span>
          <h1>
            The financial literacy partner <br className="heroBreak" />
            <em className="serifAccent">for families around the world.</em>
          </h1>
        </header>

        <div className="choiceGrid">
          {/* Card 01: Structured Learning */}
          <Link
            href="/academies/financial-literacy"
            className="choiceCard learnCard"
          >
            <div className="cardHighlight" />
            <div className="choiceTop">
              <span className="choiceBadge badgePurple">
                <span className="badgePulse" />
                RECOMMENDED
              </span>
              <b className="stepNumber">01</b>
            </div>

            <div className="choiceVisual">
              <div className="choiceIcon iconPurple">
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
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  <circle cx="12" cy="10" r="2" />
                </svg>
              </div>
              <div className="visualText">
                <small>STRUCTURED LEARNING</small>
                <h2>Start Financial Literacy</h2>
              </div>
            </div>

            <p className="cardDesc">
              Learn how asset classes, enterprise, investment options, risk, and
            capital allocation work.
            </p>

            <div className="choiceFacts">
              <span className="factPill">Guided journey</span>
              <span className="factPill">First lesson free</span>
              <span className="factPill">No card required</span>
            </div>

            <div className="choiceAction actionPurple">
              <strong>CONTINUE TO LEARNING</strong>
              <svg
                className="arrowIcon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </Link>

          {/* Card 02: Simulations */}
          <Link
            href="/academies/financial-literacy/investment-lab"
            className="choiceCard gameCard"
          >
            <div className="cardHighlight" />
            <div className="choiceTop">
              <span className="choiceBadge badgeGold">
                <span className="badgePulse goldPulse" />
                LEARN BY DOING
              </span>
              <b className="stepNumber">02</b>
            </div>

            <div className="choiceVisual">
              <div className="choiceIcon iconGold">
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
              <div className="visualText">
                <small>FINANCIAL SIMULATIONS</small>
                <h2>Try the Simulation Games</h2>
              </div>
            </div>

            <p className="cardDesc">
              Begin with the Investment Simulator. Fountain Prep will seamlessly
              transition you to the Personal Finance Simulator next.
            </p>

            <div className="choiceFacts">
              <span className="factPill">Fictional money</span>
              <span className="factPill">Guided decisions</span>
              <span className="factPill">2 connected games</span>
            </div>

            <div className="choiceAction actionGold">
              <strong>START FIRST GAME</strong>
              <svg
                className="arrowIcon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Biography Link Banner */}
        <Link href="/academies/biography" className="biographyLink">
          <div className="bioBadgeContainer">
            <span className="bioTag">OPTIONAL</span>
          </div>
          <div className="bioContent">
            <strong>Explore Biography of Greatness</strong>
            <small>
              Study the decisions, ownership, and capital allocation behind
              extraordinary wealth creation.
            </small>
          </div>
          <div className="bioArrow">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
        </Link>

        <FinancialEducationAyoFlow
          title="I’ll guide you from here."
          text="Choose Financial Literacy if you want structured learning now. Choose the simulation games if you want to learn by making decisions first. Whichever route you choose, I’ll show you exactly what comes next."
        />
      </section>

      <style jsx>{`
        /* Global & Reset Safeguards */
        :global(html) {
          -webkit-text-size-adjust: 100%;
          scroll-behavior: smooth;
        }
        :global(body) {
          margin: 0;
          background: #0d0814;
          color: #f3effa;
          overflow-x: hidden;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display",
            "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Container & Ambient Backgrounds */
        .flowPage {
          position: relative;
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: max(env(safe-area-inset-top), 28px)
            max(env(safe-area-inset-right), 16px)
            max(env(safe-area-inset-bottom), 40px)
            max(env(safe-area-inset-left), 16px);
          background: radial-gradient(
              circle at 50% 0%,
              #1e1035 0%,
              #0d0814 70%,
              #050308 100%
            );
          box-sizing: border-box;
          overflow: hidden;
        }

        .ambientGlow {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
          z-index: 0;
          opacity: 0.6;
          will-change: transform;
        }
        .glowPrimary {
          width: 500px;
          height: 500px;
          top: -100px;
          left: 50%;
          transform: translateX(-50%);
          background: radial-gradient(
            circle,
            rgba(139, 92, 246, 0.25) 0%,
            transparent 70%
          );
        }
        .glowSecondary {
          width: 400px;
          height: 400px;
          bottom: -100px;
          right: -50px;
          background: radial-gradient(
            circle,
            rgba(217, 119, 6, 0.15) 0%,
            transparent 70%
          );
        }
        .meshGrid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(
            rgba(255, 255, 255, 0.05) 1px,
            transparent 1px
          );
          background-size: 32px 32px;
          pointer-events: none;
          z-index: 0;
          mask-image: radial-gradient(
            circle at 50% 30%,
            black 30%,
            transparent 80%
          );
        }

        /* Glass Shell Layout */
        .experienceShell {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1220px;
          display: flex;
          flex-direction: column;
          gap: 22px;
          padding: 32px 44px 36px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 32px;
          background: rgba(22, 15, 36, 0.65);
          box-shadow: 0 30px 80px -15px rgba(0, 0, 0, 0.6),
            inset 0 1px 0 rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          animation: shellEntrance 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes shellEntrance {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Brand Identification Bar */
        .brandLine {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          align-self: center;
          padding: 6px 14px;
          border-radius: 100px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }
        .brandTag {
          color: #a78bfa;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.14em;
        }
        .brandDot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
        }
        .brandSub {
          color: #a195b0;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
        }

        /* Header / Typography */
        .intro {
          max-width: 960px;
          margin: 2px auto 0;
          text-align: center;
        }
        .eyebrow {
          display: block;
          color: #c4b5fd;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.16em;
          margin-bottom: 12px;
          text-transform: uppercase;
        }
        .intro h1 {
          margin: 0;
          font-size: clamp(46px, 5.2vw, 74px);
          line-height: 0.98;
          font-weight: 800;
          letter-spacing: -0.055em;
          color: #ffffff;
        }
        .serifAccent {
          font-family: Georgia, "Times New Roman", serif;
          font-style: italic;
          font-weight: 400;
          background: linear-gradient(135deg, #e9d5ff 0%, #a78bfa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Responsive Choice Grid */
        .choiceGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 24px;
        }

        /* Modernized Dynamic Cards */
        .choiceCard {
          position: relative;
          display: flex;
          flex-direction: column;
          min-height: 390px;
          padding: 30px;
          border-radius: 26px;
          text-decoration: none;
          color: #ffffff;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(255, 255, 255, 0.12);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
            border-color 0.35s ease, box-shadow 0.35s ease,
            background-color 0.35s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .cardHighlight {
          position: absolute;
          inset: 0;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.35s ease;
        }

        .learnCard {
          background:
            radial-gradient(circle at 8% 4%, rgba(139,92,246,.18), transparent 34%),
            linear-gradient(145deg, rgba(76,29,149,.23), rgba(255,255,255,.025));
          border-color: rgba(167,139,250,.28);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 18px 42px rgba(76,29,149,.13);
        }
        .gameCard {
          background:
            radial-gradient(circle at 8% 4%, rgba(245,158,11,.17), transparent 34%),
            linear-gradient(145deg, rgba(120,53,15,.22), rgba(255,255,255,.025));
          border-color: rgba(245,190,90,.28);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 18px 42px rgba(120,53,15,.13);
        }
        .learnCard .cardHighlight {
          background: radial-gradient(
            800px circle at top left,
            rgba(167, 139, 250, 0.12),
            transparent 40%
          );
        }
        .gameCard .cardHighlight {
          background: radial-gradient(
            800px circle at top left,
            rgba(245, 158, 11, 0.12),
            transparent 40%
          );
        }

        @media (hover: hover) and (pointer: fine) {
          .choiceCard:hover {
            transform: translateY(-4px) scale(1.005);
          }
          .choiceCard:hover .cardHighlight {
            opacity: 1;
          }
          .learnCard:hover {
            border-color: rgba(167, 139, 250, 0.4);
            box-shadow: 0 20px 40px -15px rgba(124, 58, 237, 0.25);
          }
          .gameCard:hover {
            border-color: rgba(245, 158, 11, 0.4);
            box-shadow: 0 20px 40px -15px rgba(217, 119, 6, 0.25);
          }
          .choiceCard:hover .arrowIcon {
            transform: translateX(4px);
          }
        }

        .choiceCard:active {
          transform: translateY(-1px) scale(0.99);
        }

        /* Top Badges & Step Counter */
        .choiceTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .choiceBadge {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 10px;
          border-radius: 100px;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.08em;
        }
        .badgePulse {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: currentColor;
          box-shadow: 0 0 8px currentColor;
        }

        .badgePurple {
          color: #c4b5fd;
          background: rgba(139, 92, 246, 0.15);
          border: 1px solid rgba(139, 92, 246, 0.3);
        }
        .badgeGold {
          color: #fde68a;
          background: rgba(217, 119, 6, 0.15);
          border: 1px solid rgba(217, 119, 6, 0.3);
        }

        .stepNumber {
          color: rgba(255, 255, 255, 0.25);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.1em;
        }

        /* Card Visual & Icon Headers */
        .choiceVisual {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }
        .choiceIcon {
          width: 64px;
          height: 64px;
          min-width: 64px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .iconPurple {
          background: linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%);
          color: #ffffff;
          box-shadow: 0 8px 20px rgba(124, 58, 237, 0.3);
        }
        .iconGold {
          background: linear-gradient(135deg, #d97706 0%, #78350f 100%);
          color: #ffffff;
          box-shadow: 0 8px 20px rgba(217, 119, 6, 0.3);
        }

        .visualText small {
          display: block;
          color: #a195b0;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.12em;
          margin-bottom: 2px;
        }
        .choiceCard h2 {
          margin: 0;
          font-size: 25px;
          font-weight: 750;
          letter-spacing: -0.02em;
          line-height: 1.2;
          color: #ffffff;
        }

        /* Description & Pills */
        .cardDesc {
          margin: 0 0 20px;
          color: #9ca3af;
          font-size: 14px;
          line-height: 1.62;
          flex-grow: 1;
        }

        .choiceFacts {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 24px;
        }
        .factPill {
          padding: 5px 10px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          color: #d1d5db;
          font-size: 10px;
          font-weight: 600;
        }

        /* Action Buttons */
        .choiceAction {
          height: 58px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 18px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.06em;
          transition: background-color 0.2s ease;
        }
        .actionPurple {
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
          color: #ffffff;
          box-shadow: 0 4px 15px rgba(109, 40, 217, 0.3);
        }
        .actionGold {
          background: linear-gradient(135deg, #b45309 0%, #92400e 100%);
          color: #ffffff;
          box-shadow: 0 4px 15px rgba(180, 83, 9, 0.3);
        }

        .arrowIcon {
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Banner Link Component */
        .biographyLink {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 13px 18px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.015);
          border: 1px solid rgba(255, 255, 255, 0.06);
          text-decoration: none;
          color: #ffffff;
          transition: all 0.25s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .biographyLink:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.15);
        }
        .bioBadgeContainer {
          flex-shrink: 0;
        }
        .bioTag {
          padding: 4px 8px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.08);
          color: #9ca3af;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.1em;
        }
        .bioContent {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex-grow: 1;
        }
        .bioContent strong {
          font-size: 13px;
          font-weight: 600;
          color: #f3effa;
        }
        .bioContent small {
          color: #8b8398;
          font-size: 11px;
          line-height: 1.4;
        }
        .bioArrow {
          color: #a78bfa;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
        }
        .biographyLink:hover .bioArrow {
          transform: translateX(3px);
        }

        /* Adaptive Mobile and Tablet Breakpoints */
        @media (min-width: 1080px) {
          .choiceVisual { gap: 18px; }
          .cardDesc { min-height: 68px; }
        }

        @media (max-width: 840px) {
          .experienceShell {
            padding: 24px;
            gap: 18px;
            border-radius: 24px;
          }
          .choiceGrid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .choiceCard {
            padding: 22px;
          }
          .heroBreak {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .flowPage {
            padding: max(env(safe-area-inset-top), 12px) 10px
              max(env(safe-area-inset-bottom), 24px) 10px;
          }
          .experienceShell {
            padding: 16px;
            gap: 15px;
            border-radius: 20px;
          }
          .intro h1 {
            font-size: 36px;
            line-height: .98;
          }
          .choiceIcon {
            width: 54px;
            height: 54px;
            min-width: 54px;
            border-radius: 15px;
          }
          .choiceCard h2 {
            font-size: 22px;
          }
          .biographyLink {
            padding: 14px;
            gap: 12px;
          }
          .bioContent small {
            display: none; /* Auto-truncate secondary text on small mobile screens */
          }
        }

        /* Accessibility: Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .experienceShell,
          .choiceCard,
          .arrowIcon,
          .biographyLink {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </main>
  );
}