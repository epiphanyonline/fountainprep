"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function FountainTalkLessonReportContent() {
  const searchParams = useSearchParams();

  const studentId =
    searchParams.get("studentId") ?? "";

  const language =
    searchParams.get("language") ?? "yoruba";

  const unitTitle =
    searchParams.get("unitTitle") ??
    "Learning unit";

  const lessonTitle =
    searchParams.get("lessonTitle") ??
    "Completed lesson";

  const points = Number(
    searchParams.get("points") ?? "0",
  );

  return (
    <main className="page">
      <section className="reportCard">
        <p className="eyebrow">
          FountainTalk Achievement
        </p>

        <div className="badge">🏆</div>

        <h1>Fantastic work!</h1>

        <p className="subtitle">
          You completed{" "}
          <strong>{lessonTitle}</strong> in{" "}
          <strong>{unitTitle}</strong>.
        </p>

        <div className="stats">
          <div className="stat">
            <span>Points earned</span>
            <strong>{points}</strong>
          </div>

          <div className="stat">
            <span>Language</span>
            <strong>{language}</strong>
          </div>
        </div>

        <div className="actions">
          <Link
            href={`/fountaintalk/tutor?studentId=${encodeURIComponent(
              studentId,
            )}&language=${encodeURIComponent(
              language,
            )}`}
            className="primaryButton"
          >
            Continue Learning
          </Link>

          <Link
            href="/parent/dashboard"
            className="secondaryButton"
          >
            Back to Dashboard
          </Link>
        </div>
      </section>

      <style jsx>{`
        .page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 32px 18px;
          background:
            radial-gradient(
              circle at top right,
              rgba(124, 58, 237, 0.18),
              transparent 32%
            ),
            linear-gradient(
              180deg,
              #ffffff,
              #f7f1ff
            );
          color: #251438;
        }

        .reportCard {
          width: min(720px, 100%);
          padding: 48px;
          text-align: center;
          border-radius: 36px;
          background: rgba(
            255,
            255,
            255,
            0.96
          );
          border: 1px solid
            rgba(124, 58, 237, 0.14);
          box-shadow: 0 28px 90px
            rgba(71, 43, 117, 0.14);
        }

        .eyebrow {
          margin: 0;
          color: #6d28d9;
          font-size: 14px;
          font-weight: 900;
        }

        .badge {
          margin-top: 24px;
          font-size: 76px;
        }

        h1 {
          margin: 18px 0 0;
          font-size: clamp(
            42px,
            8vw,
            68px
          );
          line-height: 1;
          letter-spacing: -0.055em;
        }

        .subtitle {
          margin: 20px auto 0;
          max-width: 560px;
          color: #70647d;
          font-size: 18px;
          line-height: 1.7;
        }

        .subtitle strong {
          color: #2e1748;
        }

        .stats {
          margin-top: 30px;
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .stat {
          padding: 20px;
          border-radius: 22px;
          background: #faf7ff;
          border: 1px solid
            rgba(124, 58, 237, 0.12);
        }

        .stat span {
          display: block;
          color: #7a7088;
          font-size: 13px;
          font-weight: 850;
        }

        .stat strong {
          display: block;
          margin-top: 8px;
          font-size: 30px;
          text-transform: capitalize;
        }

        .actions {
          margin-top: 30px;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .primaryButton,
        .secondaryButton {
          min-height: 54px;
          padding: 0 24px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 18px;
          text-decoration: none;
          font-weight: 900;
        }

        .primaryButton {
          color: white;
          background:
            linear-gradient(
              135deg,
              #7c3aed,
              #6d28d9
            );
          box-shadow: 0 16px 38px
            rgba(124, 58, 237, 0.28);
        }

        .secondaryButton {
          color: #351e55;
          background: white;
          border: 1px solid
            rgba(124, 58, 237, 0.16);
        }

        @media (max-width: 640px) {
          .reportCard {
            padding: 34px 20px;
          }

          .stats {
            grid-template-columns: 1fr;
          }

          .primaryButton,
          .secondaryButton {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}

export default function FountainTalkLessonReportPage() {
  return (
    <Suspense
      fallback={
        <main>
          Loading achievement...
        </main>
      }
    >
      <FountainTalkLessonReportContent />
    </Suspense>
  );
}