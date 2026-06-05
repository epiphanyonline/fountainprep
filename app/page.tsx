'use client'

import Link from 'next/link'
import SupportWidget from './components/SupportWidget'

const subjects = ['Maths', 'English', 'Science', 'Coding', 'Yoruba', 'Igbo', 'Hausa', 'Music']

const trustItems = [
  'Private 1-to-1 lessons',
  'Parent progress updates',
  'Flexible online booking',
]

const features = [
  {
    title: 'Private attention',
    text: 'Your child is not sharing lesson time with other students. The tutor focuses fully on their pace, gaps, and confidence.',
  },
  {
    title: 'Progress you can see',
    text: 'Parents get clearer updates so they know what was covered, what improved, and what needs more practice.',
  },
  {
    title: 'Built around your child',
    text: 'Lessons can be adjusted for school support, confidence building, language learning, coding, or creative skills.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Add your child',
    text: 'Create a simple profile with their age, level, and learning need.',
  },
  {
    number: '02',
    title: 'Choose a subject',
    text: 'Pick academic tutoring, African languages, coding, music, or confidence support.',
  },
  {
    number: '03',
    title: 'Book privately',
    text: 'Choose a tutor and time that works for your family.',
  },
]

export default function HomePage() {
  return (
    <main className="fp-page">
      <section className="fp-hero">
        <div className="fp-hero-copy">
          <div className="fp-pill">
            <span />
            Private 1-to-1 online tutoring
          </div>

          <h1>Private tutoring that helps your child learn with confidence.</h1>

          <p className="fp-lead">
            Fountain Prep offers focused private
            lessons in academics, African languages, coding, music, and confidence
            building — with progress updates after learning.
          </p>

          <div className="fp-actions">
            <Link href="/parent/students" className="fp-primary">
              Start with your child
            </Link>
            <Link href="/subjects" className="fp-secondary">
              Explore subjects
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
            alt="Child learning Yoruba online with a private tutor"
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

      <section className="fp-proof">
        <div>
          <strong>Private</strong>
          <span>Every lesson is focused on one child.</span>
        </div>
        <div>
          <strong>Structured</strong>
          <span>Lessons feel purposeful, not random.</span>
        </div>
        <div>
          <strong>Trusted</strong>
          <span>Designed to give parents confidence.</span>
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
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="fp-value">
        <div>
          <p>Parent confidence</p>
          <h2>A better tutoring experience.</h2>
          <span>
            Parents pay for value. That is why Fountain Prep is positioned around
            private attention, structured learning, and feedback parents can understand.
          </span>
        </div>

        <div className="fp-report">
          <div className="fp-report-top">
            <strong>Lesson progress update</strong>
            <span>After class</span>
          </div>

          <div className="fp-report-row">
            <b>Covered today</b>
            <span>Reading practice, vocabulary, pronunciation</span>
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

      <section className="fp-section">
        <div className="fp-section-head centered">
          <p>Simple parent journey</p>
          <h2>Start private tutoring in three easy steps.</h2>
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

      <section className="fp-subjects">
        <p>Popular learning areas</p>
        <h2>Academic subjects, African languages, coding, and creative skills.</h2>

        <div className="fp-subject-grid">
          {subjects.map((subject) => (
            <Link href="/subjects" key={subject} className="fp-subject">
              {subject}
            </Link>
          ))}
        </div>
      </section>

      <section className="fp-final">
        <p>Start today</p>
        <h2>Give your child focused private tutoring they can grow with.</h2>
        <span>
          Add your child, choose a subject, and book a trusted private tutor online.
        </span>

        <div className="fp-actions centered-actions">
          <Link href="/parent/students" className="fp-primary">
            Start with your child
          </Link>
          <Link href="/subjects" className="fp-secondary">
            View subjects
          </Link>
        </div>
      </section>

      <style jsx global>{`
        .fp-page {
          min-height: 100vh;
          color: #201230;
          background:
            radial-gradient(circle at 10% 0%, rgba(124, 58, 237, 0.12), transparent 30%),
            radial-gradient(circle at 90% 6%, rgba(236, 72, 153, 0.08), transparent 28%),
            linear-gradient(180deg, #fffaff 0%, #fbf7ff 44%, #f5edff 100%);
          padding: 22px 16px 80px;
          overflow: hidden;
        }

        .fp-hero,
        .fp-proof,
        .fp-section,
        .fp-value,
        .fp-subjects,
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
            linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(249, 244, 255, 0.94)),
            radial-gradient(circle at top right, rgba(124, 58, 237, 0.16), transparent 34%);
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
        .fp-value h2,
        .fp-subjects h2,
        .fp-final h2 {
          margin: 0;
          color: #1f1230;
          font-weight: 950;
          letter-spacing: -0.055em;
        }

        .fp-hero h1 {
          max-width: 650px;
          font-size: clamp(42px, 5.2vw, 70px);
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
        .fp-secondary {
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

        .fp-primary {
          color: #fff;
          background: linear-gradient(135deg, #7c3aed, #5b21b6);
          box-shadow: 0 18px 42px rgba(109, 40, 217, 0.28);
        }

        .fp-secondary {
          color: #241535;
          background: #fff;
          border: 1px solid rgba(124, 58, 237, 0.16);
          box-shadow: 0 14px 34px rgba(55, 35, 95, 0.06);
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
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(25, 14, 38, 0.28), transparent 50%);
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

        .fp-proof {
          margin-top: 18px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .fp-proof div,
        .fp-card,
        .fp-step,
        .fp-report,
        .fp-subjects,
        .fp-final {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(124, 58, 237, 0.1);
          box-shadow: 0 18px 48px rgba(55, 35, 95, 0.07);
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

        .fp-section {
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
        .fp-value p,
        .fp-subjects p,
        .fp-final p {
          margin: 0 0 10px;
          color: #6d28d9;
          font-size: 14px;
          font-weight: 950;
        }

        .fp-section h2,
        .fp-value h2,
        .fp-subjects h2,
        .fp-final h2 {
          font-size: clamp(34px, 4.3vw, 56px);
          line-height: 1.04;
        }

        .fp-feature-grid {
          margin-top: 26px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
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

        .fp-value {
          margin-top: 78px;
          display: grid;
          grid-template-columns: 1fr 0.9fr;
          gap: 26px;
          align-items: center;
          padding: 38px;
          border-radius: 38px;
          background:
            radial-gradient(circle at top right, rgba(124, 58, 237, 0.14), transparent 34%),
            linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(246, 239, 255, 0.95));
          border: 1px solid rgba(124, 58, 237, 0.11);
          box-shadow: 0 24px 76px rgba(55, 35, 95, 0.08);
        }

        .fp-value span {
          display: block;
          margin-top: 18px;
          color: #6d647c;
          font-size: 16.5px;
          line-height: 1.75;
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
          font-size: 14.5px;
          line-height: 1.55;
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

        .fp-subjects,
        .fp-final {
          margin-top: 78px;
          border-radius: 38px;
          padding: 38px;
          background:
            radial-gradient(circle at top right, rgba(124, 58, 237, 0.13), transparent 36%),
            linear-gradient(135deg, #ffffff, #f5efff);
        }

        .fp-subject-grid {
          margin-top: 26px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
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

        .fp-final {
          text-align: center;
        }

        .fp-final h2 {
          max-width: 820px;
          margin: 0 auto;
        }

        .fp-final span {
          display: block;
          max-width: 660px;
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

          .fp-proof,
          .fp-feature-grid,
          .fp-step-grid,
          .fp-value {
            grid-template-columns: 1fr;
          }

          .fp-section,
          .fp-value,
          .fp-subjects,
          .fp-final {
            margin-top: 56px;
          }

          .fp-value,
          .fp-subjects,
          .fp-final {
            padding: 26px 20px;
            border-radius: 30px;
          }

          .fp-section h2,
          .fp-value h2,
          .fp-subjects h2,
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

          .fp-subject-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 380px) {
          .fp-hero h1 {
            font-size: 36px;
          }

          .fp-hero-image-wrap {
            height: 335px;
          }

          .fp-subject-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <SupportWidget />
    </main>
  )
}