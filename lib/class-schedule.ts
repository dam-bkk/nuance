export const CLASS_DATES = new Set([
  // May 2026
  "2026-05-06", "2026-05-07",
  "2026-05-12", "2026-05-14",
  "2026-05-19", "2026-05-21",
  "2026-05-26", "2026-05-28",
  // June 2026
  "2026-06-03",
  "2026-06-09", "2026-06-11",
  "2026-06-16", "2026-06-18",
  "2026-06-23", "2026-06-25",
  "2026-06-30",
  // July 2026
  "2026-07-02",
  "2026-07-07", "2026-07-09",
  "2026-07-14", "2026-07-16",
  "2026-07-21", "2026-07-23",
]);

export function isClassDay(year: number, month: number, day: number): boolean {
  const key = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return CLASS_DATES.has(key);
}
