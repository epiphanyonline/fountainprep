import { describe, expect, it, vi } from "vitest";
import { detectAudioType } from "./audioValidation";
import { synthesizeOrinode } from "./providers";

const wav = new Uint8Array(44);
wav.set([82,73,70,70],0);
wav.set([87,65,86,69],8);

describe("Orinode developer API", () => {
  it("preserves Yoruba diacritics and uses the documented language selector", async () => {
    const mock = vi.fn(async (_url: string | URL | Request, _init?: RequestInit) =>
      Response.json({ mode: "live", format: "wav", audio_base64: Buffer.from(wav).toString("base64") }));
    const result = await synthesizeOrinode("yoruba", "Ẹ káàárọ̀", "test-fixture", mock);
    expect(detectAudioType(result)).toBe("audio/wav");
    expect(mock.mock.calls[0][0]).toBe("https://api.maraba.ai/api/developer/v1/tts/");
    expect(JSON.parse(String(mock.mock.calls[0][1]?.body))).toEqual({ text: "Ẹ káàárọ̀", language: "yo", voice_tone: "friendly" });
  });
  it("never plays mock responses as real pronunciation", async () => {
    const mock = async () => Response.json({ mode: "test", format: "wav", audio_base64: Buffer.from(wav).toString("base64") });
    await expect(synthesizeOrinode("igbo", "Daalụ", "test-fixture", mock)).rejects.toThrow("live WAV");
  });
  it("rejects arbitrary content masquerading as audio", () => {
    expect(detectAudioType(new TextEncoder().encode("<html>not audio</html>"))).toBeNull();
  });
});
