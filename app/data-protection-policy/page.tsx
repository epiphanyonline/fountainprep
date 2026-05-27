'use client'

import Link from 'next/link'

export default function DataProtectionPolicyPage() {
  return (
    <main className="legal-page">
      <section className="legal-card">
        <p className="legal-eyebrow">Fountain Prep Policy</p>
        <h1>Data Protection Policy</h1>
        <p className="legal-updated">Last updated: 27 May 2026</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            Fountain Prep is committed to protecting personal information and
            handling data responsibly. This policy explains how we collect, use,
            store, and protect information relating to parents, students, tutors,
            and platform users.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <p>
            We may collect parent details, student learning details, tutor
            profile information, booking records, payment references, uploaded
            tutor documents, communication records, and technical information
            needed to operate the platform.
          </p>
        </section>

        <section>
          <h2>3. How We Use Information</h2>
          <ul>
            <li>To create and manage user accounts.</li>
            <li>To arrange lessons and learning support.</li>
            <li>To verify tutors and review applications.</li>
            <li>To process bookings, payments, refunds, and support requests.</li>
            <li>To protect children, families, tutors, and the platform.</li>
            <li>To improve the safety and quality of our services.</li>
          </ul>
        </section>

        <section>
          <h2>4. Children’s Information</h2>
          <p>
            Student information is used only for learning support, lesson
            matching, safeguarding, communication, and platform administration.
            Tutors must not use student data outside Fountain Prep’s approved
            learning purposes.
          </p>
        </section>

        <section>
          <h2>5. Tutor Documents</h2>
          <p>
            Tutors may be asked to upload CVs, proof of identity, qualification
            documents, and other verification evidence. These documents are used
            for onboarding, review, safeguarding, and platform compliance.
          </p>
        </section>

        <section>
          <h2>6. Data Sharing</h2>
          <p>
            We do not sell personal information. We may share limited data with
            trusted service providers where required for hosting, payments,
            communication, security, lesson delivery, and legal compliance.
          </p>
        </section>

        <section>
          <h2>7. Data Security</h2>
          <p>
            We use reasonable technical and organisational measures to protect
            personal information. Access to sensitive information is limited to
            authorised users who need it for platform operations.
          </p>
        </section>

        <section>
          <h2>8. Data Retention</h2>
          <p>
            We keep information only for as long as needed for account
            management, safeguarding, legal, financial, dispute resolution, and
            platform administration purposes.
          </p>
        </section>

        <section>
          <h2>9. User Rights</h2>
          <p>
            Users may request access, correction, deletion, or restriction of
            their personal information, subject to legal, safeguarding, and
            operational requirements.
          </p>
        </section>

        <section>
          <h2>10. Contact</h2>
          <p>
            Questions about this policy can be sent to:
            <strong> support@fountainprep.com</strong>
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