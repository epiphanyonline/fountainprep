import { BaseRepository } from "./base.repository";

type CurriculumModuleRow = {
  id: string;
  strand_id: string | null;
  title: string;
  description: string | null;
  sort_order: number | null;
  created_at: string | null;
};

export type EpisodeCollection = {
  id: string;
  journeyId: string | null;
  title: string;
  description: string | null;
  sortOrder: number;
  createdAt: string | null;
};

class EpisodeCollectionRepository extends BaseRepository<
  CurriculumModuleRow,
  EpisodeCollection
> {
  protected readonly tableName = "curriculum_modules";

  protected mapRow(row: CurriculumModuleRow): EpisodeCollection {
    return {
      id: row.id,
      journeyId: row.strand_id,
      title: row.title,
      description: row.description,
      sortOrder: row.sort_order ?? 0,
      createdAt: row.created_at,
    };
  }

  async list(): Promise<EpisodeCollection[]> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select(
        "id, strand_id, title, description, sort_order, created_at",
      )
      .order("sort_order", { ascending: true })
      .order("title", { ascending: true });

    this.throwIfError(error, "Retrieve episode collections");

    return this.mapRows(data as CurriculumModuleRow[] | null);
  }

  async findById(id: string): Promise<EpisodeCollection | null> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select(
        "id, strand_id, title, description, sort_order, created_at",
      )
      .eq("id", id)
      .maybeSingle();

    this.throwIfError(error, "Retrieve episode collection");

    return data
      ? this.mapRow(data as CurriculumModuleRow)
      : null;
  }

  async listByJourneyId(
    journeyId: string,
  ): Promise<EpisodeCollection[]> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select(
        "id, strand_id, title, description, sort_order, created_at",
      )
      .eq("strand_id", journeyId)
      .order("sort_order", { ascending: true })
      .order("title", { ascending: true });

    this.throwIfError(
      error,
      "Retrieve episode collections for journey",
    );

    return this.mapRows(data as CurriculumModuleRow[] | null);
  }
}

export const episodeCollectionRepository =
  new EpisodeCollectionRepository();