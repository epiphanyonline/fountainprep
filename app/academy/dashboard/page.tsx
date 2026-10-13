
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { getAcademy } from "@/features/academy-content";
import { registerMvpAcademies } from "@/app/data/academies";

const ACADEMY = "personal-finance";
const PROGRAMME = "money-foundation";

type ProgressRecord = {
  course_id: string;
  lesson_id: string;
  status: string;
};

type CourseProgress = {
  id: string;
  title: string;
  total: number;
  completed: number;
  nextLessonId: string | null;
};

type AcademyLearner = {
  id: string;
  fullName: string;
  purchased: boolean;
};

type AcademyState = {
  studentId: string;
  fullName: string;
  purchased: boolean;
  certificateId: string | null;
  courses: CourseProgress[];
};

function buildClassroomUrl(
  studentId: string,
  courseId: string,
  lessonId: string,
) {
  return `/classroom/academy?${new URLSearchParams({
    studentId,
    academy: ACADEMY,
    programme: PROGRAMME,
    course: courseId,
    lesson: lessonId,
  }).toString()}`;
}

export default function AcademyDashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [academy, setAcademy] = useState<AcademyState | null>(null);
  const [learners, setLearners] = useState<AcademyLearner[]>([]);
const [selectedLearnerId, setSelectedLearnerId] = useState<string | null>(null);
  const [certificateChecking, setCertificateChecking] = useState(false);
const [graduationAttempted, setGraduationAttempted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
  let active = true;

  setLoading(true);
  setError("");
  setAcademy(null);
  setGraduationAttempted(false);

  async function loadDashboard() {
      try {
        const { data: authData, error: authError } =
          await supabase.auth.getUser();

        if (!active) return;

        if (authError || !authData.user) {
          router.replace(
            "/login?next=" +
              encodeURIComponent("/academy/dashboard"),
          );
          return;
        }

        const user = authData.user;

        const { data: parent, error: parentError } =
          await supabase
            .from("parent_profiles")
            .select("id, full_name, account_type")
            .eq("user_id", user.id)
            .maybeSingle();

        if (!active) return;

        if (parentError || !parent) {
          throw new Error(
            "We could not find your learner account.",
          );
        }

                // Find this account's paid Financial Literacy purchase.
        const { data: paidPurchases, error: purchaseError } =
  await supabase
    .from("academy_purchases")
    .select("id, student_id")
    .eq("user_id", user.id)
    .eq("academy_code", ACADEMY)
    .eq("programme_id", PROGRAMME)
    .eq("status", "paid");

const paidPurchase = selectedLearnerId
  ? paidPurchases?.find(
      (purchase) => purchase.student_id === selectedLearnerId,
    ) ?? null
  : paidPurchases?.[0] ?? null;

// Load every learner belonging to this parent.
const { data: studentRows, error: learnersError } =
  await supabase
    .from("student_profiles")
    .select("id, full_name")
    .eq("parent_id", parent.id)
    .order("created_at", { ascending: false });

if (!active) return;

if (learnersError) {
  throw new Error(
    "We could not load the learners on your account.",
  );
}

// A licence belongs to one student, not the entire family.
const paidStudentIds = new Set(
  (paidPurchases ?? [])
    .map((purchase) => purchase.student_id)
    .filter((id): id is string => Boolean(id)),
);

const learnerOptions: AcademyLearner[] = (studentRows ?? []).map(
  (student) => ({
    id: student.id,
    fullName: student.full_name || "Learner",
    purchased: paidStudentIds.has(student.id),
  }),
);

setLearners(learnerOptions);

// Default to a paid learner when available.
// Otherwise retain the adult learner's existing fallback.
const initialLearner =
  learnerOptions.find((learner) => learner.purchased) ??
  (parent.account_type === "ADULT_LEARNER"
    ? learnerOptions.find(
        (learner) => learner.id === paidPurchase?.student_id,
      )
    : null);

if (
  !selectedLearnerId &&
  initialLearner &&
  active
) {
  setSelectedLearnerId(initialLearner.id);
}

        if (!active) return;

        if (purchaseError) {
          throw new Error(
            "We could not verify your academy purchase.",
          );
        }

        // Use the student linked to the purchase, or the
        // adult learner's own profile if not yet purchased.
        const studentQuery = supabase
          .from("student_profiles")
          .select("id, full_name")
          .eq("parent_id", parent.id);

        const targetStudentId =
  selectedLearnerId ?? paidPurchase?.student_id ?? null;

const { data: student, error: studentError } =
  targetStudentId
    ? await studentQuery
        .eq("id", targetStudentId)
        .maybeSingle()
    : parent.account_type === "ADULT_LEARNER"
      ? await studentQuery
          .eq("is_self_learner", true)
          .maybeSingle()
      : { data: null, error: null };

        if (!active) return;

        if (studentError) {
          throw new Error(
            "We could not verify the learner linked to your purchase.",
          );
        }

          if (!student) {
  if (
    !selectedLearnerId &&
    !paidPurchase &&
    parent.account_type !== "ADULT_LEARNER"
  ) {
    router.replace("/parent/dashboard");
    return;
  }

          throw new Error(
            "Your academy learner profile could not be loaded.",
          );
        }

        const progressResult = await supabase
          .from("student_academy_progress")
          .select("course_id, lesson_id, status")
          .eq("student_id", student.id)
          .eq("academy_code", ACADEMY)
          .eq("programme_id", PROGRAMME);

        if (!active) return;

        if (progressResult.error) {
          throw new Error(
            "We could not load your academy progress.",
          );
        }

        const purchaseResult = {
  data:
    paidPurchase?.student_id === student.id
      ? paidPurchase
      : null,
};

        registerMvpAcademies();

        const definition = getAcademy(ACADEMY);
        const programme = definition.programmes.find(
          (item) => item.id === PROGRAMME,
        );

        if (!programme) {
          throw new Error(
            "Financial Literacy curriculum is unavailable.",
          );
        }

        const progressRows =
          (progressResult.data ?? []) as ProgressRecord[];

        const completedKeys = new Set(
          progressRows
            .filter((row) => row.status === "completed")
            .map(
              (row) =>
                `${row.course_id}:${row.lesson_id}`,
            ),
        );

        const courses: CourseProgress[] =
          programme.courses.map((course) => {
            const lessons = course.units.flatMap(
              (unit) => unit.lessons,
            );

            const completed = lessons.filter((lesson) =>
              completedKeys.has(
                `${course.id}:${lesson.id}`,
              ),
            ).length;

            const nextLesson = lessons.find(
              (lesson) =>
                !completedKeys.has(
                  `${course.id}:${lesson.id}`,
                ),
            );

            return {
              id: course.id,
              title: course.title,
              total: lessons.length,
              completed,
              nextLessonId: nextLesson?.id ?? null,
            };
          });

                // Retrieve the learner's permanent certificate.
        const {
          data: graduation,
          error: graduationError,
        } = await supabase
          .from("student_academy_graduations")
          .select("certificate_id")
          .eq("student_id", student.id)
          .eq("academy_code", ACADEMY)
          .eq("programme_id", PROGRAMME)
          .maybeSingle();

        if (!active) return;

        if (graduationError) {
          throw new Error(
            "We could not check your certificate. Please try again.",
          );
        }
        if (!active) return;

        setAcademy({
          studentId: student.id,
          fullName:
            student.full_name ||
            parent.full_name ||
            "Learner",
                    purchased: Boolean(purchaseResult.data),
          certificateId: graduation?.certificate_id ?? null,
          courses,
        });
      } catch (caught) {
        if (!active) return;

        setError(
          caught instanceof Error
            ? caught.message
            : "Unable to load your academy.",
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, [router, selectedLearnerId]);

  const summary = useMemo(() => {
    if (!academy) return null;

    const total = academy.courses.reduce(
      (sum, course) => sum + course.total,
      0,
    );

    const completed = academy.courses.reduce(
      (sum, course) => sum + course.completed,
      0,
    );

    const nextCourse = academy.courses.find(
      (course) =>
        course.total > 0 &&
        course.nextLessonId !== null,
    );

    const allComplete =
      total > 0 &&
      completed === total &&
      academy.courses.every(
        (course) => course.total > 0,
      );

    return {
      total,
      completed,
      percentage:
        total > 0
          ? Math.round((completed / total) * 100)
          : 0,
      nextCourse,
      allComplete,
    };
  }, [academy]);

    useEffect(() => {
    if (
      !academy ||
      !summary?.allComplete ||
      !academy.purchased ||
            academy.certificateId ||
      certificateChecking ||
      graduationAttempted
    ) {
      return;
    }

        let cancelled = false;
    setGraduationAttempted(true);

    async function issueCertificate() {
      setCertificateChecking(true);

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) {
          throw new Error("Please sign in again.");
        }

        const response = await fetch(
          "/api/academy/financial-literacy/graduation",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              studentId: academy!.studentId,
            }),
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ?? "Certificate issuance failed.",
          );
        }

        if (
          !cancelled &&
          result.graduated &&
          result.graduation?.certificate_id
        ) {
          setAcademy((current) => {
  if (!current || current.studentId !== academy?.studentId) {
    return current;
  }

  return {
    ...current,
    certificateId: result.graduation.certificate_id,
  };
});
        }
      } catch (caught) {
        if (!cancelled) {
          console.error(
            "Automatic graduation failed:",
            caught,
          );
        }
      } finally {
        if (!cancelled) {
          setCertificateChecking(false);
        }
      }
    }

    void issueCertificate();

    return () => {
      cancelled = true;
    };
    }, [
    academy,
    summary?.allComplete,
    certificateChecking,
    graduationAttempted,
  ]);

  async function handleLogout() {
    setSigningOut(true);

    const { error: logoutError } =
      await supabase.auth.signOut();

    if (logoutError) {
      setError("Logout was unsuccessful. Please try again.");
      setSigningOut(false);
      return;
    }

    router.replace(
      "/login?next=" +
        encodeURIComponent("/academy/dashboard"),
    );
    router.refresh();
  }

  const classroomUrl =
    academy &&
    summary?.nextCourse?.nextLessonId
      ? buildClassroomUrl(
          academy.studentId,
          summary.nextCourse.id,
          summary.nextCourse.nextLessonId,
        )
      : null;

  return (
    <main className="min-h-screen bg-[#f8f6fc] px-4 py-8 text-[#241235]">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/financial-education"
            className="text-xl font-bold"
          >
            FountainPrep{" "}
            <span className="text-purple-700">
              Academy
            </span>
          </Link>

          <Link
  href="/academy/dashboard"
  className="rounded-xl border border-purple-200 bg-white px-5 py-3 text-sm font-semibold text-purple-800 hover:bg-purple-50"
>
  My Academy
</Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={signingOut}
            className="rounded-xl border border-purple-200 bg-white px-5 py-3 text-sm font-semibold disabled:opacity-50"
          >
            {signingOut ? "Signing out..." : "Log out"}
          </button>
        </header>

        {learners.length > 1 && (
  <section className="mb-8 rounded-3xl bg-white p-6 shadow-sm">
    <h2 className="text-xl font-bold">
      Choose Learner
    </h2>

    <p className="mt-2 text-sm text-gray-600">
      Each learner has their own Financial Literacy
      progress and individual academy licence.
    </p>

    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      {learners.map((learner) => (
        <div
          key={learner.id}
          className={`rounded-2xl border p-5 ${
            selectedLearnerId === learner.id
              ? "border-purple-700 bg-purple-50"
              : "border-gray-200 bg-white"
          }`}
        >
          <h3 className="font-bold">
            {learner.fullName}
          </h3>

          <p className="mt-2 text-sm">
            {learner.purchased
              ? "Purchased"
              : "Not purchased"}
          </p>

          <button
            type="button"
            disabled={
              loading ||
              selectedLearnerId === learner.id
            }
            onClick={() => {
              setSelectedLearnerId(learner.id);
            }}
            className="mt-4 rounded-xl bg-purple-700 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {selectedLearnerId === learner.id
              ? "Selected Learner"
              : "View Learner"}
          </button>

          {!learner.purchased && (
            <Link
              href={`/academies/financial-literacy/start?studentId=${encodeURIComponent(
                learner.id,
              )}`}
              className="mt-3 block text-sm font-semibold text-purple-700 hover:underline"
            >
              Purchase Academy — £19.99
            </Link>
          )}
        </div>
      ))}
    </div>
  </section>
)}

        {loading ? (
          <section className="rounded-3xl bg-white p-8 shadow-sm">
            Preparing your academy...
          </section>
        ) : error ? (
          <section className="rounded-3xl bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold">
              Unable to load academy
            </h1>
            <p className="mt-3 text-gray-600">{error}</p>
          </section>
        ) : academy && summary ? (
          <>
            <section className="rounded-3xl bg-gradient-to-r from-purple-900 to-purple-700 p-8 text-white md:p-12">
              <p className="text-sm font-semibold uppercase tracking-widest text-purple-200">
                My Academy
              </p>

              <h1 className="mt-3 text-3xl font-bold md:text-5xl">
                Welcome back, {academy.fullName}.
              </h1>

              <p className="mt-4 text-purple-100">
                Your financial education journey
                continues here.
              </p>
            </section>

            <section className="mt-8 rounded-3xl bg-white p-7 shadow-sm md:p-10">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-purple-700">
                    FINANCIAL LITERACY ACADEMY
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    My Learning Journey
                  </h2>

                  <p className="mt-2 text-gray-600">
                    {academy.purchased
                      ? "Full academy access purchased"
                      : "Start with your two free lessons"}
                  </p>
                </div>

                <span className="rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-800">
                  {academy.purchased
                    ? "Purchased"
                    : "Free access"}
                </span>
              </div>

              <div className="mt-8">
                <div className="mb-2 flex justify-between gap-3 text-sm">
                  <span>Overall academy progress</span>
                  <strong>
                    {summary.completed} of {summary.total} lessons
                  </strong>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-purple-100">
                  <div
                    className="h-full rounded-full bg-purple-700 transition-all"
                    style={{
                      width: `${summary.percentage}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-right text-sm font-semibold text-purple-700">
                  {summary.percentage}% complete
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                {classroomUrl && academy.purchased ? (
                  <Link
                    href={classroomUrl}
                    className="rounded-xl bg-purple-700 px-7 py-4 font-semibold text-white hover:bg-purple-800"
                  >
                    {summary.completed > 0
                      ? "Continue Learning"
                      : "Start Learning"}
                  </Link>
                                ) : !academy.purchased ? (
                  <Link
                    href={`/academies/financial-literacy/start?studentId=${encodeURIComponent(
                      academy.studentId,
                    )}`}
                    className="rounded-xl bg-purple-700 px-7 py-4 font-semibold text-white hover:bg-purple-800"
                  >
                    Purchase Academy — £19.99
                  </Link>
                                ) : !academy.purchased ? (
                  <Link
                    href={`/academies/financial-literacy/start?studentId=${encodeURIComponent(
                      academy.studentId,
                    )}`}
                    className="rounded-xl bg-purple-700 px-7 py-4 font-semibold text-white hover:bg-purple-800"
                  >
                    Purchase Academy — £19.99
                  </Link>
                                ) : !academy.purchased ? (
                  <Link
                    href={`/academies/financial-literacy/start?studentId=${encodeURIComponent(
                      academy.studentId,
                    )}`}
                    className="rounded-xl bg-purple-700 px-7 py-4 font-semibold text-white hover:bg-purple-800"
                  >
                    Purchase Academy — £19.99
                  </Link>
                                ) : !academy.purchased ? (
                  <Link
                    href={`/academies/financial-literacy/start?studentId=${encodeURIComponent(
                      academy.studentId,
                    )}`}
                    className="rounded-xl bg-purple-700 px-7 py-4 font-semibold text-white hover:bg-purple-800"
                  >
                    Purchase Academy — £19.99
                  </Link>
                ) : (
                  <span className="rounded-xl bg-purple-100 px-7 py-4 font-semibold text-purple-800">
                    {summary.allComplete
                      ? "All Lessons Completed"
                      : "Curriculum Unavailable"}
                  </span>
                )}

                {summary.nextCourse && (
                  <span className="text-sm text-gray-500">
                    Up next: {summary.nextCourse.title}
                  </span>
                )}
              </div>
            </section>

            <section className="mt-6 rounded-3xl bg-white p-7 shadow-sm md:p-10">
              <h2 className="text-2xl font-bold">
                Your Course Roadmap
              </h2>

              <p className="mt-2 text-gray-600">
                Follow your progress through every
                course in the Financial Literacy Academy.
              </p>

              <div className="mt-7 space-y-5">
                {academy.courses.map((course, index) => {
                  const finished =
                    course.total > 0 &&
                    course.completed === course.total;

                  const isCurrent =
                    summary.nextCourse?.id === course.id;

                  const percentage =
                    course.total > 0
                      ? Math.round(
                          (course.completed / course.total) *
                            100,
                        )
                      : 0;

                  return (
                    <article
                      key={course.id}
                      className="rounded-2xl border border-purple-100 p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-purple-600">
                            Course {index + 1}
                          </p>

                          <h3 className="mt-1 text-lg font-bold">
                            {course.title}
                          </h3>
                        </div>

                        <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-800">
                          {finished
                            ? "Completed"
                            : isCurrent
                            ? course.completed > 0
                              ? "In progress"
                              : "Next course"
                            : "Upcoming"}
                        </span>
                      </div>

                      <div className="mt-4 flex justify-between text-sm text-gray-600">
                        <span>
                          {course.completed} / {course.total} lessons
                        </span>
                        <span>{percentage}%</span>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-purple-100">
                        <div
                          className="h-full rounded-full bg-purple-700"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>

                      {isCurrent &&
                        course.nextLessonId &&
                        academy.purchased && (
                          <Link
                            href={buildClassroomUrl(
                              academy.studentId,
                              course.id,
                              course.nextLessonId,
                            )}
                            className="mt-4 inline-block text-sm font-semibold text-purple-700 hover:underline"
                          >
                            Continue this course →
                          </Link>
                        )}
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="mt-6 grid gap-5 md:grid-cols-2">
              <article className="rounded-3xl bg-white p-7 shadow-sm">
                <h3 className="text-xl font-bold">
                  My Achievements
                </h3>

                <p className="mt-3 text-gray-600">
                  Track your completed lessons
                  and learning milestones.
                </p>

                <strong className="mt-5 block text-3xl text-purple-700">
                  {summary.completed} / {summary.total}
                </strong>

                <p className="text-sm text-gray-500">
                  Lessons completed
                </p>

                <p className="mt-3 text-sm text-gray-500">
                  {
                    academy.courses.filter(
                      (course) =>
                        course.total > 0 &&
                        course.completed === course.total,
                    ).length
                  }{" "}
                  of {academy.courses.length} courses completed
                </p>
              </article>

              <article className="rounded-3xl bg-white p-7 shadow-sm">
                <h3 className="text-xl font-bold">
                  My Certificate
                </h3>

                <p className="mt-3 text-gray-600">
  {academy.certificateId
    ? "Congratulations! You have graduated from the Financial Literacy Academy. Your certificate is permanently available here."
    : summary.allComplete && academy.purchased
      ? "All lessons completed. Your graduation certificate is being prepared."
      : "Complete every lesson across all seven courses to earn your Financial Literacy Academy certificate."}
</p>

{academy.certificateId ? (
  <div className="mt-5">
    <span className="inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-800">
      Certificate Available
    </span>

    <p className="mt-3 text-sm text-gray-500">
      Certificate ID: {academy.certificateId}
    </p>

    <Link
      href={`/academies/financial-literacy/graduation?learner=${encodeURIComponent(
        academy.studentId,
      )}`}
      className="mt-4 inline-block rounded-xl bg-purple-700 px-5 py-3 font-semibold text-white hover:bg-purple-800"
    >
      View / Save Certificate →
    </Link>
  </div>
) : !academy.purchased ? (
  <Link
    href={`/academies/financial-literacy/start?studentId=${encodeURIComponent(
      academy.studentId,
    )}`}
    className="rounded-xl bg-purple-700 px-7 py-4 font-semibold text-white hover:bg-purple-800"
  >
    Purchase Academy — £19.99
  </Link>
) : (
  <span className="rounded-xl bg-purple-100 px-7 py-4 font-semibold text-purple-800">
    {summary.allComplete && academy.purchased
      ? "Graduation pending"
      : "Not yet eligible"}
  </span>
)}
              </article>
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
