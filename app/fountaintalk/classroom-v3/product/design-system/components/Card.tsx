import type { HTMLAttributes, ReactNode } from "react";

export function Card({ children, className = "", ...props }: HTMLAttributes<HTMLElement> & { children: ReactNode }) {
  return <article className={`fp-card ${className}`.trim()} {...props}>{children}</article>;
}
