import {describe,expect,it} from "vitest";
import {fingerprintQuestion,publishReviewedQuestion,reviewQuestion,stageQuestionImport,type QuestionDraft} from "./questionBankAdmin";

const draft=(id:string,changes:Partial<QuestionDraft>={}):QuestionDraft=>({
 id,canonicalGroupId:"group-"+id,board:"JAMB",variant:"utme",syllabusYear:2027,
 subjectCode:"ENG",topicCode:"GRAMMAR",difficulty:"medium",status:"draft",
 reviewedBy:null,licence:"Original authored content",sourceReference:"author notebook",
 provenance:{kind:"original_syllabus",syllabusReference:"JAMB English syllabus",independentlyAuthored:true},
 authorId:"author_1",revision:1,prompt:"Choose the correctly punctuated sentence.",
 options:[{id:"a",text:"We arrived, early."},{id:"b",text:"We arrived early."}],
 correctOptionId:"b",explanation:"No comma is required in this short clause.",
 ...changes,
});

describe("large bank intake and independent academic review",()=>{
 it("accepts a valid draft and preserves the original input",()=>{
  const first=draft("q1");
  const r=stageQuestionImport([first],[]);
  expect(r.received).toBe(1);
  expect(r.accepted).toHaveLength(1);
  expect(r.accepted[0]).not.toBe(first);
  expect(r.accepted[0].status).toBe("draft");
 });
 it("detects same ID and formatting-equivalent duplicate content",()=>{
  const existing=draft("q1");
  const same=draft("q2",{prompt:" CHOOSE the correctly punctuated sentence. "});
  const report=stageQuestionImport([draft("q1"),same],[existing]);
  expect(report.accepted).toHaveLength(0);
  expect(report.rejected.map(x=>x.code)).toEqual(["duplicate_id","duplicate_content"]);
  expect(fingerprintQuestion(existing)).toBe(fingerprintQuestion(same));
 });
 it("checks duplicate content within a single large import",()=>{
  const report=stageQuestionImport([draft("q1"),draft("q2")],[]);
  expect(report.accepted).toHaveLength(1);
  expect(report.rejected[0].code).toBe("duplicate_content");
 });
 it("allows canonical paraphrase groups in bank, with assembly excluding simultaneous reuse",()=>{
  const report=stageQuestionImport([
   draft("q1"),draft("q2",{canonicalGroupId:"group-q1",prompt:"Select the sentence with appropriate punctuation."}),
  ],[]);
  expect(report.accepted).toHaveLength(2);
 });
 it("rejects unreviewed published content, missing licensing and invalid answers",()=>{
  const report=stageQuestionImport([
   draft("q1",{status:"published",reviewedBy:"author_1"}),
   draft("q2",{licence:""}),
   draft("q3",{correctOptionId:"z"}),
   draft("q4",{variant:"academic"}),
  ],[]);
  expect(report.accepted).toHaveLength(0);
  expect(report.rejected).toHaveLength(4);
 });
 it("requires independent reviewer and explicit publishing",()=>{
  const q=draft("q1");
  expect(()=>reviewQuestion(q,{reviewerId:"author_1",decision:"approve",notes:"Checked"})).toThrow();
  expect(()=>reviewQuestion(q,{reviewerId:"reviewer_1",decision:"approve",notes:""})).toThrow();
  expect(()=>publishReviewedQuestion(q,"admin_1")).toThrow();
  const reviewed=reviewQuestion(q,{reviewerId:"reviewer_1",decision:"approve",notes:"Verified answer and licensing"});
  expect(reviewed.status).toBe("reviewed");
  expect(publishReviewedQuestion(reviewed,"admin_1").status).toBe("published");
  expect(q.status).toBe("draft");
 });
 it("blocks unlicensed past questions and unverified rewriting of others\u0027 material",()=>{\n  const prohibited=stageQuestionImport([\n   draft("copied",{provenance:{kind:"licensed_past_paper",examinationYear:2023,paperReference:"2023 exam",rightsHolder:"exam board",permissionEvidenceId:"",commercialDigitalReusePermitted:false}}),\n   draft("reworded",{provenance:{kind:"original_exam_style",syllabusReference:"JAMB syllabus",independentlyAuthored:false}}),\n  ],[]);\n  expect(prohibited.accepted).toHaveLength(0);\n  expect(prohibited.rejected).toHaveLength(2);\n });\n it("caps imports and rejects invalid batch limits",()=>{
  expect(()=>stageQuestionImport([draft("q1"),draft("q2")],[],1)).toThrow();
  expect(()=>stageQuestionImport([],[],0)).toThrow();
 });
});
