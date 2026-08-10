import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.STRIPE_SECRET_KEY || "";

  return NextResponse.json({
    stripeMode: key.startsWith("sk_live_")
      ? "live"
      : key.startsWith("sk_test_")
        ? "test"
        : "unknown",
    environment: process.env.VERCEL_ENV || "unknown",
  });
}