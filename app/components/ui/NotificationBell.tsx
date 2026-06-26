'use client'

import Link from 'next/link'

export default function NotificationBell({
  count = 0,
  href = '/notifications',
}: {
  count?: number
  href?: string
}) {
  return (
    <Link href={href} className="bell" aria-label="Notifications">
      🔔
      {count > 0 ? <span>{count > 99 ? '99+' : count}</span> : null}

      <style jsx>{styles}</style>
    </Link>
  )
}

const styles = `
  .bell {
    position: relative;
    width: 48px;
    height: 48px;
    border-radius: 17px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    background: white;
    border: 1px solid rgba(124, 58, 237, 0.14);
    box-shadow: 0 14px 34px rgba(47, 25, 80, 0.08);
    font-size: 20px;
  }

  span {
    position: absolute;
    top: -7px;
    right: -7px;
    min-width: 23px;
    height: 23px;
    padding: 0 6px;
    border-radius: 999px;
    background: #ef4444;
    color: white;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 950;
  }
`