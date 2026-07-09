'use client'

import { Suspense, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

type FlowType = 'language' | 'academic'

const languageCards = [
  {
    name: 'Yoruba',
    icon: '🇳🇬',
    title: 'Yoruba',
    text: 'Help your child speak confidently with family and stay connected to their roots.',
    points: ['Native tutors', 'Private lessons', 'Parent reports'],
  },
  {
    name: 'Igbo',
    icon: '🇳🇬',
    title: 'Igbo',
    text: 'Build vocabulary, pronunciation and cultural confidence through engaging lessons.',
    points: ['Native tutors', 'Structured lessons', 'Flexible schedule'],
  },
  {
    name: 'Hausa',
    icon: '🇳🇬',
    title: 'Hausa',
    text: 'Develop practical communication skills with experienced language tutors.',
    points: ['Beginner friendly', 'Weekly progress', 'Live online classes'],
  },
]

const academicCards = [
  {
    name: 'Maths',
    icon: '📘',
    title: 'Maths',
    text: 'Build number confidence, problem solving and school performance.',
    points: ['Homework support', 'Confidence building', 'Structured practice'],
  },
  {
    name: 'English',
    icon: '📖',
    title: 'English',
    text: 'Improve reading, writing, vocabulary and communication skills.',
    points: ['Reading support', 'Writing practice', 'Comprehension'],
  },
  {
    name: 'Science',
    icon: '🧪',
    title: 'Science',
    text: 'Make science clearer through simple explanations and guided practice.',
    points: ['Clear concepts', 'School support', 'Exam confidence'],
  },
  {
    name: 'Coding',
    icon: '💻',
    title: 'Coding',
    text: 'Introduce your child to creative digital skills and logical thinking.',
    points: ['Beginner friendly', 'Creative projects', 'Future skills'],
  },
  {
    name: 'Music',
    icon: '🎼',
    title: 'Music',
    text: 'Support creativity, rhythm, confidence and musical expression.',
    points: ['Creative learning', 'Confidence', 'Private lessons'],
  },
]

const goals = [
  { title: 'Build confidence', icon: '⭐', text: 'Help my child feel more confident learning.' },
  { title: 'Connect with family', icon: '❤️', text: 'Help my child communicate with family.' },
  { title: 'School support', icon: '🎓', text: 'Support school work and learning gaps.' },
  { title: 'Exam preparation', icon: '📝', text: 'Prepare for tests, assessments or exams.' },
  { title: 'Culture and identity', icon: '🌍', text: 'Help my child stay connected to heritage.' },
  { title: 'Just starting', icon: '🌱', text: 'My child is new and needs a gentle start.' },
]

const levels = [
  'Just starting',
  'Knows the basics',
  'Developing confidence',
  'Advanced',
]

const daysList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const times = ['Morning', 'Afternoon', 'Evening']

function StartPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialType = searchParams.get('type') === 'academic' ? 'academic' : 'language'

  const [flowType, setFlowType] = useState<FlowType>(initialType)
  const [subject, setSubject] = useState('')
  const [goal, setGoal] = useState('')
  const [level, setLevel] = useState('')
  const [days, setDays] = useState<string[]>([])
  const [time, setTime] = useState('')

  const cards = flowType === 'language' ? languageCards : academicCards
  const canContinue = Boolean(subject && goal && level && days.length && time)

  const title = useMemo(() => {
    return flowType === 'language'
      ? 'Find the right African language tutor for your child.'
      : 'Find the right private academic tutor for your child.'
  }, [flowType])

  function toggleDay(day: string) {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((item) => item !== day) : [...prev, day]
    )
  }

  function changeFlow(type: FlowType) {
    setFlowType(type)
    setSubject('')
    setGoal('')
    setLevel('')
    setDays([])
    setTime('')
  }

  function continueFlow() {
    if (!canContinue) return

    const params = new URLSearchParams()
    params.set('type', flowType)
    params.set('subject', subject.toLowerCase())
    params.set('goal', goal)
    params.set('level', level)
    params.set('days', days.join(','))
    params.set('time', time)

    router.push(`/subjects?${params.toString()}`)
  }

  return (
    <main className="page">
      <section className="shell">        

        <section className="hero">
          <div className="copy">
            <p className="eyebrow">Private 1-to-1 tutoring</p>
            <h1>{title}</h1>
            <p>
              Browse first, answer a few quick questions, and we’ll guide you towards
              suitable tutors and lesson plans. Login is only required when you are ready to book.
            </p>

            <div className="switcher">
              <button
                type="button"
                className={flowType === 'language' ? 'active' : ''}
                onClick={() => changeFlow('language')}
              >
                Choose a Language
              </button>

              <button
                type="button"
                className={flowType === 'academic' ? 'active' : ''}
                onClick={() => changeFlow('academic')}
              >
                Academic Subjects
              </button>
            </div>
          </div>

          <div className="imageWrap">
            <Image
              src={flowType === 'language' ? '/language-tutoring.png' : '/academic-tutoring.png'}
              alt={
                flowType === 'language'
                  ? 'Child learning an African language online'
                  : 'Child learning academic subjects online'
              }
              width={720}
              height={520}
              priority
            />
          </div>
        </section>

        <section className="formCard">
          <div className="sectionHead">
            <p>{flowType === 'language' ? 'African languages' : 'Academic subjects'}</p>
            <h2>Choose what your child would like to learn</h2>
          </div>

          <div className="subjectGrid">
            {cards.map((card) => (
              <button
                key={card.name}
                type="button"
                className={subject === card.name ? 'subjectCard selected' : 'subjectCard'}
                onClick={() => setSubject(card.name)}
              >
                <span className="subjectIcon">{card.icon}</span>
                <strong>{card.title}</strong>
                <small>{card.text}</small>

                <div>
                  {card.points.map((point) => (
                    <em key={point}>✓ {point}</em>
                  ))}
                </div>

                <b>{subject === card.name ? 'Selected ✓' : 'Start Learning →'}</b>
              </button>
            ))}

            <div className="comingSoonCard">
              <span>{flowType === 'language' ? '🌍' : '✨'}</span>
              <strong>
                {flowType === 'language'
                  ? 'More African languages'
                  : 'More subjects'}
              </strong>
              <small>Coming soon</small>
            </div>
          </div>

          <Step title="What is your child’s main goal?">
            <div className="goalGrid">
              {goals.map((item) => (
                <button
                  key={item.title}
                  type="button"
                  className={goal === item.title ? 'goalCard selected' : 'goalCard'}
                  onClick={() => setGoal(item.title)}
                >
                  <span>{item.icon}</span>
                  <strong>{item.title}</strong>
                  <small>{item.text}</small>
                </button>
              ))}
            </div>
          </Step>

          <Step title="What is your child’s current level?">
            <div className="options">
              {levels.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={level === item ? 'selected' : ''}
                  onClick={() => setLevel(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </Step>

          <Step title="When is your child usually available?">
            <div className="options small">
              {daysList.map((day) => (
                <button
                  key={day}
                  type="button"
                  className={days.includes(day) ? 'selected' : ''}
                  onClick={() => toggleDay(day)}
                >
                  {day}
                </button>
              ))}
            </div>

            <div className="options">
              {times.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={time === item ? 'selected' : ''}
                  onClick={() => setTime(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </Step>

          <div className="trustBox">
            <strong>Why families choose Fountain Prep</strong>
            <div>
              <span>✓ Private 1-to-1 lessons</span>
              <span>✓ Structured curriculum</span>
              <span>✓ Flexible scheduling</span>
              <span>✓ Progress updates</span>
              <span>✓ Safe online classroom</span>
              <span>✓ Learn from anywhere</span>
            </div>
          </div>

          <div className="priceBox">
            <span>Private lessons from</span>
            <strong>£9</strong>
            <small>per lesson</small>
            <p>Native tutors. Flexible schedules. Parent reports.</p>
          </div>

          <button
            type="button"
            className="continueBtn"
            disabled={!canContinue}
            onClick={continueFlow}
          >
            Find My Child&apos;s Tutor →
          </button>

          <p className="note">
            You can browse first. Login is only required when you&apos;re ready to book.
          </p>
        </section>
      </section>

      <style>{styles}</style>
    </main>
  )
}

export default function StartPage() {
  return (
    <Suspense fallback={<main className="page">Loading...</main>}>
      <StartPageContent />
    </Suspense>
  )
}

function Step({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="step">
      <h2>{title}</h2>
      {children}
    </section>
  )
}

const styles = `
.page {
  min-height: 100vh;
  background:
    radial-gradient(circle at 10% 0%, rgba(124, 58, 237, 0.12), transparent 30%),
    linear-gradient(135deg, #fff, #f8f1ff);
  color: #241235;
  padding: 22px;
}

.shell {
  max-width: 1180px;
  margin: 0 auto;
}

.logo span {
  color: #7c3aed;
}

.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  align-items: center;
  padding: 34px;
  border-radius: 36px;
  background: white;
  border: 1px solid #eadcff;
  box-shadow: 0 22px 60px rgba(50, 20, 80, .08);
}

.eyebrow {
  display: inline-block;
  margin: 0 0 14px;
  padding: 9px 14px;
  border-radius: 999px;
  background: #f1e8ff;
  color: #6d28d9;
  font-weight: 950;
  font-size: .8rem;
}

h1 {
  margin: 0;
  font-size: clamp(2.4rem, 6vw, 4.6rem);
  line-height: .95;
  letter-spacing: -.06em;
}

.copy p {
  color: #6b5b7a;
  line-height: 1.7;
  font-size: 1.05rem;
}

.switcher {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 22px;
}

.switcher button,
.options button {
  border: 1px solid #ddd6fe;
  background: white;
  color: #241235;
  border-radius: 16px;
  padding: 14px 16px;
  font-weight: 900;
  cursor: pointer;
}

.switcher button.active,
.options button.selected {
  background: #7c3aed;
  color: white;
  border-color: #7c3aed;
}

.imageWrap img {
  width: 100%;
  height: auto;
  border-radius: 28px;
  object-fit: cover;
}

.formCard {
  margin-top: 22px;
  padding: 30px;
  border-radius: 34px;
  background: white;
  border: 1px solid #eadcff;
  box-shadow: 0 22px 60px rgba(50, 20, 80, .08);
}

.sectionHead p {
  margin: 0 0 8px;
  color: #7c3aed;
  font-size: .82rem;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: .08em;
}

.sectionHead h2,
.step h2 {
  margin: 0 0 18px;
  font-size: clamp(1.7rem, 4vw, 2.7rem);
  letter-spacing: -.04em;
}

.subjectGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.subjectCard,
.comingSoonCard,
.goalCard {
  text-align: left;
  border: 1px solid #eadcff;
  background: #fff;
  border-radius: 26px;
  padding: 22px;
  cursor: pointer;
  box-shadow: 0 14px 34px rgba(50, 20, 80, .06);
}

.subjectCard.selected,
.goalCard.selected {
  border-color: #7c3aed;
  background: linear-gradient(135deg, #fff, #f7f1ff);
  box-shadow: 0 22px 50px rgba(124, 58, 237, .16);
}

.subjectIcon,
.goalCard span,
.comingSoonCard span {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: #f3eaff;
  font-size: 26px;
  margin-bottom: 16px;
}

.subjectCard strong,
.goalCard strong,
.comingSoonCard strong {
  display: block;
  color: #241235;
  font-size: 1.25rem;
  font-weight: 950;
}

.subjectCard small,
.goalCard small,
.comingSoonCard small {
  display: block;
  margin-top: 9px;
  color: #6b5b7a;
  line-height: 1.6;
}

.subjectCard div {
  display: grid;
  gap: 7px;
  margin-top: 16px;
}

.subjectCard em {
  font-style: normal;
  color: #4c1d95;
  font-size: .88rem;
  font-weight: 850;
}

.subjectCard b {
  display: block;
  margin-top: 18px;
  color: #7c3aed;
}

.comingSoonCard {
  opacity: .72;
  cursor: default;
  background: #faf7ff;
}

.step {
  padding: 28px 0;
  border-bottom: 1px solid #f0e7ff;
}

.goalGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.options.small {
  margin-bottom: 14px;
}

.options.small button {
  min-width: 72px;
}

.trustBox {
  margin-top: 26px;
  padding: 22px;
  border-radius: 24px;
  background: #faf7ff;
  border: 1px solid #eadcff;
}

.trustBox strong {
  display: block;
  font-size: 1.15rem;
  margin-bottom: 14px;
}

.trustBox div {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.trustBox span {
  padding: 11px 13px;
  border-radius: 999px;
  background: white;
  color: #5f5272;
  font-size: .88rem;
  font-weight: 850;
}

.priceBox {
  margin-top: 22px;
  padding: 24px;
  text-align: center;
  border-radius: 26px;
  background: linear-gradient(135deg, #7c3aed, #5b21b6);
  color: white;
}

.priceBox span,
.priceBox small,
.priceBox p {
  display: block;
  margin: 0;
}

.priceBox strong {
  display: block;
  font-size: 3rem;
  line-height: 1;
  margin: 8px 0;
}

.priceBox p {
  margin-top: 10px;
  opacity: .9;
}

.continueBtn {
  margin-top: 18px;
  width: 100%;
  border: 0;
  border-radius: 18px;
  padding: 18px;
  background: #7c3aed;
  color: white;
  font-size: 1.05rem;
  font-weight: 950;
  cursor: pointer;
}

.continueBtn:disabled {
  background: #d8d2e6;
  color: #81778f;
  cursor: not-allowed;
}

.note {
  text-align: center;
  color: #7a6d85;
  font-weight: 700;
}

@media (max-width: 900px) {
  .page {
    padding: 14px;
  }

  .hero {
    grid-template-columns: 1fr;
    padding: 22px;
    border-radius: 28px;
  }

  .imageWrap {
    order: -1;
  }

  .formCard {
    padding: 22px;
    border-radius: 28px;
  }

  .subjectGrid,
  .goalGrid,
  .trustBox div {
    grid-template-columns: 1fr;
  }

  .logo {
    font-size: 1.45rem;
  }
}
`