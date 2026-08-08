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
  title: "Learning Academies",
  description:
    "Explore FountainPrep learning academies for practical life skills, technology, languages, academic foundations and future-ready capabilities.",
};

export default function AcademiesPage() {
  return (
    <main className="academiesPage">
      <section className="hero">
        <p>FountainPrep Learning Academies</p>
        <h1>Build skills for school, life and the future.</h1>
        <span>
          Start with high-impact practical skills, languages
          and technology, then explore strong academic
          foundations. Every academy follows a clear pathway
          with interactive teaching and measurable progress.
        </span>
      </section>

      <section className="academyGrid">
        {academyOrder.map((slug, index) => {
          const academy = academyMarketing[slug];
          return (
            <Link
              key={slug}
              href={`/academies/${slug}`}
              className={index < 4 ? "academyCard featured" : "academyCard"}
            >
              <div>
                {slug === "financial-literacy" ? (
                  <b className="flagship">Flagship</b>
                ) : null}
                <small>{academy.eyebrow}</small>
                <h2>{academy.headline}</h2>
                <p>{academy.summary}</p>
              </div>
              <span>Explore learning pathway →</span>
            </Link>
          );
        })}
      </section>

      <style>{`
        .academiesPage {
          min-height: 100vh;
          padding: 70px 20px 100px;
          color:#241438;
          background:
            radial-gradient(circle at 10% 0%,rgba(124,58,237,.12),transparent 30%),
            linear-gradient(180deg,#fff,#f7f2ff);
        }
        .hero {
          width:min(980px,100%);
          margin:0 auto 50px;
          text-align:center;
        }
        .hero p {
          margin:0;
          color:#7c3aed;
          font-weight:950;
          letter-spacing:.11em;
          text-transform:uppercase;
        }
        .hero h1 {
          margin:18px 0;
          font-size:clamp(44px,7vw,76px);
          line-height:.99;
          letter-spacing:-.06em;
        }
        .hero span {
          display:block;
          max-width:800px;
          margin:auto;
          color:#6f6478;
          font-size:18px;
          line-height:1.7;
        }
        .academyGrid {
          width:min(1250px,100%);
          margin:auto;
          display:grid;
          grid-template-columns:repeat(3,minmax(0,1fr));
          gap:20px;
        }
        .academyCard {
          min-height:350px;
          display:flex;
          flex-direction:column;
          justify-content:space-between;
          padding:30px;
          border:1px solid rgba(111,66,193,.12);
          border-radius:30px;
          color:inherit;
          background:rgba(255,255,255,.96);
          text-decoration:none;
          box-shadow:0 18px 60px rgba(48,29,82,.07);
        }
        .academyCard.featured {
          background:
            radial-gradient(circle at 95% 5%,rgba(124,58,237,.12),transparent 32%),
            #fff;
          box-shadow:0 22px 70px rgba(48,29,82,.11);
        }
        .flagship {
          display:inline-block;
          margin-bottom:14px;
          padding:7px 10px;
          border-radius:999px;
          color:#fff;
          background:#b77900;
          font-size:10px;
          text-transform:uppercase;
          letter-spacing:.08em;
        }
        .academyCard small {
          color:#7c3aed;
          font-weight:900;
          letter-spacing:.07em;
          text-transform:uppercase;
        }
        .academyCard h2 {
          margin:14px 0;
          font-size:28px;
          line-height:1.1;
          letter-spacing:-.04em;
        }
        .academyCard p { color:#716679; line-height:1.68; }
        .academyCard > span { color:#6d28d9; font-weight:900; }
        @media(max-width:950px){.academyGrid{grid-template-columns:repeat(2,minmax(0,1fr));}}
        @media(max-width:620px){.academyGrid{grid-template-columns:1fr;}}
      `}</style>
    </main>
  );
}
