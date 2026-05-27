'use client'

import Link from 'next/link'

export default function TermsPage() {
  return (
    <main className="legal-page">
      <section className="legal-card">
        <p className="legal-eyebrow">Fountain Prep Policy</p>
        <h1>Terms & Conditions</h1>
        <p className="legal-updated">Last updated: 27 May 2026</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            These Terms and Conditions govern the use of Fountain Prep by
            parents, students, tutors, and platform users. By using the platform,
            users agree to follow these terms.
          </p>
        </section>

        <section>
          <h2>2. Platform Role</h2>
          <p>
            Fountain Prep provides an online platform for structured tutoring,
            learning support, tutor onboarding, scheduling, and lesson
            administration.
          </p>
        </section>

        <section>
          <h2>3. Parent Responsibilities</h2>
          <ul>
            <li>Provide accurate parent and student information.</li>
            <li>Ensure students attend lessons on time.</li>
            <li>Supervise younger children where appropriate.</li>
            <li>Respect tutors and platform rules.</li>
            <li>Raise concerns promptly through official support channels.</li>
          </ul>
        </section>

        <section>
          <h2>4. Tutor Responsibilities</h2>
          <ul>
            <li>Provide accurate onboarding and verification information.</li>
            <li>Deliver lessons professionally and on time.</li>
            <li>Follow safeguarding and data protection requirements.</li>
            <li>Communicate only through approved platform channels where required.</li>
            <li>Maintain respectful and appropriate conduct at all times.</li>
          </ul>
        </section>

        <section>
          <h2>5. Payments</h2>
          <p>
            Parents must pay the applicable plan or booking fee before lessons
            are confirmed. Payment terms, pricing, and plan details may vary
            depending on the selected learning package.
          </p>
        </section>

        <section>
          <h2>6. Cancellations and Refunds</h2>
          <p>
            Refunds and rescheduling are handled according to Fountain Prep’s
            Refund Policy.
          </p>
        </section>

        <section>
          <h2>7. Tutor Approval</h2>
          <p>
            Tutor accounts may require review, verification, and approval before
            becoming publicly available or eligible to receive bookings.
          </p>
        </section>

        <section>
          <h2>8. Prohibited Conduct</h2>
          <ul>
            <li>Harassment, abuse, discrimination, or inappropriate behaviour.</li>
            <li>Sharing private student or parent information outside the platform.</li>
            <li>Bypassing Fountain Prep payment or booking processes.</li>
            <li>Submitting false documents or misleading information.</li>
            <li>Any conduct that places children, families, or tutors at risk.</li>
          </ul>
        </section>

        <section>
          <h2>9. Account Suspension</h2>
          <p>
            Fountain Prep may suspend or remove accounts where users breach
            these terms, safeguarding rules, data protection requirements, or
            platform policies.
          </p>
        </section>

        <section>
          <h2>10. Contact</h2>
          <p>
            Questions about these terms can be sent to:
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