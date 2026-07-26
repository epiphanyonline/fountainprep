import type { ReactNode } from "react";

export function EpisodeRow({ number, title, subtitle, state = "available", action }: {
  number: number;
  title: string;
  subtitle: string;
  state?: "available" | "complete" | "locked";
  action?: ReactNode;
}) {
  return (
    <article className="fp-episode-row" data-state={state}>
      <span className="fp-episode-row__number">{String(number).padStart(2, "0")}</span>
      <div><h3>{title}</h3><p>{subtitle}</p></div>
      <div className="fp-episode-row__action">{action ?? <span>{state === "complete" ? "Complete" : state === "locked" ? "Locked" : "Begin"}</span>}</div>
    </article>
  );
}
