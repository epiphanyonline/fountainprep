import {describe,expect,it} from "vitest";
import {buildNigeriaWeekendSchedule} from "./weekendSchedule";
describe("Nigeria weekend mock calendar proposals",()=>{
 it("creates distinct Saturday-to-Sunday proposals, never active events",()=>{
   const events=buildNigeriaWeekendSchedule({
     firstSaturday:"2027-01-09",weeks:4,board:"JAMB",paperRevisionId:"jamb-2027-v1",
     currency:"NGN",priceMinorUnits:100000,
   });
   expect(events).toHaveLength(4);
   expect(events[0].opensAt).toBe("2027-01-09T07:00:00.000Z");
   expect(events[0].closesAt).toBe("2027-01-10T23:00:00.000Z");
   expect(events[3].opensAt).toBe("2027-01-30T07:00:00.000Z");
   expect(new Set(events.map(e=>e.id)).size).toBe(4);
   expect(events.every(e=>e.status==="draft" && e.requiresAcademicApproval && e.requiresPaymentActivation)).toBe(true);
 });
 it("rejects malformed or non-Saturday dates and excessive schedules",()=>{
   const base={
     firstSaturday:"2027-01-09",weeks:1,board:"JAMB" as const,
     paperRevisionId:"jamb-2027-v1",currency:"NGN" as const,priceMinorUnits:100000,
   };
   expect(()=>buildNigeriaWeekendSchedule({...base,firstSaturday:"2027-01-10"})).toThrow();
   expect(()=>buildNigeriaWeekendSchedule({...base,firstSaturday:"2027-02-30"})).toThrow();
   expect(()=>buildNigeriaWeekendSchedule({...base,weeks:53})).toThrow();
   expect(()=>buildNigeriaWeekendSchedule({...base,priceMinorUnits:-1})).toThrow();
 });
});
