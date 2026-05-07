"use client";

import { useState, useMemo } from "react";
import type { VocabItem } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildOptions(item: VocabItem, allItems: VocabItem[]): string[] {
  const others = allItems.filter(
    (i) => i.word !== item.word && i.definition !== item.definition
  );
  const pool = others.length >= 3 ? others : allItems.filter((i) => i.definition !== item.definition);
  const distractors = shuffle(pool)
    .slice(0, 3)
    .map((i) => i.definition);
  return shuffle([item.definition, ...distractors]);
}

type Question = {
  item: VocabItem;
  options: string[];
};

type Result = {
  item: VocabItem;
  chosen: string;
  correct: boolean;
};

export default function QCM({ items, allItems }: { items: VocabItem[]; allItems: VocabItem[] }) {
  const questions: Question[] = useMemo(
    () => items.map((item) => ({ item, options: buildOptions(item, allItems) })),
    [items, allItems]
  );

  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [done, setDone] = useState(false);

  const current = questions[index];
  const isCorrect = chosen === current.item.definition;

  function handleChoice(option: string) {
    if (chosen !== null) return;
    setChosen(option);
  }

  function handleNext() {
    if (chosen === null) return;
    const newResults = [...results, { item: current.item, chosen, correct: isCorrect }];
    if (index + 1 >= questions.length) {
      setResults(newResults);
      setDone(true);
    } else {
      setResults(newResults);
      setIndex(index + 1);
      setChosen(null);
    }
  }

  function restart() {
    setIndex(0);
    setChosen(null);
    setResults([]);
    setDone(false);
  }

  if (done) {
    const score = results.filter((r) => r.correct).length;
    const mistakes = results.filter((r) => !r.correct);
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <div className="bg-white border border-[#E0D8CF] rounded-2xl p-8 text-center">
          <p className="font-serif text-4xl text-navy">{score}/{questions.length}</p>
          <p className="text-[#6B7A99] mt-1">bonnes réponses</p>
        </div>

        {mistakes.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-navy uppercase tracking-wide">À revoir</h3>
            {mistakes.map((r, i) => (
              <div key={i} className="bg-white border border-[#E0D8CF] rounded-xl p-4 space-y-2">
                <p className="font-serif text-lg text-navy">{r.item.word}</p>
                <p className="text-xs text-red-600 line-through">{r.chosen}</p>
                <p className="text-xs text-emerald-700">{r.item.definition}</p>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={restart}
          className="w-full py-3 rounded-xl bg-burgundy text-white text-sm font-medium hover:bg-burgundy/90 transition-colors"
        >
          Recommencer
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex justify-between text-sm text-[#6B7A99]">
        <span>Question {index + 1} / {questions.length}</span>
      </div>

      <div className="bg-white border border-[#E0D8CF] rounded-2xl p-8 text-center">
        <p className="font-serif text-3xl text-navy">{current.item.word}</p>
        <p className="text-xs text-[#6B7A99] mt-1">{current.item.nature}</p>
      </div>

      <div className="space-y-3">
        {current.options.map((opt, i) => {
          let cls = "w-full text-left p-4 rounded-xl border text-sm transition-colors ";
          if (chosen === null) {
            cls += "border-[#E0D8CF] bg-white hover:border-burgundy hover:bg-[#FAF7F2] text-navy";
          } else if (opt === current.item.definition) {
            cls += "border-emerald-400 bg-emerald-50 text-emerald-900 font-medium";
          } else if (opt === chosen) {
            cls += "border-red-300 bg-red-50 text-red-800";
          } else {
            cls += "border-[#E0D8CF] bg-white text-[#6B7A99] opacity-60";
          }
          return (
            <button key={i} className={cls} onClick={() => handleChoice(opt)}>
              {opt}
            </button>
          );
        })}
      </div>

      {chosen !== null && (
        <button
          onClick={handleNext}
          className="w-full py-3 rounded-xl bg-burgundy text-white text-sm font-medium hover:bg-burgundy/90 transition-colors"
        >
          {index + 1 < questions.length ? "Suivant →" : "Voir les résultats"}
        </button>
      )}
    </div>
  );
}
