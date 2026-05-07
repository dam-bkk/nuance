const SYNC_KEYS = ["nuance-progress", "nuance-activity"] as const;

function getLocalData() {
  const out: Record<string, unknown> = {};
  for (const k of SYNC_KEYS) {
    try { out[k] = JSON.parse(localStorage.getItem(k) ?? "{}"); } catch { out[k] = {}; }
  }
  return out;
}

function applyServerData(data: Record<string, unknown>) {
  for (const k of SYNC_KEYS) {
    if (data[k] !== undefined) {
      try { localStorage.setItem(k, JSON.stringify(data[k])); } catch {}
    }
  }
}

// On app load: pull server data, merge into localStorage
export async function pullSync() {
  try {
    const res = await fetch("/api/sync");
    if (!res.ok) return;
    const data = await res.json();
    applyServerData(data);
  } catch {}
}

// After any progress change: push localStorage to server (server merges)
export async function pushSync() {
  try {
    await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(getLocalData()),
    });
  } catch {}
}
