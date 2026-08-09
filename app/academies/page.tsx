import Link from "next/link";
import {
  academyMarketing,
  type PublicAcademySlug,
} from "@/app/data/academies/marketing";

const academyOrder: PublicAcademySlug[] = [
  "financial-literacy",
  "coding",
  "language",
  "ai",
  "biography",
  "bible",
  "digital-skills",
  "data-analytics",
  "ielts",
  "science",
  "mathematics",
  "english",
];

export const metadata = {
  title: "Self-Paced Academies | FountainPrep",
  description:
    "Explore FountainPrep Self-Paced Academies — structured, interactive and AI-assisted learning for practical skills, technology, languages and academic development.",
};

export default function AcademiesPage() {
  return (
    <main className="academiesPage">
      {/* HERO */}
      <section className="hero">
        <div className="heroBadges">
          <span className="selfPacedBadge">SELF-PACED ACADEMIES</span>
          <span className="aiBadge">Powered by Fountain AI</span>
        </div>

        <h1>
          Learn independently.
          <span> Progress with guidance.</span>
        </h1>

        <p className="heroIntro">
          Structured learning academies children can complete at their own pace,
          with interactive lessons, activities, practice and AI-assisted support
          available whenever they are ready to learn.
        </p>

        <div className="heroPoints">
          <span>✓ Learn anytime</span>
          <span>✓ Interactive lessons</span>
          <span>✓ AI-assisted guidance</span>
          <span>✓ Progress saved automatically</span>
        </div>

        <div className="heroActions">
          <a href="#academies" className="primaryButton">
            Explore Self-Paced Academy
          </a>

          <Link href="/subjects" className="secondaryButton">
            Browse Live Tutors
          </Link>
        </div>

        <div className="pathClarifier">
          <div>
            <strong>Looking for a live tutor?</strong>
            <p>
              Self-Paced Academies are independent learning experiences.
              For scheduled one-to-one teaching with a real tutor, choose Live Tutors.
            </p>
          </div>

          <Link href="/subjects">
            Explore Live Tutoring →
          </Link>
        </div>
      </section>

      {/* SECTION INTRO */}
      <section className="academyIntro" id="academies">
        <div>
          <p>CHOOSE AN ACADEMY</p>
          <h2>Build skills for school, life and the future.</h2>
        </div>

        <span>
          Every academy follows a structured learning pathway with clear
          progression, interactive teaching and opportunities to practise.
        </span>
      </section>

      {/* ACADEMY GRID */}
      <section className="academyGrid">
        {academyOrder.map((slug, index) => {
          const academy = academyMarketing[slug];

          return (
            <Link
              key={slug}
              href={`/academies/${slug}`}
              className={
                index === 0
                  ? "academyCard flagshipCard"
                  : index < 4
                  ? "academyCard featured"
                  : "academyCard"
              }
            >
              <div>
                <div className="cardLabels">
  <span className="selfPacedMini">Self-Paced</span>
</div>

{slug === "financial-literacy" ? (
  <>
    <small>Financial Literacy Academy</small>
    <h2>Equip them with money skills for a brighter financial future.</h2>
  </>
) : (
  <>
    <small>{academy.eyebrow}</small>
    <h2>{academy.headline}</h2>
  </>
)}

                <p>{academy.summary}</p>
              </div>

              <div className="cardFooter">
                <span>AI-assisted learning</span>
                <strong>Explore Self-Paced Academy →</strong>
              </div>
            </Link>
          );
        })}
      </section>

      {/* SWITCH PATH */}
      <section className="liveTutorSwitch">
        <div>
          <small>NEED PERSONAL GUIDANCE?</small>
          <h2>Prefer learning with a real tutor?</h2>
          <p>
            Book scheduled one-to-one lessons with an expert FountainPrep tutor.
          </p>
        </div>

        <Link href="/subjects">
          Browse Live Tutors →
        </Link>
      </section>

      <style>{`
        .academiesPage {
          min-height: 100vh;
          padding: 58px 20px 100px;
          color: #241438;
          background:
            radial-gradient(
              circle at 8% 0%,
              rgba(124, 58, 237, 0.13),
              transparent 28%
            ),
            radial-gradient(
              circle at 92% 8%,
              rgba(196, 181, 253, 0.20),
              transparent 26%
            ),
            linear-gradient(180deg, #ffffff, #f8f5ff);
        }

        /* HERO */

        .hero {
          width: min(1080px, 100%);
          margin: 0 auto 78px;
          text-align: center;
        }

        .heroBadges {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 22px;
        }

        .selfPacedBadge,
        .aiBadge {
          display: inline-flex;
          align-items: center;
          padding: 8px 12px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.09em;
        }

        .selfPacedBadge {
          color: #6d28d9;
          background: #f1e9ff;
          text-transform: uppercase;
        }

        .aiBadge {
          color: #fff;
          background: #241438;
        }

        .hero h1 {
          max-width: 980px;
          margin: 0 auto 22px;
          font-size: clamp(48px, 7vw, 82px);
          line-height: 0.98;
          letter-spacing: -0.065em;
        }

        .hero h1 span {
          display: block;
          color: #7c3aed;
        }

        .heroIntro {
          max-width: 810px;
          margin: auto;
          color: #706577;
          font-size: 18px;
          line-height: 1.72;
        }

        .heroPoints {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 26px;
        }

        .heroPoints span {
          padding: 9px 12px;
          border-radius: 999px;
          border: 1px solid rgba(124, 58, 237, 0.10);
          background: rgba(255,255,255,.84);
          color: #55485f;
          font-size: 11px;
          font-weight: 800;
        }

        .heroActions {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .primaryButton,
        .secondaryButton {
          min-height: 54px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 24px;
          border-radius: 17px;
          font-weight: 900;
          text-decoration: none;
        }

        .primaryButton {
          color: #fff;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          box-shadow: 0 16px 38px rgba(124,58,237,.24);
        }

        .secondaryButton {
          color: #2b193d;
          background: #fff;
          border: 1px solid rgba(124,58,237,.14);
        }

        .pathClarifier {
          max-width: 820px;
          margin: 36px auto 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 28px;
          padding: 20px 24px;
          text-align: left;
          border-radius: 22px;
          background: rgba(255,255,255,.85);
          border: 1px solid rgba(124,58,237,.10);
          box-shadow: 0 16px 45px rgba(48,29,82,.05);
        }

        .pathClarifier strong {
          font-size: 14px;
        }

        .pathClarifier p {
          margin: 5px 0 0;
          color: #756a7c;
          font-size: 12px;
          line-height: 1.5;
        }

        .pathClarifier a {
          flex: 0 0 auto;
          color: #6d28d9;
          font-weight: 900;
          text-decoration: none;
          font-size: 12px;
        }

        /* INTRO */

        .academyIntro {
          width: min(1250px, 100%);
          margin: 0 auto 28px;
          display: grid;
          grid-template-columns: 1fr .8fr;
          align-items: end;
          gap: 40px;
        }

        .academyIntro p {
          margin: 0;
          color: #7c3aed;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .12em;
        }

        .academyIntro h2 {
          margin: 9px 0 0;
          font-size: clamp(34px, 4.5vw, 54px);
          line-height: 1;
          letter-spacing: -.05em;
        }

        .academyIntro > span {
          color: #746979;
          line-height: 1.7;
        }

        /* CARDS */

        .academyGrid {
          width: min(1250px, 100%);
          margin: auto;
          display: grid;
          grid-template-columns: repeat(3, minmax(0,1fr));
          gap: 20px;
        }

        .academyCard {
          min-height: 370px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 30px;
          border: 1px solid rgba(111,66,193,.10);
          border-radius: 30px;
          color: inherit;
          background: rgba(255,255,255,.96);
          text-decoration: none;
          box-shadow: 0 18px 60px rgba(48,29,82,.07);
          transition:
            transform .2s ease,
            box-shadow .2s ease;
        }

        .academyCard:hover {
          transform: translateY(-4px);
          box-shadow: 0 28px 72px rgba(48,29,82,.12);
        }

        .academyCard.featured {
          background:
            radial-gradient(
              circle at 95% 5%,
              rgba(124,58,237,.13),
              transparent 34%
            ),
            #fff;
        }

        .flagshipCard {
          grid-column: span 2;
          min-height: 410px;
          color: #fff;
          background:
            radial-gradient(
              circle at 88% 8%,
              rgba(167,139,250,.32),
              transparent 30%
            ),
            linear-gradient(145deg,#21142f,#3a2055);
          border-color: transparent;
          box-shadow: 0 28px 80px rgba(39,20,55,.18);
        }

        .flagshipCard p {
          color: rgba(255,255,255,.72) !important;
        }

        .flagshipCard small {
          color: #e9d5ff !important;
        }

        .flagshipCard .selfPacedMini {
          color: #eadcff;
          background: rgba(255,255,255,.10);
        }

        .flagshipCard .cardFooter span {
          color: rgba(255,255,255,.62);
        }

        .flagshipCard .cardFooter strong {
          color: #fff;
        }

        .cardLabels {
          min-height: 31px;
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          align-items: center;
          margin-bottom: 16px;
        }

        .flagship,
        .selfPacedMini {
          display: inline-block;
          padding: 7px 10px;
          border-radius: 999px;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: .08em;
        }
        
        .selfPacedMini {
          color: #6d28d9;
          background: #f2eaff;
          font-weight: 950;
        }

        .academyCard small {
          color: #7c3aed;
          font-weight: 900;
          letter-spacing: .07em;
          text-transform: uppercase;
        }

        .academyCard h2 {
          margin: 14px 0;
          font-size: 29px;
          line-height: 1.1;
          letter-spacing: -.04em;
        }

        .academyCard p {
          color: #716679;
          line-height: 1.68;
        }

        .cardFooter {
          margin-top: 32px;
          padding-top: 18px;
          border-top: 1px solid rgba(124,58,237,.08);
        }

        .cardFooter span,
        .cardFooter strong {
          display: block;
        }

        .cardFooter span {
          color: #95899c;
          font-size: 10px;
        }

        .cardFooter strong {
          margin-top: 7px;
          color: #6d28d9;
          font-size: 13px;
        }

        /* BOTTOM SWITCH */

        .liveTutorSwitch {
          width: min(1250px, 100%);
          margin: 72px auto 0;
          padding: 42px 46px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
          border-radius: 30px;
          background: #241438;
          color: #fff;
        }

        .liveTutorSwitch small {
          color: #c4b5fd;
          font-weight: 950;
          letter-spacing: .12em;
        }

        .liveTutorSwitch h2 {
          margin: 9px 0;
          font-size: 34px;
          letter-spacing: -.04em;
        }

        .liveTutorSwitch p {
          margin: 0;
          color: rgba(255,255,255,.66);
        }

        .liveTutorSwitch a {
          flex: 0 0 auto;
          padding: 15px 19px;
          border-radius: 14px;
          background: #fff;
          color: #5b21b6;
          font-weight: 950;
          text-decoration: none;
        }

        @media (max-width: 950px) {
          .academyGrid {
            grid-template-columns: repeat(2,minmax(0,1fr));
          }

          .academyIntro {
            grid-template-columns: 1fr;
          }

          .flagshipCard {
            grid-column: span 2;
          }
        }

        @media (max-width: 620px) {
          .academiesPage {
            padding: 42px 12px 70px;
          }

          .hero {
            margin-bottom: 58px;
          }

          .hero h1 {
            font-size: 48px;
          }

          .heroIntro {
            font-size: 16px;
          }

          .heroActions {
            display: grid;
          }

          .primaryButton,
          .secondaryButton {
            width: 100%;
          }

          .pathClarifier {
            align-items: flex-start;
            flex-direction: column;
          }

          .academyGrid {
            grid-template-columns: 1fr;
          }

          .flagshipCard {
            grid-column: auto;
          }

          .academyCard {
            min-height: 350px;
            padding: 25px;
          }

          .liveTutorSwitch {
            padding: 30px 24px;
            align-items: flex-start;
            flex-direction: column;
          }

          .liveTutorSwitch a {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </main>
  );
}