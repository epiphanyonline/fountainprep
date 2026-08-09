import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import {
  createGoogleMeetEvent,
  isGoogleMeetUrl,
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

const TARGET_BOOKING_IDS = [
  "78227189-3cbf-4320-bc2e-49dc065edd16",
  "26189b19-3693-4968-ae12-44dbc08e2cbc",
  "5f552e1b-2c5e-4851-b771-faf4cf725adc",
  "c5e2bc88-4240-49a1-8e10-93fb805ca597",
];

type BookingRow = {
  id: string;
  lesson_date: string | null;
  lesson_time: string | null;
  timezone: string | null;
  status: string;
  payment_status: string;
  meeting_link: string | null;
};

type SessionRow = {
  id: string;
  booking_id: string;
  starts_at: string;
  ends_at: string | null;
  meeting_link: string | null;
};

export async function POST(
  req: Request,
) {
  /*
   * Temporary security check.
   * Do not leave this route publicly callable.
   */
  const suppliedSecret =
    req.headers.get(
      "x-backfill-secret",
    );

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

  const {
    data: bookings,
    error: bookingError,
  } = await supabaseAdmin
    .from("lesson_bookings")
    .select(
      `
        id,
        lesson_date,
        lesson_time,
        timezone,
        status,
        payment_status,
        meeting_link
      `,
    )
    .in(
      "id",
      TARGET_BOOKING_IDS,
    )
    .eq(
      "payment_status",
      "PAID",
    );

  if (bookingError) {
    return NextResponse.json(
      {
        ok: false,
        error:
          bookingError.message,
      },
      {
        status: 500,
      },
    );
  }

  const results: Array<{
    bookingId: string;
    status:
      | "migrated"
      | "skipped"
      | "failed";
    meetUrl?: string;
    error?: string;
  }> = [];

  for (
    const booking of
      (bookings ?? []) as BookingRow[]
  ) {
    try {
      /*
       * Already repaired?
       */
      if (
        isGoogleMeetUrl(
          booking.meeting_link,
        )
      ) {
        results.push({
          bookingId: booking.id,
          status: "skipped",
          meetUrl:
            booking.meeting_link ??
            undefined,
        });

        continue;
      }

      /*
       * Use lesson_sessions for the
       * authoritative ISO timestamps.
       *
       * This avoids us having to manually
       * convert lesson_date + lesson_time
       * across timezones.
       */
      const {
        data: session,
        error: sessionError,
      } = await supabaseAdmin
        .from("lesson_sessions")
        .select(
          `
            id,
            booking_id,
            starts_at,
            ends_at,
            meeting_link
          `,
        )
        .eq(
          "booking_id",
          booking.id,
        )
        .order(
          "starts_at",
          {
            ascending: true,
          },
        )
        .limit(1)
        .maybeSingle();

      if (sessionError) {
        throw sessionError;
      }

      const lessonSession =
        session as SessionRow | null;

      if (
        !lessonSession?.starts_at
      ) {
        throw new Error(
          `Booking ${booking.id} has no lesson_sessions start time.`,
        );
      }

      /*
       * Use existing session end time.
       *
       * If for any reason it is missing,
       * default to the same 70-minute
       * duration currently used in your
       * Stripe webhook.
       */
      const startIso =
        lessonSession.starts_at;

      const endIso =
        lessonSession.ends_at ||
        new Date(
          new Date(
            startIso,
          ).getTime() +
            70 *
              60 *
              1000,
        ).toISOString();

      /*
       * IMPORTANT:
       *
       * Use the SAME request key as
       * the Stripe webhook:
       *
       * lesson-${booking.id}
       */
      const created =
        await createGoogleMeetEvent(
          {
            summary:
              "Fountain Prep private lesson",

            description:
              "Fountain Prep private one-to-one lesson.",

            startIso,

            endIso,

            timeZone:
              booking.timezone ||
              "Europe/London",

            /*
             * We are repairing the
             * meeting link here.
             *
             * FountainPrep's booking
             * confirmation email will
             * be diagnosed separately.
             */
            attendees: [],

            requestKey:
              `lesson-${booking.id}`,
          },
        );

      if (
        !created.meetUrl
      ) {
        throw new Error(
          "Google Calendar created an event but returned no Meet URL.",
        );
      }

      /*
       * Update the booking.
       */
      const {
        error:
          bookingUpdateError,
      } = await supabaseAdmin
        .from(
          "lesson_bookings",
        )
        .update({
          meeting_link:
            created.meetUrl,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          booking.id,
        );

      if (
        bookingUpdateError
      ) {
        throw bookingUpdateError;
      }

      /*
       * Update lesson_sessions too.
       *
       * This is important because your
       * classroom/session UI may read
       * from this table rather than
       * directly from lesson_bookings.
       */
      const {
        error:
          sessionUpdateError,
      } = await supabaseAdmin
        .from(
          "lesson_sessions",
        )
        .update({
          meeting_link:
            created.meetUrl,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "booking_id",
          booking.id,
        );

      if (
        sessionUpdateError
      ) {
        throw sessionUpdateError;
      }

      results.push({
        bookingId:
          booking.id,

        status: "migrated",

        meetUrl:
          created.meetUrl,
      });
    } catch (error) {
      results.push({
        bookingId:
          booking.id,

        status: "failed",

        error:
          error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }

  const migrated =
    results.filter(
      (item) =>
        item.status ===
        "migrated",
    ).length;

  const skipped =
    results.filter(
      (item) =>
        item.status ===
        "skipped",
    ).length;

  const failed =
    results.filter(
      (item) =>
        item.status ===
        "failed",
    ).length;

  return NextResponse.json({
    ok: failed === 0,

    found:
      bookings?.length ?? 0,

    migrated,

    skipped,

    failed,

    results,
  });
}