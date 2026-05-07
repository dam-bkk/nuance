import Link from "next/link";
import { getAllExamens } from "@/lib/parse-examen";

const TYPE_STYLE: Record<string, string> = {
  CE: "bg-cobalt/10 text-cobalt",
  CO: "bg-amber-100 text-amber-700",
};

export default function ExamensPage() {
  const examens = getAllExamens();

  return (
    <div className="min-h-screen bg-pg">
      <header className="bg-white border-b border-edge">
        <div className="h-[3px] bg-gradient-to-r from-[#0028FF] to-[#FF0000]" />
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-dim group-hover:text-cobalt transition-colors">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <img src="/nuance-logo.svg" alt="Nuance" className="h-6" />
          </Link>
          <div className="h-5 w-px bg-edge" />
          <span className="text-xs font-extrabold text-cobalt uppercase tracking-widest">Examens</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-cobalt rounded-4xl p-8 mb-10 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/5 rounded-full" />
          <div className="relative">
            <p className="text-white/60 text-xs font-extrabold uppercase tracking-widest mb-2">DALF C1 — Pratique libre</p>
            <h1 className="text-2xl font-black text-white mb-2">Simulations d'examen</h1>
            <p className="text-white/70 text-sm font-semibold">
              Compréhension de l'écrit — articles de presse, essais et textes argumentatifs.
            </p>
            <div className="flex gap-3 mt-5">
              <div className="bg-white/15 rounded-2xl px-4 py-2">
                <div className="text-white font-black text-lg leading-none">{examens.length}</div>
                <div className="text-white/60 text-xs font-bold mt-1">simulations</div>
              </div>
              <div className="bg-white/15 rounded-2xl px-4 py-2">
                <div className="text-white font-black text-lg leading-none">{examens.reduce((s, e) => s + e.total, 0)}</div>
                <div className="text-white/60 text-xs font-bold mt-1">questions</div>
              </div>
            </div>
          </div>
        </div>

        {examens.length === 0 ? (
          <p className="text-center py-16 text-dim font-semibold">Aucun examen disponible.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {examens.map((examen) => (
              <Link
                key={examen.id}
                href={`/examens/${examen.id}`}
                className="bg-white rounded-3xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${TYPE_STYLE[examen.type] ?? "bg-frost text-cobalt"}`}>
                    {examen.type}
                  </span>
                  <span className="text-xs font-bold text-dim">{examen.total} questions</span>
                </div>
                <h3 className="text-base font-black text-ink">{examen.titre}</h3>
                {examen.description && (
                  <p className="text-xs text-dim font-semibold mt-1 leading-relaxed">{examen.description}</p>
                )}
                <p className="text-xs text-dim font-semibold mt-2">{examen.textes.length} texte{examen.textes.length > 1 ? "s" : ""}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
