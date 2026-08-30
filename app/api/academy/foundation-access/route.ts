import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  supabaseAdmin,
} from "@/app/lib/supabaseAdmin";

type AcademyCode =
  | "biography"
  | "wealth"
  | "bible"
  | "languages";

type Action =
  | "check"
  | "complete";

type AccessSource =
  | "ACADEMY_SUBSCRIPTION"
  | "FREE_FOUNDATION";

const FREE_COMPLETION_LIMIT = 2;

const FREE_BIOGRAPHY_IDS = [
  "aliko-dangote",
  "warren-buffett",
] as const;

const FREE_WEALTH_IDS = [
  "wealth-needs-wants",
  "finance-foundation-unit-1-lesson-1-preview",
] as const;

function normaliseAcademy(
  value: string | null,
): AcademyCode | null {
  if (!value) return null;

  const academy =
    value.trim().toLowerCase();

  if (
    academy === "biography" ||
    academy === "wealth" ||
    academy === "bible" ||
    academy === "languages"
  ) {
    return academy;
  }

  return null;
}

async function hasPaidAcademyAccess({
  userId,
  studentId,
  academy,
}: {
  userId: string;
  studentId: string | null;
  academy: AcademyCode;
}) {
  const {
    data: subscription,
    error: subscriptionError,
  } = await supabaseAdmin
    .from("academy_subscriptions")
    .select(
      `
        id,
        plan_id,
        status
      `,
    )
    .eq(
      "user_id",
      userId,
    )
    .in("status", [
      "trialing",
      "active",
    ])
    .maybeSingle();

  if (subscriptionError) {
    throw subscriptionError;
  }

  if (!subscription) {
    return false;
  }

  const {
    data: plan,
    error: planError,
  } = await supabaseAdmin
    .from(
      "academy_subscription_plans",
    )
    .select(
      `
        access_tier,
        academy_access
      `,
    )
    .eq(
      "id",
      subscription.plan_id,
    )
    .maybeSingle();

  if (planError) {
    throw planError;
  }

  if (!plan) {
    return false;
  }

  const academyAccess =
    Array.isArray(
      plan.academy_access,
    )
      ? plan.academy_access
      : [];

  const tierRank: Record<
    string,
    number
  > = {
    free: 0,
    foundation: 1,
    premium: 2,
    professional: 3,
  };

  const hasPaidTier =
    (tierRank[
      plan.access_tier ??
        "free"
    ] ?? 0) >= 1;

  const academyAliases: Record<
    AcademyCode,
    string[]
  > = {
    biography: [
      "biography",
      "all",
    ],

    wealth: [
      "wealth",
      "financial-literacy",
      "finance",
      "all",
    ],

    bible: [
      "bible",
      "spiritual-capital",
      "all",
    ],

    languages: [
      "languages",
      "language",
      "all",
    ],
  };

  const coversAcademy =
    academyAliases[
      academy
    ].some(
      (code) =>
        academyAccess.includes(
          code,
        ),
    );

  if (
    !hasPaidTier ||
    !coversAcademy
  ) {
    return false;
  }

  /*
   * No learner supplied:
   * treat this as account-level
   * subscription access.
   */
  if (!studentId) {
    return true;
  }

  const {
    data: learner,
    error: learnerError,
  } = await supabaseAdmin
    .from(
      "academy_subscription_learners",
    )
    .select("id")
    .eq(
      "subscription_id",
      subscription.id,
    )
    .eq(
      "student_id",
      studentId,
    )
    .maybeSingle();

  if (learnerError) {
    throw learnerError;
  }

  return Boolean(
    learner,
  );
}

/*
 * ==================================================
 * BIOGRAPHY
 * ==================================================
 */

async function getBiographyCompletedCount({
  guestKey,
  studentId,
}: {
  guestKey: string | null;
  studentId: string | null;
}) {
  let query =
    supabaseAdmin
      .from(
        "biography_foundation_completions",
      )
      .select(
        "biography_id",
      );

  if (studentId) {
    query =
      query.eq(
        "student_id",
        studentId,
      );
  } else if (guestKey) {
    query =
      query.eq(
        "guest_key",
        guestKey,
      );
  } else {
    return 0;
  }

  const {
    data,
    error,
  } = await query;

  if (error) {
    throw error;
  }

  const unique =
    new Set(
      (data ?? []).map(
        (row) =>
          String(
            row.biography_id,
          ).toLowerCase(),
      ),
    );

  return Math.min(
    unique.size,
    FREE_COMPLETION_LIMIT,
  );
}

async function completeBiography({
  biographyId,
  guestKey,
  studentId,
  userId,
}: {
  biographyId: string;
  guestKey: string | null;
  studentId: string | null;
  userId: string | null;
}) {
  const {
    data,
    error,
  } = await supabaseAdmin.rpc(
    "record_biography_foundation_completion",
    {
      p_biography_id:
        biographyId,

      p_guest_key:
        studentId
          ? null
          : guestKey,

      p_student_id:
        studentId,

      p_user_id:
        userId,
    },
  );

  if (error) {
    throw error;
  }

  const row =
    Array.isArray(data)
      ? data[0]
      : data;

  return {
    completed:
      Number(
        row
          ?.completed_biographies ??
          0,
      ),

    remaining:
      Number(
        row
          ?.free_access_remaining ??
          0,
      ),

    locked:
      Boolean(
        row
          ?.foundation_locked,
      ),
  };
}

/*
 * ==================================================
 * GENERIC GATEWAY COMPLETIONS
 *
 * Used by:
 * - Financial Education
 * - Spiritual Capital
 * ==================================================
 */

async function getGenericCompletedCount({
  academy,
  guestKey,
  studentId,
}: {
  academy:
    | "wealth"
    | "bible";
  guestKey: string | null;
  studentId: string | null;
}) {
  let query =
    supabaseAdmin
      .from(
        "academy_foundation_completions",
      )
      .select(
        "experience_id",
      )
      .eq(
        "academy_code",
        academy,
      );

  if (studentId) {
    query =
      query.eq(
        "student_id",
        studentId,
      );
  } else if (guestKey) {
    query =
      query.eq(
        "guest_key",
        guestKey,
      );
  } else {
    return 0;
  }

  const {
    data,
    error,
  } = await query;

  if (error) {
    throw error;
  }

  const unique =
    new Set(
      (data ?? []).map(
        (row) =>
          String(
            row.experience_id,
          ).toLowerCase(),
      ),
    );

  return Math.min(
    unique.size,
    FREE_COMPLETION_LIMIT,
  );
}

async function completeGenericExperience({
  academy,
  experienceId,
  guestKey,
  studentId,
  userId,
}: {
  academy:
    | "wealth"
    | "bible";
  experienceId: string;
  guestKey: string | null;
  studentId: string | null;
  userId: string | null;
}) {
  const {
    data,
    error,
  } = await supabaseAdmin.rpc(
    "record_academy_foundation_completion",
    {
      p_academy_code:
        academy,

      p_experience_id:
        experienceId,

      p_guest_key:
        studentId
          ? null
          : guestKey,

      p_student_id:
        studentId,

      p_user_id:
        userId,
    },
  );

  if (error) {
    throw error;
  }

  const row =
    Array.isArray(data)
      ? data[0]
      : data;

  return {
    completed:
      Number(
        row
          ?.completed_experiences ??
          0,
      ),

    remaining:
      Number(
        row
          ?.free_access_remaining ??
          0,
      ),

    locked:
      Boolean(
        row
          ?.foundation_locked,
      ),
  };
}

export async function POST(
  request: NextRequest,
) {
  try {
    const body =
      await request.json();

    const academy =
      normaliseAcademy(
        body.academy,
      );

    const action =
      String(
        body.action ??
          "check",
      ) as Action;

    const studentId =
      body.studentId
        ? String(
            body.studentId,
          )
        : null;

    const userId =
      body.userId
        ? String(
            body.userId,
          )
        : null;

    const guestKey =
      body.guestKey
        ? String(
            body.guestKey,
          )
        : null;

    const experienceId =
      body.experienceId
        ? String(
            body.experienceId,
          )
        : null;

    if (!academy) {
      return NextResponse.json(
        {
          error:
            "Invalid academy.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      action !== "check" &&
      action !== "complete"
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid action.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * ==================================================
     * 1. PAID ACCESS ALWAYS WINS
     * ==================================================
     */

    if (userId) {
      const paid =
        await hasPaidAcademyAccess({
          userId,
          studentId,
          academy,
        });

      if (paid) {
        return NextResponse.json({
          allowed: true,

          accessType:
            "ACADEMY_SUBSCRIPTION" satisfies AccessSource,

          unlimited: true,

          completed: null,

          remaining: null,

          foundationLocked:
            false,

          replayAllowed:
            true,

          requiresSubscription:
            false,
        });
      }
    }

    /*
     * ==================================================
     * 2. BIOGRAPHY OF GREATNESS
     * ==================================================
     */

    if (
      academy ===
      "biography"
    ) {
      if (
        !studentId &&
        !guestKey
      ) {
        return NextResponse.json(
          {
            error:
              "Guest key or student ID is required.",
          },
          {
            status: 400,
          },
        );
      }

      if (!experienceId) {
        return NextResponse.json(
          {
            error:
              "experienceId is required for Biography Foundation access.",
          },
          {
            status: 400,
          },
        );
      }

      const normalisedExperienceId =
        experienceId
          .trim()
          .toLowerCase();

      const complimentaryBiography =
        FREE_BIOGRAPHY_IDS.includes(
          normalisedExperienceId as
            (typeof FREE_BIOGRAPHY_IDS)[number],
        );

      const completed =
        await getBiographyCompletedCount({
          guestKey,
          studentId,
        });

      const locked =
        completed >=
        FREE_COMPLETION_LIMIT;

      if (
        action === "check"
      ) {
        /*
         * Hard lock after completion #2.
         *
         * Even the original two free biographies
         * can no longer be replayed.
         */
        if (locked) {
          return NextResponse.json({
            allowed: false,

            accessType:
              "FREE_FOUNDATION" satisfies AccessSource,

            unlimited: false,

            completed,

            remaining: 0,

            foundationLocked:
              true,

            replayAllowed:
              false,

            requiresSubscription:
              true,
          });
        }

        /*
         * Only Dangote + Buffett are
         * complimentary.
         */
        if (
          !complimentaryBiography
        ) {
          return NextResponse.json({
            allowed: false,

            accessType:
              "FREE_FOUNDATION" satisfies AccessSource,

            unlimited: false,

            completed,

            remaining:
              Math.max(
                FREE_COMPLETION_LIMIT -
                  completed,
                0,
              ),

            foundationLocked:
              false,

            replayAllowed:
              false,

            requiresSubscription:
              true,
          });
        }

        return NextResponse.json({
          allowed: true,

          accessType:
            "FREE_FOUNDATION" satisfies AccessSource,

          unlimited: false,

          completed,

          remaining:
            Math.max(
              FREE_COMPLETION_LIMIT -
                completed,
              0,
            ),

          foundationLocked:
            false,

          replayAllowed:
            true,

          requiresSubscription:
            false,
        });
      }

      /*
       * COMPLETE
       */

      if (locked) {
        return NextResponse.json({
          allowed: false,

          accessType:
            "FREE_FOUNDATION" satisfies AccessSource,

          unlimited: false,

          completed:
            FREE_COMPLETION_LIMIT,

          remaining: 0,

          foundationLocked:
            true,

          replayAllowed:
            false,

          requiresSubscription:
            true,
        });
      }

      if (
        !complimentaryBiography
      ) {
        return NextResponse.json({
          allowed: false,

          accessType:
            "FREE_FOUNDATION" satisfies AccessSource,

          unlimited: false,

          completed,

          remaining:
            Math.max(
              FREE_COMPLETION_LIMIT -
                completed,
              0,
            ),

          foundationLocked:
            false,

          replayAllowed:
            false,

          requiresSubscription:
            true,
        });
      }

      const result =
        await completeBiography({
          biographyId:
            normalisedExperienceId,

          guestKey,

          studentId,

          userId,
        });

      return NextResponse.json({
        allowed: true,

        accessType:
          "FREE_FOUNDATION" satisfies AccessSource,

        unlimited: false,

        completed:
          result.completed,

        remaining:
          result.remaining,

        foundationLocked:
          result.locked,

        replayAllowed:
          !result.locked,

        requiresSubscription:
          result.locked,
      });
    }

    /*
     * ==================================================
     * 3. FINANCIAL EDUCATION
     * ==================================================
     */

    if (
      academy ===
      "wealth"
    ) {
      if (
        !studentId &&
        !guestKey
      ) {
        return NextResponse.json(
          {
            error:
              "Guest key or student ID is required.",
          },
          {
            status: 400,
          },
        );
      }

      if (!experienceId) {
        return NextResponse.json(
          {
            error:
              "experienceId is required for Financial Education Foundation access.",
          },
          {
            status: 400,
          },
        );
      }

      const normalisedExperienceId =
        experienceId
          .trim()
          .toLowerCase();

      const complimentaryExperience =
        FREE_WEALTH_IDS.includes(
          normalisedExperienceId as
            (typeof FREE_WEALTH_IDS)[number],
        );

      const completed =
        await getGenericCompletedCount({
          academy:
            "wealth",

          guestKey,

          studentId,
        });

      const locked =
        completed >=
        FREE_COMPLETION_LIMIT;

      if (
        action === "check"
      ) {
        /*
         * Once experience #2 is complete,
         * ALL free Financial Education
         * access is locked, including replay.
         */
        if (locked) {
          return NextResponse.json({
            allowed: false,

            accessType:
              "FREE_FOUNDATION" satisfies AccessSource,

            unlimited: false,

            completed,

            remaining: 0,

            foundationLocked:
              true,

            replayAllowed:
              false,

            requiresSubscription:
              true,
          });
        }

        /*
         * Before subscription, only the
         * first two Foundation lessons
         * are complimentary.
         */
        if (
          !complimentaryExperience
        ) {
          return NextResponse.json({
            allowed: false,

            accessType:
              "FREE_FOUNDATION" satisfies AccessSource,

            unlimited: false,

            completed,

            remaining:
              Math.max(
                FREE_COMPLETION_LIMIT -
                  completed,
                0,
              ),

            foundationLocked:
              false,

            replayAllowed:
              false,

            requiresSubscription:
              true,
          });
        }

        return NextResponse.json({
          allowed: true,

          accessType:
            "FREE_FOUNDATION" satisfies AccessSource,

          unlimited: false,

          completed,

          remaining:
            Math.max(
              FREE_COMPLETION_LIMIT -
                completed,
              0,
            ),

          foundationLocked:
            false,

          replayAllowed:
            true,

          requiresSubscription:
            false,
        });
      }

      /*
       * COMPLETE
       */

      if (locked) {
        return NextResponse.json({
          allowed: false,

          accessType:
            "FREE_FOUNDATION" satisfies AccessSource,

          unlimited: false,

          completed:
            FREE_COMPLETION_LIMIT,

          remaining: 0,

          foundationLocked:
            true,

          replayAllowed:
            false,

          requiresSubscription:
            true,
        });
      }

      if (
        !complimentaryExperience
      ) {
        return NextResponse.json({
          allowed: false,

          accessType:
            "FREE_FOUNDATION" satisfies AccessSource,

          unlimited: false,

          completed,

          remaining:
            Math.max(
              FREE_COMPLETION_LIMIT -
                completed,
              0,
            ),

          foundationLocked:
            false,

          replayAllowed:
            false,

          requiresSubscription:
            true,
        });
      }

      const result =
        await completeGenericExperience({
          academy:
            "wealth",

          experienceId:
            normalisedExperienceId,

          guestKey,

          studentId,

          userId,
        });

      return NextResponse.json({
        allowed: true,

        accessType:
          "FREE_FOUNDATION" satisfies AccessSource,

        unlimited: false,

        completed:
          result.completed,

        remaining:
          result.remaining,

        foundationLocked:
          result.locked,

        replayAllowed:
          !result.locked,

        requiresSubscription:
          result.locked,
      });
    }

    /*
     * ==================================================
     * 4. SPIRITUAL CAPITAL
     *
     * We will connect:
     * - bible-david-goliath
     * - bible-joseph-stewardship
     *
     * in the next step.
     * ==================================================
     */

    if (
      academy === "bible"
    ) {
      return NextResponse.json({
        allowed: false,

        accessType:
          "FREE_FOUNDATION" satisfies AccessSource,

        unlimited: false,

        completed: 0,

        remaining:
          FREE_COMPLETION_LIMIT,

        foundationLocked:
          false,

        replayAllowed:
          false,

        requiresSubscription:
          false,

        pendingImplementation:
          true,
      });
    }

    /*
     * ==================================================
     * 5. LANGUAGE LEVERAGE
     *
     * Existing language Foundation
     * access engine remains authoritative
     * until we wire it into this gateway.
     * ==================================================
     */

    if (
      academy ===
      "languages"
    ) {
      return NextResponse.json({
        allowed: false,

        accessType:
          "FREE_FOUNDATION" satisfies AccessSource,

        unlimited: false,

        completed: 0,

        remaining:
          FREE_COMPLETION_LIMIT,

        foundationLocked:
          false,

        replayAllowed:
          false,

        requiresSubscription:
          false,

        pendingImplementation:
          true,
      });
    }

    return NextResponse.json(
      {
        error:
          "Unsupported academy.",
      },
      {
        status: 400,
      },
    );
  } catch (error) {
    console.error(
      "Foundation access error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to check Foundation access.",
      },
      {
        status: 500,
      },
    );
  }
}