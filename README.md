# SecureNet Shield (IP Guardian)

Monorepo with a **Next.js frontend** (`client/`) and **Express API** (`server/`).

## Project structure

```
├── client/          # Next.js frontend (pages, components, UI)
├── server/          # Express backend (export file API)
└── package.json     # Run both with npm run dev
```

## Quick start

Install dependencies for both apps:

```bash
npm install
npm run install:all
```

Run frontend + backend together:

```bash
npm run dev
```

| Service  | URL                      |
|----------|--------------------------|
| Frontend | http://localhost:3000  |
| API      | http://localhost:4000  |

The client proxies `/api/*` to the server (see `client/next.config.mjs`).

### Run separately

```bash
npm run dev:server   # API on port 4000
npm run dev:client   # Next.js on port 3000
```

## Environment variables

**Server** (`server/.env` optional):

- `PORT` — default `4000`
- `CLIENT_URL` — CORS origin, default `http://localhost:3000`

**Client** (`client/.env.local` optional):

- `API_URL` — backend URL for Next.js rewrites, default `http://localhost:4000`

## API routes

- `POST /api/exports` — save export file
- `GET /api/exports?filename=` — download file
- `GET /api/exports?action=list` — list files
- `DELETE /api/exports?filename=` — delete file
- `GET /api/exports/bulk` — storage stats
- `DELETE /api/exports/bulk` — bulk delete
- `GET /health` — health check

Export files are stored in `server/exports/`.
