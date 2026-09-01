# my-app — Implementation Plan & Story Sequencing

> **Project:** my-app (React + Express + SQLite)  
> **Prepared by:** Sakshi Gaba  
> **Date:** 2026-09-01  
> **Jira Project:** EPMCDMETST  

---

## 1. Overview

This document defines the phased implementation plan for all approved Epics and User Stories
identified during the gap analysis of `my-app`. Stories are sequenced to respect technical
dependencies, de-risk the delivery, and maximise incremental value after each phase.

---

## 2. Guiding Principles

| # | Principle |
|---|-----------|
| 1 | **Foundation first** — harden the backend before building new UI features on top of it. |
| 2 | **Vertical slices** — each phase delivers end-to-end working functionality. |
| 3 | **Test as you build** — unit/integration tests ship in the same phase as the feature. |
| 4 | **CI gates every merge** — the GitHub Actions pipeline is in place by Phase 2 at the latest. |
| 5 | **Docker last** — containerisation wraps a fully working, tested application. |

---

## 3. Epic & Story Index

| Jira Key | Type | Title |
|---|---|---|
| EPMCDMETST-62907 | Epic | Item Management: Edit & Rich Data |
| EPMCDMETST-62905 | Epic | UX Enhancements: Feedback, Search & Accessibility |
| EPMCDMETST-62906 | Epic | API Hardening: Validation, Security & Rate Limiting |
| EPMCDMETST-62909 | Epic | Testing: Unit, Integration & Coverage |
| EPMCDMETST-62908 | Epic | DevOps: CI/CD, Containerisation & Deployment |
| EPMCDMETST-62910 | Story | PUT /api/items/:id — full CRUD backend |
| EPMCDMETST-62911 | Story | Description + timestamp fields (schema migration) |
| EPMCDMETST-62912 | Story | Toast notifications (success / error) |
| EPMCDMETST-62913 | Story | Search, filter & sort items list |
| EPMCDMETST-62914 | Story | Inline edit of item name |
| EPMCDMETST-62915 | Story | Rate limiting + restricted CORS |
| EPMCDMETST-62916 | Story | Centralised error logging middleware |
| EPMCDMETST-62917 | Story | Delete confirmation dialog |
| EPMCDMETST-62918 | Story | Jest unit tests ≥80% coverage (client) |
| EPMCDMETST-62919 | Story | Keyboard + screen-reader accessibility (WCAG AA) |
| EPMCDMETST-62920 | Story | Supertest integration tests (server) |
| EPMCDMETST-62921 | Story | GitHub Actions CI pipeline |
| EPMCDMETST-62922 | Story | Docker + docker-compose containerisation |
| EPMCDMETST-62923 | Story | Input validation — length & duplicate prevention |

---

## 4. Dependency Graph

```
EPMCDMETST-62916 (error middleware)
        │
        ▼
EPMCDMETST-62915 (rate limit + CORS)
        │
        ▼
EPMCDMETST-62923 (input validation)
        │
        ├──► EPMCDMETST-62910 (PUT endpoint)
        │           │
        │           ▼
        │    EPMCDMETST-62914 (inline edit UI)
        │
        ├──► EPMCDMETST-62911 (schema migration)
        │           │
        │           ▼
        │    EPMCDMETST-62912 (toast notifications)
        │    EPMCDMETST-62913 (search / filter / sort)
        │    EPMCDMETST-62917 (delete confirmation)
        │    EPMCDMETST-62919 (accessibility)
        │
        ├──► EPMCDMETST-62920 (server integration tests)
        ├──► EPMCDMETST-62918 (client unit tests)
        │
        ▼
EPMCDMETST-62921 (GitHub Actions CI)
        │
        ▼
EPMCDMETST-62922 (Docker + compose)
```

---

## 5. Phased Delivery Plan

---

### Phase 1 — Backend Hardening  *(Sprint 1 · ~5 days)*

**Goal:** Make the Express API production-grade before any new features are added.  
**Epic coverage:** API Hardening (EPMCDMETST-62906)

| Order | Story | Description | Effort |
|-------|-------|-------------|--------|
| 1.1 | EPMCDMETST-62916 | Add centralised error-handling + 404 middleware to `server/index.js`. All errors logged with timestamp and route; clients receive generic 500. | S |
| 1.2 | EPMCDMETST-62915 | Install `express-rate-limit`; restrict CORS to configurable origin via `.env`. 429 returned on breach. | S |
| 1.3 | EPMCDMETST-62923 | Validate POST/PUT name: 1–200 chars, no whitespace-only, 409 on duplicate. | M |

**Definition of Done (Phase 1):**
- All three middleware layers committed and manually verified via curl / Postman.
- Existing Playwright E2E suite still green.
- `.env.example` added to repo.

---

### Phase 2 — Full CRUD & Schema Enrichment  *(Sprint 2 · ~5 days)*

**Goal:** Extend the data model and expose PUT endpoint to unlock inline editing.  
**Epic coverage:** Item Management (EPMCDMETST-62907)

| Order | Story | Description | Effort |
|-------|-------|-------------|--------|
| 2.1 | EPMCDMETST-62911 | Migrate SQLite schema: add `description TEXT`, `created_at DATETIME DEFAULT CURRENT_TIMESTAMP`. Seed script updated. | M |
| 2.2 | EPMCDMETST-62910 | Add `PUT /api/items/:id` route. Validates name, returns 404 / 400 / 200 as appropriate. | M |

**Definition of Done (Phase 2):**
- Schema migration runs cleanly on fresh and existing `app.db`.
- PUT endpoint tested with success + error payloads.
- All existing E2E tests pass (backward compatible).

---

### Phase 3 — UX Enhancements  *(Sprint 3 · ~7 days)*

**Goal:** Deliver all approved front-end user stories; surface new backend capabilities in the UI.  
**Epic coverage:** UX Enhancements (EPMCDMETST-62905) + Item Management UI

| Order | Story | Description | Effort |
|-------|-------|-------------|--------|
| 3.1 | EPMCDMETST-62912 | Add Toast/Snackbar component to `App.js`. Success + error toasts on all CRUD operations; button disabled during submission. | M |
| 3.2 | EPMCDMETST-62914 | Inline edit: Edit button → editable input pre-filled → PUT request → live update. Cancel reverts; empty name rejected inline. | L |
| 3.3 | EPMCDMETST-62917 | Confirmation modal before DELETE. Keyboard accessible (Esc/Enter). | S |
| 3.4 | EPMCDMETST-62913 | Search input + sort dropdown (A-Z / Z-A) above item list. Client-side filtering; "No results" state. | M |
| 3.5 | EPMCDMETST-62919 | ARIA labels, tab order, focus management, WCAG AA contrast. Axe-core audit passing. | M |

**Definition of Done (Phase 3):**
- All UX features manually verified across Chrome and Firefox.
- Accessibility audit shows zero critical violations (axe-core).
- E2E tests updated/extended to cover new interactions.

---

### Phase 4 — Test Coverage  *(Sprint 4 · ~5 days)*

**Goal:** Introduce unit and integration tests to gate all future changes in CI.  
**Epic coverage:** Testing (EPMCDMETST-62909)

| Order | Story | Description | Effort |
|-------|-------|-------------|--------|
| 4.1 | EPMCDMETST-62918 | Install Jest + React Testing Library in `client/`. Unit tests for App.js (render, add, delete, edit, error states). ≥80% coverage threshold. | L |
| 4.2 | EPMCDMETST-62920 | Install Supertest + Jest in `server/`. Integration tests for all five routes; uses in-memory / temp SQLite DB. ≥80% coverage. | L |

**Definition of Done (Phase 4):**
- `npm test` passes in both `client/` and `server/`.
- Coverage report shows ≥80% on branches, functions, lines, statements.
- No regressions in Playwright E2E suite.

---

### Phase 5 — CI/CD & Containerisation  *(Sprint 5 · ~4 days)*

**Goal:** Automate quality gates and ship a portable, containerised artifact.  
**Epic coverage:** DevOps (EPMCDMETST-62908)

| Order | Story | Description | Effort |
|-------|-------|-------------|--------|
| 5.1 | EPMCDMETST-62921 | `.github/workflows/ci.yml`: install → unit tests → Playwright E2E. Fails on any test failure. README badge added. | M |
| 5.2 | EPMCDMETST-62922 | `server/Dockerfile`, `client/Dockerfile` (multi-stage nginx), `docker-compose.yml`. `docker-compose up` → app at :3000, API at :5000. `.dockerignore` added. | L |

**Definition of Done (Phase 5):**
- CI pipeline green on `main` and on a sample feature branch PR.
- `docker-compose up --build` starts cleanly from a fresh clone.
- README updated with CI badge and Docker instructions.

---

## 6. Sprint Summary

| Phase | Sprint | Stories | Epics Closed | Est. Days |
|-------|--------|---------|--------------|-----------|
| 1 | Sprint 1 | 62916, 62915, 62923 | API Hardening | 5 |
| 2 | Sprint 2 | 62911, 62910 | Item Management (partial) | 5 |
| 3 | Sprint 3 | 62912, 62914, 62917, 62913, 62919 | UX Enhancements + Item Mgmt | 7 |
| 4 | Sprint 4 | 62918, 62920 | Testing | 5 |
| 5 | Sprint 5 | 62921, 62922 | DevOps | 4 |
| **Total** | **5 Sprints** | **14 Stories** | **5 Epics** | **~26 days** |

---

## 7. Risk & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| SQLite schema migration breaks existing data | Medium | High | Write idempotent `ALTER TABLE` statements; run against a copy of `app.db` in CI |
| CORS restriction breaks local dev workflow | Low | Medium | Default `.env` ships with `localhost:3000` pre-configured |
| Playwright E2E tests flaky after UX changes | Medium | Medium | Update selectors in Phase 3 DoD; add retry config |
| Docker networking issues between containers | Low | Medium | Use named Docker network in `docker-compose.yml`; document port mapping |

---

## 8. Assumptions

- Node.js ≥ 18 and Docker Desktop available in dev environments.
- SQLite remains the datastore for the scope of this plan (no migration to Postgres).
- No authentication/RBAC is in scope for this plan (tracked as a future backlog item).
- One developer per story is assumed for effort sizing (S = 0.5d, M = 1d, L = 2d).

---

## 9. Out of Scope (Future Backlog)

- User authentication & JWT / session management
- Role-Based Access Control (RBAC)
- Pagination / infinite scroll
- Internationalisation (i18n)
- PWA / mobile-native support
- Metrics, analytics dashboard, and admin tooling

---

*This plan is version-controlled. All changes must be proposed via pull request and reviewed before merging to `main`.*
