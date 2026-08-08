import { NextRequest, NextResponse } from "next/server";

type GoogleTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
  error?: string;
  error_description?: string;
};

export async function GET(
  request: NextRequest,
) {
  const code =
    request.nextUrl.searchParams.get(
      "code",
    );

  const oauthError =
    request.nextUrl.searchParams.get(
      "error",
    );

  if (oauthError) {
    return NextResponse.json(
      {
        error: oauthError,
      },
      { status: 400 },
    );
  }

  if (!code) {
    return NextResponse.json(
      {
        error:
          "Google did not return an authorization code.",
      },
      { status: 400 },
    );
  }

  const clientId =
    process.env.GOOGLE_CLIENT_ID;

  const clientSecret =
    process.env.GOOGLE_CLIENT_SECRET;

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL;

  if (
    !clientId ||
    !clientSecret ||
    !appUrl
  ) {
    return NextResponse.json(
      {
        error:
          "Missing Google OAuth environment variables.",
      },
      { status: 500 },
    );
  }

  const redirectUri =
    `${appUrl.replace(/\/$/, "")}` +
    "/api/google/oauth/callback";

  const tokenResponse =
    await fetch(
      "https://oauth2.googleapis.com/token",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },

        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret:
            clientSecret,
          redirect_uri:
            redirectUri,
          grant_type:
            "authorization_code",
        }),
      },
    );

  const tokens =
    (await tokenResponse.json()) as GoogleTokenResponse;

  if (!tokenResponse.ok) {
    return NextResponse.json(
      {
        error:
          tokens.error ??
          "Unable to exchange Google authorization code.",
        description:
          tokens.error_description ??
          null,
      },
      { status: 400 },
    );
  }

  if (!tokens.refresh_token) {
    return NextResponse.json(
      {
        error:
          "Google did not return a refresh token.",
        guidance:
          "Remove FountainPrep from your Google Account connected apps, then repeat authorization so Google can grant offline access again.",
      },
      { status: 400 },
    );
  }

  return new NextResponse(
    `
      <!doctype html>
      <html>
        <body
          style="
            font-family:Arial,sans-serif;
            max-width:760px;
            margin:60px auto;
            padding:24px;
          "
        >
          <h1>
            Google Calendar authorised
          </h1>

          <p>
            Copy the refresh token below into
            <code>.env.local</code>.
          </p>

          <textarea
            style="
              width:100%;
              min-height:160px;
              padding:14px;
            "
            readonly
          >${escapeHtml(
            tokens.refresh_token,
          )}</textarea>

          <p>
            Add:
          </p>

          <pre>GOOGLE_REFRESH_TOKEN=PASTE_TOKEN_HERE
GOOGLE_CALENDAR_ID=primary</pre>

          <p>
            Then remove these temporary OAuth routes.
          </p>
        </body>
      </html>
    `,
    {
      headers: {
        "Content-Type":
          "text/html; charset=utf-8",
      },
    },
  );
}

function escapeHtml(
  value: string,
) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}