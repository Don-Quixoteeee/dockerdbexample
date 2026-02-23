# Student Objectives Web App

## Core User Features
- Student authentication: sign up, login, logout, password reset.
- Personal dashboard: view today’s objectives, upcoming lessons, and completion progress.
- Lessons module: browse, search, and view lesson content with embedded media and attachments.
- Objectives tracker: mark objectives as in-progress/done, see due dates, and receive reminders.
- Teacher posting: teachers create/edit lessons and objectives, attach resources, and set visibility by class/group.
- Notifications: in-app and optional email for new lessons, due objectives, and teacher feedback.
- Profile & accessibility: basic profile edit; responsive design; keyboard navigation; captions/alt text for media.

## System Needs & Technical Requirements
- Architecture: web frontend (SPA or SSR) + backend API + relational database.
- Authentication/authorization: session or JWT-based auth; role-based access (student/teacher/admin); HTTPS everywhere.
- Data model (core tables): users, roles, classes/groups, enrollments, lessons, objectives, submissions, notifications, audit logs.
- Database: PostgreSQL (recommended) with connection pooling (e.g., pgBouncer) and migrations; use prepared statements/ORM to prevent SQL injection.
- File storage: media/attachments in object storage (e.g., S3-compatible) with signed URLs; store metadata in DB.
- API design: REST or GraphQL with pagination, validation, and rate limiting; input sanitization and output encoding.
- Performance: caching layer (e.g., Redis) for sessions and frequently read lesson/objective data; CDN for static assets.
- Observability: structured logging, request tracing, health checks, and metrics (latency, error rates, DB connections).
- Reliability: automated backups, point-in-time recovery for DB, and environment-specific configs (dev/stage/prod).
- Security: password hashing (bcrypt/argon2), MFA optional, CSRF protection, CORS configured per environment, regular dependency scanning.

## Database Connectivity Considerations
- Connection management: use a pool with sane limits; close idle connections; instrument pool usage.
- Migration strategy: versioned migrations (e.g., Flyway/Prisma/Knex) run as part of deploy pipeline; no manual schema drift.
- Transaction boundaries: wrap multi-step writes (e.g., create lesson + objectives) in transactions; use optimistic locking for edits.
- Query practices: avoid N+1 (use joins/batching), add indexes on foreign keys and search fields, and monitor slow queries.
- Local dev: seeded fixtures for lessons/objectives; docker-compose service for DB; env vars for host/port/user/password/SSL.
