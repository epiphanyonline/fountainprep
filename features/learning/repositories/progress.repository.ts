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
  current_step_index: number | null;
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
  currentStepIndex: number;
  completedAt: string | null;
  tutorId: string | null;
  notes: string | null;
  homework: string | null;
  createdAt: string | null;
};

export type SaveEpisodeProgressInput = {
  studentId: string;
  episodeId: string;
  status: LearningProgressStatus;
  currentStepIndex?: number;
  tutorId?: string | null;
  notes?: string | null;
  homework?: string | null;
};

class ProgressRepository extends BaseRepository<
  StudentCurriculumProgressRow,
  EpisodeProgress
> {
  protected readonly tableName =
    "student_curriculum_progress";

  private readonly selectColumns =
    "id, student_id, lesson_id, status, current_step_index, completed_at, tutor_id, notes, homework, created_at";

  protected mapRow(
    row: StudentCurriculumProgressRow,
  ): EpisodeProgress {
    return {
      id: row.id,
      studentId: row.student_id,
      episodeId: row.lesson_id,
      status: this.mapStatus(row.status),
      currentStepIndex:
        row.current_step_index ?? 0,
      completedAt: row.completed_at,
      tutorId: row.tutor_id,
      notes: row.notes,
      homework: row.homework,
      createdAt: row.created_at,
    };
  }

  async findById(
    id: string,
  ): Promise<EpisodeProgress | null> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select(this.selectColumns)
      .eq("id", id)
      .maybeSingle();

    this.throwIfError(
      error,
      "Retrieve episode progress",
    );

    return data
      ? this.mapRow(
          data as StudentCurriculumProgressRow,
        )
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
      ? this.mapRow(
          data as StudentCurriculumProgressRow,
        )
      : null;
  }

  async listByStudentId(
    studentId: string,
  ): Promise<EpisodeProgress[]> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select(this.selectColumns)
      .eq("student_id", studentId)
      .order("created_at", {
        ascending: true,
      });

    this.throwIfError(
      error,
      "Retrieve student progress",
    );

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
      .order("created_at", {
        ascending: true,
      });

    this.throwIfError(
      error,
      "Retrieve episode progress",
    );

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
      .order("completed_at", {
        ascending: true,
      });

    this.throwIfError(
      error,
      "Retrieve completed student episodes",
    );

    return this.mapRows(
      data as StudentCurriculumProgressRow[] | null,
    );
  }

  async clearOtherInProgressEpisodes(
    studentId: string,
    episodeId: string,
  ): Promise<void> {
    const { error } = await this.client
      .from(this.tableName)
      .update({
        status: "not_started",
        current_step_index: 0,
        completed_at: null,
      })
      .eq("student_id", studentId)
      .eq("status", "in_progress")
      .neq("lesson_id", episodeId);

    this.throwIfError(
      error,
      "Clear other in-progress student episodes",
    );
  }

  async saveEpisodeProgress(
    input: SaveEpisodeProgressInput,
  ): Promise<EpisodeProgress> {
    const completedAt =
      input.status === "completed"
        ? new Date().toISOString()
        : null;

    const { data, error } = await this.client
      .from(this.tableName)
      .upsert(
        {
          student_id: input.studentId,
          lesson_id: input.episodeId,
          status: input.status,
          current_step_index:
            input.currentStepIndex ?? 0,
          completed_at: completedAt,
          tutor_id: input.tutorId ?? null,
          notes: input.notes ?? null,
          homework: input.homework ?? null,
        },
        {
          onConflict:
            "student_id,lesson_id",
        },
      )
      .select(this.selectColumns)
      .single();

    this.throwIfError(
      error,
      "Save student episode progress",
    );

    return this.mapRow(
      data as StudentCurriculumProgressRow,
    );
  }

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

export const progressRepository =
  new ProgressRepository();