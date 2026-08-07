"use client";

import Link from "next/link";

import { wealthAcademyYearPlan } from "../../fountaintalk/data/curricula/wealth/yearPlan";

const programmeStats = [
  { value: "12 months", label: "Structured programme" },
  { value: "4 terms", label: "Progressive learning stages" },
  { value: "48 modules", label: "Practical money lessons" },
  { value: "4 certificates", label: "One after each term" },
];

const outcomes = [
  "Build and maintain a realistic working budget",
  "Create an emergency fund and debt-repayment strategy",
  "Understand income, cash flow, interest and borrowing",
  "Develop valuable skills and additional income ideas",
  "Understand business revenue, costs, profit and systems",
  "Learn investment risk, return, inflation and compounding",
  "Compare shares, funds, bonds, property and cash assets",
  "Create a practical five-year wealth and asset strategy",
];

const audience = [
  {
    title: "Young people",
    text: "Build healthy money habits early, before expensive financial mistakes become established.",
  },
  {
    title: "Adult learners",
    text: "Strengthen budgeting, investing, income-building and long-term planning skills.",
  },
  {
    title: "Families",
    text: "Create a shared language for money, responsibility, decision-making and future planning.",
  },
  {
    title: "Future entrepreneurs",
    text: "Understand customers, value, revenue, profit, systems, intellectual property and personal brand.",
  },
];

const included = [
  "AI-guided lessons with AYO",
  "Structured modules and practical activities",
  "Case studies, quizzes and term assessments",
  "Projects that apply learning to real life",
  "Progress tracking across the programme",
  "Certificates after each completed term",
  "Access to every Fountain Prep academy",
  "Discounts on eligible live tutor bookings",
];

const faqItems = [
  {
    question: "Is this only for children?",
    answer:
      "No. The academy supports young people and adult learners. Families can manage learner access, while adults can study through their own account.",
  },
  {
    question: "Does the programme give financial advice?",
    answer:
      "The academy provides financial education and decision-making frameworks. It does not replace personalised advice from a regulated financial adviser.",
  },
  {
    question: "Can learners study at their own pace?",
    answer:
      "Yes. Learners can complete guided lessons at a suitable pace and return to continue their progress.",
  },
  {
    question: "Are there assessments and certificates?",
    answer:
      "Yes. The programme includes quizzes, case studies, projects, term assessments and certificates for completed stages.",
  },
  {
    question: "Can I start before paying?",
    answer:
      "Yes. The free plan provides introductory academy learning before you choose a paid subscription.",
  },
];

export default function FinancialLiteracyAcademyPage() {
  const terms = wealthAcademyYearPlan.terms;

  return (
    <main className="academyPage">
      <section className="hero">
        <div className="heroCopy">
          <p className="eyebrow">Fountain Prep Financial Literacy Academy</p>

          <h1>
            Build money confidence.
            <span>Create a stronger financial future.</span>
          </h1>

          <p className="heroLead">
            A practical 12-month learning journey that moves from budgeting,
            saving and debt management to entrepreneurship, investing,
            retirement and family wealth.
          </p>

          <div className="heroActions">
            <Link
              href="/pricing?product=academies&academy=wealth"
              className="primaryButton"
            >
              Start Learning
            </Link>

            <a href="#curriculum" className="secondaryButton">
              View Full Curriculum
            </a>
          </div>

          <div className="trustRow">
            <span>✓ Start free</span>
            <span>✓ Learn at your own pace</span>
            <span>✓ Practical projects</span>
            <span>✓ Cancel anytime</span>
          </div>
        </div>

        <div className="heroVisual">
          <div className="moneyCard">
            <div className="moneyCardHeader">
              <span>£</span>
              <div>
                <small>Your learning journey</small>
                <strong>Financial Literacy</strong>
              </div>
            </div>

            <div className="journeyProgress">
              <div>
                <span>Money foundations</span>
                <strong>01</strong>
              </div>
              <div>
                <span>Income and assets</span>
                <strong>02</strong>
              </div>
              <div>
                <span>Investing</span>
                <strong>03</strong>
              </div>
              <div>
                <span>Long-term strategy</span>
                <strong>04</strong>
              </div>
            </div>

            <div className="finalOutcome">
              <small>Final capstone</small>
              <strong>My Five-Year Wealth and Asset Strategy</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="statsSection">
        {programmeStats.map((stat) => (
          <article key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </article>
        ))}
      </section>

      <section className="problemSection">
        <div>
          <p className="eyebrow">Why this matters</p>
          <h2>Money affects nearly every major life decision.</h2>
        </div>

        <div className="problemCopy">
          <p>
            Many people enter adulthood without learning how to budget, manage
            debt, evaluate financial risk, grow income or plan for the future.
          </p>

          <p>
            Financial Literacy Academy turns those intimidating topics into a
            structured, practical learning journey with clear explanations,
            real-life examples and guided activities.
          </p>
        </div>
      </section>

      <section className="outcomesSection">
        <div className="sectionHeading">
          <p className="eyebrow">What learners will be able to do</p>
          <h2>Move from financial confusion to informed action.</h2>
        </div>

        <div className="outcomeGrid">
          {outcomes.map((outcome) => (
            <article key={outcome}>
              <span>✓</span>
              <p>{outcome}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="curriculum" className="curriculumSection">
        <div className="sectionHeading">
          <p className="eyebrow">The complete programme</p>
          <h2>Four terms. Twelve units. Forty-eight practical modules.</h2>
          <span>
            Each stage builds on the last, moving from everyday money
            confidence to long-term wealth planning.
          </span>
        </div>

        <div className="termGrid">
          {terms.map((term) => (
            <article key={term.id} className="termCard">
              <div className="termTop">
                <div>
                  <small>Term {term.termNumber}</small>
                  <h3>{term.title}</h3>
                </div>

                <span>{term.units.length * 4} modules</span>
              </div>

              <div className="unitList">
                {term.units.map((unit) => (
                  <div key={unit.id} className="unit">
                    <div className="unitHeading">
                      <strong>
                        Unit {unit.unitNumber}: {unit.title}
                      </strong>
                    </div>

                    <ul>
                      {unit.modules.map((module) => (
                        <li key={module.id}>{module.title}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="certificate">
                <span>Certificate earned</span>
                <strong>{term.certificateTitle}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="capstoneSection">
        <div>
          <p className="eyebrow">The final project</p>
          <h2>{wealthAcademyYearPlan.capstone.title}</h2>
          <p>{wealthAcademyYearPlan.capstone.description}</p>

          <Link
            href="/pricing?product=academies&academy=wealth"
            className="primaryButton"
          >
            Begin the Programme
          </Link>
        </div>

        <div className="deliverables">
          {wealthAcademyYearPlan.capstone.deliverables.map(
            (deliverable, index) => (
              <article key={deliverable}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{deliverable}</p>
              </article>
            ),
          )}
        </div>
      </section>

      <section className="audienceSection">
        <div className="sectionHeading centered">
          <p className="eyebrow">Who it is for</p>
          <h2>Financial education for every stage of life.</h2>
        </div>

        <div className="audienceGrid">
          {audience.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="includedSection">
        <div>
          <p className="eyebrow">What membership includes</p>
          <h2>More than a collection of videos.</h2>
          <p>
            Learners receive a structured classroom experience, guided by AYO,
            with activities, assessments, projects and progress that stays
            connected across Fountain Prep.
          </p>
        </div>

        <div className="includedGrid">
          {included.map((item) => (
            <div key={item}>
              <span>✓</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="offerSection">
        <div>
          <p className="eyebrow">One subscription. Every academy.</p>
          <h2>Start Financial Literacy Academy today.</h2>
          <p>
            Begin with introductory learning for free, then unlock complete
            courses, assessments, certificates and advanced pathways through
            an academy subscription.
          </p>
        </div>

        <div className="offerActions">
          <Link
            href="/pricing?product=academies&academy=wealth"
            className="primaryButton"
          >
            View Plans and Start
          </Link>

          <Link href="/fountaintalk" className="secondaryButton">
            Explore Other Academies
          </Link>
        </div>
      </section>

      <section className="faqSection">
        <div className="sectionHeading">
          <p className="eyebrow">Questions</p>
          <h2>Frequently asked questions.</h2>
        </div>

        <div className="faqList">
          {faqItems.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="finalCta">
        <p className="eyebrow">Your financial future deserves a plan</p>
        <h2>Build the knowledge before making the decisions.</h2>
        <p>
          Start Financial Literacy Academy and turn money concepts into
          practical skills for everyday life.
        </p>

        <Link
          href="/pricing?product=academies&academy=wealth"
          className="primaryButton"
        >
          Start Learning Now
        </Link>
      </section>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        .academyPage {
          min-height: 100vh;
          padding: 24px 18px 80px;
          color: #271d10;
          background:
            radial-gradient(
              circle at 6% 2%,
              rgba(202, 138, 4, 0.15),
              transparent 27%
            ),
            radial-gradient(
              circle at 94% 5%,
              rgba(124, 58, 237, 0.1),
              transparent 24%
            ),
            linear-gradient(180deg, #fffdf7, #fbf7eb 52%, #f4edda);
        }

        .hero,
        .statsSection,
        .problemSection,
        .outcomesSection,
        .curriculumSection,
        .capstoneSection,
        .audienceSection,
        .includedSection,
        .offerSection,
        .faqSection,
        .finalCta {
          width: min(1180px, 100%);
          margin-left: auto;
          margin-right: auto;
        }

        .hero {
          min-height: 650px;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          align-items: center;
          gap: 48px;
          padding: 54px;
          border-radius: 42px;
          border: 1px solid rgba(161, 98, 7, 0.14);
          background:
            radial-gradient(
              circle at top right,
              rgba(234, 179, 8, 0.18),
              transparent 37%
            ),
            rgba(255, 255, 255, 0.93);
          box-shadow: 0 32px 100px rgba(92, 65, 18, 0.14);
        }

        .eyebrow {
          margin: 0 0 12px;
          color: #a16207;
          font-size: 13px;
          font-weight: 950;
          letter-spacing: 0.055em;
          text-transform: uppercase;
        }

        .hero h1,
        .sectionHeading h2,
        .problemSection h2,
        .capstoneSection h2,
        .includedSection h2,
        .offerSection h2,
        .finalCta h2 {
          margin: 0;
          color: #2b1c08;
          font-weight: 950;
          letter-spacing: -0.058em;
        }

        .hero h1 {
          font-size: clamp(48px, 5.8vw, 78px);
          line-height: 0.96;
        }

        .hero h1 span {
          display: block;
          color: #b77905;
        }

        .heroLead {
          max-width: 650px;
          margin: 24px 0 0;
          color: #706352;
          font-size: 17px;
          line-height: 1.75;
        }

        .heroActions,
        .offerActions {
          margin-top: 30px;
          display: flex;
          gap: 13px;
          flex-wrap: wrap;
        }

        .primaryButton,
        .secondaryButton {
          min-height: 56px;
          padding: 0 25px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 18px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 950;
        }

        .primaryButton {
          color: white;
          background: linear-gradient(135deg, #ca8a04, #854d0e);
          box-shadow: 0 18px 42px rgba(133, 77, 14, 0.27);
        }

        .secondaryButton {
          color: #4d3212;
          background: white;
          border: 1px solid rgba(161, 98, 7, 0.16);
        }

        .trustRow {
          margin-top: 25px;
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }

        .trustRow span {
          padding: 9px 12px;
          border-radius: 999px;
          color: #6c5c47;
          background: #fffdf8;
          border: 1px solid rgba(161, 98, 7, 0.09);
          font-size: 12px;
          font-weight: 850;
        }

        .heroVisual {
          display: grid;
          place-items: center;
        }

        .moneyCard {
          width: min(450px, 100%);
          padding: 31px;
          border-radius: 34px;
          background: linear-gradient(145deg, #2d1b06, #5d3b0b);
          box-shadow: 0 32px 80px rgba(69, 42, 7, 0.3);
          color: white;
        }

        .moneyCardHeader {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .moneyCardHeader > span {
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          border-radius: 19px;
          color: #422a08;
          background: #facc15;
          font-size: 31px;
          font-weight: 950;
        }

        .moneyCardHeader small,
        .moneyCardHeader strong {
          display: block;
        }

        .moneyCardHeader small {
          color: rgba(255, 255, 255, 0.64);
          font-size: 11px;
        }

        .moneyCardHeader strong {
          margin-top: 3px;
          font-size: 22px;
        }

        .journeyProgress {
          margin-top: 30px;
          display: grid;
          gap: 11px;
        }

        .journeyProgress > div {
          padding: 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .journeyProgress span {
          color: rgba(255, 255, 255, 0.82);
          font-size: 13px;
          font-weight: 800;
        }

        .journeyProgress strong {
          color: #fde68a;
        }

        .finalOutcome {
          margin-top: 20px;
          padding: 20px;
          border-radius: 19px;
          color: #3a2508;
          background: linear-gradient(135deg, #fde68a, #facc15);
        }

        .finalOutcome small,
        .finalOutcome strong {
          display: block;
        }

        .finalOutcome small {
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .finalOutcome strong {
          margin-top: 5px;
          line-height: 1.4;
        }

        .statsSection {
          margin-top: 22px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 13px;
        }

        .statsSection article {
          padding: 23px;
          text-align: center;
          border-radius: 23px;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(161, 98, 7, 0.1);
        }

        .statsSection strong,
        .statsSection span {
          display: block;
        }

        .statsSection strong {
          color: #9a6207;
          font-size: 25px;
        }

        .statsSection span {
          margin-top: 5px;
          color: #756751;
          font-size: 12px;
          font-weight: 800;
        }

        .problemSection,
        .outcomesSection,
        .curriculumSection,
        .capstoneSection,
        .audienceSection,
        .includedSection,
        .offerSection,
        .faqSection,
        .finalCta {
          margin-top: 82px;
        }

        .problemSection {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 50px;
          align-items: start;
        }

        .problemSection h2,
        .sectionHeading h2,
        .capstoneSection h2,
        .includedSection h2,
        .offerSection h2,
        .finalCta h2 {
          font-size: clamp(36px, 4.7vw, 59px);
          line-height: 1.03;
        }

        .problemCopy {
          display: grid;
          gap: 17px;
        }

        .problemCopy p,
        .capstoneSection > div > p:not(.eyebrow),
        .includedSection > div > p:not(.eyebrow),
        .offerSection p,
        .finalCta > p:not(.eyebrow) {
          margin: 0;
          color: #746856;
          font-size: 16px;
          line-height: 1.75;
        }

        .sectionHeading {
          max-width: 830px;
        }

        .sectionHeading.centered {
          margin-left: auto;
          margin-right: auto;
          text-align: center;
        }

        .sectionHeading > span {
          display: block;
          margin-top: 16px;
          color: #756955;
          line-height: 1.7;
        }

        .outcomeGrid {
          margin-top: 28px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 13px;
        }

        .outcomeGrid article {
          padding: 19px;
          display: flex;
          gap: 13px;
          align-items: flex-start;
          border-radius: 19px;
          background: white;
          border: 1px solid rgba(161, 98, 7, 0.1);
        }

        .outcomeGrid article span {
          width: 28px;
          height: 28px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: white;
          background: #ca8a04;
          font-weight: 950;
        }

        .outcomeGrid article p {
          margin: 3px 0 0;
          color: #5f523f;
          font-weight: 800;
          line-height: 1.55;
        }

        .termGrid {
          margin-top: 30px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
        }

        .termCard {
          padding: 28px;
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.94);
          border: 1px solid rgba(161, 98, 7, 0.11);
          box-shadow: 0 18px 50px rgba(83, 55, 11, 0.08);
        }

        .termTop {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .termTop small {
          color: #a16207;
          font-weight: 900;
          text-transform: uppercase;
        }

        .termTop h3 {
          margin: 6px 0 0;
          font-size: 26px;
          letter-spacing: -0.035em;
        }

        .termTop > span {
          padding: 8px 10px;
          border-radius: 999px;
          color: #854d0e;
          background: #fef3c7;
          font-size: 11px;
          font-weight: 900;
          white-space: nowrap;
        }

        .unitList {
          margin-top: 23px;
          display: grid;
          gap: 15px;
        }

        .unit {
          padding: 17px;
          border-radius: 18px;
          background: #fffcf5;
          border: 1px solid rgba(161, 98, 7, 0.08);
        }

        .unitHeading strong {
          color: #3f2b10;
          line-height: 1.4;
        }

        .unit ul {
          margin: 12px 0 0;
          padding-left: 18px;
          display: grid;
          gap: 6px;
        }

        .unit li {
          color: #776a57;
          font-size: 13px;
          line-height: 1.45;
        }

        .certificate {
          margin-top: 18px;
          padding-top: 18px;
          border-top: 1px solid rgba(161, 98, 7, 0.11);
        }

        .certificate span,
        .certificate strong {
          display: block;
        }

        .certificate span {
          color: #a16207;
          font-size: 10px;
          font-weight: 950;
          text-transform: uppercase;
        }

        .certificate strong {
          margin-top: 5px;
        }

        .capstoneSection,
        .includedSection,
        .offerSection {
          padding: 42px;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 38px;
          border-radius: 38px;
          background: rgba(255, 255, 255, 0.93);
          border: 1px solid rgba(161, 98, 7, 0.12);
          box-shadow: 0 24px 65px rgba(77, 50, 9, 0.09);
        }

        .capstoneSection .primaryButton {
          margin-top: 25px;
        }

        .deliverables,
        .includedGrid {
          display: grid;
          gap: 10px;
        }

        .deliverables article,
        .includedGrid div {
          padding: 14px 16px;
          display: flex;
          gap: 12px;
          align-items: center;
          border-radius: 16px;
          background: #fffaf0;
          border: 1px solid rgba(161, 98, 7, 0.08);
        }

        .deliverables span {
          color: #a16207;
          font-size: 12px;
          font-weight: 950;
        }

        .deliverables p {
          margin: 0;
          color: #5e503c;
          font-size: 13px;
          font-weight: 800;
        }

        .audienceGrid {
          margin-top: 28px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
        }

        .audienceGrid article {
          padding: 26px;
          border-radius: 25px;
          background: white;
          border: 1px solid rgba(161, 98, 7, 0.1);
        }

        .audienceGrid h3 {
          margin: 0;
          font-size: 20px;
        }

        .audienceGrid p {
          margin: 11px 0 0;
          color: #756955;
          line-height: 1.65;
        }

        .includedGrid div span {
          color: #a16207;
          font-weight: 950;
        }

        .includedGrid div strong {
          color: #55452f;
          font-size: 13px;
        }

        .offerSection {
          align-items: center;
          background:
            radial-gradient(
              circle at top right,
              rgba(250, 204, 21, 0.2),
              transparent 40%
            ),
            white;
        }

        .offerActions {
          flex-direction: column;
          margin-top: 0;
        }

        .faqList {
          margin-top: 27px;
          display: grid;
          gap: 11px;
        }

        .faqList details {
          padding: 20px 22px;
          border-radius: 19px;
          background: white;
          border: 1px solid rgba(161, 98, 7, 0.1);
        }

        .faqList summary {
          cursor: pointer;
          color: #3f2b10;
          font-weight: 900;
        }

        .faqList details p {
          margin: 13px 0 0;
          color: #756955;
          line-height: 1.65;
        }

        .finalCta {
          padding: 48px;
          text-align: center;
          border-radius: 39px;
          color: white;
          background:
            radial-gradient(
              circle at top right,
              rgba(250, 204, 21, 0.26),
              transparent 36%
            ),
            linear-gradient(135deg, #422806, #7a4d09);
          box-shadow: 0 28px 75px rgba(76, 45, 5, 0.23);
        }

        .finalCta h2 {
          max-width: 850px;
          margin-left: auto;
          margin-right: auto;
          color: white;
        }

        .finalCta .eyebrow {
          color: #fde68a;
        }

        .finalCta > p:not(.eyebrow) {
          max-width: 700px;
          margin: 17px auto 0;
          color: rgba(255, 255, 255, 0.76);
        }

        .finalCta .primaryButton {
          margin-top: 27px;
          color: #422806;
          background: #facc15;
          box-shadow: none;
        }

        @media (max-width: 980px) {
          .hero,
          .problemSection,
          .capstoneSection,
          .includedSection,
          .offerSection {
            grid-template-columns: 1fr;
          }

          .statsSection,
          .audienceGrid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 720px) {
          .academyPage {
            padding: 13px 10px 60px;
          }

          .hero {
            min-height: auto;
            padding: 26px 20px;
            border-radius: 30px;
          }

          .hero h1 {
            font-size: clamp(41px, 12vw, 56px);
          }

          .heroActions,
          .offerActions {
            flex-direction: column;
          }

          .primaryButton,
          .secondaryButton {
            width: 100%;
          }

          .trustRow {
            display: grid;
          }

          .statsSection,
          .outcomeGrid,
          .termGrid,
          .audienceGrid {
            grid-template-columns: 1fr;
          }

          .problemSection,
          .outcomesSection,
          .curriculumSection,
          .capstoneSection,
          .audienceSection,
          .includedSection,
          .offerSection,
          .faqSection,
          .finalCta {
            margin-top: 58px;
          }

          .capstoneSection,
          .includedSection,
          .offerSection,
          .finalCta {
            padding: 26px 20px;
            border-radius: 29px;
          }

          .termCard {
            padding: 22px 18px;
          }

          .termTop {
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}
