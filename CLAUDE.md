# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Applied AI is a Next.js web application for the University of Iowa's Applied AI student organization. It's a public-facing site with an admin dashboard for managing content (tutorials, projects, podcast episodes, board members, and news).

## Commands

```bash
npm run dev           # Start development server (localhost:3000)
npm run build         # Build for production
npm run lint          # Run ESLint
npm run format        # Format with Prettier
npm run format:check  # Check formatting without writing
npm run db:generate   # Generate Drizzle migration files from schema changes
npm run db:migrate    # Apply pending migrations to the database
```

## Architecture

**Framework:** Next.js App Router with React Server Components. Pages are async Server Components; client components are used only when interactivity requires it (`"use client"` directive).

**Data layer:** No REST API. All mutations go through Next.js Server Actions in `app/actions/`. Actions return `ActionResult<T>` (`{ success, message?, errors?, data? }`). Server Actions call `revalidatePath()` after mutations.

**Database:** PostgreSQL on Neon, accessed via Vercel Postgres. ORM is Drizzle. Schema is defined in `db/schema.ts`; the client is exported from `db/index.ts`. Migrations live in `drizzle/`.

**Auth:** Clerk for authentication. Admin authorization is handled in `lib/auth.ts` via `requireAdmin()` (throws redirect if not admin) and `isAdmin()` (returns boolean). Admin emails are configured via the `ADMIN_EMAILS` environment variable (comma-separated).

**File storage:** Vercel Blob for images. `app/actions/upload.ts` exposes `uploadImage` and `deleteImage`. Board member actions clean up Blob images on deletion.

**Styling:** Tailwind CSS v4 with a dark theme (black background, yellow/gold accents).

## Key Files

| Path | Purpose |
|------|---------|
| `db/schema.ts` | All Drizzle table definitions |
| `db/index.ts` | Database client (Vercel Postgres) |
| `lib/auth.ts` | `requireAdmin()` / `isAdmin()` helpers |
| `lib/types.ts` | Shared TypeScript types including `ActionResult<T>` |
| `app/actions/` | Server Actions for all content mutations |
| `app/admin/` | Admin dashboard page and its components |
| `components/` | Shared layout components (Header, Footer, MeetingCard, icons) |
| `drizzle.config.ts` | Points drizzle-kit at `db/schema.ts` and `./drizzle` migrations folder |

## Environment Variables

Required in `.env`:
- `POSTGRES_URL` — pooled Neon connection (used at runtime)
- `POSTGRES_URL_UNPOOLED` — non-pooled connection (used by migrations)
- `CLERK_SECRET_KEY` / `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — Clerk auth
- `ADMIN_EMAILS` — comma-separated list of admin email addresses
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob storage token

## Database Workflow

After modifying `db/schema.ts`:
1. `npm run db:generate` — creates a new SQL migration file in `drizzle/`
2. `npm run db:migrate` — applies the migration (`db/migrate.ts` uses the unpooled connection)
