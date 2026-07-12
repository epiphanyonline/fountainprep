'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { supabase } from '../../lib/supabase'

const countryOptions = [
  {
    name: 'United Kingdom',
    timezone: 'Europe/London',
  },
  {
    name: 'Nigeria',
    timezone: 'Africa/Lagos',
  },
  {
    name: 'United States',
    timezone: 'America/New_York',
  },
  {
    name: 'Canada',
    timezone: 'America/Toronto',
  },
  {
    name: 'Australia',
    timezone: 'Australia/Sydney',
  },
  {
    name: 'Ireland',
    timezone: 'Europe/Dublin',
  },
  {
    name: 'Other',
    timezone: 'Europe/London',
  },
]

const languages = ['Yoruba', 'Igbo', 'Hausa']

const goals = [
  'Speak confidently',
  'Reconnect with family',
  'Learn about my culture',
  'Improve my existing knowledge',
  'Prepare for travel',
  'Start from the beginning',
]

export default function AdultLearnerSignupPage() {
  const router = useRouter()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [country, setCountry] = useState('United Kingdom')
  const [timezone, setTimezone] = useState('Europe/London')
  const [languageInterest, setLanguageInterest] = useState('')
  const [learningGoal, setLearningGoal] = useState('')
  const [takingLessonsForSelf, setTakingLessonsForSelf] = useState(true)

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')

  function handleCountryChange(value: string) {
    setCountry(value)

    const selectedCountry = countryOptions.find(
      (item) => item.name === value
    )

    if (selectedCountry) {
      setTimezone(selectedCountry.timezone)
    }
  }

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!takingLessonsForSelf) {
      router.push('/signup/parent')
      return
    }

    if (!fullName.trim()) {
      setMessageType('error')
      setMessage('Please enter your full name.')
      return
    }

    if (!languageInterest) {
      setMessageType('error')
      setMessage('Please select the language you would like to learn.')
      return
    }

    if (!learningGoal) {
      setMessageType('error')
      setMessage('Please select your main learning goal.')
      return
    }

    if (password.length < 6) {
      setMessageType('error')
      setMessage('Your password must contain at least 6 characters.')
      return
    }

    setLoading(true)
    setMessage('')
    setMessageType('')

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            role: 'PARENT',
            account_type: 'ADULT_LEARNER',
            full_name: fullName.trim(),
            phone: phone.trim(),
            country,
            timezone,
            language_interest: languageInterest,
            learning_goal: learningGoal,
          },
        },
      })

      if (error) {
        throw error
      }

      if (data.session) {
        setMessageType('success')
        setMessage(
          'Your Adult Learner account has been created. Redirecting you to your learning journey...'
        )

        setTimeout(() => {
          router.push('/start?type=language')
          router.refresh()
        }, 1200)

        return
      }

      setMessageType('success')
      setMessage(
        'Your Adult Learner account has been created. Please check your email and confirm your account before logging in.'
      )

      setFullName('')
      setEmail('')
      setPhone('')
      setPassword('')
      setLanguageInterest('')
      setLearningGoal('')
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'We could not create your account. Please try again.'

      setMessageType('error')
      setMessage(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="learner-page">
      <section className="learner-shell">
        <div className="learner-heading">
          <Link href="/signup" className="back-link">
            ← Back to account options
          </Link>

          <div className="learner-badge">
            <span />
            Adult Learner
          </div>

          <h1>Start learning for yourself.</h1>

          <p>
            Create an account to book private Yoruba, Igbo or Hausa lessons
            and manage your own learning journey.
          </p>
        </div>

        <div className="learner-layout">
          <form className="signup-card" onSubmit={handleSignup}>
            <div className="account-notice">
              <strong>You are creating an Adult Learner account</strong>
              <span>
                This account is for adults aged 18 or over who will personally
                take the lessons.
              </span>
            </div>

            <div className="form-section">
              <div className="section-heading">
                <span>01</span>

                <div>
                  <h2>Your details</h2>
                  <p>.</p>
                </div>
              </div>

              <label>
                Full name
                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />
              </label>

              <div className="two-column">
                <label>
                  Email address
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </label>

                <label>
                  Phone number
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+44..."
                    autoComplete="tel"
                  />
                </label>
              </div>

              <label>
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create a secure password"
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
                <small>Use at least 6 characters.</small>
              </label>
            </div>

            <div className="form-section">
              <div className="section-heading">
                <span>02</span>

                <div>
                  <h2>Your location</h2>
                  <p>
                  
                  </p>
                </div>
              </div>

              <div className="two-column">
                <label>
                  Country
                  <select
                    value={country}
                    onChange={(event) =>
                      handleCountryChange(event.target.value)
                    }
                  >
                    {countryOptions.map((item) => (
                      <option key={item.name} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Time zone
                  <input
                    type="text"
                    value={timezone}
                    onChange={(event) => setTimezone(event.target.value)}
                    placeholder="Europe/London"
                    required
                  />
                </label>
              </div>
            </div>

            <div className="form-section">
              <div className="section-heading">
                <span>03</span>

                <div>
                  <h2>Your learning goal</h2>
                  <p>
                  
                  </p>
                </div>
              </div>

              <label>
                Language
                <select
                  value={languageInterest}
                  onChange={(event) =>
                    setLanguageInterest(event.target.value)
                  }
                  required
                >
                  <option value="">Choose a language</option>

                  {languages.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Main learning goal
                <select
                  value={learningGoal}
                  onChange={(event) => setLearningGoal(event.target.value)}
                  required
                >
                  <option value="">Choose your main goal</option>

                  {goals.map((goal) => (
                    <option key={goal} value={goal}>
                      {goal}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="identity-check">
              <strong>Who will take the lessons?</strong>

              <button
                type="button"
                className={takingLessonsForSelf ? 'choice selected' : 'choice'}
                onClick={() => setTakingLessonsForSelf(true)}
              >
                <span className="radio-dot" />
                <span>
                  <b>I will take the lessons myself</b>
                  <small>
                    Continue with an Adult Learner account.
                  </small>
                </span>
              </button>

              <button
                type="button"
                className={!takingLessonsForSelf ? 'choice selected' : 'choice'}
                onClick={() => setTakingLessonsForSelf(false)}
              >
                <span className="radio-dot" />
                <span>
                  <b>I am booking lessons for a child</b>
                  <small>
                    We will take you to the Parent or Guardian signup.
                  </small>
                </span>
              </button>
            </div>

            {message ? (
              <div
                className={
                  messageType === 'success'
                    ? 'message success'
                    : 'message error'
                }
                role="alert"
              >
                <strong>
                  {messageType === 'success'
                    ? 'Account update'
                    : 'Please check the form'}
                </strong>

                <span>{message}</span>
              </div>
            ) : null}

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading
                ? 'Creating your account...'
                : takingLessonsForSelf
                  ? 'Create Adult Learner Account'
                  : 'Continue to Parent Signup'}
            </button>

            <p className="login-copy">
              Already have an account?{' '}
              <Link href="/login">Log in</Link>
            </p>
          </form>

          <aside className="benefit-card">
            <div className="benefit-icon">🎓</div>

            <p className="benefit-eyebrow">Learn for yourself</p>

            <h2>Your language journey, your schedule.</h2>

            <p className="benefit-description">
              Learn with a private tutor who can adapt each lesson to your
              current level, goals and preferred pace.
            </p>

            <div className="benefit-list">
              <div>
                <span>✓</span>
                <p>
                  <strong>Private one-to-one lessons</strong>
                  <small>Focused teaching with no group classes.</small>
                </p>
              </div>

              <div>
                <span>✓</span>
                <p>
                  <strong>Yoruba, Igbo and Hausa</strong>
                  <small>More African languages are coming soon.</small>
                </p>
              </div>

              <div>
                <span>✓</span>
                <p>
                  <strong>Flexible scheduling</strong>
                  <small>Choose lesson times that suit your routine.</small>
                </p>
              </div>

              <div>
                <span>✓</span>
                <p>
                  <strong>Structured progress</strong>
                  <small>
                    Follow a clear learning pathway with lesson updates.
                  </small>
                </p>
              </div>
            </div>

            <div className="parent-switch">
              <strong>Booking for a child instead?</strong>
              <span>
                Create a Parent or Guardian account to add and manage a
                child&apos;s lessons.
              </span>

              <Link href="/signup/parent">
                Continue as Parent →
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <style jsx global>{`
        .learner-page {
          min-height: 100vh;
          padding: 46px 16px 80px;
          color: #251634;
          background:
            radial-gradient(
              circle at 8% 0%,
              rgba(124, 58, 237, 0.13),
              transparent 30%
            ),
            radial-gradient(
              circle at 94% 8%,
              rgba(236, 72, 153, 0.07),
              transparent 28%
            ),
            linear-gradient(180deg, #fffaff 0%, #f7f1ff 100%);
        }

        .learner-shell {
          width: min(1160px, 100%);
          margin: 0 auto;
        }

        .learner-heading {
          max-width: 800px;
          margin-bottom: 30px;
        }

        .back-link {
          display: inline-flex;
          margin-bottom: 22px;
          color: #6d28d9;
          text-decoration: none;
          font-weight: 900;
        }

        .learner-badge {
          width: fit-content;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 9px 14px;
          border-radius: 999px;
          color: #6d28d9;
          background: #f0e7ff;
          font-size: 13px;
          font-weight: 950;
        }

        .learner-badge span {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #7c3aed;
          box-shadow: 0 0 0 5px rgba(124, 58, 237, 0.14);
        }

        .learner-heading h1 {
          margin: 18px 0 0;
          font-size: clamp(42px, 6vw, 68px);
          line-height: 0.98;
          letter-spacing: -0.06em;
          font-weight: 950;
        }

        .learner-heading > p {
          max-width: 680px;
          margin: 18px 0 0;
          color: #6d647c;
          font-size: 17px;
          line-height: 1.7;
        }

        .learner-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.12fr) minmax(320px, 0.88fr);
          gap: 24px;
          align-items: start;
        }

        .signup-card,
        .benefit-card {
          border: 1px solid rgba(124, 58, 237, 0.12);
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 28px 80px rgba(55, 35, 95, 0.1);
        }

        .signup-card {
          padding: 30px;
          border-radius: 34px;
        }

        .benefit-card {
          position: sticky;
          top: 96px;
          padding: 30px;
          border-radius: 34px;
          background:
            radial-gradient(
              circle at top right,
              rgba(124, 58, 237, 0.13),
              transparent 36%
            ),
            rgba(255, 255, 255, 0.95);
        }

        .account-notice {
          padding: 18px;
          border-radius: 22px;
          background: #f6f0ff;
          border: 1px solid #e5d8ff;
        }

        .account-notice strong,
        .account-notice span {
          display: block;
        }

        .account-notice strong {
          font-size: 16px;
          font-weight: 950;
        }

        .account-notice span {
          margin-top: 5px;
          color: #6d647c;
          line-height: 1.55;
        }

        .form-section {
          padding: 28px 0;
          border-bottom: 1px solid #eee6f8;
        }

        .section-heading {
          display: flex;
          align-items: flex-start;
          gap: 13px;
          margin-bottom: 20px;
        }

        .section-heading > span {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          color: #6d28d9;
          background: #f1e8ff;
          font-size: 12px;
          font-weight: 950;
        }

        .section-heading h2 {
          margin: 0;
          font-size: 22px;
          letter-spacing: -0.035em;
        }

        .section-heading p {
          margin: 5px 0 0;
          color: #766b83;
          line-height: 1.55;
        }

        .signup-card label {
          display: block;
          margin-top: 16px;
          color: #30203f;
          font-size: 14px;
          font-weight: 900;
        }

        .signup-card input,
        .signup-card select {
          width: 100%;
          min-height: 54px;
          margin-top: 8px;
          padding: 0 15px;
          border-radius: 16px;
          border: 1px solid #dfd4ee;
          background: #ffffff;
          color: #241235;
          font: inherit;
          font-weight: 700;
          outline: none;
        }

        .signup-card input:focus,
        .signup-card select:focus {
          border-color: #7c3aed;
          box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1);
        }

        .signup-card label small {
          display: block;
          margin-top: 7px;
          color: #887d94;
          font-weight: 650;
        }

        .two-column {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .identity-check {
          margin-top: 26px;
          padding: 22px;
          border-radius: 24px;
          background: #fbf8ff;
          border: 1px solid #e8def5;
        }

        .identity-check > strong {
          display: block;
          margin-bottom: 14px;
          font-size: 17px;
        }

        .choice {
          width: 100%;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 15px;
          margin-top: 10px;
          text-align: left;
          border-radius: 18px;
          border: 1px solid #e3d9ef;
          background: #fff;
          cursor: pointer;
        }

        .choice.selected {
          border-color: #7c3aed;
          background: #f7f1ff;
          box-shadow: 0 10px 28px rgba(124, 58, 237, 0.1);
        }

        .radio-dot {
          width: 19px;
          height: 19px;
          margin-top: 2px;
          flex-shrink: 0;
          border-radius: 50%;
          border: 2px solid #b7aac7;
          background: #ffffff;
        }

        .choice.selected .radio-dot {
          border: 5px solid #7c3aed;
        }

        .choice b,
        .choice small {
          display: block;
        }

        .choice b {
          color: #2b183e;
          font-size: 14px;
        }

        .choice small {
          margin-top: 4px;
          color: #74687f;
          line-height: 1.45;
        }

        .message {
          margin-top: 20px;
          padding: 16px;
          border-radius: 18px;
        }

        .message strong,
        .message span {
          display: block;
        }

        .message span {
          margin-top: 5px;
          line-height: 1.55;
        }

        .message.success {
          color: #166534;
          background: #ecfdf3;
          border: 1px solid #bbf7d0;
        }

        .message.error {
          color: #9f1239;
          background: #fff1f2;
          border: 1px solid #fecdd3;
        }

        .submit-button {
          width: 100%;
          min-height: 58px;
          margin-top: 20px;
          padding: 0 20px;
          border: 0;
          border-radius: 18px;
          color: #ffffff;
          background: linear-gradient(135deg, #7c3aed, #5b21b6);
          box-shadow: 0 18px 38px rgba(109, 40, 217, 0.25);
          font-size: 15px;
          font-weight: 950;
          cursor: pointer;
        }

        .submit-button:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .login-copy {
          margin: 18px 0 0;
          text-align: center;
          color: #766b83;
          font-weight: 750;
        }

        .login-copy a {
          color: #6d28d9;
          font-weight: 950;
        }

        .benefit-icon {
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
          background: #f0e7ff;
          font-size: 30px;
        }

        .benefit-eyebrow {
          margin: 20px 0 0;
          color: #6d28d9;
          font-size: 13px;
          font-weight: 950;
        }

        .benefit-card h2 {
          margin: 8px 0 0;
          font-size: 36px;
          line-height: 1.03;
          letter-spacing: -0.05em;
        }

        .benefit-description {
          margin: 16px 0 0;
          color: #6d647c;
          line-height: 1.7;
        }

        .benefit-list {
          display: grid;
          gap: 15px;
          margin-top: 24px;
        }

        .benefit-list > div {
          display: flex;
          align-items: flex-start;
          gap: 11px;
        }

        .benefit-list > div > span {
          width: 25px;
          height: 25px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: #ffffff;
          background: #7c3aed;
          font-size: 12px;
          font-weight: 950;
        }

        .benefit-list p {
          margin: 0;
        }

        .benefit-list strong,
        .benefit-list small {
          display: block;
        }

        .benefit-list strong {
          font-size: 14px;
        }

        .benefit-list small {
          margin-top: 4px;
          color: #756980;
          line-height: 1.45;
        }

        .parent-switch {
          margin-top: 28px;
          padding: 18px;
          border-radius: 22px;
          background: #ffffff;
          border: 1px solid #e5d8ff;
        }

        .parent-switch strong,
        .parent-switch span,
        .parent-switch a {
          display: block;
        }

        .parent-switch span {
          margin-top: 6px;
          color: #756980;
          line-height: 1.55;
        }

        .parent-switch a {
          margin-top: 13px;
          color: #6d28d9;
          text-decoration: none;
          font-weight: 950;
        }

        @media (max-width: 900px) {
          .learner-page {
  padding: 64px 16px 80px;
}

          .learner-layout {
            grid-template-columns: 1fr;
          }

          .benefit-card {
            position: static;
          }

          .signup-card,
          .benefit-card {
            padding: 22px;
            border-radius: 28px;
          }

          .two-column {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .learner-heading h1 {
            font-size: clamp(40px, 12vw, 54px);
          }
        }
      `}</style>
    </main>
  )
}