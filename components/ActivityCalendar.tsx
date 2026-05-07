"use client";

import { useState, useEffect } from "react";
import { getMonthActivity } from "@/lib/activity";

const MONTHS_FR = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const DAYS_FR = ["L","M","M","J","V","S","D"];

export default function ActivityCalendar() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [activeDays, setActiveDays] = useState<Set<number>>(new Set());

  useEffect(() => {
    setActiveDays(getMonthActivity(year, month));
  }, [year, month]);

  function prevMonth() {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
  }

  const firstDay = new Date(year, month - 1, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month, 0).getDate();
  const today = now.getFullYear() === year && now.getMonth() + 1 === month ? now.getDate() : -1;

  const cells: (number | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const streak = (() => {
    let s = 0;
    const d = new Date();
    while (true) {
      const key = d.toISOString().slice(0, 10);
      const [y, m, day] = key.split("-").map(Number);
      if (getMonthActivity(y, m).has(day)) { s++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return s;
  })();

  return (
    <div className="bg-white rounded-3xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-dim">Activité</p>
          {streak > 0 && (
            <p className="text-xs font-bold text-cobalt mt-0.5">{streak} jour{streak > 1 ? "s" : ""} d'affilée</p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-pg text-dim hover:text-ink transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <span className="text-xs font-extrabold text-ink w-20 text-center">{MONTHS_FR[month - 1].slice(0, 3)} {year}</span>
          <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-pg text-dim hover:text-ink transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {DAYS_FR.map((d, i) => (
          <div key={i} className="text-center text-[10px] font-black text-dim py-1">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const active = activeDays.has(day);
          const isToday = day === today;
          return (
            <div
              key={i}
              className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                active
                  ? "bg-cobalt text-white"
                  : isToday
                  ? "border-2 border-cobalt text-cobalt"
                  : "text-dim"
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-dim font-semibold mt-3 text-center">
        {activeDays.size} jour{activeDays.size !== 1 ? "s" : ""} pratiqué{activeDays.size !== 1 ? "s" : ""} ce mois
      </p>
    </div>
  );
}
