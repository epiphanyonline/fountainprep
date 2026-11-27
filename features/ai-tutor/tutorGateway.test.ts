import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {getEligibleTutorModel,queryTutorGateway} from "./tutorGateway";

const originalFetch=globalThis.fetch;
beforeEach(()=>{
  vi.stubEnv("VERCEL_ENV","preview");
  vi.stubEnv("VERCEL_GIT_COMMIT_REF","feature/personal-ai-exam-tutor");
  vi.stubEnv("VERCEL_OIDC_TOKEN","test-oidc-token");
  vi.stubEnv("AI_GATEWAY_API_KEY","test-key-that-must-never-be-used");
});
afterEach(()=>{
  globalThis.fetch=originalFetch;
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("preview AI Gateway budget attribution and free model availability",()=>{
  it("blocks use outside the one approved branch",async()=>{
    vi.stubEnv("VERCEL_GIT_COMMIT_REF","main");
    const fetch=vi.fn();
    globalThis.fetch=fetch as typeof globalThis.fetch;
    await expect(getEligibleTutorModel()).rejects.toThrow("Preview branch not permitted");
    expect(fetch).not.toHaveBeenCalled();
  });
  it("requires project-specific OIDC rather than an API key",async()=>{
    vi.stubEnv("VERCEL_OIDC_TOKEN","");
    const fetch=vi.fn();
    globalThis.fetch=fetch as typeof globalThis.fetch;
    await expect(getEligibleTutorModel()).rejects.toThrow("Missing project-scoped");
    expect(fetch).not.toHaveBeenCalled();
  });
  it("checks eligibility before generation and always uses the OIDC token",async()=>{
    const fetch=vi.fn(async(input:RequestInfo|URL,init?:RequestInit)=>{
      if(String(input).includes("include_availability"))return new Response(JSON.stringify({
        data:[{id:"openai/gpt-4.1-mini",model_eligibility:{status:"eligible"}}],
      }),{status:200});
      return new Response(JSON.stringify({
        choices:[{message:{content:"Let's review a percentage together."}}],
      }),{status:200});
    });
    globalThis.fetch=fetch as typeof globalThis.fetch;
    expect(await queryTutorGateway("Teach percentages",[{role:"user",content:"Explain percentages"}]))
      .toContain("percentage");
    expect(fetch).toHaveBeenCalledTimes(2);
    for(const [,settings] of fetch.mock.calls){
      expect(settings?.headers).toMatchObject({Authorization:"Bearer test-oidc-token"});
    }
    const payload=JSON.parse(String(fetch.mock.calls[1][1]?.body));
    expect(payload.model).toBe("openai/gpt-4.1-mini");
    expect(payload.max_completion_tokens).toBe(520);
    expect(JSON.stringify(payload)).not.toContain("test-key-that-must-never-be-used");
  });
});
