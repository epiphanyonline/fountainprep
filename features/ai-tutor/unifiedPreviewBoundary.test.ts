import { describe, expect, it, vi } from "vitest";
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

describe("unified live provider gates", () => {
  const active = { ...settings, enabled: true, budgetApproved: true, accessVerified: true };
  it("never calls the provider unless all gates pass", async () => {
    const provider = vi.fn(async () => "Example");
    for (const patch of [{enabled:false},{budgetApproved:false},{accessVerified:false},{branch:"main"},{environment:"production"}]) {
      await handleUnifiedPreviewRequest(request(), {...active,...patch}, provider);
    }
    expect(provider).not.toHaveBeenCalled();
  });
  it("routes the selected language and history to the provider", async () => {
    const provider = vi.fn(async (_prompt:string, _messages:readonly unknown[]) => "Hola means hello.");
    const messages = [...body.messages,{role:"assistant",content:"Hola."},{role:"user",content:"What does it mean?"}];
    const result = await handleUnifiedPreviewRequest(request({...body,messages}), active, provider);
    expect(await result.json()).toMatchObject({status:"answered",live:true,response:"Hola means hello."});
    expect(provider.mock.calls[0][0]).toContain("Spanish");
    expect(provider.mock.calls[0][1]).toEqual(messages);
  });
  it("sanitises provider failures and rejects malformed requests before generation", async () => {
    const provider = vi.fn(async () => {throw new Error("private provider detail");});
    const invalid = await handleUnifiedPreviewRequest(request({...body,mode:"invalid"}),active,provider);
    expect(invalid.status).toBe(400);
    expect(provider).not.toHaveBeenCalled();
    const failed = await handleUnifiedPreviewRequest(request(),active,provider);
    expect(failed.status).toBe(502);
    expect(await failed.text()).not.toContain("private provider detail");
  });
});
