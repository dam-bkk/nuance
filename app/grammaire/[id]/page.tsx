import { notFound } from "next/navigation";
import { getGrammaire } from "@/lib/parse-grammaire";
import GrammaireQCM from "@/components/GrammaireQCM";
import AppHeader from "@/components/AppHeader";

const LEVEL_STYLE: Record<string, string> = {
  B2: "bg-emerald-400/30 text-emerald-200",
  C1: "bg-white/20 text-white/80",
};

export default async function GrammaireExoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exo = getGrammaire(id);
  if (!exo) notFound();

  return (
    <div className="min-h-screen bg-pg">
      <AppHeader back={{ href: "/grammaire", label: "Grammaire" }} section="Grammaire" item={exo.titre} />

      {/* Hero */}
      <div className="max-w-[1250px] mx-auto px-6 pt-8">
        <div className="bg-cobalt rounded-4xl p-8 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-36 h-36 bg-white/5 rounded-full" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-white/60 text-xs font-extrabold uppercase tracking-widest">{exo.categorie}</p>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${LEVEL_STYLE[exo.niveau]}`}>{exo.niveau}</span>
            </div>
            <h1 className="text-2xl font-black text-white mb-4">{exo.titre}</h1>
            <div className="flex gap-3">
              <div className="bg-white/15 rounded-2xl px-4 py-2">
                <div className="text-white font-black text-lg leading-none">{exo.total}</div>
                <div className="text-white/60 text-xs font-bold mt-1">questions</div>
              </div>
              <div className="bg-white/15 rounded-2xl px-4 py-2">
                <div className="text-white font-black text-lg leading-none">{exo.textes.length}</div>
                <div className="text-white/60 text-xs font-bold mt-1">textes</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1250px] mx-auto px-6 py-6">
        <GrammaireQCM exo={exo} />
      </div>
    </div>
  );
}
