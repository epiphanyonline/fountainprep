import Link from "next/link";

type Props = {
  title: string;
  description: string;
  icon: string;
  href: string;
  outcome: string;
};

export default function FPAcademyCard({
  title,
  description,
  icon,
  href,
  outcome,
}: Props) {
  return (
    <Link href={href} className="academyCard">
      <div className="top">
        <span className="icon">{icon}</span>
        <span className="arrow">↗</span>
      </div>

      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <strong>{outcome}</strong>

      <style jsx>{`
        .academyCard {
          min-height: 305px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 24px;
          padding: 28px;
          border: 1px solid var(--fp-border);
          border-radius: var(--fp-radius-lg);
          color: inherit;
          background: #fff;
          text-decoration: none;
          box-shadow: var(--fp-shadow-sm);
          transition:
            transform 160ms ease,
            box-shadow 160ms ease;
        }

        .academyCard:hover {
          transform: translateY(-4px);
          box-shadow: var(--fp-shadow-md);
        }

        .top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .icon {
          width: 55px;
          height: 55px;
          display: grid;
          place-items: center;
          border-radius: 18px;
          background: var(--fp-surface-soft);
          font-size: 25px;
        }

        .arrow {
          color: var(--fp-primary);
          font-size: 22px;
          font-weight: 950;
        }

        h3 {
          margin: 0;
          color: var(--fp-text);
          font-size: 25px;
          letter-spacing: -0.035em;
        }

        p {
          margin: 10px 0 0;
          color: var(--fp-muted);
          line-height: 1.65;
        }

        strong {
          color: var(--fp-primary-dark);
          font-size: 13px;
        }
      `}</style>
    </Link>
  );
}
