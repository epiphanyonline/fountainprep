'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function OldTutorBookingPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/parent/students')
  }, [router])

  return (
    <main className="page-wrap">
      <div className="container" style={{ maxWidth: 760 }}>
        <section className="card" style={{ padding: 32, textAlign: 'center' }}>
          <p style={{ margin: 0, color: '#6f42c1', fontWeight: 800 }}>
            Booking Updated
          </p>

          <h1 className="page-title" style={{ marginTop: 10 }}>
            Start with your child
          </h1>

          <p className="page-subtitle">
            TutorMe now matches tutors automatically based on your child’s age, subject,
            level, and selected time.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginTop: 24 }}>
            <Link href="/parent/students" className="btn-primary">
              Choose Child
            </Link>

            <Link href="/parent/dashboard" className="btn-secondary">
              Parent Dashboard
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}