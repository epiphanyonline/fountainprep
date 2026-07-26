import { ProductShell, AyoNote } from "../../_components/ProductShell";
import { JourneyCard } from "../../_components/JourneyCard";
import { bibleJourneys } from "../../_content/product-content";

export default function BibleAcademyPage() {
  return (
    <ProductShell active="academy">
      <header className="academy-hero section-pad">
        <p className="eyebrow">Academy</p>
        <h1>Bible</h1>
        <p>Enter the stories slowly. Notice the people, the choices and the ideas that still speak today.</p>
      </header>
      <section className="section-pad narrow-section"><AyoNote>Let&apos;s continue with David. The valley will make more sense when we remember the field.</AyoNote></section>
      <section className="section-pad" aria-labelledby="journeys-heading">
        <div className="section-heading"><div><p className="eyebrow">Explore</p><h2 id="journeys-heading">Journeys</h2></div><p>One story at a time.</p></div>
        <div className="journey-grid">{bibleJourneys.map((journey) => <JourneyCard key={journey.id} {...journey} />)}</div>
      </section>
    </ProductShell>
  );
}
