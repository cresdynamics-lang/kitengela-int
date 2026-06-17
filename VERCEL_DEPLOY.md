# Deploying Kitengela on Vercel

Vite frontend (`dist/`) + Express API (`api/[...path].ts` → `server/app.ts`).

## Deploy

1. Import the repo in [Vercel](https://vercel.com).
2. **Root Directory:** `.` (repo root).
3. **Build:** `npm run build` (default). **Output:** `dist`.
4. **Environment variables** (Settings → Environment Variables — all environments):

| Variable | Required | Notes |
|----------|----------|--------|
| `SUPABASE_URL` | Yes | Same as `VITE_SUPABASE_URL` |
| `SUPABASE_ANON_KEY` | Yes | Same as `VITE_SUPABASE_ANON_KEY` |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Service-role JWT (server only) |
| `DATABASE_URL` | Yes | Postgres connection string |
| `ADMIN_EMAILS` | Yes | Comma-separated admin emails |
| `ADMIN_USERNAMES` | Yes | Comma-separated usernames |
| `ADMIN_PASSWORD` | Yes | Shared admin password (min 6 chars) |
| `VITE_SUPABASE_URL` | Yes | Exposed to browser at build time |
| `VITE_SUPABASE_ANON_KEY` | Yes | Exposed to browser at build time |
| `RESEND_API_KEY` | No | Contact form email notifications |

Leave `VITE_API_URL` **empty** — the site calls `/api` on the same domain.

5. **Redeploy** after adding or changing env vars.

## Verify after deploy

```bash
curl https://YOUR-DOMAIN.vercel.app/api/debug
curl -X POST https://YOUR-DOMAIN.vercel.app/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"your@email","password":"your-password"}'
```

`/api/debug` should show `envAdminConfigured: true`.

## Local development

```bash
npm install
cp .env.example .env
# Edit .env (Supabase + ADMIN_* vars)
npm run dev
```

Open http://localhost:3000. Use **`npm run dev`** (not `dev:client` alone) so the API runs on port 3001 and Vite proxies `/api` to it.

After changing `.env`, restart `npm run dev` — the API does not hot-reload env changes.
