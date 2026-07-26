export interface Academy {
  id: string;
  slug: string;
  title: string;
  description: string;
  colour: string;
  icon?: string;
  journeys: string[];
}

export interface Journey {
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

export interface Episode {
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

export interface LearnerProgress {
  learnerId: string;

  journeyId: string;

  completedEpisodes: string[];

  currentEpisode?: string;

  progress: number;

  lastVisited: string;
}