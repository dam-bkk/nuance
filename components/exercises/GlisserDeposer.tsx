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
type SynCard  = { id: string; synText: string; itemIndex: number };

function DraggableWord({ id, word, placed, verified, correct }: {
  id: string; word: string; placed: boolean; verified: boolean; correct?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  const style = transform ? { transform: `translate3d(${transform.x}px,${transform.y}px,0)`, zIndex: 50 } : undefined;

  let cls = "px-3 py-2 rounded-xl border-2 text-sm font-bold cursor-grab active:cursor-grabbing transition-all ";
  if (verified && correct !== undefined)
    cls += correct ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-crimson/30 bg-crimson/5 text-crimson";
  else if (placed)
    cls += "border-edge bg-pg text-dim opacity-40";
  else
    cls += "border-edge bg-white text-ink hover:border-cobalt hover:shadow-sm";

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}
      className={cls + (isDragging ? " opacity-50 shadow-xl scale-105" : "")}>
      {word}
    </div>
  );
}

function DroppableSyn({ id, synText, wordPlaced, verified, correct }: {
  id: string; synText: string; wordPlaced?: string; verified: boolean; correct?: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  let cls = "min-h-[2.75rem] px-4 py-2.5 rounded-xl border-2 text-sm transition-all ";
  if (verified && correct !== undefined)
    cls += correct ? "border-emerald-300 bg-emerald-50" : "border-crimson/30 bg-crimson/5";
  else if (isOver)
    cls += "border-cobalt bg-frost";
  else
    cls += "border-edge bg-pg";

  return (
    <div ref={setNodeRef} className={cls}>
      <span className="text-dim italic">{synText}</span>
      {wordPlaced && <span className="ml-2 font-black text-cobalt">← {wordPlaced}</span>}
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

  if (eligible.length < 2)
    return <p className="text-dim text-center py-12 font-semibold">Pas assez de mots avec des synonymes pour cet exercice.</p>;

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
    const syn  = synCards.find((s) => s.id === synId);
    const word = wordCards.find((w) => w.id === wordId);
    return !!syn && !!word && syn.itemIndex === word.itemIndex;
  }

  const placedWordIds = new Set(Object.values(placements));
  const correctCount  = Object.entries(placements).filter(([sId, wId]) => getCorrect(sId, wId)).length;
  const allPlaced     = Object.keys(placements).length === synCards.length;

  if (verified) {
    const mistakes = synCards.filter((s) => {
      const wId = placements[s.id];
      return !wId || !getCorrect(s.id, wId);
    });
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <div className="bg-cobalt rounded-4xl p-10 flex flex-col items-center gap-4">
          <ScoreCircle score={correctCount} total={synCards.length} />
          <p className="text-sm font-extrabold text-white/80">bonnes paires</p>
        </div>
        {mistakes.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-dim">À revoir</h3>
            {mistakes.map((s) => {
              const correct = eligible[s.itemIndex];
              const givenId = placements[s.id];
              const given   = wordCards.find((w) => w.id === givenId);
              return (
                <div key={s.id} className="bg-white rounded-2xl p-4">
                  <p className="font-black text-ink">{correct.word}</p>
                  <p className="text-xs text-dim mt-1">Synonyme : <span className="font-semibold text-ink">{s.synText}</span></p>
                  {given && <p className="text-xs text-crimson mt-0.5 font-semibold">Répondu : «&nbsp;{given.word}&nbsp;»</p>}
                </div>
              );
            })}
          </div>
        )}
        <button
          onClick={() => { setPlacements({}); setVerified(false); }}
          className="w-full py-4 rounded-2xl bg-cobalt text-white text-sm font-black hover:bg-navy transition-colors">
          Recommencer
        </button>
      </div>
    );
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="max-w-lg mx-auto space-y-4">
        {/* Cobalt header card */}
        <div className="bg-cobalt rounded-4xl p-8 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-36 h-36 bg-white/5 rounded-full" />
          <div className="relative">
            <p className="text-xs font-extrabold text-white/60 uppercase tracking-widest mb-3">Match</p>
            <p className="text-lg font-black text-white mb-1">Glisser-déposer</p>
            <p className="text-sm text-white/70 font-semibold">
              Faites glisser chaque mot vers son synonyme.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex gap-1 flex-1">
                {synCards.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full flex-1 transition-colors ${
                    Object.values(placements).length > i ? "bg-white/60" : "bg-white/20"
                  }`} />
                ))}
              </div>
              <span className="text-xs font-extrabold text-white/60 shrink-0">
                {Object.keys(placements).length}/{synCards.length}
              </span>
            </div>
          </div>
        </div>

        {/* Drag area */}
        <div className="bg-white rounded-4xl p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-dim mb-3">Mots</p>
              <div className="space-y-2">
                {wordCards.map((w) => (
                  <DraggableWord
                    key={w.id} id={w.id} word={w.word}
                    placed={placedWordIds.has(w.id)} verified={false}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-dim mb-3">Synonymes</p>
              <div className="space-y-2">
                {synCards.map((s) => {
                  const placedWordId = placements[s.id];
                  const placedWord   = wordCards.find((w) => w.id === placedWordId);
                  return (
                    <DroppableSyn
                      key={s.id} id={s.id} synText={s.synText}
                      wordPlaced={placedWord?.word} verified={false}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => setVerified(true)}
            disabled={!allPlaced}
            className="flex-1 py-4 rounded-2xl bg-cobalt text-white text-sm font-black hover:bg-navy transition-colors disabled:opacity-40">
            Vérifier
          </button>
          <button
            onClick={() => { setPlacements({}); setVerified(false); }}
            className="px-6 py-4 rounded-2xl border-2 border-edge text-sm font-bold text-ink hover:border-cobalt hover:text-cobalt transition-colors">
            Recommencer
          </button>
        </div>
      </div>
    </DndContext>
  );
}
