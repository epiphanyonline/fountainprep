import { notFound } from "next/navigation";

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
  }>;
};

export default async function AcademyPage({
  params,
  searchParams,
}: AcademyPageProps) {
  const { academyId } = await params;
  const { studentId } = await searchParams;

  if (!isNonLanguageAcademyId(academyId)) {
    notFound();
  }

  return (
    <AcademyClassroom
      academyId={academyId}
      studentId={studentId ?? null}
    />
  );
}