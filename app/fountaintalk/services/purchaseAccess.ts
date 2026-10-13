import { supabase } from "@/app/lib/supabase";

export async function hasAcademyPurchaseAccess(
  academyId: string,
  studentId: string | null,
): Promise<boolean> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw authError;
  }

  if (!user) {
    return false;
  }

  const academyCodes =
    academyId === "wealth"
      ? [
          "personal-finance",
          "financial-literacy",
          "wealth",
        ]
      : [academyId];

  let query = supabase
    .from("academy_purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "paid")
    .in("academy_code", academyCodes);

  if (studentId) {
  query = query.eq(
    "student_id",
    studentId,
  );
} else {
  query = query.is(
    "student_id",
    null,
  );
}

  const {
    data,
    error,
  } = await query.limit(1);

  if (error) {
    throw error;
  }

  return Boolean(
    data && data.length > 0,
  );
}