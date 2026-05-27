'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../lib/supabase'

type Student = {
  id: string
  full_name: string
  child_age: number | null
  country_system: string | null
  country_class_label: string | null
}

const plans = [
  {
    id: 'monthly',
    title: 'Monthly Plan',
    price: 'From £6',
    sub: 'per class',
    tag: 'Most popular',
    desc: 'Best for steady weekly support, school confidence, and consistent learning rhythm.',
    sessions: '4 classes monthly',
    total: 'From £24/month',
    outcome: 'A simple monthly plan for children who need regular guided support.',
    featured: true,
  },
  {
    id: 'three_month',
    title: '3-Month Plan',
    price: 'From £6',
    sub: 'per class',
    tag: 'Steady progress',
    desc: 'Best for families who want visible progress across a school term.',
    sessions: '12+ classes',
    total: '3-month learning package',
    outcome: 'Ideal for building stronger habits, confidence, and subject understanding.',
  },
  {
    id: 'six_month',
    title: '6-Month Plan',
    price: 'Best value',
    sub: 'continuous support',
    tag: 'Highest value',
    desc: 'Best for parents who want structured, long-term academic growth.',
    sessions: '24+ classes',
    total: '6-month learning package',
    outcome: 'Designed for deeper progress, stronger foundations, and continuous improvement.',
  },
]

const subjectLabels: Record<string, string> = {
  maths: 'Maths',
  english: 'English',
  science: 'Science',
  coding: 'Coding',
  music: 'Music',
  yoruba: 'Yoruba',
  igbo: 'Igbo',
  hausa: 'Hausa',
  language: 'Language',
}

export default function PricingPage() {
  return (
    <Suspense fallback={<PricingLoading />}>
      <PricingContent />
    </Suspense>
  )
}

function PricingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const studentId = searchParams.get('studentId')
  const subjectId = searchParams.get('subjectId')
  const programId = searchParams.get('programId')

  const [student, setStudent] = useState<Student | null>(null)
  const [loadingStudent, setLoadingStudent] = useState(true)

  const hasBookingContext = Boolean(studentId && subjectId)

  const subjectName = useMemo(() => {
    if (!subjectId) return 'Subject not selected'
    return subjectLabels[subjectId] || 'Selected subject'
  }, [subjectId])

  useEffect(() => {
    async function loadStudent() {
      if (!studentId) {
        setStudent(null)
        setLoadingStudent(false)
        return
      }

      setLoadingStudent(true)

      const { data, error } = await supabase
        .from('student_profiles')
        .select('id, full_name, child_age, country_system, country_class_label')
        .eq('id', studentId)
        .maybeSingle()

      if (error || !data) {
        setStudent(null)
        setLoadingStudent(false)
        return
      }

      setStudent(data as Student)
      setLoadingStudent(false)
    }

    loadStudent()
  }, [studentId])

  function handleChoosePlan(planId: string) {
    if (!studentId || !subjectId) {
      router.push('/parent/students')
      return
    }

    const params = new URLSearchParams()
    params.set('studentId', studentId)
    params.set('subjectId', subjectId)
    params.set('planId', planId)

    if (programId) {
      params.set('programId', programId)
    }

    router.push(`/schedule?${params.toString()}`)
  }

  function handleChangeSubject() {
    if (!studentId) {
      router.push('/parent/students')
      return
    }

    router.push(`/subjects?studentId=${studentId}`)
  }

  return (
    <main className="pricing-page">
      <section className="pricing-hero">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />

        <p className="eyebrow">Learning Plans</p>

        <h1>Choose the right learning plan for your child.</h1>

        <p className="hero-subtitle">
          Fountain Prep is designed for structured learning, not random one-off
          lessons. Choose a plan that supports your child’s rhythm, confidence,
          and long-term progress.
        </p>

        {hasBookingContext ? (
          <div className="context-box">
            <div>
              <p className="context-label">Learning path</p>
              <p className="context-value">
                {loadingStudent
                  ? 'Loading child...'
                  : student?.full_name || 'Child not found'}
              </p>

              {student ? (
                <p className="context-sub">
                  {student.child_age ? `Age ${student.child_age}` : ''}
                  {student.country_system ? ` • ${student.country_system}` : ''}
                  {student.country_class_label
                    ? ` • ${student.country_class_label}`
                    : ''}
                </p>
              ) : null}
            </div>

            <div>
              <p className="context-label">Selected subject</p>
              <p className="context-value">{subjectName}</p>
              <p className="context-sub">Tutor-matched learning support</p>
            </div>

            <button
              type="button"
              onClick={handleChangeSubject}
              className="secondary-button"
            >
              Change Subject
            </button>
          </div>
        ) : (
          <div className="warning-box">
            <div>
              <h3>Start with your child’s learning path</h3>
              <p>
                To continue, choose your child and subject first. This helps
                Fountain Prep guide the right learning plan.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push('/parent/students')}
              className="primary-button"
            >
              Choose Child
            </button>
          </div>
        )}
      </section>

      <section className="plans-section">
        <div className="plans-grid">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={`plan-card ${plan.featured ? 'featured-plan' : ''}`}
            >
              <div className="plan-tag">{plan.tag}</div>

              <h2>{plan.title}</h2>

              <div className="price-block">
                <p className="price">{plan.price}</p>
                <p className="price-sub">{plan.sub}</p>
              </div>

              <p className="plan-desc">{plan.desc}</p>

              <div className="plan-details">
                <p>
                  <strong>Sessions:</strong> {plan.sessions}
                </p>

                <p>
                  <strong>Total:</strong> {plan.total}
                </p>

                <p>
                  <strong>Best for:</strong> {plan.outcome}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleChoosePlan(plan.id)}
                className="choose-button"
              >
                Choose {plan.title}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="trust-section">
        <div className="trust-card">
          <div>
            <p className="eyebrow">Clear and parent-friendly</p>
            <h2>Simple pricing. Structured progress.</h2>
            <p>
              Parents can start with a monthly plan and increase lesson
              frequency during scheduling. One lesson weekly starts from
              £24/month, while two lessons weekly starts from £48/month.
            </p>
          </div>

          <div className="trust-list">
            <span>✔ No one-off random lesson path</span>
            <span>✔ Clear monthly learning structure</span>
            <span>✔ Flexible weekly lesson frequency</span>
            <span>✔ Designed for consistent progress</span>
          </div>
        </div>
      </section>

      <style jsx>{pricingStyles}</style>
    </main>
  )
}

function PricingLoading() {
  return (
    <main className="pricing-page">
      <section className="pricing-hero">
        <p className="eyebrow">Learning Plans</p>
        <h1>Loading pricing...</h1>
        <p className="hero-subtitle">Preparing your Fountain Prep plans.</p>
      </section>

      <style jsx>{pricingStyles}</style>
    </main>
  )
}

const pricingStyles = `
  .pricing-page {
    min-height: 100vh;
    padding: 54px 20px 90px;
    background:
      radial-gradient(circle at top right, #eadcff 0, #faf7ff 34%, #f8f5ff 100%);
    color: #21152d;
  }

  .pricing-hero {
    position: relative;
    max-width: 1180px;
    margin: 0 auto;
    padding: 54px 44px;
    border-radius: 34px;
    overflow: hidden;
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(248, 242, 255, 0.96));
    border: 1px solid rgba(126, 87, 194, 0.16);
    box-shadow: 0 30px 90px rgba(88, 52, 150, 0.12);
  }

  .hero-glow {
    position: absolute;
    border-radius: 999px;
    filter: blur(22px);
    pointer-events: none;
  }

  .hero-glow-one {
    width: 380px;
    height: 380px;
    right: -130px;
    top: -130px;
    background: rgba(124, 58, 237, 0.18);
  }

  .hero-glow-two {
    width: 220px;
    height: 220px;
    left: -90px;
    bottom: -90px;
    background: rgba(196, 181, 253, 0.26);
  }

  .eyebrow {
    position: relative;
    margin: 0;
    color: #7441d8;
    font-weight: 950;
    font-size: 15px;
  }

  h1 {
    position: relative;
    max-width: 930px;
    margin: 18px 0 0;
    font-size: clamp(42px, 6vw, 76px);
    line-height: 0.96;
    letter-spacing: -0.06em;
    font-weight: 950;
  }

  .hero-subtitle {
    position: relative;
    max-width: 820px;
    margin: 22px 0 0;
    color: #6f637e;
    font-size: 18px;
    line-height: 1.75;
  }

  .context-box,
  .warning-box {
    position: relative;
    margin-top: 34px;
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    gap: 22px;
    align-items: center;
    padding: 22px;
    border-radius: 26px;
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(124, 58, 237, 0.14);
    box-shadow: 0 18px 45px rgba(71, 43, 117, 0.07);
  }

  .warning-box {
    grid-template-columns: 1fr auto;
  }

  .warning-box h3 {
    margin: 0;
    font-size: 22px;
    font-weight: 950;
  }

  .warning-box p {
    margin: 8px 0 0;
    color: #6f637e;
    line-height: 1.6;
  }

  .context-label {
    margin: 0;
    color: #7a7088;
    font-weight: 850;
    font-size: 14px;
  }

  .context-value {
    margin: 8px 0 0;
    font-size: 21px;
    font-weight: 950;
  }

  .context-sub {
    margin: 6px 0 0;
    color: #766b84;
    font-size: 14px;
    line-height: 1.5;
  }

  .plans-section {
    max-width: 1180px;
    margin: 34px auto 0;
  }

  .plans-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 24px;
  }

  .plan-card {
    display: flex;
    flex-direction: column;
    min-height: 540px;
    padding: 34px 30px;
    border-radius: 32px;
    background: rgba(255, 255, 255, 0.96);
    border: 1px solid rgba(126, 87, 194, 0.14);
    box-shadow: 0 25px 70px rgba(71, 43, 117, 0.1);
  }

  .featured-plan {
    border: 2px solid #7c3aed;
    box-shadow: 0 30px 80px rgba(124, 58, 237, 0.16);
  }

  .plan-tag {
    width: fit-content;
    padding: 9px 14px;
    border-radius: 999px;
    background: #f0e7ff;
    color: #6f35d5;
    font-weight: 950;
    font-size: 13px;
  }

  .plan-card h2 {
    margin: 24px 0 0;
    font-size: clamp(28px, 3vw, 36px);
    line-height: 1.06;
    letter-spacing: -0.04em;
    font-weight: 950;
  }

  .price-block {
    margin-top: 26px;
  }

  .price {
    margin: 0;
    font-size: clamp(42px, 5vw, 58px);
    line-height: 1;
    letter-spacing: -0.05em;
    font-weight: 950;
  }

  .price-sub {
    margin: 8px 0 0;
    color: #6f637e;
    font-size: 16px;
    font-weight: 850;
  }

  .plan-desc {
    margin: 28px 0 0;
    color: #6f637e;
    line-height: 1.75;
    font-size: 16px;
  }

  .plan-details {
    margin-top: 26px;
    padding: 20px;
    border-radius: 24px;
    background: #fbf8ff;
    border: 1px solid rgba(124, 58, 237, 0.12);
  }

  .plan-details p {
    margin: 0;
    color: #4f435f;
    line-height: 1.65;
    font-size: 15px;
  }

  .plan-details p + p {
    margin-top: 12px;
  }

  .choose-button {
    margin-top: auto;
    width: 100%;
    border: 0;
    border-radius: 18px;
    padding: 17px 22px;
    background: linear-gradient(135deg, #6f35d5, #8b5cf6);
    color: white;
    font-weight: 950;
    font-size: 15px;
    cursor: pointer;
    box-shadow: 0 16px 38px rgba(124, 58, 237, 0.28);
  }

  .primary-button,
  .secondary-button {
    border-radius: 18px;
    padding: 16px 22px;
    font-weight: 950;
    font-size: 15px;
    cursor: pointer;
    white-space: nowrap;
  }

  .primary-button {
    border: 0;
    background: linear-gradient(135deg, #6f35d5, #8b5cf6);
    color: white;
    box-shadow: 0 16px 38px rgba(124, 58, 237, 0.24);
  }

  .secondary-button {
    border: 1px solid rgba(124, 58, 237, 0.18);
    background: white;
    color: #351e55;
  }

  .trust-section {
    max-width: 1180px;
    margin: 34px auto 0;
  }

  .trust-card {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 28px;
    align-items: center;
    padding: 36px;
    border-radius: 32px;
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(248, 242, 255, 0.96));
    border: 1px solid rgba(126, 87, 194, 0.14);
    box-shadow: 0 25px 70px rgba(71, 43, 117, 0.1);
  }

  .trust-card h2 {
    margin: 12px 0 0;
    font-size: clamp(28px, 4vw, 44px);
    line-height: 1.06;
    letter-spacing: -0.04em;
    font-weight: 950;
  }

  .trust-card p {
    margin: 16px 0 0;
    color: #6f637e;
    line-height: 1.75;
    font-size: 16px;
  }

  .trust-list {
    display: grid;
    gap: 12px;
  }

  .trust-list span {
    padding: 15px 18px;
    border-radius: 18px;
    background: white;
    border: 1px solid rgba(124, 58, 237, 0.12);
    color: #351e55;
    font-weight: 850;
  }

  @media (max-width: 980px) {
    .pricing-hero {
      padding: 36px 24px;
    }

    .context-box,
    .warning-box {
      grid-template-columns: 1fr;
    }

    .plans-grid {
      grid-template-columns: 1fr;
    }

    .plan-card {
      min-height: auto;
    }

    .trust-card {
      grid-template-columns: 1fr;
      padding: 28px 22px;
    }

    .secondary-button,
    .primary-button {
      width: 100%;
    }
  }

  @media (max-width: 640px) {
    .pricing-page {
      padding: 28px 14px 70px;
    }

    .pricing-hero {
      border-radius: 28px;
      padding: 30px 20px;
    }

    h1 {
      font-size: clamp(38px, 12vw, 54px);
    }

    .hero-subtitle {
      font-size: 16px;
    }

    .plans-grid {
      gap: 18px;
    }

    .plan-card {
      border-radius: 28px;
      padding: 28px 22px;
    }

    .context-box,
    .warning-box {
      padding: 18px;
      border-radius: 22px;
    }
  }
`