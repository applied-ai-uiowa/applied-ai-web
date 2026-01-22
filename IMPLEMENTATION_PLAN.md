# Applied AI Web - Implementation Plan

## Overview

This document provides a complete, step-by-step implementation plan for the Applied AI student organization website. The site will be built with Next.js (App Router), TypeScript, Tailwind CSS, Clerk authentication, Vercel Postgres, and Drizzle ORM.

---

## A) Key Findings (with Context7 Citations)

### 1. Clerk + Next.js App Router

- **Middleware-based protection** is the recommended pattern. Use `clerkMiddleware` with `createRouteMatcher` to define public vs protected vs admin routes
  - _Source: [Clerk Next.js App Quickstart](https://context7.com/clerk/clerk-nextjs-app-quickstart/llms.txt)_
- **Server-side auth** in Server Actions uses `auth()` and `currentUser()` from `@clerk/nextjs/server`
  - _Source: [Clerk Next.js App Quickstart](https://context7.com/clerk/clerk-nextjs-app-quickstart/llms.txt)_
- **Admin allowlist** can be implemented via:
  - Clerk session claims (custom `metadata.role`) checked in middleware
  - OR a simple environment variable allowlist (e.g., `ADMIN_EMAILS`) checked server-side
  - _Source: [Clerk Next.js App Quickstart - middleware.ts example](https://context7.com/clerk/clerk-nextjs-app-quickstart/llms.txt)_
- **ClerkProvider** wraps the app in root layout; use `cssLayerName: 'clerk'` for Tailwind 4 compatibility
  - _Source: [Clerk Next.js App Quickstart](https://context7.com/clerk/clerk-nextjs-app-quickstart/llms.txt)_

### 2. Vercel Postgres + Next.js

- Vercel Postgres is now provided via **Marketplace integrations** (Neon is the primary provider)
  - _Source: [Vercel Docs - Connecting to the Marketplace](https://vercel.com/docs/llms-full)_
- Environment variables are **auto-injected** when you add a Postgres integration to your Vercel project
- For local dev: use `vercel link` + `vercel env pull` to populate `.env.local`
  - _Source: [Vercel Docs - Local Development Environment Setup](https://vercel.com/docs/deployments/local-env)_

### 3. Drizzle + Postgres + Next.js App Router

- **Drizzle with Vercel Postgres** uses `drizzle-orm/vercel-postgres` driver - minimal setup
  - _Source: [Drizzle ORM Docs](https://github.com/drizzle-team/drizzle-orm-docs/blob/main/src/content/docs/tutorials/drizzle-with-db/drizzle-with-vercel.mdx)_
- **Schema file**: define tables with `pgTable` from `drizzle-orm/pg-core`
  - _Source: [Drizzle ORM Docs](https://github.com/drizzle-team/drizzle-orm-docs/blob/main/src/content/docs/tutorials/drizzle-with-db/drizzle-with-neon.mdx)_
- **Migrations**: use `drizzle-kit generate` then `drizzle-kit migrate`, OR use `drizzle-kit push` for rapid local iteration
  - _Source: [Drizzle ORM Docs - Migrations](https://github.com/drizzle-team/drizzle-orm-docs/blob/main/src/content/docs/migrations.mdx)_
- **Config file**: `drizzle.config.ts` with `defineConfig({ dialect: 'postgresql', schema, out, dbCredentials })`
  - _Source: [Drizzle ORM Docs](https://context7.com/drizzle-team/drizzle-orm-docs/llms.txt)_

### 4. Server Actions (Next.js)

- Use `'use server'` directive at top of action files
- For form handling, use React's `useActionState` hook in client components
  - _Source: [Next.js Docs - Forms Guide](https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/forms.mdx)_
- **Revalidation**: call `revalidatePath('/path')` or `revalidateTag('tag')` after mutations
  - _Source: [Next.js Docs - Updating Data](https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/08-updating-data.mdx)_
- Return structured state objects for error handling (not throwing)
  - _Source: [Next.js Docs - Error Handling](https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/10-error-handling.mdx)_

### 5. Tailwind + Simple UI

- Use `@tailwindcss/forms` plugin for form reset/base styles
- Standard utility classes: `rounded-md`, `border-gray-300`, `focus:ring-indigo-500`, etc.
  - _Source: [Tailwind CSS Forms Plugin](https://context7.com/tailwindlabs/tailwindcss-forms/llms.txt)_

---

## B) Complete Implementation Plan

### Step 1: Repository Init + Dependencies

```bash
# Create Next.js app with App Router + TypeScript + Tailwind
npx create-next-app@latest applied-ai-web --typescript --tailwind --app --eslint

cd applied-ai-web

# Install core dependencies
npm install @clerk/nextjs drizzle-orm @vercel/postgres

# Install dev dependencies
npm install -D drizzle-kit @tailwindcss/forms
```

### Step 2: Environment Variables Checklist

Create `.env.local` for local development:

```bash
# Clerk (from https://dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

# Clerk URLs (optional but recommended)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Vercel Postgres (auto-populated via `vercel env pull` after linking)
POSTGRES_URL=postgres://...
POSTGRES_URL_NON_POOLING=postgres://...

# Admin allowlist (comma-separated emails)
ADMIN_EMAILS=admin@example.com,leader@uiowa.edu
```

**Vercel Dashboard Setup:**

1. Add same env vars in Vercel project settings
2. For Postgres: Add a Postgres integration from Vercel Marketplace (Neon)
3. Env vars will auto-populate for `POSTGRES_URL`

### Step 3: DB Schema (Tables + Columns)

**Tables needed:**

| Table           | Purpose                            |
| --------------- | ---------------------------------- |
| `meeting`       | Single row for "next meeting" info |
| `tutorials`     | YouTube tutorial links             |
| `projects`      | Project links                      |
| `board_members` | Executive board members            |

**Drizzle Schema Code** (`src/db/schema.ts`):

```typescript
import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

// Single-row table for meeting info
export const meeting = pgTable("meeting", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  datetime: timestamp("datetime").notNull(),
  location: text("location").notNull(),
  details: text("details"),
  rsvpLink: text("rsvp_link"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const tutorials = pgTable("tutorials", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  category: text("category").notNull(), // e.g., "Python", "Machine Learning"
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  githubUrl: text("github_url"),
  demoUrl: text("demo_url"),
  category: text("category").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const boardMembers = pgTable("board_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(), // e.g., "President", "VP"
  bio: text("bio"),
  photoUrl: text("photo_url"),
  linkedinUrl: text("linkedin_url"),
  githubUrl: text("github_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});

// Type exports for use in Server Actions
export type Meeting = typeof meeting.$inferSelect;
export type InsertMeeting = typeof meeting.$inferInsert;
export type Tutorial = typeof tutorials.$inferSelect;
export type InsertTutorial = typeof tutorials.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;
export type BoardMember = typeof boardMembers.$inferSelect;
export type InsertBoardMember = typeof boardMembers.$inferInsert;
```

**Drizzle Config** (`drizzle.config.ts`):

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
```

**DB Client** (`src/db/index.ts`):

```typescript
import { drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from "./schema";

export const db = drizzle({ schema });
```

**Migration Commands:**

```bash
# Generate migration files
npx drizzle-kit generate

# Apply migrations (local dev or CI)
npx drizzle-kit migrate

# OR for rapid local iteration:
npx drizzle-kit push
```

### Step 4: Routing Map

| Route        | Type      | Description                                   |
| ------------ | --------- | --------------------------------------------- |
| `/`          | Public    | Home page with club intro + next meeting card |
| `/tutorials` | Public    | List of tutorial links by category            |
| `/projects`  | Public    | List of project links by category             |
| `/board`     | Public    | Executive board member cards                  |
| `/admin`     | Protected | Admin dashboard (requires auth + admin role)  |
| `/sign-in`   | Public    | Clerk sign-in page                            |
| `/sign-up`   | Public    | Clerk sign-up page                            |

### Step 5: Admin UI Sections & Server Actions

**Admin Dashboard Layout:**

- Tabs or sections: Meeting | Tutorials | Projects | Board Members
- Each section has: View list → Add/Edit forms → Delete/Reorder controls

**Server Action Signatures** (`src/app/actions/`):

```typescript
// src/app/actions/meeting.ts
"use server";
export async function updateMeeting(formData: FormData): Promise<ActionResult>;

// src/app/actions/tutorials.ts
("use server");
export async function createTutorial(formData: FormData): Promise<ActionResult>;
export async function updateTutorial(
  id: number,
  formData: FormData
): Promise<ActionResult>;
export async function deleteTutorial(id: number): Promise<ActionResult>;
export async function reorderTutorials(
  orderedIds: number[]
): Promise<ActionResult>;

// src/app/actions/projects.ts
("use server");
export async function createProject(formData: FormData): Promise<ActionResult>;
export async function updateProject(
  id: number,
  formData: FormData
): Promise<ActionResult>;
export async function deleteProject(id: number): Promise<ActionResult>;
export async function reorderProjects(
  orderedIds: number[]
): Promise<ActionResult>;

// src/app/actions/board.ts
("use server");
export async function createBoardMember(
  formData: FormData
): Promise<ActionResult>;
export async function updateBoardMember(
  id: number,
  formData: FormData
): Promise<ActionResult>;
export async function deleteBoardMember(id: number): Promise<ActionResult>;
export async function reorderBoardMembers(
  orderedIds: number[]
): Promise<ActionResult>;
```

**ActionResult type:**

```typescript
type ActionResult = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};
```

### Step 6: Authorization Approach

**1. Middleware (route-level protection)** (`middleware.ts`):

```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/tutorials",
  "/projects",
  "/board",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (isAdminRoute(request)) {
    const { userId } = await auth();

    if (!userId) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("redirect_url", request.url);
      return NextResponse.redirect(signInUrl);
    }

    // Additional admin check happens in the page/action (see below)
  }

  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

**2. Server-side admin check (in actions + pages):**

```typescript
// src/lib/auth.ts
import { auth, currentUser } from "@clerk/nextjs/server";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase());

export async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress?.toLowerCase();

  if (!email || !ADMIN_EMAILS.includes(email)) {
    throw new Error("Forbidden: Admin access required");
  }

  return user;
}

export async function isAdmin(): Promise<boolean> {
  try {
    await requireAdmin();
    return true;
  } catch {
    return false;
  }
}
```

**3. Use in Server Actions:**

```typescript
// src/app/actions/tutorials.ts
"use server";

import { requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import { tutorials } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function createTutorial(formData: FormData) {
  await requireAdmin(); // Throws if not admin

  const title = formData.get("title") as string;
  const url = formData.get("url") as string;
  const category = formData.get("category") as string;

  await db.insert(tutorials).values({ title, url, category });

  revalidatePath("/tutorials");
  revalidatePath("/admin");

  return { success: true };
}
```

### Step 7: Revalidation/Caching Approach

**Strategy:** Use `revalidatePath()` after every mutation

```typescript
// After any CRUD operation:
revalidatePath("/tutorials"); // Revalidate public page
revalidatePath("/admin"); // Revalidate admin page
```

**Public pages** fetch data directly in Server Components (no caching config needed for dynamic DB reads):

```typescript
// src/app/tutorials/page.tsx
import { db } from '@/db';
import { tutorials } from '@/db/schema';
import { asc } from 'drizzle-orm';

export default async function TutorialsPage() {
  const items = await db.select().from(tutorials).orderBy(asc(tutorials.sortOrder));

  return (
    <main>
      {/* Render tutorials */}
    </main>
  );
}
```

This ensures:

- Public pages always show fresh data after admin edits
- No manual cache busting needed
- No redeploy required for content updates

### Step 8: Deployment Steps (Vercel)

1. **Push to GitHub** (create repo, push code)

2. **Import to Vercel:**
   - Go to vercel.com → New Project → Import from GitHub
   - Select `applied-ai-web` repo

3. **Add Postgres Integration:**
   - In Vercel Dashboard → Project → Storage tab
   - Click "Connect Store" → Select Neon Postgres
   - Create new database or connect existing
   - Environment variables auto-added

4. **Add Clerk Environment Variables:**
   - Project Settings → Environment Variables
   - Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Add `CLERK_SECRET_KEY`
   - Add `ADMIN_EMAILS`

5. **Configure Clerk:**
   - In Clerk Dashboard, add your Vercel domains to allowed origins
   - Production domain + preview domains

6. **Run Migrations:**
   - Option A: Run locally with production DB URL
   - Option B: Add build command: `npx drizzle-kit migrate && next build`

7. **Deploy:**
   - Push to main branch → auto-deploys
   - Verify at your Vercel URL

---

## C) Suggested Folder Structure

```
applied-ai-web/
├── drizzle/                    # Generated migration files
│   └── 0000_xxx.sql
├── public/
│   └── images/                 # Static images (board photos, etc.)
├── src/
│   ├── app/
│   │   ├── (auth)/             # Route group for auth pages
│   │   │   ├── sign-in/
│   │   │   │   └── [[...sign-in]]/
│   │   │   │       └── page.tsx
│   │   │   └── sign-up/
│   │   │       └── [[...sign-up]]/
│   │   │           └── page.tsx
│   │   ├── admin/
│   │   │   ├── page.tsx        # Admin dashboard
│   │   │   └── components/     # Admin-specific components
│   │   │       ├── MeetingForm.tsx
│   │   │       ├── TutorialList.tsx
│   │   │       ├── ProjectList.tsx
│   │   │       └── BoardMemberList.tsx
│   │   ├── board/
│   │   │   └── page.tsx        # Executive board page
│   │   ├── projects/
│   │   │   └── page.tsx        # Projects listing
│   │   ├── tutorials/
│   │   │   └── page.tsx        # Tutorials listing
│   │   ├── actions/            # Server Actions
│   │   │   ├── meeting.ts
│   │   │   ├── tutorials.ts
│   │   │   ├── projects.ts
│   │   │   └── board.ts
│   │   ├── layout.tsx          # Root layout with ClerkProvider
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Tailwind imports
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Modal.tsx
│   │   ├── Header.tsx          # Site header/nav
│   │   ├── Footer.tsx
│   │   └── MeetingCard.tsx     # "Next meeting" display
│   ├── db/
│   │   ├── index.ts            # DB client export
│   │   └── schema.ts           # Drizzle schema definitions
│   └── lib/
│       ├── auth.ts             # Auth helpers (requireAdmin, isAdmin)
│       └── utils.ts            # General utilities
├── .env.local                  # Local environment variables
├── drizzle.config.ts           # Drizzle Kit configuration
├── middleware.ts               # Clerk middleware
├── next.config.ts              # Next.js config
├── tailwind.config.ts          # Tailwind config
├── tsconfig.json
└── package.json
```

---

## D) MVP-First Cut Milestone List

### MVP (1-2 Sessions)

**Session 1: Foundation**

- [ ] Create Next.js project with all dependencies
- [ ] Set up Clerk (layout, middleware, sign-in/sign-up pages)
- [ ] Set up Drizzle schema and run initial migration
- [ ] Create basic public page layouts (/, /tutorials, /projects, /board)
- [ ] Fetch and display data on public pages (even if seeded manually)

**Session 2: Admin CRUD**

- [ ] Create admin page with auth check
- [ ] Implement Meeting update form + action
- [ ] Implement Tutorials CRUD (add/edit/delete)
- [ ] Implement Projects CRUD (add/edit/delete)
- [ ] Implement Board Members CRUD (add/edit/delete)
- [ ] Test revalidation (edits show on public pages)

### Polish Tasks (Post-MVP)

- [ ] Add reordering UI (drag-and-drop or up/down buttons)
- [ ] Style refinement (responsive design, better cards)
- [ ] Add loading states and error toasts
- [ ] Add form validation (client + server)
- [ ] Image uploads for board member photos (Vercel Blob or external)
- [ ] Categories management (make categories editable vs hardcoded)
- [ ] Add "preview" mode for meeting card
- [ ] SEO metadata for public pages
- [ ] Rate limiting on Server Actions (optional)
- [ ] Analytics integration (Vercel Analytics or Plausible)

---

## Summary

This plan uses the current best-practice patterns from:

- **Clerk**: Middleware-based route protection + server-side admin allowlist
- **Next.js App Router**: Server Components for data fetching, Server Actions for mutations
- **Drizzle ORM**: Type-safe schema with `drizzle-kit` migrations
- **Vercel Postgres**: Marketplace integration with auto-injected env vars
- **Tailwind**: `@tailwindcss/forms` plugin for clean admin forms

The architecture is intentionally simple: no external CMS, no complex caching layers, no separate API routes. Server Actions handle all mutations with `revalidatePath` ensuring public pages stay fresh. The admin allowlist is a simple env var, avoiding the need for a roles table or complex RBAC for a small student org.

---

## Additional Resources

- [Clerk Next.js Documentation](https://clerk.com/docs/quickstarts/nextjs)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Vercel Postgres Documentation](https://vercel.com/docs/storage/vercel-postgres)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
