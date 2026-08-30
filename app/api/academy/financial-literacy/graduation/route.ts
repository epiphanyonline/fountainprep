import {
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@supabase/supabase-js";

import {
  FINANCIAL_LITERACY_ACADEMY_CODE,
  FINANCIAL_LITERACY_PROGRAMME_ID,
  getFinancialLiteracyLessonIds,
} from "@/app/lib/financialLiteracyGraduation";

type GraduationRequest = {
  studentId?: string;
};

function getAdminClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return createClient(
    url,
    serviceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}

async function getAuthenticatedUser(
  request: Request,
) {
  const authorization =
    request.headers.get(
      "authorization",
    );

  const accessToken =
    authorization?.startsWith(
      "Bearer ",
    )
      ? authorization
          .slice(7)
          .trim()
      : "";

  if (!accessToken) {
    return null;
  }

  const admin =
    getAdminClient();

  const {
    data,
    error,
  } =
    await admin.auth.getUser(
      accessToken,
    );

  if (error || !data.user) {
    return null;
  }

  return data.user;
}

function createCertificateId(
  studentId: string,
) {
  const timestamp =
    Date.now()
      .toString(36)
      .toUpperCase();

  const studentSuffix =
    studentId
      .replace(/-/g, "")
      .slice(-6)
      .toUpperCase();

  return (
    `FP-FL-${timestamp}-${studentSuffix}`
  );
}

export async function POST(
  request: Request,
) {
  try {
    const user =
      await getAuthenticatedUser(
        request,
      );

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Authentication required.",
        },
        {
          status: 401,
        },
      );
    }

    const body =
      (await request.json()) as
        GraduationRequest;

    const studentId =
      body.studentId?.trim();

    if (!studentId) {
      return NextResponse.json(
        {
          error:
            "studentId is required.",
        },
        {
          status: 400,
        },
      );
    }

    const admin =
      getAdminClient();

    /*
     * Step 1:
     * Load learner ownership data.
     */
    const {
      data: student,
      error: studentError,
    } = await admin
      .from("student_profiles")
      .select(
        "id, parent_id, full_name",
      )
      .eq("id", studentId)
      .maybeSingle();

    if (studentError) {
      throw studentError;
    }

    if (!student) {
      return NextResponse.json(
        {
          error:
            "Learner not found.",
        },
        {
          status: 404,
        },
      );
    }

    /*
     * Step 2:
     * Verify the authenticated user owns
     * this learner through parent_profiles.
     */
    const {
      data: parent,
      error: parentError,
    } = await admin
      .from("parent_profiles")
      .select("id, user_id")
      .eq("id", student.parent_id)
      .maybeSingle();

    if (parentError) {
      throw parentError;
    }

    if (
      !parent ||
      parent.user_id !== user.id
    ) {
      return NextResponse.json(
        {
          error:
            "You do not have access to this learner.",
        },
        {
          status: 403,
        },
      );
    }

    /*
     * Step 3:
     * Build the complete Financial Literacy
     * curriculum requirement directly from
     * the registered academy data.
     */
    const requiredLessonIds =
      getFinancialLiteracyLessonIds();

    if (
      requiredLessonIds.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Financial Literacy curriculum contains no required lessons.",
        },
        {
          status: 500,
        },
      );
    }

    /*
     * Step 4:
     * Read ALL completed lessons across the
     * full programme — not only the current course.
     */
    const {
      data: progressRows,
      error: progressError,
    } = await admin
      .from(
        "student_academy_progress",
      )
      .select(
        "lesson_id, status, points_earned, completed_at",
      )
      .eq(
        "student_id",
        studentId,
      )
      .eq(
        "academy_code",
        FINANCIAL_LITERACY_ACADEMY_CODE,
      )
      .eq(
        "programme_id",
        FINANCIAL_LITERACY_PROGRAMME_ID,
      )
      .eq(
        "status",
        "completed",
      )
      .in(
        "lesson_id",
        requiredLessonIds,
      );

    if (progressError) {
      throw progressError;
    }

    const completedLessonIds =
      new Set(
        (progressRows ?? []).map(
          (row) => row.lesson_id,
        ),
      );

    const missingLessonIds =
      requiredLessonIds.filter(
        (lessonId) =>
          !completedLessonIds.has(
            lessonId,
          ),
      );

    const totalPoints =
      (progressRows ?? []).reduce(
        (
          total,
          row,
        ) =>
          total +
          Number(
            row.points_earned ?? 0,
          ),
        0,
      );

    /*
     * Not graduated yet:
     * return useful progress information,
     * but do NOT create a credential.
     */
    if (
      missingLessonIds.length > 0
    ) {
      return NextResponse.json({
        graduated: false,
        requiredLessons:
          requiredLessonIds.length,
        completedLessons:
          completedLessonIds.size,
        remainingLessons:
          missingLessonIds.length,
      });
    }

    /*
     * Step 5:
     * Graduation is immutable.
     *
     * If a record already exists,
     * return it rather than issuing
     * a second certificate.
     */
    const {
      data: existingGraduation,
      error: existingError,
    } = await admin
      .from(
        "student_academy_graduations",
      )
      .select(
        [
          "student_id",
          "learner_name",
          "certificate_id",
          "required_lessons",
          "completed_lessons",
          "total_points",
          "graduated_at",
        ].join(", "),
      )
      .eq(
        "student_id",
        studentId,
      )
      .eq(
        "academy_code",
        FINANCIAL_LITERACY_ACADEMY_CODE,
      )
      .eq(
        "programme_id",
        FINANCIAL_LITERACY_PROGRAMME_ID,
      )
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    if (existingGraduation) {
      return NextResponse.json({
        graduated: true,
        graduation:
          existingGraduation,
      });
    }

    /*
     * Step 6:
     * Issue the permanent graduation record.
     */
    const {
      data: graduation,
      error: graduationError,
    } = await admin
      .from(
        "student_academy_graduations",
      )
      .insert({
        student_id:
          studentId,
        academy_code:
          FINANCIAL_LITERACY_ACADEMY_CODE,
        programme_id:
          FINANCIAL_LITERACY_PROGRAMME_ID,
        learner_name:
          student.full_name,
        certificate_id:
          createCertificateId(
            studentId,
          ),
        required_lessons:
          requiredLessonIds.length,
        completed_lessons:
          requiredLessonIds.length,
        total_points:
          totalPoints,
        graduated_at:
          new Date().toISOString(),
      })
      .select(
        [
          "student_id",
          "learner_name",
          "certificate_id",
          "required_lessons",
          "completed_lessons",
          "total_points",
          "graduated_at",
        ].join(", "),
      )
      .single();

    if (graduationError) {
      throw graduationError;
    }

    return NextResponse.json({
      graduated: true,
      graduation,
    });
  } catch (error) {
    console.error(
      "Financial Literacy graduation evaluation failed:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to evaluate graduation.",
      },
      {
        status: 500,
      },
    );
  }
}
