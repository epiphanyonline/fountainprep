"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { supabase } from "../lib/supabase";
import NotificationBell from "./ui/NotificationBell";

type UserProfile = {
  id: string;
  role: string;
  full_name: string | null;
  account_type?: "PARENT" | "ADULT_LEARNER" | null;
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const { data: userProfile } = await supabase
        .from("user_profiles")
        .select("id, role, full_name")
        .eq("id", user.id)
        .maybeSingle();

      if (!userProfile) {
        setProfile(null);
        setLoading(false);
        return;
      }

      let accountType: "PARENT" | "ADULT_LEARNER" | null = null;

      if (userProfile.role === "PARENT") {
        const { data: parentProfile } = await supabase
          .from("parent_profiles")
          .select("account_type")
          .eq("user_id", user.id)
          .maybeSingle();

        accountType =
          parentProfile?.account_type === "ADULT_LEARNER"
            ? "ADULT_LEARNER"
            : "PARENT";
      }

      const completeProfile: UserProfile = {
        ...userProfile,
        account_type: accountType,
      };

      setProfile(completeProfile);

      if (userProfile) {
        const { count } = await supabase
          .from("notifications")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("user_id", user.id)
          .eq("is_read", false);

        setNotificationCount(count ?? 0);
      }

      setLoading(false);
    }

    loadProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadProfile();
      router.refresh();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  async function handleLogout() {
    await supabase.auth.signOut();
    setProfile(null);
    setMenuOpen(false);
    router.push("/login");
    router.refresh();
  }

  function dashboardHref() {
    if (!profile) return "/login";

    if (profile.role === "ADMIN") {
      return "/admin";
    }

    if (profile.role === "TUTOR") {
      return "/tutor/dashboard";
    }

    if (profile.role === "PARENT" && profile.account_type === "ADULT_LEARNER") {
      return "/learner/dashboard";
    }

    if (profile.role === "PARENT") {
      return "/parent/dashboard";
    }

    return "/account";
  }

  const publicLinks = [
    { label: "Home", href: "/" },
    { label: "Subjects", href: "/subjects" },
    { label: "Become a Tutor", href: "/signup/tutor" },
    { label: "Login", href: "/login" },
  ];

  const isAdultLearner =
    profile?.role === "PARENT" && profile.account_type === "ADULT_LEARNER";

  const isParentAccount =
    profile?.role === "PARENT" && profile.account_type !== "ADULT_LEARNER";

  const authedLinks = isAdultLearner
    ? [
        { label: "My Learning", href: "/learner/dashboard" },
        { label: "Account", href: "/account" },
      ]
    : [
        ...(profile?.role === "PARENT"
          ? [{ label: "My Children", href: "/parent/students" }]
          : []),

        ...(profile?.role === "TUTOR"
          ? [{ label: "Availability", href: "/tutor/availability" }]
          : []),

        { label: "Dashboard", href: dashboardHref() },
        { label: "Account", href: "/account" },
      ];

  const links = loading ? [] : profile ? authedLinks : publicLinks;

  const isBookingRoute =
    pathname === "/pricing" ||
    pathname === "/schedule" ||
    pathname === "/payment" ||
    pathname.startsWith("/payment/success");

  if (isBookingRoute) {
    return (
      <header className="booking-header">
        <div className="booking-nav container">
          <Link href="/" className="brand-link" aria-label="Fountain Prep home">
            <Image
              src="/icons/icon-192.png"
              alt="Fountain Prep"
              width={42}
              height={42}
              priority
              className="brand-logo"
            />
            <span className="brand-text">
              <span className="brand-main">Fountain</span>
              <span className="brand-accent">Prep</span>
            </span>
          </Link>

          <span className="booking-status">Booking in progress</span>
        </div>

        <style jsx>{`
          .booking-header {
            position: sticky;
            top: 0;
            z-index: 100;
            background: rgba(255, 255, 255, 0.94);
            border-bottom: 1px solid rgba(124, 58, 237, 0.12);
            backdrop-filter: blur(18px);
          }

          .booking-nav {
            min-height: 68px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
          }

          .brand-link {
            display: inline-flex;
            align-items: center;
            gap: 9px;
            min-width: 0;
            text-decoration: none;
          }

          .brand-logo {
            width: 42px;
            height: 42px;
            object-fit: contain;
          }

          .brand-text {
            display: inline-flex;
            align-items: baseline;
            letter-spacing: -0.055em;
            line-height: 1;
            white-space: nowrap;
            font-size: 29px;
            font-weight: 950;
          }

          .brand-main {
            color: #1f1230;
          }
          .brand-accent {
            color: #7c3aed;
          }

          .booking-status {
            padding: 9px 13px;
            border-radius: 999px;
            color: #6d28d9;
            background: #f2eaff;
            font-size: 13px;
            font-weight: 900;
          }

          @media (max-width: 480px) {
            .brand-text {
              font-size: 24px;
            }
            .brand-logo {
              width: 38px;
              height: 38px;
            }
            .booking-status {
              font-size: 11px;
            }
          }
        `}</style>
      </header>
    );
  }

  return (
    <header className="site-header">
      <div className="site-nav container">
        <Link href="/" className="brand-link" aria-label="Fountain Prep home">
          <Image
            src="/icons/icon-192.png"
            alt="Fountain Prep"
            width={46}
            height={46}
            priority
            className="brand-logo"
          />

          <span className="brand-text">
            <span className="brand-main">Fountain</span>
            <span className="brand-accent">Prep</span>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                pathname === item.href
                  ? "nav-btn nav-btn-light active"
                  : "nav-btn nav-btn-light"
              }
            >
              {item.label}
            </Link>
          ))}

          {!loading && profile ? (
            <button
              type="button"
              className={
                isParentAccount
                  ? "nav-btn nav-btn-light"
                  : "nav-btn nav-btn-primary"
              }
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : null}

          {!loading && (!profile || isParentAccount) ? (
            <Link href="/start" className="nav-btn nav-btn-primary">
              Start Booking
            </Link>
          ) : null}
        </nav>

        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen ? (
        <div className="mobile-panel">
          <div className="mobile-panel-inner container">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  pathname === item.href ? "mobile-link active" : "mobile-link"
                }
              >
                {item.label}
              </Link>
            ))}

            {profile && (
              <NotificationBell
                count={notificationCount}
                href="/notifications"
              />
            )}

            {!loading && profile ? (
              <button
                type="button"
                className={
                  isParentAccount ? "mobile-link" : "mobile-link primary"
                }
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : null}

            {!loading && (!profile || isParentAccount) ? (
              <Link href="/start" className="mobile-link primary">
                Start Booking
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}

      <style jsx>{`
        .site-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.88);
          border-bottom: 1px solid rgba(124, 58, 237, 0.1);
          backdrop-filter: blur(18px);
        }

        .site-nav {
          min-height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
        }

        .brand-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          min-width: 0;
        }

        .brand-logo {
          width: 46px;
          height: 46px;
          object-fit: contain;
          flex-shrink: 0;
        }

        .brand-text {
          display: inline-flex;
          align-items: baseline;
          letter-spacing: -0.055em;
          line-height: 1;
          white-space: nowrap;
          font-size: 34px;
          font-weight: 950;
        }

        .brand-main {
          color: #1f1230;
        }

        .brand-accent {
          color: #7c3aed;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .nav-btn {
          min-height: 46px;
          padding: 0 17px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-weight: 850;
          transition: all 0.2s ease;
          border: none;
          cursor: pointer;
          font-size: 15px;
          white-space: nowrap;
        }

        .nav-btn-light {
          background: rgba(255, 255, 255, 0.86);
          border: 1px solid rgba(124, 58, 237, 0.12);
          color: #251634;
        }

        .nav-btn-light:hover,
        .nav-btn-light.active {
          background: #f4edff;
          color: #6d28d9;
          border-color: rgba(124, 58, 237, 0.2);
        }

        .nav-btn-primary {
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          color: white;
          box-shadow: 0 12px 28px rgba(109, 40, 217, 0.2);
        }

        .nav-btn-primary:hover {
          transform: translateY(-1px);
        }

        .mobile-menu-btn {
          display: none;
          width: 46px;
          height: 46px;
          border-radius: 18px;
          border: 1px solid rgba(124, 58, 237, 0.14);
          background: #ffffff;
          color: #1f1230;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 24px rgba(55, 35, 95, 0.08);
        }

        .mobile-panel {
          display: none;
          border-top: 1px solid rgba(124, 58, 237, 0.1);
          background: rgba(255, 255, 255, 0.96);
        }

        .mobile-panel-inner {
          padding-top: 12px;
          padding-bottom: 16px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .mobile-link {
          min-height: 50px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-size: 15px;
          font-weight: 900;
          color: #251634;
          background: #ffffff;
          border: 1px solid rgba(124, 58, 237, 0.12);
          box-shadow: 0 10px 24px rgba(55, 35, 95, 0.06);
        }

        .mobile-link.active {
          background: #f4edff;
          color: #6d28d9;
        }

        .mobile-link.primary {
          grid-column: 1 / -1;
          border: none;
          color: #ffffff;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          box-shadow: 0 14px 30px rgba(109, 40, 217, 0.22);
          cursor: pointer;
        }

        @media (max-width: 900px) {
          .site-nav {
            min-height: 68px;
          }

          .desktop-nav {
            display: none;
          }

          .mobile-menu-btn {
            display: inline-flex;
          }

          .mobile-panel {
            display: block;
          }

          .brand-text {
            font-size: 28px;
          }
        }

        @media (max-width: 420px) {
          .site-nav {
            min-height: 64px;
          }

          .brand-logo {
            width: 40px;
            height: 40px;
          }

          .brand-text {
            font-size: 25px;
          }

          .mobile-menu-btn {
            width: 42px;
            height: 42px;
            border-radius: 16px;
          }

          .mobile-panel-inner {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </header>
  );
}
