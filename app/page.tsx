"use client";

import Link from "next/link";
import SupportWidget from "./components/SupportWidget";

const academies = [
  {
    title: "Mathematics",
    text: "Build number confidence, problem-solving skills and strong foundations.",
    icon: "➗",
    href: "/fountaintalk/classroom/mathematics",
    tone: "blue",
  },
  {
    title: "Coding",
    text: "Learn logic, websites, games and practical software development.",
    icon: "💻",
    href: "/fountaintalk/classroom/coding",
    tone: "indigo",
  },
  {
    title: "AI",
    text: "Understand artificial intelligence and use it confidently for learning and work.",
    icon: "🤖",
    href: "/fountaintalk/classroom/ai",
    tone: "purple",
  },
  {
  title: "Financial Literacy",
  text: "Develop practical saving, budgeting, investing and money-management skills.",
  icon: "💰",
  href: "/academies/financial-literacy",
  tone: "gold",
},
  {
    title: "IELTS Preparation",
    text: "Strengthen reading, writing, speaking and listening for IELTS success.",
    icon: "🎓",
    href: "/fountaintalk/classroom/ielts",
    tone: "red",
  },
  {
    title: "Data Analysis",
    text: "Investigate data, discover insights and communicate evidence clearly.",
    icon: "📊",
    href: "/fountaintalk/classroom/data-analysis",
    tone: "sky",
  },
  {
    title: "Articulation",
    text: "Speak with clarity, confidence, strong pronunciation and expression.",
    icon: "🎙️",
    href: "/fountaintalk/classroom/articulation",
    tone: "orange",
  },
  {
    title: "Music",
    text: "Explore rhythm, melody, notation and confident musical expression.",
    icon: "🎵",
    href: "/fountaintalk/classroom/music",
    tone: "pink",
  },
];

const platformBenefits = [
  {
    icon: "🧠",
    title: "AI-guided learning",
    text: "Learners move through structured lessons with guidance, explanations and activities adapted to their stage.",
  },
  {
    icon: "👩‍🏫",
    title: "Live tutor support",
    text: "Book private one-to-one lessons when a learner needs human explanation, encouragement or deeper support.",
  },
  {
    icon: "📈",
    title: "Progress in one place",
    text: "Academy learning, tutor sessions and learner progress remain connected across the Fountain Prep platform.",
  },
  {
    icon: "👨‍👩‍👧‍👦",
    title: "Built for families and adults",
    text: "Parents can manage multiple learners, while adult learners can study independently through their own account.",
  },
];

const journeySteps = [
  {
    number: "01",
    title: "Choose a learner",
    text: "Create a learner profile or select an existing learner from your account.",
  },
  {
    number: "02",
    title: "Enter an academy",
    text: "Choose from Mathematics, Coding, AI, Financial Literacy and more.",
  },
  {
    number: "03",
    title: "Learn with AYO",
    text: "Complete structured lessons, activities and guided classroom experiences.",
  },
  {
    number: "04",
    title: "Add live support",
    text: "Book a private tutor whenever the learner needs additional help.",
  },
];

const trustItems = [
  "Structured academy curricula",
  "Private live tutoring",
  "Learner progress tracking",
  "Secure family accounts",
];

export default function HomePage() {
  return (
    <main className="homePage">
      <section className="hero">
        <div className="heroCopy">
          <div className="productPill">
            <span />
            AI academies and live tutoring in one platform
          </div>

          <h1>
            Learn independently.
            <span>Get human support when it matters.</span>
          </h1>

          <p className="heroLead">
            Fountain Prep combines AI-guided academies, structured learning
            pathways and private live tutors to help children and adults build
            knowledge, confidence and practical skills.
          </p>

          <div className="heroActions">
            <Link href="/fountaintalk" className="primaryButton">
              Explore AI Academies
            </Link>

            <Link href="/start" className="secondaryButton">
              Book a Live Tutor
            </Link>
          </div>

          <div className="trustRow">
            {trustItems.map((item) => (
              <span key={item}>✓ {item}</span>
            ))}
          </div>
        </div>

        <div className="heroVisual">
          <div className="learningCard mainLearningCard">
            <div className="cardTop">
              <span className="cardIcon">🤖</span>
              <small>Learn with AYO</small>
            </div>

            <h2>Your learning world</h2>
            <p>
              Move from numbers to code, communication to money skills, all
              through one connected learning experience.
            </p>

            <div className="academyChips">
              <span>➗ Maths</span>
              <span>💻 Coding</span>
              <span>🤖 AI</span>
              <span>💰 Finance</span>
            </div>

            <Link href="/fountaintalk">Choose an academy →</Link>
          </div>

          <div className="floatingCard tutorCard">
            <strong>Live tutor support</strong>
            <span>Private one-to-one lessons when extra help is needed.</span>
          </div>

          <div className="floatingCard progressCard">
            <strong>Progress that follows you</strong>
            <span>Academy learning and tutor support in one place.</span>
          </div>
        </div>
      </section>

      <section className="pathSection">
        <div className="sectionHeading centered">
          <p>Two connected ways to learn</p>
          <h2>Choose independent learning, live support, or both.</h2>
          <span>
            Fountain Prep gives every learner a flexible pathway rather than
            forcing one learning method.
          </span>
        </div>

        <div className="pathGrid">
          <article className="pathCard academyPath">
            <div className="pathIcon">🤖</div>
            <p className="eyebrow">AI-powered learning</p>
            <h3>Learn with AYO Academies</h3>
            <p>
              Follow structured lessons, activities and guided classroom
              experiences across academic, career and life-skill subjects.
            </p>

            <ul>
              <li>Learn at your own pace</li>
              <li>Access multiple academies</li>
              <li>Track learner progress</li>
              <li>Study from anywhere</li>
            </ul>

            <Link href="/fountaintalk" className="cardButton">
              Explore Academies
            </Link>
          </article>

          <article className="pathCard tutorPath">
            <div className="pathIcon">👩‍🏫</div>
            <p className="eyebrow">Human learning support</p>
            <h3>Book a Live Tutor</h3>
            <p>
              Schedule private online lessons with a tutor for focused support,
              explanation, confidence-building and accountability.
            </p>

            <ul>
              <li>Private one-to-one lessons</li>
              <li>Weekly structured timetables</li>
              <li>Subject and level matching</li>
              <li>Academy subscriber discounts</li>
            </ul>

            <Link href="/start" className="cardButton secondary">
              Start Tutor Booking
            </Link>
          </article>
        </div>
      </section>

      <section className="academySection">
        <div className="sectionHeading">
          <p>Explore the academies</p>
          <h2>Practical learning for school, work and life.</h2>
          <span>
            Begin with one academy or explore several through a single Fountain
            Prep learner account.
          </span>
        </div>

        <div className="academyGrid">
          {academies.map((academy) => (
            <Link
              href={academy.href}
              key={academy.title}
              className={`academyCard ${academy.tone}`}
            >
              <div className="academyIcon">{academy.icon}</div>
              <div>
                <h3>{academy.title}</h3>
                <p>{academy.text}</p>
              </div>
              <strong>Enter academy →</strong>
            </Link>
          ))}
        </div>

        <div className="academyActions">
          <Link href="/fountaintalk" className="primaryButton">
            View All Academies
          </Link>

          <Link
            href="/pricing?product=academies"
            className="secondaryButton"
          >
            View Academy Plans
          </Link>
        </div>
      </section>

      <section className="benefitSection">
        <div className="sectionHeading centered">
          <p>One connected platform</p>
          <h2>Designed around the learner, not a single service.</h2>
        </div>

        <div className="benefitGrid">
          {platformBenefits.map((benefit) => (
            <article key={benefit.title} className="benefitCard">
              <div>{benefit.icon}</div>
              <h3>{benefit.title}</h3>
              <p>{benefit.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="journeySection">
        <div className="sectionHeading">
          <p>How Fountain Prep works</p>
          <h2>A clear learning journey from first lesson to lasting progress.</h2>
        </div>

        <div className="journeyGrid">
          {journeySteps.map((step) => (
            <article key={step.number} className="journeyCard">
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="familySection">
        <div>
          <p className="eyebrow">Learning that grows with you</p>
          <h2>One account. Multiple learners. Many possibilities.</h2>
          <span>
            Parents can manage academy access for their children, follow
            progress and add live tutoring when needed. Adult learners can
            create an independent account and manage their own learning journey.
          </span>

          <div className="familyChecks">
            <div>✓ Child and adult learner profiles</div>
            <div>✓ Individual and family academy plans</div>
            <div>✓ Covered learner management</div>
            <div>✓ Live-tutor subscriber discounts</div>
          </div>

          <Link
            href="/pricing?product=academies"
            className="primaryButton"
          >
            Compare Academy Plans
          </Link>
        </div>

        <div className="dashboardPreview">
          <div className="previewHeader">
            <div>
              <small>Fountain Prep learner</small>
              <strong>Learning overview</strong>
            </div>
            <span>Active</span>
          </div>

          <div className="previewAcademy">
            <div>
              <span>🤖</span>
              <section>
                <strong>AI Academy</strong>
                <small>Foundation pathway</small>
              </section>
            </div>
            <b>62%</b>
          </div>

          <div className="progressTrack">
            <i />
          </div>

          <div className="previewRows">
            <div>
              <span>Current lesson</span>
              <strong>Understanding intelligent systems</strong>
            </div>
            <div>
              <span>Live support</span>
              <strong>Tutor booking available</strong>
            </div>
            <div>
              <span>Next step</span>
              <strong>Continue learning with AYO</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="supportSection">
        <div>
          <p className="eyebrow">Need help choosing?</p>
          <h2>Talk to Fountain Prep support.</h2>
          <span>
            Ask about academies, subscriptions, learner access or live tutoring
            through the support button on this page.
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            const supportButton =
              document.querySelector<HTMLButtonElement>(".supportButton");

            supportButton?.click();
          }}
        >
          Open Support
        </button>
      </section>

      <section className="finalSection">
        <p>Fountain Prep</p>
        <h2>A complete learning platform for every stage of life.</h2>
        <span>
          Learn independently with AI-powered academies, add private tutor
          support when needed and keep every learner&apos;s progress connected.
        </span>

        <div className="heroActions finalActions">
          <Link href="/fountaintalk" className="primaryButton">
            Explore AI Academies
          </Link>

          <Link href="/start" className="secondaryButton">
            Book a Live Tutor
          </Link>
        </div>
      </section>

      <SupportWidget />

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        .homePage {
          min-height: 100vh;
          padding: 24px 16px 80px;
          color: #21152f;
          background:
            radial-gradient(
              circle at 8% 2%,
              rgba(124, 58, 237, 0.14),
              transparent 27%
            ),
            radial-gradient(
              circle at 92% 6%,
              rgba(37, 99, 235, 0.1),
              transparent 25%
            ),
            linear-gradient(180deg, #fdfbff 0%, #f8f4fc 48%, #eee8f6 100%);
          overflow: hidden;
        }

        .hero,
        .pathSection,
        .academySection,
        .benefitSection,
        .journeySection,
        .familySection,
        .supportSection,
        .finalSection {
          width: min(1180px, 100%);
          margin-left: auto;
          margin-right: auto;
        }

        .hero {
          min-height: 650px;
          display: grid;
          grid-template-columns: 1.02fr 0.98fr;
          align-items: center;
          gap: 46px;
          padding: 54px;
          border-radius: 42px;
          border: 1px solid rgba(124, 58, 237, 0.1);
          background:
            radial-gradient(
              circle at top right,
              rgba(124, 58, 237, 0.12),
              transparent 38%
            ),
            rgba(255, 255, 255, 0.9);
          box-shadow: 0 32px 100px rgba(55, 31, 86, 0.13);
        }

        .productPill {
          width: fit-content;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 15px;
          border-radius: 999px;
          color: #6d28d9;
          background: #f2eaff;
          font-size: 13px;
          font-weight: 900;
        }

        .productPill span {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.13);
        }

        .hero h1,
        .sectionHeading h2,
        .familySection h2,
        .supportSection h2,
        .finalSection h2 {
          margin: 0;
          color: #20122f;
          font-weight: 950;
          letter-spacing: -0.058em;
        }

        .hero h1 {
          margin-top: 24px;
          font-size: clamp(46px, 5.6vw, 76px);
          line-height: 0.96;
        }

        .hero h1 span {
          display: block;
          color: #7c3aed;
        }

        .heroLead {
          max-width: 660px;
          margin: 24px 0 0;
          color: #6b6174;
          font-size: 17px;
          line-height: 1.75;
        }

        .heroActions,
        .academyActions {
          margin-top: 30px;
          display: flex;
          gap: 13px;
          flex-wrap: wrap;
        }

        .primaryButton,
        .secondaryButton,
        .cardButton {
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

        .primaryButton,
        .cardButton {
          color: white;
          background: linear-gradient(135deg, #7c3aed, #5b21b6);
          box-shadow: 0 18px 40px rgba(91, 33, 182, 0.25);
        }

        .secondaryButton,
        .cardButton.secondary {
          color: #2d1c3e;
          background: white;
          border: 1px solid rgba(124, 58, 237, 0.14);
          box-shadow: 0 14px 32px rgba(52, 32, 75, 0.07);
        }

        .trustRow {
          margin-top: 25px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .trustRow span {
          padding: 9px 12px;
          border-radius: 999px;
          color: #65596f;
          background: rgba(255, 255, 255, 0.84);
          border: 1px solid rgba(124, 58, 237, 0.08);
          font-size: 12px;
          font-weight: 850;
        }

        .heroVisual {
          min-height: 520px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .learningCard,
        .floatingCard {
          border: 1px solid rgba(124, 58, 237, 0.1);
          background: rgba(255, 255, 255, 0.94);
          box-shadow: 0 26px 70px rgba(50, 29, 78, 0.15);
        }

        .mainLearningCard {
          width: min(440px, 100%);
          padding: 32px;
          border-radius: 34px;
          position: relative;
          z-index: 2;
        }

        .cardTop {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cardTop small {
          color: #6d28d9;
          font-weight: 900;
        }

        .cardIcon {
          width: 55px;
          height: 55px;
          display: grid;
          place-items: center;
          border-radius: 18px;
          background: #eee7ff;
          font-size: 28px;
        }

        .mainLearningCard h2 {
          margin: 24px 0 0;
          font-size: 36px;
          letter-spacing: -0.05em;
        }

        .mainLearningCard p {
          margin: 13px 0 0;
          color: #6c6275;
          line-height: 1.65;
        }

        .academyChips {
          margin-top: 22px;
          display: flex;
          gap: 9px;
          flex-wrap: wrap;
        }

        .academyChips span {
          padding: 9px 11px;
          border-radius: 12px;
          background: #f7f2ff;
          color: #4c1d95;
          font-size: 12px;
          font-weight: 900;
        }

        .mainLearningCard a {
          margin-top: 24px;
          display: inline-flex;
          color: #6d28d9;
          text-decoration: none;
          font-weight: 950;
        }

        .floatingCard {
          position: absolute;
          width: 220px;
          padding: 17px;
          border-radius: 20px;
          z-index: 3;
        }

        .floatingCard strong,
        .floatingCard span {
          display: block;
        }

        .floatingCard strong {
          color: #251536;
          font-size: 14px;
        }

        .floatingCard span {
          margin-top: 6px;
          color: #6d6275;
          font-size: 12px;
          line-height: 1.5;
        }

        .tutorCard {
          top: 20px;
          right: -10px;
        }

        .progressCard {
          left: -20px;
          bottom: 28px;
        }

        .pathSection,
        .academySection,
        .benefitSection,
        .journeySection,
        .familySection,
        .supportSection,
        .finalSection {
          margin-top: 82px;
        }

        .sectionHeading {
          max-width: 790px;
        }

        .sectionHeading.centered {
          text-align: center;
          margin-left: auto;
          margin-right: auto;
        }

        .sectionHeading > p,
        .eyebrow,
        .finalSection > p {
          margin: 0 0 10px;
          color: #6d28d9;
          font-size: 13px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .sectionHeading h2,
        .familySection h2,
        .supportSection h2,
        .finalSection h2 {
          font-size: clamp(35px, 4.5vw, 58px);
          line-height: 1.03;
        }

        .sectionHeading > span {
          display: block;
          margin-top: 17px;
          color: #6d6376;
          font-size: 16px;
          line-height: 1.7;
        }

        .pathGrid {
          margin-top: 28px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .pathCard {
          padding: 34px;
          border-radius: 34px;
          border: 1px solid rgba(124, 58, 237, 0.1);
          background: rgba(255, 255, 255, 0.92);
          box-shadow: 0 20px 55px rgba(54, 32, 82, 0.08);
        }

        .pathIcon {
          width: 60px;
          height: 60px;
          display: grid;
          place-items: center;
          margin-bottom: 22px;
          border-radius: 19px;
          background: #f0e8ff;
          font-size: 30px;
        }

        .pathCard h3 {
          margin: 0;
          font-size: 31px;
          letter-spacing: -0.045em;
        }

        .pathCard > p:not(.eyebrow) {
          margin: 14px 0 0;
          color: #6d6376;
          line-height: 1.7;
        }

        .pathCard ul {
          margin: 22px 0 0;
          padding: 0;
          list-style: none;
          display: grid;
          gap: 10px;
        }

        .pathCard li {
          color: #50445c;
          font-weight: 800;
        }

        .pathCard li::before {
          content: "✓";
          margin-right: 9px;
          color: #7c3aed;
        }

        .cardButton {
          width: 100%;
          margin-top: 26px;
        }

        .academyGrid {
          margin-top: 30px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .academyCard {
          min-height: 255px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-radius: 28px;
          color: #241535;
          text-decoration: none;
          border: 1px solid rgba(124, 58, 237, 0.09);
          background: rgba(255, 255, 255, 0.93);
          box-shadow: 0 18px 45px rgba(50, 29, 76, 0.07);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .academyCard:hover {
          transform: translateY(-4px);
          box-shadow: 0 25px 55px rgba(50, 29, 76, 0.12);
        }

        .academyIcon {
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          border-radius: 17px;
          font-size: 27px;
          background: #f3edff;
        }

        .academyCard h3 {
          margin: 21px 0 0;
          font-size: 22px;
          letter-spacing: -0.035em;
        }

        .academyCard p {
          margin: 9px 0 0;
          color: #6c6275;
          font-size: 14px;
          line-height: 1.6;
        }

        .academyCard strong {
          margin-top: 20px;
          color: #6d28d9;
          font-size: 13px;
        }

        .academyCard.blue .academyIcon {
          background: #dbeafe;
        }

        .academyCard.indigo .academyIcon {
          background: #e0e7ff;
        }

        .academyCard.purple .academyIcon {
          background: #ede9fe;
        }

        .academyCard.gold .academyIcon {
          background: #fef3c7;
        }

        .academyCard.red .academyIcon {
          background: #fee2e2;
        }

        .academyCard.sky .academyIcon {
          background: #e0f2fe;
        }

        .academyCard.orange .academyIcon {
          background: #ffedd5;
        }

        .academyCard.pink .academyIcon {
          background: #fce7f3;
        }

        .benefitGrid {
          margin-top: 28px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .benefitCard {
          padding: 27px;
          border-radius: 27px;
          border: 1px solid rgba(124, 58, 237, 0.1);
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 17px 42px rgba(49, 29, 75, 0.07);
        }

        .benefitCard > div {
          font-size: 30px;
        }

        .benefitCard h3 {
          margin: 18px 0 0;
          font-size: 21px;
        }

        .benefitCard p {
          margin: 11px 0 0;
          color: #6d6376;
          line-height: 1.65;
        }

        .journeyGrid {
          margin-top: 28px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
        }

        .journeyCard {
          padding: 25px;
          border-radius: 27px;
          border: 1px solid rgba(124, 58, 237, 0.1);
          background: rgba(255, 255, 255, 0.9);
        }

        .journeyCard > span {
          color: #7c3aed;
          font-size: 24px;
          font-weight: 950;
        }

        .journeyCard h3 {
          margin: 18px 0 0;
          font-size: 20px;
        }

        .journeyCard p {
          margin: 10px 0 0;
          color: #6c6275;
          line-height: 1.6;
        }

        .familySection {
          display: grid;
          grid-template-columns: 1fr 0.88fr;
          gap: 35px;
          align-items: center;
          padding: 42px;
          border-radius: 40px;
          border: 1px solid rgba(124, 58, 237, 0.1);
          background:
            radial-gradient(
              circle at top right,
              rgba(124, 58, 237, 0.13),
              transparent 35%
            ),
            rgba(255, 255, 255, 0.91);
          box-shadow: 0 25px 70px rgba(50, 29, 77, 0.1);
        }

        .familySection > div > span {
          display: block;
          margin-top: 18px;
          color: #6c6275;
          line-height: 1.75;
        }

        .familyChecks {
          margin: 24px 0;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 11px;
        }

        .familyChecks div {
          padding: 12px 14px;
          border-radius: 15px;
          background: white;
          border: 1px solid rgba(124, 58, 237, 0.08);
          color: #574a61;
          font-size: 13px;
          font-weight: 850;
        }

        .dashboardPreview {
          padding: 25px;
          border-radius: 29px;
          background: white;
          border: 1px solid rgba(124, 58, 237, 0.11);
          box-shadow: 0 22px 55px rgba(45, 26, 70, 0.12);
        }

        .previewHeader,
        .previewAcademy,
        .previewRows > div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
        }

        .previewHeader small,
        .previewHeader strong,
        .previewAcademy small,
        .previewAcademy strong,
        .previewRows span,
        .previewRows strong {
          display: block;
        }

        .previewHeader small {
          color: #84768f;
        }

        .previewHeader strong {
          margin-top: 3px;
          font-size: 18px;
        }

        .previewHeader > span {
          padding: 8px 11px;
          border-radius: 999px;
          color: #15803d;
          background: #dcfce7;
          font-size: 11px;
          font-weight: 900;
        }

        .previewAcademy {
          margin-top: 25px;
        }

        .previewAcademy > div {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .previewAcademy > div > span {
          width: 45px;
          height: 45px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: #ede9fe;
          font-size: 22px;
        }

        .previewAcademy small {
          margin-top: 3px;
          color: #7d7187;
        }

        .previewAcademy b {
          color: #6d28d9;
        }

        .progressTrack {
          height: 9px;
          margin-top: 16px;
          overflow: hidden;
          border-radius: 999px;
          background: #eee8f5;
        }

        .progressTrack i {
          display: block;
          width: 62%;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #7c3aed, #2563eb);
        }

        .previewRows {
          margin-top: 22px;
          display: grid;
          gap: 11px;
        }

        .previewRows > div {
          padding: 13px 0;
          border-top: 1px solid #eee8f4;
        }

        .previewRows span {
          color: #817488;
          font-size: 12px;
        }

        .previewRows strong {
          text-align: right;
          font-size: 13px;
        }

        .supportSection,
        .finalSection {
          padding: 40px;
          border-radius: 38px;
          border: 1px solid rgba(124, 58, 237, 0.1);
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 22px 55px rgba(50, 29, 77, 0.08);
        }

        .supportSection {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 28px;
        }

        .supportSection span,
        .finalSection > span {
          display: block;
          margin-top: 16px;
          color: #6c6275;
          font-size: 16px;
          line-height: 1.7;
        }

        .supportSection button {
          min-height: 56px;
          padding: 0 25px;
          border: 0;
          border-radius: 18px;
          color: white;
          background: linear-gradient(135deg, #7c3aed, #5b21b6);
          font-weight: 950;
          cursor: pointer;
        }

        .finalSection {
          text-align: center;
        }

        .finalSection h2 {
          max-width: 850px;
          margin-left: auto;
          margin-right: auto;
        }

        .finalSection > span {
          max-width: 720px;
          margin-left: auto;
          margin-right: auto;
        }

        .finalActions {
          justify-content: center;
        }

        @media (max-width: 1000px) {
          .hero {
            grid-template-columns: 1fr;
            padding: 28px;
          }

          .heroVisual {
            min-height: 470px;
          }

          .academyGrid,
          .benefitGrid,
          .journeyGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .familySection {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 720px) {
          .homePage {
            padding: 14px 10px 60px;
          }

          .hero {
            min-height: auto;
            padding: 24px 20px;
            border-radius: 30px;
          }

          .hero h1 {
            font-size: clamp(40px, 11vw, 54px);
          }

          .heroLead {
            font-size: 15.5px;
          }

          .heroActions,
          .academyActions {
            flex-direction: column;
          }

          .primaryButton,
          .secondaryButton {
            width: 100%;
          }

          .trustRow {
            display: grid;
          }

          .trustRow span {
            text-align: center;
            border-radius: 14px;
          }

          .heroVisual {
            min-height: auto;
            display: block;
            padding-top: 20px;
          }

          .mainLearningCard {
            width: 100%;
          }

          .floatingCard {
            position: static;
            width: 100%;
            margin-top: 12px;
          }

          .pathSection,
          .academySection,
          .benefitSection,
          .journeySection,
          .familySection,
          .supportSection,
          .finalSection {
            margin-top: 58px;
          }

          .pathGrid,
          .academyGrid,
          .benefitGrid,
          .journeyGrid,
          .familyChecks,
          .supportSection {
            grid-template-columns: 1fr;
          }

          .pathCard,
          .familySection,
          .supportSection,
          .finalSection {
            padding: 25px 20px;
            border-radius: 30px;
          }

          .sectionHeading h2,
          .familySection h2,
          .supportSection h2,
          .finalSection h2 {
            font-size: clamp(32px, 9vw, 43px);
          }

          .academyCard {
            min-height: 230px;
          }

          .previewRows > div {
            align-items: flex-start;
            flex-direction: column;
          }

          .previewRows strong {
            text-align: left;
          }

          .supportSection button {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}