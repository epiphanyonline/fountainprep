"use client";

import Link from "next/link";
import SupportWidget from "./components/SupportWidget";
import {
  FPButton,
  FPJourney,
  FPSectionHeading,
} from "./components/design-system";
import {
  academyJourney,
  featuredAcademies,
} from "./data/homepage";

const quickPaths = [
  {
    title: "Academies",
    description: "Interactive lessons, practice and measurable progress.",
    href: "/academies",
    icon: "🎓",
  },
  {
    title: "Live Tutors",
    description: "Private 1-to-1 support with expert tutors.",
    href: "/start",
    icon: "👥",
  },
  {
    title: "My Children",
    description: "Track learning, progress and next steps.",
    href: "/parent/students",
    icon: "🧒",
  },
  {
    title: "Subjects",
    description: "Choose a subject and how you want to learn.",
    href: "/subjects",
    icon: "📚",
  },
];

const experienceItems = [
  {
    icon: "🖥️",
    title: "Interactive lessons",
    text: "Presentation slides, audio, visuals and guided explanations.",
  },
  {
    icon: "🎯",
    title: "Practice & activities",
    text: "Questions, scenarios, cases and challenges that make learning active.",
  },
  {
    icon: "📕",
    title: "Real-life stories",
    text: "Connect concepts to people, choices, consequences and real outcomes.",
  },
  {
    icon: "🏅",
    title: "Progress & rewards",
    text: "XP, streaks, lesson completion and visible learning momentum.",
  },
  {
    icon: "💻",
    title: "Anytime, anywhere",
    text: "Responsive learning designed for desktop, tablet and mobile.",
  },
];

export default function HomePage() {
  return (
    <main className="premiumHome">
      <section className="hero fp-container">
        <div className="heroCopy">
          <p className="heroPill">
            ✨ Skills today. Opportunities tomorrow.
          </p>

          <h1>
            Equip them with skills.
            <span>
              Build a future they can grow into.
            </span>
          </h1>

          <p className="heroLead">
            Structured learning academies, expert live tutors
            and AI-assisted teaching experiences that build
            knowledge, confidence and practical real-world
            skills.
          </p>

          <div className="heroActions">
            <FPButton href="/academies">
              Explore Academies →
            </FPButton>

            <FPButton
              href="/start"
              variant="secondary"
            >
              Book a Live Tutor
            </FPButton>
          </div>

          <div className="trustLine">
            <span>✓ Children, teens & adults</span>
            <span>✓ Structured pathways</span>
            <span>✓ Progress you can see</span>
            <span>✓ Safe & guided</span>
          </div>
        </div>

        <div className="learnerHero" aria-label="FountainPrep learner experience">
          <div className="learnerGlow" />
          <div className="kidIllustration">
            <div className="kidHead">😊</div>
            <div className="kidBody" />
            <div className="laptop">
              <span>F</span>
            </div>
            <div className="book" />
          </div>

          <div className="floatCard skillOne">
            <small>💰 Practical life skill</small>
            <strong>Financial Literacy</strong>
          </div>

          <div className="floatCard skillTwo">
            <small>💻 Future-ready skill</small>
            <strong>Coding</strong>
          </div>

          <div className="floatCard skillThree">
            <small>🌍 Communication</small>
            <strong>Languages</strong>
          </div>
        </div>
      </section>

      <section className="quickGrid fp-container">
        {quickPaths.map((item) => (
          <Link href={item.href} key={item.title} className="quickCard">
            <span className="quickIcon">{item.icon}</span>
            <div>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </div>
            <b>→</b>
          </Link>
        ))}
      </section>

      <section className="academies fp-container">
        <div className="sectionTop">
          <div>
            <p className="sectionKicker">Top academies</p>
            <h2>Learn what matters. Build what lasts.</h2>
          </div>
          <Link href="/academies">View all academies →</Link>
        </div>

        <div className="academyGrid">
          {featuredAcademies.slice(0, 6).map((academy) => (
            <article className="academyCard" key={academy.title}>
              <div className="academyVisual">
                {academy.badge ? <span className="badge">{academy.badge}</span> : null}
                <span>{academy.icon}</span>
              </div>

              <div className="academyBody">
                <h3>{academy.title}</h3>
                <p>{academy.description}</p>
                <strong>{academy.outcome}</strong>
              </div>

              <Link href={academy.href}>Start learning</Link>
            </article>
          ))}
        </div>

        <div className="secondaryAcademies">
          {featuredAcademies.slice(6).map((academy) => (
            <Link key={academy.title} href={academy.href}>
              <span>{academy.icon}</span>
              <div>
                <strong>{academy.title}</strong>
                <small>{academy.outcome}</small>
              </div>
              <b>→</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="experience fp-container">
        <FPSectionHeading
          eyebrow="Powered learning experiences"
          title="Engaging. Interactive. Effective."
          description="The technology stays in the background. The learner experiences clear teaching, memorable visuals, useful stories, active practice and visible progress."
        />

        <div className="experienceGrid">
          {experienceItems.map((item) => (
            <article key={item.title}>
              <span>{item.icon}</span>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="journeySection fp-container">
        <FPSectionHeading
          eyebrow="A clear learning pathway"
          title="Every lesson should move the learner toward a capability."
          description="FountainPrep combines explanation, interaction, practice and progress so parents can see more than screen time — they can see learning."
        />
        <div className="journeyWrap">
          <FPJourney steps={academyJourney} />
        </div>
      </section>

      <section className="parentSection fp-container">
        <div>
          <p className="sectionKicker">Why parents choose FountainPrep</p>
          <h2>
            Give them more than another app.
            <span>Give them a learning advantage.</span>
          </h2>
          <p>
            Build academic confidence, financial capability,
            digital fluency, language connection and the
            curiosity to keep learning — with live support when
            they need it.
          </p>
        </div>

        <div className="parentCards">
          <article>
            <strong>One learner profile</strong>
            <span>Progress follows the learner across FountainPrep.</span>
          </article>
          <article>
            <strong>Flexible support</strong>
            <span>Use interactive academies, live tutors or both.</span>
          </article>
          <article>
            <strong>Parent visibility</strong>
            <span>See lessons, progress, streaks and next steps.</span>
          </article>
          <article>
            <strong>Future-ready skills</strong>
            <span>Learning extends beyond school subjects.</span>
          </article>
        </div>
      </section>

      <section className="finalCta fp-container">
        <p>Start with one useful skill.</p>
        <h2>What would you like them to build next?</h2>
        <div>
          <FPButton href="/academies">Explore Academies →</FPButton>
          <FPButton href="/start" variant="secondary">
            Find a Live Tutor
          </FPButton>
        </div>
      </section>

      <SupportWidget />

      <style jsx global>{`
        .premiumHome {
          min-height: 100vh;
          padding: 24px 0 90px;
          color: #21142f;
          background:
            radial-gradient(circle at 10% 4%, rgba(124,58,237,.14), transparent 28%),
            radial-gradient(circle at 92% 2%, rgba(96,165,250,.10), transparent 25%),
            linear-gradient(180deg,#fff 0%,#faf7ff 52%,#f5effb 100%);
        }

        .hero {
          min-height: 610px;
          display: grid;
          grid-template-columns: 1.03fr .97fr;
          align-items: center;
          gap: 52px;
          padding: 56px;
          border: 1px solid rgba(124,58,237,.11);
          border-radius: 42px;
          background: rgba(255,255,255,.94);
          box-shadow: 0 28px 90px rgba(52,31,82,.10);
          overflow: hidden;
        }

        .heroPill,
        .sectionKicker {
          margin: 0;
          color: #6d28d9;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: .1em;
          text-transform: uppercase;
        }

        .hero h1 {
          max-width: 760px;
          margin: 18px 0;
          font-size: clamp(48px, 6.4vw, 78px);
          line-height: .98;
          letter-spacing: -.06em;
        }

        .hero h1 span {
          display: block;
          color: #7c3aed;
        }

        .heroLead {
          max-width: 700px;
          color: #6f6477;
          font-size: 18px;
          line-height: 1.75;
        }

        .heroActions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 28px;
        }

        .trustLine {
          display: flex;
          flex-wrap: wrap;
          gap: 12px 18px;
          margin-top: 26px;
          color: #62566a;
          font-size: 12px;
          font-weight: 800;
        }

        .learnerHero {
          position: relative;
          min-height: 470px;
          border-radius: 38px;
          background:
            radial-gradient(circle at 50% 36%, rgba(139,92,246,.24), transparent 37%),
            linear-gradient(135deg,#faf7ff,#f0e7ff);
          overflow: hidden;
        }

        .learnerGlow {
          position: absolute;
          inset: 70px 80px 40px;
          border-radius: 50%;
          border: 1px solid rgba(124,58,237,.16);
          box-shadow: 0 0 0 40px rgba(124,58,237,.04);
        }

        .kidIllustration {
          position: absolute;
          left: 50%;
          bottom: 25px;
          width: 290px;
          height: 360px;
          transform: translateX(-50%);
        }

        .kidHead {
          position: absolute;
          top: 12px;
          left: 88px;
          width: 114px;
          height: 114px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #8b5cf6;
          font-size: 70px;
          z-index: 2;
        }

        .kidBody {
          position: absolute;
          top: 112px;
          left: 55px;
          width: 180px;
          height: 170px;
          border-radius: 80px 80px 30px 30px;
          background: linear-gradient(180deg,#8b5cf6,#6d28d9);
        }

        .laptop {
          position: absolute;
          right: 4px;
          bottom: 18px;
          width: 180px;
          height: 120px;
          display: grid;
          place-items: center;
          border-radius: 14px 14px 7px 7px;
          background: linear-gradient(150deg,#fff,#e9e4f5);
          box-shadow: 0 18px 35px rgba(45,27,69,.18);
          transform: skewY(-3deg);
        }

        .laptop span {
          color: #7c3aed;
          font-size: 35px;
          font-weight: 950;
        }

        .book {
          position: absolute;
          left: 7px;
          bottom: 12px;
          width: 130px;
          height: 28px;
          border-radius: 50% 50% 8px 8px;
          background: #fff;
          box-shadow: 0 10px 20px rgba(45,27,69,.08);
        }

        .floatCard {
          position: absolute;
          display: grid;
          gap: 4px;
          padding: 14px 16px;
          border: 1px solid rgba(124,58,237,.11);
          border-radius: 18px;
          background: rgba(255,255,255,.94);
          box-shadow: 0 16px 40px rgba(47,26,73,.12);
        }

        .floatCard small {
          color: #74687c;
          font-weight: 800;
        }

        .floatCard strong {
          font-size: 17px;
        }

        .skillOne { top: 40px; left: 24px; }
        .skillTwo { top: 96px; right: 20px; }
        .skillThree { left: 30px; bottom: 68px; }

        .quickGrid {
          position: relative;
          z-index: 4;
          display: grid;
          grid-template-columns: repeat(4,minmax(0,1fr));
          margin-top: -22px;
          padding: 14px;
          border: 1px solid rgba(124,58,237,.1);
          border-radius: 28px;
          background: rgba(255,255,255,.97);
          box-shadow: 0 24px 70px rgba(47,26,73,.10);
        }

        .quickCard {
          min-height: 105px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 14px;
          padding: 18px;
          color: inherit;
          text-decoration: none;
          border-right: 1px solid #eee6f7;
        }

        .quickCard:last-child { border-right: 0; }

        .quickIcon {
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          background: #f5efff;
          font-size: 22px;
        }

        .quickCard strong { display:block; }
        .quickCard p {
          margin: 5px 0 0;
          color: #786d80;
          font-size: 12px;
          line-height: 1.45;
        }
        .quickCard b { color:#7c3aed; }

        .academies,
        .experience,
        .journeySection,
        .parentSection,
        .finalCta {
          margin-top: 86px;
        }

        .sectionTop {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 28px;
        }

        .sectionTop h2,
        .parentSection h2,
        .finalCta h2 {
          margin: 9px 0 0;
          font-size: clamp(34px,4.5vw,56px);
          line-height: 1.02;
          letter-spacing: -.05em;
        }

        .sectionTop > a {
          color:#6d28d9;
          text-decoration:none;
          font-weight:900;
        }

        .academyGrid {
          display: grid;
          grid-template-columns: repeat(3,minmax(0,1fr));
          gap: 18px;
        }

        .academyCard {
          min-height: 440px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid rgba(124,58,237,.10);
          border-radius: 28px;
          background: #fff;
          box-shadow: 0 16px 45px rgba(47,26,73,.07);
        }

        .academyVisual {
          position: relative;
          min-height: 150px;
          display: grid;
          place-items: center;
          background:
            radial-gradient(circle at 65% 25%,rgba(124,58,237,.13),transparent 34%),
            linear-gradient(135deg,#fff8e8,#f4efff);
        }

        .academyVisual > span:last-child { font-size: 58px; }

        .badge {
          position:absolute;
          left:16px;
          top:14px;
          padding:7px 10px;
          border-radius:999px;
          color:#fff;
          background:#c88a00;
          font-size:10px !important;
          font-weight:950;
          text-transform:uppercase;
        }

        .academyBody {
          display:flex;
          flex:1;
          flex-direction:column;
          padding:22px;
        }

        .academyBody h3 {
          margin:0;
          font-size:23px;
          letter-spacing:-.035em;
        }

        .academyBody p {
          color:#716678;
          line-height:1.6;
          font-size:14px;
        }

        .academyBody strong {
          margin-top:auto;
          color:#6d28d9;
          font-size:12px;
        }

        .academyCard > a {
          margin: 0 18px 18px;
          min-height:50px;
          display:grid;
          place-items:center;
          border-radius:16px;
          color:#fff;
          background:linear-gradient(135deg,#7c3aed,#6d28d9);
          text-decoration:none;
          font-weight:900;
        }

        .secondaryAcademies {
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:14px;
          margin-top:18px;
        }

        .secondaryAcademies a {
          display:grid;
          grid-template-columns:auto 1fr auto;
          align-items:center;
          gap:15px;
          padding:18px 20px;
          color:inherit;
          background:#fff;
          border:1px solid rgba(124,58,237,.1);
          border-radius:22px;
          text-decoration:none;
        }

        .secondaryAcademies a > span { font-size:28px; }
        .secondaryAcademies strong,
        .secondaryAcademies small { display:block; }
        .secondaryAcademies small { margin-top:4px; color:#756a7c; }
        .secondaryAcademies b { color:#7c3aed; }

        .experienceGrid {
          display:grid;
          grid-template-columns:repeat(5,minmax(0,1fr));
          gap:14px;
          margin-top:30px;
        }

        .experienceGrid article {
          min-height:210px;
          padding:22px;
          border-radius:24px;
          background:#fff;
          border:1px solid rgba(124,58,237,.09);
        }

        .experienceGrid article > span {
          width:48px;
          height:48px;
          display:grid;
          place-items:center;
          border-radius:15px;
          background:#f4edff;
          font-size:22px;
        }

        .experienceGrid strong {
          display:block;
          margin-top:22px;
        }

        .experienceGrid p {
          color:#756a7c;
          font-size:13px;
          line-height:1.6;
        }

        .journeyWrap { margin-top:30px; }

        .parentSection {
          display:grid;
          grid-template-columns:.9fr 1.1fr;
          gap:48px;
          padding:48px;
          border-radius:36px;
          background:#fff;
          border:1px solid rgba(124,58,237,.09);
          box-shadow:0 22px 60px rgba(47,26,73,.08);
        }

        .parentSection h2 span {
          display:block;
          color:#7c3aed;
        }

        .parentSection > div:first-child > p:last-child {
          color:#716678;
          font-size:17px;
          line-height:1.7;
        }

        .parentCards {
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:12px;
        }

        .parentCards article {
          min-height:150px;
          padding:22px;
          border-radius:22px;
          background:#f8f4ff;
        }

        .parentCards strong,
        .parentCards span { display:block; }
        .parentCards span {
          margin-top:10px;
          color:#74697c;
          line-height:1.55;
          font-size:13px;
        }

        .finalCta {
          padding:64px 28px;
          text-align:center;
          border-radius:38px;
          background:
            radial-gradient(circle at 50% 0%,rgba(124,58,237,.19),transparent 38%),
            #fff;
          border:1px solid rgba(124,58,237,.1);
        }

        .finalCta > p {
          margin:0;
          color:#7c3aed;
          font-weight:900;
          text-transform:uppercase;
          letter-spacing:.08em;
        }

        .finalCta > div {
          display:flex;
          justify-content:center;
          flex-wrap:wrap;
          gap:12px;
          margin-top:24px;
        }

        @media (max-width: 1020px) {
          .hero,
          .parentSection { grid-template-columns:1fr; }
          .quickGrid { grid-template-columns:repeat(2,minmax(0,1fr)); }
          .academyGrid { grid-template-columns:repeat(2,minmax(0,1fr)); }
          .experienceGrid { grid-template-columns:repeat(2,minmax(0,1fr)); }
          .quickCard:nth-child(2) { border-right:0; }
        }

        @media (max-width: 640px) {
          .premiumHome { padding-top:12px; }
          .hero { padding:30px 20px; border-radius:28px; gap:30px; }
          .hero h1 { font-size:44px; }
          .learnerHero { min-height:390px; }
          .kidIllustration { transform:translateX(-50%) scale(.82); transform-origin:bottom center; }
          .skillOne { top:20px; left:12px; }
          .skillTwo { top:70px; right:10px; }
          .skillThree { bottom:30px; left:12px; }
          .quickGrid,
          .academyGrid,
          .secondaryAcademies,
          .experienceGrid,
          .parentCards { grid-template-columns:1fr; }
          .quickGrid { margin-top:18px; }
          .quickCard { border-right:0; border-bottom:1px solid #eee6f7; }
          .quickCard:last-child { border-bottom:0; }
          .sectionTop { align-items:flex-start; flex-direction:column; }
          .parentSection { padding:30px 20px; }
        }
      `}</style>
    </main>
  );
}
