"use client";

import { useRef, useState } from "react";

const KEYS = ["nuance-progress", "nuance-activity", "nuance-theme"];

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}
function UploadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  );
}

export default function BackupRestore() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");

  function exportData() {
    const backup: Record<string, unknown> = { _v: 1, _date: new Date().toISOString() };
    KEYS.forEach(k => {
      const v = localStorage.getItem(k);
      if (v !== null) backup[k] = JSON.parse(v);
    });
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nuance-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        KEYS.forEach(k => {
          if (data[k] !== undefined) localStorage.setItem(k, JSON.stringify(data[k]));
        });
        setStatus("ok");
        setTimeout(() => { setStatus("idle"); window.location.reload(); }, 1200);
      } catch {
        setStatus("err");
        setTimeout(() => setStatus("idle"), 2000);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={exportData}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-edge text-xs font-bold text-dim hover:text-ink hover:border-cobalt transition-all"
        title="Télécharger une sauvegarde de ta progression"
      >
        <DownloadIcon />
        Sauvegarder
      </button>

      <button
        onClick={() => fileRef.current?.click()}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
          status === "ok"  ? "bg-emerald-50 border-emerald-400 text-emerald-700" :
          status === "err" ? "bg-crimson/5 border-crimson/40 text-crimson" :
          "bg-surface border-edge text-dim hover:text-ink hover:border-cobalt"
        }`}
        title="Restaurer une sauvegarde"
      >
        <UploadIcon />
        {status === "ok" ? "Restauré !" : status === "err" ? "Fichier invalide" : "Restaurer"}
      </button>

      <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={importData} />
    </div>
  );
}
