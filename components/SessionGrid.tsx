"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Lesson, Level } from "@/lib/types";
import { getAllPct } from "@/lib/progress";

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
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function LevelBadge({ level }: { level: Level }) {
  return (
    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full flex-shrink-0 ${
      level === "B2" ? "bg-emerald-100 text-emerald-700" : "bg-frost text-cobalt"
    }`}>{level}</span>
  );
}

function ProgressBar({ pct }: { pct: number }) {
  const color = pct === 100 ? "bg-emerald-400" : pct > 0 ? "bg-cobalt" : "bg-edge";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-edge rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-[10px] font-black tabular-nums flex-shrink-0 ${
        pct === 100 ? "text-emerald-600" : pct > 0 ? "text-cobalt" : "text-dim"
      }`}>{pct}%</span>
    </div>
  );
}

function RowCard({ lesson, colorIndex, pct }: { lesson: Lesson; colorIndex: number; pct: number }) {
  return (
    <Link
      href={`/s/${lesson.session}`}
      className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 hover:shadow-md hover:-translate-y-px transition-all duration-200 group"
    >
      <div
        className="w-10 h-10 rounded-xl flex-shrink-0 opacity-70"
        style={{
          background: BLOB_COLORS[colorIndex % BLOB_COLORS.length],
          borderRadius: BLOB_SHAPES[colorIndex % BLOB_SHAPES.length],
        }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-extrabold text-cobalt">S{lesson.session}</span>
          <LevelBadge level={lesson.level} />
          <span className="text-xs text-dim font-semibold truncate">{formatDate(lesson.date)}</span>
        </div>
        <p className="text-sm font-black text-ink truncate">{lesson.theme}</p>
      </div>
      <div className="w-32 flex-shrink-0 hidden sm:block">
        <ProgressBar pct={pct} />
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-xs font-bold text-dim bg-edge px-2.5 py-1 rounded-full">{lesson.items.length} mots</span>
        <svg className="text-dim group-hover:text-cobalt transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </div>
    </Link>
  );
}

function GridCard({ lesson, colorIndex, pct }: { lesson: Lesson; colorIndex: number; pct: number }) {
  return (
    <Link
      href={`/s/${lesson.session}`}
      className="block bg-white rounded-3xl p-5 relative overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      <div
        className="absolute -top-6 -right-6 w-24 h-24 opacity-60"
        style={{
          background: BLOB_COLORS[colorIndex % BLOB_COLORS.length],
          borderRadius: BLOB_SHAPES[colorIndex % BLOB_SHAPES.length],
        }}
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-extrabold text-cobalt">S{lesson.session}</span>
            <LevelBadge level={lesson.level} />
          </div>
          <span className="text-xs font-bold text-dim">{lesson.items.length} mots</span>
        </div>
        <h3 className="text-sm font-black text-ink leading-snug mb-3">{lesson.theme}</h3>
        <ProgressBar pct={pct} />
      </div>
    </Link>
  );
}

type Filter = "Tout" | Level;
type Layout = "rows" | "grid";

export default function SessionGrid({ lessons }: { lessons: Lesson[] }) {
  const [filter, setFilter] = useState<Filter>("Tout");
  const [layout, setLayout] = useState<Layout>("rows");
  const [progress, setProgress] = useState<Record<number, number>>({});

  useEffect(() => { setProgress(getAllPct()); }, []);

  const hasB2 = lessons.some((l) => l.level === "B2");
  const hasC1 = lessons.some((l) => l.level === "C1");
  const filtered = filter === "Tout" ? lessons : lessons.filter((l) => l.level === filter);

  const grouped: Record<string, Lesson[]> = {};
  for (const lesson of filtered) {
    if (!grouped[lesson.category]) grouped[lesson.category] = [];
    grouped[lesson.category].push(lesson);
  }

  let colorIndex = 0;

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          {(["Tout", ...(hasB2 ? ["B2"] : []), ...(hasC1 ? ["C1"] : [])] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                filter === f
                  ? f === "B2" ? "bg-emerald-500 text-white"
                    : f === "C1" ? "bg-cobalt text-white"
                    : "bg-ink text-white"
                  : "bg-white text-dim hover:text-ink border border-edge"
              }`}
            >{f}</button>
          ))}
          <span className="text-xs text-dim font-semibold ml-1">{filtered.length} session{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Layout toggle */}
        <div className="flex items-center bg-white rounded-xl border border-edge p-1 gap-1">
          <button
            onClick={() => setLayout("rows")}
            title="Vue liste"
            className={`p-1.5 rounded-lg transition-colors ${layout === "rows" ? "bg-cobalt text-white" : "text-dim hover:text-ink"}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M3 12h18M3 18h18"/>
            </svg>
          </button>
          <button
            onClick={() => setLayout("grid")}
            title="Vue grille"
            className={`p-1.5 rounded-lg transition-colors ${layout === "grid" ? "bg-cobalt text-white" : "text-dim hover:text-ink"}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
          </button>
        </div>
      </div>

      {Object.entries(grouped).map(([category, sessions]) => (
        <div key={category} className="mb-6">
          <h2 className="text-xs font-black uppercase tracking-widest text-dim mb-3">{category}</h2>
          {layout === "rows" ? (
            <div className="flex flex-col gap-2">
              {sessions.map((lesson) => {
                const idx = colorIndex++;
                return <RowCard key={lesson.session} lesson={lesson} colorIndex={idx} pct={progress[lesson.session] ?? 0} />;
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {sessions.map((lesson) => {
                const idx = colorIndex++;
                return <GridCard key={lesson.session} lesson={lesson} colorIndex={idx} pct={progress[lesson.session] ?? 0} />;
              })}
            </div>
          )}
        </div>
      ))}

      {filtered.length === 0 && (
        <p className="text-center py-12 text-dim font-semibold">Aucune session pour ce niveau.</p>
      )}
    </div>
  );
}
