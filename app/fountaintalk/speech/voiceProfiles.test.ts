import { describe, expect, it } from "vitest";
import { escapeXml, isSpeechLanguage, makeSsml, normalisePhrase, splitTargetPhrase, voiceProfiles } from "./voiceProfiles";
import { findPronunciationOverride, type PronunciationOverride } from "./pronunciationOverrides";

describe("multilingual speech routing", () => {
  it("routes all six languages to specialist providers", () => {
    expect(Object.keys(voiceProfiles)).toHaveLength(6);
    for (const language of ["yoruba", "igbo", "hausa"] as const) expect(voiceProfiles[language].provider).toBe("orinode");
    for (const language of ["mandarin", "spanish", "french"] as const) expect(voiceProfiles[language].provider).toBe("azure");
    expect(isSpeechLanguage("english")).toBe(false);
    expect(isSpeechLanguage("__proto__")).toBe(false);
    expect(isSpeechLanguage(null)).toBe(false);
  });
  it("preserves tonal distinctions and canonical equivalence", () => {
    expect(normalisePhrase("Owó")).not.toBe(normalisePhrase("Owo"));
    expect(normalisePhrase("mā")).not.toBe(normalisePhrase("mǎ"));
    expect(normalisePhrase("e\u0301")).toBe("é");
  });
  it("escapes user text in SSML", () => {
    expect(escapeXml('<&"\'>')).toBe("&lt;&amp;&quot;&apos;&gt;");
    expect(makeSsml("zh-CN", "zh-CN-XiaoxiaoNeural", "你好 & 谢谢")).toContain("你好 &amp; 谢谢");
  });
  it("isolates the target from English narration", () => {
    expect(splitTargetPhrase("Hello is 你好. Listen carefully.", "你好")).toEqual({ before: "Hello is", phrase: "你好", after: ". Listen carefully." });
    expect(splitTargetPhrase("How are you?", "你好")).toBeNull();
  });
  it("only accepts exact, language-specific reviewed audio overrides", () => {
    const entries: PronunciationOverride[] = [{ language: "yoruba", phrase: "Owó", normalAudio: "/audio/yoruba/money.mp3", reviewReference: "Tutor review 1" }];
    expect(findPronunciationOverride("yoruba", "Owo", entries)).toBeUndefined();
    expect(findPronunciationOverride("igbo", "Owó", entries)).toBeUndefined();
    expect(findPronunciationOverride("yoruba", "Owó", entries)?.normalAudio).toBe("/audio/yoruba/money.mp3");
    expect(findPronunciationOverride("yoruba", "Owó", [{ ...entries[0], reviewReference: "" }])).toBeUndefined();
  });
});
