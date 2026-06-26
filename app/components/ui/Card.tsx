import type { ReactNode } from 'react'

export default function Card({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`fpCard ${className}`}>
      {children}
      <style jsx>{styles}</style>
    </div>
  )
}

const styles = `
  .fpCard {
    padding: 30px;
    border-radius: 34px;
    background: rgba(255,255,255,0.96);
    border: 1px solid rgba(124,58,237,0.1);
    box-shadow: 0 24px 70px rgba(47,25,80,0.09);
  }
`