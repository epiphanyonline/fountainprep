"use client";

import Link from "next/link";
import SupportWidget from "./components/SupportWidget";

const trustItems = [
  "African language specialists",
  "Academic excellence",
  "Progress reports after every lesson",
  "Learn from anywhere",
];

const features = [
  {
    icon: "👨‍🏫",
    title: "Private one-to-one lessons",
    text: "No crowded group classes. Every lesson is focused on one child, one tutor and one learning goal.",
  },
  {
    icon: "📈",
    title: "Progress parents can see",
    text: "Parents receive clearer updates on what was taught, what improved and what the next lesson will focus on.",
  },
  {
    icon: "🧭",
    title: "Structured learning",
    text: "Lessons follow clear learning pathways, so tutoring feels purposeful rather than random.",
  },
  {
    icon: "🌍",
    title: "Learn from anywhere",
    text: "Children can learn online with experienced tutors wherever your family lives.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create or log in to your parent account",
    text: "Your booking stays connected to one secure parent account from start to finish.",
  },
  {
    number: "02",
    title: "Add or choose your child",
    text: "Tell us their age and school level so we can show suitable learning options.",
  },
  {
    number: "03",
    title: "Choose a subject and plan",
    text: "Select the support they need and choose one or two private lessons each week.",
  },
  {
    number: "04",
    title: "Choose a tutor and timetable",
    text: "Pick the first lesson date. The same day and time then repeats weekly.",
  },
  {
    number: "05",
    title: "Review and pay securely",
    text: "Check the full booking summary before continuing to secure Stripe checkout.",
  },
  {
    number: "06",
    title: "See lessons and progress",
    text: "The confirmed timetable and learning updates appear in your parent dashboard.",
  },
];

const languagePaths = [
  {
    title: "Yoruba",
    text: "Help your child speak confidently with family and stay connected to their roots.",
  },
  {
    title: "Igbo",
    text: "Build vocabulary, pronunciation and cultural confidence through private lessons.",
  },
  {
    title: "Hausa",
    text: "Develop practical communication skills with experienced language tutors.",
  },
];

const academicSubjects = ["Maths", "English", "Science", "Coding", "Music"];

const promiseItems = [
  "One-to-one teaching",
  "Lesson attendance",
  "Homework support",
  "Progress report",
  "Next lesson objectives",
  "Parent updates",
];

export default function HomePage() {
  return (
    <main className="fp-page">
      <section className="fp-hero">
        <div className="fp-hero-copy">
          <div className="fp-pill">
            <span />
            Premium one-to-one online tutoring
          </div>

          <h1>The learning partner for families around the world.</h1>

          <p className="fp-lead">
            Connecting children to their language, culture and academic success
            through premium one-to-one online tutoring.
          </p>

          <div className="fp-actions">
            <Link href="/start" className="fp-primary">
              Start Booking
            </Link>

            <Link href="/subjects" className="fp-secondary">
              Browse Subjects First
            </Link>
          </div>

          <div className="fp-trust">
            {trustItems.map((item) => (
              <div key={item}>✓ {item}</div>
            ))}
          </div>
        </div>

        <div className="fp-hero-image-wrap">
          <img
            src="/yoruba-tutoring.png"
            alt="Child learning online with a private tutor"
            className="fp-hero-image"
          />

          <div className="fp-float fp-float-top">
            <strong>1-to-1 lesson</strong>
            <span>No crowded group class</span>
          </div>

          <div className="fp-float fp-float-bottom">
            <strong>Parent update</strong>
            <span>Know what your child learned</span>
          </div>
        </div>
      </section>

      <section className="fp-choice">
        <div className="fp-section-head centered">
          <p>Start here</p>
          <h2>What would you like your child to learn today?</h2>
        </div>

        <div className="fp-choice-grid">
          <article className="fp-choice-card">
            <div className="fp-choice-icon">🌍</div>
            <h3>African Languages</h3>
            <p>
              Preserve your family’s language and culture through engaging
              private lessons.
            </p>

            <div className="fp-mini-list">
              <span>Yoruba</span>
              <span>Igbo</span>
              <span>Hausa</span>
            </div>

            <em>More African languages coming soon.</em>

            <Link href="/subjects?category=Language" className="fp-card-link">
              Explore African Languages →
            </Link>
          </article>

          <article className="fp-choice-card">
            <div className="fp-choice-icon">📚</div>
            <h3>Academic Subjects</h3>
            <p>
              Build confidence and improve school performance with structured
              private tutoring.
            </p>

            <div className="fp-mini-list">
              <span>Maths</span>
              <span>English</span>
              <span>Science</span>
              <span>Coding</span>
              <span>Music</span>
            </div>

            <em>More academic subjects coming soon.</em>

            <Link
              href="/subjects?category=Academic"
              className="fp-card-link secondary"
            >
              Explore Subjects →
            </Link>
          </article>
        </div>
      </section>

      <section className="fp-proof">
        <div>
          <strong>Private</strong>
          <span>Every lesson is focused on one child.</span>
        </div>
        <div>
          <strong>Structured</strong>
          <span>Lessons follow clear learning pathways.</span>
        </div>
        <div>
          <strong>Visible</strong>
          <span>Parents can follow progress more clearly.</span>
        </div>
      </section>

      <section className="fp-section">
        <div className="fp-section-head">
          <p>Why parents choose Fountain Prep</p>
          <h2>Visible value from every private lesson.</h2>
        </div>

        <div className="fp-feature-grid">
          {features.map((feature) => (
            <article className="fp-card" key={feature.title}>
              <div className="fp-feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="fp-section">
        <div className="fp-section-head centered">
          <p>Simple parent journey</p>
          <h2>One clear next step, all the way to payment.</h2>
        </div>

        <div className="fp-step-grid">
          {steps.map((step) => (
            <article className="fp-step" key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="fp-learning-paths">
        <div className="fp-section-head">
          <p>Featured learning paths</p>
          <h2>African languages and academic confidence in one platform.</h2>
        </div>

        <div className="fp-path-split">
          <div className="fp-path-panel">
            <div className="fp-path-top">
              <span>🌍</span>
              <div>
                <h3>African Languages</h3>
                <p>Available now</p>
              </div>
            </div>

            <div className="fp-path-list">
              {languagePaths.map((item) => (
                <article key={item.title}>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                  <small>Lessons from £9 per class</small>
                </article>
              ))}
            </div>

            <Link href="/subjects?category=Language" className="fp-wide-link">
              Explore language lessons →
            </Link>
          </div>

          <div className="fp-path-panel">
            <div className="fp-path-top">
              <span>📚</span>
              <div>
                <h3>Academic Subjects</h3>
                <p>Structured private support</p>
              </div>
            </div>

            <div className="fp-subject-grid">
              {academicSubjects.map((subject) => (
                <Link
                  href={`/subjects?category=${subject === "Coding" || subject === "Music" ? "Skill" : "Academic"}&subject=${encodeURIComponent(subject)}`}
                  key={subject}
                  className="fp-subject"
                >
                  {subject}
                </Link>
              ))}
            </div>

            <div className="fp-price-note">
              <strong>Lessons from £9 per class</strong>
              <span>Private one-to-one lessons with progress visibility.</span>
            </div>

            <Link
              href="/subjects?category=Academic"
              className="fp-wide-link secondary"
            >
              Explore academic tutoring →
            </Link>
          </div>
        </div>
      </section>

      <section className="fp-value">
        <div>
          <p>The Fountain Prep Promise</p>
          <h2>Every lesson should give parents confidence.</h2>
          <span>
            Parents want to know that tutoring is making a difference. Fountain
            Prep combines private teaching, curriculum structure and progress
            visibility so every lesson feels purposeful.
          </span>

          <div className="fp-promise-grid">
            {promiseItems.map((item) => (
              <div key={item}>✓ {item}</div>
            ))}
          </div>
        </div>

        <div className="fp-report">
          <div className="fp-report-top">
            <strong>Lesson progress update</strong>
            <span>After class</span>
          </div>

          <div className="fp-report-row">
            <b>Covered today</b>
            <span>Reading practice, vocabulary and pronunciation</span>
          </div>

          <div className="fp-report-row">
            <b>Improved</b>
            <span>Confidence answering questions</span>
          </div>

          <div className="fp-report-row">
            <b>Next focus</b>
            <span>Fluency and sentence building</span>
          </div>
        </div>
      </section>

      <section className="fp-support-strip">
        <div>
          <p>Need help before booking?</p>
          <h2>Use the in-app support chat.</h2>
          <span>
            Parents, tutors and visitors can reach Fountain Prep through the
            support button on this page. Replies are handled securely through
            our support inbox.
          </span>
        </div>

        <button
          type="button"
          className="fp-support-hint"
          onClick={() => {
            const supportButton =
              document.querySelector<HTMLButtonElement>(".supportButton");
            supportButton?.click();
          }}
        >
          Open Support
        </button>
      </section>

      <section className="fp-final">
        <p>Fountain Prep</p>
        <h2>The learning partner for families around the world.</h2>
        <span>
          Whether your goal is preserving your family’s language, strengthening
          cultural identity or helping your child succeed academically, Fountain
          Prep is here to support every step of the journey.
        </span>

        <div className="fp-actions centered-actions">
          <Link href="/start" className="fp-primary">
            Start Booking
          </Link>
          <Link href="/subjects" className="fp-secondary">
            Browse Subjects First
          </Link>
        </div>
      </section>

      <style jsx global>{`
        .fp-page {
          min-height: 100vh;
          color: #201230;
          background:
            radial-gradient(
              circle at 10% 0%,
              rgba(124, 58, 237, 0.12),
              transparent 30%
            ),
            radial-gradient(
              circle at 90% 6%,
              rgba(236, 72, 153, 0.08),
              transparent 28%
            ),
            linear-gradient(180deg, #fffaff 0%, #fbf7ff 44%, #f5edff 100%);
          padding: 22px 16px 80px;
          overflow: hidden;
        }

        .fp-hero,
        .fp-choice,
        .fp-proof,
        .fp-section,
        .fp-learning-paths,
        .fp-value,
        .fp-support-strip,
        .fp-final {
          width: min(1160px, 100%);
          margin-left: auto;
          margin-right: auto;
        }

        .fp-hero {
          display: grid;
          grid-template-columns: 0.95fr 1.05fr;
          gap: 34px;
          align-items: center;
          padding: 34px;
          border-radius: 38px;
          border: 1px solid rgba(124, 58, 237, 0.12);
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.98),
              rgba(249, 244, 255, 0.94)
            ),
            radial-gradient(
              circle at top right,
              rgba(124, 58, 237, 0.16),
              transparent 34%
            );
          box-shadow: 0 28px 90px rgba(52, 30, 83, 0.12);
        }

        .fp-pill {
          width: fit-content;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 10px 15px;
          border-radius: 999px;
          color: #6d28d9;
          background: rgba(124, 58, 237, 0.1);
          border: 1px solid rgba(124, 58, 237, 0.1);
          font-size: 14px;
          font-weight: 900;
          margin-bottom: 22px;
        }

        .fp-pill span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #7c3aed;
          box-shadow: 0 0 0 6px rgba(124, 58, 237, 0.15);
        }

        .fp-hero h1,
        .fp-section h2,
        .fp-choice h2,
        .fp-learning-paths h2,
        .fp-value h2,
        .fp-support-strip h2,
        .fp-final h2 {
          margin: 0;
          color: #1f1230;
          font-weight: 950;
          letter-spacing: -0.055em;
        }

        .fp-hero h1 {
          max-width: 670px;
          font-size: clamp(42px, 5.2vw, 72px);
          line-height: 0.96;
        }

        .fp-lead {
          max-width: 620px;
          margin: 22px 0 0;
          color: #655a76;
          font-size: 17px;
          line-height: 1.75;
          font-weight: 520;
        }

        .fp-actions {
          display: flex;
          gap: 13px;
          flex-wrap: wrap;
          margin-top: 28px;
        }

        .fp-primary,
        .fp-secondary,
        .fp-card-link,
        .fp-wide-link {
          min-height: 56px;
          padding: 0 26px;
          border-radius: 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-size: 15px;
          font-weight: 950;
        }

        .fp-primary,
        .fp-card-link,
        .fp-wide-link {
          color: #fff;
          background: linear-gradient(135deg, #7c3aed, #5b21b6);
          box-shadow: 0 18px 42px rgba(109, 40, 217, 0.28);
        }

        .fp-secondary,
        .fp-card-link.secondary,
        .fp-wide-link.secondary {
          color: #241535;
          background: #fff;
          border: 1px solid rgba(124, 58, 237, 0.16);
          box-shadow: 0 14px 34px rgba(55, 35, 95, 0.06);
        }

        .fp-browse-note {
          margin: 14px 0 0;
          color: #6b5b7a;
          font-size: 14px;
          font-weight: 850;
        }

        .fp-trust {
          margin-top: 22px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .fp-trust div {
          padding: 10px 13px;
          border-radius: 999px;
          color: #574764;
          background: rgba(255, 255, 255, 0.82);
          border: 1px solid rgba(124, 58, 237, 0.08);
          font-size: 13px;
          font-weight: 850;
        }

        .fp-hero-image-wrap {
          position: relative;
          height: 560px;
          border-radius: 32px;
          overflow: hidden;
          background: #eee7f7;
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 30px 82px rgba(47, 25, 80, 0.19);
        }

        .fp-hero-image {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          object-position: center;
        }

        .fp-hero-image-wrap::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(25, 14, 38, 0.28),
            transparent 50%
          );
          pointer-events: none;
        }

        .fp-float {
          position: absolute;
          z-index: 2;
          padding: 14px 16px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.93);
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 18px 44px rgba(31, 18, 48, 0.18);
          backdrop-filter: blur(16px);
        }

        .fp-float strong,
        .fp-float span {
          display: block;
        }

        .fp-float strong {
          color: #241535;
          font-size: 14.5px;
          font-weight: 950;
        }

        .fp-float span {
          margin-top: 5px;
          color: #655a76;
          font-size: 12.5px;
          font-weight: 760;
        }

        .fp-float-top {
          top: 20px;
          right: 20px;
        }

        .fp-float-bottom {
          left: 20px;
          bottom: 20px;
        }

        .fp-choice,
        .fp-section,
        .fp-learning-paths {
          margin-top: 78px;
        }

        .fp-section-head {
          max-width: 780px;
        }

        .fp-section-head.centered {
          text-align: center;
          margin: 0 auto;
        }

        .fp-section-head p,
        .fp-choice p,
        .fp-learning-paths p,
        .fp-value p,
        .fp-support-strip p,
        .fp-final p {
          margin: 0 0 10px;
          color: #6d28d9;
          font-size: 14px;
          font-weight: 950;
        }

        .fp-section h2,
        .fp-choice h2,
        .fp-learning-paths h2,
        .fp-value h2,
        .fp-support-strip h2,
        .fp-final h2 {
          font-size: clamp(34px, 4.3vw, 56px);
          line-height: 1.04;
        }

        .fp-choice-grid {
          margin-top: 26px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
        }

        .fp-choice-card,
        .fp-card,
        .fp-step,
        .fp-report,
        .fp-path-panel,
        .fp-proof div,
        .fp-value,
        .fp-support-strip,
        .fp-final {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(124, 58, 237, 0.1);
          box-shadow: 0 18px 48px rgba(55, 35, 95, 0.07);
        }

        .fp-choice-card {
          padding: 30px;
          border-radius: 32px;
        }

        .fp-choice-icon,
        .fp-feature-icon {
          width: 54px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 18px;
          background: #f3eaff;
          font-size: 28px;
          margin-bottom: 18px;
        }

        .fp-choice-card h3,
        .fp-path-panel h3 {
          margin: 0;
          color: #241535;
          font-size: 28px;
          letter-spacing: -0.04em;
          font-weight: 950;
        }

        .fp-choice-card p {
          margin: 12px 0 0;
          color: #6d647c;
          font-size: 16px;
          line-height: 1.7;
        }

        .fp-mini-list {
          margin-top: 18px;
          display: flex;
          gap: 9px;
          flex-wrap: wrap;
        }

        .fp-mini-list span {
          padding: 9px 12px;
          border-radius: 999px;
          background: #f5efff;
          color: #4c1d95;
          font-weight: 900;
          font-size: 13px;
        }

        .fp-choice-card em {
          margin-top: 16px;
          display: block;
          color: #7a6d85;
          font-style: normal;
          font-weight: 800;
        }

        .fp-card-link {
          width: 100%;
          margin-top: 22px;
        }

        .fp-proof {
          margin-top: 18px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .fp-proof div {
          padding: 20px;
          border-radius: 24px;
        }

        .fp-proof strong {
          display: block;
          font-size: 18px;
          color: #241535;
          font-weight: 950;
        }

        .fp-proof span {
          display: block;
          margin-top: 6px;
          color: #6d647c;
          line-height: 1.55;
        }

        .fp-feature-grid {
          margin-top: 26px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .fp-card,
        .fp-step {
          border-radius: 28px;
          padding: 25px;
        }

        .fp-card h3,
        .fp-step h3,
        .fp-report strong {
          margin: 0;
          color: #241535;
          font-size: 21px;
          font-weight: 950;
          letter-spacing: -0.025em;
        }

        .fp-card p,
        .fp-step p {
          margin: 12px 0 0;
          color: #6d647c;
          font-size: 15.5px;
          line-height: 1.68;
        }

        .fp-step-grid {
          margin-top: 26px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .fp-step span {
          display: inline-flex;
          margin-bottom: 18px;
          color: #6d28d9;
          font-size: 24px;
          font-weight: 950;
        }

        .fp-path-split {
          margin-top: 26px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        .fp-path-panel {
          border-radius: 34px;
          padding: 28px;
        }

        .fp-path-top {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
        }

        .fp-path-top span {
          width: 54px;
          height: 54px;
          border-radius: 18px;
          background: #f3eaff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
        }

        .fp-path-top p {
          margin: 4px 0 0;
          color: #6d28d9;
          font-size: 13px;
          font-weight: 900;
        }

        .fp-path-list {
          display: grid;
          gap: 12px;
        }

        .fp-path-list article {
          padding: 18px;
          border-radius: 22px;
          background: #fff;
          border: 1px solid rgba(124, 58, 237, 0.1);
        }

        .fp-path-list strong {
          display: block;
          font-size: 20px;
          color: #241535;
          font-weight: 950;
        }

        .fp-path-list p {
          margin: 8px 0 0;
          color: #6d647c;
          line-height: 1.6;
          font-weight: 500;
        }

        .fp-path-list small {
          display: inline-flex;
          margin-top: 12px;
          color: #6d28d9;
          font-weight: 950;
          font-size: 13px;
        }

        .fp-subject-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .fp-subject {
          min-height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 18px;
          color: #2a1640;
          background: #fff;
          text-decoration: none;
          font-weight: 950;
          border: 1px solid rgba(124, 58, 237, 0.1);
          box-shadow: 0 12px 28px rgba(55, 35, 95, 0.05);
        }

        .fp-price-note {
          margin-top: 18px;
          padding: 18px;
          border-radius: 22px;
          background: #f7f1ff;
          border: 1px solid #e5d8ff;
        }

        .fp-price-note strong,
        .fp-price-note span {
          display: block;
        }

        .fp-price-note span {
          margin-top: 5px;
          color: #6d647c;
        }

        .fp-wide-link {
          width: 100%;
          margin-top: 18px;
        }

        .fp-value {
          margin-top: 78px;
          display: grid;
          grid-template-columns: 1fr 0.9fr;
          gap: 26px;
          align-items: center;
          padding: 38px;
          border-radius: 38px;
          background:
            radial-gradient(
              circle at top right,
              rgba(124, 58, 237, 0.14),
              transparent 34%
            ),
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.96),
              rgba(246, 239, 255, 0.95)
            );
        }

        .fp-value span {
          display: block;
          margin-top: 18px;
          color: #6d647c;
          font-size: 16.5px;
          line-height: 1.75;
        }

        .fp-promise-grid {
          margin-top: 22px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .fp-promise-grid div {
          padding: 11px 13px;
          border-radius: 16px;
          background: #fff;
          color: #574764;
          font-size: 13px;
          font-weight: 900;
          border: 1px solid rgba(124, 58, 237, 0.08);
        }

        .fp-report {
          border-radius: 28px;
          padding: 24px;
        }

        .fp-report-top {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(124, 58, 237, 0.12);
        }

        .fp-report-top span {
          margin: 0;
          color: #6d28d9;
          font-size: 13px;
          font-weight: 900;
        }

        .fp-report-row {
          padding-top: 16px;
        }

        .fp-report-row b {
          display: block;
          color: #241535;
          font-size: 14px;
        }

        .fp-report-row span {
          margin-top: 4px;
          display: block;
          color: #6d647c;
          font-size: 14.5px;
          line-height: 1.55;
        }

        .fp-support-strip,
        .fp-final {
          margin-top: 78px;
          border-radius: 38px;
          padding: 38px;
          background:
            radial-gradient(
              circle at top right,
              rgba(124, 58, 237, 0.13),
              transparent 36%
            ),
            linear-gradient(135deg, #ffffff, #f5efff);
        }

        .fp-support-strip {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 24px;
          align-items: center;
        }

        .fp-support-strip span {
          display: block;
          margin-top: 16px;
          color: #6d647c;
          font-size: 16px;
          line-height: 1.7;
        }

        .fp-support-hint {
          border: 0;
          min-height: 56px;
          padding: 0 24px;
          border-radius: 18px;
          color: #fff;
          background: linear-gradient(135deg, #7c3aed, #5b21b6);
          box-shadow: 0 18px 42px rgba(109, 40, 217, 0.24);
          font-weight: 950;
          cursor: pointer;
          white-space: nowrap;
        }

        .fp-final {
          text-align: center;
        }

        .fp-final h2 {
          max-width: 820px;
          margin: 0 auto;
        }

        .fp-final span {
          display: block;
          max-width: 700px;
          margin: 18px auto 0;
          color: #6d647c;
          font-size: 17px;
          line-height: 1.75;
        }

        .centered-actions {
          justify-content: center;
        }

        @media (max-width: 980px) {
          .fp-page {
            padding: 14px 10px 64px;
          }

          .fp-hero {
            grid-template-columns: 1fr;
            padding: 20px;
            gap: 24px;
            border-radius: 30px;
          }

          .fp-hero h1 {
            font-size: clamp(38px, 10.4vw, 50px);
            line-height: 1;
            letter-spacing: -0.058em;
          }

          .fp-lead {
            font-size: 15.8px;
            line-height: 1.72;
          }

          .fp-actions {
            flex-direction: column;
          }

          .fp-primary,
          .fp-secondary {
            width: 100%;
            min-height: 56px;
          }

          .fp-trust {
            display: grid;
            grid-template-columns: 1fr;
          }

          .fp-trust div {
            text-align: center;
            border-radius: 16px;
          }

          .fp-hero-image-wrap {
            height: 365px;
            border-radius: 26px;
          }

          .fp-hero-image {
            object-position: 52% center;
          }

          .fp-float-top {
            top: 12px;
            right: 12px;
          }

          .fp-float-bottom {
            left: 12px;
            right: 12px;
            bottom: 12px;
          }

          .fp-choice,
          .fp-section,
          .fp-learning-paths,
          .fp-value,
          .fp-support-strip,
          .fp-final {
            margin-top: 56px;
          }

          .fp-choice-grid,
          .fp-proof,
          .fp-feature-grid,
          .fp-step-grid,
          .fp-path-split,
          .fp-value,
          .fp-support-strip {
            grid-template-columns: 1fr;
          }

          .fp-value,
          .fp-choice-card,
          .fp-path-panel,
          .fp-support-strip,
          .fp-final {
            padding: 24px 20px;
            border-radius: 30px;
          }

          .fp-section h2,
          .fp-choice h2,
          .fp-learning-paths h2,
          .fp-value h2,
          .fp-support-strip h2,
          .fp-final h2 {
            font-size: clamp(31px, 8.6vw, 42px);
            line-height: 1.06;
          }

          .fp-card,
          .fp-step,
          .fp-proof div,
          .fp-report {
            border-radius: 24px;
            padding: 21px;
          }

          .fp-subject-grid,
          .fp-promise-grid {
            grid-template-columns: 1fr;
          }

          .fp-support-hint {
            width: 100%;
          }
        }

        @media (max-width: 380px) {
          .fp-hero h1 {
            font-size: 36px;
          }

          .fp-hero-image-wrap {
            height: 335px;
          }
        }
      `}</style>

      <SupportWidget />
    </main>
  );
}
