"use client";

import { useState, useMemo, useRef } from "react";
import type { VocabItem } from "@/lib/types";

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function blankSentence(sentence: string, word: string): { before: string; blank: string; after: string } | null {
  const normSentence = normalize(sentence);
  const normWord = normalize(word);
  const idx = normSentence.indexOf(normWord);
  if (idx === -1) return null;
  return {
    before: sentence.slice(0, idx),
    blank: sentence.slice(idx, idx + word.length),
    after: sentence.slice(idx + word.length),
  };
}

type Question = {
  item: VocabItem;
  sentence: string;
  answer: string;
};

type Result = { item: VocabItem; correct: boolean; given: string };

export default function TexteATrous({ items }: { items: VocabItem[] }) {
  const questions: Question[] = useMemo(() => {
    const qs: Question[] = [];
    for (const item of items) {
      const ex = item.exemples[0];
      if (!ex) continue;
      const blanked = blankSentence(ex, item.word);
      if (!blanked) continue;
      qs.push({ item, sentence: ex, answer: blanked.blank });
    }
    return qs;
  }, [items]);

  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState<boolean | null>(null);
  const [hint, setHint] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (questions.length === 0) {
    return <p className="text-[#6B7A99] text-center py-12">Aucun exemple disponible pour cet exercice.</p>;
  }

  const current = questions[index];
  const parts = blankSentence(current.sentence, current.answer);

  function handleSubmit() {
    if (!input.trim()) return;
    const correct = normalize(input.trim()) === normalize(current.answer);
    setSubmitted(correct);
    const newResults = [...results, { item: current.item, correct, given: input.trim() }];

    if (index + 1 >= questions.length) {
      setResults(newResults);
      setDone(true);
    } else {
      setTimeout(() => {
        setResults(newResults);
        setIndex(index + 1);
        setInput("");
        setSubmitted(null);
        setHint(false);
        inputRef.current?.focus();
      }, 1200);
    }
  }

  function restart() {
    setIndex(0);
    setInput("");
    setSubmitted(null);
    setHint(false);
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
              <div key={i} className="bg-white border border-[#E0D8CF] rounded-xl p-4">
                <p className="font-serif text-lg text-navy">{r.item.word}</p>
                <p className="text-xs text-red-600 mt-1">Répondu : «&nbsp;{r.given}&nbsp;»</p>
                <p className="text-xs text-emerald-700">Correct : «&nbsp;{r.item.word}&nbsp;»</p>
              </div>
            ))}
          </div>
        )}
        <button onClick={restart} className="w-full py-3 rounded-xl bg-burgundy text-white text-sm font-medium hover:bg-burgundy/90 transition-colors">
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

      <div className="bg-white border border-[#E0D8CF] rounded-2xl p-8">
        <p className="text-navy text-lg leading-relaxed">
          {parts ? (
            <>
              {parts.before}
              <span className="inline-block border-b-2 border-burgundy w-24 mx-1 align-bottom" />
              {parts.after}
            </>
          ) : (
            current.sentence
          )}
        </p>
        {hint && (
          <p className="mt-3 text-sm text-terracotta italic">Indice : {current.item.traduction}</p>
        )}
      </div>

      <div className="space-y-3">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
          disabled={submitted !== null}
          placeholder="Votre réponse…"
          autoFocus
          className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
            submitted === true
              ? "border-emerald-400 bg-emerald-50 text-emerald-900"
              : submitted === false
              ? "border-red-300 bg-red-50 text-red-800"
              : "border-[#E0D8CF] bg-white text-navy focus:border-burgundy"
          }`}
        />

        {submitted === false && (
          <p className="text-xs text-emerald-700">Réponse correcte : «&nbsp;{current.answer}&nbsp;»</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={submitted !== null || !input.trim()}
            className="flex-1 py-2.5 rounded-xl bg-burgundy text-white text-sm font-medium hover:bg-burgundy/90 transition-colors disabled:opacity-40"
          >
            Valider
          </button>
          <button
            onClick={() => setHint(true)}
            disabled={hint || submitted !== null}
            className="px-4 py-2.5 rounded-xl border border-[#E0D8CF] text-sm text-navy hover:border-navy transition-colors disabled:opacity-40"
          >
            Indice
          </button>
        </div>
      </div>
    </div>
  );
}
