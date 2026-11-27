import {describe,it,expect} from "vitest";
import {assessmentQuestions,gradePractice,addEvidence,assessmentSummary} from "./unifiedAssessment";
const finance={kind:"general",subject:"financial-literacy"} as const;
const spanish={kind:"language",language:"spanish",level:"foundation"} as const;
describe("unified assessment evidence",()=>{
  it("grades original finance questions deterministically",()=>{
    const result=gradePractice(finance,"fl-1","b");
    expect(result?.evidence.correct).toBe(true);
    expect(gradePractice(finance,"fl-1","a")?.evidence.correct).toBe(false);
    expect(gradePractice(finance,"fl-1","unknown")).toBeNull();
    expect(gradePractice(spanish,"fl-1","b")).toBeNull();
  });
  it("keeps first attempts and context boundaries",()=>{
    const first=gradePractice(finance,"fl-1","a")!.evidence;
    const retry=gradePractice(finance,"fl-1","b")!.evidence;
    const rows=addEvidence(addEvidence([],first),retry);
    expect(assessmentSummary(finance,rows)).toEqual({available:3,attempted:1,correct:0,needsReview:1});
    expect(assessmentSummary(spanish,rows).attempted).toBe(0);
  });
  it("reuses all three existing exam tracks and does not invent unsupported scores",()=>{
    for(const track of ["jamb-maths","jamb-english","ielts-reading"] as const){
      expect(assessmentQuestions({kind:"exam",track})).toHaveLength(3);
    }
    expect(assessmentSummary({kind:"general",subject:"science"},[])).toEqual({available:0,attempted:0,correct:0,needsReview:0});
  });
});
