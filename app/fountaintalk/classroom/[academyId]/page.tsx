import {
  notFound,
} from "next/navigation";

import {
  isNonLanguageAcademyId,
} from "../../data/academyRegistry";

import AcademyClassroom from "./AcademyClassroom";

type AcademyPageProps = {
  params: Promise<{
    academyId: string;
  }>;

  searchParams: Promise<{
    studentId?: string;
    guest?: string;
  }>;
};

export default async function AcademyPage({
  params,
  searchParams,
}: AcademyPageProps) {
  const {
    academyId,
  } = await params;

  const {
    studentId,
    guest,
  } = await searchParams;

  if (
    !isNonLanguageAcademyId(
      academyId,
    )
  ) {
    notFound();
  }

  /*
   * guest=1 explicitly opens the
   * complimentary Foundation experience
   * without requiring a learner account.
   *
   * Example:
   *
   * /fountaintalk/classroom/wealth?guest=1
   */
  const isGuest =
    guest === "1";

  /*
   * A guest deliberately has no
   * studentId.
   *
   * Signed-in learners continue using
   * their real studentId exactly as
   * before.
   */
  const resolvedStudentId =
    isGuest
      ? null
      : studentId ?? null;

  return (
    <AcademyClassroom
      academyId={
        academyId
      }
      studentId={
        resolvedStudentId
      }
      guestMode={
        isGuest
      }
    />
  );
}