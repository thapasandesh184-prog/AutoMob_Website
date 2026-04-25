import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';

// Startup error log
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

// Debug: log env vars
logStartup(`[ENV] DATABASE_URL present: ${!!process.env.DATABASE_URL}`);
logStartup(`[ENV] JWT_SECRET present: ${!!process.env.JWT_SECRET}`);
logStartup(`[ENV] NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
logStartup(`[ENV] CLOUDINARY_CLOUD_NAME present: ${!!process.env.CLOUDINARY_CLOUD_NAME}`);
logStartup(`[ENV] CLOUDINARY_API_KEY present: ${!!process.env.CLOUDINARY_API_KEY}`);
logStartup(`[ENV] CLOUDINARY_API_SECRET present: ${!!process.env.CLOUDINARY_API_SECRET}`);

// ─── STATIC FILES (mount IMMEDIATELY — don't wait for DB) ───
const distPath = path.join(__dirname, 'dist');
logStartup(`[STATIC] Serving from: ${distPath}`);
logStartup(`[STATIC] dist/index.html exists: ${fs.existsSync(path.join(distPath, 'index.html'))}`);
logStartup(`[STATIC] dist/assets exists: ${fs.existsSync(path.join(distPath, 'assets'))}`);

app.use(express.static(distPath));

// ─── SPA FALLBACK (must be after static, exclude API routes) ───
app.get(/^(?!\/api\/)/, (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).type('text/plain').send('dist/index.html not found. Build may be missing.');
  }
});

// ─── HEALTH CHECK ───
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: Date.now(), env: process.env.NODE_ENV || 'development' });
});

// ─── ROBOTS.TXT ───
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: https://skayautogroup.ca/sitemap.xml
`);
});

// ─── SITEMAP.XML ───
app.get('/sitemap.xml', async (req, res) => {
  try {
    const { query } = await import('./src/server/lib/db.js');
    const vehicles = await query(
      "SELECT slug, updatedAt FROM Vehicle WHERE status = 'available'"
    );

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
      lastmod: v.updatedAt ? new Date(v.updatedAt).toISOString().split('T')[0] : '',
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

// ─── UPLOAD (mounted immediately — no DB needed) ───
import multer from 'multer';
import { uploadToCloudinary } from './src/server/lib/cloudinary.js';

const upload = multer({
  storage: multer.diskStorage({
    destination: '/tmp',
    filename: (req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, unique + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 500 * 1024 * 1024 },
});

app.post('/api/admin/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });
    const isVideo = req.file.mimetype.startsWith('video/');
    const result = await uploadToCloudinary(req.file.path, {
      folder: 'skay-auto-group/admin',
      resource_type: isVideo ? 'video' : 'image',
    });
    try { fs.unlinkSync(req.file.path); } catch {}
    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    console.error('Upload error:', err.message, err.stack);
    res.status(500).json({ error: 'Upload failed', detail: err.message });
  }
});

// Public upload endpoint for forms (sell-your-car, trade-in)
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });
    const isVideo = req.file.mimetype.startsWith('video/');
    const result = await uploadToCloudinary(req.file.path, {
      folder: 'skay-auto-group/public',
      resource_type: isVideo ? 'video' : 'image',
    });
    try { fs.unlinkSync(req.file.path); } catch {}
    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    console.error('Public upload error:', err.message, err.stack);
    res.status(500).json({ error: 'Upload failed', detail: err.message });
  }
});

// ─── SETUP ENDPOINTS ───
app.get('/api/setup/check', async (req, res) => {
  try {
    const { queryOne } = await import('./src/server/lib/db.js');
    const v = await queryOne('SELECT COUNT(*) as count FROM Vehicle');
    const a = await queryOne('SELECT COUNT(*) as count FROM AdminUser');
    res.json({ initialized: true, vehicles: v?.count || 0, admins: a?.count || 0 });
  } catch (err) {
    res.json({ initialized: false, error: err.message });
  }
});

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
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/setup/seed', async (req, res) => {
  const secret = req.headers['x-setup-secret'] || req.body?.secret;
  if (secret !== process.env.SETUP_SECRET) {
    return res.status(403).json({ error: 'Invalid setup secret' });
  }
  try {
    const { queryOne, insert, generateId } = await import('./src/server/lib/db.js');
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
      const existing = await queryOne('SELECT id FROM SiteSetting WHERE `key` = ?', [s.key]);
      if (existing) {
        await import('./src/server/lib/db.js').then(m => m.query('UPDATE SiteSetting SET `value` = ?, updatedAt = NOW() WHERE `key` = ?', [s.value, s.key]));
      } else {
        const id = generateId();
        await insert('INSERT INTO SiteSetting (id, `key`, `value`, `group`) VALUES (?, ?, ?, ?)', [id, s.key, s.value, s.group]);
      }
    }
    res.json({ success: true, message: 'Default settings seeded' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── API STARTUP GUARD ───
// Returns 503 for /api/* while DB routes are still loading in background.
// Real routes (mounted below in async IIFE) take over once ready.
let apiRoutesReady = false;
app.use('/api', (req, res, next) => {
  if (!apiRoutesReady) {
    return res.status(503).json({ error: 'Server initializing, please retry.' });
  }
  next();
});

// ─── START SERVER ───
app.listen(PORT, () => {
  logStartup(`[SERVER] SKay Auto Group running on port ${PORT}`);
  logStartup(`[SERVER] Environment: ${process.env.NODE_ENV || 'development'}`);
});

// ─── LOAD API ROUTES IN BACKGROUND ───
(async () => {
  let dbConnected = false;
  try {
    const { pool } = await import('./src/server/lib/db.js');
    const conn = await pool.getConnection();
    await conn.query('SELECT 1 as test');
    conn.release();
    dbConnected = true;
    logStartup('[DB] MySQL pool connected successfully');
  } catch (err) {
    logStartup(`[DB] Failed to connect: ${err.message}`);
  }

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

  if (dbConnected) {
    app.get('/api/health/db', async (req, res) => {
      try {
        const { queryOne } = await import('./src/server/lib/db.js');
        const v = await queryOne('SELECT COUNT(*) as count FROM Vehicle');
        const a = await queryOne('SELECT COUNT(*) as count FROM AdminUser');
        res.json({ status: 'ok', db: 'connected', vehicles: v?.count || 0, admins: a?.count || 0 });
      } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    });
  }

  apiRoutesReady = true;
  logStartup(`[INIT] Server fully initialized (DB: ${dbConnected ? 'HEALTHY' : 'UNAVAILABLE'})`);
})();
