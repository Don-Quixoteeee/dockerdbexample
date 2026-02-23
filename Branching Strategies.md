# Branching Strategy for Student Objectives Web App

## Goals
- Keep production stable for students/teachers while allowing rapid iteration on lessons/objectives features.
- Enable quick emergency fixes without blocking ongoing feature work.
- Protect data-integrity changes (migrations) with a clear promotion path.

## Branches
- Production: `main` — always deployable; tagged releases; only merges from `release/*` or `hotfix/*`.
- Development: `develop` — integration of completed features; auto-deploy to dev/stage.
- New Features: `feature/<ticket-or-scope>` — short-lived branches for app features (e.g., auth flows, lessons module, objectives tracker).
- Release Prep: `release/<version>` — stabilize for prod, final fixes, version bump, release notes.
- Emergency Fixes: `hotfix/<issue>` — branched from `main`, fast patch to prod, also merged back to `develop`.

## Workflow
1) New work: branch from `develop` into `feature/<ticket>`. Keep scope small; rebase on `develop` if long-running.
2) Integration: open PR into `develop` with tests and migrations reviewed; ensure API/docs updated for lesson/objective changes.
3) Release cut: create `release/<version>` from `develop`; fix bugs only; tag when stable; merge to `main` and back-merge to `develop`.
4) Deploy: tag on `main` triggers production deploy; maintain changelog (features, migrations, risk notes).
5) Hotfix: branch `hotfix/<issue>` from `main`, patch, tag, deploy; merge into `main` and `develop`.

## Rules & Quality Gates
- CI: lint, tests, DB migration dry-runs on PRs; contract tests for API used by frontend lessons/objectives.
- Reviews: at least one reviewer; security review for auth/roles and any PII handling.
- Migrations: backward-compatible first; guard rails for data changes; feature toggles for risky flows (e.g., new objectives UX).
- Versioning: semantic-ish (`vX.Y.Z`); Y for features, Z for fixes.
- Naming: lowercase kebab/slash (e.g., `feature/lessons-search`, `hotfix/login-rate-limit`).

## Environment Alignment
- Dev: auto from `develop`; seed data for lessons/objectives; debug logging.
- Stage: from `release/*`; prod-like config; performance smoke tests on lesson/objective pages.
- Prod: from `main`; observability alerts on auth, DB connections, and lesson/objective error rates.
