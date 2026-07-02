# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VClick Media & Events — a static marketing website for a UAE-based creative media and event production company. Built with React 19 + Vite, deployed to Hostinger shared hosting. The only server-side component is a PHP contact form (`public/contact.php`) using PHPMailer over Gmail SMTP.

---

## Commands

```bash
npm run dev        # Vite dev server on :5173
npm run build      # Production build → dist/
npm run preview    # Preview production build on :4173
npm run lint       # oxlint (read-only, no --fix flag)

# Contact form local testing (second terminal required)
php -S localhost:8181 -t public/
# Vite proxies /contact.php → http://localhost:8181 (see vite.config.js)
```

## Environment Setup

`.env` (copy from `.env.example`):
```
VITE_TURNSTILE_SITE_KEY=   # Leave empty in dev to skip the Turnstile widget entirely
```

`config.php` (SMTP credentials — never commit, not in web root):
```php
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'you@gmail.com');
define('SMTP_PASS', 'your-app-password');
define('OWNER_EMAIL', 'leads@example.com');
define('SITE_NAME',  'VClick Media & Events');
define('SITE_URL',   'https://www.vclickmedia.com');
```

On the server `config.php` must live **one directory above** `public_html/` — `contact.php` loads it via `dirname(__DIR__) . '/config.php'`. Never place it inside the web root.

---

## Architecture

### Configuration layer (`src/config/`)

Three files drive all site content and structure without touching module code:

- **`site.config.js`** — contact info (phone, email, WhatsApp), social URLs and visibility flags, stat numbers, theme tokens
- **`pages.config.js`** — controls which sections are rendered on each page and their display order. `isVisible: false` hides a section without deleting it.
- **`menus.config.js`** — navbar items with `isHidden`, `isActive`, `isRoute` (full route vs hash anchor), and `displayOrder` fields

`HomePage.jsx` reads `pagesConfig.home.sections`, filters by `isVisible`, and conditionally renders each module. To add/remove/reorder a homepage section, only `pages.config.js` needs to change.

### Module system (`src/modules/`)

One folder per section: `hero`, `about`, `services`, `portfolio`, `why-choose-us`, `process`, `showreel`, `testimonials`, `clients`, `pricing`, `faq`, `contact`, `gallery`, `video-gallery`. Each module is self-contained with its own data import from `src/data/`.

### Static content (`src/data/`)

All content lives in plain JS files: `services.js`, `gallery.js`, `testimonials.js`, `pricing.js`, `faq.js`, `clients.js`, `videos.js`, `portfolio.js`, `pages.js`, `menus.js`. Editing copy means editing these files.

### Contact form flow

`ContactSection` → POST to `/contact.php` (form-encoded) → `contact.php` reads `config.php`, validates, sends two emails (owner notification + user confirmation) via PHPMailer. Cloudflare Turnstile token is submitted alongside form data for bot protection (skipped when `VITE_TURNSTILE_SITE_KEY` is empty).

The PHP script has a honeypot field (`_hp`) — it must remain an invisible CSS-hidden input on the form and must never be populated or submitted to the server.

### Design system (Tailwind)

Defined in `tailwind.config.js`:

| Token | Value | Usage |
|---|---|---|
| `ink` | `#0B0B0B` | Page background |
| `charcoal` | `#1C1C1C` | Alternate section background |
| `gold` | `#D4AF37` | Brand accent / headings |
| `amber` | `#FFB703` | Gold sweep endpoint |
| `paper` | `#FFFFFF` | Headings and labels |
| `mist` | `#BDBDBD` | Body copy |

Custom type scale: `display-1`, `display-2`, `h1`–`h4`, `body-lg`, `body`, `small`, `eyebrow`. Custom spacing: `section` (8rem), `section-lg` (10rem), `section-sm` (5rem). Gradient utilities: `bg-gold-sweep`, `bg-gold-sweep-soft`, `bg-ink-fade`.

### Key components

- **`SEOHead.jsx`** — React Helmet wrapper emitting `<title>`, Open Graph, and JSON-LD `LocalBusiness` schema
- **`BrandIcons.jsx`** — custom inline SVGs for Instagram, Facebook, LinkedIn, YouTube, TikTok. `lucide-react` v1.21 removed all brand icons; do not use lucide for social icons.
- **`CustomCursor.jsx`** — desktop-only gold cursor glow; disabled on touch devices
- **`PageLoader.jsx`** — full-screen intro animation; calls `onComplete` when done, which triggers `setAppReady(true)` in `App.jsx` to show the site

### Accessibility / motion

`usePrefersReducedMotion` hook is used by parallax effects, counters, the logo marquee, and the cursor glow — all disable when `prefers-reduced-motion: reduce` is set. Any new animation must respect this hook.

---

## Deployment

- **[DEPLOY_GITHUB.md](./DEPLOY_GITHUB.md)** — GitHub Actions CI/CD to Hostinger on push to `main`
- **[DEPLOY_MANUAL.md](./DEPLOY_MANUAL.md)** — Build locally, upload `dist/` via FTP

`dist/` is the full deployable artifact. `public/vendor/` (Composer output) must be installed separately on the server via `composer install` — it is git-ignored.
