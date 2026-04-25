# Hostinger Deployment Guide — SKay Auto Group (No SSH Required)

## Prerequisites
- Hostinger Shared Hosting (Business or higher recommended)
- Node.js 22.x selected in Git deployment settings
- MySQL database created in hPanel
- GitHub repo connected to Hostinger

---

## Step-by-Step Deployment (No SSH)

### 1. Create MySQL Database
- hPanel → Databases → MySQL Databases
- Create database + user + password
- Note down: **DB name**, **username**, **password**, **hostname** (usually `mysql.hostinger.com`)

### 2. Connect Git & First Deploy
- hPanel → Git → Connect your GitHub repo
- **Node version: 22.x** (critical — 20.x causes 503 crashes)
- Set deploy branch to `main`
- Click **Deploy**
- Wait for deploy to finish (may show errors on first deploy — that's expected)

### 3. Create `tmp/` Folder (File Manager)
- hPanel → Files → File Manager
- Navigate to `domains/skayautogroup.ca/nodejs/`
- Click **New Folder** → name it `tmp`
- This folder is required for Passenger to restart the app

### 4. Upload `.htaccess` (File Manager)
- In File Manager, navigate to `public_html/`
- Edit `.htaccess` (or create if missing)
- Copy the contents from `deploy/.htaccess` in this repo
- **Replace all placeholder values:**
  - `YOUR_DB_USER` → your MySQL username
  - `YOUR_DB_PASSWORD` → your MySQL password
  - `YOUR_DB_NAME` → your MySQL database name
  - `YOUR_RANDOM_SECRET_MIN_32_CHARS` → generate a random 32+ character string (use for both JWT_SECRET and NEXTAUTH_SECRET)
  - `YOUR_CLOUDINARY_SECRET` → your Cloudinary API secret
  - `YOUR_SETUP_SECRET` → generate a random string for setup endpoints

### 5. Redeploy & Restart
- hPanel → Git → **Deploy** (pull latest code)
- hPanel → Node.js → **Restart**
- Wait 30 seconds

### 6. Test Health Endpoint
Open in browser:
```
https://skayautogroup.ca/api/health
```
Should return: `{"status":"ok"}`

If you get 503, wait 1 minute and try again.

### 7. Initialize Database (Option A: phpMyAdmin — RECOMMENDED)
- hPanel → Databases → phpMyAdmin → Open
- Select your database
- Click **Import** tab
- Choose File → select `deploy/schema.sql` from this repo
- Click **Import**
- You should see "Import has been successfully finished"

### 7. Initialize Database (Option B: API Endpoint)
If phpMyAdmin import fails, use the built-in migration endpoint:
```bash
curl -X POST https://skayautogroup.ca/api/setup/migrate \
  -H "Content-Type: application/json" \
  -d '{"secret":"YOUR_SETUP_SECRET"}'
```

### 8. Seed Default Settings
```bash
curl -X POST https://skayautogroup.ca/api/setup/seed \
  -H "Content-Type: application/json" \
  -d '{"secret":"YOUR_SETUP_SECRET"}'
```

### 9. Create Admin Account
```bash
curl -X POST https://skayautogroup.ca/api/auth/setup-admin \
  -H "Content-Type: application/json" \
  -d '{"secret":"YOUR_SETUP_SECRET","email":"admin@skayautogroup.ca","password":"YourStrongPassword123"}'
```

### 10. Verify Everything
| URL | Expected Result |
|-----|-----------------|
| `https://skayautogroup.ca/` | Website loads |
| `https://skayautogroup.ca/api/health` | `{"status":"ok"}` |
| `https://skayautogroup.ca/robots.txt` | Shows robots rules |
| `https://skayautogroup.ca/sitemap.xml` | Shows XML sitemap |
| `https://skayautogroup.ca/api/setup/check` | `{"initialized":true}` |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **503 error** | Wait 1 minute, check that `tmp/` folder exists, verify Node 22 in `.htaccess`, restart app |
| "timer has gone away" | Normal on first query — `TOKIO_WORKER_THREADS=2` in `.htaccess` handles it |
| "No env vars loaded" | Use `SetEnv` in `.htaccess` instead of hPanel UI |
| Prisma engine error | Git deploy should run `npm install` + `prisma generate` automatically. If not, contact Hostinger support |
| CDN shows old content | Purge CDN in hPanel or append `?v=2` to URLs |
| Database "table doesn't exist" | Run phpMyAdmin import of `schema.sql` again |
| `/api/setup/migrate` fails with "command not found" | Prisma CLI not available — use phpMyAdmin import instead |
