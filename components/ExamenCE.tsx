"use client";

import { useState } from "react";
import type { Examen, ExamenTexte, ExamenQuestion } from "@/lib/parse-examen";
import ScoreCircle from "@/components/ScoreCircle";

const LABELS = ["A", "B", "C"] as const;
const VFND_LABELS = { vrai: "Vrai", faux: "Faux", non_dit: "Non dit" } as const;
const VFND_OPTIONS = ["vrai", "faux", "non_dit"] as const;

type Answer = number | string;

export default function ExamenCE({ examen }: { examen: Examen }) {
  const allQuestions: Array<ExamenQuestion & { texteIndex: number; globalIndex: number }> = [];
  let gi = 0;
  for (let ti = 0; ti < examen.textes.length; ti++) {
    for (const q of examen.textes[ti].questions) {
      allQuestions.push({ ...q, texteIndex: ti, globalIndex: gi++ });
    }
  }
  const total = allQuestions.length;

  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [verified, setVerified] = useState(false);
  const [done, setDone] = useState(false);

  function handleAnswer(gi: number, val: Answer) {
    if (verified) return;
    setAnswers((prev) => ({ ...prev, [gi]: val }));
  }

  function isCorrect(q: ExamenQuestion & { globalIndex: number }): boolean {
    const ans = answers[q.globalIndex];
    if (q.type === "qcm") return ans === q.c;
    if (q.type === "vrai_faux_non_dit") return ans === q.vfnd;
    return false;
  }

  const score = verified ? allQuestions.filter(isCorrect).length : 0;
  const allAnswered = Object.keys(answers).length === total;

  function restart() {
    setAnswers({});
    setVerified(false);
    setDone(false);
  }

  if (done) {
    const mistakes = allQuestions.filter((q) => !isCorrect(q));
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <div className="bg-cobalt rounded-4xl p-6 sm:p-10 flex flex-col items-center gap-4">
          <ScoreCircle score={score} total={total} />
          <p className="text-sm font-extrabold text-white/80">bonnes réponses</p>
        </div>
        {mistakes.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-dim">À revoir</h3>
            {mistakes.map((q) => {
              const givenAns = answers[q.globalIndex];
              const givenLabel = q.type === "qcm"
                ? (typeof givenAns === "number" ? q.a?.[givenAns] : "—")
                : VFND_LABELS[givenAns as keyof typeof VFND_LABELS] ?? "—";
              const correctLabel = q.type === "qcm"
                ? (q.a && q.c != null ? q.a[q.c] : "—")
                : (q.vfnd ? VFND_LABELS[q.vfnd] : "—");
              return (
                <div key={q.globalIndex} className="bg-surface rounded-2xl p-4">
                  <p className="text-xs font-black text-dim mb-1">Q{q.globalIndex + 1}</p>
                  <p className="font-semibold text-ink text-sm">{q.q}</p>
                  <p className="text-xs text-crimson mt-1 font-semibold">Répondu : {givenLabel}</p>
                  <p className="text-xs font-semibold mt-0.5" style={{ color: "#059669" }}>Correct : {correctLabel}</p>
                </div>
              );
            })}
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
    <div className="max-w-2xl mx-auto space-y-8">
      {examen.textes.map((t, ti) => {
        const texteQs = allQuestions.filter((q) => q.texteIndex === ti);
        return (
          <div key={ti} className="space-y-4">
            {/* Text passage */}
            <div className="bg-surface rounded-3xl p-6 border border-edge">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-cobalt mb-1">Texte {ti + 1}</p>
                  <h3 className="font-black text-ink text-base">{t.titre}</h3>
                  {t.source && <p className="text-xs text-dim font-semibold mt-0.5">{t.source}</p>}
                </div>
              </div>
              <div className="prose prose-sm max-w-none">
                {t.texte.split("\n").filter(Boolean).map((para, pi) => (
                  <p key={pi} className="text-sm text-ink leading-relaxed mb-3 last:mb-0">{para}</p>
                ))}
              </div>
            </div>

            {/* Questions */}
            {texteQs.map((q) => {
              const chosen = answers[q.globalIndex];
              return (
                <div key={q.globalIndex} className="bg-surface rounded-2xl p-5">
                  <p className="text-sm font-black text-ink mb-3">
                    <span className="text-cobalt mr-1">{q.globalIndex + 1}.</span>
                    {q.q}
                  </p>

                  {q.type === "qcm" && q.a && (
                    <div className="flex flex-col gap-2">
                      {q.a.map((choice, ci) => (
                        <button
                          key={ci}
                          onClick={() => handleAnswer(q.globalIndex, ci)}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border-2 text-left ${
                            chosen === ci
                              ? verified
                                ? isCorrect(q)
                                  ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                                  : "border-crimson/40 bg-crimson/5 text-crimson"
                                : "border-cobalt bg-cobalt text-white"
                              : verified && q.c === ci
                              ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                              : "border-edge bg-pg text-ink hover:border-cobalt hover:bg-frost"
                          }`}
                        >
                          <span className={`text-xs font-black w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                            chosen === ci && !verified ? "bg-white/20 text-white" : "bg-edge text-dim"
                          }`}>
                            {LABELS[ci]}
                          </span>
                          {choice}
                        </button>
                      ))}
                    </div>
                  )}

                  {q.type === "vrai_faux_non_dit" && (
                    <div className="flex gap-2 flex-wrap">
                      {VFND_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleAnswer(q.globalIndex, opt)}
                          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                            chosen === opt
                              ? verified
                                ? isCorrect(q)
                                  ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                                  : "border-crimson/40 bg-crimson/5 text-crimson"
                                : "border-cobalt bg-cobalt text-white"
                              : verified && q.vfnd === opt
                              ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                              : "border-edge bg-pg text-ink hover:border-cobalt hover:bg-frost"
                          }`}
                        >
                          {VFND_LABELS[opt]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}

      <button
        onClick={() => { setVerified(true); setDone(true); }}
        disabled={!allAnswered}
        className="w-full py-4 rounded-2xl bg-cobalt text-white text-sm font-black hover:bg-navy transition-colors disabled:opacity-40"
      >
        Vérifier — {Object.keys(answers).length}/{total} réponses
      </button>
    </div>
  );
}
