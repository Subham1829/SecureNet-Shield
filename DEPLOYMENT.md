# Deployment guide

## Overview

| App | Folder | Platform | Default URL |
|-----|--------|----------|-------------|
| Frontend | `client/` | [Vercel](https://vercel.com) | `https://your-app.vercel.app` |
| API | `server/` | [Render](https://render.com) | `https://your-api.onrender.com` |

Deploy the **API first**, then set `API_URL` on Vercel to the API URL.

---

## 1. Deploy API (Render)

1. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint** or **Web Service**.
2. Connect [Soumipal56/soumi_SecureNet-Shield](https://github.com/Soumipal56/soumi_SecureNet-Shield).
3. Use **Root Directory**: `server`.
4. **Build command**: `npm install && npm run build`
5. **Start command**: `npm start`
6. **Health check path**: `/health`

### Environment variables (Render)

| Variable | Example |
|----------|---------|
| `NODE_ENV` | `production` |
| `CLIENT_URL` | `https://your-app.vercel.app` |
| `ALLOWED_ORIGINS` | `https://your-app.vercel.app,https://your-app-*.vercel.app` (optional) |

Copy your Render service URL, e.g. `https://securenet-api.onrender.com`.

---

## 2. Deploy frontend (Vercel)

1. Go to [Vercel](https://vercel.com) → **Add New Project**.
2. Import the same GitHub repo.
3. **Root Directory**: `client` (important).
4. Framework: **Next.js** (auto-detected).

### Environment variables (Vercel)

| Variable | Value |
|----------|--------|
| `API_URL` | `https://securenet-api.onrender.com` (your Render URL, no trailing slash) |

5. Deploy.

The client proxies `/api/*` to your backend via `next.config.mjs` rewrites.

---

## 3. Verify

1. Open `https://your-api.onrender.com/health` → `{ "status": "ok" }`
2. Open your Vercel app → login → dashboard → test export features.

---

## Local production test

```bash
npm run build:server
npm run build --prefix client

# Terminal 1
cd server && npm start

# Terminal 2
cd client && API_URL=http://localhost:4000 npm start
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| CORS errors | Set `CLIENT_URL` on Render to your exact Vercel URL |
| Export API 404 | Check `API_URL` on Vercel matches Render URL |
| Port in use (local) | `npm run dev` in server runs `kill-port` automatically |
