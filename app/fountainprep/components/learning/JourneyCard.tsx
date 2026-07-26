import Link from "next/link";
import type { Journey } from "../../content/types";

type JourneyCardProps = {
  journey: Journey;
  academyTitle: string;
  progress?: number;
  status?: "new" | "in-progress" | "complete";
};

const statusLabels = {
  new: "New journey",
  "in-progress": "Continue journey",
  complete: "Completed",
};

export default function JourneyCard({
  journey,
  academyTitle,
  progress = 0,
  status = "new",
}: JourneyCardProps) {
  const safeProgress = Math.min(100, Math.max(0, progress));

  return (
    <article className="fp-journey-card">
      <div className="fp-journey-card-header">
        <p className="fp-eyebrow">{academyTitle}</p>

        <span className="fp-journey-status">
          {statusLabels[status]}
        </span>
      </div>

      <div>
        <h3 className="fp-journey-card-title">
          {journey.title}
        </h3>

        <p className="fp-journey-card-description">
          {journey.description}
        </p>
      </div>

      <div className="fp-journey-card-footer">
        <div
          className="fp-progress"
          aria-label={`${safeProgress}% complete`}
        >
          <div
            className="fp-progress-bar"
            style={{ width: `${safeProgress}%` }}
          />
        </div>

        <div className="fp-journey-card-actions">
          <span className="fp-muted">
            {safeProgress}% complete
          </span>

          <Link
            href={`/fountainprep/journey/${journey.slug}`}
            className="fp-button fp-button-primary"
          >
            {status === "complete" ? "Review" : "Open"}
          </Link>
        </div>
      </div>
    </article>
  );
}