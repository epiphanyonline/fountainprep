import type { ReactNode } from 'react'

export default function SectionHeader({
  eyebrow,
  title,
  text,
  action,
}: {
  eyebrow?: string
  title: string
  text?: string
  action?: ReactNode
}) {
  return (
    <div className="sectionHeader">
      <div>
        {eyebrow ? <p>{eyebrow}</p> : null}
        <h2>{title}</h2>
        {text ? <span>{text}</span> : null}
      </div>

      {action ? <div className="action">{action}</div> : null}

      <style jsx>{styles}</style>
    </div>
  )
}

const styles = `
  .sectionHeader {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
    margin-bottom: 22px;
  }

  p {
    margin: 0;
    color: #6d28d9;
    font-size: 14px;
    font-weight: 950;
  }

  h2 {
    margin: 8px 0 0;
    font-size: clamp(28px, 4vw, 46px);
    line-height: 1.02;
    letter-spacing: -0.055em;
    color: #201230;
  }

  span {
    display: block;
    max-width: 680px;
    margin-top: 10px;
    color: #6d647c;
    line-height: 1.7;
    font-weight: 650;
  }

  @media (max-width: 760px) {
    .sectionHeader {
      flex-direction: column;
    }
  }
`