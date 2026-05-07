import { getAllGrammaire } from "@/lib/parse-grammaire";
import AppHeader from "@/components/AppHeader";
import Link from "next/link";

const LEVEL_STYLE: Record<string, string> = {
  B2: "bg-emerald-100 text-emerald-700",
  C1: "bg-frost text-cobalt",
};

export default function GrammairePage() {
  const exos = getAllGrammaire();

  const grouped: Record<string, typeof exos> = {};
  for (const exo of exos) {
    if (!grouped[exo.categorie]) grouped[exo.categorie] = [];
    grouped[exo.categorie].push(exo);
  }

  return (
    <div className="min-h-screen bg-pg">
      <AppHeader back={{ href: "/", label: "Accueil" }} section="Grammaire" />

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="bg-cobalt rounded-4xl p-8 mb-10 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/5 rounded-full" />
          <div className="relative">
            <p className="text-white/60 text-xs font-extrabold uppercase tracking-widest mb-2">B2 · C1</p>
            <h1 className="text-2xl font-black text-white mb-2">Grammaire</h1>
            <p className="text-white/70 text-sm font-semibold">
              Textes à trous — choisis la forme grammaticale correcte.
            </p>
            <div className="flex gap-3 mt-5">
              <div className="bg-white/15 rounded-2xl px-4 py-2">
                <div className="text-white font-black text-lg leading-none">{exos.length}</div>
                <div className="text-white/60 text-xs font-bold mt-1">exercices</div>
              </div>
              <div className="bg-white/15 rounded-2xl px-4 py-2">
                <div className="text-white font-black text-lg leading-none">{exos.reduce((s, e) => s + e.total, 0)}</div>
                <div className="text-white/60 text-xs font-bold mt-1">questions</div>
              </div>
            </div>
          </div>
        </div>

        {exos.length === 0 ? (
          <p className="text-center py-16 text-dim font-semibold">Aucun exercice disponible.</p>
        ) : (
          Object.entries(grouped).map(([cat, list]) => (
            <div key={cat} className="mb-8">
              <h2 className="text-xs font-black uppercase tracking-widest text-dim mb-4">{cat}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {list.map((exo) => (
                  <Link
                    key={exo.id}
                    href={`/grammaire/${exo.id}`}
                    className="bg-white rounded-3xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${LEVEL_STYLE[exo.niveau]}`}>
                        {exo.niveau}
                      </span>
                      <span className="text-xs font-bold text-dim">{exo.total} questions</span>
                    </div>
                    <h3 className="text-base font-black text-ink">{exo.titre}</h3>
                    <p className="text-xs text-dim font-semibold mt-1">{exo.textes.length} texte{exo.textes.length > 1 ? "s" : ""}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
