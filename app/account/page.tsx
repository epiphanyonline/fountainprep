"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import {
  getAcademySubscriptionAccess,
  type AcademySubscriptionAccess,
} from "../fountaintalk/services/subscriptionAccess";

type UserProfile = {
  id: string;
  public_id: string | null;
  email: string | null;
  role: string;
  full_name: string | null;
  account_type?:
    | "PARENT"
    | "ADULT_LEARNER"
    | null;
};

type SubscriptionLearner = {
  id: string;
  fullName: string;
  childAge: number | null;
  ageGroup: string | null;
  isSelfLearner: boolean;
  covered: boolean;
};

type SubscriptionLearnerData = {
  subscription: {
    id: string;
    planId: string;
    status: string;
  } | null;

  plan: {
    id: string;
    name: string;
    includedLearnerCount: number | null;
  } | null;

  learners: SubscriptionLearner[];
  coveredCount: number;
  remainingSlots: number | null;
};

type SubscriptionLearnerResponse =
  | SubscriptionLearnerData
  | {
      error?: string;
    };

export default function AccountPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [message, setMessage] =
    useState("Loading...");

  const [copied, setCopied] =
    useState(false);

  const [
    managingBilling,
    setManagingBilling,
  ] = useState(false);

  const [billingError, setBillingError] =
    useState<string | null>(null);

  const [
    subscriptionAccess,
    setSubscriptionAccess,
  ] =
    useState<AcademySubscriptionAccess | null>(
      null,
    );

  const [
    loadingSubscription,
    setLoadingSubscription,
  ] = useState(true);

  const [
    subscriptionLearnerData,
    setSubscriptionLearnerData,
  ] =
    useState<SubscriptionLearnerData | null>(
      null,
    );

  const [
    loadingSubscriptionLearners,
    setLoadingSubscriptionLearners,
  ] = useState(true);

  const [
    updatingLearnerId,
    setUpdatingLearnerId,
  ] = useState<string | null>(null);

  const [
    learnerManagementError,
    setLearnerManagementError,
  ] = useState<string | null>(null);

  const loadSubscriptionLearners =
    useCallback(async () => {
      setLoadingSubscriptionLearners(true);
      setLearnerManagementError(null);

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const accessToken =
          session?.access_token ?? "";

        if (!accessToken) {
          throw new Error(
            "Your session has expired. Please sign in again.",
          );
        }

        const response = await fetch(
          "/api/academy/subscription-learners",
          {
            headers: {
              Authorization:
                `Bearer ${accessToken}`,
            },
          },
        );

        const data =
          (await response.json()) as
            SubscriptionLearnerResponse;

        if (!response.ok) {
          throw new Error(
            "error" in data && data.error
              ? data.error
              : "Unable to load subscription learners.",
          );
        }

        setSubscriptionLearnerData(
          data as SubscriptionLearnerData,
        );
      } catch (error: unknown) {
        setSubscriptionLearnerData(null);

        setLearnerManagementError(
          error instanceof Error
            ? error.message
            : "Unable to load subscription learners.",
        );
      } finally {
        setLoadingSubscriptionLearners(
          false,
        );
      }
    }, []);

  useEffect(() => {
    async function loadAccount() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoadingSubscription(false);
        setLoadingSubscriptionLearners(
          false,
        );
        router.push("/login");
        return;
      }

      const {
        data: userProfile,
        error,
      } = await supabase
        .from("user_profiles")
        .select(
          "id, public_id, email, role, full_name",
        )
        .eq("id", user.id)
        .single();

      if (error || !userProfile) {
        setLoadingSubscription(false);
        setLoadingSubscriptionLearners(
          false,
        );
        setMessage("Profile not found.");
        setLoading(false);
        return;
      }

      let accountType:
        | "PARENT"
        | "ADULT_LEARNER"
        | null = null;

      if (userProfile.role === "PARENT") {
        const {
          data: parentProfile,
        } = await supabase
          .from("parent_profiles")
          .select("account_type")
          .eq("user_id", user.id)
          .maybeSingle();

        accountType =
          parentProfile?.account_type ===
          "ADULT_LEARNER"
            ? "ADULT_LEARNER"
            : "PARENT";
      }

      setProfile({
        ...userProfile,
        account_type: accountType,
      });

      if (userProfile.role === "PARENT") {
        try {
          const access =
            await getAcademySubscriptionAccess(
              null,
            );

          setSubscriptionAccess(access);

          await loadSubscriptionLearners();
        } catch (subscriptionError) {
          console.error(
            "Unable to load academy subscription summary:",
            subscriptionError,
          );

          setSubscriptionAccess(null);
          setSubscriptionLearnerData(null);
          setLoadingSubscriptionLearners(
            false,
          );
        } finally {
          setLoadingSubscription(false);
        }
      } else {
        setLoadingSubscription(false);
        setLoadingSubscriptionLearners(
          false,
        );
      }

      setMessage("");
      setLoading(false);
    }

    void loadAccount();
  }, [loadSubscriptionLearners, router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  async function handleCopyId() {
    if (!profile?.public_id) return;

    await navigator.clipboard.writeText(
      profile.public_id,
    );

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  async function handleManageBilling() {
    try {
      setManagingBilling(true);
      setBillingError(null);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        "/api/stripe/academy-customer-portal",
        {
          method: "POST",
          headers: {
            Authorization:
              `Bearer ${session.access_token}`,
          },
        },
      );

      const result =
        (await response.json()) as {
          url?: string;
          error?: string;
        };

      if (!response.ok || !result.url) {
        throw new Error(
          result.error ??
            "Unable to open subscription management.",
        );
      }

      window.location.assign(result.url);
    } catch (error: unknown) {
      console.error(
        "Unable to open academy billing portal:",
        error,
      );

      setBillingError(
        error instanceof Error
          ? error.message
          : "Unable to open subscription management.",
      );

      setManagingBilling(false);
    }
  }

  async function handleSubscriptionLearnerChange(
    studentId: string,
    covered: boolean,
  ) {
    setUpdatingLearnerId(studentId);
    setLearnerManagementError(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const accessToken =
        session?.access_token ?? "";

      if (!accessToken) {
        throw new Error(
          "Your session has expired. Please sign in again.",
        );
      }

      const response = await fetch(
        "/api/academy/subscription-learners",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            studentId,
            covered,
          }),
        },
      );

      const data =
        (await response.json()) as {
          success?: boolean;
          error?: string;
        };

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Unable to update subscription learner.",
        );
      }

      await loadSubscriptionLearners();
    } catch (error: unknown) {
      setLearnerManagementError(
        error instanceof Error
          ? error.message
          : "Unable to update subscription learner.",
      );
    } finally {
      setUpdatingLearnerId(null);
    }
  }

  function dashboardLink() {
    if (!profile) return "/";

    if (profile.role === "ADMIN") {
      return "/admin";
    }

    if (profile.role === "TUTOR") {
      return "/tutor/dashboard";
    }

    if (
      profile.role === "PARENT" &&
      profile.account_type ===
        "ADULT_LEARNER"
    ) {
      return "/learner/dashboard";
    }

    if (profile.role === "PARENT") {
      return "/parent/dashboard";
    }

    return "/";
  }

  function publicIdLabel() {
    if (!profile) return "Account ID";

    if (
      profile.role === "PARENT" &&
      profile.account_type ===
        "ADULT_LEARNER"
    ) {
      return "Learner ID";
    }

    if (profile.role === "TUTOR") {
      return "Tutor ID";
    }

    if (profile.role === "PARENT") {
      return "Parent ID";
    }

    if (profile.role === "ADMIN") {
      return "Admin ID";
    }

    return "Account ID";
  }

  function roleLabel() {
    if (!profile) return "-";

    if (
      profile.role === "PARENT" &&
      profile.account_type ===
        "ADULT_LEARNER"
    ) {
      return "Adult Learner";
    }

    if (profile.role === "PARENT") {
      return "Parent or Guardian";
    }

    if (profile.role === "TUTOR") {
      return "Tutor";
    }

    if (profile.role === "ADMIN") {
      return "Administrator";
    }

    return profile.role;
  }

  function learnerDescription(
    learner: SubscriptionLearner,
  ) {
    if (learner.isSelfLearner) {
      return "Independent adult learner";
    }

    if (learner.childAge !== null) {
      return `Age ${learner.childAge}`;
    }

    if (learner.ageGroup) {
      return learner.ageGroup;
    }

    return "Learner profile";
  }

  function planLimitLabel() {
    const limit =
      subscriptionLearnerData?.plan
        ?.includedLearnerCount;

    if (limit === null) {
      return "Unlimited learners";
    }

    if (typeof limit === "number") {
      return `${limit} learner${
        limit === 1 ? "" : "s"
      } included`;
    }

    return "";
  }

  const learnerLimitReached =
    subscriptionLearnerData?.remainingSlots ===
    0;

  const hasActiveSubscription =
    Boolean(
      subscriptionLearnerData?.subscription,
    );

  if (loading) {
    return (
      <main className="page-wrap">
        <div
          className="container"
          style={{ maxWidth: 900 }}
        >
          <div
            className="card"
            style={{ padding: 32 }}
          >
            <p>{message}</p>
          </div>
        </div>
      </main>
    );
  }

  if (!profile) return null;

  return (
    <main className="page-wrap">
      <div
        className="container"
        style={{ maxWidth: 1100 }}
      >
        <section
          className="card"
          style={{ padding: 36 }}
        >
          <p
            style={{
              margin: 0,
              color: "#6f42c1",
              fontWeight: 700,
            }}
          >
            Account
          </p>

          <h1
            className="page-title"
            style={{ marginTop: 10 }}
          >
            My Account
          </h1>

          <div
            className="kpi-list"
            style={{ marginTop: 24 }}
          >
            <div className="kpi-row">
              <span className="kpi-label">
                Auth Email
              </span>

              <span className="kpi-value">
                {profile.email || "-"}
              </span>
            </div>

            <div className="kpi-row">
              <span className="kpi-label">
                Profile Name
              </span>

              <span className="kpi-value">
                {profile.full_name || "-"}
              </span>
            </div>

            <div className="kpi-row">
              <span className="kpi-label">
                Role
              </span>

              <span className="kpi-value">
                {roleLabel()}
              </span>
            </div>

            <div className="kpi-row">
              <span className="kpi-label">
                {publicIdLabel()}
              </span>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "flex-end",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <span
                  className="kpi-value"
                  style={{
                    letterSpacing: 0.5,
                    fontWeight: 900,
                    color: "#111827",
                  }}
                >
                  {profile.public_id ||
                    "Generating..."}
                </span>

                {profile.public_id ? (
                  <button
                    type="button"
                    onClick={() =>
                      void handleCopyId()
                    }
                    style={{
                      border:
                        "1px solid #e5e7eb",
                      background: copied
                        ? "#f3edff"
                        : "#ffffff",
                      color: copied
                        ? "#6f42c1"
                        : "#374151",
                      borderRadius: 999,
                      padding: "6px 13px",
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: "pointer",
                      boxShadow:
                        "0 8px 20px rgba(17, 24, 39, 0.06)",
                    }}
                  >
                    {copied
                      ? "Copied"
                      : "Copy"}
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          {profile.role === "PARENT" ? (
            <section
              style={{
                marginTop: 28,
                padding: 24,
                border:
                  "1px solid #e5e7eb",
                borderRadius: 20,
                background: "#faf7ff",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#6f42c1",
                  fontWeight: 800,
                }}
              >
                Academy Subscription
              </p>

              {loadingSubscription ? (
                <p style={{ marginTop: 12 }}>
                  Loading subscription...
                </p>
              ) : subscriptionAccess ? (
                <>
                  <h2
                    style={{
                      margin: "10px 0 0",
                      fontSize: 26,
                    }}
                  >
                    {
                      subscriptionAccess.plan
                        .name
                    }
                  </h2>

                  <p style={{ marginTop: 10 }}>
                    Status:{" "}
                    <strong>
                      {
                        subscriptionAccess.status
                      }
                    </strong>
                  </p>

                  {subscriptionAccess.currentPeriodEnd ? (
                    <p
                      style={{
                        marginTop: 8,
                      }}
                    >
                      {subscriptionAccess.cancelAtPeriodEnd
                        ? "Access ends"
                        : "Next renewal"}
                      :{" "}
                      <strong>
                        {new Intl.DateTimeFormat(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        ).format(
                          new Date(
                            subscriptionAccess.currentPeriodEnd,
                          ),
                        )}
                      </strong>
                    </p>
                  ) : null}

                  {subscriptionAccess.cancelAtPeriodEnd ? (
                    <p
                      style={{
                        marginTop: 14,
                        padding: 14,
                        borderRadius: 14,
                        background:
                          "#fff7ed",
                        color: "#9a3412",
                        fontWeight: 700,
                      }}
                    >
                      This subscription is
                      scheduled to end at the
                      close of the current
                      billing period.
                    </p>
                  ) : null}
                </>
              ) : (
                <p style={{ marginTop: 12 }}>
                  Subscription information is
                  currently unavailable.
                </p>
              )}
            </section>
          ) : null}

          {profile.role === "PARENT" ? (
            <section
              style={{
                marginTop: 24,
                padding: 24,
                border:
                  "1px solid #e5e7eb",
                borderRadius: 20,
                background: "#ffffff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "flex-start",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      color: "#6f42c1",
                      fontWeight: 800,
                    }}
                  >
                    Covered Learners
                  </p>

                  <h2
                    style={{
                      margin: "8px 0 0",
                      fontSize: 24,
                    }}
                  >
                    Manage academy access
                  </h2>

                  <p
                    style={{
                      margin:
                        "8px 0 0",
                      color: "#4b5563",
                      lineHeight: 1.6,
                    }}
                  >
                    Choose which learner
                    profiles can use paid
                    academy content.
                  </p>
                </div>

                {subscriptionLearnerData
                  ?.plan ? (
                  <div
                    style={{
                      padding:
                        "10px 14px",
                      borderRadius: 14,
                      background:
                        "#f3edff",
                      color: "#5b21b6",
                      fontWeight: 800,
                    }}
                  >
                    {
                      subscriptionLearnerData
                        .coveredCount
                    }
                    {subscriptionLearnerData
                      .plan
                      .includedLearnerCount !==
                    null
                      ? ` of ${subscriptionLearnerData.plan.includedLearnerCount}`
                      : ""}{" "}
                    covered
                  </div>
                ) : null}
              </div>

              {loadingSubscriptionLearners ? (
                <p style={{ marginTop: 18 }}>
                  Loading learners...
                </p>
              ) : learnerManagementError &&
                !subscriptionLearnerData ? (
                <div
                  style={{
                    marginTop: 18,
                    padding: 16,
                    borderRadius: 14,
                    background: "#fef2f2",
                    color: "#b91c1c",
                    fontWeight: 700,
                  }}
                >
                  <p style={{ margin: 0 }}>
                    {
                      learnerManagementError
                    }
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      void loadSubscriptionLearners()
                    }
                    className="btn-secondary"
                    style={{
                      marginTop: 12,
                    }}
                  >
                    Try Again
                  </button>
                </div>
              ) : !hasActiveSubscription ? (
                <div
                  style={{
                    marginTop: 18,
                    padding: 18,
                    borderRadius: 16,
                    background: "#f9fafb",
                    border:
                      "1px solid #e5e7eb",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontWeight: 800,
                      color: "#111827",
                    }}
                  >
                    No active academy
                    subscription
                  </p>

                  <p
                    style={{
                      margin:
                        "8px 0 0",
                      color: "#4b5563",
                      lineHeight: 1.6,
                    }}
                  >
                    Select an academy plan
                    before assigning paid
                    access to learners.
                  </p>

                  <Link
                    href="/pricing?product=academies"
                    className="btn-primary"
                    style={{
                      display:
                        "inline-flex",
                      marginTop: 14,
                    }}
                  >
                    View Academy Plans
                  </Link>
                </div>
              ) : (
                <>
                  <div
                    style={{
                      marginTop: 18,
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap",
                      color: "#4b5563",
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    <span>
                      {planLimitLabel()}
                    </span>

                    {subscriptionLearnerData
                      ?.remainingSlots !==
                      null &&
                    subscriptionLearnerData
                      ?.remainingSlots !==
                      undefined ? (
                      <span>
                        •{" "}
                        {
                          subscriptionLearnerData.remainingSlots
                        }{" "}
                        slot
                        {subscriptionLearnerData.remainingSlots ===
                        1
                          ? ""
                          : "s"}{" "}
                        remaining
                      </span>
                    ) : null}
                  </div>

                  {learnerLimitReached ? (
                    <p
                      style={{
                        marginTop: 14,
                        padding: 14,
                        borderRadius: 14,
                        background:
                          "#fff7ed",
                        color: "#9a3412",
                        fontWeight: 700,
                      }}
                    >
                      Your plan&apos;s learner
                      limit has been reached.
                      Remove a covered learner
                      or upgrade your plan to
                      add another.
                    </p>
                  ) : null}

                  {learnerManagementError ? (
                    <p
                      role="alert"
                      style={{
                        marginTop: 14,
                        padding: 14,
                        borderRadius: 14,
                        background:
                          "#fef2f2",
                        color: "#b91c1c",
                        fontWeight: 700,
                      }}
                    >
                      {
                        learnerManagementError
                      }
                    </p>
                  ) : null}

                  {subscriptionLearnerData
                    ?.learners.length ? (
                    <div
                      style={{
                        display: "grid",
                        gap: 12,
                        marginTop: 18,
                      }}
                    >
                      {subscriptionLearnerData.learners.map(
                        (learner) => {
                          const updating =
                            updatingLearnerId ===
                            learner.id;

                          const cannotAdd =
                            !learner.covered &&
                            learnerLimitReached;

                          const cannotRemove =
                            learner.covered &&
                            learner.isSelfLearner &&
                            subscriptionLearnerData.coveredCount ===
                              1;

                          return (
                            <article
                              key={
                                learner.id
                              }
                              style={{
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                justifyContent:
                                  "space-between",
                                gap: 16,
                                flexWrap:
                                  "wrap",
                                padding: 18,
                                border:
                                  learner.covered
                                    ? "1px solid #c4b5fd"
                                    : "1px solid #e5e7eb",
                                borderRadius: 16,
                                background:
                                  learner.covered
                                    ? "#faf7ff"
                                    : "#ffffff",
                              }}
                            >
                              <div>
                                <p
                                  style={{
                                    margin: 0,
                                    fontWeight: 900,
                                    color:
                                      "#111827",
                                  }}
                                >
                                  {
                                    learner.fullName
                                  }
                                </p>

                                <p
                                  style={{
                                    margin:
                                      "5px 0 0",
                                    color:
                                      "#6b7280",
                                  }}
                                >
                                  {learnerDescription(
                                    learner,
                                  )}
                                </p>

                                <p
                                  style={{
                                    margin:
                                      "7px 0 0",
                                    color:
                                      learner.covered
                                        ? "#5b21b6"
                                        : "#6b7280",
                                    fontSize: 13,
                                    fontWeight: 800,
                                  }}
                                >
                                  {learner.covered
                                    ? "Academy access enabled"
                                    : "Not covered by this plan"}
                                </p>
                              </div>

                              <button
                                type="button"
                                className={
                                  learner.covered
                                    ? "btn-secondary"
                                    : "btn-primary"
                                }
                                disabled={
                                  updating ||
                                  cannotAdd ||
                                  cannotRemove
                                }
                                onClick={() =>
                                  void handleSubscriptionLearnerChange(
                                    learner.id,
                                    !learner.covered,
                                  )
                                }
                              >
                                {updating
                                  ? "Updating..."
                                  : learner.covered
                                    ? cannotRemove
                                      ? "Required"
                                      : "Remove Access"
                                    : cannotAdd
                                      ? "Limit Reached"
                                      : "Add Access"}
                              </button>
                            </article>
                          );
                        },
                      )}
                    </div>
                  ) : (
                    <div
                      style={{
                        marginTop: 18,
                        padding: 18,
                        borderRadius: 16,
                        background:
                          "#f9fafb",
                        border:
                          "1px solid #e5e7eb",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontWeight: 800,
                        }}
                      >
                        No learner profiles
                        found.
                      </p>

                      {profile.account_type ===
                      "ADULT_LEARNER" ? (
                        <p
                          style={{
                            margin:
                              "8px 0 0",
                            color:
                              "#4b5563",
                          }}
                        >
                          Complete your learner
                          profile before
                          assigning academy
                          access.
                        </p>
                      ) : (
                        <>
                          <p
                            style={{
                              margin:
                                "8px 0 0",
                              color:
                                "#4b5563",
                            }}
                          >
                            Add a learner
                            profile before
                            assigning academy
                            access.
                          </p>

                          <Link
                            href="/parent/students"
                            className="btn-secondary"
                            style={{
                              display:
                                "inline-flex",
                              marginTop: 14,
                            }}
                          >
                            Add Learner
                          </Link>
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </section>
          ) : null}

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginTop: 28,
            }}
          >
            <Link
              href={dashboardLink()}
              className="btn-primary"
            >
              {profile.account_type ===
              "ADULT_LEARNER"
                ? "Go to My Learning"
                : "Go to Dashboard"}
            </Link>

            {profile.role === "PARENT" &&
            hasActiveSubscription ? (
              <button
                type="button"
                onClick={() =>
                  void handleManageBilling()
                }
                className="btn-secondary"
                disabled={managingBilling}
              >
                {managingBilling
                  ? "Opening Billing..."
                  : "Manage Academy Subscription"}
              </button>
            ) : null}

            <button
              type="button"
              onClick={() =>
                void handleLogout()
              }
              className="btn-secondary"
            >
              Logout
            </button>
          </div>

          {billingError ? (
            <p
              role="alert"
              style={{
                marginTop: 14,
                color: "#b91c1c",
                fontWeight: 700,
              }}
            >
              {billingError}
            </p>
          ) : null}
        </section>

        {profile.role === "ADMIN" ? (
          <section style={{ marginTop: 28 }}>
            <h2
              style={{
                fontSize: 30,
                marginBottom: 16,
              }}
            >
              Admin Control Centre
            </h2>

            <div
              className="three-col-grid"
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(3, minmax(0, 1fr))",
                gap: 20,
              }}
            >
              <AdminCard
                title="Tutor Approval"
                text="Review, approve, reject, verify and list tutors."
                href="/admin/tutors"
              />

              <AdminCard
                title="Bookings"
                text="Monitor parent bookings and lesson status."
                href="/admin/bookings"
              />

              <AdminCard
                title="Payments"
                text="Track payment status, paid bookings and failed payments."
                href="/admin/payments"
              />

              <AdminCard
                title="Parents"
                text="View parent accounts and student activity."
                href="/admin/parents"
              />

              <AdminCard
                title="Students"
                text="Monitor student profiles and learning needs."
                href="/admin/students"
              />

              <AdminCard
                title="Reports"
                text="View platform activity and operational summaries."
                href="/admin/reports"
              />
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

function AdminCard({
  title,
  text,
  href,
}: {
  title: string;
  text: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="card"
      style={{
        padding: 24,
        display: "block",
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: 22,
        }}
      >
        {title}
      </h3>

      <p
        className="page-subtitle"
        style={{ marginTop: 10 }}
      >
        {text}
      </p>

      <p
        style={{
          marginTop: 18,
          color: "#6f42c1",
          fontWeight: 800,
        }}
      >
        Open →
      </p>
    </Link>
  );
}