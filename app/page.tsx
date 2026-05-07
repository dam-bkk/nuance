import Link from "next/link";
import { getAllLessons } from "@/lib/parse-lesson";

function formatDate(raw: string): string {
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

const BLOB_COLORS = ["#FFE066", "#6EE7B7", "#C4B5FD", "#FCA5A5", "#93C5FD", "#FCD34D"];
const BLOB_SHAPES = [
  "60% 40% 30% 70% / 60% 30% 70% 40%",
  "40% 60% 70% 30% / 30% 60% 40% 70%",
  "50% 50% 30% 70% / 40% 60% 60% 40%",
  "70% 30% 50% 50% / 50% 40% 60% 50%",
  "55% 45% 60% 40% / 45% 55% 45% 55%",
  "45% 55% 40% 60% / 55% 45% 55% 45%",
];

function IconEye() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function IconCards() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="14" rx="2"/>
      <path d="M6 6V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/>
    </svg>
  );
}

function IconQCM() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4"/>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  );
}

function IconMatch() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"/>
      <path d="M12 5l7 7-7 7"/>
    </svg>
  );
}

function IconFill() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"/>
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  );
}

export default function Home() {
  const lessons = getAllLessons();
  const totalWords = lessons.reduce((a, l) => a + l.items.length, 0);

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
            <p className="text-white/60 text-xs font-extrabold uppercase tracking-widest mb-4">DELF C1 · Vocabulaire</p>
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-3">
              Maîtrisez le<br />vocabulaire C1
            </h1>
            <p className="text-white/70 text-sm font-semibold mb-8 max-w-sm">
              Flashcards, QCM, glisser-déposer, texte à trous — entraînez-vous session par session.
            </p>
            <div className="flex gap-3">
              <div className="bg-white/15 rounded-2xl px-5 py-3">
                <div className="text-white font-black text-xl leading-none">{lessons.length}</div>
                <div className="text-white/60 text-xs font-bold mt-1">sessions</div>
              </div>
              <div className="bg-white/15 rounded-2xl px-5 py-3">
                <div className="text-white font-black text-xl leading-none">{totalWords}</div>
                <div className="text-white/60 text-xs font-bold mt-1">mots</div>
              </div>
              <div className="bg-white/15 rounded-2xl px-5 py-3">
                <div className="text-white font-black text-xl leading-none">5</div>
                <div className="text-white/60 text-xs font-bold mt-1">exercices</div>
              </div>
            </div>
          </div>
        </div>

        {lessons.length === 0 ? (
          <div className="text-center py-16 text-dim">
            <p className="text-lg font-bold">Aucune session trouvée.</p>
            <p className="mt-2 text-sm">Ajoutez un fichier <code className="bg-frost px-1.5 py-0.5 rounded font-mono text-xs">session-N.md</code> dans <code className="bg-frost px-1.5 py-0.5 rounded font-mono text-xs">/content/</code>.</p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-black text-ink mb-5">Vos sessions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {lessons.map((lesson, i) => (
                <Link
                  key={lesson.session}
                  href={`/s/${lesson.session}`}
                  className="block bg-white rounded-4xl p-8 relative overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                >
                  {/* Organic blob */}
                  <div
                    className="absolute -top-8 -right-8 w-36 h-36 opacity-60"
                    style={{
                      background: BLOB_COLORS[i % BLOB_COLORS.length],
                      borderRadius: BLOB_SHAPES[i % BLOB_SHAPES.length],
                    }}
                  />

                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-extrabold text-cobalt uppercase tracking-widest">
                        Session {lesson.session}
                      </span>
                      <span className="text-xs font-bold text-dim bg-edge px-3 py-1 rounded-full">
                        {lesson.items.length} mots
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-ink leading-snug mb-5">
                      {lesson.theme}
                    </h3>

                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-dim">{formatDate(lesson.date)}</p>
                      <div className="flex items-center gap-2 text-dim">
                        <IconEye />
                        <IconCards />
                        <IconQCM />
                        <IconMatch />
                        <IconFill />
                      </div>
                    </div>
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
