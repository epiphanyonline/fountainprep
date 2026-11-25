/**
 * Server-only Vercel AI Gateway client.
 *
 * No external call is made unless both preview feature flags are enabled.
 * Preview also requires an AI Gateway spending cap to be approved separately.
 * Do not log requests, model responses or gateway credentials.
 */
import type { TutorChatMessage } from "./conversationBoundary";

const MODEL = "openai/gpt-5-mini"; // verified against Vercel model catalog, Nov 2026

export async function queryTutorGateway(
  systemPrompt: string,
  messages: readonly TutorChatMessage[],
): Promise<string> {
  const secret = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN;
  if (!secret) throw new Error("Gateway access is not configured");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const response = await fetch("https://ai-gateway.vercel.sh/v1/chat/completions", {
      method: "POST",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${secret}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map(m => ({ role: m.role, content: m.content })),
        ],
        max_completion_tokens: 520,
        stream: false,
      }),
    });
    if (!response.ok) throw new Error("Gateway response unavailable");
    const data: unknown = await response.json();
    if (!data || typeof data !== "object" || !("choices" in data) ||
        !Array.isArray(data.choices)) throw new Error("Unexpected gateway response");
    const first: unknown = data.choices[0];
    if (!first || typeof first !== "object" || !("message" in first)) {
      throw new Error("No gateway message");
    }
    const msg: unknown = first.message;
    if (!msg || typeof msg !== "object" || !("content" in msg) ||
        typeof msg.content !== "string" || !msg.content.trim()) {
      throw new Error("No gateway text");
    }
    return msg.content;
  } finally {
    clearTimeout(timeout);
  }
}
