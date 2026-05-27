'use client'

import Link from 'next/link'

export default function SafeguardingPage() {
  return (
    <main className="legal-page">
      <section className="legal-card">
        <p className="legal-eyebrow">Fountain Prep Policy</p>
        <h1>Safeguarding Policy</h1>
        <p className="legal-updated">Last updated: 27 May 2026</p>

        <section>
          <h2>1. Commitment to Child Safety</h2>
          <p>
            Fountain Prep is committed to creating a safe, respectful, and
            professional online learning environment for children, families, and
            tutors.
          </p>
        </section>

        <section>
          <h2>2. Tutor Conduct</h2>
          <ul>
            <li>Tutors must communicate professionally at all times.</li>
            <li>Tutors must not use inappropriate language or behaviour.</li>
            <li>Tutors must not request unnecessary personal information.</li>
            <li>Tutors must not arrange private contact outside approved channels.</li>
            <li>Tutors must report safeguarding concerns promptly.</li>
          </ul>
        </section>

        <section>
          <h2>3. Parent and Student Safety</h2>
          <p>
            Parents are encouraged to ensure children learn in a safe environment
            and to report any concern about tutor conduct, lesson content, or
            communication immediately.
          </p>
        </section>

        <section>
          <h2>4. Online Lesson Expectations</h2>
          <ul>
            <li>Lessons should take place at the agreed time and format.</li>
            <li>Communication should remain learning-focused.</li>
            <li>Lessons should not include inappropriate content.</li>
            <li>Students and tutors should behave respectfully.</li>
          </ul>
        </section>

        <section>
          <h2>5. Tutor Verification</h2>
          <p>
            Fountain Prep may request CVs, identity documents, qualification
            proof, references, background information, or other verification
            evidence before approving tutors.
          </p>
        </section>

        <section>
          <h2>6. Reporting Concerns</h2>
          <p>
            Any safeguarding concern should be reported immediately to Fountain
            Prep. Serious concerns may be escalated to appropriate authorities
            where required.
          </p>
        </section>

        <section>
          <h2>7. Prohibited Behaviour</h2>
          <ul>
            <li>Private unsupervised communication outside approved channels.</li>
            <li>Inappropriate personal questions.</li>
            <li>Bullying, discrimination, harassment, or intimidation.</li>
            <li>Sharing student information without permission.</li>
            <li>Any behaviour that may place a child at risk.</li>
          </ul>
        </section>

        <section>
          <h2>8. Suspension</h2>
          <p>
            Fountain Prep may suspend tutor or user accounts while safeguarding
            concerns are reviewed.
          </p>
        </section>

        <section>
          <h2>9. Contact</h2>
          <p>
            Safeguarding concerns should be sent to:
            <strong> safeguarding@fountainprep.com</strong>
          </p>
        </section>

        <div className="legal-actions">
          <Link href="/">Back to Home</Link>
        </div>
      </section>

      <style jsx>{legalStyles}</style>
    </main>
  )
}

const legalStyles = `
  .legal-page {
    min-height: 100vh;
    padding: 56px 20px 90px;
    background: radial-gradient(circle at top right, #eadcff 0, #faf7ff 36%, #f8f5ff 100%);
    color: #21152d;
  }

  .legal-card {
    max-width: 920px;
    margin: 0 auto;
    background: rgba(255,255,255,0.96);
    border: 1px solid rgba(111,66,193,0.12);
    border-radius: 32px;
    padding: 44px;
    box-shadow: 0 24px 70px rgba(71,43,117,0.1);
  }

  .legal-eyebrow {
    margin: 0;
    color: #6f42c1;
    font-weight: 900;
  }

  h1 {
    margin: 12px 0 0;
    font-size: clamp(38px, 6vw, 64px);
    line-height: 1;
    letter-spacing: -0.05em;
    font-weight: 950;
  }

  .legal-updated {
    margin-top: 14px;
    color: #6f637e;
    font-weight: 700;
  }

  section {
    margin-top: 34px;
  }

  h2 {
    font-size: 22px;
    margin-bottom: 12px;
  }

  p, li {
    color: #5f5871;
    line-height: 1.8;
    font-size: 16px;
  }

  ul {
    padding-left: 22px;
  }

  .legal-actions {
    margin-top: 38px;
  }

  .legal-actions a {
    display: inline-flex;
    padding: 14px 20px;
    border-radius: 16px;
    background: #6f42c1;
    color: white;
    font-weight: 900;
    text-decoration: none;
  }

  @media (max-width: 640px) {
    .legal-card {
      padding: 28px 20px;
      border-radius: 26px;
    }
  }
`