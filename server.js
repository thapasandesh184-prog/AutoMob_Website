import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import vehiclesRouter from './src/server/routes/vehicles.js';
import authRouter from './src/server/routes/auth.js';
import settingsRouter from './src/server/routes/settings.js';
import formsRouter from './src/server/routes/forms.js';
import adminRouter from './src/server/routes/admin.js';

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
app.use('/api/vehicles', vehiclesRouter);
app.use('/api/auth', authRouter);
app.use('/api/settings', settingsRouter);
app.use('/api', formsRouter);
app.use('/api/admin', adminRouter);

// Health check
app.get('/api/health', async (req, res) => {
  try {
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
