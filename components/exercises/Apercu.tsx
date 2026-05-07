"use client";

import type { VocabItem } from "@/lib/types";

const registreBadge: Record<string, string> = {
  familier: "bg-amber-100 text-amber-800",
  courant: "bg-slate-100 text-slate-700",
  soutenu: "bg-purple-100 text-purple-800",
  littéraire: "bg-emerald-100 text-emerald-800",
};

function Field({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-2">
      <span className="text-xs font-medium text-[#6B7A99] uppercase tracking-wide w-24 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-navy">{value}</span>
    </div>
  );
}

function ListField({ label, values }: { label: string; values: string[] }) {
  if (!values.length) return null;
  return (
    <div className="flex gap-2">
      <span className="text-xs font-medium text-[#6B7A99] uppercase tracking-wide w-24 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-navy">{values.join(", ")}</span>
    </div>
  );
}

function WordCard({ item }: { item: VocabItem }) {
  return (
    <div className="bg-white border border-[#E0D8CF] rounded-xl p-6 space-y-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <h2 className="font-serif text-2xl text-navy">{item.word}</h2>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${registreBadge[item.registre] ?? "bg-slate-100 text-slate-700"}`}>
          {item.registre}
        </span>
      </div>

      <div className="space-y-2">
        <Field label="Nature" value={item.nature} />
        <div className="flex gap-2">
          <span className="text-xs font-medium text-[#6B7A99] uppercase tracking-wide w-24 shrink-0 pt-0.5">Définition</span>
          <span className="text-sm text-navy">{item.definition}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-xs font-medium text-[#6B7A99] uppercase tracking-wide w-24 shrink-0 pt-0.5">Traduction</span>
          <span className="text-sm text-[#6B7A99] italic">{item.traduction}</span>
        </div>
      </div>

      {item.exemples.length > 0 && (
        <div>
          <span className="text-xs font-medium text-[#6B7A99] uppercase tracking-wide block mb-1">Exemples</span>
          <ul className="space-y-1">
            {item.exemples.map((ex, i) => (
              <li key={i} className="text-sm text-navy pl-3 border-l-2 border-[#E0D8CF] italic">
                {ex}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-2">
        <ListField label="Synonymes" values={item.synonymes} />
        <ListField label="Antonymes" values={item.antonymes} />
        <ListField label="Collocations" values={item.collocations} />
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
      {items.map((item, i) => (
        <WordCard key={i} item={item} />
      ))}
    </div>
  );
}
