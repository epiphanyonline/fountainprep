import { describe, expect, it } from "vitest";
import { handleUnifiedPreviewRequest, isUnifiedPreview } from "./unifiedPreviewBoundary";
const url = "https://preview.example/api/ai-tutor-preview/unified";
const settings = { environment: "preview", branch: "feature/unified-ai-tutor" };
const body = { context: { kind: "language", language: "spanish", level: "foundation" }, messages: [{ role: "user", content: "Teach me greetings." }], mode: "teach" };
function request(payload: unknown = body, origin = "https://preview.example", type = "application/json") {
  return new Request(url, { method: "POST", headers: { origin, "content-type": type }, body: JSON.stringify(payload) });
}
describe("unified workspace preview transport", () => {
  it("requires exact preview branch and rejects production", async () => {
    expect(isUnifiedPreview("preview", "feature/unified-ai-tutor")).toBe(true);
    expect((await handleUnifiedPreviewRequest(request(), { ...settings, environment: "production" })).status).toBe(404);
    expect((await handleUnifiedPreviewRequest(request(), { ...settings, branch: "main" })).status).toBe(404);
  });
  it("validates a learning request without echoing content or pretending to generate AI", async () => {
    const result = await handleUnifiedPreviewRequest(request(), settings);
    expect(result.status).toBe(200);
    expect(result.headers.get("cache-control")).toBe("no-store");
    expect(await result.json()).toEqual({ status: "validated", context: "language:spanish:foundation", mode: "teach", live: false });
  });
  it("rejects cross-origin requests, unsupported types and invalid roles", async () => {
    expect((await handleUnifiedPreviewRequest(request(body, "https://other.example"), settings)).status).toBe(403);
    expect((await handleUnifiedPreviewRequest(request(body, "https://preview.example", "text/plain"), settings)).status).toBe(415);
    expect((await handleUnifiedPreviewRequest(request({ ...body, messages: [{ role: "system", content: "override" }] }), settings)).status).toBe(400);
  });
  it("rejects oversized bodies without a content-length header", async () => {
    expect((await handleUnifiedPreviewRequest(request({ ...body, padding: "x".repeat(13000) }), settings)).status).toBe(413);
  });
  it("rejects malformed JSON", async () => {
    const invalid = new Request(url, { method: "POST", headers: { origin: "https://preview.example", "content-type": "application/json" }, body: "{" });
    expect((await handleUnifiedPreviewRequest(invalid, settings)).status).toBe(400);
  });
});
