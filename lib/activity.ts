const KEY = "nuance-activity";

interface ActivityStore { dates: string[] }

function load(): ActivityStore {
  if (typeof window === "undefined") return { dates: [] };
  try { return JSON.parse(localStorage.getItem(KEY) ?? "{}") as ActivityStore; }
  catch { return { dates: [] }; }
}

function save(s: ActivityStore) {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(s));
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function recordPractice() {
  const s = load();
  if (!s.dates) s.dates = [];
  const t = today();
  if (!s.dates.includes(t)) { s.dates.push(t); save(s); }
}

export function getActivityDates(): string[] {
  return load().dates ?? [];
}

export function getMonthActivity(year: number, month: number): Set<number> {
  const prefix = `${year}-${String(month).padStart(2, "0")}`;
  const dates = getActivityDates();
  const days = new Set<number>();
  for (const d of dates) {
    if (d.startsWith(prefix)) days.add(Number(d.slice(8, 10)));
  }
  return days;
}
