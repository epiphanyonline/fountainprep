"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { academyRegistry } from "../data/academyRegistry";
import { getStarterCourse } from "../data/starterCurricula";
import type {
  AcademyProgress,
  NonLanguageAcademyId,
} from "../types/academy";

type ProgressCard = {
  academyId: NonLanguageAcademyId;
  progress: AcademyProgress | null;
  totalSteps: number;
};

export default function ProgressPage() {
  const [cards, setCards] = useState<ProgressCard[]>([]);

  useEffect(() => {
    const loaded = academyRegistry
      .filter(
        (academy): academy is typeof academy & {
          id: NonLanguageAcademyId;
        } => academy.id !== "languages"
      )
      .map((academy) => {
        const course = getStarterCourse(academy.id);
        const totalSteps = course.units.reduce(
          (unitTotal, unit) =>
            unitTotal +
            unit.lessons.reduce(
              (lessonTotal, lesson) => lessonTotal + lesson.steps.length,
              0
            ),
          0
        );
        const key = `learn-with-ayo:progress:${academy.id}:demo-learner`;
        let progress: AcademyProgress | null = null;

        try {
          const saved = window.localStorage.getItem(key);
          progress = saved ? (JSON.parse(saved) as AcademyProgress) : null;
        } catch {
          progress = null;
        }

        return { academyId: academy.id, progress, totalSteps };
      });

    setCards(loaded);
  }, []);

  const totalPoints = cards.reduce(
    (total, card) => total + (card.progress?.points ?? 0),
    0
  );
  const completedCourses = cards.filter(
    (card) => card.progress?.completedAt
  ).length;
  const activeCourses = cards.filter(
    (card) => card.progress && !card.progress.completedAt
  ).length;

  return (
    <main className="progress-page">
      <div className="progress-shell">
        <header className="progress-topbar">
          <Link href="/fountaintalk">← Academies</Link>
          <div>
            <strong>Learn with AYO</strong>
            <span>Powered by Fountain Prep</span>
          </div>
        </header>

        <section className="progress-hero">
          <span>Your learning journey</span>
          <h1>Small steps.<br />Visible progress.</h1>
          <p>
            Continue from where you stopped, collect points and grow across
            every AYO Academy.
          </p>
        </section>

        <section className="progress-stats">
          <div><strong>{totalPoints}</strong><span>Total points</span></div>
          <div><strong>{activeCourses}</strong><span>Active courses</span></div>
          <div><strong>{completedCourses}</strong><span>Courses completed</span></div>
        </section>

        <section className="progress-courses">
          <div className="progress-heading">
            <span>Your academies</span>
            <h2>Continue learning</h2>
          </div>

          <div className="progress-grid">
            {cards.map((card) => {
              const academy = academyRegistry.find(
                (candidate) => candidate.id === card.academyId
              )!;
              const course = getStarterCourse(card.academyId);
              const completedSteps =
                card.progress?.completedStepIds.length ?? 0;
              const percentage = Math.min(
                100,
                Math.round((completedSteps / card.totalSteps) * 100)
              );

              return (
                <article key={academy.id} className="progress-card">
                  <div
                    className="progress-card-icon"
                    style={{ background: academy.soft }}
                  >
                    {academy.icon}
                  </div>
                  <span>{academy.title}</span>
                  <h3>{course.title}</h3>
                  <p>
                    {card.progress
                      ? card.progress.completedAt
                        ? "Foundation course completed"
                        : "Your latest progress is saved"
                      : "Ready when you are"}
                  </p>

                  <div className="card-progress-copy">
                    <span>Progress</span>
                    <strong>{percentage}%</strong>
                  </div>
                  <div className="card-progress-track">
                    <div
                      style={{
                        width: `${percentage}%`,
                        background: academy.accent,
                      }}
                    />
                  </div>

                  <Link
                    href={academy.href}
                    style={{ background: academy.accentDark }}
                  >
                    {card.progress ? "Continue course" : "Start course"}
                    <span>→</span>
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      </div>

      <style jsx global>{`
        * { box-sizing: border-box; }
        .progress-page {
          min-height: 100vh;
          color: #21172f;
          background:
            radial-gradient(circle at 8% 5%, rgba(124,58,237,0.15), transparent 25%),
            radial-gradient(circle at 92% 8%, rgba(37,99,235,0.11), transparent 24%),
            linear-gradient(180deg, #fdfbff, #f3eef9);
        }
        .progress-shell { width: min(1180px, 100%); margin: 0 auto; padding: 0 24px 70px; }
        .progress-topbar { min-height: 78px; display: flex; align-items: center; justify-content: space-between; }
        .progress-topbar > a { color: #51465c; text-decoration: none; font-size: 13px; font-weight: 850; }
        .progress-topbar > div { text-align: right; }
        .progress-topbar strong,
        .progress-topbar span { display: block; }
        .progress-topbar strong { font-size: 14px; }
        .progress-topbar span { margin-top: 2px; color: #8b8194; font-size: 9px; }
        .progress-hero { padding: 62px 8px 42px; }
        .progress-hero > span,
        .progress-heading > span { color: #7c3aed; font-size: 11px; font-weight: 950; letter-spacing: 0.1em; text-transform: uppercase; }
        .progress-hero h1 { margin: 12px 0 0; font-size: clamp(47px, 7vw, 78px); line-height: 0.94; letter-spacing: -0.065em; }
        .progress-hero p { max-width: 590px; margin: 22px 0 0; color: #716779; line-height: 1.7; }
        .progress-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .progress-stats div { padding: 22px; background: rgba(255,255,255,0.84); border: 1px solid rgba(78,54,104,0.1); border-radius: 22px; box-shadow: 0 16px 45px rgba(52,35,76,0.07); }
        .progress-stats strong,
        .progress-stats span { display: block; }
        .progress-stats strong { font-size: 30px; letter-spacing: -0.04em; }
        .progress-stats span { margin-top: 4px; color: #83798b; font-size: 11px; font-weight: 750; }
        .progress-courses { margin-top: 70px; }
        .progress-heading h2 { margin: 8px 0 0; font-size: clamp(35px, 5vw, 54px); letter-spacing: -0.055em; }
        .progress-grid { margin-top: 24px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .progress-card { padding: 23px; border: 1px solid rgba(70,49,94,0.1); border-radius: 27px; background: rgba(255,255,255,0.9); box-shadow: 0 18px 50px rgba(52,34,78,0.08); }
        .progress-card-icon { width: 54px; height: 54px; display: grid; place-items: center; border-radius: 17px; font-size: 27px; }
        .progress-card > span { display: block; margin-top: 18px; color: #7c3aed; font-size: 9.5px; font-weight: 950; letter-spacing: 0.08em; text-transform: uppercase; }
        .progress-card h3 { margin: 6px 0 0; font-size: 21px; letter-spacing: -0.035em; }
        .progress-card > p { min-height: 38px; margin: 8px 0 0; color: #7d7385; font-size: 11.5px; line-height: 1.5; }
        .card-progress-copy { margin-top: 18px; display: flex; justify-content: space-between; color: #817689; font-size: 10px; font-weight: 800; }
        .card-progress-copy strong { color: #3c3246; }
        .card-progress-track { height: 7px; margin-top: 8px; background: #ece7ef; border-radius: 999px; overflow: hidden; }
        .card-progress-track div { height: 100%; border-radius: inherit; }
        .progress-card > a { min-height: 45px; margin-top: 20px; padding: 0 14px; display: flex; align-items: center; justify-content: space-between; color: white; border-radius: 13px; text-decoration: none; font-size: 11px; font-weight: 900; }
        @media (max-width: 820px) { .progress-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) {
          .progress-shell { padding: 0 13px 45px; }
          .progress-hero { padding-top: 42px; }
          .progress-stats { grid-template-columns: 1fr; gap: 9px; }
          .progress-stats div { padding: 16px 18px; display: flex; align-items: center; justify-content: space-between; }
          .progress-stats span { margin: 0; }
          .progress-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}

