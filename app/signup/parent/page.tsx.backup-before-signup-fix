"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { sendEmail } from "../../lib/email";

const locationOptions = [
  { country: "United Kingdom", timezone: "Europe/London" },
  { country: "United States", timezone: "America/New_York" },
  { country: "Canada", timezone: "America/Toronto" },
  { country: "Australia", timezone: "Australia/Sydney" },
  { country: "Nigeria", timezone: "Africa/Lagos" },
  { country: "Other", timezone: "UTC" },
];

function safeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/parent/students?mode=booking";
  }

  const allowedPrefixes = [
    "/parent/",
    "/subjects",
    "/pricing",
    "/schedule",
    "/payment",
  ];
  return allowedPrefixes.some((prefix) => value.startsWith(prefix))
    ? value
    : "/parent/students?mode=booking";
}

export default function ParentSignupPage() {
  return (
    <Suspense fallback={<SignupLoading />}>
      <ParentSignupForm />
    </Suspense>
  );
}

function ParentSignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = safeNextPath(searchParams.get("next"));
  const loginHref = `/login?next=${encodeURIComponent(nextPath)}`;

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("United Kingdom");
  const [timezone, setTimezone] = useState("Europe/London");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupComplete, setSignupComplete] = useState(false);

  useEffect(() => {
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (detectedTimezone) setTimezone(detectedTimezone);
  }, []);

  function handleCountryChange(value: string) {
    const selected = locationOptions.find((item) => item.country === value);
    setCountry(value);
    setTimezone(selected?.timezone || "UTC");
  }

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrorMessage("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    const siteUrl = (
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      window.location.origin
    ).replace(/\/$/, "");

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        emailRedirectTo: `${siteUrl}/login?next=${encodeURIComponent(nextPath)}`,
        data: {
          role: "PARENT",
          full_name: cleanName,
          phone: phone.trim(),
          country,
          timezone,
        },
      },
    });

    if (error || !data.user) {
      setErrorMessage(error?.message || "Unable to create your account.");
      setLoading(false);
      return;
    }

    const { error: userProfileError } = await supabase
      .from("user_profiles")
      .upsert({
        id: data.user.id,
        email: cleanEmail,
        role: "PARENT",
        full_name: cleanName,
        phone: phone.trim() || null,
        country,
        timezone,
        is_active: true,
      });

    const { error: parentProfileError } = await supabase
      .from("parent_profiles")
      .upsert({
        user_id: data.user.id,
        full_name: cleanName,
        phone: phone.trim() || null,
        country,
        timezone,
        account_type: "PARENT",
      });

    if (userProfileError || parentProfileError) {
      setErrorMessage(
        userProfileError?.message ||
          parentProfileError?.message ||
          "Your account was created, but the parent profile could not be completed.",
      );
      setLoading(false);
      return;
    }

    await sendEmail({
      to: cleanEmail,
      subject: "Welcome to Fountain Prep",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#241235">
          <h2>Welcome to Fountain Prep, ${escapeHtml(cleanName)}</h2>
          <p>Your parent account has been created.</p>
          <p>Confirm your email, then continue with these simple steps:</p>
          <ol>
            <li>Add or choose your child.</li>
            <li>Choose a subject and plan.</li>
            <li>Select a tutor and weekly timetable.</li>
            <li>Review and pay securely.</li>
          </ol>
          <p>
            <a href="${siteUrl}${loginHref}" style="display:inline-block;background:#6d28d9;color:white;padding:12px 18px;border-radius:14px;text-decoration:none;font-weight:700">
              Continue your booking
            </a>
          </p>
        </div>
      `,
    });

    if (data.session) {
      router.replace(nextPath);
      router.refresh();
      return;
    }

    setSignupComplete(true);
    setMessage(
      "Account created. Confirm your email, then log in to continue your booking.",
    );
    setLoading(false);
  }

  return (
    <main className="signupPage">
      <div className="signupShell">
        <section className="signupIntro">
          <p className="eyebrow">Step 1 of your booking</p>
          <h1>Create your parent account</h1>
          <p>
            After this, we will take you directly to add or choose your child.
            Your subject, tutor, timetable and payment come next.
          </p>

          <div className="nextSteps">
            <span>1</span>
            <strong>Parent account</strong>
            <span>2</span>
            <strong>Child</strong>
            <span>3</span>
            <strong>Subject &amp; plan</strong>
            <span>4</span>
            <strong>Timetable &amp; payment</strong>
          </div>
        </section>

        <form className="signupCard" onSubmit={handleSignup}>
          <label>
            Full name
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </label>

          <label>
            Phone number <small>(optional)</small>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>

          <div className="twoColumns">
            <label>
              Country
              <select
                value={country}
                onChange={(e) => handleCountryChange(e.target.value)}
                required
              >
                {locationOptions.map((item) => (
                  <option key={item.country} value={item.country}>
                    {item.country}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Your timezone
              <input
                list="timezone-options"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                required
              />
              <datalist id="timezone-options">
                {locationOptions.map((item) => (
                  <option key={item.timezone} value={item.timezone} />
                ))}
              </datalist>
            </label>
          </div>

          <p className="fieldHelp">
            Times will be shown in this timezone and matched correctly with your
            tutor.
          </p>

          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
          </label>

          <label className="consentRow">
            <input
              type="checkbox"
              checked={acceptedPolicies}
              onChange={(e) => setAcceptedPolicies(e.target.checked)}
              required
            />
            <span>
              I agree to the{" "}
              <Link href="/terms" target="_blank">
                Terms &amp; Conditions
              </Link>{" "}
              and acknowledge the{" "}
              <Link href="/data-protection-policy" target="_blank">
                Data Protection Policy
              </Link>
              .
            </span>
          </label>

          <button
            className="primaryButton"
            disabled={loading || signupComplete}
          >
            {loading
              ? "Creating account…"
              : signupComplete
                ? "Account created"
                : "Create Account & Continue"}
          </button>

          {errorMessage ? <p className="notice error">{errorMessage}</p> : null}
          {message ? <p className="notice success">{message}</p> : null}

          {signupComplete ? (
            <Link href={loginHref} className="continueLink">
              Continue to Login
            </Link>
          ) : null}

          <p className="loginPrompt">
            Already have an account?{" "}
            <Link href={loginHref}>Log in and continue</Link>
          </p>
        </form>
      </div>

      <style jsx>{`
        .signupPage {
          min-height: 100vh;
          padding: 46px 18px 78px;
          color: #241235;
          background: linear-gradient(135deg, #fbf8ff, #f3eaff);
        }
        .signupShell {
          width: min(1040px, 100%);
          margin: 0 auto;
          display: grid;
          grid-template-columns: 0.82fr 1.18fr;
          gap: 26px;
          align-items: start;
        }
        .signupIntro,
        .signupCard {
          padding: 34px;
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid rgba(124, 58, 237, 0.13);
          box-shadow: 0 24px 68px rgba(55, 35, 95, 0.1);
        }
        .eyebrow {
          margin: 0;
          color: #6d28d9;
          font-size: 13px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }
        .signupIntro h1 {
          margin: 14px 0;
          font-size: clamp(38px, 5vw, 58px);
          line-height: 1;
          letter-spacing: -0.055em;
        }
        .signupIntro p {
          color: #685d74;
          line-height: 1.7;
        }
        .nextSteps {
          display: grid;
          grid-template-columns: 34px 1fr;
          gap: 10px 12px;
          align-items: center;
          margin-top: 28px;
        }
        .nextSteps span {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: #fff;
          background: #7c3aed;
          font-size: 12px;
          font-weight: 950;
        }
        .signupCard {
          display: grid;
          gap: 16px;
        }
        .signupCard label {
          display: grid;
          gap: 7px;
          color: #332040;
          font-weight: 850;
        }
        .signupCard label small {
          color: #7b7087;
          font-weight: 600;
        }
        .signupCard input:not([type="checkbox"]),
        .signupCard select {
          width: 100%;
          min-height: 51px;
          padding: 0 14px;
          box-sizing: border-box;
          border: 1px solid #dfd3ef;
          border-radius: 14px;
          background: #fff;
          color: #241235;
          font: inherit;
        }
        .signupCard input:focus,
        .signupCard select:focus {
          outline: 3px solid rgba(124, 58, 237, 0.16);
          border-color: #8b5cf6;
        }
        .twoColumns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .fieldHelp {
          margin: -7px 0 0;
          color: #6d647c;
          font-size: 13px;
          line-height: 1.5;
        }
        .consentRow {
          grid-template-columns: 20px 1fr !important;
          align-items: start;
          font-weight: 650 !important;
          line-height: 1.55;
        }
        .consentRow input {
          width: 18px;
          height: 18px;
          margin-top: 3px;
          accent-color: #7c3aed;
        }
        .consentRow a,
        .loginPrompt a {
          color: #6d28d9;
          font-weight: 900;
        }
        .primaryButton,
        .continueLink {
          min-height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 16px;
          color: #fff;
          background: linear-gradient(135deg, #7c3aed, #5b21b6);
          text-decoration: none;
          font-size: 15px;
          font-weight: 950;
          cursor: pointer;
        }
        .primaryButton:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }
        .notice {
          margin: 0;
          padding: 13px 15px;
          border-radius: 14px;
          font-weight: 750;
          line-height: 1.5;
        }
        .notice.error {
          color: #991b1b;
          background: #fef2f2;
          border: 1px solid #fecaca;
        }
        .notice.success {
          color: #166534;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
        }
        .loginPrompt {
          margin: 2px 0 0;
          text-align: center;
          color: #6d647c;
        }
        @media (max-width: 820px) {
          .signupShell {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 560px) {
          .signupPage {
            padding: 28px 12px 60px;
          }
          .signupIntro,
          .signupCard {
            padding: 24px 20px;
            border-radius: 25px;
          }
          .twoColumns {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}

function SignupLoading() {
  return (
    <main className="page-wrap">
      <div className="container">
        <p>Preparing parent signup…</p>
      </div>
    </main>
  );
}

function escapeHtml(value: string) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
