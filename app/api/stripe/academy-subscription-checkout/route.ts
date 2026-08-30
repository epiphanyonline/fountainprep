import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { stripe } from "../../../lib/stripe";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL;

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

if (!appUrl) {
  throw new Error(
    "Missing NEXT_PUBLIC_APP_URL",
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

type RequestBody = {
  planId?: string;
  studentId?: string | null;
  academyId?: string | null;
  programmeId?: string | null;
};

type PlanRow = {
  id: string;
  name: string;
  stripe_price_id: string | null;
  included_learner_count:
    number | null;
  is_active: boolean;
};

export async function POST(
  req: Request,
) {
  try {
    const user =
      await authenticateRequest(req);

    if (!user) {
      return NextResponse.json(
        {
          error:
            "You must be logged in to subscribe.",
        },
        { status: 401 },
      );
    }

    const body =
      (await req.json()) as RequestBody;

    const planId =
      body.planId?.trim();

    const studentId =
      body.studentId?.trim() || null;

    const academyId =
      canonicalAcademyCode(
        body.academyId?.trim() ||
          null,
      );

    const programmeId =
      body.programmeId?.trim() ||
      defaultProgrammeId(
        academyId,
      );

    if (!planId) {
      return NextResponse.json(
        { error: "Missing planId." },
        { status: 400 },
      );
    }

    if (planId === "free") {
      return NextResponse.json(
        {
          error:
            "The free plan does not require checkout.",
        },
        { status: 400 },
      );
    }

    const plan =
      await getPlan(planId);

    if (!plan || !plan.is_active) {
      return NextResponse.json(
        {
          error:
            "Subscription plan was not found.",
        },
        { status: 404 },
      );
    }

    if (isProfessionalPlan(plan)) {
      return NextResponse.json(
        {
          error:
            "Professional Academy access is not available for purchase yet.",
        },
        { status: 403 },
      );
    }

    const account =
      await getAccountContext(user.id);

    if (!account) {
      return NextResponse.json(
        {
          error:
            "Your FountainPrep account profile is incomplete.",
        },
        { status: 409 },
      );
    }

    let resolvedStudentId =
      studentId;

    if (isIndividualPlan(plan)) {
      if (
        account.accountType !==
        "ADULT_LEARNER"
      ) {
        return NextResponse.json(
          {
            error:
              "Premium Individual is only available to an Individual Learner account. Family accounts should choose the Family plan.",
          },
          { status: 403 },
        );
      }

      const selfLearner =
        await getSelfLearner(
          account.parentProfileId,
        );

      if (!selfLearner) {
        return NextResponse.json(
          {
            error:
              "Your Individual Learner profile is not ready yet. Please complete your learner account before subscribing.",
          },
          { status: 409 },
        );
      }

      if (
        resolvedStudentId &&
        resolvedStudentId !==
          selfLearner.id
      ) {
        return NextResponse.json(
          {
            error:
              "Premium Individual can only be assigned to your own learner profile.",
          },
          { status: 403 },
        );
      }

      resolvedStudentId =
        selfLearner.id;
    }

    if (isFamilyPlan(plan)) {
      if (
        account.accountType ===
        "ADULT_LEARNER"
      ) {
        return NextResponse.json(
          {
            error:
              "The Family plan requires a Parent or Guardian account.",
          },
          { status: 403 },
        );
      }

      /*
       * Do not block checkout because the parent account
       * contains more learner profiles than the Family plan
       * includes. The plan limit applies to learners assigned
       * to academy_subscription_learners, not to historical
       * student_profiles on the family account.
       *
       * The subscription-learners API remains the authority
       * that enforces plan.included_learner_count when seats
       * are assigned after purchase.
       */
    }

    if (!plan.stripe_price_id) {
      return NextResponse.json(
        {
          error:
            "This subscription plan is not configured for Stripe.",
        },
        { status: 409 },
      );
    }

    if (resolvedStudentId) {
      const ownsLearner =
        await userOwnsLearner(
          user.id,
          resolvedStudentId,
        );

      if (!ownsLearner) {
        return NextResponse.json(
          {
            error:
              "Learner not found or you do not have access to it.",
          },
          { status: 404 },
        );
      }
    }

    /*
     * A previous Stripe Checkout can leave a local
     * "incomplete" row when the customer never completes
     * payment. That is not an active subscription and must
     * not prevent a fresh checkout.
     */
    await retireIncompleteSubscriptions(
      user.id,
    );

    const existingSubscription =
      await getExistingSubscription(
        user.id,
      );

    if (existingSubscription) {
      return NextResponse.json(
        {
          error:
            "You already have an academy subscription. Subscription changes will be handled through account management.",
        },
        { status: 409 },
      );
    }

    const successPath =
      buildClassroomSuccessPath({
        academyId,
        programmeId,
        studentId: resolvedStudentId,
      });

    const cancelPath =
      buildPricingCancelPath({
        academyId,
        programmeId,
        studentId: resolvedStudentId,
        planId: plan.id,
      });

    const session =
      await stripe.checkout.sessions.create({
        mode: "subscription",

        customer_email:
          user.email || undefined,

        client_reference_id:
          user.id,

        success_url:
          `${normalisedAppUrl()}${successPath}`,

        cancel_url:
          `${normalisedAppUrl()}${cancelPath}`,

        line_items: [
          {
            price:
              plan.stripe_price_id,
            quantity: 1,
          },
        ],

        metadata: {
          payment_type:
            "academy_subscription",
          user_id: user.id,
          plan_id: plan.id,
          student_id:
            resolvedStudentId || "",
          academy_id:
            academyId || "",
          programme_id:
            programmeId || "",
        },

        subscription_data: {
          metadata: {
            payment_type:
              "academy_subscription",
            user_id: user.id,
            plan_id: plan.id,
            student_id:
              resolvedStudentId || "",
            academy_id:
              academyId || "",
            programme_id:
              programmeId || "",
          },
        },
      });

    if (!session.url) {
      return NextResponse.json(
        {
          error:
            "Stripe did not return a checkout URL.",
        },
        { status: 500 },
      );
    }

    const {
      error: insertError,
    } = await supabaseAdmin
      .from(
        "academy_subscriptions",
      )
      .insert({
        user_id: user.id,
        plan_id: plan.id,
        status: "incomplete",
        stripe_checkout_session_id:
          session.id,
      });

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({
      url: session.url,
    });
  } catch (error: unknown) {
    console.error(
      "academy-subscription-checkout error",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to create subscription checkout session.",
      },
      { status: 500 },
    );
  }
}

function buildClassroomSuccessPath({
  academyId,
  programmeId,
  studentId,
}: {
  academyId: string | null;
  programmeId: string | null;
  studentId: string | null;
}) {
  /*
   * A Family subscription can be purchased before a child
   * is selected. In that case return to the academy start
   * orchestrator so the parent can add/select a learner.
   */
  if (!studentId) {
    const query =
      new URLSearchParams({
        subscription: "success",
        session_id:
          "{CHECKOUT_SESSION_ID}",
      });

    if (academyId) {
      query.set("academy", academyId);
    }

    if (programmeId) {
      query.set(
        "programme",
        programmeId,
      );
    }

    return (
      `/academies/financial-literacy/start?` +
      query
        .toString()
        .replace(
          "%7BCHECKOUT_SESSION_ID%7D",
          "{CHECKOUT_SESSION_ID}",
        )
    );
  }

  /*
   * Language lessons use the existing
   * FountainTalk classroom.
   */
  if (
    academyId === "languages"
  ) {
    const query =
      new URLSearchParams({
        subscription: "success",
        session_id:
          "{CHECKOUT_SESSION_ID}",
      });

    if (studentId) {
      query.set(
        "studentId",
        studentId,
      );
    }

    return (
  `/classroom?` +
  query
    .toString()
    .replace(
      "%7BCHECKOUT_SESSION_ID%7D",
      "{CHECKOUT_SESSION_ID}",
    )
);
  }

  const query =
    new URLSearchParams({
      subscription: "success",
      session_id:
        "{CHECKOUT_SESSION_ID}",
    });

  if (studentId) {
    query.set(
      "studentId",
      studentId,
    );
  }

  if (academyId) {
    query.set(
      "academy",
      academyId,
    );
  }

  if (programmeId) {
    query.set(
      "programme",
      programmeId,
    );
  }

  /*
   * Stripe requires the checkout-session
   * placeholder to remain unescaped.
   */
  return (
    `/classroom/academy?` +
    query
      .toString()
      .replace(
        "%7BCHECKOUT_SESSION_ID%7D",
        "{CHECKOUT_SESSION_ID}",
      )
  );
}

function buildPricingCancelPath({
  academyId,
  programmeId,
  studentId,
  planId,
}: {
  academyId: string | null;
  programmeId: string | null;
  studentId: string | null;
  planId: string;
}) {
  const query =
    new URLSearchParams({
      product: "academies",
      subscription: "cancelled",
      plan: planId,
    });

  if (studentId) {
    query.set(
      "studentId",
      studentId,
    );
  }

  if (academyId) {
    query.set(
      "academy",
      academyId,
    );
  }

  if (programmeId) {
    query.set(
      "programme",
      programmeId,
    );
  }

  return `/pricing?${query.toString()}`;
}

async function authenticateRequest(
  req: Request,
) {
  const authorization =
    req.headers.get(
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

async function getPlan(
  planId: string,
): Promise<PlanRow | null> {
  const {
    data,
    error,
  } = await supabaseAdmin
    .from(
      "academy_subscription_plans",
    )
    .select(
      `
        id,
        name,
        stripe_price_id,
        included_learner_count,
        is_active
      `,
    )
    .eq("id", planId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (
    (data ?? null) as
      | PlanRow
      | null
  );
}

async function userOwnsLearner(
  userId: string,
  studentId: string,
): Promise<boolean> {
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

  if (parentError) {
    throw parentError;
  }

  if (!parent) {
    return false;
  }

  const {
    data: learner,
    error: learnerError,
  } = await supabaseAdmin
    .from("student_profiles")
    .select("id")
    .eq("id", studentId)
    .eq(
      "parent_id",
      parent.id,
    )
    .maybeSingle();

  if (learnerError) {
    throw learnerError;
  }

  return Boolean(learner);
}

async function retireIncompleteSubscriptions(
  userId: string,
) {
  const {
    error,
  } = await supabaseAdmin
    .from(
      "academy_subscriptions",
    )
    .update({
      status: "cancelled",
    })
    .eq(
      "user_id",
      userId,
    )
    .eq(
      "status",
      "incomplete",
    );

  if (error) {
    throw error;
  }
}

async function getExistingSubscription(
  userId: string,
) {
  const {
    data,
    error,
  } = await supabaseAdmin
    .from(
      "academy_subscriptions",
    )
    .select("id")
    .eq(
      "user_id",
      userId,
    )
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

  return data;
}

type AccountContext = {
  parentProfileId: string;
  accountType:
    | "PARENT"
    | "ADULT_LEARNER";
};

async function getAccountContext(
  userId: string,
): Promise<AccountContext | null> {
  const {
    data,
    error,
  } = await supabaseAdmin
    .from("parent_profiles")
    .select("id, account_type")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return {
    parentProfileId: data.id,
    accountType:
      data.account_type ===
      "ADULT_LEARNER"
        ? "ADULT_LEARNER"
        : "PARENT",
  };
}

async function getSelfLearner(
  parentProfileId: string,
): Promise<{ id: string } | null> {
  const {
    data,
    error,
  } = await supabaseAdmin
    .from("student_profiles")
    .select("id")
    .eq(
      "parent_id",
      parentProfileId,
    )
    .eq(
      "is_self_learner",
      true,
    )
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

function normalisePlanIdentity(
  plan: PlanRow,
) {
  return `${plan.id} ${plan.name}`
    .trim()
    .toLowerCase();
}

function isIndividualPlan(
  plan: PlanRow,
) {
  const identity =
    normalisePlanIdentity(plan);

  return (
    identity.includes(
      "premium_individual",
    ) ||
    identity.includes(
      "premium individual",
    )
  );
}

function isFamilyPlan(
  plan: PlanRow,
) {
  return normalisePlanIdentity(
    plan,
  ).includes("family");
}

function isProfessionalPlan(
  plan: PlanRow,
) {
  return normalisePlanIdentity(
    plan,
  ).includes("professional");
}

function normalisedAppUrl() {
  return appUrl!.replace(
    /\/$/,
    "",
  );
}

function canonicalAcademyCode(
  academyId: string | null,
) {
  if (!academyId) {
    return null;
  }

  const normalised =
    academyId.toLowerCase();

  if (
  normalised === "wealth" ||
  normalised ===
    "financial-literacy"
) {
  return "personal-finance";
}

if (normalised === "language") {
  return "languages";
}

return normalised;
}

function defaultProgrammeId(
  academyId: string | null,
) {
  switch (academyId) {
    case "personal-finance":
      return "money-foundation";

    case "ai":
      return "ai-explorer";

    case "coding":
      return "coding-explorer";

    case "ielts":
      return "ielts-academic";

    case "data-analytics":
      return "data-analytics-foundation";

    case "digital-skills":
      return "digital-skills-foundation";

    case "mathematics":
      return "mathematics-foundation";

    case "english":
      return "english-foundation";

    case "science":
      return "science-foundation";

    case "languages":
      return "language-foundation";

    default:
      return null;
  }
}
