# my-app — Implementation Plan

> **Owner:** Sakshi Gaba  
> **Date:** 2 Sep 2026  
> **Linked Jira Project:** EPMCDMETST

---

## Executive Summary

This plan sequences the delivery of all approved Epics and User Stories identified during the my-app codebase gap analysis. Work is organised into six phased milestones spanning **18 weeks** (16 execution weeks + ~2-week contingency buffer).

---

## Phases at a Glance

| # | Phase | Duration | Target Dates | Key Deliverables |
|---|-------|----------|-------------|-----------------|
| **F0** | Kickoff & Foundations | 2 weeks | 01 Sep – 12 Sep 2026 | CI/CD pipeline, DB migration framework, `.env` secrets management, structured logging |
| **F1** | Authentication & Authorization | 3 weeks | 15 Sep – 03 Oct 2026 | JWT auth backend, RBAC middleware, login UI, protected routes, role-aware UI controls |
| **F2** | Security Hardening & API Quality | 2 weeks | 06 Oct – 17 Oct 2026 | helmet.js, rate limiting, input sanitisation, standardised error schema, npm audit CI gate |
| **F3** | Core Feature Enhancements | 4 weeks | 20 Oct – 14 Nov 2026 | Item schema extension, PUT endpoint, inline edit, detail modal, delete confirmation, pagination, search, filter, sort, bulk delete, CSV/JSON export |
| **F4** | UX Feedback & Analytics | 2 weeks | 17 Nov – 28 Nov 2026 | Toast notifications, loading/empty states, error boundary, CRUD event logging, admin analytics dashboard |
| **F5** | Accessibility, UAT & Production Readiness | 3 weeks | 01 Dec – 19 Dec 2026 | Responsive layout, axe audit + remediation, skip nav, focus management, stakeholder UAT, final npm audit |

**Total:** 18 weeks

---

## Milestones

| ID | Milestone | Target Date |
|----|-----------|------------|
| M1 | Foundations Ready | 12 Sep 2026 |
| M2 | Authentication Live | 03 Oct 2026 |
| M3 | Security Baseline Passed | 17 Oct 2026 |
| M4 | Core Features Complete | 14 Nov 2026 |
| M5 | UX Layer Complete | 28 Nov 2026 |
| M6 | Production Ready | 19 Dec 2026 |

---

## Phase Details

### F0 — Kickoff & Foundations (01–12 Sep 2026)

**Goal:** Establish the technical foundation that all subsequent phases depend on.

**Tasks:**
- [ ] Set up GitHub Actions CI pipeline (lint, test, build)
- [ ] Integrate `dotenv` and document all required env vars in `.env.example`
- [ ] Introduce `better-sqlite3` migration runner; write initial schema migration
- [ ] Add `winston` structured logging to Express server
- [ ] Configure ESLint + Prettier for both `client/` and `server/`
- [ ] Verify Playwright smoke test passes in CI

**Jira Epics:** Authentication (Foundation tasks), Developer Experience Epic

---

### F1 — Authentication & Authorization (15 Sep – 03 Oct 2026)

**Goal:** Secure the API and UI with JWT-based auth and RBAC.

**Tasks:**
- [ ] `POST /api/auth/register` — hashed password, return JWT
- [ ] `POST /api/auth/login` — validate credentials, return JWT (httpOnly cookie)
- [ ] `POST /api/auth/logout` — clear cookie
- [ ] JWT verification middleware applied to all `/api/items` routes
- [ ] RBAC middleware: `admin` role can DELETE; `user` role can GET/POST only
- [ ] React login/register screens with form validation
- [ ] React `PrivateRoute` wrapper; redirect unauthenticated users
- [ ] Role-aware Delete button visibility
- [ ] Unit tests: auth routes, middleware
- [ ] E2E tests: login flow, protected route redirect

**Jira Epics:** Authentication & Authorization Epic

---

### F2 — Security Hardening & API Quality (06–17 Oct 2026)

**Goal:** Harden the surface area exposed after auth is live.

**Tasks:**
- [ ] Add `helmet` to Express (CSP, HSTS, X-Frame-Options)
- [ ] Restrict CORS to `ALLOWED_ORIGINS` env var whitelist
- [ ] Add `express-rate-limit` on auth and item endpoints
- [ ] Server-side input validation via `joi` on all POST/PUT bodies
- [ ] Standardise error response schema `{ error, message, statusCode }`
- [ ] Add `npm audit --audit-level=high` gate to CI
- [ ] Add API versioning prefix `/api/v1/`
- [ ] Document API with OpenAPI 3.0 (`swagger-jsdoc` + `swagger-ui-express`)

**Jira Epics:** Security Epic, API Quality Epic

---

### F3 — Core Feature Enhancements (20 Oct – 14 Nov 2026)

**Goal:** Deliver the full item management feature set.

**Tasks:**
- [ ] DB migration: add `description`, `status`, `tags`, `createdAt`, `updatedAt` columns to `items`
- [ ] `PUT /api/v1/items/:id` — update item
- [ ] `GET /api/v1/items?page&limit&search&status&sort` — pagination + filtering
- [ ] React inline edit (click-to-edit item name/description)
- [ ] Item detail modal (full schema display)
- [ ] Delete confirmation dialog
- [ ] Pagination controls (previous/next + page indicator)
- [ ] Search bar (debounced, 300 ms)
- [ ] Filter by status (dropdown)
- [ ] Sort by name / created date (toggle)
- [ ] Bulk select + bulk delete
- [ ] Export selected items as CSV / JSON
- [ ] Unit tests: new API endpoints
- [ ] E2E tests: edit, pagination, search, export flows

**Jira Epics:** Item Management Epic, Pagination & Search Epic

---

### F4 — UX Feedback & Analytics (17–28 Nov 2026)

**Goal:** Improve feedback loops and give admins operational visibility.

**Tasks:**
- [ ] Implement toast notification system (success, error, info)
- [ ] Add skeleton loaders for item list during fetch
- [ ] Add empty-state illustration + CTA
- [ ] React `ErrorBoundary` wrapping the main app tree
- [ ] Server-side CRUD event log table (`item_events`)
- [ ] `GET /api/v1/admin/analytics` — counts by status, recent activity
- [ ] Admin analytics dashboard page (chart: items over time, status breakdown)
- [ ] Unit tests: analytics endpoint
- [ ] E2E tests: toast visibility, error boundary render

**Jira Epics:** UX & Feedback Epic, Analytics Epic

---

### F5 — Accessibility, UAT & Production Readiness (01–19 Dec 2026)

**Goal:** Ship a production-grade, accessible, UAT-approved release.

**Tasks:**
- [ ] Responsive CSS layout (mobile-first, breakpoints: 375 / 768 / 1280 px)
- [ ] ARIA roles + labels on all interactive elements
- [ ] Skip-to-content link
- [ ] Keyboard navigation audit (tab order, focus rings, modal trap)
- [ ] Run `axe-core` automated accessibility audit; fix all critical/serious issues
- [ ] Serve React build from Express in production mode (`express.static`)
- [ ] Add `Dockerfile` (multi-stage: build React, run Express)
- [ ] Add `docker-compose.yml` for local dev
- [ ] Add `/api/v1/health` liveness + readiness probes
- [ ] CONTRIBUTING.md, inline JSDoc comments
- [ ] Stakeholder UAT session; address sign-off feedback
- [ ] Final `npm audit` — zero high/critical vulnerabilities

**Jira Epics:** Accessibility Epic, Deployment & Ops Epic, Documentation Epic

---

## Risk Register

| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|-----------|--------|-----------|
| R01 | Auth scope creep delays F1 | Medium | High | Gate F2 behind full green E2E post-auth merge |
| R02 | SQLite migration fragility | Medium | High | Idempotent, transaction-wrapped migrations; backup before each run |
| R03 | Playwright flakiness in CI | Medium | Medium | Retry once; isolate with `test.fixme` and create follow-up ticket |
| R04 | npm dependency vulnerabilities | Low | High | Weekly `npm audit`; Dependabot alerts enabled |
| R05 | Scope creep in F3 (feature requests) | High | Medium | Strict backlog grooming; defer non-approved stories |
| R06 | Accessibility debt discovered late | Medium | High | Pre-audit axe scan at end of F4 to avoid remediation overload |
| R07 | UAT feedback causing rework in F5 | Medium | Medium | Involve stakeholders in F3/F4 demos for early feedback |
| R08 | CORS misconfiguration post-hardening | Low | High | Automated integration test hits API from non-whitelisted origin |
| R09 | JWT stored in localStorage (XSS) | High | Critical | Enforce httpOnly cookie from day 1 of F1; add to security checklist |
| R10 | SQLite not suitable for production scale | Low | Medium | Document PostgreSQL migration path; abstract DB layer from F0 |

---

## Coverage Matrix

| Epic | Phase | Stories | Tasks |
|------|-------|---------|-------|
| Authentication & Authorization | F0, F1 | 6 | 12 |
| Security Hardening | F2 | 4 | 8 |
| API Quality & Versioning | F2 | 3 | 6 |
| Item Management (CRUD+) | F3 | 6 | 14 |
| Pagination, Search & Filter | F3 | 4 | 8 |
| UX Feedback | F4 | 4 | 7 |
| Analytics & Event Logging | F4 | 2 | 4 |
| Accessibility | F5 | 3 | 7 |
| Deployment & Ops | F5 | 3 | 6 |
| Documentation & DX | F0, F5 | 3 | 5 |
| **TOTAL** | | **~38** | **~77** |

---

## Definition of Done

- [ ] Code reviewed and approved via Pull Request
- [ ] All unit and E2E tests pass in CI (green pipeline)
- [ ] No high/critical `npm audit` vulnerabilities introduced
- [ ] Feature documented (inline comments + README update where applicable)
- [ ] Acceptance criteria from linked Jira story met and verified
- [ ] No new axe-core critical/serious accessibility violations (F5+)

---

*Generated by Solution Architect Assistant on 2 Sep 2026*
