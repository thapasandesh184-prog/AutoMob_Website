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

// Load env vars
dotenv.config();

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
  try {
    const prismaMod = await import('./src/server/lib/prisma.js');
    prisma = prismaMod.prisma;
    logStartup('[PRISMA] Module loaded');
  } catch (err) {
    logStartup(`[PRISMA] Failed to load: ${err.message}`);
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

    prisma.$connect().then(() => {
      logStartup('[PRISMA] Database connected successfully');
    }).catch(err => {
      logStartup(`[PRISMA] DB connection failed: ${err.message}`);
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
