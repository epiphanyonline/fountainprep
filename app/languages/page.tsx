'use client'

import Image from 'next/image'
import Link from 'next/link'

const languages = [
  {
    name: 'Yoruba',
    short: 'Y',
    text:
      'Build everyday speaking confidence, communicate with family and develop a deeper connection with Yoruba language and culture.',
  },
  {
    name: 'Igbo',
    short: 'I',
    text:
      'Develop practical vocabulary, listening skills and conversational confidence through structured private learning.',
  },
  {
    name: 'Hausa',
    short: 'H',
    text:
      'Learn useful Hausa for real conversations through guided teaching, speaking practice and cultural context.',
  },
]

export default function LanguagesPage() {
  return (
    <main className="page">
      {/* HERO */}
      <section className="hero">
        <div className="heroCopy">
          <div className="pill">
            Fountain Prep Languages
          </div>

          <h1>
            Help them speak the language
            <span> that connects them to home.</span>
          </h1>

          <p className="lead">
            Online Yoruba, Igbo and Hausa lessons for children,
            teenagers and adults — with private 1-to-1 tutors,
            AI-assisted practice and self-paced learning between
            lessons.
          </p>

          <div className="heroActions">
            <Link
              href="/parent/students"
              className="primary"
            >
              Start Language Learning
              <span>→</span>
            </Link>

            <a
              href="#how-it-works"
              className="secondary"
            >
              See How It Works
            </a>
          </div>

          <div className="trustRow">
            <span>
              <b>✓</b>
              Private 1-to-1
            </span>

            <span>
              <b>✓</b>
              Yoruba • Igbo • Hausa
            </span>

            <span>
              <b>✓</b>
              AI-assisted self-paced practice
            </span>
          </div>
        </div>

        <div className="heroVisual">
          <Image
            src="/images/language-culture.jpg"
            alt="Learner taking a private African language lesson online"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 56vw"
            className="heroImage"
          />

          <div className="imageShade" />

          <div className="imageBadge">
            <div className="badgeIcon">
              ✦
            </div>

            <div>
              <small>
                PREMIUM LANGUAGE LEARNING
              </small>

              <strong>
                Learn live. Practise all week.
              </strong>
            </div>
          </div>
        </div>
      </section>

      {/* LANGUAGES */}
      <section className="languageSection">
        <div className="sectionHeading centred">
          <p className="eyebrow">
            Choose a language
          </p>

          <h2>
            Language learning designed for
            real conversations.
          </h2>

          <p>
            Our goal is not simply to help learners memorise
            words. We want them to understand, respond and
            confidently use the language.
          </p>
        </div>

        <div className="languageGrid">
          {languages.map((language) => (
            <Link
              key={language.name}
              href="/parent/students"
              className="languageCard"
            >
              <div className="languageTop">
                <div className="languageInitial">
                  {language.short}
                </div>

                <div className="cardArrow">
                  →
                </div>
              </div>

              <h3>{language.name}</h3>

              <p>{language.text}</p>

              <div className="languageAction">
                Start learning {language.name}
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        className="learningModel"
        id="how-it-works"
      >
        <div className="sectionHeading centred">
          <p className="eyebrow">
            How it works
          </p>

          <h2>
            Learn live. Practise between lessons.
            <span> Keep progressing.</span>
          </h2>

          <p>
            Premium combines private 1-to-1 teaching with
            AI-assisted, self-paced practice so language
            learning continues throughout the week.
          </p>
        </div>

        <div className="steps">
          <article>
            <div className="stepTop">
              <div className="stepIcon">
                1
              </div>

              <span>LIVE</span>
            </div>

            <h3>
              Learn 1-to-1
            </h3>

            <p>
              Meet a dedicated Fountain Prep language tutor for
              structured private teaching, conversation,
              vocabulary, pronunciation and cultural context.
            </p>
          </article>

          <article>
            <div className="stepTop">
              <div className="stepIcon">
                2
              </div>

              <span>PRACTISE</span>
            </div>

            <h3>
              AI-Assisted Practice
            </h3>

            <p>
              Between live lessons, practise speaking,
              listening, pronunciation and recall through
              guided interactive activities at your own pace.
            </p>
          </article>

          <article>
            <div className="stepTop">
              <div className="stepIcon">
                3
              </div>

              <span>PROGRESS</span>
            </div>

            <h3>
              Return Stronger
            </h3>

            <p>
              Reinforce what was taught, build confidence and
              return to the next live lesson ready to progress
              further.
            </p>
          </article>
        </div>
      </section>

      {/* PREMIUM STORY */}
      <section className="premiumStory">
        <div className="premiumCopy">
          <div className="premiumKicker">
            PREMIUM BUNDLE
          </div>

          <h2>
            The live lesson is only
            the beginning.
          </h2>

          <p>
            Premium gives the learner private 1-to-1 teaching
            plus full access to AI-assisted, self-paced
            language learning between lessons.
          </p>

          <div className="premiumBenefits">
            <span>
              ✓ Private 1-to-1 lessons
            </span>

            <span>
              ✓ Full self-paced Language Academy
            </span>

            <span>
              ✓ AI-assisted speaking practice
            </span>

            <span>
              ✓ Listening & pronunciation
            </span>

            <span>
              ✓ Revision between classes
            </span>

            <span>
              ✓ Progress tracking
            </span>
          </div>

          <Link
            href="/parent/students"
            className="premiumButton"
          >
            Explore Premium
            <span>→</span>
          </Link>
        </div>

        <div className="premiumJourney">
          <div className="journeyCard">
            <div className="journeyNumber">
              01
            </div>

            <div>
              <small>LIVE LESSON</small>

              <strong>
                Learn 1-to-1
              </strong>

              <p>
                Learn something new with a
                dedicated tutor.
              </p>
            </div>
          </div>

          <div className="journeyConnector">
            ↓
          </div>

          <div className="journeyCard highlightedJourney">
            <div className="journeyNumber">
              02
            </div>

            <div>
              <small>BETWEEN LESSONS</small>

              <strong>
                AI-Assisted Self-Paced Practice
              </strong>

              <p>
                Speak, listen, revise and
                reinforce learning.
              </p>
            </div>
          </div>

          <div className="journeyConnector">
            ↓
          </div>

          <div className="journeyCard">
            <div className="journeyNumber">
              03
            </div>

            <div>
              <small>NEXT LESSON</small>

              <strong>
                Return Stronger
              </strong>

              <p>
                Continue from a stronger
                foundation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PLANS */}
      <section className="plansSection">
        <div className="sectionHeading centred">
          <p className="eyebrow">
            Ways to learn
          </p>

          <h2>
            Choose your learning experience.
          </h2>

          <p>
            Select one option below. The whole card is
            clickable.
          </p>
        </div>

        <div className="planGrid">
          {/* LIVE */}
          <Link
            href="/parent/students"
            className="planCard"
          >
            <div className="planCardTop">
              <div className="planLabel">
                1-TO-1 LIVE
              </div>

              <div className="planSelectIcon">
                →
              </div>
            </div>

            <h3>
              1-to-1 Live Lessons
            </h3>

            <p className="planIntro">
              Private language teaching with a
              dedicated tutor.
            </p>

            <div className="planDivider" />

            <ul>
              <li>
                <span>✓</span>
                Private 1-to-1 lessons
              </li>

              <li>
                <span>✓</span>
                1 or 2 lessons per week
              </li>

              <li>
                <span>✓</span>
                Monthly or 3-month plans
              </li>

              <li>
                <span>✓</span>
                Structured curriculum
              </li>

              <li>
                <span>✓</span>
                Progress updates
              </li>
            </ul>

            <div className="cardCta">
              Choose Live Lessons
              <span>→</span>
            </div>
          </Link>

          {/* PREMIUM */}
          <Link
            href="/parent/students"
            className="planCard premiumPlan"
          >
            <div className="recommended">
              RECOMMENDED
            </div>

            <div className="planCardTop">
              <div className="planLabel premiumLabel">
                PREMIUM BUNDLE
              </div>

              <div className="planSelectIcon premiumArrow">
                →
              </div>
            </div>

            <h3>
              1-to-1 Live + AI-Assisted
              Self-Paced Learning
            </h3>

            <p className="planIntro">
              The complete language-learning experience:
              live teaching plus structured practice
              throughout the week.
            </p>

            <div className="premiumValue">
              <strong>
                Live + Self-Paced
              </strong>

              <span>
                One connected learning experience
              </span>
            </div>

            <ul>
              <li>
                <span>✓</span>
                Everything in 1-to-1 Live
              </li>

              <li>
                <span>✓</span>
                Full self-paced Language Academy
              </li>

              <li>
                <span>✓</span>
                AI-assisted speaking practice
              </li>

              <li>
                <span>✓</span>
                Listening & pronunciation practice
              </li>

              <li>
                <span>✓</span>
                Revision between live lessons
              </li>

              <li>
                <span>✓</span>
                Learn any time between classes
              </li>
            </ul>

            <div className="cardCta premiumCta">
              Choose Premium
              <span>→</span>
            </div>
          </Link>

          {/* AI */}
          <Link
            href="/academies"
            className="planCard"
          >
            <div className="planCardTop">
              <div className="planLabel">
                AI SELF-PACED
              </div>

              <div className="planSelectIcon">
                →
              </div>
            </div>

            <h3>
              AI Self-Paced Learning
            </h3>

            <p className="planIntro">
              Independent language learning with
              AI assistance.
            </p>

            <div className="planDivider" />

            <ul>
              <li>
                <span>✓</span>
                Full self-paced Language Academy
              </li>

              <li>
                <span>✓</span>
                Guided interactive lessons
              </li>

              <li>
                <span>✓</span>
                Speaking practice
              </li>

              <li>
                <span>✓</span>
                Listening practice
              </li>

              <li>
                <span>✓</span>
                Pronunciation practice
              </li>

              <li>
                <span>✓</span>
                Progress tracking
              </li>
            </ul>

            <div className="cardCta">
              Choose Self-Paced Learning
              <span>→</span>
            </div>
          </Link>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="finalCta">
        <div className="finalIcon">
          ✦
        </div>

        <div className="finalCopy">
          <p className="finalEyebrow">
            KEEP THE CONNECTION
          </p>

          <h2>
            Give them more than vocabulary.
            Give them a language they can use.
          </h2>

          <p>
            Start with Yoruba, Igbo or Hausa and build the
            confidence to speak, understand and connect.
          </p>
        </div>

        <div className="finalActions">
          <Link
            href="/parent/students"
            className="whiteButton"
          >
            Start Language Learning
            <span>→</span>
          </Link>

          <Link
            href="/academies"
            className="outlineButton"
          >
            See Other Academies
            <span>→</span>
          </Link>
        </div>
      </section>

      <style jsx>{`
        .page {
          min-height: 100vh;
          padding: 30px 20px 90px;

          background:
            radial-gradient(
              circle at 92% 8%,
              rgba(124, 58, 237, 0.12),
              transparent 27%
            ),
            radial-gradient(
              circle at 8% 75%,
              rgba(139, 92, 246, 0.07),
              transparent 30%
            ),
            linear-gradient(
              180deg,
              #ffffff 0%,
              #fbf9ff 48%,
              #f5f0ff 100%
            );

          color: #20122f;
        }

        .hero,
        .languageSection,
        .learningModel,
        .premiumStory,
        .plansSection,
        .finalCta {
          width: min(1240px, 100%);
          margin-left: auto;
          margin-right: auto;
        }

        /* HERO */

        .hero {
          min-height: 500px;

          display: grid;

          grid-template-columns:
            minmax(0, 0.84fr)
            minmax(0, 1.16fr);

          overflow: hidden;

          border-radius: 36px;

          background: #ffffff;

          border:
            1px solid rgba(124, 58, 237, 0.12);

          box-shadow:
            0 30px 90px
            rgba(59, 31, 98, 0.12);
        }

        .heroCopy {
          padding: 48px 42px;

          display: flex;

          flex-direction: column;

          justify-content: center;

          position: relative;

          z-index: 2;
        }

        .pill {
          width: fit-content;

          padding: 8px 12px;

          border-radius: 999px;

          background: #f0e7ff;

          color: #6d28d9;

          font-size: 11px;

          font-weight: 950;

          letter-spacing: 0.08em;

          text-transform: uppercase;
        }

        h1 {
          max-width: 520px;

          margin: 20px 0 0;

          font-size:
            clamp(44px, 4.4vw, 64px);

          line-height: 0.98;

          letter-spacing: -0.05em;

          font-weight: 950;
        }

        h1 span {
          color: #7c3aed;
        }

        .lead {
          max-width: 560px;

          margin: 22px 0 0;

          color: #6f637b;

          font-size: 16px;

          line-height: 1.7;
        }

        .heroActions {
          display: flex;

          gap: 12px;

          flex-wrap: wrap;

          margin-top: 28px;
        }

        .primary,
        .secondary,
        .premiumButton,
        .whiteButton,
        .outlineButton {
          min-height: 50px;

          display: inline-flex;

          align-items: center;

          justify-content: center;

          gap: 10px;

          padding: 0 20px;

          border-radius: 15px;

          font-weight: 950;

          text-decoration: none;

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;
        }

        .primary {
          color: #ffffff;

          background:
            linear-gradient(
              135deg,
              #6d28d9,
              #8b5cf6
            );

          box-shadow:
            0 15px 35px
            rgba(124, 58, 237, 0.24);
        }

        .secondary {
          color: #4d286f;

          background: #ffffff;

          border:
            1px solid rgba(124, 58, 237, 0.18);
        }

        .primary:hover,
        .secondary:hover,
        .premiumButton:hover,
        .whiteButton:hover,
        .outlineButton:hover {
          transform: translateY(-2px);
        }

        .trustRow {
          display: flex;

          flex-wrap: wrap;

          gap: 8px;

          margin-top: 24px;
        }

        .trustRow span {
          display: inline-flex;

          align-items: center;

          gap: 5px;

          padding: 7px 10px;

          border-radius: 999px;

          background: #faf7ff;

          color: #665b70;

          font-size: 11px;

          font-weight: 800;
        }

        .trustRow b {
          color: #7c3aed;
        }

        .heroVisual {
          position: relative;

          min-height: 500px;

          overflow: hidden;

          background: #f5efff;
        }

        .heroImage {
          object-fit: cover;

          object-position: center center;
        }

        .imageShade {
          position: absolute;

          inset: 0;

          background:
            linear-gradient(
              90deg,
              rgba(255,255,255,0.04),
              transparent 25%
            );

          pointer-events: none;
        }

        .imageBadge {
          position: absolute;

          left: 24px;

          bottom: 24px;

          display: flex;

          align-items: center;

          gap: 12px;

          padding: 15px 17px;

          border-radius: 18px;

          background:
            rgba(255, 255, 255, 0.95);

          backdrop-filter: blur(14px);

          box-shadow:
            0 16px 40px
            rgba(26, 13, 42, 0.2);
        }

        .badgeIcon {
          width: 40px;

          height: 40px;

          display: grid;

          place-items: center;

          border-radius: 13px;

          color: #ffffff;

          background:
            linear-gradient(
              135deg,
              #6d28d9,
              #9f67ff
            );

          font-size: 18px;
        }

        .imageBadge small {
          display: block;

          color: #7c3aed;

          font-size: 9px;

          font-weight: 950;

          letter-spacing: 0.07em;
        }

        .imageBadge strong {
          display: block;

          margin-top: 4px;

          font-size: 15px;
        }

        /* SHARED SECTION HEADINGS */

        .languageSection,
        .learningModel,
        .plansSection {
          padding-top: 90px;
        }

        .sectionHeading {
          max-width: 800px;
        }

        .sectionHeading.centred {
          margin-left: auto;

          margin-right: auto;

          text-align: center;
        }

        .eyebrow {
          margin: 0;

          color: #7c3aed;

          font-size: 12px;

          font-weight: 950;

          letter-spacing: 0.07em;

          text-transform: uppercase;
        }

        .sectionHeading h2 {
          margin: 12px 0 0;

          font-size:
            clamp(36px, 4.3vw, 56px);

          line-height: 1.03;

          letter-spacing: -0.045em;

          font-weight: 950;
        }

        .sectionHeading h2 span {
          color: #7c3aed;
        }

        .sectionHeading > p:last-child {
          max-width: 680px;

          margin: 16px auto 0;

          color: #71657b;

          font-size: 16px;

          line-height: 1.7;
        }

        /* LANGUAGE CARDS */

        .languageGrid {
          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 18px;

          margin-top: 34px;
        }

        .languageCard {
          display: block;

          padding: 26px;

          border-radius: 25px;

          background: #ffffff;

          border:
            1px solid rgba(124, 58, 237, 0.12);

          box-shadow:
            0 18px 48px
            rgba(71, 43, 117, 0.07);

          color: inherit;

          text-decoration: none;

          cursor: pointer;

          transition:
            transform 0.22s ease,
            border-color 0.22s ease,
            box-shadow 0.22s ease;
        }

        .languageCard:hover {
          transform: translateY(-5px);

          border-color:
            rgba(124, 58, 237, 0.42);

          box-shadow:
            0 26px 60px
            rgba(94, 48, 170, 0.14);
        }

        .languageTop {
          display: flex;

          align-items: center;

          justify-content: space-between;
        }

        .languageInitial {
          width: 52px;

          height: 52px;

          display: grid;

          place-items: center;

          border-radius: 16px;

          background:
            linear-gradient(
              135deg,
              #ede9fe,
              #f7f2ff
            );

          color: #6d28d9;

          font-size: 20px;

          font-weight: 950;
        }

        .cardArrow {
          width: 36px;

          height: 36px;

          display: grid;

          place-items: center;

          border-radius: 50%;

          background: #faf7ff;

          color: #6d28d9;

          font-weight: 950;

          transition:
            transform 0.2s ease,
            background 0.2s ease;
        }

        .languageCard:hover .cardArrow {
          transform: translateX(3px);

          background: #ede9fe;
        }

        .languageCard h3 {
          margin: 22px 0 0;

          font-size: 24px;

          font-weight: 950;
        }

        .languageCard p {
          margin: 9px 0 0;

          color: #73667d;

          line-height: 1.66;
        }

        .languageAction {
          display: flex;

          align-items: center;

          justify-content: space-between;

          margin-top: 20px;

          padding-top: 16px;

          border-top:
            1px solid rgba(124, 58, 237, 0.1);

          color: #6d28d9;

          font-size: 13px;

          font-weight: 950;
        }

        /* STEPS */

        .steps {
          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 18px;

          margin-top: 34px;
        }

        .steps article {
          padding: 28px;

          border-radius: 25px;

          background: #ffffff;

          border:
            1px solid rgba(124, 58, 237, 0.11);

          box-shadow:
            0 16px 42px
            rgba(71, 43, 117, 0.06);
        }

        .stepTop {
          display: flex;

          align-items: center;

          justify-content: space-between;
        }

        .stepIcon {
          width: 44px;

          height: 44px;

          display: grid;

          place-items: center;

          border-radius: 14px;

          color: #ffffff;

          background:
            linear-gradient(
              135deg,
              #6d28d9,
              #9a65f5
            );

          font-weight: 950;
        }

        .stepTop > span {
          color: #8b5cf6;

          font-size: 10px;

          font-weight: 950;

          letter-spacing: 0.08em;
        }

        .steps h3 {
          margin: 20px 0 0;

          font-size: 23px;

          font-weight: 950;
        }

        .steps p {
          color: #73667d;

          line-height: 1.66;
        }

        /* PREMIUM STORY */

        .premiumStory {
          margin-top: 90px;

          display: grid;

          grid-template-columns:
            minmax(0, 1fr)
            minmax(0, 0.9fr);

          gap: 38px;

          padding: 48px;

          border-radius: 36px;

          color: #ffffff;

          background:
            radial-gradient(
              circle at 85% 10%,
              rgba(180, 148, 255, 0.38),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #2b0d59,
              #4f1da6 58%,
              #7139d5
            );

          box-shadow:
            0 32px 90px
            rgba(76, 29, 149, 0.26);
        }

        .premiumKicker {
          width: fit-content;

          padding: 7px 10px;

          border-radius: 999px;

          background:
            rgba(255,255,255,0.13);

          color: #e7dcff;

          font-size: 10px;

          font-weight: 950;

          letter-spacing: 0.08em;
        }

        .premiumCopy h2 {
          margin: 16px 0 0;

          font-size:
            clamp(38px, 4.6vw, 60px);

          line-height: 1.03;

          letter-spacing: -0.045em;

          font-weight: 950;
        }

        .premiumCopy > p {
          max-width: 600px;

          color: #e7ddf2;

          line-height: 1.7;
        }

        .premiumBenefits {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 9px;

          margin-top: 22px;
        }

        .premiumBenefits span {
          padding: 11px 12px;

          border-radius: 12px;

          background:
            rgba(255, 255, 255, 0.09);

          border:
            1px solid rgba(255,255,255,0.08);

          font-size: 12px;

          font-weight: 800;
        }

        .premiumButton {
          width: fit-content;

          margin-top: 26px;

          color: #52209d;

          background: #ffffff;
        }

        .premiumJourney {
          display: grid;

          align-content: center;

          gap: 6px;
        }

        .journeyCard {
          display: grid;

          grid-template-columns:
            auto 1fr;

          gap: 14px;

          align-items: center;

          padding: 19px;

          border-radius: 18px;

          background:
            rgba(255,255,255,0.09);

          border:
            1px solid rgba(255,255,255,0.11);
        }

        .highlightedJourney {
          background:
            rgba(255,255,255,0.15);

          border-color:
            rgba(255,255,255,0.22);
        }

        .journeyNumber {
          width: 44px;

          height: 44px;

          display: grid;

          place-items: center;

          border-radius: 13px;

          background:
            rgba(255,255,255,0.12);

          color: #ede9fe;

          font-size: 12px;

          font-weight: 950;
        }

        .journeyCard small {
          color: #ddd6fe;

          font-size: 9px;

          font-weight: 950;

          letter-spacing: 0.07em;
        }

        .journeyCard strong {
          display: block;

          margin-top: 4px;

          font-size: 17px;
        }

        .journeyCard p {
          margin: 4px 0 0;

          color: #e9e2f2;

          font-size: 12px;

          line-height: 1.5;
        }

        .journeyConnector {
          text-align: center;

          color: #c4b5fd;

          font-weight: 950;
        }

        /* PRODUCT / PLAN CARDS */

        .planGrid {
          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 22px;

          margin-top: 38px;
        }

        .planCard {
          position: relative;

          min-height: 560px;

          display: flex;

          flex-direction: column;

          padding: 28px;

          border-radius: 28px;

          background:
            linear-gradient(
              180deg,
              #ffffff,
              #fdfcff
            );

          border:
            1px solid rgba(124, 58, 237, 0.14);

          box-shadow:
            0 20px 58px
            rgba(71, 43, 117, 0.08);

          color: #20122f;

          text-decoration: none;

          cursor: pointer;

          transition:
            transform 0.24s ease,
            box-shadow 0.24s ease,
            border-color 0.24s ease;
        }

        .planCard:hover {
          transform: translateY(-7px);

          border-color:
            rgba(124, 58, 237, 0.5);

          box-shadow:
            0 32px 75px
            rgba(90, 45, 160, 0.16);
        }

        .planCardTop {
          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 12px;
        }

        .planLabel {
          width: fit-content;

          padding: 7px 10px;

          border-radius: 999px;

          background: #f0e7ff;

          color: #6d28d9;

          font-size: 10px;

          font-weight: 950;

          letter-spacing: 0.07em;
        }

        .planSelectIcon {
          width: 38px;

          height: 38px;

          display: grid;

          place-items: center;

          border-radius: 50%;

          background: #f7f2ff;

          color: #6d28d9;

          font-size: 17px;

          font-weight: 950;

          transition:
            transform 0.2s ease,
            background 0.2s ease;
        }

        .planCard:hover .planSelectIcon {
          transform: translateX(4px);

          background: #ede9fe;
        }

        .planCard h3 {
          margin: 24px 0 0;

          font-size: 25px;

          line-height: 1.15;

          font-weight: 950;
        }

        .planIntro {
          margin: 8px 0 0;

          color: #73667d;

          line-height: 1.65;
        }

        .planDivider {
          height: 1px;

          margin: 22px 0 0;

          background:
            rgba(124, 58, 237, 0.1);
        }

        .planCard ul {
          display: grid;

          gap: 11px;

          margin: 24px 0 30px;

          padding: 0;

          list-style: none;
        }

        .planCard li {
          display: grid;

          grid-template-columns:
            auto 1fr;

          gap: 9px;

          align-items: start;

          color: #61546b;

          line-height: 1.5;
        }

        .planCard li span {
          width: 20px;

          height: 20px;

          display: grid;

          place-items: center;

          border-radius: 50%;

          background: #ede9fe;

          color: #6d28d9;

          font-size: 11px;

          font-weight: 950;
        }

        .cardCta {
          min-height: 52px;

          margin-top: auto;

          display: flex;

          align-items: center;

          justify-content: space-between;

          padding: 0 17px;

          border-radius: 15px;

          color: #5b21b6;

          background: #f3eaff;

          font-weight: 950;

          transition:
            background 0.2s ease,
            color 0.2s ease;
        }

        .planCard:hover .cardCta {
          background: #ede2ff;
        }

        /* PREMIUM PRODUCT CARD */

        .premiumPlan {
          transform: translateY(-10px);

          border: 2px solid #7c3aed;

          background:
            radial-gradient(
              circle at top right,
              rgba(124,58,237,0.11),
              transparent 30%
            ),
            linear-gradient(
              180deg,
              #ffffff,
              #faf6ff
            );

          box-shadow:
            0 30px 85px
            rgba(124, 58, 237, 0.2);
        }

        .premiumPlan:hover {
          transform: translateY(-17px);

          box-shadow:
            0 38px 95px
            rgba(124, 58, 237, 0.27);
        }

        .recommended {
          position: absolute;

          top: -14px;

          left: 50%;

          transform: translateX(-50%);

          padding: 7px 14px;

          border-radius: 999px;

          color: #ffffff;

          background:
            linear-gradient(
              135deg,
              #6d28d9,
              #8b5cf6
            );

          box-shadow:
            0 8px 22px
            rgba(124,58,237,0.3);

          font-size: 9px;

          font-weight: 950;

          letter-spacing: 0.08em;
        }

        .premiumLabel {
          color: #ffffff;

          background:
            linear-gradient(
              135deg,
              #6d28d9,
              #8b5cf6
            );
        }

        .premiumArrow {
          color: #ffffff;

          background:
            linear-gradient(
              135deg,
              #6d28d9,
              #8b5cf6
            );
        }

        .premiumValue {
          display: flex;

          flex-direction: column;

          gap: 4px;

          margin-top: 20px;

          padding: 14px;

          border-radius: 15px;

          background:
            linear-gradient(
              135deg,
              #f0e7ff,
              #faf7ff
            );

          border:
            1px solid rgba(124,58,237,0.13);
        }

        .premiumValue strong {
          color: #5521a5;

          font-size: 14px;
        }

        .premiumValue span {
          color: #786a82;

          font-size: 11px;

          font-weight: 700;
        }

        .premiumCta {
          color: #ffffff;

          background:
            linear-gradient(
              135deg,
              #6d28d9,
              #8b5cf6
            );

          box-shadow:
            0 14px 30px
            rgba(124,58,237,0.22);
        }

        .premiumPlan:hover .premiumCta {
          background:
            linear-gradient(
              135deg,
              #5b21b6,
              #7c3aed
            );
        }

        /* FINAL CTA */

        .finalCta {
          margin-top: 94px;

          display: grid;

          grid-template-columns:
            auto minmax(0, 1fr) auto;

          gap: 22px;

          align-items: center;

          padding: 42px;

          border-radius: 30px;

          color: #ffffff;

          background:
            radial-gradient(
              circle at 80% 0%,
              rgba(139,92,246,0.35),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #28103d,
              #4c1d95
            );

          box-shadow:
            0 26px 70px
            rgba(49, 17, 79, 0.22);
        }

        .finalIcon {
          width: 58px;

          height: 58px;

          display: grid;

          place-items: center;

          border-radius: 18px;

          background:
            rgba(255,255,255,0.11);

          font-size: 24px;
        }

        .finalEyebrow {
          margin: 0;

          color: #ddd6fe;

          font-size: 10px;

          font-weight: 950;

          letter-spacing: 0.08em;
        }

        .finalCopy h2 {
          margin: 9px 0 0;

          max-width: 700px;

          font-size:
            clamp(30px, 3.3vw, 46px);

          line-height: 1.04;

          letter-spacing: -0.04em;

          font-weight: 950;
        }

        .finalCopy > p:last-child {
          margin: 10px 0 0;

          color: #ded3e8;

          line-height: 1.6;
        }

        .finalActions {
          display: grid;

          gap: 9px;

          min-width: 220px;
        }

        .whiteButton {
          color: #4c1d95;

          background: #ffffff;
        }

        .outlineButton {
          color: #ffffff;

          border:
            1px solid rgba(255,255,255,0.28);

          background:
            rgba(255,255,255,0.05);
        }

        /* TABLET */

        @media (max-width: 900px) {
          .hero,
          .premiumStory,
          .finalCta {
            grid-template-columns: 1fr;
          }

          .heroVisual {
            min-height: 420px;
          }

          .languageGrid,
          .steps,
          .planGrid {
            grid-template-columns: 1fr;
          }

          .premiumPlan,
          .premiumPlan:hover {
            transform: none;
          }

          .planCard {
            min-height: auto;
          }

          .finalActions {
            width: 100%;

            min-width: 0;
          }
        }

        /* MOBILE */

        @media (max-width: 640px) {
          .page {
            padding: 16px 12px 68px;
          }

          .hero {
            min-height: auto;

            border-radius: 26px;
          }

          .heroCopy {
            padding: 34px 22px;
          }

          h1 {
            font-size:
              clamp(39px, 11vw, 54px);
          }

          .lead {
            font-size: 15px;
          }

          .heroVisual {
            min-height: 300px;
          }

          .heroActions {
            display: grid;
          }

          .primary,
          .secondary,
          .premiumButton,
          .whiteButton,
          .outlineButton {
            width: 100%;
          }

          .imageBadge {
            left: 14px;

            right: 14px;

            bottom: 14px;
          }

          .languageSection,
          .learningModel,
          .plansSection {
            padding-top: 70px;
          }

          .premiumStory,
          .finalCta {
            padding: 26px 20px;

            border-radius: 26px;
          }

          .premiumBenefits {
            grid-template-columns: 1fr;
          }

          .premiumButton {
            width: 100%;
          }

          .planCard {
            padding: 24px;

            border-radius: 24px;
          }
        }
      `}</style>
    </main>
  )
}