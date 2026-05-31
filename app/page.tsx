'use client'

import Link from 'next/link'

const BRAND = 'Fountain Prep'

export default function HomePage() {
  return (
    <main className="pageWrap">
      <div className="container">
        <section className="hero">
          <div className="heroCopy">
            <div className="eyebrow">Private 1-to-1 online tutoring</div>

            <h1>Helping children learn with confidence, one lesson at a time.</h1>

            <p>
              {BRAND} gives your child focused one-to-one support with trusted
              tutors, structured lessons, and flexible online learning for
              modern families.
            </p>

            <div className="actions">
              <Link href="/parent/students" className="primaryBtn">
                Start Learning
              </Link>

              <Link href="/subjects" className="secondaryBtn">
                Explore Subjects
              </Link>
            </div>

            <div className="trustLine">
              <span>✓ 1-to-1 lessons</span>
              <span>✓ Verified tutors</span>
              <span>✓ From £10/class</span>
            </div>
          </div>

          <div className="heroMedia">
            <img
              src="/yoruba-tutoring.png"
              alt="Child learning online with a private tutor"
            />

            <div className="mediaBadge topBadge">
              <strong>1-to-1</strong>
              <span>No group classes</span>
            </div>

            <div className="mediaBadge bottomBadge">
              <strong>Academic • Language • Skills</strong>
              <span>Personalised support</span>
            </div>
          </div>
        </section>

        <section className="introStrip">
          <p>Why parents choose Fountain Prep</p>
          <h2>Focused private tutoring, not crowded online classes.</h2>
        </section>

        <section className="featureGrid">
          <Feature
            title="Private 1-to-1 tutoring"
            text="Every lesson is focused entirely on your child."
          />
          <Feature
            title="Trusted tutors"
            text="Tutors are selected for knowledge, care, and reliability."
          />
          <Feature
            title="Structured lessons"
            text="Learning follows a clear path, not random sessions."
          />
          <Feature
            title="Affordable quality"
            text="Premium private tutoring from just £10 per class."
          />
        </section>

        <section className="journey">
          <div>
            <p className="sectionTag">Simple parent journey</p>
            <h2>Start learning in a few easy steps.</h2>
          </div>

          <div className="stepGrid">
            <Step
              number="01"
              title="Add your child"
              text="Create a profile with their age, level, and learning needs."
            />
            <Step
              number="02"
              title="Choose a subject"
              text="Select academic, language, or skill-based support."
            />
            <Step
              number="03"
              title="Book a lesson"
              text="Choose a convenient time and start learning online."
            />
          </div>
        </section>

        <section className="subjectsSection">
          <p className="sectionTag">Popular learning areas</p>
          <h2>Academic subjects, languages, and creative skills.</h2>

          <div className="subjects">
            {['Maths', 'English', 'Science', 'Coding', 'Music', 'Yoruba', 'Igbo', 'Hausa'].map(
              (subject) => (
                <Link href="/subjects" key={subject} className="subjectPill">
                  {subject}
                </Link>
              )
            )}
          </div>
        </section>

        <section className="finalCta">
          <p>Start today</p>
          <h2>Give your child a more confident learning journey.</h2>
          <span>Private one-to-one online tutoring from £10 per class.</span>

          <div className="actions center">
            <Link href="/parent/students" className="primaryBtn">
              Start Learning
            </Link>

            <Link href="/subjects" className="secondaryBtn">
              Explore Subjects
            </Link>
          </div>
        </section>
      </div>

      <style jsx>{`
        .pageWrap {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(124, 58, 237, 0.08), transparent 26%),
            linear-gradient(180deg, #fff, #fbf8ff 42%, #f7f0ff);
          color: #1f1230;
        }

        .container {
          width: min(1220px, calc(100% - 34px));
          margin: 0 auto;
          padding: 34px 0 90px;
        }

        .hero {
          display: grid;
          grid-template-columns: 0.92fr 1.08fr;
          gap: 42px;
          align-items: center;
          padding: 42px;
          border-radius: 40px;
          background:
            radial-gradient(circle at top right, rgba(124, 58, 237, 0.18), transparent 34%),
            linear-gradient(135deg, rgba(255,255,255,0.96), rgba(246,239,255,0.92));
          border: 1px solid rgba(124, 58, 237, 0.12);
          box-shadow: 0 30px 90px rgba(47, 25, 80, 0.1);
          overflow: hidden;
        }

        .heroCopy {
          padding: 18px 0;
        }

        .eyebrow {
          display: inline-flex;
          padding: 10px 16px;
          border-radius: 999px;
          background: rgba(124, 58, 237, 0.1);
          color: #6d28d9;
          font-size: 14px;
          font-weight: 950;
          margin-bottom: 22px;
        }

        .hero h1 {
          margin: 0;
          max-width: 650px;
          font-size: clamp(44px, 5.4vw, 72px);
          line-height: 0.95;
          letter-spacing: -0.065em;
          font-weight: 950;
          color: #201230;
        }

        .hero p {
          margin: 24px 0 0;
          max-width: 590px;
          color: #655a76;
          font-size: 18px;
          line-height: 1.8;
        }

        .actions {
          margin-top: 32px;
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        .center {
          justify-content: center;
        }

        .primaryBtn,
        .secondaryBtn {
          min-height: 56px;
          padding: 0 28px;
          border-radius: 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-weight: 950;
        }

        .primaryBtn {
          color: white;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          box-shadow: 0 18px 42px rgba(109, 40, 217, 0.26);
        }

        .secondaryBtn {
          background: white;
          color: #241535;
          border: 1px solid rgba(124, 58, 237, 0.14);
        }

        .trustLine {
          margin-top: 24px;
          display: flex;
          gap: 18px;
          flex-wrap: wrap;
          color: #5f5370;
          font-size: 14px;
          font-weight: 850;
        }

        .heroMedia {
          position: relative;
          height: 580px;
          border-radius: 34px;
          overflow: hidden;
          box-shadow: 0 30px 80px rgba(47, 25, 80, 0.18);
          border: 1px solid rgba(255, 255, 255, 0.7);
          background: #eee;
        }

        .heroMedia img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .heroMedia::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(31, 18, 48, 0.25),
            rgba(31, 18, 48, 0.02) 58%
          );
        }

        .mediaBadge {
          position: absolute;
          z-index: 2;
          padding: 14px 17px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(124, 58, 237, 0.1);
          box-shadow: 0 18px 42px rgba(31, 18, 48, 0.16);
        }

        .mediaBadge strong {
          display: block;
          color: #241535;
          font-size: 15px;
          font-weight: 950;
        }

        .mediaBadge span {
          display: block;
          margin-top: 4px;
          color: #6d647c;
          font-size: 13px;
          font-weight: 750;
        }

        .topBadge {
          top: 22px;
          right: 22px;
        }

        .bottomBadge {
          left: 22px;
          bottom: 22px;
        }

        .introStrip {
          margin-top: 82px;
          max-width: 820px;
        }

        .introStrip p,
        .sectionTag,
        .finalCta p {
          color: #6d28d9;
          font-weight: 950;
          margin: 0 0 10px;
        }

        .introStrip h2,
        .journey h2,
        .subjectsSection h2,
        .finalCta h2 {
          margin: 0;
          color: #201230;
          font-size: clamp(34px, 4.4vw, 58px);
          line-height: 1.04;
          letter-spacing: -0.055em;
          font-weight: 950;
        }

        .featureGrid {
          margin-top: 28px;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
        }

        .feature,
        .step {
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(124, 58, 237, 0.08);
          box-shadow: 0 18px 48px rgba(55, 35, 95, 0.07);
          border-radius: 28px;
          padding: 26px;
        }

        .feature h3,
        .step h3 {
          margin: 0 0 12px;
          color: #241535;
          font-size: 21px;
          line-height: 1.15;
        }

        .feature p,
        .step p {
          margin: 0;
          color: #6d647c;
          line-height: 1.7;
          font-size: 15.5px;
        }

        .journey {
          margin-top: 82px;
          padding: 42px;
          border-radius: 38px;
          background:
            radial-gradient(circle at top right, rgba(124, 58, 237, 0.14), transparent 30%),
            linear-gradient(135deg, #ffffff, #f3ecff);
          border: 1px solid rgba(124, 58, 237, 0.1);
          box-shadow: 0 22px 70px rgba(55, 35, 95, 0.07);
        }

        .stepGrid {
          margin-top: 30px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .stepNumber {
          display: inline-flex;
          margin-bottom: 18px;
          color: #6d28d9;
          font-weight: 950;
          font-size: 24px;
        }

        .subjectsSection {
          margin-top: 82px;
        }

        .subjects {
          margin-top: 28px;
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
        }

        .subjectPill {
          padding: 15px 22px;
          border-radius: 999px;
          background: white;
          color: #2a1640;
          text-decoration: none;
          font-weight: 950;
          border: 1px solid rgba(124, 58, 237, 0.1);
          box-shadow: 0 14px 34px rgba(55, 35, 95, 0.06);
        }

        .finalCta {
          margin-top: 86px;
          text-align: center;
          padding: 56px 34px;
          border-radius: 40px;
          background:
            radial-gradient(circle at top, rgba(124, 58, 237, 0.18), transparent 36%),
            linear-gradient(135deg, #ffffff, #f1e8ff);
          border: 1px solid rgba(124, 58, 237, 0.1);
          box-shadow: 0 24px 80px rgba(55, 35, 95, 0.08);
        }

        .finalCta h2 {
          max-width: 800px;
          margin: 0 auto;
        }

        .finalCta span {
          display: block;
          margin: 18px auto 0;
          color: #6d647c;
          font-size: 17px;
          line-height: 1.8;
        }

        @media (max-width: 980px) {
          .container {
            width: min(100% - 22px, 1220px);
            padding-top: 18px;
          }

          .hero {
            grid-template-columns: 1fr;
            padding: 24px 18px 20px;
            gap: 28px;
            border-radius: 30px;
          }

          .heroCopy {
            padding: 6px 0 0;
          }

          .hero h1 {
            font-size: clamp(40px, 12vw, 58px);
            line-height: 0.96;
          }

          .hero p {
            font-size: 16px;
            line-height: 1.75;
          }

          .actions {
            flex-direction: column;
          }

          .primaryBtn,
          .secondaryBtn {
            width: 100%;
          }

          .trustLine {
            display: grid;
            gap: 10px;
          }

          .heroMedia {
            height: 420px;
            border-radius: 28px;
          }

          .topBadge {
            top: 14px;
            right: 14px;
          }

          .bottomBadge {
            left: 14px;
            right: 14px;
            bottom: 14px;
          }

          .featureGrid,
          .stepGrid {
            grid-template-columns: 1fr;
          }

          .introStrip,
          .journey,
          .subjectsSection,
          .finalCta {
            margin-top: 58px;
          }

          .journey,
          .finalCta {
            padding: 28px 20px;
            border-radius: 30px;
          }
        }

        @media (max-width: 520px) {
          .heroMedia {
            height: 360px;
          }

          .feature,
          .step {
            padding: 22px;
          }

          .mediaBadge strong {
            font-size: 14px;
          }

          .mediaBadge span {
            font-size: 12px;
          }
        }
      `}</style>
    </main>
  )
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div className="feature">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  )
}

function Step({
  number,
  title,
  text,
}: {
  number: string
  title: string
  text: string
}) {
  return (
    <div className="step">
      <span className="stepNumber">{number}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  )
}