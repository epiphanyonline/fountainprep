/**
 * Preview-only Vercel AI Gateway provider.
 *
 * Only Vercel's project-scoped OIDC token is accepted: this ensures the
 * existing $5/month Fountain Prep PROJECT budget applies. API keys are
 * deliberately not accepted, as their spend does not count against it.
 * Confirm account model eligibility before spending any free credits.
 */
import type { TutorChatMessage } from "./conversationBoundary";

const GATEWAY = "https://ai-gateway.vercel.sh/v1";
const CANDIDATE_MODELS = [
  "openai/gpt-4.1-mini",
  "openai/gpt-5-mini",
  "google/gemini-2.5-flash",
] as const;
let cached: { model: string; expiresAt: number } | null = null;

function oidcToken(): string {
  const token = process.env.VERCEL_OIDC_TOKEN;
  if (!token) throw new Error("Missing project-scoped AI Gateway OIDC token");
  // Restrict the experiment to the reviewed Fountain Prep branch.
  if (process.env.VERCEL_ENV !== "preview" ||
      process.env.VERCEL_GIT_COMMIT_REF !== "feature/personal-ai-exam-tutor") {
    throw new Error("Preview branch not permitted");
  }
  return token;
}

type ModelAvailability = {
  data?: Array<{
    id?: string;
    model_eligibility?: { status?: string };
  }>;
};
function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/** GET is a no-spend availability check, not a text generation. */
export async function getEligibleTutorModel(): Promise<string> {
  const token = oidcToken();
  if (cached && Date.now() < cached.expiresAt) return cached.model;

  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 8000);
  try {
    const response = await fetch(`${GATEWAY}/models?include_availability`, {
      method: "GET", cache: "no-store", signal: ctrl.signal,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Model eligibility unavailable");
    const result: unknown = await response.json();
    if (!record(result) || !Array.isArray(result.data)) {
      throw new Error("Unexpected eligibility data");
    }
    const models = result as ModelAvailability;
    const selection = CANDIDATE_MODELS.find(candidate =>
      models.data?.some(model =>
        model.id === candidate && model.model_eligibility?.status === "eligible"
      )
    );
    if (!selection) throw new Error("No eligible low-cost preview model");
    cached = { model: selection, expiresAt: Date.now() + 60_000 };
    return selection;
  } finally { clearTimeout(timeout); }
}

export async function queryTutorGateway(
  systemPrompt: string,
  messages: readonly TutorChatMessage[],
): Promise<string> {
  const token = oidcToken();
  const model = await getEligibleTutorModel();

  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 18_000);
  try {
    const response = await fetch(`${GATEWAY}/chat/completions`, {
      method: "POST", cache: "no-store", signal: ctrl.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map(m => ({ role: m.role, content: m.content })),
        ],
        max_completion_tokens: 520,
        stream: false,
      }),
    });
    if (!response.ok) throw new Error("AI Gateway generation unavailable");
    const result: unknown = await response.json();
    if (!record(result) || !Array.isArray(result.choices)) {
      throw new Error("Unexpected gateway result");
    }
    const first: unknown = result.choices[0];
    if (!record(first) || !record(first.message) ||
        typeof first.message.content !== "string" ||
        !first.message.content.trim()) throw new Error("Missing tutor reply");
    return first.message.content;
  } finally { clearTimeout(timeout); }
}
