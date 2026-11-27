import { describe, it, expect } from "vitest";
import { emptyLearningJournal, recordJournalActivity, parseLearningJournal, selectReviewTopics, type JournalEvent } from "./learningJournal";
const event: JournalEvent = { track:"jamb-maths", topic:"Algebra", activity:"explored", occurredAt:"2026-11-26T10:00:00.000Z" };
describe("learning journal", () => {
  it("records activity without inventing mastery", () => {
    const j=recordJournalActivity(emptyLearningJournal(),event);
    expect(j.topics[0]).toMatchObject({visits:1,practiceRequests:0,helpRequests:0,reviewSuggestedAt:"2026-11-27T10:00:00.000Z"});
    expect(parseLearningJournal(j)).toEqual(j);
    expect(selectReviewTopics(j,event.occurredAt)).toEqual([]);
    expect(selectReviewTopics(j,"2026-11-27T10:00:00.000Z")).toHaveLength(1);
  });
  it("deduplicates repeated events and normalises topic case", () => {
    const j=recordJournalActivity(emptyLearningJournal(),event);
    expect(recordJournalActivity(j,event)).toEqual(j);
    const next=recordJournalActivity(j,{...event,topic:" algebra ",activity:"help_requested",occurredAt:"2026-11-26T11:00:00.000Z"});
    expect(next.topics).toHaveLength(1);
    expect(next.topics[0]).toMatchObject({visits:2,helpRequests:1});
  });
  it("keeps subjects separate and rejects invalid data", () => {
    const j=recordJournalActivity(emptyLearningJournal(),event);
    expect(recordJournalActivity(j,{...event,track:"jamb-english"}).topics).toHaveLength(2);
    expect(parseLearningJournal({...j,version:2})).toBeNull();
    expect(parseLearningJournal({...j,topics:[j.topics[0],j.topics[0]]})).toBeNull();
    expect(()=>recordJournalActivity(j,{...event,topic:"x".repeat(81)})).toThrow();
  });
});
