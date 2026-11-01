import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  throw new Error("Supabase server configuration is missing");
}
const db = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

type ChangeRequest = {
  bookingId: string;
  tutorId: string;
  mode: "slot" | "manual";
  slotId?: string;
  // Manual: an ISO timestamp with explicit Z or ±HH:MM offset.
  // Example: 2026-11-03T18:00:00-08:00
  startIso?: string;
  endIso?: string;
  localDate?: string; // YYYY-MM-DD in the selected IANA timezone
  localTime?: string; // HH:MM in that timezone
  timezone?: string; // e.g. America/Los_Angeles
  reason: string;
};

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isoWithOffset = /^\d{4}-\d\d-\d\dT\d\d:\d\d(?::\d\d(?:\.\d+)?)?(?:Z|[+-]\d\d:\d\d)$/i;

function localParts(iso: string, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const get = (name: string) => parts.find((part) => part.type === name)?.value;
  return { date: `${get("year")}-${get("month")}-${get("day")}`, time: `${get("hour")}:${get("minute")}` };
}

function errorResponse(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(request: Request) {
  try {
    const auth = request.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) return errorResponse("Authentication required", 401);
    const { data: { user }, error: authError } = await db.auth.getUser(auth.slice(7));
    if (authError || !user) return errorResponse("Authentication required", 401);
    const { data: profile, error: roleError } = await db.from("user_profiles")
      .select("role").eq("id", user.id).maybeSingle();
    if (roleError) return errorResponse("Could not verify admin role", 500);
    if (profile?.role !== "ADMIN") return errorResponse("Admin access required", 403);

    const body = await request.json() as ChangeRequest;
    if (!body || !uuid.test(body.bookingId || "") || !uuid.test(body.tutorId || "")) {
      return errorResponse("Valid booking and tutor IDs are required", 400);
    }
    if (body.mode !== "slot" && body.mode !== "manual") {
      return errorResponse("Scheduling mode must be slot or manual", 400);
    }
    if (typeof body.reason !== "string" || body.reason.trim().length < 5) {
      return errorResponse("Please provide a reason of at least five characters", 400);
    }

    let startIso: string, endIso: string, timezone: string, localDate: string, localTime: string;
    let slotId: string | null = null;
    if (body.mode === "slot") {
      if (!body.slotId || !uuid.test(body.slotId)) return errorResponse("Valid slot ID required", 400);
      const { data: slot, error } = await db.from("tutor_availability_slots")
        .select("id,tutor_id,starts_at,ends_at,timezone,is_available,is_booked")
        .eq("id", body.slotId).maybeSingle();
      if (error) return errorResponse("Could not load slot", 500);
      if (!slot || slot.tutor_id !== body.tutorId) return errorResponse("Slot does not belong to tutor", 400);
      // This is a preflight check only; the SQL transaction re-checks with locks.
      if (!slot.is_available || slot.is_booked) return errorResponse("Slot is unavailable", 409);
      startIso = slot.starts_at;
      endIso = slot.ends_at;
      timezone = body.timezone || slot.timezone;
      slotId = slot.id;
      try {
        const local = localParts(startIso, timezone);
        localDate = local.date;
        localTime = local.time;
      } catch { return errorResponse("Invalid slot timezone", 400); }
    } else {
      if (!body.startIso || !body.endIso || !isoWithOffset.test(body.startIso) ||
          !isoWithOffset.test(body.endIso)) {
        return errorResponse("Manual scheduling requires ISO start/end with an explicit UTC offset", 400);
      }
      if (!body.timezone || !body.localDate || !body.localTime) {
        return errorResponse("Manual scheduling requires timezone, local date and local time", 400);
      }
      startIso = body.startIso;
      endIso = body.endIso;
      timezone = body.timezone;
      localDate = body.localDate;
      localTime = body.localTime;
      try {
        const local = localParts(startIso, timezone);
        if (local.date !== localDate || local.time !== localTime) {
          return errorResponse("Local date/time does not match the supplied UTC offset and timezone", 400);
        }
      } catch { return errorResponse("Invalid timezone or timestamp", 400); }
    }

    const start = new Date(startIso), end = new Date(endIso);
    if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) ||
        end <= start || end.getTime() - start.getTime() > 4 * 3600000) {
      return errorResponse("Invalid lesson duration", 400);
    }

    const { data: changeId, error: changeError } = await db.rpc(
      "admin_change_single_lesson",
      {
        p_admin_id: user.id,
        p_booking_id: body.bookingId,
        p_new_tutor_id: body.tutorId,
        p_new_start: start.toISOString(),
        p_new_end: end.toISOString(),
        p_local_date: localDate,
        p_local_time: localTime,
        p_timezone: timezone,
        p_slot_id: slotId,
        p_reason: body.reason.trim(),
      },
    );
    if (changeError) {
      // Includes tutor conflict, completed lesson, slot no longer available.
      return errorResponse(changeError.message, 409);
    }

    // Deliberately do not claim Calendar or email success.
    // Phase 2 will resolve verified parent/tutor email addresses and invoke
    // updateGoogleLessonEvent, then update audit sync statuses.
    return NextResponse.json({
      ok: true,
      changeId,
      bookingId: body.bookingId,
      lessonStartUtc: start.toISOString(),
      calendarSyncStatus: "PENDING",
      notificationStatus: "PENDING",
      message: "Database schedule changed. Calendar and notifications still require synchronisation.",
    });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Unexpected error", 500);
  }
}
