"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  usePathname,
  useRouter,
} from "next/navigation";
import {
  Menu,
  X,
} from "lucide-react";

import { supabase } from "../lib/supabase";
import NotificationBell from "./ui/NotificationBell";

type UserProfile = {
  id: string;
  role: string;
  full_name: string | null;
  account_type?:
    | "PARENT"
    | "ADULT_LEARNER"
    | null;
};

function isFinancialEducationPath(
  pathname: string,
  searchString: string,
) {
  const searchParams =
    new URLSearchParams(
      searchString.startsWith("?")
        ? searchString.slice(1)
        : searchString,
    );
  if (
    pathname === "/financial-education" ||
    pathname.startsWith(
      "/academies/financial-literacy",
    )
  ) {
    return true;
  }

  if (
    pathname === "/classroom/academy" &&
    searchParams.get("academy") ===
      "personal-finance"
  ) {
    return true;
  }

  if (
    pathname === "/pricing" &&
    searchParams.get("product") ===
      "academies" &&
    searchParams.get("academy") ===
      "personal-finance"
  ) {
    return true;
  }

  const next =
    searchParams.get("next") ?? "";

  if (
    [
      "/signup",
      "/signup/parent",
      "/signup/learner",
      "/login",
      "/parent/onboarding",
      "/parent/students",
    ].includes(pathname) &&
    (
      next.includes(
        "/academies/financial-literacy",
      ) ||
      next.includes(
        "/financial-education",
      ) ||
      next.includes(
        "academy=personal-finance",
      ) ||
      next.includes(
        "product=academies",
      )
    )
  ) {
    return true;
  }

  return false;
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [
    currentSearch,
    setCurrentSearch,
  ] = useState("");

  const [loading, setLoading] =
    useState(true);
  const [profile, setProfile] =
    useState<UserProfile | null>(null);
  const [menuOpen, setMenuOpen] =
    useState(false);
  const [
    notificationCount,
    setNotificationCount,
  ] = useState(0);

  const financialEducationMode =
    useMemo(
      () =>
        isFinancialEducationPath(
          pathname,
          currentSearch,
        ),
      [pathname, currentSearch],
    );

  useEffect(() => {
    const syncSearch = () => {
      setCurrentSearch(
        window.location.search,
      );
    };

    syncSearch();

    window.addEventListener(
      "popstate",
      syncSearch,
    );

    return () => {
      window.removeEventListener(
        "popstate",
        syncSearch,
      );
    };
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;

    async function loadProfileForUser(
      user:
        | {
            id: string;
          }
        | null,
    ) {
      if (cancelled) {
        return;
      }

      setLoading(true);

      try {
        if (!user) {
          if (!cancelled) {
            setProfile(null);
            setNotificationCount(0);
          }

          return;
        }

        const { data: userProfile } =
          await supabase
            .from("user_profiles")
            .select(
              "id, role, full_name",
            )
            .eq("id", user.id)
            .maybeSingle();

        if (
          cancelled ||
          !userProfile
        ) {
          if (
            !cancelled &&
            !userProfile
          ) {
            setProfile(null);
            setNotificationCount(0);
          }

          return;
        }

        let accountType:
          | "PARENT"
          | "ADULT_LEARNER"
          | null = null;

        if (
          userProfile.role ===
          "PARENT"
        ) {
          const {
            data: parentProfile,
          } = await supabase
            .from("parent_profiles")
            .select("account_type")
            .eq(
              "user_id",
              user.id,
            )
            .maybeSingle();

          if (cancelled) {
            return;
          }

          accountType =
            parentProfile?.account_type ===
            "ADULT_LEARNER"
              ? "ADULT_LEARNER"
              : "PARENT";
        }

        const { count } =
          await supabase
            .from("notifications")
            .select("*", {
              count: "exact",
              head: true,
            })
            .eq(
              "user_id",
              user.id,
            )
            .eq(
              "is_read",
              false,
            );

        if (cancelled) {
          return;
        }

        setProfile({
          ...userProfile,
          account_type:
            accountType,
        });

        setNotificationCount(
          count ?? 0,
        );
      } catch (error) {
        console.error(
          "Unable to load navbar profile:",
          error,
        );

        if (!cancelled) {
          setProfile(null);
          setNotificationCount(0);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void supabase.auth
      .getSession()
      .then(({ data }) => {
        void loadProfileForUser(
          data.session?.user ??
            null,
        );
      })
      .catch((error) => {
        console.error(
          "Unable to read navbar session:",
          error,
        );

        if (!cancelled) {
          setProfile(null);
          setNotificationCount(0);
          setLoading(false);
        }
      });

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {
          void loadProfileForUser(
            session?.user ??
              null,
          );

          window.setTimeout(
            () => {
              if (!cancelled) {
                router.refresh();
              }
            },
            0,
          );
        },
      );

    return () => {
      cancelled = true;
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

    router.push(
      financialEducationMode
        ? "/financial-education"
        : "/login",
    );

    router.refresh();
  }

  function dashboardHref() {
    if (!profile) return "/login";
    if (profile.role === "ADMIN")
      return "/admin";
    if (profile.role === "TUTOR")
      return "/tutor/dashboard";

    if (
      profile.role === "PARENT" &&
      profile.account_type ===
        "ADULT_LEARNER"
    ) {
      return "/learner/dashboard";
    }

    if (profile.role === "PARENT")
      return "/parent/dashboard";

    return "/account";
  }

  const isAdultLearner =
    profile?.role === "PARENT" &&
    profile.account_type ===
      "ADULT_LEARNER";

  const isParentAccount =
    profile?.role === "PARENT" &&
    profile.account_type !==
      "ADULT_LEARNER";

  if (financialEducationMode) {
    const financeLinks = [
      {
        label: "Financial Education",
        href: "/financial-education",
      },
      {
        label: "Financial Literacy",
        href: "/academies/financial-literacy",
      },
      {
        label: "Investment Lab",
        href:
          "/academies/financial-literacy/investment-lab",
      },
      {
        label: "Wealth Simulator",
        href:
          "/academies/financial-literacy/wealth-simulator",
      },
      {
        label:
          isParentAccount
            ? "Learners"
            : "Continue Learning",
        href:
          "/academies/financial-literacy/start",
      },
      ...(profile
        ? [
            {
              label: "Account",
              href: "/account",
            },
          ]
        : []),
    ];

    return (
      <header className="finance-header">
        <div className="finance-nav container">
          <Link
            href="/financial-education"
            className="finance-brand"
            aria-label="Fountain Prep Financial Education"
          >
            <Image
              src="/icons/icon-192.png"
              alt="Fountain Prep"
              width={42}
              height={42}
              priority
              className="finance-logo"
            />

            <span className="finance-brand-copy">
              <span className="finance-brand-main">
                FountainPrep
              </span>
              <span className="finance-divider">
                /
              </span>
              <span className="finance-product">
                Financial Education
              </span>
            </span>
          </Link>

          <nav
            className="finance-desktop-nav"
            aria-label="Financial Education navigation"
          >
            {financeLinks.map(
              (item) => {
                const active =
                  item.href ===
                  "/financial-education"
                    ? pathname ===
                      item.href
                    : pathname.startsWith(
                        item.href,
                      );

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      active
                        ? "finance-link active"
                        : "finance-link"
                    }
                  >
                    {item.label}
                  </Link>
                );
              },
            )}

            {!loading && !profile ? (
              <Link
                href={
                  `/login?next=` +
                  encodeURIComponent(
                    "/academies/financial-literacy/start",
                  )
                }
                className="finance-signin"
              >
                Sign in
              </Link>
            ) : null}

            {!loading && profile ? (
              <button
                type="button"
                onClick={handleLogout}
                className="finance-exit"
              >
                Logout
              </button>
            ) : null}
          </nav>

          <button
            type="button"
            className="finance-menu-btn"
            onClick={() =>
              setMenuOpen(
                (value) =>
                  !value,
              )
            }
            aria-label="Toggle Financial Education menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>
        </div>

        {menuOpen ? (
          <div className="finance-mobile-panel">
            <div className="finance-mobile-inner container">
              {financeLinks.map(
                (item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="finance-mobile-link"
                  >
                    {item.label}
                  </Link>
                ),
              )}

              {!loading &&
              !profile ? (
                <Link
                  href={
                    `/login?next=` +
                    encodeURIComponent(
                      "/academies/financial-literacy/start",
                    )
                  }
                  className="finance-mobile-link primary"
                >
                  Sign in
                </Link>
              ) : null}

              {!loading &&
              profile ? (
                <button
                  type="button"
                  className="finance-mobile-link"
                  onClick={
                    handleLogout
                  }
                >
                  Logout
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        <style jsx>{`
          .finance-header {
            position: sticky;
            top: 0;
            z-index: 120;
            background: rgba(
              255,
              253,
              249,
              0.96
            );
            border-bottom: 1px
              solid
              rgba(
                124,
                58,
                237,
                0.12
              );
            backdrop-filter:
              blur(18px);
          }

          .finance-nav {
            min-height: 76px;
            display: flex;
            align-items: center;
            justify-content:
              space-between;
            gap: 18px;
          }

          .finance-brand {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            min-width: 0;
            color: inherit;
            text-decoration: none;
          }

          .finance-logo {
            width: 42px;
            height: 42px;
            flex-shrink: 0;
            object-fit: contain;
          }

          .finance-brand-copy {
            display: inline-flex;
            align-items: baseline;
            gap: 8px;
            white-space: nowrap;
          }

          .finance-brand-main {
            color: #20112e;
            font-size: 25px;
            font-weight: 950;
            letter-spacing:
              -0.05em;
          }

          .finance-divider {
            color: #b49e72;
            font-weight: 800;
          }

          .finance-product {
            color: #6d28d9;
            font-size: 14px;
            font-weight: 950;
          }

          .finance-desktop-nav {
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .finance-link,
          .finance-signin,
          .finance-exit {
            min-height: 42px;
            display: inline-flex;
            align-items: center;
            justify-content:
              center;
            padding: 0 12px;
            border-radius: 999px;
            border: 0;
            color: #392c43;
            background:
              transparent;
            font: inherit;
            font-size: 13px;
            font-weight: 850;
            white-space: nowrap;
            text-decoration: none;
            cursor: pointer;
          }

          .finance-link:hover,
          .finance-link.active {
            color: #6d28d9;
            background: #f3ecff;
          }

          .finance-signin {
            color: white;
            background:
              linear-gradient(
                135deg,
                #7c3aed,
                #5b21b6
              );
          }

          .finance-exit {
            color: #6d28d9;
            border: 1px solid
              rgba(
                124,
                58,
                237,
                0.2
              );
            background: white;
          }

          .finance-menu-btn {
            display: none;
            width: 44px;
            height: 44px;
            align-items: center;
            justify-content:
              center;
            border-radius: 16px;
            border: 1px solid
              rgba(
                124,
                58,
                237,
                0.16
              );
            color: #251634;
            background: white;
          }

          .finance-mobile-panel {
            display: none;
            border-top: 1px solid
              rgba(
                124,
                58,
                237,
                0.1
              );
            background: rgba(
              255,
              255,
              255,
              0.98
            );
          }

          .finance-mobile-inner {
            display: grid;
            gap: 9px;
            padding-top: 12px;
            padding-bottom: 16px;
          }

          .finance-mobile-link {
            min-height: 49px;
            display: flex;
            align-items: center;
            justify-content:
              center;
            border-radius: 16px;
            border: 1px solid
              rgba(
                124,
                58,
                237,
                0.12
              );
            color: #34253f;
            background: white;
            font: inherit;
            font-weight: 900;
            text-decoration: none;
          }

          .finance-mobile-link.primary {
            color: white;
            border: 0;
            background:
              linear-gradient(
                135deg,
                #7c3aed,
                #5b21b6
              );
          }

          @media (
            max-width: 1180px
          ) {
            .finance-desktop-nav {
              display: none;
            }

            .finance-menu-btn {
              display: inline-flex;
            }

            .finance-mobile-panel {
              display: block;
            }
          }

          @media (
            max-width: 560px
          ) {
            .finance-brand-main {
              font-size: 22px;
            }

            .finance-divider {
              display: none;
            }

            .finance-product {
              display: block;
              font-size: 11px;
            }

            .finance-brand-copy {
              display: grid;
              gap: 1px;
            }
          }
        `}</style>
      </header>
    );
  }

  const publicLinks = [
    {
      label: "Home",
      href: "/",
    },
    {
      label:
        "Self-Paced Academies",
      href: "/academies",
    },
    {
      label: "Live Tutors",
      href: "/subjects",
    },
    {
      label: "Plans",
      href: "/plans",
    },
    {
      label: "Become a Tutor",
      href: "/signup/tutor",
    },
    {
      label: "Login",
      href: "/login",
    },
  ];

  const authedLinks =
    isAdultLearner
      ? [
          {
            label:
              "Self-Paced Academies",
            href: "/academies",
          },
          {
            label: "Live Tutors",
            href: "/subjects",
          },
          {
            label: "My Learning",
            href:
              "/learner/dashboard",
          },
          {
            label: "Account",
            href: "/account",
          },
        ]
      : [
          {
            label:
              "Self-Paced Academies",
            href: "/academies",
          },
          {
            label: "Live Tutors",
            href: "/subjects",
          },

          ...(profile?.role ===
          "PARENT"
            ? [
                {
                  label:
                    "My Children",
                  href:
                    "/parent/students",
                },
              ]
            : []),

          ...(profile?.role ===
          "TUTOR"
            ? [
                {
                  label:
                    "Availability",
                  href:
                    "/tutor/availability",
                },
              ]
            : []),

          {
            label: "Dashboard",
            href: dashboardHref(),
          },
          {
            label: "Account",
            href: "/account",
          },
        ];

  const links = loading
    ? []
    : profile
      ? authedLinks
      : publicLinks;

  const isBookingRoute =
    pathname === "/pricing" ||
    pathname === "/schedule" ||
    pathname === "/payment" ||
    pathname.startsWith(
      "/payment/success",
    );

  if (isBookingRoute) {
    return (
      <header className="booking-header">
        <div className="booking-nav container">
          <Link
            href="/"
            className="brand-link"
            aria-label="Fountain Prep home"
          >
            <Image
              src="/icons/icon-192.png"
              alt="Fountain Prep"
              width={42}
              height={42}
              priority
              className="brand-logo"
            />
            <span className="brand-text">
              <span className="brand-main">
                Fountain
              </span>
              <span className="brand-accent">
                Prep
              </span>
            </span>
          </Link>

          <span className="booking-status">
            Booking in progress
          </span>
        </div>

        <style jsx>{`
          .booking-header {
            position: sticky;
            top: 0;
            z-index: 100;
            background: rgba(
              255,
              255,
              255,
              0.94
            );
            border-bottom: 1px solid
              rgba(
                124,
                58,
                237,
                0.12
              );
            backdrop-filter:
              blur(18px);
          }

          .booking-nav {
            min-height: 68px;
            display: flex;
            align-items: center;
            justify-content:
              space-between;
            gap: 16px;
          }

          .brand-link {
            display: inline-flex;
            align-items: center;
            gap: 9px;
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
            font-size: 29px;
            font-weight: 950;
            letter-spacing:
              -0.055em;
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

          @media (
            max-width: 480px
          ) {
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
        <Link
          href="/"
          className="brand-link"
          aria-label="Fountain Prep home"
        >
          <Image
            src="/icons/icon-192.png"
            alt="Fountain Prep"
            width={46}
            height={46}
            priority
            className="brand-logo"
          />

          <span className="brand-text">
            <span className="brand-main">
              Fountain
            </span>
            <span className="brand-accent">
              Prep
            </span>
          </span>
        </Link>

        <nav
          className="desktop-nav"
          aria-label="Main navigation"
        >
          {links.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(
                    item.href.split(
                      "?",
                    )[0],
                  );

            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? "nav-btn nav-btn-light active"
                    : "nav-btn nav-btn-light"
                }
              >
                {item.label}
              </Link>
            );
          })}

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

          {!loading ? (
            <Link
              href="/financial-education"
              className="nav-btn nav-btn-finance"
            >
              Financial Education
            </Link>
          ) : null}

          {!loading &&
          (!profile ||
            isParentAccount) ? (
            <Link
              href="/start"
              className="nav-btn nav-btn-primary"
            >
              Book a Live Tutor
            </Link>
          ) : null}
        </nav>

        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() =>
            setMenuOpen(
              (value) =>
                !value,
            )
          }
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
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
                  pathname ===
                  item.href
                    ? "mobile-link active"
                    : "mobile-link"
                }
              >
                {item.label}
              </Link>
            ))}

            {profile ? (
              <NotificationBell
                count={
                  notificationCount
                }
                href="/notifications"
              />
            ) : null}

            {!loading && profile ? (
              <button
                type="button"
                className={
                  isParentAccount
                    ? "mobile-link"
                    : "mobile-link primary"
                }
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : null}

            {!loading ? (
              <Link
                href="/financial-education"
                className="mobile-link finance"
              >
                Financial Education
              </Link>
            ) : null}

            {!loading &&
            (!profile ||
              isParentAccount) ? (
              <Link
                href="/start"
                className="mobile-link primary"
              >
                Book a Live Tutor
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
          background: rgba(
            255,
            255,
            255,
            0.9
          );
          border-bottom: 1px solid
            rgba(
              124,
              58,
              237,
              0.1
            );
          backdrop-filter:
            blur(18px);
        }

        .site-nav {
          min-height: 76px;
          display: flex;
          align-items: center;
          justify-content:
            space-between;
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
          font-size: 34px;
          font-weight: 950;
          letter-spacing:
            -0.055em;
          line-height: 1;
          white-space: nowrap;
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
          gap: 9px;
        }

        .nav-btn {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content:
            center;
          padding: 0 15px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 850;
          white-space: nowrap;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition:
            all 160ms ease;
        }

        .nav-btn-light {
          color: #251634;
          background:
            transparent;
        }

        .nav-btn-light:hover,
        .nav-btn-light.active {
          color: #6d28d9;
          background: #f4edff;
        }

        .nav-btn-finance {
          color: #6d28d9;
          border: 1.5px solid
            #7c3aed;
          background: #f8f4ff;
          box-shadow:
            0 8px 20px
            rgba(
              109,
              40,
              217,
              0.1
            );
        }

        .nav-btn-finance:hover {
          color: white;
          background:
            linear-gradient(
              135deg,
              #7c3aed,
              #6d28d9
            );
          box-shadow:
            0 12px 28px
            rgba(
              109,
              40,
              217,
              0.2
            );
        }

        .nav-btn-primary {
          color: white;
          background:
            linear-gradient(
              135deg,
              #7c3aed,
              #6d28d9
            );
          box-shadow:
            0 12px 28px
            rgba(
              109,
              40,
              217,
              0.2
            );
        }

        .mobile-menu-btn {
          display: none;
          width: 46px;
          height: 46px;
          align-items: center;
          justify-content:
            center;
          border-radius: 18px;
          border: 1px solid
            rgba(
              124,
              58,
              237,
              0.14
            );
          color: #1f1230;
          background: #fff;
        }

        .mobile-panel {
          display: none;
          border-top: 1px solid
            rgba(
              124,
              58,
              237,
              0.1
            );
          background: rgba(
            255,
            255,
            255,
            0.97
          );
        }

        .mobile-panel-inner {
          display: grid;
          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );
          gap: 10px;
          padding-top: 12px;
          padding-bottom: 16px;
        }

        .mobile-link {
          min-height: 50px;
          display: flex;
          align-items: center;
          justify-content:
            center;
          border: 1px solid
            rgba(
              124,
              58,
              237,
              0.12
            );
          border-radius: 18px;
          color: #251634;
          background: #fff;
          font-size: 15px;
          font-weight: 900;
          text-decoration: none;
        }

        .mobile-link.active {
          color: #6d28d9;
          background: #f4edff;
        }

        .mobile-link.finance {
          grid-column:
            1 / -1;
          color: #6d28d9;
          border: 1.5px solid
            #7c3aed;
          background: #f8f4ff;
        }

        .mobile-link.primary {
          grid-column:
            1 / -1;
          color: white;
          border: 0;
          background:
            linear-gradient(
              135deg,
              #7c3aed,
              #6d28d9
            );
        }

        @media (
          max-width: 1000px
        ) {
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

        @media (
          max-width: 480px
        ) {
          .brand-logo {
            width: 40px;
            height: 40px;
          }

          .brand-text {
            font-size: 25px;
          }

          .mobile-panel-inner {
            grid-template-columns:
              1fr;
          }
        }
      `}</style>
    </header>
  );
}
