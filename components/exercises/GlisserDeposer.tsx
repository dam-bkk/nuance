"use client";

import { useState, useMemo } from "react";
import { DndContext, useDraggable, useDroppable, DragEndEvent } from "@dnd-kit/core";
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

type WordCard = { id: string; word: string; itemIndex: number };
type SynCard = { id: string; synText: string; itemIndex: number };

function DraggableWord({ id, word, placed, verified, correct }: {
  id: string; word: string; placed: boolean; verified: boolean; correct?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  const style = transform ? { transform: `translate3d(${transform.x}px,${transform.y}px,0)`, zIndex: 50 } : undefined;

  let cls = "px-3 py-2 rounded-xl border text-sm font-semibold cursor-grab active:cursor-grabbing transition-all ";
  if (verified && correct !== undefined)
    cls += correct
      ? "border-emerald-300 bg-emerald-50 text-emerald-800"
      : "border-crimson/30 bg-crimson/5 text-crimson";
  else if (placed)
    cls += "border-edge bg-pg text-dim opacity-50";
  else
    cls += "border-edge bg-white text-ink hover:border-cobalt hover:shadow-sm shadow-[0_1px_4px_rgba(8,13,38,0.07)]";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cls + (isDragging ? " opacity-50 shadow-lg scale-105" : "")}
    >
      {word}
    </div>
  );
}

function DroppableSyn({ id, synText, wordPlaced, verified, correct }: {
  id: string; synText: string; wordPlaced?: string; verified: boolean; correct?: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  let cls = "min-h-[2.75rem] px-4 py-2.5 rounded-xl border text-sm transition-all ";
  if (verified && correct !== undefined)
    cls += correct ? "border-emerald-300 bg-emerald-50" : "border-crimson/30 bg-crimson/5";
  else if (isOver)
    cls += "border-cobalt bg-frost";
  else
    cls += "border-edge bg-white";

  return (
    <div ref={setNodeRef} className={cls}>
      <span className="text-dim">{synText}</span>
      {wordPlaced && (
        <span className="ml-2 font-semibold text-cobalt">← {wordPlaced}</span>
      )}
    </div>
  );
}

export default function GlisserDeposer({ items }: { items: VocabItem[] }) {
  const eligible = useMemo(
    () => items.filter((item) => item.synonymes.length > 0).slice(0, 10),
    [items]
  );

  const wordCards: WordCard[] = useMemo(
    () => shuffle(eligible.map((item, i) => ({ id: `w-${i}`, word: item.word, itemIndex: i }))),
    [eligible]
  );
  const synCards: SynCard[] = useMemo(
    () => shuffle(eligible.map((item, i) => ({ id: `s-${i}`, synText: item.synonymes[0], itemIndex: i }))),
    [eligible]
  );

  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [verified, setVerified] = useState(false);

  if (eligible.length < 2) {
    return <p className="text-dim text-center py-12">Pas assez de mots avec des synonymes pour cet exercice.</p>;
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over) return;
    const wordId = active.id as string;
    const synId = over.id as string;
    if (!synId.startsWith("s-")) return;
    setPlacements((prev) => {
      const next = { ...prev };
      for (const k in next) { if (next[k] === wordId) delete next[k]; }
      next[synId] = wordId;
      return next;
    });
    setVerified(false);
  }

  function getCorrect(synId: string, wordId: string): boolean {
    const syn = synCards.find((s) => s.id === synId);
    const word = wordCards.find((w) => w.id === wordId);
    return !!syn && !!word && syn.itemIndex === word.itemIndex;
  }

  const placedWordIds = new Set(Object.values(placements));
  const correctCount = Object.entries(placements).filter(([sId, wId]) => getCorrect(sId, wId)).length;

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-dim mb-3">Mots</p>
            <div className="space-y-2">
              {wordCards.map((w) => (
                <DraggableWord
                  key={w.id} id={w.id} word={w.word}
                  placed={placedWordIds.has(w.id)} verified={verified}
                  correct={verified
                    ? Object.entries(placements).some(([sId, wId]) => wId === w.id && getCorrect(sId, wId))
                    : undefined}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-dim mb-3">Synonymes</p>
            <div className="space-y-2">
              {synCards.map((s) => {
                const placedWordId = placements[s.id];
                const placedWord = wordCards.find((w) => w.id === placedWordId);
                return (
                  <DroppableSyn
                    key={s.id} id={s.id} synText={s.synText}
                    wordPlaced={placedWord?.word} verified={verified}
                    correct={verified && placedWordId ? getCorrect(s.id, placedWordId) : undefined}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setVerified(true)}
            disabled={Object.keys(placements).length === 0}
            className="px-6 py-2.5 rounded-xl bg-cobalt text-white text-sm font-semibold hover:bg-navy transition-colors disabled:opacity-40"
          >
            Vérifier
          </button>
          <button
            onClick={() => { setPlacements({}); setVerified(false); }}
            className="px-6 py-2.5 rounded-xl border border-edge text-sm font-semibold text-ink hover:border-cobalt hover:text-cobalt transition-colors"
          >
            Recommencer
          </button>
        </div>

        {verified && (
          <div className="bg-white rounded-2xl p-8 shadow-[0_2px_12px_rgba(8,13,38,0.08)] flex flex-col items-center gap-3">
            <ScoreCircle score={correctCount} total={synCards.length} />
            <p className="text-sm font-medium text-dim">paires correctes</p>
          </div>
        )}
      </div>
    </DndContext>
  );
}
