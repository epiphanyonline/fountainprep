import Link from "next/link";

export function JourneyCard({ id, title, theme, progress, available }: { id: string; title: string; theme: string; progress: number; available: boolean }) {
  const body = (
    <article className="journey-card" data-muted={!available}>
      <div>
        <p className="eyebrow">Journey</p>
        <h3>{title}</h3>
        <p>{theme}</p>
      </div>
      {available ? (
        <div className="progress-wrap" aria-label={`${progress}% complete`}>
          <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
          <span>{progress > 0 ? `${progress}% complete` : "Begin"}</span>
        </div>
      ) : <span className="status-pill">Coming soon</span>}
    </article>
  );
  return available ? <Link className="journey-card-link" href={`/journeys/${id}`}>{body}</Link> : body;
}
