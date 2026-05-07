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
    <div className="min-h-screen bg-pg">
      {/* Header with 3px gradient top bar */}
      <header className="bg-white shadow-[0_1px_0_#E0E4F5]">
        <div className="h-[3px] bg-gradient-to-r from-[#0028FF] to-[#FF0000]" />
        <div className="max-w-4xl mx-auto px-6 py-4">
          <img src="/logo.svg" alt="LexiC1" className="h-11 w-auto" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {lessons.length === 0 ? (
          <div className="text-center py-24 text-dim">
            <p className="text-lg font-semibold">Aucune session trouvée.</p>
            <p className="mt-2 text-sm">
              Ajoutez un fichier{" "}
              <code className="bg-frost px-1.5 py-0.5 rounded text-ink font-mono text-xs">session-N.md</code>{" "}
              dans{" "}
              <code className="bg-frost px-1.5 py-0.5 rounded text-ink font-mono text-xs">/content/</code>.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-ink">Vos sessions</h1>
              <p className="text-sm text-dim mt-1">{lessons.length} session{lessons.length > 1 ? "s" : ""} disponible{lessons.length > 1 ? "s" : ""}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {lessons.map((lesson) => (
                <Link
                  key={lesson.session}
                  href={`/s/${lesson.session}`}
                  className="block bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(8,13,38,0.08)] hover:shadow-[0_4px_20px_rgba(8,13,38,0.13)] hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span
                      className="inline-flex items-center text-xs font-bold text-cobalt px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: "rgba(24,53,216,0.08)" }}
                    >
                      Session {lesson.session}
                    </span>
                    <span className="text-xs text-dim bg-pg px-2.5 py-1 rounded-full font-medium">
                      {lesson.items.length} mots
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-ink group-hover:text-cobalt transition-colors leading-snug">
                    {lesson.theme}
                  </h3>
                  <p className="mt-1.5 text-xs text-dim">{formatDate(lesson.date)}</p>

                  <div className="mt-4 flex items-center gap-1.5">
                    <div className="flex gap-1">
                      {["Aperçu", "Flashcards", "QCM"].map((label) => (
                        <span key={label} className="text-[10px] font-medium text-dim bg-pg px-1.5 py-0.5 rounded">
                          {label}
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] text-dim ml-auto">+ 2 exercices</span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
