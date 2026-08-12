import Link from "next/link";
import type { ReactNode } from "react";

import type {
  AcademyMarketingConfig,
} from "@/app/data/academies/marketing";

export default function AcademyLanding({
  academy,
  expandedCurriculum,
}: {
  academy: AcademyMarketingConfig;
  expandedCurriculum?: ReactNode;
}) {
  const startHref = `/academies/${academy.slug}/start`;

  return (
    <main className="academyLanding">
      {/* HERO */}
      <section className="hero">
        <div className="heroCopy">
          <div className="heroBadges">
            <span className="selfPacedBadge">
              Self-Paced Academy
            </span>

            <span className="aiBadge">
              Powered by Fountain AI
            </span>
          </div>

          <p className="academyName">
            {academy.title}
          </p>

          <h1>{academy.headline}</h1>

          <p className="summary">
            {academy.summary}
          </p>

          <div className="parentPromise">
            <span>Why this matters</span>
            <strong>{academy.parentPromise}</strong>
          </div>

          <p className="audience">
            {academy.audience}
          </p>

          <div className="heroActions">
            <Link
              href={startHref}
              className="primaryAction"
            >
              Start Self-Paced Learning
            </Link>

            <a
              href="#curriculum"
              className="secondaryAction"
            >
              See the Full Pathway
            </a>
          </div>

          {/* SWITCH TO LIVE TUTORS */}
          <div className="switchPath">
            <div>
              <small>
                Prefer personal guidance?
              </small>

              <strong>
                Book a live one-to-one tutor instead.
              </strong>
            </div>

            <Link href="/subjects">
              Browse Live Tutors →
            </Link>
          </div>

          <div className="proofRow">
            {academy.proofPoints.map((point) => (
              <span key={point}>
                ✓ {point}
              </span>
            ))}
          </div>
        </div>

        {/* LEARNING EXPERIENCE PANEL */}
        <div className="heroPanel">
          <div className="panelTopline">
            <span>
              Inside the learning experience
            </span>

            <small>
              Self-paced · AI-assisted
            </small>
          </div>

          <h2>
            Teach. Show. Tell a story.
            Let them apply it.
          </h2>

          <p className="panelIntro">
            A structured learning experience designed
            to help learners understand, practise and
            apply what they learn — at their own pace.
          </p>

          <div className="journey">
            <div>
              <b>1</b>
              <span>
                Presentation-style teaching slides
              </span>
            </div>

            <div>
              <b>2</b>
              <span>
                Audio explanations and replay
              </span>
            </div>

            <div>
              <b>3</b>
              <span>
                Visual examples, stories and cases
              </span>
            </div>

            <div>
              <b>4</b>
              <span>
                Questions, decisions and practical challenges
              </span>
            </div>

            <div>
              <b>5</b>
              <span>
                Progress saved after every activity
              </span>
            </div>
          </div>
        </div>
            </section>

      {expandedCurriculum}

      {/* ACCESS */}
      <section className="accessSection">
        <div>
          <p className="sectionLabel">
            What they will be able to do
          </p>

          <h2>
            Learning designed around capability,
            not content consumption.
          </h2>
        </div>

        <div className="outcomeGrid">
          {academy.outcomes.map((outcome) => (
            <article key={outcome}>
              <span>✓</span>
              <p>{outcome}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CURRICULUM */}
      <section
        className="curriculumSection"
        id="curriculum"
      >
        <div className="sectionHeading">
          <p className="sectionLabel">
            Complete self-paced pathway
          </p>

          <h2>
            What they’ll learn
          </h2>

          <span>
            Start with the foundation, then continue
            through deeper lessons, activities, cases
            and assessments at a pace that works for
            your family.
          </span>
        </div>

        <div className="curriculumGrid">
          {academy.curriculum.map(
            (lesson, index) => (
              <article key={lesson}>
                <b>
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </b>

                <h3>{lesson}</h3>
              </article>
            )
          )}
        </div>
            </section>

      {expandedCurriculum}

      {/* ACCESS */}
      <section className="accessSection">
        <article className="accessCard">
          <p>
            Foundation access
          </p>

          <h2>
            Start free
          </h2>

          <span>
            Experience the teaching style and
            begin the pathway before deciding
            whether to unlock the complete academy.
          </span>

          <ul>
            {academy.freePreview.map((item) => (
              <li key={item}>
                ✓ {item}
              </li>
            ))}
          </ul>

          <Link href={startHref}>
            Start Foundation Access
          </Link>
        </article>

        <article className="accessCard premium">
          <div className="premiumLabelRow">
            <p>
              Premium self-paced learning
            </p>

            <span>
              AI-assisted
            </span>
          </div>

          <h2>
            Build the complete skill
          </h2>

          <span>
            Continue beyond the introduction
            into richer lessons, deeper practice,
            cases and measurable achievement.
          </span>

          <ul>
            {academy.premiumDepth.map((item) => (
              <li key={item}>
                ✓ {item}
              </li>
            ))}
          </ul>

          <Link href={startHref}>
            Explore Premium Pathway
          </Link>
        </article>
      </section>

      {/* FINAL CTA */}
      <section className="finalCta">
        <div>
          <p>
            {academy.title}
          </p>

          <h2>
            Ready to start building this skill?
          </h2>

          <span>
            Choose who is learning, begin the
            foundation and progress through the
            academy whenever it suits your schedule.
          </span>

          <div className="finalActions">
            <Link
              href={startHref}
              className="primaryAction"
            >
              Start Learning
            </Link>

            <Link
              href="/subjects"
              className="secondaryAction"
            >
              Browse Live Tutors
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .academyLanding {
          --purple:#7c3aed;
          --purple-dark:#5b21b6;
          --purple-soft:#f5efff;
          --ink:#21142f;
          --muted:#716679;

          min-height:100vh;
          color:var(--ink);

          background:
            radial-gradient(
              circle at 88% 4%,
              rgba(124,58,237,.12),
              transparent 28%
            ),
            radial-gradient(
              circle at 8% 0%,
              rgba(196,181,253,.14),
              transparent 26%
            ),
            linear-gradient(
              180deg,
              #fff,
              #fbf9ff
            );
        }

        .hero,
        .outcomesSection,
        .curriculumSection,
        .accessSection,
        .finalCta {
          width:min(
            1280px,
            calc(100% - 40px)
          );

          margin-left:auto;
          margin-right:auto;
        }

        /* HERO */

        .hero {
          min-height:690px;

          display:grid;

          grid-template-columns:
            1.08fr .92fr;

          align-items:center;

          gap:64px;

          padding:72px 0;
        }

        .heroBadges {
          display:flex;

          flex-wrap:wrap;

          gap:9px;

          margin-bottom:18px;
        }

        .selfPacedBadge,
        .aiBadge {
          display:inline-flex;

          align-items:center;

          min-height:30px;

          padding:0 11px;

          border-radius:999px;

          font-size:10px;

          font-weight:950;

          letter-spacing:.08em;
        }

        .selfPacedBadge {
          color:var(--purple-dark);

          background:#eee5ff;

          text-transform:uppercase;
        }

        .aiBadge {
          color:#fff;

          background:var(--ink);
        }

        .academyName,
        .sectionLabel,
        .finalCta p,
        .accessCard > p,
        .premiumLabelRow > p {
          margin:0;

          color:var(--purple);

          font-size:12px;

          font-weight:950;

          letter-spacing:.1em;

          text-transform:uppercase;
        }

        .hero h1 {
          max-width:850px;

          margin:16px 0 24px;

          font-size:
            clamp(
              50px,
              7vw,
              80px
            );

          line-height:.97;

          letter-spacing:-.06em;
        }

        .summary {
          max-width:760px;

          color:#55495e;

          font-size:19px;

          line-height:1.72;
        }

        /* WHY THIS MATTERS */

        .parentPromise {
          max-width:760px;

          margin-top:24px;

          padding:18px 20px;

          border-radius:20px;

          background:
            linear-gradient(
              135deg,
              #f7f3ff,
              #efe7ff
            );

          border:
            1px solid
            rgba(124,58,237,.08);
        }

        .parentPromise span,
        .parentPromise strong {
          display:block;
        }

        .parentPromise span {
          color:var(--purple);

          font-size:11px;

          font-weight:950;

          text-transform:uppercase;

          letter-spacing:.08em;
        }

        .parentPromise strong {
          margin-top:6px;

          line-height:1.55;
        }

        .audience {
          max-width:700px;

          color:#766b7e;

          line-height:1.65;
        }

        /* ACTIONS */

        .heroActions,
        .finalActions {
          display:flex;

          flex-wrap:wrap;

          gap:14px;

          margin-top:30px;
        }

        .primaryAction,
        .secondaryAction,
        .accessCard > a {
          min-height:54px;

          display:inline-flex;

          align-items:center;

          justify-content:center;

          padding:0 23px;

          border-radius:17px;

          font-weight:900;

          text-decoration:none;

          transition:
            transform .2s ease,
            box-shadow .2s ease;
        }

        .primaryAction,
        .accessCard > a {
          color:#fff;

          background:
            linear-gradient(
              135deg,
              var(--purple),
              var(--purple-dark)
            );

          box-shadow:
            0 14px 30px
            rgba(124,58,237,.18);
        }

        .secondaryAction {
          color:var(--purple-dark);

          background:#fff;

          border:
            1px solid
            rgba(124,58,237,.16);
        }

        .primaryAction:hover,
        .secondaryAction:hover,
        .accessCard > a:hover {
          transform:
            translateY(-2px);
        }

        /* SWITCH PATH */

        .switchPath {
          max-width:760px;

          margin-top:22px;

          padding:16px 18px;

          display:flex;

          align-items:center;

          justify-content:
            space-between;

          gap:18px;

          border-radius:18px;

          background:#fff;

          border:
            1px solid
            rgba(124,58,237,.10);
        }

        .switchPath small,
        .switchPath strong {
          display:block;
        }

        .switchPath small {
          color:#8a7f91;

          font-size:10px;
        }

        .switchPath strong {
          margin-top:3px;

          font-size:13px;
        }

        .switchPath a {
          flex:0 0 auto;

          color:
            var(--purple-dark);

          font-size:12px;

          font-weight:900;

          text-decoration:none;
        }

        /* PROOF */

        .proofRow {
          display:flex;

          flex-wrap:wrap;

          gap:9px;

          margin-top:24px;
        }

        .proofRow span {
          padding:9px 12px;

          border-radius:999px;

          color:
            var(--purple-dark);

          background:#f2ebff;

          font-size:12px;

          font-weight:850;
        }

        /* RIGHT PANEL */

        .heroPanel {
          padding:36px;

          border:
            1px solid
            rgba(124,58,237,.10);

          border-radius:34px;

          background:
            rgba(255,255,255,.95);

          box-shadow:
            0 28px 85px
            rgba(39,23,61,.12);
        }

        .panelTopline {
          display:flex;

          align-items:center;

          justify-content:
            space-between;

          gap:12px;

          flex-wrap:wrap;
        }

        .panelTopline > span {
          color:var(--purple);

          font-size:12px;

          font-weight:950;

          letter-spacing:.1em;

          text-transform:uppercase;
        }

        .panelTopline small {
          padding:6px 9px;

          border-radius:999px;

          color:
            var(--purple-dark);

          background:#f1e9ff;

          font-size:9px;

          font-weight:900;
        }

        .heroPanel h2 {
          margin:
            14px 0 12px;

          font-size:38px;

          line-height:1.05;

          letter-spacing:-.05em;
        }

        .panelIntro {
          margin:
            0 0 24px;

          color:#776c7e;

          line-height:1.6;
        }

        .journey {
          display:grid;

          gap:12px;
        }

        .journey div {
          display:flex;

          align-items:center;

          gap:14px;

          padding:16px;

          border-radius:18px;

          background:
            linear-gradient(
              135deg,
              #f7f3ff,
              #f2ebff
            );
        }

        .journey b {
          width:36px;

          height:36px;

          flex:0 0 36px;

          display:grid;

          place-items:center;

          border-radius:50%;

          color:#fff;

          background:
            var(--purple);
        }

        .journey span {
          font-weight:820;
        }

        /* OUTCOMES */

        .outcomesSection,
        .curriculumSection {
          padding:82px 0;
        }

        .outcomesSection {
          display:grid;

          grid-template-columns:
            .8fr 1.2fr;

          gap:56px;
        }

        .outcomesSection h2,
        .sectionHeading h2,
        .accessCard h2,
        .finalCta h2 {
          margin:14px 0;

          font-size:
            clamp(
              35px,
              5vw,
              56px
            );

          line-height:1;

          letter-spacing:-.055em;
        }

        .outcomeGrid {
          display:grid;

          grid-template-columns:
            repeat(
              2,
              minmax(0,1fr)
            );

          gap:14px;
        }

        .outcomeGrid article {
          min-height:145px;

          padding:22px;

          border-radius:22px;

          background:#fff;

          border:
            1px solid
            rgba(74,51,94,.09);

          box-shadow:
            0 12px 32px
            rgba(49,29,72,.04);
        }

        .outcomeGrid article span {
          color:var(--purple);

          font-weight:950;
        }

        .outcomeGrid article p {
          color:#54485d;

          line-height:1.55;

          font-weight:720;
        }

        /* CURRICULUM */

        .sectionHeading {
          max-width:800px;

          margin-bottom:32px;
        }

        .sectionHeading > span {
          color:#716679;

          line-height:1.7;
        }

        .curriculumGrid {
          display:grid;

          grid-template-columns:
            repeat(
              3,
              minmax(0,1fr)
            );

          gap:14px;
        }

        .curriculumGrid article {
          min-height:155px;

          padding:22px;

          border-radius:22px;

          background:
            linear-gradient(
              135deg,
              #f7f3ff,
              #efe8ff
            );

          border:
            1px solid
            rgba(124,58,237,.06);
        }

        .curriculumGrid b {
          color:var(--purple);

          font-size:12px;
        }

        .curriculumGrid h3 {
          margin:
            36px 0 0;

          font-size:20px;

          letter-spacing:-.03em;
        }

        /* ACCESS */

        .accessSection {
          display:grid;

          grid-template-columns:
            repeat(
              2,
              minmax(0,1fr)
            );

          gap:18px;

          padding:30px 0 80px;
        }

        .accessCard {
          padding:34px;

          border-radius:30px;

          background:#fff;

          border:
            1px solid
            rgba(74,51,94,.09);

          box-shadow:
            0 18px 55px
            rgba(49,29,72,.06);
        }

        .accessCard.premium {
          color:#fff;

          background:
            radial-gradient(
              circle at 95% 0%,
              rgba(196,181,253,.26),
              transparent 32%
            ),
            linear-gradient(
              145deg,
              #21142f,
              #3a2055
            );

          border-color:transparent;
        }

        .premiumLabelRow {
          display:flex;

          align-items:center;

          justify-content:
            space-between;

          gap:10px;

          flex-wrap:wrap;
        }

        .premiumLabelRow > p {
          color:#e9d5ff;
        }

        .premiumLabelRow > span {
          padding:6px 9px;

          border-radius:999px;

          background:
            rgba(255,255,255,.10);

          color:#e9d5ff;

          font-size:9px;

          font-weight:900;
        }

        .accessCard > span {
          display:block;

          color:#6f6478;

          line-height:1.65;
        }

        .accessCard ul {
          display:grid;

          gap:10px;

          margin:24px 0;

          padding:0;

          list-style:none;

          color:#55495e;
        }

        .accessCard.premium > span,
        .accessCard.premium ul {
          color:
            rgba(255,255,255,.72);
        }

        .accessCard.premium > a {
          color:#4c1d95;

          background:#fff;

          box-shadow:none;
        }

        /* FINAL CTA */

        .finalCta {
          margin-bottom:95px;

          padding:65px 40px;

          border-radius:38px;

          background:
            radial-gradient(
              circle at 88% 12%,
              rgba(196,181,253,.35),
              transparent 26%
            ),
            linear-gradient(
              135deg,
              #f8f4ff,
              #eee6ff
            );
        }

        .finalCta > div {
          max-width:760px;

          margin:auto;

          text-align:center;
        }

        .finalCta > div > span {
          display:block;

          max-width:650px;

          margin:0 auto;

          color:#655970;

          line-height:1.7;
        }

        .finalActions {
          justify-content:center;
        }

        /* TABLET */

        @media(max-width:900px) {
          .hero,
          .outcomesSection {
            grid-template-columns:1fr;
          }

          .curriculumGrid {
            grid-template-columns:
              repeat(
                2,
                minmax(0,1fr)
              );
          }
        }

        /* MOBILE */

        @media(max-width:620px) {
          .hero {
            padding-top:45px;
          }

          .hero h1 {
            font-size:48px;
          }

          .heroPanel {
            padding:24px;
          }

          .switchPath {
            align-items:flex-start;

            flex-direction:column;
          }

          .outcomeGrid,
          .curriculumGrid,
          .accessSection {
            grid-template-columns:1fr;
          }

          .primaryAction,
          .secondaryAction,
          .accessCard > a {
            width:100%;
          }

          .heroActions,
          .finalActions {
            display:grid;
          }

          .finalCta {
            padding:
              46px 22px;
          }
        }
      `}</style>
    </main>
  );
}