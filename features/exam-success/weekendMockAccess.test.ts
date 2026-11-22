import {describe,expect,it} from "vitest";
import {canStartPaidWeekendMock,validateWeekendEvent,type WeekendMockEvent,type MockEntitlement} from "./weekendMockAccess";
const event:WeekendMockEvent={
 id:"weekend-1",board:"JAMB",paperRevisionId:"paper-v1",
 opensAt:"2027-01-09T08:00:00Z",closesAt:"2027-01-10T22:00:00Z",
 priceMinorUnits:150000,currency:"NGN",status:"open",
};
const entitlement:MockEntitlement={
 eventId:"weekend-1",learnerUserId:"learner-1",
 source:"verified_payment",status:"active",
};
const eligible=(changes:Partial<Parameters<typeof canStartPaidWeekendMock>[0]>={})=>
 canStartPaidWeekendMock({event,entitlement,verifiedLearnerUserId:"learner-1",
 serverNow:"2027-01-09T12:00:00Z",...changes});
describe("paid weekend mock access contract",()=>{
 it("allows only active verified entitlements inside the open window",()=>{
  expect(eligible()).toBe(true);
  expect(eligible({entitlement:null})).toBe(false);
  expect(eligible({verifiedLearnerUserId:"other-learner"})).toBe(false);
  expect(eligible({entitlement:{...entitlement,eventId:"other-event"}})).toBe(false);
  expect(eligible({entitlement:{...entitlement,status:"refunded"}})).toBe(false);
  expect(eligible({entitlement:{...entitlement,status:"revoked"}})).toBe(false);
 });
 it("prevents entry before or after the event and after closure",()=>{
  expect(eligible({serverNow:"2027-01-09T07:59:59Z"})).toBe(false);
  expect(eligible({serverNow:event.closesAt})).toBe(false);
  expect(eligible({event:{...event,status:"cancelled"}})).toBe(false);
  expect(eligible({event:{...event,status:"scheduled"}})).toBe(false);
 });
 it("validates paid mock pricing and timings",()=>{
  expect(validateWeekendEvent(event)).toEqual([]);
  expect(validateWeekendEvent({...event,priceMinorUnits:1.5}).length).toBeGreaterThan(0);
  expect(validateWeekendEvent({...event,closesAt:event.opensAt}).length).toBeGreaterThan(0);
 });
});
