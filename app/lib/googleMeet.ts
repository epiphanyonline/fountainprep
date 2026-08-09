type GoogleTokenResponse = {
  access_token?: string;
  expires_in?: number;
  token_type?: string;
  scope?: string;
  error?: string;
  error_description?: string;
};

type CalendarEntryPoint = {
  entryPointType?: string;
  uri?: string;
  label?: string;
};

type GoogleCalendarEvent = {
  id?: string;
  htmlLink?: string;
  hangoutLink?: string;
  conferenceData?: {
    createRequest?: {
      requestId?: string;
      status?: {
        statusCode?: string;
      };
    };
    entryPoints?: CalendarEntryPoint[];
  };
};

type GoogleMeetSpace = {
  name?: string;
  meetingUri?: string;
  meetingCode?: string;
  config?: {
    accessType?: string;
    moderation?: string;
  };
  error?: {
    message?: string;
  };
};

export type CreateGoogleMeetEventInput = {
  summary: string;
  description?: string;
  startIso: string;
  endIso: string;
  timeZone?: string;
  attendees?: string[];
  requestKey: string;
};

const tokenEndpoint =
  "https://oauth2.googleapis.com/token";

const calendarApiBase =
  "https://www.googleapis.com/calendar/v3";

const meetApiBase =
  "https://meet.googleapis.com/v2";

export function isGoogleMeetUrl(
  value?: string | null,
) {
  return Boolean(
    value?.startsWith(
      "https://meet.google.com/",
    ),
  );
}

export async function getGoogleAccessToken() {
  const clientId =
    process.env.GOOGLE_CLIENT_ID;

  const clientSecret =
    process.env.GOOGLE_CLIENT_SECRET;

  const refreshToken =
    process.env.GOOGLE_REFRESH_TOKEN;

  if (
    !clientId ||
    !clientSecret ||
    !refreshToken
  ) {
    throw new Error(
      "Google Meet is not configured. Missing GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or GOOGLE_REFRESH_TOKEN.",
    );
  }

  const response = await fetch(
    tokenEndpoint,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },

      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),

      cache: "no-store",
    },
  );

  const payload =
    (await response.json()) as
      GoogleTokenResponse;

  if (
    !response.ok ||
    !payload.access_token
  ) {
    throw new Error(
      payload.error_description ||
        payload.error ||
        `Google OAuth token refresh failed with status ${response.status}.`,
    );
  }

  return payload.access_token;
}

export async function verifyGoogleCalendarConnection() {
  const accessToken =
    await getGoogleAccessToken();

  const calendarId =
    encodeURIComponent(
      process.env.GOOGLE_CALENDAR_ID ||
        "primary",
    );

  const response = await fetch(
    `${calendarApiBase}/calendars/${calendarId}/events?maxResults=1&singleEvents=true`,
    {
      headers: {
        Authorization:
          `Bearer ${accessToken}`,
      },

      cache: "no-store",
    },
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message ||
        "Google Calendar connection check failed.",
    );
  }

  return {
    id:
      process.env.GOOGLE_CALENDAR_ID ||
      "primary",

    summary:
      "Google Calendar connected",

    timeZone:
      data.timeZone || null,
  };
}

export async function createGoogleMeetEvent(
  input: CreateGoogleMeetEventInput,
) {
  const accessToken =
    await getGoogleAccessToken();

  const calendarId =
    encodeURIComponent(
      process.env.GOOGLE_CALENDAR_ID ||
        "primary",
    );

  const attendeeEmails =
    Array.from(
      new Set(
        (input.attendees || [])
          .map((email) =>
            email
              .trim()
              .toLowerCase(),
          )
          .filter(Boolean),
      ),
    );

  const requestId =
    normaliseRequestId(
      input.requestKey,
    );

  const response = await fetch(
    `${calendarApiBase}/calendars/${calendarId}/events?conferenceDataVersion=1&sendUpdates=all`,
    {
      method: "POST",

      headers: {
        Authorization:
          `Bearer ${accessToken}`,

        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        summary:
          input.summary,

        description:
          input.description ||
          "Fountain Prep online session.",

        start: {
          dateTime:
            input.startIso,

          timeZone:
            input.timeZone ||
            "Europe/London",
        },

        end: {
          dateTime:
            input.endIso,

          timeZone:
            input.timeZone ||
            "Europe/London",
        },

        attendees:
          attendeeEmails.map(
            (email) => ({
              email,
            }),
          ),

        conferenceData: {
          createRequest: {
            requestId,

            conferenceSolutionKey: {
              type:
                "hangoutsMeet",
            },
          },
        },

        extendedProperties: {
          private: {
            fountainprep_request_key:
              input.requestKey,
          },
        },
      }),

      cache: "no-store",
    },
  );

  const event =
    (await response.json()) as
      GoogleCalendarEvent & {
        error?: {
          message?: string;
        };
      };

  if (!response.ok) {
    throw new Error(
      event.error?.message ||
        `Google Calendar event creation failed with status ${response.status}.`,
    );
  }

  const meetUrl =
    extractMeetUrl(event);

  /*
   * Google Calendar normally returns
   * the conference immediately.
   *
   * If it doesn't, briefly poll the
   * event until the Meet URL appears.
   */
  if (!meetUrl) {
    if (event.id) {
      const polled =
        await pollEventForMeetLink(
          event.id,
          accessToken,
          calendarId,
        );

      if (polled) {
        /*
         * Configure the Meet so the
         * tutor and learner can enter
         * without the FountainPrep
         * organizer joining first.
         */
        await configureGoogleMeetSpace(
          polled,
          accessToken,
        );

        return {
          eventId:
            event.id,

          eventUrl:
            event.htmlLink ||
            null,

          meetUrl:
            polled,
        };
      }
    }

    throw new Error(
      "Google created the calendar event but did not return a Google Meet link.",
    );
  }

  /*
   * Configure the meeting space before
   * returning the URL to FountainPrep.
   */
  await configureGoogleMeetSpace(
    meetUrl,
    accessToken,
  );

  return {
    eventId:
      event.id || null,

    eventUrl:
      event.htmlLink || null,

    meetUrl,
  };
}

export async function configureGoogleMeetSpace(
  meetUrl: string,
  accessToken: string,
) {
  const meetingCode =
    extractMeetingCode(
      meetUrl,
    );

  if (!meetingCode) {
    throw new Error(
      "Could not determine Google Meet meeting code.",
    );
  }

  /*
   * Google permits spaces.get using
   * either the resource ID or meeting
   * code.
   */
  const getResponse =
    await fetch(
      `${meetApiBase}/spaces/${encodeURIComponent(
        meetingCode,
      )}`,
      {
        headers: {
          Authorization:
            `Bearer ${accessToken}`,
        },

        cache:
          "no-store",
      },
    );

  const space =
    (await getResponse.json()) as
      GoogleMeetSpace;

  if (!getResponse.ok) {
    throw new Error(
      space.error?.message ||
        `Unable to load Google Meet space. Status ${getResponse.status}.`,
    );
  }

  if (!space.name) {
    throw new Error(
      "Google Meet space returned without a resource name.",
    );
  }

  /*
   * OPEN:
   * Anyone with the meeting join
   * information can enter without
   * knocking.
   *
   * moderation OFF:
   * Host-management moderation is not
   * required for ordinary entry.
   */
  const updateMask =
    encodeURIComponent(
      "config.accessType,config.moderation",
    );

  const patchResponse =
    await fetch(
      `${meetApiBase}/${space.name}?updateMask=${updateMask}`,
      {
        method: "PATCH",

        headers: {
          Authorization:
            `Bearer ${accessToken}`,

          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            name:
              space.name,

            config: {
              accessType:
                "OPEN",

              moderation:
                "OFF",
            },
          }),

        cache:
          "no-store",
      },
    );

  const updatedSpace =
    (await patchResponse.json()) as
      GoogleMeetSpace;

  if (!patchResponse.ok) {
    throw new Error(
      updatedSpace.error?.message ||
        `Unable to configure Google Meet space. Status ${patchResponse.status}.`,
    );
  }

  return updatedSpace;
}

async function pollEventForMeetLink(
  eventId: string,
  accessToken: string,
  encodedCalendarId: string,
) {
  for (
    let attempt = 0;
    attempt < 5;
    attempt += 1
  ) {
    await delay(
      450 *
        (attempt + 1),
    );

    const response =
      await fetch(
        `${calendarApiBase}/calendars/${encodedCalendarId}/events/${encodeURIComponent(
          eventId,
        )}?conferenceDataVersion=1`,
        {
          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },

          cache:
            "no-store",
        },
      );

    if (!response.ok) {
      continue;
    }

    const event =
      (await response.json()) as
        GoogleCalendarEvent;

    const meetUrl =
      extractMeetUrl(
        event,
      );

    if (meetUrl) {
      return meetUrl;
    }
  }

  return null;
}

function extractMeetUrl(
  event: GoogleCalendarEvent,
) {
  if (
    event.hangoutLink?.startsWith(
      "https://meet.google.com/",
    )
  ) {
    return event.hangoutLink;
  }

  const videoEntry =
    event.conferenceData
      ?.entryPoints?.find(
        (entry) =>
          entry.entryPointType ===
            "video" &&
          entry.uri?.startsWith(
            "https://meet.google.com/",
          ),
      );

  return (
    videoEntry?.uri ||
    null
  );
}

function extractMeetingCode(
  meetUrl: string,
) {
  try {
    const url =
      new URL(meetUrl);

    if (
      url.hostname !==
      "meet.google.com"
    ) {
      return null;
    }

    return (
      url.pathname
        .replace(/^\/+/, "")
        .split("/")[0]
        ?.trim() || null
    );
  } catch {
    return null;
  }
}

function normaliseRequestId(
  value: string,
) {
  const safe =
    value
      .toLowerCase()
      .replace(
        /[^a-z0-9_-]/g,
        "-",
      )
      .replace(
        /-+/g,
        "-",
      )
      .slice(
        0,
        100,
      );

  return (
    safe ||
    `fountainprep-${Date.now()}`
  );
}

function delay(
  ms: number,
) {
  return new Promise(
    (resolve) =>
      setTimeout(
        resolve,
        ms,
      ),
  );
}