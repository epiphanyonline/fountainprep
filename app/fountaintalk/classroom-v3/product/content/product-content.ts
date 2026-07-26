export type JourneyEpisode = {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  durationMinutes: number;
  status: "available" | "coming-soon";
};

export const davidEpisodes: JourneyEpisode[] = [
  { id: "the-shepherd", number: 1, title: "The Shepherd", subtitle: "Preparation in private", description: "Before the crown, David learns responsibility, attention and courage where nobody is applauding.", durationMinutes: 18, status: "available" },
  { id: "the-calling", number: 2, title: "The Calling", subtitle: "Seen beyond appearances", description: "Samuel arrives in Bethlehem, and an overlooked son is called from the fields.", durationMinutes: 16, status: "available" },
  { id: "the-palace", number: 3, title: "The Palace", subtitle: "Leadership through service", description: "David enters the royal court as a musician and learns to serve before he leads.", durationMinutes: 17, status: "available" },
  { id: "the-valley", number: 4, title: "The Valley", subtitle: "Courage before victory", description: "Two armies wait in fear while a shepherd arrives carrying a different way of seeing the threat.", durationMinutes: 22, status: "available" },
  { id: "the-fugitive", number: 5, title: "The Fugitive", subtitle: "Character under pressure", description: "Promise and danger collide as David learns restraint, loyalty and patience.", durationMinutes: 20, status: "coming-soon" },
  { id: "legacy", number: 6, title: "Legacy", subtitle: "What remains", description: "A life of courage, failure, repentance and worship leaves lessons larger than a throne.", durationMinutes: 21, status: "coming-soon" },
];

export const bibleJourneys = [
  { id: "david", title: "David", theme: "Courage begins long before victory", progress: 34, available: true },
  { id: "joseph", title: "Joseph", theme: "Purpose can survive the pit", progress: 0, available: false },
  { id: "esther", title: "Esther", theme: "Courage for such a time as this", progress: 0, available: false },
  { id: "daniel", title: "Daniel", theme: "Conviction in a changing world", progress: 0, available: false },
  { id: "moses", title: "Moses", theme: "Called before feeling ready", progress: 0, available: false },
];
