# VClick Media & Events — Website

Premium cinematic marketing website for **VClick Media & Events**, a creative media production
and event management company headquartered in Ajman Free Zone, UAE.

> **Live domain:** `https://www.vclickmedia.ae`
> **Hosting:** Hostinger Web Hosting — Premium Plan
> **Stack:** React 19 · Vite 8 · Tailwind CSS v3 · Framer Motion v12 · PHP 8 (contact form)

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| UI Framework | React | ^19.2 |
| Build Tool | Vite | ^8.1 |
| Styling | Tailwind CSS | ^3.4 |
| Animations | Framer Motion | ^12 |
| Routing | React Router DOM | ^7 |
| State Management | Redux Toolkit + React Query | ^2.12 / ^5.10 |
| Rich Text Editor | TipTap | ^3 (admin panel) |
| Bot Protection | Cloudflare Turnstile | ^1.5 |
| Icons | lucide-react | ^1.21 |
| Backend (email) | PHP 8 + PHPMailer (Composer) | — |
| Linting | OxLint | ^1.69 |

---

## Prerequisites

- **Node.js** ≥ 20 and **npm** ≥ 10
- **PHP** ≥ 8.1 with `php-curl` and `php-mbstring` enabled (for local contact form testing)
- **Composer** (PHP dependency manager — for PHPMailer)

---

## Getting Started (Development)

### 1. Install Node dependencies

```bash
npm install
```

### 2. Install PHP dependencies (PHPMailer)

```bash
composer install
# Generates public/vendor/autoload.php
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:4000/api/v1

# Cloudflare Turnstile — get from dash.cloudflare.com → Turnstile → Add Site
# Leave blank in dev to skip the bot-check widget
VITE_TURNSTILE_SITE_KEY=
```

### 4. Create `config.php` (SMTP credentials — never commit this file)

Copy the template and fill in your Gmail App Password:

```bash
cp config.example.php config.php
```

`config.php` structure:

```php
<?php
define('SITE_NAME', 'VClick Media & Events');
define('SITE_URL',  'https://www.vclickmedia.ae');
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_USER', 'your-gmail@gmail.com');
define('SMTP_PASS', 'your-16-char-app-password');
define('SMTP_PORT', 587);
define('MAIL_FROM_NAME',  'VClick Media & Events');
define('MAIL_REPLY_TO',   'hello@vclickmedia.ae');
define('MAIL_INBOX',      'hello@vclickmedia.ae');
```

> **Security:** `config.php` must live **one directory above** `public_html/` on the server
> (`dirname(__DIR__) . '/config.php'`). It is listed in `.gitignore` — never commit it.

### 5. Start the PHP dev server (contact form)

Open a second terminal:

```bash
php -S localhost:8181 -t public/
```

Vite proxies `/contact.php` to `http://localhost:8181` (see `vite.config.js`).

### 6. Start the Vite dev server

```bash
npm run dev
# → http://localhost:5173
```

---

## Build for Production

```bash
npm run build
# Output: dist/
```

Preview the production build locally:

```bash
npm run preview
# → http://localhost:4173
```

---

## Project Structure

```
static_site/
├── public/                  # Served as-is at the root URL
│   ├── contact.php          # PHP mailer endpoint (PHPMailer + Gmail SMTP)
│   ├── favicon.svg
│   ├── vendor/              # Composer output (PHPMailer) — not committed
│   └── uploads/
│       └── images/
│           ├── logos/       # logo.png used in email templates
│           └── gallery/     # CMS-uploaded gallery images
│
├── src/
│   ├── admin/               # Admin panel (React, protected by login)
│   │   ├── components/      # AdminNavbar, AdminSidebar, ContentEditor, MediaUploader
│   │   ├── pages/           # LoginPage, DashboardPage, SectionEditorPage, GalleryManagerPage
│   │   └── store/           # Redux slices (auth, content, gallery)
│   │
│   ├── components/
│   │   ├── common/          # Button, SectionEyebrow, GoldDivider, AnimatedCounter, SEOHead, BrandIcons
│   │   ├── layout/          # Navbar, Footer, ScrollToTop
│   │   └── ui/              # PageLoader, Lightbox, Carousel, Accordion, WhatsAppChat
│   │
│   ├── modules/             # One folder per homepage section
│   │   ├── hero/            # Hero.jsx + ScrollIndicator.jsx
│   │   ├── about/
│   │   ├── services/
│   │   ├── portfolio/       # PortfolioSection.jsx + PortfolioGrid.jsx
│   │   ├── why-choose-us/   # WhyChooseUs.jsx + StatBlock.jsx
│   │   ├── process/
│   │   ├── showreel/
│   │   ├── pricing/
│   │   ├── testimonials/
│   │   ├── clients/
│   │   ├── faq/
│   │   └── contact/
│   │
│   ├── pages/               # Route-level page components
│   │   ├── HomePage.jsx     # Composes all modules
│   │   ├── GalleryPage.jsx
│   │   └── VideoGalleryPage.jsx
│   │
│   ├── data/                # Static content fallbacks (used if CMS is empty)
│   │   ├── services.js
│   │   ├── gallery.js
│   │   ├── testimonials.js
│   │   ├── pricing.js
│   │   ├── faq.js
│   │   └── clients.js
│   │
│   ├── hooks/
│   │   ├── usePrefersReducedMotion.js
│   │   ├── useCounterAnimation.js
│   │   └── useScrollReveal.js
│   │
│   ├── config/
│   │   └── site.config.js   # Global stats, phone, email, WhatsApp number
│   │
│   ├── styles/
│   │   └── index.css        # Tailwind directives + base styles
│   │
│   ├── App.jsx              # Router + QueryClientProvider + HelmetProvider
│   └── main.jsx
│
├── config.php               # SMTP credentials — NEVER commit (in .gitignore)
├── composer.json            # PHP dependencies (PHPMailer)
├── tailwind.config.js
├── vite.config.js
├── .env                     # Local env vars — NEVER commit (in .gitignore)
└── .env.example             # Template — safe to commit
```

---

## Design System

Defined in `tailwind.config.js` under `theme.extend`:

### Colors

| Token | Value | Usage |
|---|---|---|
| `ink` | `#0B0B0B` | Page background |
| `charcoal` | `#1C1C1C` | Section alternate background |
| `gold` | `#D4AF37` | Brand accent |
| `amber` | `#FFB703` | Gold sweep endpoint |
| `paper` | `#FFFFFF` | Headings and labels |
| `mist` | `#BDBDBD` | Body copy |

### Type Scale

| Token | Size | Usage |
|---|---|---|
| `display-1` | 72px | Hero headline (large) |
| `display-2` / `h1` | 56px | Hero headline |
| `h2` | 48px | Section headings |
| `h3` | 28px | Card headings |
| `body-lg` | 18px | Lead paragraph |
| `body` | 16px | General copy |
| `eyebrow` | 13px | Section labels (uppercase) |

Font: **Poppins** (weights 300–800, Google Fonts).

### Signature Elements

- **Gold sweep gradient** — `bg-gold-sweep` and `bg-gold-sweep-soft` used on headings, dividers and buttons
- **GoldDivider** — `src/components/common/GoldDivider.jsx` — horizontal line or heading underline
- **Cursor glow** — desktop-only ambient gold glow in the Hero section (disabled on touch)
- **Parallax** — Hero, VideoShowreel, GalleryHero, VideoGalleryHero (disabled on touch devices for smooth mobile scroll)

---

## Admin Panel

Accessible at `/admin`. Protected by JWT auth (token stored in Redux + localStorage).

| Feature | Location |
|---|---|
| Login | `/admin/login` |
| Dashboard | `/admin` |
| Section editor | `/admin/sections/:id` — TipTap rich text + image upload |
| Gallery manager | `/admin/gallery` — drag-to-reorder, upload, delete |
| Featured works | `/admin/featured-works` — CRUD for portfolio homepage cards |

---

## Cloudflare Turnstile (Bot Protection)

The contact form uses Cloudflare Turnstile to block bots without CAPTCHA friction.

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Turnstile** → **Add Site**
2. Choose **Managed** mode
3. Copy the **Site Key** → set `VITE_TURNSTILE_SITE_KEY=` in `.env` (production)
4. Copy the **Secret Key** → set `TURNSTILE_SECRET=` in `config.php` (server-side)

If `VITE_TURNSTILE_SITE_KEY` is empty, the widget is skipped (useful in development).

---

## SEO & Accessibility

- Single `<h1>` in Hero; one `<h2>` per section
- Semantic HTML: `<section>`, `<nav>`, `<main>`, `<footer>`, `<article>`
- All images have descriptive `alt` (decorative backgrounds use `alt=""`)
- `loading="lazy"` on all below-fold images
- Gold focus ring on all interactive elements (WCAG AA compliant)
- `prefers-reduced-motion` respected: parallax, cursor glow, counters, marquee all disable
- Open Graph + JSON-LD `LocalBusiness` schema via `react-helmet-async` (`SEOHead.jsx`)
- `touch-action: manipulation` on all interactive elements (removes 300ms tap delay)

---

## Responsive Breakpoints

Tested at 375px, 390px, 430px, 768px, 1024px, 1280px, 1440px, 1920px.

| Breakpoint | Behavior |
|---|---|
| `< xl (1280px)` | Navbar collapses to full-screen glass overlay |
| `< lg (1024px)` | Event process switches from horizontal to vertical timeline |
| `< md (768px)` | Pricing cards stack; portfolio bento collapses to single column |
| `< sm (640px)` | Stats bar stays 4-column (single row — avoids `overflow:hidden` clip) |

---

## BrandIcons Note

`lucide-react` v1.21 removed all brand/social icons (Instagram, Facebook, LinkedIn, YouTube).
Custom inline SVGs live in `src/components/common/BrandIcons.jsx` with the same `size`/`className` API — no special-casing needed at usage sites.

---

## Security Checklist

- [ ] `config.php` is **above** `public_html/` on the server
- [ ] `config.php` is in `.gitignore` — never committed
- [ ] `.env` is in `.gitignore` — never committed
- [ ] `public/vendor/` is in `.gitignore` (re-install via `composer install` on server)
- [ ] Gmail App Password used (not main account password)
- [ ] Cloudflare Turnstile secret key in `config.php` (server-side verification)
- [ ] SSL certificate active (free via Hostinger panel)
- [ ] File Manager permissions: `config.php` set to `600`, `uploads/` to `755`

---

## Deployment

See the dedicated guides:

- **[DEPLOY_GITHUB.md](./DEPLOY_GITHUB.md)** — CI/CD via GitHub Actions → auto-deploy to Hostinger on every push to `main`
- **[DEPLOY_MANUAL.md](./DEPLOY_MANUAL.md)** — Build locally, upload `dist/` via FTP or Hostinger File Manager

---

## Placeholder Items (Replace Before Launch)

Search the codebase for `// TODO:` — all instances are listed here:

| Item | File | Status |
|---|---|---|
| Real logo PNG | `public/uploads/images/logos/logo.png` | Upload via File Manager |
| Portfolio images | `src/data/gallery.js` | Replace Unsplash URLs |
| Showreel video | CMS video URL field | Set YouTube/Vimeo embed URL |
| Client logos | `src/data/clients.js` | Replace placeholder blocks |
| Real pricing | `src/data/pricing.js` | Edit AED values |
| WhatsApp number | `src/config/site.config.js` | Replace `+971 50 000 0000` |
| Business email | `src/config/site.config.js` | Replace `hello@vclickmedia.ae` |
| Office address / map pin | `src/modules/contact/MapEmbed.jsx` | Add precise Google Maps embed URL |
| Social profile URLs | `src/components/layout/Footer.jsx` | Replace root domain links |
| Favicon | `public/favicon.svg` | Replace with real brand mark |
