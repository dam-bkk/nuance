"use client";

import { useState } from "react";
import type { VocabItem } from "@/lib/types";
import Apercu from "./exercises/Apercu";
import Flashcards from "./exercises/Flashcards";
import QCM from "./exercises/QCM";
import GlisserDeposer from "./exercises/GlisserDeposer";
import TexteATrous from "./exercises/TexteATrous";

const TABS = [
  { value: "apercu",      label: "Aperçu" },
  { value: "flashcards",  label: "Flashcards" },
  { value: "qcm",         label: "QCM" },
  { value: "glisser",     label: "Glisser-déposer" },
  { value: "trous",       label: "Texte à trous" },
] as const;

type TabValue = typeof TABS[number]["value"];

export default function LessonTabs({ items, allItems }: { items: VocabItem[]; allItems: VocabItem[] }) {
  const [active, setActive] = useState<TabValue>("apercu");

  return (
    <div className="w-full">
      {/* Sticky tab bar */}
      <div className="sticky top-0 z-10 bg-white shadow-[0_1px_0_#E0E4F5]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex gap-0 overflow-x-auto scrollbar-none">
            {TABS.map((tab) => {
              const isActive = tab.value === active;
              return (
                <button
                  key={tab.value}
                  onClick={() => setActive(tab.value)}
                  className={[
                    "relative flex-shrink-0 px-4 py-3.5 text-sm font-medium transition-colors duration-150 border-b-2 whitespace-nowrap",
                    isActive
                      ? "border-cobalt text-cobalt"
                      : "border-transparent text-dim hover:text-ink hover:bg-frost",
                  ].join(" ")}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {active === "apercu"     && <Apercu items={items} />}
        {active === "flashcards" && <Flashcards items={items} />}
        {active === "qcm"        && <QCM items={items} allItems={allItems} />}
        {active === "glisser"    && <GlisserDeposer items={items} />}
        {active === "trous"      && <TexteATrous items={items} />}
      </div>
    </div>
  );
}
