import { notFound } from "next/navigation";

import {
  isNonLanguageAcademyId,
} from "../../data/academyRegistry";

import ClassroomV2 from "./ClassroomV2";

type PageProps = {
  params: Promise<{
    academyId: string;
  }>;
};

export default async function ClassroomV2Page({
  params,
}: PageProps) {
  const { academyId } = await params;

  if (!isNonLanguageAcademyId(academyId)) {
    notFound();
  }

  return <ClassroomV2 academyId={academyId} />;
}
