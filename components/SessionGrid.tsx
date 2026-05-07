"use client";

import { useState } from "react";
import Link from "next/link";
import type { Lesson, Level } from "@/lib/types";

const BLOB_COLORS = ["#FFE066", "#6EE7B7", "#C4B5FD", "#FCA5A5", "#93C5FD", "#FCD34D"];
const BLOB_SHAPES = [
  "60% 40% 30% 70% / 60% 30% 70% 40%",
  "40% 60% 70% 30% / 30% 60% 40% 70%",
  "50% 50% 30% 70% / 40% 60% 60% 40%",
  "70% 30% 50% 50% / 50% 40% 60% 50%",
  "55% 45% 60% 40% / 45% 55% 45% 55%",
  "45% 55% 40% 60% / 55% 45% 55% 45%",
];

function formatDate(raw: string): string {
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function LevelBadge({ level }: { level: Level }) {
  return (
    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
      level === "B2"
        ? "bg-emerald-100 text-emerald-700"
        : "bg-frost text-cobalt"
    }`}>
      {level}
    </span>
  );
}

function IconEye() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
}
function IconCards() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="14" rx="2"/><path d="M6 6V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/></svg>;
}
function IconQCM() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>;
}
function IconMatch() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>;
}
function IconFill() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>;
}

function SessionCard({ lesson, colorIndex }: { lesson: Lesson; colorIndex: number }) {
  return (
    <Link
      href={`/s/${lesson.session}`}
      className="block bg-white rounded-4xl p-8 relative overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
    >
      <div
        className="absolute -top-8 -right-8 w-36 h-36 opacity-60"
        style={{
          background: BLOB_COLORS[colorIndex % BLOB_COLORS.length],
          borderRadius: BLOB_SHAPES[colorIndex % BLOB_SHAPES.length],
        }}
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-cobalt uppercase tracking-widest">
              Session {lesson.session}
            </span>
            <LevelBadge level={lesson.level} />
          </div>
          <span className="text-xs font-bold text-dim bg-edge px-3 py-1 rounded-full">
            {lesson.items.length} mots
          </span>
        </div>
        <h3 className="text-lg font-black text-ink leading-snug mb-5">{lesson.theme}</h3>
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-dim">{formatDate(lesson.date)}</p>
          <div className="flex items-center gap-2 text-dim">
            <IconEye /><IconCards /><IconQCM /><IconMatch /><IconFill />
          </div>
        </div>
      </div>
    </Link>
  );
}

type Filter = "Tout" | Level;

export default function SessionGrid({ lessons }: { lessons: Lesson[] }) {
  const [filter, setFilter] = useState<Filter>("Tout");

  const hasB2 = lessons.some((l) => l.level === "B2");
  const hasC1 = lessons.some((l) => l.level === "C1");

  const filtered = filter === "Tout" ? lessons : lessons.filter((l) => l.level === filter);

  // Group by category
  const grouped: Record<string, Lesson[]> = {};
  for (const lesson of filtered) {
    if (!grouped[lesson.category]) grouped[lesson.category] = [];
    grouped[lesson.category].push(lesson);
  }

  // Global color index (consistent across categories)
  let colorIndex = 0;

  return (
    <div>
      {/* Level filter */}
      <div className="flex items-center gap-2 mb-6">
        {(["Tout", ...(hasB2 ? ["B2"] : []), ...(hasC1 ? ["C1"] : [])] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all ${
              filter === f
                ? f === "B2"
                  ? "bg-emerald-500 text-white"
                  : f === "C1"
                  ? "bg-cobalt text-white"
                  : "bg-ink text-white"
                : "bg-white text-dim hover:text-ink border border-edge"
            }`}
          >
            {f}
          </button>
        ))}
        <span className="text-xs text-dim font-semibold ml-1">
          {filtered.length} session{filtered.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Grouped sessions */}
      {Object.entries(grouped).map(([category, sessions]) => (
        <div key={category} className="mb-8">
          <h2 className="text-xs font-black uppercase tracking-widest text-dim mb-4">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {sessions.map((lesson) => {
              const idx = colorIndex++;
              return <SessionCard key={lesson.session} lesson={lesson} colorIndex={idx} />;
            })}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <p className="text-center py-12 text-dim font-semibold">Aucune session pour ce niveau.</p>
      )}
    </div>
  );
}
