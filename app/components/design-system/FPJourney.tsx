type Step = {
  number: string;
  title: string;
  description: string;
};

export default function FPJourney({
  steps,
}: {
  steps: Step[];
}) {
  return (
    <div className="journey">
      {steps.map((step, index) => (
        <article key={step.number}>
          <div className="top">
            <span>{step.number}</span>
            {index < steps.length - 1 ? (
              <i aria-hidden="true" />
            ) : null}
          </div>
          <h3>{step.title}</h3>
          <p>{step.description}</p>
        </article>
      ))}

      <style jsx>{`
        .journey {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
        }

        article {
          padding: 26px;
          border-radius: var(--fp-radius-lg);
          background: #fff;
          border: 1px solid var(--fp-border);
          box-shadow: var(--fp-shadow-sm);
        }

        .top {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .top span {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: #fff;
          background: var(--fp-primary);
          font-size: 12px;
          font-weight: 950;
        }

        .top i {
          height: 2px;
          flex: 1;
          background: #e7dff2;
        }

        h3 {
          margin: 22px 0 0;
          color: var(--fp-text);
          font-size: 21px;
          letter-spacing: -0.03em;
        }

        p {
          margin: 10px 0 0;
          color: var(--fp-muted);
          line-height: 1.6;
          font-size: 14px;
        }

        @media (max-width: 900px) {
          .journey {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 560px) {
          .journey {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
