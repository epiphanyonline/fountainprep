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
};

type PlanRow = {
  id: string;
  name: string;
  stripe_price_id: string | null;
  included_learner_count: number | null;
  is_active: boolean;
};

export async function POST(req: Request) {
  try {
    const user = await authenticateRequest(req);

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

    const planId = body.planId?.trim();
    const studentId =
      body.studentId?.trim() || null;

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

    const plan = await getPlan(planId);

    if (!plan || !plan.is_active) {
      return NextResponse.json(
        {
          error:
            "Subscription plan was not found.",
        },
        { status: 404 },
      );
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

    if (studentId) {
      const ownsLearner =
        await userOwnsLearner(
          user.id,
          studentId,
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

    const existingSubscription =
      await getExistingSubscription(user.id);

    if (existingSubscription) {
      return NextResponse.json(
        {
          error:
            "You already have an academy subscription. Subscription changes will be handled through account management.",
        },
        { status: 409 },
      );
    }

    const session =
      await stripe.checkout.sessions.create({
        mode: "subscription",

        customer_email:
          user.email || undefined,

        client_reference_id: user.id,

        success_url:
          `${normalisedAppUrl()}` +
          `/fountaintalk?subscription=success` +
          `&session_id={CHECKOUT_SESSION_ID}` +
          (studentId
            ? `&studentId=${encodeURIComponent(studentId)}`
            : ""),

        cancel_url:
          `${normalisedAppUrl()}` +
          `/pricing?product=academies` +
          `&subscription=cancelled` +
          (studentId
            ? `&studentId=${encodeURIComponent(studentId)}`
            : ""),

        line_items: [
          {
            price: plan.stripe_price_id,
            quantity: 1,
          },
        ],

        metadata: {
          payment_type:
            "academy_subscription",
          user_id: user.id,
          plan_id: plan.id,
          student_id: studentId || "",
        },

        subscription_data: {
          metadata: {
            payment_type:
              "academy_subscription",
            user_id: user.id,
            plan_id: plan.id,
            student_id: studentId || "",
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
      .from("academy_subscriptions")
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

  return (data ?? null) as PlanRow | null;
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
    .eq("user_id", userId)
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
    .eq("parent_id", parent.id)
    .maybeSingle();

  if (learnerError) {
    throw learnerError;
  }

  return Boolean(learner);
}

async function getExistingSubscription(
  userId: string,
) {
  const {
    data,
    error,
  } = await supabaseAdmin
    .from("academy_subscriptions")
    .select("id")
    .eq("user_id", userId)
    .in("status", [
      "trialing",
      "active",
      "past_due",
      "paused",
      "incomplete",
    ])
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

function normalisedAppUrl() {
  return appUrl!.replace(/\/$/, "");
}