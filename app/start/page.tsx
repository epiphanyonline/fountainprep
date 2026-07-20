"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const journey = [
  "Add or choose your child",
  "Choose a subject and plan",
  "Select a tutor and weekly timetable",
  "Review the booking and pay securely",
];

export default function StartPage() {
  return (
    <Suspense fallback={<StartLoading />}>
      <StartPageContent />
    </Suspense>
  );
}

function StartPageContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category")?.trim() || "";
  const subject = searchParams.get("subject")?.trim() || "";
  const bookingParams = new URLSearchParams({ mode: "booking" });

  if (category) bookingParams.set("category", category);
  if (subject) bookingParams.set("subject", subject);

  const bookingNext = `/parent/students?${bookingParams.toString()}`;
  const signupHref = `/signup/parent?next=${encodeURIComponent(bookingNext)}`;
  const loginHref = `/login?next=${encodeURIComponent(bookingNext)}`;

  return (
    <main className="startPage">
      <section className="startShell">
        <div className="startIntro">
          <p className="eyebrow">Start a Fountain Prep booking</p>
          <h1>Choose the learning journey that fits you.</h1>
          <p className="lead">
            Parents can book and manage lessons for a child. Adult learners can
            book private African language lessons for themselves.
          </p>

          <p className="journeyLabel">Parent booking journey</p>
          <div className="journey" aria-label="Parent booking journey">
            {journey.map((item, index) => (
              <div key={item} className="journeyItem">
                <span>{index + 1}</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="choicePanel">
          <p className="choiceKicker">Choose one option</p>
          <h2>Who will be taking the lessons?</h2>

          <Link href={signupHref} className="choiceCard primaryChoice">
            <span className="choiceIcon" aria-hidden="true">
              ＋
            </span>
            <span>
              <strong>I’m a new parent</strong>
              <small>Create an account, then add your child.</small>
            </span>
            <b aria-hidden="true">→</b>
          </Link>

          <Link href="/signup/learner" className="choiceCard adultChoice">
            <span className="choiceIcon" aria-hidden="true">
              A
            </span>
            <span>
              <strong>I’m an adult learner</strong>
              <small>Book private African language lessons for yourself.</small>
            </span>
            <b aria-hidden="true">→</b>
          </Link>

          <Link href={loginHref} className="choiceCard">
            <span className="choiceIcon" aria-hidden="true">
              ✓
            </span>
            <span>
              <strong>I already have an account</strong>
              <small>Log in and continue from your account.</small>
            </span>
            <b aria-hidden="true">→</b>
          </Link>

          <div className="browseRow">
            Not ready to book?{" "}
            <Link href="/subjects">Browse subjects first</Link>
          </div>

          <div className="tutorRow">
            Want to teach with Fountain Prep?{" "}
            <Link href="/signup/tutor">Become a Tutor</Link>
          </div>
        </div>
      </section>

      <style>{`
        .startPage {
          min-height: calc(100vh - 76px);
          padding: 54px 18px 82px;
          color: #241235;
          background:
            radial-gradient(circle at 8% 0%, rgba(124, 58, 237, 0.14), transparent 30%),
            radial-gradient(circle at 94% 8%, rgba(236, 72, 153, 0.07), transparent 28%),
            linear-gradient(180deg, #fffaff 0%, #f6efff 100%);
        }

        .startShell {
          width: min(1120px, 100%);
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 0.88fr;
          gap: 28px;
          align-items: stretch;
        }

        .startIntro,
        .choicePanel {
          padding: clamp(28px, 5vw, 48px);
          border: 1px solid rgba(124, 58, 237, 0.13);
          border-radius: 34px;
          background: rgba(255, 255, 255, 0.94);
          box-shadow: 0 26px 80px rgba(62, 39, 101, 0.11);
        }

        .eyebrow,
        .choiceKicker {
          margin: 0;
          color: #6d28d9;
          font-size: 13px;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .startIntro h1 {
          margin: 16px 0 0;
          font-size: clamp(42px, 6vw, 66px);
          line-height: 0.98;
          letter-spacing: -0.06em;
        }

        .lead {
          margin: 20px 0 0;
          color: #685d74;
          font-size: 18px;
          line-height: 1.7;
        }

        .journey {
          display: grid;
          gap: 11px;
          margin-top: 10px;
        }

        .journeyLabel {
          margin: 28px 0 0;
          color: #6d28d9;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .journeyItem {
          display: grid;
          grid-template-columns: 38px 1fr;
          gap: 12px;
          align-items: center;
          padding: 13px 15px;
          border-radius: 18px;
          background: #f8f4ff;
          border: 1px solid rgba(124, 58, 237, 0.1);
        }

        .journeyItem span {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #7c3aed;
          color: #fff;
          font-size: 12px;
          font-weight: 950;
        }

        .choicePanel {
          align-self: center;
        }

        .choicePanel h2 {
          margin: 10px 0 25px;
          font-size: clamp(29px, 4vw, 40px);
          line-height: 1.08;
          letter-spacing: -0.045em;
        }

        .choiceCard {
          display: grid;
          grid-template-columns: 52px 1fr auto;
          gap: 14px;
          align-items: center;
          min-height: 92px;
          margin-top: 14px;
          padding: 18px;
          border-radius: 23px;
          border: 2px solid #e7dafc;
          color: #241235;
          background: #fff;
          text-decoration: none;
          transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
        }

        .choiceCard:hover {
          transform: translateY(-2px);
          border-color: #8b5cf6;
          box-shadow: 0 18px 38px rgba(79, 43, 132, 0.13);
        }

        .primaryChoice {
          border-color: #7c3aed;
          background: linear-gradient(135deg, #7c3aed, #5b21b6);
          color: #fff;
        }

        .adultChoice {
          border-color: #c4b5fd;
          background: linear-gradient(135deg, #faf7ff, #f2ebff);
        }

        .choiceIcon {
          width: 50px;
          height: 50px;
          display: grid;
          place-items: center;
          border-radius: 17px;
          background: #f1e8ff;
          color: #6d28d9;
          font-size: 24px;
          font-weight: 950;
        }

        .primaryChoice .choiceIcon {
          background: rgba(255, 255, 255, 0.17);
          color: #fff;
        }

        .choiceCard strong,
        .choiceCard small {
          display: block;
        }

        .choiceCard strong {
          font-size: 17px;
          font-weight: 950;
        }

        .choiceCard small {
          margin-top: 5px;
          color: #6d647c;
          line-height: 1.45;
        }

        .primaryChoice small {
          color: rgba(255, 255, 255, 0.82);
        }

        .choiceCard b {
          font-size: 22px;
        }

        .browseRow {
          margin-top: 24px;
          text-align: center;
          color: #6d647c;
          font-weight: 700;
        }

        .browseRow a {
          color: #6d28d9;
          font-weight: 950;
        }

        .tutorRow {
          margin-top: 15px;
          padding-top: 18px;
          border-top: 1px solid rgba(124, 58, 237, 0.13);
          text-align: center;
          color: #6d647c;
          font-size: 14px;
          font-weight: 700;
        }

        .tutorRow a {
          color: #6d28d9;
          font-weight: 950;
        }

        @media (max-width: 860px) {
          .startPage {
            padding-top: 30px;
          }

          .startShell {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 520px) {
          .startIntro,
          .choicePanel {
            padding: 25px 20px;
            border-radius: 27px;
          }

          .choiceCard {
            grid-template-columns: 44px 1fr;
          }

          .choiceCard b {
            display: none;
          }

          .choiceIcon {
            width: 43px;
            height: 43px;
            border-radius: 14px;
          }
        }
      `}</style>
    </main>
  );
}

function StartLoading() {
  return (
    <main className="startPage">
      <section className="startShell">
        <p>Preparing your booking…</p>
      </section>
    </main>
  );
}
