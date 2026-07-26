"use client";

import Link from "next/link";
import { useState } from "react";

const choices = ["Fear", "Lack of weapons", "Distance"];

export default function DavidClassroomPage() {
  const [answer, setAnswer] = useState<string | null>(null);
  return (
    <main className="classroom-page">
      <header className="classroom-header"><Link href="/journeys/david" aria-label="Leave classroom">←</Link><span>David · The Valley</span><span>34%</span></header>
      <section className="classroom-stage" aria-labelledby="scene-title">
        <div className="stage-vignette" aria-hidden="true" />
        <div className="scene-copy"><p className="eyebrow">Chapter 7 · Fear in the Valley</p><h1 id="scene-title">Strength made useless</h1><p>Observe the soldiers. Fear has not removed their weapons; it has made them unable to use what they already possess.</p></div>
        <div className="classroom-interaction">
          <div className="ayo-avatar large" aria-hidden="true">A</div>
          <div><p className="ayo-label">Ayo</p><h2>What seems to control the army?</h2>
            <div className="choice-list">{choices.map((choice) => <button key={choice} type="button" data-selected={answer === choice} onClick={() => setAnswer(choice)}>{choice}</button>)}</div>
            {answer && <div className="tutor-response" role="status">{answer === "Fear" ? "Yes. Their ability is still there, but fear has taken control of their next move." : "Look once more. The soldiers have weapons and the valley is open—but something inside them has stopped movement."}<Link href="/reflection">Continue →</Link></div>}
          </div>
        </div>
      </section>
    </main>
  );
}
