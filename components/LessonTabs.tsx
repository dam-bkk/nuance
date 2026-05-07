"use client";

import { useState, useCallback } from "react";
import type { VocabItem } from "@/lib/types";
import Apercu from "./exercises/Apercu";
import Flashcards from "./exercises/Flashcards";
import QCM from "./exercises/QCM";
import DefMot from "./exercises/DefMot";
import SynonymeQuiz from "./exercises/SynonymeQuiz";
import GlisserDeposer from "./exercises/GlisserDeposer";
import TexteATrous from "./exercises/TexteATrous";
import { markDone, type ExerciseId } from "@/lib/progress";
import { recordPractice } from "@/lib/activity";

const TABS = [
  { id: "apercu",     label: "Aperçu" },
  { id: "flashcards", label: "Flashcards" },
  { id: "qcm",        label: "QCM" },
  { id: "defmot",     label: "Déf → Mot" },
  { id: "synonyme",   label: "Synonymes" },
  { id: "glisser",    label: "Match" },
  { id: "trous",      label: "Texte à trous" },
];

export default function LessonTabs({ items, allItems, sessionNum }: {
  items: VocabItem[];
  allItems: VocabItem[];
  sessionNum: number;
}) {
  const [active, setActive] = useState("apercu");

  const done = useCallback((id: ExerciseId) => {
    markDone(sessionNum, id);
    recordPractice();
  }, [sessionNum]);

  return (
    <div>
      <div className="sticky top-0 z-10 py-3 sm:py-4 bg-pg transition-colors duration-300">
        <div className="max-w-[1250px] mx-auto px-4 sm:px-6">
          <div className="bg-surface rounded-2xl p-1.5 flex overflow-x-auto gap-1 shadow-sm scrollbar-none">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`flex-1 px-4 py-2.5 text-sm font-extrabold whitespace-nowrap rounded-xl transition-all ${
                  active === tab.id
                    ? "bg-cobalt text-white shadow-sm"
                    : "text-dim hover:text-ink hover:bg-pg"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1250px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {active === "apercu"     && <Apercu items={items} />}
        {active === "flashcards" && <Flashcards items={items} onDone={() => done("flashcards")} />}
        {active === "qcm"        && <QCM items={items} allItems={allItems} onDone={() => done("qcm")} />}
        {active === "defmot"     && <DefMot items={items} allItems={allItems} onDone={() => done("defmot")} />}
        {active === "synonyme"   && <SynonymeQuiz items={items} allItems={allItems} onDone={() => done("synonyme")} />}
        {active === "glisser"    && <GlisserDeposer items={items} onDone={() => done("glisser")} />}
        {active === "trous"      && <TexteATrous items={items} onDone={() => done("trous")} />}
      </div>
    </div>
  );
}
