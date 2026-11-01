import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { updateGoogleLessonEvent } from "@/app/lib/googleMeet";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Missing Supabase server credentials");
const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const UUID = /^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i;
const reply = (error: string, status: number) => NextResponse.json({ ok: false, error }, { status });

/** POST { changeId: uuid } with Authorization: Bearer <admin token>. */
export async function POST(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return reply("Authentication required", 401);
  const { data: { user }, error: authError } = await db.auth.getUser(authorization.slice(7));
  if (authError || !user) return reply("Authentication required", 401);
  const { data: profile, error: profileError } = await db.from("user_profiles")
    .select("role").eq("id", user.id).maybeSingle();
  if (profileError) return reply("Could not verify admin role", 500);
  if (profile?.role !== "ADMIN") return reply("Admin access required", 403);

  let body: { changeId?: string };
  try { body = await request.json(); } catch { return reply("Invalid JSON", 400); }
  if (!body?.changeId || !UUID.test(body.changeId)) return reply("Valid changeId required", 400);

  const { data: claimRows, error: claimError } = await db.rpc("admin_claim_calendar_sync", {
    p_change_id: body.changeId,
  });
  if (claimError) return reply(claimError.message, 409);
  const claim = Array.isArray(claimRows) ? claimRows[0] : claimRows;
  if (claim?.outcome === "SYNCED") return NextResponse.json({ ok: true, calendarSyncStatus: "SYNCED" });
  if (claim?.outcome !== "CLAIMED" || !claim.claim_id) return reply("Could not claim Calendar sync", 409);
  const claimId: string = claim.claim_id;

  try {
    const { data: change, error: changeError } = await db.from("lesson_booking_admin_changes")
      .select("booking_id,new_lesson_date,new_lesson_time,new_timezone,new_tutor_id")
      .eq("id", body.changeId).single();
    if (changeError || !change) throw new Error("Audit entry not found");
    const { data: booking, error: bookingError } = await db.from("lesson_bookings")
      .select("id,parent_id,tutor_id,meeting_link,google_calendar_event_id,lesson_date,lesson_time,timezone,status,payment_status")
      .eq("id", change.booking_id).single();
    if (bookingError || !booking) throw new Error("Booking could not be loaded");
    if (booking.status !== "CONFIRMED" || booking.payment_status !== "PAID") {
      throw new Error("Booking is no longer confirmed and paid");
    }
    if (booking.lesson_date !== change.new_lesson_date ||
        booking.lesson_time !== change.new_lesson_time ||
        booking.timezone !== change.new_timezone ||
        booking.tutor_id !== change.new_tutor_id) {
      throw new Error("Booking no longer matches the audited change; reconciliation required");
    }
    const { data: sessions, error: sessionError } = await db.from("lesson_sessions")
      .select("starts_at,ends_at,tutor_id").eq("booking_id", booking.id);
    if (sessionError || !sessions || sessions.length !== 1) throw new Error("Exactly one session is required");
    const session = sessions[0];
    if (session.tutor_id !== booking.tutor_id) throw new Error("Booking/session tutor mismatch");
    const { data: parent, error: parentError } = await db.from("user_profiles")
      .select("email").eq("id", booking.parent_id).maybeSingle();
    if (parentError || !parent?.email) throw new Error("Parent email missing");
    const { data: tutor, error: tutorError } = await db.from("tutor_profiles")
      .select("user_id").eq("id", booking.tutor_id).maybeSingle();
    if (tutorError || !tutor?.user_id) throw new Error("Tutor profile missing");
    const { data: tutorUser, error: tutorUserError } = await db.from("user_profiles")
      .select("email").eq("id", tutor.user_id).maybeSingle();
    if (tutorUserError || !tutorUser?.email) throw new Error("Tutor email missing");

    const result = await updateGoogleLessonEvent({
      bookingId: booking.id,
      eventId: booking.google_calendar_event_id,
      expectedMeetUrl: booking.meeting_link,
      startIso: session.starts_at,
      endIso: session.ends_at,
      timeZone: booking.timezone,
      attendees: [parent.email, tutorUser.email],
    });
    // Google may already have committed this PATCH if a prior response was lost.
    // Retrying updates the same event, never creates another meeting.
    const { data: saved, error: saveError } = await db.from("lesson_bookings")
      .update({ google_calendar_event_id: result.eventId })
      .eq("id", booking.id).eq("tutor_id", booking.tutor_id)
      .eq("lesson_date", booking.lesson_date).eq("lesson_time", booking.lesson_time)
      .select("id").maybeSingle();
    if (saveError || !saved) throw new Error("Calendar updated but booking event ID could not be saved; reconcile before retry");
    const { data: finished, error: finishError } = await db.rpc("admin_finish_calendar_sync", {
      p_change_id: body.changeId, p_claim_id: claimId, p_success: true, p_error: null,
    });
    if (finishError || finished !== true) throw new Error("Calendar updated but audit completion was not confirmed");
    return NextResponse.json({ ok: true, calendarSyncStatus: "SYNCED", eventId: result.eventId,
      notificationStatus: "PENDING" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Calendar sync failed";
    const { data: finished, error: finishError } = await db.rpc("admin_finish_calendar_sync", {
      p_change_id: body.changeId, p_claim_id: claimId, p_success: false, p_error: message,
    });
    if (finishError || finished !== true) {
      return reply(`Calendar state uncertain and audit finalisation failed: ${message}. Manual reconciliation required.`, 500);
    }
    return NextResponse.json({ ok: false, calendarSyncStatus: "FAILED", error: message }, { status: 502 });
  }
}
