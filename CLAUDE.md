# Nuance — CLAUDE.md

French language learning SaaS for a single student (Guy, DELF B2 / DALF C1 prep).  
Live at: **nuance.damien.asia** (Azure VM, Docker + Caddy, same infra as other projects).

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 App Router, TypeScript, `output: 'standalone'` |
| Styling | Tailwind CSS v3, `darkMode: "class"`, CSS variables for theming |
| Auth | NextAuth v4 — Google provider, single whitelisted Gmail |
| Sync | `/api/sync` → JSON file on Docker volume `/app/data/nuance-sync.json` |
| Content | Markdown files in `content/` parsed by `lib/parse-*.ts` |
| Font | Nunito (Google Fonts, loaded in layout) |

---

## Key conventions

### Theme system
CSS variables defined in `globals.css`:
- `:root` = light mode: `--pg #F5F5F7`, `--ink #1A1A2E`, `--surface #FFFFFF`, `--dim #6B7280`, `--edge #E5E7EB`, `--frost #F9FAFB`
- `html.dark` overrides: `--pg #0D1225`, `--ink #E8ECFF`, `--surface #1B2035`, `--dim #7A8099`, `--edge #252B40`, `--frost #1B2038`

Tailwind aliases: `bg-pg`, `text-ink`, `bg-surface`, `text-dim`, `border-edge`, `bg-frost`

**Never use `bg-white` for cards or layout surfaces** — always `bg-surface` so dark mode works.

`--cobalt` (`#2D5BE3`) is the primary accent. `bg-cobalt`, `text-cobalt`.

No-FOUC inline script in `<head>` (layout.tsx) reads `nuance-theme` from localStorage before paint.

### Language / tone
- All UI copy in **French**
- Address Guy with **tu/toi**, never vous — in nav, buttons, instructions, tooltips
- Exception: comprehension texts (authentic documents) are untouched

### Max width
All pages use `max-w-[1250px]` — do not revert to `max-w-4xl`.

### No emojis
Never use emojis as UI elements, icons, or decorative elements. Use SVG or CSS shapes.

---

## File map

```
app/
  layout.tsx           Root layout — Nunito font, no-FOUC script, AuthProvider, SyncProvider
  page.tsx             Home — WelcomeBar + Greeting + 3 module nav cards
  login/page.tsx       Google sign-in page
  grammaire/page.tsx   Grammar module list
  s/[session]/page.tsx Session detail with 6 exercises
  examens/[id]/page.tsx Exam (CE/PE) player
  api/auth/[...nextauth]/route.ts  NextAuth handler
  api/sync/route.ts    GET/POST sync endpoint (reads/writes /app/data/nuance-sync.json)

components/
  AppHeader.tsx        Nav bar (logo + back link)
  WelcomeBar.tsx       Date/time/city/weather/dark-mode toggle widget
  Greeting.tsx         "Bonjour Guy" / "Bonsoir Guy" based on hour
  LessonTabs.tsx       Vocabulary tabs (Flashcards, QCM, etc.)
  GrammaireQCM.tsx     Grammar QCM page component
  ExamenCE.tsx         Exam comprehension component
  ActivityCalendar.tsx Monthly practice calendar (heatmap style)
  SessionGrid.tsx      Session progress grid
  BackupRestore.tsx    Manual JSON export/import for localStorage
  SyncProvider.tsx     Calls pullSync() on mount
  AuthProvider.tsx     SessionProvider wrapper for NextAuth
  exercises/
    QCM.tsx / TexteATrous.tsx / DefMot.tsx / SynonymeQuiz.tsx / GlisserDeposer.tsx

lib/
  progress.ts          nuance-progress localStorage (sessions → exercises done)
  activity.ts          nuance-activity localStorage (dates practiced)
  sync.ts              pullSync / pushSync — syncs localStorage ↔ /api/sync
  parse-lesson.ts / parse-grammaire.ts / parse-examen.ts
  types.ts

content/
  session-1.md / session-2.md   Lesson content (vocabulary sessions)
  grammaire/                    Grammar exercises
  examens/                      Exam documents
```

---

## Progress & sync data model

**localStorage keys synced across devices:**

`nuance-progress`:
```json
{ "sessions": { "1": ["flashcards", "qcm", "synonymes", "glisser", "trous", "def"] } }
```
Exercise name strings are the done markers — additive only (never un-mark).

`nuance-activity`:
```json
{ "dates": ["2026-05-07", "2026-05-08"] }
```

**Server file** (`/app/data/nuance-sync.json`):
```json
{
  "nuance-progress": { ... },
  "nuance-activity": { ... },
  "_updated": "2026-05-07T10:00:00.000Z"
}
```
Merge is union (additive) — POST handler merges, never overwrites.

---

## Auth

NextAuth v4, Google provider. Comma-separated whitelist via `NUANCE_ALLOWED_EMAILS` env var.  
Middleware (`middleware.ts`) redirects unauthenticated requests to `/login`.  
Allowed through without auth: `/api/auth/*`, `/_next/*`, `/login`, `/favicon*`.

---

## Environment variables

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=          # openssl rand -base64 32
NEXTAUTH_URL=https://nuance.damien.asia
NUANCE_ALLOWED_EMAILS=     # Guy's Gmail
```

---

## Docker / deployment

```bash
docker build -t nuance:latest .
docker run -d \
  --name nuance \
  -p 3000:3000 \
  -v nuance-data:/app/data \
  -e GOOGLE_CLIENT_ID=... \
  -e GOOGLE_CLIENT_SECRET=... \
  -e NEXTAUTH_SECRET=... \
  -e NEXTAUTH_URL=https://nuance.damien.asia \
  -e NUANCE_ALLOWED_EMAILS=... \
  nuance:latest
```

Volume `nuance-data` persists `nuance-sync.json` across rebuilds.  
Deploy flow: push to `git@github.com:dam-bkk/nuance.git` → VM git pull → docker rebuild.  
**Never docker cp code.** Fix local → git → rebuild.

Caddy reverse-proxies port 3000 under `nuance.damien.asia`.

---

## Google Cloud Console setup (OAuth)

- Authorized redirect URI: `https://nuance.damien.asia/api/auth/callback/google`
- Also add `http://localhost:3000/api/auth/callback/google` for local dev
