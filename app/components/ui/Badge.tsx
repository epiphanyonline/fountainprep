import type { ReactNode } from 'react'

export default function Badge({
  children,
  tone = 'purple',
}: {
  children: ReactNode
  tone?: 'purple' | 'green' | 'orange' | 'red'
}) {
  return (
    <span className={`fpBadge ${tone}`}>
      {children}
      <style jsx>{styles}</style>
    </span>
  )
}

const styles = `
  .fpBadge {
    display: inline-flex;
    align-items: center;
    min-height: 32px;
    padding: 0 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 950;
  }

  .purple {
    background: #f6f1ff;
    color: #4c1d95;
  }

  .green {
    background: #dcfce7;
    color: #166534;
  }

  .orange {
    background: #fff7ed;
    color: #9a3412;
  }

  .red {
    background: #fff1f2;
    color: #be123c;
  }
`