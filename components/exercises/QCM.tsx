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

export default function QCM({ items, allItems, onDone }: { items: VocabItem[]; allItems: VocabItem[]; onDone?: () => void }) {
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
    const correct = opt === current.item.definition;
    const newResults = [...results, { item: current.item, chosen: opt, correct }];
    setTimeout(() => {
      if (index + 1 >= questions.length) { setResults(newResults); setDone(true); onDone?.(); }
      else { setResults(newResults); setIndex(index + 1); setChosen(null); }
    }, 900);
  }

  function restart() { setIndex(0); setChosen(null); setResults([]); setDone(false); }

  if (done) {
    const score = results.filter((r) => r.correct).length;
    const mistakes = results.filter((r) => !r.correct);
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <div className="bg-cobalt rounded-4xl p-6 sm:p-10 flex flex-col items-center gap-4">
          <ScoreCircle score={score} total={questions.length} />
          <p className="text-sm font-extrabold text-white/80">bonnes réponses</p>
        </div>
        {mistakes.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-dim">À revoir</h3>
            {mistakes.map((r, i) => (
              <div key={i} className="bg-surface rounded-2xl p-4 shadow-sm">
                <p className="font-black text-ink">{r.item.word}</p>
                <p className="text-xs text-crimson mt-1 font-semibold line-through">{r.chosen}</p>
                <p className="text-xs font-semibold mt-0.5" style={{ color: "#059669" }}>{r.item.definition}</p>
              </div>
            ))}
          </div>
        )}
        <button onClick={restart}
          className="w-full py-4 rounded-2xl bg-cobalt text-white text-sm font-black hover:bg-navy transition-colors">
          Recommencer
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex gap-1 flex-1">
          {questions.map((_, i) => (
            <div key={i} className={`h-2 rounded-full flex-1 transition-colors ${i < index ? "bg-cobalt/40" : i === index ? "bg-cobalt" : "bg-edge"}`} />
          ))}
        </div>
        <span className="text-xs font-extrabold text-dim shrink-0">{index + 1}/{questions.length}</span>
      </div>

      {/* Blue question card */}
      <div className="bg-cobalt rounded-4xl p-6 sm:p-10 text-center">
        <p className="text-xs font-extrabold text-white/60 uppercase tracking-widest mb-3">{current.item.nature}</p>
        <p className="text-4xl font-black text-white leading-tight">{current.item.word}</p>
        <p className="text-sm font-bold text-white/50 mt-4">Quelle est la définition ?</p>
      </div>

      {/* White option buttons */}
      <div className="space-y-3">
        {current.options.map((opt, i) => {
          let cls = "w-full text-left p-4 rounded-2xl border-2 text-sm font-bold transition-all duration-150 ";
          if (chosen === null)
            cls += "border-edge bg-surface text-ink hover:border-cobalt hover:bg-frost cursor-pointer";
          else if (opt === current.item.definition)
            cls += "border-emerald-400 bg-emerald-50 text-emerald-800";
          else if (opt === chosen)
            cls += "border-crimson/40 bg-crimson/5 text-crimson";
          else
            cls += "border-edge bg-surface text-dim opacity-40";
          return <button key={i} className={cls} onClick={() => handleChoice(opt)}>{opt}</button>;
        })}
      </div>
    </div>
  );
}
