"use client";

import Link from "next/link";

type Academy = {
  id: string;
  title: string;
  tagline: string;
  icon: string;
  href?: string;
  status: "available" | "coming-soon";
  className: string;
};

const academies: Academy[] = [
  {
    id: "languages",
    title: "Language Academy",
    tagline:
      "Speak confidently, connect with culture and communicate across the world.",
    icon: "🌍",
    href: "/fountaintalk/tutor",
    status: "available",
    className: "academy-languages",
  },
  {
    id: "coding",
    title: "Coding Academy",
    tagline:
      "Build logic, games, websites and real software from childhood onward.",
    icon: "💻",
    status: "coming-soon",
    className: "academy-coding",
  },
  {
    id: "music",
    title: "Music Academy",
    tagline:
      "Discover rhythm, instruments, music theory, performance and production.",
    icon: "🎵",
    status: "coming-soon",
    className: "academy-music",
  },
  {
    id: "wealth",
    title: "Wealth Academy",
    tagline:
      "Learn saving, budgeting, investing, business and lifelong wealth skills.",
    icon: "💰",
    status: "coming-soon",
    className: "academy-wealth",
  },
  {
    id: "ethics",
    title: "Ethics Academy",
    tagline:
      "Explore kindness, responsibility, leadership and wise decision-making.",
    icon: "⚖️",
    status: "coming-soon",
    className: "academy-ethics",
  },
  {
    id: "bible",
    title: "Bible Academy",
    tagline:
      "Experience timeless stories, values and faith through engaging lessons.",
    icon: "📖",
    href: "/fountaintalk/bible",
    status: "available",
    className: "academy-bible",
  },
];

export default function LearnWithAyoHome() {
  return (
    <main className="ayo-home">
      <section className="ayo-shell">
        <header className="ayo-topbar">
          <Link href="/" className="ayo-company">
            Fountain <span>Prep</span>
          </Link>

          <div className="ayo-top-actions">
            <Link
              href="/fountaintalk/progress"
              className="ayo-progress-link"
            >
              My progress
            </Link>

            <div className="ayo-avatar-small" aria-hidden="true">
              A
            </div>
          </div>
        </header>

        <section className="ayo-hero">
          <div className="ayo-hero-copy">
            <div className="ayo-eyebrow">
              <span className="ayo-live-dot" />
              Your lifelong learning companion
            </div>

            <p className="ayo-product-name">
              Learn with <strong>AYO</strong>
            </p>

            <h1>
              Learning that grows
              <span> with you.</span>
            </h1>

            <p className="ayo-hero-text">
              Explore languages, coding, music, money, ethics and
              more through structured, engaging learning journeys
              designed for children, teenagers and adults.
            </p>

            <div className="ayo-hero-actions">
              <Link
                href="/fountaintalk/tutor"
                className="ayo-primary-button"
              >
                Enter your classroom
                <span>→</span>
              </Link>

              <a
                href="#academies"
                className="ayo-secondary-button"
              >
                Explore academies
              </a>
            </div>

            <div className="ayo-trust-row">
              <span>✓ Structured curriculum</span>
              <span>✓ Personalised learning</span>
              <span>✓ Progress that follows you</span>
            </div>
          </div>

          <div className="ayo-hero-visual">
            <div className="ayo-orbit ayo-orbit-one" />
            <div className="ayo-orbit ayo-orbit-two" />

            <div className="ayo-mentor-card">
              <div className="ayo-mentor-label">
                Meet your tutor
              </div>

              <div className="ayo-portrait-placeholder">
                <span>AYO</span>
                <small>Your portrait will appear here</small>
              </div>

              <div className="ayo-mentor-copy">
                <strong>Ayo is ready when you are.</strong>
                <p>
                  Enter the classroom for your next guided lesson.
                </p>
              </div>

              <Link
                href="/fountaintalk/tutor"
                className="ayo-mentor-button"
              >
                Meet Ayo in class
              </Link>
            </div>

            <div className="ayo-floating-card ayo-floating-streak">
              <span>🔥</span>
              <div>
                <strong>4-day streak</strong>
                <small>Keep going</small>
              </div>
            </div>

            <div className="ayo-floating-card ayo-floating-progress">
              <span>82%</span>
              <div>
                <strong>Weekly goal</strong>
                <small>Nearly complete</small>
              </div>
            </div>
          </div>
        </section>

        <section className="ayo-continue">
          <div className="ayo-continue-icon">▶</div>

          <div className="ayo-continue-copy">
            <span>Continue learning</span>
            <h2>Yoruba Foundations</h2>
            <p>Unit 1 · Greetings and introductions</p>
          </div>

          <div className="ayo-course-progress">
            <div className="ayo-progress-label">
              <span>Course progress</span>
              <strong>18%</strong>
            </div>

            <div className="ayo-progress-track">
              <div className="ayo-progress-fill" />
            </div>
          </div>

          <Link
            href="/fountaintalk/tutor"
            className="ayo-continue-button"
          >
            Continue
            <span>→</span>
          </Link>
        </section>

        <section id="academies" className="ayo-academies">
          <div className="ayo-section-heading">
            <div>
              <span>Choose your journey</span>
              <h2>Explore the AYO Academies</h2>
            </div>

            <p>
              One trusted tutor. Many subjects. A learning journey
              that can begin in childhood and continue throughout
              life.
            </p>
          </div>

          <div className="ayo-academy-grid">
            {academies.map((academy) => {
              const content = (
                <>
                  <div className="ayo-academy-top">
                    <div className="ayo-academy-icon">
                      {academy.icon}
                    </div>

                    <span
                      className={
                        academy.status === "available"
                          ? "ayo-status available"
                          : "ayo-status"
                      }
                    >
                      {academy.status === "available"
                        ? "Available"
                        : "Coming soon"}
                    </span>
                  </div>

                  <div className="ayo-academy-copy">
                    <h3>{academy.title}</h3>
                    <p>{academy.tagline}</p>
                  </div>

                  <div className="ayo-academy-footer">
                    <span>
                      {academy.status === "available"
                        ? "Start learning"
                        : "Join the journey soon"}
                    </span>

                    <strong>→</strong>
                  </div>
                </>
              );

              if (academy.href) {
                return (
                  <Link
                    key={academy.id}
                    href={academy.href}
                    className={`ayo-academy-card ${academy.className}`}
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <article
                  key={academy.id}
                  className={`ayo-academy-card ${academy.className} is-coming-soon`}
                >
                  {content}
                </article>
              );
            })}
          </div>
        </section>

        <section className="ayo-age-journey">
          <div className="ayo-age-copy">
            <span>Learning for every stage</span>

            <h2>
              Start young.
              <br />
              Keep progressing.
            </h2>

            <p>
              Learn with AYO adapts the curriculum, teaching style,
              visuals and challenge level as each learner grows.
            </p>

            <Link
              href="/fountaintalk/tutor"
              className="ayo-dark-button"
            >
              Begin the journey
              <span>→</span>
            </Link>
          </div>

          <div className="ayo-stage-list">
            <div className="ayo-stage-card">
              <span>01</span>
              <div>
                <strong>Early explorers</strong>
                <p>Ages 3–5 · Stories, sound, play and discovery</p>
              </div>
            </div>

            <div className="ayo-stage-card">
              <span>02</span>
              <div>
                <strong>Young learners</strong>
                <p>Ages 6–9 · Confidence, creativity and foundations</p>
              </div>
            </div>

            <div className="ayo-stage-card">
              <span>03</span>
              <div>
                <strong>Growing minds</strong>
                <p>Ages 10–13 · Skills, projects and independence</p>
              </div>
            </div>

            <div className="ayo-stage-card">
              <span>04</span>
              <div>
                <strong>Future ready</strong>
                <p>Teen and adult · Mastery, careers and life skills</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="ayo-footer">
          <div>
            <strong>Learn with AYO</strong>
            <span>Powered by Fountain Prep</span>
          </div>

          <p>
            Premium, structured and adaptive learning for every
            stage of life.
          </p>
        </footer>
      </section>

      <style jsx global>{`
        .ayo-home {
          min-height: 100vh;
          color: #171126;
          background:
            radial-gradient(
              circle at 8% 4%,
              rgba(124, 58, 237, 0.16),
              transparent 26%
            ),
            radial-gradient(
              circle at 92% 12%,
              rgba(236, 72, 153, 0.1),
              transparent 24%
            ),
            linear-gradient(
              180deg,
              #fdfbff 0%,
              #f7f2ff 48%,
              #f0e9fb 100%
            );
          overflow: hidden;
        }

        .ayo-shell {
          width: min(1240px, 100%);
          margin: 0 auto;
          padding: 0 24px 60px;
        }

        .ayo-topbar {
          min-height: 82px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .ayo-company {
          color: #211532;
          font-size: 23px;
          font-weight: 950;
          letter-spacing: -0.045em;
        }

        .ayo-company span {
          color: #7c3aed;
        }

        .ayo-top-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ayo-progress-link {
          padding: 11px 16px;
          border-radius: 14px;
          color: #4d405b;
          background: rgba(255, 255, 255, 0.75);
          border: 1px solid rgba(124, 58, 237, 0.11);
          font-size: 14px;
          font-weight: 850;
          backdrop-filter: blur(14px);
        }

        .ayo-avatar-small {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: white;
          background: linear-gradient(145deg, #7c3aed, #4c1d95);
          box-shadow: 0 12px 28px rgba(91, 33, 182, 0.25);
          font-weight: 950;
        }

        .ayo-hero {
          min-height: 650px;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          align-items: center;
          gap: 46px;
          padding: 56px;
          border-radius: 42px;
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.97),
              rgba(249, 244, 255, 0.91)
            );
          border: 1px solid rgba(124, 58, 237, 0.11);
          box-shadow: 0 32px 100px rgba(54, 31, 85, 0.13);
          position: relative;
          overflow: hidden;
        }

        .ayo-hero::before {
          content: "";
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          right: -160px;
          top: -180px;
          background: rgba(124, 58, 237, 0.09);
          filter: blur(3px);
        }

        .ayo-hero-copy,
        .ayo-hero-visual {
          position: relative;
          z-index: 1;
        }

        .ayo-eyebrow {
          width: fit-content;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 15px;
          border-radius: 999px;
          color: #6d28d9;
          background: #f1e8ff;
          font-size: 13px;
          font-weight: 900;
        }

        .ayo-live-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.13);
        }

        .ayo-product-name {
          margin: 26px 0 0;
          color: #5f536d;
          font-size: 17px;
          font-weight: 750;
        }

        .ayo-product-name strong {
          color: #7c3aed;
          font-weight: 950;
          letter-spacing: 0.05em;
        }

        .ayo-hero h1 {
          max-width: 680px;
          margin: 12px 0 0;
          color: #1e132d;
          font-size: clamp(52px, 6vw, 82px);
          line-height: 0.95;
          letter-spacing: -0.065em;
          font-weight: 950;
        }

        .ayo-hero h1 span {
          color: #7c3aed;
        }

        .ayo-hero-text {
          max-width: 620px;
          margin: 25px 0 0;
          color: #6b6177;
          font-size: 17px;
          line-height: 1.75;
        }

        .ayo-hero-actions {
          margin-top: 30px;
          display: flex;
          gap: 13px;
          flex-wrap: wrap;
        }

        .ayo-primary-button,
        .ayo-secondary-button,
        .ayo-dark-button {
          min-height: 58px;
          padding: 0 24px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          border-radius: 18px;
          font-size: 15px;
          font-weight: 950;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .ayo-primary-button {
          color: white;
          background: linear-gradient(135deg, #7c3aed, #5b21b6);
          box-shadow: 0 18px 40px rgba(91, 33, 182, 0.3);
        }

        .ayo-secondary-button {
          color: #2b1d3a;
          background: white;
          border: 1px solid rgba(124, 58, 237, 0.14);
          box-shadow: 0 14px 30px rgba(55, 35, 95, 0.07);
        }

        .ayo-primary-button:hover,
        .ayo-secondary-button:hover,
        .ayo-dark-button:hover {
          transform: translateY(-2px);
        }

        .ayo-trust-row {
          margin-top: 28px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .ayo-trust-row span {
          color: #665970;
          font-size: 12.5px;
          font-weight: 800;
        }

        .ayo-hero-visual {
          min-height: 520px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ayo-orbit {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(124, 58, 237, 0.15);
        }

        .ayo-orbit-one {
          width: 480px;
          height: 480px;
        }

        .ayo-orbit-two {
          width: 370px;
          height: 370px;
        }

        .ayo-mentor-card {
          width: min(370px, 100%);
          padding: 18px;
          border-radius: 34px;
          background: rgba(255, 255, 255, 0.88);
          border: 1px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 32px 80px rgba(45, 24, 74, 0.2);
          backdrop-filter: blur(20px);
          position: relative;
          z-index: 2;
        }

        .ayo-mentor-label {
          margin: 3px 4px 14px;
          color: #6d28d9;
          font-size: 12px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .ayo-portrait-placeholder {
          min-height: 305px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          padding: 32px;
          border-radius: 25px;
          color: white;
          background:
            radial-gradient(
              circle at 50% 30%,
              rgba(255, 255, 255, 0.22),
              transparent 28%
            ),
            linear-gradient(155deg, #8b5cf6, #4c1d95);
          overflow: hidden;
        }

        .ayo-portrait-placeholder span {
          font-size: 54px;
          font-weight: 950;
          letter-spacing: 0.08em;
        }

        .ayo-portrait-placeholder small {
          margin-top: 8px;
          color: rgba(255, 255, 255, 0.78);
          text-align: center;
          font-weight: 700;
        }

        .ayo-mentor-copy {
          padding: 18px 5px 7px;
        }

        .ayo-mentor-copy strong {
          display: block;
          color: #241535;
          font-size: 18px;
          font-weight: 950;
        }

        .ayo-mentor-copy p {
          margin: 7px 0 0;
          color: #71667d;
          font-size: 13.5px;
          line-height: 1.55;
        }

        .ayo-mentor-button {
          min-height: 51px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          color: #fff;
          background: #241535;
          font-size: 14px;
          font-weight: 900;
        }

        .ayo-floating-card {
          position: absolute;
          z-index: 3;
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 13px 15px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.93);
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 18px 40px rgba(46, 25, 77, 0.16);
          backdrop-filter: blur(16px);
        }

        .ayo-floating-card span {
          font-size: 21px;
          font-weight: 950;
        }

        .ayo-floating-card strong,
        .ayo-floating-card small {
          display: block;
        }

        .ayo-floating-card strong {
          color: #2a1b3a;
          font-size: 13px;
        }

        .ayo-floating-card small {
          margin-top: 2px;
          color: #776b82;
          font-size: 11px;
        }

        .ayo-floating-streak {
          top: 68px;
          left: -5px;
        }

        .ayo-floating-progress {
          right: -18px;
          bottom: 90px;
        }

        .ayo-continue {
          margin-top: 22px;
          display: grid;
          grid-template-columns: auto 1fr minmax(180px, 280px) auto;
          align-items: center;
          gap: 20px;
          padding: 20px;
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.86);
          border: 1px solid rgba(124, 58, 237, 0.1);
          box-shadow: 0 18px 50px rgba(55, 35, 95, 0.08);
          backdrop-filter: blur(14px);
        }

        .ayo-continue-icon {
          width: 55px;
          height: 55px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 18px;
          color: white;
          background: linear-gradient(145deg, #7c3aed, #5b21b6);
          box-shadow: 0 13px 28px rgba(91, 33, 182, 0.22);
        }

        .ayo-continue-copy span {
          color: #7c3aed;
          font-size: 12px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .ayo-continue-copy h2 {
          margin: 5px 0 0;
          font-size: 20px;
          letter-spacing: -0.025em;
        }

        .ayo-continue-copy p {
          margin: 4px 0 0;
          color: #756a80;
          font-size: 13px;
        }

        .ayo-progress-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          color: #73677f;
          font-size: 12px;
          font-weight: 800;
        }

        .ayo-progress-label strong {
          color: #3a294b;
        }

        .ayo-progress-track {
          height: 8px;
          margin-top: 9px;
          border-radius: 999px;
          background: #ebe3f5;
          overflow: hidden;
        }

        .ayo-progress-fill {
          width: 18%;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #7c3aed, #a855f7);
        }

        .ayo-continue-button {
          min-height: 48px;
          padding: 0 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          border-radius: 15px;
          color: white;
          background: #241535;
          font-size: 13px;
          font-weight: 900;
        }

        .ayo-academies {
          padding-top: 90px;
        }

        .ayo-section-heading {
          display: grid;
          grid-template-columns: 1fr 0.7fr;
          gap: 40px;
          align-items: end;
        }

        .ayo-section-heading span,
        .ayo-age-copy > span {
          color: #7c3aed;
          font-size: 13px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.09em;
        }

        .ayo-section-heading h2,
        .ayo-age-copy h2 {
          margin: 9px 0 0;
          color: #211431;
          font-size: clamp(38px, 5vw, 62px);
          line-height: 1;
          letter-spacing: -0.055em;
          font-weight: 950;
        }

        .ayo-section-heading > p {
          margin: 0;
          color: #71657d;
          line-height: 1.7;
        }

        .ayo-academy-grid {
          margin-top: 30px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .ayo-academy-card {
          min-height: 300px;
          padding: 25px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-radius: 31px;
          border: 1px solid rgba(255, 255, 255, 0.36);
          box-shadow: 0 20px 55px rgba(47, 28, 73, 0.1);
          position: relative;
          overflow: hidden;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .ayo-academy-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 28px 70px rgba(47, 28, 73, 0.16);
        }

        .ayo-academy-card::after {
          content: "";
          position: absolute;
          width: 180px;
          height: 180px;
          right: -70px;
          bottom: -80px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.13);
        }

        .academy-languages {
          color: white;
          background: linear-gradient(145deg, #0f766e, #115e59);
        }

        .academy-coding {
          color: white;
          background: linear-gradient(145deg, #111827, #312e81);
        }

        .academy-music {
          color: white;
          background: linear-gradient(145deg, #be185d, #7e22ce);
        }

        .academy-wealth {
          color: white;
          background: linear-gradient(145deg, #1c1917, #713f12);
        }

        .academy-ethics {
          color: white;
          background: linear-gradient(145deg, #1e3a5f, #334155);
        }

        .academy-bible {
          color: #352311;
          background: linear-gradient(145deg, #fff7d6, #f4dca0);
        }

        .ayo-academy-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          position: relative;
          z-index: 1;
        }

        .ayo-academy-icon {
          width: 59px;
          height: 59px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 19px;
          background: rgba(255, 255, 255, 0.16);
          font-size: 29px;
          backdrop-filter: blur(12px);
        }

        .academy-bible .ayo-academy-icon {
          background: rgba(255, 255, 255, 0.5);
        }

        .ayo-status {
          padding: 8px 11px;
          border-radius: 999px;
          color: rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.1);
          font-size: 10px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .ayo-status.available {
          color: white;
          background: rgba(34, 197, 94, 0.24);
        }

        .academy-bible .ayo-status {
          color: #72521f;
          background: rgba(255, 255, 255, 0.5);
        }

        .ayo-academy-copy,
        .ayo-academy-footer {
          position: relative;
          z-index: 1;
        }

        .ayo-academy-copy h3 {
          margin: 0;
          font-size: 27px;
          letter-spacing: -0.045em;
          font-weight: 950;
        }

        .ayo-academy-copy p {
          margin: 11px 0 0;
          color: rgba(255, 255, 255, 0.73);
          line-height: 1.62;
          font-size: 14px;
        }

        .academy-bible .ayo-academy-copy p {
          color: rgba(53, 35, 17, 0.7);
        }

        .ayo-academy-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          font-size: 13px;
          font-weight: 900;
        }

        .ayo-academy-footer strong {
          font-size: 22px;
        }

        .is-coming-soon {
          cursor: default;
        }

        .ayo-age-journey {
          margin-top: 90px;
          padding: 44px;
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 48px;
          align-items: center;
          border-radius: 39px;
          color: white;
          background:
            radial-gradient(
              circle at top right,
              rgba(168, 85, 247, 0.28),
              transparent 34%
            ),
            linear-gradient(145deg, #211431, #120b1d);
          box-shadow: 0 30px 90px rgba(35, 20, 51, 0.25);
        }

        .ayo-age-copy h2 {
          color: white;
        }

        .ayo-age-copy p {
          margin: 20px 0 0;
          color: rgba(255, 255, 255, 0.69);
          line-height: 1.7;
        }

        .ayo-dark-button {
          width: fit-content;
          margin-top: 25px;
          color: #241535;
          background: white;
        }

        .ayo-stage-list {
          display: grid;
          gap: 12px;
        }

        .ayo-stage-card {
          padding: 18px;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 17px;
          align-items: center;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .ayo-stage-card > span {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          color: white;
          background: rgba(168, 85, 247, 0.25);
          font-size: 12px;
          font-weight: 950;
        }

        .ayo-stage-card strong {
          display: block;
          font-size: 16px;
        }

        .ayo-stage-card p {
          margin: 5px 0 0;
          color: rgba(255, 255, 255, 0.61);
          font-size: 13px;
        }

        .ayo-footer {
          margin-top: 32px;
          padding: 25px 3px 0;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
          color: #71657d;
        }

        .ayo-footer strong,
        .ayo-footer span {
          display: block;
        }

        .ayo-footer strong {
          color: #281a38;
          font-size: 17px;
        }

        .ayo-footer span {
          margin-top: 5px;
          font-size: 12px;
        }

        .ayo-footer p {
          max-width: 430px;
          margin: 0;
          text-align: right;
          font-size: 12px;
          line-height: 1.55;
        }

        @media (max-width: 980px) {
          .ayo-shell {
            padding: 0 14px 45px;
          }

          .ayo-hero {
            min-height: auto;
            grid-template-columns: 1fr;
            padding: 34px;
          }

          .ayo-hero-visual {
            min-height: 530px;
          }

          .ayo-continue {
            grid-template-columns: auto 1fr auto;
          }

          .ayo-course-progress {
            grid-column: 2 / -1;
            grid-row: 2;
          }

          .ayo-academy-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .ayo-age-journey {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 680px) {
          .ayo-shell {
            padding-left: 10px;
            padding-right: 10px;
          }

          .ayo-topbar {
            min-height: 70px;
          }

          .ayo-progress-link {
            display: none;
          }

          .ayo-hero {
            padding: 25px 19px;
            border-radius: 30px;
          }

          .ayo-hero h1 {
            font-size: clamp(45px, 14vw, 64px);
          }

          .ayo-hero-text {
            font-size: 15px;
          }

          .ayo-hero-actions {
            flex-direction: column;
          }

          .ayo-primary-button,
          .ayo-secondary-button {
            width: 100%;
          }

          .ayo-trust-row {
            display: grid;
          }

          .ayo-hero-visual {
            min-height: 500px;
          }

          .ayo-mentor-card {
            width: 100%;
          }

          .ayo-floating-streak {
            top: 26px;
            left: -4px;
          }

          .ayo-floating-progress {
            right: -4px;
            bottom: 48px;
          }

          .ayo-continue {
            grid-template-columns: auto 1fr;
            border-radius: 24px;
          }

          .ayo-course-progress {
            grid-column: 1 / -1;
          }

          .ayo-continue-button {
            grid-column: 1 / -1;
          }

          .ayo-section-heading {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .ayo-academies {
            padding-top: 65px;
          }

          .ayo-academy-grid {
            grid-template-columns: 1fr;
          }

          .ayo-academy-card {
            min-height: 280px;
          }

          .ayo-age-journey {
            margin-top: 65px;
            padding: 27px 20px;
            border-radius: 31px;
          }

          .ayo-footer {
            align-items: flex-start;
            flex-direction: column;
          }

          .ayo-footer p {
            text-align: left;
          }
        }
      `}</style>
    </main>
  );
}