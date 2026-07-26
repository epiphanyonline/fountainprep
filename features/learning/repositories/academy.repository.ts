import { BaseRepository } from "./base.repository";

type CurriculumRow = {
  id: string;
  name: string;
  country: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Academy = {
  id: string;
  name: string;
  country: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

class AcademyRepository extends BaseRepository<CurriculumRow, Academy> {
  protected readonly tableName = "curricula";

  protected mapRow(row: CurriculumRow): Academy {
    return {
      id: row.id,
      name: row.name,
      country: row.country,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async getAll(): Promise<Academy[]> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select("id, name, country, is_active, created_at, updated_at")
      .order("name", { ascending: true });

    this.throwIfError(error, "Retrieve academies");

    return this.mapRows(data as CurriculumRow[] | null);
  }

  async getActive(): Promise<Academy[]> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select("id, name, country, is_active, created_at, updated_at")
      .eq("is_active", true)
      .order("name", { ascending: true });

    this.throwIfError(error, "Retrieve active academies");

    return this.mapRows(data as CurriculumRow[] | null);
  }

  async getById(id: string): Promise<Academy | null> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select("id, name, country, is_active, created_at, updated_at")
      .eq("id", id)
      .maybeSingle();

    this.throwIfError(error, "Retrieve academy");

    return data ? this.mapRow(data as CurriculumRow) : null;
  }

  async getByName(name: string): Promise<Academy | null> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select("id, name, country, is_active, created_at, updated_at")
      .ilike("name", name)
      .maybeSingle();

    this.throwIfError(error, "Retrieve academy by name");

    return data ? this.mapRow(data as CurriculumRow) : null;
  }
}

export const academyRepository = new AcademyRepository();