import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

import { stripe } from "../../../lib/stripe";

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

type ConfirmBody = {
  sessionId?: string;
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
            "You must be logged in to confirm this subscription.",
        },
        { status: 401 },
      );
    }

    const body =
      (await req.json()) as ConfirmBody;

    const sessionId =
      body.sessionId?.trim();

    if (!sessionId) {
      return NextResponse.json(
        {
          error:
            "Missing Stripe checkout session ID.",
        },
        { status: 400 },
      );
    }

    const session =
      await stripe.checkout.sessions.retrieve(
        sessionId,
        {
          expand: [
            "subscription",
          ],
        },
      );

    if (
      session.metadata?.payment_type !==
      "academy_subscription"
    ) {
      return NextResponse.json(
        {
          error:
            "This Stripe session is not an Academy subscription.",
        },
        { status: 400 },
      );
    }

    const metadataUserId =
      session.metadata?.user_id;

    const planId =
      session.metadata?.plan_id;

    const studentId =
      session.metadata?.student_id?.trim() ||
      null;

    if (
      !metadataUserId ||
      !planId
    ) {
      return NextResponse.json(
        {
          error:
            "The Stripe session is missing Academy subscription metadata.",
        },
        { status: 409 },
      );
    }

    if (
      metadataUserId !==
      user.id
    ) {
      return NextResponse.json(
        {
          error:
            "This checkout session belongs to a different account.",
        },
        { status: 403 },
      );
    }

    /*
     * For card payments Stripe Checkout normally returns
     * payment_status = paid. For subscription Checkout the
     * subscription itself is the final source of truth.
     */
    const stripeSubscription =
      getExpandedSubscription(
        session.subscription,
      );

    if (!stripeSubscription) {
      return NextResponse.json(
        {
          pending: true,
          error:
            "Stripe has not attached the subscription to this checkout session yet.",
        },
        { status: 202 },
      );
    }

    const status =
      mapStripeSubscriptionStatus(
        stripeSubscription.status,
      );

    if (
      status !== "active" &&
      status !== "trialing"
    ) {
      return NextResponse.json(
        {
          pending:
            status === "incomplete",
          status,
          error:
            status === "incomplete"
              ? "Your payment is still being confirmed by Stripe."
              : "The Stripe subscription is not currently active.",
        },
        {
          status:
            status === "incomplete"
              ? 202
              : 409,
        },
      );
    }

    const stripeCustomerId =
      typeof stripeSubscription.customer ===
      "string"
        ? stripeSubscription.customer
        : stripeSubscription.customer.id;

    const item =
      stripeSubscription.items.data[0];

    const currentPeriodStart =
      item?.current_period_start
        ? new Date(
            item.current_period_start *
              1000,
          ).toISOString()
        : null;

    const currentPeriodEnd =
      item?.current_period_end
        ? new Date(
            item.current_period_end *
              1000,
          ).toISOString()
        : null;

    const trialStartedAt =
      stripeSubscription.trial_start
        ? new Date(
            stripeSubscription.trial_start *
              1000,
          ).toISOString()
        : null;

    const trialEndsAt =
      stripeSubscription.trial_end
        ? new Date(
            stripeSubscription.trial_end *
              1000,
          ).toISOString()
        : null;

    const {
      data: academySubscription,
      error: updateError,
    } = await supabaseAdmin
      .from(
        "academy_subscriptions",
      )
      .update({
        plan_id: planId,
        status,
        stripe_customer_id:
          stripeCustomerId,
        stripe_subscription_id:
          stripeSubscription.id,
        current_period_start:
          currentPeriodStart,
        current_period_end:
          currentPeriodEnd,
        trial_started_at:
          trialStartedAt,
        trial_ends_at:
          trialEndsAt,
        cancel_at_period_end:
          stripeSubscription
            .cancel_at_period_end,
        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "stripe_checkout_session_id",
        session.id,
      )
      .eq(
        "user_id",
        user.id,
      )
      .select(
        "id, plan_id, status",
      )
      .maybeSingle();

    if (updateError) {
      throw updateError;
    }

    if (!academySubscription) {
      /*
       * This is a resilience path. In normal operation the
       * checkout endpoint inserts the incomplete row before
       * redirecting to Stripe.
       */
      const {
        data: inserted,
        error: insertError,
      } = await supabaseAdmin
        .from(
          "academy_subscriptions",
        )
        .insert({
          user_id: user.id,
          plan_id: planId,
          status,
          stripe_customer_id:
            stripeCustomerId,
          stripe_subscription_id:
            stripeSubscription.id,
          stripe_checkout_session_id:
            session.id,
          current_period_start:
            currentPeriodStart,
          current_period_end:
            currentPeriodEnd,
          trial_started_at:
            trialStartedAt,
          trial_ends_at:
            trialEndsAt,
          cancel_at_period_end:
            stripeSubscription
              .cancel_at_period_end,
        })
        .select(
          "id, plan_id, status",
        )
        .single();

      if (insertError) {
        throw insertError;
      }

      if (studentId) {
        await ensureLearnerAssignment(
          inserted.id,
          studentId,
          user.id,
        );
      }

      return NextResponse.json({
        confirmed: true,
        subscriptionId:
          inserted.id,
        planId:
          inserted.plan_id,
        status:
          inserted.status,
        studentId,
      });
    }

    if (studentId) {
      await ensureLearnerAssignment(
        academySubscription.id,
        studentId,
        user.id,
      );
    }

    /*
     * Cancel older stale checkout rows for the same user.
     * Never alter active/trialing rows.
     */
    await supabaseAdmin
      .from(
        "academy_subscriptions",
      )
      .update({
        status: "cancelled",
        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "user_id",
        user.id,
      )
      .eq(
        "status",
        "incomplete",
      )
      .neq(
        "id",
        academySubscription.id,
      );

    return NextResponse.json({
      confirmed: true,
      subscriptionId:
        academySubscription.id,
      planId:
        academySubscription.plan_id,
      status:
        academySubscription.status,
      studentId,
    });
  } catch (error: unknown) {
    console.error(
      "academy-subscription-confirm error",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to confirm Academy subscription.",
      },
      { status: 500 },
    );
  }
}

function getExpandedSubscription(
  value:
    | string
    | Stripe.Subscription
    | null,
) {
  if (
    !value ||
    typeof value === "string"
  ) {
    return null;
  }

  return value;
}

async function ensureLearnerAssignment(
  subscriptionId: string,
  studentId: string,
  userId: string,
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

  if (parentError) {
    throw parentError;
  }

  if (!parent) {
    throw new Error(
      "Account owner profile was not found.",
    );
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

  if (learnerError) {
    throw learnerError;
  }

  if (!learner) {
    throw new Error(
      "The learner attached to this checkout does not belong to the signed-in account.",
    );
  }

  const {
    error: assignmentError,
  } = await supabaseAdmin
    .from(
      "academy_subscription_learners",
    )
    .upsert(
      {
        subscription_id:
          subscriptionId,
        student_id: studentId,
      },
      {
        onConflict:
          "subscription_id,student_id",
        ignoreDuplicates: true,
      },
    );

  if (assignmentError) {
    throw assignmentError;
  }
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

function mapStripeSubscriptionStatus(
  status:
    Stripe.Subscription.Status,
):
  | "trialing"
  | "active"
  | "past_due"
  | "paused"
  | "cancelled"
  | "incomplete"
  | "expired" {
  switch (status) {
    case "trialing":
      return "trialing";

    case "active":
      return "active";

    case "past_due":
    case "unpaid":
      return "past_due";

    case "paused":
      return "paused";

    case "canceled":
      return "cancelled";

    case "incomplete_expired":
      return "expired";

    case "incomplete":
    default:
      return "incomplete";
  }
}
