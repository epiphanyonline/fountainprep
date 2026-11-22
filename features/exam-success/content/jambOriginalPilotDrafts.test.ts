import {describe, expect, it} from "vitest";
import {JAMB_PILOT_QUESTION_DRAFTS} from "./jambOriginalPilotDrafts";
import {fingerprintQuestion,stageQuestionImport,validateQuestionDraft} from "../questionBankAdmin";
import {assembleWeekendPaper,InsufficientQuestionBank} from "../weekendPaperAssembly";
import type {MockPaperBlueprint} from "../examBlueprint";

describe("JAMB pilot content: ingestion and editorial safety",()=>{
  it("contains exactly 36 original unapproved questions, split between two subjects",()=>{
    expect(JAMB_PILOT_QUESTION_DRAFTS).toHaveLength(36);
    expect(JAMB_PILOT_QUESTION_DRAFTS.filter(q=>q.subjectCode==="ENG")).toHaveLength(18);
    expect(JAMB_PILOT_QUESTION_DRAFTS.filter(q=>q.subjectCode==="MATH")).toHaveLength(18);
    expect(JAMB_PILOT_QUESTION_DRAFTS.every(q=>
      q.board==="JAMB" && q.variant==="utme" && q.syllabusYear===2026 &&
      q.status==="draft" && q.reviewedBy===null &&
      q.provenance?.kind==="original_syllabus"
    )).toBe(true);
  });
  it("passes import validation and has unique IDs, source groups and question fingerprints",()=>{
    const questions=JAMB_PILOT_QUESTION_DRAFTS;
    expect(questions.flatMap(q=>validateQuestionDraft(q))).toEqual([]);
    expect(new Set(questions.map(q=>q.id)).size).toBe(questions.length);
    expect(new Set(questions.map(q=>q.canonicalGroupId)).size).toBe(questions.length);
    expect(new Set(questions.map(fingerprintQuestion)).size).toBe(questions.length);
    const report=stageQuestionImport(questions,[]);
    expect(report.accepted).toHaveLength(36);
    expect(report.rejected).toHaveLength(0);
    const repeat=stageQuestionImport(questions,report.accepted);
    expect(repeat.accepted).toHaveLength(0);
    expect(repeat.rejected).toHaveLength(36);
  });
  it("contains a broad mix of objective topics, with options, keys and explanations",()=>{
    for(const subject of ["ENG","MATH"]) {
      const group=JAMB_PILOT_QUESTION_DRAFTS.filter(q=>q.subjectCode===subject);
      expect(new Set(group.map(q=>q.topicCode)).size).toBeGreaterThanOrEqual(15);
      expect(group.every(q=>
        q.options.length===4 &&
        q.options.some(option=>option.id===q.correctOptionId) &&
        q.explanation.length>=30 &&
        q.prompt.length>=25
      )).toBe(true);
    }
  });
  it("cannot enter weekend mocks while drafts are unreviewed",()=>{
    const blueprint:MockPaperBlueprint={
      id:"jamb-pilot-2026-english",board:"JAMB",variant:"utme",countryCode:"NG",
      syllabusYear:2026,version:1,mode:"mock",totalMinutes:15,
      sections:[{id:"english",subjectCode:"ENG",questionCount:5}],
      status:"published",reviewedBy:"hypothetical-reviewer",contentLicence:"original",
    };
    expect(()=>assembleWeekendPaper({
      blueprint,bank:JAMB_PILOT_QUESTION_DRAFTS,seed:"synthetic-test-seed",
    })).toThrow(InsufficientQuestionBank);
  });
});
