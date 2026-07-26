import Link from "next/link";

export default function WelcomePage() {
  return (
    <main className="welcome-page">
      <div className="welcome-glow" aria-hidden="true" />
      <section className="welcome-panel">
        <p className="eyebrow">FountainPrep</p>
        <h1>Good to see you.</h1>
        <div className="welcome-copy">
          <p>I&apos;m Ayo.</p>
          <p>I&apos;ll be your tutor.</p>
        </div>
        <Link href="/home" className="primary-action">Let&apos;s begin <span aria-hidden="true">→</span></Link>
      </section>
    </main>
  );
}
