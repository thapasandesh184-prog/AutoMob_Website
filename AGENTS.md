# AGENTS.md — SKay Auto group

> This file is the single source of truth for AI coding agents working on this project. Read it before you write any code.

---

## Project Overview

**SKay Auto group** is a full-stack luxury and exotic car dealership web application built for a Canadian auto group based in Richmond, BC. It serves two audiences:

1. **Public visitors** — Browse inventory, compare vehicles, apply for financing, book appointments, sell/trade-in a car, submit contact forms, and view dealership information.
2. **Administrators** — Manage vehicle inventory (CRUD), view customer submissions (contact, finance, trade-in, appointments, car-finder requests), and edit site settings via a protected dashboard.

The site is a **single-tenant** application with a dark, black-and-gold luxury aesthetic. All pages default to a dark theme.

---

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.2.3 |
| UI Library | React | 19.2.4 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| UI Components | shadcn/ui (base-nova style) | 4.2.0 |
| ORM | Prisma | 6.19.3 |
| Database | MySQL (production) / SQLite (local dev fallback) | — |
| Auth | NextAuth.js (Credentials provider) | 4.24.13 |
| Image Hosting | Cloudinary | 2.9.0 |
| Animations | Framer Motion, GSAP | latest |
| Forms | React Hook Form + Zod | latest |
| Icons | Lucide React | latest |
| Notifications | Sonner | latest |
| Carousel | Embla Carousel | latest |

---

## Directory Structure

```
my-app/
├── app/
│   ├── (public)/              # Customer-facing routes (grouped, no URL prefix)
│   │   ├── page.tsx           # Homepage
│   │   ├── layout.tsx         # Public layout (Navbar + Footer + MapSection)
│   │   ├── about/
│   │   ├── inventory/         # Vehicle listing + detail pages
│   │   ├── compare/
│   │   ├── contact/
│   │   ├── finance/
│   │   ├── book-appointment/
│   │   ├── sell-us-your-car/
│   │   ├── car-finder/
│   │   ├── directions/
│   │   ├── team/
│   │   ├── privacy/
│   │   ├── terms/
│   │   └── sitemap/
│   ├── admin/                 # Admin dashboard (protected)
│   │   ├── layout.tsx         # Server layout (blocks robots)
│   │   ├── ClientLayout.tsx   # Client layout (auth guard + sidebar)
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── cars/
│   │   ├── submissions/
│   │   └── settings/
│   ├── api/                   # Next.js API routes
│   │   ├── auth/[...nextauth]/
│   │   ├── vehicles/
│   │   ├── admin/
│   │   ├── contact/
│   │   ├── finance/
│   │   ├── appointments/
│   │   ├── trade-in/
│   │   ├── car-finder/
│   │   ├── upload/
│   │   ├── admin/upload/
│   │   ├── settings/
│   │   └── health/
│   ├── globals.css            # Tailwind imports, CSS vars, custom utilities
│   ├── layout.tsx             # Root layout (fonts, metadata, Toaster)
│   ├── not-found.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── public/                # Public page components (Navbar, Footer, VehicleCard, etc.)
│   ├── ui/                    # shadcn/ui components (Button, Card, Dialog, Table, etc.)
│   └── JsonLd.tsx             # JSON-LD structured data helper
├── hooks/
│   ├── use-compare.ts         # localStorage-based vehicle compare (max 3)
│   └── use-site-settings.ts   # Fetch site settings from /api/settings
├── lib/
│   ├── auth.ts                # NextAuth configuration (credentials provider)
│   ├── prisma.ts              # PrismaClient singleton
│   ├── cloudinary.ts          # Cloudinary upload helper
│   ├── settings.ts            # Site settings CRUD helpers
│   └── utils.ts               # cn() helper + map embed URL sanitization
├── types/
│   └── index.ts               # Shared TypeScript interfaces (Vehicle, NavLink)
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Prisma migrations
│   ├── seed.ts                # Seeds demo vehicles + admin user
│   └── seed-settings.ts       # Seeds default site settings
├── next.config.ts             # Next.js config (standalone output, image domains)
├── tsconfig.json              # TypeScript config (path alias @/*)
├── postcss.config.mjs         # PostCSS (Tailwind v4)
├── eslint.config.mjs          # ESLint (next/core-web-vitals + next/typescript)
├── server-wrapper.js          # Production server bootstrap (Prisma pre-connect)
└── package.json
```

---

## Build and Run Commands

```bash
# Install dependencies
npm install

# Generate Prisma client and build for production
npm run build

# Start production server
npm start

# Development server
npm run dev

# Lint
npm run lint

# Seed database (vehicles + admin user)
npx tsx prisma/seed.ts

# Seed site settings only
npx tsx prisma/seed-settings.ts

# Database migrations (dev)
npx prisma migrate dev

# Database migrations (production)
npx prisma migrate deploy

# Generate Prisma client only
npx prisma generate
```

**Default admin credentials (seed):**
- Email: `admin@skayautogroup.ca`
- Password: `admin123`

---

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Database
DATABASE_URL="mysql://username:password@127.0.0.1:3306/database_name?connection_limit=5&pool_timeout=10"

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-random-secret-min-32-chars"

# Admin credentials (used only by seed script)
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="your-admin-password"

# Cloudinary (image uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

**Important:** In production, `NEXTAUTH_SECRET` must be at least 32 characters. Generate with `openssl rand -base64 32`.

---

## Architecture Patterns

### Route Groups
- `app/(public)/` — All customer pages share a layout with `Navbar`, `Footer`, and `MapSection`. The `(public)` group does NOT affect the URL path.
- `app/admin/` — Completely separate layout with authentication guard and sidebar navigation.

### Server vs Client Components
- **Server Components** are the default. Public pages (`page.tsx`) are async server components that fetch data directly from Prisma or via fetch to API routes.
- **Client Components** are explicitly marked with `"use client"` and used for:
  - Interactive UI (forms, carousels, dialogs, sheets)
  - Hooks that access browser APIs (`useEffect`, `localStorage`, `window`)
  - Admin dashboard client layout (`ClientLayout.tsx`) which wraps `SessionProvider`
  - Page content components named `content.tsx` (when they need client interactivity)

### Data Fetching
- **Server pages** fetch data directly from `prisma` where possible (e.g., `/admin/dashboard/page.tsx`).
- **Client pages** fetch from REST API routes (e.g., `/api/vehicles?featured=true`) using standard `fetch`.
- **Settings** are fetched client-side via `/api/settings` and cached in component state.

### API Routes
All API routes use the standard Next.js App Router pattern:

```ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) { ... }
export async function POST(request: NextRequest) { ... }
```

Key API routes:
- `GET /api/vehicles` — Filterable vehicle listing
- `GET /api/vehicles/[slug]` — Single vehicle detail
- `POST /api/admin/cars` — Create vehicle (admin only in practice)
- `POST /api/contact` — Save contact form submission
- `POST /api/finance` — Save finance application
- `POST /api/upload` — Upload files to Cloudinary (public)
- `POST /api/admin/upload` — Upload images to Cloudinary (admin)
- `GET /api/settings` — Get all site settings
- `GET /api/health` — Health check

### Database Schema

Prisma models (MySQL datasource in production):

- `Vehicle` — Car inventory (make, model, year, price, images, features, status, featured, etc.)
- `AdminUser` — Single admin login (email + bcrypt hashed password)
- `ContactSubmission` — Contact form entries
- `FinanceApplication` — Finance applications with full personal details
- `TradeInSubmission` — Sell/trade-in vehicle submissions
- `Appointment` — Booked appointments (test drive, service, etc.)
- `CarFinderRequest` — Customer requests for help finding a specific car
- `SiteSetting` — Key-value store for CMS-like site configuration (grouped by category)

**Note:** `features` and `images` on `Vehicle` are stored as comma-separated strings in the database, but parsed into arrays when returned via API.

### Authentication
- NextAuth.js with **CredentialsProvider** (email + password).
- JWT session strategy.
- Admin pages redirect unauthenticated users to `/admin/login`.
- The `authOptions` object is defined in `lib/auth.ts` and consumed by `app/api/auth/[...nextauth]/route.ts`.

### Image Handling
- Vehicle images are uploaded to **Cloudinary** via `lib/cloudinary.ts`.
- Max file size: **10 MB**.
- Next.js `Image` component is used throughout with proper `sizes` attributes.
- Remote image domains whitelisted in `next.config.ts`: `images.unsplash.com`, `image123.azureedge.net`, `res.cloudinary.com`.

---

## Code Style Guidelines

### TypeScript
- **Strict mode enabled.** All code must pass TypeScript strict checks.
- Use explicit types for function parameters and return values.
- The path alias `@/*` maps to the project root (`./`).

### React
- Prefer **Server Components** unless you need client-side interactivity.
- Mark client components with `"use client"` at the top of the file.
- Use React Hook Form + Zod for all form validation.

### Styling
- **Tailwind CSS v4** is used with the new `@import "tailwindcss"` syntax.
- All styling is utility-class based. No CSS modules or styled-components.
- Custom CSS lives in `app/globals.css`:
  - CSS variables for theming (black background `#000000`, gold accent `#C0A66A`)
  - Custom utilities: `.glass`, `.text-gradient-gold`, `.animate-fade-up`, `.glow-gold`
  - Custom scrollbar styles
- shadcn/ui components are in `components/ui/` and styled with the project's dark theme.
- **Headings** use the Oswald font family (uppercase, letter-spacing).
- **Body text** uses Inter.

### Component Conventions
- shadcn/ui components go in `components/ui/`.
- Public/shared components go in `components/public/`.
- Reusable but non-shadcn components go in `components/`.
- Page-specific client components are often named `content.tsx` inside the route folder.

### Error Handling
- API routes wrap database calls in `try/catch` and return `500` with a JSON error message.
- Server components that query Prisma wrap calls in `try/catch` and gracefully handle database errors (e.g., the admin dashboard shows a red error banner instead of crashing).
- Console logs are used for server-side errors; toast notifications (`sonner`) are used for client-side action feedback.

---

## Testing

**There is no automated test suite in this project.** Testing is done manually:

1. Run `npm run dev` and verify pages at `http://localhost:3000`.
2. Test admin login at `/admin/login`.
3. Test vehicle CRUD in the admin dashboard.
4. Test all public forms (contact, finance, trade-in, appointment, car-finder).
5. Test image uploads in the vehicle form.
6. Verify Cloudinary images load correctly.

---

## Deployment

### Production Build

The app is configured for **standalone** output (`output: 'standalone'` in `next.config.ts`).

```bash
npm install
npx prisma migrate deploy
npx tsx prisma/seed.ts
npm run build
```

### Server Bootstrap

A custom `server-wrapper.js` is provided at the project root. It pre-connects Prisma before starting the Next.js standalone server. Use this on Node.js hosts:

```bash
node server-wrapper.js
```

This wrapper:
- Sets `NODE_ENV=production`
- Pre-connects Prisma and attaches it to `global.prisma`
- Requires `./server.js` (generated by Next.js standalone build in `.next/standalone/`)

### Hosting Notes
- **GoDaddy cPanel (Node.js)** is the documented target. Upload files and point the app startup file to `server-wrapper.js` or `.next/standalone/server.js`.
- Ensure `public/uploads` is writable if using local file uploads (though Cloudinary is preferred).
- For MySQL on shared hosting, the `.env.example` recommends `127.0.0.1` over `localhost` to avoid MariaDB socket authentication issues.

### Static Export (Not Recommended)

If the host does not support Node.js, you can switch to static export, but **admin functionality and API routes will not work**:

```ts
// next.config.ts
output: "export",
distDir: "dist",
```

---

## Security Considerations

1. **Admin Password** — Change from the default `admin123` immediately after first login.
2. **NEXTAUTH_SECRET** — Must be a strong, random 32+ character string in production.
3. **Database** — Use MySQL in production. The `prisma/dev.db` SQLite file is for local development only.
4. **File Uploads** — Max 10 MB. Files are uploaded to Cloudinary, not stored locally.
5. **Admin Routes** — All `/admin/*` pages have `robots: { index: false, follow: false }` in metadata to prevent indexing.
6. **Map Embed URLs** — `getSafeMapEmbedUrl()` in `lib/utils.ts` validates that map URLs start with `https://www.google.com/maps/embed` to prevent injection.
7. **No Rate Limiting** — There is no built-in rate limiting on API routes. Add one if the site is exposed to public traffic.
8. **No Input Sanitization Library** — Form inputs are validated with Zod schemas but not sanitized with DOMPurify or similar. Be cautious if rendering user-generated HTML.

---

## Common Tasks for Agents

### Adding a New Public Page
1. Create a folder under `app/(public)/`.
2. Add `page.tsx` (server component for SEO/metadata) and optionally `content.tsx` (client component for interactivity).
3. Add the route to `app/sitemap.ts`.
4. Update `Navbar` and `Footer` links if needed.

### Adding a New API Route
1. Create a folder under `app/api/` with a `route.ts` file.
2. Export `GET`, `POST`, `PUT`, `PATCH`, or `DELETE` handlers using `NextRequest`/`NextResponse`.
3. Use `prisma` from `@/lib/prisma` for database access.

### Adding a New Database Model
1. Edit `prisma/schema.prisma`.
2. Run `npx prisma migrate dev --name <name>`.
3. Run `npx prisma generate`.
4. Use the new Prisma Client type in API routes and server components.

### Modifying the Vehicle Form
- The shared form component is `app/admin/cars/vehicle-form.tsx`.
- It uses `react-hook-form` + Zod for validation.
- Images are managed as an array of URLs; new images are uploaded via `/api/admin/upload`.

### Changing Site Colors
- The primary accent is **gold `#C0A66A`**.
- All theme colors are CSS custom properties in `:root` and `.dark` inside `app/globals.css`.
- Tailwind theme colors reference these variables via `@theme inline`.

---

## External Dependencies & Services

| Service | Purpose |
|---------|---------|
| **Cloudinary** | Image/video hosting and on-the-fly transforms |
| **Unsplash** | Demo vehicle images (hardcoded in seed) |
| **Google Maps Embed** | Directions and contact page maps |
| **MySQL** | Primary production database |

---

## Known Quirks

- The `prisma/schema.prisma` currently lists `mysql` as the datasource provider, but a `prisma/dev.db` SQLite file exists in the repo. Check `.env` to see which database is actually active in the current environment.
- The `server-wrapper.js` references `./server.js` which is produced by the standalone build. It will not exist until after `npm run build`.
- shadcn/ui is configured with `"style": "base-nova"` in `components.json` — this is a newer shadcn variant. Components may differ from the "default" or "New York" styles in older documentation.
- The Brands marquee on the homepage uses `<style jsx>` (a Next.js styled-jsx feature) for the `@keyframes marquee` animation.
- `dynamic = "force-dynamic"` is used on some admin pages to ensure fresh data on every request.
