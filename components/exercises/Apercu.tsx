"use client";

import type { VocabItem } from "@/lib/types";

const BLOB_COLORS = ["#FFE066", "#6EE7B7", "#C4B5FD", "#FCA5A5", "#93C5FD", "#FCD34D"];
const BLOB_SHAPES = [
  "60% 40% 30% 70% / 60% 30% 70% 40%",
  "40% 60% 70% 30% / 30% 60% 40% 70%",
  "50% 50% 30% 70% / 40% 60% 60% 40%",
  "70% 30% 50% 50% / 50% 40% 60% 50%",
  "55% 45% 60% 40% / 45% 55% 45% 55%",
  "45% 55% 40% 60% / 55% 45% 55% 45%",
];

const registreBadge: Record<string, { bg: string; text: string }> = {
  familier:   { bg: "rgba(245,158,11,0.12)",  text: "#B45309" },
  courant:    { bg: "rgba(59,78,245,0.10)",    text: "#3B4EF5" },
  soutenu:    { bg: "rgba(139,92,246,0.12)",   text: "#7C3AED" },
  littéraire: { bg: "rgba(5,150,105,0.12)",    text: "#047857" },
};

function WordCard({ item, index }: { item: VocabItem; index: number }) {
  const badge = registreBadge[item.registre] ?? { bg: "rgba(107,114,128,0.1)", text: "#6B7280" };
  const blobColor = BLOB_COLORS[index % BLOB_COLORS.length];
  const blobShape = BLOB_SHAPES[index % BLOB_SHAPES.length];

  return (
    <div className="bg-white rounded-4xl p-8 relative overflow-hidden">
      {/* Organic blob */}
      <div
        className="absolute -top-8 -right-8 w-36 h-36 opacity-50"
        style={{ background: blobColor, borderRadius: blobShape }}
      />

      <div className="relative space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-black text-ink">{item.word}</h2>
            <p className="text-xs font-semibold text-dim mt-1">{item.nature}</p>
          </div>
          <span
            className="text-xs font-extrabold px-3 py-1.5 rounded-full"
            style={{ backgroundColor: badge.bg, color: badge.text }}
          >
            {item.registre}
          </span>
        </div>

        {/* Definition + traduction */}
        <div className="space-y-1">
          <p className="text-sm font-semibold text-ink leading-relaxed">{item.definition}</p>
          <p className="text-sm text-dim italic font-medium">{item.traduction}</p>
        </div>

        {/* Exemples */}
        {item.exemples.length > 0 && (
          <ul className="space-y-2">
            {item.exemples.map((ex, i) => (
              <li key={i} className="text-sm text-ink pl-3 border-l-[3px] border-cobalt/30 italic font-medium">{ex}</li>
            ))}
          </ul>
        )}

        {/* Synonymes / Antonymes / Collocations */}
        {(item.synonymes.length > 0 || item.antonymes.length > 0 || item.collocations.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {item.synonymes.length > 0 && (
              <div className="bg-pg rounded-2xl p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-dim mb-1.5">Synonymes</p>
                <p className="text-xs font-semibold text-ink">{item.synonymes.join(", ")}</p>
              </div>
            )}
            {item.antonymes.length > 0 && (
              <div className="bg-pg rounded-2xl p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-dim mb-1.5">Antonymes</p>
                <p className="text-xs font-semibold text-ink">{item.antonymes.join(", ")}</p>
              </div>
            )}
            {item.collocations.length > 0 && (
              <div className="bg-pg rounded-2xl p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-dim mb-1.5">Collocations</p>
                <p className="text-xs font-semibold text-ink">{item.collocations.join(", ")}</p>
              </div>
            )}
          </div>
        )}

        {/* Piège */}
        {item.piege && (
          <div className="rounded-2xl p-4" style={{ backgroundColor: "rgba(245,158,11,0.08)", border: "1.5px solid rgba(245,158,11,0.25)" }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: "#B45309" }}>Piège</p>
            <p className="text-sm font-semibold leading-relaxed" style={{ color: "#92400E" }}>{item.piege}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Apercu({ items }: { items: VocabItem[] }) {
  return (
    <div className="space-y-5">
      {items.map((item, i) => <WordCard key={i} item={item} index={i} />)}
    </div>
  );
}
