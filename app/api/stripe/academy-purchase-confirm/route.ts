
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { stripe } from "../../../lib/stripe";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing Supabase configuration.");
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

export async function POST(req: Request) {
  try {
    const user = await authenticateRequest(req);

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 },
      );
    }

    const body = (await req.json()) as ConfirmBody;
    const sessionId = body.sessionId?.trim();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing Stripe session ID." },
        { status: 400 },
      );
    }

    const session =
      await stripe.checkout.sessions.retrieve(sessionId);

    if (session.metadata?.payment_type !== "academy_purchase") {
      return NextResponse.json(
        { error: "Invalid academy purchase session." },
        { status: 400 },
      );
    }

    const academyId = session.metadata?.academy_id;
    const studentId =
      session.metadata?.student_id?.trim() || null;

    if (
      session.metadata?.user_id !== user.id ||
      !academyId
    ) {
      return NextResponse.json(
        { error: "Purchase account mismatch." },
        { status: 403 },
      );
    }

    if (
      ![1999, 3900].includes(session.amount_total ?? -1) ||
      session.currency?.toLowerCase() !== "gbp"
    ) {
      return NextResponse.json(
        { error: "Unexpected payment amount or currency." },
        { status: 409 },
      );
    }

    const { data: attempt, error: attemptError } =
      await supabaseAdmin
        .from("academy_payment_attempts")
        .select("id, purchase_id, status, amount, currency")
        .eq("stripe_checkout_session_id", session.id)
        .maybeSingle();

    if (attemptError) {
      throw attemptError;
    }

    if (!attempt) {
      return NextResponse.json(
        { error: "Payment attempt not found." },
        { status: 409 },
      );
    }

    // Verify Stripe against the exact recorded payment attempt.
    if (
      attempt.amount !== session.amount_total ||
      attempt.currency?.toLowerCase() !== session.currency?.toLowerCase()
    ) {
      return NextResponse.json(
        { error: "Payment amount or currency does not match the original checkout." },
        { status: 409 },
      );
    }

    const { data: purchase, error: purchaseError } =
      await supabaseAdmin
        .from("academy_purchases")
        .select(
          "id, user_id, academy_code, programme_id, student_id, status",
        )
        .eq("id", attempt.purchase_id)
        .maybeSingle();

    if (purchaseError) {
      throw purchaseError;
    }

    if (!purchase) {
      return NextResponse.json(
        { error: "Academy purchase not found." },
        { status: 409 },
      );
    }

    if (
      purchase.user_id !== user.id ||
      purchase.academy_code !== academyId ||
      (purchase.student_id ?? null) !== studentId
    ) {
      return NextResponse.json(
        { error: "Purchase ownership mismatch." },
        { status: 403 },
      );
    }

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        {
          confirmed: false,
          pending: true,
          error: "Payment is awaiting confirmation.",
        },
        { status: 202 },
      );
    }

    // The webhook is responsible for granting access.
    // This endpoint only reads the resulting status.
    if (purchase.status !== "paid") {
      return NextResponse.json(
        {
          confirmed: false,
          pending: true,
          error: "Payment received. Academy access is being activated.",
        },
        { status: 202 },
      );
    }

    return NextResponse.json({
      confirmed: true,
      purchaseId: purchase.id,
      academyId: purchase.academy_code,
      programmeId: purchase.programme_id,
      studentId: purchase.student_id,
      status: purchase.status,
    });
  } catch (error: unknown) {
    console.error("academy-purchase-confirm error", error);

    return NextResponse.json(
      { error: "Unable to verify Academy purchase." },
      { status: 500 },
    );
  }
}

async function authenticateRequest(req: Request) {
  const authorization = req.headers.get("authorization");

  const accessToken = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : "";

  if (!accessToken) {
    return null;
  }

  const { data, error } =
    await supabaseAdmin.auth.getUser(accessToken);

  if (error || !data.user) {
    return null;
  }

  return data.user;
}
