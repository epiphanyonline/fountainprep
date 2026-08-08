import Link from "next/link";
import type {
  AcademyMarketingConfig,
} from "@/app/data/academies/marketing";

export default function AcademyLanding({
  academy,
}: {
  academy: AcademyMarketingConfig;
}) {
  const startHref = `/academies/${academy.slug}/start`;

  return (
    <main className={`academyLanding ${academy.accent}`}>
      <section className="hero">
        <div className="heroCopy">
          <p className="eyebrow">{academy.eyebrow}</p>
          <h1>{academy.headline}</h1>
          <p className="summary">{academy.summary}</p>

          <div className="parentPromise">
            <span>Why this matters</span>
            <strong>{academy.parentPromise}</strong>
          </div>

          <p className="audience">{academy.audience}</p>

          <div className="heroActions">
            <Link href={startHref} className="primaryAction">
              Start this learning pathway
            </Link>
            <a href="#curriculum" className="secondaryAction">
              See the full pathway
            </a>
          </div>

          <div className="proofRow">
            {academy.proofPoints.map((point) => (
              <span key={point}>✓ {point}</span>
            ))}
          </div>
        </div>

        <div className="heroPanel">
          <small>Inside the learning experience</small>
          <h2>Teach. Show. Tell a story. Let them apply it.</h2>

          <div className="journey">
            <div><b>1</b><span>Presentation-style teaching slides</span></div>
            <div><b>2</b><span>Audio explanations and replay</span></div>
            <div><b>3</b><span>Visual examples, stories and cases</span></div>
            <div><b>4</b><span>Questions, decisions and practical challenges</span></div>
            <div><b>5</b><span>Progress saved after every activity</span></div>
          </div>
        </div>
      </section>

      <section className="outcomesSection">
        <div>
          <p className="sectionLabel">What they will be able to do</p>
          <h2>Learning designed around capability, not content consumption.</h2>
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

      <section className="curriculumSection" id="curriculum">
        <div className="sectionHeading">
          <p className="sectionLabel">Complete learning pathway</p>
          <h2>What they’ll learn</h2>
          <span>
            The free experience introduces the foundation. Premium access
            opens the deeper pathway, cases, assessments and continuing progress.
          </span>
        </div>

        <div className="curriculumGrid">
          {academy.curriculum.map((lesson, index) => (
            <article key={lesson}>
              <b>{String(index + 1).padStart(2, "0")}</b>
              <h3>{lesson}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="accessSection">
        <article className="accessCard">
          <p>Foundation access</p>
          <h2>Start free</h2>
          <span>
            Experience the teaching style and begin the pathway before
            deciding whether to unlock the complete academy.
          </span>
          <ul>
            {academy.freePreview.map((item) => (
              <li key={item}>✓ {item}</li>
            ))}
          </ul>
          <Link href={startHref}>Start foundation access</Link>
        </article>

        <article className="accessCard premium">
          <p>Premium learning</p>
          <h2>Build the complete skill</h2>
          <span>
            Continue beyond the introduction into richer lessons,
            deeper practice, cases and measurable achievement.
          </span>
          <ul>
            {academy.premiumDepth.map((item) => (
              <li key={item}>✓ {item}</li>
            ))}
          </ul>
          <Link href={startHref}>Explore premium pathway</Link>
        </article>
      </section>

      <section className="finalCta">
        <p>{academy.title}</p>
        <h2>Ready to start building this skill?</h2>
        <span>
          Choose who is learning, start the foundation and continue
          into the complete pathway when you are ready.
        </span>
        <Link href={startHref} className="primaryAction">
          Start learning
        </Link>
      </section>

      <style>{`
        .academyLanding {
          --academy-accent:#7c3aed;
          --academy-soft:#f5efff;
          min-height:100vh;
          color:#241438;
          background:
            radial-gradient(circle at 85% 5%,color-mix(in srgb,var(--academy-accent) 16%,transparent),transparent 30%),
            linear-gradient(180deg,#fff,#fbf9ff);
        }
        .academyLanding.emerald{--academy-accent:#087f5b;--academy-soft:#eafaf4;}
        .academyLanding.indigo{--academy-accent:#4338ca;--academy-soft:#eef2ff;}
        .academyLanding.purple,.academyLanding.violet{--academy-accent:#7c3aed;--academy-soft:#f5efff;}
        .academyLanding.gold{--academy-accent:#a16207;--academy-soft:#fff8df;}
        .academyLanding.navy{--academy-accent:#334155;--academy-soft:#f1f5f9;}
        .academyLanding.orange{--academy-accent:#c2410c;--academy-soft:#fff7ed;}
        .academyLanding.cyan{--academy-accent:#0e7490;--academy-soft:#ecfeff;}
        .academyLanding.blue{--academy-accent:#2563eb;--academy-soft:#eff6ff;}
        .academyLanding.green{--academy-accent:#15803d;--academy-soft:#f0fdf4;}
        .academyLanding.rose{--academy-accent:#be123c;--academy-soft:#fff1f2;}
        .academyLanding.amber{--academy-accent:#a16207;--academy-soft:#fffbeb;}

        .hero,.outcomesSection,.curriculumSection,.accessSection,.finalCta {
          width:min(1280px,calc(100% - 40px));
          margin-left:auto;
          margin-right:auto;
        }

        .hero {
          min-height:690px;
          display:grid;
          grid-template-columns:1.08fr .92fr;
          align-items:center;
          gap:64px;
          padding:72px 0;
        }

        .eyebrow,.sectionLabel,.heroPanel small,.finalCta>p,.accessCard>p {
          margin:0;
          color:var(--academy-accent);
          font-size:12px;
          font-weight:950;
          letter-spacing:.1em;
          text-transform:uppercase;
        }

        .hero h1 {
          max-width:850px;
          margin:18px 0 24px;
          font-size:clamp(48px,7vw,80px);
          line-height:.97;
          letter-spacing:-.06em;
        }

        .summary {
          max-width:760px;
          color:#55495e;
          font-size:19px;
          line-height:1.72;
        }

        .parentPromise {
          max-width:760px;
          margin-top:22px;
          padding:18px 20px;
          border-radius:20px;
          background:var(--academy-soft);
        }

        .parentPromise span,.parentPromise strong{display:block;}
        .parentPromise span {
          color:var(--academy-accent);
          font-size:11px;
          font-weight:950;
          text-transform:uppercase;
          letter-spacing:.08em;
        }
        .parentPromise strong { margin-top:6px; line-height:1.55; }

        .audience { max-width:700px; color:#766b7e; line-height:1.65; }

        .heroActions {
          display:flex;
          flex-wrap:wrap;
          gap:14px;
          margin-top:30px;
        }

        .primaryAction,.secondaryAction,.accessCard>a {
          min-height:54px;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          padding:0 23px;
          border-radius:999px;
          font-weight:900;
          text-decoration:none;
        }

        .primaryAction,.accessCard>a {
          color:#fff;
          background:var(--academy-accent);
        }

        .secondaryAction {
          color:var(--academy-accent);
          background:#fff;
          border:1px solid color-mix(in srgb,var(--academy-accent) 20%,transparent);
        }

        .proofRow {
          display:flex;
          flex-wrap:wrap;
          gap:9px;
          margin-top:25px;
        }

        .proofRow span {
          padding:9px 12px;
          border-radius:999px;
          color:var(--academy-accent);
          background:var(--academy-soft);
          font-size:12px;
          font-weight:850;
        }

        .heroPanel {
          padding:36px;
          border:1px solid color-mix(in srgb,var(--academy-accent) 14%,transparent);
          border-radius:34px;
          background:rgba(255,255,255,.94);
          box-shadow:0 28px 85px rgba(39,23,61,.13);
        }

        .heroPanel h2 {
          margin:12px 0 26px;
          font-size:38px;
          letter-spacing:-.05em;
        }

        .journey { display:grid; gap:12px; }
        .journey div {
          display:flex;
          align-items:center;
          gap:14px;
          padding:16px;
          border-radius:18px;
          background:var(--academy-soft);
        }

        .journey b {
          width:36px;height:36px;display:grid;place-items:center;border-radius:50%;
          color:#fff;background:var(--academy-accent);
        }
        .journey span { font-weight:820; }

        .outcomesSection,.curriculumSection { padding:82px 0; }

        .outcomesSection {
          display:grid;
          grid-template-columns:.8fr 1.2fr;
          gap:56px;
        }

        .outcomesSection h2,.sectionHeading h2,.accessCard h2,.finalCta h2 {
          margin:14px 0;
          font-size:clamp(35px,5vw,56px);
          line-height:1;
          letter-spacing:-.055em;
        }

        .outcomeGrid {
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:14px;
        }

        .outcomeGrid article {
          min-height:145px;
          padding:22px;
          border-radius:22px;
          background:#fff;
          border:1px solid rgba(74,51,94,.1);
        }

        .outcomeGrid article span { color:var(--academy-accent);font-weight:950; }
        .outcomeGrid article p { color:#54485d;line-height:1.55;font-weight:720; }

        .sectionHeading { max-width:800px; margin-bottom:32px; }
        .sectionHeading>span { color:#716679;line-height:1.7; }

        .curriculumGrid {
          display:grid;
          grid-template-columns:repeat(3,minmax(0,1fr));
          gap:14px;
        }

        .curriculumGrid article {
          min-height:155px;
          padding:22px;
          border-radius:22px;
          background:var(--academy-soft);
        }

        .curriculumGrid b { color:var(--academy-accent);font-size:12px; }
        .curriculumGrid h3 { margin:36px 0 0;font-size:20px;letter-spacing:-.03em; }

        .accessSection {
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:18px;
          padding:30px 0 80px;
        }

        .accessCard {
          padding:34px;
          border-radius:30px;
          background:#fff;
          border:1px solid rgba(74,51,94,.1);
          box-shadow:0 18px 55px rgba(49,29,72,.07);
        }

        .accessCard.premium {
          background:
            radial-gradient(circle at 95% 0%,color-mix(in srgb,var(--academy-accent) 14%,transparent),transparent 36%),
            #fff;
          border-color:color-mix(in srgb,var(--academy-accent) 25%,transparent);
        }

        .accessCard>span { display:block;color:#6f6478;line-height:1.65; }
        .accessCard ul { display:grid;gap:10px;margin:24px 0;padding:0;list-style:none;color:#55495e; }

        .finalCta {
          margin-bottom:95px;
          padding:65px 28px;
          text-align:center;
          border-radius:38px;
          background:var(--academy-soft);
        }

        .finalCta>span {
          display:block;
          max-width:650px;
          margin:0 auto 26px;
          color:#655970;
          line-height:1.7;
        }

        @media(max-width:900px){
          .hero,.outcomesSection{grid-template-columns:1fr;}
          .curriculumGrid{grid-template-columns:repeat(2,minmax(0,1fr));}
        }

        @media(max-width:620px){
          .hero{padding-top:45px;}
          .outcomeGrid,.curriculumGrid,.accessSection{grid-template-columns:1fr;}
          .heroPanel{padding:24px;}
        }
      `}</style>
    </main>
  );
}
