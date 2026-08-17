'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../lib/supabase'
import { BookingJourney } from '../components/BookingJourney'
import {
  academyClassroomHref,
} from '../data/academy-routing'
import {
  getAcademyPlans,
  type AcademySubscriptionPlan,
} from '../fountaintalk/services/subscriptionAccess'

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
  const product = searchParams.get('product')
const academyId = searchParams.get('academy')
const academyProgrammeId = searchParams.get('programme')

const productTypeParam =
  searchParams.get('productType')

const frequencyParam =
  searchParams.get('frequency')

const isAcademyPricing =
  product === 'academies'

  const [student, setStudent] = useState<Student | null>(null)
  const [currency, setCurrency] = useState<CurrencyDisplay>(
  currencyTable.UK
)
  const [loadingStudent, setLoadingStudent] = useState(true)
  const [resolvedSubjectName, setResolvedSubjectName] = useState('')
  const [selectingPlan, setSelectingPlan] = useState('')
  const [selectedProduct, setSelectedProduct] =
  useState<'LIVE' | 'PREMIUM'>(
    productTypeParam ===
      'PREMIUM'
      ? 'PREMIUM'
      : 'LIVE',
  )

const [
  selectedFrequency,
  setSelectedFrequency,
] = useState<
  | 'WEEKLY_SAME_TIME'
  | 'TWO_DAYS_WEEKLY'
>(
  frequencyParam ===
    'TWO_DAYS_WEEKLY'
    ? 'TWO_DAYS_WEEKLY'
    : 'WEEKLY_SAME_TIME',
)
  const [academyPlans, setAcademyPlans] = useState<
  AcademySubscriptionPlan[]
>([])

const [loadingAcademyPlans, setLoadingAcademyPlans] =
  useState(false)

const [academyPlanError, setAcademyPlanError] =
  useState<string | null>(null)

  const hasBookingContext = Boolean(studentId && subjectId)

  const subjectName = useMemo(() => {
    if (!subjectId) return 'Subject not selected'
    return subjectLabels[subjectId.toLowerCase()] || resolvedSubjectName || 'Selected subject'
  }, [subjectId, resolvedSubjectName])

  const isLanguageBooking = useMemo(() => {
  const name = subjectName.trim().toLowerCase()

  return [
    'yoruba',
    'igbo',
    'hausa',
    'language',
  ].includes(name)
}, [subjectName])

  useEffect(() => {
  let cancelled = false

  async function loadAcademyPlans() {
    if (!isAcademyPricing) {
      return
    }

    try {
      setLoadingAcademyPlans(true)
      setAcademyPlanError(null)      

      const plans = await getAcademyPlans()

      if (!cancelled) {
        setAcademyPlans(plans)
      }
    } catch (error) {
      console.error(
        'Unable to load academy subscription plans:',
        error,
      )

      if (!cancelled) {
        setAcademyPlans([])
        setAcademyPlanError(
          error instanceof Error
            ? error.message
            : 'Unable to load academy plans.',
        )
      }
    } finally {
      if (!cancelled) {
        setLoadingAcademyPlans(false)
      }
    }
  }

  void loadAcademyPlans()

  return () => {
    cancelled = true
  }
}, [isAcademyPricing, router])

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

function getSelectedTotal(
  planId: string,
  frequency:
    | 'WEEKLY_SAME_TIME'
    | 'TWO_DAYS_WEEKLY',
  productType:
    | 'LIVE'
    | 'PREMIUM',
) {
  if (productType === 'PREMIUM') {
    if (planId === 'three_month') {
      return frequency === 'TWO_DAYS_WEEKLY'
        ? 239.99
        : 134.99
    }

    return frequency === 'TWO_DAYS_WEEKLY'
      ? 89.99
      : 49.99
  }

  if (planId === 'three_month') {
    return frequency === 'TWO_DAYS_WEEKLY'
      ? 216
      : 108
  }

  return frequency === 'TWO_DAYS_WEEKLY'
    ? 80
    : 40
}

async function handleChooseAcademyPlan(
  planId: string,
) {
  if (planId === 'free') {
    if (!studentId || !academyId) {
      router.push('/academies')
      return
    }

    router.push(
      academyClassroomHref({
        studentId,
        academy: academyId,
        programme: academyProgrammeId,
      }),
    )
    return
  }

  try {
    setSelectingPlan(planId)
    setAcademyPlanError(null)

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.access_token) {
      const redirectTo =
        window.location.pathname +
        window.location.search

      router.push(
        `/login?redirectTo=${encodeURIComponent(redirectTo)}`,
      )
      return
    }

    const response = await fetch(
      '/api/stripe/academy-subscription-checkout',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          planId,
          studentId,
          academyId,
          programmeId: academyProgrammeId,
        }),
      },
    )

    const result = (await response.json()) as {
      url?: string
      error?: string
    }

    if (!response.ok || !result.url) {
      throw new Error(
        result.error ??
          'Unable to start subscription checkout.',
      )
    }

    window.location.assign(result.url)
  } catch (error) {
    console.error(
      'Unable to start academy subscription checkout:',
      error,
    )

    setAcademyPlanError(
      error instanceof Error
        ? error.message
        : 'Unable to start subscription checkout.',
    )

    setSelectingPlan('')
  }
}

  function handleChoosePlan(
  planId: string,
  productType: 'LIVE' | 'PREMIUM' = selectedProduct,
) {
  if (!studentId || !subjectId) {
    router.push('/parent/students')
    return
  }

  setSelectingPlan(
    `${productType}-${planId}`,
  )

  const params =
    new URLSearchParams()

  params.set(
    'studentId',
    studentId,
  )

  params.set(
    'subjectId',
    subjectId,
  )

  params.set(
    'planId',
    planId,
  )

  params.set(
    'frequency',
    selectedFrequency,
  )

  params.set(
    'productType',
    productType,
  )

  if (programId) {
    params.set(
      'programId',
      programId,
    )
  }

  router.push(
    `/schedule?${params.toString()}`,
  )
}

  function handleChangeSubject() {
  if (!studentId) {
    router.push('/parent/students')
    return
  }

  router.push(`/subjects?studentId=${studentId}`)
}

if (isAcademyPricing) {
  return (
    <main className="pricingPage">
      <section className="hero">
        <p className="eyebrow">
          Fountain Prep Academies
        </p>

        <h1>
          One subscription. Every academy.
        </h1>

        <p className="heroSubtitle">
          Choose the access level that fits the learner,
          assessments, certificates, and advanced
          professional pathways.
        </p>

        <div className="heroBadges">
          <span>✓ Free introductory learning</span>
          <span>✓ Cancel anytime</span>
          <span>✓ Secure payment through Stripe</span>
        </div>
      </section>

      <section className="plansSection">
        {loadingAcademyPlans ? (
          <div className="warningBox">
            <div>
              <h3>Loading academy plans...</h3>
              <p>
                Preparing the available subscription options.
              </p>
            </div>
          </div>
        ) : null}

        {academyPlanError ? (
          <div className="warningBox">
            <div>
              <h3>Unable to load academy plans</h3>
              <p role="alert">{academyPlanError}</p>
            </div>
          </div>
        ) : null}

        {!loadingAcademyPlans && !academyPlanError ? (
          <div className="plansGrid">
            {academyPlans.map((plan) => {
              const isFree = plan.id === 'free'

              const price = isFree
                ? 'Free'
                : `£${(plan.priceGbpPence / 100).toFixed(2)}`

              return (
                <article
                  key={plan.id}
                  className={`planCard ${
                    plan.id === 'premium_individual'
                      ? 'featuredPlan'
                      : ''
                  }`}
                >
                  <div className="planTag">
                    {isFree
                      ? 'Start here'
                      : plan.id === 'premium_individual'
                        ? 'Most popular'
                        : 'Full access'}
                  </div>

                  <h2>{plan.name}</h2>

                  <div className="priceBlock">
                    <p className="price">{price}</p>

                    <p className="priceSub">
                      {isFree
                        ? 'No payment required'
                        : 'per month'}
                    </p>
                  </div>

                  <p className="planDesc">
                    {plan.description}
                  </p>

                  <div className="planDetails">
                    <p>
                      <strong>Learners:</strong>{' '}
                      {plan.includedLearnerCount ?? 'Flexible'}
                    </p>

                    <p>
                      <strong>Access:</strong>{' '}
                      {plan.accessTier}
                    </p>

                    <p>
                      <strong>Certificates:</strong>{' '}
                      {plan.certificateAccess
                        ? 'Included'
                        : 'Not included'}
                    </p>

                    {plan.marketplaceDiscountPercent > 0 ? (
                      <p>
                        <strong>Live tutor discount:</strong>{' '}
                        {plan.marketplaceDiscountPercent}%
                      </p>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    className="chooseButton"
                    disabled={Boolean(selectingPlan)}
                    onClick={() =>
                      void handleChooseAcademyPlan(plan.id)
                    }
                  >
                    {selectingPlan === plan.id
                      ? 'Opening secure checkout...'
                      : isFree
                        ? 'Start learning free'
                        : `Choose ${plan.name}`}
                  </button>
                </article>
              )
            })}
          </div>
        ) : null}
      </section>

      <style jsx>{pricingStyles}</style>
    </main>
  )
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
  {isLanguageBooking ? (
    <div className="productSelector">
      <div className="productSelectorHeading">
        <p className="eyebrow">Choose how you want to learn</p>

        <h2>
          Live teaching, or combine it with AI practice.
        </h2>

        <p>
          Premium lets the learner meet a real tutor each week
          and continue practising with Ayo between lessons.
        </p>
      </div>

      <div className="productChoices">
        <button
          type="button"
          className={
            selectedProduct === 'LIVE'
              ? 'productChoice productChoiceActive'
              : 'productChoice'
          }
          onClick={() =>
            setSelectedProduct('LIVE')
          }
        >
          <span className="productChoiceTitle">
            Live Tutor
          </span>

          <span className="productChoiceText">
            Private 1-to-1 teaching
          </span>
        </button>

        <button
          type="button"
          className={
            selectedProduct === 'PREMIUM'
              ? 'productChoice productChoiceActive premiumChoice'
              : 'productChoice premiumChoice'
          }
          onClick={() =>
            setSelectedProduct('PREMIUM')
          }
        >
          <span className="recommendedBadge">
            Recommended
          </span>

          <span className="productChoiceTitle">
            Premium Bundle
          </span>

          <span className="productChoiceText">
            Live Tutor + Full AI Academy
          </span>
        </button>
      </div>
    </div>
  ) : null}

  <div className="plansGrid">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={`planCard ${plan.featured ? 'featuredPlan' : ''}`}
            >
              <div className="planTag">{plan.tag}</div>

              <h2>{plan.title}</h2>

              <div className="priceBlock">
  {selectedProduct === 'PREMIUM' &&
  isLanguageBooking ? (
    <>
      <p className="price">
        {convertPrice(
          getSelectedTotal(
            plan.id,
            selectedFrequency,
            'PREMIUM',
          ),
        )}
      </p>

      <p className="priceSub">
        {plan.id === 'monthly'
          ? 'per month • Live + Full AI'
          : 'for 3 months • Live + Full AI'}
      </p>
    </>
  ) : (
    <>
      <p className="price">
        {plan.id === 'monthly'
          ? convertPrice(10)
          : convertPrice(9)}
      </p>

      <p className="priceSub">
        {plan.sub}
      </p>
    </>
  )}
</div>

              <p className="planDesc">{plan.desc}</p>

              {selectedProduct === 'PREMIUM' &&
isLanguageBooking ? (
  <div className="premiumBenefits">
    <span>✓ Private live tutor</span>
    <span>✓ Full AI Language Academy</span>
    <span>✓ Practise between live lessons</span>
    <span>✓ Reinforce what was taught in class</span>
  </div>
) : null}

              <div className="planDetails">
  <p>
    <strong>Choose your learning pace</strong>
  </p>

  <div className="frequencyChoices">
    <button
      type="button"
      className={`frequencyChoice ${
        selectedFrequency === 'WEEKLY_SAME_TIME'
          ? 'frequencyChoiceActive'
          : ''
      }`}
      onClick={() =>
        setSelectedFrequency('WEEKLY_SAME_TIME')
      }
    >
      <span className="frequencyTitle">
        1 class per week
      </span>

      <span className="frequencyMeta">
  {plan.id === 'monthly'
    ? `4 private classes • ${convertPrice(
        getSelectedTotal(
          plan.id,
          'WEEKLY_SAME_TIME',
          selectedProduct === 'PREMIUM' &&
            isLanguageBooking
            ? 'PREMIUM'
            : 'LIVE',
        ),
      )}${selectedProduct === 'PREMIUM' && isLanguageBooking ? ' • Full AI included' : '/month'}`
    : `12 private classes • ${convertPrice(
        getSelectedTotal(
          plan.id,
          'WEEKLY_SAME_TIME',
          selectedProduct === 'PREMIUM' &&
            isLanguageBooking
            ? 'PREMIUM'
            : 'LIVE',
        ),
      )}${selectedProduct === 'PREMIUM' && isLanguageBooking ? ' • Full AI included' : ' / 3 months'}`}
</span>      
    </button>

    <button
      type="button"
      className={`frequencyChoice ${
        selectedFrequency === 'TWO_DAYS_WEEKLY'
          ? 'frequencyChoiceActive'
          : ''
      }`}
      onClick={() =>
        setSelectedFrequency('TWO_DAYS_WEEKLY')
      }
    >
      <span className="frequencyPopular">
        Faster progress
      </span>

      <span className="frequencyTitle">
        2 classes per week
      </span>

      <span className="frequencyMeta">
  {plan.id === 'monthly'
    ? `8 private classes • ${convertPrice(
        getSelectedTotal(
          plan.id,
          'TWO_DAYS_WEEKLY',
          selectedProduct === 'PREMIUM' &&
            isLanguageBooking
            ? 'PREMIUM'
            : 'LIVE',
        ),
      )}${selectedProduct === 'PREMIUM' && isLanguageBooking ? ' • Full AI included' : '/month'}`
    : `24 private classes • ${convertPrice(
        getSelectedTotal(
          plan.id,
          'TWO_DAYS_WEEKLY',
          selectedProduct === 'PREMIUM' &&
            isLanguageBooking
            ? 'PREMIUM'
            : 'LIVE',
        ),
      )}${selectedProduct === 'PREMIUM' && isLanguageBooking ? ' • Full AI included' : ' / 3 months'}`}
</span>      
    </button>
  </div>

  <p className="selectedPlanSummary">
  <strong>Your plan:</strong>{' '}

  {selectedFrequency === 'TWO_DAYS_WEEKLY'
    ? `${plan.id === 'monthly' ? 8 : 24} classes • ${convertPrice(
        getSelectedTotal(
          plan.id,
          'TWO_DAYS_WEEKLY',
          selectedProduct === 'PREMIUM' &&
            isLanguageBooking
            ? 'PREMIUM'
            : 'LIVE',
        ),
      )}${
        selectedProduct === 'PREMIUM' &&
        isLanguageBooking
          ? ' • Full AI included'
          : plan.id === 'monthly'
            ? '/month'
            : ' / 3 months'
      }`
    : `${plan.id === 'monthly' ? 4 : 12} classes • ${convertPrice(
        getSelectedTotal(
          plan.id,
          'WEEKLY_SAME_TIME',
          selectedProduct === 'PREMIUM' &&
            isLanguageBooking
            ? 'PREMIUM'
            : 'LIVE',
        ),
      )}${
        selectedProduct === 'PREMIUM' &&
        isLanguageBooking
          ? ' • Full AI included'
          : plan.id === 'monthly'
            ? '/month'
            : ' / 3 months'
      }`}
</p>

  <p>
    <strong>Best for:</strong> {plan.outcome}
  </p>
</div>

              <button
  type="button"
  onClick={() =>
    handleChoosePlan(
      plan.id,
      selectedProduct,
    )
  }
  className="chooseButton"
  disabled={Boolean(selectingPlan)}
>
  {selectingPlan ===
  `${selectedProduct}-${plan.id}`
    ? 'Opening Tutor Schedule...'
    : selectedProduct === 'PREMIUM' &&
        isLanguageBooking
      ? `Choose Premium ${plan.title} →`
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

/* Live / Premium plan controls */

.frequencyChoices {
  display: grid;
  gap: 12px;
  margin-top: 14px;
}

.frequencyChoice {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  padding: 17px 18px;
  border: 1px solid rgba(124, 58, 237, 0.14);
  border-radius: 18px;
  background: #ffffff;
  color: #2d183f;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease,
    background 0.2s ease;
}

.frequencyChoice:hover {
  transform: translateY(-1px);
  border-color: rgba(124, 58, 237, 0.35);
}

.frequencyChoiceActive {
  border: 2px solid #7c3aed;
  background:
    linear-gradient(
      135deg,
      #ffffff,
      #f7f1ff
    );
  box-shadow:
    0 12px 30px
    rgba(124, 58, 237, 0.12);
}

.frequencyTitle {
  font-size: 16px;
  font-weight: 950;
}

.frequencyMeta {
  color: #75677f;
  font-size: 13px;
  font-weight: 750;
  line-height: 1.5;
}

.frequencyPopular {
  display: inline-flex;
  margin-bottom: 3px;
  padding: 5px 9px;
  border-radius: 999px;
  background: #ede9fe;
  color: #6d28d9;
  font-size: 10px;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.selectedPlanSummary {
  margin-top: 15px !important;
  padding: 12px 14px;
  border-radius: 14px;
  background: #f7f2ff;
  color: #4c2875;
}

.productSelector {
  margin-bottom: 24px;
  padding: 26px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(124, 58, 237, 0.14);
  box-shadow: 0 20px 55px rgba(71, 43, 117, 0.08);
}

.productSelectorHeading h2 {
  margin: 8px 0 0;
  font-size: clamp(24px, 3vw, 34px);
  font-weight: 950;
}

.productSelectorHeading > p:last-child {
  margin: 10px 0 0;
  color: #70647d;
  line-height: 1.6;
}

.productChoices {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 20px;
}

.productChoice {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  padding: 20px;
  border-radius: 20px;
  border: 1px solid rgba(124, 58, 237, 0.14);
  background: #fff;
  color: #2d183f;
  text-align: left;
  cursor: pointer;
}

.productChoiceActive {
  border: 2px solid #7c3aed;
  background: linear-gradient(135deg, #fff, #f4edff);
  box-shadow: 0 16px 38px rgba(124, 58, 237, 0.14);
}

.productChoiceTitle {
  font-size: 18px;
  font-weight: 950;
}

.productChoiceText {
  color: #766981;
  font-size: 13px;
  font-weight: 750;
}

.recommendedBadge {
  display: inline-flex;
  padding: 5px 9px;
  border-radius: 999px;
  background: #6d28d9;
  color: white;
  font-size: 10px;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.premiumBenefits {
  display: grid;
  gap: 7px;
  margin-top: 15px;
  padding: 15px;
  border-radius: 17px;
  background: #f7f2ff;
  color: #4b2872;
  font-size: 13px;
  font-weight: 800;
}

@media (max-width: 700px) {
  .productChoices {
    grid-template-columns: 1fr;
  }
}
`
