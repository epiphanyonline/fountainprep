import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL is not configured.",
  );
}

if (!serviceRoleKey) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY is not configured.",
  );
}

const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  },
);

type AccessSource =
  | "FREE_FOUNDATION"
  | "PREMIUM_BUNDLE"
  | "ACADEMY_SUBSCRIPTION";

type RequestBody = {
  studentId?: string;
  language?: string;
  action?: "check" | "complete";
  runId?: string;
};

const PAID_SUBSCRIPTION_STATUSES = [
  "trialing",
  "active",
];

export async function POST(req: Request) {
  try {
    /*
     * --------------------------------------------------
     * 1. Authenticate caller
     * --------------------------------------------------
     */

    const authorization =
      req.headers.get("authorization");

    const accessToken =
      authorization?.startsWith("Bearer ")
        ? authorization.slice(7).trim()
        : "";

    if (!accessToken) {
      return NextResponse.json(
        {
          error: "Authentication required.",
        },
        {
          status: 401,
        },
      );
    }

    const {
      data: authData,
      error: authError,
    } = await supabaseAdmin.auth.getUser(
      accessToken,
    );

    if (authError || !authData.user) {
      return NextResponse.json(
        {
          error: "Invalid or expired session.",
        },
        {
          status: 401,
        },
      );
    }

    const user = authData.user;

    /*
     * --------------------------------------------------
     * 2. Validate request
     * --------------------------------------------------
     */

    const body =
      (await req.json()) as RequestBody;

    const studentId =
      body.studentId?.trim();

    const language =
      body.language?.trim();

    const action =
      body.action ?? "check";

    const runId =
      body.runId?.trim();

    if (!studentId) {
      return NextResponse.json(
        {
          error: "studentId is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!language) {
      return NextResponse.json(
        {
          error: "language is required.",
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
          error: "Invalid action.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      action === "complete" &&
      !runId
    ) {
      return NextResponse.json(
        {
          error:
            "runId is required when recording a completion.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * --------------------------------------------------
     * 3. Resolve authenticated parent's profile
     * --------------------------------------------------
     */

    const {
      data: parentProfile,
      error: parentError,
    } = await supabaseAdmin
      .from("parent_profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (parentError) {
      throw parentError;
    }

    if (!parentProfile) {
      return NextResponse.json(
        {
          error:
            "A parent or learner profile could not be found.",
        },
        {
          status: 403,
        },
      );
    }

    /*
     * --------------------------------------------------
     * 4. Verify this learner belongs to this account
     * --------------------------------------------------
     */

    const {
      data: learner,
      error: learnerError,
    } = await supabaseAdmin
      .from("student_profiles")
      .select("id")
      .eq("id", studentId)
      .eq(
        "parent_id",
        parentProfile.id,
      )
      .maybeSingle();

    if (learnerError) {
      throw learnerError;
    }

    if (!learner) {
      return NextResponse.json(
        {
          error:
            "Learner not found or access denied.",
        },
        {
          status: 403,
        },
      );
    }

    /*
     * --------------------------------------------------
     * 5. PREMIUM BUNDLE CHECK
     *
     * Premium bundle provides AI full access for
     * this learner + language.
     * --------------------------------------------------
     */

    const now =
      new Date().toISOString();

    const {
      data: premiumBundle,
      error: premiumError,
    } = await supabaseAdmin
      .from(
        "language_access_entitlements",
      )
      .select(
        `
          id,
          ai_full_access,
          status,
          starts_at,
          ends_at
        `,
      )
      .eq(
        "user_id",
        user.id,
      )
      .eq(
        "student_id",
        studentId,
      )
      .ilike(
        "language",
        language,
      )
      .eq(
        "access_source",
        "PREMIUM_BUNDLE",
      )
      .eq(
        "ai_full_access",
        true,
      )
      .eq(
        "status",
        "ACTIVE",
      )
      .lte(
        "starts_at",
        now,
      )
      .gte(
        "ends_at",
        now,
      )
      .maybeSingle();

    if (premiumError) {
      throw premiumError;
    }

    if (premiumBundle) {
      return NextResponse.json({
        allowed: true,
        accessType:
          "PREMIUM_BUNDLE" satisfies AccessSource,

        unlimited: true,

        completedRuns: null,
        freeRunsRemaining: null,

        foundationLocked: false,
      });
    }

    /*
     * --------------------------------------------------
     * 6. ACADEMY SUBSCRIPTION CHECK
     *
     * Subscription must:
     * - belong to authenticated user
     * - be genuinely paid/trialing
     * - cover this learner
     * - include "languages"
     * - provide at least foundation tier
     * --------------------------------------------------
     */

    const {
      data: academySubscription,
      error: subscriptionError,
    } = await supabaseAdmin
      .from(
        "academy_subscriptions",
      )
      .select(
        `
          id,
          plan_id,
          status,
          current_period_end,
          trial_ends_at
        `,
      )
      .eq(
        "user_id",
        user.id,
      )
      .in(
        "status",
        PAID_SUBSCRIPTION_STATUSES,
      )
      .maybeSingle();

    if (subscriptionError) {
      throw subscriptionError;
    }

    if (academySubscription) {
      const {
        data: learnerAssignment,
        error: assignmentError,
      } = await supabaseAdmin
        .from(
          "academy_subscription_learners",
        )
        .select("id")
        .eq(
          "subscription_id",
          academySubscription.id,
        )
        .eq(
          "student_id",
          studentId,
        )
        .maybeSingle();

      if (assignmentError) {
        throw assignmentError;
      }

      if (learnerAssignment) {
        const {
          data: plan,
          error: planError,
        } = await supabaseAdmin
          .from(
            "academy_subscription_plans",
          )
          .select(
            `
              id,
              access_tier,
              academy_access
            `,
          )
          .eq(
            "id",
            academySubscription.plan_id,
          )
          .eq(
            "is_active",
            true,
          )
          .maybeSingle();

        if (planError) {
          throw planError;
        }

        if (plan) {
          const academyAccess =
            Array.isArray(
              plan.academy_access,
            )
              ? plan.academy_access.map(
                  (value: string) =>
                    String(
                      value,
                    ).toLowerCase(),
                )
              : [];

          const accessTier =
            String(
              plan.access_tier ?? "",
            ).toLowerCase();

          const tierRank: Record<
            string,
            number
          > = {
            free: 0,
            foundation: 1,
            premium: 2,
            professional: 3,
          };

          const hasLanguageAcademy =
            academyAccess.includes(
              "languages",
            );

          const hasPaidTier =
            (tierRank[
              accessTier
            ] ?? 0) >= 1;

          if (
            hasLanguageAcademy &&
            hasPaidTier
          ) {
            return NextResponse.json({
              allowed: true,

              accessType:
                "ACADEMY_SUBSCRIPTION" satisfies AccessSource,

              unlimited: true,

              completedRuns: null,
              freeRunsRemaining: null,

              foundationLocked:
                false,
            });
          }
        }
      }
    }

    /*
     * --------------------------------------------------
     * 7. FREE FOUNDATION ACCESS
     * --------------------------------------------------
     */

    const {
      data: foundationState,
      error: foundationError,
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
      .ilike(
        "language",
        language,
      )
      .maybeSingle();

    if (foundationError) {
      throw foundationError;
    }

    const currentRuns =
      Math.min(
        Number(
          foundationState
            ?.completed_runs ?? 0,
        ),
        2,
      );

    /*
     * CHECK only:
     *
     * Do not consume anything.
     */
    if (action === "check") {
      const locked =
        currentRuns >= 2;

      return NextResponse.json({
        allowed: !locked,

        accessType:
          "FREE_FOUNDATION" satisfies AccessSource,

        unlimited: false,

        completedRuns:
          currentRuns,

        freeRunsRemaining:
          Math.max(
            2 - currentRuns,
            0,
          ),

        foundationLocked:
          locked,
      });
    }

    /*
     * --------------------------------------------------
     * 8. COMPLETE FREE FOUNDATION RUN
     *
     * Database RPC performs idempotent recording.
     * --------------------------------------------------
     */

    const {
      data: completionRows,
      error: completionError,
    } = await supabaseAdmin.rpc(
      "record_language_foundation_completion",
      {
        p_student_id:
          studentId,

        p_language:
          language,

        p_run_id:
          runId,
      },
    );

    if (completionError) {
      throw completionError;
    }

    const completion =
      Array.isArray(
        completionRows,
      )
        ? completionRows[0]
        : completionRows;

    const completedRuns =
      Number(
        completion?.completed_runs ??
          currentRuns,
      );

    const freeRunsRemaining =
      Number(
        completion
          ?.free_access_remaining ??
          Math.max(
            2 - completedRuns,
            0,
          ),
      );

    const foundationLocked =
      Boolean(
        completion
          ?.foundation_locked ??
          completedRuns >= 2,
      );

    return NextResponse.json({
      /*
       * The run that just finished was valid,
       * so completion succeeds.
       *
       * foundationLocked tells the client that
       * another Foundation run may NOT start.
       */
      allowed: true,

      accessType:
        "FREE_FOUNDATION" satisfies AccessSource,

      unlimited: false,

      completedRuns,

      freeRunsRemaining,

      foundationLocked,

      alreadyRecorded:
        Boolean(
          completion
            ?.already_recorded,
        ),
    });
  } catch (error: unknown) {
    console.error(
      "foundation-access error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to determine FountainTalk access.",
      },
      {
        status: 500,
      },
    );
  }
}