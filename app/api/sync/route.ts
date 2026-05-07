import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "nuance-sync.json");

interface UserStore {
  "nuance-progress"?: { sessions: Record<string, string[]> };
  "nuance-activity"?: { dates: string[] };
  _updated?: string;
}

type SyncFile = Record<string, UserStore>;

function readFile(): SyncFile {
  try { return JSON.parse(fs.readFileSync(FILE, "utf-8")); }
  catch { return {}; }
}

function writeFile(data: SyncFile) {
  const dir = path.dirname(FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) return NextResponse.json({}, { status: 401 });

  const file = readFile();
  return NextResponse.json(file[email] ?? {});
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const incoming = await req.json() as UserStore;
    const file = readFile();
    const current: UserStore = file[email] ?? {};

    // Progress: union of completed exercise arrays per session
    const cp = current["nuance-progress"]?.sessions ?? {};
    const ip = incoming["nuance-progress"]?.sessions ?? {};
    const mergedSessions: Record<string, string[]> = { ...cp };
    for (const [sid, exos] of Object.entries(ip)) {
      const existing = new Set(mergedSessions[sid] ?? []);
      for (const e of exos) existing.add(e);
      mergedSessions[sid] = Array.from(existing);
    }

    // Activity: union of date arrays
    const cd = new Set(current["nuance-activity"]?.dates ?? []);
    for (const d of incoming["nuance-activity"]?.dates ?? []) cd.add(d);

    file[email] = {
      "nuance-progress": { sessions: mergedSessions },
      "nuance-activity": { dates: Array.from(cd).sort() },
      _updated: new Date().toISOString(),
    };

    writeFile(file);
    return NextResponse.json(file[email]);
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
}
