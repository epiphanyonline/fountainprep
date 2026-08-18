import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL",
  );
}

if (!serviceRoleKey) {
  throw new Error(
    "Missing SUPABASE_SERVICE_ROLE_KEY",
  );
}

const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

type FoundationAccessBody = {
  studentId?: string;
  language?: string;
};

export async function GET(
  request: Request,
) {
  try {
    const user =
      await authenticateRequest(request);

    if (!user) {
      return NextResponse.json(
        {
          error:
            "You must be logged in.",
        },
        { status: 401 },
      );
    }

    const url =
      new URL(request.url);

    const studentId =
      url.searchParams
        .get("studentId")
        ?.trim();

    const language =
      url.searchParams
        .get("language")
        ?.trim()
        .toLowerCase();

    if (!studentId || !language) {
      return NextResponse.json(
        {
          error:
            "studentId and language are required.",
        },
        { status: 400 },
      );
    }

    const ownsLearner =
      await userOwnsLearner(
        user.id,
        studentId,
      );

    if (!ownsLearner) {
      return NextResponse.json(
        {
          error:
            "Learner not found.",
        },
        { status: 404 },
      );
    }

    const {
      data,
      error,
    } = await supabaseAdmin
      .from(
        "language_foundation_access",
      )
      .select(
        `
          completed_runs,
          first_completed_at,
          second_completed_at
        `,
      )
      .eq(
        "student_id",
        studentId,
      )
      .eq(
        "language",
        language,
      )
      .maybeSingle();

    if (error) {
      throw error;
    }

    const completedRuns =
      Number(
        data?.completed_runs ?? 0,
      );

    return NextResponse.json({
      completedRuns,
      remainingFreeRuns:
        Math.max(
          0,
          2 - completedRuns,
        ),
      freeAccessExhausted:
        completedRuns >= 2,
      firstCompletedAt:
        data?.first_completed_at ??
        null,
      secondCompletedAt:
        data?.second_completed_at ??
        null,
    });
  } catch (error) {
    console.error(
      "foundation-access GET error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load Foundation access.",
      },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
) {
  try {
    const user =
      await authenticateRequest(request);

    if (!user) {
      return NextResponse.json(
        {
          error:
            "You must be logged in.",
        },
        { status: 401 },
      );
    }

    const body =
      (await request.json()) as
        FoundationAccessBody;

    const studentId =
      body.studentId?.trim();

    const language =
      body.language
        ?.trim()
        .toLowerCase();

    if (!studentId || !language) {
      return NextResponse.json(
        {
          error:
            "studentId and language are required.",
        },
        { status: 400 },
      );
    }

    const ownsLearner =
      await userOwnsLearner(
        user.id,
        studentId,
      );

    if (!ownsLearner) {
      return NextResponse.json(
        {
          error:
            "Learner not found.",
        },
        { status: 404 },
      );
    }

    const {
      data: existing,
      error: existingError,
    } = await supabaseAdmin
      .from(
        "language_foundation_access",
      )
      .select(
        "completed_runs",
      )
      .eq(
        "student_id",
        studentId,
      )
      .eq(
        "language",
        language,
      )
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    const existingRuns =
      Number(
        existing?.completed_runs ?? 0,
      );

    if (existingRuns >= 2) {
      return NextResponse.json({
        completedRuns: 2,
        remainingFreeRuns: 0,
        freeAccessExhausted: true,
      });
    }

    const {
      data: completedRuns,
      error: incrementError,
    } = await supabaseAdmin.rpc(
      "increment_language_foundation_run",
      {
        p_student_id:
          studentId,

        p_language:
          language,
      },
    );

    if (incrementError) {
      throw incrementError;
    }

    const runCount =
      Number(
        completedRuns ?? 0,
      );

    return NextResponse.json({
      completedRuns:
        runCount,

      remainingFreeRuns:
        Math.max(
          0,
          2 - runCount,
        ),

      freeAccessExhausted:
        runCount >= 2,
    });
  } catch (error) {
    console.error(
      "foundation-access POST error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to record Foundation completion.",
      },
      { status: 500 },
    );
  }
}

async function authenticateRequest(
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
          .slice(
            "Bearer ".length,
          )
          .trim()
      : "";

  if (!accessToken) {
    return null;
  }

  const {
    data,
    error,
  } =
    await supabaseAdmin.auth.getUser(
      accessToken,
    );

  if (
    error ||
    !data.user
  ) {
    return null;
  }

  return data.user;
}

async function userOwnsLearner(
  userId: string,
  studentId: string,
) {
  const {
    data: parent,
    error: parentError,
  } = await supabaseAdmin
    .from("parent_profiles")
    .select("id")
    .eq(
      "user_id",
      userId,
    )
    .maybeSingle();

  if (
    parentError ||
    !parent
  ) {
    return false;
  }

  const {
    data: learner,
    error: learnerError,
  } = await supabaseAdmin
    .from("student_profiles")
    .select("id")
    .eq(
      "id",
      studentId,
    )
    .eq(
      "parent_id",
      parent.id,
    )
    .maybeSingle();

  if (
    learnerError ||
    !learner
  ) {
    return false;
  }

  return true;
}