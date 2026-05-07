import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import fs from "fs";
import path from "path";
import Link from "next/link";
import AdminCalendar from "@/components/AdminCalendar";

const ADMIN_EMAIL = "damienfle16@gmail.com";
const STUDENT_EMAIL = "khanapolguy@gmail.com";
const FILE = path.join(process.cwd(), "data", "nuance-sync.json");
const EXERCISE_COUNT = 6;

interface UserStore {
  "nuance-progress"?: { sessions: Record<string, string[]> };
  "nuance-activity"?: { dates: string[] };
  _updated?: string;
}

function readStudentData(): UserStore {
  try {
    const raw = JSON.parse(fs.readFileSync(FILE, "utf-8"));
    return raw[STUDENT_EMAIL] ?? {};
  } catch {
    return {};
  }
}

function calcStreak(dates: string[]): number {
  let streak = 0;
  const d = new Date();
  while (true) {
    const key = d.toISOString().slice(0, 10);
    if (dates.includes(key)) { streak++; d.setDate(d.getDate() - 1); }
    else break;
  }
  return streak;
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.email !== ADMIN_EMAIL) redirect("/");

  const store = readStudentData();
  const dates = store["nuance-activity"]?.dates ?? [];
  const sessions = store["nuance-progress"]?.sessions ?? {};

  const lastActive = dates.length > 0 ? [...dates].sort().at(-1)! : null;
  const streak = calcStreak(dates);

  const sessionEntries = Object.entries(sessions)
    .map(([id, exos]) => ({
      id: Number(id),
      done: exos.length,
      pct: Math.min(100, Math.round((exos.length / EXERCISE_COUNT) * 100)),
      exos,
    }))
    .sort((a, b) => a.id - b.id);

  const completedSessions = sessionEntries.filter((s) => s.pct === 100).length;

  const lastActiveLabel = lastActive
    ? new Date(lastActive).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : "Jamais";

  return (
    <div className="min-h-screen bg-pg px-4 py-8">
      <div className="max-w-[1250px] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-dim mb-1">Admin</p>
            <h1 className="text-2xl font-black text-ink">Progression de Guy</h1>
            <p className="text-xs text-dim mt-0.5">{STUDENT_EMAIL}</p>
          </div>
          <Link
            href="/"
            className="text-xs font-bold text-dim hover:text-ink border border-edge rounded-xl px-4 py-2 transition-colors"
          >
            ← Retour
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard label="Jours pratiqués" value={String(dates.length)} />
          <StatCard label="Série actuelle" value={streak > 0 ? `${streak} j` : "—"} highlight={streak >= 3} />
          <StatCard label="Sessions complètes" value={`${completedSessions} / ${sessionEntries.length}`} />
          <StatCard label="Dernière activité" value={lastActiveLabel} small />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar */}
          <AdminCalendar dates={dates} />

          {/* Session progress */}
          <div className="bg-surface rounded-3xl p-5">
            <p className="text-xs font-black uppercase tracking-widest text-dim mb-4">Exercices par session</p>
            {sessionEntries.length === 0 ? (
              <p className="text-sm text-dim py-8 text-center">Aucune session commencée.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {sessionEntries.map(({ id, done, pct, exos }) => (
                  <div key={id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-bold text-ink">Session {id}</span>
                      <span className={`text-xs font-black tabular-nums ${pct === 100 ? "text-emerald-600" : "text-cobalt"}`}>
                        {done} / {EXERCISE_COUNT}
                      </span>
                    </div>
                    <div className="h-2 bg-edge rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${pct === 100 ? "bg-emerald-400" : "bg-cobalt"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    {exos.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {exos.map((e) => (
                          <span key={e} className="text-[10px] font-bold bg-cobalt/10 text-cobalt px-2 py-0.5 rounded-full">{e}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-dim text-center mt-8">
          Sync: {store._updated
            ? new Date(store._updated).toLocaleString("fr-FR")
            : "jamais"}
        </p>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight = false,
  small = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  small?: boolean;
}) {
  return (
    <div className="bg-surface rounded-2xl p-4">
      <p className={`font-black text-ink ${small ? "text-base" : "text-2xl"} ${highlight ? "text-cobalt" : ""}`}>
        {value}
      </p>
      <p className="text-xs text-dim font-semibold mt-1">{label}</p>
    </div>
  );
}
