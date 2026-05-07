"use client";

import { useState } from "react";
import type { VocabItem } from "@/lib/types";
import Apercu from "./exercises/Apercu";
import Flashcards from "./exercises/Flashcards";
import QCM from "./exercises/QCM";
import GlisserDeposer from "./exercises/GlisserDeposer";
import TexteATrous from "./exercises/TexteATrous";

const TABS = [
  { id: "apercu",      label: "Aperçu" },
  { id: "flashcards",  label: "Flashcards" },
  { id: "qcm",         label: "QCM" },
  { id: "glisser",     label: "Match" },
  { id: "trous",       label: "Texte à trous" },
];

export default function LessonTabs({ items, allItems }: { items: VocabItem[]; allItems: VocabItem[] }) {
  const [active, setActive] = useState("apercu");

  return (
    <div>
      <div className="sticky top-0 z-10 bg-white border-b border-edge shadow-sm">
        <div className="max-w-4xl mx-auto px-4 flex overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`px-5 py-4 text-sm font-extrabold whitespace-nowrap border-b-[3px] transition-colors ${
                active === tab.id
                  ? "border-cobalt text-cobalt"
                  : "border-transparent text-dim hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {active === "apercu"     && <Apercu items={items} />}
        {active === "flashcards" && <Flashcards items={items} />}
        {active === "qcm"        && <QCM items={items} allItems={allItems} />}
        {active === "glisser"    && <GlisserDeposer items={items} />}
        {active === "trous"      && <TexteATrous items={items} />}
      </div>
    </div>
  );
}
