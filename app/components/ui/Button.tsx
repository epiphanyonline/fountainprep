'use client'

import Link from 'next/link'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  href?: string
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
}

export default function Button({
  children,
  href,
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  const finalClass = `fpButton ${variant} ${className}`

  if (href) {
    return (
      <Link href={href} className={finalClass}>
        {children}
        <style jsx>{styles}</style>
      </Link>
    )
  }

  return (
    <button className={finalClass} {...props}>
      {children}
      <style jsx>{styles}</style>
    </button>
  )
}

const styles = `
  .fpButton {
    min-height: 52px;
    padding: 0 20px;
    border-radius: 18px;
    border: 0;
    font-weight: 950;
    font-family: inherit;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
  }

  .primary {
    color: white;
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    box-shadow: 0 18px 42px rgba(109, 40, 217, 0.24);
  }

  .secondary {
    color: #241535;
    background: white;
    border: 1px solid rgba(124, 58, 237, 0.14);
  }

  .ghost {
    color: #6d28d9;
    background: #f6f1ff;
  }

  .danger {
    color: #be123c;
    background: #fff1f2;
    border: 1px solid rgba(220, 38, 38, 0.16);
  }

  .fpButton:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`