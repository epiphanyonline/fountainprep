'use client'

import Link from 'next/link'

export default function CookiePolicyPage() {
  return (
    <main className="legal-page">
      <section className="legal-card">
        <p className="legal-eyebrow">Fountain Prep Policy</p>
        <h1>Cookie Policy</h1>
        <p className="legal-updated">Last updated: 27 May 2026</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            This Cookie Policy explains how Fountain Prep may use cookies and
            similar technologies to operate, secure, and improve the platform.
          </p>
        </section>

        <section>
          <h2>2. What Cookies Are</h2>
          <p>
            Cookies are small files stored on a device when a user visits a
            website or app. They help websites remember information and improve
            user experience.
          </p>
        </section>

        <section>
          <h2>3. Types of Cookies We May Use</h2>
          <ul>
            <li>
              <strong>Essential cookies:</strong> required for login, security,
              account sessions, and platform functionality.
            </li>
            <li>
              <strong>Preference cookies:</strong> used to remember settings and
              improve usability.
            </li>
            <li>
              <strong>Analytics cookies:</strong> used to understand platform
              usage and improve services.
            </li>
            <li>
              <strong>Security cookies:</strong> used to help detect misuse,
              protect accounts, and support safe access.
            </li>
          </ul>
        </section>

        <section>
          <h2>4. Third-Party Services</h2>
          <p>
            Fountain Prep may use trusted service providers for hosting,
            authentication, payments, analytics, and communication. These
            providers may use cookies or similar technologies as part of their
            services.
          </p>
        </section>

        <section>
          <h2>5. Managing Cookies</h2>
          <p>
            Users can manage or block cookies through their browser settings.
            Some essential platform features may not work correctly if required
            cookies are disabled.
          </p>
        </section>

        <section>
          <h2>6. Changes to This Policy</h2>
          <p>
            We may update this Cookie Policy as the platform develops or as
            services change.
          </p>
        </section>

        <section>
          <h2>7. Contact</h2>
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