"use client";

import {
  useEffect,
  useMemo,
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
};

export default function AcademyStartClient({
  academySlug,
}: {
  academySlug: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const preferredStudentId =
    searchParams.get("studentId");

  const academy = useMemo(
    () => getAcademyMarketing(academySlug),
    [academySlug],
  );

  const [students, setStudents] =
    useState<StudentRow[]>([]);
  const [loading, setLoading] =
    useState(true);
  const [checkingStudent, setCheckingStudent] =
    useState<string | null>(null);
  const [error, setError] =
    useState<string | null>(null);

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
        /*
         * getSession() is intentionally used first.
         * A missing session means "logged out", not "broken".
         */
        const {
          data: sessionData,
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        const user =
          sessionData.session?.user ?? null;

        if (!user) {
          const nextPath =
            `/academies/${academy.slug}/start` +
            (preferredStudentId
              ? `?studentId=${encodeURIComponent(
                  preferredStudentId,
                )}`
              : "");

          router.replace(
            `/login?next=${encodeURIComponent(
              nextPath,
            )}`,
          );
          return;
        }

        const {
          data: parent,
          error: parentError,
        } = await supabase
          .from("parent_profiles")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (parentError) {
          throw parentError;
        }

        /*
         * Existing authenticated users who have not yet
         * created their parent/learner profile continue
         * through onboarding instead of seeing an error.
         */
        if (!parent) {
          const returnTo = encodeURIComponent(
            `/academies/${academy.slug}/start`,
          );

          router.replace(
            `/parent/onboarding?next=${returnTo}`,
          );
          return;
        }

        const {
          data,
          error: studentsError,
        } = await supabase
          .from("student_profiles")
          .select(
            "id, full_name, child_age",
          )
          .eq("parent_id", parent.id)
          .order("created_at", {
            ascending: false,
          });

        if (studentsError) {
          throw studentsError;
        }

        if (!cancelled) {
          setStudents(
            (data as StudentRow[] | null) ??
              [],
          );
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
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
    router,
  ]);

  async function continueWithLearner(
    studentId: string,
  ) {
    if (!academy) return;

    try {
      setCheckingStudent(studentId);
      setError(null);

      /*
       * Language retains the specialised classroom.
       * It still uses academy pricing where applicable.
       */
      const access =
        await getAcademySubscriptionAccess(
          studentId,
        );

      const hasActivePaidAccess =
        access.learnerCovered &&
        ["active", "trialing"].includes(
          access.status,
        ) &&
        access.plan.accessTier !== "free";

      if (hasActivePaidAccess) {
        router.push(
          academyClassroomHref({
            studentId,
            academy:
              academy.academyCode,
            programme:
              academy.programmeId,
          }),
        );
        return;
      }

      router.push(
        academyPricingHref({
          studentId,
          academy:
            academy.academyCode,
          programme:
            academy.programmeId,
        }),
      );
    } catch (selectError) {
      setError(
        selectError instanceof Error
          ? selectError.message
          : "Unable to continue.",
      );
      setCheckingStudent(null);
    }
  }

  if (loading) {
    return (
      <main className="startPage">
        <section className="startCard">
          <p className="eyebrow">
            Learning pathway
          </p>
          <h1>Preparing your next step...</h1>
          <p className="intro">
            We’re getting the learner’s pathway
            ready.
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
          <h1>Academy not found</h1>
          <Link href="/academies">
            View Learning Academies
          </Link>
        </section>

        <PageStyles />
      </main>
    );
  }

  const sortedStudents = [
    ...students,
  ].sort((a, b) => {
    if (
      a.id === preferredStudentId
    ) {
      return -1;
    }

    if (
      b.id === preferredStudentId
    ) {
      return 1;
    }

    return 0;
  });

  return (
    <main className="startPage">
      <section className="startCard">
        <p className="eyebrow">
          {academy.title}
        </p>

        <h1>Who is learning?</h1>

        <p className="intro">
          Choose the learner so their lessons,
          progress and achievements stay connected
          to one learning record.
        </p>

        {error ? (
          <div className="errorMessage">
            {error}
          </div>
        ) : null}

        {sortedStudents.length ? (
          <div className="studentGrid">
            {sortedStudents.map(
              (student) => (
                <button
                  type="button"
                  key={student.id}
                  className={
                    student.id ===
                    preferredStudentId
                      ? "studentCard preferred"
                      : "studentCard"
                  }
                  onClick={() =>
                    void continueWithLearner(
                      student.id,
                    )
                  }
                  disabled={Boolean(
                    checkingStudent,
                  )}
                >
                  <div className="avatar">
                    {student.full_name
                      .trim()
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="studentCopy">
                    <strong>
                      {student.full_name}
                    </strong>
                    <span>
                      {student.child_age
                        ? `Age ${student.child_age}`
                        : "Learner profile"}
                    </span>
                  </div>

                  <b>
                    {checkingStudent ===
                    student.id
                      ? "Checking access..."
                      : "Continue →"}
                  </b>
                </button>
              ),
            )}
          </div>
        ) : (
          <div className="emptyState">
            <strong>
              Add the learner who will use
              this academy.
            </strong>
            <span>
              Their lessons and progress will
              then follow them across
              FountainPrep.
            </span>
          </div>
        )}

        <div className="actions">
          <Link
            href={
              `/parent/students` +
              `?next=${encodeURIComponent(
                `/academies/${academy.slug}/start`,
              )}`
            }
            className="primary"
          >
            Add a learner
          </Link>

          <Link
            href={`/academies/${academy.slug}`}
            className="secondary"
          >
            Back to academy
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
        min-height: calc(100vh - 76px);
        display: grid;
        place-items: center;
        padding: 52px 20px;
        color: #241438;
        background:
          radial-gradient(
            circle at top right,
            rgba(124, 58, 237, 0.13),
            transparent 30%
          ),
          linear-gradient(
            180deg,
            #ffffff,
            #f6f0ff
          );
      }

      .startCard {
        width: min(900px, 100%);
        padding: 42px;
        border: 1px solid
          rgba(111, 66, 193, 0.13);
        border-radius: 36px;
        background: rgba(
          255,
          255,
          255,
          0.97
        );
        box-shadow:
          0 28px 90px
          rgba(48, 29, 82, 0.13);
      }

      .startCard .eyebrow {
        margin: 0;
        color: #7c3aed;
        font-size: 13px;
        font-weight: 950;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }

      .startCard h1 {
        margin: 14px 0;
        font-size:
          clamp(38px, 6vw, 64px);
        line-height: 1;
        letter-spacing: -0.055em;
      }

      .startCard .intro {
        max-width: 650px;
        color: #6f6478;
        font-size: 17px;
        line-height: 1.7;
      }

      .errorMessage {
        margin-top: 18px;
        padding: 14px 16px;
        border-radius: 16px;
        color: #991b1b;
        background: #fff1f2;
      }

      .studentGrid {
        display: grid;
        gap: 13px;
        margin-top: 28px;
      }

      .studentCard {
        width: 100%;
        display: grid;
        grid-template-columns:
          auto 1fr auto;
        align-items: center;
        gap: 16px;
        padding: 16px;
        border: 1px solid #e9dff4;
        border-radius: 22px;
        color: inherit;
        background: white;
        text-align: left;
        font: inherit;
        cursor: pointer;
      }

      .studentCard.preferred {
        border-color: #8b5cf6;
        box-shadow:
          0 12px 35px
          rgba(124, 58, 237, 0.12);
      }

      .studentCard:disabled {
        opacity: 0.65;
        cursor: wait;
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

      .studentCard > b {
        color: #6d28d9;
        font-size: 13px;
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
        justify-content: center;
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
        border: 1px solid #e5d8f5;
      }

      @media (max-width: 600px) {
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
      }
    `}</style>
  );
}
