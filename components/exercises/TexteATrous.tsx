"use client";

import { useState, useMemo } from "react";
import type { VocabItem } from "@/lib/types";
import ScoreCircle from "@/components/ScoreCircle";

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function blankSentence(sentence: string, word: string) {
  const idx = normalize(sentence).indexOf(normalize(word));
  if (idx === -1) return null;
  return { before: sentence.slice(0, idx), after: sentence.slice(idx + word.length) };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Question = { item: VocabItem; before: string; after: string; choices: string[] };
type Result = { item: VocabItem; correct: boolean; given: string };

export default function TexteATrous({ items }: { items: VocabItem[] }) {
  const questions: Question[] = useMemo(() => {
    const qs: Question[] = [];
    for (const item of items) {
      const ex = item.exemples[0];
      if (!ex) continue;
      const b = blankSentence(ex, item.word);
      if (!b) continue;
      const pool = items.filter((i) => i.word !== item.word);
      const distractors = shuffle(pool).slice(0, 3).map((i) => i.word);
      qs.push({ item, before: b.before, after: b.after, choices: shuffle([item.word, ...distractors]) });
    }
    return qs.slice(0, 10);
  }, [items]);

  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [done, setDone] = useState(false);

  if (questions.length === 0)
    return <p className="text-dim text-center py-12 font-semibold">Aucun exemple disponible.</p>;

  const current = questions[index];

  function handleChoice(word: string) {
    if (chosen !== null) return;
    setChosen(word);
    const correct = word === current.item.word;
    const newResults = [...results, { item: current.item, correct, given: word }];
    setTimeout(() => {
      if (index + 1 >= questions.length) { setResults(newResults); setDone(true); }
      else { setResults(newResults); setIndex(index + 1); setChosen(null); }
    }, 1000);
  }

  function restart() { setIndex(0); setChosen(null); setResults([]); setDone(false); }

  if (done) {
    const score = results.filter((r) => r.correct).length;
    const mistakes = results.filter((r) => !r.correct);
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
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="font-black text-ink">{r.item.word}</p>
                <p className="text-xs text-crimson mt-1 font-semibold">Répondu : «&nbsp;{r.given}&nbsp;»</p>
                <p className="text-xs font-semibold mt-0.5" style={{ color: "#059669" }}>Correct : «&nbsp;{r.item.word}&nbsp;»</p>
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

      {/* Blue sentence card */}
      <div className="bg-cobalt rounded-4xl p-10">
        <p className="text-xs font-extrabold text-white/60 uppercase tracking-widest mb-4">Complétez la phrase</p>
        <p className="text-lg font-bold text-white leading-relaxed">
          {current.before}
          <span className="inline-block bg-white/20 rounded-lg px-3 mx-1 min-w-[5rem] text-center text-white/40">_____</span>
          {current.after}
        </p>
      </div>

      {/* 2×2 white choice grid */}
      <div className="grid grid-cols-2 gap-3">
        {current.choices.map((word) => {
          let cls = "py-4 px-4 rounded-2xl border-2 text-sm font-black transition-all duration-150 text-center ";
          if (chosen === null)
            cls += "border-edge bg-white text-ink hover:border-cobalt hover:bg-frost cursor-pointer";
          else if (word === current.item.word)
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
