import type { Episode } from "./episode";
import type { Journey } from "./journey";
import type { Academy } from "./academy";

/**
 * Minimal structural types matching the current app/fountainprep/content contracts.
 * They are declared locally so the core domain does not depend on a UI feature folder.
 */
export interface LegacyAcademy {
  id: string;
  slug: string;
  title: string;
  description: string;
  colour: string;
  icon?: string;
  journeys: string[];
}

export interface LegacyJourney {
  id: string;
  academyId: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  heroImage?: string;
  estimatedHours: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  episodes: string[];
  skills: string[];
  recommendedAge?: string;
  featured?: boolean;
}

export interface LegacyEpisode {
  id: string;
  journeyId: string;
  slug: string;
  number: number;
  title: string;
  subtitle: string;
  summary: string;
  estimatedMinutes: number;
  learningObjectives: string[];
  reflectionPrompt: string;
  classroomId: string;
  nextEpisode?: string;
}

const now = (): string => new Date().toISOString();

export function academyFromLegacy(input: LegacyAcademy): Academy {
  const timestamp = now();
  return {
    id: input.id,
    slug: input.slug,
    title: input.title,
    description: input.description,
    theme: { primary: input.colour, icon: input.icon },
    settings: { ayoEnabled: true, certificateEnabled: false, communityEnabled: false },
    status: "published",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function journeyFromLegacy(input: LegacyJourney, pathwayId = `${input.academyId}-foundation`): Journey {
  const timestamp = now();
  return {
    id: input.id,
    academyId: input.academyId,
    pathwayId,
    slug: input.slug,
    title: input.title,
    tagline: input.tagline,
    description: input.description,
    heroImage: input.heroImage ? { src: input.heroImage, alt: input.title } : undefined,
    difficulty: input.difficulty.toLowerCase() as Journey["difficulty"],
    estimatedMinutes: Math.max(1, Math.round(input.estimatedHours * 60)),
    learningOutcomes: input.skills,
    skills: input.skills,
    recommendedAge: input.recommendedAge,
    order: 0,
    status: "published",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function episodeFromLegacy(
  input: LegacyEpisode,
  context: { academyId: string; pathwayId: string },
): Episode {
  const timestamp = now();
  return {
    id: input.id,
    academyId: context.academyId,
    pathwayId: context.pathwayId,
    journeyId: input.journeyId,
    slug: input.slug,
    title: input.title,
    subtitle: input.subtitle,
    description: input.summary,
    learningObjectives: input.learningObjectives,
    estimatedMinutes: Math.max(1, input.estimatedMinutes),
    difficulty: "beginner",
    order: input.number,
    sections: [
      {
        id: `${input.id}-welcome`,
        type: "welcome",
        order: 0,
        title: input.title,
        body: input.summary,
        ayoInstruction: `Welcome the learner to ${input.title}.`,
      },
      {
        id: `${input.id}-reflection`,
        type: "reflection",
        order: 1,
        prompt: input.reflectionPrompt,
      },
    ],
    activities: [],
    reflection: input.reflectionPrompt
      ? { prompt: input.reflectionPrompt, privateByDefault: true }
      : undefined,
    nextEpisodeId: input.nextEpisode,
    status: "published",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}
