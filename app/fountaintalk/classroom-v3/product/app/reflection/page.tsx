"use client";
import Link from "next/link";
import { useState } from "react";

export default function ReflectionPage() {
  const [reflection, setReflection] = useState("");
  const saved = reflection.trim().length > 2;
  return (
    <main className="reflection-page">
      <section className="reflection-card">
        <div className="ayo-avatar large" aria-hidden="true">A</div>
        <p className="eyebrow">Before we finish</p>
        <h1>What stayed with you today?</h1>
        <p>There is no perfect answer. Write the thought you want to remember.</p>
        <label className="sr-only" htmlFor="reflection">Your reflection</label>
        <textarea id="reflection" value={reflection} onChange={(event) => setReflection(event.target.value)} placeholder="I noticed that…" rows={6} />
        <div className="reflection-actions"><Link href="/home" className="text-action">Skip for now</Link><Link aria-disabled={!saved} className="primary-action" href={saved ? "/home" : "#"}>Save reflection <span aria-hidden="true">→</span></Link></div>
      </section>
    </main>
  );
}
