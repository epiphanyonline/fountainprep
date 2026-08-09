import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  configureGoogleMeetSpace,
  isGoogleMeetUrl,
  getGoogleAccessToken,
} from "@/app/lib/googleMeet";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

const backfillSecret =
  process.env.GOOGLE_MEET_BACKFILL_SECRET;

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

export async function POST(req: Request) {
  const suppliedSecret =
    req.headers.get("x-backfill-secret");

  if (
    !backfillSecret ||
    suppliedSecret !== backfillSecret
  ) {
    return NextResponse.json(
      {
        ok: false,
        error: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  const { data: bookings, error } =
    await supabaseAdmin
      .from("lesson_bookings")
      .select(
        "id, lesson_date, lesson_time, meeting_link",
      )
      .eq("status", "CONFIRMED")
      .eq("payment_status", "PAID")
      .gte(
        "lesson_date",
        new Date()
          .toISOString()
          .slice(0, 10),
      )
      .like(
        "meeting_link",
        "https://meet.google.com/%",
      )
      .order("lesson_date", {
        ascending: true,
      });

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }

  const accessToken =
    await getGoogleAccessToken();

  const results: Array<{
    bookingId: string;
    status: "updated" | "skipped" | "failed";
    meetingLink?: string;
    error?: string;
  }> = [];

  for (const booking of bookings ?? []) {
    try {
      if (
        !isGoogleMeetUrl(
          booking.meeting_link,
        )
      ) {
        results.push({
          bookingId: booking.id,
          status: "skipped",
        });

        continue;
      }

      await configureGoogleMeetSpace(
        booking.meeting_link,
        accessToken,
      );

      results.push({
        bookingId: booking.id,
        status: "updated",
        meetingLink:
          booking.meeting_link,
      });
    } catch (err) {
      results.push({
        bookingId: booking.id,
        status: "failed",
        error:
          err instanceof Error
            ? err.message
            : String(err),
      });
    }
  }

  return NextResponse.json({
    ok:
      results.every(
        (item) =>
          item.status !== "failed",
      ),
    found:
      bookings?.length ?? 0,
    updated:
      results.filter(
        (item) =>
          item.status === "updated",
      ).length,
    skipped:
      results.filter(
        (item) =>
          item.status === "skipped",
      ).length,
    failed:
      results.filter(
        (item) =>
          item.status === "failed",
      ).length,
    results,
  });
}