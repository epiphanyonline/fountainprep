import Link from "next/link";
import { ProductShell, AyoNote } from "../_components/ProductShell";

export default function HomePage() {
  return (
    <ProductShell active="home">
      <section className="hero-home section-pad">
        <p className="eyebrow">Welcome back</p>
        <h1>Ready to continue?</h1>
        <p className="hero-lede">David is waiting in the Valley of Elah.</p>
      </section>
      <section className="continue-panel section-pad" aria-labelledby="continue-title">
        <div className="continue-art" aria-hidden="true"><span>IV</span></div>
        <div className="continue-copy">
          <p className="eyebrow">Continue your journey</p>
          <h2 id="continue-title">David</h2>
          <p className="episode-title">The Valley</p>
          <p>Fear has stopped an army. A shepherd arrives with a different question.</p>
          <div className="progress-wrap wide" aria-label="34% complete">
            <div className="progress-track"><span style={{ width: "34%" }} /></div><span>34% complete</span>
          </div>
          <Link href="/classroom/david" className="primary-action">Continue <span aria-hidden="true">→</span></Link>
        </div>
      </section>
      <section className="section-pad narrow-section"><AyoNote>Yesterday, you noticed that courage often begins before anyone else can see it.</AyoNote></section>
      <section className="section-pad split-links">
        <Link href="/academy/bible" className="quiet-card"><span className="eyebrow">Explore</span><strong>Bible Academy</strong><span>Stories, people and ideas that continue to shape the world.</span></Link>
        <Link href="/profile" className="quiet-card"><span className="eyebrow">Your journey</span><strong>Reflections</strong><span>Return to the ideas that stayed with you.</span></Link>
      </section>
    </ProductShell>
  );
}
