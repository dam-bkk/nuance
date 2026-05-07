import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "nuance-sync.json");

interface SyncStore {
  "nuance-progress"?: { sessions: Record<string, string[]> };
  "nuance-activity"?: { dates: string[] };
  _updated?: string;
}

function readStore(): SyncStore {
  try { return JSON.parse(fs.readFileSync(FILE, "utf-8")); }
  catch { return {}; }
}

function writeStore(data: SyncStore) {
  const dir = path.dirname(FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

export async function GET() {
  return NextResponse.json(readStore());
}

export async function POST(req: NextRequest) {
  try {
    const incoming = await req.json() as SyncStore;
    const current = readStore();

    // Progress: union of completed exercise arrays per session
    const cp = current["nuance-progress"]?.sessions ?? {};
    const ip = incoming["nuance-progress"]?.sessions ?? {};
    const mergedSessions: Record<string, string[]> = { ...cp };
    for (const [session, exos] of Object.entries(ip)) {
      const existing = new Set(mergedSessions[session] ?? []);
      for (const e of exos) existing.add(e);
      mergedSessions[session] = Array.from(existing);
    }

    // Activity: union of date arrays
    const cd = new Set(current["nuance-activity"]?.dates ?? []);
    const id = incoming["nuance-activity"]?.dates ?? [];
    for (const d of id) cd.add(d);

    const merged: SyncStore = {
      "nuance-progress": { sessions: mergedSessions },
      "nuance-activity": { dates: Array.from(cd).sort() },
      _updated: new Date().toISOString(),
    };

    writeStore(merged);
    return NextResponse.json(merged);
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
}
