import type { CSSProperties, ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  footer?: ReactNode;
  padding?: "sm" | "md" | "lg";
  className?: string;
  style?: CSSProperties;
};

const paddingMap = {
  sm: "1rem",
  md: "1.5rem",
  lg: "2rem",
};

export default function Card({
  children,
  title,
  description,
  footer,
  padding = "md",
  className = "",
  style,
}: CardProps) {
  return (
    <article
      className={`fp-card ${className}`.trim()}
      style={{
        padding: paddingMap[padding],
        ...style,
      }}
    >
      {(title || description) && (
        <header style={{ marginBottom: "1.5rem" }}>
          {title && (
            <h3
              style={{
                margin: 0,
                fontSize: "1.25rem",
              }}
            >
              {title}
            </h3>
          )}

          {description && (
            <p
              className="fp-muted"
              style={{
                marginTop: ".5rem",
                marginBottom: 0,
              }}
            >
              {description}
            </p>
          )}
        </header>
      )}

      <div>{children}</div>

      {footer && (
        <footer
          style={{
            marginTop: "2rem",
          }}
        >
          {footer}
        </footer>
      )}
    </article>
  );
}