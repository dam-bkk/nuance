import Link from "next/link";
import { getAllLessons } from "@/lib/parse-lesson";
import SessionGrid from "@/components/SessionGrid";
import { getAllGrammaire } from "@/lib/parse-grammaire";
import { getAllExamens } from "@/lib/parse-examen";
import AppHeader from "@/components/AppHeader";

export default function Home() {
  const lessons = getAllLessons();
  const totalWords = lessons.reduce((a, l) => a + l.items.length, 0);
  const b2Count = lessons.filter((l) => l.level === "B2").length;
  const c1Count = lessons.filter((l) => l.level === "C1").length;
  const gramExos = getAllGrammaire();
  const examens = getAllExamens();

  return (
    <div className="min-h-screen bg-pg">
      <AppHeader />

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

        {/* Module nav */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <Link href="#sessions" className="bg-white rounded-3xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-cobalt/10 flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B4EF5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 5V3M16 5V3M4 10h16"/>
              </svg>
            </div>
            <div>
              <p className="font-black text-ink text-sm">Vocabulaire</p>
              <p className="text-xs text-dim font-semibold mt-0.5">{lessons.length} sessions · {totalWords} mots</p>
            </div>
          </Link>
          <Link href="/grammaire" className="bg-white rounded-3xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-cobalt/10 flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B4EF5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 7h16M4 12h10M4 17h6"/>
              </svg>
            </div>
            <div>
              <p className="font-black text-ink text-sm">Grammaire</p>
              <p className="text-xs text-dim font-semibold mt-0.5">{gramExos.length} exercices QCM</p>
            </div>
          </Link>
          <Link href="/examens" className="bg-white rounded-3xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-cobalt/10 flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B4EF5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12l2 2 4-4M7 4H4a1 1 0 00-1 1v14a1 1 0 001 1h16a1 1 0 001-1V5a1 1 0 00-1-1h-3M9 4h6a1 1 0 010 2H9a1 1 0 010-2z"/>
              </svg>
            </div>
            <div>
              <p className="font-black text-ink text-sm">Examens</p>
              <p className="text-xs text-dim font-semibold mt-0.5">{examens.length} simulations DALF C1</p>
            </div>
          </Link>
        </div>

        <div id="sessions">
        {lessons.length === 0 ? (
          <div className="text-center py-16 text-dim">
            <p className="text-lg font-bold">Aucune session trouvée.</p>
            <p className="mt-2 text-sm">Ajoutez un fichier <code className="bg-frost px-1.5 py-0.5 rounded font-mono text-xs">session-N.md</code> dans <code className="bg-frost px-1.5 py-0.5 rounded font-mono text-xs">/content/</code>.</p>
          </div>
        ) : (
          <SessionGrid lessons={lessons} />
        )}
        </div>
      </main>
    </div>
  );
}
