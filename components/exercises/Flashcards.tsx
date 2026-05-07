"use client";

import { useState, useEffect, useCallback } from "react";
import type { VocabItem } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Flashcards({ items }: { items: VocabItem[] }) {
  const [cards, setCards] = useState(items);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const current = cards[index];

  const next = useCallback(() => { setIndex((i) => Math.min(i + 1, cards.length - 1)); setFlipped(false); }, [cards.length]);
  const prev = useCallback(() => { setIndex((i) => Math.max(i - 1, 0)); setFlipped(false); }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === " ") { e.preventDefault(); setFlipped((f) => !f); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [next, prev]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center justify-between w-full max-w-lg">
        <div className="flex gap-1">
          {cards.map((_, i) => (
            <div key={i} className={`h-1 w-6 rounded-full transition-colors ${i === index ? "bg-crimson" : i < index ? "bg-cobalt" : "bg-rim"}`} />
          ))}
        </div>
        <button
          onClick={() => { setCards(shuffle(items)); setIndex(0); setFlipped(false); }}
          className="text-xs font-semibold text-cobalt hover:text-crimson transition-colors"
        >
          Mélanger
        </button>
      </div>

      <div
        onClick={() => setFlipped((f) => !f)}
        className="w-full max-w-lg min-h-60 bg-white border-2 border-rim rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-cobalt hover:shadow-md transition-all select-none group"
      >
        {!flipped ? (
          <div className="text-center space-y-2">
            <p className="text-3xl font-bold text-ink">{current.word}</p>
            <p className="text-xs text-dim">{current.nature}</p>
          </div>
        ) : (
          <div className="text-center space-y-3">
            <p className="text-sm font-medium text-ink leading-relaxed">{current.definition}</p>
            <p className="text-sm text-dim italic">{current.traduction}</p>
            {current.exemples[0] && (
              <p className="text-xs text-dim border-t border-rim pt-2 italic">
                «&nbsp;{current.exemples[0]}&nbsp;»
              </p>
            )}
          </div>
        )}
      </div>

      <p className="text-xs text-dim">Espace pour retourner · ← → pour naviguer</p>

      <div className="flex items-center gap-4">
        <button onClick={prev} disabled={index === 0}
          className="px-5 py-2.5 rounded-xl border border-rim text-sm font-medium text-ink disabled:opacity-30 hover:border-cobalt hover:text-cobalt transition-colors">
          ← Précédente
        </button>
        <span className="text-sm font-semibold text-dim w-16 text-center">{index + 1} / {cards.length}</span>
        <button onClick={next} disabled={index === cards.length - 1}
          className="px-5 py-2.5 rounded-xl border border-rim text-sm font-medium text-ink disabled:opacity-30 hover:border-cobalt hover:text-cobalt transition-colors">
          Suivante →
        </button>
      </div>
    </div>
  );
}
