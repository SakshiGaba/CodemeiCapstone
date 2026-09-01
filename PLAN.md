# my-app — Implementation Plan & Sequencing

This plan sequences the **approved user stories** into a shippable set of iterations with clear dependencies, acceptance gates, and rollout considerations.

> Assumptions (defaults)
> - Monorepo with `client/` (React) and `server/` (Express + SQLite).
> - Existing endpoints: list/add/delete items, plus `/health`.
> - Playwright E2E exists.
> - Jira stories referenced from prior list (IDs kept for traceability).

## Goals
- Deliver end-to-end **Edit**, **Richer item data**, and **UX improvements** without breaking existing flows.
- Improve reliability and safety via **validation, error handling, rate limiting**, and **tests**.
- Ensure the project is easy to run and ship via **Docker + CI**.

## Workstream Map (Epics → Stories)

### Epic: API Hardening
- **EPMCDMETST-62923**: Item names validated for length and duplicate prevention
- **EPMCDMETST-62915**: Express API protected by rate limiting & restricted CORS
- **EPMCDMETST-62916**: Unhandled errors logged centrally in Express

### Epic: Item Management
- **EPMCDMETST-62911**: PUT /api/items/:id supports full CRUD
- **EPMCDMETST-62910**: Edit an existing item inline
- **EPMCDMETST-62914**: Show description and creation timestamp

### Epic: UX Enhancements
- **EPMCDMETST-62912**: Toast notifications on success/error
- **EPMCDMETST-62917**: Confirmation dialog before delete
- **EPMCDMETST-62913**: Search + filter
- **EPMCDMETST-62919**: Keyboard + screen reader navigation

### Epic: Testing
- **EPMCDMETST-62918**: React components covered by Jest/RTL ≥80%
- **EPMCDMETST-62920**: Express routes covered by Supertest

### Epic: DevOps
- **EPMCDMETST-62921**: GitHub Actions CI on every PR
- **EPMCDMETST-62922**: Dockerize client/server + compose

---

## Sequencing (Recommended)

### Phase 0 — Baseline + Guardrails (0.5–1 day)
**Outcome:** safe to iterate quickly.
- Confirm local dev flow (client ↔ server proxy/CORS)
- Add `.env.example` (server port, allowed origins)
- Add lint/test scripts if missing

**Exit criteria:** `npm test` (or equivalent) runs locally; Playwright still green.

---

### Phase 1 — Backend Safety Foundations (1.5–2.5 days)
**Stories:** 62916, 62923, 62915

1) **Central error handling + logging (62916)**
- Add 404 handler, error middleware
- Standardize error response `{ code, message, details? }`
- Ensure async errors are passed correctly

2) **Validation + duplicate checks (62923)**
- Validate name: trim, min/max length, reject empty
- Handle duplicates: return 409 with friendly code

3) **Rate limiting + CORS restriction (62915)**
- Configure CORS allowlist via env
- Add rate limiting on `/api/*`

**Exit criteria:**
- Existing endpoints unchanged for success cases
- Invalid input returns correct status codes
- Logs show request-id and error details (no PII)

---

### Phase 2 — Data Model Enrichment + Update API (2–4 days)
**Stories:** 62914 (BE portion), 62911

1) **SQLite migration**
- Add columns: `description` (nullable), `created_at`, `updated_at`
- Backfill timestamps for existing rows

2) **Add `PUT /api/items/:id` (62911)**
- Update `name`, optional `description`
- Update `updated_at`
- Return 404 for missing id

3) **Adjust `GET /api/items` response**
- Include new fields

**Exit criteria:**
- CRUD contract stable and versionless (no breaking changes for existing UI)
- Migration is idempotent / safe for reruns (or at minimum safe in fresh db)

---

### Phase 3 — Core UX + Item Editing (3–5 days)
**Stories:** 62912, 62917, 62910, 62914 (FE portion)

1) **Toasts + loading states (62912)**
- Unified notification component
- Disable submit while in flight
- Surface server validation messages

2) **Delete confirmation (62917)**
- Modal dialog with focus trap and ESC support
- Optional: “soft undo” can be future enhancement

3) **Inline edit (62910)**
- Edit mode per row
- Save invokes PUT, cancel restores previous value
- Optimistic UI optional; default to pessimistic + spinner

4) **Richer fields UI (62914)**
- Add description input in create form (optional)
- Display created timestamp in list row details

**Exit criteria:**
- All operations provide user feedback
- Keyboard-only flows are usable

---

### Phase 4 — Findability + Accessibility (2–3 days)
**Stories:** 62913, 62919

1) **Search/filter**
- Client-side filtering initially (fast ship)
- Debounced input
- If dataset grows, add server-side query later

2) **A11y improvements**
- Proper labels for inputs/buttons
- Modal semantics (role=dialog, aria-modal, labelledby)
- Visible focus states

**Exit criteria:**
- axe-core basic checks pass
- Search works with keyboard; announcements for toast/dialog

---

### Phase 5 — Test Coverage + CI + Docker (3–6 days)
**Stories:** 62918, 62920, 62921, 62922

1) **Supertest integration tests (62920)**
- Cover GET/POST/PUT/DELETE and validation errors
- Use temp sqlite db per test run

2) **Jest + RTL unit tests (62918)**
- Smoke tests for main list
- Edit flow unit tests
- Toast and modal behavior tests

3) **CI workflow (62921)**
- Install deps
- Run lint/unit tests
- Run Playwright (or nightly if too slow)

4) **Docker (62922)**
- Dockerfiles for client/server
- `docker-compose.yml` for local + CI smoke

**Exit criteria:**
- CI green on PR
- `docker compose up` works from README

---

## Dependency Graph (High-level)
- 62916 → (recommended before) 62923/62915
- 62923 (validation rules) → 62910/62912 (FE error surfacing)
- 62911 (PUT) → 62910 (inline edit)
- 62914 (schema) → 62914 (UI fields)
- Tests (62918/62920) should land after routes/UI stabilize, but add as you go.

---

## Rollout / Release Strategy
- Ship backend hardening behind safe defaults (CORS allowlist includes localhost/dev)
- Add migration with backward compatible reads
- Roll out UI improvements incrementally (toast first, then confirm delete, then edit)
- Keep Playwright tests updated to match UX changes

---

## Risks & Mitigations
- **SQLite migrations**: risk of breaking dev db → provide reset script, document steps.
- **CORS allowlist**: risk of blocking prod → set env per environment; add docs.
- **Inline edit UX**: risk of state bugs → keep edit state localized per row.
- **Test flakiness**: Playwright timing issues → use data-testids and deterministic waits.

---

## Definition of Done (DoD)
- Meets acceptance criteria in Jira
- Unit/integration tests added/updated
- No accessibility regressions (keyboard + screen reader basics)
- Performance: no unnecessary re-renders on list actions
- Docs updated (README/runbook where needed)
