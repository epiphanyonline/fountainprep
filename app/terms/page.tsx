'use client'

import Link from 'next/link'

export default function TermsPage() {
  return (
    <main className="legal-page">
      <section className="legal-card">
        <p className="legal-eyebrow">Fountain Prep Terms</p>
        <h1>Terms and Conditions</h1>
        <p className="legal-updated">Last updated: 20 July 2026</p>

        <section>
          <h2>1. About These Terms</h2>
          <p>
            These Terms and Conditions apply when you use the Fountain Prep
            website or book tutoring services from FOUNTAIN PREP LIMITED
            (&quot;Fountain Prep&quot;, &quot;we&quot;, &quot;us&quot; or
            &quot;our&quot;). By creating an account or purchasing a lesson or
            package, you agree to these Terms.
          </p>
          <p>
            If a learner is under 18, the parent or guardian making the booking
            enters into the contract on the learner&apos;s behalf and is
            responsible for the account, payments, communications and the
            learner&apos;s compliance with these Terms.
          </p>
        </section>

        <section>
          <h2>2. Our Tutoring Services</h2>
          <p>
            Fountain Prep provides private online tutoring and related learning
            support. The subject, tutor, lesson duration, frequency, first lesson
            date, timetable, package length and price are shown during booking
            and in the parent dashboard.
          </p>
          <p>
            The platform also supports tutor onboarding and verification,
            scheduling, lesson administration, safeguarding communications and
            learning support.
          </p>
          <p>
            Lesson outcomes depend on many factors, including attendance,
            participation and independent practice. We do not guarantee a
            particular grade, examination result or academic outcome.
          </p>
        </section>

        <section>
          <h2>3. Bookings and Weekly Timetables</h2>
          <ul>
            <li>First lessons normally require at least 72 hours&apos; notice.</li>
            <li>
              When you select a weekly start date and time, the remaining lessons
              in the package are normally scheduled for the same day and time
              each week.
            </li>
            <li>
              A timetable is not finally reserved until payment has been
              confirmed.
            </li>
            <li>
              All displayed lesson times should be checked carefully in the
              timezone shown during booking and in your dashboard.
            </li>
          </ul>
          <p>
            Please tell us promptly if any booking confirmation appears
            incorrect. Availability can change before payment is completed.
          </p>
        </section>

        <section>
          <h2>4. Prices and Payment</h2>
          <p>
            Prices and the number of lessons included are displayed before
            payment. Payments are processed securely by Stripe or another
            payment provider identified at checkout. Your booking is confirmed
            only after we receive successful payment confirmation.
          </p>
          <p>
            You are responsible for providing accurate billing information and
            for any currency conversion or card-provider charges applied by your
            own bank or payment provider.
          </p>
        </section>

        <section>
          <h2>5. Your Right to Cancel an Online Purchase</h2>
          <p>
            If you are a UK consumer purchasing online, you will normally have a
            legal right to cancel the service contract within 14 days after the
            contract is made. You may exercise that right by emailing
            <strong> support@fountainprep.com</strong> with your name, booking
            reference and a clear statement that you wish to cancel.
          </p>
          <p>
            If you expressly ask us to begin providing lessons during the
            14-day cancellation period and then cancel before the service is
            fully completed, we may charge a proportionate amount for services
            already supplied. If the service is fully performed during that
            period following your express request and acknowledgement, your
            statutory right to cancel may end. Nothing in these Terms limits any
            mandatory consumer right.
          </p>
        </section>

        <section>
          <h2>6. Our 48-Hour Cancellation and Rescheduling Policy</h2>
          <p>
            To cancel or reschedule an individual lesson, you must contact us at
            least 48 hours before its scheduled start time. Requests should be
            sent through the Fountain Prep messaging system or to
            <strong> support@fountainprep.com</strong>.
          </p>
          <ul>
            <li>
              With at least 48 hours&apos; notice, we will normally offer a
              reasonable alternative time or return the lesson as a credit,
              subject to tutor availability and the package period.
            </li>
            <li>
              With less than 48 hours&apos; notice, or where a learner does not
              attend, the lesson may be treated as used because the tutor&apos;s
              time was reserved and may no longer be available to another
              learner.
            </li>
            <li>
              Genuine emergencies will be considered reasonably and may be dealt
              with at our discretion, without affecting your legal rights.
            </li>
          </ul>
          <p>
            Any cancellation charge or retained payment will be reasonable and
            will not exceed the loss directly caused by the cancellation, as
            required by applicable consumer law.
          </p>
        </section>

        <section>
          <h2>7. Tutor Cancellation or Unavailability</h2>
          <p>
            If a tutor cannot deliver a lesson, the lesson will not be lost. We
            will offer a replacement time, lesson credit or, where we cannot
            provide a suitable replacement, an appropriate refund for the
            undelivered lesson. We may offer a suitably qualified replacement
            tutor where reasonably necessary.
          </p>
        </section>

        <section>
          <h2>8. Package Cancellation and Refunds</h2>
          <p>
            Lessons already delivered are not refundable merely because a
            customer changes their mind. This does not affect remedies available
            where a service was not provided with reasonable care and skill or
            was otherwise not supplied as agreed.
          </p>
          <p>
            If you ask to end a package after any applicable cooling-off period,
            we will review unused lessons and the circumstances of the request.
            Any refund may take account of services already supplied and
            reasonable losses directly caused by the cancellation, but we will
            not impose a disproportionate cancellation charge or automatically
            retain all advance payments. Refunds are returned to the original
            payment method where practicable.
          </p>
        </section>

        <section>
          <h2>9. Online Lesson Requirements</h2>
          <p>
            You are responsible for a suitable device, a stable internet
            connection, working audio and video where required, and a quiet,
            appropriate learning environment. Please join lessons on time using
            the approved link shown in the dashboard or confirmation message.
          </p>
          <p>
            If a material technical problem on our or the tutor&apos;s side prevents
            the lesson from being delivered, we will act reasonably to
            reschedule or credit the affected time. Problems limited to the
            customer&apos;s equipment or connection do not automatically entitle the
            customer to a refund, although we will try to assist.
          </p>
        </section>

        <section>
          <h2>10. Safeguarding and Acceptable Conduct</h2>
          <p>Parents and guardians agree to:</p>
          <ul>
            <li>Provide accurate parent and learner information.</li>
            <li>Help learners attend lessons punctually and prepared.</li>
            <li>Supervise younger learners where reasonably appropriate.</li>
            <li>Raise concerns promptly through approved support channels.</li>
          </ul>
          <p>Tutors using Fountain Prep agree to:</p>
          <ul>
            <li>Provide accurate onboarding and verification information.</li>
            <li>Deliver lessons professionally, safely and punctually.</li>
            <li>Follow safeguarding, privacy and data-protection requirements.</li>
            <li>Use approved communication channels where required.</li>
          </ul>
          <p>
            Parents, learners and tutors must behave respectfully and use
            Fountain Prep only for lawful educational purposes. Harassment,
            discrimination, threats, abuse, inappropriate contact, sharing
            harmful material or attempts to bypass safeguarding arrangements are
            prohibited.
          </p>
          <p>
            Users must not submit false documents or information, disclose
            private learner or family information improperly, or bypass Fountain
            Prep&apos;s approved booking and payment processes.
          </p>
          <p>
            Lessons, images, messages or personal details must not be recorded,
            copied, published or shared without a lawful basis and all required
            permissions. Safeguarding concerns may be escalated to appropriate
            authorities where necessary.
          </p>
        </section>

        <section>
          <h2>11. Communications</h2>
          <p>
            Booking, payment, lesson and safeguarding communications should use
            Fountain Prep&apos;s approved systems and contact details. You must keep
            your account details and email address accurate and check booking
            confirmations and dashboard notices promptly.
          </p>
        </section>

        <section>
          <h2>12. Learning Materials and Intellectual Property</h2>
          <p>
            Unless stated otherwise, Fountain Prep and its licensors own the
            platform, branding and learning materials supplied through the
            service. Materials are provided for the learner&apos;s personal,
            non-commercial educational use and must not be resold, republished or
            distributed without permission.
          </p>
        </section>

        <section>
          <h2>13. Accounts, Suspension and Ending Services</h2>
          <p>
            You must keep login details secure and tell us promptly about
            suspected unauthorised access. We may suspend or end access where
            reasonably necessary for non-payment, serious or repeated breach of
            these Terms, safeguarding concerns, unlawful conduct or platform
            security. We will act proportionately and consider any refund due for
            services not supplied.
          </p>
          <p>
            Tutor accounts may require identity, qualification, safeguarding and
            other appropriate checks before approval. Creating a tutor account
            does not guarantee approval, publication of a profile or future
            bookings.
          </p>
        </section>

        <section>
          <h2>14. Liability</h2>
          <p>
            We are responsible for losses that are a foreseeable result of our
            breach of these Terms or failure to use reasonable care and skill. We
            are not responsible for losses that were not foreseeable, for
            business losses suffered by a consumer, or for events outside our
            reasonable control where we have taken reasonable steps to reduce the
            effect.
          </p>
          <p>
            Nothing in these Terms excludes or limits liability where it would be
            unlawful to do so, including liability for death or personal injury
            caused by negligence, fraud or fraudulent misrepresentation, or your
            statutory consumer rights.
          </p>
        </section>

        <section>
          <h2>15. Privacy and Data Protection</h2>
          <p>
            We handle personal information as described in our{' '}
            <Link href="/data-protection-policy">Data Protection Policy</Link>.
            Additional safeguarding and legal retention requirements may apply
            to records involving children, payments, disputes or safety.
          </p>
        </section>

        <section>
          <h2>16. Changes to These Terms</h2>
          <p>
            We may update these Terms to reflect legal, safety, operational or
            service changes. The latest version will be published on this page.
            Changes will not remove rights already acquired under an existing
            paid booking without a lawful and fair reason.
          </p>
        </section>

        <section>
          <h2>17. Governing Law</h2>
          <p>
            These Terms are governed by the laws of England and Wales. Courts in
            England and Wales will have jurisdiction, except that a consumer who
            lives elsewhere may also rely on any mandatory protections and bring
            proceedings available under the law of the place where they live.
          </p>
        </section>

        <section>
          <h2>18. Contact Us</h2>
          <p>
            Questions, cancellations or complaints can be sent to:
            <strong> support@fountainprep.com</strong>
          </p>
          <p>FOUNTAIN PREP LIMITED</p>
        </section>

        <div className="legal-actions">
          <Link href="/">Back to Home</Link>
          <Link href="/data-protection-policy" className="secondary-link">
            Data Protection Policy
          </Link>
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

  a {
    color: #6f42c1;
    font-weight: 800;
  }

  .legal-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
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

  .legal-actions .secondary-link {
    background: white;
    border: 1px solid rgba(111,66,193,0.22);
    color: #6f42c1;
  }

  @media (max-width: 640px) {
    .legal-card {
      padding: 28px 20px;
      border-radius: 26px;
    }
  }
`