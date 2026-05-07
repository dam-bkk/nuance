"use client";

import type { VocabItem } from "@/lib/types";

const registreBadge: Record<string, string> = {
  familier: "bg-amber-100 text-amber-700",
  courant: "bg-cobalt/10 text-cobalt",
  soutenu: "bg-purple-100 text-purple-700",
  littéraire: "bg-emerald-100 text-emerald-700",
};

function WordCard({ item }: { item: VocabItem }) {
  return (
    <div className="bg-white border border-rim rounded-xl p-6 space-y-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-ink">{item.word}</h2>
          <span className="text-xs text-dim">{item.nature}</span>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${registreBadge[item.registre] ?? "bg-rim text-dim"}`}>
          {item.registre}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <p className="text-ink">{item.definition}</p>
        <p className="text-dim italic">{item.traduction}</p>
      </div>

      {item.exemples.length > 0 && (
        <ul className="space-y-1">
          {item.exemples.map((ex, i) => (
            <li key={i} className="text-sm text-ink pl-3 border-l-2 border-cobalt/30 italic">
              {ex}
            </li>
          ))}
        </ul>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        {item.synonymes.length > 0 && (
          <div>
            <span className="font-semibold text-dim uppercase tracking-wide block mb-0.5">Synonymes</span>
            <span className="text-ink">{item.synonymes.join(", ")}</span>
          </div>
        )}
        {item.antonymes.length > 0 && (
          <div>
            <span className="font-semibold text-dim uppercase tracking-wide block mb-0.5">Antonymes</span>
            <span className="text-ink">{item.antonymes.join(", ")}</span>
          </div>
        )}
        {item.collocations.length > 0 && (
          <div>
            <span className="font-semibold text-dim uppercase tracking-wide block mb-0.5">Collocations</span>
            <span className="text-ink">{item.collocations.join(", ")}</span>
          </div>
        )}
      </div>

      {item.piege && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wide block mb-1">Piège</span>
          <p className="text-sm text-amber-900">{item.piege}</p>
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
