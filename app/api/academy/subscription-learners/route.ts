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

type SubscriptionRow = {
  id: string;
  plan_id: string;
  status: string;
};

type PlanRow = {
  id: string;
  name: string;
  included_learner_count: number | null;
};

type LearnerRow = {
  id: string;
  full_name: string;
  child_age: number | null;
  age_group: string | null;
  is_self_learner: boolean;
};

type UpdateLearnerBody = {
  studentId?: string;
  covered?: boolean;
};

export async function GET(req: Request) {
  try {
    const user = await authenticateRequest(req);

    if (!user) {
      return NextResponse.json(
        {
          error:
            "You must be logged in to manage learners.",
        },
        { status: 401 },
      );
    }

    const parentProfile =
      await getAccountOwnerProfile(user.id);

    if (!parentProfile) {
      return NextResponse.json(
        {
          error:
            "Account owner profile was not found.",
        },
        { status: 404 },
      );
    }

    const learners =
      await getOwnedLearners(parentProfile.id);

    const subscription =
      await getActiveSubscription(user.id);

    if (!subscription) {
      return NextResponse.json({
        subscription: null,
        plan: null,
        learners: learners.map((learner) => ({
          id: learner.id,
          fullName: learner.full_name,
          childAge: learner.child_age,
          ageGroup: learner.age_group,
          isSelfLearner:
            learner.is_self_learner,
          covered: false,
        })),
        coveredCount: 0,
        remainingSlots: 0,
      });
    }

    const plan = await getPlan(
      subscription.plan_id,
    );

    if (!plan) {
      return NextResponse.json(
        {
          error:
            "Academy subscription plan was not found.",
        },
        { status: 404 },
      );
    }

    const coveredLearnerIds =
      await getCoveredLearnerIds(
        subscription.id,
      );

    const coveredCount =
      coveredLearnerIds.size;

    const remainingSlots =
      plan.included_learner_count === null
        ? null
        : Math.max(
            plan.included_learner_count -
              coveredCount,
            0,
          );

    return NextResponse.json({
      subscription: {
        id: subscription.id,
        planId: subscription.plan_id,
        status: subscription.status,
      },

      plan: {
        id: plan.id,
        name: plan.name,
        includedLearnerCount:
          plan.included_learner_count,
      },

      learners: learners.map((learner) => ({
        id: learner.id,
        fullName: learner.full_name,
        childAge: learner.child_age,
        ageGroup: learner.age_group,
        isSelfLearner:
          learner.is_self_learner,
        covered:
          coveredLearnerIds.has(learner.id),
      })),

      coveredCount,
      remainingSlots,
    });
  } catch (error: unknown) {
    console.error(
      "subscription-learners GET error",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load subscription learners.",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await authenticateRequest(req);

    if (!user) {
      return NextResponse.json(
        {
          error:
            "You must be logged in to manage learners.",
        },
        { status: 401 },
      );
    }

    const body =
      (await req.json()) as UpdateLearnerBody;

    const studentId =
      body.studentId?.trim() ?? "";

    if (
      !studentId ||
      typeof body.covered !== "boolean"
    ) {
      return NextResponse.json(
        {
          error:
            "studentId and covered are required.",
        },
        { status: 400 },
      );
    }

    const parentProfile =
      await getAccountOwnerProfile(user.id);

    if (!parentProfile) {
      return NextResponse.json(
        {
          error:
            "Account owner profile was not found.",
        },
        { status: 404 },
      );
    }

    const learner =
      await getOwnedLearner(
        parentProfile.id,
        studentId,
      );

    if (!learner) {
      return NextResponse.json(
        {
          error:
            "Learner was not found on this account.",
        },
        { status: 404 },
      );
    }

    const subscription =
      await getActiveSubscription(user.id);

    if (!subscription) {
      return NextResponse.json(
        {
          error:
            "No active academy subscription was found.",
        },
        { status: 404 },
      );
    }

    const plan = await getPlan(
      subscription.plan_id,
    );

    if (!plan) {
      return NextResponse.json(
        {
          error:
            "Academy subscription plan was not found.",
        },
        { status: 404 },
      );
    }

    const coveredLearnerIds =
      await getCoveredLearnerIds(
        subscription.id,
      );

    const alreadyCovered =
      coveredLearnerIds.has(studentId);

    if (body.covered) {
      if (alreadyCovered) {
        return NextResponse.json({
          success: true,
        });
      }

      if (
        plan.included_learner_count !== null &&
        coveredLearnerIds.size >=
          plan.included_learner_count
      ) {
        return NextResponse.json(
          {
            error:
              "This subscription has reached its learner limit.",
          },
          { status: 409 },
        );
      }

      const { error } = await supabaseAdmin
        .from(
          "academy_subscription_learners",
        )
        .insert({
          subscription_id:
            subscription.id,
          student_id: studentId,
        });

      if (error) {
        throw error;
      }

      return NextResponse.json({
        success: true,
      });
    }

    if (!alreadyCovered) {
      return NextResponse.json({
        success: true,
      });
    }

    if (
      learner.is_self_learner &&
      coveredLearnerIds.size === 1
    ) {
      return NextResponse.json(
        {
          error:
            "The only covered self-learner cannot be removed.",
        },
        { status: 409 },
      );
    }

    const { error } = await supabaseAdmin
      .from(
        "academy_subscription_learners",
      )
      .delete()
      .eq(
        "subscription_id",
        subscription.id,
      )
      .eq("student_id", studentId);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error: unknown) {
    console.error(
      "subscription-learners POST error",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to update subscription learner.",
      },
      { status: 500 },
    );
  }
}

async function authenticateRequest(
  req: Request,
) {
  const authorization =
    req.headers.get("authorization");

  const accessToken =
    authorization?.startsWith("Bearer ")
      ? authorization
          .slice("Bearer ".length)
          .trim()
      : "";

  if (!accessToken) {
    return null;
  }

  const {
    data,
    error,
  } = await supabaseAdmin.auth.getUser(
    accessToken,
  );

  if (error || !data.user) {
    return null;
  }

  return data.user;
}

async function getAccountOwnerProfile(
  userId: string,
): Promise<{ id: string } | null> {
  const {
    data,
    error,
  } = await supabaseAdmin
    .from("parent_profiles")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function getOwnedLearners(
  parentId: string,
): Promise<LearnerRow[]> {
  const {
    data,
    error,
  } = await supabaseAdmin
    .from("student_profiles")
    .select(
      `
        id,
        full_name,
        child_age,
        age_group,
        is_self_learner
      `,
    )
    .eq("parent_id", parentId)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return (data ?? []) as LearnerRow[];
}

async function getOwnedLearner(
  parentId: string,
  studentId: string,
): Promise<LearnerRow | null> {
  const {
    data,
    error,
  } = await supabaseAdmin
    .from("student_profiles")
    .select(
      `
        id,
        full_name,
        child_age,
        age_group,
        is_self_learner
      `,
    )
    .eq("parent_id", parentId)
    .eq("id", studentId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data ?? null) as
    | LearnerRow
    | null;
}

async function getActiveSubscription(
  userId: string,
): Promise<SubscriptionRow | null> {
  const {
    data,
    error,
  } = await supabaseAdmin
    .from("academy_subscriptions")
    .select("id, plan_id, status")
    .eq("user_id", userId)
    .in("status", [
      "trialing",
      "active",
      "past_due",
      "paused",
    ])
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data ?? null) as
    | SubscriptionRow
    | null;
}

async function getPlan(
  planId: string,
): Promise<PlanRow | null> {
  const {
    data,
    error,
  } = await supabaseAdmin
    .from("academy_subscription_plans")
    .select(
      `
        id,
        name,
        included_learner_count
      `,
    )
    .eq("id", planId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data ?? null) as PlanRow | null;
}

async function getCoveredLearnerIds(
  subscriptionId: string,
): Promise<Set<string>> {
  const {
    data,
    error,
  } = await supabaseAdmin
    .from("academy_subscription_learners")
    .select("student_id")
    .eq(
      "subscription_id",
      subscriptionId,
    );

  if (error) {
    throw error;
  }

  return new Set(
    (data ?? []).map(
      (row: { student_id: string }) =>
        row.student_id,
    ),
  );
}