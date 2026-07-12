'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

type LearnerProfile = {
  id: string
  full_name: string
  subjects_needed: string | null
  parent_goal_for_student: string | null
  learning_level_id: string | null
}

export default function LearnerDashboardPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [fullName, setFullName] = useState('Learner')
  const [learner, setLearner] = useState<LearnerProfile | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadLearnerDashboard() {
      setLoading(true)
      setMessage('')

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .maybeSingle()

      if (!userProfile || userProfile.role !== 'PARENT') {
        router.push('/account')
        return
      }

      const { data: parentProfile, error: parentError } = await supabase
        .from('parent_profiles')
        .select('id, account_type, full_name')
        .eq('user_id', user.id)
        .maybeSingle()

      if (parentError || !parentProfile) {
        setMessage('Your learner profile could not be loaded.')
        setLoading(false)
        return
      }

      if (parentProfile.account_type !== 'ADULT_LEARNER') {
        router.push('/parent/dashboard')
        return
      }

      const { data: learnerProfile, error: learnerError } = await supabase
        .from('student_profiles')
        .select(`
          id,
          full_name,
          subjects_needed,
          parent_goal_for_student,
          learning_level_id
        `)
        .eq('parent_id', parentProfile.id)
        .eq('is_self_learner', true)
        .maybeSingle()

      if (learnerError || !learnerProfile) {
        setMessage(
          'Your Adult Learner profile has not been created correctly. Please contact support.'
        )
        setLoading(false)
        return
      }

      setFullName(
        learnerProfile.full_name ||
          parentProfile.full_name ||
          userProfile.full_name ||
          'Learner'
      )

      setLearner(learnerProfile as LearnerProfile)
      setLoading(false)
    }

    loadLearnerDashboard()
  }, [router])

  if (loading) {
    return (
      <main className="learner-dashboard">
        <section className="dashboard-shell">
          <div className="hero-card">
            <p className="eyebrow">My Learning</p>
            <h1>Preparing your learning space...</h1>
          </div>
        </section>

        <style jsx global>{styles}</style>
      </main>
    )
  }

  return (
    <main className="learner-dashboard">
      <section className="dashboard-shell">
        <section className="hero-card">
          <div>
            <p className="eyebrow">Adult Learner Dashboard</p>
            <h1>Welcome, {fullName}.</h1>

            <p className="hero-copy">
              Manage your private language lessons, tutors, bookings and
              learning progress from one place.
            </p>
          </div>

          <div className="hero-actions">
            {learner ? (
              <Link
                href={`/subjects?studentId=${learner.id}`}
                className="primary-button"
              >
                Book a Language Lesson
              </Link>
            ) : null}

            <Link
              href="/start?type=language"
              className="secondary-button"
            >
              Explore Languages
            </Link>
          </div>
        </section>

        {message ? (
          <section className="message-card">
            <strong>Profile issue</strong>
            <p>{message}</p>

            <a href="mailto:support@fountainprep.com">
              Contact Fountain Prep Support
            </a>
          </section>
        ) : null}

        {learner ? (
          <>
            <section className="summary-grid">
              <article className="summary-card">
                <span>Language</span>
                <strong>
                  {learner.subjects_needed || 'Choose your language'}
                </strong>
                <p>
                  Yoruba, Igbo and Hausa lessons are currently available.
                </p>
              </article>

              <article className="summary-card">
                <span>Learning goal</span>
                <strong>
                  {learner.parent_goal_for_student ||
                    'Set your learning goal'}
                </strong>
                <p>
                  Your lessons can be adapted around your personal objective.
                </p>
              </article>

              <article className="summary-card">
                <span>Lesson format</span>
                <strong>Private one-to-one</strong>
                <p>
                  Focused online lessons with a dedicated tutor.
                </p>
              </article>
            </section>

            <section className="action-grid">
              <Link
                href={`/subjects?studentId=${learner.id}`}
                className="action-card featured"
              >
                <span>🌍</span>
                <h2>Book a language lesson</h2>
                <p>
                  Choose Yoruba, Igbo or Hausa and continue to lesson plans.
                </p>
                <strong>Start booking →</strong>
              </Link>

              <Link href="/parent/bookings" className="action-card">
                <span>📅</span>
                <h2>My bookings</h2>
                <p>
                  Review upcoming and previous lesson bookings.
                </p>
                <strong>View bookings →</strong>
              </Link>

              <Link href="/parent/payments" className="action-card">
                <span>💳</span>
                <h2>Payments</h2>
                <p>
                  View lesson payments and transaction activity.
                </p>
                <strong>View payments →</strong>
              </Link>

              <Link href="/account" className="action-card">
                <span>⚙️</span>
                <h2>Account settings</h2>
                <p>
                  Manage your contact information and login details.
                </p>
                <strong>Manage account →</strong>
              </Link>
            </section>
          </>
        ) : null}
      </section>

      <style jsx global>{styles}</style>
    </main>
  )
}

const styles = `
  .learner-dashboard {
    min-height: 100vh;
    padding: 38px 16px 80px;
    color: #241235;
    background:
      radial-gradient(
        circle at 8% 0%,
        rgba(124, 58, 237, 0.14),
        transparent 30%
      ),
      radial-gradient(
        circle at 92% 8%,
        rgba(236, 72, 153, 0.07),
        transparent 28%
      ),
      linear-gradient(180deg, #fffaff 0%, #f5edff 100%);
  }

  .dashboard-shell {
    width: min(1160px, 100%);
    margin: 0 auto;
  }

  .hero-card {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 26px;
    padding: 38px;
    border-radius: 38px;
    background:
      radial-gradient(
        circle at top right,
        rgba(124, 58, 237, 0.16),
        transparent 34%
      ),
      rgba(255, 255, 255, 0.96);
    border: 1px solid rgba(124, 58, 237, 0.12);
    box-shadow: 0 28px 80px rgba(55, 35, 95, 0.1);
  }

  .eyebrow {
    margin: 0;
    color: #6d28d9;
    font-size: 14px;
    font-weight: 950;
  }

  .hero-card h1 {
    max-width: 760px;
    margin: 12px 0 0;
    font-size: clamp(42px, 6vw, 70px);
    line-height: 0.97;
    letter-spacing: -0.06em;
    font-weight: 950;
  }

  .hero-copy {
    max-width: 680px;
    margin: 18px 0 0;
    color: #6d647c;
    font-size: 17px;
    line-height: 1.7;
  }

  .hero-actions {
    min-width: 245px;
    display: grid;
    gap: 11px;
  }

  .primary-button,
  .secondary-button {
    min-height: 54px;
    padding: 0 20px;
    border-radius: 17px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    text-decoration: none;
    font-weight: 950;
  }

  .primary-button {
    color: #ffffff;
    background: linear-gradient(135deg, #7c3aed, #5b21b6);
    box-shadow: 0 16px 36px rgba(109, 40, 217, 0.24);
  }

  .secondary-button {
    color: #351e55;
    background: #ffffff;
    border: 1px solid rgba(124, 58, 237, 0.16);
  }

  .message-card {
    margin-top: 20px;
    padding: 22px;
    border-radius: 24px;
    color: #9f1239;
    background: #fff1f2;
    border: 1px solid #fecdd3;
  }

  .message-card strong {
    font-size: 18px;
  }

  .message-card p {
    margin: 7px 0 0;
    line-height: 1.6;
  }

  .message-card a {
    display: inline-flex;
    margin-top: 12px;
    color: #9f1239;
    font-weight: 950;
  }

  .summary-grid {
    margin-top: 22px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  .summary-card,
  .action-card {
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid rgba(124, 58, 237, 0.11);
    box-shadow: 0 20px 55px rgba(55, 35, 95, 0.07);
  }

  .summary-card {
    padding: 23px;
    border-radius: 27px;
  }

  .summary-card span {
    color: #7c3aed;
    font-size: 13px;
    font-weight: 950;
  }

  .summary-card strong {
    display: block;
    margin-top: 9px;
    font-size: 21px;
    letter-spacing: -0.025em;
  }

  .summary-card p {
    margin: 10px 0 0;
    color: #756980;
    line-height: 1.55;
  }

  .action-grid {
    margin-top: 22px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .action-card {
    min-height: 230px;
    padding: 27px;
    border-radius: 30px;
    color: inherit;
    text-decoration: none;
  }

  .action-card.featured {
    color: #ffffff;
    background:
      radial-gradient(
        circle at top right,
        rgba(255, 255, 255, 0.2),
        transparent 35%
      ),
      linear-gradient(135deg, #7c3aed, #5b21b6);
  }

  .action-card > span {
    width: 52px;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 17px;
    background: #f0e7ff;
    font-size: 27px;
  }

  .action-card.featured > span {
    background: rgba(255, 255, 255, 0.16);
  }

  .action-card h2 {
    margin: 20px 0 0;
    font-size: 25px;
    letter-spacing: -0.035em;
  }

  .action-card p {
    margin: 11px 0 0;
    color: #756980;
    line-height: 1.65;
  }

  .action-card.featured p {
    color: rgba(255, 255, 255, 0.82);
  }

  .action-card > strong {
    display: block;
    margin-top: 20px;
    color: #6d28d9;
  }

  .action-card.featured > strong {
    color: #ffffff;
  }

  @media (max-width: 850px) {
    .learner-dashboard {
      padding: 24px 12px 64px;
    }

    .hero-card {
      align-items: flex-start;
      flex-direction: column;
      padding: 24px;
      border-radius: 30px;
    }

    .hero-actions {
      width: 100%;
      min-width: 0;
    }

    .summary-grid,
    .action-grid {
      grid-template-columns: 1fr;
    }

    .action-card {
      min-height: 0;
    }
  }
`