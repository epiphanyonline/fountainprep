import type { ReactNode } from 'react'

export default function EmptyState({
  title,
  text,
  action,
}: {
  title: string
  text: string
  action?: ReactNode
}) {
  return (
    <div className="emptyState">
      <div className="icon">✨</div>
      <h3>{title}</h3>
      <p>{text}</p>
      {action ? <div className="action">{action}</div> : null}

      <style jsx>{styles}</style>
    </div>
  )
}

const styles = `
  .emptyState {
    padding: 30px;
    border-radius: 28px;
    text-align: center;
    background: #fbf8ff;
    border: 1px solid rgba(124, 58, 237, 0.1);
  }

  .icon {
    width: 58px;
    height: 58px;
    margin: 0 auto 16px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f1e8ff;
    font-size: 24px;
  }

  h3 {
    margin: 0;
    font-size: 24px;
    letter-spacing: -0.035em;
    color: #201230;
  }

  p {
    max-width: 520px;
    margin: 10px auto 0;
    color: #6d647c;
    line-height: 1.7;
    font-weight: 650;
  }

  .action {
    margin-top: 18px;
  }
`