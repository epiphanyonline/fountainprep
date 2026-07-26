import Link from "next/link";
import { ProductShell } from "../../../components/ProductShell";
import { davidEpisodes } from "../../../content/product-content";

export default function DavidJourneyPage() {
  return (
    <ProductShell active="journey">
      <header className="david-hero section-pad">
        <div className="david-mark" aria-hidden="true">D</div>
        <div><p className="eyebrow">Bible journey</p><h1>David</h1><p className="hero-lede">Courage begins long before victory.</p><p>Follow David from the quiet fields of Bethlehem to the valley, the palace and the choices that shaped his legacy.</p><Link href="/journeys/david/classroom" className="primary-action">Continue journey <span aria-hidden="true">→</span></Link></div>
      </header>
      <section className="section-pad" aria-labelledby="episodes-title">
        <div className="section-heading"><div><p className="eyebrow">The story</p><h2 id="episodes-title">Six episodes</h2></div><p>About 1 hour 54 minutes</p></div>
        <ol className="episode-list">{davidEpisodes.map((episode) => (
          <li key={episode.id} data-muted={episode.status === "coming-soon"}>
            <span className="episode-number">{String(episode.number).padStart(2, "0")}</span>
            <div><h3>{episode.title}</h3><p className="episode-subtitle">{episode.subtitle}</p><p>{episode.description}</p></div>
            <div className="episode-meta"><span>{episode.durationMinutes} min</span>{episode.status === "available" ? <Link href="/journeys/david/classroom" aria-label={`Open ${episode.title}`}>Open →</Link> : <span>Coming soon</span>}</div>
          </li>
        ))}</ol>
      </section>
    </ProductShell>
  );
}
