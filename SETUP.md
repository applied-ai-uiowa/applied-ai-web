# Applied AI Web - Setup Complete

## What's Been Implemented

### Core Infrastructure

- ✅ Database schema with Drizzle ORM
- ✅ Neon Postgres database connection
- ✅ Database migrations
- ✅ Clerk authentication setup
- ✅ Middleware for route protection
- ✅ Server Actions for all CRUD operations

### Public Pages

- ✅ Home page with next meeting card
- ✅ Tutorials page (grouped by category)
- ✅ Projects page (grouped by category)
- ✅ Board members page

### Admin Dashboard

- ✅ Meeting management
- ✅ Tutorials CRUD
- ✅ Projects CRUD
- ✅ Board members CRUD
- ✅ Image upload for board member photos (Vercel Blob)

## Next Steps

### 1. Add Clerk Environment Variables

Edit `.env.local` and replace the placeholder values:

```bash
# Get these from https://dashboard.clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
CLERK_SECRET_KEY=sk_test_your_actual_key_here

# Add your admin email(s) (comma-separated)
ADMIN_EMAILS=your_email@example.com,another_admin@uiowa.edu
```

### 2. Run the Development Server

```bash
npm run dev
```

Visit http://localhost:3000

### 3. Test the Application

1. **Public pages** - Should work without authentication:
   - Home: http://localhost:3000
   - Tutorials: http://localhost:3000/tutorials
   - Projects: http://localhost:3000/projects
   - Board: http://localhost:3000/board

2. **Sign in** - Click "Sign In" in the header or visit:
   - http://localhost:3000/sign-in

3. **Admin Dashboard** - Only accessible to emails in `ADMIN_EMAILS`:
   - http://localhost:3000/admin

### 4. Deploy to Vercel

The project is already linked to Vercel. To deploy:

1. **Add environment variables in Vercel Dashboard:**
   - Go to your project settings
   - Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Add `CLERK_SECRET_KEY`
   - Add `ADMIN_EMAILS`

2. **Configure Clerk:**
   - In Clerk Dashboard, add your Vercel domain to allowed origins
   - Both production domain and preview domains

3. **Push to deploy:**
   ```bash
   git add .
   git commit -m "Complete implementation"
   git push
   ```

## Database Migrations

If you make changes to the database schema:

```bash
# Generate migration files
npm run db:generate

# Apply migrations
npm run db:migrate
```

## Project Structure

```
applied-ai-web/
├── app/
│   ├── actions/          # Server Actions
│   │   ├── meeting.ts
│   │   ├── tutorials.ts
│   │   ├── projects.ts
│   │   └── board.ts
│   ├── admin/           # Admin dashboard
│   │   ├── components/  # Admin-specific components
│   │   └── page.tsx
│   ├── board/           # Board members page
│   ├── projects/        # Projects page
│   ├── tutorials/       # Tutorials page
│   ├── sign-in/         # Clerk sign-in
│   ├── sign-up/         # Clerk sign-up
│   ├── layout.tsx       # Root layout with ClerkProvider
│   └── page.tsx         # Home page
├── components/          # Shared components
│   ├── Header.tsx
│   └── MeetingCard.tsx
├── db/                  # Database
│   ├── schema.ts        # Drizzle schema
│   ├── index.ts         # DB client
│   └── migrate.ts       # Migration script
├── lib/                 # Utilities
│   ├── auth.ts          # Auth helpers
│   └── types.ts         # Shared types
├── drizzle/             # Generated migrations
├── proxy.ts             # Clerk proxy (middleware)
└── drizzle.config.ts    # Drizzle configuration
```

## Features

### Meeting Management

- Single meeting info displayed on home page
- Admin can update meeting details, datetime, location, RSVP link

### Tutorials

- Organized by category
- Each tutorial has title, URL, category, sort order
- Admin can add/delete tutorials

### Projects

- Organized by category
- Each project has title, description, GitHub URL, demo URL
- Admin can add/delete projects

### Board Members

- Display active board members
- Each member has name, role, bio, photo, social links
- Admin can add/delete/activate/deactivate members

## Authentication Flow

1. Public pages are accessible to everyone
2. Admin routes require authentication
3. After signing in, user email is checked against `ADMIN_EMAILS`
4. If email matches, user gets admin access
5. Proxy (middleware) protects admin routes at the edge

## Database Tables

- `meeting` - Single row for next meeting info
- `tutorials` - Tutorial links with categories
- `projects` - Project showcases with links
- `board_members` - Executive board member profiles

## Image Uploads (Vercel Blob)

Board member photos are stored using Vercel Blob Storage. The `BLOB_READ_WRITE_TOKEN` is already in your `.env.local`.

When adding a board member:

1. Click "Choose Image" to upload a photo
2. Image uploads automatically to Vercel Blob
3. Preview shows immediately
4. Public URL is saved to database

See `BLOB_STORAGE.md` for detailed documentation on image uploads.

## Need Help?

- `SETUP.md` - This file (setup and usage)
- `IMPLEMENTATION_PLAN.md` - Architecture decisions and best practices
- `BLOB_STORAGE.md` - Image upload documentation
