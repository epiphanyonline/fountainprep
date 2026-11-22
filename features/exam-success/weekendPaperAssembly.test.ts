import {describe,expect,it} from "vitest";
import {assembleWeekendPaper,InsufficientQuestionBank,type BankQuestion} from "./weekendPaperAssembly";
import type {MockPaperBlueprint} from "./examBlueprint";

const blueprint:MockPaperBlueprint={
  id:"weekend-2027-01",board:"JAMB",variant:"utme",countryCode:"NG",
  syllabusYear:2027,version:1,mode:"mock",totalMinutes:30,
  sections:[{id:"use-of-english",subjectCode:"ENG",questionCount:3},
            {id:"mathematics",subjectCode:"MATH",questionCount:2}],
  status:"published",reviewedBy:"academic-reviewer",contentLicence:"original",
};
const question=(id:string,subjectCode:string,extras:Partial<BankQuestion>={}):BankQuestion=>({
  id,canonicalGroupId:id,board:"JAMB",variant:"utme",syllabusYear:2027,
  subjectCode,topicCode:"TOPIC",difficulty:"medium",status:"published",
  reviewedBy:"reviewer",licence:"original",...extras,
});
const bank:BankQuestion[]=[
 ...Array.from({length:15},(_,i)=>question("eng-"+i,"ENG")),
 ...Array.from({length:10},(_,i)=>question("math-"+i,"MATH")),
];
describe("reviewed weekend mock paper remixing",()=>{
 it("creates complete sections with no repeated questions",()=>{
  const result=assembleWeekendPaper({blueprint,bank,seed:"week-1"});
  expect(result.questionIdsBySection.map(s=>s.questionIds.length)).toEqual([3,2]);
  const all=result.questionIdsBySection.flatMap(s=>s.questionIds);
  expect(new Set(all).size).toBe(5);
 });
 it("replays exact immutable paper for same seed regardless of input order",()=>{
  const a=assembleWeekendPaper({blueprint,bank,seed:"week-1"});
  const b=assembleWeekendPaper({blueprint,bank:[...bank].reverse(),seed:"week-1"});
  expect(a).toEqual(b);
 });
 it("can produce fresh compositions for different weekend seeds",()=>{
  const a=assembleWeekendPaper({blueprint,bank,seed:"week-1"});
  const b=assembleWeekendPaper({blueprint,bank,seed:"week-2"});
  expect(a.questionIdsBySection).not.toEqual(b.questionIdsBySection);
 });
 it("prioritises unused questions over recently shown ones",()=>{
  const recent=bank.slice(0,15).map(q=>q.id);
  const result=assembleWeekendPaper({blueprint,bank,seed:"week-2",recentQuestionIds:recent});
  expect(result.questionIdsBySection[0].questionIds.every(id=>!recent.includes(id))).toBe(false);
  // All English questions are marked recent; mathematics can still be fresh.
  expect(result.questionIdsBySection[1].questionIds.every(id=>!recent.includes(id))).toBe(true);
 });
 it("rejects draft, unreviewed, unlicensed and wrong-board questions",()=>{
  const notApproved=[
    question("x1","ENG",{status:"draft"}),
    question("x2","ENG",{reviewedBy:null}),
    question("x3","ENG",{licence:""}),
    question("x4","ENG",{board:"WAEC",variant:"wassce"}),
    question("x5","ENG",{syllabusYear:2026}),
  ];
  expect(()=>assembleWeekendPaper({blueprint,bank:notApproved,seed:"w"}))
    .toThrow(InsufficientQuestionBank);
 });
 it("blocks near-duplicate canonical question groups",()=>{
  const duplicates=[
    question("a","ENG",{canonicalGroupId:"same"}),
    question("b","ENG",{canonicalGroupId:"same"}),
    question("c","ENG",{canonicalGroupId:"same"}),
  ];
  expect(()=>assembleWeekendPaper({blueprint,bank:duplicates,seed:"w"}))
    .toThrow(InsufficientQuestionBank);
 });
 it("fails closed if bank cannot meet exam-specific paper requirements",()=>{
  const small=[question("x","ENG")];
  try { assembleWeekendPaper({blueprint,bank:small,seed:"week"}); }
  catch(error) {
   expect(error).toBeInstanceOf(InsufficientQuestionBank);
   expect((error as InsufficientQuestionBank).sectionId).toBe("use-of-english");
   expect((error as InsufficientQuestionBank).required).toBe(3);
   return;
  }
  throw new Error("Expected a question bank shortfall");
 });
});
