import { describe, expect, it } from "vitest";
import {demoRemainingSeconds,newDemoDraft,validateDemoDraft} from "./demoDraft";
const now=Date.parse("2027-02-01T10:00:00Z");
describe("browser-only demonstration draft",()=>{
 it("starts a 3-minute sample timer",()=>{
  const d=newDemoDraft("JAMB",now);
  expect(demoRemainingSeconds(d,now)).toBe(180);
  expect(demoRemainingSeconds(d,now+181000)).toBe(0);
 });
 it("restores valid sample selections",()=>{
  const d={...newDemoDraft("WAEC",now),answers:{demo_waec_1:"b"},flagged:{demo_waec_2:true}};
  expect(validateDemoDraft(d,now+1000)).toEqual(d);
 });
 it("discards malformed or far-future stored data",()=>{
  expect(validateDemoDraft({version:1,exam:"unknown"},now)).toBeNull();
  expect(validateDemoDraft({...newDemoDraft("NECO",now),expiresAt:now+90000000},now)).toBeNull();
  expect(validateDemoDraft({...newDemoDraft("IELTS",now),answers:{invalid:"a"}},now)).toBeNull();
 });
});
