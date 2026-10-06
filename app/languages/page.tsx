'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  useEffect,
  useMemo,
  useState,
} from 'react'

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
        const response = await fetch(
          '/api/location/country',
          {
            cache: 'no-store',
          },
        )

        if (!response.ok) return

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

        if (cancelled) return

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

  const localPrices = useMemo(
    () => ({
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
    }),
    [currency],
  )

  function changePricingCountry(
    countryKey: string,
  ) {
    const nextCurrency =
      currencyTable[countryKey]

    if (!nextCurrency) return

    setPricingCountry(countryKey)
    setCurrency(nextCurrency)
  }

  return (
    <main className="page">
      <section className="hero">
        <div className="heroCopy">
          <div className="pill">
            Fountain Prep Languages
          </div>

          <h1>
            Help your child
            <span> grow closer to Nigerian culture.</span>
          </h1>

          <p className="lead">
            Live private 1-to-1 Yoruba,
            Igbo and Hausa lessons with
            carefully selected tutors who
            help learners speak with
            confidence and connect with
            language and culture.
          </p>

          <p className="heroPromise">
            They will speak their roots and 
            feel at home in their culture.
          </p>

          <div className="heroActions">
            <Link
  href="/parent/students"
  className="heroPrimaryButton"
  style={{
    minHeight: "56px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "0 26px",
    borderRadius: "15px",
    color: "#ffffff",
    background: "linear-gradient(135deg, #6d28d9, #8b5cf6)",
    fontSize: "15px",
    fontWeight: 950,
    textDecoration: "none",
    boxShadow: "0 12px 28px rgba(109, 40, 217, 0.28)",
  }}
>
  Find my child a Tutor
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
              Yoruba · Igbo · Hausa
            </span>

            <span>
              <b>✓</b>
              Flexible scheduling
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
              1:1
            </div>

            <div>
              <small>
                LIVE LANGUAGE LEARNING
              </small>

              <strong>
                Personal teaching.
                Real conversation.
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
            Learn a language you can
            actually use.
          </h2>

          <p>
            Build the confidence to
            understand, respond and hold
            real conversations in Yoruba,
            Igbo or Hausa.
          </p>
        </div>

        <div className="languageGrid">
          {languages.map(
            (language) => (
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
                  Find a {language.name}{' '}
                  tutor
                  <span>→</span>
                </div>
              </Link>
            ),
          )}
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
            Personal language learning
            from the first lesson.
          </h2>

          <p>
            Choose your language, arrange
            a convenient timetable and
            learn directly with a
            dedicated Fountain Prep tutor.
          </p>
        </div>

        <div className="steps">
          <article>
            <div className="stepTop">
              <div className="stepIcon">
                1
              </div>
              <span>CHOOSE</span>
            </div>

            <h3>
              Choose your language
            </h3>

            <p>
              Start with Yoruba, Igbo or
              Hausa and choose the learning
              path that suits your child.
            </p>
          </article>

          <article>
            <div className="stepTop">
              <div className="stepIcon">
                2
              </div>
              <span>SCHEDULE</span>
            </div>

            <h3>
              Choose your timetable
            </h3>

            <p>
              Arrange recurring private
              lessons around school, work
              and your family&apos;s
              schedule.
            </p>
          </article>

          <article>
            <div className="stepTop">
              <div className="stepIcon">
                3
              </div>
              <span>LEARN</span>
            </div>

            <h3>
              Learn 1-to-1
            </h3>

            <p>
              Meet your tutor live for
              conversation, pronunciation,
              vocabulary and cultural
              context.
            </p>
          </article>
        </div>
      </section>

      <section className="liveStory">
        <div className="liveStoryCopy">
          <p className="eyebrowLight">
            MORE THAN VOCABULARY
          </p>

          <h2>
            A language becomes meaningful
            when you can use it.
          </h2>

          <p>
            Fountain Prep lessons are
            designed to help learners move
            beyond memorising words to
            understanding, responding and
            speaking with confidence.
          </p>

          <div className="benefitGrid">
            <span>
              ✓ Private 1-to-1 teaching
            </span>
            <span>
              ✓ Conversation practice
            </span>
            <span>
              ✓ Listening development
            </span>
            <span>
              ✓ Pronunciation support
            </span>
            <span>
              ✓ Cultural context
            </span>
            <span>
              ✓ Structured progression
            </span>
          </div>

          <Link
            href="/parent/students"
            className="whiteAction"
          >
            Find a Language Tutor →
          </Link>
        </div>

        <div className="journey">
          <div className="journeyCard">
            <span>01</span>
            <div>
              <small>
                PERSONAL ATTENTION
              </small>
              <strong>
                Learn directly
              </strong>
              <p>
                A dedicated tutor focuses
                on the learner&apos;s
                individual progress.
              </p>
            </div>
          </div>

          <div className="journeyCard">
            <span>02</span>
            <div>
              <small>
                REAL CONVERSATION
              </small>
              <strong>
                Speak and respond
              </strong>
              <p>
                Build practical language
                skills through live
                interaction.
              </p>
            </div>
          </div>

          <div className="journeyCard">
            <span>03</span>
            <div>
              <small>
                CONTINUED PROGRESS
              </small>
              <strong>
                Build confidence
              </strong>
              <p>
                Progress through regular,
                structured lessons.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="pricingSnapshot"
        id="language-pricing"
      >
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

        <div className="pricingHeading">
          <div>
            <p className="eyebrow">
              Simple live lesson pricing
            </p>

            <h2>
              Private 1-to-1 learning.
              <span> Clear pricing.</span>
            </h2>

            <p>
              Choose one or two lessons
              each week with monthly and
              three-month options.
            </p>
          </div>

          <Link
            href="/parent/students"
            className="pricingTopLink"
          >
            Start choosing →
          </Link>
        </div>

        <div className="pricingCard">
          <div className="pricingCardTop">
            <div>
              <div className="pricePill">
                LIVE 1-TO-1
              </div>

              <h3>
                Private language lessons
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

            <span>/ class</span>
          </div>

          <p className="priceDescription">
            Private structured language
            lessons with a dedicated
            Fountain Prep tutor.
          </p>

          <div className="miniPriceRows">
            <div>
              <span>Monthly plan</span>
              <strong>
                {localPrices.liveMonthly}
                /class
              </strong>
            </div>

            <div>
              <span>3-month plan</span>
              <strong>
                {localPrices.liveThreeMonth}
                /class
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
            <span>
              ✓ Flexible scheduling
            </span>
          </div>

          <Link
            href="/parent/students"
            className="priceButton"
          >
            View Live Plans
            <span>→</span>
          </Link>
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
              Prices are displayed in your
              selected local currency. Your
              final booking total will be
              confirmed before payment.
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
            Give them more than
            vocabulary. Give them a
            language they can use.
          </h2>

          <p>
            Start with Yoruba, Igbo or
            Hausa and build the confidence
            to speak, understand and
            connect.
          </p>
        </div>

        <div className="finalActions">
          <Link
            href="/parent/students"
            className="whiteButton"
          >
            Find a Language Tutor →
          </Link>

          <Link
            href="/subjects"
            className="outlineButton"
          >
            Explore Other Subjects
          </Link>
        </div>
      </section>

      <style jsx>{`
        .page {
          min-height: 100vh;
          padding: 28px 20px 90px;
          color: #20122f;
          background:
            radial-gradient(
              circle at 92% 8%,
              rgba(124, 58, 237, 0.12),
              transparent 27%
            ),
            linear-gradient(
              180deg,
              #fff 0%,
              #fbf9ff 50%,
              #f5f0ff 100%
            );
        }

        .hero,
        .languageSection,
        .learningModel,
        .liveStory,
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
          border: 1px solid
            rgba(124, 58, 237, 0.12);
          border-radius: 36px;
          background: #fff;
          box-shadow:
            0 30px 90px
            rgba(59, 31, 98, 0.12);
        }

        .heroCopy {
          padding: 48px 42px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .pill,
        .pricePill {
          width: fit-content;
          padding: 8px 12px;
          border-radius: 999px;
          background: #f0e7ff;
          color: #6d28d9;
          font-size: 10px;
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

        h1 span,
        .pricingHeading h2 span {
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

        .heroPrimaryButton,
.secondary,
.whiteAction,
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
        }

        .heroPrimaryButton {
  min-height: 56px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 26px;
  border-radius: 15px;
  color: #ffffff !important;
  background: linear-gradient(135deg, #6d28d9, #8b5cf6);
  font-size: 15px;
  font-weight: 950;
  text-decoration: none !important;
  box-shadow: 0 12px 28px rgba(109, 40, 217, 0.28);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.heroPrimaryButton:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 34px rgba(109, 40, 217, 0.36);
}
  
        .secondary {
          color: #4d286f;
          border: 1px solid
            rgba(124, 58, 237, 0.18);
          background: #fff;
        }

        .trustRow {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 24px;
        }

        .trustRow span {
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
            rgba(255,255,255,0.95);
          box-shadow:
            0 16px 40px
            rgba(26,13,42,0.2);
        }

        .badgeIcon {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          color: #fff;
          background: #6d28d9;
          font-size: 12px;
          font-weight: 950;
        }

        .imageBadge small {
          display: block;
          color: #7c3aed;
          font-size: 9px;
          font-weight: 950;
        }

        .imageBadge strong {
          display: block;
          margin-top: 4px;
          font-size: 15px;
        }

        .languageSection,
        .learningModel,
        .pricingSnapshot {
          padding-top: 88px;
        }

        .sectionHeading {
          max-width: 800px;
        }

        .sectionHeading.centred {
          margin: 0 auto;
          text-align: center;
        }

        .eyebrow,
        .eyebrowLight {
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

        .sectionHeading > p:last-child,
        .pricingHeading p:last-child {
          margin: 16px 0 0;
          color: #71657b;
          font-size: 16px;
          line-height: 1.7;
        }

        .sectionHeading > p:last-child {
          margin-left: auto;
          margin-right: auto;
        }

        .languageGrid,
        .steps {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 18px;
          margin-top: 34px;
        }

        .languageCard,
        .steps article {
          padding: 27px;
          border-radius: 25px;
          background: #fff;
          border: 1px solid
            rgba(124, 58, 237, 0.12);
          box-shadow:
            0 18px 48px
            rgba(71,43,117,0.07);
        }

        .languageCard {
          display: block;
          color: inherit;
          text-decoration: none;
          transition:
            transform 0.22s ease,
            box-shadow 0.22s ease;
        }

        .languageCard:hover {
          transform: translateY(-5px);
          box-shadow:
            0 26px 60px
            rgba(94,48,170,0.14);
        }

        .languageTop,
        .stepTop,
        .pricingCardTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .languageTop h3 {
          margin: 0;
          font-size: 27px;
        }

        .cardArrow,
        .stepIcon,
        .pricingIcon {
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          background: #f3ebff;
          color: #6d28d9;
          font-weight: 950;
        }

        .cardArrow {
          width: 38px;
          height: 38px;
          border-radius: 50%;
        }

        .languageCard p,
        .steps p {
          color: #73667d;
          line-height: 1.66;
        }

        .languageAction {
          display: flex;
          justify-content: space-between;
          margin-top: 21px;
          padding-top: 17px;
          border-top: 1px solid
            rgba(124,58,237,0.1);
          color: #6d28d9;
          font-size: 13px;
          font-weight: 950;
        }

        .stepIcon {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          color: #fff;
          background: #6d28d9;
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
        }

        .liveStory {
          margin-top: 90px;
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            minmax(0, 0.9fr);
          gap: 38px;
          padding: 48px;
          border-radius: 36px;
          color: #fff;
          background:
            linear-gradient(
              135deg,
              #2b0d59,
              #4f1da6 58%,
              #7139d5
            );
          box-shadow:
            0 32px 90px
            rgba(76,29,149,0.26);
        }

        .eyebrowLight {
          color: #ddd6fe;
        }

        .liveStory h2 {
          margin: 16px 0 0;
          font-size:
            clamp(38px, 4.6vw, 60px);
          line-height: 1.03;
          letter-spacing: -0.045em;
        }

        .liveStoryCopy > p:not(.eyebrowLight) {
          color: #e7ddf2;
          line-height: 1.7;
        }

        .benefitGrid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 9px;
          margin-top: 22px;
        }

        .benefitGrid span {
          padding: 11px 12px;
          border-radius: 12px;
          background:
            rgba(255,255,255,0.09);
          font-size: 12px;
          font-weight: 800;
        }

        .whiteAction {
          width: fit-content;
          margin-top: 26px;
          color: #52209d;
          background: #fff;
        }

        .journey {
          display: grid;
          align-content: center;
          gap: 10px;
        }

        .journeyCard {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 14px;
          align-items: center;
          padding: 19px;
          border-radius: 18px;
          background:
            rgba(255,255,255,0.1);
          border: 1px solid
            rgba(255,255,255,0.11);
        }

        .journeyCard > span {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background:
            rgba(255,255,255,0.12);
          font-size: 12px;
          font-weight: 950;
        }

        .journeyCard small {
          color: #ddd6fe;
          font-size: 9px;
          font-weight: 950;
        }

        .journeyCard strong {
          display: block;
          margin-top: 4px;
        }

        .journeyCard p {
          margin: 4px 0 0;
          color: #e9e2f2;
          font-size: 12px;
        }

        .pricingCountryBar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 15px 17px;
          border-radius: 18px;
          background: #fff;
          border: 1px solid
            rgba(124,58,237,0.11);
        }

        .pricingCountryBar > div {
          display: grid;
          gap: 3px;
        }

        .countryLabel {
          color: #8a7c94;
          font-size: 10px;
          font-weight: 950;
          text-transform: uppercase;
        }

        .pricingCountryBar select {
          min-height: 44px;
          padding: 0 14px;
          border: 1px solid
            rgba(124,58,237,0.16);
          border-radius: 13px;
          background: #fff;
          color: #4f286e;
          font-weight: 850;
        }

        .pricingHeading {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr) auto;
          gap: 30px;
          align-items: end;
          margin-top: 30px;
        }

        .pricingTopLink {
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          padding: 0 18px;
          border-radius: 15px;
          background: #f1e8ff;
          color: #5b21b6;
          font-weight: 950;
          text-decoration: none;
        }

        .pricingCard {
          max-width: 720px;
          margin: 36px auto 0;
          padding: 32px;
          border-radius: 30px;
          background: #fff;
          border: 1px solid
            rgba(124,58,237,0.12);
          box-shadow:
            0 20px 55px
            rgba(60,31,100,0.08);
        }

        .pricingCard h3 {
          margin: 16px 0 0;
          font-size: 27px;
        }

        .pricingIcon {
          width: 43px;
          height: 43px;
          border-radius: 14px;
        }

        .priceDisplay {
          display: flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 28px;
        }

        .priceFrom {
          width: 100%;
          color: #8a7d94;
          font-size: 10px;
          font-weight: 950;
          text-transform: uppercase;
        }

        .priceDisplay strong {
          font-size:
            clamp(40px, 4vw, 52px);
          letter-spacing: -0.05em;
        }

        .priceDescription {
          color: #706279;
          line-height: 1.62;
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
          justify-content: space-between;
          gap: 14px;
          color: #71657b;
          font-size: 13px;
        }

        .miniPriceRows strong {
          color: #4f1d96;
        }

        .miniBenefits {
          display: grid;
          gap: 9px;
          margin: 22px 0 26px;
          padding-top: 19px;
          border-top: 1px solid
            rgba(124,58,237,0.09);
        }

        .miniBenefits span {
          color: #594c63;
          font-size: 13px;
          font-weight: 800;
        }

        .priceButton {
          min-height: 54px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 18px;
          border-radius: 16px;
          color: #fff;
          background:
            linear-gradient(
              135deg,
              #6d28d9,
              #8b5cf6
            );
          font-weight: 950;
          text-decoration: none;
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
          border: 1px solid
            rgba(124,58,237,0.1);
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

        .pricingNote p {
          margin: 3px 0 0;
          color: #796d82;
          font-size: 12px;
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
          color: #fff;
          background:
            linear-gradient(
              135deg,
              #28103d,
              #4c1d95
            );
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
        }

        .finalCopy h2 {
          margin: 9px 0 0;
          max-width: 700px;
          font-size:
            clamp(30px, 3.3vw, 46px);
          line-height: 1.04;
          letter-spacing: -0.04em;
        }

        .finalCopy > p:last-child {
          margin: 10px 0 0;
          color: #ded3e8;
        }

        .finalActions {
          display: grid;
          gap: 9px;
          min-width: 220px;
        }

        .whiteButton {
          color: #4c1d95;
          background: #fff;
        }

        .outlineButton {
          color: #fff;
          border: 1px solid
            rgba(255,255,255,0.28);
        }

        @media (max-width: 900px) {
          .hero,
          .liveStory,
          .finalCta {
            grid-template-columns: 1fr;
          }

          .heroVisual {
            min-height: 420px;
          }

          .languageGrid,
          .steps {
            grid-template-columns: 1fr;
          }

          .pricingHeading {
            grid-template-columns: 1fr;
            align-items: start;
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

          .heroVisual {
            min-height: 300px;
          }

          .heroActions {
            display: grid;
          }

          .heroPrimaryButton,
.secondary,
.whiteAction,
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
          .pricingSnapshot {
            padding-top: 70px;
          }

          .liveStory,
          .finalCta {
            padding: 26px 20px;
            border-radius: 26px;
          }

          .benefitGrid {
            grid-template-columns: 1fr;
          }

          .pricingCountryBar {
            align-items: stretch;
            flex-direction: column;
          }

          .pricingCountryBar select {
            width: 100%;
          }

          .pricingCard {
            padding: 24px 21px;
          }

          .finalCta {
            margin-top: 70px;
          }
        }
      `}</style>
    </main>
  )
}