"use client";

import Link from "next/link";

const parentNext = "/parent/students?mode=booking";

const signupOptions = [
  {
    title: "Parent or Guardian",
    description: "Book and manage private lessons for a child.",
    icon: "👨‍👩‍👧",
    href: `/signup/parent?next=${encodeURIComponent(parentNext)}`,
    action: "Create Parent Account",
    points: [
      "Academic tutoring",
      "African languages",
      "Weekly timetable",
      "Progress reports",
    ],
    featured: true,
    badge: "RECOMMENDED FOR BOOKING",
  },
  {
    title: "Adult Learner",
    description: "Book private African language lessons for yourself.",
    icon: "🎓",
    href: "/signup/learner",
    action: "Continue as Adult Learner",
    points: [
      "Learn Yoruba",
      "Learn Igbo",
      "Learn Hausa",
      "More languages coming",
    ],
    featured: false,
    badge: "",
  },
  {
    title: "Tutor",
    description: "Apply to teach learners through Fountain Prep.",
    icon: "👩🏾‍🏫",
    href: "/signup/tutor",
    action: "Become a Tutor",
    points: [
      "Teach online",
      "Flexible availability",
      "Weekly payouts",
      "Professional platform",
    ],
    featured: false,
    badge: "",
  },
];

export default function SignupLandingPage() {
  return (
    <main className="signupPage">
      <div className="signupContainer">
        <section className="signupHero">
          <span>Join Fountain Prep</span>
          <h1>Who are you joining as?</h1>
          <p>
            Choose the option that best describes who will take or manage
            lessons.
          </p>
        </section>

        <section className="signupCards">
          {signupOptions.map((option) => (
            <Link
              key={option.href}
              href={option.href}
              className={option.featured ? "signupCard featured" : "signupCard"}
              aria-label={option.action}
            >
              {option.badge ? (
                <span className="cardBadge">{option.badge}</span>
              ) : null}
              <div className="cardIcon">{option.icon}</div>
              <h2>{option.title}</h2>
              <p>{option.description}</p>
              <ul>
                {option.points.map((point) => (
                  <li key={point}>✓ {point}</li>
                ))}
              </ul>
              <span className="cardAction">
                {option.action}
                <b aria-hidden="true">→</b>
              </span>
            </Link>
          ))}
        </section>

        <div className="loginRow">
          Already have an account?{" "}
          <Link href={`/login?next=${encodeURIComponent(parentNext)}`}>
            Log in
          </Link>
        </div>
      </div>

      <style jsx global>{`
        .signupPage {
          min-height: 100vh;
          padding: 58px 18px 78px;
          color: #241235;
          background:
            radial-gradient(
              circle at 8% 0%,
              rgba(124, 58, 237, 0.13),
              transparent 30%
            ),
            linear-gradient(180deg, #fffaff, #f6efff);
        }
        .signupContainer {
          width: min(1180px, 100%);
          margin: 0 auto;
        }
        .signupHero {
          max-width: 760px;
          margin: 0 auto 40px;
          text-align: center;
        }
        .signupHero > span {
          display: inline-flex;
          padding: 9px 15px;
          border-radius: 999px;
          color: #6d28d9;
          background: #efe7ff;
          font-size: 13px;
          font-weight: 950;
        }
        .signupHero h1 {
          margin: 18px 0 0;
          font-size: clamp(42px, 6vw, 66px);
          line-height: 1;
          letter-spacing: -0.06em;
        }
        .signupHero p {
          margin: 16px auto 0;
          color: #6d647c;
          font-size: 18px;
          line-height: 1.65;
        }
        .signupCards {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }
        .signupCard {
          position: relative;
          min-height: 440px;
          display: flex;
          flex-direction: column;
          padding: 29px;
          border-radius: 30px;
          color: inherit;
          text-decoration: none;
          background: rgba(255, 255, 255, 0.97);
          border: 2px solid transparent;
          box-shadow: 0 24px 70px rgba(55, 35, 95, 0.09);
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            box-shadow 180ms ease;
        }
        .signupCard:hover {
          transform: translateY(-5px);
          border-color: rgba(124, 58, 237, 0.45);
          box-shadow: 0 32px 80px rgba(74, 44, 120, 0.15);
        }
        .signupCard.featured {
          border-color: #7c3aed;
          background:
            radial-gradient(
              circle at top right,
              rgba(124, 58, 237, 0.12),
              transparent 34%
            ),
            #fff;
        }
        .cardBadge {
          position: absolute;
          top: 20px;
          right: 20px;
          max-width: 150px;
          padding: 7px 10px;
          border-radius: 999px;
          color: #fff;
          background: #6d28d9;
          font-size: 10px;
          font-weight: 950;
          text-align: center;
        }
        .cardIcon {
          width: 60px;
          height: 60px;
          display: grid;
          place-items: center;
          margin-bottom: 21px;
          border-radius: 19px;
          background: #f2eaff;
          font-size: 30px;
        }
        .signupCard h2 {
          margin: 0;
          font-size: 28px;
          line-height: 1.05;
          letter-spacing: -0.04em;
        }
        .signupCard p {
          min-height: 52px;
          margin: 13px 0 0;
          color: #685d74;
          line-height: 1.6;
        }
        .signupCard ul {
          flex: 1;
          display: grid;
          align-content: start;
          gap: 10px;
          margin: 23px 0 0;
          padding: 0;
          color: #51475c;
          list-style: none;
          font-weight: 750;
        }
        .signupCard li {
          line-height: 1.5;
        }
        .cardAction {
          min-height: 55px;
          margin-top: 26px;
          padding: 0 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 17px;
          color: #fff;
          background: linear-gradient(135deg, #7c3aed, #5b21b6);
          font-size: 15px;
          font-weight: 950;
        }
        .cardAction b {
          font-size: 20px;
        }
        .loginRow {
          margin-top: 38px;
          text-align: center;
          color: #6d647c;
          font-weight: 750;
        }
        .loginRow a {
          color: #6d28d9;
          font-weight: 950;
        }
        @media (max-width: 920px) {
          .signupCards {
            grid-template-columns: 1fr;
          }
          .signupCard {
            min-height: 0;
          }
          .signupCard p {
            min-height: 0;
          }
        }
        @media (max-width: 560px) {
          .signupPage {
            padding: 36px 13px 65px;
          }
          .signupCard {
            padding: 24px 20px;
            border-radius: 26px;
          }
        }
      `}</style>
    </main>
  );
}
