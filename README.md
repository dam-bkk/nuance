# Nuance

French language learning SaaS for DELF B2 / DALF C1 preparation.  
Single student, private, deployed at **nuance.damien.asia**.

## Stack

- **Framework:** Next.js 14 App Router, TypeScript (`output: 'standalone'`)
- **Styling:** Tailwind CSS v3 with CSS variable theming (light + dark mode)
- **Auth:** NextAuth v4 — Google OAuth, single whitelisted Gmail
- **Sync:** `/api/sync` endpoint + Docker volume `/app/data` for cross-device progress
- **Content:** Markdown files in `content/` parsed by `lib/parse-*.ts`

## Modules

- **Vocabulaire** — flashcards, QCM, synonymes, glisser-déposer, textes à trous, définitions
- **Grammaire** — multiple-choice grammar exercises by category
- **Examens** — reading comprehension (CE) with VFND + QCM questions
- **Tableau de bord** — activity calendar, session progress grid

## Local dev

```bash
npm install
cp .env.local.example .env.local   # fill in OAuth credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=          # openssl rand -base64 32
NEXTAUTH_URL=https://nuance.damien.asia
NUANCE_ALLOWED_EMAIL=     # the student's Gmail address
```

For local dev also add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI in Google Cloud Console.

## Docker deployment

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
  -e NUANCE_ALLOWED_EMAIL=... \
  nuance:latest
```

The `nuance-data` volume persists cross-device sync data (`nuance-sync.json`) across container rebuilds.

## Deploy flow

```
git push → VM git pull → docker build → docker run
```

Never `docker cp` code. Fix locally, push, rebuild.
