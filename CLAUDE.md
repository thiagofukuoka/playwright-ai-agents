# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A Playwright (TypeScript) learning/practice project. Two independent parts:

- **Root** — the Playwright test project (`@playwright/test`). Hand-written tests in `tests/`; tests generated via the Playwright MCP / `playwright-test-*` agents in `tests-mcp/` (plans in `specs/`); tests built by exploring with `playwright-cli` in `tests-cli/`. `tests/seed.spec.ts` is the agents' seed file.
- **`sample/hourtolearn-practice-site/`** — a separate Express app (own `package.json`/`node_modules`) that serves as the system under test. Plain HTML/CSS/vanilla JS in `public/`, all backend logic in `server.js` with in-memory data (resets on restart).

`typescript/` holds standalone TS/JS language scratch files, unrelated to the tests.

## Commands

There are no npm scripts at the root; use `npx playwright` directly.

```bash
# Start the practice site (required by most tests) — listens on port 3001
cd sample/hourtolearn-practice-site && npm install && npm start

# Run all tests (chromium, firefox, webkit projects)
npx playwright test

# Single file / single test / single browser
npx playwright test tests/practice.spec.ts
npx playwright test -g "Add a New User"
npx playwright test --project=chromium

# Debugging and tooling
npx playwright test --ui
npx playwright test --headed --debug
npx playwright show-report
npx playwright codegen http://localhost:3001
```

## Key details

- **Port mismatch:** `server.js` defaults to `PORT=3001`, and tests hardcode `http://localhost:3001`. The site's README says 3000 — that is outdated. No `baseURL` or `webServer` is configured in `playwright.config.ts`, so the server must be started manually before running tests that hit it.
- Some tests target external sites (`example.spec.ts` → playwright.dev, `codegenmobile.spec.ts` → m.youtube.com with a `Nexus 5` device) and don't need the local server.
- **Locators:** every interactive element on the practice site has a stable `data-testid` (and/or accessible label/role); prefer `page.getByTestId(...)`. Find test IDs in `public/*.html`.
- **Demo login:** `student` / `Learn123!` — `POST /login` sets a `pw_session` cookie; `/account` is protected and redirects to `/login` without it.
- **API endpoints** (in `server.js`, useful for `request` fixture tests and `page.route` mocking):
  - `GET /api/users` (`q`, `sortBy`, `sortDir`, `page`, `pageSize`; response has a `data` array), `POST /api/users`
  - `GET /api/items?delay=<ms>` — artificial delay
  - `POST /login`, `GET /api/session`, `POST /logout`
  - `POST /upload` — multipart, field name `files`
- Reporter is `html` (output in `playwright-report/`); traces are captured `on-first-retry`, and retries only happen on CI.
