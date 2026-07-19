import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const resendApiKey = process.env.RESEND_API_KEY;
const appUrl = (
  process.env.NEXT_PUBLIC_APP_URL || "https://www.fountainprep.com"
).replace(/\/$/, "");

if (!supabaseUrl) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
if (!serviceRoleKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
if (!resendApiKey) throw new Error("Missing RESEND_API_KEY");

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
const resend = new Resend(resendApiKey);

type RequestBody = {
  tutorIds?: string[];
};

type TutorProfile = {
  id: string;
  full_name: string;
  email: string | null;
  approval_status: string;
  orientation_completed: boolean;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildOrientationEmail(tutor: TutorProfile) {
  const tutorName = escapeHtml(tutor.full_name || "Tutor");
  const orientationLink = `${appUrl}/tutor/orientation`;

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Complete Your Fountain Prep Tutor Orientation</title>
      </head>

      <body style="margin:0;padding:0;background:#f7f3ff;font-family:Arial,Helvetica,sans-serif;color:#261735;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td align="center" style="padding:32px 16px;">
              <table
                role="presentation"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="max-width:640px;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #eadffd;"
              >
                <tr>
                  <td style="padding:36px 34px 30px;background:linear-gradient(135deg,#6d28d9,#7c3aed);color:#ffffff;">
                    <div style="font-size:15px;font-weight:700;margin-bottom:10px;">Fountain Prep</div>
                    <div style="font-size:13px;font-weight:700;opacity:.88;text-transform:uppercase;letter-spacing:1.3px;">
                      Tutor onboarding
                    </div>
                    <h1 style="margin:12px 0 0;font-size:32px;line-height:1.15;">
                      One more step before you start teaching
                    </h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding:34px;">
                    <p style="margin:0 0 18px;font-size:17px;line-height:1.7;">
                      Dear ${tutorName},
                    </p>

                    <p style="margin:0 0 18px;color:#655873;font-size:16px;line-height:1.75;">
                      Congratulations on becoming an approved Fountain Prep tutor.
                    </p>

                    <p style="margin:0 0 24px;color:#655873;font-size:16px;line-height:1.75;">
                      Before receiving lesson bookings, please log in to your tutor platform and complete the required orientation. It takes approximately 15 minutes.
                    </p>

                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#faf7ff;border:1px solid #eadffd;border-radius:18px;">
                      <tr>
                        <td style="padding:22px;">
                          <div style="font-size:13px;font-weight:800;color:#7c3aed;text-transform:uppercase;letter-spacing:.8px;">
                            During orientation you will
                          </div>
                          <div style="margin-top:15px;font-size:15px;line-height:1.9;color:#4d4058;">
                            ✓ Learn how to use the tutor platform<br />
                            ✓ Review safeguarding and professional standards<br />
                            ✓ Complete a short knowledge assessment<br />
                            ✓ Continue to your payout setup
                          </div>
                        </td>
                      </tr>
                    </table>

                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:28px;">
                      <tr>
                        <td align="center">
                          <a
                            href="${orientationLink}"
                            target="_blank"
                            style="display:inline-block;padding:16px 28px;border-radius:14px;background:#6d28d9;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;"
                          >
                            Complete Tutor Orientation
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:28px 0 0;font-size:14px;line-height:1.7;color:#756981;">
                      Please use the same email address and password connected to your Fountain Prep tutor account.
                    </p>

                    <p style="margin:24px 0 0;font-size:15px;line-height:1.7;">
                      Kind regards,<br />
                      <strong>Fountain Prep Team</strong>
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:20px 34px;background:#faf7ff;color:#81758e;font-size:12px;line-height:1.6;text-align:center;">
                    Need help? Contact support@fountainprep.com
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as RequestBody;
    const tutorIds = Array.isArray(body.tutorIds)
      ? [...new Set(body.tutorIds.filter(Boolean))]
      : [];

    let query = supabaseAdmin
      .from("tutor_profiles")
      .select("id, full_name, email, approval_status, orientation_completed")
      .eq("approval_status", "approved")
      .eq("orientation_completed", false);

    if (tutorIds.length > 0) {
      query = query.in("id", tutorIds);
    }

    const { data, error } = await query.returns<TutorProfile[]>();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const tutors = (data ?? []).filter((tutor) => Boolean(tutor.email));

    if (tutors.length === 0) {
      return NextResponse.json(
        {
          error:
            "No approved tutors are currently waiting to complete orientation.",
        },
        { status: 400 },
      );
    }

    const results = await Promise.allSettled(
      tutors.map(async (tutor) => {
        const { data: emailData, error: emailError } = await resend.emails.send(
          {
            from: "Fountain Prep <support@fountainprep.com>",
            to: tutor.email as string,
            subject:
              "Action Required: Complete Your Fountain Prep Tutor Orientation",
            html: buildOrientationEmail(tutor),
          },
        );

        if (emailError) {
          throw new Error(
            emailError.message || `Email failed for ${tutor.email}.`,
          );
        }

        return {
          tutorId: tutor.id,
          tutorEmail: tutor.email,
          resendId: emailData?.id ?? null,
        };
      }),
    );

    const sent = results.filter(
      (result) => result.status === "fulfilled",
    ).length;
    const failed = results.length - sent;

    return NextResponse.json({
      success: failed === 0,
      sent,
      failed,
      total: results.length,
      message:
        failed === 0
          ? `${sent} orientation reminder${sent === 1 ? "" : "s"} sent successfully.`
          : `${sent} orientation reminder${sent === 1 ? "" : "s"} sent and ${failed} failed.`,
    });
  } catch (error) {
    console.error("Tutor orientation reminder error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to send tutor orientation reminders.",
      },
      { status: 500 },
    );
  }
}