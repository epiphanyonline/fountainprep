import Image from "next/image";
import Link from "next/link";
import {
  biographyLibrary,
} from "@/app/data/academies/biography/biographyLibrary";

import type {
  AcademyMarketingConfig,
} from "@/app/data/academies/marketing";

type Props = {
  academy: AcademyMarketingConfig;
};

export default function BiographyLanding({
  academy,
}: Props) {
  const startHref =
  "/classroom/academy/guest" +
  "?academy=biography" +
  "&programme=greatness-foundation" +
  "&biographyId=aliko-dangote";

  return (
    <main className="bioPage">
      {/* HERO */}
      <section className="bioHero">
        <div className="heroCopy">
          <div className="eyebrowRow">
            <span className="line" />
            BIOGRAPHY OF GREATNESS
          </div>

          <p className="seriesLabel">
            THE LIVES BEHIND THE CAPITAL
          </p>

          <h1>
            Study the journey.
            <br />
            <em>Understand the capital.</em>
          </h1>

          <p className="heroIntro">
            Explore notable wealth creators around the
            world — where they started, what they built,
            what they owned, the decisions that changed
            their trajectory, and what can be documented
            about how their wealth is structured.
          </p>

          <div className="heroActions">
            <Link
              href={startHref}
              className="primaryButton"
            >
              Enter the First Biography
              <span>→</span>
            </Link>

            <Link
              href="/financial-education"
              className="secondaryButton"
            >
              Financial Education Gateway
            </Link>
          </div>

          <div className="evidenceStrip">
            <div>
              <strong>PUBLIC FACT</strong>
              <span>
                Company filings and documented ownership
              </span>
            </div>

            <div>
              <strong>ESTIMATE</strong>
              <span>
                External valuations and net-worth estimates
              </span>
            </div>

            <div>
              <strong>PRIVATE</strong>
              <span>
                Not presented as fact when undisclosed
              </span>
            </div>
          </div>
        </div>

        <div className="heroVisual">
          <div className="countryTop">
            <span>GLOBAL SERIES</span>
            <strong>NIGERIA</strong>
            <span>01</span>
          </div>

          <div className="mapLayer">
            <Image
              src="/images/academy/biography/dangote/nigeria-map.svg"
              alt=""
              fill
              sizes="320px"
              className="mapImage"
            />
          </div>

          <div className="portraitCard">
            <Image
              src="/images/academy/biography/dangote/aliko-dangote.jpg"
              alt="Aliko Dangote"
              fill
              priority
              sizes="(max-width: 700px) 75vw, 360px"
              className="portraitImage"
            />

            <div className="portraitFade" />

            <div className="portraitMeta">
              <small>FEATURED BIOGRAPHY</small>
              <strong>Aliko Dangote</strong>
              <span>
                Trading → Manufacturing → Ownership → Scale
              </span>
            </div>
          </div>

          <div className="heroTimeline">
            <span>1978</span>
            <i />
            <span>TRADE</span>
            <i />
            <span>INDUSTRY</span>
            <i />
            <span>SCALE</span>
          </div>
        </div>
      </section>

      {/* PRINCIPLE */}
      <section className="bioPrinciple">
        <p>
          THE BIOGRAPHY LENS
        </p>

        <h2>
          Wealth is the outcome.
          <br />
          <em>The journey is the lesson.</em>
        </h2>

        <div className="principleText">
          <p>
            Biography of Greatness does not present wealth
            as a shortcut, formula or endorsement of every
            decision a featured person has made.
          </p>

          <p>
            It uses real lives to explore ownership,
            enterprise, risk, capital allocation, setbacks,
            opportunity, concentration and legacy.
          </p>
        </div>
      </section>

      {/* STUDY FRAMEWORK */}
      <section className="frameworkSection">
        <div className="sectionIntro">
          <span>HOW EVERY BIOGRAPHY FLOWS</span>

          <h2>
            From beginnings
            <br />
            to legacy.
          </h2>
        </div>

        <div className="frameworkGrid">
          {[
            ["01", "Origins", "Family, place, education and starting environment."],
            ["02", "First Capital", "Early work, commerce, opportunity and access."],
            ["03", "Wealth Engine", "The business, ownership or asset that changed the trajectory."],
            ["04", "Turning Points", "Decisions, risks, setbacks and moments of acceleration."],
            ["05", "Ownership", "What was actually owned — not merely earned."],
            ["06", "Capital Allocation", "Where publicly documented capital was directed."],
            ["07", "Risk & Concentration", "What could go wrong when wealth is tied to particular assets."],
            ["08", "Legacy", "Succession, philanthropy and intergenerational considerations."],
          ].map(([number, title, copy]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      {/* FEATURED CASE */}
      <section className="caseStudy">
        <div className="caseImage">
          <Image
            src="/images/academy/biography/dangote/aliko-dangote.jpg"
            alt="Aliko Dangote"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            className="casePortrait"
          />

          <div className="caseImageFade" />

          <div className="countryMark">
            NIGERIA
          </div>
        </div>

        <div className="caseCopy">
          <span>
            FEATURED FOUNDATION BIOGRAPHY
          </span>

          <h2>
            Aliko Dangote:
            <br />
            <em>
              From Trading to Industrial Ownership
            </em>
          </h2>

          <p>
            Follow the transition from commodity trading
            into manufacturing and large-scale productive
            assets, while learning to distinguish income,
            ownership, net worth, concentration and risk.
          </p>

          <div className="caseTopics">
            <span>Trading</span>
            <span>Manufacturing</span>
            <span>Ownership</span>
            <span>Industrial Scale</span>
            <span>Capital Allocation</span>
            <span>Risk</span>
          </div>

          <Link href={startHref}>
            Start the Dangote Biography
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* GLOBAL SERIES */}
      <section className="globalSection">
        <div className="globalHeading">
          <div>
            <span>GLOBAL SERIES</span>
            <h2>
  Great fortunes.
  <br />
  Different countries.
  <br />
  Different journeys.
</h2>
          </div>

          <p>
            The library expands country by country,
            comparing different industries, ownership
            structures, opportunities and economic
            environments.
          </p>
        </div>

        <div className="countryGrid">
          {biographyLibrary.map(
  (biography) => {
    const available =
      biography.status ===
      "available";

    return (
      <article
        key={biography.id}
        className={
          available
            ? "countryCard active"
            : "countryCard"
        }
      >
        <span>
          {String(
            biography.order,
          ).padStart(
            2,
            "0",
          )}
        </span>

        <div>
          <small>
            {available
              ? "AVAILABLE NOW"
              : biography.status ===
                  "in-development"
                ? "IN DEVELOPMENT"
                : "COMING SOON"}
          </small>

          <h3>
            {biography.country}
            {" — "}
            {biography.title}:
            {" "}
            {biography.subtitle}
          </h3>

          <div className="libraryThemes">
            {biography.themes
              .slice(0, 4)
              .map(
                (theme) => (
                  <em
                    key={theme}
                  >
                    {theme}
                  </em>
                ),
              )}
          </div>
        </div>
      </article>
    );
  },
)}
        </div>
      </section>

      {/* WHAT YOU LEARN */}
      <section className="outcomeSection">
        <div>
          <span>FINANCIAL EDUCATION THROUGH BIOGRAPHY</span>

          <h2>
            Learn to look
            <br />
            beyond the headline number.
          </h2>
        </div>

        <div className="outcomeGrid">
          {academy.outcomes.map(
            (outcome, index) => (
              <article key={outcome}>
                <span>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <p>{outcome}</p>
              </article>
            ),
          )}
        </div>
      </section>

      {/* EVIDENCE */}
      <section className="evidenceSection">
        <div className="evidenceCopy">
          <span>EVIDENCE MATTERS</span>

          <h2>
            We distinguish what is known
            from what is estimated.
          </h2>

          <p>
            Private wealth is often complex. Company
            ownership can be documented while personal
            liquidity, private portfolios or estate
            arrangements may remain undisclosed.
          </p>
        </div>

        <div className="evidenceCards">
          <article className="fact">
            <span>PUBLIC FACT</span>
            <strong>
              Audited ownership
            </strong>
            <p>
              Company filings, annual reports and other
              documented public disclosures.
            </p>
          </article>

          <article>
            <span>EXTERNAL ESTIMATE</span>
            <strong>
              Net-worth estimate
            </strong>
            <p>
              Third-party estimates are described as
              estimates rather than exact personal balances.
            </p>
          </article>

          <article>
            <span>PRIVATE / NOT DISCLOSED</span>
            <strong>
              Unknown remains unknown
            </strong>
            <p>
              We do not invent private cash holdings,
              portfolios or succession arrangements.
            </p>
          </article>
        </div>
      </section>

      {/* FINAL */}
      <section className="bioFinal">
        <span>
          BIOGRAPHY OF GREATNESS
        </span>

        <h2>
          Start with the life.
          <br />
          Discover the financial ideas inside it.
        </h2>

        <p>
          Learn with AYO through cinematic scenes,
          timelines, ownership maps, decisions,
          questions and evidence-led reflection.
        </p>

        <div>
          <Link
            href={startHref}
            className="primaryButton"
          >
            Begin Biography of Greatness
            <span>→</span>
          </Link>

          <Link
            href="/financial-education"
            className="finalSecondary"
          >
            Return to Financial Education
          </Link>
        </div>
      </section>

      <style>{`
        .bioPage {
          --ink:#19130f;
          --brown:#241b15;
          --brown2:#32251b;
          --gold:#c39a55;
          --gold2:#e0bf7d;
          --paper:#f5f0e8;
          --muted:#7f746a;

          min-height:100vh;
          color:var(--ink);
          background:
            linear-gradient(
              180deg,
              #fbfaf8,
              #f5f0e9
            );
        }

        .bioHero,
        .bioPrinciple,
        .frameworkSection,
        .caseStudy,
        .globalSection,
        .outcomeSection,
        .evidenceSection,
        .bioFinal {
          width:min(
            1380px,
            calc(100% - 40px)
          );
          margin-left:auto;
          margin-right:auto;
        }

        /* HERO */

        .bioHero {
          min-height:760px;
          padding:80px 0 88px;

          display:grid;
          grid-template-columns:
            .95fr 1.05fr;

          gap:75px;
          align-items:center;
        }

        .eyebrowRow {
          display:flex;
          align-items:center;
          gap:12px;

          color:#8a6a39;
          font-size:10px;
          font-weight:900;
          letter-spacing:.16em;
        }

        .eyebrowRow .line {
          width:35px;
          height:1px;
          background:var(--gold);
        }

        .seriesLabel {
          margin:30px 0 0;

          color:#8b7e72;
          font-size:11px;
          font-weight:850;
          letter-spacing:.13em;
        }

        .heroCopy h1 {
          margin:16px 0 24px;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size:
            clamp(
              60px,
              6vw,
              92px
            );

          line-height:.95;
          letter-spacing:-.055em;
          font-weight:500;
        }

        .heroCopy h1 em {
          color:#876839;
          font-weight:400;
        }

        .heroIntro {
          max-width:650px;

          color:#62584f;
          font-size:17px;
          line-height:1.78;
        }

        .heroActions {
          display:flex;
          flex-wrap:wrap;
          gap:12px;
          margin-top:31px;
        }

        .primaryButton,
        .secondaryButton,
        .caseCopy > a,
        .finalSecondary {
          min-height:52px;

          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:20px;

          padding:0 20px;

          border-radius:999px;

          text-decoration:none;

          font-size:12px;
          font-weight:850;
        }

        .primaryButton {
          color:#fff;

          background:
            linear-gradient(
              135deg,
              #33251a,
              #72522d
            );

          box-shadow:
            0 16px 35px
            rgba(54,38,24,.17);
        }

        .secondaryButton {
          color:#5d4932;

          background:white;

          border:
            1px solid
            rgba(92,66,39,.15);
        }

        .evidenceStrip {
          margin-top:38px;

          display:grid;
          grid-template-columns:
            repeat(3,1fr);

          gap:9px;
        }

        .evidenceStrip > div {
          padding:13px;

          border-radius:14px;

          border:
            1px solid
            rgba(91,66,41,.10);

          background:
            rgba(255,255,255,.55);
        }

        .evidenceStrip strong,
        .evidenceStrip span {
          display:block;
        }

        .evidenceStrip strong {
          color:#8a6838;
          font-size:7px;
          letter-spacing:.12em;
        }

        .evidenceStrip span {
          margin-top:5px;

          color:#81766c;
          font-size:8px;
          line-height:1.45;
        }

        /* HERO VISUAL */

        .heroVisual {
          min-height:570px;

          position:relative;

          overflow:hidden;

          border-radius:30px;

          color:white;

          background:
            radial-gradient(
              circle at 75% 15%,
              rgba(202,160,88,.22),
              transparent 28%
            ),
            linear-gradient(
              145deg,
              #2a2018,
              #15110e 72%
            );

          box-shadow:
            0 42px 90px
            rgba(47,32,21,.22);
        }

        .countryTop {
          position:absolute;
          left:25px;
          right:25px;
          top:20px;
          z-index:4;

          display:flex;
          justify-content:space-between;
          align-items:center;

          color:#9c8b78;
          font-size:7px;
          letter-spacing:.11em;
        }

        .countryTop strong {
          color:#d6b77d;
          font-family:Georgia,serif;
          font-size:13px;
          letter-spacing:.08em;
        }

        .mapLayer {
          position:absolute;

          left:7%;
          top:14%;

          width:55%;
          height:55%;

          opacity:.30;

          filter:
            sepia(.4)
            saturate(.55)
            brightness(.73);
        }

        .mapLayer :global(.mapImage) {
          object-fit:contain;
        }

        .portraitCard {
          position:absolute;

          right:7%;
          top:11%;

          width:48%;
          height:68%;

          overflow:hidden;

          border-radius:
            110px 110px 22px 22px;

          border:
            1px solid
            rgba(255,255,255,.09);

          box-shadow:
            0 30px 65px
            rgba(0,0,0,.35);
        }

        .portraitCard :global(.portraitImage) {
          object-fit:cover;
          object-position:52% 27%;

          filter:
            saturate(.8)
            contrast(1.05)
            brightness(.76);
        }

        .portraitFade {
          position:absolute;
          inset:0;

          background:
            linear-gradient(
              0deg,
              rgba(13,9,6,.97),
              rgba(13,9,6,.55) 25%,
              transparent 61%
            );
        }

        .portraitMeta {
          position:absolute;

          left:22px;
          right:22px;
          bottom:20px;

          z-index:3;
        }

        .portraitMeta small,
        .portraitMeta strong,
        .portraitMeta span {
          display:block;
        }

        .portraitMeta small {
          color:#cda965;
          font-size:7px;
          letter-spacing:.13em;
          font-weight:900;
        }

        .portraitMeta strong {
          margin-top:6px;

          font-family:Georgia,serif;
          font-size:29px;
          font-weight:500;
        }

        .portraitMeta span {
          margin-top:5px;

          color:#a89b8d;
          font-size:8px;
        }

        .heroTimeline {
          position:absolute;

          left:7%;
          right:7%;
          bottom:7%;

          display:flex;
          align-items:center;
          gap:8px;

          color:#a99887;
          font-size:7px;
          font-weight:850;
          letter-spacing:.08em;
        }

        .heroTimeline i {
          flex:1;
          height:1px;
          background:
            rgba(211,174,107,.34);
        }

        /* PRINCIPLE */

        .bioPrinciple {
          padding:120px 0;

          display:grid;

          grid-template-columns:
            1.1fr .9fr;

          gap:90px;

          border-top:
            1px solid
            rgba(80,56,35,.09);
        }

        .bioPrinciple > p,
        .sectionIntro > span,
        .globalHeading span,
        .outcomeSection > div > span,
        .evidenceCopy > span,
        .bioFinal > span {
          color:#8f6e3a;

          font-size:9px;
          font-weight:900;
          letter-spacing:.16em;
        }

        .bioPrinciple h2,
        .sectionIntro h2,
        .globalHeading h2,
        .outcomeSection h2,
        .evidenceCopy h2,
        .bioFinal h2 {
          margin:14px 0 0;

          font-family:
            Georgia,
            serif;

          font-size:
            clamp(
              43px,
              4.8vw,
              68px
            );

          line-height:1;
          letter-spacing:-.045em;
          font-weight:500;
        }

        .bioPrinciple h2 em {
          color:#907345;
          font-weight:400;
        }

        .principleText {
          padding-top:30px;

          color:#6f645a;
          font-size:15px;
          line-height:1.8;
        }

        /* FRAMEWORK */

        .frameworkSection {
          padding:100px 0 115px;

          border-top:
            1px solid
            rgba(80,56,35,.09);
        }

        .sectionIntro {
          margin-bottom:40px;
        }

        .frameworkGrid {
          display:grid;

          grid-template-columns:
            repeat(4,1fr);

          gap:12px;
        }

        .frameworkGrid article {
          min-height:220px;

          padding:25px;

          display:flex;
          flex-direction:column;

          border-radius:22px;

          background:#fff;

          border:
            1px solid
            rgba(78,56,36,.09);
        }

        .frameworkGrid article > span {
          color:#b18a4d;
          font-family:Georgia,serif;
          font-size:18px;
        }

        .frameworkGrid h3 {
          margin:auto 0 8px;

          font-family:Georgia,serif;
          font-size:26px;
          font-weight:500;
        }

        .frameworkGrid p {
          margin:0;

          color:#807369;
          font-size:11px;
          line-height:1.65;
        }

        /* FEATURE CASE */

        .caseStudy {
          min-height:680px;

          display:grid;
          grid-template-columns:
            .95fr 1.05fr;

          overflow:hidden;

          border-radius:32px;

          color:white;

          background:
            linear-gradient(
              145deg,
              #211912,
              #110e0b
            );

          box-shadow:
            0 35px 80px
            rgba(45,30,18,.18);
        }

        .caseImage {
          min-height:680px;
          position:relative;
        }

        .caseImage :global(.casePortrait) {
          object-fit:cover;
          object-position:52% 24%;

          filter:
            saturate(.72)
            contrast(1.07)
            brightness(.65);
        }

        .caseImageFade {
          position:absolute;
          inset:0;

          background:
            linear-gradient(
              90deg,
              transparent 35%,
              #15100d 100%
            ),
            linear-gradient(
              0deg,
              rgba(15,11,8,.7),
              transparent 55%
            );
        }

        .countryMark {
          position:absolute;
          top:30px;
          left:30px;

          color:#d2af6b;
          font-size:9px;
          font-weight:900;
          letter-spacing:.16em;
        }

        .caseCopy {
          padding:75px 65px;

          display:flex;
          flex-direction:column;
          justify-content:center;
        }

        .caseCopy > span {
          color:#caa760;

          font-size:8px;
          font-weight:900;
          letter-spacing:.15em;
        }

        .caseCopy h2 {
          margin:15px 0 19px;

          font-family:Georgia,serif;

          font-size:
            clamp(
              44px,
              4.5vw,
              67px
            );

          line-height:1;
          letter-spacing:-.045em;
          font-weight:500;
        }

        .caseCopy h2 em {
          color:#d6b473;
          font-weight:400;
        }

        .caseCopy > p {
          color:#c0b4a8;

          line-height:1.75;
          font-size:14px;
        }

        .caseTopics {
          display:flex;
          flex-wrap:wrap;
          gap:8px;

          margin:25px 0;
        }

        .caseTopics span {
          padding:8px 11px;

          border-radius:999px;

          color:#cbb9a7;

          border:
            1px solid
            rgba(255,255,255,.10);

          font-size:8px;
        }

        .caseCopy > a {
          width:fit-content;

          color:#21170f;
          background:#e7d3ab;
        }

        /* GLOBAL */

        .globalSection {
          padding:120px 0;
        }

        .globalHeading {
          display:grid;

          grid-template-columns:
            1fr .7fr;

          gap:80px;

          align-items:end;

          margin-bottom:40px;
        }

        .globalHeading > p {
          color:#75695e;
          line-height:1.75;
          max-width:500px;
        }

        .countryGrid {
          display:grid;
          gap:9px;
        }

        .countryCard {
          min-height:105px;

          display:grid;

          grid-template-columns:
            65px 1fr;

          gap:20px;
          align-items:center;

          padding:18px 23px;

          border-radius:18px;

          background:
            rgba(255,255,255,.68);

          border:
            1px solid
            rgba(79,55,34,.09);
        }

        .countryCard.active {
          background:#211811;
          color:white;
        }

        .countryCard > span {
          color:#aa8957;

          font-family:Georgia,serif;
          font-size:19px;
        }

        .countryCard small {
          color:#a3824e;

          font-size:7px;
          font-weight:900;
          letter-spacing:.12em;
        }

        .countryCard h3 {
          margin:5px 0 0;

          font-family:Georgia,serif;
          font-size:21px;
          font-weight:500;
        }

        .libraryThemes {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 9px;
}

.libraryThemes em {
  padding: 4px 7px;

  border-radius: 999px;

  color: #90724a;

  background:
    rgba(171, 133, 79, .08);

  font-family:
    inherit;

  font-size: 6px;

  font-style: normal;

  font-weight: 800;

  letter-spacing: .05em;

  text-transform: uppercase;
}

.countryCard.active
.libraryThemes em {
  color: #d1b27c;

  background:
    rgba(211, 178, 124, .08);

  border:
    1px solid
    rgba(211, 178, 124, .09);
}

        /* OUTCOMES */

        .outcomeSection {
          padding:100px 0;

          display:grid;

          grid-template-columns:
            .8fr 1.2fr;

          gap:70px;

          border-top:
            1px solid
            rgba(80,56,35,.09);
        }

        .outcomeGrid {
          display:grid;
          grid-template-columns:
            repeat(2,1fr);
          gap:10px;
        }

        .outcomeGrid article {
          min-height:135px;

          padding:21px;

          border-radius:18px;

          background:white;

          border:
            1px solid
            rgba(81,58,36,.09);
        }

        .outcomeGrid article > span {
          color:#b18c50;
          font-family:Georgia,serif;
          font-size:15px;
        }

        .outcomeGrid p {
          margin:18px 0 0;

          color:#62584e;
          line-height:1.55;
          font-size:12px;
        }

        /* EVIDENCE */

        .evidenceSection {
          margin-bottom:110px;

          padding:70px;

          display:grid;

          grid-template-columns:
            .8fr 1.2fr;

          gap:70px;

          border-radius:30px;

          color:white;

          background:
            radial-gradient(
              circle at 85% 10%,
              rgba(185,143,72,.18),
              transparent 25%
            ),
            linear-gradient(
              145deg,
              #211912,
              #120e0b
            );
        }

        .evidenceCopy h2 {
          color:white;
        }

        .evidenceCopy p {
          color:#aa9d91;
          line-height:1.75;
        }

        .evidenceCards {
          display:grid;
          gap:9px;
        }

        .evidenceCards article {
          padding:21px;

          border-radius:16px;

          border:
            1px solid
            rgba(255,255,255,.08);

          background:
            rgba(255,255,255,.045);
        }

        .evidenceCards article.fact {
          border-color:
            rgba(210,173,105,.25);

          background:
            rgba(184,139,69,.11);
        }

        .evidenceCards span,
        .evidenceCards strong {
          display:block;
        }

        .evidenceCards span {
          color:#b49360;
          font-size:7px;
          font-weight:900;
          letter-spacing:.13em;
        }

        .evidenceCards strong {
          margin-top:6px;

          font-family:Georgia,serif;
          font-size:20px;
          font-weight:500;
        }

        .evidenceCards p {
          margin:6px 0 0;

          color:#9f9388;
          font-size:10px;
          line-height:1.6;
        }

        /* FINAL */

        .bioFinal {
          min-height:500px;

          margin-bottom:60px;

          padding:80px 30px;

          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;

          text-align:center;

          border-radius:33px;

          color:white;

          background:
            radial-gradient(
              circle at 50% 115%,
              rgba(195,152,80,.22),
              transparent 36%
            ),
            linear-gradient(
              145deg,
              #251b14,
              #120e0b
            );
        }

        .bioFinal h2 {
          max-width:850px;
        }

        .bioFinal p {
          max-width:620px;

          color:#b7aa9d;
          line-height:1.75;
        }

        .bioFinal > div {
          display:flex;
          flex-wrap:wrap;
          gap:10px;

          margin-top:25px;
        }

        .finalSecondary {
          color:#d8c8b6;

          border:
            1px solid
            rgba(255,255,255,.11);
        }

        @media(max-width:950px) {
          .bioHero,
          .bioPrinciple,
          .caseStudy,
          .globalHeading,
          .outcomeSection,
          .evidenceSection {
            grid-template-columns:1fr;
          }

          .frameworkGrid {
            grid-template-columns:
              repeat(2,1fr);
          }

          .heroVisual {
            min-height:600px;
          }

          .caseImage {
            min-height:520px;
          }
        }

        @media(max-width:650px) {
          .bioHero,
          .bioPrinciple,
          .frameworkSection,
          .caseStudy,
          .globalSection,
          .outcomeSection,
          .evidenceSection,
          .bioFinal {
            width:
              min(
                100% - 24px,
                1380px
              );
          }

          .bioHero {
            padding-top:55px;
          }

          .heroCopy h1 {
            font-size:54px;
          }

          .evidenceStrip {
            grid-template-columns:1fr;
          }

          .heroVisual {
            min-height:500px;
          }

          .portraitCard {
            width:60%;
            height:62%;
          }

          .mapLayer {
            width:65%;
          }

          .frameworkGrid,
          .outcomeGrid {
            grid-template-columns:1fr;
          }

          .caseCopy {
            padding:45px 25px;
          }

          .globalSection {
            padding:85px 0;
          }

          .evidenceSection {
            padding:40px 24px;
          }

          .bioFinal h2 {
            font-size:43px;
          }

          .bioFinal > div {
            width:100%;
          }

          .bioFinal .primaryButton,
          .finalSecondary {
            width:100%;
          }
        }
      `}</style>
    </main>
  );
}