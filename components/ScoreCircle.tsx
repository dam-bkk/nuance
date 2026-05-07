"use client";

import { useEffect, useState } from "react";

const R = 54;
const CIRC = 2 * Math.PI * R; // 339.3

export default function ScoreCircle({ score, total }: { score: number; total: number }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const [offset, setOffset] = useState(CIRC);

  useEffect(() => {
    const t = setTimeout(() => setOffset(CIRC * (1 - pct / 100)), 80);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={R} fill="none" stroke="#E0D8CF" strokeWidth="9" />
          <circle
            cx="60" cy="60" r={R}
            fill="none"
            stroke="#22c55e"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.4,0,.2,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif text-4xl font-bold text-navy">{pct}%</span>
          <span className="text-xs text-[#6B7A99] mt-0.5">{score} / {total}</span>
        </div>
      </div>
    </div>
  );
}
