# Cloudflare Worker Steam Proxy

This worker replaces the old Glitch proxy and keeps the same API routes used by the frontend:

- `GET /api/most-played-games`
- `GET /api/top-releases`
- `GET /api/game-details/:appid`
- `GET /api/genre/:tag`

## 1) Prerequisites

- Cloudflare account
- Node.js 18+
- Steam Web API key

## 2) Local setup

Run from this directory:

```bash
cd workers/steam-proxy
npx wrangler login
npx wrangler secret put STEAM_API_KEY
npx wrangler dev
```

## 3) Deploy

```bash
cd workers/steam-proxy
npx wrangler deploy
```

After deploy, copy the Worker URL:

`https://todaygames-steam-proxy.<your-subdomain>.workers.dev`

## 4) Frontend environment variable

Set `REACT_APP_SERVER_URL` in your project `.env.local`:

```env
REACT_APP_SERVER_URL=https://todaygames-steam-proxy.<your-subdomain>.workers.dev
```

Then restart your React dev server.
