# Mini SaaS Dashboard

A small full-stack SaaS dashboard for managing projects — list, search, filter by
status, and create / edit / delete — behind JWT authentication.

Built with Next.js (App Router), PostgreSQL, and Prisma.

## Features

- **Projects CRUD** with fields: name, status (`Active` / `On hold` / `Completed`),
  deadline, assigned team member, and budget
- **Search** by name or assignee and **filter** by status
- **Responsive UI** — table on desktop, cards on mobile
- **Add / edit modal** with client- and server-side validation
- **Delete** with a confirmation dialog and toast feedback
- **Authentication** — register / login / logout with JWT in an httpOnly cookie;
  projects are scoped to the signed-in user
- **REST API** with owner authorization on every endpoint
- **Seed script** generating a demo user and 24 sample projects
- **Dockerized** — run the whole stack (app + database) with one command

## Tech stack

| Area       | Choice                                  |
| ---------- | --------------------------------------- |
| Framework  | Next.js 16 (App Router) + TypeScript    |
| Styling    | Tailwind CSS                            |
| Data layer | PostgreSQL + Prisma (pg driver adapter) |
| API        | Next.js Route Handlers (REST)           |
| Auth       | JWT (`jose`) + bcrypt, httpOnly cookie  |
| Validation | Zod (shared between client and server)  |
| Client     | React Query for fetching and caching    |
| Container  | Docker + Docker Compose                 |

## Screenshots

| Dashboard                               | Add / edit modal                |
| --------------------------------------- | ------------------------------- |
| ![Dashboard](screenshots/dashboard.png) | ![Modal](screenshots/modal.png) |

| Login                           | Mobile                            |
| ------------------------------- | --------------------------------- |
| ![Login](screenshots/login.png) | ![Mobile](screenshots/mobile.png) |

## Quick start (Docker)

The fastest way to run everything (database, migrations, seed, and app):

```bash
docker compose -f docker-compose.app.yml up --build
```

Then open <http://localhost:3000> and sign in with the demo account:

- **Email:** `demo@example.com`
- **Password:** `demo1234`

## Local development

Requires Node.js 22+ and Docker (for PostgreSQL).

```bash
# 1. Install dependencies (also generates the Prisma client)
npm install

# 2. Create your env file
cp .env.example .env

# 3. Start PostgreSQL (host port 5434)
npm run db:up

# 4. Apply migrations
npm run db:migrate

# 5. Seed the demo user and sample projects
npm run db:seed

# 6. Start the dev server
npm run dev
```

The app runs at <http://localhost:3000>.

> The local database is mapped to host port **5434** (not the default 5432) to
> avoid clashing with other local Postgres instances. Adjust `DATABASE_URL` in
> `.env` if you change it.

## Environment variables

| Variable       | Description                                          |
| -------------- | ---------------------------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string                         |
| `JWT_SECRET`   | Secret used to sign auth tokens (use a random value) |

See `.env.example` for defaults that match the local Docker database.

## Scripts

| Script               | Description                   |
| -------------------- | ----------------------------- |
| `npm run dev`        | Start the dev server          |
| `npm run build`      | Production build              |
| `npm run start`      | Start the production server   |
| `npm run lint`       | Run ESLint                    |
| `npm run format`     | Format with Prettier          |
| `npm run db:up`      | Start the Postgres container  |
| `npm run db:down`    | Stop the Postgres container   |
| `npm run db:migrate` | Apply Prisma migrations       |
| `npm run db:seed`    | Seed demo data (idempotent)   |
| `npm run db:reset`   | Reset the database and reseed |

## API reference

All `/api/projects` routes require authentication and only return or modify the
signed-in user's projects.

### Auth

| Method | Endpoint             | Description                        |
| ------ | -------------------- | ---------------------------------- |
| POST   | `/api/auth/register` | Create an account and sign in      |
| POST   | `/api/auth/login`    | Sign in                            |
| POST   | `/api/auth/logout`   | Sign out (clears the cookie)       |
| GET    | `/api/auth/me`       | Current user, or 401 if signed out |

### Projects

| Method | Endpoint            | Description                                      |
| ------ | ------------------- | ------------------------------------------------ |
| GET    | `/api/projects`     | List projects; `?status=` and `?search=` filters |
| POST   | `/api/projects`     | Create a project                                 |
| GET    | `/api/projects/:id` | Get one project                                  |
| PATCH  | `/api/projects/:id` | Update a project                                 |
| DELETE | `/api/projects/:id` | Delete a project                                 |

Example:

```bash
# Log in and store the cookie
curl -c cookie.txt -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"demo1234"}'

# List active projects matching "platform"
curl -b cookie.txt "http://localhost:3000/api/projects?status=ACTIVE&search=platform"
```

## Project structure

```
prisma/
  schema.prisma          # User and Project models
  migrations/            # SQL migrations
  seed.ts                # Demo user + sample projects
src/
  app/
    api/                 # Auth and projects route handlers
    dashboard/           # Protected dashboard (server-side guard)
    login/ register/     # Auth pages
  components/
    projects/            # Table, toolbar, form modal, view
    ui/                  # Modal, toast, confirm dialog, text field
    auth-provider.tsx    # Client auth context
    query-provider.tsx   # React Query provider
  hooks/                 # Data fetching and mutations
  lib/                   # db, auth, validation, api helpers, formatting
Dockerfile               # Multi-stage build
docker-compose.yml       # Postgres for local dev
docker-compose.app.yml   # Full stack (Postgres + app)
```

## Notes

- Passwords are hashed with bcrypt; the JWT is stored in an httpOnly,
  same-site cookie and verified on protected routes.
- The dashboard is guarded server-side, so unauthenticated requests are
  redirected to `/login` before any data is rendered.
- The seed script is idempotent — it replaces the demo user's projects on each
  run, so it is safe to run repeatedly.
