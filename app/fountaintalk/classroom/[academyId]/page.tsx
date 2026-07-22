import { notFound } from "next/navigation";

import {
  isNonLanguageAcademyId,
} from "../../data/academyRegistry";
import AcademyClassroom from "./AcademyClassroom";

type AcademyPageProps = {
  params: Promise<{ academyId: string }>;
};

export default async function AcademyPage({ params }: AcademyPageProps) {
  const { academyId } = await params;

  if (!isNonLanguageAcademyId(academyId)) {
    notFound();
  }

  return <AcademyClassroom academyId={academyId} />;
}

