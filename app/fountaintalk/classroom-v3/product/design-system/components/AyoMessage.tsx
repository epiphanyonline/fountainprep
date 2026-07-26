import type { ReactNode } from "react";

export function AyoMessage({ children, compact = false }: { children: ReactNode; compact?: boolean }) {
  return (
    <aside className="fp-ayo" data-compact={compact} aria-label="Ayo says">
      <span className="fp-ayo__avatar" aria-hidden="true">A</span>
      <div><span className="fp-ayo__name">Ayo</span><p>{children}</p></div>
    </aside>
  );
}
