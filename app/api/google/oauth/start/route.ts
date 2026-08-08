import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
  const clientId =
    process.env.GOOGLE_CLIENT_ID;

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL;

  if (!clientId || !appUrl) {
    return NextResponse.json(
      {
        error:
          "Missing GOOGLE_CLIENT_ID or NEXT_PUBLIC_APP_URL.",
      },
      { status: 500 },
    );
  }

  const redirectUri =
    `${appUrl.replace(/\/$/, "")}` +
    "/api/google/oauth/callback";

  const state =
    crypto.randomBytes(24).toString("hex");

  const params =
    new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",

      scope:
        "https://www.googleapis.com/auth/calendar.events",

      access_type: "offline",

      prompt: "consent",

      include_granted_scopes: "true",

      state,
    });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
  );
}