import { describe, expect, it } from "vitest";
import { validateBlueprint, type MockPaperBlueprint } from "./examBlueprint";

const example: MockPaperBlueprint = {
  id: "mock-ng-utme-2027-v1",
  board: "JAMB",
  variant: "utme",
  countryCode: "NG",
  syllabusYear: 2027,
  version: 1,
  mode: "mock",
  totalMinutes: 120,
  sections: [
    { id: "english", subjectCode: "USE_OF_ENGLISH", questionCount: 60 },
    { id: "maths", subjectCode: "MATHEMATICS", questionCount: 40 },
    { id: "physics", subjectCode: "PHYSICS", questionCount: 40 },
    { id: "chemistry", subjectCode: "CHEMISTRY", questionCount: 40 },
  ],
  status: "draft",
  reviewedBy: null,
  contentLicence: "Original content pending academic review",
};

describe("exam blueprint", () => {
  it("accepts a valid draft", () => {
    expect(validateBlueprint(example)).toEqual([]);
  });
  it("blocks publishing without reviewer", () => {
    expect(validateBlueprint({ ...example, status: "published" })).toContain(
      "Published papers require a named academic reviewer",
    );
  });
  it("does not assume Nigerian question papers apply to other countries", () => {
    expect(validateBlueprint({ ...example, countryCode: "GH" })).toContain(
      "Non-Nigerian school examination papers require a separate approved configuration",
    );
  });
  it("distinguishes IELTS Academic from school examination boards", () => {
    expect(validateBlueprint({ ...example, board: "IELTS", variant: "utme" })).toContain(
      "Board and examination variant do not match",
    );
  });
  it("rejects duplicate sections and invalid duration", () => {
    const issues = validateBlueprint({
      ...example, totalMinutes: 0,
      sections: [example.sections[0], example.sections[0]],
    });
    expect(issues).toContain("Section IDs must be unique and non-empty");
    expect(issues).toContain("Paper duration must be a positive integer");
  });
});
