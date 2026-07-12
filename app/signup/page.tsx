'use client'

import Link from 'next/link'

const signupOptions = [
  {
    title: 'Parent or Guardian',
    description: 'I am booking and managing lessons for a child.',
    icon: '👨‍👩‍👧',
    href: '/signup/parent',
    action: 'Continue as Parent',
    points: [
      'Academic tutoring',
      'African language lessons',
      'Progress reports',
      'Flexible scheduling',
    ],
    featured: false,
    badge: '',
  },
  {
    title: 'Adult Learner',
    description: 'I am an adult booking private language lessons for myself.',
    icon: '🎓',
    href: '/signup/learner',
    action: 'Continue as Adult Learner',
    points: [
      'Learn Yoruba',
      'Learn Igbo',
      'Learn Hausa',
      'More African languages coming soon',
    ],
    featured: true,
    badge: 'NEW',
  },
  {
    title: 'Tutor',
    description: 'I want to teach learners through Fountain Prep.',
    icon: '👩🏾‍🏫',
    href: '/signup/tutor',
    action: 'Become a Tutor',
    points: [
      'Teach online',
      'Flexible availability',
      'Weekly payouts',
      'Premium teaching platform',
    ],
    featured: false,
    badge: '',
  },
]

export default function SignupLandingPage() {
  return (
    <main className="signup-page">
      <div className="signup-container">
        <section className="signup-hero">
          <span className="signup-badge">Join Fountain Prep</span>

          <h1>Who are you joining as?</h1>

          <p>
            Choose the option that best describes who will be taking or
            managing the lessons.
          </p>
        </section>

        <section className="signup-cards">
          {signupOptions.map((option) => (
            <Link
              key={option.href}
              href={option.href}
              className={
                option.featured
                  ? 'signup-card featured'
                  : 'signup-card'
              }
              aria-label={option.action}
            >
              {option.badge ? (
                <span className="new-badge">{option.badge}</span>
              ) : null}

              <div className="card-icon">{option.icon}</div>

              <div className="card-content">
                <h2>{option.title}</h2>

                <p className="card-description">{option.description}</p>

                <ul>
                  {option.points.map((point) => (
                    <li key={point}>
                      <span>✓</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <span className="card-action">
                {option.action}
                <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </section>

        <div className="login-row">
          <span>Already have an account?</span>
          <Link href="/login">Log in</Link>
        </div>
      </div>

      <style jsx global>{`
        .signup-page {
          min-height: 100vh;
          padding: 64px 20px 80px;
          color: #241235;
          background:
            radial-gradient(
              circle at 8% 0%,
              rgba(124, 58, 237, 0.13),
              transparent 30%
            ),
            radial-gradient(
              circle at 92% 6%,
              rgba(236, 72, 153, 0.07),
              transparent 28%
            ),
            linear-gradient(180deg, #fffaff 0%, #f7f1ff 100%);
        }

        .signup-container {
          width: min(1240px, 100%);
          margin: 0 auto;
        }

        .signup-hero {
          max-width: 800px;
          margin: 0 auto 46px;
          text-align: center;
        }

        .signup-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 17px;
          border-radius: 999px;
          color: #6d28d9;
          background: #efe7ff;
          border: 1px solid #e5d8ff;
          font-size: 13px;
          font-weight: 950;
        }

        .signup-hero h1 {
          margin: 20px 0 0;
          color: #241235;
          font-size: clamp(42px, 6vw, 68px);
          line-height: 0.98;
          letter-spacing: -0.06em;
          font-weight: 950;
        }

        .signup-hero p {
          max-width: 690px;
          margin: 18px auto 0;
          color: #6d647c;
          font-size: 18px;
          line-height: 1.65;
        }

        .signup-cards {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
          align-items: stretch;
        }

        .signup-card {
          position: relative;
          min-height: 470px;
          display: flex;
          flex-direction: column;
          padding: 32px;
          border-radius: 32px;
          color: inherit;
          text-decoration: none;
          background: rgba(255, 255, 255, 0.96);
          border: 2px solid transparent;
          box-shadow: 0 24px 70px rgba(55, 35, 95, 0.09);
          transition:
            transform 180ms ease,
            box-shadow 180ms ease,
            border-color 180ms ease;
          cursor: pointer;
        }

        .signup-card:hover {
          transform: translateY(-6px);
          border-color: rgba(124, 58, 237, 0.45);
          box-shadow: 0 34px 90px rgba(74, 44, 120, 0.16);
        }

        .signup-card:focus-visible {
          outline: 4px solid rgba(124, 58, 237, 0.2);
          outline-offset: 4px;
        }

        .signup-card.featured {
          border-color: #7c3aed;
          background:
            radial-gradient(
              circle at top right,
              rgba(124, 58, 237, 0.12),
              transparent 34%
            ),
            rgba(255, 255, 255, 0.98);
          box-shadow: 0 28px 78px rgba(109, 40, 217, 0.16);
        }

        .new-badge {
          position: absolute;
          top: 22px;
          right: 22px;
          padding: 7px 12px;
          border-radius: 999px;
          color: #ffffff;
          background: linear-gradient(135deg, #7c3aed, #5b21b6);
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.06em;
        }

        .card-icon {
          width: 62px;
          height: 62px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
          background: #f2eaff;
          font-size: 31px;
          margin-bottom: 22px;
        }

        .card-content {
          flex: 1;
        }

        .signup-card h2 {
          margin: 0;
          color: #241235;
          font-size: 28px;
          line-height: 1.05;
          letter-spacing: -0.04em;
          font-weight: 950;
        }

        .card-description {
          min-height: 56px;
          margin: 14px 0 0;
          color: #685d74;
          font-size: 16px;
          line-height: 1.6;
        }

        .signup-card ul {
          display: grid;
          gap: 12px;
          margin: 25px 0 0;
          padding: 0;
          list-style: none;
        }

        .signup-card li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          color: #4f4559;
          line-height: 1.5;
          font-weight: 750;
        }

        .signup-card li span {
          width: 23px;
          height: 23px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: #ffffff;
          background: #7c3aed;
          font-size: 11px;
          font-weight: 950;
        }

        .card-action {
          min-height: 58px;
          margin-top: 30px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          border-radius: 18px;
          color: #ffffff;
          background: linear-gradient(135deg, #7c3aed, #5b21b6);
          box-shadow: 0 17px 38px rgba(109, 40, 217, 0.22);
          font-size: 15px;
          font-weight: 950;
        }

        .card-action span {
          font-size: 21px;
          line-height: 1;
          transition: transform 180ms ease;
        }

        .signup-card:hover .card-action span {
          transform: translateX(5px);
        }

        .login-row {
          margin-top: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #6d647c;
          font-weight: 750;
        }

        .login-row a {
          color: #6d28d9;
          font-weight: 950;
        }

        @media (max-width: 950px) {
          .signup-page {
            padding: 42px 14px 68px;
          }

          .signup-cards {
            grid-template-columns: 1fr;
          }

          .signup-card {
            min-height: 0;
          }

          .card-description {
            min-height: 0;
          }
        }

        @media (max-width: 560px) {
          .signup-hero {
            margin-bottom: 30px;
          }

          .signup-hero h1 {
            font-size: 42px;
          }

          .signup-hero p {
            font-size: 16px;
          }

          .signup-card {
            padding: 24px;
            border-radius: 28px;
          }

          .login-row {
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  )
}