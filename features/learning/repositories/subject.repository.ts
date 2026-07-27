import { BaseRepository } from "./base.repository";

type CurriculumSubjectRow = {
  id: string;
  name: string;
  active: boolean | null;
  created_at: string | null;
};

export type LearningSubject = {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string | null;
};

class SubjectRepository extends BaseRepository<
  CurriculumSubjectRow,
  LearningSubject
> {
  protected readonly tableName = "curriculum_subjects";

  protected mapRow(row: CurriculumSubjectRow): LearningSubject {
    return {
      id: row.id,
      name: row.name,
      isActive: row.active ?? true,
      createdAt: row.created_at,
    };
  }

  async list(): Promise<LearningSubject[]> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select("id, name, active, created_at")
      .order("name", { ascending: true });

    this.throwIfError(error, "Retrieve learning subjects");

    return this.mapRows(data as CurriculumSubjectRow[] | null);
  }

  async listActive(): Promise<LearningSubject[]> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select("id, name, active, created_at")
      .eq("active", true)
      .order("name", { ascending: true });

    this.throwIfError(error, "Retrieve active learning subjects");

    return this.mapRows(data as CurriculumSubjectRow[] | null);
  }

  async findById(id: string): Promise<LearningSubject | null> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select("id, name, active, created_at")
      .eq("id", id)
      .maybeSingle();

    this.throwIfError(error, "Retrieve learning subject");

    return data
      ? this.mapRow(data as CurriculumSubjectRow)
      : null;
  }

  async findByName(name: string): Promise<LearningSubject | null> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select("id, name, active, created_at")
      .ilike("name", name)
      .maybeSingle();

    this.throwIfError(error, "Retrieve learning subject by name");

    return data
      ? this.mapRow(data as CurriculumSubjectRow)
      : null;
  }
}

export const subjectRepository = new SubjectRepository();