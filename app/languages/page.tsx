'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import {
  currencyTable,
  defaultCurrency,
  getCurrencyForCountryCode,
  convertGbpPrice,
  type CurrencyDisplay,
} from '../lib/pricing/currency'

const languages = [
  {
    name: 'Yoruba',
    text:
      'Build everyday speaking confidence, communicate with family and develop a deeper connection with Yoruba language and culture.',
  },
  {
    name: 'Igbo',
    text:
      'Develop practical vocabulary, listening skills and conversational confidence through structured language learning.',
  },
  {
    name: 'Hausa',
    text:
      'Learn useful Hausa for real conversations through guided teaching, speaking practice and cultural context.',
  },
]

export default function LanguagesPage() {
  const [currency, setCurrency] =
  useState<CurrencyDisplay>(
    defaultCurrency,
  )

const [pricingCountry, setPricingCountry] =
  useState('UK')

useEffect(() => {
  let cancelled = false

  async function detectCountry() {
    try {
      const response =
        await fetch(
          '/api/location/country',
          {
            cache: 'no-store',
          },
        )

      if (!response.ok) {
        return
      }

      const data =
        (await response.json()) as {
          countryCode?:
            | string
            | null
        }

      const resolved =
        getCurrencyForCountryCode(
          data.countryCode,
        )

      if (cancelled) {
        return
      }

      setCurrency(resolved)

      const matchedCountry =
        Object.entries(
          currencyTable,
        ).find(
          ([, item]) =>
            item.code ===
            resolved.code,
        )

      if (matchedCountry) {
        setPricingCountry(
          matchedCountry[0],
        )
      }
    } catch (error) {
      console.warn(
        'Unable to detect pricing country:',
        error,
      )
    }
  }

  void detectCountry()

  return () => {
    cancelled = true
  }
}, [])

const localPrices =
  useMemo(
    () => ({
      aiMonthly:
        convertGbpPrice(
          19.99,
          currency,
          true,
        ),

      liveMonthly:
        convertGbpPrice(
          10,
          currency,
          false,
        ),

      liveThreeMonth:
        convertGbpPrice(
          9,
          currency,
          false,
        ),

      premiumMonthlyOne:
        convertGbpPrice(
          49.99,
          currency,
          true,
        ),

      premiumMonthlyTwo:
        convertGbpPrice(
          89.99,
          currency,
          true,
        ),

      premiumThreeMonthOne:
        convertGbpPrice(
          134.99,
          currency,
          true,
        ),

      premiumThreeMonthTwo:
        convertGbpPrice(
          239.99,
          currency,
          true,
        ),
    }),
    [currency],
  )

function changePricingCountry(
  countryKey: string,
) {
  const nextCurrency =
    currencyTable[countryKey]

  if (!nextCurrency) {
    return
  }

  setPricingCountry(
    countryKey,
  )

  setCurrency(
    nextCurrency,
  )
}
  return (
    <main className="page">
      <section className="hero">
        <div className="heroCopy">
          <div className="pill">
            Fountain Prep Languages
          </div>

          <h1>
            Learn the Language.
            <span> Stay connected.</span>
          </h1>

          <p className="lead">
            Online Yoruba, Igbo and Hausa learning through
            private 1-to-1 lessons, AI-assisted practice and
            self-paced learning.
          </p>

          <p className="heroPromise">
            Build real conversation skills — not just vocabulary.
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
              Private 1-to-1 lessons
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
            sizes="(max-width: 900px) 100vw, 58vw"
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
                Learn live. Practise between lessons.
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section className="languageSection">
        <div className="sectionHeading centred">
          <p className="eyebrow">
            Choose a language
          </p>

          <h2>
            Learn a language you can actually use.
          </h2>

          <p>
            Build the confidence to understand, respond and
            hold real conversations in Yoruba, Igbo or Hausa.
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
                <h3>
                  {language.name}
                </h3>

                <div className="cardArrow">
                  →
                </div>
              </div>

              <p>
                {language.text}
              </p>

              <div className="languageAction">
                Start learning {language.name}
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

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

              <span>
                LIVE
              </span>
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

              <span>
                PRACTISE
              </span>
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

              <span>
                PROGRESS
              </span>
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

      <section className="premiumStory">
        <div className="premiumCopy">
          <div className="premiumKicker">
            PREMIUM BUNDLE
          </div>

          <h2>
            The live lesson is only the beginning.
          </h2>

          <p>
            Premium combines private 1-to-1 teaching with
            AI-assisted, self-paced learning between lessons.
            The learner can practise, revise and reinforce what
            was taught before the next live class.
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
              ✓ Listening practice
            </span>

            <span>
              ✓ Pronunciation reinforcement
            </span>

            <span>
              ✓ Revision between live lessons
            </span>

            <span>
              ✓ Progress tracking
            </span>

            <span>
              ✓ Learn at any convenient time
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
              <small>
                LIVE LESSON
              </small>

              <strong>
                Learn 1-to-1
              </strong>

              <p>
                Learn something new with a dedicated tutor.
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
              <small>
                BETWEEN LESSONS
              </small>

              <strong>
                AI-Assisted Practice
              </strong>

              <p>
                Speak, listen, revise and reinforce learning.
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
              <small>
                NEXT LIVE LESSON
              </small>

              <strong>
                Return Stronger
              </strong>

              <p>
                Continue from a stronger foundation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="plansSection">
        <div className="sectionHeading centred">
          <p className="eyebrow">
            Ways to learn
          </p>

          <h2>
            Choose how you want to learn.
          </h2>

          <p>
            Learn with a private tutor, learn independently,
            or combine both for continuous practice between
            lessons.
          </p>
        </div>

        <div className="planGrid">
          <Link
            href="/parent/students"
            className="planCard livePlan"
          >
            <div className="planCardHeader">
              <div>
                <div className="planLabel">
                  1-TO-1 LIVE
                </div>

                <h3>
                  1-to-1 Live Lessons
                </h3>

                <p>
                  Learn directly with a dedicated private tutor.
                </p>
              </div>

              <div className="planArrow">
                →
              </div>
            </div>

            <div className="planFeatureBlock">
              <span className="featureTitle">
                What&apos;s included
              </span>

              <div className="featureList">
                <div>
                  <span className="featureCheck">✓</span>
                  Private 1-to-1 lessons
                </div>

                <div>
                  <span className="featureCheck">✓</span>
                  1 or 2 lessons per week
                </div>

                <div>
                  <span className="featureCheck">✓</span>
                  Monthly or 3-month plans
                </div>

                <div>
                  <span className="featureCheck">✓</span>
                  Structured curriculum
                </div>

                <div>
                  <span className="featureCheck">✓</span>
                  Progress updates
                </div>
              </div>
            </div>

            <div className="planFooter">
              <span>
                Choose Live Lessons
              </span>

              <strong>→</strong>
            </div>
          </Link>

          <Link
            href="/parent/students"
            className="planCard premiumPlan"
          >
            <div className="recommended">
              MOST COMPLETE
            </div>

            <div className="premiumGlow" />

            <div className="planCardHeader">
              <div>
                <div className="planLabel premiumLabel">
                  PREMIUM BUNDLE
                </div>

                <h3>
                  1-to-1 Live + AI-Assisted
                  Self-Paced Learning
                </h3>

                <p>
                  Live teaching plus structured practice
                  throughout the week.
                </p>
              </div>

              <div className="planArrow premiumArrow">
                →
              </div>
            </div>

            <div className="premiumValue">
              <span className="premiumValueEyebrow">
                ONE CONNECTED EXPERIENCE
              </span>

              <strong>
                Learn live. Practise between lessons.
              </strong>

              <p>
                Your tutor teaches. AI-assisted practice helps
                reinforce what was learned before the next class.
              </p>
            </div>

            <div className="planFeatureBlock premiumFeatureBlock">
              <span className="featureTitle">
                Premium includes
              </span>

              <div className="featureList">
                <div>
                  <span className="featureCheck">✓</span>
                  Everything in 1-to-1 Live
                </div>

                <div>
                  <span className="featureCheck">✓</span>
                  Full self-paced Language Academy
                </div>

                <div>
                  <span className="featureCheck">✓</span>
                  AI-assisted speaking practice
                </div>

                <div>
                  <span className="featureCheck">✓</span>
                  Listening & pronunciation practice
                </div>

                <div>
                  <span className="featureCheck">✓</span>
                  Revision between live lessons
                </div>

                <div>
                  <span className="featureCheck">✓</span>
                  Learn any time between classes
                </div>
              </div>
            </div>

            <div className="planFooter premiumFooter">
              <span>
                Choose Premium
              </span>

              <strong>→</strong>
            </div>
          </Link>

          <Link
            href="/academies"
            className="planCard aiPlan"
          >
            <div className="planCardHeader">
              <div>
                <div className="planLabel">
                  AI SELF-PACED
                </div>

                <h3>
                  AI Self-Paced Learning
                </h3>

                <p>
                  Learn independently, whenever it suits you.
                </p>
              </div>

              <div className="planArrow">
                →
              </div>
            </div>

            <div className="planFeatureBlock">
              <span className="featureTitle">
                What&apos;s included
              </span>

              <div className="featureList">
                <div>
                  <span className="featureCheck">✓</span>
                  Full self-paced Language Academy
                </div>

                <div>
                  <span className="featureCheck">✓</span>
                  Guided interactive lessons
                </div>

                <div>
                  <span className="featureCheck">✓</span>
                  Speaking practice
                </div>

                <div>
                  <span className="featureCheck">✓</span>
                  Listening practice
                </div>

                <div>
                  <span className="featureCheck">✓</span>
                  Pronunciation practice
                </div>

                <div>
                  <span className="featureCheck">✓</span>
                  Progress tracking
                </div>
              </div>
            </div>

            <div className="planFooter">
              <span>
                Choose Self-Paced Learning
              </span>

              <strong>→</strong>
            </div>
          </Link>
        </div>
      </section>

      <section
        className="pricingSnapshot"
        id="language-pricing"
      >
        <div className="pricingHeading">
          <div className="pricingCountryBar">
  <div>
    <span className="countryLabel">
      Pricing for
    </span>

    <strong>
      {currency.country}
    </strong>
  </div>

  <select
    value={pricingCountry}
    onChange={(event) =>
      changePricingCountry(
        event.target.value,
      )
    }
    aria-label="Choose pricing country"
  >
    <option value="UK">
      United Kingdom — GBP
    </option>

    <option value="USA">
      United States — USD
    </option>

    <option value="Canada">
      Canada — CAD
    </option>

    <option value="Australia">
      Australia — AUD
    </option>
  </select>
</div>
          <div>
            <p className="eyebrow">
              Language plans at a glance
            </p>

            <h2>
              Clear options.
              <span> Choose what fits.</span>
            </h2>

            <p>
              Start independently, learn live with a tutor,
              or combine both with Premium.
            </p>
          </div>

          <Link
            href="/parent/students"
            className="pricingTopLink"
          >
            Start choosing
            <span>→</span>
          </Link>
        </div>

        <div className="pricingGrid">
  <article className="pricingCard">
    <div className="pricingCardTop">
      <div>
        <div className="pricePill">
          1-TO-1 LIVE
        </div>

        <h3>
          Private tutor lessons
        </h3>
      </div>

      <span className="pricingIcon">
        1:1
      </span>
    </div>

    <div className="priceDisplay">
      <span className="priceFrom">
        From
      </span>

      <strong>
        {localPrices.liveThreeMonth}
      </strong>

      <span>
        / class
      </span>
    </div>

    <p className="priceDescription">
      Private structured language lessons with
      a dedicated Fountain Prep tutor.
    </p>

    <div className="miniPriceRows">
      <div>
        <span>
          Monthly plan
        </span>

        <strong>
          {localPrices.liveMonthly}/class
        </strong>
      </div>

      <div>
        <span>
          3-month plan
        </span>

        <strong>
          {localPrices.liveThreeMonth}/class
        </strong>
      </div>
    </div>

    <div className="miniBenefits">
      <span>
        ✓ 1 or 2 classes/week
      </span>

      <span>
        ✓ Private tutor
      </span>

      <span>
        ✓ Structured curriculum
      </span>
    </div>

    <Link
      href="/parent/students"
      className="priceButton softPriceButton"
    >
      View Live Plans
      <span>→</span>
    </Link>
  </article>

  <article className="pricingCard">
    <div className="pricingCardTop">
      <div>
        <div className="pricePill">
          AI SELF-PACED
        </div>

        <h3>
          Learn independently
        </h3>
      </div>

      <span className="pricingIcon">
        ✦
      </span>
    </div>

    <div className="priceDisplay">
      <span className="priceFrom">
        Full access
      </span>

      <strong>
        {localPrices.aiMonthly}
      </strong>

      <span>
        / month
      </span>
    </div>

    <p className="priceDescription">
      Learn at your own pace with guided AI-assisted
      speaking, listening and pronunciation practice.
    </p>

    <div className="miniBenefits">
      <span>
        ✓ Self-paced lessons
      </span>

      <span>
        ✓ Speaking & listening
      </span>

      <span>
        ✓ Pronunciation practice
      </span>

      <span>
        ✓ Progress tracking
      </span>
    </div>

    <Link
      href="/academies"
      className="priceButton softPriceButton"
    >
      Explore Self-Paced
      <span>→</span>
    </Link>
  </article>

  <article className="pricingCard premiumPricingCard">
    <div className="premiumPricingBadge">
      RECOMMENDED
    </div>

    <div className="pricingCardTop">
      <div>
        <div className="pricePill premiumPricePill">
          PREMIUM BUNDLE
        </div>

        <h3>
          Live + Full AI Academy
        </h3>
      </div>

      <span className="pricingIcon premiumPricingIcon">
        ✦
      </span>
    </div>

    <div className="priceDisplay premiumPriceDisplay">
      <span className="priceFrom">
        From
      </span>

      <strong>
        {localPrices.premiumMonthlyOne}
      </strong>

      <span>
        / month
      </span>
    </div>

    <p className="priceDescription">
      Combine private live teaching with full
      AI-assisted self-paced learning between lessons.
    </p>

    <div className="premiumPriceTable">
      <div className="priceTableHeader">
        <span>
          Live pace
        </span>

        <span>
          Monthly
        </span>

        <span>
          3 months
        </span>
      </div>

      <div className="priceTableRow">
        <strong>
          1 live lesson / week
        </strong>

        <span>
          {localPrices.premiumMonthlyOne}
        </span>

        <span>
          {localPrices.premiumThreeMonthOne}
        </span>
      </div>

      <div className="priceTableRow">
        <strong>
          2 live lessons / week
        </strong>

        <span>
          {localPrices.premiumMonthlyTwo}
        </span>

        <span>
          {localPrices.premiumThreeMonthTwo}
        </span>
      </div>
    </div>

    <div className="miniBenefits premiumMiniBenefits">
      <span>
        ✓ Live tutor included
      </span>

      <span>
        ✓ Full AI Academy
      </span>

      <span>
        ✓ Practise between lessons
      </span>
    </div>

    <Link
      href="/parent/students"
      className="priceButton premiumPriceButton"
    >
      Choose Premium
      <span>→</span>
    </Link>
  </article>
</div>

        <div className="pricingNote">
          <div className="pricingNoteIcon">
            £
          </div>

          <div>
            <strong>
              International family?
            </strong>

            <p>
  Prices are displayed in your selected local currency.
  You can change the pricing country above, and your
  final booking total will be confirmed before payment.
</p>
          </div>
        </div>
      </section>

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
          padding: 28px 20px 90px;

          background:
            radial-gradient(
              circle at 92% 8%,
              rgba(124, 58, 237, 0.12),
              transparent 27%
            ),
            radial-gradient(
              circle at 8% 75%,
              rgba(139, 92, 246, 0.06),
              transparent 30%
            ),
            linear-gradient(
              180deg,
              #ffffff 0%,
              #fbf9ff 50%,
              #f5f0ff 100%
            );

          color: #20122f;
        }

        .hero,
        .languageSection,
        .learningModel,
        .premiumStory,
        .plansSection,
        .pricingSnapshot,
        .finalCta {
          width: min(1240px, 100%);
          margin-left: auto;
          margin-right: auto;
        }

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
          max-width: 510px;
          margin: 20px 0 0;
          font-size:
            clamp(46px, 4.5vw, 66px);
          line-height: 0.98;
          letter-spacing: -0.05em;
          font-weight: 950;
        }

        h1 span {
          color: #7c3aed;
        }

        .lead {
          max-width: 550px;
          margin: 22px 0 0;
          color: #6f637b;
          font-size: 17px;
          line-height: 1.7;
        }

        .heroPromise {
          margin: 12px 0 0;
          color: #4f3f5d;
          font-size: 14px;
          font-weight: 850;
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
              rgba(255,255,255,0.05),
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

        .languageSection,
        .learningModel,
        .plansSection,
        .pricingSnapshot {
          padding-top: 88px;
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

        .sectionHeading h2,
        .pricingHeading h2 {
          margin: 12px 0 0;
          font-size:
            clamp(36px, 4.2vw, 56px);
          line-height: 1.03;
          letter-spacing: -0.045em;
          font-weight: 950;
        }

        .sectionHeading h2 span,
        .pricingHeading h2 span {
          color: #7c3aed;
        }

        .sectionHeading > p:last-child {
          max-width: 680px;
          margin: 16px auto 0;
          color: #71657b;
          font-size: 16px;
          line-height: 1.7;
        }

        .languageGrid {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 18px;
          margin-top: 34px;
        }

        .languageCard {
          display: block;
          padding: 27px;
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
          gap: 16px;
        }

        .languageTop h3 {
          margin: 0;
          font-size: 27px;
          font-weight: 950;
        }

        .cardArrow {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border-radius: 50%;
          background: #f8f3ff;
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

        .languageCard p {
          margin: 15px 0 0;
          color: #73667d;
          line-height: 1.66;
        }

        .languageAction {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 21px;
          padding-top: 17px;
          border-top:
            1px solid rgba(124, 58, 237, 0.1);
          color: #6d28d9;
          font-size: 13px;
          font-weight: 950;
        }

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

        .planGrid {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 24px;
          margin-top: 42px;
          align-items: stretch;
        }

        .planCard {
          position: relative;
          min-height: 590px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          padding: 30px;
          border-radius: 30px;
          background:
            linear-gradient(
              180deg,
              #ffffff 0%,
              #fcfaff 100%
            );
          border:
            1px solid rgba(124, 58, 237, 0.13);
          box-shadow:
            0 20px 55px
            rgba(56, 31, 92, 0.08);
          color: #20122f;
          text-decoration: none;
          transition:
            transform 0.24s ease,
            box-shadow 0.24s ease,
            border-color 0.24s ease;
        }

        .planCard:hover {
          transform: translateY(-8px);
          border-color:
            rgba(124, 58, 237, 0.38);
          box-shadow:
            0 34px 85px
            rgba(74, 37, 128, 0.14);
        }

        .planCardHeader {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr) auto;
          gap: 18px;
          align-items: start;
        }

        .planLabel {
          width: fit-content;
          padding: 7px 11px;
          border-radius: 999px;
          background: #f0e7ff;
          color: #6d28d9;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.07em;
        }

        .planCard h3 {
          margin: 22px 0 0;
          font-size: 27px;
          line-height: 1.15;
          font-weight: 950;
          letter-spacing: -0.025em;
        }

        .planCardHeader p {
          margin: 10px 0 0;
          color: #73667d;
          font-size: 15px;
          line-height: 1.6;
        }

        .planArrow {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border-radius: 50%;
          background: #f6f0ff;
          color: #6d28d9;
          font-size: 18px;
          font-weight: 950;
          transition:
            transform 0.2s ease,
            background 0.2s ease;
        }

        .planCard:hover .planArrow {
          transform: translateX(4px);
          background: #ede4ff;
        }

        .planFeatureBlock {
          margin-top: 28px;
          padding: 21px;
          border-radius: 21px;
          background: #faf7ff;
          border:
            1px solid rgba(124, 58, 237, 0.08);
        }

        .featureTitle {
          display: block;
          margin-bottom: 16px;
          color: #7b6f85;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .featureList {
          display: grid;
          gap: 13px;
        }

        .featureList > div {
          display: grid;
          grid-template-columns:
            22px 1fr;
          gap: 10px;
          align-items: start;
          color: #554a5f;
          font-size: 14px;
          line-height: 1.45;
        }

        .featureCheck {
          width: 22px;
          height: 22px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #ede5ff;
          color: #6d28d9;
          font-size: 11px;
          font-weight: 950;
        }

        .planFooter {
          min-height: 58px;
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 0 19px;
          border-radius: 17px;
          background: #f1e8ff;
          color: #5b21b6;
          font-size: 15px;
          font-weight: 950;
        }

        .planFooter strong {
          font-size: 18px;
        }

        .premiumPlan {
          z-index: 2;
          transform: translateY(-14px);
          border: 2px solid #7c3aed;
          background:
            radial-gradient(
              circle at 80% 5%,
              rgba(139, 92, 246, 0.15),
              transparent 30%
            ),
            linear-gradient(
              180deg,
              #ffffff 0%,
              #faf6ff 100%
            );
          box-shadow:
            0 34px 90px
            rgba(124, 58, 237, 0.2);
        }

        .premiumPlan:hover {
          transform: translateY(-20px);
          box-shadow:
            0 42px 105px
            rgba(124, 58, 237, 0.28);
        }

        .recommended {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          padding: 8px 16px;
          border-radius:
            0 0 14px 14px;
          background:
            linear-gradient(
              135deg,
              #6d28d9,
              #8b5cf6
            );
          color: #ffffff;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.08em;
          box-shadow:
            0 9px 24px
            rgba(124, 58, 237, 0.24);
        }

        .premiumGlow {
          position: absolute;
          width: 180px;
          height: 180px;
          top: -70px;
          right: -60px;
          border-radius: 50%;
          background:
            rgba(139, 92, 246, 0.1);
          filter: blur(15px);
          pointer-events: none;
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
          box-shadow:
            0 10px 25px
            rgba(124, 58, 237, 0.22);
        }

        .premiumValue {
          position: relative;
          z-index: 1;
          margin-top: 26px;
          padding: 19px;
          border-radius: 20px;
          background:
            linear-gradient(
              135deg,
              #efe5ff,
              #faf7ff
            );
          border:
            1px solid rgba(124, 58, 237, 0.15);
        }

        .premiumValueEyebrow {
          display: block;
          color: #7c3aed;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.08em;
        }

        .premiumValue strong {
          display: block;
          margin-top: 7px;
          color: #4f1d96;
          font-size: 16px;
          line-height: 1.35;
        }

        .premiumValue p {
          margin: 7px 0 0;
          color: #71627d;
          font-size: 12px;
          line-height: 1.55;
        }

        .premiumFeatureBlock {
          background:
            rgba(255,255,255,0.78);
        }

        .premiumFooter {
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

        /* PRICING SNAPSHOT */

        .pricingSnapshot {
          padding-top: 96px;
        }

        .pricingHeading {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr) auto;
          gap: 30px;
          align-items: end;
        }

        .pricingHeading > div {
          max-width: 760px;
        }

        .pricingHeading > div > p:last-child {
          max-width: 620px;
          margin: 16px 0 0;
          color: #71657b;
          font-size: 16px;
          line-height: 1.65;
        }

        .pricingTopLink {
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 0 18px;
          border-radius: 15px;
          background: #f1e8ff;
          color: #5b21b6;
          font-weight: 950;
          text-decoration: none;
        }

        .pricingGrid {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 22px;
          margin-top: 36px;
          align-items: stretch;
        }

        .pricingCard {
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 29px;
          border-radius: 30px;
          background:
            linear-gradient(
              180deg,
              #ffffff,
              #fdfcff
            );
          border:
            1px solid rgba(124, 58, 237, 0.12);
          box-shadow:
            0 20px 55px
            rgba(60, 31, 100, 0.08);
        }

        .pricingCardTop {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          align-items: start;
        }

        .pricePill {
          width: fit-content;
          padding: 7px 10px;
          border-radius: 999px;
          background: #f0e7ff;
          color: #6d28d9;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.08em;
        }

        .pricingCard h3 {
          margin: 16px 0 0;
          font-size: 24px;
          line-height: 1.15;
          font-weight: 950;
        }

        .pricingIcon {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border-radius: 14px;
          background: #f7f2ff;
          color: #6d28d9;
          font-size: 13px;
          font-weight: 950;
        }

        .priceDisplay {
          display: flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 28px;
        }

        .priceDisplay strong {
          color: #251238;
          font-size:
            clamp(40px, 4vw, 52px);
          letter-spacing: -0.05em;
          line-height: 1;
        }

        .priceDisplay > span:last-child {
          color: #7d7086;
          font-size: 13px;
          font-weight: 800;
        }

        .priceFrom {
          width: 100%;
          color: #8a7d94;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .priceDescription {
          margin: 18px 0 0;
          color: #706279;
          line-height: 1.62;
          font-size: 14px;
        }

        .pricingCountryBar {
  margin-top: 24px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  padding: 15px 17px;

  border-radius: 18px;

  background:
    rgba(255, 255, 255, 0.82);

  border:
    1px solid
      rgba(124, 58, 237, 0.11);

  box-shadow:
    0 12px 32px
      rgba(66, 35, 105, 0.05);
}

.pricingCountryBar > div {
  display: grid;
  gap: 3px;
}

.countryLabel {
  color: #8a7c94;

  font-size: 10px;
  font-weight: 950;

  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.pricingCountryBar strong {
  color: #402552;

  font-size: 14px;
}

.pricingCountryBar select {
  min-height: 44px;

  padding: 0 38px 0 14px;

  border:
    1px solid
      rgba(124, 58, 237, 0.16);

  border-radius: 13px;

  background: #ffffff;

  color: #4f286e;

  font-weight: 850;

  cursor: pointer;
}
        
        .miniBenefits {
          display: grid;
          gap: 9px;
          margin: 22px 0 26px;
          padding-top: 19px;
          border-top:
            1px solid rgba(124,58,237,0.09);
        }

        .miniBenefits span {
          color: #594c63;
          font-size: 13px;
          font-weight: 800;
        }

        .miniPriceRows {
          display: grid;
          gap: 9px;
          margin-top: 21px;
          padding: 16px;
          border-radius: 17px;
          background: #faf7ff;
        }

        .miniPriceRows div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          color: #71657b;
          font-size: 13px;
        }

        .miniPriceRows strong {
          color: #4f1d96;
        }

        .priceButton {
          min-height: 54px;
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 0 18px;
          border-radius: 16px;
          font-weight: 950;
          text-decoration: none;
        }

        .softPriceButton {
          color: #5b21b6;
          background: #f1e8ff;
        }

        .premiumPricingCard {
          z-index: 2;
          transform: translateY(-10px);
          border: 2px solid #7c3aed;
          background:
            radial-gradient(
              circle at 88% 4%,
              rgba(139, 92, 246, 0.16),
              transparent 29%
            ),
            linear-gradient(
              180deg,
              #ffffff,
              #faf6ff
            );
          box-shadow:
            0 32px 82px
            rgba(124, 58, 237, 0.19);
        }

        .premiumPricingBadge {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          padding: 7px 14px;
          border-radius:
            0 0 13px 13px;
          background:
            linear-gradient(
              135deg,
              #6d28d9,
              #8b5cf6
            );
          color: #ffffff;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 0.08em;
        }

        .premiumPricePill {
          color: #ffffff;
          background:
            linear-gradient(
              135deg,
              #6d28d9,
              #8b5cf6
            );
        }

        .premiumPricingIcon {
          color: #ffffff;
          background:
            linear-gradient(
              135deg,
              #6d28d9,
              #8b5cf6
            );
        }

        .premiumPriceDisplay strong {
          color: #5b21b6;
        }

        .premiumPriceTable {
          margin-top: 21px;
          overflow: hidden;
          border-radius: 18px;
          border:
            1px solid rgba(124,58,237,0.12);
          background: rgba(255,255,255,0.82);
        }

        .priceTableHeader,
        .priceTableRow {
          display: grid;
          grid-template-columns:
            1.25fr 0.75fr 0.75fr;
          gap: 10px;
          align-items: center;
        }

        .priceTableHeader {
          padding: 10px 13px;
          background: #f1e8ff;
          color: #7a6790;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .priceTableRow {
          padding: 13px;
          border-top:
            1px solid rgba(124,58,237,0.08);
          color: #62546d;
          font-size: 12px;
        }

        .priceTableRow strong {
          color: #3f2753;
          font-size: 12px;
        }

        .priceTableRow span {
          color: #5b21b6;
          font-weight: 950;
        }

        .premiumMiniBenefits {
          margin-top: 18px;
        }

        .premiumPriceButton {
          color: #ffffff;
          background:
            linear-gradient(
              135deg,
              #6d28d9,
              #8b5cf6
            );
          box-shadow:
            0 14px 32px
            rgba(124,58,237,0.23);
        }

        .pricingNote {
          margin-top: 22px;
          display: flex;
          gap: 14px;
          align-items: center;
          padding: 18px 20px;
          border-radius: 20px;
          background:
            rgba(255,255,255,0.75);
          border:
            1px solid rgba(124,58,237,0.1);
        }

        .pricingNoteIcon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border-radius: 13px;
          background: #efe6ff;
          color: #6d28d9;
          font-weight: 950;
        }

        .pricingNote strong {
          color: #3c254f;
        }

        .pricingNote p {
          margin: 3px 0 0;
          color: #796d82;
          font-size: 12px;
          line-height: 1.5;
        }

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
          .planGrid,
          .pricingGrid {
            grid-template-columns: 1fr;
          }

          .premiumPlan,
          .premiumPlan:hover,
          .premiumPricingCard {
            transform: none;
          }

          .planCard {
            min-height: auto;
          }

          .pricingHeading {
            grid-template-columns: 1fr;
            align-items: start;
          }

          .pricingTopLink {
            width: fit-content;
          }

          .finalActions {
            width: 100%;
            min-width: 0;
          }
        }

        @media (max-width: 640px) {
          .page {
            padding: 16px 12px 68px;
          }

          .pricingCountryBar {
  align-items: stretch;
  flex-direction: column;
}

.pricingCountryBar select {
  width: 100%;
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

          .heroPromise {
            font-size: 13px;
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
          .plansSection,
          .pricingSnapshot {
            padding-top: 70px;
          }

          .sectionHeading h2,
          .pricingHeading h2 {
            font-size:
              clamp(34px, 10vw, 47px);
          }

          .languageGrid {
            gap: 16px;
          }

          .languageCard {
            padding: 24px 22px;
            border-radius: 24px;
          }

          .languageTop h3 {
            font-size: 27px;
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

          .planGrid {
            gap: 22px;
            margin-top: 34px;
          }

          .planCard {
            min-height: 0;
            padding: 24px 21px;
            border-radius: 27px;
            background: #ffffff;
            box-shadow:
              0 16px 40px
              rgba(64, 33, 105, 0.09);
          }

          .planCardHeader {
            grid-template-columns:
              minmax(0, 1fr) auto;
            gap: 14px;
          }

          .planCard h3 {
            margin-top: 18px;
            font-size: 25px;
          }

          .planFeatureBlock {
            margin-top: 22px;
            padding: 18px;
            border-radius: 18px;
          }

          .featureList > div {
            font-size: 15px;
          }

          .planFooter {
            min-height: 58px;
            margin-top: 22px;
            font-size: 16px;
          }

          .premiumPlan {
            border: 2px solid #7c3aed;
            box-shadow:
              0 24px 58px
              rgba(124, 58, 237, 0.17);
          }

          .premiumValue {
            margin-top: 22px;
          }

          .recommended {
            top: 0;
          }

          .pricingGrid {
            gap: 20px;
            margin-top: 30px;
          }

          .pricingCard {
            padding: 24px 21px;
            border-radius: 26px;
          }

          .premiumPricingCard {
            border: 2px solid #7c3aed;
            box-shadow:
              0 24px 58px
              rgba(124,58,237,0.17);
          }

          .priceDisplay strong {
            font-size: 44px;
          }

          .priceTableHeader,
          .priceTableRow {
            grid-template-columns:
              1.2fr 0.8fr 0.8fr;
            gap: 7px;
          }

          .priceTableHeader {
            font-size: 8px;
          }

          .priceTableRow {
            font-size: 11px;
          }

          .pricingTopLink {
            width: 100%;
            justify-content: center;
          }

          .pricingNote {
            align-items: flex-start;
          }
        }
      `}</style>
    </main>
  )
}