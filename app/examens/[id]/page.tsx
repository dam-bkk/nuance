import { notFound } from "next/navigation";
import Link from "next/link";
import { getExamen } from "@/lib/parse-examen";
import ExamenCE from "@/components/ExamenCE";

const TYPE_STYLE: Record<string, string> = {
  CE: "bg-white/20 text-white",
  CO: "bg-amber-400/30 text-amber-200",
};

export default async function ExamenPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const examen = getExamen(id);
  if (!examen) notFound();

  return (
    <div className="min-h-screen bg-pg">
      <header className="bg-white border-b border-edge">
        <div className="h-[3px] bg-gradient-to-r from-[#0028FF] to-[#FF0000]" />
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-3">
          <Link href="/examens" className="flex items-center gap-2 group">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-dim group-hover:text-cobalt transition-colors">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span className="text-sm font-extrabold text-dim group-hover:text-ink transition-colors">Examens</span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 pt-8">
        <div className="bg-cobalt rounded-4xl p-8 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-36 h-36 bg-white/5 rounded-full" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-white/60 text-xs font-extrabold uppercase tracking-widest">DALF C1 · Pratique libre</p>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${TYPE_STYLE[examen.type]}`}>{examen.type}</span>
            </div>
            <h1 className="text-2xl font-black text-white mb-4">{examen.titre}</h1>
            {examen.description && (
              <p className="text-white/70 text-sm font-semibold mb-4">{examen.description}</p>
            )}
            <div className="flex gap-3">
              <div className="bg-white/15 rounded-2xl px-4 py-2">
                <div className="text-white font-black text-lg leading-none">{examen.total}</div>
                <div className="text-white/60 text-xs font-bold mt-1">questions</div>
              </div>
              <div className="bg-white/15 rounded-2xl px-4 py-2">
                <div className="text-white font-black text-lg leading-none">{examen.textes.length}</div>
                <div className="text-white/60 text-xs font-bold mt-1">texte{examen.textes.length > 1 ? "s" : ""}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        <ExamenCE examen={examen} />
      </div>
    </div>
  );
}
