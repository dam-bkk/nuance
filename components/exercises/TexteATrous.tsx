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
  return {
    before: sentence.slice(0, idx),
    after: sentence.slice(idx + word.length),
  };
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
    return qs;
  }, [items]);

  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [done, setDone] = useState(false);

  if (questions.length === 0)
    return <p className="text-dim text-center py-12">Aucun exemple disponible pour cet exercice.</p>;

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
        <div className="bg-white rounded-2xl p-8 shadow-[0_2px_12px_rgba(8,13,38,0.08)] flex flex-col items-center gap-3">
          <ScoreCircle score={score} total={questions.length} />
          <p className="text-sm font-medium text-dim">bonnes réponses</p>
        </div>
        {mistakes.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-dim">À revoir</h3>
            {mistakes.map((r, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-[0_2px_8px_rgba(8,13,38,0.06)]">
                <p className="font-bold text-ink">{r.item.word}</p>
                <p className="text-xs text-crimson mt-1">Répondu : «&nbsp;{r.given}&nbsp;»</p>
                <p className="text-xs font-semibold mt-0.5" style={{ color: "#059669" }}>
                  Correct : «&nbsp;{r.item.word}&nbsp;»
                </p>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={restart}
          className="w-full py-3 rounded-xl bg-cobalt text-white text-sm font-semibold hover:bg-navy transition-colors"
        >
          Recommencer
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      {/* Progress dots */}
      <div className="flex items-center justify-between text-xs text-dim">
        <span className="font-semibold">{index + 1} / {questions.length}</span>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-5 rounded-full transition-colors ${
                i < index ? "bg-cobalt/40" : i === index ? "bg-cobalt" : "bg-edge"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Sentence with blank */}
      <div className="bg-white rounded-2xl p-8 shadow-[0_2px_12px_rgba(8,13,38,0.08)]">
        <p className="text-ink text-base leading-relaxed font-medium">
          {current.before}
          <span className="inline-block border-b-[3px] border-cobalt w-24 mx-1 align-bottom" />
          {current.after}
        </p>
      </div>

      {/* 2×2 choice grid */}
      <div className="grid grid-cols-2 gap-3">
        {current.choices.map((word) => {
          let cls = "py-3.5 px-4 rounded-xl border text-sm font-semibold transition-all duration-150 text-center ";
          if (chosen === null)
            cls += "border-edge bg-white text-ink hover:border-cobalt hover:bg-frost cursor-pointer";
          else if (word === current.item.word)
            cls += "border-emerald-300 bg-emerald-50 text-emerald-800";
          else if (word === chosen)
            cls += "border-crimson/30 bg-crimson/5 text-crimson";
          else
            cls += "border-edge bg-white text-dim opacity-35";
          return (
            <button key={word} className={cls} onClick={() => handleChoice(word)}>
              {word}
            </button>
          );
        })}
      </div>
    </div>
  );
}
