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

  const next = useCallback(() => {
    setIndex((i) => Math.min(i + 1, cards.length - 1));
    setFlipped(false);
  }, [cards.length]);

  const prev = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
    setFlipped(false);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === " ") {
        e.preventDefault();
        setFlipped((f) => !f);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center justify-between w-full max-w-lg">
        <span className="text-sm text-[#6B7A99]">
          {index + 1} / {cards.length}
        </span>
        <button
          onClick={() => { setCards(shuffle(items)); setIndex(0); setFlipped(false); }}
          className="text-sm text-burgundy hover:underline"
        >
          Mélanger
        </button>
      </div>

      <div
        onClick={() => setFlipped((f) => !f)}
        className="w-full max-w-lg min-h-56 bg-white border-2 border-[#E0D8CF] rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-burgundy transition-colors select-none"
      >
        {!flipped ? (
          <p className="font-serif text-3xl text-navy text-center">{current.word}</p>
        ) : (
          <div className="text-center space-y-3">
            <p className="text-sm text-navy">{current.definition}</p>
            <p className="text-sm text-[#6B7A99] italic">{current.traduction}</p>
            {current.exemples[0] && (
              <p className="text-xs text-[#6B7A99] border-t border-[#E0D8CF] pt-2 italic">
                «&nbsp;{current.exemples[0]}&nbsp;»
              </p>
            )}
          </div>
        )}
      </div>

      <p className="text-xs text-[#6B7A99]">
        Cliquez ou appuyez sur Espace pour retourner · ← → pour naviguer
      </p>

      <div className="flex gap-4">
        <button
          onClick={prev}
          disabled={index === 0}
          className="px-5 py-2 rounded-lg border border-[#E0D8CF] text-sm text-navy disabled:opacity-40 hover:border-navy transition-colors"
        >
          ← Précédente
        </button>
        <button
          onClick={next}
          disabled={index === cards.length - 1}
          className="px-5 py-2 rounded-lg border border-[#E0D8CF] text-sm text-navy disabled:opacity-40 hover:border-navy transition-colors"
        >
          Suivante →
        </button>
      </div>
    </div>
  );
}
