export default function StatsCard({
  label,
  value,
  sub,
}: {
  label: string
  value: string | number
  sub?: string
}) {
  return (
    <div className="statsCard">
      <span>{label}</span>
      <strong>{value}</strong>
      {sub ? <p>{sub}</p> : null}

      <style jsx>{styles}</style>
    </div>
  )
}

const styles = `
  .statsCard {
    padding: 22px;
    border-radius: 26px;
    background: white;
    border: 1px solid rgba(124, 58, 237, 0.1);
    box-shadow: 0 18px 46px rgba(47, 25, 80, 0.07);
  }

  span {
    color: #7a7088;
    font-size: 13px;
    font-weight: 900;
  }

  strong {
    display: block;
    margin-top: 8px;
    font-size: 34px;
    line-height: 1;
    letter-spacing: -0.055em;
    color: #201230;
  }

  p {
    margin: 8px 0 0;
    color: #6d647c;
    font-size: 13px;
    font-weight: 650;
  }
`