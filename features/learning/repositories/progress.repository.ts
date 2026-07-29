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

export type StudentAchievement = {
  id: string;
  studentId: string;
  episodeId: string;
  achievementType: string;
  title: string;
  description: string | null;
  pointsAwarded: number;
  earnedAt: string;
};

export type SaveLessonAchievementInput = {
  studentId: string;
  episodeId: string;
  title: string;
  description?: string | null;
  pointsAwarded: number;
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

   async saveEpisodeProgress(
  input: SaveEpisodeProgressInput,
): Promise<EpisodeProgress> {
  const { data, error } = await this.client.rpc(
    "save_student_episode_progress",
    {
      p_student_id: input.studentId,
      p_lesson_id: input.episodeId,
      p_status: input.status,
      p_current_step_index:
        input.currentStepIndex ?? 0,
      p_tutor_id: input.tutorId ?? null,
      p_notes: input.notes ?? null,
      p_homework: input.homework ?? null,
    },
  );

  this.throwIfError(
    error,
    "Save student episode progress",
  );

  return this.mapRow(
    data as StudentCurriculumProgressRow,
  );
}

async saveLessonAchievement(
  input: SaveLessonAchievementInput,
): Promise<StudentAchievement> {
  const achievementType =
    "lesson_completion";

  const selectColumns = `
    id,
    student_id,
    episode_id,
    achievement_type,
    title,
    description,
    points_awarded,
    earned_at
  `;

  const { data, error } = await this.client
    .from("student_achievements")
    .insert({
      student_id: input.studentId,
      episode_id: input.episodeId,
      achievement_type: achievementType,
      title: input.title,
      description:
        input.description ?? null,
      points_awarded:
        input.pointsAwarded,
    })
    .select(selectColumns)
    .single();

  if (error?.code === "23505") {
    const {
      data: existingAchievement,
      error: existingError,
    } = await this.client
      .from("student_achievements")
      .select(selectColumns)
      .eq(
        "student_id",
        input.studentId,
      )
      .eq(
        "episode_id",
        input.episodeId,
      )
      .eq(
        "achievement_type",
        achievementType,
      )
      .maybeSingle();

    this.throwIfError(
      existingError,
      "Retrieve existing lesson achievement",
    );

    if (!existingAchievement) {
      throw new Error(
        "The lesson achievement already exists but could not be retrieved.",
      );
    }

    return {
      id: existingAchievement.id,
      studentId:
        existingAchievement.student_id,
      episodeId:
        existingAchievement.episode_id,
      achievementType:
        existingAchievement.achievement_type,
      title: existingAchievement.title,
      description:
        existingAchievement.description,
      pointsAwarded:
        existingAchievement.points_awarded,
      earnedAt:
        existingAchievement.earned_at,
    };
  }

  this.throwIfError(
    error,
    "Save lesson achievement",
  );

  if (!data) {
    throw new Error(
      "The lesson achievement was saved but no record was returned.",
    );
  }

  return {
    id: data.id,
    studentId: data.student_id,
    episodeId: data.episode_id,
    achievementType:
      data.achievement_type,
    title: data.title,
    description: data.description,
    pointsAwarded:
      data.points_awarded,
    earnedAt: data.earned_at,
  };
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