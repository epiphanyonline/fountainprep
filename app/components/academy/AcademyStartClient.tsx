"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { supabase } from "@/app/lib/supabase";
import {
  getAcademyMarketing,
} from "@/app/data/academies/marketing";
import {
  academyClassroomHref,
  academyPricingHref,
} from "@/app/data/academy-routing";
import {
  getAcademySubscriptionAccess,
} from "@/app/fountaintalk/services/subscriptionAccess";

type StudentRow = {
  id: string;
  full_name: string;
  child_age: number | null;
  age_group: string | null;
  is_self_learner: boolean | null;
};

type AccountType =
  | "PARENT"
  | "ADULT_LEARNER";

type SeatLearner = {
  id: string;
  covered: boolean;
};

type SeatState = {
  planId: string | null;
  planName: string | null;
  includedLearnerCount:
    number | null;
  coveredCount: number;
  remainingSlots:
    number | null;
  learners: SeatLearner[];
};

export default function AcademyStartClient({
  academySlug,
}: {
  academySlug: string;
}) {
  const router = useRouter();
  const searchParams =
    useSearchParams();

  const preferredStudentId =
    searchParams.get("studentId");

  const biographyId =
    searchParams.get(
      "biographyId",
    );

  const checkoutSessionId =
    searchParams.get(
      "session_id",
    );

  const returningFromCheckout =
    searchParams.get(
      "subscription",
    ) === "success" &&
    Boolean(
      checkoutSessionId,
    );

  const academy = useMemo(
    () =>
      getAcademyMarketing(
        academySlug,
      ),
    [academySlug],
  );

  const [students, setStudents] =
    useState<StudentRow[]>([]);
  const [
    accountType,
    setAccountType,
  ] =
    useState<AccountType>("PARENT");
  const [
    seatState,
    setSeatState,
  ] =
    useState<SeatState | null>(
      null,
    );
  const [loading, setLoading] =
    useState(true);
  const [
    checkingStudent,
    setCheckingStudent,
  ] =
    useState<string | null>(
      null,
    );
  const [
    releasingStudent,
    setReleasingStudent,
  ] =
    useState<string | null>(
      null,
    );
  const [error, setError] =
    useState<string | null>(
      null,
    );

  const autoRoutedRef =
    useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function loadStudents() {
      if (!academy) {
        if (!cancelled) {
          setError(
            "The selected academy could not be found.",
          );
          setLoading(false);
        }
        return;
      }

      try {
        const {
          data: sessionData,
          error: sessionError,
        } =
          await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        const session =
          sessionData.session;
        const user =
          session?.user ?? null;

        if (!user) {
          const nextParams =
            new URLSearchParams();

          if (
            preferredStudentId
          ) {
            nextParams.set(
              "studentId",
              preferredStudentId,
            );
          }

          if (biographyId) {
            nextParams.set(
              "biographyId",
              biographyId,
            );
          }

          const nextQuery =
            nextParams.toString();

          const nextPath =
            `/academies/${academy.slug}/start` +
            (nextQuery
              ? `?${nextQuery}`
              : "");

          router.replace(
            `/login?next=${encodeURIComponent(
              nextPath,
            )}`,
          );
          return;
        }

        if (
          returningFromCheckout &&
          checkoutSessionId &&
          session?.access_token
        ) {
          let confirmed = false;

          for (
            let attempt = 0;
            attempt < 6;
            attempt += 1
          ) {
            const response =
              await fetch(
                "/api/stripe/academy-subscription-confirm",
                {
                  method: "POST",
                  headers: {
                    "Content-Type":
                      "application/json",
                    Authorization:
                      `Bearer ${session.access_token}`,
                  },
                  body: JSON.stringify({
                    sessionId:
                      checkoutSessionId,
                  }),
                },
              );

            const result =
              (await response.json()) as {
                confirmed?: boolean;
                pending?: boolean;
                error?: string;
              };

            if (
              response.ok &&
              result.confirmed
            ) {
              confirmed = true;
              break;
            }

            if (
              response.status === 202 ||
              result.pending
            ) {
              await new Promise(
                (resolve) =>
                  window.setTimeout(
                    resolve,
                    900,
                  ),
              );
              continue;
            }

            throw new Error(
              result.error ??
                "We could not confirm the completed Stripe checkout.",
            );
          }

          if (!confirmed) {
            throw new Error(
              "Your payment was received, but access is still being activated. Please refresh in a moment.",
            );
          }

          const clean =
            new URL(
              window.location.href,
            );

          clean.searchParams.delete(
            "subscription",
          );
          clean.searchParams.delete(
            "session_id",
          );

          window.history.replaceState(
            {},
            "",
            clean.pathname +
              clean.search,
          );
        }

        const {
          data: parent,
          error: parentError,
        } = await supabase
          .from(
            "parent_profiles",
          )
          .select(
            "id, account_type",
          )
          .eq(
            "user_id",
            user.id,
          )
          .maybeSingle();

        if (parentError) {
          throw parentError;
        }

        if (!parent) {
          const returnParams =
            new URLSearchParams();

          if (biographyId) {
            returnParams.set(
              "biographyId",
              biographyId,
            );
          }

          const returnQuery =
            returnParams.toString();

          const returnTo =
            encodeURIComponent(
              `/academies/${academy.slug}/start` +
                (returnQuery
                  ? `?${returnQuery}`
                  : ""),
            );

          router.replace(
            `/parent/onboarding?next=${returnTo}`,
          );
          return;
        }

        const resolvedAccountType:
          AccountType =
            parent.account_type ===
            "ADULT_LEARNER"
              ? "ADULT_LEARNER"
              : "PARENT";

        const {
          data,
          error: studentsError,
        } = await supabase
          .from(
            "student_profiles",
          )
          .select(
            `
              id,
              full_name,
              child_age,
              age_group,
              is_self_learner
            `,
          )
          .eq(
            "parent_id",
            parent.id,
          )
          .order("created_at", {
            ascending: false,
          });

        if (studentsError) {
          throw studentsError;
        }

        const learnerRows =
          (data as
            | StudentRow[]
            | null) ?? [];

        let loadedSeatState:
          SeatState | null = null;

        if (
          academy.academyCode ===
            "personal-finance" &&
          session?.access_token
        ) {
          const seatResponse =
            await fetch(
              "/api/academy/subscription-learners",
              {
                headers: {
                  Authorization:
                    `Bearer ${session.access_token}`,
                },
              },
            );

          if (seatResponse.ok) {
            const seatResult =
              (await seatResponse.json()) as {
                subscription:
                  | {
                      id: string;
                      planId: string;
                      status: string;
                    }
                  | null;
                plan:
                  | {
                      id: string;
                      name: string;
                      includedLearnerCount:
                        number | null;
                    }
                  | null;
                learners: Array<{
                  id: string;
                  covered: boolean;
                }>;
                coveredCount: number;
                remainingSlots:
                  number | null;
              };

            if (
              seatResult.subscription &&
              seatResult.plan
            ) {
              loadedSeatState = {
                planId:
                  seatResult.plan.id,
                planName:
                  seatResult.plan.name,
                includedLearnerCount:
                  seatResult.plan
                    .includedLearnerCount,
                coveredCount:
                  seatResult.coveredCount,
                remainingSlots:
                  seatResult.remainingSlots,
                learners:
                  seatResult.learners.map(
                    (learner) => ({
                      id: learner.id,
                      covered:
                        learner.covered,
                    }),
                  ),
              };
            }
          }
        }

        if (!cancelled) {
          setAccountType(
            resolvedAccountType,
          );
          setStudents(
            learnerRows,
          );
          setSeatState(
            loadedSeatState,
          );
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof
              Error
              ? loadError.message
              : "Unable to load learners.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadStudents();

    return () => {
      cancelled = true;
    };
  }, [
    academy,
    preferredStudentId,
    biographyId,
    returningFromCheckout,
    checkoutSessionId,
    router,
  ]);

  async function assignSeat(
    studentId: string,
  ) {
    const {
      data: sessionData,
    } =
      await supabase.auth.getSession();

    const accessToken =
      sessionData.session
        ?.access_token;

    if (!accessToken) {
      throw new Error(
        "Please sign in again to manage learner access.",
      );
    }

    const response =
      await fetch(
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
            covered: true,
          }),
        },
      );

    const result =
      (await response.json()) as {
        success?: boolean;
        error?: string;
      };

    if (!response.ok) {
      throw new Error(
        result.error ??
          "Unable to assign this learner to the Academy subscription.",
      );
    }

    setSeatState(
      (current) => {
        if (!current) {
          return current;
        }

        const wasCovered =
          current.learners.some(
            (learner) =>
              learner.id ===
                studentId &&
              learner.covered,
          );

        if (wasCovered) {
          return current;
        }

        return {
          ...current,
          coveredCount:
            current.coveredCount +
            1,
          remainingSlots:
            current.remainingSlots ===
            null
              ? null
              : Math.max(
                  current.remainingSlots -
                    1,
                  0,
                ),
          learners:
            current.learners.map(
              (learner) =>
                learner.id ===
                studentId
                  ? {
                      ...learner,
                      covered:
                        true,
                    }
                  : learner,
            ),
        };
      },
    );
  }

  async function releaseSeat(
    studentId: string,
  ) {
    try {
      setReleasingStudent(
        studentId,
      );
      setError(null);

      const {
        data: sessionData,
      } =
        await supabase.auth.getSession();

      const accessToken =
        sessionData.session
          ?.access_token;

      if (!accessToken) {
        throw new Error(
          "Please sign in again to manage learner access.",
        );
      }

      const response =
        await fetch(
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
              covered: false,
            }),
          },
        );

      const result =
        (await response.json()) as {
          success?: boolean;
          error?: string;
        };

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Unable to release this learner place.",
        );
      }

      setSeatState(
        (current) => {
          if (!current) {
            return current;
          }

          const wasCovered =
            current.learners.some(
              (learner) =>
                learner.id ===
                  studentId &&
                learner.covered,
            );

          if (!wasCovered) {
            return current;
          }

          return {
            ...current,
            coveredCount:
              Math.max(
                current.coveredCount -
                  1,
                0,
              ),
            remainingSlots:
              current.remainingSlots ===
              null
                ? null
                : current.remainingSlots +
                  1,
            learners:
              current.learners.map(
                (learner) =>
                  learner.id ===
                  studentId
                    ? {
                        ...learner,
                        covered:
                          false,
                      }
                    : learner,
              ),
          };
        },
      );
    } catch (releaseError) {
      setError(
        releaseError instanceof Error
          ? releaseError.message
          : "Unable to release learner place.",
      );
    } finally {
      setReleasingStudent(
        null,
      );
    }
  }

  function learnerCovered(
    studentId: string,
  ) {
    return (
      seatState?.learners.some(
        (learner) =>
          learner.id ===
            studentId &&
          learner.covered,
      ) ?? false
    );
  }

  async function continueWithLearner(
    studentId: string,
  ) {
    if (!academy) return;

    try {
      setCheckingStudent(
        studentId,
      );
      setError(null);

      const access =
        await getAcademySubscriptionAccess(
          studentId,
        );

      const hasActivePaidSubscription =
        [
          "active",
          "trialing",
        ].includes(
          access.status,
        ) &&
        access.plan.accessTier !==
          "free";

      if (
        hasActivePaidSubscription &&
        !access.learnerCovered
      ) {
        await assignSeat(
          studentId,
        );
      }

      if (
        hasActivePaidSubscription
      ) {
        const classroomHref =
          academyClassroomHref({
            studentId,
            academy:
              academy.academyCode,
            programme:
              academy.programmeId,
          });

        router.push(
          biographyId
            ? `${classroomHref}&biographyId=${encodeURIComponent(
                biographyId,
              )}`
            : classroomHref,
        );
        return;
      }

      const pricingHref =
        academyPricingHref({
          studentId,
          academy:
            academy.academyCode,
          programme:
            academy.programmeId,
        });

      router.push(
        biographyId
          ? `${pricingHref}&biographyId=${encodeURIComponent(
              biographyId,
            )}`
          : pricingHref,
      );
    } catch (selectError) {
      setError(
        selectError instanceof
          Error
          ? selectError.message
          : "Unable to continue.",
      );
      setCheckingStudent(
        null,
      );
    }
  }

  useEffect(() => {
    if (
      loading ||
      accountType !==
        "ADULT_LEARNER" ||
      autoRoutedRef.current
    ) {
      return;
    }

    const selfLearner =
      students.find(
        (student) =>
          student.is_self_learner ===
            true,
      ) ??
      students.find(
        (student) =>
          student.age_group ===
          "adult",
      );

    if (!selfLearner) {
      setError(
        "Your Individual Learner profile is not ready yet. Please complete your learner account before continuing.",
      );
      return;
    }

    autoRoutedRef.current =
      true;

    void continueWithLearner(
      selfLearner.id,
    );
  }, [
    loading,
    accountType,
    students,
  ]);

  if (loading) {
    return (
      <main className="startPage">
        <section className="startCard">
          <p className="eyebrow">
            Financial Education
          </p>
          <h1>
            Preparing your next step...
          </h1>
          <p className="intro">
            We’re getting your Financial
            Literacy pathway ready.
          </p>
        </section>

        <PageStyles />
      </main>
    );
  }

  if (!academy) {
    return (
      <main className="startPage">
        <section className="startCard">
          <h1>
            Academy not found
          </h1>
          <Link href="/financial-education">
            Return to Financial
            Education
          </Link>
        </section>

        <PageStyles />
      </main>
    );
  }

  if (
    accountType ===
    "ADULT_LEARNER"
  ) {
    return (
      <main className="startPage">
        <section className="startCard individualCard">
          <p className="eyebrow">
            Financial Literacy
          </p>

          <h1>
            Taking you back to your
            learning.
          </h1>

          <p className="intro">
            Your Individual account
            keeps one continuous
            Financial Literacy record,
            so there is no learner to
            select.
          </p>

          {error ? (
            <>
              <div className="errorMessage">
                {error}
              </div>

              <div className="actions">
                <Link
                  href={
                    `/signup/learner?next=` +
                    encodeURIComponent(
                      "/academies/financial-literacy/start",
                    )
                  }
                  className="primary"
                >
                  Complete learner
                  profile
                </Link>

                <Link
                  href="/financial-education"
                  className="secondary"
                >
                  Financial Education
                </Link>
              </div>
            </>
          ) : (
            <div className="routeStatus">
              <span className="routeSpinner" />
              Checking your access and
              opening the classroom...
            </div>
          )}
        </section>

        <PageStyles />
      </main>
    );
  }

  const sortedStudents = [
    ...students,
  ].sort((a, b) => {
    if (
      a.id ===
      preferredStudentId
    ) {
      return -1;
    }

    if (
      b.id ===
      preferredStudentId
    ) {
      return 1;
    }

    return 0;
  });

  const isFamilySeatPlan =
    Boolean(
      seatState?.planId
        ?.toLowerCase()
        .includes("family") ||
        seatState?.planName
          ?.toLowerCase()
          .includes("family"),
    );

  return (
    <main className="startPage">
      <section className="startCard">
        <p className="eyebrow">
          {academy.title}
        </p>

        <h1>
          Who is learning?
        </h1>

        <p className="intro">
          Choose the learner so their
          lessons, progress and
          achievements stay connected
          to one learning record.
        </p>

        {isFamilySeatPlan &&
        seatState ? (
          <div className="seatSummary">
            <div>
              <span>
                Family Financial
                Education
              </span>
              <strong>
                {
                  seatState.coveredCount
                }
                {" of "}
                {seatState
                  .includedLearnerCount ??
                  "∞"}{" "}
                learner places used
              </strong>
            </div>

            <p>
              You may keep all children
              on your FountainPrep
              account. This subscription
              covers up to{" "}
              {seatState
                .includedLearnerCount ??
                "the plan limit"}{" "}
              active Academy learners.
            </p>
          </div>
        ) : null}

        {error ? (
          <div className="errorMessage">
            {error}
          </div>
        ) : null}

        {sortedStudents.length ? (
          <div className="studentGrid">
            {sortedStudents.map(
              (student) => {
                const covered =
                  learnerCovered(
                    student.id,
                  );

                const noSeatAvailable =
                  Boolean(
                    isFamilySeatPlan &&
                    seatState &&
                    !covered &&
                    seatState.remainingSlots ===
                      0,
                  );

                return (
                  <div
                    key={student.id}
                    className={
                      student.id ===
                      preferredStudentId
                        ? "studentCardWrap preferred"
                        : "studentCardWrap"
                    }
                  >
                    <button
                      type="button"
                      className="studentCard"
                      onClick={() =>
                        void continueWithLearner(
                          student.id,
                        )
                      }
                      disabled={
                        Boolean(
                          checkingStudent,
                        ) ||
                        noSeatAvailable
                      }
                    >
                      <div className="avatar">
                        {student.full_name
                          .trim()
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="studentCopy">
                        <strong>
                          {
                            student.full_name
                          }
                        </strong>

                        <span>
                          {student.child_age
                            ? `Age ${student.child_age}`
                            : "Learner profile"}
                        </span>

                        {isFamilySeatPlan &&
                        seatState ? (
                          <small
                            className={
                              covered
                                ? "seatBadge covered"
                                : noSeatAvailable
                                  ? "seatBadge full"
                                  : "seatBadge available"
                            }
                          >
                            {covered
                              ? "Family place active"
                              : noSeatAvailable
                                ? "No learner places available"
                                : "Family place available"}
                          </small>
                        ) : null}
                      </div>

                      <b>
                        {checkingStudent ===
                        student.id
                          ? "Checking access..."
                          : covered
                            ? "Continue →"
                            : isFamilySeatPlan &&
                                seatState
                              ? "Use a place →"
                              : "Continue →"}
                      </b>
                    </button>

                    {isFamilySeatPlan &&
                    covered ? (
                      <button
                        type="button"
                        className="releaseSeat"
                        disabled={
                          releasingStudent ===
                          student.id
                        }
                        onClick={() =>
                          void releaseSeat(
                            student.id,
                          )
                        }
                      >
                        {releasingStudent ===
                        student.id
                          ? "Releasing..."
                          : "Release learner place"}
                      </button>
                    ) : null}
                  </div>
                );
              },
            )}
          </div>
        ) : (
          <div className="emptyState">
            <strong>
              Add the learner who will
              use Financial Education.
            </strong>
            <span>
              Their lessons and progress
              will then stay connected
              to their own FountainPrep
              learning record.
            </span>
          </div>
        )}

        <div className="actions">
          <Link
            href={
              `/parent/students` +
              `?next=${encodeURIComponent(
                `/academies/${academy.slug}/start${
                  biographyId
                    ? `?biographyId=${encodeURIComponent(
                        biographyId,
                      )}`
                    : ""
                }`,
              )}`
            }
            className="primary"
          >
            Add a learner
          </Link>

          <Link
            href="/financial-education"
            className="secondary"
          >
            Financial Education
          </Link>
        </div>
      </section>

      <PageStyles />
    </main>
  );
}

function PageStyles() {
  return (
    <style jsx global>{`
      .startPage {
        min-height:
          calc(100vh - 76px);
        display: grid;
        place-items: center;
        padding: 52px 20px;
        color: #241438;
        background:
          radial-gradient(
            circle at top right,
            rgba(
              124,
              58,
              237,
              0.13
            ),
            transparent 30%
          ),
          radial-gradient(
            circle at 10% 10%,
            rgba(
              214,
              162,
              68,
              0.08
            ),
            transparent 26%
          ),
          linear-gradient(
            180deg,
            #fffdf9,
            #f6f0ff
          );
      }

      .startCard {
        width: min(
          900px,
          100%
        );
        padding: 42px;
        border: 1px solid
          rgba(
            111,
            66,
            193,
            0.13
          );
        border-radius: 36px;
        background: rgba(
          255,
          255,
          255,
          0.97
        );
        box-shadow:
          0 28px 90px
          rgba(
            48,
            29,
            82,
            0.13
          );
      }

      .individualCard {
        width: min(
          760px,
          100%
        );
      }

      .startCard .eyebrow {
        margin: 0;
        color: #7c3aed;
        font-size: 13px;
        font-weight: 950;
        letter-spacing:
          0.1em;
        text-transform:
          uppercase;
      }

      .startCard h1 {
        margin: 14px 0;
        font-size:
          clamp(
            38px,
            6vw,
            64px
          );
        line-height: 1;
        letter-spacing:
          -0.055em;
      }

      .startCard .intro {
        max-width: 650px;
        color: #6f6478;
        font-size: 17px;
        line-height: 1.7;
      }

      .seatSummary {
        margin-top: 24px;
        padding: 20px;
        border-radius: 22px;
        border: 1px solid
          rgba(
            124,
            58,
            237,
            0.15
          );
        background:
          linear-gradient(
            135deg,
            #fff,
            #f8f3ff
          );
      }

      .seatSummary > div {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content:
          space-between;
        gap: 10px;
      }

      .seatSummary span {
        color: #7c3aed;
        font-size: 12px;
        font-weight: 950;
        letter-spacing:
          0.06em;
        text-transform:
          uppercase;
      }

      .seatSummary strong {
        color: #2e1a40;
        font-size: 16px;
      }

      .seatSummary p {
        margin: 10px 0 0;
        color: #71657b;
        line-height: 1.6;
        font-size: 14px;
      }

      .errorMessage {
        margin-top: 18px;
        padding: 14px 16px;
        border-radius: 16px;
        color: #991b1b;
        background: #fff1f2;
      }

      .routeStatus {
        margin-top: 26px;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 18px;
        border-radius: 18px;
        color: #5b377b;
        background: #f8f2ff;
        font-weight: 850;
      }

      .routeSpinner {
        width: 20px;
        height: 20px;
        border: 3px solid
          #dbc9f6;
        border-top-color:
          #7c3aed;
        border-radius: 50%;
        animation:
          routeSpin 0.8s linear
          infinite;
      }

      @keyframes routeSpin {
        to {
          transform:
            rotate(360deg);
        }
      }

      .studentGrid {
        display: grid;
        gap: 13px;
        margin-top: 28px;
      }

      .studentCardWrap {
        overflow: hidden;
        border: 1px solid
          #e9dff4;
        border-radius: 22px;
        background: white;
      }

      .studentCardWrap.preferred {
        border-color:
          #8b5cf6;
        box-shadow:
          0 12px 35px
          rgba(
            124,
            58,
            237,
            0.12
          );
      }

      .studentCard {
        width: 100%;
        display: grid;
        grid-template-columns:
          auto 1fr auto;
        align-items: center;
        gap: 16px;
        padding: 16px;
        border: 0;
        color: inherit;
        background: white;
        text-align: left;
        font: inherit;
        cursor: pointer;
      }

      .studentCard:disabled {
        opacity: 0.62;
        cursor: not-allowed;
      }

      .studentCard .avatar {
        width: 52px;
        height: 52px;
        display: grid;
        place-items: center;
        border-radius: 18px;
        color: white;
        background: #7c3aed;
        font-size: 20px;
        font-weight: 950;
      }

      .studentCopy strong,
      .studentCopy span {
        display: block;
      }

      .studentCopy span {
        margin-top: 4px;
        color: #7b7083;
        font-size: 13px;
      }

      .studentCopy small {
        display: inline-flex;
        margin-top: 7px;
        padding: 5px 8px;
        border-radius: 999px;
        font-size: 10px;
        font-weight: 950;
      }

      .seatBadge.covered {
        color: #166534;
        background: #ecfdf3;
      }

      .seatBadge.available {
        color: #6d28d9;
        background: #f2eaff;
      }

      .seatBadge.full {
        color: #9f1239;
        background: #fff1f2;
      }

      .studentCard > b {
        color: #6d28d9;
        font-size: 13px;
      }

      .releaseSeat {
        width: 100%;
        min-height: 38px;
        border: 0;
        border-top: 1px solid
          #f0e9f7;
        color: #7c667f;
        background: #fcfaff;
        font-size: 12px;
        font-weight: 850;
        cursor: pointer;
      }

      .releaseSeat:hover {
        color: #7c3aed;
        background: #f8f2ff;
      }

      .releaseSeat:disabled {
        opacity: 0.6;
        cursor: wait;
      }

      .emptyState {
        display: grid;
        gap: 6px;
        margin-top: 26px;
        padding: 24px;
        border-radius: 20px;
        color: #6e6376;
        background: #faf7ff;
      }

      .emptyState strong {
        color: #2d1a3e;
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 28px;
      }

      .actions a {
        min-height: 50px;
        display: inline-flex;
        align-items: center;
        justify-content:
          center;
        padding: 0 20px;
        border-radius: 999px;
        font-weight: 900;
        text-decoration: none;
      }

      .actions .primary {
        color: white;
        background: #7c3aed;
      }

      .actions .secondary {
        color: #6d28d9;
        background: #f7f1ff;
        border: 1px solid
          #e5d8f5;
      }

      @media (
        max-width: 600px
      ) {
        .startCard {
          padding: 28px 20px;
        }

        .studentCard {
          grid-template-columns:
            auto 1fr;
        }

        .studentCard > b {
          grid-column: 2;
        }

        .seatSummary > div {
          display: grid;
        }
      }
    `}</style>
  );
}
