import { BaseRepository } from "./base.repository";

type CurriculumLessonRow = {
  id: string;
  module_id: string | null;
  title: string;
  objective: string | null;
  homework_hint: string | null;
  sort_order: number | null;
  created_at: string | null;
};

export type Episode = {
  id: string;
  episodeCollectionId: string | null;
  title: string;
  objective: string | null;
  homeworkHint: string | null;
  sortOrder: number;
  createdAt: string | null;
};

class EpisodeRepository extends BaseRepository<
  CurriculumLessonRow,
  Episode
> {
  protected readonly tableName = "curriculum_lessons";

  protected mapRow(row: CurriculumLessonRow): Episode {
    return {
      id: row.id,
      episodeCollectionId: row.module_id,
      title: row.title,
      objective: row.objective,
      homeworkHint: row.homework_hint,
      sortOrder: row.sort_order ?? 0,
      createdAt: row.created_at,
    };
  }

  async list(): Promise<Episode[]> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select(
        "id, module_id, title, objective, homework_hint, sort_order, created_at",
      )
      .order("sort_order", { ascending: true })
      .order("title", { ascending: true });

    this.throwIfError(error, "Retrieve episodes");

    return this.mapRows(data as CurriculumLessonRow[] | null);
  }

  async findById(id: string): Promise<Episode | null> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select(
        "id, module_id, title, objective, homework_hint, sort_order, created_at",
      )
      .eq("id", id)
      .maybeSingle();

    this.throwIfError(error, "Retrieve episode");

    return data ? this.mapRow(data as CurriculumLessonRow) : null;
  }

  async listByEpisodeCollectionId(
    episodeCollectionId: string,
  ): Promise<Episode[]> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select(
        "id, module_id, title, objective, homework_hint, sort_order, created_at",
      )
      .eq("module_id", episodeCollectionId)
      .order("sort_order", { ascending: true })
      .order("title", { ascending: true });

    this.throwIfError(
      error,
      "Retrieve episodes for episode collection",
    );

    return this.mapRows(data as CurriculumLessonRow[] | null);
  }
}

export const episodeRepository = new EpisodeRepository();