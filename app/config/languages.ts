export type LanguageCode =
  | "yoruba"
  | "igbo"
  | "hausa"
  | "french"
  | "mandarin";

export type LanguageConfig = {
  code: LanguageCode;
  name: string;
  nativeName: string;
  description: string;
  writingSystem: string;
  direction: "ltr" | "rtl";
  isActive: boolean;
  aiTutorAvailable: boolean;
  liveTutorAvailable: boolean;
  curriculumAvailable: boolean;
};

export const LANGUAGES: LanguageConfig[] = [
  {
    code: "yoruba",
    name: "Yoruba",
    nativeName: "Èdè Yorùbá",
    description:
      "Learn practical Yoruba speaking, listening, pronunciation and cultural communication.",
    writingSystem: "Latin",
    direction: "ltr",
    isActive: true,
    aiTutorAvailable: true,
    liveTutorAvailable: true,
    curriculumAvailable: true,
  },
  {
    code: "igbo",
    name: "Igbo",
    nativeName: "Asụsụ Igbo",
    description:
      "Build confidence speaking and understanding Igbo in family and everyday situations.",
    writingSystem: "Latin",
    direction: "ltr",
    isActive: true,
    aiTutorAvailable: false,
    liveTutorAvailable: true,
    curriculumAvailable: false,
  },
  {
    code: "hausa",
    name: "Hausa",
    nativeName: "Harshen Hausa",
    description:
      "Develop practical Hausa vocabulary, pronunciation and everyday conversation.",
    writingSystem: "Latin",
    direction: "ltr",
    isActive: true,
    aiTutorAvailable: false,
    liveTutorAvailable: true,
    curriculumAvailable: false,
  },
  {
  code: "french",
  name: "French",
  nativeName: "Français",
  description:
    "Build practical French speaking, listening, vocabulary and conversation skills.",
  writingSystem: "Latin",
  direction: "ltr",
  isActive: true,
  aiTutorAvailable: false,
  liveTutorAvailable: true,
  curriculumAvailable: false,
},
  {
    code: "mandarin",
    name: "Mandarin",
    nativeName: "普通话",
    description:
      "Learn Mandarin tones, practical vocabulary, listening and everyday conversation.",
    writingSystem: "Simplified Chinese",
    direction: "ltr",
    isActive: true,
    aiTutorAvailable: false,
    liveTutorAvailable: true,
    curriculumAvailable: false,
  },
];

export const LANGUAGE_CODES = LANGUAGES.map((language) => language.code);

export const LANGUAGE_NAMES = LANGUAGES.map((language) =>
  language.name.toLowerCase(),
);

export function getLanguage(value: string | null | undefined) {
  if (!value) return null;

  const normalised = value.trim().toLowerCase();

  return (
    LANGUAGES.find(
      (language) =>
        language.code === normalised ||
        language.name.toLowerCase() === normalised,
    ) ?? null
  );
}

export function isLanguageProgramme(value: string | null | undefined) {
  if (!value) return false;

  return LANGUAGE_NAMES.includes(value.trim().toLowerCase());
}