# BrightPath Tutoring – Student Objectives Web App

## Project Overview
BrightPath Tutoring delivers a student-facing web app for viewing lessons and completing objectives. The goal is to give students a reliable, consistent experience across devices while teachers publish lessons, track progress, and send reminders. Dockerized delivery ensures the same environment in dev, test, and production—reducing classroom interruptions from “works on my machine” issues.

## Quick Start
Build and run the container (expects `.env` with `DATABASE_URL` for Neon/Postgres):

```bash
docker build -t brightpath-app . && docker run -p 3000:3000 --env-file .env brightpath-app
```

## Architecture
- Web container: Next.js app built to standalone output, served by `node server.js` on port 3000.
- Database: External managed Postgres (Neon) via `DATABASE_URL`; no local DB container required. Use `docker-compose.yml` only if you add services later.
- Image: Multi-stage `Dockerfile` (builder on `node:20-alpine`, runner on `node:20-alpine`) to keep the runtime image small and production-focused.

## Business Value of Docker
- Environment parity: Students and teachers get the same behavior regardless of host OS; deployments match local dev bits.
- Faster recovery: Containers bake dependencies, reducing time spent chasing missing tools when lessons need to go live.
- Predictable updates: Versioned images minimize regressions during school terms and allow quick rollbacks.
- Security posture: Smaller runtime surface with only the built app and production deps.

## Tech Stack
- Next.js (app/front-end)
- Node.js 20 (runtime)
- Docker (multi-stage build, container packaging)
- Postgres (Neon managed) via `DATABASE_URL`
- Prisma ORM (datasource configured through `prisma.config.ts`)

## Why Containerization Matters for EdTech
- Consistent classroom experience: Containerized builds prevent drift so lesson playback, objectives, and authentication remain stable during peak usage.
- Reduced downtime: Quick redeploys and image rollbacks keep learning uninterrupted.
- Simplified onboarding: New contributors and IT staff can run the same image with a single command, avoiding setup friction.

## Development Notes
- Ensure `.env` contains the managed Postgres URL (`sslmode=require`).
- For schema changes, run `npx prisma migrate dev --name <change>` and `npx prisma generate` locally before baking a new image.
- Use `docker compose up --build` only if you later add supporting services (e.g., caching, background workers); currently the app talks directly to the managed DB.
