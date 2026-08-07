import type {
  AcademyLesson,
  LessonActivity,
} from "@/features/academy-content";

export type AcademyProgressStatus =
  | "not_started"
  | "in_progress"
  | "completed";

export type AcademyProgressRow = {
  id: string;
  student_id: string;
  academy_code: string;
  programme_id: string;
  course_id: string;
  unit_id: string;
  lesson_id: string;
  status: AcademyProgressStatus;
  current_activity_index: number;
  points_earned: number;
  score: number | null;
  started_at: string | null;
  completed_at: string | null;
  last_studied_at: string;
};

export type UniversalClassroomState = {
  lesson: AcademyLesson;
  activity: LessonActivity;
  activityIndex: number;
  totalActivities: number;
  lessonIndex: number;
  totalLessons: number;
  lessonPercent: number;
  coursePercent: number;
  points: number;
  streak: number;
  completedLessonIds: string[];
};
