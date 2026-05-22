# SecureNet Shield (IP Guardian)

Monorepo: **Next.js** frontend in `client/`, **Express** API in `server/`.

## Project structure

```
├── client/          # Next.js frontend
├── server/          # Express API + export file storage
├── package.json     # Run both apps from the root
└── README.md
```

## Quick start

```bash
npm install
npm run install:all
npm run dev
```

| Service  | URL                     |
|----------|-------------------------|
| Frontend | http://localhost:3000 |
| API      | http://localhost:4000 |

## Scripts (root)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start client + server |
| `npm run dev:client` | Next.js only |
| `npm run dev:server` | API only |
| `npm run build` | Build client |
| `npm run build:server` | Build server |
| `npm run install:all` | Install client & server deps |

## Environment variables

**Client** — copy `client/.env.example` to `client/.env.local`:

- `API_URL` — backend URL for Next.js rewrites (default `http://localhost:4000`)

**Server** — copy `server/.env.example` to `server/.env`:

- `PORT` — default `4000`
- `CLIENT_URL` — CORS origin (your frontend URL in production)
- `ALLOWED_ORIGINS` — optional comma-separated extra origins

## Deployment

### Frontend (Vercel)

1. Import repo on [Vercel](https://vercel.com).
2. Set **Root Directory** to `client`.
3. Add environment variable: `API_URL` = your deployed API URL (e.g. `https://securenet-api.onrender.com`).

### Backend

1. Deploy the API from the `server` folder on your chosen host.
2. Set `CLIENT_URL` to your frontend URL in production.
3. Optional: `ALLOWED_ORIGINS` for preview deployments.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step details.

## API routes

- `GET /health` — health check
- `POST /api/exports` — save export file
- `GET /api/exports?filename=` — download file
- `GET /api/exports?action=list` — list files
- `DELETE /api/exports?filename=` — delete file
- `GET /api/exports/bulk` — storage stats
- `DELETE /api/exports/bulk` — bulk delete

Export files are stored in `server/exports/`.
