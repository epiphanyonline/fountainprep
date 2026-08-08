import {
  NextResponse,
} from "next/server";
import {
  createClient,
} from "@supabase/supabase-js";

import {
  createGoogleMeetEvent,
  isGoogleMeetUrl,
} from "@/app/lib/googleMeet";
import {
  zonedDateTimeToUtc,
} from "@/app/lib/timezone";

export const dynamic =
  "force-dynamic";

const supabaseUrl =
  process.env
    .NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey =
  process.env
    .SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin =
  createClient(
    supabaseUrl,
    serviceRoleKey,
  );

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{
      interviewId: string;
    }>;
  },
) {
  try {
    const { interviewId } =
      await params;

    const {
      data: interview,
      error,
    } = await supabaseAdmin
      .from("tutor_interviews")
      .select(`
        id,
        tutor_id,
        tutor_user_id,
        tutor_name,
        tutor_email,
        interview_date,
        interview_time,
        interview_link,
        status,
        created_at,
        updated_at
      `)
      .eq("id", interviewId)
      .single();

    if (
      error ||
      !interview
    ) {
      return NextResponse.json(
        {
          error:
            "Interview not found",
        },
        { status: 404 },
      );
    }

    let meetingLink =
      interview.interview_link ||
      null;

    if (
      !isGoogleMeetUrl(
        meetingLink,
      ) &&
      interview.interview_date &&
      interview.interview_time
    ) {
      const timezone =
        "Europe/London";

      const start =
        zonedDateTimeToUtc(
          interview.interview_date,
          interview.interview_time,
          timezone,
        );

      const end = new Date(
        start.getTime() +
          20 * 60 * 1000,
      );

      const created =
        await createGoogleMeetEvent({
          summary:
            `Fountain Prep Tutor Interview · ${
              interview.tutor_name ||
              "Candidate"
            }`,
          description:
            "Fountain Prep tutor onboarding interview.",
          startIso:
            start.toISOString(),
          endIso:
            end.toISOString(),
          timeZone: timezone,
          attendees:
            interview.tutor_email
              ? [
                  interview.tutor_email,
                ]
              : [],
          requestKey:
            `interview-${interview.id}`,
        });

      meetingLink =
        created.meetUrl;

      const {
        error: updateError,
      } = await supabaseAdmin
        .from(
          "tutor_interviews",
        )
        .update({
          interview_link:
            meetingLink,
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          interview.id,
        );

      if (updateError) {
        throw updateError;
      }
    }

    return NextResponse.json({
      interview: {
        id: interview.id,
        tutor_id:
          interview.tutor_id,
        tutor_user_id:
          interview.tutor_user_id,
        candidate_email:
          interview.tutor_email,
        candidate_name:
          interview.tutor_name,
        interview_date:
          interview.interview_date,
        interview_time:
          interview.interview_time,
        timezone:
          "Europe/London",
        interview_link:
          meetingLink,
        meeting_link:
          meetingLink,
        status:
          interview.status ||
          "SCHEDULED",
        created_at:
          interview.created_at,
        updated_at:
          interview.updated_at,
      },
    });
  } catch (error) {
    console.error(
      "Interview lookup error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load interview",
      },
      { status: 500 },
    );
  }
}
