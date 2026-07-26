import { bibleAcademy } from "./academies/bible";
import { davidJourney } from "./journeys/david";

export const academies = [
  bibleAcademy,
];

export const journeys = [
  davidJourney,
];

export function getAcademy(slug: string) {
  return academies.find((academy) => academy.slug === slug);
}

export function getJourney(slug: string) {
  return journeys.find((journey) => journey.slug === slug);
}

export function getFeaturedJourneys() {
  return journeys.filter((journey) => journey.featured);
}