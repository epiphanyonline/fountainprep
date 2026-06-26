'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

type NoticeType = 'success' | 'error' | 'info'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [resetEmail, setResetEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [notice, setNotice] = useState('')
  const [noticeType, setNoticeType] = useState<NoticeType>('info')

  function showNotice(type: NoticeType, text: string) {
    setNoticeType(type)
    setNotice(text)
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setNotice('')

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error) {
      showNotice(
        'error',
        'Login was not successful. Please check your email and password, or use the reset option below.'
      )
      setLoading(false)
      return
    }

    showNotice('success', 'Login successful. Taking you to your account...')
    router.push('/account')
  }

  async function handlePasswordReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setResetLoading(true)
    setNotice('')

    const emailToUse = (resetEmail || email).trim()

    if (!emailToUse) {
      showNotice('error', 'Please enter your email address first.')
      setResetLoading(false)
      return
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      window.location.origin

    const { error } = await supabase.auth.resetPasswordForEmail(emailToUse, {
      redirectTo: `${siteUrl}/reset-password`,
    })

    if (error) {
      showNotice('error', error.message)
      setResetLoading(false)
      return
    }

    showNotice(
      'success',
      `A password reset link has been sent to ${emailToUse}. Please check your inbox and spam folder.`
    )

    setResetLoading(false)
  }

  return (
    <main className="loginPage">
      <section className="loginShell">
        <div className="brandPanel">
          <p className="eyebrow">Fountain Prep</p>
          <h1>Welcome back to your learning centre.</h1>
          <p>
            Sign in to manage lessons, bookings, payments, progress updates and
            support messages.
          </p>

          <div className="trustGrid">
            <div>
              <strong>1-to-1</strong>
              <span>Private tutoring</span>
            </div>
            <div>
              <strong>Secure</strong>
              <span>Parent and tutor access</span>
            </div>
            <div>
              <strong>Visible</strong>
              <span>Progress updates</span>
            </div>
          </div>
        </div>

        <div className="card">
          <p className="smallTitle">Welcome back</p>

          <h2>Login</h2>

          <p className="subtitle">
            Access your Fountain Prep account securely.
          </p>

          {notice ? (
            <div className={`notice ${noticeType}`}>
              <div className="noticeIcon">
                {noticeType === 'success' ? '✓' : noticeType === 'error' ? '!' : 'i'}
              </div>
              <div>
                <strong>
                  {noticeType === 'success'
                    ? 'Action completed'
                    : noticeType === 'error'
                    ? 'Attention needed'
                    : 'Notice'}
                </strong>
                <p>{notice}</p>
              </div>
            </div>
          ) : null}

          <form onSubmit={handleLogin} className="formStack">
            <label>
              Email address
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <button className="primaryBtn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="resetBox">
            <h3>Forgot password?</h3>
            <p>
              Enter your email and we will send a secure reset link to your
              inbox.
            </p>

            <form onSubmit={handlePasswordReset} className="formStack compact">
              <input
                type="email"
                placeholder="Email for reset link"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />

              <button className="secondaryBtn" disabled={resetLoading}>
                {resetLoading ? 'Sending reset link...' : 'Send Reset Link'}
              </button>
            </form>
          </div>

          <div className="signupLinks">
            <p>
              New parent?{' '}
              <Link href="/signup/parent">Create parent account</Link>
            </p>

            <p>
              New tutor? <Link href="/signup/tutor">Create tutor account</Link>
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .loginPage {
          min-height: 100vh;
          padding: 48px 18px;
          background:
            radial-gradient(circle at top left, rgba(124, 58, 237, 0.18), transparent 35%),
            linear-gradient(135deg, #fbf8ff 0%, #f5efff 45%, #ffffff 100%);
        }

        .loginShell {
          width: min(1120px, 100%);
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 520px;
          gap: 28px;
          align-items: stretch;
        }

        .brandPanel,
        .card {
          border: 1px solid rgba(124, 58, 237, 0.14);
          background: rgba(255, 255, 255, 0.88);
          box-shadow: 0 28px 80px rgba(47, 24, 82, 0.14);
          backdrop-filter: blur(14px);
        }

        .brandPanel {
          border-radius: 36px;
          padding: 44px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .eyebrow,
        .smallTitle {
          margin: 0;
          color: #6d28d9;
          font-size: 13px;
          font-weight: 950;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .brandPanel h1 {
          margin: 14px 0 16px;
          max-width: 620px;
          color: #241438;
          font-size: clamp(42px, 6vw, 76px);
          line-height: 0.92;
          letter-spacing: -0.07em;
        }

        .brandPanel p {
          max-width: 560px;
          color: #6f637e;
          font-size: 18px;
          line-height: 1.65;
          font-weight: 650;
        }

        .trustGrid {
          margin-top: 32px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .trustGrid div {
          padding: 16px;
          border-radius: 20px;
          background: #faf5ff;
          border: 1px solid rgba(124, 58, 237, 0.14);
        }

        .trustGrid strong {
          display: block;
          color: #241438;
          font-weight: 950;
        }

        .trustGrid span {
          display: block;
          margin-top: 4px;
          color: #7c7287;
          font-size: 13px;
          font-weight: 700;
        }

        .card {
          border-radius: 32px;
          padding: 34px;
        }

        .card h2 {
          margin: 10px 0 8px;
          color: #241438;
          font-size: 44px;
          line-height: 1;
          letter-spacing: -0.06em;
        }

        .subtitle {
          margin: 0;
          color: #6f637e;
          line-height: 1.55;
          font-weight: 650;
        }

        .notice {
          margin: 22px 0;
          display: flex;
          gap: 14px;
          padding: 16px;
          border-radius: 22px;
          border: 1px solid;
        }

        .noticeIcon {
          width: 34px;
          height: 34px;
          flex: 0 0 34px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          color: white;
          font-weight: 950;
        }

        .notice strong {
          display: block;
          font-weight: 950;
        }

        .notice p {
          margin: 4px 0 0;
          line-height: 1.5;
          font-weight: 700;
        }

        .notice.success {
          background: #f0fdf4;
          border-color: #bbf7d0;
          color: #166534;
        }

        .notice.success .noticeIcon {
          background: #166534;
        }

        .notice.error {
          background: #fff1f2;
          border-color: #fecdd3;
          color: #9f1239;
        }

        .notice.error .noticeIcon {
          background: #e11d48;
        }

        .notice.info {
          background: #f5f3ff;
          border-color: #ddd6fe;
          color: #5b21b6;
        }

        .notice.info .noticeIcon {
          background: #6d28d9;
        }

        .formStack {
          margin-top: 24px;
          display: grid;
          gap: 14px;
        }

        .formStack.compact {
          margin-top: 14px;
        }

        label {
          display: grid;
          gap: 8px;
          color: #241438;
          font-size: 13px;
          font-weight: 900;
        }

        input {
          width: 100%;
          border: 1px solid rgba(124, 58, 237, 0.16);
          border-radius: 18px;
          padding: 15px 16px;
          font: inherit;
          outline: none;
          color: #241438;
          background: white;
        }

        input:focus {
          border-color: #7c3aed;
          box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.09);
        }

        .primaryBtn,
        .secondaryBtn {
          min-height: 54px;
          border: 0;
          border-radius: 18px;
          font-weight: 950;
          cursor: pointer;
        }

        .primaryBtn {
          color: white;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          box-shadow: 0 18px 38px rgba(124, 58, 237, 0.28);
        }

        .secondaryBtn {
          color: #351e55;
          background: #f5efff;
          border: 1px solid rgba(124, 58, 237, 0.16);
        }

        button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .resetBox {
          margin-top: 24px;
          padding: 20px;
          border-radius: 24px;
          background: #fbf8ff;
          border: 1px solid rgba(124, 58, 237, 0.12);
        }

        .resetBox h3 {
          margin: 0;
          color: #241438;
          font-size: 20px;
          letter-spacing: -0.03em;
        }

        .resetBox p {
          margin: 8px 0 0;
          color: #6f637e;
          line-height: 1.55;
          font-weight: 650;
        }

        .signupLinks {
          margin-top: 22px;
          padding-top: 18px;
          border-top: 1px solid rgba(124, 58, 237, 0.12);
        }

        .signupLinks p {
          margin: 8px 0;
          color: #6f637e;
          font-weight: 650;
        }

        .signupLinks a {
          color: #6d28d9;
          font-weight: 950;
          text-decoration: none;
        }

        @media (max-width: 900px) {
          .loginShell {
            grid-template-columns: 1fr;
          }

          .brandPanel {
            padding: 30px;
          }

          .trustGrid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .loginPage {
            padding: 18px 12px;
          }

          .brandPanel {
            display: none;
          }

          .card {
            padding: 24px;
            border-radius: 28px;
          }

          .card h2 {
            font-size: 38px;
          }
        }
      `}</style>
    </main>
  )
}