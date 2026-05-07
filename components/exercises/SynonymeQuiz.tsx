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

type Question = { item: VocabItem; correct: string; choices: string[] };
type Result   = { item: VocabItem; correct: string; given: string; ok: boolean };

export default function SynonymeQuiz({ items, allItems, onDone }: { items: VocabItem[]; allItems: VocabItem[]; onDone?: () => void }) {
  const questions: Question[] = useMemo(() => {
    const eligible = items.filter((i) => i.synonymes.length > 0);
    const pool     = allItems.filter((i) => i.synonymes.length > 0);
    return shuffle(eligible).slice(0, 10).map((item) => {
      const correct = item.synonymes[0];
      const distractors = shuffle(pool.filter((i) => i.word !== item.word))
        .slice(0, 3)
        .map((i) => i.synonymes[0]);
      return { item, correct, choices: shuffle([correct, ...distractors]) };
    });
  }, [items, allItems]);

  const [index,   setIndex]   = useState(0);
  const [chosen,  setChosen]  = useState<string | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [done,    setDone]    = useState(false);

  function restart() { setIndex(0); setChosen(null); setResults([]); setDone(false); }

  if (questions.length === 0)
    return <p className="text-dim text-center py-12 font-semibold">Pas assez de synonymes dans cette session.</p>;

  if (done) {
    const score    = results.filter((r) => r.ok).length;
    const mistakes = results.filter((r) => !r.ok);
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <div className="bg-cobalt rounded-4xl p-10 flex flex-col items-center gap-4">
          <ScoreCircle score={score} total={questions.length} />
          <p className="text-sm font-extrabold text-white/80">bonnes réponses</p>
        </div>
        {mistakes.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-dim">À revoir</h3>
            {mistakes.map((r, i) => (
              <div key={i} className="bg-white rounded-2xl p-4">
                <p className="font-black text-ink">{r.item.word}</p>
                <p className="text-xs text-dim mt-0.5">Synonymes : <span className="font-semibold text-ink">{r.item.synonymes.join(", ")}</span></p>
                <p className="text-xs text-crimson mt-1 font-semibold">Répondu : «&nbsp;{r.given}&nbsp;»</p>
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

  const current = questions[index];

  function handleChoice(word: string) {
    if (chosen !== null) return;
    setChosen(word);
    const ok = word === current.correct;
    const newResults = [...results, { item: current.item, correct: current.correct, given: word, ok }];
    setTimeout(() => {
      if (index + 1 >= questions.length) { setResults(newResults); setDone(true); onDone?.(); }
      else { setResults(newResults); setIndex(index + 1); setChosen(null); }
    }, 900);
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1 flex-1">
          {questions.map((_, i) => (
            <div key={i} className={`h-2 rounded-full flex-1 transition-colors ${
              i < index ? "bg-cobalt/40" : i === index ? "bg-cobalt" : "bg-edge"
            }`} />
          ))}
        </div>
        <span className="text-xs font-extrabold text-dim shrink-0">{index + 1}/{questions.length}</span>
      </div>

      {/* Blue word card */}
      <div className="bg-cobalt rounded-4xl p-10 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-36 h-36 bg-white/5 rounded-full" />
        <div className="relative">
          <p className="text-xs font-extrabold text-white/60 uppercase tracking-widest mb-4">Quel est le synonyme ?</p>
          <p className="text-5xl font-black text-white leading-tight mb-3">{current.item.word}</p>
          <p className="text-sm text-white/50 italic font-medium">{current.item.definition}</p>
        </div>
      </div>

      {/* 2×2 synonym choices */}
      <div className="grid grid-cols-2 gap-3">
        {current.choices.map((word) => {
          let cls = "py-4 px-4 rounded-2xl border-2 text-sm font-black transition-all duration-150 text-center ";
          if (chosen === null)
            cls += "border-edge bg-white text-ink hover:border-cobalt hover:bg-frost cursor-pointer";
          else if (word === current.correct)
            cls += "border-emerald-400 bg-emerald-50 text-emerald-800";
          else if (word === chosen)
            cls += "border-crimson/40 bg-crimson/5 text-crimson";
          else
            cls += "border-edge bg-white text-dim opacity-35";
          return <button key={word} className={cls} onClick={() => handleChoice(word)}>{word}</button>;
        })}
      </div>
    </div>
  );
}
