type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  centered?: boolean;
};

export default function FPSectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
}: Props) {
  return (
    <div
      className={
        centered
          ? "fpSectionHeading centered"
          : "fpSectionHeading"
      }
    >
      <p className="fp-kicker">{eyebrow}</p>
      <h2 className="fp-heading">{title}</h2>

      {description ? <p>{description}</p> : null}

      <style jsx>{`
        .fpSectionHeading {
          max-width: 790px;
        }

        .fpSectionHeading.centered {
          margin-left: auto;
          margin-right: auto;
          text-align: center;
        }

        h2 {
          margin-top: 12px;
        }

        .fpSectionHeading > p:last-child:not(.fp-kicker) {
          margin: 17px 0 0;
          color: var(--fp-muted);
          font-size: 17px;
          line-height: 1.7;
        }
      `}</style>
    </div>
  );
}
