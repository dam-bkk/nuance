"use client";

import type { VocabItem } from "@/lib/types";

const registreBadge: Record<string, { bg: string; text: string }> = {
  familier:   { bg: "rgba(251,191,36,0.12)",  text: "#92400E" },
  courant:    { bg: "rgba(24,53,216,0.08)",    text: "#1835D8" },
  soutenu:    { bg: "rgba(109,40,217,0.09)",   text: "#5B21B6" },
  littéraire: { bg: "rgba(5,150,105,0.09)",    text: "#065F46" },
};

function WordCard({ item }: { item: VocabItem }) {
  const badge = registreBadge[item.registre] ?? { bg: "#E0E4F5", text: "#6B7698" };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(8,13,38,0.08)] space-y-5">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-ink tracking-tight">{item.word}</h2>
          <span className="text-xs font-medium text-dim mt-0.5 block">{item.nature}</span>
        </div>
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 mt-0.5"
          style={{ backgroundColor: badge.bg, color: badge.text }}
        >
          {item.registre}
        </span>
      </div>

      {/* Definition + translation */}
      <div className="space-y-1.5">
        <p className="text-sm text-ink leading-relaxed">{item.definition}</p>
        <p className="text-sm text-dim italic">{item.traduction}</p>
      </div>

      {/* Examples */}
      {item.exemples.length > 0 && (
        <ul className="space-y-2">
          {item.exemples.map((ex, i) => (
            <li key={i} className="text-sm text-ink pl-4 border-l-[3px] border-cobalt/25 italic leading-relaxed">
              {ex}
            </li>
          ))}
        </ul>
      )}

      {/* Synonymes / Antonymes / Collocations */}
      {(item.synonymes.length > 0 || item.antonymes.length > 0 || item.collocations.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {item.synonymes.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-dim uppercase tracking-widest block mb-1">Synonymes</span>
              <span className="text-xs text-ink">{item.synonymes.join(", ")}</span>
            </div>
          )}
          {item.antonymes.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-dim uppercase tracking-widest block mb-1">Antonymes</span>
              <span className="text-xs text-ink">{item.antonymes.join(", ")}</span>
            </div>
          )}
          {item.collocations.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-dim uppercase tracking-widest block mb-1">Collocations</span>
              <span className="text-xs text-ink">{item.collocations.join(", ")}</span>
            </div>
          )}
        </div>
      )}

      {/* Piège — amber callout */}
      {item.piege && (
        <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(251,191,36,0.10)", border: "1px solid rgba(251,191,36,0.35)" }}>
          <span className="text-[10px] font-bold uppercase tracking-widest block mb-1.5" style={{ color: "#92400E" }}>
            Attention — piège
          </span>
          <p className="text-sm leading-relaxed" style={{ color: "#78350F" }}>{item.piege}</p>
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
