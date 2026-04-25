import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';

// Startup error log (since stderr may not be visible on Hostinger)
const STARTUP_LOG = '/tmp/skay-startup.log';
function logStartup(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  try { fs.appendFileSync(STARTUP_LOG, line); } catch {}
  console.log(msg);
}

logStartup('=== SERVER STARTING ===');

// Load env vars from .env file (critical for Hostinger)
dotenv.config();

// Debug: log which env vars are present (don't log values, just presence)
logStartup(`[ENV] DATABASE_URL present: ${!!process.env.DATABASE_URL}`);
logStartup(`[ENV] JWT_SECRET present: ${!!process.env.JWT_SECRET}`);
logStartup(`[ENV] NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Security: trust proxy (required for Hostinger behind Apache/Passenger)
app.set('trust proxy', true);

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://skayautogroup.ca', 'https://www.skayautogroup.ca']
    : true,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check (no DB required — always returns 200)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: Date.now(), env: process.env.NODE_ENV || 'development' });
});

// Setup: check if database is initialized (no auth needed)
app.get('/api/setup/check', async (req, res) => {
  try {
    const { prisma } = await import('./src/server/lib/prisma.js');
    const vehicles = await prisma.vehicle.count();
    const admins = await prisma.adminUser.count();
    res.json({ initialized: true, vehicles, admins });
  } catch (err) {
    res.json({ initialized: false, error: err.message });
  }
});

// Setup: run Prisma db push without SSH (protected by SETUP_SECRET)
app.post('/api/setup/migrate', async (req, res) => {
  const secret = req.headers['x-setup-secret'] || req.body?.secret;
  if (secret !== process.env.SETUP_SECRET) {
    return res.status(403).json({ error: 'Invalid setup secret' });
  }

  try {
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);

    logStartup('[SETUP] Running prisma db push...');
    const { stdout, stderr } = await execAsync('npx prisma db push --accept-data-loss', {
      cwd: __dirname,
      timeout: 60000,
      env: { ...process.env },
    });

    logStartup(`[SETUP] stdout: ${stdout}`);
    if (stderr) logStartup(`[SETUP] stderr: ${stderr}`);

    res.json({ success: true, output: stdout, errors: stderr || null });
  } catch (err) {
    logStartup(`[SETUP] Migration failed: ${err.message}`);
    res.status(500).json({ success: false, error: err.message, output: err.stdout, stderr: err.stderr });
  }
});

// Setup: seed initial data (protected by SETUP_SECRET)
app.post('/api/setup/seed', async (req, res) => {
  const secret = req.headers['x-setup-secret'] || req.body?.secret;
  if (secret !== process.env.SETUP_SECRET) {
    return res.status(403).json({ error: 'Invalid setup secret' });
  }

  try {
    const { prisma } = await import('./src/server/lib/prisma.js');

    // Seed default site settings
    const defaults = [
      { key: 'phone', value: '+1 7789907468', group: 'contact' },
      { key: 'email', value: 'info@skayautogroup.ca', group: 'contact' },
      { key: 'address', value: '21320 Westminster Hwy #2128', group: 'contact' },
      { key: 'city', value: 'Richmond', group: 'contact' },
      { key: 'state', value: 'BC', group: 'contact' },
      { key: 'zip', value: 'V5W 3A3', group: 'contact' },
      { key: 'hours', value: 'Mon - Sat: 10am - 7pm', group: 'contact' },
      { key: 'siteName', value: 'SKay Auto Group', group: 'general' },
      { key: 'brands', value: '[]', group: 'general' },
      { key: 'quickLinks', value: '[]', group: 'general' },
    ];

    for (const s of defaults) {
      await prisma.siteSetting.upsert({
        where: { key: s.key },
        update: { value: s.value },
        create: s,
      });
    }

    res.json({ success: true, message: 'Default settings seeded' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// robots.txt
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: https://skayautogroup.ca/sitemap.xml
`);
});

// sitemap.xml
app.get('/sitemap.xml', async (req, res) => {
  try {
    const { prisma } = await import('./src/server/lib/prisma.js');
    const vehicles = await prisma.vehicle.findMany({
      where: { status: 'available' },
      select: { slug: true, updatedAt: true },
    });

    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'daily' },
      { url: '/inventory', priority: '0.9', changefreq: 'daily' },
      { url: '/about', priority: '0.7', changefreq: 'monthly' },
      { url: '/contact', priority: '0.7', changefreq: 'monthly' },
      { url: '/finance', priority: '0.6', changefreq: 'monthly' },
      { url: '/car-finder', priority: '0.6', changefreq: 'monthly' },
      { url: '/sell-us-your-car', priority: '0.6', changefreq: 'monthly' },
      { url: '/team', priority: '0.5', changefreq: 'monthly' },
      { url: '/directions', priority: '0.5', changefreq: 'monthly' },
      { url: '/book-appointment', priority: '0.5', changefreq: 'monthly' },
      { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
      { url: '/terms', priority: '0.3', changefreq: 'yearly' },
      { url: '/sitemap', priority: '0.3', changefreq: 'yearly' },
    ];

    const vehiclePages = vehicles.map(v => ({
      url: `/inventory/${v.slug}`,
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: v.updatedAt.toISOString().split('T')[0],
    }));

    const allPages = [...staticPages, ...vehiclePages];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>https://skayautogroup.ca${p.url}</loc>
    ${p.lastmod ? `<lastmod>${p.lastmod}</lastmod>` : ''}
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    res.type('application/xml');
    res.send(xml);
  } catch (err) {
    logStartup(`[SITEMAP] Error: ${err.message}`);
    res.status(500).type('text/plain').send('Sitemap generation failed');
  }
});

// Start server immediately — don't wait for anything
const server = app.listen(PORT, () => {
  logStartup(`[SERVER] SKay Auto Group running on port ${PORT}`);
  logStartup(`[SERVER] Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Load Prisma and routes in background
(async () => {
  let prisma = null;
  let prismaReady = false;

  try {
    const prismaMod = await import('./src/server/lib/prisma.js');
    prisma = prismaMod.prisma;
    logStartup('[PRISMA] Module loaded');

    // Eager connect BEFORE mounting routes to prevent concurrent engine starts
    if (process.env.DATABASE_URL) {
      await prisma.$connect();
      prismaReady = true;
      logStartup('[PRISMA] Database connected successfully');
    } else {
      logStartup('[PRISMA] Skipping connect: DATABASE_URL not set');
    }
  } catch (err) {
    logStartup(`[PRISMA] Failed to load/connect: ${err.message}`);
  }

  // Mount API routes
  const routes = [
    { path: '/api/vehicles', mod: './src/server/routes/vehicles.js' },
    { path: '/api/auth', mod: './src/server/routes/auth.js' },
    { path: '/api/settings', mod: './src/server/routes/settings.js' },
    { path: '/api', mod: './src/server/routes/forms.js' },
    { path: '/api/admin', mod: './src/server/routes/admin.js' },
  ];

  for (const r of routes) {
    try {
      const mod = await import(r.mod);
      app.use(r.path, mod.default);
      logStartup(`[ROUTE] Mounted ${r.path}`);
    } catch (err) {
      logStartup(`[ROUTE] Failed ${r.path}: ${err.message}`);
      app.use(r.path, (req, res) => res.status(503).json({ error: 'Service temporarily unavailable' }));
    }
  }

  if (prisma) {
    app.get('/api/health/db', async (req, res) => {
      try {
        await prisma.$queryRaw`SELECT 1 as test`;
        const vehicles = await prisma.vehicle.count();
        const admins = await prisma.adminUser.count();
        res.json({ status: 'ok', db: 'connected', vehicles, admins });
      } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });
  }

  // Static files — must be after API routes
  app.use(express.static(path.join(__dirname, 'dist')));

  // SPA fallback — must be LAST
  app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('dist/index.html not found. Build may be missing.');
    }
  });
})();
