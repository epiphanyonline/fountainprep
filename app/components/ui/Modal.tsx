'use client'

import type { ReactNode } from 'react'

export default function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean
  title?: string
  children: ReactNode
  onClose: () => void
}) {
  if (!open) return null

  return (
    <div className="modalOverlay">
      <div className="modalCard">
        <div className="modalTop">
          <h2>{title || 'Details'}</h2>
          <button type="button" onClick={onClose}>✕</button>
        </div>

        {children}
      </div>

      <style jsx>{styles}</style>
    </div>
  )
}

const styles = `
  .modalOverlay {
    position: fixed;
    inset: 0;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 18px;
    background: rgba(32, 18, 48, 0.55);
    backdrop-filter: blur(12px);
  }

  .modalCard {
    width: min(620px, 100%);
    max-height: 88vh;
    overflow: auto;
    padding: 28px;
    border-radius: 32px;
    background: white;
    box-shadow: 0 30px 90px rgba(20, 10, 35, 0.28);
  }

  .modalTop {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: center;
    margin-bottom: 20px;
  }

  h2 {
    margin: 0;
    font-size: 28px;
    letter-spacing: -0.045em;
    color: #201230;
  }

  button {
    width: 44px;
    height: 44px;
    border: 0;
    border-radius: 16px;
    background: #f1e8ff;
    color: #6d28d9;
    font-size: 20px;
    font-weight: 950;
    cursor: pointer;
  }
`