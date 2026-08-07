"use client";

import type { LessonSlide as LessonSlideType } from "../types/classroom";

type LessonSlideProps = {
  slide: LessonSlideType;
  programme: string;
  stage: string;
};

function getActionLabel(action: LessonSlideType["action"]) {
  switch (action) {
    case "listen":
      return "Listen carefully";
    case "repeat":
      return "Listen and repeat";
    case "speak":
      return "Your turn to speak";
    case "continue":
      return "Continue learning";
    case "complete":
      return "Lesson complete";
    default:
      return "Learning activity";
  }
}

export default function LessonSlide({
  slide,
  programme,
  stage,
}: LessonSlideProps) {
  return (
    <section className="slideCard" aria-labelledby={`slide-title-${slide.id}`}>
      <div className="slideTopline">
        <div>
          <p className="slideEyebrow">
            {programme} · {stage}
          </p>
          <span className={`actionBadge action-${slide.action}`}>
            {getActionLabel(slide.action)}
          </span>
        </div>

        {slide.illustration ? (
          <div className="illustration" aria-hidden="true">
            {slide.illustration}
          </div>
        ) : null}
      </div>

      <div className="slideContent">
        <div className="titleArea">
          {slide.subtitle ? (
            <p className="subtitle">{slide.subtitle}</p>
          ) : null}

          <h2 id={`slide-title-${slide.id}`}>{slide.title}</h2>

          <p className="explanation">{slide.explanation}</p>
        </div>

        {slide.nativeText || slide.englishText ? (
          <div className="phrasePanel">
            {slide.nativeText ? (
              <div className="phrase nativePhrase">
                <span className="phraseLabel">Learn this</span>
                <strong lang={programme.toLowerCase()}>
                  {slide.nativeText}
                </strong>
              </div>
            ) : null}

            {slide.englishText ? (
              <div className="phrase englishPhrase">
                <span className="phraseLabel">Meaning</span>
                <strong>{slide.englishText}</strong>
              </div>
            ) : null}
          </div>
        ) : null}

        {slide.hint ? (
          <aside className="hintCard">
            <span className="hintIcon" aria-hidden="true">
              💡
            </span>

            <div>
              <p>Helpful hint</p>
              <span>{slide.hint}</span>
            </div>
          </aside>
        ) : null}

        {slide.expectedAnswer && slide.action === "speak" ? (
          <div className="practicePrompt">
            <span className="practiceIcon" aria-hidden="true">
              🎤
            </span>

            <div>
              <p>When you are ready</p>
              <strong>Say the answer aloud</strong>
            </div>
          </div>
        ) : null}
      </div>

      <style jsx>{`
        .slideCard {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-height: 0;
height: 100%;
          padding: 30px;
          border-radius: 34px;
          border: 1px solid rgba(111, 66, 193, 0.13);
          background:
            radial-gradient(
              circle at top right,
              rgba(255, 220, 128, 0.2),
              transparent 30%
            ),
            radial-gradient(
              circle at bottom left,
              rgba(138, 92, 246, 0.12),
              transparent 32%
            ),
            #ffffff;
          box-shadow: 0 24px 70px rgba(48, 29, 82, 0.1);
        }

        .slideTopline {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .slideEyebrow {
          margin: 0 0 9px;
          color: #6f42c1;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .actionBadge {
          display: inline-flex;
          align-items: center;
          min-height: 34px;
          padding: 0 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 900;
          background: #f1ebfb;
          color: #6f42c1;
          border: 1px solid rgba(111, 66, 193, 0.1);
        }

        .action-listen,
        .action-repeat {
          color: #1d4ed8;
          background: #eff6ff;
          border-color: rgba(29, 78, 216, 0.12);
        }

        .action-speak {
          color: #166534;
          background: #f0fdf4;
          border-color: rgba(22, 101, 52, 0.13);
        }

        .action-complete {
          color: #7c5c00;
          background: #fff8d9;
          border-color: rgba(124, 92, 0, 0.14);
        }

        .illustration {
          flex: 0 0 auto;
          width: 74px;
          height: 74px;
          display: grid;
          place-items: center;
          border-radius: 25px;
          background: rgba(255, 255, 255, 0.88);
          border: 1px solid rgba(111, 66, 193, 0.1);
          box-shadow: 0 14px 34px rgba(48, 29, 82, 0.09);
          font-size: 38px;
        }

        .slideContent {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          max-width: 760px;
          width: 100%;
          margin: 0 auto;
          padding: 30px 0 12px;
        }

        .titleArea {
          text-align: center;
        }

        .subtitle {
          margin: 0 0 10px;
          color: #9a6df5;
          font-size: 14px;
          font-weight: 900;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        h2 {
          margin: 0;
          color: #241438;
          font-size: clamp(36px, 5vw, 66px);
          line-height: 0.98;
          letter-spacing: -0.055em;
        }

        .explanation {
          max-width: 660px;
          margin: 20px auto 0;
          color: #6e627c;
          font-size: 18px;
          font-weight: 680;
          line-height: 1.7;
        }

        .phrasePanel {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          margin-top: 34px;
        }

        .phrase {
          min-height: 150px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 24px;
          border-radius: 28px;
          text-align: center;
        }

        .nativePhrase {
          background:
            radial-gradient(
              circle at top right,
              rgba(255, 255, 255, 0.2),
              transparent 30%
            ),
            linear-gradient(135deg, #6f42c1, #8a5cf6);
          color: #ffffff;
          box-shadow: 0 18px 46px rgba(111, 66, 193, 0.22);
        }

        .englishPhrase {
          background: #faf7ff;
          color: #241438;
          border: 1px solid rgba(111, 66, 193, 0.11);
        }

        .phraseLabel {
          display: block;
          margin-bottom: 12px;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          opacity: 0.78;
        }

        .phrase strong {
          display: block;
          font-size: clamp(25px, 4vw, 44px);
          line-height: 1.15;
          letter-spacing: -0.03em;
        }

        .hintCard,
        .practicePrompt {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 14px;
          align-items: center;
          margin-top: 22px;
          padding: 17px 19px;
          border-radius: 22px;
        }

        .hintCard {
          background: #fffaf0;
          border: 1px solid rgba(191, 139, 0, 0.13);
        }

        .practicePrompt {
          background: #f0fdf4;
          border: 1px solid rgba(22, 101, 52, 0.12);
        }

        .hintIcon,
        .practiceIcon {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.8);
          font-size: 21px;
        }

        .hintCard p,
        .practicePrompt p {
          margin: 0 0 4px;
          color: #7c5c00;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .practicePrompt p {
          color: #166534;
        }

        .hintCard span,
        .practicePrompt strong {
          color: #4f435b;
          font-size: 15px;
          font-weight: 750;
          line-height: 1.55;
        }

        @media (max-width: 760px) {
          .slideCard {
            min-height: 540px;
            padding: 22px;
            border-radius: 28px;
          }

          .slideContent {
            padding-top: 24px;
          }

          .phrasePanel {
            grid-template-columns: 1fr;
          }

          .phrase {
            min-height: 125px;
          }

          .explanation {
            font-size: 16px;
          }
        }

        @media (max-width: 480px) {
          .slideTopline {
            align-items: center;
          }

          .illustration {
            width: 58px;
            height: 58px;
            border-radius: 19px;
            font-size: 29px;
          }

          h2 {
            font-size: clamp(34px, 12vw, 48px);
          }

          .phrase {
            padding: 20px;
            border-radius: 23px;
          }

          .hintCard,
          .practicePrompt {
            align-items: flex-start;
          }
        }
      `}</style>
    </section>
  );
}