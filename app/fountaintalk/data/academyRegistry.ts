import type {
  AcademyDefinition,
  AcademyId,
  NonLanguageAcademyId,
} from "../types/academy";

export const academyRegistry: AcademyDefinition[] = [
  {
    id: "languages",
    title: "Language Academy",
    shortTitle: "Languages",
    tagline:
      "Speak confidently, connect with culture and communicate across the world.",
    icon: "🌍",
    href: "/fountaintalk/tutor",
    accent: "#0f766e",
    accentDark: "#115e59",
    soft: "#ccfbf1",
    available: true,
  },
  {
    id: "mathematics",
    title: "Mathematics Academy",
    shortTitle: "Mathematics",
    tagline:
      "Understand numbers, solve problems and build confidence step by step.",
    icon: "➗",
    href: "/fountaintalk/classroom/mathematics",
    accent: "#2563eb",
    accentDark: "#1e3a8a",
    soft: "#dbeafe",
    available: true,
  },
  {
    id: "coding",
    title: "Coding Academy",
    shortTitle: "Coding",
    tagline:
      "Build logic, games, websites and real software through creative challenges.",
    icon: "💻",
    href: "/fountaintalk/classroom/coding",
    accent: "#4f46e5",
    accentDark: "#1e1b4b",
    soft: "#e0e7ff",
    available: true,
  },
  {
    id: "music",
    title: "Music Academy",
    shortTitle: "Music",
    tagline:
      "Discover beat, rhythm, melody, notation and confident musical expression.",
    icon: "🎵",
    href: "/fountaintalk/classroom/music",
    accent: "#db2777",
    accentDark: "#831843",
    soft: "#fce7f3",
    available: true,
  },
  {
    id: "wealth",
    title: "Wealth Academy",
    shortTitle: "Wealth",
    tagline:
      "Learn saving, budgeting, investing, business and lifelong money skills.",
    icon: "💰",
    href: "/fountaintalk/classroom/wealth",
    accent: "#ca8a04",
    accentDark: "#713f12",
    soft: "#fef9c3",
    available: true,
  },
  {
    id: "ethics",
    title: "Ethics & Life Skills",
    shortTitle: "Ethics",
    tagline:
      "Practise kindness, responsibility, leadership and wise decision-making.",
    icon: "⚖️",
    href: "/fountaintalk/classroom/ethics",
    accent: "#0891b2",
    accentDark: "#164e63",
    soft: "#cffafe",
    available: true,
  },
  {
    id: "bible",
    title: "Bible Academy",
    shortTitle: "Bible",
    tagline:
      "Experience timeless stories, faith and values through engaging lessons.",
    icon: "📖",
    href: "/fountaintalk/classroom/bible",
    accent: "#9333ea",
    accentDark: "#581c87",
    soft: "#f3e8ff",
    available: true,
  },
];

export function isAcademyId(value: string): value is AcademyId {
  return academyRegistry.some((academy) => academy.id === value);
}

export function isNonLanguageAcademyId(
  value: string
): value is NonLanguageAcademyId {
  return value !== "languages" && isAcademyId(value);
}

export function getAcademy(
  academyId: AcademyId
): AcademyDefinition {
  const academy = academyRegistry.find(
    (candidate) => candidate.id === academyId
  );

  if (!academy) {
    throw new Error(`Unknown academy: ${academyId}`);
  }

  return academy;
}

