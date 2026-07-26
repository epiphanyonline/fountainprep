import { supabase } from "@/app/lib/supabase";

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

function mapCurriculumToAcademy(row: CurriculumRow): Academy {
  return {
    id: row.id,
    name: row.name,
    country: row.country,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

class AcademyRepository {
  async getAll(): Promise<Academy[]> {
    const { data, error } = await supabase
      .from("curricula")
      .select("id, name, country, is_active, created_at, updated_at")
      .order("name", { ascending: true });

    if (error) {
      throw new Error(`Unable to retrieve academies: ${error.message}`);
    }

    return (data as CurriculumRow[]).map(mapCurriculumToAcademy);
  }

  async getActive(): Promise<Academy[]> {
    const { data, error } = await supabase
      .from("curricula")
      .select("id, name, country, is_active, created_at, updated_at")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error) {
      throw new Error(`Unable to retrieve active academies: ${error.message}`);
    }

    return (data as CurriculumRow[]).map(mapCurriculumToAcademy);
  }

  async getById(id: string): Promise<Academy | null> {
    const { data, error } = await supabase
      .from("curricula")
      .select("id, name, country, is_active, created_at, updated_at")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new Error(`Unable to retrieve academy: ${error.message}`);
    }

    return data ? mapCurriculumToAcademy(data as CurriculumRow) : null;
  }

  async getByName(name: string): Promise<Academy | null> {
    const { data, error } = await supabase
      .from("curricula")
      .select("id, name, country, is_active, created_at, updated_at")
      .ilike("name", name)
      .maybeSingle();

    if (error) {
      throw new Error(`Unable to retrieve academy: ${error.message}`);
    }

    return data ? mapCurriculumToAcademy(data as CurriculumRow) : null;
  }
}

export const academyRepository = new AcademyRepository();