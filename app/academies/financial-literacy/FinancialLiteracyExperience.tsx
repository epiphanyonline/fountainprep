"use client";

import Link from "next/link";
import FinancialEducationAyoFlow from "@/app/financial-education/FinancialEducationAyoFlow";

/** Focused lesson entry. The classroom route and access checks remain unchanged. */
export default function FinancialLiteracyExperience() {
  const startHref = "/fountaintalk/classroom/wealth?guest=1";

  return (
    <main className="lessonPage">
      <section className="lessonShell">
        <div className="pageTop ayoLiteracyIntro">
          <Link href="/financial-education" className="backLink" aria-label="Back to Financial Literacy home">
            <span aria-hidden="true">←</span> Academy home
          </Link>
          <span className="academyName">FOUNTAINPREP <span aria-hidden="true">/</span> FINANCIAL LITERACY</span>
        </div>

        <section className="lessonCard ayoLiteracyClassroom" aria-labelledby="lessonTitle">
          <div className="lessonAccent" aria-hidden="true" />
          <div className="lessonBody">
            <div className="lessonMeta">
              <span className="lessonLabel"><span className="statusDot" /> LESSON 01 · FOUNDATION</span>
              <span className="freeBadge">FREE LESSON</span>
            </div>

            <div className="lessonHeading">
              <div className="lessonIcon" aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
                  <path d="M9 7h6M9 11h5" />
                </svg>
              </div>
              <div className="headingText">
                <span className="headingEyebrow">YOUR FIRST LESSON</span>
                <h1 id="lessonTitle">Money Is a Game <span>— Know the Rules</span></h1>
              </div>
            </div>

            <p className="lessonDescription">
              Discover how money, value and financial decisions work. Learn the rules that shape everyday financial choices.
            </p>

            <Link href={startHref} className="startButton literacyStartButton">
              <span>Start Free Lesson</span>
              <span className="arrowCircle" aria-hidden="true">→</span>
            </Link>

            <div className="lessonFacts" aria-label="Lesson details">
              <span><span className="tick" aria-hidden="true">✓</span> No card required</span>
              <span><span className="tick" aria-hidden="true">✓</span> Guided by Ayo</span>
              <span><span className="tick" aria-hidden="true">✓</span> Learn at your pace</span>
            </div>
          </div>
        </section>

        <FinancialEducationAyoFlow
          title="Your lesson is ready."
          text="Select Start Free Lesson to enter the classroom. I'll meet you there."
          tourSteps={[
            {
              selector: ".ayoLiteracyClassroom",
              title: "Money Is a Game — Know the Rules",
              text: "This is your complimentary foundation lesson. You can begin without payment details.",
            },
            {
              selector: ".literacyStartButton",
              title: "Enter the classroom",
              text: "Select Start Free Lesson to begin. I'll guide you inside the classroom.",
            },
          ]}
        />
      </section>

      <style jsx>{`
        :global(body) { margin: 0; background: #faf8ff; }
        .lessonPage { min-height: calc(100dvh - 90px); box-sizing: border-box; padding: 24px 20px 64px; background: radial-gradient(circle at 10% 8%, #efe6ff 0, transparent 34%), linear-gradient(180deg, #fbfaff, #f8f5ff); color: #251335; font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .lessonShell { max-width: 1050px; margin: 0 auto; }
        .pageTop { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 20px; }
        .backLink { display: inline-flex; align-items: center; gap: 9px; padding: 10px 14px; background: #fff; border: 1px solid #e9dff6; border-radius: 13px; color: #5f29b9; font-size: 12px; font-weight: 750; text-decoration: none; }
        .backLink:hover { background: #f4edff; }
        .backLink span { font-size: 19px; line-height: 1; }
        .academyName { font-size: 10px; letter-spacing: .12em; font-weight: 850; color: #7a6590; text-align: right; }
        .academyName span { color: #b9a7d2; margin: 0 7px; }
        .lessonCard { position: relative; overflow: hidden; border-radius: 28px; background: #fff; border: 1px solid #e6d8f8; box-shadow: 0 22px 60px rgba(68, 29, 111, .09); }
        .lessonAccent { height: 7px; background: linear-gradient(90deg, #6023cc, #9b6bf6 65%, #dfccff); }
        .lessonBody { padding: clamp(24px, 4.8vw, 56px); }
        .lessonMeta { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 34px; }
        .lessonLabel { display: inline-flex; align-items: center; gap: 9px; font-size: 11px; font-weight: 850; letter-spacing: .09em; color: #7140c5; }
        .statusDot { width: 8px; height: 8px; background: #7c3aed; border-radius: 50%; box-shadow: 0 0 0 5px #f0e6ff; }
        .freeBadge { padding: 8px 12px; border-radius: 999px; background: #f2ebff; color: #6d28d9; font-size: 10px; letter-spacing: .08em; font-weight: 850; }
        .lessonHeading { display: flex; align-items: center; gap: 23px; }
        .lessonIcon { flex: 0 0 88px; width: 88px; height: 88px; border-radius: 25px; display: grid; place-items: center; color: white; background: linear-gradient(145deg, #9353fa, #6323d9); box-shadow: 0 15px 30px rgba(100, 40, 220, .22); }
        .headingText { min-width: 0; }
        .headingEyebrow { display: block; color: #8b55e6; font-size: 11px; letter-spacing: .12em; font-weight: 850; margin-bottom: 12px; }
        h1 { margin: 0; color: #281637; font-size: clamp(32px, 4.6vw, 54px); line-height: 1.12; letter-spacing: -.05em; font-weight: 850; }
        h1 span { color: #6d28d9; }
        .lessonDescription { margin: 24px 0 30px; max-width: 690px; color: #6f607c; font-size: 16px; line-height: 1.65; }
        .startButton { display: flex; justify-content: space-between; align-items: center; gap: 16px; max-width: 460px; min-height: 68px; padding: 12px 15px 12px 24px; box-sizing: border-box; border-radius: 18px; background: linear-gradient(110deg, #8550ee, #6622da); color: #fff !important; text-decoration: none !important; font-size: 19px; font-weight: 850; box-shadow: 0 15px 30px rgba(107, 41, 222, .23); transition: transform .2s, box-shadow .2s; }
        .startButton:hover { transform: translateY(-2px); box-shadow: 0 20px 38px rgba(107, 41, 222, .28); }
        .startButton:focus-visible, .backLink:focus-visible { outline: 3px solid #b28af7; outline-offset: 3px; }
        .arrowCircle { width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center; flex-shrink: 0; background: rgba(255, 255, 255, .16); font-size: 24px; }
        .lessonFacts { display: flex; flex-wrap: wrap; gap: 10px 22px; margin-top: 20px; color: #736581; font-size: 12px; font-weight: 650; }
        .tick { color: #7c3aed; margin-right: 4px; font-weight: 900; }
        @media (max-width: 640px) {
          .lessonPage { padding: 14px 12px 36px; }
          .pageTop { margin-bottom: 14px; }
          .academyName { font-size: 8px; letter-spacing: .06em; }
          .backLink { padding: 10px 12px; font-size: 11px; }
          .lessonCard { border-radius: 23px; }
          .lessonBody { padding: 24px 20px 26px; }
          .lessonMeta { margin-bottom: 25px; }
          .lessonHeading { align-items: flex-start; gap: 14px; }
          .lessonIcon { flex-basis: 56px; width: 56px; height: 56px; border-radius: 16px; }
          .lessonIcon svg { width: 25px; height: 25px; }
          .headingEyebrow { font-size: 9px; margin-bottom: 8px; }
          h1 { font-size: clamp(27px, 7.5vw, 38px); }
          .lessonDescription { margin: 20px 0 24px; font-size: 14px; }
          .startButton { max-width: none; width: 100%; min-height: 62px; font-size: 17px; }
          .lessonFacts { font-size: 11px; gap: 10px 14px; }
        }
        @media (max-width: 380px) {
          .academyName { display: none; }
          .lessonHeading { flex-direction: column; }
          h1 { font-size: 30px; }
        }
        @media (prefers-reduced-motion: reduce) { .startButton { transition: none; } }
      `}</style>
    </main>
  );
}
