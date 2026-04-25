# Hostinger Deployment Guide — SKay Auto Group

## Prerequisites
- Hostinger Shared Hosting (Business or higher recommended)
- Node.js 22.x selected in Git deployment settings
- MySQL database created in hPanel
- GitHub repo connected to Hostinger

## Step-by-Step Deployment

### 1. Create MySQL Database
- hPanel → Databases → MySQL Databases
- Create database + user + password
- Note down: DB name, username, password, hostname (usually `mysql.hostinger.com`)

### 2. Configure Git Deployment
- hPanel → Git → Connect your GitHub repo
- **Node version: 22.x** (critical — 20.x causes 503 crashes)
- Set deploy branch to `main`

### 3. Create `tmp/` Folder
After first deploy fails (expected), SSH into Hostinger:
```bash
mkdir -p ~/domains/skayautogroup.ca/nodejs/tmp
```

### 4. Upload `.htaccess`
Copy `deploy/.htaccess` to `public_html/.htaccess` on Hostinger.
**Replace all placeholder values** with your actual credentials.

### 5. Update Environment Variables
Edit `public_html/.htaccess` and set:
- `DATABASE_URL` — your MySQL connection string
- `JWT_SECRET` — random 32+ char string
- `NEXTAUTH_SECRET` — random 32+ char string  
- `CLOUDINARY_API_SECRET` — from Cloudinary dashboard
- `SETUP_SECRET` — random string for admin setup

### 6. Redeploy & Restart
- hPanel → Git → Deploy
- hPanel → Node.js → Restart
- Wait 30 seconds

### 7. Verify
- `https://skayautogroup.ca/api/health` → should return `{"status":"ok"}`
- `https://skayautogroup.ca/robots.txt` → should show robots rules
- `https://skayautogroup.ca/sitemap.xml` → should show XML sitemap

### 8. Setup Admin Account
```bash
curl -X POST https://skayautogroup.ca/api/auth/setup-admin \
  -H "Content-Type: application/json" \
  -d '{"secret":"YOUR_SETUP_SECRET","email":"admin@skayautogroup.ca","password":"YourStrongPassword123"}'
```

### 9. Push Database Schema
SSH into Hostinger:
```bash
cd ~/domains/skayautogroup.ca/nodejs
npx prisma db push
```

### Troubleshooting

| Issue | Solution |
|-------|----------|
| 503 error | Check deploy logs, ensure Node 22, verify `tmp/` exists |
| "timer has gone away" | Normal on first query — should resolve with `TOKIO_WORKER_THREADS=2` |
| "No env vars loaded" | Use `SetEnv` in `.htaccess` instead of hPanel UI |
| Prisma engine error | Run `npx prisma generate` on server |
| CDN shows old content | Purge CDN in hPanel or append `?v=2` to URLs |
| cookie-parser missing | Run `npm install` on server manually |
