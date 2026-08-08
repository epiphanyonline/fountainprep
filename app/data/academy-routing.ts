export type AcademyRouteConfig = {
  slug: string;
  academyCode: string;
  programmeId: string;
};

const academyAliases: Record<string, AcademyRouteConfig> = {
  "financial-literacy": {
    slug: "financial-literacy",
    academyCode: "personal-finance",
    programmeId: "money-foundation",
  },
  "personal-finance": {
    slug: "financial-literacy",
    academyCode: "personal-finance",
    programmeId: "money-foundation",
  },
  wealth: {
    slug: "financial-literacy",
    academyCode: "personal-finance",
    programmeId: "money-foundation",
  },
  coding: {
    slug: "coding",
    academyCode: "coding",
    programmeId: "coding-explorer",
  },
  ai: {
    slug: "ai",
    academyCode: "ai",
    programmeId: "ai-explorer",
  },
  biography: {
    slug: "biography",
    academyCode: "biography",
    programmeId: "greatness-foundation",
  },
  bible: {
    slug: "bible",
    academyCode: "bible",
    programmeId: "bible-foundation",
  },
  ielts: {
    slug: "ielts",
    academyCode: "ielts",
    programmeId: "ielts-academic",
  },
  "data-analytics": {
    slug: "data-analytics",
    academyCode: "data-analytics",
    programmeId: "data-analytics-foundation",
  },
  "digital-skills": {
    slug: "digital-skills",
    academyCode: "digital-skills",
    programmeId: "digital-skills-foundation",
  },
  mathematics: {
    slug: "mathematics",
    academyCode: "mathematics",
    programmeId: "mathematics-foundation",
  },
  maths: {
    slug: "mathematics",
    academyCode: "mathematics",
    programmeId: "mathematics-foundation",
  },
  english: {
    slug: "english",
    academyCode: "english",
    programmeId: "english-foundation",
  },
  science: {
    slug: "science",
    academyCode: "science",
    programmeId: "science-foundation",
  },
  language: {
    slug: "language",
    academyCode: "language",
    programmeId: "language-foundation",
  },
  yoruba: {
    slug: "language",
    academyCode: "language",
    programmeId: "language-foundation",
  },
  igbo: {
    slug: "language",
    academyCode: "language",
    programmeId: "language-foundation",
  },
  hausa: {
    slug: "language",
    academyCode: "language",
    programmeId: "language-foundation",
  },
  french: {
    slug: "language",
    academyCode: "language",
    programmeId: "language-foundation",
  },
  mandarin: {
    slug: "language",
    academyCode: "language",
    programmeId: "language-foundation",
  },
};

export function resolveAcademyRoute(
  value: string | null | undefined,
): AcademyRouteConfig | null {
  if (!value) return null;
  return academyAliases[value.trim().toLowerCase()] ?? null;
}

export function academyClassroomHref({
  studentId,
  academy,
  programme,
}: {
  studentId: string;
  academy: string;
  programme?: string | null;
}) {
  const resolved = resolveAcademyRoute(academy);
  if (!resolved) return "/academies";

  if (resolved.academyCode === "language") {
    return `/classroom?studentId=${encodeURIComponent(studentId)}`;
  }

  // Bible already has an immersive story framework in the project.
  if (resolved.academyCode === "bible") {
    return `/fountaintalk/classroom-v3/product/app/academies/bible?studentId=${encodeURIComponent(
      studentId,
    )}`;
  }

  const query = new URLSearchParams({
    studentId,
    academy: resolved.academyCode,
    programme: programme || resolved.programmeId,
  });

  return `/classroom/academy?${query.toString()}`;
}

export function academyPricingHref({
  studentId,
  academy,
  programme,
}: {
  studentId: string;
  academy: string;
  programme?: string | null;
}) {
  const resolved = resolveAcademyRoute(academy);
  if (!resolved) return "/academies";

  const query = new URLSearchParams({
    product: "academies",
    studentId,
    academy: resolved.academyCode,
    programme: programme || resolved.programmeId,
  });

  return `/pricing?${query.toString()}`;
}

export function subjectAcademyRoute(
  subjectName: string,
): AcademyRouteConfig | null {
  const key = subjectName.trim().toLowerCase();
  if (key === "music") return null;
  return resolveAcademyRoute(key);
}
