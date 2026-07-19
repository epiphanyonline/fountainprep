'use client'

type Props = {
  currentStep: 1 | 2 | 3 | 4 | 5
  childName?: string | null
  subjectName?: string | null
  planName?: string | null
}

const steps = ['Child', 'Subject', 'Plan', 'Schedule', 'Payment']

export function BookingJourney({
  currentStep,
  childName,
  subjectName,
  planName,
}: Props) {
  const context = [childName, subjectName, planName].filter(Boolean).join(' · ')
  const nextLabel = steps[currentStep] || 'Complete booking'

  return (
    <section className="journey" aria-label="Booking progress">
      <div className="journeyIntro">
        <div>
          <span>Step {currentStep} of 5</span>
          <strong>{steps[currentStep - 1]}</strong>
        </div>
        <p>{currentStep < 5 ? `Next: ${nextLabel}` : 'Final step'}</p>
      </div>

      <ol>
        {steps.map((step, index) => {
          const number = index + 1
          const state =
            number < currentStep
              ? 'complete'
              : number === currentStep
                ? 'current'
                : 'upcoming'

          return (
            <li key={step} className={state} aria-current={state === 'current' ? 'step' : undefined}>
              <span>{state === 'complete' ? '✓' : number}</span>
              <strong>{step}</strong>
            </li>
          )
        })}
      </ol>

      {context ? <p className="journeyContext">{context}</p> : null}

      <style jsx>{`
        .journey {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto 20px;
          padding: 18px 20px;
          box-sizing: border-box;
          border: 1px solid rgba(124, 58, 237, 0.16);
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 16px 44px rgba(71, 43, 117, 0.08);
        }

        .journeyIntro {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 14px;
        }

        .journeyIntro div {
          display: flex;
          align-items: baseline;
          gap: 9px;
        }

        .journeyIntro span,
        .journeyIntro p {
          margin: 0;
          color: #766b82;
          font-size: 13px;
          font-weight: 850;
        }

        .journeyIntro strong {
          color: #241438;
          font-size: 16px;
        }

        ol {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 8px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        li {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px;
          border-radius: 14px;
          color: #8b8294;
          background: #faf8fc;
        }

        li span {
          width: 26px;
          height: 26px;
          flex: 0 0 26px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          background: #ece7f3;
          font-size: 12px;
          font-weight: 950;
        }

        li strong {
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 13px;
          white-space: nowrap;
        }

        li.complete {
          color: #087443;
          background: #ecfdf3;
        }

        li.complete span {
          color: white;
          background: #12a064;
        }

        li.current {
          color: #5b21b6;
          background: #f1eafe;
          box-shadow: inset 0 0 0 1px rgba(109, 40, 217, 0.16);
        }

        li.current span {
          color: white;
          background: #6d28d9;
        }

        .journeyContext {
          margin: 12px 0 0;
          color: #6d28d9;
          font-size: 13px;
          font-weight: 900;
        }

        @media (max-width: 700px) {
          .journey {
            padding: 15px;
            border-radius: 20px;
          }

          .journeyIntro p {
            display: none;
          }

          ol {
            grid-template-columns: repeat(5, 1fr);
          }

          li {
            justify-content: center;
            padding: 8px 4px;
          }

          li strong {
            display: none;
          }
        }
      `}</style>
    </section>
  )
}
