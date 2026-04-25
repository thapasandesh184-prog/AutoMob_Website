import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { prisma } from '../lib/prisma.js';
import { requireAuth, hashPassword } from '../lib/auth.js';
import { uploadToCloudinary } from '../lib/cloudinary.js';

const router = Router();

// Use disk storage for large files (videos can be 500MB+)
const upload = multer({
  storage: multer.diskStorage({
    destination: '/tmp',
    filename: (req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, unique + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB max
});

// All routes require auth
router.use(requireAuth);

// GET /api/admin/cars
router.get('/cars', async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: 'desc' },
      take: 1000,
    });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// Helper to generate unique slug
function generateSlug(year, make, model) {
  const base = `${year}-${make}-${model}`.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const suffix = Math.random().toString(36).substring(2, 8);
  return `${base}-${suffix}`;
}

// POST /api/admin/cars
router.post('/cars', async (req, res) => {
  try {
    const data = req.body;
    const features = Array.isArray(data.features) ? data.features.join(',') : data.features || '';
    const images = Array.isArray(data.images) ? data.images.join(',') : data.images || '';
    const slug = data.slug || generateSlug(data.year, data.make, data.model);

    const vehicle = await prisma.vehicle.create({
      data: {
        ...data,
        slug,
        features,
        images,
        year: Number(data.year),
        price: Number(data.price),
        mileage: Number(data.mileage),
        msrp: data.msrp ? Number(data.msrp) : null,
        doors: data.doors ? Number(data.doors) : null,
        seats: data.seats ? Number(data.seats) : null,
      },
    });
    res.status(201).json(vehicle);
  } catch (err) {
    console.error('Create vehicle error:', err);
    res.status(500).json({ error: 'Failed to create vehicle', detail: err.message });
  }
});

// GET /api/admin/cars/:id
router.get('/cars/:id', async (req, res) => {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: req.params.id },
    });
    if (!vehicle) return res.status(404).json({ error: 'Not found' });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch vehicle' });
  }
});

// PUT /api/admin/cars/:id
router.put('/cars/:id', async (req, res) => {
  try {
    const data = req.body;
    const updateData = { ...data };
    if (data.features) updateData.features = Array.isArray(data.features) ? data.features.join(',') : data.features;
    if (data.images) updateData.images = Array.isArray(data.images) ? data.images.join(',') : data.images;
    if (data.year) updateData.year = Number(data.year);
    if (data.price) updateData.price = Number(data.price);
    if (data.mileage) updateData.mileage = Number(data.mileage);
    
    const vehicle = await prisma.vehicle.update({
      where: { id: req.params.id },
      data: updateData,
    });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update vehicle' });
  }
});

// DELETE /api/admin/cars/:id
router.delete('/cars/:id', async (req, res) => {
  try {
    await prisma.vehicle.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete vehicle' });
  }
});

// GET /api/admin/submissions
router.get('/submissions', async (req, res) => {
  try {
    const { type } = req.query;
    let data;
    switch (type) {
      case 'contact': data = await prisma.contactSubmission.findMany({ orderBy: { createdAt: 'desc' } }); break;
      case 'finance': data = await prisma.financeApplication.findMany({ orderBy: { createdAt: 'desc' } }); break;
      case 'tradein': data = await prisma.tradeInSubmission.findMany({ orderBy: { createdAt: 'desc' } }); break;
      case 'appointments': data = await prisma.appointment.findMany({ orderBy: { createdAt: 'desc' } }); break;
      case 'carfinder': data = await prisma.carFinderRequest.findMany({ orderBy: { createdAt: 'desc' } }); break;
      default: return res.status(400).json({ error: 'Invalid type' });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// GET /api/admin/settings - return all settings as key-value object
router.get('/settings', async (req, res) => {
  try {
    const settings = await prisma.siteSetting.findMany();
    const mapped = Object.fromEntries(settings.map(s => [s.key, s.value]));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// POST /api/admin/settings - single setting upsert
router.post('/settings', async (req, res) => {
  try {
    const { key, value, group = 'general' } = req.body;
    const setting = await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value, group },
    });
    res.json(setting);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save setting' });
  }
});

// PUT /api/admin/settings - bulk update all settings
router.put('/settings', async (req, res) => {
  try {
    const payload = req.body;
    const results = [];
    for (const [key, value] of Object.entries(payload)) {
      const setting = await prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value), group: 'general' },
      });
      results.push(setting);
    }
    res.json({ success: true, count: results.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

// DELETE /api/admin/settings/:key
router.delete('/settings/:key', async (req, res) => {
  try {
    await prisma.siteSetting.delete({ where: { key: req.params.key } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete setting' });
  }
});

// POST /api/admin/upload - upload image or video to Cloudinary
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const fs = await import('fs');
    const fileBuffer = fs.readFileSync(req.file.path);
    const isVideo = req.file.mimetype.startsWith('video/');

    const result = await uploadToCloudinary(fileBuffer, {
      folder: 'skay-auto-group/admin',
      resource_type: isVideo ? 'video' : 'image',
    });

    // Clean up temp file
    try { fs.unlinkSync(req.file.path); } catch {}

    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed', detail: err.message });
  }
});

export default router;
