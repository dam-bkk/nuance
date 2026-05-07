const KEY = "nuance-progress";

export type ExerciseId = "flashcards" | "qcm" | "defmot" | "synonyme" | "glisser" | "trous";
export const EXERCISE_IDS: ExerciseId[] = ["flashcards", "qcm", "defmot", "synonyme", "glisser", "trous"];

interface Store { sessions: Record<string, ExerciseId[]> }

function load(): Store {
  if (typeof window === "undefined") return { sessions: {} };
  try { return JSON.parse(localStorage.getItem(KEY) ?? "{}") as Store; }
  catch { return { sessions: {} }; }
}

function save(s: Store) {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(s));
}

export function markDone(sessionNum: number, id: ExerciseId) {
  const s = load();
  if (!s.sessions) s.sessions = {};
  const k = String(sessionNum);
  if (!s.sessions[k]) s.sessions[k] = [];
  if (!s.sessions[k].includes(id)) { s.sessions[k].push(id); save(s); }
}

export function getAllPct(): Record<number, number> {
  const s = load();
  const out: Record<number, number> = {};
  for (const [k, done] of Object.entries(s.sessions ?? {})) {
    out[Number(k)] = Math.round((done.length / EXERCISE_IDS.length) * 100);
  }
  return out;
}
