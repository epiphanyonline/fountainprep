import { NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";



import { stripe } from "../../../lib/stripe";



const supabaseUrl =

  process.env.NEXT_PUBLIC_SUPABASE_URL;



const serviceRoleKey =

  process.env.SUPABASE_SERVICE_ROLE_KEY;



const appUrl =

  process.env.NEXT_PUBLIC_APP_URL;



if (!supabaseUrl) {

  throw new Error(

    "Missing NEXT_PUBLIC_SUPABASE_URL",

  );

}



if (!serviceRoleKey) {

  throw new Error(

    "Missing SUPABASE_SERVICE_ROLE_KEY",

  );

}



if (!appUrl) {

  throw new Error(

    "Missing NEXT_PUBLIC_APP_URL",

  );

}



const supabaseAdmin = createClient(

  supabaseUrl,

  serviceRoleKey,

  {

    auth: {

      autoRefreshToken: false,

      persistSession: false,

    },

  },

);



type RequestBody = {

  academyId?: string | null;

  programmeId?: string | null;

  studentId?: string | null;

};



const FINANCIAL_LITERACY_PRICE_GBP = 1999;



export async function POST(

  req: Request,

) {

  try {

    const user =

      await authenticateRequest(req);



    if (!user) {

      return NextResponse.json(

        {

          error:

            "You must be logged in to purchase this academy.",

        },

        { status: 401 },

      );

    }



    const body =

      (await req.json()) as RequestBody;



    const academyId =

      canonicalAcademyCode(

        body.academyId?.trim() ||

          "personal-finance",

      );



    const programmeId =

      body.programmeId?.trim() ||

      defaultProgrammeId(academyId);



    const studentId =

      body.studentId?.trim() || null;



    if (

      academyId !== "personal-finance"

    ) {

      return NextResponse.json(

        {

          error:

            "This academy is not yet available for one-time purchase.",

        },

        { status: 400 },

      );

    }



    /*

     * For the first launch we require an authenticated

     * Fountain Prep account before checkout so that the

     * permanent purchase can be reliably attached to the

     * correct account.

     */

    const account =

      await getAccountContext(user.id);



    if (!account) {

      return NextResponse.json(

        {

          error:

            "Your Fountain Prep account profile is incomplete.",

        },

        { status: 409 },

      );

    }



    let resolvedStudentId =

      studentId;



    /*

     * Individual learners automatically purchase

     * access for their own learner profile.

     */

    if (

      account.accountType ===

      "ADULT_LEARNER"

    ) {

      const selfLearner =

        await getSelfLearner(

          account.parentProfileId,

        );



      if (!selfLearner) {

        return NextResponse.json(

          {

            error:

              "Your learner profile is not ready yet.",

          },

          { status: 409 },

        );

      }



      if (

        resolvedStudentId &&

        resolvedStudentId !==

          selfLearner.id

      ) {

        return NextResponse.json(

          {

            error:

              "This academy purchase can only be assigned to your own learner profile.",

          },

          { status: 403 },

        );

      }



      resolvedStudentId =

        selfLearner.id;

    }



    /*

     * Parent accounts may purchase for a selected

     * learner. Verify ownership if a learner is supplied.

     */

    if (resolvedStudentId) {

      const ownsLearner =

        await userOwnsLearner(

          user.id,

          resolvedStudentId,

        );



      if (!ownsLearner) {

        return NextResponse.json(

          {

            error:

              "Learner not found or you do not have access to it.",

          },

          { status: 404 },

        );

      }

    }



    /*

     * Prevent someone from buying the same academy

     * twice after a successful purchase.

     */

    /*

 * One ownership record is maintained for each

 * user / learner / academy combination.

 *

 * A paid record means permanent ownership.

 * Pending, cancelled or refunded records may

 * be reused for a fresh Checkout Session.

 */



    const existingPurchase =

  await getExistingPurchase({

    userId: user.id,

    studentId: resolvedStudentId,

    academyCode: academyId,

  });



if (existingPurchase?.status === "paid") {

  return NextResponse.json(

    {

      error:

        "You already own this academy.",

      code:

        "ACADEMY_ALREADY_OWNED",

    },

    { status: 409 },

  );

}



/*

 * Reuse an existing Stripe Checkout Session

 * rather than creating duplicate payment attempts.

 */

if (existingPurchase?.stripe_checkout_session_id) {

  const previousSession =

    await stripe.checkout.sessions.retrieve(

      existingPurchase.stripe_checkout_session_id,

    );



  // Existing sessions (including legacy purchases) must belong to
  // the authenticated customer, learner and academy.
  const legacySessionMatches =
    previousSession.metadata?.payment_type === "academy_purchase" &&
    previousSession.metadata?.user_id === user.id &&
    previousSession.metadata?.academy_id === academyId &&
    (previousSession.metadata?.student_id || "") ===
      (resolvedStudentId || "") &&
    [1999, 3900].includes(previousSession.amount_total ?? -1) &&
    previousSession.currency?.toLowerCase() === "gbp";

  if (!legacySessionMatches) {
    throw new Error("Existing purchase session does not match the learner.");
  }

  if (previousSession.payment_status === "paid") {

    return NextResponse.json(

      {

        error:

          "Your previous payment has been received. Please refresh your academy access.",

        code: "ACADEMY_PAYMENT_PENDING_CONFIRMATION",

      },

      { status: 409 },

    );

  }



  if (

    previousSession.status === "open" &&

    previousSession.payment_status === "unpaid" &&
    previousSession.amount_total === FINANCIAL_LITERACY_PRICE_GBP &&

    previousSession.url

  ) {

    return NextResponse.json({

      url: previousSession.url,

    });

  }



  // Expire an old-price session before allowing a new-price checkout.
  if (
    previousSession.amount_total === 3900 &&
    previousSession.status === "open" &&
    previousSession.payment_status === "unpaid"
  ) {
    await stripe.checkout.sessions.expire(previousSession.id);

    return NextResponse.json(
      {
        error:
          "Your previous checkout used an earlier price. Please select Purchase again to continue at £19.99.",
        code: "ACADEMY_CHECKOUT_EXPIRED",
      },
      { status: 409 },
    );
  }

  if (previousSession.status === "open") {

    return NextResponse.json(

      {

        error:

          "Your existing checkout is still being processed. Please try again shortly.",

      },

      { status: 409 },

    );

  }

}

/*

 * Claim the checkout operation before creating

 * a new Stripe Checkout Session.

 */

const studentKey = resolvedStudentId ?? "ACCOUNT";



const { data: reservationRows, error: reservationError } =

  await supabaseAdmin.rpc("claim_academy_checkout", {

    p_user_id: user.id,

    p_student_key: studentKey,

    p_academy_code: academyId,

  });



if (reservationError) {

  throw reservationError;

}



const reservation = reservationRows?.[0];



if (!reservation) {

  throw new Error("Unable to reserve academy checkout.");

}



if (reservation.claim_status === "owned") {

  return NextResponse.json(

    {

      error: "You already own this academy.",

      code: "ACADEMY_ALREADY_OWNED",

    },

    { status: 409 },

  );

}





if (reservation.claim_status === "ready") {
  if (!reservation.checkout_session_id) {
    return NextResponse.json(
      {
        error: "Checkout reconciliation is required.",
        code: "ACADEMY_CHECKOUT_PENDING",
      },
      { status: 409 },
    );
  }

  const previousSession = await stripe.checkout.sessions.retrieve(
    reservation.checkout_session_id,
  );

  const sessionMatches =
    previousSession.metadata?.payment_type === "academy_purchase" &&
    previousSession.metadata?.user_id === user.id &&
    previousSession.metadata?.academy_id === academyId &&
    (previousSession.metadata?.student_id || "") ===
      (resolvedStudentId || "") &&
    [1999, 3900].includes(previousSession.amount_total ?? -1) &&
    previousSession.currency?.toLowerCase() === "gbp";

  if (!sessionMatches) {
    throw new Error(
      "Existing checkout session does not match the reservation.",
    );
  }

  if (
    previousSession.status === "open" &&
    previousSession.payment_status === "unpaid" &&
    previousSession.amount_total === FINANCIAL_LITERACY_PRICE_GBP &&
    previousSession.url
  ) {
    return NextResponse.json({ url: previousSession.url });
  }

  // Release only a Stripe-confirmed expired and unpaid session.
  // A new request can then claim a fresh checkout operation.
  if (
    previousSession.status === "expired" &&
    previousSession.payment_status === "unpaid"
  ) {
    const { data: released, error: releaseError } =
      await supabaseAdmin.rpc("release_academy_checkout", {
        p_reservation_id: reservation.reservation_id,
        p_expected_claim_token: null,
        p_expected_session_id: previousSession.id,
      });

    if (releaseError) {
      throw releaseError;
    }

    if (released) {
      return NextResponse.json(
        {
          error:
            "Your previous checkout expired. Please select Purchase again to start a new checkout.",
          code: "ACADEMY_CHECKOUT_EXPIRED",
        },
        { status: 409 },
      );
    }
  }

  return NextResponse.json(
    {
      error:
        previousSession.payment_status === "paid"
          ? "Your payment is being confirmed. Please refresh your academy access shortly."
          : "Your previous checkout requires reconciliation before another payment can be started.",
      code: "ACADEMY_CHECKOUT_PENDING",
    },
    { status: 409 },
  );
}

if (reservation.claim_status === "busy") {

  return NextResponse.json(

    {

      error:

        "Your checkout is being prepared or requires verification. Please try again shortly.",

      code: "ACADEMY_CHECKOUT_PENDING",

    },

    { status: 409 },

  );

}





if (

  reservation.claim_status !== "claimed" ||

  !reservation.claim_token

) {

  throw new Error("Invalid academy checkout reservation.");

}



    const successPath =

      buildSuccessPath({

        academyId,

        programmeId,

        studentId:

          resolvedStudentId,

      });



    const cancelPath =

      buildCancelPath({

        academyId,

        programmeId,

        studentId:

          resolvedStudentId,

      });





/*

 * Retrieve the idempotency key that was

 * stored atomically with this checkout claim.

 */

const { data: claimedReservation, error: claimLookupError } =

  await supabaseAdmin

    .from("academy_checkout_reservations")

    .select("id, claim_token, stripe_idempotency_key")

    .eq("id", reservation.reservation_id)

    .eq("claim_token", reservation.claim_token)

    .eq("status", "reserved")

    .single();



if (claimLookupError) {

  throw claimLookupError;

}



if (!claimedReservation?.stripe_idempotency_key) {

  throw new Error(

    "The checkout reservation is missing its Stripe idempotency key.",

  );

}



      const session =

      await stripe.checkout.sessions.create(

        {

          mode: "payment",



          customer_email:

            user.email || undefined,



          client_reference_id:

            user.id,



          success_url:

            `${normalisedAppUrl()}${successPath}`,



          cancel_url:

            `${normalisedAppUrl()}${cancelPath}`,



          line_items: [

            {

              price_data: {

                currency: "gbp",



                unit_amount:

                  FINANCIAL_LITERACY_PRICE_GBP,



                product_data: {

                  name:

                    "Fountain Prep Financial Literacy Academy",



                  description:

                    "Complete self-paced Financial Literacy Academy with full course access and certificate.",

                },

              },



              quantity: 1,

            },

          ],



          metadata: {

            payment_type:

              "academy_purchase",



            user_id:

              user.id,



            student_id:

              resolvedStudentId || "",



            academy_id:

              academyId,



            programme_id:

              programmeId || "",

          },



          payment_intent_data: {

            metadata: {

              payment_type:

                "academy_purchase",



              user_id:

                user.id,



              student_id:

                resolvedStudentId || "",



              academy_id:

                academyId,



              programme_id:

                programmeId || "",

            },

                    },

        },

        {

          idempotencyKey:

            claimedReservation.stripe_idempotency_key,

        },

      );



    if (!session.url) {

      return NextResponse.json(

        {

          error:

            "Stripe did not return a checkout URL.",

        },

        { status: 500 },

      );

    }





/*

 * Atomically save the purchase, payment attempt

 * and checkout reservation.

 *

 * Do not return the Stripe URL unless this succeeds.

 */

const { data: purchaseId, error: finalizeError } =

  await supabaseAdmin.rpc("finalize_academy_checkout", {

    p_reservation_id: reservation.reservation_id,

    p_claim_token: reservation.claim_token,

    p_session_id: session.id,

    p_checkout_url: session.url,

    p_programme_id: programmeId,

    p_amount: FINANCIAL_LITERACY_PRICE_GBP,

    p_currency: "gbp",

  });



if (finalizeError) {

  throw finalizeError;

}



if (!purchaseId) {

  throw new Error(

    "Checkout finalisation did not return a purchase ID.",

  );

}





    return NextResponse.json({

      url: session.url,

    });

  } catch (error: unknown) {

    console.error(

      "academy-purchase-checkout error",

      error,

    );



    return NextResponse.json(

      {

        error:

          "Unable to create academy purchase checkout session.",

      },

      { status: 500 },

    );

  }

}



async function authenticateRequest(

  req: Request,

) {

  const authorization =

    req.headers.get(

      "authorization",

    );



  const accessToken =

    authorization?.startsWith(

      "Bearer ",

    )

      ? authorization

          .slice(

            "Bearer ".length,

          )

          .trim()

      : "";



  if (!accessToken) {

    return null;

  }



  const {

    data,

    error,

  } =

    await supabaseAdmin.auth.getUser(

      accessToken,

    );



  if (

    error ||

    !data.user

  ) {

    return null;

  }



  return data.user;

}



type AccountContext = {

  parentProfileId: string;



  accountType:

    | "PARENT"

    | "ADULT_LEARNER";

};



async function getAccountContext(

  userId: string,

): Promise<AccountContext | null> {

  const {

    data,

    error,

  } = await supabaseAdmin

    .from("parent_profiles")

    .select(

      "id, account_type",

    )

    .eq(

      "user_id",

      userId,

    )

    .maybeSingle();



  if (error) {

    throw error;

  }



  if (!data) {

    return null;

  }



  return {

    parentProfileId:

      data.id,



    accountType:

      data.account_type ===

      "ADULT_LEARNER"

        ? "ADULT_LEARNER"

        : "PARENT",

  };

}



async function getSelfLearner(

  parentProfileId: string,

): Promise<{

  id: string;

} | null> {

  const {

    data,

    error,

  } = await supabaseAdmin

    .from("student_profiles")

    .select("id")

    .eq(

      "parent_id",

      parentProfileId,

    )

    .eq(

      "is_self_learner",

      true,

    )

    .maybeSingle();



  if (error) {

    throw error;

  }



  return data;

}



async function userOwnsLearner(

  userId: string,

  studentId: string,

): Promise<boolean> {

  const {

    data: parent,

    error: parentError,

  } = await supabaseAdmin

    .from("parent_profiles")

    .select("id")

    .eq(

      "user_id",

      userId,

    )

    .maybeSingle();



  if (parentError) {

    throw parentError;

  }



  if (!parent) {

    return false;

  }



  const {

    data: learner,

    error: learnerError,

  } = await supabaseAdmin

    .from("student_profiles")

    .select("id")

    .eq(

      "id",

      studentId,

    )

    .eq(

      "parent_id",

      parent.id,

    )

    .maybeSingle();



  if (learnerError) {

    throw learnerError;

  }



  return Boolean(learner);

}



async function getExistingPurchase({

  userId,

  studentId,

  academyCode,

}: {

  userId: string;

  studentId: string | null;

  academyCode: string;

}) {

  let query =

    supabaseAdmin

      .from("academy_purchases")

      .select(

        "id, status, stripe_checkout_session_id",

      )

      .eq(

        "user_id",

        userId,

      )

      .eq(

        "academy_code",

        academyCode,

      );



  if (studentId) {

    query =

      query.eq(

        "student_id",

        studentId,

      );

  } else {

    query =

      query.is(

        "student_id",

        null,

      );

  }



  const {

    data,

    error,

  } =

    await query.maybeSingle();



  if (error) {

    throw error;

  }



  return data;

}



function buildSuccessPath({

  academyId,

  programmeId,

  studentId,

}: {

  academyId: string;

  programmeId: string | null;

  studentId: string | null;

}) {

  const query =

    new URLSearchParams({

      purchase:

        "success",



      session_id:

        "{CHECKOUT_SESSION_ID}",



      academy:

        academyId,

    });



  if (programmeId) {

    query.set(

      "programme",

      programmeId,

    );

  }



  if (studentId) {

    query.set(

      "studentId",

      studentId,

    );

  }



  return (

    `/academies/financial-literacy/start?` +

    query

      .toString()

      .replace(

        "%7BCHECKOUT_SESSION_ID%7D",

        "{CHECKOUT_SESSION_ID}",

      )

  );

}



function buildCancelPath({

  academyId,

  programmeId,

  studentId,

}: {

  academyId: string;

  programmeId: string | null;

  studentId: string | null;

}) {

  const query =

    new URLSearchParams({

      purchase:

        "cancelled",



      academy:

        academyId,

    });



  if (programmeId) {

    query.set(

      "programme",

      programmeId,

    );

  }



  if (studentId) {

    query.set(

      "studentId",

      studentId,

    );

  }



  return (

    `/academies/financial-literacy/start?` +

    query.toString()

  );

}



function canonicalAcademyCode(

  academyId: string | null,

) {

  if (!academyId) {

    return "personal-finance";

  }



  const normalised =

    academyId

      .trim()

      .toLowerCase();



  if (

    normalised === "wealth" ||

    normalised ===

      "financial-literacy"

  ) {

    return "personal-finance";

  }



  return normalised;

}



function defaultProgrammeId(

  academyId: string | null,

) {

  switch (academyId) {

    case "personal-finance":

      return "money-foundation";



    default:

      return null;

  }

}



function normalisedAppUrl() {

  return appUrl!.replace(

    /\/$/,

    "",

  );

}