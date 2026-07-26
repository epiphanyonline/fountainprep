import { supabase } from "@/app/lib/supabase";

type CurriculumStrandRow = {
  id: string;
  subject_id: string | null;
  stage_id: string | null;
  title: string;
  sort_order: number | null;
  created_at: string | null;
};

export type Journey = {
  id: string;
  subjectId: string | null;
  stageId: string | null;
  title: string;
  sortOrder: number;
  createdAt: string | null;
};

function mapStrandToJourney(row: CurriculumStrandRow): Journey {
  return {
    id: row.id,
    subjectId: row.subject_id,
    stageId: row.stage_id,
    title: row.title,
    sortOrder: row.sort_order ?? 0,
    createdAt: row.created_at,
  };
}

class JourneyRepository {
  async list(): Promise<Journey[]> {
    const { data, error } = await supabase
      .from("curriculum_strands")
      .select("id, subject_id, stage_id, title, sort_order, created_at")
      .order("sort_order", { ascending: true })
      .order("title", { ascending: true });

    if (error) {
      throw new Error(`Unable to retrieve journeys: ${error.message}`);
    }

    return (data as CurriculumStrandRow[]).map(mapStrandToJourney);
  }

  async findById(id: string): Promise<Journey | null> {
    const { data, error } = await supabase
      .from("curriculum_strands")
      .select("id, subject_id, stage_id, title, sort_order, created_at")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new Error(`Unable to retrieve journey: ${error.message}`);
    }

    return data ? mapStrandToJourney(data as CurriculumStrandRow) : null;
  }

  async listBySubjectId(subjectId: string): Promise<Journey[]> {
    const { data, error } = await supabase
      .from("curriculum_strands")
      .select("id, subject_id, stage_id, title, sort_order, created_at")
      .eq("subject_id", subjectId)
      .order("sort_order", { ascending: true })
      .order("title", { ascending: true });

    if (error) {
      throw new Error(
        `Unable to retrieve journeys for subject: ${error.message}`,
      );
    }

    return (data as CurriculumStrandRow[]).map(mapStrandToJourney);
  }

  async listByStageId(stageId: string): Promise<Journey[]> {
    const { data, error } = await supabase
      .from("curriculum_strands")
      .select("id, subject_id, stage_id, title, sort_order, created_at")
      .eq("stage_id", stageId)
      .order("sort_order", { ascending: true })
      .order("title", { ascending: true });

    if (error) {
      throw new Error(
        `Unable to retrieve journeys for stage: ${error.message}`,
      );
    }

    return (data as CurriculumStrandRow[]).map(mapStrandToJourney);
  }

  async listBySubjectAndStage(
    subjectId: string,
    stageId: string,
  ): Promise<Journey[]> {
    const { data, error } = await supabase
      .from("curriculum_strands")
      .select("id, subject_id, stage_id, title, sort_order, created_at")
      .eq("subject_id", subjectId)
      .eq("stage_id", stageId)
      .order("sort_order", { ascending: true })
      .order("title", { ascending: true });

    if (error) {
      throw new Error(
        `Unable to retrieve journeys for subject and stage: ${error.message}`,
      );
    }

    return (data as CurriculumStrandRow[]).map(mapStrandToJourney);
  }
}

export const journeyRepository = new JourneyRepository();