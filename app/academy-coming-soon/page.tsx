import Link from "next/link";

export default function AcademyComingSoonPage() {
  return (
    <main className="academy-paused">
      <section className="card">
        <div className="brand">FountainPrep</div>

        <span className="eyebrow">
          SELF-PACED LEARNING
        </span>

        <h1>
          We&apos;re refining the learning experience.
        </h1>

        <p className="lead">
          Our self-paced Academy is currently being
          improved before its next release.
        </p>

        <p className="live">
          In the meantime, Fountain Prep&apos;s live
          1-to-1 online lessons remain fully available.
        </p>

        <div className="actions">
          <Link href="/start" className="primary">
            Book a Live Tutor →
          </Link>

          <Link href="/subjects" className="secondary">
            Explore Subjects
          </Link>
        </div>
      </section>

      <style>{`
        .academy-paused {
          min-height: calc(100vh - 76px);
          display: grid;
          place-items: center;
          padding: 48px 20px;
          background:
            radial-gradient(
              circle at 15% 20%,
              rgba(124, 58, 237, 0.10),
              transparent 34%
            ),
            radial-gradient(
              circle at 85% 75%,
              rgba(168, 85, 247, 0.08),
              transparent 32%
            ),
            #fcfbff;
        }

        .card {
          width: min(760px, 100%);
          padding: 64px 56px;
          border: 1px solid rgba(124, 58, 237, 0.12);
          border-radius: 32px;
          background: rgba(255, 255, 255, 0.96);
          box-shadow:
            0 30px 80px rgba(56, 30, 90, 0.10);
          text-align: center;
        }

        .brand {
          margin-bottom: 38px;
          color: #6d28d9;
          font-size: 24px;
          font-weight: 950;
          letter-spacing: -0.05em;
        }

        .eyebrow {
          display: inline-flex;
          margin-bottom: 18px;
          padding: 8px 13px;
          border-radius: 999px;
          color: #6d28d9;
          background: #f3ecff;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        h1 {
          max-width: 650px;
          margin: 0 auto;
          color: #21142e;
          font-size: clamp(38px, 6vw, 64px);
          line-height: 0.98;
          letter-spacing: -0.055em;
        }

        .lead {
          max-width: 570px;
          margin: 25px auto 0;
          color: #65596e;
          font-size: 19px;
          line-height: 1.65;
        }

        .live {
          max-width: 570px;
          margin: 13px auto 0;
          color: #35283e;
          font-size: 16px;
          font-weight: 750;
          line-height: 1.6;
        }

        .actions {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 34px;
        }

        .actions a {
          min-height: 52px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 22px;
          border-radius: 999px;
          font-weight: 900;
          text-decoration: none;
        }

        .primary {
          color: white;
          background: linear-gradient(
            135deg,
            #7c3aed,
            #6d28d9
          );
          box-shadow:
            0 14px 30px rgba(109, 40, 217, 0.22);
        }

        .secondary {
          color: #5b21b6;
          border: 1px solid rgba(124, 58, 237, 0.20);
          background: white;
        }

        @media (max-width: 600px) {
          .academy-paused {
            padding: 24px 16px;
          }

          .card {
            padding: 44px 22px;
            border-radius: 25px;
          }

          .brand {
            margin-bottom: 30px;
          }

          .actions {
            display: grid;
          }

          .actions a {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}