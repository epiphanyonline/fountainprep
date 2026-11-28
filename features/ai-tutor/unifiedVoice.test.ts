import {describe,it,expect} from "vitest";
import {voicePlan,validateRecording,voicePreviewAllowed} from "./unifiedVoice";
describe("shared voice foundation",()=>{
 it("routes educational explanations to English and languages to specialist profiles",()=>{
  expect(voicePlan({kind:"general",subject:"financial-literacy"})).toMatchObject({locale:"en-GB",provider:"azure"});
  expect(voicePlan({kind:"language",language:"yoruba",level:"foundation"})).toMatchObject({provider:"orinode",locale:"yo-NG"});
  expect(voicePlan({kind:"language",language:"mandarin",level:"foundation"})).toMatchObject({provider:"azure",locale:"zh-CN"});
  expect(voicePlan({kind:"unknown"})).toBeNull();
 });
 it("bounds recording metadata",()=>{
  expect(validateRecording("audio/webm;codecs=opus",10000,20)).toBe(true);
  expect(validateRecording("audio/webm",10000,31)).toBe(false);
  expect(validateRecording("audio/webm",2000001,20)).toBe(false);
  expect(validateRecording("text/html",10000,20)).toBe(false);
 });
 it("requires all independent gates",()=>{
  const active={environment:"preview",branch:"feature/unified-ai-tutor",enabled:true,accessVerified:true,budgetApproved:true};
  expect(voicePreviewAllowed(active)).toBe(true);
  for(const patch of [{environment:"production"},{branch:"main"},{enabled:false},{accessVerified:false},{budgetApproved:false}])expect(voicePreviewAllowed({...active,...patch})).toBe(false);
 });
});
