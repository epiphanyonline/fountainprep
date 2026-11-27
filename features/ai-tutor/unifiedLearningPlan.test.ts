import {describe,it,expect} from "vitest";
import {buildLearningPlan} from "./unifiedLearningPlan";
import {emptyMemory,recordMemory} from "./unifiedLearnerMemory";
import {gradePractice} from "./unifiedAssessment";
const finance={kind:"general",subject:"financial-literacy"} as const;
const science={kind:"general",subject:"science"} as const;
const now="2026-11-28T10:00:00.000Z";
describe("learning plans",()=>{
 it("prioritises incorrect answers over unchecked topics",()=>{
  const evidence=[gradePractice(finance,"fl-3","b")!.evidence];
  const plan=buildLearningPlan(finance,evidence,emptyMemory(),now);
  expect(plan[0]).toMatchObject({kind:"review",topic:"Inflation and purchasing power",mode:"simplify"});
  expect(plan[1].kind).toBe("check");
  expect(plan.length).toBeLessThanOrEqual(3);
 });
 it("offers fresh practice after correct answers without claiming mastery",()=>{
  const evidence=[gradePractice(finance,"fl-1","b")!.evidence,gradePractice(finance,"fl-2","c")!.evidence,gradePractice(finance,"fl-3","a")!.evidence];
  expect(buildLearningPlan(finance,evidence,emptyMemory(),now)[0].kind).toBe("extend");
  expect(buildLearningPlan(science,evidence,emptyMemory(),now)[0].kind).toBe("explore");
 });
 it("offers activity-based revision for unsupported subjects",()=>{
  const memory=recordMemory(emptyMemory(),science,"teach","2026-11-27T10:00:00.000Z");
  expect(buildLearningPlan(science,[],memory,now)[0].kind).toBe("review");
 });
});