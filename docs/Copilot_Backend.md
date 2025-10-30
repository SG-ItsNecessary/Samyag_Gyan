# Copilot_Backend.md — Developer-facing Backend Guide (Copilot)

Last updated: 2025-10-22

Purpose
-------
This document is a developer-focused, Copilot-curated backend implementation guide derived from the project's canonical docs (`docs/BACKEND_COMPLETE.md` and `PROJECT_STATUS.md`). It is intentionally separate from the original documentation so you can clearly see implementation notes, API contracts, migration suggestions, environment variables, and recommended developer workflows. Do not modify the original docs in `docs/` unless you want the canonical version changed.

Scope
-----
- Concrete API endpoints (paths, verbs, request/response shapes)
- Authentication approach (Telegram + session pattern recommended)
- Database schema overview and migration guidance
- Dev environment and Docker-compose for local testing
- Testing guidance (unit + integration) and CI suggestions
- Integration checklists for frontend/back-end wiring

API Contract (summary)
----------------------
These endpoints cover the crucial flows used by the frontend: authentication, article listing, user interactions, summaries, highlights, and the notes download generator.

Base path: `/api`

1) Health
- GET /api/health
  - Response: 200 OK { "status": "ok", "version": "<semver or commit>" }

2) Auth
- POST /api/auth/telegram
  - Purpose: Accept Telegram auth payload (or an exchange token) and issue a server session (JWT) or a short-lived token
  - Request body (example):
    {
      "telegram_user": { "id": "123456789", "first_name": "Asha", "username": "asha_" },
      "auth_hash": "<telegram-check-string>"
    }
  - Response success: 200 OK
    {
      "userId": "123456789",
      "token": "<jwt>",
      "user": { "id": 123, "name": "Asha", "language": "en", "trial_ends": "2025-11-05" }
    }
  - Error: 401 Unauthorized on invalid check

Notes on Telegram flow
- Validate the Telegram login widget payload server-side using the official verification method (HMAC sha256 using bot token).
- For local development, provide a dev-only `/api/auth/dev-login` that accepts a userId to create a session (convenience only).
- Keep frontend compatibility with expected localStorage keys: `localStorage.userId` and `localStorage.currentUser` — the frontend expects these for some flows.

3) Articles
- GET /api/articles
  - Query params (optional): ?topic=current-affairs&date=2025-01-18&page=1
  - Response: 200 OK {
      "articles": [{ "id": 42, "slug":"article-slug", "title":"...", "date":"2025-01-18", "summary":"...", "topics": ["current-affairs"] }],
      "page": 1, "totalPages": 12
    }

- GET /api/articles/:articleId
  - Response: full article object including content and metadata

4) Interactions (single endpoint for common actions)
- POST /api/articles/:articleId/interact
  - Body: { "userId": "123456789", "actionType": "read" | "bookmark" | "magazine_worthy" | "summary_opened", "metadata": { ... } }
  - Response: 200 OK { "ok": true }
  - Behavior: record into `public_interactions` table with timestamp. Avoid duplicate insert for idempotent actions (like toggled bookmark) — use upsert where applicable.

5) Summaries
- POST /api/articles/:articleId/summary
  - Body: { "userId": "123456789", "summaryText": "... up to 150 words ...", "language": "en" }
  - Response: 200 OK { "ok": true, "savedAt": "2025-10-22T12:00:00Z" }
  - Behavior: Insert or update `summaries` table (unique on user_id + article_id)

- GET /api/users/:userId/summaries
  - Response: list of summaries for user

6) Highlights
- POST /api/articles/:articleId/highlights
  - Body: { "userId": "123456789", "highlights": [{ "startOffset": 234, "endOffset": 290, "text":"...", "color": "yellow" }, ...] }
  - Response: 200 OK { "ok": true }
  - Behavior: Store highlights (linked to article + user). Enforce 20% per-article limit server-side (percentage calculation based on article content length). Reject with 422 Unprocessable Entity when exceeded.

7) Download notes
- GET /api/users/:userId/download-notes?format=txt
  - Response: 200 OK with `Content-Disposition: attachment; filename="notes-YYYY-MM-DD.txt"` and text body containing compiled notes (highlights + summaries + article metadata)
  - Implementation: assemble summaries and highlights, format text file, stream as attachment

Data Model (simplified)
-----------------------
Below are the recommended core tables. Add indexes on foreign keys and activity timestamps.

users
- id (pk, serial)
- telegram_id (string)
- name
- username
- language
- trial_ends (date)
- created_at, updated_at

articles
- id (pk)
- slug (unique)
- title
- content (text)
- excerpt
- date (nullable) -- news/editorials have dates; ethics/essays are timeless (null date)
- topics (jsonb or text array)
- created_at, updated_at

public_interactions
- id
- user_id (fk)
- article_id (fk)
- action_type (enum/text) -- 'read','bookmark','magazine_worthy','summary_opened', etc.
- metadata (jsonb)
- created_at

summaries
- id
- user_id (fk)
- article_id (fk)
- summary_text (text)
- language
- created_at, updated_at
- unique(user_id, article_id)

highlights
- id
- user_id
- article_id
- start_offset (int)
- end_offset (int)
- text (text)
- color (text)
- created_at

Suggested migration tooling
---------------------------
- Recommended: `node-pg-migrate` or `knex` for JS projects.
- Create initial migrations for the tables above.
- Keep seed data for a few sample articles and a dev test user.

Environment variables (.env.example)
-----------------------------------
- PORT=3000
- DATABASE_URL=postgres://user:pass@localhost:5432/samyak_gyan_dev
- JWT_SECRET=your_jwt_secret
- TELEGRAM_BOT_TOKEN=123456:ABC-DEF
- NODE_ENV=development

Local development with Docker
----------------------------
Provide a minimal `docker-compose.yml` (example outline below) so developers can bring up a Postgres instance and the API.

docker-compose.yml (suggestion)

version: '3.8'
services:
  db:
    image: postgres:14
    environment:
      POSTGRES_USER: samyak
      POSTGRES_PASSWORD: samyak
      POSTGRES_DB: samyak_dev
    ports:
      - '5432:5432'
    volumes:
      - db-data:/var/lib/postgresql/data

  api:
    build: .
    environment:
      - DATABASE_URL=postgres://samyak:samyak@db:5432/samyak_dev
      - JWT_SECRET=secret
      - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
    ports:
      - '3000:3000'
    depends_on:
      - db

volumes:
  db-data:

Running locally (example)

# build and start
docker-compose up --build

# or run locally using node (after installing deps)
npm install
npm run dev

Testing guidance
----------------
- Unit tests: Jest for controllers and utility functions
- Integration tests: Supertest to exercise endpoints against a test database
- Use `NODE_ENV=test` and a separate test database (or testcontainers) to isolate tests
- Add end-to-end smoke tests for the main user flows (login → read → summary → download)

CI/CD
-----
- GitHub Actions workflow: run `npm ci`, `npm run lint`, `npm test`; build a Docker image and optionally publish to registry on tag
- Add a deployment job (manual/protected) to push to chosen host (GCP Cloud Run, Heroku, or AWS ECS)

Security & Rate Limiting
------------------------
- Validate and sanitize all inputs. Use prepared statements/parameterized queries.
- Enforce rate-limits on write endpoints (summaries, highlights) to prevent abuse.
- Store JWT secrets and bot tokens in secrets manager in production.

Migration / Backfill notes
--------------------------
- When moving from LocalStorage to backend persistence, provide an endpoint to import user-local data. Example: POST /api/users/:userId/import-localstore with a JSON payload of highlights/summaries (dev-only, authenticated).
- Add migration scripts to normalize highlights if previously stored as strings.

Acceptance checklist for each feature
-------------------------------------
- Auth: User can sign in via Telegram (or dev-stub), receives token, and frontend stores `userId` and `currentUser` similarly to existing flow.
- Articles: `GET /api/articles` returns predictable paginated responses used by frontend tiles.
- Interactions: `POST /api/articles/:id/interact` stores actions in `public_interactions` with correct action_type and timestamp.
- Summaries: POST and GET summaries work and survive server restart.
- Highlights: Highlights saved and enforce 20% limit server-side.
- Download: `/download-notes` endpoint streams a text file with user's data and is working on commonly used browsers.

Next steps (suggested implementation plan)
-----------------------------------------
1. Produce an OpenAPI (YAML) for all endpoints above (this will become `openapi.yaml`).
2. Scaffold the Node.js + Express app with a health endpoint and Dockerfiles.
3. Create DB migrations and seed sample data.
4. Implement auth (dev stub + Telegram verification) and basic user endpoints.
5. Implement articles + interactions + summaries endpoints, then wire to frontend incrementally.
6. Add tests and CI; run an end-to-end test with docker-compose.

Notes
-----
- This document is intended to be prescriptive and developer-focused. The canonical product/business documentation remains in `docs/BACKEND_COMPLETE.md` and `PROJECT_STATUS.md` — please keep those unchanged unless you're updating the canonical product requirements.
- If you want, I can now generate an `openapi.yaml` draft from this file and scaffold the Node/Express repo that implements the health endpoint and basic auth stub. Ask me to proceed and I'll create the files and Docker config next.

