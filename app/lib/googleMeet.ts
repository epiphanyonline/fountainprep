import { createHash } from "node:crypto";

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
  extendedProperties?: { private?: Record<string, string> };
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
  `Google OAuth token refresh failed (HTTP ${response.status}): ${
    payload.error_description ||
    payload.error ||
    "Unknown OAuth error"
  }`,
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
  `Google Calendar access failed (HTTP ${response.status}): ${
    data?.error?.message ||
    "Unknown Calendar API error"
  }`,
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

type CalendarEventResponse = GoogleCalendarEvent & {
  status?: string;
  error?: { message?: string };
};

async function getExistingEvent(
  accessToken: string,
  calendarId: string,
  requestKey: string,
  deterministicId: string,
): Promise<CalendarEventResponse | null> {
  // Search old events created before deterministic IDs were introduced.
  let pageToken: string | undefined;
  do {
    const params = new URLSearchParams({
      privateExtendedProperty: `fountainprep_request_key=${requestKey}`,
      maxResults: "250",
      showDeleted: "false",
    });
    if (pageToken) params.set("pageToken", pageToken);
    const response = await fetch(
      `${calendarApiBase}/calendars/${calendarId}/events?${params}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      },
    );
    const payload = (await response.json()) as {
      items?: CalendarEventResponse[];
      nextPageToken?: string;
      error?: { message?: string };
    };
    if (!response.ok) {
      throw new Error(
        `Google Calendar event lookup failed (HTTP ${response.status}): ${payload.error?.message || "Unknown error"}`,
      );
    }
    const found = payload.items?.find((item) => item.status !== "cancelled");
    if (found) return found;
    pageToken = payload.nextPageToken;
  } while (pageToken);

  // Also handle events created with our new stable event ID.
  const response = await fetch(
    `${calendarApiBase}/calendars/${calendarId}/events/${encodeURIComponent(deterministicId)}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    },
  );
  if (response.status === 404) return null;
  const payload = (await response.json()) as CalendarEventResponse;
  if (!response.ok) {
    throw new Error(
      `Google Calendar event lookup failed (HTTP ${response.status}): ${payload.error?.message || "Unknown error"}`,
    );
  }
  return payload.status === "cancelled" ? null : payload;
}

export async function createGoogleMeetEvent(
  input: CreateGoogleMeetEventInput,
) {
  if (!input.requestKey.trim()) {
    throw new Error("A stable Google Meet requestKey is required.");
  }
  const accessToken = await getGoogleAccessToken();
  const calendarId = encodeURIComponent(
    process.env.GOOGLE_CALENDAR_ID || "primary",
  );
  const attendeeEmails = Array.from(
    new Set((input.attendees || []).map((email) => email.trim().toLowerCase()).filter(Boolean)),
  );
  const requestId = normaliseRequestId(input.requestKey);
  // Hex is a valid subset of Google Calendar's base32hex event-ID alphabet.
  const deterministicId = `fp${createHash("sha256").update(input.requestKey).digest("hex")}`;

  let event = await getExistingEvent(
    accessToken,
    calendarId,
    input.requestKey,
    deterministicId,
  );

  if (!event) {
    const response = await fetch(
      `${calendarApiBase}/calendars/${calendarId}/events?conferenceDataVersion=1&sendUpdates=all`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: deterministicId,
          summary: input.summary,
          description: input.description || "Fountain Prep online session.",
          start: { dateTime: input.startIso, timeZone: input.timeZone || "Europe/London" },
          end: { dateTime: input.endIso, timeZone: input.timeZone || "Europe/London" },
          attendees: attendeeEmails.map((email) => ({ email })),
          conferenceData: {
            createRequest: {
              requestId,
              conferenceSolutionKey: { type: "hangoutsMeet" },
            },
          },
          extendedProperties: {
            private: { fountainprep_request_key: input.requestKey },
          },
        }),
        cache: "no-store",
      },
    );
    const payload = (await response.json()) as CalendarEventResponse;
    if (response.status === 409) {
      // Another retry may have created the same event concurrently.
      event = await getExistingEvent(
        accessToken, calendarId, input.requestKey, deterministicId,
      );
      if (!event) throw new Error("Google Calendar reported an existing event, but it could not be retrieved.");
    } else if (!response.ok) {
      throw new Error(
        `Google Calendar event creation failed (HTTP ${response.status}): ${payload.error?.message || "Unknown error"}`,
      );
    } else {
      event = payload;
    }
  }

  const meetUrl = extractMeetUrl(event) || (
    event.id ? await pollEventForMeetLink(event.id, accessToken, calendarId) : null
  );
  if (!meetUrl) {
    throw new Error(
      `Calendar event ${event.id || "(no ID)"} exists, but its Google Meet link is not ready. Retry will reuse this event.`,
    );
  }

  // Keep this mandatory: we cannot claim that learners can join without
  // the organiser until Google confirms the required meeting settings.
  // Retrying will reuse the event instead of creating a duplicate.
  try {
    await configureGoogleMeetSpace(meetUrl, accessToken);
  } catch (error) {
    throw new Error(
      `Google Meet event ${event.id || "(no ID)"} exists, but meeting access configuration failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  return {
    eventId: event.id || null,
    eventUrl: event.htmlLink || null,
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

/**
 * Update an existing Fountain Prep lesson event without creating another Meet.
 * Server-side only. The caller must enforce admin authorisation and coordinate
 * the booking/session database transaction and notification retry handling.
 */
export type UpdateGoogleLessonEventInput = {
  bookingId: string;
  startIso: string;
  endIso: string;
  timeZone: string;
  attendees: string[];
  eventId?: string | null;
  expectedMeetUrl?: string | null;
  summary?: string;
  description?: string;
};

export async function updateGoogleLessonEvent(
  input: UpdateGoogleLessonEventInput,
) {
  const bookingId = input.bookingId.trim();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(bookingId)) {
    throw new Error("A valid lesson booking ID is required.");
  }

  const start = new Date(input.startIso);
  const end = new Date(input.endIso);
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start) {
    throw new Error("A valid lesson start and later end are required.");
  }
  try {
    new Intl.DateTimeFormat("en-GB", { timeZone: input.timeZone });
  } catch {
    throw new Error("Invalid IANA lesson timezone.");
  }

  const requestKey = `lesson-${bookingId}`;
  const deterministicId = `fp${createHash("sha256").update(requestKey).digest("hex")}`;
  const token = await getGoogleAccessToken();
  const calendarId = encodeURIComponent(process.env.GOOGLE_CALENDAR_ID || "primary");

  let event: CalendarEventResponse | null = null;
  if (input.eventId?.trim()) {
    const response = await fetch(
      `${calendarApiBase}/calendars/${calendarId}/events/${encodeURIComponent(input.eventId.trim())}`,
      { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
    );
    if (response.status !== 404) {
      const payload = (await response.json()) as CalendarEventResponse;
      if (!response.ok) {
        throw new Error(`Google Calendar event lookup failed (HTTP ${response.status}): ${payload.error?.message || "Unknown error"}`);
      }
      if (payload.status !== "cancelled") event = payload;
    }
  }
  if (!event) {
    event = await getExistingEvent(token, calendarId, requestKey, deterministicId);
  }
  if (!event?.id) {
    throw new Error("Original Google Calendar lesson event was not found. No new event was created.");
  }

  // A stored event ID alone is not sufficient proof that it belongs to this booking.
  const savedKey = event.extendedProperties?.private?.fountainprep_request_key;
  const sameStableId = event.id === deterministicId;
  const sameKey = savedKey === requestKey;
  const sameMeet = Boolean(
    input.expectedMeetUrl && extractMeetUrl(event) === input.expectedMeetUrl,
  );
  if (savedKey && !sameKey) {
    throw new Error("Calendar event belongs to a different Fountain Prep booking.");
  }
  if (!sameStableId && !sameKey && !sameMeet) {
    throw new Error("Cannot verify that the Calendar event belongs to this booking.");
  }
  const originalMeet = extractMeetUrl(event);
  if (input.expectedMeetUrl && originalMeet !== input.expectedMeetUrl) {
    throw new Error("The existing Google Meet link does not match the Calendar event. Manual reconciliation required.");
  }
  if (!originalMeet) {
    throw new Error("Original Calendar event has no Google Meet link. Manual reconciliation required.");
  }

  const attendees = Array.from(new Set(
    input.attendees.map((email) => email.trim().toLowerCase()).filter(Boolean),
  ));
  if (attendees.some((email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    throw new Error("Invalid attendee email address.");
  }

  // PATCH only selected fields; do not replace conferenceData or createRequest.
  const changes: Record<string, unknown> = {
    start: { dateTime: start.toISOString(), timeZone: input.timeZone },
    end: { dateTime: end.toISOString(), timeZone: input.timeZone },
    attendees: attendees.map((email) => ({ email })),
  };
  if (input.summary !== undefined) changes.summary = input.summary;
  if (input.description !== undefined) changes.description = input.description;

  const response = await fetch(
    `${calendarApiBase}/calendars/${calendarId}/events/${encodeURIComponent(event.id)}?conferenceDataVersion=1&sendUpdates=all`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(changes),
      cache: "no-store",
    },
  );
  const updated = (await response.json()) as CalendarEventResponse;
  if (!response.ok) {
    throw new Error(`Google Calendar event update failed (HTTP ${response.status}): ${updated.error?.message || "Unknown error"}`);
  }
  const updatedMeet = extractMeetUrl(updated);
  if (updatedMeet !== originalMeet) {
    throw new Error("Calendar event updated, but the original Meet link could not be verified. Reconciliation required.");
  }
  return {
    eventId: updated.id || event.id,
    eventUrl: updated.htmlLink || event.htmlLink || null,
    meetUrl: originalMeet,
    startIso: start.toISOString(),
    endIso: end.toISOString(),
  };
}
