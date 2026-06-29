# Deployment Guide — GitHub Actions → Hostinger

Auto-deploy the site to Hostinger Premium every time you push to the `main` branch.
No manual FTP uploads, no forgetting a file — every push triggers a fresh build and uploads only changed files.

---

## How it works

```
git push → GitHub Actions → npm run build → FTP upload → live on Hostinger
```

1. You push code to GitHub `main` branch
2. GitHub Actions runner spins up Ubuntu, installs Node, runs `npm run build`
3. The generated `dist/` folder is uploaded to your Hostinger `public_html/` via FTP
4. The PHP backend files (`contact.php`, `vendor/`) are synced separately

---

## One-time Setup

### Step 1 — Create a GitHub repository

If you haven't already:

```bash
cd /media/mohindarkumar-v/My-Disk-Projects/VClick/static_site
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/vclick-media-events.git
git push -u origin main
```

> Verify `.gitignore` is working — `config.php` and `.env` must NOT be in `git status`.

---

### Step 2 — Get your Hostinger FTP credentials

1. Log in to **hPanel** → [hpanel.hostinger.com](https://hpanel.hostinger.com)
2. Go to **Hosting** → select your site → **Files** → **FTP Accounts**
3. Note down:
   - **FTP Server / Host** — looks like `ftp.vclickmedia.ae` or an IP
   - **Username** — your FTP username
   - **Password** — create/reset if needed
   - **Server directory** — usually `/public_html`

---

### Step 3 — Add secrets to GitHub

Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these four secrets:

| Secret Name | Value |
|---|---|
| `FTP_SERVER` | Your FTP hostname (e.g. `ftp.vclickmedia.ae`) |
| `FTP_USERNAME` | Your FTP username |
| `FTP_PASSWORD` | Your FTP password |
| `FTP_SERVER_DIR` | `/public_html/` |

---

### Step 4 — Create the GitHub Actions workflow

Create the file at `.github/workflows/deploy.yml`:

```yaml
name: Build & Deploy to Hostinger

on:
  push:
    branches:
      - main
  workflow_dispatch:   # Allows manual trigger from GitHub UI

jobs:
  deploy:
    name: Build and FTP Deploy
    runs-on: ubuntu-latest

    steps:
      # 1. Check out the code
      - name: Checkout repository
        uses: actions/checkout@v4

      # 2. Set up Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      # 3. Install dependencies
      - name: Install dependencies
        run: npm ci

      # 4. Build for production
      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_TURNSTILE_SITE_KEY: ${{ secrets.VITE_TURNSTILE_SITE_KEY }}

      # 5. Upload dist/ → public_html/ via FTP
      - name: Deploy React build via FTP
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./dist/
          server-dir: ${{ secrets.FTP_SERVER_DIR }}
          # Only uploads changed files — fast incremental deploys
          dangerous-clean-slate: false

      # 6. Upload PHP backend files → public_html/
      - name: Deploy PHP contact form
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./public/
          server-dir: ${{ secrets.FTP_SERVER_DIR }}
          # Exclude vendor/ — install via Composer on server instead
          exclude: |
            **/vendor/**
```

> The `vendor/` folder (PHPMailer) is excluded from GitHub and from FTP upload.
> Install it directly on Hostinger via SSH or File Manager (see Step 6 below).

---

### Step 5 — Add VITE environment variables as secrets (optional)

If your `.env` has values that need to be in the production build, add them as GitHub secrets too:

| Secret Name | Value |
|---|---|
| `VITE_API_URL` | Your production API URL |
| `VITE_TURNSTILE_SITE_KEY` | Your Cloudflare Turnstile site key |

These are injected during the build step (`env:` block in the workflow above).

---

### Step 6 — Install PHPMailer on Hostinger (one-time, via SSH)

Hostinger Premium supports SSH. Enable it in hPanel:

**hPanel → Hosting → Advanced → SSH Access → Enable**

Then connect and install Composer:

```bash
# Connect via SSH
ssh YOUR_USERNAME@YOUR_DOMAIN.com -p 65002

# Navigate to your site root (one level above public_html)
cd ~/

# Download and run Composer installer
curl -sS https://getcomposer.org/installer | php

# Navigate into the project public folder
cd public_html/

# Install PHPMailer
php ~/composer.phar require phpmailer/phpmailer
```

This creates `public_html/vendor/autoload.php` — which `contact.php` expects.

---

### Step 7 — Upload `config.php` to Hostinger (one-time, manual)

`config.php` contains SMTP credentials and is never committed to Git.
Upload it manually — **one directory above `public_html/`**:

**Option A — via SSH:**
```bash
scp config.php YOUR_USERNAME@YOUR_DOMAIN.com:~/config.php
```

**Option B — via Hostinger File Manager:**
1. hPanel → **Files** → **File Manager**
2. Navigate to the **parent** of `public_html/` (usually `/home/YOUR_USERNAME/`)
3. Upload `config.php` there

Verify the path:
```
/home/YOUR_USERNAME/config.php          ← correct (above web root)
/home/YOUR_USERNAME/public_html/        ← web root
```

---

### Step 8 — Add `.htaccess` for React Router (SPA routing)

React Router needs all URLs to return `index.html` — otherwise direct links like
`/gallery` return a 404 from Apache.

Create `public/.htaccess` in your project:

```apache
Options -MultiViews
RewriteEngine On

# Serve existing files and directories directly
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# All other requests → index.html (React Router handles them)
RewriteRule ^ index.html [QSA,L]
```

This file is in `public/` so it will be copied to `public_html/` by the FTP deploy step.

---

### Step 9 — Push and verify

```bash
git add .github/workflows/deploy.yml public/.htaccess
git commit -m "Add GitHub Actions deploy workflow"
git push
```

Go to your GitHub repo → **Actions** tab — you should see the workflow running.
After it completes (typically 2–3 minutes), visit your site.

---

## Ongoing workflow

```bash
# Make changes
git add .
git commit -m "Update hero section copy"
git push   ← triggers auto-deploy
```

The workflow only uploads changed files, so incremental deploys are fast (15–30 seconds for small changes).

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| GitHub Actions fails at `npm ci` | Check `package-lock.json` is committed |
| FTP upload fails | Verify all 4 FTP secrets are set correctly in GitHub |
| Site shows old version | Check the Actions log — look for upload errors |
| `/gallery` returns 404 | `.htaccess` is missing or not uploaded — re-run deploy |
| Contact form returns 500 | `config.php` is missing above `public_html/` or `vendor/` not installed |
| Contact form returns 403 | Cloudflare Turnstile secret key missing from `config.php` |
| Images not loading | `uploads/` directory missing — create it via File Manager |

---

## Directory structure on Hostinger after deploy

```
/home/YOUR_USERNAME/
├── config.php                    ← SMTP credentials (manual upload, above web root)
└── public_html/
    ├── index.html                ← React app entry point
    ├── assets/                   ← Vite-built JS/CSS/fonts
    ├── .htaccess                 ← SPA routing + security headers
    ├── favicon.svg
    ├── contact.php               ← PHP mailer
    ├── vendor/                   ← PHPMailer (Composer install on server)
    └── uploads/
        └── images/
            ├── logos/
            │   └── logo.png      ← Used in email templates
            └── gallery/          ← CMS-uploaded images
```
