/**
 * Editorial source and rights checks for the Exam Success question bank.
 * This is a content-intake policy, not evidence that permission was obtained.
 * An authorised administrator must independently verify licence evidence.
 */
export type QuestionProvenance =
  | {
      kind: "licensed_past_paper";
      examinationYear: number;
      paperReference: string;
      rightsHolder: string;
      permissionEvidenceId: string;
      commercialDigitalReusePermitted: boolean;
    }
  | {
      kind: "original_exam_style" | "original_syllabus";
      syllabusReference: string;
      independentlyAuthored: boolean;
    };

export function validateQuestionProvenance(
  provenance: QuestionProvenance | null | undefined,
): string[] {
  if (!provenance) return ["Question origin and usage rights are required"];

  if (provenance.kind === "licensed_past_paper") {
    const problems: string[] = [];
    if (!Number.isInteger(provenance.examinationYear) ||
        provenance.examinationYear < 1990 ||
        provenance.examinationYear > new Date().getUTCFullYear()) {
      problems.push("Past paper must have a verifiable exam year");
    }
    if (!provenance.paperReference?.trim() ||
        !provenance.rightsHolder?.trim() ||
        !provenance.permissionEvidenceId?.trim()) {
      problems.push("Rights holder, paper reference, and licence evidence are required");
    }
    if (provenance.commercialDigitalReusePermitted !== true) {
      problems.push("Past paper is not cleared for paid digital reuse");
    }
    return problems;
  }
  if (provenance.kind === "original_exam_style" ||
      provenance.kind === "original_syllabus") {
    const problems: string[] = [];
    if (!provenance.syllabusReference?.trim()) {
      problems.push("A syllabus reference is required");
    }
    if (provenance.independentlyAuthored !== true) {
      problems.push("Original question requires independent authorship attestation");
    }
    return problems;
  }
  return ["Unknown question origin"];
}
