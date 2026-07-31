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

type SubscriptionRow = {
  stripe_customer_id: string | null;
};

export async function POST(req: Request) {
  try {
    const user = await authenticateRequest(req);

    if (!user) {
      return NextResponse.json(
        {
          error:
            "You must be logged in to manage billing.",
        },
        { status: 401 },
      );
    }

    const subscription =
      await getSubscription(user.id);

    if (!subscription) {
      return NextResponse.json(
        {
          error:
            "No academy subscription was found.",
        },
        { status: 404 },
      );
    }

    if (!subscription.stripe_customer_id) {
      return NextResponse.json(
        {
          error:
            "This subscription is not connected to a Stripe customer.",
        },
        { status: 409 },
      );
    }

    const portalSession =
      await stripe.billingPortal.sessions.create({
        customer:
          subscription.stripe_customer_id,

        return_url:
          `${normalisedAppUrl()}/account` +
          "?billing=returned",
      });

    return NextResponse.json({
      url: portalSession.url,
    });
  } catch (error: unknown) {
    console.error(
      "academy-customer-portal error",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to open subscription management.",
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

async function getSubscription(
  userId: string,
): Promise<SubscriptionRow | null> {
  const {
    data,
    error,
  } = await supabaseAdmin
    .from("academy_subscriptions")
    .select("stripe_customer_id")
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

function normalisedAppUrl() {
  return appUrl!.replace(/\/$/, "");
}