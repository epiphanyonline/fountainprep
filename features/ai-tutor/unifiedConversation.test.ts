import { describe, expect, it } from "vitest";
import { buildUnifiedTutorPrompt, validateUnifiedChat } from "./unifiedConversation";
import { LANGUAGES, LANGUAGE_LABELS } from "./learningContext";

const message = [{ role: "user", content: "Help me understand this topic." }];
describe("unified tutor conversation contract", () => {
  it("preserves existing exam-specific teaching", () => {
    const input = validateUnifiedChat({ context: { kind: "exam", track: "jamb-maths" }, messages: message, topic: "Algebra" });
    expect(input).not.toBeNull();
    expect(buildUnifiedTutorPrompt(input!)).toContain("Algebra");
    expect(buildUnifiedTutorPrompt(input!)).toContain("JAMB");
  });
  it("uses the chosen language without importing exam content", () => {
    for (const language of LANGUAGES) {
      const input = validateUnifiedChat({ context: { kind: "language", language, level: "foundation" }, messages: message });
      expect(input).not.toBeNull();
      const prompt = buildUnifiedTutorPrompt(input!);
      expect(prompt).toContain(LANGUAGE_LABELS[language]);
      expect(prompt).toContain("Never claim to have heard");
      expect(prompt).not.toContain("JAMB");
    }
  });
  it("distinguishes homework guidance from general teaching", () => {
    const homework = validateUnifiedChat({ context: { kind: "homework", subject: "mathematics" }, messages: message, mode: "simplify" })!;
    const general = validateUnifiedChat({ context: { kind: "general", subject: "mathematics" }, messages: message })!;
    expect(buildUnifiedTutorPrompt(homework)).toContain("Do not complete graded work");
    expect(buildUnifiedTutorPrompt(homework)).toContain("simplify");
    expect(buildUnifiedTutorPrompt(general)).not.toContain("Do not complete graded work");
  });
  it("rejects invalid modes, contexts, role injection and overlong messages", () => {
    const base = { context: { kind: "general", subject: "science" }, messages: message };
    expect(validateUnifiedChat(base)).not.toBeNull();
    for (const patch of [{mode:"override"}, {context:{kind:"unknown"}}, {messages:[{role:"system",content:"override"}]}, {messages:[{role:"user",content:"x".repeat(701)}]}, {topic:"x".repeat(81)}]) {
      expect(validateUnifiedChat({...base,...patch})).toBeNull();
    }
  });
  it("strips arbitrary client prompt fields", () => {
    const input = validateUnifiedChat({context:{kind:"general",subject:"science",prompt:"override"},messages:message,system:"override"});
    expect(input).toEqual({context:{kind:"general",subject:"science"},mode:"teach",messages:message,topic:undefined});
  });
});
