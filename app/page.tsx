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
      <header className="border-b border-[#E0D8CF] bg-cream sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="font-serif text-2xl font-bold text-burgundy">LexiC1</h1>
          <p className="text-sm text-[#6B7A99]">Préparation DELF C1</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {lessons.length === 0 ? (
          <div className="text-center py-24 text-[#6B7A99]">
            <p className="text-lg font-serif">Aucune session trouvée.</p>
            <p className="mt-2 text-sm">Ajoutez un fichier <code className="bg-[#F0EBE3] px-1 rounded">session-N.md</code> dans le dossier <code className="bg-[#F0EBE3] px-1 rounded">/content/</code>.</p>
          </div>
        ) : (
          <>
            <h2 className="font-serif text-xl text-navy mb-6">Sessions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {lessons.map((lesson) => (
                <Link
                  key={lesson.session}
                  href={`/s/${lesson.session}`}
                  className="block bg-white border border-[#E0D8CF] rounded-xl p-6 hover:border-burgundy hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-medium uppercase tracking-widest text-[#6B7A99]">
                      Session {lesson.session}
                    </span>
                    <span className="text-xs text-[#6B7A99]">{lesson.items.length} mots</span>
                  </div>
                  <h3 className="mt-3 font-serif text-lg text-navy group-hover:text-burgundy transition-colors leading-snug">
                    {lesson.theme}
                  </h3>
                  <p className="mt-2 text-xs text-[#6B7A99]">{formatDate(lesson.date)}</p>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
