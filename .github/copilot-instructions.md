## Quick orientation for AI coding agents

This repo is a mostly-frontend, vanilla HTML/CSS/JS product (Samyak Gyan). Additions and fixes should preserve the current zero-dependency front-end style unless a Vite-based module is intentionally adopted (see `package.json`).

Key facts the agent must know:

- Big picture: front-end (this repo) is static UI + client-side integrations; backend is a separate service (documented under `docs/BACKEND_COMPLETE.md`). Front-end communicates with the backend via REST endpoints described in the docs (e.g. `/api/users/:userId/*`, `/api/community/*`).

- Primary places to look:
  - `docs/` — canonical project and backend specs (start with `BACKEND_COMPLETE.md` and `User_Dashboard.md`).
  - `user_dashboard_master.html` and `user_dashboard_testbed.html` — full-featured front-end dashboard implementations and UX flows.
  - `scripts/user_dashboard.js` — front-end behavioral logic (authentication, dashboard state, localStorage keys).
  - `components/header.html` — included header used by many pages; keep compatibility when changing layout or scripts.
  - `src/` and `package.json` — a small Vite setup exists for experimental module-based pages (use `npm run dev` if you intentionally choose Vite builds).

- Authentication & session hints:
  - Telegram is the auth mechanism. Front-end tries these locations for user identity: `localStorage.userId`, `localStorage.currentUser`, and `window.Telegram.WebApp.initDataUnsafe.user` (see `scripts/user_dashboard.js:getUserId`).
  - Do not remove or rename these localStorage keys without updating all scripts that read them.

- Important domain-specific rules and patterns (enforceable, discoverable):
  - Highlight limit rule: backend enforces a 20% per-article highlight limit; front-end sends `article_id`/`data-article-id` in requests. See `docs/BACKEND_COMPLETE.md` for the precise validation logic.
  - Month + fortnight model: analytics pages use a rolling 12-month window and two fortnights per month (1–15, 16–end). Endpoint patterns and helper functions are in `docs/User_Dashboard.md` and `scripts/user_dashboard.js`.
  - Subscription states: two independent topics (`current_affairs`, `ethics_essay`) with five effective UI states — consult `docs/` before changing access flow or redirects.

- Naming & UI conventions to follow:
  - CSS/UI tokens: `topic-chip`, `fortnight-chip`, `glow-pulse` are used by access/redirect flows. When implementing visual changes prefer toggling these classes rather than rewriting inline styles.
  - Popup flows: referral popup (`popup-overlay`/`popup-box`) and subscription popup (`subscription-popup-overlay`) follow specific auto-close/analytics patterns — preserve event names used in analytics (e.g. `popup_viewed`, `referral_link_generated`).

- Running and testing locally:
  - Minimal static debug: open the HTML files in a browser (e.g. `user_dashboard_master.html`) — no build required.
  - Vite-powered pages: run `npm install` then `npm run dev` to start the dev server (see `package.json`). Use Vite only for files under `src/`.

- API stubs & integration guidance:
  - Many front-end files contain TODOs and use dummy data. When wiring to a real backend, follow endpoints in `docs/BACKEND_COMPLETE.md` and keep response shapes consistent with documented JSON examples.
  - Avoid hardcoding backend URLs; prefer the existing relative `/api/...` paths so deployments can proxy as intended.

Quick dos & don'ts for code changes by an AI:

- Do: make small, well-scoped edits; when changing an API shape, update the `docs/` files and any front-end consumer (search `fetch('/api')` occurrences).
- Do: prefer toggling existing CSS classes (e.g. `glow-pulse`) rather than wholesale style rewrites.
- Don't: remove Telegram auth fallbacks (localStorage + Telegram WebApp checks) — they are used across multiple pages.
- Don't: assume a full backend exists — many pages use dummy data and expect the backend to be implemented separately; if you need to add a server, document the new endpoints in `docs/`.

Where to leave notes for humans:
 - Add short notes to `docs/` or append to `docs/README.md` for architectural changes. For small clarifications, add concise comments directly above modified functions.

If anything below is unclear or you need additional examples, ask for the specific page or flow to inspect (I can point to exact lines in `user_dashboard_master.html` or `scripts/user_dashboard.js`).

— End of instructions —
