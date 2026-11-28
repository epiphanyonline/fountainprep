import { createClient } from "@supabase/supabase-js";

export class SpeechAccessError extends Error {
  constructor(message: string, readonly status: number) { super(message); }
}

function listed(value: string | undefined, id: string) {
  return (value ?? "").split(",").map(s => s.trim()).includes(id);
}

export async function speechAccess(request: Request, reviewer = false) {
  if (process.env.FOUNTAINTALK_MULTILINGUAL_SPEECH !== "true")
    throw new SpeechAccessError("Speech pilot is disabled.", 404);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const token = request.headers.get("authorization")?.match(/^Bearer (.+)$/i)?.[1];
  if (!token) throw new SpeechAccessError("Authentication required.", 401);
  if (!url || !anon || !serviceKey) throw new SpeechAccessError("Pilot authentication is unavailable.", 503);
  const opts = { auth: { persistSession: false, autoRefreshToken: false } };
  const auth = createClient(url, anon, opts);
  const { data, error } = await auth.auth.getUser(token);
  if (error || !data.user) throw new SpeechAccessError("Invalid session.", 401);
  if (!listed(process.env.FOUNTAINTALK_SPEECH_PILOT_USERS, data.user.id))
    throw new SpeechAccessError("This account is not enrolled in the speech pilot.", 403);
  if (reviewer && !listed(process.env.FOUNTAINTALK_SPEECH_REVIEWERS, data.user.id))
    throw new SpeechAccessError("Pronunciation reviewer access required.", 403);
  return { userId: data.user.id, db: createClient(url, serviceKey, opts) };
}
