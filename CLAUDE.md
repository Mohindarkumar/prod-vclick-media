# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VClick Media & Events — a full-stack CMS platform with a public-facing React site, an embedded admin panel, and a Node.js/Express backend. Two separate workspaces:

- `vclick/` — Frontend (this repo's working directory)
- `../backend/` — Backend API

---

## Frontend Commands (`vclick/`)

```bash
npm run dev        # Vite dev server on :5173
npm run build      # Production build to dist/
npm run preview    # Preview production build
npm run lint       # oxlint (no --fix flag; it's read-only)
```

## Backend Commands (`../backend/`)

```bash
npm run dev              # ts-node-dev with hot reload on :4000
npm run build            # tsc → dist/
npm run start            # node dist/server.js (prod)

npm run db:generate      # prisma generate (after schema changes)
npm run db:migrate       # prisma migrate dev (dev migrations)
npm run db:migrate:prod  # prisma migrate deploy (prod)
npm run db:studio        # Prisma Studio GUI
npm run db:seed          # seed admin user + page content
```

## Environment Setup

Frontend `.env`:
```
VITE_API_URL=http://localhost:4000/api/v1
```

Backend `.env` (see `.env.example`): requires MySQL 8 (`vclick_cms` DB), Redis, and JWT secrets.

---

## Architecture

### Frontend structure

```
src/
  App.jsx              # Root router — all routes lazy-loaded via Suspense
  main.jsx             # React root: HelmetProvider + QueryClientProvider
  pages/               # Route-level page components (public site)
  modules/             # Feature sections (Hero, About, Services, etc.)
  components/          # Shared layout + UI (Navbar, Footer, CustomCursor, etc.)
  admin/               # Entire admin panel (TypeScript)
    AdminApp.tsx        # Admin root: Redux Provider + QueryClientProvider + routes
    store/              # Redux Toolkit slices (auth only)
    api/                # Axios-based API clients for each resource
    pages/              # Admin CRUD pages
    components/         # Admin-specific UI components
  data/                # Static fallback data (clients, faq, services, etc.)
  hooks/               # Shared custom hooks (scroll reveal, counter animation)
  styles/index.css     # Global CSS + Tailwind directives
```

**Key flow — DynamicPage**: The `/:slug` route (`src/pages/DynamicPage.jsx`) fetches a CMS page from the backend and renders its sections using `SectionRenderer`, which maps `section_type` strings (`hero`, `about`, `services`, `gallery`, etc.) to the corresponding `src/modules/` components. Adding a new section type requires both a backend `page_section.section_type` value and a new case in `SectionRenderer`.

**Admin vs. public**: The admin panel (`/admin/*`) is isolated inside `src/admin/` — it has its own Redux store (`adminStore`), its own React Query client, and its own Axios API layer. The public site uses React Query only (no Redux).

### Design system (Tailwind)

Dark theme: `bg-ink` (`#0B0B0B`), `bg-charcoal` (`#1C1C1C`), gold accent (`#D4AF37` / `#FFB703`), text-paper (white), text-mist (gray). Custom classes: `section-container` (layout wrapper), `text-eyebrow` (small all-caps label). Fonts: Poppins. All defined in `tailwind.config.js`.

### Backend structure

```
src/
  server.ts            # HTTP server bootstrap
  app.ts               # Express app: middleware stack + route mounting
  config/              # Env config, DB (Prisma), Redis
  middleware/          # auth (JWT), error handler, rate limiter, Zod validation
  modules/             # Feature modules — each has:
    *.controller.ts    #   HTTP handlers (calls service)
    *.service.ts       #   Business logic
    *.repository.ts    #   Prisma queries
    *.routes.ts        #   Express router
    *.dto.ts           #   Zod schemas for validation
  shared/
    errors.ts          # AppError subclasses (NotFoundError, UnauthorizedError, etc.)
    response.ts        # sendSuccess / sendError / sendCreated helpers
  utils/               # logger (Winston), token (JWT), password (bcrypt), pagination
prisma/
  schema.prisma        # MySQL schema (all models)
  seeds/               # Admin seed + page content seed
uploads/               # Local file storage (logos, videos, thumbnails)
```

**API base URL**: `/api/v1`

**Auth**: JWT access tokens (15 min) + refresh tokens (7 days) stored in `refresh_token` table. `authenticate` middleware validates Bearer tokens; `requirePermission` and `requireRole` guard routes. `super_admin` role bypasses permission checks.

**Error handling**: Throw `AppError` subclasses anywhere in service/repository code — the global `errorMiddleware` in `error.middleware.ts` catches them and calls `sendError`. Never call `res.json()` directly from service layer.

**Soft deletes**: Every model uses `is_deleted: Boolean` — never hard-delete records, always set `is_deleted = true` and `deleted_datetime`.

**Response shape**: All responses follow `{ success, message, data, errors, pagination? }` from `shared/response.ts`.

### Database (MySQL 8 via Prisma)

Key models: `user`, `role`, `permission`, `role_permission` (RBAC) · `menu` (hierarchical nav) · `page` + `page_section` (CMS) · `seo` (per-page SEO/OG/Twitter/structured data) · `gallery_album` + `gallery_item` · `video` · `client` · `testimonial` · `contact_submission` · `site_setting` (key-value store) · `email_template` · `service` · `audit_log`.

After any schema change: run `npm run db:generate` then `npm run db:migrate`.

---

## Security Conventions

### Backend
- **All user-supplied data in email templates** must go through `escHtml()` / `safeMail()` / `safeTel()` helpers in `utils/email.util.ts` before interpolation into HTML strings.
- **File uploads** (`storage.controller.ts`): extension is derived from the MIME→extension whitelist only — never from `file.originalname`. Magic bytes are checked to prevent MIME spoofing.
- **Permissions** (`auth.middleware.ts`): `requirePermission()` checks Redis first, then falls back to the database. `super_admin` role bypasses all permission checks.
- **Password reset tokens** must never be written to log files — only log the email address.
- **Admin credentials** (`ADMIN_EMAIL`, `ADMIN_PASSWORD`) are `required()` — the application will not start if they are absent from the environment.
- **Error responses** in production (`config.isProd`) always return `'Internal server error'` — never the raw exception message.

### Frontend
- **`dangerouslySetInnerHTML`** is only permitted with `DOMPurify.sanitize()` wrapped content — see `DynamicPage.jsx`. Never add a new `dangerouslySetInnerHTML` without sanitizing first.
- **Contact form** includes a CSS-hidden honeypot field (`_hp`). It must remain invisible to users and must never be submitted to the server.
- **JWT expiry** is validated client-side on app load (`isJwtExpired()` in `authSlice.ts`) to avoid initialising state with stale tokens. Signature verification always happens server-side.
