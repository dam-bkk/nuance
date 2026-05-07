"use client";

import { useState, useMemo } from "react";
import type { VocabItem } from "@/lib/types";
import ScoreCircle from "@/components/ScoreCircle";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildOptions(item: VocabItem, allItems: VocabItem[]): string[] {
  const others = allItems.filter((i) => i.word !== item.word && i.definition !== item.definition);
  const pool = others.length >= 3 ? others : allItems.filter((i) => i.definition !== item.definition);
  const distractors = shuffle(pool).slice(0, 3).map((i) => i.definition);
  return shuffle([item.definition, ...distractors]);
}

type Question = { item: VocabItem; options: string[] };
type Result = { item: VocabItem; chosen: string; correct: boolean };

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
  const isCorrect = chosen === current?.item.definition;

  function handleChoice(opt: string) {
    if (chosen !== null) return;
    setChosen(opt);
  }

  function handleNext() {
    if (!chosen) return;
    const newResults = [...results, { item: current.item, chosen, correct: isCorrect }];
    if (index + 1 >= questions.length) { setResults(newResults); setDone(true); }
    else { setResults(newResults); setIndex(index + 1); setChosen(null); }
  }

  function restart() { setIndex(0); setChosen(null); setResults([]); setDone(false); }

  if (done) {
    const score = results.filter((r) => r.correct).length;
    const mistakes = results.filter((r) => !r.correct);
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <div className="bg-white border border-rim rounded-2xl p-8 flex flex-col items-center gap-3">
          <ScoreCircle score={score} total={questions.length} />
          <p className="text-sm font-medium text-dim">bonnes réponses</p>
        </div>

        {mistakes.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-dim">À revoir</h3>
            {mistakes.map((r, i) => (
              <div key={i} className="bg-white border border-rim rounded-xl p-4 space-y-1.5">
                <p className="font-bold text-ink">{r.item.word}</p>
                <p className="text-xs text-crimson line-through">{r.chosen}</p>
                <p className="text-xs text-emerald-600 font-medium">{r.item.definition}</p>
              </div>
            ))}
          </div>
        )}

        <button onClick={restart}
          className="w-full py-3 rounded-xl bg-cobalt text-white text-sm font-semibold hover:bg-cobalt/90 transition-colors">
          Recommencer
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className="flex items-center justify-between text-xs text-dim">
        <span className="font-medium">{index + 1} / {questions.length}</span>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div key={i} className={`h-1 w-5 rounded-full ${i < index ? "bg-cobalt" : i === index ? "bg-crimson" : "bg-rim"}`} />
          ))}
        </div>
      </div>

      <div className="bg-white border-2 border-rim rounded-2xl p-8 text-center">
        <p className="text-2xl font-bold text-ink">{current.item.word}</p>
        <p className="text-xs text-dim mt-1">{current.item.nature}</p>
      </div>

      <div className="space-y-2.5">
        {current.options.map((opt, i) => {
          let cls = "w-full text-left p-4 rounded-xl border text-sm font-medium transition-colors ";
          if (chosen === null) cls += "border-rim bg-white hover:border-cobalt hover:bg-frost text-ink";
          else if (opt === current.item.definition) cls += "border-emerald-400 bg-emerald-50 text-emerald-800";
          else if (opt === chosen) cls += "border-crimson bg-crimson/5 text-crimson";
          else cls += "border-rim bg-white text-dim opacity-50";
          return <button key={i} className={cls} onClick={() => handleChoice(opt)}>{opt}</button>;
        })}
      </div>

      {chosen !== null && (
        <button onClick={handleNext}
          className="w-full py-3 rounded-xl bg-cobalt text-white text-sm font-semibold hover:bg-cobalt/90 transition-colors">
          {index + 1 < questions.length ? "Suivant →" : "Voir les résultats"}
        </button>
      )}
    </div>
  );
}
