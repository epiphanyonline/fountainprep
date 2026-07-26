import type { ReactNode } from "react";

type PageProps = {
  children: ReactNode;
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  width?: "default" | "wide";
};

export default function Page({
  children,
  eyebrow,
  title,
  description,
  actions,
  width = "default",
}: PageProps) {
  const containerClassName =
    width === "wide"
      ? "fp-container fp-page-container-wide"
      : "fp-container";

  return (
    <div className="fp-page">
      <div className={containerClassName}>
        <header className="fp-page-header">
          <div className="fp-page-heading">
            {eyebrow ? <p className="fp-eyebrow">{eyebrow}</p> : null}

            <h1 className="fp-page-title">{title}</h1>

            {description ? (
              <p className="fp-page-description">{description}</p>
            ) : null}
          </div>

          {actions ? (
            <div className="fp-page-actions">{actions}</div>
          ) : null}
        </header>

        <div className="fp-page-content">{children}</div>
      </div>
    </div>
  );
}