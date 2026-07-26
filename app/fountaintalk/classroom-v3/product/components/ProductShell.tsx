import type { ReactNode } from "react";
import Link from "next/link";

export function ProductShell({ children, active = "home" }: { children: ReactNode; active?: "home" | "academy" | "journey" | "profile" }) {
  return (
    <div className="fp-shell">
      <header className="fp-header">
        <Link href="/home" className="fp-brand" aria-label="FountainPrep home">FountainPrep</Link>
        <nav aria-label="Primary navigation" className="fp-nav">
          <Link data-active={active === "home"} href="/home">Home</Link>
          <Link data-active={active === "academy" || active === "journey"} href="/academies/bible">Explore</Link>
          <Link data-active={active === "profile"} href="/profile">Your journey</Link>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}

export function AyoNote({ children }: { children: ReactNode }) {
  return (
    <aside className="ayo-note" aria-label="Ayo says">
      <span className="ayo-avatar" aria-hidden="true">A</span>
      <p>{children}</p>
    </aside>
  );
}
