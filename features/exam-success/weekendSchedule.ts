/**
 * Preview-only recurring weekend event calendar and validation.
 * This creates PROPOSALS only. It never opens bookings or charges learners.
 */
import type { WeekendMockEvent } from "./weekendMockAccess";
import {validateWeekendEvent} from "./weekendMockAccess";

export type WeekendEventDraft = WeekendMockEvent & {
  requiresAcademicApproval: true;
  requiresPaymentActivation: true;
};

const DAY = 86_400_000;
const YMD = /^\d{4}-\d{2}-\d{2}$/;

/** Saturday and Sunday in the selected IANA-local time zone is handled later.
 * This first Nigeria-only prototype uses WAT (UTC+01) with no DST.
 */
export function buildNigeriaWeekendSchedule(input: {
  firstSaturday: string;
  weeks: number;
  board: WeekendMockEvent["board"];
  paperRevisionId: string;
  priceMinorUnits: number;
  currency: WeekendMockEvent["currency"];
}): WeekendEventDraft[] {
  if (!YMD.test(input.firstSaturday) ||
      !Number.isSafeInteger(input.weeks) || input.weeks<1 || input.weeks>52) {
    throw new Error("Invalid weekend calendar");
  }
  const start = Date.parse(input.firstSaturday+"T00:00:00Z");
  if (!Number.isFinite(start) || new Date(start).toISOString().slice(0,10)!==input.firstSaturday ||
      new Date(start).getUTCDay()!==6) {
    throw new Error("First event date must be a valid Saturday");
  }
  if (!input.paperRevisionId.trim()) throw new Error("An immutable paper revision is required");
  return Array.from({length:input.weeks},(_,index)=>{
    const sat = start+index*7*DAY;
    // Opens Saturday 08:00 WAT (07:00 UTC), closes Monday 00:00 WAT
    // (Sunday 23:00 UTC): this is an explicit illustrative policy.
    const event:WeekendEventDraft={
      id:`proposal-${input.board}-${new Date(sat).toISOString().slice(0,10)}`,
      board:input.board,
      paperRevisionId:input.paperRevisionId,
      opensAt:new Date(sat+7*60*60*1000).toISOString(),
      closesAt:new Date(sat+2*DAY-60*60*1000).toISOString(),
      priceMinorUnits:input.priceMinorUnits,currency:input.currency,
      status:"draft",requiresAcademicApproval:true,requiresPaymentActivation:true,
    };
    if (validateWeekendEvent(event).length) throw new Error("Invalid proposed event");
    return event;
  });
}
