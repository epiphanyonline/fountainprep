"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

import { academyRegistry } from "./data/academyRegistry";

export default function LearnWithAyoHome() {
  return (
    <main className="learn-home">
      <div className="learn-shell">
        <header className="learn-topbar">
          <Link href="/" className="company-brand">
            Fountain <span>Prep</span>
          </Link>

          <nav aria-label="Learn navigation">
            <a href="#academies">Academies</a>
            <Link href="/fountaintalk/progress">My progress</Link>
          </nav>
        </header>

        <section className="learn-hero">
          <div className="hero-copy">
            <div className="product-chip">
              <i />
              A Fountain Prep learning experience
            </div>

            <p className="product-name">
              Learn with <strong>AYO</strong>
            </p>

            <h1>
              One learner.
              <span>Every possibility.</span>
            </h1>

            <p className="hero-description">
              Move from numbers to code, money to music, character to faith—all
              through structured lessons that adapt to the learner&apos;s stage.
            </p>

            <div className="hero-actions">
              <a href="#academies" className="hero-primary">
                Choose an academy
                <span>→</span>
              </a>
              <Link href="/fountaintalk/progress" className="hero-secondary">
                Continue learning
              </Link>
            </div>

            <div className="trust-row">
              <span>✓ Structured curriculum</span>
              <span>✓ Guided classrooms</span>
              <span>✓ Progress that follows you</span>
            </div>
          </div>

          <div className="hero-visual" aria-label="Learning academy map">
            <div className="visual-orbit orbit-large" />
            <div className="visual-orbit orbit-small" />
            <div className="visual-centre">
              <small>Your learning world</small>
              <strong>LEARN</strong>
              <span>Grow at your pace</span>
            </div>
            <div className="orbit-chip chip-maths">➗ <span>Maths</span></div>
            <div className="orbit-chip chip-code">💻 <span>Coding</span></div>
            <div className="orbit-chip chip-music">🎵 <span>Music</span></div>
            <div className="orbit-chip chip-wealth">💰 <span>Wealth</span></div>
            <div className="orbit-chip chip-values">⚖️ <span>Values</span></div>
          </div>
        </section>

        <section className="journey-strip">
          <div>
            <span>1</span>
            <section><strong>Choose</strong><small>Pick an academy</small></section>
          </div>
          <i />
          <div>
            <span>2</span>
            <section><strong>Enter</strong><small>Meet your tutor in class</small></section>
          </div>
          <i />
          <div>
            <span>3</span>
            <section><strong>Grow</strong><small>Save every step</small></section>
          </div>
        </section>

        <section id="academies" className="academy-section">
          <div className="section-heading">
            <div>
              <span>Choose your journey</span>
              <h2>Seven academies.<br />One learning life.</h2>
            </div>
            <p>
              Begin with one subject or explore them all. Each academy has its
              own teaching style while progress stays in one place.
            </p>
          </div>

          <div className="academy-grid">
            {academyRegistry.map((academy, index) => {
              const style = {
                "--card-accent": academy.accent,
                "--card-dark": academy.accentDark,
                "--card-soft": academy.soft,
              } as CSSProperties;

              return (
                <Link
                  href={academy.href}
                  key={academy.id}
                  className={`academy-card ${index === 0 ? "academy-wide" : ""}`}
                  style={style}
                >
                  <div className="academy-card-top">
                    <div className="academy-icon">{academy.icon}</div>
                    <span className="academy-live"><i /> Ready</span>
                  </div>
                  <div className="academy-card-copy">
                    <small>AYO Academy</small>
                    <h3>{academy.title}</h3>
                    <p>{academy.tagline}</p>
                  </div>
                  <div className="academy-card-footer">
                    <span>Enter classroom</span>
                    <strong>→</strong>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="age-section">
          <div className="age-copy">
            <span>Learning for every stage</span>
            <h2>Start with wonder.<br />Grow into mastery.</h2>
            <p>
              The same platform can support a first discovery, a school skill,
              a practical life lesson or a new adult ambition.
            </p>
            <Link href="/fountaintalk/classroom/mathematics">
              Start a foundation lesson <span>→</span>
            </Link>
          </div>

          <div className="age-stages">
            <article><span>03–05</span><div><strong>Early explorers</strong><p>Stories, sound, play and discovery</p></div></article>
            <article><span>06–09</span><div><strong>Young learners</strong><p>Confidence, creativity and foundations</p></div></article>
            <article><span>10–13</span><div><strong>Growing minds</strong><p>Skills, projects and independence</p></div></article>
            <article><span>14+</span><div><strong>Future ready</strong><p>Mastery, careers and practical life skills</p></div></article>
          </div>
        </section>

        <footer className="learn-footer">
          <div><strong>Learn with AYO</strong><span>Powered by Fountain Prep</span></div>
          <p>Premium, structured learning for every stage of life.</p>
        </footer>
      </div>

      <style jsx global>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        .learn-home {
          min-height: 100vh;
          color: #1f152c;
          background:
            radial-gradient(circle at 7% 4%, rgba(124,58,237,0.16), transparent 26%),
            radial-gradient(circle at 94% 12%, rgba(37,99,235,0.1), transparent 24%),
            linear-gradient(180deg, #fdfbff 0%, #f5f0fb 54%, #eee7f7 100%);
          overflow: hidden;
        }
        .learn-shell { width: min(1240px, 100%); margin: 0 auto; padding: 0 24px 60px; }
        .learn-topbar { min-height: 82px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
        .company-brand { color: #211532; font-size: 23px; font-weight: 950; letter-spacing: -0.045em; text-decoration: none; }
        .company-brand span { color: #7c3aed; }
        .learn-topbar nav { display: flex; align-items: center; gap: 8px; }
        .learn-topbar nav a { padding: 10px 14px; color: #584d62; background: rgba(255,255,255,0.64); border: 1px solid rgba(124,58,237,0.09); border-radius: 12px; text-decoration: none; font-size: 12px; font-weight: 850; }
        .learn-hero { min-height: 640px; display: grid; grid-template-columns: 1.05fr 0.95fr; align-items: center; gap: 40px; padding: 56px; border: 1px solid rgba(124,58,237,0.1); border-radius: 42px; background: linear-gradient(135deg, rgba(255,255,255,0.97), rgba(249,245,255,0.91)); box-shadow: 0 32px 100px rgba(54,31,85,0.13); position: relative; overflow: hidden; }
        .learn-hero::before { content: ""; position: absolute; width: 430px; height: 430px; right: -170px; top: -190px; border-radius: 50%; background: rgba(124,58,237,0.08); }
        .hero-copy,
        .hero-visual { position: relative; z-index: 1; }
        .product-chip { width: fit-content; display: flex; align-items: center; gap: 10px; padding: 9px 14px; color: #6d28d9; background: #f1e8ff; border-radius: 999px; font-size: 11px; font-weight: 900; }
        .product-chip i { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 0 5px rgba(34,197,94,0.12); }
        .product-name { margin: 24px 0 0; color: #655a70; font-size: 15px; font-weight: 750; }
        .product-name strong { color: #7c3aed; letter-spacing: 0.06em; }
        .hero-copy h1 { margin: 10px 0 0; font-size: clamp(54px, 6vw, 82px); line-height: 0.94; letter-spacing: -0.068em; font-weight: 950; }
        .hero-copy h1 span { display: block; color: #7c3aed; }
        .hero-description { max-width: 610px; margin: 24px 0 0; color: #6e6477; font-size: 16px; line-height: 1.72; }
        .hero-actions { margin-top: 29px; display: flex; gap: 11px; flex-wrap: wrap; }
        .hero-actions a { min-height: 55px; padding: 0 22px; display: inline-flex; align-items: center; justify-content: center; gap: 26px; border-radius: 17px; text-decoration: none; font-size: 13px; font-weight: 950; transition: transform 0.2s ease; }
        .hero-actions a:hover { transform: translateY(-2px); }
        .hero-primary { color: white; background: linear-gradient(135deg,#7c3aed,#5b21b6); box-shadow: 0 17px 38px rgba(91,33,182,0.28); }
        .hero-secondary { color: #33243f; background: white; border: 1px solid rgba(124,58,237,0.13); box-shadow: 0 13px 28px rgba(54,36,81,0.06); }
        .trust-row { margin-top: 26px; display: flex; flex-wrap: wrap; gap: 10px; }
        .trust-row span { color: #6d6276; font-size: 11px; font-weight: 800; }
        .hero-visual { min-height: 480px; display: grid; place-items: center; }
        .visual-orbit { position: absolute; border: 1px solid rgba(124,58,237,0.15); border-radius: 50%; }
        .orbit-large { width: 445px; height: 445px; }
        .orbit-small { width: 310px; height: 310px; }
        .visual-centre { width: 235px; height: 235px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; background: radial-gradient(circle at 35% 25%, #9f7aea, #5b21b6 58%, #3b0764); border: 10px solid rgba(255,255,255,0.78); border-radius: 50%; box-shadow: 0 30px 70px rgba(76,29,149,0.3); position: relative; z-index: 2; }
        .visual-centre small { color: rgba(255,255,255,0.7); font-size: 9px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; }
        .visual-centre strong { margin-top: 6px; font-size: 45px; letter-spacing: 0.05em; }
        .visual-centre span { margin-top: 4px; color: rgba(255,255,255,0.74); font-size: 11px; font-weight: 750; }
        .orbit-chip { position: absolute; z-index: 3; min-width: 90px; padding: 11px 13px; display: flex; align-items: center; gap: 7px; background: rgba(255,255,255,0.92); border: 1px solid rgba(255,255,255,0.9); border-radius: 15px; box-shadow: 0 16px 35px rgba(48,28,75,0.14); backdrop-filter: blur(14px); font-size: 18px; }
        .orbit-chip span { color: #473a52; font-size: 10px; font-weight: 850; }
        .chip-maths { left: 4px; top: 95px; }
        .chip-code { right: 0; top: 70px; }
        .chip-music { right: -12px; bottom: 95px; }
        .chip-wealth { left: 18px; bottom: 65px; }
        .chip-values { left: 50%; top: 13px; transform: translateX(-50%); }
        .journey-strip { margin-top: 20px; padding: 18px 25px; display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; align-items: center; gap: 20px; border: 1px solid rgba(124,58,237,0.09); border-radius: 24px; background: rgba(255,255,255,0.82); box-shadow: 0 16px 45px rgba(55,35,95,0.07); }
        .journey-strip > div { display: flex; align-items: center; justify-content: center; gap: 11px; }
        .journey-strip > div > span { width: 35px; height: 35px; display: grid; place-items: center; color: #7c3aed; background: #f1e8ff; border-radius: 11px; font-weight: 950; }
        .journey-strip section strong,
        .journey-strip section small { display: block; }
        .journey-strip section strong { font-size: 12px; }
        .journey-strip section small { margin-top: 2px; color: #84798c; font-size: 10px; }
        .journey-strip > i { width: 36px; height: 1px; background: #ddd3e6; }
        .academy-section { padding-top: 92px; }
        .section-heading { display: grid; grid-template-columns: 1fr 0.68fr; align-items: end; gap: 42px; }
        .section-heading > div > span,
        .age-copy > span { color: #7c3aed; font-size: 11px; font-weight: 950; letter-spacing: 0.1em; text-transform: uppercase; }
        .section-heading h2,
        .age-copy h2 { margin: 9px 0 0; font-size: clamp(39px,5vw,62px); line-height: 0.98; letter-spacing: -0.058em; }
        .section-heading > p { margin: 0; color: #706579; line-height: 1.72; }
        .academy-grid { margin-top: 30px; display: grid; grid-template-columns: repeat(3,1fr); gap: 17px; }
        .academy-card { min-height: 300px; padding: 23px; display: flex; flex-direction: column; justify-content: space-between; color: white; background: linear-gradient(145deg,var(--card-accent),var(--card-dark)); border: 1px solid rgba(255,255,255,0.2); border-radius: 29px; box-shadow: 0 20px 55px color-mix(in srgb,var(--card-dark) 18%,transparent); text-decoration: none; position: relative; overflow: hidden; transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .academy-card::after { content: ""; position: absolute; width: 190px; height: 190px; right: -80px; bottom: -90px; border-radius: 50%; background: rgba(255,255,255,0.1); }
        .academy-card:hover { transform: translateY(-5px); box-shadow: 0 28px 65px color-mix(in srgb,var(--card-dark) 25%,transparent); }
        .academy-wide { grid-column: span 2; }
        .academy-card-top { display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 1; }
        .academy-icon { width: 56px; height: 56px; display: grid; place-items: center; background: rgba(255,255,255,0.16); border-radius: 18px; font-size: 28px; }
        .academy-live { display: flex; align-items: center; gap: 6px; padding: 7px 10px; background: rgba(255,255,255,0.15); border-radius: 999px; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.07em; }
        .academy-live i { width: 6px; height: 6px; background: #86efac; border-radius: 50%; }
        .academy-card-copy { margin-top: 35px; position: relative; z-index: 1; }
        .academy-card-copy small { color: rgba(255,255,255,0.64); font-size: 9px; font-weight: 900; letter-spacing: 0.09em; text-transform: uppercase; }
        .academy-card-copy h3 { margin: 7px 0 0; font-size: 25px; letter-spacing: -0.04em; }
        .academy-card-copy p { max-width: 430px; margin: 10px 0 0; color: rgba(255,255,255,0.73); font-size: 12.5px; line-height: 1.62; }
        .academy-card-footer { margin-top: 28px; display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 1; }
        .academy-card-footer span { font-size: 11px; font-weight: 900; }
        .academy-card-footer strong { width: 34px; height: 34px; display: grid; place-items: center; color: var(--card-dark); background: white; border-radius: 50%; }
        .age-section { margin-top: 95px; padding: 55px; display: grid; grid-template-columns: 0.85fr 1.15fr; gap: 60px; align-items: center; color: white; background: linear-gradient(145deg,#241432,#42185c); border-radius: 38px; box-shadow: 0 28px 75px rgba(41,20,57,0.2); position: relative; overflow: hidden; }
        .age-section::after { content: ""; position: absolute; width: 360px; height: 360px; right: -140px; top: -160px; border-radius: 50%; background: rgba(255,255,255,0.05); }
        .age-copy { position: relative; z-index: 1; }
        .age-copy > span { color: #d8b4fe; }
        .age-copy h2 { color: white; }
        .age-copy p { margin: 18px 0 0; color: rgba(255,255,255,0.68); line-height: 1.7; }
        .age-copy a { min-height: 50px; margin-top: 23px; padding: 0 17px; display: inline-flex; align-items: center; gap: 25px; color: #2e173b; background: white; border-radius: 14px; text-decoration: none; font-size: 11px; font-weight: 950; }
        .age-stages { display: grid; gap: 10px; position: relative; z-index: 1; }
        .age-stages article { padding: 16px; display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 14px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.09); border-radius: 17px; }
        .age-stages article > span { min-width: 59px; color: #e9d5ff; font-size: 12px; font-weight: 950; letter-spacing: 0.05em; }
        .age-stages strong,
        .age-stages p { display: block; }
        .age-stages strong { font-size: 13px; }
        .age-stages p { margin: 3px 0 0; color: rgba(255,255,255,0.61); font-size: 10.5px; }
        .learn-footer { margin-top: 60px; padding: 26px 5px 0; display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; border-top: 1px solid rgba(75,54,96,0.12); }
        .learn-footer strong,
        .learn-footer span { display: block; }
        .learn-footer strong { font-size: 17px; }
        .learn-footer span { margin-top: 4px; color: #8b8192; font-size: 10px; }
        .learn-footer p { margin: 0; color: #84798c; font-size: 11px; }
        @media (max-width: 980px) {
          .learn-hero { grid-template-columns: 1fr; padding: 45px; }
          .hero-copy { text-align: center; }
          .product-chip { margin: 0 auto; }
          .hero-description { margin-left: auto; margin-right: auto; }
          .hero-actions,
          .trust-row { justify-content: center; }
          .hero-visual { min-height: 430px; }
          .section-heading { grid-template-columns: 1fr; gap: 18px; }
          .academy-grid { grid-template-columns: repeat(2,1fr); }
          .academy-wide { grid-column: span 2; }
          .age-section { grid-template-columns: 1fr; }
        }
        @media (max-width: 650px) {
          .learn-shell { padding: 0 13px 40px; }
          .learn-topbar { min-height: 70px; }
          .learn-topbar nav a:first-child { display: none; }
          .learn-hero { min-height: auto; padding: 38px 19px 30px; border-radius: 27px; }
          .hero-copy h1 { font-size: 51px; }
          .hero-description { font-size: 14px; }
          .hero-actions a { width: 100%; }
          .hero-visual { min-height: 355px; transform: scale(0.82); margin: -25px -40px; }
          .journey-strip { grid-template-columns: 1fr; gap: 10px; }
          .journey-strip > i { display: none; }
          .journey-strip > div { justify-content: flex-start; }
          .academy-section { padding-top: 70px; }
          .academy-grid { grid-template-columns: 1fr; }
          .academy-wide { grid-column: auto; }
          .academy-card { min-height: 275px; }
          .age-section { margin-top: 70px; padding: 31px 20px; border-radius: 28px; }
          .learn-footer { align-items: flex-start; flex-direction: column; }
        }
      `}</style>
    </main>
  );
}

