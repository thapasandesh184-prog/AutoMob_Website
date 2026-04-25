import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API routes
app.use('/api/vehicles', (await import('./src/server/routes/vehicles.js')).default);
app.use('/api/auth', (await import('./src/server/routes/auth.js')).default);
app.use('/api/settings', (await import('./src/server/routes/settings.js')).default);
app.use('/api', (await import('./src/server/routes/forms.js')).default);
app.use('/api/admin', (await import('./src/server/routes/admin.js')).default);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.$queryRaw`SELECT 1 as test`;
    const vehicles = await prisma.vehicle.count();
    const admins = await prisma.adminUser.count();
    await prisma.$disconnect();
    res.json({ status: 'ok', db: 'connected', vehicles, admins });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Static files
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[SERVER] SKay Auto Group running on port ${PORT}`);
  console.log(`[SERVER] Environment: ${process.env.NODE_ENV || 'development'}`);
});
