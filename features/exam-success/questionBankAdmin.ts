/**
 * Isolated administration domain for a scalable, reviewed question bank.
 * Pure functions only: no routes, database writes, publication or live exams.
 * Use a permission-checked server-side importer when staging exists.
 */
import type { BankQuestion } from "./weekendPaperAssembly";
import type { ExamVariant } from "./examBlueprint";

export type QuestionDraft = BankQuestion & {
  prompt: string;
  options: readonly { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
  sourceReference: string;
  authorId: string;
  revision: number;
};
export type ImportProblem = {
  row: number;
  code: "invalid" | "duplicate_id" | "duplicate_content" | "duplicate_group";
  message: string;
};
export type ImportReport = {
  accepted: QuestionDraft[];
  rejected: ImportProblem[];
  received: number;
};

/** Normalisation catches exact and formatting-only duplicates, not paraphrases. */
export function fingerprintQuestion(input: Pick<QuestionDraft, "prompt" | "options">): string {
  const normalise = (value: string): string =>
    value.normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim();
  return [input.prompt, ...input.options.map(o=>o.text)]
    .map(normalise).join("\u241F");
}

export function validateQuestionDraft(q: QuestionDraft): string[] {
  const problems:string[]=[];
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(q.id) ||
      !/^[A-Za-z0-9_-]{1,128}$/.test(q.canonicalGroupId)) problems.push("Missing/invalid question and canonical group IDs");
  if (!["JAMB","WAEC","NECO","IELTS"].includes(q.board) ||
      !["utme","wassce","ssce","academic","general_training"].includes(q.variant) ||
      !Number.isInteger(q.syllabusYear) || q.syllabusYear<2000) problems.push("Invalid syllabus metadata");
  const variants:Record<BankQuestion["board"],readonly ExamVariant[]>={
    JAMB:["utme"],WAEC:["wassce"],NECO:["ssce"],IELTS:["academic","general_training"],
  };
  if (!variants[q.board]?.includes(q.variant)) problems.push("Board and variant mismatch");
  if (!/^[A-Z0-9_-]{2,32}$/.test(q.subjectCode) ||
      !/^[A-Z0-9_-]{2,80}$/.test(q.topicCode)) problems.push("Subject and topic codes required");
  if (!["easy","medium","hard"].includes(q.difficulty)) problems.push("Invalid difficulty");
  if (q.prompt.trim().length<10 || q.prompt.length>10000) problems.push("Invalid prompt");
  if (!Array.isArray(q.options) || q.options.length<2 || q.options.length>10 ||
      q.options.some(o=>!o || !/^[A-Za-z0-9_-]{1,32}$/.test(o.id) ||
      !o.text?.trim()) ||
      new Set(q.options.map(o=>o.id)).size!==q.options.length ||
      new Set(q.options.map(o=>o.text.normalize("NFKC").trim().toLowerCase())).size!==q.options.length ||
      !q.options.some(o=>o.id===q.correctOptionId)) {
    problems.push("Invalid or repeated options / correct answer");
  }
  if (!q.explanation.trim() || !q.sourceReference.trim() ||
      !q.licence.trim() || !q.authorId.trim()) problems.push("Explanation, provenance, licence and author required");
  if (!Number.isSafeInteger(q.revision) || q.revision<1) problems.push("Positive revision required");
  if (q.status!=="draft") problems.push("Imports must enter academic review as drafts");
  if (q.reviewedBy!==null) problems.push("Importer cannot self-approve questions");
  return problems;
}

/** Incoming data is untrusted, capped, and cannot be published directly. */
export function stageQuestionImport(
  proposed: readonly QuestionDraft[],
  existing: readonly QuestionDraft[],
  maxBatch=500,
): ImportReport {
  if (!Number.isSafeInteger(maxBatch) || maxBatch<1 || proposed.length>maxBatch) {
    throw new Error("Batch exceeds safe import limit");
  }
  const ids=new Set(existing.map(q=>q.id));
  const fingerprints=new Set(existing.map(fingerprintQuestion));
  // Canonical groups represent a family, not an automatic duplicate rejection:
  // multiple paraphrases can belong to the same canonical group and must be
  // prevented from co-occurring in an assembled paper, not from being stored.
  const accepted:QuestionDraft[]=[];
  const rejected:ImportProblem[]=[];
  proposed.forEach((question,row)=>{
    const issues=validateQuestionDraft(question);
    const fp=fingerprintQuestion(question);
    if (issues.length) rejected.push({row:row+1,code:"invalid",message:issues.join("; ")});
    else if (ids.has(question.id)) rejected.push({row:row+1,code:"duplicate_id",message:"Question ID already imported"});
    else if (fingerprints.has(fp)) rejected.push({row:row+1,code:"duplicate_content",message:"Exact or formatting-equivalent question already exists"});
    else {
      accepted.push({...question,options:question.options.map(option=>({...option}))});
      ids.add(question.id);
      fingerprints.add(fp);
    }
  });
  return {received:proposed.length,accepted,rejected};
}

export type ReviewDecision = {
  reviewerId:string;
  decision:"approve" | "reject";
  notes:string;
};

/** Approval is separate from importing, editing, or authoring. */
export function reviewQuestion(question:QuestionDraft,decision:ReviewDecision):QuestionDraft {
  if (question.status!=="draft") throw new Error("Only draft revisions can enter review");
  if (!decision.reviewerId.trim() || decision.reviewerId===question.authorId ||
      !decision.notes.trim()) throw new Error("Independent academic review and notes required");
  if (validateQuestionDraft(question).length) throw new Error("Question validation failed");
  if (decision.decision==="approve") {
    return {...question,status:"reviewed",reviewedBy:decision.reviewerId};
  }
  if (decision.decision==="reject") return {...question,status:"retired",reviewedBy:decision.reviewerId};
  throw new Error("Invalid review decision");
}

/** Publication must be an explicit second step under an authorised admin role. */
export function publishReviewedQuestion(question:QuestionDraft,approvedBy:string):QuestionDraft {
  if (question.status!=="reviewed" || !question.reviewedBy ||
      !approvedBy.trim() || approvedBy===question.authorId) {
    throw new Error("Only independently reviewed questions may be published");
  }
  return {...question,status:"published"};
}
