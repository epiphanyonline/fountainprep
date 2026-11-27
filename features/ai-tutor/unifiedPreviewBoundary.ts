import { contextKey } from "./learningContext";
import { validateUnifiedChat } from "./unifiedConversation";

export function isUnifiedPreview(environment: string | undefined, branch: string | undefined): boolean {
  return environment === "preview" && branch === "feature/unified-ai-tutor";
}
const MAX_BYTES = 12000;
function reply(status: number, body: object): Response {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

/** Validation-only transport. Intentionally has no provider, storage or billing dependency. */
export async function handleUnifiedPreviewRequest(
  request: Request, settings: { environment?: string; branch?: string },
): Promise<Response> {
  if (!isUnifiedPreview(settings.environment, settings.branch)) return reply(404, { error: "not_found" });
  if (request.method !== "POST") return reply(405, { error: "method_not_allowed" });
  try {
    const origin = new URL(request.headers.get("origin") ?? "");
    if (origin.protocol !== "https:" || origin.origin !== new URL(request.url).origin) {
      return reply(403, { error: "origin_not_allowed" });
    }
  } catch { return reply(403, { error: "origin_not_allowed" }); }
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return reply(415, { error: "unsupported_media_type" });
  }
  const length = Number(request.headers.get("content-length") ?? "0");
  if (!Number.isSafeInteger(length) || length < 0 || length > MAX_BYTES) return reply(413, { error: "payload_too_large" });
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply(400, { error: "invalid_json" });
    const decoder = new TextDecoder("utf-8", { fatal: true });
    let size = 0, raw = "";
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > MAX_BYTES) {
          await reader.cancel().catch(() => undefined);
          return reply(413, { error: "payload_too_large" });
        }
        raw += decoder.decode(value, { stream: true });
      }
      raw += decoder.decode();
    } finally { reader.releaseLock(); }
    const input = validateUnifiedChat(JSON.parse(raw) as unknown);
    if (!input) return reply(400, { error: "invalid_chat" });
    // Do not echo learner messages or internal prompts, or simulate a model reply.
    return reply(200, { status: "validated", context: contextKey(input.context), mode: input.mode, live: false });
  } catch { return reply(400, { error: "invalid_json" }); }
}
