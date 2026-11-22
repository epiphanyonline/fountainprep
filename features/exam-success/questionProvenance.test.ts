import {describe,expect,it} from "vitest";
import {validateQuestionProvenance} from "./questionProvenance";

describe("question source rights validation",()=>{
  it("rejects unlicensed past paper reuse",()=>{
    expect(validateQuestionProvenance({
      kind:"licensed_past_paper",examinationYear:2023,paperReference:"past paper",
      rightsHolder:"exam board",permissionEvidenceId:"",commercialDigitalReusePermitted:false,
    }).length).toBeGreaterThan(0);
  });
  it("accepts complete licence metadata for separate manual verification",()=>{
    expect(validateQuestionProvenance({
      kind:"licensed_past_paper",examinationYear:2023,paperReference:"2023 paper 1",
      rightsHolder:"holder",permissionEvidenceId:"document-ref",
      commercialDigitalReusePermitted:true,
    })).toEqual([]);
  });
  it("rejects unauthorised derivatives and requires real syllabus mapping",()=>{
    expect(validateQuestionProvenance({
      kind:"original_exam_style",syllabusReference:"JAMB syllabus",
      independentlyAuthored:false,
    })).toContain("Original question requires independent authorship attestation");
    expect(validateQuestionProvenance({
      kind:"original_syllabus",syllabusReference:"",
      independentlyAuthored:true,
    }).length).toBeGreaterThan(0);
  });
  it("rejects missing origin",()=>{
    expect(validateQuestionProvenance(null).length).toBeGreaterThan(0);
  });
});
