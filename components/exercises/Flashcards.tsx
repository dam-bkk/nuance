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

export default function Flashcards({ items, onDone }: { items: VocabItem[]; onDone?: () => void }) {
  const [cards, setCards] = useState(items);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [notified, setNotified] = useState(false);

  const current = cards[index];

  const next = useCallback(() => {
    setIndex((i) => {
      const n = Math.min(i + 1, cards.length - 1);
      if (n === cards.length - 1 && !notified) { setNotified(true); onDone?.(); }
      return n;
    });
    setFlipped(false);
  }, [cards.length, notified, onDone]);
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
    <div className="flex flex-col items-center gap-6 max-w-lg mx-auto">
      <div className="w-full flex items-center justify-between">
        <div className="flex gap-1 flex-1">
          {cards.map((_, i) => (
            <div key={i} className={`h-2 rounded-full flex-1 transition-colors ${i < index ? "bg-cobalt/40" : i === index ? "bg-cobalt" : "bg-edge"}`} />
          ))}
        </div>
        <span className="text-sm font-extrabold text-dim ml-4 shrink-0">{index + 1}/{cards.length}</span>
      </div>

      <div
        onClick={() => setFlipped((f) => !f)}
        className={`w-full rounded-4xl p-10 flex flex-col items-center justify-center min-h-72 cursor-pointer transition-colors duration-200 select-none ${
          flipped ? "bg-white border-2 border-edge" : "bg-cobalt"
        }`}
      >
        {!flipped ? (
          <div className="text-center">
            <p className="text-xs font-extrabold text-white/60 uppercase tracking-widest mb-3">{current.nature}</p>
            <p className="text-5xl font-black text-white leading-tight">{current.word}</p>
            <p className="text-sm font-bold text-white/50 mt-6">Cliquer pour révéler</p>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-lg font-bold text-ink leading-relaxed">{current.definition}</p>
            <p className="text-sm font-semibold text-dim italic">{current.traduction}</p>
            {current.exemples[0] && (
              <p className="text-sm text-dim border-t border-edge pt-3 italic">«&nbsp;{current.exemples[0]}&nbsp;»</p>
            )}
          </div>
        )}
      </div>

      <p className="text-xs font-semibold text-dim">Espace pour retourner · ← → pour naviguer</p>

      <div className="flex items-center gap-3 w-full">
        <button onClick={prev} disabled={index === 0}
          className="flex-1 py-3 rounded-2xl border-2 border-edge text-sm font-extrabold text-ink disabled:opacity-30 hover:border-cobalt hover:text-cobalt transition-colors">
          ←
        </button>
        <button onClick={() => { setCards(shuffle(items)); setIndex(0); setFlipped(false); }}
          className="flex-1 py-3 rounded-2xl bg-frost text-sm font-extrabold text-cobalt hover:bg-cobalt hover:text-white transition-colors">
          Mélanger
        </button>
        <button onClick={next} disabled={index === cards.length - 1}
          className="flex-1 py-3 rounded-2xl border-2 border-edge text-sm font-extrabold text-ink disabled:opacity-30 hover:border-cobalt hover:text-cobalt transition-colors">
          →
        </button>
      </div>
    </div>
  );
}
