import { supabase } from "@/app/lib/supabase";
import type { PostgrestError } from "@supabase/supabase-js";

/**
 * Shared foundation for FountainPrep repositories.
 *
 * It provides:
 * - the existing Supabase client
 * - consistent database error handling
 * - consistent row-to-domain mapping
 *
 * Concrete repositories remain responsible for their own queries.
 */
export abstract class BaseRepository<TRow, TModel> {
  protected readonly client = supabase;

  protected abstract readonly tableName: string;

  protected abstract mapRow(row: TRow): TModel;

  protected mapRows(rows: TRow[] | null | undefined): TModel[] {
    return (rows ?? []).map((row) => this.mapRow(row));
  }

  protected throwIfError(
    error: PostgrestError | null,
    operation: string,
  ): void {
    if (!error) {
      return;
    }

    throw new Error(
      `${operation} failed for ${this.tableName}: ${error.message}`,
    );
  }
}