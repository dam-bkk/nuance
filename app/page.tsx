import Link from "next/link";
import { getAllLessons } from "@/lib/parse-lesson";

function formatDate(raw: string): string {
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default function Home() {
  const lessons = getAllLessons();

  return (
    <div className="min-h-screen">
      <header className="bg-cobalt border-b border-cobalt/20 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-crimson flex items-center justify-center">
            <span className="text-white font-bold text-sm">C1</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight leading-none">LexiC1</h1>
            <p className="text-cobalt-200 text-xs mt-0.5" style={{ color: "#93AAFF" }}>Préparation DELF C1</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {lessons.length === 0 ? (
          <div className="text-center py-24 text-dim">
            <p className="text-lg font-semibold">Aucune session trouvée.</p>
            <p className="mt-2 text-sm">Ajoutez un fichier <code className="bg-rim px-1.5 py-0.5 rounded text-ink">session-N.md</code> dans <code className="bg-rim px-1.5 py-0.5 rounded text-ink">/content/</code>.</p>
          </div>
        ) : (
          <>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-dim mb-5">Sessions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {lessons.map((lesson) => (
                <Link
                  key={lesson.session}
                  href={`/s/${lesson.session}`}
                  className="block bg-white border border-rim rounded-xl p-6 hover:border-cobalt hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-cobalt bg-cobalt/8 px-2.5 py-1 rounded-full" style={{ backgroundColor: "rgba(26,60,200,0.08)" }}>
                      Session {lesson.session}
                    </span>
                    <span className="text-xs text-dim bg-rim px-2 py-0.5 rounded-full">{lesson.items.length} mots</span>
                  </div>
                  <h3 className="mt-4 font-semibold text-base text-ink group-hover:text-cobalt transition-colors leading-snug">
                    {lesson.theme}
                  </h3>
                  <p className="mt-1.5 text-xs text-dim">{formatDate(lesson.date)}</p>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
