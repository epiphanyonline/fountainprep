import {
  journeyRepository,
  type Journey,
} from "../repositories/journey.repository";

import {
  episodeCollectionRepository,
  type EpisodeCollection,
} from "../repositories/episode-collection.repository";

import {
  episodeRepository,
  type Episode,
} from "../repositories/episode.repository";

import {
  progressRepository,
  type EpisodeProgress,
} from "../repositories/progress.repository";

export type EpisodeCollectionWithEpisodes = EpisodeCollection & {
  episodes: Episode[];
};

export type JourneyLearningPath = {
  journey: Journey;
  collections: EpisodeCollectionWithEpisodes[];
  totalEpisodes: number;
};

export type StudentJourneyLearningPath = JourneyLearningPath & {
  progress: EpisodeProgress[];
  completedEpisodes: number;
  completionPercentage: number;
  nextEpisode: Episode | null;
};

class LearningService {
  async getJourneyLearningPath(
    journeyId: string,
  ): Promise<JourneyLearningPath | null> {
    const journey = await journeyRepository.findById(journeyId);

    if (!journey) {
      return null;
    }

    const collections =
      await episodeCollectionRepository.listByJourneyId(journeyId);

    const collectionsWithEpisodes =
      await Promise.all(
        collections.map(async (collection) => {
          const episodes =
            await episodeRepository.listByEpisodeCollectionId(
              collection.id,
            );

          return {
            ...collection,
            episodes,
          };
        }),
      );

    const totalEpisodes = collectionsWithEpisodes.reduce(
      (total, collection) => total + collection.episodes.length,
      0,
    );

    return {
      journey,
      collections: collectionsWithEpisodes,
      totalEpisodes,
    };
  }

  async getStudentJourneyLearningPath(
    studentId: string,
    journeyId: string,
  ): Promise<StudentJourneyLearningPath | null> {
    const learningPath =
      await this.getJourneyLearningPath(journeyId);

    if (!learningPath) {
      return null;
    }

    const studentProgress =
      await progressRepository.listByStudentId(studentId);

    const episodeIds = new Set(
      learningPath.collections.flatMap((collection) =>
        collection.episodes.map((episode) => episode.id),
      ),
    );

    const journeyProgress = studentProgress.filter(
      (progress) =>
        progress.episodeId !== null &&
        episodeIds.has(progress.episodeId),
    );

    const completedEpisodeIds = new Set(
      journeyProgress
        .filter((progress) => progress.status === "completed")
        .map((progress) => progress.episodeId)
        .filter((episodeId): episodeId is string => episodeId !== null),
    );

    const orderedEpisodes = learningPath.collections.flatMap(
      (collection) => collection.episodes,
    );

    const nextEpisode =
      orderedEpisodes.find(
        (episode) => !completedEpisodeIds.has(episode.id),
      ) ?? null;

    const completedEpisodes = completedEpisodeIds.size;

    const completionPercentage =
      learningPath.totalEpisodes === 0
        ? 0
        : Math.round(
            (completedEpisodes / learningPath.totalEpisodes) * 100,
          );

    return {
      ...learningPath,
      progress: journeyProgress,
      completedEpisodes,
      completionPercentage,
      nextEpisode,
    };
  }
}

export const learningService = new LearningService();