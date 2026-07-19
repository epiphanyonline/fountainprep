import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { stripe } from "../../../lib/stripe";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
if (!serviceRoleKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

type BookingRow = {
  id: string;
  parent_id: string | null;
  student_id: string;
  subject_id: string;
  program_id: string | null;
  plan_id: string;
  tutor_id: string | null;
  lesson_date: string | null;
  lesson_time: string | null;
  timezone: string | null;
  status: string;
  payment_status: string;
  amount_gbp: number | null;
  availability_slot_id: string | null;
  parent_booking_group_id: string | null;
  meeting_link: string | null;
};

type PaymentRow = {
  id: string;
  booking_id: string;
  provider_reference: string | null;
  currency: string;
  amount: number;
  payment_status: string;
};

type AvailabilitySlotRow = {
  id: string;
  starts_at: string;
  ends_at: string;
};

type EmailRecipientType = "parent" | "tutor" | "admin";

type DeliveryRow = {
  id: string;
  status: string;
  attempt_count: number;
};

type BookingParty = {
  parentName: string;
  parentEmail: string | null;
  parentTimezone: string;
  tutorName: string;
  tutorEmail: string | null;
  tutorTimezone: string;
  studentName: string;
  subjectName: string;
};

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return new NextResponse("Missing webhook secret", { status: 500 });
  }

  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing Stripe signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown signature error";
    console.error("Stripe webhook signature verification failed:", message);
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Some delayed payment methods complete Checkout before funds are paid.
        // Stripe later sends checkout.session.async_payment_succeeded.
        if (session.payment_status === "paid") {
          await confirmPaidBookingGroup(session);
        }
        break;
      }

      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        await confirmPaidBookingGroup(session);
        break;
      }

      case "checkout.session.expired":
      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await failUnpaidBookingGroup(session);
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error("Stripe webhook processing error:", error);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }
}

async function confirmPaidBookingGroup(session: Stripe.Checkout.Session) {
  const bookingId = session.metadata?.booking_id;

  if (!bookingId) {
    throw new Error(
      `Stripe session ${session.id} is missing booking_id metadata.`,
    );
  }

  const payment = await getPayment(bookingId);

  if (!payment) {
    throw new Error(`Payment record was not found for booking ${bookingId}.`);
  }

  validatePaidSession(session, payment);

  const anchorBooking = await getBooking(bookingId);
  const groupBookings = await getBookingGroup(anchorBooking);

  if (groupBookings.length === 0) {
    throw new Error(`No bookings were found for booking group ${bookingId}.`);
  }

  validateBookingGroup(groupBookings);

  const bookingIds = groupBookings.map((booking) => booking.id);
  const availabilitySlotIds = Array.from(
    new Set(
      groupBookings
        .map((booking) => booking.availability_slot_id)
        .filter((value): value is string => Boolean(value)),
    ),
  );

  const { error: paymentUpdateError } = await supabaseAdmin
    .from("payments")
    .update({
      payment_status: "paid",
      paid_at: new Date().toISOString(),
      provider_reference: session.id,
      provider_payment_intent:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", payment.id);

  if (paymentUpdateError) throw paymentUpdateError;

  const { error: bookingUpdateError } = await supabaseAdmin
    .from("lesson_bookings")
    .update({
      status: "CONFIRMED",
      payment_status: "PAID",
      stripe_session_id: session.id,
      updated_at: new Date().toISOString(),
    })
    .in("id", bookingIds);

  if (bookingUpdateError) throw bookingUpdateError;

  if (availabilitySlotIds.length > 0) {
    const { error: slotUpdateError } = await supabaseAdmin
      .from("tutor_availability_slots")
      .update({
        is_available: false,
        is_booked: true,
        updated_at: new Date().toISOString(),
      })
      .in("id", availabilitySlotIds);

    if (slotUpdateError) throw slotUpdateError;
  }

  await ensureLessonSessions(groupBookings);
  await ensureLessonReminders(groupBookings);
  await sendBookingConfirmationEmails(session, payment, groupBookings);
}

async function failUnpaidBookingGroup(session: Stripe.Checkout.Session) {
  const bookingId = session.metadata?.booking_id;
  if (!bookingId) return;

  const payment = await getPayment(bookingId);

  // Ignore an expired older Checkout session after a newer session was created,
  // and never undo a payment that Stripe has already confirmed.
  if (!payment || payment.payment_status === "paid") return;
  if (payment.provider_reference && payment.provider_reference !== session.id)
    return;

  const anchorBooking = await getBooking(bookingId);
  const groupBookings = await getBookingGroup(anchorBooking);
  const bookingIds = groupBookings.map((booking) => booking.id);
  const availabilitySlotIds = Array.from(
    new Set(
      groupBookings
        .map((booking) => booking.availability_slot_id)
        .filter((value): value is string => Boolean(value)),
    ),
  );

  const { error: paymentUpdateError } = await supabaseAdmin
    .from("payments")
    .update({
      payment_status: "failed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", payment.id)
    .neq("payment_status", "paid");

  if (paymentUpdateError) throw paymentUpdateError;

  if (bookingIds.length > 0) {
    const { error: bookingUpdateError } = await supabaseAdmin
      .from("lesson_bookings")
      .update({
        status: "PAYMENT_FAILED",
        payment_status: "FAILED",
        updated_at: new Date().toISOString(),
      })
      .in("id", bookingIds)
      .neq("payment_status", "PAID");

    if (bookingUpdateError) throw bookingUpdateError;
  }

  if (availabilitySlotIds.length > 0) {
    const { error: slotUpdateError } = await supabaseAdmin
      .from("tutor_availability_slots")
      .update({
        is_available: true,
        is_booked: false,
        updated_at: new Date().toISOString(),
      })
      .in("id", availabilitySlotIds);

    if (slotUpdateError) throw slotUpdateError;
  }
}

async function getPayment(bookingId: string): Promise<PaymentRow | null> {
  const { data, error } = await supabaseAdmin
    .from("payments")
    .select(
      "id, booking_id, provider_reference, currency, amount, payment_status",
    )
    .eq("booking_id", bookingId)
    .maybeSingle();

  if (error) throw error;
  return (data ?? null) as PaymentRow | null;
}

async function getBooking(bookingId: string): Promise<BookingRow> {
  const { data, error } = await supabaseAdmin
    .from("lesson_bookings")
    .select(
      "id, parent_id, student_id, subject_id, program_id, plan_id, tutor_id, lesson_date, lesson_time, timezone, status, payment_status, amount_gbp, availability_slot_id, parent_booking_group_id, meeting_link",
    )
    .eq("id", bookingId)
    .maybeSingle();

  if (error || !data) {
    throw error || new Error(`Booking ${bookingId} was not found.`);
  }

  return data as BookingRow;
}

async function getBookingGroup(anchor: BookingRow): Promise<BookingRow[]> {
  let query = supabaseAdmin
    .from("lesson_bookings")
    .select(
      "id, parent_id, student_id, subject_id, program_id, plan_id, tutor_id, lesson_date, lesson_time, timezone, status, payment_status, amount_gbp, availability_slot_id, parent_booking_group_id, meeting_link",
    );

  if (anchor.parent_booking_group_id) {
    query = query.eq("parent_booking_group_id", anchor.parent_booking_group_id);
  } else {
    query = query.eq("id", anchor.id);
  }

  const { data, error } = await query
    .order("lesson_date", { ascending: true })
    .order("lesson_time", { ascending: true });

  if (error) throw error;
  return (data ?? []) as BookingRow[];
}

function validatePaidSession(
  session: Stripe.Checkout.Session,
  payment: PaymentRow,
) {
  if (session.payment_status !== "paid") {
    throw new Error(`Stripe session ${session.id} has not been paid.`);
  }

  const expectedCurrency = payment.currency.toLowerCase();
  const receivedCurrency = session.currency?.toLowerCase();

  if (!receivedCurrency || receivedCurrency !== expectedCurrency) {
    throw new Error(
      `Currency mismatch for Stripe session ${session.id}: expected ${expectedCurrency}, received ${receivedCurrency || "missing"}.`,
    );
  }

  const expectedMinorAmount = Math.round(Number(payment.amount) * 100);

  if (!Number.isFinite(expectedMinorAmount) || expectedMinorAmount <= 0) {
    throw new Error(`Payment ${payment.id} has an invalid expected amount.`);
  }

  if (session.amount_total !== expectedMinorAmount) {
    throw new Error(
      `Amount mismatch for Stripe session ${session.id}: expected ${expectedMinorAmount}, received ${session.amount_total ?? "missing"}.`,
    );
  }
}

function validateBookingGroup(bookings: BookingRow[]) {
  const first = bookings[0];

  for (const booking of bookings) {
    if (
      !booking.parent_id ||
      !booking.tutor_id ||
      !booking.lesson_date ||
      !booking.lesson_time
    ) {
      throw new Error(
        `Booking ${booking.id} is missing required timetable details.`,
      );
    }

    if (
      booking.parent_id !== first.parent_id ||
      booking.student_id !== first.student_id ||
      booking.subject_id !== first.subject_id ||
      booking.plan_id !== first.plan_id
    ) {
      throw new Error(
        `Booking group ${first.parent_booking_group_id || first.id} is inconsistent.`,
      );
    }
  }
}

async function ensureLessonSessions(bookings: BookingRow[]) {
  const bookingIds = bookings.map((booking) => booking.id);

  const { data: existingRows, error: existingError } = await supabaseAdmin
    .from("lesson_sessions")
    .select("booking_id")
    .in("booking_id", bookingIds);

  if (existingError) throw existingError;

  const existingBookingIds = new Set(
    (existingRows ?? []).map((row: { booking_id: string }) => row.booking_id),
  );

  const availabilitySlotIds = Array.from(
    new Set(
      bookings
        .map((booking) => booking.availability_slot_id)
        .filter((value): value is string => Boolean(value)),
    ),
  );

  const availabilityMap = new Map<string, AvailabilitySlotRow>();

  if (availabilitySlotIds.length > 0) {
    const { data: slotRows, error: slotError } = await supabaseAdmin
      .from("tutor_availability_slots")
      .select("id, starts_at, ends_at")
      .in("id", availabilitySlotIds);

    if (slotError) throw slotError;

    for (const slot of (slotRows ?? []) as AvailabilitySlotRow[]) {
      availabilityMap.set(slot.id, slot);
    }
  }

  const studentIds = Array.from(
    new Set(bookings.map((booking) => booking.student_id)),
  );
  const { data: studentRows, error: studentError } = await supabaseAdmin
    .from("student_profiles")
    .select("id, learning_level_id")
    .in("id", studentIds);

  if (studentError) throw studentError;

  const learningLevelByStudent = new Map<string, string | null>(
    (studentRows ?? []).map(
      (student: { id: string; learning_level_id: string | null }) => [
        student.id,
        student.learning_level_id,
      ],
    ),
  );

  const missingSessions = bookings
    .filter((booking) => !existingBookingIds.has(booking.id))
    .map((booking) => {
      const slot = booking.availability_slot_id
        ? availabilityMap.get(booking.availability_slot_id)
        : null;

      const startsAt = slot?.starts_at || bookingStartIso(booking);
      const endsAt =
        slot?.ends_at ||
        new Date(new Date(startsAt).getTime() + 60 * 60 * 1000).toISOString();

      return {
        booking_id: booking.id,
        student_id: booking.student_id,
        tutor_id: booking.tutor_id,
        subject_id: booking.subject_id,
        learning_level_id:
          learningLevelByStudent.get(booking.student_id) || null,
        session_date: booking.lesson_date,
        starts_at: startsAt,
        ends_at: endsAt,
        duration_minutes: Math.round(
          (new Date(endsAt).getTime() - new Date(startsAt).getTime()) / 60000,
        ),
        meeting_link:
          booking.meeting_link ||
          `https://meet.jit.si/fountainprep-${booking.id}`,
        status: "scheduled",
      };
    });

  if (missingSessions.length === 0) return;

  const { error: insertError } = await supabaseAdmin
    .from("lesson_sessions")
    .insert(missingSessions);

  if (insertError) throw insertError;
}

async function ensureLessonReminders(bookings: BookingRow[]) {
  const reminders = bookings.flatMap((booking) => {
    const startsAt = bookingStartIso(booking);
    const startMs = new Date(startsAt).getTime();

    return [
      {
        booking_id: booking.id,
        reminder_type: "24_HOURS",
        scheduled_for: new Date(startMs - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        booking_id: booking.id,
        reminder_type: "1_HOUR",
        scheduled_for: new Date(startMs - 60 * 60 * 1000).toISOString(),
      },
    ];
  });

  const { error } = await supabaseAdmin
    .from("lesson_reminders")
    .upsert(reminders, { onConflict: "booking_id,reminder_type" });

  if (error) throw error;
}

async function sendBookingConfirmationEmails(
  session: Stripe.Checkout.Session,
  payment: PaymentRow,
  bookings: BookingRow[],
) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    throw new Error("Missing RESEND_API_KEY for booking confirmation emails.");
  }

  const first = bookings[0];
  const groupId = first.parent_booking_group_id || first.id;
  const party = await getBookingParty(first);
  const appUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://www.fountainprep.com"
  ).replace(/\/$/, "");
  const parentDashboardUrl = `${appUrl}/parent/dashboard`;
  const tutorDashboardUrl = `${appUrl}/tutor/dashboard`;
  const adminBookingsUrl = `${appUrl}/admin`;
  const planName =
    first.plan_id === "three_month" ? "3-Month Plan" : "Monthly Plan";
  const amountLabel = formatMoney(payment.amount, payment.currency);
  const failures: string[] = [];

  if (party.parentEmail) {
    try {
      await deliverBookingEmail({
        resendApiKey,
        groupId,
        sessionId: session.id,
        recipientType: "parent",
        recipientEmail: party.parentEmail,
        subject: `${party.studentName}'s Fountain Prep booking is confirmed`,
        html: bookingEmailShell({
          eyebrow: "Payment and timetable confirmed",
          heading: `Your booking is confirmed, ${party.parentName}`,
          introduction: `${party.studentName} is now matched with ${party.tutorName} for ${party.subjectName}.`,
          detailRows: [
            ["Learner", party.studentName],
            ["Subject", party.subjectName],
            ["Tutor", party.tutorName],
            ["Plan", `${planName} · ${bookings.length} private lessons`],
            ["Payment", `${amountLabel} paid securely`],
            ["Your timezone", party.parentTimezone],
          ],
          schedule: buildScheduleRows(bookings, party.parentTimezone),
          actionLabel: "View Parent Dashboard",
          actionUrl: parentDashboardUrl,
          closing:
            "The lesson links and any future learning updates will be available from your Parent Dashboard.",
        }),
      });
    } catch (error: unknown) {
      failures.push(`parent: ${errorMessage(error)}`);
    }
  }

  if (party.tutorEmail) {
    try {
      await deliverBookingEmail({
        resendApiKey,
        groupId,
        sessionId: session.id,
        recipientType: "tutor",
        recipientEmail: party.tutorEmail,
        subject: `New student matched: ${party.studentName} · ${party.subjectName}`,
        html: bookingEmailShell({
          eyebrow: "New paid booking",
          heading: `You have been matched with ${party.studentName}`,
          introduction: `A parent has completed payment for ${party.subjectName} lessons with you. Please review the timetable and prepare for the first lesson.`,
          detailRows: [
            ["Learner", party.studentName],
            ["Subject", party.subjectName],
            ["Plan", `${planName} · ${bookings.length} private lessons`],
            ["Your timezone", party.tutorTimezone],
          ],
          schedule: buildScheduleRows(bookings, party.tutorTimezone),
          actionLabel: "Open Tutor Dashboard",
          actionUrl: tutorDashboardUrl,
          closing:
            "Please contact Fountain Prep support immediately if you cannot attend any scheduled lesson.",
        }),
      });
    } catch (error: unknown) {
      failures.push(`tutor: ${errorMessage(error)}`);
    }
  }

  const adminTimezone = validTimezone(
    process.env.ADMIN_TIMEZONE,
    "Europe/London",
  );
  const adminEmails = await getAdminEmails();

  for (const adminEmail of adminEmails) {
    try {
      await deliverBookingEmail({
        resendApiKey,
        groupId,
        sessionId: session.id,
        recipientType: "admin",
        recipientEmail: adminEmail,
        subject: `Paid booking: ${party.studentName} matched with ${party.tutorName}`,
        html: bookingEmailShell({
          eyebrow: "New paid Fountain Prep booking",
          heading: "A parent has completed payment",
          introduction:
            "The learner and tutor have been matched and the full timetable has been confirmed.",
          detailRows: [
            [
              "Parent",
              `${party.parentName}${party.parentEmail ? ` · ${party.parentEmail}` : " · email missing"}`,
            ],
            ["Learner", party.studentName],
            [
              "Tutor",
              `${party.tutorName}${party.tutorEmail ? ` · ${party.tutorEmail}` : " · email missing"}`,
            ],
            ["Subject", party.subjectName],
            ["Plan", `${planName} · ${bookings.length} private lessons`],
            ["Payment", `${amountLabel} · ${session.id}`],
            ["Admin timezone", adminTimezone],
          ],
          schedule: buildScheduleRows(bookings, adminTimezone),
          actionLabel: "Review Admin Bookings",
          actionUrl: adminBookingsUrl,
          closing:
            "Please follow up immediately if either the parent or tutor email address is missing.",
        }),
      });
    } catch (error: unknown) {
      failures.push(`admin ${adminEmail}: ${errorMessage(error)}`);
    }
  }

  if (failures.length > 0) {
    throw new Error(
      `Booking confirmed, but notification delivery needs retry: ${failures.join("; ")}`,
    );
  }
}

async function getBookingParty(booking: BookingRow): Promise<BookingParty> {
  if (!booking.parent_id || !booking.tutor_id) {
    throw new Error(`Booking ${booking.id} is missing its parent or tutor.`);
  }

  const [
    parentResult,
    tutorResult,
    studentResult,
    subjectResult,
    parentAuthResult,
  ] = await Promise.all([
    supabaseAdmin
      .from("parent_profiles")
      .select("full_name, timezone")
      .eq("user_id", booking.parent_id)
      .maybeSingle(),
    supabaseAdmin
      .from("tutor_profiles")
      .select("user_id, full_name, timezone")
      .eq("id", booking.tutor_id)
      .maybeSingle(),
    supabaseAdmin
      .from("student_profiles")
      .select("full_name")
      .eq("id", booking.student_id)
      .maybeSingle(),
    supabaseAdmin
      .from("subjects")
      .select("name")
      .eq("id", booking.subject_id)
      .maybeSingle(),
    supabaseAdmin.auth.admin.getUserById(booking.parent_id),
  ]);

  if (parentResult.error) throw parentResult.error;
  if (tutorResult.error) throw tutorResult.error;
  if (studentResult.error) throw studentResult.error;
  if (subjectResult.error) throw subjectResult.error;

  const tutorUserId = tutorResult.data?.user_id as string | null | undefined;
  const tutorAuthResult = tutorUserId
    ? await supabaseAdmin.auth.admin.getUserById(tutorUserId)
    : null;

  const parentAuth = parentAuthResult.data.user;
  const tutorAuth = tutorAuthResult?.data.user;

  return {
    parentName:
      parentResult.data?.full_name ||
      parentAuth?.user_metadata?.full_name ||
      "Parent",
    parentEmail: normaliseEmail(parentAuth?.email),
    parentTimezone: validTimezone(parentResult.data?.timezone, "Europe/London"),
    tutorName: tutorResult.data?.full_name || "Fountain Prep Tutor",
    tutorEmail: normaliseEmail(tutorAuth?.email),
    tutorTimezone: validTimezone(tutorResult.data?.timezone, "Africa/Lagos"),
    studentName: studentResult.data?.full_name || "Learner",
    subjectName: subjectResult.data?.name || "Lesson",
  };
}

async function getAdminEmails() {
  const emails = new Set<string>();
  const configuredEmails = [
    process.env.ADMIN_BOOKING_EMAIL,
    process.env.ADMIN_SUPPORT_EMAIL,
    "support@fountainprep.com",
  ];

  for (const value of configuredEmails) {
    for (const candidate of (value || "").split(",")) {
      const email = normaliseEmail(candidate);
      if (email) emails.add(email);
    }
  }

  const { data: adminProfiles, error } = await supabaseAdmin
    .from("user_profiles")
    .select("id")
    .ilike("role", "admin");

  if (error) throw error;

  for (const admin of adminProfiles ?? []) {
    const { data } = await supabaseAdmin.auth.admin.getUserById(admin.id);
    const email = normaliseEmail(data.user?.email);
    if (email) emails.add(email);
  }

  return Array.from(emails);
}

async function deliverBookingEmail({
  resendApiKey,
  groupId,
  sessionId,
  recipientType,
  recipientEmail,
  subject,
  html,
}: {
  resendApiKey: string;
  groupId: string;
  sessionId: string;
  recipientType: EmailRecipientType;
  recipientEmail: string;
  subject: string;
  html: string;
}) {
  const email = recipientEmail.toLowerCase();
  const delivery = await claimEmailDelivery(
    groupId,
    sessionId,
    recipientType,
    email,
  );

  if (!delivery) return;

  const fromAddress =
    process.env.RESEND_FROM_EMAIL || "Fountain Prep <onboarding@resend.dev>";
  const replyTo = process.env.ADMIN_SUPPORT_EMAIL || "support@fountainprep.com";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `booking-confirmation-${delivery.id}`,
    },
    body: JSON.stringify({
      from: fromAddress,
      to: email,
      reply_to: replyTo,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const responseText = await response.text();
    await supabaseAdmin
      .from("booking_notification_deliveries")
      .update({
        status: "failed",
        last_error: responseText.slice(0, 1000),
        updated_at: new Date().toISOString(),
      })
      .eq("id", delivery.id);

    throw new Error(
      `Resend rejected ${recipientType} email (${response.status}): ${responseText}`,
    );
  }

  const { error } = await supabaseAdmin
    .from("booking_notification_deliveries")
    .update({
      status: "sent",
      sent_at: new Date().toISOString(),
      last_error: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", delivery.id);

  if (error) throw error;
}

async function claimEmailDelivery(
  groupId: string,
  sessionId: string,
  recipientType: EmailRecipientType,
  recipientEmail: string,
): Promise<DeliveryRow | null> {
  const { data: existing, error: existingError } = await supabaseAdmin
    .from("booking_notification_deliveries")
    .select("id, status, attempt_count")
    .eq("stripe_session_id", sessionId)
    .eq("recipient_type", recipientType)
    .eq("recipient_email", recipientEmail)
    .maybeSingle();

  if (existingError) throw existingError;
  if (existing?.status === "sent") return null;

  if (existing) {
    const { data, error } = await supabaseAdmin
      .from("booking_notification_deliveries")
      .update({
        status: "pending",
        attempt_count: Number(existing.attempt_count || 0) + 1,
        last_error: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .select("id, status, attempt_count")
      .single();

    if (error) throw error;
    return data as DeliveryRow;
  }

  const { data, error } = await supabaseAdmin
    .from("booking_notification_deliveries")
    .insert({
      booking_group_id: groupId,
      stripe_session_id: sessionId,
      recipient_type: recipientType,
      recipient_email: recipientEmail,
      status: "pending",
      attempt_count: 1,
    })
    .select("id, status, attempt_count")
    .single();

  if (!error) return data as DeliveryRow;

  // Two Stripe deliveries can arrive together. Re-read the unique row and use
  // the same Resend idempotency key so concurrent retries cannot duplicate mail.
  if (error.code === "23505") {
    const { data: raced, error: racedError } = await supabaseAdmin
      .from("booking_notification_deliveries")
      .select("id, status, attempt_count")
      .eq("stripe_session_id", sessionId)
      .eq("recipient_type", recipientType)
      .eq("recipient_email", recipientEmail)
      .single();

    if (racedError) throw racedError;
    if (raced.status === "sent") return null;
    return raced as DeliveryRow;
  }

  throw error;
}

function buildScheduleRows(bookings: BookingRow[], viewerTimezone: string) {
  return bookings.map((booking, index) => ({
    label: `Lesson ${index + 1}`,
    value: formatBookingForTimezone(booking, viewerTimezone),
  }));
}

function formatBookingForTimezone(booking: BookingRow, viewerTimezone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: viewerTimezone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZoneName: "short",
  }).format(new Date(bookingStartIso(booking)));
}

function bookingEmailShell({
  eyebrow,
  heading,
  introduction,
  detailRows,
  schedule,
  actionLabel,
  actionUrl,
  closing,
}: {
  eyebrow: string;
  heading: string;
  introduction: string;
  detailRows: Array<[string, string]>;
  schedule: Array<{ label: string; value: string }>;
  actionLabel: string;
  actionUrl: string;
  closing: string;
}) {
  const detailsHtml = detailRows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 0;color:#6f637e;vertical-align:top">${escapeHtml(label)}</td>
          <td style="padding:10px 0;color:#241438;font-weight:700;text-align:right;vertical-align:top">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");
  const scheduleHtml = schedule
    .map(
      (item) => `
        <div style="padding:12px 0;border-bottom:1px solid #eadcff">
          <div style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#7c3aed;font-weight:800">${escapeHtml(item.label)}</div>
          <div style="margin-top:4px;color:#241438;font-weight:700">${escapeHtml(item.value)}</div>
        </div>`,
    )
    .join("");

  return `
    <div style="margin:0;background:#f8f5ff;padding:24px;font-family:Arial,sans-serif;color:#241438;line-height:1.6">
      <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #eadcff;border-radius:24px;overflow:hidden">
        <div style="padding:28px 30px;background:linear-gradient(135deg,#4c1d95,#7c3aed);color:#ffffff">
          <div style="font-size:18px;font-weight:900">Fountain Prep</div>
          <div style="margin-top:20px;font-size:12px;text-transform:uppercase;letter-spacing:.1em;font-weight:800;opacity:.85">${escapeHtml(eyebrow)}</div>
          <h1 style="margin:8px 0 0;font-size:30px;line-height:1.2">${escapeHtml(heading)}</h1>
        </div>
        <div style="padding:30px">
          <p style="margin-top:0;font-size:17px">${escapeHtml(introduction)}</p>
          <table role="presentation" style="width:100%;border-collapse:collapse;margin:22px 0;background:#fbf9ff;border:1px solid #eadcff;border-radius:16px">
            <tbody>${detailsHtml}</tbody>
          </table>
          <h2 style="margin:28px 0 8px;font-size:20px">Confirmed timetable</h2>
          <div style="border-top:1px solid #eadcff">${scheduleHtml}</div>
          <p style="margin:24px 0">${escapeHtml(closing)}</p>
          <p style="margin:26px 0;text-align:center">
            <a href="${escapeHtml(actionUrl)}" style="display:inline-block;background:#6d28d9;color:#ffffff;text-decoration:none;font-weight:800;padding:13px 22px;border-radius:999px">${escapeHtml(actionLabel)}</a>
          </p>
          <hr style="border:none;border-top:1px solid #eadcff;margin:28px 0" />
          <p style="margin:0;color:#6f637e;font-size:13px">
            Need help? Reply to this email or contact
            <a href="mailto:support@fountainprep.com" style="color:#6d28d9;font-weight:700">support@fountainprep.com</a>.
          </p>
        </div>
      </div>
    </div>`;
}

function normaliseEmail(value?: string | null) {
  const email = String(value || "")
    .trim()
    .toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

function validTimezone(value: string | null | undefined, fallback: string) {
  const candidate = value || fallback;

  try {
    new Intl.DateTimeFormat("en-GB", { timeZone: candidate }).format();
    return candidate;
  } catch {
    return fallback;
  }
}

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(Number(amount));
  } catch {
    return `${currency.toUpperCase()} ${Number(amount).toFixed(2)}`;
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function bookingStartIso(booking: BookingRow) {
  if (!booking.lesson_date || !booking.lesson_time) {
    throw new Error(`Booking ${booking.id} is missing lesson date or time.`);
  }

  return zonedDateTimeToUtc(
    booking.lesson_date,
    booking.lesson_time,
    booking.timezone || "Europe/London",
  ).toISOString();
}

/**
 * Converts a local date/time in an IANA timezone into one canonical UTC instant.
 * This is needed because `new Date('2026-07-20T18:00')` uses the server timezone
 * and does not understand values such as Africa/Lagos or America/New_York.
 */
function zonedDateTimeToUtc(
  dateValue: string,
  timeValue: string,
  timeZone: string,
) {
  const [year, month, day] = dateValue.split("-").map(Number);
  const [hour, minute, second = 0] = timeValue.split(":").map(Number);

  if (
    ![year, month, day, hour, minute, second].every(Number.isFinite) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    throw new Error(`Invalid lesson date/time: ${dateValue} ${timeValue}`);
  }

  const targetAsUtc = Date.UTC(year, month - 1, day, hour, minute, second);
  let candidate = new Date(targetAsUtc);

  // Iterate because timezone offsets can differ across dates due to DST.
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const parts = zonedParts(candidate, timeZone);
    const representedAsUtc = Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second,
    );
    const difference = targetAsUtc - representedAsUtc;

    if (difference === 0) return candidate;
    candidate = new Date(candidate.getTime() + difference);
  }

  return candidate;
}

function zonedParts(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  const map = new Map(
    formatter
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return {
    year: Number(map.get("year")),
    month: Number(map.get("month")),
    day: Number(map.get("day")),
    hour: Number(map.get("hour")),
    minute: Number(map.get("minute")),
    second: Number(map.get("second")),
  };
}
