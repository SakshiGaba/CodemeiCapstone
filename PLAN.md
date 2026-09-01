# my-app — Implementation Plan & Delivery Sequencing

> **Author:** Sakshi Gaba  
> **Date:** 2026-09-01  
> **Project:** my-app (React + Express + SQLite)  
> **Jira Project:** [EPMCDMETST](https://jiraeu.epam.com/projects/EPMCDMETST)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Guiding Principles](#2-guiding-principles)
3. [Dependency Map](#3-dependency-map)
4. [Phase Breakdown](#4-phase-breakdown)
   - [Phase 1 — Foundation & Security Hardening](#phase-1--foundation--security-hardening)
   - [Phase 2 — Backend Robustness & API Quality](#phase-2--backend-robustness--api-quality)
   - [Phase 3 — Item CRUD Completeness](#phase-3--item-crud-completeness)
   - [Phase 4 — User Experience & Feedback Improvements](#phase-4--user-experience--feedback-improvements)
   - [Phase 5 — Authentication & Authorization](#phase-5--authentication--authorization)
   - [Phase 6 — Testing, CI/CD & Production Readiness](#phase-6--testing-cicd--production-readiness)
5. [Delivery Timeline (Gantt)](#5-delivery-timeline-gantt)
6. [Story Sequencing Table](#6-story-sequencing-table)
7. [Risks & Mitigations](#7-risks--mitigations)
8. [Definition of Done](#8-definition-of-done)

---

## 1. Executive Summary

**my-app** is a full-stack items-management application (React 18 / Express 4 / SQLite 3) that currently supports basic Create, Read, and Delete operations. Thirty-two Jira issues (5 Epics, 15 User Stories, 12 Sub-tasks) have been approved to close critical feature gaps identified during the codebase analysis.

This plan delivers those stories across **6 sequential phases** ordered by technical dependency, risk, and user value. Each phase produces a shippable, independently deployable increment.

**Estimated Total Effort:** ~14 engineering sprints (2-week sprints, 1 full-stack engineer)  
**Target Completion:** Q4 2026

---

## 2. Guiding Principles

| # | Principle | Rationale |
|---|-----------|-----------|
| 1 | **Foundation first** | Security hardening and env-var management must land before any new feature work to avoid retrofitting. |
| 2 | **Backend before frontend** | API contracts stabilize before UI components are built against them. |
| 3 | **Incremental shippability** | Every phase ends with a working, deployable build. |
| 4 | **Test as you build** | Unit + integration tests ship in the same sprint as the feature they cover. |
| 5 | **Auth last (but planned early)** | Authentication changes every API contract; introducing it after CRUD stabilises minimises churn. |

---

## 3. Dependency Map

```
Phase 1 (Foundation)
    │
    ├──► Phase 2 (Backend Robustness)
    │         │
    │         ├──► Phase 3 (CRUD Completeness)
    │         │         │
    │         │         └──► Phase 4 (UX Enhancements)
    │         │                     │
    │         └──► Phase 5 (Auth)   │
    │                   │           │
    └──────────────────►└───────────┴──► Phase 6 (Testing, CI/CD, Prod)
```

- **Phase 1** unblocks everything (env vars, security middleware).
- **Phase 2** must complete before Phase 3 (pagination, migrations gate schema changes for CRUD).
- **Phase 3** must complete before Phase 4 (UX wraps around stabilised data model).
- **Phase 5** can start in parallel with Phase 4 but all API routes must be finalized first.
- **Phase 6** runs final hardening, CI pipeline, and containerisation.

---

## 4. Phase Breakdown

---

### Phase 1 — Foundation & Security Hardening

> **Epic:** [EPMCDMETST-62953] Production Readiness & Security Hardening  
> **Duration:** Sprint 1–2 (4 weeks)  
> **Goal:** Establish a secure, consistent runtime baseline for all future work.

#### Stories & Tasks

| Jira Key | Story / Task | Priority | Est. (days) |
|----------|-------------|----------|-------------|
| [EPMCDMETST-62969](https://jiraeu.epam.com/browse/EPMCDMETST-62969) | Migrate all config to `.env` with `dotenv` — no hardcoded secrets | 🔴 Critical | 2 |
| [EPMCDMETST-62983](https://jiraeu.epam.com/browse/EPMCDMETST-62983) | Task: Migrate config to .env with dotenv | 🔴 Critical | 1 |
| [EPMCDMETST-62970](https://jiraeu.epam.com/browse/EPMCDMETST-62970) | Add security middleware: `helmet`, CSRF, XSS sanitisation | 🔴 Critical | 3 |
| [EPMCDMETST-62979](https://jiraeu.epam.com/browse/EPMCDMETST-62979) | Task: Install helmet.js & input sanitization | 🔴 Critical | 1 |
| [EPMCDMETST-62971](https://jiraeu.epam.com/browse/EPMCDMETST-62971) | Structured logging & monitoring endpoint | 🟠 High | 3 |
| [EPMCDMETST-62981](https://jiraeu.epam.com/browse/EPMCDMETST-62981) | Task: Replace console.log with structured logger (Winston/Pino) | 🟠 High | 1 |
| [EPMCDMETST-62982](https://jiraeu.epam.com/browse/EPMCDMETST-62982) | Task: Enhance `/api/health` with system metrics | 🟠 High | 1 |

#### Acceptance Criteria (Phase Exit)
- [ ] All secrets read from `.env`; `.env.example` committed; `.env` in `.gitignore`.
- [ ] `helmet()` applied globally; XSS sanitisation active on all POST/PUT routes.
- [ ] `console.log` replaced with structured logger; log level configurable via env.
- [ ] `/api/health` returns `{ status, uptime, memoryMB, timestamp }`.
- [ ] All existing Playwright E2E tests still pass.

---

### Phase 2 — Backend Robustness & API Quality

> **Epic:** [EPMCDMETST-62955] Backend Robustness & API Quality  
> **Duration:** Sprint 3–4 (4 weeks)  
> **Goal:** Make the API production-grade: paginated, validated, rate-limited, and schema-managed.

#### Stories & Tasks

| Jira Key | Story / Task | Priority | Est. (days) |
|----------|-------------|----------|-------------|
| [EPMCDMETST-62965](https://jiraeu.epam.com/browse/EPMCDMETST-62965) | Database migration system (`better-sqlite3-migrations` or `knex`) | 🔴 Critical | 4 |
| [EPMCDMETST-62966](https://jiraeu.epam.com/browse/EPMCDMETST-62966) | Pagination on `GET /api/items` (`?page=&limit=`) | 🟠 High | 3 |
| [EPMCDMETST-62967](https://jiraeu.epam.com/browse/EPMCDMETST-62967) | Rate limiting on mutation endpoints (`express-rate-limit`) | 🟠 High | 2 |
| [EPMCDMETST-62915](https://jiraeu.epam.com/browse/EPMCDMETST-62915) | Restricted CORS + rate limiting (operator story) | 🟠 High | 2 |
| [EPMCDMETST-62923](https://jiraeu.epam.com/browse/EPMCDMETST-62923) | Input validation: name length & disallowed characters | 🟡 Medium | 2 |
| [EPMCDMETST-62916](https://jiraeu.epam.com/browse/EPMCDMETST-62916) | Centralised error logging in Express (unhandled errors) | 🟠 High | 2 |

#### Acceptance Criteria (Phase Exit)
- [ ] Migration runner exists; initial migration creates items table; `npm run db:migrate` documented.
- [ ] `GET /api/items?page=1&limit=20` returns `{ data, total, page, pages }`.
- [ ] POST/PUT/DELETE endpoints return `429` after threshold exceeded.
- [ ] Names > 200 chars or containing `<script` tags return `400`.
- [ ] Global Express error handler logs structured JSON and returns `{ error }` JSON.

---

### Phase 3 — Item CRUD Completeness

> **Epic:** [EPMCDMETST-62951] Item CRUD Completeness  
> **Duration:** Sprint 5–7 (6 weeks)  
> **Goal:** Full Create / Read / Update / Delete + rich item model (description, timestamps, status).

#### Stories & Tasks

| Jira Key | Story / Task | Priority | Est. (days) |
|----------|-------------|----------|-------------|
| [EPMCDMETST-62910](https://jiraeu.epam.com/browse/EPMCDMETST-62910) | `PUT /api/items/:id` — backend update endpoint | 🔴 Critical | 2 |
| [EPMCDMETST-62972](https://jiraeu.epam.com/browse/EPMCDMETST-62972) | Task: Add `PUT /api/items/:id` endpoint | 🔴 Critical | 1 |
| [EPMCDMETST-62914](https://jiraeu.epam.com/browse/EPMCDMETST-62914) | Inline edit item name in React UI | 🔴 Critical | 3 |
| [EPMCDMETST-62974](https://jiraeu.epam.com/browse/EPMCDMETST-62974) | Task: Inline edit UI component in React | 🔴 Critical | 2 |
| [EPMCDMETST-62973](https://jiraeu.epam.com/browse/EPMCDMETST-62973) | Task: Playwright E2E test for edit flow | 🔴 Critical | 1 |
| [EPMCDMETST-62957](https://jiraeu.epam.com/browse/EPMCDMETST-62957) | User story: edit existing item's name | 🔴 Critical | — (covered above) |
| [EPMCDMETST-62911](https://jiraeu.epam.com/browse/EPMCDMETST-62911) | Items with description & creation timestamp | 🟠 High | 3 |
| [EPMCDMETST-62956](https://jiraeu.epam.com/browse/EPMCDMETST-62956) | Items with description & timestamps (second set) | 🟠 High | — (covered above) |
| [EPMCDMETST-62958](https://jiraeu.epam.com/browse/EPMCDMETST-62958) | Mark items as completed / toggle status | 🟡 Medium | 3 |

#### Schema Changes (via Migration)
```sql
ALTER TABLE items ADD COLUMN description TEXT DEFAULT '';
ALTER TABLE items ADD COLUMN status TEXT DEFAULT 'active' CHECK(status IN ('active','completed'));
ALTER TABLE items ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE items ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP;
```

#### Acceptance Criteria (Phase Exit)
- [ ] `PUT /api/items/:id` accepts `{ name, description, status }`, returns updated item.
- [ ] React list shows description (truncated) and `created_at` date.
- [ ] Clicking item name enters inline edit mode; pressing Enter/Escape commits/cancels.
- [ ] Checkbox toggles `status` between `active` and `completed`; completed items shown with strikethrough.
- [ ] E2E tests cover create, read, edit, complete, delete.

---

### Phase 4 — User Experience & Feedback Improvements

> **Epic:** [EPMCDMETST-62954] User Experience & Feedback Improvements  
> **Duration:** Sprint 8–9 (4 weeks)  
> **Goal:** Deliver polished UX: toast notifications, delete confirmation, search/filter, accessibility.

#### Stories & Tasks

| Jira Key | Story / Task | Priority | Est. (days) |
|----------|-------------|----------|-------------|
| [EPMCDMETST-62912](https://jiraeu.epam.com/browse/EPMCDMETST-62912) | Toast notifications on success/error for all operations | 🔴 Critical | 3 |
| [EPMCDMETST-62959](https://jiraeu.epam.com/browse/EPMCDMETST-62959) | Error notifications on API failure | 🔴 Critical | — (covered above) |
| [EPMCDMETST-62975](https://jiraeu.epam.com/browse/EPMCDMETST-62975) | Task: Toast notification React component | 🔴 Critical | 2 |
| [EPMCDMETST-62917](https://jiraeu.epam.com/browse/EPMCDMETST-62917) | Confirmation dialog before delete | 🔴 Critical | 2 |
| [EPMCDMETST-62961](https://jiraeu.epam.com/browse/EPMCDMETST-62961) | Confirmation dialog (second set) | 🔴 Critical | — (covered above) |
| [EPMCDMETST-62977](https://jiraeu.epam.com/browse/EPMCDMETST-62977) | Task: Confirmation modal component | 🔴 Critical | 1 |
| [EPMCDMETST-62976](https://jiraeu.epam.com/browse/EPMCDMETST-62976) | Task: Wire delete button to modal | 🔴 Critical | 1 |
| [EPMCDMETST-62913](https://jiraeu.epam.com/browse/EPMCDMETST-62913) | Real-time search and filter of items list | 🟠 High | 3 |
| [EPMCDMETST-62960](https://jiraeu.epam.com/browse/EPMCDMETST-62960) | Search and filter items (second set) | 🟠 High | — (covered above) |
| [EPMCDMETST-62919](https://jiraeu.epam.com/browse/EPMCDMETST-62919) | Keyboard navigation & screen-reader accessibility (WCAG 2.1 AA) | 🟡 Medium | 4 |

#### Acceptance Criteria (Phase Exit)
- [ ] All CRUD operations trigger a success toast (`"Item added"`, `"Item updated"`, `"Item deleted"`).
- [ ] Network failures trigger an error toast with human-readable message; auto-dismisses in 4 s.
- [ ] Delete action opens a `<dialog>` confirmation; confirmed delete proceeds; cancel aborts.
- [ ] Search input above list filters items client-side in real time (case-insensitive name match).
- [ ] All interactive elements reachable by Tab; ARIA labels on icon buttons; focus trap in modal.

---

### Phase 5 — Authentication & Authorization

> **Epic:** [EPMCDMETST-62952] Authentication & Authorization  
> **Duration:** Sprint 10–11 (4 weeks)  
> **Goal:** Secure the app with JWT-based auth, role management, and session expiry.

#### Stories & Tasks

| Jira Key | Story / Task | Priority | Est. (days) |
|----------|-------------|----------|-------------|
| [EPMCDMETST-62962](https://jiraeu.epam.com/browse/EPMCDMETST-62962) | Login with JWT authentication | 🔴 Critical | 5 |
| [EPMCDMETST-62980](https://jiraeu.epam.com/browse/EPMCDMETST-62980) | Task: JWT auth middleware & `/api/auth/login` endpoint | 🔴 Critical | 3 |
| [EPMCDMETST-62978](https://jiraeu.epam.com/browse/EPMCDMETST-62978) | Task: Login page & protected routes in React | 🔴 Critical | 3 |
| [EPMCDMETST-62963](https://jiraeu.epam.com/browse/EPMCDMETST-62963) | Session expiry & refresh tokens | 🟠 High | 4 |
| [EPMCDMETST-62964](https://jiraeu.epam.com/browse/EPMCDMETST-62964) | Admin role management (RBAC) | 🟡 Medium | 4 |

#### New API Endpoints
```
POST /api/auth/register   — Create user account
POST /api/auth/login      — Returns { accessToken, refreshToken }
POST /api/auth/refresh    — Rotate refresh token
POST /api/auth/logout     — Invalidate refresh token
```

#### Acceptance Criteria (Phase Exit)
- [ ] Unauthenticated requests to `/api/items` mutations return `401`.
- [ ] `POST /api/auth/login` returns signed JWT (15-min expiry) + refresh token (7-day expiry).
- [ ] React app stores access token in memory; refresh token in `httpOnly` cookie.
- [ ] Login page with email/password; redirect to items list on success.
- [ ] Admin users can see and manage all users' items; regular users see only their own.
- [ ] Access token auto-refreshes silently when 1 min from expiry.

---

### Phase 6 — Testing, CI/CD & Production Readiness

> **Epics:** [EPMCDMETST-62909] Testing | [EPMCDMETST-62908] DevOps  
> **Duration:** Sprint 12–14 (6 weeks, running partly in parallel with Phase 4–5)  
> **Goal:** ≥80% test coverage, GitHub Actions CI, Docker containerisation.

#### Stories & Tasks

| Jira Key | Story / Task | Priority | Est. (days) |
|----------|-------------|----------|-------------|
| [EPMCDMETST-62918](https://jiraeu.epam.com/browse/EPMCDMETST-62918) | React component unit tests with Jest (≥80% coverage) | 🔴 Critical | 5 |
| [EPMCDMETST-62920](https://jiraeu.epam.com/browse/EPMCDMETST-62920) | Express API Supertest integration tests | 🔴 Critical | 4 |
| [EPMCDMETST-62921](https://jiraeu.epam.com/browse/EPMCDMETST-62921) | GitHub Actions CI pipeline on every PR to `main` | 🔴 Critical | 3 |
| [EPMCDMETST-62922](https://jiraeu.epam.com/browse/EPMCDMETST-62922) | Docker containerisation (client + server + compose) | 🟠 High | 4 |

#### Acceptance Criteria (Phase Exit)
- [ ] `jest --coverage` reports ≥80% lines/branches on `client/src`.
- [ ] Supertest suite covers all 8+ API endpoints (happy path + error cases).
- [ ] GitHub Actions workflow: lint → unit tests → integration tests → E2E → build Docker image.
- [ ] `docker compose up` starts app fully; `localhost:3000` loads and all operations work.
- [ ] PR to `main` cannot merge without green CI.

---

## 5. Delivery Timeline (Gantt)

```
Sprint │ 1  │ 2  │ 3  │ 4  │ 5  │ 6  │ 7  │ 8  │ 9  │ 10 │ 11 │ 12 │ 13 │ 14 │
───────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┤
Ph 1   │████│████│    │    │    │    │    │    │    │    │    │    │    │    │
Ph 2   │    │    │████│████│    │    │    │    │    │    │    │    │    │    │
Ph 3   │    │    │    │    │████│████│████│    │    │    │    │    │    │    │
Ph 4   │    │    │    │    │    │    │    │████│████│    │    │    │    │    │
Ph 5   │    │    │    │    │    │    │    │    │    │████│████│    │    │    │
Ph 6   │    │    │    │    │    │  ░░│░░░░│░░░░│░░░░│░░░░│░░░░│████│████│████│
───────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘
Legend: ████ = active phase   ░░░░ = ongoing test-as-you-build
```

---

## 6. Story Sequencing Table

| Seq | Phase | Jira Key | Story Summary | Blocked By |
|-----|-------|----------|---------------|------------|
| 1 | 1 | EPMCDMETST-62969 | Env var management (.env + dotenv) | — |
| 2 | 1 | EPMCDMETST-62970 | Security middleware (helmet, XSS) | #1 |
| 3 | 1 | EPMCDMETST-62971 | Structured logging & /api/health metrics | #1 |
| 4 | 2 | EPMCDMETST-62965 | Database migration system | #1 |
| 5 | 2 | EPMCDMETST-62966 | Pagination on GET /api/items | #4 |
| 6 | 2 | EPMCDMETST-62967 | Rate limiting on mutation endpoints | #2 |
| 7 | 2 | EPMCDMETST-62923 | Input name validation (length, chars) | #2 |
| 8 | 2 | EPMCDMETST-62916 | Central error logging middleware | #3 |
| 9 | 3 | EPMCDMETST-62910 | PUT /api/items/:id endpoint | #4, #7 |
| 10 | 3 | EPMCDMETST-62911 | Items: description + timestamps fields | #4 |
| 11 | 3 | EPMCDMETST-62914 | Inline edit React UI | #9 |
| 12 | 3 | EPMCDMETST-62958 | Mark items as completed (toggle status) | #9, #10 |
| 13 | 4 | EPMCDMETST-62912 | Toast notifications (success + error) | #11 |
| 14 | 4 | EPMCDMETST-62917 | Delete confirmation dialog | #11 |
| 15 | 4 | EPMCDMETST-62913 | Real-time search & filter | #5, #11 |
| 16 | 4 | EPMCDMETST-62919 | Keyboard nav & screen-reader a11y | #13, #14 |
| 17 | 5 | EPMCDMETST-62962 | JWT login + auth middleware | #2, #8 |
| 18 | 5 | EPMCDMETST-62963 | Session expiry + refresh tokens | #17 |
| 19 | 5 | EPMCDMETST-62964 | Admin role management (RBAC) | #17 |
| 20 | 6 | EPMCDMETST-62918 | Jest unit tests ≥80% coverage | #11–#16 |
| 21 | 6 | EPMCDMETST-62920 | Supertest integration tests | #9, #17 |
| 22 | 6 | EPMCDMETST-62921 | GitHub Actions CI pipeline | #20, #21 |
| 23 | 6 | EPMCDMETST-62922 | Docker + docker-compose | #1, #22 |

---

## 7. Risks & Mitigations

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|------------|
| R1 | SQLite concurrency limits under load | Medium | Medium | Plan migration to PostgreSQL in Phase 6 as optional hardening; use WAL mode now |
| R2 | Schema migrations break existing data | Medium | High | Run migrations in a transaction; maintain rollback scripts |
| R3 | JWT secret rotation disrupts active sessions | Low | High | Support multiple active secrets during rotation window |
| R4 | CRA (`react-scripts`) becoming unmaintained | Low | Medium | Budget one sprint to migrate to Vite if CRA is deprecated |
| R5 | Phase 5 auth delays cascade to Phase 6 CI | Medium | Medium | Phase 6 CI pipeline can be set up without auth tests first, auth tests added incrementally |

---

## 8. Definition of Done

A story is **Done** when all of the following are true:

- [ ] Code reviewed and approved by ≥1 peer.
- [ ] Unit / integration / E2E tests written and passing in CI.
- [ ] No new ESLint errors introduced.
- [ ] Jira story moved to **Done**.
- [ ] Confluence architecture docs updated if the story changes an API contract or data model.
- [ ] `README.md` updated if setup/run steps change.
- [ ] No hardcoded secrets; all config from `.env`.
- [ ] Accessibility: no new WCAG 2.1 AA violations (axe-core scan).

---

*This plan is a living document. Update the sequencing table and Gantt whenever stories are re-prioritised or new work is approved.*
