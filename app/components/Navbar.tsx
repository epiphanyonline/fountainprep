'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

type UserProfile = {
  id: string
  role: string
  full_name: string | null
}

export default function Navbar() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    async function loadProfile() {
      setLoading(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setProfile(null)
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('user_profiles')
        .select('id, role, full_name')
        .eq('id', user.id)
        .maybeSingle()

      setProfile(data ?? null)
      setLoading(false)
    }

    loadProfile()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadProfile()
      router.refresh()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  async function handleLogout() {
    await supabase.auth.signOut()

    setProfile(null)

    router.push('/login')
    router.refresh()
  }

  function dashboardHref() {
    if (!profile) return '/login'

    if (profile.role === 'ADMIN') return '/admin'

    if (profile.role === 'TUTOR') return '/tutor/dashboard'

    if (profile.role === 'PARENT') return '/parent/dashboard'

    return '/account'
  }

  return (
    <header className="site-header">
      <div className="site-nav container">
        <Link href="/" className="brand-link" aria-label="Fountain Prep home">
          <span className="brand-main">Fountain</span>
          <span className="brand-accent">Prep</span>
        </Link>

        <nav className="nav-actions" aria-label="Main navigation">
          <Link href="/" className="nav-btn nav-btn-light">
            Home
          </Link>

          {!loading && !profile ? (
            <>
              <Link href="/subjects" className="nav-btn nav-btn-light">
                Subjects
              </Link>

              <Link href="/signup/parent" className="nav-btn nav-btn-light">
                Parents
              </Link>

              <Link href="/signup/tutor" className="nav-btn nav-btn-light">
                Tutors
              </Link>

              <Link href="/login" className="nav-btn nav-btn-primary">
                Login
              </Link>
            </>
          ) : null}

          {!loading && profile ? (
            <>
              {profile.role === 'PARENT' ? (
                <Link
                  href="/parent/students"
                  className="nav-btn nav-btn-light"
                >
                  Start Learning
                </Link>
              ) : null}

              {profile.role === 'TUTOR' ? (
                <Link
                  href="/tutor/availability"
                  className="nav-btn nav-btn-light"
                >
                  Availability
                </Link>
              ) : null}

              <Link href={dashboardHref()} className="nav-btn nav-btn-light">
                Dashboard
              </Link>

              <Link href="/account" className="nav-btn nav-btn-light">
                Account
              </Link>

              <button
                type="button"
                className="nav-btn nav-btn-primary"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : null}
        </nav>

        <style jsx>{`
          .brand-link {
            display: flex;
            align-items: center;
            gap: 4px;
            text-decoration: none;
            font-size: 34px;
            font-weight: 900;
            letter-spacing: -0.05em;
            line-height: 1;
            white-space: nowrap;
          }

          .brand-main {
            color: #1f1230;
          }

          .brand-accent {
            color: #7c3aed;
          }

          .site-header {
            position: sticky;
            top: 0;
            z-index: 100;
            backdrop-filter: blur(16px);
            background: rgba(255, 255, 255, 0.82);
            border-bottom: 1px solid rgba(124, 58, 237, 0.08);
          }

          .site-nav {
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-height: 84px;
            gap: 20px;
          }

          .nav-actions {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
          }

          .nav-btn {
            min-height: 48px;
            padding: 0 18px;
            border-radius: 16px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            font-weight: 700;
            transition: all 0.2s ease;
            border: none;
            cursor: pointer;
            font-size: 15px;
          }

          .nav-btn-light {
            background: rgba(255, 255, 255, 0.88);
            border: 1px solid rgba(124, 58, 237, 0.08);
            color: #251634;
          }

          .nav-btn-light:hover {
            background: #f7f2ff;
          }

          .nav-btn-primary {
            background: linear-gradient(135deg, #7c3aed, #6d28d9);
            color: white;
            box-shadow: 0 10px 28px rgba(109, 40, 217, 0.2);
          }

          .nav-btn-primary:hover {
            transform: translateY(-1px);
          }

          @media (max-width: 900px) {
            .site-nav {
              flex-direction: column;
              align-items: stretch;
              padding: 14px 0;
            }

            .brand-link {
              justify-content: center;
              font-size: 30px;
            }

            .nav-actions {
              width: 100%;
              justify-content: center;
            }

            .nav-btn {
              flex: 1;
              min-width: 120px;
            }
          }

          @media (max-width: 640px) {
            .nav-actions {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 10px;
            }

            .nav-btn {
              width: 100%;
              min-width: unset;
            }

            .brand-link {
              font-size: 28px;
            }
          }
        `}</style>
      </div>
    </header>
  )
}