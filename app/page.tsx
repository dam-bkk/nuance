import { getAllLessons } from "@/lib/parse-lesson";
import SessionGrid from "@/components/SessionGrid";

export default function Home() {
  const lessons = getAllLessons();
  const totalWords = lessons.reduce((a, l) => a + l.items.length, 0);
  const b2Count = lessons.filter((l) => l.level === "B2").length;
  const c1Count = lessons.filter((l) => l.level === "C1").length;

  return (
    <div className="min-h-screen bg-pg">
      <header className="bg-white border-b border-edge">
        <div className="h-[3px] bg-gradient-to-r from-[#0028FF] to-[#FF0000]" />
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-3">
          <img src="/icon.svg" alt="" className="h-10 w-10 rounded-xl" />
          <span className="text-xl font-black text-ink tracking-tight">LexiC1</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Hero card */}
        <div className="bg-cobalt rounded-4xl p-10 mb-10 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full" />
          <div className="absolute -bottom-10 left-16 w-36 h-36 bg-white/5 rounded-full" />
          <div className="absolute top-6 right-20 w-16 h-16 bg-white/5 rounded-full" />
          <div className="relative">
            <p className="text-white/60 text-xs font-extrabold uppercase tracking-widest mb-4">DELF B2 · DALF C1 · Vocabulaire</p>
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-3">
              Maîtrisez le<br />vocabulaire B2–C1
            </h1>
            <p className="text-white/70 text-sm font-semibold mb-8 max-w-sm">
              Flashcards, QCM, exercices interactifs — entraînez-vous session par session.
            </p>
            <div className="flex gap-3 flex-wrap">
              <div className="bg-white/15 rounded-2xl px-5 py-3">
                <div className="text-white font-black text-xl leading-none">{lessons.length}</div>
                <div className="text-white/60 text-xs font-bold mt-1">sessions</div>
              </div>
              <div className="bg-white/15 rounded-2xl px-5 py-3">
                <div className="text-white font-black text-xl leading-none">{totalWords}</div>
                <div className="text-white/60 text-xs font-bold mt-1">mots</div>
              </div>
              {b2Count > 0 && (
                <div className="bg-emerald-500/30 rounded-2xl px-5 py-3">
                  <div className="text-white font-black text-xl leading-none">{b2Count}</div>
                  <div className="text-white/60 text-xs font-bold mt-1">B2</div>
                </div>
              )}
              {c1Count > 0 && (
                <div className="bg-white/15 rounded-2xl px-5 py-3">
                  <div className="text-white font-black text-xl leading-none">{c1Count}</div>
                  <div className="text-white/60 text-xs font-bold mt-1">C1</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {lessons.length === 0 ? (
          <div className="text-center py-16 text-dim">
            <p className="text-lg font-bold">Aucune session trouvée.</p>
            <p className="mt-2 text-sm">Ajoutez un fichier <code className="bg-frost px-1.5 py-0.5 rounded font-mono text-xs">session-N.md</code> dans <code className="bg-frost px-1.5 py-0.5 rounded font-mono text-xs">/content/</code>.</p>
          </div>
        ) : (
          <SessionGrid lessons={lessons} />
        )}
      </main>
    </div>
  );
}
