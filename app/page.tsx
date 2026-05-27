'use client'

import Link from 'next/link'

const BRAND = 'Fountain Prep'

export default function HomePage() {
  return (
    <main className="page-wrap">
      <div className="container">
        {/* HERO */}
        <section className="hero-section">
          <div className="hero-glow hero-glow-1" />
          <div className="hero-glow hero-glow-2" />

          <div className="hero-content">
            <div className="hero-badge">
              ✨ Premium online learning support for modern families
            </div>

            <h1 className="hero-title">
              Structured learning that helps children grow with confidence.
            </h1>

            <p className="hero-text">
              {BRAND} helps children stay academically confident through guided
              online lessons, trusted tutors, and organised learning support —
              built for busy modern families.
            </p>

            <div className="hero-actions">
              <Link href="/parent/students" className="btn-primary">
                Start Learning
              </Link>

              <Link href="/subjects" className="btn-secondary">
                Explore Subjects
              </Link>
            </div>

            <div className="hero-trust">
              <span>✔ UK GDPR aware</span>
              <span>✔ Verified tutors</span>
              <span>✔ Structured lessons</span>
            </div>
          </div>

          <div className="hero-card">
            <div className="mini-card">
              <div className="mini-icon">🎯</div>

              <div>
                <h4>Focused learning plans</h4>
                <p>
                  Lessons are organised around age, level, subject, and
                  confidence goals.
                </p>
              </div>
            </div>

            <div className="mini-card">
              <div className="mini-icon">🌍</div>

              <div>
                <h4>Built for global families</h4>
                <p>
                  Supporting families in the UK, USA, Canada, Australia, and
                  beyond.
                </p>
              </div>
            </div>

            <div className="mini-card">
              <div className="mini-icon">📈</div>

              <div>
                <h4>Progress-focused support</h4>
                <p>
                  Every session contributes to a more structured learning
                  journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="section-block">
          <div className="section-intro">
            <p className="section-label">Simple parent journey</p>

            <h2 className="section-title">
              Few clicks. Clear learning path.
            </h2>

            <p className="section-text">
              Parents can quickly set up learning support without endlessly
              searching or comparing tutors.
            </p>
          </div>

          <div className="grid-3">
            <StepCard
              number="01"
              title="Add your child"
              text="Create your child’s profile with age, level, and learning needs."
            />

            <StepCard
              number="02"
              title="Choose a subject"
              text="Select the subject or skill your child needs support with."
            />

            <StepCard
              number="03"
              title="Book a learning time"
              text="Choose a convenient lesson time and start learning."
            />
          </div>
        </section>

        {/* SUBJECTS */}
        <section className="section-block">
          <div className="section-intro">
            <p className="section-label">Popular learning areas</p>

            <h2 className="section-title">
              Support for academics, language, and skills.
            </h2>

            <p className="section-text">
              Structured learning support designed around each child’s needs.
            </p>
          </div>

          <div className="subject-grid">
            {[
              'Maths',
              'English',
              'Science',
              'Coding',
              'Music',
              'Yoruba',
              'Igbo',
              'Hausa',
            ].map((subject) => (
              <Link
                href="/subjects"
                key={subject}
                className="subject-pill"
              >
                {subject}
              </Link>
            ))}
          </div>
        </section>

        {/* TRUST */}
        <section className="section-block">
          <div className="section-intro">
            <p className="section-label">Why parents trust {BRAND}</p>

            <h2 className="section-title">
              Premium online learning with structure and care.
            </h2>
          </div>

          <div className="grid-3">
            <FeatureCard
              emoji="🛡️"
              title="Verified tutors"
              text="Tutors are reviewed before supporting families on the platform."
            />

            <FeatureCard
              emoji="📚"
              title="Structured lessons"
              text="Children follow guided learning plans instead of random sessions."
            />

            <FeatureCard
              emoji="💜"
              title="Parent-first experience"
              text="Simple booking, clear plans, and organised learning support."
            />
          </div>
        </section>

        {/* GDPR + REFUND */}
        <section className="policy-strip">
          <div className="policy-card">
            <h3>Trusted & Secure Learning</h3>

            <p>
              {BRAND} operates with a strong focus on privacy, safeguarding, and
              secure online learning practices.
            </p>

            <div className="policy-links">
              <Link href="/data-protection-policy">Data Protection Policy</Link>
              <Link href="/refund-policy">Refund Policy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/safeguarding">Safeguarding</Link>
              <Link href="/cookie-policy">Cookie Policy</Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="final-cta">
          <div className="cta-card">
            <p className="cta-label">Start today</p>

            <h2>
              Give your child a more confident and structured learning journey.
            </h2>

            <p>
              Join families using {BRAND} for organised online academic support.
            </p>

            <div className="hero-actions">
              <Link href="/parent/students" className="btn-primary">
                Start Learning
              </Link>

              <Link href="/subjects" className="btn-secondary">
                Explore Subjects
              </Link>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .hero-section {
          position: relative;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 28px;
          align-items: center;
          padding: 48px;
          border-radius: 34px;
          background:
            radial-gradient(circle at top right, rgba(124, 58, 237, 0.12), transparent 30%),
            linear-gradient(135deg, #ffffff, #f7f2ff);
          border: 1px solid rgba(124, 58, 237, 0.08);
          box-shadow: 0 24px 70px rgba(55, 35, 95, 0.08);
        }

        .hero-glow {
          position: absolute;
          border-radius: 999px;
          filter: blur(30px);
        }

        .hero-glow-1 {
          width: 220px;
          height: 220px;
          background: rgba(124, 58, 237, 0.12);
          right: -60px;
          top: -60px;
        }

        .hero-glow-2 {
          width: 160px;
          height: 160px;
          background: rgba(196, 181, 253, 0.3);
          left: -40px;
          bottom: -40px;
        }

        .hero-content {
          position: relative;
          z-index: 2;
        }

        .hero-badge {
          display: inline-flex;
          padding: 10px 16px;
          border-radius: 999px;
          background: rgba(124, 58, 237, 0.08);
          color: #6d28d9;
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 22px;
        }

        .hero-title {
          margin: 0;
          font-size: clamp(42px, 6vw, 72px);
          line-height: 0.96;
          letter-spacing: -0.06em;
          color: #1f1230;
          font-weight: 900;
          max-width: 760px;
        }

        .hero-text {
          margin-top: 24px;
          max-width: 620px;
          font-size: 18px;
          line-height: 1.8;
          color: #675d77;
        }

        .hero-actions {
          display: flex;
          gap: 14px;
          margin-top: 32px;
          flex-wrap: wrap;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 54px;
          padding: 0 26px;
          border-radius: 16px;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          color: white;
          font-weight: 800;
          text-decoration: none;
          box-shadow: 0 16px 40px rgba(109, 40, 217, 0.24);
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 54px;
          padding: 0 24px;
          border-radius: 16px;
          background: white;
          border: 1px solid rgba(124, 58, 237, 0.12);
          color: #2a1b3d;
          font-weight: 800;
          text-decoration: none;
        }

        .hero-trust {
          display: flex;
          gap: 18px;
          flex-wrap: wrap;
          margin-top: 24px;
          color: #5f5370;
          font-weight: 700;
          font-size: 14px;
        }

        .hero-card {
          position: relative;
          z-index: 2;
          display: grid;
          gap: 16px;
        }

        .mini-card {
          display: flex;
          gap: 16px;
          padding: 22px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.88);
          border: 1px solid rgba(124, 58, 237, 0.08);
          backdrop-filter: blur(10px);
          box-shadow: 0 16px 40px rgba(55, 35, 95, 0.06);
        }

        .mini-card h4 {
          margin: 0 0 6px;
          color: #251634;
        }

        .mini-card p {
          margin: 0;
          color: #6c627d;
          line-height: 1.6;
          font-size: 15px;
        }

        .mini-icon {
          width: 54px;
          height: 54px;
          border-radius: 18px;
          background: #f1e8ff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          flex-shrink: 0;
        }

        .section-block {
          margin-top: 78px;
        }

        .section-intro {
          max-width: 760px;
          margin-bottom: 24px;
        }

        .section-label {
          color: #6d28d9;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .section-title {
          margin: 0;
          font-size: clamp(30px, 4vw, 52px);
          line-height: 1.05;
          letter-spacing: -0.04em;
          color: #1f1230;
        }

        .section-text {
          margin-top: 16px;
          color: #6d647c;
          line-height: 1.8;
          font-size: 17px;
        }

        .grid-3 {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        .subject-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
        }

        .subject-pill {
          padding: 14px 20px;
          border-radius: 999px;
          background: white;
          border: 1px solid rgba(124, 58, 237, 0.08);
          text-decoration: none;
          color: #2a1b3d;
          font-weight: 800;
          box-shadow: 0 12px 30px rgba(55, 35, 95, 0.05);
        }

        .policy-strip {
          margin-top: 82px;
        }

        .policy-card {
          padding: 34px;
          border-radius: 28px;
          background:
            linear-gradient(135deg, rgba(124, 58, 237, 0.08), rgba(168, 85, 247, 0.1));
          border: 1px solid rgba(124, 58, 237, 0.08);
        }

        .policy-card h3 {
          margin: 0 0 10px;
          color: #231431;
        }

        .policy-card p {
          margin: 0;
          color: #655b74;
          line-height: 1.7;
        }

        .policy-links {
          display: flex;
          gap: 18px;
          flex-wrap: wrap;
          margin-top: 18px;
        }

        .policy-links a {
          color: #6d28d9;
          font-weight: 700;
          text-decoration: none;
        }

        .final-cta {
          margin-top: 84px;
          margin-bottom: 80px;
        }

        .cta-card {
          padding: 48px;
          border-radius: 32px;
          text-align: center;
          background:
            radial-gradient(circle at top, rgba(124, 58, 237, 0.16), transparent 30%),
            linear-gradient(135deg, #faf7ff, #f4edff);
          border: 1px solid rgba(124, 58, 237, 0.08);
        }

        .cta-label {
          color: #6d28d9;
          font-weight: 800;
          margin-bottom: 10px;
        }

        .cta-card h2 {
          margin: 0;
          font-size: clamp(32px, 4vw, 56px);
          line-height: 1.05;
          letter-spacing: -0.05em;
          color: #201230;
        }

        .cta-card p {
          max-width: 640px;
          margin: 18px auto 0;
          color: #6d647c;
          line-height: 1.8;
          font-size: 17px;
        }

        @media (max-width: 900px) {
          .hero-section {
            grid-template-columns: 1fr;
            padding: 28px 22px;
            border-radius: 28px;
          }

          .hero-title {
            font-size: clamp(38px, 11vw, 56px);
          }

          .hero-text {
            font-size: 16px;
          }

          .grid-3 {
            grid-template-columns: 1fr;
          }

          .hero-actions {
            flex-direction: column;
          }

          .btn-primary,
          .btn-secondary {
            width: 100%;
          }

          .section-block {
            margin-top: 58px;
          }

          .cta-card {
            padding: 32px 22px;
          }

          .hero-trust {
            display: grid;
            gap: 10px;
          }
        }
      `}</style>
    </main>
  )
}

function StepCard({
  number,
  title,
  text,
}: {
  number: string
  title: string
  text: string
}) {
  return (
    <div className="card" style={{ padding: 26 }}>
      <p
        style={{
          margin: 0,
          color: '#6d28d9',
          fontWeight: 900,
          fontSize: 22,
        }}
      >
        {number}
      </p>

      <h3 style={{ marginTop: 14 }}>{title}</h3>

      <p className="page-subtitle">{text}</p>
    </div>
  )
}

function FeatureCard({
  emoji,
  title,
  text,
}: {
  emoji: string
  title: string
  text: string
}) {
  return (
    <div className="card" style={{ padding: 28 }}>
      <div
        style={{
          width: 62,
          height: 62,
          borderRadius: 18,
          background: '#f2eaff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          marginBottom: 18,
        }}
      >
        {emoji}
      </div>

      <h3 style={{ margin: '0 0 10px' }}>{title}</h3>

      <p className="page-subtitle">{text}</p>
    </div>
  )
}