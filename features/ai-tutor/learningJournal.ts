/**
 * AI Tutor — privacy-minimal topic journal for the DEVELOPMENT PREVIEW.
 *
 * This is NOT a gradebook or a measure of exam readiness. A completed chat
 * response proves only that a topic was explored, not that it was learned.
 * No raw messages, personal identifiers, answers or sensitive profile data
 * belong in this model. Production learner memory requires authenticated
 * identity, consent and separately tested server-side persistence.
 */
import { TUTOR_TRACKS, type TutorTrackId } from "./pilotEngine";

export type JournalActivity = "explored" | "practice_requested" | "help_requested";
export type JournalEntry = {
  track: TutorTrackId;
  topic: string;
  visits: number;
  practiceRequests: number;
  helpRequests: number;
  lastActivityAt: string;
  reviewSuggestedAt: string;
};
export type LearningJournal = { version: 1; topics: JournalEntry[] };
export type JournalEvent = {
  track: TutorTrackId;
  topic: string;
  activity: JournalActivity;
  occurredAt: string;
};

const MAX_TOPICS = 24;
const REVIEW_AFTER_MS = 24 * 60 * 60 * 1000;
export const emptyLearningJournal = (): LearningJournal => ({ version: 1, topics: [] });

const isTrack = (track: unknown): track is TutorTrackId =>
  typeof track === "string" && Object.prototype.hasOwnProperty.call(TUTOR_TRACKS, track);
const isDate = (value: unknown): value is string =>
  typeof value === "string" && Number.isFinite(Date.parse(value)) &&
  new Date(value).toISOString() === value;
const isCount = (value: unknown): value is number =>
  Number.isSafeInteger(value) && (value as number) >= 0 && (value as number) <= 10_000;
const isTopic = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length >= 2 &&
  value.trim().length <= 80 && !/[\r\n\x00-\x1f]/.test(value);

export function parseLearningJournal(input: unknown): LearningJournal | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const value = input as Partial<LearningJournal>;
  if (value.version !== 1 || !Array.isArray(value.topics) ||
      value.topics.length > MAX_TOPICS) return null;
  const topics: JournalEntry[] = [];
  const seen = new Set<string>();
  for (const row of value.topics) {
    if (!row || typeof row !== "object" || !isTrack(row.track) ||
        !isTopic(row.topic) || !isCount(row.visits) || row.visits < 1 ||
        !isCount(row.practiceRequests) || !isCount(row.helpRequests) ||
        row.practiceRequests + row.helpRequests > row.visits ||
        !isDate(row.lastActivityAt) || !isDate(row.reviewSuggestedAt)) return null;
    const identity = row.track + ":" + row.topic.trim().toLowerCase();
    if (seen.has(identity)) return null;
    seen.add(identity);
    topics.push({
      track: row.track, topic: row.topic.trim(), visits: row.visits,
      practiceRequests: row.practiceRequests, helpRequests: row.helpRequests,
      lastActivityAt: row.lastActivityAt, reviewSuggestedAt: row.reviewSuggestedAt,
    });
  }
  return { version: 1, topics };
}

/**
 * Call only after an actual successful AI response; retries/errors never
 * count as learning activity. No objective correctness is inferred here.
 */
export function recordJournalActivity(
  journal: LearningJournal, event: JournalEvent,
): LearningJournal {
  if (!isTrack(event.track) || !isTopic(event.topic) ||
      !["explored", "practice_requested", "help_requested"].includes(event.activity) ||
      !isDate(event.occurredAt)) throw new Error("Invalid learning event");
  const base = parseLearningJournal(journal);
  if (!base) throw new Error("Invalid learning journal");

  const topic = event.topic.trim();
  const exists = base.topics.find(row => row.track === event.track &&
    row.topic.toLowerCase() === topic.toLowerCase());
  const at = Date.parse(event.occurredAt);
  const reviewSuggestedAt = new Date(at + REVIEW_AFTER_MS).toISOString();
  if (exists && (exists.visits >= 10_000 || at <= Date.parse(exists.lastActivityAt))) {
    return base; // old/out-of-order event: never roll back progress
  }
  const updated: JournalEntry = exists ? {
    ...exists, visits: Math.min(10_000, exists.visits + 1),
    practiceRequests: Math.min(10_000, exists.practiceRequests +
      (event.activity === "practice_requested" ? 1 : 0)),
    helpRequests: Math.min(10_000, exists.helpRequests +
      (event.activity === "help_requested" ? 1 : 0)),
    lastActivityAt: event.occurredAt, reviewSuggestedAt,
  } : {
    track: event.track, topic, visits: 1,
    practiceRequests: event.activity === "practice_requested" ? 1 : 0,
    helpRequests: event.activity === "help_requested" ? 1 : 0,
    lastActivityAt: event.occurredAt, reviewSuggestedAt,
  };
  return { version: 1, topics: [updated,
    ...base.topics.filter(row => row !== exists)].slice(0, MAX_TOPICS) };
}

/** Due dates are invitations to practise, not evidence of mastery. */
export function selectReviewTopics(
  journal: LearningJournal, nowIso: string, max = 3,
): JournalEntry[] {
  if (!isDate(nowIso) || !Number.isSafeInteger(max) || max < 1 || max > 10) {
    throw new Error("Invalid review selection");
  }
  return journal.topics
    .filter(entry => Date.parse(entry.reviewSuggestedAt) <= Date.parse(nowIso))
    .sort((a, b) => b.helpRequests - a.helpRequests ||
      Date.parse(a.reviewSuggestedAt) - Date.parse(b.reviewSuggestedAt))
    .slice(0, max);
}
