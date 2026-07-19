'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../lib/supabase'
import { BookingJourney } from '../components/BookingJourney'

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
    price: '£10',
    sub: 'per private 1-to-1 class',
    tag: 'Flexible monthly support',
    desc: 'Best for families who want steady weekly learning with flexibility.',
    sessions: '4 classes monthly',
    total: 'From £40/month',
    outcome: 'Great for confidence, homework support, and regular progress.',
    featured: true,
  },
  {
    id: 'three_month',
    title: '3-Month Plan',
    price: '£9',
    sub: 'per private 1-to-1 class',
    tag: 'Best value',
    desc: 'Best for families who want consistent progress across a school term.',
    sessions: '12+ classes',
    total: 'From £108 per 3 months',
    outcome: 'Ideal for stronger habits, exam preparation, and deeper progress.',
    featured: false,
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

type CurrencyDisplay = {
  symbol: string
  code: string
  rate: number
}

const currencyTable: Record<string, CurrencyDisplay> = {
  UK: {
    symbol: '£',
    code: 'GBP',
    rate: 1,
  },

  USA: {
    symbol: '$',
    code: 'USD',
    rate: 1.27,
  },

  Canada: {
    symbol: 'CA$',
    code: 'CAD',
    rate: 1.72,
  },

  Australia: {
    symbol: 'A$',
    code: 'AUD',
    rate: 1.93,
  },
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
  const [currency, setCurrency] = useState<CurrencyDisplay>(
  currencyTable.UK
)
  const [loadingStudent, setLoadingStudent] = useState(true)
  const [resolvedSubjectName, setResolvedSubjectName] = useState('')
  const [selectingPlan, setSelectingPlan] = useState('')

  const hasBookingContext = Boolean(studentId && subjectId)

  const subjectName = useMemo(() => {
    if (!subjectId) return 'Subject not selected'
    return subjectLabels[subjectId.toLowerCase()] || resolvedSubjectName || 'Selected subject'
  }, [subjectId, resolvedSubjectName])

  useEffect(() => {
    async function loadSubjectName() {
      if (!subjectId || subjectLabels[subjectId.toLowerCase()]) return

      const { data } = await supabase
        .from('subjects')
        .select('name')
        .eq('id', subjectId)
        .maybeSingle()

      if (data?.name) setResolvedSubjectName(data.name)
    }

    loadSubjectName()
  }, [subjectId])

  useEffect(() => {
    async function loadStudent() {
      if (!studentId) {
        setStudent(null)
        setLoadingStudent(false)
        return
      }

      setLoadingStudent(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: parentProfile } = await supabase
        .from('parent_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!parentProfile) {
        router.push('/parent/onboarding')
        return
      }

      const { data, error } = await supabase
        .from('student_profiles')
        .select('id, full_name, child_age, country_system, country_class_label')
        .eq('id', studentId)
        .eq('parent_id', parentProfile.id)
        .maybeSingle()

      if (error || !data) {
        setStudent(null)
        setLoadingStudent(false)
        return
      }

      setStudent(data as Student)

if (data.country_system && currencyTable[data.country_system]) {
  setCurrency(currencyTable[data.country_system])
}

setLoadingStudent(false)
    }

    loadStudent()
  }, [studentId, router])

  function convertPrice(gbp: number) {
  const converted = Math.round(gbp * currency.rate)

  return `${currency.symbol}${converted}`
}

  function handleChoosePlan(planId: string) {
    if (!studentId || !subjectId) {
      router.push('/parent/students')
      return
    }

    setSelectingPlan(planId)

    const params = new URLSearchParams()
    params.set('studentId', studentId)
    params.set('subjectId', subjectId)
    params.set('planId', planId)

    if (programId) params.set('programId', programId)

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
    <main className="pricingPage">
      {hasBookingContext ? (
        <BookingJourney
          currentStep={3}
          childName={student?.full_name}
          subjectName={subjectName}
        />
      ) : null}

      <section className="hero">
        <p className="eyebrow">Private 1-to-1 learning plans</p>

        <h1>Simple pricing for focused one-to-one tutoring.</h1>

        <p className="heroSubtitle">
          Every Fountain Prep lesson is private, structured, and focused on your
          child. No crowded online classes. No confusing hourly marketplace
          pricing.
        </p>

        <div className="heroBadges">
          <span>✓ Private 1-to-1 lessons</span>
          <span>✓ From {convertPrice(10)}/class</span>
          <span>✓ Save with 3-month plan</span>
        </div>

        {hasBookingContext ? (
          <div className="contextBox">
            <div>
              <p className="contextLabel">Learning path</p>
              <p className="contextValue">
                {loadingStudent
                  ? 'Loading child...'
                  : student?.full_name || 'Child not found'}
              </p>

              {student ? (
                <p className="contextSub">
                  {student.child_age ? `Age ${student.child_age}` : ''}
                  {student.country_system ? ` • ${student.country_system}` : ''}
                  {student.country_class_label
                    ? ` • ${student.country_class_label}`
                    : ''}
                </p>
              ) : null}
            </div>

            <div>
              <p className="contextLabel">Selected subject</p>
              <p className="contextValue">{subjectName}</p>
              <p className="contextSub">Tutor-matched private learning</p>
            </div>

            <button
              type="button"
              onClick={handleChangeSubject}
              className="secondaryButton"
            >
              Change Subject
            </button>
          </div>
        ) : (
          <div className="warningBox">
            <div>
              <h3>Start with your child’s learning path</h3>
              <p>
                Choose your child and subject first so we can guide the right
                learning plan.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push('/parent/students')}
              className="primaryButton"
            >
              Choose Child
            </button>
          </div>
        )}
      </section>

      <section className="plansSection">
        <div className="plansGrid">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={`planCard ${plan.featured ? 'featuredPlan' : ''}`}
            >
              <div className="planTag">{plan.tag}</div>

              <h2>{plan.title}</h2>

              <div className="priceBlock">
                <p className="price">
  {plan.id === 'monthly' ? convertPrice(10) : convertPrice(9)}
</p>
                <p className="priceSub">{plan.sub}</p>
              </div>

              <p className="planDesc">{plan.desc}</p>

              <div className="planDetails">
                <p>
                  <strong>Sessions:</strong> {plan.sessions}
                </p>
                <p>
                  <strong>Total:</strong>{' '}
{plan.id === 'monthly'
  ? `From ${convertPrice(40)}/month`
  : `From ${convertPrice(108)} per 3 months`}
                </p>
                <p>
                  <strong>Best for:</strong> {plan.outcome}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleChoosePlan(plan.id)}
                className="chooseButton"
                disabled={Boolean(selectingPlan)}
              >
                {selectingPlan === plan.id
                  ? 'Opening Tutor Schedule...'
                  : `Choose ${plan.title} → Pick Tutor & Time`}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="trustSection">
        <div className="trustCard">
          <div>
            <p className="eyebrow">What parents get</p>
            <h2>Private tutoring with structure, clarity, and value.</h2>
            <p>
              At {convertPrice(10)} per class, Fountain Prep gives families private learning
support at a price that remains far more affordable than many UK tutoring options.
            </p>
          </div>

          <div className="trustList">
            <span>✔ No group classes</span>
            <span>✔ Clear monthly structure</span>
            <span>✔ Flexible lesson frequency</span>
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
    <main className="pricingPage">
      <section className="hero">
        <p className="eyebrow">Learning Plans</p>
        <h1>Loading pricing...</h1>
        <p className="heroSubtitle">Preparing your Fountain Prep plans.</p>
      </section>

      <style jsx>{pricingStyles}</style>
    </main>
  )
}

const pricingStyles = `
  .pricingPage {
    min-height: 100vh;
    padding: 46px 20px 90px;
    background:
      radial-gradient(circle at top right, rgba(124, 58, 237, 0.12), transparent 30%),
      linear-gradient(180deg, #ffffff, #fbf8ff 48%, #f5edff);
    color: #201230;
  }

  .hero,
  .plansSection,
  .trustSection {
    max-width: 1180px;
    margin-left: auto;
    margin-right: auto;
  }

  .hero {
    padding: 52px 44px;
    border-radius: 38px;
    background:
      radial-gradient(circle at top right, rgba(124, 58, 237, 0.18), transparent 34%),
      linear-gradient(135deg, rgba(255,255,255,0.98), rgba(246,239,255,0.94));
    border: 1px solid rgba(124, 58, 237, 0.12);
    box-shadow: 0 30px 90px rgba(47, 25, 80, 0.11);
  }

  .eyebrow {
    margin: 0;
    color: #6d28d9;
    font-weight: 950;
    font-size: 15px;
  }

  h1 {
    max-width: 900px;
    margin: 18px 0 0;
    font-size: clamp(42px, 6vw, 74px);
    line-height: 0.96;
    letter-spacing: -0.06em;
    font-weight: 950;
  }

  .heroSubtitle {
    max-width: 780px;
    margin: 22px 0 0;
    color: #6d647c;
    font-size: 18px;
    line-height: 1.75;
  }

  .heroBadges {
    margin-top: 26px;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .heroBadges span {
    padding: 11px 15px;
    border-radius: 999px;
    background: white;
    color: #352145;
    font-weight: 850;
    border: 1px solid rgba(124, 58, 237, 0.1);
    box-shadow: 0 12px 30px rgba(55, 35, 95, 0.05);
  }

  .contextBox,
  .warningBox {
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

  .warningBox {
    grid-template-columns: 1fr auto;
  }

  .warningBox h3 {
    margin: 0;
    font-size: 22px;
    font-weight: 950;
  }

  .warningBox p {
    margin: 8px 0 0;
    color: #6f637e;
    line-height: 1.6;
  }

  .contextLabel {
    margin: 0;
    color: #7a7088;
    font-weight: 850;
    font-size: 14px;
  }

  .contextValue {
    margin: 8px 0 0;
    font-size: 21px;
    font-weight: 950;
  }

  .contextSub {
    margin: 6px 0 0;
    color: #766b84;
    font-size: 14px;
    line-height: 1.5;
  }

  .plansSection {
    margin-top: 34px;
  }

  .plansGrid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
  }

  .planCard {
    display: flex;
    flex-direction: column;
    min-height: 520px;
    padding: 36px 32px;
    border-radius: 34px;
    background: rgba(255, 255, 255, 0.97);
    border: 1px solid rgba(126, 87, 194, 0.14);
    box-shadow: 0 25px 70px rgba(71, 43, 117, 0.1);
  }

  .featuredPlan {
    border: 2px solid #7c3aed;
    box-shadow: 0 32px 90px rgba(124, 58, 237, 0.18);
  }

  .planTag {
    width: fit-content;
    padding: 9px 14px;
    border-radius: 999px;
    background: #f0e7ff;
    color: #6f35d5;
    font-weight: 950;
    font-size: 13px;
  }

  .planCard h2 {
    margin: 24px 0 0;
    font-size: clamp(30px, 3vw, 42px);
    line-height: 1.05;
    letter-spacing: -0.045em;
    font-weight: 950;
  }

  .priceBlock {
    margin-top: 26px;
  }

  .price {
    margin: 0;
    font-size: clamp(54px, 6vw, 76px);
    line-height: 0.95;
    letter-spacing: -0.06em;
    font-weight: 950;
  }

  .priceSub {
    margin: 10px 0 0;
    color: #6f637e;
    font-size: 16px;
    font-weight: 850;
  }

  .planDesc {
    margin: 28px 0 0;
    color: #6f637e;
    line-height: 1.75;
    font-size: 16px;
  }

  .planDetails {
    margin-top: 26px;
    padding: 20px;
    border-radius: 24px;
    background: #fbf8ff;
    border: 1px solid rgba(124, 58, 237, 0.12);
  }

  .planDetails p {
    margin: 0;
    color: #4f435f;
    line-height: 1.65;
    font-size: 15px;
  }

  .planDetails p + p {
    margin-top: 12px;
  }

  .chooseButton {
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

  .chooseButton:disabled {
    opacity: 0.68;
    cursor: wait;
  }

  .primaryButton,
  .secondaryButton {
    border-radius: 18px;
    padding: 16px 22px;
    font-weight: 950;
    font-size: 15px;
    cursor: pointer;
    white-space: nowrap;
  }

  .primaryButton {
    border: 0;
    background: linear-gradient(135deg, #6f35d5, #8b5cf6);
    color: white;
    box-shadow: 0 16px 38px rgba(124, 58, 237, 0.24);
  }

  .secondaryButton {
    border: 1px solid rgba(124, 58, 237, 0.18);
    background: white;
    color: #351e55;
  }

  .trustSection {
    margin-top: 34px;
  }

  .trustCard {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 28px;
    align-items: center;
    padding: 36px;
    border-radius: 32px;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,242,255,0.96));
    border: 1px solid rgba(126, 87, 194, 0.14);
    box-shadow: 0 25px 70px rgba(71, 43, 117, 0.1);
  }

  .trustCard h2 {
    margin: 12px 0 0;
    font-size: clamp(28px, 4vw, 44px);
    line-height: 1.06;
    letter-spacing: -0.04em;
    font-weight: 950;
  }

  .trustCard p {
    margin: 16px 0 0;
    color: #6f637e;
    line-height: 1.75;
    font-size: 16px;
  }

  .trustList {
    display: grid;
    gap: 12px;
  }

  .trustList span {
    padding: 15px 18px;
    border-radius: 18px;
    background: white;
    border: 1px solid rgba(124, 58, 237, 0.12);
    color: #351e55;
    font-weight: 850;
  }

  @media (max-width: 980px) {
    .hero {
      padding: 36px 24px;
    }

    .contextBox,
    .warningBox,
    .trustCard {
      grid-template-columns: 1fr;
    }

    .plansGrid {
      grid-template-columns: 1fr;
    }

    .planCard {
      min-height: auto;
    }

    .secondaryButton,
    .primaryButton {
      width: 100%;
    }
  }

  @media (max-width: 640px) {
    .pricingPage {
      padding: 28px 14px 70px;
    }

    .hero {
      border-radius: 28px;
      padding: 30px 20px;
    }

    h1 {
      font-size: clamp(38px, 12vw, 54px);
    }

    .heroSubtitle {
      font-size: 16px;
    }

    .planCard {
      border-radius: 28px;
      padding: 28px 22px;
    }

    .contextBox,
    .warningBox {
      padding: 18px;
      border-radius: 22px;
    }

    .trustCard {
      padding: 28px 22px;
    }
  }
`
