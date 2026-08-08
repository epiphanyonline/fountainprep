import FPButton from "./FPButton";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  outcomes: string[];
  href: string;
  action: string;
  icon: string;
  variant?: "primary" | "secondary";
};

export default function FPLearningPathCard({
  eyebrow,
  title,
  description,
  outcomes,
  href,
  action,
  icon,
  variant = "primary",
}: Props) {
  return (
    <article className={`pathCard ${variant}`}>
      <div className="icon">{icon}</div>
      <p className="fp-kicker">{eyebrow}</p>
      <h3>{title}</h3>
      <p className="description">{description}</p>

      <ul>
        {outcomes.map((outcome) => (
          <li key={outcome}>
            <span>✓</span>
            {outcome}
          </li>
        ))}
      </ul>

      <FPButton
        href={href}
        variant={
          variant === "primary"
            ? "primary"
            : "secondary"
        }
      >
        {action}
      </FPButton>

      <style jsx>{`
        .pathCard {
          min-height: 510px;
          display: flex;
          flex-direction: column;
          padding: 34px;
          border: 1px solid var(--fp-border);
          border-radius: var(--fp-radius-xl);
          background: #fff;
          box-shadow: var(--fp-shadow-md);
        }

        .pathCard.primary {
          background:
            radial-gradient(
              circle at 90% 0%,
              rgba(124, 58, 237, 0.15),
              transparent 34%
            ),
            #fff;
        }

        .pathCard.secondary {
          background:
            radial-gradient(
              circle at 90% 0%,
              rgba(37, 99, 235, 0.11),
              transparent 34%
            ),
            #fff;
        }

        .icon {
          width: 62px;
          height: 62px;
          display: grid;
          place-items: center;
          margin-bottom: 28px;
          border-radius: 20px;
          background: var(--fp-surface-soft);
          font-size: 29px;
        }

        h3 {
          margin: 12px 0 0;
          color: var(--fp-text);
          font-size: clamp(30px, 4vw, 43px);
          line-height: 1;
          letter-spacing: -0.045em;
        }

        .description {
          margin: 18px 0 0;
          color: var(--fp-muted);
          line-height: 1.7;
        }

        ul {
          display: grid;
          gap: 11px;
          margin: 24px 0 30px;
          padding: 0;
          list-style: none;
        }

        li {
          display: flex;
          gap: 10px;
          color: #514658;
          font-weight: 750;
        }

        li span {
          color: var(--fp-primary);
          font-weight: 950;
        }

        .pathCard :global(.fp-button) {
          width: 100%;
          margin-top: auto;
        }
      `}</style>
    </article>
  );
}
