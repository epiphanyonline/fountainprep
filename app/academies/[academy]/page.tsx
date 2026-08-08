import type {
  Metadata,
} from "next";
import { notFound } from "next/navigation";

import AcademyLanding from "@/app/components/academy/AcademyLanding";
import {
  getAcademyMarketing,
  publicAcademySlugs,
} from "@/app/data/academies/marketing";

type PageProps = {
  params: Promise<{
    academy: string;
  }>;
};

export function generateStaticParams() {
  return publicAcademySlugs.map((academy) => ({
    academy,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { academy: slug } = await params;
  const academy = getAcademyMarketing(slug);

  if (!academy) return {};

  return {
    title: academy.title,
    description: academy.summary,
    openGraph: {
      title: academy.headline,
      description: academy.summary,
      type: "website",
    },
  };
}

export default async function AcademyPage({
  params,
}: PageProps) {
  const { academy: slug } = await params;
  const academy = getAcademyMarketing(slug);

  if (!academy) {
    notFound();
  }

  return <AcademyLanding academy={academy} />;
}
