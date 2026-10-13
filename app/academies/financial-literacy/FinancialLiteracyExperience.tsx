"use client";

import Link from "next/link";

import FinancialEducationAyoFlow from "@/app/financial-education/FinancialEducationAyoFlow";
import FinancialEducationFlowProgress from "@/app/financial-education/FinancialEducationFlowProgress";

export default function FinancialLiteracyExperience() {
  const startHref = "/fountaintalk/classroom/wealth?guest=1";

  return (
    <main className="journeyPage">
      <div className="ambientGlow glowOne" aria-hidden="true" />
      <div className="ambientGlow glowTwo" aria-hidden="true" />
      <div className="meshGrid" aria-hidden="true" />

      <section className="journeyShell">
        <FinancialEducationFlowProgress
          steps={[
            { label: "Welcome", state: "done" },
            { label: "Free Lesson", state: "current" },
            { label: "Learn", state: "upcoming" },
            { label: "Graduate", state: "upcoming" },
          ]}
          nextLabel="Begin your free Financial Literacy lesson"
        />

        <div className="journeyBrand">
          <span>FOUNTAIN PREP</span>
          <i />
          <strong>FINANCIAL LITERACY ACADEMY</strong>
        </div>

        <header className="journeyIntro ayoLiteracyIntro">
          <span>YOUR FINANCIAL LITERACY JOURNEY</span>

          <h1>
            Your first lesson
            <em> starts here.</em>
          </h1>

          <p>
            Begin with a guided Financial Literacy lesson designed to help you
            understand how money, value and financial decisions work before
            progressing into assets, investing, business and capital.
          </p>
        </header>

        <section className="academyEntry ayoLiteracyClassroom">
          <div className="entryGlow" aria-hidden="true" />

          <div className="entryMain">
            <div className="entryTop">
              <span className="startBadge">
                <i />
                START HERE
              </span>

              <span className="lessonNumber">LESSON 01</span>
            </div>

            <div className="lessonHero">
              <div className="lessonIcon" aria-hidden="true">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M9 7h6M9 11h5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div>
                <small>FOUNDATION EXPERIENCE</small>
                <h2>Money Is a Game — Know the Rules</h2>
              </div>
            </div>

            <p className="lessonDescription">
              Your Financial Literacy journey begins with the rules behind
              money and value. Ayo will guide you step by step through the
              lesson and introduce the foundation for everything that follows.
            </p>

            <div className="lessonJourney">
              <div className="journeyStep currentStep">
                <span>01</span>
                <div>
                  <strong>Start free</strong>
                  <small>Take your first lesson at no cost.</small>
                </div>
              </div>

              <div className="journeyLine" />

              <div className="journeyStep">
                <span>02</span>
                <div>
                  <strong>Unlock academy</strong>
                  <small>Continue when you are ready.</small>
                </div>
              </div>

              <div className="journeyLine" />

              <div className="journeyStep">
                <span>03</span>
                <div>
                  <strong>Complete training</strong>
                  <small>Progress through the curriculum.</small>
                </div>
              </div>

              <div className="journeyLine" />

              <div className="journeyStep">
                <span>04</span>
                <div>
                  <strong>Graduate</strong>
                  <small>Complete the academy and earn your certificate.</small>
                </div>
              </div>
            </div>

            <div className="entryBottom">
              <div className="lessonFacts">
                <span>✓ First lesson free</span>
                <span>✓ No card required</span>
                <span>✓ Guided by Ayo</span>
                <span>✓ Progress saved</span>
              </div>

              <Link href={startHref} className="literacyStartButton">
                <span>
                  <small>BEGIN YOUR ACADEMY</small>
                  <strong>Start Free Lesson</strong>
                </span>

                <b aria-hidden="true">→</b>
              </Link>
            </div>
          </div>

          <aside className="academyAside">
            <span className="asideEyebrow">YOUR LEARNING PATH</span>

            <h3>
              Start free.
              <br />
              Build from there.
            </h3>

            <p>
              Your Financial Literacy journey starts here. Complete the free
              Foundation lesson first, then continue through the academy.
            </p>

            <div className="pathList">
              <div className="pathItem activePath">
                <span>01</span>
                <div>
                  <strong>Experience</strong>
                  <small>Complete your free Foundation lesson.</small>
                </div>
              </div>

              <div className="pathItem">
                <span>02</span>
                <div>
                  <strong>Learn</strong>
                  <small>Unlock the complete Financial Literacy Academy.</small>
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
                  <small>Complete your journey and earn your certificate.</small>
                </div>
              </div>
            </div>
          </aside>
        </section>

        <FinancialEducationAyoFlow
          title="Your Financial Literacy journey begins here."
          text="I’ll guide you through your first Foundation lesson before we move into the rest of the academy. Your first lesson is open, so you can begin without entering any payment details."
          tourSteps={[
            {
              selector: ".ayoLiteracyIntro",
              title: "Welcome to Financial Literacy.",
              text: "You’ve chosen Financial Literacy, so from here the journey is simple. We’ll begin with the foundation and build your understanding step by step.",
            },
            {
              selector: ".ayoLiteracyClassroom",
              title: "Your first lesson is ready.",
              text: "We’ll begin with Money Is a Game — Know the Rules. I’ll introduce the basic ideas behind money, value and financial decisions before we gradually move into assets, investing, business and capital.",
            },
            {
              selector: ".literacyStartButton",
              title: "Start your free lesson.",
              text: "Your first lesson is open and no payment details are required. Select Start Free Lesson and I’ll meet you inside the classroom.",
            },
          ]}
        />
      </section>

      <style jsx>{`
        :global(html, body) {
          margin: 0;
          background: #fbf9ff;
          color: #241431;
        }

        :global(body) {
          overflow-x: hidden;
        }

        .journeyPage {
          position: relative;
          min-height: calc(100vh - 78px);
          overflow: hidden;
          padding: 42px 20px 64px;
          background:
            radial-gradient(
              circle at 12% 12%,
              rgba(124, 58, 237, 0.1),
              transparent 30%
            ),
            radial-gradient(
              circle at 91% 72%,
              rgba(245, 158, 11, 0.045),
              transparent 28%
            ),
            linear-gradient(180deg, #fbf9ff 0%, #ffffff 48%, #faf7ff 100%);
          font-family:
            Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        .meshGrid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.22;
          background-image: radial-gradient(
            rgba(109, 40, 217, 0.13) 0.65px,
            transparent 0.65px
          );
          background-size: 20px 20px;
          mask-image: linear-gradient(to bottom, black, transparent 88%);
        }

        .ambientGlow {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
        }

        .glowOne {
          width: 500px;
          height: 500px;
          left: -220px;
          top: 4%;
          background: rgba(124, 58, 237, 0.09);
        }

        .glowTwo {
          width: 430px;
          height: 430px;
          right: -180px;
          bottom: 2%;
          background: rgba(196, 181, 253, 0.14);
        }

        .journeyShell {
          position: relative;
          z-index: 2;
          width: min(1180px, 100%);
          margin: 0 auto;
          display: grid;
          gap: 27px;
          padding: 36px 42px 42px;
          box-sizing: border-box;
          border: 1px solid #ebe3f5;
          border-radius: 34px;
          background: rgba(255, 255, 255, 0.94);
          box-shadow:
            0 30px 80px rgba(58, 33, 79, 0.09),
            inset 0 1px 0 #ffffff;
        }

        .journeyBrand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          color: #7c3aed;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.12em;
        }

        .journeyBrand i {
          width: 28px;
          height: 1px;
          background: #d8ccef;
        }

        .journeyBrand strong {
          color: #786a82;
        }

        .journeyIntro {
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
        }

        .journeyIntro > span {
          color: #7c3aed;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.13em;
        }

        .journeyIntro h1 {
          margin: 11px 0 14px;
          color: #241431;
          font-size: clamp(46px, 5vw, 70px);
          line-height: 0.98;
          font-weight: 900;
          letter-spacing: -0.055em;
        }

        .journeyIntro h1 em {
          display: block;
          color: #7c3aed;
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 400;
          font-style: italic;
          letter-spacing: -0.045em;
        }

        .journeyIntro p {
          max-width: 720px;
          margin: auto;
          color: #716477;
          font-size: 15px;
          line-height: 1.7;
        }

        .academyEntry {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 300px;
          overflow: hidden;
          border: 1px solid #ddd0f2;
          border-radius: 28px;
          background:
            radial-gradient(
              circle at 7% 0%,
              rgba(124, 58, 237, 0.08),
              transparent 36%
            ),
            linear-gradient(145deg, #ffffff, #fcfaff);
          box-shadow:
            0 22px 55px rgba(76, 29, 149, 0.08),
            inset 0 1px 0 #ffffff;
        }

        .entryGlow {
          position: absolute;
          width: 320px;
          height: 320px;
          top: -190px;
          right: 120px;
          border-radius: 50%;
          background: rgba(167, 139, 250, 0.12);
          filter: blur(25px);
          pointer-events: none;
        }

        .entryMain {
          position: relative;
          z-index: 1;
          padding: 32px;
        }

        .entryTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }

        .startBadge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 11px;
          border: 1px solid #d8c8f4;
          border-radius: 999px;
          color: #6d28d9;
          background: #f5efff;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 0.1em;
        }

        .startBadge i {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #7c3aed;
          box-shadow: 0 0 0 5px rgba(124, 58, 237, 0.08);
        }

        .lessonNumber {
          color: #95889e;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.13em;
        }

        .lessonHero {
          display: grid;
          grid-template-columns: 76px minmax(0, 1fr);
          align-items: center;
          gap: 20px;
          margin-top: 26px;
        }

        .lessonIcon {
          width: 76px;
          height: 76px;
          display: grid;
          place-items: center;
          border-radius: 21px;
          color: #ffffff;
          background: linear-gradient(145deg, #8b5cf6, #6d28d9);
          box-shadow: 0 15px 30px rgba(109, 40, 217, 0.22);
        }

        .lessonHero small {
          color: #7c3aed;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 0.11em;
        }

        .lessonHero h2 {
          margin: 6px 0 0;
          color: #281634;
          font-size: clamp(28px, 3vw, 40px);
          line-height: 1.03;
          letter-spacing: -0.045em;
        }

        .lessonDescription {
          max-width: 700px;
          margin: 22px 0 0;
          color: #6d6074;
          font-size: 14px;
          line-height: 1.7;
        }

        .lessonJourney {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr) 24px minmax(0, 1fr) 24px
            minmax(0, 1fr) 24px minmax(0, 1fr);
          align-items: center;
          margin-top: 26px;
          padding: 18px;
          border: 1px solid #e7ddf4;
          border-radius: 18px;
          background: rgba(248, 245, 252, 0.8);
        }

        .journeyStep {
          display: grid;
          grid-template-columns: 28px minmax(0, 1fr);
          gap: 9px;
          align-items: start;
        }

        .journeyStep > span {
          width: 28px;
          height: 28px;
          display: grid;
          place-items: center;
          border: 1px solid #e5dcf0;
          border-radius: 50%;
          color: #7c6e86;
          background: #ffffff;
          font-size: 8px;
          font-weight: 900;
        }

        .currentStep > span {
          border-color: #7c3aed;
          color: #ffffff;
          background: #7c3aed;
          box-shadow: 0 0 0 5px rgba(124, 58, 237, 0.08);
        }

        .journeyStep div {
          display: grid;
          gap: 3px;
        }

        .journeyStep strong {
          color: #34213e;
          font-size: 10px;
        }

        .journeyStep small {
          color: #84778b;
          font-size: 8px;
          line-height: 1.35;
        }

        .journeyLine {
          height: 1px;
          background: #dcd0ec;
        }

        .entryBottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          margin-top: 28px;
        }

        .lessonFacts {
          flex: 1 1 auto;
          min-width: 0;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 9px 16px;
          color: #62526c;
          font-size: 9px;
          line-height: 1.4;
          font-weight: 750;
        }

        /*
         * Deliberately uses a GLOBAL selector.
         * Next/Link renders an <a>, and this prevents the component's
         * generated scoped selector from losing to site-wide anchor styles.
         */
        :global(a.literacyStartButton) {
          flex: 0 0 270px !important;
          width: 270px !important;
          min-height: 66px !important;
          box-sizing: border-box !important;

          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 18px !important;

          padding: 11px 18px !important;
          border: 1px solid #7c3aed !important;
          border-radius: 16px !important;

          background-color: #7c3aed !important;
          background-image: linear-gradient(
            135deg,
            #8b5cf6 0%,
            #7c3aed 52%,
            #6d28d9 100%
          ) !important;

          color: #ffffff !important;
          text-decoration: none !important;
          opacity: 1 !important;
          visibility: visible !important;

          box-shadow:
            0 14px 32px rgba(109, 40, 217, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease !important;
        }

        :global(a.literacyStartButton > span) {
          display: flex !important;
          flex-direction: column !important;
          align-items: flex-start !important;
          gap: 3px !important;
          min-width: 0;
        }

        :global(a.literacyStartButton small) {
          display: block !important;
          margin: 0 !important;
          color: rgba(255, 255, 255, 0.8) !important;
          font-size: 7px !important;
          line-height: 1.2 !important;
          font-weight: 850 !important;
          letter-spacing: 0.1em !important;
        }

        :global(a.literacyStartButton strong) {
          display: block !important;
          margin: 0 !important;
          color: #ffffff !important;
          font-size: 15px !important;
          line-height: 1.25 !important;
          font-weight: 850 !important;
          white-space: nowrap;
        }

        :global(a.literacyStartButton b) {
          flex: 0 0 auto;
          display: grid !important;
          place-items: center !important;
          width: 30px;
          height: 30px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.14);
          color: #ffffff !important;
          font-size: 21px;
          line-height: 1;
          font-weight: 500;
        }

        @media (hover: hover) and (pointer: fine) {
          :global(a.literacyStartButton:hover) {
            background-color: #6d28d9 !important;
            background-image: linear-gradient(
              135deg,
              #7c3aed,
              #6d28d9
            ) !important;
            color: #ffffff !important;
            text-decoration: none !important;
            transform: translateY(-2px);
            box-shadow:
              0 18px 38px rgba(109, 40, 217, 0.32),
              inset 0 1px 0 rgba(255, 255, 255, 0.22) !important;
          }
        }

        .academyAside {
          position: relative;
          z-index: 1;
          padding: 32px 27px;
          border-left: 1px solid #e7ddf1;
          background: linear-gradient(
            180deg,
            rgba(248, 244, 255, 0.86),
            rgba(252, 250, 255, 0.92)
          );
        }

        .asideEyebrow {
          color: #7c3aed;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 0.12em;
        }

        .academyAside h3 {
          margin: 15px 0 11px;
          color: #2d1938;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 27px;
          line-height: 1.05;
          font-weight: 400;
          letter-spacing: -0.035em;
        }

        .academyAside > p {
          margin: 0;
          color: #76697d;
          font-size: 11px;
          line-height: 1.65;
        }

        .pathList {
          display: grid;
          gap: 18px;
          margin-top: 28px;
        }

        .pathItem {
          display: grid;
          grid-template-columns: 28px minmax(0, 1fr);
          gap: 10px;
        }

        .pathItem > span {
          color: #7c3aed;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 0.08em;
        }

        .pathItem div {
          display: grid;
          gap: 3px;
        }

        .pathItem strong {
          color: #4a3a52;
          font-size: 10px;
        }

        .pathItem small {
          color: #8a7e90;
          font-size: 8px;
          line-height: 1.4;
        }

        .activePath strong {
          color: #5b21b6;
        }

        .activePath small {
          color: #6e6076;
        }

        @media (max-width: 900px) {
          .journeyPage {
            padding: 22px 12px 48px;
          }

          .journeyShell {
            padding: 22px;
            gap: 23px;
            border-radius: 26px;
          }

          .academyEntry {
            grid-template-columns: 1fr;
          }

          .academyAside {
            border-left: 0;
            border-top: 1px solid #e7ddf1;
          }

          .entryBottom {
            align-items: stretch;
            flex-direction: column;
          }

          :global(a.literacyStartButton) {
            flex-basis: auto !important;
            width: 100% !important;
          }
        }

        @media (max-width: 620px) {
          .journeyPage {
            padding: 10px 8px 34px;
          }

          .journeyShell {
            padding: 14px;
            gap: 19px;
            border-radius: 21px;
          }

          .journeyBrand {
            font-size: 7px;
          }

          .journeyBrand i {
            width: 17px;
          }

          .journeyIntro h1 {
            margin-top: 9px;
            font-size: 39px;
          }

          .journeyIntro p {
            font-size: 12px;
            line-height: 1.6;
          }

          .academyEntry {
            border-radius: 22px;
          }

          .entryMain {
            padding: 20px 17px;
          }

          .lessonHero {
            grid-template-columns: 58px minmax(0, 1fr);
            gap: 14px;
            margin-top: 21px;
          }

          .lessonIcon {
            width: 58px;
            height: 58px;
            border-radius: 16px;
          }

          .lessonIcon :global(svg) {
            width: 25px;
            height: 25px;
          }

          .lessonHero h2 {
            font-size: 24px;
          }

          .lessonDescription {
            margin-top: 17px;
            font-size: 12px;
          }

          .lessonJourney {
            grid-template-columns: 1fr;
            gap: 12px;
            margin-top: 20px;
            padding: 15px;
          }

          .journeyLine {
            width: 1px;
            height: 13px;
            margin-left: 13px;
          }

          .journeyStep {
            grid-template-columns: 28px minmax(0, 1fr);
          }

          .journeyStep strong {
            font-size: 11px;
          }

          .journeyStep small {
            font-size: 9px;
          }

          .entryBottom {
            margin-top: 21px;
          }

          .lessonFacts {
            display: grid;
            grid-template-columns: 1fr 1fr;
            font-size: 8px;
          }

          :global(a.literacyStartButton) {
            min-height: 64px !important;
            border-radius: 15px !important;
          }

          .academyAside {
            padding: 22px 19px;
          }

          .academyAside h3 {
            font-size: 24px;
          }

          .pathList {
            margin-top: 22px;
          }
        }

        @media (max-width: 390px) {
          .journeyIntro h1 {
            font-size: 34px;
          }

          .entryMain {
            padding: 17px 14px;
          }

          .lessonFacts {
            grid-template-columns: 1fr;
          }

          .lessonHero h2 {
            font-size: 21px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .journeyShell,
          :global(a.literacyStartButton) {
            animation: none;
            transition: none;
          }
        }
      `}</style>
    </main>
  );
}