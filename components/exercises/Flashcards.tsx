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
      {/* Progress bar + shuffle */}
      <div className="flex items-center justify-between w-full max-w-lg">
        <div className="flex gap-1 flex-wrap">
          {cards.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-6 rounded-full transition-colors ${
                i === index ? "bg-cobalt" : i < index ? "bg-cobalt/35" : "bg-edge"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => { setCards(shuffle(items)); setIndex(0); setFlipped(false); }}
          className="text-xs font-semibold text-dim hover:text-cobalt transition-colors ml-4 flex-shrink-0"
        >
          Mélanger
        </button>
      </div>

      {/* Card — bigger, shadow-based, no hard border */}
      <div
        onClick={() => setFlipped((f) => !f)}
        className="w-full max-w-lg min-h-72 bg-white rounded-2xl shadow-[0_2px_12px_rgba(8,13,38,0.08)] hover:shadow-[0_6px_24px_rgba(8,13,38,0.13)] p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 select-none"
      >
        {!flipped ? (
          <div className="text-center space-y-2">
            <p className="text-4xl font-bold text-ink tracking-tight">{current.word}</p>
            <p className="text-xs font-medium text-dim uppercase tracking-widest">{current.nature}</p>
            <p className="text-[11px] text-dim/60 mt-4">Cliquez pour révéler</p>
          </div>
        ) : (
          <div className="text-center space-y-3 max-w-sm">
            <p className="text-sm font-semibold text-cobalt uppercase tracking-widest text-xs mb-2">{current.word}</p>
            <p className="text-base font-medium text-ink leading-relaxed">{current.definition}</p>
            <p className="text-sm text-dim italic">{current.traduction}</p>
            {current.exemples[0] && (
              <p className="text-xs text-dim border-t border-edge pt-3 italic leading-relaxed">
                «&nbsp;{current.exemples[0]}&nbsp;»
              </p>
            )}
          </div>
        )}
      </div>

      <p className="text-xs text-dim/70">Espace pour retourner · ← → pour naviguer</p>

      {/* Nav buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={prev}
          disabled={index === 0}
          className="px-5 py-2.5 rounded-xl border border-edge text-sm font-semibold text-ink disabled:opacity-30 hover:border-cobalt hover:text-cobalt transition-colors"
        >
          ← Précédente
        </button>
        <span className="text-sm font-bold text-dim w-16 text-center">{index + 1} / {cards.length}</span>
        <button
          onClick={next}
          disabled={index === cards.length - 1}
          className="px-5 py-2.5 rounded-xl bg-cobalt text-white text-sm font-semibold disabled:opacity-30 hover:bg-navy transition-colors"
        >
          Suivante →
        </button>
      </div>
    </div>
  );
}
