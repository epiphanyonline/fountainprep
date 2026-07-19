'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

type TutorProfile = {
  id: string
  full_name: string
  approval_status: string
  orientation_completed: boolean
  orientation_last_slide: number
  orientation_score: number | null
}

type Slide = {
  eyebrow: string
  title: string
  description: string
  points: string[]
  diagram?: string[]
}

const slides: Slide[] = [
  {
    eyebrow: 'Welcome',
    title: 'Welcome to Fountain Prep',
    description:
      'You are joining a learning community committed to safe, engaging and high-quality online education.',
    points: [
      'Prepare carefully for every lesson.',
      'Treat every learner with patience and respect.',
      'Represent Fountain Prep professionally at all times.',
    ],
  },
  {
    eyebrow: 'Platform tour',
    title: 'Your tutor dashboard',
    description:
      'Your dashboard is the centre for managing your work on Fountain Prep.',
    points: [
      'My Sessions: view assigned and upcoming lessons.',
      'Availability: publish the times parents can book.',
      'Lesson Reports: record learner progress after class.',
      'Communication Centre: read important platform updates.',
    ],
    diagram: [
      'Tutor Dashboard',
      'My Sessions',
      'Availability',
      'Lesson Reports',
      'Communication Centre',
    ],
  },
  {
    eyebrow: 'Profile',
    title: 'Keep your professional profile complete',
    description:
      'Parents use your profile to understand your experience and teaching style.',
    points: [
      'Use a clear and professional photograph.',
      'Keep your biography and qualifications accurate.',
      'Update your experience and languages when necessary.',
    ],
  },
  {
    eyebrow: 'Availability',
    title: 'Publish only times you can teach',
    description:
      'Parents can book the availability you publish, so your timetable must always be accurate.',
    points: [
      'Select the correct subject and teaching level.',
      'Use your own timezone carefully.',
      'Remove unavailable periods before parents book them.',
      'Check your dashboard regularly for confirmed lessons.',
    ],
    diagram: ['Choose subject', 'Choose level', 'Select day and time', 'Save availability'],
  },
  {
    eyebrow: 'Lessons',
    title: 'Prepare and join lessons professionally',
    description:
      'Join early, check your equipment and create a calm learning environment.',
    points: [
      'Join at least five minutes before the lesson.',
      'Use a stable internet connection and working microphone.',
      'Teach from a quiet and well-lit space.',
      'Keep your camera on unless Fountain Prep has approved otherwise.',
    ],
    diagram: ['Booking confirmed', 'Open dashboard', 'Select lesson', 'Join classroom'],
  },
  {
    eyebrow: 'Teaching quality',
    title: 'Make every lesson engaging',
    description:
      'Lessons should be structured, encouraging and appropriate for the learner’s age and ability.',
    points: [
      'Begin with a clear lesson objective.',
      'Encourage the learner to participate actively.',
      'Use examples, questions and age-appropriate activities.',
      'End with a recap and explain the next learning focus.',
    ],
  },
  {
    eyebrow: 'Reports',
    title: 'Complete a lesson report after class',
    description:
      'Parents value clear feedback about what their child learned and what comes next.',
    points: [
      'Record what was covered.',
      'Describe the learner’s participation and progress.',
      'State the next learning focus.',
      'Keep comments professional, specific and constructive.',
    ],
  },
  {
    eyebrow: 'Communication',
    title: 'Use official Fountain Prep channels',
    description:
      'Platform communication protects tutors, learners and families.',
    points: [
      'Read dashboard announcements and emails promptly.',
      'Do not move lessons or payments outside Fountain Prep.',
      'Do not share private contact details unless authorised.',
      'Contact support when you need help.',
    ],
  },
  {
    eyebrow: 'Safeguarding',
    title: 'Children’s safety comes first',
    description:
      'Maintain clear professional boundaries and report concerns immediately.',
    points: [
      'Never record or photograph a learner without written authorisation.',
      'Never use inappropriate, discriminatory or threatening language.',
      'Do not contact a child privately outside approved channels.',
      'Report safeguarding concerns to Fountain Prep immediately.',
    ],
  },
  {
    eyebrow: 'Final step',
    title: 'Complete the knowledge check',
    description:
      'Answer all questions correctly and confirm your commitment to the tutor standards.',
    points: [
      'The pass mark is 80%.',
      'You can review the orientation and try again.',
      'Completion will be recorded automatically on your profile.',
    ],
  },
]

const questions = [
  {
    question: 'When should you join an online lesson?',
    options: [
      'After the learner joins',
      'At least five minutes before the lesson',
      'Only when the parent sends a reminder',
    ],
    answer: 1,
  },
  {
    question: 'Where should lesson payments be managed?',
    options: [
      'Through Fountain Prep',
      'Through the tutor’s personal bank account',
      'Through private messaging',
    ],
    answer: 0,
  },
  {
    question: 'What should you do after completing a lesson?',
    options: [
      'Wait for the parent to request feedback',
      'Submit a clear lesson report',
      'Delete the lesson from the dashboard',
    ],
    answer: 1,
  },
  {
    question: 'What should you do if you have a safeguarding concern?',
    options: [
      'Ignore it unless the parent complains',
      'Discuss it publicly',
      'Report it to Fountain Prep immediately',
    ],
    answer: 2,
  },
  {
    question: 'What availability should you publish?',
    options: [
      'Any time that attracts bookings',
      'Only times you are genuinely available to teach',
      'The same schedule as every other tutor',
    ],
    answer: 1,
  },
]

export default function TutorOrientationPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<TutorProfile | null>(null)
  const [slideIndex, setSlideIndex] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [finalScore, setFinalScore] = useState<number | null>(null)

  useEffect(() => {
    async function loadOrientation() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('tutor_profiles')
        .select(
          'id, full_name, approval_status, orientation_completed, orientation_last_slide, orientation_score'
        )
        .eq('user_id', user.id)
        .single()

      if (error || !data) {
        setMessage(error?.message || 'Tutor profile could not be found.')
        setLoading(false)
        return
      }

      if (data.approval_status !== 'approved') {
        router.push('/tutor')
        return
      }

      setProfile(data as TutorProfile)
      setSlideIndex(
        Math.min(
          Math.max(Number(data.orientation_last_slide || 0), 0),
          slides.length - 1
        )
      )
      setLoading(false)
    }

    loadOrientation()
  }, [router])

  const progress = useMemo(() => {
    if (showQuiz) return 100
    return Math.round(((slideIndex + 1) / slides.length) * 100)
  }, [showQuiz, slideIndex])

  async function saveSlide(nextIndex: number) {
    if (!profile) return

    await supabase
      .from('tutor_profiles')
      .update({ orientation_last_slide: nextIndex })
      .eq('id', profile.id)
  }

  async function goNext() {
    if (slideIndex === slides.length - 1) {
      setShowQuiz(true)
      return
    }

    const nextIndex = slideIndex + 1
    setSlideIndex(nextIndex)
    await saveSlide(nextIndex)
  }

  async function goBack() {
    if (showQuiz) {
      setShowQuiz(false)
      return
    }

    const nextIndex = Math.max(slideIndex - 1, 0)
    setSlideIndex(nextIndex)
    await saveSlide(nextIndex)
  }

  async function submitOrientation() {
    if (!profile) return

    if (Object.keys(answers).length !== questions.length) {
      setMessage('Please answer every knowledge-check question.')
      return
    }

    if (!agreed) {
      setMessage('Please confirm that you agree to the tutor standards.')
      return
    }

    const correct = questions.reduce(
      (total, item, index) => total + (answers[index] === item.answer ? 1 : 0),
      0
    )
    const score = Math.round((correct / questions.length) * 100)

    setFinalScore(score)

    if (score < 80) {
      setMessage(
        `You scored ${score}%. The required score is 80%. Please review the orientation and try again.`
      )
      return
    }

    setSaving(true)
    setMessage('')

    const { error } = await supabase
      .from('tutor_profiles')
      .update({
        orientation_completed: true,
        orientation_completed_at: new Date().toISOString(),
        orientation_version: 'v1',
        orientation_score: score,
        orientation_last_slide: slides.length - 1,
      })
      .eq('id', profile.id)

    setSaving(false)

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage(`Congratulations! You scored ${score}% and passed the orientation.`)

    window.setTimeout(() => {
      router.push('/tutor/payout-setup')
      router.refresh()
    }, 1800)
  }

  if (loading) {
    return (
      <main className="orientationPage">
        <section className="orientationShell">
          <p>Loading your orientation...</p>
        </section>
        <style jsx global>{styles}</style>
      </main>
    )
  }

  const slide = slides[slideIndex]

  return (
    <main className="orientationPage">
      <section className="orientationShell">
        <header className="orientationHeader">
          <div>
            <p className="brand">FOUNTAIN PREP</p>
            <p className="headerTitle">Tutor Orientation</p>
          </div>

          <Link href="/tutor" className="exitLink">
            Save & Exit
          </Link>
        </header>

        <div className="progressTrack" aria-label={`Orientation progress ${progress}%`}>
          <span style={{ width: `${progress}%` }} />
        </div>

        <div className="progressText">
          <span>{showQuiz ? 'Knowledge Check' : `Section ${slideIndex + 1} of ${slides.length}`}</span>
          <strong>{progress}%</strong>
        </div>

        {!showQuiz ? (
          <article className="slideCard">
            <div className="slideCopy">
              <p className="slideEyebrow">{slide.eyebrow}</p>
              <h1>{slide.title}</h1>
              <p className="slideDescription">{slide.description}</p>

              <div className="pointList">
                {slide.points.map((point) => (
                  <div className="point" key={point}>
                    <span>✓</span>
                    <p>{point}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="visualPanel">
              {slide.diagram ? (
                <div className="flowDiagram">
                  {slide.diagram.map((item, index) => (
                    <div key={item}>
                      <div className="flowNode">{item}</div>
                      {index < slide.diagram!.length - 1 ? (
                        <div className="flowArrow">↓</div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="visualMark">
                  <span>{String(slideIndex + 1).padStart(2, '0')}</span>
                  <strong>Fountain Prep Tutor Standard</strong>
                </div>
              )}
            </div>
          </article>
        ) : (
          <article className="quizCard">
            <p className="slideEyebrow">Knowledge Check</p>
            <h1>Confirm what you have learned</h1>
            <p className="slideDescription">
              Select one answer for each question. You need 80% to complete orientation.
            </p>

            <div className="questionList">
              {questions.map((item, questionIndex) => (
                <fieldset className="questionCard" key={item.question}>
                  <legend>
                    {questionIndex + 1}. {item.question}
                  </legend>

                  {item.options.map((option, optionIndex) => (
                    <label className="answerOption" key={option}>
                      <input
                        type="radio"
                        name={`question-${questionIndex}`}
                        checked={answers[questionIndex] === optionIndex}
                        onChange={() =>
                          setAnswers((current) => ({
                            ...current,
                            [questionIndex]: optionIndex,
                          }))
                        }
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </fieldset>
              ))}
            </div>

            <label className="agreementBox">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(event) => setAgreed(event.target.checked)}
              />
              <span>
                I confirm that I have completed the orientation and agree to follow
                Fountain Prep’s teaching, communication, safeguarding and professional
                standards.
              </span>
            </label>

            {finalScore !== null ? (
              <div className={finalScore >= 80 ? 'scoreBox scorePass' : 'scoreBox'}>
                <span>Your score</span>
                <strong>{finalScore}%</strong>
                <p>{finalScore >= 80 ? 'Passed' : 'Review and try again'}</p>
              </div>
            ) : null}

            {message ? <p className="formMessage">{message}</p> : null}
          </article>
        )}

        <footer className="orientationFooter">
          <button
            type="button"
            className="secondaryButton"
            onClick={goBack}
            disabled={!showQuiz && slideIndex === 0}
          >
            Back
          </button>

          {!showQuiz ? (
            <button type="button" className="primaryButton" onClick={goNext}>
              {slideIndex === slides.length - 1
                ? 'Start Knowledge Check'
                : 'Continue'}
            </button>
          ) : (
            <button
              type="button"
              className="primaryButton"
              onClick={submitOrientation}
              disabled={saving}
            >
              {saving ? 'Completing...' : 'Complete Orientation'}
            </button>
          )}
        </footer>
      </section>

      <style jsx global>{styles}</style>
    </main>
  )
}

const styles = `
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
  }

  .orientationPage {
    min-height: 100vh;
    padding: 28px 16px 60px;
    color: #241433;
    background:
      radial-gradient(circle at 8% 0%, rgba(124,58,237,0.17), transparent 28%),
      radial-gradient(circle at 95% 15%, rgba(236,72,153,0.09), transparent 26%),
      linear-gradient(180deg, #fffaff 0%, #f6f0ff 100%);
  }

  .orientationShell {
    width: min(1120px, 100%);
    margin: 0 auto;
  }

  .orientationHeader,
  .orientationFooter,
  .progressText {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
  }

  .brand,
  .headerTitle {
    margin: 0;
  }

  .brand {
    color: #6d28d9;
    font-size: 12px;
    font-weight: 950;
    letter-spacing: 0.12em;
  }

  .headerTitle {
    margin-top: 4px;
    font-size: 22px;
    font-weight: 950;
  }

  .exitLink {
    padding: 11px 16px;
    border-radius: 999px;
    color: #351e55;
    background: white;
    border: 1px solid rgba(124,58,237,0.16);
    text-decoration: none;
    font-size: 13px;
    font-weight: 950;
  }

  .progressTrack {
    height: 10px;
    margin-top: 25px;
    overflow: hidden;
    border-radius: 999px;
    background: rgba(124,58,237,0.12);
  }

  .progressTrack span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #7c3aed, #a855f7);
    transition: width 240ms ease;
  }

  .progressText {
    margin-top: 10px;
    color: #74677f;
    font-size: 13px;
    font-weight: 850;
  }

  .slideCard {
    min-height: 610px;
    margin-top: 22px;
    display: grid;
    grid-template-columns: 1.18fr 0.82fr;
    overflow: hidden;
    border-radius: 38px;
    background: rgba(255,255,255,0.96);
    border: 1px solid rgba(124,58,237,0.13);
    box-shadow: 0 32px 90px rgba(64,38,105,0.13);
  }

  .slideCopy {
    padding: clamp(30px, 6vw, 68px);
  }

  .slideEyebrow {
    margin: 0;
    color: #6d28d9;
    font-size: 13px;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: 0.09em;
  }

  .slideCard h1,
  .quizCard h1 {
    margin: 14px 0 0;
    font-size: clamp(40px, 6vw, 72px);
    line-height: 0.96;
    letter-spacing: -0.06em;
    font-weight: 950;
  }

  .slideDescription {
    max-width: 690px;
    margin: 20px 0 0;
    color: #70637b;
    font-size: 17px;
    line-height: 1.7;
  }

  .pointList {
    margin-top: 28px;
    display: grid;
    gap: 13px;
  }

  .point {
    display: grid;
    grid-template-columns: 30px 1fr;
    gap: 12px;
    align-items: start;
  }

  .point span {
    width: 28px;
    height: 28px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    color: white;
    background: #7c3aed;
    font-weight: 950;
  }

  .point p {
    margin: 2px 0 0;
    color: #493b55;
    line-height: 1.55;
    font-weight: 750;
  }

  .visualPanel {
    min-height: 100%;
    padding: 38px;
    display: grid;
    place-items: center;
    background:
      radial-gradient(circle at top right, rgba(255,255,255,0.22), transparent 32%),
      linear-gradient(145deg, #7c3aed, #4c1d95);
  }

  .flowDiagram {
    width: min(330px, 100%);
  }

  .flowNode {
    padding: 16px;
    border-radius: 19px;
    text-align: center;
    color: white;
    background: rgba(255,255,255,0.14);
    border: 1px solid rgba(255,255,255,0.24);
    backdrop-filter: blur(10px);
    font-weight: 950;
  }

  .flowArrow {
    padding: 7px 0;
    color: rgba(255,255,255,0.8);
    text-align: center;
    font-size: 22px;
    font-weight: 950;
  }

  .visualMark {
    text-align: center;
    color: white;
  }

  .visualMark span {
    display: block;
    font-size: clamp(90px, 14vw, 160px);
    line-height: 0.85;
    letter-spacing: -0.08em;
    font-weight: 950;
    opacity: 0.92;
  }

  .visualMark strong {
    display: block;
    max-width: 260px;
    margin: 24px auto 0;
    font-size: 22px;
    line-height: 1.2;
  }

  .quizCard {
    margin-top: 22px;
    padding: clamp(26px, 5vw, 58px);
    border-radius: 38px;
    background: rgba(255,255,255,0.97);
    border: 1px solid rgba(124,58,237,0.13);
    box-shadow: 0 32px 90px rgba(64,38,105,0.13);
  }

  .quizCard h1 {
    font-size: clamp(38px, 5vw, 64px);
  }

  .questionList {
    margin-top: 34px;
    display: grid;
    gap: 18px;
  }

  .questionCard {
    margin: 0;
    padding: 22px;
    border-radius: 24px;
    border: 1px solid rgba(124,58,237,0.14);
    background: #fbf8ff;
  }

  .questionCard legend {
    padding: 0 8px;
    font-size: 17px;
    font-weight: 950;
  }

  .answerOption {
    margin-top: 12px;
    padding: 13px 15px;
    display: flex;
    gap: 12px;
    align-items: center;
    border-radius: 16px;
    background: white;
    border: 1px solid rgba(124,58,237,0.11);
    cursor: pointer;
  }

  .answerOption input,
  .agreementBox input {
    accent-color: #7c3aed;
  }

  .agreementBox {
    margin-top: 24px;
    padding: 18px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    border-radius: 20px;
    background: #f1eaff;
    color: #3f2758;
    line-height: 1.55;
    font-weight: 800;
  }

  .scoreBox {
    margin-top: 22px;
    padding: 20px;
    border-radius: 20px;
    text-align: center;
    color: #8a2b16;
    background: #fff4ed;
    border: 1px solid rgba(180,83,9,0.12);
  }

  .scorePass {
    color: #027a48;
    background: #ecfdf3;
    border-color: rgba(2,122,72,0.14);
  }

  .scoreBox span,
  .scoreBox strong,
  .scoreBox p {
    display: block;
  }

  .scoreBox span {
    font-size: 13px;
    font-weight: 900;
  }

  .scoreBox strong {
    margin-top: 5px;
    font-size: 44px;
    line-height: 1;
    font-weight: 950;
  }

  .scoreBox p {
    margin: 7px 0 0;
    font-weight: 900;
  }

  .formMessage {
    margin: 18px 0 0;
    padding: 14px 16px;
    border-radius: 16px;
    color: #8a2b16;
    background: #fff4ed;
    font-weight: 850;
  }

  .orientationFooter {
    margin-top: 22px;
  }

  .primaryButton,
  .secondaryButton {
    min-height: 52px;
    padding: 0 22px;
    border-radius: 17px;
    font: inherit;
    font-weight: 950;
    cursor: pointer;
  }

  .primaryButton {
    border: 0;
    color: white;
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    box-shadow: 0 16px 36px rgba(124,58,237,0.28);
  }

  .secondaryButton {
    color: #351e55;
    background: white;
    border: 1px solid rgba(124,58,237,0.16);
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  @media (max-width: 820px) {
    .orientationPage {
      padding: 18px 10px 45px;
    }

    .slideCard {
      min-height: auto;
      grid-template-columns: 1fr;
      border-radius: 30px;
    }

    .slideCopy {
      padding: 30px 22px;
    }

    .slideCard h1,
    .quizCard h1 {
      font-size: clamp(38px, 12vw, 56px);
    }

    .visualPanel {
      min-height: 370px;
      padding: 28px 20px;
    }

    .quizCard {
      padding: 28px 18px;
      border-radius: 30px;
    }

    .orientationFooter {
      align-items: stretch;
    }

    .primaryButton,
    .secondaryButton {
      width: 100%;
    }
  }
`