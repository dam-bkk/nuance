"use client";

import type { VocabItem } from "@/lib/types";

const registreBadge: Record<string, { bg: string; text: string }> = {
  familier:   { bg: "rgba(245,158,11,0.12)",  text: "#B45309" },
  courant:    { bg: "rgba(59,78,245,0.10)",    text: "#3B4EF5" },
  soutenu:    { bg: "rgba(139,92,246,0.12)",   text: "#7C3AED" },
  littéraire: { bg: "rgba(5,150,105,0.12)",    text: "#047857" },
};

function WordCard({ item }: { item: VocabItem }) {
  const badge = registreBadge[item.registre] ?? { bg: "rgba(107,114,128,0.1)", text: "#6B7280" };
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-black text-ink">{item.word}</h2>
          <p className="text-xs font-semibold text-dim mt-0.5">{item.nature}</p>
        </div>
        <span className="text-xs font-extrabold px-3 py-1 rounded-full"
          style={{ backgroundColor: badge.bg, color: badge.text }}>
          {item.registre}
        </span>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-semibold text-ink leading-relaxed">{item.definition}</p>
        <p className="text-sm text-dim italic font-medium">{item.traduction}</p>
      </div>

      {item.exemples.length > 0 && (
        <ul className="space-y-1.5">
          {item.exemples.map((ex, i) => (
            <li key={i} className="text-sm text-ink pl-3 border-l-[3px] border-cobalt/30 italic font-medium">{ex}</li>
          ))}
        </ul>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {item.synonymes.length > 0 && (
          <div className="bg-pg rounded-xl p-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-dim mb-1">Synonymes</p>
            <p className="text-xs font-semibold text-ink">{item.synonymes.join(", ")}</p>
          </div>
        )}
        {item.antonymes.length > 0 && (
          <div className="bg-pg rounded-xl p-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-dim mb-1">Antonymes</p>
            <p className="text-xs font-semibold text-ink">{item.antonymes.join(", ")}</p>
          </div>
        )}
        {item.collocations.length > 0 && (
          <div className="bg-pg rounded-xl p-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-dim mb-1">Collocations</p>
            <p className="text-xs font-semibold text-ink">{item.collocations.join(", ")}</p>
          </div>
        )}
      </div>

      {item.piege && (
        <div className="rounded-2xl p-4" style={{ backgroundColor: "rgba(245,158,11,0.08)", border: "1.5px solid rgba(245,158,11,0.25)" }}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: "#B45309" }}>Piège</p>
          <p className="text-sm font-semibold" style={{ color: "#92400E" }}>{item.piege}</p>
        </div>
      )}
    </div>
  );
}

export default function Apercu({ items }: { items: VocabItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item, i) => <WordCard key={i} item={item} />)}
    </div>
  );
}
