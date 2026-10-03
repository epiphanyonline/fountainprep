import Link from "next/link";

export const metadata = {
  title: "Live Tutoring Plans | FountainPrep",
  description:
    "Choose a private 1-to-1 live tutoring plan with FountainPrep. Flexible weekly lessons with carefully selected tutors.",
};

export default function PlansPage() {
  return (
    <main className="plansPage">
      <section className="plansHero">
        <div className="eyebrowRow">
          <span>FOUNTAINPREP LIVE</span>
        </div>

        <h1>
          Personal tutoring.
          <span> Built around your child.</span>
        </h1>

        <p>
          Private 1-to-1 online lessons with carefully selected
          tutors, flexible scheduling and clear plans for families
          around the world.
        </p>

        <div className="heroActions">
          <Link
            href="/pricing?product=live"
            className="primaryButton"
          >
            View Live Tutor Plans →
          </Link>

          <Link
            href="/subjects"
            className="secondaryButton"
          >
            Explore Subjects
          </Link>
        </div>
      </section>

      <section className="planChoiceGrid">
        <article className="planChoice">
          <div>
            <div className="planTopline">
              <span className="typeBadge">
                MONTHLY
              </span>

              <small>
                Flexible · recurring
              </small>
            </div>

            <h2>
              Learn consistently, one month at a time.
            </h2>

            <p className="planSummary">
              A flexible way to give your child regular
              one-to-one support without making a longer
              commitment.
            </p>

            <div className="featureList">
              <span>
                ✓ Private 1-to-1 live lessons
              </span>
              <span>
                ✓ Carefully selected tutor
              </span>
              <span>
                ✓ 1 or 2 lessons each week
              </span>
              <span>
                ✓ Structured learning
              </span>
              <span>
                ✓ Parent progress visibility
              </span>
            </div>

            <div className="priceHint">
              <small>Monthly plan</small>
              <strong>£10 per class</strong>
            </div>
          </div>

          <Link
            href="/pricing?product=live"
            className="primaryButton"
          >
            View Monthly Plans →
          </Link>
        </article>

        <article className="planChoice featuredPlan">
          <div>
            <div className="planTopline">
              <span className="typeBadge featuredBadge">
                3 MONTHS
              </span>

              <small>
                Consistent · better value
              </small>
            </div>

            <h2>
              Give progress more time to build.
            </h2>

            <p className="planSummary">
              Keep your child learning consistently with the
              same structured 1-to-1 support over three months.
            </p>

            <div className="featureList">
              <span>
                ✓ Private 1-to-1 live lessons
              </span>
              <span>
                ✓ Carefully selected tutor
              </span>
              <span>
                ✓ 1 or 2 lessons each week
              </span>
              <span>
                ✓ Structured learning
              </span>
              <span>
                ✓ Parent progress visibility
              </span>
            </div>

            <div className="priceHint featuredPrice">
              <small>3-month plan</small>
              <strong>£9 per class</strong>
              <span>Save compared with monthly</span>
            </div>
          </div>

          <Link
            href="/pricing?product=live"
            className="featuredButton"
          >
            View 3-Month Plans →
          </Link>
        </article>
      </section>

      <section className="whySection">
        <div className="whyIntro">
          <p>WHAT YOUR FAMILY GETS</p>

          <h2>
            More than a weekly video call.
          </h2>

          <span>
            Fountain Prep is designed around consistent,
            personal learning — from choosing a subject and
            tutor to scheduling lessons and following progress.
          </span>
        </div>

        <div className="whyGrid">
          <div>
            <small>01</small>
            <strong>Personal attention</strong>
            <span>
              One learner. One tutor. A lesson focused on
              individual needs.
            </span>
          </div>

          <div>
            <small>02</small>
            <strong>Flexible scheduling</strong>
            <span>
              Choose recurring lesson times that work around
              your family.
            </span>
          </div>

          <div>
            <small>03</small>
            <strong>Consistent progress</strong>
            <span>
              Regular lessons create the structure learners
              need to keep moving forward.
            </span>
          </div>
        </div>
      </section>

      <section className="subjectsSection">
        <div>
          <p>ONE PLATFORM. MORE TO LEARN.</p>

          <h2>
            Find the right support for your child.
          </h2>

          <span>
            Choose from academic subjects, coding and
            languages including Yoruba, Igbo and Hausa.
          </span>
        </div>

        <div className="subjectPills">
          <span>Maths</span>
          <span>English</span>
          <span>Science</span>
          <span>Physics</span>
          <span>Coding</span>
          <span>Yoruba</span>
          <span>Igbo</span>
          <span>Hausa</span>
        </div>

        <Link
          href="/subjects"
          className="subjectLink"
        >
          Explore All Subjects →
        </Link>
      </section>

      <section className="finalSwitch">
        <div>
          <p>READY TO START?</p>

          <h2>
            Find the right tutor for your child.
          </h2>

          <span>
            Choose a subject, select your plan and arrange
            live 1-to-1 lessons around your family&apos;s
            timetable.
          </span>
        </div>

        <div className="finalActions">
          <Link href="/pricing?product=live">
            View Tutor Plans
          </Link>

          <Link href="/start">
            Find a Tutor
          </Link>
        </div>
      </section>

      <style>{`
        .plansPage {
          min-height: 100vh;
          padding: 64px 20px 90px;
          color: #21142f;
          background:
            radial-gradient(
              circle at 8% 0%,
              rgba(124,58,237,.12),
              transparent 28%
            ),
            radial-gradient(
              circle at 92% 4%,
              rgba(196,181,253,.17),
              transparent 25%
            ),
            linear-gradient(
              180deg,
              #fff,
              #faf7ff
            );
        }

        .plansHero,
        .planChoiceGrid,
        .whySection,
        .subjectsSection,
        .finalSwitch {
          width: min(1180px, 100%);
          margin-left: auto;
          margin-right: auto;
        }

        .plansHero {
          max-width: 900px;
          text-align: center;
          margin-bottom: 44px;
        }

        .eyebrowRow {
          display: flex;
          justify-content: center;
        }

        .eyebrowRow span {
          display: inline-flex;
          padding: 8px 12px;
          border-radius: 999px;
          background: #f1e9ff;
          color: #6d28d9;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .11em;
        }

        .plansHero h1 {
          margin: 18px 0;
          font-size: clamp(48px, 7vw, 78px);
          line-height: .98;
          letter-spacing: -.06em;
        }

        .plansHero h1 span {
          color: #7c3aed;
        }

        .plansHero > p {
          max-width: 760px;
          margin: auto;
          color: #716679;
          font-size: 18px;
          line-height: 1.7;
        }

        .heroActions {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 28px;
        }

        .primaryButton,
        .secondaryButton,
        .featuredButton {
          min-height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 24px;
          border-radius: 17px;
          font-weight: 950;
          text-decoration: none;
        }

        .primaryButton {
          color: #fff;
          background:
            linear-gradient(
              135deg,
              #7c3aed,
              #6d28d9
            );
          box-shadow:
            0 14px 32px
            rgba(124,58,237,.20);
        }

        .secondaryButton {
          color: #5b21b6;
          background: #fff;
          border:
            1px solid
            rgba(124,58,237,.14);
        }

        .planChoiceGrid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0,1fr));
          gap: 20px;
        }

        .planChoice {
          min-height: 620px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 36px;
          border-radius: 34px;
          border:
            1px solid
            rgba(124,58,237,.10);
          background: #fff;
          box-shadow:
            0 24px 70px
            rgba(49,29,72,.08);
        }

        .featuredPlan {
          position: relative;
          border:
            2px solid
            rgba(124,58,237,.55);
          background:
            radial-gradient(
              circle at 90% 8%,
              rgba(139,92,246,.12),
              transparent 28%
            ),
            linear-gradient(
              180deg,
              #fff,
              #faf7ff
            );
          box-shadow:
            0 30px 80px
            rgba(124,58,237,.15);
        }

        .planTopline {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .typeBadge {
          display: inline-flex;
          padding: 7px 10px;
          border-radius: 999px;
          background: #f1e9ff;
          color: #6d28d9;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: .1em;
        }

        .featuredBadge {
          color: #fff;
          background:
            linear-gradient(
              135deg,
              #7c3aed,
              #6d28d9
            );
        }

        .planTopline small {
          color: #918697;
          font-size: 10px;
        }

        .planChoice h2 {
          margin: 34px 0 14px;
          font-size:
            clamp(34px,4vw,48px);
          line-height: 1.02;
          letter-spacing: -.05em;
        }

        .planSummary {
          margin: 0;
          color: #716679;
          font-size: 15px;
          line-height: 1.7;
        }

        .featureList {
          display: grid;
          gap: 12px;
          margin-top: 30px;
        }

        .featureList span {
          padding-bottom: 12px;
          border-bottom:
            1px solid
            rgba(124,58,237,.08);
          color: #4f4356;
          font-size: 13px;
          font-weight: 700;
        }

        .priceHint {
          margin-top: 34px;
          padding: 18px 20px;
          border-radius: 20px;
          background: #f8f4ff;
        }

        .priceHint small,
        .priceHint strong,
        .priceHint span {
          display: block;
        }

        .priceHint small {
          color: #887d8f;
          font-size: 10px;
        }

        .priceHint strong {
          margin-top: 4px;
          font-size: 24px;
        }

        .priceHint span {
          margin-top: 5px;
          color: #7c3aed;
          font-size: 11px;
          font-weight: 800;
        }

        .featuredPrice {
          background: #f1e9ff;
        }

        .planChoice > .primaryButton,
        .planChoice > .featuredButton {
          margin-top: 30px;
        }

        .featuredButton {
          color: #fff;
          background:
            linear-gradient(
              135deg,
              #6d28d9,
              #8b5cf6
            );
          box-shadow:
            0 14px 32px
            rgba(124,58,237,.24);
        }

        .whySection {
          margin-top: 72px;
          padding: 46px;
          border-radius: 30px;
          background: #fff;
          border:
            1px solid
            rgba(124,58,237,.08);
        }

        .whyIntro {
          max-width: 760px;
        }

        .whyIntro p,
        .subjectsSection p,
        .finalSwitch p {
          margin: 0;
          color: #7c3aed;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .11em;
        }

        .whyIntro h2,
        .subjectsSection h2,
        .finalSwitch h2 {
          margin: 10px 0;
          font-size:
            clamp(32px,4vw,46px);
          line-height: 1.05;
          letter-spacing: -.045em;
        }

        .whyIntro > span,
        .subjectsSection > div > span,
        .finalSwitch > div > span {
          color: #746979;
          line-height: 1.65;
        }

        .whyGrid {
          display: grid;
          grid-template-columns:
            repeat(3,minmax(0,1fr));
          gap: 12px;
          margin-top: 30px;
        }

        .whyGrid div {
          padding: 22px;
          border-radius: 18px;
          background: #faf8ff;
        }

        .whyGrid small,
        .whyGrid strong,
        .whyGrid span {
          display: block;
        }

        .whyGrid small {
          color: #7c3aed;
          font-size: 10px;
          font-weight: 950;
        }

        .whyGrid strong {
          margin-top: 20px;
          font-size: 16px;
        }

        .whyGrid span {
          margin-top: 7px;
          color: #817687;
          font-size: 12px;
          line-height: 1.55;
        }

        .subjectsSection {
          margin-top: 32px;
          padding: 42px;
          border-radius: 30px;
          background:
            linear-gradient(
              135deg,
              #2b0d59,
              #4f1da6
            );
          color: #fff;
        }

        .subjectsSection p {
          color: #ddd6fe;
        }

        .subjectsSection > div > span {
          color: #e7ddf2;
        }

        .subjectPills {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 24px;
        }

        .subjectPills span {
          padding: 9px 13px;
          border-radius: 999px;
          background:
            rgba(255,255,255,.10);
          border:
            1px solid
            rgba(255,255,255,.10);
          font-size: 12px;
          font-weight: 800;
        }

        .subjectLink {
          width: fit-content;
          min-height: 50px;
          display: inline-flex;
          align-items: center;
          margin-top: 26px;
          padding: 0 18px;
          border-radius: 15px;
          color: #4c1d95;
          background: #fff;
          font-weight: 950;
          text-decoration: none;
        }

        .finalSwitch {
          margin-top: 32px;
          padding: 42px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          border-radius: 30px;
          background: #f3ecff;
        }

        .finalActions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .finalActions a {
          display: inline-flex;
          min-height: 48px;
          align-items: center;
          padding: 0 17px;
          border-radius: 14px;
          color: #fff;
          background: #6d28d9;
          font-size: 12px;
          font-weight: 900;
          text-decoration: none;
        }

        .finalActions a:last-child {
          color: #5b21b6;
          background: #fff;
          border:
            1px solid
            rgba(124,58,237,.12);
        }

        @media(max-width:850px) {
          .planChoiceGrid,
          .whyGrid {
            grid-template-columns: 1fr;
          }

          .finalSwitch {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media(max-width:620px) {
          .plansPage {
            padding: 42px 12px 70px;
          }

          .plansHero h1 {
            font-size: 48px;
          }

          .plansHero > p {
            font-size: 16px;
          }

          .heroActions {
            display: grid;
          }

          .heroActions a {
            width: 100%;
          }

          .planChoice {
            min-height: 0;
            padding: 26px 22px;
            border-radius: 26px;
          }

          .whySection,
          .subjectsSection,
          .finalSwitch {
            padding: 28px 22px;
          }

          .finalActions {
            display: grid;
            width: 100%;
          }

          .finalActions a {
            justify-content: center;
          }
        }
      `}</style>
    </main>
  );
}