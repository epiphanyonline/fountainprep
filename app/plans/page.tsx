import Link from "next/link";

export const metadata = {
  title: "Plans | FountainPrep",
  description:
    "Choose between private live tutoring and self-paced academy learning with FountainPrep.",
};

export default function PlansPage() {
  return (
    <main className="plansPage">
      <section className="plansHero">
        <div className="eyebrowRow">
          <span>FOUNTAINPREP PLANS</span>
        </div>

        <h1>
          Choose how your child
          <span> learns best.</span>
        </h1>

        <p>
          Two premium learning experiences. Choose personal one-to-one support
          with an expert tutor, or flexible self-paced learning powered by
          Fountain AI.
        </p>
      </section>

      <section className="planChoiceGrid">
        <article className="planChoice livePlan">
          <div>
            <div className="planTopline">
              <span className="typeBadge">PRIVATE LIVE TUTORING</span>
              <small>Human-led · scheduled</small>
            </div>

            <h2>Learn with an expert tutor every week.</h2>

            <p className="planSummary">
              For learners who benefit from personal guidance, real-time
              interaction, homework support and individual feedback.
            </p>

            <div className="featureList">
              <span>✓ Private 1-to-1 live lessons</span>
              <span>✓ Expert tutors</span>
              <span>✓ Flexible weekly scheduling</span>
              <span>✓ Personal feedback</span>
              <span>✓ Parent progress visibility</span>
            </div>

            <div className="priceHint">
              <small>Plans from</small>
              <strong>£9 per class</strong>
            </div>
          </div>

          <Link
            href="/pricing?product=live"
            className="primaryButton"
          >
            View Live Tutor Plans →
          </Link>
        </article>

        <article className="planChoice academyPlan">
          <div>
            <div className="planTopline">
              <span className="typeBadge">SELF-PACED ACADEMY</span>
              <small className="aiBadge">Powered by Fountain AI</small>
            </div>

            <h2>Learn anytime with structured self-paced lessons.</h2>

            <p className="planSummary">
              For independent learners who want interactive lessons, guided
              practice and AI-assisted support whenever they are ready to learn.
            </p>

            <div className="featureList">
              <span>✓ Learn anytime</span>
              <span>✓ Interactive academy lessons</span>
              <span>✓ AI-assisted guidance</span>
              <span>✓ Progress tracking</span>
              <span>✓ Certificates on eligible plans</span>
            </div>

            <div className="priceHint">
              <small>Start with</small>
              <strong>Free introductory learning</strong>
            </div>
          </div>

          <Link
            href="/pricing?product=academies"
            className="academyButton"
          >
            View Academy Plans →
          </Link>
        </article>
      </section>

      <section className="comparisonSection">
        <div className="comparisonIntro">
          <p>NOT SURE WHICH ONE?</p>
          <h2>Both paths are designed to work together.</h2>
          <span>
            A learner can use a live tutor for personal teaching and still use
            Self-Paced Academies for independent practice and wider skill
            development.
          </span>
        </div>

        <div className="comparisonGrid">
          <div>
            <small>BEST FOR</small>
            <strong>Personal support</strong>
            <span>Private Live Tutoring</span>
          </div>

          <div>
            <small>BEST FOR</small>
            <strong>Flexible independent learning</strong>
            <span>Self-Paced Academy</span>
          </div>

          <div>
            <small>NEED BOTH?</small>
            <strong>Use both learning experiences</strong>
            <span>One FountainPrep account</span>
          </div>
        </div>
      </section>

      <section className="finalSwitch">
        <div>
          <p>START WITH THE RIGHT PATH</p>
          <h2>Choose the experience your child needs today.</h2>
        </div>

        <div className="finalActions">
          <Link href="/pricing?product=live">
            Live Tutor Plans
          </Link>

          <Link href="/pricing?product=academies">
            Self-Paced Academy Plans
          </Link>
        </div>
      </section>

      <style>{`
        .plansPage {
          min-height:100vh;
          padding:64px 20px 90px;
          color:#21142f;
          background:
            radial-gradient(circle at 8% 0%,rgba(124,58,237,.12),transparent 28%),
            radial-gradient(circle at 92% 4%,rgba(196,181,253,.17),transparent 25%),
            linear-gradient(180deg,#fff,#faf7ff);
        }

        .plansHero,
        .planChoiceGrid,
        .comparisonSection,
        .finalSwitch {
          width:min(1180px,100%);
          margin-left:auto;
          margin-right:auto;
        }

        .plansHero {
          max-width:900px;
          text-align:center;
          margin-bottom:44px;
        }

        .eyebrowRow {
          display:flex;
          justify-content:center;
        }

        .eyebrowRow span {
          display:inline-flex;
          padding:8px 12px;
          border-radius:999px;
          background:#f1e9ff;
          color:#6d28d9;
          font-size:10px;
          font-weight:950;
          letter-spacing:.11em;
        }

        .plansHero h1 {
          margin:18px 0;
          font-size:clamp(48px,7vw,78px);
          line-height:.98;
          letter-spacing:-.06em;
        }

        .plansHero h1 span {
          color:#7c3aed;
        }

        .plansHero > p {
          max-width:760px;
          margin:auto;
          color:#716679;
          font-size:18px;
          line-height:1.7;
        }

        .planChoiceGrid {
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:20px;
        }

        .planChoice {
          min-height:620px;
          display:flex;
          flex-direction:column;
          justify-content:space-between;
          padding:36px;
          border-radius:34px;
          border:1px solid rgba(124,58,237,.10);
          box-shadow:0 24px 70px rgba(49,29,72,.08);
        }

        .livePlan {
          background:#fff;
        }

        .academyPlan {
          color:#fff;
          background:
            radial-gradient(circle at 90% 8%,rgba(196,181,253,.28),transparent 26%),
            linear-gradient(145deg,#21142f,#3a2055);
          border-color:transparent;
        }

        .planTopline {
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          flex-wrap:wrap;
        }

        .typeBadge {
          display:inline-flex;
          padding:7px 10px;
          border-radius:999px;
          background:#f1e9ff;
          color:#6d28d9;
          font-size:9px;
          font-weight:950;
          letter-spacing:.1em;
        }

        .academyPlan .typeBadge {
          background:rgba(255,255,255,.10);
          color:#e9d5ff;
        }

        .planTopline small {
          color:#918697;
          font-size:10px;
        }

        .academyPlan .planTopline small {
          color:#dfd0f5;
        }

        .planChoice h2 {
          margin:34px 0 14px;
          font-size:clamp(34px,4vw,48px);
          line-height:1.02;
          letter-spacing:-.05em;
        }

        .planSummary {
          margin:0;
          color:#716679;
          font-size:15px;
          line-height:1.7;
        }

        .academyPlan .planSummary {
          color:rgba(255,255,255,.72);
        }

        .featureList {
          display:grid;
          gap:12px;
          margin-top:30px;
        }

        .featureList span {
          padding-bottom:12px;
          border-bottom:1px solid rgba(124,58,237,.08);
          color:#4f4356;
          font-size:13px;
          font-weight:700;
        }

        .academyPlan .featureList span {
          color:rgba(255,255,255,.84);
          border-color:rgba(255,255,255,.09);
        }

        .priceHint {
          margin-top:34px;
          padding:18px 20px;
          border-radius:20px;
          background:#f8f4ff;
        }

        .academyPlan .priceHint {
          background:rgba(255,255,255,.08);
        }

        .priceHint small,
        .priceHint strong {
          display:block;
        }

        .priceHint small {
          color:#887d8f;
          font-size:10px;
        }

        .academyPlan .priceHint small {
          color:rgba(255,255,255,.56);
        }

        .priceHint strong {
          margin-top:4px;
          font-size:21px;
        }

        .primaryButton,
        .academyButton {
          min-height:56px;
          display:flex;
          align-items:center;
          justify-content:center;
          margin-top:30px;
          padding:0 24px;
          border-radius:17px;
          font-weight:950;
          text-decoration:none;
        }

        .primaryButton {
          color:#fff;
          background:linear-gradient(135deg,#7c3aed,#6d28d9);
          box-shadow:0 14px 32px rgba(124,58,237,.20);
        }

        .academyButton {
          color:#4c1d95;
          background:#fff;
        }

        .comparisonSection {
          margin-top:72px;
          padding:46px;
          border-radius:30px;
          background:#fff;
          border:1px solid rgba(124,58,237,.08);
        }

        .comparisonIntro {
          max-width:760px;
        }

        .comparisonIntro p,
        .finalSwitch p {
          margin:0;
          color:#7c3aed;
          font-size:10px;
          font-weight:950;
          letter-spacing:.11em;
        }

        .comparisonIntro h2,
        .finalSwitch h2 {
          margin:10px 0;
          font-size:clamp(32px,4vw,46px);
          line-height:1.05;
          letter-spacing:-.045em;
        }

        .comparisonIntro > span {
          color:#746979;
          line-height:1.65;
        }

        .comparisonGrid {
          display:grid;
          grid-template-columns:repeat(3,minmax(0,1fr));
          gap:12px;
          margin-top:30px;
        }

        .comparisonGrid div {
          padding:20px;
          border-radius:18px;
          background:#faf8ff;
        }

        .comparisonGrid small,
        .comparisonGrid strong,
        .comparisonGrid span {
          display:block;
        }

        .comparisonGrid small {
          color:#7c3aed;
          font-size:9px;
          font-weight:950;
          letter-spacing:.1em;
        }

        .comparisonGrid strong {
          margin-top:20px;
          font-size:15px;
        }

        .comparisonGrid span {
          margin-top:5px;
          color:#817687;
          font-size:11px;
        }

        .finalSwitch {
          margin-top:32px;
          padding:42px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:30px;
          border-radius:30px;
          background:#f3ecff;
        }

        .finalActions {
          display:flex;
          flex-wrap:wrap;
          gap:10px;
        }

        .finalActions a {
          display:inline-flex;
          min-height:48px;
          align-items:center;
          padding:0 17px;
          border-radius:14px;
          color:#fff;
          background:#6d28d9;
          font-size:12px;
          font-weight:900;
          text-decoration:none;
        }

        .finalActions a:last-child {
          color:#5b21b6;
          background:#fff;
          border:1px solid rgba(124,58,237,.12);
        }

        @media(max-width:850px) {
          .planChoiceGrid {
            grid-template-columns:1fr;
          }

          .comparisonGrid {
            grid-template-columns:1fr;
          }

          .finalSwitch {
            align-items:flex-start;
            flex-direction:column;
          }
        }

        @media(max-width:620px) {
          .plansPage {
            padding:42px 12px 70px;
          }

          .plansHero h1 {
            font-size:48px;
          }

          .plansHero > p {
            font-size:16px;
          }

          .planChoice {
            min-height:560px;
            padding:26px 22px;
            border-radius:26px;
          }

          .comparisonSection,
          .finalSwitch {
            padding:28px 22px;
          }

          .finalActions {
            display:grid;
            width:100%;
          }

          .finalActions a {
            justify-content:center;
          }
        }
      `}</style>
    </main>
  );
}
