# Deployment Guide — Manual Build → Hostinger

Build the site on your machine and upload the files to Hostinger via FTP or File Manager.
Use this method for one-off deployments, hotfixes, or when you want full control before going live.

---

## Overview

```
npm run build → dist/    (React app)
public/                  (PHP backend)
config.php               (SMTP credentials — manual, never via Git)
```

Three things go to the server. The `dist/` folder is your entire frontend app.
`public/contact.php` (and `vendor/`) is the PHP backend. `config.php` goes one level
**above** `public_html/` for security.

---

## Step 1 — Build the production app

On your local machine:

```bash
# Make sure your .env has production values
# VITE_API_URL=https://api.vclickmedia.com/api/v1
# VITE_TURNSTILE_SITE_KEY=your_cloudflare_site_key

npm run build
```

This generates the `dist/` folder:

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
└── favicon.svg
```

Verify it works locally before uploading:

```bash
npm run preview
# → http://localhost:4173
# Test the homepage, /gallery, /videos, /admin routes
```

---

## Step 2 — Add the `.htaccess` file for React Router

React Router requires all URL requests to serve `index.html` — without this, any
direct link (e.g. `vclickmedia.com/gallery`) returns a 404 from Apache.

Create `public/.htaccess` if it doesn't exist yet:

```apache
Options -MultiViews
RewriteEngine On

# Serve existing files and directories directly (JS/CSS/images work normally)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# All other paths → React app (React Router handles them)
RewriteRule ^ index.html [QSA,L]
```

Copy it into your `dist/` folder before uploading:

```bash
cp public/.htaccess dist/.htaccess
```

---

## Step 3 — Upload the React build to Hostinger

### Option A — Hostinger File Manager (no extra tools needed)

1. Log in to **hPanel** → [hpanel.hostinger.com](https://hpanel.hostinger.com)
2. Go to **Hosting** → select `vclickmedia.com` → **Files** → **File Manager**
3. Navigate to `/home/YOUR_USERNAME/public_html/`
4. **Delete** the old site files (keep `uploads/` and `vendor/` if they exist)
5. Click **Upload** → select all files from your local `dist/` folder → upload
6. Also upload `public/.htaccess` into `public_html/` if not included in the zip

> Tip: zip the `dist/` contents first, upload the zip, then extract it in File Manager
> using the **Extract** button — much faster than uploading hundreds of individual files.

```bash
# Create a zip of just the dist/ contents (not the dist/ folder itself)
cd dist
zip -r ../vclick-deploy.zip .
cd ..
# Upload vclick-deploy.zip → extract inside public_html/
```

### Option B — FTP / SFTP (FileZilla or similar)

**FTP credentials:** hPanel → **Hosting** → **Files** → **FTP Accounts**

| Field | Value |
|---|---|
| Host | `ftp.vclickmedia.com` (or IP shown in hPanel) |
| Username | Your FTP username |
| Password | Your FTP password |
| Port | `21` (FTP) or `22` (SFTP — more secure) |

In FileZilla:
1. Connect using the credentials above
2. Navigate to `/public_html/` on the remote side
3. Drag all contents of your local `dist/` folder into `public_html/`
4. Also drag `public/.htaccess` into `public_html/`

### Option C — SSH / rsync (fastest)

Enable SSH: hPanel → **Hosting** → **Advanced** → **SSH Access** → **Enable**

```bash
# Sync dist/ contents to public_html/ — only uploads changed files
rsync -avz --delete \
  --exclude 'uploads/' \
  --exclude 'vendor/' \
  dist/ \
  YOUR_USERNAME@YOUR_DOMAIN.com:/home/YOUR_USERNAME/public_html/

# Copy .htaccess separately if not in dist/
scp public/.htaccess YOUR_USERNAME@YOUR_DOMAIN.com:/home/YOUR_USERNAME/public_html/.htaccess
```

> The `--exclude` flags protect your `uploads/` (gallery images) and `vendor/` (PHPMailer)
> from being deleted during sync.

---

## Step 4 — Upload the PHP contact form

Upload `public/contact.php` to `public_html/contact.php`:

```bash
# via SCP
scp public/contact.php YOUR_USERNAME@YOUR_DOMAIN.com:/home/YOUR_USERNAME/public_html/contact.php

# or drag-and-drop via FileZilla / File Manager
```

---

## Step 5 — Install PHPMailer on Hostinger

The `vendor/` folder (PHPMailer) is not committed to Git and is not in the zip.
Install it directly on the server.

### Option A — via SSH (recommended)

```bash
# SSH into Hostinger
ssh YOUR_USERNAME@YOUR_DOMAIN.com -p 65002

# Download Composer
curl -sS https://getcomposer.org/installer | php

# Go to public_html and install PHPMailer
cd ~/public_html
php ~/composer.phar require phpmailer/phpmailer
```

This creates `public_html/vendor/autoload.php` which `contact.php` expects.

### Option B — Upload vendor/ via FTP (if SSH is unavailable)

On your local machine:

```bash
cd /media/mohindarkumar-v/My-Disk-Projects/VClick/static_site
composer install --no-dev --optimize-autoloader
```

Then upload the entire `public/vendor/` folder to `public_html/vendor/` via FileZilla
or File Manager. Note: this folder is large (~15 MB).

---

## Step 6 — Upload `config.php` (SMTP credentials)

`config.php` contains your Gmail App Password. It must go **above** `public_html/`
so it's not accessible via browser.

### Via File Manager

1. In hPanel File Manager, navigate to `/home/YOUR_USERNAME/` (the parent of `public_html/`)
2. Click **Upload** → select your local `config.php`
3. Verify it lands at `/home/YOUR_USERNAME/config.php` (NOT inside `public_html/`)

### Via SCP

```bash
scp config.php YOUR_USERNAME@YOUR_DOMAIN.com:~/config.php
```

### Via SSH — create it directly on the server

```bash
ssh YOUR_USERNAME@YOUR_DOMAIN.com -p 65002
nano ~/config.php
```

Paste the full file content, then `Ctrl+X → Y → Enter` to save.

**Correct directory layout on server:**

```
/home/YOUR_USERNAME/
├── config.php              ← here (not in public_html!)
└── public_html/
    ├── index.html
    ├── contact.php
    └── ...
```

---

## Step 7 — Create the uploads directory

The gallery and admin panel use `public_html/uploads/images/` to store uploaded images.
Create this structure if it doesn't exist:

**Via SSH:**

```bash
mkdir -p ~/public_html/uploads/images/logos
mkdir -p ~/public_html/uploads/images/gallery
chmod 755 ~/public_html/uploads/
chmod 755 ~/public_html/uploads/images/
```

**Via File Manager:**

hPanel → File Manager → navigate to `public_html/` → **New Folder** → `uploads`
→ inside `uploads`: create `images/` → inside `images/`: create `logos/` and `gallery/`

Then upload your logo file: `uploads/images/logos/logo.png` (used in email headers).

---

## Step 8 — Set file permissions

```bash
# SSH into server
ssh YOUR_USERNAME@YOUR_DOMAIN.com -p 65002

# config.php — readable only by PHP, not world-readable
chmod 600 ~/config.php

# uploads — writable by PHP for file uploads
chmod 755 ~/public_html/uploads/
chmod 755 ~/public_html/uploads/images/
chmod 755 ~/public_html/uploads/images/logos/
chmod 755 ~/public_html/uploads/images/gallery/

# PHP files
chmod 644 ~/public_html/contact.php
chmod 644 ~/public_html/.htaccess
```

---

## Step 9 — Enable SSL (if not already active)

1. hPanel → **Hosting** → **Security** → **SSL**
2. Click **Install** on the free **Let's Encrypt** certificate for your domain
3. Enable **Force HTTPS** redirect

---

## Step 10 — Verify the deployment

Open your browser and test:

| URL | Expected |
|---|---|
| `https://www.vclickmedia.com/` | Home page loads with loader animation |
| `https://www.vclickmedia.com/gallery` | Gallery page (not a 404) |
| `https://www.vclickmedia.com/videos` | Videos page (not a 404) |
| `https://www.vclickmedia.com/contact.php` | Returns `{"error":"Method not allowed"}` (POST-only) |
| Contact form submission | You receive email at your inbox |
| `http://` version | Redirects to `https://` |

---

## Full file layout after deployment

```
/home/YOUR_USERNAME/
├── config.php                     ← SMTP credentials (manual upload, above web root)
│
└── public_html/
    ├── index.html                 ← React app entry
    ├── assets/                    ← Vite JS/CSS bundles (hashed filenames)
    ├── .htaccess                  ← SPA routing + HTTPS redirect
    ├── favicon.svg
    ├── contact.php                ← PHP contact form mailer
    ├── vendor/                    ← PHPMailer (Composer)
    │   └── autoload.php
    └── uploads/
        └── images/
            ├── logos/
            │   └── logo.png       ← Brand logo (used in email headers)
            └── gallery/           ← CMS-uploaded gallery images
```

---

## Re-deploying updates

For subsequent deployments after changes:

```bash
# 1. Build
npm run build

# 2. Copy .htaccess into dist/
cp public/.htaccess dist/.htaccess

# 3. Sync to server (rsync only uploads changed files)
rsync -avz --delete \
  --exclude 'uploads/' \
  --exclude 'vendor/' \
  dist/ \
  YOUR_USERNAME@YOUR_DOMAIN.com:/home/YOUR_USERNAME/public_html/
```

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Home page loads but `/gallery` is a 404 | `.htaccess` missing — upload it to `public_html/` |
| Contact form shows "failed to send" | Check `config.php` is above `public_html/`, not inside it |
| Contact form 500 error | `vendor/autoload.php` missing — run `composer require phpmailer/phpmailer` on server |
| Email not received | Check Gmail App Password; verify `SMTP_USER` and `SMTP_PASS` in `config.php` |
| Images not loading | `uploads/` directory doesn't exist or wrong permissions |
| Site showing old version | Hard-reload browser (`Ctrl+Shift+R`) — Vite bundles have hashed filenames so caching should not be an issue |
| SSL redirect loop | Disable any conflicting redirect rules in `.htaccess` |
| Admin login fails | API URL is wrong — verify `VITE_API_URL` in `.env` before building |
