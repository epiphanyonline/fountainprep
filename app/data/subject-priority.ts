export const subjectPriority = [
  "Financial Literacy",
  "Coding",
  "Yoruba",
  "Igbo",
  "Hausa",
  "French",
  "Mandarin",
  "Artificial Intelligence",
  "Science",
  "Digital Skills",
  "Mathematics",
  "Maths",
  "English",
  "Music",
] as const;

export function subjectPriorityRank(name: string) {
  const rank = subjectPriority.findIndex(
    (item) => item.toLowerCase() === name.toLowerCase(),
  );

  return rank === -1 ? 999 : rank;
}
