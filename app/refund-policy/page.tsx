'use client'

import Link from 'next/link'

export default function RefundPolicyPage() {
  return (
    <main className="legal-page">
      <section className="legal-card">
        <p className="legal-eyebrow">Fountain Prep Policy</p>
        <h1>Refund Policy</h1>
        <p className="legal-updated">Last updated: 27 May 2026</p>

        <section>
          <h2>1. Overview</h2>
          <p>
            Fountain Prep aims to provide clear, fair, and parent-friendly refund
            rules. This policy explains when refunds, rescheduling, or credits
            may apply.
          </p>
        </section>

        <section>
          <h2>2. Monthly and Multi-Month Plans</h2>
          <p>
            Learning plans are purchased as structured lesson packages. A plan
            may include weekly or twice-weekly lessons depending on the option
            selected during scheduling.
          </p>
        </section>

        <section>
          <h2>3. Eligible Refunds</h2>
          <ul>
            <li>Duplicate payments.</li>
            <li>Payment taken in error.</li>
            <li>Tutor no-show where no suitable replacement is offered.</li>
            <li>Platform-caused technical failure that prevents lesson delivery.</li>
            <li>Cancelled lessons where Fountain Prep confirms refund eligibility.</li>
          </ul>
        </section>

        <section>
          <h2>4. Rescheduling</h2>
          <p>
            Where possible, eligible missed or cancelled lessons may be
            rescheduled instead of refunded. Rescheduling depends on tutor
            availability and reasonable notice.
          </p>
        </section>

        <section>
          <h2>5. Late Cancellations and Missed Lessons</h2>
          <p>
            Lessons missed by the parent or student, or cancelled with late
            notice, may not be refundable. Fountain Prep may consider exceptional
            circumstances at its discretion.
          </p>
        </section>

        <section>
          <h2>6. Tutor Cancellation</h2>
          <p>
            If a tutor cancels, Fountain Prep may offer a replacement tutor,
            rescheduled lesson, credit, or refund depending on the situation.
          </p>
        </section>

        <section>
          <h2>7. Completed Lessons</h2>
          <p>
            Completed lessons are generally non-refundable unless there is a
            serious service issue confirmed by Fountain Prep.
          </p>
        </section>

        <section>
          <h2>8. Refund Request Process</h2>
          <p>
            Refund requests should be sent to
            <strong> support@fountainprep.com</strong> with the parent name,
            student name, booking reference, lesson date, and reason for request.
          </p>
        </section>

        <section>
          <h2>9. Processing Time</h2>
          <p>
            Approved refunds will usually be processed back to the original
            payment method. Processing times may depend on the payment provider
            and bank.
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