"use client";

import { useState } from "react";
import type { GrammaireExo } from "@/lib/parse-grammaire";
import ScoreCircle from "@/components/ScoreCircle";

const LABELS = ["A", "B", "C"] as const;

export default function GrammaireQCM({ exo }: { exo: GrammaireExo }) {
  let gi = 0;
  const questions = exo.textes.flatMap((t, ti) =>
    t.questions.map((q, qi) => ({ ...q, texteIndex: ti, localIndex: qi, globalIndex: gi++ }))
  );
  const total = questions.length;

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [verified, setVerified] = useState(false);
  const [done, setDone] = useState(false);

  function handleAnswer(globalIndex: number, choice: number) {
    if (verified) return;
    setAnswers((prev) => ({ ...prev, [globalIndex]: choice }));
  }

  function verify() {
    setVerified(true);
    setDone(true);
  }

  function restart() {
    setAnswers({});
    setVerified(false);
    setDone(false);
  }

  const score = verified
    ? questions.filter((q) => answers[q.globalIndex] === q.c).length
    : 0;

  const allAnswered = Object.keys(answers).length === total;

  // Render text with blanks replaced by answer slots
  function renderTexte(texteIndex: number) {
    const t = exo.textes[texteIndex];
    const qs = questions.filter((q) => q.texteIndex === texteIndex);
    let text = t.texte;
    qs.forEach((q, i) => {
      const num = q.globalIndex + 1;
      text = text.replace(`__(${num})__`, `__BLANK_${num}__`);
    });
    const parts = text.split(/(__BLANK_\d+__)/);
    return (
      <p className="text-sm font-semibold text-ink leading-relaxed">
        {parts.map((part, i) => {
          const m = part.match(/__BLANK_(\d+)__/);
          if (m) {
            const num = parseInt(m[1]);
            const q = questions.find((q) => q.globalIndex + 1 === num);
            const chosen = answers[num - 1];
            const isCorrect = chosen === q?.c;
            return (
              <span
                key={i}
                className={`inline-block mx-1 px-2 py-0.5 rounded font-black text-xs min-w-[3rem] text-center border-b-2 ${
                  !verified
                    ? chosen !== undefined
                      ? "bg-cobalt/10 border-cobalt text-cobalt"
                      : "bg-edge border-dim text-dim"
                    : isCorrect
                    ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                    : "bg-crimson/5 border-crimson/40 text-crimson"
                }`}
              >
                {chosen !== undefined ? q?.a[chosen] : `(${num})`}
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </p>
    );
  }

  if (done) {
    const mistakes = questions.filter((q) => answers[q.globalIndex] !== q.c);
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <div className="bg-cobalt rounded-4xl p-6 sm:p-10 flex flex-col items-center gap-4">
          <ScoreCircle score={score} total={total} />
          <p className="text-sm font-extrabold text-white/80">bonnes réponses</p>
        </div>
        {mistakes.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-dim">À revoir</h3>
            {mistakes.map((q) => (
              <div key={q.globalIndex} className="bg-surface rounded-2xl p-4">
                <p className="text-xs font-black text-dim mb-1">Q{q.globalIndex + 1}</p>
                <p className="font-semibold text-ink text-sm">{q.q}</p>
                <p className="text-xs text-crimson mt-1 font-semibold">Répondu : {q.a[answers[q.globalIndex]]}</p>
                <p className="text-xs font-semibold mt-0.5" style={{ color: "#059669" }}>Correct : {q.a[q.c]}</p>
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
    <div className="max-w-2xl mx-auto space-y-6">
      {exo.textes.map((t, ti) => {
        const texteQuestions = questions.filter((q) => q.texteIndex === ti);
        return (
          <div key={ti} className="space-y-4">
            {/* Text card */}
            <div className="bg-frost rounded-2xl p-5 border border-cobalt/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-cobalt mb-3">
                Texte {ti + 1}
              </p>
              {renderTexte(ti)}
            </div>

            {/* Questions */}
            {texteQuestions.map((q) => {
              const chosen = answers[q.globalIndex];
              return (
                <div key={q.globalIndex} className="bg-surface rounded-2xl p-5">
                  <p className="text-sm font-black text-ink mb-3">
                    <span className="text-cobalt mr-1">{q.globalIndex + 1}.</span>
                    {q.q}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {q.a.map((choice, ci) => (
                      <button
                        key={ci}
                        onClick={() => handleAnswer(q.globalIndex, ci)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                          chosen === ci
                            ? "border-cobalt bg-cobalt text-white"
                            : "border-edge bg-pg text-ink hover:border-cobalt hover:bg-frost"
                        }`}
                      >
                        <span className={`text-xs font-black w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                          chosen === ci ? "bg-white/20 text-white" : "bg-edge text-dim"
                        }`}>
                          {LABELS[ci]}
                        </span>
                        {choice}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      <button
        onClick={verify}
        disabled={!allAnswered}
        className="w-full py-4 rounded-2xl bg-cobalt text-white text-sm font-black hover:bg-navy transition-colors disabled:opacity-40"
      >
        Vérifier — {Object.keys(answers).length}/{total} réponses
      </button>
    </div>
  );
}
