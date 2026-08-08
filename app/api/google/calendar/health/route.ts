import {
  NextResponse,
} from "next/server";

import {
  verifyGoogleCalendarConnection,
} from "@/app/lib/googleMeet";

export const dynamic =
  "force-dynamic";

export async function GET() {
  try {
    const calendar =
      await verifyGoogleCalendarConnection();

    return NextResponse.json({
      ok: true,
      provider: "google-meet",
      calendar,
    });
  } catch (error) {
    console.error(
      "Google Calendar health check failed:",
      error,
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Google Calendar connection failed.",
      },
      { status: 500 },
    );
  }
}
