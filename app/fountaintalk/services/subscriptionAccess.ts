import { supabase } from "@/app/lib/supabase";

import type {
  AcademyAccessTier,
} from "../types/academy";

export type AcademySubscriptionPlan = {
  id: string;
  name: string;
  description: string | null;
  billingInterval: "none" | "month" | "year";
  priceGbpPence: number;
  includedLearnerCount: number | null;
  accessTier: AcademyAccessTier;
  academyAccess: string[];
  marketplaceDiscountPercent: number;
  certificateAccess: boolean;
  professionalFeatures: boolean;
};

export type AcademySubscriptionAccess = {
  plan: AcademySubscriptionPlan;
  status:
    | "inactive"
    | "trialing"
    | "active"
    | "past_due"
    | "paused"
    | "cancelled"
    | "incomplete"
    | "expired";
  subscriptionId: string | null;
  learnerCovered: boolean;
  currentPeriodEnd: string | null;
  trialEndsAt: string | null;
  cancelAtPeriodEnd: boolean;
};

type SubscriptionPlanRow = {
  id: string;
  name: string;
  description: string | null;
  billing_interval: "none" | "month" | "year";
  price_gbp_pence: number;
  included_learner_count: number | null;
  access_tier: AcademyAccessTier;
  academy_access: string[];
  marketplace_discount_percent: number;
  certificate_access: boolean;
  professional_features: boolean;
};

type SubscriptionRow = {
  id: string;
  plan_id: string;
  status: AcademySubscriptionAccess["status"];
  current_period_end: string | null;
  trial_ends_at: string | null;
  cancel_at_period_end: boolean;
};

function mapPlan(
  row: SubscriptionPlanRow,
): AcademySubscriptionPlan {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    billingInterval: row.billing_interval,
    priceGbpPence: row.price_gbp_pence,
    includedLearnerCount: row.included_learner_count,
    accessTier: row.access_tier,
    academyAccess: row.academy_access,
    marketplaceDiscountPercent:
      row.marketplace_discount_percent,
    certificateAccess: row.certificate_access,
    professionalFeatures:
      row.professional_features,
  };
}

export async function getAcademySubscriptionAccess(
  studentId: string | null,
): Promise<AcademySubscriptionAccess> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw authError;
  }

  const freePlan = await getPlanById("free");

  if (!user) {
    return {
      plan: freePlan,
      status: "inactive",
      subscriptionId: null,
      learnerCovered: false,
      currentPeriodEnd: null,
      trialEndsAt: null,
      cancelAtPeriodEnd: false,
    };
  }

  /*
   * Only statuses that actually grant paid Academy access
   * are considered here.
   *
   * incomplete = checkout started but payment/subscription
   * was never activated, so it MUST NOT unlock content.
   *
   * past_due / paused are retained in the database for
   * account management, but they also MUST NOT unlock the
   * classroom.
   */
  const {
    data: subscription,
    error: subscriptionError,
  } = await supabase
    .from("academy_subscriptions")
    .select(
      `
        id,
        plan_id,
        status,
        current_period_end,
        trial_ends_at,
        cancel_at_period_end
      `,
    )
    .eq("user_id", user.id)
    .in("status", [
      "trialing",
      "active",
    ])
    .maybeSingle();

  if (subscriptionError) {
    throw subscriptionError;
  }

  if (!subscription) {
    return {
      plan: freePlan,
      status: "inactive",
      subscriptionId: null,
      learnerCovered: false,
      currentPeriodEnd: null,
      trialEndsAt: null,
      cancelAtPeriodEnd: false,
    };
  }

  const subscriptionRow =
    subscription as SubscriptionRow;

  const plan = await getPlanById(
    subscriptionRow.plan_id,
  );

  let learnerCovered = false;

  if (studentId) {
    const {
      data: assignedLearner,
      error: learnerError,
    } = await supabase
      .from("academy_subscription_learners")
      .select("id")
      .eq(
        "subscription_id",
        subscriptionRow.id,
      )
      .eq("student_id", studentId)
      .maybeSingle();

    if (learnerError) {
      throw learnerError;
    }

    learnerCovered =
      Boolean(assignedLearner);
  }

  return {
    plan,
    status: subscriptionRow.status,
    subscriptionId: subscriptionRow.id,
    learnerCovered,
    currentPeriodEnd:
      subscriptionRow.current_period_end,
    trialEndsAt:
      subscriptionRow.trial_ends_at,
    cancelAtPeriodEnd:
      subscriptionRow.cancel_at_period_end,
  };
}

export async function getAcademyPlans(): Promise<
  AcademySubscriptionPlan[]
> {
  const {
    data,
    error,
  } = await supabase
    .from("academy_subscription_plans")
    .select(
      `
        id,
        name,
        description,
        billing_interval,
        price_gbp_pence,
        included_learner_count,
        access_tier,
        academy_access,
        marketplace_discount_percent,
        certificate_access,
        professional_features
      `,
    )
    .eq("is_active", true)
    .order("sort_order");

  if (error) {
    throw error;
  }

  return (data as SubscriptionPlanRow[]).map(
    mapPlan,
  );
}

async function getPlanById(
  planId: string,
): Promise<AcademySubscriptionPlan> {
  const {
    data,
    error,
  } = await supabase
    .from("academy_subscription_plans")
    .select(
      `
        id,
        name,
        description,
        billing_interval,
        price_gbp_pence,
        included_learner_count,
        access_tier,
        academy_access,
        marketplace_discount_percent,
        certificate_access,
        professional_features
      `,
    )
    .eq("id", planId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error(
      `Academy subscription plan "${planId}" was not found.`,
    );
  }

  return mapPlan(
    data as SubscriptionPlanRow,
  );
}

const accessTierRank: Record<
  AcademyAccessTier,
  number
> = {
  free: 0,
  foundation: 1,
  premium: 2,
  professional: 3,
};

export function canAccessAcademyTier(
  availableTier: AcademyAccessTier,
  requiredTier: AcademyAccessTier,
): boolean {
  return (
    accessTierRank[availableTier] >=
    accessTierRank[requiredTier]
  );
}
