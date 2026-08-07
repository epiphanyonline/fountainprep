export type AcademyCode =
  | "academic"
  | "language"
  | "digital-skills"
  | "exam-preparation"
  | "creative";

export type DeliveryMode = "LIVE" | "AI" | "SELF_PACED" | "HYBRID";

export type AcademyConfig = {
  code: AcademyCode;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  isActive: boolean;
};

export const ACADEMIES: AcademyConfig[] = [
  {
    code: "academic",
    name: "Academic Academy",
    shortName: "Academic",
    description:
      "Structured school support in core subjects, matched to the learner's educational stage.",
    icon: "📚",
    isActive: true,
  },
  {
    code: "language",
    name: "Language Academy",
    shortName: "Language",
    description:
      "Learn languages through conversation, culture, pronunciation and practical communication.",
    icon: "🌍",
    isActive: true,
  },
  {
    code: "digital-skills",
    name: "Digital Skills Academy",
    shortName: "Digital Skills",
    description:
      "Build practical technology, coding, data and artificial intelligence skills.",
    icon: "💻",
    isActive: true,
  },
  {
    code: "exam-preparation",
    name: "Exam Preparation Academy",
    shortName: "Exam Preparation",
    description:
      "Structured preparation for recognised academic and professional examinations.",
    icon: "🎯",
    isActive: true,
  },
  {
    code: "creative",
    name: "Creative Academy",
    shortName: "Creative",
    description:
      "Develop creativity, expression, performance and confidence.",
    icon: "🎨",
    isActive: true,
  },
];

export function getAcademy(code: string | null | undefined) {
  if (!code) return null;

  const normalised = code.trim().toLowerCase();

  return (
    ACADEMIES.find(
      (academy) =>
        academy.code === normalised ||
        academy.shortName.toLowerCase() === normalised ||
        academy.name.toLowerCase() === normalised,
    ) ?? null
  );
}

export function getAcademyName(code: string | null | undefined) {
  return getAcademy(code)?.name ?? code ?? "Learning Academy";
}