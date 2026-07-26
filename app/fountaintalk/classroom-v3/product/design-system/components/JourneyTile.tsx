import type { ReactNode } from "react";
import { Progress } from "./Progress";

export function JourneyTile({ title, subtitle, progress, meta, children }: {
  title: string;
  subtitle: string;
  progress?: number;
  meta?: string;
  children?: ReactNode;
}) {
  return (
    <article className="fp-journey-tile">
      <div className="fp-journey-tile__art" aria-hidden="true"><span>{title.slice(0, 1)}</span></div>
      <div className="fp-journey-tile__body">
        <span className="fp-kicker">Journey</span>
        <h3>{title}</h3>
        <p>{subtitle}</p>
        {typeof progress === "number" ? <Progress value={progress} label={`${progress}% complete`} /> : null}
        {meta ? <span className="fp-meta">{meta}</span> : null}
        {children}
      </div>
    </article>
  );
}
