import { BaseRepository } from "./base.repository";

type CurriculumStrandRow = {
  id: string;
  subject_id: string | null;
  stage_id: string | null;
  title: string;
  description: string | null;
  proficiency_code: string | null;
  proficiency_name: string | null;
  estimated_hours: number | null;
  is_active: boolean;
  sort_order: number | null;
  created_at: string | null;
};

export type Journey = {
  id: string;
  subjectId: string | null;
  stageId: string | null;
  title: string;
  description: string | null;
  proficiencyCode: string | null;
  proficiencyName: string | null;
  estimatedHours: number | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string | null;
};

class JourneyRepository extends BaseRepository<
  CurriculumStrandRow,
  Journey
> {
  protected readonly tableName = "curriculum_strands";

  private readonly selectColumns = `
    id,
    subject_id,
    stage_id,
    title,
    description,
    proficiency_code,
    proficiency_name,
    estimated_hours,
    is_active,
    sort_order,
    created_at
  `;

  protected mapRow(row: CurriculumStrandRow): Journey {
    return {
      id: row.id,
      subjectId: row.subject_id,
      stageId: row.stage_id,
      title: row.title,
      description: row.description,
      proficiencyCode: row.proficiency_code,
      proficiencyName: row.proficiency_name,
      estimatedHours: row.estimated_hours,
      isActive: row.is_active,
      sortOrder: row.sort_order ?? 0,
      createdAt: row.created_at,
    };
  }

  async list(): Promise<Journey[]> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select(this.selectColumns)
      .order("sort_order", { ascending: true })
      .order("title", { ascending: true });

    this.throwIfError(error, "Retrieve journeys");

    return this.mapRows(data as CurriculumStrandRow[] | null);
  }

  async findById(id: string): Promise<Journey | null> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select(this.selectColumns)
      .eq("id", id)
      .maybeSingle();

    this.throwIfError(error, "Retrieve journey");

    return data
      ? this.mapRow(data as CurriculumStrandRow)
      : null;
  }

  async listBySubjectId(subjectId: string): Promise<Journey[]> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select(this.selectColumns)
      .eq("subject_id", subjectId)
      .order("sort_order", { ascending: true })
      .order("title", { ascending: true });

    this.throwIfError(
      error,
      "Retrieve journeys for subject",
    );

    return this.mapRows(data as CurriculumStrandRow[] | null);
  }

  async listByStageId(stageId: string): Promise<Journey[]> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select(this.selectColumns)
      .eq("stage_id", stageId)
      .order("sort_order", { ascending: true })
      .order("title", { ascending: true });

    this.throwIfError(
      error,
      "Retrieve journeys for stage",
    );

    return this.mapRows(data as CurriculumStrandRow[] | null);
  }

  async listBySubjectAndStage(
    subjectId: string,
    stageId: string,
  ): Promise<Journey[]> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select(this.selectColumns)
      .eq("subject_id", subjectId)
      .eq("stage_id", stageId)
      .order("sort_order", { ascending: true })
      .order("title", { ascending: true });

    this.throwIfError(
      error,
      "Retrieve journeys for subject and stage",
    );

    return this.mapRows(data as CurriculumStrandRow[] | null);
  }

  async findLanguageJourney(
    subjectId: string,
    proficiencyCode: string,
  ): Promise<Journey | null> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select(this.selectColumns)
      .eq("subject_id", subjectId)
      .is("stage_id", null)
      .eq("proficiency_code", proficiencyCode)
      .eq("is_active", true)
      .maybeSingle();

    this.throwIfError(
      error,
      "Retrieve language journey",
    );

    return data
      ? this.mapRow(data as CurriculumStrandRow)
      : null;
  }
}

export const journeyRepository = new JourneyRepository();