# Deployment Guide

## Prestige Motors — Full-Stack Next.js Application

This guide covers deploying the website to GoDaddy (or any Node.js-capable host).

---

## Quick Start (Local Development)

```bash
# Install dependencies
npm install

# Set up database (SQLite)
npx prisma migrate dev

# Seed demo data + admin user
npx tsx prisma/seed.ts

# Run dev server
npm run dev
```

Visit `http://localhost:3000`

**Admin Login:**
- URL: `http://localhost:3000/admin/login`
- Email: `admin@prestigemotors.com`
- Password: `admin123`

---

## Environment Variables

Copy `.env` and update for production:

```env
# Database (SQLite for simple hosting, or MySQL/PostgreSQL for production scale)
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-super-secret-production-key-min-32-chars-long"

# Admin credentials (seed only)
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="$2b$10$YourHashedPasswordHere"
```

**Generate a secure NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

## GoDaddy Deployment — Option A: Node.js cPanel

If your GoDaddy plan supports Node.js applications via cPanel:

1. **Build the app locally or on the server:**
   ```bash
   npm install
   npx prisma migrate deploy
   npx tsx prisma/seed.ts
   npm run build
   ```

2. **Upload files** to your GoDaddy hosting via FTP/File Manager:
   - Upload the entire project folder (excluding `node_modules` if building on server)
   - Or upload just the source and run `npm install && npm run build` via SSH

3. **Configure Node.js App in cPanel:**
   - Application root: `my-app` (or wherever you uploaded)
   - Application URL: your domain
   - Application startup file: `server.js` (Next.js standalone creates this in `.next/standalone`)

4. **Important:** Because `output: "standalone"` is set in `next.config.ts`, Next.js produces a self-contained build in `.next/standalone/`. For cPanel Node.js, you can either:
   - Point the app to run `node .next/standalone/server.js`
   - Or use a custom `server.js` at the project root that requires the standalone build

5. **Ensure `public/uploads` is writable** by the web server for image uploads.

---

## GoDaddy Deployment — Option B: Static Export + PHP API (Any cPanel Host)

If your GoDaddy plan does **not** support Node.js:

1. **Export static frontend:**
   Change `next.config.ts`:
   ```ts
   output: "export",
   distDir: "dist",
   ```
   Then run:
   ```bash
   npm run build
   ```

2. **Upload `dist/` contents** to your `public_html` folder via File Manager/FTP.

3. **For the admin backend and APIs**, you have two choices:
   - **Upgrade hosting** to Node.js-capable (recommended)
   - **Use a separate lightweight backend** (contact a developer to add a PHP Laravel/API bridge)

> **Recommendation:** Most modern GoDaddy Business Hosting and VPS plans support Node.js. We strongly recommend Option A for full functionality.

---

## Database Migration to MySQL (Production Scale)

If you want to use GoDaddy MySQL instead of SQLite:

1. Create a MySQL database in cPanel.
2. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "mysql"
     url      = env("DATABASE_URL")
   }
   ```
3. Update `.env`:
   ```env
   DATABASE_URL="mysql://username:password@host:3306/database_name"
   ```
4. Run:
   ```bash
   npx prisma migrate deploy
   npx tsx prisma/seed.ts
   ```

---

## Post-Deployment Checklist

- [ ] Update business name, address, phone, email in site content
- [ ] Upload your real logo (replace the "P" text logo in `Navbar.tsx` and `Footer.tsx`)
- [ ] Update Google Maps embed URLs in `contact/page.tsx` and `directions/page.tsx`
- [ ] Change default admin password after first login
- [ ] Set strong `NEXTAUTH_SECRET` in production
- [ ] Ensure `public/uploads` directory is writable
- [ ] Test vehicle CRUD in admin dashboard
- [ ] Test contact and finance forms
- [ ] Verify all pages load correctly

---

## Support

For issues or customizations, contact your development team.
