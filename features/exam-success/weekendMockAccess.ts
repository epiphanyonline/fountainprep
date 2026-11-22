/**
 * Weekly paid mock event and entitlement policy.
 * Policy-only logic — does NOT charge users or grant access by itself.
 */
import type { ExamBoard } from "./objectiveScoring";

export type WeekendMockEvent = {
  id: string;
  board: ExamBoard;
  paperRevisionId: string;
  opensAt: string;
  closesAt: string;
  priceMinorUnits: number;
  currency: "NGN" | "GBP" | "USD";
  status: "draft" | "scheduled" | "open" | "closed" | "cancelled";
};
export type MockEntitlement = {
  eventId: string;
  learnerUserId: string;
  source: "verified_payment" | "admin_grant";
  status: "active" | "refunded" | "revoked";
};

export function validateWeekendEvent(event: WeekendMockEvent): string[] {
  const errors:string[]=[];
  const open=Date.parse(event.opensAt), close=Date.parse(event.closesAt);
  if (!event.id.trim() || !event.paperRevisionId.trim()) errors.push("Event and paper IDs required");
  if (!Number.isFinite(open) || !Number.isFinite(close) || close<=open) errors.push("Valid opening and closing dates required");
  if (!Number.isSafeInteger(event.priceMinorUnits) || event.priceMinorUnits<0) errors.push("Price must be a nonnegative integer in minor units");
  if (!["NGN","GBP","USD"].includes(event.currency)) errors.push("Unsupported currency");
  return errors;
}

/** A server must verify the payment webhook signature and event amount before creating entitlements. */
export function canStartPaidWeekendMock(input: {
  event: WeekendMockEvent;
  entitlement: MockEntitlement | null;
  verifiedLearnerUserId: string;
  serverNow: string;
}): boolean {
  const {event,entitlement,verifiedLearnerUserId,serverNow}=input;
  if (validateWeekendEvent(event).length || event.status !== "open") return false;
  const now=Date.parse(serverNow);
  if (!Number.isFinite(now) || now<Date.parse(event.opensAt) || now>=Date.parse(event.closesAt)) return false;
  return !!entitlement &&
    entitlement.eventId===event.id &&
    entitlement.learnerUserId===verifiedLearnerUserId &&
    entitlement.status==="active";
}
