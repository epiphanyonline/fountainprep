import { BaseRepository } from "./base.repository";

export type LearningProgressStatus =
  | "not_started"
  | "in_progress"
  | "completed";

type StudentCurriculumProgressRow = {
  id: string;
  student_id: string;
  lesson_id: string | null;
  status: string | null;
  completed_at: string | null;
  tutor_id: string | null;
  notes: string | null;
  homework: string | null;
  created_at: string | null;
};

export type EpisodeProgress = {
  id: string;
  studentId: string;
  episodeId: string | null;
  status: LearningProgressStatus;
  completedAt: string | null;
  tutorId: string | null;
  notes: string | null;
  homework: string | null;
  createdAt: string | null;
};

class ProgressRepository extends BaseRepository<
  StudentCurriculumProgressRow,
  EpisodeProgress
> {
  protected readonly tableName = "student_curriculum_progress";

  protected mapRow(
    row: StudentCurriculumProgressRow,
  ): EpisodeProgress {
    return {
      id: row.id,
      studentId: row.student_id,
      episodeId: row.lesson_id,
      status: this.mapStatus(row.status),
      completedAt: row.completed_at,
      tutorId: row.tutor_id,
      notes: row.notes,
      homework: row.homework,
      createdAt: row.created_at,
    };
  }

  async findById(id: string): Promise<EpisodeProgress | null> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select(this.selectColumns)
      .eq("id", id)
      .maybeSingle();

    this.throwIfError(error, "Retrieve episode progress");

    return data
      ? this.mapRow(data as StudentCurriculumProgressRow)
      : null;
  }

  async findByStudentAndEpisode(
    studentId: string,
    episodeId: string,
  ): Promise<EpisodeProgress | null> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select(this.selectColumns)
      .eq("student_id", studentId)
      .eq("lesson_id", episodeId)
      .maybeSingle();

    this.throwIfError(
      error,
      "Retrieve student episode progress",
    );

    return data
      ? this.mapRow(data as StudentCurriculumProgressRow)
      : null;
  }

  async listByStudentId(
    studentId: string,
  ): Promise<EpisodeProgress[]> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select(this.selectColumns)
      .eq("student_id", studentId)
      .order("created_at", { ascending: true });

    this.throwIfError(error, "Retrieve student progress");

    return this.mapRows(
      data as StudentCurriculumProgressRow[] | null,
    );
  }

  async listByEpisodeId(
    episodeId: string,
  ): Promise<EpisodeProgress[]> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select(this.selectColumns)
      .eq("lesson_id", episodeId)
      .order("created_at", { ascending: true });

    this.throwIfError(error, "Retrieve episode progress");

    return this.mapRows(
      data as StudentCurriculumProgressRow[] | null,
    );
  }

  async listCompletedByStudentId(
    studentId: string,
  ): Promise<EpisodeProgress[]> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select(this.selectColumns)
      .eq("student_id", studentId)
      .eq("status", "completed")
      .order("completed_at", { ascending: true });

    this.throwIfError(
      error,
      "Retrieve completed student episodes",
    );

    return this.mapRows(
      data as StudentCurriculumProgressRow[] | null,
    );
  }

  private readonly selectColumns =
    "id, student_id, lesson_id, status, completed_at, tutor_id, notes, homework, created_at";

  private mapStatus(
    status: string | null,
  ): LearningProgressStatus {
    switch (status) {
      case "in_progress":
      case "completed":
        return status;
      default:
        return "not_started";
    }
  }
}

export const progressRepository = new ProgressRepository();